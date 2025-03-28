"use client";
import React, { useEffect, useState } from "react";
import { toast, useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useDebounceCallback } from "usehooks-ts";

const page = () => {
  const router = useRouter();
  const { username } = useParams();

  const [code, setCode] = useState("");
  const [buttonState, setButtonState] = useState(false);

  const debounced = useDebounceCallback(setCode, 500);

  useEffect(() => {
    if (code.length > 0) {
      setButtonState(true);
    }
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/verifyEmail", {
        username,
        verifyCode: code,
      });

      if (response.data.success) {
        toast({
          title: "Verified Successfully",
          description: "",
          variant: "default",
        });
      } else {
        toast({
          title: "User already Verified",
        });
      }

      router.replace("/sign-in");
    } catch (error: any) {
      console.error("Error verifying email:", error);
      toast({
        title:
          error.response?.data?.message ||
          "An error occurred while verifying your email.",
      });
    }
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-700">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Verify Your Account
          </h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <div className="flex flex-col gap-y-5">
          <div>
            <label htmlFor="code" className="font-semibold">
              Verification Code:{" "}
            </label>
            <input
              type="text"
              className=" w-full rounded text-lg p-2 border-2"
              onChange={(e) => {
                debounced(e.target.value);
              }}
            />
          </div>
          {buttonState ? (
            <button
              onClick={onSubmit}
              className=" text-white text-lg font-semibold rounded w-full bg-blue-500 px-5 py-3"
            >
              VERIFY
            </button>
          ) : (
            <button className=" text-white text-lg font-semibold rounded w-full bg-gray-500 px-5 py-3 hover: cursor-not-allowed">
              VERIFY
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
