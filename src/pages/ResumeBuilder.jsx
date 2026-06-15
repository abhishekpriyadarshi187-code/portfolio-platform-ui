import { useEffect, useMemo, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import ResumeTemplateSelector from "../components/resume/ResumeTemplateSelector";
import ResumePreview from "../components/resume/ResumePreview";
import { mapProfileToResumeData } from "../utils/resumeMapper";
import {
  getResumeConfig,
  saveResumeTemplate,
  uploadResumePdf,
} from "../services/resumeService";
import { getProfile, getProfileImageBase64 } from "../services/profileService";
import "../styles/resume/ResumeBuilder.css";

function ResumeBuilder() {
  const [profile, setProfile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfResumeData, setPdfResumeData] = useState(null);
  const previewRef = useRef(null);
  const pdfRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [profileData, resumeConfig] = await Promise.all([
        getProfile(),
        getResumeConfig().catch(() => null),
      ]);

      setProfile(profileData);
      if (resumeConfig?.templateId) {
        setSelectedTemplate(resumeConfig.templateId);
      }
    } catch (error) {
      console.error("Failed to load resume builder data:", error);
    } finally {
      setLoading(false);
    }
  };

  const resumeData = useMemo(() => mapProfileToResumeData(profile || {}), [profile]);

  const handleTemplateSelect = async (templateId) => {
    try {
      setSelectedTemplate(templateId);
      await saveResumeTemplate(templateId);
    } catch (error) {
      console.error("Failed to save template selection:", error);
      alert(error.message || "Failed to save template selection");
    }
  };

  const handleDownloadAndUpload = async () => {
    try {
      if (!previewRef.current) return;

      setSaving(true);

      let dataForPdf = { ...resumeData };

      try {
        const base64Image = await getProfileImageBase64();

        if (base64Image) {
          dataForPdf.profileImageUrl = base64Image;
          dataForPdf.profilePhoto = base64Image;
        }
      } catch (error) {
        console.error("Failed to load base64 profile image for PDF:", error);
      }

      setPdfResumeData(dataForPdf);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const element = pdfRef.current || previewRef.current;

      const worker = html2pdf().set({
        margin: 0.2,
        filename: `${dataForPdf.fullName || "resume"}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, allowTaint: false },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      }).from(element);

      const pdfBlob = await worker.outputPdf("blob");

      const file = new File([pdfBlob], `${dataForPdf.fullName || "resume"}.pdf`, {
        type: "application/pdf",
      });

      await uploadResumePdf(file, selectedTemplate);

      const downloadUrl = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = `${dataForPdf.fullName || "resume"}.pdf`;
      link.click();
      URL.revokeObjectURL(downloadUrl);

      alert("Resume generated, uploaded, and downloaded successfully ✅");
    } catch (error) {
      console.error("Failed to generate/upload resume:", error);
      alert(error.message || "Failed to generate resume PDF");
    } finally {
      setPdfResumeData(null);
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="resume-builder-page">Loading resume builder...</div>;
  }

  return (
    <div className="resume-builder-page">
      <div className="resume-builder-header">
        <div>
          <h1>Resume Builder</h1>
          <p>Select a template, preview it, then generate your PDF.</p>
        </div>

        <button
          className="resume-builder-primary-btn"
          onClick={handleDownloadAndUpload}
          disabled={saving}
        >
          {saving ? "Generating..." : "Generate & Download PDF"}
        </button>
      </div>

      <ResumeTemplateSelector
        selectedTemplate={selectedTemplate}
        onSelect={handleTemplateSelect}
      />

      <div className="resume-preview-wrapper">
        <div id="resume-preview" ref={previewRef}>
          <ResumePreview selectedTemplate={selectedTemplate} data={resumeData} />
        </div>
      </div>

      <div className="resume-pdf-hidden">
        <div id="resume-pdf-preview" ref={pdfRef}>
          {pdfResumeData && (
            <ResumePreview
              selectedTemplate={selectedTemplate}
              data={pdfResumeData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;
