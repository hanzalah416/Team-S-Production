import React from "react";
import "./CreditPage.module.css"; // Importing the CSS file

const Credits = () => {
  const softwareTools = [
    {
      name: "AWS",
      role: "Cloud service that allows deployment of our resources for public view rather than development view. https://aws.amazon.com/",
    },
  ];
  const softwareLibraries = [{ name: "Temp Library", role: "Temp Desc" }];
  const frameworks = [{ name: "Temp Framework", role: "Temp Desc" }];

  return (
    <div className="creditsContainer">
      <h1>Software Tools</h1>
      <ul>
        {softwareTools.map((contributor, index) => (
          <li key={index} className="contributor">
            <strong>{contributor.name}</strong> - {contributor.role}
          </li>
        ))}
      </ul>
      <h1>Software Libraries</h1>
      <ul>
        {softwareLibraries.map((contributor, index) => (
          <li key={index} className="contributor">
            <strong>{contributor.name}</strong> - {contributor.role}
          </li>
        ))}
      </ul>
      <h1>Frameworks</h1>
      <ul>
        {frameworks.map((contributor, index) => (
          <li key={index} className="contributor">
            <strong>{contributor.name}</strong> - {contributor.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Credits;
