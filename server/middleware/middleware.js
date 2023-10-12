import jwt from 'jsonwebtoken'

export const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.locals.isLoggedIn = false; 
      } else {
        res.locals.isLoggedIn = true;
      }
      next()
    });
  };