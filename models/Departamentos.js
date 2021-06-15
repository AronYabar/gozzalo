const mongoose = require('mongoose');

const DepartamentosSchema = mongoose.Schema({
    
    DeparCodi: {
        type: String,
        required: false,
        trim: true
    },
    DeparNom: {
        type: String,
        required: false,
        trim: true
    }
});
module.exports = mongoose.model('Departamento', DepartamentosSchema);