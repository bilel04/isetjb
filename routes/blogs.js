const User = require('../models/user');
const Blog = require('../models/blog');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

module.exports = (router) => {

    router.post('/newBlog', (req, res) => {

        if (!req.body.title) {
            res.json({ success: false, message: 'Il faut remplir le champ titre' });
        } else {

            if (!req.body.body) {
                res.json({ success: false, message: 'Il faut remplir le champ contenu' });
            } else {
            
                if (!req.body.createdBy) {
                    res.json({ success: false, message: 'Il faut remplir le champ créé par' });
                } else {

                    const blog = new Blog({
                        title: req.body.title,
                        body: req.body.body,
                        createdBy: req.body.createdBy
                    });

                    blog.save((err) => {

                        if (err) {

                            if (err.errors) {

                                if (err.errors.title) {
                                    res.json({ success: false, message: err.errors.title.message });
                                } else {

                                    if (err.errors.body) {
                                        res.json({ success: false, message: err.errors.body.message });
                                    } else {
                                        res.json({ success: false, message: err });
                                    }
                                }
                            } else {
                                res.json({ success: false, message: err });
                            }
                        } else {
                            res.json({ success: true, message: 'Article enregistré!' });
                        }
                    });
                }
            }
        }
    });

    router.get('/allBlogs', (req, res) => {
        Blog.find({}, (err,blogs) => {
            if(err) {
            res.json({ success : false, message: err});
            } else {
                if(!blogs){
                    res.json({ success: false, message: 'Il n y\'a pas d\'articles '});
                } else {
                    res.json({ success: true, blogs: blogs});
                }
            }
        }).sort({ '_id': -1});
    });

    return router;
};
