'use client'
import React from "react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="w-full h-[52px] bg-[#E3F1FB] flex items-center justify-between px-6 z-50">

      {/* Left side: Links */}
      <div className="flex space-x-6 text-gray-700 text-sm font-medium">
        <Link href="#">Công Ty</Link>
        <Link href="#">Tài Nguyên</Link>
        <Link href="#">Pháp Lý</Link>
      </div>

      {/* Right side: Socials */}
      <div className="flex space-x-6 text-gray-700 text-lg">
        <Link href="https://www.linkedin.com/in/hong-duy-chimung-8a2a6b368/" target="_blank" className="hover:text-gray-900 dark:hover:text-white ms-5">
            <svg
                className="w-[22px] h-[22px]"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
            >
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4v13h-4v-13zM8.5 8.5h3.58v1.78h.05c.5-.95 1.73-1.95 3.57-1.95 3.82 0 4.53 2.5 4.53 5.75v6.42h-4v-5.68c0-1.35-.03-3.1-1.9-3.1-1.9 0-2.19 1.48-2.19 3v5.78h-4v-13z" />
            </svg>
            <span className="sr-only">LinkedIn profile</span>
        </Link>
        <Link href="https://github.com/ChimUng" target="_blank" className="hover:text-gray-900 dark:hover:text-white ms-5 lg:ms-0">
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clipRule="evenodd" />
            </svg>
            <span className="sr-only">GitHub account</span>
        </Link>
      </div>
    </footer>
  )
}

export default Footer
