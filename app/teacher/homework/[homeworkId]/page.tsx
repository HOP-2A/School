"use client";

import Sidebar from "@/app/_component/SideBar";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type SubmissionType = {
  content: string;
  feedback: string | null;
  homeworkId: string;
  id: number;
  reviewedAt: string | null;
  score: number | null;
  studentId: string;
  submittedAt: string;
  student: {
    classId: string;
    clerkId: string;
    createdAt: string;
    email: string;
    id: string;
    name: string;
    class: {
      id: string;
      name: string;
      createdAt: string;
      teacherId: string;
      students: {
        name: string;
      }[];
    };
  };
  homework: {
    id: string;
    title: string;
    classId: string;
    createdAt: string;
    description: string;
    dueDate: string;
    teacherId: string;
    points: number;
  };
};

type HomeworkType = {
  id: string;
  title: string;
  classId: string;
  createdAt: string;
  description: string;
  dueDate: string;
  teacherId: string;
};

const Page = () => {
  const params = useParams();
  const homeworkId = params.homeworkId as string;
  const [homework, setHomework] = useState<HomeworkType>();
  const [submission, setSubmission] = useState<SubmissionType[]>();
  const { push } = useRouter();

  const BringHomework = async () => {
    const res = await fetch("/api/teacher/assignments/homework", {
      method: "POST",
      body: JSON.stringify({
        homeworkId: homeworkId,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setSubmission(data);
      setHomework(data?.[0].homework);
    }
  };

  useEffect(() => {
    BringHomework();
  }, []);

  return (
    <div className="flex gap-10">
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
      <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-6 py-10 text-slate-800 ml-70">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-md border border-slate-200">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            {homework?.title}
          </h1>
          <p className="text-sm text-slate-600 mt-2">{homework?.description}</p>

          <div className="flex items-center gap-3 mt-4 text-sm">
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
              {homework?.dueDate?.split("T")[0]}
            </span>
            <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
              Grade: {submission?.[0]?.homework?.points} pts
            </span>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium text-slate-900">
              Student Submissions
            </h2>
            <span className="text-sm text-slate-600">
              {submission?.length} /{" "}
              {submission?.[0]?.student?.class?.students.length} submitted
            </span>
          </div>

          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-[40%] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" />
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {submission?.map((submitted) => (
            <div
              key={submitted.id}
              className="group cursor-pointer bg-white rounded-xl p-4 border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <Avatar className="w-33 h-33">
                    <AvatarImage
                      className="w-33 h-33"
                      src="https://github.com/shadcn.png"
                    />
                    <AvatarFallback>{submitted?.student?.name}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                </div>

                <p className="mt-3 text-sm font-medium text-slate-900">
                  {submitted.student.name}
                </p>
                <p className="text-xs text-slate-500">Submitted</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
