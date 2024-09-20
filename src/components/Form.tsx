"use client";
import { useFormStatus } from "react-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export function Form() {
  return (
    <form className="flex justify-between gap-4 flex-col md:flex-row">
      <Input
        type="text"
        name="message"
        maxLength={81}
        minLength={1}
        placeholder="Input Message..."
        required
      />
      <SubmitForm />
    </form>
  );
}

export function SubmitForm() {
  const { pending } = useFormStatus();
  return (
    <>
      {pending ? (
        <Button disabled>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Wait..
        </Button>
      ) : (
        <Button type="submit">SignUp</Button>
      )}
    </>
  );
}
