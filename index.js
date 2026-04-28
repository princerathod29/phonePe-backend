require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db.js')
const authRoutes = require('./src/routes/authRoutes.js');
const swaggerUi = require('swagger-ui-express');

let swaggerDocument={};
try{
    swaggerDocument = require('./swagger-output.json');
}
catch(err){
    console.log("error loading swagger document:", err);
}
const app = express();
app.use(express.json());
app.use(cors());
connectDB();
const port = process.env.PORT || 3000

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.get("/", (req, res) => {
    res.send("hello world");
});

app.use('/api/auth', authRoutes);

app.listen(port, () =>{
    console.log('server running on port ${PORT}');
    console.log('swagger docs available at http://localhost:${port}/api-docs');
});