"use client";

import type React from "react";

import { useState, useCallback, useEffect, useRef } from "react";
import { Plus, ExternalLink, Building2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { Lead } from "@/types";
import { INITIAL_LOAD_LIMIT, LOAD_MORE_LIMIT } from "@/config/lead";
import { LeadNewButton } from "./lead-new-button";
import { MessageSheet } from "./message-sheet";

export { LeadDashboard };

function LeadItem({
  lead,
  onOpenMessages,
}: {
  lead: Lead;
  onOpenMessages: (leadId: string, leadName: string) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group flex items-start justify-between py-4 px-4 border-b border-gray-100 hover:bg-gray-50/50 transition-colors"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900">{lead.name}</span>
          <span className="text-sm text-gray-500">• {lead.role}</span>
        </div>

        <div className="flex items-center gap-3 text-sm text-gray-500">
          <span>{new Date(lead.created_at).toLocaleDateString()}</span>

          <div className="flex items-center gap-1">
            <Building2 className="h-3 w-3" />
            {lead.company}
          </div>

          {lead.linkedin_url && (
            <a
              href={lead.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="h-3 w-3" />
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <div
        className={`flex items-center gap-1 transition-opacity duration-200 ${isHovered ? "opacity-100" : "opacity-0"}`}
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onOpenMessages(lead.id, lead.name)}
          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 h-8 w-8 p-0"
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function LeadDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [messageSheet, setMessageSheet] = useState<{
    isOpen: boolean;
    leadId: string;
    leadName: string;
  }>({
    isOpen: false,
    leadId: "",
    leadName: "",
  });
  const observerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);

  // Load initial leads
  useEffect(() => {
    loadInitialLeads();
  }, []);

  const loadInitialLeads = async () => {
    try {
      const { data, error } = await createClient()
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(INITIAL_LOAD_LIMIT);

      if (error) throw error;

      setLeads(data || []);
      offsetRef.current = data?.length || 0;
      setHasMore((data?.length || 0) === INITIAL_LOAD_LIMIT);
    } catch (error) {
      console.error("Error loading leads:", error);
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleAddLead = async (
    newLead: Omit<Lead, "id" | "created_at" | "updated_at" | "user_id">,
  ) => {
    try {
      const { data, error } = await createClient()
        .from("leads")
        .insert([newLead])
        .select()
        .single();

      if (error) throw error;

      setLeads([data, ...leads]);
      offsetRef.current += 1;
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding lead:", error);
      throw error;
    }
  };

  const handleOpenMessages = (leadId: string, leadName: string) => {
    setMessageSheet({
      isOpen: true,
      leadId,
      leadName,
    });
  };

  const handleCloseMessages = () => {
    setMessageSheet({
      isOpen: false,
      leadId: "",
      leadName: "",
    });
  };

  const loadMoreLeads = useCallback(async () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    try {
      const { data, error } = await createClient()
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false })
        .range(offsetRef.current, offsetRef.current + LOAD_MORE_LIMIT);

      if (error) throw error;

      if (data && data.length > 0) {
        setLeads((prevLeads) => [...prevLeads, ...data]);
        offsetRef.current += data.length;
        setHasMore(data.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more leads:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, leads.length]);

  // Intersection Observer for infinite scroll within container
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMoreLeads();
        }
      },
      {
        threshold: 0.1,
        root: containerRef.current,
      },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [loadMoreLeads, hasMore, isLoading]);

  if (isInitialLoading) {
    return <InitialLoadScreen />;
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-full max-w-2xl h-[600px] bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col shadow-xl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="text-sm text-gray-600 italic">
            {leads.length} leads
          </div>

          <LeadNewButton
            isDialogOpen={isDialogOpen}
            onOpenChange={setIsDialogOpen}
            onAddLead={handleAddLead}
          />
        </div>

        <div ref={containerRef} className="flex-1 overflow-y-auto">
          {leads.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="mb-4 w-[180px]">
                  <img
                    src="https://i.kym-cdn.com/photos/images/newsfeed/001/157/196/bcf.gif"
                    alt="No leads meme"
                  />
                </div>
                <p className="text-gray-500 mb-4">No leads yet</p>
                <Button
                  onClick={() => setIsDialogOpen(true)}
                  size="sm"
                  variant="outline"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add your first lead
                </Button>
              </div>
            </div>
          ) : (
            <div>
              {leads.map((lead) => (
                <LeadItem
                  key={lead.id}
                  lead={lead}
                  onOpenMessages={handleOpenMessages}
                />
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="text-center py-4 border-b border-gray-100">
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                </div>
              )}

              {/* Intersection observer target */}
              <div ref={observerRef} className="h-4" />

              {/* End of list indicator */}
              {!hasMore && leads.length > 0 && (
                <div className="text-center py-4 text-xs text-gray-400 border-b border-gray-100">
                  End of list
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <MessageSheet
        isOpen={messageSheet.isOpen}
        onClose={handleCloseMessages}
        leadId={messageSheet.leadId}
        leadName={messageSheet.leadName}
      />
    </div>
  );
}

const InitialLoadScreen = () => (
  <div className="h-[600px] flex items-center justify-center">
    <div className="text-center">
      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-600 mb-4"></div>
      <p className="text-gray-600">Loading leads...</p>
    </div>
  </div>
);
