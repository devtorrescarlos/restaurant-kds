import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { verifySession } from "@/lib/dal";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await verifySession();

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-brand-tertiary">
        <header className="flex items-center gap-2 border-b bg-sidebar px-4 py-2 md:hidden">
          <SidebarTrigger className="size-8 text-white" />
        </header>
        <main className="flex flex-1 flex-col gap-6 p-4 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
