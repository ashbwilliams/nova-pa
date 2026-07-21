"use client";

import { useFormStatus } from "react-dom";
import { deleteInquiryRecord } from "@/app/hub/actions";

function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button className="hub-delete-button" type="submit" disabled={pending}>
      {pending ? "Deleting…" : "Delete inquiry"}
    </button>
  );
}

export function InquiryDeleteForm({ id, name }: { id: string; name: string }) {
  return (
    <form
      action={deleteInquiryRecord}
      className="hub-delete-form"
      onSubmit={(event) => {
        if (!window.confirm(`Permanently delete the inquiry from ${name}?`)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <DeleteButton />
    </form>
  );
}
