"use client";

import { useAuth } from "@/app/provider/AuthProvider";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";

type Submission = {
  content: string[] | string;
  description: string;
  feedback?: string | null;
  homeworkId: string;
  id: string;
  reviewedAt?: string | null;
  score?: number | null;
  status: string;
  studentId: string;
  submittedAt: string;
};

type HomeworkData = {
  status: number;
  submissions: Submission[];
  title?: string;
  dueDate?: string;
  description?: string;
};

const Page = () => {
  const params = useParams();
  const assignmentId = params.assignmentId;
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const router = useRouter();

  const [homeworkData, setHomeworkData] = useState<HomeworkData | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [homework, setHomework] = useState<HomeworkData>();

  const getSingleAssignment = async () => {
    const res = await fetch(`/api/homework/${assignmentId}`);
    if (res.ok) {
      const data = await res.json();
      setHomework(data);
    }
  };

  const getHomework = async () => {
    const res = await fetch(
      `/api/homework/homeworkSubmission/${assignmentId}`,
      {
        method: "GET",
      }
    );
    const data: HomeworkData = await res.json();
    setHomeworkData(data);
    if (data.submissions.length > 0) {
      const ehniiSubmission = data.submissions[0];
      setInputValue(ehniiSubmission.description || "");
      const contentArray = Array.isArray(ehniiSubmission.content)
        ? ehniiSubmission.content
        : [ehniiSubmission.content];
      setImages(contentArray);
    }
  };

  const fetchFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setImages((prev) => [...prev, previewUrl]);
  };

  const uploadPhoto = async () => {
    if (!file) return;
    try {
      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });
      setImages((prev) => [...prev.slice(0, -1), uploaded.url]);
      setFile(null);
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const deleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const submitHomework = async () => {
    const res = await fetch(
      `/api/homework/homeworkSubmission/${assignmentId}/edit`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: user?.id,
          description: inputValue,
          content: images,
          status: "NONSUBMITTED",
        }),
      }
    );
    if (res.ok) {
      router.push("/student/dashboard");
    }
  };

  useEffect(() => {
    if (assignmentId) {
      getHomework();
      getSingleAssignment();
    }
  }, [assignmentId]);

  return (
  <div className="flex min-h-screen bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black text-slate-200 overflow-hidden">
    
 
    <aside
      className="
        w-64 m-4 rounded-3xl
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-[0_0_40px_rgba(34,211,238,0.15)]
        flex flex-col gap-8 p-6
      "
    >
      <h1 className="text-3xl font-extrabold tracking-tight text-cyan-300">
        LMS<span className="text-violet-400">.core</span>
      </h1>

      <nav className="flex flex-col gap-2">
        {[
          { label: "🏠 Home", path: "/student/dashboard" },
          { label: "📚 Classrooms", path: `/student/classroom/${user?.classId}` },
          { label: "👤 Profile", path: "/student/profile" },
        ].map((item, i) => (
          <button
            key={i}
            onClick={() => router.push(item.path)}
            className="
              flex items-center gap-3 px-4 py-3 rounded-xl
              text-slate-300 hover:text-cyan-300
              hover:bg-white/10
              hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]
              transition
            "
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto flex items-center gap-2 text-xs text-cyan-300">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        System Online
      </div>
    </aside>

    <main className="flex-1 p-10 overflow-y-auto">
      <div
        className="
          max-w-3xl mx-auto
          bg-white/10 backdrop-blur-xl
          border border-white/20
          rounded-3xl p-8
          shadow-[0_0_50px_rgba(167,139,250,0.25)]
          space-y-8
        "
      >
 
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            {homework?.title || "Homework"}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Due:{" "}
            {homework?.dueDate
              ? new Date(homework.dueDate).toLocaleDateString()
              : "—"}
          </p>
        </div>

     
        <div className="space-y-3">
          <label className="text-sm font-medium text-cyan-300">
            Your Answer
          </label>
          <textarea
            placeholder="Write your answer here..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="
              w-full min-h-[140px] rounded-xl
              bg-black/30 border border-white/20
              p-4 text-sm text-slate-200
              focus:outline-none focus:ring-2 focus:ring-cyan-400
            "
          />
        </div>


        <div className="space-y-2">
          <label className="text-sm font-medium text-cyan-300">
            Upload File (1 file only)
          </label>
          <input
            type="file"
            onChange={fetchFile}
            className="
              block w-full text-sm text-slate-300
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:bg-cyan-400/20 file:text-cyan-300
              hover:file:bg-cyan-400/30
            "
          />
        </div>

       
        <div className="flex flex-wrap gap-4">
          {images.length === 0 && (
            <p className="text-slate-500">No images uploaded yet.</p>
          )}

          {images.map((img, index) => (
            <div
              key={index}
              className="relative group"
            >
              <img
                src={img}
                className="
                  h-[280px] w-[280px]
                  rounded-2xl object-cover
                  border border-white/20
                  group-hover:shadow-[0_0_30px_rgba(34,211,238,0.4)]
                  transition
                "
              />
              <button
                onClick={() => deleteImage(index)}
                className="
                  absolute top-2 right-2
                  bg-red-500/80 text-white
                  px-2 py-1 rounded-full text-xs
                  hover:bg-red-600 transition
                "
              >
                ✕
              </button>
            </div>
          ))}
        </div>

     
        <div className="flex justify-end gap-3 pt-6">
          {file && (
            <button
              onClick={uploadPhoto}
              className="
                px-4 py-2 rounded-xl
                bg-green-500/80 text-white
                hover:bg-green-600 transition
              "
            >
              Upload Photo
            </button>
          )}

          <button
            onClick={() => router.push("/student/dashboard")}
            className="
              px-6 py-2 rounded-xl
              bg-white/10 text-slate-200
              hover:bg-white/20 transition
            "
          >
            Cancel
          </button>

          <button
            onClick={submitHomework}
            disabled={images.length === 0}
            className={`
              px-6 py-2 rounded-xl text-white transition
              ${
                images.length === 0
                  ? "bg-gray-500/40 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-600"
              }
            `}
          >
            Edit Homework
          </button>
        </div>
      </div>
    </main>
  </div>
);

};

export default Page;
