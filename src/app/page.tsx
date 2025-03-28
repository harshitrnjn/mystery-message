import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            True Feedback - Where your identity remains a secret.
          </p>
        </section>
      </main>
      <div className="h-[66.2vh] flex flex-col justify-center items-center gap-y-8 " >
        <h1 className="text-4xl font-bold " >GET YOUR OWN DASHBOARD, NOW! </h1>
        <div className="flex items-center justify-center gap-x-8">
          <Link href={"/sign-in"}><button className="px-6 py-3 border-2 border-black/65 font-bold rounded text-lg">LOG IN</button></Link>
          <Link href={"/sign-up"}><button className="px-6 py-3 border-2 border-black/65 font-bold rounded text-lg">SIGN UP</button></Link>
        </div>
      </div>
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 True Feedback. All rights reserved.
      </footer>
    </>
  );
};

export default page;
