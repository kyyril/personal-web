const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

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

export const fetchGuestbookEntries = async (): Promise<GuestbookEntry[]> => {
  try {
    const response = await fetch(`${API_BASE}/guestbook`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch entries: ${response.status} ${response.statusText}`
      );
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    throw error;
  }
};

export const submitGuestbookEntry = async (
  message: string,
  token: string
): Promise<void> => {
  try {
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
      throw new Error(
        `Failed to submit message: ${response.status} ${response.statusText} - ${errorBody}`
      );
    }
  } catch (error) {
    console.error("Error submitting guestbook entry:", error);
    throw error;
  }
};

export const deleteGuestbookEntry = async (
  id: string,
  token: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/guestbook/protected/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete entry");
    }
  } catch (error) {
    console.error("Error deleting guestbook entry:", error);
    throw error;
  }
};

export const updateGuestbookEntry = async (
  id: string,
  message: string,
  token: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/guestbook/protected/${id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error("Failed to update entry");
    }
  } catch (error) {
    console.error("Error updating guestbook entry:", error);
    throw error;
  }
};

export const submitReply = async (
  entryId: string,
  content: string,
  token: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/replies`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        content: content,
        guestbookEntryId: entryId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to submit reply");
    }
  } catch (error) {
    console.error("Error submitting reply:", error);
    throw error;
  }
};

export const deleteReply = async (
  replyId: string,
  token: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/replies/${replyId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete reply");
    }
  } catch (error) {
    console.error("Error deleting reply:", error);
    throw error;
  }
};

export const updateReply = async (
  replyId: string,
  content: string,
  token: string
): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE}/replies/${replyId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error("Failed to update reply");
    }
  } catch (error) {
    console.error("Error updating reply:", error);
    throw error;
  }
};