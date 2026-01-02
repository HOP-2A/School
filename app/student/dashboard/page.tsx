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
  const clerkuser = useUser()
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
    displaySubject()
    }
    if(clerkUser?.publicMetadata.role === "TEACHER"){
      router.push("/teacher/main")
    }
  }, [user,clerkUser]);





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
          LMS<span className="text-violet-400">.core</span>
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
          px-4 sm:px-6 md:p-10
          pb-32 md:pb-0
          overflow-y-auto
        "
      >
        <div className="mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-100 tracking-tight">
            Your Subjects
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Select a module to enter the learning system
          </p>
        </div>
  
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
