const mediaControl = require('./imageModal');

const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');
require('dotenv').config();
const cloudinary = require("cloudinary");

// this is executed when the user accesses their dashboard.  The dashboard page will be loaded with all of their posts rendered
router.get('/', withAuth, async (req, res) => {
  try {

    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] }
    });

    const user = userData.get({ plain: true });

    user.profile_picture = await cloudinary.url(user.profile_picture, { transformation: [
      {gravity: "face", aspect_ratio: "1.0", width: 150, crop: "fill"},
      {radius: "max"}
      ] })

    // Find the logged in user based on the session ID
    const userPostData = await Post.findAll({
      where: {
        user_id: req.session.user_id,
      },
      attributes: ['id', 'post_title', 'post_content', 'media', 'date_created'],
      include: [{
        model: User,
        attributes: ['first_name', 'last_name', 'date_of_birth', 'profile_picture', 'username'],
      },
      {  // We don't need comment
        model: Comment,
        attributes: ['id', 'comment_content', 'date_created', 'post_id', 'user_id'],
      }
      ],
      order:[
        ['date_created','DESC' ]
      ]

    })

   
    const posts = userPostData.map((post) => post.get({ plain: true }));

    console.log('posts: ', posts);
    for (let i = 0; i < posts.length; i++) {
      console.log('public_id: ', posts[i].media);

      if (posts[i].media) {

        mediaControl.mediaParse(posts[i]);       
      
      }
    }

    res.render('dashboard', {
      posts, //posts.media is array
      user,
      // logged_in: true  
      logged_in: req.session.logged_in
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// renders a new post form when the user clicks on create post from their dashboard.
router.get('/new-post', withAuth, (req, res) => {
  res.render('new-post', {
    // logged_in: true
    logged_in: req.session.logged_in
  })
})



module.exports = router;