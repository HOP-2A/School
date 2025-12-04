"use client"

import { useUser } from "@clerk/nextjs"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
type Subject= {
    subjectName :string
    teacher:{
        name:string
        email:string
    }

}
const Page=()=>{
    const {user} = useUser()
    const router = useRouter()
    const params = useParams()
    const [subjectInfo, setSubjectInfo] = useState<Subject |     null>(null)

    const subjectId = params.subjectId
    const getSubjectInfo =async ()=>{
const res= await fetch(`http://localhost:3000/api/subject/unique/${subjectId}`,{
    method:"GET"
})
const response = await res.json()
setSubjectInfo(response)

    }
   
    

  useEffect(() => {
        getSubjectInfo()
    
        if (!user) {
          router.push("/student/login");
        }
      }, [user]);
      return (
        <div>{user?.id}</div>
      );
}
export default Page