"use client";

import { ReactNode } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface DesktopDrawerProps {
  children: ReactNode;
}

function DesktopDrawer({ children }: DesktopDrawerProps) {
  return (
    <Drawer open direction="left" modal={false}>
      <DrawerContent className="h-full w-80 sm:max-w-80">
        {children}
      </DrawerContent>
    </Drawer>
  );
}

export default DesktopDrawer;
