import "./globals.css";
import { Boldonse, Google_Sans_Flex } from "next/font/google";
import Menu from "@/components/Menu/Menu";

const boldonse = Boldonse({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-boldonse",
});

const googleSansFlex = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-google-sans-flex",
});

export const metadata = {
  title: "Poppr Menu | Codegrid",
  description: "Poppr Menu | Codegrid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${boldonse.variable} ${googleSansFlex.variable}`}>
        <Menu />
        {children}
      </body>
    </html>
  );
}
