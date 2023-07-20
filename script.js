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

function createIssueBody(issue) {
  const { number, body, labels, state, created_at, assignee, user, html_url, title } = issue;

  const issueCard = document.createElement("div");
  issueCard.classList.add("issue-card");

  const titleElement = document.createElement("h2");
  titleElement.textContent = title;

  const labelsElement = document.createElement("p");
  labelsElement.innerHTML = `<strong>Labels:</strong> ${labels.map((label) => label.name).join(", ")}`;

  const stateElement = document.createElement("p");
  stateElement.innerHTML = `<strong>State:</strong> ${state}`;

  const createdAtElement = document.createElement("p");
  createdAtElement.innerHTML = `<strong>Created At:</strong> ${created_at}`;

  const assigneeElement = document.createElement("p");
  assigneeElement.innerHTML = `<strong>Assignee:</strong> ${assignee ? assignee.login : "None"}`;

  const reporterElement = document.createElement("p");
  reporterElement.innerHTML = `<strong>Reporter:</strong> ${user.login}`;

  const urlElement = document.createElement("p");
  urlElement.innerHTML = `<strong>URL:</strong> <a href="${html_url}" target="_blank">${html_url}</a>`;

  const codeBoxContainer = document.createElement("div");
  codeBoxContainer.classList.add("code-box-container");

  const codeBox = document.createElement("pre");
  codeBox.classList.add("issue-body-code");
  codeBox.innerHTML = marked(body);

  // Add a button to toggle code box visibility
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Toggle Code Box";
  toggleButton.addEventListener("click", () => {
    codeBox.classList.toggle("hidden");
  });

  codeBoxContainer.appendChild(toggleButton);
  codeBoxContainer.appendChild(codeBox);

  // Append all elements to the issueCard
  issueCard.appendChild(titleElement);
  issueCard.appendChild(labelsElement);
  issueCard.appendChild(stateElement);
  issueCard.appendChild(createdAtElement);
  issueCard.appendChild(assigneeElement);
  issueCard.appendChild(reporterElement);
  issueCard.appendChild(urlElement);
  issueCard.appendChild(codeBoxContainer);

  return issueCard;
}

function renderIssues(issues) {
  const { search } = window.location;
  const filteredIssues = issues.filter(({ number }) => !search || Number(search.slice(1)) === number);

  const issuesContainer = document.getElementById("issues");

  filteredIssues.reverse().forEach((issue) => {
    const body = createIssueBody(issue);
    issuesContainer.appendChild(body);
  });
}

fetchIssues().then(renderIssues);
