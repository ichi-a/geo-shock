import { notFound } from "next/navigation";

export default function LlmProbePage() {
  notFound();
}

export const metadata = {
  robots: { index: false, follow: false },
};
