# PruebaAviaTec
Prueba técnica Aviatec

  Para iniciar el servidor se debe entrar por el terminal o abrir el terminal en la carpeta raiz del proyecto 
  Se puede iniciar con el comando "node webapp.js" o con "nodemon webapp.js" 
  ya que se uso nodemon para facilitar el reinicio del servidor con cada cambio en el codigo
  El servidor corre en el puerto 8081, se coloca la direccion http://localhost:8081/ en el navegador una vez corra el servidor
  si se desea cambiar el puerto se puede cambiar en el archivo "webapp.js"
  
  Para el servidor poder acceder a la base de datos se deben cambiar las credenciales en los archivos 
  "middleware.js", "privadas.js", "publicas.js"
  
  ```
  var pool = mysql.createPool({
  connectionLimit: 20,
  host: 'localhost',
  user: 'usuario de la base datos',                       <----------
  password: 'Contraseña de acceso del usuario a la BD',   <----------
  database: 'prueba_estacionamiento'
  })
  ```
  
  En la base de datos se insertaron de ejemplo dos empleados, para iniciar sesion se puede iniciar con "usuario: NAB123 y clave: 123123"
  o con "usuario: admin123 y clave: 123456"
  
  En la carpeta Raiz se encuentra el .sql de la base de datos, Se hizo uso de MySql
  
  
