"use client";

import { useEffect, useState } from "react";
import { PopupModal } from "react-calendly";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CalendlyModal({ isOpen, onClose }: CalendlyModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL || "https://calendly.com/";

  return (
    <PopupModal
      url={calendlyUrl}
      onModalClose={onClose}
      open={isOpen}
      rootElement={document.getElementById("main") || document.body}
    />
  );
}
