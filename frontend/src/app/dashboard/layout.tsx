"use client";

import { ReactNode, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/dashboard/navbar"; // <--- Importe a Navbar
import { Spinner } from "@/components/ui/spinner";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <section className="w-full h-screen flex items-center justify-center">
        <Spinner className="size-20" />
      </section>
    );
  }

  if (user) {
    return (
      <div className="flex-col flex min-h-screen bg-slate-50/50">
        {/* 1. Navbar fixa no topo */}
        <Navbar />

        {/* 2. Conteúdo da página com padding */}
        <main className="flex-1 space-y-4 p-8 pt-6">{children}</main>
      </div>
    );
  }

  return null;
}
