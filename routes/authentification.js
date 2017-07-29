const User = require('../models/user');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
module.exports = (router) => {
    router.post('/register', (req, res) => {
        if (!req.body.username) {
            res.json({ success: false, message: 'Rempli le champ pseudo correctement' });
        }
        else {
            if (!req.body.email) {
                res.json({ success: false, message: 'Rempli le champ email correctement' });
            }
            else {
                if (!req.body.password) {
                    res.json({ success: false, message: 'Rempli le champ mot de passe correctement' });
                }
                else {
                    let user = new User({
                        email: req.body.email.toLowerCase(),
                        username: req.body.username.toLowerCase(),
                        password: req.body.password
                    });
                    user.save((err) => {
                        if (err) {
                            if (err.code == 11000) {
                                res.json({ success: false, message: 'Pseudo ou email existe déja!' });
                            }
                            else {
                                if (err.errors) {
                                    if (err.errors.email) {
                                        res.json({ success: false, message: err.errors.email.message });
                                    } else {
                                        if (err.errors.username) {
                                            res.json({ success: false, message: err.errors.username.message });
                                        } else {
                                            if (err.errors.password) {
                                                res.json({ success: false, message: err.errors.password.message });
                                            } else {
                                                res.json({ success: false, message: err });
                                            }
                                        }
                                    }

                                } else {
                                    res.json({ success: false, message: 'Informations non enregistrés, Veuillez re-essayer' })
                                }
                            }
                        } else {
                            res.json({ success: true, message: 'Informations enregistrés!' })
                        }
                    });

                    console.log(req.body.username);
                    console.log(req.body.email);
                    console.log(req.body.password);
                }
            }
        }

    });
    //Vérifier si le pseudo existe déja 
    router.get('/checkUsername/:username', (req, res) => {

        if (!req.params.username) {
            res.json({ success: false, message: 'Il faut entrer un pseudo' });
        } else {

            User.findOne({ username: req.params.username }, (err, user) => {

                if (err) {
                    res.json({ success: false, message: err });
                } else {

                    if (user) {
                        res.json({ success: false, message: 'Pseudo existe déja' });
                    } else {
                        res.json({ success: true, message: 'Pseudo valable' });
                    }
                }
            });
        }
    });

    //Vérifier si l'email existe déja 
    router.get('/checkEmail/:email', (req, res) => {

        if (!req.params.email) {
            res.json({ success: false, message: 'Il faut entrer un email' });
        } else {

            User.findOne({ email: req.params.email }, (err, user) => {
                if (err) {
                    res.json({ success: false, message: err });
                } else {

                    if (user) {
                        res.json({ success: false, message: 'Email existe déja' });
                    } else {
                        res.json({ success: true, message: 'Email valable' });
                    }
                }
            });
        }
    });

    // Login
    router.post('/login', function (req, res) {
        if (!req.body.username) {
            res.json({ success: false, message: 'Il faut remplir le champ de Pseudo' });
        } else {
            if (!req.body.password) {
                res.json({ success: false, message: 'Il faut remplir le champ de mot de passe' });
            } else { 
                User.findOne({ username: req.body.username.toLowerCase() }, (err, user) => {
                    // Vérifier s'il y a des erreurs
                    if (err) {
                        res.json({ success: false, message: err }); // Retourner erreur
                    } else {
                        //Vérifier si le pseudo existe
                        if (!user) {
                            res.json({ success: false, message: 'Ce pseudo n\'existe pas ' }); // Retourner erreur
                        } else {
                           const validPassword = user.comparePassword(req.body.password); // Comparaison des mot de passes
                            if (!validPassword) {
                                res.json({ success: false, message: 'Password invalid' }); // Retourner erreur
                            } else {
                                const token = jwt.sign({ userId: user._id }, config.secret, { expiresIn: '24h' }); // Creer un jeton jwt pour l'etudiant
                                res.json({ success: true, message: 'Success!', token: token, user: { username: user.username } }); // Retourner success 
                            }
                        }
                    }
                });
            }
        }
    });



    /* MIDDLEWARE -Pour saisir le jeton de l'utilisateur depuis 'header' */
    router.use(function (req, res, next) {
        const token = req.headers['authorization']; // Créer le jeton trouvé dans 'headers'
        // Vérifier si le jeton existe dans le 'headers'
        if (!token) {
            res.json({ success: false, message: 'Pas de jeton' }); // Retourner erreur
        } else {
            // Vérifier si le jeton est valide
            jwt.verify(token, config.secret, (err, decoded) => {
                // Vérifier si l'erreur est expiré ou invalide
                if (err) {
                    res.json({ success: false, message: 'Jeton invalide: ' + err }); // Retourner erreur
                } else {
                    req.decoded = decoded; //Creation d'un variable globale pour l'utiliser n'importe où
                    next(); // Quitter le middleware
                }
            });
        }
    });

    //Profile
    router.get('/profile', (req, res) => {
        // Recherche de l'utilisateur 
        User.findOne({ _id: req.decoded.userId }).select('username email').exec(function(err, user){
            // Vérifier s'il y'a des erreurs
            if (err) {
                res.json({ success: false, message: err }); // Retourner erreur
            } else {
                // Vérifier si 'il y'a de user dans la BD
                if (!user) {
                    res.json({ success: false, message: 'Cet utilisateur n\'existe pas ' }); // Retourner Erreur
                } else {
                    res.json({ success: true, user: user }); // Retourner succés
                }
            }
        });
    });


    return router;
}