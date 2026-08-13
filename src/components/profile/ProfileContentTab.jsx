import "../../styles/profile/BasicInfoTab.css";

function ProfileContentTab({ profile, setProfile }) {
  const selectedTagsValue = (profile.selectedHighlightTags || []).join(", ");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHighlightTagsChange = (e) => {
    const value = e.target.value;

    setProfile((prev) => ({
      ...prev,
      selectedHighlightTags: value
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    }));
  };

  return (
    <div className="basic-info-card">
      <div className="basic-info-header">
        <h2>Profile Content</h2>
        <p>Shape how your portfolio and resume introduce you</p>
      </div>

      <div className="field-group">
        <label className="field-label">Professional Summary</label>
        <textarea
          name="professionalSummary"
          placeholder="Write a short 2-4 line professional summary for your portfolio and resume..."
          value={profile.professionalSummary || ""}
          onChange={handleChange}
          rows={4}
        />
      </div>

      <div className="field-group">
        <label className="field-label">Selected Highlight Tags</label>
        <input
          type="text"
          placeholder="Backend Systems, Cloud Architecture, Product Delivery"
          value={selectedTagsValue}
          onChange={handleHighlightTagsChange}
        />
        <p className="helper-text">
          Add comma-separated tags. If left empty, suggested tags from backend will be used.
        </p>
      </div>

      <div className="field-group">
        <label className="field-label">About</label>
        <textarea
          name="about"
          placeholder="Tell your fuller story, background, and what drives you..."
          value={profile.about || ""}
          onChange={handleChange}
          rows={6}
        />
      </div>
    </div>
  );
}

export default ProfileContentTab;
