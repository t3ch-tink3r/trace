function correlateSignals(signals, evidence) {
  const relationships = [];

  const hasSignal = (type) =>
    signals.some(
      (signal) => signal.type === type
    );

  const signal = (type) =>
    signals.find(
      (item) => item.type === type
    );

  const evidenceOfType = (type) =>
    evidence.filter(
      (item) => item.type === type
    );

  function addRelationship(
    from,
    to,
    type,
    explanation
  ) {
    relationships.push({
      from,
      to,
      type,
      explanation,
    });
  }

  // Account threat → urgency
  if (
    hasSignal("threat_of_account_loss") &&
    hasSignal("urgency")
  ) {
    addRelationship(
      signal("threat_of_account_loss").type,
      signal("urgency").type,
      "reinforces",
      "The account threat is combined with time pressure to encourage immediate action."
    );
  }

  // Urgency → credential request
  if (
    hasSignal("urgency") &&
    hasSignal("credential_request")
  ) {
    addRelationship(
      signal("urgency").type,
      signal("credential_request").type,
      "leads_to",
      "The time pressure encourages the recipient to provide or confirm credentials."
    );
  }

  // Credential request → URLs
  if (
    hasSignal("credential_request")
  ) {
    evidenceOfType("url").forEach((item) => {
      addRelationship(
        "credential_request",
        item.id,
        "directs_to",
        "The credential request is associated with a URL where the requested action may occur."
      );
    });
  }

  // URL → domain
  evidenceOfType("url").forEach(
    (urlItem) => {
      const matchingDomain =
        evidence.find(
          (item) =>
            item.type === "domain" &&
            item.sourceId ===
              urlItem.sourceId
        );

      if (matchingDomain) {
        addRelationship(
          urlItem.id,
          matchingDomain.id,
          "resolves_to",
          "The extracted URL points to the identified domain."
        );
      }
    }
  );

  // Credential request → email
  if (
    hasSignal("credential_request")
  ) {
    evidenceOfType("email").forEach(
      (item) => {
        addRelationship(
          "credential_request",
          item.id,
          "associated_with",
          "The credential-related request is associated with an email address contained in the evidence."
        );
      }
    );
  }

  // Redirect → credential request
  if (
    hasSignal("redirect_to_login") &&
    hasSignal("credential_request")
  ) {
    addRelationship(
      "redirect_to_login",
      "credential_request",
      "supports",
      "The observed redirect to a login interface provides additional context for the credential-related request."
    );
  }

  // Redirect → URL
  if (
    hasSignal("redirect_to_login")
  ) {
    evidenceOfType("url").forEach(
      (item) => {
        addRelationship(
          "redirect_to_login",
          item.id,
          "associated_with",
          "The redirect evidence is associated with an extracted URL."
        );
      }
    );
  }

  // Credential entry → credential request
  if (
    hasSignal("credential_entry") &&
    hasSignal("credential_request")
  ) {
    addRelationship(
      "credential_request",
      "credential_entry",
      "supported_by",
      "The observed credential-entry behavior provides additional evidence supporting the credential request signal."
    );
  }

  // Redirect → credential entry
  if (
    hasSignal("redirect_to_login") &&
    hasSignal("credential_entry")
  ) {
    addRelationship(
      "redirect_to_login",
      "credential_entry",
      "leads_to",
      "The redirect is followed by evidence of credential entry."
    );
  }

  return relationships;
}

module.exports = correlateSignals;