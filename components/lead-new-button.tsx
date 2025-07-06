import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Lead } from "@/types";
import { LeadForm } from "./lead-form";

export { LeadNewButton };

const LeadNewButton = ({
  isDialogOpen,
  onOpenChange,
  onAddLead,
}: {
  isDialogOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLead: (
    lead: Omit<Lead, "id" | "created_at" | "updated_at" | "user_id">,
  ) => void;
}) => (
  <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <Button size="sm" variant="outline">
        <Plus className="mr-1 h-4 w-4" />
        Add Lead
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Add New Lead</DialogTitle>
        <DialogDescription>
          Enter the lead's information below.
        </DialogDescription>
      </DialogHeader>
      <LeadForm onSubmit={onAddLead} onCancel={() => onOpenChange(false)} />
    </DialogContent>
  </Dialog>
);
