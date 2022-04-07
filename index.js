const express = require("express");
const app = express();
const moment = require("moment")
const morgan = require ("morgan")

app.use(express.json())
//3.7 add morgan
// app.use(morgan("tiny"))
morgan.token("sameline",(request) => { 
    if(request.method == 'POST')
        return ' ' + JSON.stringify(request.body);
    else return ' ';
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))


let persons = [
    {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
    },
    {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
    },
    {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
    },
    {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    },
];

app.get("/", (request, response) => {
    response.send("<h1>Welcome to the Phonebook!</h1>");
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/info", (request, response) => {
    response.send(
    "Phonebook has info for " + persons.length + " people" + "</br>" + moment().format("dddd, MMMM Do, YYYY, h:mm:ss a")
    );

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(person => person.id))
        : 0
    return maxId + 1
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
    
    if (!body.name || !body.number) {
        return response.status(400).json({ 
        error: 'name or number missing' 
        })
    }

    if (body.name === body.name){
        return response.status(400).json({
            error: 'duplicate name'
        })
    }
    
    persons = persons.concat(person)
    
    response.json(person)
    })

app.get("/api/persons/:id", (request, response) => {        
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);
    // console.log(p.id)

    if (person){ 
        response.json(person);
    } else {
        response.status(404).end();
    }
    });

app.delete("/api/persons/:id", (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(204).end()
    })    

})

const PORT = 3001;
app.listen(PORT);
console.log(`Server running on port ${PORT}`);