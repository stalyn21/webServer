const jwt = require('jsonwebtoken');
const CONFIG = require('../config');

module.exports = async function (req, res, next) {
    if(req.path != '/users/login' && req.path != '/users/register'){
        if(req.headers.authorization){
            const token = await req.headers.authorization.split(' ')[1];
            await jwt.verify(token,CONFIG.secret, async function(error,decoded){
                if(error) return res.status(401).send({message: 'Add authentication .......',error});
                if(req.method != 'GET'){
                    if(decoded.permissionLevel == 1) next();
                    else {
                        if(req.method == 'PATCH') next();
                        else {res.status(200).send({message: 'Your request is being processed .......'});           
                        console.log('The user has made a request .......');    
                        }
                    } 
                    
                }            
                else{
                    next();
                }
            });
        }else res.status(403).send({message: 'You do not have permission to stay here .......'});
    }else next();
}