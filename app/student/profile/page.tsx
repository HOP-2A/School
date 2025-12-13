"use client";

import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/app/provider/AuthProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter()
const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);


  return <div>  <div className="w-64 bg-white shadow-lg p-5 flex flex-col gap-6">
        <h1 className="text-2xl font-bold text-blue-600">LMS</h1>

        <nav className="flex flex-col gap-3">
          <button className="text-left p-3 rounded-xl hover:bg-gray-100" onClick={() => router.push(`/student/dashboard`)}>
            🏠 Home
          </button>
          <button
            className="text-left p-3 rounded-xl hover:bg-gray-100"
            onClick={() => router.push(`/student/classroom/${user?.classId}`)}
          >
            📚 Classrooms
          </button>
          <button className="text-left p-3 rounded-xl hover:bg-gray-100"  onClick={() => {
              router.push(`/student/profile`)
            }}>
            👤 Profile
          </button>
        </nav>
      </div></div>;
};
export default Page;
