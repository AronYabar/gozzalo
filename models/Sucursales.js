const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const SucursalSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: false,
        trim: true
    },
    departamentoID: {
        type: String,
        required: false,
        trim: true
    },
    departamentoNombre: {
        type: String,
        required: false,
        trim: true
    },
    provinciaID: {
        type: String,
        required: false,
        trim: true
    },
    provinciaNombre: {
        type: String,
        required: false,
        trim: true
    },
    distritoID: {
        type: String,
        required: false,
        trim: true
    },
    distritoNombre: {
        type: String,
        required: false,
        trim: true
    },
    estado: {
        type: Number,
        required: false,
        trim: true
    },
    direccion: {
        type: String,
        required: false,
        trim: true
    },
    telefono: {
        type: String,
        required: false,
        trim: true
    },
    latitud: {
        type: String,
        required: false,
        trim: true
    },
    longitud: {
        type: String,
        required: false,
        trim: true
    },
    empresaSlug: {
        type: String,
        required: false,
        trim: true
    },
    empresa: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Empresa'
    },
    creation: {
        type: Date,
        default: Date.now()
    }
});
SucursalSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Sucursal', SucursalSchema,'sucursales');