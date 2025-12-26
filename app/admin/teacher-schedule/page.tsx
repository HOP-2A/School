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
    const router  = useRouter()
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
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Choose a Teacher</h1>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {teachers.map((teacher) => (
          <div
            key={teacher.id}
            onClick={() =>
              router.push(`/admin/teacher-schedule/${teacher.id}`)
            }
            className="cursor-pointer bg-white rounded-xl border p-5 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                {teacher.name?.[0]?.toUpperCase()}
              </div>
  
              <div>
                <div className="font-semibold text-lg">
                  {teacher.name}
                </div>
                <div className="text-sm text-gray-500">
                  {teacher.email}
                </div>
              </div>
            </div>
  
            <div className="mt-4 text-blue-600 text-sm font-medium">
              View Schedule →
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
};
export default Page;
