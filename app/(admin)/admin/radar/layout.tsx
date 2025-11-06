import { redirect } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Only allow access in development mode
  if (process.env.NODE_ENV !== "development") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4">
          <h1 className="text-lg font-semibold">Radar Admin (Dev Only)</h1>
        </div>
      </header>
      <main className="container py-6">{children}</main>
    </div>
  );
}
