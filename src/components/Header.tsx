"use client";

import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";

import { onAuthStateChanged, signOut } from "firebase/auth";
import { useAuth } from "./AuthContext";

import { Menu as MenuIcon1, Search, ShoppingBag, UserRound, X } from "lucide-react";
import Example from "./SidebarMobile";

type UserData = {
  email?: string;
  displayName?: string;
};
export default function Header({ open, setOpen, title }: any) {
  const [user, setUser] = useState<UserData>({});
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser: any) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      await logout();
      alert("Logged out successfully!");
      localStorage.clear();
      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-white w-full">
      <Example setOpen={setOpen} open={open} />
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
                  <MenuIcon1  className="size-6" />
                </button>
              </div>
              <div className="ml-auto flex items-center">
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-6"></div>
                {user && (
                  // <>
                  //   <hr className="" />
                  //   <div className="">
                  //     <span className="">
                  //       <img
                  //         alt=""
                  //         src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  //         className="size-8 rounded-full"
                  //       />
                  //     </span>
                  //     <span className="ml-3 capitalize">
                  //       {user.displayName}
                  //     </span>
                  //     <button onClick={handleLogout}>Logout</button>
                  //   </div>
                  // </>
                  <Menu as="div" className="relative ml-3">
                    <div>
                      <MenuButton className="relative flex rounded-full bg-gray-100 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-none">
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">Open user menu</span>
                        <UserRound  className="size-8 rounded-full text-gray-500"
                        />
                      </MenuButton>
                    </div>

                    <MenuItems className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5">
                      {/* ✅ Wrap username in <div> to fix Fragment issue */}
                      <MenuItem
                        as="div"
                        className="px-4 py-2 text-sm text-gray-700 capitalize"
                      >
                        {user.displayName}
                      </MenuItem>

                      <MenuItem>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${
                              active ? "bg-gray-100" : ""
                            } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                          >
                            Sign out
                          </button>
                        )}
                      </MenuItem>
                    </MenuItems>
                  </Menu>
                )}
              </div>

              {/* <div className="ml-auto flex items-center">
                <div className="hidden md:flex md:flex-1 md:items-center md:justify-end md:space-x-6">
                  <a
                    href="/signin"
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Sign in
                  </a>
                  <span className="h-6 w-px bg-gray-200" />
                  <a
                    href="/signup"
                    className="text-sm font-medium text-gray-700 hover:text-gray-800"
                  >
                    Create account
                  </a>
                </div>
              </div> */}
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
