
export function redactSensitiveData(data: any): any {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(redactSensitiveData);
  }

  const sensitiveKeys = /password|token|secret|credential|passKey|consumerKey|api_key|apikey/i;

  const redacted = { ...data };

  for (const key of Object.keys(redacted)) {
    if (sensitiveKeys.test(key)) {
      redacted[key] = '***';
    } else if (typeof redacted[key] === 'object') {
      redacted[key] = redactSensitiveData(redacted[key]);
    }
  }

  return redacted;
}
