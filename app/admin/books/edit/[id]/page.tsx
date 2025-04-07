import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import BookForm from "@/components/admin/forms/BookForm";
import { getBookId } from "@/lib/data";
const page = async ({ params }: { params: { id: string } }) => {
  const resolver = await params;
  const id: string = resolver.id;
  const book = await getBookId(id);
  //console.log(book);
  return (
    <>
      <Button asChild className="back-btn">
        <Link href="/admin/books">Go Back</Link>
      </Button>

      <section className="w-full max-w-2xl">
        <BookForm type="update" {...book} />
      </section>
    </>
  );
};

export default page;
