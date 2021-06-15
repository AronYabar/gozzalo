const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const ImagenesSchema = mongoose.Schema({
    url: {
        type: String,
        required: false,
        trim: true
    },
    nombre: {
        type: String,
        required: false,
        trim: true
    },
    creation: {
        type: Date,
        default: Date.now()
    }
});
ImagenesSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Imagen', ImagenesSchema,'imagenes');