import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MallMind — AI Mall Operations",
  description: "Professional AI operations platform for mall traffic, incidents, campaigns, and analytics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
