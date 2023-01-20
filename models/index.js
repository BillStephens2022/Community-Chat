const User = require('./User');
const Post = require('./Post');
const Comment = require('./Comment');

// A User may make many Posts
User.hasMany(Post, {
  foreignKey: 'user_id',
  // When a User is deleted, delete the associated Posts.
  onDelete: 'CASCADE',
});

// A Post belongs to a user
Post.belongsTo(User, {
  foreignKey: 'user_id',
});

// A user can have many comments
User.hasMany(Comment, {
  foreignKey: 'user_id',
  // When we delete a User, make sure to also delete the associated comments.
  onDelete: 'CASCADE',
});
  
// A Comment belongs to a user
Comment.belongsTo(User, {
  foreignKey: 'user_id',
});

// A post can have many comments
Post.hasMany(Comment, {
  foreignKey: 'post_id',
  // When we delete a Post, make sure to also delete the associated comments.
  onDelete: 'CASCADE',
});

// A Comment belongs to a post
Comment.belongsTo(Post, {
  foreignKey: 'post_id',
});

// We package our two models and export them as an object so we can import them together and use their proper names
module.exports = { User, Post, Comment };
