import React from 'react';

const ModernTemplate = ({ data }: { data: any }) => {
  const pi = data.personalInfo || {};

  return (
    <div className="bg-white w-full h-full text-gray-900 font-sans shadow-lg overflow-hidden flex flex-col" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', fontSize: '13px' }}>
      {/* Header */}
      <div className="bg-blue-700 text-white p-8">
        <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">{pi.fullName || 'Your Name'}</h1>
        {pi.summary && <p className="text-sm opacity-90 max-w-2xl">{pi.summary}</p>}
        
        <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4 text-xs opacity-90">
          {pi.email && <span>{pi.email}</span>}
          {pi.phone && <span>{pi.phone}</span>}
          {pi.location && <span>{pi.location}</span>}
          {pi.linkedin && <span>{pi.linkedin}</span>}
          {pi.website && <span>{pi.website}</span>}
        </div>
      </div>

      <div className="flex-1 grid grid-cols-3 gap-6 p-8 bg-white">
        {/* Left Column */}
        <div className="col-span-2 space-y-6">
          {/* Experience */}
          {data.experience && data.experience.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-700 border-b-2 border-blue-700 pb-1 mb-3 uppercase">Experience</h2>
              <div className="space-y-4">
                {data.experience.map((exp: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                      <span className="text-xs text-gray-500 font-medium">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{exp.company} {exp.location && `• ${exp.location}`}</div>
                    {exp.description && <p className="text-xs text-gray-700 mb-2">{exp.description}</p>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-outside ml-4 text-xs text-gray-700 space-y-1">
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

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-700 border-b-2 border-blue-700 pb-1 mb-3 uppercase">Projects</h2>
              <div className="space-y-4">
                {data.projects.map((proj: any, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold text-gray-900">{proj.name}</h3>
                      {proj.link && <a href={proj.link} className="text-xs text-blue-600 hover:underline">View</a>}
                    </div>
                    {proj.description && <p className="text-xs text-gray-700 mb-2">{proj.description}</p>}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {proj.technologies.map((t: string, j: number) => (
                          <span key={j} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Education */}
          {data.education && data.education.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-700 border-b-2 border-blue-700 pb-1 mb-3 uppercase">Education</h2>
              <div className="space-y-4">
                {data.education.map((edu: any, i: number) => (
                  <div key={i}>
                    <h3 className="font-semibold text-gray-900 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                    <div className="text-xs text-gray-600 mt-0.5">{edu.institution}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{edu.startDate} - {edu.endDate} {edu.gpa && `• GPA: ${edu.gpa}`}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-700 border-b-2 border-blue-700 pb-1 mb-3 uppercase">Skills</h2>
              <div className="space-y-3">
                {data.skills.map((skill: any, i: number) => (
                  <div key={i}>
                    <h3 className="text-xs font-semibold text-gray-900 mb-1">{skill.category}</h3>
                    <div className="flex flex-wrap gap-1">
                      {skill.items && skill.items.map((item: string, j: number) => (
                        <span key={j} className="text-xs text-gray-700 bg-blue-50 px-2 py-1 rounded">{item}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h2 className="text-lg font-bold text-blue-700 border-b-2 border-blue-700 pb-1 mb-3 uppercase">Certifications</h2>
              <div className="space-y-2">
                {data.certifications.map((cert: any, i: number) => (
                  <div key={i}>
                    <div className="text-xs font-semibold text-gray-900">{cert.name}</div>
                    <div className="text-xs text-gray-500">{cert.issuer} {cert.date && `• ${cert.date}`}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModernTemplate;
