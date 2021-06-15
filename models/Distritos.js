const mongoose = require('mongoose');

const DistritoSchema = mongoose.Schema({
    
    DistCodi: {
        type: String,
        required: false,
        trim: true
    },
    DistNom: {
        type: String,
        required: false,
        trim: true
    },
    ProvCodi: {
        type: Number,
        required: false,
        trim: true
    }
});
module.exports = mongoose.model('Distrito', DistritoSchema);