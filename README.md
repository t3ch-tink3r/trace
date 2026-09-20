# TRACE

### Threat Relationship & Analysis Correlation Engine

> Turn digital evidence into an explainable cybersecurity investigation.

TRACE is a defensive cybersecurity investigation tool that transforms fragmented digital evidence into structured, traceable security findings.

Instead of simply labeling an artifact as "malicious" or "safe", TRACE extracts observable security signals, correlates relationships between them, constructs an evidence chain, and uses AI to explain the resulting assessment.

The core principle is simple:

**Every conclusion should be traceable back to evidence.**

---

## Why TRACE?

Cybersecurity investigations rarely begin with a perfectly structured incident.

An analyst may have:

* a suspicious message
* a URL
* an email address
* a reported redirect
* a login page observation
* credential-entry behavior
* additional evidence from another source

Individually, these pieces may provide limited context.

The challenge is connecting them.

TRACE turns these fragments into an investigation:

```text
Digital Evidence
       ↓
Evidence Extraction
       ↓
Security Signals
       ↓
Relationship Correlation
       ↓
Assessment
       ↓
Evidence Trace
       ↓
AI-Assisted Interpretation
       ↓
Investigation Graph
```

---

## What TRACE Does

### 1. Evidence Extraction

TRACE processes supplied digital evidence and extracts observable artifacts such as:

* URLs
* domains
* email addresses

It also detects security-relevant signals from the supplied material.

### 2. Security Signal Detection

The deterministic investigation engine identifies signals including:

* Credential requests
* Urgency or time pressure
* Account-loss threats
* Impersonation indicators
* Redirects to login interfaces
* Credential-entry behavior

### 3. Relationship Correlation

TRACE connects signals and artifacts into relationships.

For example:

```text
Account-loss threat
        ↓
Urgency
        ↓
Credential request
        ↓
Redirect to login
        ↓
Credential entry
        ↓
URL
        ↓
Domain
```

This allows the investigation to represent not only **what was observed**, but also **how the observations are connected**.

### 4. Evidence-Based Assessment

TRACE produces a structured assessment based on the signals and relationships detected by the deterministic engine.

The system deliberately uses cautious conclusions such as:

> Potential credential-phishing attempt.

rather than treating every suspicious indicator as definitive proof.

### 5. Evidence Trace

TRACE provides a visible chain connecting the observed investigation to its conclusion.

This makes the assessment explainable and allows an analyst to inspect the evidence supporting it.

### 6. AI-Assisted Interpretation

AI is used as an interpretation layer rather than as the entire detection system.

The deterministic engine performs the initial evidence extraction, signal detection, correlation, and assessment.

The AI analyst then explains the investigation using only the information supplied by TRACE.

This separation helps keep the system more transparent and reduces unsupported conclusions.

### 7. Investigation Graph

TRACE visualizes relationships between security signals and extracted evidence using an interactive investigation graph.

---

## Example Investigation

### Evidence 01

```text
URGENT! Your account has been suspended.

Verify your account immediately within 24 hours.

Confirm your password at https://example.com/login

Contact security@example.com if you have questions.
```

### Evidence 02

```text
After clicking the link, I was redirected to a login page
and asked for my password.
```

TRACE extracts:

```text
5 Security Signals
3 Evidence Artifacts
9 Relationships
```

The resulting assessment:

```text
Potential credential-phishing attempt.
```

The investigation can then be traced through the observed chain:

```text
Account-loss threat
        ↓
Urgency
        ↓
Credential request
        ↓
Redirect to login page
        ↓
Credential entry
        ↓
URL
        ↓
Domain
        ↓
Assessment
```

The important distinction is that TRACE does not rely solely on a black-box classification.

The evidence remains visible throughout the investigation.

---

## Architecture

```text
┌───────────────────────┐
│    Digital Evidence   │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  Evidence Extraction  │
│                       │
│  URLs                 │
│  Domains              │
│  Email Addresses      │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  Security Signal      │
│  Detection            │
│                       │
│  Deterministic Rules  │
└───────────┬───────────┘
            │
            ▼
┌───────────────────────┐
│  Relationship         │
│  Correlation          │
└───────────┬───────────┘
            │
       ┌────┴─────┐
       ▼          ▼
┌────────────┐ ┌──────────────┐
│ Assessment │ │ Evidence     │
│ Engine     │ │ Trace        │
└─────┬──────┘ └──────┬───────┘
      │               │
      └───────┬───────┘
              ▼
     ┌─────────────────┐
     │ AI Analyst      │
     │ Interpretation  │
     └────────┬────────┘
              │
              ▼
     ┌─────────────────┐
     │ Investigation   │
     │ Graph           │
     └─────────────────┘
```

---

## Technology Stack

### Frontend

* React
* Vite
* React Flow / `@xyflow/react`
* CSS

### Backend

* Node.js
* Express
* CORS

### AI Layer

* OpenAI-compatible SDK
* OpenRouter
* `openrouter/free`

### Architecture

TRACE follows a hybrid approach:

```text
Deterministic Engine
        +
AI Interpretation
```

The deterministic layer handles observable evidence processing and relationship construction.

The AI layer explains the resulting investigation without replacing the core engine.

---

## Project Structure

```text
trace/
│
├── server/
│   ├── engine/
│   │   ├── aiAnalyst.js
│   │   ├── analyzeMessage.js
│   │   ├── assessment.js
│   │   └── correlateSignals.js
│   │
│   ├── server.js
│   └── package.json
│
├── src/
│   ├── components/
│   │   └── InvestigationGraph.jsx
│   │
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── main.jsx
│   └── utils.js
│
├── public/
├── package.json
├── vite.config.js
└── README.md
```

---

## Running TRACE Locally

### Requirements

* Node.js
* npm

### 1. Clone the repository

```bash
git clone https://github.com/t3ch-tink3r/trace.git
cd trace
```

### 2. Install frontend dependencies

```bash
npm install
```

### 3. Install backend dependencies

```bash
cd server
npm install
```

### 4. Configure the AI analyst

Create:

```text
server/.env
```

Add:

```env
OPENROUTER_API_KEY=your_api_key_here
```

Never commit this file.

### 5. Start the backend

From the `server` directory:

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

### 6. Start the frontend

Open another terminal in the project root:

```bash
npm run dev
```

The frontend will be available at the local Vite address shown in the terminal.

---

## API

### Health Check

```http
GET /api/health
```

Example response:

```json
{
  "status": "ok",
  "service": "TRACE Evidence Engine",
  "ai": true
}
```

### Analyze Evidence

```http
POST /api/analyze
```

Example request:

```json
{
  "evidence": [
    {
      "id": "evidence-1",
      "label": "Evidence 01",
      "text": "Suspicious message..."
    },
    {
      "id": "evidence-2",
      "label": "Evidence 02",
      "text": "Related observation..."
    }
  ]
}
```

The response contains:

* sources
* signals
* extracted evidence
* relationships
* assessment
* AI interpretation
* AI error state when applicable

---

## AI Disclosure

TRACE uses AI as an **assistive interpretation layer**.

AI does not independently determine the core assessment.

The deterministic TRACE engine:

1. extracts evidence
2. detects security signals
3. correlates relationships
4. produces the assessment

The AI analyst receives that structured investigation and generates a concise explanation based on the supplied evidence.

This architecture was intentionally designed so that the AI does not become the sole source of truth.

---

## Defensive Scope

TRACE is designed for defensive cybersecurity investigation and analysis.

It does not:

* steal credentials
* deploy malware
* perform unauthorized access
* exploit systems
* conduct attacks
* collect real user passwords

The project focuses on analyzing supplied evidence and making the resulting investigation easier to understand.

---

## Current Limitations

TRACE is currently an MVP.

Current limitations include:

* focused primarily on suspicious communication evidence
* deterministic detection rules are intentionally limited
* extracted artifacts are currently basic
* no external threat-intelligence enrichment
* no persistent investigation database
* no real email or messaging-platform integrations
* AI interpretation depends on the configured AI provider

These limitations leave room for future development.

---

## Future Direction

TRACE can evolve beyond suspicious communication analysis.

Potential future evidence sources include:

* authentication logs
* endpoint events
* screenshots
* security alerts
* network indicators
* additional communication artifacts

The long-term goal is to allow analysts to combine fragmented evidence from multiple sources into a single explainable investigation.

```text
More Evidence Sources
        ↓
More Security Signals
        ↓
Richer Relationships
        ↓
More Complete Investigations
```

---

## Core Principle

TRACE is built around one idea:

> **Don't just tell the analyst what the conclusion is. Show them why the evidence supports it.**

---

## Project Status

**MVP complete.**

Built for the **TLN Cybersecurity Challenge**.

---

## Author

Built by **t3ch-tink3r**.
