module.exports = function(app){
  var core = require('../controllers/core.controllers.server.js');
  var jogador = require('../controllers/jogador.controllers.server.js')
  var partida = require('../controllers/partida.controllers.server.js')
  

  app.get("/", core.home);

}
