"use server";

import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { and, eq } from "drizzle-orm";
import dayjs from "dayjs";
import { workflowClient } from "@/lib/workflow";
import config from "@/lib/config";

export const borrowBook = async (params: BorrowBookParams) => {
  const { userId, bookId } = params;

  try {
    const book = await db
      .select({
        availableCopies: books.availableCopies,
        title: books.title,
      })
      .from(books)
      .where(eq(books.id, bookId))
      .limit(1);

    const alreadybuy = await db
      .select({
        user_id: borrowRecords.userId,
        book_id: borrowRecords.bookId,
      })
      .from(borrowRecords)
      .where(
        and(eq(borrowRecords.userId, userId), eq(borrowRecords.bookId, bookId))
      )
      .limit(1);

    if (!book.length || book[0].availableCopies <= 0 || alreadybuy.length) {
      return {
        success: false,
        error: `${alreadybuy.length ? "You already have this Book" : "Book is not available for borrowing"}`,
      };
    }

    const dueDate = dayjs().add(7, "day").toDate().toDateString();

    const record = await db.insert(borrowRecords).values({
      userId,
      bookId,
      dueDate,
      status: "BORROWED",
    });

    const borrowedRecords = await db
      .select({
        borrowedDate: borrowRecords.borrowDate,
        returnDate: borrowRecords.returnDate,
      })
      .from(borrowRecords)
      .where(
        and(eq(borrowRecords.userId, userId), eq(borrowRecords.bookId, bookId))
      )
      .limit(1);

    await db
      .update(books)
      .set({ availableCopies: book[0].availableCopies - 1 })
      .where(eq(books.id, bookId));

    const usercredentials = await db
      .select({ fullName: users.fullName, email: users.email })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    await workflowClient.trigger({
      url: `${config.env.prodApiEndpoint}/api/workflow/borrowed_book`,
      body: {
        fullName: usercredentials[0].fullName,
        email: usercredentials[0].email,
        title: book[0].title,
        borrowDate: borrowedRecords[0].borrowedDate,
        returnDate: borrowedRecords[0].returnDate,
      },
    });
    return {
      success: true,
      data: JSON.parse(JSON.stringify(record)),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: "An error occurred while borrowing the book",
    };
  }
};
