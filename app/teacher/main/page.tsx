"use client";

import Sidebar from "@/app/_component/SideBar";
import ClassesCard from "@/app/_component/TeacherClassesCards";
import { prisma } from "@/lib/db";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

type DecodedTokenType = {
  data: {
    id: string;
    name: string;
    teacherId: string;
    password: string;
    email: string;
    classes: string[];
    subject: {
      id: string;
      subjectName: string;
    };
  };
};
type TeacherType = {
  id: string;
  name: string;
  teacherId: string;
  password: string;
  email: string;
  classes: string[];
  subject: {
    id: string;
    subjectName: string;
    teacherId: string;
    createdAt: string;
  };
};
type classesType = {
  id: string;
  name: string;
  teacherId: string;
  createdAt: string;
  students: {
    id: string;
    name: string;
    studentId: string;
    classId: string;
    email: string;
  }[];
}[];

const Page = () => {
  const { push } = useRouter();
  const [classes, setClasses] = useState<classesType>();
  const [teacher, setTeacher] = useState<TeacherType>();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const decodedToken: DecodedTokenType = jwtDecode(token!);
    if (!token) return;
    const getClasses = async () => {
      const res = await fetch("/api/teacher/class", {
        method: "POST",
        body: JSON.stringify({
          teacherId: decodedToken.data.id,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        setClasses(json.classes);

        setTeacher(json);
      } else {
        console.log("Failed to fetch classes");
      }
    };

    getClasses();
  }, []);

  return (
    <div className="flex gap-1 w-screen">
      <div>
        <Sidebar
          home={() => {
            push("/teacher/main");
          }}
          assignments={() => {}}
          account={() => {
            push("/teacher/account/");
          }}
        />
      </div>
      <div>
        <section className="p-6 bg-gray-50 ml-70 mt-5 w-fit flex flex-col gap-3">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Your Classes
          </h2>
          {classes?.map((cls) => (
            <ClassesCard
              key={cls.id}
              AddHomework={() => {
                push("/teacher/assignments/");
              }}
              RouteAssignments={() => {
                push("/teacher/assignments/");
              }}
              ClassName={cls.name}
              Subject={teacher?.subject.subjectName!}
              ClassStudentsNum={cls.students.length}
            />
          ))}
        </section>
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default Page;
