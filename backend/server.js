import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'data', 'db.json');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------
// Helpers
// ---------------------------------------------------------

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


function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const { hash } = hashPassword(password, salt);
  return hash === expectedHash;
}


function toSafeUser(user) {
  if (!user) return null;
  const { password, salt, ...safeUser } = user;
  return safeUser;
}

async function requireAuth(req, res, next) {
  const db = await readDB();
  if (!db.currentUser) {
    return res.status(401).json({ error: 'You must be logged in to perform this action' });
  }
  req.db = db;
  next();
}

// ---------------------------------------------------------
// Auth: Sign up / Sign in / Logout
// ---------------------------------------------------------

app.post('/api/signup', async (req, res) => {
  const { name, username, password, avatar } = req.body;

  if (!name || !username || !password) {
    return res.status(400).json({ error: 'Name, username and password are required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long' });
  }

  const db = await readDB();

  const usernameTaken = db.users.some(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );
  if (usernameTaken) {
    return res.status(409).json({ error: 'Username is already taken' });
  }

  const { salt, hash } = hashPassword(password);

  const newUser = {
    id: Date.now().toString(),
    name,
    username,
    avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
    password: hash,
    salt,
    following: [],
    followers: []
  };

  db.users.push(newUser);
  db.currentUser = newUser;
  await writeDB(db);

  res.status(201).json(toSafeUser(newUser));
});

app.post('/api/signin', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'You must enter a username and password' });
  }

  const db = await readDB();
  const user = db.users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (!user || !verifyPassword(password, user.salt, user.password)) {
    return res.status(401).json({ error: 'Username or password is incorrect' });
  }

  db.currentUser = user;
  await writeDB(db);

  res.json(toSafeUser(user));
});

app.post('/api/logout', async (req, res) => {
  const db = await readDB();
  db.currentUser = null;
  await writeDB(db);
  res.json({ message: 'You have been logged out successfully' });
});

// ---------------------------------------------------------
// Posts
// ---------------------------------------------------------

app.get('/api/posts', async (req, res) => {
  const db = await readDB();
  const sortedPosts = [...db.posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json(sortedPosts);
});

app.post('/api/posts', requireAuth, async (req, res) => {
  const { content } = req.body;
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Post content cannot be empty' });
  }

  const db = req.db;
  const currentUser = db.currentUser;

  const newPost = {
    id: Date.now().toString(),
    userId: currentUser.id,
    author: currentUser.name,
    username: currentUser.username,
    avatar: currentUser.avatar,
    content,
    createdAt: new Date().toISOString()
  };

  db.posts.push(newPost);
  await writeDB(db);
  res.status(201).json(newPost);
});

app.put('/api/posts/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Post content cannot be empty' });
  }

  const db = req.db;
  const postIndex = db.posts.findIndex((p) => p.id === id);

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

app.delete('/api/posts/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const db = req.db;

  const postIndex = db.posts.findIndex((p) => p.id === id);

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

// ---------------------------------------------------------
// Users
// ---------------------------------------------------------

app.get('/api/users', async (req, res) => {
  const db = await readDB();
  res.json(db.users.map(toSafeUser));
});

app.get('/api/me', async (req, res) => {
  const db = await readDB();
  if (!db.currentUser) {
    return res.status(401).json({ error: 'غير مسجل دخول' });
  }
  res.json(toSafeUser(db.currentUser));
});

app.post('/api/users/:id/toggle-follow', requireAuth, async (req, res) => {
  const { id: targetId } = req.params;
  const db = req.db;
  const currentUserId = db.currentUser.id;

  if (targetId === currentUserId) {
    return res.status(400).json({ error: 'You cannot follow yourself!' });
  }

  const currentUserIndex = db.users.findIndex((u) => u.id === currentUserId);
  const targetUserIndex = db.users.findIndex((u) => u.id === targetId);

  if (currentUserIndex === -1 || targetUserIndex === -1) {
    return res.status(404).json({ error: 'User not found' });
  }

  const currentUser = db.users[currentUserIndex];
  const targetUser = db.users[targetUserIndex];

  const isFollowing = currentUser.following.includes(targetId);

  if (isFollowing) {
    currentUser.following = currentUser.following.filter((id) => id !== targetId);
    targetUser.followers = targetUser.followers.filter((id) => id !== currentUserId);
  } else {
    currentUser.following.push(targetId);
    targetUser.followers.push(currentUserId);
  }

  db.currentUser = currentUser;
  await writeDB(db);

  res.json({
    currentUser: toSafeUser(currentUser),
    targetUser: toSafeUser(targetUser),
    isFollowing: !isFollowing
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});