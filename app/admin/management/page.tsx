"use client";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
type student = {
  name: string;
  id: string;
  classId: string;
};
type angi = {
  name: string;
  id: string;
};
const Page = () => {
  const [allStudents, setAllstudents] = useState<student[]>([]);
  const [allClass, setAllClasses] = useState<angi[]>([]);
  const [classValue, setClassValue] = useState("");
  const getAllStudent = async () => {
    const fetchedData = await fetch("/api/student/getAllStudents", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (fetchedData.ok) {
      const response = await fetchedData.json();
      setAllstudents(response);
    } else {
      toast.error("Failed to fetch students");
    }
  };

  const getAllClass = async () => {
    const fetchedData = await fetch("/api/class/getAllClass", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (fetchedData.ok) {
      const response = await fetchedData.json();
      setAllClasses(response);
    } else {
      toast.error("Failed to fetch students");
    }
  };
  const addStudentIntoClass = async (studentId: string) => {
    const res = await fetch(`/api/student/addStudentIntoClass/${classValue}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: studentId,
      }),
    });
    getAllClass();
  };
  const selectClass = (e: ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;
    setClassValue(value);
  };

  useEffect(() => {
    getAllStudent();
    getAllClass();
  }, []);
  const filterred = allStudents.filter((student) => {
    return student.classId === null;
  });

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-8 space-y-6">
  
      {/* HEADER */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-white">
          Add Students to Class
        </h2>
        <p className="text-slate-400 mt-2">
          Assign students to their respective classes
        </p>
      </div>
  
      {/* TABLE CONTAINER */}
      <div
        className="
          rounded-2xl
          bg-white/10 backdrop-blur-xl
          border border-white/20
          shadow-[0_0_40px_rgba(99,102,241,0.2)]
          overflow-hidden
        "
      >
        <div className="max-h-[520px] overflow-y-auto">
          <table className="w-full border-collapse">
  
            {/* TABLE HEADER */}
            <thead className="sticky top-0 bg-white/5 backdrop-blur-xl z-10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">
                  Class
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-slate-400 uppercase">
                  Action
                </th>
              </tr>
            </thead>
  
            {/* TABLE BODY */}
            <tbody>
              {filterred.map((student, index) => (
                <tr
                  key={index}
                  className="
                    border-t border-white/10
                    hover:bg-white/5
                    transition
                  "
                >
                  {/* STUDENT */}
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-white">
                        {student.name}
                      </span>
                      <span className="text-sm text-slate-400">
                        ID: {student.id}
                      </span>
                    </div>
                  </td>
  
                  {/* CLASS SELECT */}
                  <td className="px-6 py-4">
                    <select
                      onChange={(e) => selectClass(e)}
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
                      <option value="">Select class</option>
                      {allClass.map((c, i) => (
                        <option key={i} value={c.id}>
                          {c.id}
                        </option>
                      ))}
                    </select>
                  </td>
  
                  {/* ACTION */}
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => addStudentIntoClass(student.id)}
                      className="
                        px-5 py-2 rounded-xl
                        bg-indigo-500/30
                        text-indigo-200
                        border border-indigo-400/30
                        hover:bg-indigo-500/50
                        hover:text-white
                        transition
                        shadow-[0_0_20px_rgba(99,102,241,0.4)]
                      "
                    >
                      Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
  
          </table>
        </div>
      </div>
    </div>
  );
  
};
export default Page;
