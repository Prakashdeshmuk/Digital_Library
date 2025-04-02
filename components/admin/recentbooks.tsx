import React from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import Image from "next/image";
import { fetchrecentaddbooks } from "@/lib/data";
import config from "@/lib/config";

const recentbooks = async () => {
  const recentaddbooks = await fetchrecentaddbooks();
  return (
    <div className="flex w-full flex-col md:col-span-4 mt-3">
      <h2 className={`mb-4 text-xl md:text-2xl`}>Latest Books</h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: Uncomment this code in Chapter 7 */}

        <div className="bg-white px-6">
          {recentaddbooks.map((book, i) => {
            return (
              <div
                key={book.title}
                className=  {clsx(
                  "flex flex-row items-center justify-between py-4",
                  {
                    "border-t": i !== 0,
                  }
                )}
              >
                <div className="flex items-center">
                  <Image
                    src={`${config.env.imagekit.urlEndpoint}${book.coverUrl}`}
                    alt={`${book.title}'s profile picture`}
                    className="mr-4"
                    width={32}
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold md:text-base">
                      {book.title}
                    </p>
                    <p className="hidden text-sm text-gray-500 sm:block">
                      {book.author}
                    </p>
                  </div>
                </div>
                <p className={`truncate text-sm font-medium md:text-base`}>
                  {book.createdAt
                    ? book.createdAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                    : "N/A"}
                </p>
              </div>
            );
          })}
        </div>
        <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div>
      </div>
    </div>
  );
};

export default recentbooks;
