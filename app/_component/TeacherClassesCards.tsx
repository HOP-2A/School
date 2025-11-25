"use client";

import { Button } from "@/components/ui/button";
import { Users, ClipboardList } from "lucide-react";

type PropsType = {
  AddHomework: () => void;
  RouteAssignments: () => void;
  ClassName: string;
  Subject: string;
  ClassStudentsNum: string;
};

const ClassesCard = ({
  AddHomework,
  RouteAssignments,
  ClassName,
  Subject,
  ClassStudentsNum,
}: PropsType) => {
  return (
    <section className="p-6 bg-gray-50 ml-70 mt-5">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Classes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Grade {ClassName} - {Subject}
            </h3>
            <Users className="text-gray-400" size={20} />
          </div>
          <p className="text-gray-500 mb-4">{ClassStudentsNum} students</p>
          <div className="flex gap-2">
            <Button
              onClick={() => RouteAssignments}
              variant="outline"
              className="flex-1 justify-center gap-2 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-pink-600"
            >
              <ClipboardList size={18} />
              View Assignments
            </Button>
            <Button
              onClick={() => AddHomework}
              variant="default"
              className="flex-1 justify-center gap-2 bg-pink-500 text-white hover:bg-pink-600"
            >
              Add Assignment
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassesCard;
