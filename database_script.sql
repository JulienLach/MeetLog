-- Users
CREATE TABLE users (
    id_user SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audio Recordings
CREATE TABLE records (
    id_record SERIAL PRIMARY KEY,
    id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    duration INTEGER, -- en secondes
    file_uri VARCHAR(500) NOT NULL,
    file_size INTEGER, -- en bytes
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, error
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes
CREATE TABLE notes (
    id_note SERIAL PRIMARY KEY,
    id_record INTEGER NOT NULL REFERENCES records(id_record) ON DELETE SET NULL,
    id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE SET NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour les performances
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_records_user ON records(id_user);
CREATE INDEX idx_notes_record ON notes(id_record);
CREATE INDEX idx_notes_user ON notes(id_user);
CREATE INDEX idx_records_created ON records(created_at DESC);
CREATE INDEX idx_notes_created ON notes(created_at DESC);

-- Données de démonstration
INSERT INTO users (first_name, last_name, email, password) VALUES
('Jean', 'Dupont', 'test@gmail.com', 'test'),

INSERT INTO records (id_user, title, duration, file_uri, file_size, status) VALUES
(1, 'Stand-up Sprint 15', 900, 'audio/standup_001.mp3', 22500000, 'completed'),
(1, 'Réunion planning Sprint 16', 1800, 'audio/review_001.mp3', 45000000, 'completed'),
(2, 'Retro Sprint 14', 2400, 'audio/arch_001.mp3', 60000000, 'processing');

INSERT INTO notes (id_record, id_user, content) VALUES
(1, 1, 'À FAIRE: Corriger le timeout endpoint login, optimiser requêtes DB pour liste utilisateurs, refactoriser middleware authentification'),
(1, 2, 'ACTION: Jean doit déboguer le bug OAuth2, reviewer PR #324 avant vendredi'),
(2, 1, 'BUGS TROUVÉS: Validation formulaire incohérente, fuite mémoire handler websocket, race condition en pagination'),
(3, 2, 'DETTE TECHNIQUE: Migrer de Sequelize à Prisma, implémenter connection pooling PostgreSQL, ajouter tests unitaires');