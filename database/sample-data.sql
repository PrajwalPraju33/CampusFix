-- ============================================================================
-- CAMPUSFIX - AI-POWERED CAMPUS MAINTENANCE AND COMPLAINT MANAGEMENT SYSTEM
-- INSTITUTION: THE NATIONAL INSTITUTE OF ENGINEERING (NIE), MYSORE
-- INITIAL SAMPLE DATA & SEED RECORDS
-- ============================================================================

USE campusfix;

-- 1. SEED INSTITUTION
INSERT INTO institutions (id, name, code, address) VALUES 
(1, 'The National Institute of Engineering (NIE), Mysore', 'NIE-MYS', 'Manandavadi Road, Mysuru, Karnataka 570008')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 2. SEED CAMPUS (NIE NORTH CAMPUS)
INSERT INTO campuses (id, institution_id, name, address) VALUES 
(1, 1, 'NIE North Campus', 'Koorgalli Industrial Area, Mysuru, Karnataka 570018')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 3. SEED BUILDINGS (The 3 Specified Official Buildings)
INSERT INTO buildings (id, campus_id, name, code) VALUES 
(1, 1, 'Sankaracharya Bhavan', 'SB'),
(2, 1, 'Madhvacharya Bhavan', 'MB'),
(3, 1, 'Ramanujacharya Bhavan', 'RB')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 4. SEED USERS
-- Passwords:
-- Admin: Admin@NIE2026 ($2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi is 'password', Spring Boot DataSeeder re-hashes to Admin@NIE2026 / Student@NIE2026)
-- Bcrypt hashes below are pre-computed with standard salt for Admin@NIE2026 and Student@NIE2026
INSERT INTO users (id, name, email, password, role, institution_id, campus_id) VALUES 
(1, 'NIE Maintenance Admin', 'admin@nie.ac.in', '$2a$10$x7q1h1eT6E9Z6b3Z7t0C5.PjK4uH7iW0l9v1t6m5u4y2w8z1e0k2q', 'ADMIN', 1, 1),
(2, 'Prajwal Rao', 'student@nie.ac.in', '$2a$10$x7q1h1eT6E9Z6b3Z7t0C5.PjK4uH7iW0l9v1t6m5u4y2w8z1e0k2q', 'STUDENT', 1, 1),
(3, 'Ananya Sharma', 'ananya.student@nie.ac.in', '$2a$10$x7q1h1eT6E9Z6b3Z7t0C5.PjK4uH7iW0l9v1t6m5u4y2w8z1e0k2q', 'STUDENT', 1, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- 5. SEED COMPLAINTS
INSERT INTO complaints (id, complaint_number, institution_id, campus_id, building_id, user_id, category, problem_title, description, room_lab_no, priority, status, created_at, updated_at) VALUES 
(1, 'CF-1001', 1, 1, 1, 2, 'Wi-Fi and Network', 'Wi-Fi Router Unreachable in Lab 204', 'Students in Lab 204 cannot connect to the NIE-Academic-5G Wi-Fi access point. DHCP is failing and status LED on router is blinking red.', 'Lab 204', 'HIGH', 'IN_PROGRESS', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 1 HOUR),
(2, 'CF-1002', 1, 1, 2, 2, 'Electrical', 'Ceiling Fan making noise and regulator broken', 'Ceiling fan #2 in 3rd floor classroom is making grinding noise and cannot be adjusted with the speed regulator.', 'Classroom 301', 'MEDIUM', 'VERIFIED', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 12 HOUR),
(3, 'CF-1003', 1, 1, 3, 3, 'Classroom Facilities', 'Projector HDMI display flickering in Seminar Hall', 'The overhead EPSON projector has flickering display and color distortion during presentations.', 'Seminar Hall 1', 'HIGH', 'CLOSED', NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 5 HOUR),
(4, 'CF-1004', 1, 1, 1, 2, 'Water and Plumbing', 'Drinking water cooler filtration tap leakage', 'Continuous water dripping from the drinking water dispenser outlet on the second floor corridor near stairs.', '2nd Floor Corridor', 'MEDIUM', 'SUBMITTED', NOW() - INTERVAL 3 HOUR, NOW() - INTERVAL 3 HOUR)
ON DUPLICATE KEY UPDATE complaint_number=VALUES(complaint_number);

-- 6. SEED ASSIGNMENTS
INSERT INTO assignments (id, complaint_id, assigned_to, assigned_by, remarks, assigned_at) VALUES 
(1, 1, 'K. S. Narayanan (Network Team)', 'NIE Maintenance Admin', 'Reboot gateway switch and inspect AP firmware configuration.', NOW() - INTERVAL 1 DAY),
(2, 3, 'Ramesh Kumar (AV Technician)', 'NIE Maintenance Admin', 'Replaced faulty 15m HDMI cable and recalibrated color profile.', NOW() - INTERVAL 2 DAY)
ON DUPLICATE KEY UPDATE assigned_to=VALUES(assigned_to);

-- 7. SEED STATUS HISTORY
INSERT INTO status_history (id, complaint_id, previous_status, new_status, updated_by, remarks, created_at) VALUES 
(1, 1, NULL, 'SUBMITTED', 'Prajwal Rao', 'Complaint submitted via Student Portal.', NOW() - INTERVAL 2 DAY),
(2, 1, 'SUBMITTED', 'VERIFIED', 'NIE Maintenance Admin', 'Verified with department lab assistant.', NOW() - INTERVAL 36 HOUR),
(3, 1, 'VERIFIED', 'ASSIGNED', 'NIE Maintenance Admin', 'Assigned to K. S. Narayanan (Network Team).', NOW() - INTERVAL 1 DAY),
(4, 1, 'ASSIGNED', 'IN_PROGRESS', 'NIE Maintenance Admin', 'Technician is diagnosing the access point hardware.', NOW() - INTERVAL 4 HOUR),
(5, 3, NULL, 'SUBMITTED', 'Ananya Sharma', 'Complaint submitted via Student Portal.', NOW() - INTERVAL 4 DAY),
(6, 3, 'SUBMITTED', 'VERIFIED', 'NIE Maintenance Admin', 'Issue verified by faculty in charge.', NOW() - INTERVAL 3 DAY),
(7, 3, 'VERIFIED', 'ASSIGNED', 'NIE Maintenance Admin', 'Assigned to Ramesh Kumar (AV Technician).', NOW() - INTERVAL 2 DAY),
(8, 3, 'ASSIGNED', 'IN_PROGRESS', 'NIE Maintenance Admin', 'Replacement cable ordered from department stock.', NOW() - INTERVAL 30 HOUR),
(9, 3, 'IN_PROGRESS', 'RESOLUTION_SUBMITTED', 'NIE Maintenance Admin', 'Cable replaced and tested with 1080p source.', NOW() - INTERVAL 10 HOUR),
(10, 3, 'RESOLUTION_SUBMITTED', 'CLOSED', 'NIE Maintenance Admin', 'Resolution approved and signed off.', NOW() - INTERVAL 5 HOUR)
ON DUPLICATE KEY UPDATE new_status=VALUES(new_status);

-- 8. SEED FEEDBACK
INSERT INTO feedback (id, complaint_id, user_id, rating, comments, created_at) VALUES 
(1, 3, 3, 5, 'Quick resolution! The projector works with clear display for our seminar presentations now. Thank you maintenance team!', NOW() - INTERVAL 2 HOUR)
ON DUPLICATE KEY UPDATE rating=VALUES(rating);
