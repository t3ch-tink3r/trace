require("dotenv").config();

const express = require("express");
const cors = require("cors");

const analyzeMessage = require("./engine/analyzeMessage");
const correlateSignals = require("./engine/correlateSignals");
const createAssessment = require("./engine/assessment");
const generateAIAnalysis = require("./engine/aiAnalyst");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "TRACE Evidence Engine",
    ai: Boolean(
      process.env.OPENROUTER_API_KEY
    ),
  });
});

app.post("/api/analyze", async (req, res) => {
  const { evidence } = req.body;

  if (
    !Array.isArray(evidence) ||
    evidence.length === 0
  ) {
    return res.status(400).json({
      error:
        "At least one evidence item is required.",
    });
  }

  const validEvidence = evidence.filter(
    (item) =>
      item &&
      typeof item.text === "string" &&
      item.text.trim()
  );

  if (validEvidence.length === 0) {
    return res.status(400).json({
      error: "Evidence must contain text.",
    });
  }

  try {
    const allSignals = [];
    const allEvidence = [];

    validEvidence.forEach(
      (item, index) => {
        const sourceId =
          item.id ||
          `evidence-${index + 1}`;

        const result = analyzeMessage(
          item.text,
          sourceId
        );

        result.signals.forEach(
          (signal) => {
            if (
              !allSignals.some(
                (existing) =>
                  existing.type ===
                  signal.type
              )
            ) {
              allSignals.push(signal);
            }
          }
        );

        allEvidence.push(
          ...result.evidence.map(
            (evidenceItem) => ({
              ...evidenceItem,
              sourceLabel:
                item.label ||
                `Evidence ${index + 1}`,
            })
          )
        );
      }
    );

    const relationships =
      correlateSignals(
        allSignals,
        allEvidence
      );

    const assessment =
      createAssessment(
        allSignals,
        allEvidence,
        relationships
      );

    let aiAnalysis = null;
    let aiError = null;

    if (process.env.OPENROUTER_API_KEY) {
      try {
        aiAnalysis =
          await generateAIAnalysis({
            assessment,
            signals: allSignals,
            evidence: allEvidence,
            relationships,
            sourceCount:
              validEvidence.length,
          });
      } catch (error) {
        console.error(
          "AI analyst error:",
          error.message
        );

        aiError =
          "AI analyst temporarily unavailable.";
      }
    } else {
      aiError =
        "AI analyst is not configured.";
    }

    res.json({
      sources: validEvidence.map(
        (item, index) => ({
          id:
            item.id ||
            `evidence-${index + 1}`,

          label:
            item.label ||
            `Evidence ${index + 1}`,
        })
      ),

      signals: allSignals,

      evidence: allEvidence,

      relationships,

      assessment,

      aiAnalysis,

      aiError,
    });
  } catch (error) {
    console.error(
      "TRACE analysis error:",
      error
    );

    res.status(500).json({
      error:
        "TRACE could not complete the investigation.",
    });
  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `TRACE server running on http://localhost:${PORT}`
  );
});