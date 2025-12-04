"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";
import { Card,} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {

  const [studentInfo, setStudentInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter()
  const params = useParams();
  const studentId = params.studentProfile;

  const fetchStudentInformation = async () => {
    setLoading(true);
    const res = await fetch(`/api/student/profile/${studentId}`, {
      method: "GET",
    });
    const data = await res.json();
    setStudentInfo(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudentInformation();
 
  }, []);

  return (
    <div>hi profile</div>
  )
};

export default Page;
