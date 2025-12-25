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
    <div className="flex h-screen bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black text-slate-200 overflow-hidden">
  
      {/* SIDEBAR */}
      <aside className="
        w-64 m-4 rounded-3xl
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-[0_0_40px_rgba(34,211,238,0.15)]
        flex flex-col gap-8 p-6
      ">
        <h1 className="text-3xl font-extrabold tracking-tight text-cyan-300">
          LMS<span className="text-violet-400">.core</span>
        </h1>
  
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => router.push(`/student/dashboard`)}
            className="
              flex items-center gap-3 px-4 py-3 rounded-xl
              text-slate-300 hover:text-cyan-300
              hover:bg-white/10
              hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]
              transition
            "
          >
            🏠 Home
          </button>
  
          <button
            onClick={() => router.push(`/student/classroom/${user?.classId}`)}
            className="
              flex items-center gap-3 px-4 py-3 rounded-xl
              text-slate-300 hover:text-cyan-300
              hover:bg-white/10
              hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]
              transition
            "
          >
            📚 Classrooms
          </button>
  
          <button
            onClick={() => router.push(`/student/profile`)}
            className="
              flex items-center gap-3 px-4 py-3 rounded-xl
              text-slate-300 hover:text-cyan-300
              hover:bg-white/10
              hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]
              transition
            "
          >
            👤 Profile
          </button>
        </nav>
  
        {/* SYSTEM STATUS */}
        <div className="mt-auto flex items-center gap-2 text-xs text-cyan-300">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          System Online
        </div>
      </aside>
  
      {/* MAIN */}
      <main className="flex-1 p-12 overflow-y-auto">
  
        {/* HEADER */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-slate-100 tracking-tight">
            Your Subjects
          </h2>
          <p className="text-slate-400 mt-2">
            Select a module to enter the learning system
          </p>
        </div>
  
        {/* SUBJECT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              onClick={() => router.push(`dashboard/${subject.id}`)}
              className="
                group relative cursor-pointer
                bg-white/10 backdrop-blur-xl
                border border-white/20
                rounded-3xl p-6
                hover:-translate-y-2
                hover:shadow-[0_0_50px_rgba(167,139,250,0.35)]
                transition-all duration-300
              "
            >
              {/* GLOW BORDER */}
              <div className="
                absolute inset-0 rounded-3xl
                opacity-0 group-hover:opacity-100
                bg-gradient-to-br from-cyan-400/20 to-violet-500/20
                transition
              " />
  
              <div className="relative z-10">
                <h3 className="text-xl font-semibold text-slate-100">
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
