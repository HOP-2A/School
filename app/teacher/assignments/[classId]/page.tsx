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
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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

      <main className="md:ml-[18rem] px-6 py-8 space-y-10">
        <h1 className="text-3xl font-bold text-white">
          Class · {classId}
        </h1>

        <section className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* ---------------- ADD ASSIGNMENT ---------------- */}
          <div className="rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 space-y-6">
            <h2 className="text-xl font-semibold">Add Assignment</h2>

            <Input
              placeholder="Title"
              name="title"
              value={inputs.title}
              onChange={handleInputs}
              className="bg-white/10 border-white/20 text-white"
            />

            <Input
              placeholder="Description"
              name="des"
              value={inputs.des}
              onChange={handleInputs}
              className="bg-white/10 border-white/20 text-white"
            />

            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="bg-white/10 rounded-xl border border-white/20"
            />

            {/* FILE INPUT */}
            <input
              type="file"
              accept="image/*"
              onChange={fetchFile}
              className="block w-full text-sm text-slate-400
                file:mr-4 file:py-2 file:px-4
                file:rounded-xl file:border-0
                file:bg-indigo-500/20 file:text-indigo-300"
            />

            {/* IMAGE PREVIEW */}
            <div className="flex flex-wrap gap-4">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="relative group rounded-xl overflow-hidden border border-white/20"
                >
                  <img
                    src={img}
                    className="h-[160px] w-[160px] object-cover"
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
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                {isUploading ? "Uploading..." : "Upload Photo"}
              </Button>
            )}

            <Button
              onClick={AddAssignment}
              disabled={isUploading || isSubmitting}
              className="bg-indigo-500 hover:bg-indigo-600"
            >
              {isSubmitting ? "Submitting..." : "Add Assignment"}
            </Button>
          </div>

          {/* ---------------- ASSIGNMENT LIST ---------------- */}
          <div className="rounded-3xl p-8 bg-white/10 backdrop-blur-xl border border-white/20">
            <h2 className="text-xl font-semibold mb-6">Assignments</h2>

            <div className="space-y-4">
              {assignments.map((hw) => (
                <div
                  key={hw.id}
                  className="p-4 rounded-xl bg-white/10 border border-white/20"
                >
                  <p className="font-semibold">{hw.title}</p>
                  <p className="text-sm text-slate-400">{hw.description}</p>

                  <Button
                    onClick={() =>
                      router.push(`/teacher/homework/${hw.id}`)
                    }
                    className="mt-3 bg-white/10 hover:bg-white/20"
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
