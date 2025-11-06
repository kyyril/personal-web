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
  onStartEditReply: (replyId: string) => void;
  onCancelEditReply: (replyId: string) => void;
  onSaveEditReply: (replyId: string) => void;
  onDeleteReply: (replyId: string) => void;
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
}: GuestbookEntryProps) {
  return (
    <Card key={entry.id}>
      <CardHeader>
        <div className="flex items-start gap-4">
          {entry.user.avatarUrl ? (
            <Image
              src={entry.user.avatarUrl}
              alt={entry.user.username}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <PersonIcon className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{entry.user.username}</h3>
              <div className="flex gap-2">
                {currentUser.uid === entry.userId && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onStartEditEntry}
                      aria-label="Edit guestbook entry"
                    >
                      <Pencil1Icon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onDeleteEntry}
                      aria-label="Delete guestbook entry"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              {new Date(entry.createdAt).toLocaleString()}
              {entry.createdAt !== entry.updatedAt && (
                <span className="ml-2 text-xs text-gray-500">
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
                >
                  <CheckIcon className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onCancelEditEntry}
                  aria-label="Cancel editing"
                >
                  <Cross2Icon className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <p className="mt-2">{entry.message}</p>
            )}

            {/* Replies Section */}
            <div className="mt-4 ml-4 border-l-2 border-muted pl-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Replies</h4>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    onSetReplyingTo(replyingTo === entry.id ? null : entry.id)
                  }
                  aria-label={
                    replyingTo === entry.id ? "Cancel reply" : "Reply to entry"
                  }
                >
                  <ChatBubbleIcon className="w-4 h-4 mr-1" />
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
                  />
                  <Button
                    size="sm"
                    onClick={onSubmitReply}
                    aria-label="Send reply"
                  >
                    Send
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
                    onStartEdit={() => onStartEditReply(reply.id)}
                    onCancelEdit={() => onCancelEditReply(reply.id)}
                    onSaveEdit={() => onSaveEditReply(reply.id)}
                    onDelete={() => onDeleteReply(reply.id)}
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
