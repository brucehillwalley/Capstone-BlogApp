"use strict"
/* -------------------------------------------------------
    NODEJS EXPRESS | CLARUSWAY FullStack Team
------------------------------------------------------- */
// Middleware: permissions

module.exports = {

    isLogin: (req, res, next) => {

        // Set Passive:
        // return next()

        // any User:
        if (req.user && req.user.isActive) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login.')
        }
    },

    isAdmin: (req, res, next) => {

        // Set Passive:
        // return next()
        
        // only Admin:
        if (req.user && req.user.isActive && req.user.isAdmin) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login and to be Admin.')
        }
    },

    /*-------------------------------------------------------*
    //? Author:
    isAuthor: (req, res, next) => {

        // Set Passive:
        return next()
        
        // only Admin or Author:
        if (req.user && req.user.isActive && (req.user.isAdmin || req.user.isAuthor)) {

            next()

        } else {

            res.errorStatusCode = 403
            throw new Error('NoPermission: You must login and to be Author.')
        }
    },
    /*-------------------------------------------------------*/

}