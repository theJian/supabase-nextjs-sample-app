-- Lead Management Dashboard - Row Level Security Setup
-- This script enables RLS and creates policies for data isolation

-- Enable Row Level Security on both tables
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Leads table policies - users can only access their own leads
CREATE POLICY "Users can view their own leads" ON leads
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own leads" ON leads
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own leads" ON leads
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own leads" ON leads
  FOR DELETE USING (auth.uid() = user_id);

-- Messages table policies - users can only access messages for their own leads
CREATE POLICY "Users can view messages for their own leads" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = messages.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages for their own leads" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = messages.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages for their own leads" ON messages
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = messages.lead_id
      AND leads.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages for their own leads" ON messages
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM leads
      WHERE leads.id = messages.lead_id
      AND leads.user_id = auth.uid()
    )
  );
