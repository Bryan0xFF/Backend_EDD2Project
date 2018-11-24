const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


const User = require('../models/user');
const checkAuth = require('../routes/checkAuth');
router.post('/signup', (req, res) => {

    User.find({username: req.body.username})
    .exec()
    .then(user => {
        if(user.length >= 1){
                        
            console.log(message);
            return res.status(409).json({
                message: 'mail exist'

            });


        }else{
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                        
                    res.status(500).json({
                        error: err
                    });

                    console.log(error);
                    
                }else{
            
                    const user = new User({
                        _id: new mongoose.Types.ObjectId,
                        nombre: req.body.nombre,
                        email: req.body.email,
                        username: req.body.username,
                        password: hash
                    })
        
                    user.save().then(result => {
                        console.log(result);
                        res.status(201).json({
                            message: 'user created',
                            user: user
                        });
        
                    })
                    .catch(err => {
                        res.status(500).json({
                            error: err
                        });
                    })
                }
            
            })
        }
    })
    .catch(err =>{
        error: err
    });
    
});

router.post('/login', (req, res) => {

    User.find({email: req.body.email})
    .exec()
    .then(user => {

        if (user.length < 1) {
            return res.status(401).json({
                message: 'Auth failed'
            });
        
        }


        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err) {
                return res.status(401).json({
                    message: 'Autentaci\'on fallida'
                });
            }
            if(result){
                
                const token = jwt.sign({
                    email: user[0].email,
                    userId: user[0]._id,
                    username: user[0].username

                }, "pancho-villa=nunca-reprobo-termodinamica",
                {
                    expiresIn: "1h"
                });
                return res.status(200).json({
                    token: token
                });
            }

             res.status(401).json({
                message: 'Autentaci\'on fallida'
            });
        } )
    })
    .catch(err => {

        res.status(500).json({
            error: err
        });
    });
});

router.get('/obtain', checkAuth, (req, res) => {

    User.find()
    .exec()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });

});

router.post('/single', (req, res) => {

    User.findOne({email: req.body.email})
    .select('nombre email username password')
    .exec()
    .then(user =>{
        res.status(200).json(user)
    })
    .catch(err => {
        console.log(err);
            error: err
        
    });

});




module.exports = router;