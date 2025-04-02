import React from "react";

import {
  fetchfilterdbooks,
  totalBookspages,
  totalborrowedpages,
  fetchfilterdborrowedRecords,
} from "@/lib/data";
import Pagination from "@/components/admin/pagination";
import Image from "next/image";
import config from "@/lib/config";
import { formatDateToLocal } from "@/lib/utils";
import Search from "@/components/Search";

const Page = async ({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string };
}) => {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";
  const currentPage = resolvedSearchParams?.page || 1;
  const totalpages = await totalborrowedpages();
  const borrowedRecords = await fetchfilterdborrowedRecords(
    query,
    +currentPage
  );
  return (
    <section className="w-full rounded-2xl bg-white p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-xl font-semibold">Borrowed Recordes</h2>
        <Search placeholder="Search Borrowed Records.." />
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
                  User
                </th>
                <th scope="col" className="px-3 py-5 font-medium">
                  Borrwed Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {borrowedRecords.map((record) => (
                <tr
                  key={record.bookTitle}
                  className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                >
                  <td className="whitespace-nowrap py-3 pl-6 pr-3">
                    <div className="flex items-center gap-3">
                      <p className="font-bold">{record.bookTitle}</p>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">
                    {record.bookAuthor}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">
                    {record.userName}
                  </td>
                  <td className="whitespace-nowrap px-3 py-3 font-medium">
                    {record.borrowDate
                      ? formatDateToLocal(record.borrowDate)
                      : "N/A"}
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
