# $SIGNAL — Submission Guide

## How to Submit

Anyone can submit tools, bots, scanners, reports, memes, or other contributions to earn $SIGNAL tokens.

In the zero-cost activation phase, approved work is recorded as an off-chain reward intent first. Actual token transfers require SOL fees and are not guaranteed during this phase.

---

## Submission Types

### SIGNAL Activation Engine

Use [`../quests.json`](../quests.json) for the current no-cost quest list.

Examples:

- Activation Engine Parser
- Wallet Claim Checker
- Pool Watch Agent
- Zero-Cost Risk Report
- Agent Prompt Pack
- External Liquidity Proof

Activation claims can be submitted through GitHub Issues using the Activation Claim template.

### 🤖 AI Hunter Round (Round 1)

| Task | Reward Level | Format |
|---|---|---|
| Risk Report | 🟢 Low | Markdown/PDF |
| Telegram Bot | 🟡 Medium | Bot link + source |
| Token Scanner | 🟡 Medium | URL + screenshot |
| Wallet Checker | 🔴 High | Tool URL + source |
| AHD Parser | 🔴 High | Library + source |
| Distribution Bot | 🟡 Medium | Bot link + source |
| Airdrop Indexer | 🔴 High | Indexer + source |
| X Summary Bot | 🟡 Medium | Bot link + source |

### 🎨 Meme War (Round 2)
- Meme images
- Short videos (10-60 sec)
- X threads
- Translations (EN↔KR)
- Remixes of existing memes

---

## How to Submit

### Option 1: Pull Request (Preferred)

1. Fork this repository
2. Create a folder: `submissions/YOUR_NAME/`
3. Add your files:
   ```
   submissions/
   └── YOUR_NAME/
       ├── README.md          # Description of your submission
       ├── submission-type     # e.g., "scanner", "bot", "meme"
       └── [your files]        # Source code, images, links
   ```
4. Your README.md should include:
   - **Submission Type**: Which task you're completing
   - **Description**: What you built
   - **Demo/Link**: URL to working tool/content
   - **Source Code**: Link to repository (if applicable)
   - **Wallet Address**: Your Solana wallet for rewards
5. Open a Pull Request

### Option 2: Issue
1. Open a GitHub Issue with the `submission` label
2. Include all information listed above

### Option 3: Social Media
1. Post your meme/content on X
2. Tag the official $SIGNAL account
3. Include relevant hashtags

---

## Submission README Template

```markdown
# [Your Submission Title]

## Type
[e.g., Token Scanner / Risk Report / Meme / Telegram Bot]

## Description
[What did you build? How does it work?]

## Demo
[Link to live tool, bot, or content]

## Source Code
[Link to repository if applicable]

## Screenshots
[Add screenshots or links]

## Wallet
[Your Solana wallet address for reward distribution]

## Notes
[Any additional context]
```

---

## Review Process

1. **Submission received** → Acknowledgment within 48 hours
2. **Review** → Core team evaluates within 7 days
3. **Verification** → Functionality and originality confirmed
4. **Reward** → $SIGNAL tokens sent to provided wallet

### Evaluation Criteria
- **Functionality**: Does it work as described?
- **Quality**: Is it well-built?
- **Originality**: Is it original work?
- **Usefulness**: Does it benefit the ecosystem?
- **Documentation**: Is it well-documented?

### Rejection Reasons
- Plagiarized or copied work
- Non-functional submissions
- Spam or low-effort content
- Violation of brand rules
- Bot farm or sybil submissions

---

## Examples

Check the [`examples/`](../examples/) directory for reference:
- [`telegram-bot-response.json`](../examples/telegram-bot-response.json)
- [`scanner-output.json`](../examples/scanner-output.json)
- [`risk-report-template.md`](../examples/risk-report-template.md)

---

## Questions?

Open a GitHub Issue with the `question` label.

---

**$SIGNAL — AI가 발견하는 밈코인**


