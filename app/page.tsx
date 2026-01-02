"use client"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const Page=()=>{
  const {user}= useUser()
  const router = useRouter()
  useEffect(()=>{
if(!user){
router.push("https://stirred-mastiff-2.accounts.dev/sign-in")
}
  },[])
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1020] via-[#0F172A] to-black" />
  );
  
  
}

export default Page
