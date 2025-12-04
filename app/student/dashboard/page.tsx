"use client"

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
type Subject = {
    id: string;
    email: string;
    password: string;
    subjectName: string;

  };
  
const Page =()=>{
    const router = useRouter()
    const {user} = useUser()
    const [subjects, setSubjects] = useState<Subject[]>([])
    const displaySubject = async()=>{
        const res = await fetch("/api/subject",{
            method:"GET",
        })
        const response = await res.json()
        setSubjects(response)
       
    }
    useEffect(() => {
        displaySubject()
     
      }, []);

console.log(user)
return (
<div>hi
  {user?.id}
  {subjects.map((subject, index)=>{
    return <div>{subject.email}</div>

  })}
</div>
)
}


export default Page