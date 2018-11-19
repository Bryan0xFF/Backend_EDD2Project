const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Message = require('../models/message');
const checkAuth = require('../routes/checkAuth');

/*

este middleware envia un mensaje con todos sus campos requerido a la DB.
campos:
usuario_emisor,
usuario_receptor,
mensaje
para escuchar mensajes, se debe ir a /receive

*/
router.post('/send', checkAuth, (req, res, next) => {

    const message = new Message({

        usuario_emisor: req.body.usuario_emisor,
        usuario_receptor: req.body.usuario_receptor,
        mensaje: req.body.mensaje

    });

    message
    .save()
    .then(result => {
        res.status(201).json({
            message: 'mensaje enviado correctamente',
            result: result
        });
    })
    .catch(err => {
        error: err
    });

});


/*

este GET, recibe como parametro en el body el usuario_emisor y el token para validacion
y retorna un array con todas las coincidencias de mensaje

*/
router.get('/receive', checkAuth, (req, res) => {

    Message.find()
    .select('usuario_emisor usuario_receptor mensaje')
    .exec()
    .then(messages => {

        const userMessages = {
            
            messagesArray: messages.map(message => {

                if (req.body.usuario_emisor === message.usuario_emisor || req.body.usuario_emisor === message.usuario_receptor) {

                    return{
                        usuario_emisor: message.usuario_emisor,
                        usuario_receptor: message.usuario_receptor,
                        mensaje: message.mensaje
                    }  
                }
            })
        
        };

        res.status(200).json({
                userMessages
        });

    })
    .catch(err => {
        error: err
    });
});

/*
 no tomar en cuenta, es solo para pruebas
*/ 
router.get('/', checkAuth, (req, res) => {

    Message.find()
    .exec()
    .then(message => {
        res.status(200).json({
            message
        });
    })
    .catch(err => {
        error: err
    });

});

module.exports = router;