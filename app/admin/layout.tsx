import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";
import "./admin.css";

// Every admin page reads the session cookie, so navigations here may block.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Administration", template: "%s · Administration" },
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="fr" className={fontVariables}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
