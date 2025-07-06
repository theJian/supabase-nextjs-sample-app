import Link from "next/link";
import { Button } from "./ui/button";
import { createClient } from "@/lib/supabase/server";

export async function LeadsEntryButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user ? (
    <div className="flex items-center gap-4">
      <Button asChild size="lg" variant={"outline"}>
        <Link href="/leads">Go to Dashboard 👉</Link>
      </Button>
    </div>
  ) : null;
}
