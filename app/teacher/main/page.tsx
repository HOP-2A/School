"use client";

import Sidebar from "@/app/_component/SideBar";
import ClassesCard from "@/app/_component/TeacherClassesCards";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";

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

const Page = () => {
  const { push } = useRouter();
  const [classes, setClasses] = useState<classesType>();
  const [teacher, setTeacher] = useState<TeacherType>();
  const [subject, setSubject] = useState<SubjectType>();
  const { isLoaded } = useUser();
  const [selectedDay, setSelectedDay] = useState("All Days");

  const { user: clerkUser } = useUser();
  const { user, loading } = useAuth(clerkUser?.id);

  const getClasses = async () => {
    const res = await fetch("/api/teacher/class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        teacherId: clerkUser?.id,
      }),
    });

    if (res.ok) {
      const jsonTeacher = await res.json();
      console.log(jsonTeacher);
      setTeacher(jsonTeacher.teacher);
      setClasses(jsonTeacher.teacher.teacherClasses);
      setSubject(jsonTeacher.subject);
    } else {
      toast.error("Failed to fetch classes");
    }
  };

  useEffect(() => {
    if (user) {
      getClasses();
    }
  }, [isLoaded, user]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#111827] to-black text-slate-200">
      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden md:block fixed left-4 top-4 bottom-4 w-64 z-50">
        <Sidebar
          home={() => push("/teacher/main")}
          assignments={() => push("/teacher/assignments-public")}
          account={() => push("/teacher/account/")}
        />
      </aside>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <aside
        className="
          md:hidden
          fixed bottom-4 left-4 right-4 z-50
          rounded-3xl
          bg-white/10 backdrop-blur-2xl
          border border-white/20
          shadow-[0_0_40px_rgba(99,102,241,0.25)]
        "
      >
        <Sidebar
          home={() => push("/teacher/main")}
          assignments={() => push("/teacher/assignments-public")}
          account={() => push("/teacher/account/")}
        />
      </aside>

      {/* ================= MAIN ================= */}
      <main
        className="
          md:ml-[18rem]
          px-4 sm:px-6 md:px-10
          py-6 sm:py-8
          pb-28 md:pb-8
          space-y-10
        "
      >
        {/* ================= HEADER ================= */}
        <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
              Your Classes
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl">
              Monitor performance, students, and assignments
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            {/* ===== Teacher Schedule Button ===== */}
            <button
              onClick={() => push("/teacher/teacher-schedule")}
              className="
                px-5 py-3 rounded-2xl
                bg-indigo-500/20
                text-indigo-300
                border border-indigo-400/30
                backdrop-blur-xl
                hover:bg-indigo-500/30
                hover:text-white
                transition
                shadow-[0_0_30px_rgba(99,102,241,0.35)]
              "
            >
              📅 Teacher Schedule
            </button>

            {/* ===== Academic Year Badge ===== */}
            <div
              className="
                px-5 py-3 rounded-2xl
                bg-white/10 backdrop-blur-xl
                border border-white/20
                text-sm text-slate-300
              "
            >
              Academic Year · 2025
            </div>
          </div>
        </header>

        {/* ================= CLASSES ================= */}
        <section
          className="
            rounded-3xl p-6 sm:p-8
            bg-white/10 backdrop-blur-2xl
            border border-white/20
            shadow-[0_0_60px_rgba(99,102,241,0.2)]
          "
        >
          <h3 className="text-2xl font-semibold text-white mb-6">
            Active Classes
          </h3>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {classes?.map((cls, index) => (
              <div
                key={index}
                className="
                  relative rounded-2xl
                  bg-white/10 backdrop-blur-xl
                  border border-white/20
                  shadow-[0_0_30px_rgba(99,102,241,0.15)]
                  hover:shadow-[0_0_50px_rgba(99,102,241,0.35)]
                  hover:-translate-y-1
                  transition-all duration-300
                "
              >
                <div className="absolute top-0 left-0 right-0" />

                <ClassesCard
                  AddHomework={() =>
                    push(`/teacher/assignments/${cls.classId}`)
                  }
                  RouteAssignments={() =>
                    push(`/teacher/assignments/${cls.classId}`)
                  }
                  ClassName={cls?.Class?.name}
                  Subject={subject?.subjectName}
                  ClassStudentsNum={cls?.Class?.students?.length}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};
export default Page;
