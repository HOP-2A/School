"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

const Page = () => {
  const { user } = useUser();
  const router = useRouter();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });

  const handleValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "email") {
      setInput({ ...input, email: value });
    }
    if (id === "password") {
      setInput({ ...input, password: value });
    }
  };
  const login = async () => {
    const response = await fetch("/api/student/login", {
      method: "POST",
      body: JSON.stringify({
        email: input.email,
        password: input.password,
      }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-800">
          Student Login
        </h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                handleValue(e);
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              onChange={(e) => {
                handleValue(e);
              }}
            />
          </div>

          <button
            type="submit"
            onClick={login}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-200"
          >
            Login
          </button>
        </div>

        <div className="text-center text-gray-500 text-sm">
          Don’t have an account?
          <div className="flex justify-between">
            <div>
              <a href="/signup" className="text-blue-600 hover:underline">
                Sign Up
              </a>
            </div>
            <div>
              <a
                href="/teacher/login"
                className="text-green-600 hover:underline"
              >
                Teacher's login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Page;
