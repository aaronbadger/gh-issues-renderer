// script.js

import marked from "https://unpkg.com/marked@2.0.0/lib/marked.esm.js";
import { endpoint } from "https://cdn.skypack.dev/@octokit/endpoint";

const TOKEN = "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"; // Your GitHub token (consider handling this server-side)

const repositories = ["gh-issues-renderer", "gh-issues-renderer-repo2"]; // Replace "repo1" and "repo2" with actual repository names

async function fetchIssues(repoNames) {
  const issuesPromises = repoNames.map(async (repoName) => {
    const { url, ...options } = endpoint("GET /repos/:owner/:repo/issues", {
      owner: "aaronbadger",
      repo: repoName,
      auth: TOKEN,
    });
    const response = await fetch(url, options);
    return response.json();
  });

  const allIssues = await Promise.all(issuesPromises);

  // Flatten the array of arrays into a single array of issues
  const flattenedIssues = allIssues.flat();

  return flattenedIssues;
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
  codeBox.classList.add("issue-body-code", "hidden"); // Add the 'hidden' class to collapse by default
  codeBox.innerHTML = marked(body);

  // Add a button to toggle code box visibility
  const toggleButton = document.createElement("button");
  toggleButton.textContent = "Expand Issue Detail";
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

  const filterSelect = document.getElementById("filter");
  filterSelect.addEventListener("change", () => {
    const selectedState = filterSelect.value;

    const filteredIssues = selectedState === "all" ? issues : issues.filter((issue) => issue.state === selectedState);

    // Clear existing issue cards before rendering filtered issues
    const issuesContainer = document.getElementById("issues");
    issuesContainer.innerHTML = "";

    filteredIssues.reverse().forEach((issue) => {
      const body = createIssueBody(issue);
      issuesContainer.appendChild(body);
    });
  });

  // Initial rendering with all issues
  renderFilteredIssues(issues);
}

fetchIssues().then(renderIssues);
