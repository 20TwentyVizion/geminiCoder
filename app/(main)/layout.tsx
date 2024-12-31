import Image from "next/image";
import bgImg from "@/public/halo.png";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="bg-brand antialiased">
      <div className="fixed inset-0 -z-10 bg-[url('/background.jpg')] bg-cover bg-center bg-no-repeat opacity-30" />
      <div className="relative flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </body>
  );
}
