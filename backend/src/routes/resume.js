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

// No authentication required for these routes
// Resumes are now stored in frontend localStorage

// Direct export endpoints (stateless)
router.post('/export/pdf', async (req, res) => {
  try {
    const resumeData = req.body;
    if (!resumeData || !resumeData.personalInfo) {
      return res.status(400).json({ success: false, message: 'Invalid resume data provided.' });
    }

    const pdfBuffer = await generatePDF(resumeData);

    // Set strict headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resumeData.personalInfo.fullName || 'resume'}_resume.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');

    return res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF export error:', error);
    // Ensure we don't send a 200 with error text, which would be interpreted as a corrupt PDF
    return res.status(500).json({ 
      success: false, 
      message: 'PDF generation failed. This usually happens if the server is under high load. Please try again in a moment.' 
    });
  }
});

router.post('/export/docx', async (req, res) => {
  try {
    const resumeData = req.body;
    if (!resumeData || !resumeData.personalInfo) {
      return res.status(400).json({ success: false, message: 'Invalid resume data provided.' });
    }

    const docxBuffer = await generateDOCX(resumeData);

    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${resumeData.personalInfo.fullName || 'resume'}_resume.docx"`,
      'Content-Length': docxBuffer.length,
      'Access-Control-Expose-Headers': 'Content-Disposition'
    });

    res.send(docxBuffer);
  } catch (error) {
    console.error('DOCX export error:', error);
    res.status(500).json({ success: false, message: 'Error generating DOCX.' });
  }
});

module.exports = router;
