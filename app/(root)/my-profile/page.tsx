import React from "react";
import { Button } from "@/components/ui/button";
import { auth, signOut } from "@/auth";
import BookList from "@/components/BookList";
import { sampleBooks } from "@/constants";
import { books, borrowRecords, users } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq, desc } from "drizzle-orm";

const Page = async () => {
  const session = await auth();

  const result = (await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      genre: books.genre,
      rating: books.rating,
      coverUrl: books.coverUrl,
      coverColor: books.coverColor,
      description: books.description,
      totalCopies: books.totalCopies,
      availableCopies: books.availableCopies,
      videoUrl: books.videoUrl,
      summary: books.summary,
      createdAt: books.createdAt,
    })
    .from(borrowRecords)
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(session?.user?.id ? eq(borrowRecords.userId, session.user.id) : undefined)
    .orderBy(desc(borrowRecords.borrowDate))) as Book[];

  console.log(result);
  return (
    <>
      <form
        action={async () => {
          "use server";

          await signOut();
        }}
        className="mb-10"
      >
        <Button>Logout</Button>
      </form>

      <BookList title="Borrowed Books" books={result} />
    </>
  );
};
export default Page;
