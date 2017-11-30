var jwt = require('jsonwebtoken');
var _ = require('lodash');

module.exports = {
    httpsRedirect: function(req, res, next) {
        if (process.env.NODE_ENV === 'production') {
            if (req.headers['x-forwarded-proto'] != 'https') {
                return res.redirect('https://' + req.headers.host + req.url);
            } else {
                return next();
            }
        } else {
            return next();
        }
    },

    requireAuth: function(req, res, next) {
        var body = _.pick(req.body, 'token');
    
        var token = body.token || req.cookies.token;
    
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, function (error, decoded) {
                if (error) {
                    return res.status(403).render('error', {
                        title: '403',
                        errorCode: 403,
                        errorMessage: 'Access Denied'
                    });
                } else {
                    req.user = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).render('error', {
                title: '403',
                errorCode: 403,
                errorMessage: 'Access Denied'
            });
        }
    },

    getUser: function(token) {
        var user;

        if (token) {
            user = jwt.verify(token, process.env.TOKEN_SECRET)
        }

        return user;
    }
}