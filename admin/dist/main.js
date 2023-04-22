(function() {
  "use strict";
  function makeMap(str, expectsLowerCase) {
    const map2 = /* @__PURE__ */ Object.create(null);
    const list = str.split(",");
    for (let i2 = 0; i2 < list.length; i2++) {
      map2[list[i2]] = true;
    }
    return expectsLowerCase ? (val) => !!map2[val.toLowerCase()] : (val) => !!map2[val];
  }
  function normalizeStyle(value) {
    if (isArray(value)) {
      const res = {};
      for (let i2 = 0; i2 < value.length; i2++) {
        const item = value[i2];
        const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
        if (normalized) {
          for (const key in normalized) {
            res[key] = normalized[key];
          }
        }
      }
      return res;
    } else if (isString(value)) {
      return value;
    } else if (isObject(value)) {
      return value;
    }
  }
  const listDelimiterRE = /;(?![^(]*\))/g;
  const propertyDelimiterRE = /:([^]+)/;
  const styleCommentRE = /\/\*.*?\*\//gs;
  function parseStringStyle(cssText) {
    const ret = {};
    cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
    return ret;
  }
  function normalizeClass(value) {
    let res = "";
    if (isString(value)) {
      res = value;
    } else if (isArray(value)) {
      for (let i2 = 0; i2 < value.length; i2++) {
        const normalized = normalizeClass(value[i2]);
        if (normalized) {
          res += normalized + " ";
        }
      }
    } else if (isObject(value)) {
      for (const name in value) {
        if (value[name]) {
          res += name + " ";
        }
      }
    }
    return res.trim();
  }
  const HTML_TAGS = "html,body,base,head,link,meta,style,title,address,article,aside,footer,header,hgroup,h1,h2,h3,h4,h5,h6,nav,section,div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,ruby,s,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,embed,object,param,source,canvas,script,noscript,del,ins,caption,col,colgroup,table,thead,tbody,td,th,tr,button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,output,progress,select,textarea,details,dialog,menu,summary,template,blockquote,iframe,tfoot";
  const SVG_TAGS = "svg,animate,animateMotion,animateTransform,circle,clipPath,color-profile,defs,desc,discard,ellipse,feBlend,feColorMatrix,feComponentTransfer,feComposite,feConvolveMatrix,feDiffuseLighting,feDisplacementMap,feDistantLight,feDropShadow,feFlood,feFuncA,feFuncB,feFuncG,feFuncR,feGaussianBlur,feImage,feMerge,feMergeNode,feMorphology,feOffset,fePointLight,feSpecularLighting,feSpotLight,feTile,feTurbulence,filter,foreignObject,g,hatch,hatchpath,image,line,linearGradient,marker,mask,mesh,meshgradient,meshpatch,meshrow,metadata,mpath,path,pattern,polygon,polyline,radialGradient,rect,set,solidcolor,stop,switch,symbol,text,textPath,title,tspan,unknown,use,view";
  const isHTMLTag = /* @__PURE__ */ makeMap(HTML_TAGS);
  const isSVGTag = /* @__PURE__ */ makeMap(SVG_TAGS);
  const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
  const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
  function includeBooleanAttr(value) {
    return !!value || value === "";
  }
  const toDisplayString = (val) => {
    return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
  };
  const replacer = (_key, val) => {
    if (val && val.__v_isRef) {
      return replacer(_key, val.value);
    } else if (isMap(val)) {
      return {
        [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
          entries[`${key} =>`] = val2;
          return entries;
        }, {})
      };
    } else if (isSet(val)) {
      return {
        [`Set(${val.size})`]: [...val.values()]
      };
    } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
      return String(val);
    }
    return val;
  };
  const EMPTY_OBJ = {}.NODE_ENV !== "production" ? Object.freeze({}) : {};
  const EMPTY_ARR = {}.NODE_ENV !== "production" ? Object.freeze([]) : [];
  const NOOP = () => {
  };
  const NO = () => false;
  const onRE = /^on[^a-z]/;
  const isOn = (key) => onRE.test(key);
  const isModelListener = (key) => key.startsWith("onUpdate:");
  const extend = Object.assign;
  const remove = (arr, el) => {
    const i2 = arr.indexOf(el);
    if (i2 > -1) {
      arr.splice(i2, 1);
    }
  };
  const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
  const isArray = Array.isArray;
  const isMap = (val) => toTypeString(val) === "[object Map]";
  const isSet = (val) => toTypeString(val) === "[object Set]";
  const isFunction = (val) => typeof val === "function";
  const isString = (val) => typeof val === "string";
  const isSymbol = (val) => typeof val === "symbol";
  const isObject = (val) => val !== null && typeof val === "object";
  const isPromise = (val) => {
    return isObject(val) && isFunction(val.then) && isFunction(val.catch);
  };
  const objectToString = Object.prototype.toString;
  const toTypeString = (value) => objectToString.call(value);
  const toRawType = (value) => {
    return toTypeString(value).slice(8, -1);
  };
  const isPlainObject = (val) => toTypeString(val) === "[object Object]";
  const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
  const isReservedProp = /* @__PURE__ */ makeMap(
    // the leading comma is intentional so empty string "" is also included
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
  );
  const isBuiltInDirective = /* @__PURE__ */ makeMap("bind,cloak,else-if,else,for,html,if,model,on,once,pre,show,slot,text,memo");
  const cacheStringFunction = (fn) => {
    const cache = /* @__PURE__ */ Object.create(null);
    return (str) => {
      const hit = cache[str];
      return hit || (cache[str] = fn(str));
    };
  };
  const camelizeRE = /-(\w)/g;
  const camelize = cacheStringFunction((str) => {
    return str.replace(camelizeRE, (_, c2) => c2 ? c2.toUpperCase() : "");
  });
  const hyphenateRE = /\B([A-Z])/g;
  const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
  const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
  const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
  const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
  const invokeArrayFns = (fns, arg) => {
    for (let i2 = 0; i2 < fns.length; i2++) {
      fns[i2](arg);
    }
  };
  const def = (obj, key, value) => {
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: false,
      value
    });
  };
  const looseToNumber = (val) => {
    const n2 = parseFloat(val);
    return isNaN(n2) ? val : n2;
  };
  let _globalThis;
  const getGlobalThis = () => {
    return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
  };
  function warn$1(msg, ...args) {
    console.warn(`[Vue warn] ${msg}`, ...args);
  }
  let activeEffectScope;
  class EffectScope {
    constructor(detached = false) {
      this.detached = detached;
      this._active = true;
      this.effects = [];
      this.cleanups = [];
      this.parent = activeEffectScope;
      if (!detached && activeEffectScope) {
        this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
      }
    }
    get active() {
      return this._active;
    }
    run(fn) {
      if (this._active) {
        const currentEffectScope = activeEffectScope;
        try {
          activeEffectScope = this;
          return fn();
        } finally {
          activeEffectScope = currentEffectScope;
        }
      } else if ({}.NODE_ENV !== "production") {
        warn$1(`cannot run an inactive effect scope.`);
      }
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    on() {
      activeEffectScope = this;
    }
    /**
     * This should only be called on non-detached scopes
     * @internal
     */
    off() {
      activeEffectScope = this.parent;
    }
    stop(fromParent) {
      if (this._active) {
        let i2, l2;
        for (i2 = 0, l2 = this.effects.length; i2 < l2; i2++) {
          this.effects[i2].stop();
        }
        for (i2 = 0, l2 = this.cleanups.length; i2 < l2; i2++) {
          this.cleanups[i2]();
        }
        if (this.scopes) {
          for (i2 = 0, l2 = this.scopes.length; i2 < l2; i2++) {
            this.scopes[i2].stop(true);
          }
        }
        if (!this.detached && this.parent && !fromParent) {
          const last = this.parent.scopes.pop();
          if (last && last !== this) {
            this.parent.scopes[this.index] = last;
            last.index = this.index;
          }
        }
        this.parent = void 0;
        this._active = false;
      }
    }
  }
  function recordEffectScope(effect, scope = activeEffectScope) {
    if (scope && scope.active) {
      scope.effects.push(effect);
    }
  }
  function getCurrentScope() {
    return activeEffectScope;
  }
  const createDep = (effects) => {
    const dep = new Set(effects);
    dep.w = 0;
    dep.n = 0;
    return dep;
  };
  const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
  const newTracked = (dep) => (dep.n & trackOpBit) > 0;
  const initDepMarkers = ({ deps }) => {
    if (deps.length) {
      for (let i2 = 0; i2 < deps.length; i2++) {
        deps[i2].w |= trackOpBit;
      }
    }
  };
  const finalizeDepMarkers = (effect) => {
    const { deps } = effect;
    if (deps.length) {
      let ptr = 0;
      for (let i2 = 0; i2 < deps.length; i2++) {
        const dep = deps[i2];
        if (wasTracked(dep) && !newTracked(dep)) {
          dep.delete(effect);
        } else {
          deps[ptr++] = dep;
        }
        dep.w &= ~trackOpBit;
        dep.n &= ~trackOpBit;
      }
      deps.length = ptr;
    }
  };
  const targetMap = /* @__PURE__ */ new WeakMap();
  let effectTrackDepth = 0;
  let trackOpBit = 1;
  const maxMarkerBits = 30;
  let activeEffect;
  const ITERATE_KEY = Symbol({}.NODE_ENV !== "production" ? "iterate" : "");
  const MAP_KEY_ITERATE_KEY = Symbol({}.NODE_ENV !== "production" ? "Map key iterate" : "");
  class ReactiveEffect {
    constructor(fn, scheduler = null, scope) {
      this.fn = fn;
      this.scheduler = scheduler;
      this.active = true;
      this.deps = [];
      this.parent = void 0;
      recordEffectScope(this, scope);
    }
    run() {
      if (!this.active) {
        return this.fn();
      }
      let parent = activeEffect;
      let lastShouldTrack = shouldTrack;
      while (parent) {
        if (parent === this) {
          return;
        }
        parent = parent.parent;
      }
      try {
        this.parent = activeEffect;
        activeEffect = this;
        shouldTrack = true;
        trackOpBit = 1 << ++effectTrackDepth;
        if (effectTrackDepth <= maxMarkerBits) {
          initDepMarkers(this);
        } else {
          cleanupEffect(this);
        }
        return this.fn();
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          finalizeDepMarkers(this);
        }
        trackOpBit = 1 << --effectTrackDepth;
        activeEffect = this.parent;
        shouldTrack = lastShouldTrack;
        this.parent = void 0;
        if (this.deferStop) {
          this.stop();
        }
      }
    }
    stop() {
      if (activeEffect === this) {
        this.deferStop = true;
      } else if (this.active) {
        cleanupEffect(this);
        if (this.onStop) {
          this.onStop();
        }
        this.active = false;
      }
    }
  }
  function cleanupEffect(effect) {
    const { deps } = effect;
    if (deps.length) {
      for (let i2 = 0; i2 < deps.length; i2++) {
        deps[i2].delete(effect);
      }
      deps.length = 0;
    }
  }
  let shouldTrack = true;
  const trackStack = [];
  function pauseTracking() {
    trackStack.push(shouldTrack);
    shouldTrack = false;
  }
  function resetTracking() {
    const last = trackStack.pop();
    shouldTrack = last === void 0 ? true : last;
  }
  function track(target, type, key) {
    if (shouldTrack && activeEffect) {
      let depsMap = targetMap.get(target);
      if (!depsMap) {
        targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
      }
      let dep = depsMap.get(key);
      if (!dep) {
        depsMap.set(key, dep = createDep());
      }
      const eventInfo = {}.NODE_ENV !== "production" ? { effect: activeEffect, target, type, key } : void 0;
      trackEffects(dep, eventInfo);
    }
  }
  function trackEffects(dep, debuggerEventExtraInfo) {
    let shouldTrack2 = false;
    if (effectTrackDepth <= maxMarkerBits) {
      if (!newTracked(dep)) {
        dep.n |= trackOpBit;
        shouldTrack2 = !wasTracked(dep);
      }
    } else {
      shouldTrack2 = !dep.has(activeEffect);
    }
    if (shouldTrack2) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
      if ({}.NODE_ENV !== "production" && activeEffect.onTrack) {
        activeEffect.onTrack(Object.assign({ effect: activeEffect }, debuggerEventExtraInfo));
      }
    }
  }
  function trigger(target, type, key, newValue, oldValue, oldTarget) {
    const depsMap = targetMap.get(target);
    if (!depsMap) {
      return;
    }
    let deps = [];
    if (type === "clear") {
      deps = [...depsMap.values()];
    } else if (key === "length" && isArray(target)) {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 >= newLength) {
          deps.push(dep);
        }
      });
    } else {
      if (key !== void 0) {
        deps.push(depsMap.get(key));
      }
      switch (type) {
        case "add":
          if (!isArray(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isIntegerKey(key)) {
            deps.push(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!isArray(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            deps.push(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
    const eventInfo = {}.NODE_ENV !== "production" ? { target, type, key, newValue, oldValue, oldTarget } : void 0;
    if (deps.length === 1) {
      if (deps[0]) {
        if ({}.NODE_ENV !== "production") {
          triggerEffects(deps[0], eventInfo);
        } else {
          triggerEffects(deps[0]);
        }
      }
    } else {
      const effects = [];
      for (const dep of deps) {
        if (dep) {
          effects.push(...dep);
        }
      }
      if ({}.NODE_ENV !== "production") {
        triggerEffects(createDep(effects), eventInfo);
      } else {
        triggerEffects(createDep(effects));
      }
    }
  }
  function triggerEffects(dep, debuggerEventExtraInfo) {
    const effects = isArray(dep) ? dep : [...dep];
    for (const effect of effects) {
      if (effect.computed) {
        triggerEffect(effect, debuggerEventExtraInfo);
      }
    }
    for (const effect of effects) {
      if (!effect.computed) {
        triggerEffect(effect, debuggerEventExtraInfo);
      }
    }
  }
  function triggerEffect(effect, debuggerEventExtraInfo) {
    if (effect !== activeEffect || effect.allowRecurse) {
      if ({}.NODE_ENV !== "production" && effect.onTrigger) {
        effect.onTrigger(extend({ effect }, debuggerEventExtraInfo));
      }
      if (effect.scheduler) {
        effect.scheduler();
      } else {
        effect.run();
      }
    }
  }
  const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
  const builtInSymbols = new Set(
    /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
  );
  const get$1 = /* @__PURE__ */ createGetter();
  const shallowGet = /* @__PURE__ */ createGetter(false, true);
  const readonlyGet = /* @__PURE__ */ createGetter(true);
  const shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
  const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
  function createArrayInstrumentations() {
    const instrumentations = {};
    ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
      instrumentations[key] = function(...args) {
        const arr = toRaw(this);
        for (let i2 = 0, l2 = this.length; i2 < l2; i2++) {
          track(arr, "get", i2 + "");
        }
        const res = arr[key](...args);
        if (res === -1 || res === false) {
          return arr[key](...args.map(toRaw));
        } else {
          return res;
        }
      };
    });
    ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
      instrumentations[key] = function(...args) {
        pauseTracking();
        const res = toRaw(this)[key].apply(this, args);
        resetTracking();
        return res;
      };
    });
    return instrumentations;
  }
  function hasOwnProperty(key) {
    const obj = toRaw(this);
    track(obj, "has", key);
    return obj.hasOwnProperty(key);
  }
  function createGetter(isReadonly2 = false, shallow = false) {
    return function get2(target, key, receiver) {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_isShallow") {
        return shallow;
      } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
        return target;
      }
      const targetIsArray = isArray(target);
      if (!isReadonly2) {
        if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
          return Reflect.get(arrayInstrumentations, key, receiver);
        }
        if (key === "hasOwnProperty") {
          return hasOwnProperty;
        }
      }
      const res = Reflect.get(target, key, receiver);
      if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
        return res;
      }
      if (!isReadonly2) {
        track(target, "get", key);
      }
      if (shallow) {
        return res;
      }
      if (isRef(res)) {
        return targetIsArray && isIntegerKey(key) ? res : res.value;
      }
      if (isObject(res)) {
        return isReadonly2 ? readonly(res) : reactive(res);
      }
      return res;
    };
  }
  const set$1 = /* @__PURE__ */ createSetter();
  const shallowSet = /* @__PURE__ */ createSetter(true);
  function createSetter(shallow = false) {
    return function set2(target, key, value, receiver) {
      let oldValue = target[key];
      if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
        return false;
      }
      if (!shallow) {
        if (!isShallow$1(value) && !isReadonly(value)) {
          oldValue = toRaw(oldValue);
          value = toRaw(value);
        }
        if (!isArray(target) && isRef(oldValue) && !isRef(value)) {
          oldValue.value = value;
          return true;
        }
      }
      const hadKey = isArray(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
      const result = Reflect.set(target, key, value, receiver);
      if (target === toRaw(receiver)) {
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value, oldValue);
        }
      }
      return result;
    };
  }
  function deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    const oldValue = target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function has$1(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  function ownKeys(target) {
    track(target, "iterate", isArray(target) ? "length" : ITERATE_KEY);
    return Reflect.ownKeys(target);
  }
  const mutableHandlers = {
    get: get$1,
    set: set$1,
    deleteProperty,
    has: has$1,
    ownKeys
  };
  const readonlyHandlers = {
    get: readonlyGet,
    set(target, key) {
      if ({}.NODE_ENV !== "production") {
        warn$1(`Set operation on key "${String(key)}" failed: target is readonly.`, target);
      }
      return true;
    },
    deleteProperty(target, key) {
      if ({}.NODE_ENV !== "production") {
        warn$1(`Delete operation on key "${String(key)}" failed: target is readonly.`, target);
      }
      return true;
    }
  };
  const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
    get: shallowGet,
    set: shallowSet
  });
  const shallowReadonlyHandlers = /* @__PURE__ */ extend({}, readonlyHandlers, {
    get: shallowReadonlyGet
  });
  const toShallow = (value) => value;
  const getProto = (v2) => Reflect.getPrototypeOf(v2);
  function get(target, key, isReadonly2 = false, isShallow2 = false) {
    target = target[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (!isReadonly2) {
      if (key !== rawKey) {
        track(rawTarget, "get", key);
      }
      track(rawTarget, "get", rawKey);
    }
    const { has: has2 } = getProto(rawTarget);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    if (has2.call(rawTarget, key)) {
      return wrap(target.get(key));
    } else if (has2.call(rawTarget, rawKey)) {
      return wrap(target.get(rawKey));
    } else if (target !== rawTarget) {
      target.get(key);
    }
  }
  function has(key, isReadonly2 = false) {
    const target = this[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ];
    const rawTarget = toRaw(target);
    const rawKey = toRaw(key);
    if (!isReadonly2) {
      if (key !== rawKey) {
        track(rawTarget, "has", key);
      }
      track(rawTarget, "has", rawKey);
    }
    return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
  }
  function size(target, isReadonly2 = false) {
    target = target[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ];
    !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
    return Reflect.get(target, "size", target);
  }
  function add(value) {
    value = toRaw(value);
    const target = toRaw(this);
    const proto = getProto(target);
    const hadKey = proto.has.call(target, value);
    if (!hadKey) {
      target.add(value);
      trigger(target, "add", value, value);
    }
    return this;
  }
  function set(key, value) {
    value = toRaw(value);
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else if ({}.NODE_ENV !== "production") {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get2.call(target, key);
    target.set(key, value);
    if (!hadKey) {
      trigger(target, "add", key, value);
    } else if (hasChanged(value, oldValue)) {
      trigger(target, "set", key, value, oldValue);
    }
    return this;
  }
  function deleteEntry(key) {
    const target = toRaw(this);
    const { has: has2, get: get2 } = getProto(target);
    let hadKey = has2.call(target, key);
    if (!hadKey) {
      key = toRaw(key);
      hadKey = has2.call(target, key);
    } else if ({}.NODE_ENV !== "production") {
      checkIdentityKeys(target, has2, key);
    }
    const oldValue = get2 ? get2.call(target, key) : void 0;
    const result = target.delete(key);
    if (hadKey) {
      trigger(target, "delete", key, void 0, oldValue);
    }
    return result;
  }
  function clear() {
    const target = toRaw(this);
    const hadItems = target.size !== 0;
    const oldTarget = {}.NODE_ENV !== "production" ? isMap(target) ? new Map(target) : new Set(target) : void 0;
    const result = target.clear();
    if (hadItems) {
      trigger(target, "clear", void 0, void 0, oldTarget);
    }
    return result;
  }
  function createForEach(isReadonly2, isShallow2) {
    return function forEach(callback, thisArg) {
      const observed = this;
      const target = observed[
        "__v_raw"
        /* ReactiveFlags.RAW */
      ];
      const rawTarget = toRaw(target);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    };
  }
  function createIterableMethod(method, isReadonly2, isShallow2) {
    return function(...args) {
      const target = this[
        "__v_raw"
        /* ReactiveFlags.RAW */
      ];
      const rawTarget = toRaw(target);
      const targetIsMap = isMap(rawTarget);
      const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
      const isKeyOnly = method === "keys" && targetIsMap;
      const innerIterator = target[method](...args);
      const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
      !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
      return {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        },
        // iterable protocol
        [Symbol.iterator]() {
          return this;
        }
      };
    };
  }
  function createReadonlyMethod(type) {
    return function(...args) {
      if ({}.NODE_ENV !== "production") {
        const key = args[0] ? `on key "${args[0]}" ` : ``;
        console.warn(`${capitalize(type)} operation ${key}failed: target is readonly.`, toRaw(this));
      }
      return type === "delete" ? false : this;
    };
  }
  function createInstrumentations() {
    const mutableInstrumentations2 = {
      get(key) {
        return get(this, key);
      },
      get size() {
        return size(this);
      },
      has,
      add,
      set,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, false)
    };
    const shallowInstrumentations2 = {
      get(key) {
        return get(this, key, false, true);
      },
      get size() {
        return size(this);
      },
      has,
      add,
      set,
      delete: deleteEntry,
      clear,
      forEach: createForEach(false, true)
    };
    const readonlyInstrumentations2 = {
      get(key) {
        return get(this, key, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has.call(this, key, true);
      },
      add: createReadonlyMethod(
        "add"
        /* TriggerOpTypes.ADD */
      ),
      set: createReadonlyMethod(
        "set"
        /* TriggerOpTypes.SET */
      ),
      delete: createReadonlyMethod(
        "delete"
        /* TriggerOpTypes.DELETE */
      ),
      clear: createReadonlyMethod(
        "clear"
        /* TriggerOpTypes.CLEAR */
      ),
      forEach: createForEach(true, false)
    };
    const shallowReadonlyInstrumentations2 = {
      get(key) {
        return get(this, key, true, true);
      },
      get size() {
        return size(this, true);
      },
      has(key) {
        return has.call(this, key, true);
      },
      add: createReadonlyMethod(
        "add"
        /* TriggerOpTypes.ADD */
      ),
      set: createReadonlyMethod(
        "set"
        /* TriggerOpTypes.SET */
      ),
      delete: createReadonlyMethod(
        "delete"
        /* TriggerOpTypes.DELETE */
      ),
      clear: createReadonlyMethod(
        "clear"
        /* TriggerOpTypes.CLEAR */
      ),
      forEach: createForEach(true, true)
    };
    const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
    iteratorMethods.forEach((method) => {
      mutableInstrumentations2[method] = createIterableMethod(method, false, false);
      readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
      shallowInstrumentations2[method] = createIterableMethod(method, false, true);
      shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
    });
    return [
      mutableInstrumentations2,
      readonlyInstrumentations2,
      shallowInstrumentations2,
      shallowReadonlyInstrumentations2
    ];
  }
  const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
  function createInstrumentationGetter(isReadonly2, shallow) {
    const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
    return (target, key, receiver) => {
      if (key === "__v_isReactive") {
        return !isReadonly2;
      } else if (key === "__v_isReadonly") {
        return isReadonly2;
      } else if (key === "__v_raw") {
        return target;
      }
      return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
    };
  }
  const mutableCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, false)
  };
  const shallowCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(false, true)
  };
  const readonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, false)
  };
  const shallowReadonlyCollectionHandlers = {
    get: /* @__PURE__ */ createInstrumentationGetter(true, true)
  };
  function checkIdentityKeys(target, has2, key) {
    const rawKey = toRaw(key);
    if (rawKey !== key && has2.call(target, rawKey)) {
      const type = toRawType(target);
      console.warn(`Reactive ${type} contains both the raw and reactive versions of the same object${type === `Map` ? ` as keys` : ``}, which can lead to inconsistencies. Avoid differentiating between the raw and reactive versions of an object and only use the reactive version if possible.`);
    }
  }
  const reactiveMap = /* @__PURE__ */ new WeakMap();
  const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
  const readonlyMap = /* @__PURE__ */ new WeakMap();
  const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
  function targetTypeMap(rawType) {
    switch (rawType) {
      case "Object":
      case "Array":
        return 1;
      case "Map":
      case "Set":
      case "WeakMap":
      case "WeakSet":
        return 2;
      default:
        return 0;
    }
  }
  function getTargetType(value) {
    return value[
      "__v_skip"
      /* ReactiveFlags.SKIP */
    ] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
  }
  function reactive(target) {
    if (isReadonly(target)) {
      return target;
    }
    return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
  }
  function shallowReactive(target) {
    return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
  }
  function readonly(target) {
    return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
  }
  function shallowReadonly(target) {
    return createReactiveObject(target, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
  }
  function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
    if (!isObject(target)) {
      if ({}.NODE_ENV !== "production") {
        console.warn(`value cannot be made reactive: ${String(target)}`);
      }
      return target;
    }
    if (target[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ] && !(isReadonly2 && target[
      "__v_isReactive"
      /* ReactiveFlags.IS_REACTIVE */
    ])) {
      return target;
    }
    const existingProxy = proxyMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const targetType = getTargetType(target);
    if (targetType === 0) {
      return target;
    }
    const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
    proxyMap.set(target, proxy);
    return proxy;
  }
  function isReactive(value) {
    if (isReadonly(value)) {
      return isReactive(value[
        "__v_raw"
        /* ReactiveFlags.RAW */
      ]);
    }
    return !!(value && value[
      "__v_isReactive"
      /* ReactiveFlags.IS_REACTIVE */
    ]);
  }
  function isReadonly(value) {
    return !!(value && value[
      "__v_isReadonly"
      /* ReactiveFlags.IS_READONLY */
    ]);
  }
  function isShallow$1(value) {
    return !!(value && value[
      "__v_isShallow"
      /* ReactiveFlags.IS_SHALLOW */
    ]);
  }
  function isProxy(value) {
    return isReactive(value) || isReadonly(value);
  }
  function toRaw(observed) {
    const raw = observed && observed[
      "__v_raw"
      /* ReactiveFlags.RAW */
    ];
    return raw ? toRaw(raw) : observed;
  }
  function markRaw(value) {
    def(value, "__v_skip", true);
    return value;
  }
  const toReactive = (value) => isObject(value) ? reactive(value) : value;
  const toReadonly = (value) => isObject(value) ? readonly(value) : value;
  function trackRefValue(ref2) {
    if (shouldTrack && activeEffect) {
      ref2 = toRaw(ref2);
      if ({}.NODE_ENV !== "production") {
        trackEffects(ref2.dep || (ref2.dep = createDep()), {
          target: ref2,
          type: "get",
          key: "value"
        });
      } else {
        trackEffects(ref2.dep || (ref2.dep = createDep()));
      }
    }
  }
  function triggerRefValue(ref2, newVal) {
    ref2 = toRaw(ref2);
    const dep = ref2.dep;
    if (dep) {
      if ({}.NODE_ENV !== "production") {
        triggerEffects(dep, {
          target: ref2,
          type: "set",
          key: "value",
          newValue: newVal
        });
      } else {
        triggerEffects(dep);
      }
    }
  }
  function isRef(r2) {
    return !!(r2 && r2.__v_isRef === true);
  }
  function ref(value) {
    return createRef(value, false);
  }
  function shallowRef(value) {
    return createRef(value, true);
  }
  function createRef(rawValue, shallow) {
    if (isRef(rawValue)) {
      return rawValue;
    }
    return new RefImpl(rawValue, shallow);
  }
  class RefImpl {
    constructor(value, __v_isShallow) {
      this.__v_isShallow = __v_isShallow;
      this.dep = void 0;
      this.__v_isRef = true;
      this._rawValue = __v_isShallow ? value : toRaw(value);
      this._value = __v_isShallow ? value : toReactive(value);
    }
    get value() {
      trackRefValue(this);
      return this._value;
    }
    set value(newVal) {
      const useDirectValue = this.__v_isShallow || isShallow$1(newVal) || isReadonly(newVal);
      newVal = useDirectValue ? newVal : toRaw(newVal);
      if (hasChanged(newVal, this._rawValue)) {
        this._rawValue = newVal;
        this._value = useDirectValue ? newVal : toReactive(newVal);
        triggerRefValue(this, newVal);
      }
    }
  }
  function unref(ref2) {
    return isRef(ref2) ? ref2.value : ref2;
  }
  const shallowUnwrapHandlers = {
    get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
    set: (target, key, value, receiver) => {
      const oldValue = target[key];
      if (isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      } else {
        return Reflect.set(target, key, value, receiver);
      }
    }
  };
  function proxyRefs(objectWithRefs) {
    return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
  }
  var _a$1;
  class ComputedRefImpl {
    constructor(getter, _setter, isReadonly2, isSSR) {
      this._setter = _setter;
      this.dep = void 0;
      this.__v_isRef = true;
      this[_a$1] = false;
      this._dirty = true;
      this.effect = new ReactiveEffect(getter, () => {
        if (!this._dirty) {
          this._dirty = true;
          triggerRefValue(this);
        }
      });
      this.effect.computed = this;
      this.effect.active = this._cacheable = !isSSR;
      this[
        "__v_isReadonly"
        /* ReactiveFlags.IS_READONLY */
      ] = isReadonly2;
    }
    get value() {
      const self2 = toRaw(this);
      trackRefValue(self2);
      if (self2._dirty || !self2._cacheable) {
        self2._dirty = false;
        self2._value = self2.effect.run();
      }
      return self2._value;
    }
    set value(newValue) {
      this._setter(newValue);
    }
  }
  _a$1 = "__v_isReadonly";
  function computed$1(getterOrOptions, debugOptions, isSSR = false) {
    let getter;
    let setter;
    const onlyGetter = isFunction(getterOrOptions);
    if (onlyGetter) {
      getter = getterOrOptions;
      setter = {}.NODE_ENV !== "production" ? () => {
        console.warn("Write operation failed: computed value is readonly");
      } : NOOP;
    } else {
      getter = getterOrOptions.get;
      setter = getterOrOptions.set;
    }
    const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
    if ({}.NODE_ENV !== "production" && debugOptions && !isSSR) {
      cRef.effect.onTrack = debugOptions.onTrack;
      cRef.effect.onTrigger = debugOptions.onTrigger;
    }
    return cRef;
  }
  const stack = [];
  function pushWarningContext(vnode) {
    stack.push(vnode);
  }
  function popWarningContext() {
    stack.pop();
  }
  function warn(msg, ...args) {
    if (!({}.NODE_ENV !== "production"))
      return;
    pauseTracking();
    const instance = stack.length ? stack[stack.length - 1].component : null;
    const appWarnHandler = instance && instance.appContext.config.warnHandler;
    const trace = getComponentTrace();
    if (appWarnHandler) {
      callWithErrorHandling(appWarnHandler, instance, 11, [
        msg + args.join(""),
        instance && instance.proxy,
        trace.map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
        trace
      ]);
    } else {
      const warnArgs = [`[Vue warn]: ${msg}`, ...args];
      if (trace.length && // avoid spamming console during tests
      true) {
        warnArgs.push(`
`, ...formatTrace(trace));
      }
      console.warn(...warnArgs);
    }
    resetTracking();
  }
  function getComponentTrace() {
    let currentVNode = stack[stack.length - 1];
    if (!currentVNode) {
      return [];
    }
    const normalizedStack = [];
    while (currentVNode) {
      const last = normalizedStack[0];
      if (last && last.vnode === currentVNode) {
        last.recurseCount++;
      } else {
        normalizedStack.push({
          vnode: currentVNode,
          recurseCount: 0
        });
      }
      const parentInstance = currentVNode.component && currentVNode.component.parent;
      currentVNode = parentInstance && parentInstance.vnode;
    }
    return normalizedStack;
  }
  function formatTrace(trace) {
    const logs = [];
    trace.forEach((entry, i2) => {
      logs.push(...i2 === 0 ? [] : [`
`], ...formatTraceEntry(entry));
    });
    return logs;
  }
  function formatTraceEntry({ vnode, recurseCount }) {
    const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
    const isRoot = vnode.component ? vnode.component.parent == null : false;
    const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
    const close = `>` + postfix;
    return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
  }
  function formatProps(props) {
    const res = [];
    const keys = Object.keys(props);
    keys.slice(0, 3).forEach((key) => {
      res.push(...formatProp(key, props[key]));
    });
    if (keys.length > 3) {
      res.push(` ...`);
    }
    return res;
  }
  function formatProp(key, value, raw) {
    if (isString(value)) {
      value = JSON.stringify(value);
      return raw ? value : [`${key}=${value}`];
    } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
      return raw ? value : [`${key}=${value}`];
    } else if (isRef(value)) {
      value = formatProp(key, toRaw(value.value), true);
      return raw ? value : [`${key}=Ref<`, value, `>`];
    } else if (isFunction(value)) {
      return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
    } else {
      value = toRaw(value);
      return raw ? value : [`${key}=`, value];
    }
  }
  const ErrorTypeStrings = {
    [
      "sp"
      /* LifecycleHooks.SERVER_PREFETCH */
    ]: "serverPrefetch hook",
    [
      "bc"
      /* LifecycleHooks.BEFORE_CREATE */
    ]: "beforeCreate hook",
    [
      "c"
      /* LifecycleHooks.CREATED */
    ]: "created hook",
    [
      "bm"
      /* LifecycleHooks.BEFORE_MOUNT */
    ]: "beforeMount hook",
    [
      "m"
      /* LifecycleHooks.MOUNTED */
    ]: "mounted hook",
    [
      "bu"
      /* LifecycleHooks.BEFORE_UPDATE */
    ]: "beforeUpdate hook",
    [
      "u"
      /* LifecycleHooks.UPDATED */
    ]: "updated",
    [
      "bum"
      /* LifecycleHooks.BEFORE_UNMOUNT */
    ]: "beforeUnmount hook",
    [
      "um"
      /* LifecycleHooks.UNMOUNTED */
    ]: "unmounted hook",
    [
      "a"
      /* LifecycleHooks.ACTIVATED */
    ]: "activated hook",
    [
      "da"
      /* LifecycleHooks.DEACTIVATED */
    ]: "deactivated hook",
    [
      "ec"
      /* LifecycleHooks.ERROR_CAPTURED */
    ]: "errorCaptured hook",
    [
      "rtc"
      /* LifecycleHooks.RENDER_TRACKED */
    ]: "renderTracked hook",
    [
      "rtg"
      /* LifecycleHooks.RENDER_TRIGGERED */
    ]: "renderTriggered hook",
    [
      0
      /* ErrorCodes.SETUP_FUNCTION */
    ]: "setup function",
    [
      1
      /* ErrorCodes.RENDER_FUNCTION */
    ]: "render function",
    [
      2
      /* ErrorCodes.WATCH_GETTER */
    ]: "watcher getter",
    [
      3
      /* ErrorCodes.WATCH_CALLBACK */
    ]: "watcher callback",
    [
      4
      /* ErrorCodes.WATCH_CLEANUP */
    ]: "watcher cleanup function",
    [
      5
      /* ErrorCodes.NATIVE_EVENT_HANDLER */
    ]: "native event handler",
    [
      6
      /* ErrorCodes.COMPONENT_EVENT_HANDLER */
    ]: "component event handler",
    [
      7
      /* ErrorCodes.VNODE_HOOK */
    ]: "vnode hook",
    [
      8
      /* ErrorCodes.DIRECTIVE_HOOK */
    ]: "directive hook",
    [
      9
      /* ErrorCodes.TRANSITION_HOOK */
    ]: "transition hook",
    [
      10
      /* ErrorCodes.APP_ERROR_HANDLER */
    ]: "app errorHandler",
    [
      11
      /* ErrorCodes.APP_WARN_HANDLER */
    ]: "app warnHandler",
    [
      12
      /* ErrorCodes.FUNCTION_REF */
    ]: "ref function",
    [
      13
      /* ErrorCodes.ASYNC_COMPONENT_LOADER */
    ]: "async component loader",
    [
      14
      /* ErrorCodes.SCHEDULER */
    ]: "scheduler flush. This is likely a Vue internals bug. Please open an issue at https://new-issue.vuejs.org/?repo=vuejs/core"
  };
  function callWithErrorHandling(fn, instance, type, args) {
    let res;
    try {
      res = args ? fn(...args) : fn();
    } catch (err) {
      handleError(err, instance, type);
    }
    return res;
  }
  function callWithAsyncErrorHandling(fn, instance, type, args) {
    if (isFunction(fn)) {
      const res = callWithErrorHandling(fn, instance, type, args);
      if (res && isPromise(res)) {
        res.catch((err) => {
          handleError(err, instance, type);
        });
      }
      return res;
    }
    const values = [];
    for (let i2 = 0; i2 < fn.length; i2++) {
      values.push(callWithAsyncErrorHandling(fn[i2], instance, type, args));
    }
    return values;
  }
  function handleError(err, instance, type, throwInDev = true) {
    const contextVNode = instance ? instance.vnode : null;
    if (instance) {
      let cur = instance.parent;
      const exposedInstance = instance.proxy;
      const errorInfo = {}.NODE_ENV !== "production" ? ErrorTypeStrings[type] : type;
      while (cur) {
        const errorCapturedHooks = cur.ec;
        if (errorCapturedHooks) {
          for (let i2 = 0; i2 < errorCapturedHooks.length; i2++) {
            if (errorCapturedHooks[i2](err, exposedInstance, errorInfo) === false) {
              return;
            }
          }
        }
        cur = cur.parent;
      }
      const appErrorHandler = instance.appContext.config.errorHandler;
      if (appErrorHandler) {
        callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
        return;
      }
    }
    logError(err, type, contextVNode, throwInDev);
  }
  function logError(err, type, contextVNode, throwInDev = true) {
    if ({}.NODE_ENV !== "production") {
      const info = ErrorTypeStrings[type];
      if (contextVNode) {
        pushWarningContext(contextVNode);
      }
      warn(`Unhandled error${info ? ` during execution of ${info}` : ``}`);
      if (contextVNode) {
        popWarningContext();
      }
      if (throwInDev) {
        throw err;
      } else {
        console.error(err);
      }
    } else {
      console.error(err);
    }
  }
  let isFlushing = false;
  let isFlushPending = false;
  const queue = [];
  let flushIndex = 0;
  const pendingPostFlushCbs = [];
  let activePostFlushCbs = null;
  let postFlushIndex = 0;
  const resolvedPromise = /* @__PURE__ */ Promise.resolve();
  let currentFlushPromise = null;
  const RECURSION_LIMIT = 100;
  function nextTick(fn) {
    const p2 = currentFlushPromise || resolvedPromise;
    return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
  }
  function findInsertionIndex(id) {
    let start = flushIndex + 1;
    let end = queue.length;
    while (start < end) {
      const middle = start + end >>> 1;
      const middleJobId = getId(queue[middle]);
      middleJobId < id ? start = middle + 1 : end = middle;
    }
    return start;
  }
  function queueJob(job) {
    if (!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
      if (job.id == null) {
        queue.push(job);
      } else {
        queue.splice(findInsertionIndex(job.id), 0, job);
      }
      queueFlush();
    }
  }
  function queueFlush() {
    if (!isFlushing && !isFlushPending) {
      isFlushPending = true;
      currentFlushPromise = resolvedPromise.then(flushJobs);
    }
  }
  function invalidateJob(job) {
    const i2 = queue.indexOf(job);
    if (i2 > flushIndex) {
      queue.splice(i2, 1);
    }
  }
  function queuePostFlushCb(cb) {
    if (!isArray(cb)) {
      if (!activePostFlushCbs || !activePostFlushCbs.includes(cb, cb.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
        pendingPostFlushCbs.push(cb);
      }
    } else {
      pendingPostFlushCbs.push(...cb);
    }
    queueFlush();
  }
  function flushPreFlushCbs(seen, i2 = isFlushing ? flushIndex + 1 : 0) {
    if ({}.NODE_ENV !== "production") {
      seen = seen || /* @__PURE__ */ new Map();
    }
    for (; i2 < queue.length; i2++) {
      const cb = queue[i2];
      if (cb && cb.pre) {
        if ({}.NODE_ENV !== "production" && checkRecursiveUpdates(seen, cb)) {
          continue;
        }
        queue.splice(i2, 1);
        i2--;
        cb();
      }
    }
  }
  function flushPostFlushCbs(seen) {
    if (pendingPostFlushCbs.length) {
      const deduped = [...new Set(pendingPostFlushCbs)];
      pendingPostFlushCbs.length = 0;
      if (activePostFlushCbs) {
        activePostFlushCbs.push(...deduped);
        return;
      }
      activePostFlushCbs = deduped;
      if ({}.NODE_ENV !== "production") {
        seen = seen || /* @__PURE__ */ new Map();
      }
      activePostFlushCbs.sort((a2, b2) => getId(a2) - getId(b2));
      for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
        if ({}.NODE_ENV !== "production" && checkRecursiveUpdates(seen, activePostFlushCbs[postFlushIndex])) {
          continue;
        }
        activePostFlushCbs[postFlushIndex]();
      }
      activePostFlushCbs = null;
      postFlushIndex = 0;
    }
  }
  const getId = (job) => job.id == null ? Infinity : job.id;
  const comparator = (a2, b2) => {
    const diff = getId(a2) - getId(b2);
    if (diff === 0) {
      if (a2.pre && !b2.pre)
        return -1;
      if (b2.pre && !a2.pre)
        return 1;
    }
    return diff;
  };
  function flushJobs(seen) {
    isFlushPending = false;
    isFlushing = true;
    if ({}.NODE_ENV !== "production") {
      seen = seen || /* @__PURE__ */ new Map();
    }
    queue.sort(comparator);
    const check = {}.NODE_ENV !== "production" ? (job) => checkRecursiveUpdates(seen, job) : NOOP;
    try {
      for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
        const job = queue[flushIndex];
        if (job && job.active !== false) {
          if ({}.NODE_ENV !== "production" && check(job)) {
            continue;
          }
          callWithErrorHandling(
            job,
            null,
            14
            /* ErrorCodes.SCHEDULER */
          );
        }
      }
    } finally {
      flushIndex = 0;
      queue.length = 0;
      flushPostFlushCbs(seen);
      isFlushing = false;
      currentFlushPromise = null;
      if (queue.length || pendingPostFlushCbs.length) {
        flushJobs(seen);
      }
    }
  }
  function checkRecursiveUpdates(seen, fn) {
    if (!seen.has(fn)) {
      seen.set(fn, 1);
    } else {
      const count = seen.get(fn);
      if (count > RECURSION_LIMIT) {
        const instance = fn.ownerInstance;
        const componentName = instance && getComponentName(instance.type);
        warn(`Maximum recursive updates exceeded${componentName ? ` in component <${componentName}>` : ``}. This means you have a reactive effect that is mutating its own dependencies and thus recursively triggering itself. Possible sources include component template, render function, updated hook or watcher source function.`);
        return true;
      } else {
        seen.set(fn, count + 1);
      }
    }
  }
  let isHmrUpdating = false;
  const hmrDirtyComponents = /* @__PURE__ */ new Set();
  if ({}.NODE_ENV !== "production") {
    getGlobalThis().__VUE_HMR_RUNTIME__ = {
      createRecord: tryWrap(createRecord),
      rerender: tryWrap(rerender),
      reload: tryWrap(reload)
    };
  }
  const map = /* @__PURE__ */ new Map();
  function registerHMR(instance) {
    const id = instance.type.__hmrId;
    let record = map.get(id);
    if (!record) {
      createRecord(id, instance.type);
      record = map.get(id);
    }
    record.instances.add(instance);
  }
  function unregisterHMR(instance) {
    map.get(instance.type.__hmrId).instances.delete(instance);
  }
  function createRecord(id, initialDef) {
    if (map.has(id)) {
      return false;
    }
    map.set(id, {
      initialDef: normalizeClassComponent(initialDef),
      instances: /* @__PURE__ */ new Set()
    });
    return true;
  }
  function normalizeClassComponent(component) {
    return isClassComponent(component) ? component.__vccOpts : component;
  }
  function rerender(id, newRender) {
    const record = map.get(id);
    if (!record) {
      return;
    }
    record.initialDef.render = newRender;
    [...record.instances].forEach((instance) => {
      if (newRender) {
        instance.render = newRender;
        normalizeClassComponent(instance.type).render = newRender;
      }
      instance.renderCache = [];
      isHmrUpdating = true;
      instance.update();
      isHmrUpdating = false;
    });
  }
  function reload(id, newComp) {
    const record = map.get(id);
    if (!record)
      return;
    newComp = normalizeClassComponent(newComp);
    updateComponentDef(record.initialDef, newComp);
    const instances = [...record.instances];
    for (const instance of instances) {
      const oldComp = normalizeClassComponent(instance.type);
      if (!hmrDirtyComponents.has(oldComp)) {
        if (oldComp !== record.initialDef) {
          updateComponentDef(oldComp, newComp);
        }
        hmrDirtyComponents.add(oldComp);
      }
      instance.appContext.optionsCache.delete(instance.type);
      if (instance.ceReload) {
        hmrDirtyComponents.add(oldComp);
        instance.ceReload(newComp.styles);
        hmrDirtyComponents.delete(oldComp);
      } else if (instance.parent) {
        queueJob(instance.parent.update);
      } else if (instance.appContext.reload) {
        instance.appContext.reload();
      } else if (typeof window !== "undefined") {
        window.location.reload();
      } else {
        console.warn("[HMR] Root or manually mounted instance modified. Full reload required.");
      }
    }
    queuePostFlushCb(() => {
      for (const instance of instances) {
        hmrDirtyComponents.delete(normalizeClassComponent(instance.type));
      }
    });
  }
  function updateComponentDef(oldComp, newComp) {
    extend(oldComp, newComp);
    for (const key in oldComp) {
      if (key !== "__file" && !(key in newComp)) {
        delete oldComp[key];
      }
    }
  }
  function tryWrap(fn) {
    return (id, arg) => {
      try {
        return fn(id, arg);
      } catch (e2) {
        console.error(e2);
        console.warn(`[HMR] Something went wrong during Vue component hot-reload. Full reload required.`);
      }
    };
  }
  let devtools;
  let buffer = [];
  let devtoolsNotInstalled = false;
  function emit$1(event, ...args) {
    if (devtools) {
      devtools.emit(event, ...args);
    } else if (!devtoolsNotInstalled) {
      buffer.push({ event, args });
    }
  }
  function setDevtoolsHook(hook, target) {
    var _a, _b;
    devtools = hook;
    if (devtools) {
      devtools.enabled = true;
      buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
      buffer = [];
    } else if (
      // handle late devtools injection - only do this if we are in an actual
      // browser environment to avoid the timer handle stalling test runner exit
      // (#4815)
      typeof window !== "undefined" && // some envs mock window but not fully
      window.HTMLElement && // also exclude jsdom
      !((_b = (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) === null || _b === void 0 ? void 0 : _b.includes("jsdom"))
    ) {
      const replay = target.__VUE_DEVTOOLS_HOOK_REPLAY__ = target.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
      replay.push((newHook) => {
        setDevtoolsHook(newHook, target);
      });
      setTimeout(() => {
        if (!devtools) {
          target.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
          devtoolsNotInstalled = true;
          buffer = [];
        }
      }, 3e3);
    } else {
      devtoolsNotInstalled = true;
      buffer = [];
    }
  }
  function devtoolsInitApp(app, version2) {
    emit$1("app:init", app, version2, {
      Fragment,
      Text,
      Comment: Comment$1,
      Static
    });
  }
  function devtoolsUnmountApp(app) {
    emit$1("app:unmount", app);
  }
  const devtoolsComponentAdded = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:added"
    /* DevtoolsHooks.COMPONENT_ADDED */
  );
  const devtoolsComponentUpdated = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:updated"
    /* DevtoolsHooks.COMPONENT_UPDATED */
  );
  const _devtoolsComponentRemoved = /* @__PURE__ */ createDevtoolsComponentHook(
    "component:removed"
    /* DevtoolsHooks.COMPONENT_REMOVED */
  );
  const devtoolsComponentRemoved = (component) => {
    if (devtools && typeof devtools.cleanupBuffer === "function" && // remove the component if it wasn't buffered
    !devtools.cleanupBuffer(component)) {
      _devtoolsComponentRemoved(component);
    }
  };
  function createDevtoolsComponentHook(hook) {
    return (component) => {
      emit$1(hook, component.appContext.app, component.uid, component.parent ? component.parent.uid : void 0, component);
    };
  }
  const devtoolsPerfStart = /* @__PURE__ */ createDevtoolsPerformanceHook(
    "perf:start"
    /* DevtoolsHooks.PERFORMANCE_START */
  );
  const devtoolsPerfEnd = /* @__PURE__ */ createDevtoolsPerformanceHook(
    "perf:end"
    /* DevtoolsHooks.PERFORMANCE_END */
  );
  function createDevtoolsPerformanceHook(hook) {
    return (component, type, time) => {
      emit$1(hook, component.appContext.app, component.uid, component, type, time);
    };
  }
  function devtoolsComponentEmit(component, event, params) {
    emit$1("component:emit", component.appContext.app, component, event, params);
  }
  function emit(instance, event, ...rawArgs) {
    if (instance.isUnmounted)
      return;
    const props = instance.vnode.props || EMPTY_OBJ;
    if ({}.NODE_ENV !== "production") {
      const { emitsOptions, propsOptions: [propsOptions] } = instance;
      if (emitsOptions) {
        if (!(event in emitsOptions) && true) {
          if (!propsOptions || !(toHandlerKey(event) in propsOptions)) {
            warn(`Component emitted event "${event}" but it is neither declared in the emits option nor as an "${toHandlerKey(event)}" prop.`);
          }
        } else {
          const validator = emitsOptions[event];
          if (isFunction(validator)) {
            const isValid = validator(...rawArgs);
            if (!isValid) {
              warn(`Invalid event arguments: event validation failed for event "${event}".`);
            }
          }
        }
      }
    }
    let args = rawArgs;
    const isModelListener2 = event.startsWith("update:");
    const modelArg = isModelListener2 && event.slice(7);
    if (modelArg && modelArg in props) {
      const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
      const { number, trim } = props[modifiersKey] || EMPTY_OBJ;
      if (trim) {
        args = rawArgs.map((a2) => isString(a2) ? a2.trim() : a2);
      }
      if (number) {
        args = rawArgs.map(looseToNumber);
      }
    }
    if ({}.NODE_ENV !== "production" || false) {
      devtoolsComponentEmit(instance, event, args);
    }
    if ({}.NODE_ENV !== "production") {
      const lowerCaseEvent = event.toLowerCase();
      if (lowerCaseEvent !== event && props[toHandlerKey(lowerCaseEvent)]) {
        warn(`Event "${lowerCaseEvent}" is emitted in component ${formatComponentName(instance, instance.type)} but the handler is registered for "${event}". Note that HTML attributes are case-insensitive and you cannot use v-on to listen to camelCase events when using in-DOM templates. You should probably use "${hyphenate(event)}" instead of "${event}".`);
      }
    }
    let handlerName;
    let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
    props[handlerName = toHandlerKey(camelize(event))];
    if (!handler && isModelListener2) {
      handler = props[handlerName = toHandlerKey(hyphenate(event))];
    }
    if (handler) {
      callWithAsyncErrorHandling(handler, instance, 6, args);
    }
    const onceHandler = props[handlerName + `Once`];
    if (onceHandler) {
      if (!instance.emitted) {
        instance.emitted = {};
      } else if (instance.emitted[handlerName]) {
        return;
      }
      instance.emitted[handlerName] = true;
      callWithAsyncErrorHandling(onceHandler, instance, 6, args);
    }
  }
  function normalizeEmitsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.emitsCache;
    const cached = cache.get(comp);
    if (cached !== void 0) {
      return cached;
    }
    const raw = comp.emits;
    let normalized = {};
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendEmits = (raw2) => {
        const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
        if (normalizedFromExtend) {
          hasExtends = true;
          extend(normalized, normalizedFromExtend);
        }
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendEmits);
      }
      if (comp.extends) {
        extendEmits(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendEmits);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, null);
      }
      return null;
    }
    if (isArray(raw)) {
      raw.forEach((key) => normalized[key] = null);
    } else {
      extend(normalized, raw);
    }
    if (isObject(comp)) {
      cache.set(comp, normalized);
    }
    return normalized;
  }
  function isEmitListener(options, key) {
    if (!options || !isOn(key)) {
      return false;
    }
    key = key.slice(2).replace(/Once$/, "");
    return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
  }
  let currentRenderingInstance = null;
  let currentScopeId = null;
  function setCurrentRenderingInstance(instance) {
    const prev = currentRenderingInstance;
    currentRenderingInstance = instance;
    currentScopeId = instance && instance.type.__scopeId || null;
    return prev;
  }
  function pushScopeId(id) {
    currentScopeId = id;
  }
  function popScopeId() {
    currentScopeId = null;
  }
  function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
    if (!ctx)
      return fn;
    if (fn._n) {
      return fn;
    }
    const renderFnWithContext = (...args) => {
      if (renderFnWithContext._d) {
        setBlockTracking(-1);
      }
      const prevInstance = setCurrentRenderingInstance(ctx);
      let res;
      try {
        res = fn(...args);
      } finally {
        setCurrentRenderingInstance(prevInstance);
        if (renderFnWithContext._d) {
          setBlockTracking(1);
        }
      }
      if ({}.NODE_ENV !== "production" || false) {
        devtoolsComponentUpdated(ctx);
      }
      return res;
    };
    renderFnWithContext._n = true;
    renderFnWithContext._c = true;
    renderFnWithContext._d = true;
    return renderFnWithContext;
  }
  let accessedAttrs = false;
  function markAttrsAccessed() {
    accessedAttrs = true;
  }
  function renderComponentRoot(instance) {
    const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit: emit2, render, renderCache, data, setupState, ctx, inheritAttrs } = instance;
    let result;
    let fallthroughAttrs;
    const prev = setCurrentRenderingInstance(instance);
    if ({}.NODE_ENV !== "production") {
      accessedAttrs = false;
    }
    try {
      if (vnode.shapeFlag & 4) {
        const proxyToUse = withProxy || proxy;
        result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
        fallthroughAttrs = attrs;
      } else {
        const render2 = Component;
        if ({}.NODE_ENV !== "production" && attrs === props) {
          markAttrsAccessed();
        }
        result = normalizeVNode(render2.length > 1 ? render2(props, {}.NODE_ENV !== "production" ? {
          get attrs() {
            markAttrsAccessed();
            return attrs;
          },
          slots,
          emit: emit2
        } : { attrs, slots, emit: emit2 }) : render2(
          props,
          null
          /* we know it doesn't need it */
        ));
        fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
      }
    } catch (err) {
      blockStack.length = 0;
      handleError(
        err,
        instance,
        1
        /* ErrorCodes.RENDER_FUNCTION */
      );
      result = createVNode(Comment$1);
    }
    let root = result;
    let setRoot = void 0;
    if ({}.NODE_ENV !== "production" && result.patchFlag > 0 && result.patchFlag & 2048) {
      [root, setRoot] = getChildRoot(result);
    }
    if (fallthroughAttrs && inheritAttrs !== false) {
      const keys = Object.keys(fallthroughAttrs);
      const { shapeFlag } = root;
      if (keys.length) {
        if (shapeFlag & (1 | 6)) {
          if (propsOptions && keys.some(isModelListener)) {
            fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
          }
          root = cloneVNode(root, fallthroughAttrs);
        } else if ({}.NODE_ENV !== "production" && !accessedAttrs && root.type !== Comment$1) {
          const allAttrs = Object.keys(attrs);
          const eventAttrs = [];
          const extraAttrs = [];
          for (let i2 = 0, l2 = allAttrs.length; i2 < l2; i2++) {
            const key = allAttrs[i2];
            if (isOn(key)) {
              if (!isModelListener(key)) {
                eventAttrs.push(key[2].toLowerCase() + key.slice(3));
              }
            } else {
              extraAttrs.push(key);
            }
          }
          if (extraAttrs.length) {
            warn(`Extraneous non-props attributes (${extraAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes.`);
          }
          if (eventAttrs.length) {
            warn(`Extraneous non-emits event listeners (${eventAttrs.join(", ")}) were passed to component but could not be automatically inherited because component renders fragment or text root nodes. If the listener is intended to be a component custom event listener only, declare it using the "emits" option.`);
          }
        }
      }
    }
    if (vnode.dirs) {
      if ({}.NODE_ENV !== "production" && !isElementRoot(root)) {
        warn(`Runtime directive used on component with non-element root node. The directives will not function as intended.`);
      }
      root = cloneVNode(root);
      root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
    }
    if (vnode.transition) {
      if ({}.NODE_ENV !== "production" && !isElementRoot(root)) {
        warn(`Component inside <Transition> renders non-element root node that cannot be animated.`);
      }
      root.transition = vnode.transition;
    }
    if ({}.NODE_ENV !== "production" && setRoot) {
      setRoot(root);
    } else {
      result = root;
    }
    setCurrentRenderingInstance(prev);
    return result;
  }
  const getChildRoot = (vnode) => {
    const rawChildren = vnode.children;
    const dynamicChildren = vnode.dynamicChildren;
    const childRoot = filterSingleRoot(rawChildren);
    if (!childRoot) {
      return [vnode, void 0];
    }
    const index = rawChildren.indexOf(childRoot);
    const dynamicIndex = dynamicChildren ? dynamicChildren.indexOf(childRoot) : -1;
    const setRoot = (updatedRoot) => {
      rawChildren[index] = updatedRoot;
      if (dynamicChildren) {
        if (dynamicIndex > -1) {
          dynamicChildren[dynamicIndex] = updatedRoot;
        } else if (updatedRoot.patchFlag > 0) {
          vnode.dynamicChildren = [...dynamicChildren, updatedRoot];
        }
      }
    };
    return [normalizeVNode(childRoot), setRoot];
  };
  function filterSingleRoot(children) {
    let singleRoot;
    for (let i2 = 0; i2 < children.length; i2++) {
      const child = children[i2];
      if (isVNode(child)) {
        if (child.type !== Comment$1 || child.children === "v-if") {
          if (singleRoot) {
            return;
          } else {
            singleRoot = child;
          }
        }
      } else {
        return;
      }
    }
    return singleRoot;
  }
  const getFunctionalFallthrough = (attrs) => {
    let res;
    for (const key in attrs) {
      if (key === "class" || key === "style" || isOn(key)) {
        (res || (res = {}))[key] = attrs[key];
      }
    }
    return res;
  };
  const filterModelListeners = (attrs, props) => {
    const res = {};
    for (const key in attrs) {
      if (!isModelListener(key) || !(key.slice(9) in props)) {
        res[key] = attrs[key];
      }
    }
    return res;
  };
  const isElementRoot = (vnode) => {
    return vnode.shapeFlag & (6 | 1) || vnode.type === Comment$1;
  };
  function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
    const { props: prevProps, children: prevChildren, component } = prevVNode;
    const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
    const emits = component.emitsOptions;
    if ({}.NODE_ENV !== "production" && (prevChildren || nextChildren) && isHmrUpdating) {
      return true;
    }
    if (nextVNode.dirs || nextVNode.transition) {
      return true;
    }
    if (optimized && patchFlag >= 0) {
      if (patchFlag & 1024) {
        return true;
      }
      if (patchFlag & 16) {
        if (!prevProps) {
          return !!nextProps;
        }
        return hasPropsChanged(prevProps, nextProps, emits);
      } else if (patchFlag & 8) {
        const dynamicProps = nextVNode.dynamicProps;
        for (let i2 = 0; i2 < dynamicProps.length; i2++) {
          const key = dynamicProps[i2];
          if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
            return true;
          }
        }
      }
    } else {
      if (prevChildren || nextChildren) {
        if (!nextChildren || !nextChildren.$stable) {
          return true;
        }
      }
      if (prevProps === nextProps) {
        return false;
      }
      if (!prevProps) {
        return !!nextProps;
      }
      if (!nextProps) {
        return true;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    }
    return false;
  }
  function hasPropsChanged(prevProps, nextProps, emitsOptions) {
    const nextKeys = Object.keys(nextProps);
    if (nextKeys.length !== Object.keys(prevProps).length) {
      return true;
    }
    for (let i2 = 0; i2 < nextKeys.length; i2++) {
      const key = nextKeys[i2];
      if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
        return true;
      }
    }
    return false;
  }
  function updateHOCHostEl({ vnode, parent }, el) {
    while (parent && parent.subTree === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    }
  }
  const isSuspense = (type) => type.__isSuspense;
  function queueEffectWithSuspense(fn, suspense) {
    if (suspense && suspense.pendingBranch) {
      if (isArray(fn)) {
        suspense.effects.push(...fn);
      } else {
        suspense.effects.push(fn);
      }
    } else {
      queuePostFlushCb(fn);
    }
  }
  function provide(key, value) {
    if (!currentInstance) {
      if ({}.NODE_ENV !== "production") {
        warn(`provide() can only be used inside setup().`);
      }
    } else {
      let provides = currentInstance.provides;
      const parentProvides = currentInstance.parent && currentInstance.parent.provides;
      if (parentProvides === provides) {
        provides = currentInstance.provides = Object.create(parentProvides);
      }
      provides[key] = value;
    }
  }
  function inject(key, defaultValue, treatDefaultAsFactory = false) {
    const instance = currentInstance || currentRenderingInstance;
    if (instance) {
      const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
      if (provides && key in provides) {
        return provides[key];
      } else if (arguments.length > 1) {
        return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
      } else if ({}.NODE_ENV !== "production") {
        warn(`injection "${String(key)}" not found.`);
      }
    } else if ({}.NODE_ENV !== "production") {
      warn(`inject() can only be used inside setup() or functional components.`);
    }
  }
  function watchEffect(effect, options) {
    return doWatch(effect, null, options);
  }
  const INITIAL_WATCHER_VALUE = {};
  function watch(source, cb, options) {
    if ({}.NODE_ENV !== "production" && !isFunction(cb)) {
      warn(`\`watch(fn, options?)\` signature has been moved to a separate API. Use \`watchEffect(fn, options?)\` instead. \`watch\` now only supports \`watch(source, cb, options?) signature.`);
    }
    return doWatch(source, cb, options);
  }
  function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
    if ({}.NODE_ENV !== "production" && !cb) {
      if (immediate !== void 0) {
        warn(`watch() "immediate" option is only respected when using the watch(source, callback, options?) signature.`);
      }
      if (deep !== void 0) {
        warn(`watch() "deep" option is only respected when using the watch(source, callback, options?) signature.`);
      }
    }
    const warnInvalidSource = (s2) => {
      warn(`Invalid watch source: `, s2, `A watch source can only be a getter/effect function, a ref, a reactive object, or an array of these types.`);
    };
    const instance = getCurrentScope() === (currentInstance === null || currentInstance === void 0 ? void 0 : currentInstance.scope) ? currentInstance : null;
    let getter;
    let forceTrigger = false;
    let isMultiSource = false;
    if (isRef(source)) {
      getter = () => source.value;
      forceTrigger = isShallow$1(source);
    } else if (isReactive(source)) {
      getter = () => source;
      deep = true;
    } else if (isArray(source)) {
      isMultiSource = true;
      forceTrigger = source.some((s2) => isReactive(s2) || isShallow$1(s2));
      getter = () => source.map((s2) => {
        if (isRef(s2)) {
          return s2.value;
        } else if (isReactive(s2)) {
          return traverse(s2);
        } else if (isFunction(s2)) {
          return callWithErrorHandling(
            s2,
            instance,
            2
            /* ErrorCodes.WATCH_GETTER */
          );
        } else {
          ({}).NODE_ENV !== "production" && warnInvalidSource(s2);
        }
      });
    } else if (isFunction(source)) {
      if (cb) {
        getter = () => callWithErrorHandling(
          source,
          instance,
          2
          /* ErrorCodes.WATCH_GETTER */
        );
      } else {
        getter = () => {
          if (instance && instance.isUnmounted) {
            return;
          }
          if (cleanup) {
            cleanup();
          }
          return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
        };
      }
    } else {
      getter = NOOP;
      ({}).NODE_ENV !== "production" && warnInvalidSource(source);
    }
    if (cb && deep) {
      const baseGetter = getter;
      getter = () => traverse(baseGetter());
    }
    let cleanup;
    let onCleanup = (fn) => {
      cleanup = effect.onStop = () => {
        callWithErrorHandling(
          fn,
          instance,
          4
          /* ErrorCodes.WATCH_CLEANUP */
        );
      };
    };
    let ssrCleanup;
    if (isInSSRComponentSetup) {
      onCleanup = NOOP;
      if (!cb) {
        getter();
      } else if (immediate) {
        callWithAsyncErrorHandling(cb, instance, 3, [
          getter(),
          isMultiSource ? [] : void 0,
          onCleanup
        ]);
      }
      if (flush === "sync") {
        const ctx = useSSRContext();
        ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
      } else {
        return NOOP;
      }
    }
    let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
    const job = () => {
      if (!effect.active) {
        return;
      }
      if (cb) {
        const newValue = effect.run();
        if (deep || forceTrigger || (isMultiSource ? newValue.some((v2, i2) => hasChanged(v2, oldValue[i2])) : hasChanged(newValue, oldValue)) || false) {
          if (cleanup) {
            cleanup();
          }
          callWithAsyncErrorHandling(cb, instance, 3, [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            onCleanup
          ]);
          oldValue = newValue;
        }
      } else {
        effect.run();
      }
    };
    job.allowRecurse = !!cb;
    let scheduler;
    if (flush === "sync") {
      scheduler = job;
    } else if (flush === "post") {
      scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
    } else {
      job.pre = true;
      if (instance)
        job.id = instance.uid;
      scheduler = () => queueJob(job);
    }
    const effect = new ReactiveEffect(getter, scheduler);
    if ({}.NODE_ENV !== "production") {
      effect.onTrack = onTrack;
      effect.onTrigger = onTrigger;
    }
    if (cb) {
      if (immediate) {
        job();
      } else {
        oldValue = effect.run();
      }
    } else if (flush === "post") {
      queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
    } else {
      effect.run();
    }
    const unwatch = () => {
      effect.stop();
      if (instance && instance.scope) {
        remove(instance.scope.effects, effect);
      }
    };
    if (ssrCleanup)
      ssrCleanup.push(unwatch);
    return unwatch;
  }
  function instanceWatch(source, value, options) {
    const publicThis = this.proxy;
    const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
    let cb;
    if (isFunction(value)) {
      cb = value;
    } else {
      cb = value.handler;
      options = value;
    }
    const cur = currentInstance;
    setCurrentInstance(this);
    const res = doWatch(getter, cb.bind(publicThis), options);
    if (cur) {
      setCurrentInstance(cur);
    } else {
      unsetCurrentInstance();
    }
    return res;
  }
  function createPathGetter(ctx, path) {
    const segments = path.split(".");
    return () => {
      let cur = ctx;
      for (let i2 = 0; i2 < segments.length && cur; i2++) {
        cur = cur[segments[i2]];
      }
      return cur;
    };
  }
  function traverse(value, seen) {
    if (!isObject(value) || value[
      "__v_skip"
      /* ReactiveFlags.SKIP */
    ]) {
      return value;
    }
    seen = seen || /* @__PURE__ */ new Set();
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    if (isRef(value)) {
      traverse(value.value, seen);
    } else if (isArray(value)) {
      for (let i2 = 0; i2 < value.length; i2++) {
        traverse(value[i2], seen);
      }
    } else if (isSet(value) || isMap(value)) {
      value.forEach((v2) => {
        traverse(v2, seen);
      });
    } else if (isPlainObject(value)) {
      for (const key in value) {
        traverse(value[key], seen);
      }
    }
    return value;
  }
  function useTransitionState() {
    const state = {
      isMounted: false,
      isLeaving: false,
      isUnmounting: false,
      leavingVNodes: /* @__PURE__ */ new Map()
    };
    onMounted(() => {
      state.isMounted = true;
    });
    onBeforeUnmount(() => {
      state.isUnmounting = true;
    });
    return state;
  }
  const TransitionHookValidator = [Function, Array];
  const BaseTransitionImpl = {
    name: `BaseTransition`,
    props: {
      mode: String,
      appear: Boolean,
      persisted: Boolean,
      // enter
      onBeforeEnter: TransitionHookValidator,
      onEnter: TransitionHookValidator,
      onAfterEnter: TransitionHookValidator,
      onEnterCancelled: TransitionHookValidator,
      // leave
      onBeforeLeave: TransitionHookValidator,
      onLeave: TransitionHookValidator,
      onAfterLeave: TransitionHookValidator,
      onLeaveCancelled: TransitionHookValidator,
      // appear
      onBeforeAppear: TransitionHookValidator,
      onAppear: TransitionHookValidator,
      onAfterAppear: TransitionHookValidator,
      onAppearCancelled: TransitionHookValidator
    },
    setup(props, { slots }) {
      const instance = getCurrentInstance();
      const state = useTransitionState();
      let prevTransitionKey;
      return () => {
        const children = slots.default && getTransitionRawChildren(slots.default(), true);
        if (!children || !children.length) {
          return;
        }
        let child = children[0];
        if (children.length > 1) {
          let hasFound = false;
          for (const c2 of children) {
            if (c2.type !== Comment$1) {
              if ({}.NODE_ENV !== "production" && hasFound) {
                warn("<transition> can only be used on a single element or component. Use <transition-group> for lists.");
                break;
              }
              child = c2;
              hasFound = true;
              if (!({}.NODE_ENV !== "production"))
                break;
            }
          }
        }
        const rawProps = toRaw(props);
        const { mode } = rawProps;
        if ({}.NODE_ENV !== "production" && mode && mode !== "in-out" && mode !== "out-in" && mode !== "default") {
          warn(`invalid <transition> mode: ${mode}`);
        }
        if (state.isLeaving) {
          return emptyPlaceholder(child);
        }
        const innerChild = getKeepAliveChild(child);
        if (!innerChild) {
          return emptyPlaceholder(child);
        }
        const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
        setTransitionHooks(innerChild, enterHooks);
        const oldChild = instance.subTree;
        const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
        let transitionKeyChanged = false;
        const { getTransitionKey } = innerChild.type;
        if (getTransitionKey) {
          const key = getTransitionKey();
          if (prevTransitionKey === void 0) {
            prevTransitionKey = key;
          } else if (key !== prevTransitionKey) {
            prevTransitionKey = key;
            transitionKeyChanged = true;
          }
        }
        if (oldInnerChild && oldInnerChild.type !== Comment$1 && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
          const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
          setTransitionHooks(oldInnerChild, leavingHooks);
          if (mode === "out-in") {
            state.isLeaving = true;
            leavingHooks.afterLeave = () => {
              state.isLeaving = false;
              if (instance.update.active !== false) {
                instance.update();
              }
            };
            return emptyPlaceholder(child);
          } else if (mode === "in-out" && innerChild.type !== Comment$1) {
            leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
              const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
              leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
              el._leaveCb = () => {
                earlyRemove();
                el._leaveCb = void 0;
                delete enterHooks.delayedLeave;
              };
              enterHooks.delayedLeave = delayedLeave;
            };
          }
        }
        return child;
      };
    }
  };
  const BaseTransition = BaseTransitionImpl;
  function getLeavingNodesForType(state, vnode) {
    const { leavingVNodes } = state;
    let leavingVNodesCache = leavingVNodes.get(vnode.type);
    if (!leavingVNodesCache) {
      leavingVNodesCache = /* @__PURE__ */ Object.create(null);
      leavingVNodes.set(vnode.type, leavingVNodesCache);
    }
    return leavingVNodesCache;
  }
  function resolveTransitionHooks(vnode, props, state, instance) {
    const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
    const key = String(vnode.key);
    const leavingVNodesCache = getLeavingNodesForType(state, vnode);
    const callHook2 = (hook, args) => {
      hook && callWithAsyncErrorHandling(hook, instance, 9, args);
    };
    const callAsyncHook = (hook, args) => {
      const done = args[1];
      callHook2(hook, args);
      if (isArray(hook)) {
        if (hook.every((hook2) => hook2.length <= 1))
          done();
      } else if (hook.length <= 1) {
        done();
      }
    };
    const hooks = {
      mode,
      persisted,
      beforeEnter(el) {
        let hook = onBeforeEnter;
        if (!state.isMounted) {
          if (appear) {
            hook = onBeforeAppear || onBeforeEnter;
          } else {
            return;
          }
        }
        if (el._leaveCb) {
          el._leaveCb(
            true
            /* cancelled */
          );
        }
        const leavingVNode = leavingVNodesCache[key];
        if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
          leavingVNode.el._leaveCb();
        }
        callHook2(hook, [el]);
      },
      enter(el) {
        let hook = onEnter;
        let afterHook = onAfterEnter;
        let cancelHook = onEnterCancelled;
        if (!state.isMounted) {
          if (appear) {
            hook = onAppear || onEnter;
            afterHook = onAfterAppear || onAfterEnter;
            cancelHook = onAppearCancelled || onEnterCancelled;
          } else {
            return;
          }
        }
        let called = false;
        const done = el._enterCb = (cancelled) => {
          if (called)
            return;
          called = true;
          if (cancelled) {
            callHook2(cancelHook, [el]);
          } else {
            callHook2(afterHook, [el]);
          }
          if (hooks.delayedLeave) {
            hooks.delayedLeave();
          }
          el._enterCb = void 0;
        };
        if (hook) {
          callAsyncHook(hook, [el, done]);
        } else {
          done();
        }
      },
      leave(el, remove2) {
        const key2 = String(vnode.key);
        if (el._enterCb) {
          el._enterCb(
            true
            /* cancelled */
          );
        }
        if (state.isUnmounting) {
          return remove2();
        }
        callHook2(onBeforeLeave, [el]);
        let called = false;
        const done = el._leaveCb = (cancelled) => {
          if (called)
            return;
          called = true;
          remove2();
          if (cancelled) {
            callHook2(onLeaveCancelled, [el]);
          } else {
            callHook2(onAfterLeave, [el]);
          }
          el._leaveCb = void 0;
          if (leavingVNodesCache[key2] === vnode) {
            delete leavingVNodesCache[key2];
          }
        };
        leavingVNodesCache[key2] = vnode;
        if (onLeave) {
          callAsyncHook(onLeave, [el, done]);
        } else {
          done();
        }
      },
      clone(vnode2) {
        return resolveTransitionHooks(vnode2, props, state, instance);
      }
    };
    return hooks;
  }
  function emptyPlaceholder(vnode) {
    if (isKeepAlive(vnode)) {
      vnode = cloneVNode(vnode);
      vnode.children = null;
      return vnode;
    }
  }
  function getKeepAliveChild(vnode) {
    return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
  }
  function setTransitionHooks(vnode, hooks) {
    if (vnode.shapeFlag & 6 && vnode.component) {
      setTransitionHooks(vnode.component.subTree, hooks);
    } else if (vnode.shapeFlag & 128) {
      vnode.ssContent.transition = hooks.clone(vnode.ssContent);
      vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
    } else {
      vnode.transition = hooks;
    }
  }
  function getTransitionRawChildren(children, keepComment = false, parentKey) {
    let ret = [];
    let keyedFragmentCount = 0;
    for (let i2 = 0; i2 < children.length; i2++) {
      let child = children[i2];
      const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i2);
      if (child.type === Fragment) {
        if (child.patchFlag & 128)
          keyedFragmentCount++;
        ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
      } else if (keepComment || child.type !== Comment$1) {
        ret.push(key != null ? cloneVNode(child, { key }) : child);
      }
    }
    if (keyedFragmentCount > 1) {
      for (let i2 = 0; i2 < ret.length; i2++) {
        ret[i2].patchFlag = -2;
      }
    }
    return ret;
  }
  function defineComponent(options) {
    return isFunction(options) ? { setup: options, name: options.name } : options;
  }
  const isAsyncWrapper = (i2) => !!i2.type.__asyncLoader;
  const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
  function onActivated(hook, target) {
    registerKeepAliveHook(hook, "a", target);
  }
  function onDeactivated(hook, target) {
    registerKeepAliveHook(hook, "da", target);
  }
  function registerKeepAliveHook(hook, type, target = currentInstance) {
    const wrappedHook = hook.__wdc || (hook.__wdc = () => {
      let current = target;
      while (current) {
        if (current.isDeactivated) {
          return;
        }
        current = current.parent;
      }
      return hook();
    });
    injectHook(type, wrappedHook, target);
    if (target) {
      let current = target.parent;
      while (current && current.parent) {
        if (isKeepAlive(current.parent.vnode)) {
          injectToKeepAliveRoot(wrappedHook, type, target, current);
        }
        current = current.parent;
      }
    }
  }
  function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
    const injected = injectHook(
      type,
      hook,
      keepAliveRoot,
      true
      /* prepend */
    );
    onUnmounted(() => {
      remove(keepAliveRoot[type], injected);
    }, target);
  }
  function injectHook(type, hook, target = currentInstance, prepend = false) {
    if (target) {
      const hooks = target[type] || (target[type] = []);
      const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
        if (target.isUnmounted) {
          return;
        }
        pauseTracking();
        setCurrentInstance(target);
        const res = callWithAsyncErrorHandling(hook, target, type, args);
        unsetCurrentInstance();
        resetTracking();
        return res;
      });
      if (prepend) {
        hooks.unshift(wrappedHook);
      } else {
        hooks.push(wrappedHook);
      }
      return wrappedHook;
    } else if ({}.NODE_ENV !== "production") {
      const apiName = toHandlerKey(ErrorTypeStrings[type].replace(/ hook$/, ""));
      warn(`${apiName} is called when there is no active component instance to be associated with. Lifecycle injection APIs can only be used during execution of setup(). If you are using async setup(), make sure to register lifecycle hooks before the first await statement.`);
    }
  }
  const createHook = (lifecycle) => (hook, target = currentInstance) => (
    // post-create lifecycle registrations are noops during SSR (except for serverPrefetch)
    (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, (...args) => hook(...args), target)
  );
  const onBeforeMount = createHook(
    "bm"
    /* LifecycleHooks.BEFORE_MOUNT */
  );
  const onMounted = createHook(
    "m"
    /* LifecycleHooks.MOUNTED */
  );
  const onBeforeUpdate = createHook(
    "bu"
    /* LifecycleHooks.BEFORE_UPDATE */
  );
  const onUpdated = createHook(
    "u"
    /* LifecycleHooks.UPDATED */
  );
  const onBeforeUnmount = createHook(
    "bum"
    /* LifecycleHooks.BEFORE_UNMOUNT */
  );
  const onUnmounted = createHook(
    "um"
    /* LifecycleHooks.UNMOUNTED */
  );
  const onServerPrefetch = createHook(
    "sp"
    /* LifecycleHooks.SERVER_PREFETCH */
  );
  const onRenderTriggered = createHook(
    "rtg"
    /* LifecycleHooks.RENDER_TRIGGERED */
  );
  const onRenderTracked = createHook(
    "rtc"
    /* LifecycleHooks.RENDER_TRACKED */
  );
  function onErrorCaptured(hook, target = currentInstance) {
    injectHook("ec", hook, target);
  }
  function validateDirectiveName(name) {
    if (isBuiltInDirective(name)) {
      warn("Do not use built-in directive ids as custom directive id: " + name);
    }
  }
  function invokeDirectiveHook(vnode, prevVNode, instance, name) {
    const bindings = vnode.dirs;
    const oldBindings = prevVNode && prevVNode.dirs;
    for (let i2 = 0; i2 < bindings.length; i2++) {
      const binding = bindings[i2];
      if (oldBindings) {
        binding.oldValue = oldBindings[i2].value;
      }
      let hook = binding.dir[name];
      if (hook) {
        pauseTracking();
        callWithAsyncErrorHandling(hook, instance, 8, [
          vnode.el,
          binding,
          vnode,
          prevVNode
        ]);
        resetTracking();
      }
    }
  }
  const NULL_DYNAMIC_COMPONENT = Symbol();
  function renderList(source, renderItem, cache, index) {
    let ret;
    const cached = cache && cache[index];
    if (isArray(source) || isString(source)) {
      ret = new Array(source.length);
      for (let i2 = 0, l2 = source.length; i2 < l2; i2++) {
        ret[i2] = renderItem(source[i2], i2, void 0, cached && cached[i2]);
      }
    } else if (typeof source === "number") {
      if ({}.NODE_ENV !== "production" && !Number.isInteger(source)) {
        warn(`The v-for range expect an integer value but got ${source}.`);
      }
      ret = new Array(source);
      for (let i2 = 0; i2 < source; i2++) {
        ret[i2] = renderItem(i2 + 1, i2, void 0, cached && cached[i2]);
      }
    } else if (isObject(source)) {
      if (source[Symbol.iterator]) {
        ret = Array.from(source, (item, i2) => renderItem(item, i2, void 0, cached && cached[i2]));
      } else {
        const keys = Object.keys(source);
        ret = new Array(keys.length);
        for (let i2 = 0, l2 = keys.length; i2 < l2; i2++) {
          const key = keys[i2];
          ret[i2] = renderItem(source[key], key, i2, cached && cached[i2]);
        }
      }
    } else {
      ret = [];
    }
    if (cache) {
      cache[index] = ret;
    }
    return ret;
  }
  function renderSlot(slots, name, props = {}, fallback, noSlotted) {
    if (currentRenderingInstance.isCE || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.isCE) {
      if (name !== "default")
        props.name = name;
      return createVNode("slot", props, fallback && fallback());
    }
    let slot = slots[name];
    if ({}.NODE_ENV !== "production" && slot && slot.length > 1) {
      warn(`SSR-optimized slot function detected in a non-SSR-optimized render function. You need to mark this component with $dynamic-slots in the parent template.`);
      slot = () => [];
    }
    if (slot && slot._c) {
      slot._d = false;
    }
    openBlock();
    const validSlotContent = slot && ensureValidVNode(slot(props));
    const rendered = createBlock(
      Fragment,
      {
        key: props.key || // slot content array of a dynamic conditional slot may have a branch
        // key attached in the `createSlots` helper, respect that
        validSlotContent && validSlotContent.key || `_${name}`
      },
      validSlotContent || (fallback ? fallback() : []),
      validSlotContent && slots._ === 1 ? 64 : -2
      /* PatchFlags.BAIL */
    );
    if (!noSlotted && rendered.scopeId) {
      rendered.slotScopeIds = [rendered.scopeId + "-s"];
    }
    if (slot && slot._c) {
      slot._d = true;
    }
    return rendered;
  }
  function ensureValidVNode(vnodes) {
    return vnodes.some((child) => {
      if (!isVNode(child))
        return true;
      if (child.type === Comment$1)
        return false;
      if (child.type === Fragment && !ensureValidVNode(child.children))
        return false;
      return true;
    }) ? vnodes : null;
  }
  const getPublicInstance = (i2) => {
    if (!i2)
      return null;
    if (isStatefulComponent(i2))
      return getExposeProxy(i2) || i2.proxy;
    return getPublicInstance(i2.parent);
  };
  const publicPropertiesMap = (
    // Move PURE marker to new line to workaround compiler discarding it
    // due to type annotation
    /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
      $: (i2) => i2,
      $el: (i2) => i2.vnode.el,
      $data: (i2) => i2.data,
      $props: (i2) => ({}).NODE_ENV !== "production" ? shallowReadonly(i2.props) : i2.props,
      $attrs: (i2) => ({}).NODE_ENV !== "production" ? shallowReadonly(i2.attrs) : i2.attrs,
      $slots: (i2) => ({}).NODE_ENV !== "production" ? shallowReadonly(i2.slots) : i2.slots,
      $refs: (i2) => ({}).NODE_ENV !== "production" ? shallowReadonly(i2.refs) : i2.refs,
      $parent: (i2) => getPublicInstance(i2.parent),
      $root: (i2) => getPublicInstance(i2.root),
      $emit: (i2) => i2.emit,
      $options: (i2) => resolveMergedOptions(i2),
      $forceUpdate: (i2) => i2.f || (i2.f = () => queueJob(i2.update)),
      $nextTick: (i2) => i2.n || (i2.n = nextTick.bind(i2.proxy)),
      $watch: (i2) => instanceWatch.bind(i2)
    })
  );
  const isReservedPrefix = (key) => key === "_" || key === "$";
  const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
  const PublicInstanceProxyHandlers = {
    get({ _: instance }, key) {
      const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
      if ({}.NODE_ENV !== "production" && key === "__isVue") {
        return true;
      }
      let normalizedProps;
      if (key[0] !== "$") {
        const n2 = accessCache[key];
        if (n2 !== void 0) {
          switch (n2) {
            case 1:
              return setupState[key];
            case 2:
              return data[key];
            case 4:
              return ctx[key];
            case 3:
              return props[key];
          }
        } else if (hasSetupBinding(setupState, key)) {
          accessCache[key] = 1;
          return setupState[key];
        } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
          accessCache[key] = 2;
          return data[key];
        } else if (
          // only cache other properties when instance has declared (thus stable)
          // props
          (normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)
        ) {
          accessCache[key] = 3;
          return props[key];
        } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
          accessCache[key] = 4;
          return ctx[key];
        } else if (shouldCacheAccess) {
          accessCache[key] = 0;
        }
      }
      const publicGetter = publicPropertiesMap[key];
      let cssModule, globalProperties;
      if (publicGetter) {
        if (key === "$attrs") {
          track(instance, "get", key);
          ({}).NODE_ENV !== "production" && markAttrsAccessed();
        }
        return publicGetter(instance);
      } else if (
        // css module (injected by vue-loader)
        (cssModule = type.__cssModules) && (cssModule = cssModule[key])
      ) {
        return cssModule;
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (
        // global properties
        globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
      ) {
        {
          return globalProperties[key];
        }
      } else if ({}.NODE_ENV !== "production" && currentRenderingInstance && (!isString(key) || // #1091 avoid internal isRef/isVNode checks on component instance leading
      // to infinite warning loop
      key.indexOf("__v") !== 0)) {
        if (data !== EMPTY_OBJ && isReservedPrefix(key[0]) && hasOwn(data, key)) {
          warn(`Property ${JSON.stringify(key)} must be accessed via $data because it starts with a reserved character ("$" or "_") and is not proxied on the render context.`);
        } else if (instance === currentRenderingInstance) {
          warn(`Property ${JSON.stringify(key)} was accessed during render but is not defined on instance.`);
        }
      }
    },
    set({ _: instance }, key, value) {
      const { data, setupState, ctx } = instance;
      if (hasSetupBinding(setupState, key)) {
        setupState[key] = value;
        return true;
      } else if ({}.NODE_ENV !== "production" && setupState.__isScriptSetup && hasOwn(setupState, key)) {
        warn(`Cannot mutate <script setup> binding "${key}" from Options API.`);
        return false;
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        data[key] = value;
        return true;
      } else if (hasOwn(instance.props, key)) {
        ({}).NODE_ENV !== "production" && warn(`Attempting to mutate prop "${key}". Props are readonly.`);
        return false;
      }
      if (key[0] === "$" && key.slice(1) in instance) {
        ({}).NODE_ENV !== "production" && warn(`Attempting to mutate public property "${key}". Properties starting with $ are reserved and readonly.`);
        return false;
      } else {
        if ({}.NODE_ENV !== "production" && key in instance.appContext.config.globalProperties) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            value
          });
        } else {
          ctx[key] = value;
        }
      }
      return true;
    },
    has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
      let normalizedProps;
      return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || hasSetupBinding(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
    },
    defineProperty(target, key, descriptor) {
      if (descriptor.get != null) {
        target._.accessCache[key] = 0;
      } else if (hasOwn(descriptor, "value")) {
        this.set(target, key, descriptor.value, null);
      }
      return Reflect.defineProperty(target, key, descriptor);
    }
  };
  if ({}.NODE_ENV !== "production" && true) {
    PublicInstanceProxyHandlers.ownKeys = (target) => {
      warn(`Avoid app logic that relies on enumerating keys on a component instance. The keys will be empty in production mode to avoid performance overhead.`);
      return Reflect.ownKeys(target);
    };
  }
  function createDevRenderContext(instance) {
    const target = {};
    Object.defineProperty(target, `_`, {
      configurable: true,
      enumerable: false,
      get: () => instance
    });
    Object.keys(publicPropertiesMap).forEach((key) => {
      Object.defineProperty(target, key, {
        configurable: true,
        enumerable: false,
        get: () => publicPropertiesMap[key](instance),
        // intercepted by the proxy so no need for implementation,
        // but needed to prevent set errors
        set: NOOP
      });
    });
    return target;
  }
  function exposePropsOnRenderContext(instance) {
    const { ctx, propsOptions: [propsOptions] } = instance;
    if (propsOptions) {
      Object.keys(propsOptions).forEach((key) => {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => instance.props[key],
          set: NOOP
        });
      });
    }
  }
  function exposeSetupStateOnRenderContext(instance) {
    const { ctx, setupState } = instance;
    Object.keys(toRaw(setupState)).forEach((key) => {
      if (!setupState.__isScriptSetup) {
        if (isReservedPrefix(key[0])) {
          warn(`setup() return property ${JSON.stringify(key)} should not start with "$" or "_" which are reserved prefixes for Vue internals.`);
          return;
        }
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => setupState[key],
          set: NOOP
        });
      }
    });
  }
  function createDuplicateChecker() {
    const cache = /* @__PURE__ */ Object.create(null);
    return (type, key) => {
      if (cache[key]) {
        warn(`${type} property "${key}" is already defined in ${cache[key]}.`);
      } else {
        cache[key] = type;
      }
    };
  }
  let shouldCacheAccess = true;
  function applyOptions(instance) {
    const options = resolveMergedOptions(instance);
    const publicThis = instance.proxy;
    const ctx = instance.ctx;
    shouldCacheAccess = false;
    if (options.beforeCreate) {
      callHook(
        options.beforeCreate,
        instance,
        "bc"
        /* LifecycleHooks.BEFORE_CREATE */
      );
    }
    const {
      // state
      data: dataOptions,
      computed: computedOptions,
      methods,
      watch: watchOptions,
      provide: provideOptions,
      inject: injectOptions,
      // lifecycle
      created,
      beforeMount,
      mounted,
      beforeUpdate,
      updated,
      activated,
      deactivated,
      beforeDestroy,
      beforeUnmount,
      destroyed,
      unmounted,
      render,
      renderTracked,
      renderTriggered,
      errorCaptured,
      serverPrefetch,
      // public API
      expose,
      inheritAttrs,
      // assets
      components,
      directives,
      filters
    } = options;
    const checkDuplicateProperties = {}.NODE_ENV !== "production" ? createDuplicateChecker() : null;
    if ({}.NODE_ENV !== "production") {
      const [propsOptions] = instance.propsOptions;
      if (propsOptions) {
        for (const key in propsOptions) {
          checkDuplicateProperties("Props", key);
        }
      }
    }
    if (injectOptions) {
      resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
    }
    if (methods) {
      for (const key in methods) {
        const methodHandler = methods[key];
        if (isFunction(methodHandler)) {
          if ({}.NODE_ENV !== "production") {
            Object.defineProperty(ctx, key, {
              value: methodHandler.bind(publicThis),
              configurable: true,
              enumerable: true,
              writable: true
            });
          } else {
            ctx[key] = methodHandler.bind(publicThis);
          }
          if ({}.NODE_ENV !== "production") {
            checkDuplicateProperties("Methods", key);
          }
        } else if ({}.NODE_ENV !== "production") {
          warn(`Method "${key}" has type "${typeof methodHandler}" in the component definition. Did you reference the function correctly?`);
        }
      }
    }
    if (dataOptions) {
      if ({}.NODE_ENV !== "production" && !isFunction(dataOptions)) {
        warn(`The data option must be a function. Plain object usage is no longer supported.`);
      }
      const data = dataOptions.call(publicThis, publicThis);
      if ({}.NODE_ENV !== "production" && isPromise(data)) {
        warn(`data() returned a Promise - note data() cannot be async; If you intend to perform data fetching before component renders, use async setup() + <Suspense>.`);
      }
      if (!isObject(data)) {
        ({}).NODE_ENV !== "production" && warn(`data() should return an object.`);
      } else {
        instance.data = reactive(data);
        if ({}.NODE_ENV !== "production") {
          for (const key in data) {
            checkDuplicateProperties("Data", key);
            if (!isReservedPrefix(key[0])) {
              Object.defineProperty(ctx, key, {
                configurable: true,
                enumerable: true,
                get: () => data[key],
                set: NOOP
              });
            }
          }
        }
      }
    }
    shouldCacheAccess = true;
    if (computedOptions) {
      for (const key in computedOptions) {
        const opt = computedOptions[key];
        const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
        if ({}.NODE_ENV !== "production" && get2 === NOOP) {
          warn(`Computed property "${key}" has no getter.`);
        }
        const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : {}.NODE_ENV !== "production" ? () => {
          warn(`Write operation failed: computed property "${key}" is readonly.`);
        } : NOOP;
        const c2 = computed({
          get: get2,
          set: set2
        });
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => c2.value,
          set: (v2) => c2.value = v2
        });
        if ({}.NODE_ENV !== "production") {
          checkDuplicateProperties("Computed", key);
        }
      }
    }
    if (watchOptions) {
      for (const key in watchOptions) {
        createWatcher(watchOptions[key], ctx, publicThis, key);
      }
    }
    if (provideOptions) {
      const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
      Reflect.ownKeys(provides).forEach((key) => {
        provide(key, provides[key]);
      });
    }
    if (created) {
      callHook(
        created,
        instance,
        "c"
        /* LifecycleHooks.CREATED */
      );
    }
    function registerLifecycleHook(register, hook) {
      if (isArray(hook)) {
        hook.forEach((_hook) => register(_hook.bind(publicThis)));
      } else if (hook) {
        register(hook.bind(publicThis));
      }
    }
    registerLifecycleHook(onBeforeMount, beforeMount);
    registerLifecycleHook(onMounted, mounted);
    registerLifecycleHook(onBeforeUpdate, beforeUpdate);
    registerLifecycleHook(onUpdated, updated);
    registerLifecycleHook(onActivated, activated);
    registerLifecycleHook(onDeactivated, deactivated);
    registerLifecycleHook(onErrorCaptured, errorCaptured);
    registerLifecycleHook(onRenderTracked, renderTracked);
    registerLifecycleHook(onRenderTriggered, renderTriggered);
    registerLifecycleHook(onBeforeUnmount, beforeUnmount);
    registerLifecycleHook(onUnmounted, unmounted);
    registerLifecycleHook(onServerPrefetch, serverPrefetch);
    if (isArray(expose)) {
      if (expose.length) {
        const exposed = instance.exposed || (instance.exposed = {});
        expose.forEach((key) => {
          Object.defineProperty(exposed, key, {
            get: () => publicThis[key],
            set: (val) => publicThis[key] = val
          });
        });
      } else if (!instance.exposed) {
        instance.exposed = {};
      }
    }
    if (render && instance.render === NOOP) {
      instance.render = render;
    }
    if (inheritAttrs != null) {
      instance.inheritAttrs = inheritAttrs;
    }
    if (components)
      instance.components = components;
    if (directives)
      instance.directives = directives;
  }
  function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
    if (isArray(injectOptions)) {
      injectOptions = normalizeInject(injectOptions);
    }
    for (const key in injectOptions) {
      const opt = injectOptions[key];
      let injected;
      if (isObject(opt)) {
        if ("default" in opt) {
          injected = inject(
            opt.from || key,
            opt.default,
            true
            /* treat default function as factory */
          );
        } else {
          injected = inject(opt.from || key);
        }
      } else {
        injected = inject(opt);
      }
      if (isRef(injected)) {
        if (unwrapRef) {
          Object.defineProperty(ctx, key, {
            enumerable: true,
            configurable: true,
            get: () => injected.value,
            set: (v2) => injected.value = v2
          });
        } else {
          if ({}.NODE_ENV !== "production") {
            warn(`injected property "${key}" is a ref and will be auto-unwrapped and no longer needs \`.value\` in the next minor release. To opt-in to the new behavior now, set \`app.config.unwrapInjectedRef = true\` (this config is temporary and will not be needed in the future.)`);
          }
          ctx[key] = injected;
        }
      } else {
        ctx[key] = injected;
      }
      if ({}.NODE_ENV !== "production") {
        checkDuplicateProperties("Inject", key);
      }
    }
  }
  function callHook(hook, instance, type) {
    callWithAsyncErrorHandling(isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
  }
  function createWatcher(raw, ctx, publicThis, key) {
    const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
    if (isString(raw)) {
      const handler = ctx[raw];
      if (isFunction(handler)) {
        watch(getter, handler);
      } else if ({}.NODE_ENV !== "production") {
        warn(`Invalid watch handler specified by key "${raw}"`, handler);
      }
    } else if (isFunction(raw)) {
      watch(getter, raw.bind(publicThis));
    } else if (isObject(raw)) {
      if (isArray(raw)) {
        raw.forEach((r2) => createWatcher(r2, ctx, publicThis, key));
      } else {
        const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
        if (isFunction(handler)) {
          watch(getter, handler, raw);
        } else if ({}.NODE_ENV !== "production") {
          warn(`Invalid watch handler specified by key "${raw.handler}"`, handler);
        }
      }
    } else if ({}.NODE_ENV !== "production") {
      warn(`Invalid watch option: "${key}"`, raw);
    }
  }
  function resolveMergedOptions(instance) {
    const base = instance.type;
    const { mixins, extends: extendsOptions } = base;
    const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
    const cached = cache.get(base);
    let resolved;
    if (cached) {
      resolved = cached;
    } else if (!globalMixins.length && !mixins && !extendsOptions) {
      {
        resolved = base;
      }
    } else {
      resolved = {};
      if (globalMixins.length) {
        globalMixins.forEach((m2) => mergeOptions(resolved, m2, optionMergeStrategies, true));
      }
      mergeOptions(resolved, base, optionMergeStrategies);
    }
    if (isObject(base)) {
      cache.set(base, resolved);
    }
    return resolved;
  }
  function mergeOptions(to, from, strats, asMixin = false) {
    const { mixins, extends: extendsOptions } = from;
    if (extendsOptions) {
      mergeOptions(to, extendsOptions, strats, true);
    }
    if (mixins) {
      mixins.forEach((m2) => mergeOptions(to, m2, strats, true));
    }
    for (const key in from) {
      if (asMixin && key === "expose") {
        ({}).NODE_ENV !== "production" && warn(`"expose" option is ignored when declared in mixins or extends. It should only be declared in the base component itself.`);
      } else {
        const strat = internalOptionMergeStrats[key] || strats && strats[key];
        to[key] = strat ? strat(to[key], from[key]) : from[key];
      }
    }
    return to;
  }
  const internalOptionMergeStrats = {
    data: mergeDataFn,
    props: mergeObjectOptions,
    emits: mergeObjectOptions,
    // objects
    methods: mergeObjectOptions,
    computed: mergeObjectOptions,
    // lifecycle
    beforeCreate: mergeAsArray,
    created: mergeAsArray,
    beforeMount: mergeAsArray,
    mounted: mergeAsArray,
    beforeUpdate: mergeAsArray,
    updated: mergeAsArray,
    beforeDestroy: mergeAsArray,
    beforeUnmount: mergeAsArray,
    destroyed: mergeAsArray,
    unmounted: mergeAsArray,
    activated: mergeAsArray,
    deactivated: mergeAsArray,
    errorCaptured: mergeAsArray,
    serverPrefetch: mergeAsArray,
    // assets
    components: mergeObjectOptions,
    directives: mergeObjectOptions,
    // watch
    watch: mergeWatchOptions,
    // provide / inject
    provide: mergeDataFn,
    inject: mergeInject
  };
  function mergeDataFn(to, from) {
    if (!from) {
      return to;
    }
    if (!to) {
      return from;
    }
    return function mergedDataFn() {
      return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
    };
  }
  function mergeInject(to, from) {
    return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
  }
  function normalizeInject(raw) {
    if (isArray(raw)) {
      const res = {};
      for (let i2 = 0; i2 < raw.length; i2++) {
        res[raw[i2]] = raw[i2];
      }
      return res;
    }
    return raw;
  }
  function mergeAsArray(to, from) {
    return to ? [...new Set([].concat(to, from))] : from;
  }
  function mergeObjectOptions(to, from) {
    return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
  }
  function mergeWatchOptions(to, from) {
    if (!to)
      return from;
    if (!from)
      return to;
    const merged = extend(/* @__PURE__ */ Object.create(null), to);
    for (const key in from) {
      merged[key] = mergeAsArray(to[key], from[key]);
    }
    return merged;
  }
  function initProps(instance, rawProps, isStateful, isSSR = false) {
    const props = {};
    const attrs = {};
    def(attrs, InternalObjectKey, 1);
    instance.propsDefaults = /* @__PURE__ */ Object.create(null);
    setFullProps(instance, rawProps, props, attrs);
    for (const key in instance.propsOptions[0]) {
      if (!(key in props)) {
        props[key] = void 0;
      }
    }
    if ({}.NODE_ENV !== "production") {
      validateProps(rawProps || {}, props, instance);
    }
    if (isStateful) {
      instance.props = isSSR ? props : shallowReactive(props);
    } else {
      if (!instance.type.props) {
        instance.props = attrs;
      } else {
        instance.props = props;
      }
    }
    instance.attrs = attrs;
  }
  function isInHmrContext(instance) {
    while (instance) {
      if (instance.type.__hmrId)
        return true;
      instance = instance.parent;
    }
  }
  function updateProps(instance, rawProps, rawPrevProps, optimized) {
    const { props, attrs, vnode: { patchFlag } } = instance;
    const rawCurrentProps = toRaw(props);
    const [options] = instance.propsOptions;
    let hasAttrsChanged = false;
    if (
      // always force full diff in dev
      // - #1942 if hmr is enabled with sfc component
      // - vite#872 non-sfc component used by sfc component
      !({}.NODE_ENV !== "production" && isInHmrContext(instance)) && (optimized || patchFlag > 0) && !(patchFlag & 16)
    ) {
      if (patchFlag & 8) {
        const propsToUpdate = instance.vnode.dynamicProps;
        for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
          let key = propsToUpdate[i2];
          if (isEmitListener(instance.emitsOptions, key)) {
            continue;
          }
          const value = rawProps[key];
          if (options) {
            if (hasOwn(attrs, key)) {
              if (value !== attrs[key]) {
                attrs[key] = value;
                hasAttrsChanged = true;
              }
            } else {
              const camelizedKey = camelize(key);
              props[camelizedKey] = resolvePropValue(
                options,
                rawCurrentProps,
                camelizedKey,
                value,
                instance,
                false
                /* isAbsent */
              );
            }
          } else {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          }
        }
      }
    } else {
      if (setFullProps(instance, rawProps, props, attrs)) {
        hasAttrsChanged = true;
      }
      let kebabKey;
      for (const key in rawCurrentProps) {
        if (!rawProps || // for camelCase
        !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
        // and converted to camelCase (#955)
        ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
          if (options) {
            if (rawPrevProps && // for camelCase
            (rawPrevProps[key] !== void 0 || // for kebab-case
            rawPrevProps[kebabKey] !== void 0)) {
              props[key] = resolvePropValue(
                options,
                rawCurrentProps,
                key,
                void 0,
                instance,
                true
                /* isAbsent */
              );
            }
          } else {
            delete props[key];
          }
        }
      }
      if (attrs !== rawCurrentProps) {
        for (const key in attrs) {
          if (!rawProps || !hasOwn(rawProps, key) && true) {
            delete attrs[key];
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (hasAttrsChanged) {
      trigger(instance, "set", "$attrs");
    }
    if ({}.NODE_ENV !== "production") {
      validateProps(rawProps || {}, props, instance);
    }
  }
  function setFullProps(instance, rawProps, props, attrs) {
    const [options, needCastKeys] = instance.propsOptions;
    let hasAttrsChanged = false;
    let rawCastValues;
    if (rawProps) {
      for (let key in rawProps) {
        if (isReservedProp(key)) {
          continue;
        }
        const value = rawProps[key];
        let camelKey;
        if (options && hasOwn(options, camelKey = camelize(key))) {
          if (!needCastKeys || !needCastKeys.includes(camelKey)) {
            props[camelKey] = value;
          } else {
            (rawCastValues || (rawCastValues = {}))[camelKey] = value;
          }
        } else if (!isEmitListener(instance.emitsOptions, key)) {
          if (!(key in attrs) || value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
    if (needCastKeys) {
      const rawCurrentProps = toRaw(props);
      const castValues = rawCastValues || EMPTY_OBJ;
      for (let i2 = 0; i2 < needCastKeys.length; i2++) {
        const key = needCastKeys[i2];
        props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
      }
    }
    return hasAttrsChanged;
  }
  function resolvePropValue(options, props, key, value, instance, isAbsent) {
    const opt = options[key];
    if (opt != null) {
      const hasDefault = hasOwn(opt, "default");
      if (hasDefault && value === void 0) {
        const defaultValue = opt.default;
        if (opt.type !== Function && isFunction(defaultValue)) {
          const { propsDefaults } = instance;
          if (key in propsDefaults) {
            value = propsDefaults[key];
          } else {
            setCurrentInstance(instance);
            value = propsDefaults[key] = defaultValue.call(null, props);
            unsetCurrentInstance();
          }
        } else {
          value = defaultValue;
        }
      }
      if (opt[
        0
        /* BooleanFlags.shouldCast */
      ]) {
        if (isAbsent && !hasDefault) {
          value = false;
        } else if (opt[
          1
          /* BooleanFlags.shouldCastTrue */
        ] && (value === "" || value === hyphenate(key))) {
          value = true;
        }
      }
    }
    return value;
  }
  function normalizePropsOptions(comp, appContext, asMixin = false) {
    const cache = appContext.propsCache;
    const cached = cache.get(comp);
    if (cached) {
      return cached;
    }
    const raw = comp.props;
    const normalized = {};
    const needCastKeys = [];
    let hasExtends = false;
    if (!isFunction(comp)) {
      const extendProps = (raw2) => {
        hasExtends = true;
        const [props, keys] = normalizePropsOptions(raw2, appContext, true);
        extend(normalized, props);
        if (keys)
          needCastKeys.push(...keys);
      };
      if (!asMixin && appContext.mixins.length) {
        appContext.mixins.forEach(extendProps);
      }
      if (comp.extends) {
        extendProps(comp.extends);
      }
      if (comp.mixins) {
        comp.mixins.forEach(extendProps);
      }
    }
    if (!raw && !hasExtends) {
      if (isObject(comp)) {
        cache.set(comp, EMPTY_ARR);
      }
      return EMPTY_ARR;
    }
    if (isArray(raw)) {
      for (let i2 = 0; i2 < raw.length; i2++) {
        if ({}.NODE_ENV !== "production" && !isString(raw[i2])) {
          warn(`props must be strings when using array syntax.`, raw[i2]);
        }
        const normalizedKey = camelize(raw[i2]);
        if (validatePropName(normalizedKey)) {
          normalized[normalizedKey] = EMPTY_OBJ;
        }
      }
    } else if (raw) {
      if ({}.NODE_ENV !== "production" && !isObject(raw)) {
        warn(`invalid props options`, raw);
      }
      for (const key in raw) {
        const normalizedKey = camelize(key);
        if (validatePropName(normalizedKey)) {
          const opt = raw[key];
          const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : Object.assign({}, opt);
          if (prop) {
            const booleanIndex = getTypeIndex(Boolean, prop.type);
            const stringIndex = getTypeIndex(String, prop.type);
            prop[
              0
              /* BooleanFlags.shouldCast */
            ] = booleanIndex > -1;
            prop[
              1
              /* BooleanFlags.shouldCastTrue */
            ] = stringIndex < 0 || booleanIndex < stringIndex;
            if (booleanIndex > -1 || hasOwn(prop, "default")) {
              needCastKeys.push(normalizedKey);
            }
          }
        }
      }
    }
    const res = [normalized, needCastKeys];
    if (isObject(comp)) {
      cache.set(comp, res);
    }
    return res;
  }
  function validatePropName(key) {
    if (key[0] !== "$") {
      return true;
    } else if ({}.NODE_ENV !== "production") {
      warn(`Invalid prop name: "${key}" is a reserved property.`);
    }
    return false;
  }
  function getType(ctor) {
    const match = ctor && ctor.toString().match(/^\s*(function|class) (\w+)/);
    return match ? match[2] : ctor === null ? "null" : "";
  }
  function isSameType(a2, b2) {
    return getType(a2) === getType(b2);
  }
  function getTypeIndex(type, expectedTypes) {
    if (isArray(expectedTypes)) {
      return expectedTypes.findIndex((t2) => isSameType(t2, type));
    } else if (isFunction(expectedTypes)) {
      return isSameType(expectedTypes, type) ? 0 : -1;
    }
    return -1;
  }
  function validateProps(rawProps, props, instance) {
    const resolvedValues = toRaw(props);
    const options = instance.propsOptions[0];
    for (const key in options) {
      let opt = options[key];
      if (opt == null)
        continue;
      validateProp(key, resolvedValues[key], opt, !hasOwn(rawProps, key) && !hasOwn(rawProps, hyphenate(key)));
    }
  }
  function validateProp(name, value, prop, isAbsent) {
    const { type, required, validator } = prop;
    if (required && isAbsent) {
      warn('Missing required prop: "' + name + '"');
      return;
    }
    if (value == null && !prop.required) {
      return;
    }
    if (type != null && type !== true) {
      let isValid = false;
      const types = isArray(type) ? type : [type];
      const expectedTypes = [];
      for (let i2 = 0; i2 < types.length && !isValid; i2++) {
        const { valid, expectedType } = assertType(value, types[i2]);
        expectedTypes.push(expectedType || "");
        isValid = valid;
      }
      if (!isValid) {
        warn(getInvalidTypeMessage(name, value, expectedTypes));
        return;
      }
    }
    if (validator && !validator(value)) {
      warn('Invalid prop: custom validator check failed for prop "' + name + '".');
    }
  }
  const isSimpleType = /* @__PURE__ */ makeMap("String,Number,Boolean,Function,Symbol,BigInt");
  function assertType(value, type) {
    let valid;
    const expectedType = getType(type);
    if (isSimpleType(expectedType)) {
      const t2 = typeof value;
      valid = t2 === expectedType.toLowerCase();
      if (!valid && t2 === "object") {
        valid = value instanceof type;
      }
    } else if (expectedType === "Object") {
      valid = isObject(value);
    } else if (expectedType === "Array") {
      valid = isArray(value);
    } else if (expectedType === "null") {
      valid = value === null;
    } else {
      valid = value instanceof type;
    }
    return {
      valid,
      expectedType
    };
  }
  function getInvalidTypeMessage(name, value, expectedTypes) {
    let message = `Invalid prop: type check failed for prop "${name}". Expected ${expectedTypes.map(capitalize).join(" | ")}`;
    const expectedType = expectedTypes[0];
    const receivedType = toRawType(value);
    const expectedValue = styleValue(value, expectedType);
    const receivedValue = styleValue(value, receivedType);
    if (expectedTypes.length === 1 && isExplicable(expectedType) && !isBoolean(expectedType, receivedType)) {
      message += ` with value ${expectedValue}`;
    }
    message += `, got ${receivedType} `;
    if (isExplicable(receivedType)) {
      message += `with value ${receivedValue}.`;
    }
    return message;
  }
  function styleValue(value, type) {
    if (type === "String") {
      return `"${value}"`;
    } else if (type === "Number") {
      return `${Number(value)}`;
    } else {
      return `${value}`;
    }
  }
  function isExplicable(type) {
    const explicitTypes = ["string", "number", "boolean"];
    return explicitTypes.some((elem) => type.toLowerCase() === elem);
  }
  function isBoolean(...args) {
    return args.some((elem) => elem.toLowerCase() === "boolean");
  }
  const isInternalKey = (key) => key[0] === "_" || key === "$stable";
  const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
  const normalizeSlot = (key, rawSlot, ctx) => {
    if (rawSlot._n) {
      return rawSlot;
    }
    const normalized = withCtx((...args) => {
      if ({}.NODE_ENV !== "production" && currentInstance) {
        warn(`Slot "${key}" invoked outside of the render function: this will not track dependencies used in the slot. Invoke the slot function inside the render function instead.`);
      }
      return normalizeSlotValue(rawSlot(...args));
    }, ctx);
    normalized._c = false;
    return normalized;
  };
  const normalizeObjectSlots = (rawSlots, slots, instance) => {
    const ctx = rawSlots._ctx;
    for (const key in rawSlots) {
      if (isInternalKey(key))
        continue;
      const value = rawSlots[key];
      if (isFunction(value)) {
        slots[key] = normalizeSlot(key, value, ctx);
      } else if (value != null) {
        if ({}.NODE_ENV !== "production" && true) {
          warn(`Non-function value encountered for slot "${key}". Prefer function slots for better performance.`);
        }
        const normalized = normalizeSlotValue(value);
        slots[key] = () => normalized;
      }
    }
  };
  const normalizeVNodeSlots = (instance, children) => {
    if ({}.NODE_ENV !== "production" && !isKeepAlive(instance.vnode) && true) {
      warn(`Non-function value encountered for default slot. Prefer function slots for better performance.`);
    }
    const normalized = normalizeSlotValue(children);
    instance.slots.default = () => normalized;
  };
  const initSlots = (instance, children) => {
    if (instance.vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        instance.slots = toRaw(children);
        def(children, "_", type);
      } else {
        normalizeObjectSlots(children, instance.slots = {});
      }
    } else {
      instance.slots = {};
      if (children) {
        normalizeVNodeSlots(instance, children);
      }
    }
    def(instance.slots, InternalObjectKey, 1);
  };
  const updateSlots = (instance, children, optimized) => {
    const { vnode, slots } = instance;
    let needDeletionCheck = true;
    let deletionComparisonTarget = EMPTY_OBJ;
    if (vnode.shapeFlag & 32) {
      const type = children._;
      if (type) {
        if ({}.NODE_ENV !== "production" && isHmrUpdating) {
          extend(slots, children);
        } else if (optimized && type === 1) {
          needDeletionCheck = false;
        } else {
          extend(slots, children);
          if (!optimized && type === 1) {
            delete slots._;
          }
        }
      } else {
        needDeletionCheck = !children.$stable;
        normalizeObjectSlots(children, slots);
      }
      deletionComparisonTarget = children;
    } else if (children) {
      normalizeVNodeSlots(instance, children);
      deletionComparisonTarget = { default: 1 };
    }
    if (needDeletionCheck) {
      for (const key in slots) {
        if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
          delete slots[key];
        }
      }
    }
  };
  function createAppContext() {
    return {
      app: null,
      config: {
        isNativeTag: NO,
        performance: false,
        globalProperties: {},
        optionMergeStrategies: {},
        errorHandler: void 0,
        warnHandler: void 0,
        compilerOptions: {}
      },
      mixins: [],
      components: {},
      directives: {},
      provides: /* @__PURE__ */ Object.create(null),
      optionsCache: /* @__PURE__ */ new WeakMap(),
      propsCache: /* @__PURE__ */ new WeakMap(),
      emitsCache: /* @__PURE__ */ new WeakMap()
    };
  }
  let uid$1 = 0;
  function createAppAPI(render, hydrate) {
    return function createApp2(rootComponent, rootProps = null) {
      if (!isFunction(rootComponent)) {
        rootComponent = Object.assign({}, rootComponent);
      }
      if (rootProps != null && !isObject(rootProps)) {
        ({}).NODE_ENV !== "production" && warn(`root props passed to app.mount() must be an object.`);
        rootProps = null;
      }
      const context = createAppContext();
      const installedPlugins = /* @__PURE__ */ new Set();
      let isMounted = false;
      const app = context.app = {
        _uid: uid$1++,
        _component: rootComponent,
        _props: rootProps,
        _container: null,
        _context: context,
        _instance: null,
        version,
        get config() {
          return context.config;
        },
        set config(v2) {
          if ({}.NODE_ENV !== "production") {
            warn(`app.config cannot be replaced. Modify individual options instead.`);
          }
        },
        use(plugin, ...options) {
          if (installedPlugins.has(plugin)) {
            ({}).NODE_ENV !== "production" && warn(`Plugin has already been applied to target app.`);
          } else if (plugin && isFunction(plugin.install)) {
            installedPlugins.add(plugin);
            plugin.install(app, ...options);
          } else if (isFunction(plugin)) {
            installedPlugins.add(plugin);
            plugin(app, ...options);
          } else if ({}.NODE_ENV !== "production") {
            warn(`A plugin must either be a function or an object with an "install" function.`);
          }
          return app;
        },
        mixin(mixin) {
          {
            if (!context.mixins.includes(mixin)) {
              context.mixins.push(mixin);
            } else if ({}.NODE_ENV !== "production") {
              warn("Mixin has already been applied to target app" + (mixin.name ? `: ${mixin.name}` : ""));
            }
          }
          return app;
        },
        component(name, component) {
          if ({}.NODE_ENV !== "production") {
            validateComponentName(name, context.config);
          }
          if (!component) {
            return context.components[name];
          }
          if ({}.NODE_ENV !== "production" && context.components[name]) {
            warn(`Component "${name}" has already been registered in target app.`);
          }
          context.components[name] = component;
          return app;
        },
        directive(name, directive) {
          if ({}.NODE_ENV !== "production") {
            validateDirectiveName(name);
          }
          if (!directive) {
            return context.directives[name];
          }
          if ({}.NODE_ENV !== "production" && context.directives[name]) {
            warn(`Directive "${name}" has already been registered in target app.`);
          }
          context.directives[name] = directive;
          return app;
        },
        mount(rootContainer, isHydrate, isSVG) {
          if (!isMounted) {
            if ({}.NODE_ENV !== "production" && rootContainer.__vue_app__) {
              warn(`There is already an app instance mounted on the host container.
 If you want to mount another app on the same host container, you need to unmount the previous app by calling \`app.unmount()\` first.`);
            }
            const vnode = createVNode(rootComponent, rootProps);
            vnode.appContext = context;
            if ({}.NODE_ENV !== "production") {
              context.reload = () => {
                render(cloneVNode(vnode), rootContainer, isSVG);
              };
            }
            if (isHydrate && hydrate) {
              hydrate(vnode, rootContainer);
            } else {
              render(vnode, rootContainer, isSVG);
            }
            isMounted = true;
            app._container = rootContainer;
            rootContainer.__vue_app__ = app;
            if ({}.NODE_ENV !== "production" || false) {
              app._instance = vnode.component;
              devtoolsInitApp(app, version);
            }
            return getExposeProxy(vnode.component) || vnode.component.proxy;
          } else if ({}.NODE_ENV !== "production") {
            warn(`App has already been mounted.
If you want to remount the same app, move your app creation logic into a factory function and create fresh app instances for each mount - e.g. \`const createMyApp = () => createApp(App)\``);
          }
        },
        unmount() {
          if (isMounted) {
            render(null, app._container);
            if ({}.NODE_ENV !== "production" || false) {
              app._instance = null;
              devtoolsUnmountApp(app);
            }
            delete app._container.__vue_app__;
          } else if ({}.NODE_ENV !== "production") {
            warn(`Cannot unmount an app that is not mounted.`);
          }
        },
        provide(key, value) {
          if ({}.NODE_ENV !== "production" && key in context.provides) {
            warn(`App already provides property with key "${String(key)}". It will be overwritten with the new value.`);
          }
          context.provides[key] = value;
          return app;
        }
      };
      return app;
    };
  }
  function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
    if (isArray(rawRef)) {
      rawRef.forEach((r2, i2) => setRef(r2, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i2] : oldRawRef), parentSuspense, vnode, isUnmount));
      return;
    }
    if (isAsyncWrapper(vnode) && !isUnmount) {
      return;
    }
    const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
    const value = isUnmount ? null : refValue;
    const { i: owner, r: ref2 } = rawRef;
    if ({}.NODE_ENV !== "production" && !owner) {
      warn(`Missing ref owner context. ref cannot be used on hoisted vnodes. A vnode with ref must be created inside the render function.`);
      return;
    }
    const oldRef = oldRawRef && oldRawRef.r;
    const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
    const setupState = owner.setupState;
    if (oldRef != null && oldRef !== ref2) {
      if (isString(oldRef)) {
        refs[oldRef] = null;
        if (hasOwn(setupState, oldRef)) {
          setupState[oldRef] = null;
        }
      } else if (isRef(oldRef)) {
        oldRef.value = null;
      }
    }
    if (isFunction(ref2)) {
      callWithErrorHandling(ref2, owner, 12, [value, refs]);
    } else {
      const _isString = isString(ref2);
      const _isRef = isRef(ref2);
      if (_isString || _isRef) {
        const doSet = () => {
          if (rawRef.f) {
            const existing = _isString ? hasOwn(setupState, ref2) ? setupState[ref2] : refs[ref2] : ref2.value;
            if (isUnmount) {
              isArray(existing) && remove(existing, refValue);
            } else {
              if (!isArray(existing)) {
                if (_isString) {
                  refs[ref2] = [refValue];
                  if (hasOwn(setupState, ref2)) {
                    setupState[ref2] = refs[ref2];
                  }
                } else {
                  ref2.value = [refValue];
                  if (rawRef.k)
                    refs[rawRef.k] = ref2.value;
                }
              } else if (!existing.includes(refValue)) {
                existing.push(refValue);
              }
            }
          } else if (_isString) {
            refs[ref2] = value;
            if (hasOwn(setupState, ref2)) {
              setupState[ref2] = value;
            }
          } else if (_isRef) {
            ref2.value = value;
            if (rawRef.k)
              refs[rawRef.k] = value;
          } else if ({}.NODE_ENV !== "production") {
            warn("Invalid template ref type:", ref2, `(${typeof ref2})`);
          }
        };
        if (value) {
          doSet.id = -1;
          queuePostRenderEffect(doSet, parentSuspense);
        } else {
          doSet();
        }
      } else if ({}.NODE_ENV !== "production") {
        warn("Invalid template ref type:", ref2, `(${typeof ref2})`);
      }
    }
  }
  let supported;
  let perf;
  function startMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
      perf.mark(`vue-${type}-${instance.uid}`);
    }
    if ({}.NODE_ENV !== "production" || false) {
      devtoolsPerfStart(instance, type, isSupported() ? perf.now() : Date.now());
    }
  }
  function endMeasure(instance, type) {
    if (instance.appContext.config.performance && isSupported()) {
      const startTag = `vue-${type}-${instance.uid}`;
      const endTag = startTag + `:end`;
      perf.mark(endTag);
      perf.measure(`<${formatComponentName(instance, instance.type)}> ${type}`, startTag, endTag);
      perf.clearMarks(startTag);
      perf.clearMarks(endTag);
    }
    if ({}.NODE_ENV !== "production" || false) {
      devtoolsPerfEnd(instance, type, isSupported() ? perf.now() : Date.now());
    }
  }
  function isSupported() {
    if (supported !== void 0) {
      return supported;
    }
    if (typeof window !== "undefined" && window.performance) {
      supported = true;
      perf = window.performance;
    } else {
      supported = false;
    }
    return supported;
  }
  function initFeatureFlags() {
    const needWarn = [];
    if ({}.NODE_ENV !== "production" && needWarn.length) {
      const multi = needWarn.length > 1;
      console.warn(`Feature flag${multi ? `s` : ``} ${needWarn.join(", ")} ${multi ? `are` : `is`} not explicitly defined. You are running the esm-bundler build of Vue, which expects these compile-time feature flags to be globally injected via the bundler config in order to get better tree-shaking in the production bundle.

For more details, see https://link.vuejs.org/feature-flags.`);
    }
  }
  const queuePostRenderEffect = queueEffectWithSuspense;
  function createRenderer(options) {
    return baseCreateRenderer(options);
  }
  function baseCreateRenderer(options, createHydrationFns) {
    {
      initFeatureFlags();
    }
    const target = getGlobalThis();
    target.__VUE__ = true;
    if ({}.NODE_ENV !== "production" || false) {
      setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__, target);
    }
    const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, insertStaticContent: hostInsertStaticContent } = options;
    const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = {}.NODE_ENV !== "production" && isHmrUpdating ? false : !!n2.dynamicChildren) => {
      if (n1 === n2) {
        return;
      }
      if (n1 && !isSameVNodeType(n1, n2)) {
        anchor = getNextHostNode(n1);
        unmount(n1, parentComponent, parentSuspense, true);
        n1 = null;
      }
      if (n2.patchFlag === -2) {
        optimized = false;
        n2.dynamicChildren = null;
      }
      const { type, ref: ref2, shapeFlag } = n2;
      switch (type) {
        case Text:
          processText(n1, n2, container, anchor);
          break;
        case Comment$1:
          processCommentNode(n1, n2, container, anchor);
          break;
        case Static:
          if (n1 == null) {
            mountStaticNode(n2, container, anchor, isSVG);
          } else if ({}.NODE_ENV !== "production") {
            patchStaticNode(n1, n2, container, isSVG);
          }
          break;
        case Fragment:
          processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          break;
        default:
          if (shapeFlag & 1) {
            processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else if (shapeFlag & 6) {
            processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else if (shapeFlag & 64) {
            type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
          } else if (shapeFlag & 128) {
            type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
          } else if ({}.NODE_ENV !== "production") {
            warn("Invalid VNode type:", type, `(${typeof type})`);
          }
      }
      if (ref2 != null && parentComponent) {
        setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
      }
    };
    const processText = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
      } else {
        const el = n2.el = n1.el;
        if (n2.children !== n1.children) {
          hostSetText(el, n2.children);
        }
      }
    };
    const processCommentNode = (n1, n2, container, anchor) => {
      if (n1 == null) {
        hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
      } else {
        n2.el = n1.el;
      }
    };
    const mountStaticNode = (n2, container, anchor, isSVG) => {
      [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
    };
    const patchStaticNode = (n1, n2, container, isSVG) => {
      if (n2.children !== n1.children) {
        const anchor = hostNextSibling(n1.anchor);
        removeStaticNode(n1);
        [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG);
      } else {
        n2.el = n1.el;
        n2.anchor = n1.anchor;
      }
    };
    const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostInsert(el, container, nextSibling);
        el = next;
      }
      hostInsert(anchor, container, nextSibling);
    };
    const removeStaticNode = ({ el, anchor }) => {
      let next;
      while (el && el !== anchor) {
        next = hostNextSibling(el);
        hostRemove(el);
        el = next;
      }
      hostRemove(anchor);
    };
    const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      isSVG = isSVG || n2.type === "svg";
      if (n1 == null) {
        mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    };
    const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      let el;
      let vnodeHook;
      const { type, props, shapeFlag, transition, dirs } = vnode;
      el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      if ({}.NODE_ENV !== "production" || false) {
        Object.defineProperty(el, "__vnode", {
          value: vnode,
          enumerable: false
        });
        Object.defineProperty(el, "__vueParentComponent", {
          value: parentComponent,
          enumerable: false
        });
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
      if (needCallTransitionHooks) {
        transition.beforeEnter(el);
      }
      hostInsert(el, container, anchor);
      if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
    };
    const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
      if (scopeId) {
        hostSetScopeId(el, scopeId);
      }
      if (slotScopeIds) {
        for (let i2 = 0; i2 < slotScopeIds.length; i2++) {
          hostSetScopeId(el, slotScopeIds[i2]);
        }
      }
      if (parentComponent) {
        let subTree = parentComponent.subTree;
        if ({}.NODE_ENV !== "production" && subTree.patchFlag > 0 && subTree.patchFlag & 2048) {
          subTree = filterSingleRoot(subTree.children) || subTree;
        }
        if (vnode === subTree) {
          const parentVNode = parentComponent.vnode;
          setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
        }
      }
    };
    const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
      for (let i2 = start; i2 < children.length; i2++) {
        const child = children[i2] = optimized ? cloneIfMounted(children[i2]) : normalizeVNode(children[i2]);
        patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    };
    const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      const el = n2.el = n1.el;
      let { patchFlag, dynamicChildren, dirs } = n2;
      patchFlag |= n1.patchFlag & 16;
      const oldProps = n1.props || EMPTY_OBJ;
      const newProps = n2.props || EMPTY_OBJ;
      let vnodeHook;
      parentComponent && toggleRecurse(parentComponent, false);
      if (vnodeHook = newProps.onVnodeBeforeUpdate) {
        invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
      }
      if (dirs) {
        invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
      }
      parentComponent && toggleRecurse(parentComponent, true);
      if ({}.NODE_ENV !== "production" && isHmrUpdating) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      const areChildrenSVG = isSVG && n2.type !== "foreignObject";
      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
        if ({}.NODE_ENV !== "production" && parentComponent && parentComponent.type.__hmrId) {
          traverseStaticChildren(n1, n2);
        }
      } else if (!optimized) {
        patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
      }
      if (patchFlag > 0) {
        if (patchFlag & 16) {
          patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
        } else {
          if (patchFlag & 2) {
            if (oldProps.class !== newProps.class) {
              hostPatchProp(el, "class", null, newProps.class, isSVG);
            }
          }
          if (patchFlag & 4) {
            hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
          }
          if (patchFlag & 8) {
            const propsToUpdate = n2.dynamicProps;
            for (let i2 = 0; i2 < propsToUpdate.length; i2++) {
              const key = propsToUpdate[i2];
              const prev = oldProps[key];
              const next = newProps[key];
              if (next !== prev || key === "value") {
                hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
              }
            }
          }
        }
        if (patchFlag & 1) {
          if (n1.children !== n2.children) {
            hostSetElementText(el, n2.children);
          }
        }
      } else if (!optimized && dynamicChildren == null) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      }
      if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
          dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
        }, parentSuspense);
      }
    };
    const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
      for (let i2 = 0; i2 < newChildren.length; i2++) {
        const oldVNode = oldChildren[i2];
        const newVNode = newChildren[i2];
        const container = (
          // oldVNode may be an errored async setup() component inside Suspense
          // which will not have a mounted element
          oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
          // of the Fragment itself so it can move its children.
          (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
          // which also requires the correct parent container
          !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
          oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : (
            // In other cases, the parent container is not actually used so we
            // just pass the block element here to avoid a DOM parentNode call.
            fallbackContainer
          )
        );
        patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
      }
    };
    const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
      if (oldProps !== newProps) {
        if (oldProps !== EMPTY_OBJ) {
          for (const key in oldProps) {
            if (!isReservedProp(key) && !(key in newProps)) {
              hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
        for (const key in newProps) {
          if (isReservedProp(key))
            continue;
          const next = newProps[key];
          const prev = oldProps[key];
          if (next !== prev && key !== "value") {
            hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in newProps) {
          hostPatchProp(el, "value", oldProps.value, newProps.value);
        }
      }
    };
    const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
      const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
      let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
      if ({}.NODE_ENV !== "production" && // #5523 dev root fragment may inherit directives
      (isHmrUpdating || patchFlag & 2048)) {
        patchFlag = 0;
        optimized = false;
        dynamicChildren = null;
      }
      if (fragmentSlotScopeIds) {
        slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
      }
      if (n1 == null) {
        hostInsert(fragmentStartAnchor, container, anchor);
        hostInsert(fragmentEndAnchor, container, anchor);
        mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
        // of renderSlot() with no valid children
        n1.dynamicChildren) {
          patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
          if ({}.NODE_ENV !== "production" && parentComponent && parentComponent.type.__hmrId) {
            traverseStaticChildren(n1, n2);
          } else if (
            // #2080 if the stable fragment has a key, it's a <template v-for> that may
            //  get moved around. Make sure all root level vnodes inherit el.
            // #2134 or if it's a component root, it may also get moved around
            // as the component is being moved.
            n2.key != null || parentComponent && n2 === parentComponent.subTree
          ) {
            traverseStaticChildren(
              n1,
              n2,
              true
              /* shallow */
            );
          }
        } else {
          patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    };
    const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      n2.slotScopeIds = slotScopeIds;
      if (n1 == null) {
        if (n2.shapeFlag & 512) {
          parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
        } else {
          mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
        }
      } else {
        updateComponent(n1, n2, optimized);
      }
    };
    const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
      const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
      if ({}.NODE_ENV !== "production" && instance.type.__hmrId) {
        registerHMR(instance);
      }
      if ({}.NODE_ENV !== "production") {
        pushWarningContext(initialVNode);
        startMeasure(instance, `mount`);
      }
      if (isKeepAlive(initialVNode)) {
        instance.ctx.renderer = internals;
      }
      {
        if ({}.NODE_ENV !== "production") {
          startMeasure(instance, `init`);
        }
        setupComponent(instance);
        if ({}.NODE_ENV !== "production") {
          endMeasure(instance, `init`);
        }
      }
      if (instance.asyncDep) {
        parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
        if (!initialVNode.el) {
          const placeholder = instance.subTree = createVNode(Comment$1);
          processCommentNode(null, placeholder, container, anchor);
        }
        return;
      }
      setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
      if ({}.NODE_ENV !== "production") {
        popWarningContext();
        endMeasure(instance, `mount`);
      }
    };
    const updateComponent = (n1, n2, optimized) => {
      const instance = n2.component = n1.component;
      if (shouldUpdateComponent(n1, n2, optimized)) {
        if (instance.asyncDep && !instance.asyncResolved) {
          if ({}.NODE_ENV !== "production") {
            pushWarningContext(n2);
          }
          updateComponentPreRender(instance, n2, optimized);
          if ({}.NODE_ENV !== "production") {
            popWarningContext();
          }
          return;
        } else {
          instance.next = n2;
          invalidateJob(instance.update);
          instance.update();
        }
      } else {
        n2.el = n1.el;
        instance.vnode = n2;
      }
    };
    const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
      const componentUpdateFn = () => {
        if (!instance.isMounted) {
          let vnodeHook;
          const { el, props } = initialVNode;
          const { bm, m: m2, parent } = instance;
          const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
          toggleRecurse(instance, false);
          if (bm) {
            invokeArrayFns(bm);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
            invokeVNodeHook(vnodeHook, parent, initialVNode);
          }
          toggleRecurse(instance, true);
          if (el && hydrateNode) {
            const hydrateSubTree = () => {
              if ({}.NODE_ENV !== "production") {
                startMeasure(instance, `render`);
              }
              instance.subTree = renderComponentRoot(instance);
              if ({}.NODE_ENV !== "production") {
                endMeasure(instance, `render`);
              }
              if ({}.NODE_ENV !== "production") {
                startMeasure(instance, `hydrate`);
              }
              hydrateNode(el, instance.subTree, instance, parentSuspense, null);
              if ({}.NODE_ENV !== "production") {
                endMeasure(instance, `hydrate`);
              }
            };
            if (isAsyncWrapperVNode) {
              initialVNode.type.__asyncLoader().then(
                // note: we are moving the render call into an async callback,
                // which means it won't track dependencies - but it's ok because
                // a server-rendered async wrapper is already in resolved state
                // and it will never need to change.
                () => !instance.isUnmounted && hydrateSubTree()
              );
            } else {
              hydrateSubTree();
            }
          } else {
            if ({}.NODE_ENV !== "production") {
              startMeasure(instance, `render`);
            }
            const subTree = instance.subTree = renderComponentRoot(instance);
            if ({}.NODE_ENV !== "production") {
              endMeasure(instance, `render`);
            }
            if ({}.NODE_ENV !== "production") {
              startMeasure(instance, `patch`);
            }
            patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
            if ({}.NODE_ENV !== "production") {
              endMeasure(instance, `patch`);
            }
            initialVNode.el = subTree.el;
          }
          if (m2) {
            queuePostRenderEffect(m2, parentSuspense);
          }
          if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
            const scopedInitialVNode = initialVNode;
            queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
          }
          if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
            instance.a && queuePostRenderEffect(instance.a, parentSuspense);
          }
          instance.isMounted = true;
          if ({}.NODE_ENV !== "production" || false) {
            devtoolsComponentAdded(instance);
          }
          initialVNode = container = anchor = null;
        } else {
          let { next, bu, u: u2, parent, vnode } = instance;
          let originNext = next;
          let vnodeHook;
          if ({}.NODE_ENV !== "production") {
            pushWarningContext(next || instance.vnode);
          }
          toggleRecurse(instance, false);
          if (next) {
            next.el = vnode.el;
            updateComponentPreRender(instance, next, optimized);
          } else {
            next = vnode;
          }
          if (bu) {
            invokeArrayFns(bu);
          }
          if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
            invokeVNodeHook(vnodeHook, parent, next, vnode);
          }
          toggleRecurse(instance, true);
          if ({}.NODE_ENV !== "production") {
            startMeasure(instance, `render`);
          }
          const nextTree = renderComponentRoot(instance);
          if ({}.NODE_ENV !== "production") {
            endMeasure(instance, `render`);
          }
          const prevTree = instance.subTree;
          instance.subTree = nextTree;
          if ({}.NODE_ENV !== "production") {
            startMeasure(instance, `patch`);
          }
          patch(
            prevTree,
            nextTree,
            // parent may have changed if it's in a teleport
            hostParentNode(prevTree.el),
            // anchor may have changed if it's in a fragment
            getNextHostNode(prevTree),
            instance,
            parentSuspense,
            isSVG
          );
          if ({}.NODE_ENV !== "production") {
            endMeasure(instance, `patch`);
          }
          next.el = nextTree.el;
          if (originNext === null) {
            updateHOCHostEl(instance, nextTree.el);
          }
          if (u2) {
            queuePostRenderEffect(u2, parentSuspense);
          }
          if (vnodeHook = next.props && next.props.onVnodeUpdated) {
            queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
          }
          if ({}.NODE_ENV !== "production" || false) {
            devtoolsComponentUpdated(instance);
          }
          if ({}.NODE_ENV !== "production") {
            popWarningContext();
          }
        }
      };
      const effect = instance.effect = new ReactiveEffect(
        componentUpdateFn,
        () => queueJob(update),
        instance.scope
        // track it in component's effect scope
      );
      const update = instance.update = () => effect.run();
      update.id = instance.uid;
      toggleRecurse(instance, true);
      if ({}.NODE_ENV !== "production") {
        effect.onTrack = instance.rtc ? (e2) => invokeArrayFns(instance.rtc, e2) : void 0;
        effect.onTrigger = instance.rtg ? (e2) => invokeArrayFns(instance.rtg, e2) : void 0;
        update.ownerInstance = instance;
      }
      update();
    };
    const updateComponentPreRender = (instance, nextVNode, optimized) => {
      nextVNode.component = instance;
      const prevProps = instance.vnode.props;
      instance.vnode = nextVNode;
      instance.next = null;
      updateProps(instance, nextVNode.props, prevProps, optimized);
      updateSlots(instance, nextVNode.children, optimized);
      pauseTracking();
      flushPreFlushCbs();
      resetTracking();
    };
    const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
      const c1 = n1 && n1.children;
      const prevShapeFlag = n1 ? n1.shapeFlag : 0;
      const c2 = n2.children;
      const { patchFlag, shapeFlag } = n2;
      if (patchFlag > 0) {
        if (patchFlag & 128) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          return;
        } else if (patchFlag & 256) {
          patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          return;
        }
      }
      if (shapeFlag & 8) {
        if (prevShapeFlag & 16) {
          unmountChildren(c1, parentComponent, parentSuspense);
        }
        if (c2 !== c1) {
          hostSetElementText(container, c2);
        }
      } else {
        if (prevShapeFlag & 16) {
          if (shapeFlag & 16) {
            patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else {
            unmountChildren(c1, parentComponent, parentSuspense, true);
          }
        } else {
          if (prevShapeFlag & 8) {
            hostSetElementText(container, "");
          }
          if (shapeFlag & 16) {
            mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          }
        }
      }
    };
    const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      c1 = c1 || EMPTY_ARR;
      c2 = c2 || EMPTY_ARR;
      const oldLength = c1.length;
      const newLength = c2.length;
      const commonLength = Math.min(oldLength, newLength);
      let i2;
      for (i2 = 0; i2 < commonLength; i2++) {
        const nextChild = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
        patch(c1[i2], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
      if (oldLength > newLength) {
        unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
      } else {
        mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
      }
    };
    const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
      let i2 = 0;
      const l2 = c2.length;
      let e1 = c1.length - 1;
      let e2 = l2 - 1;
      while (i2 <= e1 && i2 <= e2) {
        const n1 = c1[i2];
        const n2 = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          break;
        }
        i2++;
      }
      while (i2 <= e1 && i2 <= e2) {
        const n1 = c1[e1];
        const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
        if (isSameVNodeType(n1, n2)) {
          patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          break;
        }
        e1--;
        e2--;
      }
      if (i2 > e1) {
        if (i2 <= e2) {
          const nextPos = e2 + 1;
          const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
          while (i2 <= e2) {
            patch(null, c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            i2++;
          }
        }
      } else if (i2 > e2) {
        while (i2 <= e1) {
          unmount(c1[i2], parentComponent, parentSuspense, true);
          i2++;
        }
      } else {
        const s1 = i2;
        const s2 = i2;
        const keyToNewIndexMap = /* @__PURE__ */ new Map();
        for (i2 = s2; i2 <= e2; i2++) {
          const nextChild = c2[i2] = optimized ? cloneIfMounted(c2[i2]) : normalizeVNode(c2[i2]);
          if (nextChild.key != null) {
            if ({}.NODE_ENV !== "production" && keyToNewIndexMap.has(nextChild.key)) {
              warn(`Duplicate keys found during update:`, JSON.stringify(nextChild.key), `Make sure keys are unique.`);
            }
            keyToNewIndexMap.set(nextChild.key, i2);
          }
        }
        let j2;
        let patched = 0;
        const toBePatched = e2 - s2 + 1;
        let moved = false;
        let maxNewIndexSoFar = 0;
        const newIndexToOldIndexMap = new Array(toBePatched);
        for (i2 = 0; i2 < toBePatched; i2++)
          newIndexToOldIndexMap[i2] = 0;
        for (i2 = s1; i2 <= e1; i2++) {
          const prevChild = c1[i2];
          if (patched >= toBePatched) {
            unmount(prevChild, parentComponent, parentSuspense, true);
            continue;
          }
          let newIndex;
          if (prevChild.key != null) {
            newIndex = keyToNewIndexMap.get(prevChild.key);
          } else {
            for (j2 = s2; j2 <= e2; j2++) {
              if (newIndexToOldIndexMap[j2 - s2] === 0 && isSameVNodeType(prevChild, c2[j2])) {
                newIndex = j2;
                break;
              }
            }
          }
          if (newIndex === void 0) {
            unmount(prevChild, parentComponent, parentSuspense, true);
          } else {
            newIndexToOldIndexMap[newIndex - s2] = i2 + 1;
            if (newIndex >= maxNewIndexSoFar) {
              maxNewIndexSoFar = newIndex;
            } else {
              moved = true;
            }
            patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
            patched++;
          }
        }
        const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
        j2 = increasingNewIndexSequence.length - 1;
        for (i2 = toBePatched - 1; i2 >= 0; i2--) {
          const nextIndex = s2 + i2;
          const nextChild = c2[nextIndex];
          const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
          if (newIndexToOldIndexMap[i2] === 0) {
            patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          } else if (moved) {
            if (j2 < 0 || i2 !== increasingNewIndexSequence[j2]) {
              move(
                nextChild,
                container,
                anchor,
                2
                /* MoveType.REORDER */
              );
            } else {
              j2--;
            }
          }
        }
      }
    };
    const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
      const { el, type, transition, children, shapeFlag } = vnode;
      if (shapeFlag & 6) {
        move(vnode.component.subTree, container, anchor, moveType);
        return;
      }
      if (shapeFlag & 128) {
        vnode.suspense.move(container, anchor, moveType);
        return;
      }
      if (shapeFlag & 64) {
        type.move(vnode, container, anchor, internals);
        return;
      }
      if (type === Fragment) {
        hostInsert(el, container, anchor);
        for (let i2 = 0; i2 < children.length; i2++) {
          move(children[i2], container, anchor, moveType);
        }
        hostInsert(vnode.anchor, container, anchor);
        return;
      }
      if (type === Static) {
        moveStaticNode(vnode, container, anchor);
        return;
      }
      const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
      if (needTransition) {
        if (moveType === 0) {
          transition.beforeEnter(el);
          hostInsert(el, container, anchor);
          queuePostRenderEffect(() => transition.enter(el), parentSuspense);
        } else {
          const { leave, delayLeave, afterLeave } = transition;
          const remove3 = () => hostInsert(el, container, anchor);
          const performLeave = () => {
            leave(el, () => {
              remove3();
              afterLeave && afterLeave();
            });
          };
          if (delayLeave) {
            delayLeave(el, remove3, performLeave);
          } else {
            performLeave();
          }
        }
      } else {
        hostInsert(el, container, anchor);
      }
    };
    const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
      const { type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
      if (ref2 != null) {
        setRef(ref2, null, parentSuspense, vnode, true);
      }
      if (shapeFlag & 256) {
        parentComponent.ctx.deactivate(vnode);
        return;
      }
      const shouldInvokeDirs = shapeFlag & 1 && dirs;
      const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
      let vnodeHook;
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
      if (shapeFlag & 6) {
        unmountComponent(vnode.component, parentSuspense, doRemove);
      } else {
        if (shapeFlag & 128) {
          vnode.suspense.unmount(parentSuspense, doRemove);
          return;
        }
        if (shouldInvokeDirs) {
          invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
        }
        if (shapeFlag & 64) {
          vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
        } else if (dynamicChildren && // #1153: fast path should not be taken for non-stable (v-for) fragments
        (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
          unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
        } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
          unmountChildren(children, parentComponent, parentSuspense);
        }
        if (doRemove) {
          remove2(vnode);
        }
      }
      if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
        queuePostRenderEffect(() => {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        }, parentSuspense);
      }
    };
    const remove2 = (vnode) => {
      const { type, el, anchor, transition } = vnode;
      if (type === Fragment) {
        if ({}.NODE_ENV !== "production" && vnode.patchFlag > 0 && vnode.patchFlag & 2048 && transition && !transition.persisted) {
          vnode.children.forEach((child) => {
            if (child.type === Comment$1) {
              hostRemove(child.el);
            } else {
              remove2(child);
            }
          });
        } else {
          removeFragment(el, anchor);
        }
        return;
      }
      if (type === Static) {
        removeStaticNode(vnode);
        return;
      }
      const performRemove = () => {
        hostRemove(el);
        if (transition && !transition.persisted && transition.afterLeave) {
          transition.afterLeave();
        }
      };
      if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
        const { leave, delayLeave } = transition;
        const performLeave = () => leave(el, performRemove);
        if (delayLeave) {
          delayLeave(vnode.el, performRemove, performLeave);
        } else {
          performLeave();
        }
      } else {
        performRemove();
      }
    };
    const removeFragment = (cur, end) => {
      let next;
      while (cur !== end) {
        next = hostNextSibling(cur);
        hostRemove(cur);
        cur = next;
      }
      hostRemove(end);
    };
    const unmountComponent = (instance, parentSuspense, doRemove) => {
      if ({}.NODE_ENV !== "production" && instance.type.__hmrId) {
        unregisterHMR(instance);
      }
      const { bum, scope, update, subTree, um } = instance;
      if (bum) {
        invokeArrayFns(bum);
      }
      scope.stop();
      if (update) {
        update.active = false;
        unmount(subTree, instance, parentSuspense, doRemove);
      }
      if (um) {
        queuePostRenderEffect(um, parentSuspense);
      }
      queuePostRenderEffect(() => {
        instance.isUnmounted = true;
      }, parentSuspense);
      if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
        parentSuspense.deps--;
        if (parentSuspense.deps === 0) {
          parentSuspense.resolve();
        }
      }
      if ({}.NODE_ENV !== "production" || false) {
        devtoolsComponentRemoved(instance);
      }
    };
    const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
      for (let i2 = start; i2 < children.length; i2++) {
        unmount(children[i2], parentComponent, parentSuspense, doRemove, optimized);
      }
    };
    const getNextHostNode = (vnode) => {
      if (vnode.shapeFlag & 6) {
        return getNextHostNode(vnode.component.subTree);
      }
      if (vnode.shapeFlag & 128) {
        return vnode.suspense.next();
      }
      return hostNextSibling(vnode.anchor || vnode.el);
    };
    const render = (vnode, container, isSVG) => {
      if (vnode == null) {
        if (container._vnode) {
          unmount(container._vnode, null, null, true);
        }
      } else {
        patch(container._vnode || null, vnode, container, null, null, null, isSVG);
      }
      flushPreFlushCbs();
      flushPostFlushCbs();
      container._vnode = vnode;
    };
    const internals = {
      p: patch,
      um: unmount,
      m: move,
      r: remove2,
      mt: mountComponent,
      mc: mountChildren,
      pc: patchChildren,
      pbc: patchBlockChildren,
      n: getNextHostNode,
      o: options
    };
    let hydrate;
    let hydrateNode;
    if (createHydrationFns) {
      [hydrate, hydrateNode] = createHydrationFns(internals);
    }
    return {
      render,
      hydrate,
      createApp: createAppAPI(render, hydrate)
    };
  }
  function toggleRecurse({ effect, update }, allowed) {
    effect.allowRecurse = update.allowRecurse = allowed;
  }
  function traverseStaticChildren(n1, n2, shallow = false) {
    const ch1 = n1.children;
    const ch2 = n2.children;
    if (isArray(ch1) && isArray(ch2)) {
      for (let i2 = 0; i2 < ch1.length; i2++) {
        const c1 = ch1[i2];
        let c2 = ch2[i2];
        if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
          if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
            c2 = ch2[i2] = cloneIfMounted(ch2[i2]);
            c2.el = c1.el;
          }
          if (!shallow)
            traverseStaticChildren(c1, c2);
        }
        if (c2.type === Text) {
          c2.el = c1.el;
        }
        if ({}.NODE_ENV !== "production" && c2.type === Comment$1 && !c2.el) {
          c2.el = c1.el;
        }
      }
    }
  }
  function getSequence(arr) {
    const p2 = arr.slice();
    const result = [0];
    let i2, j2, u2, v2, c2;
    const len = arr.length;
    for (i2 = 0; i2 < len; i2++) {
      const arrI = arr[i2];
      if (arrI !== 0) {
        j2 = result[result.length - 1];
        if (arr[j2] < arrI) {
          p2[i2] = j2;
          result.push(i2);
          continue;
        }
        u2 = 0;
        v2 = result.length - 1;
        while (u2 < v2) {
          c2 = u2 + v2 >> 1;
          if (arr[result[c2]] < arrI) {
            u2 = c2 + 1;
          } else {
            v2 = c2;
          }
        }
        if (arrI < arr[result[u2]]) {
          if (u2 > 0) {
            p2[i2] = result[u2 - 1];
          }
          result[u2] = i2;
        }
      }
    }
    u2 = result.length;
    v2 = result[u2 - 1];
    while (u2-- > 0) {
      result[u2] = v2;
      v2 = p2[v2];
    }
    return result;
  }
  const isTeleport = (type) => type.__isTeleport;
  const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
  const isTargetSVG = (target) => typeof SVGElement !== "undefined" && target instanceof SVGElement;
  const resolveTarget = (props, select) => {
    const targetSelector = props && props.to;
    if (isString(targetSelector)) {
      if (!select) {
        ({}).NODE_ENV !== "production" && warn(`Current renderer does not support string target for Teleports. (missing querySelector renderer option)`);
        return null;
      } else {
        const target = select(targetSelector);
        if (!target) {
          ({}).NODE_ENV !== "production" && warn(`Failed to locate Teleport target with selector "${targetSelector}". Note the target element must exist before the component is mounted - i.e. the target cannot be rendered by the component itself, and ideally should be outside of the entire Vue component tree.`);
        }
        return target;
      }
    } else {
      if ({}.NODE_ENV !== "production" && !targetSelector && !isTeleportDisabled(props)) {
        warn(`Invalid Teleport target: ${targetSelector}`);
      }
      return targetSelector;
    }
  };
  const TeleportImpl = {
    __isTeleport: true,
    process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
      const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
      const disabled = isTeleportDisabled(n2.props);
      let { shapeFlag, children, dynamicChildren } = n2;
      if ({}.NODE_ENV !== "production" && isHmrUpdating) {
        optimized = false;
        dynamicChildren = null;
      }
      if (n1 == null) {
        const placeholder = n2.el = {}.NODE_ENV !== "production" ? createComment("teleport start") : createText("");
        const mainAnchor = n2.anchor = {}.NODE_ENV !== "production" ? createComment("teleport end") : createText("");
        insert(placeholder, container, anchor);
        insert(mainAnchor, container, anchor);
        const target = n2.target = resolveTarget(n2.props, querySelector);
        const targetAnchor = n2.targetAnchor = createText("");
        if (target) {
          insert(targetAnchor, target);
          isSVG = isSVG || isTargetSVG(target);
        } else if ({}.NODE_ENV !== "production" && !disabled) {
          warn("Invalid Teleport target on mount:", target, `(${typeof target})`);
        }
        const mount = (container2, anchor2) => {
          if (shapeFlag & 16) {
            mountChildren(children, container2, anchor2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          }
        };
        if (disabled) {
          mount(container, mainAnchor);
        } else if (target) {
          mount(target, targetAnchor);
        }
      } else {
        n2.el = n1.el;
        const mainAnchor = n2.anchor = n1.anchor;
        const target = n2.target = n1.target;
        const targetAnchor = n2.targetAnchor = n1.targetAnchor;
        const wasDisabled = isTeleportDisabled(n1.props);
        const currentContainer = wasDisabled ? container : target;
        const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
        isSVG = isSVG || isTargetSVG(target);
        if (dynamicChildren) {
          patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds);
          traverseStaticChildren(n1, n2, true);
        } else if (!optimized) {
          patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
        }
        if (disabled) {
          if (!wasDisabled) {
            moveTeleport(
              n2,
              container,
              mainAnchor,
              internals,
              1
              /* TeleportMoveTypes.TOGGLE */
            );
          }
        } else {
          if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
            const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
            if (nextTarget) {
              moveTeleport(
                n2,
                nextTarget,
                null,
                internals,
                0
                /* TeleportMoveTypes.TARGET_CHANGE */
              );
            } else if ({}.NODE_ENV !== "production") {
              warn("Invalid Teleport target on update:", target, `(${typeof target})`);
            }
          } else if (wasDisabled) {
            moveTeleport(
              n2,
              target,
              targetAnchor,
              internals,
              1
              /* TeleportMoveTypes.TOGGLE */
            );
          }
        }
      }
      updateCssVars(n2);
    },
    remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
      const { shapeFlag, children, anchor, targetAnchor, target, props } = vnode;
      if (target) {
        hostRemove(targetAnchor);
      }
      if (doRemove || !isTeleportDisabled(props)) {
        hostRemove(anchor);
        if (shapeFlag & 16) {
          for (let i2 = 0; i2 < children.length; i2++) {
            const child = children[i2];
            unmount(child, parentComponent, parentSuspense, true, !!child.dynamicChildren);
          }
        }
      }
    },
    move: moveTeleport,
    hydrate: hydrateTeleport
  };
  function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
    if (moveType === 0) {
      insert(vnode.targetAnchor, container, parentAnchor);
    }
    const { el, anchor, shapeFlag, children, props } = vnode;
    const isReorder = moveType === 2;
    if (isReorder) {
      insert(el, container, parentAnchor);
    }
    if (!isReorder || isTeleportDisabled(props)) {
      if (shapeFlag & 16) {
        for (let i2 = 0; i2 < children.length; i2++) {
          move(
            children[i2],
            container,
            parentAnchor,
            2
            /* MoveType.REORDER */
          );
        }
      }
    }
    if (isReorder) {
      insert(anchor, container, parentAnchor);
    }
  }
  function hydrateTeleport(node, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, { o: { nextSibling, parentNode, querySelector } }, hydrateChildren) {
    const target = vnode.target = resolveTarget(vnode.props, querySelector);
    if (target) {
      const targetNode = target._lpa || target.firstChild;
      if (vnode.shapeFlag & 16) {
        if (isTeleportDisabled(vnode.props)) {
          vnode.anchor = hydrateChildren(nextSibling(node), vnode, parentNode(node), parentComponent, parentSuspense, slotScopeIds, optimized);
          vnode.targetAnchor = targetNode;
        } else {
          vnode.anchor = nextSibling(node);
          let targetAnchor = targetNode;
          while (targetAnchor) {
            targetAnchor = nextSibling(targetAnchor);
            if (targetAnchor && targetAnchor.nodeType === 8 && targetAnchor.data === "teleport anchor") {
              vnode.targetAnchor = targetAnchor;
              target._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
              break;
            }
          }
          hydrateChildren(targetNode, vnode, target, parentComponent, parentSuspense, slotScopeIds, optimized);
        }
      }
      updateCssVars(vnode);
    }
    return vnode.anchor && nextSibling(vnode.anchor);
  }
  const Teleport = TeleportImpl;
  function updateCssVars(vnode) {
    const ctx = vnode.ctx;
    if (ctx && ctx.ut) {
      let node = vnode.children[0].el;
      while (node !== vnode.targetAnchor) {
        if (node.nodeType === 1)
          node.setAttribute("data-v-owner", ctx.uid);
        node = node.nextSibling;
      }
      ctx.ut();
    }
  }
  const Fragment = Symbol({}.NODE_ENV !== "production" ? "Fragment" : void 0);
  const Text = Symbol({}.NODE_ENV !== "production" ? "Text" : void 0);
  const Comment$1 = Symbol({}.NODE_ENV !== "production" ? "Comment" : void 0);
  const Static = Symbol({}.NODE_ENV !== "production" ? "Static" : void 0);
  const blockStack = [];
  let currentBlock = null;
  function openBlock(disableTracking = false) {
    blockStack.push(currentBlock = disableTracking ? null : []);
  }
  function closeBlock() {
    blockStack.pop();
    currentBlock = blockStack[blockStack.length - 1] || null;
  }
  let isBlockTreeEnabled = 1;
  function setBlockTracking(value) {
    isBlockTreeEnabled += value;
  }
  function setupBlock(vnode) {
    vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
    closeBlock();
    if (isBlockTreeEnabled > 0 && currentBlock) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
    return setupBlock(createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
      /* isBlock */
    ));
  }
  function createBlock(type, props, children, patchFlag, dynamicProps) {
    return setupBlock(createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
      /* isBlock: prevent a block from tracking itself */
    ));
  }
  function isVNode(value) {
    return value ? value.__v_isVNode === true : false;
  }
  function isSameVNodeType(n1, n2) {
    if ({}.NODE_ENV !== "production" && n2.shapeFlag & 6 && hmrDirtyComponents.has(n2.type)) {
      n1.shapeFlag &= ~256;
      n2.shapeFlag &= ~512;
      return false;
    }
    return n1.type === n2.type && n1.key === n2.key;
  }
  const createVNodeWithArgsTransform = (...args) => {
    return _createVNode(...args);
  };
  const InternalObjectKey = `__vInternal`;
  const normalizeKey = ({ key }) => key != null ? key : null;
  const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
    return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
  };
  function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
    const vnode = {
      __v_isVNode: true,
      __v_skip: true,
      type,
      props,
      key: props && normalizeKey(props),
      ref: props && normalizeRef(props),
      scopeId: currentScopeId,
      slotScopeIds: null,
      children,
      component: null,
      suspense: null,
      ssContent: null,
      ssFallback: null,
      dirs: null,
      transition: null,
      el: null,
      anchor: null,
      target: null,
      targetAnchor: null,
      staticCount: 0,
      shapeFlag,
      patchFlag,
      dynamicProps,
      dynamicChildren: null,
      appContext: null,
      ctx: currentRenderingInstance
    };
    if (needFullChildrenNormalization) {
      normalizeChildren(vnode, children);
      if (shapeFlag & 128) {
        type.normalize(vnode);
      }
    } else if (children) {
      vnode.shapeFlag |= isString(children) ? 8 : 16;
    }
    if ({}.NODE_ENV !== "production" && vnode.key !== vnode.key) {
      warn(`VNode created with invalid key (NaN). VNode type:`, vnode.type);
    }
    if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
    !isBlockNode && // has current parent block
    currentBlock && // presence of a patch flag indicates this node needs patching on updates.
    // component nodes also should always be patched, because even if the
    // component doesn't need to update, it needs to persist the instance on to
    // the next vnode so that it can be properly unmounted later.
    (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
    // vnode should not be considered dynamic due to handler caching.
    vnode.patchFlag !== 32) {
      currentBlock.push(vnode);
    }
    return vnode;
  }
  const createVNode = {}.NODE_ENV !== "production" ? createVNodeWithArgsTransform : _createVNode;
  function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
    if (!type || type === NULL_DYNAMIC_COMPONENT) {
      if ({}.NODE_ENV !== "production" && !type) {
        warn(`Invalid vnode type when creating vnode: ${type}.`);
      }
      type = Comment$1;
    }
    if (isVNode(type)) {
      const cloned = cloneVNode(
        type,
        props,
        true
        /* mergeRef: true */
      );
      if (children) {
        normalizeChildren(cloned, children);
      }
      if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
        if (cloned.shapeFlag & 6) {
          currentBlock[currentBlock.indexOf(type)] = cloned;
        } else {
          currentBlock.push(cloned);
        }
      }
      cloned.patchFlag |= -2;
      return cloned;
    }
    if (isClassComponent(type)) {
      type = type.__vccOpts;
    }
    if (props) {
      props = guardReactiveProps(props);
      let { class: klass, style: style2 } = props;
      if (klass && !isString(klass)) {
        props.class = normalizeClass(klass);
      }
      if (isObject(style2)) {
        if (isProxy(style2) && !isArray(style2)) {
          style2 = extend({}, style2);
        }
        props.style = normalizeStyle(style2);
      }
    }
    const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
    if ({}.NODE_ENV !== "production" && shapeFlag & 4 && isProxy(type)) {
      type = toRaw(type);
      warn(`Vue received a Component which was made a reactive object. This can lead to unnecessary performance overhead, and should be avoided by marking the component with \`markRaw\` or using \`shallowRef\` instead of \`ref\`.`, `
Component that was made reactive: `, type);
    }
    return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
  }
  function guardReactiveProps(props) {
    if (!props)
      return null;
    return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
  }
  function cloneVNode(vnode, extraProps, mergeRef = false) {
    const { props, ref: ref2, patchFlag, children } = vnode;
    const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
    const cloned = {
      __v_isVNode: true,
      __v_skip: true,
      type: vnode.type,
      props: mergedProps,
      key: mergedProps && normalizeKey(mergedProps),
      ref: extraProps && extraProps.ref ? (
        // #2078 in the case of <component :is="vnode" ref="extra"/>
        // if the vnode itself already has a ref, cloneVNode will need to merge
        // the refs so the single vnode can be set on multiple refs
        mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps)
      ) : ref2,
      scopeId: vnode.scopeId,
      slotScopeIds: vnode.slotScopeIds,
      children: {}.NODE_ENV !== "production" && patchFlag === -1 && isArray(children) ? children.map(deepCloneVNode) : children,
      target: vnode.target,
      targetAnchor: vnode.targetAnchor,
      staticCount: vnode.staticCount,
      shapeFlag: vnode.shapeFlag,
      // if the vnode is cloned with extra props, we can no longer assume its
      // existing patch flag to be reliable and need to add the FULL_PROPS flag.
      // note: preserve flag for fragments since they use the flag for children
      // fast paths only.
      patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
      dynamicProps: vnode.dynamicProps,
      dynamicChildren: vnode.dynamicChildren,
      appContext: vnode.appContext,
      dirs: vnode.dirs,
      transition: vnode.transition,
      // These should technically only be non-null on mounted VNodes. However,
      // they *should* be copied for kept-alive vnodes. So we just always copy
      // them since them being non-null during a mount doesn't affect the logic as
      // they will simply be overwritten.
      component: vnode.component,
      suspense: vnode.suspense,
      ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
      ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
      el: vnode.el,
      anchor: vnode.anchor,
      ctx: vnode.ctx,
      ce: vnode.ce
    };
    return cloned;
  }
  function deepCloneVNode(vnode) {
    const cloned = cloneVNode(vnode);
    if (isArray(vnode.children)) {
      cloned.children = vnode.children.map(deepCloneVNode);
    }
    return cloned;
  }
  function createTextVNode(text = " ", flag = 0) {
    return createVNode(Text, null, text, flag);
  }
  function createCommentVNode(text = "", asBlock = false) {
    return asBlock ? (openBlock(), createBlock(Comment$1, null, text)) : createVNode(Comment$1, null, text);
  }
  function normalizeVNode(child) {
    if (child == null || typeof child === "boolean") {
      return createVNode(Comment$1);
    } else if (isArray(child)) {
      return createVNode(
        Fragment,
        null,
        // #3666, avoid reference pollution when reusing vnode
        child.slice()
      );
    } else if (typeof child === "object") {
      return cloneIfMounted(child);
    } else {
      return createVNode(Text, null, String(child));
    }
  }
  function cloneIfMounted(child) {
    return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
  }
  function normalizeChildren(vnode, children) {
    let type = 0;
    const { shapeFlag } = vnode;
    if (children == null) {
      children = null;
    } else if (isArray(children)) {
      type = 16;
    } else if (typeof children === "object") {
      if (shapeFlag & (1 | 64)) {
        const slot = children.default;
        if (slot) {
          slot._c && (slot._d = false);
          normalizeChildren(vnode, slot());
          slot._c && (slot._d = true);
        }
        return;
      } else {
        type = 32;
        const slotFlag = children._;
        if (!slotFlag && !(InternalObjectKey in children)) {
          children._ctx = currentRenderingInstance;
        } else if (slotFlag === 3 && currentRenderingInstance) {
          if (currentRenderingInstance.slots._ === 1) {
            children._ = 1;
          } else {
            children._ = 2;
            vnode.patchFlag |= 1024;
          }
        }
      }
    } else if (isFunction(children)) {
      children = { default: children, _ctx: currentRenderingInstance };
      type = 32;
    } else {
      children = String(children);
      if (shapeFlag & 64) {
        type = 16;
        children = [createTextVNode(children)];
      } else {
        type = 8;
      }
    }
    vnode.children = children;
    vnode.shapeFlag |= type;
  }
  function mergeProps(...args) {
    const ret = {};
    for (let i2 = 0; i2 < args.length; i2++) {
      const toMerge = args[i2];
      for (const key in toMerge) {
        if (key === "class") {
          if (ret.class !== toMerge.class) {
            ret.class = normalizeClass([ret.class, toMerge.class]);
          }
        } else if (key === "style") {
          ret.style = normalizeStyle([ret.style, toMerge.style]);
        } else if (isOn(key)) {
          const existing = ret[key];
          const incoming = toMerge[key];
          if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
            ret[key] = existing ? [].concat(existing, incoming) : incoming;
          }
        } else if (key !== "") {
          ret[key] = toMerge[key];
        }
      }
    }
    return ret;
  }
  function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
    callWithAsyncErrorHandling(hook, instance, 7, [
      vnode,
      prevVNode
    ]);
  }
  const emptyAppContext = createAppContext();
  let uid = 0;
  function createComponentInstance(vnode, parent, suspense) {
    const type = vnode.type;
    const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
    const instance = {
      uid: uid++,
      vnode,
      type,
      parent,
      appContext,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      scope: new EffectScope(
        true
        /* detached */
      ),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: parent ? parent.provides : Object.create(appContext.provides),
      accessCache: null,
      renderCache: [],
      // local resolved assets
      components: null,
      directives: null,
      // resolved props and emits options
      propsOptions: normalizePropsOptions(type, appContext),
      emitsOptions: normalizeEmitsOptions(type, appContext),
      // emit
      emit: null,
      emitted: null,
      // props default value
      propsDefaults: EMPTY_OBJ,
      // inheritAttrs
      inheritAttrs: type.inheritAttrs,
      // state
      ctx: EMPTY_OBJ,
      data: EMPTY_OBJ,
      props: EMPTY_OBJ,
      attrs: EMPTY_OBJ,
      slots: EMPTY_OBJ,
      refs: EMPTY_OBJ,
      setupState: EMPTY_OBJ,
      setupContext: null,
      // suspense related
      suspense,
      suspenseId: suspense ? suspense.pendingId : 0,
      asyncDep: null,
      asyncResolved: false,
      // lifecycle hooks
      // not using enums here because it results in computed properties
      isMounted: false,
      isUnmounted: false,
      isDeactivated: false,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null
    };
    if ({}.NODE_ENV !== "production") {
      instance.ctx = createDevRenderContext(instance);
    } else {
      instance.ctx = { _: instance };
    }
    instance.root = parent ? parent.root : instance;
    instance.emit = emit.bind(null, instance);
    if (vnode.ce) {
      vnode.ce(instance);
    }
    return instance;
  }
  let currentInstance = null;
  const getCurrentInstance = () => currentInstance || currentRenderingInstance;
  const setCurrentInstance = (instance) => {
    currentInstance = instance;
    instance.scope.on();
  };
  const unsetCurrentInstance = () => {
    currentInstance && currentInstance.scope.off();
    currentInstance = null;
  };
  const isBuiltInTag = /* @__PURE__ */ makeMap("slot,component");
  function validateComponentName(name, config) {
    const appIsNativeTag = config.isNativeTag || NO;
    if (isBuiltInTag(name) || appIsNativeTag(name)) {
      warn("Do not use built-in or reserved HTML elements as component id: " + name);
    }
  }
  function isStatefulComponent(instance) {
    return instance.vnode.shapeFlag & 4;
  }
  let isInSSRComponentSetup = false;
  function setupComponent(instance, isSSR = false) {
    isInSSRComponentSetup = isSSR;
    const { props, children } = instance.vnode;
    const isStateful = isStatefulComponent(instance);
    initProps(instance, props, isStateful, isSSR);
    initSlots(instance, children);
    const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
    isInSSRComponentSetup = false;
    return setupResult;
  }
  function setupStatefulComponent(instance, isSSR) {
    var _a;
    const Component = instance.type;
    if ({}.NODE_ENV !== "production") {
      if (Component.name) {
        validateComponentName(Component.name, instance.appContext.config);
      }
      if (Component.components) {
        const names = Object.keys(Component.components);
        for (let i2 = 0; i2 < names.length; i2++) {
          validateComponentName(names[i2], instance.appContext.config);
        }
      }
      if (Component.directives) {
        const names = Object.keys(Component.directives);
        for (let i2 = 0; i2 < names.length; i2++) {
          validateDirectiveName(names[i2]);
        }
      }
      if (Component.compilerOptions && isRuntimeOnly()) {
        warn(`"compilerOptions" is only supported when using a build of Vue that includes the runtime compiler. Since you are using a runtime-only build, the options should be passed via your build tool config instead.`);
      }
    }
    instance.accessCache = /* @__PURE__ */ Object.create(null);
    instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
    if ({}.NODE_ENV !== "production") {
      exposePropsOnRenderContext(instance);
    }
    const { setup } = Component;
    if (setup) {
      const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
      setCurrentInstance(instance);
      pauseTracking();
      const setupResult = callWithErrorHandling(setup, instance, 0, [{}.NODE_ENV !== "production" ? shallowReadonly(instance.props) : instance.props, setupContext]);
      resetTracking();
      unsetCurrentInstance();
      if (isPromise(setupResult)) {
        setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
        if (isSSR) {
          return setupResult.then((resolvedResult) => {
            handleSetupResult(instance, resolvedResult, isSSR);
          }).catch((e2) => {
            handleError(
              e2,
              instance,
              0
              /* ErrorCodes.SETUP_FUNCTION */
            );
          });
        } else {
          instance.asyncDep = setupResult;
          if ({}.NODE_ENV !== "production" && !instance.suspense) {
            const name = (_a = Component.name) !== null && _a !== void 0 ? _a : "Anonymous";
            warn(`Component <${name}>: setup function returned a promise, but no <Suspense> boundary was found in the parent component tree. A component with async setup() must be nested in a <Suspense> in order to be rendered.`);
          }
        }
      } else {
        handleSetupResult(instance, setupResult, isSSR);
      }
    } else {
      finishComponentSetup(instance, isSSR);
    }
  }
  function handleSetupResult(instance, setupResult, isSSR) {
    if (isFunction(setupResult)) {
      if (instance.type.__ssrInlineRender) {
        instance.ssrRender = setupResult;
      } else {
        instance.render = setupResult;
      }
    } else if (isObject(setupResult)) {
      if ({}.NODE_ENV !== "production" && isVNode(setupResult)) {
        warn(`setup() should not return VNodes directly - return a render function instead.`);
      }
      if ({}.NODE_ENV !== "production" || false) {
        instance.devtoolsRawSetupState = setupResult;
      }
      instance.setupState = proxyRefs(setupResult);
      if ({}.NODE_ENV !== "production") {
        exposeSetupStateOnRenderContext(instance);
      }
    } else if ({}.NODE_ENV !== "production" && setupResult !== void 0) {
      warn(`setup() should return an object. Received: ${setupResult === null ? "null" : typeof setupResult}`);
    }
    finishComponentSetup(instance, isSSR);
  }
  let compile;
  const isRuntimeOnly = () => !compile;
  function finishComponentSetup(instance, isSSR, skipOptions) {
    const Component = instance.type;
    if (!instance.render) {
      if (!isSSR && compile && !Component.render) {
        const template = Component.template || resolveMergedOptions(instance).template;
        if (template) {
          if ({}.NODE_ENV !== "production") {
            startMeasure(instance, `compile`);
          }
          const { isCustomElement, compilerOptions } = instance.appContext.config;
          const { delimiters, compilerOptions: componentCompilerOptions } = Component;
          const finalCompilerOptions = extend(extend({
            isCustomElement,
            delimiters
          }, compilerOptions), componentCompilerOptions);
          Component.render = compile(template, finalCompilerOptions);
          if ({}.NODE_ENV !== "production") {
            endMeasure(instance, `compile`);
          }
        }
      }
      instance.render = Component.render || NOOP;
    }
    {
      setCurrentInstance(instance);
      pauseTracking();
      applyOptions(instance);
      resetTracking();
      unsetCurrentInstance();
    }
    if ({}.NODE_ENV !== "production" && !Component.render && instance.render === NOOP && !isSSR) {
      if (Component.template) {
        warn(
          `Component provided template option but runtime compilation is not supported in this build of Vue. Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
          /* should not happen */
        );
      } else {
        warn(`Component is missing template or render function.`);
      }
    }
  }
  function createAttrsProxy(instance) {
    return new Proxy(instance.attrs, {}.NODE_ENV !== "production" ? {
      get(target, key) {
        markAttrsAccessed();
        track(instance, "get", "$attrs");
        return target[key];
      },
      set() {
        warn(`setupContext.attrs is readonly.`);
        return false;
      },
      deleteProperty() {
        warn(`setupContext.attrs is readonly.`);
        return false;
      }
    } : {
      get(target, key) {
        track(instance, "get", "$attrs");
        return target[key];
      }
    });
  }
  function createSetupContext(instance) {
    const expose = (exposed) => {
      if ({}.NODE_ENV !== "production") {
        if (instance.exposed) {
          warn(`expose() should be called only once per setup().`);
        }
        if (exposed != null) {
          let exposedType = typeof exposed;
          if (exposedType === "object") {
            if (isArray(exposed)) {
              exposedType = "array";
            } else if (isRef(exposed)) {
              exposedType = "ref";
            }
          }
          if (exposedType !== "object") {
            warn(`expose() should be passed a plain object, received ${exposedType}.`);
          }
        }
      }
      instance.exposed = exposed || {};
    };
    let attrs;
    if ({}.NODE_ENV !== "production") {
      return Object.freeze({
        get attrs() {
          return attrs || (attrs = createAttrsProxy(instance));
        },
        get slots() {
          return shallowReadonly(instance.slots);
        },
        get emit() {
          return (event, ...args) => instance.emit(event, ...args);
        },
        expose
      });
    } else {
      return {
        get attrs() {
          return attrs || (attrs = createAttrsProxy(instance));
        },
        slots: instance.slots,
        emit: instance.emit,
        expose
      };
    }
  }
  function getExposeProxy(instance) {
    if (instance.exposed) {
      return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
        get(target, key) {
          if (key in target) {
            return target[key];
          } else if (key in publicPropertiesMap) {
            return publicPropertiesMap[key](instance);
          }
        },
        has(target, key) {
          return key in target || key in publicPropertiesMap;
        }
      }));
    }
  }
  const classifyRE = /(?:^|[-_])(\w)/g;
  const classify = (str) => str.replace(classifyRE, (c2) => c2.toUpperCase()).replace(/[-_]/g, "");
  function getComponentName(Component, includeInferred = true) {
    return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
  }
  function formatComponentName(instance, Component, isRoot = false) {
    let name = getComponentName(Component);
    if (!name && Component.__file) {
      const match = Component.__file.match(/([^/\\]+)\.\w+$/);
      if (match) {
        name = match[1];
      }
    }
    if (!name && instance && instance.parent) {
      const inferFromRegistry = (registry) => {
        for (const key in registry) {
          if (registry[key] === Component) {
            return key;
          }
        }
      };
      name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
    }
    return name ? classify(name) : isRoot ? `App` : `Anonymous`;
  }
  function isClassComponent(value) {
    return isFunction(value) && "__vccOpts" in value;
  }
  const computed = (getterOrOptions, debugOptions) => {
    return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  };
  function h$1(type, propsOrChildren, children) {
    const l2 = arguments.length;
    if (l2 === 2) {
      if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
        if (isVNode(propsOrChildren)) {
          return createVNode(type, null, [propsOrChildren]);
        }
        return createVNode(type, propsOrChildren);
      } else {
        return createVNode(type, null, propsOrChildren);
      }
    } else {
      if (l2 > 3) {
        children = Array.prototype.slice.call(arguments, 2);
      } else if (l2 === 3 && isVNode(children)) {
        children = [children];
      }
      return createVNode(type, propsOrChildren, children);
    }
  }
  const ssrContextKey = Symbol({}.NODE_ENV !== "production" ? `ssrContext` : ``);
  const useSSRContext = () => {
    {
      const ctx = inject(ssrContextKey);
      if (!ctx) {
        ({}).NODE_ENV !== "production" && warn(`Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build.`);
      }
      return ctx;
    }
  };
  function isShallow(value) {
    return !!(value && value[
      "__v_isShallow"
      /* ReactiveFlags.IS_SHALLOW */
    ]);
  }
  function initCustomFormatter() {
    if (!({}.NODE_ENV !== "production") || typeof window === "undefined") {
      return;
    }
    const vueStyle = { style: "color:#3ba776" };
    const numberStyle = { style: "color:#0b1bc9" };
    const stringStyle = { style: "color:#b62e24" };
    const keywordStyle = { style: "color:#9d288c" };
    const formatter = {
      header(obj) {
        if (!isObject(obj)) {
          return null;
        }
        if (obj.__isVue) {
          return ["div", vueStyle, `VueInstance`];
        } else if (isRef(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, genRefFlag(obj)],
            "<",
            formatValue(obj.value),
            `>`
          ];
        } else if (isReactive(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, isShallow(obj) ? "ShallowReactive" : "Reactive"],
            "<",
            formatValue(obj),
            `>${isReadonly(obj) ? ` (readonly)` : ``}`
          ];
        } else if (isReadonly(obj)) {
          return [
            "div",
            {},
            ["span", vueStyle, isShallow(obj) ? "ShallowReadonly" : "Readonly"],
            "<",
            formatValue(obj),
            ">"
          ];
        }
        return null;
      },
      hasBody(obj) {
        return obj && obj.__isVue;
      },
      body(obj) {
        if (obj && obj.__isVue) {
          return [
            "div",
            {},
            ...formatInstance(obj.$)
          ];
        }
      }
    };
    function formatInstance(instance) {
      const blocks = [];
      if (instance.type.props && instance.props) {
        blocks.push(createInstanceBlock("props", toRaw(instance.props)));
      }
      if (instance.setupState !== EMPTY_OBJ) {
        blocks.push(createInstanceBlock("setup", instance.setupState));
      }
      if (instance.data !== EMPTY_OBJ) {
        blocks.push(createInstanceBlock("data", toRaw(instance.data)));
      }
      const computed2 = extractKeys(instance, "computed");
      if (computed2) {
        blocks.push(createInstanceBlock("computed", computed2));
      }
      const injected = extractKeys(instance, "inject");
      if (injected) {
        blocks.push(createInstanceBlock("injected", injected));
      }
      blocks.push([
        "div",
        {},
        [
          "span",
          {
            style: keywordStyle.style + ";opacity:0.66"
          },
          "$ (internal): "
        ],
        ["object", { object: instance }]
      ]);
      return blocks;
    }
    function createInstanceBlock(type, target) {
      target = extend({}, target);
      if (!Object.keys(target).length) {
        return ["span", {}];
      }
      return [
        "div",
        { style: "line-height:1.25em;margin-bottom:0.6em" },
        [
          "div",
          {
            style: "color:#476582"
          },
          type
        ],
        [
          "div",
          {
            style: "padding-left:1.25em"
          },
          ...Object.keys(target).map((key) => {
            return [
              "div",
              {},
              ["span", keywordStyle, key + ": "],
              formatValue(target[key], false)
            ];
          })
        ]
      ];
    }
    function formatValue(v2, asRaw = true) {
      if (typeof v2 === "number") {
        return ["span", numberStyle, v2];
      } else if (typeof v2 === "string") {
        return ["span", stringStyle, JSON.stringify(v2)];
      } else if (typeof v2 === "boolean") {
        return ["span", keywordStyle, v2];
      } else if (isObject(v2)) {
        return ["object", { object: asRaw ? toRaw(v2) : v2 }];
      } else {
        return ["span", stringStyle, String(v2)];
      }
    }
    function extractKeys(instance, type) {
      const Comp = instance.type;
      if (isFunction(Comp)) {
        return;
      }
      const extracted = {};
      for (const key in instance.ctx) {
        if (isKeyOfType(Comp, key, type)) {
          extracted[key] = instance.ctx[key];
        }
      }
      return extracted;
    }
    function isKeyOfType(Comp, key, type) {
      const opts = Comp[type];
      if (isArray(opts) && opts.includes(key) || isObject(opts) && key in opts) {
        return true;
      }
      if (Comp.extends && isKeyOfType(Comp.extends, key, type)) {
        return true;
      }
      if (Comp.mixins && Comp.mixins.some((m2) => isKeyOfType(m2, key, type))) {
        return true;
      }
    }
    function genRefFlag(v2) {
      if (isShallow(v2)) {
        return `ShallowRef`;
      }
      if (v2.effect) {
        return `ComputedRef`;
      }
      return `Ref`;
    }
    if (window.devtoolsFormatters) {
      window.devtoolsFormatters.push(formatter);
    } else {
      window.devtoolsFormatters = [formatter];
    }
  }
  const version = "3.2.47";
  const svgNS = "http://www.w3.org/2000/svg";
  const doc = typeof document !== "undefined" ? document : null;
  const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
  const nodeOps = {
    insert: (child, parent, anchor) => {
      parent.insertBefore(child, anchor || null);
    },
    remove: (child) => {
      const parent = child.parentNode;
      if (parent) {
        parent.removeChild(child);
      }
    },
    createElement: (tag, isSVG, is, props) => {
      const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
      if (tag === "select" && props && props.multiple != null) {
        el.setAttribute("multiple", props.multiple);
      }
      return el;
    },
    createText: (text) => doc.createTextNode(text),
    createComment: (text) => doc.createComment(text),
    setText: (node, text) => {
      node.nodeValue = text;
    },
    setElementText: (el, text) => {
      el.textContent = text;
    },
    parentNode: (node) => node.parentNode,
    nextSibling: (node) => node.nextSibling,
    querySelector: (selector) => doc.querySelector(selector),
    setScopeId(el, id) {
      el.setAttribute(id, "");
    },
    // __UNSAFE__
    // Reason: innerHTML.
    // Static content here can only come from compiled templates.
    // As long as the user only uses trusted templates, this is safe.
    insertStaticContent(content, parent, anchor, isSVG, start, end) {
      const before = anchor ? anchor.previousSibling : parent.lastChild;
      if (start && (start === end || start.nextSibling)) {
        while (true) {
          parent.insertBefore(start.cloneNode(true), anchor);
          if (start === end || !(start = start.nextSibling))
            break;
        }
      } else {
        templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
        const template = templateContainer.content;
        if (isSVG) {
          const wrapper = template.firstChild;
          while (wrapper.firstChild) {
            template.appendChild(wrapper.firstChild);
          }
          template.removeChild(wrapper);
        }
        parent.insertBefore(template, anchor);
      }
      return [
        // first
        before ? before.nextSibling : parent.firstChild,
        // last
        anchor ? anchor.previousSibling : parent.lastChild
      ];
    }
  };
  function patchClass(el, value, isSVG) {
    const transitionClasses = el._vtc;
    if (transitionClasses) {
      value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
    }
    if (value == null) {
      el.removeAttribute("class");
    } else if (isSVG) {
      el.setAttribute("class", value);
    } else {
      el.className = value;
    }
  }
  function patchStyle(el, prev, next) {
    const style2 = el.style;
    const isCssString = isString(next);
    if (next && !isCssString) {
      if (prev && !isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style2, key, "");
          }
        }
      }
      for (const key in next) {
        setStyle(style2, key, next[key]);
      }
    } else {
      const currentDisplay = style2.display;
      if (isCssString) {
        if (prev !== next) {
          style2.cssText = next;
        }
      } else if (prev) {
        el.removeAttribute("style");
      }
      if ("_vod" in el) {
        style2.display = currentDisplay;
      }
    }
  }
  const semicolonRE = /[^\\];\s*$/;
  const importantRE = /\s*!important$/;
  function setStyle(style2, name, val) {
    if (isArray(val)) {
      val.forEach((v2) => setStyle(style2, name, v2));
    } else {
      if (val == null)
        val = "";
      if ({}.NODE_ENV !== "production") {
        if (semicolonRE.test(val)) {
          warn(`Unexpected semicolon at the end of '${name}' style value: '${val}'`);
        }
      }
      if (name.startsWith("--")) {
        style2.setProperty(name, val);
      } else {
        const prefixed = autoPrefix(style2, name);
        if (importantRE.test(val)) {
          style2.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
        } else {
          style2[prefixed] = val;
        }
      }
    }
  }
  const prefixes = ["Webkit", "Moz", "ms"];
  const prefixCache = {};
  function autoPrefix(style2, rawName) {
    const cached = prefixCache[rawName];
    if (cached) {
      return cached;
    }
    let name = camelize(rawName);
    if (name !== "filter" && name in style2) {
      return prefixCache[rawName] = name;
    }
    name = capitalize(name);
    for (let i2 = 0; i2 < prefixes.length; i2++) {
      const prefixed = prefixes[i2] + name;
      if (prefixed in style2) {
        return prefixCache[rawName] = prefixed;
      }
    }
    return rawName;
  }
  const xlinkNS = "http://www.w3.org/1999/xlink";
  function patchAttr(el, key, value, isSVG, instance) {
    if (isSVG && key.startsWith("xlink:")) {
      if (value == null) {
        el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
      } else {
        el.setAttributeNS(xlinkNS, key, value);
      }
    } else {
      const isBoolean2 = isSpecialBooleanAttr(key);
      if (value == null || isBoolean2 && !includeBooleanAttr(value)) {
        el.removeAttribute(key);
      } else {
        el.setAttribute(key, isBoolean2 ? "" : value);
      }
    }
  }
  function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
    if (key === "innerHTML" || key === "textContent") {
      if (prevChildren) {
        unmountChildren(prevChildren, parentComponent, parentSuspense);
      }
      el[key] = value == null ? "" : value;
      return;
    }
    if (key === "value" && el.tagName !== "PROGRESS" && // custom elements may use _value internally
    !el.tagName.includes("-")) {
      el._value = value;
      const newValue = value == null ? "" : value;
      if (el.value !== newValue || // #4956: always set for OPTION elements because its value falls back to
      // textContent if no value attribute is present. And setting .value for
      // OPTION has no side effect
      el.tagName === "OPTION") {
        el.value = newValue;
      }
      if (value == null) {
        el.removeAttribute(key);
      }
      return;
    }
    let needRemove = false;
    if (value === "" || value == null) {
      const type = typeof el[key];
      if (type === "boolean") {
        value = includeBooleanAttr(value);
      } else if (value == null && type === "string") {
        value = "";
        needRemove = true;
      } else if (type === "number") {
        value = 0;
        needRemove = true;
      }
    }
    try {
      el[key] = value;
    } catch (e2) {
      if ({}.NODE_ENV !== "production" && !needRemove) {
        warn(`Failed setting prop "${key}" on <${el.tagName.toLowerCase()}>: value ${value} is invalid.`, e2);
      }
    }
    needRemove && el.removeAttribute(key);
  }
  function addEventListener(el, event, handler, options) {
    el.addEventListener(event, handler, options);
  }
  function removeEventListener(el, event, handler, options) {
    el.removeEventListener(event, handler, options);
  }
  function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
    const invokers = el._vei || (el._vei = {});
    const existingInvoker = invokers[rawName];
    if (nextValue && existingInvoker) {
      existingInvoker.value = nextValue;
    } else {
      const [name, options] = parseName(rawName);
      if (nextValue) {
        const invoker = invokers[rawName] = createInvoker(nextValue, instance);
        addEventListener(el, name, invoker, options);
      } else if (existingInvoker) {
        removeEventListener(el, name, existingInvoker, options);
        invokers[rawName] = void 0;
      }
    }
  }
  const optionsModifierRE = /(?:Once|Passive|Capture)$/;
  function parseName(name) {
    let options;
    if (optionsModifierRE.test(name)) {
      options = {};
      let m2;
      while (m2 = name.match(optionsModifierRE)) {
        name = name.slice(0, name.length - m2[0].length);
        options[m2[0].toLowerCase()] = true;
      }
    }
    const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
    return [event, options];
  }
  let cachedNow = 0;
  const p$4 = /* @__PURE__ */ Promise.resolve();
  const getNow = () => cachedNow || (p$4.then(() => cachedNow = 0), cachedNow = Date.now());
  function createInvoker(initialValue, instance) {
    const invoker = (e2) => {
      if (!e2._vts) {
        e2._vts = Date.now();
      } else if (e2._vts <= invoker.attached) {
        return;
      }
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e2, invoker.value), instance, 5, [e2]);
    };
    invoker.value = initialValue;
    invoker.attached = getNow();
    return invoker;
  }
  function patchStopImmediatePropagation(e2, value) {
    if (isArray(value)) {
      const originalStop = e2.stopImmediatePropagation;
      e2.stopImmediatePropagation = () => {
        originalStop.call(e2);
        e2._stopped = true;
      };
      return value.map((fn) => (e3) => !e3._stopped && fn && fn(e3));
    } else {
      return value;
    }
  }
  const nativeOnRE = /^on[a-z]/;
  const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
    if (key === "class") {
      patchClass(el, nextValue, isSVG);
    } else if (key === "style") {
      patchStyle(el, prevValue, nextValue);
    } else if (isOn(key)) {
      if (!isModelListener(key)) {
        patchEvent(el, key, prevValue, nextValue, parentComponent);
      }
    } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
      patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
    } else {
      if (key === "true-value") {
        el._trueValue = nextValue;
      } else if (key === "false-value") {
        el._falseValue = nextValue;
      }
      patchAttr(el, key, nextValue, isSVG);
    }
  };
  function shouldSetAsProp(el, key, value, isSVG) {
    if (isSVG) {
      if (key === "innerHTML" || key === "textContent") {
        return true;
      }
      if (key in el && nativeOnRE.test(key) && isFunction(value)) {
        return true;
      }
      return false;
    }
    if (key === "spellcheck" || key === "draggable" || key === "translate") {
      return false;
    }
    if (key === "form") {
      return false;
    }
    if (key === "list" && el.tagName === "INPUT") {
      return false;
    }
    if (key === "type" && el.tagName === "TEXTAREA") {
      return false;
    }
    if (nativeOnRE.test(key) && isString(value)) {
      return false;
    }
    return key in el;
  }
  const DOMTransitionPropsValidators = {
    name: String,
    type: String,
    css: {
      type: Boolean,
      default: true
    },
    duration: [String, Number, Object],
    enterFromClass: String,
    enterActiveClass: String,
    enterToClass: String,
    appearFromClass: String,
    appearActiveClass: String,
    appearToClass: String,
    leaveFromClass: String,
    leaveActiveClass: String,
    leaveToClass: String
  };
  /* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
  const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
  let renderer;
  function ensureRenderer() {
    return renderer || (renderer = createRenderer(rendererOptions));
  }
  const createApp = (...args) => {
    const app = ensureRenderer().createApp(...args);
    if ({}.NODE_ENV !== "production") {
      injectNativeTagCheck(app);
      injectCompilerOptionsCheck(app);
    }
    const { mount } = app;
    app.mount = (containerOrSelector) => {
      const container = normalizeContainer(containerOrSelector);
      if (!container)
        return;
      const component = app._component;
      if (!isFunction(component) && !component.render && !component.template) {
        component.template = container.innerHTML;
      }
      container.innerHTML = "";
      const proxy = mount(container, false, container instanceof SVGElement);
      if (container instanceof Element) {
        container.removeAttribute("v-cloak");
        container.setAttribute("data-v-app", "");
      }
      return proxy;
    };
    return app;
  };
  function injectNativeTagCheck(app) {
    Object.defineProperty(app.config, "isNativeTag", {
      value: (tag) => isHTMLTag(tag) || isSVGTag(tag),
      writable: false
    });
  }
  function injectCompilerOptionsCheck(app) {
    if (isRuntimeOnly()) {
      const isCustomElement = app.config.isCustomElement;
      Object.defineProperty(app.config, "isCustomElement", {
        get() {
          return isCustomElement;
        },
        set() {
          warn(`The \`isCustomElement\` config option is deprecated. Use \`compilerOptions.isCustomElement\` instead.`);
        }
      });
      const compilerOptions = app.config.compilerOptions;
      const msg = `The \`compilerOptions\` config option is only respected when using a build of Vue.js that includes the runtime compiler (aka "full build"). Since you are using the runtime-only build, \`compilerOptions\` must be passed to \`@vue/compiler-dom\` in the build setup instead.
- For vue-loader: pass it via vue-loader's \`compilerOptions\` loader option.
- For vue-cli: see https://cli.vuejs.org/guide/webpack.html#modifying-options-of-a-loader
- For vite: pass it via @vitejs/plugin-vue options. See https://github.com/vitejs/vite/tree/main/packages/plugin-vue#example-for-passing-options-to-vuecompiler-dom`;
      Object.defineProperty(app.config, "compilerOptions", {
        get() {
          warn(msg);
          return compilerOptions;
        },
        set() {
          warn(msg);
        }
      });
    }
  }
  function normalizeContainer(container) {
    if (isString(container)) {
      const res = document.querySelector(container);
      if ({}.NODE_ENV !== "production" && !res) {
        warn(`Failed to mount app: mount target selector "${container}" returned null.`);
      }
      return res;
    }
    if ({}.NODE_ENV !== "production" && window.ShadowRoot && container instanceof window.ShadowRoot && container.mode === "closed") {
      warn(`mounting on a ShadowRoot with \`{mode: "closed"}\` may lead to unpredictable bugs`);
    }
    return container;
  }
  function initDev() {
    {
      initCustomFormatter();
    }
  }
  if ({}.NODE_ENV !== "production") {
    initDev();
  }
  const style = "";
  const _withScopeId$1 = (n2) => (pushScopeId("data-v-e9dbdc2f"), n2 = n2(), popScopeId(), n2);
  const _hoisted_1$d = { class: "tw-flex tw-justify-center tw-items-center tw-h-full" };
  const _hoisted_2$b = {
    key: 0,
    "aria-hidden": "true",
    class: "button_loader tw-absolute tw-w-4 tw-h-4 tw-text-gray-100 tw-animate-spin tw-fill-primary-500",
    viewBox: "0 0 100 101",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  };
  const _hoisted_3$9 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("path", {
    d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
    fill: "currentColor"
  }, null, -1));
  const _hoisted_4$6 = /* @__PURE__ */ _withScopeId$1(() => /* @__PURE__ */ createBaseVNode("path", {
    d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
    fill: "currentFill"
  }, null, -1));
  const _hoisted_5$3 = [
    _hoisted_3$9,
    _hoisted_4$6
  ];
  const _sfc_main$d = /* @__PURE__ */ defineComponent({
    __name: "WPButton",
    props: {
      variant: {
        type: String,
        default: "primary"
      },
      as: {
        type: String,
        default: "button"
      },
      loading: {
        type: Boolean,
        default: false
      }
    },
    setup(__props) {
      const props = __props;
      const computedClasses = computed(() => {
        return {
          "button button-primary": props.variant === "primary",
          "button button-secondary": props.variant === "secondary",
          "button--loading": props.loading
        };
      });
      return (_ctx, _cache) => {
        return props.as === "button" ? (openBlock(), createElementBlock("button", {
          key: 0,
          class: normalizeClass(unref(computedClasses))
        }, [
          createBaseVNode("div", _hoisted_1$d, [
            renderSlot(_ctx.$slots, "default", {}, void 0, true),
            props.loading ? (openBlock(), createElementBlock("svg", _hoisted_2$b, _hoisted_5$3)) : createCommentVNode("", true)
          ])
        ], 2)) : props.as === "a" ? (openBlock(), createElementBlock("a", {
          key: 1,
          class: normalizeClass(unref(computedClasses))
        }, [
          renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ], 2)) : createCommentVNode("", true);
      };
    }
  });
  const WPButton_vue_vue_type_style_index_0_scoped_e9dbdc2f_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const WPButton = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-e9dbdc2f"]]);
  const _hoisted_1$c = ["for"];
  const _hoisted_2$a = {
    key: 0,
    class: "tw-relative tw-block tw-w-full tw-font-semibold"
  };
  const _hoisted_3$8 = {
    key: 1,
    class: "tw-relative tw-block tw-w-full tw-font-semibold"
  };
  const _hoisted_4$5 = { class: "tw-relative tw-block tw-w-full tw-mt-2" };
  const _sfc_main$c = /* @__PURE__ */ defineComponent({
    __name: "WPFormGroup",
    props: {
      title: {
        type: String,
        default: ""
      },
      description: {
        type: String,
        default: ""
      },
      for: {
        type: String,
        default: ""
      },
      state: {
        type: String,
        default: ""
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    setup(__props) {
      const props = __props;
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(["form-group input-text-wrap tw-relative tw-block tw-w-full", {
            "form-group--required": __props.required
          }])
        }, [
          props.title || _ctx.$slots.title ? (openBlock(), createElementBlock("label", {
            key: 0,
            class: "tw-relative tw-block tw-w-full tw-text-[13px]",
            for: props.for
          }, [
            props.title ? (openBlock(), createElementBlock("span", _hoisted_2$a, toDisplayString(props.title), 1)) : _ctx.$slots.title ? (openBlock(), createElementBlock("span", _hoisted_3$8, [
              renderSlot(_ctx.$slots, "title", {}, void 0, true)
            ])) : createCommentVNode("", true)
          ], 8, _hoisted_1$c)) : createCommentVNode("", true),
          props.description || _ctx.$slots.description ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: normalizeClass(["tw-relative tw-block tw-w-full tw-text-[12px] tw-font-normal tw-mt-1 tw-leading-tight", {
              "text-gray-700": props.state === "",
              "text-red-500": props.state === "error",
              "text-green-500": props.state === "success"
            }])
          }, [
            props.description ? (openBlock(), createElementBlock(Fragment, { key: 0 }, [
              createTextVNode(toDisplayString(props.description), 1)
            ], 64)) : _ctx.$slots.description ? renderSlot(_ctx.$slots, "description", { key: 1 }, void 0, true) : createCommentVNode("", true)
          ], 2)) : createCommentVNode("", true),
          createBaseVNode("div", _hoisted_4$5, [
            renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ])
        ], 2);
      };
    }
  });
  const WPFormGroup_vue_vue_type_style_index_0_scoped_d67ff485_lang = "";
  const WPFormGroup = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-d67ff485"]]);
  const _hoisted_1$b = ["value", "rows"];
  const _sfc_main$b = /* @__PURE__ */ defineComponent({
    __name: "WPTextarea",
    props: {
      value: {
        type: String,
        default: ""
      },
      rows: {
        type: Number,
        default: 4
      }
    },
    emits: ["change"],
    setup(__props, { emit: emit2 }) {
      const props = __props;
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("textarea", {
          value: props.value,
          class: "tw-relative tw-block tw-w-full !tw-p-[8px] tw-whitespace-pre-wrap",
          rows: props.rows,
          onInput: _cache[0] || (_cache[0] = (e2) => emit2("change", e2.target.value))
        }, null, 40, _hoisted_1$b);
      };
    }
  });
  function u$3(r2, n2, ...a2) {
    if (r2 in n2) {
      let e2 = n2[r2];
      return typeof e2 == "function" ? e2(...a2) : e2;
    }
    let t2 = new Error(`Tried to handle "${r2}" but there is no handler defined. Only defined handlers are: ${Object.keys(n2).map((e2) => `"${e2}"`).join(", ")}.`);
    throw Error.captureStackTrace && Error.captureStackTrace(t2, u$3), t2;
  }
  var N$2 = ((o2) => (o2[o2.None = 0] = "None", o2[o2.RenderStrategy = 1] = "RenderStrategy", o2[o2.Static = 2] = "Static", o2))(N$2 || {}), S$2 = ((e2) => (e2[e2.Unmount = 0] = "Unmount", e2[e2.Hidden = 1] = "Hidden", e2))(S$2 || {});
  function H$2({ visible: r2 = true, features: t2 = 0, ourProps: e2, theirProps: o2, ...i2 }) {
    var a2;
    let n2 = j(o2, e2), l2 = Object.assign(i2, { props: n2 });
    if (r2 || t2 & 2 && n2.static)
      return y$1(l2);
    if (t2 & 1) {
      let d2 = (a2 = n2.unmount) == null || a2 ? 0 : 1;
      return u$3(d2, { [0]() {
        return null;
      }, [1]() {
        return y$1({ ...i2, props: { ...n2, hidden: true, style: { display: "none" } } });
      } });
    }
    return y$1(l2);
  }
  function y$1({ props: r2, attrs: t2, slots: e2, slot: o2, name: i2 }) {
    var m2, h2;
    let { as: n2, ...l2 } = T$2(r2, ["unmount", "static"]), a2 = (m2 = e2.default) == null ? void 0 : m2.call(e2, o2), d2 = {};
    if (o2) {
      let u2 = false, c2 = [];
      for (let [p2, f2] of Object.entries(o2))
        typeof f2 == "boolean" && (u2 = true), f2 === true && c2.push(p2);
      u2 && (d2["data-headlessui-state"] = c2.join(" "));
    }
    if (n2 === "template") {
      if (a2 = b$1(a2 != null ? a2 : []), Object.keys(l2).length > 0 || Object.keys(t2).length > 0) {
        let [u2, ...c2] = a2 != null ? a2 : [];
        if (!v$1(u2) || c2.length > 0)
          throw new Error(['Passing props on "template"!', "", `The current component <${i2} /> is rendering a "template".`, "However we need to passthrough the following props:", Object.keys(l2).concat(Object.keys(t2)).map((s2) => s2.trim()).filter((s2, g2, R2) => R2.indexOf(s2) === g2).sort((s2, g2) => s2.localeCompare(g2)).map((s2) => `  - ${s2}`).join(`
`), "", "You can apply a few solutions:", ['Add an `as="..."` prop, to ensure that we render an actual element instead of a "template".', "Render a single element as the child so that we can forward the props onto that element."].map((s2) => `  - ${s2}`).join(`
`)].join(`
`));
        let p2 = j((h2 = u2.props) != null ? h2 : {}, l2), f2 = cloneVNode(u2, p2);
        for (let s2 in p2)
          s2.startsWith("on") && (f2.props || (f2.props = {}), f2.props[s2] = p2[s2]);
        return f2;
      }
      return Array.isArray(a2) && a2.length === 1 ? a2[0] : a2;
    }
    return h$1(n2, Object.assign({}, l2, d2), { default: () => a2 });
  }
  function b$1(r2) {
    return r2.flatMap((t2) => t2.type === Fragment ? b$1(t2.children) : [t2]);
  }
  function j(...r2) {
    if (r2.length === 0)
      return {};
    if (r2.length === 1)
      return r2[0];
    let t2 = {}, e2 = {};
    for (let i2 of r2)
      for (let n2 in i2)
        n2.startsWith("on") && typeof i2[n2] == "function" ? (e2[n2] != null || (e2[n2] = []), e2[n2].push(i2[n2])) : t2[n2] = i2[n2];
    if (t2.disabled || t2["aria-disabled"])
      return Object.assign(t2, Object.fromEntries(Object.keys(e2).map((i2) => [i2, void 0])));
    for (let i2 in e2)
      Object.assign(t2, { [i2](n2, ...l2) {
        let a2 = e2[i2];
        for (let d2 of a2) {
          if (n2 instanceof Event && n2.defaultPrevented)
            return;
          d2(n2, ...l2);
        }
      } });
    return t2;
  }
  function T$2(r2, t2 = []) {
    let e2 = Object.assign({}, r2);
    for (let o2 of t2)
      o2 in e2 && delete e2[o2];
    return e2;
  }
  function v$1(r2) {
    return r2 == null ? false : typeof r2.type == "string" || typeof r2.type == "object" || typeof r2.type == "function";
  }
  let e$1 = 0;
  function n$3() {
    return ++e$1;
  }
  function t$3() {
    return n$3();
  }
  var o$1 = ((r2) => (r2.Space = " ", r2.Enter = "Enter", r2.Escape = "Escape", r2.Backspace = "Backspace", r2.Delete = "Delete", r2.ArrowLeft = "ArrowLeft", r2.ArrowUp = "ArrowUp", r2.ArrowRight = "ArrowRight", r2.ArrowDown = "ArrowDown", r2.Home = "Home", r2.End = "End", r2.PageUp = "PageUp", r2.PageDown = "PageDown", r2.Tab = "Tab", r2))(o$1 || {});
  function o(n2) {
    var l2;
    return n2 == null || n2.value == null ? null : (l2 = n2.value.$el) != null ? l2 : n2.value;
  }
  let n$2 = Symbol("Context");
  var l$2 = ((e2) => (e2[e2.Open = 1] = "Open", e2[e2.Closed = 2] = "Closed", e2[e2.Closing = 4] = "Closing", e2[e2.Opening = 8] = "Opening", e2))(l$2 || {});
  function C() {
    return p$3() !== null;
  }
  function p$3() {
    return inject(n$2, null);
  }
  function c$3(o2) {
    provide(n$2, o2);
  }
  var i$1 = Object.defineProperty;
  var d$4 = (t2, e2, r2) => e2 in t2 ? i$1(t2, e2, { enumerable: true, configurable: true, writable: true, value: r2 }) : t2[e2] = r2;
  var n$1 = (t2, e2, r2) => (d$4(t2, typeof e2 != "symbol" ? e2 + "" : e2, r2), r2);
  class s {
    constructor() {
      n$1(this, "current", this.detect());
      n$1(this, "currentId", 0);
    }
    set(e2) {
      this.current !== e2 && (this.currentId = 0, this.current = e2);
    }
    reset() {
      this.set(this.detect());
    }
    nextId() {
      return ++this.currentId;
    }
    get isServer() {
      return this.current === "server";
    }
    get isClient() {
      return this.current === "client";
    }
    detect() {
      return typeof window == "undefined" || typeof document == "undefined" ? "server" : "client";
    }
  }
  let c$2 = new s();
  function m$3(r2) {
    if (c$2.isServer)
      return null;
    if (r2 instanceof Node)
      return r2.ownerDocument;
    if (r2 != null && r2.hasOwnProperty("value")) {
      let n2 = o(r2);
      if (n2)
        return n2.ownerDocument;
    }
    return document;
  }
  let f$1 = ["[contentEditable=true]", "[tabindex]", "a[href]", "area[href]", "button:not([disabled])", "iframe", "input:not([disabled])", "select:not([disabled])", "textarea:not([disabled])"].map((e2) => `${e2}:not([tabindex='-1'])`).join(",");
  var N$1 = ((r2) => (r2[r2.First = 1] = "First", r2[r2.Previous = 2] = "Previous", r2[r2.Next = 4] = "Next", r2[r2.Last = 8] = "Last", r2[r2.WrapAround = 16] = "WrapAround", r2[r2.NoScroll = 32] = "NoScroll", r2))(N$1 || {}), T$1 = ((o2) => (o2[o2.Error = 0] = "Error", o2[o2.Overflow = 1] = "Overflow", o2[o2.Success = 2] = "Success", o2[o2.Underflow = 3] = "Underflow", o2))(T$1 || {}), h = ((n2) => (n2[n2.Previous = -1] = "Previous", n2[n2.Next = 1] = "Next", n2))(h || {});
  function d$3(e2 = document.body) {
    return e2 == null ? [] : Array.from(e2.querySelectorAll(f$1)).sort((t2, n2) => Math.sign((t2.tabIndex || Number.MAX_SAFE_INTEGER) - (n2.tabIndex || Number.MAX_SAFE_INTEGER)));
  }
  var F$1 = ((n2) => (n2[n2.Strict = 0] = "Strict", n2[n2.Loose = 1] = "Loose", n2))(F$1 || {});
  function S$1(e2, t2 = 0) {
    var n2;
    return e2 === ((n2 = m$3(e2)) == null ? void 0 : n2.body) ? false : u$3(t2, { [0]() {
      return e2.matches(f$1);
    }, [1]() {
      let l2 = e2;
      for (; l2 !== null; ) {
        if (l2.matches(f$1))
          return true;
        l2 = l2.parentElement;
      }
      return false;
    } });
  }
  function H$1(e2) {
    e2 == null || e2.focus({ preventScroll: true });
  }
  let w$1 = ["textarea", "input"].join(",");
  function A$1(e2) {
    var t2, n2;
    return (n2 = (t2 = e2 == null ? void 0 : e2.matches) == null ? void 0 : t2.call(e2, w$1)) != null ? n2 : false;
  }
  function I$1(e2, t2 = (n2) => n2) {
    return e2.slice().sort((n2, l2) => {
      let o2 = t2(n2), i2 = t2(l2);
      if (o2 === null || i2 === null)
        return 0;
      let r2 = o2.compareDocumentPosition(i2);
      return r2 & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : r2 & Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0;
    });
  }
  function O$1(e2, t2, { sorted: n2 = true, relativeTo: l2 = null, skipElements: o2 = [] } = {}) {
    var m2;
    let i2 = (m2 = Array.isArray(e2) ? e2.length > 0 ? e2[0].ownerDocument : document : e2 == null ? void 0 : e2.ownerDocument) != null ? m2 : document, r2 = Array.isArray(e2) ? n2 ? I$1(e2) : e2 : d$3(e2);
    o2.length > 0 && r2.length > 1 && (r2 = r2.filter((s2) => !o2.includes(s2))), l2 = l2 != null ? l2 : i2.activeElement;
    let x2 = (() => {
      if (t2 & 5)
        return 1;
      if (t2 & 10)
        return -1;
      throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })(), p2 = (() => {
      if (t2 & 1)
        return 0;
      if (t2 & 2)
        return Math.max(0, r2.indexOf(l2)) - 1;
      if (t2 & 4)
        return Math.max(0, r2.indexOf(l2)) + 1;
      if (t2 & 8)
        return r2.length - 1;
      throw new Error("Missing Focus.First, Focus.Previous, Focus.Next or Focus.Last");
    })(), M2 = t2 & 32 ? { preventScroll: true } : {}, c2 = 0, a2 = r2.length, u2;
    do {
      if (c2 >= a2 || c2 + a2 <= 0)
        return 0;
      let s2 = p2 + c2;
      if (t2 & 16)
        s2 = (s2 + a2) % a2;
      else {
        if (s2 < 0)
          return 3;
        if (s2 >= a2)
          return 1;
      }
      u2 = r2[s2], u2 == null || u2.focus(M2), c2 += x2;
    } while (u2 !== i2.activeElement);
    return t2 & 6 && A$1(u2) && u2.select(), u2.hasAttribute("tabindex") || u2.setAttribute("tabindex", "0"), 2;
  }
  function u$2(e2, t2, n2) {
    c$2.isServer || watchEffect((o2) => {
      document.addEventListener(e2, t2, n2), o2(() => document.removeEventListener(e2, t2, n2));
    });
  }
  function y(f2, m2, i2 = computed(() => true)) {
    function a2(e2, u2) {
      if (!i2.value || e2.defaultPrevented)
        return;
      let n2 = u2(e2);
      if (n2 === null || !n2.getRootNode().contains(n2))
        return;
      let c2 = function o2(t2) {
        return typeof t2 == "function" ? o2(t2()) : Array.isArray(t2) || t2 instanceof Set ? t2 : [t2];
      }(f2);
      for (let o$12 of c2) {
        if (o$12 === null)
          continue;
        let t2 = o$12 instanceof HTMLElement ? o$12 : o(o$12);
        if (t2 != null && t2.contains(n2) || e2.composed && e2.composedPath().includes(t2))
          return;
      }
      return !S$1(n2, F$1.Loose) && n2.tabIndex !== -1 && e2.preventDefault(), m2(e2, n2);
    }
    let r2 = ref(null);
    u$2("mousedown", (e2) => {
      var u2, n2;
      i2.value && (r2.value = ((n2 = (u2 = e2.composedPath) == null ? void 0 : u2.call(e2)) == null ? void 0 : n2[0]) || e2.target);
    }, true), u$2("click", (e2) => {
      r2.value && (a2(e2, () => r2.value), r2.value = null);
    }, true), u$2("blur", (e2) => a2(e2, () => window.document.activeElement instanceof HTMLIFrameElement ? window.document.activeElement : null), true);
  }
  var a$2 = ((e2) => (e2[e2.None = 1] = "None", e2[e2.Focusable = 2] = "Focusable", e2[e2.Hidden = 4] = "Hidden", e2))(a$2 || {});
  let f = defineComponent({ name: "Hidden", props: { as: { type: [Object, String], default: "div" }, features: { type: Number, default: 1 } }, setup(r2, { slots: t2, attrs: d2 }) {
    return () => {
      let { features: e2, ...o2 } = r2, n2 = { "aria-hidden": (e2 & 2) === 2 ? true : void 0, style: { position: "fixed", top: 1, left: 1, width: 1, height: 0, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0, 0, 0, 0)", whiteSpace: "nowrap", borderWidth: "0", ...(e2 & 4) === 4 && (e2 & 2) !== 2 && { display: "none" } } };
      return H$2({ ourProps: n2, theirProps: o2, slot: {}, attrs: d2, slots: t2, name: "Hidden" });
    };
  } });
  function t$2() {
    return /iPhone/gi.test(window.navigator.platform) || /Mac/gi.test(window.navigator.platform) && window.navigator.maxTouchPoints > 0;
  }
  function w(e2, n2, t2) {
    c$2.isServer || watchEffect((o2) => {
      window.addEventListener(e2, n2, t2), o2(() => window.removeEventListener(e2, n2, t2));
    });
  }
  var d$2 = ((r2) => (r2[r2.Forwards = 0] = "Forwards", r2[r2.Backwards = 1] = "Backwards", r2))(d$2 || {});
  function n() {
    let o2 = ref(0);
    return w("keydown", (e2) => {
      e2.key === "Tab" && (o2.value = e2.shiftKey ? 1 : 0);
    }), o2;
  }
  function E$2(n2, e2, o2, r2) {
    c$2.isServer || watchEffect((t2) => {
      n2 = n2 != null ? n2 : window, n2.addEventListener(e2, o2, r2), t2(() => n2.removeEventListener(e2, o2, r2));
    });
  }
  function t$1(e2) {
    typeof queueMicrotask == "function" ? queueMicrotask(e2) : Promise.resolve().then(e2).catch((o2) => setTimeout(() => {
      throw o2;
    }));
  }
  function B(e2) {
    if (!e2)
      return /* @__PURE__ */ new Set();
    if (typeof e2 == "function")
      return new Set(e2());
    let t2 = /* @__PURE__ */ new Set();
    for (let l2 of e2.value) {
      let o$12 = o(l2);
      o$12 instanceof HTMLElement && t2.add(o$12);
    }
    return t2;
  }
  var A = ((n2) => (n2[n2.None = 1] = "None", n2[n2.InitialFocus = 2] = "InitialFocus", n2[n2.TabLock = 4] = "TabLock", n2[n2.FocusLock = 8] = "FocusLock", n2[n2.RestoreFocus = 16] = "RestoreFocus", n2[n2.All = 30] = "All", n2))(A || {});
  let ie = Object.assign(defineComponent({ name: "FocusTrap", props: { as: { type: [Object, String], default: "div" }, initialFocus: { type: Object, default: null }, features: { type: Number, default: 30 }, containers: { type: [Object, Function], default: ref(/* @__PURE__ */ new Set()) } }, inheritAttrs: false, setup(e2, { attrs: t2, slots: l2, expose: o$12 }) {
    let r2 = ref(null);
    o$12({ el: r2, $el: r2 });
    let i2 = computed(() => m$3(r2)), n$12 = ref(false);
    onMounted(() => n$12.value = true), onUnmounted(() => n$12.value = false), x$1({ ownerDocument: i2 }, computed(() => n$12.value && Boolean(e2.features & 16)));
    let m2 = z({ ownerDocument: i2, container: r2, initialFocus: computed(() => e2.initialFocus) }, computed(() => n$12.value && Boolean(e2.features & 2)));
    J$1({ ownerDocument: i2, container: r2, containers: e2.containers, previousActiveElement: m2 }, computed(() => n$12.value && Boolean(e2.features & 8)));
    let f$12 = n();
    function u2(a2) {
      let d2 = o(r2);
      if (!d2)
        return;
      ((R2) => R2())(() => {
        u$3(f$12.value, { [d$2.Forwards]: () => {
          O$1(d2, N$1.First, { skipElements: [a2.relatedTarget] });
        }, [d$2.Backwards]: () => {
          O$1(d2, N$1.Last, { skipElements: [a2.relatedTarget] });
        } });
      });
    }
    let s2 = ref(false);
    function H2(a2) {
      a2.key === "Tab" && (s2.value = true, requestAnimationFrame(() => {
        s2.value = false;
      }));
    }
    function M2(a2) {
      if (!n$12.value)
        return;
      let d2 = B(e2.containers);
      o(r2) instanceof HTMLElement && d2.add(o(r2));
      let E2 = a2.relatedTarget;
      E2 instanceof HTMLElement && E2.dataset.headlessuiFocusGuard !== "true" && (N(d2, E2) || (s2.value ? O$1(o(r2), u$3(f$12.value, { [d$2.Forwards]: () => N$1.Next, [d$2.Backwards]: () => N$1.Previous }) | N$1.WrapAround, { relativeTo: a2.target }) : a2.target instanceof HTMLElement && H$1(a2.target)));
    }
    return () => {
      let a2 = {}, d2 = { ref: r2, onKeydown: H2, onFocusout: M2 }, { features: E2, initialFocus: R2, containers: Q2, ...O2 } = e2;
      return h$1(Fragment, [Boolean(E2 & 4) && h$1(f, { as: "button", type: "button", "data-headlessui-focus-guard": true, onFocus: u2, features: a$2.Focusable }), H$2({ ourProps: d2, theirProps: { ...t2, ...O2 }, slot: a2, attrs: t2, slots: l2, name: "FocusTrap" }), Boolean(E2 & 4) && h$1(f, { as: "button", type: "button", "data-headlessui-focus-guard": true, onFocus: u2, features: a$2.Focusable })]);
    };
  } }), { features: A }), L$2 = [];
  if (typeof window != "undefined" && typeof document != "undefined") {
    let e2 = function(t2) {
      t2.target instanceof HTMLElement && t2.target !== document.body && L$2[0] !== t2.target && (L$2.unshift(t2.target), L$2 = L$2.filter((l2) => l2 != null && l2.isConnected), L$2.splice(10));
    };
    window.addEventListener("click", e2, { capture: true }), window.addEventListener("mousedown", e2, { capture: true }), window.addEventListener("focus", e2, { capture: true }), document.body.addEventListener("click", e2, { capture: true }), document.body.addEventListener("mousedown", e2, { capture: true }), document.body.addEventListener("focus", e2, { capture: true });
  }
  function $(e2) {
    let t2 = ref(L$2.slice());
    return watch([e2], ([l2], [o2]) => {
      o2 === true && l2 === false ? t$1(() => {
        t2.value.splice(0);
      }) : o2 === false && l2 === true && (t2.value = L$2.slice());
    }, { flush: "post" }), () => {
      var l2;
      return (l2 = t2.value.find((o2) => o2 != null && o2.isConnected)) != null ? l2 : null;
    };
  }
  function x$1({ ownerDocument: e2 }, t2) {
    let l2 = $(t2);
    onMounted(() => {
      watchEffect(() => {
        var o2, r2;
        t2.value || ((o2 = e2.value) == null ? void 0 : o2.activeElement) === ((r2 = e2.value) == null ? void 0 : r2.body) && H$1(l2());
      }, { flush: "post" });
    }), onUnmounted(() => {
      H$1(l2());
    });
  }
  function z({ ownerDocument: e2, container: t2, initialFocus: l2 }, o$12) {
    let r2 = ref(null), i2 = ref(false);
    return onMounted(() => i2.value = true), onUnmounted(() => i2.value = false), onMounted(() => {
      watch([t2, l2, o$12], (n2, m2) => {
        if (n2.every((u2, s2) => (m2 == null ? void 0 : m2[s2]) === u2) || !o$12.value)
          return;
        let f2 = o(t2);
        f2 && t$1(() => {
          var H2, M2;
          if (!i2.value)
            return;
          let u2 = o(l2), s2 = (H2 = e2.value) == null ? void 0 : H2.activeElement;
          if (u2) {
            if (u2 === s2) {
              r2.value = s2;
              return;
            }
          } else if (f2.contains(s2)) {
            r2.value = s2;
            return;
          }
          u2 ? H$1(u2) : O$1(f2, N$1.First | N$1.NoScroll) === T$1.Error && console.warn("There are no focusable elements inside the <FocusTrap />"), r2.value = (M2 = e2.value) == null ? void 0 : M2.activeElement;
        });
      }, { immediate: true, flush: "post" });
    }), r2;
  }
  function J$1({ ownerDocument: e2, container: t2, containers: l2, previousActiveElement: o$12 }, r2) {
    var i2;
    E$2((i2 = e2.value) == null ? void 0 : i2.defaultView, "focus", (n2) => {
      if (!r2.value)
        return;
      let m2 = B(l2);
      o(t2) instanceof HTMLElement && m2.add(o(t2));
      let f2 = o$12.value;
      if (!f2)
        return;
      let u2 = n2.target;
      u2 && u2 instanceof HTMLElement ? N(m2, u2) ? (o$12.value = u2, H$1(u2)) : (n2.preventDefault(), n2.stopPropagation(), H$1(f2)) : H$1(o$12.value);
    }, true);
  }
  function N(e2, t2) {
    for (let l2 of e2)
      if (l2.contains(t2))
        return true;
    return false;
  }
  let i = /* @__PURE__ */ new Map(), t = /* @__PURE__ */ new Map();
  function E$1(d2, f2 = ref(true)) {
    watchEffect((o$12) => {
      var a2;
      if (!f2.value)
        return;
      let e2 = o(d2);
      if (!e2)
        return;
      o$12(function() {
        var u2;
        if (!e2)
          return;
        let r2 = (u2 = t.get(e2)) != null ? u2 : 1;
        if (r2 === 1 ? t.delete(e2) : t.set(e2, r2 - 1), r2 !== 1)
          return;
        let n2 = i.get(e2);
        n2 && (n2["aria-hidden"] === null ? e2.removeAttribute("aria-hidden") : e2.setAttribute("aria-hidden", n2["aria-hidden"]), e2.inert = n2.inert, i.delete(e2));
      });
      let l2 = (a2 = t.get(e2)) != null ? a2 : 0;
      t.set(e2, l2 + 1), l2 === 0 && (i.set(e2, { "aria-hidden": e2.getAttribute("aria-hidden"), inert: e2.inert }), e2.setAttribute("aria-hidden", "true"), e2.inert = true);
    });
  }
  let e = Symbol("ForcePortalRootContext");
  function u$1() {
    return inject(e, false);
  }
  let P = defineComponent({ name: "ForcePortalRoot", props: { as: { type: [Object, String], default: "template" }, force: { type: Boolean, default: false } }, setup(o2, { slots: t2, attrs: r2 }) {
    return provide(e, o2.force), () => {
      let { force: f2, ...n2 } = o2;
      return H$2({ theirProps: n2, ourProps: {}, slot: {}, slots: t2, attrs: r2, name: "ForcePortalRoot" });
    };
  } });
  function c$1(t2) {
    let r2 = m$3(t2);
    if (!r2) {
      if (t2 === null)
        return null;
      throw new Error(`[Headless UI]: Cannot find ownerDocument for contextElement: ${t2}`);
    }
    let o2 = r2.getElementById("headlessui-portal-root");
    if (o2)
      return o2;
    let e2 = r2.createElement("div");
    return e2.setAttribute("id", "headlessui-portal-root"), r2.body.appendChild(e2);
  }
  let R$1 = defineComponent({ name: "Portal", props: { as: { type: [Object, String], default: "div" } }, setup(t2, { slots: r2, attrs: o2 }) {
    let e2 = ref(null), p2 = computed(() => m$3(e2)), n2 = u$1(), u2 = inject(g$1, null), l2 = ref(n2 === true || u2 == null ? c$1(e2.value) : u2.resolveTarget());
    return watchEffect(() => {
      n2 || u2 != null && (l2.value = u2.resolveTarget());
    }), onUnmounted(() => {
      var i2, m2;
      let a2 = (i2 = p2.value) == null ? void 0 : i2.getElementById("headlessui-portal-root");
      a2 && l2.value === a2 && l2.value.children.length <= 0 && ((m2 = l2.value.parentElement) == null || m2.removeChild(l2.value));
    }), () => {
      if (l2.value === null)
        return null;
      let a2 = { ref: e2, "data-headlessui-portal": "" };
      return h$1(Teleport, { to: l2.value }, H$2({ ourProps: a2, theirProps: t2, slot: {}, attrs: o2, slots: r2, name: "Portal" }));
    };
  } }), g$1 = Symbol("PortalGroupContext"), L$1 = defineComponent({ name: "PortalGroup", props: { as: { type: [Object, String], default: "template" }, target: { type: Object, default: null } }, setup(t2, { attrs: r2, slots: o2 }) {
    let e2 = reactive({ resolveTarget() {
      return t2.target;
    } });
    return provide(g$1, e2), () => {
      let { target: p2, ...n2 } = t2;
      return H$2({ theirProps: n2, ourProps: {}, slot: {}, attrs: r2, slots: o2, name: "PortalGroup" });
    };
  } });
  let u = Symbol("StackContext");
  var p$2 = ((e2) => (e2[e2.Add = 0] = "Add", e2[e2.Remove = 1] = "Remove", e2))(p$2 || {});
  function v() {
    return inject(u, () => {
    });
  }
  function S({ type: o2, enabled: r2, element: e2, onUpdate: i2 }) {
    let a2 = v();
    function t2(...n2) {
      i2 == null || i2(...n2), a2(...n2);
    }
    onMounted(() => {
      watch(r2, (n2, d2) => {
        n2 ? t2(0, o2, e2) : d2 === true && t2(1, o2, e2);
      }, { immediate: true, flush: "sync" });
    }), onUnmounted(() => {
      r2.value && t2(1, o2, e2);
    }), provide(u, t2);
  }
  let p$1 = Symbol("DescriptionContext");
  function b() {
    let t2 = inject(p$1, null);
    if (t2 === null)
      throw new Error("Missing parent");
    return t2;
  }
  function M({ slot: t2 = ref({}), name: i2 = "Description", props: o2 = {} } = {}) {
    let e2 = ref([]);
    function s2(n2) {
      return e2.value.push(n2), () => {
        let r2 = e2.value.indexOf(n2);
        r2 !== -1 && e2.value.splice(r2, 1);
      };
    }
    return provide(p$1, { register: s2, slot: t2, name: i2, props: o2 }), computed(() => e2.value.length > 0 ? e2.value.join(" ") : void 0);
  }
  defineComponent({ name: "Description", props: { as: { type: [Object, String], default: "p" }, id: { type: String, default: () => `headlessui-description-${t$3()}` } }, setup(t2, { attrs: i2, slots: o2 }) {
    let e2 = b();
    return onMounted(() => onUnmounted(e2.register(t2.id))), () => {
      let { name: s2 = "Description", slot: n2 = ref({}), props: r2 = {} } = e2, { id: d2, ...l2 } = t2, c2 = { ...Object.entries(r2).reduce((f2, [a2, g2]) => Object.assign(f2, { [a2]: unref(g2) }), {}), id: d2 };
      return H$2({ ourProps: c2, theirProps: l2, slot: n2.value, attrs: i2, slots: o2, name: s2 });
    };
  } });
  function m$2(t2) {
    let e2 = shallowRef(t2.getSnapshot());
    return onUnmounted(t2.subscribe(() => {
      e2.value = t2.getSnapshot();
    })), e2;
  }
  function r() {
    let n2 = [], s2 = { addEventListener(e2, t2, i2, a2) {
      return e2.addEventListener(t2, i2, a2), s2.add(() => e2.removeEventListener(t2, i2, a2));
    }, requestAnimationFrame(...e2) {
      let t2 = requestAnimationFrame(...e2);
      s2.add(() => cancelAnimationFrame(t2));
    }, nextFrame(...e2) {
      s2.requestAnimationFrame(() => {
        s2.requestAnimationFrame(...e2);
      });
    }, setTimeout(...e2) {
      let t2 = setTimeout(...e2);
      s2.add(() => clearTimeout(t2));
    }, style(e2, t2, i2) {
      let a2 = e2.style.getPropertyValue(t2);
      return Object.assign(e2.style, { [t2]: i2 }), this.add(() => {
        Object.assign(e2.style, { [t2]: a2 });
      });
    }, group(e2) {
      let t2 = r();
      return e2(t2), this.add(() => t2.dispose());
    }, add(e2) {
      return n2.push(e2), () => {
        let t2 = n2.indexOf(e2);
        if (t2 >= 0)
          for (let i2 of n2.splice(t2, 1))
            i2();
      };
    }, dispose() {
      for (let e2 of n2.splice(0))
        e2();
    } };
    return s2;
  }
  function a$1(o2, r2) {
    let t2 = o2(), n2 = /* @__PURE__ */ new Set();
    return { getSnapshot() {
      return t2;
    }, subscribe(e2) {
      return n2.add(e2), () => n2.delete(e2);
    }, dispatch(e2, ...s2) {
      let i2 = r2[e2].call(t2, ...s2);
      i2 && (t2 = i2, n2.forEach((c2) => c2()));
    } };
  }
  function c() {
    let o2;
    return { before({ doc: e2 }) {
      var l2;
      let n2 = e2.documentElement;
      o2 = ((l2 = e2.defaultView) != null ? l2 : window).innerWidth - n2.clientWidth;
    }, after({ doc: e2, d: n2 }) {
      let t2 = e2.documentElement, l2 = t2.clientWidth - t2.offsetWidth, r2 = o2 - l2;
      n2.style(t2, "paddingRight", `${r2}px`);
    } };
  }
  function p() {
    if (!t$2())
      return {};
    let o2;
    return { before() {
      o2 = window.pageYOffset;
    }, after({ doc: r2, d: l2, meta: s2 }) {
      function i2(e2) {
        return s2.containers.flatMap((t2) => t2()).some((t2) => t2.contains(e2));
      }
      l2.style(r2.body, "marginTop", `-${o2}px`), window.scrollTo(0, 0);
      let n2 = null;
      l2.addEventListener(r2, "click", (e2) => {
        if (e2.target instanceof HTMLElement)
          try {
            let t2 = e2.target.closest("a");
            if (!t2)
              return;
            let { hash: c2 } = new URL(t2.href), a2 = r2.querySelector(c2);
            a2 && !i2(a2) && (n2 = a2);
          } catch {
          }
      }, true), l2.addEventListener(r2, "touchmove", (e2) => {
        e2.target instanceof HTMLElement && !i2(e2.target) && e2.preventDefault();
      }, { passive: false }), l2.add(() => {
        window.scrollTo(0, window.pageYOffset + o2), n2 && n2.isConnected && (n2.scrollIntoView({ block: "nearest" }), n2 = null);
      });
    } };
  }
  function l$1() {
    return { before({ doc: e2, d: o2 }) {
      o2.style(e2.documentElement, "overflow", "hidden");
    } };
  }
  function m$1(e2) {
    let n2 = {};
    for (let t2 of e2)
      Object.assign(n2, t2(n2));
    return n2;
  }
  let a = a$1(() => /* @__PURE__ */ new Map(), { PUSH(e2, n2) {
    var o2;
    let t2 = (o2 = this.get(e2)) != null ? o2 : { doc: e2, count: 0, d: r(), meta: /* @__PURE__ */ new Set() };
    return t2.count++, t2.meta.add(n2), this.set(e2, t2), this;
  }, POP(e2, n2) {
    let t2 = this.get(e2);
    return t2 && (t2.count--, t2.meta.delete(n2)), this;
  }, SCROLL_PREVENT({ doc: e2, d: n2, meta: t2 }) {
    let o2 = { doc: e2, d: n2, meta: m$1(t2) }, c$12 = [p(), c(), l$1()];
    c$12.forEach(({ before: r2 }) => r2 == null ? void 0 : r2(o2)), c$12.forEach(({ after: r2 }) => r2 == null ? void 0 : r2(o2));
  }, SCROLL_ALLOW({ d: e2 }) {
    e2.dispose();
  }, TEARDOWN({ doc: e2 }) {
    this.delete(e2);
  } });
  a.subscribe(() => {
    let e2 = a.getSnapshot(), n2 = /* @__PURE__ */ new Map();
    for (let [t2] of e2)
      n2.set(t2, t2.documentElement.style.overflow);
    for (let t2 of e2.values()) {
      let o2 = n2.get(t2.doc) === "hidden", c2 = t2.count !== 0;
      (c2 && !o2 || !c2 && o2) && a.dispatch(t2.count > 0 ? "SCROLL_PREVENT" : "SCROLL_ALLOW", t2), t2.count === 0 && a.dispatch("TEARDOWN", t2);
    }
  });
  function d$1(t2, a$12, n2) {
    let i2 = m$2(a), l2 = computed(() => {
      let e2 = t2.value ? i2.value.get(t2.value) : void 0;
      return e2 ? e2.count > 0 : false;
    });
    return watch([t2, a$12], ([e2, m2], [r2], o2) => {
      if (!e2 || !m2)
        return;
      a.dispatch("PUSH", e2, n2);
      let f2 = false;
      o2(() => {
        f2 || (a.dispatch("POP", r2 != null ? r2 : e2, n2), f2 = true);
      });
    }, { immediate: true }), l2;
  }
  var ye = ((l2) => (l2[l2.Open = 0] = "Open", l2[l2.Closed = 1] = "Closed", l2))(ye || {});
  let I = Symbol("DialogContext");
  function E(r2) {
    let n2 = inject(I, null);
    if (n2 === null) {
      let l2 = new Error(`<${r2} /> is missing a parent <Dialog /> component.`);
      throw Error.captureStackTrace && Error.captureStackTrace(l2, E), l2;
    }
    return n2;
  }
  let H = "DC8F892D-2EBD-447C-A4C8-A03058436FF4", qe = defineComponent({ name: "Dialog", inheritAttrs: false, props: { as: { type: [Object, String], default: "div" }, static: { type: Boolean, default: false }, unmount: { type: Boolean, default: true }, open: { type: [Boolean, String], default: H }, initialFocus: { type: Object, default: null }, id: { type: String, default: () => `headlessui-dialog-${t$3()}` } }, emits: { close: (r2) => true }, setup(r2, { emit: n2, attrs: l2, slots: p2, expose: i2 }) {
    var N2;
    let a2 = ref(false);
    onMounted(() => {
      a2.value = true;
    });
    let f$12 = ref(0), d2 = p$3(), m2 = computed(() => r2.open === H && d2 !== null ? (d2.value & l$2.Open) === l$2.Open : r2.open), v2 = ref(null), R2 = ref(null), O2 = computed(() => m$3(v2));
    if (i2({ el: v2, $el: v2 }), !(r2.open !== H || d2 !== null))
      throw new Error("You forgot to provide an `open` prop to the `Dialog`.");
    if (typeof m2.value != "boolean")
      throw new Error(`You provided an \`open\` prop to the \`Dialog\`, but the value is not a boolean. Received: ${m2.value === H ? void 0 : r2.open}`);
    let c2 = computed(() => a2.value && m2.value ? 0 : 1), k = computed(() => c2.value === 0), w2 = computed(() => f$12.value > 1), $2 = inject(I, null) !== null, G = computed(() => w2.value ? "parent" : "leaf"), j2 = computed(() => d2 !== null ? (d2.value & l$2.Closing) === l$2.Closing : false), V = computed(() => $2 || j2.value ? false : k.value), J2 = computed(() => {
      var e2, t2, u2;
      return (u2 = Array.from((t2 = (e2 = O2.value) == null ? void 0 : e2.querySelectorAll("body > *")) != null ? t2 : []).find((s2) => s2.id === "headlessui-portal-root" ? false : s2.contains(o(R2)) && s2 instanceof HTMLElement)) != null ? u2 : null;
    });
    E$1(J2, V);
    let Q2 = computed(() => w2.value ? true : k.value), W = computed(() => {
      var e2, t2, u2;
      return (u2 = Array.from((t2 = (e2 = O2.value) == null ? void 0 : e2.querySelectorAll("[data-headlessui-portal]")) != null ? t2 : []).find((s2) => s2.contains(o(R2)) && s2 instanceof HTMLElement)) != null ? u2 : null;
    });
    E$1(W, Q2), S({ type: "Dialog", enabled: computed(() => c2.value === 0), element: v2, onUpdate: (e2, t2) => {
      if (t2 === "Dialog")
        return u$3(e2, { [p$2.Add]: () => f$12.value += 1, [p$2.Remove]: () => f$12.value -= 1 });
    } });
    let X = M({ name: "DialogDescription", slot: computed(() => ({ open: m2.value })) }), M$1 = ref(null), y$12 = { titleId: M$1, panelRef: ref(null), dialogState: c2, setTitleId(e2) {
      M$1.value !== e2 && (M$1.value = e2);
    }, close() {
      n2("close", false);
    } };
    provide(I, y$12);
    function x2() {
      var t2, u2, s2;
      return [...Array.from((u2 = (t2 = O2.value) == null ? void 0 : t2.querySelectorAll("html > *, body > *, [data-headlessui-portal]")) != null ? u2 : []).filter((g2) => !(g2 === document.body || g2 === document.head || !(g2 instanceof HTMLElement) || g2.contains(o(R2)) || y$12.panelRef.value && g2.contains(y$12.panelRef.value))), (s2 = y$12.panelRef.value) != null ? s2 : v2.value];
    }
    let Z = computed(() => !(!k.value || w2.value));
    y(() => x2(), (e2, t2) => {
      y$12.close(), nextTick(() => t2 == null ? void 0 : t2.focus());
    }, Z);
    let ee = computed(() => !(w2.value || c2.value !== 0));
    E$2((N2 = O2.value) == null ? void 0 : N2.defaultView, "keydown", (e2) => {
      ee.value && (e2.defaultPrevented || e2.key === o$1.Escape && (e2.preventDefault(), e2.stopPropagation(), y$12.close()));
    });
    let te = computed(() => !(j2.value || c2.value !== 0 || $2));
    return d$1(O2, te, (e2) => {
      var t2;
      return { containers: [...(t2 = e2.containers) != null ? t2 : [], x2] };
    }), watchEffect((e2) => {
      if (c2.value !== 0)
        return;
      let t2 = o(v2);
      if (!t2)
        return;
      let u2 = new ResizeObserver((s2) => {
        for (let g2 of s2) {
          let h2 = g2.target.getBoundingClientRect();
          h2.x === 0 && h2.y === 0 && h2.width === 0 && h2.height === 0 && y$12.close();
        }
      });
      u2.observe(t2), e2(() => u2.disconnect());
    }), () => {
      let { id: e2, open: t2, initialFocus: u2, ...s2 } = r2, g2 = { ...l2, ref: v2, id: e2, role: "dialog", "aria-modal": c2.value === 0 ? true : void 0, "aria-labelledby": M$1.value, "aria-describedby": X.value }, h2 = { open: c2.value === 0 };
      return h$1(P, { force: true }, () => [h$1(R$1, () => h$1(L$1, { target: v2.value }, () => h$1(P, { force: false }, () => h$1(ie, { initialFocus: u2, containers: x2, features: k.value ? u$3(G.value, { parent: ie.features.RestoreFocus, leaf: ie.features.All & ~ie.features.FocusLock }) : ie.features.None }, () => H$2({ ourProps: g2, theirProps: s2, slot: h2, attrs: l2, slots: p2, visible: c2.value === 0, features: N$2.RenderStrategy | N$2.Static, name: "Dialog" }))))), h$1(f, { features: a$2.Hidden, ref: R2 })]);
    };
  } }), Ke = defineComponent({ name: "DialogOverlay", props: { as: { type: [Object, String], default: "div" }, id: { type: String, default: () => `headlessui-dialog-overlay-${t$3()}` } }, setup(r2, { attrs: n2, slots: l2 }) {
    let p2 = E("DialogOverlay");
    function i2(a2) {
      a2.target === a2.currentTarget && (a2.preventDefault(), a2.stopPropagation(), p2.close());
    }
    return () => {
      let { id: a2, ...f2 } = r2;
      return H$2({ ourProps: { id: a2, "aria-hidden": true, onClick: i2 }, theirProps: f2, slot: { open: p2.dialogState.value === 0 }, attrs: n2, slots: l2, name: "DialogOverlay" });
    };
  } });
  defineComponent({ name: "DialogBackdrop", props: { as: { type: [Object, String], default: "div" }, id: { type: String, default: () => `headlessui-dialog-backdrop-${t$3()}` } }, inheritAttrs: false, setup(r2, { attrs: n2, slots: l2, expose: p2 }) {
    let i2 = E("DialogBackdrop"), a2 = ref(null);
    return p2({ el: a2, $el: a2 }), onMounted(() => {
      if (i2.panelRef.value === null)
        throw new Error("A <DialogBackdrop /> component is being used, but a <DialogPanel /> component is missing.");
    }), () => {
      let { id: f2, ...d2 } = r2, m2 = { id: f2, ref: a2, "aria-hidden": true };
      return h$1(P, { force: true }, () => h$1(R$1, () => H$2({ ourProps: m2, theirProps: { ...n2, ...d2 }, slot: { open: i2.dialogState.value === 0 }, attrs: n2, slots: l2, name: "DialogBackdrop" })));
    };
  } });
  defineComponent({ name: "DialogPanel", props: { as: { type: [Object, String], default: "div" }, id: { type: String, default: () => `headlessui-dialog-panel-${t$3()}` } }, setup(r2, { attrs: n2, slots: l2, expose: p2 }) {
    let i2 = E("DialogPanel");
    p2({ el: i2.panelRef, $el: i2.panelRef });
    function a2(f2) {
      f2.stopPropagation();
    }
    return () => {
      let { id: f2, ...d2 } = r2, m2 = { id: f2, ref: i2.panelRef, onClick: a2 };
      return H$2({ ourProps: m2, theirProps: d2, slot: { open: i2.dialogState.value === 0 }, attrs: n2, slots: l2, name: "DialogPanel" });
    };
  } });
  defineComponent({ name: "DialogTitle", props: { as: { type: [Object, String], default: "h2" }, id: { type: String, default: () => `headlessui-dialog-title-${t$3()}` } }, setup(r2, { attrs: n2, slots: l2 }) {
    let p2 = E("DialogTitle");
    return onMounted(() => {
      p2.setTitleId(r2.id), onUnmounted(() => p2.setTitleId(null));
    }), () => {
      let { id: i2, ...a2 } = r2;
      return H$2({ ourProps: { id: i2 }, theirProps: a2, slot: { open: p2.dialogState.value === 0 }, attrs: n2, slots: l2, name: "DialogTitle" });
    };
  } });
  function l(r2) {
    let e2 = { called: false };
    return (...t2) => {
      if (!e2.called)
        return e2.called = true, r2(...t2);
    };
  }
  function m(e2, ...t2) {
    e2 && t2.length > 0 && e2.classList.add(...t2);
  }
  function d(e2, ...t2) {
    e2 && t2.length > 0 && e2.classList.remove(...t2);
  }
  var g = ((i2) => (i2.Finished = "finished", i2.Cancelled = "cancelled", i2))(g || {});
  function F(e2, t2) {
    let i2 = r();
    if (!e2)
      return i2.dispose;
    let { transitionDuration: n2, transitionDelay: a2 } = getComputedStyle(e2), [l2, s2] = [n2, a2].map((o2) => {
      let [u2 = 0] = o2.split(",").filter(Boolean).map((r2) => r2.includes("ms") ? parseFloat(r2) : parseFloat(r2) * 1e3).sort((r2, c2) => c2 - r2);
      return u2;
    });
    return l2 !== 0 ? i2.setTimeout(() => t2("finished"), l2 + s2) : t2("finished"), i2.add(() => t2("cancelled")), i2.dispose;
  }
  function L(e2, t2, i2, n2, a2, l$12) {
    let s2 = r(), o2 = l$12 !== void 0 ? l(l$12) : () => {
    };
    return d(e2, ...a2), m(e2, ...t2, ...i2), s2.nextFrame(() => {
      d(e2, ...i2), m(e2, ...n2), s2.add(F(e2, (u2) => (d(e2, ...n2, ...t2), m(e2, ...a2), o2(u2))));
    }), s2.add(() => d(e2, ...t2, ...i2, ...n2, ...a2)), s2.add(() => o2("cancelled")), s2.dispose;
  }
  function T(e2 = "") {
    return e2.split(" ").filter((t2) => t2.trim().length > 1);
  }
  let O = Symbol("TransitionContext");
  var pe = ((i2) => (i2.Visible = "visible", i2.Hidden = "hidden", i2))(pe || {});
  function me() {
    return inject(O, null) !== null;
  }
  function Te() {
    let e2 = inject(O, null);
    if (e2 === null)
      throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
    return e2;
  }
  function ge() {
    let e2 = inject(R, null);
    if (e2 === null)
      throw new Error("A <TransitionChild /> is used but it is missing a parent <TransitionRoot />.");
    return e2;
  }
  let R = Symbol("NestingContext");
  function x(e2) {
    return "children" in e2 ? x(e2.children) : e2.value.filter(({ state: t2 }) => t2 === "visible").length > 0;
  }
  function J(e2) {
    let t2 = ref([]), i2 = ref(false);
    onMounted(() => i2.value = true), onUnmounted(() => i2.value = false);
    function s2(n2, r2 = S$2.Hidden) {
      let l2 = t2.value.findIndex(({ id: f2 }) => f2 === n2);
      l2 !== -1 && (u$3(r2, { [S$2.Unmount]() {
        t2.value.splice(l2, 1);
      }, [S$2.Hidden]() {
        t2.value[l2].state = "hidden";
      } }), !x(t2) && i2.value && (e2 == null || e2()));
    }
    function g2(n2) {
      let r2 = t2.value.find(({ id: l2 }) => l2 === n2);
      return r2 ? r2.state !== "visible" && (r2.state = "visible") : t2.value.push({ id: n2, state: "visible" }), () => s2(n2, S$2.Unmount);
    }
    return { children: t2, register: g2, unregister: s2 };
  }
  let Q = N$2.RenderStrategy, he = defineComponent({ props: { as: { type: [Object, String], default: "div" }, show: { type: [Boolean], default: null }, unmount: { type: [Boolean], default: true }, appear: { type: [Boolean], default: false }, enter: { type: [String], default: "" }, enterFrom: { type: [String], default: "" }, enterTo: { type: [String], default: "" }, entered: { type: [String], default: "" }, leave: { type: [String], default: "" }, leaveFrom: { type: [String], default: "" }, leaveTo: { type: [String], default: "" } }, emits: { beforeEnter: () => true, afterEnter: () => true, beforeLeave: () => true, afterLeave: () => true }, setup(e2, { emit: t2, attrs: i2, slots: s2, expose: g$12 }) {
    let n2 = ref(0);
    function r2() {
      n2.value |= l$2.Opening, t2("beforeEnter");
    }
    function l2() {
      n2.value &= ~l$2.Opening, t2("afterEnter");
    }
    function f2() {
      n2.value |= l$2.Closing, t2("beforeLeave");
    }
    function S2() {
      n2.value &= ~l$2.Closing, t2("afterLeave");
    }
    if (!me() && C())
      return () => h$1(Se, { ...e2, onBeforeEnter: r2, onAfterEnter: l2, onBeforeLeave: f2, onAfterLeave: S2 }, s2);
    let d2 = ref(null), a2 = ref("visible"), W = computed(() => e2.unmount ? S$2.Unmount : S$2.Hidden);
    g$12({ el: d2, $el: d2 });
    let { show: h2, appear: N2 } = Te(), { register: A2, unregister: L$12 } = ge(), D = { value: true }, c2 = t$3(), b2 = { value: false }, I2 = J(() => {
      !b2.value && a2.value !== "hidden" && (a2.value = "hidden", L$12(c2), S2());
    });
    onMounted(() => {
      let o2 = A2(c2);
      onUnmounted(o2);
    }), watchEffect(() => {
      if (W.value === S$2.Hidden && c2) {
        if (h2 && a2.value !== "visible") {
          a2.value = "visible";
          return;
        }
        u$3(a2.value, { ["hidden"]: () => L$12(c2), ["visible"]: () => A2(c2) });
      }
    });
    let P2 = T(e2.enter), j2 = T(e2.enterFrom), X = T(e2.enterTo), M2 = T(e2.entered), Y = T(e2.leave), Z = T(e2.leaveFrom), ee = T(e2.leaveTo);
    onMounted(() => {
      watchEffect(() => {
        if (a2.value === "visible") {
          let o$12 = o(d2);
          if (o$12 instanceof Comment && o$12.data === "")
            throw new Error("Did you forget to passthrough the `ref` to the actual DOM node?");
        }
      });
    });
    function te(o$12) {
      let y2 = D.value && !N2.value, v2 = o(d2);
      !v2 || !(v2 instanceof HTMLElement) || y2 || (b2.value = true, h2.value && r2(), h2.value || f2(), o$12(h2.value ? L(v2, P2, j2, X, M2, (E2) => {
        b2.value = false, E2 === g.Finished && l2();
      }) : L(v2, Y, Z, ee, M2, (E2) => {
        b2.value = false, E2 === g.Finished && (x(I2) || (a2.value = "hidden", L$12(c2), S2()));
      })));
    }
    return onMounted(() => {
      watch([h2], (o2, y2, v2) => {
        te(v2), D.value = false;
      }, { immediate: true });
    }), provide(R, I2), c$3(computed(() => u$3(a2.value, { ["visible"]: l$2.Open, ["hidden"]: l$2.Closed }) | n2.value)), () => {
      let { appear: o2, show: y2, enter: v2, enterFrom: E2, enterTo: Ce, entered: be, leave: ye2, leaveFrom: Ee, leaveTo: Ve, ..._ } = e2, ne = { ref: d2 }, re = { ..._, ...N2 && h2 && c$2.isServer ? { class: normalizeClass([i2.class, _.class, ...P2, ...j2]) } : {} };
      return H$2({ theirProps: re, ourProps: ne, slot: {}, slots: s2, attrs: i2, features: Q, visible: a2.value === "visible", name: "TransitionChild" });
    };
  } }), ce = he, Se = defineComponent({ inheritAttrs: false, props: { as: { type: [Object, String], default: "div" }, show: { type: [Boolean], default: null }, unmount: { type: [Boolean], default: true }, appear: { type: [Boolean], default: false }, enter: { type: [String], default: "" }, enterFrom: { type: [String], default: "" }, enterTo: { type: [String], default: "" }, entered: { type: [String], default: "" }, leave: { type: [String], default: "" }, leaveFrom: { type: [String], default: "" }, leaveTo: { type: [String], default: "" } }, emits: { beforeEnter: () => true, afterEnter: () => true, beforeLeave: () => true, afterLeave: () => true }, setup(e2, { emit: t2, attrs: i2, slots: s2 }) {
    let g2 = p$3(), n2 = computed(() => e2.show === null && g2 !== null ? (g2.value & l$2.Open) === l$2.Open : e2.show);
    watchEffect(() => {
      if (![true, false].includes(n2.value))
        throw new Error('A <Transition /> is used but it is missing a `:show="true | false"` prop.');
    });
    let r2 = ref(n2.value ? "visible" : "hidden"), l2 = J(() => {
      r2.value = "hidden";
    }), f2 = ref(true), S2 = { show: n2, appear: computed(() => e2.appear || !f2.value) };
    return onMounted(() => {
      watchEffect(() => {
        f2.value = false, n2.value ? r2.value = "visible" : x(l2) || (r2.value = "hidden");
      });
    }), provide(R, l2), provide(O, S2), () => {
      let d2 = T$2(e2, ["show", "appear", "unmount", "onBeforeEnter", "onBeforeLeave", "onAfterEnter", "onAfterLeave"]), a2 = { unmount: e2.unmount };
      return H$2({ ourProps: { ...a2, as: "template" }, theirProps: {}, slot: {}, slots: { ...s2, default: () => [h$1(ce, { onBeforeEnter: () => t2("beforeEnter"), onAfterEnter: () => t2("afterEnter"), onBeforeLeave: () => t2("beforeLeave"), onAfterLeave: () => t2("afterLeave"), ...i2, ...a2, ...d2 }, s2.default)] }, attrs: {}, features: Q, visible: r2.value === "visible", name: "Transition" });
    };
  } });
  const _sfc_main$a = {};
  const _hoisted_1$a = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    "stroke-width": "1.5",
    stroke: "currentColor"
  };
  const _hoisted_2$9 = /* @__PURE__ */ createBaseVNode("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    d: "M6 18L18 6M6 6l12 12"
  }, null, -1);
  const _hoisted_3$7 = [
    _hoisted_2$9
  ];
  function _sfc_render$2(_ctx, _cache) {
    return openBlock(), createElementBlock("svg", _hoisted_1$a, _hoisted_3$7);
  }
  const IconClose = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$2]]);
  const WPLoadingBar_vue_vue_type_style_index_0_scoped_edb2a8ae_lang = "";
  const _sfc_main$9 = {};
  const _withScopeId = (n2) => (pushScopeId("data-v-edb2a8ae"), n2 = n2(), popScopeId(), n2);
  const _hoisted_1$9 = { class: "wp-loading-bar tw-relative tw-block tw-w-full tw-bg-white tw-overflow-hidden" };
  const _hoisted_2$8 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("div", { class: "wp-loading-bar__bar !tw-absolute tw-block tw-bg-primary-500" }, null, -1));
  const _hoisted_3$6 = [
    _hoisted_2$8
  ];
  function _sfc_render$1(_ctx, _cache) {
    return openBlock(), createElementBlock("div", _hoisted_1$9, _hoisted_3$6);
  }
  const WPLoadingBar = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$1], ["__scopeId", "data-v-edb2a8ae"]]);
  const _hoisted_1$8 = { class: "tw-fixed tw-inset-0 tw-overflow-hidden tw-flex tw-item-center tw-justify-center tw-h-screen tw-p-8 tw-z-[99999]" };
  const _hoisted_2$7 = { class: "tw-flex tw-flex-col-reverse" };
  const _hoisted_3$5 = { class: "tw-flex tw-w-full tw-gap-4 tw-items-center tw-justify-start" };
  const _hoisted_4$4 = { class: "tw-w-full" };
  const _hoisted_5$2 = {
    key: 1,
    class: "tw-text-base tw-font-bold"
  };
  const _hoisted_6$2 = { class: "tw-ml-auto" };
  const _hoisted_7$2 = ["disabled"];
  const _sfc_main$8 = /* @__PURE__ */ defineComponent({
    __name: "Dialog",
    props: {
      open: {
        type: Boolean,
        default: false
      },
      width: {
        type: String,
        default: "600px"
      },
      title: {
        type: String,
        default: ""
      },
      busy: {
        type: Boolean,
        default: false
      }
    },
    emits: ["close"],
    setup(__props, { emit: emit2 }) {
      const props = __props;
      const dialogHeader = ref(null);
      const dialogContent = ref(null);
      const dialogFooter = ref(null);
      const contentHeight = ref("calc(100vh- 4rem");
      watch(() => props.open, async (open) => {
        var _a, _b;
        if (!open)
          return;
        await nextTick();
        const headerHeight = Math.ceil(((_a = dialogHeader.value) == null ? void 0 : _a.getBoundingClientRect().height) || 0);
        const footerHeight = Math.ceil(((_b = dialogFooter.value) == null ? void 0 : _b.getBoundingClientRect().height) || 0);
        contentHeight.value = `calc(100vh - ${headerHeight}px - ${footerHeight}px - 14rem)`;
      });
      const handleClose = () => {
        if (!props.busy)
          emit2("close");
      };
      return (_ctx, _cache) => {
        return openBlock(), createBlock(unref(Se), {
          appear: "",
          show: props.open,
          as: "template"
        }, {
          default: withCtx(() => [
            createVNode(unref(qe), {
              as: "div",
              onClose: _cache[1] || (_cache[1] = () => handleClose())
            }, {
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_1$8, [
                  createVNode(unref(he), {
                    as: "template",
                    enter: "tw-duration-200 tw-ease-out",
                    "enter-from": "tw-opacity-0",
                    "enter-to": "tw-opacity-100",
                    leave: "tw-duration-200 tw-ease-in",
                    "leave-from": "tw-opacity-100",
                    "leave-to": "tw-opacity-0"
                  }, {
                    default: withCtx(() => [
                      createVNode(unref(Ke), { class: "tw-fixed tw-inset-0 tw-bg-slate-800/70" })
                    ]),
                    _: 1
                  }),
                  createVNode(unref(he), {
                    as: "template",
                    enter: "tw-duration-200 tw-ease-in-out",
                    "enter-from": "tw-opacity-0 tw-scale-75",
                    "enter-to": "tw-opacity-100 tw-scale-100",
                    leave: "tw-duration-200 tw-ease-in-out",
                    "leave-from": "tw-opacity-100 tw-scale-100",
                    "leave-to": "tw-opacity-0 tw-scale-75"
                  }, {
                    default: withCtx(() => [
                      createBaseVNode("div", {
                        class: "dialog",
                        style: normalizeStyle({ maxWidth: props.width })
                      }, [
                        __props.busy ? (openBlock(), createBlock(WPLoadingBar, {
                          key: 0,
                          class: "!tw-absolute tw-top-0 tw-left-0 tw-z-10"
                        })) : createCommentVNode("", true),
                        createBaseVNode("div", _hoisted_2$7, [
                          _ctx.$slots.content ? (openBlock(), createElementBlock("div", {
                            key: 0,
                            ref_key: "dialogContent",
                            ref: dialogContent,
                            class: "dialog-content",
                            style: normalizeStyle({ maxHeight: contentHeight.value })
                          }, [
                            renderSlot(_ctx.$slots, "content")
                          ], 4)) : createCommentVNode("", true),
                          _ctx.$slots.header || props.title ? (openBlock(), createElementBlock("div", {
                            key: 1,
                            ref_key: "dialogHeader",
                            ref: dialogHeader,
                            class: "dialog-header"
                          }, [
                            createBaseVNode("div", _hoisted_3$5, [
                              createBaseVNode("div", _hoisted_4$4, [
                                _ctx.$slots.header ? renderSlot(_ctx.$slots, "header", { key: 0 }) : (openBlock(), createElementBlock("h2", _hoisted_5$2, toDisplayString(props.title), 1))
                              ]),
                              createBaseVNode("div", _hoisted_6$2, [
                                createBaseVNode("button", {
                                  type: "button",
                                  title: "Close",
                                  class: "tw-btn tw-flex tw-items-center tw-justify-center tw-text-gray-900 tw-rounded-full tw-w-8 tw-h-8 tw-p-0 !tw-outline-none tw-transition-colors tw-bg-transparent hover:tw-bg-gray-200 focus:tw-bg-gray-200",
                                  disabled: props.busy,
                                  onClick: _cache[0] || (_cache[0] = () => handleClose())
                                }, [
                                  createVNode(IconClose, { class: "tw-h-5 tw-w-5" })
                                ], 8, _hoisted_7$2)
                              ])
                            ])
                          ], 512)) : createCommentVNode("", true)
                        ]),
                        createBaseVNode("div", null, [
                          _ctx.$slots.footer ? (openBlock(), createElementBlock("div", {
                            key: 0,
                            ref_key: "dialogFooter",
                            ref: dialogFooter,
                            class: "dialog-footer"
                          }, [
                            renderSlot(_ctx.$slots, "footer")
                          ], 512)) : createCommentVNode("", true)
                        ])
                      ], 4)
                    ]),
                    _: 3
                  })
                ])
              ]),
              _: 3
            })
          ]),
          _: 3
        }, 8, ["show"]);
      };
    }
  });
  const Dialog_vue_vue_type_style_index_0_lang = "";
  const GPT_SEO_ASSISTANT_AJAX_BASE_URL = window.gpt_seo_assistant_ajax.url;
  const GPT_SEO_ASSISTANT_AJAX_NONCE = window.gpt_seo_assistant_ajax.nonce;
  const GPT_SEO_ASSISTANT_AJAX_ACTIONS = {
    GET_SETTINGS: "gpt_seo_assistant_get_settings",
    UPDATE_SETTINGS: "gpt_seo_assistant_update_settings",
    ASK_GPT: "gpt_seo_assistant_ask_gpt",
    CHECK_OPENAI_API_KEY: "gpt_seo_assistant_check_openai_api_key"
  };
  const GPT_SEO_ASSISTANT_TASKS = {
    H1: "h1",
    H2: "h2",
    TITLE: "title",
    META_DESCRIPTION: "meta_description",
    META_KEYWORDS: "meta_keywords",
    SLUG: "slug",
    PARAGRAPH: "paragraph",
    BLOG_POST: "blog_post"
  };
  const getSettings = async () => {
    const response = await fetchData({
      action: GPT_SEO_ASSISTANT_AJAX_ACTIONS.GET_SETTINGS,
      data: {}
    });
    return response;
  };
  const updateSettings = async (data) => {
    const response = await fetchData({
      action: GPT_SEO_ASSISTANT_AJAX_ACTIONS.UPDATE_SETTINGS,
      data
    });
    return response;
  };
  const askGPT = async (options) => {
    return await fetchData({
      action: GPT_SEO_ASSISTANT_AJAX_ACTIONS.ASK_GPT,
      data: {
        page_description: options.pageDescription,
        task: options.task
      }
    });
  };
  const checkAPIKey = async () => {
    return fetchData({
      action: GPT_SEO_ASSISTANT_AJAX_ACTIONS.CHECK_OPENAI_API_KEY,
      data: {}
    });
  };
  async function fetchData({
    action,
    data
  }) {
    const formData = new FormData();
    formData.append("action", action);
    formData.append("nonce", GPT_SEO_ASSISTANT_AJAX_NONCE);
    data && formData.append("data", JSON.stringify(data));
    const response = await fetch(GPT_SEO_ASSISTANT_AJAX_BASE_URL, {
      method: "POST",
      body: formData,
      headers: {}
    });
    if (response.status !== 200) {
      throw new Error(response.statusText);
    }
    const json = await response.json();
    if (json.success === false) {
      console.error(json.data);
      throw new Error(json.data);
    }
    return json;
  }
  const _sfc_main$7 = {};
  const _hoisted_1$7 = {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor"
  };
  const _hoisted_2$6 = /* @__PURE__ */ createBaseVNode("path", {
    "fill-rule": "evenodd",
    d: "M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z",
    "clip-rule": "evenodd"
  }, null, -1);
  const _hoisted_3$4 = [
    _hoisted_2$6
  ];
  function _sfc_render(_ctx, _cache) {
    return openBlock(), createElementBlock("svg", _hoisted_1$7, _hoisted_3$4);
  }
  const GenerateIcon = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render]]);
  const _hoisted_1$6 = ["value"];
  const _hoisted_2$5 = ["value", "selected"];
  const _sfc_main$6 = /* @__PURE__ */ defineComponent({
    __name: "WPSelect",
    props: {
      value: {
        type: String,
        default: ""
      },
      options: {
        type: Array,
        default: () => []
      }
    },
    emits: ["change"],
    setup(__props, { emit: emit2 }) {
      const props = __props;
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("select", {
          class: "tw-relative tw-block tw-w-full !tw-max-w-none",
          value: props.value,
          onInput: _cache[0] || (_cache[0] = (e2) => emit2("change", e2.target.value))
        }, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(__props.options, (option) => {
            return openBlock(), createElementBlock("option", {
              key: option.value,
              value: option.value,
              selected: option.value === props.value
            }, toDisplayString(option.label), 9, _hoisted_2$5);
          }), 128))
        ], 40, _hoisted_1$6);
      };
    }
  });
  const _hoisted_1$5 = { key: 0 };
  const _hoisted_2$4 = { key: 1 };
  const _sfc_main$5 = /* @__PURE__ */ defineComponent({
    __name: "WPNotice",
    props: {
      variant: {
        type: String,
        default: "error"
      },
      content: {
        type: String,
        default: ""
      }
    },
    setup(__props) {
      const props = __props;
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", {
          class: normalizeClass(["notice inline wp-pp-notice", {
            "notice-error": props.variant === "error",
            "notice-warning": props.variant === "warning",
            "notice-success": props.variant === "success",
            "notice-info": props.variant === "info"
          }])
        }, [
          props.content ? (openBlock(), createElementBlock("p", _hoisted_1$5, toDisplayString(__props.content), 1)) : _ctx.$slots.default ? (openBlock(), createElementBlock("p", _hoisted_2$4, [
            renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ])) : createCommentVNode("", true)
        ], 2);
      };
    }
  });
  const WPNotice_vue_vue_type_style_index_0_scoped_49ae8618_lang = "";
  const WPNotice = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-49ae8618"]]);
  const _hoisted_1$4 = {
    key: 0,
    class: "tw-relative tw-block tw-w-full tw-p-4 tw-min-h-[170px]"
  };
  const _hoisted_2$3 = /* @__PURE__ */ createBaseVNode("p", null, "Loading...", -1);
  const _hoisted_3$3 = [
    _hoisted_2$3
  ];
  const _hoisted_4$3 = {
    key: 1,
    class: "tw-relative tw-block tw-w-full tw-p-4"
  };
  const _hoisted_5$1 = /* @__PURE__ */ createBaseVNode("h3", { class: "tw-font-bold" }, " Please configure the plugin settings ", -1);
  const _hoisted_6$1 = /* @__PURE__ */ createBaseVNode("p", { class: "tw-text-sm tw-mt-2" }, " You need to configure the plugin settings before you can use the GPT SEO Assistant. ", -1);
  const _hoisted_7$1 = { class: "tw-mt-4" };
  const _hoisted_8$1 = {
    key: 2,
    class: "tw-relative tw-block tw-w-full tw-p-4"
  };
  const _hoisted_9$1 = { class: "tw-mt-4" };
  const _hoisted_10$1 = { class: "tw-mr-2" };
  const _hoisted_11$1 = /* @__PURE__ */ createBaseVNode("div", null, " Generate Content ", -1);
  const _hoisted_12$1 = { class: "tw-flex tw-items-center tw-gap-2" };
  const _hoisted_13$1 = { class: "tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-primary-500 tw-text-white" };
  const _hoisted_14$1 = /* @__PURE__ */ createBaseVNode("div", null, [
    /* @__PURE__ */ createBaseVNode("h2", { class: "!tw-p-0 tw-font-medium tw-text-[16px]" }, " GPT SEO Assistant ")
  ], -1);
  const _hoisted_15$1 = { class: "tw-flex tw-items-end tw-gap-2" };
  const _hoisted_16$1 = { class: "tw-mr-2" };
  const _hoisted_17$1 = /* @__PURE__ */ createBaseVNode("div", null, " Generate Content ", -1);
  const _hoisted_18$1 = {
    key: 1,
    class: "tw-flex tw-items-center tw-justify-center tw-h-[180px] tw-rounded-md tw-p-4 tw-border tw-border-solid tw-border-[#8c8f94]"
  };
  const _hoisted_19$1 = /* @__PURE__ */ createBaseVNode("div", { class: "tw-flex tw-flex-col tw-align-center tw-justify-center tw-gap-2" }, [
    /* @__PURE__ */ createBaseVNode("p", null, "Generating content..."),
    /* @__PURE__ */ createBaseVNode("svg", {
      "aria-hidden": "true",
      class: "tw-block tw-mx-auto tw-w-8 tw-h-8 tw-text-gray-300 tw-animate-spin tw-fill-primary-500",
      viewBox: "0 0 100 101",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg"
    }, [
      /* @__PURE__ */ createBaseVNode("path", {
        d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z",
        fill: "currentColor"
      }),
      /* @__PURE__ */ createBaseVNode("path", {
        d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z",
        fill: "currentFill"
      })
    ])
  ], -1);
  const _hoisted_20$1 = [
    _hoisted_19$1
  ];
  const _hoisted_21$1 = { class: "tw-mt-4 tw-flex tw-justify-end tw-gap-2" };
  const _sfc_main$4 = /* @__PURE__ */ defineComponent({
    __name: "Metabox",
    setup(__props) {
      const pageDescription = ref("");
      const pageDescriptionInput = ref(document.querySelector("#gpt_seo_assistant_page_description"));
      const isLoading = ref(false);
      const isGenerating = ref(false);
      const isDialogOpen = ref(false);
      const tasks = ref([
        {
          label: "Content: Heading 1",
          value: GPT_SEO_ASSISTANT_TASKS.H1
        },
        {
          label: "Content: Heading 2",
          value: GPT_SEO_ASSISTANT_TASKS.H2
        },
        {
          label: "Content: Paragraph",
          value: GPT_SEO_ASSISTANT_TASKS.PARAGRAPH
        },
        {
          label: "Content: Blog Post",
          value: GPT_SEO_ASSISTANT_TASKS.BLOG_POST
        },
        {
          label: "SEO: Title",
          value: GPT_SEO_ASSISTANT_TASKS.TITLE
        },
        {
          label: "SEO: Meta Description",
          value: GPT_SEO_ASSISTANT_TASKS.META_DESCRIPTION
        },
        {
          label: "SEO: Meta Keywords",
          value: GPT_SEO_ASSISTANT_TASKS.META_KEYWORDS
        },
        {
          label: "SEO: Slug",
          value: GPT_SEO_ASSISTANT_TASKS.SLUG
        }
      ]);
      const selectedTask = ref(GPT_SEO_ASSISTANT_TASKS.H1);
      const generatedContent = ref("");
      const generatedContentEdited = ref(false);
      const generatedContentError = ref("");
      const settings = ref({
        gpt_seo_assistant_openai_api_key: "",
        gpt_seo_assistant_business_name: "",
        gpt_seo_assistant_business_description: "",
        gpt_seo_assistant_business_tonality: ""
      });
      const isSettingsMissing = computed(() => {
        return !settings.value.gpt_seo_assistant_openai_api_key || !settings.value.gpt_seo_assistant_business_name || !settings.value.gpt_seo_assistant_business_description;
      });
      const generateContent = async () => {
        if (isGenerating.value)
          return;
        isGenerating.value = true;
        generatedContentError.value = "";
        generatedContentEdited.value = false;
        try {
          const response = await askGPT({
            pageDescription: pageDescription.value,
            task: selectedTask.value
          });
          if (response.status === "ok" && response.data) {
            generatedContent.value = response.data;
            return;
          }
          generatedContent.value = "";
          generatedContentError.value = "Sorry, an error occurred. Please try again.";
        } catch (e2) {
          generatedContent.value = "";
          generatedContentError.value = "Sorry, an error occurred. Please make sure your API key is valid.";
        } finally {
          isGenerating.value = false;
        }
      };
      const handlePageDescriptionChange = (val) => {
        pageDescription.value = val;
        pageDescriptionInput.value.setAttribute("value", val);
      };
      const handleEditGeneratedContent = (val) => {
        generatedContent.value = val;
        generatedContentEdited.value = true;
      };
      const handleCopyAndClose = () => {
        if (generatedContent.value) {
          try {
            navigator.clipboard.writeText(generatedContent.value);
          } catch (e2) {
          }
        }
        isDialogOpen.value = false;
      };
      onMounted(async () => {
        isLoading.value = true;
        const response = await getSettings();
        settings.value = {
          ...settings.value,
          ...response
        };
        pageDescription.value = pageDescriptionInput.value.getAttribute("value") || "";
        isLoading.value = false;
      });
      return (_ctx, _cache) => {
        return isLoading.value ? (openBlock(), createElementBlock("div", _hoisted_1$4, _hoisted_3$3)) : unref(isSettingsMissing) ? (openBlock(), createElementBlock("div", _hoisted_4$3, [
          _hoisted_5$1,
          _hoisted_6$1,
          createBaseVNode("div", _hoisted_7$1, [
            createVNode(WPButton, {
              variant: "secondary",
              class: "tw-w-full tw-text-center",
              as: "a",
              href: "/wp-admin/admin.php?page=gpt-seo-assistant-admin"
            }, {
              default: withCtx(() => [
                createTextVNode(" Configure plugin settings ")
              ]),
              _: 1
            })
          ])
        ])) : (openBlock(), createElementBlock("div", _hoisted_8$1, [
          createBaseVNode("div", null, [
            createVNode(WPFormGroup, {
              title: "Page Description",
              description: "Enter a short description of the page you want to generate content for. This will help the AI generate more relevant content."
            }, {
              default: withCtx(() => [
                createVNode(_sfc_main$b, {
                  disabled: isGenerating.value,
                  placeholder: "E.g. This page is about the best WordPress plugins for SEO. It contains a list of the top 10 plugins and a short description of each one...",
                  value: pageDescription.value,
                  maxlength: "500",
                  rows: 5,
                  onChange: _cache[0] || (_cache[0] = (val) => handlePageDescriptionChange(val))
                }, null, 8, ["disabled", "value"])
              ]),
              _: 1
            })
          ]),
          createBaseVNode("div", _hoisted_9$1, [
            createVNode(WPButton, {
              variant: "secondary",
              type: "button",
              class: "tw-flex tw-items-center tw-w-full",
              onClick: _cache[1] || (_cache[1] = () => isDialogOpen.value = true)
            }, {
              default: withCtx(() => [
                createBaseVNode("div", _hoisted_10$1, [
                  createVNode(GenerateIcon, { class: "tw-w-4 tw-h-4" })
                ]),
                _hoisted_11$1
              ]),
              _: 1
            }),
            createVNode(_sfc_main$8, {
              open: isDialogOpen.value,
              onClose: _cache[7] || (_cache[7] = () => isDialogOpen.value = false)
            }, {
              header: withCtx(() => [
                createBaseVNode("div", _hoisted_12$1, [
                  createBaseVNode("div", null, [
                    createBaseVNode("div", _hoisted_13$1, [
                      createVNode(GenerateIcon, { class: "tw-w-4 tw-h-4" })
                    ])
                  ]),
                  _hoisted_14$1
                ])
              ]),
              content: withCtx(() => [
                createBaseVNode("div", null, [
                  generatedContentError.value ? (openBlock(), createBlock(WPNotice, {
                    key: 0,
                    class: "!tw-block !tw-mb-4",
                    variant: "error",
                    content: generatedContentError.value
                  }, null, 8, ["content"])) : createCommentVNode("", true),
                  createBaseVNode("div", _hoisted_15$1, [
                    createVNode(WPFormGroup, {
                      for: "generate-content-task",
                      title: "Generate content for..."
                    }, {
                      default: withCtx(() => [
                        createVNode(_sfc_main$6, {
                          id: "generate-content-task",
                          disabled: isGenerating.value,
                          options: tasks.value,
                          value: selectedTask.value,
                          onChange: _cache[2] || (_cache[2] = (val) => selectedTask.value = val)
                        }, null, 8, ["disabled", "options", "value"])
                      ]),
                      _: 1
                    }),
                    createVNode(WPButton, {
                      class: "tw-h-8 !tw-py-0 tw-whitespace-nowrap tw-flex tw-items-center",
                      variant: "primary",
                      type: "button",
                      disabled: isGenerating.value,
                      onClick: _cache[3] || (_cache[3] = () => generateContent())
                    }, {
                      default: withCtx(() => [
                        createBaseVNode("div", _hoisted_16$1, [
                          createVNode(GenerateIcon, { class: "tw-w-4 tw-h-4" })
                        ]),
                        _hoisted_17$1
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ]),
                  createVNode(WPFormGroup, {
                    for: "generated-content",
                    title: "Generated content",
                    description: "This is the content generated by GPT. You can edit it before copying and pasting it into your page.",
                    class: "tw-mt-4"
                  }, {
                    default: withCtx(() => [
                      !isGenerating.value ? (openBlock(), createBlock(_sfc_main$b, {
                        key: 0,
                        id: "generated-content",
                        class: "tw-h-[180px]",
                        value: generatedContent.value,
                        onChange: _cache[4] || (_cache[4] = (val) => handleEditGeneratedContent(val))
                      }, null, 8, ["value"])) : (openBlock(), createElementBlock("div", _hoisted_18$1, _hoisted_20$1))
                    ]),
                    _: 1
                  }),
                  createBaseVNode("div", _hoisted_21$1, [
                    createVNode(WPButton, {
                      variant: "secondary",
                      type: "button",
                      disabled: isGenerating.value,
                      onClick: _cache[5] || (_cache[5] = () => isDialogOpen.value = false)
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Close ")
                      ]),
                      _: 1
                    }, 8, ["disabled"]),
                    createVNode(WPButton, {
                      variant: "primary",
                      type: "button",
                      disabled: isGenerating.value || !generatedContent.value,
                      onClick: _cache[6] || (_cache[6] = () => handleCopyAndClose())
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Copy Content and Close ")
                      ]),
                      _: 1
                    }, 8, ["disabled"])
                  ])
                ])
              ]),
              _: 1
            }, 8, ["open"])
          ])
        ]));
      };
    }
  });
  const _hoisted_1$3 = { class: "postbox" };
  const _hoisted_2$2 = { class: "postbox-header postbox-header-vue !tw-font-semibold !tw-flex !tw-items-center !tw-justify-start !tw-gap-4 !tw-p-4" };
  const _hoisted_3$2 = {
    key: 0,
    class: "tw-font-semibold !tw-p-0"
  };
  const _hoisted_4$2 = { class: "inside !tw-p-0 !tw-m-0" };
  const _sfc_main$3 = /* @__PURE__ */ defineComponent({
    __name: "WPMetaBox",
    props: {
      title: {
        type: String,
        default: ""
      }
    },
    setup(__props) {
      const props = __props;
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$3, [
          createBaseVNode("div", _hoisted_2$2, [
            props.title ? (openBlock(), createElementBlock("h2", _hoisted_3$2, toDisplayString(props.title), 1)) : _ctx.$slots.title ? renderSlot(_ctx.$slots, "title", { key: 1 }) : createCommentVNode("", true)
          ]),
          createBaseVNode("div", _hoisted_4$2, [
            renderSlot(_ctx.$slots, "content")
          ])
        ]);
      };
    }
  });
  const WPMetaBox_vue_vue_type_style_index_0_lang = "";
  const _hoisted_1$2 = ["value"];
  const _sfc_main$2 = /* @__PURE__ */ defineComponent({
    __name: "WPInput",
    props: {
      value: {
        type: String,
        default: ""
      }
    },
    emits: ["change"],
    setup(__props, { emit: emit2 }) {
      const props = __props;
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("input", {
          value: props.value,
          class: "tw-relative tw-block tw-w-full",
          onInput: _cache[0] || (_cache[0] = (e2) => emit2("change", e2.target.value))
        }, null, 40, _hoisted_1$2);
      };
    }
  });
  const _hoisted_1$1 = { class: "tw-flex tw-gap-4" };
  const _hoisted_2$1 = { class: "tw-flex-1" };
  const _hoisted_3$1 = /* @__PURE__ */ createBaseVNode("div", null, [
    /* @__PURE__ */ createBaseVNode("div", { class: "tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-primary-500 tw-text-white" }, [
      /* @__PURE__ */ createBaseVNode("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        class: "tw-w-4 tw-h-4"
      }, [
        /* @__PURE__ */ createBaseVNode("path", {
          "fill-rule": "evenodd",
          d: "M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.717-.221.906l-6.5 6.499a3 3 0 00-.878 2.121v2.818c0 .414.336.75.75.75H6a.75.75 0 00.75-.75v-1.5h1.5A.75.75 0 009 19.5V18h1.5a.75.75 0 00.53-.22l2.658-2.658c.19-.189.517-.288.906-.22A6.75 6.75 0 1015.75 1.5zm0 3a.75.75 0 000 1.5A2.25 2.25 0 0118 8.25a.75.75 0 001.5 0 3.75 3.75 0 00-3.75-3.75z",
          "clip-rule": "evenodd"
        })
      ])
    ])
  ], -1);
  const _hoisted_4$1 = /* @__PURE__ */ createBaseVNode("div", null, [
    /* @__PURE__ */ createBaseVNode("h2", { class: "!tw-p-0" }, " Setting up Open AI ")
  ], -1);
  const _hoisted_5 = { class: "tw-relative tw-block tw-w-full" };
  const _hoisted_6 = { class: "tw-absolute tw-top-0 tw-left-0 tw-w-full" };
  const _hoisted_7 = { class: "tw-relative tw-block tw-w-full tw-p-6" };
  const _hoisted_8 = /* @__PURE__ */ createBaseVNode("p", { class: "tw-p-0" }, " In order to use GPT SEO Assistant, you need to get an API key from OpenAI. Your API key is used to communicate with OpenAI's servers which is where the AI magic happens. ", -1);
  const _hoisted_9 = { class: "tw-mt-6" };
  const _hoisted_10 = { class: "tw-flex tw-items-center tw-gap-2" };
  const _hoisted_11 = { key: 2 };
  const _hoisted_12 = /* @__PURE__ */ createBaseVNode("div", { class: "tw-mt-6 tw-pt-6 tw-border-t tw-border-t-gray-300" }, [
    /* @__PURE__ */ createBaseVNode("h2", { class: "!tw-p-0 !tw-font-medium" }, " Open AI FAQs "),
    /* @__PURE__ */ createBaseVNode("details", { class: "tw-mt-2" }, [
      /* @__PURE__ */ createBaseVNode("summary", { class: "tw-font-medium tw-cursor-pointer" }, "How much does OpenAI cost?"),
      /* @__PURE__ */ createBaseVNode("p", null, "OpenAI offers a very affordable pricing structure. You only pay for what you use, with prices based on the number of words generated. At the current rate, you can expect to pay approximately $1 for every 100,000 words. Plus, you can set limits on how much you want to spend to stay within your budget.")
    ]),
    /* @__PURE__ */ createBaseVNode("details", { class: "tw-mt-2" }, [
      /* @__PURE__ */ createBaseVNode("summary", { class: "tw-font-medium tw-cursor-pointer" }, "How is my API key used?"),
      /* @__PURE__ */ createBaseVNode("p", null, "Your API key is securely stored in your WordPress database and is sent directly to the Open AI API. We do not send your API Key through any third party services.")
    ]),
    /* @__PURE__ */ createBaseVNode("details", { class: "tw-mt-2" }, [
      /* @__PURE__ */ createBaseVNode("summary", { class: "tw-font-medium tw-cursor-pointer" }, "How do I test my API key?"),
      /* @__PURE__ */ createBaseVNode("p", null, `You can easily test your API key to ensure it's working by clicking the "Save API Key" button. If the key is valid, you'll see a success message, confirming that you're all set to use the OpenAI API.`)
    ]),
    /* @__PURE__ */ createBaseVNode("details", { class: "tw-mt-2" }, [
      /* @__PURE__ */ createBaseVNode("summary", { class: "tw-font-medium tw-cursor-pointer" }, "What should I do if my API key isn't working?"),
      /* @__PURE__ */ createBaseVNode("p", null, "If your API key isn't working, there are a few things you can check. First, make sure you haven't exceeded your budget. You can easily track your usage within the OpenAI dashboard. Additionally, you must enter your billing information on OpenAI before you can use their API, so double-check that you've completed this step.")
    ])
  ], -1);
  const _hoisted_13 = /* @__PURE__ */ createBaseVNode("div", null, [
    /* @__PURE__ */ createBaseVNode("div", { class: "tw-w-6 tw-h-6 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-primary-500 tw-text-white" }, [
      /* @__PURE__ */ createBaseVNode("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 24 24",
        fill: "currentColor",
        class: "tw-w-4 tw-h-4"
      }, [
        /* @__PURE__ */ createBaseVNode("path", {
          "fill-rule": "evenodd",
          d: "M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z",
          "clip-rule": "evenodd"
        }),
        /* @__PURE__ */ createBaseVNode("path", { d: "M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" })
      ])
    ])
  ], -1);
  const _hoisted_14 = /* @__PURE__ */ createBaseVNode("div", null, [
    /* @__PURE__ */ createBaseVNode("h2", { class: "!tw-p-0" }, " Business details ")
  ], -1);
  const _hoisted_15 = { class: "tw-relative tw-block tw-w-full" };
  const _hoisted_16 = { class: "tw-absolute tw-top-0 tw-left-0 tw-w-full" };
  const _hoisted_17 = { class: "tw-relative tw-block tw-w-full tw-p-6" };
  const _hoisted_18 = /* @__PURE__ */ createBaseVNode("div", null, [
    /* @__PURE__ */ createBaseVNode("p", { class: "tw-p-0" }, " In order to use AI Assitant effectively, you need to provide some basic information about your business or website. This information will be used to generate more relevant responses. ")
  ], -1);
  const _hoisted_19 = { class: "tw-mt-6" };
  const _hoisted_20 = { class: "tw-mt-6" };
  const _hoisted_21 = { class: "tw-mt-6" };
  const _hoisted_22 = { class: "tw-mt-6" };
  const _hoisted_23 = { class: "tw-w-full md:tw-w-[350px]" };
  const _hoisted_24 = /* @__PURE__ */ createBaseVNode("div", null, [
    /* @__PURE__ */ createBaseVNode("h2", { class: "!tw-p-0" }, " 👋 Enjoying this plugin? ")
  ], -1);
  const _hoisted_25 = { class: "tw-relative tw-block tw-w-full" };
  const _hoisted_26 = { class: "tw-relative tw-block tw-w-full tw-p-6" };
  const _hoisted_27 = /* @__PURE__ */ createBaseVNode("div", null, [
    /* @__PURE__ */ createBaseVNode("p", { class: "tw-p-0" }, " Thank you for using our GPT-powered SEO and content writing plugin! We hope it has made your content creation experience more efficient and enjoyable. If you find our plugin helpful and would like to support its ongoing development and maintenance, please consider making a donation. ")
  ], -1);
  const _hoisted_28 = { class: "tw-mt-6" };
  const _hoisted_29 = /* @__PURE__ */ createBaseVNode("svg", {
    class: "tw-inline tw-align-middle",
    stroke: "currentColor",
    fill: "currentColor",
    "stroke-width": "0",
    viewBox: "0 0 16 16",
    height: "1em",
    width: "1em",
    xmlns: "http://www.w3.org/2000/svg"
  }, [
    /* @__PURE__ */ createBaseVNode("path", {
      "fill-rule": "evenodd",
      d: "M14.06 3.713c.12-1.071-.093-1.832-.702-2.526C12.628.356 11.312 0 9.626 0H4.734a.7.7 0 0 0-.691.59L2.005 13.509a.42.42 0 0 0 .415.486h2.756l-.202 1.28a.628.628 0 0 0 .62.726H8.14c.429 0 .793-.31.862-.731l.025-.13.48-3.043.03-.164.001-.007a.351.351 0 0 1 .348-.297h.38c1.266 0 2.425-.256 3.345-.91.379-.27.712-.603.993-1.005a4.942 4.942 0 0 0 .88-2.195c.242-1.246.13-2.356-.57-3.154a2.687 2.687 0 0 0-.76-.59l-.094-.061zM6.543 8.82l-.845 5.213v.001l-.208 1.32c-.01.066.04.123.105.123H8.14c.173 0 .32-.125.348-.296v-.005l.026-.129.48-3.043.03-.164a.873.873 0 0 1 .862-.734h.38c1.201 0 2.24-.244 3.043-.815.797-.567 1.39-1.477 1.663-2.874.229-1.175.096-2.087-.45-2.71a2.126 2.126 0 0 0-.548-.438l-.003.016c-.645 3.312-2.853 4.456-5.672 4.456H6.864a.695.695 0 0 0-.321.079z"
    })
  ], -1);
  const _sfc_main$1 = /* @__PURE__ */ defineComponent({
    __name: "Settings",
    setup(__props) {
      const isLoading = ref(false);
      const isUpdatingOpenAIKey = ref(false);
      const isUpdatingSettings = ref(false);
      const isTestingOpenAIKey = ref(false);
      const hasAddedOpenAIKey = ref(false);
      const settings = ref({
        gpt_seo_assistant_openai_api_key: "",
        gpt_seo_assistant_business_name: "",
        gpt_seo_assistant_business_description: "",
        gpt_seo_assistant_business_tonality: "formal"
      });
      const tonalityOptions = ref([
        {
          value: "authoritative",
          label: "Authoritative"
        },
        {
          value: "conversational",
          label: "Conversational"
        },
        {
          value: "educational",
          label: "Educational"
        },
        {
          value: "empathetic",
          label: "Empathetic"
        },
        {
          value: "formal",
          label: "Formal"
        },
        {
          value: "humorous",
          label: "Humorous"
        },
        {
          value: "inspirational",
          label: "Inspirational"
        },
        {
          value: "informal",
          label: "Informal"
        },
        {
          value: "persuasive",
          label: "Persuasive"
        },
        {
          value: "positive",
          label: "Positive"
        }
      ]);
      const canUpdateSettings = computed(() => {
        return !isLoading.value && !isUpdatingSettings.value;
      });
      const canUpdateOpenAIKey = computed(() => {
        return !isLoading.value && !isUpdatingOpenAIKey.value && !isTestingOpenAIKey.value;
      });
      const handleUpdateApiKey = async () => {
        isUpdatingOpenAIKey.value = true;
        const response = await updateSettings({
          gpt_seo_assistant_openai_api_key: settings.value.gpt_seo_assistant_openai_api_key
        });
        settings.value.gpt_seo_assistant_openai_api_key = response.gpt_seo_assistant_openai_api_key;
        hasAddedOpenAIKey.value = settings.value.gpt_seo_assistant_openai_api_key ? true : false;
        isUpdatingOpenAIKey.value = false;
      };
      const handleRemoveOpenAIKey = () => {
        settings.value.gpt_seo_assistant_openai_api_key = "";
        handleUpdateApiKey();
      };
      const handleUpdateSettings = async () => {
        isUpdatingSettings.value = true;
        const response = await updateSettings({
          gpt_seo_assistant_business_name: settings.value.gpt_seo_assistant_business_name,
          gpt_seo_assistant_business_description: settings.value.gpt_seo_assistant_business_description,
          gpt_seo_assistant_business_tonality: settings.value.gpt_seo_assistant_business_tonality
        });
        settings.value.gpt_seo_assistant_business_name = response.gpt_seo_assistant_business_name;
        settings.value.gpt_seo_assistant_business_description = response.gpt_seo_assistant_business_description;
        settings.value.gpt_seo_assistant_business_tonality = response.gpt_seo_assistant_business_tonality;
        isUpdatingSettings.value = false;
      };
      const handleTestOpenAIKey = async () => {
        isTestingOpenAIKey.value = true;
        const response = await checkAPIKey();
        if (response.status === "ok") {
          alert("OpenAI API Key is valid!");
        } else {
          alert(`Error: ${response.error}`);
        }
        isTestingOpenAIKey.value = false;
      };
      onMounted(async () => {
        isLoading.value = true;
        const response = await getSettings();
        settings.value = {
          ...settings.value,
          ...response
        };
        isLoading.value = false;
        hasAddedOpenAIKey.value = settings.value.gpt_seo_assistant_openai_api_key ? true : false;
      });
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1$1, [
          createBaseVNode("div", _hoisted_2$1, [
            createVNode(_sfc_main$3, null, {
              title: withCtx(() => [
                _hoisted_3$1,
                _hoisted_4$1
              ]),
              content: withCtx(() => [
                createBaseVNode("div", _hoisted_5, [
                  createBaseVNode("div", _hoisted_6, [
                    isLoading.value || isUpdatingOpenAIKey.value ? (openBlock(), createBlock(WPLoadingBar, { key: 0 })) : createCommentVNode("", true)
                  ]),
                  createBaseVNode("div", _hoisted_7, [
                    createBaseVNode("div", null, [
                      _hoisted_8,
                      createVNode(WPButton, {
                        class: "!tw-mt-4",
                        as: "a",
                        variant: "secondary",
                        href: "https://platform.openai.com/account/api-keys",
                        target: "_blank"
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Get your API key from OpenAI ")
                        ]),
                        _: 1
                      })
                    ]),
                    createBaseVNode("div", _hoisted_9, [
                      createVNode(WPFormGroup, {
                        for: "business-name",
                        title: "OpenAI API Key"
                      }, {
                        default: withCtx(() => [
                          createBaseVNode("div", _hoisted_10, [
                            !hasAddedOpenAIKey.value ? (openBlock(), createBlock(_sfc_main$2, {
                              key: 0,
                              class: "tw-h-8",
                              type: "text",
                              disabled: !unref(canUpdateSettings),
                              placeholder: "E.g. sk-xxxxxxxxxxxxxxxxx",
                              value: settings.value.gpt_seo_assistant_openai_api_key,
                              onChange: _cache[0] || (_cache[0] = (val) => settings.value.gpt_seo_assistant_openai_api_key = val)
                            }, null, 8, ["disabled", "value"])) : (openBlock(), createBlock(_sfc_main$2, {
                              key: 1,
                              type: "password",
                              class: "tw-h-8",
                              placeholder: "",
                              value: settings.value.gpt_seo_assistant_openai_api_key,
                              readonly: ""
                            }, null, 8, ["value"])),
                            createBaseVNode("div", null, [
                              !hasAddedOpenAIKey.value ? (openBlock(), createBlock(WPButton, {
                                key: 0,
                                class: "tw-h-8 !tw-py-0 tw-whitespace-nowrap",
                                disabled: !settings.value.gpt_seo_assistant_openai_api_key || !unref(canUpdateOpenAIKey),
                                onClick: _cache[1] || (_cache[1] = ($event) => handleUpdateApiKey())
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Save API Key ")
                                ]),
                                _: 1
                              }, 8, ["disabled"])) : (openBlock(), createBlock(WPButton, {
                                key: 1,
                                variant: "secondary",
                                class: "tw-h-8 !tw-py-0 tw-whitespace-nowrap",
                                disabled: !unref(canUpdateOpenAIKey),
                                onClick: _cache[2] || (_cache[2] = ($event) => handleRemoveOpenAIKey())
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Remove API Key ")
                                ]),
                                _: 1
                              }, 8, ["disabled"]))
                            ]),
                            hasAddedOpenAIKey.value ? (openBlock(), createElementBlock("div", _hoisted_11, [
                              createVNode(WPButton, {
                                variant: "secondary",
                                class: "tw-h-8 !tw-py-0 tw-whitespace-nowrap",
                                disabled: !unref(canUpdateOpenAIKey),
                                onClick: _cache[3] || (_cache[3] = ($event) => handleTestOpenAIKey())
                              }, {
                                default: withCtx(() => [
                                  createTextVNode(" Test API Key ")
                                ]),
                                _: 1
                              }, 8, ["disabled"])
                            ])) : createCommentVNode("", true)
                          ])
                        ]),
                        _: 1
                      })
                    ]),
                    _hoisted_12
                  ])
                ])
              ]),
              _: 1
            }),
            createVNode(_sfc_main$3, { class: "tw-mt-6" }, {
              title: withCtx(() => [
                _hoisted_13,
                _hoisted_14
              ]),
              content: withCtx(() => [
                createBaseVNode("div", _hoisted_15, [
                  createBaseVNode("div", _hoisted_16, [
                    isLoading.value || isUpdatingSettings.value ? (openBlock(), createBlock(WPLoadingBar, { key: 0 })) : createCommentVNode("", true)
                  ]),
                  createBaseVNode("div", _hoisted_17, [
                    _hoisted_18,
                    createBaseVNode("div", _hoisted_19, [
                      createVNode(WPFormGroup, {
                        for: "business-name",
                        title: "Business/Website name (max 100 characters)"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$2, {
                            id: "business-name",
                            class: "tw-h-8",
                            type: "text",
                            maxlength: "100",
                            placeholder: "Enter your business/website name...",
                            value: settings.value.gpt_seo_assistant_business_name,
                            onChange: _cache[4] || (_cache[4] = (val) => settings.value.gpt_seo_assistant_business_name = val)
                          }, null, 8, ["value"])
                        ]),
                        _: 1
                      })
                    ]),
                    createBaseVNode("div", _hoisted_20, [
                      createVNode(WPFormGroup, {
                        for: "business-description",
                        title: "Describe your business in a couple of sentences (max 500 characters)"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$b, {
                            id: "business-description",
                            type: "text",
                            maxlength: "500",
                            disabled: isLoading.value,
                            placeholder: "Description...",
                            value: settings.value.gpt_seo_assistant_business_description,
                            onChange: _cache[5] || (_cache[5] = (val) => settings.value.gpt_seo_assistant_business_description = val)
                          }, null, 8, ["disabled", "value"])
                        ]),
                        _: 1
                      })
                    ]),
                    createBaseVNode("div", _hoisted_21, [
                      createVNode(WPFormGroup, {
                        for: "business-tonality",
                        title: "Tone of your business",
                        description: "What is the tone of your business? Is it formal, casual, or something else?"
                      }, {
                        default: withCtx(() => [
                          createVNode(_sfc_main$6, {
                            id: "business-tonality",
                            options: tonalityOptions.value,
                            value: settings.value.gpt_seo_assistant_business_tonality,
                            onChange: _cache[6] || (_cache[6] = (val) => settings.value.gpt_seo_assistant_business_tonality = val)
                          }, null, 8, ["options", "value"])
                        ]),
                        _: 1
                      })
                    ]),
                    createBaseVNode("div", _hoisted_22, [
                      createVNode(WPButton, {
                        disabled: !unref(canUpdateSettings),
                        onClick: _cache[7] || (_cache[7] = ($event) => handleUpdateSettings())
                      }, {
                        default: withCtx(() => [
                          createTextVNode(" Save changes ")
                        ]),
                        _: 1
                      }, 8, ["disabled"])
                    ])
                  ])
                ])
              ]),
              _: 1
            })
          ]),
          createBaseVNode("div", _hoisted_23, [
            createVNode(_sfc_main$3, null, {
              title: withCtx(() => [
                _hoisted_24
              ]),
              content: withCtx(() => [
                createBaseVNode("div", _hoisted_25, [
                  createBaseVNode("div", _hoisted_26, [
                    _hoisted_27,
                    createBaseVNode("div", _hoisted_28, [
                      createVNode(WPButton, {
                        variant: "secondary",
                        target: "_blank",
                        as: "a",
                        href: "https://www.paypal.com/donate/?hosted_button_id=ZM78S72YLNBH8"
                      }, {
                        default: withCtx(() => [
                          _hoisted_29,
                          createTextVNode(" Donate with PayPal ")
                        ]),
                        _: 1
                      })
                    ])
                  ])
                ])
              ]),
              _: 1
            })
          ])
        ]);
      };
    }
  });
  const _hoisted_1 = { id: "wpAIAssistantWrap" };
  const _hoisted_2 = {
    key: 0,
    class: "wrap"
  };
  const _hoisted_3 = { id: "poststuff" };
  const _hoisted_4 = { key: 1 };
  const _sfc_main = /* @__PURE__ */ defineComponent({
    __name: "App",
    props: {
      type: null
    },
    setup(__props) {
      const props = __props;
      return (_ctx, _cache) => {
        return openBlock(), createElementBlock("div", _hoisted_1, [
          props.type === "settings" ? (openBlock(), createElementBlock("div", _hoisted_2, [
            createBaseVNode("div", _hoisted_3, [
              createVNode(_sfc_main$1)
            ])
          ])) : createCommentVNode("", true),
          props.type === "metabox" ? (openBlock(), createElementBlock("div", _hoisted_4, [
            createVNode(_sfc_main$4)
          ])) : createCommentVNode("", true)
        ]);
      };
    }
  });
  const App_vue_vue_type_style_index_0_lang = "";
  const settingsElement = document.getElementById("wpGPTSEOAssistant");
  const metaBoxElement = document.querySelector("#wpAIAssistantMetaBox .inside #wpAIAssistantMetaBoxVueApp");
  if (settingsElement || metaBoxElement) {
    if (settingsElement) {
      const app = createApp(_sfc_main, {
        type: "settings"
      });
      app.mount(settingsElement);
    } else if (metaBoxElement) {
      const app = createApp(_sfc_main, {
        type: "metabox"
      });
      app.mount(metaBoxElement);
    }
  }
})();
