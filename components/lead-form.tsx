import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Lead } from "@/types";

export { LeadForm };

function LeadForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (
    lead: Omit<Lead, "id" | "created_at" | "updated_at" | "user_id">,
  ) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    linkedin_url: "",
    status: "draft",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.role || !formData.company || isSubmitting)
      return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: formData.name,
        role: formData.role,
        company: formData.company,
        linkedin_url: formData.linkedin_url,
        status: "draft",
      });

      setFormData({
        name: "",
        role: "",
        company: "",
        linkedin_url: "",
        status: "draft",
      });
    } catch (error) {
      console.error("Error adding lead:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter lead's full name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role *</Label>
        <Input
          id="role"
          value={formData.role}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          placeholder="e.g., Engineering Lead, Product Manager, etc."
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company *</Label>
        <Input
          id="company"
          value={formData.company}
          onChange={(e) =>
            setFormData({ ...formData, company: e.target.value })
          }
          placeholder="Company name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="linkedin">LinkedIn URL</Label>
        <Input
          id="linkedin"
          type="url"
          value={formData.linkedin_url}
          onChange={(e) =>
            setFormData({ ...formData, linkedin_url: e.target.value })
          }
          placeholder="www.linkedin.com/in/chen-yan-6619602a7"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Adding..." : "Add Lead"}
        </Button>
      </div>
    </form>
  );
}
