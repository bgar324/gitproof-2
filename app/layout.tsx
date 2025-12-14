import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";

// Load Instrument Serif from Google
const instrument = Instrument_Serif({ 
  subsets: ["latin"], 
  weight: "400",
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GitProof | Recruiter-Ready GitHub Reports",
  description: "Transform your GitHub activity into professional, data-driven PDF reports for job applications.",
  icons: {
    icon: "/favicon.ico", // Ensure you have a favicon
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`
          ${GeistSans.className} 
          ${instrument.variable} 
          antialiased 
          bg-background 
          text-foreground
        `}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* Navbar sits outside the template, so it doesn't re-animate on navigation */}
          {/* <Navbar /> */}
          
          {/* Children (Page Content) will be wrapped by template.tsx automatically */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}