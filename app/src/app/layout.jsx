import "./globals.css";

import AuthProvider from "../components/auth/authprovider/AuthProvider";
import ServiceWorkerRegister from "../components/serviceworkerregister/ServiceWorkerRegister";
import { BottomBar } from "../components/bottombar/Bottombar";
import AdminRedirect from "../components/admin/redirect/Redirect";

export const metadata = {
  title: "Scamzap",
  description: "Protect yourself from scams",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta property="og:title" content="Scamzap" />
        <meta property="og:description" content="Welcome to Scamzap!" />
        <meta property="og:image" content="/icons/icon-512x512.webp" />
        <meta property="og:url" content="https://scamzap.upayan.dev" />
        <meta property="og:type" content="website" />
      </head>
      <body className={`antialiased`}>
        <AuthProvider>
          <BottomBar />
          <AdminRedirect />
          {children}
          <ServiceWorkerRegister />
        </AuthProvider>
      </body>
    </html>
  );
}
