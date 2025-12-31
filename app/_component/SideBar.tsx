"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, ClipboardList, MessageSquare, User } from "lucide-react";

type PropsType = {
  home: () => void;
  assignments: () => void;
  account: () => void;
};

const Sidebar = ({ home, assignments, account }: PropsType) => {
  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside
        className="
          hidden md:flex
          fixed left-0 top-0 h-full w-64
          bg-[#0B1020]
          border-r border-white/10
          px-4 pt-6
          flex-col
          z-50
        "
      >
        {/* LOGO */}
        <div className="flex items-center px-2 mb-10">
          <Image
            src="/NexaLogo.svg"
            alt="Logo"
            width={140}
            height={140}
            className="opacity-90"
            loading="eager"
          />
        </div>
  
        {/* NAV */}
        <nav className="flex flex-col gap-1 text-sm">
          <button
            onClick={home}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-cyan-300 transition"
          >
            <Home size={18} />
            Dashboard
          </button>
  
          <button
            onClick={assignments}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-cyan-300 transition"
          >
            <ClipboardList size={18} />
            Assignments
          </button>
  
      
  
          <div className="my-4 h-px bg-white/10" />
  
          <button
            onClick={account}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-300 hover:bg-white/5 hover:text-cyan-300 transition"
          >
            <User size={18} />
            Account
          </button>
        </nav>
  
        {/* FOOTER */}
        <div className="mt-auto px-3 py-4 text-xs text-slate-400 flex items-center gap-2">
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          Teacher Panel Active
        </div>
      </aside>
  
      {/* ================= MOBILE BOTTOM BAR ================= */}
      <aside
        className="
          md:hidden
          fixed bottom-4 left-4 right-4
          bg-[#0B1020]
          border border-white/10
          rounded-2xl
          px-4 py-3
          flex justify-around items-center
          shadow-[0_0_40px_rgba(34,211,238,0.25)]
          z-50
        "
      >
        <button onClick={home} className="text-slate-300 hover:text-cyan-300 transition">
          <Home size={22} />
        </button>
  
        <button onClick={assignments} className="text-slate-300 hover:text-cyan-300 transition">
          <ClipboardList size={22} />
        </button>
  
     
  
        <button onClick={account} className="text-slate-300 hover:text-cyan-300 transition">
          <User size={22} />
        </button>
      </aside>
    </>
  );
  
};

export default Sidebar;
