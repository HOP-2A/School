"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type TeachersType = {
  email: string;
  id: string;
  name: string;
};

const Page = () => {
  const [teacherId, setTeacherId] = useState("");
  const [allTeachers, setAllTeachers] = useState<TeachersType[]>([]);
  const [input, setInput] = useState("");

  const selected = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setTeacherId(value);
  };

  const handle = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const BringTeachers = async () => {
    const res = await fetch("/api/admin/teachers-subject");

    if (res.ok) {
      const data = await res.json();
      setAllTeachers(data);
    }
  };

  useEffect(() => {
    BringTeachers();
  }, []);

  const CreateSubject = async () => {
    const res = await fetch("/api/admin/create-subject", {
      method: "POST",
      body: JSON.stringify({
        classGiven: input,
        teacherId: teacherId,
      }),
    });

    if (res.ok) {
      toast.success("Successfully created subject");
      setInput("");
      setTeacherId("");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-8 space-y-6">
  
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Create New Subject
        </h2>
        <p className="text-slate-400 mt-2">
          Add a new subject and assign a subject teacher
        </p>
      </div>
  
      {/* TABLE CONTAINER */}
      <div
        className="
          rounded-2xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_40px_rgba(99,102,241,0.25)]
          overflow-hidden
        "
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
  
            {/* TABLE HEADER */}
            <thead className="bg-white/5 backdrop-blur-xl">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Subject name
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Subject teacher
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
  
            {/* TABLE BODY */}
            <tbody>
              <tr className="border-t border-white/10">
  
                {/* SUBJECT NAME */}
                <td className="px-6 py-4">
                  <Input
                    value={input}
                    onChange={(e) => handle(e)}
                    placeholder="Enter subject name..."
                    className="
                      w-full
                      rounded-xl
                      bg-white/10
                      border border-white/20
                      text-slate-200
                      placeholder:text-slate-400
                      focus:ring-2
                      focus:ring-indigo-500/50
                    "
                  />
                </td>
  
                {/* TEACHER SELECT */}
                <td className="px-6 py-4">
                  <select
                    onChange={(e) => selected(e)}
                    className="
                      w-full
                      rounded-xl
                      px-4 py-2
                      bg-white/10
                      border border-white/20
                      text-slate-200
                      text-sm
                      backdrop-blur-xl
                      focus:outline-none
                      focus:ring-2
                      focus:ring-indigo-500/50
                    "
                  >
                    <option value="">Select teacher</option>
                    {allTeachers?.map((teacher) => (
                      <option key={teacher?.id} value={teacher?.id}>
                        {teacher?.name}
                      </option>
                    ))}
                  </select>
                </td>
  
                {/* ACTION */}
                <td className="px-6 py-4">
                  <Button
                    onClick={CreateSubject}
                    className="
                      w-full
                      rounded-xl
                      bg-indigo-500/30
                      border border-indigo-400/30
                      text-indigo-200
                      hover:bg-indigo-500/50
                      hover:text-white
                      transition
                      shadow-[0_0_20px_rgba(99,102,241,0.4)]
                    "
                  >
                    Create
                  </Button>
                </td>
  
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
};

export default Page;
