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
  const bodyElement = document.createElement("div");
  bodyElement.classList.add("issue-body");

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
  bodyElement.appendChild(codeBoxContainer);

  return bodyElement;
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
