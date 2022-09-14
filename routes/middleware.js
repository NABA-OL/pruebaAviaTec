const express = require('express')
const router = express.Router()
const mysql = require('mysql')

var pool = mysql.createPool({                                     /*datos para la conexion a la BD en mySQL*/
  connectionLimit: 20,
  host: 'localhost',
  user: 'root',
  password: 'Nicolasnaba97',
  database: 'prueba_estacionamiento'
})

router.use('/admin/', (peticion, respuesta, siguiente) => {       /*Verifica que si se accede a una direccion se haya iniciado sesion antes*/
  if (!peticion.session.usuario) {
    peticion.flash('mensaje', 'Debe iniciar sesión')
    respuesta.redirect("/")
  }
  else {
    siguiente()
  }
})


module.exports = router
