var Partida = require('mongoose').model('Partida');
var Jogador = require('mongoose').model('Jogador');
var dateFormat = require('dateformat')

module.exports.registroPartida = function (req, res, next) {
  res.render('registroPartida');
} 

module.exports.createPartida = function(req, res, next){
	res.setHeader("Content-Type", "text/html");
	res.write("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>")
	var dados = req.body
	if(dados.data != "" && dados.player01 != "" && dados.player02 != "" && (dados.player01 != dados.player02)) {
		var partida = new Partida()
		partida.data = dateFormat(dados.data, "dddd, dd-mm-yyyy, HH:MM")
		
		// valida os jogadores
		Jogador.findOne({"apelido":dados.player01}, function(err, jogador) {
			if(err){
			res.json({});
			} else{
			if(jogador != null) {
				partida.player01 = jogador.apelido
				partida.p1id = jogador._id
				
				Jogador.findOne({"apelido":dados.player02}, function(err, jogador2){
					if(err){
					res.json({});
					} else{
					if(jogador2 != null) {
						partida.player02 = jogador2.apelido;
						partida.p2id = jogador2._id
						partida.save(function (err) {
						if(err){
							next(err);
						}else{
							res.write("<div class='container'> <p>Partida registrado com sucesso!</p>")
							res.write("<p><a href='/partida'> <button class='btn btn-default'> Voltar </button></a></p></div>")
							res.end()
						}
					})
					}
					else {
						res.write("<div class='container'><p>Falha ao registrar partida, Jogador 2 nao existe!</p>")
						res.write("<p><a href='/partida'> <button class='btn btn-default'> Voltar </button></a></p></div>")
						res.end()
					}
					}
				});
			} 
			else {
				res.write("<div class='container'><p>Falha ao registrar partida, Jogador 1 nao existe!</p>")
				res.write("<p><a href='/partida'> <button class='btn btn-default'> Voltar </button></a></p></div>")
				res.end()
			}
			
			
			}
		});
   }
   else {
		res.write("<div class='container'><p>Dados invalidos!</p>")
		res.write("<p><a href='/registroPartida'> <button class='btn btn-default'> Voltar </button></a></p></div>")
		res.end()
   }
}


module.exports.listPartidas = function(req, res, next){
  Partida.find({}, function(err, partidas) {
    if(err){
      next(err);
    } else {
	  var part = JSON.parse(JSON.stringify(partidas))
	  res.render('listaPartidas', {partidas:part})
    }
  });
}


module.exports.getPartidaById = function(req, res, next, id){
  Partida.findOne({"_id":id}, function(err, partida){
    if(err){
      res.json({});
    }else{
      req.partida = partida;
      next();
    }
  });
}

module.exports.readPartida = function(req, res, next){
  res.render("detalhesPartida",{partida:req.partida});
}


module.exports.updatePartida = function(req, res, next){
  res.setHeader("Content-Type", "text/html");
  res.write("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css' integrity='sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u' crossorigin='anonymous'>")
 
  var vencedor = req.body.vencedor
	if(vencedor != 'empate' && vencedor != req.partida.player01 && vencedor != req.partida.player02) {
		res.write("<div class='container'><p>Vencedor invalido!</p>")
		res.write("<p><a href='/partida'> <button class='btn btn-default'> Voltar </button></a></p></div>")
		res.end()
	} else {
		Partida.findByIdAndUpdate(req.partida.id, req.body,function(err, partida2){
		if(err){
			next(err);
		} else{
			Jogador.findOne({"apelido":req.partida.player01}, function(err, jogador){
			if(err){
				res.json({});
			}else{
				req.player01 = jogador;
				Jogador.findOne({"apelido":req.partida.player02}, function(err, jogador){
				if(err){
					res.json({});
				} else{
					req.player02 = jogador;
					
					if(req.player01 == null || req.player02 == null) {
						cancelarPartida(req.partida)
						res.write("<div class='container'><p>Partida cancelada, um dos jogadores nao existe mais! </p>")
						res.write("<p><a href='/partida/" + req.partida.id + "'> <button class='btn btn-default'> Voltar </button> </a></p></div>")
						res.end()
					} 
					else {
						var r1 = Math.pow(10,(req.player01.ELO/400))
						var r2 = Math.pow(10, (req.player02.ELO/400))
						var e1 = r1/(r1+r2)
						var e2 = r2/(r1+r2)
						var k = 32
						var s1
						var s2
						
						if(vencedor == 'empate') {
							req.player01.empates = req.player01.empates + 1
							req.player02.empates = req.player02.empates + 1
							s1 = 0.5
							s2 = 0.5
						} else {
							if(vencedor == req.partida.player01) {
								req.player01.vitorias = req.player01.vitorias + 1
								req.player02.derrotas = req.player02.derrotas + 1
								s1 = 1
								s2 = 0

							} else {
								req.player02.vitorias = req.player02.vitorias + 1
								req.player01.derrotas = req.player01.derrotas + 1
								s1 = 0
								s2 = 1
							}
						}
						req.player01.ELO = req.player01.ELO + k*(s1-e1)
						req.player02.ELO = req.player02.ELO + k*(s2-e2)
						atualizaJogadores(req.player01,req.player02)
						res.write("<div class='container'><p>Partida atualizada com sucesso! </p>")
						res.write("<p><a href='/partida/" + req.partida.id + "'> <button class='btn btn-default'> Voltar </button> </a></p></div>")
						res.end()
					}
				}
				})
			}
			})
		}
	});
	}
}

function cancelarPartida(partida) {
	partida.vencedor = "Partida cancelada, um dos jogadores nao existe mais"
	Partida.findByIdAndUpdate(partida.id,partida,function(err,part) {
		if(err) {
			console.log(err)
		} else {}
	})
}

function atualizaJogadores(player01,player02) {
	Jogador.findByIdAndUpdate(player01._id, player01,function(err, player) {
		if(err) { next(err) }
		else {
			Jogador.findByIdAndUpdate(player02._id, player02,function(err, player) {
			if(err) {next(err)}
			else {}
			})
		}
		})
}
