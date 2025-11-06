import { useState, useEffect, useCallback } from "react";
import {
  fetchGuestbookEntries,
  submitGuestbookEntry,
  deleteGuestbookEntry,
  updateGuestbookEntry,
  submitReply,
  deleteReply,
  updateReply,
} from "../lib/api/guestbookApi";
import { useAuth } from "../contexts/AuthContext";

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

export const useGuestbook = () => {
  const { currentUser, getToken } = useAuth();
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshEntries = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchGuestbookEntries();
      setEntries(data);
    } catch (err) {
      setError("Failed to fetch guestbook entries.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshEntries();
  }, [refreshEntries]);

  const addEntry = async (message: string) => {
    if (!currentUser) {
      throw new Error("User not authenticated.");
    }
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    await submitGuestbookEntry(message, token);
    await refreshEntries();
  };

  const removeEntry = async (id: string) => {
    if (!currentUser) {
      throw new Error("User not authenticated.");
    }
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    await deleteGuestbookEntry(id, token);
    await refreshEntries();
  };

  const editEntry = async (id: string, newMessage: string) => {
    if (!currentUser) {
      throw new Error("User not authenticated.");
    }
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    await updateGuestbookEntry(id, newMessage, token);
    await refreshEntries();
  };

  const addReply = async (entryId: string, content: string) => {
    if (!currentUser) {
      throw new Error("User not authenticated.");
    }
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    await submitReply(entryId, content, token);
    await refreshEntries();
  };

  const removeReply = async (replyId: string) => {
    if (!currentUser) {
      throw new Error("User not authenticated.");
    }
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    await deleteReply(replyId, token);
    await refreshEntries();
  };

  const editReply = async (replyId: string, newContent: string) => {
    if (!currentUser) {
      throw new Error("User not authenticated.");
    }
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    await updateReply(replyId, newContent, token);
    await refreshEntries();
  };

  return {
    entries,
    loading,
    error,
    refreshEntries,
    addEntry,
    removeEntry,
    editEntry,
    addReply,
    removeReply,
    editReply,
  };
};