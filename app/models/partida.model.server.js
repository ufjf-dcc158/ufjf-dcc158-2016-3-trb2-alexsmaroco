var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Jogador = require('mongoose').model('Jogador');

var PartidaSchema = new Schema({
	data: Date,
	player01: String,
	player02: String,
	vencedor: {type: String, default: null}
})

mongoose.model('Partida', PartidaSchema)
