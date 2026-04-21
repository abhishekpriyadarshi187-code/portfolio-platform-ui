import { useState } from "react";
import "../../styles/profile/SocialLinksTab.css";

function SocialLinksTab({ profile, setProfile }) {
  const [isEditing, setIsEditing] = useState(
    profile.socialLinks.length === 0
  );

  const addLink = () => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        {
          platform: "",
          url: "",
        },
      ],
    }));
    setIsEditing(true);
  };

  const handleChange = (index, field, value) => {
    const updated = [...profile.socialLinks];
    updated[index][field] = value;

    setProfile((prev) => ({
      ...prev,
      socialLinks: updated,
    }));
  };

  const handleDelete = (index) => {
    const updated = profile.socialLinks.filter((_, i) => i !== index);

    setProfile((prev) => ({
      ...prev,
      socialLinks: updated,
    }));

    if (updated.length === 0) {
      setIsEditing(false);
    }
  };

  const handleDone = () => {
    const hasInvalid = profile.socialLinks.some(
      (l) => !l.platform?.trim() || !l.url?.trim()
    );

    if (hasInvalid) {
      alert("Please fill all fields");
      return;
    }

    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  // 👉 EMPTY STATE
  if (profile.socialLinks.length === 0 && !isEditing) {
    return (
      <div className="social-card">
        <div className="social-header">
          <h2>Social Links</h2>
          <p>Add your professional profiles</p>
        </div>

        <div className="social-empty">
          <div className="icon">🔗</div>
          <p>No social links added yet</p>
          <button className="primary-btn" onClick={addLink}>
            Add Your First Link
          </button>
        </div>
      </div>
    );
  }

  // 👉 EDIT MODE
  if (isEditing) {
    return (
      <div className="social-card">
        <div className="social-header">
          <h2>Social Links</h2>
          <p>Add your professional profiles</p>
        </div>

        <div className="social-list">
          {profile.socialLinks.map((link, index) => (
            <div className="social-form" key={index}>
              <div className="row">
                <div className="field">
                  <label>Platform</label>
                  <select
                    value={link.platform}
                    onChange={(e) =>
                      handleChange(index, "platform", e.target.value)
                    }
                  >
                    <option value="">Select</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="GitHub">GitHub</option>
                    <option value="Twitter">Twitter</option>
                    <option value="Portfolio">Portfolio</option>
                  </select>
                </div>

                <div className="field">
                  <label>URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={link.url}
                    onChange={(e) =>
                      handleChange(index, "url", e.target.value)
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
            </div>
          ))}
        </div>

        <div className="actions">
          <button className="secondary-btn" onClick={addLink}>
            + Add Link
          </button>
          <button className="primary-btn" onClick={handleDone}>
            Done
          </button>
        </div>
      </div>
    );
  }

  // 👉 DISPLAY MODE (🔥 clean recruiter view)
  return (
    <div className="social-card">
      <div className="social-header">
        <h2>Social Links</h2>
        <p>Your online presence</p>
      </div>

      <div className="social-display">
        {profile.socialLinks.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noreferrer"
            className="social-item"
          >
            <span className="platform">{link.platform}</span>
            <span className="arrow">→</span>
          </a>
        ))}
      </div>

      <div className="actions">
        <button className="secondary-btn" onClick={handleEdit}>
          Edit Links
        </button>
        <button className="primary-btn" onClick={addLink}>
          + Add Link
        </button>
      </div>
    </div>
  );
}

export default SocialLinksTab;