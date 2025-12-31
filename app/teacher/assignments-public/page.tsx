"use client";

import ClassesPage from "@/app/_component/AssignmentPageCard";
import Sidebar from "@/app/_component/SideBar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type classesType = {
  classId: string;
  teacherId: string;
  Class: {
    teacherId: string;
    id: string;
    name: string;
    students: {
      classId: string;
      name: string;
      id: string;
      email: string;
    }[];
  };
}[];

type TeacherType = {
  id: string;
  name: string;
  email: string;
  teacherClasses: {
    classId: string;
    teacherId: string;
    Class: {
      teacherId: string;
      id: string;
      name: string;
      students: {
        classId: string;
        name: string;
        id: string;
        email: string;
      }[];
    };
  }[];
};

const Page = () => {
  const { push } = useRouter();
  const [classes, setClasses] = useState<classesType>();
  const [teacher, setTeacher] = useState<TeacherType>();

  const { user, isLoaded } = useUser();
  useEffect(() => {
    const getClasses = async () => {
      if (!isLoaded || !user) return;

      const res = await fetch("/api/teacher/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: user.id,
        }),
      });

      if (res.ok) {
        const jsonTeacher = await res.json();
        setTeacher(jsonTeacher.teacher);
        setClasses(jsonTeacher.teacher.teacherClasses);
      } else {
        toast.error("Failed to fetch classes");
      }
    };

    getClasses();
  }, [isLoaded, user]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#111827] to-black text-slate-200">
  
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        home={() => push("/teacher/main")}
        assignments={() => push("/teacher/assignments-public")}
        account={() => push("/teacher/account/")}
      />
  
      {/* ================= MAIN ================= */}
      <main
        className="
          md:ml-[18rem]
          px-4 sm:px-6 md:px-10
          py-6 sm:py-8
          pb-28 md:pb-8
          space-y-8
        "
      >
        <header>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Your Classes
          </h2>
          <p className="text-slate-400 mt-2 text-sm sm:text-base">
            Click a class to view assignments →
          </p>
        </header>
  
        {/* ================= CLASSES GRID ================= */}
        <section
          className="
            grid grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-4 sm:gap-6
          "
        >
          {classes?.map((cls, index) => (
            <div
              key={index}
              onClick={() =>
                push(`/teacher/assignments/${cls?.classId}`)
              }
              className="
                cursor-pointer
                rounded-2xl
                px-6 py-5 sm:px-8 sm:py-6
                bg-white/10 backdrop-blur-xl
                border border-white/20
                shadow-[0_0_30px_rgba(99,102,241,0.15)]
                hover:shadow-[0_0_50px_rgba(99,102,241,0.35)]
                hover:-translate-y-1
                transition-all duration-300
                text-center
              "
            >
              <h3 className="text-lg font-semibold text-indigo-300">
                {cls?.Class?.name}
              </h3>
              <p className="text-sm text-slate-400 mt-1">
                View assignments
              </p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
  
  
};

export default Page;
