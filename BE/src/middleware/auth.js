const auth = (req, res, next) => {
    console.log(req.body)
    if (req.body.token == 'ABCD') {
        next()
    } else {
        res.status(401).json({ error: 'Unauthorized' })
    }
};

module.exports = auth;