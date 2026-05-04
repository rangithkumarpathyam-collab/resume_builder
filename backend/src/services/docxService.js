const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopType, TabStopPosition } = require('docx');

const generateDOCX = async (resumeData) => {
  const pi = resumeData.personalInfo || {};

  const children = [];

  // Helper: add section title
  const addSectionTitle = (text) => {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: text.toUpperCase(), bold: true, size: 24, font: 'Calibri', color: '2563eb' })],
        spacing: { before: 300, after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '2563eb' } }
      })
    );
  };

  // Header — Name
  children.push(
    new Paragraph({
      children: [new TextRun({ text: pi.fullName || 'Your Name', bold: true, size: 36, font: 'Calibri' })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 80 }
    })
  );

  // Contact row
  const contactParts = [pi.email, pi.phone, pi.location, pi.linkedin, pi.github, pi.website].filter(Boolean);
  if (contactParts.length > 0) {
    children.push(
      new Paragraph({
        children: [new TextRun({ text: contactParts.join('  |  '), size: 20, font: 'Calibri', color: '6b7280' })],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      })
    );
  }

  // Summary
  if (pi.summary) {
    addSectionTitle('Summary');
    children.push(
      new Paragraph({
        children: [new TextRun({ text: pi.summary, size: 22, font: 'Calibri', color: '374151' })],
        spacing: { after: 100 }
      })
    );
  }

  // Experience
  if (resumeData.experience && resumeData.experience.length > 0) {
    addSectionTitle('Experience');
    resumeData.experience.forEach(exp => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position || '', bold: true, size: 24, font: 'Calibri' }),
            new TextRun({ text: `  —  ${exp.company || ''}`, size: 22, font: 'Calibri', color: '6b7280' })
          ],
          spacing: { before: 120 }
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.startDate || ''} — ${exp.current ? 'Present' : (exp.endDate || '')}${exp.location ? '  |  ' + exp.location : ''}`,
              size: 20, font: 'Calibri', color: '9ca3af', italics: true
            })
          ],
          spacing: { after: 60 }
        })
      );
      if (exp.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: exp.description, size: 22, font: 'Calibri', color: '374151' })],
            spacing: { after: 40 }
          })
        );
      }
      if (exp.highlights && exp.highlights.length > 0) {
        exp.highlights.forEach(h => {
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `• ${h}`, size: 22, font: 'Calibri', color: '4b5563' })],
              indent: { left: 360 },
              spacing: { after: 20 }
            })
          );
        });
      }
    });
  }

  // Education
  if (resumeData.education && resumeData.education.length > 0) {
    addSectionTitle('Education');
    resumeData.education.forEach(edu => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree || ''} ${edu.field ? 'in ' + edu.field : ''}`, bold: true, size: 24, font: 'Calibri' })
          ],
          spacing: { before: 120 }
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.institution || ''}`, size: 22, font: 'Calibri', color: '6b7280' }),
            new TextRun({
              text: `  |  ${edu.startDate || ''} — ${edu.endDate || ''}${edu.gpa ? '  |  GPA: ' + edu.gpa : ''}`,
              size: 20, font: 'Calibri', color: '9ca3af', italics: true
            })
          ],
          spacing: { after: 60 }
        })
      );
    });
  }

  // Projects
  if (resumeData.projects && resumeData.projects.length > 0) {
    addSectionTitle('Projects');
    resumeData.projects.forEach(proj => {
      children.push(
        new Paragraph({
          children: [new TextRun({ text: proj.name || '', bold: true, size: 24, font: 'Calibri' })],
          spacing: { before: 120 }
        })
      );
      if (proj.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: proj.description, size: 22, font: 'Calibri', color: '374151' })],
            spacing: { after: 40 }
          })
        );
      }
      if (proj.technologies && proj.technologies.length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: `Technologies: ${proj.technologies.join(', ')}`, size: 20, font: 'Calibri', color: '6b7280', italics: true })],
            spacing: { after: 60 }
          })
        );
      }
    });
  }

  // Skills
  if (resumeData.skills && resumeData.skills.length > 0) {
    addSectionTitle('Skills');
    resumeData.skills.forEach(s => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${s.category || 'Skills'}: `, bold: true, size: 22, font: 'Calibri' }),
            new TextRun({ text: (s.items || []).join(', '), size: 22, font: 'Calibri', color: '374151' })
          ],
          spacing: { after: 60 }
        })
      );
    });
  }

  // Certifications
  if (resumeData.certifications && resumeData.certifications.length > 0) {
    addSectionTitle('Certifications');
    resumeData.certifications.forEach(cert => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name || '', bold: true, size: 22, font: 'Calibri' }),
            new TextRun({ text: ` — ${cert.issuer || ''}`, size: 22, font: 'Calibri', color: '6b7280' }),
            new TextRun({ text: cert.date ? `  (${cert.date})` : '', size: 20, font: 'Calibri', color: '9ca3af' })
          ],
          spacing: { after: 60 }
        })
      );
    });
  }

  // Languages
  if (resumeData.languages && resumeData.languages.length > 0) {
    addSectionTitle('Languages');
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resumeData.languages.map(l => `${l.language} (${l.proficiency})`).join('  |  '),
            size: 22, font: 'Calibri', color: '374151'
          })
        ],
        spacing: { after: 60 }
      })
    );
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 }
        }
      },
      children
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  return buffer;
};

module.exports = { generateDOCX };
