import { SuperadminDashboard } from "@/features/admin/components/superadmin-dashboard";
import { getManagers } from "@/features/admin/services/managers.service";

export default async function AdminPage() {
  const data = await getManagers({ page: 1, limit: 10 });

  return <SuperadminDashboard managers={data} />;
}
