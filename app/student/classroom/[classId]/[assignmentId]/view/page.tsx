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
    <div className="flex min-h-screen bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black text-slate-200 overflow-hidden">
      
      {/* Sidebar */}
      <aside
        className="
          w-64 m-4 rounded-3xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_40px_rgba(34,211,238,0.15)]
          flex flex-col gap-8 p-6
        "
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-cyan-300">
          LMS<span className="text-violet-400">.core</span>
        </h1>
  
        <nav className="flex flex-col gap-2 text-sm font-medium">
          {[
            { label: "🏠 Home", path: "/student/dashboard" },
            { label: "📚 Classrooms", path: `/student/classroom/${user?.classId}` },
            { label: "👤 Profile", path: "/student/profile" },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => router.push(item.path)}
              className="
                flex items-center gap-3 px-4 py-3 rounded-xl
                text-slate-300 hover:text-cyan-300
                hover:bg-white/10
                hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]
                transition
              "
            >
              {item.label}
            </button>
          ))}
        </nav>
  
        <div className="mt-auto flex items-center gap-2 text-xs text-cyan-300">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          System Online
        </div>
      </aside>
  
      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div
          className="
            max-w-3xl mx-auto
            bg-white/10 backdrop-blur-xl
            border border-white/20
            rounded-3xl p-8
            shadow-[0_0_50px_rgba(167,139,250,0.25)]
            space-y-8
          "
        >
          {/* Title */}
          <div>
            <h1 className="text-3xl font-bold text-slate-100">
              {homework?.title || homeworkData?.title || "Homework"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Due:{" "}
              {homework?.dueDate
                ? new Date(homework.dueDate).toLocaleDateString()
                : "—"}
            </p>
          </div>
  
          {/* Answer (Read-only) */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-cyan-300">
              Your Answer
            </label>
            <div
              className="
                rounded-xl
                bg-black/30 border border-white/20
                p-4 text-slate-200 text-sm leading-relaxed
              "
            >
              {inputValue || (
                <span className="italic text-slate-500">
                  No answer submitted.
                </span>
              )}
            </div>
          </div>
  
          {/* Images */}
          <div className="flex flex-wrap gap-4">
            {images.length === 0 && (
              <p className="text-slate-500">No images uploaded.</p>
            )}
  
            {images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img}
                  className="
                    h-[280px] w-[280px]
                    rounded-2xl object-cover
                    border border-white/20
                    group-hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]
                    transition
                  "
                />
              </div>
            ))}
          </div>
  
          {/* Teacher Evaluation */}
          {homeworkSub && (
            <div
              className="
                rounded-3xl
                bg-white/10 backdrop-blur-xl
                border border-white/20
                p-6 space-y-5
                shadow-[0_0_30px_rgba(34,211,238,0.15)]
              "
            >
              <h2 className="text-lg font-semibold text-cyan-300">
                Teacher Evaluation
              </h2>
  
              {/* Score */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">Score</span>
                <div
                  className={`px-4 py-1.5 rounded-full text-sm font-medium
                    ${
                      homeworkSub.score >= 80
                        ? "bg-green-400/20 text-green-300"
                        : homeworkSub.score >= 60
                        ? "bg-yellow-400/20 text-yellow-300"
                        : "bg-red-400/20 text-red-300"
                    }`}
                >
                  {homeworkSub.score}/100
                </div>
              </div>
  
              {/* Feedback */}
              <div>
                <p className="text-sm text-slate-400 mb-2">
                  Feedback
                </p>
                <div
                  className="
                    rounded-xl
                    bg-black/30 border border-white/20
                    p-4 text-slate-200 text-sm leading-relaxed
                  "
                >
                  {homeworkSub.feedback || (
                    <span className="italic text-slate-500">
                      No feedback provided yet.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
  
          {/* Action */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => router.push(`/student/classroom/${user?.classId}`)}
              className="
                px-6 py-2 rounded-xl
                bg-cyan-500 text-white
                hover:bg-cyan-600
                transition
              "
            >
              Close
            </button>
          </div>
        </div>
      </main>
    </div>
  );
  
};

export default Page;
