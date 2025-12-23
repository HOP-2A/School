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
    <div className="flex-1 p-10">
      <h2 className="text-3xl font-bold mb-6">Control</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div
          onClick={() => router.push("/admin/management")}
          className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-xl transition"
        >
          <h3 className="text-xl font-semibold">Manage Classes</h3>
          <p className="text-gray-500 mt-2">
            Click to add students to classes →
          </p>
        </div>
        <div
          onClick={() => router.push("/admin/teacher-schedule")}
          className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-xl transition"
        >
          <h3 className="text-xl font-semibold">Teacher Schedule</h3>
          <p className="text-gray-500 mt-2">
            Click to manage teacher schedules →
          </p>
        </div>
      </div>

      <h2 className="text-3xl font-bold mb-6 mt-8">Classes</h2>
      <div className="my-6 max-w-4xl overflow-y-auto rounded-xl border border-gray-200">
        <table className="w-full border-collapse bg-white">
          <thead className="sticky top-0 bg-gray-50 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Class
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Teacher
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                Students
              </th>
            </tr>
          </thead>

          <tbody>
            {classes?.map((cls) => (
              <tr
                key={cls.id}
                onClick={() => push(`/admin/classes/${cls.id}`)}
                className="cursor-pointer border-b border-gray-200 hover:bg-gray-50 transition"
              >
                <td className="px-6 py-2 text-sm font-medium text-gray-900">
                  {cls.name}
                </td>
                <td className="px-6 py-2 text-sm text-gray-600">
                  {cls.teacher.name}
                </td>
                <td className="px-6 py-2 text-sm text-gray-600">
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
