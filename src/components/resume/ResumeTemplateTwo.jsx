import "../../styles/resume/ResumeTemplateTwo.css";

function ResumeTemplateTwo({ data }) {
  const imageSrc = data.profileImageUrl || data.profilePhoto || "";
  const skills = (data.skills || []).filter((skill) => skill?.name?.trim());
  const techSummary = skills
    .slice(0, 5)
    .map((skill) => skill?.name?.trim())
    .filter(Boolean)
    .join(" • ");
  const summaryText =
    data.about ||
    "Backend engineer focused on scalable APIs, microservices, and clean production-ready systems.";

  return (
    <div className="rt2-shell">
      <aside className="rt2-sidebar">
        <div className="rt2-sidebar-inner">
          <div className="rt2-profile-block">
            {imageSrc ? (
              <img src={imageSrc} alt="Profile" className="rt2-photo" />
            ) : (
              <div className="rt2-photo rt2-photo-placeholder">👤</div>
            )}

            <div className="rt2-profile-copy">
              <h2 className="rt2-photo-name">{data.fullName || "Your Name"}</h2>
              <p className="rt2-photo-role">
                {data.headline || "Senior Software Engineer"}
              </p>
            </div>
          </div>

          {(data.email || (data.socialLinks || []).length > 0) && (
            <div className="rt2-side-section">
              <h3>Contact</h3>
              <div className="rt2-contact-list">
                {data.email && (
                  <div className="rt2-contact-item">
                    <span className="rt2-contact-icon">✉</span>
                    <div className="rt2-contact-copy">
                      <strong>Email</strong>
                      <span>{data.email}</span>
                    </div>
                  </div>
                )}

                {data.socialLinks?.map((link, index) => (
                  <div className="rt2-contact-item" key={index}>
                    <span className="rt2-contact-icon">{getContactIcon(link?.platform)}</span>
                    <div className="rt2-contact-copy">
                      <strong>{link.platform || "Link"}</strong>
                      <span>{link.url}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="rt2-side-section">
              <h3>Skills</h3>
              <div className="rt2-skill-list">
                {skills.map((skill, index) => (
                  <div key={index} className="rt2-skill-item">
                    <strong>{skill.name}</strong>
                    {(skill.level || skill.yearsOfExperience) && (
                      <span>
                        {[
                          skill.level ? formatLevel(skill.level) : "",
                          skill.yearsOfExperience
                            ? `${skill.yearsOfExperience} yr${skill.yearsOfExperience > 1 ? "s" : ""}`
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {(data.education || []).length > 0 && (
            <div className="rt2-side-section">
              <h3>Education</h3>
              <div className="rt2-education-list">
                {data.education?.map((edu, index) => (
                  <div className="rt2-education-item" key={index}>
                    <strong>{edu.degree || "Degree"}</strong>
                    {edu.fieldOfStudy && <span className="rt2-education-field">{edu.fieldOfStudy}</span>}
                    <span className="rt2-education-school">
                      {edu.institution?.name || ""}
                    </span>
                    {edu.institution?.location && (
                      <span className="rt2-education-meta">{edu.institution.location}</span>
                    )}
                    <span className="rt2-education-years">
                      {formatEducationRange(edu)}
                    </span>
                    {(edu.grade || edu.institution?.institutionType) && (
                      <span className="rt2-education-meta">
                        {[edu.grade ? `Grade: ${edu.grade}` : "", edu.institution?.institutionType || ""]
                          .filter(Boolean)
                          .join(" • ")}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      <main className="rt2-main">
        <section className="rt2-hero">
          <h1 className="rt2-name">{data.fullName || "Your Name"}</h1>
          <p className="rt2-headline">
            {data.headline || "Senior Software Engineer"}
          </p>
          {techSummary && <p className="rt2-tech-summary">{techSummary}</p>}
          <div className="rt2-summary-block">
            <h2 className="rt2-section-heading">Professional Summary</h2>
            <p className="rt2-summary">{summaryText}</p>
          </div>
        </section>

        {(data.experiences || []).length > 0 && (
          <section className="rt2-section">
            <h2 className="rt2-section-heading">Experience</h2>

            {data.experiences?.map((exp, index) => (
              <div key={index} className="rt2-entry rt2-experience-entry">
                <div className="rt2-top-row">
                  <div>
                    <h3 className="rt2-title">{exp.companyName || "Company"}</h3>
                    <p className="rt2-subtitle">{exp.role || "Role"}</p>
                  </div>
                  <div className="rt2-date-wrap">
                    <span className="rt2-date">{formatExperienceRange(exp)}</span>
                  </div>
                </div>

                {renderDescription(exp.description)}
              </div>
            ))}
          </section>
        )}

        {(data.projects || []).length > 0 && (
          <section className="rt2-section">
            <h2 className="rt2-section-heading">Projects</h2>

            {data.projects?.map((project, index) => (
              <div key={index} className="rt2-entry rt2-project-entry">
                <div className="rt2-top-row">
                  <div>
                    <h3 className="rt2-title">{project.title || "Project"}</h3>
                  </div>
                  {project.link?.trim() && (
                    <span className="rt2-link-text">{getDisplayLink(project.link)}</span>
                  )}
                </div>

                {renderProjectDescription(project.description)}

                {project.techStack?.length > 0 && (
                  <div className="rt2-chip-row">
                    {project.techStack.slice(0, 6).map((tech, i) => (
                      <span key={i} className="rt2-chip">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </section>
        )}

        {(data.achievements || []).length > 0 && (
          <section className="rt2-section">
            <h2 className="rt2-section-heading">Achievements</h2>

            {data.achievements?.map((achievement, index) => (
              <div
                key={index}
                className={`rt2-entry rt2-achievement-entry ${
                  index === data.achievements.length - 1 ? "rt2-entry-last" : ""
                }`}
              >
                <div className="rt2-top-row">
                  <div className="rt2-achievement-title-wrap">
                    <span className="rt2-achievement-dot" />
                    <h3 className="rt2-title">{achievement.title || "Achievement"}</h3>
                  </div>
                  {(achievement.type || achievement.date) && (
                    <div className="rt2-meta-row">
                      {achievement.type && <span className="rt2-chip subtle">{achievement.type}</span>}
                      {achievement.date && (
                        <span className="rt2-chip subtle">{formatDate(achievement.date)}</span>
                      )}
                    </div>
                  )}
                </div>
                {achievement.description && <p className="rt2-desc">{achievement.description}</p>}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

function formatExperienceRange(experience) {
  const start = formatDate(experience?.startDate);
  const end = experience?.current ? "Present" : formatDate(experience?.endDate);
  return [start, end].filter(Boolean).join(" - ");
}

function formatEducationRange(education) {
  const start = education?.startYear || "";
  const end = education?.endYear || "";
  return [start, end].filter(Boolean).join(" - ");
}

function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatLevel(level = "") {
  const normalized = level.trim();
  if (!normalized) return "";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

function getContactIcon(platform = "") {
  const normalized = platform.toLowerCase();
  if (normalized.includes("linkedin")) return "in";
  if (normalized.includes("github")) return "{}";
  if (normalized.includes("portfolio")) return "•";
  return "↗";
}

function getDisplayLink(link = "") {
  try {
    const url = new URL(link);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return link;
  }
}

function renderDescription(description = "") {
  const items = descriptionToItems(description);
  if (items.length === 0) {
    return null;
  }

  if (items.length === 1) {
    return <p className="rt2-desc">{items[0]}</p>;
  }

  return (
    <ul className="rt2-bullet-list">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function renderProjectDescription(description = "") {
  const items = descriptionToItems(description);
  if (items.length === 0) {
    return null;
  }

  const [summary, ...rest] = items;

  return (
    <div className="rt2-project-copy">
      <p className="rt2-desc rt2-project-summary">{summary}</p>
      {rest.length > 0 && (
        <ul className="rt2-bullet-list rt2-project-bullets">
          {rest.slice(0, 5).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function descriptionToItems(description = "") {
  const normalized = description
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (normalized.length > 1) {
    return normalized;
  }

  return description
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4);
}

export default ResumeTemplateTwo;
