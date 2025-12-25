"use client";

import { useAuth } from "@/app/provider/AuthProvider";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
type Subject = {
  subjectName: string;
  teacher: {
    name: string;
    email: string;
  };
  id: string;
};
type AssignmentsType = {
  classId: string;
  createdAt: string;
  description: string;
  dueDate: string;
  id: string;
  teacherId: string;
  title: string;
  teacher: {
    id: string;
    subject: {
      id: string;
    };
  };
};
type HomeworkType = {
  content: string;
  description: string;

  feedback: string;
  homeworkId: string;
  id: string;
  reviewedAt: Date;

  score: Number;
  status: string;

  studentId: string;

  submittedAt: Date;
};
const Page = () => {
  const router = useRouter();
  const params = useParams();
  const [subjectInfo, setSubjectInfo] = useState<Subject | null>(null);

  const { user: clerkUser } = useUser();
  const [assignments, setAssignments] = useState<AssignmentsType[]>();
  const [homeworkSub, setHomeworkSub] = useState<HomeworkType[]>([]);
  const [homeworkSubmission, setHomeworkSubmission] =
    useState<AssignmentsType[]>();
  const { user } = useAuth(clerkUser?.id);
  const subjectId = params.subjectId;
  const getSubjectInfo = async () => {
    const res = await fetch(
      `http://localhost:3000/api/subject/unique/${subjectId}`,
      {
        method: "GET",
      }
    );
    const response = await res.json();
    setSubjectInfo(response);
  };
  const getHomeworkSubmission = async () => {
    const res = await fetch(`/api/homeworkSubmission/getall`, {
      method: "GET",
    });

    if (res.ok) {
      const JsonData = await res.json();
      setHomeworkSubmission(JsonData);
    }
  };
  const GetAssignments = async () => {
    const res = await fetch(`/api/homework/certainSubject/${user?.classId}`, {
      method: "POST",
      body: JSON.stringify({
        classId: user?.classId,
      }),
    });

    if (res.ok) {
      const JsonData = await res.json();
      setAssignments(JsonData);
    }
  };
  const GetSubmissions = async () => {
    const res = await fetch(
      "/api/homeworkSubmission/getIndividualSubmissions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId: user?.id,
        }),
      }
    );

    if (res.ok) {
      const JsonData = await res.json();
      setHomeworkSub(JsonData);
    }
  };
  console.log(homeworkSubmission);
  useEffect(() => {
    if (user) {
      GetSubmissions();
      getHomeworkSubmission();
      getSubjectInfo();
      GetAssignments();
    }
  }, [user]);
  if (!subjectInfo) return <div className="p-10 text-gray-500">Loading...</div>;

  const { subjectName, teacher } = subjectInfo;

  const filterred = assignments?.filter((assignment) => {
    return assignment?.teacher?.subject?.id === subjectId;
  });
  const homework = homeworkSub?.map((hw) => hw.homeworkId);
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-100 to-slate-200">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r shadow-sm p-6 flex flex-col gap-8">
        <h1 className="text-3xl font-extrabold text-blue-600 tracking-tight">
          LMS
        </h1>
  
        <nav className="flex flex-col gap-2">
          {[
            { label: "Home", icon: "🏠", path: "/student/dashboard" },
            { label: "All Homeworks", icon: "📚", path: `/student/classroom/${user?.classId}` },
            { label: "Profile", icon: "👤", path: "/student/profile" },
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
  
      {/* MAIN */}
      <main className="flex-1 p-10 space-y-10">
  
        {/* HEADER */}
        <header>
          <h1 className="text-4xl font-bold text-gray-900">
            {subjectName}
          </h1>
          <p className="text-gray-500 mt-1 text-lg">
            Welcome to your course dashboard
          </p>
        </header>
  
        {/* TEACHER CARD */}
        <section className="bg-white rounded-3xl shadow-sm border p-6 max-w-lg">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Instructor
          </h2>
  
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-xl font-bold">
              {teacher.name.charAt(0)}
            </div>
  
            <div>
              <p className="text-lg font-medium text-gray-900">
                {teacher.name}
              </p>
              <p className="text-gray-500 text-sm">
                {teacher.email}
              </p>
            </div>
          </div>
        </section>
  
        {/* HOMEWORK */}
        <section className="bg-white rounded-3xl shadow-sm border p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-semibold text-gray-900">
              Homework
            </h2>
            <span className="text-sm text-gray-500">
              {filterred?.length || 0} assignments
            </span>
          </div>
  
          <div className="grid gap-6">
            {filterred?.map((assignment) => {
              const isOverdue = new Date(assignment.dueDate) < new Date();
              const submission = homeworkSub.find(
                (hw) => hw.homeworkId === assignment.id
              );
  
              return (
                <div
                  key={assignment.id}
                  className="relative p-6 rounded-2xl border bg-white hover:shadow-lg transition"
                >
                  {/* STATUS BAR */}
                  <div
                    className={`absolute left-0 top-0 h-full w-1 rounded-l-2xl ${
                      isOverdue ? "bg-red-500" : "bg-green-500"
                    }`}
                  />
  
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {assignment.title}
                    </h3>
  
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        isOverdue
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {isOverdue ? "Overdue" : "Active"}
                    </span>
                  </div>
  
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    {assignment.description}
                  </p>
  
                  <div className="flex items-center justify-between mt-6 text-sm">
                    <span className="text-gray-500">
                      📅 Due:{" "}
                      {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
  
                    {submission ? (
                      submission.status === "CHECKED" ? (
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-semibold">
                          Reviewed
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              router.push(
                                `/student/classroom/${user?.classId}/${assignment.id}/edit`
                              )
                            }
                            className="px-4 py-2 text-sm font-medium bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                          >
                            ✏️ Edit
                          </button>
                          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                            ⏳ Reviewing
                          </span>
                        </div>
                      )
                    ) : (
                      <button
                        onClick={() =>
                          router.push(
                            `/student/classroom/${user?.classId}/${assignment.id}`
                          )
                        }
                        className="px-5 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
                      >
                        Review
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
  
};
export default Page;
