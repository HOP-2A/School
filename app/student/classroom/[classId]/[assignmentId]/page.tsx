"use client";


import { useAuth } from "@/app/provider/AuthProvider";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

type Homework = {
  title: string;
  dueDate: Date;
  description: string;
};
type User = {
  id :string
}

const Page = () => {
 
  const [inputValue, setInputValue] = useState("");
  const [homework, setHomework] = useState<Homework>();

  const params = useParams();
const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const assignmentId = params.assignmentId;
 const router = useRouter()
  const getSingleAssignment = async () => {
    const res = await fetch(`/api/homework/${assignmentId}`, {
      method: "GET",
    });
    if (res.ok) {
      const response = await res.json();
      setHomework(response);
    }
  };
  console.log(homework);

  const submitMyHomework = async () => {
    await fetch(`/api/homework/homeworkSubmission/${assignmentId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        studentId: user?.id,
        content: inputValue,
    
        status: "NONSUBMITTED",
      }),
    });
  };
  const handleInputValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setInputValue(value);
  };
  useEffect(() => {
    if (user) {

      getSingleAssignment();
    }
  }, [user]);
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
          <div className="w-64 bg-white shadow-lg p-5 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-blue-600">LMS</h1>

        <nav className="flex flex-col gap-3">
          <button className="text-left p-3 rounded-xl hover:bg-gray-100" onClick={() => router.push(`/student/dashboard`)}>
            🏠 Home
          </button>
          <button
            className="text-left p-3 rounded-xl hover:bg-gray-100"
            onClick={() => router.push(`/student/classroom/${user?.classId}`)}
          >
            📚 Classrooms
          </button>
          <button className="text-left p-3 rounded-xl hover:bg-gray-100"  onClick={() => {
              router.push(`/student/profile`)
            }}>
            👤 Profile
          </button>
        </nav>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {homework?.title || "Homework"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Due:{" "}
            {homework?.dueDate
              ? new Date(homework.dueDate).toLocaleDateString()
              : "—"}
          </p>
        </div>
        <div className="bg-gray-100 rounded-xl p-4">
          <p className="text-gray-700">
            {homework?.description || "No description"}
          </p>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Your Answer
          </label>
          <textarea
            placeholder="Write your answer here..."
            className="w-full min-h-[120px] rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              handleInputValue(e);
            }}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Upload File (optional)
          </label>
          <input
            type="file"
            className="block w-full text-sm text-gray-600
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-medium
          file:bg-blue-50 file:text-blue-600
          hover:file:bg-blue-100"
          />
        </div>
        <div className="flex justify-end pt-4">
          <button
            className="px-6 py-2 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
            onClick={submitMyHomework}
          >
            Submit Homework
          </button>
        </div>
      </div>
    </div>
  );
};
export default Page;
