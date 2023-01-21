const router = require('express').Router();
const { Post, User, Comment } = require('../../models');
const { withAuth, logRouteInfo } = require('../../utils/auth');
require('dotenv').config();
const cloudinary = require("cloudinary");

// this is executed when the user accesses their dashboard.  The dashboard page will be loaded with all of their posts rendered
router.get('/', logRouteInfo, withAuth, async (req, res) => {
  console.log('***Dashboard Session User ID: *****************')
  console.log('req.user: ', req.user);
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] }
    });

    const user = userData.get({ plain: true });

    user.profile_picture = await cloudinary.url(user.profile_picture, { transformation: { width: 100, crop: "scale" } })

    // Find the logged in user based on the session ID
    const userPostData = await Post.findAll({
      where: {
        user_id: req.user.id,
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

        // id1,id2,id2 => ['id1','id2','id3']
        const public_id_list = posts[i].media.split(',');
        const mediaUrl = [];

        for (let i = 0; i < public_id_list.length; i++) {
          // const info = await cloudinary.v2.api.resource(public_id_list[i]);
          // console.log("media info: ",info);
          const mediaFile = public_id_list[i].split('?');
          const public_id = mediaFile[0];
          let resource_type;
          if(mediaFile.length >= 2){
            resource_type = mediaFile[1];
          }

          if(resource_type === 'video'){
            const video = await cloudinary.video(public_id, {loop:true, controls:true,
              transformation:
                 {width: 300, quality: 70, crop: "scale"},
              fallback_content:"Your browser does not support HTML5 video tags."});
            // let edited = video.split(' '); 
            // edited.splice(1,0,'controls');
            // const final = edited.join(' ');         
            // console.log('final: ', final);

            const media = {
              url: video,
              video: true
            };
            mediaUrl.push(media);  
          }else if(resource_type === 'raw'){
            const raw = public_id.split('!')[1];
            const media = {
              url: raw,
              raw: true
            }
            mediaUrl.push(media);
          }else {
            const image = await cloudinary.url(public_id, { transformation: { width: 300, crop: "scale" } });
            const media = {
              url: image,
              image: true
            }
            mediaUrl.push(media);
          }       

          // cloudinary.video()
          //mediaUrl = ['link1','link2','link3']
        }

        posts[i].media = mediaUrl;
        console.log('new link: ', posts[i].media);
      }
    }

    res.render('dashboard', {
      posts, //posts.media is array
      user,
      // logged_in: true  
      // logged_in: req.session.logged_in  (note: replaced this line with the below after Passport implementation)
      logged_in: req.user ? true : false
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
    logged_in: req.user ? true : false
  })
})



module.exports = router;