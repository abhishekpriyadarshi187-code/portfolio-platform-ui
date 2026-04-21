import { useState } from "react";
import "../../styles/profile/EducationTab.css";

const INSTITUTION_TYPES = [
  "SCHOOL",
  "COLLEGE",
  "UNIVERSITY",
  "INSTITUTE",
  "OTHER",
];

function EducationTab({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(profile.education.length === 0);

  const addEmptyEducation = () => {
    setProfile((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          institution: {
            institutionType: "UNIVERSITY",
            name: "",
            location: "",
          },
          degree: "",
          fieldOfStudy: "",
          startYear: "",
          endYear: "",
          grade: "",
        },
      ],
    }));
    setIsEditing(true);
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducation = [...profile.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value,
    };

    setProfile((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  const handleInstitutionChange = (index, field, value) => {
    const updatedEducation = [...profile.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      institution: {
        ...updatedEducation[index].institution,
        [field]: value,
      },
    };

    setProfile((prev) => ({
      ...prev,
      education: updatedEducation,
    }));
  };

  const handleDeleteEducation = (index) => {
    const updatedEducation = profile.education.filter((_, i) => i !== index);

    setProfile((prev) => ({
      ...prev,
      education: updatedEducation,
    }));

    if (updatedEducation.length === 0) {
      setIsEditing(false);
    }
  };

  const handleDoneClick = () => {
    const hasInvalidEducation = profile.education.some((edu) => {
      if (!edu.institution?.name?.trim()) return true;
      if (!edu.degree?.trim()) return true;
      if (!edu.fieldOfStudy?.trim()) return true;
      if (!edu.startYear) return true;
      return false;
    });

    if (hasInvalidEducation) {
      alert("Please fill all required education fields.");
      return;
    }

    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  if (profile.education.length === 0 && !isEditing) {
    return (
      <div className="education-card">
        <div className="education-header">
          <h2>Education</h2>
          <p>Add your academic background</p>
        </div>

        <div className="education-empty-state">
          <div className="education-empty-icon">🎓</div>
          <p>No education added yet</p>
          <button className="education-primary-btn" onClick={addEmptyEducation}>
            Add Your First Education
          </button>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="education-card">
        <div className="education-header">
          <h2>Education</h2>
          <p>Add your academic background</p>
        </div>

        <div className="education-form-list">
          {profile.education.map((edu, index) => (
            <div className="education-form-card" key={index}>
              <div className="education-top-row">
                <div className="education-field">
                  <label>Institution Name</label>
                  <input
                    type="text"
                    placeholder="IIT Delhi"
                    value={edu.institution?.name || ""}
                    onChange={(e) =>
                      handleInstitutionChange(index, "name", e.target.value)
                    }
                  />
                </div>

                <div className="education-field">
                  <label>Institution Type</label>
                  <select
                    value={edu.institution?.institutionType || "UNIVERSITY"}
                    onChange={(e) =>
                      handleInstitutionChange(
                        index,
                        "institutionType",
                        e.target.value
                      )
                    }
                  >
                    {INSTITUTION_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="education-delete-wrapper">
                  <button
                    type="button"
                    className="delete-education-btn"
                    onClick={() => handleDeleteEducation(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="education-row">
                <div className="education-field">
                  <label>Location</label>
                  <input
                    type="text"
                    placeholder="DELHI"
                    value={edu.institution?.location || ""}
                    onChange={(e) =>
                      handleInstitutionChange(index, "location", e.target.value)
                    }
                  />
                </div>

                <div className="education-field">
                  <label>Degree</label>
                  <input
                    type="text"
                    placeholder="B.Tech"
                    value={edu.degree || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "degree", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="education-row">
                <div className="education-field">
                  <label>Field of Study</label>
                  <input
                    type="text"
                    placeholder="Computer Science"
                    value={edu.fieldOfStudy || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "fieldOfStudy", e.target.value)
                    }
                  />
                </div>

                <div className="education-field">
                  <label>Grade / CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="8.0"
                    value={edu.grade || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "grade", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="education-row">
                <div className="education-field">
                  <label>Start Year</label>
                  <input
                    type="number"
                    placeholder="2015"
                    value={edu.startYear || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "startYear", e.target.value)
                    }
                  />
                </div>

                <div className="education-field">
                  <label>End Year</label>
                  <input
                    type="number"
                    placeholder="2019"
                    value={edu.endYear || ""}
                    onChange={(e) =>
                      handleEducationChange(index, "endYear", e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="education-actions">
          <button
            className="education-secondary-btn"
            onClick={addEmptyEducation}
          >
            + Add Education
          </button>
          <button className="education-primary-btn" onClick={handleDoneClick}>
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="education-card">
      <div className="education-header">
        <h2>Education</h2>
        <p>Your academic background</p>
      </div>

      <div className="education-display-list">
        {profile.education.map((edu, index) => (
          <div className="education-display-card" key={index}>
            <div className="education-display-top">
              <div>
                <h3>{edu.degree}</h3>
                <p className="education-field-of-study">{edu.fieldOfStudy}</p>
              </div>
              <span className="education-duration">
                {edu.startYear}
                {edu.endYear ? ` - ${edu.endYear}` : ""}
              </span>
            </div>

            <p className="education-institution">
              {edu.institution?.name}
              {edu.institution?.location ? ` • ${edu.institution.location}` : ""}
            </p>

            <div className="education-meta">
              {edu.institution?.institutionType && (
                <span className="education-badge">
                  {edu.institution.institutionType}
                </span>
              )}
              {edu.grade && (
                <span className="education-grade">Grade: {edu.grade}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="education-actions">
        <button className="education-secondary-btn" onClick={handleEditClick}>
          Edit Education
        </button>
        <button className="education-primary-btn" onClick={addEmptyEducation}>
          + Add Education
        </button>
      </div>
    </div>
  );
}

export default EducationTab;