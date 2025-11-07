"use client";

import { Loader } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  PersonIcon,
  Pencil1Icon,
  TrashIcon,
  CheckIcon,
  Cross2Icon,
} from "@radix-ui/react-icons";
import Image from "next/image";

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

interface ReplyProps {
  reply: ReplyData;
  currentUserId: string;
  editingReply: string | null;
  editContent: string;
  onEditContentChange: (content: string) => void;
  onStartEdit: (reply: ReplyData) => void;
  onCancelEdit: (replyId: string) => void;
  onSaveEdit: (replyId: string) => void;
  onDelete: (replyId: string) => void;
  isDeletingReply: boolean;
  isEditingReply: boolean;
}

export function Reply({
  reply,
  currentUserId,
  editingReply,
  editContent,
  onEditContentChange,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete,
  isDeletingReply,
  isEditingReply,
}: ReplyProps) {
  return (
    <div className="bg-muted/50 rounded p-3 md:p-4">
      <div className="flex items-start gap-2 md:gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {reply.author.avatarUrl ? (
            <div className="w-8 h-8 md:w-10 md:h-10 relative">
              <Image
                src={reply.author.avatarUrl}
                alt={reply.author.username}
                fill
                className="rounded-full object-cover"
              />
            </div>
          ) : (
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-secondary flex items-center justify-center">
              <PersonIcon className="w-4 h-4 md:w-5 md:h-5" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header with username and actions */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-medium">
                {reply.author.username}
              </h3>
              <p className="text-xs text-muted-foreground">
                {new Date(reply.createdAt).toLocaleString()}
                {reply.createdAt !== reply.updatedAt && (
                  <span className="ml-1 italic">(edited)</span>
                )}
              </p>
            </div>

            {/* Action buttons */}
            {currentUserId === reply.authorId && (
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onStartEdit(reply)}
                  disabled={isEditingReply || isDeletingReply}
                  aria-label="Edit reply"
                >
                  {isEditingReply && editingReply === reply.id ? (
                    <Loader className="w-3 h-3 animate-spin" />
                  ) : (
                    <Pencil1Icon className="w-3 h-3 md:w-4 md:h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDelete(reply.id)}
                  disabled={isDeletingReply || isEditingReply}
                  aria-label="Delete reply"
                >
                  {isDeletingReply ? (
                    <Loader className="w-3 h-3 animate-spin" />
                  ) : (
                    <TrashIcon className="w-3 h-3 md:w-4 md:h-4" />
                  )}
                </Button>
              </div>
            )}
          </div>

          {/* Edit form or content */}
          {editingReply === reply.id ? (
            <div className="mt-3 space-y-2">
              <Input
                value={editContent}
                onChange={(e) => onEditContentChange(e.target.value)}
                maxLength={300}
                className="w-full"
                disabled={isEditingReply}
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => onSaveEdit(reply.id)}
                  disabled={isEditingReply}
                >
                  {isEditingReply ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <CheckIcon className="w-4 h-4 mr-1" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCancelEdit(reply.id)}
                  disabled={isEditingReply}
                >
                  <Cross2Icon className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm md:text-base break-words whitespace-pre-wrap">
              {reply.content}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
