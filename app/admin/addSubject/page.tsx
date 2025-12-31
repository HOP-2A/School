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
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Create New Subject</h2>

      <div className="bg-white shadow border rounded-xl overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left font-medium">Subject name</th>
                <th className="p-3 text-left font-medium">Subject teacher</th>
                <th className="p-3 text-left font-medium">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr className="border-b">
                <td className="p-3">
                  <Input
                    value={input}
                    onChange={(e) => {
                      handle(e);
                    }}
                    className="w-90 border-1"
                    placeholder="Enter subject name..."
                  />
                </td>
                <td className="p-3 w-90">
                  <select
                    className="border rounded-lg px-3 py-2 text-sm bg-gray-50 w-full"
                    onChange={(e) => selected(e)}
                  >
                    <option value="">Select teacher</option>
                    {allTeachers?.map((teacher) => (
                      <option key={teacher?.id} value={teacher?.id}>
                        {teacher?.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3">
                  <Button
                    onClick={() => {
                      CreateSubject();
                    }}
                    className="bg-gray-800 text-white rounded-xl"
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
