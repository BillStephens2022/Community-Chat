const mediaControl = require('../imageModal');

const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth');
const { format_date } = require('../../utils/helpers');
const fs = require('fs');
// for cloudinary use
require('dotenv').config();
const cloudinary = require("cloudinary");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
// const upload = multer();

router.get('/', (req, res) => {
  console.log('GET request received!');
});

// Create Post in the back end after user submits on the front end
// router.post('/', withAuth, upload.single('file'), async (req, res) => {
//   try {
//     console.log('body: ', req.body);
//     console.log('file: ', req.file);

//     if (req.file) {
//       const file = req.file.path;
//       console.log('file path: ', file);
//       const result = await cloudinary.uploader.upload(file, {
//         resource_type: 'auto',
//         folder: 'community-chat'
//       });

//       // delete the file
//       fs.unlinkSync(file);

//       console.log('result: ', result);

//       // storing cloudinary public_id to media_id
//       const media_id = result.public_id;

//       const newPostData = await Post.create({
//         post_title: req.body.title,
//         post_content: req.body.content,
//         media: media_id,
//         user_id: req.session.user_id
//       })
//       res.status(200).json(newPostData);
//     } else {
//       const newPostData = await Post.create({
//         post_title: req.body.title,
//         post_content: req.body.content,
//         user_id: req.session.user_id
//       })
//       res.status(200).json(newPostData);
//     }
//   } catch (err) {
//     console.error(err);
//     res.status(500).json(err);
//   }
// });

router.post('/', withAuth, async (req, res) => {
  try {
    console.log('body: ', req.body);

    const public_id_list = req.body.public_id_list;
    console.log('public_id_list: ', public_id_list);

    // storing cloudinary public_id to media_id
    // ['id1','id2','id3'] => id1,id2,id3
    const media = public_id_list.join();

    const newPostData = await Post.create({
      post_title: req.body.title,
      post_content: req.body.content,
      media: media,
      user_id: req.session.user_id
    })
    res.status(200).json(newPostData);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});




// Create profile
router.put('/profile', withAuth, upload.single('file'), async (req, res) => {
  try {
    console.log('body: ', req.body);
    console.log('file: ', req.file);

    if (req.file) {

      if(req.body.public_id){
        console.log('req.body.public_id: ',req.body.public_id);
        const delResult = await cloudinary.v2.uploader.destroy(req.body.public_id);
        console.log('Delete result: ', delResult);
      }

      const file = req.file.path;
      console.log('file path: ', file);
      const result = await cloudinary.uploader.upload(file, {
        resource_type: 'image',
        folder: 'community-chat/profile'
      });

      console.log('result: ', result);

      // delete the file
      fs.unlinkSync(file);

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
      console.log("newUserData: ", newUserData);
      res.status(200).json(newUserData);
    } else {
      const newUserData = await User.update(
        {
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          date_of_birth: req.body.date_of_birth,
        },
        {
          where: {
            id: req.session.user_id
          }
        }
      )
      console.log("newUserData: ", newUserData);
      res.status(200).json(newUserData);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// Delete a single post by id
router.delete('/:id', withAuth, async (req, res) => {
  try {

    const singlePostData = await Post.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['media']
    });

    const post = singlePostData.get({ plain: true });
    console.log('post: ', post);

    if (post.media) {

      const public_id_list = post.media.split(',');
      const mediaUrl = [];

      for (let i = 0; i < public_id_list.length; i++) {
        const mediaFile = public_id_list[i].split('?');
        const public_id = mediaFile[0];

        let resource_type;
        if (mediaFile.length >= 2) {
          resource_type = mediaFile[1];
        }

        if (resource_type === 'image') {
          console.log('public_id: ', public_id);
          const result = await cloudinary.v2.uploader.destroy(public_id);
          console.log('Delete result: ', result)
        } else if (resource_type === 'video') {
          console.log('public_id: ', public_id);
          const result = await cloudinary.v2.uploader.destroy(public_id, { resource_type: 'video' });
          console.log('Delete result: ', result)

        } else { // raw file
          const raw_public_id = public_id.split('!')[0];
          console.log('raw_public_id: ', raw_public_id);
          const result = await cloudinary.v2.uploader.destroy(raw_public_id, { resource_type: 'raw' });
          console.log('Delete result: ', result);
        }
      }
    }

    const deletedpost = await Post.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.json(deletedpost);

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

router.put('/media', withAuth, async (req, res) => {
  try {

    const public_id = req.body.public_id;
    const resource_type = req.body.resource_type;

    if (resource_type === 'image') {
      const result = await cloudinary.v2.uploader.destroy(public_id);
      console.log('Delete result: ', result)
    } else if (resource_type === 'video') {
      const result = await cloudinary.v2.uploader.destroy(public_id, { resource_type: 'video' });
      console.log('Delete result: ', result)
    } else {
      const result = await cloudinary.v2.uploader.destroy(public_id, { resource_type: 'raw' });
      console.log('Delete result: ', result);
    }

    const singlePostData = await Post.findOne({
      where: {
        id: req.body.id
      },
      attributes: ['media']
    });

    const post = singlePostData.get({ plain: true });
    console.log('post: ', post);

    // Delete selected media from the original media
    const public_id_list = post.media.split(',');

    let delete_index = -1;
    for (let i = 0; i < public_id_list.length; i++) {
      if(public_id_list[i].includes(public_id)){
        delete_index = i;
        break;
      }
    }

    public_id_list.splice(delete_index,1);

    const newMedia = public_id_list.join();

    const editedPost = await Post.update(
      {
        media: newMedia        
      },
      {
        where: {
          id: req.body.id
        },
      }
    )
 
    res.status(200).json(editedPost);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
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
      attributes: ['id', 'post_title', 'post_content', 'media', 'date_created'],
      include: [
        {
          model: User,
          attributes: ['username']
        },
      ]
    })
    const post = editPostData.get({ plain: true });

    if (post.media) {
      mediaControl.mediaParse(post, 100, 100, 20);            
    }

    res.render('edit-post', { post });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
})

// executed after a user submits their edited post
router.put('/:id', withAuth, async (req, res) => {
  try {
    const editedPost = await Post.update(
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
    console.error(err);
    res.json(err)
  };
});

module.exports = router;