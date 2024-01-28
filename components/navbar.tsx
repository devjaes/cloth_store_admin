import { UserButton, auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import prismadb from "@/lib/prismadb";

const Navbar = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId,
    },
  });

  return (
    <div className="border-b">
      <div className="ml-auto flex justify-center md:hidden items-center space-x-4 pt-4">
        <ThemeToggle />
        <UserButton afterSignOutUrl="/" />
      </div>
      <div className="flex items-center px-4 justify-center py-4">
        <MainNav className="mx-6" store={store ? store : undefined} />
        <div className="hidden md:flex ml-auto items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
