"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type ClassType = {
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
  const params = useParams();
  const classId = params.classId as string;

  const [classData, setClassData] = useState<ClassType>();

  const BringClassData = async () => {
    const res = await fetch("/api/admin/admin-classes-bring", {
      method: "POST",
      body: JSON.stringify({
        classId: classId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setClassData(data);
    }
  };

  useEffect(() => {
    BringClassData();
  }, []);
  return (
    <div>
      <div className="p-6 max-w-5xl">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide ml-1 mb-8">
            Class: 1A
          </h2>

          <div className="flex items-center bg-gray-50 rounded-lg p-4 px-10 text-sm text-gray-700 gap-10">
            <div className="mr-6">
              <span className="font-medium">Homeroom Teacher :</span>{" "}
              {classData?.teacher.name}
            </div>
            <div className="mr-6">
              <span className="font-medium">Email :</span>{" "}
              {classData?.teacher.email}
            </div>
          </div>
        </div>
        <div className="mb-8 overflow-x-auto rounded-xl border border-gray-200">
          <table className="w-full border-collapse bg-white">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  Grade
                </th>
                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {classData?.students.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-2 text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600">
                    {student.id}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600">
                    {student.email}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600">
                    {classData?.name && classData?.name.match(/\d+/)
                      ? classData?.name.match(/\d+/)![0]
                      : "-"}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600 flex gap-5">
                    <button className="mr-2 text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200">
          <div className="flex justify-between items-center bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Teachers</h3>
            <button className="text-sm font-medium text-black hover:underline">
              + Add Teacher
            </button>
          </div>
          <table className="w-full border-collapse bg-white">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr>
                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  Subjects
                </th>
                <th className="px-6 py-2 text-left text-xs font-semibold text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {/* {teachers.map((teacher) => (
                <tr
                  key={teacher.id}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-2 text-sm text-gray-900">
                    {teacher.name}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600">
                    {teacher.employeeId}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600">
                    {teacher.subjects.join(", ")}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600">
                    <button className="mr-2 text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;
