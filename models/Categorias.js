const mongoose = require('mongoose');

const CategoriasSchema = mongoose.Schema({
    
    nombre: {
        type: String,
        required: false,
        trim: true
    },
    slug: {
        type: String,
        required: false,
        trim: true
    },
    imagen: {
        type: String,
        required: false,
        trim: true
    },
    openGraph: {
        type: String,
        required: false,
        trim: true
    },
    estado: {
        type: String,
        required: false,
        trim: true,
        default: 1
    },
    descripcion: {
        type: String,
        required: false,
        trim: true
    },
    keywords: {
        type: String,
        required: false,
        trim: true
    },
    color: {
        type: String,
        required: false,
        trim: true
    },
    iconIos: {
        type: String,
        required: false,
        trim: true
    },
    iconAndroid: {
        type: String,
        required: false,
        trim: true
    },
    siluetaIos: {
        type: String,
        required: false,
        trim: true
    },
    siluetaAndroid: {
        type: String,
        required: false,
        trim: true
    },
    creation: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('Categoria', CategoriasSchema);