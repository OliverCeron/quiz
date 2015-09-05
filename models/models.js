var path = require('path');
//postgress DB_RL = postgress =://USER:passwd@host:port/database
//SQLite = DATABASE_URL = sqlite://:@:/
var url= process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null );
var user    = (url[2]||null );
var pwd     = (url[3]||null );
var protocol= (url[1]||null);
var dialect = (url[1]||null);
var port    = (url[5]||null);
var host    = (url[4]||null);
var storage = process.env.DATABASE_STORAGE;
//carga modelo ORM
var Sequelize = require('sequelize');
//usar BD SQLite o Postgres
/*var sequelize = new Sequelize(DB_name, user, pwd,
    {   dialect:  protocol,
        protocol: protocol,
        port:     port,
        host:     host,
        storage:  storage, //solo Para SQLite (.env)
        omitNull: true  //solo Postgres
        
    }
);*/

//usar SBDD SQLITE
var sequelize = new Sequelize(null, null , null, 
            {dialect:"sqlite",storage:"quiz.sqlite"}
            );
//importar la definición de la tabla quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname,'quiz'));
exports.Quiz = Quiz;//exportar definición de tabla Quiz
//sequelize.sync() crea e inicializa tabla de preguntas en DB
//cambiando el código .success por .then
sequelize.sync().then(function(){
    //success(..) ejecuta el manejador una vez creada la tabla 
    Quiz.count().then(function(count){
      if(count === 0 ){//la tabla se inicializa solo si está vacía
        Quiz.create({pregunta:'Capital de Italia',
                respuesta: 'Roma'
                })
        Quiz.create({pregunta: 'Capital de Portugal',
                     respuesta:'Lisboa'
                    })
        .then(function(){console.log('Base de datos inicializada')});
      };
      });
          
    });