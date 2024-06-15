"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSelector } from "react-redux";
import { usePathname } from "next/navigation";


const Sidebar = () => {

  // const toggle = useSelector((state) => state.toggle.toggle);
  const pathname = usePathname();

  return (
    <>
      <div className="w-52 h-screen bg-gray-300 border-r-2 border-black p-4">
        <div className="projectName text-center text-pink-700 text-2xl font-bold pb-4 ">
          E.M.S.
        </div>

        <div className="text-center">
          <Link href="/dashboard/" className=" block item-center cursor-pointer p-2 no-underline text-black font-semibold rounded hover:bg-gray-400">
            Dashboard
          </Link>
        </div>

        <div className="text-center">
          <Link href="/employee/" className=" block item-center cursor-pointer p-2 no-underline text-black font-semibold rounded hover:bg-gray-400">
            Employee
          </Link>
        </div>

        <div className="text-center">
          <Link href="/department/" className=" block item-center cursor-pointer p-2 no-underline text-black font-semibold rounded hover:bg-gray-400">
            Department
          </Link>
        </div>

      </div>
    </>
  );
};

export default (Sidebar);
