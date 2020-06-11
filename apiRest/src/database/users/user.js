require ('../../conection')
const Usr = require('../../models/user/users');

async function main(){
    const user = new Usr({
        usr : {name : 'Stalyn', lastname : 'Chancay'},
        email : 'stalyn.chancay@yachaytech.edu.ec',
        pwd : 'apiRest',   
        permissionLevel: 1 
    })
    const userSaved = await user.save(); //este roceso se va a demorar un poco
    return userSaved //to reemplace by userSaved 
}

main()
    .then(userSaved => console.log('Saved user succefull.....',userSaved))
    .catch(err => console.log('Saved user falled.....',err))
