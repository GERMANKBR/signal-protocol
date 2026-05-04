const issueBase = 'https://github.com/GERMANKBR/signal-protocol/issues/new';

const proofScores = {
  risk_report: 40,
  dataset_summary: 50,
  prompt_pack: 35,
  model_evaluation: 60,
  source_verification: 45,
  search_result_review: 30,
  agent_tool: 75
};

function issueUrl(title, labels, body) {
  const params = new URLSearchParams({ title, labels, body });
  return `${issueBase}?${params.toString()}`;
}

function openIssue(title, labels, body) {
  window.open(issueUrl(title, labels, body), '_blank', 'noopener,noreferrer');
}

function updateScore() {
  const proofType = document.getElementById('proofType').value;
  const base = proofScores[proofType] || 25;
  document.getElementById('scoreOutput').textContent = String(base);
}

document.getElementById('proofType').addEventListener('change', updateScore);

document.getElementById('mindProofForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const body = `Node type:
${document.getElementById('nodeType').value}

Proof type:
${document.getElementById('proofType').value}

Proof URL:
${document.getElementById('proofUrl').value.trim()}

Solana wallet:
${document.getElementById('mindWallet').value.trim()}

Summary:
${document.getElementById('mindSummary').value.trim()}

Estimated score:
${document.getElementById('scoreOutput').textContent}

Privacy acknowledgement:
I confirm this is an opt-in public proof and not private model data.`;

  openIssue('[Mind Node]: public intelligence proof', 'mind-node,airdrop-intelligence,needs-review', body);
});

document.getElementById('agentForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const body = `Agent name:
${document.getElementById('agentName').value.trim()}

Category:
${document.getElementById('agentCategory').value}

Proof URL:
${document.getElementById('agentProof').value.trim()}

Solana wallet:
${document.getElementById('agentWallet').value.trim()}

Service and pricing intent:
${document.getElementById('agentService').value.trim()}

Acknowledgement:
No custody, no guaranteed profit, no real trade execution in v0.`;

  openIssue('[Agent Listing]: ' + document.getElementById('agentName').value.trim(), 'agent-market,needs-review', body);
});

document.getElementById('rankForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const body = `URL:
${document.getElementById('rankUrl').value.trim()}

Stake intent:
${document.getElementById('stakeIntent').value.trim()}

Reason and proof of quality:
${document.getElementById('rankReason').value.trim()}

Acknowledgement:
Rank intent is not guaranteed placement and stake is not executed on-chain in v0.`;

  openIssue('[Search Rank Intent]: ' + document.getElementById('rankUrl').value.trim(), 'search-rank-intent,needs-review', body);
});

document.getElementById('governanceForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const body = `Proposal type:
${document.getElementById('proposalType').value}

Proposal:
${document.getElementById('proposalTitle').value.trim()}

Details:
${document.getElementById('proposalBody').value.trim()}

Acknowledgement:
This proposal cannot authorize wash trading, fake volume, deceptive listing claims, or guaranteed profit claims.`;

  openIssue('[Governance Proposal]: ' + document.getElementById('proposalTitle').value.trim(), 'governance-proposal,needs-review', body);
});

updateScore();
