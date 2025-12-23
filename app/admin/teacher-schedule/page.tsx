"use client";
import { useEffect, useState } from "react";

const Page = () => {
  const [teachers, setTeachers] = useState();
  const getAllTeachers = async () => {
    const res = await fetch("/api/teacher/getAllTeachers");
    const response = await res.json();
    if (res.ok) {
      setTeachers(response);
    }
  };
  useEffect(() => {
    getAllTeachers();
  }, []);
  console.log(teachers);
  return <div>hi</div>;
};
export default Page;
