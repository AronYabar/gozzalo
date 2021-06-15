const mongoose = require('mongoose');

const ProvinciaSchema = mongoose.Schema({
    
    ProvCodi: {
        type: String,
        required: false,
        trim: true
    },
    ProvNom: {
        type: String,
        required: false,
        trim: true
    },
    DeparCodi: {
        type: Number,
        required: false,
        trim: true
    }
});
module.exports = mongoose.model('Provincia', ProvinciaSchema);