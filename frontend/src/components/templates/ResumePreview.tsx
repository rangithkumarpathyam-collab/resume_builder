import React from 'react';
import ModernTemplate from './ModernTemplate';
import MinimalistTemplate from './MinimalistTemplate';
import CreativeTemplate from './CreativeTemplate';

interface ResumePreviewProps {
  data: any;
  template: 'modern' | 'minimalist' | 'creative';
  scale?: number;
}

const ResumePreview: React.FC<ResumePreviewProps> = ({ data, template, scale = 1 }) => {
  const renderTemplate = () => {
    switch (template) {
      case 'minimalist':
        return <MinimalistTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'modern':
      default:
        return <ModernTemplate data={data} />;
    }
  };

  return (
    <div 
      id="resume-preview-content"
      style={{ 
        transform: `scale(${scale})`, 
        transformOrigin: 'top center',
        width: '210mm',
        height: '297mm',
        backgroundColor: 'white',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      className="transition-transform duration-200"
    >
      {renderTemplate()}
    </div>
  );
};

export default ResumePreview;
