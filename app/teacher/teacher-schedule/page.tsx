"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { TeacherSchedule } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/app/provider/AuthProvider";

const Page = () => {
  const { user: clerkUser, isLoaded } = useUser();

  const { user } = useAuth(clerkUser?.id);
  const [schedules, setSchedules] = useState<TeacherSchedule[]>([]);
  const [filteredSchedules, setFilteredSchedules] = useState<TeacherSchedule[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  console.log(clerkUser);
  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await fetch("/api/teacher-schedule/getAll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ teacherId: user?.id }),
        });

        if (!res.ok) throw new Error("Failed to fetch");

        const response = await res.json();
        const data = Array.isArray(response) ? response : response.data ?? [];

        setSchedules(data);
        setFilteredSchedules(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, [isLoaded, clerkUser?.id]);
  console.log(schedules, "my");
  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedDay = e.target.value;
    setFilteredSchedules(
      selectedDay ? schedules.filter((s) => s.day === selectedDay) : schedules
    );
  };

  if (!isLoaded) return <p className="p-8">Loading user...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">My Schedule</h1>

      <select
        onChange={handleSelect}
        className="border rounded px-4 py-2 mb-6 w-full"
      >
        <option value="">All Days</option>
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
      </select>

      {loading ? (
        <p>Loading schedule...</p>
      ) : filteredSchedules.length === 0 ? (
        <p className="text-gray-500">No schedule found.</p>
      ) : (
        <ul className="space-y-2">
          {filteredSchedules.map((schedule) => (
            <li
              key={schedule.id}
              className="border rounded p-3 bg-white shadow-sm"
            >
              <strong>{schedule.day}</strong> — {schedule.startTime} to{" "}
              {schedule.endTime}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Page;
