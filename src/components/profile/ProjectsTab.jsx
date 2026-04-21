import { useState } from "react";
import "../../styles/profile/ProjectsTab.css";

function ProjectsTab({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(profile.projects.length === 0);
  const [techInput, setTechInput] = useState({});

  const addEmptyProject = () => {
    setProfile((prev) => ({
      ...prev,
      projects: [
        ...prev.projects,
        {
          title: "",
          description: "",
          techStack: [],
          link: "",
        },
      ],
    }));
    setIsEditing(true);
  };

  const handleProjectChange = (index, field, value) => {
    const updatedProjects = [...profile.projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };

    setProfile((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
  };

  const handleDeleteProject = (index) => {
    const updatedProjects = profile.projects.filter((_, i) => i !== index);

    setProfile((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));

    if (updatedProjects.length === 0) {
      setIsEditing(false);
    }
  };

  const handleTechInputChange = (index, value) => {
    setTechInput((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const handleAddTech = (index) => {
    const value = techInput[index]?.trim();
    if (!value) return;

    const updatedProjects = [...profile.projects];
    const existingTech = updatedProjects[index].techStack || [];

    updatedProjects[index] = {
      ...updatedProjects[index],
      techStack: [...existingTech, value],
    };

    setProfile((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));

    setTechInput((prev) => ({
      ...prev,
      [index]: "",
    }));
  };

  const handleTechKeyDown = (e, index) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTech(index);
    }
  };

  const handleRemoveTech = (projectIndex, techIndex) => {
    const updatedProjects = [...profile.projects];
    updatedProjects[projectIndex].techStack = updatedProjects[
      projectIndex
    ].techStack.filter((_, i) => i !== techIndex);

    setProfile((prev) => ({
      ...prev,
      projects: updatedProjects,
    }));
  };

  const handleDoneClick = () => {
    const hasInvalidProject = profile.projects.some(
      (project) => !project.title.trim()
    );

    if (hasInvalidProject) {
      alert("Project title is required for all projects.");
      return;
    }

    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (profile.projects.length === 0 && !isEditing) {
    return (
      <div className="projects-card">
        <div className="projects-header">
          <h2>Projects</h2>
          <p>Add projects you've worked on</p>
        </div>

        <div className="projects-empty-state">
          <div className="projects-empty-icon">🚀</div>
          <p>No projects added yet</p>
          <button className="projects-primary-btn" onClick={addEmptyProject}>
            Add Your First Project
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="projects-card">
        <div className="projects-header">
          <h2>Projects</h2>
          <p>Add projects you've worked on</p>
        </div>

        <div className="projects-form-list">
          {profile.projects.map((project, index) => (
            <div className="project-form-card" key={index}>
              <div className="project-top-row">
                <div className="project-field">
                  <label>Project Title</label>
                  <input
                    type="text"
                    placeholder="E-commerce Platform"
                    value={project.title}
                    onChange={(e) =>
                      handleProjectChange(index, "title", e.target.value)
                    }
                  />
                </div>

                <div className="project-field">
                  <label>Project Link</label>
                  <input
                    type="text"
                    placeholder="https://github.com/..."
                    value={project.link}
                    onChange={(e) =>
                      handleProjectChange(index, "link", e.target.value)
                    }
                  />
                </div>

                <div className="project-delete-wrapper">
                  <button
                    type="button"
                    className="delete-project-btn"
                    onClick={() => handleDeleteProject(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="project-field">
                <label>Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe your project and its impact..."
                  value={project.description}
                  onChange={(e) =>
                    handleProjectChange(index, "description", e.target.value)
                  }
                />
              </div>

              <div className="project-field">
                <label>Tech Stack</label>

                <div className="project-tech-input-row">
                  <input
                    type="text"
                    placeholder="Add tech..."
                    value={techInput[index] || ""}
                    onChange={(e) =>
                      handleTechInputChange(index, e.target.value)
                    }
                    onKeyDown={(e) => handleTechKeyDown(e, index)}
                  />
                  <button
                    type="button"
                    className="projects-secondary-btn"
                    onClick={() => handleAddTech(index)}
                  >
                    Add
                  </button>
                </div>

                <p className="project-helper-text">
                  Press Enter or click Add to add a technology
                </p>

                <div className="project-tech-chip-list">
                  {project.techStack?.map((tech, techIndex) => (
                    <div className="project-tech-chip" key={techIndex}>
                      <span>{tech}</span>
                      <button
                        type="button"
                        className="remove-tech-btn"
                        onClick={() => handleRemoveTech(index, techIndex)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="projects-actions">
          <button
            className="projects-secondary-btn"
            onClick={addEmptyProject}
          >
            + Add Project
          </button>
          <button
            className="projects-primary-btn"
            onClick={handleDoneClick}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="projects-card">
      <div className="projects-header">
        <h2>Projects</h2>
        <p>Projects you've worked on</p>
      </div>

      <div className="projects-display-list">
        {profile.projects.map((project, index) => (
          <div className="project-display-card" key={index}>
            <div className="project-display-top">
              <div>
                <h3>{project.title}</h3>
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    View Project
                  </a>
                )}
              </div>
            </div>

            {project.description && (
              <p className="project-description">{project.description}</p>
            )}

            <div className="project-tech-chip-list">
              {project.techStack?.map((tech, techIndex) => (
                <div className="project-tech-chip readonly" key={techIndex}>
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="projects-actions">
        <button
          className="projects-secondary-btn"
          onClick={handleEditClick}
        >
          Edit Projects
        </button>
        <button
          className="projects-primary-btn"
          onClick={addEmptyProject}
        >
          + Add Project
        </button>
      </div>
    </div>
  );
}

export default ProjectsTab;