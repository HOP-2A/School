"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type TeacherType = {
  id: string;
  name: string;
  password: string;
  email: string;
  classes: {
    createdAt: string;
    id: string;
    name: string;
    students: {
      id: string;
      classId: string;
      clerkId: string;
      createdAt: string;
      email: string;
      name: string;
    }[];
    teacherId: string;
  }[];
};
const Page = () => {
  const router = useRouter();
  const [teachers, setTeachers] = useState<TeacherType[]>([]);
  const getAllTeachers = async () => {
    const res = await fetch("/api/teacher/getAllTeachers");
    const response = await res.json();
    if (res.ok) {
      setTeachers(response);
    }
  };
  useEffect(() => {
    getAllTeachers();
  }, []);

  return (
    <div className="px-6 sm:px-10 py-8 space-y-8">
  
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Choose a Teacher
        </h1>
        <p className="text-slate-400 mt-2">
          Select a teacher to view or manage their schedule
        </p>
      </div>
  
      {/* TEACHER GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            onClick={() =>
              router.push(`/admin/teacher-schedule/${teacher.id}`)
            }
            className="
              cursor-pointer
              rounded-2xl p-5
              bg-white/10 backdrop-blur-xl
              border border-white/20
              shadow-[0_0_30px_rgba(99,102,241,0.2)]
              hover:shadow-[0_0_50px_rgba(99,102,241,0.35)]
              hover:-translate-y-1
              transition
            "
          >
            <div className="flex items-center gap-4">
  
              {/* AVATAR */}
              <div
                className="
                  h-12 w-12
                  rounded-full
                  bg-indigo-500/30
                  flex items-center justify-center
                  font-bold text-indigo-200
                  shadow-[0_0_15px_rgba(99,102,241,0.5)]
                "
              >
                {teacher.name?.[0]?.toUpperCase()}
              </div>
  
              {/* INFO */}
              <div>
                <div className="font-semibold text-lg text-white">
                  {teacher.name}
                </div>
                <div className="text-sm text-slate-400">
                  {teacher.email}
                </div>
              </div>
            </div>
  
            {/* ACTION */}
            <div className="mt-5 text-indigo-300 text-sm font-medium">
              View Schedule →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};
export default Page;
