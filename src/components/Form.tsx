import { Input } from "./ui/input";

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
    </form>
  );
}
