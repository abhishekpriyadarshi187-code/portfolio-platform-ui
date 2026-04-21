import { useState } from "react";
import "../../styles/profile/AchievementsTab.css";

function AchievementsTab({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(
    profile.achievements.length === 0
  );

  const addAchievement = () => {
    setProfile((prev) => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        {
          title: "",
          description: "",
        },
      ],
    }));
    setIsEditing(true);
  };

  const handleChange = (index, field, value) => {
    const updated = [...profile.achievements];
    updated[index][field] = value;

    setProfile((prev) => ({
      ...prev,
      achievements: updated,
    }));
  };

  const handleDelete = (index) => {
    const updated = profile.achievements.filter((_, i) => i !== index);

    setProfile((prev) => ({
      ...prev,
      achievements: updated,
    }));

    if (updated.length === 0) {
      setIsEditing(false);
    }
  };

  const handleDone = () => {
    const hasInvalid = profile.achievements.some(
      (a) => !a.title?.trim() || !a.description?.trim()
    );

    if (hasInvalid) {
      alert("Please fill all required fields");
      return;
    }

    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // 👉 EMPTY STATE
  if (profile.achievements.length === 0 && !isEditing) {
    return (
      <div className="achievements-card">
        <div className="achievements-header">
          <h2>Achievements</h2>
          <p>Add your achievements</p>
        </div>

        <div className="achievements-empty">
          <div className="icon">🏆</div>
          <p>No achievements added yet</p>
          <button onClick={addAchievement} className="primary-btn">
            Add Your First Achievement
          </button>
        </div>
      </div>
    );
  }

  // 👉 EDIT MODE
  if (isEditing) {
    return (
      <div className="achievements-card">
        <div className="achievements-header">
          <h2>Achievements</h2>
          <p>Add your achievements</p>
        </div>

        <div className="achievements-list">
          {profile.achievements.map((a, index) => (
            <div className="achievement-form" key={index}>
              <div className="top-row">
                <div className="field">
                  <label>Title</label>
                  <input
                    type="text"
                    placeholder="Best Employee Award"
                    value={a.title}
                    onChange={(e) =>
                      handleChange(index, "title", e.target.value)
                    }
                  />
                </div>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(index)}
                >
                  Delete
                </button>
              </div>

              <div className="field">
                <label>Description</label>
                <textarea
                  placeholder="Describe your achievement..."
                  value={a.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  rows={3}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="secondary-btn" onClick={addAchievement}>
            + Add Achievement
          </button>
          <button className="primary-btn" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    );
  }

  // 👉 DISPLAY MODE (🔥 recruiter-like clean view)
  return (
    <div className="achievements-card">
      <div className="achievements-header">
        <h2>Achievements</h2>
        <p>Your accomplishments</p>
      </div>

      <div className="achievements-display">
        {profile.achievements.map((a, index) => (
          <div className="achievement-item" key={index}>
            <div className="bullet">🏆</div>
            <div>
              <h3>{a.title}</h3>
              <p>{a.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button className="secondary-btn" onClick={handleEdit}>
          Edit Achievements
        </button>
        <button className="primary-btn" onClick={addAchievement}>
          + Add Achievement
        </button>
      </div>
    </div>
  );
}

export default AchievementsTab;