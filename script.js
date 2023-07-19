// script.js

import marked from "https://unpkg.com/marked@2.0.0/lib/marked.esm.js";
import { endpoint } from "https://cdn.skypack.dev/@octokit/endpoint";

const TOKEN = ""; // Your GitHub token (consider handling this server-side)

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
  const header = document.createElement("h2");
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
  const { number, body, labels, state, created_at, assignee, user } = issue;
  const bodyElement = document.createElement("div");
  bodyElement.classList.add("issue-body");
  bodyElement.id = `issue-body-${number}`;
  bodyElement.style.display = "none";

  // Render the additional information
  bodyElement.innerHTML = `
    <p><strong>Labels:</strong> ${labels.map((label) => label.name).join(", ")}</p>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Created At:</strong> ${created_at}</p>
    <p><strong>Assignee:</strong> ${assignee ? assignee.login : "None"}</p>
    <p><strong>Reporter:</strong> ${user.login}</p>
    <div>${marked(body)}</div>
  `;

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
