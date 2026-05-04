const { validationResult } = require('express-validator');
const Resume = require('../models/Resume');

// @desc    Get all resumes for current user
// @route   GET /api/resumes
exports.getResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.user._id })
      .sort({ updatedAt: -1 })
      .select('title template personalInfo.fullName updatedAt createdAt');

    res.json({ success: true, count: resumes.length, resumes });
  } catch (error) {
    console.error('Get resumes error:', error);
    res.status(500).json({ success: false, message: 'Error fetching resumes.' });
  }
};

// @desc    Get single resume
// @route   GET /api/resumes/:id
exports.getResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    res.json({ success: true, resume });
  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ success: false, message: 'Error fetching resume.' });
  }
};

// @desc    Create new resume
// @route   POST /api/resumes
exports.createResume = async (req, res) => {
  try {
    const resumeData = {
      ...req.body,
      userId: req.user._id
    };

    const resume = await Resume.create(resumeData);
    res.status(201).json({ success: true, resume });
  } catch (error) {
    console.error('Create resume error:', error);
    res.status(500).json({ success: false, message: 'Error creating resume.' });
  }
};

// @desc    Update resume
// @route   PUT /api/resumes/:id
exports.updateResume = async (req, res) => {
  try {
    let resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    resume = await Resume.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.json({ success: true, resume });
  } catch (error) {
    console.error('Update resume error:', error);
    res.status(500).json({ success: false, message: 'Error updating resume.' });
  }
};

// @desc    Delete resume
// @route   DELETE /api/resumes/:id
exports.deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    await Resume.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Resume deleted successfully.' });
  } catch (error) {
    console.error('Delete resume error:', error);
    res.status(500).json({ success: false, message: 'Error deleting resume.' });
  }
};

// @desc    Duplicate resume
// @route   POST /api/resumes/:id/duplicate
exports.duplicateResume = async (req, res) => {
  try {
    const original = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!original) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const duplicateData = original.toObject();
    delete duplicateData._id;
    delete duplicateData.createdAt;
    delete duplicateData.updatedAt;
    duplicateData.title = `${original.title} (Copy)`;

    const newResume = await Resume.create(duplicateData);
    res.status(201).json({ success: true, resume: newResume });
  } catch (error) {
    console.error('Duplicate resume error:', error);
    res.status(500).json({ success: false, message: 'Error duplicating resume.' });
  }
};
