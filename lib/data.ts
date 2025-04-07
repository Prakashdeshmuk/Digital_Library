import { auth } from "@/auth";
import { db } from "@/database/drizzle";
import { books, borrowRecords, users } from "@/database/schema";
import { create } from "domain";
import { desc, sql } from "drizzle-orm";
import { or, eq } from "drizzle-orm";
import redis from "@/database/redis";

const ITEMS_PER_PAGE = 6;

export const totalborrowedpages = async () => {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(borrowRecords);

    const count = +result[0].count;

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    return 0;
  }
};

export const totaluserpage = async () => {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const count = +result[0].count;

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    return 0;
  }
};

export const totalBookspages = async () => {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(books);

    const count = +result[0].count;

    return Math.ceil(count / ITEMS_PER_PAGE);
  } catch (error) {
    return 0;
  }
};

export const fetchfilterdborrowedRecords = async (
  query: string,
  currentPage: number
) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const result = await db
    .select({
      userName: users.fullName,
      bookTitle: books.title,
      bookAuthor: books.author,
      borrowDate: borrowRecords.borrowDate,
    })
    .from(borrowRecords)
    .innerJoin(users, eq(borrowRecords.userId, users.id))
    .innerJoin(books, eq(borrowRecords.bookId, books.id))
    .where(
      or(
        sql`${users.fullName} ILIKE ${`%${query}%`}`,
        sql`${books.title} ILIKE ${`%${query}%`}`,
        sql`${books.author}::TEXT ILIKE ${`%${query}%`}`,
        sql`${borrowRecords.borrowDate}::text ILIKE ${`%${query}%`}`
      )
    )
    .orderBy(desc(borrowRecords.borrowDate))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  return result;
};

export const fetchfilterdusers = async (query: string, currentPage: number) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Base query
  const result = db
    .select({
      fullName: users.fullName,
      email: users.email,
      role: users.role,
      lastActivityDate: users.lastActivityDate,
    })
    .from(users)
    .where(
      or(
        sql`${users.fullName} ILIKE ${`%${query}%`}`,
        sql`${users.email} ILIKE ${`%${query}%`}`,
        sql`${users.role}::TEXT ILIKE ${`%${query}%`}`,
        sql`${users.lastActivityDate}::text ILIKE ${`%${query}%`}`
      )
    )
    .orderBy(desc(users.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  return result;
};

export const fetchfilterdbooks = async (query: string, currentPage: number) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const cacheKey = `books:${query.trim() || "all"}:page:${currentPage}`;
  const cachedData = (await redis.get(cacheKey)) as string | null;
  if (cachedData) {
    try {
      return JSON.parse(cachedData) as BookTable[];
    } catch (error) {
      console.error(
        "Failed to parse cached data, clearing cache key:",
        cacheKey
      );
      await redis.del(cacheKey);
      // Continue to fetch from the database
    }
  }
  // Base query
  const baseQuery = db
    .select({
      id:books.id,
      coverUrl: books.coverUrl,
      title: books.title,
      author: books.author,
      genre: books.genre,
      createdAt: books.createdAt,
    })
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  // If query is empty, return all records
  if (!query || query.trim() === "") {
    return (await baseQuery) as BookTable[];
  }

  // Use Phonetic, Lexical, and Fuzzy Search
  const result = (await baseQuery.where(
    or(
      sql`${books.titlePhonetic} = dmetaphone(${query})`,
      sql`${books.authorPhonetic} = dmetaphone(${query})`,
      sql`${books.genrePhonetic} = dmetaphone(${query})`,
      sql`${books.title} ILIKE ${`%${query}%`}`,
      sql`${books.author} ILIKE ${`%${query}%`}`,
      sql`${books.genre} ILIKE ${`%${query}%`}`,
      sql`${books.title} % ${query}`, // Fuzzy search using Trigrams
      sql`${books.author} % ${query}`,
      sql`${books.genre} % ${query}`
    )
  )) as BookTable[];
  await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
  return result;
};

export const fetchrecentaddbooks = async () => {
  try {
    const result = await db
      .select({
        title: books.title,
        author: books.author,
        coverUrl: books.coverUrl,
        createdAt: books.createdAt,
      })
      .from(books)
      .orderBy(desc(books.createdAt))
      .limit(ITEMS_PER_PAGE);

    return result;
  } catch (error) {
    return [];
  }
};

export const fetchrecentborrowedbooks = async () => {
  try {
    const result = await db
      .select({
        userName: users.fullName,
        bookTitle: books.title,
        bookAuthor: books.author,
        borrowDate: borrowRecords.borrowDate,
      })
      .from(borrowRecords)
      .innerJoin(users, eq(borrowRecords.userId, users.id))
      .innerJoin(books, eq(borrowRecords.bookId, books.id))
      .orderBy(desc(borrowRecords.borrowDate))
      .limit(ITEMS_PER_PAGE);

    return result;
  } catch (error) {
    return [];
  }
};

export const dashboardData = async () => {
  try {
    const borrowedRecords = await db
      .select({ count: sql<number>`count(*)` })
      .from(borrowRecords);

    const totalBorrowed = +borrowedRecords[0].count;

    const usersCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(users);

    const totalUsers = +usersCount[0].count;

    const booksCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(books);

    const totalBooks = +booksCount[0].count;

    return {
      totalBorrowed,
      totalUsers,
      totalBooks,
    };
  } catch (error) {
    return {
      totalBorrowed: 0,
      totalUsers: 0,
      totalBooks: 0,
    };
  }
};

export const fetchSearchBooks = async (query: string, currentPage: number) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  console.log(query);

  // Base query
  const baseQuery = db
    .select()
    .from(books)
    .orderBy(desc(books.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset);

  // If query is empty, return all records
  if (!query || query.trim() === "") {
    return (await baseQuery) as Book[];
  }

  // Use Phonetic, Lexical, and Fuzzy Search
  const result = (await baseQuery.where(
    or(
      sql`${books.titlePhonetic} = dmetaphone(${query})`,
      sql`${books.authorPhonetic} = dmetaphone(${query})`,
      sql`${books.genrePhonetic} = dmetaphone(${query})`,
      sql`${books.title} ILIKE ${`%${query}%`}`,
      sql`${books.author} ILIKE ${`%${query}%`}`,
      sql`${books.genre} ILIKE ${`%${query}%`}`,
      sql`${books.title} % ${query}`, // Fuzzy search using Trigrams
      sql`${books.author} % ${query}`,
      sql`${books.genre} % ${query}`
    )
  )) as Book[];

  return result;
};

export const getBookId = async (id: string) => {
  try {
    const book = await db.select().from(books).where(eq(books.id, id)).limit(1);
    return book[0] || null; // Return null if not found
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return null; // Or throw the error depending on your use case
  }
};

