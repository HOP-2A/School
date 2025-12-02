"use client";
import { Input } from "@/components/ui/input";
import HeaderPart from "../_component/Header";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";

const Home = () => {
  const [inputs, setInputs] = useState({
    firstname: "",
    password: "",
    email: "",
    personalId: "",
  });

  const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const SignUp = async () => {
    const res = await fetch("/api/student/signup", {
      method: "POST",
      body: JSON.stringify({
        firstname: inputs.firstname,
        password: inputs.password,
        email: inputs.email,
        personalId: inputs.personalId,
      }),
    });

    if (res.ok) {
      const JsonRes = await res.json();
      localStorage.setItem("token", JsonRes);
    }
  };

  return (
    <div className="flex flex-col">
      <div>
        <HeaderPart />
      </div>
      <div className="flex">
        <div className="flex flex-col">
          <div>
            <img
              className="w-180 h-120 rounded-2xl shadow-2xl m-5"
              src="https://cdn.dribbble.com/userupload/18195011/file/original-62a17542a4015c1ec36406cd609fe83f.png?resize=2400x1920&vertical=center"
            />
          </div>

          <div className="flex flex-col gap-1 w-180 mx-5">
            <div className="text-[30px] font-bold text-center">
              Connect, Manage, Send faster with Nexa
            </div>
            <div className="text-[18px] font-medium text-gray-500 text-center">
              Connect, create, and succeed — a smarter way for teachers to teach
              and students to learn.
            </div>
            <button className="relative inline-flex items-center justify-center px-6 py-3 mt-1 font-medium text-white bg-linear-to-r from-blue-400 to-purple-400 rounded-lg shadow-lg overflow-hidden group">
              <span className="absolute inset-0 w-full h-full from-purple-300 to-blue-400 opacity-30 blur transition-all duration-500 group-hover:opacity-70"></span>
              <span className="relative z-10">Learn More</span>
              <span className="absolute bottom-0 left-0 w-0 h-1 bg-white transition-all duration-500 group-hover:w-full"></span>
            </button>
          </div>
        </div>
        <div className="flex flex-col bg-linear-to-r from-purple-400 to-blue-400 text-white rounded-xl p-8 m-5 text-center shadow-lg w-180">
          <h2 className="text-3xl font-bold mb-2">Join Us!</h2>
          <p className="text-lg mb-4">
            Connect, learn, and grow with our community.
          </p>
          <div className="border border-white rounded m-5 p-5">
            <div className="rounded p-1 my-4 bg-blue-400 text-start w-30">
              Student
            </div>
            <div className="flex gap-3">
              <div className="flex flex-col gap-2">
                <Input
                  value={inputs.firstname}
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                  name="firstname"
                  className="w-70 text-white"
                  placeholder="Enter firstname..."
                />
                <Input
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                  value={inputs.personalId}
                  name="personalId"
                  className="w-70 text-white"
                  placeholder="Enter student id..."
                />
                <Input
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                  className="w-70 text-white"
                  placeholder="Enter email..."
                  value={inputs.email}
                  name="email"
                />
                <Input
                  onChange={(e) => {
                    handleInputs(e);
                  }}
                  className="w-70 text-white"
                  placeholder="Enter password..."
                  value={inputs.password}
                  name="password"
                />
              </div>
              <div className="bg-white text-black font-medium rounded w-70 p-5 flex items-center">
                You are now signing in as a student
              </div>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                SignUp();
              }}
              className="text-white shadow-2xl w-full mt-4"
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
