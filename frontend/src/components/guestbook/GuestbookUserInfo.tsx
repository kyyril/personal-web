"use client";

import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import { PersonIcon, ExitIcon } from "@radix-ui/react-icons";
import Image from "next/image";

interface GuestbookUserInfoProps {
  currentUser: {
    displayName: string;
    email: string;
    photoURL?: string;
    uid: string;
  };
  message: string;
  onMessageChange: (message: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onLogOut: () => void;
  isSubmitting: boolean;
}

export function GuestbookUserInfo({
  currentUser,
  message,
  onMessageChange,
  onSubmit,
  onLogOut,
  isSubmitting,
}: GuestbookUserInfoProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col w-full">
        <div className="bg-primary-foreground rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <PersonIcon className="w-5 h-5" />
              Welcome back!
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
              onClick={onLogOut}
            >
              <ExitIcon className="w-4 h-4" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Name:</span>
              <span>{currentUser.displayName}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-medium">Email:</span>
              <span>{currentUser.email}</span>
            </div>

            {currentUser.photoURL && (
              <div className="flex items-center gap-2">
                <Image
                  src={currentUser.photoURL}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full border"
                />
                <span className="font-medium">Profile Picture</span>
              </div>
            )}
          </div>
        </div>

        {/* Message Form */}
        <form
          onSubmit={onSubmit}
          className="flex justify-between gap-4 flex-col md:flex-row mt-4"
        >
          <Input
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            maxLength={500}
            placeholder="Leave a message..."
            required
            disabled={isSubmitting}
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
            Send
          </Button>
        </form>
      </CardHeader>
    </Card>
  );
}
