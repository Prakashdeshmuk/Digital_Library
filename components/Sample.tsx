"use client";

import { useCallback, useState } from "react";
import { useResizeObserver } from "@wojtekmaj/react-hooks";
import { pdfjs, Document, Page } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "./ui/button";
import { ChatInterface } from "./ChatInterface";

import type { PDFDocumentProxy } from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const options = {
  cMapUrl: "/cmaps/",
  standardFontDataUrl: "/standard_fonts/",
};

const resizeObserverOptions = {};

const maxWidth = 800;

type PDFFile = string | File | null;

interface Props {
  file?: PDFFile;
}
export default function Sample({ file: initialFile }: Props) {
  const [file, setFile] = useState<PDFFile>(initialFile || "/Algorithms.pdf");
  const [numPages, setNumPages] = useState<number>();
  const [containerRef, setContainerRef] = useState<HTMLElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageText, setPageText] = useState<string>("");

  const onResize = useCallback<ResizeObserverCallback>((entries) => {
    const [entry] = entries;

    if (entry) {
      setContainerWidth(entry.contentRect.width);
    }
  }, []);

  useResizeObserver(containerRef, resizeObserverOptions, onResize);

  function onFileChange(event: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = event.target;

    const nextFile = files?.[0];

    if (nextFile) {
      setFile(nextFile);
    }
  }
  function changePage(offset: number) {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }
  function onDocumentLoadSuccess({
    numPages: nextNumPages,
  }: PDFDocumentProxy): void {
    setNumPages(nextNumPages);
  }

  const onLoadPageSuccess = (page: any) => {
    page.getTextContent().then((textContent: any) => {
      let text = "";
      textContent.items.forEach((item: any) => {
        text += item.str + " ";
      });
      setPageText(text); // Store the text content in state
    });
    // console.log("hey here");
    // console.log(pageText);
  };
  return (
    <div className="Example">
      <header>
        <h1>react-pdf sample page</h1>
      </header>
      <div className="flex flex-row  h-screen w-screen ">
        <div ref={setContainerRef}>
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            <Page
              pageNumber={pageNumber}
              onRenderSuccess={onLoadPageSuccess}
            ></Page>
          </Document>

          <div className="text-white flex flex-row  w-full justify-center items-center gap-5 mt-5">
            <Button onClick={previousPage} disabled={pageNumber <= 1}>
              prevoius
            </Button>
            <Button onClick={nextPage} disabled={pageNumber >= (numPages ?? 0)}>
              next
            </Button>
          </div>
        </div>
        <div className="w-full">
          <ChatInterface pageText={pageText} />
        </div>
      </div>
    </div>
  );
}
