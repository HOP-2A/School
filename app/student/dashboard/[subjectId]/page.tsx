"use client"

import { useAuth } from "@/app/provider/AuthProvider"
import { useUser } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
type Subject= {
    subjectName :string
    teacher:{
        name:string
        email:string
    }
id:string

}
type AssignmentsType = {
  classId: string;
  createdAt: string;
  description: string;
  dueDate: string;
  id: string;
  teacherId: string;
  title: string;
  teacher:{
    id:string;
    subject:{
      id:string
    }
  }
};
const Page=()=>{
const router = useRouter()
    const params = useParams()
    const [subjectInfo, setSubjectInfo] = useState<Subject |     null>(null)
  
const { user: clerkUser } = useUser();
 const [assignments, setAssignments] = useState<AssignmentsType[]>();
  const { user } = useAuth(clerkUser?.id);
    const subjectId = params.subjectId
    const getSubjectInfo =async ()=>{
const res= await fetch(`http://localhost:3000/api/subject/unique/${subjectId}`,{
    method:"GET"
})
const response = await res.json()
setSubjectInfo(response)

    }
   const GetAssignments = async () => {
    const res = await fetch(`/api/homework/certainSubject/${user?.classId}`, {
      method: "POST",
      body: JSON.stringify({
        classId: user?.classId
      }),
    });

    if (res.ok) {
      const JsonData = await res.json();
      setAssignments(JsonData);
    }
  };
 
  useEffect(() => {
    if(user){
        getSubjectInfo()
     GetAssignments()}
       
      }, [user]);
    if (!subjectInfo) return <div className="p-10 text-gray-500">Loading...</div>;

  const { subjectName, teacher } = subjectInfo;
const filterred = assignments?.filter((assignment)=>{
  return assignment?.teacher?.subject?.id === subjectId
})
console.log(filterred, "data")
  return (
  <div className="min-h-screen bg-gray-100 flex">

    <div className="w-64 bg-white shadow-lg p-5 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blue-600">LMS</h1>

      <nav className="flex flex-col gap-3">
        <button
          className="text-left p-3 rounded-xl hover:bg-gray-100 transition"
          onClick={() => router.push(`/student/dashboard`)}
        >
          🏠 Home
        </button>

        <button
          className="text-left p-3 rounded-xl hover:bg-gray-100 transition"
          onClick={() => router.push(`/student/classroom/${user?.classId}`)}
        >
          📚 All Homeworks
        </button>

        <button
          className="text-left p-3 rounded-xl hover:bg-gray-100 transition"
          onClick={() => router.push(`/student/profile`)}
        >
          👤 Profile
        </button>
      </nav>
    </div>

  
    <div className="flex-1 p-10 flex flex-col gap-10">
 
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          {subjectName}
        </h1>
        <p className="text-gray-500 mt-1 text-lg">
          Welcome to your course dashboard
        </p>
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6 max-w-lg border border-gray-200">
        <h2 className="text-2xl font-semibold mb-4">
          Teacher
        </h2>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 text-white flex items-center justify-center rounded-full text-xl font-bold">
            {teacher.name.charAt(0)}
          </div>

          <div>
            <p className="text-lg font-medium">
              {teacher.name}
            </p>
            <p className="text-gray-600">
              {teacher.email}
            </p>
          </div>
        </div>
      </div>

   
      <div className="bg-white shadow-lg rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-semibold">
            Homework
          </h2>
          <span className="text-gray-500 text-sm">
            {filterred?.length || 0} assignments
          </span>
        </div>

        <div className="grid gap-5">
          {filterred?.map((assignment) => {
            const isOverdue =
              new Date(assignment.dueDate) < new Date()

            return (
              <div
                key={assignment.id}
                className="p-6 rounded-2xl border border-gray-200 hover:shadow-md transition"
              >
          
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {assignment.title}
                  </h3>

                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      isOverdue
                        ? "bg-red-100 text-red-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {isOverdue ? "Deadline Over" : "Deadline Not Over"}
                  </span>
                </div>

            
                <p className="text-gray-600 mt-2 leading-relaxed">
                  {assignment.description}
                </p>

        
                <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
                  <span>
                    📅 Due:{" "}
                    {new Date(
                      assignment.dueDate
                    ).toLocaleDateString()}
                  </span>

                  <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition" onClick={()=>{
                    router.push(`/student/classroom/${user?.classId}/${assignment.id}`)
                  }}>
                    View
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  </div>
)

}
export default Page