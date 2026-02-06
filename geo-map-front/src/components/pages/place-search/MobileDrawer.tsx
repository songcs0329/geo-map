"use client";

import { ReactNode } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";

interface MobileDrawerProps {
  children: ReactNode;
}

function MobileDrawer({ children }: MobileDrawerProps) {
  return (
    <Drawer open direction="bottom" modal={false} snapPoints={[0.4, 0.85]}>
      <DrawerContent className="max-h-[85vh] w-full">{children}</DrawerContent>
    </Drawer>
  );
}

export default MobileDrawer;
