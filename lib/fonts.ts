import { Instrument_Serif, JetBrains_Mono, Schibsted_Grotesk } from "next/font/google";

const display = Schibsted_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const accent = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
  style: "italic",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

/** Class names exposing the three font CSS variables; put on <html>. */
export const fontVariables = `${display.variable} ${accent.variable} ${mono.variable}`;
