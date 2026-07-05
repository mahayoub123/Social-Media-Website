
import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


async function readDB() {
  try {
    const data = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB file, returning empty structure:', error);
    return { users: [], posts: [], currentUser: null };
  }
}


async function writeDB(data) {
  try {
    await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing to DB file:', error);
  }
}


app.get('/api/posts', async (req, res) => {
  const db = await readDB();
  const sortedPosts = [...db.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sortedPosts);
});


app.post('/api/posts', async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Post content cannot be empty' });
  }

  const db = await readDB();
  const currentUser = db.currentUser;

  const newPost = {
    id: Date.now().toString(),
    userId: currentUser.id,
    author: currentUser.name,
    username: currentUser.username,
    avatar: currentUser.avatar,
    content: content,
    createdAt: new Date().toISOString()
  };

  db.posts.push(newPost);
  await writeDB(db);
  res.status(201).json(newPost);
});


app.put('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Post content cannot be empty' });
  }

  const db = await readDB();
  const postIndex = db.posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }


  if (db.posts[postIndex].userId !== db.currentUser.id) {
    return res.status(403).json({ error: 'Not allowed to edit this post' });
  }

  db.posts[postIndex].content = content;
  await writeDB(db);
  res.json(db.posts[postIndex]);
});


app.delete('/api/posts/:id', async (req, res) => {
  const { id } = req.params;
  const db = await readDB();

  const postIndex = db.posts.findIndex(p => p.id === id);

  if (postIndex === -1) {
    return res.status(404).json({ error: 'Post not found' });
  }

  if (db.posts[postIndex].userId !== db.currentUser.id) {
    return res.status(403).json({ error: 'Not allowed to delete this post' });
  }

  db.posts.splice(postIndex, 1);
  await writeDB(db);
  res.json({ message: 'Post deleted successfully', id });
});


app.get('/api/users', async (req, res) => {
  const db = await readDB();
  res.json(db.users);
});


app.get('/api/me', async (req, res) => {
  const db = await readDB();
  res.json(db.currentUser);
});


app.post('/api/users/:id/toggle-follow', async (req, res) => {
  const { id: targetId } = req.params;
  const db = await readDB();
  const currentUserId = db.currentUser.id;

  if (targetId === currentUserId) {
    return res.status(400).json({ error: 'You cannot follow yourself!' });
  }

  const currentUserIndex = db.users.findIndex(u => u.id === currentUserId);
  const targetUserIndex = db.users.findIndex(u => u.id === targetId);

  if (currentUserIndex === -1 || targetUserIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const currentUser = db.users[currentUserIndex];
  const targetUser = db.users[targetUserIndex];

  const isFollowing = currentUser.following.includes(targetId);

  if (isFollowing) {

    currentUser.following = currentUser.following.filter(id => id !== targetId);
    targetUser.followers = targetUser.followers.filter(id => id !== currentUserId);
  } else {

    currentUser.following.push(targetId);
    targetUser.followers.push(currentUserId);
  }


  db.currentUser = currentUser;

  await writeDB(db);

  res.json({
    currentUser,
    targetUser,
    isFollowing: !isFollowing
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
