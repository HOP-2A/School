"use client"
import { useUser } from "@/provider/AuthProvider"
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
    const {token} = useUser()
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
   
    

  useEffect(() => {
        getSubjectInfo()
    
        if (!token) {
          router.push("/student/login");
        }
      }, [token]);
      return (
        <div className="w-full min-h-screen bg-gray-100">
        
          <div className="w-full h-48 bg-green-600 text-white flex flex-col justify-center px-10">
            <h1 className="text-4xl font-bold">{subjectInfo?.subjectName}</h1>
            <p className="text-lg mt-2">Classroom • {subjectInfo?.teacher?.name}</p>
          </div>
    
          <div className="max-w-5xl mx-auto mt-6 px-4 gap-6 grid grid-cols-1 md:grid-cols-3">
    
            
            <div className="col-span-1 space-y-4">
    
              <div className="bg-white rounded-xl p-4 shadow">
                <h2 className="text-xl font-semibold mb-3">Teacher</h2>
                <div className="flex items-center gap-3">
                 
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center text-white text-xl">
                    {subjectInfo?.teacher?.name[0]}
                  </div>
    
                  <div>
                    <p className="font-semibold text-lg">
                      {subjectInfo?.teacher?.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {subjectInfo?.teacher?.email}
                    </p>
                  </div>
                </div>
              </div>
    
              
              <div className="bg-white rounded-xl p-4 shadow">
                <h2 className="text-xl font-semibold mb-2">About this subject</h2>
                <p className="text-gray-700">
                
                  Welcome to {subjectInfo?.subjectName}. All instructions, homework, and updates will appear here.
                </p>
              </div>
            </div>
    
            
            <div className="col-span-2">
              <div className="bg-white rounded-xl p-4 shadow">
                <h2 className="text-xl font-semibold mb-4">Homework</h2>
    
             
                <p className="text-gray-600">No homework has been assigned yet.</p>
              </div>
            </div>
          </div>
        </div>
      );
}
export default Page