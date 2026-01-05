"use client";

import Sidebar from "@/app/_component/SideBar";
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { format, set } from "date-fns";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useAuth } from "@/app/provider/AuthProvider";

type TeacherType = {
  id: string;
  name: string;
  email: string;
  teacherClasses: {
    classId: string;
    teacherId: string;
    Class: {
      teacherId: string;
      id: string;
      name: string;
      students: {
        classId: string;
        name: string;
        id: string;
        email: string;
      }[];
    };
  }[];
};
type HomeworkType = {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  teacherId: string;
};
type AssignmentsType = {
  classId: string;
  createdAt: string;
  description: string;
  dueDate: string;
  id: string;
  teacherId: string;
  title: string;
};

const Page = () => {
  const { push } = useRouter();
  const params = useParams();
  
  const classId = params.classId as string;
    const { user: clerkUser ,isLoaded} = useUser();
 
      const { user } = useAuth(clerkUser?.id);

  const [teacher, setTeacher] = useState<TeacherType>();
  const [assignments, setAssignments] = useState<AssignmentsType[]>();
  const [homework, setHomework] = useState<HomeworkType[]>();
  const [inputs, setInputs] = useState({
    title: "",
    des: "",
    date: "",
    points: "",
  });
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  const handleInputs = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const getClasses = async () => {
      if (!isLoaded || !user) return;

      const res = await fetch("/api/teacher/class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          teacherId: user.id,
        }),
      });

      if (res.ok) {
        const jsonTeacher = await res.json();
        setTeacher(jsonTeacher.teacher);
      } else {
        toast.error("Failed to fetch classes");
      }
    };

    getClasses();
    GetAssignments();
  }, [isLoaded, user]);

  const AddAssignment = async () => {
    const res = await fetch(`/api/teacher/assignments/${classId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: inputs.title,
        description: inputs.des,
        dueDate: RealSelectedDate,
        teacherId: user?.id,
      }),
    });

    if (res.ok) {
      toast.success("successfully added assignment");
      setInputs({ title: "", des: "", date: "", points: "" });
      GetAssignments();
    }
  };

  const GetAssignments = async () => {
    const res = await fetch("/api/teacher/assignments/bring", {
      method: "POST",
      body: JSON.stringify({
        classId: classId,
        teacherId: user?.id,
      }),
    });

    if (res.ok) {
      const JsonData = await res.json();
      setAssignments(JsonData);
    }
  };

  const RealSelectedDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : "";
console.log(assignments)
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
            py-5 sm:py-8
            pb-32 md:pb-8
            space-y-8 sm:space-y-10
          "
        >
          {/* ================= HEADER ================= */}
          <header className="flex flex-col gap-2">
            <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              Class · {classId}
            </h2>
          </header>
    
          {/* ================= CONTENT GRID ================= */}
          <section className="grid grid-cols-1 xl:grid-cols-2 gap-5 sm:gap-8 xl:gap-10">
    
            {/* ================= ADD ASSIGNMENT ================= */}
            <div
              className="
                rounded-2xl sm:rounded-3xl
                p-5 sm:p-8
                bg-white/10 backdrop-blur-2xl
                border border-white/20
                shadow-[0_0_40px_rgba(99,102,241,0.18)]
                space-y-5 sm:space-y-6
              "
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white">
                Add Assignment
              </h3>
    
              <Input
                placeholder="Title..."
                name="title"
                value={inputs.title ?? ""}
                onChange={handleInputs}
                className="
                  bg-white/10 border-white/20
                  text-white placeholder:text-slate-400
                  h-11 sm:h-10
                "
              />
    
              <Input
                placeholder="Description..."
                name="des"
                value={inputs.des ?? ""}
                onChange={handleInputs}
                className="
                  bg-white/10 border-white/20
                  text-white placeholder:text-slate-400
                  h-11 sm:h-10
                "
              />
    
              <Input
                placeholder="Points..."
                name="points"
                value={inputs.points ?? ""}
                onChange={handleInputs}
                className="
                  bg-white/10 border-white/20
                  text-white placeholder:text-slate-400
                  h-11 sm:h-10
                "
              />
    
              <div>
                <p className="text-sm text-slate-300 mb-2">
                  Pick a due date
                </p>
    
                <Calendar
                  className="
                    w-full
                    bg-white/10 text-white
                    rounded-xl
                    border border-white/20
                    p-2 sm:p-0
                  "
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                />
    
                {selectedDate && (
                  <p className="text-xs sm:text-sm text-slate-400 mt-2">
                    Due: {format(selectedDate, "yyyy-MM-dd")}
                  </p>
                )}
              </div>
    
              <Button
                onClick={AddAssignment}
                className="
                  w-full h-11 sm:h-10
                  rounded-xl sm:rounded-2xl
                  bg-indigo-500 hover:bg-indigo-600
                  text-white font-semibold
                  transition
                "
              >
                Add Assignment
              </Button>
            </div>
    
            {/* ================= ASSIGNMENTS LIST ================= */}
            <div
              className="
                rounded-2xl sm:rounded-3xl
                p-5 sm:p-8
                bg-white/10 backdrop-blur-2xl
                border border-white/20
                shadow-[0_0_40px_rgba(99,102,241,0.18)]
              "
            >
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-5 sm:mb-6">
                Assignments
              </h3>
    
              <div className="space-y-3 sm:space-y-4">
                {assignments?.map((hw) => (
                  <div
                    key={hw.id}
                    className="
                      rounded-xl
                      p-4
                      bg-white/10
                      border border-white/20
                      hover:bg-white/15
                      transition
                    "
                  >
                    <p className="font-semibold text-white">
                      {hw.title}
                    </p>
    
                    <p className="text-sm text-slate-400 mt-1">
                      {hw.description}
                    </p>
    
                    <Button
                      onClick={() => push(`/teacher/homework/${hw.id}`)}
                      className="
                        mt-3
                        w-full sm:w-auto
                        px-4 py-2
                        rounded-xl
                        bg-white/10 hover:bg-white/20
                        text-indigo-300 hover:text-white
                        transition
                      "
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
