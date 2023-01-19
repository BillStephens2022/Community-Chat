const router = require('express').Router();
const { User } = require('../../models');

/* creates new user in the tech_blog database after new registration and updates their 
status to 'logged in' which will allow themto perform certain tasks */
// router.post('/', async (req, res) => {
//   try {
//     const dbUserData = await User.create({
//       username: req.body.username,
//       email: req.body.email,
//       password: req.body.password,
//     });

//     req.session.save(() => {
//       req.session.logged_in = true;
//       req.session.sign_up = true;
//       req.session.user_id = dbUserData.id;

//       res.status(200).json(dbUserData);
//     });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json(err);
//   }
// });


// checks login credentials submitted by user
// router.post('/login', async (req, res) => {
//     try {
//       const userData = await User.findOne({ where: { email: req.body.email } });
  
//       if (!userData) {
//         res
//           .status(400)
//           .json({ message: 'Incorrect email or password, please try again' });
//         return;
//       }
  
//       const validPassword = await userData.checkPassword(req.body.password);
  
//       if (!validPassword) {
//         res
//           .status(400)
//           .json({ message: 'Incorrect email or password, please try again' });
//         return;
//       }
  
//       req.session.save(() => {
//         req.session.user_id = userData.id;
//         req.session.logged_in = true;
        
//         res.json({ user: userData, message: 'You are now logged in!' });
//       })

//     } catch (err) {
//       res.status(400).json(err);
//     }
//   });
  
  // logs the user out and destroys their log in session
  router.post('/logout', (req, res) => {
    if (req.session.logged_in) {
      req.session.destroy(() => {
        res.status(204).end();
      });
    } else {
      res.status(404).end();
    }
  });

  module.exports = router;