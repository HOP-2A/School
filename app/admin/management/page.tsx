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
    <div className="w-full max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Add Students to Class</h2>

      <div className="bg-white shadow border rounded-xl overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="w-full">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left font-medium">Student</th>
                <th className="p-3 text-left font-medium">Class</th>
                <th className="p-3 font-medium text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {filterred.map((student, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">
                    <div className="flex flex-col">
                      <span className="font-medium">{student.name}</span>
                      <span className="text-sm text-gray-500">
                        ID: {student.id}
                      </span>
                    </div>
                  </td>

                  <td className="p-3">
                    <select
                      className="border rounded-lg px-3 py-2 text-sm bg-gray-50 w-full"
                      onChange={(e) => selectClass(e)}
                    >
                      <option value="">Select class</option>
                      {allClass.map((c, i) => (
                        <option key={i} value={c.id}>
                          {c.id}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="p-3 text-center">
                    <button
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
                      onClick={() => {
                        addStudentIntoClass(student.id);
                      }}
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
