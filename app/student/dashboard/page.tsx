"use client"

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
type Subject = {
    id: string;
    email: string;
    password: string;
    subjectName: string;

  };
  
const Page =()=>{
    const router = useRouter()
    const {user} = useUser()
    const [subjects, setSubjects] = useState<Subject[]>([])
    const displaySubject = async()=>{
        const res = await fetch("/api/subject",{
            method:"GET",
        })
        const response = await res.json()
        setSubjects(response)
       
    }
    useEffect(() => {
        displaySubject()
     
      }, []);
console.log(subjects)
console.log(user)
return (
    <div className="flex h-screen bg-gray-100">
      
      {/* LEFT SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-blue-600">LMS</h1>

        <nav className="flex flex-col gap-3">
          <button className="text-left p-3 rounded-xl hover:bg-gray-100">🏠 Home</button>
          <button className="text-left p-3 rounded-xl hover:bg-gray-100">📚 Classrooms</button>
          <button className="text-left p-3 rounded-xl hover:bg-gray-100">👤 Profile</button>
        </nav>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-6">Your Subjects</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => router.push(`dashboard/${subject.id}`)}
              className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold">{subject.subjectName}</h3>
              <p className="text-gray-500 mt-2">Click to enter classroom →</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}


export default Page