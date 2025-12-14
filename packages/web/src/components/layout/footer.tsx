import Link from "next/link";
import { Separator } from "../ui/separator";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0 text-sm leading-loose text-muted-foreground md:text-left">
          <p>
            Un proyecto de{" "}
            <Link
              href="https://github.com/bjardon"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              @bjardon
            </Link>
          </p>
          <p className="text-muted-foreground/50">|</p>
          <p>
            Ilustración de{" "}
            <a
              href="https://unsplash.com/es/@genetx?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Syed Foyez Uddin
            </a>{" "}
            en{" "}
            <a
              href="https://unsplash.com/es/ilustraciones/muneco-de-nieve-y-arbol-de-navidad-con-regalos-en-la-nieve-SWNZY8mfPq8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
