//IMPORTANTE: para arrancar NODEMON en Ubuntu usar el comando->   npm run start-dev

//SERVIDOR
//Incluimos express;
const xp = require('express');
//Queremos usar cors para que el usuario no acabe hasta el ogt de nuestra app
const cors = require('cors');
//conectamos a la base de datos
const mongoose = require('mongoose');
const { response } = require('express');
//const { PersonSchema } = require('');
const { Schema, model } = require('mongoose');

//REquerimos el modelo de Persona


//Generamos la app que recoge el valor de la ejecucion de express()
const app = xp();

//BASE DE DATOS
//Conectamos con el servidor y la base de datos
mongoose.connect('mongodb://localhost/agenda', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
}).then((res) => { 
    console.log('Estamos dentro (de Mongo)');
});

//Creamos el usuario y sus validaciones con mongoose
const PersonSchema = new Schema({
    //if(err)res.send("Error",String(err));
    name: {
        type: String,
        required: true,
        minLength: [3, "Mínimo 3 caracteres"],
        maxLength: [50],
        match: [/^[A-Za-zÁÀÉÈÍÓÒÚáàéèíóòúñÑ ]+$/,"Sólo letras please"]
    },
    lastname: {
        type: String,
        required: true,
        minLength: [3, "Mínimo 3 caracteres"],
        maxLength: [50],
        match: [/^[A-Za-zÁÀÉÈÍÓÒÚáàéèíóòúñÑ ]+$/,"Sólo letras please"]
    },
    age: {
        type: Number,
        required: true,
        min: [0, 'edad minima'],
        max: [125, 'edad max']
    },
    dni: {
        type: String,
        required: true,
        match: [/^[0-9]{8}[a-zA-Z]{1}/, '8 numeros y una letra']
    },
    birthday: {
        type: Date,
        required: true,
        match: [/(\d{4})-(\d{2})-(\d{2})T(\d{2})\:(\d{2})\:(\d{2})[+-](\d{2})\:(\d{2})/]
    },
    color: {
        type: String,
        required: true,
        minLength: [3, "Mínimo 3 caracteres"],
        maxLength: [50],        
        match: [/^[A-Za-zÁÀÉÈÍÓÒÚáàéèíóòúñÑ ]+$/,"Sólo letras please"]
    },
    gender: {
        type: String,
        required: true,
        enum: ['Hombre', 'Mujer', 'Otro', 'No especificado']
    }
},{
    versionKey: false
});

//el contacto será un PersonSchema
const Person = model('contacto', PersonSchema);

//Controlamos los errores

//LOS MIDDLEWARES
//usamos las cors
app.use(cors())
//codificamos toooodas las url (y evitamos las queryStrings) extended -> todas las peticiones (get,p)
    .use(xp.urlencoded({extended:true}))
//los datos serán de tipo json
    .use(xp.json())
//Ponemos la app a la escucha, le indicamos el puerto, arrancamos el servidor
    .listen(5000, () => {
        console.log('Inciando servidorrrrlll...');
    });


//CRUD
//Create -> Para insertar un usuario
//http://localhost:5000/contacto
app.post('/contacto', async (req, res)=>{
    //El nuevo contacto será igual al esquema que quemos hecho antes
    const newContact = new Person(req.body);
    //esperamos a que el contacto se guarde
    await newContact.save();
    //y me avisas que se ha añadido el contacto
    res.json({mensaje: "Has añadido un contacto a tu agenda", newContact});
});


//Read -> me recoges los datos de mongo y me muestras todos los contactos
//http://localhost:5000/contactos
app.get('/contactos', async (req, res)=>{
    //llamada asíncrona para recuperar un susario
    const contacts = await Person.find();
    //devuelveme los datos en formato json como están en mongo
    res.json( contacts );
});

//Consultar uns solo contacto
//http://localhost:5000/contacto/60ae83a4c9e8f215e96af2a7
app.get('/contacto/:id', async (req, res) => {
    const contact = await Person.findById(req.params.id)
    res.send(contact);
    res.json(contact);
});

//Update -> modificamos usuario
//http://localhost:5000/modificar/60bc8decd0740c28ab97fe68
app.put('/modificar/:id', async (req, res) => {
    const contactChange = await Person.findByIdAndUpdate(req.params.id, req.body);
    res.json({status: "Tu contacto ha sido modificado"});

});

//Delete -> eliminamos usuario
//http://localhost:5000/eliminar/60bcab935edfa94ae48e9c5a
app.delete('/eliminar/:id', async (req, res) => {
    const contactDelete = await Person.findByIdAndDelete(req.params.id);
    res.json({status: "Has eliminado el contacto de tu agenda", contactDelete});
});
