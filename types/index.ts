export type { Lead, Message };

type Lead = {
  id: string;
  name: string;
  role: string;
  company: string;
  linkedin_url?: string;
  status: "draft" | "approved" | "sent";
  user_id: string;
  created_at: string;
  updated_at: string;
};

type Message = {
  id: string;
  lead_id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
};
