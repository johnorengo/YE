-- Seed data for saved_replies.
USE yek;

INSERT INTO saved_replies (title, body, category) VALUES
('Location Update', 'I have updated your location as requested. It should reflect on your profile shortly.', 'general'),
('Ad Visibility Help', 'Your ad may need verification or may not meet our visibility rules. I can review it for you.', 'technical'),
('Payment Issues', 'Please check your payment details and try again. If money was deducted, share the receipt code.', 'billing'),
('General Thanks', 'You are welcome. Let us know if you need anything else.', 'general');

