-- Fix email confirmation for existing user (confirmed_at is auto-generated)
UPDATE auth.users 
SET email_confirmed_at = NOW()
WHERE email = 'vinay.joshi1608@gmail.com';

-- Add admin role to user
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::app_role 
FROM auth.users 
WHERE email = 'vinay.joshi1608@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Insert sample bikes
INSERT INTO public.bikes (name, type, location, description, hourly_rate, status, image_url) VALUES
('Mountain Hawk Pro', 'Mountain', 'Downtown Station', 'Professional mountain bike with full suspension, perfect for trails and rough terrain', 15.00, 'available', 'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800'),
('City Cruiser Classic', 'City', 'Central Park Hub', 'Comfortable city bike with basket, ideal for casual rides and errands', 8.00, 'available', 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800'),
('Speed Demon Road', 'Road', 'University Campus', 'Lightweight road bike built for speed and long-distance rides', 12.00, 'available', 'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800'),
('Electric Glide', 'Electric', 'Tech District', 'E-bike with pedal assist, makes hills effortless with 50km range', 20.00, 'available', 'https://images.unsplash.com/photo-1559348349-86f1f65817fe?w=800'),
('Hybrid Explorer', 'Hybrid', 'Riverside Station', 'Versatile hybrid bike combining comfort and performance', 10.00, 'available', 'https://images.unsplash.com/photo-1571333250630-f0230c320b6d?w=800'),
('BMX Trickster', 'BMX', 'Skate Park', 'Compact BMX bike for tricks, stunts and urban riding', 9.00, 'available', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'),
('Cargo Hauler', 'Cargo', 'Market Square', 'Heavy-duty cargo bike with large rear rack for deliveries', 18.00, 'available', 'https://images.unsplash.com/photo-1571188654248-7a89213915f7?w=800'),
('Folding Commuter', 'Folding', 'Train Station', 'Compact folding bike perfect for multi-modal commuting', 11.00, 'available', 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800');