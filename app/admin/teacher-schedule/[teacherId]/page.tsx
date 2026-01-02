"use client";
import { useParams } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { toast } from "sonner";

type Angi = {
  id:string
}
const Page = () => {
  const params = useParams();
  const teacherId = params.teacherId;
  const [time, setTime] = useState({
    endTime: "",
    startTime: "",
  });
  const [date, setDate] = useState();
  const [classValue, setClassValue] = useState("");
  const [allClass, setAllClass] = useState<Angi[]>([]);
  const schedules = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const handleTimeValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;
    if (name === "startTime") {
      setTime({ ...time, startTime: value });
    }
    if (name === "endTime") {
      setTime({ ...time, endTime: value });
    }
  };
  const handleDate = (e: { target: { value: any } }) => {
    const { value } = e.target;
    setDate(value);
  };
const getAllClass = async()=>{
const res = await fetch("/api/class/getAllClass",{
  method:"GET",

})
const response = await res.json()
setAllClass(response)
}
  const createTeacherSchedule = async () => {
   const res = await fetch("/api/teacher-schedule", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        startTime: time.startTime,
        endTime: time.endTime,
        day: date,
        teacherId: teacherId,
        classId:classValue
      }),
    });
    if(res.ok){
      toast.success("Successfully added the schedule")
    }
    else toast.error("the time schedule overlap");
  };
  const handleClassValue = (e: ChangeEvent<HTMLSelectElement>)=>{
const {value} = e.target
setClassValue(value)
  }
  useEffect(()=>{
    getAllClass()
  },[])
  return (
    <div
      className="
        max-w-xl
        mx-auto
        rounded-2xl
        p-8
        space-y-8
        bg-white/10 backdrop-blur-xl
        border border-white/20
        shadow-[0_0_40px_rgba(99,102,241,0.25)]
      "
    >
      {/* HEADER */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">
            Add Teacher Schedule
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Define a teaching time slot for this teacher
          </p>
        </div>
  
        <button
          onClick={() => window.history.back()}
          className="
            px-3 py-1.5
            text-sm
            rounded-lg
            border border-white/20
            text-slate-300
            hover:bg-white/10
            transition
          "
        >
          ← Back
        </button>
      </div>
  
      {/* FORM */}
      <div className="space-y-6">
  
        {/* WEEKDAY */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Weekday
          </label>
          <select
            onChange={handleDate}
            className="
              w-full
              rounded-xl
              px-4 py-3
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
            {schedules.map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
          <p className="text-xs text-slate-400 mt-1">
            Select the day this class will be held
          </p>
        </div>
  
        {/* TIME RANGE */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              onChange={handleTimeValue}
              className="
                w-full
                rounded-xl
                px-4 py-3
                bg-white/10
                border border-white/20
                text-slate-200
                text-sm
                backdrop-blur-xl
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500/50
              "
            />
          </div>
  
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              onChange={handleTimeValue}
              className="
                w-full
                rounded-xl
                px-4 py-3
                bg-white/10
                border border-white/20
                text-slate-200
                text-sm
                backdrop-blur-xl
                focus:outline-none
                focus:ring-2
                focus:ring-indigo-500/50
              "
            />
          </div>
        </div>
  
        {/* CLASS SELECT */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Assign to Class
          </label>
          <select
            onChange={(e) => handleClassValue(e)}
            className="
              w-full
              rounded-xl
              px-4 py-3
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
            {allClass.map((angi, index) => (
              <option key={index} value={angi.id}>
                {angi.id}
              </option>
            ))}
          </select>
        </div>
  
        <p className="text-xs text-slate-400">
          Make sure the time range does not overlap with existing schedules
        </p>
      </div>
  
      {/* ACTION */}
      <div className="pt-4 border-t border-white/10">
        <button
          onClick={createTeacherSchedule}
          className="
            w-full
            rounded-xl
            py-3
            text-sm
            font-semibold
            text-white
            bg-indigo-500/30
            border border-indigo-400/30
            hover:bg-indigo-500/50
            transition
            shadow-[0_0_25px_rgba(99,102,241,0.4)]
          "
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
  
};
export default Page;
