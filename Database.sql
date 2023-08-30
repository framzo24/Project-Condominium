DROP DATABASE IF EXISTS database_condominium;

CREATE DATABASE database_condominium;

USE database_condominium;

CREATE TABLE Condominio (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    indirizzo VARCHAR(255) NOT NULL,
    n_piani int NOT NULL,
    n_appartamenti int NOT NULL,
    cantine boolean,
    garage boolean
);

CREATE TABLE Utente (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(255) NOT NULL,
    cognome VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    p_iva VARCHAR(255),
    ruolo ENUM('Amministratore','Utente'),
    condominio_id INT,
    FOREIGN KEY (condominio_id) REFERENCES Condominio(id)
);

CREATE TABLE Pagamento (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    descrizione VARCHAR(255) NOT NULL,
    codice_identificativo int(3) NOT NULL,
    importo DECIMAL(10, 2) NOT NULL,
    condominio_id INT,
    utente_id INT,
    FOREIGN KEY (condominio_id) REFERENCES Condominio(id),
    FOREIGN KEY (utente_id) REFERENCES Utente(id)
);

CREATE TABLE Notifica (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tipologia ENUM('Lamentela','Revisione','Altro') NOT NULL,
    data DATE NOT NULL,
    descrizione VARCHAR(255) NOT NULL,
    utente_id INT,
    FOREIGN KEY (utente_id) REFERENCES Utente(id)
);

CREATE TABLE Riunione (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data DATE NOT NULL,
    ora TIME,
    titolo VARCHAR(255) NOT NULL,
    descrizione VARCHAR(255) NOT NULL,
    utente_id INT NOT NULL,
    FOREIGN KEY (utente_id) REFERENCES Utente(id)
);

CREATE TABLE Progetto_Futuro (
    id INT PRIMARY KEY AUTO_INCREMENT,
    data_inizio DATE NOT NULL,
    data_fine DATE NOT NULL,
    nome VARCHAR(255) NOT NULL,
    descrizione VARCHAR(255) NOT NULL,
    utente_id INT NOT NULL,
    FOREIGN KEY (utente_id) REFERENCES Utente(id)
);

-- un membro della famiglia accede facendo il login con il codice del condominio in cui vive
-- l'amministratore accede inserendo il suo codice personale
