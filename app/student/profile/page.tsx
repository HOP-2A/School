"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/provider/AuthProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const { user, token } = useUser();
  const [studentInfo, setStudentInfo] = useState<any>([]);

  const fetchStudentInformation = async () => {
      const res = await fetch(`/api/student/profile/${user?.data.id}`, {
        method: "GET",
      });
      const data = await res.json();
      setStudentInfo(data);
  };

  useEffect(() => {
      fetchStudentInformation();
    
  }, [token]);
const router = useRouter()
console.log(studentInfo)
return (
  <div className="min-h-screen flex bg-gray-50">
 
    <div className="w-52 bg-gray-800 text-white flex flex-col">
      <div
        className="p-5 flex flex-col items-center border-b border-gray-700 cursor-pointer"
        onClick={() => {
          router.push("profile");
        }}
      >
        <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
          {user?.data?.name?.[0]?.toUpperCase() || "?"}
        </div>
        <div className="mt-3 text-lg font-semibold">{user?.data?.name}</div>
        <div className="text-sm text-gray-300">{user?.data?.email}</div>
      </div>

      <nav className="flex-1 mt-6 px-3">
        <ul className="space-y-2">
          <li>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition">
              Dashboard
            </button>
          </li>
          <li>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition">
              My Classes
            </button>
          </li>
          <li>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition">
              Settings
            </button>
          </li>
          <li>
            <button className="w-full text-left px-3 py-2 rounded hover:bg-gray-700 transition">
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </div>

    
    <div className="flex-1 p-10">
      <div className="max-w-3xl bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden mx-auto">
     
        <div className="flex items-center gap-6 p-6 border-b border-gray-200">
          <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-semibold text-gray-700">
            {studentInfo.name?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{studentInfo.name}</h1>
            <p className="text-gray-500">{studentInfo.email}</p>
          </div>
        </div>

       
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h2 className="text-gray-600 font-medium">Student ID</h2>
              <p className="text-gray-800">{studentInfo.studentId}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h2 className="text-gray-600 font-medium">Class ID</h2>
              <p className="text-gray-800">{studentInfo.classId || "Not assigned"}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h2 className="text-gray-600 font-medium">Joined At</h2>
              <p className="text-gray-800">
                {new Date(studentInfo.createdAt).toLocaleDateString()}
              </p>
            </div>
          
          </div>

      
          <div className="flex gap-3 mt-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Send Message
            </button>
            <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition">
              View Grades
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);


};
export default Page;