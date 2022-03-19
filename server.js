const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient
const PORT = 4000
require('dotenv').config()

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'weightTracker'

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true })
.then(client => {
    console.log(`Connected to ${dbName} Database at MongoDB`)
    db = client.db(dbName)
})

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/',async (request, response) => {
    const weightItems = await db.collection('weight').find()
        .sort({_id: 1}) //sorts the results in descending order by the id (which is the date)
        .limit(30) //to add a limit to the number of results displayed
        .toArray()
    console.table(weightItems)
    response.render('index.ejs', {items: weightItems})
    
})

app.post('/logWeight', (request, response) => {
    db.collection('weight').insertOne({weight: request.body.weightInput, _id: new Date().toString().split(' ').slice(1, 4).join(' ')})
    //_id: new Date().toString().split(' ').slice(1, 4).join(' ')
    .then(result => {
        console.log('Weight logged')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.delete('/deleteItem', (request, response) => {
    db.collection('weight').deleteOne({thing: request.body.itemFromJs})
    .then(result => {
        console.log('Item deleted')
        response.json('Item deleted')
    })
    .catch(error => console.error(error))
})




app.listen(process.env.PORT || PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})