"use client";

import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";
import { PersonIcon } from "@radix-ui/react-icons";
import { GuestbookUserInfo, GuestbookEntry } from "./guestbook";
import { useGuestbook } from "../hooks/useGuestbook";
import {
  LoadingMessage,
  GuestBookLoadingProfile,
} from "./LoadingGuestbookSkeleton";

export function FirebaseGuestbook() {
  const {
    currentUser,
    prismaUser,
    signIn,
    logOut,
    loading: isAuthLoading,
  } = useAuth();
  const {
    entries,
    isLoading,
    error,
    addEntry,
    removeEntry,
    editEntry,
    addReply,
    removeReply,
    editReply,
  } = useGuestbook();

  const [message, setMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingReplyId, setEditingReplyId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const [isAddingEntry, setIsAddingEntry] = useState(false);
  const [isDeletingEntry, setIsDeletingEntry] = useState(false);
  const [isEditingEntry, setIsEditingEntry] = useState(false);
  const [isAddingReply, setIsAddingReply] = useState(false);
  const [isDeletingReply, setIsDeletingReply] = useState(false);
  const [isEditingReply, setIsEditingReply] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;
    setIsAddingEntry(true);
    console.log("isAddingEntry set to true");
    try {
      await addEntry(message);
      setMessage("");
    } catch (err) {
      console.error("Error submitting guestbook entry:", err);
      // Optionally show a user-friendly error message
    } finally {
      setIsAddingEntry(false);
      console.log("isAddingEntry set to false");
    }
  };

  const handleDeleteEntry = async (id: string) => {
    setIsDeletingEntry(true);
    console.log("isDeletingEntry set to true");
    try {
      await removeEntry(id);
    } catch (err) {
      console.error("Error deleting guestbook entry:", err);
    } finally {
      setIsDeletingEntry(false);
      console.log("isDeletingEntry set to false");
    }
  };

  const handleEditEntry = async (id: string) => {
    setIsEditingEntry(true);
    console.log("isEditingEntry set to true");
    try {
      await editEntry(id, editContent);
      setEditingEntryId(null);
      setEditContent("");
    } catch (err) {
      console.error("Error editing guestbook entry:", err);
    } finally {
      setIsEditingEntry(false);
      console.log("isEditingEntry set to false");
    }
  };

  const handleSubmitReply = async (entryId: string) => {
    if (!replyContent.trim() || !currentUser) return;
    setIsAddingReply(true);
    console.log("isAddingReply set to true");
    try {
      await addReply(entryId, replyContent);
      setReplyContent("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Error submitting reply:", err);
    } finally {
      setIsAddingReply(false);
      console.log("isAddingReply set to false");
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    setIsDeletingReply(true);
    console.log("isDeletingReply set to true");
    try {
      await removeReply(replyId);
    } catch (err) {
      console.error("Error deleting reply:", err);
    } finally {
      setIsDeletingReply(false);
      console.log("isDeletingReply set to false");
    }
  };

  const handleEditReply = async (replyId: string) => {
    setIsEditingReply(true);
    console.log("isEditingReply set to true");
    try {
      await editReply(replyId, editContent);
      setEditingReplyId(null);
      setEditContent("");
    } catch (err) {
      console.error("Error editing reply:", err);
    } finally {
      setIsEditingReply(false);
      console.log("isEditingReply set to false");
    }
  };

  const startEditEntry = (entry: any) => {
    setEditingEntryId(entry.id);
    setEditContent(entry.message);
  };

  const startEditReply = (reply: any) => {
    setEditingReplyId(reply.id);
    setEditContent(reply.content);
  };
  return (
    <div className="space-y-6">
      {isAuthLoading ? (
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <GuestBookLoadingProfile />
          </div>
        </div>
      ) : currentUser ? (
        <div className="flex justify-center">
          <div className="w-full max-w-md">
            <GuestbookUserInfo
              currentUser={{
                displayName: currentUser.displayName || "",
                email: currentUser.email || "",
                photoURL: currentUser.photoURL || undefined,
                uid: currentUser.uid,
              }}
              message={message}
              onMessageChange={setMessage}
              onSubmit={handleSubmit}
              onLogOut={logOut}
              isSubmitting={isAddingEntry}
            />
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex flex-col items-center justify-center py-6">
                <p className="mb-4 text-center">
                  Sign in with Google to leave a message and reply to entries.
                </p>
                <Button onClick={signIn} className="flex items-center gap-2">
                  <PersonIcon className="w-4 h-4" />
                  Sign in
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">
          Messages ({entries ? entries.length : 0})
        </h2>
        {isLoading || error ? (
          <>
            <LoadingMessage />
            {""}
            <LoadingMessage />
            <LoadingMessage />
          </>
        ) : !entries || entries.length === 0 ? (
          <p>No messages yet. Be the first to leave a message!</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <GuestbookEntry
                key={entry.id}
                entry={entry}
                currentUser={prismaUser ? { uid: prismaUser.id } : { uid: "" }}
                editingEntry={editingEntryId}
                replyingTo={replyingTo}
                replyContent={replyContent}
                editingReply={editingReplyId}
                editContent={editContent}
                onEditContentChange={setEditContent}
                onStartEditEntry={() => prismaUser && startEditEntry(entry)}
                onCancelEditEntry={() => {
                  setEditingEntryId(null);
                  setEditContent("");
                }}
                onSaveEditEntry={() => handleEditEntry(entry.id)}
                onDeleteEntry={() => handleDeleteEntry(entry.id)}
                onSetReplyingTo={(entryId) =>
                  prismaUser ? setReplyingTo(entryId) : signIn()
                }
                onReplyContentChange={setReplyContent}
                onSubmitReply={() => handleSubmitReply(entry.id)}
                onStartEditReply={(reply) =>
                  prismaUser && startEditReply(reply)
                }
                onCancelEditReply={() => {
                  setEditingReplyId(null);
                  setEditContent("");
                }}
                onSaveEditReply={(replyId) => handleEditReply(replyId)}
                onDeleteReply={(replyId) => handleDeleteReply(replyId)}
                isDeletingEntry={isDeletingEntry}
                isEditingEntry={isEditingEntry}
                isAddingReply={isAddingReply}
                isDeletingReply={isDeletingReply}
                isEditingReply={isEditingReply}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
