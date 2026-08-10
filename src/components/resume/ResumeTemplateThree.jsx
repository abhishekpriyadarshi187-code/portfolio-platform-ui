import "../../styles/resume/ResumeTemplateThree.css";
import { categorizeSkillsAsObject } from "../../utils/skillCategories";

function ResumeTemplateThree({ data }) {
  const imageSrc = data?.profileImageUrl || data?.profilePhoto || "";
  const skills = (data?.skills || []).filter((skill) => skill?.name?.trim());
  const skillGroups = categorizeSkillsAsObject(skills);
  const topSkills = skills.slice(0, 5);
  const techSummary = topSkills.map((skill) => skill.name).join(" • ");
  const experienceYears = getExperienceYears(data?.experiences || []);
  const linkedin = (data?.socialLinks || []).find((link) =>
    (link?.platform || "").toLowerCase().includes("linkedin")
  );
  const location = getLocation(data);
  const primaryEducation = getPrimaryEducation(data?.education || []);
  const summaryText =
    data?.about?.trim() ||
    "Senior Software Engineer building scalable backend systems, resilient microservices, and production-ready cloud platforms.";
  const highlights = buildHighlights({ experienceYears, skills });

  return (
    <div className="rt3-shell">
      <header className="rt3-header">
        <div className="rt3-header-left">
          <div className="rt3-avatar-wrap">
            {imageSrc ? (
              <img src={imageSrc} alt={data?.fullName || "Profile"} className="rt3-avatar" />
            ) : (
              <div className="rt3-avatar rt3-avatar-placeholder">👤</div>
            )}
          </div>

          <div className="rt3-header-side-cards">
            {primaryEducation && (
              <div className="rt3-mini-card">
                <strong>{primaryEducation.degreeLine}</strong>
                <span>{primaryEducation.institutionLine}</span>
              </div>
            )}

            {experienceYears && (
              <div className="rt3-mini-card">
                <strong>{experienceYears}+ Years Experience</strong>
                <span>Building scalable systems</span>
              </div>
            )}
          </div>
        </div>

        <div className="rt3-identity">
          <h1 className="rt3-name">{data?.fullName || "Your Name"}</h1>
          <p className="rt3-role">{normalizeHeadline(data?.headline)}</p>

          <div className="rt3-meta">
            {data?.email && (
              <span className="rt3-meta-item">
                <span aria-hidden="true">✉</span>
                <span>{data.email}</span>
              </span>
            )}
            {linkedin?.url && (
              <span className="rt3-meta-item">
                <span aria-hidden="true">🔗</span>
                <span>LinkedIn</span>
              </span>
            )}
            {location && (
              <span className="rt3-meta-item">
                <span aria-hidden="true">📍</span>
                <span>{location}</span>
              </span>
            )}
            {experienceYears && (
              <span className="rt3-meta-item">
                <span aria-hidden="true">💼</span>
                <span>{experienceYears}+ Years Experience</span>
              </span>
            )}
          </div>

          {techSummary && <p className="rt3-header-skills">{techSummary}</p>}
        </div>
      </header>

      <main className="rt3-body">
        <section className="rt3-section">
          <h2 className="rt3-section-title">Professional Summary</h2>
          <div className="rt3-summary-card">
            <div className="rt3-summary">
              <p>{truncateSummary(summaryText)}</p>
            </div>
          </div>
        </section>

        {highlights.length > 0 && (
          <section className="rt3-section">
            <h2 className="rt3-section-title">Key Highlights</h2>
            <div className="rt3-highlight-chips rt3-career-snapshot">
              {highlights.map((item, index) => (
                <span key={index} className="rt3-highlight-chip">
                  <span aria-hidden="true">✓</span>
                  <span>{item}</span>
                </span>
              ))}
            </div>
          </section>
        )}

        {Object.keys(skillGroups).length > 0 && (
          <section className="rt3-section">
            <h2 className="rt3-section-title">Skills</h2>
            <div className="rt3-skill-matrix">
              {Object.entries(skillGroups).map(([groupName, groupSkills]) => (
                <div key={groupName} className="rt3-skill-group">
                  <strong className="rt3-skill-group-title">{groupName}</strong>
                  <p className="rt3-skill-group-line">
                    {groupSkills.map((skill) => skill.name).join(" • ")}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {(data?.experiences || []).length > 0 && (
          <section className="rt3-section">
            <h2 className="rt3-section-title">Experience</h2>
            <div className="rt3-timeline">
              {data.experiences.map((experience, index) => (
                <article key={index} className="rt3-experience-card">
                  <div className="rt3-card-header rt3-experience-header">
                    <div>
                      <p className="rt3-experience-role">{experience?.role || "Role"}</p>
                      <h3 className="rt3-card-title">{experience?.companyName || "Company"}</h3>
                    </div>
                    <span className="rt3-date-range">{formatExperienceRange(experience)}</span>
                  </div>

                  {renderBulletList(experience?.description)}
                </article>
              ))}
            </div>
          </section>
        )}

        {(data?.projects || []).length > 0 && (
          <section className="rt3-section">
            <h2 className="rt3-section-title">Projects</h2>
            <div className="rt3-project-grid">
              {data.projects.map((project, index) => (
                <article key={index} className="rt3-project-card">
                  <h3 className="rt3-card-title">{project?.title || "Project"}</h3>
                  {renderProjectContent(project?.description)}
                  {(project?.techStack || []).filter(Boolean).length > 0 && (
                    <div className="rt3-tech-stack">
                      <strong>Tech Stack</strong>
                      <div className="rt3-skill-chips rt3-skill-chips-compact">
                        {project.techStack.filter(Boolean).slice(0, 6).map((tech, techIndex) => (
                          <span key={`${tech}-${techIndex}`} className="rt3-skill-chip">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {(data?.education || []).length > 0 && (
          <section className="rt3-section">
            <h2 className="rt3-section-title">Education</h2>
            <div className="rt3-education-list">
              {data.education.map((education, index) => (
                <article key={index} className="rt3-education-card">
                  <div>
                    <h3 className="rt3-card-title">{education?.degree || "Degree"}</h3>
                    {education?.fieldOfStudy && (
                      <p className="rt3-card-subtitle rt3-education-specialization">
                        {formatFieldOfStudy(education.fieldOfStudy)}
                      </p>
                    )}
                    {education?.institution?.name && (
                      <p className="rt3-card-meta rt3-education-school">{education.institution.name}</p>
                    )}
                    {education?.institution?.location && (
                      <p className="rt3-card-meta">{education.institution.location}</p>
                    )}
                  </div>
                  <div className="rt3-education-meta">
                    <span>{formatEducationRange(education)}</span>
                    {education?.grade !== undefined && education?.grade !== null && education?.grade !== "" && (
                      <span>Grade: {education.grade}</span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(data?.achievements || []).length > 0 && (
          <section className="rt3-section">
            <h2 className="rt3-section-title">Achievements</h2>
            <div
              className={`rt3-achievement-grid ${
                data.achievements.length === 1 ? "rt3-achievement-grid-single" : ""
              }`}
            >
              {data.achievements.map((achievement, index) => (
                <article key={index} className="rt3-achievement-card">
                  <div className="rt3-achievement-icon">🏆</div>
                  <div>
                    <h3 className="rt3-card-title">{achievement?.title || "Achievement"}</h3>
                    {achievement?.description && <p className="rt3-card-meta">{achievement.description}</p>}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function normalizeHeadline(headline = "") {
  const normalized = headline.trim();
  if (!normalized) return "Senior Software Engineer";
  if (normalized.toLowerCase() === "sse") return "Senior Software Engineer";
  return normalized;
}

function truncateSummary(text = "") {
  const trimmed = text.trim();
  if (trimmed.length <= 250) return trimmed;
  return `${trimmed.slice(0, 247).trim()}...`;
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
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function getExperienceYears(experiences) {
  const validStarts = experiences
    .map((entry) => new Date(entry?.startDate || ""))
    .filter((date) => !Number.isNaN(date.getTime()));
  if (validStarts.length === 0) return "";
  const earliest = validStarts.reduce((min, current) => (current < min ? current : min), validStarts[0]);
  return Math.max(1, Math.floor((Date.now() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 365.25)));
}

function getLocation(data) {
  const educationLocation = (data?.education || []).find((entry) => entry?.institution?.location)?.institution?.location;
  return educationLocation || "";
}

function getPrimaryEducation(educationList) {
  if (!educationList?.length) return null;
  const ranked = [...educationList].sort((a, b) => {
    const degreeDiff = getDegreeScore(b?.degree) - getDegreeScore(a?.degree);
    if (degreeDiff !== 0) return degreeDiff;
    return (Number(b?.endYear) || 0) - (Number(a?.endYear) || 0);
  });
  const top = ranked[0];
  return {
    degreeLine: [top?.degree, top?.fieldOfStudy].filter(Boolean).join(" ") || top?.degree || "Education",
    institutionLine: top?.institution?.name || "",
  };
}

function getDegreeScore(degree = "") {
  const normalized = degree.toLowerCase();
  if (normalized.includes("phd") || normalized.includes("doctor")) return 5;
  if (normalized.includes("master") || normalized.includes("m.tech") || normalized.includes("ms")) return 4;
  if (normalized.includes("b.tech") || normalized.includes("bachelor") || normalized.includes("b.e")) return 3;
  if (normalized.includes("diploma")) return 2;
  return 1;
}

function formatFieldOfStudy(field = "") {
  const normalized = field.trim().toLowerCase();
  if (normalized === "cse") return "Computer Science Engineering";
  return field;
}

function buildHighlights({ experienceYears, skills }) {
  const names = skills.map((skill) => skill?.name?.toLowerCase() || "");
  const items = [];
  if (experienceYears) items.push(`${experienceYears}+ Years Experience`);
  if (names.some((name) => /(java|spring|backend)/.test(name))) items.push("Backend Engineering");
  if (names.some((name) => /(microservice|kafka|event)/.test(name))) items.push("Microservices Architecture");
  if (names.some((name) => /(aws|cloud|docker|kubernetes)/.test(name))) items.push("AWS Cloud");
  if (names.some((name) => /(kafka|event)/.test(name))) items.push("Event Driven Systems");
  if (names.some((name) => /(api|backend|spring)/.test(name))) items.push("Scalable APIs");
  return items.slice(0, 6);
}

function descriptionToItems(description = "") {
  const normalized = description
    .split(/\n+/)
    .map((part) => part.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  if (normalized.length > 1) return normalized.slice(0, 5);

  return description
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function renderBulletList(description = "") {
  const items = descriptionToItems(description);
  if (items.length === 0) return null;
  return (
    <ul className="rt3-bullet-list">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

function renderProjectContent(description = "") {
  const items = descriptionToItems(description);
  if (items.length === 0) return null;
  const [summary, ...rest] = items;
  return (
    <div className="rt3-project-copy">
      <p className="rt3-card-meta rt3-project-summary">{truncateProjectSummary(summary)}</p>
      {rest.length > 0 && (
        <ul className="rt3-bullet-list">
          {rest.slice(0, 5).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function truncateProjectSummary(text = "") {
  const trimmed = text.trim();
  if (trimmed.length <= 120) return trimmed;
  return `${trimmed.slice(0, 117).trim()}...`;
}

export default ResumeTemplateThree;
