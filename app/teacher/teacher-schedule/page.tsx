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
    <div className="px-6 sm:px-10 py-8 space-y-8">
  
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">
          My Schedule
        </h1>
        <p className="text-slate-400 mt-2">
          View and filter your weekly teaching schedule
        </p>
      </div>
  
      {/* FILTER */}
      <select
        onChange={handleSelect}
        className="
          w-full sm:w-64
          rounded-xl
          px-4 py-3
          bg-white/10
          backdrop-blur-xl
          border border-white/20
          text-slate-200
          focus:outline-none
          focus:ring-2
          focus:ring-indigo-500/50
        "
      >
        <option value="">All Days</option>
        <option value="Monday">Monday</option>
        <option value="Tuesday">Tuesday</option>
        <option value="Wednesday">Wednesday</option>
        <option value="Thursday">Thursday</option>
        <option value="Friday">Friday</option>
      </select>
  
      {/* CONTENT */}
      {loading ? (
        <p className="text-slate-400">Loading schedule...</p>
      ) : filteredSchedules.length === 0 ? (
        <div
          className="
            rounded-2xl
            bg-white/5
            border border-white/10
            p-6
            text-slate-400
          "
        >
          No schedule found.
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSchedules.map((schedule) => (
            <li
              key={schedule.id}
              className="
                rounded-2xl
                p-5
                bg-white/10
                backdrop-blur-xl
                border border-white/20
                shadow-[0_0_30px_rgba(99,102,241,0.2)]
                hover:shadow-[0_0_45px_rgba(99,102,241,0.35)]
                transition
              "
            >
              <div className="text-indigo-400 font-semibold mb-1">
                {schedule.day}
              </div>
              <div className="text-slate-200">
                {schedule.startTime} — {schedule.endTime}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
  
};

export default Page;
