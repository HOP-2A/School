"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type ClassesType = {
  id: string;
  name: string;
  teacherId: string;
  students: {
    classId: string;
    clerkId: string;
    email: string;
    id: string;
    name: string;
  }[];
  teacher: {
    email: string;
    id: string;
    name: string;
  };
};

const Page = () => {
  const router = useRouter();
  const [classes, setClasses] = useState<ClassesType[] | null>(null);
  const { push } = useRouter();

  const Classes = async () => {
    const res = await fetch("/api/admin/admin-classes-bring", {
      method: "GET",
    });

    if (res.ok) {
      const data = await res.json();
      setClasses(data);
    }
  };

  useEffect(() => {
    Classes();
  }, []);
  return (
    <div className="flex-1 px-6 sm:px-10 py-8 space-y-10">
  
      {/* ================= CONTROL ================= */}
      <h2 className="text-3xl font-bold tracking-tight text-white">
        Control
      </h2>
  
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  
        {/* Manage Classes */}
        <div
          onClick={() => router.push("/admin/management")}
          className="
            cursor-pointer
            rounded-2xl p-6
            bg-white/10 backdrop-blur-xl
            border border-white/20
            shadow-[0_0_30px_rgba(99,102,241,0.2)]
            hover:shadow-[0_0_50px_rgba(99,102,241,0.35)]
            transition
          "
        >
          <h3 className="text-xl font-semibold text-white">
            Manage Classes
          </h3>
          <p className="text-slate-400 mt-2">
            Click to add students to classes →
          </p>
        </div>
  
        {/* Teacher Schedule */}
        <div
          onClick={() => router.push("/admin/teacher-schedule")}
          className="
            cursor-pointer
            rounded-2xl p-6
            bg-white/10 backdrop-blur-xl
            border border-white/20
            shadow-[0_0_30px_rgba(99,102,241,0.2)]
            hover:shadow-[0_0_50px_rgba(99,102,241,0.35)]
            transition
          "
        >
          <h3 className="text-xl font-semibold text-white">
            Teacher Schedule
          </h3>
          <p className="text-slate-400 mt-2">
            Click to manage teacher schedules →
          </p>
        </div>
  
        {/* Create Class */}
        <button
          onClick={() => push("/admin/addClass")}
          className="
            text-left
            rounded-2xl p-6
            bg-white/10 backdrop-blur-xl
            border border-white/20
            shadow-[0_0_30px_rgba(99,102,241,0.2)]
            hover:shadow-[0_0_50px_rgba(99,102,241,0.35)]
            transition
          "
        >
          <h3 className="text-lg font-semibold text-white">
            Create Class
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Click to add new class →
          </p>
        </button>
  
        {/* Create Subject */}
        <button
          onClick={() => push("/admin/addSubject")}
          className="
            text-left
            rounded-2xl p-6
            bg-white/10 backdrop-blur-xl
            border border-white/20
            shadow-[0_0_30px_rgba(99,102,241,0.2)]
            hover:shadow-[0_0_50px_rgba(99,102,241,0.35)]
            transition
          "
        >
          <h3 className="text-lg font-semibold text-white">
            Create Subject
          </h3>
          <p className="mt-1 text-sm text-slate-400">
            Click to add new subject →
          </p>
        </button>
      </div>
  
      {/* ================= CLASSES ================= */}
      <h2 className="text-3xl font-bold tracking-tight text-white">
        Classes
      </h2>
  
      <div
        className="
          max-w-5xl
          overflow-hidden
          rounded-2xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_40px_rgba(99,102,241,0.2)]
        "
      >
        <table className="w-full border-collapse">
          <thead className="bg-white/5">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                Class
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                Teacher
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                Students
              </th>
            </tr>
          </thead>
  
          <tbody>
            {classes?.map((cls) => (
              <tr
                key={cls.id}
                onClick={() => push(`/admin/classes/${cls.id}`)}
                className="
                  cursor-pointer
                  border-t border-white/10
                  hover:bg-white/5
                  transition
                "
              >
                <td className="px-6 py-3 text-sm font-medium text-white">
                  {cls.name}
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">
                  {cls.teacher ? cls.teacher.name : "No homeroom teacher"}
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">
                  {cls.students.length}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  
};
export default Page;
