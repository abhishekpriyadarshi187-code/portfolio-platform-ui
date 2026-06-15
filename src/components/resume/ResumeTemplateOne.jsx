import "../../styles/resume/ResumeTemplateOne.css";

function ResumeTemplateOne({ data }) {
  return (
    <div className="rt1-shell">
      <section className="rt1-hero">
        <div className="rt1-hero-left">
          <span className="rt1-eyebrow">Resume Template One</span>
          <h1 className="rt1-name">{data.fullName || "Your Name"}</h1>
          <p className="rt1-headline">{data.headline || "Your professional headline"}</p>
          <p className="rt1-summary">{data.about || "Professional summary goes here."}</p>
        </div>

        <div className="rt1-hero-right">
          <p className="rt1-contact-title">Contact</p>

          <div className="rt1-contact-item">
            <strong>Email</strong>
            <span>{data.email || "NA"}</span>
          </div>

          {data.socialLinks?.map((link, index) => (
            <div className="rt1-contact-item" key={index}>
              <strong>{link.platform}</strong>
              <span>{link.url}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="rt1-content">
        <div className="rt1-main">
          <div className="rt1-section">
            <h2>Experience</h2>

            {data.experiences?.map((exp, index) => (
              <div key={index} className="rt1-entry">
                <div className="rt1-top-row">
                  <div>
                    <h3 className="rt1-title">{exp.role}</h3>
                    <p className="rt1-subtitle">{exp.companyName}</p>
                  </div>

                  <span className="rt1-date">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>

                <p className="rt1-desc">{exp.description}</p>
              </div>
            ))}
          </div>

          <div className="rt1-section">
            <h2>Projects</h2>

            {data.projects?.map((project, index) => (
              <div key={index} className="rt1-entry">
                <div className="rt1-top-row">
                  <div>
                    <h3 className="rt1-title">{project.title}</h3>
                  </div>
                </div>

                <p className="rt1-desc">{project.description}</p>

                {project.techStack?.length > 0 && (
                  <div className="rt1-chip-wrap">
                    {project.techStack.map((tech, i) => (
                      <span key={i} className="rt1-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <aside className="rt1-side">
          <div className="rt1-section">
            <h2>Skills</h2>

            <div className="rt1-skill-list">
              {data.skills?.map((skill, index) => (
                <div key={index} className="rt1-skill-row">
                  <strong>{skill.name}</strong>
                  <span>
                    {skill.yearsOfExperience} years · {skill.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rt1-section">
            <h2>Education</h2>

            {data.education?.map((edu, index) => (
              <div key={index} className="rt1-side-card">
                <div className="rt1-entry rt1-entry-no-border">
                  <div className="rt1-top-row">
                    <div>
                      <h3 className="rt1-title">{edu.degree}</h3>
                      <p className="rt1-subtitle">{edu.fieldOfStudy}</p>
                    </div>
                    <span className="rt1-date">
                      {edu.startYear} - {edu.endYear}
                    </span>
                  </div>

                  <p className="rt1-desc">
                    {edu.institution?.name}
                    {edu.institution?.location ? ` · ${edu.institution.location}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="rt1-section">
            <h2>Achievements</h2>

            <div className="rt1-side-card">
              {data.achievements?.map((achievement, index) => (
                <div
                  key={index}
                  className={`rt1-entry ${
                    index === data.achievements.length - 1 ? "rt1-entry-no-border" : ""
                  }`}
                >
                  <h3 className="rt1-title">{achievement.title}</h3>
                  <p className="rt1-desc">{achievement.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rt1-section">
            <h2>Links</h2>

            <div className="rt1-link-list">
              {data.socialLinks?.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rt1-link-item"
                >
                  <span>{link.platform}</span>
                  <span>→</span>
                </a>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
}

export default ResumeTemplateOne;