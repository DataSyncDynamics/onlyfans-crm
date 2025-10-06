import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/auth-context";
import { RoleProvider } from "@/contexts/role-context";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "VaultCRM - Powered by DataSync Dynamics",
  description: "Professional CRM for OnlyFans creators and agencies",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} antialiased`}>
        <AuthProvider>
          <RoleProvider>
            {children}
          </RoleProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
