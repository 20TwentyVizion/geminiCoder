import type { Metadata } from "next";
import "./globals.css";

let title = "VizionCoder Alpha – AI Code Generator";
let description = "Generate your next app with VizionCoder";
let url = "https://llamacoder.io/";
let ogimage = "https://cdn.leonardo.ai/users/6cd4ea3f-13be-4f8f-8b23-66cb07a2d68b/generations/33520e9b-43ac-4f77-865a-93341fc61526/Portrait_Perfect_a_beautiful_modern_city_skyline_at_dusk_3.jpg";
let sitename = "vizioncoder.io";

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    images: [ogimage],
    title,
    description,
    url: url,
    siteName: sitename,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [ogimage],
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-[url('https://cdn.leonardo.ai/users/6cd4ea3f-13be-4f8f-8b23-66cb07a2d68b/generations/977da1f7-bbdf-4181-afac-b006bebd26eb/85c46e1a-5a32-46c0-8c54-115ac55ec398.jpg')] bg-cover bg-center bg-fixed bg-no-repeat">
        {children}
      </body>
    </html>
  );
}
