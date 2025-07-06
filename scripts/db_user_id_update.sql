-- Update the leads table user_id column to have a default value
ALTER TABLE leads ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Update the messages table user_id column to have a default value
ALTER TABLE messages ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Make user_id columns NOT NULL since they should always have a value
ALTER TABLE leads ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE messages ALTER COLUMN user_id SET NOT NULL;
