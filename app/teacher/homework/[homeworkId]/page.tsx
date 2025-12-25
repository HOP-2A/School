"use client";

import Sidebar from "@/app/_component/SideBar";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type SubmissionType = {
  description: string;
  content: string;
  feedback: string | null;
  homeworkId: string;
  id: string;
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
  const [selectedStudent, setSelectedStudent] = useState<SubmissionType | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [inputs, setInputs] = useState({
    grade: 0,
    feedback: "",
  });

  const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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
      setHomework(data?.[0]?.homework ?? null);
    }
  };

  useEffect(() => {
    BringHomework();
  }, []);

  const Update = async (submissionId: string) => {
    const res = await fetch("/api/teacher/homework", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grade: inputs.grade,
        feedback: inputs.feedback,
        submissionId: submissionId,
      }),
    });

    if (res.ok) {
      toast.success("successfully reviewed");
      setInputs({
        grade: selectedStudent?.score!,
        feedback: selectedStudent?.feedback!,
      });
    }
  };

  const totalStudents = submission?.[0]?.student?.class?.students?.length ?? 0;
  const submittedCount = submission?.length ?? 0;

  const progressPercent =
    totalStudents > 0 ? (submittedCount / totalStudents) * 100 : 0;

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
      <div>
        {submission?.length !== 0 ? (
          <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 px-6 py-10 text-slate-800 ml-70 shadow-lg">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-md border border-slate-200">
              <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                {homework?.title}
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                {homework?.description}
              </p>

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
                <div
                  className="h-full w-[40%] bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="max-w-4xl mx-auto mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {submission?.map((submitted) => (
                <div
                  onClick={() => {
                    setSelectedStudent(submitted);
                  }}
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
                        <AvatarFallback>
                          {submitted?.student?.name}
                        </AvatarFallback>
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
        ) : (
          <div className="ml-70">No One Submitted</div>
        )}
      </div>
      <div className="grid gap-6 h-full">
        <div className="bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 p-6 shadow-lg sticky top-6 h-fit w-200 overflow-y-auto">
          {selectedStudent === null ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
              <h3 className="text-lg font-semibold text-gray-600">
                Select a student
              </h3>
              <p className="mt-2 max-w-xs text-sm">
                Choose a student from the list to view and grade their
                submission.
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full gap-6">
              <div className="border-b pb-3">
                <h3 className="text-lg font-semibold">Student Submission</h3>
                <p className="text-sm text-gray-500">
                  {selectedStudent?.student?.name}
                </p>
              </div>

              <div
                className="bg-gray-50 border border-gray-400 rounded-xl p-4 min-h-[160px]"
                onClick={() => {
                  setOpen(!open);
                }}
              >
                <label className="text-xs font-semibold text-gray-600 uppercase">
                  📄 Submitted assignment content
                </label>
                <img
                  src={selectedStudent?.content}
                  alt="alt"
                  onClick={() => setOpen(!open)}
                  className={`cursor-pointer rounded-lg border transition-all duration-200 ${
                    open
                      ? "w-full max-h-[600px] object-contain z-[999999] bg-black/70"
                      : "w-48 h-32 object-cover"
                  }`}
                />
                {!open && (
                  <p className="text-xs text-gray-500 mt-2">
                    Click image to expand
                  </p>
                )}
              </div>
              <div className="rounded-md border border-gray-400 py-2 px-2">
                {selectedStudent?.description}
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Grade
                  </label>
                  <Input
                    onChange={(e) => {
                      handleInputs(e);
                    }}
                    value={inputs.grade}
                    name="grade"
                    placeholder="Enter grade..."
                    className="border border-gray-400 z-0"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-600 uppercase">
                    Feedback
                  </label>
                  <Input
                    onChange={(e) => {
                      handleInputs(e);
                    }}
                    value={inputs.feedback}
                    name="feedback"
                    className="border border-gray-400 py-8"
                    placeholder="Enter feedback..."
                  />
                </div>
              </div>

              <div className="mt-auto flex justify-end gap-3">
                <button
                  onClick={() => {
                    Update(selectedStudent?.id);
                  }}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-violet-500 to-blue-500 text-white text-sm font-medium hover:opacity-90"
                >
                  Submit Grade
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;
