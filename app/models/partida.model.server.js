var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PartidaSchema = new Schema({
	data: String,
	player01: String,
	p1id: String,
	player02: String,
	p2id: String,
	vencedor: {type: String, default:""}
})


mongoose.model('Partida', PartidaSchema)
