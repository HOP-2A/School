"use client"
import { useUser } from "@/provider/AuthProvider"
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
    const {user,token} = useUser()
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
        if (!token) {
          router.push("/student/login");
        }
      }, [token]);

console.log(user?.data)
return (
    <div className="flex min-h-screen bg-gray-100">

      <div className="w-52 bg-gray-800 text-white flex flex-col" onClick={()=>{
        router.push("profile")
      }}>
       
        <div className="p-5 flex flex-col items-center border-b border-gray-700">
          <div className="w-16 h-16 rounded-full bg-indigo-500 flex items-center justify-center text-white text-2xl font-bold">
            {user?.data?.name?.[0]}
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

 
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">My Classes</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {subjects.map((subject, index) => (
            <div
              key={index}
              onClick={() => router.push(`/student/dashboard/${subject.id}`)}
              className="rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow cursor-pointer border border-gray-200"
            >
              <div className="h-28 w-full rounded-t-xl bg-gradient-to-r from-indigo-500 to-indigo-600"></div>
              <div className="p-4">
                <div className="text-xl font-semibold text-gray-800">
                  {subject.subjectName}
                </div>
                <div className="text-gray-500 mt-1 text-sm">Class · Section</div>

                <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                  <button className="hover:text-indigo-600">Open</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}


export default Page