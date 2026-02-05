import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Time Management App</h1>
      <p className="mt-2 text-gray-600">
        Schedule and manage your events efficiently.
      </p>

      <Link
        href="/calendar"
        className="inline-block mt-4 px-4 py-2 bg-black text-white rounded"
      >
        Open Calendar
      </Link>
    </main>
  );
}
