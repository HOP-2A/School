"use client";

import Sidebar from "@/app/_component/SideBar";
import ClassesCard from "@/app/_component/TeacherClassesCards";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

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
        console.log(jsonTeacher,"gg")
        setTeacher(jsonTeacher.teacher);
        setClasses(jsonTeacher.teacher.teacherClasses);
        setSubject(jsonTeacher.subject);
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
        <section className="p-6 bg-gray-50 ml-70 mt-5 w-102 flex gap-3 flex-wrap ">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            Your Classes
          </h2>
          {classes?.map((cls,index) => (
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
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default Page;
