'use client';

import { Button } from '../ui/button';
import { Card, CardHeader } from '../ui/card';
import { PersonIcon } from '@radix-ui/react-icons';

interface GuestbookAuthProps {
  onSignIn: () => void;
}

export function GuestbookAuth({ onSignIn }: GuestbookAuthProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center justify-center py-6">
            <p className="mb-4 text-center">
              Please sign in with Google to leave a message in the guestbook.
            </p>
            <Button onClick={onSignIn} className="flex items-center gap-2">
              <PersonIcon className="w-4 h-4" />
              Sign in with Google
            </Button>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}