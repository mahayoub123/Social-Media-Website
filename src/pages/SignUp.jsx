import { Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function SignUp() {
    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">

            <div className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl">

                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
                        Create Account
                    </h1>

                    <p className="text-slate-400 mt-3">
                        Join Cobtact today
                    </p>
                </div>

                <form className="space-y-5">

                    <div>
                        <label className="text-slate-300 text-sm">
                            Full Name
                        </label>

                        <input
                            type="text"
                            placeholder="John Doe"
                            className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                        />
                    </div>

                    <div>
                        <label className="text-slate-300 text-sm">
                            Username
                        </label>

                        <input
                            type="text"
                            placeholder="@username"
                            className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                        />
                    </div>

                    <div>
                        <label className="text-slate-300 text-sm">
                            Email
                        </label>

                        <input
                            type="email"
                            placeholder="example@email.com"
                            className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                        />
                    </div>

                    <div>
                        <label className="text-slate-300 text-sm">
                            Password
                        </label>

                        <input
                            type="password"
                            placeholder="********"
                            className="mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
                        />
                    </div>

                    <button
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold flex justify-center items-center gap-2 hover:scale-[1.02] transition"
                    >
                        <UserPlus size={18} />
                        Create Account
                    </button>

                </form>

                <p className="text-center text-slate-400 mt-6">
                    Already have an account?{" "}
                    <Link
                        to="/signin"
                        className="text-purple-400 hover:text-pink-400"
                    >
                        Sign In
                    </Link>
                </p>

            </div>
        </div>
    );
}