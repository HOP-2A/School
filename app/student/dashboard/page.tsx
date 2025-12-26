"use client";

import { useAuth } from "@/app/provider/AuthProvider";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type Subject = {
  id: string;
  email: string;
  password: string;
  subjectName: string;
};
type User = {
  classId :string
}

const Page = () => {
  const { user: clerkUser } = useUser();
    const { user } = useAuth(clerkUser?.id);
  const router = useRouter();
 
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const displaySubject = async () => {
    const res = await fetch("/api/subject", {
      method: "GET",
    });
    const response = await res.json();
    setSubjects(response);
  };
  useEffect(() => {
    if(user){
    displaySubject();}
  }, [user]);




  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black text-slate-200 overflow-hidden">
  
      {/* ================= MOBILE TOP BAR ================= */}
      <header
        className="
          md:hidden
          fixed top-0 inset-x-0 z-50
          bg-white/10 backdrop-blur-xl
          border-b border-white/20
          shadow-[0_0_30px_rgba(34,211,238,0.15)]
        "
      >
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-cyan-300">
            LMS<span className="text-violet-400">.core</span>
          </h1>
  
          <nav className="flex gap-1">
            <button
              onClick={() => router.push(`/student/dashboard`)}
              className="px-3 py-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition"
            >
              🏠
            </button>
  
            <button
              onClick={() => router.push(`/student/classroom/${user?.classId}`)}
              className="px-3 py-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition"
            >
              📚
            </button>
  
            <button
              onClick={() => router.push(`/student/profile`)}
              className="px-3 py-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition"
            >
              👤
            </button>
          </nav>
        </div>
      </header>
  
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
          LMS<span className="text-violet-400">.core</span>
        </h1>
  
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => router.push(`/student/dashboard`)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition"
          >
            🏠 Home
          </button>
  
          <button
            onClick={() => router.push(`/student/classroom/${user?.classId}`)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition"
          >
            📚 Classrooms
          </button>
  
          <button
            onClick={() => router.push(`/student/profile`)}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(34,211,238,0.35)] transition"
          >
            👤 Profile
          </button>
        </nav>
  
        <div className="mt-auto flex items-center gap-2 text-xs text-cyan-300">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          System Online
        </div>
      </aside>
  
      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 pt-20 md:pt-0 px-4 sm:px-6 md:p-10 lg:p-12 overflow-y-auto">
  
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
            Your Subjects
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Select a module to enter the learning system
          </p>
        </div>
  
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => router.push(`dashboard/${subject.id}`)}
              className="
                group relative cursor-pointer
                bg-white/10 backdrop-blur-xl
                border border-white/20
                rounded-3xl p-5 sm:p-6
                hover:-translate-y-2
                hover:shadow-[0_0_50px_rgba(167,139,250,0.35)]
                transition-all duration-300
              "
            >
              <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-400/20 to-violet-500/20 transition" />
  
              <div className="relative z-10">
                <h3 className="text-lg sm:text-xl font-semibold text-slate-100">
                  {subject.subjectName}
                </h3>
  
                <p className="text-slate-400 mt-2 text-sm">
                  Enter classroom →
                </p>
  
                <div className="mt-4 flex items-center gap-2 text-xs text-cyan-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  Module Ready
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
  
  
};

export default Page;
