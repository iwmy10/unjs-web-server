const _localHosts = new Set(["127.0.0.1", "localhost", "::1"]);
export function isLocalhost(hostname: string | undefined) {
  return hostname === undefined ? false : _localHosts.has(hostname);
}
