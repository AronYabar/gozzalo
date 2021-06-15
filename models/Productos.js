const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const ProductosSchema = mongoose.Schema({
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
    descripcionCorta: {
        type: String,
        required: false,
        trim: true
    },
    descripcionLarga: {
        type: String,
        required: false,
        trim: true
    },
    fotoPrincipal: {
        type: String,
        required: false,
        trim: true
    },
    fotoSecundaria: {
        type: String,
        required: false,
        trim: true
    },
    estado: {
        type: Number,
        required: false,
        trim: true
    },
    destacado: {
        type: Number,
        required: false,
        trim: true
    },
    precioOferta: {
        type: Number,
        required: false,
        trim: true
    },
    precioReal: {
        type: Number,
        required: false,
        trim: true
    },
    estado: {
        type: String,
        required: false,
        trim: true
    },
    galeria: [
        {
            type: String,
            required: false,
            trim: true
        }
    ],
    keywords: {
        type: String,
        required: false,
        trim: true
    },
    categoriaSlug: {
        type: String,
        required: false,
        trim: true
    },
    Categorias: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Categoria'
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
    sucursales: [
        {
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref: 'Sucursal'
            
        }
        
    ],
    creation: {
        type: Date,
        default: Date.now()
    }
});
ProductosSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Producto', ProductosSchema);