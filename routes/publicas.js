/* jshint asi: true */
const express = require('express')
const router = express.Router()
const mysql = require('mysql')


/**
   * 
   * datos para la conexion a la BD en mySQL
   * Se especifica el limite de conexiones
   * el host donde esta alojada la base de datos
   * las credeciales de acceso 
   * y el nombre de la base de datos a usar
   * 
   * */

var pool = mysql.createPool({ 
  connectionLimit: 20,
  host: 'localhost',
  user: 'root',
  password: 'Nicolasnaba97',
  database: 'prueba_estacionamiento'
})


router.get('/', (peticion, respuesta) => { /*Ruta inicial sin iniciar sesion*/
  respuesta.render('login', {  /*Renderiza la página de iniciar sesion con base al archivo .ejs correspondiente "login.ejs"*/
    mensaje: peticion.flash('mensaje') /*Recibe un mensaje para mostrar si existe*/
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
    ` /*Se crea la consulta para verificar si existe dicho usuario*/
    connection.query(consulta, (error, filas, campos) => {  /*Se realiza la consulta a la base datos y la respuestae s almacenada en la variable "filas"*/
      if (filas.length > 0) { /* Se verifica si se retorno algo, si la variable tiene una longitud*/
        peticion.session.usuario = filas[0]
        respuesta.redirect('/admin/index') /*Si existe el usurario en la base de datos lo redirige a al seccion de admin*/
      } else {
        peticion.flash('mensaje', 'Datos inválidos') /*Si no existe muestra un mensaje y redirecciona de nuevo a al página inicial*/
        respuesta.redirect('/')
      }
    })
    connection.release() /*Libera la conexion con la Base de datos*/
  })
})


module.exports = router