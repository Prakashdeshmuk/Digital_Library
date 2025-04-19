import React from "react";
import Sample from "@/components/Sample";

const page = async({ params }: { params: Promise<{ title: string }> }) => {
  const title = (await params).title;
  console.log(title);
  return (
    <>
      <div className="flex ">
        <Sample />
      </div>
    </>
  );
};

export default page;
