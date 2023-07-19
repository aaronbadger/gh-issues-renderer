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
  const { number, body, labels, state, created_at, assignee, user, html_url } = issue;
  const bodyElement = document.createElement("div");
  bodyElement.classList.add("issue-body");
  bodyElement.id = `issue-body-${number}`;
  bodyElement.style.display = "none";

  const codeBoxContainer = document.createElement("div");
  codeBoxContainer.classList.add("code-box-container");

  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Toggle Code";
  toggleButton.addEventListener("click", () => {
    codeBox.classList.toggle("hidden");
  });

  const codeBox = document.createElement("pre");
  codeBox.classList.add("issue-body-code");
  codeBox.classList.add("hidden"); // Initially hide the code box

  codeBox.innerHTML = marked(body);

  bodyElement.innerHTML = `
    <p><strong>Labels:</strong> ${labels.map((label) => label.name).join(", ")}</p>
    <p><strong>State:</strong> ${state}</p>
    <p><strong>Created At:</strong> ${created_at}</p>
    <p><strong>Assignee:</strong> ${assignee ? assignee.login : "None"}</p>
    <p><strong>Reporter:</strong> ${user.login}</p>
    <p><strong>URL:</strong> <a href="${html_url}" target="_blank">${html_url}</a></p>
  `;

  codeBoxContainer.appendChild(toggleButton);
  codeBoxContainer.appendChild(codeBox);
  bodyElement.appendChild(codeBoxContainer);

  return bodyElement;
}

function renderIssues(issues) {
  const { search } = window.location;
  const filteredIssues = issues.filter(({ number }) => !search || Number(search.slice(1)) === number);

  const issuesContainer = document.getElementById("issues");

  filteredIssues.reverse().forEach((issue) => {
    const header = createIssueHeader(issue);
    const body = createIssueBody(issue);
    issuesContainer.appendChild(header);
    issuesContainer.appendChild(body);
  });
}

fetchIssues().then(renderIssues);
