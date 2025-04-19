import React from "react";
import Sample from "@/components/Sample";
import { filePath } from "@/constants";

const page = async ({ params }: { params: Promise<{ title: string }> }) => {
  const title = (await params).title;
  console.log(decodeURIComponent(title));
  const PathUrl = filePath.get(decodeURIComponent(title));
  console.log(PathUrl);
  return (
    <>
      <div className="flex">
        <Sample file={PathUrl}/>
      </div>
    </>
  );
};

export default page;
