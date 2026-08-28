import "./globals.css";

export const metadata = {
  title: "Voku Image Slider | Codegrid",
  description: "Voku Image Slider | Codegrid",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
