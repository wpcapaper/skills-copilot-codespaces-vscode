// Create web server
const express = require('express');
const bodyParser = require('body-parser');
const { randomBytes } = require('crypto');
const cors = require('cors');

// Create express app
const app = express();

// Use cors
app.use(cors());

// Use body parser
app.use(bodyParser.json());

// Create comments array
const commentsByPostId = {};

// Create route to get all comments for a post
app.get('/posts/:id/comments', (req, res) => {
  // Return comments array for given post id
  res.send(commentsByPostId[req.params.id] || []);
});

// Create route to post a comment for a post
app.post('/posts/:id/comments', (req, res) => {
  // Generate random id for comment
  const commentId = randomBytes(4).toString('hex');

  // Get comment from request body
  const { content } = req.body;

  // Get comments array for given post id
  const comments = commentsByPostId[req.params.id] || [];

  // Add new comment to comments array
  comments.push({ id: commentId, content, status: 'pending' });

  // Set comments array for given post id
  commentsByPostId[req.params.id] = comments;

  // Emit event
  res.status(201).send(comments);
});

// Create route to handle event
app.post('/events', (req, res) => {
  // Get event type and data from request body
  const { type, data } = req.body;

  // Check if event type is comment created
  if (type === 'CommentCreated') {
    // Get comment from data
    const comment = data;

    // Get comments array for given post id
    const comments = commentsByPostId[comment.postId];

    // Find comment in comments array
    const commentToUpdate = comments.find((commentToUpdate) => {
      return commentToUpdate.id === comment.id;
    });

    // Update comment
    commentToUpdate.status = comment.status;

    // Emit event
    res.send({});
  }
});

// Listen to port 4001
app.listen(4001, () => {
  console.log('Listening on 4001');
});