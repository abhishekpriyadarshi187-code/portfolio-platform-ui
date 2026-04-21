import { useRef } from "react";
import "../../styles/profile/BasicInfoTab.css";

function BasicInfoTab({ profile, setProfile, userEmail = "" }) {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      alert("Please upload JPG, PNG, or WEBP image");
      return;
    }

    const maxSizeInBytes = 2 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      alert("Image size should be less than 2MB");
      return;
    }

    const localPreviewUrl = URL.createObjectURL(file);

    setProfile((prev) => ({
      ...prev,
      profilePhoto: localPreviewUrl,
      profilePhotoFile: file,
    }));
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({
      ...prev,
      profilePhoto: "",
      profilePhotoFile: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="basic-info-card">
      <div className="basic-info-header">
        <h2>Basic Information</h2>
        <p>Tell us about yourself</p>
      </div>

      <div className="photo-section">
        <label className="field-label">Profile Photo</label>

        <div className="photo-row">
          <div className="photo-preview">
            {profile.profilePhoto ? (
              <img
                src={profile.profilePhoto}
                alt="Profile Preview"
                className="photo-image"
              />
            ) : (
              <div className="photo-placeholder">👤</div>
            )}
          </div>

          <div className="photo-actions">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
            />

            <button
              type="button"
              className="upload-btn"
              onClick={handlePhotoClick}
            >
              Upload Photo
            </button>

            {profile.profilePhoto && (
              <button
                type="button"
                className="remove-btn"
                onClick={handleRemovePhoto}
              >
                Remove
              </button>
            )}

            <p className="helper-text">JPG, PNG, WEBP up to 2MB</p>
          </div>
        </div>
      </div>

      <div className="basic-info-grid">
        <div className="field-group">
          <label className="field-label">Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="John Doe"
            value={profile.fullName || ""}
            onChange={handleChange}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Email</label>
          <input
            type="email"
            name="email"
            value={profile.email || userEmail || ""}
            readOnly
          />
        </div>
      </div>

      <div className="field-group">
        <label className="field-label">Headline</label>
        <input
          type="text"
          name="headline"
          placeholder="Senior Software Engineer"
          value={profile.headline || ""}
          onChange={handleChange}
        />
      </div>

      <div className="field-group">
        <label className="field-label">About</label>
        <textarea
          name="about"
          placeholder="Tell us about yourself, your passions, and what drives you..."
          value={profile.about || ""}
          onChange={handleChange}
          rows={5}
        />
      </div>
    </div>
  );
}

export default BasicInfoTab;