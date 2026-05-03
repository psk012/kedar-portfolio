import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "This is Kedar",
  description: "Building systems that survive real use.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    /*
     * bg-background lives on <html>, NOT <body>.
     * body must stay transparent so the fixed CinematicBackground video
     * at z=-1 is visible above the html canvas. See globals.css for details.
     */
    <html lang="en" className="dark bg-background">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      {/*
       * Mobile safe-area: pb-[100px] guarantees content never sits under the
       * floating nav pill. With the pill at bottom-4 (16px) and ≈48px tall,
       * its top edge is ~64px from the viewport bottom — leaving a clean
       * 36px buffer between the last line of content and the nav.
       * lg:pb-0: desktop's vertical rail nav doesn't need bottom clearance.
       */}
      <body className="text-zinc-200 antialiased min-h-screen overflow-x-hidden pb-[120px] lg:pb-0">
        {children}
      </body>
    </html>
  );
}
