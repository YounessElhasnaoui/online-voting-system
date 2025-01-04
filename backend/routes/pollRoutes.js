const express = require('express');
const validatePollCreation = require('../middlewares/validatePollCreation');
const validatePollUpdate = require('../middlewares/validatePollUpdate');
const { protect } = require('../middlewares/authMiddleware');
const { 
  createPoll, 
  getPolls, 
  updatePoll, 
  deletePoll 
} = require('../controllers/pollController');

const router = express.Router();

router.post('/', protect, validatePollCreation, createPoll); // Create a new poll
router.get('/', protect, getPolls); // Get all polls
router.put('/:id', protect, validatePollUpdate, updatePoll); // Update a poll
router.delete('/:id', protect, deletePoll); // Delete a poll

module.exports = router;
