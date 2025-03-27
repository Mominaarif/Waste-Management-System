"use client";

import { Fragment, useState } from "react";

import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Example from "./SidebarMobile";


export default function Header({open, setOpen, title}:any) {
//   const [open, setOpen] = useState(false);

  return (
    <div className="bg-white w-full">
        <Example setOpen={setOpen} open={open}/>
      <header className="relative bg-white w-full">
        <nav aria-label="Top" className=" px-5 md:px-8">
          <div className="border-b border-gray-200">
            <div className="flex items-center py-5">
              <div className="flex justify-between w-full md:w-fit">
                <h1 className="text-lg md:text-[26px] pl-5 md:pl-5 bg-white flex items-center">
                 {title}
                </h1>
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="relative rounded-md bg-white p-2 text-gray-400 md:hidden"
                >
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open menu</span>
                  <Menu aria-hidden="true" className="size-6" />
                </button>
              </div>
              <div className="ml-auto flex items-center">
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-6">
                  <a
                    href="/signin"
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Sign in
                  </a>
                  <span aria-hidden="true" className="h-6 w-px bg-gray-200" />
                  <a
                    href="/signup"
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Create account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
