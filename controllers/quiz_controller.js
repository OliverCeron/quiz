
var models = require('../models/models.js');
//Get /Quizes
//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function (req, res , next, quizId){
    models.Quiz.find(quizId).then(
        function(quiz){
        if(quiz) {
            req.quiz = quiz;
            next();
        }else {next (new Error('No existe quizId=' + quizId));}
    }
    ).catch(function(error) { next(error);});
};
//get busqueda
exports.index = function(req, res){
    if(req.query.search) {
        var filtro = (req.query.search || '').replace(" ", "%");
        models.Quiz.findAll({where:["pregunta like ?", '%'+filtro+'%'],order:'pregunta              ASC'}).then(function(quizes){
            res.render('quizes/index.ejs', {quizes: quizes, errors: [] });
        }).catch(function(error) { next(error);});

    } else {

        models.Quiz.findAll().then(function(quizes){
            res.render('quizes/index.ejs', {quizes: quizes, errors: []});
        }).catch(function(error) { next(error);});
        }
    };
//GET /quizes/:id
exports.show = function (req ,res){
        res.render('quizes/show',{ quiz:req.quiz, errors: [] });
};
//GET /quizes/:id/answer
exports.answer = function(req, res){
   var resultado = 'Incorrecto';
    if(req.query.respuesta === req.quiz.respuesta){
       resultado = 'Correcto';
     }
    res.render('quizes/answer',
               {quiz: req.quiz, respuesta: resultado, errors: [] 
        }    
   );
 };
    
exports.author = function(req,res){
    res.render('quizes/author', {errors: []});
};
//agregando el controlador new
exports.new = function(req,res){
    var quiz = models.Quiz.build( // crea objeto quiz
        {pregunta:"Pregunta", respuesta: "Respuesta"}
    );
    res.render('quizes/new',{quiz:quiz,errors: []});
};
//agregando el controlador create
exports.create = function (req, res){
    var quiz = models.Quiz.build(req.body.quiz);
    quiz.validate().then( function(err){
        if(err){
            res.render('quizes/new',{quiz:quiz,errors: err.errors});
        }else{
        //guarda en DB los Campos pregunta y respuesta de quiz
            quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
            res.redirect('/quizes')})    
        }
    }
 );//Redirección HTTP (URL relativo) Lista de preguntas
};
//controlador update
exports.edit = function(req, res){
    var quiz = req.quiz;//autoload de instancia de quiz
    res.render('quizes/edit', {quiz: quiz, errors:[]});
};
//PUT /quizes/id:
exports.update = function(req,res){
    req.quiz.pregunta = req.body.quiz.pregunta;
    req.quiz.respuesta = req.body.quiz.respuesta;
    
    req.quiz.validate().then( function(err){
        if(err){
            res.render('quizes/edit',{quiz: quiz, errors: err.errors});
        }else{
            req.quiz
            .save( {fields:["pregunta","respuesta"]})
            .then( function(){ res.redirect('/quizes');});
        }
    }
  );
};
