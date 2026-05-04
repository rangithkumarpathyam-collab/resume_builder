const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getResumes,
  getResume,
  createResume,
  updateResume,
  deleteResume,
  duplicateResume
} = require('../controllers/resumeController');
const { generatePDF } = require('../services/pdfService');
const { generateDOCX } = require('../services/docxService');

const router = express.Router();

// All resume routes are protected
router.use(protect);

router.route('/')
  .get(getResumes)
  .post(createResume);

router.route('/:id')
  .get(getResume)
  .put(updateResume)
  .delete(deleteResume);

router.post('/:id/duplicate', duplicateResume);

// Export routes
router.get('/:id/export/pdf', async (req, res) => {
  try {
    const Resume = require('../models/Resume');
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const pdfBuffer = await generatePDF(resume.toObject());

    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${resume.personalInfo.fullName || 'resume'}_resume.pdf"`,
      'Content-Length': pdfBuffer.length
    });

    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ success: false, message: 'Error generating PDF.' });
  }
});

router.get('/:id/export/docx', async (req, res) => {
  try {
    const Resume = require('../models/Resume');
    const resume = await Resume.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume not found.' });
    }

    const docxBuffer = await generateDOCX(resume.toObject());

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${resume.personalInfo.fullName || 'resume'}_resume.docx"`,
      'Content-Length': docxBuffer.length
    });

    res.send(docxBuffer);
  } catch (error) {
    console.error('DOCX export error:', error);
    res.status(500).json({ success: false, message: 'Error generating DOCX.' });
  }
});

module.exports = router;
