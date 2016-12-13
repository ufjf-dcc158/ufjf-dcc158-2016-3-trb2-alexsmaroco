var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var JogadorSchema = new Schema({
	apelido: {type:String, index:true, unique:true},
	nome: String,
	email: String,
	vitorias: {type:Number, default: 0},
	derrotas: {type:Number, default: 0},
	empates: {type:Number, default: 0},
	ELO: {type:Number, default: 1000, set: v => Math.round(v)}
})

mongoose.model('Jogador', JogadorSchema)
