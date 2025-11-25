"use client";

import Sidebar from "@/app/_component/SideBar";
import ClassesCard from "@/app/_component/TeacherClassesCards";
import { useRouter } from "next/navigation";

const Page = () => {
  const { push } = useRouter();
  return (
    <div className="flex gap-1 w-screen">
      <div>
        <Sidebar
          home={() => {
            push("/teacher/main");
          }}
          assignments={() => {}}
          account={() => {
            push("/teacher/account/");
          }}
        />
      </div>
      <div>
        <div></div>
      </div>
    </div>
  );
};

export default Page;
