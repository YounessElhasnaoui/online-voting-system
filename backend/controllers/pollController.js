const Poll = require('../models/Poll');
const logger = require('../utils/logger');

// Create Poll
const createPoll = async (req, res) => {
  const { question, options, allowedSelections, selectionType, endTime } = req.body;

  // Validate input
  if (!question || !options || options.length < 2) {
    return res.status(400).json({ success: false, message: 'Question and at least two options are required' });
  }

  if (!allowedSelections || allowedSelections < 1) {
    return res.status(400).json({
      success: false,
      message: 'Allowed selections must be at least 1',
    });
  }

  if (allowedSelections > options.length) {
    return res.status(400).json({
      success: false,
      message: 'Allowed selections cannot exceed the number of options',
    });
  }

  if (!['strict', 'soft'].includes(selectionType)) {
    return res.status(400).json({ success: false, message: 'Selection type must be either "strict" or "soft"' });
  }

  try {
    const poll = await Poll.create({
      question,
      options: options.map((opt) => ({ text: opt })),
      allowedSelections,
      selectionType,
      creator: req.user.id,
      endTime,
    });

    res.status(201).json({
      success: true,
      data: poll,
      message: 'Poll created successfully',
    });
  } catch (error) {
    logger.error(`Error creating poll: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Polls
const getPolls = async (req, res) => {
  const { limit = 10, page = 1 } = req.query;

  try {
    const polls = await Poll.find()
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.status(200).json({
      success: true,
      data: polls,
      message: 'Polls fetched successfully',
    });
  } catch (error) {
    logger.error(`Error fetching polls: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Update Poll
const updatePoll = async (req, res) => {
  const { id } = req.params;
  const { question, options, allowedSelections, selectionType, endTime } = req.body;

  try {
    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    // Check if the user is the creator of the poll
    if (poll.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to update this poll' });
    }

    // Update poll fields
    if (question) poll.question = question;
    if (options) {
      if (options.length < 2) {
        return res.status(400).json({ success: false, message: 'A poll must have at least two options' });
      }
      poll.options = options.map((opt) => ({ text: opt }));
    }
    if (allowedSelections !== undefined) poll.allowedSelections = allowedSelections;
    if (selectionType) poll.selectionType = selectionType;
    if (endTime) poll.endTime = endTime;

    await poll.save();

    res.status(200).json({
      success: true,
      data: poll,
      message: 'Poll updated successfully',
    });
  } catch (error) {
    logger.error(`Error updating poll: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete Poll
const deletePoll = async (req, res) => {
  const { id } = req.params;

  try {
    const poll = await Poll.findById(id);

    if (!poll) {
      return res.status(404).json({ success: false, message: 'Poll not found' });
    }

    // Check if the user is the creator of the poll
    if (poll.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'You are not authorized to delete this poll' });
    }

    await poll.remove();

    res.status(200).json({ success: true, message: 'Poll deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting poll: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { createPoll, getPolls, updatePoll, deletePoll };
