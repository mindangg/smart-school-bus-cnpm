const jwt = require('jsonwebtoken')

export const requireAuth = (req, res, next) => {
    const token = req.cookies.token
    if (!token) {
        res.status(401).json({ message: 'No token, unauthorized' })
        return
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET)
        req.user_id = decoded.id
        console.log('Decoded payload:', decoded)
        next()
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' })
    }
}
