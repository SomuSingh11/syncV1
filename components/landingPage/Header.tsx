"use client";
import Link from "next/link";
import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";

export default function Header() {
  const { isSignedIn } = useUser();

  return (
    <header className="relative">
      <div className="relative z-50 bg-[#eef6fd] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            href="/"
            className="text-2xl font-bold hover:text-green-500 transition-colors"
          >
            SyncCity
          </Link>

          <div className="flex space-x-6">
            <Link
              href="/"
              className="font-medium hover:text-green-500 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/contact"
              className="font-medium hover:text-green-500 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/about"
              className="font-medium hover:text-green-500 transition-colors"
            >
              About us
            </Link>
          </div>

          <div className="flex space-x-4 items-center">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-full 
                    hover:text-black hover:border-green-500 
                    font-medium transition-all duration-300"
                  >
                    Login
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button
                    className="px-4 py-2 bg-green-500 text-white font-medium rounded-full 
                    hover:bg-green-600 transition-all"
                  >
                    Register
                  </button>
                </SignUpButton>
              </>
            ) : (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
