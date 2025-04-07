"use client";
import { toast } from "@/hooks/use-toast";
import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export function CreateBook() {
  return (
    <Link
      href="/admin"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{" "}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateBook({ id }: { id: string }) {
  return (
    <Link
      href={`/admin/books/edit/${id}`}
      className="rounded-md border p-2 hover:bg-gray-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteBook({ id }: { id: string }) {
  const handleDelete = async () => {
    const res = await fetch(`/api/books/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast({
        title: "Sucess",
        description: "Book Delete Sucessfully",
      });
    } else {
      toast({
        title: "Error",
        description: "There is Issue on Delting Book",
      });
    }
  };
  return (
    <>
      <button
        onClick={handleDelete}
        className="rounded-md border p-2 hover:bg-gray-100"
      >
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </>
  );
}
