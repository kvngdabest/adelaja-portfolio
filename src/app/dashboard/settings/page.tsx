import { SettingsForm } from "@/components/dashboard/settings-form";
import { getSettings } from "@/lib/data/admin";

export default async function DashboardSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <SettingsForm settings={settings} />
    </div>
  );
}
