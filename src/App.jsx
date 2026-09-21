import { useState } from "react";

import {
  formatSignalType,
  formatRelationshipType,
  formatEvidenceType,
} from "./utils";

import InvestigationGraph from "./components/InvestigationGraph";

import "./App.css";

function App() {
  const [evidenceItems, setEvidenceItems] =
    useState([
      {
        id: "evidence-1",
        label: "Evidence 01",
        text: "",
      },
    ]);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function updateEvidence(id, text) {
    setEvidenceItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, text }
          : item
      )
    );
  }

  function addEvidence() {
    if (evidenceItems.length >= 3) {
      return;
    }

    const number = evidenceItems.length + 1;

    setEvidenceItems((current) => [
      ...current,
      {
        id: `evidence-${number}`,
        label: `Evidence ${String(number).padStart(
          2,
          "0"
        )}`,
        text: "",
      },
    ]);
  }

  function removeEvidence(id) {
    if (evidenceItems.length === 1) {
      return;
    }

    setEvidenceItems((current) =>
      current.filter(
        (item) => item.id !== id
      )
    );
  }

  function formatNodeReference(id, evidence) {
    const evidenceItem = evidence.find(
      (item) => item.id === id
    );

    if (evidenceItem) {
      return formatEvidenceType(
        evidenceItem.type
      );
    }

    return formatSignalType(id);
  }

  function buildTrace(result) {
    const trace = [];

    const signalOrder = [
      "threat_of_account_loss",
      "urgency",
      "credential_request",
      "redirect_to_login",
      "credential_entry",
    ];

    signalOrder.forEach((type) => {
      const exists = result.signals.some(
        (signal) => signal.type === type
      );

      if (exists) {
        trace.push({
          id: type,
          label: formatSignalType(type),
          kind: "signal",
        });
      }
    });

    const url = result.evidence.find(
      (item) => item.type === "url"
    );

    if (url) {
      trace.push({
        id: url.id,
        label: "URL",
        kind: "evidence",
      });
    }

    const domain = result.evidence.find(
      (item) => item.type === "domain"
    );

    if (domain) {
      trace.push({
        id: domain.id,
        label: "Domain",
        kind: "evidence",
      });
    }

    return trace;
  }

  async function analyzeInvestigation() {
    const validItems = evidenceItems.filter(
      (item) => item.text.trim()
    );

    if (validItems.length === 0) {
      setError(
        "Add at least one piece of evidence."
      );
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://localhost:5000/api/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            evidence: validItems,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Analysis request failed."
        );
      }

      const data = await response.json();

      setResult(data);
    } catch {
      setError(
        "Could not connect to the TRACE server. Make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const trace = result
    ? buildTrace(result)
    : [];

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <div className="brand">TRACE</div>

          <div className="tagline">
            Threat Relationship & Analysis
            Correlation Engine
          </div>
        </div>

        <div className="status">
          <span className="status-dot" />
          Engine online
        </div>
      </header>

      <main className="main">
        <section className="hero">
          <p className="eyebrow">
            SECURITY INVESTIGATION
          </p>

          <h1>
            Turn digital evidence
            <br />
            into an investigation.
          </h1>

          <p className="hero-text">
            TRACE extracts security signals,
            connects their relationships, and
            explains how the evidence supports
            an investigation.
          </p>
        </section>

        <section className="workspace">
          <div className="panel input-panel">
            <div className="panel-header">
              <div>
                <span className="panel-label">
                  INPUT
                </span>

                <h2>Evidence</h2>
              </div>

              <span className="step">
                01
              </span>
            </div>

            <div className="evidence-inputs">
              {evidenceItems.map(
                (item, index) => (
                  <div
                    className="evidence-input"
                    key={item.id}
                  >
                    <div className="evidence-input-header">
                      <span>
                        {item.label}
                      </span>

                      {index > 0 && (
                        <button
                          className="remove-evidence"
                          onClick={() =>
                            removeEvidence(
                              item.id
                            )
                          }
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <textarea
                      value={item.text}
                      onChange={(event) =>
                        updateEvidence(
                          item.id,
                          event.target.value
                        )
                      }
                      placeholder={
                        index === 0
                          ? "Paste a suspicious message here..."
                          : "Add related evidence, observations, logs, or another message..."
                      }
                    />
                  </div>
                )
              )}
            </div>

            {evidenceItems.length < 3 && (
              <button
                className="add-evidence"
                onClick={addEvidence}
              >
                + Add evidence
              </button>
            )}

            <button
              className="analyze-button"
              onClick={analyzeInvestigation}
              disabled={loading}
            >
              {loading
                ? "Analyzing investigation..."
                : "Analyze investigation"}
            </button>

            {error && (
              <p className="error">{error}</p>
            )}
          </div>

          <div className="panel result-panel">
            <div className="panel-header">
              <div>
                <span className="panel-label">
                  OUTPUT
                </span>

                <h2>Investigation</h2>
              </div>

              <span className="step">
                02
              </span>
            </div>

            {!result && !loading && (
              <div className="empty-state">
                <div className="empty-icon">
                  +
                </div>

                <p>
                  Submit evidence to begin
                  <br />
                  the investigation.
                </p>
              </div>
            )}

            {loading && (
              <div className="empty-state">
                <div className="loader" />

                <p>
                  Correlating evidence and
                  consulting analyst...
                </p>
              </div>
            )}

            {result && (
              <div className="results">
                <div className="assessment">
                  <span className="result-label">
                    ASSESSMENT
                  </span>

                  <h3>
                    {
                      result.assessment
                        .assessment
                    }
                  </h3>

                  <p className="assessment-note">
                    Based on observed evidence,
                    detected signals, and their
                    relationships.
                  </p>

                  <div className="stats">
                    <div>
                      <strong>
                        {
                          result.sources.length
                        }
                      </strong>
                      <span>Sources</span>
                    </div>

                    <div>
                      <strong>
                        {
                          result.assessment
                            .evidenceCount
                        }
                      </strong>
                      <span>Artifacts</span>
                    </div>

                    <div>
                      <strong>
                        {
                          result.assessment
                            .signalCount
                        }
                      </strong>
                      <span>Signals</span>
                    </div>

                    <div>
                      <strong>
                        {
                          result.assessment
                            .relationshipCount
                        }
                      </strong>
                      <span>
                        Relationships
                      </span>
                    </div>
                  </div>
                </div>

                {trace.length > 0 && (
                  <div className="trace-panel">
                    <div className="trace-header">
                      <div>
                        <span className="result-label">
                          EVIDENCE TRACE
                        </span>

                        <h3>
                          Why this assessment?
                        </h3>
                      </div>

                      <span className="trace-badge">
                        TRACEABLE
                      </span>
                    </div>

                    <p className="trace-description">
                      The assessment is supported
                      by the observed investigation
                      chain below.
                    </p>

                    <div className="trace-chain">
                      {trace.map(
                        (item, index) => (
                          <div
                            className="trace-step"
                            key={item.id}
                          >
                            <div
                              className={`trace-node ${item.kind}`}
                            >
                              <span>
                                {item.kind ===
                                "signal"
                                  ? "SIGNAL"
                                  : "EVIDENCE"}
                              </span>

                              <strong>
                                {item.label}
                              </strong>
                            </div>

                            {index <
                              trace.length -
                                1 && (
                              <div className="trace-arrow">
                                ↓
                              </div>
                            )}
                          </div>
                        )
                      )}

                      <div className="trace-arrow">
                        ↓
                      </div>

                      <div className="trace-conclusion">
                        <span>
                          CONCLUSION
                        </span>

                        <strong>
                          {
                            result.assessment
                              .assessment
                          }
                        </strong>
                      </div>
                    </div>
                  </div>
                )}

                {result.aiAnalysis && (
                  <div className="ai-analysis">
                    <div className="ai-header">
                      <div>
                        <span className="result-label">
                          AI-ASSISTED INTERPRETATION
                        </span>

                        <h3>
                          Investigation
                          reasoning
                        </h3>
                      </div>

                      <span className="ai-badge">
                        AI
                      </span>
                    </div>

                    <p className="ai-disclaimer">
                      AI explains the evidence
                      identified by TRACE. It does
                      not replace the deterministic
                      investigation engine.
                    </p>

                    <div className="ai-content">
                      {result.aiAnalysis
                        .split(/\n\s*\n/)
                        .map((section, index) => {
                          const lines =
                            section
                              .split("\n")
                              .map(
                                (line) =>
                                  line.trim()
                              )
                              .filter(Boolean);

                          if (
                            lines.length === 0
                          ) {
                            return null;
                          }

                          const heading =
                            lines[0];

                          const body =
                            lines
                              .slice(1)
                              .join(" ");

                          return (
                            <div
                              className="ai-section"
                              key={index}
                            >
                              <div className="ai-section-heading">
                                {heading}
                              </div>

                              <p>{body}</p>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}

                {result.aiError && (
                  <div className="ai-warning">
                    {result.aiError}
                  </div>
                )}

                <div className="result-section">
                  <div className="section-title">
                    SECURITY SIGNALS
                  </div>

                  <div className="signal-list">
                    {result.signals.map(
                      (signal) => (
                        <div
                          className="signal-card"
                          key={signal.type}
                        >
                          <div>
                            <strong>
                              {formatSignalType(
                                signal.type
                              )}
                            </strong>

                            <p>
                              {
                                signal.description
                              }
                            </p>
                          </div>

                          <span
                            className={`severity ${signal.severity}`}
                          >
                            {signal.severity}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="result-section">
                  <div className="section-title">
                    EVIDENCE ARTIFACTS
                  </div>

                  <div className="evidence-list">
                    {result.evidence.map(
                      (item) => (
                        <div
                          className="evidence-item"
                          key={item.id}
                        >
                          <div className="evidence-meta">
                            <span>
                              {formatEvidenceType(
                                item.type
                              )}
                            </span>

                            <small>
                              {
                                item.sourceLabel
                              }
                            </small>
                          </div>

                          <code>
                            {item.value}
                          </code>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div className="result-section">
                  <div className="section-title">
                    RELATIONSHIPS
                  </div>

                  <div className="relationships">
                    {result.relationships.map(
                      (
                        relationship,
                        index
                      ) => (
                        <div
                          className="relationship"
                          key={index}
                        >
                          <div className="relationship-path">
                            <strong>
                              {formatNodeReference(
                                relationship.from,
                                result.evidence
                              )}
                            </strong>

                            <span>→</span>

                            <strong>
                              {formatNodeReference(
                                relationship.to,
                                result.evidence
                              )}
                            </strong>
                          </div>

                          <span className="relationship-type">
                            {
                              formatRelationshipType(
                                relationship.type
                              )
                            }
                          </span>

                          <p>
                            {
                              relationship.explanation
                            }
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <InvestigationGraph
                  signals={result.signals}
                  evidence={result.evidence}
                  relationships={
                    result.relationships
                  }
                />
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;