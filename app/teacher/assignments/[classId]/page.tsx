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

type TeacherType = {
  id: string;
  name: string;
  email: string;
  teacherClasses: {
    classId: string;
    teacherId: string;
    class: {
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
  const { user, isLoaded } = useUser();
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
        console.log("Failed to fetch classes");
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
        teacherId: teacher?.id,
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
        teacherId: teacher?.id,
      }),
    });

    if (res.ok) {
      const JsonData = await res.json();
      setAssignments(JsonData);
    }
  };
  console.log(assignments,'assignments')

  const RealSelectedDate = selectedDate
    ? format(selectedDate, "yyyy-MM-dd")
    : "";

  return (
    <div>
      <div className="flex gap-5 ml-70">
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
        <div className="flex flex-col gap-5">
          <div className="text-[17px] font-bold bg-sky-300 p-3 rounded-2xl w-72">
            Class: {classId}
          </div>
          <div className="flex flex-col gap-5 bg-gray-100 p-5 rounded-2xl">
            <Input
              placeholder="Title..."
              name="title"
              value={inputs.title ?? ""}
              onChange={(e) => handleInputs(e)}
            />
            <Input
              placeholder="Description..."
              name="des"
              value={inputs.des ?? ""}
              onChange={(e) => handleInputs(e)}
            />
            <Input
              placeholder="Points..."
              name="points"
              value={inputs.points ?? ""}
              onChange={(e) => handleInputs(e)}
            />
            <h2>Pick a due date:</h2>
            <Calendar
              className="bg-white rounded-xl border border-gray-400"
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
            />

            {selectedDate && (
              <p>
                Picked date:{" "}
                {selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
              </p>
            )}

            <Button
              className="bg-black rounded-2xl text-white font-semibold"
              onClick={() => {
                AddAssignment();
              }}
            >
              Add Assignment
            </Button>
          </div>
        </div>
        <div className="ml-10 flex flex-col gap-5">
          <div className="text-[17px] font-bold bg-sky-300 p-3 rounded-2xl w-140">
            Assignments
          </div>
          <div className="bg-gray-100 p-5 w-140 h-fit rounded-2xl flex flex-col gap-3">
            {assignments?.map((hw) => (
              <div
                key={hw.id}
                className="bg-white border border-gray-400 rounded p-2 flex justify-between items-center"
              >
                <div>
                  <div className="font-bold">{hw.title}</div>
                  <div className="text-sm">{hw.description}</div>
                </div>
                <Button
                  onClick={() => {
                    push(`/teacher/homework/${hw.id}`);
                  }}
                  className="bg-black text-white h-7  rounded-2xl"
                >
                  View
                </Button>
              </div>
            ))}
          </div>
        </div>
        <div className="w-140"></div>
      </div>
    </div>
  );
};

export default Page;
