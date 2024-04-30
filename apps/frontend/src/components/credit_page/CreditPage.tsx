import React from "react";
import styles from "./CreditPage.module.css"; // Importing the CSS file
import BackgroundImg2 from "../assets/blue-background2.jpg";

const Credits = () => {
  const softwareTools = [
    {
      name: "AWS",
      role: "Cloud service that allows deployment of our resources for public view rather than development view.",
      link: "https://aws.amazon.com/",
    },
    {
      name: "Docker Hub",
      role: "Allowed for population of the cloud services from the github repository.",
      link: "https://hub.docker.com/",
    },
    {
      name: "Github",
      role: "Stored the repository, helped work on code as a full team.",
      link: "https://github.com/",
    },
    {
      name: "PostgreSQL",
      role: "Allowed for local development on the database, was also the schema type used for the cloud service.",
      link: "https://www.postgresql.org/",
    },
    {
      name: "Webstorm",
      role: "IDE the team used for any programming work.",
      link: "https://www.jetbrains.com/webstorm/",
    },
  ];
  const softwareLibraries = [
    {
      name: "Auth0",
      role: "Authentication method.",
      link: "https://auth0.com/",
    },
    {
      name: "Autoprefixer",
      role: "PostCSS plugin to parse CSS and add vendor prefixes to CSS rules",
      link: "https://autoprefixer.github.io/",
    },
    {
      name: "Axios",
      role: "Accessed backend API's from frontend.",
      link: "https://axios-http.com/docs/intro",
    },
    {
      name: "Express",
      role: "Created backend API's.",
      link: "https://expressjs.com/",
    },
    {
      name: "Popperjs",
      role: "Tooltip & popover positioning engine",
      link: "https://popper.js.org/docs/v2/",
    },
    {
      name: "Prisma",
      role: "Next-generation Node.js and TypeScript ORM for databases",
      link: "https://www.prisma.io/",
    },
    {
      name: "Papaparse",
      role: "Powerful CSV parser for browsers and Node.js",
      link: "https://www.papaparse.com/",
    },
    {
      name: "CSV-Parse",
      role: "CSV parsing tool",
      link: "https://www.npmjs.com/package/csv-parse",
    },
    {
      name: "CSV-Writer",
      role: "Tool to write data in CSV format",
      link: "https://www.npmjs.com/package/csv-writer",
    },
    {
      name: "Jose",
      role: "JavaScript library to handle JSON Web Tokens (JWT)",
      link: "https://www.npmjs.com/package/jose",
    },
    {
      name: "HTTP-Terminator",
      role: "Gracefully terminates HTTP(S) servers",
      link: "https://www.npmjs.com/package/http-terminator",
    },
    {
      name: "Localforage",
      role: "Fast and simple storage library for JavaScript",
      link: "https://www.npmjs.com/package/localforage",
    },
    {
      name: "Marked",
      role: "Markdown parser and compiler",
      link: "https://github.com/markedjs/marked",
    },
    {
      name: "Match-Sorter",
      role: "Simple, expected, and deterministic best-match sorting of an array in JavaScript",
      link: "https://www.npmjs.com/package/match-sorter",
    },
    {
      name: "Postcss",
      role: "Tool for transforming CSS with JavaScript",
      link: "https://postcss.org/",
    },
    {
      name: "Serve",
      role: "Static file serving and directory listing",
      link: "https://www.npmjs.com/package/serve",
    },
    {
      name: "Sort-By",
      role: "Function that returns a sort function for the Array#sort() method",
      link: "https://www.npmjs.com/package/sort-by",
    },
    {
      name: "Husky",
      role: "Modern native Git hooks made easy",
      link: "https://typicode.github.io/husky/",
    },
    {
      name: "Turbo",
      role: "High-performance build system that only rebuilds what is necessary",
      link: "https://turbo.build/",
    },
  ];
  const frameworks = [
    {
      name: "Bootstrap",
      role: "CSS framework for developing responsive and mobile-first websites",
      link: "https://getbootstrap.com/docs/4.3/getting-started/introduction/",
    },
    {
      name: "Cookie-Parser",
      role: "Parse Cookie header and populate req.cookies with an object keyed by the cookie names",
      link: "https://www.npmjs.com/package/cookie-parser",
    },
    {
      name: "HTTP-Errors",
      role: "Create HTTP error objects",
      link: "",
    },
    {
      name: "Express",
      role: "Fast, unopinionated, minimalist web framework for Node.js",
      link: "https://expressjs.com/",
    },
    {
      name: "Happy-Dom",
      role: "A fast in-memory DOM implementation for testing",
      link: "https://www.npmjs.com/package/happy-dom",
    },
    {
      name: "Morgan",
      role: "HTTP request logger middleware for node.js",
      link: "https://github.com/expressjs/morgan",
    },
    {
      name: "Tailwindcss",
      role: "A utility-first CSS framework for rapid UI development",
      link: "https://tailwindcss.com/",
    },
    {
      name: "Vitest",
      role: "A blazing fast unit-test framework with Vue.js support",
      link: "https://vitest.dev/",
    },
  ];

  return (
    <div
      style={{
        backgroundImage: `url(${BackgroundImg2})`,
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        minHeight: "100%",
        backgroundPosition: "center center",
        overflowX: "hidden",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className={styles.creditsContainer}>
        <h1>Software Tools</h1>
        <ul>
          {softwareTools.map((tool, index) => (
            <li key={index} className={styles.contributor}>
              <strong>
                <a href={tool.link}>{tool.name}</a>
              </strong>{" "}
              - {tool.role}
            </li>
          ))}
        </ul>
        <h1>Software Libraries</h1>
        <ul>
          {softwareLibraries.map((library, index) => (
            <li key={index} className={styles.contributor}>
              <strong>
                <a href={library.link}>{library.name}</a>
              </strong>{" "}
              - {library.role}
            </li>
          ))}
        </ul>
        <h1>Frameworks</h1>
        <ul>
          {frameworks.map((framework, index) => (
            <li key={index} className={styles.contributor}>
              <strong>
                <a href={framework.link}>{framework.name}</a>
              </strong>{" "}
              - {framework.role}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Credits;
