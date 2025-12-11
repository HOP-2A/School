"use client";

import ClassesPage from "@/app/_component/AssignmentPageCard";
import Sidebar from "@/app/_component/SideBar";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type classesType = {
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

type TeacherType = {
  id: string;
  name: string;
  teacherId: string;
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
        setClasses(jsonTeacher.teacher.classes);
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
      <div>
        <section className="p-6 bg-gray-100 ml-70 mt-5 flex gap-3 flex-col">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Your Classes
          </h2>
          <div className="flex gap-6">
            {classes?.map((cls) => (
              <ClassesPage
                route={() => {
                  push(`/teacher/assignments/${cls.id}`);
                }}
                key={cls.id}
                classname={cls.name}
                studentNum={cls.students.length}
                submission={70}
              />
            ))}
          </div>
        </section>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default Page;
