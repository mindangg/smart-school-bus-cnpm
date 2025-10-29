INSERT INTO users (email, password, full_name, phone_number, address, role, is_active)
VALUES
-- PARENT
('parent1@gmail.com', '$2b$10$NUGOm9lbZRCtUdR9FKSNWuU4g/2d9g8KNGK.Ro8UQiYaco/pQrcKu', 'Nguyễn Thị Mai', '0123000001', '123 Đ. Lê Lợi, Q1, Ho Chi Minh City', 'PARENT', TRUE),
('parent2@gmail.com', '$2b$10$Ci34HWY3GlPgeWLER5G4UO/a7lM.xkEhhU.e86OUiuSGfCmapppFO', 'Trần Văn An', '0123000002', '45 Nguyễn Thị Minh Khai, Q1, Ho Chi Minh City', 'PARENT', TRUE),
('parent3@gmail.com', '$2b$10$swIEnUrY4qg5dh3sr1rQGuoXJ1/PTm/oeyTbTCjWmcXGy41ytv7CO', 'Phạm Thị Linh', '0123000003', '67 Lê Duẩn, Q3, Ho Chi Minh City', 'PARENT', TRUE),
('parent4@gmail.com', '$2b$10$fUCBs4YcI0wvhROu0vtFRODrL2tUgu/NPgpebApw.TAK.xqKm/m4W', 'Lê Thị Hương', '0123000004', '89 Nguyễn Huệ, Q1, Ho Chi Minh City', 'PARENT', TRUE),

-- DRIVER
('driver1@gmail.com', '$2b$10$8q0oG7Ag3VRVMVI87QcjleynI8lylqxHzj6HmVECuRBQNzZ5R1bSm', 'Nguyễn Văn Tùng', '0133000001', '12 Phan Văn Trị, Gò Vấp, Ho Chi Minh City', 'DRIVER', TRUE),
('driver2@gmail.com', '$2b$10$peYV/nODr.Lmpd797lvv6OZNVqGc1TRHus1JNBPIsZjmEzPmyk3tK', 'Trần Minh Hoàng', '0133000002', '34 Đinh Tiên Hoàng, Q1, Ho Chi Minh City', 'DRIVER', TRUE),
('driver3@gmail.com', '$2b$10$3xumtIF9nATAx0OmMM3cJe7FevW.1dKY5uiilPVKUnn9sRn8p77o2', 'Phạm Đức Long', '0133000003', '56 Cách Mạng Tháng 8, Q3, Ho Chi Minh City', 'DRIVER', TRUE),
('driver4@gmail.com', '$2b$10$5orgkWJRhnvY20YJt0ZzNe1ZIODwLRbcSQhWCpop3asA/EpUsJh.6', 'Lê Văn Dũng', '0133000004', '78 Huỳnh Văn Bánh, Phú Nhuận, Ho Chi Minh City', 'DRIVER', TRUE),

-- ADMIN
('admin1@gmail.com', '$2b$10$XZPPynnCdGrgVLfgZJHujO9.Nh5t83PlObzccJso6ngdrrO/zdRQq', 'Nguyễn Thùy Dương', '0143000001', '9 Hai Bà Trưng, Q1, Ho Chi Minh City', 'ADMIN', TRUE),
('admin2@gmail.com', '$2b$10$LkuFDgdCSLMbVx1hHJlhq.RlE5rieoEfrWzgyGRWcgU5ECTGu6L6C', 'Trần Quang Huy', '0143000002', '21 Võ Văn Tần, Q3, Ho Chi Minh City', 'ADMIN', TRUE),
('admin3@gmail.com', '$2b$10$2ETsEzVr0p.joyx0713Ofe96sA8qnE.5hFF3nFyCsj0853t9miK1G', 'Phạm Thị Hồng', '0143000003', '33 Nguyễn Văn Cừ, Q5, Ho Chi Minh City', 'ADMIN', TRUE),
('admin4@gmail.com', '$2b$10$QgquTZbZZkT3qIud5YTo1uxGFsadnJM13pySSZaLGfJH1V6VnhgNi', 'Lê Thị Thanh', '0143000004', '55 Lý Tự Trọng, Q1, Ho Chi Minh City', 'ADMIN', TRUE);
