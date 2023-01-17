const { Post } = require('../models');

const postData = [
    {
        post_title: "Sequelize",
        post_content: "Forgetting to seed your database is pretty far from OK.",
        user_id: 1,
    },
    {
        post_title: "CSS Frameworks",
        post_content: "I prefer Bootstrap to Materialize.  Just my personal opinion.",
        user_id: 2,
    },
    {
        post_title: "Handlebars",
        post_content: "Starting to get the hang of handlebars.  Let me know if you need any help figuring it out.",
        user_id: 3,
    },
    {
        post_title: "Session Cookies",
        post_content: "I need to track what people are doing on my site.  Help!",
        user_id: 4,
    },
];

const seedPosts = () => Post.bulkCreate(postData);

module.exports = seedPosts;