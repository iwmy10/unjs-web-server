'use strict';

var node_net = require('node:net');
var node_os = require('node:os');
var node_http = require('node:http');
var tty = require('node:tty');

function _interopNamespaceDefault(e) {
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n.default = e;
  return Object.freeze(n);
}

var tty__namespace = /*#__PURE__*/_interopNamespaceDefault(tty);

const unsafePorts = /* @__PURE__ */ new Set([
  1,
  // tcpmux
  7,
  // echo
  9,
  // discard
  11,
  // systat
  13,
  // daytime
  15,
  // netstat
  17,
  // qotd
  19,
  // chargen
  20,
  // ftp data
  21,
  // ftp access
  22,
  // ssh
  23,
  // telnet
  25,
  // smtp
  37,
  // time
  42,
  // name
  43,
  // nicname
  53,
  // domain
  69,
  // tftp
  77,
  // priv-rjs
  79,
  // finger
  87,
  // ttylink
  95,
  // supdup
  101,
  // hostriame
  102,
  // iso-tsap
  103,
  // gppitnp
  104,
  // acr-nema
  109,
  // pop2
  110,
  // pop3
  111,
  // sunrpc
  113,
  // auth
  115,
  // sftp
  117,
  // uucp-path
  119,
  // nntp
  123,
  // NTP
  135,
  // loc-srv /epmap
  137,
  // netbios
  139,
  // netbios
  143,
  // imap2
  161,
  // snmp
  179,
  // BGP
  389,
  // ldap
  427,
  // SLP (Also used by Apple Filing Protocol)
  465,
  // smtp+ssl
  512,
  // print / exec
  513,
  // login
  514,
  // shell
  515,
  // printer
  526,
  // tempo
  530,
  // courier
  531,
  // chat
  532,
  // netnews
  540,
  // uucp
  548,
  // AFP (Apple Filing Protocol)
  554,
  // rtsp
  556,
  // remotefs
  563,
  // nntp+ssl
  587,
  // smtp (rfc6409)
  601,
  // syslog-conn (rfc3195)
  636,
  // ldap+ssl
  989,
  // ftps-data
  990,
  // ftps
  993,
  // ldap+ssl
  995,
  // pop3+ssl
  1719,
  // h323gatestat
  1720,
  // h323hostcall
  1723,
  // pptp
  2049,
  // nfs
  3659,
  // apple-sasl / PasswordServer
  4045,
  // lockd
  5060,
  // sip
  5061,
  // sips
  6e3,
  // X11
  6566,
  // sane-port
  6665,
  // Alternate IRC [Apple addition]
  6666,
  // Alternate IRC [Apple addition]
  6667,
  // Standard IRC [Apple addition]
  6668,
  // Alternate IRC [Apple addition]
  6669,
  // Alternate IRC [Apple addition]
  6697,
  // IRC + TLS
  10080
  // Amanda
]);
function isUnsafePort(port) {
  return unsafePorts.has(port);
}
function isSafePort(port) {
  return !isUnsafePort(port);
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, key + "" , value);
  return value;
};
class GetPortError extends Error {
  constructor(message, opts) {
    super(message, opts);
    this.message = message;
    __publicField(this, "name", "GetPortError");
  }
}
function _log(verbose, message) {
  if (verbose) {
    console.log(`[get-port] ${message}`);
  }
}
function _generateRange(from, to) {
  if (to < from) {
    return [];
  }
  const r = [];
  for (let index = from; index <= to; index++) {
    r.push(index);
  }
  return r;
}
function _tryPort(port, host) {
  return new Promise((resolve) => {
    const server = node_net.createServer();
    server.unref();
    server.on("error", () => {
      resolve(false);
    });
    server.listen({ port, host }, () => {
      const { port: port2 } = server.address();
      server.close(() => {
        resolve(isSafePort(port2) && port2);
      });
    });
  });
}
function _getLocalHosts(additional) {
  const hosts = new Set(additional);
  for (const _interface of Object.values(node_os.networkInterfaces())) {
    for (const config of _interface || []) {
      if (config.address && !config.internal && !config.address.startsWith("fe80::")) {
        hosts.add(config.address);
      }
    }
  }
  return [...hosts];
}
async function _findPort(ports, host) {
  for (const port of ports) {
    const r = await _tryPort(port, host);
    if (r) {
      return r;
    }
  }
}
function _fmtOnHost(hostname) {
  return hostname ? `on host ${JSON.stringify(hostname)}` : "on any host";
}
const HOSTNAME_RE = /^(?!-)[\d.:A-Za-z-]{1,63}(?<!-)$/;
function _validateHostname(hostname, _public, verbose) {
  if (hostname && !HOSTNAME_RE.test(hostname)) {
    const fallbackHost = _public ? "0.0.0.0" : "127.0.0.1";
    _log(
      verbose,
      `Invalid hostname: ${JSON.stringify(hostname)}. Using ${JSON.stringify(
        fallbackHost
      )} as fallback.`
    );
    return fallbackHost;
  }
  return hostname;
}

async function getPort(_userOptions = {}) {
  if (typeof _userOptions === "number" || typeof _userOptions === "string") {
    _userOptions = { port: Number.parseInt(_userOptions + "") || 0 };
  }
  const _port = Number(_userOptions.port ?? process.env.PORT);
  const _userSpecifiedAnyPort = Boolean(
    _userOptions.port || _userOptions.ports?.length || _userOptions.portRange?.length
  );
  const options = {
    name: "default",
    random: _port === 0,
    ports: [],
    portRange: [],
    alternativePortRange: _userSpecifiedAnyPort ? [] : [3e3, 3100],
    verbose: false,
    ..._userOptions,
    port: _port,
    host: _validateHostname(
      _userOptions.host ?? process.env.HOST,
      _userOptions.public,
      _userOptions.verbose
    )
  };
  if (options.random && !_userSpecifiedAnyPort) {
    return getRandomPort(options.host);
  }
  const portsToCheck = [
    options.port,
    ...options.ports,
    ..._generateRange(...options.portRange)
  ].filter((port) => {
    if (!port) {
      return false;
    }
    if (!isSafePort(port)) {
      _log(options.verbose, `Ignoring unsafe port: ${port}`);
      return false;
    }
    return true;
  });
  if (portsToCheck.length === 0) {
    portsToCheck.push(3e3);
  }
  let availablePort = await _findPort(portsToCheck, options.host);
  if (!availablePort && options.alternativePortRange.length > 0) {
    availablePort = await _findPort(
      _generateRange(...options.alternativePortRange),
      options.host
    );
    if (portsToCheck.length > 0) {
      let message = `Unable to find an available port (tried ${portsToCheck.join(
        "-"
      )} ${_fmtOnHost(options.host)}).`;
      if (availablePort) {
        message += ` Using alternative port ${availablePort}.`;
      }
      _log(options.verbose, message);
    }
  }
  if (!availablePort && _userOptions.random !== false) {
    availablePort = await getRandomPort(options.host);
    if (availablePort) {
      _log(options.verbose, `Using random port ${availablePort}`);
    }
  }
  if (!availablePort) {
    const triedRanges = [
      options.port,
      options.portRange.join("-"),
      options.alternativePortRange.join("-")
    ].filter(Boolean).join(", ");
    throw new GetPortError(
      `Unable to find an available port ${_fmtOnHost(
        options.host
      )} (tried ${triedRanges})`
    );
  }
  return availablePort;
}
async function getRandomPort(host) {
  const port = await checkPort(0, host);
  if (port === false) {
    throw new GetPortError(`Unable to find a random port ${_fmtOnHost(host)}`);
  }
  return port;
}
async function checkPort(port, host = process.env.HOST, verbose) {
  if (!host) {
    host = _getLocalHosts([void 0, "0.0.0.0"]);
  }
  if (!Array.isArray(host)) {
    return _tryPort(port, host);
  }
  for (const _host of host) {
    const _port = await _tryPort(port, _host);
    if (_port === false) {
      if (port < 1024 && verbose) {
        _log(
          verbose,
          `Unable to listen to the privileged port ${port} ${_fmtOnHost(
            _host
          )}`
        );
      }
      return false;
    }
    if (port === 0 && _port !== 0) {
      port = _port;
    }
  }
  return port;
}

const {
  env = {},
  argv = [],
  platform = ""
} = typeof process === "undefined" ? {} : process;
const isDisabled = "NO_COLOR" in env || argv.includes("--no-color");
const isForced = "FORCE_COLOR" in env || argv.includes("--color");
const isWindows = platform === "win32";
const isDumbTerminal = env.TERM === "dumb";
const isCompatibleTerminal = tty__namespace && tty__namespace.isatty && tty__namespace.isatty(1) && env.TERM && !isDumbTerminal;
const isCI = "CI" in env && ("GITHUB_ACTIONS" in env || "GITLAB_CI" in env || "CIRCLECI" in env);
const isColorSupported = !isDisabled && (isForced || isWindows && !isDumbTerminal || isCompatibleTerminal || isCI);
function replaceClose(index, string, close, replace, head = string.slice(0, Math.max(0, index)) + replace, tail = string.slice(Math.max(0, index + close.length)), next = tail.indexOf(close)) {
  return head + (next < 0 ? tail : replaceClose(next, tail, close, replace));
}
function clearBleed(index, string, open, close, replace) {
  return index < 0 ? open + string + close : open + replaceClose(index, string, close, replace) + close;
}
function filterEmpty(open, close, replace = open, at = open.length + 1) {
  return (string) => string || !(string === "" || string === void 0) ? clearBleed(
    ("" + string).indexOf(close, at),
    string,
    open,
    close,
    replace
  ) : "";
}
function init(open, close, replace) {
  return filterEmpty(`\x1B[${open}m`, `\x1B[${close}m`, replace);
}
const colorDefs = {
  reset: init(0, 0),
  bold: init(1, 22, "\x1B[22m\x1B[1m"),
  dim: init(2, 22, "\x1B[22m\x1B[2m"),
  italic: init(3, 23),
  underline: init(4, 24),
  inverse: init(7, 27),
  hidden: init(8, 28),
  strikethrough: init(9, 29),
  black: init(30, 39),
  red: init(31, 39),
  green: init(32, 39),
  yellow: init(33, 39),
  blue: init(34, 39),
  magenta: init(35, 39),
  cyan: init(36, 39),
  white: init(37, 39),
  gray: init(90, 39),
  bgBlack: init(40, 49),
  bgRed: init(41, 49),
  bgGreen: init(42, 49),
  bgYellow: init(43, 49),
  bgBlue: init(44, 49),
  bgMagenta: init(45, 49),
  bgCyan: init(46, 49),
  bgWhite: init(47, 49),
  blackBright: init(90, 39),
  redBright: init(91, 39),
  greenBright: init(92, 39),
  yellowBright: init(93, 39),
  blueBright: init(94, 39),
  magentaBright: init(95, 39),
  cyanBright: init(96, 39),
  whiteBright: init(97, 39),
  bgBlackBright: init(100, 49),
  bgRedBright: init(101, 49),
  bgGreenBright: init(102, 49),
  bgYellowBright: init(103, 49),
  bgBlueBright: init(104, 49),
  bgMagentaBright: init(105, 49),
  bgCyanBright: init(106, 49),
  bgWhiteBright: init(107, 49)
};
function createColors(useColor = isColorSupported) {
  return useColor ? colorDefs : Object.fromEntries(Object.keys(colorDefs).map((key) => [key, String]));
}
const colors = createColors();

async function listen({ app }) {
  const port = await getPort();
  const handler = app._handle;
  let server = node_http.createServer(handler);
  const hostname = "localhost";
  server.listen(port, hostname);
  const label = colors.green(`  \u279C ${"Local:".padEnd(8, " ")} `);
  const url = colors.cyan(colors.underline(`http://${hostname}:${port}/`));
  console.log(label + url);
}

exports.listen = listen;
