import jwt from 'jsonwebtoken'

export const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.locals.isLoggedIn = false; 
        //res.status(401).send({ error: "Unauthorized" });
      } else {
        res.locals.isLoggedIn = true;
      }
      next()
    });
  };

  export const isLoggedInHeader = (pageName) => (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.render(pageName, { isLoggedIn: false });
      } else {
        res.render(pageName, { isLoggedIn: true });
      }
    });

  };