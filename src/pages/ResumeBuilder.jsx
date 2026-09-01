import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ResumeTemplateSelector from "../components/resume/ResumeTemplateSelector";
import ResumePreview from "../components/resume/ResumePreview";
import { mapProfileToResumeData } from "../utils/resumeMapper";
import {
  getResumeConfig,
  saveResumeTemplate,
  uploadResumePdf,
} from "../services/resumeService";
import { getProfile, getProfileImageBase64 } from "../services/profileService";
import { logout } from "../utils/auth";
import "../styles/resume/ResumeBuilder.css";

function ResumeBuilder() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState("template1");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pdfResumeData, setPdfResumeData] = useState(null);
  const previewRef = useRef(null);
  const pdfRef = useRef(null);
  const uploadInputRef = useRef(null);

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

  const handlePrintResume = async () => {
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

      prepareTemplateThreePagination(element, selectedTemplate);
      await waitForPrintableAssets(element);

      const previousTitle = document.title;
      try {
        document.title = `${dataForPdf.fullName || "resume"} - Resume`;
        window.print();
      } finally {
        document.title = previousTitle;
      }
    } catch (error) {
      console.error("Failed to prepare resume for printing:", error);
      alert(error.message || "Failed to prepare resume PDF");
    } finally {
      setPdfResumeData(null);
      setSaving(false);
    }
  };

  const handleUploadSavedPdf = async (event) => {
    const [file] = Array.from(event.target.files || []);
    event.target.value = "";
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please select the PDF you saved from the print dialog.");
      return;
    }

    try {
      setSaving(true);
      await uploadResumePdf(file, selectedTemplate);
      alert("ATS-readable resume PDF uploaded successfully ✅");
    } catch (error) {
      console.error("Failed to upload saved resume PDF:", error);
      alert(error.message || "Failed to upload resume PDF");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    logout();
    navigate("/");
  };

  const handleBackToPortfolio = () => {
    navigate("/portfolio");
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
          <div className="resume-builder-header-actions">
            <button
              className="resume-builder-back-btn"
              onClick={handleBackToPortfolio}
            >
              Back to Portfolio
            </button>
            <button className="resume-builder-logout-btn" onClick={handleLogout}>
              Logout
            </button>
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
                  onClick={handlePrintResume}
                  disabled={saving}
                >
                  {saving ? "Preparing PDF..." : "Print / Save as PDF"}
                </button>
                <input
                  ref={uploadInputRef}
                  className="resume-builder-file-input"
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={handleUploadSavedPdf}
                />
                <button
                  type="button"
                  className="resume-builder-upload-btn"
                  onClick={() => uploadInputRef.current?.click()}
                  disabled={saving}
                >
                  Upload Saved PDF
                </button>
                <p className="resume-builder-pdf-note">
                  In the print dialog, choose Save as PDF. Upload that saved file if
                  it should replace the resume stored with your portfolio.
                </p>
                <div className="resume-builder-action-note">
                  <strong>Selected template</strong>
                  <span>{getTemplateName(selectedTemplate)}</span>
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
                {getTemplateNumber(selectedTemplate)}
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

      <div
        className={`resume-pdf-hidden ${
          selectedTemplate === "template3" ? "resume-pdf-hidden-template3" : ""
        }`}
      >
        <div id="resume-pdf-preview" ref={pdfRef}>
          <ResumePreview
            selectedTemplate={selectedTemplate}
            data={pdfResumeData || resumeData}
          />
        </div>
      </div>
    </div>
  );
}

function prepareTemplateThreePagination(element, selectedTemplate) {
  if (selectedTemplate !== "template3") return;

  const sections = element?.querySelectorAll(".rt3-section");
  if (!sections?.length) return;

  sections.forEach((section) => section.classList.remove("rt3-section-page-break"));

  const rootTop = element.getBoundingClientRect().top;
  const a4InnerPageHeight = ((841.89 / 72) - 0.4) * 96;
  const cardSelector = [
    ".rt3-summary-card",
    ".rt3-skill-matrix",
    ".rt3-experience-card",
    ".rt3-project-card",
    ".rt3-education-card",
    ".rt3-achievement-card",
  ].join(", ");
  let insertedPageBreakSpace = 0;

  const accountForIntactCard = (card) => {
    const cardRect = card.getBoundingClientRect();
    const cardTop = cardRect.top - rootTop + insertedPageBreakSpace;
    const cardBottom = cardRect.bottom - rootTop + insertedPageBreakSpace;
    const cardStartPage = Math.floor(cardTop / a4InnerPageHeight);
    const cardEndPage = Math.floor((cardBottom - 1) / a4InnerPageHeight);

    if (cardStartPage !== cardEndPage && cardRect.height <= a4InnerPageHeight) {
      insertedPageBreakSpace += a4InnerPageHeight - (cardTop % a4InnerPageHeight);
    }
  };

  const header = element.querySelector(".rt3-header");
  if (header) accountForIntactCard(header);

  sections.forEach((section) => {
    const firstCard = section.querySelector(cardSelector);
    if (!firstCard) return;

    const sectionTop =
      section.getBoundingClientRect().top - rootTop + insertedPageBreakSpace;
    const firstCardBottom =
      firstCard.getBoundingClientRect().bottom - rootTop + insertedPageBreakSpace + 2;
    const sectionStartPage = Math.floor(sectionTop / a4InnerPageHeight);
    const firstCardEndPage = Math.floor((firstCardBottom - 1) / a4InnerPageHeight);

    if (sectionStartPage !== firstCardEndPage) {
      section.classList.add("rt3-section-page-break");
      insertedPageBreakSpace += a4InnerPageHeight - (sectionTop % a4InnerPageHeight);
    }

    section.querySelectorAll(cardSelector).forEach(accountForIntactCard);
  });
}

async function waitForPrintableAssets(element) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const pendingImages = Array.from(element?.querySelectorAll("img") || [])
    .filter((image) => !image.complete)
    .map(
      (image) =>
        new Promise((resolve) => {
          image.addEventListener("load", resolve, { once: true });
          image.addEventListener("error", resolve, { once: true });
        })
    );

  await Promise.all(pendingImages);
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
}

function getTemplateName(templateId) {
  const names = {
    template1: "ATS Standard",
    template2: "Modern With Image",
    template3: "Executive Professional",
    template4: "ATS Experience Focused",
  };
  return names[templateId] || names.template1;
}

function getTemplateNumber(templateId) {
  const labels = {
    template1: "Template One",
    template2: "Template Two",
    template3: "Template Three",
    template4: "Template Four",
  };
  return labels[templateId] || labels.template1;
}

export default ResumeBuilder;
