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
  teacher: {
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
    <div className="px-6 sm:px-10 py-8 max-w-6xl mx-auto space-y-10">
  
      {/* ================= CLASS HEADER ================= */}
      <div className="space-y-4">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Class: {classData?.name}
        </h2>
  
        {classData?.teacher ? (
          <div
            className="
              flex flex-wrap items-center gap-6
              rounded-2xl
              bg-white/10 backdrop-blur-xl
              border border-white/20
              p-6
            "
          >
            <div className="text-slate-300">
              <span className="font-medium text-white">Homeroom Teacher:</span>{" "}
              {classData?.teacher.name}
            </div>
            <div className="text-slate-300">
              <span className="font-medium text-white">Email:</span>{" "}
              {classData?.teacher.email}
            </div>
  
            <Button
              onClick={DeleteClass}
              className="
                ml-auto
                px-6 py-2
                rounded-xl
                bg-red-500/20
                border border-red-400/30
                text-red-300
                hover:bg-red-500/30
                hover:text-white
                transition
              "
            >
              Delete Class
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <div
              className="
                rounded-2xl
                bg-white/10 backdrop-blur-xl
                border border-white/20
                p-6
                text-slate-400
              "
            >
              No homeroom teacher
            </div>
  
            <Button
              onClick={DeleteClass}
              className="
                px-6 py-2
                rounded-xl
                bg-red-500/20
                border border-red-400/30
                text-red-300
                hover:bg-red-500/30
                hover:text-white
                transition
              "
            >
              Delete Class
            </Button>
          </div>
        )}
      </div>
  
      {/* ================= STUDENTS ================= */}
      <div
        className="
          rounded-2xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_40px_rgba(99,102,241,0.2)]
          overflow-hidden
        "
      >
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Students</h3>
        </div>
  
        <table className="w-full border-collapse">
          <thead className="bg-white/5">
            <tr>
              {["Name", "ID", "Email", "Grade", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {classData?.students.map((student) => (
              <tr
                key={student.id}
                className="
                  border-t border-white/10
                  hover:bg-white/5
                  transition
                "
              >
                <td className="px-6 py-3 text-sm text-white">
                  {student.name}
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">
                  {student.id}
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">
                  {student.email}
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">
                  {classData?.name && classData?.name.match(/\d+/)
                    ? classData?.name.match(/\d+/)![0]
                    : "-"}
                </td>
                <td className="px-6 py-3 text-sm">
                  <button
                    onClick={() => StudentDelete(student.id)}
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  
      {/* ================= TEACHERS ================= */}
      <div
        className="
          rounded-2xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_40px_rgba(99,102,241,0.2)]
          overflow-hidden
        "
      >
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Teachers</h3>
        </div>
  
        <table className="w-full border-collapse">
          <thead className="bg-white/5">
            <tr>
              {["Name", "ID", "Email", "Subjects", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-3 text-left text-xs font-semibold text-slate-400 uppercase"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
  
          <tbody>
            {teachersData?.map((teacher) => (
              <tr
                key={teacher.teacherId}
                className="
                  border-t border-white/10
                  hover:bg-white/5
                  transition
                "
              >
                <td className="px-6 py-3 text-sm text-white">
                  {teacher?.Teacher?.name}
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">
                  {teacher?.teacherId}
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">
                  {teacher?.Teacher.email}
                </td>
                <td className="px-6 py-3 text-sm text-slate-400">
                  {teacher?.Teacher?.subject?.subjectName}
                </td>
                <td className="px-6 py-3 text-sm">
                  <button
                    onClick={() =>
                      TeacherDelete(teacher?.teacherId, classData?.id!)
                    }
                    className="text-red-400 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {/* ADD TEACHER */}
        <div className="flex flex-wrap gap-4 p-6 border-t border-white/10">
          <select
            onChange={(e) => selected(e)}
            className="
              w-64
              rounded-xl
              px-4 py-2
              bg-white/10
              border border-white/20
              text-slate-200
              text-sm
              backdrop-blur-xl
              focus:outline-none
              focus:ring-2
              focus:ring-indigo-500/50
            "
          >
            <option value="">Select teacher</option>
            {allTeachers?.map((teacher) => (
              <option key={teacher?.id} value={teacher?.id}>
                {teacher?.name}
              </option>
            ))}
          </select>
  
          <Button
            onClick={AddTeacher}
            className="
              px-6 py-2
              rounded-xl
              bg-indigo-500/30
              border border-indigo-400/30
              text-indigo-200
              hover:bg-indigo-500/50
              hover:text-white
              transition
              shadow-[0_0_20px_rgba(99,102,241,0.4)]
            "
          >
            Add
          </Button>
        </div>
      </div>
    </div>
  );
  
};

export default Page;
