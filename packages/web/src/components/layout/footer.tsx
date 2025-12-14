import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0 text-sm leading-loose text-muted-foreground md:text-left">
          <p>
            <Link
              href="https://github.com/bjardon"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              @bjardon
            </Link>
          </p>
          <p>
            Ilustración de{" "}
            <Link href="https://unsplash.com/es/@genetx?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Syed Foyez Uddin
            </Link>{" "}
            en{" "}
            <Link href="https://unsplash.com/es/ilustraciones/arbol-de-navidad-y-regalos-con-muneco-de-nieve-h8aRZY12lG8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">
              Unsplash
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
