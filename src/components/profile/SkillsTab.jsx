import { useState } from "react";
import "../../styles/profile/SkillsTab.css";

const LEVEL_OPTIONS = ["BEGINNER", "INTERMEDIATE", "EXPERT"];

function SkillsTab({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(profile.skills.length === 0);

  const handleAddSkill = () => {
    setProfile((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          name: "",
          yearsOfExperience: 1,
          level: "BEGINNER",
        },
      ],
    }));
    setIsEditing(true);
  };

  const handleSkillChange = (index, field, value) => {
    const updatedSkills = [...profile.skills];
    updatedSkills[index] = {
      ...updatedSkills[index],
      [field]:
        field === "yearsOfExperience" ? Number(value) || 0 : value,
    };

    setProfile((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));
  };

  const handleDeleteSkill = (index) => {
    const updatedSkills = profile.skills.filter((_, i) => i !== index);

    setProfile((prev) => ({
      ...prev,
      skills: updatedSkills,
    }));

    if (updatedSkills.length === 0) {
      setIsEditing(false);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleDoneClick = () => {
    const hasInvalidSkill = profile.skills.some(
      (skill) => !skill.name.trim() || !skill.level
    );

    if (hasInvalidSkill) {
      alert("Please fill all skill names and levels.");
      return;
    }

    setIsEditing(false);
  };

  if (profile.skills.length === 0 && !isEditing) {
    return (
      <div className="skills-card">
        <div className="skills-header">
          <h2>Skills</h2>
          <p>Add your technical and professional skills</p>
        </div>

        <div className="skills-empty-state">
          <div className="skills-empty-icon">🛠️</div>
          <p>No skills added yet</p>
          <button className="skills-primary-btn" onClick={handleAddSkill}>
            Add Your First Skill
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="skills-card">
        <div className="skills-header">
          <h2>Skills</h2>
          <p>Add your technical and professional skills</p>
        </div>

        <div className="skills-form-list">
          {profile.skills.map((skill, index) => (
            <div className="skill-form-row" key={index}>
              <div className="skill-field skill-name">
                <label>Skill Name</label>
                <input
                  type="text"
                  placeholder="e.g. React, Java, Spring Boot"
                  value={skill.name}
                  onChange={(e) =>
                    handleSkillChange(index, "name", e.target.value)
                  }
                />
              </div>

              <div className="skill-field skill-years">
                <label>Years of Experience</label>
                <input
                  type="number"
                  min="0"
                  placeholder="1"
                  value={skill.yearsOfExperience}
                  onChange={(e) =>
                    handleSkillChange(
                      index,
                      "yearsOfExperience",
                      e.target.value
                    )
                  }
                />
              </div>

              <div className="skill-field skill-level">
                <label>Level</label>
                <select
                  value={skill.level}
                  onChange={(e) =>
                    handleSkillChange(index, "level", e.target.value)
                  }
                >
                  {LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="skill-delete-wrapper">
                <button
                  type="button"
                  className="delete-skill-btn"
                  onClick={() => handleDeleteSkill(index)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="skills-actions">
          <button className="skills-secondary-btn" onClick={handleAddSkill}>
            + Add Skill
          </button>
          <button className="skills-primary-btn" onClick={handleDoneClick}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="skills-card">
      <div className="skills-header">
        <h2>Skills</h2>
        <p>Your technical and professional skills</p>
      </div>

      <div className="skills-chip-list">
        {profile.skills.map((skill, index) => (
          <div className="skill-chip" key={index}>
            <span className="skill-chip-name">{skill.name}</span>
            <span className="skill-chip-level">{skill.level}</span>
            <span className="skill-chip-years">
              {skill.yearsOfExperience}y
            </span>
          </div>
        ))}
      </div>

      <div className="skills-actions">
        <button className="skills-secondary-btn" onClick={handleEditClick}>
          Edit Skills
        </button>
        <button className="skills-primary-btn" onClick={handleAddSkill}>
          + Add Skill
        </button>
      </div>
    </div>
  );
}

export default SkillsTab;