"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Store } from "lucide-react";
import { Store as st } from "@prisma/client";

export function MainNav({
  className,
  store,
  ...props
}: {
  className?: string;
  store?: st;
}) {
  const pathname = usePathname();
  const params = useParams();

  const routes = [
    {
      href: `/${params.storeId}`,
      label: "Estadísticas",
      active: pathname === `/${params.storeId}`,
    },
    {
      href: `/${params.storeId}/categories`,
      label: "Categorías",
      active: pathname === `/${params.storeId}/categories`,
    },
    {
      href: `/${params.storeId}/sizes`,
      label: "Tallas",
      active: pathname === `/${params.storeId}/sizes`,
    },
    {
      href: `/${params.storeId}/products`,
      label: "Productos",
      active: pathname === `/${params.storeId}/products`,
    },
    {
      href: `/${params.storeId}/orders`,
      label: "Órdenes",
      active: pathname === `/${params.storeId}/orders`,
    },
  ];

  const route = `/${params.storeId}/settings`;

  return (
    <nav
      className={cn("flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 space-x-0 sm:space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href={route}
        className={cn(
          "flex flex-row outline-slate-500 outline outline-1 rounded-sm p-2 justify-center items-center transition-colors hover:outline-2 font-semibold",
          pathname === route
            ? "text-black dark:text-white dark:bg-slate-600 bg-gray-200 "
            : ""
        )}
      >
        <Store className="mr-2 h-4 w-4" />
        {store?.name}
      </Link>
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary ",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
