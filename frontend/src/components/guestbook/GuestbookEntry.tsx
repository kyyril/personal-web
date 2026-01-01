"use client";
import { useState } from "react";
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
import { Loader, ChevronDown } from "lucide-react";

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
  const [showReplies, setShowReplies] = useState(false);

  return (
    <Card>
      <CardHeader className="p-4 md:p-6">
        <div className="flex gap-3 md:gap-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {entry.user.avatarUrl ? (
              <div className="w-10 h-10 md:w-12 md:h-12 relative">
                <Image
                  src={entry.user.avatarUrl}
                  alt={`Avatar of ${entry.user.username}`}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-secondary flex items-center justify-center">
                <PersonIcon className="w-5 h-5 md:w-6 md:h-6" aria-hidden="true" />
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header with username and actions */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex-1 min-w-0">
                <h3 className="text-sm md:text-base font-semibold truncate">
                  {entry.user.username}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {new Date(entry.createdAt).toLocaleString()}
                  {entry.createdAt !== entry.updatedAt && (
                    <span className="ml-1 italic">(edited)</span>
                  )}
                </p>
              </div>

              {/* Action buttons */}
              {currentUser.uid === entry.userId && (
                <div className="flex gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onStartEditEntry}
                    aria-label="Edit guestbook entry"
                    disabled={isEditingEntry || isDeletingEntry}
                  >
                    {isEditingEntry && editingEntry === entry.id ? (
                      <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Pencil1Icon className="w-4 h-4" aria-hidden="true" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={onDeleteEntry}
                    aria-label="Delete guestbook entry"
                    disabled={isDeletingEntry || isEditingEntry}
                  >
                    {isDeletingEntry ? (
                      <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <TrashIcon className="w-4 h-4" aria-hidden="true" />
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Message content or edit form */}
            {editingEntry === entry.id ? (
              <div className="mt-3 space-y-2">
                <Input
                  id={`edit-entry-${entry.id}`}
                  value={editContent}
                  onChange={(e) => onEditContentChange(e.target.value)}
                  maxLength={500}
                  className="w-full"
                  disabled={isEditingEntry}
                  aria-label="Edit your guestbook message"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={onSaveEditEntry}
                    aria-label="Save changes"
                    disabled={isEditingEntry}
                  >
                    {isEditingEntry ? (
                      <Loader className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <>
                        <CheckIcon className="w-4 h-4 mr-1" aria-hidden="true" />
                        Save
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={onCancelEditEntry}
                    aria-label="Cancel editing"
                    disabled={isEditingEntry}
                  >
                    <Cross2Icon className="w-4 h-4 mr-1" aria-hidden="true" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm md:text-base break-words whitespace-pre-wrap">
                {entry.message}
              </p>
            )}

            {/* Reply button and replies section */}
            <div className="mt-4 space-y-3">
              {/* Reply button */}
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    onSetReplyingTo(replyingTo === entry.id ? null : entry.id)
                  }
                  aria-label={
                    replyingTo === entry.id ? "Cancel reply" : "Reply to entry"
                  }
                  className="h-8"
                >
                  <ChatBubbleIcon className="w-4 h-4 mr-1.5" aria-hidden="true" />
                  {replyingTo === entry.id ? "Cancel Reply" : "Reply"}
                </Button>

                {/* Show/hide replies toggle */}
                {entry.replies.length > 0 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowReplies(!showReplies)}
                    aria-label={
                      showReplies
                        ? "Hide replies"
                        : `Show ${entry.replies.length} replies`
                    }
                    className="h-8 text-muted-foreground"
                  >
                    {entry.replies.length}{" "}
                    {entry.replies.length === 1 ? "reply" : "replies"}
                    <ChevronDown
                      className={`ml-1.5 h-4 w-4 transition-transform ${showReplies ? "rotate-180" : ""
                        }`}
                      aria-hidden="true"
                    />
                  </Button>
                )}
              </div>

              {/* Reply form */}
              {replyingTo === entry.id && (
                <div className="flex gap-2 pl-0 md:pl-4">
                  <Input
                    id={`reply-input-${entry.id}`}
                    value={replyContent}
                    onChange={(e) => onReplyContentChange(e.target.value)}
                    placeholder="Write a reply..."
                    maxLength={300}
                    disabled={isAddingReply}
                    className="flex-1"
                    aria-label="Write a reply to this message"
                  />
                  <Button
                    size="sm"
                    onClick={onSubmitReply}
                    aria-label="Send reply"
                    disabled={isAddingReply || !replyContent.trim()}
                  >
                    {isAddingReply ? (
                      <Loader className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      "Send"
                    )}
                  </Button>
                </div>
              )}

              {/* Replies list */}
              {showReplies && entry.replies.length > 0 && (
                <div className="pl-0 md:pl-4 pt-2 ml-2 space-y-3">
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
              )}
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
