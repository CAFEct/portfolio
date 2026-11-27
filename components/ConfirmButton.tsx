"use client";

import { useTransition, type ReactNode } from "react";

type Props = {
  action: () => Promise<void>;
  children: ReactNode;
  confirmMessage?: string;
  className?: string;
};

export default function ConfirmButton({
  action,
  children,
  confirmMessage = "Tem certeza?",
  className = "btn-ghost !px-3 !py-1.5 text-xs",
}: Props) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      className={className}
      disabled={pending}
      onClick={() => {
        if (!window.confirm(confirmMessage)) return;
        startTransition(async () => {
          await action();
        });
      }}
    >
      {children}
    </button>
  );
}
