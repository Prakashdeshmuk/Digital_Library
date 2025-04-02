import React from "react";
import SearchBooks from "@/components/ui/SearchBooks";
import { totalBookspages } from "@/lib/data";
import { fetchSearchBooks } from "@/lib/data";
import BookList from "@/components/BookList";
import Pagination from "@/components/admin/pagination";

const page = async ({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) => {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = resolvedSearchParams?.page || 1;
  const totalpages = await totalBookspages();
  const books = await fetchSearchBooks(query, +currentPage);
  console.log(books);
  return (
    <>
      <SearchBooks placeholder="Search Books.." />
      <BookList title="Latest Books" books={books} containerClassName="mt-28" />
      <div className="mt-5 flex w-full justify-center">
        <Pagination totalPages={totalpages} />
      </div>
    </>
  );
};

export default page;
