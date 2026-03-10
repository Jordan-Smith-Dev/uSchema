var R = Object.defineProperty;
var U = (e, a, t) => a in e ? R(e, a, { enumerable: !0, configurable: !0, writable: !0, value: t }) : e[a] = t;
var g = (e, a, t) => U(e, typeof a != "symbol" ? a + "" : a, t);
import { UMB_AUTH_CONTEXT as T } from "@umbraco-cms/backoffice/auth";
var C = async (e, a) => {
  let t = typeof a == "function" ? await a(e) : a;
  if (t) return e.scheme === "bearer" ? `Bearer ${t}` : e.scheme === "basic" ? `Basic ${btoa(t)}` : t;
}, A = { bodySerializer: (e) => JSON.stringify(e, (a, t) => typeof t == "bigint" ? t.toString() : t) }, I = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, E = (e) => {
  switch (e) {
    case "form":
      return ",";
    case "pipeDelimited":
      return "|";
    case "spaceDelimited":
      return "%20";
    default:
      return ",";
  }
}, z = (e) => {
  switch (e) {
    case "label":
      return ".";
    case "matrix":
      return ";";
    case "simple":
      return ",";
    default:
      return "&";
  }
}, x = ({ allowReserved: e, explode: a, name: t, style: n, value: o }) => {
  if (!a) {
    let r = (e ? o : o.map((i) => encodeURIComponent(i))).join(E(n));
    switch (n) {
      case "label":
        return `.${r}`;
      case "matrix":
        return `;${t}=${r}`;
      case "simple":
        return r;
      default:
        return `${t}=${r}`;
    }
  }
  let l = I(n), s = o.map((r) => n === "label" || n === "simple" ? e ? r : encodeURIComponent(r) : b({ allowReserved: e, name: t, value: r })).join(l);
  return n === "label" || n === "matrix" ? l + s : s;
}, b = ({ allowReserved: e, name: a, value: t }) => {
  if (t == null) return "";
  if (typeof t == "object") throw new Error("Deeply-nested arrays/objects aren’t supported. Provide your own `querySerializer()` to handle these.");
  return `${a}=${e ? t : encodeURIComponent(t)}`;
}, $ = ({ allowReserved: e, explode: a, name: t, style: n, value: o }) => {
  if (o instanceof Date) return `${t}=${o.toISOString()}`;
  if (n !== "deepObject" && !a) {
    let r = [];
    Object.entries(o).forEach(([f, c]) => {
      r = [...r, f, e ? c : encodeURIComponent(c)];
    });
    let i = r.join(",");
    switch (n) {
      case "form":
        return `${t}=${i}`;
      case "label":
        return `.${i}`;
      case "matrix":
        return `;${t}=${i}`;
      default:
        return i;
    }
  }
  let l = z(n), s = Object.entries(o).map(([r, i]) => b({ allowReserved: e, name: n === "deepObject" ? `${t}[${r}]` : r, value: i })).join(l);
  return n === "label" || n === "matrix" ? l + s : s;
}, W = /\{[^{}]+\}/g, D = ({ path: e, url: a }) => {
  let t = a, n = a.match(W);
  if (n) for (let o of n) {
    let l = !1, s = o.substring(1, o.length - 1), r = "simple";
    s.endsWith("*") && (l = !0, s = s.substring(0, s.length - 1)), s.startsWith(".") ? (s = s.substring(1), r = "label") : s.startsWith(";") && (s = s.substring(1), r = "matrix");
    let i = e[s];
    if (i == null) continue;
    if (Array.isArray(i)) {
      t = t.replace(o, x({ explode: l, name: s, style: r, value: i }));
      continue;
    }
    if (typeof i == "object") {
      t = t.replace(o, $({ explode: l, name: s, style: r, value: i }));
      continue;
    }
    if (r === "matrix") {
      t = t.replace(o, `;${b({ name: s, value: i })}`);
      continue;
    }
    let f = encodeURIComponent(r === "label" ? `.${i}` : i);
    t = t.replace(o, f);
  }
  return t;
}, S = ({ allowReserved: e, array: a, object: t } = {}) => (n) => {
  let o = [];
  if (n && typeof n == "object") for (let l in n) {
    let s = n[l];
    if (s != null) if (Array.isArray(s)) {
      let r = x({ allowReserved: e, explode: !0, name: l, style: "form", value: s, ...a });
      r && o.push(r);
    } else if (typeof s == "object") {
      let r = $({ allowReserved: e, explode: !0, name: l, style: "deepObject", value: s, ...t });
      r && o.push(r);
    } else {
      let r = b({ allowReserved: e, name: l, value: s });
      r && o.push(r);
    }
  }
  return o.join("&");
}, N = (e) => {
  var t;
  if (!e) return "stream";
  let a = (t = e.split(";")[0]) == null ? void 0 : t.trim();
  if (a) {
    if (a.startsWith("application/json") || a.endsWith("+json")) return "json";
    if (a === "multipart/form-data") return "formData";
    if (["application/", "audio/", "image/", "video/"].some((n) => a.startsWith(n))) return "blob";
    if (a.startsWith("text/")) return "text";
  }
}, k = async ({ security: e, ...a }) => {
  for (let t of e) {
    let n = await C(t, a.auth);
    if (!n) continue;
    let o = t.name ?? "Authorization";
    switch (t.in) {
      case "query":
        a.query || (a.query = {}), a.query[o] = n;
        break;
      case "cookie":
        a.headers.append("Cookie", `${o}=${n}`);
        break;
      case "header":
      default:
        a.headers.set(o, n);
        break;
    }
    return;
  }
}, v = (e) => H({ baseUrl: e.baseUrl, path: e.path, query: e.query, querySerializer: typeof e.querySerializer == "function" ? e.querySerializer : S(e.querySerializer), url: e.url }), H = ({ baseUrl: e, path: a, query: t, querySerializer: n, url: o }) => {
  let l = o.startsWith("/") ? o : `/${o}`, s = (e ?? "") + l;
  a && (s = D({ path: a, url: s }));
  let r = t ? n(t) : "";
  return r.startsWith("?") && (r = r.substring(1)), r && (s += `?${r}`), s;
}, j = (e, a) => {
  var n;
  let t = { ...e, ...a };
  return (n = t.baseUrl) != null && n.endsWith("/") && (t.baseUrl = t.baseUrl.substring(0, t.baseUrl.length - 1)), t.headers = _(e.headers, a.headers), t;
}, _ = (...e) => {
  let a = new Headers();
  for (let t of e) {
    if (!t || typeof t != "object") continue;
    let n = t instanceof Headers ? t.entries() : Object.entries(t);
    for (let [o, l] of n) if (l === null) a.delete(o);
    else if (Array.isArray(l)) for (let s of l) a.append(o, s);
    else l !== void 0 && a.set(o, typeof l == "object" ? JSON.stringify(l) : l);
  }
  return a;
}, w = class {
  constructor() {
    g(this, "_fns");
    this._fns = [];
  }
  clear() {
    this._fns = [];
  }
  getInterceptorIndex(e) {
    return typeof e == "number" ? this._fns[e] ? e : -1 : this._fns.indexOf(e);
  }
  exists(e) {
    let a = this.getInterceptorIndex(e);
    return !!this._fns[a];
  }
  eject(e) {
    let a = this.getInterceptorIndex(e);
    this._fns[a] && (this._fns[a] = null);
  }
  update(e, a) {
    let t = this.getInterceptorIndex(e);
    return this._fns[t] ? (this._fns[t] = a, e) : !1;
  }
  use(e) {
    return this._fns = [...this._fns, e], this._fns.length - 1;
  }
}, P = () => ({ error: new w(), request: new w(), response: new w() }), B = S({ allowReserved: !1, array: { explode: !0, style: "form" }, object: { explode: !0, style: "deepObject" } }), J = { "Content-Type": "application/json" }, q = (e = {}) => ({ ...A, headers: J, parseAs: "auto", querySerializer: B, ...e }), G = (e = {}) => {
  let a = j(q(), e), t = () => ({ ...a }), n = (s) => (a = j(a, s), t()), o = P(), l = async (s) => {
    let r = { ...a, ...s, fetch: s.fetch ?? a.fetch ?? globalThis.fetch, headers: _(a.headers, s.headers) };
    r.security && await k({ ...r, security: r.security }), r.body && r.bodySerializer && (r.body = r.bodySerializer(r.body)), (r.body === void 0 || r.body === "") && r.headers.delete("Content-Type");
    let i = v(r), f = { redirect: "follow", ...r }, c = new Request(i, f);
    for (let d of o.request._fns) d && (c = await d(c, r));
    let O = r.fetch, u = await O(c);
    for (let d of o.response._fns) d && (u = await d(u, c, r));
    let y = { request: c, response: u };
    if (u.ok) {
      if (u.status === 204 || u.headers.get("Content-Length") === "0") return r.responseStyle === "data" ? {} : { data: {}, ...y };
      let d = (r.parseAs === "auto" ? N(u.headers.get("Content-Type")) : r.parseAs) ?? "json";
      if (d === "stream") return r.responseStyle === "data" ? u.body : { data: u.body, ...y };
      let h = await u[d]();
      return d === "json" && (r.responseValidator && await r.responseValidator(h), r.responseTransformer && (h = await r.responseTransformer(h))), r.responseStyle === "data" ? h : { data: h, ...y };
    }
    let m = await u.text();
    try {
      m = JSON.parse(m);
    } catch {
    }
    let p = m;
    for (let d of o.error._fns) d && (p = await d(m, u, c, r));
    if (p = p || {}, r.throwOnError) throw p;
    return r.responseStyle === "data" ? void 0 : { error: p, ...y };
  };
  return { buildUrl: v, connect: (s) => l({ ...s, method: "CONNECT" }), delete: (s) => l({ ...s, method: "DELETE" }), get: (s) => l({ ...s, method: "GET" }), getConfig: t, head: (s) => l({ ...s, method: "HEAD" }), interceptors: o, options: (s) => l({ ...s, method: "OPTIONS" }), patch: (s) => l({ ...s, method: "PATCH" }), post: (s) => l({ ...s, method: "POST" }), put: (s) => l({ ...s, method: "PUT" }), request: l, setConfig: n, trace: (s) => l({ ...s, method: "TRACE" }) };
};
const L = G(q({
  baseUrl: "https://localhost:44345"
})), Q = (e, a) => {
  console.log("Hello from my extension 🎉"), e.consumeContext(T, async (t) => {
    const n = t == null ? void 0 : t.getOpenApiConfiguration();
    L.setConfig({
      auth: (n == null ? void 0 : n.token) ?? void 0,
      baseUrl: (n == null ? void 0 : n.base) ?? "",
      credentials: (n == null ? void 0 : n.credentials) ?? "same-origin"
    });
  });
}, X = (e, a) => {
  console.log("Goodbye from my extension 👋");
};
export {
  Q as onInit,
  X as onUnload
};
//# sourceMappingURL=entrypoint-1dwyYRGg.js.map
