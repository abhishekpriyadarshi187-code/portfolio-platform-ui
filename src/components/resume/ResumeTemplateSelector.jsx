function ResumeTemplateSelector({ selectedTemplate, onSelect }) {
  const templates = [
    {
      id: "template1",
      title: "Classic Professional",
      description: "Clean two-column resume for strong readability.",
    },
    {
      id: "template2",
      title: "Modern With Image",
      description: "Visual layout with profile image and premium styling.",
    },
  ];

  return (
    <div className="resume-template-selector">
      {templates.map((template) => (
        <button
          key={template.id}
          type="button"
          className={`resume-template-card ${
            selectedTemplate === template.id ? "selected" : ""
          }`}
          onClick={() => onSelect(template.id)}
        >
          <div className="resume-template-card-copy">
            <h3>{template.title}</h3>
            <p>{template.description}</p>
          </div>
          <span className="resume-template-card-status">
            {selectedTemplate === template.id ? "Selected" : "Choose"}
          </span>
        </button>
      ))}
    </div>
  );
}

export default ResumeTemplateSelector;
