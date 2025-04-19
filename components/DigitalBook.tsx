"use client";
import React, { use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Image from "next/image";

const DigitalBook = ({ booktitle }: { booktitle: string }) => {
  const router = useRouter();
  const handler = () => {
    router.push(`/pdf/${booktitle}`)
  };
  return (
    <Button className="book-overview_btn" onClick={handler}>
      <Image src="/icons/book.svg" alt="book" width={20} height={20} />
      <p className="font-bebas-neue text-xl text-dark-100">Digital Book</p>
    </Button>
  );
};

export default DigitalBook;
