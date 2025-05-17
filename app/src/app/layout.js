import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import AuthProvider from './components/Auth/AuthProvider/AuthProvider';
import Authenticate from "./components/Auth/Authenticate/Authenticate";

import Header from "./components/Header/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Scamzap",
  description: "Protect yourself from scams",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <AuthProvider>
          <Authenticate />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
