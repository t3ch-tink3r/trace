function createAssessment(
  signals,
  evidence,
  relationships
) {
  const has = (type) =>
    signals.some((signal) => signal.type === type);

  const hasUrl = evidence.some(
    (item) => item.type === "url"
  );

  const hasEmail = evidence.some(
    (item) => item.type === "email"
  );

  let assessment =
    "No strong security pattern identified.";

  let confidence = "low";

  if (
    has("credential_request") &&
    has("urgency") &&
    has("threat_of_account_loss") &&
    hasUrl
  ) {
    assessment =
      "Potential credential-phishing attempt.";
    confidence = "high";
  } else if (
    has("credential_request") &&
    hasUrl
  ) {
    assessment =
      "Potential credential-harvesting attempt.";
    confidence = "medium";
  } else if (
    has("urgency") &&
    has("threat_of_account_loss")
  ) {
    assessment =
      "Potential social-engineering attempt.";
    confidence = "medium";
  } else if (
    has("credential_request")
  ) {
    assessment =
      "Credential-related request detected.";
    confidence = "low";
  } else if (
    hasUrl ||
    hasEmail
  ) {
    assessment =
      "Digital communication evidence detected, but no strong malicious pattern was identified.";
    confidence = "low";
  }

  return {
    assessment,
    confidence,
    signalCount: signals.length,
    evidenceCount: evidence.length,
    relationshipCount: relationships.length,
  };
}

module.exports = createAssessment;