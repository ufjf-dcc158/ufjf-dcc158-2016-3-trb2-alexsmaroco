module.exports = function(app){
  var core = require('../controllers/core.controllers.server.js');
  var jogador = require('../controllers/jogador.controllers.server.js')
  app.get("/registroJogador", core.registroJogador)
  app.get("/", core.home);

}
