import "../../styles/resume/ResumeTemplateOne.css";

function ResumeTemplateOne({ data }) {
  const skills = (data.skills || []).filter((skill) => skill?.name?.trim());
  const techSummary = skills
    .slice(0, 5)
    .map((skill) => skill.name)
    .filter(Boolean)
    .join(" • ");

  return (
    <div className="rt1-shell">
      <section className="rt1-hero">
        <div className="rt1-hero-left">
          <h1 className="rt1-name">{data.fullName || "Your Name"}</h1>
          <p className="rt1-headline">{normalizeHeadline(data.headline)}</p>
          {techSummary && <p className="rt1-tech-summary">{techSummary}</p>}
          <p className="rt1-summary">
            {truncateSummary(
              data.about ||
                "Senior Software Engineer building scalable backend systems and high-impact production platforms."
            )}
          </p>
        </div>

        <div className="rt1-hero-right">
          <p className="rt1-contact-title">Contact</p>

          {data.email && (
            <div className="rt1-contact-item">
              <strong>Email</strong>
              <span>{data.email}</span>
            </div>
          )}

          {data.socialLinks?.filter((link) => link?.url).map((link, index) => (
            <div className="rt1-contact-item" key={index}>
              <strong>{link.platform || "Link"}</strong>
              <span>{link.url}</span>
            </div>
          ))}

          {data.experiences?.length > 0 && (
            <div className="rt1-contact-item rt1-contact-highlight">
              <strong>Experience</strong>
              <span>{getExperienceYears(data.experiences)}+ years building production systems</span>
            </div>
          )}
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
                    <h3 className="rt1-title">{exp.role || "Role"}</h3>
                    <p className="rt1-subtitle">{exp.companyName || "Company"}</p>
                  </div>

                  <span className="rt1-date">
                    {formatExperienceRange(exp)}
                  </span>
                </div>

                {renderDescription(exp.description)}
              </div>
            ))}
          </div>

          <div className="rt1-section">
            <h2>Projects</h2>

            {data.projects?.map((project, index) => (
              <div key={index} className="rt1-entry">
                <div className="rt1-top-row">
                  <div>
                    <h3 className="rt1-title">{project.title || "Project"}</h3>
                  </div>
                  {project.link?.trim() && <span className="rt1-date">{getDisplayLink(project.link)}</span>}
                </div>

                {renderProjectDescription(project.description)}

                {project.techStack?.length > 0 && (
                  <div className="rt1-chip-wrap">
                    {project.techStack.filter(Boolean).slice(0, 6).map((tech, i) => (
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
              {skills.map((skill, index) => (
                <div key={index} className="rt1-skill-row">
                  <strong>{skill.name}</strong>
                  {(skill.yearsOfExperience || skill.level) && (
                    <span>
                      {[
                        skill.yearsOfExperience
                          ? `${skill.yearsOfExperience} year${skill.yearsOfExperience > 1 ? "s" : ""}`
                          : "",
                        skill.level ? formatLevel(skill.level) : "",
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </span>
                  )}
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
                      <p className="rt1-subtitle">{formatFieldOfStudy(edu.fieldOfStudy)}</p>
                    </div>
                    <span className="rt1-date">
                      {formatEducationRange(edu)}
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
                  <h3 className="rt1-title">{achievement.title || "Achievement"}</h3>
                  {achievement.description && <p className="rt1-desc">{achievement.description}</p>}
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

function normalizeHeadline(headline = "") {
  const normalized = headline.trim();
  if (!normalized) return "Senior Software Engineer";
  if (normalized.toLowerCase() === "sse") return "Senior Software Engineer";
  return normalized;
}

function truncateSummary(text = "") {
  const trimmed = text.trim();
  if (trimmed.length <= 260) return trimmed;
  return `${trimmed.slice(0, 257).trim()}...`;
}

function formatLevel(level = "") {
  const normalized = level.trim();
  if (!normalized) return "";
  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function formatExperienceRange(exp) {
  const start = formatDate(exp?.startDate);
  const end = exp?.current ? "Present" : formatDate(exp?.endDate);
  return [start, end].filter(Boolean).join(" - ");
}

function formatEducationRange(edu) {
  return [edu?.startYear, edu?.endYear].filter(Boolean).join(" - ");
}

function formatFieldOfStudy(field = "") {
  if (!field) return "";
  return field.trim().toLowerCase() === "cse" ? "Computer Science Engineering" : field;
}

function getExperienceYears(experiences = []) {
  const validStarts = experiences
    .map((entry) => new Date(entry?.startDate || ""))
    .filter((date) => !Number.isNaN(date.getTime()));
  if (validStarts.length === 0) return 0;
  const earliest = validStarts.reduce((min, current) => (current < min ? current : min), validStarts[0]);
  return Math.max(1, Math.floor((Date.now() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365.25)));
}

function descriptionToItems(description = "") {
  const lines = description
    .split(/\n+/)
    .map((part) => part.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length > 1) return lines.slice(0, 5);

  return description
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 4);
}

function renderDescription(description = "") {
  const items = descriptionToItems(description);
  if (items.length === 0) return null;
  if (items.length === 1) return <p className="rt1-desc">{items[0]}</p>;
  return (
    <ul className="rt1-bullet-list">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function renderProjectDescription(description = "") {
  const items = descriptionToItems(description);
  if (items.length === 0) return null;
  const [summary, ...rest] = items;
  return (
    <div className="rt1-project-copy">
      <p className="rt1-desc rt1-project-summary">{summary}</p>
      {rest.length > 0 && (
        <ul className="rt1-bullet-list">
          {rest.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function getDisplayLink(link = "") {
  try {
    const url = new URL(link);
    return url.hostname.replace(/^www\./, "");
  } catch {
    return link;
  }
}
