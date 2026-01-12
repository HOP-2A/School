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
    relative
    rounded-2xl
    bg-[#1C1C26]
    p-5 sm:p-6
    flex flex-col justify-between
    shadow-[0_1px_3px_rgba(0,0,0,0.2)]
    hover:shadow-[0_8px_24px_rgba(0,0,0,0.3)]
    hover:-translate-y-1
    transition-all duration-300
    w-full
    max-w-sm
  "
    >
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-5 gap-2 sm:gap-0">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white">
            Grade {ClassName}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {Subject || "—"}
          </p>
        </div>

        <Users className="text-gray-400 sm:ml-2" size={20} />
      </div>

      {/* META */}
      <p className="text-xs sm:text-sm text-gray-400 mb-4 sm:mb-6">
        {ClassStudentsNum ?? 0} students
      </p>

      {/* ACTIONS */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <button
          onClick={RouteAssignments}
          className="
        flex-1 flex items-center justify-center gap-2
        px-4 sm:px-5 py-2 sm:py-3 rounded-2xl text-sm font-medium
        bg-[#2A2A35] text-white
        hover:bg-[#3A3A4B]
        hover:scale-105
        transition-all duration-200
      "
        >
          <ClipboardList size={16} />
          View
        </button>

        <button
          onClick={AddHomework}
          className="
        flex-1 flex items-center justify-center gap-2
        px-4 sm:px-5 py-2 sm:py-3 rounded-2xl text-sm sm:text-base font-semibold
        bg-cyan-500 text-black
        hover:bg-cyan-400
        hover:scale-105
        transition-all duration-200
      "
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default ClassesCard;
