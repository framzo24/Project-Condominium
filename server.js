const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
const mysql = require('mysql2');
const port = 3002;
const config = require('./config.json');
const directory = config.projectDirectory;
const session = require('express-session');
const multer = require('multer');

app.use(session({
    secret: 'elenafrancesco',
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/pdf', express.static('/Users/francescozoni/Documents/UniPR/Project-Condominium/pdf'));
app.use('/images', express.static('/Users/francescozoni/Documents/UniPR/Project-Condominium/images'));


app.get('/api/condominii', (req, res) => {
  res.json(condominiData);
});

const db = mysql.createConnection({
  host: config.dbServer,
  port: config.dbPort,
  user: config.dbUsername,
  password: '',
  database: config.dbName
});

db.connect((err) => {
  if (err) {
    console.error('Errore di connessione al database:', err);
  } else {
    console.log('Connessione al database stabilita correttamente');
  }
});

app.get('/home', (req, res) => {
  res.sendFile(directory + '/index.html');
});

app.get('/login', (req, res) => {
  res.sendFile(directory + '/login.html');
});

app.get('/registration', (req, res) => {
  res.sendFile(directory + '/registration.html');
});

app.get('/condominium-fee-payments', (req, res) => {
  res.sendFile(directory + '/condominium-fee-payments.html');
});

app.get('/condominium-fee-payments-user', (req, res) => {
  res.sendFile(directory + '/condominium-fee-payments-user.html');
});

app.get('/budget-previous-years', (req, res) => {
  res.sendFile(directory + '/budget-previous-years.html');
});

app.get('/budget-previous-years-user', (req, res) => {
  res.sendFile(directory + '/budget-previous-years-user.html');
});

app.get('/family', (req, res) => {
  res.sendFile(directory + '/family.html');
});

app.get('/future-projects', (req, res) => {
  res.sendFile(directory + '/future-projects.html');
});

app.get('/future-projects-user', (req, res) => {
  res.sendFile(directory + '/future-projects-user.html');
});

app.get('/notifications', (req, res) => {
  res.sendFile(directory + '/notifications.html');
});

app.get('/notifications-user', (req, res) => {
  res.sendFile(directory + '/notifications-user.html');
});

app.get('/reunions', (req, res) => {
  res.sendFile(directory + '/reunions.html');
});

app.get('/reunions-user', (req, res) => {
  res.sendFile(directory + '/reunions-user.html');
});

app.listen(port, () => {
  console.log("Server in ascolto sulla porta ", port);
})

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads');
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + '.pdf');
  }
});

const upload = multer({ storage: storage });

app.post('/upload-pdf', upload.single('pdfFile'), (req, res) => {
  res.json({ message: 'File PDF caricato con successo' });
});

  app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const selectQuery = 'SELECT * FROM Utente WHERE email = ?';
  db.query(selectQuery, [email], (err, results) => {
    if (err) {
      console.error("Errore durante il login:", err);
      return res.status(500).send("Errore durante il login.");
    }

    if (results.length === 0) {
      // L'utente non esiste nel database
      return res.status(401).send("Credenziali non valide.");
    }

    // Verifica la password hashata
    const user = results[0];

    const userData = {
      id: results[0].id,
      nome: results[0].nome,
      cognome: results[0].cognome,
      email: results[0].email,
      p_iva: results[0].p_iva,
    };    

    bcrypt.compare(password, user.password, (hashErr, isMatch) => {
      if (hashErr) {
        console.error("Errore durante la verifica della password:", hashErr);
        return res.status(500).send("Errore durante il login.");
      }

      if (!isMatch) {
        // La password non corrisponde
        return res.status(401).send("Credenziali non valide.");
      }

      if (user.ruolo === "Utente") {
        res.sendFile(directory + '/index-user.html');
      }
      else {
        res.sendFile(directory + '/index.html');
      }
    });
  });
});

app.post('/registration', (req, res) => {
  const { nome, cognome, email, password, p_iva, ruolo } = req.body;

  // Controllo se l'email esiste già nel database
  const controlloMail = 'SELECT * FROM Utente WHERE email = ?';
  db.query(controlloMail, [email], (controlloErr, controlloRes) => {
    if (controlloErr) {
      console.error("Errore durante il controllo dell'email:", controlloErr);
      return res.status(500).send("Errore durante la registrazione dell'utente.");
    }

    if (controlloRes.length > 0) {
      // L'email esiste già nel database
      return res.status(400).send("L'indirizzo email è già registrato.");
    }

    // Esegui l'hashing della password
    bcrypt.hash(password, 10, (hashErr, hashedPassword) => {
      if (hashErr) {
        console.error("Errore durante l'hashing della password:", hashErr);
        return res.status(500).send("Errore durante la registrazione dell'utente.");
      }
      const insertQuery = `INSERT INTO Utente (nome, cognome, email, password, p_iva, ruolo) VALUES (?, ?, ?, ?, ?, ?)`;
      db.query(insertQuery, [nome, cognome, email, hashedPassword, p_iva, ruolo], (err, result) => {
        if (err) {
          console.error("Errore durante l'inserimento dell'utente:", err);
          return res.status(500).send("Errore durante la registrazione dell'utente.");
        }
        console.log("Nuovo utente inserito con successo.");
        res.sendFile(directory + '/login.html');
      });
    });
  });
});

app.get('/logout', (req, res) => {
  res.sendFile(directory + '/login.html');
});

app.post('/insert_payment', (req, res) => {
  const { data, descrizione, codice_identificativo, prezzo } = req.body;
  const condominio_id = 1;
  console.log(req.body);
  //const utente_id = (JSON.parse(sessionStorage.getItem("user")).id);
  const utente_id=1;
  const insertQuery = 'INSERT INTO Pagamento (data, descrizione, codice_identificativo, importo, condominio_id, utente_id) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(insertQuery, [data, descrizione, codice_identificativo, prezzo, condominio_id, utente_id], (err, result) => {
    if (err) {
      console.error("Errore durante l'inserimento del pagamento", err);
      return res.status(500).send("Errore durante l'inserimento del pagamento");
    }
    console.log("Nuovo pagamento inserito con successo.");
    return res.status(201)
    

  });
});

app.post('/aggiorna-pagamento', (req, res) => {
  const { idPagamento, data, descrizione, codiceIdentificativo, importo } = req.body;

  const updateQuery = `
    UPDATE Pagamento
    SET data = ?, descrizione = ?, codice_identificativo = ?, importo = ?
    WHERE id = ?;
  `;

  db.query(updateQuery, [data, descrizione, codiceIdentificativo, importo, idPagamento], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Errore del server durante l'aggiornamento del pagamento");
    } else {
      console.log('Pagamento aggiornato con successo');
    }
  });
});

app.post('/delete_payment', (req, res) => {
  const { idPagamento } = req.body;

  const updateQuery = `
    DELETE FROM Pagamento
    WHERE id = ?;
  `;

  db.query(updateQuery, [idPagamento], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Errore del server durante l'eliminazione del pagamento");
    } else {
      console.log('Pagamento eliminato con successo');
    }
  });
});

app.post('/crea-progetto', (req, res) => {
  const { dataInizio, dataFine, nome, descrizione } = req.body;
  const condominioId = 1;
  const insertQuery = 'INSERT INTO Progetto_Futuro (data_inizio, data_fine, nome, descrizione, condominio_id) VALUES (?, ?, ?, ?, ?)';
  db.query(insertQuery, [dataInizio, dataFine, nome, descrizione, condominioId], (err, result) => {
    if (err) {
      console.error("Errore durante l'inserimento del progetto", err);
      return res.status(500).send("Errore durante l'inserimento del progetto");
    }
    console.log("Nuovo progetto inserito con successo.");

  });

});


app.delete('/elimina-progetto/:id', (req, res) => {
  const projectId = req.params.id;
  const deleteQuery = 'DELETE FROM Progetto_Futuro WHERE id = ?';

  db.query(deleteQuery, [projectId], (err, result) => {
    if (err) {
      console.error('Errore durante l\'eliminazione del progetto:', err);
      return res.status(500).json({ error: 'Errore durante l\'eliminazione del progetto' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Progetto non trovato' });
    }

    res.json({ message: 'Progetto eliminato con successo' });
});
});

app.get('/condominio', (req, res) => {
  const query = 'SELECT * FROM Condominio';
  db.query(query, (err, result) => {
    if (err) throw err;
    res.json(result);
  });
});

//funzione per recuperare i dati dei pagamenti dal database
function getPagamentiFromDatabase(callback) {
  const query = 'SELECT * FROM Pagamento';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Errore durante la query al database:', err);
      return callback(err, null);
    }
    const datiPagamenti = [];
    results.forEach((row) => {
      const pagamento = {
        id: row.id,
        data: row.data,
        descrizione: row.descrizione,
        codice_identificativo: row.codice_identificativo,
        importo: row.importo,
        condominio_id: row.condominio_id,
        utente_id: row.utente_id,
      };
      datiPagamenti.push(pagamento);
    });
    callback(null, datiPagamenti);
  })
}

function getNotificheFromDatabase(callback) {
  const query = 'SELECT * FROM Notifica';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Errore durante la query al database:', err);
      return callback(err, null);
    }
    const datiNotifiche = [];
    results.forEach((row) => {
      const notifica = {
        id: row.id,
        tipologia: row.tipologia,
        data: row.data,
        descrizione: row.descrizione,
        utente_id: row.utente_id,
      };
      datiNotifiche.push(notifica);
    });
    callback(null, datiNotifiche);
  })
}

//funzione per recuperare i dati dei progetti futuri dal database
function getProgettiFromDatabase(callback) {
  const query = 'SELECT * FROM Progetto_Futuro';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Errore durante la query al database:', err);
      return callback(err, null);
    }
    const datiProgetto = [];
    results.forEach((row) => {
      const progetto = {
        id: row.id,
        data_inizio: row.data_inizio,
        data_fine: row.data_fine,
        nome: row.nome,
        descrizione: row.descrizione,
        condominio_id: row.condominio_id,
      };
      datiProgetto.push(progetto);
    });
    callback(null, datiProgetto);
  })
}

// funzione per recuperare i dati dei condomini dal database
function getCondominiFromDatabase(callback) {
  const query = 'SELECT * FROM Condominio';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Errore durante la query al database:', err);
      return callback(err, null);
    }

    const condominiArray = [];

    results.forEach((row) => {
      const condominio = {
        id: row.id,
        nome: row.nome,
        foto: '/elon.jpg',
        indirizzo: row.indirizzo,
        n_piani: row.n_piani,
        n_appartamenti: row.n_appartamenti,
        cantine: row.cantine,
        garage: row.garage,
      };

      condominiArray.push(condominio);
    });

    callback(null, condominiArray);
  });
}

// funzione per recuperare i dati delle riunioni dal database
function getRiunioniFromDatabase(callback) {
  const query = 'SELECT * FROM Riunione';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Errore durante la query al database:', err);
      return callback(err, null);
    }

    const riunioniArray = [];

    results.forEach((row) => {
      const riunione = {
        id: row.id,
        data: row.data,
        ora: row.ora,
        titolo: row.titolo,
        descrizione: row.descrizione,
        utente_id: row.utente_id,
      };

      riunioniArray.push(riunione);
    });

    callback(null, riunioniArray);
  });
}

// funzione per recuperare i dati degli utenti dal database
function getUtentiFromDatabase(callback) {
  const query = 'SELECT * FROM Utente';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Errore durante la query al database:', err);
      return callback(err, null);
    }

    const utentiArray = [];

    results.forEach((row) => {
      const utente = { 
        id: row.id,
        nome: row.nome,
        cognome: row.cognome,
        email: row.email,
        p_iva: row.p_iva,
        ruolo: row.ruolo,
      };

      utentiArray.push(utente);
    });

    callback(null, utentiArray);
  });
}

function convertiFormatoData(dataString) {
  const data = new Date(dataString);

  const anno = data.getFullYear();
  const mese = String(data.getMonth() + 1).padStart(2, '0');
  const giorno = String(data.getDate()).padStart(2, '0');

  const dataFormattata = `${anno}-${mese}-${giorno}`;

  return dataFormattata;
}

function calcolaDataFinale(dataString) {
  const dataIniziale = new Date(dataString);

  const dataFinale = new Date(dataIniziale.getTime() + 60 * 60 * 1000);

  const anno = dataFinale.getFullYear();
  const mese = String(dataFinale.getMonth() + 1).padStart(2, '0');
  const giorno = String(dataFinale.getDate()).padStart(2, '0');
  const ora = String(dataFinale.getHours()).padStart(2, '0');
  const minuti = String(dataFinale.getMinutes()).padStart(2, '0');

  const dataFinaleFormattata = `${anno}-${mese}-${giorno}T${ora}:${minuti}:00`;

  return dataFinaleFormattata;
}

function convertiPerFullCalendar(riunione) {
  const dataFormattata = convertiFormatoData(riunione.data);
  const dataFinale = calcolaDataFinale(riunione.data);
  const fullCalendarEvento = {
    title: riunione.id + " " + riunione.titolo,
    start: `${dataFormattata}T${riunione.ora}`,
    end: `${dataFinale}`,
  };
  return fullCalendarEvento;
}

//route per la pagina delle riunioni
app.get('/riunioni', (req, res) => {
  getRiunioniFromDatabase((err, riunioniArray) => {
    if (err) {
      console.error('Errore durante il recupero delle riunioni:', err);
      res.status(500).send('Errore durante il recupero delle riunioni');
    } else {
      const eventiFullCalendar = riunioniArray.map(convertiPerFullCalendar);
      res.json(eventiFullCalendar);
    }
  });
});

//route per la pagina dei pagamenti
app.get('/pagamenti', (req, res) => {
  getPagamentiFromDatabase((err, datiPagamenti) => {
    if (err) {
      console.error('Errore durante il recupero dei pagamenti:', err);
      res.status(500).send('Errore durante il recupero dei pagamenti');
    } else {
      res.json(datiPagamenti);
    }
  });
});

app.get('/notifiche', (req, res) => {
  getNotificheFromDatabase((err, datiNotifiche) => {
    if (err) {
      console.error('Errore durante il recupero dei pagamenti:', err);
      res.status(500).send('Errore durante il recupero dei pagamenti');
    } else {
      res.json(datiNotifiche);
    }
  });
});

//route per la pagina dei progetti
app.get('/progetti', (req, res) => {
  getProgettiFromDatabase((err, datiProgetto) => {
    if (err) {
      console.error('Errore durante il recupero dei progetti:', err);
      res.status(500).send('Errore durante il recupero dei progetti');
    } else {
      res.json(datiProgetto);
    }
  });
});

app.get('/getUserIdByEmail', (req, res) => {
  const email = req.query.email;
  getUtenteByEmailFromDatabase(email, (err, datiUtente) => {
    if (err) {
      console.error('Errore durante il recupero dell\'utente:', err);
      res.status(500).send('Errore durante il recupero dell\'utente');
    } else if (datiUtente) {
      console.log("utente trovato con questi dati" + datiUtente.cognome);
      res.json(datiUtente);
    } else {
      res.status(404).send('Nessun utente trovato con questa email nel server');
    }
  });
});

//route per la pagina dei condomini
app.get('/condomini', (req, res) => {
  getCondominiFromDatabase((err, condominiArray) => {
    if (err) {
      console.error('Errore durante il recupero dei condomini:', err);
      res.status(500).send('Errore durante il recupero dei condomini');
    } else {
      res.json(condominiArray);
    }
  });
});

app.post("/new-reunion", (req, res) => {
  const { meetingDate, meetingTime, meetingTitle, meetingDescription } = req.body;
  const utente_id = 2;
  const insertQuery = 'INSERT INTO Riunione (data, ora, titolo, descrizione, utente_id) VALUES (?,?,?,?,?)';
  db.query(insertQuery, [meetingDate,meetingTime,meetingTitle,meetingDescription, utente_id], (err, result) => {
    if (err) {
      console.error("Errore durante l'inserimento della riunione", err);
      return res.status(500).send("Errore durante l'inserimento della riunione");
    }
    console.log("Nuova riunione inserita con successo.");
  });
});

app.post("/modify-reunion", (req, res) => {
  const { meetingId, meetingDate, meetingTime, meetingTitle, meetingDescription } = req.body;
  const utente_id_ = 2;
  const updateQuery = 'UPDATE Riunione SET data = ?, ora = ?, titolo = ?, descrizione = ?, utente_id = ? WHERE id = ?';
  db.query(updateQuery, [meetingDate,meetingTime,meetingTitle,meetingDescription, utente_id_,meetingId], (err, result) => {
    if (err) {
      console.error("Errore durante l'aggiornamento della riunione", err);
      return res.status(500).send("Errore durante l'aggiornamento della riunione");
    }
    console.log("Aggiornamento della riunione riuscito.");
  });
});

app.post("/delete-reunion", (req, res) => {
  const { meetingId } = req.body;
  const updateQuery = 'DELETE FROM Riunione WHERE ?';
  db.query(updateQuery, [meetingId], (err, result) => {
    if (err) {
      console.error("Errore durante l'aggiornamento della riunione", err);
      return res.status(500).send("Errore durante l'aggiornamento della riunione");
    }
    console.log("Cancellazione della riunione riuscito.");
  });
});

// API per ottenere gli utenti in base all'ID del condominio
app.get('/get-users-by-condominio', (req, res) => {
  const condominioId = req.query.condominio_id;
  if (!condominioId) {
      return res.status(400).json({ error: 'ID del condominio mancante' });
  }

  const sql = `SELECT * FROM Utente WHERE id IN (SELECT utente_id FROM Associazione WHERE condominio_id = ?)`;
  db.query(sql, [condominioId], (err, results) => {
      if (err) {
          console.error('Errore nella query SQL:', err);
          return res.status(500).json({ error: 'Errore nel recupero degli utenti' });
      }
      console.log();
      res.json(results);
  });
});

function getUtenteByEmailFromDatabase(email, callback) {
  const query = 'SELECT * FROM Utente WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) {
      callback(err, null);
    } else {
      if (results.length === 1) {
        const utente = results[0];
        callback(null, utente);
      } else {
        console.log("utente non trovato");
        callback(null, null);
      }
    }
  });
}