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

//recordar ponerle el checkAuth
router.post('/send', (req, res, next) => {

    const message = new Message({

        usuario_emisor: req.body.usuario_emisor,
        usuario_receptor: req.body.usuario_receptor,
        mensaje: req.body.mensaje,
        esArchivo: req.body.esArchivo,
        nombreArchivo: req.body.nombreArchivo
    });
    console.log(message);
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
        console.log(err);
    });

});


/*

este GET, recibe como parametro en el body el usuario_emisor y el token para validacion
y retorna un array con todas las coincidencias de mensaje

*/
router.get('/receive', checkAuth, (req, res) => {

    Message.find()
    .select('usuario_emisor usuario_receptor mensaje esArchivo nombreArchivo -_id')
    .exec()
    .then(messages => {

        res.status(200).json(messages);

        /*        
        res.status(200).json({
            
        count: messages.length,
        messageArray: messages.map(message => {

            return {
                usuario_emisor: message.usuario_emisor,
                usuario_receptor: message.usuario_receptor,
                mensaje: message.mensaje,
                esArchivo: message.esArchivo,
                nombreArchivo: message.nombreArchivo
            }

        })
     });
     */
        console.log(messages);
        
    })
    .catch(err => {
        error: err
        console.log(err);
    });
});

/*
 no tomar en cuenta, es solo para pruebas
*/ 
router.get('/', (req, res) => {

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