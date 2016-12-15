module.exports = function(app){
  
  var jogador = require("../controllers/jogador.controllers.server.js")
	app.get("/registroJogador", jogador.registroJogador)
	
	app.route("/jogador")
		.post(jogador.createJogador)
		.get(jogador.listJogadores);
	app.route("/jogador/:idJogador")
		.post(jogador.updateJogador)
		.get(jogador.readJogador);
		//.delete(jogador.remove);
	app.param("idJogador", jogador.getJogadorByApelido);

}
