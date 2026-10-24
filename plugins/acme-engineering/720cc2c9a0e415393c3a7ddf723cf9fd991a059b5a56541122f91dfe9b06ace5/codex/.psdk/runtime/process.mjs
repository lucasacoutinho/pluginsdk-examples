/*!
@effect/platform-node
MIT License

Copyright (c) 2023 Effectful Technologies Inc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

@effect/platform-node-shared
MIT License

Copyright (c) 2023 Effectful Technologies Inc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

effect
MIT License

Copyright (c) 2023 Effectful Technologies Inc

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

jsonc-parser
The MIT License (MIT)

Copyright (c) Microsoft

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
import * as Crypto from "node:crypto";
import * as NFS from "node:fs";
import * as OS from "node:os";
import * as Path from "node:path";
import { isAbsolute, resolve } from "node:path";
import { spawn } from "node:child_process";
//#region node_modules/effect/dist/Pipeable.js
const pipeArguments = (self, args) => {
	switch (args.length) {
		case 0: return self;
		case 1: return args[0](self);
		case 2: return args[1](args[0](self));
		case 3: return args[2](args[1](args[0](self)));
		case 4: return args[3](args[2](args[1](args[0](self))));
		case 5: return args[4](args[3](args[2](args[1](args[0](self)))));
		case 6: return args[5](args[4](args[3](args[2](args[1](args[0](self))))));
		case 7: return args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))));
		case 8: return args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self))))))));
		case 9: return args[8](args[7](args[6](args[5](args[4](args[3](args[2](args[1](args[0](self)))))))));
		default: {
			let ret = self;
			for (let i = 0, len = args.length; i < len; i++) ret = args[i](ret);
			return ret;
		}
	}
};
const Prototype$1 = { pipe() {
	return pipeArguments(this, arguments);
} };
const Class$1 = function() {
	function PipeableBase() {}
	PipeableBase.prototype = Prototype$1;
	return PipeableBase;
}();
//#endregion
//#region node_modules/effect/dist/Function.js
const dual = function(arity, body) {
	if (typeof arity === "function") return function() {
		return arity(arguments) ? body.apply(this, arguments) : (self) => body(self, ...arguments);
	};
	switch (arity) {
		case 0:
		case 1: throw new RangeError(`Invalid arity ${arity}`);
		case 2: return function(a, b) {
			if (arguments.length >= 2) return body(a, b);
			return function(self) {
				return body(self, a);
			};
		};
		case 3: return function(a, b, c) {
			if (arguments.length >= 3) return body(a, b, c);
			return function(self) {
				return body(self, a, b);
			};
		};
		default: return function() {
			if (arguments.length >= arity) return body.apply(this, arguments);
			const args = arguments;
			return function(self) {
				return body(self, ...args);
			};
		};
	}
};
const identity = (a) => a;
const constant = (value) => () => value;
const constTrue = constant(true);
const constFalse = constant(false);
const constUndefined = constant(void 0);
const constVoid = constUndefined;
function pipe(a, ...args) {
	return pipeArguments(a, args);
}
function memoize(f) {
	const cache = new WeakMap();
	return (a) => {
		const cached = cache.get(a);
		if (cached !== void 0) return cached;
		const result = f(a);
		cache.set(a, result);
		return result;
	};
}
function memoizeIdempotent(f) {
	const cache = new WeakMap();
	return (a) => {
		const cached = cache.get(a);
		if (cached !== void 0) return cached;
		const result = f(a);
		cache.set(a, result);
		if (result !== a) cache.set(result, result);
		return result;
	};
}
//#endregion
//#region node_modules/effect/dist/Equivalence.js
const make$16 = (isEquivalent) => (self, that) => self === that || isEquivalent(self, that);
const isStrictEquivalent = (x, y) => x === y;
const strictEqual = () => isStrictEquivalent;
function Array_(item) {
	return make$16((self, that) => {
		if (self.length !== that.length) return false;
		for (let i = 0; i < self.length; i++) if (!item(self[i], that[i])) return false;
		return true;
	});
}
//#endregion
//#region node_modules/effect/dist/internal/equal.js
const getAllObjectKeys = (obj) => {
	const keys = new Set(Reflect.ownKeys(obj));
	if (obj.constructor === Object) return keys;
	if (obj instanceof Error) keys.delete("stack");
	const proto = Object.getPrototypeOf(obj);
	let current = proto;
	while (current !== null && current !== Object.prototype) {
		const ownKeys = Reflect.ownKeys(current);
		for (let i = 0; i < ownKeys.length; i++) keys.add(ownKeys[i]);
		current = Object.getPrototypeOf(current);
	}
	if (keys.has("constructor") && typeof obj.constructor === "function" && proto === obj.constructor.prototype) keys.delete("constructor");
	return keys;
};
const byReferenceInstances = new WeakSet();
const viewBytes = (view) => new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
//#endregion
//#region node_modules/effect/dist/internal/hash.js
let backEdges = 0;
const addBackEdge = () => {
	backEdges++;
};
//#endregion
//#region node_modules/effect/dist/Predicate.js
function isString$1(input) {
	return typeof input === "string";
}
function isNumber(input) {
	return typeof input === "number";
}
function isBoolean(input) {
	return typeof input === "boolean";
}
function isSymbol(input) {
	return typeof input === "symbol";
}
function isPropertyKey(u) {
	return isString$1(u) || isNumber(u) || isSymbol(u);
}
function isFunction(input) {
	return typeof input === "function";
}
function isNotNullish(input) {
	return input != null;
}
function isUnknown(_) {
	return true;
}
function isObject(input) {
	return typeof input === "object" && input !== null && !Array.isArray(input);
}
function isObjectKeyword(input) {
	return typeof input === "object" && input !== null || isFunction(input);
}
const hasProperty = dual(2, (self, property) => isObjectKeyword(self) && property in self);
const isTagged = dual(2, (self, tag) => hasProperty(self, "_tag") && self["_tag"] === tag);
function isError(input) {
	return input instanceof Error;
}
function isIterable(input) {
	return hasProperty(input, Symbol.iterator) || isString$1(input);
}
//#endregion
//#region node_modules/effect/dist/Hash.js
const symbol$1 = "~effect/Hash";
const hash = (self) => {
	switch (typeof self) {
		case "number": return number$1(self);
		case "bigint": return string$1(self.toString(10));
		case "string": return string$1(self);
		case "function":
		case "object": if (self === null) break;
		else if (self instanceof Date) {
			if (Number.isNaN(self.getTime())) return string$1("Invalid Date");
			return string$1(self.toISOString());
		} else if (self instanceof RegExp) return string$1(self.toString());
		else {
			if (byReferenceInstances.has(self)) return random$1(self);
			const cached = hashCache.get(self);
			if (cached !== void 0) return cached;
			if (visitedObjects.has(self)) {
				addBackEdge();
				return string$1("[Circular]");
			}
			visitedObjects.add(self);
			const seen = backEdges;
			let h;
			try {
				if ("~effect/Hash" in self) h = self[symbol$1]();
				else if (typeof self === "function") h = random$1(self);
				else if (self instanceof DataView) h = array(viewBytes(self));
				else if (Array.isArray(self) || ArrayBuffer.isView(self)) h = array(self);
				else if (self instanceof Map) h = hashMap(self);
				else if (self instanceof Set) h = hashSet(self);
				else h = structure(self);
			} finally {
				visitedObjects.delete(self);
			}
			if (seen === backEdges) hashCache.set(self, h);
			return h;
		}
	}
	return optimize(mix(string$1(String(self))));
};
const random$1 = (self) => {
	if (!randomHashCache.has(self)) randomHashCache.set(self, optimize(Math.random() * 4294967296 | 0));
	return randomHashCache.get(self);
};
const mix = (h) => {
	h ^= h >>> 16;
	h = Math.imul(h, 2246822507);
	h ^= h >>> 13;
	h = Math.imul(h, 3266489909);
	return h ^ h >>> 16;
};
const combine = dual(2, (self, b) => mix(Math.imul(self, 2654435761) + Math.imul(b, 2246822507)));
const optimize = (n) => n & 3221225471 | n >>> 1 & 1073741824;
const float64 = new DataView(new ArrayBuffer(8));
const number$1 = (n) => {
	const h = n | 0;
	if (h === n) return optimize(h);
	float64.setFloat64(0, n !== n ? NaN : n);
	return optimize(combine(float64.getInt32(0), float64.getInt32(4)));
};
const string$1 = (str) => {
	let h = 5381, i = str.length;
	while (i) h = h * 33 ^ str.charCodeAt(--i);
	return optimize(h);
};
const structureKeys = (o, keys) => {
	let h = 12289;
	for (const key of keys) h ^= combine(hash(key), hash(o[key]));
	return optimize(h);
};
const structure = (o) => structureKeys(o, getAllObjectKeys(o));
const unordered = (seed, f) => (iter) => {
	let h = seed;
	for (const element of iter) h ^= f(element);
	return optimize(h);
};
const array = (arr) => {
	let h = 6151;
	for (const element of arr) h = combine(h, hash(element));
	return optimize(h);
};
const hashMap = unordered(string$1("Map"), ([k, v]) => combine(hash(k), hash(v)));
const setSeed = string$1("Set");
const hashSet = unordered(setSeed, (element) => combine(setSeed, hash(element)));
const randomHashCache = new WeakMap();
const hashCache = new WeakMap();
const visitedObjects = new WeakSet();
//#endregion
//#region node_modules/effect/dist/Equal.js
const symbol = "~effect/Equal";
function equals$1() {
	if (arguments.length === 1) return (self) => compareBoth(self, arguments[0]);
	return compareBoth(arguments[0], arguments[1]);
}
function compareBoth(self, that) {
	if (self === that) return true;
	if (self == null || that == null) return false;
	const selfType = typeof self;
	if (selfType !== typeof that) return false;
	if (selfType === "number" && self !== self && that !== that) return true;
	if (selfType !== "object" && selfType !== "function") return false;
	if (byReferenceInstances.has(self) || byReferenceInstances.has(that)) return false;
	return compareObjects(self, that);
}
function compareObjects(self, that) {
	const depth = pathLeft.length;
	for (let i = depth; i-- > 0;) if (pathLeft[i] === self && pathRight[i] === that) return true;
	if (depth) return compareOnPath(self, that);
	let known = results.get(self);
	if (!known) results.set(self, known = new WeakMap());
	let result = known.get(that);
	if (result === void 0) known.set(that, result = compareOnPath(self, that));
	return result;
}
function compareOnPath(self, that) {
	pathLeft.push(self);
	pathRight.push(that);
	try {
		return compareStructure(self, that);
	} finally {
		pathLeft.pop();
		pathRight.pop();
	}
}
const pathLeft = [];
const pathRight = [];
const results = new WeakMap();
function compareStructure(self, that) {
	if (hash(self) !== hash(that)) return false;
	else if (self instanceof Date) {
		if (!(that instanceof Date)) return false;
		const selfTime = self.getTime();
		const thatTime = that.getTime();
		return selfTime === thatTime || Number.isNaN(selfTime) && Number.isNaN(thatTime);
	} else if (self instanceof RegExp) return that instanceof RegExp && self.toString() === that.toString();
	const bothEquals = isEqual(self);
	if (bothEquals !== isEqual(that) || typeof self === "function" && !bothEquals) return false;
	else if (bothEquals) return self[symbol](that);
	else if (Array.isArray(self)) {
		if (!Array.isArray(that) || self.length !== that.length) return false;
		return compareArrays(self, that);
	} else if (ArrayBuffer.isView(self)) {
		const selfIsDataView = self instanceof DataView;
		if (!ArrayBuffer.isView(that) || self.byteLength !== that.byteLength || selfIsDataView !== that instanceof DataView) return false;
		if (selfIsDataView) return compareTypedArrays(viewBytes(self), viewBytes(that));
		return compareTypedArrays(self, that);
	} else if (self instanceof Map) {
		if (!(that instanceof Map) || self.size !== that.size) return false;
		return compareHashed(self, that, entryHash, equalEntries);
	} else if (self instanceof Set) {
		if (!(that instanceof Set) || self.size !== that.size) return false;
		return compareHashed(self, that, hash, compareBoth);
	}
	return compareRecords(self, that);
}
function compareArrays(self, that) {
	for (let i = 0; i < self.length; i++) if (!compareBoth(self[i], that[i])) return false;
	return true;
}
function compareTypedArrays(self, that) {
	if (self.length !== that.length) return false;
	for (let i = 0; i < self.length; i++) if (self[i] !== that[i]) return false;
	return true;
}
function compareRecords(self, that) {
	const selfKeys = getAllObjectKeys(self);
	const thatKeys = getAllObjectKeys(that);
	if (selfKeys.size !== thatKeys.size) return false;
	for (const key of selfKeys) if (!thatKeys.has(key) || !compareBoth(self[key], that[key])) return false;
	return true;
}
function compareHashed(self, that, hashOf, equivalent) {
	const groups = new Map();
	let remaining = 0;
	for (const item of that) {
		const h = hashOf(item);
		const group = groups.get(h);
		if (group) group.push(item);
		else groups.set(h, [item]);
		remaining++;
	}
	outer: for (const item of self) {
		const group = groups.get(hashOf(item));
		if (group) {
			for (let i = 0; i < group.length; i++) if (equivalent(item, group[i])) {
				group[i] = group[group.length - 1];
				group.pop();
				remaining--;
				continue outer;
			}
		}
		return false;
	}
	return remaining === 0;
}
const entryHash = (entry) => hash(entry[0]);
const equalEntries = (self, that) => compareBoth(self[0], that[0]) && compareBoth(self[1], that[1]);
const sameGroup = () => 0;
function makeCompareMap(keyEquivalence, valueEquivalence) {
	return makeCompareSet((self, that) => keyEquivalence(self[0], that[0]) && valueEquivalence(self[1], that[1]));
}
function makeCompareSet(equivalence) {
	return function compareSets(self, that) {
		return compareHashed(self, that, sameGroup, equivalence);
	};
}
const isEqual = (u) => hasProperty(u, symbol);
//#endregion
//#region node_modules/effect/dist/Redactable.js
const symbolRedactable = Symbol.for("~effect/Redactable");
const isRedactable = (u) => hasProperty(u, symbolRedactable);
function redact$2(u) {
	if (isRedactable(u)) return getRedacted(u);
	return u;
}
function getRedacted(redactable) {
	return redactable[symbolRedactable](globalThis["~effect/Fiber/currentFiber"]?.context ?? emptyContext$1);
}
const currentFiberTypeId = "~effect/Fiber/currentFiber";
const emptyMap = new Map();
const emptyContext$1 = {
	"~effect/Context": {},
	base: emptyMap,
	depth: 0,
	mapUnsafe: emptyMap,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
//#endregion
//#region node_modules/effect/dist/Formatter.js
function format$1(input, options) {
	const space = options?.space ?? 0;
	const ancestors = new WeakSet();
	const gap = !space ? "" : typeof space === "number" ? " ".repeat(space) : space;
	const ind = (d) => gap.repeat(d);
	const wrap = (v, body) => {
		const ctor = v?.constructor;
		return ctor && ctor !== Object.prototype.constructor && ctor.name ? `${ctor.name}(${body})` : body;
	};
	const ownKeys = (o) => {
		try {
			return Reflect.ownKeys(o);
		} catch {
			return ["[ownKeys threw]"];
		}
	};
	function recur(v, d = 0) {
		try {
			return recurUnsafe(v, d);
		} catch {
			if (typeof v === "object" && v !== null || typeof v === "function") ancestors.delete(v);
			return "[inspection threw]";
		}
	}
	function recurUnsafe(v, d = 0) {
		if (typeof v === "string") return JSON.stringify(v);
		if (typeof v === "number" || v == null || typeof v === "boolean" || typeof v === "symbol") return String(v);
		if (typeof v === "bigint") return String(v) + "n";
		if (typeof v === "object" || typeof v === "function") {
			if (ancestors.has(v)) return CIRCULAR;
			ancestors.add(v);
			let output;
			if (symbolRedactable in v) output = recur(getRedacted(v), d);
			else if (Array.isArray(v)) output = !gap || v.length <= 1 ? `[${v.map((x) => recur(x, d)).join(",")}]` : `[\n${ind(d + 1)}${v.map((x) => recur(x, d + 1)).join(",\n" + ind(d + 1))}\n${ind(d)}]`;
			else if (v instanceof Date) output = formatDate(v);
			else if (!options?.ignoreToString && hasProperty(v, "toString") && typeof v["toString"] === "function" && v["toString"] !== Object.prototype.toString && v["toString"] !== Array.prototype.toString) {
				const s = safeToString(v);
				output = v instanceof Error && v.cause !== void 0 ? `${s} (cause: ${recur(v.cause, d)})` : s;
			} else if (Symbol.iterator in v) output = `${v.constructor.name}(${recur(Array.from(v), d)})`;
			else {
				const keys = ownKeys(v);
				if (!gap || keys.length <= 1) {
					const body = `{${keys.map((k) => `${formatPropertyKey(k)}:${recur(safeGet(v, k), d)}`).join(",")}}`;
					output = wrap(v, body);
				} else {
					const body = `{\n${keys.map((k) => `${ind(d + 1)}${formatPropertyKey(k)}: ${recur(safeGet(v, k), d + 1)}`).join(",\n")}\n${ind(d)}}`;
					output = wrap(v, body);
				}
			}
			ancestors.delete(v);
			return output;
		}
		return String(v);
	}
	return recur(input, 0);
}
const CIRCULAR = "[Circular]";
function formatPropertyKey(name) {
	return typeof name === "string" ? JSON.stringify(name) : String(name);
}
function formatPath(path) {
	return path.map((key) => `[${formatPropertyKey(key)}]`).join("");
}
function formatDate(date) {
	try {
		return date.toISOString();
	} catch {
		return "Invalid Date";
	}
}
function safeToString(input) {
	try {
		const s = input.toString();
		return typeof s === "string" ? s : String(s);
	} catch {
		return "[toString threw]";
	}
}
function safeGet(input, key) {
	try {
		return input[key];
	} catch {
		return "[property access threw]";
	}
}
function formatJson(input, options) {
	const ancestors = [];
	return JSON.stringify(input, function(key, value) {
		const original = Object.getOwnPropertyDescriptor(this, key)?.value;
		const redacted = hasProperty(original, symbolRedactable) ? redact$2(original) : redact$2(value);
		if (typeof redacted === "bigint") return format$1(redacted);
		if (typeof redacted !== "object" || redacted === null) return redacted;
		const current = redacted instanceof Error && !hasProperty(redacted, "toJSON") ? {
			...redacted,
			name: redacted.name,
			message: redacted.message
		} : redacted;
		while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) ancestors.pop();
		if (ancestors.includes(redacted)) return;
		ancestors.push(redacted);
		if (current !== redacted) ancestors.push(current);
		if (!hasGetter(current) || isJsonPrimitiveWrapper(current)) return current;
		const serialized = new Proxy(current, { get(target, key) {
			const value = Reflect.get(target, key, target);
			return Object.getOwnPropertyDescriptor(target, key)?.get !== void 0 ? redact$2(value) : value;
		} });
		ancestors.push(serialized);
		return serialized;
	}, options?.space) ?? "null";
}
function hasGetter(object) {
	for (const key of Object.getOwnPropertyNames(object)) if (Object.getOwnPropertyDescriptor(object, key)?.get !== void 0) return true;
	return false;
}
function isJsonPrimitiveWrapper(object) {
	for (const valueOf of [
		Number.prototype.valueOf,
		Boolean.prototype.valueOf,
		String.prototype.valueOf
	]) try {
		Reflect.apply(valueOf, object, []);
		return true;
	} catch {}
	return false;
}
//#endregion
//#region node_modules/effect/dist/Inspectable.js
const NodeInspectSymbol = Symbol.for("nodejs.util.inspect.custom");
const toJson = (input) => {
	try {
		input = redact$2(input);
		if (hasProperty(input, "toJSON") && isFunction(input["toJSON"]) && input["toJSON"].length === 0) return input.toJSON();
		else if (Array.isArray(input)) return input.map(toJson);
		return input;
	} catch {
		return "[toJSON threw]";
	}
};
const toStringUnknown = (u, whitespace = 2) => {
	if (typeof u === "string") return u;
	try {
		return typeof u === "object" ? formatJson(u, { space: whitespace }) : format$1(u, { space: whitespace });
	} catch {
		return String(u);
	}
};
const BaseProto = {
	toJSON() {
		return toJson(this);
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	toString() {
		return format$1(this.toJSON());
	}
};
//#endregion
//#region node_modules/effect/dist/internal/stackTraceLimit.js
const isStackTraceLimitWritable = () => {
	const desc = Object.getOwnPropertyDescriptor(Error, "stackTraceLimit");
	if (desc === void 0) return Object.isExtensible(Error);
	return Object.hasOwn(desc, "writable") ? desc.writable === true : desc.set !== void 0;
};
const canWriteStackTraceLimit = isStackTraceLimitWritable();
const getStackTraceLimit = () => Error.stackTraceLimit;
const setStackTraceLimit = (value) => {
	if (canWriteStackTraceLimit) Error.stackTraceLimit = value;
};
//#endregion
//#region node_modules/effect/dist/Utils.js
var SingleShotGen = class {
	constructor(self) {
		this.value = self;
		this.done = false;
	}
	next(a) {
		if (this.done) {
			this.value = a;
			return this;
		}
		this.done = true;
		return {
			value: this.value,
			done: false
		};
	}
};
const pickInternalCall = () => {
	const InternalTypeId = "~effect/Utils/internal";
	const standard = { [InternalTypeId]: (body) => {
		return body();
	} };
	const forced = { [InternalTypeId]: (body) => {
		try {
			return body();
		} finally {}
	} };
	const limit = getStackTraceLimit();
	if (limit === 0) return forced[InternalTypeId];
	setStackTraceLimit(2);
	const error = standard[InternalTypeId](() => new Error());
	setStackTraceLimit(limit);
	return error.stack?.includes(InternalTypeId) === true ? standard[InternalTypeId] : forced[InternalTypeId];
};
const internalCall = pickInternalCall();
//#endregion
//#region node_modules/effect/dist/internal/record.js
function assignProperty(self, key, value) {
	if (key === "__proto__") Object.defineProperty(self, key, {
		value,
		writable: true,
		enumerable: true,
		configurable: true
	});
	else self[key] = value;
}
function assignProperties(self, source) {
	for (const key of Reflect.ownKeys(source)) if (Object.prototype.propertyIsEnumerable.call(source, key)) assignProperty(self, key, source[key]);
}
//#endregion
//#region node_modules/effect/dist/internal/core.js
const EffectTypeId = `~effect/Effect`;
const ExitTypeId = `~effect/Exit`;
const effectVariance = {
	_A: identity,
	_E: identity,
	_R: identity
};
const identifier = `${EffectTypeId}/identifier`;
const args = `${EffectTypeId}/args`;
const evaluate = `${EffectTypeId}/evaluate`;
const contA = `${EffectTypeId}/successCont`;
const contE = `${EffectTypeId}/failureCont`;
const contAll = `${EffectTypeId}/ensureCont`;
const Yield = Symbol.for("effect/Effect/Yield");
const PipeInspectableProto = {
	pipe() {
		return pipeArguments(this, arguments);
	},
	toJSON() {
		return { ...this };
	},
	toString() {
		return format$1(this.toJSON(), {
			ignoreToString: true,
			space: 2
		});
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
};
const EffectProto = {
	[EffectTypeId]: effectVariance,
	...PipeInspectableProto,
	[Symbol.iterator]() {
		return new SingleShotGen(this);
	},
	toJSON() {
		return {
			_id: "Effect",
			op: this[identifier],
			..."~effect/Effect/args" in this ? { args: this[args] } : void 0
		};
	}
};
const isEffect$1 = (u) => hasProperty(u, EffectTypeId);
const isExit = (u) => hasProperty(u, ExitTypeId);
const CauseTypeId = "~effect/Cause";
const CauseReasonTypeId = "~effect/Cause/Reason";
const isCause = (self) => hasProperty(self, CauseTypeId);
var CauseImpl = class {
	constructor(failures) {
		this[CauseTypeId] = CauseTypeId;
		this.reasons = failures;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	toJSON() {
		return {
			_id: "Cause",
			failures: this.reasons.map((f) => f.toJSON())
		};
	}
	toString() {
		return `Cause(${format$1(this.reasons)})`;
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
	[symbol](that) {
		return isCause(that) && this.reasons.length === that.reasons.length && this.reasons.every((e, i) => equals$1(e, that.reasons[i]));
	}
	[symbol$1]() {
		return array(this.reasons);
	}
};
const annotationsMap = new WeakMap();
var ReasonBase = class {
	[CauseReasonTypeId];
	annotations;
	_tag;
	constructor(_tag, annotations, originalError) {
		this[CauseReasonTypeId] = CauseReasonTypeId;
		this._tag = _tag;
		if (annotations !== constEmptyAnnotations && typeof originalError === "object" && originalError !== null && annotations.size > 0) {
			const prevAnnotations = annotationsMap.get(originalError);
			if (prevAnnotations) annotations = new Map([...prevAnnotations, ...annotations]);
			annotationsMap.set(originalError, annotations);
		}
		this.annotations = annotations;
	}
	annotate(annotations, options) {
		if (annotations.mapUnsafe.size === 0) return this;
		const newAnnotations = new Map(this.annotations);
		annotations.mapUnsafe.forEach((value, key) => {
			if (options?.overwrite !== true && newAnnotations.has(key)) return;
			newAnnotations.set(key, value);
		});
		const self = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
		self.annotations = newAnnotations;
		return self;
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	toString() {
		return format$1(this);
	}
	[NodeInspectSymbol]() {
		return this.toString();
	}
};
const constEmptyAnnotations = new Map();
var Fail = class extends ReasonBase {
	constructor(error, annotations = constEmptyAnnotations) {
		super("Fail", annotations, error);
		this.error = error;
	}
	toString() {
		return `Fail(${format$1(this.error)})`;
	}
	toJSON() {
		return {
			_tag: "Fail",
			error: this.error
		};
	}
	[symbol](that) {
		return isFailReason$1(that) && equals$1(this.error, that.error) && equals$1(this.annotations, that.annotations);
	}
	[symbol$1]() {
		return combine(string$1(this._tag))(combine(hash(this.error))(hash(this.annotations)));
	}
};
const causeFromReasons = (reasons) => new CauseImpl(reasons);
const dedupeReasons = (self, that) => {
	const buckets = new Map();
	const out = [];
	for (const reason of self.concat(that)) {
		const hash$2 = hash(reason);
		const bucket = buckets.get(hash$2);
		if (bucket === void 0) buckets.set(hash$2, [reason]);
		else if (bucket.some((previous) => equals$1(previous, reason))) continue;
		else bucket.push(reason);
		out.push(reason);
	}
	return out;
};
const causeCombine = dual(2, (self, that) => {
	if (self.reasons.length === 0) return that;
	else if (that.reasons.length === 0) return self;
	const newCause = new CauseImpl(dedupeReasons(self.reasons, that.reasons));
	return equals$1(self, newCause) ? self : newCause;
});
const causeAddInterrupts = (self, interrupts) => {
	const reasons = self.reasons.slice();
	for (const reason of interrupts.reasons) if (isInterruptReason(reason) && !reasons.some((r) => isInterruptReason(r) && r.fiberId === reason.fiberId && r.annotations === reason.annotations)) reasons.push(reason);
	return reasons.length === self.reasons.length ? self : new CauseImpl(reasons);
};
const causeEmpty = new CauseImpl([]);
const causeFail = (error) => new CauseImpl([new Fail(error)]);
var Die = class extends ReasonBase {
	constructor(defect, annotations = constEmptyAnnotations) {
		super("Die", annotations, defect);
		this.defect = defect;
	}
	toString() {
		return `Die(${format$1(this.defect)})`;
	}
	toJSON() {
		return {
			_tag: "Die",
			defect: this.defect
		};
	}
	[symbol](that) {
		return isDieReason(that) && equals$1(this.defect, that.defect) && equals$1(this.annotations, that.annotations);
	}
	[symbol$1]() {
		return combine(string$1(this._tag))(combine(hash(this.defect))(hash(this.annotations)));
	}
};
const causeDie = (defect) => new CauseImpl([new Die(defect)]);
const causeAnnotate = dual((args) => isCause(args[0]), (self, annotations, options) => {
	if (annotations.mapUnsafe.size === 0) return self;
	return new CauseImpl(self.reasons.map((f) => f.annotate(annotations, options)));
});
const isFailReason$1 = (self) => self._tag === "Fail";
const isDieReason = (self) => self._tag === "Die";
const isInterruptReason = (self) => self._tag === "Interrupt";
function defaultEvaluate(_fiber) {
	return exitDie(`Effect.evaluate: Not implemented`);
}
const makePrimitiveProto = (options) => ({
	...EffectProto,
	[identifier]: options.op,
	[evaluate]: options["~effect/Effect/evaluate"] ?? defaultEvaluate,
	[contA]: options[contA],
	[contE]: options[contE],
	[contAll]: options[contAll]
});
const makePrimitive = (options) => {
	const Proto = makePrimitiveProto(options);
	const PrimitiveImpl = function(value) {
		this[args] = value;
	};
	PrimitiveImpl.prototype = Proto;
	return function(value) {
		return new PrimitiveImpl(value);
	};
};
const makeExit = (options) => {
	const Proto = {
		[ExitTypeId]: ExitTypeId,
		_tag: options.op,
		get [options.prop]() {
			return this[args];
		},
		...makePrimitiveProto(options),
		toString() {
			return `${options.op}(${format$1(this[args])})`;
		},
		toJSON() {
			return {
				_id: "Exit",
				_tag: options.op,
				[options.prop]: this[args]
			};
		},
		[symbol](that) {
			return isExit(that) && that._tag === this._tag && equals$1(this["~effect/Effect/args"], that["~effect/Effect/args"]);
		},
		[symbol$1]() {
			return combine(string$1(options.op), hash(this[args]));
		}
	};
	const ExitPrimitive = function(value) {
		this[args] = value;
	};
	ExitPrimitive.prototype = Proto;
	return function(value) {
		return new ExitPrimitive(value);
	};
};
const exitSucceed = makeExit({
	op: "Success",
	prop: "value",
	[evaluate](fiber) {
		const cont = fiber.getCont(contA);
		return cont ? cont[contA](this[args], fiber, this) : fiber.yieldWith(this);
	}
});
const StackTraceKey = { key: "effect/Cause/StackTrace" };
const InterruptorStackTrace = { key: "effect/Cause/InterruptorStackTrace" };
const exitFailCause = makeExit({
	op: "Failure",
	prop: "cause",
	[evaluate](fiber) {
		let cause = this[args];
		let annotated = false;
		if (fiber.cache.stackFrame) {
			cause = causeAnnotate(cause, { mapUnsafe: new Map([[StackTraceKey.key, fiber.cache.stackFrame]]) });
			annotated = true;
		}
		let cont = fiber.getCont(contE);
		const interruptedCause = fiber._interruptedCause;
		if (interruptedCause && fiber.interruptible) {
			let skippedHandler = false;
			while (cont && fiber.interruptible) {
				skippedHandler ||= identifier in cont;
				cont = fiber.getCont(contE);
			}
			if (skippedHandler) cause = causeFromReasons(cause.reasons.filter((reason) => reason._tag !== "Fail"));
			cause = causeAddInterrupts(cause, interruptedCause);
			annotated = true;
		}
		return cont ? cont[contE](cause, fiber, annotated ? void 0 : this) : fiber.yieldWith(annotated ? exitFailCause(cause) : this);
	}
});
const exitFail = (e) => exitFailCause(causeFail(e));
const exitDie = (defect) => exitFailCause(causeDie(defect));
const withFiber = makePrimitive({
	op: "WithFiber",
	[evaluate](fiber) {
		return this[args](fiber);
	}
});
const YieldableError = function() {
	class YieldableError extends globalThis.Error {}
	const proto = makePrimitiveProto({
		op: "YieldableError",
		[evaluate]() {
			return exitFail(this);
		}
	});
	delete proto.toString;
	Object.assign(YieldableError.prototype, proto);
	return YieldableError;
}();
const Error$3 = function() {
	const plainArgsSymbol = Symbol.for("effect/Data/Error/plainArgs");
	return class Base extends YieldableError {
		constructor(args) {
			super(args?.message, args?.cause ? { cause: args.cause } : void 0);
			if (args) {
				assignProperties(this, args);
				Object.defineProperty(this, plainArgsSymbol, {
					value: args,
					enumerable: false
				});
			}
		}
		toJSON() {
			return {
				...this[plainArgsSymbol],
				...this
			};
		}
	};
}();
const TaggedError$2 = (tag) => {
	class Base extends Error$3 {
		_tag = tag;
	}
	Base.prototype.name = tag;
	return Base;
};
const DoneTypeId = "~effect/Cause/Done";
const isDone$1 = (u) => hasProperty(u, DoneTypeId);
const DoneVoid = {
	[DoneTypeId]: DoneTypeId,
	_tag: "Done",
	value: void 0
};
const Done = (value) => {
	if (value === void 0) return DoneVoid;
	return {
		[DoneTypeId]: DoneTypeId,
		_tag: "Done",
		value
	};
};
const doneVoid = exitFail(DoneVoid);
const done$1 = (value) => {
	if (value === void 0) return doneVoid;
	return exitFail(Done(value));
};
//#endregion
//#region node_modules/effect/dist/internal/option.js
const TypeId$25 = "~effect/Option";
const CommonProto$1 = {
	[TypeId$25]: { _A: (_) => _ },
	...PipeInspectableProto,
	[Symbol.iterator]() {
		return new SingleShotGen(this);
	}
};
const SomeProto = Object.defineProperty(Object.assign(Object.create(CommonProto$1), {
	_tag: "Some",
	_op: "Some",
	[symbol](that) {
		return isOption(that) && isSome$1(that) && equals$1(this.value, that.value);
	},
	[symbol$1]() {
		return combine(hash(this._tag))(hash(this.value));
	},
	toString() {
		return `some(${format$1(this.value)})`;
	},
	toJSON() {
		return {
			_id: "Option",
			_tag: this._tag,
			value: toJson(this.value)
		};
	}
}), "valueOrUndefined", { get() {
	return this.value;
} });
const NoneHash = hash("None");
const NoneProto = Object.assign(Object.create(CommonProto$1), {
	_tag: "None",
	_op: "None",
	valueOrUndefined: void 0,
	[symbol](that) {
		return isOption(that) && isNone$1(that);
	},
	[symbol$1]() {
		return NoneHash;
	},
	toString() {
		return `none()`;
	},
	toJSON() {
		return {
			_id: "Option",
			_tag: this._tag
		};
	}
});
const isOption = (input) => hasProperty(input, TypeId$25);
const isNone$1 = (fa) => fa._tag === "None";
const isSome$1 = (fa) => fa._tag === "Some";
const none$1 = Object.create(NoneProto);
const SomeImpl = function(value) {
	this.value = value;
};
SomeImpl.prototype = SomeProto;
const some$1 = (value) => new SomeImpl(value);
//#endregion
//#region node_modules/effect/dist/internal/result.js
const TypeId$24 = "~effect/Result";
const CommonProto = {
	[TypeId$24]: {
		_A: (_) => _,
		_E: (_) => _
	},
	...PipeInspectableProto,
	[Symbol.iterator]() {
		return new SingleShotGen(this);
	}
};
const SuccessProto = Object.assign(Object.create(CommonProto), {
	_tag: "Success",
	_op: "Success",
	[symbol](that) {
		return isResult$1(that) && isSuccess$2(that) && equals$1(this.success, that.success);
	},
	[symbol$1]() {
		return combine(hash(this._tag))(hash(this.success));
	},
	toString() {
		return `success(${format$1(this.success)})`;
	},
	toJSON() {
		return {
			_id: "Result",
			_tag: this._tag,
			value: toJson(this.success)
		};
	}
});
const FailureProto = Object.assign(Object.create(CommonProto), {
	_tag: "Failure",
	_op: "Failure",
	[symbol](that) {
		return isResult$1(that) && isFailure$1(that) && equals$1(this.failure, that.failure);
	},
	[symbol$1]() {
		return combine(hash(this._tag))(hash(this.failure));
	},
	toString() {
		return `failure(${format$1(this.failure)})`;
	},
	toJSON() {
		return {
			_id: "Result",
			_tag: this._tag,
			failure: toJson(this.failure)
		};
	}
});
const isResult$1 = (input) => hasProperty(input, TypeId$24);
const isFailure$1 = (result) => result._tag === "Failure";
const isSuccess$2 = (result) => result._tag === "Success";
const FailureImpl = function(failure) {
	this.failure = failure;
};
FailureImpl.prototype = FailureProto;
const fail$6 = (failure) => new FailureImpl(failure);
const SuccessImpl = function(success) {
	this.success = success;
};
SuccessImpl.prototype = SuccessProto;
const succeed$5 = (success) => new SuccessImpl(success);
//#endregion
//#region node_modules/effect/dist/Order.js
function make$15(compare) {
	return (self, that) => self === that ? 0 : compare(self, that);
}
const String$4 = make$15((self, that) => self < that ? -1 : 1);
const Number$4 = make$15((self, that) => {
	if (globalThis.Number.isNaN(self) && globalThis.Number.isNaN(that)) return 0;
	if (globalThis.Number.isNaN(self)) return -1;
	if (globalThis.Number.isNaN(that)) return 1;
	return self < that ? -1 : 1;
});
const mapInput = dual(2, (self, f) => make$15((b1, b2) => self(f(b1), f(b2))));
const isLessThan$1 = (O) => dual(2, (self, that) => O(self, that) === -1);
const isGreaterThan$1 = (O) => dual(2, (self, that) => O(self, that) === 1);
const isLessThanOrEqualTo$1 = (O) => dual(2, (self, that) => O(self, that) !== 1);
const isGreaterThanOrEqualTo$1 = (O) => dual(2, (self, that) => O(self, that) !== -1);
//#endregion
//#region node_modules/effect/dist/Option.js
const none = () => none$1;
const some = some$1;
const isNone = isNone$1;
const isSome = isSome$1;
const match$3 = dual(2, (self, { onNone, onSome }) => isNone(self) ? onNone() : onSome(self.value));
const getOrElse = dual(2, (self, onNone) => isNone(self) ? onNone() : self.value);
const orElse = dual(2, (self, that) => isNone(self) ? that() : self);
const fromNullishOr = (a) => a == null ? none() : some(a);
const getOrUndefined$1 = getOrElse(constUndefined);
const map$6 = dual(2, (self, f) => isNone(self) ? none() : some(f(self.value)));
const flatMap$3 = dual(2, (self, f) => isNone(self) ? none() : f(self.value));
//#endregion
//#region node_modules/effect/dist/BigInt.js
const BigInt$4 = globalThis.BigInt;
const toNumber = (b) => {
	if (b > BigInt$4(Number.MAX_SAFE_INTEGER) || b < BigInt$4(Number.MIN_SAFE_INTEGER)) return none();
	return some(Number(b));
};
//#endregion
//#region node_modules/effect/dist/ByteSize.js
const bigint0$3 = BigInt(0);
const bigint1$2 = BigInt(1);
const decimalBase = BigInt(1e3);
const binaryBase = BigInt(1024);
const decimalUnits = [
	{
		symbol: "B",
		factor: bigint1$2,
		names: [
			"B",
			"byte",
			"bytes"
		]
	},
	{
		symbol: "kB",
		factor: decimalBase,
		names: [
			"kB",
			"kilobyte",
			"kilobytes"
		]
	},
	{
		symbol: "MB",
		factor: decimalBase ** BigInt(2),
		names: [
			"MB",
			"megabyte",
			"megabytes"
		]
	},
	{
		symbol: "GB",
		factor: decimalBase ** BigInt(3),
		names: [
			"GB",
			"gigabyte",
			"gigabytes"
		]
	},
	{
		symbol: "TB",
		factor: decimalBase ** BigInt(4),
		names: [
			"TB",
			"terabyte",
			"terabytes"
		]
	},
	{
		symbol: "PB",
		factor: decimalBase ** BigInt(5),
		names: [
			"PB",
			"petabyte",
			"petabytes"
		]
	},
	{
		symbol: "EB",
		factor: decimalBase ** BigInt(6),
		names: [
			"EB",
			"exabyte",
			"exabytes"
		]
	},
	{
		symbol: "ZB",
		factor: decimalBase ** BigInt(7),
		names: [
			"ZB",
			"zettabyte",
			"zettabytes"
		]
	},
	{
		symbol: "YB",
		factor: decimalBase ** BigInt(8),
		names: [
			"YB",
			"yottabyte",
			"yottabytes"
		]
	},
	{
		symbol: "RB",
		factor: decimalBase ** BigInt(9),
		names: [
			"RB",
			"ronnabyte",
			"ronnabytes"
		]
	},
	{
		symbol: "QB",
		factor: decimalBase ** BigInt(10),
		names: [
			"QB",
			"quettabyte",
			"quettabytes"
		]
	}
];
const binaryUnits = [
	decimalUnits[0],
	{
		symbol: "KiB",
		factor: binaryBase,
		names: [
			"KiB",
			"kibibyte",
			"kibibytes"
		]
	},
	{
		symbol: "MiB",
		factor: binaryBase ** BigInt(2),
		names: [
			"MiB",
			"mebibyte",
			"mebibytes"
		]
	},
	{
		symbol: "GiB",
		factor: binaryBase ** BigInt(3),
		names: [
			"GiB",
			"gibibyte",
			"gibibytes"
		]
	},
	{
		symbol: "TiB",
		factor: binaryBase ** BigInt(4),
		names: [
			"TiB",
			"tebibyte",
			"tebibytes"
		]
	},
	{
		symbol: "PiB",
		factor: binaryBase ** BigInt(5),
		names: [
			"PiB",
			"pebibyte",
			"pebibytes"
		]
	},
	{
		symbol: "EiB",
		factor: binaryBase ** BigInt(6),
		names: [
			"EiB",
			"exbibyte",
			"exbibytes"
		]
	},
	{
		symbol: "ZiB",
		factor: binaryBase ** BigInt(7),
		names: [
			"ZiB",
			"zebibyte",
			"zebibytes"
		]
	},
	{
		symbol: "YiB",
		factor: binaryBase ** BigInt(8),
		names: [
			"YiB",
			"yobibyte",
			"yobibytes"
		]
	}
];
const allUnits = [...decimalUnits, ...binaryUnits.slice(1)];
const unitsByName = new Map(allUnits.flatMap((unit) => unit.names.map((name) => [name, unit])));
const make$14 = (value) => value;
const invalid$2 = (message) => {
	throw new Error(`Invalid ByteSize: ${message}`);
};
const fromNumber = (input) => {
	if (!Number.isSafeInteger(input) || input < 0) return invalid$2(`expected a non-negative safe integer, received ${input}`);
	return make$14(BigInt(input));
};
const fromStringUnsafe = (input) => {
	const match = /^\s*(\d+)(?:\.(\d+))?\s*([A-Za-z]+)\s*$/.exec(input);
	if (match === null) return invalid$2(`unsupported syntax ${JSON.stringify(input)}`);
	const unit = unitsByName.get(match[3]);
	if (unit === void 0) return invalid$2(`unsupported unit ${JSON.stringify(match[3])}`);
	const fraction = match[2] ?? "";
	const scale = BigInt(10) ** BigInt(fraction.length);
	const numerator = BigInt(match[1] + fraction) * unit.factor;
	if (numerator % scale !== bigint0$3) return invalid$2(`${JSON.stringify(input)} does not represent an integral number of bytes`);
	return make$14(numerator / scale);
};
const fromInputUnsafe$1 = (input) => {
	switch (typeof input) {
		case "bigint":
			if (input < bigint0$3) return invalid$2(`expected a non-negative bigint, received ${input}`);
			return make$14(input);
		case "number": return fromNumber(input);
		case "string": return fromStringUnsafe(input);
	}
	return invalid$2(`unsupported input ${input}`);
};
const bytes = (value) => typeof value === "bigint" ? fromInputUnsafe$1(value) : fromNumber(value);
//#endregion
//#region node_modules/effect/dist/Effectable.js
const Prototype = (options) => makePrimitiveProto({
	op: options.label,
	[evaluate]: options.evaluate
});
//#endregion
//#region node_modules/effect/dist/Context.js
const ServiceTypeId = "~effect/Context/Service";
const Service = function() {
	function KeyClass() {}
	const self = KeyClass;
	Object.setPrototypeOf(self, ServiceProto);
	const init = (key, options) => {
		self.key = key;
		if (options?.defaultValue) {
			self[ReferenceTypeId] = ReferenceTypeId;
			self.defaultValue = options.defaultValue;
		}
		if (options?.make) self.make = options.make;
		if (options?.fiberCached) cacheKeys.add(key);
		return self;
	};
	return arguments.length > 0 ? init(arguments[0], arguments[1]) : init;
};
const ServiceProto = {
	[ServiceTypeId]: ServiceTypeId,
	...Prototype({
		label: "Service",
		evaluate(fiber) {
			return exitSucceed(get(fiber.context, this));
		}
	}),
	toJSON() {
		return {
			_id: "Service",
			key: this.key
		};
	},
	of(self) {
		return self;
	},
	context(self) {
		return make$13(this, self);
	},
	use(f) {
		return withFiber((fiber) => f(get(fiber.context, this)));
	},
	useSync(f) {
		return withFiber((fiber) => exitSucceed(f(get(fiber.context, this))));
	}
};
const cacheKeys = new Set();
const ReferenceTypeId = "~effect/Context/Reference";
const TypeId$23 = "~effect/Context";
const MaxDepth = 8;
const FlattenAfterBaseHits = 8;
const makeImpl = (cacheRoot, base, overlay, depth) => {
	const self = Object.create(Proto$5);
	self.cacheRoot = cacheRoot ?? self;
	self.base = base;
	self.overlay = overlay;
	self.depth = depth;
	self._flat = void 0;
	self.baseHits = 0;
	return self;
};
const applyOverlays = (map, overlay) => {
	if (!overlay) return;
	applyOverlays(map, overlay.parent);
	map.set(overlay.key, overlay.value);
};
const flatten = (self) => {
	if (self._flat) return self._flat;
	if (!self.overlay) return self._flat = self.base;
	const map = new Map(self.base);
	applyOverlays(map, self.overlay);
	return self._flat = map;
};
const withFlat = (self, f) => {
	const map = new Map(self.mapUnsafe);
	f(map);
	return makeUnsafe$4(map);
};
const notFound = Symbol();
const lookup = (self, key) => {
	const impl = self;
	for (let overlay = impl.overlay; overlay; overlay = overlay.parent) if (overlay.key === key) return overlay.value;
	const value = impl.base.get(key);
	if (value === void 0 && !impl.base.has(key)) return notFound;
	if (impl.overlay && ++impl.baseHits >= impl.base.size && impl.baseHits >= FlattenAfterBaseHits) {
		impl.base = flatten(impl);
		impl.overlay = void 0;
		impl.depth = 0;
	}
	return value;
};
const makeUnsafe$4 = (mapUnsafe) => makeImpl(void 0, mapUnsafe, void 0, 0);
const Proto$5 = {
	get mapUnsafe() {
		return flatten(this);
	},
	...PipeInspectableProto,
	[TypeId$23]: { _Services: (_) => _ },
	toJSON() {
		return {
			_id: "Context",
			services: Array.from(this.mapUnsafe).map(([key, value]) => ({
				key,
				value
			}))
		};
	},
	[symbol](that) {
		if (!isContext(that)) return false;
		const self = this.mapUnsafe;
		const other = that.mapUnsafe;
		if (self.size !== other.size) return false;
		for (const [key, value] of self) if (!other.has(key) || !equals$1(value, other.get(key))) return false;
		return true;
	},
	[symbol$1]() {
		return number$1(this.mapUnsafe.size);
	}
};
const hasSameCache = (self, that) => self.cacheRoot === that.cacheRoot;
const isContext = (u) => hasProperty(u, TypeId$23);
const isReference = (u) => !!u[ReferenceTypeId];
const empty$1 = () => emptyContext;
const emptyContext = makeUnsafe$4(new Map());
const make$13 = (key, service) => makeUnsafe$4(new Map([[key.key, service]]));
const add = dual(3, (self, key, service) => addUnsafe(self, key.key, service));
const addUnsafe = (self, key, service) => {
	const impl = self;
	const cacheRoot = cacheKeys.has(key) ? void 0 : impl.cacheRoot;
	if (impl.depth >= MaxDepth) {
		const map = new Map(impl._flat ?? impl.base);
		if (!impl._flat) applyOverlays(map, impl.overlay);
		map.set(key, service);
		return makeImpl(cacheRoot, map, void 0, 0);
	}
	return makeImpl(cacheRoot, impl.base, {
		key,
		value: service,
		parent: impl.overlay
	}, impl.depth + 1);
};
const getOrUndefined = dual(2, (self, key) => getOrUndefinedUnsafe(self, key.key));
const getOrUndefinedUnsafe = (self, key) => {
	const value = lookup(self, key);
	return value === notFound ? void 0 : value;
};
const getUnsafe = dual(2, (self, service) => {
	const value = lookup(self, service.key);
	if (value === notFound) {
		if (isReference(service)) return getDefaultValue(service);
		throw serviceNotFoundError(service);
	}
	return value;
});
const get = getUnsafe;
const defaultValueCacheKey = "~effect/Context/defaultValue";
const getDefaultValue = (ref) => {
	if (defaultValueCacheKey in ref) return ref[defaultValueCacheKey];
	return ref[defaultValueCacheKey] = ref.defaultValue();
};
const serviceNotFoundError = (service) => {
	const error = new Error(`Service not found${service.key ? `: ${String(service.key)}` : ""}`);
	if (error.stack) {
		const lines = error.stack.split("\n");
		lines.splice(1, 3);
		error.stack = lines.join("\n");
	}
	return error;
};
const getOption = dual(2, (self, service) => {
	const value = lookup(self, service.key);
	if (value !== notFound) return some(value);
	return isReference(service) ? some(getDefaultValue(service)) : none();
});
const merge = dual(2, (self, that) => {
	if (self.mapUnsafe.size === 0) return that;
	if (that.mapUnsafe.size === 0) return self;
	return withFlat(self, (map) => that.mapUnsafe.forEach((value, key) => map.set(key, value)));
});
const mergeAll$1 = (...ctxs) => {
	const map = new Map();
	for (let i = 0; i < ctxs.length; i++) ctxs[i].mapUnsafe.forEach((value, key) => {
		map.set(key, value);
	});
	return makeUnsafe$4(map);
};
const Reference = Service;
//#endregion
//#region node_modules/effect/dist/internal/array.js
const isArrayNonEmpty$1 = (self) => self.length > 0;
//#endregion
//#region node_modules/effect/dist/internal/count.js
const normalize$1 = (n) => n > 0 ? Math.floor(n) : 0;
//#endregion
//#region node_modules/effect/dist/Result.js
const succeed$4 = succeed$5;
const fail$5 = fail$6;
const isResult = isResult$1;
const isFailure = isFailure$1;
const isSuccess$1 = isSuccess$2;
const match$2 = dual(2, (self, { onFailure, onSuccess }) => isFailure(self) ? onFailure(self.failure) : onSuccess(self.success));
//#endregion
//#region node_modules/effect/dist/Array.js
const Array$1 = globalThis.Array;
const fromIterable$1 = (collection) => Array$1.isArray(collection) ? collection : Array$1.from(collection);
const append$1 = dual(2, (self, last) => [...self, last]);
Array$1.isArray;
const isArrayNonEmpty = isArrayNonEmpty$1;
const isReadonlyArrayNonEmpty = isArrayNonEmpty$1;
const empty = () => [];
const of = (a) => [a];
const map$3 = dual(2, (self, f) => self.map(f));
//#endregion
//#region node_modules/effect/dist/Duration.js
const TypeId$22 = "~effect/Duration";
const bigint0$2 = BigInt(0);
const bigint1$1 = BigInt(1);
const bigint2 = BigInt(2);
const bigint10$1 = BigInt(10);
const bigint1e3 = BigInt(1e3);
const bigint1e6 = BigInt(1e6);
const roundTiesAwayFromZero = (input) => BigInt(Math.sign(input) * Math.round(Math.abs(input)));
const roundMillisToNanos = (millis) => Number.isInteger(millis) ? BigInt(millis) * bigint1e6 : roundTiesAwayFromZero(millis * 1e6);
const fromNanosNumber = (nanos) => make$12(Number.isFinite(nanos) ? roundTiesAwayFromZero(nanos) : nanos);
const parseNanos = (input, scale) => {
	const decimalIndex = input.indexOf(".");
	if (decimalIndex === -1) return BigInt(input) * scale;
	const isNegative = input[0] === "-";
	const fractional = input.slice(decimalIndex + 1);
	const fractionalScale = bigint10$1 ** BigInt(fractional.length);
	const scaled = (BigInt(input.slice(isNegative ? 1 : 0, decimalIndex)) * fractionalScale + BigInt(fractional)) * scale;
	return divideTiesAwayFromZero(isNegative ? -scaled : scaled, fractionalScale);
};
const divideTiesAwayFromZero = (numerator, denominator) => {
	const absolute = numerator < bigint0$2 ? -numerator : numerator;
	const rounded = absolute / denominator + (absolute % denominator * bigint2 >= denominator ? bigint1$1 : bigint0$2);
	return numerator < bigint0$2 ? -rounded : rounded;
};
const DURATION_REGEXP = /^(-?\d+(?:\.\d+)?)\s+(nanos?|micros?|millis?|seconds?|minutes?|hours?|days?|weeks?)$/;
const fromInputUnsafe = (input) => {
	switch (typeof input) {
		case "number": return millis(input);
		case "bigint": return nanos(input);
		case "string": {
			if (input === "Infinity") return infinity;
			if (input === "-Infinity") return negativeInfinity;
			const match = DURATION_REGEXP.exec(input);
			if (!match) break;
			const [_, valueStr, unit] = match;
			if (unit === "nano" || unit === "nanos") return nanos(parseNanos(valueStr, bigint1$1));
			if (unit === "micro" || unit === "micros") return nanos(parseNanos(valueStr, bigint1e3));
			const value = Number(valueStr);
			switch (unit) {
				case "milli":
				case "millis": return millis(value);
				case "second":
				case "seconds": return seconds(value);
				case "minute":
				case "minutes": return minutes(value);
				case "hour":
				case "hours": return hours(value);
				case "day":
				case "days": return days(value);
				case "week":
				case "weeks": return weeks(value);
			}
			break;
		}
		case "object": {
			if (input === null) break;
			if (TypeId$22 in input) return input;
			if (Array.isArray(input)) {
				if (input.length !== 2 || !input.every(isNumber)) return invalid$1(input);
				if (Number.isNaN(input[0]) || Number.isNaN(input[1])) return zero$1;
				if (input[0] === -Infinity || input[1] === -Infinity) return negativeInfinity;
				if (input[0] === Infinity || input[1] === Infinity) return infinity;
				return fromNanosNumber(input[0] * 1e9 + input[1]);
			}
			const obj = input;
			let millis = 0;
			if (obj.weeks) millis += obj.weeks * 6048e5;
			if (obj.days) millis += obj.days * 864e5;
			if (obj.hours) millis += obj.hours * 36e5;
			if (obj.minutes) millis += obj.minutes * 6e4;
			if (obj.seconds) millis += obj.seconds * 1e3;
			if (obj.milliseconds) millis += obj.milliseconds;
			if (!obj.microseconds && !obj.nanoseconds) return make$12(millis);
			return fromNanosNumber(millis * 1e6 + (obj.microseconds ?? 0) * 1e3 + (obj.nanoseconds ?? 0));
		}
	}
	return invalid$1(input);
};
const invalid$1 = (input) => {
	throw new Error(`Invalid Input: ${input}`);
};
const zeroDurationValue = {
	_tag: "Millis",
	millis: 0
};
const infinityDurationValue = { _tag: "Infinity" };
const negativeInfinityDurationValue = { _tag: "NegativeInfinity" };
const DurationProto = {
	[TypeId$22]: TypeId$22,
	[symbol$1]() {
		switch (this.value._tag) {
			case "Millis": return hash(roundMillisToNanos(this.value.millis));
			case "Nanos": return hash(this.value.nanos);
			default: return structure(this.value);
		}
	},
	[symbol](that) {
		return isDuration(that) && equals(this, that);
	},
	toString() {
		switch (this.value._tag) {
			case "Infinity": return "Infinity";
			case "NegativeInfinity": return "-Infinity";
			case "Nanos": return `${this.value.nanos} nanos`;
			case "Millis": return `${this.value.millis} millis`;
		}
	},
	toJSON() {
		switch (this.value._tag) {
			case "Millis": return {
				_id: "Duration",
				_tag: "Millis",
				millis: this.value.millis
			};
			case "Nanos": return {
				_id: "Duration",
				_tag: "Nanos",
				nanos: String(this.value.nanos)
			};
			case "Infinity": return {
				_id: "Duration",
				_tag: "Infinity"
			};
			case "NegativeInfinity": return {
				_id: "Duration",
				_tag: "NegativeInfinity"
			};
		}
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const make$12 = (input) => {
	const duration = Object.create(DurationProto);
	if (typeof input === "number") {
		if (isNaN(input) || input === 0 || Object.is(input, -0)) duration.value = zeroDurationValue;
		else if (!Number.isFinite(input)) duration.value = input > 0 ? infinityDurationValue : negativeInfinityDurationValue;
		else if (!Number.isInteger(input)) duration.value = {
			_tag: "Nanos",
			nanos: roundMillisToNanos(input)
		};
		else duration.value = {
			_tag: "Millis",
			millis: input
		};
	} else if (input === bigint0$2) duration.value = zeroDurationValue;
	else duration.value = {
		_tag: "Nanos",
		nanos: input
	};
	return duration;
};
const isDuration = (u) => hasProperty(u, TypeId$22);
const zero$1 = make$12(0);
const infinity = make$12(Infinity);
const negativeInfinity = make$12(-Infinity);
const nanos = (nanos) => make$12(nanos);
const millis = (millis) => make$12(millis);
const seconds = (seconds) => make$12(seconds * 1e3);
const minutes = (minutes) => make$12(minutes * 6e4);
const hours = (hours) => make$12(hours * 36e5);
const days = (days) => make$12(days * 864e5);
const weeks = (weeks) => make$12(weeks * 6048e5);
const toMillis = (self) => match$1(fromInputUnsafe(self), {
	onMillis: identity,
	onNanos: (nanos) => Number(nanos) / 1e6,
	onInfinity: () => Infinity,
	onNegativeInfinity: () => -Infinity
});
const toNanosUnsafe = (input) => {
	const self = fromInputUnsafe(input);
	switch (self.value._tag) {
		case "Infinity":
		case "NegativeInfinity": throw new Error("Cannot convert infinite duration to nanos");
		case "Nanos": return self.value.nanos;
		case "Millis": return roundMillisToNanos(self.value.millis);
	}
};
const match$1 = dual(2, (self, options) => {
	switch (self.value._tag) {
		case "Millis": return options.onMillis(self.value.millis);
		case "Nanos": return options.onNanos(self.value.nanos);
		case "Infinity": return options.onInfinity();
		case "NegativeInfinity": return (options.onNegativeInfinity ?? options.onInfinity)();
	}
});
const matchPair = dual(3, (self, that, options) => {
	if (self.value._tag === "Infinity" || self.value._tag === "NegativeInfinity" || that.value._tag === "Infinity" || that.value._tag === "NegativeInfinity") return options.onInfinity(self, that);
	if (self.value._tag === "Millis") return that.value._tag === "Millis" ? options.onMillis(self.value.millis, that.value.millis) : options.onNanos(toNanosUnsafe(self), that.value.nanos);
	else return options.onNanos(self.value.nanos, toNanosUnsafe(that));
});
const Equivalence$2 = (self, that) => matchPair(self, that, {
	onMillis: (self, that) => self === that,
	onNanos: (self, that) => self === that,
	onInfinity: (self, that) => self.value._tag === that.value._tag
});
const equals = dual(2, (self, that) => Equivalence$2(self, that));
//#endregion
//#region node_modules/effect/dist/Scheduler.js
const Scheduler = Reference("effect/Scheduler", {
	fiberCached: true,
	defaultValue: () => new MixedScheduler()
});
const setMicrotask = (f) => {
	let cancelled = false;
	Promise.resolve().then(() => {
		if (!cancelled) f();
	});
	return () => {
		cancelled = true;
	};
};
const setTimer = "setImmediate" in globalThis ? (f) => {
	const timer = globalThis.setImmediate(f);
	return () => globalThis.clearImmediate(timer);
} : (f) => {
	const timer = setTimeout(f, 0);
	return () => clearTimeout(timer);
};
const setImmediate = (f) => {
	try {
		return setTimer(f);
	} catch {
		return setMicrotask(f);
	}
};
var PriorityBuckets = class {
	buckets = [];
	scheduleTask(task, priority) {
		const buckets = this.buckets;
		const len = buckets.length;
		let bucket;
		let index = 0;
		for (; index < len; index++) {
			if (buckets[index][0] > priority) break;
			bucket = buckets[index];
		}
		if (bucket && bucket[0] === priority) bucket[1].push(task);
		else if (index === len) buckets.push([priority, [task]]);
		else buckets.splice(index, 0, [priority, [task]]);
	}
	drain() {
		const buckets = this.buckets;
		this.buckets = [];
		return buckets;
	}
};
var MixedScheduler = class {
	executionMode;
	setImmediate;
	constructor(executionMode = "async", setImmediateFn) {
		this.executionMode = executionMode;
		this.setImmediate = setImmediateFn ?? (executionMode === "sync" ? setMicrotask : setImmediate);
	}
	shouldYield(fiber) {
		return fiber.currentOpCount >= fiber.cache.maxOpsBeforeYield;
	}
	makeDispatcher() {
		return new MixedSchedulerDispatcher(this.setImmediate);
	}
};
var MixedSchedulerDispatcher = class {
	tasks = new PriorityBuckets();
	running = void 0;
	setImmediate;
	constructor(setImmediateFn = setImmediate) {
		this.setImmediate = setImmediateFn;
	}
	scheduleTask(task, priority) {
		this.tasks.scheduleTask(task, priority);
		if (this.running === void 0) this.running = this.setImmediate(this.afterScheduled);
	}
	afterScheduled = () => {
		this.running = void 0;
		this.runTasks();
	};
	runTasks() {
		const buckets = this.tasks.drain();
		for (let i = 0; i < buckets.length; i++) {
			const toRun = buckets[i][1];
			for (let j = 0; j < toRun.length; j++) toRun[j]();
		}
	}
	flush() {
		while (this.tasks.buckets.length > 0) {
			if (this.running !== void 0) {
				this.running();
				this.running = void 0;
			}
			this.runTasks();
		}
	}
};
const MaxOpsBeforeYield = Reference("effect/Scheduler/MaxOpsBeforeYield", {
	fiberCached: true,
	defaultValue: () => 2048
});
const PreventSchedulerYield = Reference("effect/Scheduler/PreventSchedulerYield", {
	fiberCached: true,
	defaultValue: () => false
});
const Error$2 = Error$3;
const TaggedError$1 = TaggedError$2;
//#endregion
//#region node_modules/effect/dist/encoding/EncodingError.js
const EncodingErrorTypeId = "~effect/encoding/EncodingError";
var EncodingError = class extends TaggedError$1("EncodingError") {
	[EncodingErrorTypeId] = EncodingErrorTypeId;
};
const random = (length) => {
	switch (length) {
		case 16: return random16();
		case 32: return random32();
		default: {
			let result = "";
			for (let i = length >>> 3; i > 0; i--) result += random8();
			return result;
		}
	}
};
const hexCharCodes = Uint8Array.from("0123456789abcdef", (c) => c.charCodeAt(0));
const randomWord = () => Math.random() * 4294967296 >>> 0;
const random8 = () => {
	const a = randomWord();
	return String.fromCharCode(hexCharCodes[a >>> 28], hexCharCodes[a >>> 24 & 15], hexCharCodes[a >>> 20 & 15], hexCharCodes[a >>> 16 & 15], hexCharCodes[a >>> 12 & 15], hexCharCodes[a >>> 8 & 15], hexCharCodes[a >>> 4 & 15], hexCharCodes[a & 15]);
};
const random16 = () => {
	const a = randomWord();
	const b = randomWord();
	return String.fromCharCode(hexCharCodes[a >>> 28], hexCharCodes[a >>> 24 & 15], hexCharCodes[a >>> 20 & 15], hexCharCodes[a >>> 16 & 15], hexCharCodes[a >>> 12 & 15], hexCharCodes[a >>> 8 & 15], hexCharCodes[a >>> 4 & 15], hexCharCodes[a & 15], hexCharCodes[b >>> 28], hexCharCodes[b >>> 24 & 15], hexCharCodes[b >>> 20 & 15], hexCharCodes[b >>> 16 & 15], hexCharCodes[b >>> 12 & 15], hexCharCodes[b >>> 8 & 15], hexCharCodes[b >>> 4 & 15], hexCharCodes[b & 15]);
};
const random32 = () => {
	const a = randomWord();
	const b = randomWord();
	const c = randomWord();
	const d = randomWord();
	return String.fromCharCode(hexCharCodes[a >>> 28], hexCharCodes[a >>> 24 & 15], hexCharCodes[a >>> 20 & 15], hexCharCodes[a >>> 16 & 15], hexCharCodes[a >>> 12 & 15], hexCharCodes[a >>> 8 & 15], hexCharCodes[a >>> 4 & 15], hexCharCodes[a & 15], hexCharCodes[b >>> 28], hexCharCodes[b >>> 24 & 15], hexCharCodes[b >>> 20 & 15], hexCharCodes[b >>> 16 & 15], hexCharCodes[b >>> 12 & 15], hexCharCodes[b >>> 8 & 15], hexCharCodes[b >>> 4 & 15], hexCharCodes[b & 15], hexCharCodes[c >>> 28], hexCharCodes[c >>> 24 & 15], hexCharCodes[c >>> 20 & 15], hexCharCodes[c >>> 16 & 15], hexCharCodes[c >>> 12 & 15], hexCharCodes[c >>> 8 & 15], hexCharCodes[c >>> 4 & 15], hexCharCodes[c & 15], hexCharCodes[d >>> 28], hexCharCodes[d >>> 24 & 15], hexCharCodes[d >>> 20 & 15], hexCharCodes[d >>> 16 & 15], hexCharCodes[d >>> 12 & 15], hexCharCodes[d >>> 8 & 15], hexCharCodes[d >>> 4 & 15], hexCharCodes[d & 15]);
};
//#endregion
//#region node_modules/effect/dist/Tracer.js
const ParentSpanKey = "effect/Tracer/ParentSpan";
var ParentSpan = class extends Service()(ParentSpanKey, { fiberCached: true }) {};
const make$11 = (options) => options;
const DisablePropagation = Reference("effect/Tracer/DisablePropagation", { defaultValue: constFalse });
const CurrentTraceLevel = Reference("effect/Tracer/CurrentTraceLevel", { defaultValue: () => "Info" });
const MinimumTraceLevel = Reference("effect/Tracer/MinimumTraceLevel", { defaultValue: () => "All" });
const TracerKey = "effect/Tracer";
const nativeTracer = make$11({ span: (options) => new NativeSpan(options) });
var NativeSpan = class {
	_tag = "Span";
	sampled;
	name;
	parent;
	annotations;
	links;
	startTime;
	kind;
	status;
	_traceId = void 0;
	_spanId = void 0;
	_attributes = void 0;
	_events = void 0;
	constructor(options) {
		this.name = options.name;
		this.parent = options.parent;
		this.annotations = options.annotations;
		this.links = options.links;
		this.startTime = options.startTime;
		this.kind = options.kind;
		this.sampled = options.sampled;
		this.status = {
			_tag: "Started",
			startTime: options.startTime
		};
	}
	get traceId() {
		return this._traceId ??= getOrUndefined$1(this.parent)?.traceId ?? random(32);
	}
	get spanId() {
		return this._spanId ??= random(16);
	}
	get attributes() {
		return this._attributes ??= new Map();
	}
	get events() {
		return this._events ??= [];
	}
	end(endTime, exit) {
		this.status = {
			_tag: "Ended",
			endTime,
			exit,
			startTime: this.status.startTime
		};
	}
	attribute(key, value) {
		this.attributes.set(key, value);
	}
	event(name, startTime, attributes) {
		this.events.push([
			name,
			startTime,
			attributes ?? {}
		]);
	}
	addLinks(links) {
		this.links.push(...links);
	}
};
//#endregion
//#region node_modules/effect/dist/internal/metric.js
const FiberRuntimeMetricsKey = "effect/Metric/FiberRuntimeMetrics";
//#endregion
//#region node_modules/effect/dist/internal/references.js
const CurrentStackFrame = Reference("effect/References/CurrentStackFrame", {
	fiberCached: true,
	defaultValue: constUndefined
});
const TracerEnabled = Reference("effect/References/TracerEnabled", {
	fiberCached: true,
	defaultValue: constTrue
});
const TracerTimingEnabled = Reference("effect/References/TracerTimingEnabled", { defaultValue: constTrue });
const TracerSpanAnnotations = Reference("effect/References/TracerSpanAnnotations", { defaultValue: () => ({}) });
const TracerSpanLinks = Reference("effect/References/TracerSpanLinks", { defaultValue: () => [] });
const CurrentLogAnnotations = Reference("effect/References/CurrentLogAnnotations", { defaultValue: () => ({}) });
const CurrentLogLevel = Reference("effect/References/CurrentLogLevel", {
	fiberCached: true,
	defaultValue: () => "Info"
});
const MinimumLogLevel = Reference("effect/References/MinimumLogLevel", {
	fiberCached: true,
	defaultValue: () => "Info"
});
const CurrentLogSpans = Reference("effect/References/CurrentLogSpans", { defaultValue: () => [] });
//#endregion
//#region node_modules/effect/dist/internal/tracer.js
const makeStackCleaner = (line) => (stack) => {
	let cache;
	return () => {
		if (cache !== void 0) return cache;
		const trace = stack();
		if (!trace) return void 0;
		const lines = trace.split("\n");
		if (lines[line] !== void 0) {
			cache = lines[line].trim();
			return cache;
		}
	};
};
//#endregion
//#region node_modules/effect/dist/internal/effect.js
var Interrupt = class extends ReasonBase {
	constructor(fiberId, annotations = constEmptyAnnotations) {
		super("Interrupt", annotations, "Interrupted");
		this.fiberId = fiberId;
	}
	toString() {
		return `Interrupt(${this.fiberId})`;
	}
	toJSON() {
		return {
			_tag: "Interrupt",
			fiberId: this.fiberId
		};
	}
	[symbol](that) {
		return isInterruptReason(that) && this.fiberId === that.fiberId && this.annotations === that.annotations;
	}
	[symbol$1]() {
		return string$1(`${this._tag}:${this.fiberId}`);
	}
};
const causeInterrupt = (fiberId) => new CauseImpl([new Interrupt(fiberId)]);
const findError = (self) => {
	for (let i = 0; i < self.reasons.length; i++) {
		const reason = self.reasons[i];
		if (reason._tag === "Fail") return succeed$4(reason.error);
	}
	return fail$5(self);
};
const hasInterrupts = (self) => self.reasons.some(isInterruptReason);
const hasInterruptsOnly$1 = (self) => self.reasons.length > 0 && self.reasons.every(isInterruptReason);
const causeMap = dual(2, (self, f) => {
	let hasFail = false;
	const failures = self.reasons.map((failure) => {
		if (isFailReason$1(failure)) {
			hasFail = true;
			return new Fail(f(failure.error), failure.annotations);
		}
		return failure;
	});
	return hasFail ? causeFromReasons(failures) : self;
});
const causeSquash = (self) => {
	let die;
	for (const reason of self.reasons) {
		if (reason._tag === "Fail") return reason.error;
		if (reason._tag === "Die") die ??= reason;
	}
	if (die !== void 0) return die.defect;
	if (self.reasons.length > 0) return new globalThis.Error("All fibers interrupted without error");
	return new globalThis.Error("Empty cause");
};
const causePrettyErrors = (self, options) => {
	const errors = [];
	const interrupts = [];
	if (self.reasons.length === 0) return errors;
	const prevStackLimit = getStackTraceLimit();
	if (prevStackLimit !== 0) setStackTraceLimit(1);
	try {
		for (const failure of self.reasons) {
			if (failure._tag === "Interrupt") {
				interrupts.push(failure);
				continue;
			}
			errors.push(causePrettyError(failure._tag === "Die" ? failure.defect : failure.error, failure.annotations, options));
		}
		if (errors.length === 0) {
			const cause = new Error("The fiber was interrupted by:");
			cause.name = "InterruptCause";
			cause.stack = interruptCauseStack(cause, interrupts);
			const error = new globalThis.Error("All fibers interrupted without error", { cause });
			error.name = "InterruptError";
			error.stack = `${error.name}: ${error.message}`;
			errors.push(causePrettyError(error, interrupts[0].annotations, options));
		}
	} finally {
		if (prevStackLimit !== 0) setStackTraceLimit(prevStackLimit);
	}
	return errors;
};
const causePrettyError = (original, annotations, options) => {
	const kind = typeof original;
	let error;
	if (original && kind === "object") {
		error = new globalThis.Error(causePrettyMessage(original), { cause: original.cause ? causePrettyError(original.cause) : void 0 });
		if (typeof original.name === "string") error.name = original.name;
		if (typeof original.stack === "string") error.stack = cleanErrorStack(original.stack, error, annotations);
		else {
			const stack = `${error.name}: ${error.message}`;
			error.stack = annotations ? addStackAnnotations(stack, annotations) : stack;
		}
		if (options?.includeCauseInStack) error.stack = renderPrettyError(error);
		for (const key of Object.keys(original)) if (!(key in error)) error[key] = original[key];
	} else {
		error = new globalThis.Error(!original ? `Unknown error: ${original}` : kind === "string" ? original : formatJson(original));
		const stack = `${error.name}: ${error.message}`;
		error.stack = annotations ? addStackAnnotations(stack, annotations) : stack;
	}
	return error;
};
const causePrettyMessage = (u) => {
	if (typeof u.message === "string") return u.message;
	else if (typeof u.toString === "function" && u.toString !== Object.prototype.toString && u.toString !== Array.prototype.toString) try {
		return u.toString();
	} catch {}
	return formatJson(u);
};
const locationRegExp = /\((.*)\)/g;
const cleanErrorStack = (stack, error, annotations) => {
	const message = `${error.name}: ${error.message}`;
	const lines = (stack.startsWith(message) ? stack.slice(message.length) : stack).split("\n");
	const out = [message];
	for (let i = 1; i < lines.length; i++) {
		if (/Generator\.next|~effect\/(?:Effect|Utils)/.test(lines[i])) break;
		out.push(lines[i]);
	}
	return annotations ? addStackAnnotations(out.join("\n"), annotations) : out.join("\n");
};
const addStackAnnotations = (stack, annotations) => {
	const frame = annotations?.get(StackTraceKey.key);
	if (frame) stack = `${stack}\n${currentStackTrace(frame)}`;
	return stack;
};
const interruptCauseStack = (error, interrupts) => {
	const out = [`${error.name}: ${error.message}`];
	for (const current of interrupts) {
		const fiberId = current.fiberId !== void 0 ? `#${current.fiberId}` : "unknown";
		const frame = current.annotations.get(InterruptorStackTrace.key);
		out.push(`    at fiber (${fiberId})`);
		if (frame) out.push(currentStackTrace(frame));
	}
	return out.join("\n");
};
const currentStackTrace = (frame) => {
	const out = [];
	let current = frame;
	let i = 0;
	while (current && i < 10) {
		const stack = current.stack();
		if (stack) {
			const locationMatchAll = stack.matchAll(locationRegExp);
			let match = false;
			for (const [, location] of locationMatchAll) {
				match = true;
				out.push(`    at ${current.name} (${location})`);
			}
			if (!match) out.push(`    at ${current.name} (${stack.replace(/^at /, "")})`);
		} else out.push(`    at ${current.name}`);
		current = current.parent;
		i++;
	}
	return out.join("\n");
};
const causePretty = (cause) => causePrettyErrors(cause).map(renderPrettyError).join("\n");
const renderPrettyError = (e) => e.cause ? `${e.stack} {\n${renderErrorCause(e.cause, "  ")}\n}` : e.stack;
const renderErrorCause = (cause, prefix) => {
	const lines = cause.stack.split("\n");
	let stack = `${prefix}[cause]: ${lines[0]}`;
	for (let i = 1, len = lines.length; i < len; i++) stack += `\n${prefix}${lines[i]}`;
	if (cause.cause) stack += ` {\n${renderErrorCause(cause.cause, `${prefix}  `)}\n${prefix}}`;
	return stack;
};
const FiberTypeId = "~effect/Fiber";
const fiberVariance = {
	_A: identity,
	_E: identity
};
const fiberIdStore = { id: 0 };
const AsyncResource = (() => {
	try {
		return globalThis.process?.getBuiltinModule?.("node:async_hooks")?.AsyncResource;
	} catch {
		return;
	}
})();
const captureAsyncContext = () => AsyncResource === void 0 ? void 0 : new AsyncResource("effect/Fiber");
const getCurrentFiber = () => globalThis[currentFiberTypeId];
var FiberImpl = class {
	constructor(context, interruptible = true) {
		this.setContext(context);
		this.id = ++fiberIdStore.id;
		this.currentOpCount = 0;
		this.interruptible = interruptible;
		this._stack = [];
		this._observers = void 0;
		this._exit = void 0;
		this._children = void 0;
		this._interruptedCause = void 0;
		this._yielded = void 0;
		this._running = false;
		this._deferredInterrupt = false;
		this._parent = void 0;
		this._asyncContext = void 0;
		this.cache.runtimeMetrics?.recordFiberStart(this.context);
	}
	get [FiberTypeId]() {
		return fiberVariance;
	}
	get currentDispatcher() {
		return this._dispatcher ??= this.cache.scheduler.makeDispatcher();
	}
	getRef(ref) {
		return get(this.context, ref);
	}
	addObserver(cb) {
		if (this._exit) {
			cb(this._exit);
			return constVoid;
		}
		if (this._observers === void 0) this._observers = [cb];
		else this._observers.push(cb);
		return () => this.removeObserver(cb);
	}
	removeObserver(cb) {
		if (this._exit || this._observers === void 0) return;
		const index = this._observers.indexOf(cb);
		if (index >= 0) this._observers.splice(index, 1);
	}
	interruptUnsafe(fiberId, annotations) {
		if (this._exit) return;
		let cause = causeInterrupt(fiberId);
		if (this.cache.stackFrame) cause = causeAnnotate(cause, make$13(StackTraceKey, this.cache.stackFrame));
		if (annotations) cause = causeAnnotate(cause, annotations);
		this._interruptedCause = this._interruptedCause ? causeAddInterrupts(this._interruptedCause, cause) : cause;
		if (this.interruptible) {
			if (this._running) this._deferredInterrupt = true;
			else this.evaluate(failCause$3(this._interruptedCause));
		}
	}
	pollUnsafe() {
		return this._exit;
	}
	evaluate(effect) {
		if (this._exit) return;
		else if (this._asyncContext !== void 0) {
			const asyncContext = this._asyncContext;
			this._asyncContext = void 0;
			return asyncContext.runInAsyncScope(this.evaluate, this, effect);
		} else if (this._yielded !== void 0) {
			const yielded = this._yielded;
			this._yielded = void 0;
			yielded();
		}
		const exit = this.runLoop(effect);
		if (exit === Yield) {
			this._asyncContext = captureAsyncContext();
			return;
		}
		const interruptChildren = fiberMiddleware.interruptChildren && fiberMiddleware.interruptChildren(this);
		if (interruptChildren !== void 0) return this.evaluate(flatMap$1(interruptChildren, () => exit));
		this._exit = exit;
		this.cache.runtimeMetrics?.recordFiberEnd(this.context, this._exit);
		if (this._parent) {
			this._parent._children?.delete(this);
			this._parent = void 0;
		}
		if (this._observers !== void 0) {
			const observers = this._observers;
			this._observers = void 0;
			for (let i = 0; i < observers.length; i++) observers[i](exit);
		}
		this._stack.length = 0;
		this._children = void 0;
		this.context = empty$1();
	}
	runLoop(effect) {
		const prevFiber = globalThis[currentFiberTypeId];
		globalThis[currentFiberTypeId] = this;
		const prevRunning = this._running;
		this._running = true;
		let yielding = false;
		let current = effect;
		this.currentOpCount = 0;
		try {
			while (true) try {
				if (this._deferredInterrupt) {
					this._deferredInterrupt = false;
					current = failCause$3(this._interruptedCause);
				}
				this.currentOpCount++;
				const cache = this.cache;
				if (!yielding && !cache.preventYield && cache.scheduler.shouldYield(this)) {
					yielding = true;
					const prev = current;
					current = flatMap$1(yieldNow, () => prev);
				}
				current = cache.tracerContext ? cache.tracerContext(current, this) : current[evaluate](this);
				if (current === Yield) {
					const yielded = this._yielded;
					if ("~effect/Exit" in yielded) {
						this._deferredInterrupt = false;
						this._yielded = void 0;
						return yielded;
					} else if (this._deferredInterrupt) {
						this._yielded = void 0;
						yielded();
						continue;
					}
					return Yield;
				}
			} catch (error) {
				if (!hasProperty(current, "~effect/Effect/evaluate")) return exitDie(`Fiber.runLoop: Not a valid effect: ${String(current)}`);
				current = exitDie(error);
			}
		} finally {
			this._running = prevRunning;
			globalThis[currentFiberTypeId] = prevFiber;
		}
	}
	getCont(symbol) {
		if (this._deferredInterrupt) {
			this._deferredInterrupt = false;
			return deferredInterruptCont;
		}
		while (true) {
			const op = this._stack.pop();
			if (!op) return void 0;
			const all = op[contAll];
			if (all !== void 0) {
				const cont = all.call(op, this);
				if (cont) {
					cont[symbol] = cont;
					return cont;
				}
			}
			if (op[symbol]) return op;
		}
	}
	succeedWith(value) {
		if ((++this.currentOpCount & maxInlineSteps - 1) === 0) return exitSucceed(value);
		const cont = this.getCont(contA);
		return cont ? cont[contA](value, this) : this.yieldWith(exitSucceed(value));
	}
	yieldWith(value) {
		this._yielded = value;
		return Yield;
	}
	children() {
		return this._children ??= new Set();
	}
	pipe() {
		return pipeArguments(this, arguments);
	}
	setContext(context) {
		const previous = this.context;
		this.context = context;
		if (previous !== void 0 && hasSameCache(previous, context)) return;
		const root = context.cacheRoot;
		const cache = root._fiberCache ??= makeFiberContextCache(context);
		if (this.cache?.scheduler !== cache.scheduler) this._dispatcher = void 0;
		this.cache = cache;
	}
	get currentSpanLocal() {
		const span = this.cache.span;
		return span?._tag === "Span" ? span : void 0;
	}
};
const makeFiberContextCache = (context) => {
	const currentTracer = getOrUndefinedUnsafe(context, TracerKey);
	return {
		scheduler: get(context, Scheduler),
		tracer: currentTracer,
		tracerContext: currentTracer ? currentTracer["context"] : void 0,
		tracerEnabled: get(context, TracerEnabled),
		span: getOrUndefinedUnsafe(context, ParentSpanKey),
		logLevel: get(context, CurrentLogLevel),
		minimumLogLevel: get(context, MinimumLogLevel),
		stackFrame: get(context, CurrentStackFrame),
		runtimeMetrics: getOrUndefinedUnsafe(context, FiberRuntimeMetricsKey),
		maxOpsBeforeYield: get(context, MaxOpsBeforeYield),
		preventYield: get(context, PreventSchedulerYield)
	};
};
const deferredInterruptCont = {
	[contA](_value, fiber) {
		return failCause$3(fiber._interruptedCause);
	},
	[contE](_cause, fiber) {
		return failCause$3(fiber._interruptedCause);
	}
};
const maxInlineSteps = 32;
const fiberMiddleware = { interruptChildren: void 0 };
const fiberStackAnnotations = (fiber) => {
	if (!fiber.cache.stackFrame) return void 0;
	const annotations = new Map();
	annotations.set(InterruptorStackTrace.key, fiber.cache.stackFrame);
	return makeUnsafe$4(annotations);
};
const fiberAwait = (self) => {
	const impl = self;
	if (impl._exit) return succeed$3(impl._exit);
	return callback$2((resume) => {
		if (impl._exit) return resume(succeed$3(impl._exit));
		return sync$1(self.addObserver((exit) => resume(succeed$3(exit))));
	});
};
const fiberAwaitAll = (self) => callback$2((resume) => {
	const iter = self[Symbol.iterator]();
	const exits = [];
	let cancel = void 0;
	function loop() {
		let result = iter.next();
		while (!result.done) {
			if (result.value._exit) {
				exits.push(result.value._exit);
				result = iter.next();
				continue;
			}
			cancel = result.value.addObserver((exit) => {
				exits.push(exit);
				loop();
			});
			return;
		}
		resume(succeed$3(exits));
	}
	loop();
	return sync$1(() => cancel?.());
});
const fiberInterrupt = (self) => withFiber((fiber) => fiberInterruptAs(self, fiber.id));
const fiberInterruptAs = dual((args) => hasProperty(args[0], FiberTypeId), (self, fiberId, annotations) => withFiber((parent) => {
	let ann = fiberStackAnnotations(parent);
	ann = ann && annotations ? merge(ann, annotations) : ann ?? annotations;
	self.interruptUnsafe(fiberId, ann);
	return asVoid(fiberAwait(self));
}));
const fiberInterruptAll = (fibers) => withFiber((parent) => {
	const annotations = fiberStackAnnotations(parent);
	let fiberArr = empty();
	for (const fiber of fibers) {
		fiber.interruptUnsafe(parent.id, annotations);
		fiberArr.push(fiber);
	}
	return asVoid(fiberAwaitAll(fiberArr));
});
const succeed$3 = exitSucceed;
const failCause$3 = exitFailCause;
const fail$4 = exitFail;
const sync$1 = makePrimitive({
	op: "Sync",
	[evaluate](fiber) {
		const value = this[args]();
		const cont = fiber.getCont(contA);
		return cont ? cont[contA](value, fiber) : fiber.yieldWith(exitSucceed(value));
	}
});
const suspend$1 = makePrimitive({
	op: "Suspend",
	[evaluate](_fiber) {
		return this[args]();
	}
});
const fromResult$1 = match$2({
	onFailure: fail$4,
	onSuccess: succeed$3
});
const yieldNow = makePrimitive({
	op: "Yield",
	[evaluate](fiber) {
		let resumed = false;
		fiber.currentDispatcher.scheduleTask(() => {
			if (resumed) return;
			fiber.evaluate(exitVoid);
		}, this["~effect/Effect/args"] ?? 0);
		return fiber.yieldWith(() => {
			resumed = true;
		});
	}
})(0);
const failCauseSync$1 = (evaluate) => suspend$1(() => failCause$3(evaluate()));
const die$2 = (defect) => exitDie(defect);
const failSync = (error) => suspend$1(() => fail$4(error()));
const void_$2 = succeed$3(void 0);
const try_$1 = (options) => {
	const evaluate = typeof options === "function" ? options : options.try;
	const catcher = typeof options === "function" ? (cause) => new UnknownError(cause, "An error occurred in Effect.try") : options.catch;
	return suspend$1(() => {
		try {
			return succeed$3(evaluate());
		} catch (err) {
			return fail$4(catcher(err));
		}
	});
};
const promise$1 = (evaluate) => callbackOptions(function(resume, signal) {
	evaluate(signal).then((a) => resume(succeed$3(a)), (e) => resume(die$2(e)));
}, evaluate.length !== 0);
const tryPromise$1 = (options) => {
	const f = typeof options === "function" ? options : options.try;
	const catcher = typeof options === "function" ? (cause) => new UnknownError(cause, "An error occurred in Effect.tryPromise") : options.catch;
	return callbackOptions(function(resume, signal) {
		const failWithCatch = (cause) => suspend$1(() => {
			try {
				return fail$4(internalCall(() => catcher(cause)));
			} catch (err) {
				return die$2(err);
			}
		});
		try {
			f(signal).then((a) => resume(succeed$3(a)), (e) => resume(failWithCatch(e)));
		} catch (err) {
			resume(failWithCatch(err));
		}
	}, f.length !== 0);
};
const withFiberId = (f) => withFiber((fiber) => f(fiber.id));
const callbackOptions = function() {
	const Proto = makePrimitiveProto({
		op: "Async",
		[evaluate](fiber) {
			let resumed = false;
			let yielded = false;
			const controller = this.withSignal ? new AbortController() : void 0;
			const onCancel = this.register.call(fiber.cache.scheduler, (effect) => {
				if (resumed) return;
				resumed = true;
				if (yielded) fiber.evaluate(effect);
				else yielded = effect;
			}, controller?.signal);
			if (yielded !== false) return yielded;
			yielded = true;
			fiber._yielded = () => {
				resumed = true;
			};
			if (controller === void 0 && onCancel === void 0) return Yield;
			fiber._stack.push(asyncFinalizer(() => {
				resumed = true;
				controller?.abort();
				return onCancel ?? exitVoid;
			}));
			return Yield;
		}
	});
	const AsyncImpl = function(register, withSignal) {
		this.register = register;
		this.withSignal = withSignal;
	};
	AsyncImpl.prototype = Proto;
	return function(register, withSignal) {
		return new AsyncImpl(register, withSignal);
	};
}();
const asyncFinalizer = makePrimitive({
	op: "AsyncFinalizer",
	[contAll](fiber) {
		if (fiber.interruptible) {
			fiber.interruptible = false;
			fiber._stack.push(setInterruptibleTrue);
		}
	},
	[contE](cause, _fiber) {
		return hasInterrupts(cause) ? flatMap$1(combineFinalizerCause(exitFailCause(cause), this[args]()), () => failCause$3(cause)) : failCause$3(cause);
	}
});
const callback$2 = (register) => callbackOptions(register, register.length >= 2);
const never = callback$2(constVoid);
const gen$1 = (...args) => {
	if (args.length === 1) {
		const body = args[0];
		return suspend$1(() => fromIteratorUnsafe(body()));
	}
	const [options, body] = args;
	return suspend$1(() => fromIteratorUnsafe(body.call(options.self)));
};
const fnUntraced$1 = (body, ...pipeables) => {
	const fn = pipeables.length === 0 ? function() {
		return suspend$1(() => fromIteratorUnsafe(body.apply(this, arguments)));
	} : function() {
		let effect = suspend$1(() => fromIteratorUnsafe(body.apply(this, arguments)));
		for (let i = 0; i < pipeables.length; i++) effect = pipeables[i](effect, ...arguments);
		return effect;
	};
	return defineFunctionLength(body.length, fn);
};
const defineFunctionLength = (length, fn) => Object.defineProperty(fn, "length", {
	value: length,
	configurable: true
});
const fnStackCleaner = makeStackCleaner(2);
const fn$1 = function() {
	const nameFirst = typeof arguments[0] === "string";
	const name = nameFirst ? arguments[0] : "Effect.fn";
	const spanOptions = nameFirst ? arguments[1] : void 0;
	const prevLimit = getStackTraceLimit();
	let defError;
	if (prevLimit !== 0) {
		setStackTraceLimit(2);
		defError = new globalThis.Error();
		setStackTraceLimit(prevLimit);
	}
	if (nameFirst) return (body, ...pipeables) => makeFn(name, body, defError, pipeables, nameFirst, spanOptions);
	return makeFn(name, arguments[0], defError, Array.prototype.slice.call(arguments, 1), nameFirst, spanOptions);
};
const makeFn = (name, bodyOrOptions, defError, pipeables, addSpan, spanOptions) => {
	const body = typeof bodyOrOptions === "function" ? bodyOrOptions : pipeables.shift().bind(bodyOrOptions.self);
	const definitionName = `${name} (definition)`;
	const definitionStack = defError ? fnStackCleaner(() => defError.stack) : constUndefined;
	return defineFunctionLength(body.length, function(...args) {
		let result = suspend$1(() => {
			const iter = body.apply(this, arguments);
			return isEffect$1(iter) ? iter : fromIteratorUnsafe(iter);
		});
		for (let i = 0; i < pipeables.length; i++) result = pipeables[i](result, ...args);
		if (!isEffect$1(result)) return result;
		const prevLimit = getStackTraceLimit();
		let callError;
		if (prevLimit !== 0) {
			setStackTraceLimit(2);
			callError = new globalThis.Error();
			setStackTraceLimit(prevLimit);
		}
		return updateService(addSpan ? useSpan(name, spanOptions, (span) => provideParentSpan(result, span)) : result, CurrentStackFrame, (prev) => ({
			name,
			stack: callError ? fnStackCleaner(() => callError.stack) : constUndefined,
			parent: {
				name: definitionName,
				stack: definitionStack,
				parent: prev
			}
		}));
	});
};
const fnUntracedEager$1 = (body, ...pipeables) => defineFunctionLength(body.length, pipeables.length === 0 ? function() {
	return fromIteratorEagerUnsafe(() => body.apply(this, arguments));
} : function() {
	let effect = fromIteratorEagerUnsafe(() => body.apply(this, arguments));
	for (const pipeable of pipeables) effect = pipeable(effect, ...arguments);
	return effect;
});
const fromIteratorEagerUnsafe = (evaluate) => {
	try {
		const iterator = evaluate();
		let value = void 0;
		while (true) {
			const state = iterator.next(value);
			if (state.done) return succeed$3(state.value);
			const primitive = state.value;
			if (primitive && primitive._tag === "Success") {
				value = primitive.value;
				continue;
			} else if (primitive && primitive._tag === "Failure") return state.value;
			else {
				let isFirstExecution = true;
				return suspend$1(() => {
					if (isFirstExecution) {
						isFirstExecution = false;
						return flatMap$1(state.value, (value) => fromIteratorUnsafe(iterator, value));
					} else return suspend$1(() => fromIteratorUnsafe(evaluate()));
				});
			}
		}
	} catch (error) {
		return die$2(error);
	}
};
const fromIteratorUnsafe = function() {
	const Proto = makePrimitiveProto({
		op: "Iterator",
		[contA](value, fiber) {
			const iter = this.iterator;
			while (true) {
				const state = iter.next(value);
				if (state.done) return succeed$3(state.value);
				if (!effectIsExit(state.value)) {
					fiber._stack.push(this);
					return state.value;
				} else if (state.value._tag === "Failure") return state.value;
				value = state.value.value;
			}
		},
		[evaluate](fiber) {
			return this[contA](this.initial, fiber);
		}
	});
	const IteratorImpl = function(iterator, initial) {
		this.iterator = iterator;
		this.initial = initial;
	};
	IteratorImpl.prototype = Proto;
	return function(iterator, initial) {
		return new IteratorImpl(iterator, initial);
	};
}();
const as$1 = dual(2, (self, value) => new ContImpl(self, returnPayload, succeed$3(value)));
const evaluateCont = function(fiber) {
	fiber._stack.push(this);
	return this[args];
};
const OnSuccessProto = makePrimitiveProto({
	op: "OnSuccess",
	[evaluate]: evaluateCont
});
const ContImpl = function(self, cont, payload) {
	this[args] = self;
	this[contA] = cont;
	this.payload = payload;
};
ContImpl.prototype = OnSuccessProto;
const returnPayload = function() {
	return this.payload;
};
const succeedPayload = function(_value, fiber) {
	return fiber.succeedWith(this.payload);
};
const continuationMarksStack = (() => {
	const limit = getStackTraceLimit();
	if (limit === 0) return false;
	const marker = "~effect/Effect/stackProbe";
	const probe = { [marker]: function stackProbe() {
		return new Error();
	} };
	setStackTraceLimit(1);
	const error = probe[marker]();
	setStackTraceLimit(limit);
	return error.stack?.includes("[as " + marker + "]") === true;
})();
const mapCont = function(value, fiber) {
	const f = this.payload;
	return fiber.succeedWith(continuationMarksStack ? f(value) : internalCall(() => f(value)));
};
const andThenCont = function(value) {
	const f = this.payload;
	return f(value);
};
const tapCont = function(value) {
	const f = this.payload;
	return new ContImpl(f(value), succeedPayload, value);
};
const tapEffectCont = function(value) {
	return new ContImpl(this.payload, succeedPayload, value);
};
const andThen = dual(2, (self, f) => new ContImpl(self, isEffect$1(f) ? returnPayload : andThenCont, f));
const tap$1 = dual(2, (self, f) => new ContImpl(self, isEffect$1(f) ? tapEffectCont : tapCont, f));
const asVoid = (self) => new ContImpl(self, returnPayload, exitVoid);
const flatMap$1 = dual(2, (self, f) => new ContImpl(self, andThenCont, f));
const effectIsExit = (effect) => effect[ExitTypeId] !== void 0;
const flatMapEager$1 = dual(2, (self, f) => {
	if (effectIsExit(self)) return self._tag === "Success" ? f(self.value) : self;
	return flatMap$1(self, f);
});
const map$2 = dual(2, (self, f) => new ContImpl(self, mapCont, f));
const mapEager$1 = dual(2, (self, f) => effectIsExit(self) ? exitMap(self, f) : map$2(self, f));
const mapErrorEager$1 = dual(2, (self, f) => effectIsExit(self) ? exitMapError(self, f) : mapError$1(self, f));
const exitInterrupt$1 = (fiberId) => exitFailCause(causeInterrupt(fiberId));
const exitIsSuccess = (self) => self._tag === "Success";
const exitVoid = exitSucceed(void 0);
const exitMap = dual(2, (self, f) => self._tag === "Success" ? exitSucceed(f(self.value)) : self);
const exitMapError = dual(2, (self, f) => {
	if (self._tag === "Success") return self;
	const error = findError(self.cause);
	if (isFailure(error)) return self;
	return exitFail(f(error.success));
});
const exitZipRight = dual(2, (self, that) => exitIsSuccess(self) ? that : self);
const exitAsVoidAll = (exits) => {
	const failures = [];
	for (const exit of exits) if (exit._tag === "Failure") failures.push(...exit.cause.reasons);
	return failures.length === 0 ? exitVoid : exitFailCause(causeFromReasons(failures));
};
const serviceOption$1 = (service) => withFiber((fiber) => succeed$3(getOption(fiber.context, service)));
const updateContext = dual(2, (self, f) => withFiber((fiber) => {
	const prevContext = fiber.context;
	const nextContext = f(prevContext);
	if (prevContext === nextContext) return self;
	fiber.setContext(nextContext);
	onExitUnsafe(fiber, () => {
		fiber.setContext(prevContext);
	});
	return self;
}));
const updateService = dual(3, (self, service, f) => updateContext(self, (s) => {
	const prev = getUnsafe(s, service);
	const next = f(prev);
	if (prev === next) return s;
	return add(s, service, next);
}));
const contextWith = (f) => withFiber((fiber) => f(fiber.context));
const provideContext = dual(2, (self, context) => {
	if (effectIsExit(self)) return self;
	return updateContext(self, merge(context));
});
const provideService = function() {
	if (arguments.length === 1) return dual(2, (self, impl) => provideServiceImpl(self, arguments[0], impl));
	return dual(3, (self, service, impl) => provideServiceImpl(self, service, impl)).apply(this, arguments);
};
const provideServiceImpl = (self, service, implementation) => updateContext(self, add(service, implementation));
const forever$1 = dual((args) => isEffect$1(args[0]), (self, options) => whileLoop({
	while: constTrue,
	body: constant(options?.disableYield ? self : flatMap$1(self, (_) => yieldNow)),
	step: constVoid
}));
const catchCause$1 = dual(2, (self, f) => new OnFailureImpl(self, f.length !== 1 ? (cause) => f(cause) : f));
const OnFailureProto = makePrimitiveProto({
	op: "OnFailure",
	[evaluate]: evaluateCont
});
const OnFailureImpl = function(self, f) {
	this[args] = self;
	this[contE] = f;
};
OnFailureImpl.prototype = OnFailureProto;
const catchCauseFilter = dual(3, (self, filter, f) => catchCause$1(self, (cause) => {
	const eb = filter(cause);
	return isFailure(eb) ? failCause$3(eb.failure) : f(eb.success, cause);
}));
const catch_ = dual(2, (self, f) => catchCauseFilter(self, findError, (e) => f(e)));
const tapCause$1 = dual(2, (self, f) => catchCause$1(self, (cause) => andThen(f(cause), failCause$3(cause))));
const tapCauseFilter = dual(3, (self, filter, f) => catchCause$1(self, (cause) => {
	const result = filter(cause);
	if (isFailure(result)) return failCause$3(cause);
	return andThen(f(result.success, cause), failCause$3(cause));
}));
const tapError$1 = dual(2, (self, f) => tapCauseFilter(self, findError, (e) => f(e)));
const catchIf = dual((args) => isEffect$1(args[0]), (self, predicate, f, orElse) => catchCause$1(self, (cause) => {
	const error = findError(cause);
	if (isFailure(error)) return failCause$3(error.failure);
	if (!predicate(error.success)) return orElse ? orElse(error.success) : failCause$3(cause);
	return f(error.success);
}));
const catchTag$1 = dual((args) => isEffect$1(args[0]), (self, k, f, orElse) => {
	const pred = Array.isArray(k) ? (e) => hasProperty(e, "_tag") && k.includes(e._tag) : isTagged(k);
	return catchIf(self, pred, f, orElse);
});
const mapError$1 = dual(2, (self, f) => catch_(self, (error) => failSync(() => f(error))));
const orDie$1 = (self) => catch_(self, die$2);
const result$1 = (self) => matchEager(self, {
	onFailure: fail$5,
	onSuccess: succeed$4
});
const matchCauseEffect = dual(2, (self, options) => new OnSuccessAndFailureImpl(self, options.onSuccess.length !== 1 ? (a) => options.onSuccess(a) : options.onSuccess, options.onFailure.length !== 1 ? (cause) => options.onFailure(cause) : options.onFailure));
const OnSuccessAndFailureProto = makePrimitiveProto({
	op: "OnSuccessAndFailure",
	[evaluate]: evaluateCont
});
const OnSuccessAndFailureImpl = function(self, onSuccess, onFailure) {
	this[args] = self;
	this[contA] = onSuccess;
	this[contE] = onFailure;
};
OnSuccessAndFailureImpl.prototype = OnSuccessAndFailureProto;
const matchSuccess = function(value, fiber) {
	const handlers = this.payload;
	return fiber.succeedWith(continuationMarksStack ? handlers.onSuccess(value) : internalCall(() => handlers.onSuccess(value)));
};
const makeMatch = (op, onFailure) => {
	const Proto = makePrimitiveProto({
		op,
		[evaluate]: evaluateCont,
		[contA]: matchSuccess,
		[contE]: onFailure
	});
	const MatchImpl = function(self, handlers) {
		this[args] = self;
		this.payload = handlers;
	};
	MatchImpl.prototype = Proto;
	return MatchImpl;
};
const MatchImpl = makeMatch("Match", function(cause, fiber) {
	const fail = cause.reasons.find(isFailReason$1);
	if (fail === void 0) return failCause$3(cause);
	const handlers = this.payload;
	return fiber.succeedWith(continuationMarksStack ? handlers.onFailure(fail.error) : internalCall(() => handlers.onFailure(fail.error)));
});
const matchEffect$1 = dual(2, (self, options) => matchCauseEffect(self, {
	onFailure: (cause) => {
		const fail = cause.reasons.find(isFailReason$1);
		return fail ? options.onFailure(fail.error) : failCause$3(cause);
	},
	onSuccess: options.onSuccess
}));
const match = dual(2, (self, options) => new MatchImpl(self, options));
const matchEager = dual(2, (self, options) => {
	if (effectIsExit(self)) {
		if (self._tag === "Success") return exitSucceed(options.onSuccess(self.value));
		const error = findError(self.cause);
		if (isFailure(error)) return self;
		return exitSucceed(options.onFailure(error.success));
	}
	return match(self, options);
});
const exit$1 = (self) => effectIsExit(self) ? exitSucceed(self) : exitPrimitive(self);
const exitPrimitive = makePrimitive({
	op: "Exit",
	[evaluate](fiber) {
		fiber._stack.push(this);
		return this[args];
	},
	[contA](value, fiber, exit) {
		return fiber.succeedWith(exit ?? exitSucceed(value));
	},
	[contE](cause, fiber, exit) {
		return fiber.succeedWith(exit ?? exitFailCause(cause));
	}
});
const ScopeTypeId = "~effect/Scope";
const ScopeCloseableTypeId = "~effect/Scope/Closeable";
const scopeTag = Service("effect/Scope");
const scopeClose = (self, exit_) => withFiber((fiber) => {
	fiberEnterUninterruptibleUnsafe(fiber);
	return scopeCloseUnsafe(self, exit_) ?? void_$2;
});
const scopeCloseUnsafe = (self, exit_) => {
	const state = self.state;
	if (state._tag === "Closed") return;
	self.state = {
		_tag: "Closed",
		exit: exit_
	};
	if (self.parent !== void 0) scopeRemoveFinalizerUnsafe(self.parent, self);
	if (state._tag === "Empty") return;
	if (state.finalizer !== void 0) return runFinalizer(state.finalizer, exit_);
	const finalizers = state.finalizers;
	if (finalizers.size === 1) return runFinalizer(finalizers.values().next().value, exit_);
	return scopeCloseFinalizers(self, finalizers, exit_);
};
const runFinalizer = (finalizer, exit_) => {
	try {
		return finalizer(exit_);
	} catch (defect) {
		return exitDie(defect);
	}
};
const combineFinalizerCause = (exit_, finalizer) => exitIsSuccess(exit_) ? finalizer : catchCause$1(finalizer, (cause) => failCause$3(causeCombine(exit_.cause, cause)));
const scopeCloseFinalizers = fnUntraced$1(function* (self, finalizers, exit_) {
	let exits = [];
	const fibers = [];
	const arr = Array.from(finalizers.values());
	const parent = getCurrentFiber();
	for (let i = arr.length - 1; i >= 0; i--) {
		const finalizer = arr[i];
		if (self.strategy === "sequential") exits.push(yield* exit$1(runFinalizer(finalizer, exit_)));
		else fibers.push(forkUnsafe$1(parent, runFinalizer(finalizer, exit_), true, true, "inherit"));
	}
	if (fibers.length > 0) exits = yield* fiberAwaitAll(fibers);
	return yield* exitAsVoidAll(exits);
});
const scopeForkUnsafe = (scope, finalizerStrategy) => {
	const child = makeScope(finalizerStrategy, scope);
	if (scope.state._tag === "Closed") {
		child.state = scope.state;
		return child;
	}
	scopeAddFinalizerUnsafe(scope, child, (exit) => scopeClose(child, exit));
	return child;
};
const scopeAddFinalizerExit = (scope, finalizer) => {
	return suspend$1(() => {
		if (scope.state._tag === "Closed") return finalizer(scope.state.exit);
		scopeAddFinalizerUnsafe(scope, {}, finalizer);
		return void_$2;
	});
};
const scopeAddFinalizer = (scope, finalizer) => scopeAddFinalizerExit(scope, constant(finalizer));
const scopeAddFinalizerUnsafe = (scope, key, finalizer) => {
	if (scope.state._tag === "Empty") scope.state = {
		_tag: "Open",
		finalizerKey: key,
		finalizer,
		finalizers: void 0
	};
	else if (scope.state._tag === "Open") {
		const state = scope.state;
		if (state.finalizer !== void 0) {
			state.finalizers = new Map([[state.finalizerKey, state.finalizer]]);
			state.finalizerKey = void 0;
			state.finalizer = void 0;
			state.finalizers.set(key, finalizer);
		} else state.finalizers.set(key, finalizer);
	}
};
const scopeRemoveFinalizerUnsafe = (scope, key) => {
	if (scope.state._tag !== "Open") return;
	const state = scope.state;
	if (state.finalizerKey === key) scope.state = constScopeEmpty;
	else if (state.finalizers !== void 0) {
		state.finalizers.delete(key);
		if (state.finalizers.size === 0) scope.state = constScopeEmpty;
	}
};
const scopeMakeUnsafe = (finalizerStrategy) => makeScope(finalizerStrategy, void 0);
const makeScope = (finalizerStrategy = "sequential", parent) => ({
	[ScopeCloseableTypeId]: ScopeCloseableTypeId,
	[ScopeTypeId]: ScopeTypeId,
	strategy: finalizerStrategy,
	parent,
	state: constScopeEmpty
});
const constScopeEmpty = { _tag: "Empty" };
const scope = scopeTag;
const provideScope = provideService(scopeTag);
const scoped$1 = (self) => withFiber((fiber) => {
	const prev = fiber.context;
	const scope = scopeMakeUnsafe();
	fiber.setContext(add(fiber.context, scopeTag, scope));
	onExitUnsafe(fiber, (exit) => {
		fiber.setContext(prev);
		return scopeCloseUnsafe(scope, exit);
	});
	return self;
});
const scopedWith = (f) => suspend$1(() => {
	const scope = scopeMakeUnsafe();
	return onExit(f(scope), (exit) => suspend$1(() => scopeCloseUnsafe(scope, exit) ?? void_$2));
});
const acquireRelease$1 = (acquire, release, options) => contextWith((context) => uninterruptibleMask((restore) => flatMap$1(scope, (scope) => tap$1(options?.interruptible ? restore(acquire) : acquire, (a) => scopeAddFinalizerExit(scope, (exit) => provideContext(release(a, exit), context))))));
const OnExitImpl = function() {
	const Proto = makePrimitiveProto({
		op: "OnExit",
		[evaluate](fiber) {
			fiber._stack.push(this);
			return this.effect;
		},
		[contAll](fiber) {
			if (fiber.interruptible && this.interruptible !== true) {
				fiber._stack.push(setInterruptibleTrue);
				fiber.interruptible = false;
			}
		},
		[contA](value, _, exit) {
			exit ??= exitSucceed(value);
			let eff;
			try {
				eff = this.onExit(exit);
			} catch (defect) {
				eff = exitDie(defect);
			}
			return eff ? flatMap$1(eff, (_) => exit) : exit;
		},
		[contE](cause, _, exit) {
			exit ??= exitFailCause(cause);
			let eff;
			try {
				eff = this.onExit(exit);
			} catch (defect) {
				eff = exitDie(defect);
			}
			return eff ? flatMap$1(combineFinalizerCause(exit, eff), (_) => exit) : exit;
		}
	});
	const OnExitImpl = function(effect, onExit, interruptible) {
		this.effect = effect;
		this.onExit = onExit;
		this.interruptible = interruptible;
	};
	OnExitImpl.prototype = Proto;
	return OnExitImpl;
}();
const onExitPrimitive = (effect, onExit, interruptible) => new OnExitImpl(effect, onExit, interruptible);
const onExitUnsafe = (fiber, f) => {
	fiber._stack.push(new OnExitImpl(void 0, f, void 0));
};
const onExit = dual(2, onExitPrimitive);
const uninterruptible = (self) => withFiber((fiber) => {
	if (!fiber.interruptible) return self;
	fiber.interruptible = false;
	fiber._stack.push(setInterruptibleTrue);
	return self;
});
const setInterruptible = makePrimitive({
	op: "SetInterruptible",
	[contAll](fiber) {
		fiber.interruptible = this[args];
		if (fiber._interruptedCause && fiber.interruptible) return () => failCause$3(fiber._interruptedCause);
	}
});
const setInterruptibleTrue = setInterruptible(true);
const setInterruptibleFalse = setInterruptible(false);
const setFiberInterruptible = (fiber) => {
	fiber.interruptible = true;
	fiber._stack.push(setInterruptibleFalse);
	if (fiber._interruptedCause) return failCause$3(fiber._interruptedCause);
};
const fiberEnterUninterruptibleUnsafe = (fiber) => {
	const impl = fiber;
	if (!impl.interruptible) return;
	impl.interruptible = false;
	impl._stack.push(setInterruptibleTrue);
};
const interruptible = (self) => withFiber((fiber) => {
	if (fiber.interruptible) return self;
	return setFiberInterruptible(fiber) ?? self;
});
const uninterruptibleMask = (f) => withFiber((fiber) => {
	if (!fiber.interruptible) return f(identity);
	fiber.interruptible = false;
	fiber._stack.push(setInterruptibleTrue);
	return f(interruptible);
});
const all$1 = (arg, options) => {
	if (isIterable(arg)) return options?.mode === "result" ? forEach$2(arg, result$1, options) : forEach$2(arg, identity, options);
	else if (options?.discard) return options.mode === "result" ? forEach$2(Object.values(arg), result$1, options) : forEach$2(Object.values(arg), identity, options);
	return suspend$1(() => {
		const out = {};
		return as$1(forEach$2(Object.entries(arg), ([key, effect]) => map$2(options?.mode === "result" ? result$1(effect) : effect, (value) => {
			assignProperty(out, key, value);
		}), {
			discard: true,
			concurrency: options?.concurrency
		}), out);
	});
};
const whileLoop = makePrimitive({
	op: "While",
	[contA](value, fiber) {
		this[args].step(value);
		if (this["~effect/Effect/args"].while()) {
			fiber._stack.push(this);
			return this[args].body();
		}
		return exitVoid;
	},
	[evaluate](fiber) {
		if (this["~effect/Effect/args"].while()) {
			fiber._stack.push(this);
			return this[args].body();
		}
		return exitVoid;
	}
});
const forEach$2 = dual((args) => typeof args[1] === "function", (iterable, f, options) => suspend$1(() => {
	const concurrency = resolveConcurrency(options?.concurrency);
	if (concurrency === 1) return forEachSequential(iterable, f, options);
	const items = fromIterable$1(iterable);
	let length = items.length;
	if (length === 0) return options?.discard ? void_$2 : succeed$3([]);
	const out = options?.discard ? void 0 : new Array(length);
	const eff = forEachConcurrent({
		f,
		out
	}, items, { concurrency });
	return eff ? as$1(eff, out) : succeed$3(out);
}));
const forEachSequential = (iterable, f, options) => suspend$1(() => {
	const out = options?.discard ? void 0 : [];
	const iterator = iterable[Symbol.iterator]();
	let state = iterator.next();
	let index = 0;
	return as$1(whileLoop({
		while: () => !state.done,
		body: () => f(state.value, index++),
		step: (b) => {
			if (out) out.push(b);
			state = iterator.next();
		}
	}), out);
});
const resolveConcurrency = (concurrency) => concurrency === "unbounded" ? Number.POSITIVE_INFINITY : Math.max(1, concurrency ?? 1);
const iterateEager = () => (options) => {
	const onItem = options.onItem;
	const step = options.step;
	const resumeSequential = (state, items, index, end, effect) => flatMap$1(exit$1(effect), (itemExit) => step(state, items[index], itemExit, index) ?? runSequential(state, items, index + 1, end) ?? void_$2);
	const runSequential = (state, items, index = 0, end = items.length) => {
		for (; index < end; index++) {
			const item = items[index];
			const effect = onItem(state, item, index);
			if (!effectIsExit(effect)) return resumeSequential(state, items, index, end, effect);
			const terminal = step(state, item, effect, index);
			if (terminal) return terminal._tag === "Failure" ? terminal : void 0;
		}
	};
	return runSequential;
};
const iterateConcurrentImpl = (options) => {
	const onItem = options.onItem;
	const step = options.step;
	return (state, items, opts) => {
		let index = 0;
		const end = opts.end ?? items.length;
		const concurrency = opts.concurrency;
		let done = false;
		let parentFiber;
		let fibers;
		let resume;
		let terminal;
		let effect;
		const failDefect = (error) => {
			const defect = exitDie(error);
			terminal = defect;
			done = true;
			return fibers && fibers.size > 0 ? flatMap$1(uninterruptible(fiberInterruptAll(Array.from(fibers))), () => terminal ?? defect) : defect;
		};
		const go = () => {
			let paused = false;
			for (; !terminal && index < end; index++) {
				const item = items[index];
				const eff = effect ?? onItem(state, item, index);
				if (effectIsExit(eff)) {
					terminal = step(state, item, eff, index);
					if (terminal) break;
				} else if (!parentFiber) return callback$2((cb) => {
					parentFiber = getCurrentFiber();
					fibers = new Set();
					effect = eff;
					resume = cb;
					let result;
					try {
						result = go();
					} catch (error) {
						return cb(failDefect(error));
					}
					if (result) return cb(result);
					return suspend$1(() => {
						terminal ??= exitVoid;
						return flatMap$1(fibers ? fiberInterruptAll(fibers) : void_$2, () => terminal?._tag === "Failure" ? terminal : void_$2);
					});
				});
				else {
					effect = void 0;
					const fiber = forkUnsafe$1(parentFiber, eff, true, true, "inherit");
					if (fiber._exit) {
						terminal = step(state, item, fiber._exit, index);
						if (terminal) break;
						continue;
					}
					fibers.add(fiber);
					const currentIndex = index;
					fiber.addObserver((exit) => {
						fibers.delete(fiber);
						try {
							if (terminal) {
								if (exit._tag === "Failure") {
									const reasons = exit.cause.reasons.filter((reason) => reason._tag !== "Interrupt");
									if (reasons.length > 0) {
										const cause = causeFromReasons(reasons);
										terminal = exitFailCause(terminal._tag === "Failure" ? causeCombine(terminal.cause, cause) : cause);
									}
								}
							} else {
								const result = step(state, item, exit, currentIndex);
								if (result) {
									terminal = result;
									go();
								}
							}
							if (paused) {
								const eff = go();
								if (eff) resume(eff);
							} else if (done && fibers.size === 0) resume(terminal ?? void_$2);
						} catch (error) {
							resume(failDefect(error));
						}
					});
					if (fibers.size < concurrency) continue;
					paused = true;
					index++;
					return;
				}
			}
			done = true;
			if (terminal) {
				if (fibers && fibers.size > 0) {
					const annotations = fiberStackAnnotations(parentFiber);
					fibers.forEach((f) => f.interruptUnsafe(parentFiber.id, annotations));
					return;
				}
				if (resume || terminal._tag === "Failure") return terminal;
			} else if (resume) {
				if (!fibers) return exitVoid;
				else if (fibers.size === 0) resume(void_$2);
			}
		};
		return go();
	};
};
const iterateConcurrent = () => (options) => iterateConcurrentImpl(options);
const forEachConcurrent = iterateConcurrentImpl({
	onItem(state, item, index) {
		return state.f(item, index);
	},
	step(state, _, exit, index) {
		if (exit._tag === "Failure") return exit;
		else if (state.out) state.out[index] = exit.value;
	}
});
const forkUnsafe$1 = (parent, effect, immediate = false, daemon = false, uninterruptible = false) => {
	const parentRuntime = parent;
	const interruptible = uninterruptible === "inherit" ? parentRuntime.interruptible : !uninterruptible;
	const child = new FiberImpl(parentRuntime.context, interruptible);
	if (!daemon) {
		parentRuntime.children().add(child);
		child._parent = parentRuntime;
	}
	if (immediate) child.evaluate(effect);
	else {
		child._asyncContext = captureAsyncContext();
		parentRuntime.currentDispatcher.scheduleTask(() => child.evaluate(effect), 0);
	}
	return child;
};
const forkIn$1 = dual((args) => isEffect$1(args[0]), (self, scope, options) => withFiber((parent) => {
	const fiber = forkUnsafe$1(parent, self, options?.startImmediately, true, options?.uninterruptible);
	if (!fiber._exit) {
		if (scope.state._tag !== "Closed") {
			const key = {};
			const finalizer = () => withFiberId((interruptor) => interruptor === fiber.id ? void_$2 : fiberInterrupt(fiber));
			scopeAddFinalizerUnsafe(scope, key, finalizer);
			fiber.addObserver(() => scopeRemoveFinalizerUnsafe(scope, key));
		} else fiber.interruptUnsafe(parent.id, fiberStackAnnotations(parent));
	}
	return succeed$3(fiber);
}));
const runForkWith = (context) => (effect, options) => {
	const fiber = new FiberImpl(options?.scheduler ? add(context, Scheduler, options.scheduler) : context, options?.uninterruptible !== true);
	fiber.evaluate(effect);
	if (fiber._exit) return fiber;
	if (options?.signal) {
		if (options.signal.aborted) fiber.interruptUnsafe();
		else {
			const abort = () => fiber.interruptUnsafe();
			options.signal.addEventListener("abort", abort, { once: true });
			fiber.addObserver(() => options.signal.removeEventListener("abort", abort));
		}
	}
	if (options?.onFiberStart) options.onFiberStart(fiber);
	return fiber;
};
const runFork$1 = runForkWith(empty$1());
const runSyncExitWith = (context) => {
	const runFork = runForkWith(context);
	return (effect) => {
		if (effectIsExit(effect)) return effect;
		const scheduler = new MixedScheduler("sync");
		const fiber = runFork(effect, { scheduler });
		fiber._dispatcher?.flush();
		return fiber._exit ?? exitDie(new AsyncFiberError(fiber));
	};
};
const runSyncExit$1 = runSyncExitWith(empty$1());
const bigint0$1 = BigInt(0);
const NoopSpanProto = {
	_tag: "Span",
	spanId: "noop",
	traceId: "noop",
	sampled: false,
	status: {
		_tag: "Ended",
		startTime: bigint0$1,
		endTime: bigint0$1,
		exit: exitVoid
	},
	attributes: new Map(),
	links: [],
	kind: "internal",
	attribute() {},
	event() {},
	end() {},
	addLinks() {}
};
const noopSpan = (options) => Object.assign(Object.create(NoopSpanProto), options);
const filterDisablePropagation = (span) => {
	if (!span) return none();
	return get(span.annotations, DisablePropagation) ? span._tag === "Span" ? filterDisablePropagation(getOrUndefined$1(span.parent)) : none() : some(span);
};
const makeSpanUnsafe = (fiber, name, options) => {
	const disablePropagation = !fiber.cache.tracerEnabled || options?.annotations && get(options.annotations, DisablePropagation);
	const parent = options?.parent !== void 0 ? some(options.parent) : options?.root ? none() : filterDisablePropagation(fiber.cache.span);
	let span;
	if (disablePropagation) span = noopSpan({
		name,
		parent,
		annotations: add(options?.annotations ?? empty$1(), DisablePropagation, true)
	});
	else {
		const tracer = fiber.cache.tracer ?? nativeTracer;
		const clock = fiber.getRef(ClockRef);
		const timingEnabled = fiber.getRef(TracerTimingEnabled);
		const annotationsFromEnv = fiber.getRef(TracerSpanAnnotations);
		const linksFromEnv = fiber.getRef(TracerSpanLinks);
		const level = options?.level ?? fiber.getRef(CurrentTraceLevel);
		const links = options?.links !== void 0 ? [...linksFromEnv, ...options.links] : linksFromEnv.length === 0 ? [] : linksFromEnv.slice();
		span = tracer.span({
			name,
			parent,
			annotations: options?.annotations ?? empty$1(),
			links,
			startTime: timingEnabled ? clock.currentTimeNanosUnsafe() : bigint0$1,
			kind: options?.kind ?? "internal",
			root: options?.root ?? false,
			sampled: options?.sampled ?? (isSome(parent) && parent.value.sampled === false ? false : !isLogLevelGreaterThan(fiber.getRef(MinimumTraceLevel), level))
		});
		for (const key in annotationsFromEnv) span.attribute(key, annotationsFromEnv[key]);
		if (options?.attributes !== void 0) for (const key in options.attributes) span.attribute(key, options.attributes[key]);
	}
	return span;
};
const endSpan = (span, exit, clock, timingEnabled) => sync$1(() => {
	if (span.status._tag === "Ended") return;
	span.end(timingEnabled ? clock.currentTimeNanosUnsafe() : bigint0$1, exit);
});
const useSpan = (name, ...args) => {
	const options = args.length === 1 ? void 0 : args[0];
	const evaluate = args[args.length - 1];
	return withFiber((fiber) => {
		const span = makeSpanUnsafe(fiber, name, options);
		const clock = fiber.getRef(ClockRef);
		const timingEnabled = fiber.getRef(TracerTimingEnabled);
		onExitUnsafe(fiber, (exit) => endSpan(span, exit, clock, timingEnabled));
		return evaluate(span);
	});
};
const provideParentSpan = provideService(ParentSpan);
const ClockRef = Reference("effect/Clock", { defaultValue: () => new ClockImpl() });
const MAX_TIMER_MILLIS = 2 ** 31 - 1;
var ClockImpl = class {
	currentTimeMillisUnsafe() {
		return Date.now();
	}
	currentTimeMillis = sync$1(() => this.currentTimeMillisUnsafe());
	currentTimeNanosUnsafe() {
		return wallTimeNanos();
	}
	currentTimeNanos = sync$1(() => this.currentTimeNanosUnsafe());
	monotonicTimeNanosUnsafe() {
		return monotonicNowNanos();
	}
	monotonicTimeNanos = sync$1(() => this.monotonicTimeNanosUnsafe());
	sleep(duration) {
		return this.sleepMillis(toMillis(duration));
	}
	sleepMillis(millis) {
		if (millis <= 0) return yieldNow;
		else if (!Number.isFinite(millis)) return never;
		return callback$2((resume) => {
			const continuation = millis > MAX_TIMER_MILLIS ? this.sleepMillis(millis - MAX_TIMER_MILLIS) : void_$2;
			const handle = setTimeout(() => resume(continuation), Math.min(millis, MAX_TIMER_MILLIS));
			return sync$1(() => clearTimeout(handle));
		});
	}
};
const nanosPerMilli = BigInt(1e6);
const monotonicNowNanos = function() {
	const processHrtime = globalThis.process?.hrtime;
	if (typeof processHrtime?.bigint === "function") return () => processHrtime.bigint();
	if (typeof performance !== "undefined" && typeof performance.now === "function") return () => BigInt(Math.round(performance.now() * 1e6));
	let previous = BigInt(0);
	return () => {
		const current = BigInt(Date.now()) * nanosPerMilli;
		if (current > previous) previous = current;
		return previous;
	};
}();
const wallTimeNanos = function() {
	const reanchorThresholdNanos = BigInt(1e9);
	let origin;
	return () => {
		const monotonic = monotonicNowNanos();
		const wall = BigInt(Date.now()) * nanosPerMilli;
		if (origin === void 0) origin = wall - monotonic;
		else {
			const projected = origin + monotonic;
			if ((wall > projected ? wall - projected : projected - wall) > reanchorThresholdNanos) origin = wall - monotonic;
		}
		return origin + monotonic;
	};
}();
const AsyncFiberErrorTypeId = "~effect/Cause/AsyncFiberError";
var AsyncFiberError = class extends TaggedError$2("AsyncFiberError") {
	[AsyncFiberErrorTypeId] = AsyncFiberErrorTypeId;
	constructor(fiber) {
		super({
			message: "An asynchronous Effect was executed with Effect.runSync",
			fiber
		});
	}
};
const UnknownErrorTypeId = "~effect/Cause/UnknownError";
var UnknownError = class extends TaggedError$2("UnknownError") {
	[UnknownErrorTypeId] = UnknownErrorTypeId;
	constructor(cause, message) {
		super({
			message,
			cause
		});
	}
};
const ConsoleRef = Reference("effect/Console", { defaultValue: () => globalThis.console });
const logLevelToOrder = (level) => {
	switch (level) {
		case "All": return Number.MIN_SAFE_INTEGER;
		case "Fatal": return 5e4;
		case "Error": return 4e4;
		case "Warn": return 3e4;
		case "Info": return 2e4;
		case "Debug": return 1e4;
		case "Trace": return 0;
		case "None": return Number.MAX_SAFE_INTEGER;
	}
};
const isLogLevelGreaterThan = isGreaterThan$1(mapInput(Number$4, logLevelToOrder));
const CurrentLoggers = Reference("effect/Logger/CurrentLoggers", { defaultValue: () => new Set([defaultLogger, tracerLogger]) });
const LogToStderr = Reference("effect/Logger/LogToStderr", { defaultValue: constFalse });
const LoggerProto = {
	["~effect/Logger"]: {
		_Message: identity,
		_Output: identity
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const loggerMake = (log) => {
	const self = Object.create(LoggerProto);
	self.log = log;
	return self;
};
const formatLabel = (key) => key.replace(/[\s="]/g, "_");
const formatLogSpan = (self, now) => {
	return `${formatLabel(self[0])}=${now - self[1]}ms`;
};
const logWithLevel = (level) => (...message) => {
	let cause = void 0;
	for (let i = 0, len = message.length; i < len; i++) {
		const msg = message[i];
		if (isCause(msg)) {
			if (cause) message.splice(i, 1);
			else message = message.slice(0, i).concat(message.slice(i + 1));
			cause = cause ? causeFromReasons(cause.reasons.concat(msg.reasons)) : msg;
			i--;
		}
	}
	if (cause === void 0) cause = causeEmpty;
	return withFiber((fiber) => {
		const logLevel = level ?? fiber.cache.logLevel;
		if (isLogLevelGreaterThan(fiber.cache.minimumLogLevel, logLevel)) return void_$2;
		const clock = fiber.getRef(ClockRef);
		const loggers = fiber.getRef(CurrentLoggers);
		if (loggers.size > 0) {
			const date = new Date(clock.currentTimeMillisUnsafe());
			for (const logger of loggers) logger.log({
				cause,
				fiber,
				date,
				logLevel,
				message
			});
		}
		return void_$2;
	});
};
const colors = {
	bold: "1",
	red: "31",
	green: "32",
	yellow: "33",
	blue: "34",
	cyan: "36",
	white: "37",
	gray: "90",
	black: "30",
	bgBrightRed: "101"
};
colors.gray, colors.blue, colors.green, colors.yellow, colors.red, colors.bgBrightRed, colors.black;
const defaultDateFormat = (date) => `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}.${date.getMilliseconds().toString().padStart(3, "0")}`;
const defaultLogger = loggerMake(({ cause, date, fiber, logLevel, message }) => {
	const message_ = Array.isArray(message) ? message.slice() : [message];
	if (cause.reasons.length > 0) message_.push(causePretty(cause));
	const now = date.getTime();
	const spans = fiber.getRef(CurrentLogSpans);
	let spanString = "";
	for (const span of spans) spanString += ` ${formatLogSpan(span, now)}`;
	const annotations = fiber.getRef(CurrentLogAnnotations);
	if (Object.keys(annotations).length > 0) message_.push(annotations);
	const console = fiber.getRef(ConsoleRef);
	(fiber.getRef(LogToStderr) ? console.error : console.log)(`[${defaultDateFormat(date)}] ${logLevel.toUpperCase()} (#${fiber.id})${spanString}:`, ...message_);
});
const tracerLogger = loggerMake(({ cause, fiber, logLevel, message }) => {
	const clock = fiber.getRef(ClockRef);
	const annotations = fiber.getRef(CurrentLogAnnotations);
	const span = fiber.cache.span;
	if (span === void 0 || span._tag === "ExternalSpan") return;
	const attributes = {};
	for (const [key, value] of Object.entries(annotations)) assignProperty(attributes, key, value);
	attributes["effect.fiberId"] = fiber.id;
	attributes["effect.logLevel"] = logLevel.toUpperCase();
	if (cause.reasons.length > 0) attributes["effect.cause"] = causePretty(cause);
	span.event(toStringUnknown(Array.isArray(message) && message.length === 1 ? message[0] : message), clock.currentTimeNanosUnsafe(), attributes);
});
//#endregion
//#region node_modules/effect/dist/Cause.js
const isFailReason = isFailReason$1;
const fromReasons = causeFromReasons;
const fail$3 = causeFail;
const die$1 = causeDie;
const hasInterruptsOnly = hasInterruptsOnly$1;
const map$1 = causeMap;
const squash = causeSquash;
const isDone = isDone$1;
const done = done$1;
//#endregion
//#region node_modules/effect/dist/Exit.js
const succeed$2 = exitSucceed;
const failCause$2 = exitFailCause;
const fail$2 = exitFail;
const void_$1 = exitVoid;
const isSuccess = exitIsSuccess;
const DeferredProto = {
	["~effect/Deferred"]: {
		_A: identity,
		_E: identity
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const DeferredImpl = function() {
	this.resumes = void 0;
	this.effect = void 0;
};
DeferredImpl.prototype = DeferredProto;
const makeUnsafe$3 = () => new DeferredImpl();
const _await = (self) => callback$2((resume) => {
	if (self.effect) return resume(self.effect);
	self.resumes ??= [];
	self.resumes.push(resume);
	return sync$1(() => {
		const resumes = self.resumes;
		if (resumes === void 0) return;
		const index = resumes.indexOf(resume);
		if (index >= 0) resumes.splice(index, 1);
	});
});
const doneUnsafe = (self, effect) => {
	if (self.effect) return false;
	self.effect = effect;
	if (self.resumes) {
		const resumes = self.resumes;
		self.resumes = void 0;
		for (let i = 0; i < resumes.length; i++) resumes[i](effect);
	}
	return true;
};
//#endregion
//#region node_modules/effect/dist/Scope.js
const makeUnsafe$2 = scopeMakeUnsafe;
const provide$2 = provideScope;
const addFinalizer = scopeAddFinalizer;
const forkUnsafe = scopeForkUnsafe;
const close = scopeClose;
//#endregion
//#region node_modules/effect/dist/Layer.js
const TypeId$20 = "~effect/Layer";
const MemoMapTypeId = "~effect/Layer/MemoMap";
const makeMemoMapEntry = (memoMap, layer) => {
	const entry = {
		observers: 0,
		deferred: makeUnsafe$3(),
		scope: makeUnsafe$2(),
		finalizer: (exit) => suspend$1(() => {
			if (--entry.observers > 0) return void_$2;
			memoMap.map.delete(layer);
			return close(entry.scope, exit);
		})
	};
	return entry;
};
const memoMapObserve = (entry, scope) => {
	if (scope.state._tag === "Closed") return false;
	entry.observers++;
	scopeAddFinalizerUnsafe(scope, {}, entry.finalizer);
	return true;
};
const LayerProto = {
	[TypeId$20]: {
		_ROut: identity,
		_E: identity,
		_RIn: identity
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const fromBuildUnsafe = (build) => {
	const self = Object.create(LayerProto);
	self.build = build;
	return self;
};
const fromBuild = (build) => fromBuildUnsafe((memoMap, scope) => {
	const layerScope = forkUnsafe(scope);
	return onExit(build(memoMap, layerScope), (exit) => exit._tag === "Failure" ? close(layerScope, exit) : void_$2);
});
const fromBuildMemo = (build) => {
	const self = fromBuild((memoMap, scope) => memoMap.getOrElseMemoize(self, scope, build));
	return self;
};
var MemoMapImpl = class {
	get [MemoMapTypeId]() {
		return MemoMapTypeId;
	}
	parent;
	constructor(parent) {
		this.parent = parent;
	}
	map = new Map();
	get(layer, scope) {
		const local = this.map.get(layer);
		if (local) {
			memoMapObserve(local, scope);
			return local.deferred.effect ?? _await(local.deferred);
		}
		return this.parent?.get(layer, scope);
	}
	getOrElseMemoize(layer, scope, build) {
		return suspend$1(() => {
			let deferred;
			return onExitPrimitive(suspend$1(() => {
				const existing = this.get(layer, scope);
				if (existing) return existing;
				const entry = makeMemoMapEntry(this, layer);
				if (!memoMapObserve(entry, scope)) return build(this, scope);
				deferred = entry.deferred;
				this.map.set(layer, entry);
				return build(this, entry.scope);
			}), (exit) => {
				if (deferred) doneUnsafe(deferred, exit);
			});
		});
	}
};
const makeMemoMapUnsafe = () => new MemoMapImpl();
const forkMemoMapUnsafe = (parent) => new MemoMapImpl(parent);
var CurrentMemoMap = class CurrentMemoMap extends Service()("effect/Layer/CurrentMemoMap") {
	static forkOrCreate(self) {
		const current = getOrUndefined(self, CurrentMemoMap);
		return current ? forkMemoMapUnsafe(current) : makeMemoMapUnsafe();
	}
};
const buildWithMemoMap = dual(3, (self, memoMap, scope) => provideService(map$2(suspend$1(() => self.build(memoMap, scope)), add(CurrentMemoMap, memoMap)), CurrentMemoMap, memoMap));
const buildWithScope = dual(2, (self, scope) => withFiber((fiber) => buildWithMemoMap(self, CurrentMemoMap.forkOrCreate(fiber.context), scope)));
const effect = function() {
	if (arguments.length === 1) return (effect) => effectImpl(arguments[0], effect);
	return effectImpl(arguments[0], arguments[1]);
};
const effectImpl = (service, effect) => effectContext(map$2(effect, (value) => make$13(service, value)));
const effectContext = (effect) => fromBuildMemo((_, scope) => provide$2(effect, scope));
const mergeAllEffect = (layers, memoMap, scope) => {
	const parentScope = forkUnsafe(scope, "parallel");
	return forEach$2(layers, (layer) => layer.build(memoMap, forkUnsafe(parentScope, "sequential")), { concurrency: layers.length }).pipe(map$2((context) => mergeAll$1(...context)));
};
const mergeAll = (...layers) => fromBuild((memoMap, scope) => mergeAllEffect(layers, memoMap, scope));
//#endregion
//#region node_modules/effect/dist/internal/dateTime.js
const TypeId$19 = "~effect/DateTime";
const TimeZoneTypeId = "~effect/DateTime/TimeZone";
const Proto$4 = {
	[TypeId$19]: TypeId$19,
	pipe() {
		return pipeArguments(this, arguments);
	},
	[NodeInspectSymbol]() {
		return this.toString();
	},
	toJSON() {
		return toDateUtc$1(this).toJSON();
	}
};
({ ...Proto$4 });
({ ...Proto$4 });
const ProtoTimeZone = {
	[TimeZoneTypeId]: TimeZoneTypeId,
	[NodeInspectSymbol]() {
		return this.toString();
	}
};
({ ...ProtoTimeZone });
({ ...ProtoTimeZone });
const toDateUtc$1 = (self) => new Date(self.epochMilliseconds);
//#endregion
//#region node_modules/effect/dist/Pull.js
const catchDone = dual(2, (effect, f) => catchCauseFilter(effect, filterDoneLeftover, (l) => f(l)));
const isDoneCause = (cause) => cause.reasons.some(isDoneFailure);
const isDoneFailure = (failure) => failure._tag === "Fail" && isDone(failure.error);
const filterDone = (cause) => {
	let done;
	let hasFailure = false;
	for (const reason of cause.reasons) if (isDoneFailure(reason)) done ??= reason.error;
	else if (reason._tag !== "Interrupt") hasFailure = true;
	if (done === void 0) return fail$5(cause);
	return hasFailure ? fail$5(fromReasons(cause.reasons.filter((reason) => !isDoneFailure(reason)))) : succeed$4(done);
};
const filterDoneLeftover = (cause) => {
	const done = filterDone(cause);
	return isFailure(done) ? done : succeed$4(done.success.value);
};
//#endregion
//#region node_modules/effect/dist/internal/layer.js
const provideLayer = (self, layer, options) => scopedWith((scope) => flatMap$1(options?.local ? buildWithMemoMap(layer, makeMemoMapUnsafe(), scope) : buildWithScope(layer, scope), (context) => provideContext(self, context)));
const provide$1 = dual((args) => isEffect$1(args[0]), (self, source, options) => isContext(source) ? provideContext(self, source) : provideLayer(self, Array.isArray(source) ? mergeAll(...source) : source, options));
//#endregion
//#region node_modules/effect/dist/Effect.js
const isEffect = isEffect$1;
const all = all$1;
const forEach$1 = forEach$2;
const promise = promise$1;
const tryPromise = tryPromise$1;
const succeed$1 = succeed$3;
const suspend = suspend$1;
const sync = sync$1;
const void_ = void_$2;
const callback$1 = callback$2;
const gen = gen$1;
const fail$1 = fail$4;
const failCause$1 = failCause$3;
const failCauseSync = failCauseSync$1;
const die = die$2;
const try_ = try_$1;
const fromResult = fromResult$1;
const flatMap = flatMap$1;
const tap = tap$1;
const exit = exit$1;
const map = map$2;
const as = as$1;
const catchTag = catchTag$1;
const catchCause = catchCause$1;
const mapError = mapError$1;
const orDie = orDie$1;
const tapError = tapError$1;
const tapCause = tapCause$1;
const matchEffect = matchEffect$1;
const provide = provide$1;
const serviceOption = serviceOption$1;
const scoped = scoped$1;
const acquireRelease = acquireRelease$1;
const forever = forever$1;
const forkIn = forkIn$1;
const runFork = runFork$1;
const runSyncExit = runSyncExit$1;
const fnUntraced = fnUntraced$1;
const fn = fn$1;
const logError = logWithLevel("Error");
const effectify = (fn, onError, onSyncError) => (...args) => callback$1((resume) => {
	try {
		fn(...args, (err, result) => {
			if (err) resume(onError ? suspend(() => fail$1(onError(err, args))) : fail$1(err));
			else resume(succeed$1(result));
		});
	} catch (err) {
		resume(onSyncError ? fail$1(onSyncError(err, args)) : die(err));
	}
});
const mapEager = mapEager$1;
const mapErrorEager = mapErrorEager$1;
const flatMapEager = flatMapEager$1;
const fnUntracedEager = fnUntracedEager$1;
//#endregion
//#region node_modules/effect/dist/PlatformError.js
const TypeId$18 = "~effect/PlatformError";
var BadArgument = class extends TaggedError$1("BadArgument") {
	get message() {
		return `${this.module}.${this.method}${this.description ? `: ${this.description}` : ""}`;
	}
};
var SystemError = class extends Error$2 {
	get message() {
		return `${this._tag}: ${this.module}.${this.method}${this.pathOrDescriptor !== void 0 ? ` (${this.pathOrDescriptor})` : ""}${this.description ? `: ${this.description}` : ""}`;
	}
};
var PlatformError = class extends TaggedError$1("PlatformError") {
	constructor(reason) {
		if ("cause" in reason) super({
			reason,
			cause: reason.cause
		});
		else super({ reason });
	}
	[TypeId$18] = TypeId$18;
	get message() {
		return this.reason.message;
	}
};
const systemError = (options) => new PlatformError(new SystemError(options));
const badArgument = (options) => new PlatformError(new BadArgument(options));
//#endregion
//#region node_modules/effect/dist/MutableList.js
const Empty = Symbol.for("effect/MutableList/Empty");
const make$9 = () => ({
	head: void 0,
	tail: void 0,
	length: 0
});
const compactHead = (self) => {
	const head = self.head;
	if (head.offset >= 1024 && head === self.tail && head.mutable && (head.array.length - head.offset) * 8 <= head.offset) self.head = self.tail = {
		array: head.array.slice(head.offset),
		mutable: true,
		offset: 0,
		next: void 0
	};
};
const emptyBucket = () => ({
	array: [],
	mutable: true,
	offset: 0,
	next: void 0
});
const append = (self, message) => {
	if (!self.tail) self.head = self.tail = emptyBucket();
	else if (!self.tail.mutable) {
		self.tail.next = emptyBucket();
		self.tail = self.tail.next;
	}
	self.tail.array.push(message);
	self.length++;
};
const clear = (self) => {
	self.head = self.tail = void 0;
	self.length = 0;
};
const takeN = (self, n) => {
	n = normalize$1(n);
	if (n <= 0 || !self.head) return [];
	n = Math.min(n, self.length);
	if (n === self.length && self.head?.offset === 0 && !self.head.next) {
		const array = self.head.array;
		clear(self);
		return array;
	}
	const array = new Array(n);
	let index = 0;
	let chunk = self.head;
	while (chunk) {
		while (chunk.offset < chunk.array.length) {
			array[index++] = chunk.array[chunk.offset];
			if (chunk.mutable) chunk.array[chunk.offset] = void 0;
			chunk.offset++;
			if (index === n) {
				self.head = chunk.offset === chunk.array.length && chunk.next ? chunk.next : chunk;
				self.length -= n;
				if (self.length === 0) clear(self);
				else compactHead(self);
				return array;
			}
		}
		chunk = chunk.next;
	}
	clear(self);
	return array;
};
const take = (self) => {
	if (!self.head) return Empty;
	const message = self.head.array[self.head.offset];
	if (self.head.mutable) self.head.array[self.head.offset] = void 0;
	self.head.offset++;
	self.length--;
	if (self.head.offset === self.head.array.length) {
		if (self.head.next) self.head = self.head.next;
		else clear(self);
	} else compactHead(self);
	return message;
};
//#endregion
//#region node_modules/effect/dist/Queue.js
const TypeId$17 = "~effect/Queue";
const EnqueueTypeId = "~effect/Queue/Enqueue";
const DequeueTypeId = "~effect/Queue/Dequeue";
const variance = {
	_A: identity,
	_E: identity
};
const QueueProto = {
	[TypeId$17]: variance,
	[EnqueueTypeId]: variance,
	[DequeueTypeId]: variance,
	...PipeInspectableProto,
	toJSON() {
		return {
			_id: "effect/Queue",
			state: this.state._tag,
			size: sizeUnsafe(this)
		};
	}
};
const make$8 = (options) => withFiber((fiber) => {
	const self = Object.create(QueueProto);
	self.dispatcher = fiber.currentDispatcher;
	self.capacity = options?.capacity ?? Number.POSITIVE_INFINITY;
	self.strategy = options?.strategy ?? "suspend";
	self.messages = make$9();
	self.scheduleRunning = false;
	self.state = {
		_tag: "Open",
		takers: new Set(),
		offers: new Set(),
		awaiters: new Set()
	};
	return succeed$3(self);
});
const offer = dual(2, (self, message) => suspend$1(() => offerUnsafe(self, message) ? exitTrue : self.state._tag === "Open" && self.strategy === "suspend" ? offerOrWait(self, message) : exitFalse));
const offerUnsafe = (self, message) => {
	if (self.state._tag !== "Open") return false;
	else if (self.messages.length >= self.capacity) {
		if (self.strategy === "sliding") {
			take(self.messages);
			append(self.messages, message);
			return true;
		} else if (self.capacity <= 0 && self.state.takers.size > 0) {
			append(self.messages, message);
			releaseTakers(self);
			return true;
		}
		return false;
	}
	append(self.messages, message);
	scheduleReleaseTaker(self);
	return true;
};
const failCause = dual(2, (self, cause) => sync$1(() => failCauseUnsafe(self, cause)));
const failCauseUnsafe = (self, cause) => {
	if (self.state._tag !== "Open") return false;
	const exit = exitFailCause(cause);
	const fail = exitZipRight(exit, exitFailDone);
	if (self.state.offers.size === 0 && self.messages.length === 0) {
		finalize(self, fail);
		return true;
	}
	self.state = {
		...self.state,
		_tag: "Closing",
		exit: fail
	};
	scheduleReleaseTaker(self);
	return true;
};
const endUnsafe = (self) => failCauseUnsafe(self, causeFail(Done()));
const shutdown = (self) => sync$1(() => shutdownUnsafe(self));
const shutdownUnsafe = (self) => {
	if (self.state._tag === "Done") return false;
	clear(self.messages);
	const offers = self.state.offers;
	finalize(self, self.state._tag === "Open" ? exitInterrupt : self.state.exit);
	for (const entry of offers) resumeUnoffered(entry);
	return true;
};
const takeAll = (self) => takeBetween(self, 1, Number.POSITIVE_INFINITY);
const takeBetween = dual(3, (self, min, max) => {
	min = normalize$1(min);
	max = normalize$1(max);
	return suspendTake(() => takeBetweenUnsafe(self, min, max) ?? andThen(awaitTake(self, () => canTake(self, min)), takeBetween(self, min, max)));
});
const sizeUnsafe = (self) => self.state._tag === "Done" ? 0 : self.messages.length;
const exitFalse = exitSucceed(false);
const exitTrue = exitSucceed(true);
const exitFailDone = exitFail(Done());
const exitInterrupt = exitInterrupt$1();
const releaseTakers = (self) => {
	if (self.state._tag === "Done" || self.state.takers.size === 0) return;
	for (const taker of self.state.takers) {
		if (!taker.ready()) continue;
		self.state.takers.delete(taker);
		taker.resume(exitVoid);
		if (self.messages.length === 0) break;
	}
};
const scheduleReleaseTaker = (self) => {
	if (self.scheduleRunning || self.state._tag === "Done" || self.state.takers.size === 0) return;
	self.scheduleRunning = true;
	self.dispatcher.scheduleTask(() => {
		self.scheduleRunning = false;
		releaseTakers(self);
	}, 0);
};
const takeBetweenUnsafe = (self, min, max) => {
	if (self.state._tag === "Done") return self.state.exit;
	else if (max <= 0 || min <= 0) return exitSucceed([]);
	else if (!canTake(self, min)) return;
	const messages = self.messages.length > 0 ? takeN(self.messages, max) : [takeOfferUnsafe(self.state.offers)];
	releaseCapacity(self);
	return exitSucceed(messages);
};
const suspendTake = makePrimitive({
	op: "QueueTake",
	[evaluate](fiber) {
		const effect = this[args]();
		return isExit(effect) ? effect[evaluate](fiber) : effect;
	}
});
const canTake = (self, min) => self.messages.length >= (self.state._tag === "Closing" ? 1 : Math.min(min, self.capacity || 1)) || self.capacity <= 0 && self.state._tag !== "Done" && self.state.offers.size > 0;
const awaitTake = (self, ready) => callback$2((resume) => {
	if (self.state._tag === "Done") return resume(self.state.exit);
	if (ready()) return resume(exitVoid);
	const taker = {
		ready,
		resume
	};
	self.state.takers.add(taker);
	return sync$1(() => {
		if (self.state._tag !== "Done") self.state.takers.delete(taker);
	});
});
const offerOrWait = (self, message) => callback$2((resume) => offerUnsafe(self, message) ? resume(exitTrue) : waitToOffer(self, {
	_tag: "Single",
	message,
	resume
}));
const waitToOffer = (self, entry) => {
	if (self.state._tag !== "Open") return resumeUnoffered(entry);
	const offers = self.state.offers;
	offers.add(entry);
	return sync$1(() => {
		if (self.state._tag === "Done") return;
		offers.delete(entry);
		if (self.state._tag === "Closing" && offers.size === 0 && self.messages.length === 0) finalize(self, self.state.exit);
	});
};
const resumeUnoffered = (entry) => entry._tag === "Single" ? entry.resume(exitFalse) : entry.resume(exitSucceed(entry.remaining.slice(entry.offset)));
const takeOfferUnsafe = (offers) => {
	const entry = offers.values().next().value;
	if (entry._tag === "Single") {
		offers.delete(entry);
		entry.resume(exitTrue);
		return entry.message;
	}
	const message = entry.remaining[entry.offset++];
	if (entry.offset === entry.remaining.length) {
		offers.delete(entry);
		entry.resume(exitSucceed([]));
	}
	return message;
};
const releaseCapacity = (self) => {
	if (self.state._tag === "Done") return isDoneCause(self.state.exit.cause);
	else if (self.state.offers.size === 0) {
		if (self.state._tag === "Closing" && self.messages.length === 0) {
			finalize(self, self.state.exit);
			return isDoneCause(self.state.exit.cause);
		}
		return false;
	}
	for (const entry of self.state.offers) {
		let n = self.capacity - self.messages.length;
		if (n <= 0) break;
		else if (entry._tag === "Single") {
			append(self.messages, entry.message);
			self.state.offers.delete(entry);
			entry.resume(exitTrue);
		} else {
			for (; entry.offset < entry.remaining.length; entry.offset++) {
				if (n === 0) return false;
				append(self.messages, entry.remaining[entry.offset]);
				n--;
			}
			self.state.offers.delete(entry);
			entry.resume(exitSucceed([]));
		}
		const state = self.state;
		if (state._tag === "Done") return isDoneCause(state.exit.cause);
	}
	return false;
};
const finalize = (self, exit) => {
	if (self.state._tag === "Done") return;
	const openState = self.state;
	self.state = {
		_tag: "Done",
		exit
	};
	for (const taker of openState.takers) taker.resume(exit);
	openState.takers.clear();
	for (const awaiter of openState.awaiters) awaiter(exit);
	openState.awaiters.clear();
};
const ChannelProto = {
	["~effect/Channel"]: {
		_Env: identity,
		_InErr: identity,
		_InElem: identity,
		_OutErr: identity,
		_OutElem: identity
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const fromTransform$1 = (transform) => {
	const self = Object.create(ChannelProto);
	self.transform = (upstream, scope) => catchCause(transform(upstream, scope), (cause) => succeed$1(failCause$1(cause)));
	return self;
};
const fromPull$1 = (effect) => fromTransform$1((_, __) => effect);
const toTransform = (channel) => channel.transform;
const asyncQueue = (scope, f, options) => make$8({
	capacity: options?.bufferSize,
	strategy: options?.strategy
}).pipe(tap((queue) => addFinalizer(scope, shutdown(queue))), tap((queue) => provide$2(f(queue), scope).pipe(catchCause((cause) => failCause(queue, cause)), forkIn(scope))));
const callbackArray = (f, options) => fromTransform$1((_, scope) => map(asyncQueue(scope, f, options), takeAll));
const unwrap$3 = (channel) => fromTransform$1((upstream, scope) => {
	let pull;
	return succeed$1(suspend(() => {
		if (pull) return pull;
		return channel.pipe(provide$2(scope), flatMap((channel) => toTransform(channel)(upstream, scope)), flatMap((pull_) => pull = pull_));
	}));
});
//#endregion
//#region node_modules/effect/dist/internal/stream.js
const TypeId$15 = "~effect/Stream";
const streamVariance = {
	_R: identity,
	_E: identity,
	_A: identity
};
const Stream = function(channel) {
	this.channel = channel;
};
Stream.prototype = {
	[TypeId$15]: streamVariance,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const fromChannel$2 = (channel) => new Stream(channel);
//#endregion
//#region node_modules/effect/dist/Sink.js
const TypeId$14 = "~effect/Sink";
const endVoid = succeed$1([void 0]);
const sinkVariance = {
	_A: identity,
	_In: identity,
	_L: identity,
	_E: identity,
	_R: identity
};
const SinkProto = {
	[TypeId$14]: sinkVariance,
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const fromChannel$1 = (channel) => fromTransform((upstream, scope) => toTransform(channel)(upstream, scope).pipe(flatMap(forever({ disableYield: true })), catchDone(succeed$1)));
const fromTransform = (transform) => {
	const self = Object.create(SinkProto);
	self.transform = transform;
	return self;
};
const toChannel$1 = (self) => fromTransform$1((upstream, scope) => succeed$1(flatMap(self.transform(upstream, scope), done)));
const forEach = (f) => forEachArray(forEach$1((_) => f(_), { discard: true }));
const forEachArray = (f) => fromTransform((upstream) => upstream.pipe(flatMap(f), forever({ disableYield: true }), catchDone(() => endVoid)));
const unwrap$2 = (effect) => fromChannel$1(unwrap$3(map(effect, toChannel$1)));
//#endregion
//#region node_modules/effect/dist/Stream.js
const fromChannel = fromChannel$2;
const fromPull = (pull) => fromChannel(fromPull$1(pull));
const toChannel = (stream) => stream.channel;
const callback = (f, options) => fromChannel(callbackArray(f, options));
const unwrap$1 = (effect) => fromChannel(unwrap$3(map(effect, toChannel)));
//#endregion
//#region node_modules/effect/dist/FileSystem.js
const TypeId$13 = "~effect/FileSystem";
const FileSystem = Service("effect/FileSystem");
const make$7 = (impl) => FileSystem.of({
	...impl,
	[TypeId$13]: TypeId$13,
	exists: (path) => pipe(impl.access(path), as(true), catchTag("PlatformError", (e) => e.reason._tag === "NotFound" ? succeed$1(false) : fail$1(e))),
	readFileString: (path, encoding) => flatMap(impl.readFile(path), (_) => try_({
		try: () => new TextDecoder(encoding).decode(_),
		catch: (cause) => badArgument({
			module: "FileSystem",
			method: "readFileString",
			description: "invalid encoding",
			cause
		})
	})),
	stream: fnUntraced(function* (path, options) {
		const file = yield* impl.open(path, { flag: "r" });
		const offset = options?.offset === void 0 ? void 0 : fromInputUnsafe$1(options.offset);
		if (offset) yield* file.seek(offset, "start");
		const bytesToRead = options?.bytesToRead === void 0 ? void 0 : fromInputUnsafe$1(options.bytesToRead);
		let totalBytesRead = BigInt(0);
		const chunkSize = Number(BigInt(options?.chunkSize ?? 65536));
		const readChunk = file.readAlloc(chunkSize);
		return fromPull(succeed$1(flatMap(suspend(() => {
			if (bytesToRead !== void 0 && bytesToRead <= totalBytesRead) return done();
			return bytesToRead !== void 0 && bytesToRead - totalBytesRead < chunkSize ? file.readAlloc(Number(bytesToRead - totalBytesRead)) : readChunk;
		}), match$3({
			onNone: () => done(),
			onSome: (buf) => {
				totalBytesRead += BigInt(buf.length);
				return succeed$1(of(buf));
			}
		}))));
	}, unwrap$1),
	sink: (path, options) => pipe(impl.open(path, {
		...options,
		flag: options?.flag ?? "w"
	}), map((file) => forEach((_) => file.writeAll(_))), unwrap$2),
	writeFileString: (path, data, options) => flatMap(try_({
		try: () => new TextEncoder().encode(data),
		catch: (cause) => badArgument({
			module: "FileSystem",
			method: "writeFileString",
			description: "could not encode string",
			cause
		})
	}), (_) => impl.writeFile(path, _, options))
});
const FileTypeId = "~effect/FileSystem/File";
var WatchBackend = class extends Service()("effect/FileSystem/WatchBackend") {};
//#endregion
//#region node_modules/@effect/platform-node-shared/dist/internal/utils.js
const handleErrnoException = (module, method) => (err, [path]) => {
	let reason = "Unknown";
	switch (err.code) {
		case "ENOENT":
			reason = "NotFound";
			break;
		case "EACCES":
			reason = "PermissionDenied";
			break;
		case "EEXIST":
			reason = "AlreadyExists";
			break;
		case "EISDIR":
			reason = "BadResource";
			break;
		case "ENOTDIR":
			reason = "BadResource";
			break;
		case "EBUSY":
			reason = "Busy";
			break;
		case "ELOOP": reason = "BadResource";
	}
	return systemError({
		_tag: reason,
		module,
		method,
		pathOrDescriptor: path,
		syscall: err.syscall,
		cause: err
	});
};
//#endregion
//#region node_modules/@effect/platform-node-shared/dist/NodeFileSystem.js
const handleBadArgument = (method) => (err) => badArgument({
	module: "FileSystem",
	method,
	description: err.message ?? String(err)
});
const bigintToNumber = (value, field) => {
	const number = Number(value);
	if (!Number.isSafeInteger(number)) throw new RangeError(`${field} exceeds the safe integer range: ${value}`);
	return number;
};
const bigintToNumberOption = (value) => flatMap$3(fromNullishOr(value), toNumber);
const toUint64 = (value) => BigInt.asUintN(64, value);
const toUint64Option = (value) => map$6(fromNullishOr(value), toUint64);
const positionToNumber = (position, method) => try_({
	try: () => bigintToNumber(position, "position"),
	catch: handleBadArgument(method)
});
const access = (() => {
	const nodeAccess = effectify(NFS.access, handleErrnoException("FileSystem", "access"), handleBadArgument("access"));
	return (path, options) => {
		let mode = NFS.constants.F_OK;
		if (options?.readable) mode |= NFS.constants.R_OK;
		if (options?.writable) mode |= NFS.constants.W_OK;
		return nodeAccess(path, mode);
	};
})();
const copy$1 = (() => {
	const nodeCp = effectify(NFS.cp, handleErrnoException("FileSystem", "copy"), handleBadArgument("copy"));
	return (fromPath, toPath, options) => nodeCp(fromPath, toPath, {
		force: options?.overwrite ?? false,
		preserveTimestamps: options?.preserveTimestamps ?? false,
		recursive: true
	});
})();
const copyFile = (() => {
	const nodeCopyFile = effectify(NFS.copyFile, handleErrnoException("FileSystem", "copyFile"), handleBadArgument("copyFile"));
	return (fromPath, toPath) => nodeCopyFile(fromPath, toPath);
})();
const chmod = (() => {
	const nodeChmod = effectify(NFS.chmod, handleErrnoException("FileSystem", "chmod"), handleBadArgument("chmod"));
	return (path, mode) => nodeChmod(path, mode);
})();
const chown = (() => {
	const nodeChown = effectify(NFS.chown, handleErrnoException("FileSystem", "chown"), handleBadArgument("chown"));
	return (path, uid, gid) => nodeChown(path, uid, gid);
})();
const glob = (() => {
	const nodeGlob = effectify(NFS.glob, handleErrnoException("FileSystem", "glob"), handleBadArgument("glob"));
	return (pattern, options) => nodeGlob(pattern, {
		cwd: options?.root,
		exclude: options?.exclude
	});
})();
const link$1 = (() => {
	const nodeLink = effectify(NFS.link, handleErrnoException("FileSystem", "link"), handleBadArgument("link"));
	return (existingPath, newPath) => nodeLink(existingPath, newPath);
})();
const makeDirectory = (() => {
	const nodeMkdir = effectify(NFS.mkdir, handleErrnoException("FileSystem", "makeDirectory"), handleBadArgument("makeDirectory"));
	return (path, options) => nodeMkdir(path, {
		recursive: options?.recursive ?? false,
		mode: options?.mode
	});
})();
const makeTempDirectoryFactory = (method) => {
	const nodeMkdtemp = effectify(NFS.mkdtemp, handleErrnoException("FileSystem", method), handleBadArgument(method));
	return (options) => suspend(() => {
		const prefix = options?.prefix ?? "";
		const directory = typeof options?.directory === "string" ? Path.join(options.directory, ".") : OS.tmpdir();
		return nodeMkdtemp(prefix ? Path.join(directory, prefix) : directory + "/");
	});
};
const makeTempDirectory = makeTempDirectoryFactory("makeTempDirectory");
const removeFactory = (method) => {
	const nodeRm = effectify(NFS.rm, handleErrnoException("FileSystem", method), handleBadArgument(method));
	return (path, options) => nodeRm(path, {
		recursive: options?.recursive ?? false,
		force: options?.force ?? false
	});
};
const remove = removeFactory("remove");
const makeTempDirectoryScoped = (() => {
	const makeDirectory = makeTempDirectoryFactory("makeTempDirectoryScoped");
	const removeDirectory = removeFactory("makeTempDirectoryScoped");
	return (options) => acquireRelease(makeDirectory(options), (directory) => orDie(removeDirectory(directory, { recursive: true })));
})();
const openFlagBits = (flag) => {
	const { O_APPEND, O_CREAT, O_EXCL, O_RDONLY, O_RDWR, O_TRUNC, O_WRONLY } = NFS.constants;
	switch (flag) {
		case "r": return O_RDONLY;
		case "r+": return O_RDWR;
		case "w": return O_TRUNC | O_CREAT | O_WRONLY;
		case "wx": return O_TRUNC | O_CREAT | O_WRONLY | O_EXCL;
		case "w+": return O_TRUNC | O_CREAT | O_RDWR;
		case "wx+": return O_TRUNC | O_CREAT | O_RDWR | O_EXCL;
		case "a": return O_APPEND | O_CREAT | O_WRONLY;
		case "ax": return O_APPEND | O_CREAT | O_WRONLY | O_EXCL;
		case "a+": return O_APPEND | O_CREAT | O_RDWR;
		case "ax+": return O_APPEND | O_CREAT | O_RDWR | O_EXCL;
	}
};
const noFollowFlags = (method, flag) => suspend(() => {
	const { O_NOFOLLOW } = NFS.constants;
	if (process.platform === "win32" || typeof O_NOFOLLOW !== "number" || O_NOFOLLOW === 0) return fail$1(badArgument({
		module: "FileSystem",
		method,
		description: "noFollow is not supported on this platform"
	}));
	return succeed$1(openFlagBits(flag) | O_NOFOLLOW);
});
const openFactory = (method) => {
	const nodeOpen = effectify(NFS.open, handleErrnoException("FileSystem", method), handleBadArgument(method));
	const nodeClose = effectify(NFS.close, handleErrnoException("FileSystem", method), handleBadArgument(method));
	return (path, options) => pipe(acquireRelease(options?.noFollow === true ? flatMap(noFollowFlags(method, options.flag ?? "r"), (flags) => nodeOpen(path, flags, options.mode)) : nodeOpen(path, options?.flag ?? "r", options?.mode), (fd) => orDie(nodeClose(fd))), map((fd) => makeFile(fd, options?.flag?.startsWith("a") ?? false)));
};
const open = openFactory("open");
const negativePosition = (method) => badArgument({
	module: "FileSystem",
	method,
	description: "Cannot read before the start of the file"
});
const makeFile = (() => {
	const nodeReadFactory = (method) => effectify(NFS.read, handleErrnoException("FileSystem", method), handleBadArgument(method));
	const nodeRead = nodeReadFactory("read");
	const nodeReadAlloc = nodeReadFactory("readAlloc");
	const nodeStat = effectify(NFS.fstat, handleErrnoException("FileSystem", "stat"), handleBadArgument("stat"));
	const nodeTruncate = effectify(NFS.ftruncate, handleErrnoException("FileSystem", "truncate"), handleBadArgument("truncate"));
	const nodeSync = effectify(NFS.fsync, handleErrnoException("FileSystem", "sync"), handleBadArgument("sync"));
	const nodeWriteFactory = (method) => effectify(NFS.write, handleErrnoException("FileSystem", method), handleBadArgument(method));
	const nodeWrite = nodeWriteFactory("write");
	const nodeWriteAll = nodeWriteFactory("writeAll");
	class FileImpl {
		[FileTypeId];
		fd;
		append;
		position = BigInt(0);
		constructor(fd, append) {
			this[FileTypeId] = FileTypeId;
			this.fd = fd;
			this.append = append;
		}
		get stat() {
			return flatMap(nodeStat(this.fd, { bigint: true }), makeFileInfo);
		}
		get sync() {
			return nodeSync(this.fd);
		}
		seek(offset, from) {
			return suspend(() => {
				const position = from === "start" ? offset : this.position + offset;
				if (position < BigInt(0)) return fail$1(badArgument({
					module: "FileSystem",
					method: "seek",
					description: "Cannot seek before the start of the file"
				}));
				this.position = position;
				return succeed$1(position);
			});
		}
		read(buffer, options) {
			return suspend(() => {
				const explicit = options?.position;
				if (explicit !== void 0) return explicit < BigInt(0) ? fail$1(negativePosition("read")) : nodeRead(this.fd, {
					buffer,
					position: explicit
				});
				const position = this.position;
				return map(nodeRead(this.fd, {
					buffer,
					position
				}), (bytesRead) => {
					this.position = position + BigInt(bytesRead);
					return bytesRead;
				});
			});
		}
		readAlloc(size, options) {
			return suspend(() => {
				try {
					if (!Number.isInteger(size) || size < 0) throw new RangeError("size must be a non-negative integer");
					const explicit = options?.position;
					if (explicit !== void 0 && explicit < BigInt(0)) return fail$1(negativePosition("readAlloc"));
					const buffer = Buffer.allocUnsafeSlow(size);
					const position = explicit ?? this.position;
					return map(nodeReadAlloc(this.fd, {
						buffer,
						position
					}), (bytesRead) => {
						if (bytesRead === 0) return none();
						if (explicit === void 0) this.position = position + BigInt(bytesRead);
						if (bytesRead === size) return some(buffer);
						const dst = Buffer.allocUnsafeSlow(bytesRead);
						buffer.copy(dst, 0, 0, bytesRead);
						return some(dst);
					});
				} catch (cause) {
					return fail$1(handleBadArgument("readAlloc")(cause));
				}
			});
		}
		truncate(length) {
			return map(nodeTruncate(this.fd, length || void 0), () => {
				if (!this.append) {
					const len = BigInt(length ?? 0);
					if (this.position > len) this.position = len;
				}
			});
		}
		write(buffer) {
			return suspend(() => {
				const position = this.position;
				return flatMap(this.append ? succeed$1(void 0) : positionToNumber(position, "write"), (nodePosition) => map(nodeWrite(this.fd, buffer, void 0, void 0, nodePosition), (bytesWritten) => {
					if (!this.append) this.position = position + BigInt(bytesWritten);
					return bytesWritten;
				}));
			});
		}
		writeAllChunk(buffer) {
			return suspend(() => {
				const position = this.position;
				return flatMap(this.append ? succeed$1(void 0) : positionToNumber(position, "writeAll"), (nodePosition) => flatMap(nodeWriteAll(this.fd, buffer, void 0, void 0, nodePosition), (bytesWritten) => {
					if (bytesWritten === 0) return fail$1(systemError({
						module: "FileSystem",
						method: "writeAll",
						_tag: "WriteZero",
						pathOrDescriptor: this.fd,
						description: "write returned 0 bytes written"
					}));
					if (!this.append) this.position = position + BigInt(bytesWritten);
					return bytesWritten < buffer.length ? this.writeAllChunk(buffer.subarray(bytesWritten)) : void_;
				}));
			});
		}
		writeAll(buffer) {
			return buffer.length === 0 ? void_ : this.writeAllChunk(buffer);
		}
	}
	return (fd, append) => new FileImpl(fd, append);
})();
const makeTempFileFactory = (method) => {
	const makeDirectory = makeTempDirectoryFactory(method);
	return fnUntraced(function* (options) {
		const directory = yield* makeDirectory(options);
		const random = Crypto.randomBytes(6).toString("hex");
		const name = Path.join(directory, options?.suffix ? `${random}${options.suffix}` : random);
		yield* writeFile(name, new Uint8Array(0));
		return name;
	});
};
const makeTempFile = makeTempFileFactory("makeTempFile");
const makeTempFileScoped = (() => {
	const makeFile = makeTempFileFactory("makeTempFileScoped");
	const removeDirectory = removeFactory("makeTempFileScoped");
	return (options) => acquireRelease(makeFile(options), (file) => orDie(removeDirectory(Path.dirname(file), { recursive: true })));
})();
const readDirectory = (path, options) => tryPromise({
	try: () => NFS.promises.readdir(path, options),
	catch: (err) => handleErrnoException("FileSystem", "readDirectory")(err, [path])
});
const readFile = (path) => callback$1((resume, signal) => {
	try {
		NFS.readFile(path, { signal }, (err, data) => {
			if (err) resume(fail$1(handleErrnoException("FileSystem", "readFile")(err, [path])));
			else resume(succeed$1(data));
		});
	} catch (err) {
		resume(fail$1(handleBadArgument("readFile")(err)));
	}
});
const readLink = (() => {
	const nodeReadLink = effectify(NFS.readlink, handleErrnoException("FileSystem", "readLink"), handleBadArgument("readLink"));
	return (path) => nodeReadLink(path);
})();
const realPath = (() => {
	const nodeRealPath = effectify(NFS.realpath, handleErrnoException("FileSystem", "realPath"), handleBadArgument("realPath"));
	return (path) => nodeRealPath(path);
})();
const rename = (() => {
	const nodeRename = effectify(NFS.rename, handleErrnoException("FileSystem", "rename"), handleBadArgument("rename"));
	return (oldPath, newPath) => nodeRename(oldPath, newPath);
})();
const makeFileInfo = (stat) => try_({
	try: () => ({
		type: stat.isFile() ? "File" : stat.isDirectory() ? "Directory" : stat.isSymbolicLink() ? "SymbolicLink" : stat.isBlockDevice() ? "BlockDevice" : stat.isCharacterDevice() ? "CharacterDevice" : stat.isFIFO() ? "FIFO" : stat.isSocket() ? "Socket" : "Unknown",
		mtime: fromNullishOr(stat.mtime),
		atime: fromNullishOr(stat.atime),
		birthtime: fromNullishOr(stat.birthtime),
		dev: toUint64(stat.dev),
		rdev: toUint64Option(stat.rdev),
		ino: toUint64Option(stat.ino),
		mode: bigintToNumber(stat.mode, "mode"),
		nlink: toUint64Option(stat.nlink),
		uid: bigintToNumberOption(stat.uid),
		gid: bigintToNumberOption(stat.gid),
		size: bytes(stat.size),
		blksize: stat.blksize !== void 0 ? some(bytes(stat.blksize)) : none(),
		blocks: fromNullishOr(stat.blocks)
	}),
	catch: handleBadArgument("stat")
});
const stat = (() => {
	const nodeStat = effectify(NFS.stat, handleErrnoException("FileSystem", "stat"), handleBadArgument("stat"));
	return (path) => flatMap(nodeStat(path, { bigint: true }), makeFileInfo);
})();
const symlink = (() => {
	const nodeSymlink = effectify(NFS.symlink, handleErrnoException("FileSystem", "symlink"), handleBadArgument("symlink"));
	return (target, path) => nodeSymlink(target, path);
})();
const truncate = (() => {
	const nodeTruncate = effectify(NFS.truncate, handleErrnoException("FileSystem", "truncate"), handleBadArgument("truncate"));
	return (path, length) => nodeTruncate(path, length);
})();
const utimes = (() => {
	const nodeUtimes = effectify(NFS.utimes, handleErrnoException("FileSystem", "utime"), handleBadArgument("utime"));
	return (path, atime, mtime) => nodeUtimes(path, atime, mtime);
})();
const watchNode = (path, info, options) => callback((queue) => acquireRelease(sync(() => {
	const directory = info.type === "Directory" ? path : Path.dirname(path);
	const watcher = NFS.watch(path, { recursive: options?.recursive ?? false }, (event, path) => {
		if (!path) return;
		switch (event) {
			case "rename":
				runFork(matchEffect(stat(Path.resolve(directory, path)), {
					onSuccess: (_) => offer(queue, {
						_tag: "Create",
						path
					}),
					onFailure: (_) => offer(queue, {
						_tag: "Remove",
						path
					})
				}));
				return;
			case "change":
				offerUnsafe(queue, {
					_tag: "Update",
					path
				});
				return;
		}
	});
	watcher.on("error", (error) => {
		failCauseUnsafe(queue, fail$3(systemError({
			module: "FileSystem",
			_tag: "Unknown",
			method: "watch",
			pathOrDescriptor: path,
			cause: error
		})));
	});
	watcher.on("close", () => {
		endUnsafe(queue);
	});
	return watcher;
}), (watcher) => sync(() => watcher.close())).pipe(tap(() => sync(() => options?.onReady?.()))));
const watch = (backend, path, options) => all([stat(path), serviceOption(WatchBackend)]).pipe(map(([stat, callerBackend]) => orElse(callerBackend, () => backend).pipe(flatMap$3((_) => _.register(path, stat, options)), getOrElse(() => watchNode(path, stat, options)))), unwrap$1);
const writeFile = (path, data, options) => callback$1((resume, signal) => {
	try {
		NFS.writeFile(path, data, {
			signal,
			flag: options?.flag,
			mode: options?.mode
		}, (err) => {
			if (err) resume(fail$1(handleErrnoException("FileSystem", "writeFile")(err, [path])));
			else resume(void_);
		});
	} catch (err) {
		resume(fail$1(handleBadArgument("writeFile")(err)));
	}
});
const makeFileSystem = map(serviceOption(WatchBackend), (backend) => make$7({
	access,
	chmod,
	chown,
	copy: copy$1,
	copyFile,
	glob,
	link: link$1,
	makeDirectory,
	makeTempDirectory,
	makeTempDirectoryScoped,
	makeTempFile,
	makeTempFileScoped,
	open,
	readDirectory,
	readFile,
	readLink,
	realPath,
	remove,
	rename,
	stat,
	symlink,
	truncate,
	utimes,
	watch(path, options) {
		return watch(backend, path, options);
	},
	writeFile
}));
//#endregion
//#region node_modules/@effect/platform-node/dist/NodeFileSystem.js
const layer = effect(FileSystem)(makeFileSystem);
//#endregion
//#region node_modules/effect/dist/Runtime.js
const defaultTeardown = (exit, onExit) => {
	if (isSuccess(exit)) return onExit(0);
	if (hasInterruptsOnly(exit.cause)) return onExit(130);
	return onExit(getErrorExitCode(squash(exit.cause)));
};
const makeRunMain = (f) => dual((args) => isEffect(args[0]), (effect, options) => {
	const fiber = options?.disableErrorReporting === true ? runFork(effect) : runFork(tapCause(effect, (cause) => {
		if (hasInterruptsOnly(cause)) return void_;
		return getErrorReported(squash(cause)) ? logError(cause) : void_;
	}));
	try {
		const keepAlive = globalThis.setInterval(constVoid, 2147483647);
		fiber.addObserver(() => {
			clearInterval(keepAlive);
		});
	} catch {}
	return f({
		fiber,
		teardown: options?.teardown ?? defaultTeardown
	});
});
const errorExitCode = "~effect/Runtime/errorExitCode";
const getErrorExitCode = (u) => {
	if (typeof u === "object" && u !== null && "~effect/Runtime/errorExitCode" in u) {
		const code = u[errorExitCode];
		if (typeof code === "number") return code;
	}
	return 1;
};
const errorReported = "~effect/Runtime/errorReported";
const getErrorReported = (u) => {
	if (typeof u === "object" && u !== null && "~effect/Runtime/errorReported" in u) {
		const isReported = u[errorReported];
		if (typeof isReported === "boolean") return isReported;
	}
	return true;
};
//#endregion
//#region node_modules/@effect/platform-node/dist/NodeRuntime.js
const runMain = makeRunMain(({ fiber, teardown }) => {
	let receivedSignal = false;
	fiber.addObserver((exit) => {
		process.removeListener("SIGINT", onSigint);
		process.removeListener("SIGTERM", onSigint);
		teardown(exit, (code) => {
			if (receivedSignal || code !== 0) process.exit(code);
		});
	});
	function onSigint() {
		receivedSignal = true;
		fiber.interruptUnsafe(fiber.id);
	}
	process.on("SIGINT", onSigint);
	process.on("SIGTERM", onSigint);
});
//#endregion
//#region node_modules/effect/dist/BigDecimal.js
const TypeId$12 = "~effect/BigDecimal";
const BigDecimalProto = {
	[TypeId$12]: TypeId$12,
	[symbol$1]() {
		const normalized = normalize(this);
		return combine(string$1(String(normalized.value)), number$1(normalized.scale));
	},
	[symbol](that) {
		return isBigDecimal(that) && compare(this, that) === 0;
	},
	toString() {
		return `BigDecimal(${format(this)})`;
	},
	toJSON() {
		return {
			_id: "BigDecimal",
			value: String(this.value),
			scale: this.scale
		};
	},
	[NodeInspectSymbol]() {
		return this.toJSON();
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
const isBigDecimal = (u) => hasProperty(u, TypeId$12);
const make$6 = (value, scale) => {
	if (!Number.isSafeInteger(scale)) throw new RangeError(`Scale must be a safe integer, got ${scale}`);
	const o = Object.create(BigDecimalProto);
	o.value = value;
	o.scale = scale;
	return o;
};
const makeNormalized = (value, scale) => {
	const o = make$6(value, scale);
	o.normalized = o;
	return o;
};
const bigint0 = BigInt(0);
const bigint1 = BigInt(1);
const bigint10 = BigInt(10);
const zero = makeNormalized(bigint0, 0);
const normalize = (self) => {
	if (self.normalized === void 0) {
		if (self.value === bigint0) self.normalized = zero;
		else {
			const digits = `${self.value}`;
			let end = digits.length;
			while (digits[end - 1] === "0") end--;
			self.normalized = makeNormalized(BigInt(digits.slice(0, end)), self.scale - (digits.length - end));
		}
	}
	return self.normalized;
};
const MAX_COMPARISON_SCALE_ALIGNMENT = 100;
const comparisonPowersOfTen = [bigint1];
const compareBigInt = (self, that) => self === that ? 0 : self < that ? -1 : 1;
const compareMagnitude = (self, that) => {
	const selfDigits = `${self.value < bigint0 ? -self.value : self.value}`;
	const thatDigits = `${that.value < bigint0 ? -that.value : that.value}`;
	const exponentDifference = BigInt(selfDigits.length - thatDigits.length) - BigInt(self.scale) + BigInt(that.scale);
	if (exponentDifference !== bigint0) return exponentDifference < bigint0 ? -1 : 1;
	const length = Math.max(selfDigits.length, thatDigits.length);
	return String$4(selfDigits.padEnd(length, "0"), thatDigits.padEnd(length, "0"));
};
const compare = (self, that) => {
	if (self.scale === that.scale) return compareBigInt(self.value, that.value);
	const selfSign = sign(self);
	const thatSign = sign(that);
	if (selfSign !== thatSign) return selfSign < thatSign ? -1 : 1;
	if (selfSign === 0) return 0;
	const scaleDifference = self.scale - that.scale;
	const absoluteScaleDifference = Math.abs(scaleDifference);
	if (absoluteScaleDifference > MAX_COMPARISON_SCALE_ALIGNMENT) return selfSign === -1 ? compareMagnitude(that, self) : compareMagnitude(self, that);
	const powerOfTen = comparisonPowersOfTen[absoluteScaleDifference] ??= bigint10 ** BigInt(absoluteScaleDifference);
	return scaleDifference > 0 ? compareBigInt(self.value, that.value * powerOfTen) : compareBigInt(self.value * powerOfTen, that.value);
};
const sign = (n) => n.value === bigint0 ? 0 : n.value < bigint0 ? -1 : 1;
const format = (n) => {
	const normalized = normalize(n);
	if (Math.abs(normalized.scale) >= 16) return toExponential(normalized);
	const negative = normalized.value < bigint0;
	const absolute = `${negative ? -normalized.value : normalized.value}`;
	const digits = normalized.scale > 0 ? absolute.padStart(normalized.scale + 1, "0") : absolute.padEnd(absolute.length - normalized.scale, "0");
	const point = digits.length - normalized.scale;
	const complete = normalized.scale > 0 ? `${digits.slice(0, point)}.${digits.slice(point)}` : digits;
	return negative ? `-${complete}` : complete;
};
const toExponential = (n) => {
	if (isZero(n)) return "0e+0";
	const normalized = normalize(n);
	const digits = `${normalized.value}`;
	const point = normalized.value < bigint0 ? 2 : 1;
	const head = digits.slice(0, point);
	const tail = digits.slice(point);
	const exp = tail.length - normalized.scale;
	return `${head}${tail === "" ? "" : `.${tail}`}e${exp >= 0 ? "+" : ""}${exp}`;
};
const isZero = (n) => n.value === bigint0;
//#endregion
//#region node_modules/effect/dist/encoding/Base64.js
const encode = (input) => encodeBytes(typeof input === "string" ? encoder$1.encode(input) : input);
const decode = (str) => {
	const stripped = stripCrlf(str);
	const length = stripped.length;
	if (length % 4 !== 0) return fail$5(new EncodingError({
		kind: "Decode",
		module: "Base64",
		input: stripped,
		message: `Length must be a multiple of 4, but is ${length}`
	}));
	const index = stripped.indexOf("=");
	if (index !== -1 && (index < length - 2 || index === length - 2 && stripped[length - 1] !== "=")) return fail$5(new EncodingError({
		kind: "Decode",
		module: "Base64",
		input: stripped,
		message: "Found a '=' character, but it is not at the end"
	}));
	try {
		const missingOctets = stripped.endsWith("==") ? 2 : stripped.endsWith("=") ? 1 : 0;
		const result = new Uint8Array(3 * (length / 4) - missingOctets);
		for (let i = 0, j = 0; i < length; i += 4, j += 3) {
			const buffer = getCode(stripped.charCodeAt(i)) << 18 | getCode(stripped.charCodeAt(i + 1)) << 12 | getCode(stripped.charCodeAt(i + 2)) << 6 | getCode(stripped.charCodeAt(i + 3));
			result[j] = buffer >> 16;
			result[j + 1] = buffer >> 8 & 255;
			result[j + 2] = buffer & 255;
		}
		return succeed$4(result);
	} catch (cause) {
		return fail$5(new EncodingError({
			kind: "Decode",
			module: "Base64",
			input: stripped,
			message: cause instanceof Error ? cause.message : "Invalid input"
		}));
	}
};
const encodeBytes = (bytes) => {
	const length = bytes.length;
	let result = "";
	let i = 2;
	for (; i < length; i += 3) {
		result += alphabet[bytes[i - 2] >> 2];
		result += alphabet[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
		result += alphabet[(bytes[i - 1] & 15) << 2 | bytes[i] >> 6];
		result += alphabet[bytes[i] & 63];
	}
	if (i === length + 1) {
		result += alphabet[bytes[i - 2] >> 2];
		result += alphabet[(bytes[i - 2] & 3) << 4];
		result += "==";
	}
	if (i === length) {
		result += alphabet[bytes[i - 2] >> 2];
		result += alphabet[(bytes[i - 2] & 3) << 4 | bytes[i - 1] >> 4];
		result += alphabet[(bytes[i - 1] & 15) << 2];
		result += "=";
	}
	return result;
};
const encoder$1 = new TextEncoder();
const stripCrlf = (str) => str.replace(/[\n\r]/g, "");
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const codes = new Uint8Array(123).fill(255);
for (let i = 0; i < 64; i++) codes[alphabet.charCodeAt(i)] = i;
codes["=".charCodeAt(0)] = 0;
const getCode = (charCode) => {
	if (charCode >= codes.length || codes[charCode] === 255) throw new TypeError(`Invalid character ${String.fromCharCode(charCode)}`);
	return codes[charCode];
};
({ ...BaseProto });
({ ...BaseProto });
({ ...PipeInspectableProto });
BaseProto.toString, BaseProto[NodeInspectSymbol];
({ ...PipeInspectableProto });
//#endregion
//#region node_modules/effect/dist/internal/schema/annotations.js
function resolve$3(ast) {
	return ast.checks ? ast.checks[ast.checks.length - 1].annotations : ast.annotations;
}
const STRUCTURAL_ANNOTATION_KEY = "~structural";
const SENTINELS_ANNOTATION_KEY = "~sentinels";
const CONSTRUCTOR_ANNOTATION_KEY = "~constructor";
const getExpected = memoize((ast) => {
	const identifier = resolve$3(ast)?.identifier;
	if (typeof identifier === "string") return identifier;
	return ast.getExpected(getExpected);
});
//#endregion
//#region node_modules/effect/dist/internal/schema/parser.js
const missing = Symbol();
const succeed = succeed$2;
const missingExit = succeed(missing);
const sameExit = succeed(missing);
const toOption = (value) => value === missing ? none() : some(value);
const fromOptionExit = (option) => option._tag === "None" ? missingExit : succeed(option.value);
//#endregion
//#region node_modules/effect/dist/SchemaIssue.js
const TypeId$7 = "~effect/SchemaIssue/Issue";
function isIssue(u) {
	return hasProperty(u, TypeId$7) && u[TypeId$7] === TypeId$7;
}
function hasInput(issue) {
	return Object.hasOwn(issue, "input");
}
var IssueNodeImpl = class {
	[TypeId$7] = TypeId$7;
	constructor(input, options) {
		if (options?.reportInput === true && input !== missing) this.input = input;
	}
};
const Filter$1 = class extends IssueNodeImpl {
	_tag = "Filter";
	filter;
	issue;
	constructor(filter, issue, input, options) {
		super(input, options);
		this.filter = filter;
		this.issue = issue;
	}
};
const Encoding = class extends IssueNodeImpl {
	_tag = "Encoding";
	ast;
	issue;
	constructor(ast, issue, input, options) {
		super(input, options);
		this.ast = ast;
		this.issue = issue;
	}
};
const Pointer = class extends IssueNodeImpl {
	_tag = "Pointer";
	path;
	issue;
	constructor(path, issue) {
		super();
		this.path = path;
		this.issue = issue;
	}
};
const MissingKey = class extends IssueNodeImpl {
	_tag = "MissingKey";
	annotations;
	constructor(annotations) {
		super();
		this.annotations = annotations;
	}
};
const UnexpectedKey = class extends IssueNodeImpl {
	_tag = "UnexpectedKey";
	ast;
	constructor(ast, input, options) {
		super(input, options);
		this.ast = ast;
	}
};
const Composite = class extends IssueNodeImpl {
	_tag = "Composite";
	ast;
	issues;
	constructor(ast, issues, input, options) {
		super(input, options);
		this.ast = ast;
		this.issues = issues;
	}
};
const InvalidType = class extends IssueNodeImpl {
	_tag = "InvalidType";
	ast;
	constructor(ast, input, options) {
		super(input, options);
		this.ast = ast;
	}
};
const InvalidValue = class extends IssueNodeImpl {
	_tag = "InvalidValue";
	annotations;
	constructor(annotations, input, options) {
		super(input, options);
		this.annotations = annotations;
	}
};
const AnyOf = class extends IssueNodeImpl {
	_tag = "AnyOf";
	ast;
	issues;
	constructor(ast, issues, input, options) {
		super(input, options);
		this.ast = ast;
		this.issues = issues;
	}
};
const OneOf = class extends IssueNodeImpl {
	_tag = "OneOf";
	ast;
	successes;
	constructor(ast, successes, input, options) {
		super(input, options);
		this.ast = ast;
		this.successes = successes;
	}
};
function makeFilterIssue(entry, input, options) {
	if (isIssue(entry)) return entry;
	if (typeof entry === "string") return new InvalidValue({ message: entry }, input, options);
	const inner = typeof entry.issue === "string" ? new InvalidValue({ message: entry.issue }, input, options) : entry.issue;
	return new Pointer(entry.path, inner);
}
function makeSingle(out, input, options) {
	if (out === void 0) return;
	if (typeof out === "boolean") return out ? void 0 : new InvalidValue(void 0, input, options);
	return makeFilterIssue(out, input, options);
}
function normalizeFilterOutput(ast, out, input, options) {
	if (Array.isArray(out)) {
		if (!isReadonlyArrayNonEmpty(out)) return;
		return out.length === 1 ? makeFilterIssue(out[0], input, options) : new Composite(ast, map$3(out, (entry) => makeFilterIssue(entry, input, options)), input, options);
	}
	return makeSingle(out, input, options);
}
const defaultLeafHook = (issue) => {
	const message = findMessage(issue);
	if (message !== void 0) return message;
	switch (issue._tag) {
		case "InvalidType": return getExpectedMessage(getExpected(issue.ast), issue);
		case "InvalidValue": {
			const expected = findExpected(issue);
			if (expected !== void 0) return getExpectedMessage(expected, issue);
			const input = formatInput(issue);
			return input === void 0 ? "Expected a valid value" : `Invalid data ${input}`;
		}
		case "MissingKey": return "Missing key";
		case "UnexpectedKey": {
			const input = formatInput(issue);
			return input === void 0 ? "Expected no excess property" : `Unexpected key with value ${input}`;
		}
		case "Forbidden": return "Forbidden operation";
		case "OneOf": {
			const input = formatInput(issue);
			return input === void 0 ? "Expected exactly one member to match" : `Expected exactly one member to match the input ${input}`;
		}
	}
};
const defaultCheckHook = (issue) => findMessage(issue.issue) ?? findMessage(issue);
function formatInput(issue) {
	return hasInput(issue) ? format$1(issue.input) : void 0;
}
function findExpected(issue) {
	const expected = issue.annotations?.expected;
	return typeof expected === "string" ? expected : void 0;
}
function getExpectedMessage(expected, issue) {
	const input = formatInput(issue);
	return input === void 0 ? `Expected ${expected}` : `Expected ${expected}, got ${input}`;
}
function formatCheck(check) {
	const expected = check.annotations?.expected;
	if (typeof expected === "string") return expected;
	switch (check._tag) {
		case "Filter": return "<filter>";
		case "FilterGroup": return check.checks.map((check) => formatCheck(check)).join(" & ");
	}
}
function makeFormatterDefault() {
	return (issue) => formatIssue(issue, "");
}
const defaultFormatter = makeFormatterDefault();
function formatIssue(issue, path) {
	let message;
	switch (issue._tag) {
		case "Filter": {
			const annotated = defaultCheckHook(issue);
			if (annotated !== void 0) message = annotated;
			else {
				if (issue.issue._tag !== "InvalidValue") return formatIssue(issue.issue, path);
				const expected = findExpected(issue.issue);
				message = expected === void 0 ? getExpectedMessage(formatCheck(issue.filter), issue) : getExpectedMessage(expected, issue.issue);
			}
			break;
		}
		case "Encoding": return formatIssue(issue.issue, path);
		case "Pointer": return formatIssue(issue.issue, path + formatPath(issue.path));
		case "Composite":
		case "AnyOf":
			if (issue._tag === "Composite" || issue.issues.length > 0) return issue.issues.map((issue) => formatIssue(issue, path)).join("\n");
			message = findMessage(issue) ?? getExpectedMessage(getExpected(issue.ast), issue);
			break;
		default: message = defaultLeafHook(issue);
	}
	return path ? `${message}\n  at ${path}` : message;
}
function findMessage(issue) {
	if (issue._tag === "Pointer") return;
	if (issue._tag === "Encoding") return findMessage(issue.issue);
	const message = (issue._tag === "Filter" ? issue.filter.annotations : "annotations" in issue ? issue.annotations : issue.ast.annotations)?.[issue._tag === "MissingKey" ? "messageMissingKey" : issue._tag === "UnexpectedKey" ? "messageUnexpectedKey" : "message"];
	if (typeof message === "string") return message;
}
//#endregion
//#region node_modules/effect/dist/internal/schema/cause.js
function getSchemaIssue(cause) {
	let issue;
	for (const reason of cause.reasons) {
		if (!isFailReason(reason) || !isIssue(reason.error)) return;
		issue ??= reason.error;
	}
	return issue;
}
function getSchemaIssueOrThrow(cause, message) {
	const issue = getSchemaIssue(cause);
	if (issue === void 0) throw new Error(message, { cause });
	return issue;
}
//#endregion
//#region node_modules/effect/dist/SchemaGetter.js
const makeGetter = (fields) => Object.assign(Object.create(Prototype$1), fields);
const passthrough_$1 = makeGetter({ _tag: "Passthrough" });
function passthrough$1() {
	return passthrough_$1;
}
function transform$1(f) {
	return makeGetter({
		_tag: "Transform",
		transform: f
	});
}
function transformEffect$1(f) {
	return makeGetter({
		_tag: "TransformEffect",
		transform: f
	});
}
function String$3() {
	return transform$1(globalThis.String);
}
function Number$3() {
	return transform$1(globalThis.Number);
}
function encodeBase64() {
	return transform$1(encode);
}
function decodeBase64() {
	return transformEffect$1((input, options) => mapErrorEager(fromResult(decode(input)), () => new InvalidValue({ expected: "a valid Base64 string" }, input, options)));
}
//#endregion
//#region node_modules/effect/dist/SchemaTransformation.js
const Middleware = class extends Class$1 {
	_tag = "Middleware";
	decode;
	encode;
	constructor(decode, encode) {
		super();
		this.decode = decode;
		this.encode = encode;
	}
	flip() {
		return new Middleware(this.encode, this.decode);
	}
};
const TypeId$6 = "~effect/SchemaTransformation/Transformation";
const Transformation = class extends Class$1 {
	[TypeId$6] = TypeId$6;
	_tag = "Transformation";
	decode;
	encode;
	constructor(decode, encode) {
		super();
		this.decode = decode;
		this.encode = encode;
	}
	flip() {
		return new Transformation(this.encode, this.decode);
	}
};
function isTransformation(u) {
	return hasProperty(u, TypeId$6) && u[TypeId$6] === TypeId$6;
}
const makeTransformation = (options) => {
	if (isTransformation(options)) return options;
	return new Transformation(options.decode, options.encode);
};
function transformEffect(options) {
	return new Transformation(transformEffect$1(options.decode), transformEffect$1(options.encode));
}
function transform(options) {
	return new Transformation(transform$1(options.decode), transform$1(options.encode));
}
const passthrough_ = new Transformation(passthrough$1(), passthrough$1());
function passthrough() {
	return passthrough_;
}
const numberFromString = new Transformation(Number$3(), String$3());
const isJsonError = (input) => isObject(input) && typeof input["message"] === "string";
const decodeJsonError = (input) => {
	const err = Object.hasOwn(input, "cause") ? new Error(input.message, { cause: decodeDefect(input.cause) }) : new Error(input.message);
	if (typeof input.name === "string" && input.name !== "Error") err.name = input.name;
	if (typeof input.stack === "string") err.stack = input.stack;
	return err;
};
const encodeUnknownAsJson = (input) => {
	try {
		const json = formatJson(input);
		return json === void 0 ? format$1(input) : JSON.parse(json);
	} catch {
		return format$1(input);
	}
};
const encodeJsonError = (input, options, encodeDefect) => {
	const encoded = {
		name: input.name,
		message: typeof input.message === "string" ? input.message : ""
	};
	if (options?.includeStack && typeof input.stack === "string") encoded.stack = input.stack;
	if (!options?.excludeCause && input.cause !== void 0) encoded.cause = encodeDefect(input.cause);
	return encoded;
};
const makeEncodeDefect = (options) => {
	const seen = new WeakSet();
	const encode = (input) => {
		if (isError(input)) {
			if (seen.has(input)) return "[Circular]";
			seen.add(input);
			const encoded = encodeJsonError(input, options, encode);
			seen.delete(input);
			return encoded;
		}
		return encodeUnknownAsJson(input);
	};
	return encode;
};
const decodeDefect = (input) => isJsonError(input) ? decodeJsonError(input) : input;
const defectFromJson = (options) => transform({
	decode: decodeDefect,
	encode: makeEncodeDefect(options)
});
const urlFromString = transformEffect({
	decode: (s, options) => URL.canParse(s) ? succeed$1(new URL(s)) : fail$1(new InvalidValue({ expected: "a valid URL string" }, s, options)),
	encode: (url) => succeed$1(url.href)
});
const uint8ArrayFromBase64String = new Transformation(decodeBase64(), encodeBase64());
//#endregion
//#region node_modules/effect/dist/SchemaAST.js
function makeGuard(tag) {
	return (ast) => ast._tag === tag;
}
const isDeclaration = makeGuard("Declaration");
const isNever = makeGuard("Never");
const isLiteral = makeGuard("Literal");
const isUniqueSymbol = makeGuard("UniqueSymbol");
const isArrays = makeGuard("Arrays");
const isObjects = makeGuard("Objects");
const isUnion = makeGuard("Union");
const isSuspend = makeGuard("Suspend");
const Link = class {
	to;
	transformation;
	constructor(to, transformation) {
		this.to = to;
		this.transformation = transformation;
	}
};
const defaultParseOptions = {};
const Context = class {
	isOptional;
	isMutable;
	constructorDefault;
	annotations;
	constructor(isOptional, isMutable, constructorDefault = void 0, annotations = void 0) {
		this.isOptional = isOptional;
		this.isMutable = isMutable;
		this.constructorDefault = constructorDefault;
		this.annotations = annotations;
	}
};
const TypeId$5 = "~effect/Schema";
var ASTNodeImpl = class {
	[TypeId$5] = TypeId$5;
	annotations;
	checks;
	encoding;
	context;
	constructor(annotations = void 0, checks = void 0, encoding = void 0, context = void 0) {
		this.annotations = annotations;
		this.checks = checks;
		this.encoding = encoding;
		this.context = context;
	}
	toString() {
		return `<${this._tag}>`;
	}
};
const Declaration = class extends ASTNodeImpl {
	_tag = "Declaration";
	typeParameters;
	run;
	encodingChecks;
	encodingRun;
	constructor(typeParameters, run, annotations, checks, encoding, context, encodingChecks, encodingRun) {
		super(annotations, checks, encoding, context);
		this.typeParameters = typeParameters;
		this.run = run;
		this.encodingChecks = encodingChecks;
		this.encodingRun = encodingRun;
	}
	getParser() {
		let run;
		return (input, options) => {
			if (input === missing) return missingExit;
			return (run ??= this.run(this.typeParameters))(input, this, options);
		};
	}
	_rebuild(recur, checks, encodingChecks, run, encodingRun) {
		const tps = mapOrSame(this.typeParameters, recur);
		return tps === this.typeParameters && checks === this.checks && encodingChecks === this.encodingChecks && run === this.run && encodingRun === this.encodingRun ? this : new Declaration(tps, run, this.annotations, checks, void 0, this.context, encodingChecks, encodingRun);
	}
	recur(recur) {
		return this._rebuild(recur, this.checks, this.encodingChecks, this.run, this.encodingRun);
	}
	flip(recur) {
		return this._rebuild(recur, this.encodingChecks, this.checks, this.encodingRun ?? this.run, this.run);
	}
	getExpected() {
		const expected = this.annotations?.expected;
		if (typeof expected === "string") return expected;
		return "<Declaration>";
	}
};
const Null$1 = class extends ASTNodeImpl {
	_tag = "Null";
	getParser() {
		return fromConst(this, null);
	}
	getExpected() {
		return "null";
	}
};
const null_ = new Null$1();
const Unknown$1 = class extends ASTNodeImpl {
	_tag = "Unknown";
	getParser() {
		return fromRefinement(this, isUnknown);
	}
	getExpected() {
		return "unknown";
	}
};
const unknown = new Unknown$1();
const Literal$1 = class extends ASTNodeImpl {
	_tag = "Literal";
	literal;
	constructor(literal, annotations, checks, encoding, context) {
		super(annotations, checks, encoding, context);
		if (typeof literal === "number" && !globalThis.Number.isFinite(literal)) throw new Error(`A numeric literal must be finite, got ${format$1(literal)}`);
		this.literal = literal;
	}
	getParser() {
		return fromConst(this, this.literal);
	}
	matchPart(s, _options) {
		return s === globalThis.String(this.literal) ? this.literal : void 0;
	}
	toCodecJson() {
		return typeof this.literal === "bigint" ? literalToString(this) : this;
	}
	toCodecStringTree() {
		return typeof this.literal === "string" ? this : literalToString(this);
	}
	getExpected() {
		return typeof this.literal === "string" ? JSON.stringify(this.literal) : globalThis.String(this.literal);
	}
};
function literalToString(ast) {
	const literalAsString = globalThis.String(ast.literal);
	return replaceEncoding(ast, [new Link(new Literal$1(literalAsString), new Transformation(transform$1(() => ast.literal), transform$1(() => literalAsString)))]);
}
const String$2 = class extends ASTNodeImpl {
	_tag = "String";
	getParser() {
		return fromRefinement(this, isString$1);
	}
	matchPart(s, options) {
		const checks = this.checks;
		return checks && !options.disableChecks && collectIssues(checks, s, void 0, this, options) ? void 0 : s;
	}
	getExpected() {
		return "string";
	}
};
const string = new String$2();
const Number$2 = class extends ASTNodeImpl {
	_tag = "Number";
	getParser() {
		return fromRefinement(this, isNumber);
	}
	matchKey(s, options) {
		return this._match(isStringNumberRegExp, s, options);
	}
	matchPart(s, options) {
		return this._match(isStringFiniteRegExp, s, options);
	}
	_match(regexp, s, options) {
		if (!regexp.test(s)) return void 0;
		const value = globalThis.Number(s);
		if (options.disableChecks || !this.checks) return value;
		return collectIssues(this.checks, value, void 0, this, options) ? void 0 : value;
	}
	toCodecJson() {
		if (this.checks && (hasCheck(this.checks, "effect/schema/isFinite") || hasCheck(this.checks, "effect/schema/isInt"))) return this;
		return replaceEncoding(this, [numberToJson]);
	}
	toCodecStringTree() {
		if (this.toCodecJson() === this) return replaceEncoding(this, [finiteToString]);
		return replaceEncoding(this, [numberToString]);
	}
	getExpected() {
		return "number";
	}
};
function hasCheck(checks, id) {
	return checks.some((check) => check.annotations?.representation?.id === id || check._tag === "FilterGroup" && hasCheck(check.checks, id));
}
const number = new Number$2();
const Boolean$2 = class extends ASTNodeImpl {
	_tag = "Boolean";
	getParser() {
		return fromRefinement(this, isBoolean);
	}
	getExpected() {
		return "boolean";
	}
};
const boolean = new Boolean$2();
const Arrays = class extends ASTNodeImpl {
	_tag = "Arrays";
	isMutable;
	elements;
	rest;
	encodingChecks;
	constructor(isMutable, elements, rest, annotations, checks, encoding, context, encodingChecks) {
		super(annotations, checks, encoding, context);
		this.isMutable = isMutable;
		this.elements = elements;
		this.rest = rest;
		this.encodingChecks = encodingChecks;
		let hasOptional = false;
		for (let i = 0; i < elements.length; i++) if (isOptional(elements[i])) hasOptional = true;
		else if (hasOptional) throw new Error("A required element cannot follow an optional element. ts(1257)");
		if (hasOptional && rest.length > 1) throw new Error("A required element cannot follow an optional element. ts(1257)");
		for (let i = 1; i < rest.length; i++) if (isOptional(rest[i])) throw new Error("An optional element cannot follow a rest element. ts(1266)");
	}
	getParser(compile, compileField = compile) {
		const ast = this;
		let elements;
		let rest;
		const elementLen = ast.elements.length;
		const tailLen = Math.max(0, ast.rest.length - 1);
		function getParser(tailThreshold, index) {
			if (index < elementLen) return elements[index];
			else if (index >= tailThreshold) return rest[index - tailThreshold + 1];
			return rest[0];
		}
		const finish = (state) => {
			const { input, len, options } = state;
			if (ast.rest.length === 0 && len > elementLen) for (let i = elementLen; i < len; i++) {
				const unexpected = new UnexpectedKey(ast, input[i], options);
				const issue = new Pointer([i], unexpected);
				if (options.errors === "all") {
					if (state.issues) state.issues.push(issue);
					else state.issues = [issue];
				} else return fail$1(new Composite(ast, [issue], input, options));
			}
			if (state.issues) return fail$1(new Composite(ast, state.issues, input, options));
			return succeed(state.output);
		};
		const parse = (input, options) => {
			const len = input.length;
			const state = {
				ast,
				getParser,
				input,
				len,
				tailThreshold: Math.max(elementLen, len - tailLen),
				output: new globalThis.Array(len),
				issues: void 0,
				options
			};
			const end = ast.rest.length === 0 ? elementLen : Math.max(len, elementLen + tailLen);
			const concurrency = options.concurrency === void 0 ? 1 : resolveConcurrency(options.concurrency);
			const eff = concurrency === 1 ? parseArray(state, input, 0, end) : parseArrayConcurrent(state, input, {
				concurrency,
				end
			});
			if (!eff) return finish(state);
			if (effectIsExit(eff)) return flatMapEager(eff, () => finish(state));
			let first = true;
			return suspend(() => {
				if (!first) return parse(input, options);
				first = false;
				return flatMap(eff, () => finish(state));
			});
		};
		return (input, options) => {
			if (input === missing) return missingExit;
			try {
				if (!Array.isArray(input)) return fail$1(new InvalidType(ast, input, options));
				if (!elements) {
					elements = ast.elements.map((ast) => ({
						ast,
						parser: compileField(ast)
					}));
					rest = ast.rest.map((ast) => ({
						ast,
						parser: compileField(ast)
					}));
				}
				return parse(input, options);
			} catch (error) {
				return die(error);
			}
		};
	}
	_rebuild(recur, checks, encodingChecks) {
		const elements = mapOrSame(this.elements, recur);
		const rest = mapOrSame(this.rest, recur);
		return elements === this.elements && rest === this.rest && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Arrays(this.isMutable, elements, rest, this.annotations, checks, void 0, this.context, encodingChecks);
	}
	recur(recur) {
		return this._rebuild(recur, this.checks, this.encodingChecks);
	}
	flip(recur) {
		return this._rebuild(recur, this.encodingChecks, this.checks);
	}
	getExpected() {
		return "array";
	}
};
function stepArray(s, item, exit, i) {
	if (exit._tag === "Failure") return wrapPropertyKeyIssue(s, s.ast, i, exit);
	const value = exit === sameExit ? item : exit[args];
	if (value !== missing) s.output[i] = value;
	else {
		const p = s.getParser(s.tailThreshold, i);
		if (isOptional(p.ast)) return;
		const issue = new Pointer([i], new MissingKey(p.ast.context?.annotations));
		if (s.options.errors === "all") {
			if (s.issues) s.issues.push(issue);
			else s.issues = [issue];
		} else return fail$2(new Composite(s.ast, [issue], s.input, s.options));
	}
}
const parseArrayOptions = {
	onItem(s, item, i) {
		const value = i < s.len ? item : missing;
		return s.getParser(s.tailThreshold, i).parser(value, s.options);
	},
	step: stepArray
};
const parseArray = iterateEager()(parseArrayOptions);
const parseArrayConcurrent = iterateConcurrent()(parseArrayOptions);
const wrapPropertyKeyIssue = (s, ast, key, exit) => {
	if (exit.cause.reasons.length === 0) return exit;
	const issue = getSchemaIssue(exit.cause);
	if (issue === void 0) return failCause$2(map$1(exit.cause, (issue) => new Composite(ast, [new Pointer([key], issue)], s.input, s.options)));
	const pointer = new Pointer([key], issue);
	if (s.options.errors === "all") {
		if (s.issues) s.issues.push(pointer);
		else s.issues = [pointer];
	} else return fail$2(new Composite(ast, [pointer], s.input, s.options));
};
const FINITE_PATTERN = "[+-]?\\d*\\.?\\d+(?:[Ee][+-]?\\d+)?";
function getIndexSignatureKeys(input, parameter, options = defaultParseOptions) {
	let stringKeys;
	let symbolKeys;
	function go(parameter) {
		switch (parameter._tag) {
			case "String":
			case "TemplateLiteral": return (stringKeys ??= Object.keys(input)).filter((k) => parameter.matchPart(k, options) !== void 0);
			case "Number": return (stringKeys ??= Object.keys(input)).filter((k) => parameter.matchKey(k, options) !== void 0);
			case "Symbol": return (symbolKeys ??= Object.getOwnPropertySymbols(input)).filter((k) => Object.prototype.propertyIsEnumerable.call(input, k) && parameter.matchKey(k, options) !== void 0);
			case "Union": return [...new Set(parameter.types.flatMap(go))];
			default: return [];
		}
	}
	return go(parameterFromPropertyKey(toEncoded$1(parameter)));
}
const PropertySignature = class {
	name;
	type;
	constructor(name, type) {
		this.name = name;
		this.type = type;
	}
};
function isIndexSignatureParameterSide(ast) {
	switch (ast._tag) {
		case "String":
		case "Number":
		case "Symbol":
		case "TemplateLiteral": return true;
		case "Union": return ast.types.every(isIndexSignatureParameterSide);
		default: return false;
	}
}
function isIndexSignatureParameterEncodedSide(ast) {
	const encoded = getLastEncoding(ast);
	switch (encoded._tag) {
		case "String":
		case "Number":
		case "Symbol":
		case "TemplateLiteral": return true;
		case "Union": return encoded.types.every(isIndexSignatureParameterEncodedSide);
		default: return false;
	}
}
function isIndexSignatureParameter(ast) {
	return isIndexSignatureParameterSide(ast) && isIndexSignatureParameterEncodedSide(ast);
}
const IndexSignature = class {
	parameter;
	type;
	constructor(parameter, type) {
		if (!isIndexSignatureParameter(parameter)) throw new Error(`Invalid index signature parameter ${parameter._tag}`);
		this.parameter = parameter;
		this.type = type;
		if (isOptional(type) && !containsUndefined(type)) throw new Error("Cannot use `Schema.optionalKey` with index signatures, use `Schema.optional` instead.");
	}
};
const Objects = class extends ASTNodeImpl {
	_tag = "Objects";
	propertySignatures;
	indexSignatures;
	encodingChecks;
	constructor(propertySignatures, indexSignatures, annotations, checks, encoding, context, encodingChecks) {
		super(annotations, checks, encoding, context);
		this.propertySignatures = propertySignatures;
		this.indexSignatures = indexSignatures;
		this.encodingChecks = encodingChecks;
	}
	getParser(compile, compileField = compile) {
		const ast = this;
		const hasProperties = ast.propertySignatures.length;
		const indexCount = ast.indexSignatures.length;
		if (!hasProperties && !indexCount) return fromRefinement(ast, isNotNullish);
		let properties;
		let indexes;
		const compileMembers = () => {
			if (!properties) {
				properties = ast.propertySignatures.map((ps) => ({
					parser: compileField(ps.type),
					name: ps.name,
					type: ps.type
				}));
				indexes = indexCount ? ast.indexSignatures.map((is) => ({
					is,
					parserKey: compile(parameterFromPropertyKey(is.parameter)),
					parserValue: compileField(is.type)
				})) : void 0;
			}
			return properties;
		};
		const makeFallback = () => {
			const expectedKeys = new Set(ast.propertySignatures.map((ps) => typeof ps.name === "number" ? globalThis.String(ps.name) : ps.name));
			const finishIndex = (s, key, k2, inputValue, exitValue) => {
				if (exitValue._tag === "Failure") return wrapPropertyKeyIssue(s, ast, key, exitValue) ?? void_$1;
				const value = exitValue === sameExit ? inputValue : exitValue[args];
				if (k2 !== missing && value !== missing) {
					if (hasProperties && (expectedKeys.has(key) || expectedKeys.has(typeof k2 === "number" ? globalThis.String(k2) : k2))) return void_$1;
					assignProperty(s.out, k2, value);
				}
				return void_$1;
			};
			const parseIndex = (s, key, index, exitKey) => {
				if (!exitKey) {
					const eff = index.parserKey(key, s.options);
					if (!effectIsExit(eff)) return flatMap(exit(eff), (exit) => parseIndex(s, key, index, exit));
					exitKey = eff;
				}
				if (exitKey._tag === "Failure") return wrapPropertyKeyIssue(s, ast, key, exitKey) ?? void_$1;
				const k2 = exitKey === sameExit ? key : exitKey[args];
				const inputValue = s.input[key];
				const result = index.parserValue(inputValue, s.options);
				return effectIsExit(result) ? finishIndex(s, key, k2, inputValue, result) : flatMap(exit(result), (exit) => finishIndex(s, key, k2, inputValue, exit));
			};
			const parseStringIndex = (s, key, index) => {
				const inputValue = s.input[key];
				const result = index.parserValue(inputValue, s.options);
				return effectIsExit(result) ? finishIndex(s, key, key, inputValue, result) : flatMap(exit(result), (exit) => finishIndex(s, key, key, inputValue, exit));
			};
			const parseIndexes = indexCount ? iterateConcurrent()({
				onItem: (s, [key, index]) => index.is.parameter === string ? parseStringIndex(s, key, index) : parseIndex(s, key, index),
				step: (_s, _item, exit) => exit._tag === "Failure" ? exit : void 0
			}) : void 0;
			return fnUntracedEager(function* (input, options) {
				if (input === missing) return missing;
				if (!(typeof input === "object" && input !== null && !Array.isArray(input))) return yield* fail$1(new InvalidType(ast, input, options));
				compileMembers();
				const record = input;
				const out = {};
				const state = {
					ast,
					input: record,
					out,
					issues: void 0,
					options
				};
				const errorsAllOption = options.errors === "all";
				const onExcessPropertyError = options.onExcessProperty === "error";
				const concurrency = options.concurrency === void 0 ? 1 : resolveConcurrency(options.concurrency);
				const indexKeys = indexCount && onExcessPropertyError ? ast.indexSignatures.map((index) => getIndexSignatureKeys(record, index.parameter, options)) : void 0;
				if (onExcessPropertyError) {
					const coveredKeys = indexKeys ? new Set(expectedKeys) : expectedKeys;
					if (indexKeys) for (const keys of indexKeys) for (const key of keys) coveredKeys.add(key);
					const inputKeys = Reflect.ownKeys(record);
					for (let i = 0; i < inputKeys.length; i++) {
						const key = inputKeys[i];
						if (!coveredKeys.has(key) && Object.prototype.propertyIsEnumerable.call(record, key)) {
							const unexpected = new UnexpectedKey(ast, record[key], options);
							const issue = new Pointer([key], unexpected);
							if (errorsAllOption) {
								if (state.issues) state.issues.push(issue);
								else state.issues = [issue];
								continue;
							} else return yield* fail$1(new Composite(ast, [issue], input, options));
						}
					}
				}
				if (hasProperties) {
					const eff = concurrency === 1 ? parseProperties(state, properties) : parsePropertiesConcurrent(state, properties, { concurrency });
					if (eff) yield* eff;
				}
				if (indexCount && concurrency === 1) for (let i = 0; i < indexCount; i++) {
					const index = indexes[i];
					const parse = index.is.parameter === string ? parseStringIndex : parseIndex;
					const keys = indexKeys?.[i] ?? (index.is.parameter === string ? Object.keys(record) : getIndexSignatureKeys(record, index.is.parameter, options));
					for (let j = 0; j < keys.length; j++) {
						const eff = parse(state, keys[j], index);
						if (!effectIsExit(eff)) yield* eff;
						else if (eff._tag === "Failure") return yield* eff;
					}
				}
				else if (parseIndexes) {
					const keyPairs = empty();
					for (let i = 0; i < indexCount; i++) {
						const index = indexes[i];
						const keys = indexKeys?.[i] ?? (index.is.parameter === string ? Object.keys(record) : getIndexSignatureKeys(record, index.is.parameter, options));
						for (let j = 0; j < keys.length; j++) keyPairs.push([keys[j], index]);
					}
					const eff = parseIndexes(state, keyPairs, { concurrency });
					if (eff) yield* eff;
				}
				if (state.issues) return yield* fail$1(new Composite(ast, state.issues, input, options));
				return out;
			});
		};
		if (indexCount) return makeFallback();
		let fallback;
		const resume = (state, index, pending) => {
			const property = properties[index];
			return flatMap(exit(pending), (exit) => {
				const terminal = stepProperty(state, property, exit);
				if (terminal) return terminal;
				const done = () => succeed(state.out);
				const eff = parseProperties(state, properties.slice(index + 1));
				return eff ? flatMapEager(eff, done) : done();
			});
		};
		return (input, options) => {
			if (input === missing) return missingExit;
			if (options.errors === "all" || options.onExcessProperty !== void 0 || options.concurrency !== void 0 && resolveConcurrency(options.concurrency) !== 1) return (fallback ??= makeFallback())(input, options);
			if (!(typeof input === "object" && input !== null && !Array.isArray(input))) return fail$1(new InvalidType(ast, input, options));
			const props = compileMembers();
			const record = input;
			const out = {};
			const state = {
				ast,
				input: record,
				out,
				issues: void 0,
				options
			};
			try {
				for (let index = 0; index < props.length; index++) {
					const property = props[index];
					const name = property.name;
					const hasKey = hasPropertySignature(record, name);
					const value = hasKey ? record[name] : missing;
					const exit = property.parser(value, options);
					if (!effectIsExit(exit)) return resume(state, index, exit);
					if (exit === sameExit) {
						if (hasKey) assignProperty(out, name, value);
						continue;
					}
					const terminal = stepProperty(state, property, exit);
					if (terminal) return terminal;
				}
			} catch (error) {
				return die(error);
			}
			return succeed(out);
		};
	}
	_rebuild(recur, recurParameter, checks, encodingChecks) {
		const props = mapOrSame(this.propertySignatures, (ps) => {
			const t = recur(ps.type);
			return t === ps.type ? ps : new PropertySignature(ps.name, t);
		});
		const indexes = mapOrSame(this.indexSignatures, (is) => {
			const p = recurParameter(is.parameter);
			const t = recur(is.type);
			return p === is.parameter && t === is.type ? is : new IndexSignature(p, t);
		});
		return props === this.propertySignatures && indexes === this.indexSignatures && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Objects(props, indexes, this.annotations, checks, void 0, this.context, encodingChecks);
	}
	flip(recur) {
		return this._rebuild(recur, recur, this.encodingChecks, this.checks);
	}
	recur(recur, recurParameter = recur) {
		return this._rebuild(recur, recurParameter, this.checks, this.encodingChecks);
	}
	getExpected() {
		if (this.propertySignatures.length === 0 && this.indexSignatures.length === 0) return "object | array";
		return "object";
	}
};
function stepProperty(s, p, exit) {
	if (exit._tag === "Failure") return wrapPropertyKeyIssue(s, s.ast, p.name, exit);
	if (exit === sameExit) return;
	const value = exit[args];
	if (value !== missing) {
		assignProperty(s.out, p.name, value);
		return;
	}
	delete s.out[p.name];
	if (!isOptional(p.type)) {
		const issue = new Pointer([p.name], new MissingKey(p.type.context?.annotations));
		if (s.options.errors === "all") {
			if (s.issues) s.issues.push(issue);
			else s.issues = [issue];
			return;
		} else return fail$2(new Composite(s.ast, [issue], s.input, s.options));
	}
}
const parsePropertiesOptions = {
	onItem(s, p) {
		if (!hasPropertySignature(s.input, p.name)) return p.parser(missing, s.options);
		const value = s.input[p.name];
		assignProperty(s.out, p.name, value);
		return p.parser(value, s.options);
	},
	step: stepProperty
};
const parseProperties = iterateEager()(parsePropertiesOptions);
const parsePropertiesConcurrent = iterateConcurrent()(parsePropertiesOptions);
function combineChecks(a, b) {
	if (!a) return b;
	if (!b) return a;
	return [...a, ...b];
}
function struct(fields, checks, annotations) {
	return new Objects(Reflect.ownKeys(fields).map((key) => {
		return new PropertySignature(key, fields[key].ast);
	}), [], annotations, checks);
}
function getAST(self) {
	return self.ast;
}
function tuple(elements, checks = void 0) {
	return new Arrays(false, elements.map((e) => e.ast), [], void 0, checks);
}
function union(members, options, checks) {
	return new Union$1(members.map(getAST), options, void 0, checks);
}
const toCandidate = memoizeIdempotent((ast) => {
	while (true) {
		if (isSuspend(ast)) return unknown;
		const encoding = ast.encoding;
		if (!encoding) return ast.recur?.(toCandidate, identity) ?? ast;
		if (encoding.some((link) => link.transformation._tag === "Middleware" && link.transformation.decode !== identity)) return unknown;
		ast = encoding[encoding.length - 1].to;
	}
});
function getCandidateTypes(ast) {
	switch (ast._tag) {
		case "Null": return ["null"];
		case "Undefined": return ["undefined"];
		case "String":
		case "TemplateLiteral": return ["string"];
		case "Number": return ["number"];
		case "Boolean": return ["boolean"];
		case "Symbol":
		case "UniqueSymbol": return ["symbol"];
		case "BigInt": return ["bigint"];
		case "Arrays": return ["array"];
		case "ObjectKeyword": return [
			"object",
			"array",
			"function"
		];
		case "Objects": return ast.propertySignatures.length || ast.indexSignatures.length ? ["object"] : [
			"string",
			"number",
			"boolean",
			"symbol",
			"bigint",
			"object",
			"array",
			"function"
		];
		case "Enum": return Array.from(new Set(ast.enums.map(([, v]) => typeof v)));
		case "Literal": return [typeof ast.literal];
		case "Union": return Array.from(new Set(ast.types.flatMap(getCandidateTypes)));
		default: return [
			"null",
			"undefined",
			"string",
			"number",
			"boolean",
			"symbol",
			"bigint",
			"object",
			"array",
			"function"
		];
	}
}
function collectSentinels(ast) {
	switch (ast._tag) {
		default: return [];
		case "Declaration": {
			const s = ast.annotations?.[SENTINELS_ANNOTATION_KEY];
			return Array.isArray(s) ? s : [];
		}
		case "Objects": return ast.propertySignatures.flatMap((ps) => {
			const type = ps.type;
			if (!isOptional(type)) {
				if (isLiteral(type)) return [{
					key: ps.name,
					literal: type.literal
				}];
				if (isUniqueSymbol(type)) return [{
					key: ps.name,
					literal: type.symbol
				}];
			}
			return [];
		});
		case "Arrays": return ast.elements.flatMap((e, i) => {
			if (!isOptional(e)) {
				if (isLiteral(e)) return [{
					key: i,
					literal: e.literal
				}];
				if (isUniqueSymbol(e)) return [{
					key: i,
					literal: e.symbol
				}];
			}
			return [];
		});
		case "Union": {
			if (ast.types.length === 0) return [];
			const members = ast.types.map((type) => collectSentinels(toCandidate(type)));
			return members[0].filter((s) => members.every((sentinels) => sentinels.some((o) => o.key === s.key && o.literal === s.literal)));
		}
		case "Suspend": return collectSentinels(ast.thunk());
	}
}
const candidateIndexCache = new WeakMap();
const emptyCandidates = Object.freeze([]);
const getRuntimeType = (input) => input === null ? "null" : Array.isArray(input) ? "array" : typeof input;
const hasPropertySignature = (input, key) => key === "__proto__" ? Object.hasOwn(input, key) : key in input;
function getCandidateIndex(types) {
	let index = candidateIndexCache.get(types);
	if (index) return index;
	let bySentinel;
	let sentinelCandidateCount = 0;
	let otherwise;
	let literalCandidates;
	let onlyLiterals = true;
	const literalOf = [];
	for (let i = 0; i < types.length; i++) {
		const a = types[i];
		const encoded = toCandidate(a);
		if (isNever(encoded)) continue;
		if (isLiteral(encoded) || isUniqueSymbol(encoded)) {
			literalCandidates ??= new Map();
			const literal = isLiteral(encoded) ? encoded.literal : encoded.symbol;
			literalOf[i] = literal;
			let arr = literalCandidates.get(literal);
			if (!arr) literalCandidates.set(literal, arr = []);
			arr.push(i);
		} else onlyLiterals = false;
		const sentinels = collectSentinels(encoded);
		if (sentinels.length) {
			bySentinel ??= new Map();
			sentinelCandidateCount++;
			for (const { key, literal } of sentinels) {
				let entry = bySentinel.get(key);
				if (!entry) bySentinel.set(key, entry = [new Map(), new Set()]);
				entry[1].add(i);
				let indexes = entry[0].get(literal);
				if (!indexes) entry[0].set(literal, indexes = new Set());
				indexes.add(i);
			}
		} else {
			otherwise ??= {};
			const candidateTypes = getCandidateTypes(encoded);
			for (const t of candidateTypes) (otherwise[t] ??= []).push(i);
		}
	}
	const fallbacks = {};
	const getFallback = (type) => fallbacks[type] ??= Object.freeze(otherwise?.[type] ?? emptyCandidates);
	if (onlyLiterals && literalCandidates) {
		literalCandidates.forEach(Object.freeze);
		index = (input) => literalCandidates.get(input) ?? emptyCandidates;
	} else if (bySentinel?.size === 1 && !otherwise) {
		const [key, [byValue]] = bySentinel.entries().next().value;
		const candidates = new Map();
		for (const [literal, indexes] of byValue) candidates.set(literal, Object.freeze(Array.from(indexes)));
		const all = Object.freeze(types.map((_, i) => i));
		index = (input, isConstructor) => {
			if (isObjectKeyword(input)) {
				const value = hasPropertySignature(input, key) ? input[key] : void 0;
				if (value !== void 0) return candidates.get(value) ?? emptyCandidates;
				if (isConstructor) return all;
			}
			return emptyCandidates;
		};
	} else if (bySentinel) {
		let commonSentinel;
		for (const entry of bySentinel) if ((!commonSentinel || entry[1][0].size > commonSentinel[1][0].size) && entry[1][1].size === sentinelCandidateCount) commonSentinel = entry;
		index = (input, isConstructor) => {
			const runtimeType = getRuntimeType(input);
			if (!isObjectKeyword(input)) return getFallback(runtimeType);
			const selected = new Set(otherwise?.[runtimeType]);
			let directKey;
			if (commonSentinel) {
				const [key, [byValue]] = commonSentinel;
				const hasKey = hasPropertySignature(input, key);
				const value = hasKey ? input[key] : void 0;
				if (hasKey && (!isConstructor || value !== void 0)) {
					const match = byValue.get(value);
					if (!match) return getFallback(runtimeType);
					for (const i of match) selected.add(i);
					directKey = key;
				}
			}
			if (directKey === void 0) for (const [key, [byValue, all]] of bySentinel) {
				const hasKey = hasPropertySignature(input, key);
				const value = hasKey ? input[key] : void 0;
				if (hasKey && (!isConstructor || value !== void 0)) {
					const match = byValue.get(value);
					if (match) for (const i of match) selected.add(i);
				} else if (isConstructor) for (const i of all) selected.add(i);
			}
			for (const [key, [byValue, all]] of bySentinel) {
				if (key === directKey) continue;
				const hasKey = hasPropertySignature(input, key);
				const value = hasKey ? input[key] : void 0;
				if (hasKey && (!isConstructor || value !== void 0)) {
					const match = byValue.get(value);
					for (const i of selected) if (all.has(i) && !match?.has(i)) selected.delete(i);
				}
			}
			return Array.from(selected).sort((a, b) => a - b);
		};
	} else index = (input) => {
		const fallback = getFallback(getRuntimeType(input));
		return literalCandidates ? fallback.filter((i) => literalOf[i] === void 0 || literalOf[i] === input) : fallback;
	};
	candidateIndexCache.set(types, index);
	return index;
}
const Union$1 = class extends ASTNodeImpl {
	_tag = "Union";
	types;
	options;
	encodingChecks;
	constructor(types, options, annotations, checks, encoding, context, encodingChecks) {
		super(annotations, checks, encoding, context);
		this.types = types;
		this.options = options;
		this.encodingChecks = encodingChecks;
	}
	getParser(compile, compileField) {
		const ast = this;
		const isConstructor = compileField !== void 0;
		const parsers = [];
		const parser = (i) => parsers[i] ??= compile(ast.types[i]);
		let index;
		return (input, options) => {
			if (input === missing) return missingExit;
			const candidates = (index ??= getCandidateIndex(ast.types))(input, isConstructor);
			if (candidates.length === 0) return fail$1(new AnyOf(ast, [], input, options));
			if (candidates.length === 1) {
				const result = parser(candidates[0])(input, options);
				if (result._tag === "Success") return result;
				return effectIsExit(result) ? failSingleUnionCandidate(ast, result.cause, input, options) : catchSingleUnionCandidate(ast, result, input, options);
			}
			return parseUnionCandidates(ast, parser, candidates, input, options);
		};
	}
	_rebuild(recur, checks, encodingChecks) {
		const types = mapOrSame(this.types, recur);
		return types === this.types && checks === this.checks && encodingChecks === this.encodingChecks ? this : new Union$1(types, this.options, this.annotations, checks, void 0, this.context, encodingChecks);
	}
	recur(recur) {
		return this._rebuild(recur, this.checks, this.encodingChecks);
	}
	flip(recur) {
		return this._rebuild(recur, this.encodingChecks, this.checks);
	}
	matchPart(s, options) {
		for (const type of this.types) {
			const out = type.matchPart(s, options);
			if (out !== void 0) return out;
		}
	}
	getExpected(getExpected) {
		const expected = this.annotations?.expected;
		if (typeof expected === "string") return expected;
		if (this.types.length === 0) return "never";
		const types = this.types.map((type) => {
			const encoded = toEncoded$1(type);
			switch (encoded._tag) {
				case "Arrays": {
					const literals = encoded.elements.filter(isLiteral);
					if (literals.length > 0) return `${formatIsMutable(encoded.isMutable)}[ ${literals.map((e) => getExpected(e) + formatIsOptional(e.context?.isOptional)).join(", ")}, ... ]`;
					break;
				}
				case "Objects": {
					const literals = encoded.propertySignatures.filter((ps) => isLiteral(ps.type));
					if (literals.length > 0) return `{ ${literals.map((ps) => `${formatIsMutable(ps.type.context?.isMutable)}${formatPropertyKey(ps.name)}${formatIsOptional(ps.type.context?.isOptional)}: ${getExpected(ps.type)}`).join(", ")}, ... }`;
					break;
				}
			}
			return getExpected(encoded);
		});
		return Array.from(new Set(types)).join(" | ");
	}
};
function failSingleUnionCandidate(ast, cause, input, options) {
	const issue = getSchemaIssue(cause);
	if (!issue) return failCause$2(cause);
	return fail$2(new AnyOf(ast, [issue], input, options));
}
function catchSingleUnionCandidate(ast, result, input, options) {
	return catchCause(result, (cause) => failSingleUnionCandidate(ast, cause, input, options));
}
function parseUnionCandidates(ast, parser, candidates, input, options) {
	const state = {
		ast,
		parser,
		input,
		out: void 0,
		successes: ast.options?.mode === "oneOf" ? [] : void 0,
		issues: void 0,
		options
	};
	const eff = parseUnion(state, candidates);
	if (!eff) {
		if (state.out) return state.out;
		return fail$1(new AnyOf(ast, state.issues ?? [], input, options));
	}
	if (effectIsExit(eff)) return resumeUnion(eff, state);
	let first = true;
	return suspend(() => {
		if (!first) return parseUnionCandidates(ast, parser, candidates, input, options);
		first = false;
		return resumeUnion(eff, state);
	});
}
function resumeUnion(eff, state) {
	return flatMapEager(eff, (_) => {
		if (state.out === sameExit) return succeed$1(state.input);
		if (state.out) return state.out;
		return fail$1(new AnyOf(state.ast, state.issues ?? [], state.input, state.options));
	});
}
const parseUnion = iterateEager()({
	onItem(s, i) {
		return s.parser(i)(s.input, s.options);
	},
	step(s, i, exit) {
		if (exit._tag === "Failure") {
			const issue = getSchemaIssue(exit.cause);
			if (issue === void 0) return exit;
			if (s.issues) s.issues.push(issue);
			else s.issues = [issue];
		} else {
			if (s.out && s.successes) {
				s.successes.push(s.ast.types[i]);
				return fail$2(new OneOf(s.ast, s.successes, s.input, s.options));
			}
			s.out = exit;
			if (s.successes) s.successes.push(s.ast.types[i]);
			else return void_$1;
		}
	}
});
const nonFiniteLiterals = new Union$1([
	new Literal$1("Infinity"),
	new Literal$1("-Infinity"),
	new Literal$1("NaN")
]);
function formatIsMutable(isMutable) {
	return isMutable ? "" : "readonly ";
}
function formatIsOptional(isOptional) {
	return isOptional ? "?" : "";
}
const Filter = class extends Class$1 {
	_tag = "Filter";
	run;
	annotations;
	aborted;
	constructor(run, annotations = void 0, aborted = false) {
		super();
		this.run = run;
		this.annotations = annotations;
		this.aborted = aborted;
	}
	annotate(annotations) {
		return new Filter(this.run, {
			...this.annotations,
			...annotations
		}, this.aborted);
	}
	abort() {
		return new Filter(this.run, this.annotations, true);
	}
	and(other, annotations) {
		return new FilterGroup([this, other], annotations);
	}
};
const FilterGroup = class extends Class$1 {
	_tag = "FilterGroup";
	checks;
	annotations;
	constructor(checks, annotations = void 0) {
		super();
		this.checks = checks;
		this.annotations = annotations;
	}
	annotate(annotations) {
		return new FilterGroup(this.checks, {
			...this.annotations,
			...annotations
		});
	}
	and(other, annotations) {
		return new FilterGroup([this, other], annotations);
	}
};
function makeFilter$1(filter, annotations, aborted = false) {
	return new Filter((input, ast, options) => normalizeFilterOutput(ast, filter(input, ast, options), input, options), annotations, aborted);
}
function isFinite(annotations) {
	return makeFilter$1((n) => globalThis.Number.isFinite(n), {
		expected: "a finite number",
		representation: {
			id: "effect/schema/isFinite",
			payload: null
		},
		toJsonSchema: () => ({ type: "number" }),
		toCode: () => ({ runtime: "Schema.isFinite()" }),
		arbitraryConstraint: { number: "finite" },
		...annotations
	});
}
const numberToJson = new Link(new Union$1([appendChecks(number, [isFinite()]), nonFiniteLiterals]), new Transformation(Number$3(), transform$1((n) => globalThis.Number.isFinite(n) ? n : globalThis.String(n))));
function isPattern$1(regExp, annotations) {
	const copy = new globalThis.RegExp(regExp);
	const payload = {
		source: copy.source,
		flags: copy.flags
	};
	return makeFilter$1((s) => {
		copy.lastIndex = 0;
		return copy.test(s);
	}, {
		expected: `a string matching the RegExp ${payload.source}`,
		representation: {
			id: "effect/schema/isPattern",
			payload
		},
		toJsonSchema: () => [{}, true],
		arbitraryConstraint: { patterns: [payload] },
		...annotations
	});
}
const bodyOwners = new WeakMap();
function copy(ast, changes) {
	const out = Object.assign(Object.create(Object.getPrototypeOf(ast)), ast, changes);
	if (Reflect.ownKeys(changes).every((key) => key === "context" || key === "encoding")) bodyOwners.set(out, getContextOwner(ast));
	return out;
}
function getContextOwner(ast) {
	const existing = bodyOwners.get(ast);
	if (existing !== void 0) return existing;
	if (ast.encoding === void 0) return ast;
	const owner = Object.assign(Object.create(Object.getPrototypeOf(ast)), ast, { encoding: void 0 });
	bodyOwners.set(ast, owner);
	return owner;
}
function replaceEncoding(ast, encoding) {
	return ast.encoding === encoding ? ast : copy(ast, { encoding });
}
function replaceContext(ast, context) {
	if (ast.context === context) return ast;
	const owner = getContextOwner(ast);
	if (owner.context === context && owner.encoding === ast.encoding) return owner;
	return copy(ast, { context });
}
function getLastEncoding(ast) {
	return ast.encoding ? getLastEncoding(ast.encoding[ast.encoding.length - 1].to) : ast;
}
function annotate(ast, annotations) {
	if (ast.checks) {
		const last = ast.checks[ast.checks.length - 1];
		return replaceChecks(ast, append$1(ast.checks.slice(0, -1), last.annotate(annotations)));
	}
	return copy(ast, { annotations: {
		...ast.annotations,
		...annotations
	} });
}
function replaceChecks(ast, checks) {
	if (ast._tag === "Suspend" && checks) throw new Error("Cannot add checks to Suspend");
	if (ast.checks === checks) return ast;
	return copy(ast, { checks });
}
function appendChecks(ast, checks) {
	return replaceChecks(ast, combineChecks(ast.checks, checks));
}
function mapLink(link, f) {
	const to = f(link.to);
	return to === link.to ? link : new Link(to, link.transformation);
}
function updateLastLink(encoding, f) {
	const links = encoding;
	const last = links[links.length - 1];
	const out = mapLink(last, f);
	return out === last ? encoding : append$1(encoding.slice(0, encoding.length - 1), out);
}
function applyToLastLink(f) {
	return (ast) => ast.encoding ? replaceEncoding(ast, updateLastLink(ast.encoding, f)) : ast;
}
function applyToSelfOrLastLinkEncodingIdempotent(f, options) {
	function out(ast) {
		if (ast.encoding) {
			const last = ast.encoding[ast.encoding.length - 1];
			return options?.stopAt?.(last) ? ast : replaceEncoding(ast, updateLastLink(ast.encoding, out));
		}
		return f(ast);
	}
	return memoizeIdempotent(out);
}
function appendTransformation(from, transformation, to) {
	const link = new Link(from, transformation);
	return replaceEncoding(to, to.encoding ? [...to.encoding, link] : [link]);
}
function mapOrSame(as, f) {
	let out;
	for (let i = 0; i < as.length; i++) {
		const a = as[i];
		const fa = f(a);
		if (out) out[i] = fa;
		else if (fa !== a) {
			out = new Array(as.length);
			for (let j = 0; j < i; j++) out[j] = as[j];
			out[i] = fa;
		}
	}
	return out ?? as;
}
function annotateKey(ast, annotations) {
	return replaceContext(ast, ast.context ? new Context(ast.context.isOptional, ast.context.isMutable, ast.context.constructorDefault, {
		...ast.context.annotations,
		...annotations
	}) : new Context(false, false, void 0, annotations));
}
const optionalKey$1 = memoizeIdempotent((ast) => {
	const context = ast.context ? ast.context.isOptional === false ? new Context(true, ast.context.isMutable, ast.context.constructorDefault, ast.context.annotations) : ast.context : new Context(true, false);
	return optionalKeyLastLink(replaceContext(ast, context));
});
const optionalKeyLastLink = applyToLastLink(optionalKey$1);
function withConstructorDefault$1(ast, defaultValue) {
	return replaceContext(ast, ast.context ? new Context(ast.context.isOptional, ast.context.isMutable, defaultValue, ast.context.annotations) : new Context(false, false, defaultValue));
}
function decodeTo$1(from, to, transformation) {
	return appendTransformation(from, transformation, to);
}
function parseParameter(ast) {
	const literals = [];
	const parameters = [];
	function go(ast) {
		switch (ast._tag) {
			case "Literal":
				if (isPropertyKey(ast.literal) && !literals.includes(ast.literal)) literals.push(ast.literal);
				return;
			case "UniqueSymbol":
				if (!literals.includes(ast.symbol)) literals.push(ast.symbol);
				return;
			case "Never": return;
			case "Union":
				for (let i = 0; i < ast.types.length; i++) go(ast.types[i]);
				return;
			default: parameters.push(ast);
		}
	}
	go(ast);
	return {
		literals,
		parameters
	};
}
function record(key, value) {
	const { literals, parameters: indexSignatures } = parseParameter(key);
	return new Objects(literals.map((literal) => new PropertySignature(literal, value)), indexSignatures.map((parameter) => new IndexSignature(parameter, value)));
}
function isOptional(ast) {
	return ast.context?.isOptional ?? false;
}
function isStructuralCheck(check) {
	return check.annotations?.["~structural"] === true || check._tag === "FilterGroup" && check.checks.every(isStructuralCheck);
}
function extractStructuralChecks(checks) {
	function extract(check) {
		if (isStructuralCheck(check)) return [check];
		return check._tag === "FilterGroup" ? check.checks.flatMap(extract) : [];
	}
	const out = checks.flatMap(extract);
	return isArrayNonEmpty(out) ? out : void 0;
}
function canPreserveEncodingChecks(ast) {
	let preserve = true;
	function visit(child) {
		preserve = preserve && !child.encoding && !isSuspend(child);
		if (preserve && "recur" in child) child.recur(visit);
		return child;
	}
	if ("recur" in ast) ast.recur(visit);
	return preserve;
}
const toType$1 = memoizeIdempotent((ast) => {
	const owner = getContextOwner(ast);
	if (owner !== ast) {
		const type = toType$1(owner);
		return type === owner && ast.encoding === void 0 ? ast : replaceContext(type, ast.context);
	}
	const type = "recur" in ast ? ast.recur(toType$1) : ast;
	if ("encodingChecks" in type && type.encodingChecks) {
		const checks = canPreserveEncodingChecks(ast) ? type.encodingChecks : isArrays(type) || isObjects(type) || isDeclaration(type) && type.typeParameters.length > 0 ? extractStructuralChecks(type.encodingChecks) : void 0;
		return copy(type, {
			encodingChecks: void 0,
			checks: combineChecks(type.checks, checks)
		});
	}
	return type;
});
const toEncoded$1 = memoizeIdempotent((ast) => {
	return toType$1(flip(ast));
});
function flipEncoding(ast, encoding) {
	const links = encoding;
	const len = links.length;
	const last = links[len - 1];
	const ls = [new Link(flip(replaceEncoding(ast, void 0)), links[0].transformation.flip())];
	for (let i = 1; i < len; i++) ls.unshift(new Link(flip(links[i - 1].to), links[i].transformation.flip()));
	const to = flip(last.to);
	if (to.encoding) return replaceEncoding(to, [...to.encoding, ...ls]);
	else return replaceEncoding(to, ls);
}
const flip = memoize((ast) => {
	if (ast.encoding) return flipEncoding(ast, ast.encoding);
	const owner = getContextOwner(ast);
	if (owner !== ast) {
		const flipped = flip(owner);
		return flipped === owner ? ast : replaceContext(flipped, ast.context);
	}
	return "flip" in ast ? ast.flip(flip) : "recur" in ast ? ast.recur(flip) : ast;
});
function containsUndefined(ast) {
	switch (ast._tag) {
		case "Undefined": return true;
		case "Union": return ast.types.some(containsUndefined);
		default: return false;
	}
}
function fromConst(ast, value) {
	const succeed$6 = value === 0 ? sameExit : succeed(value);
	return (input, options) => {
		if (input === missing) return missingExit;
		if (input === value) return succeed$6;
		return fail$1(new InvalidType(ast, input, options));
	};
}
function fromRefinement(ast, refinement) {
	return (input, options) => {
		if (input === missing) return missingExit;
		if (refinement(input)) return sameExit;
		return fail$1(new InvalidType(ast, input, options));
	};
}
const parameterFromPropertyKey = applyToSelfOrLastLinkEncodingIdempotent((ast) => {
	switch (ast._tag) {
		default: return ast;
		case "Number": return ast.toCodecStringTree();
		case "Union": return ast.recur(parameterFromPropertyKey);
	}
});
const isStringFiniteRegExp = new globalThis.RegExp(`^${FINITE_PATTERN}$`);
const isStringNumberRegExp = new globalThis.RegExp(`^(?:${FINITE_PATTERN}|Infinity|-Infinity|NaN)$`);
function isStringFinite(annotations) {
	return isPattern$1(isStringFiniteRegExp, {
		expected: "a string representing a finite number",
		representation: {
			id: "effect/schema/isStringFinite",
			payload: null
		},
		toJsonSchema: () => ({ pattern: isStringFiniteRegExp.source }),
		...annotations
	});
}
const finiteString = appendChecks(string, [isStringFinite()]);
const finiteToString = new Link(finiteString, numberFromString);
const numberToString = new Link(new Union$1([finiteString, nonFiniteLiterals]), numberFromString);
function collectIssues(checks, value, issues, ast, options) {
	for (let i = 0; i < checks.length; i++) {
		const check = checks[i];
		if (check._tag === "FilterGroup") {
			issues = collectIssues(check.checks, value, issues, ast, options);
			if (issues && (options.errors !== "all" || issues[issues.length - 1].filter.aborted)) return issues;
		} else {
			const issue = check.run(value, ast, options);
			if (issue) {
				const filter = new Filter$1(check, issue, value, options);
				if (issues) issues.push(filter);
				else issues = [filter];
				if (options.errors !== "all" || check.aborted) return issues;
			}
		}
	}
	return issues;
}
function getConstructorDescriptor(ast) {
	if (!isDeclaration(ast)) return void 0;
	const getDescriptor = ast.annotations?.[CONSTRUCTOR_ANNOTATION_KEY];
	return isFunction(getDescriptor) ? getDescriptor(ast.typeParameters) : void 0;
}
function isJsonLeaf(u) {
	return u === null || typeof u === "string" || typeof u === "boolean" || typeof u === "number" && globalThis.Number.isFinite(u);
}
function isStringTreeLeaf(u) {
	return u === void 0 || typeof u === "string";
}
function isTree(u, isLeaf) {
	const cache = new WeakMap();
	const stack = [];
	outer: while (true) {
		if (typeof u !== "object" || u === null) {
			if (!isLeaf(u)) return false;
		} else {
			const value = u;
			const cached = cache.get(value);
			if (cached === false) return false;
			if (cached === void 0) {
				const isArray = Array.isArray(value);
				if (!isArray) {
					const prototype = Object.getPrototypeOf(value);
					if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) return false;
				}
				cache.set(value, false);
				stack.push({
					value,
					keys: isArray ? value.length : Object.keys(value),
					index: 0
				});
			}
		}
		while (stack.length > 0) {
			const frame = stack[stack.length - 1];
			const keys = frame.keys;
			if (typeof keys === "number") {
				if (frame.index < keys) {
					u = frame.value[frame.index++];
					continue outer;
				}
			} else if (frame.index < keys.length) {
				u = frame.value[keys[frame.index++]];
				continue outer;
			}
			cache.set(frame.value, true);
			stack.pop();
		}
		return true;
	}
}
function isJson(u) {
	return isTree(u, isJsonLeaf);
}
const Json$1 = new Declaration([], () => (input, ast, options) => isJson(input) ? sameExit : fail$1(new InvalidType(ast, input, options)), {
	representation: {
		id: "effect/schema/Json",
		payload: null
	},
	expected: "JSON value",
	toCodecJson: () => void 0,
	toCodecStringTree: () => unknownToStringTree
});
function isStringTree(u) {
	return isTree(u, isStringTreeLeaf);
}
const unknownToStringTree = new Link(new Declaration([], () => (input, ast, options) => isStringTree(input) ? sameExit : fail$1(new InvalidType(ast, input, options)), {
	expected: "StringTree",
	toCodecStringTree: () => void 0
}), passthrough());
//#endregion
//#region node_modules/effect/dist/internal/schema/interpreter.js
const flatMapTransformation = (result, current, f) => result === sameExit ? f(current) : flatMapEager(result, f);
function compileTransformation(transformation) {
	if (transformation._tag === "Middleware") return (result, current, options) => {
		const transformed = result === sameExit ? transformation.decode(succeed(toOption(current)), options) : transformation.decode(mapEager(result, toOption), options);
		return fromOptionalEffect(transformed);
	};
	const getter = transformation.decode;
	switch (getter._tag) {
		case "Passthrough": return (result, current) => result === sameExit ? succeed(current) : result;
		case "Transform": {
			const transform = (value) => value === missing ? missingExit : succeed(getter.transform(value));
			return (result, current) => flatMapTransformation(result, current, transform);
		}
		case "TransformOptional": {
			const transform = (value) => fromOptionExit(getter.transform(toOption(value)));
			return (result, current) => flatMapTransformation(result, current, transform);
		}
		case "TransformEffect": return (result, current, options) => flatMapTransformation(result, current, (value) => value === missing ? missingExit : getter.transform(value, options));
		case "TransformOptionalEffect": return (result, current, options) => flatMapTransformation(result, current, (value) => fromOptionalEffect(getter.transform(toOption(value), options)));
	}
}
const fromOptionalEffect = (effect) => flatMapEager(effect, fromOptionExit);
const wrapEncoding = (ast, input, options, effect) => catchCause(effect, (cause) => failCauseSync(() => map$1(cause, (issue) => new Encoding(ast, issue, input, options))));
function makeConstructorParser(descriptor, compile) {
	const transform = compileTransformation(descriptor.link.transformation);
	let sourceParser;
	return (input, options) => {
		if (input === missing) return missingExit;
		if (descriptor.isConstructed(input)) return sameExit;
		const result = (sourceParser ??= compile(descriptor.link.to))(input, options);
		return transform(result, input, options);
	};
}
function withDefault(ast, parser) {
	const defaultValue = ast.context.constructorDefault;
	return (input, options) => {
		if (input !== missing && input !== void 0) return parser(input, options);
		const result = defaultValue;
		if (effectIsExit(result) && result._tag === "Success") {
			const local = parser(result[args], options);
			return local === sameExit ? result : local;
		}
		return flatMapEager(wrapEncoding(ast, input, options, result), (value) => {
			const local = parser(value, options);
			return local === sameExit ? succeed(value) : local;
		});
	};
}
function compileField(ast, compile) {
	const parser = compile(ast);
	return ast.context?.constructorDefault === void 0 ? parser : withDefault(ast, parser);
}
function compile(ast, compile, compileField, base, specialize) {
	if (ast._tag === "Declaration") for (const parameter of ast.typeParameters) compile(parameter);
	const descriptor = compileField ? getConstructorDescriptor(ast) : void 0;
	const parser = descriptor ? makeConstructorParser(descriptor, compile) : base ?? ast.getParser(compile, compileField);
	const checks = ast.checks;
	const links = ast.encoding;
	const transformations = links?.map((link) => compileTransformation(link.transformation));
	const encodingChecks = ast.encodingChecks;
	if (!links && !checks && !encodingChecks) return parser;
	let encodingParsers;
	const parseChecks = (input, options) => {
		let result = parser(input, options);
		if (encodingChecks && !options.disableChecks) {
			if (effectIsExit(result)) {
				if (result._tag === "Success") {
					const output = result === sameExit ? input : result[args];
					if (input !== missing && output !== missing) {
						const issues = collectIssues(encodingChecks, input, void 0, ast, options);
						if (issues) result = fail$1(new Composite(ast, issues, input, options));
					}
				}
			} else result = flatMap(result, (value) => {
				if (input !== missing && value !== missing) {
					const issues = collectIssues(encodingChecks, input, void 0, ast, options);
					if (issues) return fail$1(new Composite(ast, issues, input, options));
				}
				return succeed$1(value);
			});
		}
		if (checks && !options.disableChecks) {
			if (effectIsExit(result)) {
				if (result._tag === "Success") {
					const value = result === sameExit ? input : result[args];
					if (value === missing) return result;
					const issues = collectIssues(checks, value, void 0, ast, options);
					if (issues) result = fail$1(new Composite(ast, issues, value, options));
				}
			} else result = flatMap(result, (value) => {
				if (value !== missing) {
					const issues = collectIssues(checks, value, void 0, ast, options);
					if (issues) return fail$1(new Composite(ast, issues, value, options));
				}
				return succeed$1(value);
			});
		}
		return result;
	};
	const parseLocal = specialize === void 0 ? parseChecks : specialize(parseChecks);
	if (!links) return parseLocal;
	return (input, options) => {
		const parsers = encodingParsers ??= links.map((link) => compile(link.to));
		let current = input;
		let result = parsers[parsers.length - 1](input, options);
		for (let i = links.length - 1; i >= 0; i--) {
			result = transformations[i](result, current, options);
			if (i !== 0) {
				const next = parsers[i - 1];
				if (result._tag === "Success") {
					current = result[args];
					result = next(current, options);
				} else result = flatMapEager(result, (value) => {
					const nextResult = next(value, options);
					return nextResult === sameExit ? succeed(value) : nextResult;
				});
			}
		}
		if (result._tag === "Success") {
			const value = result[args];
			const local = parseLocal(value, options);
			return local === sameExit ? result : local;
		}
		result = wrapEncoding(ast, input, options, result);
		return flatMapEager(result, (value) => {
			const local = parseLocal(value, options);
			return local === sameExit ? succeed(value) : local;
		});
	};
}
//#endregion
//#region node_modules/effect/dist/internal/schema/compilerRegistry.js
const invalid = Symbol();
const cache = new WeakMap();
const decodeChild = (ast) => resolve$2(ast).parser;
const makeChild = (ast) => resolve$2(ast).makeEffect;
const makeField = (ast) => compileField(ast, makeChild);
var InterpretedEntry = class {
	ast;
	constructor(ast) {
		this.ast = ast;
	}
	get decodeEffect() {
		return this.cachedDecodeEffect ??= compile(this.ast, decodeChild);
	}
	get parser() {
		return this.decodeEffect;
	}
	get makeEffect() {
		return this.cachedMakeEffect ??= compile(this.ast, makeChild, makeField);
	}
};
function resolve$2(ast) {
	const cached = cache.get(ast);
	if (cached !== void 0) return cached;
	const entry = new InterpretedEntry(ast);
	cache.set(ast, entry);
	return entry;
}
//#endregion
//#region node_modules/effect/dist/SchemaParser.js
function makeEffect(schema) {
	const ast = schema.ast;
	let parser;
	return (input, options) => {
		return (parser ??= runWithCompiler(constructorCompiler, toType$1(ast)))(input, options?.disableChecks ? options?.parseOptions ? {
			...options.parseOptions,
			disableChecks: true
		} : { disableChecks: true } : options?.parseOptions);
	};
}
function makeOption(schema) {
	const parser = makeEffect(schema);
	return (input, options) => {
		const exit = runSyncExit(parser(input, options));
		if (isSuccess(exit)) return some(exit.value);
		getSchemaIssueOrThrow(exit.cause, "Option adapter can only return none for schema issues");
		return none();
	};
}
function make$2(schema) {
	return makeConstructorSync(toType$1(schema.ast));
}
function is(schema) {
	return _is(schema.ast);
}
function makeIs(ast) {
	{
		const parser = asExit(run$1(ast));
		return (input) => {
			const exit = parser(input, defaultParseOptions);
			if (isSuccess(exit)) return true;
			getSchemaIssueOrThrow(exit.cause, "Type guard adapter can only return false for schema issues");
			return false;
		};
	}
}
function _is(ast) {
	const typeAST = toType$1(ast);
	let guard = (input) => {
		guard = makeIs(typeAST);
		return guard(input);
	};
	return (input) => {
		return guard(input);
	};
}
function decodeUnknownEffect$1(schema, options) {
	const parser = run$1(schema.ast);
	return options === void 0 ? parser : (input, overrideOptions) => parser(input, mergeParseOptions(options, overrideOptions));
}
const mergeParseOptions = (options, overrideOptions) => overrideOptions ? {
	...options,
	...overrideOptions
} : options;
const getValue = (value) => {
	if (value === missing) return fail$1(new InvalidValue());
	return succeed$1(value);
};
function run$1(ast) {
	return runWithCompiler(normalCompiler, ast);
}
function parserResult(result, input) {
	if (result === sameExit) return succeed$1(input);
	if (!effectIsExit(result)) return flatMapEager(result, getValue);
	return result["~effect/Effect/args"] === missing ? getValue(missing) : result;
}
function runWithCompiler(compiler, ast) {
	let parser;
	return (input, options) => {
		const result = (parser ??= compiler(ast))(input, options ?? defaultParseOptions);
		if (result === sameExit) return succeed$1(input);
		if (!effectIsExit(result)) return flatMapEager(result, getValue);
		return result["~effect/Effect/args"] === missing ? getValue(missing) : result;
	};
}
function asExit(parser) {
	return (input, options) => runSyncExit(parser(input, options));
}
function runSync(effect, message) {
	const exit = runSyncExit(effect);
	if (isSuccess(exit)) return exit.value;
	const issue = getSchemaIssueOrThrow(exit.cause, message);
	throw new Error("Schema validation failed", { cause: issue });
}
function makeConstructorSync(ast) {
	let entry;
	let parser;
	return (input, options) => {
		entry ??= resolve$2(ast);
		const parseOptions = options?.disableChecks ? options.parseOptions ? {
			...options.parseOptions,
			disableChecks: true
		} : { disableChecks: true } : options?.parseOptions ?? defaultParseOptions;
		const make = entry.make;
		if (make !== void 0 && input !== missing) {
			let output;
			try {
				output = make(input, parseOptions);
			} catch (error) {
				getSchemaIssueOrThrow(die$1(error), "Constructor adapter can only throw schema issues");
				throw error;
			}
			if (output !== invalid && output !== missing) return output;
		}
		return runSync(parserResult((parser ??= entry.makeEffect)(input, parseOptions), input), "Constructor adapter can only throw schema issues");
	};
}
const normalCompiler = (ast) => resolve$2(ast).parser;
const constructorCompiler = (ast) => resolve$2(ast).makeEffect;
//#endregion
//#region node_modules/effect/dist/internal/schema/make.js
const TypeId$4 = "~effect/Schema/Schema";
const RebuildOptions = Symbol();
const SchemaProto = {
	[TypeId$4]: TypeId$4,
	get make() {
		const value = make$2(this);
		Object.defineProperty(this, "make", {
			value,
			enumerable: true
		});
		return value;
	},
	get makeEffect() {
		const value = makeEffect(this);
		Object.defineProperty(this, "makeEffect", {
			value,
			enumerable: true
		});
		return value;
	},
	get makeOption() {
		const value = makeOption(this);
		Object.defineProperty(this, "makeOption", {
			value,
			enumerable: true
		});
		return value;
	},
	pipe() {
		return pipeArguments(this, arguments);
	},
	annotate(annotations) {
		return this.rebuild(annotate(this.ast, annotations));
	},
	annotateKey(annotations) {
		return this.rebuild(annotateKey(this.ast, annotations));
	},
	check(...checks) {
		return this.rebuild(appendChecks(this.ast, checks));
	},
	rebuild(ast) {
		return make$1(ast, this[RebuildOptions]);
	}
};
function make$1(ast, options) {
	function Schema() {}
	const self = Object.setPrototypeOf(Schema, SchemaProto);
	if (options && (Object.hasOwn(options, "name") || Object.hasOwn(options, "length") || Object.hasOwn(options, "__proto__"))) Object.defineProperties(self, Object.getOwnPropertyDescriptors({ ...options }));
	else Object.assign(self, options);
	self[RebuildOptions] = options;
	self.ast = ast;
	return self;
}
//#endregion
//#region node_modules/effect/dist/internal/schema/toEquivalence.js
const toEquivalence$1 = memoize((ast) => {
	return recur(ast);
});
function recur(ast) {
	const annotation = resolve$3(ast)?.["toEquivalence"];
	if (annotation) return annotation(isDeclaration(ast) ? ast.typeParameters.map(recur) : []);
	switch (ast._tag) {
		case "Never": return strictEqual();
		case "Declaration": return declarationEquivalence(ast);
		case "Null":
		case "Undefined":
		case "Void":
		case "Unknown":
		case "Any":
		case "String":
		case "Number":
		case "Boolean":
		case "BigInt":
		case "Symbol":
		case "Literal":
		case "UniqueSymbol":
		case "ObjectKeyword":
		case "Enum":
		case "TemplateLiteral": return equals$1;
		case "Arrays": {
			const elements = ast.elements.map(recur);
			const rest = ast.rest.map(recur);
			const [head, ...tail] = rest;
			const tailLength = tail.length;
			return make$16((a, b) => {
				if (!Array.isArray(a) || !Array.isArray(b)) return false;
				const len = a.length;
				if (len !== b.length) return false;
				let i = 0;
				for (; i < Math.min(len, ast.elements.length); i++) if (!elements[i](a[i], b[i])) return false;
				if (rest.length > 0) {
					for (; i < len - tailLength; i++) if (!head(a[i], b[i])) return false;
					for (let j = 0; j < tailLength; j++) if (!tail[j](a[i + j], b[i + j])) return false;
				}
				return true;
			});
		}
		case "Objects": {
			if (ast.propertySignatures.length === 0 && ast.indexSignatures.length === 0) return equals$1;
			const propertySignatures = ast.propertySignatures.map((ps) => recur(ps.type));
			const indexSignatures = ast.indexSignatures.map((is) => recur(is.type));
			return make$16((a, b) => {
				if (!isObject(a) || !isObject(b)) return false;
				for (let i = 0; i < propertySignatures.length; i++) {
					const ps = ast.propertySignatures[i];
					const name = ps.name;
					const aHas = Object.hasOwn(a, name);
					const bHas = Object.hasOwn(b, name);
					if (isOptional(ps.type)) {
						if (aHas !== bHas) return false;
					}
					if (aHas && bHas && !propertySignatures[i](a[name], b[name])) return false;
				}
				for (let i = 0; i < indexSignatures.length; i++) {
					const is = ast.indexSignatures[i];
					const aKeys = getIndexSignatureKeys(a, is.parameter);
					const bKeys = getIndexSignatureKeys(b, is.parameter);
					if (aKeys.length !== bKeys.length) return false;
					for (let j = 0; j < aKeys.length; j++) {
						const key = aKeys[j];
						if (!Object.hasOwn(b, key) || !indexSignatures[i](a[key], b[key])) return false;
					}
				}
				return true;
			});
		}
		case "Union": {
			const types = toType$1(ast).types;
			const index = getCandidateIndex(types);
			const compiled = types.map((candidate, i) => [_is(candidate), recur(ast.types[i])]);
			return make$16((a, b) => {
				const candidates = index(a, false);
				for (let i = 0; i < candidates.length; i++) {
					const [is, equivalence] = compiled[candidates[i]];
					if (is(a) && is(b)) return equivalence(a, b);
				}
				return false;
			});
		}
		case "Suspend": {
			let equivalence;
			return make$16((a, b) => (equivalence ??= toEquivalence$1(ast.thunk()))(a, b));
		}
	}
}
function declarationEquivalence(ast) {
	const representation = ast.annotations?.representation;
	if (representation === void 0) return equals$1;
	switch (representation.id) {
		case "effect/schema/Option": {
			const [value] = declarationTypeParameters(ast);
			return (a, b) => a._tag === b._tag && (a._tag === "None" || value(a.value, b.value));
		}
		case "effect/schema/Result": {
			const [success, failure] = declarationTypeParameters(ast);
			return (a, b) => a._tag === b._tag && (a._tag === "Success" ? success(a.success, b.success) : failure(a.failure, b.failure));
		}
		case "effect/schema/CauseReason": {
			const [error, defect] = declarationTypeParameters(ast);
			return causeReasonEquivalence(error, defect);
		}
		case "effect/schema/Cause": {
			const [error, defect] = declarationTypeParameters(ast);
			return causeEquivalence(error, defect);
		}
		case "effect/schema/Exit": {
			const [value, error, defect] = declarationTypeParameters(ast);
			const cause = causeEquivalence(error, defect);
			return (a, b) => a._tag === b._tag && (a._tag === "Success" ? value(a.value, b.value) : cause(a.cause, b.cause));
		}
		case "effect/schema/ReadonlyMap": {
			const [key, value] = declarationTypeParameters(ast);
			return makeCompareMap(key, value);
		}
		case "effect/schema/ReadonlySet": return makeCompareSet(declarationTypeParameters(ast)[0]);
		case "effect/schema/RegExp": return (a, b) => a.source === b.source && a.flags === b.flags;
		case "effect/schema/URL": return (a, b) => a.toString() === b.toString();
		default: return equals$1;
	}
}
function declarationTypeParameters(ast) {
	return ast.typeParameters.map(recur);
}
function causeReasonEquivalence(error, defect) {
	return (a, b) => {
		if (a._tag !== b._tag) return false;
		switch (a._tag) {
			case "Fail": return error(a.error, b.error);
			case "Die": return defect(a.defect, b.defect);
			case "Interrupt": return a.fiberId === b.fiberId;
		}
	};
}
function causeEquivalence(error, defect) {
	const reasons = Array_(causeReasonEquivalence(error, defect));
	return (a, b) => reasons(a.reasons, b.reasons);
}
//#endregion
//#region node_modules/effect/dist/Struct.js
const lambda = (f) => f;
//#endregion
//#region node_modules/effect/dist/internal/schemaError.js
const SchemaErrorTypeId = "~effect/Schema/SchemaError";
function isSchemaError$1(u) {
	return hasProperty(u, "~effect/Schema/SchemaError") && u["~effect/Schema/SchemaError"] === "~effect/Schema/SchemaError";
}
({ ...BaseProto });
({ ...BaseProto });
({ ...BaseProto });
({ ...BaseProto });
({ ...BaseProto });
({ ...BaseProto });
({ ...BaseProto });
({ ...BaseProto });
//#endregion
//#region node_modules/effect/dist/Schema.js
const TypeId$1 = TypeId$4;
function declareConstructor() {
	return (typeParameters, run, annotations) => {
		return make(new Declaration(typeParameters.map(getAST), (typeParameters) => run(typeParameters.map((ast) => make(ast))), annotations));
	};
}
function declare(is, annotations) {
	return declareConstructor()([], () => (input, ast, options) => is(input) ? succeed$1(input) : fail$1(new InvalidType(ast, input, options)), annotations);
}
var SchemaError = class extends TaggedError$1("SchemaError") {
	[SchemaErrorTypeId] = SchemaErrorTypeId;
	constructor(issue) {
		const stackTraceLimit = getStackTraceLimit();
		setStackTraceLimit(0);
		try {
			super({ issue });
		} finally {
			setStackTraceLimit(stackTraceLimit);
		}
	}
	get message() {
		return defaultFormatter(this.issue);
	}
	toJSON() {
		return {
			_tag: this._tag,
			message: this.message
		};
	}
	[NodeInspectSymbol]() {
		return this.toJSON();
	}
	toString() {
		return `SchemaError(${this.message})`;
	}
};
function isSchemaError(u) {
	return isSchemaError$1(u);
}
function fromIssueEffect(self) {
	if (effectIsExit(self)) return fromIssueExit(self);
	return catchCause(self, (cause) => failCauseSync(() => map$1(cause, (issue) => new SchemaError(issue))));
}
function fromIssueExit(exit) {
	return isSuccess(exit) ? exit : failCause$2(map$1(exit.cause, (issue) => new SchemaError(issue)));
}
function getSchemaErrorOrThrow(cause, message) {
	let schemaError;
	for (const reason of cause.reasons) {
		if (!isFailReason(reason) || !isSchemaError(reason.error)) throw new globalThis.Error(message, { cause });
		schemaError ??= reason.error;
	}
	if (schemaError === void 0) throw new globalThis.Error(message, { cause });
	return schemaError;
}
function runSchemaErrorSync(self) {
	const exit = runSyncExit(self);
	if (isSuccess(exit)) return exit.value;
	throw getSchemaErrorOrThrow(exit.cause, "Sync adapter can only throw schema errors");
}
function decodeUnknownEffect(schema, options) {
	const parser = decodeUnknownEffect$1(schema, options);
	return (input, options) => {
		return fromIssueEffect(parser(input, options));
	};
}
const decodeEffect = decodeUnknownEffect;
function decodeUnknownSync(schema, options) {
	const parser = decodeUnknownEffect(schema, options);
	return (input, options) => {
		return runSchemaErrorSync(parser(input, options));
	};
}
const make = make$1;
function isSchema(u) {
	return hasProperty(u, TypeId$1) && u[TypeId$1] === TypeId$1;
}
const optionalKey = lambda((schema) => make(optionalKey$1(schema.ast), { schema }));
const toType = lambda((schema) => make(toType$1(schema.ast), { schema }));
const toEncoded = lambda((schema) => make(toEncoded$1(schema.ast), { schema }));
function Literal(literal) {
	const out = make(new Literal$1(literal), {
		literal,
		transform(to) {
			return out.pipe(decodeTo(Literal(to), {
				decode: transform$1(() => to),
				encode: transform$1(() => literal)
			}));
		}
	});
	return out;
}
const Unknown = make(unknown);
const Null = make(null_);
const String$1 = make(string);
const Number$1 = make(number);
const Boolean$1 = make(boolean);
function makeStruct(ast, fields) {
	return make(ast, {
		fields,
		mapFields(f, options) {
			const fields = f(this.fields);
			return makeStruct(struct(fields, options?.unsafePreserveChecks ? this.ast.checks : void 0), fields);
		}
	});
}
function Struct(fields) {
	return makeStruct(struct(fields, void 0), fields);
}
function Record(key, value) {
	return make(record(key.ast, value.ast), {
		key,
		value
	});
}
function makeTuple(ast, elements) {
	return make(ast, {
		elements,
		mapElements(f, options) {
			const elements = f(this.elements);
			return makeTuple(tuple(elements, options?.unsafePreserveChecks ? this.ast.checks : void 0), elements);
		}
	});
}
function Tuple(elements) {
	return makeTuple(tuple(elements), elements);
}
const ArraySchema = lambda((schema) => make(new Arrays(false, [], [schema.ast]), { value: schema }));
const NonEmptyArray = lambda((schema) => make(new Arrays(false, [schema.ast], [schema.ast]), { value: schema }));
function makeUnion(ast, members) {
	return make(ast, {
		members,
		mapMembers(f, options) {
			const members = f(this.members);
			return makeUnion(union(members, this.ast.options, options?.unsafePreserveChecks ? this.ast.checks : void 0), members);
		}
	});
}
function Union(members, options) {
	return makeUnion(union(members, options, void 0), members);
}
function Literals(literals) {
	const members = literals.map(Literal);
	return make(union(members, void 0, void 0), {
		literals,
		members,
		mapMembers(f) {
			return Union(f(this.members));
		},
		pick(literals) {
			return Literals(literals);
		},
		transform(to) {
			return Union(members.map((member, index) => member.transform(to[index])));
		}
	});
}
const NullOr = lambda((self) => Union([self, Null]));
function brand(identifier) {
	return (schema) => make(schema.ast, {
		schema,
		identifier
	});
}
function decodeTo(to, transformation) {
	return (from) => {
		return make(decodeTo$1(from.ast, to.ast, transformation ? makeTransformation(transformation) : passthrough()), {
			from,
			to
		});
	};
}
function withConstructorDefault(defaultValue) {
	return (schema) => make(withConstructorDefault$1(schema.ast, defaultValue), { schema });
}
function tag(literal) {
	return Literal(literal).pipe(withConstructorDefault(succeed$1(literal)));
}
function TaggedStruct(value, fields) {
	return Struct({
		_tag: tag(value),
		...fields
	});
}
function toTaggedUnion(tag) {
	return (self) => {
		const cases = {};
		const discriminants = [];
		const discriminantKeys = new Set();
		const guards = {};
		const isAnyOf = (keys) => (value) => keys.includes(value[tag]);
		walk(self);
		return Object.assign(self, {
			tag,
			cases,
			discriminants,
			isAnyOf,
			guards,
			match,
			matchOrElse
		});
		function walk(schema) {
			const ast = schema.ast;
			if (isUnion(ast) && "members" in schema && globalThis.Array.isArray(schema.members) && schema.members.every(isSchema)) return schema.members.forEach(walk);
			const sentinels = collectSentinels(ast);
			if (sentinels.length > 0) {
				const literal = sentinels.find((s) => s.key === tag)?.literal;
				if (isPropertyKey(literal)) {
					const key = typeof literal === "number" ? globalThis.String(literal) : literal;
					if (discriminantKeys.has(key)) throw new globalThis.Error(`Duplicate discriminant: ${globalThis.String(literal)}`);
					discriminantKeys.add(key);
					discriminants.push(literal);
					assignProperty(cases, literal, schema);
					assignProperty(guards, literal, is(toType(schema)));
					return;
				}
			}
			throw new globalThis.Error("No literal or unique symbol found");
		}
		function match() {
			if (arguments.length === 1) {
				const cases = arguments[0];
				return function(value) {
					const key = value[tag];
					return (Object.hasOwn(cases, key) ? cases[key] : void 0)(value);
				};
			}
			const value = arguments[0];
			const cases = arguments[1];
			const key = value[tag];
			return (Object.hasOwn(cases, key) ? cases[key] : void 0)(value);
		}
		function matchOrElse() {
			if (arguments.length === 2) {
				const cases = arguments[0];
				const orElse = arguments[1];
				return function(value) {
					const key = value[tag];
					return (Object.hasOwn(cases, key) ? cases[key] ?? orElse : orElse)(value);
				};
			}
			const value = arguments[0];
			const cases = arguments[1];
			const orElse = arguments[2];
			const key = value[tag];
			return (Object.hasOwn(cases, key) ? cases[key] ?? orElse : orElse)(value);
		}
	};
}
function instanceOf(constructor, annotations) {
	return declare((u) => u instanceof constructor, annotations);
}
function link() {
	return (encodeTo, transformation) => {
		return new Link(encodeTo.ast, makeTransformation(transformation));
	};
}
const makeFilter = makeFilter$1;
function isPattern(regExp, annotations) {
	const source = regExp.source;
	const flags = regExp.flags;
	const canExport = /^[dg]*uy?$/.test(flags);
	const runtimeRegExp = flags === "" ? `new RegExp(${format$1(source)})` : `new RegExp(${format$1(source)}, ${format$1(flags)})`;
	return isPattern$1(regExp, {
		toJsonSchema: () => canExport ? { pattern: flags.endsWith("y") ? `^(?:${source})` : source } : [{}, true],
		toCode: () => ({ runtime: `Schema.isPattern(${runtimeRegExp})` }),
		...annotations
	});
}
function makeIsGreaterThanOrEqualTo(options) {
	const gte = isGreaterThanOrEqualTo$1(options.order);
	const formatter = options.formatter ?? format$1;
	return (minimum, annotations) => {
		return makeFilter((input) => gte(input, minimum), {
			expected: `a value greater than or equal to ${formatter(minimum)}`,
			arbitraryConstraint: {
				order: options.order,
				minimum
			},
			...options.annotate?.(minimum),
			...annotations
		});
	};
}
function makeIsLessThanOrEqualTo(options) {
	const lte = isLessThanOrEqualTo$1(options.order);
	const formatter = options.formatter ?? format$1;
	return (maximum, annotations) => {
		return makeFilter((input) => lte(input, maximum), {
			expected: `a value less than or equal to ${formatter(maximum)}`,
			arbitraryConstraint: {
				order: options.order,
				maximum
			},
			...options.annotate?.(maximum),
			...annotations
		});
	};
}
function makeIsBetween(deriveOptions) {
	const greaterThanOrEqualTo = isGreaterThanOrEqualTo$1(deriveOptions.order);
	const greaterThan = isGreaterThan$1(deriveOptions.order);
	const lessThanOrEqualTo = isLessThanOrEqualTo$1(deriveOptions.order);
	const lessThan = isLessThan$1(deriveOptions.order);
	const formatter = deriveOptions.formatter ?? format$1;
	return (options, annotations) => {
		const gte = options.exclusiveMinimum ? greaterThan : greaterThanOrEqualTo;
		const lte = options.exclusiveMaximum ? lessThan : lessThanOrEqualTo;
		return makeFilter((input) => gte(input, options.minimum) && lte(input, options.maximum), {
			expected: `a value between ${formatter(options.minimum)}${options.exclusiveMinimum ? " (excluded)" : ""} and ${formatter(options.maximum)}${options.exclusiveMaximum ? " (excluded)" : ""}`,
			arbitraryConstraint: {
				order: deriveOptions.order,
				minimum: options.minimum,
				maximum: options.maximum,
				...options.exclusiveMinimum && { exclusiveMinimum: true },
				...options.exclusiveMaximum && { exclusiveMaximum: true }
			},
			...deriveOptions.annotate?.(options),
			...annotations
		});
	};
}
function encodeNumberPayload(number) {
	if (!globalThis.Number.isFinite(number)) throw new globalThis.RangeError(`Expected a finite number, got ${format$1(number)}`);
	return number;
}
const isGreaterThanOrEqualTo = makeIsGreaterThanOrEqualTo({
	order: Number$4,
	annotate: (minimum) => ({
		representation: {
			id: "effect/schema/isGreaterThanOrEqualTo",
			payload: { minimum: encodeNumberPayload(minimum) }
		},
		toJsonSchema: () => ({ minimum }),
		toCode: () => ({ runtime: `Schema.isGreaterThanOrEqualTo(${format$1(minimum)})` })
	})
});
const isLessThanOrEqualTo = makeIsLessThanOrEqualTo({
	order: Number$4,
	annotate: (maximum) => ({
		representation: {
			id: "effect/schema/isLessThanOrEqualTo",
			payload: { maximum: encodeNumberPayload(maximum) }
		},
		toJsonSchema: () => ({ maximum }),
		toCode: () => ({ runtime: `Schema.isLessThanOrEqualTo(${format$1(maximum)})` })
	})
});
const isBetween = makeIsBetween({
	order: Number$4,
	annotate: (options) => {
		const exclusiveMinimum = options.exclusiveMinimum ? true : void 0;
		const exclusiveMaximum = options.exclusiveMaximum ? true : void 0;
		return {
			representation: {
				id: "effect/schema/isBetween",
				payload: {
					minimum: encodeNumberPayload(options.minimum),
					maximum: encodeNumberPayload(options.maximum),
					...exclusiveMinimum && { exclusiveMinimum },
					...exclusiveMaximum && { exclusiveMaximum }
				}
			},
			toJsonSchema: () => ({
				[exclusiveMinimum ? "exclusiveMinimum" : "minimum"]: options.minimum,
				[exclusiveMaximum ? "exclusiveMaximum" : "maximum"]: options.maximum
			}),
			toCode: () => ({ runtime: `Schema.isBetween({ minimum: ${format$1(options.minimum)}, maximum: ${format$1(options.maximum)}, exclusiveMinimum: ${format$1(exclusiveMinimum)}, exclusiveMaximum: ${format$1(exclusiveMaximum)} })` })
		};
	}
});
function isInt(annotations) {
	return makeFilter((n) => globalThis.Number.isSafeInteger(n), {
		expected: "an integer",
		representation: {
			id: "effect/schema/isInt",
			payload: null
		},
		toJsonSchema: () => ({
			type: "integer",
			minimum: globalThis.Number.MIN_SAFE_INTEGER,
			maximum: globalThis.Number.MAX_SAFE_INTEGER
		}),
		toCode: () => ({ runtime: "Schema.isInt()" }),
		arbitraryConstraint: { number: "integer" },
		...annotations
	});
}
const Int = Number$1.check(isInt());
const Natural = Int.check(isGreaterThanOrEqualTo(0));
function makeIsMinLength(minLength, minCodePoints, annotations) {
	return makeFilter((input) => input.length >= minLength, {
		expected: `a value with a length of at least ${minLength}`,
		representation: {
			id: "effect/schema/isMinLength",
			payload: { minLength }
		},
		toJsonSchema: ({ type }) => type === "string" ? minLength <= 1 ? { minLength: minCodePoints } : [{ minLength: minCodePoints }, true] : type === "array" ? { minItems: minLength } : type === void 0 ? [{
			minLength: minCodePoints,
			minItems: minLength
		}, true] : [{}, true],
		toCode: () => ({ runtime: `Schema.isMinLength(${minLength})` }),
		[STRUCTURAL_ANNOTATION_KEY]: true,
		arbitraryConstraint: { minLength },
		...annotations
	});
}
function isNonEmpty(annotations) {
	return makeIsMinLength(1, 1, annotations);
}
function isBetweenLength(minimum, maximum, annotations) {
	minimum = normalizeCardinality(minimum);
	maximum = normalizeCardinality(maximum);
	return makeFilter((input) => input.length >= minimum && input.length <= maximum, {
		expected: minimum === maximum ? `a value with a length of ${minimum}` : `a value with a length between ${minimum} and ${maximum}`,
		representation: {
			id: "effect/schema/isBetweenLength",
			payload: {
				minimum,
				maximum
			}
		},
		toJsonSchema: ({ type }) => type === "string" ? maximum === 0 || Math.ceil(minimum / 2) > maximum ? {
			minLength: Math.ceil(minimum / 2),
			maxLength: maximum
		} : [{
			minLength: Math.ceil(minimum / 2),
			maxLength: maximum
		}, true] : type === "array" ? {
			minItems: minimum,
			maxItems: maximum
		} : type === void 0 ? [{
			minLength: Math.ceil(minimum / 2),
			maxLength: maximum,
			minItems: minimum,
			maxItems: maximum
		}, true] : [{}, true],
		toCode: () => ({ runtime: `Schema.isBetweenLength(${minimum}, ${maximum})` }),
		[STRUCTURAL_ANNOTATION_KEY]: true,
		arbitraryConstraint: {
			minLength: minimum,
			maxLength: maximum
		},
		...annotations
	});
}
function normalizeCardinality(value) {
	if (!globalThis.Number.isFinite(value)) throw new globalThis.RangeError(`Expected a finite number, got ${value}`);
	return Math.max(0, Math.floor(value));
}
const NonEmptyString = String$1.check(isNonEmpty());
const getErrorOptionsKey = (options) => (options?.includeStack === true ? 1 : 0) | (options?.excludeCause === true ? 2 : 0);
const getErrorOptions = (key) => {
	switch (key) {
		case 0: return;
		case 1: return { includeStack: true };
		case 2: return { excludeCause: true };
		case 3: return {
			includeStack: true,
			excludeCause: true
		};
	}
};
const defectSchemaCache = [];
function Defect(options) {
	const key = getErrorOptionsKey(options);
	const cached = defectSchemaCache[key];
	if (cached !== void 0) return cached;
	const schema = Json.pipe(decodeTo(Unknown, defectFromJson(getErrorOptions(key))));
	defectSchemaCache[key] = schema;
	return schema;
}
globalThis.RegExp;
const URLString = String$1.annotate({ expected: "a string that will be decoded as a URL" });
const URL$1 = instanceOf(globalThis.URL, {
	representation: {
		id: "effect/schema/URL",
		payload: null
	},
	toCode: () => ({
		runtime: `Schema.URL`,
		Type: `globalThis.URL`
	}),
	expected: "URL",
	toCodecJson: () => link()(URLString, urlFromString)
});
const URLFromString = URLString.pipe(decodeTo(URL$1, urlFromString));
globalThis.File;
globalThis.FormData;
globalThis.URLSearchParams;
const Base64String = String$1.annotate({
	expected: "a base64 encoded string that will be decoded as Uint8Array",
	format: "byte",
	contentEncoding: "base64"
});
const Uint8Array$1 = instanceOf(globalThis.Uint8Array, {
	representation: {
		id: "effect/schema/Uint8Array",
		payload: null
	},
	toCode: () => ({
		runtime: `Schema.Uint8Array`,
		Type: `globalThis.Uint8Array`
	}),
	expected: "Uint8Array",
	toCodecJson: () => link()(Base64String, uint8ArrayFromBase64String)
});
const Uint8ArrayFromBase64 = Base64String.pipe(decodeTo(Uint8Array$1, uint8ArrayFromBase64String));
const immerable = globalThis.Symbol.for("immer-draftable");
const payloadToken = {};
function makeClass(Inherited, identifier, struct$1, annotations, proto) {
	const getClassSchema = getClassSchemaFactory(struct$1, identifier, annotations);
	const ClassTypeId = getClassTypeId(identifier);
	const out = class extends Inherited {
		constructor(...[input, options]) {
			const payload = options?.["~payload"];
			const value = payload?.token === payloadToken ? payload.value : struct$1.make(input ?? {}, options);
			super(value, {
				...options,
				disableChecks: true,
				"~payload": {
					token: payloadToken,
					value
				}
			});
		}
		static [TypeId$1] = TypeId$1;
		get [ClassTypeId]() {
			return ClassTypeId;
		}
		static [immerable] = true;
		static identifier = identifier;
		static fields = struct$1.fields;
		static get ast() {
			return getClassSchema(this).ast;
		}
		static pipe() {
			return pipeArguments(this, arguments);
		}
		static rebuild(ast) {
			return getClassSchema(this).rebuild(ast);
		}
		static make(input, options) {
			return make$2(getClassSchema(this))(input ?? {}, options);
		}
		static makeOption(input, options) {
			return makeOption(getClassSchema(this))(input ?? {}, options);
		}
		static makeEffect(input, options) {
			return getClassSchema(this).makeEffect(input ?? {}, options);
		}
		static annotate(annotations) {
			return this.rebuild(annotate(this.ast, annotations));
		}
		static annotateKey(annotations) {
			return this.rebuild(annotateKey(this.ast, annotations));
		}
		static check(...checks) {
			return this.rebuild(appendChecks(this.ast, checks));
		}
		static extend(identifier) {
			return (schema, annotations) => {
				const extension = isStruct(schema) ? schema : Struct(schema);
				const fields = {
					...struct$1.fields,
					...extension.fields
				};
				const ast = struct(fields, struct$1.ast.checks, { identifier });
				return makeClass(this, identifier, makeStruct(appendChecks(ast, extension.ast.checks), fields), annotations, proto);
			};
		}
		static mapFields(f, options) {
			return struct$1.mapFields(f, options);
		}
	};
	if (proto !== void 0) Object.assign(out.prototype, proto(identifier));
	return out;
}
function getClassTransformation(self) {
	return new Transformation(transform$1((input) => new self(input, { "~payload": {
		token: payloadToken,
		value: input
	} })), passthrough$1());
}
function getClassTypeId(identifier) {
	return `~effect/Schema/Class/${identifier}`;
}
function getClassSchemaFactory(from, identifier, annotations) {
	let memo;
	return (self) => {
		if (memo !== void 0) return memo;
		const ClassTypeId = getClassTypeId(identifier);
		const isClassValue = (input) => input instanceof self || hasProperty(input, ClassTypeId);
		const transformation = getClassTransformation(self);
		return memo = decodeTo(make(new Declaration([from.ast], () => (input, ast, options) => {
			return isClassValue(input) ? succeed$1(input) : fail$1(new InvalidType(ast, input, options));
		}, {
			identifier,
			[CONSTRUCTOR_ANNOTATION_KEY]: ([from]) => ({
				isConstructed: isClassValue,
				link: new Link(from, transformation)
			}),
			toCodec: ([from]) => new Link(from.ast, transformation),
			toEquivalence: ([from]) => from,
			toFormatter: ([from]) => (t) => `${self.identifier}(${from(t)})`,
			[SENTINELS_ANNOTATION_KEY]: collectSentinels(from.ast),
			...annotations
		})), transformation)(from);
	};
}
function isStruct(schema) {
	return isSchema(schema);
}
const Error$1 = (identifier) => (schema, annotations) => {
	const struct = isStruct(schema) ? schema : Struct(schema);
	return makeClass(Error$3, identifier, struct, annotations, (identifier) => ({ name: identifier }));
};
const TaggedError = (identifier) => {
	return (tagValue, schema, annotations) => {
		const struct = isStruct(schema) ? schema.mapFields((fields) => ({
			_tag: tag(tagValue),
			...fields
		}), { unsafePreserveChecks: true }) : TaggedStruct(tagValue, schema);
		return Error$1(identifier ?? tagValue)(struct, annotations);
	};
};
function toEquivalence(schema) {
	return toEquivalence$1(schema.ast);
}
const Json = make(annotate(Json$1, { toCode: () => ({
	runtime: "Schema.Json",
	Type: "Schema.Json"
}) }));
const JsonObject = Record(String$1, Json);
//#endregion
//#region node_modules/effect/dist/Console.js
const Console = ConsoleRef;
const consoleWith = (f) => withFiber((fiber) => f(fiber.getRef(Console)));
const error = (...args) => consoleWith((console) => sync$1(() => {
	console.error(...args);
}));
const ValueMatcherProto = {
	["~effect/Match/Matcher"]: {
		_input: identity,
		_filters: identity,
		_result: identity,
		_return: identity,
		_flavor: identity
	},
	_tag: "ValueMatcher",
	add(_case) {
		if (isSuccess$1(this.value)) return this;
		if (_case._tag === "When" && _case.guard(this.provided) === true) return makeValueMatcher(this.provided, succeed$4(_case.evaluate(this.provided)));
		else if (_case._tag === "Not" && _case.guard(this.provided) === false) return makeValueMatcher(this.provided, succeed$4(_case.evaluate(this.provided)));
		return this;
	},
	pipe() {
		return pipeArguments(this, arguments);
	}
};
function makeValueMatcher(provided, value) {
	const matcher = Object.create(ValueMatcherProto);
	matcher.provided = provided;
	matcher.value = value;
	return matcher;
}
const makeWhen = (guard, evaluate) => ({
	_tag: "When",
	guard,
	evaluate
});
const makePredicate = (pattern) => {
	if (typeof pattern === "function") return pattern;
	else if (Array.isArray(pattern)) {
		const predicates = pattern.map(makePredicate);
		const len = predicates.length;
		return (u) => {
			if (!Array.isArray(u)) return false;
			for (let i = 0; i < len; i++) if (predicates[i](u[i]) === false) return false;
			return true;
		};
	} else if (pattern !== null && typeof pattern === "object") {
		const keysAndPredicates = Reflect.ownKeys(pattern).map((key) => [key, makePredicate(pattern[key])]);
		const len = keysAndPredicates.length;
		return (u) => {
			if (typeof u !== "object" || u === null) return false;
			for (let i = 0; i < len; i++) {
				const [key, predicate] = keysAndPredicates[i];
				if (!(key in u) || predicate(u[key]) === false) return false;
			}
			return true;
		};
	}
	return (u) => u === pattern;
};
const value$1 = (i) => makeValueMatcher(i, fail$5(i));
const when$1 = (pattern, f) => (self) => self.add(makeWhen(makePredicate(pattern), f));
const discriminators = (field) => (fields) => {
	const predicate = makeWhen((arg) => arg != null && Object.hasOwn(fields, arg[field]), (data) => fields[data[field]](data));
	return (self) => self.add(predicate);
};
const discriminatorsExhaustive$1 = (field) => (fields) => {
	const addCases = discriminators(field)(fields);
	return (matcher) => exhaustive$1(addCases(matcher));
};
const result = (self) => {
	if (self._tag === "ValueMatcher") return self.value;
	const len = self.cases.length;
	if (len === 1) {
		const _case = self.cases[0];
		return (...args) => {
			const input = self.select(...args);
			if (_case._tag === "When" && _case.guard(input) === true) return succeed$4(_case.evaluate(input, ...args));
			else if (_case._tag === "Not" && _case.guard(input) === false) return succeed$4(_case.evaluate(input, ...args));
			return fail$5(input);
		};
	}
	return (...args) => {
		const input = self.select(...args);
		for (let i = 0; i < len; i++) {
			const _case = self.cases[i];
			if (_case._tag === "When" && _case.guard(input) === true) return succeed$4(_case.evaluate(input, ...args));
			else if (_case._tag === "Not" && _case.guard(input) === false) return succeed$4(_case.evaluate(input, ...args));
		}
		return fail$5(input);
	};
};
const getExhaustiveAbsurdErrorMessage = "effect/match/Match/exhaustive: absurd";
const exhaustive$1 = (self) => {
	const toResult = result(self);
	if (isResult(toResult)) {
		if (isSuccess$1(toResult)) return toResult.success;
		throw new Error(getExhaustiveAbsurdErrorMessage);
	}
	return (...args) => {
		const result = toResult(...args);
		if (isSuccess$1(result)) return result.success;
		throw new Error(getExhaustiveAbsurdErrorMessage);
	};
};
//#endregion
//#region node_modules/effect/dist/Match.js
const value = value$1;
const when = when$1;
const discriminatorsExhaustive = discriminatorsExhaustive$1;
const exhaustive = exhaustive$1;
//#endregion
//#region contracts/Plugin.ts
const PluginId = String$1.check(isBetweenLength(1, 64), isPattern(/^(?!.*(?:--|\.\.))[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/)).pipe(brand("pluginsdk/PluginId"));
const Directory = NonEmptyString.pipe(brand("pluginsdk/Directory"));
const PackagePath = String$1.check(isPattern(/^(?![A-Za-z]:)[^/\\\u0000]+(?:\/[^/\\\u0000]+)*$/), makeFilter((path) => path.isWellFormed() && path.split("/").every((segment) => segment !== "." && segment !== ".."), { expected: "a valid Unicode package path without dot segments" })).pipe(brand("pluginsdk/PackagePath"));
const ProcessText = String$1.check(makeFilter((value) => value.isWellFormed() && !value.includes("\0"), { expected: "valid Unicode process text without NUL" })).pipe(brand("pluginsdk/ProcessText"));
const ExecutableName = String$1.check(isPattern(/^[A-Za-z0-9_.+-]+$/), makeFilter((value) => value !== "." && value !== ".." && !value.startsWith("-"), { expected: "a bare executable name" })).pipe(brand("pluginsdk/ExecutableName"));
const HeaderName = String$1.check(isPattern(/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/)).pipe(brand("pluginsdk/HeaderName"));
const HeaderText = String$1.check(isPattern(/^[\t\x20-\x7e\x80-\xff]*$/));
const EnvironmentName = String$1.check(isPattern(/^[A-Za-z_][A-Za-z0-9_]*$/)).pipe(brand("pluginsdk/EnvironmentName"));
const McpName = NonEmptyString.check(makeFilter((name) => name.isWellFormed(), { expected: "a nonempty Unicode MCP server name" }));
const EnvironmentReference = Struct({
	type: Literal("environment"),
	name: EnvironmentName
});
const HeaderValue = Union([HeaderText, Struct({
	...EnvironmentReference.fields,
	prefix: HeaderText
})]);
const RemoteMcp = Struct({
	url: URLFromString.check(makeFilter((url) => url.username === "" && url.password === "" && !url.href.includes("#") && !url.href.includes("${"), { expected: "a literal endpoint without credentials or a fragment" }), makeFilter((url) => url.protocol === "https:" || url.protocol === "http:" && (url.hostname === "localhost" || url.hostname === "[::1]" || /^127(?:\.\d{1,3}){3}$/.test(url.hostname)), { expected: "an HTTPS or loopback HTTP URL" })),
	headers: Record(HeaderName, HeaderValue)
});
const FileReference = Struct({ file: PackagePath });
const processFields = {
	command: Union([ExecutableName, FileReference]),
	args: optionalKey(ArraySchema(Union([ProcessText, FileReference]))),
	cwd: optionalKey(PackagePath),
	env: optionalKey(Record(EnvironmentName, Union([ProcessText, EnvironmentReference])))
};
const StdioMcp = Struct({
	type: Literal("stdio"),
	...processFields
});
const HookName = NonEmptyString.check(makeFilter((name) => name.isWellFormed(), { expected: "a nonempty Unicode hook name" })).pipe(brand("pluginsdk/HookName"));
const HookEvent = Literals(["SessionStart", "UserPromptSubmit"]);
const HookTimeout = Int.check(isBetween({
	minimum: 1,
	maximum: 600
})).pipe(brand("pluginsdk/HookTimeout"));
const CommandHook = Struct({
	...processFields,
	event: HookEvent,
	timeout: optionalKey(HookTimeout)
});
const McpServer = Union([RemoteMcp, StdioMcp]);
const AgentName = String$1.check(isBetweenLength(1, 64), isPattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).pipe(brand("pluginsdk/AgentName"));
const AgentText = NonEmptyString.check(makeFilter((text) => text.isWellFormed() && !text.includes("\0") && text.trim() === text, { expected: "nonempty canonical Unicode agent text without NUL or outer whitespace" }));
const AgentModel = AgentText.check(makeFilter((model) => model !== "inherit", { expected: "an explicit model identifier, with omission selecting the host default" }));
const ShellPolicy = Literals(["host_default", "deny"]);
const AgentDefinition = Struct({
	description: AgentText,
	prompt: PackagePath,
	models: optionalKey(Struct({
		claude_code: AgentModel,
		codex: AgentModel
	})),
	shell: optionalKey(ShellPolicy)
});
const Plugin = Struct({
	id: PluginId,
	version: NonEmptyString,
	description: NonEmptyString,
	skills: ArraySchema(PackagePath),
	assets: optionalKey(ArraySchema(PackagePath)),
	executables: optionalKey(ArraySchema(PackagePath)),
	mcp: Record(McpName, McpServer),
	hooks: optionalKey(Record(HookName, CommandHook)),
	agents: optionalKey(Record(AgentName, AgentDefinition))
});
//#endregion
//#region contracts/Clients.ts
const Host = Literals([
	"claude_code",
	"codex",
	"cursor",
	"grok_bot",
	"muse"
]);
Host.pick([
	"claude_code",
	"codex",
	"cursor"
]);
const PackageClient = Host.pick(["claude_code", "codex"]);
//#endregion
//#region contracts/Compiler.ts
const Format = PackageClient;
Literals([
	"stdio",
	"hooks",
	"agents"
]);
const BundleDigest = String$1.check(isPattern(/^[a-f0-9]{64}$/)).pipe(brand("pluginsdk/BundleDigest"));
const PackageFile = Struct({
	path: PackagePath,
	content: Uint8ArrayFromBase64,
	executable: Boolean$1
});
Struct({
	...Struct({
		schema: Literal(1),
		plugin: PluginId,
		format: Format,
		files: NonEmptyArray(PackageFile)
	}).fields,
	digest: BundleDigest
});
Struct({
	root: Directory,
	plugin: Plugin,
	format: Format
});
const PathCollision = Struct({
	type: Literal("path_collision"),
	path: PackagePath
});
const ReservedAsset = Struct({
	type: Literal("reserved_asset"),
	path: PackagePath
});
const BundleCheckIssue = Union([
	Struct({ type: Literal("digest_mismatch") }),
	Struct({ type: Literal("noncanonical_order") }),
	PathCollision
]).pipe(toTaggedUnion("type"));
const BundleIssue = Union([...BundleCheckIssue.members, Struct({
	type: Literal("invalid_native_package"),
	detail: NonEmptyString
})]).pipe(toTaggedUnion("type"));
TaggedError()("BundleRejected", { issues: NonEmptyArray(BundleIssue) });
const McpProblem = Union([
	Struct({
		type: Literal("environment_reference"),
		header: HeaderName
	}),
	Struct({
		type: Literal("literal_expansion"),
		header: HeaderName
	}),
	Struct({
		type: Literal("header_collision"),
		header: HeaderName
	})
]).pipe(toTaggedUnion("type"));
const UnsupportedMcp = Struct({
	type: Literal("unsupported_mcp"),
	server: NonEmptyString,
	reason: McpProblem
});
const LocalMcpProblem = Union([
	Struct({
		type: Literal("missing_file"),
		path: PackagePath
	}),
	Struct({
		type: Literal("not_executable"),
		path: PackagePath
	}),
	Struct({
		type: Literal("missing_directory"),
		path: PackagePath
	}),
	Struct({
		type: Literal("environment_reference_unsupported"),
		name: EnvironmentName
	}),
	Struct({
		type: Literal("environment_collision"),
		name: EnvironmentName
	})
]).pipe(toTaggedUnion("type"));
const BuildIssue = Union([
	Struct({
		type: Literal("invalid_metadata"),
		field: Literals([
			"id",
			"version",
			"description"
		]),
		detail: NonEmptyString
	}),
	Struct({
		type: Literal("invalid_skill"),
		path: PackagePath,
		detail: NonEmptyString
	}),
	Struct({
		type: Literal("invalid_asset"),
		path: PackagePath,
		detail: NonEmptyString
	}),
	Struct({
		type: Literal("invalid_agent"),
		path: PackagePath,
		detail: NonEmptyString
	}),
	Struct({
		type: Literal("invalid_executable"),
		path: PackagePath,
		detail: NonEmptyString
	}),
	PathCollision,
	ReservedAsset,
	Struct({
		type: Literal("source_escape"),
		path: PackagePath
	}),
	Struct({
		type: Literal("invalid_process"),
		server: NonEmptyString,
		reason: LocalMcpProblem
	}),
	Struct({
		type: Literal("invalid_hook_process"),
		hook: NonEmptyString,
		reason: LocalMcpProblem
	}),
	UnsupportedMcp
]).pipe(toTaggedUnion("type"));
TaggedError()("BuildRejected", { issues: NonEmptyArray(BuildIssue) });
TaggedError()("SourceUnavailable", {
	root: Directory,
	cause: Defect()
});
Service()("pluginsdk/Compiler");
new TextEncoder();
const CapturedFile = Struct({
	digest: String$1.check(isPattern(/^[a-f0-9]{64}$/)).pipe(brand("pluginsdk/FileDigest")),
	executable: Boolean$1
});
const Asset = Struct({
	...CapturedFile.fields,
	path: PackagePath
});
const Skill = Struct({
	name: String$1.check(isBetweenLength(1, 64), isPattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)).pipe(brand("pluginsdk/SkillName")),
	entry: CapturedFile,
	assets: ArraySchema(Asset)
});
const RenderInput = Struct({
	format: Format,
	metadata: Struct({
		id: Plugin.fields.id,
		version: Plugin.fields.version,
		description: Plugin.fields.description
	}),
	skills: ArraySchema(Skill),
	mcp: Record(McpName, toEncoded(RemoteMcp))
});
const RenderedFile = Union([Struct({
	type: Literal("copy"),
	path: PackagePath,
	...CapturedFile.fields
}), Struct({
	type: Literal("json"),
	path: PackagePath,
	value: JsonObject
})]).pipe(toTaggedUnion("type"));
const RenderIssue = Union([PathCollision, UnsupportedMcp]).pipe(toTaggedUnion("type"));
const RenderResult = Union([Struct({
	type: Literal("rendered"),
	files: NonEmptyArray(RenderedFile)
}), Struct({
	type: Literal("rejected"),
	issues: NonEmptyArray(RenderIssue)
})]).pipe(toTaggedUnion("type"));
const BundleCheckInput = Struct({
	digest: BundleDigest,
	computed: BundleDigest,
	paths: NonEmptyArray(PackagePath)
});
const BundleCheckResult = Union([Struct({ type: Literal("valid") }), Struct({
	type: Literal("rejected"),
	issues: NonEmptyArray(BundleCheckIssue)
})]).pipe(toTaggedUnion("type"));
Struct({
	schema: Literal(1),
	type: Literal("render"),
	input: RenderInput
});
Struct({
	schema: Literal(1),
	type: Literal("render"),
	output: RenderResult
});
Struct({
	schema: Literal(1),
	type: Literal("check_bundle"),
	input: BundleCheckInput
});
Struct({
	schema: Literal(1),
	type: Literal("check_bundle"),
	output: BundleCheckResult
});
toEquivalence(LocalMcpProblem);
//#endregion
//#region contracts/Process.ts
const Program = Union([Struct({
	type: Literal("external"),
	name: ExecutableName
}), Struct({
	type: Literal("file"),
	path: PackagePath
})]).pipe(toTaggedUnion("type"));
const Argument = Union([Struct({
	type: Literal("literal"),
	value: ProcessText
}), Struct({
	type: Literal("file"),
	path: PackagePath
})]).pipe(toTaggedUnion("type"));
const Binding = Struct({
	name: EnvironmentName,
	value: Union([Struct({
		type: Literal("literal"),
		value: ProcessText
	}), Struct({
		type: Literal("reference"),
		name: EnvironmentName
	})]).pipe(toTaggedUnion("type"))
});
const Definition = Struct({
	command: Program,
	args: ArraySchema(Argument),
	environment: ArraySchema(Binding),
	cwd: NullOr(PackagePath)
});
const Word = Union([
	Struct({
		type: Literal("literal"),
		value: ProcessText
	}),
	Struct({ type: Literal("root") }),
	Struct({
		type: Literal("file"),
		path: PackagePath
	}),
	Struct({
		type: Literal("environment"),
		name: EnvironmentName
	})
]).pipe(toTaggedUnion("type"));
const ProcessPlan = Struct({
	command: Word,
	args: ArraySchema(Word),
	environment: ArraySchema(Struct({
		name: EnvironmentName,
		value: Word
	})),
	cwd: Word
});
const ProcessInput = Struct({
	host: PackageClient,
	definition: Definition,
	files: ArraySchema(Asset)
});
const ProcessResult = Union([Struct({
	type: Literal("planned"),
	plan: ProcessPlan
}), Struct({
	type: Literal("rejected"),
	issues: NonEmptyArray(LocalMcpProblem)
})]).pipe(toTaggedUnion("type"));
Struct({
	schema: Literal(1),
	type: Literal("lower_process"),
	input: ProcessInput
});
Struct({
	schema: Literal(1),
	type: Literal("lower_process"),
	output: ProcessResult
});
Struct({
	schema: Literal(1),
	type: Literal("quote_process_text"),
	input: Struct({ text: ProcessText })
});
Struct({
	schema: Literal(1),
	type: Literal("quote_process_text"),
	output: Struct({ quoted: String$1 })
});
toEquivalence(EnvironmentName);
//#endregion
//#region contracts/Launcher.ts
const LauncherPath = PackagePath.check(makeFilter((path) => !path.includes("$"), { expected: "a contained launcher path without expansion syntax" })).pipe(brand("pluginsdk/LauncherPath"));
Literals(["raw", "check"]);
const Capture = Struct({
	source: EnvironmentName,
	raw: EnvironmentName,
	check: EnvironmentName
});
const SnapshotWord = Union([
	Struct({
		type: Literal("literal"),
		value: ProcessText
	}),
	Struct({ type: Literal("root") }),
	Struct({
		type: Literal("file"),
		path: PackagePath
	}),
	Struct({
		type: Literal("captured"),
		capture: Capture
	})
]).pipe(toTaggedUnion("type"));
const ParameterIndex = Natural.check(isLessThanOrEqualTo(Number.MAX_SAFE_INTEGER));
const Script = Struct({
	names: ArraySchema(EnvironmentName),
	captures: ArraySchema(Capture),
	snapshot: ArraySchema(SnapshotWord),
	command: ParameterIndex,
	args: ArraySchema(ParameterIndex),
	environment: ArraySchema(Struct({
		name: EnvironmentName,
		index: ParameterIndex
	})),
	cwd: ParameterIndex
});
const Native = Struct({
	command: ProcessText,
	args: ArraySchema(ProcessText),
	env: Record(EnvironmentName, ProcessText),
	cwd: NullOr(ProcessText)
});
const LauncherInput = Struct({
	host: ProcessInput.fields.host,
	path: LauncherPath,
	plan: ProcessPlan
});
const LauncherOutput = Struct({
	script: ProcessText,
	native: NullOr(Native)
});
Struct({
	schema: Literal(1),
	type: Literal("render_launcher"),
	input: LauncherInput
});
Struct({
	schema: Literal(1),
	type: Literal("render_launcher"),
	output: LauncherOutput
});
//#endregion
//#region contracts/Mcp.ts
const McpInput = Struct({
	format: RenderInput.fields.format,
	remote: Record(McpName, toEncoded(RemoteMcp)),
	local: Record(McpName, ProcessPlan)
}).check(makeFilter((input) => Object.keys(input.remote).every((name) => !Object.hasOwn(input.local, name)), { expected: "distinct remote and local MCP server names" }));
//#endregion
//#region contracts/PortableLauncher.ts
const Input$1 = LauncherInput;
const Issue$1 = Union([Struct({
	type: Literal("environment_collision"),
	name: EnvironmentName
}), Struct({
	type: Literal("environment_reference_unsupported"),
	name: EnvironmentName
})]).pipe(toTaggedUnion("type"));
const Result$1 = Union([Struct({
	type: Literal("rendered"),
	script: Script,
	native: Native,
	posix: ProcessText
}), Struct({
	type: Literal("rejected"),
	issues: NonEmptyArray(Issue$1)
})]).pipe(toTaggedUnion("type"));
Struct({
	schema: Literal(1),
	type: Literal("compile_portable_launcher"),
	input: Input$1
});
Struct({
	schema: Literal(1),
	type: Literal("compile_portable_launcher"),
	output: Result$1
});
//#endregion
//#region contracts/PortableProcess.ts
const ProcessData = Struct({
	schema: Literal(1),
	posix: LauncherPath,
	script: Script
});
const FilePlan = Union([
	Struct({
		type: Literal("runtime"),
		path: PackagePath
	}),
	Struct({
		type: Literal("process"),
		path: LauncherPath,
		data: ProcessData
	}),
	Struct({
		type: Literal("posix"),
		path: LauncherPath,
		content: ProcessText
	})
]).pipe(toTaggedUnion("type"));
//#endregion
//#region contracts/PortableMcp.ts
const Input = McpInput;
const Issue = Struct({
	server: McpName,
	reason: Issue$1
});
const Result = Union([Struct({
	type: Literal("rendered"),
	document: NullOr(JsonObject),
	files: ArraySchema(FilePlan)
}), Struct({
	type: Literal("rejected"),
	issues: NonEmptyArray(Issue)
})]).pipe(toTaggedUnion("type"));
Struct({
	schema: Literal(1),
	type: Literal("render_portable_mcp"),
	input: Input
});
Struct({
	schema: Literal(1),
	type: Literal("render_portable_mcp"),
	output: Result
});
//#endregion
//#region src/runtime/model.ts
function readProcessCapture(input) {
	const { source, raw, check } = input;
	if (raw === null || check === null) return null;
	return raw === "${" + source + "}" && check !== raw ? null : raw;
}
function resolve$1(word, input) {
	return value(word).pipe(discriminatorsExhaustive("type")({
		literal: ({ value }) => value,
		root: () => input.root,
		file: ({ path }) => ProcessText.make(`${input.root}/${path}`),
		captured: ({ capture }) => capturedValue(input, capture.source)
	}));
}
function capturedValue(input, source) {
	return Object.hasOwn(input.captures, source) ? input.captures[source] ?? null : null;
}
function executeProcess(input) {
	const { script, root } = input;
	if (script.captures.some(({ source }) => capturedValue(input, source) === null)) return null;
	const parameters = [root];
	for (const word of script.snapshot) {
		const value = resolve$1(word, input);
		if (value === null) return null;
		parameters.push(value);
	}
	const command = parameters[script.command];
	const cwd = parameters[script.cwd];
	if (command === void 0 || cwd === void 0) return null;
	const args = [];
	for (const index of script.args) {
		const value = parameters[index];
		if (value === void 0) return null;
		args.push(value);
	}
	const environment = [];
	for (const binding of script.environment) {
		const value = parameters[binding.index];
		if (value === void 0) return null;
		environment.push({
			name: binding.name,
			value
		});
	}
	return {
		command,
		args,
		environment,
		cwd
	};
}
//#endregion
//#region contracts/ProcessRuntime.ts
const CaptureInput = Struct({
	source: EnvironmentName,
	raw: NullOr(ProcessText),
	check: NullOr(ProcessText)
});
const ExecutionInput = Struct({
	script: Script,
	root: ProcessText,
	captures: Record(EnvironmentName, NullOr(ProcessText))
});
const Invocation = Struct({
	command: ProcessText,
	args: ArraySchema(ProcessText),
	environment: ArraySchema(Struct({
		name: EnvironmentName,
		value: ProcessText
	})),
	cwd: ProcessText
});
Union([Struct({
	schema: Literal(1),
	type: Literal("read_process_capture"),
	input: CaptureInput
}), Struct({
	schema: Literal(1),
	type: Literal("execute_process"),
	input: ExecutionInput
})]).pipe(toTaggedUnion("type"));
Union([Struct({
	schema: Literal(1),
	type: Literal("read_process_capture"),
	output: NullOr(ProcessText)
}), Struct({
	schema: Literal(1),
	type: Literal("execute_process"),
	output: NullOr(Invocation)
})]).pipe(toTaggedUnion("type"));
//#endregion
//#region node_modules/jsonc-parser/lib/esm/impl/scanner.js
function createScanner(text, ignoreTrivia = false) {
	const len = text.length;
	let pos = 0, value = "", tokenOffset = 0, token = 16, lineNumber = 0, lineStartOffset = 0, tokenLineStartOffset = 0, prevTokenLineStartOffset = 0, scanError = 0;
	function scanHexDigits(count, exact) {
		let digits = 0;
		let value = 0;
		while (digits < count || !exact) {
			let ch = text.charCodeAt(pos);
			if (ch >= 48 && ch <= 57) value = value * 16 + ch - 48;
			else if (ch >= 65 && ch <= 70) value = value * 16 + ch - 65 + 10;
			else if (ch >= 97 && ch <= 102) value = value * 16 + ch - 97 + 10;
			else break;
			pos++;
			digits++;
		}
		if (digits < count) value = -1;
		return value;
	}
	function setPosition(newPosition) {
		pos = newPosition;
		value = "";
		tokenOffset = 0;
		token = 16;
		scanError = 0;
	}
	function scanNumber() {
		let start = pos;
		if (text.charCodeAt(pos) === 48) pos++;
		else {
			pos++;
			while (pos < text.length && isDigit(text.charCodeAt(pos))) pos++;
		}
		if (pos < text.length && text.charCodeAt(pos) === 46) {
			pos++;
			if (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
				while (pos < text.length && isDigit(text.charCodeAt(pos))) pos++;
			} else {
				scanError = 3;
				return text.substring(start, pos);
			}
		}
		let end = pos;
		if (pos < text.length && (text.charCodeAt(pos) === 69 || text.charCodeAt(pos) === 101)) {
			pos++;
			if (pos < text.length && text.charCodeAt(pos) === 43 || text.charCodeAt(pos) === 45) pos++;
			if (pos < text.length && isDigit(text.charCodeAt(pos))) {
				pos++;
				while (pos < text.length && isDigit(text.charCodeAt(pos))) pos++;
				end = pos;
			} else scanError = 3;
		}
		return text.substring(start, end);
	}
	function scanString() {
		let result = "", start = pos;
		while (true) {
			if (pos >= len) {
				result += text.substring(start, pos);
				scanError = 2;
				break;
			}
			const ch = text.charCodeAt(pos);
			if (ch === 34) {
				result += text.substring(start, pos);
				pos++;
				break;
			}
			if (ch === 92) {
				result += text.substring(start, pos);
				pos++;
				if (pos >= len) {
					scanError = 2;
					break;
				}
				switch (text.charCodeAt(pos++)) {
					case 34:
						result += "\"";
						break;
					case 92:
						result += "\\";
						break;
					case 47:
						result += "/";
						break;
					case 98:
						result += "\b";
						break;
					case 102:
						result += "\f";
						break;
					case 110:
						result += "\n";
						break;
					case 114:
						result += "\r";
						break;
					case 116:
						result += "	";
						break;
					case 117:
						const ch3 = scanHexDigits(4, true);
						if (ch3 >= 0) result += String.fromCharCode(ch3);
						else scanError = 4;
						break;
					default: scanError = 5;
				}
				start = pos;
				continue;
			}
			if (ch >= 0 && ch <= 31) {
				if (isLineBreak(ch)) {
					result += text.substring(start, pos);
					scanError = 2;
					break;
				} else scanError = 6;
			}
			pos++;
		}
		return result;
	}
	function scanNext() {
		value = "";
		scanError = 0;
		tokenOffset = pos;
		lineStartOffset = lineNumber;
		prevTokenLineStartOffset = tokenLineStartOffset;
		if (pos >= len) {
			tokenOffset = len;
			return token = 17;
		}
		let code = text.charCodeAt(pos);
		if (isWhiteSpace(code)) {
			do {
				pos++;
				value += String.fromCharCode(code);
				code = text.charCodeAt(pos);
			} while (isWhiteSpace(code));
			return token = 15;
		}
		if (isLineBreak(code)) {
			pos++;
			value += String.fromCharCode(code);
			if (code === 13 && text.charCodeAt(pos) === 10) {
				pos++;
				value += "\n";
			}
			lineNumber++;
			tokenLineStartOffset = pos;
			return token = 14;
		}
		switch (code) {
			case 123:
				pos++;
				return token = 1;
			case 125:
				pos++;
				return token = 2;
			case 91:
				pos++;
				return token = 3;
			case 93:
				pos++;
				return token = 4;
			case 58:
				pos++;
				return token = 6;
			case 44:
				pos++;
				return token = 5;
			case 34:
				pos++;
				value = scanString();
				return token = 10;
			case 47:
				const start = pos - 1;
				if (text.charCodeAt(pos + 1) === 47) {
					pos += 2;
					while (pos < len) {
						if (isLineBreak(text.charCodeAt(pos))) break;
						pos++;
					}
					value = text.substring(start, pos);
					return token = 12;
				}
				if (text.charCodeAt(pos + 1) === 42) {
					pos += 2;
					const safeLength = len - 1;
					let commentClosed = false;
					while (pos < safeLength) {
						const ch = text.charCodeAt(pos);
						if (ch === 42 && text.charCodeAt(pos + 1) === 47) {
							pos += 2;
							commentClosed = true;
							break;
						}
						pos++;
						if (isLineBreak(ch)) {
							if (ch === 13 && text.charCodeAt(pos) === 10) pos++;
							lineNumber++;
							tokenLineStartOffset = pos;
						}
					}
					if (!commentClosed) {
						pos++;
						scanError = 1;
					}
					value = text.substring(start, pos);
					return token = 13;
				}
				value += String.fromCharCode(code);
				pos++;
				return token = 16;
			case 45:
				value += String.fromCharCode(code);
				pos++;
				if (pos === len || !isDigit(text.charCodeAt(pos))) return token = 16;
			case 48:
			case 49:
			case 50:
			case 51:
			case 52:
			case 53:
			case 54:
			case 55:
			case 56:
			case 57:
				value += scanNumber();
				return token = 11;
			default:
				while (pos < len && isUnknownContentCharacter(code)) {
					pos++;
					code = text.charCodeAt(pos);
				}
				if (tokenOffset !== pos) {
					value = text.substring(tokenOffset, pos);
					switch (value) {
						case "true": return token = 8;
						case "false": return token = 9;
						case "null": return token = 7;
					}
					return token = 16;
				}
				value += String.fromCharCode(code);
				pos++;
				return token = 16;
		}
	}
	function isUnknownContentCharacter(code) {
		if (isWhiteSpace(code) || isLineBreak(code)) return false;
		switch (code) {
			case 125:
			case 93:
			case 123:
			case 91:
			case 34:
			case 58:
			case 44:
			case 47: return false;
		}
		return true;
	}
	function scanNextNonTrivia() {
		let result;
		do
			result = scanNext();
		while (result >= 12 && result <= 15);
		return result;
	}
	return {
		setPosition,
		getPosition: () => pos,
		scan: ignoreTrivia ? scanNextNonTrivia : scanNext,
		getToken: () => token,
		getTokenValue: () => value,
		getTokenOffset: () => tokenOffset,
		getTokenLength: () => pos - tokenOffset,
		getTokenStartLine: () => lineStartOffset,
		getTokenStartCharacter: () => tokenOffset - prevTokenLineStartOffset,
		getTokenError: () => scanError
	};
}
function isWhiteSpace(ch) {
	return ch === 32 || ch === 9;
}
function isLineBreak(ch) {
	return ch === 10 || ch === 13;
}
function isDigit(ch) {
	return ch >= 48 && ch <= 57;
}
var CharacterCodes;
(function(CharacterCodes) {
	CharacterCodes[CharacterCodes["lineFeed"] = 10] = "lineFeed";
	CharacterCodes[CharacterCodes["carriageReturn"] = 13] = "carriageReturn";
	CharacterCodes[CharacterCodes["space"] = 32] = "space";
	CharacterCodes[CharacterCodes["_0"] = 48] = "_0";
	CharacterCodes[CharacterCodes["_1"] = 49] = "_1";
	CharacterCodes[CharacterCodes["_2"] = 50] = "_2";
	CharacterCodes[CharacterCodes["_3"] = 51] = "_3";
	CharacterCodes[CharacterCodes["_4"] = 52] = "_4";
	CharacterCodes[CharacterCodes["_5"] = 53] = "_5";
	CharacterCodes[CharacterCodes["_6"] = 54] = "_6";
	CharacterCodes[CharacterCodes["_7"] = 55] = "_7";
	CharacterCodes[CharacterCodes["_8"] = 56] = "_8";
	CharacterCodes[CharacterCodes["_9"] = 57] = "_9";
	CharacterCodes[CharacterCodes["a"] = 97] = "a";
	CharacterCodes[CharacterCodes["b"] = 98] = "b";
	CharacterCodes[CharacterCodes["c"] = 99] = "c";
	CharacterCodes[CharacterCodes["d"] = 100] = "d";
	CharacterCodes[CharacterCodes["e"] = 101] = "e";
	CharacterCodes[CharacterCodes["f"] = 102] = "f";
	CharacterCodes[CharacterCodes["g"] = 103] = "g";
	CharacterCodes[CharacterCodes["h"] = 104] = "h";
	CharacterCodes[CharacterCodes["i"] = 105] = "i";
	CharacterCodes[CharacterCodes["j"] = 106] = "j";
	CharacterCodes[CharacterCodes["k"] = 107] = "k";
	CharacterCodes[CharacterCodes["l"] = 108] = "l";
	CharacterCodes[CharacterCodes["m"] = 109] = "m";
	CharacterCodes[CharacterCodes["n"] = 110] = "n";
	CharacterCodes[CharacterCodes["o"] = 111] = "o";
	CharacterCodes[CharacterCodes["p"] = 112] = "p";
	CharacterCodes[CharacterCodes["q"] = 113] = "q";
	CharacterCodes[CharacterCodes["r"] = 114] = "r";
	CharacterCodes[CharacterCodes["s"] = 115] = "s";
	CharacterCodes[CharacterCodes["t"] = 116] = "t";
	CharacterCodes[CharacterCodes["u"] = 117] = "u";
	CharacterCodes[CharacterCodes["v"] = 118] = "v";
	CharacterCodes[CharacterCodes["w"] = 119] = "w";
	CharacterCodes[CharacterCodes["x"] = 120] = "x";
	CharacterCodes[CharacterCodes["y"] = 121] = "y";
	CharacterCodes[CharacterCodes["z"] = 122] = "z";
	CharacterCodes[CharacterCodes["A"] = 65] = "A";
	CharacterCodes[CharacterCodes["B"] = 66] = "B";
	CharacterCodes[CharacterCodes["C"] = 67] = "C";
	CharacterCodes[CharacterCodes["D"] = 68] = "D";
	CharacterCodes[CharacterCodes["E"] = 69] = "E";
	CharacterCodes[CharacterCodes["F"] = 70] = "F";
	CharacterCodes[CharacterCodes["G"] = 71] = "G";
	CharacterCodes[CharacterCodes["H"] = 72] = "H";
	CharacterCodes[CharacterCodes["I"] = 73] = "I";
	CharacterCodes[CharacterCodes["J"] = 74] = "J";
	CharacterCodes[CharacterCodes["K"] = 75] = "K";
	CharacterCodes[CharacterCodes["L"] = 76] = "L";
	CharacterCodes[CharacterCodes["M"] = 77] = "M";
	CharacterCodes[CharacterCodes["N"] = 78] = "N";
	CharacterCodes[CharacterCodes["O"] = 79] = "O";
	CharacterCodes[CharacterCodes["P"] = 80] = "P";
	CharacterCodes[CharacterCodes["Q"] = 81] = "Q";
	CharacterCodes[CharacterCodes["R"] = 82] = "R";
	CharacterCodes[CharacterCodes["S"] = 83] = "S";
	CharacterCodes[CharacterCodes["T"] = 84] = "T";
	CharacterCodes[CharacterCodes["U"] = 85] = "U";
	CharacterCodes[CharacterCodes["V"] = 86] = "V";
	CharacterCodes[CharacterCodes["W"] = 87] = "W";
	CharacterCodes[CharacterCodes["X"] = 88] = "X";
	CharacterCodes[CharacterCodes["Y"] = 89] = "Y";
	CharacterCodes[CharacterCodes["Z"] = 90] = "Z";
	CharacterCodes[CharacterCodes["asterisk"] = 42] = "asterisk";
	CharacterCodes[CharacterCodes["backslash"] = 92] = "backslash";
	CharacterCodes[CharacterCodes["closeBrace"] = 125] = "closeBrace";
	CharacterCodes[CharacterCodes["closeBracket"] = 93] = "closeBracket";
	CharacterCodes[CharacterCodes["colon"] = 58] = "colon";
	CharacterCodes[CharacterCodes["comma"] = 44] = "comma";
	CharacterCodes[CharacterCodes["dot"] = 46] = "dot";
	CharacterCodes[CharacterCodes["doubleQuote"] = 34] = "doubleQuote";
	CharacterCodes[CharacterCodes["minus"] = 45] = "minus";
	CharacterCodes[CharacterCodes["openBrace"] = 123] = "openBrace";
	CharacterCodes[CharacterCodes["openBracket"] = 91] = "openBracket";
	CharacterCodes[CharacterCodes["plus"] = 43] = "plus";
	CharacterCodes[CharacterCodes["slash"] = 47] = "slash";
	CharacterCodes[CharacterCodes["formFeed"] = 12] = "formFeed";
	CharacterCodes[CharacterCodes["tab"] = 9] = "tab";
})(CharacterCodes || (CharacterCodes = {}));
new Array(20).fill(0).map((_, index) => {
	return " ".repeat(index);
});
const maxCachedValues = 200;
new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\n" + " ".repeat(index);
}), new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\r" + " ".repeat(index);
}), new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\r\n" + " ".repeat(index);
}), new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\n" + "	".repeat(index);
}), new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\r" + "	".repeat(index);
}), new Array(maxCachedValues).fill(0).map((_, index) => {
	return "\r\n" + "	".repeat(index);
});
//#endregion
//#region node_modules/jsonc-parser/lib/esm/impl/parser.js
var ParseOptions;
(function(ParseOptions) {
	ParseOptions.DEFAULT = { allowTrailingComma: false };
})(ParseOptions || (ParseOptions = {}));
function visit$1(text, visitor, options = ParseOptions.DEFAULT) {
	const _scanner = createScanner(text, false);
	const _jsonPath = [];
	let suppressedCallbacks = 0;
	function toNoArgVisit(visitFunction) {
		return visitFunction ? () => suppressedCallbacks === 0 && visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
	}
	function toOneArgVisit(visitFunction) {
		return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter()) : () => true;
	}
	function toOneArgVisitWithPath(visitFunction) {
		return visitFunction ? (arg) => suppressedCallbacks === 0 && visitFunction(arg, _scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) : () => true;
	}
	function toBeginVisit(visitFunction) {
		return visitFunction ? () => {
			if (suppressedCallbacks > 0) suppressedCallbacks++;
			else if (visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter(), () => _jsonPath.slice()) === false) suppressedCallbacks = 1;
		} : () => true;
	}
	function toEndVisit(visitFunction) {
		return visitFunction ? () => {
			if (suppressedCallbacks > 0) suppressedCallbacks--;
			if (suppressedCallbacks === 0) visitFunction(_scanner.getTokenOffset(), _scanner.getTokenLength(), _scanner.getTokenStartLine(), _scanner.getTokenStartCharacter());
		} : () => true;
	}
	const onObjectBegin = toBeginVisit(visitor.onObjectBegin), onObjectProperty = toOneArgVisitWithPath(visitor.onObjectProperty), onObjectEnd = toEndVisit(visitor.onObjectEnd), onArrayBegin = toBeginVisit(visitor.onArrayBegin), onArrayEnd = toEndVisit(visitor.onArrayEnd), onLiteralValue = toOneArgVisitWithPath(visitor.onLiteralValue), onSeparator = toOneArgVisit(visitor.onSeparator), onComment = toNoArgVisit(visitor.onComment), onError = toOneArgVisit(visitor.onError);
	const disallowComments = options && options.disallowComments;
	const allowTrailingComma = options && options.allowTrailingComma;
	function scanNext() {
		while (true) {
			const token = _scanner.scan();
			switch (_scanner.getTokenError()) {
				case 4:
					handleError(14);
					break;
				case 5:
					handleError(15);
					break;
				case 3:
					handleError(13);
					break;
				case 1:
					if (!disallowComments) handleError(11);
					break;
				case 2:
					handleError(12);
					break;
				case 6: handleError(16);
			}
			switch (token) {
				case 12:
				case 13:
					if (disallowComments) handleError(10);
					else onComment();
					break;
				case 16:
					handleError(1);
					break;
				case 15:
				case 14: break;
				default: return token;
			}
		}
	}
	function handleError(error, skipUntilAfter = [], skipUntil = []) {
		onError(error);
		if (skipUntilAfter.length + skipUntil.length > 0) {
			let token = _scanner.getToken();
			while (token !== 17) {
				if (skipUntilAfter.indexOf(token) !== -1) {
					scanNext();
					break;
				} else if (skipUntil.indexOf(token) !== -1) break;
				token = scanNext();
			}
		}
	}
	function parseString(isValue) {
		const value = _scanner.getTokenValue();
		if (isValue) onLiteralValue(value);
		else {
			onObjectProperty(value);
			_jsonPath.push(value);
		}
		scanNext();
		return true;
	}
	function parseLiteral() {
		switch (_scanner.getToken()) {
			case 11:
				const tokenValue = _scanner.getTokenValue();
				let value = Number(tokenValue);
				if (isNaN(value)) {
					handleError(2);
					value = 0;
				}
				onLiteralValue(value);
				break;
			case 7:
				onLiteralValue(null);
				break;
			case 8:
				onLiteralValue(true);
				break;
			case 9:
				onLiteralValue(false);
				break;
			default: return false;
		}
		scanNext();
		return true;
	}
	function parseProperty() {
		if (_scanner.getToken() !== 10) {
			handleError(3, [], [2, 5]);
			return false;
		}
		parseString(false);
		if (_scanner.getToken() === 6) {
			onSeparator(":");
			scanNext();
			if (!parseValue()) handleError(4, [], [2, 5]);
		} else handleError(5, [], [2, 5]);
		_jsonPath.pop();
		return true;
	}
	function parseObject() {
		onObjectBegin();
		scanNext();
		let needsComma = false;
		while (_scanner.getToken() !== 2 && _scanner.getToken() !== 17) {
			if (_scanner.getToken() === 5) {
				if (!needsComma) handleError(4, [], []);
				onSeparator(",");
				scanNext();
				if (_scanner.getToken() === 2 && allowTrailingComma) break;
			} else if (needsComma) handleError(6, [], []);
			if (!parseProperty()) handleError(4, [], [2, 5]);
			needsComma = true;
		}
		onObjectEnd();
		if (_scanner.getToken() !== 2) handleError(7, [2], []);
		else scanNext();
		return true;
	}
	function parseArray() {
		onArrayBegin();
		scanNext();
		let isFirstElement = true;
		let needsComma = false;
		while (_scanner.getToken() !== 4 && _scanner.getToken() !== 17) {
			if (_scanner.getToken() === 5) {
				if (!needsComma) handleError(4, [], []);
				onSeparator(",");
				scanNext();
				if (_scanner.getToken() === 4 && allowTrailingComma) break;
			} else if (needsComma) handleError(6, [], []);
			if (isFirstElement) {
				_jsonPath.push(0);
				isFirstElement = false;
			} else _jsonPath[_jsonPath.length - 1]++;
			if (!parseValue()) handleError(4, [], [4, 5]);
			needsComma = true;
		}
		onArrayEnd();
		if (!isFirstElement) _jsonPath.pop();
		if (_scanner.getToken() !== 4) handleError(8, [4], []);
		else scanNext();
		return true;
	}
	function parseValue() {
		switch (_scanner.getToken()) {
			case 3: return parseArray();
			case 1: return parseObject();
			case 10: return parseString(true);
			default: return parseLiteral();
		}
	}
	scanNext();
	if (_scanner.getToken() === 17) {
		if (options.allowEmptyContent) return true;
		handleError(4, [], []);
		return false;
	}
	if (!parseValue()) {
		handleError(4, [], []);
		return false;
	}
	if (_scanner.getToken() !== 17) handleError(9, [], []);
	return true;
}
//#endregion
//#region node_modules/jsonc-parser/lib/esm/main.js
var ScanError;
(function(ScanError) {
	ScanError[ScanError["None"] = 0] = "None";
	ScanError[ScanError["UnexpectedEndOfComment"] = 1] = "UnexpectedEndOfComment";
	ScanError[ScanError["UnexpectedEndOfString"] = 2] = "UnexpectedEndOfString";
	ScanError[ScanError["UnexpectedEndOfNumber"] = 3] = "UnexpectedEndOfNumber";
	ScanError[ScanError["InvalidUnicode"] = 4] = "InvalidUnicode";
	ScanError[ScanError["InvalidEscapeCharacter"] = 5] = "InvalidEscapeCharacter";
	ScanError[ScanError["InvalidCharacter"] = 6] = "InvalidCharacter";
})(ScanError || (ScanError = {}));
var SyntaxKind;
(function(SyntaxKind) {
	SyntaxKind[SyntaxKind["OpenBraceToken"] = 1] = "OpenBraceToken";
	SyntaxKind[SyntaxKind["CloseBraceToken"] = 2] = "CloseBraceToken";
	SyntaxKind[SyntaxKind["OpenBracketToken"] = 3] = "OpenBracketToken";
	SyntaxKind[SyntaxKind["CloseBracketToken"] = 4] = "CloseBracketToken";
	SyntaxKind[SyntaxKind["CommaToken"] = 5] = "CommaToken";
	SyntaxKind[SyntaxKind["ColonToken"] = 6] = "ColonToken";
	SyntaxKind[SyntaxKind["NullKeyword"] = 7] = "NullKeyword";
	SyntaxKind[SyntaxKind["TrueKeyword"] = 8] = "TrueKeyword";
	SyntaxKind[SyntaxKind["FalseKeyword"] = 9] = "FalseKeyword";
	SyntaxKind[SyntaxKind["StringLiteral"] = 10] = "StringLiteral";
	SyntaxKind[SyntaxKind["NumericLiteral"] = 11] = "NumericLiteral";
	SyntaxKind[SyntaxKind["LineCommentTrivia"] = 12] = "LineCommentTrivia";
	SyntaxKind[SyntaxKind["BlockCommentTrivia"] = 13] = "BlockCommentTrivia";
	SyntaxKind[SyntaxKind["LineBreakTrivia"] = 14] = "LineBreakTrivia";
	SyntaxKind[SyntaxKind["Trivia"] = 15] = "Trivia";
	SyntaxKind[SyntaxKind["Unknown"] = 16] = "Unknown";
	SyntaxKind[SyntaxKind["EOF"] = 17] = "EOF";
})(SyntaxKind || (SyntaxKind = {}));
const visit = visit$1;
var ParseErrorCode;
(function(ParseErrorCode) {
	ParseErrorCode[ParseErrorCode["InvalidSymbol"] = 1] = "InvalidSymbol";
	ParseErrorCode[ParseErrorCode["InvalidNumberFormat"] = 2] = "InvalidNumberFormat";
	ParseErrorCode[ParseErrorCode["PropertyNameExpected"] = 3] = "PropertyNameExpected";
	ParseErrorCode[ParseErrorCode["ValueExpected"] = 4] = "ValueExpected";
	ParseErrorCode[ParseErrorCode["ColonExpected"] = 5] = "ColonExpected";
	ParseErrorCode[ParseErrorCode["CommaExpected"] = 6] = "CommaExpected";
	ParseErrorCode[ParseErrorCode["CloseBraceExpected"] = 7] = "CloseBraceExpected";
	ParseErrorCode[ParseErrorCode["CloseBracketExpected"] = 8] = "CloseBracketExpected";
	ParseErrorCode[ParseErrorCode["EndOfFileExpected"] = 9] = "EndOfFileExpected";
	ParseErrorCode[ParseErrorCode["InvalidCommentToken"] = 10] = "InvalidCommentToken";
	ParseErrorCode[ParseErrorCode["UnexpectedEndOfComment"] = 11] = "UnexpectedEndOfComment";
	ParseErrorCode[ParseErrorCode["UnexpectedEndOfString"] = 12] = "UnexpectedEndOfString";
	ParseErrorCode[ParseErrorCode["UnexpectedEndOfNumber"] = 13] = "UnexpectedEndOfNumber";
	ParseErrorCode[ParseErrorCode["InvalidUnicode"] = 14] = "InvalidUnicode";
	ParseErrorCode[ParseErrorCode["InvalidEscapeCharacter"] = 15] = "InvalidEscapeCharacter";
	ParseErrorCode[ParseErrorCode["InvalidCharacter"] = 16] = "InvalidCharacter";
})(ParseErrorCode || (ParseErrorCode = {}));
//#endregion
//#region src/internal/json.ts
const validString = (value) => {
	if (!value.isWellFormed()) throw new SyntaxError("JSON contains an unpaired Unicode surrogate");
	return value;
};
const parseJson = (text) => {
	const objects = [];
	visit(text, {
		onObjectBegin: () => {
			objects.push(new Set());
		},
		onObjectEnd: () => {
			objects.pop();
		},
		onObjectProperty: (name) => {
			validString(name);
			const current = objects.at(-1);
			if (current?.has(name)) throw new SyntaxError(`Duplicate JSON property: ${name}`);
			current?.add(name);
		},
		onLiteralValue: (value) => {
			if (typeof value === "string") validString(value);
			if (typeof value === "number" && !Number.isFinite(value)) throw new SyntaxError("JSON number is not finite");
		},
		onError: (_error, offset) => {
			throw new SyntaxError(`Invalid JSON at offset ${offset}`);
		}
	}, {
		disallowComments: true,
		allowTrailingComma: false,
		allowEmptyContent: false
	});
	return decodeUnknownSync(Json)(JSON.parse(text));
};
const parseJsonBytes = (bytes) => parseJson(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
//#endregion
//#region src/runtime/failure.ts
var ProcessRuntimeFailure = class extends TaggedError()("ProcessRuntimeFailure", { detail: NonEmptyString }) {};
//#endregion
//#region src/runtime/child.ts
function startChild(invocation, environment) {
	const child = spawn(invocation.command, invocation.args, {
		shell: false,
		stdio: "inherit",
		cwd: invocation.cwd,
		env: environment,
		windowsHide: true,
		detached: false
	});
	const status = {
		closed: false,
		failed: false
	};
	return {
		child,
		completion: new Promise((resolve) => {
			child.on("error", () => {
				status.failed = true;
			});
			child.once("close", (code) => {
				status.closed = true;
				resolve({
					failed: status.failed,
					code
				});
			});
		}),
		status
	};
}
const processRuntimeFailure = () => new ProcessRuntimeFailure({ detail: "Child process could not be started" });
const runChild = fn("ProcessRuntime.runChild")(function* (invocation, environment) {
	const owner = yield* acquireRelease(try_({
		try: () => startChild(invocation, environment),
		catch: () => processRuntimeFailure()
	}), (current) => promise(async () => {
		if (!current.status.closed && current.child.pid !== void 0) current.child.kill("SIGKILL");
		await current.completion;
	}));
	const completion = yield* promise(() => owner.completion);
	if (completion.failed) return yield* processRuntimeFailure();
	return completion.code ?? 1;
}, scoped);
//#endregion
//#region src/runtime/process.ts
const Platform = Literals(["linux", "win32"]);
const Arguments = Tuple([ProcessText.check(makeFilter((value) => value === "." || isAbsolute(value), { expected: "an absolute plugin root or exactly ." })), LauncherPath]);
const NodeVersion = String$1.check(makeFilter((version) => {
	const [major, minor] = version.split(".").map(Number);
	return major !== void 0 && minor !== void 0 && (major > 24 || major === 24 && minor >= 18);
}, { expected: "Node 24.18 or later" }));
function environmentValue(name) {
	return Object.hasOwn(process.env, name) ? process.env[name] ?? null : null;
}
const readCaptures = fn("ProcessRuntime.readCaptures")(function* (data) {
	const values = [];
	for (const capture of data.script.captures) {
		const value = readProcessCapture(yield* decodeEffect(CaptureInput)({
			source: capture.source,
			raw: environmentValue(capture.raw),
			check: environmentValue(capture.check)
		}).pipe(mapError(() => new ProcessRuntimeFailure({ detail: `Invalid capture for ${capture.source}` }))));
		if (value === null) return yield* new ProcessRuntimeFailure({ detail: `Missing environment source ${capture.source}` });
		values.push([capture.source, value]);
	}
	return Object.fromEntries(values);
});
const replacePosix = fn("ProcessRuntime.replacePosix")(function* (root, data) {
	const execve = process.execve;
	if (execve === void 0) return yield* new ProcessRuntimeFailure({ detail: "Process replacement is unavailable" });
	return yield* try_({
		try: () => execve("/bin/sh", [
			"/bin/sh",
			`${root}/${data.posix}`,
			root
		], process.env),
		catch: () => new ProcessRuntimeFailure({ detail: "Could not start the POSIX launcher" })
	});
});
runMain(fn("ProcessRuntime.run")(function* () {
	yield* decodeEffect(NodeVersion)(process.versions.node).pipe(mapError(() => new ProcessRuntimeFailure({ detail: "Node 24.18 or later is required" })));
	const platform = yield* decodeUnknownEffect(Platform)(process.platform).pipe(mapError(() => new ProcessRuntimeFailure({ detail: "This runtime supports Linux and Windows only" })));
	const [rootInput, path] = yield* decodeUnknownEffect(Arguments)(process.argv.slice(2)).pipe(mapError(() => new ProcessRuntimeFailure({ detail: "Expected a plugin root and contained process data path" })));
	const root = ProcessText.make(resolve(rootInput));
	const bytes = yield* (yield* FileSystem).readFile(`${root}/${path}`).pipe(mapError(() => new ProcessRuntimeFailure({ detail: "Could not read process data" })));
	const value$4 = yield* try_({
		try: () => parseJsonBytes(bytes),
		catch: () => new ProcessRuntimeFailure({ detail: "Process data must be strict UTF-8 JSON" })
	});
	const data = yield* decodeUnknownEffect(ProcessData)(value$4, { onExcessProperty: "error" }).pipe(mapError(() => new ProcessRuntimeFailure({ detail: "Invalid process data" })));
	const captures = yield* readCaptures(data);
	const invocation = executeProcess({
		script: data.script,
		root,
		captures
	});
	if (invocation === null) return yield* new ProcessRuntimeFailure({ detail: "Process instructions could not be resolved" });
	return yield* value(platform).pipe(when("linux", () => replacePosix(root, data)), when("win32", () => gen(function* () {
		yield* sync(() => {
			for (const { raw, check } of data.script.captures) {
				delete process.env[raw];
				delete process.env[check];
			}
			for (const { name, value } of invocation.environment) process.env[name] = value;
		});
		return yield* runChild(invocation, process.env);
	})), exhaustive);
})().pipe(tap((code) => sync(() => {
	process.exitCode = code;
})), tapError(({ detail }) => error(`pluginsdk runtime: ${detail}`)), provide(layer)), { disableErrorReporting: true });
//#endregion
export {};
