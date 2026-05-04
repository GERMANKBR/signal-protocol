const dashboardSources = {
  dashboard: "api/dashboard-state.json",
  economy: "api/economy-state.json",
  pool: "api/pool-status.json",
  claims: "api/claim-ledger.json",
  activation: "api/activation-engine.json",
  hybrid: "api/hybrid-economy.json",
  quests: "api/quests.json"
};

const githubIssuesUrl = "https://api.github.com/repos/GERMANKBR/signal-protocol/issues?state=all&per_page=100";
const dashboardState = {
  data: {},
  github: { available: false, issues: [] },
  selectedDataset: "dashboard"
};

const statusLabels = {
  complete: "Complete",
  waiting_for_external_submissions: "Waiting",
  blocked_by_zero_sol_budget: "Blocked",
  not_deployed: "Not deployed",
  live: "Live",
  open: "Open",
  true: "Yes",
  false: "No"
};

function titleCase(input) {
  return String(input || "")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function labelStatus(value) {
  const key = String(value);
  return statusLabels[key] || titleCase(key);
}

function setText(id, value) {
  const node = document.getElementById(id);
  if (node) node.textContent = value;
}

function setHtml(id, value) {
  const node = document.getElementById(id);
  if (node) node.innerHTML = value;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}`);
  }
  return response.json();
}

async function loadDashboard() {
  setText("lastUpdated", "Refreshing...");
  setText("githubStatus", "Loading");
  setText("dataStatus", "Loading");

  const entries = await Promise.allSettled(
    Object.entries(dashboardSources).map(async ([key, url]) => [key, await fetchJson(url)])
  );

  entries.forEach((entry) => {
    if (entry.status === "fulfilled") {
      const [key, value] = entry.value;
      dashboardState.data[key] = value;
    }
  });

  try {
    dashboardState.github.issues = await fetchJson(githubIssuesUrl);
    dashboardState.github.available = true;
  } catch (error) {
    dashboardState.github.available = false;
    dashboardState.github.error = error.message;
  }

  renderDashboard();
}

function renderDashboard() {
  const dashboard = dashboardState.data.dashboard || {};
  const economy = dashboardState.data.economy || {};
  const pool = dashboardState.data.pool || {};
  const claims = dashboardState.data.claims || {};

  const modules = economy.live_modules || {};
  const moduleCount = Object.values(modules).filter(Boolean).length;
  const moduleTotal = Object.keys(modules).length || 0;
  const claimCount = Array.isArray(claims.claims) ? claims.claims.length : 0;
  const issues = getRealIssues();
  const openIssueCount = issues.filter((issue) => issue.state === "open").length;
  const liquidityStatus = pool.liquidity?.status || economy.onchain_state?.dex_liquidity || "unknown";

  setText("lastUpdated", dashboard.updated || economy.updated || "Unknown");
  setText("metricPhase", economy.phase || dashboard.phase || "-");
  setText("metricStatus", dashboard.status ? `Dashboard ${labelStatus(dashboard.status)}` : "Static API active");
  setText("metricModules", moduleTotal ? `${moduleCount}/${moduleTotal}` : "-");
  setText("metricClaims", `${claimCount} ledger / ${openIssueCount} open`);
  setText("metricLiquidity", labelStatus(liquidityStatus));
  setText("metricRouting", pool.liquidity?.jupiter_routable ? "Jupiter routable" : "Not Jupiter routable");
  setText("nextAction", economy.next_machine_action || "Fetch public manifests and submit proof through the Mind Console.");

  renderMilestones(dashboard.milestones || []);
  renderModules(modules);
  renderTruth(dashboard.risk_truth || {}, economy.onchain_state || {});
  renderIssues(dashboard.label_groups || {});
  renderJson();
  setText("dataStatus", "Ready");
}

function renderMilestones(milestones) {
  const completed = milestones.filter((item) => item.status === "complete").length;
  setText("milestoneCount", `${completed}/${milestones.length || 0}`);
  if (!milestones.length) {
    setHtml("milestoneList", `<p class="empty-state">No milestone data loaded.</p>`);
    return;
  }

  const rows = milestones.map((item) => {
    const status = String(item.status || "unknown");
    const className = status === "complete" ? "ok" : status.includes("blocked") ? "blocked" : "waiting";
    return `
      <a class="milestone-row" href="${item.url}" target="_blank" rel="noreferrer">
        <span>
          <strong>${item.name}</strong>
          <small>${item.id}</small>
        </span>
        <span class="status-pill ${className}">${labelStatus(status)}</span>
      </a>
    `;
  }).join("");
  setHtml("milestoneList", rows);
}

function renderModules(modules) {
  const names = Object.keys(modules);
  if (!names.length) {
    setText("moduleStatus", "No data");
    setHtml("moduleGrid", `<p class="empty-state">No module data loaded.</p>`);
    return;
  }

  const active = names.filter((name) => modules[name]).length;
  setText("moduleStatus", `${active}/${names.length}`);
  const html = names.map((name) => {
    const online = Boolean(modules[name]);
    return `
      <div class="module-row">
        <span class="module-dot ${online ? "online" : "offline"}"></span>
        <span>${titleCase(name)}</span>
        <strong>${online ? "Live" : "Off"}</strong>
      </div>
    `;
  }).join("");
  setHtml("moduleGrid", html);
}

function renderTruth(riskTruth, onchainState) {
  const truthItems = [
    ["DEX liquidity", riskTruth.dex_liquidity || onchainState.dex_liquidity || "unknown"],
    ["On-chain airdrop", riskTruth.onchain_airdrop_live ?? onchainState.onchain_airdrop_live ?? false],
    ["Automatic AI trading", riskTruth.automatic_ai_trading ?? false],
    ["Profit guarantee", riskTruth.profit_guarantee ?? false],
    ["Reward type", riskTruth.reward_type || "offchain_reward_intent"]
  ];

  const html = truthItems.map(([label, value]) => `
    <div class="truth-row">
      <span>${label}</span>
      <strong>${labelStatus(value)}</strong>
    </div>
  `).join("");
  setHtml("truthList", html);
}

function getRealIssues() {
  const issues = Array.isArray(dashboardState.github.issues) ? dashboardState.github.issues : [];
  return issues.filter((issue) => !issue.pull_request);
}

function renderIssues(labelGroups) {
  if (!dashboardState.github.available) {
    setText("githubStatus", "Unavailable");
    setHtml("issueSummary", `<p class="empty-state">GitHub API unavailable. Static dashboard data still loaded.</p>`);
    setHtml("issueLabelGrid", "");
    return;
  }

  const issues = getRealIssues();
  const open = issues.filter((issue) => issue.state === "open").length;
  const closed = issues.filter((issue) => issue.state === "closed").length;
  setText("githubStatus", `${open} open`);
  setHtml("issueSummary", `
    <div class="issue-metrics">
      <div><strong>${issues.length}</strong><span>Total issues</span></div>
      <div><strong>${open}</strong><span>Open</span></div>
      <div><strong>${closed}</strong><span>Closed</span></div>
    </div>
  `);

  const groups = Object.entries(labelGroups);
  if (!groups.length) {
    setHtml("issueLabelGrid", `<p class="empty-state">No label groups defined.</p>`);
    return;
  }

  const html = groups.map(([groupName, labels]) => {
    const wanted = new Set(labels.map((label) => label.toLowerCase()));
    const count = issues.filter((issue) => {
      const issueLabels = (issue.labels || []).map((label) => String(label.name || label || "").toLowerCase());
      return issueLabels.some((label) => wanted.has(label));
    }).length;
    return `
      <div class="issue-label-row">
        <span>${titleCase(groupName)}</span>
        <strong>${count}</strong>
      </div>
    `;
  }).join("");
  setHtml("issueLabelGrid", html);
}

function renderJson() {
  const viewer = document.getElementById("jsonViewer");
  if (!viewer) return;
  const key = dashboardState.selectedDataset;
  const value = dashboardState.data[key] || { status: "not_loaded", dataset: key };
  viewer.textContent = JSON.stringify(value, null, 2);
}

function bindControls() {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => navLinks.classList.toggle("open"));
  }

  const refresh = document.getElementById("refreshDashboard");
  if (refresh) {
    refresh.addEventListener("click", loadDashboard);
  }

  document.querySelectorAll(".data-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".data-tab").forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      dashboardState.selectedDataset = tab.dataset.dataset;
      renderJson();
    });
  });

  window.addEventListener("scroll", () => {
    const nav = document.getElementById("navbar");
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 20);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  bindControls();
  loadDashboard();
});
