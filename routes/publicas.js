/* jshint asi: true */
const express = require('express')
const router = express.Router()
const mysql = require('mysql')

var pool = mysql.createPool({ /*datos para la conexion a la BD en mySQL*/
  connectionLimit: 20,
  host: 'localhost',
  user: 'root',
  password: 'Nicolasnaba97',
  database: 'prueba_estacionamiento'
})


router.get('/', (peticion, respuesta) => { /*Ruta inicial sin iniciar sesion*/
  respuesta.render('login', {
    mensaje: peticion.flash('mensaje')
  })
})

router.post('/procesar_inicio', (peticion, respuesta) => { /*Procesamiento del inicio de sesion*/
  pool.getConnection((err, connection) => {
    const consulta = `
      SELECT *
      FROM empleado
      WHERE
      user_empleado = ${connection.escape(peticion.body.user)} AND
      password_empleado = ${connection.escape(peticion.body.password)}
    ` /*Consulta en la base de datos si existen esos datos*/
    connection.query(consulta, (error, filas, campos) => {
      if (filas.length > 0) {
        peticion.session.usuario = filas[0]
        respuesta.redirect('/admin/index') /*Si existen lo redirige a al seccion de admin*/
      } else {
        peticion.flash('mensaje', 'Datos inválidos') /*Si no existe muestra un mensaje y redirecciona de nuevo a al pagina inicial*/
        respuesta.redirect('/')
      }
    })
    connection.release() /*Libera la conexion con la Base de datos*/
  })
})


module.exports = router