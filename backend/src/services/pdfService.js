const generatePDF = async (resumeData) => {
  const html = generateResumeHTML(resumeData);

  let browser = null;
  try {
    const isVercel = process.env.VERCEL || process.env.NODE_ENV === 'production';
    
    if (isVercel) {
      // Serverless (Vercel) configuration
      const chromium = require('@sparticuz/chromium-min');
      const puppeteer = require('puppeteer-core');
      
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v123.0.1/chromium-v123.0.1-pack.tar'),
        headless: chromium.headless,
      });
    } else {
      // Local development configuration
      const puppeteer = require('puppeteer');
      browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
    });
    
    await browser.close();
    return Buffer.from(pdf);
  } catch (err) {
    console.error('PDF Generation Error:', err);
    if (browser) await browser.close();
    throw new Error('Failed to generate professional PDF: ' + err.message);
  }
};

function generateResumeHTML(data) {
  const template = data.template || 'modern';
  const pi = data.personalInfo || {};
  
  const colors = {
    modern: { primary: '#2563eb', secondary: '#1e40af', bg: '#f8fafc', accent: '#3b82f6' },
    minimalist: { primary: '#111827', secondary: '#374151', bg: '#ffffff', accent: '#6b7280' },
    creative: { primary: '#7c3aed', secondary: '#5b21b6', bg: '#faf5ff', accent: '#8b5cf6' }
  };
  
  const c = colors[template] || colors.modern;

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1f2937; line-height: 1.5; background: #fff; }
  .resume { max-width: 800px; margin: 0 auto; padding: 40px; }
  
  /* Modern Template */
  ${template === 'modern' ? `
  .header { background: linear-gradient(135deg, ${c.primary}, ${c.secondary}); color: white; padding: 40px; border-radius: 0; }
  .header h1 { font-size: 32px; font-weight: 700; margin-bottom: 8px; }
  .header .subtitle { font-size: 14px; opacity: 0.9; }
  .contact-row { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 12px; font-size: 13px; opacity: 0.9; }
  .section { padding: 24px 40px; }
  .section-title { font-size: 18px; font-weight: 700; color: ${c.primary}; border-bottom: 2px solid ${c.primary}; padding-bottom: 8px; margin-bottom: 16px; text-transform: uppercase; letter-spacing: 1px; }
  ` : ''}
  
  /* Minimalist Template */
  ${template === 'minimalist' ? `
  .header { padding: 40px; text-align: center; border-bottom: 1px solid #e5e7eb; }
  .header h1 { font-size: 28px; font-weight: 300; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 8px; }
  .header .subtitle { font-size: 13px; color: #6b7280; }
  .contact-row { display: flex; justify-content: center; flex-wrap: wrap; gap: 20px; margin-top: 12px; font-size: 12px; color: #6b7280; }
  .section { padding: 20px 40px; }
  .section-title { font-size: 14px; font-weight: 400; letter-spacing: 3px; text-transform: uppercase; color: ${c.accent}; border-bottom: 1px solid #e5e7eb; padding-bottom: 6px; margin-bottom: 14px; }
  ` : ''}
  
  /* Creative Template */
  ${template === 'creative' ? `
  .resume { display: grid; grid-template-columns: 280px 1fr; min-height: 100vh; padding: 0; }
  .sidebar { background: linear-gradient(180deg, ${c.primary}, ${c.secondary}); color: white; padding: 40px 24px; }
  .main-content { padding: 40px; }
  .header { padding: 0 0 20px 0; }
  .header h1 { font-size: 28px; font-weight: 700; margin-bottom: 4px; }
  .header .subtitle { font-size: 13px; opacity: 0.85; }
  .contact-row { display: flex; flex-direction: column; gap: 8px; margin-top: 16px; font-size: 12px; opacity: 0.85; }
  .section { padding: 16px 0; }
  .section-title { font-size: 16px; font-weight: 600; color: ${c.primary}; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 2px solid ${c.accent}; }
  .sidebar .section-title { color: white; border-bottom-color: rgba(255,255,255,0.3); }
  ` : ''}
  
  .entry { margin-bottom: 16px; }
  .entry-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 4px; }
  .entry-title { font-weight: 600; font-size: 15px; }
  .entry-subtitle { font-size: 13px; color: #6b7280; }
  .entry-date { font-size: 12px; color: #9ca3af; white-space: nowrap; }
  .entry-description { font-size: 13px; color: #4b5563; margin-top: 4px; }
  .skills-grid { display: flex; flex-wrap: wrap; gap: 8px; }
  .skill-tag { background: ${c.primary}15; color: ${c.primary}; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 500; }
  ${template === 'creative' ? `.sidebar .skill-tag { background: rgba(255,255,255,0.15); color: white; }` : ''}
  .summary { font-size: 14px; color: #4b5563; line-height: 1.7; }
  ul { padding-left: 18px; }
  ul li { font-size: 13px; color: #4b5563; margin-bottom: 2px; }
</style>
</head>
<body>
<div class="resume">
  ${template === 'creative' ? '<div class="sidebar">' : ''}
  
  <div class="header">
    <h1>${pi.fullName || 'Your Name'}</h1>
    ${pi.summary ? `<div class="subtitle">${pi.summary.substring(0, 100)}</div>` : ''}
    <div class="contact-row">
      ${pi.email ? `<span>📧 ${pi.email}</span>` : ''}
      ${pi.phone ? `<span>📱 ${pi.phone}</span>` : ''}
      ${pi.location ? `<span>📍 ${pi.location}</span>` : ''}
      ${pi.linkedin ? `<span>🔗 ${pi.linkedin}</span>` : ''}
      ${pi.github ? `<span>💻 ${pi.github}</span>` : ''}
      ${pi.website ? `<span>🌐 ${pi.website}</span>` : ''}
    </div>
  </div>

  ${template === 'creative' ? `
  ${data.skills && data.skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills</div>
    ${data.skills.map(s => `
      <div style="margin-bottom:12px;">
        <div style="font-size:13px;font-weight:600;margin-bottom:6px;">${s.category || 'Skills'}</div>
        <div class="skills-grid">
          ${(s.items || []).map(item => `<span class="skill-tag">${item}</span>`).join('')}
        </div>
      </div>
    `).join('')}
  </div>` : ''}
  
  ${data.languages && data.languages.length > 0 ? `
  <div class="section">
    <div class="section-title">Languages</div>
    ${data.languages.map(l => `<div style="font-size:13px;margin-bottom:4px;">${l.language} — ${l.proficiency}</div>`).join('')}
  </div>` : ''}
  
  </div><div class="main-content">` : ''}

  ${pi.summary && template !== 'creative' ? `
  <div class="section">
    <div class="section-title">Summary</div>
    <div class="summary">${pi.summary}</div>
  </div>` : ''}

  ${data.experience && data.experience.length > 0 ? `
  <div class="section">
    <div class="section-title">Experience</div>
    ${data.experience.map(exp => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-title">${exp.position || ''}</div>
          <div class="entry-subtitle">${exp.company || ''}${exp.location ? ' • ' + exp.location : ''}</div>
        </div>
        <div class="entry-date">${exp.startDate || ''} — ${exp.current ? 'Present' : (exp.endDate || '')}</div>
      </div>
      ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ''}
      ${exp.highlights && exp.highlights.length > 0 ? `<ul>${exp.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${data.education && data.education.length > 0 ? `
  <div class="section">
    <div class="section-title">Education</div>
    ${data.education.map(edu => `
    <div class="entry">
      <div class="entry-header">
        <div>
          <div class="entry-title">${edu.degree || ''} ${edu.field ? 'in ' + edu.field : ''}</div>
          <div class="entry-subtitle">${edu.institution || ''}${edu.gpa ? ' • GPA: ' + edu.gpa : ''}</div>
        </div>
        <div class="entry-date">${edu.startDate || ''} — ${edu.endDate || ''}</div>
      </div>
      ${edu.description ? `<div class="entry-description">${edu.description}</div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${data.projects && data.projects.length > 0 ? `
  <div class="section">
    <div class="section-title">Projects</div>
    ${data.projects.map(proj => `
    <div class="entry">
      <div class="entry-title">${proj.name || ''}</div>
      ${proj.description ? `<div class="entry-description">${proj.description}</div>` : ''}
      ${proj.technologies && proj.technologies.length > 0 ? `
      <div class="skills-grid" style="margin-top:6px;">
        ${proj.technologies.map(t => `<span class="skill-tag">${t}</span>`).join('')}
      </div>` : ''}
    </div>`).join('')}
  </div>` : ''}

  ${template !== 'creative' && data.skills && data.skills.length > 0 ? `
  <div class="section">
    <div class="section-title">Skills</div>
    ${data.skills.map(s => `
      <div style="margin-bottom:12px;">
        <div style="font-size:13px;font-weight:600;margin-bottom:6px;">${s.category || 'Skills'}</div>
        <div class="skills-grid">
          ${(s.items || []).map(item => `<span class="skill-tag">${item}</span>`).join('')}
        </div>
      </div>
    `).join('')}
  </div>` : ''}

  ${data.certifications && data.certifications.length > 0 ? `
  <div class="section">
    <div class="section-title">Certifications</div>
    ${data.certifications.map(cert => `
    <div class="entry">
      <div class="entry-header">
        <div class="entry-title">${cert.name || ''}</div>
        <div class="entry-date">${cert.date || ''}</div>
      </div>
      <div class="entry-subtitle">${cert.issuer || ''}</div>
    </div>`).join('')}
  </div>` : ''}

  ${template === 'creative' ? '</div>' : ''}
</div>
</body>
</html>`;
}

module.exports = { generatePDF, generateResumeHTML };
