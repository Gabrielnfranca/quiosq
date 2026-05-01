-- Extensão para gerar UUIDs automaticamente
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de quiosque
CREATE TABLE quiosque (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cnpj VARCHAR(20) UNIQUE NOT NULL
);

-- Tabela de roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(50) UNIQUE NOT NULL -- SYSTEM_ADMIN, ADMIN, GARCOM
);

-- Tabela de usuários
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(100) UNIQUE NOT NULL,
    nome VARCHAR(100),
    image BYTEA,
    password VARCHAR(200) NOT NULL,
    quiosque_id UUID REFERENCES quiosque(id) ON DELETE SET NULL
);

-- Tabela de relacionamento ManyToMany entre users e roles
CREATE TABLE users_roles (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role_id INT REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Índices úteis
CREATE INDEX idx_users_quiosque ON users(quiosque_id);
CREATE INDEX idx_users_roles_user ON users_roles(user_id);
CREATE INDEX idx_users_roles_role ON users_roles(role_id);