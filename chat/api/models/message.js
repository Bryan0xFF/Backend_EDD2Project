const mongoose = require('mongoose');

const MessageSchema = mongoose.Schema({

    usuario_emisor: {type: String, required: true},
    usuario_receptor: {type: String, required: true},
    mensaje: {type: String, required: true},

});

module.exports = mongoose.model('Message', MessageSchema);