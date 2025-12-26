"use client";

import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/app/provider/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Page = () => {
  const router = useRouter()
const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);

useEffect(()=>{

},[user])



return (
  <div className="flex h-screen bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black text-slate-200 overflow-hidden">

    {/* SIDEBAR */}
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
          📚 All Homeworks
        </button>

        <button
          className="
            flex items-center gap-3 px-4 py-3 rounded-xl
            bg-white/15 text-cyan-300
            shadow-[0_0_20px_rgba(34,211,238,0.35)]
          "
        >
          👤 Profile
        </button>
      </nav>

      <div className="mt-auto flex items-center gap-2 text-xs text-cyan-300">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        System Online
      </div>
    </aside>

    {/* MAIN */}
    <main className="flex-1 p-12 overflow-y-auto">
      <div className="max-w-4xl mx-auto">

        {/* PROFILE CARD */}
        <div
          className="
            relative
            bg-white/10 backdrop-blur-xl
            border border-white/20
            rounded-3xl p-8
            shadow-[0_0_50px_rgba(167,139,250,0.25)]
            flex flex-col md:flex-row gap-10
          "
        >
          {/* Glow */}
          <div
            className="
              absolute inset-0 rounded-3xl
              bg-gradient-to-br from-cyan-400/20 to-violet-500/20
              opacity-50
            "
          />

          {/* AVATAR */}
          <div className="relative z-10 flex flex-col items-center md:items-start">
            <div
              className="
                w-32 h-32 rounded-full
                bg-gradient-to-br from-cyan-400 to-violet-500
                flex items-center justify-center
                text-black text-4xl font-extrabold
                shadow-[0_0_40px_rgba(34,211,238,0.6)]
              "
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>

            <p className="mt-4 text-sm text-cyan-300">Student</p>
          </div>

          {/* INFO */}
          <div className="relative z-10 flex-1">
            <h2 className="text-3xl font-bold text-slate-100">
              {user?.name}
            </h2>
            <p className="text-slate-400 mt-1">
              {user?.email}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-slate-400">Class</p>
                <p className="text-lg font-semibold text-slate-100">
                  {user?.classId}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-slate-400">User ID</p>
                <p className="text-sm font-mono text-slate-300 truncate">
                  {user?.id}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-slate-400">Clerk ID</p>
                <p className="text-sm font-mono text-slate-300 truncate">
                  {user?.clerkId}
                </p>
              </div>

              <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                <p className="text-xs text-slate-400">Joined</p>
                <p className="text-lg font-semibold text-slate-100">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
);


};
export default Page;
