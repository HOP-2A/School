"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

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
  Teacher: {
    email: string;
    id: string;
    name: string;
  };
};

type TeachersType = {
  classId: string;
  teacherId: string;
  Teacher: {
    email: string;
    id: string;
    name: string;
    subject: {
      id: string;
      subjectName: string;
      teacherId: string;
    };
  };
};

type TeacherType = {
  email: string;
  id: string;
  name: string;
};

const Page = () => {
  const params = useParams();
  const classId = params.classId as string;

  const [classData, setClassData] = useState<ClassType>();
  const [allTeachers, setAllTeachers] = useState<TeacherType[]>([]);
  const [teacherId, setTeacherId] = useState("");
  const [teachersData, setTeachersData] = useState<TeachersType[]>();
  const selected = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setTeacherId(value);
  };

  const BringAllTeachers = async () => {
    const res = await fetch("/api/admin/all-teachers");

    if (res.ok) {
      const data = await res.json();
      setAllTeachers(data);
    }
  };

  const BringClassData = async () => {
    const res = await fetch("/api/admin/admin-classes-bring", {
      method: "POST",
      body: JSON.stringify({
        classId: classId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setClassData(data);
    }
  };

  const BringTeachers = async () => {
    const res = await fetch("/api/admin/teachers-bring", {
      method: "POST",
      body: JSON.stringify({
        classId: classId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setTeachersData(data);
    }
  };

  const StudentDelete = async (studentId: string) => {
    const res = await fetch(
      `/api/admin/student-action/student-delete/${studentId}`,
      {
        method: "PUT",
      }
    );

    if (res.ok) {
      toast.success("Successfully deleted student from this class!");
    } else {
      toast.error("Something went wrong");
    }
  };

  const TeacherDelete = async (teacherId: string, classId: string) => {
    const res = await fetch(`/api/admin/teacher-delete`, {
      method: "DELETE",
      body: JSON.stringify({
        teacherId: teacherId,
        classId: classId,
      }),
    });

    if (res.ok) {
      toast.success("Successfully deleted teacher from this class!");
    } else {
      toast.error("Something went wrong");
    }
  };

  const AddTeacher = async () => {
    const res = await fetch(`/api/admin/add-teacher`, {
      method: "POST",
      body: JSON.stringify({
        teacherId: teacherId,
        classId: classData?.id,
      }),
    });

    if (res.ok) {
      toast.success("Successfully added teacher");
    }
  };

  useEffect(() => {
    BringClassData();
    BringTeachers();
    BringAllTeachers();
  }, []);

  const DeleteClass = async () => {
    const res1 = await fetch(`/api/admin/delete-class/${classData?.id}`, {
      method: "DELETE",
    });

    if (res1.ok) {
      toast.success("Successfully deleted class");
    }

    await fetch(`/api/admin/delete-class/${classData?.id}`, {
      method: "PUT",
    });
  };

  return (
    <div>
      <div className="p-6 max-w-5xl">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 uppercase tracking-wide ml-1 mb-8">
            Class: {classData?.name}
          </h2>

          {classData?.Teacher ? (
            <div className="flex items-center bg-gray-50 rounded-lg p-4 px-10 text-sm text-gray-700 gap-10">
              <div className="mr-6">
                <span className="font-medium">Homeroom Teacher :</span>{" "}
                {classData?.Teacher.name}
              </div>
              <div className="mr-6">
                <span className="font-medium">Email :</span>{" "}
                {classData?.Teacher.email}
              </div>
              <Button
                onClick={() => {
                  DeleteClass();
                }}
                className="bg-gray-800 py-1 px-6 text-sm border text-white hover:text-red-500 hover:bg-white hover:border-red-500 font-bold"
              >
                Delete Class
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex items-center bg-gray-50 rounded-lg p-4 px-10 text-sm text-gray-700 gap-10">
                {" "}
                No homeroom teacher
              </div>
              <Button
                onClick={() => {
                  DeleteClass();
                }}
                className="bg-gray-800 text-sm border text-white hover:text-red-500 hover:bg-white hover:border-red-500 font-bold"
              >
                Delete Class
              </Button>
            </div>
          )}
        </div>
        <div className="mb-8 overflow-x-auto rounded-xl border border-gray-200">
          <div className="flex justify-between items-center bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Students</h3>
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
                    <button
                      onClick={() => {
                        StudentDelete(student.id);
                      }}
                      className="text-red-600 hover:underline"
                    >
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
              {teachersData?.map((teacher) => (
                <tr
                  key={teacher.teacherId}
                  className="border-b border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-2 text-sm text-gray-900">
                    {teacher?.Teacher?.name}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600">
                    {teacher?.teacherId}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600">
                    {teacher?.Teacher.email}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600">
                    {teacher?.Teacher?.subject?.subjectName}
                  </td>
                  <td className="px-6 py-2 text-sm text-gray-600 flex gap-5">
                    <button
                      onClick={() => {
                        TeacherDelete(teacher?.teacherId, classData?.id!);
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className=" p-3 w-90 flex gap-5">
            <select
              className="border rounded-lg px-3 py-2 text-sm bg-gray-50 w-70 h-10 items-center"
              onChange={(e) => selected(e)}
            >
              <option value="">Select teacher</option>
              {allTeachers?.map((teacher) => (
                <option key={teacher?.id} value={teacher?.id}>
                  {teacher?.name}
                </option>
              ))}
            </select>
            <div>
              <Button
                className="bg-gray-800 text-white rounded-xl"
                onClick={() => {
                  AddTeacher();
                }}
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
