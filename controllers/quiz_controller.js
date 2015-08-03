
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
            res.render('quizes/index', {quizes: quizes});
        }).catch(function(error) { next(error);});

    } else {

        models.Quiz.findAll().then(function(quizes){
            res.render('quizes/index', {quizes: quizes});
        }).catch(function(error) { next(error);});
        }
    };
//GET /quizes/:id
exports.show = function (req ,res){
    models.Quiz.find(req.params.quizId).then(function(quiz){
        res.render('quizes/show',{ quiz:quiz });
    })
};
//GET /quizes/:id/answer
exports.answer = function(req, res){
  models.Quiz.find( req.params.quizId).then(function(quiz){
    if(req.query.respuesta == quiz.respuesta){
    res.render('quizes/answer',
               {quiz:quiz, respuesta:'Correcto'});
    }else {
        res.render('quizes/answer',
                   {quiz:quiz, respuesta:'Incorrecto'});
    }
  })
};
exports.author = function(req,res){
    res.render('quizes/author');
};
//agregando el controlador new
exports.new = function(req,res){
    var quiz = models.Quiz.build( // crea objeto quiz
        {pregunta:"Pregunta", respuesta: "Respuesta"}
    );
    res.render('quizes/new',{quiz:quiz});
};
//agregando el controlador create
exports.create = function (req, res){
    var quiz = models.Quiz.build(req.body.quiz);
    //guarda en DB los Campos pregunta y respuesta de quiz
    quiz.save({fields: ["pregunta", "respuesta"]}).then(function(){
        res.redirect('/quizes');    
    })//Redirección HTTP (URL relativo) Lista de preguntas
};
