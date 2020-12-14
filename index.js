const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000

const MongoClient = require('mongodb').MongoClient;
const salas6na = 'KalaSuppG0';
const andmebaas = 'veebg1'; // <= Pane X asemel siia enda number
const uri = `mongodb+srv://veebg0:${salas6na}@cluster0.qz3rv.mongodb.net/${andmebaas}?retryWrites=true&w=majority`;

const matk1 = {
  matk: 1,
  nimi: 'Rattamatk Tapal',
  kirjeldus: 'mingi tekst siia',
  piltUrl: '/Hills.png',
  registreeruURL: '/registreeru?matk=1'
}

const matk2 = {
  matk: 2,
  nimi: 'Kepikõnd Tartus',
  kirjeldus: 'mingi tekst siia',
  piltUrl: '/Hills.png',
  registreeruURL: '/registreeru?matk=2'
}
const matkad = [matk1, matk2];

function registreeri(req, res) {
  const nimi = req.query.nimi;
  const matkIndex = req.query.matkIndex;
  const email = req.query.email;
  const markus = req.query.markus || ' '
  console.log(`Käivtati registreerumine. Registreerus ${nimi} matkale ${matkIndex} ja kelle email on ${email}`);
  const matkaAndmed = { index: matkIndex, nimi: nimi, email: email };
  //TODO: Lisa matkaAndmed registreerumiste info juurde
  // ...
  //matkad[matkadIndex-1].registreerunud.push(matkaAndmed)

  console.log(matkad[matkIndex - 1])

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect((err) => {
    if (err) {
      res.send({ error: 'Viga: ' + err.message });
    } else {
      const collection = client.db(andmebaas).collection('matkaklubi_' + andmebaas + '_registreerumised');
      collection.insertOne(matkaAndmed, (err) => {
        client.close();
        if (err) {
          return res.send({ error: 'Viga andmete lisamisel: ' + err.message });
        }


        res.send({ success: true });
      });
    }
  });
}

function naitaMatkaAdminLehte(req, res) {
  const andmed = matkad[req.query.matk-1]
  
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect((err) => {
      if (err) {
          res.send({ error: 'Viga: ' + err.message });
      } else {
          const collection = client.db(andmebaas).collection('matkaklubi_' + andmebaas + '_registreerumised');
          collection.find({matk : andmed.matk.toString()})
          .toArray( (err, registreerumised) => {
              client.close();
              if (!err) {
                  console.log(registreerumised)
                  andmed.registreerunud = registreerumised
              }
  
              res.render('pages/admin', {andmed: andmed})
          });
      }
  });
 }
 
express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/matkaklubi'))
  .get('/registreeru', (req, res) => res.render('pages/register', { matk: req.query.matk, andmed: matkad[req.query.matk - 1] }))
  .get('/kontakt', (req, res) => res.render('pages/contact'))
  .get('/kinnita', registreeri)
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
