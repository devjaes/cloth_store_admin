import { auth } from "@clerk/nextjs";
import SignIn from "./signin";
import { redirect } from 'next/navigation';

export default function Page() {
  const { userId } = auth();

  if (userId) {
    redirect('/dashboard');
  }

  return <SignIn />;
};
