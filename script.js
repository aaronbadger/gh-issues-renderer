import marked from "https://unpkg.com/marked@2.0.0/lib/marked.esm.js";
import { endpoint } from "https://cdn.skypack.dev/@octokit/endpoint";

const TOKEN = ""; // Your GitHub token (consider handling this server-side)
const issuesContainer = document.getElementById("issues");

async function fetchIssues() {
  const { url, ...options } = endpoint("GET /repos/:owner/:repo/issues", {
    owner: "aaronbadger",
    repo: "gh-issues-renderer",
    auth: "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",
  });
  const response = await fetch(url, options);
  const issues = await response.json();
  return issues;
}

function renderIssues(issues) {
  const { search } = window.location;
  const filteredIssues = issues.filter(({ number }) => !search || Number(search.slice(1)) === number);

  const issuesHTML = filteredIssues
    .map(({ number, title, body }) => `
      <div id=${number} key=${number}>
        <h2>
          <a href="?${number}">${title}</a>
        </h2>
        <div>${marked(body)}</div>
      </div>
    `)
    .join("");

  issuesContainer.innerHTML = issuesHTML;
}

fetchIssues().then(renderIssues);
