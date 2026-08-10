import "../../styles/resume/ResumeTemplateOne.css";
import { categorizeSkills } from "../../utils/skillCategories";

function ResumeTemplateOne({ data }) {
  const skills = (data?.skills || []).filter((skill) => skill?.name?.trim());
  const contactItems = buildContactItems(data);
  const summaryText =
    data?.about?.trim() ||
    "Senior Software Engineer building scalable backend systems, production-grade platforms, and developer-friendly software solutions.";
  const skillGroups = categorizeSkills(skills);
  const hasSkillGroups = skillGroups.length > 0;

  return (
    <div className="rt1-shell">
      <header className="rt1-header">
        <h1 className="rt1-name">{data?.fullName || "Your Name"}</h1>
        <p className="rt1-headline">{normalizeHeadline(data?.headline)}</p>
        {contactItems.length > 0 && (
          <p className="rt1-contact-line">{contactItems.join(" | ")}</p>
        )}
      </header>

      <main className="rt1-body">
        <ResumeSection title="Professional Summary">
          <p className="rt1-text">{summaryText}</p>
        </ResumeSection>

        {hasSkillGroups && (
          <ResumeSection title="Skills">
            <div className="rt1-skill-groups">
              {skillGroups.map(({ label, items }) => (
                <p key={label} className="rt1-text rt1-skill-group-line">
                  <strong>{label}:</strong> {items.join(", ")}
                </p>
              ))}
            </div>
          </ResumeSection>
        )}

        {(data?.experiences || []).length > 0 && (
          <ResumeSection title="Experience">
            {data.experiences.map((experience, index) => (
              <article key={index} className="rt1-entry rt1-avoid-break">
                <div className="rt1-entry-header">
                  <div className="rt1-entry-primary">
                    <h3 className="rt1-entry-title">{experience?.role || "Role"}</h3>
                    <p className="rt1-entry-subtitle">{experience?.companyName || "Company"}</p>
                  </div>
                  <span className="rt1-entry-date">{formatExperienceRange(experience)}</span>
                </div>
                {renderDescription(experience?.description)}
              </article>
            ))}
          </ResumeSection>
        )}

        {(data?.projects || []).length > 0 && (
          <ResumeSection
            title="Projects"
            sectionClassName="rt1-projects-section"
            keepTitleWithFirstItem
          >
            {data.projects.map((project, index) => (
              <article key={index} className="rt1-entry rt1-project-entry rt1-avoid-break">
                <div className="rt1-entry-header">
                  <div className="rt1-entry-primary">
                    <h3 className="rt1-entry-title">{project?.title || "Project"}</h3>
                    {project?.link?.trim() && (
                      <p className="rt1-entry-subtitle">{project.link.trim()}</p>
                    )}
                  </div>
                </div>
                {project?.techStack?.filter(Boolean).length > 0 && (
                  <p className="rt1-text rt1-project-tech-stack">
                    <strong>Tech Stack:</strong> {project.techStack.filter(Boolean).join(" | ")}
                  </p>
                )}
                {renderProjectDescription(project?.description)}
              </article>
            ))}
          </ResumeSection>
        )}

        {(data?.education || []).length > 0 && (
          <ResumeSection title="Education">
            {data.education.map((education, index) => (
              <article key={index} className="rt1-entry rt1-avoid-break">
                <div className="rt1-entry-header">
                  <div className="rt1-entry-primary">
                    <h3 className="rt1-entry-title">{education?.degree || "Degree"}</h3>
                    <p className="rt1-entry-subtitle">
                      {[
                        formatFieldOfStudy(education?.fieldOfStudy),
                        education?.institution?.name,
                        education?.institution?.location,
                      ]
                        .filter(Boolean)
                        .join(" | ")}
                    </p>
                  </div>
                  <span className="rt1-entry-date">{formatEducationRange(education)}</span>
                </div>
                {(education?.grade || education?.institution?.institutionType) && (
                  <p className="rt1-text">
                    {[education?.grade ? `Grade: ${education.grade}` : "", education?.institution?.institutionType]
                      .filter(Boolean)
                      .join(" | ")}
                  </p>
                )}
              </article>
            ))}
          </ResumeSection>
        )}

        {(data?.achievements || []).length > 0 && (
          <ResumeSection title="Achievements">
            {data.achievements.map((achievement, index) => (
              <article key={index} className="rt1-entry rt1-avoid-break">
                <div className="rt1-entry-header">
                  <div className="rt1-entry-primary">
                    <h3 className="rt1-entry-title">{achievement?.title || "Achievement"}</h3>
                    {(achievement?.type || achievement?.date) && (
                      <p className="rt1-entry-subtitle">
                        {[achievement?.type, formatDate(achievement?.date)].filter(Boolean).join(" | ")}
                      </p>
                    )}
                  </div>
                </div>
                {achievement?.description && <p className="rt1-text">{achievement.description}</p>}
              </article>
            ))}
          </ResumeSection>
        )}
      </main>
    </div>
  );
}

function ResumeSection({
  title,
  children,
  sectionClassName = "",
  keepTitleWithFirstItem = false,
}) {
  const items = Array.isArray(children) ? children : [children];
  const [firstItem, ...restItems] = items.filter(Boolean);

  return (
    <section className={`rt1-section ${sectionClassName}`.trim()}>
      {keepTitleWithFirstItem && firstItem ? (
        <div className="rt1-section-intro rt1-avoid-break">
          <h2 className="rt1-section-title">{title}</h2>
          <div className="rt1-section-body">
            {firstItem}
          </div>
        </div>
      ) : (
        <h2 className="rt1-section-title">{title}</h2>
      )}
      <div className="rt1-section-body">
        {keepTitleWithFirstItem ? restItems : items}
      </div>
    </section>
  );
}

export default ResumeTemplateOne;

function buildContactItems(data) {
  const items = [];

  if (data?.email) {
    items.push(data.email);
  }

  (data?.socialLinks || []).forEach((link) => {
    if (!link?.url) return;
    items.push(link.url.trim());
  });

  return items;
}

function normalizeHeadline(headline = "") {
  const normalized = headline.trim();
  if (!normalized) return "Senior Software Engineer";
  if (normalized.toLowerCase() === "sse") return "Senior Software Engineer";
  return normalized;
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

function formatExperienceRange(experience) {
  const start = formatDate(experience?.startDate);
  const end = experience?.current ? "Present" : formatDate(experience?.endDate);
  return [start, end].filter(Boolean).join(" - ");
}

function formatEducationRange(education) {
  return [education?.startYear, education?.endYear].filter(Boolean).join(" - ");
}

function formatFieldOfStudy(field = "") {
  if (!field) return "";
  return field.trim().toLowerCase() === "cse" ? "Computer Science Engineering" : field;
}

function descriptionToItems(description = "") {
  const lines = description
    .split(/\n+/)
    .map((part) => part.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

  if (lines.length > 1) return lines.slice(0, 6);

  return description
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 5);
}

function renderDescription(description = "") {
  const items = descriptionToItems(description);
  if (items.length === 0) return null;
  if (items.length === 1) return <p className="rt1-text">{items[0]}</p>;

  return (
    <ul className="rt1-bullet-list">
      {items.map((item, index) => (
        <li key={index} className="rt1-bullet-item">
          <span className="rt1-bullet-marker" aria-hidden="true">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function renderProjectDescription(description = "") {
  const items = descriptionToItems(description);
  if (items.length === 0) return null;

  return (
    <ul className="rt1-bullet-list">
      {items.map((item, index) => (
        <li key={index} className="rt1-bullet-item">
          <span className="rt1-bullet-marker" aria-hidden="true">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
