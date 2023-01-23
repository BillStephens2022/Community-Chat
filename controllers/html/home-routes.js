const mediaControl = require('../imageModal');

const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const { withAuth, logRouteInfo } = require('../../utils/auth');
require('dotenv').config();
const cloudinary = require("cloudinary");

// gets all posts (from all users) for display on the homepage
router.get('/', logRouteInfo, (req, res) => {
  res.render('welcome', { logged_in: req.user ? true : false });
})

router.get('/home', logRouteInfo, async (req, res) => {
  try {
    const blogPostData = await Post.findAll({
      attributes: ['id', 'post_title', 'post_content', 'user_id', 'media', 'date_created'],
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Comment,
          attributes: ['id', 'comment_content', 'post_id', 'user_id', 'date_created'],
        },
      ],
      order: [
        ['date_created', 'DESC']
      ]
    })
    const posts = blogPostData.map((post) => post.get({ plain: true }));

    console.log('posts: ', posts);
    // for (let i = 0; i < posts.length; i++) {
    //   console.log('public_id: ', posts[i].media);
    //   posts[i].media = await cloudinary.url(posts[i].media, { transformation: { width: 300, crop: "scale" } })
    //   console.log('new link: ', posts[i].media);
    // }

    for (let i = 0; i < posts.length; i++) {
      console.log('public_id: ', posts[i].media);

      if (posts[i].media) {
        mediaControl.mediaParse(posts[i]);        
      }
    }

    res.render('homepage', {
      posts,
      // logged_in: req.session.logged_in, (note: replaced this line of code with line below after Passport integration)
      logged_in: req.user ? true : false,
      // sends over the current 'countVisit' session variable to be rendered
      countVisit: req.session.countVisit,
    })
    req.session.save(() => {
      // sets up a session variable to count the number of times we visit the homepage
      if (req.session.countVisit) {
        // If the 'countVisit' session variable already exists, increment it by 1
        req.session.countVisit++;
      } else {
        // If the 'countVisit' session variable doesn't exist, set it to 1
        req.session.countVisit = 1;
      }
    })
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  };
});

// profile
router.get('/profile', logRouteInfo, withAuth, (req, res) => {
  // if (!req.session.sign_up) {
  //   res.redirect('/dashboard');
  //   return;
  // }
  res.render('profile', {
    // logged_in: req.session.logged_in  (note: replaced this line of code with line below after Passport integration)
    logged_in: req.user ? true : false
  });
});


// profile edit
router.get('/profile/edit/',withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.user.id, {
      attributes: ['first_name', 'last_name', 'date_of_birth', 'profile_picture'],
    });

    const user = userData.get({ plain: true });
    console.log("user", user);

    const url = await cloudinary.url(user.profile_picture, { transformation: { width: 200, crop: "scale" } });
    
    res.render('profile-edit', {
      ...user,      
      url,
      logged_in: req.user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.get('/chatroom', (req, res) => {
  res.render('chatroom', {
    // logged_in: req.session.logged_in  (note: replaced this line of code with line below after Passport integration)
    logged_in: req.user ? true : false
  });
});


// directs user to login page when they choose to log in
router.get('/login', (req, res) => {
  if (req.user) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

// directs user to register page if user is not logged in, otherwise user will be brought to dashboard
router.get('/register', (req, res) => {
  if (req.user) {
    res.redirect('/dashboard');
    return;
  }
  res.render('register');
});

// renders the single-post page when a user clicks on a single post on the homepage
router.get('/post/:id', logRouteInfo, withAuth, async (req, res) => {

  try {
    // Find the logged in user based on the post ID
    const singlePostData = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'post_title', 'post_content', 'media', 'date_created'],
      include: [
        {
          model: Comment,
          attributes: ['id', 'comment_content', 'post_id', 'user_id', 'date_created'],
          include: {
            model: User,
            attributes: ['username']
          }
        },
        {
          model: User,
          attributes: ['username']
        }
      ]
    })
    const post = singlePostData.get({ plain: true });
    console.log('post: ', post);


    console.log('public_id: ', post.media);

    if (post.media) {
      mediaControl.mediaParse(post);
    }

    res.render('singlePost', { post, logged_in: req.user ? true : false });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// directs user to login page when they choose to log in
router.get('/login', logRouteInfo, (req, res) => {
  if (req.user) {
    res.redirect('/dashboard');
    return;
  }
  res.render('login');
});

// directs user to register page if user is not logged in, otherwise user will be brought to dashboard
router.get('/register', logRouteInfo, (req, res) => {
  if (req.user) {
    res.redirect('/dashboard');
    return;
  }
  res.render('register');
});

router.get('/logout', logRouteInfo, (req, res) => {
  if (req.user) {
      req.logout();
      req.user = null;
  }
  res.redirect('/');
});

module.exports = router;