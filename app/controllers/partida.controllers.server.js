var Partida = require('mongoose').model('Partida');

module.exports.registroPartida = function (req, res, next) {
  res.render('registroPartida');
} 

module.exports.createPartida = function(req, res, next){
	res.setHeader("Content-Type", "text/html");
   var partida = new Partida(req.body);
   partida.save(function (err) {
     if(err){
       next(err);
     }else{
		res.write("Partida registrado com sucesso!")
        res.write("<p><a href='/partida'> Voltar </a></p>")
		res.end()
     }
   });
}


module.exports.listPartidas = function(req, res, next){
  Partida.find({}, function(err, partidas) {
    if(err){
      next(err);
    } else {
	  var part = JSON.parse(JSON.stringify(partidas))
	  //console.log(part)
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
	  console.log("get partida")
      next();
    }
  });
}

module.exports.readPartida = function(req, res, next){
  res.render("detalhesPartida",{partida:req.partida});
}


module.exports.updatePartida = function(req, res, next){
  var id = req.partida.id
  partida.findByIdAndUpdate(
    req.partida.id,
    req.body,
    function(err, partida2){
      if(err){
        next(err);
      }else{
        res.write("Partida atualizado com sucesso!")
        res.write("<p><a href='/partida/" + id + "'> Voltar </a></p>")
		res.end()
      }
    }
  );

}

