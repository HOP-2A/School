"use client";

import { useAuth } from "@/app/provider/AuthProvider";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";

type Submission = {
  content: string[] | string;
  description: string;
  feedback?: string | null;
  homeworkId: string;
  id: string;
  reviewedAt?: string | null;
  score?: number | null;
  status: string;
  studentId: string;
  submittedAt: string;
};

type HomeworkData = {
  status: number;
  submissions: Submission[];
  title?: string;
  dueDate?: string;
  description?: string;
};

type HomeworkSub = {
  feedback: string,
  score:number
  };
  
const Page = () => {
  const params = useParams();
  const assignmentId = params.assignmentId;
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const router = useRouter();

  const [homeworkData, setHomeworkData] = useState<HomeworkData | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [homework, setHomework] = useState<HomeworkData>();
  const [homeworkSub, setHomeworkSub] = useState<HomeworkSub>();

  const getSingleAssignment = async () => {
    const res = await fetch(`/api/homework/${assignmentId}`);
    if (res.ok) {
      const data = await res.json();
      setHomework(data);
    }
  };

  const getHomework = async () => {
    const res = await fetch(
      `/api/homework/homeworkSubmission/${assignmentId}`,
      {
        method: "GET",
      }
    );
    const data: HomeworkData = await res.json();
    setHomeworkData(data);
    if (data.submissions.length > 0) {
      const ehniiSubmission = data.submissions[0];
      setInputValue(ehniiSubmission.description || "");
      const contentArray = Array.isArray(ehniiSubmission.content)
        ? ehniiSubmission.content
        : [ehniiSubmission.content];
      setImages(contentArray);
    }
  };

  
const getSingleSubmission = async ()=>{
    const res = await fetch(`/api/homeworkSubmission/getSingleSubmission`,{
        method:"POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeworkId:assignmentId
    })

    });
    if (res.ok) {
      const data = await res.json();
      setHomeworkSub(data);
    }
}
  useEffect(() => {
    if (assignmentId) {
      getHomework();
      getSingleAssignment();
      getSingleSubmission()
    }
  }, [assignmentId]);
  console.log(homeworkSub)

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      
      {/* SIDEBAR */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col gap-6">
        <nav className="flex flex-col gap-3 text-sm font-medium text-gray-700">
          <button onClick={() => router.push(`/student/dashboard`)}>
            🏠 Home
          </button>
          <button
            onClick={() => router.push(`/student/classroom/${user?.classId}`)}
          >
            📚 Classrooms
          </button>
          <button onClick={() => router.push(`/student/profile`)}>
            👤 Profile
          </button>
        </nav>
      </div>
  
      {/* MAIN CONTENT */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 space-y-6">
  
        {/* TITLE */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {homeworkData?.title || "Homework"}
          </h1>
        </div>
  
        {/* HOMEWORK INFO */}
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
  
        {/* ANSWER */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Your Answer
          </label>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 text-gray-800">
            {inputValue}
          </div>
        </div>
  
        {/* IMAGES */}
        <div className="flex flex-wrap gap-4">
          {images.length === 0 && (
            <p className="text-gray-400">No images uploaded yet.</p>
          )}
  
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                className="h-[300px] w-[300px] rounded-lg object-cover border"
              />
            </div>
          ))}
        </div>
  
        {/* 🔥 TEACHER EVALUATION */}
        {homeworkSub && (
          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 space-y-4">
  
            <h2 className="text-lg font-semibold text-slate-800">
              Teacher Evaluation
            </h2>
  
            {/* SCORE */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-500">Score</span>
  
              <div
                className={`px-4 py-1.5 rounded-full text-sm font-medium
                  ${
                    homeworkSub.score >= 80
                      ? "bg-green-100 text-green-700"
                      : homeworkSub.score >= 60
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {homeworkSub.score}/100
              </div>
            </div>
  
            {/* FEEDBACK */}
            <div>
              <p className="text-sm text-slate-500 mb-2">
                Feedback
              </p>
  
              <div className="rounded-xl bg-white border border-slate-200 p-4 text-slate-700 leading-relaxed text-sm">
                {homeworkSub.feedback || (
                  <span className="text-slate-400 italic">
                    No feedback provided yet.
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
  
        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-4">
         
  
          <button
            onClick={() => {
              router.push(`/student/classroom/${user?.classId}`);
            }}
            disabled={images.length === 0}
            className={`${
              images.length === 0
                ? "px-6 py-2 rounded-xl text-white bg-gray-400 cursor-not-allowed"
                : "px-6 py-2 rounded-xl text-white bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Close
          </button>
        </div>
  
      </div>
    </div>
  );
  
};

export default Page;
