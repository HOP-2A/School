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
  content:string
};

const Page = () => {
  const [inputValue, setInputValue] = useState("");
  const [homework, setHomework] = useState<Homework>();
  const [images, setImages] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);


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
      setIsUploading(true); // 🔄 start uploading

      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImages((prev) => [...prev.slice(0, -1), uploaded.url]);
      setFile(null); // 👈 button will disappear
      toast.success("Photo uploaded successfully");
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const submitMyHomework = async () => {
    try {
      setIsSubmitting(true);

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
        toast.success("Homework submitted successfully");
        router.push("/student/dashboard");
      } else {
        toast.error("Submission failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Submission failed");
    } finally {
      setIsSubmitting(false); // ✅ done submitting
    }
  };

  const deleteImage = (index: number) => {
    setImages((previous) => previous.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (user) getSingleAssignment();
  }, [user]);

return (
  <div className="flex min-h-screen bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black text-slate-200">
    {/* ================= DESKTOP SIDEBAR ================= */}
    <aside
      className="
        hidden md:flex
        w-64 m-4 rounded-3xl
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-[0_0_40px_rgba(34,211,238,0.15)]
        flex-col gap-8 p-6
      "
    >
      <h1 className="text-3xl font-extrabold tracking-tight text-cyan-300">
        NEXA<span className="text-violet-400">HOP</span>
      </h1>

      <nav className="flex flex-col gap-2">
        <button
          onClick={() => router.push(`/student/dashboard`)}
          className="px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition text-left"
        >
          🏠 Home
        </button>

        <button
          onClick={() => router.push(`/student/classroom/${user?.classId}`)}
          className="px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition text-left"
        >
          📚 Classroom
        </button>

        <button
          onClick={() => router.push(`/student/profile`)}
          className="px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition text-left"
        >
          👤 Profile
        </button>
      </nav>

      <div className="mt-auto flex items-center gap-2 text-xs text-cyan-300">
        <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
        System Online
      </div>
    </aside>

    {/* ================= MAIN ================= */}
    <main className="flex-1 p-4 sm:p-6 md:p-12 pb-32 md:pb-12 overflow-y-auto">
      <div
        className="
          max-w-4xl mx-auto
          bg-white/10 backdrop-blur-xl
          border border-white/20
          rounded-3xl p-6 sm:p-8
          shadow-[0_0_40px_rgba(167,139,250,0.15)]
          space-y-10
        "
      >
        {/* TITLE */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">
            {homework?.title || "Homework"}
          </h1>

          {/* minor author line */}
          <p className="text-xs text-slate-400 mt-1">
            Written by teacher
          </p>

          <p className="text-slate-400 mt-2 text-sm">
            Due:{" "}
            {homework?.dueDate
              ? new Date(homework.dueDate).toLocaleDateString()
              : "—"}
          </p>
        </div>

        {/* HOMEWORK CONTENT */}
        <section className="space-y-6">
          {/* Description */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-slate-300 leading-relaxed">
              {homework?.description || "No description provided."}
            </p>
          </div>

          {/* Content Images */}
          {homework?.content && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(Array.isArray(homework.content)
                ? homework.content
                : [homework.content]
              ).map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setPreviewImage(img)}
                  className="
                    group relative rounded-2xl overflow-hidden
                    border border-white/20
                    bg-black/30
                    focus:outline-none
                  "
                >
                  <img
                    src={img}
                    alt={`Homework content ${index + 1}`}
                    className="
                      w-full h-[240px] object-cover
                      group-hover:scale-105 transition-transform duration-300
                    "
                  />
                  <div
                    className="
                      absolute inset-0
                      bg-black/40 opacity-0
                      group-hover:opacity-100
                      transition
                      flex items-center justify-center
                      text-sm text-slate-200
                    "
                  >
                    Click to view
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* ANSWER */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-cyan-300">
            Your Answer
          </label>
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Write your answer here..."
            className="
              w-full min-h-[150px]
              rounded-2xl
              bg-black/40 border border-white/20
              p-4 text-sm text-slate-200
              focus:outline-none focus:ring-2 focus:ring-cyan-400
            "
          />
        </div>

        {/* FILE UPLOAD */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-cyan-300">
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

        {/* UPLOADED IMAGES */}
        <div className="flex flex-wrap gap-6">
          {images.map((img, index) => (
            <div
              key={index}
              className="relative group rounded-2xl overflow-hidden border border-white/20"
            >
              <img
                src={img}
                className="h-[220px] w-[220px] object-cover"
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

        {/* ACTIONS */}
        <div className="flex justify-end gap-4 pt-6">
          {file && (
            <button
              onClick={uploadPhoto}
              disabled={isUploading}
              className={`px-5 py-2 rounded-xl text-white transition ${
                isUploading
                  ? "bg-gray-500/60 cursor-not-allowed"
                  : "bg-emerald-500/80 hover:bg-emerald-500"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Photo"}
            </button>
          )}

          <button
            onClick={() => router.push("/student/dashboard")}
            className="px-6 py-2 rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 transition"
          >
            Cancel
          </button>

          <button
            onClick={submitMyHomework}
            disabled={images.length === 0 || isSubmitting}
            className={`px-6 py-2 rounded-xl text-white transition ${
              images.length === 0 || isSubmitting
                ? "bg-gray-500/40 cursor-not-allowed"
                : "bg-cyan-500 hover:bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.5)]"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit Homework"}
          </button>
        </div>
      </div>
    </main>

    {/* ================= IMAGE PREVIEW MODAL ================= */}
    {previewImage && (
      <div
        onClick={() => setPreviewImage(null)}
        className="
          fixed inset-0 z-50
          bg-black/80 backdrop-blur-sm
          flex items-center justify-center
          p-6
        "
      >
        <img
          src={previewImage}
          className="
            max-w-full max-h-full
            rounded-2xl
            shadow-[0_0_40px_rgba(0,0,0,0.6)]
          "
        />
      </div>
    )}

    {/* ================= MOBILE BOTTOM NAV ================= */}
    <nav
      className="
        md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40
        w-[92%] max-w-md
        bg-white/10 backdrop-blur-xl
        border border-white/20
        rounded-2xl
        shadow-[0_0_30px_rgba(99,102,241,0.25)]
        px-4 py-3
      "
    >
      <div className="flex justify-between items-center">
        <button
          onClick={() => router.push(`/student/dashboard`)}
          className="flex flex-col items-center text-slate-300 hover:text-cyan-300 transition"
        >
          🏠
          <span className="text-[11px]">Home</span>
        </button>

        <button
          onClick={() => router.push(`/student/classroom/${user?.classId}`)}
          className="flex flex-col items-center text-cyan-300"
        >
          📚
          <span className="text-[11px]">Class</span>
        </button>

        <button
          onClick={() => router.push(`/student/profile`)}
          className="flex flex-col items-center text-slate-300 hover:text-cyan-300 transition"
        >
          👤
          <span className="text-[11px]">Profile</span>
        </button>
      </div>
    </nav>
  </div>
);

  
};

export default Page;