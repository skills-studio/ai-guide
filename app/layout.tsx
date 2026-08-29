import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI CONTROL™ | Практическа бизнес система",
  description:
    "Практическа бизнес система за стратегия, готови промптове, Prompt Control™, автоматизации, AI Консултант, ROI, GDPR и EU AI Act.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg">
      <body>{children}</body>
    </html>
  );
}
