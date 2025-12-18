"use client"

import { useAuth } from "@/app/provider/AuthProvider";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type AssignmentsType = {
  classId: string;
  createdAt: string;
  description: string;
  dueDate: string;
  id: string;
  teacherId: string;
  title: string;
};
type HomeworkType = {
content
: 
string,
description
: 
string,

feedback
: 
string,
homeworkId
: 
string, 
id
: 
string, 
reviewedAt
: 
Date,

score
: 
Number
status
: boolean,


studentId
: string

submittedAt
: 
Date
};
type TeacherType = {
  id: string;
  name: string;
  teacherId: string;
  password: string;
  email: string;
  classes: {
    createdAt: string;
    id: string;
    name: string;
    students: {
      id: string;
      classId: string;
      clerkId: string;
      createdAt: string;
      email: string;
      name: string;
    }[];
    teacherId: string;
  }[];
};
const Page= ()=>{
    const router = useRouter()
  const params = useParams();
  const classId = params.classId as string;
 
  const [teacher, setTeacher] = useState<TeacherType>();
  const [assignments, setAssignments] = useState<AssignmentsType[]>();
    const [homeworkSub, setHomeworkSub] = useState<HomeworkType[]>([]);
const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
     const GetAssignments = async () => {
    const res = await fetch("/api/teacher/assignments/bring", {
      method: "POST",
      body: JSON.stringify({
        classId: classId,
        teacherId: teacher?.id,
      }),
    });

    if (res.ok) {
      const JsonData = await res.json();
      setAssignments(JsonData);
    }
  };
 
   const GetSubmissions = async () => {
    const res = await fetch("/api/homeworkSubmission/getIndividualSubmissions", {
      method: "POST",
   headers: {
            "Content-Type": "application/json",
          },
      body: JSON.stringify({
            studentId :user?.id,
          }),      
        
    });

    if (res.ok) {
      const JsonData = await res.json();
    setHomeworkSub(JsonData)
    }
  };
  console.log(homeworkSub,"hw sub")

   const getClasses = async () => {
        if (!user) return;
  
        const res = await fetch("/api/teacher/class", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            teacherId: user.id,
          }),
        });
  
        if (res.ok) {
          const jsonTeacher = await res.json();
          setTeacher(jsonTeacher.teacher);
        } else {
          console.log("Failed to fetch classes");
        }
      };

    useEffect(() => {

      getClasses();
      GetAssignments();
      GetSubmissions()
    }, [user]);
    console.log(assignments)
const homework = homeworkSub?.map((hw)=>(
  hw.homeworkId
))

return (
  <div className="min-h-screen bg-gray-100 flex">

    <div className="w-64 bg-white shadow-lg p-5 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-blue-600">LMS</h1>

      <nav className="flex flex-col gap-3">
        <button
          className="text-left p-3 rounded-xl hover:bg-gray-100"
          onClick={() => router.push(`/student/dashboard`)}
        >
          🏠 Home
        </button>
        <button
          className="text-left p-3 rounded-xl hover:bg-gray-100"
          onClick={() => router.push(`/student/classroom/${user?.classId}`)}
        >
          📚 Classrooms
        </button>
        <button
          className="text-left p-3 rounded-xl hover:bg-gray-100"
          onClick={() => router.push(`/student/profile`)}
        >
          👤 Profile
        </button>
      </nav>
    </div>


    <div className="flex-1 p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-semibold mb-4">Assignments</h1>

      {!assignments || assignments.length === 0 ? (
        <p className="text-gray-500">No assignments yet. Check back later!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assignments.map((assignment) => (
            <div
              key={assignment.id}
              className="bg-white rounded-xl shadow p-5 flex flex-col justify-between hover:shadow-lg transition"
            >
              <div>
                <h2 className="text-xl font-semibold mb-2">{assignment.title}</h2>
                <p className="text-gray-600 mb-3 line-clamp-3">
                  {assignment.description}
                </p>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-500">
                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                </p>
{homework.includes(assignment.id) ? (
  <div className="flex items-center gap-3">
   
    <button
      onClick={() => {
        router.push(
          `/student/classroom/${user?.classId}/${assignment.id}/edit`
        );
      }}
      className="px-3 py-1.5 text-sm bg-gray-200 rounded-lg hover:bg-gray-300 transition"
    >
      ✏️ Edit
    </button>

   
    <span className="text-green-600 font-semibold">
      ✅ Submitted
    </span>
  </div>
) : (
  <button
    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
    onClick={() => {
      router.push(
        `/student/classroom/${user?.classId}/${assignment.id}`
      );
    }}
  >
    Review
  </button>
)}


              
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);


}
export default Page