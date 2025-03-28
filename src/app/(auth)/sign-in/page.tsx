"use client";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const page = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [data, setData] = useState({
    identifier: "",
    password: "",
  });

  const [buttonState, setButtonState] = useState(false);
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    if (data.identifier.length > 0 && data.password.length > 0) {
      setButtonState(true);
    }
  }, [data]);

  const onSubmit = async () => {
    console.log(data);
    setIsLoading(true);
    const response = await axios.post("/api/sign-in", data);

    console.log("Data sent successfully: ", response);

    if (response.data.success) {
      toast({
        title: "Logged In successfully",
        description: response.data.message,
      });

      setIsLoading(false);

      router.replace("/dashboard");
    } else {
      toast({
        title: "Error",
        description: "Error while login",
        variant: "destructive",
      });
    }
    setIsLoading(false);
    setData({ ...data, identifier: "" });
    setData({ ...data, password: "" });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>
        <div className=" w-full flex flex-col justify-center items-center gap-y-5">
          <div className="w-full flex flex-col gap-y-2">
            <label htmlFor="identifier" className="text-base font-semibold">
              Email/Username:{" "}
            </label>
            <input
              type="text"
              className=" w-full rounded text-lg p-2 border-2"
              onChange={(e) => {
                setData({ ...data, identifier: e.target.value });
              }}
            />
          </div>
          <div className="w-full flex flex-col gap-y-2">
            <label htmlFor="password" className="text-base font-semibold">
              Password:{" "}
            </label>
            <input
              type="password"
              className="w-full rounded text-lg p-2 border-2"
              onChange={(e) => {
                setData({ ...data, password: e.target.value });
              }}
            />
          </div>
          {buttonState ? (
            <button
              onClick={onSubmit}
              className="w-full bg-blue-500 px-6 py-3 text-lg text-white font-semibold rounded flex justify-center items-center"
            >
              {isloading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4 " />
                  Please Wait
                </>
              ) : (
                "SIGN IN"
              )}
            </button>
          ) : (
            <button className="w-full bg-gray-500 px-6 py-3 text-lg text-white font-semibold rounded hover: cursor-not-allowed ">
              SUBMIT
            </button>
          )}
        </div>

        <div className="text-center mt-4">
          <p>
            Not a member yet?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default page;
