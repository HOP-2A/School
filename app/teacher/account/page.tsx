"use client";
import { jwtDecode } from "jwt-decode";

type DecodedTokenType = {
  id: string;
  name: string;
  teacherId: string;
  password: string;
  email: string;
  classes: string[];
  subject: {
    id: string;
    subjectNmae: string;
  };
};

const Page = () => {
  const localToken = localStorage.getItem("token");
  const decodedToken: DecodedTokenType = jwtDecode(localToken!);
  console.log(decodedToken);
  return (
    <div>
      <div>
        <section className="p-6 bg-gray-50 m-5 flex flex-col gap-2">
          <div>My Account Information</div>
          <div className="bg-gray-400"></div>
        </section>
      </div>
    </div>
  );
};

export default Page;
