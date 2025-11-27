"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/provider/AuthProvider";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

const Page = () => {
  const { user, token } = useUser();
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
    if(!token){
      router.push("/student/dashboard")
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 p-10 flex justify-center">
      <Card className="w-full max-w-4xl shadow-lg rounded-xl border border-blue-200 bg-white flex flex-col md:flex-row overflow-hidden">
        <div className="md:w-1/3 bg-gradient-to-b from-blue-400 to-indigo-500 flex items-center justify-center p-6">
          {loading ? (
            <Skeleton className="h-full w-32 rounded-full" />
          ) : (
            <Avatar className="h-32 w-32 bg-indigo-200">
              <AvatarFallback className="text-indigo-800 text-4xl font-bold">
                {studentInfo?.name?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
          )}
        </div>

        <div className="md:w-2/3 p-8">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          ) : studentInfo ? (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">{studentInfo.name}</h1>
              <p className="text-indigo-600 font-medium">{studentInfo.email}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h2 className="font-semibold text-blue-600">Student ID</h2>
                  <p className="text-gray-700">{studentInfo.studentId}</p>
                </div>

                <div>
                  <h2 className="font-semibold text-purple-600">Class ID</h2>
                  <p className="text-gray-700">{studentInfo.classId || "Not assigned"}</p>
                </div>

                <div>
                  <h2 className="font-semibold text-green-600">Joined At</h2>
                  <p className="text-gray-700">
                    {new Date(studentInfo.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div>
                  <h2 className="font-semibold text-indigo-600">Homework Submissions</h2>
                  <p className="text-gray-700">
                    {studentInfo.homeworkSubmissions?.length || 0} submitted
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400">Student profile not found</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Page;
