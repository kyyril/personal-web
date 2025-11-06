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
    <div className="bg-muted/50 rounded-lg p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {reply.author.avatarUrl ? (
            <Image
              src={reply.author.avatarUrl}
              alt={reply.author.username}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <PersonIcon className="w-3 h-3" />
            </div>
          )}
          <div>
            <p className="text-sm font-medium">{reply.author.username}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(reply.createdAt).toLocaleString()}
              {reply.createdAt !== reply.updatedAt && (
                <span className="ml-2 text-xs text-gray-500">
                  (edited {new Date(reply.updatedAt).toLocaleString()})
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="flex gap-1">
          {currentUserId === reply.authorId && (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onStartEdit(reply)}
                disabled={isEditingReply || isDeletingReply}
              >
                {isEditingReply && editingReply === reply.id ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : (
                  <Pencil1Icon className="w-3 h-3" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(reply.id)}
                disabled={isDeletingReply || isEditingReply}
              >
                {isDeletingReply ? (
                  <Loader className="w-3 h-3 animate-spin" />
                ) : (
                  <TrashIcon className="w-3 h-3" />
                )}
              </Button>
            </>
          )}
        </div>
      </div>

      {editingReply === reply.id ? (
        <div className="mt-2 flex gap-2">
          <Input
            value={editContent}
            onChange={(e) => onEditContentChange(e.target.value)}
            maxLength={300}
            className="flex-1"
            disabled={isEditingReply}
          />
          <Button
            size="sm"
            onClick={() => onSaveEdit(reply.id)}
            disabled={isEditingReply}
          >
            {isEditingReply ? (
              <Loader className="w-4 h-4 animate-spin" />
            ) : (
              <CheckIcon className="w-4 h-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onCancelEdit(reply.id)}
            disabled={isEditingReply}
          >
            <Cross2Icon className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <p className="mt-1 text-sm">{reply.content}</p>
      )}
    </div>
  );
}
