"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

const Page = () => {
  const { user } = useUser();
  const [studentInfo, setStudentInfo] = useState<any>([]);

  const fetchStudentInformation = async () => {
    const res = await fetch(`/api/student/profile/${user?.id}`, {
      method: "GET",
    });
    const data = await res.json();
    setStudentInfo(data);
  };

  useEffect(() => {
    fetchStudentInformation();
  }, []);
  const router = useRouter();
  console.log(studentInfo);
  return <div>hi</div>;
};
export default Page;
