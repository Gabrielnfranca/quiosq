CREATE TABLE mesa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero INTEGER NOT NULL,
    status BOOLEAN DEFAULT true,
    garcom_id UUID,
    quiosque_id UUID NOT NULL,
    CONSTRAINT mesa_quiosque_id_fkey FOREIGN KEY (quiosque_id) REFERENCES quiosque(id) ON DELETE CASCADE,
    CONSTRAINT mesa_garcom_id_fkey FOREIGN KEY (garcom_id) REFERENCES garcom(id) ON DELETE SET NULL
);
