-- Inserindo os valores padrão
INSERT INTO roles (nome) VALUES ('ROLE_SYSTEM_ADMIN'),('ROLE_ADMIN'),('ROLE_GARCOM');
INSERT INTO users (email,nome, password) values('sys@admin','ROLE_SYSTEM_ADMIN','$2a$10$DwkRw2YuIMDEkCHxfXYz5uZb7mnYMghWAaJLpGRZC96or5HjD0QaO');

INSERT INTO users_roles (role_id, user_id)
SELECT 1, id
FROM users
WHERE email = 'sys@admin';
INSERT INTO users_roles (role_id, user_id)
SELECT 2, id
FROM users
WHERE email = 'sys@admin';
INSERT INTO users_roles (role_id, user_id)
SELECT 3, id
FROM users
WHERE email = 'sys@admin';


