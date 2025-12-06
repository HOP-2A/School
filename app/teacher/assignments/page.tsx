"use client";

import Sidebar from "@/app/_component/SideBar";
import { useRouter } from "next/navigation";

const Page = () => {
  const { push } = useRouter();
  return (
    <div>
      <div>
        <Sidebar
          home={() => {
            push("/teacher/main");
          }}
          assignments={() => {
            push("/teacher/assignments");
          }}
          account={() => {
            push("/teacher/account/");
          }}
        />
      </div>
    </div>
  );
};

export default Page;
