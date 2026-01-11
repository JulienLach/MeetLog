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
    id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    duration INTEGER DEFAULT 0, -- en secondes
    file_uri VARCHAR(500) NOT NULL,
    file_size INTEGER DEFAULT 0, -- en bytes
    status VARCHAR(20) DEFAULT 'pending', -- pending, processing, completed, error
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes
CREATE TABLE notes (
    id_note SERIAL PRIMARY KEY,
    id_record INTEGER NOT NULL REFERENCES records(id_record) ON DELETE CASCADE,
    id_user INTEGER NOT NULL REFERENCES users(id_user) ON DELETE CASCADE,
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

-- User de test
INSERT INTO users (first_name, last_name, email, password) VALUES
('Jean', 'Dupont', 'test@gmail.com', 'test');