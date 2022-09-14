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

router.get('/json/:user&:pss/registro_auto/', (peticion, respuesta) => {
    pool.getConnection((err, connection) => {
        let consulta
        let modificadorConsulta = ""
        const busqueda = (peticion.query.busqueda) ? peticion.query.busqueda : ""
        if (busqueda != "") {
            modificadorConsulta = `
                            WHERE
                            titulo LIKE '%${busqueda}%' OR
                            resumen LIKE '%${busqueda}%' OR
                            contenido LIKE '%${busqueda}%'
                        `
            consulta = `SELECT titulo, resumen, contenido FROM publicaciones ${modificadorConsulta}`
            connection.query(consulta, (error, filas, campos) => {
                if (filas.length > 0) {
                    respuesta.json({
                        data: filas
                    })
                } else {
                    respuesta.status(404)
                    respuesta.send({
                        errors: ["No existe una pulicación con esa palabra"]
                    })
                }
            })
        } else {
            const query = `SELECT * FROM publicaciones`

            connection.query(query, (error, filas, campos) => {
                respuesta.json(filas)
            })
        }
        connection.release()
    })
})

router.get('/json/publicaciones/:id', (peticion, respuesta) => {
    pool.getConnection((err, connection) => {
        const query = `SELECT * FROM publicaciones WHERE id=${connection.escape(peticion.params.id)}`

        connection.query(query, (error, filas, campos) => {
            if (filas.length > 0) {
                respuesta.json({
                    data: filas[0]
                })
            } else {
                respuesta.status(404)
                respuesta.send({
                    errors: ["No existe esa publicación"]
                })
            }

        })
        connection.release()
    })
})


router.get('/json/autores', (peticion, respuesta) => {
    pool.getConnection((err, connection) => {
        const query = `SELECT * FROM autores`

        connection.query(query, (error, filas, campos) => {
            respuesta.json(filas)
        })
        connection.release()
    })
})


router.get('/json/autores/:id', (peticion, respuesta) => {
    pool.getConnection((err, connection) => {
        const query = `SELECT autores.id id, nickname, titulo, resumen FROM autores 
            INNER JOIN publicaciones WHERE autores.id=${connection.escape(peticion.params.id)} AND autores.id = publicaciones.autor_id`

        connection.query(query, (error, filas, campos) => {
            if (filas.length > 0) {
                respuesta.json({
                    data: filas
                })
            } else {
                respuesta.status(404)
                respuesta.send({
                    errors: ["No existe ese autor"]
                })
            }

        })
        connection.release()
    })
})


router.post('/json/autores', (peticion, respuesta) => {
    pool.getConnection((err, connection) => {
        const email = peticion.body.email
        const nickname = peticion.body.nickname
        const password = peticion.body.password
        const consultaEmail = `
        SELECT *
        FROM autores
        WHERE email = ${connection.escape(email)}
      `
        connection.query(consultaEmail, (error, filas, campos) => {
            if (filas.length > 0) {
                respuesta.status(409)
                respuesta.send({
                    errors: ["Email duplicado"]
                })
            } else {
                const consultanickname = `
            SELECT *
            FROM autores
            WHERE nickname = ${connection.escape(nickname)}
          `
                connection.query(consultanickname, (error, filas, campos) => {
                    if (filas.length > 0) {
                        respuesta.status(409)
                        respuesta.send({
                            errors: ["Nickname duplicado"]
                        })
                    } else {
                        const consulta = `
                                  INSERT INTO
                                  autores
                                  (email, password, nickname)
                                  VALUES (
                                    ${connection.escape(email)},
                                    ${connection.escape(password)},
                                    ${connection.escape(nickname)}
                                  )
                                `
                        connection.query(consulta, (error, filas, campos) => {
                            const nuevoId = filas.insertId
                            const consultaId = `SELECT * FROM autores WHERE id=${connection.escape(nuevoId)}`

                            connection.query(consultaId, (error, filas, campos) => {
                                respuesta.status(201)
                                respuesta.json({
                                    data: filas[0]
                                })
                            })
                        })
                    }
                })
            }
        })
        connection.release()
    })
})


router.post('/json/publicaciones', (peticion, respuesta) => {
    pool.getConnection((err, connection) => {
        const email = (peticion.query.email) ? peticion.query.email : ""
        const password = (peticion.query.password) ? peticion.query.password : ""
        if (email != "" && password != "") {
            const consultaV = `
                    SELECT id
                    FROM autores
                    WHERE email = ${connection.escape(email)} AND password = ${connection.escape(password)}
                    `
            connection.query(consultaV, (error, filas, campos) => {
                if (filas.length > 0) {
                    const idAutor = filas[0].id
                    const date = new Date()
                    const fecha = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
                    const consulta = `
                                INSERT INTO
                                publicaciones
                                (titulo, resumen, contenido, autor_id, fecha_hora, votos)
                                VALUES
                                (
                                    ${connection.escape(peticion.body.titulo)},
                                    ${connection.escape(peticion.body.resumen)},
                                    ${connection.escape(peticion.body.contenido)},
                                    ${connection.escape(idAutor)},
                                    ${connection.escape(fecha)},
                                    "0"
                                )
                                `
                    connection.query(consulta, (error, filas, campos) => {
                        const nuevoId = filas.insertId
                        const consultaId = `SELECT * FROM publicaciones WHERE id=${connection.escape(nuevoId)}`

                        connection.query(consultaId, (error, filas, campos) => {
                            respuesta.status(201)
                            respuesta.json({
                                data: filas[0]
                            })
                        })
                    })
                } else {
                    respuesta.status(401)
                    respuesta.send({
                        errors: ["No autorizado compruebe credenciales"]
                    })
                }
            })
        } else {
            respuesta.status(401)
            respuesta.send({
                errors: ["No es posible hacer la agregacion, iniciar sesion primero"]
            })
        }
        connection.release()
    })

})

router.delete('/json/publicaciones/:id', (peticion, respuesta) => {
    pool.getConnection((err, connection) => {
        const email = (peticion.query.email) ? peticion.query.email : ""
        const password = (peticion.query.password) ? peticion.query.password : ""
        if (email != "" && password != "") {
            const consultaV = `
                    SELECT id
                    FROM autores
                    WHERE email = ${connection.escape(email)} AND password = ${connection.escape(password)}
                    `
            connection.query(consultaV, (error, filas, campos) => {
                if (filas.length > 0) {
                    const idAutor = filas[0].id
                    const consulta = `
                                DELETE FROM publicaciones WHERE autor_id = ${idAutor} AND id = ${connection.escape(peticion.params.id)}
                                `
                    connection.query(consulta, (error, filas, campos) => {
                        respuesta.status(200)
                        respuesta.send("Publicacion eliminada")
                    })
                } else {
                    respuesta.status(401)
                    respuesta.send({
                        errors: ["Compruebe credenciales"]
                    })
                }
            })
        } else {
            respuesta.status(401)
            respuesta.send({
                errors: ["No es posible eliminar, iniciar sesion primero"]
            })
        }
        connection.release()
    })
})

module.exports = router