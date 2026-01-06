"use client";

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
  content: string;
  description: string;
  feedback: string;
  homeworkId: string;
  id: string;
  reviewedAt: Date | null;
  score: number;
  status: "CHECKED" | "REVIEWING";
  studentId: string;
  submittedAt: Date;
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

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;

  const [teacher, setTeacher] = useState<TeacherType>();
  const [assignments, setAssignments] = useState<AssignmentsType[]>([]);
  const [homeworkSub, setHomeworkSub] = useState<HomeworkType[]>([]);

  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);

  const GetAssignments = async () => {
    const res = await fetch("/api/teacher/assignments/bring", {
      method: "POST",
      body: JSON.stringify({
        classId,
        teacherId: teacher?.id,
      }),
    });

    if (res.ok) {
      setAssignments(await res.json());
    }
  };

  const GetSubmissions = async () => {
    const res = await fetch(
      "/api/homeworkSubmission/getIndividualSubmissions",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: user?.id }),
      }
    );

    if (res.ok) {
      setHomeworkSub(await res.json());
    }
  };

  const getClasses = async () => {
    if (!user) return;

    const res = await fetch("/api/teacher/class", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId: user.id }),
    });

    if (res.ok) {
      const json = await res.json();
      setTeacher(json.teacher);
    }
  };

  useEffect(() => {
    if (!user) return;
    getClasses();
    GetAssignments();
    GetSubmissions();
  }, [user]);
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black text-slate-200">
  
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className="
          hidden md:flex
          w-64 m-4 rounded-3xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_40px_rgba(34,211,238,0.15)]
          flex-col gap-8 p-6
        "
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-cyan-300">
          NEXA<span className="text-violet-400">.core</span>
        </h1>
  
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => router.push(`/student/dashboard`)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition"
          >
            🏠 Home
          </button>
  
          <button
            onClick={() => router.push(`/student/classroom/${user?.classId}`)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition"
          >
            📚 Classrooms
          </button>
  
          <button
            onClick={() => router.push(`/student/profile`)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition"
          >
            👤 Profile
          </button>
        </nav>
  
        <div className="mt-auto flex items-center gap-2 text-xs text-cyan-300">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          System Online
        </div>
      </aside>
  
      {/* ================= MAIN ================= */}
      <main
        className="
          flex-1
          px-4 sm:px-6 md:p-12
          pb-32 md:pb-0
          overflow-y-auto
        "
      >
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-100 tracking-tight">
            Assignments
          </h1>
          <p className="text-slate-400 mt-2">
            Track your submissions and review status
          </p>
        </div>
  
        {assignments.length === 0 ? (
          <p className="text-slate-400">No assignments yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {assignments.map((assignment) => {
              const submission = homeworkSub.find(
                (hw) => hw.homeworkId === assignment.id
              );
  
              return (
                <div
                  key={assignment.id}
                  className="
                    group relative
                    bg-white/10 backdrop-blur-xl
                    border border-white/20
                    rounded-3xl p-5 sm:p-6
                    hover:-translate-y-1
                    hover:shadow-[0_0_50px_rgba(167,139,250,0.35)]
                    transition-all duration-300
                  "
                >
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 transition" />
  
                  <div className="relative z-10 flex flex-col justify-between h-full">
                    <div>
                      <h2 className="text-lg sm:text-xl font-semibold text-slate-100 mb-2">
                        {assignment.title}
                      </h2>
  
                      <p className="text-slate-400 text-sm line-clamp-3">
                        {assignment.description}
                      </p>
                    </div>
  
                    <div className="mt-6 flex justify-between items-center">
                      <p className="text-xs text-slate-400">
                        Due:{" "}
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </p>
  
                      {submission ? (
                        submission.status === "CHECKED" ? (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                router.push(
                                  `/student/classroom/${user?.classId}/${assignment.id}/view`
                                )
                              }
                              className="px-4 py-1.5 text-sm rounded-lg bg-white/10 text-cyan-300 hover:bg-white/20 transition"
                            >
                              View
                            </button>
  
                            <span className="text-green-400 text-xs font-medium">
                              Reviewed
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() =>
                                router.push(
                                  `/student/classroom/${user?.classId}/${assignment.id}/edit`
                                )
                              }
                              className="px-4 py-1.5 text-sm rounded-lg bg-white/10 text-yellow-300 hover:bg-white/20 transition"
                            >
                              ✏️ Edit
                            </button>
  
                            <span className="text-yellow-400 text-xs font-medium">
                              Reviewing
                            </span>
                          </div>
                        )
                      ) : (
                        <button
                          onClick={() =>
                            router.push(
                              `/student/classroom/${user?.classId}/${assignment.id}`
                            )
                          }
                          className="px-5 py-2 text-sm font-medium rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 text-black hover:opacity-90 transition"
                        >
                          Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
  
      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav
        className="
          md:hidden
          fixed bottom-4 left-1/2 -translate-x-1/2 z-40
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
            onClick={() => router.push(`/student/dashboard`)}
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
            <span className="text-[11px]">Classes</span>
          </button>
  
          <button
            onClick={() => router.push(`/student/profile`)}
            className="flex flex-col items-center gap-1 text-slate-300 hover:text-cyan-300 transition"
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
