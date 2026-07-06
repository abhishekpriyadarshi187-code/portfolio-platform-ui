import ResumeTemplateOne from "./ResumeTemplateOne";
import ResumeTemplateThree from "./ResumeTemplateThree";
import ResumeTemplateTwo from "./ResumeTemplateTwo";

function ResumePreview({ selectedTemplate, data }) {
  if (selectedTemplate === "template3") {
    return <ResumeTemplateThree data={data} />;
  }

  if (selectedTemplate === "template2") {
    return <ResumeTemplateTwo data={data} />;
  }

  return <ResumeTemplateOne data={data} />;
}

export default ResumePreview;
