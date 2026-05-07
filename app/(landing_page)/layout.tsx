import React from "react";
import LandingNavbar from "./components/LandingNavbar";
import LandingFooter from "./components/LandingFooter";
import { Cormorant_Garamond, Montserrat  } from 'next/font/google';
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-cormorant'
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-montserrat', 
});

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={`${cormorant.variable} ${montserrat.variable} flex flex-col min-h-screen`}>
      <LandingNavbar />
      <main className="grow">
        {children}
      </main>
      <LandingFooter />
    </div>
  );
}
