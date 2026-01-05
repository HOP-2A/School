"use client";

import { useAuth } from "@/app/provider/AuthProvider";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type Subject = {
  subjectName: string;
  teacher: {
    name: string;
    email: string;
  };
  id: string;
};
type AssignmentsType = {
  classId: string;
  createdAt: string;
  description: string;
  dueDate: string;
  id: string;
  teacherId: string;
  title: string;
  teacher: {
    id: string;
    subject: {
      id: string;
    };
  };
};
type HomeworkType = {
  content: string;
  description: string;

  feedback: string;
  homeworkId: string;
  id: string;
  reviewedAt: Date;

  score: Number;
  status: string;

  studentId: string;

  submittedAt: Date;
};
const Page = () => {
  const router = useRouter();
  const params = useParams();
  const [subjectInfo, setSubjectInfo] = useState<Subject | null>(null);

  const { user: clerkUser } = useUser();
  const [assignments, setAssignments] = useState<AssignmentsType[]>();
  const [homeworkSub, setHomeworkSub] = useState<HomeworkType[]>([]);
  const [homeworkSubmission, setHomeworkSubmission] =
    useState<AssignmentsType[]>();
  const { user } = useAuth(clerkUser?.id);
  const subjectId = params.subjectId;
  const getSubjectInfo = async () => {
    const res = await fetch(
      `/api/subject/unique/${subjectId}`,
      {
        method: "GET",
      }
    );
    const response = await res.json();
    setSubjectInfo(response);
  };
  const getHomeworkSubmission = async () => {
    const res = await fetch(`/api/homeworkSubmission/getall`, {
      method: "GET",
    });

    if (res.ok) {
      const JsonData = await res.json();
      setHomeworkSubmission(JsonData);
    }
  };
  const GetAssignments = async () => {
    const res = await fetch(`/api/homework/certainSubject/${user?.classId}`, {
      method: "POST",
      body: JSON.stringify({
        classId: user?.classId,
      }),
    });

    if (res.ok) {
      const JsonData = await res.json();
      setAssignments(JsonData);
    }
  };
  const GetSubmissions = async () => {
    const res = await fetch(
      "/api/homeworkSubmission/getIndividualSubmissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: user?.id,
        }),
      }
    );

    if (res.ok) {
      const JsonData = await res.json();
      setHomeworkSub(JsonData);
    }
  };

  useEffect(() => {
    if (user) {
      GetSubmissions();
      getHomeworkSubmission();
      getSubjectInfo();
      GetAssignments();
    }
  }, [user]);
  if (!subjectInfo)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black">
        <div
          className="
            flex flex-col items-center gap-4
            rounded-3xl
            bg-white/10 backdrop-blur-xl
            border border-white/20
            px-10 py-8
            shadow-[0_0_40px_rgba(34,211,238,0.25)]
          "
        >
          <div
            className="
              w-10 h-10 rounded-full
              border-2 border-cyan-400 border-t-transparent
              animate-spin
            "
          />
          <p className="text-cyan-300 text-sm tracking-wide">
            Loading subject data…
          </p>
        </div>
      </div>
    );

  const { subjectName, teacher } = subjectInfo;

  const filterred = assignments?.filter((assignment) => {
    return assignment?.teacher?.subject?.id === subjectId;
  });

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black text-slate-200 overflow-hidden">
      {/* SIDEBAR */}
      <aside
        className="
          hidden md:flex
          w-64 m-4 rounded-3xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_40px_rgba(34,211,238,0.15)]
          p-6 flex-col gap-8
        "
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-cyan-300">
          LMS<span className="text-violet-400">.core</span>
        </h1>

        <nav className="flex flex-col gap-2">
          {[
            { label: "Home", icon: "🏠", path: "/student/dashboard" },
            {
              label: "All Homeworks",
              icon: "📚",
              path: `/student/classroom/${user?.classId}`,
            },
            { label: "Profile", icon: "👤", path: "/student/profile" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="
                flex items-center gap-3 px-4 py-3 rounded-xl
                text-slate-300 hover:text-cyan-300
                hover:bg-white/10
                hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]
                transition
              "
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
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
          p-4 sm:p-6 md:p-12
          pb-32 md:pb-12
          space-y-12
          overflow-y-auto
        "
      >
        {/* HEADER */}
        <header>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-100">
            {subjectName}
          </h1>
          <p className="text-slate-400 mt-2 text-base sm:text-lg">
            Welcome to your course dashboard
          </p>
        </header>

        {/* TEACHER CARD */}
        <section
          className="
            max-w-lg rounded-3xl p-6
            bg-white/10 backdrop-blur-xl
            border border-white/20
            shadow-[0_0_30px_rgba(167,139,250,0.2)]
          "
        >
          <h2 className="text-xl font-semibold mb-4 text-slate-100">
            Instructor
          </h2>

          <div className="flex items-center gap-4">
            <div
              className="
                w-14 h-14 rounded-full
                bg-gradient-to-br from-cyan-400 to-violet-500
                text-black font-bold text-xl
                flex items-center justify-center
                shadow-[0_0_20px_rgba(34,211,238,0.6)]
              "
            >
              {teacher.name.charAt(0)}
            </div>

            <div>
              <p className="text-lg font-medium text-slate-100">
                {teacher.name}
              </p>
              <p className="text-slate-400 text-sm">{teacher.email}</p>
            </div>
          </div>
        </section>

        {/* HOMEWORK */}
        <section
          className="
            rounded-3xl p-6 sm:p-8
            bg-white/10 backdrop-blur-xl
            border border-white/20
            shadow-[0_0_40px_rgba(34,211,238,0.15)]
          "
        >
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl sm:text-3xl font-semibold text-slate-100">
              Homework
            </h2>
            <span className="text-sm text-slate-400">
              {filterred?.length || 0} assignments
            </span>
          </div>

          <div className="grid gap-6">
            {filterred?.map((assignment) => {
              const isOverdue = new Date(assignment.dueDate) < new Date();
              const submission = homeworkSub.find(
                (hw) => hw.homeworkId === assignment.id
              );

              return (
                <div
                  key={assignment.id}
                  className="
                    relative p-5 sm:p-6 rounded-2xl
                    bg-black/30
                    border border-white/20
                    hover:shadow-[0_0_30px_rgba(167,139,250,0.3)]
                    transition
                  "
                >
                  <div
                    className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${
                      isOverdue ? "bg-red-500" : "bg-cyan-400"
                    }`}
                  />

                  <div className="flex justify-between items-start">
                    <h3 className="text-lg sm:text-xl font-semibold text-slate-100">
                      {assignment.title}
                    </h3>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isOverdue
                          ? "bg-red-500/20 text-red-400"
                          : "bg-cyan-400/20 text-cyan-300"
                      }`}
                    >
                      {isOverdue ? "Overdue" : "Active"}
                    </span>
                  </div>

                  <p className="text-slate-400 mt-3 leading-relaxed">
                    {assignment.description}
                  </p>

                  <div className="flex items-center justify-between mt-6 text-sm">
                    <span className="text-slate-400">
                      📅 Due:{" "}
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>

                    {submission ? (
                      submission.status === "CHECKED" ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 font-semibold">
                          Reviewed
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              router.push(
                                `/student/classroom/${user?.classId}/${assignment.id}/edit`
                              )
                            }
                            className="px-4 py-2 rounded-xl text-sm bg-white/10 text-slate-200 hover:bg-white/20 transition"
                          >
                            Edit
                          </button>
                          <span className="px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 font-semibold">
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
                        className="
                          px-5 py-2 rounded-xl font-medium text-black
                          bg-cyan-400 hover:bg-cyan-300
                          shadow-[0_0_20px_rgba(34,211,238,0.6)]
                          transition
                        "
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
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
            className="flex flex-col items-center gap-1 text-cyan-300"
          >
            <span className="text-lg">📚</span>
            <span className="text-[11px]">Homework</span>
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
