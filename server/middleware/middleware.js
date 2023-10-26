import jwt from 'jsonwebtoken'

export const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.isLoggedIn = false; 
      } else {
        res.isLoggedIn = true;
      }
      next()
    });
  };