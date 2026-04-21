import { useState } from "react";
import "../../styles/profile/ExperienceTab.css";

function ExperienceTab({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(
    profile.experiences.length === 0
  );

  const addEmptyExperience = () => {
    setProfile((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          companyName: "",
          role: "",
          startDate: "",
          endDate: "",
          current: false,
          description: "",
        },
      ],
    }));
    setIsEditing(true);
  };

  const handleExperienceChange = (index, field, value) => {
    const updatedExperiences = [...profile.experiences];

    updatedExperiences[index] = {
      ...updatedExperiences[index],
      [field]: value,
    };

    if (field === "current" && value === true) {
      updatedExperiences[index].endDate = "";
    }

    setProfile((prev) => ({
      ...prev,
      experiences: updatedExperiences,
    }));
  };

  const handleDeleteExperience = (index) => {
    const updatedExperiences = profile.experiences.filter((_, i) => i !== index);

    setProfile((prev) => ({
      ...prev,
      experiences: updatedExperiences,
    }));

    if (updatedExperiences.length === 0) {
      setIsEditing(false);
    }
  };

  const handleDoneClick = () => {
    const hasInvalidExperience = profile.experiences.some((exp) => {
      if (!exp.companyName.trim()) return true;
      if (!exp.role.trim()) return true;
      if (!exp.startDate) return true;
      if (!exp.current && !exp.endDate) return true;
      return false;
    });

    if (hasInvalidExperience) {
      alert("Please fill all required experience fields.");
      return;
    }

    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (profile.experiences.length === 0 && !isEditing) {
    return (
      <div className="experience-card">
        <div className="experience-header">
          <h2>Experience</h2>
          <p>Add your work experience</p>
        </div>

        <div className="experience-empty-state">
          <div className="experience-empty-icon">💼</div>
          <p>No experience added yet</p>
          <button
            className="experience-primary-btn"
            onClick={addEmptyExperience}
          >
            Add Your First Experience
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="experience-card">
        <div className="experience-header">
          <h2>Experience</h2>
          <p>Add your work experience</p>
        </div>

        <div className="experience-form-list">
          {profile.experiences.map((experience, index) => (
            <div className="experience-form-card" key={index}>
              <div className="experience-top-row">
                <div className="experience-field">
                  <label>Company Name</label>
                  <input
                    type="text"
                    placeholder="TechCorp Inc."
                    value={experience.companyName}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "companyName",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="experience-field">
                  <label>Role / Title</label>
                  <input
                    type="text"
                    placeholder="Senior Software Engineer"
                    value={experience.role}
                    onChange={(e) =>
                      handleExperienceChange(index, "role", e.target.value)
                    }
                  />
                </div>

                <div className="experience-delete-wrapper">
                  <button
                    type="button"
                    className="delete-experience-btn"
                    onClick={() => handleDeleteExperience(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="experience-date-row">
                <div className="experience-field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={experience.startDate}
                    onChange={(e) =>
                      handleExperienceChange(
                        index,
                        "startDate",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="experience-field">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={experience.endDate}
                    disabled={experience.current}
                    onChange={(e) =>
                      handleExperienceChange(index, "endDate", e.target.value)
                    }
                  />
                </div>

                <div className="experience-checkbox-field">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={experience.current}
                      onChange={(e) =>
                        handleExperienceChange(
                          index,
                          "current",
                          e.target.checked
                        )
                      }
                    />
                    Currently working here
                  </label>
                </div>
              </div>

              <div className="experience-field">
                <label>Description</label>
                <textarea
                  rows={4}
                  placeholder="Describe your responsibilities and achievements..."
                  value={experience.description}
                  onChange={(e) =>
                    handleExperienceChange(
                      index,
                      "description",
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          ))}
        </div>

        <div className="experience-actions">
          <button
            className="experience-secondary-btn"
            onClick={addEmptyExperience}
          >
            + Add Experience
          </button>
          <button
            className="experience-primary-btn"
            onClick={handleDoneClick}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="experience-card">
      <div className="experience-header">
        <h2>Experience</h2>
        <p>Your work experience</p>
      </div>

      <div className="experience-list">
        {profile.experiences.map((experience, index) => (
          <div className="experience-display-card" key={index}>
            <div className="experience-display-top">
              <h3>{experience.role}</h3>
              <span className="experience-duration">
                {experience.startDate} -{" "}
                {experience.current ? "Present" : experience.endDate}
              </span>
            </div>

            <p className="experience-company">{experience.companyName}</p>

            {experience.description && (
              <p className="experience-description">
                {experience.description}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="experience-actions">
        <button
          className="experience-secondary-btn"
          onClick={handleEditClick}
        >
          Edit Experience
        </button>
        <button
          className="experience-primary-btn"
          onClick={addEmptyExperience}
        >
          + Add Experience
        </button>
      </div>
    </div>
  );
}

export default ExperienceTab;