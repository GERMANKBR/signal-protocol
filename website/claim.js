const repoIssueUrl = 'https://github.com/GERMANKBR/signal-protocol/issues/new';

function buildClaimBody() {
  const questId = document.getElementById('questId').value.trim();
  const proofUrl = document.getElementById('proofUrl').value.trim();
  const wallet = document.getElementById('wallet').value.trim();
  const summary = document.getElementById('summary').value.trim();

  return `### Quest ID
${questId}

### Proof URL
${proofUrl}

### Solana Wallet
${wallet}

### Summary
${summary}

### Risk Acknowledgement
I understand SIGNAL has no guaranteed liquidity, no guaranteed market value, and no guaranteed profit.`;
}

function buildClaimUrl() {
  const questId = document.getElementById('questId').value.trim();
  const title = `[Activation Claim]: ${questId}`;
  const labels = 'activation-claim,needs-review';
  const params = new URLSearchParams({
    title,
    labels,
    body: buildClaimBody()
  });

  return `${repoIssueUrl}?${params.toString()}`;
}

document.getElementById('claimForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }

  // Web3 Execution Trap is removed as per user request to separate from OTC/Sponsor payment.
  alert("Verification successful. Opening claim ticket.");
  window.open(buildClaimUrl(), '_blank', 'noopener,noreferrer');
});

document.getElementById('copyClaim').addEventListener('click', async () => {
  const text = buildClaimBody();
  await navigator.clipboard.writeText(text);
  const button = document.getElementById('copyClaim');
  const original = button.textContent;
  button.textContent = 'Copied';
  setTimeout(() => {
    button.textContent = original;
  }, 1200);
});
