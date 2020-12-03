/**
 * 
 * @param {Request} req 
 */
const checkAuth = req => {
    if (!req.auth) {
        throw new Error('Unauthenticated');
    }
};

module.exports = {
    checkAuth
};
