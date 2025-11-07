"use client";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import { Input } from "../ui/input";
import {
  PersonIcon,
  Pencil1Icon,
  TrashIcon,
  ChatBubbleIcon,
  CheckIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import { Reply } from "./Reply";
import { Loader } from "lucide-react";

interface ReplyData {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

interface GuestbookEntryProps {
  entry: {
    id: string;
    message: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    user: {
      id: string;
      username: string;
      avatarUrl?: string;
      email?: string;
    };
    replies: ReplyData[];
  };
  currentUser: {
    uid: string;
  };
  editingEntry: string | null;
  replyingTo: string | null;
  replyContent: string;
  editingReply: string | null;
  editContent: string;
  onEditContentChange: (content: string) => void;
  onStartEditEntry: () => void;
  onCancelEditEntry: () => void;
  onSaveEditEntry: () => void;
  onDeleteEntry: () => void;
  onSetReplyingTo: (entryId: string | null) => void;
  onReplyContentChange: (content: string) => void;
  onSubmitReply: () => void;
  onStartEditReply: (reply: ReplyData) => void;
  onCancelEditReply: (replyId: string) => void;
  onSaveEditReply: (replyId: string) => void;
  onDeleteReply: (replyId: string) => void;
  isDeletingEntry: boolean;
  isEditingEntry: boolean;
  isAddingReply: boolean;
  isDeletingReply: boolean;
  isEditingReply: boolean;
}

export function GuestbookEntry({
  entry,
  currentUser,
  editingEntry,
  replyingTo,
  replyContent,
  editingReply,
  editContent,
  onEditContentChange,
  onStartEditEntry,
  onCancelEditEntry,
  onSaveEditEntry,
  onDeleteEntry,
  onSetReplyingTo,
  onReplyContentChange,
  onSubmitReply,
  onStartEditReply,
  onCancelEditReply,
  onSaveEditReply,
  onDeleteReply,
  isDeletingEntry,
  isEditingEntry,
  isAddingReply,
  isDeletingReply,
  isEditingReply,
}: GuestbookEntryProps) {
  return (
    <Card key={entry.id}>
      <CardHeader>
        <div className="flex items-start gap-4">
          {entry.user.avatarUrl ? (
            <div className="w-8 h-8 md:w-10 md:h-10 relative shrink-0">
              <Image
                src={entry.user.avatarUrl}
                alt={entry.user.username}
                fill
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
              <PersonIcon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm md:text-base font-medium">{entry.user.username}</h3>
              <div className="flex gap-2">
                {currentUser.uid === entry.userId && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onStartEditEntry}
                      aria-label="Edit guestbook entry"
                      disabled={isEditingEntry || isDeletingEntry}
                    >
                      {isEditingEntry && editingEntry === entry.id ? (
                        <Loader className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                      ) : (
                        <Pencil1Icon className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={onDeleteEntry}
                      aria-label="Delete guestbook entry"
                      disabled={isDeletingEntry || isEditingEntry}
                    >
                      {isDeletingEntry ? (
                        <Loader className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                      ) : (
                        <TrashIcon className="w-3 h-3 md:w-4 md:h-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              {new Date(entry.createdAt).toLocaleString()}
              {entry.createdAt !== entry.updatedAt && (
                <span className="ml-1 md:ml-2 text-xs text-gray-500">
                  (edited {new Date(entry.updatedAt).toLocaleString()})
                </span>
              )}
            </p>

            {editingEntry === entry.id ? (
              <div className="mt-2 flex gap-2">
                <Input
                  value={editContent}
                  onChange={(e) => onEditContentChange(e.target.value)}
                  maxLength={500}
                  className="flex-1"
                />
                <Button
                  size="sm"
                  onClick={onSaveEditEntry}
                  aria-label="Save changes"
                  disabled={isEditingEntry}
                >
                  {isEditingEntry ? (
                    <Loader className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                  ) : (
                    <CheckIcon className="w-3 h-3 md:w-4 md:h-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onCancelEditEntry}
                  aria-label="Cancel editing"
                  disabled={isEditingEntry}
                >
                  <Cross2Icon className="w-3 h-3 md:w-4 md:h-4" />
                </Button>
              </div>
            ) : (
              <p className="mt-2 text-sm md:text-base">{entry.message}</p>
            )}

            {/* Replies Section */}
            <div className="mt-2 ml-2 pl-2 md:ml-4 md:pl-4">
              <div className="flex justify-end mb-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onSetReplyingTo(replyingTo === entry.id ? null : entry.id)
                  }
                  aria-label={
                    replyingTo === entry.id ? "Cancel reply" : "Reply to entry"
                  }
                >
                  <ChatBubbleIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" />
                  {replyingTo === entry.id ? "Cancel" : "Reply"}
                </Button>
              </div>

              {/* Reply Form */}
              {replyingTo === entry.id && (
                <div className="mb-3 flex gap-2">
                  <Input
                    value={replyContent}
                    onChange={(e) => onReplyContentChange(e.target.value)}
                    placeholder="Write a reply..."
                    maxLength={300}
                    disabled={isAddingReply}
                  />
                  <Button
                    size="sm"
                    onClick={onSubmitReply}
                    aria-label="Send reply"
                    disabled={isAddingReply}
                  >
                    {isAddingReply ? (
                      <Loader className="mr-2 h-3 w-3 md:h-4 md:w-4 animate-spin" />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              )}

              {/* Replies List */}
              <div className="space-y-2">
                {entry.replies.map((reply) => (
                  <Reply
                    key={reply.id}
                    reply={reply}
                    currentUserId={currentUser.uid}
                    editingReply={editingReply}
                    editContent={editContent}
                    onEditContentChange={onEditContentChange}
                    onStartEdit={onStartEditReply}
                    onCancelEdit={() => onCancelEditReply(reply.id)}
                    onSaveEdit={() => onSaveEditReply(reply.id)}
                    onDelete={() => onDeleteReply(reply.id)}
                    isDeletingReply={isDeletingReply}
                    isEditingReply={isEditingReply}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
