import "./globals.css";
import QueryProvider from "../components/QueryProvider";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "Wash World App",
  description: "Wash World exam project",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <Navbar />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}