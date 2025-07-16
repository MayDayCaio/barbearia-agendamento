CREATE TABLE services (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    duration INTEGER NOT NULL -- Duração em minutos
);

CREATE TABLE barbers (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image_url VARCHAR(255)
);

CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    service_id VARCHAR(10) REFERENCES services(id),
    barber_id VARCHAR(10) REFERENCES barbers(id),
    appointment_time TIMESTAMP NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Inserir dados iniciais para teste
INSERT INTO services (id, name, price, duration) VALUES
('svc1', 'Corte de Cabelo', 45.00, 30),
('svc2', 'Barba Tradicional', 35.00, 30),
('svc3', 'Corte e Barba', 75.00, 60);

INSERT INTO barbers (id, name, image_url) VALUES
('brb1', 'Ricardo', 'https://placehold.co/400x400/374151/f59e0b?text=R'),
('brb2', 'Fernando', 'https://placehold.co/400x400/374151/f59e0b?text=F');

-- Comando para alterar a tabela existente:
ALTER TABLE appointments ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'pending';

-- Ou, a estrutura completa da tabela atualizada:
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    service_id VARCHAR(10) REFERENCES services(id),
    barber_id VARCHAR(10) REFERENCES barbers(id),
    appointment_time TIMESTAMP NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'denied', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);