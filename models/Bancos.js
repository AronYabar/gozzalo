const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const BancoSchema = mongoose.Schema({
    
    titulo: {
        type: String,
        required: false,
        trim: true
    },
    imagen: {
        type: String,
        required: false,
        trim: true
    },
    creation: {
        type: Date,
        default: Date.now()
    }
});
BancoSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Banco', BancoSchema);