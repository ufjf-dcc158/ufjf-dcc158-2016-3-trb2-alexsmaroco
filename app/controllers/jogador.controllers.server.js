var Jogador = require('mongoose').model('Jogador');
var Partida = require('mongoose').model('Partida')

module.exports.registroJogador = function (req, res, next) {
  res.render('registroJogador');
} 

module.exports.createJogador = function(req, res, next){
	res.setHeader("Content-Type", "text/html");
	res.write("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>")
   var jogador = new Jogador(req.body);
   if(jogador.apelido == "" || jogador.nome == "" || jogador.email == "") {
		res.write("Preencha todos os campos!")
        res.write("<p><a href='/registroJogador'> <button class='btn btn-default'>Voltar </button></a></p>")
		res.end()
   }
    else {
		jogador.save(function (err) {
			if(err){
				res.write("<div class='container'><p>Esse apelido ja esta em uso!</p>")
				res.write("<p><a href='/registroJogador'> <button class='btn btn-default'> Voltar </button></a></p></div>")
				res.end()
			}else{
				res.write("<div class='container'><p>Jogador registrado com sucesso!</p>")
				res.write("<p><a href='/jogador'> <button class='btn btn-default'> Voltar </button></a></p></div>")
				res.end()
			}
		})
	}
}


module.exports.listJogadores = function(req, res, next){
  Jogador.find({}, function(err, jogadores) {
    if(err){
      next(err);
    } else {
	  var jog = JSON.parse(JSON.stringify(jogadores))
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
      next();
    }
  });
}

module.exports.readJogador = function(req, res, next){
  res.render("detalhesJogador",{jogador:req.jogador});
}


module.exports.updateJogador = function(req, res, next){
	res.write("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>")
  var jogId = req.jogador.id
  jogador.findByIdAndUpdate(
    req.jogador.id,
    req.body,
    function(err, jogador2){
      if(err){
        next(err);
      }else{
        res.write("<div class='container'><p>Jogador atualizado com sucesso!</p>")
        res.write("<p><a href='/jogador/" + jogId + "'> <button class='btn btn-default'> Voltar </button></a></p></div>")
		res.end()
      }
    }
  );

}

module.exports.removerJogador = function(req, res, next){
	var apelido = req.jogador.apelido
	res.write("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>")
  Jogador.findByIdAndRemove(
    req.jogador._id,
    req.jogador,
    function(err, jog){
      if(err){
        next(err);
      } else{
		Partida.update({player01 : apelido, vencedor : ""}, {$set: {vencedor : 'Partida cancelada, um dos jogadores nao existe mais'}}, {multi:true}, function(err, stats) {
			if(err) {}
			else {
				Partida.update({player02 : apelido, vencedor : ""}, {$set: {vencedor : 'Partida cancelada, um dos jogadores nao existe mais'}}, {multi:true}, function(err, stats) {
					if(err) {}
					else {
						res.write("<div class='container'><p>Jogador removido com sucesso!</p>")
						res.write("<p><a href='/jogador/'> <button class='btn btn-default'> Voltar </button></a></p></div>")
						res.end()
					}
				})
			}
		})
        
      }
    }
  );
}

