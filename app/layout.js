import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Provider from "./provider";
import { Toaster } from "sonner";
import ErrorBoundary from "./(main)/components/ErrorBoundary";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AI Voice Agent",
  description: "AI Voice Agent Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ErrorBoundary>
          <Provider>
            {children}
            <Toaster/>
            {/* for toast msg this we import from shadcn as name og sonner */}
          </Provider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
