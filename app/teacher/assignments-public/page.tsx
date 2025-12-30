"use client";

import ClassesPage from "@/app/_component/AssignmentPageCard";
import Sidebar from "@/app/_component/SideBar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

const Page = () => {
  const { push } = useRouter();
  const [classes, setClasses] = useState<classesType>();
  const [teacher, setTeacher] = useState<TeacherType>();

  const { user, isLoaded } = useUser();
  useEffect(() => {
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
        setClasses(jsonTeacher.teacher.teacherClasses);
      } else {
        console.log("Failed to fetch classes");
      }
    };

    getClasses();
  }, [isLoaded, user]);
  return (
    <div className="flex gap-1 w-screen">
      <div>
        <Sidebar
          home={() => {
            push("/teacher/main");
          }}
          assignments={() => {
            push("/teacher/assignments-public");
          }}
          account={() => {
            push("/teacher/account/");
          }}
        />
      </div>
      <div className="ml-70">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Your Classes</h2>
        <h1 className=" font-semibold mb-6 text-gray-800 ">
          Click to see assignments →
        </h1>
        <div className="flex gap-6">
          {classes?.map((cls,index) => (
            <div
              key={index}
              className="p-4 rounded-xl border border-gray-200 hover:shadow-lg transition cursor-pointer text-center aspect-[6/1]"
              onClick={() => {
                push(`/teacher/assignments/${cls?.classId}`);
              }}
            >
              <h3 className="text-lg font-medium text-pink-500">
                {cls?.Class.name}
              </h3>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default Page;
