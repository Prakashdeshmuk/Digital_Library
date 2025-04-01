import { db } from "@/database/drizzle";
import { books } from "@/database/schema";
import { desc, sql } from "drizzle-orm";
import { or } from "drizzle-orm";

const ITEMS_PER_PAGE = 6;

const totalborrowedpages = ({ query }: { query: string }) => {
  try {
  } catch (error) {}
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

export const fetchfilterdbooks = async (query: string, currentPage: number) => {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Base query
  let baseQuery = db
    .select({
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

  return result;
};
