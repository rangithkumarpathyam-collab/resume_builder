import React from 'react';

const CreativeTemplate = ({ data }: { data: any }) => {
  const pi = data.personalInfo || {};

  return (
    <div className="bg-white w-full h-full text-gray-800 font-sans shadow-lg flex overflow-hidden" style={{ width: '210mm', minHeight: '297mm', margin: '0 auto', fontSize: '13px' }}>
      
      {/* Sidebar */}
      <div className="w-1/3 bg-purple-900 text-white p-8 flex flex-col">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight mb-2 leading-none">{pi.fullName || 'Your Name'}</h1>
          {pi.summary && <p className="text-xs text-purple-200 mt-4 leading-relaxed">{pi.summary}</p>}
        </div>

        {/* Contact Info */}
        <div className="mb-8 space-y-3 text-xs text-purple-100">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-purple-700 pb-2">Contact</h2>
          {pi.email && <div>{pi.email}</div>}
          {pi.phone && <div>{pi.phone}</div>}
          {pi.location && <div>{pi.location}</div>}
          {pi.linkedin && <div className="truncate">{pi.linkedin}</div>}
          {pi.website && <div className="truncate">{pi.website}</div>}
        </div>

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-purple-700 pb-2">Skills</h2>
            <div className="space-y-4">
              {data.skills.map((skill: any, i: number) => (
                <div key={i}>
                  <div className="text-xs font-semibold mb-2 text-purple-200">{skill.category}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {(skill.items || []).map((item: string, j: number) => (
                      <span key={j} className="text-[10px] bg-purple-800/50 px-2 py-1 rounded-full border border-purple-700/50">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-purple-700 pb-2">Languages</h2>
            <div className="space-y-2">
              {data.languages.map((lang: any, i: number) => (
                <div key={i} className="flex justify-between text-xs">
                  <span>{lang.language}</span>
                  <span className="text-purple-300">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="w-2/3 bg-purple-50 p-8 flex flex-col space-y-8">
        
        {/* Experience */}
        {data.experience && data.experience.length > 0 && (
          <section>
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-3 text-purple-700 font-bold">E</div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Experience</h2>
            </div>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-purple-200 before:to-transparent pl-6">
              {data.experience.map((exp: any, i: number) => (
                <div key={i} className="relative">
                  <div className="absolute w-3 h-3 bg-purple-600 rounded-full mt-1.5 -left-[29px] border-4 border-purple-50"></div>
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-900 text-sm">{exp.position}</h3>
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">
                        {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs text-purple-700 font-medium mb-2">{exp.company} {exp.location && `• ${exp.location}`}</div>
                    {exp.description && <p className="text-xs text-gray-600 mb-2 leading-relaxed">{exp.description}</p>}
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                        {exp.highlights.map((h: string, j: number) => (
                          <li key={j}>{h}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <section>
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-3 text-purple-700 font-bold">A</div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Education</h2>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {data.education.map((edu: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-purple-100 border-l-4 border-l-purple-500">
                  <h3 className="font-bold text-gray-900 text-sm">{edu.degree} {edu.field && `in ${edu.field}`}</h3>
                  <div className="text-xs text-purple-700 font-medium mt-1">{edu.institution}</div>
                  <div className="text-xs text-gray-500 mt-2 flex justify-between">
                    <span>{edu.startDate} - {edu.endDate}</span>
                    {edu.gpa && <span className="font-medium text-gray-700">GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section>
            <div className="flex items-center mb-5">
              <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center mr-3 text-purple-700 font-bold">P</div>
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Projects</h2>
            </div>
            <div className="space-y-4">
              {data.projects.map((proj: any, i: number) => (
                <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-purple-100">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{proj.name}</h3>
                  {proj.description && <p className="text-xs text-gray-600 mb-2">{proj.description}</p>}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
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
    </div>
  );
};

export default CreativeTemplate;
