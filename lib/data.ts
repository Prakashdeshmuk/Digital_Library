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
  const result = (await db
    .select({
      coverUrl: books.coverUrl,
      title: books.title,
      author: books.author,
      genre: books.genre,
      createdAt: books.createdAt,
    })
    .from(books)
    .where(
      or(
        sql`${books.title} ILIKE ${`%${query}%`}`,
        sql`${books.author} ILIKE ${`%${query}%`}`,
        sql`${books.genre} ILIKE ${`%${query}%`}`,
        sql`${books.createdAt}::text ILIKE ${`%${query}%`}`
      )
    )
    .orderBy(desc(books.createdAt))
    .limit(ITEMS_PER_PAGE)
    .offset(offset)) as BookTable[];

  return result;
};
