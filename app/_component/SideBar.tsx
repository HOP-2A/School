"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Home, ClipboardList, MessageSquare, User } from "lucide-react";

type PropsType = {
  home: () => void;
  assignments: () => void;
  account: () => void;
};

const Sidebar = ({ home, assignments, account }: PropsType) => {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 px-4 pt-6 flex flex-col shadow-lg">
      <div className="flex items-center  px-2 mb-8">
        <Image
          src="/NexaLogo.svg"
          alt="Logo"
          width={160}
          height={160}
          className="drop-shadow-sm"
          loading="eager"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => {
            home();
          }}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-pink-600 rounded-lg transition-all duration-300"
        >
          <Home size={20} />
          Home
        </Button>

        <Button
          onClick={() => {
            assignments;
          }}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-pink-600 rounded-lg transition-all duration-300"
        >
          <ClipboardList size={20} />
          Assignments
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-pink-600 rounded-lg transition-all duration-300"
        >
          <MessageSquare size={20} />
          Messages
        </Button>

        <Separator className="my-4 border-pink-200" />

        <Button
          onClick={() => {
            account();
          }}
          variant="ghost"
          className="w-full justify-start gap-3 text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-pink-600 rounded-lg transition-all duration-300"
        >
          <User size={20} />
          My Account
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
