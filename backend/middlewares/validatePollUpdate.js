const validatePollUpdate = (req, res, next) => {
    const { question, options, allowedSelections, selectionType, endTime } = req.body;
  
    if (!question || !options || options.length < 2 || !allowedSelections || !selectionType || !endTime) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }
  
    if (allowedSelections > options.length) {
      return res.status(400).json({
        success: false,
        message: 'Allowed selections cannot exceed the number of options',
      });
    }
  
    if (!['strict', 'soft'].includes(selectionType)) {
      return res.status(400).json({ success: false, message: 'Invalid selection type' });
    }
  
    next();
  };
  
  module.exports = validatePollUpdate;