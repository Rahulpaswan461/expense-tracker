const JWT = require("jsonwebtoken")

function createTokenForAuthenticateUser(user){
    const payload = {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
    }

    return JWT.sign(payload,process.env.SECRET,{expiresIn:'2h'})
}

function verifyToken(token){
    if(!token){
        return res.status(400).json({error:"Invalid token"})
    }

    return JWT.verify(token,SECRET)
}

module.exports = {
    createTokenForAuthenticateUser,
    verifyToken
}