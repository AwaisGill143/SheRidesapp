-- Create chat rooms table
CREATE TABLE IF NOT EXISTS chat_rooms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ride_id UUID NOT NULL REFERENCES rides(id) ON DELETE CASCADE,
  rider_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  driver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chat messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_room_id UUID NOT NULL REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message_text TEXT NOT NULL,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'location', 'safety_alert', 'system')),
  is_read BOOLEAN DEFAULT false,
  is_flagged BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quick messages table
CREATE TABLE IF NOT EXISTS quick_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  message_text TEXT NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('arrival', 'location', 'safety', 'general')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create push subscriptions table
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, endpoint)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  type VARCHAR(50) NOT NULL,
  data JSONB,
  is_read BOOLEAN DEFAULT false,
  is_sent BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_rooms_ride_id ON chat_rooms(ride_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_rider_id ON chat_rooms(rider_id);
CREATE INDEX IF NOT EXISTS idx_chat_rooms_driver_id ON chat_rooms(driver_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_chat_room_id ON chat_messages(chat_room_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id ON push_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);

-- Insert default quick messages
INSERT INTO quick_messages (message_text, category) VALUES
('I''m arriving in 2 minutes! 🚗', 'arrival'),
('I''m here! Can you see my vehicle?', 'arrival'),
('Running 5 minutes late, sorry!', 'arrival'),
('I''m at the pickup location', 'arrival'),
('Can you share your exact location?', 'location'),
('I''m near the main entrance', 'location'),
('Look for a pink vehicle', 'location'),
('I''m by the traffic light', 'location'),
('Are you okay? Please confirm', 'safety'),
('Emergency - need immediate help!', 'safety'),
('Feeling unsafe, please check on me', 'safety'),
('All good, ride going smoothly', 'safety'),
('Thank you for the ride! 💕', 'general'),
('Have a great day!', 'general'),
('Safe travels!', 'general'),
('Please drive carefully', 'general');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_chat_rooms_updated_at BEFORE UPDATE ON chat_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_push_subscriptions_updated_at BEFORE UPDATE ON push_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
