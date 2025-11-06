import useSWR, { mutate } from "swr";
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

const GUESTBOOK_API_KEY = "/guestbook";

export const useGuestbook = () => {
  const { currentUser, getToken } = useAuth();

  const fetcher = async () => {
    return await fetchGuestbookEntries();
  };

  const { data: entries, error, isLoading } = useSWR<GuestbookEntry[]>(
    GUESTBOOK_API_KEY,
    fetcher
  );

  const addEntry = async (message: string) => {
    if (!currentUser) {
      throw new Error("User not authenticated.");
    }
    const token = await getToken();
    if (!token) {
      throw new Error("Authentication token not found.");
    }
    await submitGuestbookEntry(message, token);
    mutate(GUESTBOOK_API_KEY);
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
    mutate(GUESTBOOK_API_KEY);
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
    mutate(GUESTBOOK_API_KEY);
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
    mutate(GUESTBOOK_API_KEY);
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
    mutate(GUESTBOOK_API_KEY);
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
    mutate(GUESTBOOK_API_KEY);
  };

  return {
    entries,
    isLoading,
    error,
    addEntry,
    removeEntry,
    editEntry,
    addReply,
    removeReply,
    editReply,
  };
};