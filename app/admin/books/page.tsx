import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { fetchfilterdbooks, totalBookspages } from "@/lib/data";
import Pagination from "@/components/admin/pagination";
import Image from "next/image";
import config from "@/lib/config";
import { formatDateToLocal } from "@/lib/utils";
import Search from "@/components/Search";
import { UpdateBook, DeleteBook } from "@/components/admin/button";

const Page = async ({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) => {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = resolvedSearchParams?.page || 1;
  const totalpages = await totalBookspages();
  const books = await fetchfilterdbooks(query, +currentPage);
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">All Books</h2>
        <Search placeholder="Search Books.." />
        <Button className="bg-primary-admin" asChild>
          <Link href="/admin/books/new" className="text-white">
            + Create a New Book
          </Link>
        </Button>
      </div>

      <div className="mt-7 w-full overflow-hidden">
        <div className="mt-6 flow-root">
          <table className="hidden min-w-full text-gray-900 md:table ">
            <thead className="rounded-lg text-left text-sm font-normal bg-">
              <tr>
                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                  Book Tittle
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Author
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Genre
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Data Created
                </th>
                <th scope="col" className="relative py-3 pl-6 pr-3 font-medium">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {books.map((book) => (
                <tr
                  key={book.title}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <Image
                        src={`${config.env.imagekit.urlEndpoint}${book.coverUrl}`}
                        width={28}
                        height={28}
                        alt={`${book.coverUrl}'s profile picture`}
                      />
                      <p className="font-bold">{book.title}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">
                    {book.author}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">
                    {book.genre}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">
                    {book.createdAt ? formatDateToLocal(book.createdAt) : "N/A"}
                  </td>
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex justify-end gap-2">
                      <UpdateBook id={book.id} />
                      {/* <DeleteBook id={book.id} /> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalpages} />
        </div>
      </div>
    </section>
  );
};

export default Page;
