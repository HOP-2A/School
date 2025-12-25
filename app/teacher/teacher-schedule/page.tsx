"use client";
import { useEffect, useState } from "react";
import { TeacherSchedule } from "@prisma/client";

import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/app/provider/AuthProvider";

const Page = () => {
  const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);
  const [schedules, setSchedules] = useState<TeacherSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] =
    useState<TeacherSchedule[]>(schedules);
  const getSchedule = async () => {
    const res = await fetch(`/api/teacher-schedule`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        teacherId: user?.id,
      }),
    });
    const response = await res.json();
    setSchedules(response);
  };
  useEffect(() => {
    getSchedule();
  }, []);

  console.log(schedules);
  console.log(filteredSchedules);
  const handleSelect = (e) => {
    const day = e.target.value;
    if (day === "") {
      setFilteredSchedules(schedules);
    } else {
      const filtered = schedules.filter((schedule) => schedule.day === day);
      setFilteredSchedules(filtered);
    }
  };
  return (
    <div>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Teacher Schedule</h1>
      </div>
      <div>
        {schedules.length === 0 && (
          <p className="text-center text-gray-500">No schedule available.</p>
        )}
      </div>
      <div>
        {schedules.length > 0 && (
          <p className="text-center text-gray-700 mb-4">
            You have {schedules.length} scheduled days.
          </p>
        )}
      </div>
      <div>
        <select
          onChange={(e) => handleSelect(e)}
          className="border p-2 m-4 rounded-lg shadow-md"
        >
          <option value="">All Schedule</option>
          <option value="Monday">Monday</option>
          <option value="Tuesday">Tuesday</option>
          <option value="Wednesday">Wednesday</option>
          <option value="Thursday">Thursday</option>
          <option value="Friday">Friday</option>
        </select>
      </div>
      <div>
        {filteredSchedules.length > 0 && (
          <div className="mb-4 text-center text-gray-700">
            Showing {filteredSchedules.length} schedule
            {filteredSchedules.length > 1 ? "s" : ""} for selected day.
          </div>
        )}
      </div>

      <div>
        {filteredSchedules.map((schedule) => (
          <div
            key={schedule.id}
            className="border p-4 m-4 rounded-lg shadow-md"
          >
            <p>
              <strong>Day:</strong> {schedule.day}
            </p>
            <p>
              <strong>Start Time:</strong> {schedule.startTime}
            </p>
            <p>
              <strong>End Time:</strong> {schedule.endTime}
            </p>
            <p>
              <strong>Class:</strong> {schedule.classId}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;
