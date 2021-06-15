const mongoose = require('mongoose');

const UserUbicacionesSchema = mongoose.Schema({
    TiempoConeccion: {
        type: Number,
        required: true,
        default:1,
        trim: true
        
    },
    valorPuntos: {
        type: Number,
        required: false,
        trim: true
    },
    estado: {
        type: String,
        required: false,
        trim: true
    },
    token: {
        type: String,
        required: false,
        trim: true
    },
    estadoSuma: {
        type: Number,
        required: true,
        default:0,
        trim: true
        
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Usuario'
    },
    ubicaciones: [
        {
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
module.exports = mongoose.model('UserUbicacion', UserUbicacionesSchema,'userUbicaciones');