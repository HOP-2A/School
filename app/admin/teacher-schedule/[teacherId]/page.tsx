"use client"
import { useParams } from "next/navigation";
import { ChangeEvent, useState } from "react";

const Page = ()=>{
  const params = useParams(),
  const teacherId = params.teacherId
const [time, setTime]= useState({
    endTime:"",
    startTime:""
})
const [date, setDate] = useState()
    const schedules = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const handleTimeValue = (e: ChangeEvent<HTMLInputElement>)=>{
const {value, name}= e.target
if(name==="startTime"){
setTime({...time, startTime:value})
}
if(name==="endTime"){
    setTime({...time, endTime:value})
    }
    }
    const handleDate = (e: { target: { value: any; }; })=>{
        const{value} =e.target
        setDate(value)
    }

    const createTeacherSchedule = async ()=>{
await fetch("/api/teacher-schedule",{
    method:"POST",
    headers: {
        "Content-Type": "application/json",
      },
    body: JSON.stringify({
        startTime:time.startTime,
        endTime: time.endTime,
        day:date,
        teacherId:teacherId,

    }),

})
    }
  return (
  <div className="max-w-xl bg-white p-6 rounded-2xl shadow">
    <h2 className="text-2xl font-bold mb-6">Add Teacher Schedule</h2>

  
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Day</label>
      <select className="w-full border rounded-lg p-2" onChange={(e) => handleDate(e)}>
     {schedules.map((date, index)=>{
        return <option key={index} value={date}>{date}</option>
     })}    
      </select>
    </div>

    
    <div className="mb-4">
      <label className="block text-sm font-medium mb-1">Start Time</label>
      <input
      onChange={(e)=>{handleTimeValue(e)

      }}
        type="time"
        className="w-full border rounded-lg p-2"
         name="startTime"
      />
    </div>


    <div className="mb-6">
      <label className="block text-sm font-medium mb-1">End Time</label>
      <input
        type="time"
        className="w-full border rounded-lg p-2"
        onChange={(e)=>{handleTimeValue(e)}}
        name="endTime"
      />
    </div>

    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700" onClick={createTeacherSchedule}>
      Save Schedule
    </button>
  </div>
);

}
export default Page