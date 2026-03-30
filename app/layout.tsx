import type { Metadata } from "next";
import { Nunito, Pacifico } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const pacifico = Pacifico({
  variable: "--font-pacifico",
  subsets: ["latin"],
  weight: "400",
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ember - GitHub Roaster",
  description:
    "Share your GitHub profile and let Ember give you genuine, helpful feedback. It looks at what stands out positively and where things could be improved, with absolutely no sugarcoating so you get the honest input you need.",
  keywords: [
    "Ember",
    "GitHub Roast",
    "GitHub Review",
    "Developer Feedback",
    "GitHub Profile Check",
  ],
  authors: [{ name: "Vansh Chouhan" }],
  creator: "Vansh Chouhan",
  metadataBase: new URL("https://your-domain.com"),
  openGraph: {
    title: "Ember - GitHub Roaster",
    description:
      "Let Ember take a detailed look at your GitHub and help you see what catches attention and what might be holding you back. It'll bring everything into the open so you can improve and grow.",
    url: "https://your-domain.com",
    images: ["/og-ember.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ember - GitHub Roaster",
    description:
      "Share your GitHub and let us take an honest look. We will point out what makes your profile shine and where there is room to make it even better.",
    images: ["/og-ember.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
