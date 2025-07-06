import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { LeadDashboard } from "@/components/lead-dashboard";

export default async function LeadsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="flex-1 flex flex-col w-full">
      <LeadDashboard />
    </div>
  );
}
