const mongoose = require('mongoose');
mongoose.Promise= global.Promise;
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');



let usernameLengthChecker = (username) => {
    if(!username){
        return false;
    } else{
        if(username.length < 3 || username.length > 15 ){
            return false;
        } else {
        return true;
    }
    } 
};

let validUsername = (username) => {
    if (!username) {
        return false;
    } else {
        const regExp = new RegExp (/^[a-zA-Z0-9]+$/);
        return regExp.test(username);
    }
};

const usernameValidators = [
    {
        validator : usernameLengthChecker,
        message : 'La longueur du pseudo doit être comprise entre 3 et 15 caractères',
    },
    {
        validator: validUsername,
        message: 'Le pseudo ne doit pas comprendre des caractères spéciaux'
    }
]

let emailLengthChecker = (email) => {
    if(!email){
        return false;
    } else{
        if(email.length < 5 || email.length > 30 ){
            return false;
        } else {
        return true;
    }
    } 
};


let validEmailChecker = (email) => {
    if(!email) {
        return false;
    } else {
        const regExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        return regExp.test(email);
    }
};


const emailValidators = [
    {
        validator : emailLengthChecker,
        message : 'La longueur de l email doit être comprise entre 5 et 30 caractères',
    },
    {
        validator: validEmailChecker,
        message: 'Doit être un email validé'
    }
]

let passwordLengthChecker = (password) => {
    if(!password) {
        return false;
    } else {
        if(password.length <8 || password.length >35) {
            return false;
        } else {
            return true;
        }
    }
};

/*let validPassword = (password) => {
    if(!password) {
        return false;
    } else {
        const regExp = new RegExp (/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[\d])(?=.*?[\W]).{8,35}$/);
         return regExp.test(password);
    }
};*/

const passwordValidators = [
    {
        validator : passwordLengthChecker,
        message : 'La longueur de mot de passe doit être comprise entre 8 et 35 caractères',
    }
    /*{
        validator: validPassword,
        message: 'Le mot de passe doit avoir au moins un caractère spécial, majuscule , miniscule et un chiffre'
    }*/
]





const userSchema = new Schema({
    email : { type: String, required: true, unique: true, lowercase: true, validate: emailValidators },
    username: {type: String, required: true, unique: true, lowercase: true, validate: usernameValidators },
    password: {type: String, required: true, validate: passwordValidators}

});

//crypter le mot de passe
userSchema.pre('save', function (next){
    if (!this.isModified('password'))
        return next();

    bcrypt.hash(this.password, null, null, (err, hash) =>{
        if(err) return next(err);
        this.password= hash;
        next();
    });
});

//decrypter
userSchema.methods.comparePassword = function(password) {
    return bcrypt.compareSync(password, this.password);

};

module.exports = mongoose.model('User', userSchema);