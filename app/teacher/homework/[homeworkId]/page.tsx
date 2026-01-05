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
  status:string
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
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#111827] to-black text-slate-200">
    
        {/* ================= SIDEBAR ================= */}
        <Sidebar
          home={() => push("/teacher/main")}
          assignments={() => push("/teacher/assignments-public")}
          account={() => push("/teacher/account/")}
        />
    
        {/* ================= MAIN ================= */}
        <main
          className="
            md:ml-[18rem]
            px-3 sm:px-6 md:px-10
            py-6 sm:py-8
            pb-32 md:pb-8
            grid grid-cols-1 xl:grid-cols-[1fr_420px]
            gap-6 sm:gap-8 xl:gap-10
          "
        >
          {/* ================= LEFT ================= */}
          <div className="space-y-6 sm:space-y-8">
    
            {submission?.length !== 0 ? (
              <>
                {/* Homework Info */}
                <div
                  className="
                    rounded-2xl sm:rounded-3xl
                    p-5 sm:p-6
                    bg-white/10 backdrop-blur-2xl
                    border border-white/20
                    shadow-[0_0_40px_rgba(99,102,241,0.2)]
                  "
                >
                  <h1 className="text-xl sm:text-2xl font-semibold text-white">
                    {homework?.title}
                  </h1>
    
                  <p className="text-sm sm:text-base text-slate-400 mt-2">
                    {homework?.description}
                  </p>
    
                  <div className="flex flex-wrap gap-2 mt-4 text-xs sm:text-sm">
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                      Due · {homework?.dueDate?.split("T")[0]}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20">
                      {submission?.[0]?.homework?.points} pts
                    </span>
                  </div>
                </div>
    
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-base sm:text-lg font-semibold text-white">
                      Student Submissions
                    </h2>
                    <span className="text-xs sm:text-sm text-slate-400">
                      {submission?.length} /{" "}
                      {submission?.[0]?.student?.class?.students.length}
                    </span>
                  </div>
    
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-400 to-violet-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>
    
                {/* Students */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
                  {submission?.map((submitted) => (
                    <div
                      key={submitted.id}
                      onClick={() => setSelectedStudent(submitted)}
                      className="
                        cursor-pointer
                        rounded-xl sm:rounded-2xl
                        p-3 sm:p-4
                        bg-white/10 backdrop-blur-xl
                        border border-white/20
                        hover:bg-white/15
                        transition
                        text-center
                      "
                    >
                      <Avatar className="w-14 h-14 sm:w-20 sm:h-20 mx-auto">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>
                          {submitted?.student?.name}
                        </AvatarFallback>
                      </Avatar>
    
                      <p className="mt-2 sm:mt-3 font-medium text-white text-xs sm:text-sm">
                        {submitted.student.name}
                      </p>
            
                      <p className="text-[10px] sm:text-xs text-emerald-400 mt-1">
                        Submitted
                      </p>
                      <div>{submitted.status}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-slate-400">
                No one has submitted yet.
              </div>
            )}
          </div>
    
          {/* ================= RIGHT · GRADING ================= */}
          <aside
            className="
              relative xl:sticky xl:top-8
              h-fit
              rounded-2xl sm:rounded-3xl
              p-5 sm:p-6
              bg-white/10 backdrop-blur-2xl
              border border-white/20
              shadow-[0_0_40px_rgba(99,102,241,0.25)]
            "
          >
            {selectedStudent === null ? (
              <div className="h-[240px] flex flex-col items-center justify-center text-center">
                <h3 className="text-base sm:text-lg font-semibold text-white">
                  Select a student
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-2">
                  Click a student to review and grade.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-5 sm:gap-6">
    
                <div className="border-b border-white/10 pb-3">
                  <h3 className="text-base sm:text-lg font-semibold text-white">
                    Student Submission
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400">
                    {selectedStudent?.student?.name}
                  </p>
                </div>
    
                {/* Image */}
                <div
                  className="
                    rounded-xl p-3 sm:p-4
                    bg-black/30 border border-white/20
                    cursor-pointer
                  "
                  onClick={() => setOpen(!open)}
                >
                  <label className="text-[10px] sm:text-xs uppercase text-slate-400">
                    Submitted File
                  </label>
    
                  <img
                    src={selectedStudent?.content}
                    className={`rounded-lg mt-2 transition-all ${
                      open
                        ? "w-full max-h-[480px] object-contain"
                        : "w-full h-40 object-cover"
                    }`}
                  />
    
                  {!open && (
                    <p className="text-[10px] sm:text-xs text-slate-400 mt-2">
                      Tap to expand
                    </p>
                  )}
                </div>
    
                <div className="rounded-xl p-3 bg-white/10 border border-white/20 text-sm">
                  {selectedStudent?.description}
                </div>
    
                {/* Grade */}
                <div>
                  <label className="text-xs uppercase text-slate-400">
                    Grade
                  </label>
                  <Input
                    name="grade"
                    value={inputs.grade}
                    onChange={handleInputs}
                    className="mt-1 bg-white/10 border-white/20 text-white h-11"
                  />
                </div>
    
                {/* Feedback */}
                <div>
                  <label className="text-xs uppercase text-slate-400">
                    Feedback
                  </label>
                  <Input
                    name="feedback"
                    value={inputs.feedback}
                    onChange={handleInputs}
                    className="mt-1 bg-white/10 border-white/20 text-white py-5"
                  />
                </div>
    
                <button
                  onClick={() => Update(selectedStudent?.id)}
                  className="
                    mt-2 w-full py-3 rounded-xl
                    bg-gradient-to-r from-indigo-500 to-violet-600
                    text-white font-semibold
                    hover:opacity-90
                    transition
                  "
                >
                  Submit Grade
                </button>
              </div>
            )}
          </aside>
        </main>
      </div>
    );
    
    
};

export default Page;
