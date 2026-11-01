import type { Metadata } from "next";
import type { ReactNode } from "react";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "NoteHub",
  description: "A simple application for managing personal notes.",
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: ReactNode;
  modal: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />
          {children}
          {modal}
          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}
