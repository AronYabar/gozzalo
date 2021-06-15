const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const EmpresasSchema = mongoose.Schema({
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
    ruc: {
        type: String,
        required: false,
        trim: true
    },
    email: {
        type: String,
        required: false,
        trim: true
    },
    telefono: {
        type: String,
        required: false,
        trim: true
    },
    nroInterbancario: {
        type: String,
        required: false,
        trim: true
    },
    estado: {
        type: String,
        required: false,
        trim: true
    },
    nroCuenta: {
        type: String,
        required: false,
        trim: true
    },
    cci: {
        type: String,
        required: false,
        trim: true
    },
    fotoPerfil: {
        type: String,
        required: false,
        trim: true
    },
    Bancos: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Banco'
    },
    creation: {
        type: Date,
        default: Date.now()
    }
});
EmpresasSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Empresa', EmpresasSchema);