import { useEffect, useRef, useState } from "react";
import "../../styles/profile/BasicInfoTab.css";
import { uploadProfileImage } from "../../services/profileService";
import {
  getProfileImageObjectPosition,
  normalizeProfileImagePosition,
} from "../../utils/profileImagePosition";

function BasicInfoTab({ profile, setProfile, userEmail = "" }) {
  const fileInputRef = useRef(null);
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [pendingImagePosition, setPendingImagePosition] = useState(
    normalizeProfileImagePosition(profile.profileImagePosition)
  );
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const imageSrc = profile.profileImageUrl || profile.profilePhoto || "";
  const imagePosition = normalizeProfileImagePosition(profile.profileImagePosition);

  useEffect(() => {
    return () => {
      if (pendingPhoto?.previewUrl) {
        URL.revokeObjectURL(pendingPhoto.previewUrl);
      }
    };
  }, [pendingPhoto]);

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

  const handlePhotoChange = async (e) => {
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

    if (pendingPhoto?.previewUrl) {
      URL.revokeObjectURL(pendingPhoto.previewUrl);
    }

    setPendingPhoto({
      file,
      previewUrl: URL.createObjectURL(file),
    });
    setPendingImagePosition(imagePosition);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemovePhoto = () => {
    setProfile((prev) => ({
      ...prev,
      profilePhoto: "",
      profileImageUrl: "",
      profileImagePosition: normalizeProfileImagePosition(undefined),
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCancelPendingPhoto = () => {
    if (pendingPhoto?.previewUrl) {
      URL.revokeObjectURL(pendingPhoto.previewUrl);
    }
    setPendingPhoto(null);
    setPendingImagePosition(imagePosition);
  };

  const handleApplyPendingPhoto = async () => {
    if (!pendingPhoto?.file) return;

    setUploadingPhoto(true);

    try {
      const response = await uploadProfileImage(pendingPhoto.file);

      setProfile((prev) => ({
        ...prev,
        profilePhoto: response?.profileImageUrl || pendingPhoto.previewUrl,
        profileImageUrl: response?.profileImageUrl || "",
        profileImagePosition: normalizeProfileImagePosition(pendingImagePosition),
      }));

      if (pendingPhoto.previewUrl) {
        URL.revokeObjectURL(pendingPhoto.previewUrl);
      }
      setPendingPhoto(null);
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      alert(error.message || "Failed to upload profile image");
    } finally {
      setUploadingPhoto(false);
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
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Profile Preview"
                className="photo-image"
                style={{ objectPosition: getProfileImageObjectPosition(imagePosition) }}
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

            {imageSrc && (
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
        <label className="field-label">Mobile Number</label>
        <input
          type="tel"
          name="mobileNumber"
          placeholder="+91 98765 43210"
          value={profile.mobileNumber || ""}
          onChange={handleChange}
        />
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

      {pendingPhoto && (
        <div className="photo-crop-modal" role="dialog" aria-modal="true">
          <div className="photo-crop-card">
            <div className="photo-crop-header">
              <h3>Adjust Photo</h3>
              <p>Position your photo before uploading it.</p>
            </div>

            <div className="photo-crop-body">
              <div className="photo-crop-preview">
                <img
                  src={pendingPhoto.previewUrl}
                  alt="Crop preview"
                  className="photo-crop-image"
                  style={{
                    objectPosition: getProfileImageObjectPosition(pendingImagePosition),
                  }}
                />
              </div>

              <div className="photo-crop-controls">
                <label className="field-label" htmlFor="photo-position-range">
                  Adjust Framing
                </label>
                <input
                  id="photo-position-range"
                  className="photo-crop-range"
                  type="range"
                  min="0"
                  max="100"
                  step="1"
                  value={pendingImagePosition}
                  onChange={(e) =>
                    setPendingImagePosition(
                      normalizeProfileImagePosition(Number(e.target.value))
                    )
                  }
                />
                <div className="photo-crop-range-labels">
                  <span>Top</span>
                  <span>Center</span>
                  <span>Bottom</span>
                </div>
              </div>
            </div>

            <div className="photo-crop-actions">
              <button
                type="button"
                className="photo-crop-cancel"
                onClick={handleCancelPendingPhoto}
                disabled={uploadingPhoto}
              >
                Cancel
              </button>
              <button
                type="button"
                className="photo-crop-save"
                onClick={handleApplyPendingPhoto}
                disabled={uploadingPhoto}
              >
                {uploadingPhoto ? "Uploading..." : "Use Photo"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BasicInfoTab;
