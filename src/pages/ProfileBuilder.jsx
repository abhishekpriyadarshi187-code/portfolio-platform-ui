import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import BasicInfoTab from "../components/profile/BasicInfoTab";
import SkillsTab from "../components/profile/SkillsTab";
import ExperienceTab from "../components/profile/ExperienceTab";
import ProjectsTab from "../components/profile/ProjectsTab";
import EducationTab from "../components/profile/EducationTab";
import AchievementsTab from "../components/profile/AchievementsTab";
import SocialLinksTab from "../components/profile/SocialLinksTab";

import { createProfile, getProfile } from "../services/profileService";
import { logout } from "../utils/auth";

import "../styles/profile/ProfileBuilder.css";

const emptyProfile = {
  fullName: "",
  email: "",
  headline: "",
  about: "",
  profilePhoto: "",
  profilePhotoFile: null,
  skills: [],
  experiences: [],
  projects: [],
  education: [],
  achievements: [],
  socialLinks: [],
};

function ProfileBuilder() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [isExistingProfile, setIsExistingProfile] = useState(false);

  const [profile, setProfile] = useState(emptyProfile);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setPageLoading(true);

      const data = await getProfile();

      if (data) {
        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          headline: data.headline || "",
          about: data.about || "",
          profilePhoto: data.profilePhoto || "",
          profilePhotoFile: null,
          skills: data.skills || [],
          experiences: data.experiences || [],
          projects: data.projects || [],
          education: data.education || [],
          achievements: data.achievements || [],
          socialLinks: data.socialLinks || [],
        });

        setIsExistingProfile(true);
      } else {
        setProfile(emptyProfile);
        setIsExistingProfile(false);
      }
    } catch (error) {
      console.log("No existing profile found or failed to load profile:", error.message);
      setProfile(emptyProfile);
      setIsExistingProfile(false);
    } finally {
      setPageLoading(false);
    }
  };

  const buildProfilePayload = (profileData) => ({
    about: profileData.about?.trim() || "",
    fullName: profileData.fullName?.trim() || "",
    headline: profileData.headline?.trim() || "",

    skills: (profileData.skills || []).map((skill) => ({
      name: skill.name?.trim() || "",
      yearsOfExperience: Number(skill.yearsOfExperience) || 0,
      level: skill.level || "BEGINNER",
    })),

    experiences: (profileData.experiences || []).map((exp) => ({
      companyName: exp.companyName?.trim() || "",
      role: exp.role?.trim() || "",
      startDate: exp.startDate || "",
      ...(exp.current
        ? { current: true }
        : { endDate: exp.endDate || "", current: false }),
      description: exp.description?.trim() || "",
    })),

    projects: (profileData.projects || []).map((project) => ({
      title: project.title?.trim() || "",
      description: project.description?.trim() || "",
      techStack: (project.techStack || [])
        .map((tech) => tech?.trim())
        .filter(Boolean),
      link: project.link?.trim() || "",
    })),

    education: (profileData.education || []).map((edu) => ({
      institution: {
        institutionType:
          edu.institution?.institutionType ||
          edu.institution?.type ||
          "UNIVERSITY",
        name: edu.institution?.name?.trim() || "",
        location: edu.institution?.location?.trim() || "",
      },
      degree: edu.degree?.trim() || "",
      fieldOfStudy: edu.fieldOfStudy?.trim() || "",
      startYear: edu.startYear ? Number(edu.startYear) : null,
      endYear: edu.endYear ? Number(edu.endYear) : null,
      grade:
        edu.grade !== "" && edu.grade !== null && edu.grade !== undefined
          ? Number(edu.grade)
          : null,
    })),

    achievements: (profileData.achievements || []).map((achievement) => ({
      title: achievement.title?.trim() || "",
      description: achievement.description?.trim() || "",
      date: achievement.date || null,
      type: achievement.type || null,
    })),

    socialLinks: (profileData.socialLinks || []).map((link) => ({
      platform: link.platform?.trim() || "",
      url: link.url?.trim() || "",
    })),
  });

  const handleCreateProfile = async () => {
    try {
      if (!profile.fullName.trim()) {
        alert("Full Name is required");
        setActiveTab("basic");
        return;
      }

      setLoading(true);

      const payload = buildProfilePayload(profile);
      const response = await createProfile(payload);

      console.log("Profile saved successfully:", response);
      navigate("/portfolio");
    } catch (error) {
      console.error("Create/update profile failed:", error);
      alert(error.message || "Failed to save profile");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    logout();
    navigate("/");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "basic":
        return (
          <BasicInfoTab
            profile={profile}
            setProfile={setProfile}
            userEmail={profile.email}
          />
        );

      case "skills":
        return <SkillsTab profile={profile} setProfile={setProfile} />;

      case "experience":
        return <ExperienceTab profile={profile} setProfile={setProfile} />;

      case "projects":
        return <ProjectsTab profile={profile} setProfile={setProfile} />;

      case "education":
        return <EducationTab profile={profile} setProfile={setProfile} />;

      case "achievements":
        return <AchievementsTab profile={profile} setProfile={setProfile} />;

      case "social":
        return <SocialLinksTab profile={profile} setProfile={setProfile} />;

      default:
        return (
          <BasicInfoTab
            profile={profile}
            setProfile={setProfile}
            userEmail={profile.email}
          />
        );
    }
  };

  if (pageLoading) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <div>
            <h2>Loading Profile...</h2>
            <p>Please wait</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div>
          <h2>{isExistingProfile ? "Edit Profile" : "New Profile"}</h2>
          <p>Portfolio Builder</p>
        </div>

        <div className="header-actions">
          <button
            className="create-btn"
            onClick={handleCreateProfile}
            disabled={loading}
          >
            {loading
              ? isExistingProfile
                ? "Saving..."
                : "Creating..."
              : isExistingProfile
              ? "Save Changes"
              : "Create Profile"}
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="profile-body">
        <div className="sidebar">
          <div
            className={activeTab === "basic" ? "active" : ""}
            onClick={() => setActiveTab("basic")}
          >
            Basic Info
          </div>

          <div
            className={activeTab === "skills" ? "active" : ""}
            onClick={() => setActiveTab("skills")}
          >
            Skills
          </div>

          <div
            className={activeTab === "experience" ? "active" : ""}
            onClick={() => setActiveTab("experience")}
          >
            Experience
          </div>

          <div
            className={activeTab === "projects" ? "active" : ""}
            onClick={() => setActiveTab("projects")}
          >
            Projects
          </div>

          <div
            className={activeTab === "education" ? "active" : ""}
            onClick={() => setActiveTab("education")}
          >
            Education
          </div>

          <div
            className={activeTab === "achievements" ? "active" : ""}
            onClick={() => setActiveTab("achievements")}
          >
            Achievements
          </div>

          <div
            className={activeTab === "social" ? "active" : ""}
            onClick={() => setActiveTab("social")}
          >
            Social Links
          </div>
        </div>

        <div className="content">{renderActiveTab()}</div>
      </div>
    </div>
  );
}

export default ProfileBuilder;