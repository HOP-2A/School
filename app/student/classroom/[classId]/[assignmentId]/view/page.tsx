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
  content:string
};

type HomeworkSub = {
  feedback: string,
  score:number
  description:number
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
  const [openImage, setOpenImage] = useState<string | null>(null);


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
    <div className="flex min-h-screen bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black text-slate-200">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className="
          hidden md:flex
          w-72 m-4 rounded-3xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_40px_rgba(34,211,238,0.15)]
          flex-col gap-6 p-6
        "
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-cyan-300">
          NEXA<span className="text-violet-400"></span>
        </h1>
  
        <nav className="flex flex-col gap-2 text-sm font-medium">
          <button
            onClick={() => router.push("/student/dashboard")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition"
          >
            🏠 <span>Home</span>
          </button>
  
          <button
            onClick={() => router.push(`/student/classroom/${user?.classId}`)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition"
          >
            📚 <span>Classroom</span>
          </button>
  
          <button
            onClick={() => router.push("/student/profile")}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/15 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.35)]"
          >
            👤 <span>Profile</span>
          </button>
        </nav>
  
        <div className="mt-auto flex items-center gap-2 text-xs text-cyan-300">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          System Online
        </div>
      </aside>
  
      {/* ================= MAIN ================= */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 pb-32 md:pb-10 overflow-y-auto">
        <div
          className="
            max-w-3xl mx-auto
            bg-white/10 backdrop-blur-xl
            border border-white/20
            rounded-3xl p-6 sm:p-8
            shadow-[0_0_50px_rgba(167,139,250,0.25)]
            space-y-8
          "
        >
          {/* TITLE */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-100">
              {homework?.title || homeworkData?.title || "Homework"}
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Due:{" "}
              {homework?.dueDate
                ? new Date(homework.dueDate).toLocaleDateString()
                : "—"}
            </p>
          </div>
  
          {/* ================= TEACHER CONTENT (NEW) ================= */}
          {homework?.content && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-cyan-300">
                Teacher Materials
              </h2>
  
              <div className="flex flex-wrap gap-4">
                {(Array.isArray(homework.content)
                  ? homework.content
                  : [homework.content]
                ).map((img: string, index: number) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() => setOpenImage(img)}
                    className="
                      h-[240px] w-[240px] sm:h-[280px] sm:w-[280px]
                      rounded-2xl object-cover cursor-pointer
                      border border-white/20
                      hover:shadow-[0_0_30px_rgba(34,211,238,0.45)]
                      transition
                    "
                  />
                ))}
              </div>
            </div>
          )}
  
          {/* ================= STUDENT ANSWER ================= */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-cyan-300">
              Your Answer
            </label>
            <div className="rounded-xl bg-black/30 border border-white/20 p-4 text-sm leading-relaxed">
              {homeworkSub?.description || (
                <span className="italic text-slate-500">
                  No answer submitted.
                </span>
              )}
            </div>
          </div>
  
          {/* ================= STUDENT IMAGES ================= */}
          <div className="flex flex-wrap gap-4">
            {images.length === 0 && (
              <p className="text-slate-500">No images uploaded.</p>
            )}
  
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                onClick={() => setOpenImage(img)}
                className="
                  h-[240px] w-[240px] sm:h-[280px] sm:w-[280px]
                  rounded-2xl object-cover cursor-pointer
                  border border-white/20
                  hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]
                  transition
                "
              />
            ))}
          </div>
  
          {/* ================= TEACHER EVALUATION ================= */}
          {homeworkSub && (
            <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 p-6 space-y-5 shadow-[0_0_30px_rgba(34,211,238,0.15)]">
              <h2 className="text-lg font-semibold text-cyan-300">
                Teacher Evaluation
              </h2>
  
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-400">Score</span>
                <div
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${
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
  
              <div>
                <p className="text-sm text-slate-400 mb-2">Feedback</p>
                <div className="rounded-xl bg-black/30 border border-white/20 p-4 text-sm leading-relaxed">
                  {homeworkSub.feedback || (
                    <span className="italic text-slate-500">
                      No feedback provided yet.
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
  
          {/* ACTION */}
          <div className="flex justify-end pt-4">
            <button
              onClick={() => router.push(`/student/classroom/${user?.classId}`)}
              className="px-6 py-2 rounded-xl bg-cyan-500 text-black hover:bg-cyan-400 transition"
            >
              Close
            </button>
          </div>
        </div>
      </main>
  
      {/* ================= IMAGE MODAL (REUSED) ================= */}
      {openImage && (
        <div
          onClick={() => setOpenImage(null)}
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <img
            src={openImage}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[95vw] object-contain rounded-2xl shadow-[0_0_50px_rgba(34,211,238,0.5)]"
          />
          <button
            onClick={() => setOpenImage(null)}
            className="absolute top-6 right-6 text-white text-2xl hover:text-cyan-300 transition"
          >
            ✕
          </button>
        </div>
      )}
  
      {/* ================= MOBILE NAV ================= */}
      <nav
        className="
          md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40
          w-[92%] max-w-md
          bg-white/10 backdrop-blur-xl
          border border-white/20
          rounded-2xl
          shadow-[0_0_30px_rgba(99,102,241,0.25)]
          px-4 py-3
        "
      >
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.push("/student/dashboard")}
            className="flex flex-col items-center gap-1 text-slate-300 hover:text-cyan-300 transition"
          >
            <span className="text-lg">🏠</span>
            <span className="text-[11px]">Home</span>
          </button>
  
          <button
            onClick={() => router.push(`/student/classroom/${user?.classId}`)}
            className="flex flex-col items-center gap-1 text-slate-300 hover:text-cyan-300 transition"
          >
            <span className="text-lg">📚</span>
            <span className="text-[11px]">Classroom</span>
          </button>
  
          <button
            onClick={() => router.push("/student/profile")}
            className="flex flex-col items-center gap-1 text-cyan-300"
          >
            <span className="text-lg">👤</span>
            <span className="text-[11px]">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
  
  
};

export default Page;
