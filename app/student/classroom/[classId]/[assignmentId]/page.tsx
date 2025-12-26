"use client";
import { useAuth } from "@/app/provider/AuthProvider";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";

type Homework = {
  title: string;
  dueDate: Date;
  description: string;
};

const Page = () => {
  const [inputValue, setInputValue] = useState("");
  const [homework, setHomework] = useState<Homework>();
  const [images, setImages] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const params = useParams();
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const assignmentId = params.assignmentId;
  const router = useRouter();

  const getSingleAssignment = async () => {
    const res = await fetch(`/api/homework/${assignmentId}`);
    if (res.ok) {
      const data = await res.json();
      setHomework(data);
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
       toast.success("Photo uploaded successfully  ")
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const submitMyHomework = async () => {
    const res = await fetch(
      `/api/homework/homeworkSubmission/${assignmentId}`,
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

  const deleteImage = (index: number) => {
    setImages((previous) => previous.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (user) getSingleAssignment();
  }, [user]);

 return (
  <div className="flex min-h-screen bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black text-slate-200 overflow-hidden">

    {/* SIDEBAR */}
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
        <button
          onClick={() => router.push(`/student/dashboard`)}
          className="
            flex items-center gap-3 px-4 py-3 rounded-xl
            text-slate-300 hover:text-cyan-300
            hover:bg-white/10
            hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]
            transition
          "
        >
          🏠 Home
        </button>

        <button
          onClick={() => router.push(`/student/classroom/${user?.classId}`)}
          className="
            flex items-center gap-3 px-4 py-3 rounded-xl
            text-slate-300 hover:text-cyan-300
            hover:bg-white/10
            hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]
            transition
          "
        >
          📚 Classrooms
        </button>

        <button
          onClick={() => router.push(`/student/profile`)}
          className="
            flex items-center gap-3 px-4 py-3 rounded-xl
            text-slate-300 hover:text-cyan-300
            hover:bg-white/10
            hover:shadow-[0_0_20px_rgba(34,211,238,0.35)]
            transition
          "
        >
          👤 Profile
        </button>
      </nav>

      <div className="mt-auto flex items-center gap-2 text-xs text-cyan-300">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        System Online
      </div>
    </aside>

    {/* MAIN */}
    <main className="flex-1 p-12 overflow-y-auto">
      <div
        className="
          max-w-4xl mx-auto
          bg-white/10 backdrop-blur-xl
          border border-white/20
          rounded-3xl p-8
          shadow-[0_0_40px_rgba(167,139,250,0.15)]
          space-y-8
        "
      >
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-slate-100">
            {homework?.title || "Homework"}
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Due:{" "}
            {homework?.dueDate
              ? new Date(homework.dueDate).toLocaleDateString()
              : "—"}
          </p>
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
          <p className="text-slate-300">
            {homework?.description || "No description"}
          </p>
        </div>

        {/* TEXTAREA */}
        <div className="space-y-3">
          <label className="text-sm text-cyan-300 font-medium">
            Your Answer
          </label>
          <textarea
            placeholder="Write your answer here..."
            className="
              w-full min-h-[140px]
              rounded-2xl
              bg-black/40 border border-white/20
              p-4 text-sm text-slate-200
              focus:outline-none focus:ring-2 focus:ring-cyan-400
            "
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>

        {/* FILE UPLOAD */}
        <div className="space-y-3">
          <label className="text-sm text-cyan-300 font-medium">
            Upload File (optional)
          </label>
          <input
            type="file"
            onChange={fetchFile}
            className="
              block w-full text-sm text-slate-400
              file:mr-4 file:py-2 file:px-4
              file:rounded-xl file:border-0
              file:bg-cyan-400/20 file:text-cyan-300
              hover:file:bg-cyan-400/30
            "
          />
        </div>

        {/* IMAGE PREVIEW */}
        <div className="flex flex-wrap gap-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group rounded-2xl overflow-hidden border border-white/20"
            >
              <img
                src={img}
                className="h-[260px] w-[260px] object-cover"
              />
              <button
                onClick={() => deleteImage(index)}
                className="
                  absolute top-3 right-3
                  bg-red-500/80 text-white
                  px-2 py-1 rounded-full text-xs
                  opacity-0 group-hover:opacity-100
                  transition
                "
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 pt-6">
          {file && (
            <button
              onClick={uploadPhoto}
              className="
                px-5 py-2 rounded-xl
                bg-emerald-500/80 text-white
                hover:bg-emerald-500
                transition
              "
            >
              Upload Photo
            </button>
          )}

          <button
            onClick={() => router.push("/student/dashboard")}
            className="
              px-6 py-2 rounded-xl
              bg-white/10 text-slate-300
              hover:bg-white/20
              transition
            "
          >
            Cancel
          </button>

          <button
            onClick={submitMyHomework}
            disabled={images.length === 0}
            className={`
              px-6 py-2 rounded-xl text-white transition
              ${
                images.length === 0
                  ? "bg-gray-500/40 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
              }
            `}
          >
            Submit Homework
          </button>
        </div>
      </div>
    </main>
  </div>
);

};

export default Page;
