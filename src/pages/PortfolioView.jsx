import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/portfolio/PortfolioView.css";
import { setTheme, getTheme } from "../utils/theme";
import ResumeBuilder from "./ResumeBuilder";

const emptyProfile = {
  fullName: "",
  headline: "",
  about: "",
  profilePhoto: "",
  skills: [],
  experiences: [],
  projects: [],
  education: [],
  achievements: [],
  socialLinks: [],
};

function PortfolioView({ isOwner = true }) {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(emptyProfile);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [theme, setThemeState] = useState("light");

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
  const saved = getTheme();
  setThemeState(saved);
  setTheme(saved);
 }, []);

 const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    setTheme(newTheme);
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:8080/api/v1/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const text = await response.text();

      let data = null;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message || `Failed to load profile (${response.status})`
        );
      }

      setProfile(data || emptyProfile);
    } catch (err) {
      console.error("Failed to load profile:", err);
      setError(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const sections = useMemo(
    () =>
      [
        { id: "about", label: "About", visible: !!profile.about },
        { id: "skills", label: "Skills", visible: profile.skills.length > 0 },
        {
          id: "experience",
          label: "Experience",
          visible: profile.experiences.length > 0,
        },
        {
          id: "projects",
          label: "Projects",
          visible: profile.projects.length > 0,
        },
        {
          id: "education",
          label: "Education",
          visible: profile.education.length > 0,
        },
        {
          id: "achievements",
          label: "Achievements",
          visible: profile.achievements.length > 0,
        },
        {
          id: "contact",
          label: "Contact",
          visible: profile.socialLinks.length > 0,
        },
      ].filter((section) => section.visible),
    [profile]
  );

  const handleEditProfile = () => {
    navigate("/profile");
  };

  const handleResumeClick = () => {
    navigate("/resume");
  };

  if (loading) {
    return (
      <div className="portfolio-loading-page">
        <div className="portfolio-loading-box">Loading portfolio...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="portfolio-loading-page">
        <div className="portfolio-error-box">{error}</div>
      </div>
    );
  }

  return (
    <div className="portfolio-page">
      <header className="portfolio-navbar">
        <div className="portfolio-brand">
          {profile.fullName || "Portfolio"}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <nav className="portfolio-nav-links">
          {sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>
        <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "🌙" : "☀️"}
        </button>
        </div>
      </header>

      <main className="portfolio-main">
        <section className="portfolio-hero-card">
          <div className="portfolio-hero-left">
            <div className="portfolio-avatar-shell">
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={profile.fullName || "Profile"}
                  className="portfolio-avatar"
                />
              ) : (
                <div className="portfolio-avatar-placeholder">👤</div>
              )}
            </div>

            <div className="portfolio-hero-content">
              <span className="portfolio-kicker">
                {/* Professional Portfolio */}
                </span>
              <h1>{profile.fullName || "Your Name"}</h1>
              <p className="portfolio-headline">
                {profile.headline || "Your professional headline"}
              </p>

              {profile.socialLinks.length > 0 && (
                <div className="portfolio-social-pills">
                  {profile.socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="portfolio-social-pill"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="portfolio-hero-actions">
            <button className="portfolio-primary-btn" onClick={handleResumeClick}>
              Download Resume
            </button>

            {isOwner && (
              <button
                className="portfolio-secondary-btn"
                onClick={handleEditProfile}
              >
                Edit Profile
              </button>
            )}
          </div>
        </section>

        {profile.about && (
          <section id="about" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Introduction</span>
              <h2>About</h2>
            </div>

            <div className="portfolio-card">
              <p className="portfolio-about-text">{profile.about}</p>
            </div>
          </section>
        )}

        {profile.skills.length > 0 && (
          <section id="skills" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Capabilities</span>
              <h2>Skills</h2>
            </div>

            <div className="portfolio-card">
              <div className="portfolio-skills-grid">
                {profile.skills.map((skill, index) => (
                  <div className="portfolio-skill-card" key={index}>
                    <div className="portfolio-skill-top">
                      <h3>{skill.name}</h3>
                    </div>
                    <p>
                      {skill.yearsOfExperience} year
                      {skill.yearsOfExperience > 1 ? "s" : ""} experience
                    </p>
                    <span className="portfolio-skill-level">
                      {formatLevel(skill.level)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {profile.experiences.length > 0 && (
          <section id="experience" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Career Journey</span>
              <h2>Experience</h2>
            </div>

            <div className="portfolio-alternate-timeline">
              {profile.experiences.map((experience, index) => (
                <div
                  key={index}
                  className={`portfolio-timeline-item ${
                    index % 2 === 0 ? "timeline-left" : "timeline-right"
                  }`}
                >
                  <div className="portfolio-timeline-dot" />

                  <div className="portfolio-card portfolio-experience-card">
                    <div className="portfolio-card-top">
                      <div>
                        <h3>{experience.role}</h3>
                        <p className="portfolio-company-name">
                          {experience.companyName}
                        </p>
                      </div>

                      <span className="portfolio-duration">
                        {formatExperienceDuration(experience)}
                      </span>
                    </div>

                    {experience.current && (
                      <span className="portfolio-current-badge">Current</span>
                    )}

                    {experience.description && (
                      <p className="portfolio-card-text">
                        {experience.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.projects.length > 0 && (
          <section id="projects" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Selected Work</span>
              <h2>Projects</h2>
            </div>

            <div className="portfolio-project-grid">
              {profile.projects.map((project, index) => (
                <div className="portfolio-card portfolio-project-card" key={index}>
                  <div className="portfolio-card-top">
                    <h3>{project.title}</h3>

                    {project.link?.trim() && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        className="portfolio-link-btn"
                      >
                        View Project
                      </a>
                    )}
                  </div>

                  {project.description && (
                    <p className="portfolio-card-text">{project.description}</p>
                  )}

                  {project.techStack?.length > 0 && (
                    <div className="portfolio-chip-list">
                      {project.techStack.map((tech, techIndex) => (
                        <span className="portfolio-chip" key={techIndex}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.education.length > 0 && (
          <section id="education" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Academic Background</span>
              <h2>Education</h2>
            </div>

            <div className="portfolio-stack-list">
              {profile.education.map((education, index) => (
                <div className="portfolio-card" key={index}>
                  <div className="portfolio-card-top">
                    <div>
                      <h3>{education.degree}</h3>
                      <p className="portfolio-education-field">
                        {education.fieldOfStudy}
                      </p>
                    </div>

                    <span className="portfolio-duration">
                      {education.startYear}
                      {education.endYear ? ` — ${education.endYear}` : ""}
                    </span>
                  </div>

                  <p className="portfolio-card-text portfolio-education-inst">
                    {education.institution?.name}
                    {education.institution?.location
                      ? ` • ${education.institution.location}`
                      : ""}
                  </p>

                  <div className="portfolio-chip-list">
                    {education.institution?.institutionType && (
                      <span className="portfolio-chip subtle">
                        {education.institution.institutionType}
                      </span>
                    )}

                    {education.grade && (
                      <span className="portfolio-chip subtle">
                        Grade: {education.grade}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.achievements.length > 0 && (
          <section id="achievements" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Recognition</span>
              <h2>Achievements</h2>
            </div>

            <div className="portfolio-achievement-grid">
              {profile.achievements.map((achievement, index) => (
                <div className="portfolio-card portfolio-achievement-card" key={index}>
                  <div className="portfolio-achievement-icon">🏆</div>
                  <h3>{achievement.title}</h3>
                  <p className="portfolio-card-text">{achievement.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {profile.socialLinks.length > 0 && (
          <section id="contact" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Connect</span>
              <h2>Contact</h2>
            </div>

            <div className="portfolio-card">
              <div className="portfolio-contact-list">
                {profile.socialLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="portfolio-contact-item"
                  >
                    <span>{link.platform}</span>
                    <span>→</span>
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function formatLevel(level) {
  if (!level) return "";
  const lower = level.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
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

function formatExperienceDuration(experience) {
  const start = formatDate(experience.startDate);
  const end = experience.current ? "Present" : formatDate(experience.endDate);
  return `${start}${end ? ` — ${end}` : ""}`;
}

export default PortfolioView;