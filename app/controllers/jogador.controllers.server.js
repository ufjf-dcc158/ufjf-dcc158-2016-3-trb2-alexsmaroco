var Jogador = require('mongoose').model('Jogador');

module.exports.registroJogador = function (req, res, next) {
  res.render('registroJogador');
} 

module.exports.createJogador = function(req, res, next){
	res.setHeader("Content-Type", "text/html");
   var jogador = new Jogador(req.body);
   jogador.save(function (err) {
     if(err){
       next(err);
     }else{
		res.write("Jogador registrado com sucesso!")
        res.write("<p><a href='/jogador'> Voltar </a></p>")
		res.end()
     }
   });
}


module.exports.listJogadores = function(req, res, next){
  Jogador.find({}, function(err, jogadores) {
    if(err){
      next(err);
    } else {
      //res.json(jogadores);
	  var jog = JSON.parse(JSON.stringify(jogadores))
	  //console.log(jog)
	  res.render('listaJogadores', {jogadores:jog})
    }
  });
}


module.exports.getJogadorById = function(req, res, next, id){
  Jogador.findOne({"_id":id}, function(err, jogador){
    if(err){
      res.json({});
    }else{
      req.jogador = jogador;
	  console.log(jogador)
      next();
    }
  });
}

module.exports.getJogadorByApelido = function(req, res, next, id){
  Jogador.findOne({"apelido":id}, function(err, jogador){
    if(err){
      res.json({});
    }else{
      req.jogador = jogador;
	  console.log("get jogador")
      next();
    }
  });
}

module.exports.readJogador = function(req, res, next){
  res.render("detalhesJogador",{jogador:req.jogador});
}


module.exports.updateJogador = function(req, res, next){
  var jogId = req.jogador.id
  jogador.findByIdAndUpdate(
    req.jogador.id,
    req.body,
    function(err, jogador2){
      if(err){
        next(err);
      }else{
        res.write("Jogador atualizado com sucesso!")
        res.write("<p><a href='/jogador/" + jogId + "'> Voltar </a></p>")
		res.end()
      }
    }
  );

}
