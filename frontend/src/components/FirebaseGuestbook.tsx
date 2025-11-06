"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import { Card, CardHeader } from "./ui/card";
import { PersonIcon } from "@radix-ui/react-icons";
import { GuestbookAuth, GuestbookUserInfo, GuestbookEntry } from "./guestbook";

interface GuestbookEntry {
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
  replies: Reply[];
}

interface Reply {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  authorId: string;
  userId: string;
  author: {
    id: string;
    username: string;
    avatarUrl?: string;
  };
}

export function FirebaseGuestbook() {
  const { currentUser, prismaUser, signIn, logOut, getToken } = useAuth();
  const [message, setMessage] = useState("");
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [editingEntry, setEditingEntry] = useState<string | null>(null);
  const [editingReply, setEditingReply] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  const API_BASE =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  console.log("API_BASE:", API_BASE);
  console.log(
    "Current user:",
    currentUser ? "Authenticated" : "Not authenticated"
  );

  const fetchEntries = async () => {
    try {
      setLoading(true);
      console.log("Fetching entries from:", `${API_BASE}/guestbook`);

      // Public endpoint for GET
      const response = await fetch(`${API_BASE}/guestbook`);

      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch entries: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      console.log("Data length:", data.length);
      setEntries(data);
    } catch (error) {
      console.error("Error fetching guestbook entries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !currentUser) return;

    try {
      const token = await getToken();
      console.log("Retrieved token:", token);
      if (!token) {
        throw new Error("Not authenticated, token is null or undefined.");
      }

      const response = await fetch(`${API_BASE}/guestbook/protected/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.error("Failed to submit message. Status:", response.status, "Body:", errorBody);
        throw new Error(`Failed to submit message: ${response.status} ${response.statusText}`);
      }

      setMessage("");
      await fetchEntries();
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

  const handleDeleteEntry = async (id: string) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_BASE}/guestbook/protected/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete entry");
      }

      await fetchEntries();
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleEditEntry = async (id: string, newMessage: string) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_BASE}/guestbook/protected/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) {
        throw new Error("Failed to update entry");
      }

      setEditingEntry(null);
      setEditContent("");
      await fetchEntries();
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  const handleSubmitReply = async (entryId: string) => {
    if (!replyContent.trim() || !currentUser) return;

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_BASE}/replies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content: replyContent,
          guestbookEntryId: entryId,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit reply");
      }

      setReplyContent("");
      setReplyingTo(null);
      await fetchEntries();
    } catch (error) {
      console.error("Error submitting reply:", error);
    }
  };

  const handleDeleteReply = async (replyId: string) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_BASE}/replies/${replyId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete reply");
      }

      await fetchEntries();
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const handleEditReply = async (replyId: string, newContent: string) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Not authenticated");
      }

      const response = await fetch(`${API_BASE}/replies/${replyId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content: newContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to update reply");
      }

      setEditingReply(null);
      setEditContent("");
      await fetchEntries();
    } catch (error) {
      console.error("Error updating reply:", error);
    }
  };

  const startEditEntry = (entry: GuestbookEntry) => {
    setEditingEntry(entry.id);
    setEditContent(entry.message);
  };

  const startEditReply = (reply: Reply) => {
    setEditingReply(reply.id);
    setEditContent(reply.content);
  };

  // Remove early return - show entries even for non-authenticated users

  return (
    <div className="space-y-6">
      {/* Always show entries, but show different UI based on auth status */}
      {currentUser ? (
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
        />
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
                  Sign in with Google
                </Button>
              </div>
            </CardHeader>
          </Card>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Messages ({entries.length})</h2>
        {loading ? (
          <p>Loading...</p>
        ) : entries.length === 0 ? (
          <p>No messages yet. Be the first to leave a message!</p>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <GuestbookEntry
                key={entry.id}
                entry={entry}
                currentUser={
                  prismaUser ? { uid: prismaUser.id } : { uid: "" } // Pass Prisma user ID
                }
                editingEntry={editingEntry}
                replyingTo={replyingTo}
                replyContent={replyContent}
                editingReply={editingReply}
                editContent={editContent}
                onEditContentChange={setEditContent}
                onStartEditEntry={() => prismaUser && startEditEntry(entry)} // Use prismaUser
                onCancelEditEntry={() => {
                  setEditingEntry(null);
                  setEditContent("");
                }}
                onSaveEditEntry={() => handleEditEntry(entry.id, editContent)}
                onDeleteEntry={() => handleDeleteEntry(entry.id)}
                onSetReplyingTo={(entryId) =>
                  prismaUser ? setReplyingTo(entryId) : signIn() // Use prismaUser
                }
                onReplyContentChange={setReplyContent}
                onSubmitReply={() => handleSubmitReply(entry.id)}
                onStartEditReply={(replyId: string) =>
                  prismaUser && // Use prismaUser
                  startEditReply({
                    id: replyId,
                    content: "",
                    createdAt: "",
                    updatedAt: "",
                    authorId: "",
                    userId: "",
                    author: { id: "", username: "" },
                  })
                }
                onCancelEditReply={(replyId: string) => {
                  setEditingReply(null);
                  setEditContent("");
                }}
                onSaveEditReply={(replyId: string) =>
                  handleEditReply(replyId, editContent)
                }
                onDeleteReply={(replyId: string) => handleDeleteReply(replyId)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
