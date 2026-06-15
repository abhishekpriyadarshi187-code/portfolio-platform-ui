import "../../styles/resume/ResumeTemplateTwo.css";

function ResumeTemplateTwo({ data }) {
  return (
    <div className="rt2-shell">
      <aside className="rt2-sidebar">
        <div className="rt2-photo-card">
          {data.profilePhoto ? (
            <img src={data.profilePhoto} alt="Profile" className="rt2-photo" />
          ) : (
            <div className="rt2-photo rt2-photo-placeholder">👤</div>
          )}

          <h2 className="rt2-photo-name">{data.fullName || "Your Name"}</h2>
          <p className="rt2-photo-role">{data.headline || "Your professional headline"}</p>
        </div>

        <div className="rt2-side-section">
          <h3>Contact</h3>
          <div className="rt2-info-list">
            <div className="rt2-info-item">
              <strong>Email</strong>
              <span>{data.email || "NA"}</span>
            </div>

            {data.socialLinks?.map((link, index) => (
              <div className="rt2-info-item" key={index}>
                <strong>{link.platform}</strong>
                <span>{link.url}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rt2-side-section">
          <h3>Core Skills</h3>
          <div className="rt2-skill-pill-list">
            {data.skills?.map((skill, index) => (
              <span key={index} className="rt2-skill-pill">
                {skill.name}
              </span>
            ))}
          </div>
        </div>

        <div className="rt2-side-section">
          <h3>Education</h3>
          <div className="rt2-info-list">
            {data.education?.map((edu, index) => (
              <div className="rt2-info-item" key={index}>
                <strong>{edu.degree}</strong>
                <span>{edu.fieldOfStudy}</span>
                <span>
                  {edu.institution?.name}
                  {edu.institution?.location ? ` · ${edu.institution.location}` : ""}
                </span>
                <span>
                  {edu.startYear} - {edu.endYear}
                </span>
              </div>
            ))}
          </div>
        </div>
      </aside>

      <main className="rt2-main">
        <section className="rt2-hero">
          <span className="rt2-eyebrow">Resume Template Two</span>
          <h1 className="rt2-name">{data.fullName || "Your Name"}</h1>
          <p className="rt2-headline">
            {data.headline ||
              "Backend engineer focused on scalable APIs, microservices, and clean production-ready systems."}
          </p>
          <p className="rt2-summary">
            {data.about || "Professional summary goes here."}
          </p>
        </section>

        <section className="rt2-section">
          <h2>Experience</h2>

          {data.experiences?.map((exp, index) => (
            <div key={index} className="rt2-entry">
              <div className="rt2-top-row">
                <div>
                  <h3 className="rt2-title">{exp.role}</h3>
                  <p className="rt2-subtitle">{exp.companyName}</p>
                </div>

                <span className="rt2-date">
                  {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                </span>
              </div>

              <p className="rt2-desc">{exp.description}</p>
            </div>
          ))}
        </section>

        <section className="rt2-section">
          <h2>Projects</h2>

          {data.projects?.map((project, index) => (
            <div key={index} className="rt2-entry">
              <div className="rt2-top-row">
                <div>
                  <h3 className="rt2-title">{project.title}</h3>
                </div>
              </div>

              <p className="rt2-desc">{project.description}</p>

              {project.techStack?.length > 0 && (
                <div className="rt2-chip-row">
                  {project.techStack.map((tech, i) => (
                    <span key={i} className="rt2-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>

        <section className="rt2-section">
          <h2>Achievements</h2>

          {data.achievements?.map((achievement, index) => (
            <div
              key={index}
              className={`rt2-entry ${
                index === data.achievements.length - 1 ? "rt2-entry-last" : ""
              }`}
            >
              <div className="rt2-top-row">
                <div>
                  <h3 className="rt2-title">{achievement.title}</h3>
                </div>
              </div>
              <p className="rt2-desc">{achievement.description}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default ResumeTemplateTwo;