"use client";
import Sidebar from "@/app/_component/SideBar";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaChalkboardTeacher } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";

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

type SubjectType = {
  id: string;
  subjectName: string;
  teacherId: string;
  createdAt: string;
};

const Page = () => {
  const { push } = useRouter();
  const [teacher, setTeacher] = useState<TeacherType>();
  const [subject, setSubject] = useState<SubjectType>();
  const { user, isLoaded } = useUser();

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
      setSubject(jsonTeacher.subject);
    } else {
      toast.error("Failed to fetch classes");
    }
  };
  useEffect(() => {
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
          py-6 sm:py-10
          pb-32 md:pb-10
          max-w-6xl mx-auto
          space-y-8 sm:space-y-10
        "
      >
  
        {/* ================= PROFILE HEADER ================= */}
        <section
          className="
            flex flex-col sm:flex-row items-center gap-6 sm:gap-8
            rounded-2xl sm:rounded-3xl
            p-6 sm:p-8
            bg-white/10 backdrop-blur-2xl
            border border-white/20
            shadow-[0_0_40px_rgba(99,102,241,0.18)]
          "
        >
          {/* Avatar */}
          <div className="relative rounded-full border-4 border-pink-500 p-1">
            <Avatar className="w-24 h-24 sm:w-32 sm:h-32">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>
                {teacher?.name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
  
          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              {teacher?.name}
            </h1>
  
            <p className="mt-1 sm:mt-2 text-sm sm:text-base text-slate-400">
              {subject?.subjectName}
            </p>
  
            <div className="flex flex-col sm:flex-row flex-wrap justify-center sm:justify-start gap-3 sm:gap-6 mt-4 sm:mt-5 text-sm">
              <div className="flex items-center gap-2 text-slate-300">
                <FaEnvelope className="text-indigo-400" />
                {teacher?.email}
              </div>
  
              <div className="flex items-center gap-2 text-slate-300">
                <FaChalkboardTeacher className="text-indigo-400" />
                {teacher?.teacherClasses?.length} Classes
              </div>
            </div>
          </div>
        </section>
  
        {/* ================= CLASSES ================= */}
        <section
          className="
            rounded-2xl sm:rounded-3xl
            p-6 sm:p-8
            bg-white/10 backdrop-blur-2xl
            border border-white/20
            shadow-[0_0_40px_rgba(99,102,241,0.18)]
          "
        >
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-5 sm:mb-6">
            Classes
          </h2>
  
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {teacher?.teacherClasses?.map((subj) => (
              <div
                key={subj?.classId}
                className="
                  cursor-pointer text-center
                  rounded-xl sm:rounded-2xl
                  p-5 sm:p-6
                  bg-white/10 backdrop-blur-xl
                  border border-white/20
                  hover:shadow-[0_0_40px_rgba(236,72,153,0.35)]
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <h3 className="text-base sm:text-lg font-semibold text-pink-400">
                  {subj.Class?.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">
                  View class
                </p>
              </div>
            ))}
          </div>
        </section>
  
      </main>
    </div>
  );
  
  
};

export default Page;
