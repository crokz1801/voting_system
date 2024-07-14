const express = require("express");
const app = express();
require('dotenv').config();
const db = require("./db");
// const {jwtAuthMidWare} = require('./jwt');



const bodyParser = require("body-parser");
app.use(bodyParser.json());
const PORT = process.env.PORT;


const userRoutes = require('./routes/userRoutes');

const candidateRoutes = require('./routes/candidateRoutes');



app.use('/user',userRoutes);
app.use('/candidate',candidateRoutes);



app.listen(PORT, () => {
    console.log("server listeing on port 3000");
  });
  