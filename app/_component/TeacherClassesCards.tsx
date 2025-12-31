"use client";

import { Button } from "@/components/ui/button";
import { Users, ClipboardList } from "lucide-react";

type PropsType = {
  AddHomework: () => void;
  RouteAssignments: () => void;
  ClassName: string;
  Subject: string | undefined;
  ClassStudentsNum: number;
};

const ClassesCard = ({
  AddHomework,
  RouteAssignments,
  ClassName,
  Subject,
  ClassStudentsNum,
}: PropsType) => {
  return (
    <div
      className="
        rounded-2xl
        bg-white/5
        border border-white/10
        p-5
        flex flex-col justify-between
        hover:border-cyan-400/40
        hover:shadow-[0_0_30px_rgba(34,211,238,0.2)]
        transition
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">
            Grade {ClassName}
          </h3>
          <p className="text-sm text-slate-400 mt-1">
            {Subject || "—"}
          </p>
        </div>
  
        <Users className="text-slate-400" size={20} />
      </div>
  
      {/* META */}
      <p className="text-sm text-slate-400 mb-6">
        {ClassStudentsNum ?? 0} students
      </p>
  
      {/* ACTIONS */}
      <div className="flex gap-3">
        <button
          onClick={RouteAssignments}
          className="
            flex-1 inline-flex items-center justify-center gap-2
            px-4 py-2 rounded-lg text-sm
            bg-white/10 text-slate-200
            hover:bg-white/20
            transition
          "
        >
          <ClipboardList size={16} />
          View
        </button>
  
        <button
          onClick={AddHomework}
          className="
            flex-1 inline-flex items-center justify-center gap-2
            px-4 py-2 rounded-lg text-sm font-medium
            bg-cyan-500/90 text-black
            hover:bg-cyan-500
            transition
          "
        >
          Add
        </button>
      </div>
    </div>
  );
  
};

export default ClassesCard;
