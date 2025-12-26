"use client";
import Sidebar from "@/app/_component/SideBar";
import { useRouter } from "next/navigation";
import { FaEnvelope, FaChalkboardTeacher } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type TeacherType = {
  id: string;
  name: string;
  email: string;
  teacherClasses: {
    classId: string;
    teacherId: string;
    class: {
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

const Page = () => {
  const { push } = useRouter();
  const [teacher, setTeacher] = useState<TeacherType>();
  const [subject, setSubject] = useState<SubjectType>();
  const { user, isLoaded } = useUser();

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
      setSubject(jsonTeacher.subject);
    } else {
      console.log("Failed to fetch classes");
    }
  };
  useEffect(() => {
    getClasses();
  }, [isLoaded, user]);
  return (
    <div>
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
        <main className="max-w-4xl mx-auto p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
            <div className="relative w-fit h-fit rounded-full overflow-hidden border-4 border-pink-500">
              <Avatar className="w-33 h-33">
                <AvatarImage
                  className="w-32 h-32"
                  src="https://github.com/shadcn.png"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold">{teacher?.name}</h1>
              <p className="mt-2 text-gray-700">{subject?.subjectName}</p>
            </div>
          </div>
          <div className="flex justify-center md:justify-start gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-800">
              <FaEnvelope /> {teacher?.email}
            </div>
            <div className="flex items-center gap-2 text-gray-800">
              <FaChalkboardTeacher /> {teacher?.teacherClasses?.length} Classes
            </div>
          </div>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Classes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {teacher?.teacherClasses?.map((subj) => (
                <div
                  key={subj?.classId}
                  className="p-4 rounded-xl border border-gray-200 hover:shadow-lg transition cursor-pointer text-center"
                >
                  <h3 className="text-lg font-medium text-pink-500">
                    {subj.class?.name}
                  </h3>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Page;
