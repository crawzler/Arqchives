"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ms/index.js
var require_ms = __commonJS({
  "node_modules/ms/index.js"(exports2, module2) {
    var s = 1e3;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var w = d * 7;
    var y = d * 365.25;
    module2.exports = function(val, options) {
      options = options || {};
      var type = typeof val;
      if (type === "string" && val.length > 0) {
        return parse3(val);
      } else if (type === "number" && isFinite(val)) {
        return options.long ? fmtLong(val) : fmtShort(val);
      }
      throw new Error(
        "val is not a non-empty string or a valid number. val=" + JSON.stringify(val)
      );
    };
    function parse3(str) {
      str = String(str);
      if (str.length > 100) {
        return;
      }
      var match = /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
        str
      );
      if (!match) {
        return;
      }
      var n = parseFloat(match[1]);
      var type = (match[2] || "ms").toLowerCase();
      switch (type) {
        case "years":
        case "year":
        case "yrs":
        case "yr":
        case "y":
          return n * y;
        case "weeks":
        case "week":
        case "w":
          return n * w;
        case "days":
        case "day":
        case "d":
          return n * d;
        case "hours":
        case "hour":
        case "hrs":
        case "hr":
        case "h":
          return n * h;
        case "minutes":
        case "minute":
        case "mins":
        case "min":
        case "m":
          return n * m;
        case "seconds":
        case "second":
        case "secs":
        case "sec":
        case "s":
          return n * s;
        case "milliseconds":
        case "millisecond":
        case "msecs":
        case "msec":
        case "ms":
          return n;
        default:
          return void 0;
      }
    }
    function fmtShort(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return Math.round(ms / d) + "d";
      }
      if (msAbs >= h) {
        return Math.round(ms / h) + "h";
      }
      if (msAbs >= m) {
        return Math.round(ms / m) + "m";
      }
      if (msAbs >= s) {
        return Math.round(ms / s) + "s";
      }
      return ms + "ms";
    }
    function fmtLong(ms) {
      var msAbs = Math.abs(ms);
      if (msAbs >= d) {
        return plural(ms, msAbs, d, "day");
      }
      if (msAbs >= h) {
        return plural(ms, msAbs, h, "hour");
      }
      if (msAbs >= m) {
        return plural(ms, msAbs, m, "minute");
      }
      if (msAbs >= s) {
        return plural(ms, msAbs, s, "second");
      }
      return ms + " ms";
    }
    function plural(ms, msAbs, n, name) {
      var isPlural = msAbs >= n * 1.5;
      return Math.round(ms / n) + " " + name + (isPlural ? "s" : "");
    }
  }
});

// node_modules/debug/src/common.js
var require_common = __commonJS({
  "node_modules/debug/src/common.js"(exports2, module2) {
    function setup(env) {
      createDebug.debug = createDebug;
      createDebug.default = createDebug;
      createDebug.coerce = coerce;
      createDebug.disable = disable;
      createDebug.enable = enable;
      createDebug.enabled = enabled;
      createDebug.humanize = require_ms();
      createDebug.destroy = destroy;
      Object.keys(env).forEach((key) => {
        createDebug[key] = env[key];
      });
      createDebug.names = [];
      createDebug.skips = [];
      createDebug.formatters = {};
      function selectColor(namespace) {
        let hash = 0;
        for (let i = 0; i < namespace.length; i++) {
          hash = (hash << 5) - hash + namespace.charCodeAt(i);
          hash |= 0;
        }
        return createDebug.colors[Math.abs(hash) % createDebug.colors.length];
      }
      createDebug.selectColor = selectColor;
      function createDebug(namespace) {
        let prevTime;
        let enableOverride = null;
        let namespacesCache;
        let enabledCache;
        function debug32(...args) {
          if (!debug32.enabled) {
            return;
          }
          const self = debug32;
          const curr = Number(/* @__PURE__ */ new Date());
          const ms = curr - (prevTime || curr);
          self.diff = ms;
          self.prev = prevTime;
          self.curr = curr;
          prevTime = curr;
          args[0] = createDebug.coerce(args[0]);
          if (typeof args[0] !== "string") {
            args.unshift("%O");
          }
          let index = 0;
          args[0] = args[0].replace(/%([a-zA-Z%])/g, (match, format) => {
            if (match === "%%") {
              return "%";
            }
            index++;
            const formatter = createDebug.formatters[format];
            if (typeof formatter === "function") {
              const val = args[index];
              match = formatter.call(self, val);
              args.splice(index, 1);
              index--;
            }
            return match;
          });
          createDebug.formatArgs.call(self, args);
          const logFn = self.log || createDebug.log;
          logFn.apply(self, args);
        }
        debug32.namespace = namespace;
        debug32.useColors = createDebug.useColors();
        debug32.color = createDebug.selectColor(namespace);
        debug32.extend = extend;
        debug32.destroy = createDebug.destroy;
        Object.defineProperty(debug32, "enabled", {
          enumerable: true,
          configurable: false,
          get: () => {
            if (enableOverride !== null) {
              return enableOverride;
            }
            if (namespacesCache !== createDebug.namespaces) {
              namespacesCache = createDebug.namespaces;
              enabledCache = createDebug.enabled(namespace);
            }
            return enabledCache;
          },
          set: (v) => {
            enableOverride = v;
          }
        });
        if (typeof createDebug.init === "function") {
          createDebug.init(debug32);
        }
        return debug32;
      }
      function extend(namespace, delimiter) {
        const newDebug = createDebug(this.namespace + (typeof delimiter === "undefined" ? ":" : delimiter) + namespace);
        newDebug.log = this.log;
        return newDebug;
      }
      function enable(namespaces) {
        createDebug.save(namespaces);
        createDebug.namespaces = namespaces;
        createDebug.names = [];
        createDebug.skips = [];
        const split = (typeof namespaces === "string" ? namespaces : "").trim().replace(/\s+/g, ",").split(",").filter(Boolean);
        for (const ns of split) {
          if (ns[0] === "-") {
            createDebug.skips.push(ns.slice(1));
          } else {
            createDebug.names.push(ns);
          }
        }
      }
      function matchesTemplate(search, template) {
        let searchIndex = 0;
        let templateIndex = 0;
        let starIndex = -1;
        let matchIndex = 0;
        while (searchIndex < search.length) {
          if (templateIndex < template.length && (template[templateIndex] === search[searchIndex] || template[templateIndex] === "*")) {
            if (template[templateIndex] === "*") {
              starIndex = templateIndex;
              matchIndex = searchIndex;
              templateIndex++;
            } else {
              searchIndex++;
              templateIndex++;
            }
          } else if (starIndex !== -1) {
            templateIndex = starIndex + 1;
            matchIndex++;
            searchIndex = matchIndex;
          } else {
            return false;
          }
        }
        while (templateIndex < template.length && template[templateIndex] === "*") {
          templateIndex++;
        }
        return templateIndex === template.length;
      }
      function disable() {
        const namespaces = [
          ...createDebug.names,
          ...createDebug.skips.map((namespace) => "-" + namespace)
        ].join(",");
        createDebug.enable("");
        return namespaces;
      }
      function enabled(name) {
        for (const skip of createDebug.skips) {
          if (matchesTemplate(name, skip)) {
            return false;
          }
        }
        for (const ns of createDebug.names) {
          if (matchesTemplate(name, ns)) {
            return true;
          }
        }
        return false;
      }
      function coerce(val) {
        if (val instanceof Error) {
          return val.stack || val.message;
        }
        return val;
      }
      function destroy() {
        console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
      }
      createDebug.enable(createDebug.load());
      return createDebug;
    }
    module2.exports = setup;
  }
});

// node_modules/debug/src/browser.js
var require_browser = __commonJS({
  "node_modules/debug/src/browser.js"(exports2, module2) {
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.storage = localstorage();
    exports2.destroy = /* @__PURE__ */ (() => {
      let warned = false;
      return () => {
        if (!warned) {
          warned = true;
          console.warn("Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
        }
      };
    })();
    exports2.colors = [
      "#0000CC",
      "#0000FF",
      "#0033CC",
      "#0033FF",
      "#0066CC",
      "#0066FF",
      "#0099CC",
      "#0099FF",
      "#00CC00",
      "#00CC33",
      "#00CC66",
      "#00CC99",
      "#00CCCC",
      "#00CCFF",
      "#3300CC",
      "#3300FF",
      "#3333CC",
      "#3333FF",
      "#3366CC",
      "#3366FF",
      "#3399CC",
      "#3399FF",
      "#33CC00",
      "#33CC33",
      "#33CC66",
      "#33CC99",
      "#33CCCC",
      "#33CCFF",
      "#6600CC",
      "#6600FF",
      "#6633CC",
      "#6633FF",
      "#66CC00",
      "#66CC33",
      "#9900CC",
      "#9900FF",
      "#9933CC",
      "#9933FF",
      "#99CC00",
      "#99CC33",
      "#CC0000",
      "#CC0033",
      "#CC0066",
      "#CC0099",
      "#CC00CC",
      "#CC00FF",
      "#CC3300",
      "#CC3333",
      "#CC3366",
      "#CC3399",
      "#CC33CC",
      "#CC33FF",
      "#CC6600",
      "#CC6633",
      "#CC9900",
      "#CC9933",
      "#CCCC00",
      "#CCCC33",
      "#FF0000",
      "#FF0033",
      "#FF0066",
      "#FF0099",
      "#FF00CC",
      "#FF00FF",
      "#FF3300",
      "#FF3333",
      "#FF3366",
      "#FF3399",
      "#FF33CC",
      "#FF33FF",
      "#FF6600",
      "#FF6633",
      "#FF9900",
      "#FF9933",
      "#FFCC00",
      "#FFCC33"
    ];
    function useColors() {
      if (typeof window !== "undefined" && window.process && (window.process.type === "renderer" || window.process.__nwjs)) {
        return true;
      }
      if (typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)) {
        return false;
      }
      let m;
      return typeof document !== "undefined" && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || // Is firebug? http://stackoverflow.com/a/398120/376773
      typeof window !== "undefined" && window.console && (window.console.firebug || window.console.exception && window.console.table) || // Is firefox >= v31?
      // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
      typeof navigator !== "undefined" && navigator.userAgent && (m = navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/)) && parseInt(m[1], 10) >= 31 || // Double check webkit in userAgent just in case we are in a worker
      typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/);
    }
    function formatArgs(args) {
      args[0] = (this.useColors ? "%c" : "") + this.namespace + (this.useColors ? " %c" : " ") + args[0] + (this.useColors ? "%c " : " ") + "+" + module2.exports.humanize(this.diff);
      if (!this.useColors) {
        return;
      }
      const c = "color: " + this.color;
      args.splice(1, 0, c, "color: inherit");
      let index = 0;
      let lastC = 0;
      args[0].replace(/%[a-zA-Z%]/g, (match) => {
        if (match === "%%") {
          return;
        }
        index++;
        if (match === "%c") {
          lastC = index;
        }
      });
      args.splice(lastC, 0, c);
    }
    exports2.log = console.debug || console.log || (() => {
    });
    function save(namespaces) {
      try {
        if (namespaces) {
          exports2.storage.setItem("debug", namespaces);
        } else {
          exports2.storage.removeItem("debug");
        }
      } catch (error) {
      }
    }
    function load() {
      let r;
      try {
        r = exports2.storage.getItem("debug") || exports2.storage.getItem("DEBUG");
      } catch (error) {
      }
      if (!r && typeof process !== "undefined" && "env" in process) {
        r = process.env.DEBUG;
      }
      return r;
    }
    function localstorage() {
      try {
        return localStorage;
      } catch (error) {
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.j = function(v) {
      try {
        return JSON.stringify(v);
      } catch (error) {
        return "[UnexpectedJSONParseError]: " + error.message;
      }
    };
  }
});

// node_modules/has-flag/index.js
var require_has_flag = __commonJS({
  "node_modules/has-flag/index.js"(exports2, module2) {
    "use strict";
    module2.exports = (flag, argv = process.argv) => {
      const prefix = flag.startsWith("-") ? "" : flag.length === 1 ? "-" : "--";
      const position = argv.indexOf(prefix + flag);
      const terminatorPosition = argv.indexOf("--");
      return position !== -1 && (terminatorPosition === -1 || position < terminatorPosition);
    };
  }
});

// node_modules/supports-color/index.js
var require_supports_color = __commonJS({
  "node_modules/supports-color/index.js"(exports2, module2) {
    "use strict";
    var os = require("os");
    var tty = require("tty");
    var hasFlag = require_has_flag();
    var { env } = process;
    var flagForceColor;
    if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false") || hasFlag("color=never")) {
      flagForceColor = 0;
    } else if (hasFlag("color") || hasFlag("colors") || hasFlag("color=true") || hasFlag("color=always")) {
      flagForceColor = 1;
    }
    function envForceColor() {
      if ("FORCE_COLOR" in env) {
        if (env.FORCE_COLOR === "true") {
          return 1;
        }
        if (env.FORCE_COLOR === "false") {
          return 0;
        }
        return env.FORCE_COLOR.length === 0 ? 1 : Math.min(Number.parseInt(env.FORCE_COLOR, 10), 3);
      }
    }
    function translateLevel(level) {
      if (level === 0) {
        return false;
      }
      return {
        level,
        hasBasic: true,
        has256: level >= 2,
        has16m: level >= 3
      };
    }
    function supportsColor(haveStream, { streamIsTTY, sniffFlags = true } = {}) {
      const noFlagForceColor = envForceColor();
      if (noFlagForceColor !== void 0) {
        flagForceColor = noFlagForceColor;
      }
      const forceColor = sniffFlags ? flagForceColor : noFlagForceColor;
      if (forceColor === 0) {
        return 0;
      }
      if (sniffFlags) {
        if (hasFlag("color=16m") || hasFlag("color=full") || hasFlag("color=truecolor")) {
          return 3;
        }
        if (hasFlag("color=256")) {
          return 2;
        }
      }
      if (haveStream && !streamIsTTY && forceColor === void 0) {
        return 0;
      }
      const min = forceColor || 0;
      if (env.TERM === "dumb") {
        return min;
      }
      if (process.platform === "win32") {
        const osRelease = os.release().split(".");
        if (Number(osRelease[0]) >= 10 && Number(osRelease[2]) >= 10586) {
          return Number(osRelease[2]) >= 14931 ? 3 : 2;
        }
        return 1;
      }
      if ("CI" in env) {
        if (["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE", "DRONE"].some((sign) => sign in env) || env.CI_NAME === "codeship") {
          return 1;
        }
        return min;
      }
      if ("TEAMCITY_VERSION" in env) {
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? 1 : 0;
      }
      if (env.COLORTERM === "truecolor") {
        return 3;
      }
      if ("TERM_PROGRAM" in env) {
        const version = Number.parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (env.TERM_PROGRAM) {
          case "iTerm.app":
            return version >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      if (/-256(color)?$/i.test(env.TERM)) {
        return 2;
      }
      if (/^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
        return 1;
      }
      if ("COLORTERM" in env) {
        return 1;
      }
      return min;
    }
    function getSupportLevel(stream, options = {}) {
      const level = supportsColor(stream, {
        streamIsTTY: stream && stream.isTTY,
        ...options
      });
      return translateLevel(level);
    }
    module2.exports = {
      supportsColor: getSupportLevel,
      stdout: getSupportLevel({ isTTY: tty.isatty(1) }),
      stderr: getSupportLevel({ isTTY: tty.isatty(2) })
    };
  }
});

// node_modules/debug/src/node.js
var require_node = __commonJS({
  "node_modules/debug/src/node.js"(exports2, module2) {
    var tty = require("tty");
    var util = require("util");
    exports2.init = init;
    exports2.log = log;
    exports2.formatArgs = formatArgs;
    exports2.save = save;
    exports2.load = load;
    exports2.useColors = useColors;
    exports2.destroy = util.deprecate(
      () => {
      },
      "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
    );
    exports2.colors = [6, 2, 3, 4, 5, 1];
    try {
      const supportsColor = require_supports_color();
      if (supportsColor && (supportsColor.stderr || supportsColor).level >= 2) {
        exports2.colors = [
          20,
          21,
          26,
          27,
          32,
          33,
          38,
          39,
          40,
          41,
          42,
          43,
          44,
          45,
          56,
          57,
          62,
          63,
          68,
          69,
          74,
          75,
          76,
          77,
          78,
          79,
          80,
          81,
          92,
          93,
          98,
          99,
          112,
          113,
          128,
          129,
          134,
          135,
          148,
          149,
          160,
          161,
          162,
          163,
          164,
          165,
          166,
          167,
          168,
          169,
          170,
          171,
          172,
          173,
          178,
          179,
          184,
          185,
          196,
          197,
          198,
          199,
          200,
          201,
          202,
          203,
          204,
          205,
          206,
          207,
          208,
          209,
          214,
          215,
          220,
          221
        ];
      }
    } catch (error) {
    }
    exports2.inspectOpts = Object.keys(process.env).filter((key) => {
      return /^debug_/i.test(key);
    }).reduce((obj, key) => {
      const prop = key.substring(6).toLowerCase().replace(/_([a-z])/g, (_, k) => {
        return k.toUpperCase();
      });
      let val = process.env[key];
      if (/^(yes|on|true|enabled)$/i.test(val)) {
        val = true;
      } else if (/^(no|off|false|disabled)$/i.test(val)) {
        val = false;
      } else if (val === "null") {
        val = null;
      } else {
        val = Number(val);
      }
      obj[prop] = val;
      return obj;
    }, {});
    function useColors() {
      return "colors" in exports2.inspectOpts ? Boolean(exports2.inspectOpts.colors) : tty.isatty(process.stderr.fd);
    }
    function formatArgs(args) {
      const { namespace: name, useColors: useColors2 } = this;
      if (useColors2) {
        const c = this.color;
        const colorCode = "\x1B[3" + (c < 8 ? c : "8;5;" + c);
        const prefix = `  ${colorCode};1m${name} \x1B[0m`;
        args[0] = prefix + args[0].split("\n").join("\n" + prefix);
        args.push(colorCode + "m+" + module2.exports.humanize(this.diff) + "\x1B[0m");
      } else {
        args[0] = getDate() + name + " " + args[0];
      }
    }
    function getDate() {
      if (exports2.inspectOpts.hideDate) {
        return "";
      }
      return (/* @__PURE__ */ new Date()).toISOString() + " ";
    }
    function log(...args) {
      return process.stderr.write(util.formatWithOptions(exports2.inspectOpts, ...args) + "\n");
    }
    function save(namespaces) {
      if (namespaces) {
        process.env.DEBUG = namespaces;
      } else {
        delete process.env.DEBUG;
      }
    }
    function load() {
      return process.env.DEBUG;
    }
    function init(debug32) {
      debug32.inspectOpts = {};
      const keys = Object.keys(exports2.inspectOpts);
      for (let i = 0; i < keys.length; i++) {
        debug32.inspectOpts[keys[i]] = exports2.inspectOpts[keys[i]];
      }
    }
    module2.exports = require_common()(exports2);
    var { formatters } = module2.exports;
    formatters.o = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts).split("\n").map((str) => str.trim()).join(" ");
    };
    formatters.O = function(v) {
      this.inspectOpts.colors = this.useColors;
      return util.inspect(v, this.inspectOpts);
    };
  }
});

// node_modules/debug/src/index.js
var require_src = __commonJS({
  "node_modules/debug/src/index.js"(exports2, module2) {
    if (typeof process === "undefined" || process.type === "renderer" || process.browser === true || process.__nwjs) {
      module2.exports = require_browser();
    } else {
      module2.exports = require_node();
    }
  }
});

// node_modules/strtok3/lib/stream/Errors.js
var defaultMessages, EndOfStreamError, AbortError;
var init_Errors = __esm({
  "node_modules/strtok3/lib/stream/Errors.js"() {
    defaultMessages = "End-Of-Stream";
    EndOfStreamError = class extends Error {
      constructor() {
        super(defaultMessages);
        this.name = "EndOfStreamError";
      }
    };
    AbortError = class extends Error {
      constructor(message = "The operation was aborted") {
        super(message);
        this.name = "AbortError";
      }
    };
  }
});

// node_modules/strtok3/lib/AbortSignal.js
function throwIfAborted(signal) {
  if (signal?.aborted) {
    throw new AbortError();
  }
}
var init_AbortSignal = __esm({
  "node_modules/strtok3/lib/AbortSignal.js"() {
    init_Errors();
  }
});

// node_modules/strtok3/lib/BufferSizeError.js
function getMaxBufferSize(options) {
  const limit = options?.maxBufferSize ?? Number.POSITIVE_INFINITY;
  if (limit !== Number.POSITIVE_INFINITY && (!Number.isSafeInteger(limit) || limit <= 0)) {
    throw new RangeError("maxBufferSize must be a positive safe integer or Infinity");
  }
  return limit;
}
var BufferSizeError;
var init_BufferSizeError = __esm({
  "node_modules/strtok3/lib/BufferSizeError.js"() {
    BufferSizeError = class extends RangeError {
      /**
       * Create an error describing an allocation that exceeds the configured limit.
       * @param requestedSize - Requested buffer size in bytes
       * @param maxBufferSize - Configured maximum buffer size in bytes
       */
      constructor(requestedSize, maxBufferSize) {
        super(`Requested buffer size ${requestedSize} exceeds maxBufferSize ${maxBufferSize}`);
        this.requestedSize = requestedSize;
        this.maxBufferSize = maxBufferSize;
        this.name = "BufferSizeError";
      }
    };
  }
});

// node_modules/strtok3/lib/stream/AbstractStreamReader.js
var AbstractStreamReader;
var init_AbstractStreamReader = __esm({
  "node_modules/strtok3/lib/stream/AbstractStreamReader.js"() {
    init_Errors();
    AbstractStreamReader = class {
      constructor() {
        this.endOfStream = false;
        this.interrupted = false;
        this.peekQueue = [];
      }
      async peek(uint8Array, mayBeLess = false) {
        const bytesRead = await this.read(uint8Array, mayBeLess);
        this.peekQueue.push(uint8Array.subarray(0, bytesRead));
        return bytesRead;
      }
      async read(buffer, mayBeLess = false) {
        if (buffer.length === 0) {
          return 0;
        }
        let bytesRead = this.readFromPeekBuffer(buffer);
        if (!this.endOfStream) {
          bytesRead += await this.readRemainderFromStream(buffer.subarray(bytesRead), mayBeLess);
        }
        if (bytesRead === 0 && !mayBeLess) {
          throw new EndOfStreamError();
        }
        return bytesRead;
      }
      /**
       * Read chunk from stream
       * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
       * @returns Number of bytes read
       */
      readFromPeekBuffer(buffer) {
        let remaining = buffer.length;
        let bytesRead = 0;
        while (this.peekQueue.length > 0 && remaining > 0) {
          const peekData = this.peekQueue.pop();
          if (!peekData) {
            throw new Error("peekData should be defined");
          }
          const lenCopy = Math.min(peekData.length, remaining);
          buffer.set(peekData.subarray(0, lenCopy), bytesRead);
          bytesRead += lenCopy;
          remaining -= lenCopy;
          if (lenCopy < peekData.length) {
            this.peekQueue.push(peekData.subarray(lenCopy));
          }
        }
        return bytesRead;
      }
      async readRemainderFromStream(buffer, mayBeLess) {
        let bytesRead = 0;
        while (bytesRead < buffer.length && !this.endOfStream) {
          if (this.interrupted) {
            throw new AbortError();
          }
          const chunkLen = await this.readFromStream(buffer.subarray(bytesRead), mayBeLess);
          if (chunkLen === 0) {
            break;
          }
          bytesRead += chunkLen;
        }
        if (!mayBeLess && bytesRead < buffer.length) {
          throw new EndOfStreamError();
        }
        return bytesRead;
      }
    };
  }
});

// node_modules/strtok3/lib/stream/Deferred.js
var Deferred;
var init_Deferred = __esm({
  "node_modules/strtok3/lib/stream/Deferred.js"() {
    Deferred = class {
      constructor() {
        this.resolve = () => null;
        this.reject = () => null;
        this.promise = new Promise((resolve, reject) => {
          this.reject = reject;
          this.resolve = resolve;
        });
      }
    };
  }
});

// node_modules/strtok3/lib/stream/StreamReader.js
function handlePostEndError() {
  this.removeListener("close", removePostEndErrorHandler);
}
function removePostEndErrorHandler() {
  this.removeListener("error", handlePostEndError);
}
var StreamReader;
var init_StreamReader = __esm({
  "node_modules/strtok3/lib/stream/StreamReader.js"() {
    init_AbstractStreamReader();
    init_Deferred();
    init_Errors();
    StreamReader = class extends AbstractStreamReader {
      constructor(s) {
        super();
        this.s = s;
        this.pendingRequests = /* @__PURE__ */ new Set();
        this.onEnd = () => {
          this.endOfStream = true;
          this.removeLifecycleListeners();
          this.s.once("error", handlePostEndError);
          this.s.once("close", removePostEndErrorHandler);
          for (const request of this.pendingRequests) {
            this.removeRequest(request);
            request.deferred.resolve(0);
          }
        };
        this.onError = (err) => this.reject(err);
        this.onClose = () => {
          this.removeLifecycleListeners();
          if (!this.endOfStream) {
            void this.abort();
          }
        };
        if (!s.read || !s.once) {
          throw new Error("Expected an instance of stream.Readable");
        }
        this.s.once("end", this.onEnd);
        this.s.once("error", this.onError);
        this.s.once("close", this.onClose);
      }
      /**
       * Read chunk from stream
       * @param buffer Target Uint8Array (or Buffer) to store data read from stream in
       * @param mayBeLess - If true, may fill the buffer partially
       * @returns Number of bytes read
       */
      async readFromStream(buffer, mayBeLess) {
        if (buffer.length === 0) {
          return 0;
        }
        const readBuffer2 = this.s.read(buffer.length);
        if (readBuffer2) {
          buffer.set(readBuffer2);
          return readBuffer2.length;
        }
        const request = {
          buffer,
          mayBeLess,
          deferred: new Deferred(),
          onReadable: () => this.readDeferred(request)
        };
        this.pendingRequests.add(request);
        this.s.once("readable", request.onReadable);
        return request.deferred.promise;
      }
      /**
       * Process deferred read request
       * @param request Deferred read request
       */
      readDeferred(request) {
        if (this.interrupted || !this.pendingRequests.has(request)) {
          return;
        }
        try {
          const readBuffer2 = this.s.read(request.buffer.length);
          if (!this.pendingRequests.has(request)) {
            return;
          }
          if (readBuffer2) {
            request.buffer.set(readBuffer2);
            this.removeRequest(request);
            request.deferred.resolve(readBuffer2.length);
          } else {
            this.s.once("readable", request.onReadable);
          }
        } catch (error) {
          this.reject(error instanceof Error ? error : new Error(String(error)));
        }
      }
      removeRequest(request) {
        this.s.removeListener("readable", request.onReadable);
        this.pendingRequests.delete(request);
      }
      removeLifecycleListeners() {
        this.s.removeListener("end", this.onEnd);
        this.s.removeListener("error", this.onError);
        this.s.removeListener("close", this.onClose);
      }
      reject(err) {
        this.removeLifecycleListeners();
        this.interrupted = true;
        this.peekQueue = [];
        for (const request of this.pendingRequests) {
          this.removeRequest(request);
          request.deferred.reject(err);
        }
      }
      async abort() {
        this.reject(new AbortError());
      }
      async close() {
        return this.abort();
      }
    };
  }
});

// node_modules/strtok3/lib/stream/WebStreamReader.js
var WebStreamReader;
var init_WebStreamReader = __esm({
  "node_modules/strtok3/lib/stream/WebStreamReader.js"() {
    init_AbstractStreamReader();
    WebStreamReader = class extends AbstractStreamReader {
      constructor(reader) {
        super();
        this.reader = reader;
      }
      async abort() {
        return this.close();
      }
      async close() {
        this.reader.releaseLock();
      }
    };
  }
});

// node_modules/strtok3/lib/stream/WebStreamByobReader.js
var WebStreamByobReader;
var init_WebStreamByobReader = __esm({
  "node_modules/strtok3/lib/stream/WebStreamByobReader.js"() {
    init_WebStreamReader();
    WebStreamByobReader = class extends WebStreamReader {
      /**
       * Read from stream
       * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
       * @param mayBeLess - If true, may fill the buffer partially
       * @protected Bytes read
       */
      async readFromStream(buffer, mayBeLess) {
        if (buffer.length === 0) {
          return 0;
        }
        const result = await this.reader.read(new Uint8Array(buffer.length), {
          min: mayBeLess ? void 0 : buffer.length
        });
        if (result.done) {
          this.endOfStream = result.done;
        }
        if (result.value) {
          buffer.set(result.value);
          return result.value.length;
        }
        return 0;
      }
    };
  }
});

// node_modules/strtok3/lib/stream/WebStreamDefaultReader.js
var WebStreamDefaultReader;
var init_WebStreamDefaultReader = __esm({
  "node_modules/strtok3/lib/stream/WebStreamDefaultReader.js"() {
    init_AbstractStreamReader();
    init_Errors();
    WebStreamDefaultReader = class extends AbstractStreamReader {
      constructor(reader) {
        super();
        this.reader = reader;
        this.buffer = null;
      }
      /**
       * Copy chunk to target, and store the remainder in this.buffer
       */
      writeChunk(target, chunk) {
        const written = Math.min(chunk.length, target.length);
        target.set(chunk.subarray(0, written));
        if (written < chunk.length) {
          this.buffer = chunk.subarray(written);
        } else {
          this.buffer = null;
        }
        return written;
      }
      /**
       * Read from stream
       * @param buffer - Target Uint8Array (or Buffer) to store data read from stream in
       * @param mayBeLess - If true, may fill the buffer partially
       * @protected Bytes read
       */
      async readFromStream(buffer, mayBeLess) {
        if (buffer.length === 0) {
          return 0;
        }
        let totalBytesRead = 0;
        if (this.buffer) {
          totalBytesRead += this.writeChunk(buffer, this.buffer);
        }
        while (totalBytesRead < buffer.length && !this.endOfStream) {
          const result = await this.reader.read();
          if (result.done) {
            this.endOfStream = true;
            break;
          }
          if (result.value) {
            totalBytesRead += this.writeChunk(buffer.subarray(totalBytesRead), result.value);
          }
        }
        if (!mayBeLess && totalBytesRead === 0 && this.endOfStream) {
          throw new EndOfStreamError();
        }
        return totalBytesRead;
      }
      abort() {
        this.interrupted = true;
        return this.reader.cancel();
      }
      async close() {
        try {
          await this.abort();
        } finally {
          this.reader.releaseLock();
        }
      }
    };
  }
});

// node_modules/strtok3/lib/stream/WebStreamReaderFactory.js
function makeWebStreamReader(stream) {
  try {
    const reader = stream.getReader({ mode: "byob" });
    if (reader instanceof ReadableStreamDefaultReader) {
      return new WebStreamDefaultReader(reader);
    }
    return new WebStreamByobReader(reader);
  } catch (error) {
    if (error instanceof TypeError) {
      return new WebStreamDefaultReader(stream.getReader());
    }
    throw error;
  }
}
var init_WebStreamReaderFactory = __esm({
  "node_modules/strtok3/lib/stream/WebStreamReaderFactory.js"() {
    init_WebStreamByobReader();
    init_WebStreamDefaultReader();
  }
});

// node_modules/strtok3/lib/stream/index.js
var init_stream = __esm({
  "node_modules/strtok3/lib/stream/index.js"() {
    init_Errors();
    init_StreamReader();
    init_WebStreamByobReader();
    init_WebStreamDefaultReader();
    init_WebStreamReaderFactory();
  }
});

// node_modules/strtok3/lib/AbstractTokenizer.js
var AbstractTokenizer;
var init_AbstractTokenizer = __esm({
  "node_modules/strtok3/lib/AbstractTokenizer.js"() {
    init_AbortSignal();
    init_BufferSizeError();
    init_stream();
    AbstractTokenizer = class {
      /**
       * Constructor
       * @param options Tokenizer options
       * @protected
       */
      constructor(options) {
        this.numBuffer = new Uint8Array(10);
        this.position = 0;
        this.maxBufferSize = getMaxBufferSize(options);
        throwIfAborted(options?.abortSignal);
        this.onClose = options?.onClose;
        if (options?.abortSignal) {
          this.addAbortListener(options.abortSignal, () => {
            void this.abort().catch(() => {
            });
          });
        }
      }
      addAbortListener(signal, listener) {
        this.abortSignal = signal;
        this.abortListener = listener;
        signal.addEventListener("abort", listener, { once: true });
      }
      removeAbortListener() {
        if (this.abortListener) {
          this.abortSignal?.removeEventListener("abort", this.abortListener);
        }
        this.abortSignal = void 0;
        this.abortListener = void 0;
      }
      /**
       * Read a token from the tokenizer-stream
       * @param token - The token to read
       * @param position - If provided, the desired position in the tokenizer-stream
       * @returns Promise with token data
       */
      async readToken(token, position = this.position) {
        this.validateTokenRead(token.len, position);
        const uint8Array = new Uint8Array(token.len);
        const len = await this.readBuffer(uint8Array, { position });
        if (len < token.len) {
          throw new EndOfStreamError();
        }
        return token.get(uint8Array, 0);
      }
      /**
       * Peek a token from the tokenizer-stream.
       * @param token - Token to peek from the tokenizer-stream.
       * @param position - Offset where to begin reading within the file. If position is null, data will be read from the current file position.
       * @returns Promise with token data
       */
      async peekToken(token, position = this.position) {
        const peekPosition = position ?? this.position;
        this.validateTokenRead(token.len, peekPosition, true);
        const uint8Array = new Uint8Array(token.len);
        const len = await this.peekBuffer(uint8Array, { position: peekPosition });
        if (len < token.len) {
          throw new EndOfStreamError();
        }
        return token.get(uint8Array, 0);
      }
      /**
       * Read a numeric token from the stream
       * @param token - Numeric token
       * @returns Promise with number
       */
      async readNumber(token) {
        const len = await this.readBuffer(this.numBuffer, { length: token.len });
        if (len < token.len) {
          throw new EndOfStreamError();
        }
        return token.get(this.numBuffer, 0);
      }
      /**
       * Read a numeric token from the stream
       * @param token - Numeric token
       * @returns Promise with number
       */
      async peekNumber(token) {
        const len = await this.peekBuffer(this.numBuffer, { length: token.len });
        if (len < token.len) {
          throw new EndOfStreamError();
        }
        return token.get(this.numBuffer, 0);
      }
      /**
       * Ignore number of bytes, advances the pointer in under tokenizer-stream.
       * @param length - Number of bytes to ignore.  Must be ≥ 0.
       * @return resolves the number of bytes ignored, equals length if this available, otherwise the number of bytes available
       */
      async ignore(length) {
        if (length < 0) {
          throw new RangeError("ignore length must be \u2265 0 bytes");
        }
        this.validateLength(length, "ignore length");
        this.validateLength(this.position + length, "end position");
        if (this.fileInfo.size !== void 0) {
          const bytesLeft = Math.max(0, this.fileInfo.size - this.position);
          if (length > bytesLeft) {
            this.position += bytesLeft;
            return bytesLeft;
          }
        }
        this.position += length;
        return length;
      }
      close() {
        if (!this.closePromise) {
          this.removeAbortListener();
          this.closePromise = Promise.resolve().then(() => this.closeOnce());
        }
        return this.closePromise;
      }
      /** Perform cleanup once, sharing completion and the first error across close calls. */
      async closeOnce() {
        await this.abort();
        await this.onClose?.();
      }
      /**
       * Validate a byte length or position before using it in buffer calculations.
       * @param value - Value that must be a non-negative safe integer
       * @param name - Label used in the validation error
       * @throws RangeError if the value is negative or not a safe integer
       */
      validateLength(value, name) {
        if (!Number.isSafeInteger(value) || value < 0) {
          throw new RangeError(`${name} must be a non-negative safe integer`);
        }
      }
      /**
       * Validate a requested buffer size against the configured allocation limit.
       * @param length - Requested buffer size in bytes
       * @throws RangeError if the length is negative or not a safe integer
       * @throws BufferSizeError if the length exceeds maxBufferSize
       */
      validateBufferSize(length) {
        this.validateLength(length, "buffer length");
        if (length > this.maxBufferSize) {
          throw new BufferSizeError(length, this.maxBufferSize);
        }
      }
      /**
       * Validate a token request before allocating a buffer or consuming input.
       * @param length - Token length in bytes
       * @param position - Byte offset where the token starts
       * @param peek - Whether to include skipped stream bytes in the lookahead limit
       * @throws RangeError if a length or position is negative or not a safe integer
       * @throws BufferSizeError if the token buffer or stream lookahead exceeds maxBufferSize
       * @throws Error if a stream request starts before the current position
       * @throws EndOfStreamError if the token extends beyond the known input size
       */
      validateTokenRead(length, position, peek = false) {
        this.validateBufferSize(length);
        this.validateLength(position, "position");
        this.validateLength(position + length, "end position");
        if (!this.supportsRandomAccess() && position < this.position) {
          throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
        }
        if (peek && !this.supportsRandomAccess()) {
          this.validateBufferSize(length + position - this.position);
        }
        if (this.fileInfo.size !== void 0 && length > this.fileInfo.size - position) {
          throw new EndOfStreamError();
        }
      }
      /**
       * Apply defaults and validate buffer read or peek options.
       * @param uint8Array - Target buffer whose length is the default read length
       * @param options - Requested length, position and partial-read behavior
       * @returns Validated options with an explicit length, position and mayBeLess flag
       * @throws RangeError if a length or position is invalid, or the length exceeds the target buffer
       * @throws Error if a stream request starts before the current position
       */
      normalizeOptions(uint8Array, options) {
        const length = options?.length ?? uint8Array.length;
        const position = options?.position ?? this.position;
        this.validateLength(length, "length");
        this.validateLength(position, "position");
        this.validateLength(position + length, "end position");
        if (length > uint8Array.length) {
          throw new RangeError("length must not exceed the target buffer length");
        }
        if (!this.supportsRandomAccess() && position < this.position) {
          throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
        }
        return { length, position, mayBeLess: options?.mayBeLess ?? false };
      }
      abort() {
        this.removeAbortListener();
        return Promise.resolve();
      }
    };
  }
});

// node_modules/strtok3/lib/BlobTokenizer.js
var BlobTokenizer;
var init_BlobTokenizer = __esm({
  "node_modules/strtok3/lib/BlobTokenizer.js"() {
    init_AbstractTokenizer();
    init_stream();
    BlobTokenizer = class extends AbstractTokenizer {
      /**
       * Construct BufferTokenizer
       * @param blob - Uint8Array to tokenize
       * @param options Tokenizer options
       */
      constructor(blob, options) {
        super(options);
        this.blob = blob;
        this.fileInfo = { ...options?.fileInfo ?? {}, ...{ size: blob.size, mimeType: blob.type } };
      }
      /**
       * Read buffer from tokenizer
       * @param uint8Array - Uint8Array to tokenize
       * @param options - Read behaviour options
       * @returns {Promise<number>}
       */
      async readBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        const bytesRead = await this.peekBuffer(uint8Array, normOptions);
        this.position = normOptions.position + bytesRead;
        return bytesRead;
      }
      /**
       * Peek (read ahead) buffer from tokenizer
       * @param buffer
       * @param options - Read behaviour options
       * @returns {Promise<number>}
       */
      async peekBuffer(buffer, options) {
        const normOptions = this.normalizeOptions(buffer, options);
        const bytes2read = Math.max(0, Math.min(this.blob.size - normOptions.position, normOptions.length));
        if (!normOptions.mayBeLess && bytes2read < normOptions.length) {
          throw new EndOfStreamError();
        }
        for (let offset = 0; offset < bytes2read; ) {
          const chunkLength = Math.min(this.maxBufferSize, bytes2read - offset);
          const position = normOptions.position + offset;
          const arrayBuffer = await this.blob.slice(position, position + chunkLength).arrayBuffer();
          buffer.set(new Uint8Array(arrayBuffer), offset);
          offset += chunkLength;
        }
        return bytes2read;
      }
      close() {
        return super.close();
      }
      supportsRandomAccess() {
        return true;
      }
      setPosition(position) {
        this.validateLength(position, "position");
        this.position = position;
      }
    };
  }
});

// node_modules/strtok3/lib/BufferTokenizer.js
var BufferTokenizer;
var init_BufferTokenizer = __esm({
  "node_modules/strtok3/lib/BufferTokenizer.js"() {
    init_AbstractTokenizer();
    init_stream();
    BufferTokenizer = class extends AbstractTokenizer {
      /**
       * Construct BufferTokenizer
       * @param uint8Array - Uint8Array to tokenize
       * @param options Tokenizer options
       */
      constructor(uint8Array, options) {
        super(options);
        this.uint8Array = uint8Array;
        this.fileInfo = { ...options?.fileInfo ?? {}, ...{ size: uint8Array.length } };
      }
      /**
       * Read buffer from tokenizer
       * @param uint8Array - Uint8Array to tokenize
       * @param options - Read behaviour options
       * @returns {Promise<number>}
       */
      async readBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        const bytesRead = await this.peekBuffer(uint8Array, normOptions);
        this.position = normOptions.position + bytesRead;
        return bytesRead;
      }
      /**
       * Peek (read ahead) buffer from tokenizer
       * @param uint8Array
       * @param options - Read behaviour options
       * @returns {Promise<number>}
       */
      async peekBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        const bytes2read = Math.max(0, Math.min(this.uint8Array.length - normOptions.position, normOptions.length));
        if (!normOptions.mayBeLess && bytes2read < normOptions.length) {
          throw new EndOfStreamError();
        }
        uint8Array.set(this.uint8Array.subarray(normOptions.position, normOptions.position + bytes2read));
        return bytes2read;
      }
      close() {
        return super.close();
      }
      supportsRandomAccess() {
        return true;
      }
      setPosition(position) {
        this.validateLength(position, "position");
        this.position = position;
      }
    };
  }
});

// node_modules/strtok3/lib/ReadStreamTokenizer.js
var ignoreChunkSize, ReadStreamTokenizer;
var init_ReadStreamTokenizer = __esm({
  "node_modules/strtok3/lib/ReadStreamTokenizer.js"() {
    init_AbstractTokenizer();
    init_stream();
    ignoreChunkSize = 256e3;
    ReadStreamTokenizer = class extends AbstractTokenizer {
      /**
       * Constructor
       * @param streamReader stream-reader to read from
       * @param options Tokenizer options
       */
      constructor(streamReader, options) {
        super(options);
        this.streamReader = streamReader;
        this.fileInfo = options?.fileInfo ?? {};
      }
      /**
       * Read buffer from tokenizer
       * @param uint8Array - Target Uint8Array to fill with data read from the tokenizer-stream
       * @param options - Read behaviour options
       * @returns Promise with number of bytes read
       */
      async readBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        const skipBytes = normOptions.position - this.position;
        if (skipBytes > 0) {
          await this.ignore(skipBytes);
          return this.readBuffer(uint8Array, options);
        }
        if (skipBytes < 0) {
          throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
        }
        if (normOptions.length === 0) {
          return 0;
        }
        let bytesRead = 0;
        while (bytesRead < normOptions.length) {
          const chunkLength = Math.min(this.maxBufferSize, normOptions.length - bytesRead);
          const count = await this.streamReader.read(uint8Array.subarray(bytesRead, bytesRead + chunkLength), true);
          bytesRead += count;
          this.position += count;
          if (count < chunkLength) {
            break;
          }
        }
        if (!normOptions.mayBeLess && bytesRead < normOptions.length) {
          throw new EndOfStreamError();
        }
        return bytesRead;
      }
      /**
       * Peek (read ahead) buffer from tokenizer
       * @param uint8Array - Uint8Array (or Buffer) to write data to
       * @param options - Read behaviour options
       * @returns Promise with number of bytes peeked
       */
      async peekBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        if (normOptions.length === 0) {
          return 0;
        }
        if (this.fileInfo.size !== void 0 && normOptions.position >= this.fileInfo.size) {
          if (normOptions.mayBeLess) {
            return 0;
          }
          throw new EndOfStreamError();
        }
        const lookaheadSize = normOptions.length + normOptions.position - this.position;
        this.validateBufferSize(lookaheadSize);
        let bytesRead = 0;
        if (normOptions.position) {
          const skipBytes = normOptions.position - this.position;
          if (skipBytes > 0) {
            const skipBuffer = new Uint8Array(normOptions.length + skipBytes);
            bytesRead = await this.peekBuffer(skipBuffer, { mayBeLess: normOptions.mayBeLess });
            const bytesPeeked = Math.max(0, bytesRead - skipBytes);
            uint8Array.set(skipBuffer.subarray(skipBytes, skipBytes + bytesPeeked));
            return bytesPeeked;
          }
          if (skipBytes < 0) {
            throw new Error("Cannot peek from a negative offset in a stream");
          }
        }
        if (normOptions.length > 0) {
          try {
            const peekBuffer = new Uint8Array(normOptions.length);
            bytesRead = await this.streamReader.peek(peekBuffer, true);
            uint8Array.set(peekBuffer.subarray(0, bytesRead));
          } catch (err) {
            if (options?.mayBeLess && err instanceof EndOfStreamError) {
              return 0;
            }
            throw err;
          }
          if (!normOptions.mayBeLess && bytesRead < normOptions.length) {
            throw new EndOfStreamError();
          }
        }
        return bytesRead;
      }
      /**
       * @param length Number of bytes to ignore. Must be ≥ 0.
       */
      async ignore(length) {
        if (length < 0) {
          throw new RangeError("ignore length must be \u2265 0 bytes");
        }
        this.validateLength(length, "ignore length");
        this.validateLength(this.position + length, "end position");
        if (length > 0 && this.fileInfo.size !== void 0 && length > this.fileInfo.size - this.position) {
          throw new EndOfStreamError();
        }
        const bufSize = Math.min(ignoreChunkSize, this.maxBufferSize, length);
        const buf = new Uint8Array(bufSize);
        let totBytesRead = 0;
        while (totBytesRead < length) {
          const remaining = length - totBytesRead;
          const bytesRead = await this.readBuffer(buf, { length: Math.min(bufSize, remaining) });
          if (bytesRead < 0) {
            return bytesRead;
          }
          totBytesRead += bytesRead;
        }
        return totBytesRead;
      }
      abort() {
        this.removeAbortListener();
        return this.streamReader.abort();
      }
      async close() {
        this.removeAbortListener();
        return this.streamReader.close();
      }
      supportsRandomAccess() {
        return false;
      }
    };
  }
});

// node_modules/strtok3/lib/isRandomAccessTokenizer.js
function isRandomAccessTokenizer(tokenizer) {
  return tokenizer.supportsRandomAccess() && "setPosition" in tokenizer && typeof tokenizer.setPosition === "function" && typeof tokenizer.fileInfo.size === "number";
}
var init_isRandomAccessTokenizer = __esm({
  "node_modules/strtok3/lib/isRandomAccessTokenizer.js"() {
  }
});

// node_modules/strtok3/lib/TokenizerBoundaryError.js
var TokenizerBoundaryError;
var init_TokenizerBoundaryError = __esm({
  "node_modules/strtok3/lib/TokenizerBoundaryError.js"() {
    TokenizerBoundaryError = class extends RangeError {
      constructor(position, length, size) {
        super(`Range at position ${position} with length ${length} exceeds tokenizer view size ${size}`);
        this.position = position;
        this.length = length;
        this.size = size;
        this.name = "TokenizerBoundaryError";
      }
    };
  }
});

// node_modules/strtok3/lib/TokenizerView.js
function validateOffset(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new RangeError(`${name} must be a non-negative safe integer`);
  }
}
function createTokenizerView(source, length) {
  return isRandomAccessTokenizer(source) ? new RandomAccessTokenizerView(source, length) : new TokenizerView(source, length);
}
var TokenizerView, RandomAccessTokenizerView;
var init_TokenizerView = __esm({
  "node_modules/strtok3/lib/TokenizerView.js"() {
    init_isRandomAccessTokenizer();
    init_stream();
    init_TokenizerBoundaryError();
    TokenizerView = class _TokenizerView {
      constructor(source, size) {
        this.source = source;
        this.size = size;
        this.closed = false;
        this.closedPosition = 0;
        this.busy = false;
        validateOffset(size, "length");
        validateOffset(source.position, "source position");
        validateOffset(source.position + size, "end position");
        if (source instanceof _TokenizerView) {
          source.assertAvailable();
          source.translateRange(size, source.position);
        }
        this.start = source.position;
        this.fileInfo = { size };
      }
      get position() {
        return this.closed ? this.closedPosition : this.source.position - this.start;
      }
      get remaining() {
        return this.size - this.position;
      }
      supportsRandomAccess() {
        return false;
      }
      createView(length) {
        this.assertAvailable();
        return createTokenizerView(this, length);
      }
      async readBuffer(buffer, options) {
        return this.bufferOperation("readBuffer", buffer, options);
      }
      async peekBuffer(buffer, options) {
        return this.bufferOperation("peekBuffer", buffer, options);
      }
      async bufferOperation(method, buffer, options) {
        this.assertAvailable();
        const length = options?.length ?? buffer.length;
        const position = options?.position ?? this.position;
        const absolutePosition = this.translateRange(length, position);
        if (length > buffer.length) {
          throw new RangeError("length must not exceed the target buffer length");
        }
        return this.run(() => this.source[method](buffer, { ...options, length, position: absolutePosition }));
      }
      async readToken(token, position = this.position) {
        this.assertAvailable();
        const absolutePosition = this.translateRange(token.len, position);
        return this.run(() => this.source.readToken(token, absolutePosition));
      }
      async peekToken(token, position = this.position) {
        this.assertAvailable();
        const absolutePosition = this.translateRange(token.len, position ?? this.position);
        return this.run(() => this.source.peekToken(token, absolutePosition));
      }
      async readNumber(token) {
        this.assertAvailable();
        this.translateRange(token.len, this.position);
        return this.run(() => this.source.readNumber(token));
      }
      async peekNumber(token) {
        this.assertAvailable();
        this.translateRange(token.len, this.position);
        return this.run(() => this.source.peekNumber(token));
      }
      async ignore(length) {
        this.assertAvailable();
        this.translateRange(length, this.position);
        return this.run(() => this.source.ignore(length));
      }
      async consumeRemainder() {
        this.assertAvailable();
        const length = this.remaining;
        const end = this.translateRange(length, this.position) + length;
        return this.run(async () => {
          if (length === 0) {
            return 0;
          }
          if (isRandomAccessTokenizer(this.source)) {
            if (await this.source.peekBuffer(new Uint8Array(1), { position: end - 1 }) !== 1) {
              throw new EndOfStreamError();
            }
            this.source.setPosition(end);
          } else {
            const ignored = await this.source.ignore(length);
            if (ignored !== length) {
              throw new EndOfStreamError();
            }
          }
          return length;
        });
      }
      /** Release this view only. Never drain, close or abort the borrowed source. */
      async close() {
        if (this.closed) {
          return;
        }
        if (this.busy) {
          throw new Error("Cannot close a tokenizer view during an active operation");
        }
        this.closedPosition = this.position;
        this.closed = true;
      }
      /** Explicit cancellation propagates to the shared source and affects its other users. */
      async abort() {
        if (this.closed) {
          return;
        }
        try {
          await this.source.abort();
        } finally {
          this.closedPosition = this.position;
          this.closed = true;
        }
      }
      assertAvailable() {
        if (this.closed) {
          throw new Error("Tokenizer view is closed");
        }
        if (this.busy) {
          throw new Error("Tokenizer views require sequential operations");
        }
        if (this.source instanceof _TokenizerView) {
          this.source.assertAvailable();
        }
      }
      /** Validate the whole request before delegating or allowing a token allocation. */
      translateRange(length, position) {
        validateOffset(length, "length");
        validateOffset(position, "position");
        validateOffset(position + length, "end position");
        if (position > this.size || length > this.size - position) {
          throw new TokenizerBoundaryError(position, length, this.size);
        }
        if (!this.supportsRandomAccess() && position < this.position) {
          throw new Error("`options.position` must be equal or greater than `tokenizer.position`");
        }
        return this.start + position;
      }
      async run(operation) {
        this.busy = true;
        try {
          return await operation();
        } finally {
          this.busy = false;
        }
      }
    };
    RandomAccessTokenizerView = class extends TokenizerView {
      constructor(source, size) {
        super(source, size);
      }
      supportsRandomAccess() {
        return true;
      }
      setPosition(position) {
        this.assertAvailable();
        this.source.setPosition(this.translateRange(0, position));
      }
      createView(length) {
        this.assertAvailable();
        return createTokenizerView(this, length);
      }
    };
  }
});

// node_modules/strtok3/lib/core.js
function fromStream(stream, options) {
  getMaxBufferSize(options);
  throwIfAborted(options?.abortSignal);
  const streamReader = new StreamReader(stream);
  return new ReadStreamTokenizer(streamReader, options);
}
function fromWebStream(webStream, options) {
  getMaxBufferSize(options);
  throwIfAborted(options?.abortSignal);
  const webStreamReader = makeWebStreamReader(webStream);
  return new ReadStreamTokenizer(webStreamReader, options);
}
function fromBuffer(uint8Array, options) {
  return new BufferTokenizer(uint8Array, options);
}
function fromBlob(blob, options) {
  return new BlobTokenizer(blob, options);
}
var init_core = __esm({
  "node_modules/strtok3/lib/core.js"() {
    init_AbortSignal();
    init_BlobTokenizer();
    init_BufferSizeError();
    init_BufferTokenizer();
    init_ReadStreamTokenizer();
    init_stream();
    init_AbstractTokenizer();
    init_BufferSizeError();
    init_isRandomAccessTokenizer();
    init_stream();
    init_TokenizerBoundaryError();
    init_TokenizerView();
  }
});

// node_modules/strtok3/lib/NotRegularFileError.js
var NotRegularFileError;
var init_NotRegularFileError = __esm({
  "node_modules/strtok3/lib/NotRegularFileError.js"() {
    NotRegularFileError = class extends Error {
      constructor(path2) {
        super(`Not a regular file: ${path2}`);
        this.path = path2;
        this.name = "NotRegularFileError";
      }
    };
  }
});

// node_modules/strtok3/lib/FileTokenizer.js
var import_node_fs, import_promises, FileTokenizer;
var init_FileTokenizer = __esm({
  "node_modules/strtok3/lib/FileTokenizer.js"() {
    import_node_fs = require("node:fs");
    import_promises = __toESM(require("node:fs/promises"), 1);
    init_AbortSignal();
    init_AbstractTokenizer();
    init_BufferSizeError();
    init_NotRegularFileError();
    init_stream();
    FileTokenizer = class _FileTokenizer extends AbstractTokenizer {
      /**
       * Create tokenizer from provided file path
       * @param sourceFilePath File path
       * @param options Tokenizer options
       */
      static async fromFile(sourceFilePath, options) {
        getMaxBufferSize(options);
        throwIfAborted(options?.abortSignal);
        const flags = options?.regularFileOnly ? import_node_fs.constants.O_RDONLY | import_node_fs.constants.O_NONBLOCK : "r";
        const fileHandle = await import_promises.default.open(sourceFilePath, flags);
        try {
          const stat = await fileHandle.stat();
          if (options?.regularFileOnly && !stat.isFile()) {
            throw new NotRegularFileError(sourceFilePath);
          }
          return new _FileTokenizer(fileHandle, {
            ...options,
            fileInfo: { ...options?.fileInfo, path: sourceFilePath, size: stat.size }
          });
        } catch (error) {
          await fileHandle.close();
          throw error;
        }
      }
      constructor(fileHandle, options) {
        super(options);
        this.fileHandle = fileHandle;
        this.fileInfo = options.fileInfo;
      }
      /**
       * Read buffer from file
       * @param uint8Array - Uint8Array to write result to
       * @param options - Read behaviour options
       * @returns Promise number of bytes read
       */
      async readBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        this.position = normOptions.position;
        if (normOptions.length === 0) {
          return 0;
        }
        const res = await this.fileHandle.read(uint8Array, 0, normOptions.length, normOptions.position);
        this.position += res.bytesRead;
        if (res.bytesRead < normOptions.length && (!options || !options.mayBeLess)) {
          throw new EndOfStreamError();
        }
        return res.bytesRead;
      }
      /**
       * Peek buffer from file
       * @param uint8Array - Uint8Array (or Buffer) to write data to
       * @param options - Read behaviour options
       * @returns Promise number of bytes read
       */
      async peekBuffer(uint8Array, options) {
        const normOptions = this.normalizeOptions(uint8Array, options);
        const res = await this.fileHandle.read(uint8Array, 0, normOptions.length, normOptions.position);
        if (!normOptions.mayBeLess && res.bytesRead < normOptions.length) {
          throw new EndOfStreamError();
        }
        return res.bytesRead;
      }
      async closeOnce() {
        await this.fileHandle.close();
        await super.closeOnce();
      }
      setPosition(position) {
        this.validateLength(position, "position");
        this.position = position;
      }
      supportsRandomAccess() {
        return true;
      }
    };
  }
});

// node_modules/strtok3/lib/index.js
async function waitForPendingOpen(stream) {
  if (stream.pending !== true || stream.destroyed || stream.errored !== null) {
    return;
  }
  await new Promise((resolve) => {
    const settle = () => {
      stream.removeListener("open", settle);
      stream.removeListener("error", settle);
      stream.removeListener("close", settle);
      resolve();
    };
    stream.once("open", settle);
    stream.once("error", settle);
    stream.once("close", settle);
  });
}
async function fromStream2(stream, options) {
  const rst = fromStream(stream, options);
  try {
    if (stream.path) {
      const stat = await (0, import_promises2.stat)(stream.path);
      rst.fileInfo.path = stream.path;
      rst.fileInfo.size = stat.size;
    }
    return rst;
  } catch (error) {
    await waitForPendingOpen(stream);
    await rst.close();
    throw error;
  }
}
var import_promises2, fromFile;
var init_lib = __esm({
  "node_modules/strtok3/lib/index.js"() {
    import_promises2 = require("node:fs/promises");
    init_core();
    init_FileTokenizer();
    init_core();
    init_FileTokenizer();
    init_NotRegularFileError();
    fromFile = FileTokenizer.fromFile;
  }
});

// node_modules/music-metadata/lib/ParseError.js
var makeParseError, CouldNotDetermineFileTypeError, UnsupportedFileTypeError, UnexpectedFileContentError, FieldDecodingError, InternalParserError, makeUnexpectedFileContentError;
var init_ParseError = __esm({
  "node_modules/music-metadata/lib/ParseError.js"() {
    makeParseError = (name) => {
      return class ParseError extends Error {
        name;
        constructor(message) {
          super(message);
          this.name = name;
        }
      };
    };
    CouldNotDetermineFileTypeError = class extends makeParseError("CouldNotDetermineFileTypeError") {
    };
    UnsupportedFileTypeError = class extends makeParseError("UnsupportedFileTypeError") {
    };
    UnexpectedFileContentError = class extends makeParseError("UnexpectedFileContentError") {
      fileType;
      constructor(fileType, message) {
        super(message);
        this.fileType = fileType;
      }
      // Override toString to include file type information.
      toString() {
        return `${this.name} (FileType: ${this.fileType}): ${this.message}`;
      }
    };
    FieldDecodingError = class extends makeParseError("FieldDecodingError") {
    };
    InternalParserError = class extends makeParseError("InternalParserError") {
    };
    makeUnexpectedFileContentError = (fileType) => {
      return class extends UnexpectedFileContentError {
        constructor(message) {
          super(fileType, message);
        }
      };
    };
  }
});

// node_modules/music-metadata/lib/common/Allocation.js
function getMaxMemoryAllocation(options) {
  const limit = options.maxMemoryAllocation ?? defaultMaxMemoryAllocation;
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new RangeError("maxMemoryAllocation must be a positive safe integer");
  }
  return limit;
}
function getMaxMetadataEntries(options) {
  const limit = options.maxMetadataEntries ?? defaultMaxMetadataEntries;
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new RangeError("maxMetadataEntries must be a positive safe integer");
  }
  return limit;
}
function getMaxChapterCount(options) {
  const limit = options.maxChapterCount ?? defaultMaxChapterCount;
  if (!Number.isSafeInteger(limit) || limit <= 0) {
    throw new RangeError("maxChapterCount must be a positive safe integer");
  }
  return limit;
}
function getTokenizerOptions(options, fileInfo) {
  return { maxBufferSize: getMaxMemoryAllocation(options), fileInfo };
}
function validateAllocation(length, options, makeError = allocationError) {
  if (!Number.isSafeInteger(length) || length < 0) {
    throw makeError(`Invalid allocation size: ${length}`);
  }
  const limit = getMaxMemoryAllocation(options);
  if (length > limit) {
    throw makeError(`Metadata size ${length} exceeds allocation limit ${limit} (buffering limit)`);
  }
}
function validateAvailableBytes(tokenizer, length, position) {
  if (tokenizer.fileInfo.size !== void 0 && length > tokenizer.fileInfo.size - position) {
    throw new EndOfStreamError();
  }
}
async function readBuffer(tokenizer, length, options, position = tokenizer.position, makeError = allocationError) {
  validateAllocation(length, options, makeError);
  validateAvailableBytes(tokenizer, length, position);
  if (!isRandomAccessTokenizer(tokenizer) && length > readChunkSize) {
    const chunks = [];
    for (let remaining = length; remaining > 0; ) {
      const chunk = new Uint8Array(Math.min(remaining, readChunkSize));
      const bytesRead = await tokenizer.readBuffer(chunk, { position });
      if (bytesRead !== chunk.length) {
        throw new EndOfStreamError();
      }
      chunks.push(chunk);
      remaining -= chunk.length;
      position += chunk.length;
    }
    const buffer2 = new Uint8Array(length);
    let offset = 0;
    for (const chunk of chunks) {
      buffer2.set(chunk, offset);
      offset += chunk.length;
    }
    return buffer2;
  }
  const buffer = new Uint8Array(length);
  if (await tokenizer.readBuffer(buffer, { position }) !== length) {
    throw new EndOfStreamError();
  }
  return buffer;
}
async function readToken(tokenizer, token, options, position = tokenizer.position, makeError = allocationError) {
  validateAllocation(token.len, options, makeError);
  validateAvailableBytes(tokenizer, token.len, position);
  if (token.len <= readChunkSize) {
    return tokenizer.readToken(token, position);
  }
  return token.get(await readBuffer(tokenizer, token.len, options, position, makeError), 0);
}
var defaultMaxMemoryAllocation, defaultMaxMetadataEntries, defaultMaxChapterCount, readChunkSize, allocationError;
var init_Allocation = __esm({
  "node_modules/music-metadata/lib/common/Allocation.js"() {
    init_lib();
    init_ParseError();
    defaultMaxMemoryAllocation = 64 * 1024 * 1024;
    defaultMaxMetadataEntries = 1e5;
    defaultMaxChapterCount = 1e3;
    readChunkSize = 64 * 1024;
    allocationError = (message) => new UnexpectedFileContentError("metadata", message);
  }
});

// node_modules/@borewit/text-codec/lib/index.js
function utf8Decoder() {
  if (_utf8Decoder === void 0) {
    try {
      _utf8Decoder = typeof globalThis.TextDecoder === "undefined" ? null : new globalThis.TextDecoder("utf-8");
    } catch {
      _utf8Decoder = null;
    }
  }
  return _utf8Decoder !== null && _utf8Decoder !== void 0 ? _utf8Decoder : void 0;
}
function utf8Encoder() {
  if (_utf8Encoder === void 0) {
    try {
      _utf8Encoder = typeof globalThis.TextEncoder === "undefined" ? null : new globalThis.TextEncoder();
    } catch {
      _utf8Encoder = null;
    }
  }
  return _utf8Encoder !== null && _utf8Encoder !== void 0 ? _utf8Encoder : void 0;
}
function textDecode(bytes, encoding = "utf-8") {
  switch (encoding.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const dec = utf8Decoder();
      return dec ? dec.decode(bytes) : decodeUTF8(bytes);
    }
    case "utf-16le":
      return decodeUTF16LE(bytes);
    case "us-ascii":
    case "ascii":
      return decodeASCII(bytes);
    case "latin1":
    case "iso-8859-1":
      return decodeLatin1(bytes);
    case "windows-1252":
      return decodeWindows1252(bytes);
    default:
      throw new RangeError(`Encoding '${encoding}' not supported`);
  }
}
function textEncode(input = "", encoding = "utf-8") {
  switch (encoding.toLowerCase()) {
    case "utf-8":
    case "utf8": {
      const enc = utf8Encoder();
      return enc ? enc.encode(input) : encodeUTF8(input);
    }
    case "utf-16le":
      return encodeUTF16LE(input);
    case "us-ascii":
    case "ascii":
      return encodeASCII(input);
    case "latin1":
    case "iso-8859-1":
      return encodeLatin1(input);
    case "windows-1252":
      return encodeWindows1252(input);
    default:
      throw new RangeError(`Encoding '${encoding}' not supported`);
  }
}
function flushChunk(parts, chunk) {
  if (chunk.length === 0) {
    return;
  }
  parts.push(String.fromCharCode.apply(null, chunk));
  chunk.length = 0;
}
function pushCodeUnit(parts, chunk, codeUnit) {
  chunk.push(codeUnit);
  if (chunk.length >= CHUNK) {
    flushChunk(parts, chunk);
  }
}
function pushCodePoint(parts, chunk, cp) {
  if (cp <= 65535) {
    pushCodeUnit(parts, chunk, cp);
    return;
  }
  cp -= 65536;
  pushCodeUnit(parts, chunk, 55296 + (cp >> 10));
  pushCodeUnit(parts, chunk, 56320 + (cp & 1023));
}
function decodeUTF8(bytes) {
  const parts = [];
  const chunk = [];
  let i = 0;
  if (bytes.length >= 3 && bytes[0] === 239 && bytes[1] === 187 && bytes[2] === 191) {
    i = 3;
  }
  while (i < bytes.length) {
    const b1 = bytes[i];
    if (b1 <= 127) {
      pushCodeUnit(parts, chunk, b1);
      i++;
      continue;
    }
    if (b1 < 194 || b1 > 244) {
      pushCodeUnit(parts, chunk, REPLACEMENT);
      i++;
      continue;
    }
    const length = b1 <= 223 ? 2 : b1 <= 239 ? 3 : 4;
    let cp = b1 & 127 >> length;
    let lower = b1 === 224 ? 160 : b1 === 240 ? 144 : 128;
    let upper = b1 === 237 ? 159 : b1 === 244 ? 143 : 191;
    let consumed = 1;
    i++;
    while (consumed < length && i < bytes.length) {
      const next = bytes[i];
      if (next < lower || next > upper) {
        break;
      }
      cp = cp << 6 | next & 63;
      consumed++;
      i++;
      lower = 128;
      upper = 191;
    }
    pushCodePoint(parts, chunk, consumed === length ? cp : REPLACEMENT);
  }
  flushChunk(parts, chunk);
  return parts.join("");
}
function decodeUTF16LE(bytes) {
  const parts = [];
  const chunk = [];
  const len = bytes.length;
  let i = 0;
  if (len >= 2 && bytes[0] === 255 && bytes[1] === 254) {
    i = 2;
  }
  while (i + 1 < len) {
    const u1 = bytes[i] | bytes[i + 1] << 8;
    i += 2;
    if (u1 >= 55296 && u1 <= 56319) {
      if (i + 1 < len) {
        const u2 = bytes[i] | bytes[i + 1] << 8;
        if (u2 >= 56320 && u2 <= 57343) {
          pushCodeUnit(parts, chunk, u1);
          pushCodeUnit(parts, chunk, u2);
          i += 2;
        } else {
          pushCodeUnit(parts, chunk, REPLACEMENT);
        }
      } else {
        pushCodeUnit(parts, chunk, REPLACEMENT);
      }
      continue;
    }
    if (u1 >= 56320 && u1 <= 57343) {
      pushCodeUnit(parts, chunk, REPLACEMENT);
      continue;
    }
    pushCodeUnit(parts, chunk, u1);
  }
  if (i < len) {
    pushCodeUnit(parts, chunk, REPLACEMENT);
  }
  flushChunk(parts, chunk);
  return parts.join("");
}
function decodeASCII(bytes) {
  const parts = [];
  for (let i = 0; i < bytes.length; i += CHUNK) {
    const end = Math.min(bytes.length, i + CHUNK);
    const codes = new Array(end - i);
    for (let j = i, k = 0; j < end; j++, k++) {
      codes[k] = bytes[j] & 127;
    }
    parts.push(String.fromCharCode.apply(null, codes));
  }
  return parts.join("");
}
function decodeLatin1(bytes) {
  const parts = [];
  for (let i = 0; i < bytes.length; i += CHUNK) {
    const end = Math.min(bytes.length, i + CHUNK);
    const codes = new Array(end - i);
    for (let j = i, k = 0; j < end; j++, k++) {
      codes[k] = bytes[j];
    }
    parts.push(String.fromCharCode.apply(null, codes));
  }
  return parts.join("");
}
function decodeWindows1252(bytes) {
  const parts = [];
  let out = "";
  for (let i = 0; i < bytes.length; i++) {
    const b = bytes[i];
    const extra = b >= 128 && b <= 159 ? WINDOWS_1252_EXTRA[b] : void 0;
    out += extra !== null && extra !== void 0 ? extra : String.fromCharCode(b);
    if (out.length >= CHUNK) {
      parts.push(out);
      out = "";
    }
  }
  if (out) {
    parts.push(out);
  }
  return parts.join("");
}
function encodeUTF8(str) {
  const out = [];
  for (let i = 0; i < str.length; i++) {
    let cp = str.charCodeAt(i);
    if (cp >= 55296 && cp <= 56319) {
      if (i + 1 < str.length) {
        const lo = str.charCodeAt(i + 1);
        if (lo >= 56320 && lo <= 57343) {
          cp = 65536 + (cp - 55296 << 10) + (lo - 56320);
          i++;
        } else {
          cp = REPLACEMENT;
        }
      } else {
        cp = REPLACEMENT;
      }
    } else if (cp >= 56320 && cp <= 57343) {
      cp = REPLACEMENT;
    }
    if (cp < 128) {
      out.push(cp);
    } else if (cp < 2048) {
      out.push(192 | cp >> 6, 128 | cp & 63);
    } else if (cp < 65536) {
      out.push(224 | cp >> 12, 128 | cp >> 6 & 63, 128 | cp & 63);
    } else {
      out.push(240 | cp >> 18, 128 | cp >> 12 & 63, 128 | cp >> 6 & 63, 128 | cp & 63);
    }
  }
  return new Uint8Array(out);
}
function encodeUTF16LE(str) {
  const units = [];
  for (let i = 0; i < str.length; i++) {
    const u = str.charCodeAt(i);
    if (u >= 55296 && u <= 56319) {
      if (i + 1 < str.length) {
        const lo = str.charCodeAt(i + 1);
        if (lo >= 56320 && lo <= 57343) {
          units.push(u, lo);
          i++;
        } else {
          units.push(REPLACEMENT);
        }
      } else {
        units.push(REPLACEMENT);
      }
      continue;
    }
    if (u >= 56320 && u <= 57343) {
      units.push(REPLACEMENT);
      continue;
    }
    units.push(u);
  }
  const out = new Uint8Array(units.length * 2);
  for (let i = 0; i < units.length; i++) {
    const code = units[i];
    const o = i * 2;
    out[o] = code & 255;
    out[o + 1] = code >>> 8;
  }
  return out;
}
function encodeASCII(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    out[i] = str.charCodeAt(i) & 127;
  }
  return out;
}
function encodeLatin1(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    out[i] = str.charCodeAt(i) & 255;
  }
  return out;
}
function encodeWindows1252(str) {
  const out = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const code = ch.charCodeAt(0);
    if (WINDOWS_1252_REVERSE[ch] !== void 0) {
      out[i] = WINDOWS_1252_REVERSE[ch];
      continue;
    }
    if (code >= 0 && code <= 127 || code >= 160 && code <= 255) {
      out[i] = code;
      continue;
    }
    out[i] = 63;
  }
  return out;
}
var WINDOWS_1252_EXTRA, WINDOWS_1252_REVERSE, _utf8Decoder, _utf8Encoder, CHUNK, REPLACEMENT;
var init_lib2 = __esm({
  "node_modules/@borewit/text-codec/lib/index.js"() {
    WINDOWS_1252_EXTRA = {
      128: "\u20AC",
      130: "\u201A",
      131: "\u0192",
      132: "\u201E",
      133: "\u2026",
      134: "\u2020",
      135: "\u2021",
      136: "\u02C6",
      137: "\u2030",
      138: "\u0160",
      139: "\u2039",
      140: "\u0152",
      142: "\u017D",
      145: "\u2018",
      146: "\u2019",
      147: "\u201C",
      148: "\u201D",
      149: "\u2022",
      150: "\u2013",
      151: "\u2014",
      152: "\u02DC",
      153: "\u2122",
      154: "\u0161",
      155: "\u203A",
      156: "\u0153",
      158: "\u017E",
      159: "\u0178"
    };
    WINDOWS_1252_REVERSE = {};
    for (const [code, char] of Object.entries(WINDOWS_1252_EXTRA)) {
      WINDOWS_1252_REVERSE[char] = Number.parseInt(code, 10);
    }
    CHUNK = 32 * 1024;
    REPLACEMENT = 65533;
  }
});

// node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "node_modules/ieee754/index.js"(exports2) {
    exports2.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports2.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// node_modules/token-types/lib/index.js
var lib_exports = {};
__export(lib_exports, {
  AnsiStringType: () => AnsiStringType,
  Float16_BE: () => Float16_BE,
  Float16_LE: () => Float16_LE,
  Float32_BE: () => Float32_BE,
  Float32_LE: () => Float32_LE,
  Float64_BE: () => Float64_BE,
  Float64_LE: () => Float64_LE,
  Float80_BE: () => Float80_BE,
  Float80_LE: () => Float80_LE,
  INT16_BE: () => INT16_BE,
  INT16_LE: () => INT16_LE,
  INT24_BE: () => INT24_BE,
  INT24_LE: () => INT24_LE,
  INT32_BE: () => INT32_BE,
  INT32_LE: () => INT32_LE,
  INT64_BE: () => INT64_BE,
  INT64_LE: () => INT64_LE,
  INT8: () => INT8,
  IgnoreType: () => IgnoreType,
  StringType: () => StringType,
  UINT16_BE: () => UINT16_BE,
  UINT16_LE: () => UINT16_LE,
  UINT24_BE: () => UINT24_BE,
  UINT24_LE: () => UINT24_LE,
  UINT32_BE: () => UINT32_BE,
  UINT32_LE: () => UINT32_LE,
  UINT64_BE: () => UINT64_BE,
  UINT64_LE: () => UINT64_LE,
  UINT8: () => UINT8,
  Uint8ArrayType: () => Uint8ArrayType
});
function dv(array) {
  return new DataView(array.buffer, array.byteOffset);
}
var ieee754, UINT8, UINT16_LE, UINT16_BE, UINT24_LE, UINT24_BE, UINT32_LE, UINT32_BE, INT8, INT16_BE, INT16_LE, INT24_LE, INT24_BE, INT32_BE, INT32_LE, UINT64_LE, INT64_LE, UINT64_BE, INT64_BE, Float16_BE, Float16_LE, Float32_BE, Float32_LE, Float64_BE, Float64_LE, Float80_BE, Float80_LE, IgnoreType, Uint8ArrayType, StringType, AnsiStringType;
var init_lib3 = __esm({
  "node_modules/token-types/lib/index.js"() {
    ieee754 = __toESM(require_ieee754(), 1);
    init_lib2();
    UINT8 = {
      len: 1,
      get(array, offset) {
        return dv(array).getUint8(offset);
      },
      put(array, offset, value) {
        dv(array).setUint8(offset, value);
        return offset + 1;
      }
    };
    UINT16_LE = {
      len: 2,
      get(array, offset) {
        return dv(array).getUint16(offset, true);
      },
      put(array, offset, value) {
        dv(array).setUint16(offset, value, true);
        return offset + 2;
      }
    };
    UINT16_BE = {
      len: 2,
      get(array, offset) {
        return dv(array).getUint16(offset);
      },
      put(array, offset, value) {
        dv(array).setUint16(offset, value);
        return offset + 2;
      }
    };
    UINT24_LE = {
      len: 3,
      get(array, offset) {
        const dataView = dv(array);
        return dataView.getUint8(offset) + (dataView.getUint16(offset + 1, true) << 8);
      },
      put(array, offset, value) {
        const dataView = dv(array);
        dataView.setUint8(offset, value & 255);
        dataView.setUint16(offset + 1, value >> 8, true);
        return offset + 3;
      }
    };
    UINT24_BE = {
      len: 3,
      get(array, offset) {
        const dataView = dv(array);
        return (dataView.getUint16(offset) << 8) + dataView.getUint8(offset + 2);
      },
      put(array, offset, value) {
        const dataView = dv(array);
        dataView.setUint16(offset, value >> 8);
        dataView.setUint8(offset + 2, value & 255);
        return offset + 3;
      }
    };
    UINT32_LE = {
      len: 4,
      get(array, offset) {
        return dv(array).getUint32(offset, true);
      },
      put(array, offset, value) {
        dv(array).setUint32(offset, value, true);
        return offset + 4;
      }
    };
    UINT32_BE = {
      len: 4,
      get(array, offset) {
        return dv(array).getUint32(offset);
      },
      put(array, offset, value) {
        dv(array).setUint32(offset, value);
        return offset + 4;
      }
    };
    INT8 = {
      len: 1,
      get(array, offset) {
        return dv(array).getInt8(offset);
      },
      put(array, offset, value) {
        dv(array).setInt8(offset, value);
        return offset + 1;
      }
    };
    INT16_BE = {
      len: 2,
      get(array, offset) {
        return dv(array).getInt16(offset);
      },
      put(array, offset, value) {
        dv(array).setInt16(offset, value);
        return offset + 2;
      }
    };
    INT16_LE = {
      len: 2,
      get(array, offset) {
        return dv(array).getInt16(offset, true);
      },
      put(array, offset, value) {
        dv(array).setInt16(offset, value, true);
        return offset + 2;
      }
    };
    INT24_LE = {
      len: 3,
      get(array, offset) {
        const unsigned = UINT24_LE.get(array, offset);
        return unsigned > 8388607 ? unsigned - 16777216 : unsigned;
      },
      put(array, offset, value) {
        const dataView = dv(array);
        dataView.setUint8(offset, value & 255);
        dataView.setUint16(offset + 1, value >> 8, true);
        return offset + 3;
      }
    };
    INT24_BE = {
      len: 3,
      get(array, offset) {
        const unsigned = UINT24_BE.get(array, offset);
        return unsigned > 8388607 ? unsigned - 16777216 : unsigned;
      },
      put(array, offset, value) {
        const dataView = dv(array);
        dataView.setUint16(offset, value >> 8);
        dataView.setUint8(offset + 2, value & 255);
        return offset + 3;
      }
    };
    INT32_BE = {
      len: 4,
      get(array, offset) {
        return dv(array).getInt32(offset);
      },
      put(array, offset, value) {
        dv(array).setInt32(offset, value);
        return offset + 4;
      }
    };
    INT32_LE = {
      len: 4,
      get(array, offset) {
        return dv(array).getInt32(offset, true);
      },
      put(array, offset, value) {
        dv(array).setInt32(offset, value, true);
        return offset + 4;
      }
    };
    UINT64_LE = {
      len: 8,
      get(array, offset) {
        return dv(array).getBigUint64(offset, true);
      },
      put(array, offset, value) {
        dv(array).setBigUint64(offset, value, true);
        return offset + 8;
      }
    };
    INT64_LE = {
      len: 8,
      get(array, offset) {
        return dv(array).getBigInt64(offset, true);
      },
      put(array, offset, value) {
        dv(array).setBigInt64(offset, value, true);
        return offset + 8;
      }
    };
    UINT64_BE = {
      len: 8,
      get(array, offset) {
        return dv(array).getBigUint64(offset);
      },
      put(array, offset, value) {
        dv(array).setBigUint64(offset, value);
        return offset + 8;
      }
    };
    INT64_BE = {
      len: 8,
      get(array, offset) {
        return dv(array).getBigInt64(offset);
      },
      put(array, offset, value) {
        dv(array).setBigInt64(offset, value);
        return offset + 8;
      }
    };
    Float16_BE = {
      len: 2,
      get(dataView, offset) {
        return ieee754.read(dataView, offset, false, 10, this.len);
      },
      put(dataView, offset, value) {
        ieee754.write(dataView, value, offset, false, 10, this.len);
        return offset + this.len;
      }
    };
    Float16_LE = {
      len: 2,
      get(array, offset) {
        return ieee754.read(array, offset, true, 10, this.len);
      },
      put(array, offset, value) {
        ieee754.write(array, value, offset, true, 10, this.len);
        return offset + this.len;
      }
    };
    Float32_BE = {
      len: 4,
      get(array, offset) {
        return dv(array).getFloat32(offset);
      },
      put(array, offset, value) {
        dv(array).setFloat32(offset, value);
        return offset + 4;
      }
    };
    Float32_LE = {
      len: 4,
      get(array, offset) {
        return dv(array).getFloat32(offset, true);
      },
      put(array, offset, value) {
        dv(array).setFloat32(offset, value, true);
        return offset + 4;
      }
    };
    Float64_BE = {
      len: 8,
      get(array, offset) {
        return dv(array).getFloat64(offset);
      },
      put(array, offset, value) {
        dv(array).setFloat64(offset, value);
        return offset + 8;
      }
    };
    Float64_LE = {
      len: 8,
      get(array, offset) {
        return dv(array).getFloat64(offset, true);
      },
      put(array, offset, value) {
        dv(array).setFloat64(offset, value, true);
        return offset + 8;
      }
    };
    Float80_BE = {
      len: 10,
      get(array, offset) {
        return ieee754.read(array, offset, false, 63, this.len);
      },
      put(array, offset, value) {
        ieee754.write(array, value, offset, false, 63, this.len);
        return offset + this.len;
      }
    };
    Float80_LE = {
      len: 10,
      get(array, offset) {
        return ieee754.read(array, offset, true, 63, this.len);
      },
      put(array, offset, value) {
        ieee754.write(array, value, offset, true, 63, this.len);
        return offset + this.len;
      }
    };
    IgnoreType = class {
      /**
       * @param len number of bytes to ignore
       */
      constructor(len) {
        this.len = len;
      }
      // ToDo: don't read, but skip data
      get(_array, _off) {
      }
    };
    Uint8ArrayType = class {
      constructor(len) {
        this.len = len;
      }
      get(array, offset) {
        return array.subarray(offset, offset + this.len);
      }
    };
    StringType = class {
      constructor(len, encoding) {
        this.len = len;
        this.encoding = encoding;
      }
      get(data, offset = 0) {
        const bytes = data.subarray(offset, offset + this.len);
        return textDecode(bytes, this.encoding);
      }
    };
    AnsiStringType = class extends StringType {
      constructor(len) {
        super(len, "windows-1252");
      }
    };
  }
});

// node_modules/music-metadata/lib/common/BasicParser.js
var BasicParser;
var init_BasicParser = __esm({
  "node_modules/music-metadata/lib/common/BasicParser.js"() {
    init_Allocation();
    BasicParser = class {
      metadata;
      tokenizer;
      options;
      /**
       * Initialize parser with output (metadata), input (tokenizer) & parsing options (options).
       * @param {INativeMetadataCollector} metadata Output
       * @param {ITokenizer} tokenizer Input
       * @param {IOptions} options Parsing options
       */
      constructor(metadata, tokenizer, options) {
        getMaxMemoryAllocation(options);
        this.metadata = metadata;
        this.tokenizer = tokenizer;
        this.options = options;
      }
      readToken(token, position) {
        return readToken(this.tokenizer, token, this.options, position);
      }
    };
  }
});

// node_modules/uint8array-extras/index.js
function isType(value, typeConstructor, typeStringified) {
  if (!value) {
    return false;
  }
  if (value.constructor === typeConstructor) {
    return true;
  }
  return objectToString.call(value) === typeStringified;
}
function isUint8Array(value) {
  return isType(value, Uint8Array, uint8ArrayStringified);
}
function isArrayBuffer(value) {
  return isType(value, ArrayBuffer, arrayBufferStringified);
}
function isUint8ArrayOrArrayBuffer(value) {
  return isUint8Array(value) || isArrayBuffer(value);
}
function toUint8ArrayIfArrayBuffer(value) {
  return isArrayBuffer(value) ? new Uint8Array(value) : value;
}
function assertUint8ArrayOrArrayBuffer(value) {
  if (!isUint8ArrayOrArrayBuffer(value)) {
    throw new TypeError(`Expected \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof value}\``);
  }
}
function concatUint8Arrays(arrays, totalLength) {
  if (arrays.length === 0) {
    return new Uint8Array(0);
  }
  totalLength ??= arrays.reduce((accumulator, currentValue) => accumulator + currentValue.byteLength, 0);
  const returnValue = new Uint8Array(totalLength);
  let offset = 0;
  for (let array of arrays) {
    assertUint8ArrayOrArrayBuffer(array);
    array = toUint8ArrayIfArrayBuffer(array);
    returnValue.set(array, offset);
    offset += array.length;
  }
  return returnValue;
}
function uint8ArrayToHex(array) {
  assertUint8ArrayOrArrayBuffer(array);
  array = toUint8ArrayIfArrayBuffer(array);
  let hexString = "";
  for (let index = 0; index < array.length; index++) {
    hexString += byteToHexLookupTable[array[index]];
  }
  return hexString;
}
function getUintBE(view) {
  const { byteLength } = view;
  if (byteLength === 6) {
    return view.getUint16(0) * 2 ** 32 + view.getUint32(2);
  }
  if (byteLength === 5) {
    return view.getUint8(0) * 2 ** 32 + view.getUint32(1);
  }
  if (byteLength === 4) {
    return view.getUint32(0);
  }
  if (byteLength === 3) {
    return view.getUint8(0) * 2 ** 16 + view.getUint16(1);
  }
  if (byteLength === 2) {
    return view.getUint16(0);
  }
  if (byteLength === 1) {
    return view.getUint8(0);
  }
}
var objectToString, uint8ArrayStringified, arrayBufferStringified, cachedDecoders, cachedEncoder, byteToHexLookupTable;
var init_uint8array_extras = __esm({
  "node_modules/uint8array-extras/index.js"() {
    objectToString = Object.prototype.toString;
    uint8ArrayStringified = "[object Uint8Array]";
    arrayBufferStringified = "[object ArrayBuffer]";
    cachedDecoders = {
      utf8: new globalThis.TextDecoder("utf8")
    };
    cachedEncoder = new globalThis.TextEncoder();
    byteToHexLookupTable = Array.from({ length: 256 }, (_, index) => index.toString(16).padStart(2, "0"));
  }
});

// node_modules/music-metadata/lib/common/Util.js
function getBit(buf, off, bit) {
  return (buf[off] & 1 << bit) !== 0;
}
function findZero(uint8Array, encoding) {
  const len = uint8Array.length;
  if (encoding === "utf-16le" || encoding === "utf-16be") {
    for (let i = 0; i + 1 < len; i += 2) {
      if (uint8Array[i] === 0 && uint8Array[i + 1] === 0) {
        return i;
      }
    }
    return len;
  }
  for (let i = 0; i < len; i++) {
    if (uint8Array[i] === 0) {
      return i;
    }
  }
  return len;
}
function trimRightNull(x) {
  const pos0 = x.indexOf("\0");
  return pos0 === -1 ? x : x.substring(0, pos0);
}
function splitText(text, separator, context, validateCount, { keepEmpty = false } = {}) {
  if (separator.length === 0) {
    throw new RangeError("Text separator must not be empty");
  }
  let count = 0;
  let start = 0;
  for (let end = text.indexOf(separator); end >= 0; end = text.indexOf(separator, start)) {
    if (keepEmpty || end > start) {
      ++count;
    }
    start = end + separator.length;
  }
  if (keepEmpty || start < text.length) {
    ++count;
  }
  validateCount(Math.max(count, 1), context);
  const values = [];
  start = 0;
  for (let end = text.indexOf(separator); end >= 0; end = text.indexOf(separator, start)) {
    if (keepEmpty || end > start) {
      values.push(text.slice(start, end));
    }
    start = end + separator.length;
  }
  if (keepEmpty || start < text.length) {
    values.push(text.slice(start));
  } else if (values.length === 0) {
    values.push("");
  }
  return values;
}
function swapBytes(uint8Array) {
  const l = uint8Array.length;
  if ((l & 1) !== 0) {
    throw new FieldDecodingError("Buffer length must be even");
  }
  for (let i = 0; i < l; i += 2) {
    const a = uint8Array[i];
    uint8Array[i] = uint8Array[i + 1];
    uint8Array[i + 1] = a;
  }
  return uint8Array;
}
function decodeString(uint8Array, encoding) {
  if (uint8Array[0] === 255 && uint8Array[1] === 254) {
    return decodeString(uint8Array.subarray(2), encoding);
  }
  if (encoding === "utf-16le" && uint8Array[0] === 254 && uint8Array[1] === 255) {
    if ((uint8Array.length & 1) !== 0) {
      throw new FieldDecodingError("Expected even number of octets for 16-bit unicode string");
    }
    return decodeString(swapBytes(uint8Array), encoding);
  }
  if (encoding === "utf-16be") {
    if ((uint8Array.length & 1) !== 0) {
      throw new FieldDecodingError("Expected even number of octets for 16-bit unicode string");
    }
    return new StringType(uint8Array.length, "utf-16le").get(swapBytes(Uint8Array.from(uint8Array)), 0);
  }
  return new StringType(uint8Array.length, encoding).get(uint8Array, 0);
}
function stripNulls(str) {
  str = str.replace(/^\x00+/g, "");
  str = str.replace(/\x00+$/g, "");
  return str;
}
function getBitAllignedNumber(source, byteOffset, bitOffset, len) {
  const byteOff = byteOffset + ~~(bitOffset / 8);
  const bitOff = bitOffset % 8;
  const value = source[byteOff] & 255 >> bitOff;
  const bitsLeft = len + bitOff - 8;
  if (bitsLeft <= 0) {
    return value >> -bitsLeft;
  }
  return value << bitsLeft | getBitAllignedNumber(source, byteOff + 1, 0, bitsLeft);
}
function isBitSet(source, byteOffset, bitOffset) {
  return getBitAllignedNumber(source, byteOffset, bitOffset, 1) === 1;
}
function a2hex(str) {
  const arr = [];
  for (let i = 0, l = str.length; i < l; i++) {
    const hex = Number(str.charCodeAt(i)).toString(16);
    arr.push(hex.length === 1 ? `0${hex}` : hex);
  }
  return arr.join(" ");
}
function ratioToDb(ratio) {
  return 10 * Math.log10(ratio);
}
function dbToRatio(dB) {
  return 10 ** (dB / 10);
}
function toRatio(value) {
  const ps = value.split(" ", 2).map((p) => p.trim().toLowerCase());
  if (ps.length >= 1) {
    const v = Number.parseFloat(ps[0]);
    return ps.length === 2 && ps[1] === "db" ? {
      dB: v,
      ratio: dbToRatio(v)
    } : {
      dB: ratioToDb(v),
      ratio: v
    };
  }
}
function decodeUintBE(uint8Array) {
  if (uint8Array.length === 0) {
    throw new Error("decodeUintBE: empty Uint8Array");
  }
  const view = new DataView(uint8Array.buffer, uint8Array.byteOffset, uint8Array.byteLength);
  return getUintBE(view);
}
var init_Util = __esm({
  "node_modules/music-metadata/lib/common/Util.js"() {
    init_lib3();
    init_uint8array_extras();
    init_ParseError();
  }
});

// node_modules/music-metadata/lib/common/FourCC.js
var validFourCC, FourCcToken;
var init_FourCC = __esm({
  "node_modules/music-metadata/lib/common/FourCC.js"() {
    init_lib2();
    init_ParseError();
    init_Util();
    validFourCC = /^[\x21-\x7e©][\x20-\x7e\x00()]{3}/;
    FourCcToken = {
      len: 4,
      get: (buf, off) => {
        const id = textDecode(buf.subarray(off, off + FourCcToken.len), "latin1");
        if (!id.match(validFourCC)) {
          throw new FieldDecodingError(`FourCC contains invalid characters: ${a2hex(id)} "${id}"`);
        }
        return id;
      },
      put: (buffer, offset, id) => {
        const str = textEncode(id, "latin1");
        if (str.length !== 4) {
          throw new InternalParserError("Invalid length");
        }
        buffer.set(str, offset);
        return offset + 4;
      }
    };
  }
});

// node_modules/music-metadata/lib/apev2/APEv2Token.js
function parseTagFlags(flags) {
  return {
    containsHeader: isBitSet2(flags, 31),
    containsFooter: isBitSet2(flags, 30),
    isHeader: isBitSet2(flags, 29),
    readOnly: isBitSet2(flags, 0),
    dataType: (flags & 6) >> 1
  };
}
function isBitSet2(num, bit) {
  return (num & 1 << bit) !== 0;
}
var DataType, DescriptorParser, Header, TagFooter, TagItemHeader;
var init_APEv2Token = __esm({
  "node_modules/music-metadata/lib/apev2/APEv2Token.js"() {
    init_lib3();
    init_FourCC();
    DataType = {
      text_utf8: 0,
      binary: 1,
      external_info: 2,
      reserved: 3
    };
    DescriptorParser = {
      len: 52,
      get: (buf, off) => {
        return {
          // should equal 'MAC '
          ID: FourCcToken.get(buf, off),
          // versionIndex number * 1000 (3.81 = 3810) (remember that 4-byte alignment causes this to take 4-bytes)
          version: UINT32_LE.get(buf, off + 4) / 1e3,
          // the number of descriptor bytes (allows later expansion of this header)
          descriptorBytes: UINT32_LE.get(buf, off + 8),
          // the number of header APE_HEADER bytes
          headerBytes: UINT32_LE.get(buf, off + 12),
          // the number of header APE_HEADER bytes
          seekTableBytes: UINT32_LE.get(buf, off + 16),
          // the number of header data bytes (from original file)
          headerDataBytes: UINT32_LE.get(buf, off + 20),
          // the number of bytes of APE frame data
          apeFrameDataBytes: UINT32_LE.get(buf, off + 24),
          // the high order number of APE frame data bytes
          apeFrameDataBytesHigh: UINT32_LE.get(buf, off + 28),
          // the terminating data of the file (not including tag data)
          terminatingDataBytes: UINT32_LE.get(buf, off + 32),
          // the MD5 hash of the file (see notes for usage... it's a little tricky)
          fileMD5: new Uint8ArrayType(16).get(buf, off + 36)
        };
      }
    };
    Header = {
      len: 24,
      get: (buf, off) => {
        return {
          // the compression level (see defines I.E. COMPRESSION_LEVEL_FAST)
          compressionLevel: UINT16_LE.get(buf, off),
          // any format flags (for future use)
          formatFlags: UINT16_LE.get(buf, off + 2),
          // the number of audio blocks in one frame
          blocksPerFrame: UINT32_LE.get(buf, off + 4),
          // the number of audio blocks in the final frame
          finalFrameBlocks: UINT32_LE.get(buf, off + 8),
          // the total number of frames
          totalFrames: UINT32_LE.get(buf, off + 12),
          // the bits per sample (typically 16)
          bitsPerSample: UINT16_LE.get(buf, off + 16),
          // the number of channels (1 or 2)
          channel: UINT16_LE.get(buf, off + 18),
          // the sample rate (typically 44100)
          sampleRate: UINT32_LE.get(buf, off + 20)
        };
      }
    };
    TagFooter = {
      len: 32,
      get: (buf, off) => {
        return {
          // should equal 'APETAGEX'
          ID: new StringType(8, "ascii").get(buf, off),
          // equals CURRENT_APE_TAG_VERSION
          version: UINT32_LE.get(buf, off + 8),
          // the complete size of the tag, including this footer (excludes header)
          size: UINT32_LE.get(buf, off + 12),
          // the number of fields in the tag
          fields: UINT32_LE.get(buf, off + 16),
          // reserved for later use (must be zero),
          flags: parseTagFlags(UINT32_LE.get(buf, off + 20))
        };
      }
    };
    TagItemHeader = {
      len: 8,
      get: (buf, off) => {
        return {
          // Length of assigned value in bytes
          size: UINT32_LE.get(buf, off),
          // reserved for later use (must be zero),
          flags: parseTagFlags(UINT32_LE.get(buf, off + 4))
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/apev2/APEv2Parser.js
var APEv2Parser_exports = {};
__export(APEv2Parser_exports, {
  APEv2Parser: () => APEv2Parser,
  ApeContentError: () => ApeContentError,
  tryParseApeHeader: () => tryParseApeHeader
});
function tryParseApeHeader(metadata, tokenizer, options) {
  const apeParser = new APEv2Parser(metadata, tokenizer, options);
  return apeParser.tryParseApeHeader();
}
var import_debug, debug, tagFormat, preamble, ApeContentError, APEv2Parser;
var init_APEv2Parser = __esm({
  "node_modules/music-metadata/lib/apev2/APEv2Parser.js"() {
    init_lib2();
    import_debug = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_Allocation();
    init_BasicParser();
    init_Util();
    init_ParseError();
    init_APEv2Token();
    debug = (0, import_debug.default)("music-metadata:parser:APEv2");
    tagFormat = "APEv2";
    preamble = "APETAGEX";
    ApeContentError = class extends makeUnexpectedFileContentError("APEv2") {
    };
    APEv2Parser = class _APEv2Parser extends BasicParser {
      /**
       * Calculate the media file duration
       * @param ah ApeHeader
       * @return {number} duration in seconds
       */
      static calculateDuration(ah) {
        let duration = ah.totalFrames > 1 ? ah.blocksPerFrame * (ah.totalFrames - 1) : 0;
        duration += ah.finalFrameBlocks;
        return duration / ah.sampleRate;
      }
      /**
       * Calculates the APEv1 / APEv2 first field offset
       * @param tokenizer
       * @param offset
       */
      static async findApeFooterOffset(tokenizer, offset) {
        const apeBuf = new Uint8Array(TagFooter.len);
        const position = tokenizer.position;
        if (offset <= TagFooter.len) {
          debug(`Offset is too small to read APE footer: offset=${offset}`);
          return void 0;
        }
        if (offset > TagFooter.len) {
          await tokenizer.readBuffer(apeBuf, { position: offset - TagFooter.len });
          tokenizer.setPosition(position);
          const tagFooter = TagFooter.get(apeBuf, 0);
          if (tagFooter.ID === "APETAGEX") {
            if (tagFooter.flags.isHeader) {
              debug(`APE Header found at offset=${offset - TagFooter.len}`);
            } else {
              debug(`APE Footer found at offset=${offset - TagFooter.len}`);
              offset -= tagFooter.size;
            }
            return { footer: tagFooter, offset };
          }
        }
      }
      static parseTagFooter(metadata, buffer, options) {
        const footer = TagFooter.get(buffer, buffer.length - TagFooter.len);
        if (footer.ID !== preamble) {
          throw new ApeContentError("Unexpected APEv2 Footer ID preamble value");
        }
        const apeParser = new _APEv2Parser(metadata, fromBuffer(buffer, getTokenizerOptions(options)), options);
        return apeParser.parseTags(footer);
      }
      ape = {};
      /**
       * Parse APEv1 / APEv2 header if header signature found
       */
      async tryParseApeHeader() {
        if (this.tokenizer.fileInfo.size && this.tokenizer.fileInfo.size - this.tokenizer.position < TagFooter.len) {
          debug("No APEv2 header found, end-of-file reached");
          return;
        }
        const footer = await this.tokenizer.peekToken(TagFooter);
        if (footer.ID === preamble) {
          await this.tokenizer.ignore(TagFooter.len);
          return this.parseTags(footer);
        }
        debug(`APEv2 header not found at offset=${this.tokenizer.position}`);
        if (this.tokenizer.fileInfo.size) {
          const remaining = this.tokenizer.fileInfo.size - this.tokenizer.position;
          const buffer = await this.readTagValue(remaining);
          return _APEv2Parser.parseTagFooter(this.metadata, buffer, this.options);
        }
      }
      async parse() {
        const descriptor = await this.tokenizer.readToken(DescriptorParser);
        if (descriptor.ID !== "MAC ") {
          throw new ApeContentError("Unexpected descriptor ID");
        }
        this.ape.descriptor = descriptor;
        const lenExp = descriptor.descriptorBytes - DescriptorParser.len;
        const header = await (lenExp > 0 ? this.parseDescriptorExpansion(lenExp) : this.parseHeader());
        this.metadata.setAudioOnly();
        await this.tokenizer.ignore(header.forwardBytes);
        return this.tryParseApeHeader();
      }
      async parseTags(footer) {
        if (footer.fields > getMaxMetadataEntries(this.options)) {
          throw new ApeContentError(`Tag item count ${footer.fields} exceeds entry limit ${getMaxMetadataEntries(this.options)}`);
        }
        const keyBuffer = new Uint8Array(256);
        let bytesRemaining = footer.size - TagFooter.len;
        debug(`Parse APE tags at offset=${this.tokenizer.position}, size=${bytesRemaining}`);
        for (let i = 0; i < footer.fields; i++) {
          if (bytesRemaining < TagItemHeader.len) {
            this.metadata.addWarning(`APEv2 Tag-header: ${footer.fields - i} items remaining, but no more tag data to read.`);
            break;
          }
          const tagItemHeader = await this.tokenizer.readToken(TagItemHeader);
          bytesRemaining -= TagItemHeader.len;
          if (tagItemHeader.size >= bytesRemaining) {
            throw new ApeContentError(`Invalid tag item size: ${tagItemHeader.size}`);
          }
          const keyBytes = await this.tokenizer.peekBuffer(keyBuffer, {
            length: Math.min(keyBuffer.length, bytesRemaining - tagItemHeader.size),
            mayBeLess: true
          });
          let zero = keyBuffer.subarray(0, keyBytes).indexOf(0);
          if (zero === -1) {
            throw new ApeContentError("Unterminated tag item key");
          }
          const key = await this.tokenizer.readToken(new StringType(zero, "ascii"));
          await this.tokenizer.ignore(1);
          bytesRemaining -= key.length + 1;
          if (this.tokenizer.fileInfo.size !== void 0 && tagItemHeader.size > this.tokenizer.fileInfo.size - this.tokenizer.position) {
            throw new ApeContentError(`Invalid tag item size: ${tagItemHeader.size}`);
          }
          bytesRemaining -= tagItemHeader.size;
          switch (tagItemHeader.flags.dataType) {
            case DataType.text_utf8: {
              const value = textDecode(await this.readTagValue(tagItemHeader.size), "utf-8");
              let valueCount = 1;
              for (let offset = value.indexOf("\0"); offset >= 0; offset = value.indexOf("\0", offset + 1)) {
                ++valueCount;
              }
              if (valueCount > getMaxMetadataEntries(this.options)) {
                throw new ApeContentError(`Text value count ${valueCount} exceeds entry limit ${getMaxMetadataEntries(this.options)}`);
              }
              const values = value.split(/\x00/g);
              await Promise.all(values.map((val) => this.metadata.addTag(tagFormat, key, val)));
              break;
            }
            case DataType.binary:
              if (this.options.skipCovers) {
                await this.tokenizer.ignore(tagItemHeader.size);
              } else {
                const picData = await this.readTagValue(tagItemHeader.size);
                zero = findZero(picData);
                const description = textDecode(picData.subarray(0, zero), "utf-8");
                const data = picData.subarray(zero + 1);
                await this.metadata.addTag(tagFormat, key, {
                  description,
                  data
                });
              }
              break;
            case DataType.external_info:
              debug(`Ignore external info ${key}`);
              await this.tokenizer.ignore(tagItemHeader.size);
              break;
            case DataType.reserved:
              debug(`Ignore external info ${key}`);
              this.metadata.addWarning(`APEv2 header declares a reserved datatype for "${key}"`);
              await this.tokenizer.ignore(tagItemHeader.size);
              break;
          }
        }
      }
      async readTagValue(size) {
        return readBuffer(this.tokenizer, size, this.options, void 0, (message) => new ApeContentError(message));
      }
      async parseDescriptorExpansion(lenExp) {
        await this.tokenizer.ignore(lenExp);
        return this.parseHeader();
      }
      async parseHeader() {
        const header = await this.tokenizer.readToken(Header);
        this.metadata.setFormat("lossless", true);
        this.metadata.setFormat("container", "Monkey's Audio");
        this.metadata.setFormat("codec", "Monkey's Audio");
        this.metadata.setFormat("bitsPerSample", header.bitsPerSample);
        this.metadata.setFormat("sampleRate", header.sampleRate);
        this.metadata.setFormat("numberOfChannels", header.channel);
        this.metadata.setFormat("duration", _APEv2Parser.calculateDuration(header));
        if (!this.ape.descriptor) {
          throw new ApeContentError("Missing APE descriptor");
        }
        return {
          forwardBytes: this.ape.descriptor.seekTableBytes + this.ape.descriptor.headerDataBytes + this.ape.descriptor.apeFrameDataBytes + this.ape.descriptor.terminatingDataBytes
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/id3v1/ID3v1Parser.js
async function hasID3v1Header(tokenizer) {
  if (tokenizer.fileInfo.size >= 128) {
    const tag = new Uint8Array(3);
    const position = tokenizer.position;
    await tokenizer.readBuffer(tag, { position: tokenizer.fileInfo.size - 128 });
    tokenizer.setPosition(position);
    return textDecode(tag, "latin1") === "TAG";
  }
  return false;
}
var import_debug2, debug2, Genres, Iid3v1Token, Id3v1StringType, ID3v1Parser;
var init_ID3v1Parser = __esm({
  "node_modules/music-metadata/lib/id3v1/ID3v1Parser.js"() {
    init_lib2();
    import_debug2 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_APEv2Parser();
    init_BasicParser();
    init_Util();
    debug2 = (0, import_debug2.default)("music-metadata:parser:ID3v1");
    Genres = [
      "Blues",
      "Classic Rock",
      "Country",
      "Dance",
      "Disco",
      "Funk",
      "Grunge",
      "Hip-Hop",
      "Jazz",
      "Metal",
      "New Age",
      "Oldies",
      "Other",
      "Pop",
      "R&B",
      "Rap",
      "Reggae",
      "Rock",
      "Techno",
      "Industrial",
      "Alternative",
      "Ska",
      "Death Metal",
      "Pranks",
      "Soundtrack",
      "Euro-Techno",
      "Ambient",
      "Trip-Hop",
      "Vocal",
      "Jazz+Funk",
      "Fusion",
      "Trance",
      "Classical",
      "Instrumental",
      "Acid",
      "House",
      "Game",
      "Sound Clip",
      "Gospel",
      "Noise",
      "Alt. Rock",
      "Bass",
      "Soul",
      "Punk",
      "Space",
      "Meditative",
      "Instrumental Pop",
      "Instrumental Rock",
      "Ethnic",
      "Gothic",
      "Darkwave",
      "Techno-Industrial",
      "Electronic",
      "Pop-Folk",
      "Eurodance",
      "Dream",
      "Southern Rock",
      "Comedy",
      "Cult",
      "Gangsta Rap",
      "Top 40",
      "Christian Rap",
      "Pop/Funk",
      "Jungle",
      "Native American",
      "Cabaret",
      "New Wave",
      "Psychedelic",
      "Rave",
      "Showtunes",
      "Trailer",
      "Lo-Fi",
      "Tribal",
      "Acid Punk",
      "Acid Jazz",
      "Polka",
      "Retro",
      "Musical",
      "Rock & Roll",
      "Hard Rock",
      "Folk",
      "Folk/Rock",
      "National Folk",
      "Swing",
      "Fast-Fusion",
      "Bebob",
      "Latin",
      "Revival",
      "Celtic",
      "Bluegrass",
      "Avantgarde",
      "Gothic Rock",
      "Progressive Rock",
      "Psychedelic Rock",
      "Symphonic Rock",
      "Slow Rock",
      "Big Band",
      "Chorus",
      "Easy Listening",
      "Acoustic",
      "Humour",
      "Speech",
      "Chanson",
      "Opera",
      "Chamber Music",
      "Sonata",
      "Symphony",
      "Booty Bass",
      "Primus",
      "Porn Groove",
      "Satire",
      "Slow Jam",
      "Club",
      "Tango",
      "Samba",
      "Folklore",
      "Ballad",
      "Power Ballad",
      "Rhythmic Soul",
      "Freestyle",
      "Duet",
      "Punk Rock",
      "Drum Solo",
      "A Cappella",
      "Euro-House",
      "Dance Hall",
      "Goa",
      "Drum & Bass",
      "Club-House",
      "Hardcore",
      "Terror",
      "Indie",
      "BritPop",
      "Negerpunk",
      "Polsk Punk",
      "Beat",
      "Christian Gangsta Rap",
      "Heavy Metal",
      "Black Metal",
      "Crossover",
      "Contemporary Christian",
      "Christian Rock",
      "Merengue",
      "Salsa",
      "Thrash Metal",
      "Anime",
      "JPop",
      "Synthpop",
      "Abstract",
      "Art Rock",
      "Baroque",
      "Bhangra",
      "Big Beat",
      "Breakbeat",
      "Chillout",
      "Downtempo",
      "Dub",
      "EBM",
      "Eclectic",
      "Electro",
      "Electroclash",
      "Emo",
      "Experimental",
      "Garage",
      "Global",
      "IDM",
      "Illbient",
      "Industro-Goth",
      "Jam Band",
      "Krautrock",
      "Leftfield",
      "Lounge",
      "Math Rock",
      "New Romantic",
      "Nu-Breakz",
      "Post-Punk",
      "Post-Rock",
      "Psytrance",
      "Shoegaze",
      "Space Rock",
      "Trop Rock",
      "World Music",
      "Neoclassical",
      "Audiobook",
      "Audio Theatre",
      "Neue Deutsche Welle",
      "Podcast",
      "Indie Rock",
      "G-Funk",
      "Dubstep",
      "Garage Rock",
      "Psybient"
    ];
    Iid3v1Token = {
      len: 128,
      /**
       * @param buf Buffer possibly holding the 128-byte ID3v1/1.1 metadata header
       * @param off Offset in buffer in bytes
       * @returns ID3v1/1.1 header if the first 3 bytes equal 'TAG', otherwise null is returned
       */
      get: (buf, off) => {
        const header = new Id3v1StringType(3).get(buf, off);
        if (header !== "TAG") {
          return null;
        }
        const zeroByte = UINT8.get(buf, off + 125);
        const track = UINT8.get(buf, off + 126);
        const hasTrack = zeroByte === 0 && track !== 0;
        return {
          header,
          title: new Id3v1StringType(30).get(buf, off + 3),
          artist: new Id3v1StringType(30).get(buf, off + 33),
          album: new Id3v1StringType(30).get(buf, off + 63),
          year: new Id3v1StringType(4).get(buf, off + 93),
          comment: new Id3v1StringType(hasTrack ? 28 : 30).get(buf, off + 97),
          track: hasTrack ? track : void 0,
          genre: UINT8.get(buf, off + 127)
        };
      }
    };
    Id3v1StringType = class {
      len;
      stringType;
      constructor(len) {
        this.len = len;
        this.stringType = new StringType(len, "latin1");
      }
      get(buf, off) {
        let value = this.stringType.get(buf, off);
        value = trimRightNull(value);
        value = value.trim();
        return value.length > 0 ? value : void 0;
      }
    };
    ID3v1Parser = class _ID3v1Parser extends BasicParser {
      apeHeader;
      constructor(metadata, tokenizer, options) {
        super(metadata, tokenizer, options);
        this.apeHeader = options.apeHeader;
      }
      static getGenre(genreIndex) {
        if (genreIndex < Genres.length) {
          return Genres[genreIndex];
        }
        return void 0;
      }
      async parse() {
        if (!this.tokenizer.fileInfo.size) {
          debug2("Skip checking for ID3v1 because the file-size is unknown");
          return;
        }
        if (this.apeHeader && isRandomAccessTokenizer(this.tokenizer)) {
          this.tokenizer.setPosition(this.apeHeader.offset);
          const apeParser = new APEv2Parser(this.metadata, this.tokenizer, this.options);
          await apeParser.parseTags(this.apeHeader.footer);
        }
        const offset = this.tokenizer.fileInfo.size - Iid3v1Token.len;
        if (this.tokenizer.position > offset) {
          debug2("Already consumed the last 128 bytes");
          return;
        }
        const header = await this.tokenizer.readToken(Iid3v1Token, offset);
        if (header) {
          debug2("ID3v1 header found at: pos=%s", this.tokenizer.fileInfo.size - Iid3v1Token.len);
          const props = ["title", "artist", "album", "comment", "track", "year"];
          for (const id of props) {
            if (header[id] && header[id] !== "") {
              await this.addTag(id, header[id]);
            }
          }
          const genre = _ID3v1Parser.getGenre(header.genre);
          if (genre) {
            await this.addTag("genre", genre);
          }
        } else {
          debug2("ID3v1 header not found at: pos=%s", this.tokenizer.fileInfo.size - Iid3v1Token.len);
        }
      }
      async addTag(id, value) {
        await this.metadata.addTag("ID3v1", id, value);
      }
    };
  }
});

// node_modules/music-metadata/lib/lyrics3/Lyrics3.js
async function getLyricsHeaderLength(tokenizer) {
  const fileSize = tokenizer.fileInfo.size;
  if (fileSize >= 143) {
    const buf = new Uint8Array(15);
    const position = tokenizer.position;
    await tokenizer.readBuffer(buf, { position: fileSize - 143 });
    tokenizer.setPosition(position);
    const txt = textDecode(buf, "latin1");
    const tag = txt.substring(6);
    if (tag === endTag2) {
      return Number.parseInt(txt.substring(0, 6), 10) + 15;
    }
  }
  return 0;
}
var endTag2;
var init_Lyrics3 = __esm({
  "node_modules/music-metadata/lib/lyrics3/Lyrics3.js"() {
    init_lib2();
    endTag2 = "LYRICS200";
  }
});

// node_modules/content-type/dist/index.js
function parse(header, options) {
  const stopFlags = SEMI_FLAG | (options?.comma === true ? COMMA_FLAG : 0);
  const len = header.length;
  let valueStart = options?.start ?? 0;
  while ((CHAR_MAP[header.charCodeAt(valueStart)] & OWS) !== 0) {
    valueStart++;
  }
  let index = valueStart;
  let typeFlags = 0;
  let whitespace = -1;
  let stop = options?.parameters === false ? COMMA_FLAG : 0;
  while (index < len) {
    const code = header.charCodeAt(index);
    const flags = CHAR_MAP[code];
    if ((flags & stopFlags) !== 0) {
      stop |= flags & COMMA_FLAG;
      break;
    }
    if ((flags & OWS) !== 0) {
      if (whitespace === -1)
        whitespace = index;
    } else {
      whitespace = -1;
    }
    typeFlags |= code & NON_ASCII | flags;
    index++;
  }
  const valueEnd = whitespace === -1 ? index : whitespace;
  const value = header.slice(valueStart, valueEnd);
  const type = (typeFlags & CASE_FLAGS) === 0 ? value : value.toLowerCase();
  if (index === len || stop !== 0) {
    return { type, index, parameters: new NullObject() };
  }
  return parseParameters(header, type, index, len, stopFlags);
}
function parseParameters(header, type, index, len, stopFlags) {
  const parameters = new NullObject();
  parameter: while (index < len) {
    index++;
    while ((CHAR_MAP[header.charCodeAt(index)] & OWS) !== 0) {
      index++;
    }
    const keyStart = index;
    let keyFlags = 0;
    let keyWhitespace = -1;
    while (index < len) {
      const code = header.charCodeAt(index);
      const flags = CHAR_MAP[code];
      if ((flags & stopFlags) !== 0) {
        if ((flags & COMMA_FLAG) !== 0)
          break parameter;
        continue parameter;
      }
      if (code === EQ) {
        const keyEnd = keyWhitespace === -1 ? index : keyWhitespace;
        const value = header.slice(keyStart, keyEnd);
        const key = (keyFlags & CASE_FLAGS) === 0 ? value : value.toLowerCase();
        index++;
        while ((CHAR_MAP[header.charCodeAt(index)] & OWS) !== 0) {
          index++;
        }
        if (index < len && header.charCodeAt(index) === DQUOTE) {
          const quotedStart = ++index;
          let escaped = false;
          while (index < len) {
            const code2 = header.charCodeAt(index);
            if (code2 === DQUOTE) {
              if (parameters[key] === void 0) {
                parameters[key] = escaped ? unescapeQuotedPairs(header, quotedStart, index) : header.slice(quotedStart, index);
              }
              index++;
              let stop2 = 0;
              while (index < len) {
                const code3 = header.charCodeAt(index);
                const flags2 = CHAR_MAP[code3];
                if ((flags2 & stopFlags) !== 0) {
                  stop2 = flags2 & COMMA_FLAG;
                  break;
                }
                index++;
              }
              if (stop2 !== 0)
                break parameter;
              continue parameter;
            }
            if (code2 === BSLASH && index + 1 < len) {
              escaped = true;
              index += 2;
              continue;
            }
            index++;
          }
          continue parameter;
        }
        const valueStart = index;
        let stop = 0;
        let valueWhitespace = -1;
        while (index < len) {
          const code2 = header.charCodeAt(index);
          const flags2 = CHAR_MAP[code2];
          if ((flags2 & stopFlags) !== 0) {
            stop = flags2 & COMMA_FLAG;
            break;
          }
          if ((flags2 & OWS) !== 0) {
            if (valueWhitespace === -1)
              valueWhitespace = index;
          } else {
            valueWhitespace = -1;
          }
          index++;
        }
        if (parameters[key] === void 0) {
          const valueEnd = valueWhitespace === -1 ? index : valueWhitespace;
          parameters[key] = header.slice(valueStart, valueEnd);
        }
        if (stop !== 0)
          break parameter;
        continue parameter;
      }
      if ((flags & OWS) !== 0) {
        if (keyWhitespace === -1)
          keyWhitespace = index;
      } else {
        keyWhitespace = -1;
      }
      keyFlags |= code & NON_ASCII | flags;
      index++;
    }
  }
  return { type, index, parameters };
}
function unescapeQuotedPairs(str, start, end) {
  let result = "";
  for (let index = start; index < end; index++) {
    if (str.charCodeAt(index) === BSLASH) {
      result += str.slice(start, index);
      start = ++index;
    }
  }
  return result + str.slice(start, end);
}
var SP, HTAB, SEMI, EQ, DQUOTE, BSLASH, COMMA, LOWER_CASE, OWS, SEMI_FLAG, COMMA_FLAG, TOKEN_FLAG, NON_ASCII, CASE_FLAGS, CHAR_MAP, NullObject;
var init_dist = __esm({
  "node_modules/content-type/dist/index.js"() {
    SP = 32;
    HTAB = 9;
    SEMI = 59;
    EQ = 61;
    DQUOTE = 34;
    BSLASH = 92;
    COMMA = 44;
    LOWER_CASE = 1;
    OWS = 2;
    SEMI_FLAG = 4;
    COMMA_FLAG = 8;
    TOKEN_FLAG = 16;
    NON_ASCII = 65280;
    CASE_FLAGS = LOWER_CASE | NON_ASCII;
    CHAR_MAP = new Uint8Array(256);
    CHAR_MAP[HTAB] |= OWS;
    CHAR_MAP[SP] |= OWS;
    CHAR_MAP[SEMI] |= SEMI_FLAG;
    CHAR_MAP[COMMA] |= COMMA_FLAG;
    for (let code = 128; code <= 255; code++) {
      CHAR_MAP[code] |= LOWER_CASE;
    }
    for (const char of "!#$%&'*+-.^_`|~") {
      CHAR_MAP[char.charCodeAt(0)] |= TOKEN_FLAG;
    }
    for (let code = 48; code <= 57; code++) {
      CHAR_MAP[code] |= TOKEN_FLAG;
    }
    for (let code = 65; code <= 90; code++) {
      CHAR_MAP[code] |= LOWER_CASE | TOKEN_FLAG;
    }
    for (let code = 97; code <= 122; code++) {
      CHAR_MAP[code] |= TOKEN_FLAG;
    }
    NullObject = /* @__PURE__ */ (() => {
      const C = function() {
      };
      C.prototype = /* @__PURE__ */ Object.create(null);
      return C;
    })();
  }
});

// node_modules/@tokenizer/inflate/lib/GzipHandler.js
var GzipHandler;
var init_GzipHandler = __esm({
  "node_modules/@tokenizer/inflate/lib/GzipHandler.js"() {
    GzipHandler = class {
      constructor(tokenizer) {
        this.tokenizer = tokenizer;
      }
      inflate() {
        const tokenizer = this.tokenizer;
        return new ReadableStream({
          async pull(controller) {
            const buffer = new Uint8Array(1024);
            const size = await tokenizer.readBuffer(buffer, { mayBeLess: true });
            if (size === 0) {
              controller.close();
              return;
            }
            controller.enqueue(buffer.subarray(0, size));
          }
        }).pipeThrough(new DecompressionStream("gzip"));
      }
    };
  }
});

// node_modules/@tokenizer/inflate/lib/ZipLimitError.js
var ZipLimitError;
var init_ZipLimitError = __esm({
  "node_modules/@tokenizer/inflate/lib/ZipLimitError.js"() {
    ZipLimitError = class extends RangeError {
      constructor(limit, requestedSize, maxSize) {
        super(`ZIP ${limit} exceeded: ${requestedSize} bytes exceeds limit of ${maxSize} bytes`);
        this.limit = limit;
        this.requestedSize = requestedSize;
        this.maxSize = maxSize;
        this.name = "ZipLimitError";
      }
    };
  }
});

// node_modules/@tokenizer/inflate/lib/ZipToken.js
var Signature, DataDescriptor, LocalFileHeaderToken, EndOfCentralDirectoryRecordToken, FileHeader;
var init_ZipToken = __esm({
  "node_modules/@tokenizer/inflate/lib/ZipToken.js"() {
    init_lib3();
    Signature = {
      LocalFileHeader: 67324752,
      DataDescriptor: 134695760,
      CentralFileHeader: 33639248,
      EndOfCentralDirectory: 101010256
    };
    DataDescriptor = {
      get(array) {
        return {
          signature: UINT32_LE.get(array, 0),
          compressedSize: UINT32_LE.get(array, 8),
          uncompressedSize: UINT32_LE.get(array, 12)
        };
      },
      len: 16
    };
    LocalFileHeaderToken = {
      get(array) {
        const flags = UINT16_LE.get(array, 6);
        return {
          signature: UINT32_LE.get(array, 0),
          minVersion: UINT16_LE.get(array, 4),
          dataDescriptor: !!(flags & 8),
          compressedMethod: UINT16_LE.get(array, 8),
          compressedSize: UINT32_LE.get(array, 18),
          uncompressedSize: UINT32_LE.get(array, 22),
          filenameLength: UINT16_LE.get(array, 26),
          extraFieldLength: UINT16_LE.get(array, 28),
          filename: null
        };
      },
      len: 30
    };
    EndOfCentralDirectoryRecordToken = {
      get(array) {
        return {
          signature: UINT32_LE.get(array, 0),
          nrOfThisDisk: UINT16_LE.get(array, 4),
          nrOfThisDiskWithTheStart: UINT16_LE.get(array, 6),
          nrOfEntriesOnThisDisk: UINT16_LE.get(array, 8),
          nrOfEntriesOfSize: UINT16_LE.get(array, 10),
          sizeOfCd: UINT32_LE.get(array, 12),
          offsetOfStartOfCd: UINT32_LE.get(array, 16),
          zipFileCommentLength: UINT16_LE.get(array, 20)
        };
      },
      len: 22
    };
    FileHeader = {
      get(array) {
        const flags = UINT16_LE.get(array, 8);
        return {
          signature: UINT32_LE.get(array, 0),
          minVersion: UINT16_LE.get(array, 6),
          dataDescriptor: !!(flags & 8),
          compressedMethod: UINT16_LE.get(array, 10),
          compressedSize: UINT32_LE.get(array, 20),
          uncompressedSize: UINT32_LE.get(array, 24),
          filenameLength: UINT16_LE.get(array, 28),
          extraFieldLength: UINT16_LE.get(array, 30),
          fileCommentLength: UINT16_LE.get(array, 32),
          relativeOffsetOfLocalHeader: UINT32_LE.get(array, 42),
          filename: null
        };
      },
      len: 46
    };
  }
});

// node_modules/@tokenizer/inflate/lib/ZipHandler.js
function signatureToArray(signature) {
  const signatureBytes = new Uint8Array(UINT32_LE.len);
  UINT32_LE.put(signatureBytes, 0, signature);
  return signatureBytes;
}
function indexOf(buffer, portion) {
  const bufferLength = buffer.length;
  const portionLength = portion.length;
  if (portionLength > bufferLength) {
    return -1;
  }
  for (let i = 0; i <= bufferLength - portionLength; i++) {
    let found = true;
    for (let j = 0; j < portionLength; j++) {
      if (buffer[i + j] !== portion[j]) {
        found = false;
        break;
      }
    }
    if (found) {
      return i;
    }
  }
  return -1;
}
function mergeArrays(chunks) {
  const totalLength = chunks.reduce((acc, curr) => acc + curr.length, 0);
  const mergedArray = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    mergedArray.set(chunk, offset);
    offset += chunk.length;
  }
  return mergedArray;
}
var import_debug3, debug3, syncBufferSize, ddSignatureArray, eocdSignatureBytes, ZipHandler;
var init_ZipHandler = __esm({
  "node_modules/@tokenizer/inflate/lib/ZipHandler.js"() {
    import_debug3 = __toESM(require_src(), 1);
    init_core();
    init_lib3();
    init_ZipLimitError();
    init_ZipToken();
    debug3 = (0, import_debug3.default)("tokenizer:inflate");
    syncBufferSize = 256 * 1024;
    ddSignatureArray = signatureToArray(Signature.DataDescriptor);
    eocdSignatureBytes = signatureToArray(Signature.EndOfCentralDirectory);
    ZipHandler = class {
      constructor(tokenizer, options = {}) {
        this.tokenizer = tokenizer;
        this.syncBuffer = new Uint8Array(syncBufferSize);
        this.limits = {
          maxDataDescriptorScanBytes: options.maxDataDescriptorScanBytes ?? Number.POSITIVE_INFINITY,
          maxCompressedSize: options.maxCompressedSize ?? Number.POSITIVE_INFINITY,
          maxUncompressedSize: options.maxUncompressedSize ?? Number.POSITIVE_INFINITY
        };
        for (const [name, limit] of Object.entries(this.limits)) {
          if (limit !== Number.POSITIVE_INFINITY && (!Number.isSafeInteger(limit) || limit <= 0)) {
            throw new RangeError(`${name} must be a positive safe integer or Infinity`);
          }
        }
      }
      /** Reject oversized entries before retaining data or allocating a combined buffer. */
      checkLimit(limit, size) {
        if (size > this.limits[limit]) {
          throw new ZipLimitError(limit, size, this.limits[limit]);
        }
      }
      checkEntrySize(header) {
        this.checkLimit("maxCompressedSize", header.compressedSize);
        this.checkLimit("maxUncompressedSize", header.uncompressedSize);
        if (header.compressedMethod === 0) {
          this.checkLimit("maxUncompressedSize", header.compressedSize);
        }
      }
      async isZip() {
        return await this.peekSignature() === Signature.LocalFileHeader;
      }
      peekSignature() {
        return this.tokenizer.peekToken(UINT32_LE);
      }
      async findEndOfCentralDirectoryLocator() {
        const randomReadTokenizer = this.tokenizer;
        const chunkLength = Math.min(16 * 1024, randomReadTokenizer.fileInfo.size);
        const buffer = this.syncBuffer.subarray(0, chunkLength);
        await this.tokenizer.readBuffer(buffer, { position: randomReadTokenizer.fileInfo.size - chunkLength });
        for (let i = buffer.length - 4; i >= 0; i--) {
          if (buffer[i] === eocdSignatureBytes[0] && buffer[i + 1] === eocdSignatureBytes[1] && buffer[i + 2] === eocdSignatureBytes[2] && buffer[i + 3] === eocdSignatureBytes[3]) {
            return randomReadTokenizer.fileInfo.size - chunkLength + i;
          }
        }
        return -1;
      }
      async readCentralDirectory() {
        if (!this.tokenizer.supportsRandomAccess()) {
          debug3("Cannot reading central-directory without random-read support");
          return;
        }
        debug3("Reading central-directory...");
        const pos = this.tokenizer.position;
        try {
          const offset = await this.findEndOfCentralDirectoryLocator();
          if (offset > 0) {
            debug3("Central-directory 32-bit signature found");
            const eocdHeader = await this.tokenizer.readToken(EndOfCentralDirectoryRecordToken, offset);
            const files = [];
            this.tokenizer.setPosition(eocdHeader.offsetOfStartOfCd);
            const directory = createTokenizerView(this.tokenizer, eocdHeader.sizeOfCd);
            try {
              for (let n = 0; n < eocdHeader.nrOfEntriesOfSize; ++n) {
                const entry = await directory.readToken(FileHeader);
                if (entry.signature !== Signature.CentralFileHeader) {
                  throw new Error("Expected Central-File-Header signature");
                }
                entry.filename = await directory.readToken(new StringType(entry.filenameLength, "utf-8"));
                await directory.ignore(entry.extraFieldLength);
                await directory.ignore(entry.fileCommentLength);
                files.push(entry);
                debug3(`Add central-directory file-entry: n=${n + 1}/${files.length}: filename=${files[n].filename}`);
              }
              return files;
            } finally {
              await directory.close();
            }
          }
        } finally {
          this.tokenizer.setPosition(pos);
        }
      }
      async unzip(fileCb) {
        const entries = await this.readCentralDirectory();
        if (entries) {
          return this.iterateOverCentralDirectory(entries, fileCb);
        }
        let stop = false;
        do {
          const zipHeader = await this.readLocalFileHeader();
          if (!zipHeader) {
            break;
          }
          const next = fileCb(zipHeader);
          stop = !!next.stop;
          let fileData;
          await this.tokenizer.ignore(zipHeader.extraFieldLength);
          if (next.handler) {
            this.checkEntrySize(zipHeader);
          }
          if (zipHeader.dataDescriptor && zipHeader.compressedSize === 0) {
            const chunks = [];
            let totalSize = 0;
            const scanLimit = Math.min(this.limits.maxDataDescriptorScanBytes, next.handler ? this.limits.maxCompressedSize : Number.POSITIVE_INFINITY, next.handler && zipHeader.compressedMethod === 0 ? this.limits.maxUncompressedSize : Number.POSITIVE_INFINITY);
            debug3("Compressed-file-size unknown, scanning for next data-descriptor-signature....");
            while (true) {
              const peekLength = Math.min(syncBufferSize, scanLimit - totalSize + ddSignatureArray.length);
              const len = await this.tokenizer.peekBuffer(this.syncBuffer.subarray(0, peekLength), { mayBeLess: true });
              const nextHeaderIndex = indexOf(this.syncBuffer.subarray(0, len), ddSignatureArray);
              if (nextHeaderIndex < 0 && len < ddSignatureArray.length) {
                throw new Error("Expected data-descriptor-signature before end of input");
              }
              const size = nextHeaderIndex >= 0 ? nextHeaderIndex : len - ddSignatureArray.length + 1;
              this.checkLimit("maxDataDescriptorScanBytes", totalSize + size);
              if (next.handler) {
                this.checkLimit("maxCompressedSize", totalSize + size);
                if (zipHeader.compressedMethod === 0) {
                  this.checkLimit("maxUncompressedSize", totalSize + size);
                }
                if (size > 0) {
                  const data = new Uint8Array(size);
                  await this.tokenizer.readBuffer(data);
                  chunks.push(data);
                }
              } else {
                await this.tokenizer.ignore(size);
              }
              totalSize += size;
              if (nextHeaderIndex >= 0) {
                break;
              }
            }
            debug3(`Found data-descriptor-signature at pos=${this.tokenizer.position}`);
            if (next.handler) {
              this.checkLimit("maxCompressedSize", totalSize);
              await this.inflate(zipHeader, mergeArrays(chunks), next.handler);
            }
          } else {
            if (next.handler) {
              debug3(`Reading compressed-file-data: ${zipHeader.compressedSize} bytes`);
              fileData = new Uint8Array(zipHeader.compressedSize);
              await this.tokenizer.readBuffer(fileData);
              await this.inflate(zipHeader, fileData, next.handler);
            } else {
              debug3(`Ignoring compressed-file-data: ${zipHeader.compressedSize} bytes`);
              await this.tokenizer.ignore(zipHeader.compressedSize);
            }
          }
          debug3(`Reading data-descriptor at pos=${this.tokenizer.position}`);
          if (zipHeader.dataDescriptor) {
            const dataDescriptor = await this.tokenizer.readToken(DataDescriptor);
            if (dataDescriptor.signature !== 134695760) {
              throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - DataDescriptor.len}`);
            }
          }
        } while (!stop);
      }
      async iterateOverCentralDirectory(entries, fileCb) {
        for (const fileHeader of entries) {
          const next = fileCb(fileHeader);
          if (next.handler) {
            this.tokenizer.setPosition(fileHeader.relativeOffsetOfLocalHeader);
            const zipHeader = await this.readLocalFileHeader();
            if (zipHeader) {
              await this.tokenizer.ignore(zipHeader.extraFieldLength);
              this.checkEntrySize(fileHeader);
              this.checkEntrySize(zipHeader);
              const fileData = new Uint8Array(fileHeader.compressedSize);
              await this.tokenizer.readBuffer(fileData);
              await this.inflate(zipHeader, fileData, next.handler);
            }
          }
          if (next.stop) {
            break;
          }
        }
      }
      async inflate(zipHeader, fileData, cb) {
        if (zipHeader.compressedMethod === 0) {
          this.checkLimit("maxUncompressedSize", fileData.length);
          return cb(fileData);
        }
        if (zipHeader.compressedMethod !== 8) {
          throw new Error(`Unsupported ZIP compression method: ${zipHeader.compressedMethod}`);
        }
        debug3(`Decompress filename=${zipHeader.filename}, compressed-size=${fileData.length}`);
        const uncompressedData = await this.decompressDeflateRaw(fileData);
        return cb(uncompressedData);
      }
      async decompressDeflateRaw(data) {
        const input = new ReadableStream({
          start(controller) {
            controller.enqueue(data);
            controller.close();
          }
        });
        const ds = new DecompressionStream("deflate-raw");
        const output = input.pipeThrough(ds);
        const reader = output.getReader();
        const chunks = [];
        let totalSize = 0;
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) {
              break;
            }
            this.checkLimit("maxUncompressedSize", totalSize + value.length);
            totalSize += value.length;
            chunks.push(value);
          }
          this.checkLimit("maxUncompressedSize", totalSize);
          return mergeArrays(chunks);
        } catch (err) {
          await reader.cancel(err).catch(() => {
          });
          if (err instanceof ZipLimitError) {
            throw err;
          }
          if (err instanceof Error && "code" in err && err.code === "ERR_TRAILING_JUNK_AFTER_STREAM_END") {
            return mergeArrays(chunks);
          }
          const message = err instanceof Error ? `Failed to deflate ZIP entry: ${err.message}` : "Unknown decompression error in ZIP entry";
          throw new TypeError(message);
        } finally {
          reader.releaseLock();
        }
      }
      async readLocalFileHeader() {
        const signature = await this.tokenizer.peekToken(UINT32_LE);
        if (signature === Signature.LocalFileHeader) {
          const header = await this.tokenizer.readToken(LocalFileHeaderToken);
          header.filename = await this.tokenizer.readToken(new StringType(header.filenameLength, "utf-8"));
          return header;
        }
        if (signature === Signature.CentralFileHeader) {
          return false;
        }
        if (signature === 3759263696) {
          throw new Error("Encrypted ZIP");
        }
        throw new Error("Unexpected signature");
      }
    };
  }
});

// node_modules/@tokenizer/inflate/lib/index.js
var init_lib4 = __esm({
  "node_modules/@tokenizer/inflate/lib/index.js"() {
    init_GzipHandler();
    init_ZipHandler();
    init_ZipLimitError();
  }
});

// node_modules/file-type/source/tokens.js
function stringToBytes(string, encoding) {
  if (encoding === "utf-16le") {
    const bytes = [];
    for (let index = 0; index < string.length; index++) {
      const code = string.charCodeAt(index);
      bytes.push(code & 255, code >> 8 & 255);
    }
    return bytes;
  }
  if (encoding === "utf-16be") {
    const bytes = [];
    for (let index = 0; index < string.length; index++) {
      const code = string.charCodeAt(index);
      bytes.push(code >> 8 & 255, code & 255);
    }
    return bytes;
  }
  return [...string].map((character) => character.charCodeAt(0));
}
function tarHeaderChecksumMatches(arrayBuffer, offset = 0) {
  const readSum = Number.parseInt(new StringType(6).get(arrayBuffer, 148), 8);
  if (Number.isNaN(readSum)) {
    return false;
  }
  let sum = 8 * 32;
  for (let index = offset; index < offset + 148; index++) {
    sum += arrayBuffer[index];
  }
  for (let index = offset + 156; index < offset + 512; index++) {
    sum += arrayBuffer[index];
  }
  return readSum === sum;
}
var uint32SyncSafeToken;
var init_tokens = __esm({
  "node_modules/file-type/source/tokens.js"() {
    init_lib3();
    uint32SyncSafeToken = {
      get: (buffer, offset) => buffer[offset + 3] & 127 | (buffer[offset + 2] & 127) << 7 | (buffer[offset + 1] & 127) << 14 | (buffer[offset] & 127) << 21,
      len: 4
    };
  }
});

// node_modules/file-type/source/supported.js
var extensions, mimeTypes;
var init_supported = __esm({
  "node_modules/file-type/source/supported.js"() {
    extensions = [
      "jpg",
      "png",
      "apng",
      "gif",
      "webp",
      "flif",
      "xcf",
      "cr2",
      "cr3",
      "orf",
      "arw",
      "dng",
      "nef",
      "rw2",
      "raf",
      "tif",
      "bmp",
      "icns",
      "jxr",
      "psd",
      "indd",
      "zip",
      "tar",
      "rar",
      "gz",
      "bz2",
      "7z",
      "dmg",
      "mp4",
      "mid",
      "mkv",
      "webm",
      "mov",
      "avi",
      "mpg",
      "mp2",
      "mp3",
      "m4a",
      "oga",
      "ogg",
      "ogv",
      "opus",
      "flac",
      "wav",
      "spx",
      "amr",
      "pdf",
      "epub",
      "elf",
      "macho",
      "exe",
      "swf",
      "rtf",
      "wasm",
      "woff",
      "woff2",
      "eot",
      "ttf",
      "otf",
      "ttc",
      "ico",
      "flv",
      "ps",
      "xz",
      "sqlite",
      "nes",
      "crx",
      "xpi",
      "cab",
      "deb",
      "ar",
      "rpm",
      "Z",
      "lz",
      "cfb",
      "mxf",
      "mts",
      "blend",
      "bpg",
      "docx",
      "pptx",
      "xlsx",
      "3gp",
      "3g2",
      "j2c",
      "jp2",
      "jpm",
      "jpx",
      "mj2",
      "aif",
      "caf",
      "qcp",
      "odt",
      "ods",
      "odp",
      "xml",
      "mobi",
      "heic",
      "cur",
      "ktx",
      "ape",
      "wv",
      "dcm",
      "ics",
      "glb",
      "pcap",
      "dsf",
      "dff",
      "lnk",
      "alias",
      "voc",
      "ac3",
      "m4v",
      "m4p",
      "m4b",
      "f4v",
      "f4p",
      "f4b",
      "f4a",
      "mie",
      "asf",
      "ogm",
      "ogx",
      "mpc",
      "arrow",
      "shp",
      "aac",
      "mp1",
      "it",
      "s3m",
      "xm",
      "skp",
      "avif",
      "eps",
      "lzh",
      "pgp",
      "asar",
      "stl",
      "chm",
      "3mf",
      "zst",
      "jxl",
      "vcf",
      "jls",
      "pst",
      "dwg",
      "parquet",
      "class",
      "arj",
      "cpio",
      "ace",
      "avro",
      "icc",
      "fbx",
      "vsdx",
      "vtt",
      "apk",
      "drc",
      "lz4",
      "potx",
      "xltx",
      "dotx",
      "xltm",
      "ott",
      "ots",
      "otp",
      "odg",
      "otg",
      "xlsm",
      "docm",
      "dotm",
      "potm",
      "pptm",
      "jar",
      "jmp",
      "rm",
      "sav",
      "ppsm",
      "ppsx",
      "tar.gz",
      "reg",
      "dat",
      "key",
      "numbers",
      "pages",
      "iso"
    ];
    mimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/flif",
      "image/x-xcf",
      "image/x-canon-cr2",
      "image/x-canon-cr3",
      "image/tiff",
      "image/bmp",
      "image/vnd.ms-photo",
      "image/vnd.adobe.photoshop",
      "application/x-indesign",
      "application/epub+zip",
      "application/x-xpinstall",
      "application/vnd.ms-powerpoint.slideshow.macroenabled.12",
      "application/vnd.oasis.opendocument.text",
      "application/vnd.oasis.opendocument.spreadsheet",
      "application/vnd.oasis.opendocument.presentation",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.openxmlformats-officedocument.presentationml.slideshow",
      "application/zip",
      "application/x-tar",
      "application/x-rar-compressed",
      "application/gzip",
      "application/x-bzip2",
      "application/x-7z-compressed",
      "application/x-apple-diskimage",
      "application/vnd.apache.arrow.file",
      "video/mp4",
      "audio/midi",
      "video/matroska",
      "video/webm",
      "video/quicktime",
      "video/vnd.avi",
      "audio/wav",
      "audio/qcelp",
      "audio/x-ms-asf",
      "video/x-ms-asf",
      "application/vnd.ms-asf",
      "video/mpeg",
      "video/3gpp",
      "audio/mpeg",
      "audio/mp4",
      // RFC 4337
      "video/ogg",
      "audio/ogg",
      "audio/ogg; codecs=opus",
      "application/ogg",
      "audio/flac",
      "audio/ape",
      "audio/wavpack",
      "audio/amr",
      "application/pdf",
      "application/x-elf",
      "application/x-mach-binary",
      "application/x-msdownload",
      "application/x-shockwave-flash",
      "application/rtf",
      "application/wasm",
      "font/woff",
      "font/woff2",
      "application/vnd.ms-fontobject",
      "font/ttf",
      "font/otf",
      "font/collection",
      "image/x-icon",
      "video/x-flv",
      "application/postscript",
      "application/eps",
      "application/x-xz",
      "application/x-sqlite3",
      "application/x-nintendo-nes-rom",
      "application/x-google-chrome-extension",
      "application/vnd.ms-cab-compressed",
      "application/x-deb",
      "application/x-unix-archive",
      "application/x-rpm",
      "application/x-compress",
      "application/lzip",
      "application/x-cfb",
      "application/x-mie",
      "application/mxf",
      "video/mp2t",
      "application/x-blender",
      "image/bpg",
      "image/j2c",
      "image/jp2",
      "image/jpx",
      "image/jpm",
      "image/mj2",
      "audio/aiff",
      "audio/x-caf",
      // Non-standard
      "application/xml",
      "application/x-mobipocket-ebook",
      "image/heif",
      "image/heif-sequence",
      "image/heic",
      "image/heic-sequence",
      "image/icns",
      "image/ktx",
      "application/dicom",
      "audio/x-musepack",
      "text/calendar",
      "text/vcard",
      "text/vtt",
      "model/gltf-binary",
      "application/vnd.tcpdump.pcap",
      "audio/x-dsf",
      // Non-standard
      "audio/x-dff",
      // Non-standard
      "application/x-ms-shortcut",
      // Informal, used by freedesktop.org shared-mime-info
      "application/x-ft-apple.alias",
      "audio/x-voc",
      "audio/vnd.dolby.dd-raw",
      "audio/x-m4a",
      "image/apng",
      "image/x-olympus-orf",
      "image/x-sony-arw",
      "image/x-adobe-dng",
      "image/x-nikon-nef",
      "image/x-panasonic-rw2",
      "image/x-fujifilm-raf",
      "video/x-m4v",
      "video/3gpp2",
      "application/x-esri-shape",
      "audio/aac",
      "audio/x-it",
      "audio/x-s3m",
      "audio/x-xm",
      "video/MP1S",
      "video/MP2P",
      "application/vnd.sketchup.skp",
      "image/avif",
      "application/x-lzh-compressed",
      "application/pgp-encrypted",
      "application/x-asar",
      "model/stl",
      "application/vnd.ms-htmlhelp",
      "model/3mf",
      "image/jxl",
      "application/zstd",
      "image/jls",
      "application/vnd.ms-outlook",
      "image/vnd.dwg",
      "application/vnd.apache.parquet",
      "application/java-vm",
      "application/x-arj",
      "application/x-cpio",
      "application/x-ace-compressed",
      "application/avro",
      "application/vnd.iccprofile",
      "application/x-ft-fbx",
      "application/vnd.visio",
      "application/vnd.android.package-archive",
      "application/x-ft-draco",
      "application/x-lz4",
      // Informal, used by freedesktop.org shared-mime-info
      "application/vnd.openxmlformats-officedocument.presentationml.template",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.template",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.template",
      "application/vnd.ms-excel.template.macroenabled.12",
      "application/vnd.oasis.opendocument.text-template",
      "application/vnd.oasis.opendocument.spreadsheet-template",
      "application/vnd.oasis.opendocument.presentation-template",
      "application/vnd.oasis.opendocument.graphics",
      "application/vnd.oasis.opendocument.graphics-template",
      "application/vnd.ms-excel.sheet.macroenabled.12",
      "application/vnd.ms-word.document.macroenabled.12",
      "application/vnd.ms-word.template.macroenabled.12",
      "application/vnd.ms-powerpoint.template.macroenabled.12",
      "application/vnd.ms-powerpoint.presentation.macroenabled.12",
      "application/java-archive",
      "application/vnd.rn-realmedia",
      "application/x-spss-sav",
      "application/x-ms-regedit",
      "application/x-ft-windows-registry-hive",
      "application/x-jmp-data",
      "application/vnd.apple.keynote",
      "application/vnd.apple.numbers",
      "application/vnd.apple.pages",
      "application/x-iso9660-image"
    ];
  }
});

// node_modules/file-type/source/parser.js
function getSafeBound(value, maximum, reason) {
  if (!Number.isFinite(value) || value < 0 || value > maximum) {
    throw new ParserHardLimitError(`${reason} has invalid size ${value} (maximum ${maximum} bytes)`);
  }
  return value;
}
async function safeIgnore(tokenizer, length, { maximumLength = maximumUntrustedSkipSizeInBytes, reason = "skip" } = {}) {
  const safeLength = getSafeBound(length, maximumLength, reason);
  await tokenizer.ignore(safeLength);
}
async function safeReadBuffer(tokenizer, buffer, options, { maximumLength = buffer.length, reason = "read" } = {}) {
  const length = options?.length ?? buffer.length;
  const safeLength = getSafeBound(length, maximumLength, reason);
  return tokenizer.readBuffer(buffer, {
    ...options,
    length: safeLength
  });
}
function checkBytes(buffer, headers, options) {
  options = {
    offset: 0,
    ...options
  };
  for (const [index, header] of headers.entries()) {
    if (options.mask) {
      if (header !== (options.mask[index] & buffer[index + options.offset])) {
        return false;
      }
    } else if (header !== buffer[index + options.offset]) {
      return false;
    }
  }
  return true;
}
function hasUnknownFileSize(tokenizer) {
  const fileSize = tokenizer.fileInfo.size;
  return !Number.isFinite(fileSize) || fileSize === Number.MAX_SAFE_INTEGER;
}
function hasExceededUnknownSizeScanBudget(tokenizer, startOffset, maximumBytes) {
  return hasUnknownFileSize(tokenizer) && tokenizer.position - startOffset > maximumBytes;
}
var maximumUntrustedSkipSizeInBytes, ParserHardLimitError;
var init_parser = __esm({
  "node_modules/file-type/source/parser.js"() {
    maximumUntrustedSkipSizeInBytes = 16 * 1024 * 1024;
    ParserHardLimitError = class extends Error {
    };
  }
});

// node_modules/file-type/source/detectors/zip.js
function mergeByteChunks(chunks, totalLength) {
  const merged = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.length;
  }
  return merged;
}
function getMaximumZipBufferedReadLength(tokenizer) {
  const fileSize = tokenizer.fileInfo.size;
  const remainingBytes = Number.isFinite(fileSize) ? Math.max(0, fileSize - tokenizer.position) : Number.MAX_SAFE_INTEGER;
  return Math.min(remainingBytes, maximumZipBufferedReadSizeInBytes);
}
function isRecoverableZipError(error) {
  if (error instanceof EndOfStreamError) {
    return true;
  }
  if (error instanceof ParserHardLimitError || error instanceof ZipLimitError) {
    return true;
  }
  if (!(error instanceof Error)) {
    return false;
  }
  if (error instanceof TypeError && error.message.startsWith("Failed to deflate ZIP entry:")) {
    return true;
  }
  if (recoverableZipErrorMessages.has(error.message)) {
    return true;
  }
  if (recoverableZipErrorCodes.has(error.code)) {
    return true;
  }
  for (const prefix of recoverableZipErrorMessagePrefixes) {
    if (error.message.startsWith(prefix)) {
      return true;
    }
  }
  return false;
}
function canReadZipEntryForDetection(zipHeader, maximumSize = maximumZipEntrySizeInBytes) {
  const sizes = [zipHeader.compressedSize, zipHeader.uncompressedSize];
  for (const size of sizes) {
    if (!Number.isFinite(size) || size < 0 || size > maximumSize) {
      return false;
    }
  }
  return true;
}
function createIWorkZipDetectionState() {
  return {
    hasDocumentEntry: false,
    hasMasterSlideEntry: false,
    hasTablesEntry: false,
    hasCalculationEngineEntry: false
  };
}
function updateIWorkZipDetectionStateFromFilename(iWorkState, filename) {
  if (filename === "Index/Document.iwa") {
    iWorkState.hasDocumentEntry = true;
  }
  if (filename.startsWith("Index/MasterSlide")) {
    iWorkState.hasMasterSlideEntry = true;
  }
  if (filename.startsWith("Index/Tables/")) {
    iWorkState.hasTablesEntry = true;
  }
  if (filename === "Index/CalculationEngine.iwa") {
    iWorkState.hasCalculationEngineEntry = true;
  }
}
function getIWorkFileTypeFromZipEntries(iWorkState) {
  if (!iWorkState.hasDocumentEntry) {
    return;
  }
  if (iWorkState.hasMasterSlideEntry) {
    return { ext: "key", mime: "application/vnd.apple.keynote" };
  }
  if (iWorkState.hasTablesEntry) {
    return { ext: "numbers", mime: "application/vnd.apple.numbers" };
  }
  return { ext: "pages", mime: "application/vnd.apple.pages" };
}
function getFileTypeFromMimeType(mimeType) {
  mimeType = mimeType.toLowerCase();
  switch (mimeType) {
    case "application/epub+zip":
      return { ext: "epub", mime: mimeType };
    case "application/vnd.oasis.opendocument.text":
      return { ext: "odt", mime: mimeType };
    case "application/vnd.oasis.opendocument.text-template":
      return { ext: "ott", mime: mimeType };
    case "application/vnd.oasis.opendocument.spreadsheet":
      return { ext: "ods", mime: mimeType };
    case "application/vnd.oasis.opendocument.spreadsheet-template":
      return { ext: "ots", mime: mimeType };
    case "application/vnd.oasis.opendocument.presentation":
      return { ext: "odp", mime: mimeType };
    case "application/vnd.oasis.opendocument.presentation-template":
      return { ext: "otp", mime: mimeType };
    case "application/vnd.oasis.opendocument.graphics":
      return { ext: "odg", mime: mimeType };
    case "application/vnd.oasis.opendocument.graphics-template":
      return { ext: "otg", mime: mimeType };
    case "application/vnd.openxmlformats-officedocument.presentationml.slideshow":
      return { ext: "ppsx", mime: mimeType };
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return { ext: "xlsx", mime: mimeType };
    case "application/vnd.ms-excel.sheet.macroenabled":
      return { ext: "xlsm", mime: "application/vnd.ms-excel.sheet.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.template":
      return { ext: "xltx", mime: mimeType };
    case "application/vnd.ms-excel.template.macroenabled":
      return { ext: "xltm", mime: "application/vnd.ms-excel.template.macroenabled.12" };
    case "application/vnd.ms-powerpoint.slideshow.macroenabled":
      return { ext: "ppsm", mime: "application/vnd.ms-powerpoint.slideshow.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return { ext: "docx", mime: mimeType };
    case "application/vnd.ms-word.document.macroenabled":
      return { ext: "docm", mime: "application/vnd.ms-word.document.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.template":
      return { ext: "dotx", mime: mimeType };
    case "application/vnd.ms-word.template.macroenabledtemplate":
      return { ext: "dotm", mime: "application/vnd.ms-word.template.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.presentationml.template":
      return { ext: "potx", mime: mimeType };
    case "application/vnd.ms-powerpoint.template.macroenabled":
      return { ext: "potm", mime: "application/vnd.ms-powerpoint.template.macroenabled.12" };
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return { ext: "pptx", mime: mimeType };
    case "application/vnd.ms-powerpoint.presentation.macroenabled":
      return { ext: "pptm", mime: "application/vnd.ms-powerpoint.presentation.macroenabled.12" };
    case "application/vnd.ms-visio.drawing":
      return { ext: "vsdx", mime: "application/vnd.visio" };
    case "application/vnd.ms-package.3dmanufacturing-3dmodel+xml":
      return { ext: "3mf", mime: "model/3mf" };
    default:
  }
}
function createOpenXmlZipDetectionState() {
  return {
    hasContentTypesEntry: false,
    hasParsedContentTypesEntry: false,
    isParsingContentTypes: false,
    hasUnparseableContentTypes: false,
    hasWordDirectory: false,
    hasPresentationDirectory: false,
    hasSpreadsheetDirectory: false,
    hasThreeDimensionalModelEntry: false
  };
}
function updateOpenXmlZipDetectionStateFromFilename(openXmlState, filename) {
  if (filename.startsWith("word/")) {
    openXmlState.hasWordDirectory = true;
  }
  if (filename.startsWith("ppt/")) {
    openXmlState.hasPresentationDirectory = true;
  }
  if (filename.startsWith("xl/")) {
    openXmlState.hasSpreadsheetDirectory = true;
  }
  if (filename.startsWith("3D/") && filename.endsWith(".model")) {
    openXmlState.hasThreeDimensionalModelEntry = true;
  }
}
function getOpenXmlFileTypeFromDirectoryNames(openXmlState) {
  if (openXmlState.hasWordDirectory) {
    return {
      ext: "docx",
      mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    };
  }
  if (openXmlState.hasPresentationDirectory) {
    return {
      ext: "pptx",
      mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    };
  }
  if (openXmlState.hasSpreadsheetDirectory) {
    return {
      ext: "xlsx",
      mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };
  }
  if (openXmlState.hasThreeDimensionalModelEntry) {
    return {
      ext: "3mf",
      mime: "model/3mf"
    };
  }
}
function getOpenXmlFileTypeFromZipEntries(openXmlState) {
  if (!openXmlState.hasContentTypesEntry || openXmlState.hasUnparseableContentTypes || openXmlState.isParsingContentTypes || openXmlState.hasParsedContentTypesEntry) {
    return;
  }
  return getOpenXmlFileTypeFromDirectoryNames(openXmlState);
}
function getOpenXmlMimeTypeFromContentTypesXml(xmlContent) {
  const endPosition = xmlContent.indexOf('.main+xml"');
  if (endPosition === -1) {
    const mimeType = "application/vnd.ms-package.3dmanufacturing-3dmodel+xml";
    if (xmlContent.includes(`ContentType="${mimeType}"`)) {
      return mimeType;
    }
    return;
  }
  const truncatedContent = xmlContent.slice(0, endPosition);
  const firstQuotePosition = truncatedContent.lastIndexOf('"');
  return truncatedContent.slice(firstQuotePosition + 1);
}
function findZipDataDescriptorOffset(buffer, bytesConsumed, { allowTruncated = false } = {}) {
  const lastPossibleDescriptorOffset = buffer.length - (allowTruncated ? 4 : zipDataDescriptorLengthInBytes);
  for (let index = 0; index <= lastPossibleDescriptorOffset; index++) {
    if (UINT32_LE.get(buffer, index) !== zipDataDescriptorSignature) {
      continue;
    }
    if (buffer.length - index < 12) {
      return index;
    }
    if (UINT32_LE.get(buffer, index + 8) === bytesConsumed + index) {
      return index;
    }
  }
  return -1;
}
async function readZipDataDescriptorEntryWithLimit(zipHandler, { shouldBuffer, maximumLength = maximumZipEntrySizeInBytes } = {}) {
  const { syncBuffer } = zipHandler;
  const { length: syncBufferLength } = syncBuffer;
  const chunks = [];
  let bytesConsumed = 0;
  for (; ; ) {
    const length = await zipHandler.tokenizer.peekBuffer(syncBuffer, { mayBeLess: true });
    const dataDescriptorOffset = findZipDataDescriptorOffset(syncBuffer.subarray(0, length), bytesConsumed, {
      allowTruncated: length < syncBufferLength
    });
    const retainedLength = dataDescriptorOffset >= 0 ? 0 : length === syncBufferLength ? Math.min(zipDataDescriptorOverlapLengthInBytes, length - 1) : 0;
    const chunkLength = dataDescriptorOffset >= 0 ? dataDescriptorOffset : length - retainedLength;
    if (chunkLength === 0) {
      break;
    }
    bytesConsumed += chunkLength;
    if (bytesConsumed > maximumLength) {
      throw new ParserHardLimitError(`ZIP entry data descriptor not found within ${maximumLength} bytes`);
    }
    if (shouldBuffer) {
      const data = new Uint8Array(chunkLength);
      await zipHandler.tokenizer.readBuffer(data);
      chunks.push(data);
    } else {
      await zipHandler.tokenizer.ignore(chunkLength);
    }
    if (dataDescriptorOffset >= 0) {
      break;
    }
  }
  if (!hasUnknownFileSize(zipHandler.tokenizer)) {
    zipHandler.knownSizeDescriptorScannedBytes += bytesConsumed;
  }
  if (!shouldBuffer) {
    return;
  }
  return mergeByteChunks(chunks, bytesConsumed);
}
function getRemainingZipScanBudget(zipHandler, startOffset) {
  if (hasUnknownFileSize(zipHandler.tokenizer)) {
    return Math.max(0, maximumUntrustedSkipSizeInBytes - (zipHandler.tokenizer.position - startOffset));
  }
  return Math.max(0, maximumZipEntrySizeInBytes - zipHandler.knownSizeDescriptorScannedBytes);
}
async function readZipEntryData(zipHandler, zipHeader, { shouldBuffer, maximumDescriptorLength = maximumZipEntrySizeInBytes } = {}) {
  if (zipHeader.dataDescriptor && zipHeader.compressedSize === 0) {
    return readZipDataDescriptorEntryWithLimit(zipHandler, {
      shouldBuffer,
      maximumLength: maximumDescriptorLength
    });
  }
  if (!shouldBuffer) {
    await safeIgnore(zipHandler.tokenizer, zipHeader.compressedSize, {
      maximumLength: hasUnknownFileSize(zipHandler.tokenizer) ? maximumZipEntrySizeInBytes : zipHandler.tokenizer.fileInfo.size,
      reason: "ZIP entry compressed data"
    });
    return;
  }
  if (zipHeader.compressedSize > maximumZipTextEntrySizeInBytes) {
    throw new ZipLimitError("maxCompressedSize", zipHeader.compressedSize, maximumZipTextEntrySizeInBytes);
  }
  const maximumLength = getMaximumZipBufferedReadLength(zipHandler.tokenizer);
  if (!Number.isFinite(zipHeader.compressedSize) || zipHeader.compressedSize < 0 || zipHeader.compressedSize > maximumLength) {
    throw new Error(`ZIP entry compressed data exceeds ${maximumLength} bytes`);
  }
  const fileData = new Uint8Array(zipHeader.compressedSize);
  await zipHandler.tokenizer.readBuffer(fileData);
  return fileData;
}
async function detectZip(tokenizer) {
  let fileType;
  const openXmlState = createOpenXmlZipDetectionState();
  const iWorkState = createIWorkZipDetectionState();
  try {
    await new DetectionZipHandler(tokenizer, {
      maxUncompressedSize: maximumZipTextEntrySizeInBytes
    }).unzip((zipHeader) => {
      updateOpenXmlZipDetectionStateFromFilename(openXmlState, zipHeader.filename);
      updateIWorkZipDetectionStateFromFilename(iWorkState, zipHeader.filename);
      if (iWorkState.hasDocumentEntry && (iWorkState.hasMasterSlideEntry || iWorkState.hasTablesEntry)) {
        fileType = getIWorkFileTypeFromZipEntries(iWorkState);
        return { stop: true };
      }
      const isOpenXmlContentTypesEntry = zipHeader.filename === "[Content_Types].xml";
      const openXmlFileTypeFromEntries = getOpenXmlFileTypeFromZipEntries(openXmlState);
      if (!isOpenXmlContentTypesEntry && openXmlFileTypeFromEntries) {
        fileType = openXmlFileTypeFromEntries;
        return {
          stop: true
        };
      }
      switch (zipHeader.filename) {
        case "META-INF/mozilla.rsa":
          fileType = {
            ext: "xpi",
            mime: "application/x-xpinstall"
          };
          return {
            stop: true
          };
        case "META-INF/MANIFEST.MF":
          fileType = {
            ext: "jar",
            mime: "application/java-archive"
          };
          return {
            stop: true
          };
        case "mimetype":
          if (!canReadZipEntryForDetection(zipHeader, maximumZipTextEntrySizeInBytes)) {
            return {};
          }
          return {
            async handler(fileData) {
              const mimeType = new TextDecoder("utf-8").decode(fileData).trim();
              fileType = getFileTypeFromMimeType(mimeType);
            },
            stop: true
          };
        case "[Content_Types].xml": {
          openXmlState.hasContentTypesEntry = true;
          if (!canReadZipEntryForDetection(zipHeader, maximumZipTextEntrySizeInBytes)) {
            openXmlState.hasUnparseableContentTypes = true;
            return {};
          }
          openXmlState.isParsingContentTypes = true;
          return {
            async handler(fileData) {
              const xmlContent = new TextDecoder("utf-8").decode(fileData);
              const mimeType = getOpenXmlMimeTypeFromContentTypesXml(xmlContent);
              if (mimeType) {
                fileType = getFileTypeFromMimeType(mimeType);
              }
              openXmlState.hasParsedContentTypesEntry = true;
              openXmlState.isParsingContentTypes = false;
            },
            stop: true
          };
        }
        default:
          if (/classes\d*\.dex/v.test(zipHeader.filename)) {
            fileType = {
              ext: "apk",
              mime: "application/vnd.android.package-archive"
            };
            return { stop: true };
          }
          return {};
      }
    });
  } catch (error) {
    if (!isRecoverableZipError(error)) {
      throw error;
    }
    if (openXmlState.isParsingContentTypes) {
      openXmlState.isParsingContentTypes = false;
      openXmlState.hasUnparseableContentTypes = true;
    }
    if (!fileType && (error instanceof EndOfStreamError || error instanceof ParserHardLimitError) && !openXmlState.hasContentTypesEntry) {
      fileType = getOpenXmlFileTypeFromDirectoryNames(openXmlState);
    }
  }
  const iWorkFileType = hasUnknownFileSize(tokenizer) && iWorkState.hasDocumentEntry && !iWorkState.hasMasterSlideEntry && !iWorkState.hasTablesEntry && !iWorkState.hasCalculationEngineEntry ? void 0 : getIWorkFileTypeFromZipEntries(iWorkState);
  return fileType ?? getOpenXmlFileTypeFromZipEntries(openXmlState) ?? iWorkFileType ?? {
    ext: "zip",
    mime: "application/zip"
  };
}
var maximumZipEntrySizeInBytes, maximumZipEntryCount, maximumZipBufferedReadSizeInBytes, maximumZipTextEntrySizeInBytes, recoverableZipErrorMessages, recoverableZipErrorMessagePrefixes, recoverableZipErrorCodes, zipDataDescriptorSignature, zipDataDescriptorLengthInBytes, zipDataDescriptorOverlapLengthInBytes, DetectionZipHandler;
var init_zip = __esm({
  "node_modules/file-type/source/detectors/zip.js"() {
    init_lib3();
    init_core();
    init_lib4();
    init_parser();
    maximumZipEntrySizeInBytes = 1024 * 1024;
    maximumZipEntryCount = 1024;
    maximumZipBufferedReadSizeInBytes = 2 ** 31 - 1;
    maximumZipTextEntrySizeInBytes = maximumZipEntrySizeInBytes;
    recoverableZipErrorMessages = /* @__PURE__ */ new Set([
      "Unexpected signature",
      "Encrypted ZIP",
      "Expected Central-File-Header signature"
    ]);
    recoverableZipErrorMessagePrefixes = [
      "ZIP entry count exceeds ",
      "Unsupported ZIP compression method:",
      "ZIP entry compressed data exceeds ",
      "ZIP entry decompressed data exceeds ",
      "Expected data-descriptor-signature at position "
    ];
    recoverableZipErrorCodes = /* @__PURE__ */ new Set([
      "Z_BUF_ERROR",
      "Z_DATA_ERROR",
      "ERR_INVALID_STATE"
    ]);
    zipDataDescriptorSignature = 134695760;
    zipDataDescriptorLengthInBytes = 16;
    zipDataDescriptorOverlapLengthInBytes = zipDataDescriptorLengthInBytes - 1;
    DetectionZipHandler = class extends ZipHandler {
      async unzip(fileCallback) {
        let shouldStop = false;
        let zipEntryCount = 0;
        const zipScanStart = this.tokenizer.position;
        this.knownSizeDescriptorScannedBytes = 0;
        do {
          if (hasExceededUnknownSizeScanBudget(this.tokenizer, zipScanStart, maximumUntrustedSkipSizeInBytes)) {
            throw new ParserHardLimitError(`ZIP stream probing exceeds ${maximumUntrustedSkipSizeInBytes} bytes`);
          }
          const zipHeader = await this.readLocalFileHeader();
          if (!zipHeader) {
            break;
          }
          zipEntryCount++;
          if (zipEntryCount > maximumZipEntryCount) {
            throw new Error(`ZIP entry count exceeds ${maximumZipEntryCount}`);
          }
          const next = fileCallback(zipHeader);
          shouldStop = Boolean(next.stop);
          await this.tokenizer.ignore(zipHeader.extraFieldLength);
          const fileData = await readZipEntryData(this, zipHeader, {
            shouldBuffer: Boolean(next.handler),
            maximumDescriptorLength: Math.min(maximumZipEntrySizeInBytes, getRemainingZipScanBudget(this, zipScanStart))
          });
          if (next.handler) {
            await this.inflate(zipHeader, fileData, next.handler);
          }
          if (zipHeader.dataDescriptor) {
            const dataDescriptor = new Uint8Array(zipDataDescriptorLengthInBytes);
            await this.tokenizer.readBuffer(dataDescriptor);
            if (UINT32_LE.get(dataDescriptor, 0) !== zipDataDescriptorSignature) {
              throw new Error(`Expected data-descriptor-signature at position ${this.tokenizer.position - dataDescriptor.length}`);
            }
          }
          if (hasExceededUnknownSizeScanBudget(this.tokenizer, zipScanStart, maximumUntrustedSkipSizeInBytes)) {
            throw new ParserHardLimitError(`ZIP stream probing exceeds ${maximumUntrustedSkipSizeInBytes} bytes`);
          }
        } while (!shouldStop);
      }
    };
  }
});

// node_modules/file-type/source/detectors/ebml.js
async function detectEbml(tokenizer) {
  async function readField() {
    const msb = await tokenizer.peekNumber(UINT8);
    let mask = 128;
    let ic = 0;
    while (mask !== 0 && (msb & mask) === 0) {
      ++ic;
      mask >>= 1;
    }
    const id = new Uint8Array(ic + 1);
    await safeReadBuffer(tokenizer, id, void 0, {
      maximumLength: id.length,
      reason: "EBML field"
    });
    return id;
  }
  async function readElement() {
    const idField = await readField();
    const lengthField = await readField();
    lengthField[0] ^= 128 >> lengthField.length - 1;
    const nrLength = Math.min(6, lengthField.length);
    const idView = new DataView(idField.buffer);
    const lengthView = new DataView(lengthField.buffer, lengthField.length - nrLength, nrLength);
    return {
      id: getUintBE(idView),
      len: getUintBE(lengthView)
    };
  }
  async function readChildren(children) {
    let ebmlElementCount = 0;
    while (children > 0) {
      ebmlElementCount++;
      if (ebmlElementCount > maximumEbmlElementCount) {
        return;
      }
      if (hasExceededUnknownSizeScanBudget(tokenizer, ebmlScanStart, maximumUntrustedSkipSizeInBytes)) {
        return;
      }
      const previousPosition = tokenizer.position;
      const element = await readElement();
      if (element.id === 17026) {
        if (element.len > maximumEbmlDocumentTypeSizeInBytes) {
          return;
        }
        const documentTypeLength = getSafeBound(element.len, maximumEbmlDocumentTypeSizeInBytes, "EBML DocType");
        const rawValue = await tokenizer.readToken(new StringType(documentTypeLength));
        return rawValue.split("\0", 1)[0];
      }
      if (hasUnknownFileSize(tokenizer) && (!Number.isFinite(element.len) || element.len < 0 || element.len > maximumEbmlElementPayloadSizeInBytes)) {
        return;
      }
      await safeIgnore(tokenizer, element.len, {
        maximumLength: hasUnknownFileSize(tokenizer) ? maximumEbmlElementPayloadSizeInBytes : tokenizer.fileInfo.size,
        reason: "EBML payload"
      });
      --children;
      if (tokenizer.position <= previousPosition) {
        return;
      }
    }
  }
  const rootElement = await readElement();
  const ebmlScanStart = tokenizer.position;
  const documentType = await readChildren(rootElement.len);
  switch (documentType) {
    case "webm":
      return {
        ext: "webm",
        mime: "video/webm"
      };
    case "matroska":
      return {
        ext: "mkv",
        mime: "video/matroska"
      };
    default:
  }
}
var maximumEbmlDocumentTypeSizeInBytes, maximumEbmlElementPayloadSizeInBytes, maximumEbmlElementCount;
var init_ebml = __esm({
  "node_modules/file-type/source/detectors/ebml.js"() {
    init_lib3();
    init_uint8array_extras();
    init_parser();
    maximumEbmlDocumentTypeSizeInBytes = 64;
    maximumEbmlElementPayloadSizeInBytes = 1024 * 1024;
    maximumEbmlElementCount = 256;
  }
});

// node_modules/file-type/source/detectors/png.js
function isPngAncillaryChunk(type) {
  return (type.codePointAt(0) & 32) !== 0;
}
async function detectPng(tokenizer) {
  const pngFileType = {
    ext: "png",
    mime: "image/png"
  };
  const apngFileType = {
    ext: "apng",
    mime: "image/apng"
  };
  await tokenizer.ignore(8);
  async function readChunkHeader() {
    return {
      length: await tokenizer.readToken(INT32_BE),
      type: await tokenizer.readToken(new StringType(4, "latin1"))
    };
  }
  const isUnknownPngStream = hasUnknownFileSize(tokenizer);
  const pngScanStart = tokenizer.position;
  let pngChunkCount = 0;
  let hasSeenImageHeader = false;
  do {
    pngChunkCount++;
    if (pngChunkCount > maximumPngChunkCount) {
      break;
    }
    if (hasExceededUnknownSizeScanBudget(tokenizer, pngScanStart, maximumPngStreamScanBudgetInBytes)) {
      break;
    }
    const previousPosition = tokenizer.position;
    const chunk = await readChunkHeader();
    if (chunk.length < 0) {
      return;
    }
    if (chunk.type === "IHDR") {
      if (chunk.length !== 13) {
        return;
      }
      hasSeenImageHeader = true;
    }
    switch (chunk.type) {
      case "IDAT":
        return pngFileType;
      case "acTL":
        return apngFileType;
      default:
        if (!hasSeenImageHeader && chunk.type !== "CgBI") {
          return;
        }
        if (isUnknownPngStream && chunk.length > maximumPngChunkSizeInBytes) {
          return hasSeenImageHeader && isPngAncillaryChunk(chunk.type) ? pngFileType : void 0;
        }
        try {
          await safeIgnore(tokenizer, chunk.length + 4, {
            maximumLength: isUnknownPngStream ? maximumPngChunkSizeInBytes + 4 : tokenizer.fileInfo.size,
            reason: "PNG chunk payload"
          });
        } catch (error) {
          if (!isUnknownPngStream && (error instanceof ParserHardLimitError || error instanceof EndOfStreamError)) {
            return pngFileType;
          }
          throw error;
        }
    }
    if (tokenizer.position <= previousPosition) {
      break;
    }
  } while (tokenizer.position + 8 < tokenizer.fileInfo.size);
  return pngFileType;
}
var maximumPngChunkCount, maximumPngStreamScanBudgetInBytes, maximumPngChunkSizeInBytes;
var init_png = __esm({
  "node_modules/file-type/source/detectors/png.js"() {
    init_lib3();
    init_core();
    init_parser();
    maximumPngChunkCount = 512;
    maximumPngStreamScanBudgetInBytes = 16 * 1024 * 1024;
    maximumPngChunkSizeInBytes = 1024 * 1024;
  }
});

// node_modules/file-type/source/detectors/asf.js
async function detectAsf(tokenizer) {
  let isMalformedAsf = false;
  try {
    async function readHeader() {
      const guid = new Uint8Array(16);
      await safeReadBuffer(tokenizer, guid, void 0, {
        maximumLength: guid.length,
        reason: "ASF header GUID"
      });
      return {
        id: guid,
        size: Number(await tokenizer.readToken(UINT64_LE))
      };
    }
    await safeIgnore(tokenizer, 30, {
      maximumLength: 30,
      reason: "ASF header prelude"
    });
    const isUnknownFileSize = hasUnknownFileSize(tokenizer);
    const asfHeaderScanStart = tokenizer.position;
    let asfHeaderObjectCount = 0;
    while (tokenizer.position + 24 < tokenizer.fileInfo.size) {
      asfHeaderObjectCount++;
      if (asfHeaderObjectCount > maximumAsfHeaderObjectCount) {
        break;
      }
      if (hasExceededUnknownSizeScanBudget(tokenizer, asfHeaderScanStart, maximumUntrustedSkipSizeInBytes)) {
        break;
      }
      const previousPosition = tokenizer.position;
      const header = await readHeader();
      let payload = header.size - 24;
      if (!Number.isFinite(payload) || payload < 0) {
        isMalformedAsf = true;
        break;
      }
      if (checkBytes(header.id, [145, 7, 220, 183, 183, 169, 207, 17, 142, 230, 0, 192, 12, 32, 83, 101])) {
        const typeId = new Uint8Array(16);
        payload -= await safeReadBuffer(tokenizer, typeId, void 0, {
          maximumLength: typeId.length,
          reason: "ASF stream type GUID"
        });
        if (checkBytes(typeId, [64, 158, 105, 248, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) {
          return {
            ext: "asf",
            mime: "audio/x-ms-asf"
          };
        }
        if (checkBytes(typeId, [192, 239, 25, 188, 77, 91, 207, 17, 168, 253, 0, 128, 95, 92, 68, 43])) {
          return {
            ext: "asf",
            mime: "video/x-ms-asf"
          };
        }
        break;
      }
      if (isUnknownFileSize && payload > maximumAsfHeaderPayloadSizeInBytes) {
        isMalformedAsf = true;
        break;
      }
      await safeIgnore(tokenizer, payload, {
        maximumLength: isUnknownFileSize ? maximumAsfHeaderPayloadSizeInBytes : tokenizer.fileInfo.size,
        reason: "ASF header payload"
      });
      if (tokenizer.position <= previousPosition) {
        isMalformedAsf = true;
        break;
      }
    }
  } catch (error) {
    if (error instanceof EndOfStreamError || error instanceof ParserHardLimitError) {
      if (hasUnknownFileSize(tokenizer)) {
        isMalformedAsf = true;
      }
    } else {
      throw error;
    }
  }
  if (isMalformedAsf) {
    return;
  }
  return {
    ext: "asf",
    mime: "application/vnd.ms-asf"
  };
}
var maximumAsfHeaderObjectCount, maximumAsfHeaderPayloadSizeInBytes;
var init_asf = __esm({
  "node_modules/file-type/source/detectors/asf.js"() {
    init_lib3();
    init_core();
    init_parser();
    maximumAsfHeaderObjectCount = 512;
    maximumAsfHeaderPayloadSizeInBytes = 1024 * 1024;
  }
});

// node_modules/file-type/source/index.js
function normalizeSampleSize(sampleSize) {
  if (!Number.isFinite(sampleSize)) {
    return reasonableDetectionSizeInBytes;
  }
  return Math.max(1, Math.trunc(sampleSize));
}
function normalizeMpegOffsetTolerance(mpegOffsetTolerance) {
  if (!Number.isFinite(mpegOffsetTolerance)) {
    return 0;
  }
  return Math.max(0, Math.min(maximumMpegOffsetTolerance, Math.trunc(mpegOffsetTolerance)));
}
function getKnownFileSizeOrMaximum(fileSize) {
  if (!Number.isFinite(fileSize)) {
    return Number.MAX_SAFE_INTEGER;
  }
  return Math.max(0, fileSize);
}
function importAtRuntime(specifier) {
  return import(
    /* @vite-ignore */
    /* webpackIgnore: true */
    specifier
  );
}
function toDefaultStream(stream) {
  return stream.pipeThrough(new TransformStream());
}
function readWithSignal(reader, signal) {
  if (signal === void 0) {
    return reader.read();
  }
  signal.throwIfAborted();
  return Promise.race([
    reader.read(),
    new Promise((_resolve, reject) => {
      signal.addEventListener("abort", () => {
        reject(signal.reason);
        reader.cancel(signal.reason).catch(() => {
        });
      }, { once: true });
    })
  ]);
}
function createByteLimitedReadableStream(stream, maximumBytes) {
  const reader = stream.getReader();
  let emittedBytes = 0;
  let isSourceDone = false;
  let isSourceCanceled = false;
  const cancelSource = async (reason) => {
    if (isSourceDone || isSourceCanceled) {
      return;
    }
    isSourceCanceled = true;
    await reader.cancel(reason);
  };
  return new ReadableStream({
    async pull(controller) {
      if (emittedBytes >= maximumBytes) {
        controller.close();
        await cancelSource();
        return;
      }
      const { done, value } = await reader.read();
      if (done || !value) {
        isSourceDone = true;
        controller.close();
        return;
      }
      const remainingBytes = maximumBytes - emittedBytes;
      if (value.length > remainingBytes) {
        controller.enqueue(value.subarray(0, remainingBytes));
        emittedBytes += remainingBytes;
        controller.close();
        await cancelSource();
        return;
      }
      controller.enqueue(value);
      emittedBytes += value.length;
    },
    async cancel(reason) {
      await cancelSource(reason);
    }
  });
}
async function fileTypeFromBuffer(input, options) {
  return new FileTypeParser(options).fromBuffer(input);
}
var reasonableDetectionSizeInBytes, maximumMpegOffsetTolerance, maximumNestedGzipDetectionSizeInBytes, maximumNestedGzipProbeDepth, unknownSizeGzipProbeTimeoutInMilliseconds, maximumId3HeaderSizeInBytes, maximumTiffTagCount, maximumDetectionReentryCount, maximumTiffStreamIfdOffsetInBytes, maximumTiffIfdOffsetInBytes, FileTypeParser, supportedExtensions, supportedMimeTypes;
var init_source = __esm({
  "node_modules/file-type/source/index.js"() {
    init_lib3();
    init_core();
    init_lib4();
    init_uint8array_extras();
    init_tokens();
    init_supported();
    init_parser();
    init_zip();
    init_ebml();
    init_png();
    init_asf();
    reasonableDetectionSizeInBytes = 4100;
    maximumMpegOffsetTolerance = reasonableDetectionSizeInBytes - 4;
    maximumNestedGzipDetectionSizeInBytes = maximumUntrustedSkipSizeInBytes;
    maximumNestedGzipProbeDepth = 1;
    unknownSizeGzipProbeTimeoutInMilliseconds = 100;
    maximumId3HeaderSizeInBytes = maximumUntrustedSkipSizeInBytes;
    maximumTiffTagCount = 512;
    maximumDetectionReentryCount = 256;
    maximumTiffStreamIfdOffsetInBytes = 1024 * 1024;
    maximumTiffIfdOffsetInBytes = maximumUntrustedSkipSizeInBytes;
    FileTypeParser = class _FileTypeParser {
      buffer;
      tokenizer;
      detectionReentryCount;
      constructor(options) {
        const normalizedMpegOffsetTolerance = normalizeMpegOffsetTolerance(options?.mpegOffsetTolerance);
        const maxBufferSize = options?.maxBufferSize ?? Infinity;
        if (maxBufferSize !== Infinity && (!Number.isSafeInteger(maxBufferSize) || maxBufferSize <= 0)) {
          throw new RangeError("maxBufferSize must be a positive safe integer or Infinity");
        }
        this.options = {
          ...options,
          mpegOffsetTolerance: normalizedMpegOffsetTolerance
        };
        this.detectors = [
          ...this.options.customDetectors ?? [],
          { id: "core", detect: (tokenizer) => this.detectConfident(tokenizer) },
          { id: "core.imprecise", detect: (tokenizer) => this.detectImprecise(tokenizer) }
        ];
        this.tokenizerOptions = {
          abortSignal: this.options.signal,
          maxBufferSize
        };
        this.gzipProbeDepth = 0;
      }
      getTokenizerOptions() {
        return {
          ...this.tokenizerOptions
        };
      }
      createTokenizerFromWebStream(stream) {
        return fromWebStream(toDefaultStream(stream), this.getTokenizerOptions());
      }
      async parseTokenizer(tokenizer, detectionReentryCount = 0) {
        this.detectionReentryCount = detectionReentryCount;
        const initialPosition = tokenizer.position;
        for (const detector of this.detectors) {
          let fileType;
          try {
            fileType = await detector.detect(tokenizer);
          } catch (error) {
            if (error instanceof EndOfStreamError) {
              return;
            }
            if (error instanceof ParserHardLimitError) {
              return;
            }
            throw error;
          }
          if (fileType) {
            return fileType;
          }
          if (initialPosition !== tokenizer.position) {
            return void 0;
          }
        }
      }
      async fromTokenizer(tokenizer) {
        try {
          return await this.parseTokenizer(tokenizer);
        } finally {
          await tokenizer.close();
        }
      }
      async fromBuffer(input) {
        if (!(input instanceof Uint8Array || input instanceof ArrayBuffer)) {
          throw new TypeError(`Expected the \`input\` argument to be of type \`Uint8Array\` or \`ArrayBuffer\`, got \`${typeof input}\``);
        }
        const buffer = input instanceof Uint8Array ? input : new Uint8Array(input);
        if (!(buffer?.length > 1)) {
          return;
        }
        return this.fromTokenizer(fromBuffer(buffer, this.getTokenizerOptions()));
      }
      async fromBlob(blob) {
        this.options.signal?.throwIfAborted();
        const tokenizer = fromBlob(blob, this.getTokenizerOptions());
        return this.fromTokenizer(tokenizer);
      }
      async fromStream(stream) {
        this.options.signal?.throwIfAborted();
        const tokenizer = this.createTokenizerFromWebStream(stream);
        return this.fromTokenizer(tokenizer);
      }
      async fromFile(path2) {
        this.options.signal?.throwIfAborted();
        const { fromFile: fromFile2, NotRegularFileError: NotRegularFileError2 } = await importAtRuntime("strtok3");
        let tokenizer;
        try {
          tokenizer = await fromFile2(path2, {
            ...this.getTokenizerOptions(),
            regularFileOnly: true
          });
        } catch (error) {
          if (error instanceof NotRegularFileError2) {
            return;
          }
          throw error;
        }
        return this.fromTokenizer(tokenizer);
      }
      async toDetectionStream(stream, options) {
        this.options.signal?.throwIfAborted();
        const sampleSize = normalizeSampleSize(options?.sampleSize ?? reasonableDetectionSizeInBytes);
        let detectedFileType;
        let hasStreamEnded = false;
        const reader = stream.getReader();
        const chunks = [];
        let totalSize = 0;
        try {
          while (totalSize < sampleSize) {
            const { value, done } = await readWithSignal(reader, this.options.signal);
            if (done || !value) {
              hasStreamEnded = true;
              break;
            }
            chunks.push(value);
            totalSize += value.length;
          }
          if (!hasStreamEnded && totalSize === sampleSize) {
            const { value, done } = await readWithSignal(reader, this.options.signal);
            if (done || !value) {
              hasStreamEnded = true;
            } else {
              chunks.push(value);
              totalSize += value.length;
            }
          }
        } finally {
          reader.releaseLock();
        }
        if (totalSize > 0) {
          const sample = chunks.length === 1 ? chunks[0] : concatUint8Arrays(chunks);
          try {
            detectedFileType = await this.fromBuffer(sample.subarray(0, sampleSize));
          } catch (error) {
            if (!(error instanceof EndOfStreamError)) {
              throw error;
            }
            detectedFileType = void 0;
          }
          if (!hasStreamEnded && detectedFileType?.ext === "pages") {
            detectedFileType = {
              ext: "zip",
              mime: "application/zip"
            };
          }
        }
        const transformStream = new TransformStream({
          start(controller) {
            for (const chunk of chunks) {
              controller.enqueue(chunk);
            }
          },
          transform(chunk, controller) {
            controller.enqueue(chunk);
          }
        });
        const newStream = stream.pipeThrough(transformStream);
        newStream.fileType = detectedFileType;
        return newStream;
      }
      async detectGzip(tokenizer) {
        if (this.gzipProbeDepth >= maximumNestedGzipProbeDepth) {
          return {
            ext: "gz",
            mime: "application/gzip"
          };
        }
        const gzipHandler = new GzipHandler(tokenizer);
        const limitedInflatedStream = createByteLimitedReadableStream(gzipHandler.inflate(), maximumNestedGzipDetectionSizeInBytes);
        const hasUnknownSize = hasUnknownFileSize(tokenizer);
        let timeout;
        let probeSignal;
        let probeParser;
        let compressedFileType;
        if (hasUnknownSize) {
          const timeoutController = new AbortController();
          timeout = setTimeout(() => {
            timeoutController.abort(new DOMException(`Operation timed out after ${unknownSizeGzipProbeTimeoutInMilliseconds} ms`, "TimeoutError"));
          }, unknownSizeGzipProbeTimeoutInMilliseconds);
          probeSignal = this.options.signal === void 0 ? timeoutController.signal : AbortSignal.any([this.options.signal, timeoutController.signal]);
          probeParser = new _FileTypeParser({
            ...this.options,
            signal: probeSignal
          });
          probeParser.gzipProbeDepth = this.gzipProbeDepth + 1;
        } else {
          this.gzipProbeDepth++;
        }
        try {
          compressedFileType = await (probeParser ?? this).fromStream(limitedInflatedStream);
        } catch (error) {
          if (error?.name === "AbortError" && probeSignal?.reason?.name !== "TimeoutError") {
            throw error;
          }
        } finally {
          clearTimeout(timeout);
          if (!hasUnknownSize) {
            this.gzipProbeDepth--;
          }
        }
        if (compressedFileType?.ext === "tar") {
          return {
            ext: "tar.gz",
            mime: "application/gzip"
          };
        }
        return {
          ext: "gz",
          mime: "application/gzip"
        };
      }
      check(header, options) {
        return checkBytes(this.buffer, header, options);
      }
      checkString(header, options) {
        return this.check(stringToBytes(header, options?.encoding), options);
      }
      // Detections with a high degree of certainty in identifying the correct file type
      async detectConfident(tokenizer) {
        this.buffer = new Uint8Array(reasonableDetectionSizeInBytes);
        if (tokenizer.fileInfo.size === void 0) {
          tokenizer.fileInfo.size = Number.MAX_SAFE_INTEGER;
        }
        this.tokenizer = tokenizer;
        if (hasUnknownFileSize(tokenizer)) {
          await tokenizer.peekBuffer(this.buffer, { length: 3, mayBeLess: true });
          if (this.check([31, 139, 8])) {
            return this.detectGzip(tokenizer);
          }
        }
        await tokenizer.peekBuffer(this.buffer, { length: 32, mayBeLess: true });
        if (this.check([66, 77])) {
          return {
            ext: "bmp",
            mime: "image/bmp"
          };
        }
        if (this.check([11, 119])) {
          return {
            ext: "ac3",
            mime: "audio/vnd.dolby.dd-raw"
          };
        }
        if (this.check([120, 1])) {
          return {
            ext: "dmg",
            mime: "application/x-apple-diskimage"
          };
        }
        if (this.check([77, 90])) {
          return {
            ext: "exe",
            mime: "application/x-msdownload"
          };
        }
        if (this.check([37, 33])) {
          await tokenizer.peekBuffer(this.buffer, { length: 24, mayBeLess: true });
          if (this.checkString("PS-Adobe-", { offset: 2 }) && this.checkString(" EPSF-", { offset: 14 })) {
            return {
              ext: "eps",
              mime: "application/eps"
            };
          }
          return {
            ext: "ps",
            mime: "application/postscript"
          };
        }
        if (this.check([31, 160]) || this.check([31, 157])) {
          return {
            ext: "Z",
            mime: "application/x-compress"
          };
        }
        if (this.check([199, 113])) {
          return {
            ext: "cpio",
            mime: "application/x-cpio"
          };
        }
        if (this.check([96, 234])) {
          return {
            ext: "arj",
            mime: "application/x-arj"
          };
        }
        if (this.check([239, 187, 191])) {
          if (this.detectionReentryCount >= maximumDetectionReentryCount) {
            return;
          }
          this.detectionReentryCount++;
          await this.tokenizer.ignore(3);
          return this.detectConfident(tokenizer);
        }
        if (this.check([71, 73, 70])) {
          return {
            ext: "gif",
            mime: "image/gif"
          };
        }
        if (this.check([73, 73, 188])) {
          return {
            ext: "jxr",
            mime: "image/vnd.ms-photo"
          };
        }
        if (this.check([31, 139, 8])) {
          return this.detectGzip(tokenizer);
        }
        if (this.check([66, 90, 104])) {
          return {
            ext: "bz2",
            mime: "application/x-bzip2"
          };
        }
        if (this.checkString("ID3")) {
          await safeIgnore(tokenizer, 6, {
            maximumLength: 6,
            reason: "ID3 header prefix"
          });
          const id3HeaderLength = await tokenizer.readToken(uint32SyncSafeToken);
          const isUnknownFileSize = hasUnknownFileSize(tokenizer);
          if (!Number.isFinite(id3HeaderLength) || id3HeaderLength < 0 || isUnknownFileSize && (id3HeaderLength > maximumId3HeaderSizeInBytes || tokenizer.position + id3HeaderLength > maximumId3HeaderSizeInBytes)) {
            return;
          }
          if (tokenizer.position + id3HeaderLength > tokenizer.fileInfo.size) {
            if (isUnknownFileSize) {
              return;
            }
            return {
              ext: "mp3",
              mime: "audio/mpeg"
            };
          }
          try {
            await safeIgnore(tokenizer, id3HeaderLength, {
              maximumLength: isUnknownFileSize ? maximumId3HeaderSizeInBytes : tokenizer.fileInfo.size,
              reason: "ID3 payload"
            });
          } catch (error) {
            if (error instanceof EndOfStreamError) {
              return;
            }
            throw error;
          }
          if (this.detectionReentryCount >= maximumDetectionReentryCount) {
            return;
          }
          this.detectionReentryCount++;
          return this.parseTokenizer(tokenizer, this.detectionReentryCount);
        }
        if (this.checkString("MP+")) {
          return {
            ext: "mpc",
            mime: "audio/x-musepack"
          };
        }
        if ((this.buffer[0] === 67 || this.buffer[0] === 70) && this.check([87, 83], { offset: 1 })) {
          return {
            ext: "swf",
            mime: "application/x-shockwave-flash"
          };
        }
        if (this.check([255, 216, 255])) {
          if (this.check([247], { offset: 3 })) {
            return {
              ext: "jls",
              mime: "image/jls"
            };
          }
          return {
            ext: "jpg",
            mime: "image/jpeg"
          };
        }
        if (this.check([79, 98, 106, 1])) {
          return {
            ext: "avro",
            mime: "application/avro"
          };
        }
        if (this.checkString("FLIF")) {
          return {
            ext: "flif",
            mime: "image/flif"
          };
        }
        if (this.checkString("8BPS")) {
          return {
            ext: "psd",
            mime: "image/vnd.adobe.photoshop"
          };
        }
        if (this.checkString("MPCK")) {
          return {
            ext: "mpc",
            mime: "audio/x-musepack"
          };
        }
        if (this.checkString("FORM")) {
          return {
            ext: "aif",
            mime: "audio/aiff"
          };
        }
        if (this.checkString("caff") && this.check([0, 1], { offset: 4 }) && this.checkString("desc", { offset: 8 })) {
          return {
            ext: "caf",
            mime: "audio/x-caf"
            // Non-standard
          };
        }
        if (this.checkString("icns", { offset: 0 })) {
          return {
            ext: "icns",
            mime: "image/icns"
          };
        }
        if (this.check([80, 75, 3, 4])) {
          return detectZip(tokenizer);
        }
        if (this.checkString("OggS")) {
          await tokenizer.ignore(28);
          const type = new Uint8Array(8);
          await tokenizer.readBuffer(type);
          if (checkBytes(type, [79, 112, 117, 115, 72, 101, 97, 100])) {
            return {
              ext: "opus",
              mime: "audio/ogg; codecs=opus"
            };
          }
          if (checkBytes(type, [128, 116, 104, 101, 111, 114, 97])) {
            return {
              ext: "ogv",
              mime: "video/ogg"
            };
          }
          if (checkBytes(type, [1, 118, 105, 100, 101, 111, 0])) {
            return {
              ext: "ogm",
              mime: "video/ogg"
            };
          }
          if (checkBytes(type, [127, 70, 76, 65, 67])) {
            return {
              ext: "oga",
              mime: "audio/ogg"
            };
          }
          if (checkBytes(type, [83, 112, 101, 101, 120, 32, 32])) {
            return {
              ext: "spx",
              mime: "audio/ogg"
            };
          }
          if (checkBytes(type, [1, 118, 111, 114, 98, 105, 115])) {
            return {
              ext: "ogg",
              mime: "audio/ogg"
            };
          }
          return {
            ext: "ogx",
            mime: "application/ogg"
          };
        }
        if (this.check([80, 75]) && [3, 5, 7].includes(this.buffer[2]) && [4, 6, 8].includes(this.buffer[3])) {
          return {
            ext: "zip",
            mime: "application/zip"
          };
        }
        if (this.checkString("MThd")) {
          return {
            ext: "mid",
            mime: "audio/midi"
          };
        }
        if (this.checkString("wOFF") && (this.check([0, 1, 0, 0], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))) {
          return {
            ext: "woff",
            mime: "font/woff"
          };
        }
        if (this.checkString("wOF2") && (this.check([0, 1, 0, 0], { offset: 4 }) || this.checkString("OTTO", { offset: 4 }))) {
          return {
            ext: "woff2",
            mime: "font/woff2"
          };
        }
        if (this.check([212, 195, 178, 161]) || this.check([161, 178, 195, 212])) {
          return {
            ext: "pcap",
            mime: "application/vnd.tcpdump.pcap"
          };
        }
        if (this.checkString("DSD ")) {
          return {
            ext: "dsf",
            mime: "audio/x-dsf"
            // Non-standard
          };
        }
        if (this.checkString("LZIP")) {
          return {
            ext: "lz",
            mime: "application/lzip"
          };
        }
        if (this.checkString("fLaC")) {
          return {
            ext: "flac",
            mime: "audio/flac"
          };
        }
        if (this.check([66, 80, 71, 251])) {
          return {
            ext: "bpg",
            mime: "image/bpg"
          };
        }
        if (this.checkString("wvpk")) {
          return {
            ext: "wv",
            mime: "audio/wavpack"
          };
        }
        if (this.checkString("%PDF")) {
          return {
            ext: "pdf",
            mime: "application/pdf"
          };
        }
        if (this.check([0, 97, 115, 109])) {
          return {
            ext: "wasm",
            mime: "application/wasm"
          };
        }
        if (this.check([73, 73])) {
          const fileType = await this.readTiffHeader(false);
          if (fileType) {
            return fileType;
          }
        }
        if (this.check([77, 77])) {
          const fileType = await this.readTiffHeader(true);
          if (fileType) {
            return fileType;
          }
        }
        if (this.checkString("MAC ")) {
          return {
            ext: "ape",
            mime: "audio/ape"
          };
        }
        if (this.check([26, 69, 223, 163])) {
          return detectEbml(tokenizer);
        }
        if (this.checkString("SQLi")) {
          return {
            ext: "sqlite",
            mime: "application/x-sqlite3"
          };
        }
        if (this.check([78, 69, 83, 26])) {
          return {
            ext: "nes",
            mime: "application/x-nintendo-nes-rom"
          };
        }
        if (this.checkString("Cr24")) {
          return {
            ext: "crx",
            mime: "application/x-google-chrome-extension"
          };
        }
        if (this.checkString("MSCF") || this.checkString("ISc(")) {
          return {
            ext: "cab",
            mime: "application/vnd.ms-cab-compressed"
          };
        }
        if (this.check([237, 171, 238, 219])) {
          return {
            ext: "rpm",
            mime: "application/x-rpm"
          };
        }
        if (this.check([197, 208, 211, 198])) {
          return {
            ext: "eps",
            mime: "application/eps"
          };
        }
        if (this.check([40, 181, 47, 253])) {
          return {
            ext: "zst",
            mime: "application/zstd"
          };
        }
        if (this.check([127, 69, 76, 70])) {
          return {
            ext: "elf",
            mime: "application/x-elf"
          };
        }
        if (this.check([33, 66, 68, 78])) {
          return {
            ext: "pst",
            mime: "application/vnd.ms-outlook"
          };
        }
        if (this.checkString("PAR1") || this.checkString("PARE")) {
          return {
            ext: "parquet",
            mime: "application/vnd.apache.parquet"
          };
        }
        if (this.checkString("ttcf")) {
          return {
            ext: "ttc",
            mime: "font/collection"
          };
        }
        if (this.check([254, 237, 250, 206]) || this.check([254, 237, 250, 207]) || this.check([206, 250, 237, 254]) || this.check([207, 250, 237, 254])) {
          return {
            ext: "macho",
            mime: "application/x-mach-binary"
          };
        }
        if (this.check([4, 34, 77, 24])) {
          return {
            ext: "lz4",
            mime: "application/x-lz4"
            // Informal, used by freedesktop.org shared-mime-info
          };
        }
        if (this.checkString("regf")) {
          return {
            ext: "dat",
            mime: "application/x-ft-windows-registry-hive"
          };
        }
        if (this.checkString("$FL2") || this.checkString("$FL3")) {
          return {
            ext: "sav",
            mime: "application/x-spss-sav"
          };
        }
        if (this.check([79, 84, 84, 79, 0])) {
          return {
            ext: "otf",
            mime: "font/otf"
          };
        }
        if (this.checkString("#!AMR")) {
          return {
            ext: "amr",
            mime: "audio/amr"
          };
        }
        if (this.checkString(String.raw`{\rtf`)) {
          return {
            ext: "rtf",
            mime: "application/rtf"
          };
        }
        if (this.check([70, 76, 86, 1])) {
          return {
            ext: "flv",
            mime: "video/x-flv"
          };
        }
        if (this.checkString("IMPM")) {
          return {
            ext: "it",
            mime: "audio/x-it"
          };
        }
        if (this.checkString("-lh0-", { offset: 2 }) || this.checkString("-lh1-", { offset: 2 }) || this.checkString("-lh2-", { offset: 2 }) || this.checkString("-lh3-", { offset: 2 }) || this.checkString("-lh4-", { offset: 2 }) || this.checkString("-lh5-", { offset: 2 }) || this.checkString("-lh6-", { offset: 2 }) || this.checkString("-lh7-", { offset: 2 }) || this.checkString("-lzs-", { offset: 2 }) || this.checkString("-lz4-", { offset: 2 }) || this.checkString("-lz5-", { offset: 2 }) || this.checkString("-lhd-", { offset: 2 })) {
          return {
            ext: "lzh",
            mime: "application/x-lzh-compressed"
          };
        }
        if (this.check([0, 0, 1, 186])) {
          if (this.check([33], { offset: 4, mask: [241] })) {
            return {
              ext: "mpg",
              // May also be .ps, .mpeg
              mime: "video/MP1S"
            };
          }
          if (this.check([68], { offset: 4, mask: [196] })) {
            return {
              ext: "mpg",
              // May also be .mpg, .m2p, .vob or .sub
              mime: "video/MP2P"
            };
          }
        }
        if (this.checkString("ITSF")) {
          return {
            ext: "chm",
            mime: "application/vnd.ms-htmlhelp"
          };
        }
        if (this.check([202, 254, 186, 190])) {
          const machOArchitectureCount = UINT32_BE.get(this.buffer, 4);
          if (machOArchitectureCount > 0 && machOArchitectureCount <= 30) {
            return {
              ext: "macho",
              mime: "application/x-mach-binary"
            };
          }
          const javaClassFileMajorVersion = UINT16_BE.get(this.buffer, 6);
          if (javaClassFileMajorVersion > 30) {
            return {
              ext: "class",
              mime: "application/java-vm"
            };
          }
        }
        if (this.checkString(".RMF")) {
          return {
            ext: "rm",
            mime: "application/vnd.rn-realmedia"
          };
        }
        if (this.checkString("DRACO")) {
          return {
            ext: "drc",
            mime: "application/x-ft-draco"
          };
        }
        if (this.check([253, 55, 122, 88, 90, 0])) {
          return {
            ext: "xz",
            mime: "application/x-xz"
          };
        }
        if (this.checkString("<?xml ")) {
          return {
            ext: "xml",
            mime: "application/xml"
          };
        }
        if (this.check([55, 122, 188, 175, 39, 28])) {
          return {
            ext: "7z",
            mime: "application/x-7z-compressed"
          };
        }
        if (this.check([82, 97, 114, 33, 26, 7]) && (this.buffer[6] === 0 || this.buffer[6] === 1)) {
          return {
            ext: "rar",
            mime: "application/x-rar-compressed"
          };
        }
        if (this.checkString("solid ")) {
          return {
            ext: "stl",
            mime: "model/stl"
          };
        }
        if (this.checkString("AC")) {
          const version = new StringType(4, "latin1").get(this.buffer, 2);
          if (/^\d+$/v.test(version) && version >= 1e3 && version <= 1050) {
            return {
              ext: "dwg",
              mime: "image/vnd.dwg"
            };
          }
        }
        if (this.checkString("070707")) {
          return {
            ext: "cpio",
            mime: "application/x-cpio"
          };
        }
        if (this.checkString("BLENDER")) {
          return {
            ext: "blend",
            mime: "application/x-blender"
          };
        }
        if (this.checkString("!<arch>")) {
          await tokenizer.ignore(8);
          const string = await tokenizer.readToken(new StringType(13, "ascii"));
          if (string === "debian-binary") {
            return {
              ext: "deb",
              mime: "application/x-deb"
            };
          }
          return {
            ext: "ar",
            mime: "application/x-unix-archive"
          };
        }
        if (this.checkString("WEBVTT") && // One of LF, CR, tab, space, or end of file must follow "WEBVTT" per the spec (see `fixture/fixture-vtt-*.vtt` for examples). Note that `\0` is technically the null character (there is no such thing as an EOF character). However, checking for `\0` gives us the same result as checking for the end of the stream.
        ["\n", "\r", "	", " ", "\0"].some((char7) => this.checkString(char7, { offset: 6 }))) {
          return {
            ext: "vtt",
            mime: "text/vtt"
          };
        }
        if (this.check([137, 80, 78, 71, 13, 10, 26, 10])) {
          return detectPng(tokenizer);
        }
        if (this.check([65, 82, 82, 79, 87, 49, 0, 0])) {
          return {
            ext: "arrow",
            mime: "application/vnd.apache.arrow.file"
          };
        }
        if (this.check([103, 108, 84, 70, 2, 0, 0, 0])) {
          return {
            ext: "glb",
            mime: "model/gltf-binary"
          };
        }
        if (this.check([102, 114, 101, 101], { offset: 4 }) || this.check([109, 100, 97, 116], { offset: 4 }) || this.check([109, 111, 111, 118], { offset: 4 }) || this.check([119, 105, 100, 101], { offset: 4 })) {
          return {
            ext: "mov",
            mime: "video/quicktime"
          };
        }
        if (this.check([73, 73, 82, 79, 8, 0, 0, 0, 24])) {
          return {
            ext: "orf",
            mime: "image/x-olympus-orf"
          };
        }
        if (this.checkString("gimp xcf ")) {
          return {
            ext: "xcf",
            mime: "image/x-xcf"
          };
        }
        if (this.checkString("ftyp", { offset: 4 }) && (this.buffer[8] & 96) !== 0) {
          const brandMajor = new StringType(4, "latin1").get(this.buffer, 8).replace("\0", " ").trim();
          switch (brandMajor) {
            case "avif":
            case "avis":
              return { ext: "avif", mime: "image/avif" };
            case "mif1":
              return { ext: "heic", mime: "image/heif" };
            case "msf1":
              return { ext: "heic", mime: "image/heif-sequence" };
            case "heic":
            case "heix":
              return { ext: "heic", mime: "image/heic" };
            case "hevc":
            case "hevx":
              return { ext: "heic", mime: "image/heic-sequence" };
            case "qt":
              return { ext: "mov", mime: "video/quicktime" };
            case "M4V":
            case "M4VH":
            case "M4VP":
              return { ext: "m4v", mime: "video/x-m4v" };
            case "M4P":
              return { ext: "m4p", mime: "video/mp4" };
            case "M4B":
              return { ext: "m4b", mime: "audio/mp4" };
            case "M4A":
              return { ext: "m4a", mime: "audio/x-m4a" };
            case "F4V":
              return { ext: "f4v", mime: "video/mp4" };
            case "F4P":
              return { ext: "f4p", mime: "video/mp4" };
            case "F4A":
              return { ext: "f4a", mime: "audio/mp4" };
            case "F4B":
              return { ext: "f4b", mime: "audio/mp4" };
            case "crx":
              return { ext: "cr3", mime: "image/x-canon-cr3" };
            default:
              if (brandMajor.startsWith("3g")) {
                if (brandMajor.startsWith("3g2")) {
                  return { ext: "3g2", mime: "video/3gpp2" };
                }
                return { ext: "3gp", mime: "video/3gpp" };
              }
              return { ext: "mp4", mime: "video/mp4" };
          }
        }
        if (this.checkString("REGEDIT4\r\n")) {
          return {
            ext: "reg",
            mime: "application/x-ms-regedit"
          };
        }
        if (this.check([82, 73, 70, 70])) {
          if (this.checkString("WEBP", { offset: 8 })) {
            return {
              ext: "webp",
              mime: "image/webp"
            };
          }
          if (this.check([65, 86, 73], { offset: 8 })) {
            return {
              ext: "avi",
              mime: "video/vnd.avi"
            };
          }
          if (this.check([87, 65, 86, 69], { offset: 8 })) {
            return {
              ext: "wav",
              mime: "audio/wav"
            };
          }
          if (this.check([81, 76, 67, 77], { offset: 8 })) {
            return {
              ext: "qcp",
              mime: "audio/qcelp"
            };
          }
        }
        if (this.check([73, 73, 85, 0, 24, 0, 0, 0, 136, 231, 116, 216])) {
          return {
            ext: "rw2",
            mime: "image/x-panasonic-rw2"
          };
        }
        if (this.check([48, 38, 178, 117, 142, 102, 207, 17, 166, 217])) {
          return detectAsf(tokenizer);
        }
        if (this.check([171, 75, 84, 88, 32, 49, 49, 187, 13, 10, 26, 10])) {
          return {
            ext: "ktx",
            mime: "image/ktx"
          };
        }
        if ((this.check([126, 16, 4]) || this.check([126, 24, 4])) && this.check([48, 77, 73, 69], { offset: 4 })) {
          return {
            ext: "mie",
            mime: "application/x-mie"
          };
        }
        if (this.check([39, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], { offset: 2 })) {
          return {
            ext: "shp",
            mime: "application/x-esri-shape"
          };
        }
        if (this.check([255, 79, 255, 81])) {
          return {
            ext: "j2c",
            mime: "image/j2c"
          };
        }
        if (this.check([0, 0, 0, 12, 106, 80, 32, 32, 13, 10, 135, 10])) {
          await tokenizer.ignore(20);
          const type = await tokenizer.readToken(new StringType(4, "ascii"));
          switch (type) {
            case "jp2 ":
              return {
                ext: "jp2",
                mime: "image/jp2"
              };
            case "jpx ":
              return {
                ext: "jpx",
                mime: "image/jpx"
              };
            case "jpm ":
              return {
                ext: "jpm",
                mime: "image/jpm"
              };
            case "mjp2":
              return {
                ext: "mj2",
                mime: "image/mj2"
              };
            default:
              return;
          }
        }
        if (this.check([255, 10]) || this.check([0, 0, 0, 12, 74, 88, 76, 32, 13, 10, 135, 10])) {
          return {
            ext: "jxl",
            mime: "image/jxl"
          };
        }
        if (this.check([254, 255])) {
          if (this.checkString("<?xml ", { offset: 2, encoding: "utf-16be" })) {
            return {
              ext: "xml",
              mime: "application/xml"
            };
          }
          return void 0;
        }
        if (this.check([208, 207, 17, 224, 161, 177, 26, 225])) {
          return {
            ext: "cfb",
            mime: "application/x-cfb"
          };
        }
        if (this.checkString("FRM8") && this.checkString("DSD ", { offset: 12 })) {
          return {
            ext: "dff",
            mime: "audio/x-dff"
            // Non-standard
          };
        }
        await tokenizer.peekBuffer(this.buffer, { length: Math.min(256, tokenizer.fileInfo.size), mayBeLess: true });
        if (this.check([97, 99, 115, 112], { offset: 36 })) {
          return {
            ext: "icc",
            mime: "application/vnd.iccprofile"
          };
        }
        if (this.checkString("**ACE", { offset: 7 }) && this.checkString("**", { offset: 12 })) {
          return {
            ext: "ace",
            mime: "application/x-ace-compressed"
          };
        }
        if (this.checkString("BEGIN:")) {
          if (this.checkString("VCARD", { offset: 6 })) {
            return {
              ext: "vcf",
              mime: "text/vcard"
            };
          }
          if (this.checkString("VCALENDAR", { offset: 6 })) {
            return {
              ext: "ics",
              mime: "text/calendar"
            };
          }
        }
        if (this.checkString("FUJIFILMCCD-RAW")) {
          return {
            ext: "raf",
            mime: "image/x-fujifilm-raf"
          };
        }
        if (this.checkString("Extended Module:")) {
          return {
            ext: "xm",
            mime: "audio/x-xm"
          };
        }
        if (this.checkString("Creative Voice File")) {
          return {
            ext: "voc",
            mime: "audio/x-voc"
          };
        }
        if (this.check([4, 0, 0, 0]) && this.buffer.length >= 16) {
          const jsonSize = new DataView(this.buffer.buffer).getUint32(12, true);
          if (jsonSize > 12 && this.buffer.length >= jsonSize + 16) {
            try {
              const header = new TextDecoder().decode(this.buffer.subarray(16, jsonSize + 16));
              const json = JSON.parse(header);
              if (json.files) {
                return {
                  ext: "asar",
                  mime: "application/x-asar"
                };
              }
            } catch {
            }
          }
        }
        if (this.check([6, 14, 43, 52, 2, 5, 1, 1, 13, 1, 2, 1, 1, 2])) {
          return {
            ext: "mxf",
            mime: "application/mxf"
          };
        }
        if (this.checkString("SCRM", { offset: 44 })) {
          return {
            ext: "s3m",
            mime: "audio/x-s3m"
          };
        }
        if (this.check([71]) && this.check([71], { offset: 188 })) {
          return {
            ext: "mts",
            mime: "video/mp2t"
          };
        }
        if (this.check([71], { offset: 4 }) && this.check([71], { offset: 196 })) {
          return {
            ext: "mts",
            mime: "video/mp2t"
          };
        }
        if (this.check([66, 79, 79, 75, 77, 79, 66, 73], { offset: 60 })) {
          return {
            ext: "mobi",
            mime: "application/x-mobipocket-ebook"
          };
        }
        if (this.check([68, 73, 67, 77], { offset: 128 })) {
          return {
            ext: "dcm",
            mime: "application/dicom"
          };
        }
        if (this.check([76, 0, 0, 0, 1, 20, 2, 0, 0, 0, 0, 0, 192, 0, 0, 0, 0, 0, 0, 70])) {
          return {
            ext: "lnk",
            mime: "application/x-ms-shortcut"
            // Informal, used by freedesktop.org shared-mime-info
          };
        }
        if (this.check([98, 111, 111, 107, 0, 0, 0, 0, 109, 97, 114, 107, 0, 0, 0, 0])) {
          return {
            ext: "alias",
            mime: "application/x-ft-apple.alias"
          };
        }
        if (this.checkString("Kaydara FBX Binary  \0")) {
          return {
            ext: "fbx",
            mime: "application/x-ft-fbx"
          };
        }
        if (this.check([76, 80], { offset: 34 }) && (this.check([0, 0, 1], { offset: 8 }) || this.check([1, 0, 2], { offset: 8 }) || this.check([2, 0, 2], { offset: 8 }))) {
          return {
            ext: "eot",
            mime: "application/vnd.ms-fontobject"
          };
        }
        if (this.check([6, 6, 237, 245, 216, 29, 70, 229, 189, 49, 239, 231, 254, 116, 183, 29])) {
          return {
            ext: "indd",
            mime: "application/x-indesign"
          };
        }
        if (this.check([255, 255, 0, 0, 7, 0, 0, 0, 4, 0, 0, 0, 1, 0, 1, 0]) || this.check([0, 0, 255, 255, 0, 0, 0, 7, 0, 0, 0, 4, 0, 1, 0, 1])) {
          return {
            ext: "jmp",
            mime: "application/x-jmp-data"
          };
        }
        await tokenizer.peekBuffer(this.buffer, { length: Math.min(512, tokenizer.fileInfo.size), mayBeLess: true });
        if (this.checkString("ustar", { offset: 257 }) && (this.checkString("\0", { offset: 262 }) || this.checkString(" ", { offset: 262 })) || this.check([0, 0, 0, 0, 0, 0], { offset: 257 }) && tarHeaderChecksumMatches(this.buffer)) {
          return {
            ext: "tar",
            mime: "application/x-tar"
          };
        }
        if (this.check([255, 254])) {
          const encoding = "utf-16le";
          if (this.checkString("<?xml ", { offset: 2, encoding })) {
            return {
              ext: "xml",
              mime: "application/xml"
            };
          }
          if (this.check([255, 14], { offset: 2 }) && this.checkString("SketchUp Model", { offset: 4, encoding })) {
            return {
              ext: "skp",
              mime: "application/vnd.sketchup.skp"
            };
          }
          if (this.checkString("Windows Registry Editor Version 5.00\r\n", { offset: 2, encoding })) {
            return {
              ext: "reg",
              mime: "application/x-ms-regedit"
            };
          }
          return void 0;
        }
        if (this.checkString("-----BEGIN PGP MESSAGE-----")) {
          return {
            ext: "pgp",
            mime: "application/pgp-encrypted"
          };
        }
        const isoStandardIdentifierOffset = 32769;
        const isoStandardIdentifierLength = 5;
        if (tokenizer.supportsRandomAccess() && tokenizer.fileInfo.size >= isoStandardIdentifierOffset + isoStandardIdentifierLength) {
          const isoStandardIdentifier = new Uint8Array(isoStandardIdentifierLength);
          await tokenizer.peekBuffer(isoStandardIdentifier, {
            position: isoStandardIdentifierOffset,
            length: isoStandardIdentifierLength,
            mayBeLess: true
          });
          if (checkBytes(isoStandardIdentifier, stringToBytes("CD001"))) {
            return {
              ext: "iso",
              mime: "application/x-iso9660-image"
            };
          }
        }
      }
      // Detections with limited supporting data, resulting in a higher likelihood of false positives
      async detectImprecise(tokenizer) {
        this.buffer = new Uint8Array(reasonableDetectionSizeInBytes);
        const fileSize = getKnownFileSizeOrMaximum(tokenizer.fileInfo.size);
        await tokenizer.peekBuffer(this.buffer, { length: Math.min(8, fileSize), mayBeLess: true });
        if (this.check([0, 0, 1, 186]) || this.check([0, 0, 1, 179])) {
          return {
            ext: "mpg",
            mime: "video/mpeg"
          };
        }
        if (this.check([0, 1, 0, 0, 0])) {
          return {
            ext: "ttf",
            mime: "font/ttf"
          };
        }
        if (this.check([0, 0, 1, 0])) {
          return {
            ext: "ico",
            mime: "image/x-icon"
          };
        }
        if (this.check([0, 0, 2, 0])) {
          return {
            ext: "cur",
            mime: "image/x-icon"
          };
        }
        await tokenizer.peekBuffer(this.buffer, { length: Math.min(4 + this.options.mpegOffsetTolerance, fileSize), mayBeLess: true });
        if (this.buffer.length >= 4 + this.options.mpegOffsetTolerance) {
          for (let depth = 0; depth <= this.options.mpegOffsetTolerance; ++depth) {
            const type = this.scanMpeg(depth);
            if (type) {
              return type;
            }
          }
        }
      }
      async readTiffTag(isBigEndian) {
        const tagId = await this.tokenizer.readToken(isBigEndian ? UINT16_BE : UINT16_LE);
        await this.tokenizer.ignore(10);
        switch (tagId) {
          case 50341:
            return {
              ext: "arw",
              mime: "image/x-sony-arw"
            };
          case 50706:
            return {
              ext: "dng",
              mime: "image/x-adobe-dng"
            };
          default:
        }
      }
      async readTiffIFD(isBigEndian) {
        const numberOfTags = await this.tokenizer.readToken(isBigEndian ? UINT16_BE : UINT16_LE);
        if (numberOfTags > maximumTiffTagCount) {
          return;
        }
        if (hasUnknownFileSize(this.tokenizer) && 2 + numberOfTags * 12 > maximumTiffIfdOffsetInBytes) {
          return;
        }
        for (let n = 0; n < numberOfTags; ++n) {
          const fileType = await this.readTiffTag(isBigEndian);
          if (fileType) {
            return fileType;
          }
        }
      }
      async readTiffHeader(isBigEndian) {
        const tiffFileType = {
          ext: "tif",
          mime: "image/tiff"
        };
        const version = (isBigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 2);
        const ifdOffset = (isBigEndian ? UINT32_BE : UINT32_LE).get(this.buffer, 4);
        if (version === 42) {
          if (ifdOffset >= 6) {
            if (this.checkString("CR", { offset: 8 })) {
              return {
                ext: "cr2",
                mime: "image/x-canon-cr2"
              };
            }
            if (ifdOffset >= 8) {
              const someId1 = (isBigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 8);
              const someId2 = (isBigEndian ? UINT16_BE : UINT16_LE).get(this.buffer, 10);
              if (someId1 === 28 && someId2 === 254 || someId1 === 31 && someId2 === 11) {
                return {
                  ext: "nef",
                  mime: "image/x-nikon-nef"
                };
              }
            }
          }
          if (hasUnknownFileSize(this.tokenizer) && ifdOffset > maximumTiffStreamIfdOffsetInBytes) {
            return tiffFileType;
          }
          const maximumTiffOffset = hasUnknownFileSize(this.tokenizer) ? maximumTiffIfdOffsetInBytes : this.tokenizer.fileInfo.size;
          try {
            await safeIgnore(this.tokenizer, ifdOffset, {
              maximumLength: maximumTiffOffset,
              reason: "TIFF IFD offset"
            });
          } catch (error) {
            if (error instanceof EndOfStreamError) {
              return;
            }
            throw error;
          }
          let fileType;
          try {
            fileType = await this.readTiffIFD(isBigEndian);
          } catch (error) {
            if (error instanceof EndOfStreamError) {
              return;
            }
            throw error;
          }
          return fileType ?? tiffFileType;
        }
        if (version === 43) {
          return tiffFileType;
        }
      }
      /**
      	Scan check MPEG 1 or 2 Layer 3 header, or 'layer 0' for ADTS (MPEG sync-word 0xFFE).
      
      	@param {number} offset - Offset to scan for sync-preamble.
      	@returns {{ext: string, mime: string} | undefined} The detected file type, if any.
      	*/
      scanMpeg(offset) {
        if (this.check([255, 224], { offset, mask: [255, 224] })) {
          if (this.check([16], { offset: offset + 1, mask: [22] })) {
            return {
              ext: "aac",
              mime: "audio/aac"
            };
          }
          if (this.check([255, 254], { offset })) {
            return;
          }
          if (this.check([8], { offset: offset + 1, mask: [24] })) {
            return;
          }
          if (this.check([240], { offset: offset + 2, mask: [240] })) {
            return;
          }
          if (this.check([12], { offset: offset + 2, mask: [12] })) {
            return;
          }
          if (this.check([2], { offset: offset + 1, mask: [6] })) {
            return {
              ext: "mp3",
              mime: "audio/mpeg"
            };
          }
          if (this.check([4], { offset: offset + 1, mask: [6] })) {
            return {
              ext: "mp2",
              mime: "audio/mpeg"
            };
          }
          if (this.check([6], { offset: offset + 1, mask: [6] })) {
            return {
              ext: "mp1",
              mime: "audio/mpeg"
            };
          }
        }
      }
    };
    supportedExtensions = new Set(extensions);
    supportedMimeTypes = new Set(mimeTypes);
  }
});

// node_modules/media-typer/dist/index.js
function parse2(str) {
  if (!typeRegExp.test(str)) {
    throw new TypeError(`Invalid media type: ${str}`);
  }
  const slashIndex = str.indexOf("/");
  const type = str.slice(0, slashIndex).toLowerCase();
  let subtype = str.slice(slashIndex + 1).toLowerCase();
  let suffix;
  const index = subtype.lastIndexOf("+");
  if (index !== -1) {
    suffix = subtype.slice(index + 1);
    subtype = subtype.slice(0, index);
  }
  return { type, subtype, suffix };
}
var typeRegExp;
var init_dist2 = __esm({
  "node_modules/media-typer/dist/index.js"() {
    typeRegExp = /^[A-Za-z0-9][A-Za-z0-9!#$&^_-]{0,126}\/[A-Za-z0-9][A-Za-z0-9!#$&^_.+-]{0,126}$/;
  }
});

// node_modules/music-metadata/lib/id3v2/ID3v2Token.js
var AttachedPictureType, LyricsContentType, TimestampFormat, UINT32SYNCSAFE, ID3v2Header, ExtendedHeader, TextEncodingToken, TextHeader, SyncTextHeader;
var init_ID3v2Token = __esm({
  "node_modules/music-metadata/lib/id3v2/ID3v2Token.js"() {
    init_lib3();
    init_Util();
    AttachedPictureType = {
      0: "Other",
      1: "32x32 pixels 'file icon' (PNG only)",
      2: "Other file icon",
      3: "Cover (front)",
      4: "Cover (back)",
      5: "Leaflet page",
      6: "Media (e.g. label side of CD)",
      7: "Lead artist/lead performer/soloist",
      8: "Artist/performer",
      9: "Conductor",
      10: "Band/Orchestra",
      11: "Composer",
      12: "Lyricist/text writer",
      13: "Recording Location",
      14: "During recording",
      15: "During performance",
      16: "Movie/video screen capture",
      17: "A bright coloured fish",
      18: "Illustration",
      19: "Band/artist logotype",
      20: "Publisher/Studio logotype"
    };
    LyricsContentType = {
      other: 0,
      lyrics: 1,
      text: 2,
      movement_part: 3,
      events: 4,
      chord: 5,
      trivia_pop: 6
    };
    TimestampFormat = {
      notSynchronized: 0,
      mpegFrameNumber: 1,
      milliseconds: 2
    };
    UINT32SYNCSAFE = {
      get: (buf, off) => {
        return buf[off + 3] & 127 | buf[off + 2] << 7 | buf[off + 1] << 14 | buf[off] << 21;
      },
      len: 4
    };
    ID3v2Header = {
      len: 10,
      get: (buf, off) => {
        return {
          // ID3v2/file identifier   "ID3"
          fileIdentifier: new StringType(3, "ascii").get(buf, off),
          // ID3v2 versionIndex
          version: {
            major: INT8.get(buf, off + 3),
            revision: INT8.get(buf, off + 4)
          },
          // ID3v2 flags
          flags: {
            // Unsynchronisation
            unsynchronisation: getBit(buf, off + 5, 7),
            // Extended header
            isExtendedHeader: getBit(buf, off + 5, 6),
            // Experimental indicator
            expIndicator: getBit(buf, off + 5, 5),
            footer: getBit(buf, off + 5, 4)
          },
          size: UINT32SYNCSAFE.get(buf, off + 6)
        };
      }
    };
    ExtendedHeader = {
      len: 10,
      get: (buf, off) => {
        return {
          // Extended header size
          size: UINT32_BE.get(buf, off),
          // Extended Flags
          extendedFlags: UINT16_BE.get(buf, off + 4),
          // Size of padding
          sizeOfPadding: UINT32_BE.get(buf, off + 6),
          // CRC data present
          crcDataPresent: getBit(buf, off + 4, 31)
        };
      }
    };
    TextEncodingToken = {
      len: 1,
      get: (uint8Array, off) => {
        switch (uint8Array[off]) {
          case 0:
            return { encoding: "latin1" };
          // binary
          case 1:
            return { encoding: "utf-16le", bom: true };
          case 2:
            return { encoding: "utf-16be", bom: false };
          case 3:
            return { encoding: "utf8", bom: false };
          default:
            return { encoding: "utf8", bom: false };
        }
      }
    };
    TextHeader = {
      len: 4,
      get: (uint8Array, off) => {
        return {
          encoding: TextEncodingToken.get(uint8Array, off),
          language: new StringType(3, "latin1").get(uint8Array, off + 1)
        };
      }
    };
    SyncTextHeader = {
      len: 6,
      get: (uint8Array, off) => {
        const text = TextHeader.get(uint8Array, off);
        return {
          encoding: text.encoding,
          language: text.language,
          timeStampFormat: UINT8.get(uint8Array, off + 4),
          contentType: UINT8.get(uint8Array, off + 5)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/id3v2/FrameHeader.js
function getFrameHeaderLength(majorVer) {
  switch (majorVer) {
    case 2:
      return 6;
    case 3:
    case 4:
      return 10;
    default:
      throw makeUnexpectedMajorVersionError(majorVer);
  }
}
function readFrameFlags(b, majorVer) {
  if (majorVer === 3) {
    return {
      status: {
        tag_alter_preservation: getBit(b, 0, 7),
        file_alter_preservation: getBit(b, 0, 6),
        read_only: getBit(b, 0, 5)
      },
      format: {
        compression: getBit(b, 1, 7),
        encryption: getBit(b, 1, 6),
        grouping_identity: getBit(b, 1, 5),
        // Unsynchronisation and data-length-indicator do not exist as per-frame flags in ID3v2.3.
        unsynchronisation: false,
        data_length_indicator: false
      }
    };
  }
  return {
    status: {
      tag_alter_preservation: getBit(b, 0, 6),
      file_alter_preservation: getBit(b, 0, 5),
      read_only: getBit(b, 0, 4)
    },
    format: {
      grouping_identity: getBit(b, 1, 6),
      compression: getBit(b, 1, 3),
      encryption: getBit(b, 1, 2),
      unsynchronisation: getBit(b, 1, 1),
      data_length_indicator: getBit(b, 1, 0)
    }
  };
}
function readFrameHeader(uint8Array, majorVer, warningCollector) {
  switch (majorVer) {
    case 2:
      return parseFrameHeaderV22(uint8Array, majorVer, warningCollector);
    case 3:
    case 4:
      return parseFrameHeaderV23V24(uint8Array, majorVer, warningCollector);
    default:
      throw makeUnexpectedMajorVersionError(majorVer);
  }
}
function parseFrameHeaderV22(uint8Array, majorVer, warningCollector) {
  const header = {
    id: textDecode(uint8Array.subarray(0, 3), "ascii"),
    length: UINT24_BE.get(uint8Array, 3)
  };
  if (!header.id.match(/^[A-Z0-9]{3}$/)) {
    warningCollector.addWarning(`Invalid ID3v2.${majorVer} frame-header-ID: ${header.id}`);
  }
  return header;
}
function parseFrameHeaderV23V24(uint8Array, majorVer, warningCollector) {
  const header = {
    id: textDecode(uint8Array.subarray(0, 4), "ascii"),
    length: (majorVer === 4 ? UINT32SYNCSAFE : UINT32_BE).get(uint8Array, 4),
    flags: readFrameFlags(uint8Array.subarray(8, 10), majorVer)
  };
  if (!header.id.match(/^[A-Z0-9]{4}$/)) {
    warningCollector.addWarning(`Invalid ID3v2.${majorVer} frame-header-ID: ${header.id}`);
  }
  return header;
}
function makeUnexpectedMajorVersionError(majorVer) {
  throw new Id3v2ContentError(`Unexpected majorVer: ${majorVer}`);
}
var init_FrameHeader = __esm({
  "node_modules/music-metadata/lib/id3v2/FrameHeader.js"() {
    init_lib2();
    init_lib3();
    init_Util();
    init_FrameParser();
    init_ID3v2Token();
  }
});

// node_modules/music-metadata/lib/id3v2/ID3v2ChapterToken.js
var ChapterInfo;
var init_ID3v2ChapterToken = __esm({
  "node_modules/music-metadata/lib/id3v2/ID3v2ChapterToken.js"() {
    init_lib3();
    ChapterInfo = {
      len: 16,
      get: (buf, off) => {
        const startOffset = UINT32_BE.get(buf, off + 8);
        const endOffset = UINT32_BE.get(buf, off + 12);
        return {
          startTime: UINT32_BE.get(buf, off),
          endTime: UINT32_BE.get(buf, off + 4),
          startOffset: startOffset === 4294967295 ? void 0 : startOffset,
          endOffset: endOffset === 4294967295 ? void 0 : endOffset
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/id3v2/FrameParser.js
function parseGenre(origVal, maxEntries = defaultMaxMetadataEntries) {
  const genres = [];
  const addGenre = (genre) => {
    if (genres.length >= maxEntries) {
      throw new Id3v2ContentError(`TCON value count ${genres.length + 1} exceeds entry limit ${maxEntries}`);
    }
    genres.push(genre);
  };
  let word = "";
  for (let offset = 0; offset < origVal.length; ) {
    const open = origVal.indexOf("(", offset);
    if (open < 0) {
      word += origVal.slice(offset);
      break;
    }
    word += origVal.slice(offset, open);
    if (origVal[open + 1] === "(") {
      word += "(";
      offset = open + 2;
      continue;
    }
    const close = origVal.indexOf(")", open + 1);
    if (close < 0) {
      break;
    }
    if (word !== "") {
      addGenre(word);
      word = "";
    }
    const genre = parseGenreCode(origVal.slice(open + 1, close));
    if (genre) {
      addGenre(genre);
    }
    offset = close + 1;
  }
  if (word) {
    if (genres.length === 0 && word.match(/^\d*$/)) {
      word = parseGenreCode(word);
    }
    if (word) {
      addGenre(word);
    }
  }
  return genres;
}
function parseGenreCode(code) {
  if (code === "RX") {
    return "Remix";
  }
  if (code === "CR") {
    return "Cover";
  }
  if (code.match(/^\d*$/)) {
    return Genres[Number.parseInt(code, 10)];
  }
}
function makeUnexpectedMajorVersionError2(majorVer) {
  throw new Id3v2ContentError(`Unexpected majorVer: ${majorVer}`);
}
var import_debug4, debug4, defaultEnc, urlEnc, FrameParser, Id3v2ContentError;
var init_FrameParser = __esm({
  "node_modules/music-metadata/lib/id3v2/FrameParser.js"() {
    import_debug4 = __toESM(require_src(), 1);
    init_lib3();
    init_Allocation();
    init_Util();
    init_Util();
    init_ID3v1Parser();
    init_ParseError();
    init_FrameHeader();
    init_ID3v2ChapterToken();
    init_ID3v2Token();
    debug4 = (0, import_debug4.default)("music-metadata:id3v2:frame-parser");
    defaultEnc = "latin1";
    urlEnc = { encoding: defaultEnc, bom: false };
    FrameParser = class _FrameParser {
      maxEntries;
      embeddedFrameDepth = 0;
      major;
      warningCollector;
      /**
       * Create id3v2 frame parser
       * @param major - Major version, e.g. (4) for  id3v2.4
       * @param warningCollector - Used to collect decode issue
       */
      constructor(major, warningCollector, maxEntries = defaultMaxMetadataEntries) {
        this.maxEntries = maxEntries;
        this.major = major;
        this.warningCollector = warningCollector;
      }
      validateTextValues = (count, context) => {
        if (count > this.maxEntries) {
          throw new Id3v2ContentError(`${context} value count ${count} exceeds entry limit ${this.maxEntries}`);
        }
      };
      readData(uint8Array, type, includeCovers) {
        if (uint8Array.length === 0) {
          if (type === "CHAP" || type === "CTOC") {
            throw new Id3v2ContentError(`Truncated ${type} header`);
          }
          this.warningCollector.addWarning(`id3v2.${this.major} header has empty tag type=${type}`);
          return;
        }
        const { encoding, bom } = TextEncodingToken.get(uint8Array, 0);
        const length = uint8Array.length;
        let offset = 0;
        let output = [];
        const nullTerminatorLength = _FrameParser.getNullTerminatorLength(encoding);
        let fzero;
        debug4(`Parsing tag type=${type}, encoding=${encoding}, bom=${bom}`);
        switch (type !== "TXXX" && type[0] === "T" ? "T*" : type) {
          case "T*":
          // 4.2.1. Text information frames - details
          case "GRP1":
          // iTunes-specific ID3v2 grouping field
          case "GP1":
          // iTunes-specific ID3v2.2 grouping field
          case "IPL":
          // v2.2: Involved people list
          case "IPLS":
          // v2.3: Involved people list
          case "MVIN":
          case "MVNM":
          case "PCS":
          case "PCST": {
            let text;
            try {
              text = _FrameParser.trimNullPadding(decodeString(uint8Array.subarray(1), encoding));
            } catch (error) {
              if (error instanceof Error) {
                this.warningCollector.addWarning(`id3v2.${this.major} type=${type} header has invalid string value: ${error.message}`);
                break;
              }
              throw error;
            }
            switch (type) {
              case "TMCL":
              // Musician credits list
              case "TIPL":
              // Involved people list
              case "IPL":
              // v2.2: Involved people list
              case "IPLS":
                output = this.functionList(this.splitValue(type, text));
                break;
              case "TRK":
              case "TRCK":
              case "TPOS":
              case "TIT1":
              case "TIT2":
              case "TIT3":
                output = text;
                break;
              case "TCOM":
              case "TEXT":
              case "TOLY":
              case "TOPE":
              case "TPE1":
              case "TSRC":
                output = this.splitValue(type, text);
                break;
              case "TCO":
              case "TCON": {
                const genres = [];
                for (const value of this.splitValue(type, text)) {
                  for (const genre of parseGenre(value, this.maxEntries)) {
                    this.validateTextValues(genres.length + 1, "TCON");
                    genres.push(genre);
                  }
                }
                output = genres;
                break;
              }
              case "PCS":
              case "PCST":
                output = this.major >= 4 ? this.splitValue(type, text) : [text];
                output = Array.isArray(output) && output[0] === "" ? 1 : 0;
                break;
              default:
                output = this.major >= 4 ? this.splitValue(type, text) : [text];
            }
            break;
          }
          case "TXXX": {
            const idAndData = _FrameParser.readIdentifierAndData(uint8Array.subarray(1), encoding);
            output = {
              description: idAndData.id,
              text: this.splitValue(type, _FrameParser.trimNullPadding(decodeString(idAndData.data, encoding)), idAndData.id)
            };
            break;
          }
          case "PIC":
          case "APIC":
            if (includeCovers) {
              const pic = {};
              uint8Array = uint8Array.subarray(1);
              switch (this.major) {
                case 2:
                  pic.format = decodeString(uint8Array.subarray(0, 3), "latin1");
                  uint8Array = uint8Array.subarray(3);
                  break;
                case 3:
                case 4:
                  fzero = findZero(uint8Array, defaultEnc);
                  pic.format = decodeString(uint8Array.subarray(0, fzero), defaultEnc);
                  uint8Array = uint8Array.subarray(fzero + 1);
                  break;
                default:
                  throw makeUnexpectedMajorVersionError2(this.major);
              }
              pic.format = _FrameParser.fixPictureMimeType(pic.format);
              pic.type = AttachedPictureType[uint8Array[0]];
              uint8Array = uint8Array.subarray(1);
              fzero = findZero(uint8Array, encoding);
              pic.description = decodeString(uint8Array.subarray(0, fzero), encoding);
              uint8Array = uint8Array.subarray(fzero + nullTerminatorLength);
              pic.data = uint8Array;
              output = pic;
            }
            break;
          case "CNT":
          case "PCNT":
            output = decodeUintBE(uint8Array);
            break;
          case "SYLT": {
            const syltHeader = SyncTextHeader.get(uint8Array, 0);
            uint8Array = uint8Array.subarray(SyncTextHeader.len);
            const result = {
              descriptor: "",
              language: syltHeader.language,
              contentType: syltHeader.contentType,
              timeStampFormat: syltHeader.timeStampFormat,
              syncText: []
            };
            let readSyllables = false;
            while (uint8Array.length > 0) {
              const nullStr = _FrameParser.readNullTerminatedString(uint8Array, syltHeader.encoding);
              uint8Array = uint8Array.subarray(nullStr.len);
              if (readSyllables) {
                this.validateTextValues(result.syncText.length + 1, "SYLT");
                const timestamp = UINT32_BE.get(uint8Array, 0);
                uint8Array = uint8Array.subarray(UINT32_BE.len);
                result.syncText.push({
                  text: nullStr.text,
                  timestamp
                });
              } else {
                result.descriptor = nullStr.text;
                readSyllables = true;
              }
            }
            output = result;
            break;
          }
          case "ULT":
          case "USLT":
          case "COM":
          case "COMM": {
            const textHeader = TextHeader.get(uint8Array, offset);
            offset += TextHeader.len;
            const descriptorStr = _FrameParser.readNullTerminatedString(uint8Array.subarray(offset), textHeader.encoding);
            offset += descriptorStr.len;
            const textStr = _FrameParser.readNullTerminatedString(uint8Array.subarray(offset), textHeader.encoding);
            const comment = {
              language: textHeader.language,
              descriptor: descriptorStr.text,
              text: textStr.text
            };
            output = comment;
            break;
          }
          case "UFID": {
            const ufid = _FrameParser.readIdentifierAndData(uint8Array, defaultEnc);
            output = { owner_identifier: ufid.id, identifier: ufid.data };
            break;
          }
          case "PRIV": {
            const priv = _FrameParser.readIdentifierAndData(uint8Array, defaultEnc);
            output = { owner_identifier: priv.id, data: priv.data };
            break;
          }
          case "POPM": {
            uint8Array = uint8Array.subarray(offset);
            const emailStr = _FrameParser.readNullTerminatedString(uint8Array, urlEnc);
            const email = emailStr.text;
            uint8Array = uint8Array.subarray(emailStr.len);
            if (uint8Array.length === 0) {
              this.warningCollector.addWarning(`id3v2.${this.major} type=${type} POPM frame missing rating byte`);
              output = { email, rating: 0, counter: void 0 };
              break;
            }
            const rating = UINT8.get(uint8Array, 0);
            const counterBytes = uint8Array.subarray(UINT8.len);
            output = {
              email,
              rating,
              counter: counterBytes.length > 0 ? decodeUintBE(counterBytes) : void 0
            };
            break;
          }
          case "GEOB": {
            const encoding2 = TextEncodingToken.get(uint8Array, 0);
            uint8Array = uint8Array.subarray(1);
            const mimeTypeStr = _FrameParser.readNullTerminatedString(uint8Array, urlEnc);
            const mimeType = mimeTypeStr.text;
            uint8Array = uint8Array.subarray(mimeTypeStr.len);
            const filenameStr = _FrameParser.readNullTerminatedString(uint8Array, encoding2);
            const filename = filenameStr.text;
            uint8Array = uint8Array.subarray(filenameStr.len);
            const descriptionStr = _FrameParser.readNullTerminatedString(uint8Array, encoding2);
            const description = descriptionStr.text;
            uint8Array = uint8Array.subarray(descriptionStr.len);
            const geob = {
              type: mimeType,
              filename,
              description,
              data: uint8Array
            };
            output = geob;
            break;
          }
          // W-Frames:
          case "WCOM":
          case "WCOP":
          case "WOAF":
          case "WOAR":
          case "WOAS":
          case "WORS":
          case "WPAY":
          case "WPUB":
            output = _FrameParser.readNullTerminatedString(uint8Array, urlEnc).text;
            break;
          case "WXXX": {
            const encoding2 = TextEncodingToken.get(uint8Array, 0);
            uint8Array = uint8Array.subarray(1);
            const descriptionStr = _FrameParser.readNullTerminatedString(uint8Array, encoding2);
            const description = descriptionStr.text;
            uint8Array = uint8Array.subarray(descriptionStr.len);
            output = { description, url: _FrameParser.trimNullPadding(decodeString(uint8Array, defaultEnc)) };
            break;
          }
          case "WFD":
          case "WFED": {
            const encoding2 = TextEncodingToken.get(uint8Array, 0);
            uint8Array = uint8Array.subarray(1);
            output = _FrameParser.readNullTerminatedString(uint8Array, encoding2).text;
            break;
          }
          case "MCDI": {
            output = uint8Array.subarray(0, length);
            break;
          }
          // ID3v2 Chapters 1.0
          // https://mutagen-specs.readthedocs.io/en/latest/id3/id3v2-chapters-1.0.html#chapter-frame
          case "CHAP": {
            debug4("Reading CHAP");
            fzero = uint8Array.indexOf(0);
            if (fzero < 0) {
              throw new Id3v2ContentError("Missing CHAP element ID terminator");
            }
            if (length - fzero - 1 < ChapterInfo.len) {
              throw new Id3v2ContentError("Truncated CHAP header");
            }
            const chapter = {
              label: decodeString(uint8Array.subarray(0, fzero), defaultEnc),
              info: ChapterInfo.get(uint8Array, fzero + 1),
              frames: this.readEmbeddedFrames(uint8Array, fzero + 1 + ChapterInfo.len, includeCovers)
            };
            output = chapter;
            break;
          }
          // ID3v2 Chapters 1.0
          // https://mutagen-specs.readthedocs.io/en/latest/id3/id3v2-chapters-1.0.html#table-of-contents-frame
          case "CTOC": {
            debug4("Reading CTOC");
            const idEnd = uint8Array.indexOf(0);
            if (idEnd < 0) {
              throw new Id3v2ContentError("Missing CTOC element ID terminator");
            }
            if (length - idEnd - 1 < 2) {
              throw new Id3v2ContentError("Truncated CTOC header");
            }
            const label = decodeString(uint8Array.subarray(0, idEnd), defaultEnc);
            offset = idEnd + 1;
            const flags = UINT8.get(uint8Array, offset++);
            const topLevel = (flags & 2) !== 0;
            const ordered = (flags & 1) !== 0;
            const entryCount = UINT8.get(uint8Array, offset++);
            const childElementIds = [];
            for (let i = 0; i < entryCount; i++) {
              const end = uint8Array.indexOf(0, offset);
              if (end < 0) {
                throw new Id3v2ContentError("Truncated CTOC child element ID");
              }
              const childId = decodeString(uint8Array.subarray(offset, end), defaultEnc);
              childElementIds.push(childId);
              offset = end + 1;
            }
            const toc = {
              label,
              flags: { topLevel, ordered },
              childElementIds,
              // Optional embedded sub-frames (e.g. TIT2) follow after the child list.
              frames: this.readEmbeddedFrames(uint8Array, offset, includeCovers)
            };
            output = toc;
            break;
          }
          default:
            debug4(`Warning: unsupported id3v2-tag-type: ${type}`);
            break;
        }
        return output;
      }
      readEmbeddedFrames(data, offset, includeCovers) {
        const frames = /* @__PURE__ */ new Map();
        const headerLength = getFrameHeaderLength(this.major);
        while (offset < data.length) {
          if (data.length - offset < headerLength) {
            throw new Id3v2ContentError("Truncated embedded ID3v2 frame header");
          }
          const frame = readFrameHeader(data.subarray(offset), this.major, this.warningCollector);
          offset += headerLength;
          if (frame.length > data.length - offset) {
            throw new Id3v2ContentError(`Embedded ID3v2 frame ${frame.id} size ${frame.length} exceeds remaining chapter data`);
          }
          this.validateTextValues(frames.size + 1, "Embedded frame");
          if (this.embeddedFrameDepth >= 32) {
            throw new Id3v2ContentError("Embedded ID3v2 frame nesting exceeds limit 32");
          }
          ++this.embeddedFrameDepth;
          let value;
          try {
            value = this.readData(data.subarray(offset, offset + frame.length), frame.id, includeCovers);
          } finally {
            --this.embeddedFrameDepth;
          }
          offset += frame.length;
          frames.set(frame.id, value);
        }
        return frames;
      }
      static readNullTerminatedString(uint8Array, encoding) {
        const originalLen = uint8Array.length;
        const zeroIndex = findZero(uint8Array, encoding.encoding);
        if (zeroIndex >= originalLen) {
          return {
            text: decodeString(uint8Array, encoding.encoding),
            len: originalLen
          };
        }
        const txt = uint8Array.subarray(0, zeroIndex);
        return {
          text: decodeString(txt, encoding.encoding),
          len: zeroIndex + _FrameParser.getNullTerminatorLength(encoding.encoding)
        };
      }
      static fixPictureMimeType(pictureType) {
        pictureType = pictureType.toLocaleLowerCase();
        switch (pictureType) {
          case "jpg":
            return "image/jpeg";
          case "png":
            return "image/png";
        }
        return pictureType;
      }
      /**
       * Converts TMCL (Musician credits list) or TIPL (Involved people list)
       * @param entries
       */
      functionList(entries) {
        const roles = /* @__PURE__ */ new Map();
        for (let i = 0; i < entries.length; i += 2) {
          const role = entries[i];
          const people = entries[i + 1];
          if (role === void 0 || people === void 0) {
            break;
          }
          const names = splitText(people, ",", "people-list", this.validateTextValues, { keepEmpty: true });
          roles.set(role, (roles.get(role) ?? []).concat(names));
        }
        return Object.fromEntries(roles);
      }
      /**
       * id3v2.4 defines that multiple T* values are separated by 0x00
       * id3v2.3 defines that TCOM, TEXT, TOLY, TOPE & TPE1 values are separated by /
       * (TCON/TCO genre values are NOT slash-separated in ID3v2.3)
       * @param tag - Tag name
       * @param text - Concatenated tag value
       * @param description - User text description, for legacy slash-separated list compatibility
       * @returns Split tag value
       */
      splitValue(tag, text, description = "") {
        let values;
        if (this.major < 4) {
          values = splitText(text, "\0", tag, this.validateTextValues, { keepEmpty: true });
          if (values.length > 1) {
            if (tag !== "IPL" && tag !== "IPLS") {
              this.warningCollector.addWarning(`ID3v2.${this.major} ${tag} uses non standard null-separator.`);
            }
          } else if ([
            /* v2.3: */
            "TPE1",
            "TPE2",
            "TPE3",
            "TPE4",
            "TCOM",
            "TEXT",
            "TOLY",
            "TOPE",
            /* v2.2: */
            "TP1",
            "TCM",
            "TXT",
            "TOA",
            "TOL",
            "TSRC",
            // Retain legacy support for nonstandard slash-separated credits.
            "IPL",
            "IPLS"
          ].includes(tag) || // Preserve arbitrary TXXX text (XML, URLs, paths, etc.). Only known list
          // descriptions retain compatibility with Picard's legacy '/' separator.
          // https://picard-docs.musicbrainz.org/en/v2.13/config/options_tags_compatibility_id3.html
          tag === "TXXX" && [
            "ARTISTS",
            "MUSICBRAINZ ARTIST ID",
            "MUSICBRAINZ ALBUM ARTIST ID",
            "MUSICBRAINZ ALBUM TYPE",
            "ISRC"
          ].includes(description.toUpperCase())) {
            values = splitText(text, "/", tag, this.validateTextValues, { keepEmpty: true });
          }
        } else {
          values = splitText(text, "\0", tag, this.validateTextValues, { keepEmpty: true });
        }
        return _FrameParser.trimArray(values);
      }
      static trimArray(values) {
        return values.map((value) => _FrameParser.trimNullPadding(value).trim());
      }
      static trimNullPadding(value) {
        let end = value.length;
        while (end > 0 && value.charCodeAt(end - 1) === 0) {
          end--;
        }
        return end === value.length ? value : value.slice(0, end);
      }
      static readIdentifierAndData(uint8Array, encoding) {
        const idStr = _FrameParser.readNullTerminatedString(uint8Array, { encoding, bom: false });
        return { id: idStr.text, data: uint8Array.subarray(idStr.len) };
      }
      static getNullTerminatorLength(enc) {
        return enc.startsWith("utf-16") ? 2 : 1;
      }
    };
    Id3v2ContentError = class extends makeUnexpectedFileContentError("id3v2") {
    };
  }
});

// node_modules/music-metadata/lib/id3v2/ID3v2Parser.js
function makeUnexpectedMajorVersionError3(majorVer) {
  throw new Id3v2ContentError(`Unexpected majorVer: ${majorVer}`);
}
var ID3v2Parser;
var init_ID3v2Parser = __esm({
  "node_modules/music-metadata/lib/id3v2/ID3v2Parser.js"() {
    init_lib3();
    init_Allocation();
    init_FrameHeader();
    init_FrameParser();
    init_ID3v2Token();
    ID3v2Parser = class _ID3v2Parser {
      static removeUnsyncBytes(buffer) {
        let readI = 0;
        let writeI = 0;
        while (readI < buffer.length - 1) {
          if (readI !== writeI) {
            buffer[writeI] = buffer[readI];
          }
          readI += buffer[readI] === 255 && buffer[readI + 1] === 0 ? 2 : 1;
          writeI++;
        }
        if (readI < buffer.length) {
          buffer[writeI++] = buffer[readI];
        }
        return buffer.subarray(0, writeI);
      }
      static readFrameData(uint8Array, frameHeader, majorVer, includeCovers, warningCollector, maxEntries) {
        const frameParser = new FrameParser(majorVer, warningCollector, maxEntries);
        switch (majorVer) {
          case 2:
            return frameParser.readData(uint8Array, frameHeader.id, includeCovers);
          case 3:
          case 4:
            if (frameHeader.flags?.format.unsynchronisation) {
              uint8Array = _ID3v2Parser.removeUnsyncBytes(uint8Array);
            }
            if (frameHeader.flags?.format.data_length_indicator) {
              uint8Array = uint8Array.subarray(4, uint8Array.length);
            }
            return frameParser.readData(uint8Array, frameHeader.id, includeCovers);
          default:
            throw makeUnexpectedMajorVersionError3(majorVer);
        }
      }
      /**
       * Create a combined tag key, of tag & description
       * @param tag e.g.: COM
       * @param description e.g. iTunPGAP
       * @returns string e.g. COM:iTunPGAP
       */
      static makeDescriptionTagName(tag, description) {
        return tag + (description ? `:${description}` : "");
      }
      tokenizer = void 0;
      id3Header = void 0;
      metadata = void 0;
      headerType = void 0;
      options = void 0;
      async parse(metadata, tokenizer, options) {
        this.tokenizer = tokenizer;
        this.metadata = metadata;
        this.options = options;
        const id3Header = await this.tokenizer.readToken(ID3v2Header);
        if (id3Header.fileIdentifier !== "ID3") {
          throw new Id3v2ContentError("expected ID3-header file-identifier 'ID3' was not found");
        }
        const fileSize = this.tokenizer.fileInfo.size;
        if (fileSize !== void 0) {
          const remainingBytes = fileSize - this.tokenizer.position;
          if (id3Header.size > remainingBytes) {
            throw new Id3v2ContentError(`ID3v2 tag size ${id3Header.size} exceeds remaining file size ${remainingBytes}`);
          }
        }
        this.id3Header = id3Header;
        this.headerType = `ID3v2.${id3Header.version.major}`;
        await (id3Header.flags.isExtendedHeader ? this.parseExtendedHeader() : this.parseId3Data(id3Header.size));
        const chapters = this.mapId3v2Chapters(this.metadata.native[this.headerType]);
        this.metadata.setFormat("chapters", chapters);
      }
      async parseExtendedHeader() {
        const extendedHeader = await this.tokenizer.readToken(ExtendedHeader);
        const dataRemaining = extendedHeader.size - ExtendedHeader.len;
        return dataRemaining > 0 ? this.parseExtendedHeaderData(dataRemaining, extendedHeader.size) : this.parseId3Data(this.id3Header.size - extendedHeader.size);
      }
      async parseExtendedHeaderData(dataRemaining, extendedHeaderSize) {
        await this.tokenizer.ignore(dataRemaining);
        return this.parseId3Data(this.id3Header.size - extendedHeaderSize);
      }
      async parseId3Data(dataLen) {
        const uint8Array = await readToken(this.tokenizer, new Uint8ArrayType(dataLen), this.options, void 0, (message) => new Id3v2ContentError(message));
        const tags = this.parseMetadata(uint8Array);
        for (const tag of tags) {
          switch (tag.id) {
            case "TXXX":
              if (tag.value) {
                await this.handleTag(tag, tag.value.text, () => tag.value.description);
              }
              break;
            default:
              await (Array.isArray(tag.value) ? Promise.all(tag.value.map((value) => this.addTag(tag.id, value))) : this.addTag(tag.id, tag.value));
          }
        }
        if (this.id3Header.version.major === 3) {
          await this.mapRecordingDate(tags);
        }
      }
      async mapRecordingDate(tags) {
        const text = (id) => tags.findLast((tag) => tag.id === id && tag.value.at(-1))?.value?.at(-1);
        const discogs = tags.findLast((tag) => tag.id === "TXXX" && tag.value.description.toUpperCase() === "DISCOGS_RELEASED" && tag.value.text.at(-1));
        const explicit = text("TDRC") ?? text("TDRV") ?? discogs?.value?.text.at(-1);
        if (explicit) {
          await this.metadata.postMap(this.headerType, { id: "date", value: explicit });
          return;
        }
        const year = text("TYER");
        if (!year || !/^\d{4}$/.test(year)) {
          return;
        }
        let date = year;
        const dayMonth = text("TDAT");
        if (dayMonth && /^\d{4}$/.test(dayMonth)) {
          const day = Number(dayMonth.slice(0, 2));
          const month = Number(dayMonth.slice(2));
          const y = Number(year);
          const leapYear = y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0);
          const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
          if (day >= 1 && day <= daysInMonth[month - 1]) {
            date += `-${dayMonth.slice(2)}-${dayMonth.slice(0, 2)}`;
            const time = text("TIME");
            if (time && /^([01]\d|2[0-3])[0-5]\d$/.test(time)) {
              date += `T${time.slice(0, 2)}:${time.slice(2)}`;
            }
          }
        }
        await this.metadata.postMap(this.headerType, { id: "date", value: date });
      }
      async handleTag(tag, values, descriptor, resolveValue = (value) => value) {
        await Promise.all(values.map((value) => this.addTag(_ID3v2Parser.makeDescriptionTagName(tag.id, descriptor(value)), resolveValue(value))));
      }
      async addTag(id, value) {
        await this.metadata.addTag(this.headerType, id, value);
      }
      parseMetadata(data) {
        let offset = 0;
        let frameCount = 0;
        const tags = [];
        while (true) {
          if (offset === data.length) {
            break;
          }
          if (data[offset] === 0) {
            if (data.subarray(offset).some((byte) => byte !== 0)) {
              this.metadata.addWarning("Non-zero bytes found in ID3v2 padding");
            }
            break;
          }
          const frameHeaderLength = getFrameHeaderLength(this.id3Header.version.major);
          if (offset + frameHeaderLength > data.length) {
            this.metadata.addWarning("Illegal ID3v2 tag length");
            break;
          }
          const frameHeaderBytes = data.subarray(offset, offset + frameHeaderLength);
          offset += frameHeaderLength;
          const frameHeader = readFrameHeader(frameHeaderBytes, this.id3Header.version.major, this.metadata);
          if (++frameCount > getMaxMetadataEntries(this.options)) {
            throw new Id3v2ContentError("Frame count exceeds entry limit");
          }
          const frameDataBytes = data.subarray(offset, offset + frameHeader.length);
          offset += frameHeader.length;
          const values = _ID3v2Parser.readFrameData(frameDataBytes, frameHeader, this.id3Header.version.major, !this.options.skipCovers, this.metadata, getMaxMetadataEntries(this.options));
          if (values) {
            tags.push({ id: frameHeader.id, value: values });
          }
        }
        return tags;
      }
      /**
       * Convert parsed ID3v2 chapter frames (CHAP / CTOC) to generic `format.chapters`.
       *
       * This function expects the `native` tags already to contain parsed `CHAP` and `CTOC` frame values,
       * as produced by `FrameParser.readData`.
       */
      mapId3v2Chapters(id3Tags) {
        if (!id3Tags) {
          return;
        }
        const chapFrames = id3Tags.filter((t) => t.id === "CHAP").map((t) => t.value);
        if (!chapFrames.length) {
          return;
        }
        const tocFrames = id3Tags.filter((t) => t.id === "CTOC").map((t) => t.value);
        const topLevelToc = tocFrames.find((t) => t.flags.topLevel);
        const chapterById = /* @__PURE__ */ new Map();
        for (const chap of chapFrames) {
          chapterById.set(chap.label, chap);
        }
        const orderedIds = topLevelToc?.childElementIds;
        const chapters = [];
        const maxChapterCount = getMaxChapterCount(this.options);
        const source = orderedIds ?? [...chapterById.keys()].sort((left, right) => (chapterById.get(left)?.info.startTime ?? 0) - (chapterById.get(right)?.info.startTime ?? 0));
        for (const id of source) {
          const chap = chapterById.get(id);
          if (!chap) {
            continue;
          }
          const frames = chap.frames;
          const title = frames.get("TIT2") ?? "";
          if (chapters.length >= maxChapterCount) {
            this.metadata.addWarning(`Chapter count exceeds the ${maxChapterCount} chapter limit`);
            break;
          }
          chapters.push({
            id,
            title,
            url: frames.get("WXXX"),
            start: chap.info.startTime / 1e3,
            end: chap.info.endTime / 1e3,
            image: frames.get("APIC")
          });
        }
        return chapters.length ? chapters : void 0;
      }
    };
  }
});

// node_modules/music-metadata/lib/id3v2/EmbeddedID3v2.js
async function parseEmbeddedID3v2(metadata, tokenizer, options, size) {
  validateAllocation(size, options);
  if (size < ID3v2Header.len || tokenizer.fileInfo.size !== void 0 && size > tokenizer.fileInfo.size - tokenizer.position) {
    throw new EndOfStreamError();
  }
  const embeddedTokenizer = createTokenizerView(tokenizer, size);
  try {
    await new ID3v2Parser().parse(metadata, embeddedTokenizer, options);
    await embeddedTokenizer.consumeRemainder();
  } catch (error) {
    if (error instanceof TokenizerBoundaryError) {
      throw new Id3v2ContentError(`Embedded ID3v2 read exceeds chunk boundary: ${error.message}`);
    }
    throw error;
  } finally {
    await embeddedTokenizer.close();
  }
}
var init_EmbeddedID3v2 = __esm({
  "node_modules/music-metadata/lib/id3v2/EmbeddedID3v2.js"() {
    init_lib();
    init_Allocation();
    init_FrameParser();
    init_ID3v2Parser();
    init_ID3v2Token();
  }
});

// node_modules/music-metadata/lib/iff/index.js
var Header2;
var init_iff = __esm({
  "node_modules/music-metadata/lib/iff/index.js"() {
    init_lib3();
    init_FourCC();
    Header2 = {
      len: 8,
      get: (buf, off) => {
        return {
          // Chunk type ID
          chunkID: FourCcToken.get(buf, off),
          // Chunk size
          chunkSize: Number(BigInt(UINT32_BE.get(buf, off + 4)))
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/aiff/AiffToken.js
var compressionTypes, AiffContentError, SoundDataHeader, Common;
var init_AiffToken = __esm({
  "node_modules/music-metadata/lib/aiff/AiffToken.js"() {
    init_lib3();
    init_FourCC();
    init_ParseError();
    compressionTypes = {
      ima4: "IMA4 ADPCM",
      NONE: "not compressed	PCM	Apple Computer",
      sowt: "PCM (byte swapped)",
      fl32: "32-bit floating point IEEE 32-bit float",
      fl64: "64-bit floating point IEEE 64-bit float	Apple Computer",
      alaw: "ALaw 2:1	8-bit ITU-T G.711 A-law",
      ulaw: "\xB5Law 2:1	8-bit ITU-T G.711 \xB5-law	Apple Computer",
      ULAW: "CCITT G.711 u-law 8-bit ITU-T G.711 \xB5-law",
      ALAW: "CCITT G.711 A-law 8-bit ITU-T G.711 A-law",
      FL32: "Float 32	IEEE 32-bit float "
    };
    AiffContentError = class extends makeUnexpectedFileContentError("AIFF") {
    };
    SoundDataHeader = {
      len: 8,
      get: (buf, off) => ({
        offset: UINT32_BE.get(buf, off),
        blockSize: UINT32_BE.get(buf, off + 4)
      })
    };
    Common = class {
      len;
      isAifc;
      constructor(header, isAifc) {
        this.isAifc = isAifc;
        const minimumChunkSize = isAifc ? 22 : 18;
        if (header.chunkSize < minimumChunkSize) {
          throw new AiffContentError(`COMMON CHUNK size should always be at least ${minimumChunkSize}`);
        }
        this.len = header.chunkSize;
      }
      get(buf, off) {
        const shift = UINT16_BE.get(buf, off + 8) - 16398;
        const baseSampleRate = UINT16_BE.get(buf, off + 8 + 2);
        const res = {
          numChannels: UINT16_BE.get(buf, off),
          numSampleFrames: UINT32_BE.get(buf, off + 2),
          sampleSize: UINT16_BE.get(buf, off + 6),
          sampleRate: shift < 0 ? baseSampleRate >> Math.abs(shift) : baseSampleRate << shift
        };
        if (this.isAifc) {
          res.compressionType = FourCcToken.get(buf, off + 18);
          if (this.len > 22) {
            const strLen = UINT8.get(buf, off + 22);
            if (strLen > 0) {
              const padding = (strLen + 1) % 2;
              if (23 + strLen + padding === this.len) {
                res.compressionName = new StringType(strLen, "latin1").get(buf, off + 23);
              } else {
                throw new AiffContentError("Illegal pstring length");
              }
            } else {
              res.compressionName = void 0;
            }
          }
        } else {
          res.compressionName = "PCM";
        }
        return res;
      }
    };
  }
});

// node_modules/music-metadata/lib/aiff/AiffParser.js
var AiffParser_exports = {};
__export(AiffParser_exports, {
  AIFFParser: () => AIFFParser
});
var import_debug5, debug5, AIFFParser;
var init_AiffParser = __esm({
  "node_modules/music-metadata/lib/aiff/AiffParser.js"() {
    import_debug5 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_Allocation();
    init_BasicParser();
    init_FourCC();
    init_EmbeddedID3v2();
    init_iff();
    init_AiffToken();
    init_AiffToken();
    debug5 = (0, import_debug5.default)("music-metadata:parser:aiff");
    AIFFParser = class extends BasicParser {
      isCompressed = null;
      soundDataBytes;
      soundDataComplete = false;
      common;
      async parse() {
        const header = await this.readToken(Header2);
        if (header.chunkID !== "FORM") {
          throw new AiffContentError("Invalid Chunk-ID, expected 'FORM'");
        }
        const type = await this.readToken(FourCcToken);
        switch (type) {
          case "AIFF":
            this.metadata.setFormat("container", type);
            this.isCompressed = false;
            break;
          case "AIFC":
            this.metadata.setFormat("container", "AIFF-C");
            this.isCompressed = true;
            break;
          default:
            throw new AiffContentError(`Unsupported AIFF type: ${type}`);
        }
        this.metadata.setFormat("lossless", !this.isCompressed);
        this.metadata.setAudioOnly();
        let remaining = header.chunkSize - FourCcToken.len;
        if (remaining < 0) {
          throw new AiffContentError(`Invalid FORM chunk size: ${header.chunkSize}`);
        }
        try {
          while (remaining >= Header2.len) {
            debug5(`Reading AIFF chunk at offset=${this.tokenizer.position}`);
            const chunkHeader = await this.readToken(Header2);
            remaining -= Header2.len;
            const available = this.tokenizer.fileInfo.size;
            if (chunkHeader.chunkSize > remaining || available !== void 0 && chunkHeader.chunkSize > available - this.tokenizer.position) {
              throw new AiffContentError(`Chunk ${chunkHeader.chunkID} size ${chunkHeader.chunkSize} exceeds remaining FORM data`);
            }
            const nextChunk = 2 * Math.round(chunkHeader.chunkSize / 2);
            const bytesRead = await this.readData(chunkHeader);
            const ignored = await this.tokenizer.ignore(nextChunk - bytesRead);
            if (chunkHeader.chunkID === "SSND") {
              this.soundDataComplete = ignored === nextChunk - bytesRead;
            }
            remaining -= nextChunk;
          }
        } catch (err) {
          if (err instanceof EndOfStreamError) {
            debug5("End-of-stream");
          } else {
            throw err;
          }
        }
        const common = this.common;
        if (common?.compressionType === "ima4" && common.numChannels > 0 && common.numSampleFrames > 0 && common.sampleRate > 0 && this.soundDataComplete && this.soundDataBytes === common.numSampleFrames * common.numChannels * 34) {
          const samples = common.numSampleFrames * 64;
          this.metadata.setFormat("numberOfSamples", samples);
          this.metadata.setFormat("duration", samples / common.sampleRate);
        }
        const duration = this.metadata.format.duration;
        if (this.soundDataBytes !== void 0 && duration !== void 0 && Number.isFinite(duration) && duration > 0) {
          this.metadata.setFormat("bitrate", 8 * this.soundDataBytes / duration);
        }
      }
      async readData(header) {
        switch (header.chunkID) {
          case "COMM": {
            if (this.isCompressed === null) {
              throw new AiffContentError("Failed to parse AIFF.COMM chunk when compression type is unknown");
            }
            const common = await this.readToken(new Common(header, this.isCompressed));
            this.common = common;
            this.metadata.setFormat("bitsPerSample", common.sampleSize);
            this.metadata.setFormat("sampleRate", common.sampleRate);
            this.metadata.setFormat("numberOfChannels", common.numChannels);
            this.metadata.setFormat("numberOfSamples", common.numSampleFrames);
            this.metadata.setFormat("duration", common.numSampleFrames / common.sampleRate);
            if (common.compressionName || common.compressionType) {
              this.metadata.setFormat("codec", common.compressionName ?? compressionTypes[common.compressionType]);
            }
            return header.chunkSize;
          }
          case "ID3 ": {
            await parseEmbeddedID3v2(this.metadata, this.tokenizer, this.options, header.chunkSize);
            return header.chunkSize;
          }
          case "SSND": {
            this.soundDataComplete = false;
            if (header.chunkSize < SoundDataHeader.len) {
              throw new AiffContentError("SSND chunk is too small to contain its header");
            }
            const sound = await this.readToken(SoundDataHeader);
            const payloadSize = header.chunkSize - SoundDataHeader.len;
            if (sound.offset > payloadSize) {
              throw new AiffContentError("SSND alignment offset exceeds its payload size");
            }
            this.soundDataBytes = payloadSize - sound.offset;
            return SoundDataHeader.len;
          }
          case "NAME":
          // Sample name chunk
          case "AUTH":
          // Author chunk
          case "(c) ":
          // Copyright chunk
          case "ANNO":
            return this.readTextChunk(header);
          default:
            debug5(`Ignore chunk id=${header.chunkID}, size=${header.chunkSize}`);
            return 0;
        }
      }
      async readTextChunk(header) {
        const value = await this.readToken(new StringType(header.chunkSize, "ascii"));
        let valueCount = 1;
        for (let offset = value.indexOf("\0"); offset >= 0; offset = value.indexOf("\0", offset + 1)) {
          ++valueCount;
        }
        if (valueCount > getMaxMetadataEntries(this.options)) {
          throw new AiffContentError(`Text value count ${valueCount} exceeds entry limit ${getMaxMetadataEntries(this.options)}`);
        }
        const values = value.split("\0").map((v) => v.trim()).filter((v) => v?.length);
        await Promise.all(values.map((v) => this.metadata.addTag("AIFF", header.chunkID, v)));
        return header.chunkSize;
      }
    };
  }
});

// node_modules/music-metadata/lib/aiff/AiffLoader.js
var aiffParserLoader;
var init_AiffLoader = __esm({
  "node_modules/music-metadata/lib/aiff/AiffLoader.js"() {
    aiffParserLoader = {
      parserType: "aiff",
      extensions: [".aif", "aiff", "aifc"],
      mimeTypes: ["audio/aiff", "audio/aif", "audio/aifc", "application/aiff"],
      async load() {
        return (await Promise.resolve().then(() => (init_AiffParser(), AiffParser_exports))).AIFFParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/apev2/Apev2Loader.js
var apeParserLoader;
var init_Apev2Loader = __esm({
  "node_modules/music-metadata/lib/apev2/Apev2Loader.js"() {
    apeParserLoader = {
      parserType: "apev2",
      extensions: [".ape"],
      mimeTypes: ["audio/ape", "audio/monkeys-audio"],
      async load() {
        return (await Promise.resolve().then(() => (init_APEv2Parser(), APEv2Parser_exports))).APEv2Parser;
      }
    };
  }
});

// node_modules/music-metadata/lib/type.js
var TrackType, TrackTypeValueToKeyMap;
var init_type = __esm({
  "node_modules/music-metadata/lib/type.js"() {
    init_ID3v2Token();
    TrackType = {
      video: 1,
      audio: 2,
      complex: 3,
      logo: 4,
      subtitle: 17,
      button: 18,
      control: 32,
      /** Timed metadata (library extension to the Matroska track types). */
      metadata: 33
    };
    TrackTypeValueToKeyMap = {
      [TrackType.video]: "video",
      [TrackType.audio]: "audio",
      [TrackType.complex]: "complex",
      [TrackType.logo]: "logo",
      [TrackType.subtitle]: "subtitle",
      [TrackType.button]: "button",
      [TrackType.control]: "control",
      [TrackType.metadata]: "metadata"
    };
  }
});

// node_modules/win-guid/lib/guid.js
function parseWindowsGuid(guid) {
  let s = guid.trim();
  if (s.length !== 36 || s[8] !== "-" || s[13] !== "-" || s[18] !== "-" || s[23] !== "-") {
    throw new Error(`Invalid GUID format: ${guid}`);
  }
  let v;
  const out = new Uint8Array(16);
  v = parseInt(s.slice(0, 8), 16);
  out[0] = v & 255;
  out[1] = v >>> 8 & 255;
  out[2] = v >>> 16 & 255;
  out[3] = v >>> 24 & 255;
  v = parseInt(s.slice(9, 13), 16);
  out[4] = v & 255;
  out[5] = v >>> 8 & 255;
  v = parseInt(s.slice(14, 18), 16);
  out[6] = v & 255;
  out[7] = v >>> 8 & 255;
  v = parseInt(s.slice(19, 23), 16);
  out[8] = v >>> 8 & 255;
  out[9] = v & 255;
  v = parseInt(s.slice(24, 32), 16);
  out[10] = v >>> 24 & 255;
  out[11] = v >>> 16 & 255;
  out[12] = v >>> 8 & 255;
  out[13] = v & 255;
  v = parseInt(s.slice(32, 36), 16);
  out[14] = v >>> 8 & 255;
  out[15] = v & 255;
  for (let i = 0; i < 16; i++) {
    if (!Number.isFinite(out[i])) {
      throw new Error(`Invalid GUID format: ${guid}`);
    }
  }
  if (!/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s)) {
    throw new Error(`Invalid GUID format: ${guid}`);
  }
  return out;
}
var Guid;
var init_guid = __esm({
  "node_modules/win-guid/lib/guid.js"() {
    Guid = class _Guid {
      constructor(bytes) {
        if (bytes.length !== 16)
          throw new Error("GUID must be exactly 16 bytes");
        this.bytes = bytes;
      }
      static fromString(guid) {
        return new _Guid(parseWindowsGuid(guid));
      }
      /**
       * Convert Windows / CFBF byte order into canonical GUID string:
       * xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
       */
      toString() {
        const b = this.bytes;
        const hx = (n) => n.toString(16).padStart(2, "0");
        const g1 = hx(b[3]) + hx(b[2]) + hx(b[1]) + hx(b[0]);
        const g2 = hx(b[5]) + hx(b[4]);
        const g3 = hx(b[7]) + hx(b[6]);
        const g4 = hx(b[8]) + hx(b[9]);
        const g5 = hx(b[10]) + hx(b[11]) + hx(b[12]) + hx(b[13]) + hx(b[14]) + hx(b[15]);
        return `${g1}-${g2}-${g3}-${g4}-${g5}`.toUpperCase();
      }
      /**
       * Compare against a Uint8Array containing GUID bytes
       * in Windows / CFBF layout.
       */
      equals(buf, offset = 0) {
        if (offset < 0 || buf.length - offset < 16)
          return false;
        const a = this.bytes;
        for (let i = 0; i < 16; i++) {
          if (buf[offset + i] !== a[i])
            return false;
        }
        return true;
      }
    };
  }
});

// node_modules/music-metadata/lib/asf/AsfGuid.js
var AsfGuid;
var init_AsfGuid = __esm({
  "node_modules/music-metadata/lib/asf/AsfGuid.js"() {
    init_guid();
    AsfGuid = class _AsfGuid {
      // 10.1 Top-level ASF object GUIDs
      static HeaderObject = new _AsfGuid("75B22630-668E-11CF-A6D9-00AA0062CE6C");
      static DataObject = new _AsfGuid("75B22636-668E-11CF-A6D9-00AA0062CE6C");
      static SimpleIndexObject = new _AsfGuid("33000890-E5B1-11CF-89F4-00A0C90349CB");
      static IndexObject = new _AsfGuid("D6E229D3-35DA-11D1-9034-00A0C90349BE");
      static MediaObjectIndexObject = new _AsfGuid("FEB103F8-12AD-4C64-840F-2A1D2F7AD48C");
      static TimecodeIndexObject = new _AsfGuid("3CB73FD0-0C4A-4803-953D-EDF7B6228F0C");
      // 10.2 Header Object GUIDs
      static FilePropertiesObject = new _AsfGuid("8CABDCA1-A947-11CF-8EE4-00C00C205365");
      static StreamPropertiesObject = new _AsfGuid("B7DC0791-A9B7-11CF-8EE6-00C00C205365");
      static HeaderExtensionObject = new _AsfGuid("5FBF03B5-A92E-11CF-8EE3-00C00C205365");
      static CodecListObject = new _AsfGuid("86D15240-311D-11D0-A3A4-00A0C90348F6");
      static ScriptCommandObject = new _AsfGuid("1EFB1A30-0B62-11D0-A39B-00A0C90348F6");
      static MarkerObject = new _AsfGuid("F487CD01-A951-11CF-8EE6-00C00C205365");
      static BitrateMutualExclusionObject = new _AsfGuid("D6E229DC-35DA-11D1-9034-00A0C90349BE");
      static ErrorCorrectionObject = new _AsfGuid("75B22635-668E-11CF-A6D9-00AA0062CE6C");
      static ContentDescriptionObject = new _AsfGuid("75B22633-668E-11CF-A6D9-00AA0062CE6C");
      static ExtendedContentDescriptionObject = new _AsfGuid("D2D0A440-E307-11D2-97F0-00A0C95EA850");
      static ContentBrandingObject = new _AsfGuid("2211B3FA-BD23-11D2-B4B7-00A0C955FC6E");
      static StreamBitratePropertiesObject = new _AsfGuid("7BF875CE-468D-11D1-8D82-006097C9A2B2");
      static ContentEncryptionObject = new _AsfGuid("2211B3FB-BD23-11D2-B4B7-00A0C955FC6E");
      static ExtendedContentEncryptionObject = new _AsfGuid("298AE614-2622-4C17-B935-DAE07EE9289C");
      static DigitalSignatureObject = new _AsfGuid("2211B3FC-BD23-11D2-B4B7-00A0C955FC6E");
      static PaddingObject = new _AsfGuid("1806D474-CADF-4509-A4BA-9AABCB96AAE8");
      // 10.3 Header Extension Object GUIDs
      static ExtendedStreamPropertiesObject = new _AsfGuid("14E6A5CB-C672-4332-8399-A96952065B5A");
      static AdvancedMutualExclusionObject = new _AsfGuid("A08649CF-4775-4670-8A16-6E35357566CD");
      static GroupMutualExclusionObject = new _AsfGuid("D1465A40-5A79-4338-B71B-E36B8FD6C249");
      static StreamPrioritizationObject = new _AsfGuid("D4FED15B-88D3-454F-81F0-ED5C45999E24");
      static BandwidthSharingObject = new _AsfGuid("A69609E6-517B-11D2-B6AF-00C04FD908E9");
      static LanguageListObject = new _AsfGuid("7C4346A9-EFE0-4BFC-B229-393EDE415C85");
      static MetadataObject = new _AsfGuid("C5F8CBEA-5BAF-4877-8467-AA8C44FA4CCA");
      static MetadataLibraryObject = new _AsfGuid("44231C94-9498-49D1-A141-1D134E457054");
      static IndexParametersObject = new _AsfGuid("D6E229DF-35DA-11D1-9034-00A0C90349BE");
      static MediaObjectIndexParametersObject = new _AsfGuid("6B203BAD-3F11-48E4-ACA8-D7613DE2CFA7");
      static TimecodeIndexParametersObject = new _AsfGuid("F55E496D-9797-4B5D-8C8B-604DFE9BFB24");
      static CompatibilityObject = new _AsfGuid("26F18B5D-4584-47EC-9F5F-0E651F0452C9");
      static AdvancedContentEncryptionObject = new _AsfGuid("43058533-6981-49E6-9B74-AD12CB86D58C");
      // 10.4 Stream Properties Object Stream Type GUIDs
      static AudioMedia = new _AsfGuid("F8699E40-5B4D-11CF-A8FD-00805F5C442B");
      static VideoMedia = new _AsfGuid("BC19EFC0-5B4D-11CF-A8FD-00805F5C442B");
      static CommandMedia = new _AsfGuid("59DACFC0-59E6-11D0-A3AC-00A0C90348F6");
      static JFIF_Media = new _AsfGuid("B61BE100-5B4E-11CF-A8FD-00805F5C442B");
      static Degradable_JPEG_Media = new _AsfGuid("35907DE0-E415-11CF-A917-00805F5C442B");
      static FileTransferMedia = new _AsfGuid("91BD222C-F21C-497A-8B6D-5AA86BFC0185");
      static BinaryMedia = new _AsfGuid("3AFB65E2-47EF-40F2-AC2C-70A90D71D343");
      static ASF_Index_Placeholder_Object = new _AsfGuid("D9AADE20-7C17-4F9C-BC28-8555DD98E2A2");
      static fromBin(bin, offset = 0) {
        return new _AsfGuid(_AsfGuid.decode(bin, offset));
      }
      /**
       * Decode GUID in format like "B503BF5F-2EA9-CF11-8EE3-00C00C205365"
       * @param objectId Binary GUID
       * @param offset Read offset in bytes, default 0
       * @returns GUID as dashed hexadecimal representation
       */
      static decode(objectId, offset = 0) {
        return new Guid(objectId.subarray(offset, offset + 16)).toString();
      }
      /**
       * Decode stream type
       * @param mediaType Media type GUID
       * @returns Media type
       */
      static decodeMediaType(mediaType) {
        switch (mediaType.str) {
          case _AsfGuid.AudioMedia.str:
            return "audio";
          case _AsfGuid.VideoMedia.str:
            return "video";
          case _AsfGuid.CommandMedia.str:
            return "command";
          case _AsfGuid.Degradable_JPEG_Media.str:
            return "degradable-jpeg";
          case _AsfGuid.FileTransferMedia.str:
            return "file-transfer";
          case _AsfGuid.BinaryMedia.str:
            return "binary";
        }
      }
      /**
       * Encode GUID
       * @param guid GUID like: "B503BF5F-2EA9-CF11-8EE3-00C00C205365"
       * @returns Encoded Binary GUID
       */
      static encode(guid) {
        return parseWindowsGuid(guid);
      }
      str;
      constructor(str) {
        this.str = str;
      }
      equals(guid) {
        return this.str === guid.str;
      }
      toBin() {
        return _AsfGuid.encode(this.str);
      }
    };
  }
});

// node_modules/music-metadata/lib/asf/AsfUtil.js
function getParserForAttr(i) {
  return attributeParsers[i];
}
function parseUnicodeAttr(uint8Array) {
  return stripNulls(decodeString(uint8Array, "utf-16le"));
}
function parseByteArrayAttr(buf) {
  return new Uint8Array(buf);
}
function parseBoolAttr(buf, offset = 0) {
  return parseWordAttr(buf, offset) === 1;
}
function parseDWordAttr(buf, offset = 0) {
  return UINT32_LE.get(buf, offset);
}
function parseQWordAttr(buf, offset = 0) {
  return UINT64_LE.get(buf, offset);
}
function parseWordAttr(buf, offset = 0) {
  return UINT16_LE.get(buf, offset);
}
var attributeParsers;
var init_AsfUtil = __esm({
  "node_modules/music-metadata/lib/asf/AsfUtil.js"() {
    init_lib3();
    init_Util();
    attributeParsers = [
      parseUnicodeAttr,
      parseByteArrayAttr,
      parseBoolAttr,
      parseDWordAttr,
      parseQWordAttr,
      parseWordAttr,
      parseByteArrayAttr
    ];
  }
});

// node_modules/music-metadata/lib/asf/AsfObject.js
async function readString(reader) {
  const length = await reader.readNumber(UINT16_LE);
  return (await reader.readToken(new StringType(length * 2, "utf-16le"))).replace("\0", "");
}
async function readCodecEntries(tokenizer, payloadSize, maxEntries = defaultMaxMetadataEntries) {
  const reader = createTokenizerView(tokenizer, payloadSize);
  const entries = [];
  try {
    const codecHeader = await reader.readToken(CodecListObjectHeader);
    if (codecHeader.entryCount > maxEntries) {
      throw new AsfContentParseError(`ASF Codec List entry count ${codecHeader.entryCount} exceeds entry limit ${maxEntries}`);
    }
    for (let i = 0; i < codecHeader.entryCount; ++i) {
      entries.push(await readCodecEntry(reader));
    }
    await reader.consumeRemainder();
  } catch (error) {
    if (error instanceof EndOfStreamError || error instanceof TokenizerBoundaryError) {
      throw new AsfContentParseError(`Unexpected end of ASF Codec List Object: ${error.message}`);
    }
    throw error;
  } finally {
    await reader.close();
  }
  return entries;
}
async function readInformation(reader) {
  const length = await reader.readNumber(UINT16_LE);
  return reader.readToken(new Uint8ArrayType(length));
}
async function readCodecEntry(reader) {
  const type = await reader.readNumber(UINT16_LE);
  return {
    type: {
      videoCodec: (type & 1) === 1,
      audioCodec: (type & 2) === 2
    },
    codecName: await readString(reader),
    description: await readString(reader),
    information: await readInformation(reader)
  };
}
var AsfContentParseError, ByteCursor, DataType2, TopLevelHeaderObjectToken, HeaderObjectToken, State, FilePropertiesObject, StreamPropertiesObject, HeaderExtensionObject, CodecListObjectHeader, ContentDescriptionObjectState, ExtendedContentDescriptionObjectState, ExtendedStreamPropertiesObjectState, MetadataObjectState, MetadataLibraryObjectState, WmPictureToken;
var init_AsfObject = __esm({
  "node_modules/music-metadata/lib/asf/AsfObject.js"() {
    init_Allocation();
    init_lib();
    init_lib3();
    init_ID3v2Token();
    init_ParseError();
    init_AsfGuid();
    init_AsfUtil();
    AsfContentParseError = class extends makeUnexpectedFileContentError("ASF") {
    };
    ByteCursor = class {
      context;
      data;
      position = 0;
      constructor(buf, off, length, context) {
        this.context = context;
        if (off < 0 || length < 0 || length > buf.length - off) {
          throw new AsfContentParseError(`Truncated ${context}`);
        }
        this.data = buf.subarray(off, off + length);
      }
      get remaining() {
        return this.data.length - this.position;
      }
      require(length, message = `Truncated ${this.context}`) {
        if (length > this.remaining) {
          throw new AsfContentParseError(message);
        }
      }
      read(token) {
        this.require(token.len);
        const value = token.get(this.data, this.position);
        this.position += token.len;
        return value;
      }
      bytes(length, message) {
        this.require(length, message);
        const start = this.position;
        this.position += length;
        return this.data.subarray(start, this.position);
      }
    };
    DataType2 = {
      /**
       * Unicode string. The data consists of a sequence of Unicode characters.
       */
      UnicodeString: 0,
      /**
       * BYTE array. The type of data is implementation-specific.
       */
      ByteArray: 1,
      /**
       * BOOL. The data is 2 bytes long and should be interpreted as a 16-bit unsigned integer. Only 0x0000 or 0x0001 are permitted values.
       */
      Bool: 2,
      /**
       * DWORD. The data is 4 bytes long and should be interpreted as a 32-bit unsigned integer.
       */
      DWord: 3,
      /**
       * QWORD. The data is 8 bytes long and should be interpreted as a 64-bit unsigned integer.
       */
      QWord: 4,
      /**
       * WORD. The data is 2 bytes long and should be interpreted as a 16-bit unsigned integer.
       */
      Word: 5
    };
    TopLevelHeaderObjectToken = {
      len: 30,
      get: (buf, off) => {
        const base = HeaderObjectToken.get(buf, off);
        if (base.objectSize < TopLevelHeaderObjectToken.len) {
          throw new AsfContentParseError(`Invalid ASF top-level header object size: ${base.objectSize}`);
        }
        return {
          ...base,
          numberOfHeaderObjects: UINT32_LE.get(buf, off + 24)
          // reserved: 2 bytes
        };
      }
    };
    HeaderObjectToken = {
      len: 24,
      get: (buf, off) => {
        const objectSize = UINT64_LE.get(buf, off + 16);
        if (objectSize < BigInt(HeaderObjectToken.len) || objectSize > BigInt(Number.MAX_SAFE_INTEGER)) {
          throw new AsfContentParseError(`Invalid ASF header object size: ${objectSize}`);
        }
        const header = {
          objectId: AsfGuid.fromBin(buf, off),
          objectSize: Number(objectSize)
        };
        return header;
      }
    };
    State = class {
      len;
      constructor(header) {
        this.len = header.objectSize - HeaderObjectToken.len;
      }
      postProcessTag(tags, name, valueType, data) {
        if (name === "WM/Picture") {
          tags.push({ id: name, value: WmPictureToken.fromBuffer(data) });
        } else {
          const parseAttr = getParserForAttr(valueType);
          if (!parseAttr) {
            throw new AsfContentParseError(`unexpected value headerType: ${valueType}`);
          }
          const buffer = data;
          const minimumLength = valueType === DataType2.QWord ? 8 : valueType === DataType2.DWord ? 4 : valueType === DataType2.Bool || valueType === DataType2.Word ? 2 : 0;
          if (buffer.length < minimumLength) {
            throw new AsfContentParseError(`Truncated ASF attribute ${name} of type ${valueType}`);
          }
          tags.push({ id: name, value: parseAttr(buffer) });
        }
      }
    };
    FilePropertiesObject = class extends State {
      static guid = AsfGuid.FilePropertiesObject;
      get(buf, off) {
        const flags = UINT32_LE.get(buf, off + 64);
        return {
          fileId: AsfGuid.fromBin(buf, off),
          fileSize: UINT64_LE.get(buf, off + 16),
          creationDate: UINT64_LE.get(buf, off + 24),
          dataPacketsCount: UINT64_LE.get(buf, off + 32),
          playDuration: UINT64_LE.get(buf, off + 40),
          sendDuration: UINT64_LE.get(buf, off + 48),
          preroll: UINT64_LE.get(buf, off + 56),
          flags: {
            broadcast: (flags & 1) !== 0,
            seekable: (flags & 2) !== 0
          },
          // flagsNumeric: Token.UINT32_LE.get(buf, off + 64),
          minimumDataPacketSize: UINT32_LE.get(buf, off + 68),
          maximumDataPacketSize: UINT32_LE.get(buf, off + 72),
          maximumBitrate: UINT32_LE.get(buf, off + 76)
        };
      }
    };
    StreamPropertiesObject = class extends State {
      static guid = AsfGuid.StreamPropertiesObject;
      get(buf, off) {
        const available = Math.min(this.len, buf.length - off);
        if (available < 54) {
          throw new AsfContentParseError("Truncated Stream Properties Object");
        }
        const typeSpecificSize = UINT32_LE.get(buf, off + 40);
        const correctionSize = UINT32_LE.get(buf, off + 44);
        if (typeSpecificSize + correctionSize > available - 54) {
          throw new AsfContentParseError("ASF stream data exceeds Stream Properties Object payload");
        }
        const result = {
          streamType: AsfGuid.decodeMediaType(AsfGuid.fromBin(buf, off)),
          errorCorrectionType: AsfGuid.fromBin(buf, off + 16),
          streamNumber: UINT16_LE.get(buf, off + 48) & 127
        };
        const data = off + 54;
        if (result.streamType === "audio" && typeSpecificSize >= 16) {
          result.codecId = `0x${UINT16_LE.get(buf, data).toString(16).padStart(4, "0")}`;
          result.audio = {
            channels: UINT16_LE.get(buf, data + 2),
            samplingFrequency: UINT32_LE.get(buf, data + 4)
          };
          const bitDepth = UINT16_LE.get(buf, data + 14);
          if (bitDepth > 0) {
            result.audio.bitDepth = bitDepth;
          }
          const bytesPerSecond = UINT32_LE.get(buf, data + 8);
          if (bytesPerSecond > 0) {
            result.bitrate = bytesPerSecond * 8;
          }
        } else if (result.streamType === "video" && typeSpecificSize >= 11) {
          result.video = {
            pixelWidth: UINT32_LE.get(buf, data),
            pixelHeight: UINT32_LE.get(buf, data + 4)
          };
          const formatSize = UINT16_LE.get(buf, data + 9);
          if (formatSize > typeSpecificSize - 11) {
            throw new AsfContentParseError("ASF video format data exceeds stream data");
          }
          if (formatSize >= 20) {
            result.codecId = new StringType(4, "ascii").get(buf, data + 27);
          }
        }
        return result;
      }
    };
    HeaderExtensionObject = class {
      static guid = AsfGuid.HeaderExtensionObject;
      len;
      constructor() {
        this.len = 22;
      }
      get(buf, off) {
        if (off < 0 || this.len > buf.length - off) {
          throw new AsfContentParseError("Truncated Header Extension Object");
        }
        const view = new DataView(buf.buffer, buf.byteOffset + off, this.len);
        return {
          reserved1: AsfGuid.fromBin(buf, off),
          reserved2: view.getUint16(16, true),
          extensionDataSize: view.getUint32(18, true)
        };
      }
    };
    CodecListObjectHeader = {
      len: 20,
      get: (buf, off) => {
        const view = new DataView(buf.buffer, off);
        return {
          entryCount: view.getUint16(16, true)
        };
      }
    };
    ContentDescriptionObjectState = class _ContentDescriptionObjectState extends State {
      static guid = AsfGuid.ContentDescriptionObject;
      static contentDescTags = ["Title", "Author", "Copyright", "Description", "Rating"];
      get(buf, off) {
        const cursor = new ByteCursor(buf, off, this.len, "Content Description Object");
        const lengths = cursor.bytes(10, "Truncated Content Description Object");
        const tags = [];
        for (const [i, tagName] of _ContentDescriptionObjectState.contentDescTags.entries()) {
          const length = UINT16_LE.get(lengths, i * 2);
          const value = cursor.bytes(length, `${tagName} length ${length} exceeds Content Description payload`);
          if (length > 0) {
            tags.push({ id: tagName, value: parseUnicodeAttr(value) });
          }
        }
        return tags;
      }
    };
    ExtendedContentDescriptionObjectState = class extends State {
      static guid = AsfGuid.ExtendedContentDescriptionObject;
      get(buf, off) {
        const cursor = new ByteCursor(buf, off, this.len, "Extended Content Description Object");
        const tags = [];
        const attrCount = cursor.read(UINT16_LE);
        if (attrCount > cursor.remaining / 6) {
          throw new AsfContentParseError("Extended Content Description count exceeds payload");
        }
        for (let i = 0; i < attrCount; i += 1) {
          cursor.require(6, "Truncated Extended Content Description record");
          const nameLen = cursor.read(UINT16_LE);
          cursor.require(nameLen + 4, "Extended Content Description name exceeds payload");
          const name = parseUnicodeAttr(cursor.bytes(nameLen, "Extended Content Description name exceeds payload"));
          const valueType = cursor.read(UINT16_LE);
          const valueLen = cursor.read(UINT16_LE);
          const value = cursor.bytes(valueLen, "Extended Content Description value exceeds payload");
          this.postProcessTag(tags, name, valueType, value);
        }
        return tags;
      }
    };
    ExtendedStreamPropertiesObjectState = class extends State {
      static guid = AsfGuid.ExtendedStreamPropertiesObject;
      get(buf, off) {
        const end = off + Math.min(this.len, buf.length - off);
        if (end - off < 64) {
          throw new AsfContentParseError("Truncated Extended Stream Properties Object");
        }
        const flags = UINT32_LE.get(buf, off + 44);
        const result = {
          startTime: UINT64_LE.get(buf, off),
          endTime: UINT64_LE.get(buf, off + 8),
          dataBitrate: UINT32_LE.get(buf, off + 16),
          bufferSize: UINT32_LE.get(buf, off + 20),
          initialBufferFullness: UINT32_LE.get(buf, off + 24),
          alternateDataBitrate: UINT32_LE.get(buf, off + 28),
          alternateBufferSize: UINT32_LE.get(buf, off + 32),
          alternateInitialBufferFullness: UINT32_LE.get(buf, off + 36),
          maximumObjectSize: UINT32_LE.get(buf, off + 40),
          flags: {
            reliableFlag: (flags & 1) !== 0,
            seekableFlag: (flags & 2) !== 0,
            resendLiveCleanpointsFlag: (flags & 8) !== 0
          },
          streamNumber: UINT16_LE.get(buf, off + 48) & 127,
          streamLanguageId: UINT16_LE.get(buf, off + 50),
          averageTimePerFrame: Number(UINT64_LE.get(buf, off + 52)),
          streamNameCount: UINT16_LE.get(buf, off + 60),
          payloadExtensionSystems: UINT16_LE.get(buf, off + 62),
          streamNames: [],
          streamPropertiesObject: null
        };
        let cursor = off + 64;
        const requireBytes = (length) => {
          if (length > end - cursor) {
            throw new AsfContentParseError("ASF extended stream data exceeds object payload");
          }
        };
        for (let index = 0; index < result.streamNameCount; ++index) {
          requireBytes(4);
          const language = UINT16_LE.get(buf, cursor);
          const length = UINT16_LE.get(buf, cursor + 2);
          cursor += 4;
          requireBytes(length);
          result.streamNames.push({
            streamLanguageId: language,
            streamName: parseUnicodeAttr(buf.subarray(cursor, cursor + length))
          });
          cursor += length;
        }
        for (let index = 0; index < result.payloadExtensionSystems; ++index) {
          requireBytes(22);
          const length = UINT32_LE.get(buf, cursor + 18);
          cursor += 22;
          requireBytes(length);
          cursor += length;
        }
        if (cursor < end) {
          requireBytes(HeaderObjectToken.len);
          const header = HeaderObjectToken.get(buf, cursor);
          if (!header.objectId.equals(AsfGuid.StreamPropertiesObject) || header.objectSize !== end - cursor) {
            throw new AsfContentParseError("Invalid embedded ASF Stream Properties Object");
          }
          result.streamPropertiesObject = new StreamPropertiesObject(header).get(buf, cursor + HeaderObjectToken.len);
        }
        return result;
      }
    };
    MetadataObjectState = class extends State {
      static guid = AsfGuid.MetadataObject;
      get(uint8Array, off) {
        const cursor = new ByteCursor(uint8Array, off, this.len, "Metadata Object");
        const tags = [];
        const descriptionRecordsCount = cursor.read(UINT16_LE);
        if (descriptionRecordsCount > cursor.remaining / 12) {
          throw new AsfContentParseError("Metadata record count exceeds payload");
        }
        for (let i = 0; i < descriptionRecordsCount; i += 1) {
          cursor.require(12, "Truncated Metadata record header");
          cursor.read(UINT32_LE);
          const nameLen = cursor.read(UINT16_LE);
          const dataType = cursor.read(UINT16_LE);
          const dataLen = cursor.read(UINT32_LE);
          const name = parseUnicodeAttr(cursor.bytes(nameLen, "Metadata name exceeds payload"));
          const data = cursor.bytes(dataLen, "Metadata value exceeds payload");
          this.postProcessTag(tags, name, dataType, data);
        }
        return tags;
      }
    };
    MetadataLibraryObjectState = class extends MetadataObjectState {
      static guid = AsfGuid.MetadataLibraryObject;
    };
    WmPictureToken = class _WmPictureToken {
      static fromBuffer(buffer) {
        const pic = new _WmPictureToken(buffer.length);
        return pic.get(buffer, 0);
      }
      len;
      constructor(len) {
        this.len = len;
      }
      get(buffer, offset) {
        const payload = buffer.subarray(offset, offset + this.len);
        if (payload.length < 5) {
          throw new AsfContentParseError("Truncated ASF picture header");
        }
        const view = new DataView(payload.buffer, payload.byteOffset, payload.byteLength);
        const typeId = view.getUint8(0);
        const size = view.getUint32(1, true);
        let index = 5;
        const readString2 = (field) => {
          const start = index;
          while (index + 2 <= payload.length) {
            const codeUnit = view.getUint16(index, true);
            index += 2;
            if (codeUnit === 0) {
              return new StringType(index - start - 2, "utf-16le").get(payload, start);
            }
          }
          throw new AsfContentParseError(`Unterminated ASF picture ${field}`);
        };
        const format = readString2("MIME type");
        const description = readString2("description");
        return {
          type: AttachedPictureType[typeId],
          format,
          description,
          size,
          data: payload.slice(index)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/asf/AsfParser.js
var AsfParser_exports = {};
__export(AsfParser_exports, {
  AsfParser: () => AsfParser
});
var import_debug6, debug6, headerType, AsfParser;
var init_AsfParser = __esm({
  "node_modules/music-metadata/lib/asf/AsfParser.js"() {
    import_debug6 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_Allocation();
    init_BasicParser();
    init_type();
    init_AsfGuid();
    init_AsfObject();
    init_AsfObject();
    debug6 = (0, import_debug6.default)("music-metadata:parser:ASF");
    headerType = "asf";
    AsfParser = class extends BasicParser {
      streams = /* @__PURE__ */ new Map();
      codecs = [];
      extendedStreams = /* @__PURE__ */ new Map();
      streamBitrates = /* @__PURE__ */ new Map();
      async parse() {
        const header = await this.readToken(TopLevelHeaderObjectToken);
        if (!header.objectId.equals(AsfGuid.HeaderObject)) {
          throw new AsfContentParseError(`expected asf header; but was not found; got: ${header.objectId.str}`);
        }
        if (header.numberOfHeaderObjects < 1 || header.numberOfHeaderObjects > 1e4) {
          throw new AsfContentParseError(`Unrealistic number of ASF header objects: ${header.numberOfHeaderObjects}`);
        }
        await this.parseObjectHeaders(header.numberOfHeaderObjects, header.objectSize - TopLevelHeaderObjectToken.len);
        for (const stream of this.streams.values()) {
          const type = stream.streamType === "audio" ? TrackType.audio : stream.streamType === "video" ? TrackType.video : stream.streamType === "command" ? TrackType.control : stream.streamType === "binary" ? TrackType.metadata : void 0;
          const codec = this.codecs.find((codec2) => {
            if (type === TrackType.audio && codec2.type.audioCodec && codec2.information.length >= 2) {
              return stream.codecId === `0x${UINT16_LE.get(codec2.information, 0).toString(16).padStart(4, "0")}`;
            }
            return type === TrackType.video && codec2.type.videoCodec && codec2.information.length >= 4 && stream.codecId === new StringType(4, "ascii").get(codec2.information, 0);
          });
          const track = { id: stream.streamNumber, type };
          const extended = this.extendedStreams.get(stream.streamNumber);
          if (stream.codecId !== void 0) {
            track.codecId = stream.codecId;
          }
          if (codec) {
            track.codecName = codec.codecName;
          }
          if (stream.audio) {
            track.audio = stream.audio;
          }
          if (stream.video) {
            track.video = stream.video;
          }
          if (extended) {
            if (extended.endTime > extended.startTime) {
              track.duration = Number(extended.endTime - extended.startTime) / 1e3;
            }
            const name = extended.streamNames[0]?.streamName;
            if (name) {
              track.name = name;
            }
            if (track.video && extended.averageTimePerFrame > 0) {
              track.video.frameRate = 1e7 / extended.averageTimePerFrame;
            }
          }
          const bitrate = this.streamBitrates.get(stream.streamNumber) ?? (extended && extended.dataBitrate > 0 ? extended.dataBitrate : stream.bitrate);
          if (bitrate !== void 0) {
            track.bitrate = bitrate;
          }
          this.metadata.addStreamInfo(track);
        }
        const audio = [...this.streams.values()].find((stream) => stream.audio)?.audio;
        if (audio) {
          this.metadata.setFormat("sampleRate", audio.samplingFrequency);
          this.metadata.setFormat("numberOfChannels", audio.channels);
          if (audio.bitDepth !== void 0) {
            this.metadata.setFormat("bitsPerSample", audio.bitDepth);
          }
        }
      }
      async parseObjectHeaders(numberOfObjectHeaders, remainingHeaderSize) {
        let tags;
        for (let index = 0; index < numberOfObjectHeaders; ++index) {
          const { header, payloadSize } = await this.readObjectHeader(remainingHeaderSize, "header");
          debug6("header GUID=%s", header.objectId.str);
          switch (header.objectId.str) {
            case FilePropertiesObject.guid.str: {
              this.validateAllocationSize(payloadSize, "File Properties Object");
              const fpo = await this.readToken(new FilePropertiesObject(header));
              if (!fpo.flags.broadcast) {
                const duration = Number(fpo.playDuration) / 1e7 - Number(fpo.preroll) / 1e3;
                if (Number.isFinite(duration) && duration > 0) {
                  this.metadata.setFormat("duration", duration);
                  this.metadata.setFormat("containerDuration", duration);
                }
              }
              this.metadata.setFormat("bitrate", fpo.maximumBitrate);
              break;
            }
            case StreamPropertiesObject.guid.str: {
              this.validateAllocationSize(payloadSize, "Stream Properties Object");
              const spo = await this.readToken(new StreamPropertiesObject(header));
              this.metadata.setFormat("container", `ASF/${spo.streamType}`);
              if (spo.streamType === "audio") {
                this.metadata.setFormat("hasAudio", true);
              } else if (spo.streamType === "video") {
                this.metadata.setFormat("hasVideo", true);
              }
              this.streams.set(spo.streamNumber, spo);
              break;
            }
            case HeaderExtensionObject.guid.str: {
              const extensionHeaderToken = new HeaderExtensionObject();
              if (payloadSize < extensionHeaderToken.len) {
                throw new AsfContentParseError(`ASF Header Extension Object payload is too small: ${payloadSize} bytes`);
              }
              const extHeader = await this.readToken(extensionHeaderToken);
              const expectedExtensionSize = payloadSize - extensionHeaderToken.len;
              if (extHeader.extensionDataSize !== expectedExtensionSize) {
                throw new AsfContentParseError(`ASF extension data size ${extHeader.extensionDataSize} does not match enclosing payload size ${expectedExtensionSize}`);
              }
              await this.parseExtensionObject(extHeader.extensionDataSize);
              break;
            }
            case ContentDescriptionObjectState.guid.str:
              this.validateAllocationSize(payloadSize, "Content Description Object");
              tags = await this.readToken(new ContentDescriptionObjectState(header));
              await this.addTags(tags);
              break;
            case ExtendedContentDescriptionObjectState.guid.str:
              this.validateAllocationSize(payloadSize, "Extended Content Description Object");
              tags = await this.readToken(new ExtendedContentDescriptionObjectState(header));
              await this.addTags(tags);
              break;
            case AsfGuid.CodecListObject.str: {
              this.validateAllocationSize(payloadSize, "Codec List Object");
              let codecs;
              try {
                codecs = await readCodecEntries(this.tokenizer, payloadSize, getMaxMetadataEntries(this.options));
              } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                throw new AsfContentParseError(`Invalid ASF Codec List Object: ${message}`);
              }
              for (const codec of codecs) {
                this.codecs.push(codec);
              }
              const audioCodecs = codecs.filter((codec) => codec.type.audioCodec).map((codec) => codec.codecName).join("/");
              this.metadata.setFormat("codec", audioCodecs);
              break;
            }
            case AsfGuid.StreamBitratePropertiesObject.str: {
              if (payloadSize < 2) {
                throw new AsfContentParseError("Truncated Stream Bitrate Properties Object");
              }
              const count = await this.readToken(UINT16_LE);
              if (count * 6 > payloadSize - 2) {
                throw new AsfContentParseError("ASF stream bitrate records exceed object payload");
              }
              for (let index2 = 0; index2 < count; ++index2) {
                const streamNumber = await this.readToken(UINT16_LE) & 127;
                this.streamBitrates.set(streamNumber, await this.readToken(UINT32_LE));
              }
              await this.ignorePayload(payloadSize - 2 - count * 6, "Stream Bitrate Properties Object");
              break;
            }
            case AsfGuid.PaddingObject.str:
              debug6("Padding: %s bytes", payloadSize);
              await this.ignorePayload(payloadSize, "Padding Object");
              break;
            default:
              this.metadata.addWarning(`Ignore ASF-Object-GUID: ${header.objectId.str}`);
              debug6("Ignore ASF-Object-GUID: %s", header.objectId.str);
              await this.ignorePayload(payloadSize, `object ${header.objectId.str}`);
          }
          remainingHeaderSize -= header.objectSize;
        }
        if (remainingHeaderSize !== 0) {
          throw new AsfContentParseError(`ASF header child objects leave ${remainingHeaderSize} payload byte(s) unaccounted`);
        }
      }
      async addTags(tags) {
        for (const { id, value } of tags) {
          await this.metadata.addTag(headerType, id, value);
        }
      }
      async readObjectHeader(remainingSize, containerType) {
        if (remainingSize < HeaderObjectToken.len) {
          throw new AsfContentParseError(`Insufficient ASF ${containerType} data for an object header: ${remainingSize} bytes`);
        }
        const header = await this.readToken(HeaderObjectToken);
        if (header.objectSize > remainingSize) {
          throw new AsfContentParseError(`ASF ${containerType} object size ${header.objectSize} exceeds remaining ${containerType} payload size ${remainingSize}`);
        }
        return {
          header,
          payloadSize: this.validatePayloadAvailability(header, `${containerType} object`)
        };
      }
      validatePayloadAvailability(header, objectType) {
        const payloadSize = header.objectSize - HeaderObjectToken.len;
        const fileSize = this.tokenizer.fileInfo.size;
        if (fileSize !== void 0) {
          const available = fileSize - this.tokenizer.position;
          if (payloadSize > available) {
            throw new AsfContentParseError(`ASF ${objectType} payload size ${payloadSize} exceeds available input size ${available}`);
          }
        }
        return payloadSize;
      }
      validateAllocationSize(payloadSize, objectType) {
        validateAllocation(payloadSize, this.options, (message) => new AsfContentParseError(`ASF ${objectType}: ${message}`));
      }
      async ignorePayload(payloadSize, objectType) {
        let ignored;
        try {
          ignored = await this.tokenizer.ignore(payloadSize);
        } catch (error) {
          if (error instanceof EndOfStreamError) {
            throw new AsfContentParseError(`Unexpected end of ASF ${objectType}`);
          }
          throw error;
        }
        if (ignored !== payloadSize) {
          throw new AsfContentParseError(`Unexpected end of ASF ${objectType}; missing ${payloadSize - ignored} bytes`);
        }
      }
      async parseExtensionObject(extensionSize) {
        while (extensionSize > 0) {
          const { header, payloadSize } = await this.readObjectHeader(extensionSize, "extension");
          switch (header.objectId.str) {
            case ExtendedStreamPropertiesObjectState.guid.str: {
              this.validateAllocationSize(payloadSize, "Extended Stream Properties Object");
              const extended = await this.readToken(new ExtendedStreamPropertiesObjectState(header));
              this.extendedStreams.set(extended.streamNumber, extended);
              if (extended.streamPropertiesObject) {
                const stream = extended.streamPropertiesObject;
                this.streams.set(stream.streamNumber, stream);
                this.metadata.setFormat("container", `ASF/${stream.streamType}`);
              }
              break;
            }
            case MetadataObjectState.guid.str: {
              this.validateAllocationSize(payloadSize, "Metadata Object");
              const moTags = await this.readToken(new MetadataObjectState(header));
              await this.addTags(moTags);
              break;
            }
            case MetadataLibraryObjectState.guid.str: {
              this.validateAllocationSize(payloadSize, "Metadata Library Object");
              const mlTags = await this.readToken(new MetadataLibraryObjectState(header));
              await this.addTags(mlTags);
              break;
            }
            case AsfGuid.PaddingObject.str:
              await this.ignorePayload(payloadSize, "extension Padding Object");
              break;
            case AsfGuid.CompatibilityObject.str:
              await this.ignorePayload(payloadSize, "Compatibility Object");
              break;
            case AsfGuid.ASF_Index_Placeholder_Object.str:
              await this.ignorePayload(payloadSize, "Index Placeholder Object");
              break;
            default:
              this.metadata.addWarning(`Ignore ASF-Object-GUID: ${header.objectId.str}`);
              await this.ignorePayload(payloadSize, `extension object ${header.objectId.str}`);
              break;
          }
          extensionSize -= header.objectSize;
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/asf/AsfLoader.js
var asfParserLoader;
var init_AsfLoader = __esm({
  "node_modules/music-metadata/lib/asf/AsfLoader.js"() {
    asfParserLoader = {
      parserType: "asf",
      extensions: [".asf", ".wma", ".wmv"],
      mimeTypes: ["audio/ms-wma", "video/ms-wmv", "audio/ms-asf", "video/ms-asf", "application/vnd.ms-asf"],
      async load() {
        return (await Promise.resolve().then(() => (init_AsfParser(), AsfParser_exports))).AsfParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/caf/CafToken.js
function varIntsPerPacket(desc) {
  return (desc.bytesPerPacket === 0 ? 1 : 0) + (desc.framesPerPacket === 0 ? 1 : 0);
}
function decodePacketTableEntries(body, desc, numberPackets) {
  const expected = numberPackets * varIntsPerPacket(desc);
  if (expected === 0) {
    return 0;
  }
  if (expected > body.length) {
    throw new CafContentError(`Packet Table data section holds ${body.length} byte(s) for ${expected} packet table entries`);
  }
  let offset = 0;
  for (let i = 0; i < expected; ++i) {
    let byte;
    do {
      if (offset >= body.length) {
        throw new CafContentError("Packet Table data section ends in the middle of a variable length integer");
      }
      byte = body[offset++];
    } while ((byte & 128) !== 0);
  }
  return offset;
}
function parseChannelDescriptions(body, count, maxEntries = defaultMaxMetadataEntries) {
  if (count * channelDescriptionLen > body.length) {
    throw new CafContentError(`Channel Layout chunk declares ${count} description(s) for ${body.length} byte(s)`);
  }
  if (count > maxEntries) {
    throw new CafContentError(`Channel Layout description count ${count} exceeds entry limit ${maxEntries}`);
  }
  const descriptions = [];
  for (let i = 0; i < count; ++i) {
    const off = i * channelDescriptionLen;
    descriptions.push({
      channelLabel: UINT32_BE.get(body, off),
      channelFlags: UINT32_BE.get(body, off + 4),
      coordinates: [
        Float32_BE.get(body, off + 8),
        Float32_BE.get(body, off + 12),
        Float32_BE.get(body, off + 16)
      ]
    });
  }
  return descriptions;
}
function parseInfoEntries(body, maxEntries = defaultMaxMetadataEntries) {
  const readString2 = (from) => {
    const end = body.indexOf(0, from);
    if (end < 0) {
      throw new CafContentError("Information chunk contains an unterminated string");
    }
    return { value: textDecode(body.subarray(from, end), "utf8"), next: end + 1 };
  };
  const numEntries = UINT32_BE.get(body, 0);
  if (numEntries > maxEntries) {
    throw new CafContentError(`Information entry count ${numEntries} exceeds entry limit ${maxEntries}`);
  }
  const entries = [];
  let offset = 4;
  for (let i = 0; i < numEntries; ++i) {
    const key = readString2(offset);
    const value = readString2(key.next);
    entries.push({ key: key.value, value: value.value });
    offset = value.next;
  }
  return entries;
}
var CafContentError, decodeFourCC, FileHeader2, ChunkHeader, AudioDescription, PacketTableHeader, ChannelLayoutHeader, channelDescriptionLen;
var init_CafToken = __esm({
  "node_modules/music-metadata/lib/caf/CafToken.js"() {
    init_lib2();
    init_lib3();
    init_Allocation();
    init_ParseError();
    CafContentError = class extends makeUnexpectedFileContentError("CAF") {
    };
    decodeFourCC = (buf, off) => textDecode(buf.subarray(off, off + 4), "latin1");
    FileHeader2 = {
      len: 8,
      get: (buf, off) => {
        return {
          fileType: decodeFourCC(buf, off),
          fileVersion: UINT16_BE.get(buf, off + 4),
          fileFlags: UINT16_BE.get(buf, off + 6)
        };
      }
    };
    ChunkHeader = {
      len: 12,
      get: (buf, off) => {
        return {
          chunkType: decodeFourCC(buf, off),
          chunkSize: Number(INT64_BE.get(buf, off + 4))
        };
      }
    };
    AudioDescription = {
      len: 32,
      get: (buf, off) => {
        return {
          sampleRate: Float64_BE.get(buf, off),
          formatId: decodeFourCC(buf, off + 8),
          formatFlags: UINT32_BE.get(buf, off + 12),
          bytesPerPacket: UINT32_BE.get(buf, off + 16),
          framesPerPacket: UINT32_BE.get(buf, off + 20),
          channelsPerFrame: UINT32_BE.get(buf, off + 24),
          bitsPerChannel: UINT32_BE.get(buf, off + 28)
        };
      }
    };
    PacketTableHeader = {
      len: 24,
      get: (buf, off) => {
        return {
          numberPackets: Number(INT64_BE.get(buf, off)),
          numberValidFrames: Number(INT64_BE.get(buf, off + 8)),
          primingFrames: INT32_BE.get(buf, off + 16),
          remainderFrames: INT32_BE.get(buf, off + 20)
        };
      }
    };
    ChannelLayoutHeader = {
      len: 12,
      get: (buf, off) => {
        return {
          channelLayoutTag: UINT32_BE.get(buf, off),
          channelBitmap: UINT32_BE.get(buf, off + 4),
          numberChannelDescriptions: UINT32_BE.get(buf, off + 8)
        };
      }
    };
    channelDescriptionLen = 20;
  }
});

// node_modules/music-metadata/lib/caf/CafParser.js
var CafParser_exports = {};
__export(CafParser_exports, {
  CafParser: () => CafParser
});
var import_debug7, debug7, codecByFormatId, editCountLen, numEntriesLen, CafParser;
var init_CafParser = __esm({
  "node_modules/music-metadata/lib/caf/CafParser.js"() {
    import_debug7 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_Allocation();
    init_BasicParser();
    init_CafToken();
    init_CafToken();
    debug7 = (0, import_debug7.default)("music-metadata:parser:caf");
    codecByFormatId = {
      lpcm: { codec: "PCM", lossless: true },
      ima4: { codec: "IMA4 ADPCM", lossless: false },
      alac: { codec: "ALAC", lossless: true },
      flac: { codec: "FLAC", lossless: true },
      ulaw: { codec: "ITU-T G.711 mu-law", lossless: false },
      alaw: { codec: "ITU-T G.711 A-law", lossless: false },
      ".mp1": { codec: "MPEG-1 Layer I", lossless: false },
      ".mp2": { codec: "MPEG-1 Layer II", lossless: false },
      ".mp3": { codec: "MPEG-1 Layer III", lossless: false },
      "aac ": { codec: "AAC", lossless: false },
      aace: { codec: "AAC", lossless: false },
      aacf: { codec: "AAC", lossless: false },
      aacg: { codec: "AAC", lossless: false },
      aach: { codec: "AAC", lossless: false },
      aacl: { codec: "AAC", lossless: false },
      aacp: { codec: "AAC", lossless: false }
    };
    editCountLen = 4;
    numEntriesLen = 4;
    CafParser = class extends BasicParser {
      desc;
      packetTable;
      dataBytes;
      expectedFirstChunk = true;
      reachedEndOfFile = false;
      async parse() {
        const header = await this.tokenizer.readToken(FileHeader2);
        if (header.fileType !== "caff") {
          throw new CafContentError(`Invalid file-type, expected 'caff', found '${header.fileType}'`);
        }
        this.metadata.setFormat("container", "CAF");
        this.metadata.setAudioOnly();
        while (!this.reachedEndOfFile && !this.endOfFileReached()) {
          let chunkHeader;
          try {
            chunkHeader = await this.tokenizer.readToken(ChunkHeader);
          } catch (error) {
            if (error instanceof EndOfStreamError) {
              debug7("End-of-stream");
              break;
            }
            throw error;
          }
          debug7(`Reading CAF chunk type=${chunkHeader.chunkType} size=${chunkHeader.chunkSize}`);
          if (this.expectedFirstChunk) {
            this.expectedFirstChunk = false;
            if (chunkHeader.chunkType !== "desc") {
              throw new CafContentError(`Expected an Audio Description chunk, found '${chunkHeader.chunkType}'`);
            }
          }
          await this.readChunk(chunkHeader);
        }
        if (!this.desc) {
          throw new CafContentError("Missing Audio Description chunk");
        }
        this.applyDerivedFormat();
      }
      endOfFileReached() {
        const { size } = this.tokenizer.fileInfo;
        return size !== void 0 && size - this.tokenizer.position < ChunkHeader.len;
      }
      async readChunk(header) {
        switch (header.chunkType) {
          case "desc":
            return this.readAudioDescription(header.chunkSize);
          case "pakt":
            return this.readPacketTable(header.chunkSize);
          case "data":
            return this.readAudioData(header.chunkSize);
          case "info":
            return this.readInfo(header.chunkSize);
          case "chan":
            return this.readChannelLayout(header.chunkSize);
          default:
            debug7(`Ignore chunk type=${header.chunkType} size=${header.chunkSize}`);
            return this.skipUnknownChunk(header.chunkSize);
        }
      }
      async readAudioDescription(chunkSize) {
        if (chunkSize < AudioDescription.len) {
          throw new CafContentError(`Audio Description chunk size ${chunkSize} is smaller than ${AudioDescription.len}`);
        }
        this.desc = await this.tokenizer.readToken(AudioDescription);
        await this.tokenizer.ignore(chunkSize - AudioDescription.len);
        this.applyAudioDescription(this.desc);
      }
      applyAudioDescription(desc) {
        this.metadata.setFormat("sampleRate", desc.sampleRate);
        this.metadata.setFormat("numberOfChannels", desc.channelsPerFrame);
        if (desc.bitsPerChannel > 0) {
          this.metadata.setFormat("bitsPerSample", desc.bitsPerChannel);
        }
        const codec = codecByFormatId[desc.formatId];
        this.metadata.setFormat("codec", codec ? codec.codec : desc.formatId);
        if (codec) {
          this.metadata.setFormat("lossless", codec.lossless);
        }
      }
      async readPacketTable(chunkSize) {
        const desc = this.desc;
        if (!desc) {
          throw new CafContentError("Packet Table chunk found before the Audio Description chunk");
        }
        if (chunkSize < PacketTableHeader.len) {
          throw new CafContentError(`Packet Table chunk size ${chunkSize} is smaller than ${PacketTableHeader.len}`);
        }
        this.validateChunkAvailability(chunkSize, "Packet Table");
        const packetTable = await this.tokenizer.readToken(PacketTableHeader);
        const body = await this.readChunkBody(chunkSize - PacketTableHeader.len, "Packet Table");
        decodePacketTableEntries(body, desc, packetTable.numberPackets);
        this.packetTable = packetTable;
      }
      async readAudioData(chunkSize) {
        if (chunkSize >= 0 && chunkSize < editCountLen) {
          throw new CafContentError(`Audio Data chunk size ${chunkSize} is too small to hold mEditCount`);
        }
        if (chunkSize >= 0) {
          this.validateChunkAvailability(chunkSize, "Audio Data");
        }
        if (await this.tokenizer.ignore(editCountLen) !== editCountLen) {
          throw new EndOfStreamError();
        }
        if (chunkSize === -1) {
          this.reachedEndOfFile = true;
          const { size } = this.tokenizer.fileInfo;
          if (size === void 0) {
            debug7("Audio Data chunk has an unknown size, cannot derive the bitrate");
            return;
          }
          this.dataBytes = size - this.tokenizer.position;
          await this.tokenizer.ignore(this.dataBytes);
          return;
        }
        const dataBytes = chunkSize - editCountLen;
        if (await this.tokenizer.ignore(dataBytes) !== dataBytes) {
          throw new EndOfStreamError();
        }
        this.dataBytes = dataBytes;
      }
      async readInfo(chunkSize) {
        if (chunkSize < numEntriesLen) {
          throw new CafContentError(`Information chunk size ${chunkSize} is too small to hold mNumEntries`);
        }
        const body = await this.readChunkBody(chunkSize, "Information");
        const entries = parseInfoEntries(body, getMaxMetadataEntries(this.options));
        for (const { key, value } of entries) {
          if (["artist", "composer", "lyricist", "genre"].includes(key)) {
            let count = 1;
            for (let offset = value.indexOf(","); offset >= 0; offset = value.indexOf(",", offset + 1)) {
              ++count;
            }
            if (count > getMaxMetadataEntries(this.options)) {
              throw new CafContentError(`Comma-separated value count ${count} exceeds entry limit ${getMaxMetadataEntries(this.options)}`);
            }
          }
          debug7(`info key=${key}`);
          await this.metadata.addTag("CAF", key, value);
        }
      }
      async readChannelLayout(chunkSize) {
        if (chunkSize < ChannelLayoutHeader.len) {
          throw new CafContentError(`Channel Layout chunk size ${chunkSize} is smaller than ${ChannelLayoutHeader.len}`);
        }
        this.validateChunkAvailability(chunkSize, "Channel Layout");
        const header = await this.tokenizer.readToken(ChannelLayoutHeader);
        const descriptionLen = header.numberChannelDescriptions * channelDescriptionLen;
        const bodyLen = ChannelLayoutHeader.len + descriptionLen;
        if (bodyLen > chunkSize) {
          throw new CafContentError(`Channel Layout chunk declares ${header.numberChannelDescriptions} description(s) which exceed its size of ${chunkSize}`);
        }
        const descriptions = descriptionLen > 0 ? parseChannelDescriptions(await this.readChunkBody(descriptionLen, "Channel Layout"), header.numberChannelDescriptions, getMaxMetadataEntries(this.options)) : [];
        await this.addChannelLayout(header, descriptions);
        await this.tokenizer.ignore(chunkSize - bodyLen);
      }
      async addChannelLayout(header, descriptions) {
        await this.metadata.addTag("CAF", "channelLayoutTag", header.channelLayoutTag);
        await this.metadata.addTag("CAF", "channelLayoutBitmap", header.channelBitmap);
        if (descriptions.length > 0) {
          await this.metadata.addTag("CAF", "channelLayoutDescriptions", descriptions);
        }
      }
      /**
       * Rejects a whole chunk whose declared size exceeds the remaining input.
       * Only applicable when the total input size is known.
       */
      validateChunkAvailability(chunkSize, chunkType) {
        const { size } = this.tokenizer.fileInfo;
        if (size !== void 0) {
          const available = size - this.tokenizer.position;
          if (chunkSize > available) {
            throw new CafContentError(`${chunkType} chunk size ${chunkSize} exceeds available input size ${available}`);
          }
        }
      }
      /**
       * Reads a chunk body without trusting its declared size.
       * @param chunkSize Declared body size
       * @param chunkType Chunk name for error messages
       */
      async readChunkBody(chunkSize, chunkType) {
        this.validateChunkAvailability(chunkSize, chunkType);
        return this.readToken(new Uint8ArrayType(chunkSize));
      }
      async skipUnknownChunk(chunkSize) {
        if (chunkSize < 0) {
          throw new CafContentError(`Chunk size ${chunkSize} may only be -1 for an Audio Data chunk`);
        }
        await this.tokenizer.ignore(chunkSize);
      }
      // Deferred: the packet table and audio payload may arrive after the description
      applyDerivedFormat() {
        const desc = this.desc;
        if (!desc || desc.sampleRate <= 0) {
          return;
        }
        const frames = this.deriveFrameCount(desc);
        if (frames === void 0) {
          debug7("Unable to derive the number of sample frames");
          return;
        }
        const duration = frames / desc.sampleRate;
        this.metadata.setFormat("numberOfSamples", frames);
        this.metadata.setFormat("duration", duration);
        if (this.dataBytes !== void 0) {
          this.metadata.setFormat("bitrate", 8 * this.dataBytes / duration);
        }
      }
      deriveFrameCount(desc) {
        const packetTable = this.packetTable;
        if (packetTable) {
          if (packetTable.numberValidFrames > 0) {
            return packetTable.numberValidFrames;
          }
          debug7(`Ignoring packet table with mNumberValidFrames=${packetTable.numberValidFrames}`);
        }
        if (desc.bytesPerPacket > 0 && desc.framesPerPacket > 0 && this.dataBytes !== void 0) {
          const frames = this.dataBytes * desc.framesPerPacket / desc.bytesPerPacket;
          if (frames > 0) {
            return frames;
          }
        }
        return void 0;
      }
    };
  }
});

// node_modules/music-metadata/lib/caf/CafLoader.js
var cafParserLoader;
var init_CafLoader = __esm({
  "node_modules/music-metadata/lib/caf/CafLoader.js"() {
    cafParserLoader = {
      parserType: "caf",
      extensions: [".caf", ".caff"],
      mimeTypes: ["audio/caf", "application/caf"],
      async load() {
        return (await Promise.resolve().then(() => (init_CafParser(), CafParser_exports))).CafParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/lrc/LyricsParser.js
function parseLyrics(input, maxLines = defaultMaxMetadataEntries) {
  if (TIMESTAMP_REGEX.test(input)) {
    return parseLrc(input, maxLines);
  }
  return toUnsyncedLyrics(input);
}
function toUnsyncedLyrics(lyrics) {
  return {
    contentType: LyricsContentType.lyrics,
    timeStampFormat: TimestampFormat.notSynchronized,
    text: lyrics.trim(),
    syncText: []
  };
}
function parseLrc(lrcString, maxLines = defaultMaxMetadataEntries) {
  let lineCount = 1;
  for (let offset = lrcString.indexOf("\n"); offset >= 0; offset = lrcString.indexOf("\n", offset + 1)) {
    ++lineCount;
  }
  if (lineCount > maxLines) {
    throw new LyricsContentError(`Line count ${lineCount} exceeds entry limit ${maxLines}`);
  }
  const lines = lrcString.split("\n");
  const syncText = [];
  for (const line of lines) {
    const match = line.match(TIMESTAMP_REGEX);
    if (match) {
      const minutes = Number.parseInt(match[1], 10);
      const seconds = Number.parseInt(match[2], 10);
      const ms = match[3].length === 3 ? Number.parseInt(match[3], 10) : Number.parseInt(match[3], 10) * 10;
      const timestamp = (minutes * 60 + seconds) * 1e3 + ms;
      const text = line.replace(TIMESTAMP_REGEX, "").trim();
      syncText.push({ timestamp, text });
    }
  }
  return {
    contentType: LyricsContentType.lyrics,
    timeStampFormat: TimestampFormat.milliseconds,
    text: syncText.map((line) => line.text).join("\n"),
    syncText
  };
}
var TIMESTAMP_REGEX, LyricsContentError;
var init_LyricsParser = __esm({
  "node_modules/music-metadata/lib/lrc/LyricsParser.js"() {
    init_Allocation();
    init_ParseError();
    init_type();
    TIMESTAMP_REGEX = /\[(\d{2}):(\d{2})\.(\d{2,3})]/;
    LyricsContentError = class extends makeUnexpectedFileContentError("lyrics") {
    };
  }
});

// node_modules/music-metadata/lib/common/GenericTagMapper.js
var CommonTagMapper;
var init_GenericTagMapper = __esm({
  "node_modules/music-metadata/lib/common/GenericTagMapper.js"() {
    CommonTagMapper = class {
      static maxRatingScore = 1;
      static toIntOrNull(str) {
        const cleaned = Number.parseInt(str, 10);
        return Number.isNaN(cleaned) ? null : cleaned;
      }
      // TODO: a string of 1of1 would fail to be converted
      // converts 1/10 to no : 1, of : 10
      // or 1 to no : 1, of : 0
      static normalizeTrack(origVal) {
        const split = origVal.toString().split("/", 2);
        return {
          no: Number.parseInt(split[0], 10) || null,
          of: Number.parseInt(split[1], 10) || null
        };
      }
      tagTypes;
      tagMap;
      constructor(tagTypes, tagMap2) {
        this.tagTypes = tagTypes;
        this.tagMap = tagMap2;
      }
      /**
       * Process and set common tags
       * write common tags to
       * @param tag Native tag
       * @param warnings Register warnings
       * @return common name
       */
      mapGenericTag(tag, warnings) {
        tag = { id: tag.id, value: tag.value };
        this.postMap(tag, warnings);
        const id = this.getCommonName(tag.id);
        return id ? { id, value: tag.value } : null;
      }
      /**
       * Convert native tag key to common tag key
       * @param tag Native header tag
       * @return common tag name (alias)
       */
      getCommonName(tag) {
        return Object.hasOwn(this.tagMap, tag) ? this.tagMap[tag] : void 0;
      }
      /**
       * Handle post mapping exceptions / correction
       * @param tag Tag e.g. {"©alb", "Buena Vista Social Club")
       * @param warnings Used to register warnings
       */
      postMap(_tag, _warnings) {
        return;
      }
    };
  }
});

// node_modules/music-metadata/lib/aiff/AiffTagMap.js
var tagMap, AiffTagMapper;
var init_AiffTagMap = __esm({
  "node_modules/music-metadata/lib/aiff/AiffTagMap.js"() {
    init_GenericTagMapper();
    tagMap = {
      NAME: "title",
      AUTH: "artist",
      "(c) ": "copyright",
      ANNO: "comment"
    };
    AiffTagMapper = class extends CommonTagMapper {
      constructor() {
        super(["AIFF"], tagMap);
      }
    };
  }
});

// node_modules/music-metadata/lib/common/CaseInsensitiveTagMap.js
var CaseInsensitiveTagMap;
var init_CaseInsensitiveTagMap = __esm({
  "node_modules/music-metadata/lib/common/CaseInsensitiveTagMap.js"() {
    init_GenericTagMapper();
    CaseInsensitiveTagMap = class extends CommonTagMapper {
      constructor(tagTypes, tagMap2) {
        const upperCaseMap = {};
        for (const [tag, commonName] of Object.entries(tagMap2)) {
          upperCaseMap[tag.toUpperCase()] = commonName;
        }
        super(tagTypes, upperCaseMap);
      }
      /**
       * @tag  Native header tag
       * @return common tag name (alias)
       */
      getCommonName(tag) {
        return super.getCommonName(tag.toUpperCase());
      }
    };
  }
});

// node_modules/music-metadata/lib/apev2/APEv2TagMapper.js
var apev2TagMap, APEv2TagMapper;
var init_APEv2TagMapper = __esm({
  "node_modules/music-metadata/lib/apev2/APEv2TagMapper.js"() {
    init_CaseInsensitiveTagMap();
    apev2TagMap = {
      Title: "title",
      Artist: "artist",
      Artists: "artists",
      "Album Artist": "albumartist",
      Album: "album",
      Year: "date",
      Date: "date",
      Originalyear: "originalyear",
      Originaldate: "originaldate",
      Releasedate: "releasedate",
      Comment: "comment",
      Track: "track",
      Disc: "disk",
      DISCNUMBER: "disk",
      // ToDo: backwards compatibility', valid tag?
      Genre: "genre",
      "Cover Art (Front)": "picture",
      "Cover Art (Back)": "picture",
      Composer: "composer",
      Lyrics: "lyrics",
      ALBUMSORT: "albumsort",
      TITLESORT: "titlesort",
      WORK: "work",
      ARTISTSORT: "artistsort",
      ALBUMARTISTSORT: "albumartistsort",
      COMPOSERSORT: "composersort",
      Lyricist: "lyricist",
      Writer: "writer",
      Conductor: "conductor",
      // 'Performer=artist (instrument)': 'performer:instrument',
      MixArtist: "remixer",
      Arranger: "arranger",
      Engineer: "engineer",
      Producer: "producer",
      DJMixer: "djmixer",
      Mixer: "mixer",
      Label: "label",
      Grouping: "grouping",
      Subtitle: "subtitle",
      DiscSubtitle: "discsubtitle",
      Compilation: "compilation",
      BPM: "bpm",
      Mood: "mood",
      Media: "media",
      CatalogNumber: "catalognumber",
      MUSICBRAINZ_ALBUMSTATUS: "releasestatus",
      MUSICBRAINZ_ALBUMTYPE: "releasetype",
      RELEASECOUNTRY: "releasecountry",
      Script: "script",
      Language: "language",
      Copyright: "copyright",
      LICENSE: "license",
      EncodedBy: "encodedby",
      EncoderSettings: "encodersettings",
      Barcode: "barcode",
      ISRC: "isrc",
      ASIN: "asin",
      musicbrainz_trackid: "musicbrainz_recordingid",
      musicbrainz_releasetrackid: "musicbrainz_trackid",
      MUSICBRAINZ_ALBUMID: "musicbrainz_albumid",
      MUSICBRAINZ_ARTISTID: "musicbrainz_artistid",
      MUSICBRAINZ_ALBUMARTISTID: "musicbrainz_albumartistid",
      MUSICBRAINZ_RELEASEGROUPID: "musicbrainz_releasegroupid",
      MUSICBRAINZ_WORKID: "musicbrainz_workid",
      MUSICBRAINZ_TRMID: "musicbrainz_trmid",
      MUSICBRAINZ_DISCID: "musicbrainz_discid",
      Acoustid_Id: "acoustid_id",
      ACOUSTID_FINGERPRINT: "acoustid_fingerprint",
      MUSICIP_PUID: "musicip_puid",
      Weblink: "website",
      REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
      REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
      MP3GAIN_MINMAX: "replaygain_track_minmax",
      MP3GAIN_UNDO: "replaygain_undo"
    };
    APEv2TagMapper = class extends CaseInsensitiveTagMap {
      constructor() {
        super(["APEv2"], apev2TagMap);
      }
    };
  }
});

// node_modules/music-metadata/lib/asf/AsfTagMapper.js
var asfTagMap, AsfTagMapper;
var init_AsfTagMapper = __esm({
  "node_modules/music-metadata/lib/asf/AsfTagMapper.js"() {
    init_GenericTagMapper();
    init_Util();
    asfTagMap = {
      Title: "title",
      Author: "artist",
      "WM/AlbumArtist": "albumartist",
      "WM/AlbumTitle": "album",
      "WM/Year": "date",
      // changed to 'year' to 'date' based on Picard mappings; ToDo: check me
      "WM/OriginalReleaseTime": "originaldate",
      "WM/OriginalReleaseYear": "originalyear",
      Description: "comment",
      "WM/TrackNumber": "track",
      TotalTracks: "totaltracks",
      "WM/PartOfSet": "disk",
      "WM/Genre": "genre",
      "WM/Composer": "composer",
      "WM/Lyrics": "lyrics",
      "WM/AlbumSortOrder": "albumsort",
      "WM/TitleSortOrder": "titlesort",
      "WM/ArtistSortOrder": "artistsort",
      "WM/AlbumArtistSortOrder": "albumartistsort",
      "WM/ComposerSortOrder": "composersort",
      "WM/Writer": "lyricist",
      "WM/Conductor": "conductor",
      "WM/ModifiedBy": "remixer",
      "WM/Engineer": "engineer",
      "WM/Producer": "producer",
      "WM/DJMixer": "djmixer",
      "WM/Mixer": "mixer",
      "WM/Publisher": "label",
      "WM/ContentGroupDescription": "grouping",
      "WM/SubTitle": "subtitle",
      "WM/SetSubTitle": "discsubtitle",
      REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
      REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
      REPLAYGAIN_ALBUM_GAIN: "replaygain_album_gain",
      REPLAYGAIN_ALBUM_PEAK: "replaygain_album_peak",
      replaygain_track_gain: "replaygain_track_gain",
      replaygain_track_peak: "replaygain_track_peak",
      replaygain_album_gain: "replaygain_album_gain",
      replaygain_album_peak: "replaygain_album_peak",
      "WM/IsCompilation": "compilation",
      "WM/SharedUserRating": "rating",
      POPULARIMETER: "rating",
      "WM/BeatsPerMinute": "bpm",
      "WM/Mood": "mood",
      "WM/Media": "media",
      "WM/CatalogNo": "catalognumber",
      "MusicBrainz/Album Status": "releasestatus",
      "MusicBrainz/Album Type": "releasetype",
      "MusicBrainz/Album Release Country": "releasecountry",
      "WM/Script": "script",
      "WM/Language": "language",
      Copyright: "copyright",
      LICENSE: "license",
      "WM/EncodedBy": "encodedby",
      "WM/EncodingSettings": "encodersettings",
      "WM/Barcode": "barcode",
      "WM/ISRC": "isrc",
      "MusicBrainz/Track Id": "musicbrainz_recordingid",
      "MusicBrainz/Release Track Id": "musicbrainz_trackid",
      "MusicBrainz/Album Id": "musicbrainz_albumid",
      "MusicBrainz/Artist Id": "musicbrainz_artistid",
      "MusicBrainz/Album Artist Id": "musicbrainz_albumartistid",
      "MusicBrainz/Release Group Id": "musicbrainz_releasegroupid",
      "MusicBrainz/Work Id": "musicbrainz_workid",
      "MusicBrainz/TRM Id": "musicbrainz_trmid",
      "MusicBrainz/Disc Id": "musicbrainz_discid",
      "Acoustid/Id": "acoustid_id",
      "Acoustid/Fingerprint": "acoustid_fingerprint",
      "MusicIP/PUID": "musicip_puid",
      "WM/ARTISTS": "artists",
      "WM/InitialKey": "key",
      ASIN: "asin",
      "WM/Work": "work",
      "WM/AuthorURL": "website",
      "WM/Picture": "picture"
    };
    AsfTagMapper = class _AsfTagMapper extends CommonTagMapper {
      static toRating(rating) {
        const value = typeof rating === "number" ? rating : Number.parseFloat(rating);
        if (!Number.isFinite(value) || value <= 0) {
          return { rating: void 0 };
        }
        return { rating: value / 99 };
      }
      constructor() {
        super(["asf"], asfTagMap);
      }
      postMap(tag, warnings) {
        if (this.getCommonName(tag.id)?.startsWith("replaygain_")) {
          const value = typeof tag.value === "string" ? tag.value.trim().match(/^([+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?)\s*(dB)?$/i) : null;
          const normalized = value ? `${value[1]}${value[2] ? " dB" : ""}` : void 0;
          const ratio = normalized ? toRatio(normalized) : void 0;
          if (!ratio || !Number.isFinite(ratio.ratio) || Number.isNaN(ratio.dB)) {
            warnings.addWarning(`Invalid ASF ReplayGain value for ${tag.id}`);
            tag.id = "";
          } else {
            tag.value = normalized;
          }
        }
        switch (tag.id) {
          case "POPULARIMETER": {
            const [email, rating] = tag.value.split("|", 2);
            const value = Number(rating);
            const valid = /^\d+$/.test(rating) && Number.isInteger(value) && value >= 0 && value <= 255;
            if (!valid) {
              warnings.addWarning(`Invalid ASF POPULARIMETER rating: ${rating}`);
            }
            tag.value = {
              source: email,
              rating: valid && value > 0 ? (value - 1) / 254 * CommonTagMapper.maxRatingScore : void 0
            };
            break;
          }
          case "WM/SharedUserRating": {
            const keys = tag.id.split(":", 2);
            tag.value = _AsfTagMapper.toRating(tag.value);
            tag.id = keys[0];
            break;
          }
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/caf/CafTagMap.js
var infoTagMap, commaSeparatedKeys, CafTagMapper;
var init_CafTagMap = __esm({
  "node_modules/music-metadata/lib/caf/CafTagMap.js"() {
    init_GenericTagMapper();
    infoTagMap = {
      tempo: "bpm",
      "key signature": "key",
      artist: "artist",
      album: "album",
      "track number": "track",
      year: "year",
      composer: "composer",
      lyricist: "lyricist",
      genre: "genre",
      title: "title",
      "recorded date": "date",
      comments: "comment",
      copyright: "copyright",
      "source encoder": "encodersettings",
      "encoding application": "encodedby"
    };
    commaSeparatedKeys = /* @__PURE__ */ new Set(["artist", "composer", "lyricist", "genre"]);
    CafTagMapper = class extends CommonTagMapper {
      constructor() {
        super(["CAF"], infoTagMap);
      }
      mapGenericTag(tag, warnings) {
        if (commaSeparatedKeys.has(tag.id) && typeof tag.value === "string") {
          tag = {
            id: tag.id,
            value: tag.value.split(",").map((value) => value.trim()).filter((value) => value.length > 0)
          };
        }
        return super.mapGenericTag(tag, warnings);
      }
    };
  }
});

// node_modules/music-metadata/lib/id3v1/ID3v1TagMap.js
var id3v1TagMap, ID3v1TagMapper;
var init_ID3v1TagMap = __esm({
  "node_modules/music-metadata/lib/id3v1/ID3v1TagMap.js"() {
    init_GenericTagMapper();
    id3v1TagMap = {
      title: "title",
      artist: "artist",
      album: "album",
      year: "year",
      comment: "comment",
      track: "track",
      genre: "genre"
    };
    ID3v1TagMapper = class extends CommonTagMapper {
      constructor() {
        super(["ID3v1"], id3v1TagMap);
      }
    };
  }
});

// node_modules/music-metadata/lib/id3v2/ID3v22TagMapper.js
var id3v22TagMap, ID3v22TagMapper;
var init_ID3v22TagMapper = __esm({
  "node_modules/music-metadata/lib/id3v2/ID3v22TagMapper.js"() {
    init_CaseInsensitiveTagMap();
    id3v22TagMap = {
      TT2: "title",
      TP1: "artist",
      TP2: "albumartist",
      TAL: "album",
      TYE: "year",
      COM: "comment",
      ULT: "lyrics",
      "IPL:arranger": "arranger",
      "IPL:engineer": "engineer",
      "IPL:producer": "producer",
      "IPL:DJ-mix": "djmixer",
      "IPL:mix": "mixer",
      TRK: "track",
      TPA: "disk",
      TCO: "genre",
      PIC: "picture",
      TCM: "composer",
      TOR: "originaldate",
      TOT: "originalalbum",
      TXT: "lyricist",
      TP3: "conductor",
      TPB: "label",
      TT1: "grouping",
      TT3: "subtitle",
      TLA: "language",
      TCR: "copyright",
      WCP: "license",
      TEN: "encodedby",
      TSS: "encodersettings",
      WAR: "website",
      PCS: "podcast",
      TCP: "compilation",
      TDR: "date",
      TS2: "albumartistsort",
      TSA: "albumsort",
      TSC: "composersort",
      TSP: "artistsort",
      TST: "titlesort",
      WFD: "podcasturl",
      TBP: "bpm",
      GP1: "grouping"
    };
    ID3v22TagMapper = class extends CaseInsensitiveTagMap {
      constructor() {
        super(["ID3v2.2"], id3v22TagMap);
      }
    };
  }
});

// node_modules/music-metadata/lib/id3v2/ID3v24TagMapper.js
var id3v24TagMap, ID3v24TagMapper;
var init_ID3v24TagMapper = __esm({
  "node_modules/music-metadata/lib/id3v2/ID3v24TagMapper.js"() {
    init_lib3();
    init_CaseInsensitiveTagMap();
    init_GenericTagMapper();
    init_Util();
    id3v24TagMap = {
      // id3v2.3
      TIT2: "title",
      TPE1: "artist",
      "TXXX:Artists": "artists",
      TPE2: "albumartist",
      TALB: "album",
      TDRV: "date",
      // [ 'date', 'year' ] ToDo: improve 'year' mapping
      /**
       * Original release year
       */
      TORY: "originalyear",
      TPOS: "disk",
      TCON: "genre",
      APIC: "picture",
      TCOM: "composer",
      USLT: "lyrics",
      TSOA: "albumsort",
      TSOT: "titlesort",
      TOAL: "originalalbum",
      TSOP: "artistsort",
      TSO2: "albumartistsort",
      TSOC: "composersort",
      TEXT: "lyricist",
      "TXXX:Writer": "writer",
      TPE3: "conductor",
      // 'IPLS:instrument': 'performer:instrument', // ToDo
      TPE4: "remixer",
      "IPLS:arranger": "arranger",
      "IPLS:engineer": "engineer",
      "IPLS:producer": "producer",
      "IPLS:DJ-mix": "djmixer",
      "IPLS:mix": "mixer",
      TPUB: "label",
      TIT1: "grouping",
      TIT3: "subtitle",
      TRCK: "track",
      TCMP: "compilation",
      POPM: "rating",
      TBPM: "bpm",
      TMED: "media",
      "TXXX:CATALOGNUMBER": "catalognumber",
      "TXXX:MusicBrainz Album Status": "releasestatus",
      "TXXX:MusicBrainz Album Type": "releasetype",
      /**
       * Release country as documented: https://picard.musicbrainz.org/docs/mappings/#cite_note-0
       */
      "TXXX:MusicBrainz Album Release Country": "releasecountry",
      /**
       * Release country as implemented // ToDo: report
       */
      "TXXX:RELEASECOUNTRY": "releasecountry",
      "TXXX:SCRIPT": "script",
      TLAN: "language",
      TCOP: "copyright",
      WCOP: "license",
      TENC: "encodedby",
      TSSE: "encodersettings",
      "TXXX:BARCODE": "barcode",
      "TXXX:ISRC": "isrc",
      TSRC: "isrc",
      "TXXX:ASIN": "asin",
      "TXXX:originalyear": "originalyear",
      "UFID:http://musicbrainz.org": "musicbrainz_recordingid",
      "TXXX:MusicBrainz Release Track Id": "musicbrainz_trackid",
      "TXXX:MusicBrainz Album Id": "musicbrainz_albumid",
      "TXXX:MusicBrainz Artist Id": "musicbrainz_artistid",
      "TXXX:MusicBrainz Album Artist Id": "musicbrainz_albumartistid",
      "TXXX:MusicBrainz Release Group Id": "musicbrainz_releasegroupid",
      "TXXX:MusicBrainz Work Id": "musicbrainz_workid",
      "TXXX:MusicBrainz TRM Id": "musicbrainz_trmid",
      "TXXX:MusicBrainz Disc Id": "musicbrainz_discid",
      "TXXX:ACOUSTID_ID": "acoustid_id",
      "TXXX:Acoustid Id": "acoustid_id",
      "TXXX:Acoustid Fingerprint": "acoustid_fingerprint",
      "TXXX:MusicIP PUID": "musicip_puid",
      "TXXX:MusicMagic Fingerprint": "musicip_fingerprint",
      WOAR: "website",
      // id3v2.4
      // ToDo: In same sequence as defined at http://id3.org/id3v2.4.0-frames
      TDRC: "date",
      // date YYYY-MM-DD
      TYER: "year",
      TDOR: "originaldate",
      // 'TMCL:instrument': 'performer:instrument',
      "TIPL:arranger": "arranger",
      "TIPL:engineer": "engineer",
      "TIPL:producer": "producer",
      "TIPL:DJ-mix": "djmixer",
      "TIPL:mix": "mixer",
      TMOO: "mood",
      // additional mappings:
      SYLT: "lyrics",
      TSST: "discsubtitle",
      TKEY: "key",
      COMM: "comment",
      TOPE: "originalartist",
      // Windows Media Player
      "PRIV:AverageLevel": "averageLevel",
      "PRIV:PeakValue": "peakLevel",
      "PRIV:PeakLevel": "peakLevel",
      // Discogs
      "TXXX:DISCOGS_ARTIST_ID": "discogs_artist_id",
      "TXXX:DISCOGS_ARTISTS": "artists",
      "TXXX:DISCOGS_ARTIST_NAME": "artists",
      "TXXX:DISCOGS_ALBUM_ARTISTS": "albumartists",
      "TXXX:DISCOGS_CATALOG": "catalognumber",
      "TXXX:DISCOGS_COUNTRY": "releasecountry",
      "TXXX:DISCOGS_DATE": "originaldate",
      "TXXX:DISCOGS_LABEL": "label",
      "TXXX:DISCOGS_LABEL_ID": "discogs_label_id",
      "TXXX:DISCOGS_MASTER_RELEASE_ID": "discogs_master_release_id",
      "TXXX:DISCOGS_RATING": "discogs_rating",
      "TXXX:DISCOGS_RELEASED": "date",
      "TXXX:DISCOGS_RELEASE_ID": "discogs_release_id",
      "TXXX:DISCOGS_VOTES": "discogs_votes",
      "TXXX:CATALOGID": "catalognumber",
      "TXXX:STYLE": "genre",
      "TXXX:REPLAYGAIN_TRACK_PEAK": "replaygain_track_peak",
      "TXXX:REPLAYGAIN_TRACK_GAIN": "replaygain_track_gain",
      "TXXX:REPLAYGAIN_ALBUM_PEAK": "replaygain_album_peak",
      "TXXX:REPLAYGAIN_ALBUM_GAIN": "replaygain_album_gain",
      "TXXX:MP3GAIN_MINMAX": "replaygain_track_minmax",
      "TXXX:MP3GAIN_ALBUM_MINMAX": "replaygain_album_minmax",
      "TXXX:MP3GAIN_UNDO": "replaygain_undo",
      MVNM: "movement",
      MVIN: "movementIndex",
      PCST: "podcast",
      TCAT: "category",
      TDES: "description",
      TDRL: "releasedate",
      TGID: "podcastId",
      TKWD: "keywords",
      WFED: "podcasturl",
      GRP1: "grouping",
      PCNT: "playCounter"
    };
    ID3v24TagMapper = class _ID3v24TagMapper extends CaseInsensitiveTagMap {
      static toRating(popm) {
        return {
          source: popm.email,
          rating: popm.rating > 0 ? (popm.rating - 1) / 254 * CommonTagMapper.maxRatingScore : void 0
        };
      }
      constructor() {
        super(["ID3v2.3", "ID3v2.4"], id3v24TagMap);
      }
      /**
       * Handle post mapping exceptions / correction
       * @param tag to post map
       * @param warnings Wil be used to register (collect) warnings
       */
      postMap(tag, warnings) {
        switch (tag.id) {
          case "UFID":
            {
              const idTag = tag.value;
              if (idTag.owner_identifier === "http://musicbrainz.org") {
                tag.id += `:${idTag.owner_identifier}`;
                tag.value = decodeString(idTag.identifier, "latin1");
              }
            }
            break;
          case "PRIV":
            {
              const customTag = tag.value;
              switch (customTag.owner_identifier) {
                // decode Windows Media Player
                case "AverageLevel":
                case "PeakValue":
                case "PeakLevel":
                  tag.id += `:${customTag.owner_identifier}`;
                  tag.value = customTag.data.length === 4 ? UINT32_LE.get(customTag.data, 0) : null;
                  if (tag.value === null) {
                    warnings.addWarning(`Failed to parse PRIV:${customTag.owner_identifier}`);
                  }
                  break;
                default:
                  warnings.addWarning(`Unknown PRIV owner-identifier: ${customTag.owner_identifier.slice(0, 128)}`);
              }
            }
            break;
          case "POPM":
            tag.value = _ID3v24TagMapper.toRating(tag.value);
            break;
          default:
            break;
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/matroska/MatroskaTagMapper.js
var ebmlTagMap, MatroskaTagMapper;
var init_MatroskaTagMapper = __esm({
  "node_modules/music-metadata/lib/matroska/MatroskaTagMapper.js"() {
    init_CaseInsensitiveTagMap();
    ebmlTagMap = {
      "segment:title": "title",
      "album:ARTIST": "albumartist",
      "album:ARTISTSORT": "albumartistsort",
      "album:TITLE": "album",
      "album:DATE_RECORDED": "originaldate",
      "album:DATE_RELEASED": "releasedate",
      "album:PART_NUMBER": "disk",
      "album:TOTAL_PARTS": "totaltracks",
      "track:ARTIST": "artist",
      "track:ARTISTSORT": "artistsort",
      "track:TITLE": "title",
      "track:PART_NUMBER": "track",
      "track:MUSICBRAINZ_TRACKID": "musicbrainz_recordingid",
      "track:MUSICBRAINZ_ALBUMID": "musicbrainz_albumid",
      "track:MUSICBRAINZ_ARTISTID": "musicbrainz_artistid",
      "track:PUBLISHER": "label",
      "track:GENRE": "genre",
      "track:ENCODER": "encodedby",
      "track:ENCODER_OPTIONS": "encodersettings",
      "edition:TOTAL_PARTS": "totaldiscs",
      picture: "picture"
    };
    MatroskaTagMapper = class extends CaseInsensitiveTagMap {
      constructor() {
        super(["matroska"], ebmlTagMap);
      }
    };
  }
});

// node_modules/music-metadata/lib/mp4/MP4TagMapper.js
var mp4TagMap, tagType, MP4TagMapper;
var init_MP4TagMapper = __esm({
  "node_modules/music-metadata/lib/mp4/MP4TagMapper.js"() {
    init_CaseInsensitiveTagMap();
    mp4TagMap = {
      "mdta:title": "title",
      "mdta:album": "album",
      "mdta:artist": "artist",
      "mdta:album_artist": "albumartist",
      "mdta:albumartist": "albumartist",
      "mdta:composer": "composer",
      "mdta:date": "date",
      "mdta:comment": "comment",
      "mdta:description": "description",
      "mdta:synopsis": "longDescription",
      "mdta:genre": "genre",
      "mdta:track": "track",
      "mdta:disc": "disk",
      "mdta:publisher": "label",
      "mdta:subtitle": "subtitle",
      "mdta:language": "language",
      "mdta:copyright": "copyright",
      "mdta:encoder": "encodedby",
      "mdta:asin": "asin",
      "mdta:com.apple.quicktime.title": "title",
      "mdta:com.apple.quicktime.album": "album",
      "mdta:com.apple.quicktime.artist": "artist",
      "mdta:com.apple.quicktime.creationdate": "date",
      "mdta:com.apple.quicktime.comment": "comment",
      "mdta:com.apple.quicktime.description": "description",
      "mdta:com.apple.quicktime.genre": "genre",
      "mdta:com.apple.quicktime.copyright": "copyright",
      "\xA9nam": "title",
      "\xA9ART": "artist",
      aART: "albumartist",
      /**
       * ToDo: Album artist seems to be stored here while Picard documentation says: aART
       */
      "----:com.apple.iTunes:Band": "albumartist",
      "\xA9alb": "album",
      "\xA9day": "date",
      "\xA9cmt": "comment",
      "\xA9com": "comment",
      trkn: "track",
      disk: "disk",
      "\xA9gen": "genre",
      covr: "picture",
      "\xA9wrt": "composer",
      "\xA9lyr": "lyrics",
      soal: "albumsort",
      sonm: "titlesort",
      soar: "artistsort",
      soaa: "albumartistsort",
      soco: "composersort",
      "----:com.apple.iTunes:LYRICIST": "lyricist",
      "----:com.apple.iTunes:CONDUCTOR": "conductor",
      "----:com.apple.iTunes:REMIXER": "remixer",
      "----:com.apple.iTunes:ENGINEER": "engineer",
      "----:com.apple.iTunes:PRODUCER": "producer",
      "----:com.apple.iTunes:DJMIXER": "djmixer",
      "----:com.apple.iTunes:MIXER": "mixer",
      "----:com.apple.iTunes:LABEL": "label",
      "\xA9grp": "grouping",
      "----:com.apple.iTunes:SUBTITLE": "subtitle",
      "----:com.apple.iTunes:DISCSUBTITLE": "discsubtitle",
      cpil: "compilation",
      tmpo: "bpm",
      "----:com.apple.iTunes:MOOD": "mood",
      "----:com.apple.iTunes:MEDIA": "media",
      "----:com.apple.iTunes:CATALOGNUMBER": "catalognumber",
      tvsh: "tvShow",
      tvsn: "tvSeason",
      tves: "tvEpisode",
      sosn: "tvShowSort",
      tven: "tvEpisodeId",
      tvnn: "tvNetwork",
      pcst: "podcast",
      purl: "podcasturl",
      "----:com.apple.iTunes:MusicBrainz Album Status": "releasestatus",
      "----:com.apple.iTunes:MusicBrainz Album Type": "releasetype",
      "----:com.apple.iTunes:MusicBrainz Album Release Country": "releasecountry",
      "----:com.apple.iTunes:SCRIPT": "script",
      "----:com.apple.iTunes:LANGUAGE": "language",
      cprt: "copyright",
      "\xA9cpy": "copyright",
      "----:com.apple.iTunes:LICENSE": "license",
      "\xA9too": "encodedby",
      pgap: "gapless",
      "----:com.apple.iTunes:BARCODE": "barcode",
      "----:com.apple.iTunes:ISRC": "isrc",
      "----:com.apple.iTunes:ASIN": "asin",
      "----:com.apple.iTunes:NOTES": "comment",
      "----:com.apple.iTunes:MusicBrainz Track Id": "musicbrainz_recordingid",
      "----:com.apple.iTunes:MusicBrainz Release Track Id": "musicbrainz_trackid",
      "----:com.apple.iTunes:MusicBrainz Album Id": "musicbrainz_albumid",
      "----:com.apple.iTunes:MusicBrainz Artist Id": "musicbrainz_artistid",
      "----:com.apple.iTunes:MusicBrainz Album Artist Id": "musicbrainz_albumartistid",
      "----:com.apple.iTunes:MusicBrainz Release Group Id": "musicbrainz_releasegroupid",
      "----:com.apple.iTunes:MusicBrainz Work Id": "musicbrainz_workid",
      "----:com.apple.iTunes:MusicBrainz TRM Id": "musicbrainz_trmid",
      "----:com.apple.iTunes:MusicBrainz Disc Id": "musicbrainz_discid",
      "----:com.apple.iTunes:Acoustid Id": "acoustid_id",
      "----:com.apple.iTunes:Acoustid Fingerprint": "acoustid_fingerprint",
      "----:com.apple.iTunes:MusicIP PUID": "musicip_puid",
      "----:com.apple.iTunes:fingerprint": "musicip_fingerprint",
      "----:com.apple.iTunes:replaygain_track_gain": "replaygain_track_gain",
      "----:com.apple.iTunes:replaygain_track_peak": "replaygain_track_peak",
      "----:com.apple.iTunes:replaygain_album_gain": "replaygain_album_gain",
      "----:com.apple.iTunes:replaygain_album_peak": "replaygain_album_peak",
      "----:com.apple.iTunes:replaygain_track_minmax": "replaygain_track_minmax",
      "----:com.apple.iTunes:replaygain_album_minmax": "replaygain_album_minmax",
      "----:com.apple.iTunes:replaygain_undo": "replaygain_undo",
      "----:com.apple.iTunes:Movement Name": "movement",
      "----:com.apple.iTunes:Movement": "movementIndex",
      "----:com.apple.iTunes:Movement Total": "movementTotal",
      // Additional mappings:
      gnre: "genre",
      // ToDo: check mapping
      "----:com.apple.iTunes:ALBUMARTISTSORT": "albumartistsort",
      "----:com.apple.iTunes:ARTISTS": "artists",
      "----:com.apple.iTunes:ORIGINALDATE": "originaldate",
      "----:com.apple.iTunes:ORIGINALYEAR": "originalyear",
      "----:com.apple.iTunes:RELEASEDATE": "releasedate",
      // '----:com.apple.iTunes:PERFORMER': 'performer'
      desc: "description",
      ldes: "longDescription",
      "\xA9mvn": "movement",
      "\xA9mvi": "movementIndex",
      "\xA9mvc": "movementTotal",
      "\xA9wrk": "work",
      catg: "category",
      egid: "podcastId",
      hdvd: "hdVideo",
      keyw: "keywords",
      shwm: "showMovement",
      stik: "stik",
      rate: "rating"
    };
    tagType = "iTunes";
    MP4TagMapper = class extends CaseInsensitiveTagMap {
      constructor() {
        super([tagType], mp4TagMap);
      }
      postMap(tag, _warnings) {
        switch (tag.id) {
          case "rate":
            tag.value = {
              source: void 0,
              rating: Number.parseFloat(tag.value) / 100
            };
            break;
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/vorbis/VorbisTagMapper.js
var vorbisTagMap, VorbisTagMapper;
var init_VorbisTagMapper = __esm({
  "node_modules/music-metadata/lib/ogg/vorbis/VorbisTagMapper.js"() {
    init_GenericTagMapper();
    vorbisTagMap = {
      TITLE: "title",
      ARTIST: "artist",
      ARTISTS: "artists",
      ALBUMARTIST: "albumartist",
      "ALBUM ARTIST": "albumartist",
      ALBUM: "album",
      DATE: "date",
      ORIGINALDATE: "originaldate",
      ORIGINALYEAR: "originalyear",
      RELEASEDATE: "releasedate",
      COMMENT: "comment",
      DESCRIPTION: "comment",
      TRACKNUMBER: "track",
      DISCNUMBER: "disk",
      GENRE: "genre",
      METADATA_BLOCK_PICTURE: "picture",
      COMPOSER: "composer",
      LYRICS: "lyrics",
      UNSYNCEDLYRICS: "lyrics",
      ALBUMSORT: "albumsort",
      TITLESORT: "titlesort",
      WORK: "work",
      ARTISTSORT: "artistsort",
      ALBUMARTISTSORT: "albumartistsort",
      COMPOSERSORT: "composersort",
      LYRICIST: "lyricist",
      WRITER: "writer",
      CONDUCTOR: "conductor",
      // 'PERFORMER=artist (instrument)': 'performer:instrument', // ToDo
      REMIXER: "remixer",
      ARRANGER: "arranger",
      ENGINEER: "engineer",
      PRODUCER: "producer",
      DJMIXER: "djmixer",
      MIXER: "mixer",
      LABEL: "label",
      ORGANIZATION: "label",
      PUBLISHER: "label",
      GROUPING: "grouping",
      SUBTITLE: "subtitle",
      DISCSUBTITLE: "discsubtitle",
      TRACKTOTAL: "totaltracks",
      DISCTOTAL: "totaldiscs",
      COMPILATION: "compilation",
      RATING: "rating",
      BPM: "bpm",
      KEY: "key",
      MOOD: "mood",
      MEDIA: "media",
      CATALOGNUMBER: "catalognumber",
      RELEASESTATUS: "releasestatus",
      RELEASETYPE: "releasetype",
      RELEASECOUNTRY: "releasecountry",
      SCRIPT: "script",
      LANGUAGE: "language",
      COPYRIGHT: "copyright",
      LICENSE: "license",
      ENCODEDBY: "encodedby",
      ENCODERSETTINGS: "encodersettings",
      BARCODE: "barcode",
      ISRC: "isrc",
      ASIN: "asin",
      MUSICBRAINZ_TRACKID: "musicbrainz_recordingid",
      MUSICBRAINZ_RELEASETRACKID: "musicbrainz_trackid",
      MUSICBRAINZ_ALBUMID: "musicbrainz_albumid",
      MUSICBRAINZ_ARTISTID: "musicbrainz_artistid",
      MUSICBRAINZ_ALBUMARTISTID: "musicbrainz_albumartistid",
      MUSICBRAINZ_RELEASEGROUPID: "musicbrainz_releasegroupid",
      MUSICBRAINZ_WORKID: "musicbrainz_workid",
      MUSICBRAINZ_TRMID: "musicbrainz_trmid",
      MUSICBRAINZ_DISCID: "musicbrainz_discid",
      ACOUSTID_ID: "acoustid_id",
      ACOUSTID_ID_FINGERPRINT: "acoustid_fingerprint",
      MUSICIP_PUID: "musicip_puid",
      // 'FINGERPRINT=MusicMagic Fingerprint {fingerprint}': 'musicip_fingerprint', // ToDo
      WEBSITE: "website",
      NOTES: "notes",
      TOTALTRACKS: "totaltracks",
      TOTALDISCS: "totaldiscs",
      // Discogs
      DISCOGS_ARTIST_ID: "discogs_artist_id",
      DISCOGS_ARTISTS: "artists",
      DISCOGS_ARTIST_NAME: "artists",
      DISCOGS_ALBUM_ARTISTS: "albumartists",
      DISCOGS_CATALOG: "catalognumber",
      DISCOGS_COUNTRY: "releasecountry",
      DISCOGS_DATE: "originaldate",
      DISCOGS_LABEL: "label",
      DISCOGS_LABEL_ID: "discogs_label_id",
      DISCOGS_MASTER_RELEASE_ID: "discogs_master_release_id",
      DISCOGS_RATING: "discogs_rating",
      DISCOGS_RELEASED: "date",
      DISCOGS_RELEASE_ID: "discogs_release_id",
      DISCOGS_VOTES: "discogs_votes",
      CATALOGID: "catalognumber",
      STYLE: "genre",
      //
      REPLAYGAIN_TRACK_GAIN: "replaygain_track_gain",
      REPLAYGAIN_TRACK_PEAK: "replaygain_track_peak",
      REPLAYGAIN_ALBUM_GAIN: "replaygain_album_gain",
      REPLAYGAIN_ALBUM_PEAK: "replaygain_album_peak",
      // To Sure if these (REPLAYGAIN_MINMAX, REPLAYGAIN_ALBUM_MINMAX & REPLAYGAIN_UNDO) are used for Vorbis:
      REPLAYGAIN_MINMAX: "replaygain_track_minmax",
      REPLAYGAIN_ALBUM_MINMAX: "replaygain_album_minmax",
      REPLAYGAIN_UNDO: "replaygain_undo"
    };
    VorbisTagMapper = class _VorbisTagMapper extends CommonTagMapper {
      hasStandardDate = false;
      static toRating(email, rating, maxScore) {
        return {
          source: email ? email.toLowerCase() : void 0,
          rating: Number.parseFloat(rating) / maxScore * CommonTagMapper.maxRatingScore
        };
      }
      constructor() {
        super(["vorbis"], vorbisTagMap);
      }
      mapGenericTag(tag, warnings) {
        if (tag.id === "DATE") {
          if (typeof tag.value !== "string" || tag.value.trim().length === 0) {
            return null;
          }
          this.hasStandardDate = true;
        } else if (tag.id === "DISCOGS_RELEASED" && this.hasStandardDate) {
          return null;
        }
        return super.mapGenericTag(tag, warnings);
      }
      postMap(tag) {
        if (tag.id === "RATING") {
          tag.value = _VorbisTagMapper.toRating(void 0, tag.value, 100);
        } else if (tag.id.indexOf("RATING:") === 0) {
          const keys = tag.id.split(":", 2);
          tag.value = _VorbisTagMapper.toRating(keys[1], tag.value, 1);
          tag.id = keys[0];
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/riff/RiffInfoTagMap.js
var riffInfoTagMap, RiffInfoTagMapper;
var init_RiffInfoTagMap = __esm({
  "node_modules/music-metadata/lib/riff/RiffInfoTagMap.js"() {
    init_GenericTagMapper();
    riffInfoTagMap = {
      IART: "artist",
      // Artist
      ICRD: "date",
      // DateCreated
      INAM: "title",
      // Title
      TITL: "title",
      IPRD: "album",
      // Product
      ITRK: "track",
      IPRT: "track",
      // Additional tag for track index
      COMM: "comment",
      // Comments
      ICMT: "comment",
      // Country
      ICOP: "copyright",
      ICNT: "releasecountry",
      GNRE: "genre",
      // Genre
      IWRI: "writer",
      // WrittenBy
      RATE: "rating",
      YEAR: "year",
      ISFT: "encodedby",
      // Software
      CODE: "encodedby",
      // EncodedBy
      TURL: "website",
      // URL,
      IGNR: "genre",
      // Genre
      IENG: "engineer",
      // Engineer
      ITCH: "technician",
      // Technician
      IMED: "media",
      // Original Media
      IRPD: "album"
      // Product, where the file was intended for
    };
    RiffInfoTagMapper = class extends CommonTagMapper {
      constructor() {
        super(["exif"], riffInfoTagMap);
      }
    };
  }
});

// node_modules/music-metadata/lib/common/CombinedTagMapper.js
var CombinedTagMapper;
var init_CombinedTagMapper = __esm({
  "node_modules/music-metadata/lib/common/CombinedTagMapper.js"() {
    init_AiffTagMap();
    init_APEv2TagMapper();
    init_AsfTagMapper();
    init_CafTagMap();
    init_ID3v1TagMap();
    init_ID3v22TagMapper();
    init_ID3v24TagMapper();
    init_MatroskaTagMapper();
    init_MP4TagMapper();
    init_VorbisTagMapper();
    init_ParseError();
    init_RiffInfoTagMap();
    CombinedTagMapper = class {
      tagMappers = {};
      constructor() {
        [
          new ID3v1TagMapper(),
          new ID3v22TagMapper(),
          new ID3v24TagMapper(),
          new MP4TagMapper(),
          new VorbisTagMapper(),
          new APEv2TagMapper(),
          new AsfTagMapper(),
          new RiffInfoTagMapper(),
          new MatroskaTagMapper(),
          new AiffTagMapper(),
          new CafTagMapper()
        ].forEach((mapper) => {
          this.registerTagMapper(mapper);
        });
      }
      /**
       * Convert native to generic (common) tags
       * @param tagType Originating tag format
       * @param tag     Native tag to map to a generic tag id
       * @param warnings
       * @return Generic tag result (output of this function)
       */
      mapTag(tagType2, tag, warnings) {
        const tagMapper = this.tagMappers[tagType2];
        if (tagMapper) {
          return this.tagMappers[tagType2].mapGenericTag(tag, warnings);
        }
        throw new InternalParserError(`No generic tag mapper defined for tag-format: ${tagType2}`);
      }
      registerTagMapper(genericTagMapper) {
        for (const tagType2 of genericTagMapper.tagTypes) {
          this.tagMappers[tagType2] = genericTagMapper;
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/common/GenericTagTypes.js
function isSingleton(alias) {
  return commonTags[alias] && !commonTags[alias].multiple;
}
function isUnique(alias) {
  return !commonTags[alias].multiple || commonTags[alias].unique || false;
}
var defaultTagInfo, commonTags;
var init_GenericTagTypes = __esm({
  "node_modules/music-metadata/lib/common/GenericTagTypes.js"() {
    defaultTagInfo = {
      multiple: false
    };
    commonTags = {
      year: defaultTagInfo,
      track: defaultTagInfo,
      disk: defaultTagInfo,
      title: defaultTagInfo,
      artist: defaultTagInfo,
      artists: { multiple: true, unique: true },
      albumartist: defaultTagInfo,
      albumartists: { multiple: true, unique: true },
      album: defaultTagInfo,
      date: defaultTagInfo,
      originaldate: defaultTagInfo,
      originalyear: defaultTagInfo,
      releasedate: defaultTagInfo,
      comment: { multiple: true, unique: false },
      genre: { multiple: true, unique: true },
      picture: { multiple: true, unique: true },
      composer: { multiple: true, unique: true },
      lyrics: { multiple: true, unique: false },
      albumsort: { multiple: false, unique: true },
      titlesort: { multiple: false, unique: true },
      work: { multiple: false, unique: true },
      artistsort: { multiple: false, unique: true },
      albumartistsort: { multiple: false, unique: true },
      composersort: { multiple: false, unique: true },
      lyricist: { multiple: true, unique: true },
      writer: { multiple: true, unique: true },
      conductor: { multiple: true, unique: true },
      remixer: { multiple: true, unique: true },
      arranger: { multiple: true, unique: true },
      engineer: { multiple: true, unique: true },
      producer: { multiple: true, unique: true },
      technician: { multiple: true, unique: true },
      djmixer: { multiple: true, unique: true },
      mixer: { multiple: true, unique: true },
      label: { multiple: true, unique: true },
      grouping: defaultTagInfo,
      subtitle: { multiple: true },
      discsubtitle: defaultTagInfo,
      totaltracks: defaultTagInfo,
      totaldiscs: defaultTagInfo,
      compilation: defaultTagInfo,
      rating: { multiple: true },
      bpm: defaultTagInfo,
      mood: defaultTagInfo,
      media: defaultTagInfo,
      catalognumber: { multiple: true, unique: true },
      tvShow: defaultTagInfo,
      tvShowSort: defaultTagInfo,
      tvSeason: defaultTagInfo,
      tvEpisode: defaultTagInfo,
      tvEpisodeId: defaultTagInfo,
      tvNetwork: defaultTagInfo,
      podcast: defaultTagInfo,
      podcasturl: defaultTagInfo,
      releasestatus: defaultTagInfo,
      releasetype: { multiple: true },
      releasecountry: defaultTagInfo,
      script: defaultTagInfo,
      language: defaultTagInfo,
      copyright: defaultTagInfo,
      license: defaultTagInfo,
      encodedby: defaultTagInfo,
      encodersettings: defaultTagInfo,
      gapless: defaultTagInfo,
      barcode: defaultTagInfo,
      isrc: { multiple: true },
      asin: defaultTagInfo,
      musicbrainz_recordingid: defaultTagInfo,
      musicbrainz_trackid: defaultTagInfo,
      musicbrainz_albumid: defaultTagInfo,
      musicbrainz_artistid: { multiple: true },
      musicbrainz_albumartistid: { multiple: true },
      musicbrainz_releasegroupid: defaultTagInfo,
      musicbrainz_workid: defaultTagInfo,
      musicbrainz_trmid: defaultTagInfo,
      musicbrainz_discid: defaultTagInfo,
      acoustid_id: defaultTagInfo,
      acoustid_fingerprint: defaultTagInfo,
      musicip_puid: defaultTagInfo,
      musicip_fingerprint: defaultTagInfo,
      website: defaultTagInfo,
      "performer:instrument": { multiple: true, unique: true },
      averageLevel: defaultTagInfo,
      peakLevel: defaultTagInfo,
      notes: { multiple: true, unique: false },
      key: defaultTagInfo,
      originalalbum: defaultTagInfo,
      originalartist: defaultTagInfo,
      discogs_artist_id: { multiple: true, unique: true },
      discogs_release_id: defaultTagInfo,
      discogs_label_id: defaultTagInfo,
      discogs_master_release_id: defaultTagInfo,
      discogs_votes: defaultTagInfo,
      discogs_rating: defaultTagInfo,
      replaygain_track_peak: defaultTagInfo,
      replaygain_track_gain: defaultTagInfo,
      replaygain_album_peak: defaultTagInfo,
      replaygain_album_gain: defaultTagInfo,
      replaygain_track_minmax: defaultTagInfo,
      replaygain_album_minmax: defaultTagInfo,
      replaygain_undo: defaultTagInfo,
      description: { multiple: true },
      longDescription: defaultTagInfo,
      category: { multiple: true },
      hdVideo: defaultTagInfo,
      keywords: { multiple: true },
      movement: defaultTagInfo,
      movementIndex: defaultTagInfo,
      movementTotal: defaultTagInfo,
      podcastId: defaultTagInfo,
      showMovement: defaultTagInfo,
      stik: defaultTagInfo,
      playCounter: defaultTagInfo
    };
  }
});

// node_modules/music-metadata/lib/common/TrackInfo.js
function normalizeBitrate(bitrate) {
  return bitrate !== void 0 && Number.isFinite(bitrate) && bitrate > 0 ? bitrate : void 0;
}
function createAudioTrackInfo(format) {
  const audio = {};
  const track = { type: TrackType.audio, audio };
  if (format.codec !== void 0) {
    track.codecName = format.codec;
  }
  if (format.codecProfile !== void 0) {
    track.codecProfile = format.codecProfile;
  }
  if (format.duration !== void 0) {
    track.duration = format.duration;
  }
  const bitrate = normalizeBitrate(format.bitrate);
  if (bitrate !== void 0) {
    track.bitrate = bitrate;
  }
  if (format.lossless !== void 0) {
    track.lossless = format.lossless;
  }
  if (format.sampleRate !== void 0) {
    audio.samplingFrequency = format.sampleRate;
  }
  if (format.numberOfChannels !== void 0) {
    audio.channels = format.numberOfChannels;
  }
  if (format.bitsPerSample !== void 0) {
    audio.bitDepth = format.bitsPerSample;
  }
  if (format.numberOfSamples !== void 0) {
    audio.numberOfSamples = format.numberOfSamples;
  }
  return track;
}
function finalizeContainerInfo(metadata, fileSize) {
  const { format } = metadata;
  let duration = format.containerDuration;
  if (duration === void 0) {
    const durations = format.trackInfo.filter((track) => track.type === TrackType.audio || track.type === TrackType.video).map((track) => track.duration);
    if (durations.length > 0 && durations.every((duration2) => duration2 !== void 0 && duration2 > 0 && Number.isFinite(duration2))) {
      duration = durations.reduce((maximum, trackDuration) => Math.max(maximum, trackDuration), 0);
    } else if (!format.hasVideo) {
      duration = format.duration;
    }
  }
  if (duration !== void 0 && Number.isFinite(duration) && duration > 0) {
    metadata.setFormat("containerDuration", duration);
    if (format.duration === void 0) {
      metadata.setFormat("duration", duration);
    }
    if (fileSize !== void 0 && Number.isSafeInteger(fileSize) && fileSize > 0) {
      const bitrate = 8 * fileSize / duration;
      if (Number.isFinite(bitrate)) {
        metadata.setFormat("overallBitrate", bitrate);
      }
    }
  }
}
var init_TrackInfo = __esm({
  "node_modules/music-metadata/lib/common/TrackInfo.js"() {
    init_type();
  }
});

// node_modules/music-metadata/lib/common/MetadataCollector.js
function joinArtists(artists) {
  if (artists.length > 2) {
    return `${artists.slice(0, artists.length - 1).join(", ")} & ${artists[artists.length - 1]}`;
  }
  return artists.join(" & ");
}
var import_debug8, debug8, TagPriority, MetadataCollector;
var init_MetadataCollector = __esm({
  "node_modules/music-metadata/lib/common/MetadataCollector.js"() {
    import_debug8 = __toESM(require_src(), 1);
    init_source();
    init_LyricsParser();
    init_type();
    init_Allocation();
    init_CombinedTagMapper();
    init_GenericTagMapper();
    init_GenericTagTypes();
    init_TrackInfo();
    init_Util();
    debug8 = (0, import_debug8.default)("music-metadata:collector");
    TagPriority = [
      "matroska",
      "APEv2",
      "vorbis",
      "ID3v2.4",
      "ID3v2.3",
      "ID3v2.2",
      "exif",
      "asf",
      "iTunes",
      "AIFF",
      "CAF",
      "ID3v1"
    ];
    MetadataCollector = class {
      format = {
        tagTypes: [],
        trackInfo: []
      };
      native = {};
      common = {
        track: { no: null, of: null },
        disk: { no: null, of: null },
        movementIndex: { no: null, of: null }
      };
      quality = {
        warnings: []
      };
      /**
       * Keeps track of origin priority for each mapped id
       */
      commonOrigin = {};
      /**
       * Maps a tag type to a priority
       */
      originPriority = {};
      tagMapper = new CombinedTagMapper();
      opts;
      constructor(opts) {
        this.opts = opts;
        let priority = 1;
        for (const tagType2 of TagPriority) {
          this.originPriority[tagType2] = priority++;
        }
        this.originPriority.artificial = 500;
        this.originPriority.id3v1 = 600;
      }
      /**
       * @returns {boolean} true if one or more tags have been found
       */
      hasAny() {
        return Object.keys(this.native).length > 0;
      }
      addStreamInfo(streamInfo) {
        debug8(`streamInfo: type=${streamInfo.type ? TrackTypeValueToKeyMap[streamInfo.type] : "?"}, codec=${streamInfo.codecName}`);
        if (normalizeBitrate(streamInfo.bitrate) === void 0) {
          delete streamInfo.bitrate;
        }
        this.format.trackInfo.push(streamInfo);
      }
      setFormat(key, value) {
        if ((value === null || typeof value !== "object") && Object.is(this.format[key], value)) {
          return;
        }
        debug8(`format: ${key} = ${value}`);
        this.format[key] = value;
        if (this.opts?.observer) {
          this.opts.observer({ metadata: this, tag: { type: "format", id: key, value } });
        }
      }
      setAudioOnly() {
        this.setFormat("hasAudio", true);
        this.setFormat("hasVideo", false);
      }
      registerTagType(tagType2) {
        if (!this.format.tagTypes.includes(tagType2)) {
          this.format.tagTypes.push(tagType2);
        }
      }
      async addTag(tagType2, tagId, value) {
        debug8("tag %s.%s = %o", tagType2, tagId, value);
        if (!this.native[tagType2]) {
          this.registerTagType(tagType2);
          this.native[tagType2] = [];
        }
        this.native[tagType2].push({ id: tagId, value });
        await this.toCommon(tagType2, tagId, value);
      }
      addWarning(warning) {
        this.quality.warnings.push({ message: warning });
      }
      async postMap(tagType2, tag) {
        switch (tag.id) {
          case "artist":
            return this.handleSingularArtistTag(tagType2, tag, "artist", "artists");
          case "albumartist":
            return this.handleSingularArtistTag(tagType2, tag, "albumartist", "albumartists");
          case "artists":
            return this.handlePluralArtistTag(tagType2, tag, "artist", "artists");
          case "albumartists":
            return this.handlePluralArtistTag(tagType2, tag, "albumartist", "albumartists");
          case "picture":
            return this.postFixPicture(tag.value).then((picture) => {
              if (picture !== null) {
                tag.value = picture;
                this.setGenericTag(tagType2, tag);
              }
            });
          case "totaltracks":
            this.common.track.of = CommonTagMapper.toIntOrNull(tag.value);
            this.notifyCommonTag({ id: "track", value: { ...this.common.track } });
            return;
          case "totaldiscs":
            this.common.disk.of = CommonTagMapper.toIntOrNull(tag.value);
            this.notifyCommonTag({ id: "disk", value: { ...this.common.disk } });
            return;
          case "movementTotal":
            this.common.movementIndex.of = CommonTagMapper.toIntOrNull(tag.value);
            this.notifyCommonTag({ id: "movementIndex", value: { ...this.common.movementIndex } });
            return;
          case "track":
          case "disk":
          case "movementIndex": {
            const of = this.common[tag.id].of;
            this.common[tag.id] = CommonTagMapper.normalizeTrack(tag.value);
            this.common[tag.id].of = of != null ? of : this.common[tag.id].of;
            this.notifyCommonTag({ id: tag.id, value: { ...this.common[tag.id] } });
            return;
          }
          case "bpm":
          case "year":
          case "originalyear":
            tag.value = Number.parseInt(tag.value, 10);
            break;
          case "date": {
            const year = Number.parseInt(tag.value.substr(0, 4), 10);
            if (!Number.isNaN(year)) {
              this.common.year = year;
            }
            break;
          }
          case "discogs_label_id":
          case "discogs_release_id":
          case "discogs_master_release_id":
          case "discogs_artist_id":
          case "discogs_votes":
            tag.value = typeof tag.value === "string" ? Number.parseInt(tag.value, 10) : tag.value;
            break;
          case "replaygain_track_gain":
          case "replaygain_track_peak":
          case "replaygain_album_gain":
          case "replaygain_album_peak":
            tag.value = toRatio(tag.value);
            break;
          case "replaygain_track_minmax":
            tag.value = tag.value.split(",", 2).map((v) => Number.parseInt(v, 10));
            break;
          case "replaygain_undo": {
            const minMix = tag.value.split(",", 2).map((v) => Number.parseInt(v, 10));
            tag.value = {
              leftChannel: minMix[0],
              rightChannel: minMix[1]
            };
            break;
          }
          case "gapless":
          // iTunes gap-less flag
          case "compilation":
          case "podcast":
          case "showMovement":
            tag.value = tag.value === "1" || tag.value === 1;
            break;
          case "isrc": {
            const commonTag = this.common[tag.id];
            if (commonTag && commonTag.indexOf(tag.value) !== -1) {
              return;
            }
            break;
          }
          case "comment":
            if (typeof tag.value === "string") {
              tag.value = { text: tag.value };
            }
            if (tag.value.descriptor === "iTunPGAP") {
              this.setGenericTag(tagType2, { id: "gapless", value: tag.value.text === "1" });
            }
            break;
          case "lyrics":
            if (typeof tag.value === "string") {
              tag.value = parseLyrics(tag.value, getMaxMetadataEntries(this.opts ?? {}));
            }
            break;
          default:
        }
        if (tag.value !== null) {
          this.setGenericTag(tagType2, tag);
        }
      }
      /**
       * Convert native tags to common tags
       * @returns {IAudioMetadata} Native + common tags
       */
      toCommonMetadata() {
        return {
          format: this.format,
          native: this.native,
          quality: this.quality,
          common: this.common
        };
      }
      /**
       * Handle singular artist tags (artist, albumartist) and cross-populate to plural form
       */
      handleSingularArtistTag(tagType2, tag, singularId, pluralId) {
        if (this.commonOrigin[singularId] === this.originPriority[tagType2]) {
          return this.postMap("artificial", { id: pluralId, value: tag.value });
        }
        if (!this.common[pluralId]) {
          this.setGenericTag("artificial", { id: pluralId, value: tag.value });
        }
        this.setGenericTag(tagType2, tag);
      }
      /**
       * Handle plural artist tags (artists, albumartists) and cross-populate to singular form
       */
      handlePluralArtistTag(tagType2, tag, singularId, pluralId) {
        if (!this.common[singularId] || this.commonOrigin[singularId] === this.originPriority.artificial) {
          if (!this.common[pluralId] || this.common[pluralId].indexOf(tag.value) === -1) {
            const values = (this.common[pluralId] || []).concat([tag.value]);
            const value = joinArtists(values);
            this.setGenericTag("artificial", { id: singularId, value });
          }
        }
        this.setGenericTag(tagType2, tag);
      }
      /**
       * Fix some common issues with picture object
       * @param picture Picture
       */
      async postFixPicture(picture) {
        if (picture.data && picture.data.length > 0) {
          if (!picture.format) {
            const fileType = await fileTypeFromBuffer(Uint8Array.from(picture.data), {
              maxBufferSize: getMaxMemoryAllocation(this.opts ?? {})
            });
            if (fileType) {
              picture.format = fileType.mime;
            } else {
              return null;
            }
          }
          picture.format = picture.format.toLocaleLowerCase();
          switch (picture.format) {
            case "image/jpg":
              picture.format = "image/jpeg";
          }
          return picture;
        }
        this.addWarning("Empty picture tag found");
        return null;
      }
      /**
       * Convert native tag to common tags
       */
      async toCommon(tagType2, tagId, value) {
        if ((tagType2 === "ID3v2.2" && tagId === "IPL" || tagType2 === "ID3v2.3" && tagId === "IPLS" || tagType2 === "ID3v2.4" && tagId === "TIPL") && value !== null && typeof value === "object") {
          for (const [role, people] of Object.entries(value)) {
            if (Array.isArray(people)) {
              for (const person of people) {
                if (typeof person === "string" && person.length > 0) {
                  await this.toCommon(tagType2, `${tagId}:${role}`, person);
                }
              }
            }
          }
          return;
        }
        const tag = { id: tagId, value };
        const genericTag = this.tagMapper.mapTag(tagType2, tag, this);
        if (genericTag) {
          if (Array.isArray(genericTag.value)) {
            for (const value2 of genericTag.value) {
              await this.postMap(tagType2, { id: genericTag.id, value: value2 });
            }
          } else {
            await this.postMap(tagType2, genericTag);
          }
        }
      }
      /**
       * Set generic tag
       */
      setGenericTag(tagType2, tag) {
        debug8(`common.${tag.id} = ${tag.value}`);
        const prio0 = this.commonOrigin[tag.id] || 1e3;
        const prio1 = this.originPriority[tagType2];
        if (isSingleton(tag.id)) {
          if (prio1 <= prio0) {
            this.common[tag.id] = tag.value;
            this.commonOrigin[tag.id] = prio1;
          } else {
            return debug8(`Ignore native tag (singleton): ${tagType2}.${tag.id} = ${tag.value}`);
          }
        } else {
          if (prio1 === prio0) {
            if (!isUnique(tag.id) || this.common[tag.id].indexOf(tag.value) === -1) {
              this.common[tag.id].push(tag.value);
            } else {
              return debug8(`Ignore duplicate value: ${tagType2}.${tag.id} = ${tag.value}`);
            }
          } else if (prio1 < prio0) {
            this.common[tag.id] = [tag.value];
            this.commonOrigin[tag.id] = prio1;
          } else {
            return debug8(`Ignore native tag (list): ${tagType2}.${tag.id} = ${tag.value}`);
          }
        }
        this.notifyCommonTag(tag);
      }
      notifyCommonTag(tag) {
        if (this.opts?.observer) {
          this.opts.observer({ metadata: this, tag: { type: "common", id: tag.id, value: tag.value } });
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/dsdiff/DsdiffToken.js
var ChunkHeader64;
var init_DsdiffToken = __esm({
  "node_modules/music-metadata/lib/dsdiff/DsdiffToken.js"() {
    init_lib3();
    init_FourCC();
    ChunkHeader64 = {
      len: 12,
      get: (buf, off) => {
        return {
          // Group-ID
          chunkID: FourCcToken.get(buf, off),
          // Size
          chunkSize: INT64_BE.get(buf, off + 4)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/dsdiff/DsdiffParser.js
var DsdiffParser_exports = {};
__export(DsdiffParser_exports, {
  DsdiffContentParseError: () => DsdiffContentParseError,
  DsdiffParser: () => DsdiffParser
});
var import_debug9, debug9, DsdiffContentParseError, DsdiffParser;
var init_DsdiffParser = __esm({
  "node_modules/music-metadata/lib/dsdiff/DsdiffParser.js"() {
    import_debug9 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_Allocation();
    init_BasicParser();
    init_FourCC();
    init_EmbeddedID3v2();
    init_ParseError();
    init_DsdiffToken();
    debug9 = (0, import_debug9.default)("music-metadata:parser:dsdiff");
    DsdiffContentParseError = class extends makeUnexpectedFileContentError("DSDIFF") {
    };
    DsdiffParser = class extends BasicParser {
      input = this.tokenizer;
      readToken(token) {
        return readToken(this.input, token, this.options);
      }
      async parse() {
        const header = await this.readToken(ChunkHeader64);
        if (header.chunkID !== "FRM8") {
          throw new DsdiffContentParseError("Unexpected chunk-ID");
        }
        this.validateChunkSize(header);
        this.requireChunkSize(header, FourCcToken.len);
        this.metadata.setAudioOnly();
        const type = (await this.readToken(FourCcToken)).trim();
        switch (type) {
          case "DSD":
            this.metadata.setFormat("container", `DSDIFF/${type}`);
            this.metadata.setFormat("lossless", true);
            await this.readChunks(header.chunkSize - BigInt(FourCcToken.len), (child) => this.readData(child));
            return;
          default:
            throw new DsdiffContentParseError(`Unsupported DSDIFF type: ${type}`);
        }
      }
      validateChunkSize(header, remainingSize) {
        const size = header.chunkSize;
        if (size < 0n || size > BigInt(Number.MAX_SAFE_INTEGER)) {
          throw new DsdiffContentParseError(`Invalid chunk size: ${size}`);
        }
        const paddedSize = size + (size & 1n);
        if (remainingSize !== void 0 && paddedSize > remainingSize) {
          throw new DsdiffContentParseError(`Chunk ${header.chunkID} size ${size} exceeds its enclosing chunk`);
        }
        const fileSize = this.input.fileInfo.size;
        if (fileSize !== void 0 && paddedSize > BigInt(fileSize - this.input.position)) {
          throw new DsdiffContentParseError(`Chunk ${header.chunkID} size ${size} exceeds remaining file size`);
        }
      }
      requireChunkSize(header, minimum) {
        if (header.chunkSize < BigInt(minimum)) {
          throw new DsdiffContentParseError(`Chunk ${header.chunkID} is too small: ${header.chunkSize}`);
        }
      }
      async ignoreBytes(length) {
        if (await this.input.ignore(Number(length)) !== Number(length)) {
          throw new DsdiffContentParseError("Unexpected end of chunk");
        }
      }
      async readChunks(remainingSize, handle) {
        while (remainingSize >= ChunkHeader64.len) {
          const header = await this.readToken(ChunkHeader64);
          this.validateChunkSize(header, remainingSize - BigInt(ChunkHeader64.len));
          const source = this.input;
          const payload = createTokenizerView(source, Number(header.chunkSize));
          this.input = payload;
          try {
            await handle(header);
            await this.ignoreBytes(BigInt(payload.remaining));
          } finally {
            this.input = source;
            await payload.close();
          }
          const padding = header.chunkSize & 1n;
          await this.ignoreBytes(padding);
          remainingSize -= BigInt(ChunkHeader64.len) + header.chunkSize + padding;
        }
        return remainingSize;
      }
      async readData(header) {
        debug9(`Reading data of chunk[ID=${header.chunkID}, size=${header.chunkSize}]`);
        switch (header.chunkID.trim()) {
          case "FVER": {
            this.requireChunkSize(header, UINT32_LE.len);
            const version = await this.readToken(UINT32_LE);
            debug9(`DSDIFF version=${version}`);
            break;
          }
          case "PROP": {
            this.requireChunkSize(header, FourCcToken.len);
            const propType = await this.readToken(FourCcToken);
            if (propType !== "SND ") {
              throw new DsdiffContentParseError("Unexpected PROP-chunk ID");
            }
            await this.handleSoundPropertyChunks(header.chunkSize - BigInt(FourCcToken.len));
            break;
          }
          case "ID3": {
            await parseEmbeddedID3v2(this.metadata, this.input, this.options, Number(header.chunkSize));
            break;
          }
          case "DSD":
            if (this.metadata.format.numberOfChannels) {
              this.metadata.setFormat("numberOfSamples", Number(header.chunkSize * BigInt(8) / BigInt(this.metadata.format.numberOfChannels)));
            }
            if (this.metadata.format.numberOfSamples && this.metadata.format.sampleRate) {
              this.metadata.setFormat("duration", this.metadata.format.numberOfSamples / this.metadata.format.sampleRate);
            }
            break;
          default:
            debug9(`Ignore chunk[ID=${header.chunkID}, size=${header.chunkSize}]`);
            break;
        }
      }
      async handleSoundPropertyChunks(remainingSize) {
        remainingSize = await this.readChunks(remainingSize, async (sndPropHeader) => {
          switch (sndPropHeader.chunkID.trim()) {
            case "FS": {
              this.requireChunkSize(sndPropHeader, UINT32_BE.len);
              const sampleRate = await this.readToken(UINT32_BE);
              this.metadata.setFormat("sampleRate", sampleRate);
              break;
            }
            case "CHNL": {
              this.requireChunkSize(sndPropHeader, UINT16_BE.len);
              const numChannels = await this.readToken(UINT16_BE);
              this.metadata.setFormat("numberOfChannels", numChannels);
              await this.handleChannelChunks(sndPropHeader.chunkSize - BigInt(UINT16_BE.len));
              break;
            }
            case "CMPR": {
              this.requireChunkSize(sndPropHeader, FourCcToken.len + UINT8.len);
              const compressionIdCode = (await this.readToken(FourCcToken)).trim();
              const count = await this.readToken(UINT8);
              this.requireChunkSize(sndPropHeader, FourCcToken.len + UINT8.len + count);
              const compressionName = await this.readToken(new StringType(count, "ascii"));
              if (compressionIdCode === "DSD") {
                this.metadata.setFormat("lossless", true);
                this.metadata.setFormat("bitsPerSample", 1);
              }
              this.metadata.setFormat("codec", `${compressionIdCode} (${compressionName})`);
              break;
            }
            case "ABSS": {
              this.requireChunkSize(sndPropHeader, 8);
              const hours = await this.readToken(UINT16_BE);
              const minutes = await this.readToken(UINT8);
              const seconds = await this.readToken(UINT8);
              const samples = await this.readToken(UINT32_BE);
              debug9(`ABSS ${hours}:${minutes}:${seconds}.${samples}`);
              break;
            }
            case "LSCO": {
              this.requireChunkSize(sndPropHeader, UINT16_BE.len);
              const lsConfig = await this.readToken(UINT16_BE);
              debug9(`LSCO lsConfig=${lsConfig}`);
              break;
            }
            default:
              debug9(`Unknown sound-property-chunk[ID=${sndPropHeader.chunkID}, size=${sndPropHeader.chunkSize}]`);
          }
        });
        if (remainingSize !== 0n) {
          throw new DsdiffContentParseError("Incomplete sound-property chunk header");
        }
        if (this.metadata.format.lossless && this.metadata.format.sampleRate && this.metadata.format.numberOfChannels && this.metadata.format.bitsPerSample) {
          const bitrate = this.metadata.format.sampleRate * this.metadata.format.numberOfChannels * this.metadata.format.bitsPerSample;
          this.metadata.setFormat("bitrate", bitrate);
        }
      }
      async handleChannelChunks(remainingSize) {
        debug9(`Parsing channel-chunks, remainingSize=${remainingSize}`);
        while (remainingSize >= FourCcToken.len) {
          const channelId = await this.readToken(FourCcToken);
          debug9(`Channel[ID=${channelId}]`);
          remainingSize -= BigInt(FourCcToken.len);
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/dsdiff/DsdiffLoader.js
var dsdiffParserLoader;
var init_DsdiffLoader = __esm({
  "node_modules/music-metadata/lib/dsdiff/DsdiffLoader.js"() {
    dsdiffParserLoader = {
      parserType: "dsdiff",
      extensions: [".dff"],
      mimeTypes: ["audio/dsf", "audio/dsd", "audio/dff"],
      async load() {
        return (await Promise.resolve().then(() => (init_DsdiffParser(), DsdiffParser_exports))).DsdiffParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/id3v2/AbstractID3Parser.js
var import_debug10, debug10, AbstractID3Parser;
var init_AbstractID3Parser = __esm({
  "node_modules/music-metadata/lib/id3v2/AbstractID3Parser.js"() {
    import_debug10 = __toESM(require_src(), 1);
    init_lib();
    init_BasicParser();
    init_ID3v1Parser();
    init_ID3v2Parser();
    init_ID3v2Token();
    debug10 = (0, import_debug10.default)("music-metadata:parser:ID3");
    AbstractID3Parser = class extends BasicParser {
      static async startsWithID3v2Header(tokenizer) {
        return (await tokenizer.peekToken(ID3v2Header)).fileIdentifier === "ID3";
      }
      id3parser = new ID3v2Parser();
      async parse() {
        try {
          await this.parseID3v2();
        } catch (err) {
          if (err instanceof EndOfStreamError) {
            debug10("End-of-stream");
          } else {
            throw err;
          }
        }
      }
      finalize() {
        return;
      }
      async parseID3v2() {
        await this.tryReadId3v2Headers();
        debug10("End of ID3v2 header, go to MPEG-parser: pos=%s", this.tokenizer.position);
        await this.postId3v2Parse();
        if (this.options.skipPostHeaders && this.metadata.hasAny()) {
          this.finalize();
        } else {
          const id3v1parser = new ID3v1Parser(this.metadata, this.tokenizer, this.options);
          await id3v1parser.parse();
          this.finalize();
        }
      }
      async tryReadId3v2Headers() {
        const id3Header = await this.tokenizer.peekToken(ID3v2Header);
        if (id3Header.fileIdentifier === "ID3") {
          debug10("Found ID3v2 header, pos=%s", this.tokenizer.position);
          await this.id3parser.parse(this.metadata, this.tokenizer, this.options);
          return this.tryReadId3v2Headers();
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/dsf/DsfChunk.js
var ChunkHeader2, DsdChunk, FormatChunk;
var init_DsfChunk = __esm({
  "node_modules/music-metadata/lib/dsf/DsfChunk.js"() {
    init_lib3();
    init_FourCC();
    ChunkHeader2 = {
      len: 12,
      get: (buf, off) => {
        return { id: FourCcToken.get(buf, off), size: UINT64_LE.get(buf, off + 4) };
      }
    };
    DsdChunk = {
      len: 16,
      get: (buf, off) => {
        return {
          fileSize: UINT64_LE.get(buf, off),
          metadataPointer: UINT64_LE.get(buf, off + 8)
        };
      }
    };
    FormatChunk = {
      len: 40,
      get: (buf, off) => {
        return {
          formatVersion: INT32_LE.get(buf, off),
          formatID: INT32_LE.get(buf, off + 4),
          channelType: INT32_LE.get(buf, off + 8),
          channelNum: INT32_LE.get(buf, off + 12),
          samplingFrequency: INT32_LE.get(buf, off + 16),
          bitsPerSample: INT32_LE.get(buf, off + 20),
          sampleCount: INT64_LE.get(buf, off + 24),
          blockSizePerChannel: INT32_LE.get(buf, off + 32)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/dsf/DsfParser.js
var DsfParser_exports = {};
__export(DsfParser_exports, {
  DsdContentParseError: () => DsdContentParseError,
  DsfParser: () => DsfParser
});
var import_debug11, debug11, DsdContentParseError, DsfParser;
var init_DsfParser = __esm({
  "node_modules/music-metadata/lib/dsf/DsfParser.js"() {
    import_debug11 = __toESM(require_src(), 1);
    init_AbstractID3Parser();
    init_ID3v2Parser();
    init_ID3v2Token();
    init_ParseError();
    init_DsfChunk();
    debug11 = (0, import_debug11.default)("music-metadata:parser:DSF");
    DsdContentParseError = class extends makeUnexpectedFileContentError("DSD") {
    };
    DsfParser = class extends AbstractID3Parser {
      async postId3v2Parse() {
        const p0 = this.tokenizer.position;
        const chunkHeader = await this.tokenizer.readToken(ChunkHeader2);
        if (chunkHeader.id !== "DSD ") {
          throw new DsdContentParseError("Invalid chunk signature");
        }
        if (chunkHeader.size !== BigInt(ChunkHeader2.len + DsdChunk.len)) {
          throw new DsdContentParseError(`Invalid DSD chunk size: ${chunkHeader.size}`);
        }
        this.metadata.setFormat("container", "DSF");
        this.metadata.setFormat("lossless", true);
        this.metadata.setAudioOnly();
        const dsdChunk = await this.tokenizer.readToken(DsdChunk);
        if (dsdChunk.fileSize < chunkHeader.size) {
          throw new DsdContentParseError(`Invalid DSF file size: ${dsdChunk.fileSize}`);
        }
        await this.parseChunks(dsdChunk.fileSize - chunkHeader.size);
        if (dsdChunk.metadataPointer === 0n) {
          debug11("No ID3v2 tag present");
          return;
        }
        debug11(`expect ID3v2 at offset=${dsdChunk.metadataPointer}`);
        const metadataOffset = dsdChunk.metadataPointer - BigInt(this.tokenizer.position - p0);
        if (metadataOffset < 0n || metadataOffset > BigInt(Number.MAX_SAFE_INTEGER) || dsdChunk.metadataPointer + BigInt(ID3v2Header.len) > dsdChunk.fileSize) {
          throw new DsdContentParseError(`Invalid metadata pointer: ${dsdChunk.metadataPointer}`);
        }
        await this.tokenizer.ignore(Number(metadataOffset));
        return new ID3v2Parser().parse(this.metadata, this.tokenizer, this.options);
      }
      async parseChunks(bytesRemaining) {
        const chunkHeaderSize = BigInt(ChunkHeader2.len);
        while (bytesRemaining >= chunkHeaderSize) {
          const chunkHeader = await this.tokenizer.readToken(ChunkHeader2);
          debug11(`Parsing chunk name=${chunkHeader.id} size=${chunkHeader.size}`);
          if (chunkHeader.size < chunkHeaderSize) {
            throw new DsdContentParseError(`Invalid ${chunkHeader.id} chunk size: ${chunkHeader.size}`);
          }
          if (chunkHeader.size > bytesRemaining) {
            throw new DsdContentParseError(`${chunkHeader.id} chunk exceeds remaining file size`);
          }
          const payloadSize = chunkHeader.size - chunkHeaderSize;
          switch (chunkHeader.id) {
            case "fmt ": {
              if (payloadSize < BigInt(FormatChunk.len)) {
                throw new DsdContentParseError(`Invalid fmt chunk size: ${chunkHeader.size}`);
              }
              const formatChunk = await this.tokenizer.readToken(FormatChunk);
              this.metadata.setFormat("numberOfChannels", formatChunk.channelNum);
              this.metadata.setFormat("sampleRate", formatChunk.samplingFrequency);
              this.metadata.setFormat("bitsPerSample", formatChunk.bitsPerSample);
              this.metadata.setFormat("numberOfSamples", Number(formatChunk.sampleCount));
              this.metadata.setFormat("duration", Number(formatChunk.sampleCount) / formatChunk.samplingFrequency);
              const bitrate = formatChunk.bitsPerSample * formatChunk.samplingFrequency * formatChunk.channelNum;
              this.metadata.setFormat("bitrate", bitrate);
              return;
            }
            default:
              await this.tokenizer.ignore(Number(payloadSize));
              break;
          }
          bytesRemaining -= chunkHeader.size;
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/dsf/DsfLoader.js
var dsfParserLoader;
var init_DsfLoader = __esm({
  "node_modules/music-metadata/lib/dsf/DsfLoader.js"() {
    dsfParserLoader = {
      parserType: "dsf",
      extensions: [".dsf"],
      mimeTypes: ["audio/dsf"],
      async load() {
        return (await Promise.resolve().then(() => (init_DsfParser(), DsfParser_exports))).DsfParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/vorbis/Vorbis.js
var VorbisPictureToken, CommonHeader, IdentificationHeader;
var init_Vorbis = __esm({
  "node_modules/music-metadata/lib/ogg/vorbis/Vorbis.js"() {
    init_lib3();
    init_ID3v2Token();
    VorbisPictureToken = class _VorbisPictureToken {
      static fromBase64(base64str) {
        return _VorbisPictureToken.fromBuffer(Uint8Array.from(atob(base64str), (c) => c.charCodeAt(0)));
      }
      static fromBuffer(buffer) {
        const pic = new _VorbisPictureToken(buffer.length);
        return pic.get(buffer, 0);
      }
      len;
      constructor(len) {
        this.len = len;
      }
      get(buffer, offset) {
        const type = AttachedPictureType[UINT32_BE.get(buffer, offset)];
        offset += 4;
        const mimeLen = UINT32_BE.get(buffer, offset);
        offset += 4;
        const format = new StringType(mimeLen, "utf-8").get(buffer, offset);
        offset += mimeLen;
        const descLen = UINT32_BE.get(buffer, offset);
        offset += 4;
        const description = new StringType(descLen, "utf-8").get(buffer, offset);
        offset += descLen;
        const width = UINT32_BE.get(buffer, offset);
        offset += 4;
        const height = UINT32_BE.get(buffer, offset);
        offset += 4;
        const colour_depth = UINT32_BE.get(buffer, offset);
        offset += 4;
        const indexed_color = UINT32_BE.get(buffer, offset);
        offset += 4;
        const picDataLen = UINT32_BE.get(buffer, offset);
        offset += 4;
        const data = buffer.slice(offset, offset + picDataLen);
        return {
          type,
          format,
          description,
          width,
          height,
          colour_depth,
          indexed_color,
          data
        };
      }
    };
    CommonHeader = {
      len: 7,
      get: (buf, off) => {
        return {
          packetType: UINT8.get(buf, off),
          vorbis: new StringType(6, "ascii").get(buf, off + 1)
        };
      }
    };
    IdentificationHeader = {
      len: 23,
      get: (uint8Array, off) => {
        return {
          version: UINT32_LE.get(uint8Array, off + 0),
          channelMode: UINT8.get(uint8Array, off + 4),
          sampleRate: UINT32_LE.get(uint8Array, off + 5),
          bitrateMax: INT32_LE.get(uint8Array, off + 9),
          bitrateNominal: INT32_LE.get(uint8Array, off + 13),
          bitrateMin: INT32_LE.get(uint8Array, off + 17)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/vorbis/VorbisDecoder.js
var VorbisCommentError, VorbisDecoder;
var init_VorbisDecoder = __esm({
  "node_modules/music-metadata/lib/ogg/vorbis/VorbisDecoder.js"() {
    init_lib2();
    init_lib3();
    init_Allocation();
    init_ParseError();
    VorbisCommentError = class extends makeUnexpectedFileContentError("Vorbis") {
    };
    VorbisDecoder = class {
      data;
      offset;
      constructor(data, offset) {
        this.data = data;
        this.offset = offset;
      }
      get remaining() {
        return this.data.length - this.offset;
      }
      readInt32() {
        if (this.remaining < 4) {
          throw new VorbisCommentError("Truncated Vorbis comment length");
        }
        const value = UINT32_LE.get(this.data, this.offset);
        this.offset += 4;
        return value;
      }
      readStringUtf8() {
        const len = this.readInt32();
        if (len > this.remaining) {
          throw new VorbisCommentError(`Vorbis comment length ${len} exceeds remaining data ${this.remaining}`);
        }
        const value = textDecode(this.data.subarray(this.offset, this.offset + len), "utf-8");
        this.offset += len;
        return value;
      }
      /** Decode the shared structure, leaving packet framing and metadata policy to callers. */
      parseCommentList(createCountError = (message) => new VorbisCommentError(message), maxComments = defaultMaxMetadataEntries) {
        const vendor = this.readStringUtf8();
        const count = this.readInt32();
        if (count > Math.floor(this.remaining / 4)) {
          throw createCountError(`Vorbis comment count ${count} exceeds remaining data`);
        }
        if (count > maxComments) {
          throw createCountError(`Vorbis comment count ${count} exceeds entry limit ${maxComments}`);
        }
        return { vendor, comments: this.parseUserComments(count) };
      }
      *parseUserComments(count) {
        for (let i = 0; i < count; ++i) {
          yield this.parseUserComment();
        }
      }
      parseUserComment() {
        const offset0 = this.offset;
        const v = this.readStringUtf8();
        const idx = v.indexOf("=");
        return {
          key: v.substring(0, idx).toUpperCase(),
          value: v.substring(idx + 1),
          len: this.offset - offset0
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/vorbis/VorbisStream.js
var import_debug12, debug12, VorbisContentError, VorbisStream;
var init_VorbisStream = __esm({
  "node_modules/music-metadata/lib/ogg/vorbis/VorbisStream.js"() {
    import_debug12 = __toESM(require_src(), 1);
    init_Allocation();
    init_ParseError();
    init_Vorbis();
    init_VorbisDecoder();
    debug12 = (0, import_debug12.default)("music-metadata:parser:ogg:vorbis1");
    VorbisContentError = class extends makeUnexpectedFileContentError("Vorbis") {
    };
    VorbisStream = class {
      pageSegments = [];
      bufferedPageLength = 0;
      metadata;
      options;
      lastPageHeader;
      maxBufferedSegments;
      durationOnLastPage = true;
      isMetadataComplete = false;
      constructor(metadata, options) {
        this.metadata = metadata;
        this.options = options;
        this.maxBufferedSegments = getMaxMetadataEntries(options);
      }
      /**
       * Vorbis 1 parser
       * @param header Ogg Page Header
       * @param pageData Page data
       */
      async parsePage(header, pageData) {
        this.lastPageHeader = header;
        if (header.headerType.firstPage) {
          this.parseFirstPage(header, pageData);
        } else {
          if (header.headerType.continued) {
            if (this.pageSegments.length === 0) {
              throw new VorbisContentError("Cannot continue on previous page");
            }
            validateAllocation(this.bufferedPageLength + pageData.length, this.options);
            if (this.pageSegments.length >= this.maxBufferedSegments) {
              throw new VorbisContentError("Buffered Ogg page count exceeds entry limit");
            }
            this.pageSegments.push(pageData);
            this.bufferedPageLength += pageData.length;
          }
          if (header.headerType.lastPage || !header.headerType.continued) {
            if (this.pageSegments.length > 0) {
              const fullPage = this.mergeUint8Arrays(this.pageSegments);
              await this.parseFullPage(fullPage);
            }
            this.bufferedPageLength = header.headerType.lastPage ? 0 : pageData.length;
            validateAllocation(this.bufferedPageLength, this.options);
            this.pageSegments = header.headerType.lastPage ? [] : [pageData];
          }
        }
      }
      mergeUint8Arrays(arrays) {
        const totalSize = arrays.reduce((acc, e) => acc + e.length, 0);
        validateAllocation(totalSize, this.options);
        const merged = new Uint8Array(totalSize);
        let offset = 0;
        for (const array of arrays) {
          merged.set(array, offset);
          offset += array.length;
        }
        return merged;
      }
      async flush() {
        if (this.pageSegments.length === 0) {
          return;
        }
        await this.parseFullPage(this.mergeUint8Arrays(this.pageSegments));
      }
      async parseUserComment(pageData, offset) {
        const decoder = new VorbisDecoder(pageData, offset);
        const tag = decoder.parseUserComment();
        await this.addTag(tag.key, tag.value);
        return tag.len;
      }
      async addTag(id, value) {
        if (id === "METADATA_BLOCK_PICTURE" && typeof value === "string") {
          if (this.options.skipCovers) {
            debug12("Ignore picture");
            return;
          }
          value = VorbisPictureToken.fromBase64(value);
          debug12(`Push picture: id=${id}, format=${value.format}`);
        } else {
          debug12(`Push tag: id=${id}, value=${value}`);
        }
        await this.metadata.addTag("vorbis", id, value);
      }
      calculateDuration(enfOfStream) {
        if (this.lastPageHeader && (enfOfStream || this.lastPageHeader.headerType.lastPage) && this.metadata.format.sampleRate && this.lastPageHeader.absoluteGranulePosition >= 0) {
          this.metadata.setFormat("numberOfSamples", this.lastPageHeader.absoluteGranulePosition);
          this.metadata.setFormat("duration", this.lastPageHeader.absoluteGranulePosition / this.metadata.format.sampleRate);
        }
      }
      /**
       * Parse first Ogg/Vorbis page
       * @param _header
       * @param pageData
       */
      parseFirstPage(_header, pageData) {
        this.metadata.setFormat("codec", "Vorbis I");
        this.metadata.setFormat("lossless", false);
        this.metadata.setFormat("hasAudio", true);
        debug12("Parse first page");
        if (pageData.length < CommonHeader.len) {
          throw new VorbisContentError("Truncated Vorbis packet header");
        }
        const commonHeader = CommonHeader.get(pageData, 0);
        if (commonHeader.vorbis !== "vorbis") {
          throw new VorbisContentError("Metadata does not look like Vorbis");
        }
        if (commonHeader.packetType === 1) {
          if (pageData.length < CommonHeader.len + IdentificationHeader.len) {
            throw new VorbisContentError("Truncated Vorbis identification header");
          }
          const idHeader = IdentificationHeader.get(pageData, CommonHeader.len);
          this.metadata.setFormat("sampleRate", idHeader.sampleRate);
          this.metadata.setFormat("bitrate", idHeader.bitrateNominal);
          this.metadata.setFormat("numberOfChannels", idHeader.channelMode);
          debug12("sample-rate=%s[hz], bitrate=%s[b/s], channel-mode=%s", idHeader.sampleRate, idHeader.bitrateNominal, idHeader.channelMode);
        } else {
          throw new VorbisContentError("First Ogg page should be type 1: the identification header");
        }
      }
      async parseFullPage(pageData) {
        if (pageData.length > 0 && (pageData[0] & 1) === 0) {
          return;
        }
        if (pageData.length < CommonHeader.len) {
          throw new VorbisContentError("Truncated Vorbis packet header");
        }
        const commonHeader = CommonHeader.get(pageData, 0);
        debug12("Parse full page: type=%s, byteLength=%s", commonHeader.packetType, pageData.byteLength);
        switch (commonHeader.packetType) {
          case 3:
            return this.parseUserCommentList(pageData, CommonHeader.len);
          case 1:
          // type 1: the identification header
          case 5:
            break;
        }
      }
      /**
       * Ref: https://xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-840005.2
       */
      async parseUserCommentList(pageData, offset) {
        const { comments } = new VorbisDecoder(pageData, offset).parseCommentList((message) => new VorbisContentError(message), getMaxMetadataEntries(this.options));
        for (const tag of comments) {
          await this.addTag(tag.key, tag.value);
        }
        this.isMetadataComplete = true;
      }
    };
  }
});

// node_modules/music-metadata/lib/flac/FlacToken.js
var BlockType, BlockHeader, BlockStreamInfo;
var init_FlacToken = __esm({
  "node_modules/music-metadata/lib/flac/FlacToken.js"() {
    init_lib3();
    init_Util();
    BlockType = {
      STREAMINFO: 0,
      // STREAMINFO
      PADDING: 1,
      // PADDING
      APPLICATION: 2,
      // APPLICATION
      SEEKTABLE: 3,
      // SEEKTABLE
      VORBIS_COMMENT: 4,
      // VORBIS_COMMENT
      CUESHEET: 5,
      // CUESHEET
      PICTURE: 6
      // PICTURE
    };
    BlockHeader = {
      len: 4,
      get: (buf, off) => {
        return {
          lastBlock: getBit(buf, off, 7),
          type: getBitAllignedNumber(buf, off, 1, 7),
          length: UINT24_BE.get(buf, off + 1)
        };
      }
    };
    BlockStreamInfo = {
      len: 34,
      get: (buf, off) => {
        return {
          // The minimum block size (in samples) used in the stream.
          minimumBlockSize: UINT16_BE.get(buf, off),
          // The maximum block size (in samples) used in the stream.
          // (Minimum blocksize == maximum blocksize) implies a fixed-blocksize stream.
          maximumBlockSize: UINT16_BE.get(buf, off + 2) / 1e3,
          // The minimum frame size (in bytes) used in the stream.
          // May be 0 to imply the value is not known.
          minimumFrameSize: UINT24_BE.get(buf, off + 4),
          // The maximum frame size (in bytes) used in the stream.
          // May be 0 to imply the value is not known.
          maximumFrameSize: UINT24_BE.get(buf, off + 7),
          // Sample rate in Hz. Though 20 bits are available,
          // the maximum sample rate is limited by the structure of frame headers to 655350Hz.
          // Also, a value of 0 is invalid.
          sampleRate: UINT24_BE.get(buf, off + 10) >> 4,
          // probably slower: sampleRate: common.getBitAllignedNumber(buf, off + 10, 0, 20),
          // (number of channels)-1. FLAC supports from 1 to 8 channels
          channels: getBitAllignedNumber(buf, off + 12, 4, 3) + 1,
          // bits per sample)-1.
          // FLAC supports from 4 to 32 bits per sample. Currently the reference encoder and decoders only support up to 24 bits per sample.
          bitsPerSample: getBitAllignedNumber(buf, off + 12, 7, 5) + 1,
          // Total samples in stream.
          // 'Samples' means inter-channel sample, i.e. one second of 44.1Khz audio will have 44100 samples regardless of the number of channels.
          // A value of zero here means the number of total samples is unknown.
          totalSamples: getBitAllignedNumber(buf, off + 13, 4, 36),
          // the MD5 hash of the file (see notes for usage... it's a littly tricky)
          fileMD5: new Uint8ArrayType(16).get(buf, off + 18)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/flac/FlacParser.js
var FlacParser_exports = {};
__export(FlacParser_exports, {
  FlacParser: () => FlacParser
});
var import_debug13, debug13, FlacContentError, FlacParser;
var init_FlacParser = __esm({
  "node_modules/music-metadata/lib/flac/FlacParser.js"() {
    import_debug13 = __toESM(require_src(), 1);
    init_lib3();
    init_Allocation();
    init_FourCC();
    init_AbstractID3Parser();
    init_Vorbis();
    init_VorbisDecoder();
    init_VorbisStream();
    init_ParseError();
    init_FlacToken();
    debug13 = (0, import_debug13.default)("music-metadata:parser:FLAC");
    FlacContentError = class extends makeUnexpectedFileContentError("FLAC") {
    };
    FlacParser = class extends AbstractID3Parser {
      vorbisParser = new VorbisStream(this.metadata, this.options);
      async postId3v2Parse() {
        const fourCC = await this.readToken(FourCcToken);
        if (fourCC.toString() !== "fLaC") {
          throw new FlacContentError("Invalid FLAC preamble");
        }
        let blockHeader;
        do {
          blockHeader = await this.readToken(BlockHeader);
          await this.parseDataBlock(blockHeader);
        } while (!blockHeader.lastBlock);
        if (this.tokenizer.fileInfo.size && this.metadata.format.duration) {
          const dataSize = this.tokenizer.fileInfo.size - this.tokenizer.position;
          this.metadata.setFormat("bitrate", 8 * dataSize / this.metadata.format.duration);
        }
      }
      async parseDataBlock(blockHeader) {
        debug13(`blockHeader type=${blockHeader.type}, length=${blockHeader.length}`);
        switch (blockHeader.type) {
          case BlockType.STREAMINFO:
            return this.readBlockStreamInfo(blockHeader.length);
          case BlockType.PADDING:
            break;
          case BlockType.APPLICATION:
            break;
          case BlockType.SEEKTABLE:
            break;
          case BlockType.VORBIS_COMMENT:
            return this.readComment(blockHeader.length);
          case BlockType.CUESHEET:
            break;
          case BlockType.PICTURE:
            await this.parsePicture(blockHeader.length);
            return;
          default:
            this.metadata.addWarning(`Unknown block type: ${blockHeader.type}`);
        }
        return this.tokenizer.ignore(blockHeader.length).then();
      }
      /**
       * Parse STREAMINFO
       */
      async readBlockStreamInfo(dataLen) {
        if (dataLen !== BlockStreamInfo.len) {
          throw new FlacContentError("Unexpected block-stream-info length");
        }
        const streamInfo = await this.readToken(BlockStreamInfo);
        this.metadata.setFormat("container", "FLAC");
        this.processsStreamInfo(streamInfo);
      }
      /**
       * Parse STREAMINFO
       */
      processsStreamInfo(streamInfo) {
        this.metadata.setFormat("codec", "FLAC");
        this.metadata.setFormat("hasAudio", true);
        this.metadata.setFormat("lossless", true);
        this.metadata.setFormat("numberOfChannels", streamInfo.channels);
        this.metadata.setFormat("bitsPerSample", streamInfo.bitsPerSample);
        this.metadata.setFormat("sampleRate", streamInfo.sampleRate);
        if (streamInfo.totalSamples > 0) {
          this.metadata.setFormat("duration", streamInfo.totalSamples / streamInfo.sampleRate);
        }
      }
      /**
       * Read VORBIS_COMMENT from tokenizer
       * Ref: https://www.xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-640004.2.3
       */
      async readComment(dataLen) {
        const data = await this.readToken(new Uint8ArrayType(dataLen));
        return this.parseComment(data);
      }
      /**
       * Parse VORBIS_COMMENT
       * Ref: https://www.xiph.org/vorbis/doc/Vorbis_I_spec.html#x1-640004.2.3
       */
      async parseComment(data) {
        const decoder = new VorbisDecoder(data, 0);
        const { vendor, comments } = decoder.parseCommentList((message) => new FlacContentError(message), getMaxMetadataEntries(this.options));
        if (vendor.length > 0) {
          this.metadata.setFormat("tool", vendor);
        }
        for (const tag of comments) {
          if (tag.key === "ENCODER") {
            this.metadata.setFormat("tool", tag.value);
          }
          await this.addTag(tag.key, tag.value);
        }
      }
      async parsePicture(dataLen) {
        if (this.options.skipCovers) {
          return this.tokenizer.ignore(dataLen);
        }
        return this.addPictureTag(await this.readToken(new VorbisPictureToken(dataLen)));
      }
      addPictureTag(picture) {
        return this.addTag("METADATA_BLOCK_PICTURE", picture);
      }
      addTag(id, value) {
        return this.vorbisParser.addTag(id, value);
      }
    };
  }
});

// node_modules/music-metadata/lib/flac/FlacLoader.js
var flacParserLoader;
var init_FlacLoader = __esm({
  "node_modules/music-metadata/lib/flac/FlacLoader.js"() {
    flacParserLoader = {
      parserType: "flac",
      extensions: [".flac"],
      mimeTypes: ["audio/flac"],
      async load() {
        return (await Promise.resolve().then(() => (init_FlacParser(), FlacParser_exports))).FlacParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/ebml/types.js
var DataType3;
var init_types = __esm({
  "node_modules/music-metadata/lib/ebml/types.js"() {
    DataType3 = {
      string: 0,
      uint: 1,
      uid: 2,
      bool: 3,
      binary: 4,
      float: 5,
      int: 6
    };
  }
});

// node_modules/music-metadata/lib/ebml/EbmlIterator.js
function readUIntBE(buf, len) {
  return Number(readUIntBeAsBigInt(buf, len));
}
function readUIntBeAsBigInt(buf, len) {
  const normalizedNumber = new Uint8Array(8);
  const cleanNumber = buf.subarray(0, len);
  try {
    normalizedNumber.set(cleanNumber, 8 - len);
    return UINT64_BE.get(normalizedNumber, 0);
  } catch (_error) {
    return BigInt(-1);
  }
}
function getElementPath(element) {
  let path2 = "";
  if (element.parent && element.parent.name !== "dtd") {
    path2 += `${getElementPath(element.parent)}/`;
  }
  return path2 + element.name;
}
var import_debug14, debug14, EbmlContentError, ParseAction, EbmlIterator;
var init_EbmlIterator = __esm({
  "node_modules/music-metadata/lib/ebml/EbmlIterator.js"() {
    import_debug14 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_lib3();
    init_Allocation();
    init_ParseError();
    init_types();
    debug14 = (0, import_debug14.default)("music-metadata:parser:ebml");
    EbmlContentError = class extends makeUnexpectedFileContentError("EBML") {
    };
    ParseAction = {
      ReadNext: 0,
      // Continue reading the next elements
      IgnoreElement: 2,
      // Ignore (do not read) this element
      SkipSiblings: 3,
      // Skip all remaining elements at the same level
      TerminateParsing: 4,
      // Terminate the parsing process
      SkipElement: 5
      // Consider the element has read, assume position is at the next element
    };
    EbmlIterator = class {
      options;
      parserMap = /* @__PURE__ */ new Map();
      ebmlMaxIDLength = 4;
      ebmlMaxSizeLength = 8;
      tokenizer;
      elementHeader;
      /**
       * @param {ITokenizer} tokenizer Input
       * @param tokenizer
       */
      constructor(tokenizer, options = {}) {
        this.options = options;
        this.tokenizer = tokenizer;
        const maxMemoryAllocation = getMaxMemoryAllocation(options);
        this.elementHeader = new Uint8Array(Math.min(12, maxMemoryAllocation));
        this.parserMap.set(DataType3.uint, (e) => this.readUint(e));
        this.parserMap.set(DataType3.int, (e) => this.readInt(e));
        this.parserMap.set(DataType3.string, (e) => this.readString(e));
        this.parserMap.set(DataType3.binary, (e) => this.readBuffer(e));
        this.parserMap.set(DataType3.uid, async (e) => this.readBuffer(e));
        this.parserMap.set(DataType3.bool, (e) => this.readFlag(e));
        this.parserMap.set(DataType3.float, (e) => this.readFloat(e));
      }
      async iterate(dtdElement, posDone, listener) {
        const root = { ...dtdElement, id: 0, parent: void 0 };
        const tree = await this.parseContainer(root, posDone, {
          startNext: listener.startNext,
          collect: listener.collect ?? (() => true),
          elementValue: async (element, value, offset) => {
            await listener.elementValue?.(element, value, offset);
            await listener.onElement?.({ id: element.id, element, value, offset });
          }
        }, listener.collect?.(root) ?? true);
        return tree;
      }
      async parseContainer(dtdElement, posDone, listener, collect) {
        const tree = {};
        while (this.tokenizer.position < posDone) {
          let element;
          const elementPosition = this.tokenizer.position;
          try {
            element = await this.readElement();
          } catch (error) {
            if (error instanceof EndOfStreamError) {
              break;
            }
            throw error;
          }
          const definition = dtdElement.container?.[element.id];
          if (definition) {
            const child = { ...definition, id: element.id, parent: dtdElement };
            const action = await listener.startNext(child);
            switch (action) {
              case ParseAction.ReadNext:
                {
                  debug14(`Read element: name=${getElementPath(child)}{id=0x${element.id.toString(16)}, container=${!!child.container}} at position=${elementPosition}`);
                  if (child.container) {
                    const childEnd = Math.min(posDone, this.tokenizer.fileInfo.size ?? Number.POSITIVE_INFINITY, element.len >= 0 ? this.tokenizer.position + element.len : posDone);
                    const res = await this.parseContainer(child, childEnd, listener, collect || listener.collect(child));
                    if (collect) {
                      this.collect(tree, child, res);
                    }
                    await listener.elementValue(child, res, elementPosition);
                  } else {
                    const parser = child.value === void 0 ? void 0 : this.parserMap.get(child.value);
                    if (typeof parser === "function") {
                      const end = Math.min(posDone, this.tokenizer.fileInfo.size ?? Number.POSITIVE_INFINITY);
                      if (!Number.isSafeInteger(element.len) || element.len < 0 || element.len > end - this.tokenizer.position) {
                        throw new EbmlContentError(`Invalid element length: ${element.len}`);
                      }
                      const value = await parser(element);
                      if (collect) {
                        this.collect(tree, child, value);
                      }
                      await listener.elementValue(child, value, elementPosition);
                    } else {
                      await this.ignore(element.len, posDone);
                    }
                  }
                }
                break;
              case ParseAction.SkipElement:
                debug14(`Go to next element: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                break;
              case ParseAction.IgnoreElement:
                debug14(`Ignore element: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                await this.ignore(element.len, posDone);
                break;
              case ParseAction.SkipSiblings:
                debug14(`Ignore remaining container, at: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                await this.ignore(posDone - this.tokenizer.position, posDone);
                break;
              case ParseAction.TerminateParsing:
                debug14(`Terminate parsing at element: name=${getElementPath(child)}, element.id=0x${element.id}, container=${!!child.container} at position=${elementPosition}`);
                return tree;
            }
          } else {
            switch (element.id) {
              case 236:
                await this.ignore(element.len, posDone);
                break;
              default:
                debug14(`parseEbml: parent=${getElementPath(dtdElement)}, unknown child: id=${element.id.toString(16)} at position=${elementPosition}`);
                await this.ignore(element.len, posDone);
            }
          }
        }
        return tree;
      }
      collect(tree, element, value) {
        if (element.multiple) {
          const values = tree[element.name] ??= [];
          if (Array.isArray(values)) {
            if (values.length >= getMaxMetadataEntries(this.options)) {
              throw new EbmlContentError("Collected EBML element count exceeds entry limit");
            }
            values.push(value);
          }
        } else {
          tree[element.name] = value;
        }
      }
      async ignore(length, posDone) {
        const end = Math.min(posDone, this.tokenizer.fileInfo.size ?? Number.POSITIVE_INFINITY);
        const boundedLength = Math.min(length, end - this.tokenizer.position);
        if (!Number.isSafeInteger(boundedLength) || boundedLength < 0) {
          throw new EbmlContentError(`Invalid element length: ${length}`);
        }
        await this.tokenizer.ignore(boundedLength);
      }
      async readVintData(maxLength) {
        const msb = await this.tokenizer.peekNumber(UINT8);
        let mask = 128;
        let oc = 1;
        while ((msb & mask) === 0) {
          if (oc > maxLength) {
            throw new EbmlContentError("VINT value exceeding maximum size");
          }
          ++oc;
          mask >>= 1;
        }
        const id = new Uint8Array(oc);
        await this.tokenizer.readBuffer(id);
        return id;
      }
      async readElement() {
        if (isRandomAccessTokenizer(this.tokenizer) && this.elementHeader.length === 12) {
          const available = await this.tokenizer.peekBuffer(this.elementHeader, { mayBeLess: true });
          const width = (offset, maximum) => {
            if (offset >= available) {
              throw new EndOfStreamError();
            }
            for (let length = 1; length <= maximum; ++length) {
              if ((this.elementHeader[offset] & 128 >> length - 1) !== 0) {
                if (offset + length > available) {
                  throw new EndOfStreamError();
                }
                return length;
              }
            }
            throw new EbmlContentError("VINT value exceeding maximum size");
          };
          const idLength = width(0, this.ebmlMaxIDLength);
          const sizeLength = width(idLength, this.ebmlMaxSizeLength);
          const id2 = readUIntBE(this.elementHeader.subarray(0, idLength), idLength);
          const lenField2 = this.elementHeader.subarray(idLength, idLength + sizeLength);
          lenField2[0] ^= 128 >> sizeLength - 1;
          this.tokenizer.setPosition(this.tokenizer.position + idLength + sizeLength);
          return { id: id2, len: readUIntBE(lenField2, sizeLength) };
        }
        const id = await this.readVintData(this.ebmlMaxIDLength);
        const lenField = await this.readVintData(this.ebmlMaxSizeLength);
        lenField[0] ^= 128 >> lenField.length - 1;
        return {
          id: readUIntBE(id, id.length),
          len: readUIntBE(lenField, lenField.length)
        };
      }
      async readFloat(e) {
        switch (e.len) {
          case 0:
            return 0;
          case 4:
            return this.tokenizer.readNumber(Float32_BE);
          case 8:
            return this.tokenizer.readNumber(Float64_BE);
          case 10:
            return this.tokenizer.readNumber(Float64_BE);
          default:
            throw new EbmlContentError(`Invalid IEEE-754 float length: ${e.len}`);
        }
      }
      async readFlag(e) {
        return await this.readUint(e) === 1;
      }
      async readUint(e) {
        const buf = await this.readBuffer(e);
        return readUIntBE(buf, e.len);
      }
      async readInt(e) {
        const buffer = await this.readBuffer(e);
        const value = readUIntBeAsBigInt(buffer, e.len);
        return Number(buffer[0] & 128 ? value - (1n << BigInt(8 * e.len)) : value);
      }
      async readString(e) {
        const buf = await this.readBuffer(e);
        const rawString = new StringType(e.len, "utf-8").get(buf, 0);
        return rawString.replace(/\x00.*$/g, "");
      }
      async readBuffer(e) {
        return readBuffer(this.tokenizer, e.len, this.options, void 0, (message) => new EbmlContentError(message));
      }
    };
  }
});

// node_modules/music-metadata/lib/matroska/MatroskaDtd.js
var matroskaDtd;
var init_MatroskaDtd = __esm({
  "node_modules/music-metadata/lib/matroska/MatroskaDtd.js"() {
    init_types();
    matroskaDtd = {
      name: "dtd",
      container: {
        440786851: {
          // 5.1
          name: "ebml",
          container: {
            17030: { name: "ebmlVersion", value: DataType3.uint },
            // 5.1.1
            17143: { name: "ebmlReadVersion", value: DataType3.uint },
            // 5.1.2
            17138: { name: "ebmlMaxIDWidth", value: DataType3.uint },
            // 5.1.3
            17139: { name: "ebmlMaxSizeWidth", value: DataType3.uint },
            // 5.1.4
            17026: { name: "docType", value: DataType3.string },
            // 5.1.5
            17031: { name: "docTypeVersion", value: DataType3.uint },
            // 5.1.6
            17029: { name: "docTypeReadVersion", value: DataType3.uint }
            // 5.1.7
          }
        },
        // Matroska segments
        408125543: {
          name: "segment",
          container: {
            // Meta Seek Information (also known as MetaSeek)
            290298740: {
              name: "seekHead",
              multiple: true,
              container: {
                19899: {
                  name: "seek",
                  multiple: true,
                  container: {
                    21419: { name: "id", value: DataType3.binary },
                    21420: { name: "position", value: DataType3.uint }
                  }
                }
              }
            },
            // Segment Information
            357149030: {
              name: "info",
              container: {
                29604: { name: "uid", value: DataType3.uid },
                29572: { name: "filename", value: DataType3.string },
                3979555: { name: "prevUID", value: DataType3.uid },
                3965867: { name: "prevFilename", value: DataType3.string },
                4110627: { name: "nextUID", value: DataType3.uid },
                4096955: { name: "nextFilename", value: DataType3.string },
                2807729: { name: "timecodeScale", value: DataType3.uint },
                17545: { name: "duration", value: DataType3.float },
                17505: { name: "dateUTC", value: DataType3.int },
                31657: { name: "title", value: DataType3.string },
                19840: { name: "muxingApp", value: DataType3.string },
                22337: { name: "writingApp", value: DataType3.string }
              }
            },
            // Cluster
            524531317: {
              name: "cluster",
              multiple: true,
              container: {
                231: { name: "timecode", value: DataType3.uint },
                22612: {
                  name: "silentTracks",
                  container: {
                    22743: { name: "trackNumber", value: DataType3.uint, multiple: true }
                  }
                },
                167: { name: "position", value: DataType3.uint },
                171: { name: "prevSize", value: DataType3.uint },
                160: { name: "blockGroup", multiple: true },
                163: { name: "simpleBlock", value: DataType3.binary, multiple: true }
              }
            },
            // Track
            374648427: {
              name: "tracks",
              container: {
                174: {
                  name: "entries",
                  multiple: true,
                  container: {
                    215: { name: "trackNumber", value: DataType3.uint },
                    29637: { name: "uid", value: DataType3.uid },
                    131: { name: "trackType", value: DataType3.uint },
                    185: { name: "flagEnabled", value: DataType3.bool },
                    136: { name: "flagDefault", value: DataType3.bool },
                    21930: { name: "flagForced", value: DataType3.bool },
                    // extended
                    156: { name: "flagLacing", value: DataType3.bool },
                    28135: { name: "minCache", value: DataType3.uint },
                    28152: { name: "maxCache", value: DataType3.uint },
                    2352003: { name: "defaultDuration", value: DataType3.uint },
                    2306383: { name: "trackTimecodeScale", value: DataType3.float },
                    21358: { name: "name", value: DataType3.string },
                    2274716: { name: "language", value: DataType3.string },
                    2274717: { name: "languageIETF", value: DataType3.string },
                    134: { name: "codecID", value: DataType3.string },
                    25506: { name: "codecPrivate", value: DataType3.binary },
                    2459272: { name: "codecName", value: DataType3.string },
                    3839639: { name: "codecSettings", value: DataType3.string },
                    3883072: { name: "codecInfoUrl", value: DataType3.string, multiple: true },
                    2536e3: { name: "codecDownloadUrl", value: DataType3.string, multiple: true },
                    170: { name: "codecDecodeAll", value: DataType3.bool },
                    28587: { name: "trackOverlay", value: DataType3.uint, multiple: true },
                    // Video
                    224: {
                      name: "video",
                      container: {
                        154: { name: "flagInterlaced", value: DataType3.uint },
                        21432: { name: "stereoMode", value: DataType3.uint },
                        176: { name: "pixelWidth", value: DataType3.uint },
                        186: { name: "pixelHeight", value: DataType3.uint },
                        21680: { name: "displayWidth", value: DataType3.uint },
                        21690: { name: "displayHeight", value: DataType3.uint },
                        21682: { name: "displayUnit", value: DataType3.uint },
                        21683: { name: "aspectRatioType", value: DataType3.uint },
                        3061028: { name: "colourSpace", value: DataType3.binary },
                        3126563: { name: "gammaValue", value: DataType3.float }
                      }
                    },
                    // Audio
                    225: {
                      name: "audio",
                      container: {
                        181: { name: "samplingFrequency", value: DataType3.float },
                        30901: { name: "outputSamplingFrequency", value: DataType3.float },
                        159: { name: "channels", value: DataType3.uint },
                        // https://www.matroska.org/technical/specs/index.html
                        32123: { name: "channelPositions", value: DataType3.binary },
                        25188: { name: "bitDepth", value: DataType3.uint }
                      }
                    },
                    // Content Encoding
                    28032: {
                      name: "contentEncodings",
                      container: {
                        25152: {
                          name: "contentEncoding",
                          multiple: true,
                          container: {
                            20529: { name: "order", value: DataType3.uint },
                            20530: { name: "scope", value: DataType3.uint },
                            20531: { name: "type", value: DataType3.uint },
                            20532: {
                              name: "contentCompression",
                              container: {
                                16980: { name: "contentCompAlgo", value: DataType3.uint },
                                16981: { name: "contentCompSettings", value: DataType3.binary }
                              }
                            },
                            20533: {
                              name: "contentEncryption",
                              container: {
                                18401: { name: "contentEncAlgo", value: DataType3.uint },
                                18402: { name: "contentEncKeyID", value: DataType3.binary },
                                18403: { name: "contentSignature", value: DataType3.binary },
                                18404: { name: "contentSigKeyID", value: DataType3.binary },
                                18405: { name: "contentSigAlgo", value: DataType3.uint },
                                18406: { name: "contentSigHashAlgo", value: DataType3.uint }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            // Cueing Data
            475249515: {
              name: "cues",
              container: {
                187: {
                  name: "cuePoint",
                  multiple: true,
                  container: {
                    179: { name: "cueTime", value: DataType3.uint },
                    183: {
                      name: "positions",
                      multiple: true,
                      container: {
                        247: { name: "track", value: DataType3.uint },
                        241: { name: "clusterPosition", value: DataType3.uint },
                        21368: { name: "blockNumber", value: DataType3.uint },
                        234: { name: "codecState", value: DataType3.uint },
                        219: {
                          name: "reference",
                          multiple: true,
                          container: {
                            150: { name: "time", value: DataType3.uint },
                            151: { name: "cluster", value: DataType3.uint },
                            21343: { name: "number", value: DataType3.uint },
                            235: { name: "codecState", value: DataType3.uint }
                          }
                        },
                        240: { name: "relativePosition", value: DataType3.uint }
                        // extended
                      }
                    }
                  }
                }
              }
            },
            // Attachment
            423732329: {
              name: "attachments",
              container: {
                24999: {
                  name: "attachedFiles",
                  multiple: true,
                  container: {
                    18046: { name: "description", value: DataType3.string },
                    18030: { name: "name", value: DataType3.string },
                    18016: { name: "mimeType", value: DataType3.string },
                    18012: { name: "data", value: DataType3.binary },
                    18094: { name: "uid", value: DataType3.uid }
                  }
                }
              }
            },
            // Chapters
            272869232: {
              name: "chapters",
              container: {
                17849: {
                  name: "editionEntry",
                  multiple: true,
                  container: {
                    182: {
                      name: "chapterAtom",
                      multiple: true,
                      container: {
                        29636: { name: "uid", value: DataType3.uid },
                        145: { name: "timeStart", value: DataType3.uint },
                        146: { name: "timeEnd", value: DataType3.uint },
                        152: { name: "hidden", value: DataType3.bool },
                        17816: { name: "enabled", value: DataType3.bool },
                        143: {
                          name: "track",
                          container: {
                            137: { name: "trackUID", value: DataType3.uid, multiple: true }
                          }
                        },
                        128: {
                          name: "display",
                          multiple: true,
                          container: {
                            133: { name: "string", value: DataType3.string },
                            17276: { name: "language", value: DataType3.string, multiple: true },
                            17278: { name: "country", value: DataType3.string, multiple: true }
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            // Tagging
            307544935: {
              name: "tags",
              multiple: true,
              container: {
                29555: {
                  name: "tag",
                  multiple: true,
                  container: {
                    25536: {
                      name: "target",
                      container: {
                        25541: { name: "tagTrackUID", value: DataType3.uid, multiple: true },
                        25540: { name: "tagChapterUID", value: DataType3.uid, multiple: true },
                        25542: { name: "tagAttachmentUID", value: DataType3.uid, multiple: true },
                        25546: { name: "targetType", value: DataType3.string },
                        // extended
                        26826: { name: "targetTypeValue", value: DataType3.uint },
                        // extended
                        25545: { name: "tagEditionUID", value: DataType3.uid, multiple: true }
                        // extended
                      }
                    },
                    26568: {
                      name: "simpleTags",
                      multiple: true,
                      container: {
                        17827: { name: "name", value: DataType3.string },
                        17543: { name: "string", value: DataType3.string },
                        17541: { name: "binary", value: DataType3.binary },
                        17530: { name: "language", value: DataType3.string },
                        // extended
                        17531: { name: "languageIETF", value: DataType3.string },
                        // extended
                        17540: { name: "default", value: DataType3.bool }
                        // extended
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/matroska/types.js
var TargetType;
var init_types2 = __esm({
  "node_modules/music-metadata/lib/matroska/types.js"() {
    init_type();
    TargetType = {
      10: "shot",
      20: "scene",
      30: "track",
      40: "part",
      50: "album",
      60: "edition",
      70: "collection"
    };
  }
});

// node_modules/music-metadata/lib/matroska/MatroskaParser.js
var MatroskaParser_exports = {};
__export(MatroskaParser_exports, {
  MatroskaParser: () => MatroskaParser
});
function isCompleteTrack(entry) {
  return typeof entry.trackNumber === "number" && Number.isSafeInteger(entry.trackNumber) && entry.trackNumber > 0 && typeof entry.codecID === "string" && entry.codecID.length > 0 && Object.values(TrackType).some((type) => type === entry.trackType);
}
function isCompleteFile(file) {
  return typeof file.name === "string" && typeof file.mimeType === "string" && file.data instanceof Uint8Array && file.uid instanceof Uint8Array;
}
function videoInfo(video) {
  const { flagInterlaced, ...properties } = video;
  const result = properties;
  if (flagInterlaced === 1 || flagInterlaced === 2) {
    result.flagInterlaced = flagInterlaced === 1;
  }
  return result;
}
var import_debug15, debug15, targetTypes, MatroskaParser;
var init_MatroskaParser = __esm({
  "node_modules/music-metadata/lib/matroska/MatroskaParser.js"() {
    import_debug15 = __toESM(require_src(), 1);
    init_BasicParser();
    init_EbmlIterator();
    init_MatroskaDtd();
    init_types2();
    debug15 = (0, import_debug15.default)("music-metadata:parser:matroska");
    targetTypes = TargetType;
    MatroskaParser = class extends BasicParser {
      tracksByUid = /* @__PURE__ */ new Map();
      trackStatistics = /* @__PURE__ */ new Map();
      seekHead;
      seekHeadOffset = 0;
      /**
       * Use index to skip multiple segment/cluster elements at once.
       * Significant performance impact
       */
      flagUseIndexToSkipClusters = this.options.mkvUseIndex ?? false;
      async parse() {
        const containerSize = this.tokenizer.fileInfo.size ?? Number.MAX_SAFE_INTEGER;
        const attachmentMimeTypes = /* @__PURE__ */ new WeakMap();
        const matroskaIterator = new EbmlIterator(this.tokenizer, this.options);
        debug15("Initializing DTD end MatroskaIterator");
        await matroskaIterator.iterate(matroskaDtd, containerSize, {
          // Process tags and attachments one at a time. Never assemble a Segment/root tree.
          collect: (element) => [290298740, 357149030, 374648427, 29555, 24999].includes(element.id),
          startNext: async (element) => {
            switch (element.id) {
              case 408125543:
                this.seekHeadOffset = this.tokenizer.position;
                return ParseAction.ReadNext;
              case 423732329:
                return this.options.skipCovers ? ParseAction.IgnoreElement : ParseAction.ReadNext;
              case 18012: {
                const mimeType = element.parent && attachmentMimeTypes.get(element.parent);
                return mimeType !== void 0 && !mimeType.startsWith("image/") ? ParseAction.IgnoreElement : ParseAction.ReadNext;
              }
              case 290298740:
                return this.flagUseIndexToSkipClusters ? ParseAction.ReadNext : ParseAction.IgnoreElement;
              case 25506:
              // CodecPrivate is not exposed as metadata.
              case 28032:
              // ContentEncodings
              case 272869232:
              // Chapters are not currently exposed by this parser.
              case 475249515:
                debug15(`Skip element: name=${element.name}, id=0x${element.id.toString(16)}`);
                return ParseAction.IgnoreElement;
              case 524531317:
                if (this.flagUseIndexToSkipClusters && this.seekHead) {
                  const index = (this.seekHead.seek ?? []).find((index2) => index2.position !== void 0 && index2.position + this.seekHeadOffset > this.tokenizer.position);
                  if (index?.position !== void 0) {
                    const ignoreSize = index.position + this.seekHeadOffset - this.tokenizer.position;
                    debug15(`Use index to go to next position, ignoring ${ignoreSize} bytes`);
                    await this.tokenizer.ignore(ignoreSize);
                    return ParseAction.SkipElement;
                  }
                }
                return ParseAction.IgnoreElement;
              default:
                return ParseAction.ReadNext;
            }
          },
          onElement: async (event) => {
            if (debug15.enabled) {
              const value = event.value instanceof Uint8Array ? `${event.value.byteLength} bytes` : event.value;
              debug15(`Received: name=${event.element.name}, value=${value}`);
            }
            switch (event.id) {
              case 17026:
                this.metadata.setFormat("container", `EBML/${event.value}`);
                break;
              case 290298740:
                this.seekHead = event.value;
                break;
              case 357149030:
                {
                  const info = event.value;
                  if (info.title !== void 0) {
                    await this.addTag("segment:title", info.title);
                  }
                  const timecodeScale = info.timecodeScale ? info.timecodeScale : 1e6;
                  if (typeof info.duration === "number") {
                    const duration = info.duration * timecodeScale / 1e9;
                    if (Number.isFinite(duration) && duration > 0) {
                      this.metadata.setFormat("duration", duration);
                      this.metadata.setFormat("containerDuration", duration);
                    }
                  }
                }
                break;
              case 374648427:
                {
                  const audioTracks = event.value;
                  if (audioTracks?.entries) {
                    const entries = audioTracks.entries.filter((entry) => {
                      if (isCompleteTrack(entry)) {
                        return true;
                      }
                      this.metadata.addWarning("Ignoring Matroska track without valid TrackNumber, TrackType or CodecID");
                      return false;
                    }).filter(isCompleteTrack);
                    entries.forEach((entry) => {
                      const stream = {
                        id: entry.trackNumber,
                        codecId: entry.codecID,
                        codecName: entry.codecName ?? entry.codecID.replace(/^[AV]_/, ""),
                        codecSettings: entry.codecSettings,
                        flagDefault: entry.flagDefault ?? true,
                        flagLacing: entry.flagLacing ?? true,
                        flagEnabled: entry.flagEnabled ?? true,
                        flagForced: entry.flagForced ?? false,
                        language: entry.languageIETF ?? entry.language ?? "eng",
                        name: entry.name,
                        type: entry.trackType,
                        audio: entry.trackType === TrackType.audio ? {
                          ...entry.audio,
                          samplingFrequency: entry.audio?.samplingFrequency ?? 8e3,
                          channels: entry.audio?.channels ?? 1
                        } : void 0,
                        video: entry.trackType === TrackType.video && entry.video ? videoInfo(entry.video) : void 0
                      };
                      if (stream.video && entry.defaultDuration && entry.defaultDuration > 0) {
                        stream.video = { ...stream.video, frameRate: 1e9 / entry.defaultDuration };
                      }
                      if (entry.uid) {
                        this.tracksByUid.set(this.uidKey(entry.uid), stream);
                      }
                      this.metadata.addStreamInfo(stream);
                    });
                    const audioTrack = entries.filter((entry) => entry.trackType === TrackType.audio && entry.flagEnabled !== false).reduce((acc, cur) => {
                      if (!acc) {
                        return cur;
                      }
                      const currentDefault = cur.flagDefault ?? true;
                      const previousDefault = acc.flagDefault ?? true;
                      if (currentDefault !== previousDefault) {
                        return currentDefault ? cur : acc;
                      }
                      if (cur.trackNumber < acc.trackNumber) {
                        return cur;
                      }
                      return acc;
                    }, null);
                    if (audioTrack) {
                      this.metadata.setFormat("codec", audioTrack.codecID.replace(/^A_/, ""));
                      this.metadata.setFormat("hasAudio", true);
                      this.metadata.setFormat("sampleRate", audioTrack.audio?.outputSamplingFrequency ?? audioTrack.audio?.samplingFrequency ?? 8e3);
                      this.metadata.setFormat("numberOfChannels", audioTrack.audio?.channels ?? 1);
                      if (audioTrack.audio?.bitDepth !== void 0) {
                        this.metadata.setFormat("bitsPerSample", audioTrack.audio.bitDepth);
                      }
                    }
                  }
                }
                break;
              case 29555: {
                const tag = event.value;
                const target = tag.target;
                for (const uid of target?.tagTrackUID ?? []) {
                  const key = this.uidKey(uid);
                  if (key !== "0") {
                    const statistics = this.trackStatistics.get(key) ?? /* @__PURE__ */ new Map();
                    for (const simpleTag of tag.simpleTags ?? []) {
                      if (simpleTag.name && typeof simpleTag.string === "string") {
                        statistics.set(simpleTag.name.toUpperCase(), simpleTag.string);
                      }
                    }
                    this.trackStatistics.set(key, statistics);
                  }
                }
                const targetType = target?.targetTypeValue !== void 0 ? targetTypes[target.targetTypeValue] ?? "track" : target?.targetType ?? "track";
                for (const simpleTag of tag.simpleTags ?? []) {
                  const value = simpleTag.string ?? simpleTag.binary;
                  if (simpleTag.name && value !== void 0) {
                    await this.addTag(`${targetType}:${simpleTag.name}`, value);
                  }
                }
                break;
              }
              case 18016:
                if (event.element.parent) {
                  attachmentMimeTypes.set(event.element.parent, event.value);
                }
                break;
              case 24999: {
                const file = event.value;
                if (file.mimeType?.startsWith("image/")) {
                  if (isCompleteFile(file)) {
                    await this.addTag("picture", {
                      data: file.data,
                      format: file.mimeType,
                      description: file.description,
                      name: file.name
                    });
                  } else {
                    this.metadata.addWarning("Ignoring incomplete Matroska image attachment");
                  }
                }
                break;
              }
            }
          }
        });
        this.applyTrackStatistics();
      }
      uidKey(uid) {
        return Array.from(uid, (byte) => byte.toString(16).padStart(2, "0")).join("").replace(/^0+/, "") || "0";
      }
      applyTrackStatistics() {
        for (const [uid, tags] of this.trackStatistics) {
          const track = this.tracksByUid.get(uid);
          if (!track) {
            continue;
          }
          const duration = tags.get("DURATION")?.match(/^(\d+):([0-5]\d):([0-5]\d(?:\.\d+)?)$/);
          if (duration) {
            const seconds = Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]);
            if (Number.isFinite(seconds) && seconds > 0) {
              track.duration = seconds;
            }
          }
          const number = (name) => {
            const value = tags.get(name);
            if (value && /^\d+$/.test(value)) {
              const result = Number(value);
              if (Number.isSafeInteger(result) && result >= 0) {
                return result;
              }
            }
            return void 0;
          };
          const bitrate = number("BPS");
          const size = number("NUMBER_OF_BYTES");
          if (bitrate !== void 0 && bitrate > 0) {
            track.bitrate = bitrate;
          } else if (size !== void 0 && track.duration) {
            track.bitrate = size * 8 / track.duration;
          }
          const frames = number("NUMBER_OF_FRAMES");
          if (track.video && frames !== void 0 && frames > 0 && track.duration) {
            track.video.frameRate ??= frames / track.duration;
          }
        }
      }
      async addTag(tagId, value) {
        await this.metadata.addTag("matroska", tagId, value);
      }
    };
  }
});

// node_modules/music-metadata/lib/matroska/MatroskaLoader.js
var matroskaParserLoader;
var init_MatroskaLoader = __esm({
  "node_modules/music-metadata/lib/matroska/MatroskaLoader.js"() {
    matroskaParserLoader = {
      parserType: "matroska",
      extensions: [".mka", ".mkv", ".mk3d", ".mks", "webm"],
      mimeTypes: ["audio/matroska", "video/matroska", "audio/webm", "video/webm"],
      async load() {
        return (await Promise.resolve().then(() => (init_MatroskaParser(), MatroskaParser_exports))).MatroskaParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/mp4/AtomToken.js
function readTimeHeader(buf, off) {
  const version = UINT8.get(buf, off);
  const wide = version === 1;
  const timestamp = wide ? SecondsSinceMacEpoch64 : SecondsSinceMacEpoch;
  return {
    version,
    flags: UINT24_BE.get(buf, off + 1),
    creationTime: timestamp.get(buf, off + 4),
    modificationTime: timestamp.get(buf, off + (wide ? 12 : 8)),
    timeScale: UINT32_BE.get(buf, off + (wide ? 20 : 12)),
    duration: wide ? Number(UINT64_BE.get(buf, off + 24)) : UINT32_BE.get(buf, off + 16)
  };
}
function readTokenTable(buf, token, off, remainingLen, numberOfEntries, maxEntries = defaultMaxMetadataEntries) {
  debug16(`remainingLen=${remainingLen}, numberOfEntries=${numberOfEntries} * token-len=${token.len}`);
  if (remainingLen === 0) {
    return [];
  }
  if (remainingLen !== numberOfEntries * token.len) {
    throw new Mp4ContentError("mismatch number-of-entries with remaining atom-length");
  }
  if (numberOfEntries > maxEntries) {
    throw new Mp4ContentError(`MP4 table entry count ${numberOfEntries} exceeds entry limit ${maxEntries}`);
  }
  const entries = [];
  for (let n = 0; n < numberOfEntries; ++n) {
    entries.push(token.get(buf, off));
    off += token.len;
  }
  return entries;
}
var import_debug16, debug16, Mp4ContentError, Header3, ExtendedSize, ftyp, FixedLengthAtom, SecondsSinceMacEpoch, SecondsSinceMacEpoch64, MdhdAtom, MvhdAtom, DataAtomHeader, NameAtom, TrackHeaderAtom, stsdHeader, SampleDescriptionTable, StsdAtom, SoundSampleDescriptionVersion, SoundSampleDescriptionV0, SimpleTableAtom, TimeToSampleToken, SttsAtom, SampleToChunkToken, StscAtom, StszAtom, StcoAtom, Co64Atom, ChapterText, ChapterListAtom, TrackFragmentHeaderBox, TrackRunBox, HandlerBox, ChapterTrackReferenceBox;
var init_AtomToken = __esm({
  "node_modules/music-metadata/lib/mp4/AtomToken.js"() {
    init_lib2();
    import_debug16 = __toESM(require_src(), 1);
    init_lib3();
    init_Allocation();
    init_FourCC();
    init_Util();
    init_ParseError();
    debug16 = (0, import_debug16.default)("music-metadata:parser:MP4:atom");
    Mp4ContentError = class extends makeUnexpectedFileContentError("MP4") {
    };
    Header3 = {
      len: 8,
      get: (buf, off) => {
        const length = UINT32_BE.get(buf, off);
        if (length < 0) {
          throw new Mp4ContentError("Invalid atom header length");
        }
        return {
          length: BigInt(length),
          name: new StringType(4, "latin1").get(buf, off + 4)
        };
      },
      put: (buf, off, hdr) => {
        UINT32_BE.put(buf, off, Number(hdr.length));
        return FourCcToken.put(buf, off + 4, hdr.name);
      }
    };
    ExtendedSize = UINT64_BE;
    ftyp = {
      len: 4,
      get: (buf, off) => {
        return {
          type: new StringType(4, "ascii").get(buf, off)
        };
      }
    };
    FixedLengthAtom = class {
      len;
      /**
       *
       * @param {number} len Length as specified in the size field
       * @param {number} expLen Total length of sum of specified fields in the standard
       * @param atomId Atom ID
       */
      constructor(len, expLen, atomId) {
        if (len < expLen) {
          throw new Mp4ContentError(`Atom ${atomId} expected to be ${expLen}, but specifies ${len} bytes long.`);
        }
        if (len > expLen) {
          debug16(`Warning: atom ${atomId} expected to be ${expLen}, but was actually ${len} bytes long.`);
        }
        this.len = len;
      }
    };
    SecondsSinceMacEpoch = {
      len: 4,
      get: (buf, off) => {
        const secondsSinceUnixEpoch = UINT32_BE.get(buf, off) - 2082844800;
        return new Date(secondsSinceUnixEpoch * 1e3);
      }
    };
    SecondsSinceMacEpoch64 = {
      len: 8,
      get: (buf, off) => {
        const secondsSinceUnixEpoch = Number(UINT64_BE.get(buf, off)) - 2082844800;
        return new Date(secondsSinceUnixEpoch * 1e3);
      }
    };
    MdhdAtom = class extends FixedLengthAtom {
      constructor(len) {
        super(len, 24, "mdhd");
      }
      get(buf, off) {
        const version = UINT8.get(buf, off);
        if (version !== 0 && version !== 1) {
          throw new FieldDecodingError("Invalid mdhd version header");
        }
        const tail = off + (version === 1 ? 32 : 20);
        return {
          ...readTimeHeader(buf, off),
          language: UINT16_BE.get(buf, tail),
          quality: UINT16_BE.get(buf, tail + 2)
        };
      }
    };
    MvhdAtom = class extends FixedLengthAtom {
      constructor(len) {
        super(len, 100, "mvhd");
      }
      get(buf, off) {
        const tail = off + (UINT8.get(buf, off) === 1 ? 32 : 20);
        return {
          ...readTimeHeader(buf, off),
          preferredRate: UINT32_BE.get(buf, tail),
          preferredVolume: UINT16_BE.get(buf, tail + 4),
          // Reserved (10 bytes) and matrix structure (36 bytes).
          previewTime: UINT32_BE.get(buf, tail + 52),
          previewDuration: UINT32_BE.get(buf, tail + 56),
          posterTime: UINT32_BE.get(buf, tail + 60),
          selectionTime: UINT32_BE.get(buf, tail + 64),
          selectionDuration: UINT32_BE.get(buf, tail + 68),
          currentTime: UINT32_BE.get(buf, tail + 72),
          nextTrackID: UINT32_BE.get(buf, tail + 76)
        };
      }
    };
    DataAtomHeader = {
      len: 8,
      get(buf, off) {
        if (off < 0 || buf.length - off < 8) {
          throw new Mp4ContentError("Truncated data atom header");
        }
        return {
          type: { set: UINT8.get(buf, off), type: UINT24_BE.get(buf, off + 1) },
          locale: UINT32_BE.get(buf, off + 4)
        };
      }
    };
    NameAtom = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        return {
          version: UINT8.get(buf, off),
          flags: UINT24_BE.get(buf, off + 1),
          name: new StringType(this.len - 4, "utf-8").get(buf, off + 4)
        };
      }
    };
    TrackHeaderAtom = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const available = Math.min(this.len, buf.length - off);
        if (available < 4) {
          throw new Mp4ContentError("Truncated tkhd header");
        }
        const version = UINT8.get(buf, off);
        if (version === 0 && available < 38 || version === 1 && available < 50) {
          throw new Mp4ContentError("Truncated tkhd header");
        }
        const flags = UINT24_BE.get(buf, off + 1);
        switch (version) {
          case 0:
            return {
              version,
              flags,
              creationTime: SecondsSinceMacEpoch.get(buf, off + 4),
              modificationTime: SecondsSinceMacEpoch.get(buf, off + 8),
              trackId: UINT32_BE.get(buf, off + 12),
              // reserved 4 bytes
              duration: UINT32_BE.get(buf, off + 20),
              // reserved 8 bytes
              layer: UINT16_BE.get(buf, off + 32),
              alternateGroup: UINT16_BE.get(buf, off + 34),
              volume: UINT16_BE.get(buf, off + 36),
              // ToDo: fixed point
              ...available >= 84 ? {
                displayWidth: UINT32_BE.get(buf, off + 76) / 65536,
                displayHeight: UINT32_BE.get(buf, off + 80) / 65536
              } : {}
            };
          case 1:
            return {
              version,
              flags,
              creationTime: SecondsSinceMacEpoch64.get(buf, off + 4),
              modificationTime: SecondsSinceMacEpoch64.get(buf, off + 12),
              trackId: UINT32_BE.get(buf, off + 20),
              // reserved 4 bytes
              duration: Number(UINT64_BE.get(buf, off + 28)),
              // reserved 8 bytes
              layer: UINT16_BE.get(buf, off + 44),
              alternateGroup: UINT16_BE.get(buf, off + 46),
              volume: UINT16_BE.get(buf, off + 48),
              // ToDo: fixed point
              ...available >= 96 ? {
                displayWidth: UINT32_BE.get(buf, off + 88) / 65536,
                displayHeight: UINT32_BE.get(buf, off + 92) / 65536
              } : {}
            };
          default:
            throw new FieldDecodingError("Invalid tkhd version header");
        }
      }
    };
    stsdHeader = {
      len: 8,
      get: (buf, off) => {
        return {
          version: UINT8.get(buf, off),
          flags: UINT24_BE.get(buf, off + 1),
          numberOfEntries: UINT32_BE.get(buf, off + 4)
        };
      }
    };
    SampleDescriptionTable = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const descrLen = this.len - 12;
        return {
          dataFormat: FourCcToken.get(buf, off),
          dataReferenceIndex: UINT16_BE.get(buf, off + 10),
          description: descrLen > 0 ? new Uint8ArrayType(descrLen).get(buf, off + 12) : void 0
        };
      }
    };
    StsdAtom = class {
      maxEntries;
      len;
      constructor(len, maxEntries = defaultMaxMetadataEntries) {
        this.maxEntries = maxEntries;
        this.len = len;
      }
      get(buf, off) {
        const end = Math.min(off + this.len, buf.length);
        if (end - off < stsdHeader.len) {
          throw new Mp4ContentError("Truncated stsd header");
        }
        const header = stsdHeader.get(buf, off);
        off += stsdHeader.len;
        const table = [];
        for (let n = 0; n < header.numberOfEntries; ++n) {
          if (end - off < UINT32_BE.len) {
            throw new Mp4ContentError("Truncated stsd sample entry");
          }
          const size = UINT32_BE.get(buf, off);
          if (size < 16 || size > end - off) {
            throw new Mp4ContentError(`Invalid stsd sample entry size: ${size}`);
          }
          if (n >= this.maxEntries) {
            throw new Mp4ContentError(`stsd entry count ${header.numberOfEntries} exceeds entry limit ${this.maxEntries}`);
          }
          off += UINT32_BE.len;
          table.push(new SampleDescriptionTable(size - UINT32_BE.len).get(buf, off));
          off += size - UINT32_BE.len;
        }
        return {
          header,
          table
        };
      }
    };
    SoundSampleDescriptionVersion = {
      len: 8,
      get(buf, off) {
        return {
          version: INT16_BE.get(buf, off),
          revision: INT16_BE.get(buf, off + 2),
          vendor: INT32_BE.get(buf, off + 4)
        };
      }
    };
    SoundSampleDescriptionV0 = {
      len: 12,
      get(buf, off) {
        return {
          numAudioChannels: INT16_BE.get(buf, off + 0),
          sampleSize: INT16_BE.get(buf, off + 2),
          compressionId: INT16_BE.get(buf, off + 4),
          packetSize: INT16_BE.get(buf, off + 6),
          sampleRate: UINT16_BE.get(buf, off + 8) + UINT16_BE.get(buf, off + 10) / 1e4
        };
      }
    };
    SimpleTableAtom = class {
      maxEntries;
      len;
      token;
      constructor(len, token, maxEntries = defaultMaxMetadataEntries) {
        this.maxEntries = maxEntries;
        this.len = len;
        this.token = token;
      }
      get(buf, off) {
        const nrOfEntries = INT32_BE.get(buf, off + 4);
        return {
          version: INT8.get(buf, off + 0),
          flags: INT24_BE.get(buf, off + 1),
          numberOfEntries: nrOfEntries,
          entries: readTokenTable(buf, this.token, off + 8, this.len - 8, nrOfEntries, this.maxEntries)
        };
      }
    };
    TimeToSampleToken = {
      len: 8,
      get(buf, off) {
        return {
          count: UINT32_BE.get(buf, off + 0),
          duration: UINT32_BE.get(buf, off + 4)
        };
      }
    };
    SttsAtom = class extends SimpleTableAtom {
      constructor(len, maxEntries) {
        super(len, TimeToSampleToken, maxEntries);
      }
    };
    SampleToChunkToken = {
      len: 12,
      get(buf, off) {
        return {
          firstChunk: UINT32_BE.get(buf, off),
          samplesPerChunk: UINT32_BE.get(buf, off + 4),
          sampleDescriptionId: UINT32_BE.get(buf, off + 8)
        };
      }
    };
    StscAtom = class extends SimpleTableAtom {
      constructor(len, maxEntries) {
        super(len, SampleToChunkToken, maxEntries);
      }
    };
    StszAtom = class {
      maxRetainedEntries;
      len;
      constructor(len, maxRetainedEntries = 0) {
        this.maxRetainedEntries = maxRetainedEntries;
        this.len = len;
      }
      get(buf, off) {
        if (this.len < 12) {
          throw new Mp4ContentError("Invalid stsz payload length");
        }
        const sampleSize = UINT32_BE.get(buf, off + 4);
        const numberOfEntries = UINT32_BE.get(buf, off + 8);
        const tableLength = this.len - 12;
        if (tableLength !== 0 && tableLength !== numberOfEntries * UINT32_BE.len) {
          throw new Mp4ContentError("mismatch number-of-entries with remaining atom-length");
        }
        const tableEntries = tableLength / UINT32_BE.len;
        const retainedCount = Math.min(tableEntries, this.maxRetainedEntries);
        const entries = [];
        let totalSize = sampleSize * numberOfEntries;
        for (let index = 0; index < tableEntries; ++index) {
          const size = UINT32_BE.get(buf, off + 12 + index * UINT32_BE.len);
          if (sampleSize === 0) {
            totalSize += size;
          }
          if (index < retainedCount) {
            entries.push(size);
          }
        }
        return {
          version: INT8.get(buf, off),
          flags: INT24_BE.get(buf, off + 1),
          sampleSize,
          numberOfEntries,
          totalSize: sampleSize > 0 || tableEntries > 0 ? totalSize : void 0,
          entries
        };
      }
    };
    StcoAtom = class extends SimpleTableAtom {
      constructor(len, maxEntries) {
        super(len, UINT32_BE, maxEntries);
      }
    };
    Co64Atom = class extends SimpleTableAtom {
      constructor(len, maxEntries) {
        super(len, {
          len: 8,
          get(buf, off) {
            const offset = UINT64_BE.get(buf, off);
            if (offset > BigInt(Number.MAX_SAFE_INTEGER)) {
              throw new Mp4ContentError("Chunk offset exceeds Number.MAX_SAFE_INTEGER");
            }
            return Number(offset);
          }
        }, maxEntries);
      }
    };
    ChapterText = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const available = Math.min(this.len, buf.length - off);
        if (available < 2) {
          return "";
        }
        const titleLen = Math.min(UINT16_BE.get(buf, off), available - 2);
        const bytes = buf.subarray(off + 2, off + 2 + titleLen);
        if (bytes[0] === 254 && bytes[1] === 255) {
          const littleEndian = new Uint8Array(bytes.length - 2);
          for (let i = 2; i + 1 < bytes.length; i += 2) {
            littleEndian[i - 2] = bytes[i + 1];
            littleEndian[i - 1] = bytes[i];
          }
          return textDecode(littleEndian, "utf-16le");
        }
        if (bytes[0] === 255 && bytes[1] === 254) {
          return textDecode(bytes.subarray(2), "utf-16le");
        }
        return textDecode(bytes);
      }
    };
    ChapterListAtom = class {
      len;
      maxChapters;
      onLimit;
      constructor(len, maxChapters = defaultMaxChapterCount, onLimit) {
        this.len = len;
        this.maxChapters = maxChapters;
        this.onLimit = onLimit;
      }
      get(buf, off) {
        const end = off + Math.min(this.len, buf.length - off);
        if (end - off < 5) {
          return [];
        }
        const version = UINT8.get(buf, off);
        if (version > 1) {
          throw new Mp4ContentError(`Unsupported chpl version: ${version}`);
        }
        let position = off + (version === 1 ? 8 : 4);
        if (position >= end) {
          return [];
        }
        const count = UINT8.get(buf, position++);
        if (count > this.maxChapters) {
          this.onLimit?.();
        }
        const chapters = [];
        for (let i = 0; i < Math.min(count, this.maxChapters) && position + 9 <= end; ++i) {
          const start = UINT64_BE.get(buf, position);
          const titleLength = UINT8.get(buf, position + 8);
          position += 9;
          if (position + titleLength > end) {
            break;
          }
          if (start > BigInt(Number.MAX_SAFE_INTEGER)) {
            throw new Mp4ContentError("Chapter start exceeds Number.MAX_SAFE_INTEGER");
          }
          chapters.push({
            title: textDecode(buf.subarray(position, position + titleLength)),
            start: Number(start),
            timeScale: 1e7
          });
          position += titleLength;
        }
        return chapters;
      }
    };
    TrackFragmentHeaderBox = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const flagOffset = off + 1;
        const header = {
          version: INT8.get(buf, off),
          flags: {
            baseDataOffsetPresent: getBit(buf, flagOffset + 2, 0),
            sampleDescriptionIndexPresent: getBit(buf, flagOffset + 2, 1),
            defaultSampleDurationPresent: getBit(buf, flagOffset + 2, 3),
            defaultSampleSizePresent: getBit(buf, flagOffset + 2, 4),
            defaultSampleFlagsPresent: getBit(buf, flagOffset + 2, 5),
            defaultDurationIsEmpty: getBit(buf, flagOffset, 0),
            defaultBaseIsMoof: getBit(buf, flagOffset, 1)
          },
          trackId: UINT32_BE.get(buf, 4)
        };
        let dynOffset = 8;
        if (header.flags.baseDataOffsetPresent) {
          header.baseDataOffset = UINT64_BE.get(buf, dynOffset);
          dynOffset += 8;
        }
        if (header.flags.sampleDescriptionIndexPresent) {
          header.sampleDescriptionIndex = UINT32_BE.get(buf, dynOffset);
          dynOffset += 4;
        }
        if (header.flags.defaultSampleDurationPresent) {
          header.defaultSampleDuration = UINT32_BE.get(buf, dynOffset);
          dynOffset += 4;
        }
        if (header.flags.defaultSampleSizePresent) {
          header.defaultSampleSize = UINT32_BE.get(buf, dynOffset);
          dynOffset += 4;
        }
        if (header.flags.defaultSampleFlagsPresent) {
          header.defaultSampleFlags = UINT32_BE.get(buf, dynOffset);
        }
        return header;
      }
    };
    TrackRunBox = class {
      maxSampleCount;
      len;
      constructor(len, maxSampleCount = defaultMaxMetadataEntries) {
        this.maxSampleCount = maxSampleCount;
        this.len = len;
      }
      get(buf, off) {
        const flagOffset = off + 1;
        const trun = {
          version: INT8.get(buf, off),
          flags: {
            dataOffsetPresent: getBit(buf, flagOffset + 2, 0),
            firstSampleFlagsPresent: getBit(buf, flagOffset + 2, 2),
            sampleDurationPresent: getBit(buf, flagOffset + 1, 0),
            sampleSizePresent: getBit(buf, flagOffset + 1, 1),
            sampleFlagsPresent: getBit(buf, flagOffset + 1, 2),
            sampleCompositionTimeOffsetsPresent: getBit(buf, flagOffset + 1, 3)
          },
          sampleCount: UINT32_BE.get(buf, off + 4),
          duration: 0,
          size: 0,
          timingComplete: true,
          explicitSampleCount: 0
        };
        let dynOffset = off + 8;
        if (trun.flags.dataOffsetPresent) {
          trun.dataOffset = UINT32_BE.get(buf, dynOffset);
          dynOffset += 4;
        }
        if (trun.flags.firstSampleFlagsPresent) {
          trun.firstSampleFlags = UINT32_BE.get(buf, dynOffset);
          dynOffset += 4;
        }
        const sampleFields = Number(trun.flags.sampleDurationPresent) + Number(trun.flags.sampleSizePresent) + Number(trun.flags.sampleFlagsPresent) + Number(trun.flags.sampleCompositionTimeOffsetsPresent);
        if (dynOffset + sampleFields * 4 * trun.sampleCount > off + this.len) {
          throw new Mp4ContentError("Invalid trun sample count");
        }
        if (sampleFields === 0) {
          return trun;
        }
        if (trun.sampleCount > this.maxSampleCount) {
          throw new Mp4ContentError(`trun sample count ${trun.sampleCount} exceeds entry limit ${this.maxSampleCount}`);
        }
        for (let n = 0; n < trun.sampleCount; ++n) {
          if (trun.flags.sampleDurationPresent) {
            const duration = UINT32_BE.get(buf, dynOffset);
            trun.duration += duration;
            trun.timingComplete &&= duration > 0;
            dynOffset += 4;
          }
          if (trun.flags.sampleSizePresent) {
            trun.size += UINT32_BE.get(buf, dynOffset);
            dynOffset += 4;
          }
          dynOffset += 4 * (Number(trun.flags.sampleFlagsPresent) + Number(trun.flags.sampleCompositionTimeOffsetsPresent));
        }
        trun.explicitSampleCount = trun.sampleCount;
        return trun;
      }
    };
    HandlerBox = class {
      len;
      constructor(len) {
        this.len = len;
      }
      get(buf, off) {
        const _flagOffset = off + 1;
        const charTypeToken = new StringType(4, "utf-8");
        return {
          version: INT8.get(buf, off),
          flags: UINT24_BE.get(buf, off + 1),
          componentType: charTypeToken.get(buf, off + 4),
          handlerType: charTypeToken.get(buf, off + 8),
          componentName: new StringType(this.len - 28, "utf-8").get(buf, off + 28)
        };
      }
    };
    ChapterTrackReferenceBox = class {
      maxEntries;
      len;
      constructor(len, maxEntries = defaultMaxMetadataEntries) {
        this.maxEntries = maxEntries;
        this.len = len;
      }
      get(buf, off) {
        if (this.len % UINT32_BE.len !== 0) {
          throw new Mp4ContentError("Invalid chapter track-reference length");
        }
        const count = this.len / UINT32_BE.len;
        if (count > this.maxEntries) {
          throw new Mp4ContentError(`Chapter track-reference count ${count} exceeds entry limit ${this.maxEntries}`);
        }
        let dynOffset = 0;
        const trackIds = [];
        while (dynOffset < this.len) {
          trackIds.push(UINT32_BE.get(buf, off + dynOffset));
          dynOffset += 4;
        }
        return trackIds;
      }
    };
  }
});

// node_modules/music-metadata/lib/mp4/Atom.js
var import_debug17, debug17, maxAtomDepth, Atom;
var init_Atom = __esm({
  "node_modules/music-metadata/lib/mp4/Atom.js"() {
    import_debug17 = __toESM(require_src(), 1);
    init_AtomToken();
    init_AtomToken();
    debug17 = (0, import_debug17.default)("music-metadata:parser:MP4:Atom");
    maxAtomDepth = 64;
    Atom = class _Atom {
      payloadLength;
      reserveAtom;
      static async readAtom(tokenizer, dataHandler, parent, remaining, reserveAtom = () => void 0) {
        let depth = 0;
        for (let ancestor = parent; ancestor; ancestor = ancestor.parent) {
          if (++depth >= maxAtomDepth) {
            throw new Mp4ContentError(`MP4 atom nesting exceeds limit ${maxAtomDepth}`);
          }
        }
        const offset = tokenizer.position;
        remaining = Math.min(remaining, (tokenizer.fileInfo.size ?? Number.POSITIVE_INFINITY) - offset);
        if (remaining < Header3.len) {
          throw new Mp4ContentError("Truncated atom header");
        }
        debug17(`Reading next token on offset=${offset}...`);
        const header = await tokenizer.readToken(Header3);
        const extended = header.length === 1n;
        if (extended) {
          if (remaining < 16) {
            throw new Mp4ContentError("Truncated extended atom header");
          }
          header.length = await tokenizer.readToken(ExtendedSize);
        }
        const headerLength = extended ? 16 : 8;
        if ((extended || header.length !== 0n) && header.length < BigInt(headerLength)) {
          throw new Mp4ContentError(`Invalid atom size: ${header.length}`);
        }
        if (header.length > BigInt(Number.MAX_SAFE_INTEGER)) {
          throw new Mp4ContentError(`Atom size exceeds Number.MAX_SAFE_INTEGER: ${header.length}`);
        }
        const length = header.length === 0n ? remaining : Number(header.length);
        if (length > remaining) {
          throw new Mp4ContentError(`Atom size exceeds remaining bytes: ${header.length} > ${remaining}`);
        }
        const payloadLength = length - headerLength;
        reserveAtom();
        const atomBean = new _Atom(header, extended, parent, payloadLength, reserveAtom);
        debug17(`parse atom name=${atomBean.atomPath}, extended=${atomBean.extended}, offset=${offset}, len=${atomBean.header.length}`);
        await atomBean.readData(tokenizer, dataHandler, payloadLength);
        return atomBean;
      }
      atomPath;
      header;
      extended;
      parent;
      constructor(header, extended, parent, payloadLength, reserveAtom = () => void 0) {
        this.payloadLength = payloadLength;
        this.reserveAtom = reserveAtom;
        this.header = header;
        this.extended = extended;
        this.parent = parent;
        this.atomPath = (this.parent ? `${this.parent.atomPath}.` : "") + this.header.name;
      }
      getHeaderLength() {
        return this.extended ? 16 : 8;
      }
      getPayloadLength() {
        return this.payloadLength;
      }
      async readAtoms(tokenizer, dataHandler, size) {
        while (size > 0) {
          if (size === Number.POSITIVE_INFINITY) {
            const bytesRead = await tokenizer.peekBuffer(new Uint8Array(Header3.len), { mayBeLess: true });
            if (bytesRead === 0) {
              return;
            }
            if (bytesRead < Header3.len) {
              throw new Mp4ContentError("Truncated atom header");
            }
          }
          const atomBean = await _Atom.readAtom(tokenizer, dataHandler, this, size, this.reserveAtom);
          size = atomBean.header.length === 0n ? 0 : size - Number(atomBean.header.length);
        }
      }
      async readData(tokenizer, dataHandler, remaining) {
        switch (this.header.name) {
          // "Container" atoms, contains nested atoms
          case "moov":
          // The Movie Atom: contains other atoms
          case "udta":
          // User defined atom
          case "mdia":
          // Media atom
          case "minf":
          // Media Information Atom
          case "stbl":
          // The Sample Table Atom
          case "<id>":
          case "ilst":
          case "tref":
          case "mvex":
          case "moof":
            return this.readAtoms(tokenizer, dataHandler, remaining);
          case "meta": {
            if (remaining < 8) {
              throw new Mp4ContentError("Truncated meta atom");
            }
            const peekHeader = await tokenizer.peekToken(Header3);
            const paddingLength = peekHeader.name === "hdlr" ? 0 : 4;
            await tokenizer.ignore(paddingLength);
            return this.readAtoms(tokenizer, dataHandler, remaining - paddingLength);
          }
          default:
            return dataHandler(this, remaining);
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/mp4/MP4Parser.js
var MP4Parser_exports = {};
__export(MP4Parser_exports, {
  MP4Parser: () => MP4Parser
});
function supportsSeeking(tokenizer) {
  return tokenizer.supportsRandomAccess() && "setPosition" in tokenizer && typeof tokenizer.setPosition === "function";
}
function isAudioTrack(track) {
  const [ssd] = track.soundSampleDescription ?? [];
  if (!ssd) {
    return false;
  }
  if (track.handler) {
    return track.handler.handlerType === "soun" || track.handler.handlerType === "audi";
  }
  return !!ssd.description && ssd.description.numAudioChannels > 0;
}
var import_debug18, debug18, tagFormat2, maxChapterTitleBytes, encoderDict, MP4Parser;
var init_MP4Parser = __esm({
  "node_modules/music-metadata/lib/mp4/MP4Parser.js"() {
    init_lib2();
    import_debug18 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_uint8array_extras();
    init_Allocation();
    init_BasicParser();
    init_ID3v1Parser();
    init_type();
    init_Atom();
    init_AtomToken();
    init_AtomToken();
    debug18 = (0, import_debug18.default)("music-metadata:parser:MP4");
    tagFormat2 = "iTunes";
    maxChapterTitleBytes = 64 * 1024;
    encoderDict = {
      raw: {
        lossy: false,
        format: "raw"
      },
      MAC3: {
        lossy: true,
        format: "MACE 3:1"
      },
      MAC6: {
        lossy: true,
        format: "MACE 6:1"
      },
      ima4: {
        lossy: true,
        format: "IMA 4:1"
      },
      ulaw: {
        lossy: true,
        format: "uLaw 2:1"
      },
      alaw: {
        lossy: true,
        format: "uLaw 2:1"
      },
      Qclp: {
        lossy: true,
        format: "QUALCOMM PureVoice"
      },
      ".mp3": {
        lossy: true,
        format: "MPEG-1 layer 3"
      },
      alac: {
        lossy: false,
        format: "ALAC"
      },
      "ac-3": {
        lossy: true,
        format: "AC-3"
      },
      mp4a: {
        lossy: true,
        format: "MPEG-4/AAC"
      },
      mp4s: {
        lossy: true,
        format: "MP4S"
      },
      // Closed Captioning Media, https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap3/qtff3.html#//apple_ref/doc/uid/TP40000939-CH205-SW87
      c608: {
        lossy: true,
        format: "CEA-608"
      },
      c708: {
        lossy: true,
        format: "CEA-708"
      }
    };
    MP4Parser = class _MP4Parser extends BasicParser {
      maxChapterCount = getMaxChapterCount(this.options);
      static read_BE_Integer(array, signed) {
        const integerType = (signed ? "INT" : "UINT") + array.length * 8 + (array.length > 1 ? "_BE" : "");
        const token = lib_exports[integerType];
        if (!token) {
          throw new Mp4ContentError(`Token for integer type not found: "${integerType}"`);
        }
        return Number(token.get(array, 0));
      }
      // Metadata and sample tables are buffered; media data is skipped separately.
      // A bound is also necessary for streams whose total size is unknown.
      validatePayloadLength(length) {
        validateAllocation(length, this.options, (message) => new Mp4ContentError(message));
      }
      async readToken(token, position) {
        return readToken(this.tokenizer, token, this.options, position, (message) => new Mp4ContentError(message));
      }
      movieHeader;
      trackDefaults = /* @__PURE__ */ new Map();
      tracks = /* @__PURE__ */ new Map();
      mediaDataRanges = [];
      streamedChapters = /* @__PURE__ */ new Map();
      streamedChapterCount;
      neroChapters = [];
      hasVideoTrack = false;
      hasAudioTrack = false;
      remainingAtoms = 0;
      maxMetadataEntries = 0;
      metadataKeys = /* @__PURE__ */ new WeakMap();
      pendingTags = [];
      async parse() {
        this.hasVideoTrack = false;
        this.hasAudioTrack = false;
        this.maxMetadataEntries = getMaxMetadataEntries(this.options);
        this.remainingAtoms = this.maxMetadataEntries;
        this.tracks.clear();
        this.mediaDataRanges = [];
        this.streamedChapters.clear();
        this.streamedChapterCount = void 0;
        this.neroChapters = [];
        this.trackDefaults.clear();
        this.movieHeader = void 0;
        this.pendingTags = [];
        this.metadataKeys = /* @__PURE__ */ new WeakMap();
        let remainingFileSize = this.tokenizer.fileInfo.size ?? Number.POSITIVE_INFINITY;
        while (remainingFileSize > 0) {
          try {
            const token = await this.tokenizer.peekToken(Header3);
            if (token.name === "\0\0\0\0") {
              const errMsg = `Error at offset=${this.tokenizer.position}: box.id=0`;
              debug18(errMsg);
              this.addWarning(errMsg);
              break;
            }
          } catch (error) {
            if (error instanceof Error) {
              const errMsg = `Error at offset=${this.tokenizer.position}: ${error.message}`;
              debug18(errMsg);
              this.addWarning(errMsg);
            } else {
              throw error;
            }
            break;
          }
          const atomsBeforeRoot = this.remainingAtoms;
          const rootAtom = await Atom.readAtom(this.tokenizer, (atom, remaining) => this.handleAtom(atom, remaining), null, remainingFileSize, () => this.reserveAtom());
          this.remainingAtoms = atomsBeforeRoot;
          remainingFileSize = rootAtom.header.length === 0n ? 0 : remainingFileSize - Number(rootAtom.header.length);
          for (const tag of this.pendingTags) {
            let id = tag.id;
            if (tag.scope && id.length === 4 && id.charCodeAt(0) === 0) {
              const index = [...id].reduce((value, character) => value * 256 + character.charCodeAt(0), 0);
              const key = this.metadataKeys.get(tag.scope)?.[index - 1];
              if (key !== void 0) {
                id = key;
              } else {
                this.addWarning(`Unresolved MP4 metadata key index ${index}`);
              }
            }
            await this.metadata.addTag(tagFormat2, id, tag.value);
          }
          this.pendingTags = [];
          this.metadataKeys = /* @__PURE__ */ new WeakMap();
        }
        if (this.mediaDataRanges.length > 0 && supportsSeeking(this.tokenizer)) {
          const tokenizer = this.tokenizer;
          const position = tokenizer.position;
          try {
            await this.parseChapters(this.mediaDataRanges);
          } finally {
            tokenizer.setPosition(position);
          }
        }
        if (this.streamedChapterCount !== void 0 && this.streamedChapters.size !== this.streamedChapterCount) {
          if (this.neroChapters.length === 0) {
            throw new Mp4ContentError("Chapter chunk exceeding media data bounds");
          }
          this.addWarning("Cannot read chapter track: Chapter chunk exceeding media data bounds");
        }
        if (this.options.includeChapters && this.neroChapters.length > 0 && !this.metadata.format.chapters?.some((chapter) => chapter.title)) {
          this.metadata.setFormat("chapters", this.neroChapters);
        }
        const formatList = [];
        this.tracks.forEach((track) => {
          const trackFormats = [];
          for (const ssd of track.soundSampleDescription) {
            const encoderInfo = ssd.encoder ?? encoderDict[ssd.dataFormat];
            if (encoderInfo) {
              trackFormats.push(encoderInfo.format);
            }
          }
          if (trackFormats.length >= 1) {
            formatList.push(trackFormats.join("/"));
          }
        });
        if (formatList.length > 0) {
          this.metadata.setFormat("codec", [...new Set(formatList)].join("+"));
        }
        const audioTracks = [...this.tracks.values()].filter(isAudioTrack);
        for (const track of this.tracks.values()) {
          this.calculateTrackTiming(track);
        }
        for (const audioTrack of audioTracks) {
          const ssd = audioTrack.soundSampleDescription[0];
          if (ssd.description && audioTrack.media.header) {
            this.metadata.setFormat("sampleRate", ssd.description.sampleRate);
            this.metadata.setFormat("bitsPerSample", ssd.description.sampleSize);
            this.metadata.setFormat("numberOfChannels", ssd.description.numAudioChannels);
            if (audioTrack.media.header.timeScale === 0 && audioTrack.timeToSampleTable.length > 0 && ssd.description.sampleRate > 0) {
              const totalSampleSize = audioTrack.timeToSampleTable.map((ttstEntry) => ttstEntry.count * ttstEntry.duration).reduce((total, sampleSize) => total + sampleSize);
              audioTrack.duration = totalSampleSize / ssd.description.sampleRate;
            }
          }
          const encoderInfo = ssd.encoder ?? encoderDict[ssd.dataFormat];
          if (encoderInfo) {
            this.metadata.setFormat("lossless", !encoderInfo.lossy);
          }
        }
        if (audioTracks.length >= 1) {
          const firstAudioTrack = audioTracks[0];
          if (firstAudioTrack.duration) {
            this.metadata.setFormat("duration", firstAudioTrack.duration);
            if (firstAudioTrack.sizeInBytes) {
              this.metadata.setFormat("bitrate", 8 * firstAudioTrack.sizeInBytes / firstAudioTrack.duration);
            }
          }
        }
        for (const track of this.tracks.values()) {
          this.metadata.addStreamInfo(this.getTrackInfo(track));
        }
        this.metadata.setFormat("hasAudio", this.hasAudioTrack || audioTracks.length > 0);
        this.metadata.setFormat("hasVideo", this.hasVideoTrack);
        const movieDuration = this.getDuration(this.movieHeader);
        if (movieDuration !== void 0) {
          this.metadata.setFormat("containerDuration", movieDuration);
        } else {
          const endTimes = [...this.tracks.values()].filter((track) => isAudioTrack(track) || track.handler?.handlerType === "vide").map((track) => track.endTime);
          if (endTimes.length > 0 && endTimes.every((endTime) => endTime !== void 0)) {
            this.metadata.setFormat("containerDuration", endTimes.reduce((maximum, endTime) => Math.max(maximum, endTime), 0));
          }
        }
      }
      async handleAtom(atom, remaining) {
        if (atom.header.name === "keys" && atom.parent?.header.name === "meta") {
          return this.parseMetadataKeys(atom.parent, remaining);
        }
        if (atom.parent) {
          switch (atom.parent.header.name) {
            case "ilst":
            case "<id>":
              return this.parseMetadataItemData(atom);
            case "moov":
              switch (atom.header.name) {
                case "trak":
                  return this.parseTrackBox(atom);
                case "udta":
                  return this.parseTrackBox(atom);
              }
              break;
            case "moof":
              switch (atom.header.name) {
                case "traf":
                  return this.parseTrackFragmentBox(atom);
              }
          }
        }
        if (["chap", "stsd", "stsz"].includes(atom.header.name)) {
          this.validatePayloadLength(remaining);
          if (atom.header.name === "stsd") {
            await this.readToken(new StsdAtom(remaining, getMaxMetadataEntries(this.options)));
          } else if (atom.header.name === "stsz") {
            await this.readToken(new StszAtom(remaining));
          } else {
            await this.tokenizer.ignore(remaining);
          }
          this.addWarning(`Ignoring track-specific atom ${atom.atomPath} outside a track`);
          return;
        }
        if (this.atomParsers[atom.header.name]) {
          if (atom.header.name !== "mdat") {
            this.validatePayloadLength(remaining);
          }
          return this.atomParsers[atom.header.name](remaining);
        }
        debug18(`No parser for atom path=${atom.atomPath}, payload-len=${remaining}, ignoring atom`);
        await this.tokenizer.ignore(remaining);
      }
      reserveAtom() {
        if (this.remainingAtoms === 0) {
          throw new Mp4ContentError("MP4 atom count exceeds entry limit");
        }
        --this.remainingAtoms;
      }
      assertRetainedEntryCapacity(count, collection) {
        if (count >= this.maxMetadataEntries) {
          throw new Mp4ContentError(`${collection} count exceeds entry limit ${this.maxMetadataEntries}`);
        }
      }
      async addTag(id, value, scope) {
        this.assertRetainedEntryCapacity(this.pendingTags.length, "MP4 metadata value");
        this.pendingTags.push({ id, value, scope });
      }
      async parseMetadataKeys(scope, length) {
        if (length < 8) {
          throw new Mp4ContentError("Truncated metadata keys header");
        }
        const data = await this.readToken(new Uint8ArrayType(length));
        if (UINT32_BE.get(data, 0) !== 0) {
          throw new Mp4ContentError("Unsupported metadata keys version or flags");
        }
        const count = UINT32_BE.get(data, 4);
        if (count > this.maxMetadataEntries || count > Math.floor((length - 8) / 8)) {
          throw new Mp4ContentError("Metadata keys count exceeds entry limit or payload bounds");
        }
        const keys = [];
        let offset = 8;
        for (let index = 0; index < count; ++index) {
          if (offset + 8 > length) {
            throw new Mp4ContentError("Truncated metadata key entry");
          }
          const size = UINT32_BE.get(data, offset);
          if (size < 8 || size > length - offset) {
            throw new Mp4ContentError("Invalid metadata key entry size");
          }
          const namespace = new StringType(4, "latin1").get(data, offset + 4);
          keys.push(`${namespace}:${textDecode(data.subarray(offset + 8, offset + size))}`);
          offset += size;
        }
        if (offset !== length) {
          throw new Mp4ContentError("Unexpected bytes after metadata keys");
        }
        if (this.metadataKeys.has(scope)) {
          this.addWarning("Duplicate MP4 metadata keys table; keeping the first table");
        } else {
          this.metadataKeys.set(scope, keys);
        }
      }
      addWarning(message) {
        debug18(`Warning: ${message}`);
        this.metadata.addWarning(message);
      }
      /**
       * Parse data of Meta-item-list-atom (item of 'ilst' atom)
       * @param metaAtom
       * Ref: https://developer.apple.com/library/content/documentation/QuickTime/QTFF/Metadata/Metadata.html#//apple_ref/doc/uid/TP40000939-CH1-SW8
       */
      parseMetadataItemData(metaAtom) {
        let tagKey = metaAtom.header.name;
        let scope = metaAtom.parent;
        while (scope && scope.header.name !== "meta") {
          scope = scope.parent;
        }
        const indexed = scope !== null && tagKey.charCodeAt(0) === 0;
        return metaAtom.readAtoms(this.tokenizer, async (child) => {
          const payLoadLength = child.getPayloadLength();
          switch (child.header.name) {
            case "data":
              return this.parseValueAtom(tagKey, child, scope ?? void 0);
            case "name":
            // name atom (optional)
            case "mean":
            case "rate": {
              const name = await this.readToken(new NameAtom(payLoadLength));
              if (!indexed) {
                tagKey += `:${name.name}`;
              }
              break;
            }
            default: {
              const uint8Array = await this.readToken(new Uint8ArrayType(payLoadLength));
              this.addWarning(`Unsupported meta-item: ${tagKey}[${child.header.name}] => value=${uint8ArrayToHex(uint8Array)} ascii=${textDecode(uint8Array, "ascii")}`);
            }
          }
        }, metaAtom.getPayloadLength());
      }
      async parseValueAtom(tagKey, metaAtom, scope) {
        const length = metaAtom.getPayloadLength();
        if (length < DataAtomHeader.len) {
          throw new Mp4ContentError("Truncated data atom header");
        }
        const header = await this.readToken(DataAtomHeader);
        if (header.type.set !== 0) {
          throw new Mp4ContentError(`Unsupported type-set != 0: ${header.type.set}`);
        }
        const bodyLength = length - DataAtomHeader.len;
        if (this.options.skipCovers && (header.type.type === 13 || header.type.type === 14)) {
          const body = createTokenizerView(this.tokenizer, bodyLength);
          try {
            await body.consumeRemainder();
          } finally {
            await body.close();
          }
          return;
        }
        this.validatePayloadLength(length);
        const dataAtom = { ...header, value: await this.readToken(new Uint8ArrayType(bodyLength)) };
        switch (dataAtom.type.type) {
          case 0:
            switch (tagKey) {
              case "trkn":
              case "disk": {
                const num = UINT8.get(dataAtom.value, 3);
                const of = UINT8.get(dataAtom.value, 5);
                await this.addTag(tagKey, `${num}/${of}`, scope);
                break;
              }
              case "gnre": {
                const genreInt = UINT8.get(dataAtom.value, 1);
                const genreStr = Genres[genreInt - 1];
                await this.addTag(tagKey, genreStr, scope);
                break;
              }
              case "rate": {
                const rate = textDecode(dataAtom.value, "ascii");
                await this.addTag(tagKey, rate, scope);
                break;
              }
              default:
                debug18(`unknown proprietary value type for: ${metaAtom.atomPath}`);
            }
            break;
          case 1:
          // UTF-8: Without any count or NULL terminator
          case 18:
            await this.addTag(tagKey, textDecode(dataAtom.value), scope);
            break;
          case 13:
            await this.addTag(tagKey, {
              format: "image/jpeg",
              data: Uint8Array.from(dataAtom.value)
            }, scope);
            break;
          case 14:
            await this.addTag(tagKey, {
              format: "image/png",
              data: Uint8Array.from(dataAtom.value)
            }, scope);
            break;
          case 21:
            await this.addTag(tagKey, _MP4Parser.read_BE_Integer(dataAtom.value, true), scope);
            break;
          case 22:
            await this.addTag(tagKey, _MP4Parser.read_BE_Integer(dataAtom.value, false), scope);
            break;
          case 65:
            await this.addTag(tagKey, INT8.get(dataAtom.value, 0), scope);
            break;
          case 66:
            await this.addTag(tagKey, INT16_BE.get(dataAtom.value, 0), scope);
            break;
          case 67:
            await this.addTag(tagKey, INT32_BE.get(dataAtom.value, 0), scope);
            break;
          default:
            this.addWarning(`atom key=${tagKey}, has unknown well-known-type (data-type): ${dataAtom.type.type}`);
        }
      }
      getDuration(header) {
        if (header && header.timeScale > 0 && header.duration > 0 && header.duration !== 4294967295 && header.duration !== Number(0xffffffffffffffffn)) {
          return header.duration / header.timeScale;
        }
        return void 0;
      }
      calculateTrackTiming(track) {
        const timeScale = track.media.header?.timeScale;
        track.duration = this.getDuration(track.media.header);
        track.endTime = track.duration;
        let sampleCount = track.timeToSampleTable.reduce((sum, entry) => sum + entry.count, 0);
        let timeUnits = track.timeToSampleTable.reduce((sum, entry) => sum + entry.count * entry.duration, 0);
        const fragments = track.fragmentStatistics;
        if (fragments) {
          const size = (track.sizeInBytes ?? 0) + fragments.size;
          const sizesComplete = (track.sampleCount === 0 || track.sizeInBytes !== void 0) && fragments.sizesComplete;
          sampleCount += fragments.sampleCount;
          if (sizesComplete && Number.isSafeInteger(size)) {
            track.sizeInBytes = size;
          } else {
            track.sizeInBytes = void 0;
          }
          if (fragments.timingComplete && timeScale && fragments.start !== void 0 && Number.isSafeInteger(fragments.end)) {
            timeUnits += fragments.end - fragments.start;
            track.duration = Math.max(track.duration ?? 0, timeUnits / timeScale);
            track.endTime = Math.max(fragments.end / timeScale, track.duration);
          } else {
            timeUnits = 0;
          }
        } else if (track.duration === void 0 && timeScale && timeUnits > 0) {
          track.duration = timeUnits / timeScale;
          track.endTime = track.duration;
        }
        if (timeScale && timeUnits > 0 && sampleCount > 0 && Number.isSafeInteger(sampleCount)) {
          track.frameRate = sampleCount * timeScale / timeUnits;
        }
        if (track.duration === void 0 && this.movieHeader && track.header.duration > 0 && track.header.duration !== 4294967295 && track.header.duration !== Number(0xffffffffffffffffn) && this.movieHeader.timeScale > 0) {
          track.duration = track.header.duration / this.movieHeader.timeScale;
          track.endTime = track.duration;
        }
      }
      aggregateFragment(track, header, run, decodeTime) {
        if (run.sampleCount === 0) {
          return;
        }
        const defaults = this.trackDefaults.get(track.header.trackId);
        const fragments = track.fragmentStatistics ??= {
          cursor: track.timeToSampleTable.reduce((sum, entry) => sum + entry.count * entry.duration, 0),
          end: 0,
          sampleCount: 0,
          size: 0,
          timingComplete: true,
          sizesComplete: true
        };
        fragments.cursor = decodeTime ?? fragments.cursor;
        fragments.start = fragments.start === void 0 ? fragments.cursor : Math.min(fragments.start, fragments.cursor);
        const defaultDuration = header.defaultSampleDuration ?? defaults?.duration;
        const defaultSize = header.defaultSampleSize ?? defaults?.size;
        if (run.flags.sampleDurationPresent) {
          fragments.cursor += run.duration;
          fragments.timingComplete &&= run.timingComplete;
        } else if (defaultDuration !== void 0 && defaultDuration > 0) {
          fragments.cursor += defaultDuration * run.sampleCount;
        } else {
          fragments.timingComplete = false;
        }
        if (run.flags.sampleSizePresent) {
          fragments.size += run.size;
        } else if (defaultSize !== void 0) {
          fragments.size += defaultSize * run.sampleCount;
        } else {
          fragments.sizesComplete = false;
        }
        fragments.sampleCount += run.sampleCount;
        fragments.end = Math.max(fragments.end, fragments.cursor);
      }
      getTrackInfo(track) {
        const info = {
          id: track.header.trackId,
          flagEnabled: (track.header.flags & 1) !== 0
        };
        switch (track.handler?.handlerType) {
          case "soun":
          case "audi":
            info.type = TrackType.audio;
            break;
          case "vide":
            info.type = TrackType.video;
            break;
          case "text":
          case "sbtl":
          case "subt":
          case "clcp":
            info.type = TrackType.subtitle;
            break;
          case "meta":
          case "mdta":
            info.type = TrackType.metadata;
            break;
          default:
            if (isAudioTrack(track)) {
              info.type = TrackType.audio;
            }
        }
        const mediaHeader = track.media.header;
        if (mediaHeader) {
          const letters = [10, 5, 0].map((shift) => mediaHeader.language >> shift & 31);
          if (letters.every((letter) => letter >= 1 && letter <= 26)) {
            info.language = String.fromCharCode(...letters.map((letter) => letter + 96));
          }
        }
        if (track.duration !== void 0) {
          info.duration = track.duration;
        }
        const size = track.sizeInBytes;
        if (size !== void 0 && info.duration && info.duration > 0) {
          info.bitrate = 8 * size / info.duration;
        }
        const ssd = track.soundSampleDescription[0];
        if (ssd) {
          info.codecId = ssd.dataFormat;
          const encoder = ssd.encoder ?? encoderDict[ssd.dataFormat];
          info.codecName = encoder?.format ?? `<${ssd.dataFormat}>`;
          if (info.type === TrackType.audio) {
            if (encoder) {
              info.lossless = !encoder.lossy;
            }
            if (ssd.description) {
              info.audio = {};
              if (ssd.description.sampleRate > 0) {
                info.audio.samplingFrequency = ssd.description.sampleRate;
              }
              if (ssd.description.numAudioChannels > 0) {
                info.audio.channels = ssd.description.numAudioChannels;
              }
              if (ssd.description.sampleSize && ssd.description.sampleSize > 0) {
                info.audio.bitDepth = ssd.description.sampleSize;
              }
            }
          }
        }
        const description = track.sampleDescriptions?.[0]?.description;
        if (info.type === TrackType.video) {
          info.video = {};
          if (track.frameRate !== void 0) {
            info.video.frameRate = track.frameRate;
          }
          if (track.header.displayWidth && track.header.displayHeight) {
            info.video.displayWidth = track.header.displayWidth;
            info.video.displayHeight = track.header.displayHeight;
          }
        }
        if (info.video && description && description.length >= 20) {
          const pixelWidth = UINT16_BE.get(description, 16);
          const pixelHeight = UINT16_BE.get(description, 18);
          if (pixelWidth > 0 && pixelHeight > 0) {
            info.video.pixelWidth = pixelWidth;
            info.video.pixelHeight = pixelHeight;
          }
        }
        return info;
      }
      async parseTrackBox(trakBox) {
        const track = {
          media: {},
          soundSampleDescription: [],
          chunkOffsetTable: [],
          sampleSize: 0,
          sampleCount: 0,
          sampleSizeTable: [],
          sampleToChunkTable: [],
          timeToSampleTable: []
        };
        await trakBox.readAtoms(this.tokenizer, async (child) => {
          const payLoadLength = child.getPayloadLength();
          switch (child.header.name) {
            case "chap": {
              const chap = await this.readToken(new ChapterTrackReferenceBox(payLoadLength, getMaxMetadataEntries(this.options)));
              track.chapterList = chap;
              break;
            }
            case "tkhd":
              track.header = await this.readToken(new TrackHeaderAtom(payLoadLength));
              break;
            case "hdlr":
              if (child.parent?.header.name !== "mdia" || child.parent.parent !== trakBox) {
                await this.tokenizer.ignore(payLoadLength);
                break;
              }
              track.handler = await this.readToken(new HandlerBox(payLoadLength));
              if (track.handler.handlerType === "audi" || track.handler.handlerType === "soun") {
                this.hasAudioTrack = true;
              } else if (track.handler.handlerType === "vide") {
                this.hasVideoTrack = true;
              }
              break;
            case "mdhd": {
              const mdhd_data = await this.readToken(new MdhdAtom(payLoadLength));
              track.media.header = mdhd_data;
              break;
            }
            case "stco":
            case "co64": {
              const token = child.header.name === "co64" ? new Co64Atom(payLoadLength, getMaxMetadataEntries(this.options)) : new StcoAtom(payLoadLength, getMaxMetadataEntries(this.options));
              const stco = await this.readToken(token);
              track.chunkOffsetTable = stco.entries;
              break;
            }
            case "stsc": {
              const stsc = await this.readToken(new StscAtom(payLoadLength, getMaxMetadataEntries(this.options)));
              track.sampleToChunkTable = stsc.entries;
              break;
            }
            case "stsd": {
              const stsd = await this.readToken(new StsdAtom(payLoadLength, getMaxMetadataEntries(this.options)));
              track.sampleDescriptions = stsd.table;
              track.soundSampleDescription = stsd.table.map((dfEntry) => this.parseSoundSampleDescription(dfEntry));
              break;
            }
            case "stts": {
              const stts = await this.readToken(new SttsAtom(payLoadLength, getMaxMetadataEntries(this.options)));
              track.timeToSampleTable = stts.entries;
              break;
            }
            case "stsz": {
              const stsz = await this.readToken(new StszAtom(payLoadLength, this.options.includeChapters ? this.maxChapterCount : 0));
              track.sampleSize = stsz.sampleSize;
              track.sampleCount = stsz.numberOfEntries;
              track.sampleSizeTable = stsz.entries;
              track.sizeInBytes = stsz.totalSize;
              break;
            }
            case "dinf":
            case "vmhd":
            case "smhd":
              debug18(`Ignoring: ${child.header.name}`);
              await this.tokenizer.ignore(payLoadLength);
              break;
            default: {
              if (child.parent?.header.name === "ilst" || child.parent?.header.name === "<id>" || child.header.name === "keys" && child.parent?.header.name === "meta") {
                await this.handleAtom(child, payLoadLength);
                break;
              }
              debug18(`Unexpected track box: ${child.header.name}`);
              await this.tokenizer.ignore(payLoadLength);
            }
          }
        }, trakBox.getPayloadLength());
        if (track.header) {
          if (!this.tracks.has(track.header.trackId)) {
            this.assertRetainedEntryCapacity(this.tracks.size, "MP4 track");
          }
          this.tracks.set(track.header.trackId, { ...track, header: track.header });
        }
      }
      async parseTrackFragmentBox(trafBox) {
        let tfhd;
        let decodeTime;
        const runs = [];
        let remainingSamples = this.maxMetadataEntries;
        await trafBox.readAtoms(this.tokenizer, async (child) => {
          const length = child.getPayloadLength();
          switch (child.header.name) {
            case "tfhd":
              tfhd = await this.readToken(new TrackFragmentHeaderBox(length));
              break;
            case "tfdt": {
              const data = await this.readToken(new Uint8ArrayType(length));
              if (length < 4 || data[0] === 0 && length < 8 || data[0] === 1 && length < 12) {
                throw new Mp4ContentError("Truncated tfdt box");
              }
              if (data[0] === 0) {
                decodeTime = UINT32_BE.get(data, 4);
              } else if (data[0] === 1) {
                decodeTime = Number(UINT64_BE.get(data, 4));
              } else {
                throw new Mp4ContentError("Invalid tfdt version");
              }
              if (!Number.isSafeInteger(decodeTime)) {
                throw new Mp4ContentError("Unsafe tfdt decode time");
              }
              break;
            }
            case "trun": {
              const run = await this.readToken(new TrackRunBox(length, remainingSamples));
              remainingSamples -= run.explicitSampleCount;
              runs.push(run);
              break;
            }
            default:
              await this.tokenizer.ignore(length);
          }
        }, trafBox.getPayloadLength());
        if (tfhd) {
          const track = this.tracks.get(tfhd.trackId);
          for (const run of runs) {
            if (track) {
              this.aggregateFragment(track, tfhd, run, decodeTime);
            }
            decodeTime = void 0;
          }
        }
      }
      atomParsers = {
        /**
         * Parse movie header (mvhd) atom
         * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap2/qtff2.html#//apple_ref/doc/uid/TP40000939-CH204-56313
         */
        mvhd: async (len) => {
          const mvhd = await this.readToken(new MvhdAtom(len));
          this.movieHeader = mvhd;
          this.metadata.setFormat("creationTime", mvhd.creationTime);
          this.metadata.setFormat("modificationTime", mvhd.modificationTime);
        },
        chpl: async (len) => {
          if (this.options.includeChapters) {
            this.neroChapters = await this.readToken(new ChapterListAtom(len, this.maxChapterCount, () => {
              this.addWarning(`Chapter count exceeds the ${this.maxChapterCount} chapter limit`);
            }));
          } else {
            await this.tokenizer.ignore(len);
          }
        },
        trex: async (len) => {
          const data = await this.readToken(new Uint8ArrayType(len));
          if (len < 24) {
            throw new Mp4ContentError("Truncated trex box");
          }
          const trackId = UINT32_BE.get(data, 4);
          if (!this.trackDefaults.has(trackId)) {
            this.assertRetainedEntryCapacity(this.trackDefaults.size, "MP4 track-default");
          }
          this.trackDefaults.set(trackId, {
            duration: UINT32_BE.get(data, 12),
            size: UINT32_BE.get(data, 16)
          });
        },
        /**
         * Parse mdat atom.
         * Will scan for chapters
         */
        mdat: async (len) => {
          const range = { offset: this.tokenizer.position, end: this.tokenizer.position + len };
          if (this.options.includeChapters) {
            if (supportsSeeking(this.tokenizer)) {
              this.assertRetainedEntryCapacity(this.mediaDataRanges.length, "MP4 media-data range");
              this.mediaDataRanges.push(range);
            } else {
              await this.parseChapters([range], true);
            }
          }
          await this.tokenizer.ignore(range.end - this.tokenizer.position);
        },
        ftyp: async (len) => {
          if (len < 8 || len % ftyp.len !== 0) {
            throw new Mp4ContentError(`Invalid ftyp payload length: ${len}`);
          }
          const typeCount = len / ftyp.len;
          if (typeCount > getMaxMetadataEntries(this.options)) {
            throw new Mp4ContentError(`ftyp entry count ${typeCount} exceeds entry limit ${getMaxMetadataEntries(this.options)}`);
          }
          const types = [];
          while (len > 0) {
            const ftype = await this.readToken(ftyp);
            len -= ftyp.len;
            const value = ftype.type.replace(/\W/g, "");
            if (value.length > 0) {
              types.push(value);
            }
          }
          debug18(`ftyp: ${types.join("/")}`);
          const x = [...new Set(types)].join("/");
          this.metadata.setFormat("container", x);
        },
        date: async (len) => {
          const date = await this.readToken(new StringType(len, "utf-8"));
          await this.addTag("date", date);
        }
      };
      /**
       * @param sampleDescription
       * Ref: https://developer.apple.com/library/archive/documentation/QuickTime/QTFF/QTFFChap3/qtff3.html#//apple_ref/doc/uid/TP40000939-CH205-128916
       */
      parseSoundSampleDescription(sampleDescription) {
        const ssd = {
          dataFormat: sampleDescription.dataFormat,
          dataReferenceIndex: sampleDescription.dataReferenceIndex
        };
        let offset = 0;
        const { description } = sampleDescription;
        if (description && description.length >= SoundSampleDescriptionVersion.len) {
          const version = SoundSampleDescriptionVersion.get(description, offset);
          offset += SoundSampleDescriptionVersion.len;
          if (version.version === 0 || version.version === 1) {
            if (description.length >= offset + SoundSampleDescriptionV0.len) {
              ssd.description = SoundSampleDescriptionV0.get(description, offset);
              if (ssd.dataFormat === "mp4a") {
                const childOffset = offset + SoundSampleDescriptionV0.len + (version.version === 1 ? 16 : 0);
                if (childOffset > description.length) {
                  throw new Mp4ContentError("Truncated mp4a sound sample description");
                }
                if (this.readAudioObjectType(description, childOffset) === 36) {
                  ssd.encoder = { format: "MPEG-4/ALS", lossy: false };
                }
              }
            } else {
              debug18(`Warning: sound-sample-description too short: ${description.length} bytes`);
            }
          } else {
            debug18(`Warning: sound-sample-description ${version} not implemented`);
          }
        }
        return ssd;
      }
      /** Read codec configuration only inside the bounded AudioSampleEntry child boxes. */
      readAudioObjectType(data, offset) {
        while (offset < data.length) {
          this.reserveAtom();
          if (data.length - offset < 8) {
            throw new Mp4ContentError("Truncated mp4a child box header");
          }
          let size = UINT32_BE.get(data, offset);
          const name = Header3.get(data, offset).name;
          let headerSize = 8;
          if (size === 1) {
            if (data.length - offset < 16) {
              throw new Mp4ContentError("Truncated mp4a extended child box header");
            }
            const extendedSize = UINT64_BE.get(data, offset + 8);
            if (extendedSize > BigInt(data.length - offset)) {
              throw new Mp4ContentError("mp4a child box exceeds sample entry");
            }
            size = Number(extendedSize);
            headerSize = 16;
          } else if (size === 0) {
            size = data.length - offset;
          }
          if (size < headerSize || size > data.length - offset) {
            throw new Mp4ContentError("Invalid mp4a child box size");
          }
          if (name === "esds") {
            return this.readEsdsAudioObjectType(data.subarray(offset + headerSize, offset + size));
          }
          offset += size;
        }
      }
      /** ISO/IEC 14496-1 descriptor sizes have at most four base-128 bytes. */
      *readDescriptors(data, offset) {
        while (offset < data.length) {
          this.reserveAtom();
          const tag = data[offset++];
          let size = 0;
          for (let i = 0; ; i++) {
            if (offset >= data.length || i === 4) {
              throw new Mp4ContentError("Truncated or invalid MPEG-4 descriptor length");
            }
            const byte = data[offset++];
            size = size << 7 | byte & 127;
            if (!(byte & 128)) {
              break;
            }
          }
          if (size > data.length - offset) {
            throw new Mp4ContentError("MPEG-4 descriptor exceeds its parent");
          }
          yield { tag, body: data.subarray(offset, offset + size) };
          offset += size;
        }
      }
      readEsdsAudioObjectType(data) {
        if (data.length < 4) {
          throw new Mp4ContentError("Truncated esds full-box header");
        }
        for (const es of this.readDescriptors(data, 4)) {
          if (es.tag !== 3) {
            continue;
          }
          if (es.body.length < 3) {
            throw new Mp4ContentError("Truncated ES descriptor");
          }
          const flags = es.body[2];
          let offset = 3 + (flags & 128 ? 2 : 0);
          if (flags & 64) {
            if (offset >= es.body.length) {
              throw new Mp4ContentError("Truncated ES URL length");
            }
            offset += 1 + es.body[offset];
          }
          offset += flags & 32 ? 2 : 0;
          if (offset > es.body.length) {
            throw new Mp4ContentError("Truncated optional ES descriptor fields");
          }
          for (const decoder of this.readDescriptors(es.body, offset)) {
            if (decoder.tag !== 4) {
              continue;
            }
            if (decoder.body.length < 13) {
              throw new Mp4ContentError("Truncated decoder configuration");
            }
            if (decoder.body[0] !== 64 || decoder.body[1] >>> 2 !== 5) {
              continue;
            }
            for (const specific of this.readDescriptors(decoder.body, 13)) {
              if (specific.tag !== 5) {
                continue;
              }
              if (specific.body.length === 0 || specific.body[0] >>> 3 === 31 && specific.body.length < 2) {
                throw new Mp4ContentError("Truncated AudioSpecificConfig object type");
              }
              const type = specific.body[0] >>> 3;
              return type === 31 ? 32 + ((specific.body[0] & 7) << 3) + (specific.body[1] >>> 5) : type;
            }
          }
        }
      }
      async parseChapters(mediaDataRanges, forwardOnly = false) {
        for (const track of this.tracks.values()) {
          for (const id of track.chapterList ?? []) {
            const chapterTrack = this.tracks.get(id);
            if (!chapterTrack || chapterTrack === track || chapterTrack.handler && !["text", "sbtl"].includes(chapterTrack.handler.handlerType)) {
              continue;
            }
            try {
              await this.parseChapterTrack(chapterTrack, track, mediaDataRanges, forwardOnly);
            } catch (error) {
              if (this.neroChapters.length === 0 || !(error instanceof Mp4ContentError)) {
                throw error;
              }
              this.streamedChapterCount = void 0;
              this.streamedChapters.clear();
              this.addWarning(`Cannot read chapter track: ${error.message}`);
            }
            return;
          }
        }
      }
      async parseChapterTrack(chapterTrack, track, mediaDataRanges, forwardOnly) {
        const timeScale = chapterTrack.media.header?.timeScale;
        if (timeScale === void 0 || timeScale <= 0) {
          throw new Mp4ContentError("Invalid chapter track timescale");
        }
        const sampleCount = Math.min(chapterTrack.sampleCount, this.maxChapterCount);
        if (chapterTrack.sampleCount > this.maxChapterCount) {
          this.addWarning(`Chapter count exceeds the ${this.maxChapterCount} chapter limit`);
        }
        if (forwardOnly) {
          this.streamedChapterCount = sampleCount;
        }
        const chapters = [];
        let sampleIndex = 0;
        let timeRun = 0;
        let samplesInTimeRun = chapterTrack.timeToSampleTable[0]?.count ?? 0;
        let start = 0;
        const chunkRuns = chapterTrack.sampleToChunkTable;
        for (let run = 0; run < chunkRuns.length && sampleIndex < sampleCount; ++run) {
          const { firstChunk, samplesPerChunk } = chunkRuns[run];
          const nextFirstChunk = chunkRuns[run + 1]?.firstChunk ?? chapterTrack.chunkOffsetTable.length + 1;
          if (run === 0 && firstChunk !== 1 || firstChunk < 1 || samplesPerChunk === 0 || nextFirstChunk <= firstChunk || nextFirstChunk > chapterTrack.chunkOffsetTable.length + 1) {
            throw new Mp4ContentError("Invalid chapter sample-to-chunk table");
          }
          for (let chunk = firstChunk - 1; chunk < nextFirstChunk - 1 && sampleIndex < sampleCount; ++chunk) {
            let offset = chapterTrack.chunkOffsetTable[chunk];
            for (let sample = 0; sample < samplesPerChunk && sampleIndex < sampleCount; ++sample) {
              while (samplesInTimeRun === 0 && timeRun < chapterTrack.timeToSampleTable.length) {
                samplesInTimeRun = chapterTrack.timeToSampleTable[++timeRun]?.count ?? 0;
              }
              const timing = chapterTrack.timeToSampleTable[timeRun];
              if (!timing) {
                throw new Mp4ContentError("Missing chapter sample timing");
              }
              const size = chapterTrack.sampleSize || chapterTrack.sampleSizeTable[sampleIndex];
              const deferred = forwardOnly && (this.streamedChapters.has(sampleIndex) || offset >= mediaDataRanges[0].end);
              if (!deferred) {
                if (!Number.isSafeInteger(offset) || !Number.isSafeInteger(size) || size < 0 || !mediaDataRanges.some((range) => offset >= range.offset && size <= range.end - offset)) {
                  throw new Mp4ContentError("Chapter chunk exceeding media data bounds");
                }
                if (forwardOnly && offset < this.tokenizer.position) {
                  throw new Mp4ContentError("Chapter chunk exceeding media data bounds");
                }
                const title = size < 2 || size > maxChapterTitleBytes ? "" : await this.readToken(new ChapterText(size), offset);
                const chapter = {
                  title,
                  timeScale,
                  start
                };
                if (track.chunkOffsetTable.length > 0 && track.sampleToChunkTable.length > 0 && track.timeToSampleTable.length > 0) {
                  track.chapterSampleLookup ??= this.createSampleOffsetLookup(track);
                  chapter.sampleOffset = track.chapterSampleLookup(offset + size);
                }
                if (forwardOnly) {
                  this.streamedChapters.set(sampleIndex, chapter);
                } else {
                  chapters.push(chapter);
                }
              }
              offset += size;
              start += timing.duration;
              --samplesInTimeRun;
              ++sampleIndex;
            }
          }
        }
        if (sampleIndex < sampleCount) {
          throw new Mp4ContentError("Missing chapter sample-to-chunk entries");
        }
        if (!forwardOnly) {
          this.metadata.setFormat("chapters", chapters);
        } else if (this.streamedChapters.size === sampleCount) {
          this.metadata.setFormat("chapters", [...this.streamedChapters].sort(([left], [right]) => left - right).map(([, chapter]) => chapter));
        }
      }
      /** Advance across monotone queries; restart for backward queries without sorting file tables. */
      createSampleOffsetLookup(track) {
        let previousChunk = 0;
        for (const entry of track.sampleToChunkTable) {
          if (previousChunk === 0 && entry.firstChunk !== 1 || entry.firstChunk <= previousChunk || entry.samplesPerChunk === 0) {
            throw new Mp4ContentError("Invalid audio sample-to-chunk table");
          }
          previousChunk = entry.firstChunk;
        }
        let chunkIndex = 0;
        let chunkId = 1;
        let chunkRun = 0;
        let timingIndex = 0;
        let remainingSamples = 0;
        let sampleDuration = 0;
        let totalDuration = 0;
        let previousOffset = Number.NEGATIVE_INFINITY;
        return (chapterOffset) => {
          if (chapterOffset < previousOffset) {
            chunkIndex = chunkRun = timingIndex = remainingSamples = sampleDuration = totalDuration = 0;
            chunkId = 1;
          }
          previousOffset = chapterOffset;
          while (chunkIndex < track.chunkOffsetTable.length && track.chunkOffsetTable[chunkIndex] < chapterOffset) {
            ++chunkIndex;
          }
          const targetChunk = chunkIndex + 1;
          for (; chunkId < targetChunk; ++chunkId) {
            while (track.sampleToChunkTable[chunkRun + 1]?.firstChunk <= chunkId) {
              ++chunkRun;
            }
            let samplesPerChunk = track.sampleToChunkTable[chunkRun].samplesPerChunk;
            while (samplesPerChunk > 0) {
              while (remainingSamples === 0) {
                const timing = track.timeToSampleTable[timingIndex++];
                if (!timing) {
                  throw new Mp4ContentError("Missing audio sample timing for chapter offset");
                }
                remainingSamples = timing.count;
                sampleDuration = timing.duration;
              }
              const samples = Math.min(remainingSamples, samplesPerChunk);
              totalDuration += samples * sampleDuration;
              if (!Number.isSafeInteger(totalDuration)) {
                throw new Mp4ContentError("Unsafe audio sample timing for chapter offset");
              }
              remainingSamples -= samples;
              samplesPerChunk -= samples;
            }
          }
          return totalDuration;
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/mp4/Mp4Loader.js
var mp4ParserLoader;
var init_Mp4Loader = __esm({
  "node_modules/music-metadata/lib/mp4/Mp4Loader.js"() {
    mp4ParserLoader = {
      parserType: "mp4",
      extensions: [".mp4", ".m4a", ".m4b", ".m4pa", "m4v", "m4r", "3gp", ".mov", ".movie", ".qt"],
      mimeTypes: ["audio/mp4", "audio/m4a", "video/m4v", "video/mp4", "video/quicktime"],
      async load() {
        return (await Promise.resolve().then(() => (init_MP4Parser(), MP4Parser_exports))).MP4Parser;
      }
    };
  }
});

// node_modules/music-metadata/lib/mpeg/AdtsFrameHeader.js
var AdtsFrameHeader;
var init_AdtsFrameHeader = __esm({
  "node_modules/music-metadata/lib/mpeg/AdtsFrameHeader.js"() {
    init_Util();
    AdtsFrameHeader = class _AdtsFrameHeader {
      static profiles = ["AAC Main", "AAC LC", "AAC SSR", "AAC LTP"];
      static samplingRates = [
        96e3,
        88200,
        64e3,
        48e3,
        44100,
        32e3,
        24e3,
        22050,
        16e3,
        12e3,
        11025,
        8e3,
        7350,
        null,
        // Reserved index 13
        null,
        // Reserved index 14
        null
        // Escape index 15
      ];
      static channelCounts = [void 0, 1, 2, 3, 4, 5, 6, 8];
      container;
      codec = "AAC";
      codecProfile;
      samplingRate;
      numberOfChannels;
      frameLength;
      static matches(buf) {
        return (buf[1] & 22) === 16;
      }
      constructor(buf) {
        this.container = `ADTS/MPEG-${isBitSet(buf, 1, 4) ? 2 : 4}`;
        this.codecProfile = _AdtsFrameHeader.profiles[getBitAllignedNumber(buf, 2, 0, 2)];
        this.samplingRate = _AdtsFrameHeader.samplingRates[getBitAllignedNumber(buf, 2, 2, 4)];
        this.numberOfChannels = _AdtsFrameHeader.channelCounts[getBitAllignedNumber(buf, 2, 7, 3)];
        this.frameLength = getBitAllignedNumber(buf, 3, 6, 2) << 11;
      }
    };
  }
});

// node_modules/music-metadata/lib/mpeg/MpegFrameHeader.js
var MpegContentError, MpegFrameHeader;
var init_MpegFrameHeader = __esm({
  "node_modules/music-metadata/lib/mpeg/MpegFrameHeader.js"() {
    init_Util();
    init_ParseError();
    MpegContentError = class extends makeUnexpectedFileContentError("MPEG") {
    };
    MpegFrameHeader = class _MpegFrameHeader {
      static len = 4;
      static versions = [2.5, null, 2, 1];
      static layers = [0, 3, 2, 1];
      static sideInfoLengths = [
        [17, 32],
        [9, 17]
      ];
      static bitrates = {
        1: { 11: 32, 12: 32, 13: 32, 21: 32, 22: 8, 23: 8 },
        2: { 11: 64, 12: 48, 13: 40, 21: 48, 22: 16, 23: 16 },
        3: { 11: 96, 12: 56, 13: 48, 21: 56, 22: 24, 23: 24 },
        4: { 11: 128, 12: 64, 13: 56, 21: 64, 22: 32, 23: 32 },
        5: { 11: 160, 12: 80, 13: 64, 21: 80, 22: 40, 23: 40 },
        6: { 11: 192, 12: 96, 13: 80, 21: 96, 22: 48, 23: 48 },
        7: { 11: 224, 12: 112, 13: 96, 21: 112, 22: 56, 23: 56 },
        8: { 11: 256, 12: 128, 13: 112, 21: 128, 22: 64, 23: 64 },
        9: { 11: 288, 12: 160, 13: 128, 21: 144, 22: 80, 23: 80 },
        10: { 11: 320, 12: 192, 13: 160, 21: 160, 22: 96, 23: 96 },
        11: { 11: 352, 12: 224, 13: 192, 21: 176, 22: 112, 23: 112 },
        12: { 11: 384, 12: 256, 13: 224, 21: 192, 22: 128, 23: 128 },
        13: { 11: 416, 12: 320, 13: 256, 21: 224, 22: 144, 23: 144 },
        14: { 11: 448, 12: 384, 13: 320, 21: 256, 22: 160, 23: 160 }
      };
      static samplingRates = {
        1: { 0: 44100, 1: 48e3, 2: 32e3 },
        2: { 0: 22050, 1: 24e3, 2: 16e3 },
        2.5: { 0: 11025, 1: 12e3, 2: 8e3 }
      };
      static samplesInFrameTable = [
        /* Layer   I    II   III */
        [0, 384, 1152, 1152],
        // MPEG-1
        [0, 384, 1152, 576]
        // MPEG-2/2.5
      ];
      container = "MPEG";
      codec;
      layer;
      isProtectedByCRC;
      bitrate;
      samplingRate;
      numberOfChannels;
      samplesPerFrame;
      frameSize;
      sideInfoLength;
      constructor(buf) {
        const version = _MpegFrameHeader.versions[getBitAllignedNumber(buf, 1, 3, 2)];
        if (version === null) {
          throw new MpegContentError("Cannot determine bit-rate");
        }
        this.layer = _MpegFrameHeader.layers[getBitAllignedNumber(buf, 1, 5, 2)];
        this.isProtectedByCRC = !isBitSet(buf, 1, 7);
        const bitrateIndex = getBitAllignedNumber(buf, 2, 0, 4);
        const samplingRateIndex = getBitAllignedNumber(buf, 2, 4, 2);
        const padding = isBitSet(buf, 2, 6);
        this.numberOfChannels = getBitAllignedNumber(buf, 3, 0, 2) === 3 ? 1 : 2;
        this.codec = `MPEG ${version} Layer ${this.layer}`;
        const bitrate = _MpegFrameHeader.bitrates[bitrateIndex]?.[10 * Math.floor(version) + this.layer];
        if (!bitrate) {
          throw new MpegContentError("Cannot determine bit-rate");
        }
        this.bitrate = bitrate * 1e3;
        const samplingRate = _MpegFrameHeader.samplingRates[version][samplingRateIndex];
        if (samplingRate == null) {
          throw new MpegContentError("Cannot determine sampling-rate");
        }
        this.samplingRate = samplingRate;
        this.samplesPerFrame = _MpegFrameHeader.samplesInFrameTable[version === 1 ? 0 : 1][this.layer];
        const slotSize = this.layer === 1 ? 4 : 1;
        this.frameSize = Math.floor(this.samplesPerFrame / 8 * this.bitrate / samplingRate + (padding ? slotSize : 0));
        this.sideInfoLength = this.layer !== 3 ? 2 : _MpegFrameHeader.sideInfoLengths[version === 1 ? 0 : 1][this.numberOfChannels === 1 ? 0 : 1];
      }
    };
  }
});

// node_modules/music-metadata/lib/mpeg/ReplayGainDataFormat.js
var ReplayGain;
var init_ReplayGainDataFormat = __esm({
  "node_modules/music-metadata/lib/mpeg/ReplayGainDataFormat.js"() {
    init_Util();
    ReplayGain = {
      len: 2,
      get: (buf, off) => {
        const gain_type = getBitAllignedNumber(buf, off, 0, 3);
        const sign = getBitAllignedNumber(buf, off, 6, 1);
        const gain_adj = getBitAllignedNumber(buf, off, 7, 9) / 10;
        if (gain_type > 0) {
          return {
            type: getBitAllignedNumber(buf, off, 0, 3),
            origin: getBitAllignedNumber(buf, off, 3, 3),
            adjustment: sign ? -gain_adj : gain_adj
          };
        }
        return void 0;
      }
    };
  }
});

// node_modules/music-metadata/lib/mpeg/ExtendedLameHeader.js
var ExtendedLameHeader;
var init_ExtendedLameHeader = __esm({
  "node_modules/music-metadata/lib/mpeg/ExtendedLameHeader.js"() {
    init_lib3();
    init_Util();
    init_ReplayGainDataFormat();
    ExtendedLameHeader = {
      len: 27,
      get: (buf, off) => {
        const track_peak = UINT32_BE.get(buf, off + 2);
        return {
          revision: getBitAllignedNumber(buf, off, 0, 4),
          vbr_method: getBitAllignedNumber(buf, off, 4, 4),
          lowpass_filter: 100 * UINT8.get(buf, off + 1),
          track_peak: track_peak === 0 ? null : track_peak / 2 ** 23,
          track_gain: ReplayGain.get(buf, 6),
          album_gain: ReplayGain.get(buf, 8),
          music_length: UINT32_BE.get(buf, off + 20),
          music_crc: UINT8.get(buf, off + 24),
          header_crc: UINT16_BE.get(buf, off + 24)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/mpeg/XingTag.js
async function readXingHeader(tokenizer) {
  const flags = await tokenizer.readToken(XingHeaderFlags);
  const xingInfoTag = { numFrames: null, streamSize: null, vbrScale: null };
  if (flags.frames) {
    xingInfoTag.numFrames = await tokenizer.readToken(UINT32_BE);
  }
  if (flags.bytes) {
    xingInfoTag.streamSize = await tokenizer.readToken(UINT32_BE);
  }
  if (flags.toc) {
    xingInfoTag.toc = new Uint8Array(100);
    await tokenizer.readBuffer(xingInfoTag.toc);
  }
  if (flags.vbrScale) {
    xingInfoTag.vbrScale = await tokenizer.readToken(UINT32_BE);
  }
  const lameTag = await tokenizer.peekToken(new StringType(4, "ascii"));
  if (lameTag === "LAME") {
    await tokenizer.ignore(4);
    xingInfoTag.lame = {
      version: await tokenizer.readToken(new StringType(5, "ascii"))
    };
    const match = xingInfoTag.lame.version.match(/\d+.\d+/g);
    if (match !== null) {
      const majorMinorVersion = match[0];
      const version = majorMinorVersion.split(".").map((n) => Number.parseInt(n, 10));
      if (version[0] >= 3 && version[1] >= 90) {
        xingInfoTag.lame.extended = await tokenizer.readToken(ExtendedLameHeader);
      }
    }
  }
  return xingInfoTag;
}
var InfoTagHeaderTag, LameEncoderVersion, XingHeaderFlags;
var init_XingTag = __esm({
  "node_modules/music-metadata/lib/mpeg/XingTag.js"() {
    init_lib3();
    init_Util();
    init_ExtendedLameHeader();
    InfoTagHeaderTag = new StringType(4, "ascii");
    LameEncoderVersion = new StringType(6, "ascii");
    XingHeaderFlags = {
      len: 4,
      get: (buf, off) => {
        return {
          frames: isBitSet(buf, off, 31),
          bytes: isBitSet(buf, off, 30),
          toc: isBitSet(buf, off, 29),
          vbrScale: isBitSet(buf, off, 28)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/mpeg/MpegParser.js
var MpegParser_exports = {};
__export(MpegParser_exports, {
  MpegContentError: () => MpegContentError,
  MpegParser: () => MpegParser
});
function getVbrCodecProfile(vbrScale) {
  return `V${Math.floor((100 - vbrScale) / 10)}`;
}
var import_debug19, debug19, maxPeekLen, MpegParser;
var init_MpegParser = __esm({
  "node_modules/music-metadata/lib/mpeg/MpegParser.js"() {
    import_debug19 = __toESM(require_src(), 1);
    init_lib();
    init_Util();
    init_AbstractID3Parser();
    init_AdtsFrameHeader();
    init_MpegFrameHeader();
    init_XingTag();
    init_MpegFrameHeader();
    debug19 = (0, import_debug19.default)("music-metadata:parser:mpeg");
    maxPeekLen = 1024;
    MpegParser = class extends AbstractID3Parser {
      frameCount = 0;
      syncFrameCount = -1;
      totalDataLength = 0;
      audioFrameHeader;
      firstBitrate;
      constantBitrate = true;
      offset = 0;
      frameSize = 0;
      calculateEofDuration = false;
      samplesPerFrame = null;
      frameHeaderBuffer = new Uint8Array(MpegFrameHeader.len);
      frameHeaderTail = this.frameHeaderBuffer.subarray(1);
      adtsHeaderBuffer = new Uint8Array(3);
      sideInfoBuffer = new Uint8Array(32);
      // Maximum side information size (MPEG-1 stereo).
      /**
       * Number of bytes already parsed since beginning of stream / file
       */
      mpegOffset = null;
      syncPeek = {
        buf: new Uint8Array(maxPeekLen),
        len: 0
      };
      /**
       * Called after ID3 headers have been parsed
       */
      async postId3v2Parse() {
        this.metadata.setFormat("lossless", false);
        this.metadata.setAudioOnly();
        try {
          let quit = false;
          while (!quit) {
            await this.sync();
            quit = await this.parseFrameHeader();
          }
        } catch (err) {
          if (err instanceof EndOfStreamError) {
            debug19("End-of-stream");
            if (this.calculateEofDuration) {
              if (this.samplesPerFrame !== null) {
                const numberOfSamples = this.frameCount * this.samplesPerFrame;
                this.metadata.setFormat("numberOfSamples", numberOfSamples);
                if (this.metadata.format.sampleRate) {
                  const duration = numberOfSamples / this.metadata.format.sampleRate;
                  debug19(`Calculate duration at EOF: ${duration} sec.`, duration);
                  this.metadata.setFormat("duration", duration);
                }
              }
            }
          } else {
            throw err;
          }
        }
      }
      /**
       * Called after file has been fully parsed, this allows, if present, to exclude the ID3v1.1 header length
       */
      finalize() {
        const format = this.metadata.format;
        const hasID3v1 = !!this.metadata.native.ID3v1;
        if (this.mpegOffset !== null) {
          if (format.duration && this.tokenizer.fileInfo.size) {
            const mpegSize = this.tokenizer.fileInfo.size - this.mpegOffset - (hasID3v1 ? 128 : 0);
            if (format.codecProfile && format.codecProfile[0] === "V") {
              this.metadata.setFormat("bitrate", mpegSize * 8 / format.duration);
            }
          }
          if (this.tokenizer.fileInfo.size && format.codecProfile === "CBR") {
            const mpegSize = this.tokenizer.fileInfo.size - this.mpegOffset - (hasID3v1 ? 128 : 0);
            if (this.samplesPerFrame !== null) {
              const numberOfSamples = Math.round(mpegSize / this.frameSize) * this.samplesPerFrame;
              this.metadata.setFormat("numberOfSamples", numberOfSamples);
              if (format.sampleRate && !format.duration) {
                const duration = numberOfSamples / format.sampleRate;
                debug19("Calculate CBR duration based on file size: %s", duration);
                this.metadata.setFormat("duration", duration);
              }
            }
          }
        }
      }
      async sync() {
        let gotFirstSync = false;
        while (true) {
          let bo = 0;
          this.syncPeek.len = await this.tokenizer.peekBuffer(this.syncPeek.buf, { length: maxPeekLen, mayBeLess: true });
          if (this.syncPeek.len <= 163) {
            throw new EndOfStreamError();
          }
          while (true) {
            if (gotFirstSync && (this.syncPeek.buf[bo] & 224) === 224) {
              this.frameHeaderBuffer[0] = 255;
              this.frameHeaderBuffer[1] = this.syncPeek.buf[bo];
              await this.tokenizer.ignore(bo);
              debug19(`Sync at offset=${this.tokenizer.position - 1}, frameCount=${this.frameCount}`);
              if (this.syncFrameCount === this.frameCount) {
                debug19(`Re-synced MPEG stream, frameCount=${this.frameCount}`);
                this.frameCount = 0;
                this.frameSize = 0;
              }
              this.syncFrameCount = this.frameCount;
              return;
            }
            gotFirstSync = false;
            bo = this.syncPeek.buf.indexOf(255, bo);
            if (bo === -1) {
              if (this.syncPeek.len < this.syncPeek.buf.length) {
                throw new EndOfStreamError();
              }
              await this.tokenizer.ignore(this.syncPeek.len);
              break;
            }
            ++bo;
            gotFirstSync = true;
          }
        }
      }
      /**
       * Read the shared four-byte prefix, then dispatch to ADTS or MPEG audio.
       * @return {Promise<boolean>} true if parser should quit
       */
      async parseFrameHeader() {
        if (this.frameCount === 0) {
          this.mpegOffset = this.tokenizer.position - 1;
        }
        await this.tokenizer.peekBuffer(this.frameHeaderTail, { length: 3 });
        let header;
        try {
          header = AdtsFrameHeader.matches(this.frameHeaderBuffer) ? new AdtsFrameHeader(this.frameHeaderBuffer) : new MpegFrameHeader(this.frameHeaderBuffer);
        } catch (err) {
          await this.tokenizer.ignore(1);
          if (err instanceof Error) {
            this.metadata.addWarning(`Parse error: ${err.message}`);
            return false;
          }
          throw err;
        }
        await this.tokenizer.ignore(3);
        this.metadata.setFormat("container", header.container);
        this.metadata.setFormat("codec", header.codec);
        this.metadata.setFormat("lossless", false);
        this.metadata.setFormat("sampleRate", header.samplingRate ?? void 0);
        this.frameCount++;
        return header instanceof AdtsFrameHeader ? this.parseAdts(header) : this.parseMpegFrame(header);
      }
      /**
       * @return {Promise<boolean>} true if parser should quit
       */
      async parseMpegFrame(header) {
        this.metadata.setFormat("numberOfChannels", header.numberOfChannels);
        this.metadata.setFormat("bitrate", header.bitrate);
        if (this.frameCount < 20 * 1e4) {
          debug19("offset=%s MP%s bitrate=%s sample-rate=%s", this.tokenizer.position - 4, header.layer, header.bitrate, header.samplingRate);
        }
        this.frameSize = header.frameSize;
        this.audioFrameHeader = header;
        this.firstBitrate ??= header.bitrate;
        this.constantBitrate &&= header.bitrate === this.firstBitrate;
        if (this.frameCount === 1) {
          this.offset = MpegFrameHeader.len;
          await this.skipSideInformation();
          return false;
        }
        if (this.frameCount === 4) {
          if (this.constantBitrate) {
            this.samplesPerFrame = header.samplesPerFrame;
            this.metadata.setFormat("codecProfile", "CBR");
            if (this.tokenizer.fileInfo.size) {
              return true;
            }
          } else if (this.metadata.format.duration) {
            return true;
          }
          if (!this.options.duration) {
            return true;
          }
        }
        if (this.options.duration && this.frameCount === 4) {
          this.samplesPerFrame = header.samplesPerFrame;
          this.calculateEofDuration = true;
        }
        this.offset = MpegFrameHeader.len;
        if (header.isProtectedByCRC) {
          await this.tokenizer.ignore(2);
          this.offset += 2;
        }
        await this.skipSideInformation();
        return false;
      }
      async parseAdts(header) {
        await this.tokenizer.readBuffer(this.adtsHeaderBuffer);
        const frameLength = header.frameLength + getBitAllignedNumber(this.adtsHeaderBuffer, 0, 0, 11);
        this.totalDataLength += frameLength;
        this.samplesPerFrame = 1024;
        if (header.samplingRate !== null) {
          const framesPerSec = header.samplingRate / this.samplesPerFrame;
          const bytesPerFrame = this.totalDataLength / this.frameCount;
          const bitrate = 8 * bytesPerFrame * framesPerSec + 0.5;
          this.metadata.setFormat("bitrate", bitrate);
          debug19(`frame-count=${this.frameCount}, size=${frameLength} bytes, bit-rate=${bitrate}`);
        }
        await this.tokenizer.ignore(frameLength > 7 ? frameLength - 7 : 1);
        if (this.frameCount === 3) {
          this.metadata.setFormat("codecProfile", header.codecProfile);
          if (header.numberOfChannels) {
            this.metadata.setFormat("numberOfChannels", header.numberOfChannels);
          }
          if (this.options.duration) {
            this.calculateEofDuration = true;
          } else {
            return true;
          }
        }
        return false;
      }
      async skipSideInformation() {
        if (this.audioFrameHeader) {
          const sideInfoLength = this.audioFrameHeader.sideInfoLength;
          await this.tokenizer.readBuffer(this.sideInfoBuffer, { length: sideInfoLength });
          this.offset += sideInfoLength;
          await this.readXtraInfoHeader();
        }
      }
      async readXtraInfoHeader() {
        const headerTag = await this.tokenizer.readToken(InfoTagHeaderTag);
        this.offset += InfoTagHeaderTag.len;
        switch (headerTag) {
          case "Info":
            this.metadata.setFormat("codecProfile", "CBR");
            return this.readXingInfoHeader();
          case "Xing": {
            const infoTag = await this.readXingInfoHeader();
            if (infoTag.vbrScale !== null) {
              const codecProfile = getVbrCodecProfile(infoTag.vbrScale);
              this.metadata.setFormat("codecProfile", codecProfile);
            }
            return null;
          }
          case "Xtra":
            break;
          case "LAME": {
            const version = await this.tokenizer.readToken(LameEncoderVersion);
            if (this.frameSize >= this.offset + LameEncoderVersion.len) {
              this.offset += LameEncoderVersion.len;
              this.metadata.setFormat("tool", `LAME ${version}`);
              await this.skipFrameData(this.frameSize - this.offset);
              return null;
            }
            this.metadata.addWarning("Corrupt LAME header");
            break;
          }
        }
        const frameDataLeft = this.frameSize - this.offset;
        if (frameDataLeft < 0) {
          this.metadata.addWarning(`Frame ${this.frameCount}corrupt: negative frameDataLeft`);
        } else {
          await this.skipFrameData(frameDataLeft);
        }
        return null;
      }
      /**
       * Ref: http://gabriel.mp3-tech.org/mp3infotag.html
       */
      async readXingInfoHeader() {
        const offset = this.tokenizer.position;
        const infoTag = await readXingHeader(this.tokenizer);
        this.offset += this.tokenizer.position - offset;
        if (infoTag.lame) {
          this.metadata.setFormat("tool", `LAME ${stripNulls(infoTag.lame.version)}`);
          if (infoTag.lame.extended) {
            this.metadata.setFormat("trackPeakLevel", infoTag.lame.extended.track_peak ?? void 0);
            if (infoTag.lame.extended.track_gain) {
              this.metadata.setFormat("trackGain", infoTag.lame.extended.track_gain.adjustment);
            }
            if (infoTag.lame.extended.album_gain) {
              this.metadata.setFormat("albumGain", infoTag.lame.extended.album_gain.adjustment);
            }
            this.metadata.setFormat("duration", infoTag.lame.extended.music_length / 1e3);
          }
        }
        if (infoTag.streamSize && this.audioFrameHeader && infoTag.numFrames !== null) {
          const duration = infoTag.numFrames * this.audioFrameHeader.samplesPerFrame / this.audioFrameHeader.samplingRate;
          this.metadata.setFormat("duration", duration);
          debug19("Get duration from Xing header: %s", this.metadata.format.duration);
          return infoTag;
        }
        const frameDataLeft = this.frameSize - this.offset;
        await this.skipFrameData(frameDataLeft);
        return infoTag;
      }
      async skipFrameData(frameDataLeft) {
        if (frameDataLeft < 0) {
          throw new MpegContentError("frame-data-left cannot be negative");
        }
        await this.tokenizer.ignore(frameDataLeft);
      }
    };
  }
});

// node_modules/music-metadata/lib/mpeg/MpegLoader.js
var mpegParserLoader;
var init_MpegLoader = __esm({
  "node_modules/music-metadata/lib/mpeg/MpegLoader.js"() {
    mpegParserLoader = {
      parserType: "mpeg",
      extensions: [".mp1", ".mp2", ".mp3", ".m2a", ".aac", "aacp"],
      mimeTypes: ["audio/mpeg", "audio/mp3", "audio/aacs", "audio/aacp"],
      async load() {
        return (await Promise.resolve().then(() => (init_MpegParser(), MpegParser_exports))).MpegParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/musepack/MusepackConentError.js
var MusepackContentError;
var init_MusepackConentError = __esm({
  "node_modules/music-metadata/lib/musepack/MusepackConentError.js"() {
    init_ParseError();
    MusepackContentError = class extends makeUnexpectedFileContentError("Musepack") {
    };
  }
});

// node_modules/music-metadata/lib/musepack/sv7/BitReader.js
var BitReader;
var init_BitReader = __esm({
  "node_modules/music-metadata/lib/musepack/sv7/BitReader.js"() {
    init_lib3();
    BitReader = class {
      pos = 0;
      dword = null;
      tokenizer;
      constructor(tokenizer) {
        this.tokenizer = tokenizer;
      }
      /**
       *
       * @param bits 1..30 bits
       */
      async read(bits) {
        while (this.dword === null) {
          this.dword = await this.tokenizer.readToken(UINT32_LE);
        }
        let out = this.dword;
        this.pos += bits;
        if (this.pos < 32) {
          out >>>= 32 - this.pos;
          return out & (1 << bits) - 1;
        }
        this.pos -= 32;
        if (this.pos === 0) {
          this.dword = null;
          return out & (1 << bits) - 1;
        }
        this.dword = await this.tokenizer.readToken(UINT32_LE);
        if (this.pos) {
          out <<= this.pos;
          out |= this.dword >>> 32 - this.pos;
        }
        return out & (1 << bits) - 1;
      }
      async ignore(bits) {
        if (this.pos > 0) {
          const remaining = 32 - this.pos;
          this.dword = null;
          bits -= remaining;
          this.pos = 0;
        }
        const remainder = bits % 32;
        const numOfWords = (bits - remainder) / 32;
        await this.tokenizer.ignore(numOfWords * 4);
        return this.read(remainder);
      }
    };
  }
});

// node_modules/music-metadata/lib/musepack/sv7/StreamVersion7.js
var Header4;
var init_StreamVersion7 = __esm({
  "node_modules/music-metadata/lib/musepack/sv7/StreamVersion7.js"() {
    init_lib2();
    init_lib3();
    init_Util();
    Header4 = {
      len: 6 * 4,
      get: (buf, off) => {
        const header = {
          // word 0
          signature: textDecode(buf.subarray(off, off + 3), "latin1"),
          // versionIndex number * 1000 (3.81 = 3810) (remember that 4-byte alignment causes this to take 4-bytes)
          streamMinorVersion: getBitAllignedNumber(buf, off + 3, 0, 4),
          streamMajorVersion: getBitAllignedNumber(buf, off + 3, 4, 4),
          // word 1
          frameCount: UINT32_LE.get(buf, off + 4),
          // word 2
          maxLevel: UINT16_LE.get(buf, off + 8),
          sampleFrequency: [44100, 48e3, 37800, 32e3][getBitAllignedNumber(buf, off + 10, 0, 2)],
          link: getBitAllignedNumber(buf, off + 10, 2, 2),
          profile: getBitAllignedNumber(buf, off + 10, 4, 4),
          maxBand: getBitAllignedNumber(buf, off + 11, 0, 6),
          intensityStereo: isBitSet(buf, off + 11, 6),
          midSideStereo: isBitSet(buf, off + 11, 7),
          // word 3
          titlePeak: UINT16_LE.get(buf, off + 12),
          titleGain: UINT16_LE.get(buf, off + 14),
          // word 4
          albumPeak: UINT16_LE.get(buf, off + 16),
          albumGain: UINT16_LE.get(buf, off + 18),
          // word
          lastFrameLength: UINT32_LE.get(buf, off + 20) >>> 20 & 2047,
          trueGapless: isBitSet(buf, off + 23, 0)
        };
        header.lastFrameLength = header.trueGapless ? UINT32_LE.get(buf, 20) >>> 20 & 2047 : 0;
        return header;
      }
    };
  }
});

// node_modules/music-metadata/lib/musepack/sv7/MpcSv7Parser.js
var import_debug20, debug20, MpcSv7Parser;
var init_MpcSv7Parser = __esm({
  "node_modules/music-metadata/lib/musepack/sv7/MpcSv7Parser.js"() {
    import_debug20 = __toESM(require_src(), 1);
    init_APEv2Parser();
    init_BasicParser();
    init_MusepackConentError();
    init_BitReader();
    init_StreamVersion7();
    debug20 = (0, import_debug20.default)("music-metadata:parser:musepack");
    MpcSv7Parser = class extends BasicParser {
      bitreader = null;
      audioLength = 0;
      duration = null;
      async parse() {
        const header = await this.tokenizer.readToken(Header4);
        if (header.signature !== "MP+") {
          throw new MusepackContentError("Unexpected magic number");
        }
        debug20(`stream-version=${header.streamMajorVersion}.${header.streamMinorVersion}`);
        this.metadata.setFormat("container", "Musepack, SV7");
        this.metadata.setFormat("sampleRate", header.sampleFrequency);
        const numberOfSamples = 1152 * (header.frameCount - 1) + header.lastFrameLength;
        this.metadata.setFormat("numberOfSamples", numberOfSamples);
        this.duration = numberOfSamples / header.sampleFrequency;
        this.metadata.setFormat("duration", this.duration);
        this.bitreader = new BitReader(this.tokenizer);
        this.metadata.setFormat("numberOfChannels", header.midSideStereo || header.intensityStereo ? 2 : 1);
        const version = await this.bitreader.read(8);
        this.metadata.setFormat("codec", (version / 100).toFixed(2));
        await this.skipAudioData(header.frameCount);
        debug20(`End of audio stream, switching to APEv2, offset=${this.tokenizer.position}`);
        return tryParseApeHeader(this.metadata, this.tokenizer, this.options);
      }
      async skipAudioData(frameCount) {
        while (frameCount-- > 0) {
          const frameLength = await this.bitreader.read(20);
          this.audioLength += 20 + frameLength;
          await this.bitreader.ignore(frameLength);
        }
        const lastFrameLength = await this.bitreader.read(11);
        this.audioLength += lastFrameLength;
        if (this.duration !== null) {
          this.metadata.setFormat("bitrate", this.audioLength / this.duration);
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/musepack/sv8/StreamVersion8.js
var import_debug21, debug21, PacketKey, SH_part1, SH_part3, StreamReader2;
var init_StreamVersion8 = __esm({
  "node_modules/music-metadata/lib/musepack/sv8/StreamVersion8.js"() {
    import_debug21 = __toESM(require_src(), 1);
    init_lib3();
    init_Util();
    init_MusepackConentError();
    debug21 = (0, import_debug21.default)("music-metadata:parser:musepack:sv8");
    PacketKey = new StringType(2, "latin1");
    SH_part1 = {
      len: 5,
      get: (buf, off) => {
        return {
          crc: UINT32_LE.get(buf, off),
          streamVersion: UINT8.get(buf, off + 4)
        };
      }
    };
    SH_part3 = {
      len: 2,
      get: (buf, off) => {
        return {
          sampleFrequency: [44100, 48e3, 37800, 32e3][getBitAllignedNumber(buf, off, 0, 3)],
          maxUsedBands: getBitAllignedNumber(buf, off, 3, 5),
          channelCount: getBitAllignedNumber(buf, off + 1, 0, 4) + 1,
          msUsed: isBitSet(buf, off + 1, 4),
          audioBlockFrames: getBitAllignedNumber(buf, off + 1, 5, 3)
        };
      }
    };
    StreamReader2 = class {
      _tokenizer;
      get tokenizer() {
        return this._tokenizer;
      }
      set tokenizer(value) {
        this._tokenizer = value;
      }
      constructor(_tokenizer) {
        this._tokenizer = _tokenizer;
      }
      async readPacketHeader() {
        const key = await this.tokenizer.readToken(PacketKey);
        const size = await this.readVariableSizeField();
        const headerLength = PacketKey.len + size.len;
        if (size.value < headerLength) {
          throw new MusepackContentError(`Invalid packet size: ${size.value}`);
        }
        return {
          key,
          payloadLength: size.value - headerLength
        };
      }
      async readStreamHeader(size) {
        const streamHeader = {};
        debug21(`Reading SH at offset=${this.tokenizer.position}`);
        const part1 = await this.tokenizer.readToken(SH_part1);
        size -= SH_part1.len;
        Object.assign(streamHeader, part1);
        debug21(`SH.streamVersion = ${part1.streamVersion}`);
        const sampleCount = await this.readVariableSizeField();
        size -= sampleCount.len;
        streamHeader.sampleCount = sampleCount.value;
        const bs = await this.readVariableSizeField();
        size -= bs.len;
        streamHeader.beginningOfSilence = bs.value;
        const part3 = await this.tokenizer.readToken(SH_part3);
        size -= SH_part3.len;
        Object.assign(streamHeader, part3);
        await this.tokenizer.ignore(size);
        return streamHeader;
      }
      async readVariableSizeField() {
        let value = 0;
        for (let len = 1; len <= 9; ++len) {
          const byte = await this.tokenizer.readNumber(UINT8);
          const digit = byte & 127;
          if (value > (Number.MAX_SAFE_INTEGER - digit) / 128) {
            throw new MusepackContentError("Variable-size integer exceeds JavaScript safe integer range");
          }
          value = value * 128 + digit;
          if ((byte & 128) === 0) {
            return { len, value };
          }
        }
        throw new MusepackContentError("Variable-size integer exceeds 9 bytes");
      }
    };
  }
});

// node_modules/music-metadata/lib/musepack/sv8/MpcSv8Parser.js
var import_debug22, debug22, MpcSv8Parser;
var init_MpcSv8Parser = __esm({
  "node_modules/music-metadata/lib/musepack/sv8/MpcSv8Parser.js"() {
    import_debug22 = __toESM(require_src(), 1);
    init_APEv2Parser();
    init_BasicParser();
    init_FourCC();
    init_MusepackConentError();
    init_StreamVersion8();
    debug22 = (0, import_debug22.default)("music-metadata:parser:musepack");
    MpcSv8Parser = class extends BasicParser {
      audioLength = 0;
      async parse() {
        const signature = await this.tokenizer.readToken(FourCcToken);
        if (signature !== "MPCK") {
          throw new MusepackContentError("Invalid Magic number");
        }
        this.metadata.setFormat("container", "Musepack, SV8");
        return this.parsePacket();
      }
      async parsePacket() {
        const sv8reader = new StreamReader2(this.tokenizer);
        do {
          const header = await sv8reader.readPacketHeader();
          debug22(`packet-header key=${header.key}, payloadLength=${header.payloadLength}`);
          switch (header.key) {
            case "SH": {
              const sh = await sv8reader.readStreamHeader(header.payloadLength);
              this.metadata.setFormat("numberOfSamples", sh.sampleCount);
              this.metadata.setFormat("sampleRate", sh.sampleFrequency);
              this.metadata.setFormat("duration", sh.sampleCount / sh.sampleFrequency);
              this.metadata.setFormat("numberOfChannels", sh.channelCount);
              break;
            }
            case "AP":
              this.audioLength += header.payloadLength;
              await this.tokenizer.ignore(header.payloadLength);
              break;
            case "RG":
            // Replaygain
            case "EI":
            // Encoder Info
            case "SO":
            // Seek Table Offset
            case "ST":
            // Seek Table
            case "CT":
              await this.tokenizer.ignore(header.payloadLength);
              break;
            case "SE":
              if (this.metadata.format.duration) {
                this.metadata.setFormat("bitrate", this.audioLength * 8 / this.metadata.format.duration);
              }
              return tryParseApeHeader(this.metadata, this.tokenizer, this.options);
            default:
              throw new MusepackContentError(`Unexpected header: ${header.key}`);
          }
        } while (true);
      }
    };
  }
});

// node_modules/music-metadata/lib/musepack/MusepackParser.js
var MusepackParser_exports = {};
__export(MusepackParser_exports, {
  MusepackParser: () => MusepackParser
});
var import_debug23, debug23, MusepackParser;
var init_MusepackParser = __esm({
  "node_modules/music-metadata/lib/musepack/MusepackParser.js"() {
    import_debug23 = __toESM(require_src(), 1);
    init_lib3();
    init_AbstractID3Parser();
    init_MusepackConentError();
    init_MpcSv7Parser();
    init_MpcSv8Parser();
    debug23 = (0, import_debug23.default)("music-metadata:parser:musepack");
    MusepackParser = class extends AbstractID3Parser {
      async postId3v2Parse() {
        const signature = await this.tokenizer.peekToken(new StringType(3, "latin1"));
        let mpcParser;
        switch (signature) {
          case "MP+": {
            debug23("Stream-version 7");
            mpcParser = new MpcSv7Parser(this.metadata, this.tokenizer, this.options);
            break;
          }
          case "MPC": {
            debug23("Stream-version 8");
            mpcParser = new MpcSv8Parser(this.metadata, this.tokenizer, this.options);
            break;
          }
          default: {
            throw new MusepackContentError("Invalid signature prefix");
          }
        }
        this.metadata.setAudioOnly();
        return mpcParser.parse();
      }
    };
  }
});

// node_modules/music-metadata/lib/musepack/MusepackLoader.js
var musepackParserLoader;
var init_MusepackLoader = __esm({
  "node_modules/music-metadata/lib/musepack/MusepackLoader.js"() {
    musepackParserLoader = {
      parserType: "musepack",
      extensions: [".mpc"],
      mimeTypes: ["audio/musepack"],
      async load() {
        return (await Promise.resolve().then(() => (init_MusepackParser(), MusepackParser_exports))).MusepackParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/flac/FlacStream.js
var import_debug24, FlacContentError2, debug24, FlacStream;
var init_FlacStream = __esm({
  "node_modules/music-metadata/lib/ogg/flac/FlacStream.js"() {
    import_debug24 = __toESM(require_src(), 1);
    init_Allocation();
    init_FourCC();
    init_FlacParser();
    init_FlacToken();
    init_ParseError();
    init_Vorbis();
    FlacContentError2 = class extends makeUnexpectedFileContentError("FLAC") {
    };
    debug24 = (0, import_debug24.default)("music-metadata:parser:ogg:flac");
    FlacStream = class {
      metadata;
      options;
      flacParser;
      lastPageHeader;
      lastGranulePosition;
      durationOnLastPage = true;
      isMetadataComplete = false;
      identified = false;
      packetParts = [];
      packetLength = 0;
      constructor(metadata, options, tokenizer) {
        this.metadata = metadata;
        this.options = options;
        this.flacParser = new FlacParser(this.metadata, tokenizer, options);
      }
      /** Assemble metadata packets using the page lacing table. */
      async parsePage(header, pageData, lacingValues = new Uint8Array()) {
        this.lastPageHeader = header;
        if (header.absoluteGranulePosition >= 0) {
          this.lastGranulePosition = header.absoluteGranulePosition;
        }
        if (this.isMetadataComplete) {
          return;
        }
        if (header.headerType.continued !== this.packetLength > 0) {
          throw new FlacContentError2("Invalid Ogg/FLAC packet continuation");
        }
        if (lacingValues.reduce((sum, length) => sum + length, 0) !== pageData.length) {
          throw new FlacContentError2("Ogg/FLAC lacing does not match page data");
        }
        let offset = 0;
        for (const length of lacingValues) {
          validateAllocation(this.packetLength + length, this.options);
          if (length > 0) {
            if (this.packetParts.length >= getMaxMetadataEntries(this.options)) {
              throw new FlacContentError2("Buffered Ogg/FLAC segment count exceeds entry limit");
            }
            this.packetParts.push(pageData.subarray(offset, offset + length));
            this.packetLength += length;
          }
          offset += length;
          if (length < 255) {
            const packet = new Uint8Array(this.packetLength);
            let position = 0;
            for (const part of this.packetParts) {
              packet.set(part, position);
              position += part.length;
            }
            this.packetParts = [];
            this.packetLength = 0;
            await this.parsePacket(packet);
            if (this.isMetadataComplete) {
              break;
            }
          }
        }
        if (header.headerType.lastPage) {
          await this.flush();
        }
      }
      async parsePacket(packet) {
        if (!this.identified) {
          await this.parseFirstPage(packet);
          this.identified = true;
          return;
        }
        if (packet.length < BlockHeader.len) {
          throw new FlacContentError2("Truncated Ogg/FLAC metadata header");
        }
        const header = BlockHeader.get(packet, 0);
        if (header.type === BlockType.STREAMINFO) {
          throw new FlacContentError2("Unexpected repeated Ogg/FLAC STREAMINFO");
        }
        if (header.length !== packet.length - BlockHeader.len) {
          throw new FlacContentError2("Ogg/FLAC metadata block length does not match packet");
        }
        await this.parseDataBlock(header, packet.subarray(BlockHeader.len));
        this.isMetadataComplete = header.lastBlock;
      }
      calculateDuration(enfOfStream) {
        if (this.lastPageHeader && (enfOfStream || this.lastPageHeader.headerType.lastPage) && this.metadata.format.sampleRate && this.lastGranulePosition !== void 0) {
          this.metadata.setFormat("numberOfSamples", this.lastGranulePosition);
          this.metadata.setFormat("duration", this.lastGranulePosition / this.metadata.format.sampleRate);
        }
      }
      async parseFirstPage(packet) {
        debug24("First Ogg/FLAC packet");
        if (packet.length !== 13 + BlockHeader.len + BlockStreamInfo.len) {
          throw new FlacContentError2("Invalid Ogg/FLAC identification packet length");
        }
        if (packet[0] !== 127 || FourCcToken.get(packet, 1) !== "FLAC" || packet[5] !== 1 || FourCcToken.get(packet, 9) !== "fLaC") {
          throw new FlacContentError2("Invalid Ogg/FLAC preamble or mapping version");
        }
        const header = BlockHeader.get(packet, 13);
        if (header.type !== BlockType.STREAMINFO || header.length !== BlockStreamInfo.len) {
          throw new FlacContentError2("Invalid Ogg/FLAC STREAMINFO header");
        }
        await this.parseDataBlock(header, packet.subarray(17));
        this.isMetadataComplete = header.lastBlock;
      }
      async parseDataBlock(blockHeader, pageData) {
        debug24(`blockHeader type=${blockHeader.type}, length=${blockHeader.length}`);
        switch (blockHeader.type) {
          case BlockType.STREAMINFO: {
            const streamInfo = BlockStreamInfo.get(pageData, 0);
            return this.flacParser.processsStreamInfo(streamInfo);
          }
          case BlockType.PADDING:
            break;
          case BlockType.APPLICATION:
            break;
          case BlockType.SEEKTABLE:
          case BlockType.CUESHEET:
            break;
          case BlockType.VORBIS_COMMENT:
            return this.flacParser.parseComment(pageData);
          case BlockType.PICTURE:
            if (!this.options.skipCovers) {
              this.validatePicture(pageData);
              const picture = new VorbisPictureToken(pageData.length).get(pageData, 0);
              return this.flacParser.addPictureTag(picture);
            }
            break;
          default:
            this.metadata.addWarning(`Unknown block type: ${blockHeader.type}`);
        }
      }
      validatePicture(data) {
        if (data.length < 32) {
          throw new FlacContentError2("Truncated Ogg/FLAC picture");
        }
        const view = new DataView(data.buffer, data.byteOffset, data.byteLength);
        const mimeLength = view.getUint32(4);
        if (mimeLength > data.length - 32) {
          throw new FlacContentError2("Ogg/FLAC picture MIME length exceeds block");
        }
        const descriptionLength = view.getUint32(8 + mimeLength);
        if (descriptionLength > data.length - 32 - mimeLength) {
          throw new FlacContentError2("Ogg/FLAC picture description length exceeds block");
        }
        const headerLength = 32 + mimeLength + descriptionLength;
        if (view.getUint32(headerLength - 4) !== data.length - headerLength) {
          throw new FlacContentError2("Ogg/FLAC picture data length does not match block");
        }
      }
      async flush() {
        if (this.packetLength > 0 || this.identified && !this.isMetadataComplete) {
          throw new FlacContentError2("Truncated Ogg/FLAC metadata packet");
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/OggStreamMetadata.js
var OggStreamMetadata;
var init_OggStreamMetadata = __esm({
  "node_modules/music-metadata/lib/ogg/OggStreamMetadata.js"() {
    init_MetadataCollector();
    OggStreamMetadata = class extends MetadataCollector {
      parent;
      constructor(parent) {
        super();
        this.parent = parent;
        this.native = parent.native;
        this.quality = parent.quality;
      }
      setFormat(key, value) {
        super.setFormat(key, value);
        if (key !== "hasAudio" && key !== "hasVideo" || value === true) {
          this.parent.setFormat(key, value);
        }
      }
      registerTagType(tagType2) {
        this.parent.registerTagType(tagType2);
      }
      addTag(tagType2, tagId, value) {
        return this.parent.addTag(tagType2, tagId, value);
      }
      addWarning(warning) {
        this.parent.addWarning(warning);
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/OggToken.js
var PageHeader, SegmentTable;
var init_OggToken = __esm({
  "node_modules/music-metadata/lib/ogg/OggToken.js"() {
    init_lib3();
    init_lib3();
    init_Util();
    PageHeader = {
      len: 27,
      get: (buf, off) => {
        const granulePosition = UINT64_LE.get(buf, off + 6);
        return {
          capturePattern: new StringType(4, "latin1").get(buf, off),
          version: UINT8.get(buf, off + 4),
          headerType: {
            continued: getBit(buf, off + 5, 0),
            firstPage: getBit(buf, off + 5, 1),
            lastPage: getBit(buf, off + 5, 2)
          },
          // packet_flag: Token.UINT8.get(buf, off + 5),
          absoluteGranulePosition: granulePosition === 0xffffffffffffffffn ? -1 : Number(granulePosition),
          streamSerialNumber: UINT32_LE.get(buf, off + 14),
          pageSequenceNo: UINT32_LE.get(buf, off + 18),
          pageChecksum: UINT32_LE.get(buf, off + 22),
          page_segments: UINT8.get(buf, off + 26)
        };
      }
    };
    SegmentTable = class {
      len;
      constructor(header) {
        this.len = header.page_segments;
      }
      get(buf, off) {
        const lacingValues = Uint8Array.from(buf.subarray(off, off + this.len));
        return {
          totalPageSize: lacingValues.reduce((sum, length) => sum + length, 0),
          lacingValues
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/opus/Opus.js
var OpusContentError, IdHeader;
var init_Opus = __esm({
  "node_modules/music-metadata/lib/ogg/opus/Opus.js"() {
    init_lib3();
    init_ParseError();
    OpusContentError = class extends makeUnexpectedFileContentError("Opus") {
    };
    IdHeader = class {
      len;
      constructor(len) {
        if (len < 19) {
          throw new OpusContentError("ID-header-page 0 should be at least 19 bytes long");
        }
        this.len = len;
      }
      get(buf, off) {
        return {
          magicSignature: new StringType(8, "ascii").get(buf, off + 0),
          version: UINT8.get(buf, off + 8),
          channelCount: UINT8.get(buf, off + 9),
          preSkip: UINT16_LE.get(buf, off + 10),
          inputSampleRate: UINT32_LE.get(buf, off + 12),
          outputGain: UINT16_LE.get(buf, off + 16),
          channelMapping: UINT8.get(buf, off + 18)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/opus/OpusStream.js
var OpusStream;
var init_OpusStream = __esm({
  "node_modules/music-metadata/lib/ogg/opus/OpusStream.js"() {
    init_lib3();
    init_VorbisStream();
    init_Opus();
    init_Opus();
    OpusStream = class extends VorbisStream {
      idHeader = null;
      lastPos = -1;
      tokenizer;
      constructor(metadata, options, tokenizer) {
        super(metadata, options);
        this.tokenizer = tokenizer;
        this.durationOnLastPage = true;
      }
      /**
       * Parse first Opus Ogg page
       * @param {IPageHeader} header
       * @param {Uint8Array} pageData
       */
      parseFirstPage(_header, pageData) {
        this.metadata.setFormat("codec", "Opus");
        this.metadata.setFormat("lossless", false);
        this.idHeader = new IdHeader(pageData.length).get(pageData, 0);
        if (this.idHeader.magicSignature !== "OpusHead") {
          throw new OpusContentError("Illegal ogg/Opus magic-signature");
        }
        this.metadata.setFormat("sampleRate", this.idHeader.inputSampleRate);
        this.metadata.setFormat("numberOfChannels", this.idHeader.channelCount);
        this.metadata.setAudioOnly();
      }
      async parseFullPage(pageData) {
        const magicSignature = new StringType(8, "ascii").get(pageData, 0);
        switch (magicSignature) {
          case "OpusTags":
            await this.parseUserCommentList(pageData, 8);
            this.lastPos = this.tokenizer.position - pageData.length;
            break;
          default:
            break;
        }
      }
      calculateDuration(enfOfStream) {
        if (this.lastPageHeader && (enfOfStream || this.lastPageHeader.headerType.lastPage) && this.metadata.format.sampleRate && this.lastPageHeader.absoluteGranulePosition >= 0) {
          const pos_48bit = this.lastPageHeader.absoluteGranulePosition - this.idHeader.preSkip;
          this.metadata.setFormat("numberOfSamples", pos_48bit);
          this.metadata.setFormat("duration", pos_48bit / 48e3);
          if (this.lastPos !== -1 && this.tokenizer.fileInfo.size && this.metadata.format.duration) {
            const dataSize = this.tokenizer.fileInfo.size - this.lastPos;
            this.metadata.setFormat("bitrate", 8 * dataSize / this.metadata.format.duration);
          }
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/speex/Speex.js
var Header5;
var init_Speex = __esm({
  "node_modules/music-metadata/lib/ogg/speex/Speex.js"() {
    init_lib3();
    init_Util();
    Header5 = {
      len: 80,
      get: (buf, off) => {
        return {
          speex: new StringType(8, "ascii").get(buf, off + 0),
          version: trimRightNull(new StringType(20, "ascii").get(buf, off + 8)),
          version_id: INT32_LE.get(buf, off + 28),
          header_size: INT32_LE.get(buf, off + 32),
          rate: INT32_LE.get(buf, off + 36),
          mode: INT32_LE.get(buf, off + 40),
          mode_bitstream_version: INT32_LE.get(buf, off + 44),
          nb_channels: INT32_LE.get(buf, off + 48),
          bitrate: INT32_LE.get(buf, off + 52),
          frame_size: INT32_LE.get(buf, off + 56),
          vbr: INT32_LE.get(buf, off + 60),
          frames_per_packet: INT32_LE.get(buf, off + 64),
          extra_headers: INT32_LE.get(buf, off + 68),
          reserved1: INT32_LE.get(buf, off + 72),
          reserved2: INT32_LE.get(buf, off + 76)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/speex/SpeexStream.js
var import_debug25, SpeexContentError, debug25, SpeexStream;
var init_SpeexStream = __esm({
  "node_modules/music-metadata/lib/ogg/speex/SpeexStream.js"() {
    import_debug25 = __toESM(require_src(), 1);
    init_ParseError();
    init_VorbisStream();
    init_Speex();
    SpeexContentError = class extends makeUnexpectedFileContentError("Speex") {
    };
    debug25 = (0, import_debug25.default)("music-metadata:parser:ogg:speex");
    SpeexStream = class extends VorbisStream {
      commentHeaderParsed = false;
      constructor(metadata, options, _tokenizer) {
        super(metadata, options);
      }
      /**
       * Parse first Speex Ogg page
       * @param {IPageHeader} header
       * @param {Uint8Array} pageData
       */
      parseFirstPage(_header, pageData) {
        debug25("First Ogg/Speex page");
        if (pageData.length < Header5.len) {
          throw new SpeexContentError("Truncated Speex identification header");
        }
        const speexHeader = Header5.get(pageData, 0);
        this.metadata.setFormat("codec", `Speex ${speexHeader.version}`);
        this.metadata.setFormat("lossless", false);
        this.metadata.setFormat("numberOfChannels", speexHeader.nb_channels);
        this.metadata.setFormat("sampleRate", speexHeader.rate);
        if (speexHeader.bitrate !== -1) {
          this.metadata.setFormat("bitrate", speexHeader.bitrate);
        }
        this.metadata.setAudioOnly();
      }
      /**
       * The packet following the identification header is the comment header, in
       * Vorbis comment format but without a packet type or magic signature.
       * Ref: https://tools.ietf.org/html/rfc5574#section-3
       */
      async parseFullPage(pageData) {
        if (this.commentHeaderParsed) {
          return;
        }
        this.commentHeaderParsed = true;
        debug25("Parse Ogg/Speex comment header");
        await this.parseUserCommentList(pageData, 0);
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/theora/Theora.js
var IdentificationHeader2;
var init_Theora = __esm({
  "node_modules/music-metadata/lib/ogg/theora/Theora.js"() {
    init_lib3();
    IdentificationHeader2 = {
      len: 42,
      get: (buf, off) => {
        return {
          id: new StringType(7, "ascii").get(buf, off),
          vmaj: UINT8.get(buf, off + 7),
          vmin: UINT8.get(buf, off + 8),
          vrev: UINT8.get(buf, off + 9),
          vmbw: UINT16_BE.get(buf, off + 10),
          vmbh: UINT16_BE.get(buf, off + 12),
          picw: UINT24_BE.get(buf, off + 14),
          pich: UINT24_BE.get(buf, off + 17),
          frn: UINT32_BE.get(buf, off + 22),
          frd: UINT32_BE.get(buf, off + 26),
          nombr: UINT24_BE.get(buf, off + 37),
          nqual: UINT16_BE.get(buf, off + 40) >> 10,
          keyframeGranuleShift: UINT16_BE.get(buf, off + 40) >> 5 & 31
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/theora/TheoraStream.js
var import_debug26, TheoraContentError, debug26, TheoraStream;
var init_TheoraStream = __esm({
  "node_modules/music-metadata/lib/ogg/theora/TheoraStream.js"() {
    import_debug26 = __toESM(require_src(), 1);
    init_ParseError();
    init_type();
    init_Theora();
    TheoraContentError = class extends makeUnexpectedFileContentError("Theora") {
    };
    debug26 = (0, import_debug26.default)("music-metadata:parser:ogg:theora");
    TheoraStream = class {
      metadata;
      durationOnLastPage = true;
      identification;
      lastPageHeader;
      lastGranulePosition;
      constructor(metadata, _options, _tokenizer) {
        this.metadata = metadata;
      }
      /**
       * Vorbis 1 parser
       * @param header Ogg Page Header
       * @param pageData Page data
       */
      async parsePage(header, pageData) {
        this.lastPageHeader = header;
        if (Number.isSafeInteger(header.absoluteGranulePosition) && header.absoluteGranulePosition >= 0) {
          this.lastGranulePosition = header.absoluteGranulePosition;
        }
        if (header.headerType.firstPage) {
          await this.parseFirstPage(header, pageData);
        }
      }
      calculateDuration(endOfStream) {
        const info = this.identification;
        const granule = this.lastGranulePosition;
        if (!info || !this.lastPageHeader || !(endOfStream || this.lastPageHeader.headerType.lastPage) || granule === void 0 || info.frn <= 0 || info.frd <= 0) {
          return;
        }
        const scale = 2 ** info.keyframeGranuleShift;
        const legacy = info.vmaj * 65536 + info.vmin * 256 + info.vrev < 197121;
        const frames = Math.floor(granule / scale) + granule % scale + Number(legacy);
        if (frames > 0) {
          const duration = frames * info.frd / info.frn;
          this.metadata.format.trackInfo[0].duration = duration;
        }
      }
      /**
       * Parse first Theora Ogg page. the initial identification header packet
       */
      async parseFirstPage(_header, pageData) {
        debug26("First Ogg/Theora page");
        this.metadata.setFormat("codec", "Theora");
        if (pageData.length < IdentificationHeader2.len) {
          throw new TheoraContentError("Truncated Theora identification header");
        }
        const idHeader = IdentificationHeader2.get(pageData, 0);
        this.identification = idHeader;
        this.metadata.setFormat("bitrate", idHeader.nombr);
        this.metadata.setFormat("hasVideo", true);
        this.metadata.addStreamInfo({
          type: TrackType.video,
          codecName: "Theora",
          ...idHeader.nombr > 0 ? { bitrate: idHeader.nombr } : {},
          video: {
            pixelWidth: idHeader.vmbw * 16,
            pixelHeight: idHeader.vmbh * 16,
            displayWidth: idHeader.picw,
            displayHeight: idHeader.pich,
            ...idHeader.frd > 0 && idHeader.frn > 0 ? { frameRate: idHeader.frn / idHeader.frd } : {}
          }
        });
      }
      flush() {
        return Promise.resolve();
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/OggParser.js
var OggParser_exports = {};
__export(OggParser_exports, {
  OggContentError: () => OggContentError,
  OggParser: () => OggParser
});
var import_debug27, OggContentError, debug27, OggStream, OggParser;
var init_OggParser = __esm({
  "node_modules/music-metadata/lib/ogg/OggParser.js"() {
    import_debug27 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_Allocation();
    init_BasicParser();
    init_TrackInfo();
    init_ParseError();
    init_type();
    init_FlacStream();
    init_OggStreamMetadata();
    init_OggToken();
    init_OpusStream();
    init_SpeexStream();
    init_TheoraStream();
    init_VorbisStream();
    OggContentError = class extends makeUnexpectedFileContentError("Ogg") {
    };
    debug27 = (0, import_debug27.default)("music-metadata:parser:ogg");
    OggStream = class {
      metadata;
      streamSerial;
      pageNumber = 0;
      payloadBytes = 0;
      closed = false;
      options;
      pageConsumer;
      isSkeleton = false;
      constructor(metadata, streamSerial, options) {
        this.metadata = new OggStreamMetadata(metadata);
        this.streamSerial = streamSerial;
        this.options = options;
      }
      async parsePage(tokenizer, header) {
        this.pageNumber = header.pageSequenceNo;
        debug27("serial=%s page#=%s, Ogg.id=%s", header.streamSerialNumber, header.pageSequenceNo, header.capturePattern);
        const segmentTable = await tokenizer.readToken(new SegmentTable(header));
        debug27("totalPageSize=%s", segmentTable.totalPageSize);
        const pageData = await readToken(tokenizer, new Uint8ArrayType(segmentTable.totalPageSize), this.options);
        this.payloadBytes += pageData.length;
        debug27("firstPage=%s, lastPage=%s, continued=%s", header.headerType.firstPage, header.headerType.lastPage, header.headerType.continued);
        if (header.headerType.firstPage) {
          this.metadata.setFormat("container", "Ogg");
          const idData = pageData.subarray(0, 7);
          const asciiId = Array.from(idData).filter((b) => b >= 32 && b <= 126).map((b) => String.fromCharCode(b)).join("");
          switch (asciiId) {
            case "vorbis":
              debug27(`Set Ogg stream serial ${header.streamSerialNumber}, codec=Vorbis`);
              this.pageConsumer = new VorbisStream(this.metadata, this.options);
              break;
            case "OpusHea":
              debug27("Set page consumer to Ogg/Opus");
              this.pageConsumer = new OpusStream(this.metadata, this.options, tokenizer);
              break;
            case "Speex  ":
              debug27("Set page consumer to Ogg/Speex");
              this.pageConsumer = new SpeexStream(this.metadata, this.options, tokenizer);
              break;
            case "fishead":
              this.isSkeleton = true;
              break;
            case "theora":
              debug27("Set page consumer to Ogg/Theora");
              this.pageConsumer = new TheoraStream(this.metadata, this.options, tokenizer);
              break;
            case "FLAC":
              debug27("Set page consumer to Vorbis");
              this.pageConsumer = new FlacStream(this.metadata, this.options, tokenizer);
              break;
            default:
              throw new OggContentError(`Ogg codec not recognized (id=${asciiId}`);
          }
        }
        if (header.headerType.lastPage) {
          this.closed = true;
        }
        if (this.isSkeleton) {
          return;
        }
        if (this.pageConsumer) {
          await this.pageConsumer.parsePage(header, pageData, segmentTable.lacingValues);
        } else {
          throw new Error("pageConsumer should be initialized");
        }
      }
    };
    OggParser = class extends BasicParser {
      streams = /* @__PURE__ */ new Map();
      /**
       * Parse page
       * @returns {Promise<void>}
       */
      async parse() {
        this.streams = /* @__PURE__ */ new Map();
        const maxLogicalStreams = getMaxMetadataEntries(this.options);
        let enfOfStream = false;
        let stoppedEarly = false;
        let header;
        try {
          do {
            header = await this.tokenizer.readToken(PageHeader);
            if (header.capturePattern !== "OggS") {
              throw new OggContentError("Invalid Ogg capture pattern");
            }
            let stream = this.streams.get(header.streamSerialNumber);
            if (!stream) {
              if (this.streams.size >= maxLogicalStreams) {
                throw new OggContentError("Logical stream count exceeds entry limit");
              }
              stream = new OggStream(this.metadata, header.streamSerialNumber, this.options);
              this.streams.set(header.streamSerialNumber, stream);
            }
            await stream.parsePage(this.tokenizer, header);
            if (stream.pageNumber > 12 && // A comment (including its cover art) may span more than 13 pages.
            [...this.streams.values()].every((stream2) => stream2.pageConsumer?.isMetadataComplete !== false) && !(this.options.duration && [...this.streams.values()].find((stream2) => stream2.pageConsumer?.durationOnLastPage))) {
              stoppedEarly = true;
              debug27("Stop processing Ogg stream");
              break;
            }
          } while (![...this.streams.values()].every((item) => item.closed));
        } catch (err) {
          if (err instanceof EndOfStreamError) {
            debug27("Reached end-of-stream");
            enfOfStream = true;
          } else if (err instanceof OggContentError) {
            this.metadata.addWarning(`Corrupt Ogg content at ${this.tokenizer.position}`);
          } else {
            throw err;
          }
        }
        for (const stream of this.streams.values()) {
          if (!stream.closed) {
            if (!stoppedEarly) {
              this.metadata.addWarning(`End-of-stream reached before reaching last page in Ogg stream serial=${stream.streamSerial}`);
            }
            await stream.pageConsumer?.flush();
          }
          stream.pageConsumer?.calculateDuration(enfOfStream);
          const format = stream.metadata.format;
          if (format.hasAudio) {
            const track = createAudioTrackInfo(format);
            track.id = stream.streamSerial;
            if (format.codec === "Opus") {
              delete track.bitrate;
              if (track.duration && track.duration > 0 && stream.closed) {
                track.bitrate = stream.payloadBytes * 8 / track.duration;
              }
            }
            if (format.codec === "Opus" && track.audio) {
              track.audio.outputSamplingFrequency = 48e3;
            }
            this.metadata.addStreamInfo(track);
          } else if (format.hasVideo) {
            const track = format.trackInfo[0] ?? { type: TrackType.video, codecName: format.codec };
            track.id = stream.streamSerial;
            if (track.duration && track.duration > 0 && (stream.closed || enfOfStream)) {
              track.bitrate = stream.payloadBytes * 8 / track.duration;
            }
            this.metadata.addStreamInfo(track);
          }
        }
        for (const flag of ["hasAudio", "hasVideo"]) {
          const present = [...this.streams.values()].some((stream) => stream.metadata.format[flag] === true);
          if (this.metadata.format[flag] !== present) {
            this.metadata.setFormat(flag, present);
          }
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/ogg/OggLoader.js
var oggParserLoader;
var init_OggLoader = __esm({
  "node_modules/music-metadata/lib/ogg/OggLoader.js"() {
    oggParserLoader = {
      parserType: "ogg",
      extensions: [".ogg", ".ogv", ".oga", ".ogm", ".ogx", ".opus", ".spx"],
      mimeTypes: ["application/ogg", "audio/ogg", "audio/opus", "audio/speex", "video/ogg"],
      // RFC 5334, RFC 7845, RFC 6716, RFC 5574
      async load() {
        return (await Promise.resolve().then(() => (init_OggParser(), OggParser_exports))).OggParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/riff/RiffChunk.js
var Header6, ListInfoTagValue;
var init_RiffChunk = __esm({
  "node_modules/music-metadata/lib/riff/RiffChunk.js"() {
    init_lib3();
    Header6 = {
      len: 8,
      get: (buf, off) => {
        return {
          // Group-ID
          chunkID: new StringType(4, "latin1").get(buf, off),
          // Size
          chunkSize: UINT32_LE.get(buf, off + 4)
        };
      }
    };
    ListInfoTagValue = class {
      encoding;
      len;
      tagHeader;
      constructor(tagHeader, encoding = "latin1") {
        this.encoding = encoding;
        this.tagHeader = tagHeader;
        this.len = tagHeader.chunkSize;
        this.len += this.len & 1;
      }
      get(buf, off) {
        return new StringType(this.tagHeader.chunkSize, this.encoding).get(buf, off).split("\0", 1)[0];
      }
    };
  }
});

// node_modules/music-metadata/lib/wav/WaveChunk.js
var WaveContentError, WaveFormat, WaveFormatNameMap, Format, FactChunk;
var init_WaveChunk = __esm({
  "node_modules/music-metadata/lib/wav/WaveChunk.js"() {
    init_lib3();
    init_ParseError();
    WaveContentError = class extends makeUnexpectedFileContentError("Wave") {
    };
    WaveFormat = {
      PCM: 1,
      ADPCM: 2,
      IEEE_FLOAT: 3,
      ALAW: 6,
      MULAW: 7,
      DVI_ADPCM: 17,
      GSM610: 49,
      // MPEG-4 and AAC Audio Types
      MPEG_ADTS_AAC: 5632,
      MPEG_LOAS: 5634,
      RAW_AAC1: 255,
      // Dolby Audio Types
      DOLBY_AC3_SPDIF: 146,
      DVM: 8192,
      RAW_SPORT: 576,
      ESST_AC3: 577,
      DRM: 9,
      DTS2: 8193,
      MPEG: 80,
      MPEGLAYER3: 85
    };
    WaveFormatNameMap = {
      [WaveFormat.PCM]: "PCM",
      [WaveFormat.ADPCM]: "ADPCM",
      [WaveFormat.IEEE_FLOAT]: "IEEE_FLOAT",
      [WaveFormat.ALAW]: "ALAW",
      [WaveFormat.MULAW]: "MULAW",
      [WaveFormat.DVI_ADPCM]: "DVI_ADPCM",
      [WaveFormat.GSM610]: "GSM610",
      [WaveFormat.MPEG_ADTS_AAC]: "MPEG_ADTS_AAC",
      [WaveFormat.MPEG_LOAS]: "MPEG_LOAS",
      [WaveFormat.RAW_AAC1]: "RAW_AAC1",
      [WaveFormat.DOLBY_AC3_SPDIF]: "DOLBY_AC3_SPDIF",
      [WaveFormat.DVM]: "DVM",
      [WaveFormat.RAW_SPORT]: "RAW_SPORT",
      [WaveFormat.ESST_AC3]: "ESST_AC3",
      [WaveFormat.DRM]: "DRM",
      [WaveFormat.DTS2]: "DTS2",
      [WaveFormat.MPEG]: "MPEG",
      [WaveFormat.MPEGLAYER3]: "MPEGLAYER3"
    };
    Format = class {
      len;
      constructor(header) {
        if (header.chunkSize < 16) {
          throw new WaveContentError("Invalid chunk size");
        }
        this.len = header.chunkSize;
      }
      get(buf, off) {
        return {
          wFormatTag: UINT16_LE.get(buf, off),
          nChannels: UINT16_LE.get(buf, off + 2),
          nSamplesPerSec: UINT32_LE.get(buf, off + 4),
          nAvgBytesPerSec: UINT32_LE.get(buf, off + 8),
          nBlockAlign: UINT16_LE.get(buf, off + 12),
          wBitsPerSample: UINT16_LE.get(buf, off + 14)
        };
      }
    };
    FactChunk = class {
      len;
      constructor(header) {
        if (header.chunkSize < 4) {
          throw new WaveContentError("Invalid fact chunk size.");
        }
        this.len = header.chunkSize;
      }
      get(buf, off) {
        return {
          dwSampleLength: UINT32_LE.get(buf, off)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/wav/BwfChunk.js
var BroadcastAudioExtensionChunk;
var init_BwfChunk = __esm({
  "node_modules/music-metadata/lib/wav/BwfChunk.js"() {
    init_lib3();
    init_Util();
    init_WaveChunk();
    BroadcastAudioExtensionChunk = class {
      len;
      constructor(length) {
        if (length < 348) {
          throw new WaveContentError("BWF extension is shorter than its 348-byte base header");
        }
        this.len = Math.min(length, 422);
      }
      get(uint8array, off) {
        const version = UINT16_LE.get(uint8array, off + 346);
        if (version >= 2 && this.len < 422) {
          throw new WaveContentError("BWF v2 extension is missing loudness fields");
        }
        const result = {
          description: stripNulls(new StringType(256, "ascii").get(uint8array, off)).trim(),
          originator: stripNulls(new StringType(32, "ascii").get(uint8array, off + 256)).trim(),
          originatorReference: stripNulls(new StringType(32, "ascii").get(uint8array, off + 288)).trim(),
          originationDate: stripNulls(new StringType(10, "ascii").get(uint8array, off + 320)).trim(),
          originationTime: stripNulls(new StringType(8, "ascii").get(uint8array, off + 330)).trim(),
          timeReferenceLow: UINT32_LE.get(uint8array, off + 338),
          timeReferenceHigh: UINT32_LE.get(uint8array, off + 342),
          version
        };
        if (version >= 1 && this.len >= 412) {
          result.umid = new Uint8ArrayType(64).get(uint8array, off + 348);
        }
        if (version >= 2) {
          const fields = [
            "loudnessValue",
            "loudnessRange",
            "maxTruePeakLevel",
            "maxMomentaryLoudness",
            "maxShortTermLoudness"
          ];
          for (const [index, field] of fields.entries()) {
            const value = INT16_LE.get(uint8array, off + 412 + index * 2);
            if (value >= (field === "loudnessRange" ? 0 : -9999) && value <= 9999) {
              result[field] = value;
            }
          }
        }
        return result;
      }
    };
  }
});

// node_modules/music-metadata/lib/wav/WaveParser.js
var WaveParser_exports = {};
__export(WaveParser_exports, {
  WaveParser: () => WaveParser
});
var import_debug28, debug28, WaveParser;
var init_WaveParser = __esm({
  "node_modules/music-metadata/lib/wav/WaveParser.js"() {
    import_debug28 = __toESM(require_src(), 1);
    init_lib();
    init_lib3();
    init_Allocation();
    init_BasicParser();
    init_FourCC();
    init_EmbeddedID3v2();
    init_RiffChunk();
    init_BwfChunk();
    init_WaveChunk();
    init_WaveChunk();
    debug28 = (0, import_debug28.default)("music-metadata:parser:RIFF");
    WaveParser = class extends BasicParser {
      // CSET applies to the whole file, including INFO chunks preceding it.
      codePage;
      pendingInfoTags = [];
      fact;
      blockAlign = 0;
      avgBytesPerSec = 0;
      async parse() {
        const riffHeader = await this.readToken(Header6);
        debug28(`pos=${this.tokenizer.position}, parse: chunkID=${riffHeader.chunkID}`);
        if (riffHeader.chunkID !== "RIFF") {
          return;
        }
        this.metadata.setAudioOnly();
        await this.parseRiffChunk(riffHeader.chunkSize).catch((err) => {
          if (!(err instanceof EndOfStreamError)) {
            throw err;
          }
        });
        await this.flushInfoTags();
      }
      async parseRiffChunk(chunkSize) {
        const type = await this.readToken(FourCcToken);
        this.metadata.setFormat("container", type);
        switch (type) {
          case "WAVE":
            return this.readWaveChunk(chunkSize - FourCcToken.len);
          default:
            throw new WaveContentError(`Unsupported RIFF format: RIFF/${type}`);
        }
      }
      async readWaveChunk(remaining) {
        while (remaining >= Header6.len) {
          const header = await this.readToken(Header6);
          remaining -= Header6.len;
          if (header.chunkSize > remaining) {
            this.metadata.addWarning("Data chunk size exceeds file size");
            if (["CSET", "LIST", "fact", "fmt ", "id3 ", "ID3 ", "bext"].includes(header.chunkID)) {
              throw new WaveContentError(`Chunk ${header.chunkID} size ${header.chunkSize} exceeds remaining RIFF data ${remaining}`);
            }
          }
          remaining -= header.chunkSize + (header.chunkSize & 1);
          debug28(`pos=${this.tokenizer.position}, readChunk: chunkID=RIFF/WAVE/${header.chunkID}`);
          switch (header.chunkID) {
            case "CSET": {
              if (header.chunkSize < 8) {
                throw new WaveContentError("CSET chunk must contain at least 8 bytes");
              }
              const cset = await this.readToken(new Uint8ArrayType(header.chunkSize));
              this.codePage = UINT16_LE.get(cset, 0);
              if (!this.getInfoEncoding()) {
                this.metadata.addWarning(`Unsupported RIFF CSET code page: ${this.codePage}; LIST/INFO tags will be omitted`);
              }
              await this.flushInfoTags();
              break;
            }
            case "LIST":
              await this.parseListTag(header);
              break;
            case "fact":
              this.metadata.setFormat("lossless", false);
              this.fact = await this.readToken(new FactChunk(header));
              break;
            case "fmt ": {
              const fmt = await this.readToken(new Format(header));
              let subFormat = WaveFormatNameMap[fmt.wFormatTag];
              if (!subFormat) {
                debug28(`WAVE/non-PCM format=${fmt.wFormatTag}`);
                subFormat = `non-PCM (${fmt.wFormatTag})`;
              }
              this.metadata.setFormat("codec", subFormat);
              this.metadata.setFormat("bitsPerSample", fmt.wBitsPerSample);
              this.metadata.setFormat("sampleRate", fmt.nSamplesPerSec);
              this.metadata.setFormat("numberOfChannels", fmt.nChannels);
              this.blockAlign = fmt.nBlockAlign;
              this.avgBytesPerSec = fmt.nAvgBytesPerSec;
              break;
            }
            case "id3 ":
            // The way Picard, FooBar currently stores, ID3 meta-data
            case "ID3 ": {
              await parseEmbeddedID3v2(this.metadata, this.tokenizer, this.options, header.chunkSize);
              break;
            }
            case "data": {
              if (this.metadata.format.lossless !== false) {
                this.metadata.setFormat("lossless", true);
              }
              let chunkSize = header.chunkSize;
              if (this.tokenizer.fileInfo.size) {
                const calcRemaining = this.tokenizer.fileInfo.size - this.tokenizer.position;
                if (calcRemaining < chunkSize) {
                  this.metadata.addWarning("data chunk length exceeding file length");
                  chunkSize = calcRemaining;
                }
              }
              const numberOfSamples = this.fact ? this.fact.dwSampleLength : chunkSize === 4294967295 ? void 0 : chunkSize / this.blockAlign;
              if (numberOfSamples) {
                this.metadata.setFormat("numberOfSamples", numberOfSamples);
                if (this.metadata.format.sampleRate) {
                  this.metadata.setFormat("duration", numberOfSamples / this.metadata.format.sampleRate);
                }
              }
              if (this.avgBytesPerSec > 0) {
                this.metadata.setFormat("bitrate", this.avgBytesPerSec * 8);
              } else if (this.metadata.format.duration) {
                this.metadata.setFormat("bitrate", chunkSize * 8 / this.metadata.format.duration);
              }
              await this.tokenizer.ignore(header.chunkSize);
              break;
            }
            case "bext": {
              const token = new BroadcastAudioExtensionChunk(header.chunkSize);
              const bext = await this.readToken(token);
              for (const key of Object.keys(bext)) {
                await this.metadata.addTag("exif", `bext.${key}`, bext[key]);
              }
              const bextRemaining = header.chunkSize - token.len;
              await this.tokenizer.ignore(bextRemaining);
              break;
            }
            case "\0\0\0\0":
              debug28(`Ignore padding chunk: RIFF/${header.chunkID} of ${header.chunkSize} bytes`);
              this.metadata.addWarning(`Ignore chunk: RIFF/${header.chunkID}`);
              await this.tokenizer.ignore(header.chunkSize);
              break;
            default:
              debug28(`Ignore chunk: RIFF/${header.chunkID} of ${header.chunkSize} bytes`);
              this.metadata.addWarning(`Ignore chunk: RIFF/${header.chunkID}`);
              await this.tokenizer.ignore(header.chunkSize);
          }
          if (header.chunkSize % 2 === 1) {
            debug28("Read odd padding byte");
            await this.tokenizer.ignore(1);
          }
        }
      }
      async parseListTag(listHeader) {
        const listType = await this.readToken(new StringType(4, "latin1"));
        debug28("pos=%s, parseListTag: chunkID=RIFF/WAVE/LIST/%s", this.tokenizer.position, listType);
        switch (listType) {
          case "INFO":
            return this.parseRiffInfoTags(listHeader.chunkSize - 4);
          default:
            this.metadata.addWarning(`Ignore chunk: RIFF/WAVE/LIST/${listType}`);
            debug28(`Ignoring chunkID=RIFF/WAVE/LIST/${listType}`);
            return this.tokenizer.ignore(listHeader.chunkSize - 4).then();
        }
      }
      async parseRiffInfoTags(chunkSize) {
        while (chunkSize >= 8) {
          const header = await this.readToken(Header6);
          const valueToken = new ListInfoTagValue(header);
          if (this.codePage === void 0 && this.pendingInfoTags.length >= getMaxMetadataEntries(this.options)) {
            throw new WaveContentError("Pending RIFF INFO tag count exceeds entry limit");
          }
          if (valueToken.len > chunkSize - 8) {
            throw new WaveContentError("RIFF INFO tag size exceeds remaining LIST data");
          }
          const bytes = await this.readToken(new Uint8ArrayType(valueToken.len));
          if (this.codePage === void 0) {
            this.metadata.registerTagType("exif");
            this.pendingInfoTags.push({ header, bytes });
          } else {
            await this.addInfoTag(header, bytes);
          }
          chunkSize -= 8 + valueToken.len;
        }
        if (chunkSize !== 0) {
          throw new WaveContentError(`Illegal remaining size: ${chunkSize}`);
        }
      }
      async addInfoTag(header, bytes) {
        const encoding = this.getInfoEncoding();
        if (encoding) {
          const value = new ListInfoTagValue(header, encoding).get(bytes, 0);
          await this.metadata.addTag("exif", header.chunkID, value);
        }
      }
      async flushInfoTags() {
        for (const { header, bytes } of this.pendingInfoTags.splice(0)) {
          await this.addInfoTag(header, bytes);
        }
      }
      getInfoEncoding() {
        switch (this.codePage) {
          case void 0:
          case 0:
          case 28591:
            return "latin1";
          case 1252:
            return "windows-1252";
          case 65001:
            return "utf-8";
          default:
            return void 0;
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/wav/WaveLoader.js
var riffParserLoader;
var init_WaveLoader = __esm({
  "node_modules/music-metadata/lib/wav/WaveLoader.js"() {
    riffParserLoader = {
      parserType: "riff",
      extensions: [".wav", "wave", ".bwf"],
      mimeTypes: ["audio/vnd.wave", "audio/wav", "audio/wave"],
      async load() {
        return (await Promise.resolve().then(() => (init_WaveParser(), WaveParser_exports))).WaveParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/wavpack/WavPackToken.js
function isBitSet3(flags, bitOffset) {
  return getBitAllignedNumber2(flags, bitOffset, 1) === 1;
}
function getBitAllignedNumber2(flags, bitOffset, len) {
  return flags >>> bitOffset & 4294967295 >>> 32 - len;
}
var SampleRates, BlockHeaderToken, MetadataIdToken;
var init_WavPackToken = __esm({
  "node_modules/music-metadata/lib/wavpack/WavPackToken.js"() {
    init_lib3();
    init_FourCC();
    SampleRates = [
      6e3,
      8e3,
      9600,
      11025,
      12e3,
      16e3,
      22050,
      24e3,
      32e3,
      44100,
      48e3,
      64e3,
      88200,
      96e3,
      192e3,
      -1
    ];
    BlockHeaderToken = {
      len: 32,
      get: (buf, off) => {
        const flags = UINT32_LE.get(buf, off + 24);
        const res = {
          // should equal 'wvpk'
          BlockID: FourCcToken.get(buf, off),
          //  0x402 to 0x410 are valid for decode
          blockSize: UINT32_LE.get(buf, off + 4),
          //  0x402 (1026) to 0x410 are valid for decode
          version: UINT16_LE.get(buf, off + 8),
          //  40-bit total samples for entire file (if block_index == 0 and a value of -1 indicates an unknown length)
          totalSamples: (
            /* replace with bigint? (Token.UINT8.get(buf, off + 11) << 32) + */
            UINT32_LE.get(buf, off + 12)
          ),
          // 40-bit block_index
          blockIndex: (
            /* replace with bigint? (Token.UINT8.get(buf, off + 10) << 32) + */
            UINT32_LE.get(buf, off + 16)
          ),
          // 40-bit total samples for entire file (if block_index == 0 and a value of -1 indicates an unknown length)
          blockSamples: UINT32_LE.get(buf, off + 20),
          // various flags for id and decoding
          flags: {
            bitsPerSample: (1 + getBitAllignedNumber2(flags, 0, 2)) * 8,
            isMono: isBitSet3(flags, 2),
            isHybrid: isBitSet3(flags, 3),
            isJointStereo: isBitSet3(flags, 4),
            crossChannel: isBitSet3(flags, 5),
            hybridNoiseShaping: isBitSet3(flags, 6),
            floatingPoint: isBitSet3(flags, 7),
            samplingRate: SampleRates[getBitAllignedNumber2(flags, 23, 4)],
            isDSD: isBitSet3(flags, 31)
          },
          // crc for actual decoded data
          crc: new Uint8ArrayType(4).get(buf, off + 28)
        };
        if (res.flags.isDSD) {
          res.totalSamples *= 8;
        }
        return res;
      }
    };
    MetadataIdToken = {
      len: 1,
      get: (buf, off) => {
        return {
          functionId: getBitAllignedNumber2(buf[off], 0, 6),
          // functionId overlaps with isOptional flag
          isOptional: isBitSet3(buf[off], 5),
          isOddSize: isBitSet3(buf[off], 6),
          largeBlock: isBitSet3(buf[off], 7)
        };
      }
    };
  }
});

// node_modules/music-metadata/lib/wavpack/WavPackParser.js
var WavPackParser_exports = {};
__export(WavPackParser_exports, {
  WavPackContentError: () => WavPackContentError,
  WavPackParser: () => WavPackParser
});
var import_debug29, debug29, WavPackContentError, WavPackParser;
var init_WavPackParser = __esm({
  "node_modules/music-metadata/lib/wavpack/WavPackParser.js"() {
    import_debug29 = __toESM(require_src(), 1);
    init_lib3();
    init_uint8array_extras();
    init_APEv2Parser();
    init_BasicParser();
    init_FourCC();
    init_ParseError();
    init_WavPackToken();
    debug29 = (0, import_debug29.default)("music-metadata:parser:WavPack");
    WavPackContentError = class extends makeUnexpectedFileContentError("WavPack") {
    };
    WavPackParser = class extends BasicParser {
      audioDataSize = 0;
      async parse() {
        this.metadata.setAudioOnly();
        this.audioDataSize = 0;
        await this.parseWavPackBlocks();
        return tryParseApeHeader(this.metadata, this.tokenizer, this.options);
      }
      async parseWavPackBlocks() {
        do {
          const blockId = await this.tokenizer.peekToken(FourCcToken);
          if (blockId !== "wvpk") {
            break;
          }
          const header = await this.tokenizer.readToken(BlockHeaderToken);
          if (header.BlockID !== "wvpk") {
            throw new WavPackContentError("Invalid WavPack Block-ID");
          }
          debug29(`WavPack header blockIndex=${header.blockIndex}, len=${BlockHeaderToken.len}`);
          if (header.blockIndex === 0 && !this.metadata.format.container) {
            this.metadata.setFormat("container", "WavPack");
            this.metadata.setFormat("lossless", !header.flags.isHybrid);
            this.metadata.setFormat("bitsPerSample", header.flags.bitsPerSample);
            if (!header.flags.isDSD) {
              this.metadata.setFormat("sampleRate", header.flags.samplingRate);
              this.metadata.setFormat("duration", header.totalSamples / header.flags.samplingRate);
            }
            this.metadata.setFormat("numberOfChannels", header.flags.isMono ? 1 : 2);
            this.metadata.setFormat("numberOfSamples", header.totalSamples);
            this.metadata.setFormat("codec", header.flags.isDSD ? "DSD" : "PCM");
          }
          const ignoreBytes = header.blockSize - (BlockHeaderToken.len - 8);
          await (header.blockIndex === 0 ? this.parseMetadataSubBlock(header, ignoreBytes) : this.tokenizer.ignore(ignoreBytes));
          if (header.blockSamples > 0) {
            this.audioDataSize += header.blockSize;
          }
        } while (!this.tokenizer.fileInfo.size || this.tokenizer.fileInfo.size - this.tokenizer.position >= BlockHeaderToken.len);
        if (this.metadata.format.duration) {
          this.metadata.setFormat("bitrate", this.audioDataSize * 8 / this.metadata.format.duration);
        }
      }
      /**
       * Ref: http://www.wavpack.com/WavPack5FileFormat.pdf, 3.0 Metadata Sub-blocks
       * @param header Header
       * @param remainingLength Remaining length
       */
      async parseMetadataSubBlock(header, remainingLength) {
        let remaining = remainingLength;
        while (remaining > MetadataIdToken.len) {
          const id = await this.tokenizer.readToken(MetadataIdToken);
          const dataSizeInWords = await this.tokenizer.readNumber(id.largeBlock ? UINT24_LE : UINT8);
          const headerSize = MetadataIdToken.len + (id.largeBlock ? UINT24_LE.len : UINT8.len);
          if (dataSizeInWords * 2 > remaining - headerSize) {
            throw new WavPackContentError("Metadata sub-block exceeds its enclosing block");
          }
          const data = await this.readToken(new Uint8ArrayType(dataSizeInWords * 2 - (id.isOddSize ? 1 : 0)));
          debug29(`Metadata Sub-Blocks functionId=0x${id.functionId.toString(16)}, id.largeBlock=${id.largeBlock},data-size=${data.length}`);
          switch (id.functionId) {
            case 0:
              break;
            case 14: {
              debug29("ID_DSD_BLOCK");
              const mp = 1 << UINT8.get(data, 0);
              const samplingRate = header.flags.samplingRate * mp * 8;
              if (!header.flags.isDSD) {
                throw new WavPackContentError("Only expect DSD block if DSD-flag is set");
              }
              this.metadata.setFormat("sampleRate", samplingRate);
              this.metadata.setFormat("duration", header.totalSamples / samplingRate);
              break;
            }
            case 36:
              debug29("ID_ALT_TRAILER: trailer for non-wav files");
              break;
            case 38:
              this.metadata.setFormat("audioMD5", data);
              break;
            case 47:
              debug29(`ID_BLOCK_CHECKSUM: checksum=${uint8ArrayToHex(data)}`);
              break;
            default:
              debug29(`Ignore unsupported meta-sub-block-id functionId=0x${id.functionId.toString(16)}`);
              break;
          }
          remaining -= MetadataIdToken.len + (id.largeBlock ? UINT24_LE.len : UINT8.len) + dataSizeInWords * 2;
          debug29(`remainingLength=${remaining}`);
          if (id.isOddSize) {
            this.tokenizer.ignore(1);
          }
        }
        if (remaining !== 0) {
          throw new WavPackContentError("metadata-sub-block should fit it remaining length");
        }
      }
    };
  }
});

// node_modules/music-metadata/lib/wavpack/WavPackLoader.js
var wavpackParserLoader;
var init_WavPackLoader = __esm({
  "node_modules/music-metadata/lib/wavpack/WavPackLoader.js"() {
    wavpackParserLoader = {
      parserType: "wavpack",
      extensions: [".wv", ".wvp"],
      mimeTypes: ["audio/wavpack"],
      async load() {
        return (await Promise.resolve().then(() => (init_WavPackParser(), WavPackParser_exports))).WavPackParser;
      }
    };
  }
});

// node_modules/music-metadata/lib/ParserFactory.js
function parseHttpContentType(contentType) {
  const type = parse(contentType);
  const mime = parse2(type.type);
  return {
    type: mime.type,
    subtype: mime.subtype,
    suffix: mime.suffix,
    parameters: type.parameters
  };
}
function getExtension(fname) {
  const i = fname.lastIndexOf(".");
  return i === -1 ? "" : fname.substring(i);
}
var import_debug30, debug30, ParserFactory;
var init_ParserFactory = __esm({
  "node_modules/music-metadata/lib/ParserFactory.js"() {
    init_dist();
    import_debug30 = __toESM(require_src(), 1);
    init_source();
    init_dist2();
    init_lib();
    init_AiffLoader();
    init_Apev2Loader();
    init_AsfLoader();
    init_CafLoader();
    init_Allocation();
    init_MetadataCollector();
    init_TrackInfo();
    init_core2();
    init_DsdiffLoader();
    init_DsfLoader();
    init_FlacLoader();
    init_MatroskaLoader();
    init_Mp4Loader();
    init_MpegLoader();
    init_MusepackLoader();
    init_OggLoader();
    init_ParseError();
    init_type();
    init_WaveLoader();
    init_WavPackLoader();
    debug30 = (0, import_debug30.default)("music-metadata:parser:factory");
    ParserFactory = class {
      parsers = [];
      constructor() {
        [
          flacParserLoader,
          mpegParserLoader,
          apeParserLoader,
          mp4ParserLoader,
          matroskaParserLoader,
          riffParserLoader,
          oggParserLoader,
          asfParserLoader,
          aiffParserLoader,
          wavpackParserLoader,
          musepackParserLoader,
          dsfParserLoader,
          dsdiffParserLoader,
          cafParserLoader
        ].forEach((parser) => {
          this.registerParser(parser);
        });
      }
      registerParser(parser) {
        this.parsers.push(parser);
      }
      async parse(tokenizer, parserLoader, opts = {}) {
        const maxBufferSize = getMaxMemoryAllocation(opts);
        getMaxMetadataEntries(opts);
        getMaxChapterCount(opts);
        if (isRandomAccessTokenizer(tokenizer)) {
          debug30("tokenizer supports random-access, scanning for appending headers");
          await scanAppendingHeaders(tokenizer, opts);
        } else {
          debug30("tokenizer does not support random-access, cannot scan for appending headers");
        }
        if (!parserLoader) {
          const buf = new Uint8Array(4100);
          if (tokenizer.fileInfo.mimeType) {
            parserLoader = this.findLoaderForContentType(tokenizer.fileInfo.mimeType);
          }
          if (!parserLoader && tokenizer.fileInfo.path) {
            parserLoader = this.findLoaderForExtension(tokenizer.fileInfo.path);
          }
          if (!parserLoader) {
            debug30("Guess parser on content...");
            await tokenizer.peekBuffer(buf, { mayBeLess: true });
            const guessedType = await fileTypeFromBuffer(buf, { mpegOffsetTolerance: 10, maxBufferSize });
            if (!guessedType?.mime) {
              throw new CouldNotDetermineFileTypeError("Failed to determine audio format");
            }
            debug30(`Guessed file type is mime=${guessedType.mime}, extension=${guessedType.ext}`);
            parserLoader = this.findLoaderForContentType(guessedType.mime);
            if (!parserLoader) {
              throw new UnsupportedFileTypeError(`Guessed MIME-type not supported: ${guessedType.mime}`);
            }
          }
        }
        debug30(`Loading ${parserLoader.parserType} parser...`);
        const metadata = new MetadataCollector(opts);
        const ParserImpl = await parserLoader.load();
        const parser = new ParserImpl(metadata, tokenizer, opts);
        debug30(`Parser ${parserLoader.parserType} loaded`);
        await parser.parse();
        if (metadata.format.trackInfo.length === 0 && metadata.format.hasAudio === true) {
          metadata.addStreamInfo(createAudioTrackInfo(metadata.format));
        }
        if (metadata.format.trackInfo) {
          if (metadata.format.hasAudio === void 0) {
            metadata.setFormat("hasAudio", !!metadata.format.trackInfo.find((track) => track.type === TrackType.audio));
          }
          if (metadata.format.hasVideo === void 0) {
            metadata.setFormat("hasVideo", !!metadata.format.trackInfo.find((track) => track.type === TrackType.video));
          }
        }
        finalizeContainerInfo(metadata, tokenizer.fileInfo.size);
        return metadata.toCommonMetadata();
      }
      /**
       * @param filePath - Path, filename or extension to audio file
       * @return Parser submodule name
       */
      findLoaderForExtension(filePath) {
        if (!filePath) {
          return;
        }
        const extension = getExtension(filePath).toLocaleLowerCase() || filePath;
        return this.parsers.find((parser) => parser.extensions.indexOf(extension) !== -1);
      }
      findLoaderForContentType(httpContentType) {
        let mime;
        if (!httpContentType) {
          return;
        }
        try {
          mime = parseHttpContentType(httpContentType);
        } catch (_err) {
          debug30(`Invalid HTTP Content-Type header value: ${httpContentType}`);
          return;
        }
        const subType = mime.subtype.indexOf("x-") === 0 ? mime.subtype.substring(2) : mime.subtype;
        return this.parsers.find((parser) => parser.mimeTypes.find((loader) => loader.indexOf(`${mime.type}/${subType}`) !== -1));
      }
      getSupportedMimeTypes() {
        const mimeTypeSet = /* @__PURE__ */ new Set();
        this.parsers.forEach((loader) => {
          loader.mimeTypes.forEach((mimeType) => {
            mimeTypeSet.add(mimeType);
            mimeTypeSet.add(mimeType.replace("/", "/x-"));
          });
        });
        return Array.from(mimeTypeSet);
      }
    };
  }
});

// node_modules/music-metadata/lib/core.js
async function parseBlob(blob, options = {}) {
  const tokenizer = fromBlob(blob, getTokenizerOptions(options));
  try {
    return await parseFromTokenizer(tokenizer, options);
  } finally {
    await tokenizer.close();
  }
}
async function parseWebStream(webStream, fileInfo, options = {}) {
  const tokenizer = fromWebStream(webStream, getTokenizerOptions(options, typeof fileInfo === "string" ? { mimeType: fileInfo } : fileInfo));
  try {
    return await parseFromTokenizer(tokenizer, options);
  } finally {
    await tokenizer.close();
  }
}
async function parseBuffer(uint8Array, fileInfo, options = {}) {
  const tokenizer = fromBuffer(uint8Array, getTokenizerOptions(options, typeof fileInfo === "string" ? { mimeType: fileInfo } : fileInfo));
  return parseFromTokenizer(tokenizer, options);
}
function parseFromTokenizer(tokenizer, options) {
  const parserFactory = new ParserFactory();
  return parserFactory.parse(tokenizer, void 0, options);
}
function orderTags(nativeTags) {
  const tags = /* @__PURE__ */ Object.create(null);
  for (const { id, value } of nativeTags) {
    (tags[id] ||= []).push(value);
  }
  return tags;
}
function ratingToStars(rating) {
  return rating === void 0 ? 0 : 1 + Math.round(rating * 4);
}
function selectCover(pictures) {
  return pictures?.find((picture) => picture.type && ["front", "cover", "cover (front)"].includes(picture.type.toLowerCase())) ?? pictures?.[0] ?? null;
}
async function scanAppendingHeaders(tokenizer, options = {}) {
  let apeOffset = tokenizer.fileInfo.size;
  if (await hasID3v1Header(tokenizer)) {
    apeOffset -= 128;
    const lyricsLen = await getLyricsHeaderLength(tokenizer);
    apeOffset -= lyricsLen;
  }
  options.apeHeader = await APEv2Parser.findApeFooterOffset(tokenizer, apeOffset);
}
function getSupportedMimeTypes() {
  return new ParserFactory().getSupportedMimeTypes();
}
var init_core2 = __esm({
  "node_modules/music-metadata/lib/core.js"() {
    init_lib();
    init_APEv2Parser();
    init_Allocation();
    init_ID3v1Parser();
    init_Lyrics3();
    init_ParserFactory();
    init_ParseError();
    init_ParseError();
    init_type();
  }
});

// node_modules/music-metadata/lib/index.js
var lib_exports3 = {};
__export(lib_exports3, {
  CouldNotDetermineFileTypeError: () => CouldNotDetermineFileTypeError,
  FieldDecodingError: () => FieldDecodingError,
  InternalParserError: () => InternalParserError,
  LyricsContentType: () => LyricsContentType,
  TimestampFormat: () => TimestampFormat,
  TrackType: () => TrackType,
  UnexpectedFileContentError: () => UnexpectedFileContentError,
  UnsupportedFileTypeError: () => UnsupportedFileTypeError,
  getSupportedMimeTypes: () => getSupportedMimeTypes,
  makeParseError: () => makeParseError,
  makeUnexpectedFileContentError: () => makeUnexpectedFileContentError,
  orderTags: () => orderTags,
  parseBlob: () => parseBlob,
  parseBuffer: () => parseBuffer,
  parseFile: () => parseFile,
  parseFromTokenizer: () => parseFromTokenizer,
  parseStream: () => parseStream,
  parseWebStream: () => parseWebStream,
  ratingToStars: () => ratingToStars,
  scanAppendingHeaders: () => scanAppendingHeaders,
  selectCover: () => selectCover
});
async function parseStream(stream, fileInfo, options = {}) {
  const tokenizer = await fromStream2(stream, getTokenizerOptions(options, typeof fileInfo === "string" ? { mimeType: fileInfo } : fileInfo));
  try {
    return await parseFromTokenizer(tokenizer, options);
  } finally {
    await tokenizer.close();
  }
}
async function parseFile(filePath, options = {}) {
  debug31(`parseFile: ${filePath}`);
  const fileTokenizer = await fromFile(filePath, {
    ...getTokenizerOptions(options),
    regularFileOnly: true
  });
  const parserFactory = new ParserFactory();
  try {
    const parserLoader = parserFactory.findLoaderForExtension(filePath);
    if (!parserLoader) {
      debug31("Parser could not be determined by file extension");
    }
    try {
      return await parserFactory.parse(fileTokenizer, parserLoader, options);
    } catch (error) {
      if (error instanceof CouldNotDetermineFileTypeError || error instanceof UnsupportedFileTypeError) {
        error.message += `: ${filePath}`;
      }
      throw error;
    }
  } finally {
    await fileTokenizer.close();
  }
}
var import_debug31, debug31;
var init_lib5 = __esm({
  "node_modules/music-metadata/lib/index.js"() {
    import_debug31 = __toESM(require_src(), 1);
    init_lib();
    init_Allocation();
    init_core2();
    init_ParserFactory();
    init_core2();
    debug31 = (0, import_debug31.default)("music-metadata:parser");
  }
});

// node_modules/adm-zip/util/constants.js
var require_constants = __commonJS({
  "node_modules/adm-zip/util/constants.js"(exports2, module2) {
    module2.exports = {
      /* The local file header */
      LOCHDR: 30,
      // LOC header size
      LOCSIG: 67324752,
      // "PK\003\004"
      LOCVER: 4,
      // version needed to extract
      LOCFLG: 6,
      // general purpose bit flag
      LOCHOW: 8,
      // compression method
      LOCTIM: 10,
      // modification time (2 bytes time, 2 bytes date)
      LOCCRC: 14,
      // uncompressed file crc-32 value
      LOCSIZ: 18,
      // compressed size
      LOCLEN: 22,
      // uncompressed size
      LOCNAM: 26,
      // filename length
      LOCEXT: 28,
      // extra field length
      /* The Data descriptor */
      EXTSIG: 134695760,
      // "PK\007\008"
      EXTHDR: 16,
      // EXT header size
      EXTCRC: 4,
      // uncompressed file crc-32 value
      EXTSIZ: 8,
      // compressed size
      EXTLEN: 12,
      // uncompressed size
      /* The central directory file header */
      CENHDR: 46,
      // CEN header size
      CENSIG: 33639248,
      // "PK\001\002"
      CENVEM: 4,
      // version made by
      CENVER: 6,
      // version needed to extract
      CENFLG: 8,
      // encrypt, decrypt flags
      CENHOW: 10,
      // compression method
      CENTIM: 12,
      // modification time (2 bytes time, 2 bytes date)
      CENCRC: 16,
      // uncompressed file crc-32 value
      CENSIZ: 20,
      // compressed size
      CENLEN: 24,
      // uncompressed size
      CENNAM: 28,
      // filename length
      CENEXT: 30,
      // extra field length
      CENCOM: 32,
      // file comment length
      CENDSK: 34,
      // volume number start
      CENATT: 36,
      // internal file attributes
      CENATX: 38,
      // external file attributes (host system dependent)
      CENOFF: 42,
      // LOC header offset
      /* The entries in the end of central directory */
      ENDHDR: 22,
      // END header size
      ENDSIG: 101010256,
      // "PK\005\006"
      ENDSUB: 8,
      // number of entries on this disk
      ENDTOT: 10,
      // total number of entries
      ENDSIZ: 12,
      // central directory size in bytes
      ENDOFF: 16,
      // offset of first CEN header
      ENDCOM: 20,
      // zip file comment length
      END64HDR: 20,
      // zip64 END header size
      END64SIG: 117853008,
      // zip64 Locator signature, "PK\006\007"
      END64START: 4,
      // number of the disk with the start of the zip64
      END64OFF: 8,
      // relative offset of the zip64 end of central directory
      END64NUMDISKS: 16,
      // total number of disks
      ZIP64SIG: 101075792,
      // zip64 signature, "PK\006\006"
      ZIP64HDR: 56,
      // zip64 record minimum size
      ZIP64LEAD: 12,
      // leading bytes at the start of the record, not counted by the value stored in ZIP64SIZE
      ZIP64SIZE: 4,
      // zip64 size of the central directory record
      ZIP64VEM: 12,
      // zip64 version made by
      ZIP64VER: 14,
      // zip64 version needed to extract
      ZIP64DSK: 16,
      // zip64 number of this disk
      ZIP64DSKDIR: 20,
      // number of the disk with the start of the record directory
      ZIP64SUB: 24,
      // number of entries on this disk
      ZIP64TOT: 32,
      // total number of entries
      ZIP64SIZB: 40,
      // zip64 central directory size in bytes
      ZIP64OFF: 48,
      // offset of start of central directory with respect to the starting disk number
      ZIP64EXTRA: 56,
      // extensible data sector
      /* Compression methods */
      STORED: 0,
      // no compression
      SHRUNK: 1,
      // shrunk
      REDUCED1: 2,
      // reduced with compression factor 1
      REDUCED2: 3,
      // reduced with compression factor 2
      REDUCED3: 4,
      // reduced with compression factor 3
      REDUCED4: 5,
      // reduced with compression factor 4
      IMPLODED: 6,
      // imploded
      // 7 reserved for Tokenizing compression algorithm
      DEFLATED: 8,
      // deflated
      ENHANCED_DEFLATED: 9,
      // enhanced deflated
      PKWARE: 10,
      // PKWare DCL imploded
      // 11 reserved by PKWARE
      BZIP2: 12,
      //  compressed using BZIP2
      // 13 reserved by PKWARE
      LZMA: 14,
      // LZMA
      // 15-17 reserved by PKWARE
      IBM_TERSE: 18,
      // compressed using IBM TERSE
      IBM_LZ77: 19,
      // IBM LZ77 z
      AES_ENCRYPT: 99,
      // WinZIP AES encryption method
      /* General purpose bit flag */
      // values can obtained with expression 2**bitnr
      FLG_ENC: 1,
      // Bit 0: encrypted file
      FLG_COMP1: 2,
      // Bit 1, compression option
      FLG_COMP2: 4,
      // Bit 2, compression option
      FLG_DESC: 8,
      // Bit 3, data descriptor
      FLG_ENH: 16,
      // Bit 4, enhanced deflating
      FLG_PATCH: 32,
      // Bit 5, indicates that the file is compressed patched data.
      FLG_STR: 64,
      // Bit 6, strong encryption (patented)
      // Bits 7-10: Currently unused.
      FLG_EFS: 2048,
      // Bit 11: Language encoding flag (EFS)
      // Bit 12: Reserved by PKWARE for enhanced compression.
      // Bit 13: encrypted the Central Directory (patented).
      // Bits 14-15: Reserved by PKWARE.
      FLG_MSK: 4096,
      // mask header values
      /* Load type */
      FILE: 2,
      BUFFER: 1,
      NONE: 0,
      /* 4.5 Extensible data fields */
      EF_ID: 0,
      EF_SIZE: 2,
      /* Header IDs */
      ID_ZIP64: 1,
      ID_AVINFO: 7,
      ID_PFS: 8,
      ID_OS2: 9,
      ID_NTFS: 10,
      ID_OPENVMS: 12,
      ID_UNIX: 13,
      ID_FORK: 14,
      ID_PATCH: 15,
      ID_X509_PKCS7: 20,
      ID_X509_CERTID_F: 21,
      ID_X509_CERTID_C: 22,
      ID_STRONGENC: 23,
      ID_RECORD_MGT: 24,
      ID_X509_PKCS7_RL: 25,
      ID_IBM1: 101,
      ID_IBM2: 102,
      ID_POSZIP: 18064,
      EF_ZIP64_OR_32: 4294967295,
      EF_ZIP64_OR_16: 65535,
      EF_ZIP64_SUNCOMP: 0,
      EF_ZIP64_SCOMP: 8,
      EF_ZIP64_RHO: 16,
      EF_ZIP64_DSN: 24
    };
  }
});

// node_modules/adm-zip/util/errors.js
var require_errors = __commonJS({
  "node_modules/adm-zip/util/errors.js"(exports2) {
    var errors = {
      /* Header error messages */
      INVALID_LOC: "Invalid LOC header (bad signature)",
      INVALID_CEN: "Invalid CEN header (bad signature)",
      INVALID_END: "Invalid END header (bad signature)",
      /* Descriptor */
      DESCRIPTOR_NOT_EXIST: "No descriptor present",
      DESCRIPTOR_UNKNOWN: "Unknown descriptor format",
      DESCRIPTOR_FAULTY: "Descriptor data is malformed",
      /* ZipEntry error messages*/
      NO_DATA: "Nothing to decompress",
      BAD_CRC: "CRC32 checksum failed {0}",
      MAX_OUTPUT_EXCEEDED: "Decompressed data exceeds the declared uncompressed size",
      FILE_IN_THE_WAY: "There is a file in the way: {0}",
      UNKNOWN_METHOD: "Invalid/unsupported compression method",
      /* Inflater error messages */
      AVAIL_DATA: "inflate::Available inflate data did not terminate",
      INVALID_DISTANCE: "inflate::Invalid literal/length or distance code in fixed or dynamic block",
      TO_MANY_CODES: "inflate::Dynamic block code description: too many length or distance codes",
      INVALID_REPEAT_LEN: "inflate::Dynamic block code description: repeat more than specified lengths",
      INVALID_REPEAT_FIRST: "inflate::Dynamic block code description: repeat lengths with no first length",
      INCOMPLETE_CODES: "inflate::Dynamic block code description: code lengths codes incomplete",
      INVALID_DYN_DISTANCE: "inflate::Dynamic block code description: invalid distance code lengths",
      INVALID_CODES_LEN: "inflate::Dynamic block code description: invalid literal/length code lengths",
      INVALID_STORE_BLOCK: "inflate::Stored block length did not match one's complement",
      INVALID_BLOCK_TYPE: "inflate::Invalid block type (type == 3)",
      /* ADM-ZIP error messages */
      CANT_EXTRACT_FILE: "Could not extract the file",
      CANT_OVERRIDE: "Target file already exists",
      DISK_ENTRY_TOO_LARGE: "Number of disk entries is too large",
      NO_ZIP: "No zip file was loaded",
      NO_ENTRY: "Entry doesn't exist",
      DUPLICATE_ENTRY: "Duplicate entry name {0}",
      DIRECTORY_CONTENT_ERROR: "A directory cannot have content",
      FILE_NOT_FOUND: 'File not found: "{0}"',
      NOT_IMPLEMENTED: "Not implemented",
      INVALID_FILENAME: "Invalid filename",
      INVALID_FORMAT: "Invalid or unsupported zip format. No END header found",
      ZIP64_VALUE_TOO_LARGE: "Zip64 value exceeds the maximum safe integer",
      INVALID_PASS_PARAM: "Incompatible password parameter",
      WRONG_PASSWORD: "Wrong Password",
      /* ADM-ZIP */
      COMMENT_TOO_LONG: "Comment is too long",
      // Comment can be max 65535 bytes long (NOTE: some non-US characters may take more space)
      EXTRA_FIELD_PARSE_ERROR: "Extra field parsing error"
    };
    function E(message) {
      return function(...args) {
        if (args.length) {
          message = message.replace(/\{(\d)\}/g, (_, n) => args[n] || "");
        }
        return new Error("ADM-ZIP: " + message);
      };
    }
    for (const msg of Object.keys(errors)) {
      exports2[msg] = E(errors[msg]);
    }
  }
});

// node_modules/adm-zip/util/utils.js
var require_utils = __commonJS({
  "node_modules/adm-zip/util/utils.js"(exports2, module2) {
    var fsystem = require("fs");
    var pth = require("path");
    var Constants = require_constants();
    var Errors = require_errors();
    var isWin = typeof process === "object" && "win32" === process.platform;
    var is_Obj = (obj) => typeof obj === "object" && obj !== null;
    var crcTable = new Uint32Array(256).map((t, c) => {
      for (let k = 0; k < 8; k++) {
        if ((c & 1) !== 0) {
          c = 3988292384 ^ c >>> 1;
        } else {
          c >>>= 1;
        }
      }
      return c >>> 0;
    });
    function Utils(opts) {
      this.sep = pth.sep;
      this.fs = fsystem;
      if (is_Obj(opts)) {
        if (is_Obj(opts.fs) && typeof opts.fs.statSync === "function") {
          this.fs = opts.fs;
        }
      }
    }
    module2.exports = Utils;
    Utils.prototype.makeDir = function(folder) {
      const self = this;
      function mkdirSync(fpath) {
        let resolvedPath = fpath.split(self.sep)[0];
        fpath.split(self.sep).forEach(function(name) {
          if (!name || name.substr(-1, 1) === ":") return;
          resolvedPath += self.sep + name;
          var stat;
          try {
            stat = self.fs.statSync(resolvedPath);
          } catch (e) {
            if (e.message && e.message.startsWith("ENOENT")) {
              self.fs.mkdirSync(resolvedPath);
            } else {
              throw e;
            }
          }
          if (stat && stat.isFile()) throw Errors.FILE_IN_THE_WAY(`"${resolvedPath}"`);
        });
      }
      mkdirSync(folder);
    };
    Utils.prototype.writeFileTo = function(path2, content, overwrite, attr) {
      const self = this;
      if (self.fs.existsSync(path2)) {
        if (!overwrite) return false;
        var stat = self.fs.statSync(path2);
        if (stat.isDirectory()) {
          return false;
        }
      }
      var folder = pth.dirname(path2);
      if (!self.fs.existsSync(folder)) {
        self.makeDir(folder);
      }
      var fd;
      try {
        fd = self.fs.openSync(path2, "w", 438);
      } catch (e) {
        self.fs.chmodSync(path2, 438);
        fd = self.fs.openSync(path2, "w", 438);
      }
      if (fd) {
        try {
          self.fs.writeSync(fd, content, 0, content.length, 0);
        } finally {
          self.fs.closeSync(fd);
        }
      }
      self.fs.chmodSync(path2, attr || 438);
      return true;
    };
    Utils.prototype.writeFileToAsync = function(path2, content, overwrite, attr, callback) {
      if (typeof attr === "function") {
        callback = attr;
        attr = void 0;
      }
      const self = this;
      self.fs.exists(path2, function(exist) {
        if (exist && !overwrite) return callback(false);
        self.fs.stat(path2, function(err, stat) {
          if (exist && stat && stat.isDirectory()) {
            return callback(false);
          }
          var folder = pth.dirname(path2);
          self.fs.exists(folder, function(exists) {
            if (!exists) {
              try {
                self.makeDir(folder);
              } catch (e) {
                return callback(false);
              }
            }
            const writeToFd = function(fd) {
              self.fs.write(fd, content, 0, content.length, 0, function(writeErr) {
                self.fs.close(fd, function() {
                  if (writeErr) return callback(false);
                  self.fs.chmod(path2, attr || 438, function() {
                    callback(true);
                  });
                });
              });
            };
            self.fs.open(path2, "w", 438, function(err2, fd) {
              if (err2) {
                self.fs.chmod(path2, 438, function() {
                  self.fs.open(path2, "w", 438, function(retryErr, fd2) {
                    if (retryErr || !fd2) return callback(false);
                    writeToFd(fd2);
                  });
                });
              } else if (fd) {
                writeToFd(fd);
              } else {
                callback(false);
              }
            });
          });
        });
      });
    };
    Utils.prototype.assertPathSafe = function(root, target) {
      const self = this;
      if (typeof self.fs.lstatSync !== "function") return;
      const resolvedRoot = pth.resolve(root);
      const resolvedTarget = pth.resolve(target);
      if (resolvedTarget === resolvedRoot) return;
      const rel = pth.relative(resolvedRoot, resolvedTarget);
      if (!rel || rel === ".." || rel.startsWith(".." + pth.sep) || pth.isAbsolute(rel)) return;
      let cur = resolvedRoot;
      for (const part of rel.split(pth.sep)) {
        if (!part || part === ".") continue;
        cur = pth.join(cur, part);
        let stat;
        try {
          stat = self.fs.lstatSync(cur);
        } catch (e) {
          break;
        }
        if (stat.isSymbolicLink()) throw Errors.FILE_IN_THE_WAY(`"${cur}"`);
      }
    };
    Utils.prototype.findFiles = function(path2) {
      const self = this;
      const canLstat = typeof self.fs.lstatSync === "function";
      const rootReal = self.fs.realpathSync(path2);
      function escapesRoot(p) {
        if (!canLstat) return false;
        if (!self.fs.lstatSync(p).isSymbolicLink()) return false;
        let real;
        try {
          real = self.fs.realpathSync(p);
        } catch (e) {
          return true;
        }
        return !(real === rootReal || real.startsWith(rootReal + pth.sep));
      }
      function findSync(dir, pattern, recursive, visited) {
        if (typeof pattern === "boolean") {
          recursive = pattern;
          pattern = void 0;
        }
        let files = [];
        self.fs.readdirSync(dir).forEach(function(file) {
          const path3 = pth.join(dir, file);
          if (escapesRoot(path3)) return;
          const stat = self.fs.statSync(path3);
          if (!pattern || pattern.test(path3)) {
            files.push(pth.normalize(path3) + (stat.isDirectory() ? self.sep : ""));
          }
          if (stat.isDirectory() && recursive) {
            const realDir = self.fs.realpathSync(path3);
            if (!visited.has(realDir)) {
              visited.add(realDir);
              files = files.concat(findSync(path3, pattern, recursive, visited));
            }
          }
        });
        return files;
      }
      return findSync(path2, void 0, true, /* @__PURE__ */ new Set([rootReal]));
    };
    Utils.prototype.findFilesAsync = function(dir, cb) {
      const self = this;
      const results = [];
      let finished = false;
      const finish = function(err) {
        if (finished) return;
        finished = true;
        cb(err, err ? void 0 : results);
      };
      const canLstat = typeof self.fs.lstat === "function";
      let rootReal = null;
      const escapesRoot = function(file, cb2) {
        if (!canLstat) return cb2(null, false);
        self.fs.lstat(file, function(err, lst) {
          if (err) return cb2(err);
          if (!lst || !lst.isSymbolicLink()) return cb2(null, false);
          self.fs.realpath(file, function(err2, real) {
            if (err2) return cb2(null, true);
            cb2(null, !(real === rootReal || real.startsWith(rootReal + pth.sep)));
          });
        });
      };
      const walk = function(dir2, visited, done) {
        self.fs.readdir(dir2, function(err, list) {
          if (err) return done(err);
          let pending = list.length;
          if (!pending) return done();
          list.forEach(function(name) {
            const file = pth.join(dir2, name);
            escapesRoot(file, function(err2, escapes) {
              if (err2) return done(err2);
              if (escapes) {
                if (!--pending) done();
                return;
              }
              self.fs.stat(file, function(err3, stat) {
                if (err3) return done(err3);
                if (!stat) {
                  if (!--pending) done();
                  return;
                }
                results.push(pth.normalize(file) + (stat.isDirectory() ? self.sep : ""));
                if (!stat.isDirectory()) {
                  if (!--pending) done();
                  return;
                }
                self.fs.realpath(file, function(err4, realDir) {
                  if (err4) return done(err4);
                  if (visited.has(realDir)) {
                    if (!--pending) done();
                    return;
                  }
                  visited.add(realDir);
                  walk(file, visited, function(err5) {
                    if (err5) return done(err5);
                    if (!--pending) done();
                  });
                });
              });
            });
          });
        });
      };
      self.fs.realpath(dir, function(err, realDir) {
        if (err) return finish(err);
        rootReal = realDir;
        walk(dir, /* @__PURE__ */ new Set([realDir]), finish);
      });
    };
    Utils.prototype.getAttributes = function() {
    };
    Utils.prototype.setAttributes = function() {
    };
    Utils.crc32update = function(crc, byte) {
      return crcTable[(crc ^ byte) & 255] ^ crc >>> 8;
    };
    Utils.crc32 = function(buf) {
      if (typeof buf === "string") {
        buf = Buffer.from(buf, "utf8");
      }
      let len = buf.length;
      let crc = ~0;
      for (let off = 0; off < len; ) crc = Utils.crc32update(crc, buf[off++]);
      return ~crc >>> 0;
    };
    Utils.methodToString = function(method) {
      switch (method) {
        case Constants.STORED:
          return "STORED (" + method + ")";
        case Constants.DEFLATED:
          return "DEFLATED (" + method + ")";
        default:
          return "UNSUPPORTED (" + method + ")";
      }
    };
    Utils.canonical = function(path2) {
      if (!path2) return "";
      const safeSuffix = pth.posix.normalize("/" + path2.split("\\").join("/"));
      return pth.join(".", safeSuffix);
    };
    Utils.zipnamefix = function(path2) {
      if (!path2) return "";
      const safeSuffix = pth.posix.normalize("/" + path2.split("\\").join("/"));
      return pth.posix.join(".", safeSuffix);
    };
    Utils.findLast = function(arr, callback) {
      if (!Array.isArray(arr)) throw new TypeError("arr is not array");
      const len = arr.length >>> 0;
      for (let i = len - 1; i >= 0; i--) {
        if (callback(arr[i], i, arr)) {
          return arr[i];
        }
      }
      return void 0;
    };
    Utils.sanitize = function(prefix, name) {
      prefix = pth.resolve(pth.normalize(prefix));
      var parts = name.split("/");
      for (var i = 0, l = parts.length; i < l; i++) {
        var path2 = pth.normalize(pth.join(prefix, parts.slice(i, l).join(pth.sep)));
        if (path2 === prefix || path2.startsWith(prefix + pth.sep)) {
          return path2;
        }
      }
      return pth.normalize(pth.join(prefix, pth.basename(name)));
    };
    Utils.toBuffer = function toBuffer(input, encoder) {
      if (Buffer.isBuffer(input)) {
        return input;
      } else if (input instanceof Uint8Array) {
        return Buffer.from(input);
      } else {
        return typeof input === "string" ? encoder(input) : Buffer.alloc(0);
      }
    };
    Utils.readBigUInt64LE = function(buffer, index) {
      const lo = buffer.readUInt32LE(index);
      const hi = buffer.readUInt32LE(index + 4);
      const value = hi * 4294967296 + lo;
      if (value > Number.MAX_SAFE_INTEGER) {
        throw Errors.ZIP64_VALUE_TOO_LARGE();
      }
      return value;
    };
    Utils.writeBigUInt64LE = function(buffer, value, index) {
      const lo = value >>> 0;
      const hi = Math.floor(value / 4294967296) >>> 0;
      buffer.writeUInt32LE(lo, index);
      buffer.writeUInt32LE(hi, index + 4);
    };
    Utils.fromDOS2Date = function(val) {
      return new Date((val >> 25 & 127) + 1980, Math.max((val >> 21 & 15) - 1, 0), Math.max(val >> 16 & 31, 1), val >> 11 & 31, val >> 5 & 63, (val & 31) << 1);
    };
    Utils.fromDate2DOS = function(val) {
      let date = 0;
      let time = 0;
      if (val.getFullYear() > 1979) {
        date = (val.getFullYear() - 1980 & 127) << 9 | val.getMonth() + 1 << 5 | val.getDate();
        time = val.getHours() << 11 | val.getMinutes() << 5 | val.getSeconds() >> 1;
      }
      return date << 16 | time;
    };
    Utils.isWin = isWin;
    Utils.crcTable = crcTable;
  }
});

// node_modules/adm-zip/util/fattr.js
var require_fattr = __commonJS({
  "node_modules/adm-zip/util/fattr.js"(exports2, module2) {
    var pth = require("path");
    module2.exports = function(path2, { fs: fs3 }) {
      var _path = path2 || "", _obj = newAttr(), _stat = null;
      function newAttr() {
        return {
          directory: false,
          readonly: false,
          hidden: false,
          executable: false,
          mtime: 0,
          atime: 0
        };
      }
      if (_path && fs3.existsSync(_path)) {
        _stat = fs3.statSync(_path);
        _obj.directory = _stat.isDirectory();
        _obj.mtime = _stat.mtime;
        _obj.atime = _stat.atime;
        _obj.executable = (73 & _stat.mode) !== 0;
        _obj.readonly = (128 & _stat.mode) === 0;
        _obj.hidden = pth.basename(_path)[0] === ".";
      } else {
        console.warn("Invalid path: " + _path);
      }
      return {
        get directory() {
          return _obj.directory;
        },
        get readOnly() {
          return _obj.readonly;
        },
        get hidden() {
          return _obj.hidden;
        },
        get mtime() {
          return _obj.mtime;
        },
        get atime() {
          return _obj.atime;
        },
        get executable() {
          return _obj.executable;
        },
        decodeAttributes: function() {
        },
        encodeAttributes: function() {
        },
        toJSON: function() {
          return {
            path: _path,
            isDirectory: _obj.directory,
            isReadOnly: _obj.readonly,
            isHidden: _obj.hidden,
            isExecutable: _obj.executable,
            mTime: _obj.mtime,
            aTime: _obj.atime
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/util/decoder.js
var require_decoder = __commonJS({
  "node_modules/adm-zip/util/decoder.js"(exports2, module2) {
    module2.exports = {
      efs: true,
      encode: (data) => Buffer.from(data, "utf8"),
      decode: (data) => data.toString("utf8")
    };
  }
});

// node_modules/adm-zip/util/index.js
var require_util = __commonJS({
  "node_modules/adm-zip/util/index.js"(exports2, module2) {
    module2.exports = require_utils();
    module2.exports.Constants = require_constants();
    module2.exports.Errors = require_errors();
    module2.exports.FileAttr = require_fattr();
    module2.exports.decoder = require_decoder();
  }
});

// node_modules/adm-zip/headers/entryHeader.js
var require_entryHeader = __commonJS({
  "node_modules/adm-zip/headers/entryHeader.js"(exports2, module2) {
    var Utils = require_util();
    var Constants = Utils.Constants;
    module2.exports = function() {
      var _verMade = 20, _version = 10, _flags = 0, _method = 0, _time = 0, _crc = 0, _compressedSize = 0, _size = 0, _fnameLen = 0, _extraLen = 0, _comLen = 0, _diskStart = 0, _inattr = 0, _attr = 0, _offset = 0;
      _verMade |= Utils.isWin ? 2560 : 768;
      _flags |= Constants.FLG_EFS;
      const _localHeader = {
        extraLen: 0
      };
      const uint32 = (val) => Math.max(0, val) >>> 0;
      const uint16 = (val) => Math.max(0, val) & 65535;
      const uint8 = (val) => Math.max(0, val) & 255;
      _time = Utils.fromDate2DOS(/* @__PURE__ */ new Date());
      return {
        get made() {
          return _verMade;
        },
        set made(val) {
          _verMade = val;
        },
        get version() {
          return _version;
        },
        set version(val) {
          _version = val;
        },
        get flags() {
          return _flags;
        },
        set flags(val) {
          _flags = val;
        },
        get flags_efs() {
          return (_flags & Constants.FLG_EFS) > 0;
        },
        set flags_efs(val) {
          if (val) {
            _flags |= Constants.FLG_EFS;
          } else {
            _flags &= ~Constants.FLG_EFS;
          }
        },
        get flags_desc() {
          return (_flags & Constants.FLG_DESC) > 0;
        },
        set flags_desc(val) {
          if (val) {
            _flags |= Constants.FLG_DESC;
          } else {
            _flags &= ~Constants.FLG_DESC;
          }
        },
        get method() {
          return _method;
        },
        set method(val) {
          switch (val) {
            case Constants.STORED:
              this.version = 10;
              break;
            case Constants.DEFLATED:
            default:
              this.version = 20;
          }
          _method = val;
        },
        get time() {
          return Utils.fromDOS2Date(this.timeval);
        },
        set time(val) {
          val = new Date(val);
          this.timeval = Utils.fromDate2DOS(val);
        },
        get timeval() {
          return _time;
        },
        set timeval(val) {
          _time = uint32(val);
        },
        get timeHighByte() {
          return uint8(_time >>> 8);
        },
        get crc() {
          return _crc;
        },
        set crc(val) {
          _crc = uint32(val);
        },
        get compressedSize() {
          return _compressedSize;
        },
        set compressedSize(val) {
          _compressedSize = uint32(val);
        },
        get size() {
          return _size;
        },
        set size(val) {
          _size = uint32(val);
        },
        get fileNameLength() {
          return _fnameLen;
        },
        set fileNameLength(val) {
          _fnameLen = val;
        },
        get extraLength() {
          return _extraLen;
        },
        set extraLength(val) {
          _extraLen = val;
        },
        get extraLocalLength() {
          return _localHeader.extraLen;
        },
        set extraLocalLength(val) {
          _localHeader.extraLen = val;
        },
        get commentLength() {
          return _comLen;
        },
        set commentLength(val) {
          _comLen = val;
        },
        get diskNumStart() {
          return _diskStart;
        },
        set diskNumStart(val) {
          _diskStart = uint32(val);
        },
        get inAttr() {
          return _inattr;
        },
        set inAttr(val) {
          _inattr = uint32(val);
        },
        get attr() {
          return _attr;
        },
        set attr(val) {
          _attr = uint32(val);
        },
        // get Unix file permissions
        get fileAttr() {
          return (_attr || 0) >> 16 & 511;
        },
        get offset() {
          return _offset;
        },
        set offset(val) {
          _offset = uint32(val);
        },
        get encrypted() {
          return (_flags & Constants.FLG_ENC) === Constants.FLG_ENC;
        },
        get centralHeaderSize() {
          return Constants.CENHDR + _fnameLen + _extraLen + _comLen;
        },
        get realDataOffset() {
          return _offset + Constants.LOCHDR + _localHeader.fnameLen + _localHeader.extraLen;
        },
        get localHeader() {
          return _localHeader;
        },
        loadLocalHeaderFromBinary: function(input) {
          if (_offset < 0 || _offset + Constants.LOCHDR > input.length) {
            throw Utils.Errors.INVALID_LOC();
          }
          var data = input.slice(_offset, _offset + Constants.LOCHDR);
          if (data.readUInt32LE(0) !== Constants.LOCSIG) {
            throw Utils.Errors.INVALID_LOC();
          }
          _localHeader.version = data.readUInt16LE(Constants.LOCVER);
          _localHeader.flags = data.readUInt16LE(Constants.LOCFLG);
          _localHeader.flags_desc = (_localHeader.flags & Constants.FLG_DESC) > 0;
          _localHeader.method = data.readUInt16LE(Constants.LOCHOW);
          _localHeader.time = data.readUInt32LE(Constants.LOCTIM);
          _localHeader.crc = data.readUInt32LE(Constants.LOCCRC);
          _localHeader.compressedSize = data.readUInt32LE(Constants.LOCSIZ);
          _localHeader.size = data.readUInt32LE(Constants.LOCLEN);
          _localHeader.fnameLen = data.readUInt16LE(Constants.LOCNAM);
          _localHeader.extraLen = data.readUInt16LE(Constants.LOCEXT);
          const extraStart = _offset + Constants.LOCHDR + _localHeader.fnameLen;
          const extraEnd = extraStart + _localHeader.extraLen;
          return input.slice(extraStart, extraEnd);
        },
        loadFromBinary: function(data) {
          if (data.length !== Constants.CENHDR || data.readUInt32LE(0) !== Constants.CENSIG) {
            throw Utils.Errors.INVALID_CEN();
          }
          _verMade = data.readUInt16LE(Constants.CENVEM);
          _version = data.readUInt16LE(Constants.CENVER);
          _flags = data.readUInt16LE(Constants.CENFLG);
          _method = data.readUInt16LE(Constants.CENHOW);
          _time = data.readUInt32LE(Constants.CENTIM);
          _crc = data.readUInt32LE(Constants.CENCRC);
          _compressedSize = data.readUInt32LE(Constants.CENSIZ);
          _size = data.readUInt32LE(Constants.CENLEN);
          _fnameLen = data.readUInt16LE(Constants.CENNAM);
          _extraLen = data.readUInt16LE(Constants.CENEXT);
          _comLen = data.readUInt16LE(Constants.CENCOM);
          _diskStart = data.readUInt16LE(Constants.CENDSK);
          _inattr = data.readUInt16LE(Constants.CENATT);
          _attr = data.readUInt32LE(Constants.CENATX);
          _offset = data.readUInt32LE(Constants.CENOFF);
        },
        localHeaderToBinary: function() {
          var data = Buffer.alloc(Constants.LOCHDR);
          data.writeUInt32LE(Constants.LOCSIG, 0);
          data.writeUInt16LE(_version, Constants.LOCVER);
          data.writeUInt16LE(_flags & ~Constants.FLG_DESC, Constants.LOCFLG);
          data.writeUInt16LE(_method, Constants.LOCHOW);
          data.writeUInt32LE(_time, Constants.LOCTIM);
          data.writeUInt32LE(_crc, Constants.LOCCRC);
          data.writeUInt32LE(_compressedSize, Constants.LOCSIZ);
          data.writeUInt32LE(_size, Constants.LOCLEN);
          data.writeUInt16LE(_fnameLen, Constants.LOCNAM);
          data.writeUInt16LE(_localHeader.extraLen, Constants.LOCEXT);
          return data;
        },
        centralHeaderToBinary: function() {
          var data = Buffer.alloc(Constants.CENHDR + _fnameLen + _extraLen + _comLen);
          data.writeUInt32LE(Constants.CENSIG, 0);
          data.writeUInt16LE(_verMade, Constants.CENVEM);
          data.writeUInt16LE(_version, Constants.CENVER);
          data.writeUInt16LE(_flags & ~Constants.FLG_DESC, Constants.CENFLG);
          data.writeUInt16LE(_method, Constants.CENHOW);
          data.writeUInt32LE(_time, Constants.CENTIM);
          data.writeUInt32LE(_crc, Constants.CENCRC);
          data.writeUInt32LE(_compressedSize, Constants.CENSIZ);
          data.writeUInt32LE(_size, Constants.CENLEN);
          data.writeUInt16LE(_fnameLen, Constants.CENNAM);
          data.writeUInt16LE(_extraLen, Constants.CENEXT);
          data.writeUInt16LE(_comLen, Constants.CENCOM);
          data.writeUInt16LE(_diskStart, Constants.CENDSK);
          data.writeUInt16LE(_inattr, Constants.CENATT);
          data.writeUInt32LE(_attr, Constants.CENATX);
          data.writeUInt32LE(_offset, Constants.CENOFF);
          return data;
        },
        toJSON: function() {
          const bytes = function(nr) {
            return nr + " bytes";
          };
          return {
            made: _verMade,
            version: _version,
            flags: _flags,
            method: Utils.methodToString(_method),
            time: this.time,
            crc: "0x" + _crc.toString(16).toUpperCase(),
            compressedSize: bytes(_compressedSize),
            size: bytes(_size),
            fileNameLength: bytes(_fnameLen),
            extraLength: bytes(_extraLen),
            commentLength: bytes(_comLen),
            diskNumStart: _diskStart,
            inAttr: _inattr,
            attr: _attr,
            offset: _offset,
            centralHeaderSize: bytes(Constants.CENHDR + _fnameLen + _extraLen + _comLen)
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/headers/mainHeader.js
var require_mainHeader = __commonJS({
  "node_modules/adm-zip/headers/mainHeader.js"(exports2, module2) {
    var Utils = require_util();
    var Constants = Utils.Constants;
    module2.exports = function() {
      var _volumeEntries = 0, _totalEntries = 0, _size = 0, _offset = 0, _commentLength = 0;
      const needsZip64 = () => _volumeEntries > Constants.EF_ZIP64_OR_16 || _totalEntries > Constants.EF_ZIP64_OR_16 || _size > Constants.EF_ZIP64_OR_32 || _offset > Constants.EF_ZIP64_OR_32;
      return {
        get diskEntries() {
          return _volumeEntries;
        },
        set diskEntries(val) {
          _volumeEntries = _totalEntries = val;
        },
        get totalEntries() {
          return _totalEntries;
        },
        set totalEntries(val) {
          _totalEntries = _volumeEntries = val;
        },
        get size() {
          return _size;
        },
        set size(val) {
          _size = val;
        },
        get offset() {
          return _offset;
        },
        set offset(val) {
          _offset = val;
        },
        get commentLength() {
          return _commentLength;
        },
        set commentLength(val) {
          _commentLength = val;
        },
        get mainHeaderSize() {
          return (needsZip64() ? Constants.ZIP64HDR + Constants.END64HDR : 0) + Constants.ENDHDR + _commentLength;
        },
        loadFromBinary: function(data) {
          if ((data.length !== Constants.ENDHDR || data.readUInt32LE(0) !== Constants.ENDSIG) && (data.length < Constants.ZIP64HDR || data.readUInt32LE(0) !== Constants.ZIP64SIG)) {
            throw Utils.Errors.INVALID_END();
          }
          if (data.readUInt32LE(0) === Constants.ENDSIG) {
            _volumeEntries = data.readUInt16LE(Constants.ENDSUB);
            _totalEntries = data.readUInt16LE(Constants.ENDTOT);
            _size = data.readUInt32LE(Constants.ENDSIZ);
            _offset = data.readUInt32LE(Constants.ENDOFF);
            _commentLength = data.readUInt16LE(Constants.ENDCOM);
          } else {
            _volumeEntries = Utils.readBigUInt64LE(data, Constants.ZIP64SUB);
            _totalEntries = Utils.readBigUInt64LE(data, Constants.ZIP64TOT);
            _size = Utils.readBigUInt64LE(data, Constants.ZIP64SIZB);
            _offset = Utils.readBigUInt64LE(data, Constants.ZIP64OFF);
            _commentLength = 0;
          }
        },
        toBinary: function() {
          if (!needsZip64()) {
            var b = Buffer.alloc(Constants.ENDHDR + _commentLength);
            b.writeUInt32LE(Constants.ENDSIG, 0);
            b.writeUInt32LE(0, 4);
            b.writeUInt16LE(_volumeEntries, Constants.ENDSUB);
            b.writeUInt16LE(_totalEntries, Constants.ENDTOT);
            b.writeUInt32LE(_size, Constants.ENDSIZ);
            b.writeUInt32LE(_offset, Constants.ENDOFF);
            b.writeUInt16LE(_commentLength, Constants.ENDCOM);
            b.fill(" ", Constants.ENDHDR);
            return b;
          }
          var b = Buffer.alloc(this.mainHeaderSize);
          let offset = 0;
          b.writeUInt32LE(Constants.ZIP64SIG, offset);
          Utils.writeBigUInt64LE(b, Constants.ZIP64HDR - Constants.ZIP64LEAD, offset + Constants.ZIP64SIZE);
          b.writeUInt16LE(45, offset + Constants.ZIP64VEM);
          b.writeUInt16LE(45, offset + Constants.ZIP64VER);
          b.writeUInt32LE(0, offset + Constants.ZIP64DSK);
          b.writeUInt32LE(0, offset + Constants.ZIP64DSKDIR);
          Utils.writeBigUInt64LE(b, _volumeEntries, offset + Constants.ZIP64SUB);
          Utils.writeBigUInt64LE(b, _totalEntries, offset + Constants.ZIP64TOT);
          Utils.writeBigUInt64LE(b, _size, offset + Constants.ZIP64SIZB);
          Utils.writeBigUInt64LE(b, _offset, offset + Constants.ZIP64OFF);
          const zip64EndOffset = _offset + _size;
          offset += Constants.ZIP64HDR;
          b.writeUInt32LE(Constants.END64SIG, offset);
          b.writeUInt32LE(0, offset + Constants.END64START);
          Utils.writeBigUInt64LE(b, zip64EndOffset, offset + Constants.END64OFF);
          b.writeUInt32LE(1, offset + Constants.END64NUMDISKS);
          offset += Constants.END64HDR;
          b.writeUInt32LE(Constants.ENDSIG, offset);
          b.writeUInt32LE(0, offset + 4);
          b.writeUInt16LE(Math.min(_volumeEntries, Constants.EF_ZIP64_OR_16), offset + Constants.ENDSUB);
          b.writeUInt16LE(Math.min(_totalEntries, Constants.EF_ZIP64_OR_16), offset + Constants.ENDTOT);
          b.writeUInt32LE(Math.min(_size, Constants.EF_ZIP64_OR_32), offset + Constants.ENDSIZ);
          b.writeUInt32LE(Math.min(_offset, Constants.EF_ZIP64_OR_32), offset + Constants.ENDOFF);
          b.writeUInt16LE(_commentLength, offset + Constants.ENDCOM);
          b.fill(" ", offset + Constants.ENDHDR);
          return b;
        },
        toJSON: function() {
          const offset = function(nr, len) {
            let offs = nr.toString(16).toUpperCase();
            while (offs.length < len) offs = "0" + offs;
            return "0x" + offs;
          };
          return {
            diskEntries: _volumeEntries,
            totalEntries: _totalEntries,
            size: _size + " bytes",
            offset: offset(_offset, 4),
            commentLength: _commentLength
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/headers/index.js
var require_headers = __commonJS({
  "node_modules/adm-zip/headers/index.js"(exports2) {
    exports2.EntryHeader = require_entryHeader();
    exports2.MainHeader = require_mainHeader();
  }
});

// node_modules/adm-zip/methods/deflater.js
var require_deflater = __commonJS({
  "node_modules/adm-zip/methods/deflater.js"(exports2, module2) {
    module2.exports = function(inbuf) {
      var zlib = require("zlib");
      var opts = { chunkSize: (parseInt(inbuf.length / 1024) + 1) * 1024 };
      return {
        deflate: function() {
          return zlib.deflateRawSync(inbuf, opts);
        },
        deflateAsync: function(callback) {
          var tmp = zlib.createDeflateRaw(opts), parts = [], total = 0;
          tmp.on("data", function(data) {
            parts.push(data);
            total += data.length;
          });
          tmp.on("end", function() {
            var buf = Buffer.alloc(total), written = 0;
            buf.fill(0);
            for (var i = 0; i < parts.length; i++) {
              var part = parts[i];
              part.copy(buf, written);
              written += part.length;
            }
            callback && callback(buf);
          });
          tmp.end(inbuf);
        }
      };
    };
  }
});

// node_modules/adm-zip/methods/inflater.js
var require_inflater = __commonJS({
  "node_modules/adm-zip/methods/inflater.js"(exports2, module2) {
    var version = +(process?.versions?.node ?? "").split(".")[0] || 0;
    var Errors = require_errors();
    module2.exports = function(inbuf, expectedLength) {
      var zlib = require("zlib");
      const maxOutputLength = expectedLength > 0 ? expectedLength : 1;
      const option = version >= 15 ? { maxOutputLength } : {};
      return {
        inflate: function() {
          return zlib.inflateRawSync(inbuf, option);
        },
        inflateAsync: function(callback) {
          var tmp = zlib.createInflateRaw(option), parts = [], total = 0, done = false;
          const fail = function(err) {
            if (done) return;
            done = true;
            tmp.destroy();
            callback && callback(Buffer.alloc(0), err);
          };
          tmp.on("error", function(err) {
            fail(err);
          });
          tmp.on("data", function(data) {
            if (done) return;
            total += data.length;
            if (total > maxOutputLength) {
              return fail(Errors.MAX_OUTPUT_EXCEEDED());
            }
            parts.push(data);
          });
          tmp.on("end", function() {
            if (done) return;
            done = true;
            var buf = Buffer.alloc(total), written = 0;
            buf.fill(0);
            for (var i = 0; i < parts.length; i++) {
              var part = parts[i];
              part.copy(buf, written);
              written += part.length;
            }
            callback && callback(buf);
          });
          tmp.end(inbuf);
        }
      };
    };
  }
});

// node_modules/adm-zip/methods/zipcrypto.js
var require_zipcrypto = __commonJS({
  "node_modules/adm-zip/methods/zipcrypto.js"(exports2, module2) {
    "use strict";
    var { randomFillSync } = require("crypto");
    var Errors = require_errors();
    var crctable = new Uint32Array(256).map((t, crc) => {
      for (let j = 0; j < 8; j++) {
        if (0 !== (crc & 1)) {
          crc = crc >>> 1 ^ 3988292384;
        } else {
          crc >>>= 1;
        }
      }
      return crc >>> 0;
    });
    var uMul = (a, b) => Math.imul(a, b) >>> 0;
    var crc32update = (pCrc32, bval) => {
      return crctable[(pCrc32 ^ bval) & 255] ^ pCrc32 >>> 8;
    };
    var genSalt = () => {
      if ("function" === typeof randomFillSync) {
        return randomFillSync(Buffer.alloc(12));
      } else {
        return genSalt.node();
      }
    };
    genSalt.node = () => {
      const salt = Buffer.alloc(12);
      const len = salt.length;
      for (let i = 0; i < len; i++) salt[i] = Math.random() * 256 & 255;
      return salt;
    };
    var config = {
      genSalt
    };
    function Initkeys(pw) {
      const pass = Buffer.isBuffer(pw) ? pw : Buffer.from(pw);
      this.keys = new Uint32Array([305419896, 591751049, 878082192]);
      for (let i = 0; i < pass.length; i++) {
        this.updateKeys(pass[i]);
      }
    }
    Initkeys.prototype.updateKeys = function(byteValue) {
      const keys = this.keys;
      keys[0] = crc32update(keys[0], byteValue);
      keys[1] += keys[0] & 255;
      keys[1] = uMul(keys[1], 134775813) + 1;
      keys[2] = crc32update(keys[2], keys[1] >>> 24);
      return byteValue;
    };
    Initkeys.prototype.next = function() {
      const k = (this.keys[2] | 2) >>> 0;
      return uMul(k, k ^ 1) >> 8 & 255;
    };
    function make_decrypter(pwd) {
      const keys = new Initkeys(pwd);
      return function(data) {
        const result = Buffer.alloc(data.length);
        let pos = 0;
        for (let c of data) {
          result[pos++] = keys.updateKeys(c ^ keys.next());
        }
        return result;
      };
    }
    function make_encrypter(pwd) {
      const keys = new Initkeys(pwd);
      return function(data, result, pos = 0) {
        if (!result) result = Buffer.alloc(data.length);
        for (let c of data) {
          const k = keys.next();
          result[pos++] = c ^ k;
          keys.updateKeys(c);
        }
        return result;
      };
    }
    function decrypt(data, header, pwd) {
      if (!data || !Buffer.isBuffer(data) || data.length < 12) {
        return Buffer.alloc(0);
      }
      const decrypter = make_decrypter(pwd);
      const salt = decrypter(data.slice(0, 12));
      const verifyByte = (header.flags & 8) === 8 ? header.timeHighByte : header.crc >>> 24;
      if (salt[11] !== verifyByte) {
        throw Errors.WRONG_PASSWORD();
      }
      return decrypter(data.slice(12));
    }
    function _salter(data) {
      if (Buffer.isBuffer(data) && data.length >= 12) {
        config.genSalt = function() {
          return data.slice(0, 12);
        };
      } else if (data === "node") {
        config.genSalt = genSalt.node;
      } else {
        config.genSalt = genSalt;
      }
    }
    function encrypt(data, header, pwd, oldlike = false) {
      if (data == null) data = Buffer.alloc(0);
      if (!Buffer.isBuffer(data)) data = Buffer.from(data.toString());
      const encrypter = make_encrypter(pwd);
      const salt = config.genSalt();
      salt[11] = header.crc >>> 24 & 255;
      if (oldlike) salt[10] = header.crc >>> 16 & 255;
      const result = Buffer.alloc(data.length + 12);
      encrypter(salt, result);
      return encrypter(data, result, 12);
    }
    module2.exports = { decrypt, encrypt, _salter };
  }
});

// node_modules/adm-zip/methods/index.js
var require_methods = __commonJS({
  "node_modules/adm-zip/methods/index.js"(exports2) {
    exports2.Deflater = require_deflater();
    exports2.Inflater = require_inflater();
    exports2.ZipCrypto = require_zipcrypto();
  }
});

// node_modules/adm-zip/zipEntry.js
var require_zipEntry = __commonJS({
  "node_modules/adm-zip/zipEntry.js"(exports2, module2) {
    var Utils = require_util();
    var Headers = require_headers();
    var Constants = Utils.Constants;
    var Methods = require_methods();
    module2.exports = function(options, input) {
      var _centralHeader = new Headers.EntryHeader(), _entryName = Buffer.alloc(0), _comment = Buffer.alloc(0), _isDirectory = false, uncompressedData = null, _extra = Buffer.alloc(0), _extralocal = Buffer.alloc(0), _efs = true;
      const opts = options;
      const decoder = typeof opts.decoder === "object" ? opts.decoder : Utils.decoder;
      _efs = decoder.hasOwnProperty("efs") ? decoder.efs : false;
      function getCompressedDataFromZip() {
        if (!input || !(input instanceof Uint8Array)) {
          return Buffer.alloc(0);
        }
        _extralocal = _centralHeader.loadLocalHeaderFromBinary(input);
        const dataOffset = _centralHeader.realDataOffset;
        const dataEnd = dataOffset + _centralHeader.compressedSize;
        if (dataOffset < 0 || dataEnd < dataOffset || dataEnd > input.length) {
          throw Utils.Errors.INVALID_LOC();
        }
        return input.slice(dataOffset, dataEnd);
      }
      function crc32OK(data) {
        const expectedCrc = _centralHeader.flags_desc || _centralHeader.localHeader.flags_desc ? _centralHeader.crc : _centralHeader.localHeader.crc;
        return Utils.crc32(data) === expectedCrc;
      }
      function decompress(async, callback, pass) {
        if (typeof callback === "undefined" && typeof async === "string") {
          pass = async;
          async = void 0;
        }
        if (_isDirectory) {
          if (async && callback) {
            callback(Buffer.alloc(0), Utils.Errors.DIRECTORY_CONTENT_ERROR());
          }
          return Buffer.alloc(0);
        }
        var compressedData;
        try {
          compressedData = getCompressedDataFromZip();
          if (compressedData.length === 0) {
            if (async && callback) callback(compressedData);
            return compressedData;
          }
          if (_centralHeader.encrypted) {
            if ("string" !== typeof pass && !Buffer.isBuffer(pass)) {
              throw Utils.Errors.INVALID_PASS_PARAM();
            }
            compressedData = Methods.ZipCrypto.decrypt(compressedData, _centralHeader, pass);
          }
        } catch (err) {
          if (async && callback) {
            callback(Buffer.alloc(0), err);
            return Buffer.alloc(0);
          }
          throw err;
        }
        var data;
        switch (_centralHeader.method) {
          case Utils.Constants.STORED:
            data = Buffer.alloc(compressedData.length);
            compressedData.copy(data);
            if (!crc32OK(data)) {
              if (async && callback) callback(data, Utils.Errors.BAD_CRC());
              throw Utils.Errors.BAD_CRC();
            } else {
              if (async && callback) callback(data);
              return data;
            }
          case Utils.Constants.DEFLATED:
            var inflater = new Methods.Inflater(compressedData, _centralHeader.size);
            if (!async) {
              data = inflater.inflate();
              if (!crc32OK(data)) {
                throw Utils.Errors.BAD_CRC(`"${decoder.decode(_entryName)}"`);
              }
              return data;
            } else {
              inflater.inflateAsync(function(result, err) {
                if (!callback) return;
                if (err) {
                  callback(Buffer.alloc(0), err);
                } else if (!crc32OK(result)) {
                  callback(result, Utils.Errors.BAD_CRC());
                } else {
                  callback(result);
                }
              });
            }
            break;
          default:
            if (async && callback) callback(Buffer.alloc(0), Utils.Errors.UNKNOWN_METHOD());
            throw Utils.Errors.UNKNOWN_METHOD();
        }
      }
      function compress(async, callback) {
        if ((!uncompressedData || !uncompressedData.length) && Buffer.isBuffer(input)) {
          if (async && callback) callback(getCompressedDataFromZip());
          return getCompressedDataFromZip();
        }
        if (uncompressedData.length && !_isDirectory) {
          var compressedData;
          switch (_centralHeader.method) {
            case Utils.Constants.STORED:
              _centralHeader.compressedSize = _centralHeader.size;
              compressedData = Buffer.alloc(uncompressedData.length);
              uncompressedData.copy(compressedData);
              if (async && callback) callback(compressedData);
              return compressedData;
            default:
            case Utils.Constants.DEFLATED:
              var deflater = new Methods.Deflater(uncompressedData);
              if (!async) {
                var deflated = deflater.deflate();
                _centralHeader.compressedSize = deflated.length;
                return deflated;
              } else {
                deflater.deflateAsync(function(data) {
                  compressedData = Buffer.alloc(data.length);
                  _centralHeader.compressedSize = data.length;
                  data.copy(compressedData);
                  callback && callback(compressedData);
                });
              }
              deflater = null;
              break;
          }
        } else if (async && callback) {
          callback(Buffer.alloc(0));
        } else {
          return Buffer.alloc(0);
        }
      }
      function readUInt64LE(buffer, offset) {
        return Utils.readBigUInt64LE(buffer, offset);
      }
      function parseExtra(data) {
        try {
          var offset = 0;
          var signature, size, part;
          while (offset + 4 < data.length) {
            signature = data.readUInt16LE(offset);
            offset += 2;
            size = data.readUInt16LE(offset);
            offset += 2;
            part = data.slice(offset, offset + size);
            offset += size;
            if (Constants.ID_ZIP64 === signature) {
              parseZip64ExtendedInformation(part);
            }
          }
        } catch (error) {
          throw Utils.Errors.EXTRA_FIELD_PARSE_ERROR();
        }
      }
      function parseZip64ExtendedInformation(data) {
        var size, compressedSize, offset, diskNumStart;
        if (data.length >= Constants.EF_ZIP64_SCOMP) {
          size = readUInt64LE(data, Constants.EF_ZIP64_SUNCOMP);
          if (_centralHeader.size === Constants.EF_ZIP64_OR_32) {
            _centralHeader.size = size;
          }
        }
        if (data.length >= Constants.EF_ZIP64_RHO) {
          compressedSize = readUInt64LE(data, Constants.EF_ZIP64_SCOMP);
          if (_centralHeader.compressedSize === Constants.EF_ZIP64_OR_32) {
            _centralHeader.compressedSize = compressedSize;
          }
        }
        if (data.length >= Constants.EF_ZIP64_DSN) {
          offset = readUInt64LE(data, Constants.EF_ZIP64_RHO);
          if (_centralHeader.offset === Constants.EF_ZIP64_OR_32) {
            _centralHeader.offset = offset;
          }
        }
        if (data.length >= Constants.EF_ZIP64_DSN + 4) {
          diskNumStart = data.readUInt32LE(Constants.EF_ZIP64_DSN);
          if (_centralHeader.diskNumStart === Constants.EF_ZIP64_OR_16) {
            _centralHeader.diskNumStart = diskNumStart;
          }
        }
      }
      return {
        get entryName() {
          return decoder.decode(_entryName);
        },
        get rawEntryName() {
          return _entryName;
        },
        set entryName(val) {
          _entryName = Utils.toBuffer(val, decoder.encode);
          var lastChar = _entryName[_entryName.length - 1];
          _isDirectory = lastChar === 47 || lastChar === 92;
          _centralHeader.fileNameLength = _entryName.length;
        },
        get efs() {
          if (typeof _efs === "function") {
            return _efs(this.entryName);
          } else {
            return _efs;
          }
        },
        get extra() {
          return _extra;
        },
        set extra(val) {
          _extra = val;
          _centralHeader.extraLength = val.length;
          parseExtra(val);
        },
        get comment() {
          return decoder.decode(_comment);
        },
        set comment(val) {
          _comment = Utils.toBuffer(val, decoder.encode);
          _centralHeader.commentLength = _comment.length;
          if (_comment.length > 65535) throw Utils.Errors.COMMENT_TOO_LONG();
        },
        get name() {
          const n = decoder.decode(_entryName);
          return _isDirectory ? n.replace(/[/\\]$/, "").split("/").pop() : n.split("/").pop();
        },
        get isDirectory() {
          return _isDirectory;
        },
        getCompressedData: function() {
          return compress(false, null);
        },
        getCompressedDataAsync: function(callback) {
          compress(true, callback);
        },
        setData: function(value) {
          uncompressedData = Utils.toBuffer(value, Utils.decoder.encode);
          if (!_isDirectory && uncompressedData.length) {
            _centralHeader.size = uncompressedData.length;
            _centralHeader.method = Utils.Constants.DEFLATED;
            _centralHeader.crc = Utils.crc32(value);
            _centralHeader.changed = true;
          } else {
            _centralHeader.method = Utils.Constants.STORED;
          }
        },
        getData: function(pass) {
          if (_centralHeader.changed) {
            return uncompressedData;
          } else {
            return decompress(false, null, pass);
          }
        },
        getDataAsync: function(callback, pass) {
          if (_centralHeader.changed) {
            callback(uncompressedData);
          } else {
            decompress(true, callback, pass);
          }
        },
        set attr(attr) {
          _centralHeader.attr = attr;
        },
        get attr() {
          return _centralHeader.attr;
        },
        set header(data) {
          _centralHeader.loadFromBinary(data);
        },
        get header() {
          return _centralHeader;
        },
        packCentralHeader: function() {
          _centralHeader.flags_efs = this.efs;
          _centralHeader.extraLength = _extra.length;
          var header = _centralHeader.centralHeaderToBinary();
          var addpos = Utils.Constants.CENHDR;
          _entryName.copy(header, addpos);
          addpos += _entryName.length;
          _extra.copy(header, addpos);
          addpos += _centralHeader.extraLength;
          _comment.copy(header, addpos);
          return header;
        },
        packLocalHeader: function() {
          let addpos = 0;
          _centralHeader.flags_efs = this.efs;
          _centralHeader.extraLocalLength = _extralocal.length;
          const localHeaderBuf = _centralHeader.localHeaderToBinary();
          const localHeader = Buffer.alloc(localHeaderBuf.length + _entryName.length + _centralHeader.extraLocalLength);
          localHeaderBuf.copy(localHeader, addpos);
          addpos += localHeaderBuf.length;
          _entryName.copy(localHeader, addpos);
          addpos += _entryName.length;
          _extralocal.copy(localHeader, addpos);
          addpos += _extralocal.length;
          return localHeader;
        },
        toJSON: function() {
          const bytes = function(nr) {
            return "<" + (nr && nr.length + " bytes buffer" || "null") + ">";
          };
          return {
            entryName: this.entryName,
            name: this.name,
            comment: this.comment,
            isDirectory: this.isDirectory,
            header: _centralHeader.toJSON(),
            compressedData: bytes(input),
            data: bytes(uncompressedData)
          };
        },
        toString: function() {
          return JSON.stringify(this.toJSON(), null, "	");
        }
      };
    };
  }
});

// node_modules/adm-zip/zipFile.js
var require_zipFile = __commonJS({
  "node_modules/adm-zip/zipFile.js"(exports2, module2) {
    var ZipEntry = require_zipEntry();
    var Headers = require_headers();
    var Utils = require_util();
    module2.exports = function(inBuffer, options) {
      var entryList = [], entryTable = /* @__PURE__ */ Object.create(null), _comment = Buffer.alloc(0), mainHeader = new Headers.MainHeader(), loadedEntries = false;
      var password = null;
      const temporary = /* @__PURE__ */ new Set();
      const opts = options;
      const { noSort, decoder } = opts;
      if (inBuffer) {
        readMainHeader(opts.readEntries);
      } else {
        loadedEntries = true;
      }
      function makeTemporaryFolders() {
        const foldersList = /* @__PURE__ */ new Set();
        for (const elem of Object.keys(entryTable)) {
          const elements = elem.split("/");
          elements.pop();
          if (!elements.length) continue;
          for (let i = 0; i < elements.length; i++) {
            const sub = elements.slice(0, i + 1).join("/") + "/";
            foldersList.add(sub);
          }
        }
        for (const elem of foldersList) {
          if (!(elem in entryTable)) {
            const tempfolder = new ZipEntry(opts);
            tempfolder.entryName = elem;
            tempfolder.attr = 16;
            tempfolder.temporary = true;
            entryList.push(tempfolder);
            entryTable[tempfolder.entryName] = tempfolder;
            temporary.add(tempfolder);
          }
        }
      }
      function readEntries() {
        loadedEntries = true;
        entryTable = /* @__PURE__ */ Object.create(null);
        if (mainHeader.diskEntries > (inBuffer.length - mainHeader.offset) / Utils.Constants.CENHDR) {
          throw Utils.Errors.DISK_ENTRY_TOO_LARGE();
        }
        entryList = new Array(mainHeader.diskEntries);
        var index = mainHeader.offset;
        for (var i = 0; i < entryList.length; i++) {
          var tmp = index, entry = new ZipEntry(opts, inBuffer);
          entry.header = inBuffer.slice(tmp, tmp += Utils.Constants.CENHDR);
          entry.entryName = inBuffer.slice(tmp, tmp += entry.header.fileNameLength);
          if (entry.header.extraLength) {
            entry.extra = inBuffer.slice(tmp, tmp += entry.header.extraLength);
          }
          if (entry.header.commentLength) entry.comment = inBuffer.slice(tmp, tmp + entry.header.commentLength);
          index += entry.header.centralHeaderSize;
          if (entry.entryName in entryTable) {
            throw Utils.Errors.DUPLICATE_ENTRY(`"${entry.entryName}"`);
          }
          entryList[i] = entry;
          entryTable[entry.entryName] = entry;
        }
        temporary.clear();
        makeTemporaryFolders();
      }
      function readMainHeader(readNow) {
        var i = inBuffer.length - Utils.Constants.ENDHDR, max = Math.max(0, i - 65535), n = max, endStart = inBuffer.length, endOffset = -1, commentEnd = 0;
        const trailingSpace = typeof opts.trailingSpace === "boolean" ? opts.trailingSpace : false;
        if (trailingSpace) max = 0;
        for (i; i >= n; i--) {
          if (inBuffer[i] !== 80) continue;
          if (inBuffer.readUInt32LE(i) === Utils.Constants.ENDSIG) {
            endOffset = i;
            commentEnd = i;
            endStart = i + Utils.Constants.ENDHDR;
            n = i - Utils.Constants.END64HDR;
            continue;
          }
          if (inBuffer.readUInt32LE(i) === Utils.Constants.END64SIG) {
            n = max;
            continue;
          }
          if (inBuffer.readUInt32LE(i) === Utils.Constants.ZIP64SIG) {
            endOffset = i;
            endStart = i + Utils.readBigUInt64LE(inBuffer, i + Utils.Constants.ZIP64SIZE) + Utils.Constants.ZIP64LEAD;
            break;
          }
        }
        if (endOffset == -1) throw Utils.Errors.INVALID_FORMAT();
        mainHeader.loadFromBinary(inBuffer.slice(endOffset, endStart));
        if (mainHeader.commentLength) {
          _comment = inBuffer.slice(commentEnd + Utils.Constants.ENDHDR);
        }
        if (readNow) readEntries();
      }
      function sortEntries() {
        if (entryList.length > 1 && !noSort) {
          entryList = entryList.map((entry) => ({ entry, key: entry.entryName.toLowerCase() })).sort((a, b) => a.key.localeCompare(b.key)).map((pair) => pair.entry);
        }
      }
      return {
        /**
         * Returns an array of ZipEntry objects existent in the current opened archive
         * @return Array
         */
        get entries() {
          if (!loadedEntries) {
            readEntries();
          }
          return entryList.filter((e) => !temporary.has(e));
        },
        /**
         * Archive comment
         * @return {String}
         */
        get comment() {
          return decoder.decode(_comment);
        },
        set comment(val) {
          _comment = Utils.toBuffer(val, decoder.encode);
          mainHeader.commentLength = _comment.length;
        },
        getEntryCount: function() {
          if (!loadedEntries) {
            return mainHeader.diskEntries;
          }
          return entryList.length;
        },
        forEach: function(callback) {
          this.entries.forEach(callback);
        },
        /**
         * Returns a reference to the entry with the given name or null if entry is inexistent
         *
         * @param entryName
         * @return ZipEntry
         */
        getEntry: function(entryName) {
          if (!loadedEntries) {
            readEntries();
          }
          return entryTable[entryName] || null;
        },
        /**
         * Adds the given entry to the entry list
         *
         * @param entry
         */
        setEntry: function(entry) {
          if (!loadedEntries) {
            readEntries();
          }
          entryList.push(entry);
          entryTable[entry.entryName] = entry;
          mainHeader.totalEntries = entryList.length;
        },
        /**
         * Removes the file with the given name from the entry list.
         *
         * If the entry is a directory, then all nested files and directories will be removed
         * @param entryName
         * @returns {void}
         */
        deleteFile: function(entryName, withsubfolders = true) {
          if (!loadedEntries) {
            readEntries();
          }
          const entry = entryTable[entryName];
          const list = this.getEntryChildren(entry, withsubfolders).map((child) => child.entryName);
          list.forEach(this.deleteEntry);
        },
        /**
         * Removes the entry with the given name from the entry list.
         *
         * @param {string} entryName
         * @returns {void}
         */
        deleteEntry: function(entryName) {
          if (!loadedEntries) {
            readEntries();
          }
          const entry = entryTable[entryName];
          const index = entryList.indexOf(entry);
          if (index >= 0) {
            entryList.splice(index, 1);
            delete entryTable[entryName];
            mainHeader.totalEntries = entryList.length;
          }
        },
        /**
         *  Iterates and returns all nested files and directories of the given entry
         *
         * @param entry
         * @return Array
         */
        getEntryChildren: function(entry, subfolders = true) {
          if (!loadedEntries) {
            readEntries();
          }
          if (typeof entry === "object") {
            if (entry.isDirectory && subfolders) {
              const list = [];
              const name = entry.entryName;
              for (const zipEntry of entryList) {
                if (zipEntry.entryName.startsWith(name)) {
                  list.push(zipEntry);
                }
              }
              return list;
            } else {
              return [entry];
            }
          }
          return [];
        },
        /**
         *  How many child elements entry has
         *
         * @param {ZipEntry} entry
         * @return {integer}
         */
        getChildCount: function(entry) {
          if (entry && entry.isDirectory) {
            const list = this.getEntryChildren(entry);
            return list.includes(entry) ? list.length - 1 : list.length;
          }
          return 0;
        },
        /**
         * Returns the zip file
         *
         * @return Buffer
         */
        compressToBuffer: function() {
          if (!loadedEntries) {
            readEntries();
          }
          sortEntries();
          const dataBlock = [];
          const headerBlocks = [];
          let totalSize = 0;
          let dindex = 0;
          mainHeader.size = 0;
          mainHeader.offset = 0;
          let totalEntries = 0;
          for (const entry of this.entries) {
            const compressedData = entry.getCompressedData();
            entry.header.offset = dindex;
            const localHeader = entry.packLocalHeader();
            const dataLength = localHeader.length + compressedData.length;
            dindex += dataLength;
            dataBlock.push(localHeader);
            dataBlock.push(compressedData);
            const centralHeader = entry.packCentralHeader();
            headerBlocks.push(centralHeader);
            mainHeader.size += centralHeader.length;
            totalSize += dataLength + centralHeader.length;
            totalEntries++;
          }
          totalSize += mainHeader.mainHeaderSize;
          mainHeader.offset = dindex;
          mainHeader.totalEntries = totalEntries;
          dindex = 0;
          const outBuffer = Buffer.alloc(totalSize);
          for (const content of dataBlock) {
            content.copy(outBuffer, dindex);
            dindex += content.length;
          }
          for (const content of headerBlocks) {
            content.copy(outBuffer, dindex);
            dindex += content.length;
          }
          const mh = mainHeader.toBinary();
          if (_comment) {
            _comment.copy(mh, mh.length - _comment.length);
          }
          mh.copy(outBuffer, dindex);
          inBuffer = outBuffer;
          loadedEntries = false;
          return outBuffer;
        },
        toAsyncBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
          try {
            if (!loadedEntries) {
              readEntries();
            }
            sortEntries();
            const dataBlock = [];
            const centralHeaders = [];
            let totalSize = 0;
            let dindex = 0;
            let totalEntries = 0;
            mainHeader.size = 0;
            mainHeader.offset = 0;
            const compress2Buffer = function(entryLists) {
              if (entryLists.length > 0) {
                const entry = entryLists.shift();
                const name = entry.entryName + entry.extra.toString();
                if (onItemStart) onItemStart(name);
                entry.getCompressedDataAsync(function(compressedData) {
                  if (onItemEnd) onItemEnd(name);
                  entry.header.offset = dindex;
                  const localHeader = entry.packLocalHeader();
                  const dataLength = localHeader.length + compressedData.length;
                  dindex += dataLength;
                  dataBlock.push(localHeader);
                  dataBlock.push(compressedData);
                  const centalHeader = entry.packCentralHeader();
                  centralHeaders.push(centalHeader);
                  mainHeader.size += centalHeader.length;
                  totalSize += dataLength + centalHeader.length;
                  totalEntries++;
                  compress2Buffer(entryLists);
                });
              } else {
                totalSize += mainHeader.mainHeaderSize;
                mainHeader.offset = dindex;
                mainHeader.totalEntries = totalEntries;
                dindex = 0;
                const outBuffer = Buffer.alloc(totalSize);
                dataBlock.forEach(function(content) {
                  content.copy(outBuffer, dindex);
                  dindex += content.length;
                });
                centralHeaders.forEach(function(content) {
                  content.copy(outBuffer, dindex);
                  dindex += content.length;
                });
                const mh = mainHeader.toBinary();
                if (_comment) {
                  _comment.copy(mh, mh.length - _comment.length);
                }
                mh.copy(outBuffer, dindex);
                inBuffer = outBuffer;
                loadedEntries = false;
                onSuccess(outBuffer);
              }
            };
            compress2Buffer(Array.from(this.entries));
          } catch (e) {
            onFail(e);
          }
        }
      };
    };
  }
});

// node_modules/adm-zip/adm-zip.js
var require_adm_zip = __commonJS({
  "node_modules/adm-zip/adm-zip.js"(exports2, module2) {
    var Utils = require_util();
    var pth = require("path");
    var ZipEntry = require_zipEntry();
    var ZipFile = require_zipFile();
    var get_Bool = (...val) => Utils.findLast(val, (c) => typeof c === "boolean");
    var get_Str = (...val) => Utils.findLast(val, (c) => typeof c === "string");
    var get_Fun = (...val) => Utils.findLast(val, (c) => typeof c === "function");
    var defaultOptions = {
      // option "noSort" : if true it disables files sorting
      noSort: false,
      // read entries during load (initial loading may be slower)
      readEntries: false,
      // default method is none
      method: Utils.Constants.NONE,
      // file system
      fs: null
    };
    module2.exports = function(input, options) {
      let inBuffer = null;
      const opts = Object.assign(/* @__PURE__ */ Object.create(null), defaultOptions);
      if (input && "object" === typeof input) {
        if (!(input instanceof Uint8Array)) {
          Object.assign(opts, input);
          input = opts.input ? opts.input : void 0;
          if (opts.input) delete opts.input;
        }
        if (Buffer.isBuffer(input)) {
          inBuffer = input;
          opts.method = Utils.Constants.BUFFER;
          input = void 0;
        }
      }
      Object.assign(opts, options);
      const filetools = new Utils(opts);
      const applyDirAttributes = (dirEntries) => {
        dirEntries.filter((d) => d.attr).sort((a, b) => b.path.length - a.path.length).forEach((d) => filetools.fs.chmodSync(d.path, d.attr));
      };
      if (typeof opts.decoder !== "object" || typeof opts.decoder.encode !== "function" || typeof opts.decoder.decode !== "function") {
        opts.decoder = Utils.decoder;
      }
      if (input && "string" === typeof input) {
        if (filetools.fs.existsSync(input)) {
          opts.method = Utils.Constants.FILE;
          opts.filename = input;
          inBuffer = filetools.fs.readFileSync(input);
        } else {
          throw Utils.Errors.INVALID_FILENAME();
        }
      }
      const _zip = new ZipFile(inBuffer, opts);
      const { canonical, sanitize, zipnamefix } = Utils;
      function getEntry(entry) {
        if (entry && _zip) {
          var item;
          if (typeof entry === "string") item = _zip.getEntry(pth.posix.normalize(entry));
          if (typeof entry === "object" && typeof entry.entryName !== "undefined" && typeof entry.header !== "undefined") item = _zip.getEntry(entry.entryName);
          if (item) {
            return item;
          }
        }
        return null;
      }
      function fixPath(zipPath) {
        const { join, normalize, sep } = pth.posix;
        return join(pth.isAbsolute(zipPath) ? "/" : ".", normalize(sep + zipPath.split("\\").join(sep) + sep));
      }
      function filenameFilter(filterfn) {
        if (filterfn instanceof RegExp) {
          return /* @__PURE__ */ function(rx) {
            return function(filename) {
              return rx.test(filename);
            };
          }(filterfn);
        } else if ("function" !== typeof filterfn) {
          return () => true;
        }
        return filterfn;
      }
      const relativePath = (local, entry) => {
        let lastChar = entry.slice(-1);
        lastChar = lastChar === filetools.sep ? filetools.sep : "";
        return pth.relative(local, entry) + lastChar;
      };
      return {
        /**
         * Extracts the given entry from the archive and returns the content as a Buffer object
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {Buffer|string} [pass] - password
         * @return Buffer or Null in case of error
         */
        readFile: function(entry, pass) {
          var item = getEntry(entry);
          return item && item.getData(pass) || null;
        },
        /**
         * Returns how many child elements has on entry (directories) on files it is always 0
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @returns {integer}
         */
        childCount: function(entry) {
          const item = getEntry(entry);
          if (item) {
            return _zip.getChildCount(item);
          }
        },
        /**
         * Asynchronous readFile
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {callback} callback
         *
         * @return Buffer or Null in case of error
         */
        readFileAsync: function(entry, callback) {
          var item = getEntry(entry);
          if (item) {
            item.getDataAsync(callback);
          } else {
            callback(null, "getEntry failed for:" + entry);
          }
        },
        /**
         * Extracts the given entry from the archive and returns the content as plain text in the given encoding
         * @param {ZipEntry|string} entry - ZipEntry object or String with the full path of the entry
         * @param {string} encoding - Optional. If no encoding is specified utf8 is used
         *
         * @return String
         */
        readAsText: function(entry, encoding) {
          var item = getEntry(entry);
          if (item) {
            var data = item.getData();
            if (data && data.length) {
              return data.toString(encoding || "utf8");
            }
          }
          return "";
        },
        /**
         * Asynchronous readAsText
         * @param {ZipEntry|string} entry ZipEntry object or String with the full path of the entry
         * @param {callback} callback
         * @param {string} [encoding] - Optional. If no encoding is specified utf8 is used
         *
         * @return String
         */
        readAsTextAsync: function(entry, callback, encoding) {
          var item = getEntry(entry);
          if (item) {
            item.getDataAsync(function(data, err) {
              if (err) {
                callback(data, err);
                return;
              }
              if (data && data.length) {
                callback(data.toString(encoding || "utf8"));
              } else {
                callback("");
              }
            });
          } else {
            callback("");
          }
        },
        /**
         * Remove the entry from the file or the entry and all it's nested directories and files if the given entry is a directory
         *
         * @param {ZipEntry|string} entry
         * @param {boolean} withsubfolders
         * @returns {void}
         */
        deleteFile: function(entry, withsubfolders = true) {
          var item = getEntry(entry);
          if (item) {
            _zip.deleteFile(item.entryName, withsubfolders);
          }
        },
        /**
         * Remove the entry from the file or directory without affecting any nested entries
         *
         * @param {ZipEntry|string} entry
         * @returns {void}
         */
        deleteEntry: function(entry) {
          var item = getEntry(entry);
          if (item) {
            _zip.deleteEntry(item.entryName);
          }
        },
        /**
         * Adds a comment to the zip. The zip must be rewritten after adding the comment.
         *
         * @param {string} comment
         */
        addZipComment: function(comment) {
          _zip.comment = comment;
        },
        /**
         * Returns the zip comment
         *
         * @return String
         */
        getZipComment: function() {
          return _zip.comment || "";
        },
        /**
         * Adds a comment to a specified zipEntry. The zip must be rewritten after adding the comment
         * The comment cannot exceed 65535 characters in length
         *
         * @param {ZipEntry} entry
         * @param {string} comment
         */
        addZipEntryComment: function(entry, comment) {
          var item = getEntry(entry);
          if (item) {
            item.comment = comment;
          }
        },
        /**
         * Returns the comment of the specified entry
         *
         * @param {ZipEntry} entry
         * @return String
         */
        getZipEntryComment: function(entry) {
          var item = getEntry(entry);
          if (item) {
            return item.comment || "";
          }
          return "";
        },
        /**
         * Updates the content of an existing entry inside the archive. The zip must be rewritten after updating the content
         *
         * @param {ZipEntry} entry
         * @param {Buffer} content
         */
        updateFile: function(entry, content) {
          var item = getEntry(entry);
          if (item) {
            item.setData(content);
          }
        },
        /**
         * Adds a file from the disk to the archive
         *
         * @param {string} localPath File to add to zip
         * @param {string} [zipPath] Optional path inside the zip
         * @param {string} [zipName] Optional name for the file
         * @param {string} [comment] Optional file comment
         */
        addLocalFile: function(localPath, zipPath, zipName, comment) {
          if (filetools.fs.existsSync(localPath)) {
            zipPath = zipPath ? fixPath(zipPath) : "";
            const p = pth.win32.basename(pth.win32.normalize(localPath));
            zipPath += zipName ? zipName : p;
            const _attr = filetools.fs.statSync(localPath);
            const data = _attr.isFile() ? filetools.fs.readFileSync(localPath) : Buffer.alloc(0);
            if (_attr.isDirectory()) zipPath += filetools.sep;
            this.addFile(zipPath, data, comment, _attr);
          } else {
            throw Utils.Errors.FILE_NOT_FOUND(localPath);
          }
        },
        /**
         * Callback for showing if everything was done.
         *
         * @callback doneCallback
         * @param {Error} err - Error object
         * @param {boolean} done - was request fully completed
         */
        /**
         * Adds a file from the disk to the archive
         *
         * @param {(object|string)} options - options object, if it is string it us used as localPath.
         * @param {string} options.localPath - Local path to the file.
         * @param {string} [options.comment] - Optional file comment.
         * @param {string} [options.zipPath] - Optional path inside the zip
         * @param {string} [options.zipName] - Optional name for the file
         * @param {doneCallback} callback - The callback that handles the response.
         */
        addLocalFileAsync: function(options2, callback) {
          options2 = typeof options2 === "object" ? options2 : { localPath: options2 };
          const localPath = pth.resolve(options2.localPath);
          const { comment } = options2;
          let { zipPath, zipName } = options2;
          const self = this;
          filetools.fs.stat(localPath, function(err, stats) {
            if (err) return callback(err, false);
            zipPath = zipPath ? fixPath(zipPath) : "";
            const p = pth.win32.basename(pth.win32.normalize(localPath));
            zipPath += zipName ? zipName : p;
            if (stats.isFile()) {
              filetools.fs.readFile(localPath, function(err2, data) {
                if (err2) return callback(err2, false);
                self.addFile(zipPath, data, comment, stats);
                return setImmediate(callback, void 0, true);
              });
            } else if (stats.isDirectory()) {
              zipPath += filetools.sep;
              self.addFile(zipPath, Buffer.alloc(0), comment, stats);
              return setImmediate(callback, void 0, true);
            }
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {string} localPath - local path to the folder
         * @param {string} [zipPath] - optional path inside zip
         * @param {(RegExp|function)} [filter] - optional RegExp or Function if files match will be included.
         */
        addLocalFolder: function(localPath, zipPath, filter) {
          filter = filenameFilter(filter);
          zipPath = zipPath ? fixPath(zipPath) : "";
          localPath = pth.normalize(localPath);
          if (filetools.fs.existsSync(localPath)) {
            const items = filetools.findFiles(localPath);
            const self = this;
            if (items.length) {
              for (const filepath of items) {
                const p = pth.join(zipPath, relativePath(localPath, filepath));
                if (filter(p)) {
                  self.addLocalFile(filepath, pth.dirname(p));
                }
              }
            }
          } else {
            throw Utils.Errors.FILE_NOT_FOUND(localPath);
          }
        },
        /**
         * Asynchronous addLocalFolder
         * @param {string} localPath
         * @param {callback} callback
         * @param {string} [zipPath] optional path inside zip
         * @param {RegExp|function} [filter] optional RegExp or Function if files match will
         *               be included.
         */
        addLocalFolderAsync: function(localPath, callback, zipPath, filter) {
          filter = filenameFilter(filter);
          zipPath = zipPath ? fixPath(zipPath) : "";
          localPath = pth.normalize(localPath);
          var self = this;
          filetools.fs.open(localPath, "r", function(err) {
            if (err && err.code === "ENOENT") {
              callback(void 0, Utils.Errors.FILE_NOT_FOUND(localPath));
            } else if (err) {
              callback(void 0, err);
            } else {
              var items = filetools.findFiles(localPath);
              var i = -1;
              var next = function() {
                i += 1;
                if (i < items.length) {
                  var filepath = items[i];
                  var p = relativePath(localPath, filepath).split("\\").join("/");
                  p = p.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
                  if (filter(p)) {
                    filetools.fs.stat(filepath, function(er0, stats) {
                      if (er0) callback(void 0, er0);
                      if (stats.isFile()) {
                        filetools.fs.readFile(filepath, function(er1, data) {
                          if (er1) {
                            callback(void 0, er1);
                          } else {
                            self.addFile(zipPath + p, data, "", stats);
                            next();
                          }
                        });
                      } else {
                        self.addFile(zipPath + p + "/", Buffer.alloc(0), "", stats);
                        next();
                      }
                    });
                  } else {
                    process.nextTick(() => {
                      next();
                    });
                  }
                } else {
                  callback(true, void 0);
                }
              };
              next();
            }
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {object | string} options - options object, if it is string it us used as localPath.
         * @param {string} options.localPath - Local path to the folder.
         * @param {string} [options.zipPath] - optional path inside zip.
         * @param {RegExp|function} [options.filter] - optional RegExp or Function if files match will be included.
         * @param {function|string} [options.namefix] - optional function to help fix filename
         * @param {doneCallback} callback - The callback that handles the response.
         *
         */
        addLocalFolderAsync2: function(options2, callback) {
          const self = this;
          options2 = typeof options2 === "object" ? options2 : { localPath: options2 };
          const localPath = pth.resolve(options2.localPath);
          let { zipPath, filter, namefix } = options2;
          if (filter instanceof RegExp) {
            filter = /* @__PURE__ */ function(rx) {
              return function(filename) {
                return rx.test(filename);
              };
            }(filter);
          } else if ("function" !== typeof filter) {
            filter = function() {
              return true;
            };
          }
          zipPath = zipPath ? fixPath(zipPath) : "";
          if (namefix === "latin1") {
            namefix = (str) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\x20-\x7E]/g, "");
          }
          if (typeof namefix !== "function") namefix = (str) => str;
          const relPathFix = (entry) => pth.join(zipPath, namefix(relativePath(localPath, entry)));
          const fileNameFix = (entry) => pth.win32.basename(pth.win32.normalize(namefix(entry)));
          filetools.fs.open(localPath, "r", function(err) {
            if (err && err.code === "ENOENT") {
              callback(Utils.Errors.FILE_NOT_FOUND(localPath), false);
            } else if (err) {
              callback(err, false);
            } else {
              filetools.findFilesAsync(localPath, function(err2, fileEntries) {
                if (err2) return callback(err2, false);
                fileEntries = fileEntries.filter((dir) => filter(relPathFix(dir)));
                if (!fileEntries.length) return callback(void 0, true);
                setImmediate(
                  fileEntries.reverse().reduce(function(next, entry) {
                    return function(err3, done) {
                      if (err3 || done === false) return setImmediate(next, err3, false);
                      self.addLocalFileAsync(
                        {
                          localPath: entry,
                          zipPath: pth.dirname(relPathFix(entry)),
                          zipName: fileNameFix(entry)
                        },
                        next
                      );
                    };
                  }, callback)
                );
              });
            }
          });
        },
        /**
         * Adds a local directory and all its nested files and directories to the archive
         *
         * @param {string} localPath - path where files will be extracted
         * @param {object} props - optional properties
         * @param {string} [props.zipPath] - optional path inside zip
         * @param {RegExp|function} [props.filter] - optional RegExp or Function if files match will be included.
         * @param {function|string} [props.namefix] - optional function to help fix filename
         */
        addLocalFolderPromise: function(localPath, props) {
          return new Promise((resolve, reject) => {
            this.addLocalFolderAsync2(Object.assign({ localPath }, props), (err, done) => {
              if (err) return reject(err);
              if (done) resolve(this);
            });
          });
        },
        /**
         * Allows you to create a entry (file or directory) in the zip file.
         * If you want to create a directory the entryName must end in / and a null buffer should be provided.
         * Comment and attributes are optional
         *
         * @param {string} entryName
         * @param {Buffer | string} content - file content as buffer or utf8 coded string
         * @param {string} [comment] - file comment
         * @param {number | object} [attr] - number as unix file permissions, object as filesystem Stats object
         */
        addFile: function(entryName, content, comment, attr) {
          entryName = zipnamefix(entryName);
          let entry = getEntry(entryName);
          const update = entry != null;
          if (!update) {
            entry = new ZipEntry(opts);
            entry.entryName = entryName;
          }
          entry.comment = comment || "";
          const isStat = "object" === typeof attr && attr instanceof filetools.fs.Stats;
          if (isStat) {
            entry.header.time = attr.mtime;
          }
          var fileattr = entry.isDirectory ? 16 : 0;
          let unix = entry.isDirectory ? 16384 : 32768;
          if (isStat) {
            unix |= 4095 & attr.mode;
          } else if ("number" === typeof attr) {
            unix |= 4095 & attr;
          } else {
            unix |= entry.isDirectory ? 493 : 420;
          }
          fileattr = (fileattr | unix << 16) >>> 0;
          entry.attr = fileattr;
          entry.setData(content);
          if (!update) _zip.setEntry(entry);
          return entry;
        },
        /**
         * Returns an array of ZipEntry objects representing the files and folders inside the archive
         *
         * @param {string} [password]
         * @returns Array
         */
        getEntries: function(password) {
          _zip.password = password;
          return _zip ? _zip.entries : [];
        },
        /**
         * Returns a ZipEntry object representing the file or folder specified by ``name``.
         *
         * @param {string} name
         * @return ZipEntry
         */
        getEntry: function(name) {
          return getEntry(name);
        },
        getEntryCount: function() {
          return _zip.getEntryCount();
        },
        forEach: function(callback) {
          return _zip.forEach(callback);
        },
        /**
         * Extracts the given entry to the given targetPath
         * If the entry is a directory inside the archive, the entire directory and it's subdirectories will be extracted
         *
         * @param {string|ZipEntry} entry - ZipEntry object or String with the full path of the entry
         * @param {string} targetPath - Target folder where to write the file
         * @param {boolean} [maintainEntryPath=true] - If maintainEntryPath is true and the entry is inside a folder, the entry folder will be created in targetPath as well. Default is TRUE
         * @param {boolean} [overwrite=false] - If the file already exists at the target path, the file will be overwriten if this is true.
         * @param {boolean} [keepOriginalPermission=false] - The file will be set as the permission from the entry if this is true.
         * @param {string} [outFileName] - String If set will override the filename of the extracted file (Only works if the entry is a file)
         *
         * @return Boolean
         */
        extractEntryTo: function(entry, targetPath, maintainEntryPath, overwrite, keepOriginalPermission, outFileName) {
          overwrite = get_Bool(false, overwrite);
          keepOriginalPermission = get_Bool(false, keepOriginalPermission);
          maintainEntryPath = get_Bool(true, maintainEntryPath);
          outFileName = get_Str(keepOriginalPermission, outFileName);
          var item = getEntry(entry);
          if (!item) {
            throw Utils.Errors.NO_ENTRY();
          }
          var entryName = canonical(item.entryName);
          var target = sanitize(targetPath, outFileName && !item.isDirectory ? canonical(outFileName) : maintainEntryPath ? entryName : pth.basename(entryName));
          if (item.isDirectory) {
            var children = _zip.getEntryChildren(item);
            children.forEach(function(child) {
              if (child.isDirectory) return;
              var content2 = child.getData();
              if (!content2) {
                throw Utils.Errors.CANT_EXTRACT_FILE();
              }
              var name = canonical(maintainEntryPath ? child.entryName : child.entryName.substring(item.entryName.length));
              var childName = sanitize(targetPath, name);
              filetools.assertPathSafe(targetPath, childName);
              const fileAttr2 = keepOriginalPermission ? child.header.fileAttr : void 0;
              filetools.writeFileTo(childName, content2, overwrite, fileAttr2);
            });
            return true;
          }
          var content = item.getData(_zip.password);
          if (!content) throw Utils.Errors.CANT_EXTRACT_FILE();
          filetools.assertPathSafe(targetPath, target);
          if (filetools.fs.existsSync(target) && !overwrite) {
            throw Utils.Errors.CANT_OVERRIDE();
          }
          const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
          filetools.writeFileTo(target, content, overwrite, fileAttr);
          return true;
        },
        /**
         * Test the archive
         * @param {string} [pass]
         */
        test: function(pass) {
          if (!_zip) {
            return false;
          }
          for (var entry of _zip.entries) {
            try {
              if (entry.isDirectory) {
                continue;
              }
              var content = entry.getData(pass);
              if (!content) {
                return false;
              }
            } catch (err) {
              return false;
            }
          }
          return true;
        },
        /**
         * Extracts the entire archive to the given location
         *
         * @param {string} targetPath Target location
         * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
         *                  Default is FALSE
         * @param {string|Buffer} [pass] password
         */
        extractAllTo: function(targetPath, overwrite, keepOriginalPermission, pass) {
          keepOriginalPermission = get_Bool(false, keepOriginalPermission);
          pass = get_Str(keepOriginalPermission, pass);
          overwrite = get_Bool(false, overwrite);
          if (!_zip) throw Utils.Errors.NO_ZIP();
          const dirEntries = [];
          _zip.entries.forEach(function(entry) {
            var entryName = sanitize(targetPath, canonical(entry.entryName));
            filetools.assertPathSafe(targetPath, entryName);
            if (entry.isDirectory) {
              filetools.makeDir(entryName);
              if (keepOriginalPermission) dirEntries.push({ path: entryName, attr: entry.header.fileAttr });
              return;
            }
            var content = entry.getData(pass);
            if (!content) {
              throw Utils.Errors.CANT_EXTRACT_FILE();
            }
            const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
            filetools.writeFileTo(entryName, content, overwrite, fileAttr);
            try {
              filetools.fs.utimesSync(entryName, entry.header.time, entry.header.time);
            } catch (err) {
            }
          });
          applyDirAttributes(dirEntries);
        },
        /**
         * Asynchronous extractAllTo
         *
         * @param {string} targetPath Target location
         * @param {boolean} [overwrite=false] If the file already exists at the target path, the file will be overwriten if this is true.
         *                  Default is FALSE
         * @param {boolean} [keepOriginalPermission=false] The file will be set as the permission from the entry if this is true.
         *                  Default is FALSE
         * @param {function} callback The callback will be executed when all entries are extracted successfully or any error is thrown.
         */
        extractAllToAsync: function(targetPath, overwrite, keepOriginalPermission, callback) {
          callback = get_Fun(overwrite, keepOriginalPermission, callback);
          keepOriginalPermission = get_Bool(false, keepOriginalPermission);
          overwrite = get_Bool(false, overwrite);
          if (!callback) {
            return new Promise((resolve, reject) => {
              this.extractAllToAsync(targetPath, overwrite, keepOriginalPermission, function(err) {
                if (err) {
                  reject(err);
                } else {
                  resolve(this);
                }
              });
            });
          }
          if (!_zip) {
            callback(Utils.Errors.NO_ZIP());
            return;
          }
          targetPath = pth.resolve(targetPath);
          const getPath = (entry) => sanitize(targetPath, pth.normalize(canonical(entry.entryName)));
          const getError = (msg, file) => new Error(msg + ': "' + file + '"');
          const dirEntries = [];
          const fileEntries = [];
          _zip.entries.forEach((e) => {
            if (e.isDirectory) {
              dirEntries.push(e);
            } else {
              fileEntries.push(e);
            }
          });
          const deferredDirAttr = [];
          for (const entry of dirEntries) {
            const dirPath = getPath(entry);
            const dirAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
            try {
              filetools.assertPathSafe(targetPath, dirPath);
              filetools.makeDir(dirPath);
            } catch (er) {
              callback(getError("Unable to create folder", dirPath));
              continue;
            }
            if (dirAttr) deferredDirAttr.push({ path: dirPath, attr: dirAttr });
            try {
              filetools.fs.utimesSync(dirPath, entry.header.time, entry.header.time);
            } catch (er) {
            }
          }
          const done = (err) => {
            if (!err) {
              try {
                applyDirAttributes(deferredDirAttr);
              } catch (er) {
                return callback(getError("Unable to set folder permissions", er.path || ""));
              }
            }
            callback(err);
          };
          fileEntries.reverse().reduce(function(next, entry) {
            return function(err) {
              if (err) {
                next(err);
              } else {
                const entryName = pth.normalize(canonical(entry.entryName));
                const filePath = sanitize(targetPath, entryName);
                try {
                  filetools.assertPathSafe(targetPath, filePath);
                } catch (er) {
                  return next(er);
                }
                entry.getDataAsync(function(content, err_1) {
                  if (err_1) {
                    next(err_1);
                  } else if (!content) {
                    next(Utils.Errors.CANT_EXTRACT_FILE());
                  } else {
                    const fileAttr = keepOriginalPermission ? entry.header.fileAttr : void 0;
                    filetools.writeFileToAsync(filePath, content, overwrite, fileAttr, function(succ) {
                      if (!succ) {
                        return next(getError("Unable to write file", filePath));
                      }
                      filetools.fs.utimes(filePath, entry.header.time, entry.header.time, function() {
                        next();
                      });
                    });
                  }
                });
              }
            };
          }, done)();
        },
        /**
         * Writes the newly created zip file to disk at the specified location or if a zip was opened and no ``targetFileName`` is provided, it will overwrite the opened zip
         *
         * @param {string} targetFileName
         * @param {function} callback
         */
        writeZip: function(targetFileName, callback) {
          if (arguments.length === 1) {
            if (typeof targetFileName === "function") {
              callback = targetFileName;
              targetFileName = "";
            }
          }
          if (!targetFileName && opts.filename) {
            targetFileName = opts.filename;
          }
          if (!targetFileName) return;
          var zipData = _zip.compressToBuffer();
          if (zipData) {
            var ok = filetools.writeFileTo(targetFileName, zipData, true);
            if (typeof callback === "function") callback(!ok ? new Error("failed") : null, "");
          }
        },
        /**
                 *
                 * @param {string} targetFileName
                 * @param {object} [props]
                 * @param {boolean} [props.overwrite=true] If the file already exists at the target path, the file will be overwriten if this is true.
                 * @param {boolean} [props.perm] The file will be set as the permission from the entry if this is true.
        
                 * @returns {Promise<void>}
                 */
        writeZipPromise: function(targetFileName, props) {
          const { overwrite, perm } = Object.assign({ overwrite: true }, props);
          return new Promise((resolve, reject) => {
            if (!targetFileName && opts.filename) targetFileName = opts.filename;
            if (!targetFileName) reject("ADM-ZIP: ZIP File Name Missing");
            this.toBufferPromise().then((zipData) => {
              const ret = (done) => done ? resolve(done) : reject("ADM-ZIP: Wasn't able to write zip file");
              filetools.writeFileToAsync(targetFileName, zipData, overwrite, perm, ret);
            }, reject);
          });
        },
        /**
         * @returns {Promise<Buffer>} A promise to the Buffer.
         */
        toBufferPromise: function() {
          return new Promise((resolve, reject) => {
            _zip.toAsyncBuffer(resolve, reject);
          });
        },
        /**
         * Returns the content of the entire zip file as a Buffer object
         *
         * @prop {function} [onSuccess]
         * @prop {function} [onFail]
         * @prop {function} [onItemStart]
         * @prop {function} [onItemEnd]
         * @returns {Buffer}
         */
        toBuffer: function(onSuccess, onFail, onItemStart, onItemEnd) {
          if (typeof onSuccess === "function") {
            _zip.toAsyncBuffer(onSuccess, onFail, onItemStart, onItemEnd);
            return null;
          }
          return _zip.compressToBuffer();
        }
      };
    };
  }
});

// electron/main.ts
var import_electron = require("electron");
var import_path = __toESM(require("path"));
var import_fs = __toESM(require("fs"));
var __dirname = import_path.default.resolve();
var isDev = !import_electron.app.isPackaged;
import_electron.app.disableHardwareAcceleration();
import_electron.app.commandLine.appendSwitch("disable-gpu");
import_electron.app.commandLine.appendSwitch("disable-gpu-compositing");
import_electron.app.commandLine.appendSwitch("disable-software-rasterizer");
function getDataPath(fileName) {
  return import_path.default.join(import_electron.app.getPath("userData"), fileName);
}
function readDataFile(fileName) {
  try {
    const p = getDataPath(fileName);
    if (!import_fs.default.existsSync(p)) return null;
    return import_fs.default.readFileSync(p, "utf-8");
  } catch {
    return null;
  }
}
function writeDataFile(fileName, data) {
  try {
    const p = getDataPath(fileName);
    import_fs.default.mkdirSync(import_path.default.dirname(p), { recursive: true });
    import_fs.default.writeFileSync(p, data, "utf-8");
    return true;
  } catch {
    return false;
  }
}
function migrateFromDev() {
  const devDataPath = import_path.default.join(import_path.default.dirname(import_electron.app.getPath("userData")), "archives-app");
  if (!import_fs.default.existsSync(devDataPath)) return;
  const filesToMigrate = ["albums.json", "app-root.txt", "project-config.json"];
  for (const fileName of filesToMigrate) {
    const dest = getDataPath(fileName);
    if (import_fs.default.existsSync(dest)) continue;
    const src = import_path.default.join(devDataPath, fileName);
    if (!import_fs.default.existsSync(src)) continue;
    try {
      import_fs.default.mkdirSync(import_path.default.dirname(dest), { recursive: true });
      import_fs.default.copyFileSync(src, dest);
    } catch (e) {
    }
  }
}
function createWindow() {
  const win = new import_electron.BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1e3,
    minHeight: 700,
    backgroundColor: "#0a0a0a",
    titleBarStyle: "hidden",
    frame: false,
    webPreferences: {
      preload: import_path.default.join(__dirname, "electron/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: false
    },
    icon: isDev ? import_path.default.join(process.cwd(), "public", "icon.ico") : import_path.default.join(__dirname, "..", "dist", "icon.ico")
  });
  if (isDev) {
    const tryLoad = async (attempt = 0) => {
      const ports = [5e4, 50001, 50002, 50003, 50004, 50005, 50006, 50007, 50008, 50009, 50010];
      for (const port of ports) {
        try {
          const res = await fetch(`http://localhost:${port}/`).catch(() => null);
          if (res?.ok) {
            const text = await res.text();
            const isVite = text.includes("vite") || text.includes("src/main.tsx") || text.includes('type="module"');
            if (isVite) {
              win.loadURL(`http://localhost:${port}`);
              return;
            }
          }
        } catch (e) {
        }
      }
      if (attempt < 30) {
        setTimeout(() => tryLoad(attempt + 1), 500);
      } else {
        win.loadURL("http://localhost:50001");
      }
    };
    tryLoad();
  } else {
    win.loadFile(import_path.default.join(__dirname, "../dist/index.html"));
  }
  win.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12" && input.type === "keyDown") {
      if (win.webContents.isDevToolsOpened()) {
        win.webContents.closeDevTools();
      } else {
        win.webContents.openDevTools({ mode: "detach" });
      }
    }
  });
  win.webContents.on("will-navigate", (e, url) => {
    if (url.startsWith("file://")) e.preventDefault();
  });
}
import_electron.app.whenReady().then(() => {
  migrateFromDev();
  createWindow();
});
import_electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") import_electron.app.quit();
});
import_electron.app.on("activate", () => {
  if (import_electron.BrowserWindow.getAllWindows().length === 0) createWindow();
});
import_electron.ipcMain.handle("select-folder", async () => {
  const result = await import_electron.dialog.showOpenDialog({ properties: ["openDirectory"] });
  if (result.canceled) return null;
  return result.filePaths[0];
});
import_electron.ipcMain.handle("select-dest-folder", async () => {
  const result = await import_electron.dialog.showOpenDialog({
    properties: ["openDirectory"],
    title: "Selecionar pasta destino"
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});
import_electron.ipcMain.handle("select-files", async (_, opts = {}) => {
  const properties = ["openFile"];
  if (opts.multiple) properties.push("multiSelections");
  const result = await import_electron.dialog.showOpenDialog({
    title: opts.title || "Selecionar arquivo",
    filters: opts.filters || [],
    properties
  });
  if (result.canceled) return null;
  return result.filePaths;
});
import_electron.ipcMain.handle("list-files", async (_, folderPath) => {
  if (!folderPath || !import_fs.default.existsSync(folderPath)) return [];
  try {
    const entries = await import_fs.default.promises.readdir(folderPath, { withFileTypes: true });
    const items = await Promise.all(entries.map(async (entry) => {
      const fullPath = import_path.default.join(folderPath, entry.name);
      let size = 0;
      try {
        if (!entry.isDirectory()) {
          const stat = await import_fs.default.promises.stat(fullPath);
          size = stat.size;
        }
      } catch {
      }
      return {
        name: entry.name,
        isDirectory: entry.isDirectory(),
        path: fullPath,
        ext: import_path.default.extname(entry.name).toLowerCase(),
        size
      };
    }));
    return items;
  } catch {
    return [];
  }
});
import_electron.ipcMain.handle("list-files-recursive", async (_, folderPath) => {
  if (!folderPath || !import_fs.default.existsSync(folderPath)) return [];
  const results = [];
  async function walk(dir) {
    let entries;
    try {
      entries = await import_fs.default.promises.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    const dirs = [];
    for (const entry of entries) {
      const fullPath = import_path.default.join(dir, entry.name);
      if (entry.isDirectory()) {
        dirs.push(fullPath);
      } else {
        let size = 0;
        try {
          const stat = await import_fs.default.promises.stat(fullPath);
          size = stat.size;
        } catch {
        }
        results.push({
          name: entry.name,
          isDirectory: false,
          path: fullPath,
          ext: import_path.default.extname(entry.name).toLowerCase(),
          size,
          relativePath: import_path.default.relative(folderPath, fullPath)
        });
      }
    }
    const CONCURRENCY = 8;
    for (let i = 0; i < dirs.length; i += CONCURRENCY) {
      await Promise.all(dirs.slice(i, i + CONCURRENCY).map(walk));
    }
  }
  await walk(folderPath);
  return results;
});
import_electron.ipcMain.handle("file-exists", async (_, filePath) => {
  if (!filePath) return false;
  return import_fs.default.existsSync(filePath);
});
import_electron.ipcMain.on("drag-out-file", (event, filePath) => {
  if (!filePath || !import_fs.default.existsSync(filePath)) return;
  const candidateIcons = isDev ? [
    import_path.default.join(__dirname, "../public/icon.png"),
    import_path.default.join(__dirname, "../public/icons.svg")
  ] : [
    import_path.default.join(process.resourcesPath, "icon.ico"),
    import_path.default.join(process.resourcesPath, "icon.png"),
    import_path.default.join(__dirname, "../dist/icon.png"),
    import_path.default.join(__dirname, "../public/icon.png")
  ];
  const iconPath = candidateIcons.find((p) => import_fs.default.existsSync(p));
  if (!iconPath) {
    return;
  }
  try {
    event.sender.startDrag({ file: filePath, icon: iconPath });
  } catch (err) {
  }
});
import_electron.ipcMain.handle("open-file", async (_, filePath) => {
  import_electron.shell.openPath(filePath);
});
import_electron.ipcMain.handle("reveal-file", async (_, filePath) => {
  import_electron.shell.showItemInFolder(filePath);
});
import_electron.ipcMain.handle("rename-file", async (_, oldPath, newName) => {
  try {
    const dir = import_path.default.dirname(oldPath);
    const newPath = import_path.default.join(dir, newName);
    if (import_fs.default.existsSync(newPath)) return { ok: false, error: "J\xE1 existe um arquivo com esse nome." };
    import_fs.default.renameSync(oldPath, newPath);
    return { ok: true, newPath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});
import_electron.ipcMain.handle("delete-file", async (_, filePath) => {
  try {
    if (!filePath) return { ok: false, error: "Path n\xE3o informado." };
    if (!import_fs.default.existsSync(filePath)) return { ok: true };
    const stat = import_fs.default.statSync(filePath);
    if (stat.isDirectory()) {
      import_fs.default.rmSync(filePath, { recursive: true, force: true });
    } else {
      import_fs.default.unlinkSync(filePath);
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});
import_electron.ipcMain.handle("move-file", async (_, filePath, destFolder) => {
  try {
    const name = import_path.default.basename(filePath);
    let destPath = import_path.default.join(destFolder, name);
    let counter = 1;
    while (import_fs.default.existsSync(destPath)) {
      const ext = import_path.default.extname(name);
      const base = import_path.default.basename(name, ext);
      destPath = import_path.default.join(destFolder, `${base} (${counter})${ext}`);
      counter++;
    }
    import_fs.default.renameSync(filePath, destPath);
    return { ok: true, newPath: destPath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});
import_electron.ipcMain.handle("copy-file", async (_, filePath, destFolder) => {
  try {
    const name = import_path.default.basename(filePath);
    let destPath = import_path.default.join(destFolder, name);
    let counter = 1;
    while (import_fs.default.existsSync(destPath)) {
      const ext = import_path.default.extname(name);
      const base = import_path.default.basename(name, ext);
      destPath = import_path.default.join(destFolder, `${base} (${counter})${ext}`);
      counter++;
    }
    import_fs.default.copyFileSync(filePath, destPath);
    return { ok: true, newPath: destPath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});
import_electron.ipcMain.handle("create-folder", async (_, parentPath, folderName) => {
  try {
    const newPath = import_path.default.join(parentPath, folderName);
    if (import_fs.default.existsSync(newPath)) return { ok: false, error: "Pasta j\xE1 existe." };
    import_fs.default.mkdirSync(newPath);
    return { ok: true, newPath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});
import_electron.ipcMain.handle("ensure-folder", async (_, dirPath) => {
  try {
    import_fs.default.mkdirSync(dirPath, { recursive: true });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});
import_electron.ipcMain.handle("move-or-copy-file", async (_, opts) => {
  const { srcPath, destFolder, fileName, mode } = opts;
  try {
    if (!import_fs.default.existsSync(srcPath)) return { ok: false, error: "Arquivo de origem n\xE3o encontrado." };
    import_fs.default.mkdirSync(destFolder, { recursive: true });
    const name = fileName || import_path.default.basename(srcPath);
    let destPath = import_path.default.join(destFolder, name);
    let counter = 1;
    while (import_fs.default.existsSync(destPath)) {
      if (import_path.default.resolve(srcPath) === import_path.default.resolve(destPath)) {
        return { ok: true, newPath: destPath };
      }
      const ext = import_path.default.extname(name);
      const base = import_path.default.basename(name, ext);
      destPath = import_path.default.join(destFolder, `${base} (${counter})${ext}`);
      counter++;
    }
    if (mode === "copy") {
      import_fs.default.copyFileSync(srcPath, destPath);
    } else {
      try {
        import_fs.default.renameSync(srcPath, destPath);
      } catch (renameErr) {
        if (renameErr.code === "EXDEV") {
          import_fs.default.copyFileSync(srcPath, destPath);
          import_fs.default.unlinkSync(srcPath);
        } else {
          throw renameErr;
        }
      }
    }
    return { ok: true, newPath: destPath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});
import_electron.ipcMain.handle("get-local-url", async (_, filePath) => {
  try {
    if (!import_fs.default.existsSync(filePath)) return null;
    const ext = import_path.default.extname(filePath).toLowerCase();
    const mimeMap = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".bmp": "image/bmp",
      ".tiff": "image/tiff",
      ".mp4": "video/mp4",
      ".mov": "video/quicktime",
      ".avi": "video/x-msvideo",
      ".mkv": "video/x-matroska",
      ".webm": "video/webm",
      ".wmv": "video/x-ms-wmv",
      ".mp3": "audio/mpeg",
      ".wav": "audio/wav",
      ".flac": "audio/flac",
      ".aiff": "audio/aiff",
      ".ogg": "audio/ogg",
      ".m4a": "audio/mp4",
      ".aac": "audio/aac",
      ".wma": "audio/x-ms-wma"
    };
    const mime = mimeMap[ext];
    if (!mime) return null;
    if (mime.startsWith("video/") || mime.startsWith("audio/")) {
      const normalized = filePath.replace(/\\/g, "/");
      const withLeadingSlash = normalized.startsWith("/") ? normalized : "/" + normalized;
      return `file://${withLeadingSlash}`;
    }
    const stat = await import_fs.default.promises.stat(filePath);
    if (stat.size > 10 * 1024 * 1024) return null;
    const buffer = await import_fs.default.promises.readFile(filePath);
    return `data:${mime};base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
});
import_electron.ipcMain.handle("get-audio-metadata", async (_, filePath) => {
  try {
    if (!filePath || !import_fs.default.existsSync(filePath)) return { duration: null, size: 0 };
    const stat = await import_fs.default.promises.stat(filePath);
    const size = stat.size;
    let duration = null;
    try {
      const mm = await Promise.resolve().then(() => (init_lib5(), lib_exports3));
      const metadata = await mm.parseFile(filePath, { duration: true, skipCovers: true });
      duration = metadata.format.duration || null;
    } catch {
    }
    return { duration, size };
  } catch (e) {
    return { duration: null, size: 0 };
  }
});
import_electron.ipcMain.handle("read-audio-file", async (_, filePath) => {
  try {
    if (!filePath || !import_fs.default.existsSync(filePath)) return null;
    const buffer = await import_fs.default.promises.readFile(filePath);
    return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
  } catch (e) {
    return null;
  }
});
import_electron.ipcMain.on("window-minimize", () => import_electron.BrowserWindow.getFocusedWindow()?.minimize());
import_electron.ipcMain.on("window-maximize", () => {
  const win = import_electron.BrowserWindow.getFocusedWindow();
  if (win?.isMaximized()) win.unmaximize();
  else win?.maximize();
});
import_electron.ipcMain.on("window-close", () => import_electron.BrowserWindow.getFocusedWindow()?.close());
import_electron.ipcMain.handle("store-read", (_, fileName) => {
  const result = readDataFile(fileName);
  return result;
});
import_electron.ipcMain.handle("store-write", (_, fileName, data) => writeDataFile(fileName, data));
import_electron.ipcMain.handle("set-app-root", (_, path2) => {
  const ok = writeDataFile("app-root.txt", path2);
  return ok;
});
import_electron.ipcMain.handle("get-user-data-path", () => import_electron.app.getPath("userData"));
import_electron.ipcMain.handle("get-recommended-app-path", () => {
  return import_path.default.join(import_electron.app.getPath("userData"), "Arqchives");
});
function collectAllFilePaths(data) {
  const files = [];
  if (data.albums) {
    Object.values(data.albums).forEach((projectAlbums) => {
      if (Array.isArray(projectAlbums)) {
        projectAlbums.forEach((album) => {
          if (album.coverPath) files.push(album.coverPath);
          if (album.files) album.files.forEach((f) => files.push(f));
          if (album.tracks) {
            album.tracks.forEach((track) => {
              if (track.files) track.files.forEach((f) => files.push(f));
              if (track.audioVersions) {
                track.audioVersions.forEach((v) => v.path && files.push(v.path));
              }
            });
          }
        });
      }
    });
  }
  return Array.from(new Set(files.filter((f) => f && import_fs.default.existsSync(f))));
}
import_electron.ipcMain.handle("backup-export", async (_, opts = {}) => {
  const tempDir = import_fs.default.mkdtempSync(import_path.default.join(import_electron.app.getPath("temp"), "arqchives-backup-"));
  try {
    const {
      includeConfig = true,
      includeProjects = true,
      includeAlbums = true,
      includeFiles = true
    } = opts;
    const backup = {
      version: 2,
      exportedAt: Date.now(),
      appName: "Arqchives",
      hasFiles: includeFiles
    };
    const storeData = readDataFile("arqchives-store");
    let storeState = {};
    if (storeData) {
      try {
        storeState = JSON.parse(storeData);
      } catch (e) {
      }
    }
    const state = storeState.state || storeState;
    if (includeConfig) {
      backup.appRoot = state.appRoot || readDataFile("app-root.txt");
      backup.projectConfig = state.projectConfig || JSON.parse(readDataFile("project-config.json") || "{}");
    }
    if (includeProjects) {
      backup.projects = state.projects || [];
    }
    if (includeAlbums) {
      backup.albums = state.albums || {};
    }
    if (backup.appRoot) import_fs.default.writeFileSync(import_path.default.join(tempDir, "app-root.txt"), backup.appRoot, "utf-8");
    if (backup.projectConfig) import_fs.default.writeFileSync(import_path.default.join(tempDir, "project-config.json"), JSON.stringify(backup.projectConfig, null, 2), "utf-8");
    if (backup.projects) import_fs.default.writeFileSync(import_path.default.join(tempDir, "projects.json"), JSON.stringify(backup.projects, null, 2), "utf-8");
    if (backup.albums) import_fs.default.writeFileSync(import_path.default.join(tempDir, "albums.json"), JSON.stringify(backup.albums, null, 2), "utf-8");
    import_fs.default.writeFileSync(import_path.default.join(tempDir, "metadata.json"), JSON.stringify(backup, null, 2), "utf-8");
    const defaultPath = import_path.default.join(import_electron.app.getPath("downloads"), `Arqchives-Backup-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.zip`);
    const result = await import_electron.dialog.showSaveDialog({
      title: "Exportar Backup Completo (com arquivos)",
      defaultPath,
      filters: [{ name: "ZIP Backup", extensions: ["zip"] }]
    });
    if (result.canceled) {
      import_fs.default.rmSync(tempDir, { recursive: true, force: true });
      return { ok: false, canceled: true };
    }
    let copiedFiles = 0;
    if (includeFiles) {
      const filePaths = collectAllFilePaths(backup);
      const filesDir = import_path.default.join(tempDir, "files");
      import_fs.default.mkdirSync(filesDir, { recursive: true });
      for (const srcPath of filePaths) {
        try {
          let relPath = srcPath;
          if (backup.appRoot && srcPath.startsWith(backup.appRoot)) {
            relPath = import_path.default.relative(backup.appRoot, srcPath);
          } else {
            const hash = require("crypto").createHash("md5").update(srcPath).digest("hex").slice(0, 8);
            const ext = import_path.default.extname(srcPath);
            relPath = `external/${hash}${ext}`;
          }
          const destPath = import_path.default.join(filesDir, relPath);
          import_fs.default.mkdirSync(import_path.default.dirname(destPath), { recursive: true });
          import_fs.default.copyFileSync(srcPath, destPath);
          copiedFiles++;
        } catch (e) {
        }
      }
      backup.fileCount = copiedFiles;
      import_fs.default.writeFileSync(import_path.default.join(tempDir, "metadata.json"), JSON.stringify(backup, null, 2), "utf-8");
    }
    const Archiver = await (async () => {
      const mod = await import("archiver");
      return mod.Archiver || mod.default?.Archiver || mod.default;
    })();
    if (!Archiver) {
      throw new Error("Archiver class not found in archiver module");
    }
    await new Promise((resolve, reject) => {
      const output = import_fs.default.createWriteStream(result.filePath);
      const archive = new Archiver("zip", { zlib: { level: 6 } });
      archive.on("error", (err) => {
        reject(err);
      });
      output.on("close", () => {
        resolve();
      });
      output.on("error", (err) => {
        reject(err);
      });
      archive.pipe(output);
      archive.directory(tempDir, false);
      archive.finalize();
    });
    import_fs.default.rmSync(tempDir, { recursive: true, force: true });
    return { ok: true, path: result.filePath, fileCount: copiedFiles };
  } catch (e) {
    import_fs.default.rmSync(tempDir, { recursive: true, force: true });
    return { ok: false, error: e.message || String(e) };
  }
});
import_electron.ipcMain.handle("backup-import", async (_, zipPath) => {
  const tempDir = import_fs.default.mkdtempSync(import_path.default.join(import_electron.app.getPath("temp"), "arqchives-restore-"));
  try {
    if (!zipPath || !import_fs.default.existsSync(zipPath)) {
      return { ok: false, error: "Arquivo ZIP n\xE3o encontrado." };
    }
    await new Promise((resolve, reject) => {
      const AdmZip = require_adm_zip();
      try {
        const zip = new AdmZip(zipPath);
        zip.extractAllTo(tempDir, true);
        resolve();
      } catch (e) {
        reject(e);
      }
    });
    const metadataPath = import_path.default.join(tempDir, "metadata.json");
    if (!import_fs.default.existsSync(metadataPath)) {
      import_fs.default.rmSync(tempDir, { recursive: true, force: true });
      return { ok: false, error: "Backup inv\xE1lido: metadata.json n\xE3o encontrado." };
    }
    const backup = JSON.parse(import_fs.default.readFileSync(metadataPath, "utf-8"));
    if (!backup || backup.appName !== "Arqchives") {
      import_fs.default.rmSync(tempDir, { recursive: true, force: true });
      return { ok: false, error: "Arquivo de backup inv\xE1lido." };
    }
    if (backup.appRoot) writeDataFile("app-root.txt", backup.appRoot);
    if (backup.projectConfig) writeDataFile("project-config.json", JSON.stringify(backup.projectConfig));
    if (backup.projects) writeDataFile("projects.json", JSON.stringify(backup.projects));
    if (backup.albums) writeDataFile("albums.json", JSON.stringify(backup.albums));
    const existingStore = readDataFile("arqchives-store");
    let existingState = {};
    if (existingStore) {
      try {
        existingState = JSON.parse(existingStore);
      } catch {
      }
    }
    const restoredStore = {
      state: {
        ...existingState.state || existingState,
        ...backup.appRoot && { appRoot: backup.appRoot },
        ...backup.projectConfig && { projectConfig: backup.projectConfig },
        ...backup.projects && { projects: backup.projects },
        ...backup.albums && { albums: backup.albums }
      },
      version: existingState.version || 2
    };
    writeDataFile("arqchives-store", JSON.stringify(restoredStore));
    let restoredFiles = 0;
    if (backup.hasFiles) {
      const filesDir = import_path.default.join(tempDir, "files");
      if (import_fs.default.existsSync(filesDir)) {
        const walkAndCopy = async (dir, baseDir) => {
          const entries = await import_fs.default.promises.readdir(dir, { withFileTypes: true });
          for (const entry of entries) {
            const fullPath = import_path.default.join(dir, entry.name);
            if (entry.isDirectory()) {
              await walkAndCopy(fullPath, baseDir);
            } else {
              const relPath = import_path.default.relative(baseDir, fullPath);
              let destPath;
              if (backup.appRoot && !relPath.startsWith("external/")) {
                destPath = import_path.default.join(backup.appRoot, relPath);
              } else if (relPath.startsWith("external/")) {
                destPath = import_path.default.join(backup.appRoot || import_electron.app.getPath("userData"), "Arqchives", "restored", relPath);
              } else {
                destPath = import_path.default.join(backup.appRoot || import_electron.app.getPath("userData"), "Arqchives", "restored", relPath);
              }
              try {
                import_fs.default.mkdirSync(import_path.default.dirname(destPath), { recursive: true });
                import_fs.default.copyFileSync(fullPath, destPath);
                restoredFiles++;
              } catch (e) {
              }
            }
          }
        };
        await walkAndCopy(filesDir, filesDir);
      }
    }
    import_fs.default.rmSync(tempDir, { recursive: true, force: true });
    return { ok: true, fileCount: restoredFiles };
  } catch (e) {
    import_fs.default.rmSync(tempDir, { recursive: true, force: true });
    return { ok: false, error: e.message };
  }
});
import_electron.ipcMain.handle("config-export", async () => {
  try {
    const config = readDataFile("project-config.json");
    if (!config) return { ok: false, error: "Nenhuma configura\xE7\xE3o encontrada." };
    const backup = {
      version: 2,
      exportedAt: Date.now(),
      appName: "Arqchives",
      type: "config-only",
      projectConfig: JSON.parse(config)
    };
    const defaultPath = import_path.default.join(import_electron.app.getPath("downloads"), `Arqchives-Config-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`);
    const result = await import_electron.dialog.showSaveDialog({
      title: "Exportar Configura\xE7\xF5es",
      defaultPath,
      filters: [{ name: "JSON Config", extensions: ["json"] }]
    });
    if (result.canceled) return { ok: false, canceled: true };
    import_fs.default.writeFileSync(result.filePath, JSON.stringify(backup, null, 2), "utf-8");
    return { ok: true, path: result.filePath };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});
import_electron.ipcMain.handle("config-import", async (_, config) => {
  try {
    if (!config || !config.projectConfig) {
      return { ok: false, error: "Arquivo de configura\xE7\xE3o inv\xE1lido." };
    }
    writeDataFile("project-config.json", JSON.stringify(config.projectConfig));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e.message };
  }
});
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

content-type/dist/index.js:
  (*!
   * content-type
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
