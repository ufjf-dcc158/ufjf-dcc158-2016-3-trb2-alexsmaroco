module.exports = function(app){
  
  var jogador = require("../controllers/jogador.controllers.server.js")

  app.route("/jogador")
    .post(jogador.create)
    .get(jogador.list);

}
