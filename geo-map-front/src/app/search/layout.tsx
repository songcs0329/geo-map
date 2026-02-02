"use client";

import { Drawer } from "@/components/ui/drawer";
import { useRouter } from "next/navigation";

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      router.push("/");
    }
  };

  return (
    <Drawer open direction="left" onOpenChange={handleOpenChange}>
      {children}
    </Drawer>
  );
}
