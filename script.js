// script.js

import marked from "https://unpkg.com/marked@2.0.0/lib/marked.esm.js";
import { endpoint } from "https://cdn.skypack.dev/@octokit/endpoint";

const TOKEN = "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"; // Your GitHub token (consider handling this server-side)

async function fetchIssues() {
  const { url, ...options } = endpoint("GET /repos/:owner/:repo/issues", {
    owner: "aaronbadger",
    repo: "gh-issues-renderer",
    auth: TOKEN,
  });
  const response = await fetch(url, options);
  const issues = await response.json();
  return issues;
}

function createIssueHeader(issue) {
  const { number, title } = issue;
  const header = document.createElement("h3");
  header.textContent = title;
  header.classList.add("issue-header");
  header.addEventListener("click", () => {
    const body = document.getElementById(`issue-body-${number}`);
    if (body.style.display === "none") {
      body.style.display = "block";
    } else {
      body.style.display = "none";
    }
  });
  return header;
}

function createIssueBody(issue) {
  // ... (existing code)

  const codeBox = document.createElement("pre"); // Create a <pre> element for the code box
  codeBox.classList.add("issue-body-code"); // Apply the CSS class for the code box

  // Render the additional information with clickable URL
  bodyElement.innerHTML = `
    <p><strong>Labels:</strong> ${labels.map((label) => label.name).join(", ")}</p>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Created At:</strong> ${created_at}</p>
    <p><strong>Assignee:</strong> ${assignee ? assignee.login : "None"}</p>
    <p><strong>Reporter:</strong> ${user.login}</p>
    <p><strong>URL:</strong> <a href="${html_url}" target="_blank">${html_url}</a></p>
  `;

  // Convert the markdown body to HTML and place it inside the code box
  codeBox.innerHTML = marked(body);

  bodyElement.appendChild(codeBox); // Append the code box to the issue body

  return bodyElement;
}

function renderIssues(issues) {
  const { search } = window.location;
  const filteredIssues = issues.filter(({ number }) => !search || Number(search.slice(1)) === number);

  const issuesContainer = document.getElementById("issues");

  // Reverse the filteredIssues array to display issues in reverse order
  filteredIssues.reverse().forEach((issue) => {
    const header = createIssueHeader(issue);
    const body = createIssueBody(issue);
    issuesContainer.appendChild(header);
    issuesContainer.appendChild(body);
  });
}

fetchIssues().then(renderIssues);
