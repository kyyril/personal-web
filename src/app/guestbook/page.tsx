import { Form } from "@/components/Form";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RegisterLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export default function GuestBook() {
  return (
    <section className="max-w-7xl w-full px-4 md:px-8 mx-auto">
      <h1 className="text-4xl font-semibold lg:text-5xl pt-5">GuestBook</h1>
      <Card className="mt-10">
        <CardHeader className="flex flex-col w-full">
          <Label>message</Label>
          {<GuestBookForm />}
        </CardHeader>
      </Card>
    </section>
  );
}

async function GuestBookForm() {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (user) {
    return (
      <div>
        <Form />
      </div>
    );
  }
  return (
    <div className="flex justify-between gap-4 flex-col md:flex-row">
      <Input type="text" placeholder="input messege..." />
      <RegisterLink>
        <Button>Submit</Button>
      </RegisterLink>
    </div>
  );
}
