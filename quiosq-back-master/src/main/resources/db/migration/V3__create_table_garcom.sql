CREATE TABLE garcom (
    id UUID PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(15) UNIQUE NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    quiosque_id UUID REFERENCES quiosque(id) ON DELETE CASCADE
);

CREATE INDEX idx_garcom_quiosque ON garcom(quiosque_id);
