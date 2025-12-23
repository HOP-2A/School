"use client"
import { useRouter } from "next/navigation";

const Page = ()=>{
    const router = useRouter()
    return (
        <div className="flex-1 p-10">
          <h2 className="text-3xl font-bold mb-6">Control</h2>
      
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Manage Classes */}
            <div
              onClick={() => router.push("/admin/management")}
              className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold">Manage Classes</h3>
              <p className="text-gray-500 mt-2">
                Click to add students to classes →
              </p>
            </div>
      
            {/* Teacher Schedule */}
            <div
              onClick={() => router.push("/admin/teacher-schedule")}
              className="bg-white p-6 rounded-2xl shadow cursor-pointer hover:shadow-xl transition"
            >
              <h3 className="text-xl font-semibold">Teacher Schedule</h3>
              <p className="text-gray-500 mt-2">
                Click to manage teacher schedules →
              </p>
            </div>
          </div>
        </div>
      );
      
      
}
export default Page