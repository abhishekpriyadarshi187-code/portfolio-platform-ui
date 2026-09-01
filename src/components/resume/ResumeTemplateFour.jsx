import "../../styles/resume/ResumeTemplateFour.css";
import { categorizeSkills } from "../../utils/skillCategories";

function ResumeTemplateFour({ data }) {
  const skills = (data?.skills || []).filter((skill) => skill?.name?.trim());
  const skillGroups = categorizeSkills(skills);
  const contactItems = buildContactItems(data);
  const summaryText =
    data?.professionalSummary?.trim() ||
    data?.about?.trim() ||
    "Software engineer building reliable, scalable, and production-ready applications.";

  return (
    <div className="rt4-shell">
      <header className="rt4-header">
        <h1 className="rt4-name">{data?.fullName || "Your Name"}</h1>
        <p className="rt4-headline">{normalizeHeadline(data?.headline)}</p>
        {contactItems.length > 0 && (
          <p className="rt4-contact">{contactItems.join(" | ")}</p>
        )}
      </header>

      <main className="rt4-body">
        <ResumeSection title="Professional Summary">
          <p className="rt4-text">{summaryText}</p>
        </ResumeSection>

        {skillGroups.length > 0 && (
          <ResumeSection title="Skills">
            <div className="rt4-skill-groups">
              {skillGroups.map(({ label, items }) => (
                <p key={label} className="rt4-text rt4-skill-line">
                  <strong>{label}:</strong> {items.join(", ")}
                </p>
              ))}
            </div>
          </ResumeSection>
        )}

        {(data?.experiences || []).length > 0 && (
          <ResumeSection title="Professional Experience">
            {data.experiences.map((experience, index) => (
              <article key={index} className="rt4-entry">
                <div className="rt4-entry-header">
                  <div className="rt4-entry-primary">
                    <h3 className="rt4-entry-title">{experience?.role || "Role"}</h3>
                    <p className="rt4-entry-subtitle">
                      {[experience?.companyName || "Company", formatExperienceRange(experience)]
                        .filter(Boolean)
                        .join(" | ")}
                    </p>
                  </div>
                </div>
                {renderDescription(experience?.description)}
              </article>
            ))}
          </ResumeSection>
        )}

        {(data?.education || []).length > 0 && (
          <ResumeSection title="Education">
            {data.education.map((education, index) => (
              <article key={index} className="rt4-entry">
                <div className="rt4-entry-header">
                  <div className="rt4-entry-primary">
                    <h3 className="rt4-entry-title">
                      {[education?.degree, formatFieldOfStudy(education?.fieldOfStudy)]
                        .filter(Boolean)
                        .join(" in ") || "Degree"}
                    </h3>
                    <p className="rt4-entry-subtitle">
                      {[
                        education?.institution?.name,
                        education?.institution?.location,
                        formatEducationRange(education),
                      ]
                        .filter(Boolean)
                        .join(" | ")}
                    </p>
                  </div>
                </div>
                {education?.grade !== undefined &&
                  education?.grade !== null &&
                  education?.grade !== "" && (
                    <p className="rt4-text">Grade: {education.grade}</p>
                  )}
              </article>
            ))}
          </ResumeSection>
        )}

        {(data?.achievements || []).length > 0 && (
          <ResumeSection title="Achievements">
            {data.achievements.map((achievement, index) => (
              <article key={index} className="rt4-entry">
                <div className="rt4-entry-header">
                  <div className="rt4-entry-primary">
                    <h3 className="rt4-entry-title">{achievement?.title || "Achievement"}</h3>
                    {(achievement?.type || achievement?.date) && (
                      <p className="rt4-entry-subtitle">
                        {[achievement.type, formatDate(achievement.date)]
                          .filter(Boolean)
                          .join(" | ")}
                      </p>
                    )}
                  </div>
                </div>
                {achievement?.description && (
                  <p className="rt4-text">{achievement.description}</p>
                )}
              </article>
            ))}
          </ResumeSection>
        )}
      </main>
    </div>
  );
}

function ResumeSection({ title, children }) {
  const items = (Array.isArray(children) ? children : [children]).filter(Boolean);
  const [firstItem, ...restItems] = items;

  return (
    <section className="rt4-section">
      <div className="rt4-section-intro">
        <h2 className="rt4-section-title">{title.toUpperCase()}</h2>
        {firstItem && <div className="rt4-section-body">{firstItem}</div>}
      </div>
      {restItems.length > 0 && <div className="rt4-section-body">{restItems}</div>}
    </section>
  );
}

function buildContactItems(data) {
  return [
    data?.email?.trim(),
    data?.mobileNumber?.trim(),
    ...(data?.socialLinks || []).map((link) => link?.url?.trim()),
  ].filter(Boolean);
}

function normalizeHeadline(headline = "") {
  const normalized = headline.trim();
  if (!normalized) return "Software Engineer";
  if (normalized.toLowerCase() === "sse") return "Senior Software Engineer";
  return normalized;
}

function formatExperienceRange(experience) {
  const start = formatDate(experience?.startDate);
  const end = experience?.current ? "Present" : formatDate(experience?.endDate);
  return [start, end].filter(Boolean).join(" - ");
}

function formatEducationRange(education) {
  return [education?.startYear, education?.endYear].filter(Boolean).join(" - ");
}

function formatDate(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
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

  if (lines.length > 1) return lines;

  return description
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function renderDescription(description = "") {
  const items = descriptionToItems(description);
  if (items.length === 0) return null;
  if (items.length === 1) return <p className="rt4-text rt4-entry-description">{items[0]}</p>;

  return (
    <ul className="rt4-bullet-list">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export default ResumeTemplateFour;
