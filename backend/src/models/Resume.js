const mongoose = require('mongoose');

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    default: 'Untitled Resume',
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  template: {
    type: String,
    enum: ['modern', 'minimalist', 'creative'],
    default: 'modern'
  },
  personalInfo: {
    fullName:  { type: String, default: '' },
    email:     { type: String, default: '' },
    phone:     { type: String, default: '' },
    location:  { type: String, default: '' },
    linkedin:  { type: String, default: '' },
    github:    { type: String, default: '' },
    website:   { type: String, default: '' },
    summary:   { type: String, default: '' }
  },
  education: [{
    institution: { type: String, default: '' },
    degree:      { type: String, default: '' },
    field:       { type: String, default: '' },
    startDate:   { type: String, default: '' },
    endDate:     { type: String, default: '' },
    gpa:         { type: String, default: '' },
    description: { type: String, default: '' }
  }],
  experience: [{
    company:     { type: String, default: '' },
    position:    { type: String, default: '' },
    location:    { type: String, default: '' },
    startDate:   { type: String, default: '' },
    endDate:     { type: String, default: '' },
    current:     { type: Boolean, default: false },
    description: { type: String, default: '' },
    highlights:  [{ type: String }]
  }],
  skills: [{
    category: { type: String, default: '' },
    items:    [{ type: String }]
  }],
  projects: [{
    name:         { type: String, default: '' },
    description:  { type: String, default: '' },
    technologies: [{ type: String }],
    link:         { type: String, default: '' },
    github:       { type: String, default: '' }
  }],
  certifications: [{
    name:   { type: String, default: '' },
    issuer: { type: String, default: '' },
    date:   { type: String, default: '' },
    link:   { type: String, default: '' }
  }],
  languages: [{
    language:    { type: String, default: '' },
    proficiency: { type: String, default: '' }
  }]
}, {
  timestamps: true
});

// Index for fast user-based queries
resumeSchema.index({ userId: 1, updatedAt: -1 });

module.exports = mongoose.model('Resume', resumeSchema);
