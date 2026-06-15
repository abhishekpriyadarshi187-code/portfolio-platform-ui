export const mapProfileToResumeData = (profile) => ({
  fullName: profile?.fullName || "",
  email: profile?.email || "",
  headline: profile?.headline || "",
  about: profile?.about || "",
  profilePhoto: profile?.profileImageUrl || profile?.profilePhoto || "",
  profileImageUrl: profile?.profileImageUrl || "",
  skills: profile?.skills || [],
  experiences: profile?.experiences || [],
  projects: profile?.projects || [],
  education: profile?.education || [],
  achievements: profile?.achievements || [],
  socialLinks: profile?.socialLinks || [],
});
