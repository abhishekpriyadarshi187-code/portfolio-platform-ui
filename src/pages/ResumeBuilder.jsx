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

  useEffect(() => {
    const rootElement = document.getElementById("root");
    rootElement?.classList.add("resume-builder-root");

    return () => {
      rootElement?.classList.remove("resume-builder-root");
    };
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
      <div className="resume-builder-shell">
        <header className="resume-builder-header">
          <div className="resume-builder-heading">
            <span className="resume-builder-kicker">Resume Workspace</span>
            <h1>Resume Builder</h1>
            <p>Create and export professional resumes from your portfolio.</p>
          </div>
        </header>

        <div className="resume-builder-workspace">
          <aside className="resume-builder-sidebar">
            <section className="resume-builder-panel">
              <span className="resume-builder-panel-label">Templates</span>
              <h2>Choose your layout</h2>
              <p>Switch templates instantly and keep the preview front and center.</p>

              <ResumeTemplateSelector
                selectedTemplate={selectedTemplate}
                onSelect={handleTemplateSelect}
              />
            </section>

            <section className="resume-builder-panel resume-builder-actions-panel">
              <span className="resume-builder-panel-label">Resume Actions</span>
              <h2>Export your resume</h2>
              <p>
                Generate a polished A4 PDF using your selected template and portfolio
                content.
              </p>

              <div className="resume-builder-actions">
                <button
                  className="resume-builder-primary-btn"
                  onClick={handleDownloadAndUpload}
                  disabled={saving}
                >
                  {saving ? "Generating PDF..." : "Generate & Download PDF"}
                </button>
                <div className="resume-builder-action-note">
                  <strong>Selected template</strong>
                  <span>{selectedTemplate === "template2" ? "Modern With Image" : "Classic Professional"}</span>
                </div>
              </div>
            </section>
          </aside>

          <section className="resume-preview-stage">
            <div className="resume-preview-stage-header">
              <div>
                <span className="resume-builder-panel-label">Live Preview</span>
                <h2>A4 Resume Preview</h2>
              </div>
              <span className="resume-preview-chip">
                {selectedTemplate === "template2" ? "Template Two" : "Template One"}
              </span>
            </div>

            <div className="resume-preview-wrapper">
              <div id="resume-preview" ref={previewRef}>
                <ResumePreview selectedTemplate={selectedTemplate} data={resumeData} />
              </div>
            </div>
          </section>
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
