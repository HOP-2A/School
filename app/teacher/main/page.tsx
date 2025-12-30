"use client";

import Sidebar from "@/app/_component/SideBar";
import ClassesCard from "@/app/_component/TeacherClassesCards";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
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

  useEffect(() => {
    const getClasses = async () => {
      if (!isLoaded || !user || loading) return;

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
        setSubject(jsonTeacher.subject);
      } else {
        toast.error("Failed to fetch classes");
      }
    };

    getClasses();
  }, [isLoaded, user]);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-sm">
        <Sidebar
          home={() => push("/teacher/main")}
          assignments={() => push("/teacher/assignments-public")}
          account={() => push("/teacher/account/")}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Classes Section */}
        <section className="bg-white rounded-xl shadow-sm p-6 mb-10">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Your Classes
          </h2>
          {classes?.map((cls, index) => (
            <ClassesCard
              key={index}
              AddHomework={() => {
                push(`/teacher/assignments/${cls.classId}`);
              }}
              RouteAssignments={() => {
                push(`/teacher/assignments/${cls.classId}`);
              }}
              ClassName={cls?.Class?.name}
              Subject={subject?.subjectName}
              ClassStudentsNum={cls?.Class?.students?.length}
            />
          ))}
        </section>

        {/* Schedule Section */}
        <section className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-2xl font-semibold text-gray-800">
              Teacher Schedule
            </h1>

            <select
              value={selectedDay}
              onChange={handleSelect}
              className="mt-4 sm:mt-0 border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="All Days">All Days</option>
              <option value="Monday">Monday</option>
              <option value="Tuesday">Tuesday</option>
              <option value="Wednesday">Wednesday</option>
              <option value="Thursday">Thursday</option>
              <option value="Friday">Friday</option>
            </select>
          </div>

          {/* Empty State */}
          {schedules.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No schedule available.
            </p>
          )}

          {/* Info */}
          {schedules.length > 0 && (
            <p className="text-gray-600 mb-4">
              You have <span className="font-medium">{schedules.length}</span>{" "}
              scheduled days.
            </p>
          )}

          {filteredSchedules.length > 0 && (
            <p className="text-gray-600 mb-6">
              Showing{" "}
              <span className="font-medium">{filteredSchedules.length}</span>{" "}
              schedule{filteredSchedules.length > 1 ? "s" : ""}.
            </p>
          )}
          <div>
            {filteredSchedules.length === 0 && (
              <p className="text-center text-gray-500">
                No schedule available for the selected day.
              </p>
            )}
          </div>
          {/* Schedule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSchedules.map((schedule) => (
              <div
                key={schedule.id}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                <p className="text-gray-700">
                  <span className="font-medium">Day:</span> {schedule.day}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Start:</span>{" "}
                  {schedule.startTime}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">End:</span> {schedule.endTime}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Class:</span> {schedule.classId}
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
