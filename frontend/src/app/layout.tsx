import { Footer } from "@/modules/common/components/footer";
import { Header } from "@/modules/features/auth/components/header";
import "@/styles/font.css";
import "@/styles/main.css";
import "ionicons/css/ionicons.min.css";
import type { Metadata } from "next";
import { ReactNode } from "react";

export const fetchCache = "default-no-store";

export const metadata: Metadata = {
  title: "Conduit",
  description: "Conduit",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
