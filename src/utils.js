export function formatSignalType(type) {
  const names = {
    credential_request: "Credential request",
    urgency: "Urgency",
    threat_of_account_loss:
      "Account-loss threat",
    impersonation_indicator:
      "Impersonation indicator",
    redirect_to_login:
      "Redirect to login page",
    credential_entry:
      "Credential entry",
  };

  return names[type] || type;
}

export function formatRelationshipType(type) {
  const names = {
    reinforces: "Reinforces",
    leads_to: "Leads to",
    directs_to: "Directs to",
    associated_with: "Associated with",
    resolves_to: "Resolves to",
    supports: "Supports",
    supported_by: "Supported by",
  };

  return names[type] || type;
}

export function formatEvidenceType(type) {
  const names = {
    url: "URL",
    email: "Email",
    domain: "Domain",
  };

  return names[type] || type;
}