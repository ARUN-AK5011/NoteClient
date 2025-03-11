"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "../../Utils/Api";
import { motion } from "framer-motion";
import { User, Mail, Lock, UserPlus } from "lucide-react";

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await signup({
        user_name: userName,
        user_email: email,
        password,
      });
      if (data.message === "User registered successfully") {
        const user = data.user;
        console.log("User info", data);
        localStorage.setItem("user_id", user.user_id);
        localStorage.setItem("user_name", user.user_name);
        localStorage.setItem("user_email", user.user_email);
        alert("🎉 Signup successful! Redirecting to home...");
        router.push("/Home");
      } else if (data.message === "Email already exists") {
        alert("❌ " + "Email Already Exist! Use other email.");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("❌ Signup failed! Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white p-8 shadow-xl rounded-2xl w-96"
      >
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col items-center"
        >
          <UserPlus size={50} className="text-blue-500" />
          <h2 className="text-3xl font-extrabold mt-2 text-gray-800">
            Sign Up 🚀
          </h2>
          <p className="text-gray-500 text-sm">
            Join and take notes like a pro!
          </p>
        </motion.div>

        <form onSubmit={handleSignup} className="mt-6 space-y-4">
          <motion.div whileFocus={{ scale: 1.05 }} className="relative">
            <User className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Username"
              className="text-black w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.05 }} className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              className="text-black w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </motion.div>

          <motion.div whileFocus={{ scale: 1.05 }} className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              className="text-black w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600"
          >
            🚀 Create Account
          </motion.button>
        </form>

        <p className="text-center text-gray-600 text-sm mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/")}
          >
            Login here
          </span>
        </p>
      </motion.div>
    </div>
  );
}
