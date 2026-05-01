CREATE TABLE pedido (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(255),
    nome_pedido VARCHAR(255),
    mesa_id UUID,
    data_init TIMESTAMP,
    data_fim TIMESTAMP,
    data_contagem TIMESTAMP,
    status VARCHAR(50),
    total DECIMAL(10, 2),
    cliente VARCHAR(255),
    observacoes TEXT,
    quiosque_id UUID NOT NULL,
    CONSTRAINT pedido_quiosque_id_fkey FOREIGN KEY (quiosque_id) REFERENCES quiosque(id) ON DELETE CASCADE,
    CONSTRAINT pedido_mesa_id_fkey FOREIGN KEY (mesa_id) REFERENCES mesa(id) ON DELETE SET NULL
);

CREATE TABLE pedido_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL,
    descricao VARCHAR(255),
    categoria VARCHAR(255),
    quantidade INTEGER,
    preco DECIMAL(10, 2),
    total DECIMAL(10, 2),
    CONSTRAINT pedido_item_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES pedido(id) ON DELETE CASCADE
);