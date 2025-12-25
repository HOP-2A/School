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
    <div className="max-w-xl bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Add Teacher Schedule
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Define a teaching time slot for this teacher
          </p>
        </div>

        <button
          onClick={() => window.history.back()}
          className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition"
        >
          ← Back
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Weekday
          </label>
          <select
            onChange={handleDate}
            className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {schedules.map((date, index) => (
              <option key={index} value={date}>
                {date}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select the day this class will be held
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              onChange={handleTimeValue}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              onChange={handleTimeValue}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div>
          what class the teacher into
          <div>
<select onChange={(e)=>{
  handleClassValue(e)
}}>
  {allClass.map((angi, index)=>{
   return  <option value={angi.id} key={index}>{angi.id}</option>
  })}
  
</select>
          </div>
        </div>

        <p className="text-xs text-gray-500">
          Make sure the time range does not overlap with existing schedules
        </p>
      </div>

      <div className="pt-4 border-t">
        <button
          onClick={createTeacherSchedule}
          className="w-full rounded-xl bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 transition"
        >
          Save Schedule
        </button>
      </div>
    </div>
  );
};
export default Page;
