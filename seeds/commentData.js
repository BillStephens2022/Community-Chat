const { Comment } = require('../models');

const commentData = [
    {
        comment_content: "Totally agree! I keep missing that step!",
        post_id: 1,
        user_id: 2,
    },
    {
        comment_content: "No Way! I prefer Materialize CSS...",
        post_id: 2,
        user_id: 3,
    },
    {
        comment_content: "Yo! Help me out, I don't understand the flow or file structure at all...",
        post_id: 3,
        user_id: 4,
    },
    {
        comment_content: "I can help you out with that, loads of experience with tracking people, just ask Butch Coolidge",
        post_id: 4,
        user_id: 1,
    },
];

const seedComments = () => Comment.bulkCreate(commentData);

module.exports = seedComments;