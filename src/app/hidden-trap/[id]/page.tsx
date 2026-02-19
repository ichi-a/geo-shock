import { notFound } from "next/navigation";

export default function HoneypotPage() {
  notFound();
}

export const metadata = {
  robots: { index: false, follow: false },
};
