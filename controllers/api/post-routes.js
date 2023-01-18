const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth');
const { format_date } = require('../../utils/helpers');
// for cloudinary use
require('dotenv').config();
const cloudinary = require("cloudinary");
const multer = require("multer");
const upload = multer({ dest: "uploads/"});
// const upload = multer();

router.get('/', (req, res) => {
    console.log('GET request received!');
});

// Create Post in the back end after user submits on the front end
router.post('/', withAuth, upload.single('file'), async (req, res) => {
  try {
    console.log('body: ',req.body);
    console.log('file: ',req.file) ;

    const file = req.file.path;
    console.log('file path: ', file);
    const result = await cloudinary.uploader.upload(file, {
      resource_type: 'auto',
      folder: 'community-chat'
    });

    console.log('result: ', result);

    const media_id = result.public_id;

    const newPostData = await Post.create({
        post_title: req.body.title,
        post_content: req.body.content,
        media: media_id,
        user_id: req.session.user_id
    })
    res.status(200).json(newPostData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create profile
router.put('/profile', withAuth, upload.single('file'), async (req, res) => {
  try {
    console.log('body: ',req.body);
    console.log('file: ',req.file) ;

    const file = req.file.path;
    console.log('file path: ', file);
    const result = await cloudinary.uploader.upload(file, {
      resource_type: 'auto',
      folder: 'community-chat/profile'
    });

    console.log('result: ', result);

    const profile_picture = result.public_id;

    const newUserData = await User.update(
      {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        date_of_birth: req.body.date_of_birth,
        profile_picture: profile_picture,
      },
      {
        where: {
          id: req.session.user_id
        }
      }
    )
    console.log("newUserData: ",newUserData);
    res.status(200).json(newUserData);    
    // res.status(200).json('');  
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// Delete a single post by id
router.delete('/:id', withAuth, async (req, res) => {
  await Post.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedpost) => {
      res.json(deletedpost);
    })
    .catch((err) => res.json(err));
});

// finds the post the user requested to edit and displays it in an editable format
router.get('/edit-post/:id', withAuth, async (req, res) => {
  console.log("Post ID:" + req.params.id);
  post_id = req.params.id;
  try {
    // Find post to be edited based on the post ID
    const editPostData = await Post.findOne({
      where: {
        id: post_id,
      },
      attributes: ['id', 'post_title', 'post_content', 'date_created'],
        include: [
          { 
            model: User,
            attributes: ['username']
          },
        ]
    })
    const post = editPostData.get({ plain: true });
    res.render('edit-post', {post});
    
  } catch (err) {
    res.status(500).json(err);
  }
})

// executed after a user submits their edited post
router.put('/:id', withAuth, async (req, res) => {
  try { 
    await Post.update(
      {
        post_title: req.body.post_title,
        post_content: req.body.post_content,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    )
    res.json(editedPost);
  } catch (err) {
    res.json(err)};
});

module.exports = router;