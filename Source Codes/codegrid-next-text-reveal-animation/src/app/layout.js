import "./globals.css";

export const metadata = {
  title: "Text Reveal Animation | Codegrid",
  description: "Text Reveal Animation | Codegrid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
