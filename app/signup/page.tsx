"use client";
import { Input } from "@/components/ui/input";
import HeaderPart from "../_component/Header";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter()
  const [inputs, setInputs] = useState({
    firstname: "",
    password: "",
    email: "",
    role: "",
  });

  const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setInputs((prev) => ({
      ...prev,
      role: value,
    }));
  };

  const SignUp = async () => {
    const res = await fetch("/api/signup", {
      method: "POST",
      body: JSON.stringify({
        firstname: inputs.firstname,
        password: inputs.password,
        email: inputs.email,
        role: inputs.role,
      }),
    });

    if (res.ok) {
      toast.success("Successfully created user, now please sign in");
      router.push("https://stirred-mastiff-2.accounts.dev/sign-in")
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <HeaderPart />
  
      {/* MAIN */}
      <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-10 px-4 py-10">
        {/* LEFT */}
        <div className="flex flex-col items-center max-w-xl w-full">
          <img
            className="w-full max-w-xl h-auto rounded-2xl shadow-2xl mb-6"
            src="https://cdn.dribbble.com/userupload/18195011/file/original-62a17542a4015c1ec36406cd609fe83f.png?resize=2400x1920&vertical=center"
            alt="Hero"
          />
  
          <div className="text-center space-y-3">
            <h1 className="text-2xl sm:text-3xl font-bold">
              Connect, Manage, Send faster with Nexa
            </h1>
            <p className="text-base sm:text-lg text-gray-500">
              Connect, create, and succeed — a smarter way for teachers to teach
              and students to learn.
            </p>
  
            <button className="relative inline-flex items-center justify-center px-6 py-3 mt-4 font-medium text-white bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg shadow-lg overflow-hidden group mx-auto">
              <span className="absolute inset-0 opacity-30 blur transition-all duration-500 group-hover:opacity-70 bg-gradient-to-r from-purple-300 to-blue-400"></span>
            
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-500 group-hover:w-full"></span>
            </button>
          </div>
        </div>
  
        {/* RIGHT */}
        <div className="w-full max-w-xl bg-gradient-to-r from-purple-400 to-blue-400 text-white rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Join Us!
          </h2>
          <p className="text-center mb-6 text-base sm:text-lg">
            Connect, learn, and grow with our community.
          </p>
  
          <div className="border border-white/40 rounded-xl p-5 space-y-5">
            {/* ROLE SELECTOR */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Choose your role
              </label>
  
              <div className="flex bg-white/20 rounded-lg p-1">
                {["STUDENT", "TEACHER"].map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() =>
                      handleSelect({
                        target: { name: "role", value: role },
                      } as any)
                    }
                    className={`flex-1 py-2 rounded-md text-sm font-semibold transition-all
                      ${
                        inputs.role === role
                          ? "bg-white text-purple-600 shadow"
                          : "text-white hover:bg-white/20"
                      }`}
                  >
                    {role === "STUDENT" ? "Student" : "Teacher"}
                  </button>
                ))}
              </div>
            </div>
  
            {/* INPUTS */}
            <div className="flex flex-col gap-4">
              <Input
                name="firstname"
                value={inputs.firstname}
                onChange={handleInputs}
                placeholder="First name"
                className="w-full h-11 rounded-md bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-4 outline-none transition focus:ring-2 focus:ring-white/80"
              />
  
              <Input
                name="email"
                value={inputs.email}
                onChange={handleInputs}
                placeholder="Email address"
                className="w-full h-11 rounded-md bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-4 outline-none transition focus:ring-2 focus:ring-white/80"
              />
  
              <Input
                type="password"
                name="password"
                value={inputs.password}
                onChange={handleInputs}
                placeholder="Password"
                className="w-full h-11 rounded-md bg-white/20 backdrop-blur-sm text-white placeholder-white/70 px-4 outline-none transition focus:ring-2 focus:ring-white/80"
              />
            </div>
  
            {/* INFO BOX */}
            <div className="bg-white text-black font-medium rounded-lg p-4 text-center">
              You are signing up as a{" "}
              <span className="font-bold text-purple-600">
                {inputs.role === "STUDENT" ? "Student" : "Teacher"}
              </span>
            </div>
  
            {/* SUBMIT */}
            <Button
              variant="secondary"
              onClick={SignUp}
              className="w-full text-white shadow-xl"
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
  

  
};

export default Home;
