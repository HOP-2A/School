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

const HomeworkPage = () => {
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

  useEffect(() => {
    if (assignmentId) {
      getHomework();
      getSingleAssignment();
    }
  }, [assignmentId]);

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
  console.log(images);
  return (
    <div className="min-h-screen bg-gray-50 flex justify-center px-4 py-10">
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col gap-6">
        <nav className="flex flex-col gap-3">
          <button onClick={() => router.push(`/student/dashboard`)}>
            🏠 Home
          </button>
          <button
            onClick={() => router.push(`/student/classroom/${user?.classId}`)}
          >
            📚 Classrooms
          </button>
          <button onClick={() => router.push(`/student/profile`)}>
            👤 Profile
          </button>
        </nav>
      </div>
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {homeworkData?.title || "Homework"}
          </h1>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {homework?.title || "Homework"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Due:{" "}
            {homework?.dueDate
              ? new Date(homework.dueDate).toLocaleDateString()
              : "—"}
          </p>
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700">
            Your Answer
          </label>
          <textarea
            placeholder="Write your answer here..."
            className="w-full min-h-[120px] rounded-xl border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Upload File (required) only 1 file
          </label>
          <input
            type="file"
            className="block w-full text-sm text-gray-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-blue-50 file:text-blue-600
              hover:file:bg-blue-100"
            onChange={fetchFile}
          />
        </div>
        <div className="flex flex-wrap gap-4">
          {images.length === 0 && (
            <p className="text-gray-400">No images uploaded yet.</p>
          )}
          {images.map((img, index) => (
            <div key={index} className="relative">
              <img
                src={img}
                className="h-[300px] w-[300px] rounded-lg object-cover border"
              />
              <button
                onClick={() => deleteImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full text-sm hover:bg-red-700"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-4">
          {file && (
            <button
              onClick={uploadPhoto}
              className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600"
            >
              Upload Photo
            </button>
          )}
          <button
            onClick={submitHomework}
            className="px-6 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            edit Homework
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeworkPage;
