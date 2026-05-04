import React from 'react';

const MinimalistTemplate = ({ data }: { data: any }) => {
  const pi = data.personalInfo || {};

  return (
    <div className="bg-white w-full h-full text-gray-800 font-serif shadow-lg flex flex-col p-12" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', fontSize: '13px' }}>
      
      {/* Header */}
      <div className="text-center mb-8 border-b border-gray-300 pb-6">
        <h1 className="text-4xl font-light tracking-[0.2em] uppercase text-gray-900 mb-2">{pi.fullName || 'Your Name'}</h1>
        
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-3 text-xs text-gray-500 tracking-wide">
          {pi.email && <span>{pi.email}</span>}
          {pi.email && pi.phone && <span>|</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.phone && pi.location && <span>|</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.location && pi.linkedin && <span>|</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
        </div>
      </div>

      <div className="flex-1 space-y-6">
        
        {/* Summary */}
        {pi.summary && (
          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-3 text-center">Summary</h2>
            <p className="text-sm leading-relaxed text-gray-700 text-justify">{pi.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-4 border-b border-gray-100 pb-1">Experience</h2>
            <div className="space-y-5">
              {data.experience.map((exp: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <span className="text-xs text-gray-500 italic">
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mb-2">{exp.company} {exp.location && `, ${exp.location}`}</div>
                  {exp.description && <p className="text-sm text-gray-700 mb-2">{exp.description}</p>}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-square list-outside ml-4 text-sm text-gray-700 space-y-1">
                      {exp.highlights.map((h: string, j: number) => (
                        <li key={j}>{h}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-4 border-b border-gray-100 pb-1">Education</h2>
            <div className="space-y-4">
              {data.education.map((edu: any, i: number) => (
                <div key={i} className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <div className="text-sm text-gray-600 mt-0.5">{edu.institution}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500 italic">{edu.startDate} - {edu.endDate}</div>
                    {edu.gpa && <div className="text-xs text-gray-500 mt-1">GPA: {edu.gpa}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold tracking-widest uppercase text-gray-400 mb-4 border-b border-gray-100 pb-1">Skills</h2>
            <div className="grid grid-cols-2 gap-4">
              {data.skills.map((skill: any, i: number) => (
                <div key={i} className="text-sm">
                  <span className="font-semibold text-gray-900 mr-2">{skill.category}:</span>
                  <span className="text-gray-700">{(skill.items || []).join(', ')}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default MinimalistTemplate;
