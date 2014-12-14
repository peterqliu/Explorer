! function(t) {
    if ("object" == typeof exports && "undefined" != typeof module) module.exports = t();
    else if ("function" == typeof define && define.amd) define([], t);
    else {
        var e;
        "undefined" != typeof window ? e = window : "undefined" != typeof global ? e = global : "undefined" != typeof self && (e = self), e.terminator = t()
    }
}(function() {
    var t;
    return function e(t, n, r) {
        function a(i, o) {
            if (!n[i]) {
                if (!t[i]) {
                    var u = "function" == typeof require && require;
                    if (!o && u) return u(i, !0);
                    if (s) return s(i, !0);
                    throw new Error("Cannot find module '" + i + "'")
                }
                var c = n[i] = {
                    exports: {}
                };
                t[i][0].call(c.exports, function(e) {
                    var n = t[i][1][e];
                    return a(n ? n : e)
                }, c, c.exports, e, t, n, r)
            }
            return n[i].exports
        }
        for (var s = "function" == typeof require && require, i = 0; i < r.length; i++) a(r[i]);
        return a
    }({
        1: [function(t, e) {
            function n(t) {
                return [t[0] + 180, -t[1]]
            }

            function r(t) {
                var e = (t - Date.UTC(2e3, 0, 1, 12)) / 864e5 / 36525,
                    n = (m.utc(t).startOf("day").toDate() - t) / 864e5 * 360 - 180;
                return [n - a(e) * g, s(e) * g]
            }

            function a(t) {
                var e = l(t),
                    n = u(t),
                    r = c(t),
                    a = Math.tan(h(t) / 2);
                return a *= a, a * Math.sin(2 * r) - 2 * e * Math.sin(n) + 4 * e * a * Math.sin(n) * Math.cos(2 * r) - .5 * a * a * Math.sin(4 * r) - 1.25 * e * e * Math.sin(2 * n)
            }

            function s(t) {
                return Math.asin(Math.sin(h(t)) * Math.sin(i(t)))
            }

            function i(t) {
                return o(t) - (.00569 + .00478 * Math.sin((125.04 - 1934.136 * t) * p)) * p
            }

            function o(t) {
                return c(t) + f(t)
            }

            function u(t) {
                return (357.52911 + t * (35999.05029 - 1537e-7 * t)) * p
            }

            function c(t) {
                var e = (280.46646 + t * (36000.76983 + 3032e-7 * t)) % 360;
                return (0 > e ? e + 360 : e) / 180 * y
            }

            function f(t) {
                var e = u(t);
                return (Math.sin(e) * (1.914602 - t * (.004817 + 14e-6 * t)) + Math.sin(e + e) * (.019993 - 101e-6 * t) + 289e-6 * Math.sin(e + e + e)) * p
            }

            function h(t) {
                return d(t) + .00256 * Math.cos((125.04 - 1934.136 * t) * p) * p
            }

            function d(t) {
                return (23 + (26 + (21.448 - t * (46.815 + t * (59e-5 - .001813 * t))) / 60) / 60) * p
            }

            function l(t) {
                return .016708634 - t * (42037e-9 + 1.267e-7 * t)
            }
            var _ = t("leaflet-geodesy"),
                m = t("moment"),
                y = Math.PI,
                p = y / 180,
                g = 180 / y;
            e.exports = function(t) {
                var e = _.circle([0, 0], y * Math.pow(6378137, 2) / 2, {
                    parts: 100
                });
                return e.setDate = function(t) {
                    return e.setLatLng(L.latLng(n(r(t).reverse())).wrap()), e
                }, e.setDate(t || new Date)
            }
        }, {
            "leaflet-geodesy": 2,
            moment: 7
        }],
        2: [function(t, e) {
            var n = t("spherical"),
                r = t("geojson-area");
            e.exports.circle = function(t, e, r) {
                function a(t) {
                    for (var r = [], a = 0; s + 1 > a; a++) r.push(n.radial([t.lng, t.lat], a / s * 360, e).reverse());
                    return r
                }
                t = L.latLng(t), r = r || {};
                var s = r.parts || 20,
                    i = L.polygon(a(t), r);
                return i.setLatLng = function(e) {
                    return t = e, i.setLatLngs(a(t)), i
                }, i.getRadius = function() {
                    return e
                }, i.setRadius = function(n) {
                    return e = n, i.setLatLngs(a(t)), i
                }, i
            }, e.exports.area = function(t) {
                var e = t.toGeoJSON();
                return r(e.geometry)
            }
        }, {
            "geojson-area": 3,
            spherical: 5
        }],
        3: [function(t, e) {
            function n(t) {
                var e = 0;
                if (t && t.length > 0) {
                    e += Math.abs(r(t[0]));
                    for (var n = 1; n < t.length; n++) e -= Math.abs(r(t[n]))
                }
                return e
            }

            function r(t) {
                var e = 0;
                if (t.length > 2) {
                    for (var n, r, i = 0; i < t.length - 1; i++) n = t[i], r = t[i + 1], e += a(r[0] - n[0]) * (2 + Math.sin(a(n[1])) + Math.sin(a(r[1])));
                    e = e * s.RADIUS * s.RADIUS / 2
                }
                return e
            }

            function a(t) {
                return t * Math.PI / 180
            }
            var s = t("wgs84");
            e.exports = function(t) {
                if ("Polygon" === t.type) return n(t.coordinates);
                if ("MultiPolygon" === t.type) {
                    for (var e = 0, r = 0; r < t.coordinates.length; r++) e += n(t.coordinates[r]);
                    return e
                }
                return null
            }
        }, {
            wgs84: 4
        }],
        4: [function(t, e) {
            e.exports.RADIUS = 6378137, e.exports.FLATTENING = 1 / 298.257223563, e.exports.POLAR_RADIUS = 6356752.3142
        }, {}],
        5: [function(t, e) {
            function n(t) {
                return t * (Math.PI / 180)
            }

            function r(t) {
                return t * (180 / Math.PI)
            }
            var a = t("wgs84");
            e.exports.heading = function(t, e) {
                var n = Math.sin(Math.PI * (t[0] - e[0]) / 180) * Math.cos(Math.PI * e[1] / 180),
                    r = Math.cos(Math.PI * t[1] / 180) * Math.sin(Math.PI * e[1] / 180) - Math.sin(Math.PI * t[1] / 180) * Math.cos(Math.PI * e[1] / 180) * Math.cos(Math.PI * (t[0] - e[0]) / 180);
                return 180 * Math.atan2(n, r) / Math.PI
            }, e.exports.distance = function(t, e) {
                var n = Math.sin(Math.PI * (e[0] - t[0]) / 360),
                    r = Math.sin(Math.PI * (e[1] - t[1]) / 360),
                    s = r * r + n * n * Math.cos(Math.PI * t[1] / 180) * Math.cos(Math.PI * e[1] / 180);
                return 2 * a.RADIUS * Math.atan2(Math.sqrt(s), Math.sqrt(1 - s))
            }, e.exports.radial = function(t, e, s, i) {
                var o, u = n(e),
                    c = s / a.RADIUS,
                    f = n(t[0]),
                    h = n(t[1]),
                    d = Math.asin(Math.sin(h) * Math.cos(c) + Math.cos(h) * Math.sin(c) * Math.cos(u)),
                    l = Math.atan2(Math.sin(u) * Math.sin(c) * Math.cos(h), Math.cos(c) - Math.sin(h) * Math.sin(d));
                return o = i ? (f - l + Math.PI) % (2 * Math.PI) - Math.PI : f - l + Math.PI - Math.PI, [r(o), r(d)]
            }
        }, {
            wgs84: 6
        }],
        6: [function(t, e) {
            e.exports = t(4)
        }, {}],
        7: [function(e, n) {
            (function(r) {
                (function(a) {
                    function s(t, e, n) {
                        switch (arguments.length) {
                            case 2:
                                return null != t ? t : e;
                            case 3:
                                return null != t ? t : null != e ? e : n;
                            default:
                                throw new Error("Implement me")
                        }
                    }

                    function i() {
                        return {
                            empty: !1,
                            unusedTokens: [],
                            unusedInput: [],
                            overflow: -2,
                            charsLeftOver: 0,
                            nullInput: !1,
                            invalidMonth: null,
                            invalidFormat: !1,
                            userInvalidated: !1,
                            iso: !1
                        }
                    }

                    function o(t, e) {
                        function n() {
                            ye.suppressDeprecationWarnings === !1 && "undefined" != typeof console && console.warn && console.warn("Deprecation warning: " + t)
                        }
                        var r = !0;
                        return l(function() {
                            return r && (n(), r = !1), e.apply(this, arguments)
                        }, e)
                    }

                    function u(t, e) {
                        return function(n) {
                            return y(t.call(this, n), e)
                        }
                    }

                    function c(t, e) {
                        return function(n) {
                            return this.lang().ordinal(t.call(this, n), e)
                        }
                    }

                    function f() {}

                    function h(t) {
                        P(t), l(this, t)
                    }

                    function d(t) {
                        var e = D(t),
                            n = e.year || 0,
                            r = e.quarter || 0,
                            a = e.month || 0,
                            s = e.week || 0,
                            i = e.day || 0,
                            o = e.hour || 0,
                            u = e.minute || 0,
                            c = e.second || 0,
                            f = e.millisecond || 0;
                        this._milliseconds = +f + 1e3 * c + 6e4 * u + 36e5 * o, this._days = +i + 7 * s, this._months = +a + 3 * r + 12 * n, this._data = {}, this._bubble()
                    }

                    function l(t, e) {
                        for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
                        return e.hasOwnProperty("toString") && (t.toString = e.toString), e.hasOwnProperty("valueOf") && (t.valueOf = e.valueOf), t
                    }

                    function _(t) {
                        var e, n = {};
                        for (e in t) t.hasOwnProperty(e) && Ie.hasOwnProperty(e) && (n[e] = t[e]);
                        return n
                    }

                    function m(t) {
                        return 0 > t ? Math.ceil(t) : Math.floor(t)
                    }

                    function y(t, e, n) {
                        for (var r = "" + Math.abs(t), a = t >= 0; r.length < e;) r = "0" + r;
                        return (a ? n ? "+" : "" : "-") + r
                    }

                    function p(t, e, n, r) {
                        var a = e._milliseconds,
                            s = e._days,
                            i = e._months;
                        r = null == r ? !0 : r, a && t._d.setTime(+t._d + a * n), s && he(t, "Date", fe(t, "Date") + s * n), i && ce(t, fe(t, "Month") + i * n), r && ye.updateOffset(t, s || i)
                    }

                    function g(t) {
                        return "[object Array]" === Object.prototype.toString.call(t)
                    }

                    function M(t) {
                        return "[object Date]" === Object.prototype.toString.call(t) || t instanceof Date
                    }

                    function w(t, e, n) {
                        var r, a = Math.min(t.length, e.length),
                            s = Math.abs(t.length - e.length),
                            i = 0;
                        for (r = 0; a > r; r++)(n && t[r] !== e[r] || !n && k(t[r]) !== k(e[r])) && i++;
                        return i + s
                    }

                    function Y(t) {
                        if (t) {
                            var e = t.toLowerCase().replace(/(.)s$/, "$1");
                            t = sn[t] || on[e] || e
                        }
                        return t
                    }

                    function D(t) {
                        var e, n, r = {};
                        for (n in t) t.hasOwnProperty(n) && (e = Y(n), e && (r[e] = t[n]));
                        return r
                    }

                    function v(t) {
                        var e, n;
                        if (0 === t.indexOf("week")) e = 7, n = "day";
                        else {
                            if (0 !== t.indexOf("month")) return;
                            e = 12, n = "month"
                        }
                        ye[t] = function(r, s) {
                            var i, o, u = ye.fn._lang[t],
                                c = [];
                            if ("number" == typeof r && (s = r, r = a), o = function(t) {
                                    var e = ye().utc().set(n, t);
                                    return u.call(ye.fn._lang, e, r || "")
                                }, null != s) return o(s);
                            for (i = 0; e > i; i++) c.push(o(i));
                            return c
                        }
                    }

                    function k(t) {
                        var e = +t,
                            n = 0;
                        return 0 !== e && isFinite(e) && (n = e >= 0 ? Math.floor(e) : Math.ceil(e)), n
                    }

                    function b(t, e) {
                        return new Date(Date.UTC(t, e + 1, 0)).getUTCDate()
                    }

                    function S(t, e, n) {
                        return se(ye([t, 11, 31 + e - n]), e, n).week
                    }

                    function T(t) {
                        return O(t) ? 366 : 365
                    }

                    function O(t) {
                        return t % 4 === 0 && t % 100 !== 0 || t % 400 === 0
                    }

                    function P(t) {
                        var e;
                        t._a && -2 === t._pf.overflow && (e = t._a[ve] < 0 || t._a[ve] > 11 ? ve : t._a[ke] < 1 || t._a[ke] > b(t._a[De], t._a[ve]) ? ke : t._a[be] < 0 || t._a[be] > 23 ? be : t._a[Se] < 0 || t._a[Se] > 59 ? Se : t._a[Te] < 0 || t._a[Te] > 59 ? Te : t._a[Oe] < 0 || t._a[Oe] > 999 ? Oe : -1, t._pf._overflowDayOfYear && (De > e || e > ke) && (e = ke), t._pf.overflow = e)
                    }

                    function I(t) {
                        return null == t._isValid && (t._isValid = !isNaN(t._d.getTime()) && t._pf.overflow < 0 && !t._pf.empty && !t._pf.invalidMonth && !t._pf.nullInput && !t._pf.invalidFormat && !t._pf.userInvalidated, t._strict && (t._isValid = t._isValid && 0 === t._pf.charsLeftOver && 0 === t._pf.unusedTokens.length)), t._isValid
                    }

                    function G(t) {
                        return t ? t.toLowerCase().replace("_", "-") : t
                    }

                    function W(t, e) {
                        return e._isUTC ? ye(t).zone(e._offset || 0) : ye(t).local()
                    }

                    function F(t, e) {
                        return e.abbr = t, Pe[t] || (Pe[t] = new f), Pe[t].set(e), Pe[t]
                    }

                    function L(t) {
                        delete Pe[t]
                    }

                    function U(t) {
                        var n, r, a, s, i = 0,
                            o = function(t) {
                                if (!Pe[t] && Ge) try {
                                    e("./lang/" + t)
                                } catch (n) {}
                                return Pe[t]
                            };
                        if (!t) return ye.fn._lang;
                        if (!g(t)) {
                            if (r = o(t)) return r;
                            t = [t]
                        }
                        for (; i < t.length;) {
                            for (s = G(t[i]).split("-"), n = s.length, a = G(t[i + 1]), a = a ? a.split("-") : null; n > 0;) {
                                if (r = o(s.slice(0, n).join("-"))) return r;
                                if (a && a.length >= n && w(s, a, !0) >= n - 1) break;
                                n--
                            }
                            i++
                        }
                        return ye.fn._lang
                    }

                    function C(t) {
                        return t.match(/\[[\s\S]/) ? t.replace(/^\[|\]$/g, "") : t.replace(/\\/g, "")
                    }

                    function x(t) {
                        var e, n, r = t.match(Ue);
                        for (e = 0, n = r.length; n > e; e++) r[e] = dn[r[e]] ? dn[r[e]] : C(r[e]);
                        return function(a) {
                            var s = "";
                            for (e = 0; n > e; e++) s += r[e] instanceof Function ? r[e].call(a, t) : r[e];
                            return s
                        }
                    }

                    function z(t, e) {
                        return t.isValid() ? (e = A(e, t.lang()), un[e] || (un[e] = x(e)), un[e](t)) : t.lang().invalidDate()
                    }

                    function A(t, e) {
                        function n(t) {
                            return e.longDateFormat(t) || t
                        }
                        var r = 5;
                        for (Ce.lastIndex = 0; r >= 0 && Ce.test(t);) t = t.replace(Ce, n), Ce.lastIndex = 0, r -= 1;
                        return t
                    }

                    function H(t, e) {
                        var n, r = e._strict;
                        switch (t) {
                            case "Q":
                                return Ve;
                            case "DDDD":
                                return $e;
                            case "YYYY":
                            case "GGGG":
                            case "gggg":
                                return r ? Qe : Ae;
                            case "Y":
                            case "G":
                            case "g":
                                return Be;
                            case "YYYYYY":
                            case "YYYYY":
                            case "GGGGG":
                            case "ggggg":
                                return r ? Xe : He;
                            case "S":
                                if (r) return Ve;
                            case "SS":
                                if (r) return Je;
                            case "SSS":
                                if (r) return $e;
                            case "DDD":
                                return ze;
                            case "MMM":
                            case "MMMM":
                            case "dd":
                            case "ddd":
                            case "dddd":
                                return Ze;
                            case "a":
                            case "A":
                                return U(e._l)._meridiemParse;
                            case "X":
                                return qe;
                            case "Z":
                            case "ZZ":
                                return Ee;
                            case "T":
                                return je;
                            case "SSSS":
                                return Ne;
                            case "MM":
                            case "DD":
                            case "YY":
                            case "GG":
                            case "gg":
                            case "HH":
                            case "hh":
                            case "mm":
                            case "ss":
                            case "ww":
                            case "WW":
                                return r ? Je : xe;
                            case "M":
                            case "D":
                            case "d":
                            case "H":
                            case "h":
                            case "m":
                            case "s":
                            case "w":
                            case "W":
                            case "e":
                            case "E":
                                return xe;
                            case "Do":
                                return Re;
                            default:
                                return n = new RegExp($(J(t.replace("\\", "")), "i"))
                        }
                    }

                    function N(t) {
                        t = t || "";
                        var e = t.match(Ee) || [],
                            n = e[e.length - 1] || [],
                            r = (n + "").match(rn) || ["-", 0, 0],
                            a = +(60 * r[1]) + k(r[2]);
                        return "+" === r[0] ? -a : a
                    }

                    function Z(t, e, n) {
                        var r, a = n._a;
                        switch (t) {
                            case "Q":
                                null != e && (a[ve] = 3 * (k(e) - 1));
                                break;
                            case "M":
                            case "MM":
                                null != e && (a[ve] = k(e) - 1);
                                break;
                            case "MMM":
                            case "MMMM":
                                r = U(n._l).monthsParse(e), null != r ? a[ve] = r : n._pf.invalidMonth = e;
                                break;
                            case "D":
                            case "DD":
                                null != e && (a[ke] = k(e));
                                break;
                            case "Do":
                                null != e && (a[ke] = k(parseInt(e, 10)));
                                break;
                            case "DDD":
                            case "DDDD":
                                null != e && (n._dayOfYear = k(e));
                                break;
                            case "YY":
                                a[De] = ye.parseTwoDigitYear(e);
                                break;
                            case "YYYY":
                            case "YYYYY":
                            case "YYYYYY":
                                a[De] = k(e);
                                break;
                            case "a":
                            case "A":
                                n._isPm = U(n._l).isPM(e);
                                break;
                            case "H":
                            case "HH":
                            case "h":
                            case "hh":
                                a[be] = k(e);
                                break;
                            case "m":
                            case "mm":
                                a[Se] = k(e);
                                break;
                            case "s":
                            case "ss":
                                a[Te] = k(e);
                                break;
                            case "S":
                            case "SS":
                            case "SSS":
                            case "SSSS":
                                a[Oe] = k(1e3 * ("0." + e));
                                break;
                            case "X":
                                n._d = new Date(1e3 * parseFloat(e));
                                break;
                            case "Z":
                            case "ZZ":
                                n._useUTC = !0, n._tzm = N(e);
                                break;
                            case "dd":
                            case "ddd":
                            case "dddd":
                                r = U(n._l).weekdaysParse(e), null != r ? (n._w = n._w || {}, n._w.d = r) : n._pf.invalidWeekday = e;
                                break;
                            case "w":
                            case "ww":
                            case "W":
                            case "WW":
                            case "d":
                            case "e":
                            case "E":
                                t = t.substr(0, 1);
                            case "gggg":
                            case "GGGG":
                            case "GGGGG":
                                t = t.substr(0, 2), e && (n._w = n._w || {}, n._w[t] = k(e));
                                break;
                            case "gg":
                            case "GG":
                                n._w = n._w || {}, n._w[t] = ye.parseTwoDigitYear(e)
                        }
                    }

                    function E(t) {
                        var e, n, r, a, i, o, u, c;
                        e = t._w, null != e.GG || null != e.W || null != e.E ? (i = 1, o = 4, n = s(e.GG, t._a[De], se(ye(), 1, 4).year), r = s(e.W, 1), a = s(e.E, 1)) : (c = U(t._l), i = c._week.dow, o = c._week.doy, n = s(e.gg, t._a[De], se(ye(), i, o).year), r = s(e.w, 1), null != e.d ? (a = e.d, i > a && ++r) : a = null != e.e ? e.e + i : i), u = ie(n, r, a, o, i), t._a[De] = u.year, t._dayOfYear = u.dayOfYear
                    }

                    function j(t) {
                        var e, n, r, a, i = [];
                        if (!t._d) {
                            for (r = R(t), t._w && null == t._a[ke] && null == t._a[ve] && E(t), t._dayOfYear && (a = s(t._a[De], r[De]), t._dayOfYear > T(a) && (t._pf._overflowDayOfYear = !0), n = ee(a, 0, t._dayOfYear), t._a[ve] = n.getUTCMonth(), t._a[ke] = n.getUTCDate()), e = 0; 3 > e && null == t._a[e]; ++e) t._a[e] = i[e] = r[e];
                            for (; 7 > e; e++) t._a[e] = i[e] = null == t._a[e] ? 2 === e ? 1 : 0 : t._a[e];
                            t._d = (t._useUTC ? ee : te).apply(null, i), null != t._tzm && t._d.setUTCMinutes(t._d.getUTCMinutes() + t._tzm)
                        }
                    }

                    function q(t) {
                        var e;
                        t._d || (e = D(t._i), t._a = [e.year, e.month, e.day, e.hour, e.minute, e.second, e.millisecond], j(t))
                    }

                    function R(t) {
                        var e = new Date;
                        return t._useUTC ? [e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate()] : [e.getFullYear(), e.getMonth(), e.getDate()]
                    }

                    function V(t) {
                        if (t._f === ye.ISO_8601) return void X(t);
                        t._a = [], t._pf.empty = !0;
                        var e, n, r, a, s, i = U(t._l),
                            o = "" + t._i,
                            u = o.length,
                            c = 0;
                        for (r = A(t._f, i).match(Ue) || [], e = 0; e < r.length; e++) a = r[e], n = (o.match(H(a, t)) || [])[0], n && (s = o.substr(0, o.indexOf(n)), s.length > 0 && t._pf.unusedInput.push(s), o = o.slice(o.indexOf(n) + n.length), c += n.length), dn[a] ? (n ? t._pf.empty = !1 : t._pf.unusedTokens.push(a), Z(a, n, t)) : t._strict && !n && t._pf.unusedTokens.push(a);
                        t._pf.charsLeftOver = u - c, o.length > 0 && t._pf.unusedInput.push(o), t._isPm && t._a[be] < 12 && (t._a[be] += 12), t._isPm === !1 && 12 === t._a[be] && (t._a[be] = 0), j(t), P(t)
                    }

                    function J(t) {
                        return t.replace(/\\(\[)|\\(\])|\[([^\]\[]*)\]|\\(.)/g, function(t, e, n, r, a) {
                            return e || n || r || a
                        })
                    }

                    function $(t) {
                        return t.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&")
                    }

                    function Q(t) {
                        var e, n, r, a, s;
                        if (0 === t._f.length) return t._pf.invalidFormat = !0, void(t._d = new Date(0 / 0));
                        for (a = 0; a < t._f.length; a++) s = 0, e = l({}, t), e._pf = i(), e._f = t._f[a], V(e), I(e) && (s += e._pf.charsLeftOver, s += 10 * e._pf.unusedTokens.length, e._pf.score = s, (null == r || r > s) && (r = s, n = e));
                        l(t, n || e)
                    }

                    function X(t) {
                        var e, n, r = t._i,
                            a = Ke.exec(r);
                        if (a) {
                            for (t._pf.iso = !0, e = 0, n = en.length; n > e; e++)
                                if (en[e][1].exec(r)) {
                                    t._f = en[e][0] + (a[6] || " ");
                                    break
                                }
                            for (e = 0, n = nn.length; n > e; e++)
                                if (nn[e][1].exec(r)) {
                                    t._f += nn[e][0];
                                    break
                                }
                            r.match(Ee) && (t._f += "Z"), V(t)
                        } else t._isValid = !1
                    }

                    function B(t) {
                        X(t), t._isValid === !1 && (delete t._isValid, ye.createFromInputFallback(t))
                    }

                    function K(t) {
                        var e = t._i,
                            n = We.exec(e);
                        e === a ? t._d = new Date : n ? t._d = new Date(+n[1]) : "string" == typeof e ? B(t) : g(e) ? (t._a = e.slice(0), j(t)) : M(e) ? t._d = new Date(+e) : "object" == typeof e ? q(t) : "number" == typeof e ? t._d = new Date(e) : ye.createFromInputFallback(t)
                    }

                    function te(t, e, n, r, a, s, i) {
                        var o = new Date(t, e, n, r, a, s, i);
                        return 1970 > t && o.setFullYear(t), o
                    }

                    function ee(t) {
                        var e = new Date(Date.UTC.apply(null, arguments));
                        return 1970 > t && e.setUTCFullYear(t), e
                    }

                    function ne(t, e) {
                        if ("string" == typeof t)
                            if (isNaN(t)) {
                                if (t = e.weekdaysParse(t), "number" != typeof t) return null
                            } else t = parseInt(t, 10);
                        return t
                    }

                    function re(t, e, n, r, a) {
                        return a.relativeTime(e || 1, !!n, t, r)
                    }

                    function ae(t, e, n) {
                        var r = Ye(Math.abs(t) / 1e3),
                            a = Ye(r / 60),
                            s = Ye(a / 60),
                            i = Ye(s / 24),
                            o = Ye(i / 365),
                            u = r < cn.s && ["s", r] || 1 === a && ["m"] || a < cn.m && ["mm", a] || 1 === s && ["h"] || s < cn.h && ["hh", s] || 1 === i && ["d"] || i <= cn.dd && ["dd", i] || i <= cn.dm && ["M"] || i < cn.dy && ["MM", Ye(i / 30)] || 1 === o && ["y"] || ["yy", o];
                        return u[2] = e, u[3] = t > 0, u[4] = n, re.apply({}, u)
                    }

                    function se(t, e, n) {
                        var r, a = n - e,
                            s = n - t.day();
                        return s > a && (s -= 7), a - 7 > s && (s += 7), r = ye(t).add("d", s), {
                            week: Math.ceil(r.dayOfYear() / 7),
                            year: r.year()
                        }
                    }

                    function ie(t, e, n, r, a) {
                        var s, i, o = ee(t, 0, 1).getUTCDay();
                        return o = 0 === o ? 7 : o, n = null != n ? n : a, s = a - o + (o > r ? 7 : 0) - (a > o ? 7 : 0), i = 7 * (e - 1) + (n - a) + s + 1, {
                            year: i > 0 ? t : t - 1,
                            dayOfYear: i > 0 ? i : T(t - 1) + i
                        }
                    }

                    function oe(t) {
                        var e = t._i,
                            n = t._f;
                        return null === e || n === a && "" === e ? ye.invalid({
                            nullInput: !0
                        }) : ("string" == typeof e && (t._i = e = U().preparse(e)), ye.isMoment(e) ? (t = _(e), t._d = new Date(+e._d)) : n ? g(n) ? Q(t) : V(t) : K(t), new h(t))
                    }

                    function ue(t, e) {
                        var n, r;
                        if (1 === e.length && g(e[0]) && (e = e[0]), !e.length) return ye();
                        for (n = e[0], r = 1; r < e.length; ++r) e[r][t](n) && (n = e[r]);
                        return n
                    }

                    function ce(t, e) {
                        var n;
                        return "string" == typeof e && (e = t.lang().monthsParse(e), "number" != typeof e) ? t : (n = Math.min(t.date(), b(t.year(), e)), t._d["set" + (t._isUTC ? "UTC" : "") + "Month"](e, n), t)
                    }

                    function fe(t, e) {
                        return t._d["get" + (t._isUTC ? "UTC" : "") + e]()
                    }

                    function he(t, e, n) {
                        return "Month" === e ? ce(t, n) : t._d["set" + (t._isUTC ? "UTC" : "") + e](n)
                    }

                    function de(t, e) {
                        return function(n) {
                            return null != n ? (he(this, t, n), ye.updateOffset(this, e), this) : fe(this, t)
                        }
                    }

                    function le(t) {
                        ye.duration.fn[t] = function() {
                            return this._data[t]
                        }
                    }

                    function _e(t, e) {
                        ye.duration.fn["as" + t] = function() {
                            return +this / e
                        }
                    }

                    function me(t) {
                        "undefined" == typeof ender && (pe = we.moment, we.moment = t ? o("Accessing Moment through the global scope is deprecated, and will be removed in an upcoming release.", ye) : ye)
                    }
                    for (var ye, pe, ge, Me = "2.7.0", we = "undefined" != typeof r ? r : this, Ye = Math.round, De = 0, ve = 1, ke = 2, be = 3, Se = 4, Te = 5, Oe = 6, Pe = {}, Ie = {
                            _isAMomentObject: null,
                            _i: null,
                            _f: null,
                            _l: null,
                            _strict: null,
                            _tzm: null,
                            _isUTC: null,
                            _offset: null,
                            _pf: null,
                            _lang: null
                        }, Ge = "undefined" != typeof n && n.exports, We = /^\/?Date\((\-?\d+)/i, Fe = /(\-)?(?:(\d*)\.)?(\d+)\:(\d+)(?:\:(\d+)\.?(\d{3})?)?/, Le = /^(-)?P(?:(?:([0-9,.]*)Y)?(?:([0-9,.]*)M)?(?:([0-9,.]*)D)?(?:T(?:([0-9,.]*)H)?(?:([0-9,.]*)M)?(?:([0-9,.]*)S)?)?|([0-9,.]*)W)$/, Ue = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|Q|YYYYYY|YYYYY|YYYY|YY|gg(ggg?)?|GG(GGG?)?|e|E|a|A|hh?|HH?|mm?|ss?|S{1,4}|X|zz?|ZZ?|.)/g, Ce = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g, xe = /\d\d?/, ze = /\d{1,3}/, Ae = /\d{1,4}/, He = /[+\-]?\d{1,6}/, Ne = /\d+/, Ze = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i, Ee = /Z|[\+\-]\d\d:?\d\d/gi, je = /T/i, qe = /[\+\-]?\d+(\.\d{1,3})?/, Re = /\d{1,2}/, Ve = /\d/, Je = /\d\d/, $e = /\d{3}/, Qe = /\d{4}/, Xe = /[+-]?\d{6}/, Be = /[+-]?\d+/, Ke = /^\s*(?:[+-]\d{6}|\d{4})-(?:(\d\d-\d\d)|(W\d\d$)|(W\d\d-\d)|(\d\d\d))((T| )(\d\d(:\d\d(:\d\d(\.\d+)?)?)?)?([\+\-]\d\d(?::?\d\d)?|\s*Z)?)?$/, tn = "YYYY-MM-DDTHH:mm:ssZ", en = [
                            ["YYYYYY-MM-DD", /[+-]\d{6}-\d{2}-\d{2}/],
                            ["YYYY-MM-DD", /\d{4}-\d{2}-\d{2}/],
                            ["GGGG-[W]WW-E", /\d{4}-W\d{2}-\d/],
                            ["GGGG-[W]WW", /\d{4}-W\d{2}/],
                            ["YYYY-DDD", /\d{4}-\d{3}/]
                        ], nn = [
                            ["HH:mm:ss.SSSS", /(T| )\d\d:\d\d:\d\d\.\d+/],
                            ["HH:mm:ss", /(T| )\d\d:\d\d:\d\d/],
                            ["HH:mm", /(T| )\d\d:\d\d/],
                            ["HH", /(T| )\d\d/]
                        ], rn = /([\+\-]|\d\d)/gi, an = ("Date|Hours|Minutes|Seconds|Milliseconds".split("|"), {
                            Milliseconds: 1,
                            Seconds: 1e3,
                            Minutes: 6e4,
                            Hours: 36e5,
                            Days: 864e5,
                            Months: 2592e6,
                            Years: 31536e6
                        }), sn = {
                            ms: "millisecond",
                            s: "second",
                            m: "minute",
                            h: "hour",
                            d: "day",
                            D: "date",
                            w: "week",
                            W: "isoWeek",
                            M: "month",
                            Q: "quarter",
                            y: "year",
                            DDD: "dayOfYear",
                            e: "weekday",
                            E: "isoWeekday",
                            gg: "weekYear",
                            GG: "isoWeekYear"
                        }, on = {
                            dayofyear: "dayOfYear",
                            isoweekday: "isoWeekday",
                            isoweek: "isoWeek",
                            weekyear: "weekYear",
                            isoweekyear: "isoWeekYear"
                        }, un = {}, cn = {
                            s: 45,
                            m: 45,
                            h: 22,
                            dd: 25,
                            dm: 45,
                            dy: 345
                        }, fn = "DDD w W M D d".split(" "), hn = "M D H h m s w W".split(" "), dn = {
                            M: function() {
                                return this.month() + 1
                            },
                            MMM: function(t) {
                                return this.lang().monthsShort(this, t)
                            },
                            MMMM: function(t) {
                                return this.lang().months(this, t)
                            },
                            D: function() {
                                return this.date()
                            },
                            DDD: function() {
                                return this.dayOfYear()
                            },
                            d: function() {
                                return this.day()
                            },
                            dd: function(t) {
                                return this.lang().weekdaysMin(this, t)
                            },
                            ddd: function(t) {
                                return this.lang().weekdaysShort(this, t)
                            },
                            dddd: function(t) {
                                return this.lang().weekdays(this, t)
                            },
                            w: function() {
                                return this.week()
                            },
                            W: function() {
                                return this.isoWeek()
                            },
                            YY: function() {
                                return y(this.year() % 100, 2)
                            },
                            YYYY: function() {
                                return y(this.year(), 4)
                            },
                            YYYYY: function() {
                                return y(this.year(), 5)
                            },
                            YYYYYY: function() {
                                var t = this.year(),
                                    e = t >= 0 ? "+" : "-";
                                return e + y(Math.abs(t), 6)
                            },
                            gg: function() {
                                return y(this.weekYear() % 100, 2)
                            },
                            gggg: function() {
                                return y(this.weekYear(), 4)
                            },
                            ggggg: function() {
                                return y(this.weekYear(), 5)
                            },
                            GG: function() {
                                return y(this.isoWeekYear() % 100, 2)
                            },
                            GGGG: function() {
                                return y(this.isoWeekYear(), 4)
                            },
                            GGGGG: function() {
                                return y(this.isoWeekYear(), 5)
                            },
                            e: function() {
                                return this.weekday()
                            },
                            E: function() {
                                return this.isoWeekday()
                            },
                            a: function() {
                                return this.lang().meridiem(this.hours(), this.minutes(), !0)
                            },
                            A: function() {
                                return this.lang().meridiem(this.hours(), this.minutes(), !1)
                            },
                            H: function() {
                                return this.hours()
                            },
                            h: function() {
                                return this.hours() % 12 || 12
                            },
                            m: function() {
                                return this.minutes()
                            },
                            s: function() {
                                return this.seconds()
                            },
                            S: function() {
                                return k(this.milliseconds() / 100)
                            },
                            SS: function() {
                                return y(k(this.milliseconds() / 10), 2)
                            },
                            SSS: function() {
                                return y(this.milliseconds(), 3)
                            },
                            SSSS: function() {
                                return y(this.milliseconds(), 3)
                            },
                            Z: function() {
                                var t = -this.zone(),
                                    e = "+";
                                return 0 > t && (t = -t, e = "-"), e + y(k(t / 60), 2) + ":" + y(k(t) % 60, 2)
                            },
                            ZZ: function() {
                                var t = -this.zone(),
                                    e = "+";
                                return 0 > t && (t = -t, e = "-"), e + y(k(t / 60), 2) + y(k(t) % 60, 2)
                            },
                            z: function() {
                                return this.zoneAbbr()
                            },
                            zz: function() {
                                return this.zoneName()
                            },
                            X: function() {
                                return this.unix()
                            },
                            Q: function() {
                                return this.quarter()
                            }
                        }, ln = ["months", "monthsShort", "weekdays", "weekdaysShort", "weekdaysMin"]; fn.length;) ge = fn.pop(), dn[ge + "o"] = c(dn[ge], ge);
                    for (; hn.length;) ge = hn.pop(), dn[ge + ge] = u(dn[ge], 2);
                    for (dn.DDDD = u(dn.DDD, 3), l(f.prototype, {
                            set: function(t) {
                                var e, n;
                                for (n in t) e = t[n], "function" == typeof e ? this[n] = e : this["_" + n] = e
                            },
                            _months: "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
                            months: function(t) {
                                return this._months[t.month()]
                            },
                            _monthsShort: "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
                            monthsShort: function(t) {
                                return this._monthsShort[t.month()]
                            },
                            monthsParse: function(t) {
                                var e, n, r;
                                for (this._monthsParse || (this._monthsParse = []), e = 0; 12 > e; e++)
                                    if (this._monthsParse[e] || (n = ye.utc([2e3, e]), r = "^" + this.months(n, "") + "|^" + this.monthsShort(n, ""), this._monthsParse[e] = new RegExp(r.replace(".", ""), "i")), this._monthsParse[e].test(t)) return e
                            },
                            _weekdays: "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
                            weekdays: function(t) {
                                return this._weekdays[t.day()]
                            },
                            _weekdaysShort: "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
                            weekdaysShort: function(t) {
                                return this._weekdaysShort[t.day()]
                            },
                            _weekdaysMin: "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
                            weekdaysMin: function(t) {
                                return this._weekdaysMin[t.day()]
                            },
                            weekdaysParse: function(t) {
                                var e, n, r;
                                for (this._weekdaysParse || (this._weekdaysParse = []), e = 0; 7 > e; e++)
                                    if (this._weekdaysParse[e] || (n = ye([2e3, 1]).day(e), r = "^" + this.weekdays(n, "") + "|^" + this.weekdaysShort(n, "") + "|^" + this.weekdaysMin(n, ""), this._weekdaysParse[e] = new RegExp(r.replace(".", ""), "i")), this._weekdaysParse[e].test(t)) return e
                            },
                            _longDateFormat: {
                                LT: "h:mm A",
                                L: "MM/DD/YYYY",
                                LL: "MMMM D YYYY",
                                LLL: "MMMM D YYYY LT",
                                LLLL: "dddd, MMMM D YYYY LT"
                            },
                            longDateFormat: function(t) {
                                var e = this._longDateFormat[t];
                                return !e && this._longDateFormat[t.toUpperCase()] && (e = this._longDateFormat[t.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function(t) {
                                    return t.slice(1)
                                }), this._longDateFormat[t] = e), e
                            },
                            isPM: function(t) {
                                return "p" === (t + "").toLowerCase().charAt(0)
                            },
                            _meridiemParse: /[ap]\.?m?\.?/i,
                            meridiem: function(t, e, n) {
                                return t > 11 ? n ? "pm" : "PM" : n ? "am" : "AM"
                            },
                            _calendar: {
                                sameDay: "[Today at] LT",
                                nextDay: "[Tomorrow at] LT",
                                nextWeek: "dddd [at] LT",
                                lastDay: "[Yesterday at] LT",
                                lastWeek: "[Last] dddd [at] LT",
                                sameElse: "L"
                            },
                            calendar: function(t, e) {
                                var n = this._calendar[t];
                                return "function" == typeof n ? n.apply(e) : n
                            },
                            _relativeTime: {
                                future: "in %s",
                                past: "%s ago",
                                s: "a few seconds",
                                m: "a minute",
                                mm: "%d minutes",
                                h: "an hour",
                                hh: "%d hours",
                                d: "a day",
                                dd: "%d days",
                                M: "a month",
                                MM: "%d months",
                                y: "a year",
                                yy: "%d years"
                            },
                            relativeTime: function(t, e, n, r) {
                                var a = this._relativeTime[n];
                                return "function" == typeof a ? a(t, e, n, r) : a.replace(/%d/i, t)
                            },
                            pastFuture: function(t, e) {
                                var n = this._relativeTime[t > 0 ? "future" : "past"];
                                return "function" == typeof n ? n(e) : n.replace(/%s/i, e)
                            },
                            ordinal: function(t) {
                                return this._ordinal.replace("%d", t)
                            },
                            _ordinal: "%d",
                            preparse: function(t) {
                                return t
                            },
                            postformat: function(t) {
                                return t
                            },
                            week: function(t) {
                                return se(t, this._week.dow, this._week.doy).week
                            },
                            _week: {
                                dow: 0,
                                doy: 6
                            },
                            _invalidDate: "Invalid date",
                            invalidDate: function() {
                                return this._invalidDate
                            }
                        }), ye = function(t, e, n, r) {
                            var s;
                            return "boolean" == typeof n && (r = n, n = a), s = {}, s._isAMomentObject = !0, s._i = t, s._f = e, s._l = n, s._strict = r, s._isUTC = !1, s._pf = i(), oe(s)
                        }, ye.suppressDeprecationWarnings = !1, ye.createFromInputFallback = o("moment construction falls back to js Date. This is discouraged and will be removed in upcoming major release. Please refer to https://github.com/moment/moment/issues/1407 for more info.", function(t) {
                            t._d = new Date(t._i)
                        }), ye.min = function() {
                            var t = [].slice.call(arguments, 0);
                            return ue("isBefore", t)
                        }, ye.max = function() {
                            var t = [].slice.call(arguments, 0);
                            return ue("isAfter", t)
                        }, ye.utc = function(t, e, n, r) {
                            var s;
                            return "boolean" == typeof n && (r = n, n = a), s = {}, s._isAMomentObject = !0, s._useUTC = !0, s._isUTC = !0, s._l = n, s._i = t, s._f = e, s._strict = r, s._pf = i(), oe(s).utc()
                        }, ye.unix = function(t) {
                            return ye(1e3 * t)
                        }, ye.duration = function(t, e) {
                            var n, r, a, s = t,
                                i = null;
                            return ye.isDuration(t) ? s = {
                                ms: t._milliseconds,
                                d: t._days,
                                M: t._months
                            } : "number" == typeof t ? (s = {}, e ? s[e] = t : s.milliseconds = t) : (i = Fe.exec(t)) ? (n = "-" === i[1] ? -1 : 1, s = {
                                y: 0,
                                d: k(i[ke]) * n,
                                h: k(i[be]) * n,
                                m: k(i[Se]) * n,
                                s: k(i[Te]) * n,
                                ms: k(i[Oe]) * n
                            }) : (i = Le.exec(t)) && (n = "-" === i[1] ? -1 : 1, a = function(t) {
                                var e = t && parseFloat(t.replace(",", "."));
                                return (isNaN(e) ? 0 : e) * n
                            }, s = {
                                y: a(i[2]),
                                M: a(i[3]),
                                d: a(i[4]),
                                h: a(i[5]),
                                m: a(i[6]),
                                s: a(i[7]),
                                w: a(i[8])
                            }), r = new d(s), ye.isDuration(t) && t.hasOwnProperty("_lang") && (r._lang = t._lang), r
                        }, ye.version = Me, ye.defaultFormat = tn, ye.ISO_8601 = function() {}, ye.momentProperties = Ie, ye.updateOffset = function() {}, ye.relativeTimeThreshold = function(t, e) {
                            return cn[t] === a ? !1 : (cn[t] = e, !0)
                        }, ye.lang = function(t, e) {
                            var n;
                            return t ? (e ? F(G(t), e) : null === e ? (L(t), t = "en") : Pe[t] || U(t), n = ye.duration.fn._lang = ye.fn._lang = U(t), n._abbr) : ye.fn._lang._abbr
                        }, ye.langData = function(t) {
                            return t && t._lang && t._lang._abbr && (t = t._lang._abbr), U(t)
                        }, ye.isMoment = function(t) {
                            return t instanceof h || null != t && t.hasOwnProperty("_isAMomentObject")
                        }, ye.isDuration = function(t) {
                            return t instanceof d
                        }, ge = ln.length - 1; ge >= 0; --ge) v(ln[ge]);
                    ye.normalizeUnits = function(t) {
                        return Y(t)
                    }, ye.invalid = function(t) {
                        var e = ye.utc(0 / 0);
                        return null != t ? l(e._pf, t) : e._pf.userInvalidated = !0, e
                    }, ye.parseZone = function() {
                        return ye.apply(null, arguments).parseZone()
                    }, ye.parseTwoDigitYear = function(t) {
                        return k(t) + (k(t) > 68 ? 1900 : 2e3)
                    }, l(ye.fn = h.prototype, {
                        clone: function() {
                            return ye(this)
                        },
                        valueOf: function() {
                            return +this._d + 6e4 * (this._offset || 0)
                        },
                        unix: function() {
                            return Math.floor(+this / 1e3)
                        },
                        toString: function() {
                            return this.clone().lang("en").format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ")
                        },
                        toDate: function() {
                            return this._offset ? new Date(+this) : this._d
                        },
                        toISOString: function() {
                            var t = ye(this).utc();
                            return 0 < t.year() && t.year() <= 9999 ? z(t, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]") : z(t, "YYYYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
                        },
                        toArray: function() {
                            var t = this;
                            return [t.year(), t.month(), t.date(), t.hours(), t.minutes(), t.seconds(), t.milliseconds()]
                        },
                        isValid: function() {
                            return I(this)
                        },
                        isDSTShifted: function() {
                            return this._a ? this.isValid() && w(this._a, (this._isUTC ? ye.utc(this._a) : ye(this._a)).toArray()) > 0 : !1
                        },
                        parsingFlags: function() {
                            return l({}, this._pf)
                        },
                        invalidAt: function() {
                            return this._pf.overflow
                        },
                        utc: function() {
                            return this.zone(0)
                        },
                        local: function() {
                            return this.zone(0), this._isUTC = !1, this
                        },
                        format: function(t) {
                            var e = z(this, t || ye.defaultFormat);
                            return this.lang().postformat(e)
                        },
                        add: function(t, e) {
                            var n;
                            return n = "string" == typeof t && "string" == typeof e ? ye.duration(isNaN(+e) ? +t : +e, isNaN(+e) ? e : t) : "string" == typeof t ? ye.duration(+e, t) : ye.duration(t, e), p(this, n, 1), this
                        },
                        subtract: function(t, e) {
                            var n;
                            return n = "string" == typeof t && "string" == typeof e ? ye.duration(isNaN(+e) ? +t : +e, isNaN(+e) ? e : t) : "string" == typeof t ? ye.duration(+e, t) : ye.duration(t, e), p(this, n, -1), this
                        },
                        diff: function(t, e, n) {
                            var r, a, s = W(t, this),
                                i = 6e4 * (this.zone() - s.zone());
                            return e = Y(e), "year" === e || "month" === e ? (r = 432e5 * (this.daysInMonth() + s.daysInMonth()), a = 12 * (this.year() - s.year()) + (this.month() - s.month()), a += (this - ye(this).startOf("month") - (s - ye(s).startOf("month"))) / r, a -= 6e4 * (this.zone() - ye(this).startOf("month").zone() - (s.zone() - ye(s).startOf("month").zone())) / r, "year" === e && (a /= 12)) : (r = this - s, a = "second" === e ? r / 1e3 : "minute" === e ? r / 6e4 : "hour" === e ? r / 36e5 : "day" === e ? (r - i) / 864e5 : "week" === e ? (r - i) / 6048e5 : r), n ? a : m(a)
                        },
                        from: function(t, e) {
                            return ye.duration(this.diff(t)).lang(this.lang()._abbr).humanize(!e)
                        },
                        fromNow: function(t) {
                            return this.from(ye(), t)
                        },
                        calendar: function(t) {
                            var e = t || ye(),
                                n = W(e, this).startOf("day"),
                                r = this.diff(n, "days", !0),
                                a = -6 > r ? "sameElse" : -1 > r ? "lastWeek" : 0 > r ? "lastDay" : 1 > r ? "sameDay" : 2 > r ? "nextDay" : 7 > r ? "nextWeek" : "sameElse";
                            return this.format(this.lang().calendar(a, this))
                        },
                        isLeapYear: function() {
                            return O(this.year())
                        },
                        isDST: function() {
                            return this.zone() < this.clone().month(0).zone() || this.zone() < this.clone().month(5).zone()
                        },
                        day: function(t) {
                            var e = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
                            return null != t ? (t = ne(t, this.lang()), this.add({
                                d: t - e
                            })) : e
                        },
                        month: de("Month", !0),
                        startOf: function(t) {
                            switch (t = Y(t)) {
                                case "year":
                                    this.month(0);
                                case "quarter":
                                case "month":
                                    this.date(1);
                                case "week":
                                case "isoWeek":
                                case "day":
                                    this.hours(0);
                                case "hour":
                                    this.minutes(0);
                                case "minute":
                                    this.seconds(0);
                                case "second":
                                    this.milliseconds(0)
                            }
                            return "week" === t ? this.weekday(0) : "isoWeek" === t && this.isoWeekday(1), "quarter" === t && this.month(3 * Math.floor(this.month() / 3)), this
                        },
                        endOf: function(t) {
                            return t = Y(t), this.startOf(t).add("isoWeek" === t ? "week" : t, 1).subtract("ms", 1)
                        },
                        isAfter: function(t, e) {
                            return e = "undefined" != typeof e ? e : "millisecond", +this.clone().startOf(e) > +ye(t).startOf(e)
                        },
                        isBefore: function(t, e) {
                            return e = "undefined" != typeof e ? e : "millisecond", +this.clone().startOf(e) < +ye(t).startOf(e)
                        },
                        isSame: function(t, e) {
                            return e = e || "ms", +this.clone().startOf(e) === +W(t, this).startOf(e)
                        },
                        min: o("moment().min is deprecated, use moment.min instead. https://github.com/moment/moment/issues/1548", function(t) {
                            return t = ye.apply(null, arguments), this > t ? this : t
                        }),
                        max: o("moment().max is deprecated, use moment.max instead. https://github.com/moment/moment/issues/1548", function(t) {
                            return t = ye.apply(null, arguments), t > this ? this : t
                        }),
                        zone: function(t, e) {
                            var n = this._offset || 0;
                            return null == t ? this._isUTC ? n : this._d.getTimezoneOffset() : ("string" == typeof t && (t = N(t)), Math.abs(t) < 16 && (t = 60 * t), this._offset = t, this._isUTC = !0, n !== t && (!e || this._changeInProgress ? p(this, ye.duration(n - t, "m"), 1, !1) : this._changeInProgress || (this._changeInProgress = !0, ye.updateOffset(this, !0), this._changeInProgress = null)), this)
                        },
                        zoneAbbr: function() {
                            return this._isUTC ? "UTC" : ""
                        },
                        zoneName: function() {
                            return this._isUTC ? "Coordinated Universal Time" : ""
                        },
                        parseZone: function() {
                            return this._tzm ? this.zone(this._tzm) : "string" == typeof this._i && this.zone(this._i), this
                        },
                        hasAlignedHourOffset: function(t) {
                            return t = t ? ye(t).zone() : 0, (this.zone() - t) % 60 === 0
                        },
                        daysInMonth: function() {
                            return b(this.year(), this.month())
                        },
                        dayOfYear: function(t) {
                            var e = Ye((ye(this).startOf("day") - ye(this).startOf("year")) / 864e5) + 1;
                            return null == t ? e : this.add("d", t - e)
                        },
                        quarter: function(t) {
                            return null == t ? Math.ceil((this.month() + 1) / 3) : this.month(3 * (t - 1) + this.month() % 3)
                        },
                        weekYear: function(t) {
                            var e = se(this, this.lang()._week.dow, this.lang()._week.doy).year;
                            return null == t ? e : this.add("y", t - e)
                        },
                        isoWeekYear: function(t) {
                            var e = se(this, 1, 4).year;
                            return null == t ? e : this.add("y", t - e)
                        },
                        week: function(t) {
                            var e = this.lang().week(this);
                            return null == t ? e : this.add("d", 7 * (t - e))
                        },
                        isoWeek: function(t) {
                            var e = se(this, 1, 4).week;
                            return null == t ? e : this.add("d", 7 * (t - e))
                        },
                        weekday: function(t) {
                            var e = (this.day() + 7 - this.lang()._week.dow) % 7;
                            return null == t ? e : this.add("d", t - e)
                        },
                        isoWeekday: function(t) {
                            return null == t ? this.day() || 7 : this.day(this.day() % 7 ? t : t - 7)
                        },
                        isoWeeksInYear: function() {
                            return S(this.year(), 1, 4)
                        },
                        weeksInYear: function() {
                            var t = this._lang._week;
                            return S(this.year(), t.dow, t.doy)
                        },
                        get: function(t) {
                            return t = Y(t), this[t]()
                        },
                        set: function(t, e) {
                            return t = Y(t), "function" == typeof this[t] && this[t](e), this
                        },
                        lang: function(t) {
                            return t === a ? this._lang : (this._lang = U(t), this)
                        }
                    }), ye.fn.millisecond = ye.fn.milliseconds = de("Milliseconds", !1), ye.fn.second = ye.fn.seconds = de("Seconds", !1), ye.fn.minute = ye.fn.minutes = de("Minutes", !1), ye.fn.hour = ye.fn.hours = de("Hours", !0), ye.fn.date = de("Date", !0), ye.fn.dates = o("dates accessor is deprecated. Use date instead.", de("Date", !0)), ye.fn.year = de("FullYear", !0), ye.fn.years = o("years accessor is deprecated. Use year instead.", de("FullYear", !0)), ye.fn.days = ye.fn.day, ye.fn.months = ye.fn.month, ye.fn.weeks = ye.fn.week, ye.fn.isoWeeks = ye.fn.isoWeek, ye.fn.quarters = ye.fn.quarter, ye.fn.toJSON = ye.fn.toISOString, l(ye.duration.fn = d.prototype, {
                        _bubble: function() {
                            var t, e, n, r, a = this._milliseconds,
                                s = this._days,
                                i = this._months,
                                o = this._data;
                            o.milliseconds = a % 1e3, t = m(a / 1e3), o.seconds = t % 60, e = m(t / 60), o.minutes = e % 60, n = m(e / 60), o.hours = n % 24, s += m(n / 24), o.days = s % 30, i += m(s / 30), o.months = i % 12, r = m(i / 12), o.years = r
                        },
                        weeks: function() {
                            return m(this.days() / 7)
                        },
                        valueOf: function() {
                            return this._milliseconds + 864e5 * this._days + this._months % 12 * 2592e6 + 31536e6 * k(this._months / 12)
                        },
                        humanize: function(t) {
                            var e = +this,
                                n = ae(e, !t, this.lang());
                            return t && (n = this.lang().pastFuture(e, n)), this.lang().postformat(n)
                        },
                        add: function(t, e) {
                            var n = ye.duration(t, e);
                            return this._milliseconds += n._milliseconds, this._days += n._days, this._months += n._months, this._bubble(), this
                        },
                        subtract: function(t, e) {
                            var n = ye.duration(t, e);
                            return this._milliseconds -= n._milliseconds, this._days -= n._days, this._months -= n._months, this._bubble(), this
                        },
                        get: function(t) {
                            return t = Y(t), this[t.toLowerCase() + "s"]()
                        },
                        as: function(t) {
                            return t = Y(t), this["as" + t.charAt(0).toUpperCase() + t.slice(1) + "s"]()
                        },
                        lang: ye.fn.lang,
                        toIsoString: function() {
                            var t = Math.abs(this.years()),
                                e = Math.abs(this.months()),
                                n = Math.abs(this.days()),
                                r = Math.abs(this.hours()),
                                a = Math.abs(this.minutes()),
                                s = Math.abs(this.seconds() + this.milliseconds() / 1e3);
                            return this.asSeconds() ? (this.asSeconds() < 0 ? "-" : "") + "P" + (t ? t + "Y" : "") + (e ? e + "M" : "") + (n ? n + "D" : "") + (r || a || s ? "T" : "") + (r ? r + "H" : "") + (a ? a + "M" : "") + (s ? s + "S" : "") : "P0D"
                        }
                    });
                    for (ge in an) an.hasOwnProperty(ge) && (_e(ge, an[ge]), le(ge.toLowerCase()));
                    _e("Weeks", 6048e5), ye.duration.fn.asMonths = function() {
                        return (+this - 31536e6 * this.years()) / 2592e6 + 12 * this.years()
                    }, ye.lang("en", {
                        ordinal: function(t) {
                            var e = t % 10,
                                n = 1 === k(t % 100 / 10) ? "th" : 1 === e ? "st" : 2 === e ? "nd" : 3 === e ? "rd" : "th";
                            return t + n
                        }
                    }), Ge ? n.exports = ye : "function" == typeof t && t.amd ? (t("moment", function(t, e, n) {
                        return n.config && n.config() && n.config().noGlobal === !0 && (we.moment = pe), ye
                    }), me(!0)) : me()
                }).call(this)
            }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}]
    }, {}, [1])(1)
});