const jwt = require('jsonwebtoken');

module.exports = (req, res, next) =>{

    try{
        const token =  req.body.token;
        console.log(token);

        const decoded = jwt.verify(token, "pancho-villa=nunca-reprobo-termodinamica");
        req.userData =  decoded;
        next();

    }catch(err){
        res.status(401).json({
            error: "Autenticacion fallida"
        });
    }
}