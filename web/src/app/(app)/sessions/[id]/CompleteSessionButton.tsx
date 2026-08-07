"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { completeSessionAction } from "../actions";

export function CompleteSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function complete() {
    setError(null);
    startTransition(async () => {
      const result = await completeSessionAction(sessionId);
      if (result.error) {
        setError(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={complete}
        disabled={isPending}
        className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-60"
      >
        {isPending ? "Completamento…" : "Completa sessione"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
