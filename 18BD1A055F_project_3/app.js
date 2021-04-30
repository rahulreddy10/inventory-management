const express = require('express');
const bodyParser= require('body-parser')
const app = express();

const MongoClient = require('mongodb').MongoClient
var ObjectId = require('mongodb').ObjectId; 
const url = 'mongodb://127.0.0.1:27017'
const dbName = 'ShoeShop'
let db

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err)

  // Storing a reference 'db' to the database so you can use it later
  db = client.db(dbName)
  const footwearCollection = db.collection('footwear')
  app.set('view engine', 'ejs')

  // Make sure you place body-parser before your CRUD handlers!
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(express.static('public'))
  app.use(bodyParser.json())

  // READ
  app.get('/', (req, res) => {
    footwearCollection.find().toArray()
    .then(results => {
        res.render('index.ejs', { details: results })
    })
    .catch(error => console.error(error))

  })

  app.post('/update', (req, res) => {
    var o_id = new ObjectId(req.body._id); 
    footwearCollection.findOneAndUpdate( 
        { _id: o_id },
        {
            $set: {
                Category: req.body.Category,
                Size: req.body.Size,
                Stock: req.body.Stock,
                Price: req.body.Price
            }
        })
        .then(result => {
            res.redirect('/')
        })
        .catch(error => console.error(error))
  })

  app.get('/delete/:id', (req, res) => {
    var o_id = new ObjectId(req.params.id); 
    footwearCollection.deleteOne(
      { _id: o_id }
    )
    .then(result => {
      res.redirect('/')
    })
    .catch(error => console.error(error))
  })

  app.listen(3000, function() {
    console.log('listening on 3000')
  })

  app.post('/add', (req, res) => {
    footwearCollection.insertOne(req.body)
      .then(result => {
        res.redirect('/')
      })
      .catch(error => console.error(error))
  })
  
  console.log(`Connected MongoDB: ${url}`)
  console.log(`Database: ${dbName}`)
})

