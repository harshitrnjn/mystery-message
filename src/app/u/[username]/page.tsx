"use client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import { useDebounceCallback } from "usehooks-ts";

const page = () => {
  const { username } = useParams();
  const [message, setMessage] = useState("");

  const debouncedMessage = useDebounceCallback(setMessage, 500);

  const onSubmit = async () => {
    try {
      const response = await axios.post("/api/send-message", {
        username: username,
        content: message,
      });

      console.log(response);

      toast({
        title: "Message sent successfully",
        description: "Your message has been sent to the user",
      });
    } catch (error: any) {
      console.log(error);

      toast({
        title: "Error sending message",
        description: error.response.data.message,
      });
    }finally{
      setMessage("");
    }
  };

  return (
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Public Profile Link
      </h1>
      <div className="w-full h-[50vh]  flex flex-col justify-center items-center gap-y-8 ">
        <h2 className="text-2xl">
          Write your anonymous message to @{" "}
          <span className="font-semibold">{username}</span>{" "}
        </h2>
        <textarea
          className="text-lg w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 resize-none"
          placeholder="Type your message here..."
          name="message"
          id="message"
          onChange={(e) => {
            debouncedMessage(e.target.value);
          }}
        ></textarea>

        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-black text-white text-lg rounded-md "
        >
          SEND
        </button>
      </div>

      <br />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={"/sign-up"}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
  );
};

export default page;
