"use client"

import { useUser } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
type Subject= {
    subjectName :string
    teacher:{
        name:string
        email:string
    }


}
const Page=()=>{
    const {user} = useUser()
    const router = useRouter()
    const params = useParams()
    const [subjectInfo, setSubjectInfo] = useState<Subject |     null>(null)

    const subjectId = params.subjectId
    const getSubjectInfo =async ()=>{
const res= await fetch(`http://localhost:3000/api/subject/unique/${subjectId}`,{
    method:"GET"
})
const response = await res.json()
setSubjectInfo(response)

    }
   
    
console.log(subjectInfo)
  useEffect(() => {
        getSubjectInfo()
    
        if (!user) {
          router.push("/student/login");
        }
      }, [user]);
    if (!subjectInfo) return <div className="p-10 text-gray-500">Loading...</div>;

  const { subjectName, teacher } = subjectInfo;

  return (
    <div className="min-h-screen p-10 bg-gray-100 flex flex-col gap-10">

     
      <div>
        <h1 className="text-4xl font-bold text-gray-900">{subjectName}</h1>
        <p className="text-gray-500 mt-1 text-lg">
          Welcome to your course dashboard
        </p>
      </div>

    
      <div className="bg-white shadow-md rounded-2xl p-6 max-w-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-3">Teacher</h2>

        <div className="flex items-center gap-4">
      
          <div className="w-14 h-14 bg-blue-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
            {teacher.name.charAt(0)}
          </div>

          <div>
            <p className="text-lg font-medium">{teacher.name}</p>
            <p className="text-gray-600">{teacher.email}</p>
          </div>
        </div>
      </div>

    
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <h2 className="text-3xl font-semibold mb-6">Homework</h2>

       
      </div>
    </div>)
}
export default Page