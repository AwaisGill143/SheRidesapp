-- Insert sample users
INSERT INTO users (id, email, phone, full_name, user_type, avatar_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'ayesha@example.com', '+1234567890', 'Ayesha Khan', 'rider', null),
('550e8400-e29b-41d4-a716-446655440002', 'sarah@example.com', '+1234567891', 'Sarah Johnson', 'driver', null),
('550e8400-e29b-41d4-a716-446655440003', 'maria@example.com', '+1234567892', 'Maria Rodriguez', 'driver', null),
('550e8400-e29b-41d4-a716-446655440004', 'priya@example.com', '+1234567893', 'Priya Sharma', 'rider', null),
('550e8400-e29b-41d4-a716-446655440005', 'fatima@example.com', '+1234567894', 'Fatima Ali', 'driver', null)
ON CONFLICT (email) DO NOTHING;

-- Insert driver profiles
INSERT INTO driver_profiles (user_id, vehicle_make, vehicle_model, vehicle_color, license_plate, vehicle_type, rating, total_rides, is_verified, bio, is_online) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'Honda', 'Civic', 'White', 'ABC-123', 'car', 4.9, 234, true, 'Friendly driver who loves helping other women feel safe on the road! 💗', true),
('550e8400-e29b-41d4-a716-446655440003', 'Toyota', 'Prius', 'Silver', 'XYZ-789', 'car', 5.0, 156, true, 'Safe rides with great music and good vibes! Always happy to chat or give you quiet time.', true),
('550e8400-e29b-41d4-a716-446655440005', 'Bajaj', 'RE', 'Yellow', 'RIC-456', 'rickshaw', 4.8, 89, true, 'Experienced rickshaw driver, know all the shortcuts! Your safety is my priority.', true)
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample scheduled ride requests
INSERT INTO ride_requests (id, rider_id, pickup_location, dropoff_location, vehicle_type, suggested_price, rider_mood, is_scheduled, scheduled_time, status) VALUES
('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', '123 Main Street, Downtown', '456 Oak Avenue, Uptown', 'car', 15.00, 'happy', true, '2024-12-15 14:00:00+00', 'pending'),
('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Airport Terminal 1', 'Home - 789 Pine Road', 'rickshaw', 25.00, 'tired', true, '2024-12-16 09:30:00+00', 'pending'),
('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440004', 'Mall Entrance', 'University Campus', 'bike', 8.00, 'excited', true, '2024-12-17 16:15:00+00', 'pending')
ON CONFLICT (id) DO NOTHING;

-- Insert sample completed rides for recent activity
INSERT INTO ride_requests (id, rider_id, pickup_location, dropoff_location, vehicle_type, suggested_price, rider_mood, is_scheduled, status) VALUES
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440001', 'Downtown Plaza', 'Airport Terminal 2', 'car', 18.00, 'anxious', false, 'completed'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440001', 'Home - 789 Pine Road', 'Shopping Mall', 'rickshaw', 12.00, 'happy', false, 'completed')
ON CONFLICT (id) DO NOTHING;

-- Insert corresponding completed rides
INSERT INTO rides (request_id, driver_id, agreed_price, status, started_at, completed_at) VALUES
('650e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 18.00, 'completed', '2024-12-13 10:00:00+00', '2024-12-13 10:45:00+00'),
('650e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', 12.00, 'completed', '2024-12-12 15:30:00+00', '2024-12-12 16:00:00+00')
ON CONFLICT (request_id) DO NOTHING;

-- Insert sample feedback
INSERT INTO ride_feedback (ride_id, from_user_id, to_user_id, rating, safety_rating, feedback_text, feedback_tags) VALUES
((SELECT id FROM rides WHERE request_id = '650e8400-e29b-41d4-a716-446655440004'), '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 5, 5, 'Amazing ride! Sarah was so friendly and made me feel completely safe.', ARRAY['great_driver', 'felt_safe', 'friendly']),
((SELECT id FROM rides WHERE request_id = '650e8400-e29b-41d4-a716-446655440005'), '550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440005', 5, 4, 'Great rickshaw ride, Fatima knows all the best routes!', ARRAY['great_driver', 'clean_vehicle'])
ON CONFLICT (ride_id, from_user_id, to_user_id) DO NOTHING;
