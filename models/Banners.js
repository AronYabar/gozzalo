const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const BannerSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: false,
        trim: true
    },
    foto: {
        type: String,
        required: false,
        trim: true
    },
    url: {
        type: String,
        required: false,
        trim: true
    },
    creation: {
        type: Date,
        default: Date.now()
    }
});
module.exports = mongoose.model('Banner', BannerSchema,'banners');