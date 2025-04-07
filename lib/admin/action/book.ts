"use server";

import { books } from "@/database/schema";
import { db } from "@/database/drizzle";
import { eq } from "drizzle-orm";

export const createBook = async (params: BookParams) => {
  try {
    const newBook = await db
      .insert(books)
      .values({
        ...params,
        availableCopies: params.totalCopies,
      })
      .returning();

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newBook[0])),
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occurred while creating the book",
    };
  }
};

export const updateBook = async (id: string, params: BookParams) => {
  try {
    // Update the book in the database
    const updatedBook = await db
      .update(books) // Specify the `books` table to update
      .set({
        ...params, // Spread the fields from `params` to update the book
        availableCopies: params.totalCopies, // Update the `availableCopies` based on `totalCopies`
      })
      .where(eq(books.id, id)) // Specify the condition to identify the book by its ID
      .returning(); // Return the updated rows

    // If the update is successful, return a success response with the updated data
    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedBook[0])), // Parse and return the updated book data
    };
  } catch (error) {
    // If an error occurs during the update, log the error and return an error response
    console.log(error);

    return {
      success: false,
      message: "An error occurred while updating the book",
    };
  }
};

export const deleteBook = async (id: string) => {
  try {
    await db.delete(books).where(eq(books.id, id));
    return { success: true };
  } catch (error) {
    console.error("Failed to delete book:", error);
    return { success: false, error };
  }
};
