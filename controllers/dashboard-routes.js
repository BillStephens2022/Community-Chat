const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

// this is executed when the user accesses their dashboard.  The dashboard page will be loaded with all of their posts rendered
router.get('/', withAuth, async (req, res) => {
    try {
      // Find the logged in user based on the session ID
      const userPostData = await Post.findAll({
        where: {
            user_id: req.session.user_id,
        },
        attributes: ['id', 'post_title', 'post_content', 'date_created'],
        include: [{ 
            model: User,
            attributes: ['username'],
          },
          {
            model: Comment,
            attributes: ['id', 'comment_content', 'date_created', 'post_id', 'user_id'],
          }
        ]

    })
      const posts = userPostData.map((post) => post.get({ plain: true }));

      res.render('dashboard', {
        posts,
        logged_in: true
      });
    } catch (err) {
      res.status(500).json(err);
    }
});

// renders a new post form when the user clicks on create post from their dashboard.
router.get('/new-post', (req, res) => {
    res.render('new-post', {
        loggedIn: true
    })
})



  module.exports = router;