/* jshint asi: true */
const express = require("express")
const router = express.Router()
const mysql = require("mysql")

var pool = mysql.createPool({
  /**
   * 
   * datos para la conexion a la BD en mySQL
   * Se especifica el limite de conexiones
   * el host donde esta alojada la base de datos
   * las credeciales de acceso 
   * y el nombre de la base de datos a usar
   * 
   * */
  connectionLimit: 20,
  host: "localhost",
  user: "root",
  password: "Nicolasnaba97",
  database: "prueba_estacionamiento",
})

router.get("/admin/index", (peticion, respuesta) => {
                                                                
  respuesta.render("admin/index", {                              /*Renderiza la pagina de inicio del admin o empleado*/
    usuario: peticion.session.usuario,
    /**
     * Pasa el usuario que inicio sesion*/
    mensaje: peticion.flash(
      "mensaje"
    ),                                                           /*Muestra mensaje si se redirigio a este endpoint y muestra el mensaje que viene acompañado*/ 
  })
})

router.get("/admin/registrar_entrada", (peticion, respuesta) => {
  pool.getConnection((err, connection) => {                     /*Se crea la conexión con la base de datos*/
    const consulta = `
      SELECT *
      FROM tipo_veh 
    `                                                           /* Consulta los tipos de autos registrados en la Base de Datos para poder realizar la entrada*/
    connection.query(consulta, (error, filas, campos) => {
                                                                /*Realiza la consulta y los datos obtenidos los inserta en la variable "filas"*/
      respuesta.render("admin/registrar_entrada", {             /*Renderiza la pagina web con los datos obtenidos*/
        usuario: peticion.session.usuario,                      /*Pasa el usuario que inicio sesion*/
        mensaje: peticion.flash("mensaje"),                     /*Muestra mensaje si se redirigio de nuevo a este endpoint y muestra el mensaje que viene acompañado con la redireccion*/
        vehiculos: filas,                                       /*Pasa los datos obtenidos como una lista al html en la variable "}vVehiculos"*/                                                            
      })
    })
    connection.release()                                        /*Libera la conexion con la Base de datos*/
  })
})

router.post("/admin/procesar_entrada", (peticion, respuesta) => {
  pool.getConnection((err, connection) => {                   
    const date = new Date()                                                                 /*Obtiene la fecha de la maquina*/
    const fecha = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`       /*Se formatea la fecha para poder introducirla en la BD*/
    const tiempo_entrada = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`   /*Se formatea la misma fecha pero solo la hora, min y seg*/
    const tipo_vehiculo = parseInt(
      peticion.body.t_veh
    )                                                                                       /*Se convierte a entero el valor que pasa el select en el formulario HTLM del tipo de auto*/
    const placa = peticion.body.placa
      .toLowerCase()
      .trim()                                                                               /*El valor obtenido en el fomulario de placa sepasa a minuscula y se quitan espacios de la placa*/
    const consulta = `INSERT INTO reg_vehiculos 
    (placa,hora_entrada, estado, id_empleado,tipo_vec)
    VALUES (${connection.escape(placa)},
    ${connection.escape(fecha)},
    "IN", ${connection.escape(peticion.session.usuario.id_empleado)},
    ${connection.escape(tipo_vehiculo)})
    `                                                                                       /* Se crea la consulta para insertar los datos correspondientes en la BD*/
    connection.query(consulta, (error, filas, campos) => {
      peticion.flash("mensaje", "Entrada Registrada a las " + tiempo_entrada)               /*Se crea un mensaje flash para mostrar luego de realizar el registro con el tiempo de entrada*/
      respuesta.redirect("/admin/registrar_entrada")                                        /*Se redirecciona y muetra el mensaje*/
    })
    connection.release() 
  })
})

router.get("/admin/registrar_salida", (peticion, respuesta) => {
  respuesta.render("admin/registrar_salida", {                                              /*Renderiza el archivo ejs correspondiente como un html*/
    usuario: peticion.session.usuario,                                                      /*Pasa el usuario que inicio sesion*/
    mensaje: peticion.flash("mensaje"),
    
  })
})

router.post("/admin/procesar_salida", (peticion, respuesta) => {
  pool.getConnection((err, connection) => { 
    const date = new Date()                                                                 /*Obtiene la fecha de la maquina*/
    const hora_salida = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`       /*Se formatea la fecha para poder introducirla en la BD*/
    const placa = peticion.body.placa.toLowerCase().trim()                                  /*Se pasa a minuscula y se quitan espacios de la placa*/
    const consulta_hora_entrada = `select hora_entrada, hora_salida, cobroxmin, ntipo_veh 
    FROM reg_vehiculos, tipo_veh
    WHERE placa =${connection.escape(placa)} }
    AND reg_vehiculos.tipo_vec=tipo_veh.id_tipo`                                            /*Se crea la consulta la hora de entrada del vehiculo de la placa dada*/
    connection.query(consulta_hora_entrada, (error, filas, campos) => {                     /*Realiza la consulta y los datos obtenidos los inserta en la variable "filas"*/
      if (filas.length > 0 && filas[0].hora_salida == null) {
        const hora_entrada = new Date(filas[0].hora_entrada)
        var dif = (date - hora_entrada) / 60000                                             /*Para obtener la diferencia en minutos de las fechas se restan y se divide en 60000*/
        const tiempo = Math.abs(Math.round(dif))                                            /*Se saca valor absoluto y se redondea el valor*/
        const cobro = filas[0].cobroxmin * tiempo                                           /*Para el cobro se multiplica el tiempo que dio como resultado por el valor correspondiente traido de la BD*/
        const nom_tipo_veh = filas[0].ntipo_veh                                             /*Se introduce en una variable el nombre del tipo de auto*/
        const consulta_Update = `UPDATE reg_vehiculos 
        SET hora_salida = ${connection.escape(hora_salida)},
        total_pago = ${connection.escape(cobro)}, 
        estado = "OUT", total_tiempo_esta = ${connection.escape(tiempo)} 
        WHERE placa =${connection.escape(placa)}
        `                                                                          /*Se crea la consulta para actualizar la BD con la hora de salida, el cobro y el tiempo que estuvo estacionado*/
        connection.query(consulta_Update, (error, filas, campos) => {                       /*Se Realiza la consulta UPDATE*/
          peticion.flash(
            "mensaje",
            "El pago es " +
            cobro +
            "$ por un tiempo de " +
            tiempo +
            "minutos y un vehiculo tipo " +
            nom_tipo_veh
          )                                                                                 /*Se crea un mensaje que muestra el cobro, el tiempo y el tipo de auto*/
          respuesta.redirect("/admin/index")                                                /*Se redirecciona y se pasa el mensaje*/
        })
      }
      if (filas.length > 0 && filas[0].hora_salida != null) {
        peticion.flash(
          "mensaje",
          "El Vehiculo con ese número de placa ya salio"
        )                                                                                   /*Si al hacer la consulta el vehiculo con esa placa ya tiene hora de salida muestra un mensaje*/
        respuesta.redirect("/admin/index")
      }
      if (filas.length == 0) {
        peticion.flash(
          "mensaje",
          "No hay parqueado ningun vehiculo con ese numero de placa"
        )                                                                                   /*Si al hacer la consulta no hay registro de un vehiculo con la placa muestra un mensaje*/
        respuesta.redirect("/admin/index")
      }
    })
    connection.release()
  })
})

router.get("/admin/reportes", (peticion, respuesta) => {
  respuesta.render("admin/reportes", {
    usuario: peticion.session.usuario,
    mensaje: peticion.flash("mensaje"),
  })                                                                                        /*Se renderiza el archivo .ejs correspondiente*/
})

router.get("/admin/reporte1", (peticion, respuesta) => {
  pool.getConnection((err, connection) => { 
    const fecha1 = peticion.query.fecha1 ? peticion.query.fecha1 : ""                           /*Se asignan las fechas si no tienen valor se asigna como vacio*/
    let fecha2 = peticion.query.fecha2 ? peticion.query.fecha2 : ""
    if (fecha1 != "" || fecha2 != "") {                                                         /*Si las fechas o al menos una no es vacia entra en el if*/
      fecha2 = new Date(fecha2)                                                                 /*Se crea una fecha con los valores dados*/
      fecha2.setDate(fecha2.getDate() + 1)
      fecha2 = `${fecha2.getFullYear()}-${fecha2.getMonth() + 1}
      -${fecha2.getDate()} ${fecha2.getHours()}:${fecha2.getMinutes()}:${fecha2.getSeconds()}`  /*A esta fecha se le suma un dia para hacer la consulta hasta el final del dia que se quiere*/
      const consulta = `
      SELECT SUM(total_pago) AS Total_Recaudado, COUNT(id_vehiculo) AS Total_Vehiculos
      FROM reg_vehiculos
      WHERE hora_salida LIKE '%${fecha1}%' OR hora_salida BETWEEN '${fecha1}' AND '${fecha2}'`  /*Se crea la consulta necesaria*/
      connection.query(consulta, (error, filas, campos) => {                                    /*Realiza la consulta y los datos obtenidos los inserta en la variable "filas"*/
        respuesta.render("admin/reporte1", { 
          usuario: peticion.session.usuario, 
          total_rec: String(filas[0].Total_Recaudado),                                          /*Se extraen los datos obtenidos de la BD y se pasan como tipo String, total recaudado*/
          total_veh: String(filas[0].Total_Vehiculos),                                          /*total vehiculos*/
          fecha1: fecha1,                                                                       /*Se pasan las fechas correspondientes*/
          fecha2: fecha2,
        })
      })
    } else {
      respuesta.render("admin/reporte1", {                                                      /* Si las fechas estan vacias entra al else y se renderiza la pagina correspondiete con datos vacios*/
        usuario: peticion.session.usuario,
        total_rec: "",
        total_veh: "",
        fecha1: fecha1,
        fecha2: fecha2,
      })
    }
    connection.release()                                                                        /*Libera la conexion con la Base de datos*/
  })
})

router.get("/admin/reporte2", (peticion, respuesta) => {
  pool.getConnection((err, connection) => { 
    const fecha1 = peticion.query.fecha1 ? peticion.query.fecha1 : "" 
    let fecha2 = peticion.query.fecha2 ? peticion.query.fecha2 : ""
    if (fecha1 != "" || fecha2 != "") {                                                         /*Si las fechas o al menos una no es vacia entra en el if*/
      fecha2 = new Date(fecha2)                                                                 /*Se crea una fecha con los valores dados*/
      fecha2.setDate(fecha2.getDate() + 1)
      fecha2 = `${fecha2.getFullYear()}-${fecha2.getMonth() + 1}
      -${fecha2.getDate()} ${fecha2.getHours()}:${fecha2.getMinutes()}:${fecha2.getSeconds()}`  /*A esta fecha se le suma un dia para hacer la consulta hasta el final del dia que se quiere*/
      
      const consulta = `
      SELECT id_vehiculo, placa, hora_entrada, hora_salida, total_tiempo_esta, total_pago,ntipo_veh
      FROM reg_vehiculos,tipo_veh
      WHERE reg_vehiculos.tipo_vec=tipo_veh.id_tipo AND (hora_salida LIKE '%${fecha1}%' 
      OR hora_salida BETWEEN '${fecha1}' AND '${fecha2}') AND reg_vehiculos.estado="OUT"`       /*Se crea la consulta necesaria*/
    
      connection.query(consulta, (error, filas, campos) => { 
        respuesta.render("admin/reporte2", { 
          usuario: peticion.session.usuario,
          registros: filas,
          fecha1: fecha1,
          fecha2: fecha2,
        })
      })
    } else {                                                                                    /* Si las fechas estan vacias entra al else y se renderiza la pagina correspondiete con datos vacios*/
      respuesta.render("admin/reporte2", {
        usuario: peticion.session.usuario,
        registros: [],
        fecha1: fecha1,
        fecha2: fecha2,
      })
    }
    connection.release() 
  })
})

router.get("/admin/reporte3generado", (peticion, respuesta) => {
  pool.getConnection((err, connection) => {
    const fecha1 = peticion.query.fecha1                                                            /*Se obtienen la fechas del formulario*/
    let fecha2 = peticion.query.fecha2
    const tipo_vehiculo = parseInt(peticion.query.t_veh)                                            /*El valor obtenido del formulario se pasa a un Entero, para poder pasarlo en la consulta*/
    fecha2 = new Date(fecha2)                                                                       /*Crea una fecha con los datos dados*/
    fecha2.setDate(fecha2.getDate() + 1)
    fecha2 = `${fecha2.getFullYear()}-${fecha2.getMonth() + 1}
    -${fecha2.getDate()} ${fecha2.getHours()}:${fecha2.getMinutes()}:${fecha2.getSeconds()}`        /*Suma un dia a la fecha de limite */
    const consulta = `
      SELECT id_vehiculo, placa, hora_entrada, hora_salida, total_tiempo_esta, total_pago,ntipo_veh
      FROM reg_vehiculos,tipo_veh
      WHERE reg_vehiculos.tipo_vec=tipo_veh.id_tipo AND tipo_veh.id_tipo=${tipo_vehiculo} 
      AND (hora_salida LIKE '%${fecha1}%' 
      OR hora_salida BETWEEN '${fecha1}' AND '${fecha2}') 
      AND reg_vehiculos.estado="OUT"`                                                               /*Se crea la consulta necesaria*/
    
    connection.query(consulta, (error, filas, campos) => {                                          /*Realiza la consulta y los datos obtenidos los inserta en la variable "filas"*/
      respuesta.render("admin/reporte3", {                                                          /*Renderiza el archivo .ejs correspondiente*/
        usuario: peticion.session.usuario,
        registros: filas,
        fecha1: fecha1,
        fecha2: fecha2,
      })
    })
    connection.release()                                                                            /*Libera la conexion con la Base de datos*/
  })
})

router.get("/admin/reporte3", (peticion, respuesta) => {
  respuesta.render("admin/reporte3", {
    usuario: peticion.session.usuario,
    mensaje: peticion.flash("mensaje"),
    registros: [],
    fecha1: "",
    fecha2: "",
  })
})

router.get("/admin/procesar_cerrar_sesion", (peticion, respuesta) => {                               /*Procesa el cierre de sesión*/
  peticion.session.destroy()
  respuesta.redirect("/")
})

router.get("/admin/nuevo_veh", (peticion, respuesta) => {                                           /*Endpoint que renderiza el .ejs que permite agregar un nuevo tipo de auto*/
  respuesta.render("admin/nuevo_veh", {
    mensaje: peticion.flash("mensaje"),
    usuario: peticion.session.usuario,
  })
})

router.post("/admin/procesar_new_veh", (peticion, respuesta) => {
  pool.getConnection((err, connection) => {                                                         /*Se crea la conexión con la base de datos*/
    var newVeh =
      peticion.body.new_veh.charAt(0).toUpperCase() +
      peticion.body.new_veh.substr(1).toLowerCase()                                                 /*Al tipo de auto nuevo se vuelve todo minuscula y la primera letra mayusacula*/
    const consultaVeh = `
          SELECT *
          FROM tipo_veh
          WHERE ntipo_veh = ${connection.escape(newVeh)}
        `                                                                                           /*Se crea lac onsulta necesaria*/
    connection.query(consultaVeh, (error, filas, campos) => {                                       /*Realiza la consulta y los datos obtenidos los inserta en la variable "filas"*/
      if (filas.length > 0) {
        peticion.flash("mensaje", "Vehiculo ya existe")                                             /*Si al hacer la consulta devuelve algo muestra un mensaje*/
        respuesta.redirect("/admin/nuevo_veh")
      } else {                                                                                      /*Si no deveulve nada realiza la creacion en la base de datos de un nuevo tipo de vehiculo*/
        const consulta = `INSERT INTO tipo_veh (ntipo_veh) VALUES (${connection.escape(
          newVeh
        )})`
        connection.query(consulta, (error, filas, campos) => {                                      /*Se realiza la consulta de inserción de datos*/
          peticion.flash("mensaje", "Vehiculo Registrado")
          respuesta.redirect("/admin/nuevo_veh")
        })
      }
      connection.release()
    })
  })
})

module.exports = router