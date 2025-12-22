"use client";

import { ChangeEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const AdminSignUp = () => {
  const [form, setForm] = useState({
    name: "",
    password: "",
    Id: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const SignUp = async () => {
    const res = await fetch("/api/admin/signup", {
      method: "POST",
      body: JSON.stringify({
        firstname: form.name,
        password: form.password,
        role: "ADMIN",
        id: form.Id,
      }),
    });

    if (res.ok) {
      console.log("ok");
    } else {
      console.log("errorr");
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
      <Card className="w-full h-130 max-w-md p-10 rounded-3xl shadow-xl bg-white mt-50">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-gray-800">
          Admin Sign Up
        </h2>

        <div className="space-y-5">
          <div>
            <Label htmlFor="name" className="text-gray-700 font-medium">
              First Name
            </Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-gray-700 font-medium">
              Admin Id
            </Label>
            <Input
              type="Id"
              id="Id"
              name="Id"
              value={form.Id}
              onChange={handleChange}
              placeholder="admin@example.com"
              className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-gray-700 font-medium">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="rounded-xl border-gray-300 focus:ring-2 focus:ring-purple-400 focus:border-transparent"
            />
          </div>
          <Button
            onClick={() => {
              SignUp();
            }}
            className="w-full bg-gradient-to-r bg-gray-700 text-white font-bold py-3 rounded-2xl shadow-lg hover:from-purple-600 hover:to-pink-600 transition"
          >
            Sign Up
          </Button>
        </div>

        <p className="text-sm text-gray-500 mt-5 text-center">
          Already have an account?{" "}
          <span className="text-purple-500 cursor-pointer font-semibold">
            Login
          </span>
        </p>
      </Card>
    </div>
  );
};

export default AdminSignUp;
