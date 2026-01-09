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
        <div className="bg-primary-foreground rounded p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2.5">
              <PersonIcon className="w-5 h-5 text-custom" aria-hidden="true" />
              <span>Welcome back!</span>
            </h2>
            <Button
              size="sm"
              variant={"ghost"}
              className="flex items-center gap-2 text-foreground/60 hover:text-red-500 hover:bg-red-500/10 transition-colors"
              onClick={onLogOut}
            >
              <ExitIcon className="w-4 h-4" aria-hidden="true" />
              <span className="font-semibold uppercase text-[10px] tracking-wider">Logout</span>
            </Button>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold text-foreground/50 min-w-[50px]">Name</span>
              <span className="font-medium break-words flex-1 min-w-0">{currentUser.displayName}</span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-semibold text-foreground/50 min-w-[50px]">Email</span>
              <span className="font-medium truncate flex-1 min-w-0" title={currentUser.email}>{currentUser.email}</span>
            </div>

            {currentUser.photoURL && (
              <div className="flex items-center gap-3 pt-1">
                <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-border">
                  <Image
                    src={currentUser.photoURL}
                    alt={`Profile of ${currentUser.displayName}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="font-semibold text-foreground/50">Profile Picture</span>
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
            id="guestbook-message"
            type="text"
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            maxLength={500}
            placeholder="Leave a message..."
            required
            disabled={isSubmitting}
            aria-label="Your message for the guestbook"
          />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
            Send
          </Button>
        </form>
      </CardHeader>
    </Card>
  );
}
