"use client";

import { useState } from "react";

function useIsOpenToggle(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const handleToggleIsOpen = () => {
    setIsOpen((prevState) => !prevState);
  };

  return { isOpen, handleToggleIsOpen };
}

export default useIsOpenToggle;
