import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TOEFL Listen & Repeat Practice",
  description: "Practice TOEFL Speaking Listen & Repeat with instant feedback",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body className="antialiased min-h-screen bg-background">
        <header className="border-b">
          <div className="container max-w-[600px] mx-auto px-4 py-4">
            <h1 className="text-xl font-bold">TOEFL Repeat Practice</h1>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
