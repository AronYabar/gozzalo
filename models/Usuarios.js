const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const UsuariosSchema = mongoose.Schema({
    tipoUsuario: {
        type: String,
        required: false,
        trim: true
    },
    tipoDocumento: {
        type: String,
        required: false,
        trim: true
    },
    nroDocumento: {
        type: String,
        required: false,
        trim: true
    },
    nombres: {
        type: String,
        required: false,
        trim: true
    },
    apellidos: {
        type: String,
        required: false,
        trim: true
    },
    fechaNacimiento: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true
    },
    genero: {
        type: String,
        required: false,
        trim: true
    },
    celular : {
        type: String,
        required: false,
        trim: true
    },
    foto :{
        type: String,
        required: false,
        trim: true
    },
    totalMinutos :{
        type: String,
        required: false,
        trim: true
    },
    totalPuntos :{
        type: String,
        required: false,
        trim: true
    },
    token: {
        type: String,
        required: false,
        trim: true
    },
    estado: {
        type: String,
        required: false,
        trim: true
    },
    estadoRegistro: {
        type: String,
        required: true,
        default:'0',
        trim: true
    },
    password: {
        type: String,
        required: false,
        trim: true
    },
    categoriasPreferidas: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Categoria'
                
        }
        
    ],
    direcciones: [
        {
            direccionEntrega: {
                type: String,
                required: false,
                trim: true
            },
            informacionAdicional: {
                type: String,
                required: false,
                trim: true
            },
            favorito: {
                type:Number,
                default: 0,
                required: false,
                trim: true
            },
            alias: {
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
            creation: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    creation: {
        type: Date,
        default: Date.now()
    }
});
UsuariosSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Usuario', UsuariosSchema);