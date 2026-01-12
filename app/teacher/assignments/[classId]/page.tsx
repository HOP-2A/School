"use client";

import Sidebar from "@/app/_component/SideBar";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";
import { upload } from "@vercel/blob/client";

type AssignmentsType = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
};

const Page = () => {
  const router = useRouter();
  const params = useParams();
  const classId = params.classId as string;

  const { user: clerkUser, isLoaded } = useUser();
  const { user } = useAuth(clerkUser?.id);

  const [assignments, setAssignments] = useState<AssignmentsType[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const [inputs, setInputs] = useState({
    title: "",
    des: "",
    points: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  /* ---------------- INPUT HANDLERS ---------------- */

  const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const fetchFile = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    const previewUrl = URL.createObjectURL(selectedFile);
    setImages((prev) => [...prev, previewUrl]);
  };

  const deleteImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------------- IMAGE UPLOAD ---------------- */

  const uploadPhoto = async () => {
    if (!file) return;

    try {
      setIsUploading(true);

      const uploaded = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      });

      setImages((prev) => [...prev.slice(0, -1), uploaded.url]);
      setFile(null);
      toast.success("Photo uploaded");
    } catch (error) {
      console.error(error);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  /* ---------------- ASSIGNMENTS ---------------- */

  const RealSelectedDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : "";

  const AddAssignment = async () => {
    if (!user) return;

    try {
      setIsSubmitting(true);

      const res = await fetch(`/api/teacher/assignments/${classId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: inputs.title,
          description: inputs.des,
          dueDate: RealSelectedDate,
          teacherId: user.id,
          content: images, // 👈 IMAGES SAVED HERE
          points: inputs?.points,
        }),
      });

      if (res.ok) {
        toast.success("Assignment added");
        setInputs({ title: "", des: "", points: "" });
        setImages([]);
        GetAssignments();
      } else {
        toast.error("Failed to add assignment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error adding assignment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const GetAssignments = async () => {
    const res = await fetch("/api/teacher/assignments/bring", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        classId,
        teacherId: user?.id,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setAssignments(data);
    }
  };

  useEffect(() => {
    if (isLoaded && user) GetAssignments();
  }, [isLoaded, user]);

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#111827] to-black text-slate-200">
      <Sidebar
        home={() => router.push("/teacher/main")}
        assignments={() => router.push("/teacher/assignments-public")}
        account={() => router.push("/teacher/account")}
      />

      <main className="md:ml-[18rem] px-6 py-8 space-y-12">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Class · {classId}
        </h1>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* ---------------- ADD ASSIGNMENT ---------------- */}
          <div className="rounded-2xl p-8 bg-[#1E1E2E]/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300 space-y-6">
            <h2 className="text-xl font-semibold text-white">Add Assignment</h2>

            <Input
              placeholder="Title"
              name="title"
              value={inputs.title}
              onChange={handleInputs}
              className="bg-[#2A2A35] border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />

            <Input
              placeholder="Description"
              name="des"
              value={inputs.des}
              onChange={handleInputs}
              className="bg-[#2A2A35] border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />

            <Input
              placeholder="Points..."
              name="points"
              value={inputs.points}
              onChange={(e) => handleInputs(e)}
              className="bg-[#2A2A35] border border-gray-700 text-white placeholder-gray-400 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
            />

            <h2 className="text-white font-medium">Pick a due date:</h2>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="bg-[#2A2A35] rounded-lg border border-gray-700 text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-400"
            />

            {/* FILE INPUT */}
            <input
              type="file"
              accept="image/*"
              onChange={fetchFile}
              className="block w-full text-sm text-slate-400
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:bg-purple-500/20 file:text-purple-300
            hover:file:bg-purple-500/30 transition"
            />

            {/* IMAGE PREVIEW */}
            <div className="flex flex-wrap gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-700"
                >
                  <img
                    src={img}
                    className="h-[160px] w-[160px] object-cover rounded-lg"
                  />
                  <button
                    onClick={() => deleteImage(index)}
                    className="absolute top-2 right-2 bg-red-500/80 text-white px-2 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {file && (
              <Button
                onClick={uploadPhoto}
                disabled={isUploading}
                className="bg-purple-700 hover:bg-purple-900 rounded-lg transition"
              >
                {isUploading ? "Uploading..." : "Upload Photo"}
              </Button>
            )}

            <Button
              onClick={AddAssignment}
              disabled={isUploading || isSubmitting}
              className="bg-indigo-500 hover:bg-indigo-600 rounded-lg transition"
            >
              {isSubmitting ? "Submitting..." : "Add Assignment"}
            </Button>
          </div>

          {/* ---------------- ASSIGNMENT LIST ---------------- */}
          <div className="rounded-2xl p-8 bg-[#1E1E2E]/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
            <h2 className="text-xl font-semibold text-white mb-6">
              Assignments
            </h2>

            <div className="space-y-4">
              {assignments.map((hw) => (
                <div
                  key={hw.id}
                  className="p-4 rounded-xl bg-[#2A2A35] shadow-sm hover:shadow-md transition"
                >
                  <p className="font-semibold text-white">{hw.title}</p>
                  <p className="text-sm text-gray-400">{hw.description}</p>

                  <Button
                    onClick={() => router.push(`/teacher/homework/${hw.id}`)}
                    className="mt-3 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg transition"
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
