import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/portfolio/PortfolioView.css";
import { getTheme, setTheme } from "../utils/theme";

const emptyProfile = {
  fullName: "",
  headline: "",
  about: "",
  email: "",
  profilePhoto: "",
  profileImageUrl: "",
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

  const imageSrc = profile?.profilePhoto || profile?.profileImageUrl || "";
  const primaryEducation = useMemo(
    () => getPrimaryEducation(profile?.education || []),
    [profile?.education]
  );
  const experienceYears = useMemo(
    () => getExperienceYears(profile?.experiences || []),
    [profile?.experiences]
  );
  const featuredSkills = useMemo(
    () => (profile?.skills || []).slice(0, 7),
    [profile?.skills]
  );
  const heroTechStack = useMemo(() => {
    const skills = (profile?.skills || [])
      .map((skill) => skill?.name?.trim())
      .filter(Boolean)
      .slice(0, 5);

    if (skills.length > 0) {
      return skills.join(" • ");
    }

    return "Java • Spring Boot • Microservices • Kafka • AWS";
  }, [profile?.skills]);
  const displayHeadline = useMemo(
    () => getDisplayHeadline(profile?.headline),
    [profile?.headline]
  );
  const heroSummary = useMemo(() => {
    const about = profile?.about?.trim() || "";
    if (!about) {
      return "Building reliable products, scalable backend systems, and developer-friendly experiences.";
    }

    if (about.length <= 220) {
      return about;
    }

    return `${about.slice(0, 217).trim()}...`;
  }, [profile?.about]);
  const contactItems = useMemo(() => {
    const links = profile?.socialLinks || [];
    const items = [];

    if (profile?.email) {
      items.push({
        label: "Email",
        value: profile.email,
        href: `mailto:${profile.email}`,
      });
    }

    links.forEach((link) => {
      if (!link?.url) return;
      items.push({
        label: link.platform || "Link",
        value: link.url,
        href: link.url,
      });
    });

    return items;
  }, [profile]);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const rootElement = document.getElementById("root");
    rootElement?.classList.add("portfolio-root");

    return () => {
      rootElement?.classList.remove("portfolio-root");
    };
  }, []);

  useEffect(() => {
    const savedTheme = getTheme();
    setThemeState(savedTheme);
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setThemeState(nextTheme);
    setTheme(nextTheme);
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
        throw new Error(data?.message || `Failed to load profile (${response.status})`);
      }

      setProfile(
        data
          ? {
              ...data,
              profilePhoto: data.profileImageUrl || "",
              profileImageUrl: data.profileImageUrl || "",
            }
          : emptyProfile
      );
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
        { id: "about", label: "About", visible: !!profile?.about },
        { id: "skills", label: "Skills", visible: (profile?.skills || []).length > 0 },
        {
          id: "experience",
          label: "Experience",
          visible: (profile?.experiences || []).length > 0,
        },
        {
          id: "projects",
          label: "Projects",
          visible: (profile?.projects || []).length > 0,
        },
        {
          id: "education",
          label: "Education",
          visible: (profile?.education || []).length > 0,
        },
        {
          id: "achievements",
          label: "Achievements",
          visible: (profile?.achievements || []).length > 0,
        },
        {
          id: "contact",
          label: "Contact",
          visible: contactItems.length > 0,
        },
      ].filter((section) => section.visible),
    [contactItems.length, profile]
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
        <div className="portfolio-brand">{profile?.fullName || "Portfolio"}</div>

        <div className="portfolio-navbar-right">
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
          <div className="portfolio-hero-column portfolio-hero-column-left">
            <div className="portfolio-hero-identity">
              <div className="portfolio-avatar-shell">
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    alt={profile?.fullName || "Profile"}
                    className="portfolio-avatar"
                  />
                ) : (
                  <div className="portfolio-avatar-placeholder">👤</div>
                )}
              </div>

              {(primaryEducation || experienceYears || (profile?.socialLinks || []).length > 0) && (
                <div className="portfolio-identity-stack">
                  {primaryEducation && (
                    <div className="portfolio-education-badge">
                      <strong>{primaryEducation.degreeLine}</strong>
                      {primaryEducation.institutionLine && (
                        <span>{primaryEducation.institutionLine}</span>
                      )}
                    </div>
                  )}

                  <div className="portfolio-identity-chips">
                    {experienceYears && (
                      <span className="portfolio-meta-chip">
                      {experienceYears}+ years experience
                      </span>
                    )}
                  </div>

                  {(profile?.socialLinks || []).length > 0 && (
                    <div className="portfolio-identity-links">
                      {profile.socialLinks.slice(0, 1).map((link, index) => (
                        <a
                          key={`${link?.platform || "social"}-identity-${index}`}
                          href={link?.url}
                          target="_blank"
                          rel="noreferrer"
                          className="portfolio-social-pill portfolio-social-pill-compact"
                        >
                          {link?.platform || "Link"}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="portfolio-hero-column portfolio-hero-column-center">
            <div className="portfolio-hero-content">
              <h1>{profile?.fullName || "Your Name"}</h1>
              <p className="portfolio-headline">{displayHeadline}</p>
              <p className="portfolio-tech-stack">{heroTechStack}</p>

              {profile?.email && (
                <a className="portfolio-email-link" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              )}

              {featuredSkills.length > 0 && (
                <div className="portfolio-meta-chips">
                  {featuredSkills.map((skill, index) => (
                    <span className="portfolio-meta-chip" key={`${skill?.name || "skill"}-${index}`}>
                      {skill?.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="portfolio-hero-column portfolio-hero-column-right">
            <div className="portfolio-hero-side">
            <div className="portfolio-hero-note">
              <span className="portfolio-hero-note-label">Professional Summary</span>
              <p>{heroSummary}</p>
              <div className="portfolio-hero-note-tags">
                <span className="portfolio-chip subtle">Backend Systems</span>
                <span className="portfolio-chip subtle">Platform Thinking</span>
                <span className="portfolio-chip subtle">Product Delivery</span>
                <span className="portfolio-chip subtle">Cloud Architecture</span>
              </div>
            </div>

            <div className="portfolio-hero-actions">
              <button className="portfolio-primary-btn" onClick={handleResumeClick}>
                Download Resume
              </button>

              {isOwner && (
                <button className="portfolio-secondary-btn" onClick={handleEditProfile}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          </div>
        </section>

        {profile?.about && (
          <section id="about" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Introduction</span>
              <h2>About</h2>
            </div>

            <div className="portfolio-card portfolio-about-card">
              <p className="portfolio-about-text">{profile.about}</p>
            </div>
          </section>
        )}

        {(profile?.skills || []).length > 0 && (
          <section id="skills" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Capabilities</span>
              <h2>Skills</h2>
            </div>

            <div className="portfolio-skills-grid">
              {profile.skills.map((skill, index) => (
                <article className="portfolio-skill-card" key={`${skill?.name || "skill"}-${index}`}>
                  <div className="portfolio-skill-header">
                    <h3>{skill?.name || "Skill"}</h3>
                    {skill?.level && (
                      <span className="portfolio-skill-level">{formatLevel(skill.level)}</span>
                    )}
                  </div>
                  {skill?.yearsOfExperience ? (
                    <p>{skill.yearsOfExperience} year{skill.yearsOfExperience > 1 ? "s" : ""} experience</p>
                  ) : (
                    <p>Hands-on engineering experience</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {(profile?.experiences || []).length > 0 && (
          <section id="experience" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Career Journey</span>
              <h2>Experience</h2>
            </div>

            <div className="portfolio-experience-list">
              {profile.experiences.map((experience, index) => (
                <article className="portfolio-card portfolio-experience-card" key={index}>
                  <div className="portfolio-card-top">
                    <div>
                      <h3>{experience?.role || "Role"}</h3>
                      <p className="portfolio-company-name">{experience?.companyName || ""}</p>
                    </div>

                    <div className="portfolio-experience-meta">
                      <span className="portfolio-duration">
                        {formatExperienceDuration(experience)}
                      </span>
                      {experience?.current && (
                        <span className="portfolio-current-badge">Current</span>
                      )}
                    </div>
                  </div>

                  {experience?.description && (
                    <p className="portfolio-card-text">{experience.description}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {(profile?.projects || []).length > 0 && (
          <section id="projects" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Selected Work</span>
              <h2>Projects</h2>
            </div>

            <div className="portfolio-project-grid">
              {profile.projects.map((project, index) => (
                <article className="portfolio-card portfolio-project-card" key={index}>
                  <div className="portfolio-card-top">
                    <div>
                      <h3>{project?.title || "Project"}</h3>
                      <p className="portfolio-project-label">Product-minded engineering work</p>
                    </div>

                    {project?.link?.trim() && (
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

                  {project?.description && (
                    <p className="portfolio-card-text">{project.description}</p>
                  )}

                  {(project?.techStack || []).length > 0 && (
                    <div className="portfolio-chip-list">
                      {project.techStack.map((tech, techIndex) => (
                        <span className="portfolio-chip" key={`${tech}-${techIndex}`}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {(profile?.education || []).length > 0 && (
          <section id="education" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Academic Background</span>
              <h2>Education</h2>
            </div>

            <div className="portfolio-education-grid">
              {profile.education.map((education, index) => (
                <article className="portfolio-card portfolio-education-card" key={index}>
                  <div className="portfolio-card-top">
                    <div>
                      <h3>{education?.degree || "Degree"}</h3>
                      {education?.fieldOfStudy && (
                        <p className="portfolio-education-field">{education.fieldOfStudy}</p>
                      )}
                    </div>

                    <span className="portfolio-duration">
                      {formatEducationDuration(education)}
                    </span>
                  </div>

                  <p className="portfolio-card-text portfolio-education-inst">
                    {education?.institution?.name || ""}
                    {education?.institution?.location
                      ? ` • ${education.institution.location}`
                      : ""}
                  </p>

                  {(education?.institution?.institutionType || education?.grade) && (
                    <div className="portfolio-chip-list">
                      {education?.institution?.institutionType && (
                        <span className="portfolio-chip subtle">
                          {education.institution.institutionType}
                        </span>
                      )}
                      {education?.grade !== null &&
                        education?.grade !== undefined &&
                        education?.grade !== "" && (
                          <span className="portfolio-chip subtle">
                            Grade: {education.grade}
                          </span>
                        )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {(profile?.achievements || []).length > 0 && (
          <section id="achievements" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Recognition</span>
              <h2>Achievements</h2>
            </div>

            <div className="portfolio-achievement-grid">
              {profile.achievements.map((achievement, index) => (
                <article className="portfolio-card portfolio-achievement-card" key={index}>
                  <div className="portfolio-achievement-top">
                    <div className="portfolio-achievement-icon">🏆</div>
                    <div className="portfolio-achievement-meta">
                      {achievement?.type && (
                        <span className="portfolio-chip subtle">{achievement.type}</span>
                      )}
                      {achievement?.date && (
                        <span className="portfolio-chip subtle">
                          {formatDate(achievement.date)}
                        </span>
                      )}
                    </div>
                  </div>
                  <h3>{achievement?.title || "Achievement"}</h3>
                  {achievement?.description && (
                    <p className="portfolio-card-text">{achievement.description}</p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}

        {contactItems.length > 0 && (
          <section id="contact" className="portfolio-section">
            <div className="portfolio-section-heading">
              <span className="portfolio-section-kicker">Connect</span>
              <h2>Contact</h2>
            </div>

            <div className="portfolio-contact-grid">
              {contactItems.map((item, index) => (
                <a
                  key={`${item.label}-${index}`}
                  href={item.href}
                  target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={item.href.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="portfolio-contact-card"
                >
                  <span className="portfolio-contact-label">{item.label}</span>
                  <strong>{item.value}</strong>
                </a>
              ))}
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
  const start = formatDate(experience?.startDate);
  const end = experience?.current ? "Present" : formatDate(experience?.endDate);
  return `${start}${end ? ` — ${end}` : ""}`;
}

function formatEducationDuration(education) {
  const start = education?.startYear || "";
  const end = education?.endYear || "";
  return `${start}${end ? ` — ${end}` : ""}`;
}

function getExperienceYears(experiences) {
  const validStarts = experiences
    .map((entry) => new Date(entry?.startDate || ""))
    .filter((date) => !Number.isNaN(date.getTime()));

  if (validStarts.length === 0) {
    return "";
  }

  const earliestStart = validStarts.reduce(
    (earliest, current) => (current < earliest ? current : earliest),
    validStarts[0]
  );
  const now = new Date();
  const years = Math.max(1, Math.floor((now - earliestStart) / (1000 * 60 * 60 * 24 * 365.25)));

  return years;
}

function getPrimaryEducation(educationList) {
  if (!educationList?.length) {
    return null;
  }

  const rankedEducation = [...educationList].sort((a, b) => {
    const degreeScoreA = getDegreeScore(a?.degree);
    const degreeScoreB = getDegreeScore(b?.degree);

    if (degreeScoreA !== degreeScoreB) {
      return degreeScoreB - degreeScoreA;
    }

    const endYearA = Number(a?.endYear) || 0;
    const endYearB = Number(b?.endYear) || 0;
    if (endYearA !== endYearB) {
      return endYearB - endYearA;
    }

    const startYearA = Number(a?.startYear) || 0;
    const startYearB = Number(b?.startYear) || 0;
    return startYearB - startYearA;
  });

  const topEducation = rankedEducation[0];
  const degreeParts = [topEducation?.degree, topEducation?.fieldOfStudy].filter(Boolean);

  return {
    degreeLine: degreeParts.join(" ") || topEducation?.degree || "Education",
    institutionLine: topEducation?.institution?.name || "",
  };
}

function getDisplayHeadline(headline = "") {
  const normalizedHeadline = headline.trim();
  if (!normalizedHeadline) {
    return "Senior Software Engineer";
  }

  const lowerHeadline = normalizedHeadline.toLowerCase();
  if (lowerHeadline === "sse") {
    return "Senior Software Engineer";
  }

  return normalizedHeadline;
}

function getDegreeScore(degree = "") {
  const normalizedDegree = degree.toLowerCase();

  if (normalizedDegree.includes("phd") || normalizedDegree.includes("doctor")) return 5;
  if (normalizedDegree.includes("master") || normalizedDegree.includes("m.tech") || normalizedDegree.includes("ms")) return 4;
  if (normalizedDegree.includes("b.tech") || normalizedDegree.includes("bachelor") || normalizedDegree.includes("b.e")) return 3;
  if (normalizedDegree.includes("diploma")) return 2;
  return 1;
}

export default PortfolioView;
