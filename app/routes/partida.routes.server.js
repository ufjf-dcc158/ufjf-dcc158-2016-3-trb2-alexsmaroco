module.exports = function(app){

  var partida = require("../controllers/partida.controllers.server.js");
    
	app.get("/registroPartida", partida.registroPartida)
  
  app.route("/partida")
    .post(partida.createPartida)
    .get(partida.listPartidas);
  app.route("/partida/:idPartida")
    .get(partida.readPartida)
    .post(partida.updatePartida);
  app.param("idPartida", partida.getPartidaById);
}
