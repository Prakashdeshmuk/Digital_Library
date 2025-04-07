import { NextResponse } from "next/server";

import { deleteBook } from "@/lib/admin/action/book";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const resolver = await params;
  const result = await deleteBook(resolver.id);
  if (result.success) {
    return NextResponse.json({ message: "Book Deleted Sucessfully" });
  } else {
    return NextResponse.json(
      { message: "Something went Wrong while deleting the book" },
      { status: 500 }
    );
  }
}
