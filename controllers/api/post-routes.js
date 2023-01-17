const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth');
const { format_date } = require('../../utils/helpers');

router.get('/', (req, res) => {
    console.log('GET request received!');
});

// Create Post in the back end after user submits on the front end
router.post('/', async (req, res) => {
  try {
    const newPostData = await Post.create({
        post_title: req.body.title,
        post_content: req.body.content,
        user_id: req.session.user_id
    })
    res.json(newPostData);
  } catch (err) {
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
router.get('/edit-post/:id', async (req, res) => {
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