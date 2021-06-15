const mongoose = require('mongoose');
const ParametrosSchema = mongoose.Schema({
    valorPuntos: {
        type: Number,
        required: false,
        trim: true
    }
});
module.exports = mongoose.model('Parametro', ParametrosSchema,'parametros');