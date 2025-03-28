"use client";
import { toast, useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { IMessage } from "@/model/message.model";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MessageCard from "@/components/MessageCard";
import { hostname } from "os";

const page = () => {
  const router = useRouter();
  const { toast } = useToast();

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [acceptStatus, setAcceptStatus] = useState<boolean>(true);
  const [username, setUsername] = useState<string>("");
  const [fullName, setFullName] = useState("");
  const [profileURL, setProfileUrl] = useState({
    protocol: "",
    hostname: "",
    user: ""
  })


  const profile = async () => {
    try {
      const response = await axios.get("/api/profile");

      console.log("PROFILE FETCHED SUCCESSFULLY: ", response);

      setUsername(response.data.user.username);
      setFullName(response.data.user.fullName);

      // console.log("username" )
    } catch (error: any) {
      console.log("ERROR WHILE FETCHING THE PROFILE: ", error);

      toast({
        title: "Error",
        description: error.response?.data.message,
      });
    }
  };

  useEffect(() => {
    profile();
    refreshButton();
    
    setProfileUrl({...profileURL, protocol: window.location.protocol })
    setProfileUrl({...profileURL, hostname: window.location.host })

  }, []);

  const onSubmitLogOut = async () => {
    try {
      const response = await axios.post("/api/logout");

      if (!response) {
        console.log("Error");
      }

      console.log("Logged out successfully");

      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });

      router.replace("/");
    } catch (error: any) {
      console.log("ERROR WHILE REQUESTING API: ", error);

      toast({
        title: "Error",
        description:
          error.response?.data.message || "An error occurred while logging out",
        variant: "destructive",
      });
    }
  };

  const refreshButton = async () => {


  setProfileUrl({...profileURL, user: username}) 

    try {
      const response = await axios.get("/api/get-messages");

      // console.log("Messages fetched successfully: ", response);

      setMessages(response.data.user.messages);

      toast({
        title: "Messages fetched",
      });
    } catch (error: any) {
      console.log("ERROR WHILE REQUESTING API (GET-MESSAGE): ", error);

      toast({
        title: "Error",
        description:
          error.response?.data.message ||
          "An error occurred while fetching messages",
        variant: "destructive",
      });
    }
  };

  const changeStatus = () => {
    setAcceptStatus((prev) => !prev);
  };

  useEffect(() => {
    // console.log("User  accepting message: ", acceptStatus);
    const update = async () => {
      try {
        const response = await axios.post("/api/change-accept-status", {
          status: acceptStatus,
        });

        // console.log("MESSAGE STATUS UPDATED: ", response);

        toast({
          title: "Accept Message Status updated successfully",
        });
      } catch (error: any) {
        console.log("ERROR UPDATING THE MESSAGE STATUS", error);

        toast({
          title: "Error",
          description:
            error.response?.data.message ||
            "An error occurred while updating the message status",
          variant: "destructive",
        });
      }
    };

    update();
  }, [acceptStatus]);

  const deleteMessage = async () => {};


  const profileUrl = `${profileURL.hostname}/u/${username}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);

    toast({
      title: "URL copied to the clipboard!",
      description: "Profile URL has been copied to clipboard.",
    });
  };

  const handleDeleteMessage = (messageId: any) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };



  return (
    <>
      <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <a href="#" className="text-xl font-bold mb-4 md:mb-0">
            True Feedback
          </a>
          <>
            <span className="mr-4 text-2xl">Welcome, {fullName}</span>
            <Button
              onClick={onSubmitLogOut}
              className="w-full md:w-auto bg-slate-100 text-black"
              variant="outline"
            >
              Logout
            </Button>
          </>
        </div>
      </nav>

      <div className="mb-4 px-14 mt-10 flex flex-col items-center justify-center gap-y-3">
        <h2 className="text-lg font-semibold mb-2">
          Copy Your Unique Link To Recieve Anonymous Messages
        </h2>{" "}
        <div className="flex items-center ">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-[20vw] p-2 mr-2 border-2 bg-gray-200"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>
      <div className="mb-4 flex justify-center items-center ">
        <Switch defaultChecked onClick={changeStatus} />
        <span className="ml-2 text-lg font-semibold">
          Accept Messages: {acceptStatus ? "ON" : "OFF"}
        </span>
      </div>
      <Separator />
      <div className="w-full  px-14">
        <Button className="mt-4" variant="outline" onClick={refreshButton}>
          GET MESSAGES
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={message._id}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default page;
