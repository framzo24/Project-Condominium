DROP DATABASE IF EXISTS database_condominium;

CREATE DATABASE database_condominium;

USE database_condominium;

-- Creazione della tabella "Condomini" per archiviare le informazioni sui condomini
CREATE TABLE Condomini (
    id INT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cognome VARCHAR(255) NOT NULL,
    indirizzo VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL
);

-- Creazione della tabella "UnitàImmobiliari" per archiviare le informazioni sulle unità immobiliari
CREATE TABLE UnitàImmobiliari (
    id INT PRIMARY KEY,
    condominio_id INT,
    numero INT,
    proprietario_id INT,
    metri_quadrati DECIMAL(8, 2) NOT NULL,
    FOREIGN KEY (condominio_id) REFERENCES Condomini(id),
    FOREIGN KEY (proprietario_id) REFERENCES Condomini(id)
);

-- Creazione della tabella "Spese" per archiviare le informazioni sulle spese condominiali
CREATE TABLE Spese (
    id INT PRIMARY KEY,
    descrizione VARCHAR(255) NOT NULL,
    importo DECIMAL(10, 2) NOT NULL,
    data DATE NOT NULL,
    condominio_id INT,
    FOREIGN KEY (condominio_id) REFERENCES Condomini(id)
);

-- Creazione della tabella "Pagamenti" per archiviare le informazioni sui pagamenti effettuati dai condomini
CREATE TABLE Pagamenti (
    id INT PRIMARY KEY,
    spesa_id INT,
    condomino_id INT,
    importo DECIMAL(10, 2) NOT NULL,
    data DATE NOT NULL,
    FOREIGN KEY (spesa_id) REFERENCES Spese(id),
    FOREIGN KEY (condomino_id) REFERENCES Condomini(id)
);
