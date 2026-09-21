function analyzeMessage(message, sourceId = "evidence-1") {
  const signals = [];
  const evidence = [];

  const text = message.toLowerCase();

  function addSignal(signal) {
    if (
      !signals.some(
        (existing) => existing.type === signal.type
      )
    ) {
      signals.push(signal);
    }
  }

  // Credential requests
  if (
    text.includes("verify your account") ||
    text.includes("verify your identity") ||
    text.includes("confirm your password") ||
    text.includes("enter your password") ||
    text.includes("enter your credentials") ||
    text.includes("login") ||
    text.includes("log in") ||
    text.includes("sign in") ||
    text.includes("password")
  ) {
    addSignal({
      type: "credential_request",
      severity: "high",
      description:
        "The message appears to request account or credential-related action.",
    });
  }

  // Urgency
  if (
    text.includes("urgent") ||
    text.includes("immediately") ||
    text.includes("act now") ||
    text.includes("within 24 hours") ||
    text.includes("expires today") ||
    text.includes("last chance") ||
    text.includes("as soon as possible") ||
    text.includes("right away")
  ) {
    addSignal({
      type: "urgency",
      severity: "medium",
      description:
        "The message uses urgency or time pressure.",
    });
  }

  // Account threats
  if (
    text.includes("suspended") ||
    text.includes("locked") ||
    text.includes("deactivated") ||
    text.includes("will be closed") ||
    text.includes("account will be disabled") ||
    text.includes("account has been disabled")
  ) {
    addSignal({
      type: "threat_of_account_loss",
      severity: "medium",
      description:
        "The message threatens account restriction or loss.",
    });
  }

  // Impersonation indicators
  if (
    text.includes("security team") ||
    text.includes("support team") ||
    text.includes("administrator") ||
    text.includes("official") ||
    text.includes("bank") ||
    text.includes("microsoft") ||
    text.includes("google") ||
    text.includes("apple")
  ) {
    addSignal({
      type: "impersonation_indicator",
      severity: "medium",
      description:
        "The message references an organization, authority, or support identity.",
    });
  }

  // Redirect / login-page indicators
  if (
    text.includes("redirected") ||
    text.includes("redirect") ||
    text.includes("login page") ||
    text.includes("sign-in page") ||
    text.includes("login screen") ||
    text.includes("authentication page")
  ) {
    addSignal({
      type: "redirect_to_login",
      severity: "high",
      description:
        "The evidence describes a redirect or page associated with credential entry.",
    });
  }

  // Credential-entry behavior
  if (
    text.includes("asked for my password") ||
    text.includes("asked me for my password") ||
    text.includes("entered my password") ||
    text.includes("password field") ||
    text.includes("credential form")
  ) {
    addSignal({
      type: "credential_entry",
      severity: "high",
      description:
        "The evidence describes credential entry or a credential collection interface.",
    });
  }

  // URL extraction
  const urls =
    message.match(/https?:\/\/[^\s]+/gi) || [];

  urls.forEach((url, index) => {
    const cleanedUrl = url.replace(
      /[),.!?]+$/,
      ""
    );

    evidence.push({
      id: `${sourceId}-url-${index + 1}`,
      type: "url",
      value: cleanedUrl,
      sourceId,
    });
  });

  // Email extraction
  const emails =
    message.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi
    ) || [];

  emails.forEach((email, index) => {
    evidence.push({
      id: `${sourceId}-email-${index + 1}`,
      type: "email",
      value: email,
      sourceId,
    });
  });

  // Domain extraction
  urls.forEach((url, index) => {
    try {
      const cleanedUrl = url.replace(
        /[),.!?]+$/,
        ""
      );

      const domain = new URL(
        cleanedUrl
      ).hostname;

      evidence.push({
        id: `${sourceId}-domain-${index + 1}`,
        type: "domain",
        value: domain,
        sourceId,
      });
    } catch {
      // Ignore malformed URLs.
    }
  });

  return {
    signals,
    evidence,
  };
}

module.exports = analyzeMessage;