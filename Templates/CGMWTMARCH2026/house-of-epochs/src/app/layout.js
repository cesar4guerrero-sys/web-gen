import ClientLayout from "@/client-layout";

import "./globals.css";

export const metadata = {
  title: "House of Epochs | Codegrid",
  description: "MWT by Codegrid | March 2026",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
