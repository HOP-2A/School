"use client";

import { useUser } from "@clerk/nextjs";
import { useAuth } from "@/app/provider/AuthProvider";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter()
const { user: clerkUser } = useUser();
  const { user } = useAuth(clerkUser?.id);

console.log(user)



  return (
    <div className="min-h-screen flex bg-gray-100">
     
      <aside className="w-64 bg-white shadow-xl p-6 flex flex-col gap-6">
        <h1 className="text-3xl font-extrabold text-blue-600">LMS</h1>

        <nav className="flex flex-col gap-3 text-gray-700">
          <button
            className="text-left p-3 rounded-xl hover:bg-gray-100 transition"
            onClick={() => router.push(`/student/dashboard`)}
          >
            🏠 Home
          </button>

          <button
            className="text-left p-3 rounded-xl hover:bg-gray-100 transition"
            onClick={() => router.push(`/student/classroom/${user?.classId}`)}
          >
            📚 All Homeworks
          </button>

          <button
            className="text-left p-3 rounded-xl bg-blue-50 text-blue-600 font-semibold"
            onClick={() => router.push(`/student/profile`)}
          >
            👤 Profile
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
         
          <div className="bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row gap-8">
       
            <div className="flex flex-col items-center md:items-start">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-4xl font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <p className="mt-4 text-sm text-gray-500">Student</p>
            </div>

      
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500 mt-1">{user?.email}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Class</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.classId}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-sm font-mono text-gray-700 truncate">{user?.id}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Clerk ID</p>
                  <p className="text-sm font-mono text-gray-700 truncate">{user?.clerkId}</p>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );


};
export default Page;
