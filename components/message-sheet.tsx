import type React from "react";

import { useState, useEffect, startTransition } from "react";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Message } from "@/types";
import { generateMessage } from "@/app/actions";

export { MessageSheet };

function MessageSheet({
  isOpen,
  onClose,
  leadId,
  leadName,
}: {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadName: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newMessage, setNewMessage] = useState({
    content: "",
  });

  // Load messages when sheet opens or leadId changes
  useEffect(() => {
    if (isOpen) {
      loadMessages();
    }
  }, [isOpen, leadId]);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await createClient()
        .from("messages")
        .select("*")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.content.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { data, error } = await createClient()
        .from("messages")
        .insert([
          {
            lead_id: leadId,
            content: newMessage.content.trim(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      setMessages([data, ...messages]);
      setNewMessage({ content: "" });
    } catch (error) {
      console.error("Error adding message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:w-[540px] sm:max-w-none flex flex-col"
      >
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Messages for {leadName}
          </SheetTitle>
          <SheetDescription>
            Add messages for this lead with 🤖.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden p-4">
          {/* Add new message form */}
          <div className="flex-shrink-0 space-y-4 border-b pb-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <Textarea
                id="message-content"
                placeholder="Click [✨ Surprise me!] to get started..."
                value={newMessage.content}
                onChange={(e) => {
                  // Do nothing. This prevents the textarea from being edited by the user.
                }}
                className="min-h-[100px] resize-none mt-1"
              />
              <div className="flex justify-between items-center gap-3">
                <Button
                  disabled={isSubmitting || isGenerating}
                  className="flex-shrink-0"
                  variant="outline"
                  onClick={async () => {
                    setIsGenerating(true);
                    startTransition(async () => {
                      const resp = await generateMessage(leadId);
                      if (resp?.success && resp.message) {
                        setNewMessage({ content: resp.message });
                      }
                      setIsGenerating(false);
                    });
                  }}
                >
                  {isGenerating ? "Thinking..." : "✨ Surprise me!"}
                </Button>
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || isGenerating || !newMessage.content.trim()
                  }
                  className="flex-shrink-0"
                >
                  {isSubmitting ? "Adding..." : "Add Message"}
                </Button>
              </div>
            </form>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-12">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600 mb-4"></div>
                  <p className="text-sm text-gray-500">Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-sm">
                    Add your first message above to get started
                  </p>
                </div>
              ) : (
                messages.map((message) => {
                  return (
                    <div
                      key={message.id}
                      className="border rounded-lg p-4 bg-white shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-400">
                              {new Date(
                                message.created_at,
                              ).toLocaleDateString()}{" "}
                              at{" "}
                              {new Date(message.created_at).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
