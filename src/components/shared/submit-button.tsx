"use client";

import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";

export function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      className="mt-6 h-11 w-full bg-brand-primary text-white text-base hover:bg-brand-primary/90 hover:cursor-pointer"
      disabled={pending}
      aria-disabled={pending}
    >
      {pending ? "Ingresando..." : label}
    </Button>
  );
}
