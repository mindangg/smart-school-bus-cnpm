import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function Home() {
  return (
      <main className='flex justify-center'>
          <div className='relative top-40 w-1/4 border border-gray-300 shadow-sm rounded-2xl p-5'>
              <div className='flex justify-center items-center gap-2 mb-5'>
                  <Image
                      src='/logo.svg'
                      alt='logo'
                      width={48}
                      height={48}
                  />
                  <h1 className='text-3xl font-bold italic text-[#0079CEFF]'>BusSGU</h1>
              </div>
              <LoginForm />
          </div>
      </main>
  );
}
