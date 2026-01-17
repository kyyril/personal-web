"use client";

import { useEffect } from "react";
import { preload } from "swr";
import { fetchGuestbookEntries } from "@/lib/api/guestbookApi";

const GUESTBOOK_API_KEY = "/guestbook";

/**
 * Silent prefetcher component that warms the SWR cache for guestbook data.
 * This component renders nothing but fetches guestbook data in the background
 * so it's instantly available when user navigates to the guestbook page.
 */
export function GuestbookPrefetcher() {
    useEffect(() => {
        // Use requestIdleCallback to fetch when browser is idle
        // Falls back to setTimeout for browsers that don't support it
        const prefetchData = () => {
            preload(GUESTBOOK_API_KEY, fetchGuestbookEntries);
        };

        if ("requestIdleCallback" in window) {
            const idleId = window.requestIdleCallback(prefetchData, { timeout: 3000 });
            return () => window.cancelIdleCallback(idleId);
        } else {
            // Fallback: fetch after a short delay to not block initial render
            const timeoutId = setTimeout(prefetchData, 1500);
            return () => clearTimeout(timeoutId);
        }
    }, []);

    // This component renders nothing
    return null;
}

export default GuestbookPrefetcher;
