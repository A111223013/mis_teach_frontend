import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule
} from "./chunk-MZMBBY6G.js";
import {
  IconDirective
} from "./chunk-5JTKBEOG.js";
import "./chunk-X4SESWVS.js";
import "./chunk-7AR5RC5D.js";
import {
  AsyncPipe,
  DOCUMENT,
  NgClass,
  NgOptimizedImage,
  NgStyle,
  NgTemplateOutlet,
  isPlatformBrowser,
  isPlatformServer
} from "./chunk-YGKQ56QL.js";
import {
  ANIMATION_MODULE_TYPE,
  APP_ID,
  BehaviorSubject,
  CSP_NONCE,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  HostBinding,
  HostListener,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  NgZone,
  Observable,
  Optional,
  Output,
  PLATFORM_ID,
  Pipe,
  QueryList,
  Renderer2,
  RendererFactory2,
  ReplaySubject,
  RuntimeError,
  Subject,
  Subscription,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation$1,
  afterNextRender,
  assertInInjectionContext,
  booleanAttribute,
  combineLatest,
  computed,
  concat,
  contentChild,
  contentChildren,
  debounceTime,
  distinctUntilChanged,
  effect,
  filter,
  finalize,
  forwardRef,
  fromEvent,
  inject,
  input,
  isObservable,
  isSignal,
  map,
  merge,
  model,
  numberAttribute,
  of,
  output,
  setClassMetadata,
  signal,
  skip,
  startWith,
  take,
  takeUntil,
  takeWhile,
  tap,
  untracked,
  viewChild,
  withLatestFrom,
  zipWith,
  ɵɵHostDirectivesFeature,
  ɵɵInheritDefinitionFeature,
  ɵɵInputTransformsFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵStandaloneFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵcontentQuery,
  ɵɵcontentQuerySignal,
  ɵɵdefer,
  ɵɵdeferOnIdle,
  ɵɵdeferPrefetchOnIdle,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdefinePipe,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementContainer,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵhostProperty,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵpropertyInterpolate,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵqueryAdvance,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵresolveDocument,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleMap,
  ɵɵstyleProp,
  ɵɵsyntheticHostListener,
  ɵɵsyntheticHostProperty,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery,
  ɵɵviewQuerySignal
} from "./chunk-HYVAQTQD.js";
import {
  __privateAdd,
  __privateGet,
  __privateMethod,
  __privateSet,
  __spreadProps,
  __spreadValues
} from "./chunk-6WCCERUZ.js";

// node_modules/@angular/animations/fesm2022/animations.mjs
var AnimationMetadataType;
(function(AnimationMetadataType2) {
  AnimationMetadataType2[AnimationMetadataType2["State"] = 0] = "State";
  AnimationMetadataType2[AnimationMetadataType2["Transition"] = 1] = "Transition";
  AnimationMetadataType2[AnimationMetadataType2["Sequence"] = 2] = "Sequence";
  AnimationMetadataType2[AnimationMetadataType2["Group"] = 3] = "Group";
  AnimationMetadataType2[AnimationMetadataType2["Animate"] = 4] = "Animate";
  AnimationMetadataType2[AnimationMetadataType2["Keyframes"] = 5] = "Keyframes";
  AnimationMetadataType2[AnimationMetadataType2["Style"] = 6] = "Style";
  AnimationMetadataType2[AnimationMetadataType2["Trigger"] = 7] = "Trigger";
  AnimationMetadataType2[AnimationMetadataType2["Reference"] = 8] = "Reference";
  AnimationMetadataType2[AnimationMetadataType2["AnimateChild"] = 9] = "AnimateChild";
  AnimationMetadataType2[AnimationMetadataType2["AnimateRef"] = 10] = "AnimateRef";
  AnimationMetadataType2[AnimationMetadataType2["Query"] = 11] = "Query";
  AnimationMetadataType2[AnimationMetadataType2["Stagger"] = 12] = "Stagger";
})(AnimationMetadataType || (AnimationMetadataType = {}));
function trigger(name, definitions) {
  return {
    type: AnimationMetadataType.Trigger,
    name,
    definitions,
    options: {}
  };
}
function animate(timings, styles = null) {
  return {
    type: AnimationMetadataType.Animate,
    styles,
    timings
  };
}
function group(steps, options = null) {
  return {
    type: AnimationMetadataType.Group,
    steps,
    options
  };
}
function sequence(steps, options = null) {
  return {
    type: AnimationMetadataType.Sequence,
    steps,
    options
  };
}
function style(tokens) {
  return {
    type: AnimationMetadataType.Style,
    styles: tokens,
    offset: null
  };
}
function state(name, styles, options) {
  return {
    type: AnimationMetadataType.State,
    name,
    styles,
    options
  };
}
function transition(stateChangeExpr, steps, options = null) {
  return {
    type: AnimationMetadataType.Transition,
    expr: stateChangeExpr,
    animation: steps,
    options
  };
}
function animation(steps, options = null) {
  return {
    type: AnimationMetadataType.Reference,
    animation: steps,
    options
  };
}
function useAnimation(animation2, options = null) {
  return {
    type: AnimationMetadataType.AnimateRef,
    animation: animation2,
    options
  };
}
function query(selector, animation2, options = null) {
  return {
    type: AnimationMetadataType.Query,
    selector,
    animation: animation2,
    options
  };
}
var _AnimationBuilder = class _AnimationBuilder {
};
_AnimationBuilder.ɵfac = function AnimationBuilder_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AnimationBuilder)();
};
_AnimationBuilder.ɵprov = ɵɵdefineInjectable({
  token: _AnimationBuilder,
  factory: () => (() => inject(BrowserAnimationBuilder))(),
  providedIn: "root"
});
var AnimationBuilder = _AnimationBuilder;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root",
      useFactory: () => inject(BrowserAnimationBuilder)
    }]
  }], null, null);
})();
var AnimationFactory = class {
};
var _BrowserAnimationBuilder = class _BrowserAnimationBuilder extends AnimationBuilder {
  constructor(rootRenderer, doc) {
    super();
    this.animationModuleType = inject(ANIMATION_MODULE_TYPE, {
      optional: true
    });
    this._nextAnimationId = 0;
    const typeData = {
      id: "0",
      encapsulation: ViewEncapsulation$1.None,
      styles: [],
      data: {
        animation: []
      }
    };
    this._renderer = rootRenderer.createRenderer(doc.body, typeData);
    if (this.animationModuleType === null && !isAnimationRenderer(this._renderer)) {
      throw new RuntimeError(3600, (typeof ngDevMode === "undefined" || ngDevMode) && "Angular detected that the `AnimationBuilder` was injected, but animation support was not enabled. Please make sure that you enable animations in your application by calling `provideAnimations()` or `provideAnimationsAsync()` function.");
    }
  }
  build(animation2) {
    const id = this._nextAnimationId;
    this._nextAnimationId++;
    const entry = Array.isArray(animation2) ? sequence(animation2) : animation2;
    issueAnimationCommand(this._renderer, null, id, "register", [entry]);
    return new BrowserAnimationFactory(id, this._renderer);
  }
};
_BrowserAnimationBuilder.ɵfac = function BrowserAnimationBuilder_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BrowserAnimationBuilder)(ɵɵinject(RendererFactory2), ɵɵinject(DOCUMENT));
};
_BrowserAnimationBuilder.ɵprov = ɵɵdefineInjectable({
  token: _BrowserAnimationBuilder,
  factory: _BrowserAnimationBuilder.ɵfac,
  providedIn: "root"
});
var BrowserAnimationBuilder = _BrowserAnimationBuilder;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BrowserAnimationBuilder, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: RendererFactory2
  }, {
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], null);
})();
var BrowserAnimationFactory = class extends AnimationFactory {
  constructor(_id, _renderer4) {
    super();
    this._id = _id;
    this._renderer = _renderer4;
  }
  create(element, options) {
    return new RendererAnimationPlayer(this._id, element, options || {}, this._renderer);
  }
};
var RendererAnimationPlayer = class {
  constructor(id, element, options, _renderer4) {
    this.id = id;
    this.element = element;
    this._renderer = _renderer4;
    this.parentPlayer = null;
    this._started = false;
    this.totalTime = 0;
    this._command("create", options);
  }
  _listen(eventName, callback) {
    return this._renderer.listen(this.element, `@@${this.id}:${eventName}`, callback);
  }
  _command(command, ...args) {
    issueAnimationCommand(this._renderer, this.element, this.id, command, args);
  }
  onDone(fn2) {
    this._listen("done", fn2);
  }
  onStart(fn2) {
    this._listen("start", fn2);
  }
  onDestroy(fn2) {
    this._listen("destroy", fn2);
  }
  init() {
    this._command("init");
  }
  hasStarted() {
    return this._started;
  }
  play() {
    this._command("play");
    this._started = true;
  }
  pause() {
    this._command("pause");
  }
  restart() {
    this._command("restart");
  }
  finish() {
    this._command("finish");
  }
  destroy() {
    this._command("destroy");
  }
  reset() {
    this._command("reset");
    this._started = false;
  }
  setPosition(p) {
    this._command("setPosition", p);
  }
  getPosition() {
    return unwrapAnimationRenderer(this._renderer)?.engine?.players[this.id]?.getPosition() ?? 0;
  }
};
function issueAnimationCommand(renderer, element, id, command, args) {
  renderer.setProperty(element, `@@${id}:${command}`, args);
}
function unwrapAnimationRenderer(renderer) {
  const type = renderer.ɵtype;
  if (type === 0) {
    return renderer;
  } else if (type === 1) {
    return renderer.animationRenderer;
  }
  return null;
}
function isAnimationRenderer(renderer) {
  const type = renderer.ɵtype;
  return type === 0 || type === 1;
}

// node_modules/@angular/core/fesm2022/rxjs-interop.mjs
function takeUntilDestroyed(destroyRef) {
  if (!destroyRef) {
    assertInInjectionContext(takeUntilDestroyed);
    destroyRef = inject(DestroyRef);
  }
  const destroyed$ = new Observable((observer) => {
    const unregisterFn = destroyRef.onDestroy(observer.next.bind(observer));
    return unregisterFn;
  });
  return (source) => {
    return source.pipe(takeUntil(destroyed$));
  };
}
function toObservable(source, options) {
  !options?.injector && assertInInjectionContext(toObservable);
  const injector = options?.injector ?? inject(Injector);
  const subject = new ReplaySubject(1);
  const watcher = effect(() => {
    let value;
    try {
      value = source();
    } catch (err) {
      untracked(() => subject.error(err));
      return;
    }
    untracked(() => subject.next(value));
  }, {
    injector,
    manualCleanup: true
  });
  injector.get(DestroyRef).onDestroy(() => {
    watcher.destroy();
    subject.complete();
  });
  return subject.asObservable();
}

// node_modules/@popperjs/core/lib/enums.js
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];

// node_modules/@popperjs/core/lib/dom-utils/getNodeName.js
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}

// node_modules/@popperjs/core/lib/dom-utils/getWindow.js
function getWindow(node) {
  if (node == null) {
    return window;
  }
  if (node.toString() !== "[object Window]") {
    var ownerDocument = node.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node;
}

// node_modules/@popperjs/core/lib/dom-utils/instanceOf.js
function isElement(node) {
  var OwnElement = getWindow(node).Element;
  return node instanceof OwnElement || node instanceof Element;
}
function isHTMLElement(node) {
  var OwnElement = getWindow(node).HTMLElement;
  return node instanceof OwnElement || node instanceof HTMLElement;
}
function isShadowRoot(node) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node).ShadowRoot;
  return node instanceof OwnElement || node instanceof ShadowRoot;
}

// node_modules/@popperjs/core/lib/modifiers/applyStyles.js
function applyStyles(_ref) {
  var state2 = _ref.state;
  Object.keys(state2.elements).forEach(function(name) {
    var style2 = state2.styles[name] || {};
    var attributes = state2.attributes[name] || {};
    var element = state2.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style2);
    Object.keys(attributes).forEach(function(name2) {
      var value = attributes[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect2(_ref2) {
  var state2 = _ref2.state;
  var initialStyles = {
    popper: {
      position: state2.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state2.elements.popper.style, initialStyles.popper);
  state2.styles = initialStyles;
  if (state2.elements.arrow) {
    Object.assign(state2.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state2.elements).forEach(function(name) {
      var element = state2.elements[name];
      var attributes = state2.attributes[name] || {};
      var styleProperties = Object.keys(state2.styles.hasOwnProperty(name) ? state2.styles[name] : initialStyles[name]);
      var style2 = styleProperties.reduce(function(style3, property) {
        style3[property] = "";
        return style3;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style2);
      Object.keys(attributes).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles_default = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect2,
  requires: ["computeStyles"]
};

// node_modules/@popperjs/core/lib/utils/getBasePlacement.js
function getBasePlacement(placement) {
  return placement.split("-")[0];
}

// node_modules/@popperjs/core/lib/utils/math.js
var max = Math.max;
var min = Math.min;
var round = Math.round;

// node_modules/@popperjs/core/lib/utils/userAgent.js
function getUAString() {
  var uaData = navigator.userAgentData;
  if (uaData != null && uaData.brands && Array.isArray(uaData.brands)) {
    return uaData.brands.map(function(item) {
      return item.brand + "/" + item.version;
    }).join(" ");
  }
  return navigator.userAgent;
}

// node_modules/@popperjs/core/lib/dom-utils/isLayoutViewport.js
function isLayoutViewport() {
  return !/^((?!chrome|android).)*safari/i.test(getUAString());
}

// node_modules/@popperjs/core/lib/dom-utils/getBoundingClientRect.js
function getBoundingClientRect(element, includeScale, isFixedStrategy) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  var clientRect = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (includeScale && isHTMLElement(element)) {
    scaleX = element.offsetWidth > 0 ? round(clientRect.width) / element.offsetWidth || 1 : 1;
    scaleY = element.offsetHeight > 0 ? round(clientRect.height) / element.offsetHeight || 1 : 1;
  }
  var _ref = isElement(element) ? getWindow(element) : window, visualViewport = _ref.visualViewport;
  var addVisualOffsets = !isLayoutViewport() && isFixedStrategy;
  var x = (clientRect.left + (addVisualOffsets && visualViewport ? visualViewport.offsetLeft : 0)) / scaleX;
  var y = (clientRect.top + (addVisualOffsets && visualViewport ? visualViewport.offsetTop : 0)) / scaleY;
  var width = clientRect.width / scaleX;
  var height = clientRect.height / scaleY;
  return {
    width,
    height,
    top: y,
    right: x + width,
    bottom: y + height,
    left: x,
    x,
    y
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getLayoutRect.js
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}

// node_modules/@popperjs/core/lib/dom-utils/contains.js
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}

// node_modules/@popperjs/core/lib/dom-utils/getComputedStyle.js
function getComputedStyle2(element) {
  return getWindow(element).getComputedStyle(element);
}

// node_modules/@popperjs/core/lib/dom-utils/isTableElement.js
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentElement.js
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : (
    // $FlowFixMe[prop-missing]
    element.document
  )) || window.document).documentElement;
}

// node_modules/@popperjs/core/lib/dom-utils/getParentNode.js
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return (
    // this is a quicker (but less type safe) way to save quite some bytes from the bundle
    // $FlowFixMe[incompatible-return]
    // $FlowFixMe[prop-missing]
    element.assignedSlot || // step into the shadow DOM of the parent of a slotted node
    element.parentNode || // DOM Element detected
    (isShadowRoot(element) ? element.host : null) || // ShadowRoot detected
    // $FlowFixMe[incompatible-call]: HTMLElement is a Node
    getDocumentElement(element)
  );
}

// node_modules/@popperjs/core/lib/dom-utils/getOffsetParent.js
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || // https://github.com/popperjs/popper-core/issues/837
  getComputedStyle2(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = /firefox/i.test(getUAString());
  var isIE = /Trident/i.test(getUAString());
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle2(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  if (isShadowRoot(currentNode)) {
    currentNode = currentNode.host;
  }
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle2(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle2(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle2(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}

// node_modules/@popperjs/core/lib/utils/getMainAxisFromPlacement.js
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}

// node_modules/@popperjs/core/lib/utils/within.js
function within(min2, value, max2) {
  return max(min2, min(value, max2));
}
function withinMaxClamp(min2, value, max2) {
  var v = within(min2, value, max2);
  return v > max2 ? max2 : v;
}

// node_modules/@popperjs/core/lib/utils/getFreshSideObject.js
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}

// node_modules/@popperjs/core/lib/utils/mergePaddingObject.js
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}

// node_modules/@popperjs/core/lib/utils/expandToHashMap.js
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}

// node_modules/@popperjs/core/lib/modifiers/arrow.js
var toPaddingObject = function toPaddingObject2(padding, state2) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state2.rects, {
    placement: state2.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state2 = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state2.elements.arrow;
  var popperOffsets2 = state2.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state2.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state2);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state2.rects.reference[len] + state2.rects.reference[axis] - popperOffsets2[axis] - state2.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state2.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state2.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect3(_ref2) {
  var state2 = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state2.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state2.elements.popper, arrowElement)) {
    return;
  }
  state2.elements.arrow = arrowElement;
}
var arrow_default = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect3,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};

// node_modules/@popperjs/core/lib/utils/getVariation.js
function getVariation(placement) {
  return placement.split("-")[1];
}

// node_modules/@popperjs/core/lib/modifiers/computeStyles.js
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref, win) {
  var x = _ref.x, y = _ref.y;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _offsets$x = offsets.x, x = _offsets$x === void 0 ? 0 : _offsets$x, _offsets$y = offsets.y, y = _offsets$y === void 0 ? 0 : _offsets$y;
  var _ref3 = typeof roundOffsets === "function" ? roundOffsets({
    x,
    y
  }) : {
    x,
    y
  };
  x = _ref3.x;
  y = _ref3.y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle2(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.height : (
        // $FlowFixMe[prop-missing]
        offsetParent[heightProp]
      );
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && offsetParent === win && win.visualViewport ? win.visualViewport.width : (
        // $FlowFixMe[prop-missing]
        offsetParent[widthProp]
      );
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  var _ref4 = roundOffsets === true ? roundOffsetsByDPR({
    x,
    y
  }, getWindow(popper2)) : {
    x,
    y
  };
  x = _ref4.x;
  y = _ref4.y;
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref5) {
  var state2 = _ref5.state, options = _ref5.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state2.placement),
    variation: getVariation(state2.placement),
    popper: state2.elements.popper,
    popperRect: state2.rects.popper,
    gpuAcceleration,
    isFixed: state2.options.strategy === "fixed"
  };
  if (state2.modifiersData.popperOffsets != null) {
    state2.styles.popper = Object.assign({}, state2.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state2.modifiersData.popperOffsets,
      position: state2.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state2.modifiersData.arrow != null) {
    state2.styles.arrow = Object.assign({}, state2.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state2.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state2.attributes.popper = Object.assign({}, state2.attributes.popper, {
    "data-popper-placement": state2.placement
  });
}
var computeStyles_default = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};

// node_modules/@popperjs/core/lib/modifiers/eventListeners.js
var passive = {
  passive: true
};
function effect4(_ref) {
  var state2 = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state2.elements.popper);
  var scrollParents = [].concat(state2.scrollParents.reference, state2.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners_default = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect: effect4,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getOppositePlacement.js
var hash = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash[matched];
  });
}

// node_modules/@popperjs/core/lib/utils/getOppositeVariationPlacement.js
var hash2 = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash2[matched];
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScroll.js
function getWindowScroll(node) {
  var win = getWindow(node);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getWindowScrollBarX.js
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}

// node_modules/@popperjs/core/lib/dom-utils/getViewportRect.js
function getViewportRect(element, strategy) {
  var win = getWindow(element);
  var html = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html.clientWidth;
  var height = html.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    var layoutViewport = isLayoutViewport();
    if (layoutViewport || !layoutViewport && strategy === "fixed") {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getDocumentRect.js
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html.scrollWidth, html.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html.scrollHeight, html.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle2(body || html).direction === "rtl") {
    x += max(html.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}

// node_modules/@popperjs/core/lib/dom-utils/isScrollParent.js
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle2(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}

// node_modules/@popperjs/core/lib/dom-utils/getScrollParent.js
function getScrollParent(node) {
  if (["html", "body", "#document"].indexOf(getNodeName(node)) >= 0) {
    return node.ownerDocument.body;
  }
  if (isHTMLElement(node) && isScrollParent(node)) {
    return node;
  }
  return getScrollParent(getParentNode(node));
}

// node_modules/@popperjs/core/lib/dom-utils/listScrollParents.js
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target);
  return isBody ? updatedList : (
    // $FlowFixMe[incompatible-call]: isBody tells us target will be an HTMLElement here
    updatedList.concat(listScrollParents(getParentNode(target)))
  );
}

// node_modules/@popperjs/core/lib/utils/rectToClientRect.js
function rectToClientRect(rect) {
  return Object.assign({}, rect, {
    left: rect.x,
    top: rect.y,
    right: rect.x + rect.width,
    bottom: rect.y + rect.height
  });
}

// node_modules/@popperjs/core/lib/dom-utils/getClippingRect.js
function getInnerBoundingClientRect(element, strategy) {
  var rect = getBoundingClientRect(element, false, strategy === "fixed");
  rect.top = rect.top + element.clientTop;
  rect.left = rect.left + element.clientLeft;
  rect.bottom = rect.top + element.clientHeight;
  rect.right = rect.left + element.clientWidth;
  rect.width = element.clientWidth;
  rect.height = element.clientHeight;
  rect.x = rect.left;
  rect.y = rect.top;
  return rect;
}
function getClientRectFromMixedType(element, clippingParent, strategy) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element, strategy)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent, strategy) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle2(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body";
  });
}
function getClippingRect(element, boundary, rootBoundary, strategy) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect = getClientRectFromMixedType(element, clippingParent, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent, strategy));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}

// node_modules/@popperjs/core/lib/utils/computeOffsets.js
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
      default:
    }
  }
  return offsets;
}

// node_modules/@popperjs/core/lib/utils/detectOverflow.js
function detectOverflow(state2, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state2.placement : _options$placement, _options$strategy = _options.strategy, strategy = _options$strategy === void 0 ? state2.strategy : _options$strategy, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state2.rects.popper;
  var element = state2.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state2.elements.popper), boundary, rootBoundary, strategy);
  var referenceClientRect = getBoundingClientRect(state2.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state2.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}

// node_modules/@popperjs/core/lib/utils/computeAutoPlacement.js
function computeAutoPlacement(state2, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements2 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements2.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements2;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state2, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}

// node_modules/@popperjs/core/lib/modifiers/flip.js
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state2 = _ref.state, options = _ref.options, name = _ref.name;
  if (state2.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state2.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state2, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state2.rects.reference;
  var popperRect = state2.rects.popper;
  var checksMap = /* @__PURE__ */ new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state2, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check) {
      return check;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check) {
            return check;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break") break;
    }
  }
  if (state2.placement !== firstFittingPlacement) {
    state2.modifiersData[name]._skip = true;
    state2.placement = firstFittingPlacement;
    state2.reset = true;
  }
}
var flip_default = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};

// node_modules/@popperjs/core/lib/modifiers/hide.js
function getSideOffsets(overflow, rect, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect.height - preventedOffsets.y,
    right: overflow.right - rect.width + preventedOffsets.x,
    bottom: overflow.bottom - rect.height + preventedOffsets.y,
    left: overflow.left - rect.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state2 = _ref.state, name = _ref.name;
  var referenceRect = state2.rects.reference;
  var popperRect = state2.rects.popper;
  var preventedOffsets = state2.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state2, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state2, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state2.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state2.attributes.popper = Object.assign({}, state2.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide_default = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};

// node_modules/@popperjs/core/lib/modifiers/offset.js
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state2 = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state2.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state2.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state2.modifiersData.popperOffsets != null) {
    state2.modifiersData.popperOffsets.x += x;
    state2.modifiersData.popperOffsets.y += y;
  }
  state2.modifiersData[name] = data;
}
var offset_default = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};

// node_modules/@popperjs/core/lib/modifiers/popperOffsets.js
function popperOffsets(_ref) {
  var state2 = _ref.state, name = _ref.name;
  state2.modifiersData[name] = computeOffsets({
    reference: state2.rects.reference,
    element: state2.rects.popper,
    strategy: "absolute",
    placement: state2.placement
  });
}
var popperOffsets_default = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};

// node_modules/@popperjs/core/lib/utils/getAltAxis.js
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}

// node_modules/@popperjs/core/lib/modifiers/preventOverflow.js
function preventOverflow(_ref) {
  var state2 = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state2, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state2.placement);
  var variation = getVariation(state2.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state2.modifiersData.popperOffsets;
  var referenceRect = state2.rects.reference;
  var popperRect = state2.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state2.rects, {
    placement: state2.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state2.modifiersData.offset ? state2.modifiersData.offset[state2.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min2 = offset2 + overflow[mainSide];
    var max2 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state2.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state2.modifiersData["arrow#persistent"] ? state2.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state2.elements.arrow && getOffsetParent(state2.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min2, tetherMin) : min2, offset2, tether ? max(max2, tetherMax) : max2);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min2 = _offset + overflow[_mainSide];
    var _max2 = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min2 : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max2;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min2, _offset, tether ? _tetherMax : _max2);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state2.modifiersData[name] = data;
}
var preventOverflow_default = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};

// node_modules/@popperjs/core/lib/dom-utils/getHTMLElementScroll.js
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}

// node_modules/@popperjs/core/lib/dom-utils/getNodeScroll.js
function getNodeScroll(node) {
  if (node === getWindow(node) || !isHTMLElement(node)) {
    return getWindowScroll(node);
  } else {
    return getHTMLElementScroll(node);
  }
}

// node_modules/@popperjs/core/lib/dom-utils/getCompositeRect.js
function isElementScaled(element) {
  var rect = element.getBoundingClientRect();
  var scaleX = round(rect.width) / element.offsetWidth || 1;
  var scaleY = round(rect.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled, isFixed);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || // https://github.com/popperjs/popper-core/issues/1078
    isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect.left + scroll.scrollLeft - offsets.x,
    y: rect.top + scroll.scrollTop - offsets.y,
    width: rect.width,
    height: rect.height
  };
}

// node_modules/@popperjs/core/lib/utils/orderModifiers.js
function order(modifiers) {
  var map2 = /* @__PURE__ */ new Map();
  var visited = /* @__PURE__ */ new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map2.set(modifier.name, modifier);
  });
  function sort(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map2.get(dep);
        if (depModifier) {
          sort(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}

// node_modules/@popperjs/core/lib/utils/debounce.js
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve(fn2());
        });
      });
    }
    return pending;
  };
}

// node_modules/@popperjs/core/lib/utils/mergeByName.js
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}

// node_modules/@popperjs/core/lib/createPopper.js
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers3 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper4(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions;
    }
    var state2 = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state: state2,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state2.options) : setOptionsAction;
        cleanupModifierEffects();
        state2.options = Object.assign({}, defaultOptions, state2.options, options2);
        state2.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers3, state2.options.modifiers)));
        state2.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      // Sync update – it will always be executed, even if not necessary. This
      // is useful for low frequency updates where sync behavior simplifies the
      // logic.
      // For high frequency updates (e.g. `resize` and `scroll` events), always
      // prefer the async Popper#update method
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state2.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state2.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state2.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state2.reset = false;
        state2.placement = state2.options.placement;
        state2.orderedModifiers.forEach(function(modifier) {
          return state2.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index = 0; index < state2.orderedModifiers.length; index++) {
          if (state2.reset === true) {
            state2.reset = false;
            index = -1;
            continue;
          }
          var _state$orderedModifie = state2.orderedModifiers[index], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state2 = fn2({
              state: state2,
              options: _options,
              name,
              instance
            }) || state2;
          }
        }
      },
      // Async and optimistically optimized update – it will not be executed if
      // not necessary (debounced to run at most once-per-tick)
      update: debounce(function() {
        return new Promise(function(resolve) {
          instance.forceUpdate();
          resolve(state2);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state3) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state3);
      }
    });
    function runModifierEffects() {
      state2.orderedModifiers.forEach(function(_ref) {
        var name = _ref.name, _ref$options = _ref.options, options2 = _ref$options === void 0 ? {} : _ref$options, effect5 = _ref.effect;
        if (typeof effect5 === "function") {
          var cleanupFn = effect5({
            state: state2,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var createPopper = popperGenerator();

// node_modules/@popperjs/core/lib/popper-lite.js
var defaultModifiers = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default];
var createPopper2 = popperGenerator({
  defaultModifiers
});

// node_modules/@popperjs/core/lib/popper.js
var defaultModifiers2 = [eventListeners_default, popperOffsets_default, computeStyles_default, applyStyles_default, offset_default, flip_default, preventOverflow_default, arrow_default, hide_default];
var createPopper3 = popperGenerator({
  defaultModifiers: defaultModifiers2
});

// node_modules/@angular/cdk/fesm2022/platform.mjs
var hasV8BreakIterator;
try {
  hasV8BreakIterator = typeof Intl !== "undefined" && Intl.v8BreakIterator;
} catch {
  hasV8BreakIterator = false;
}
var _Platform = class _Platform {
  constructor(_platformId) {
    this._platformId = _platformId;
    this.isBrowser = this._platformId ? isPlatformBrowser(this._platformId) : typeof document === "object" && !!document;
    this.EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
    this.TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
    this.BLINK = this.isBrowser && !!(window.chrome || hasV8BreakIterator) && typeof CSS !== "undefined" && !this.EDGE && !this.TRIDENT;
    this.WEBKIT = this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT;
    this.IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
    this.FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
    this.ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
    this.SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
  }
};
_Platform.ɵfac = function Platform_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _Platform)(ɵɵinject(PLATFORM_ID));
};
_Platform.ɵprov = ɵɵdefineInjectable({
  token: _Platform,
  factory: _Platform.ɵfac,
  providedIn: "root"
});
var Platform = _Platform;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Platform, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Object,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }], null);
})();
var _PlatformModule = class _PlatformModule {
};
_PlatformModule.ɵfac = function PlatformModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PlatformModule)();
};
_PlatformModule.ɵmod = ɵɵdefineNgModule({
  type: _PlatformModule
});
_PlatformModule.ɵinj = ɵɵdefineInjector({});
var PlatformModule = _PlatformModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlatformModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();
var supportsPassiveEvents;
function supportsPassiveEventListeners() {
  if (supportsPassiveEvents == null && typeof window !== "undefined") {
    try {
      window.addEventListener("test", null, Object.defineProperty({}, "passive", {
        get: () => supportsPassiveEvents = true
      }));
    } finally {
      supportsPassiveEvents = supportsPassiveEvents || false;
    }
  }
  return supportsPassiveEvents;
}
function normalizePassiveListenerOptions(options) {
  return supportsPassiveEventListeners() ? options : !!options.capture;
}
var RtlScrollAxisType;
(function(RtlScrollAxisType2) {
  RtlScrollAxisType2[RtlScrollAxisType2["NORMAL"] = 0] = "NORMAL";
  RtlScrollAxisType2[RtlScrollAxisType2["NEGATED"] = 1] = "NEGATED";
  RtlScrollAxisType2[RtlScrollAxisType2["INVERTED"] = 2] = "INVERTED";
})(RtlScrollAxisType || (RtlScrollAxisType = {}));
var shadowDomIsSupported;
function _supportsShadowDom() {
  if (shadowDomIsSupported == null) {
    const head = typeof document !== "undefined" ? document.head : null;
    shadowDomIsSupported = !!(head && (head.createShadowRoot || head.attachShadow));
  }
  return shadowDomIsSupported;
}
function _getShadowRoot(element) {
  if (_supportsShadowDom()) {
    const rootNode = element.getRootNode ? element.getRootNode() : null;
    if (typeof ShadowRoot !== "undefined" && ShadowRoot && rootNode instanceof ShadowRoot) {
      return rootNode;
    }
  }
  return null;
}
function _getFocusedElementPierceShadowDom() {
  let activeElement = typeof document !== "undefined" && document ? document.activeElement : null;
  while (activeElement && activeElement.shadowRoot) {
    const newActiveElement = activeElement.shadowRoot.activeElement;
    if (newActiveElement === activeElement) {
      break;
    } else {
      activeElement = newActiveElement;
    }
  }
  return activeElement;
}
function _getEventTarget(event) {
  return event.composedPath ? event.composedPath()[0] : event.target;
}

// node_modules/@angular/cdk/fesm2022/keycodes.mjs
var TAB = 9;
var SHIFT = 16;
var CONTROL = 17;
var ALT = 18;
var PAGE_UP = 33;
var PAGE_DOWN = 34;
var END = 35;
var HOME = 36;
var LEFT_ARROW = 37;
var UP_ARROW = 38;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;
var ZERO = 48;
var NINE = 57;
var A = 65;
var Z = 90;
var META = 91;
var MAC_META = 224;
function hasModifierKey(event, ...modifiers) {
  if (modifiers.length) {
    return modifiers.some((modifier) => event[modifier]);
  }
  return event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;
}

// node_modules/@angular/cdk/fesm2022/coercion/private.mjs
function coerceObservable(data) {
  if (!isObservable(data)) {
    return of(data);
  }
  return data;
}

// node_modules/@angular/cdk/fesm2022/coercion.mjs
function coerceBooleanProperty(value) {
  return value != null && `${value}` !== "false";
}
function coerceNumberProperty(value, fallbackValue = 0) {
  if (_isNumberValue(value)) {
    return Number(value);
  }
  return arguments.length === 2 ? fallbackValue : 0;
}
function _isNumberValue(value) {
  return !isNaN(parseFloat(value)) && !isNaN(Number(value));
}
function coerceArray(value) {
  return Array.isArray(value) ? value : [value];
}
function coerceElement(elementOrRef) {
  return elementOrRef instanceof ElementRef ? elementOrRef.nativeElement : elementOrRef;
}

// node_modules/@angular/cdk/fesm2022/observers.mjs
function shouldIgnoreRecord(record) {
  if (record.type === "characterData" && record.target instanceof Comment) {
    return true;
  }
  if (record.type === "childList") {
    for (let i = 0; i < record.addedNodes.length; i++) {
      if (!(record.addedNodes[i] instanceof Comment)) {
        return false;
      }
    }
    for (let i = 0; i < record.removedNodes.length; i++) {
      if (!(record.removedNodes[i] instanceof Comment)) {
        return false;
      }
    }
    return true;
  }
  return false;
}
var _MutationObserverFactory = class _MutationObserverFactory {
  create(callback) {
    return typeof MutationObserver === "undefined" ? null : new MutationObserver(callback);
  }
};
_MutationObserverFactory.ɵfac = function MutationObserverFactory_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _MutationObserverFactory)();
};
_MutationObserverFactory.ɵprov = ɵɵdefineInjectable({
  token: _MutationObserverFactory,
  factory: _MutationObserverFactory.ɵfac,
  providedIn: "root"
});
var MutationObserverFactory = _MutationObserverFactory;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MutationObserverFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _ContentObserver = class _ContentObserver {
  constructor(_mutationObserverFactory) {
    this._mutationObserverFactory = _mutationObserverFactory;
    this._observedElements = /* @__PURE__ */ new Map();
    this._ngZone = inject(NgZone);
  }
  ngOnDestroy() {
    this._observedElements.forEach((_, element) => this._cleanupObserver(element));
  }
  observe(elementOrRef) {
    const element = coerceElement(elementOrRef);
    return new Observable((observer) => {
      const stream = this._observeElement(element);
      const subscription = stream.pipe(map((records) => records.filter((record) => !shouldIgnoreRecord(record))), filter((records) => !!records.length)).subscribe((records) => {
        this._ngZone.run(() => {
          observer.next(records);
        });
      });
      return () => {
        subscription.unsubscribe();
        this._unobserveElement(element);
      };
    });
  }
  /**
   * Observes the given element by using the existing MutationObserver if available, or creating a
   * new one if not.
   */
  _observeElement(element) {
    return this._ngZone.runOutsideAngular(() => {
      if (!this._observedElements.has(element)) {
        const stream = new Subject();
        const observer = this._mutationObserverFactory.create((mutations) => stream.next(mutations));
        if (observer) {
          observer.observe(element, {
            characterData: true,
            childList: true,
            subtree: true
          });
        }
        this._observedElements.set(element, {
          observer,
          stream,
          count: 1
        });
      } else {
        this._observedElements.get(element).count++;
      }
      return this._observedElements.get(element).stream;
    });
  }
  /**
   * Un-observes the given element and cleans up the underlying MutationObserver if nobody else is
   * observing this element.
   */
  _unobserveElement(element) {
    if (this._observedElements.has(element)) {
      this._observedElements.get(element).count--;
      if (!this._observedElements.get(element).count) {
        this._cleanupObserver(element);
      }
    }
  }
  /** Clean up the underlying MutationObserver for the specified element. */
  _cleanupObserver(element) {
    if (this._observedElements.has(element)) {
      const {
        observer,
        stream
      } = this._observedElements.get(element);
      if (observer) {
        observer.disconnect();
      }
      stream.complete();
      this._observedElements.delete(element);
    }
  }
};
_ContentObserver.ɵfac = function ContentObserver_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ContentObserver)(ɵɵinject(MutationObserverFactory));
};
_ContentObserver.ɵprov = ɵɵdefineInjectable({
  token: _ContentObserver,
  factory: _ContentObserver.ɵfac,
  providedIn: "root"
});
var ContentObserver = _ContentObserver;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContentObserver, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: MutationObserverFactory
  }], null);
})();
var _CdkObserveContent = class _CdkObserveContent {
  /**
   * Whether observing content is disabled. This option can be used
   * to disconnect the underlying MutationObserver until it is needed.
   */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this._disabled ? this._unsubscribe() : this._subscribe();
  }
  /** Debounce interval for emitting the changes. */
  get debounce() {
    return this._debounce;
  }
  set debounce(value) {
    this._debounce = coerceNumberProperty(value);
    this._subscribe();
  }
  constructor(_contentObserver, _elementRef5) {
    this._contentObserver = _contentObserver;
    this._elementRef = _elementRef5;
    this.event = new EventEmitter();
    this._disabled = false;
    this._currentSubscription = null;
  }
  ngAfterContentInit() {
    if (!this._currentSubscription && !this.disabled) {
      this._subscribe();
    }
  }
  ngOnDestroy() {
    this._unsubscribe();
  }
  _subscribe() {
    this._unsubscribe();
    const stream = this._contentObserver.observe(this._elementRef);
    this._currentSubscription = (this.debounce ? stream.pipe(debounceTime(this.debounce)) : stream).subscribe(this.event);
  }
  _unsubscribe() {
    this._currentSubscription?.unsubscribe();
  }
};
_CdkObserveContent.ɵfac = function CdkObserveContent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CdkObserveContent)(ɵɵdirectiveInject(ContentObserver), ɵɵdirectiveInject(ElementRef));
};
_CdkObserveContent.ɵdir = ɵɵdefineDirective({
  type: _CdkObserveContent,
  selectors: [["", "cdkObserveContent", ""]],
  inputs: {
    disabled: [2, "cdkObserveContentDisabled", "disabled", booleanAttribute],
    debounce: "debounce"
  },
  outputs: {
    event: "cdkObserveContent"
  },
  exportAs: ["cdkObserveContent"],
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var CdkObserveContent = _CdkObserveContent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkObserveContent, [{
    type: Directive,
    args: [{
      selector: "[cdkObserveContent]",
      exportAs: "cdkObserveContent",
      standalone: true
    }]
  }], () => [{
    type: ContentObserver
  }, {
    type: ElementRef
  }], {
    event: [{
      type: Output,
      args: ["cdkObserveContent"]
    }],
    disabled: [{
      type: Input,
      args: [{
        alias: "cdkObserveContentDisabled",
        transform: booleanAttribute
      }]
    }],
    debounce: [{
      type: Input
    }]
  });
})();
var _ObserversModule = class _ObserversModule {
};
_ObserversModule.ɵfac = function ObserversModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ObserversModule)();
};
_ObserversModule.ɵmod = ɵɵdefineNgModule({
  type: _ObserversModule,
  imports: [CdkObserveContent],
  exports: [CdkObserveContent]
});
_ObserversModule.ɵinj = ɵɵdefineInjector({
  providers: [MutationObserverFactory]
});
var ObserversModule = _ObserversModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ObserversModule, [{
    type: NgModule,
    args: [{
      imports: [CdkObserveContent],
      exports: [CdkObserveContent],
      providers: [MutationObserverFactory]
    }]
  }], null, null);
})();

// node_modules/@angular/cdk/fesm2022/layout.mjs
var _LayoutModule = class _LayoutModule {
};
_LayoutModule.ɵfac = function LayoutModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _LayoutModule)();
};
_LayoutModule.ɵmod = ɵɵdefineNgModule({
  type: _LayoutModule
});
_LayoutModule.ɵinj = ɵɵdefineInjector({});
var LayoutModule = _LayoutModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();
var mediaQueriesForWebkitCompatibility = /* @__PURE__ */ new Set();
var mediaQueryStyleNode;
var _MediaMatcher = class _MediaMatcher {
  constructor(_platform, _nonce) {
    this._platform = _platform;
    this._nonce = _nonce;
    this._matchMedia = this._platform.isBrowser && window.matchMedia ? (
      // matchMedia is bound to the window scope intentionally as it is an illegal invocation to
      // call it from a different scope.
      window.matchMedia.bind(window)
    ) : noopMatchMedia;
  }
  /**
   * Evaluates the given media query and returns the native MediaQueryList from which results
   * can be retrieved.
   * Confirms the layout engine will trigger for the selector query provided and returns the
   * MediaQueryList for the query provided.
   */
  matchMedia(query2) {
    if (this._platform.WEBKIT || this._platform.BLINK) {
      createEmptyStyleRule(query2, this._nonce);
    }
    return this._matchMedia(query2);
  }
};
_MediaMatcher.ɵfac = function MediaMatcher_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _MediaMatcher)(ɵɵinject(Platform), ɵɵinject(CSP_NONCE, 8));
};
_MediaMatcher.ɵprov = ɵɵdefineInjectable({
  token: _MediaMatcher,
  factory: _MediaMatcher.ɵfac,
  providedIn: "root"
});
var MediaMatcher = _MediaMatcher;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MediaMatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Platform
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CSP_NONCE]
    }]
  }], null);
})();
function createEmptyStyleRule(query2, nonce) {
  if (mediaQueriesForWebkitCompatibility.has(query2)) {
    return;
  }
  try {
    if (!mediaQueryStyleNode) {
      mediaQueryStyleNode = document.createElement("style");
      if (nonce) {
        mediaQueryStyleNode.setAttribute("nonce", nonce);
      }
      mediaQueryStyleNode.setAttribute("type", "text/css");
      document.head.appendChild(mediaQueryStyleNode);
    }
    if (mediaQueryStyleNode.sheet) {
      mediaQueryStyleNode.sheet.insertRule(`@media ${query2} {body{ }}`, 0);
      mediaQueriesForWebkitCompatibility.add(query2);
    }
  } catch (e) {
    console.error(e);
  }
}
function noopMatchMedia(query2) {
  return {
    matches: query2 === "all" || query2 === "",
    media: query2,
    addListener: () => {
    },
    removeListener: () => {
    }
  };
}
var _BreakpointObserver = class _BreakpointObserver {
  constructor(_mediaMatcher, _zone) {
    this._mediaMatcher = _mediaMatcher;
    this._zone = _zone;
    this._queries = /* @__PURE__ */ new Map();
    this._destroySubject = new Subject();
  }
  /** Completes the active subject, signalling to all other observables to complete. */
  ngOnDestroy() {
    this._destroySubject.next();
    this._destroySubject.complete();
  }
  /**
   * Whether one or more media queries match the current viewport size.
   * @param value One or more media queries to check.
   * @returns Whether any of the media queries match.
   */
  isMatched(value) {
    const queries = splitQueries(coerceArray(value));
    return queries.some((mediaQuery) => this._registerQuery(mediaQuery).mql.matches);
  }
  /**
   * Gets an observable of results for the given queries that will emit new results for any changes
   * in matching of the given queries.
   * @param value One or more media queries to check.
   * @returns A stream of matches for the given queries.
   */
  observe(value) {
    const queries = splitQueries(coerceArray(value));
    const observables = queries.map((query2) => this._registerQuery(query2).observable);
    let stateObservable = combineLatest(observables);
    stateObservable = concat(stateObservable.pipe(take(1)), stateObservable.pipe(skip(1), debounceTime(0)));
    return stateObservable.pipe(map((breakpointStates) => {
      const response = {
        matches: false,
        breakpoints: {}
      };
      breakpointStates.forEach(({
        matches,
        query: query2
      }) => {
        response.matches = response.matches || matches;
        response.breakpoints[query2] = matches;
      });
      return response;
    }));
  }
  /** Registers a specific query to be listened for. */
  _registerQuery(query2) {
    if (this._queries.has(query2)) {
      return this._queries.get(query2);
    }
    const mql = this._mediaMatcher.matchMedia(query2);
    const queryObservable = new Observable((observer) => {
      const handler = (e) => this._zone.run(() => observer.next(e));
      mql.addListener(handler);
      return () => {
        mql.removeListener(handler);
      };
    }).pipe(startWith(mql), map(({
      matches
    }) => ({
      query: query2,
      matches
    })), takeUntil(this._destroySubject));
    const output2 = {
      observable: queryObservable,
      mql
    };
    this._queries.set(query2, output2);
    return output2;
  }
};
_BreakpointObserver.ɵfac = function BreakpointObserver_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BreakpointObserver)(ɵɵinject(MediaMatcher), ɵɵinject(NgZone));
};
_BreakpointObserver.ɵprov = ɵɵdefineInjectable({
  token: _BreakpointObserver,
  factory: _BreakpointObserver.ɵfac,
  providedIn: "root"
});
var BreakpointObserver = _BreakpointObserver;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreakpointObserver, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: MediaMatcher
  }, {
    type: NgZone
  }], null);
})();
function splitQueries(queries) {
  return queries.map((query2) => query2.split(",")).reduce((a1, a2) => a1.concat(a2)).map((query2) => query2.trim());
}

// node_modules/@angular/cdk/fesm2022/a11y.mjs
var ID_DELIMITER = " ";
function addAriaReferencedId(el, attr, id) {
  const ids = getAriaReferenceIds(el, attr);
  id = id.trim();
  if (ids.some((existingId) => existingId.trim() === id)) {
    return;
  }
  ids.push(id);
  el.setAttribute(attr, ids.join(ID_DELIMITER));
}
function removeAriaReferencedId(el, attr, id) {
  const ids = getAriaReferenceIds(el, attr);
  id = id.trim();
  const filteredIds = ids.filter((val) => val !== id);
  if (filteredIds.length) {
    el.setAttribute(attr, filteredIds.join(ID_DELIMITER));
  } else {
    el.removeAttribute(attr);
  }
}
function getAriaReferenceIds(el, attr) {
  const attrValue = el.getAttribute(attr);
  return attrValue?.match(/\S+/g) ?? [];
}
var CDK_DESCRIBEDBY_ID_PREFIX = "cdk-describedby-message";
var CDK_DESCRIBEDBY_HOST_ATTRIBUTE = "cdk-describedby-host";
var nextId = 0;
var _AriaDescriber = class _AriaDescriber {
  constructor(_document6, _platform) {
    this._platform = _platform;
    this._messageRegistry = /* @__PURE__ */ new Map();
    this._messagesContainer = null;
    this._id = `${nextId++}`;
    this._document = _document6;
    this._id = inject(APP_ID) + "-" + nextId++;
  }
  describe(hostElement, message, role) {
    if (!this._canBeDescribed(hostElement, message)) {
      return;
    }
    const key = getKey(message, role);
    if (typeof message !== "string") {
      setMessageId(message, this._id);
      this._messageRegistry.set(key, {
        messageElement: message,
        referenceCount: 0
      });
    } else if (!this._messageRegistry.has(key)) {
      this._createMessageElement(message, role);
    }
    if (!this._isElementDescribedByMessage(hostElement, key)) {
      this._addMessageReference(hostElement, key);
    }
  }
  removeDescription(hostElement, message, role) {
    if (!message || !this._isElementNode(hostElement)) {
      return;
    }
    const key = getKey(message, role);
    if (this._isElementDescribedByMessage(hostElement, key)) {
      this._removeMessageReference(hostElement, key);
    }
    if (typeof message === "string") {
      const registeredMessage = this._messageRegistry.get(key);
      if (registeredMessage && registeredMessage.referenceCount === 0) {
        this._deleteMessageElement(key);
      }
    }
    if (this._messagesContainer?.childNodes.length === 0) {
      this._messagesContainer.remove();
      this._messagesContainer = null;
    }
  }
  /** Unregisters all created message elements and removes the message container. */
  ngOnDestroy() {
    const describedElements = this._document.querySelectorAll(`[${CDK_DESCRIBEDBY_HOST_ATTRIBUTE}="${this._id}"]`);
    for (let i = 0; i < describedElements.length; i++) {
      this._removeCdkDescribedByReferenceIds(describedElements[i]);
      describedElements[i].removeAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE);
    }
    this._messagesContainer?.remove();
    this._messagesContainer = null;
    this._messageRegistry.clear();
  }
  /**
   * Creates a new element in the visually hidden message container element with the message
   * as its content and adds it to the message registry.
   */
  _createMessageElement(message, role) {
    const messageElement = this._document.createElement("div");
    setMessageId(messageElement, this._id);
    messageElement.textContent = message;
    if (role) {
      messageElement.setAttribute("role", role);
    }
    this._createMessagesContainer();
    this._messagesContainer.appendChild(messageElement);
    this._messageRegistry.set(getKey(message, role), {
      messageElement,
      referenceCount: 0
    });
  }
  /** Deletes the message element from the global messages container. */
  _deleteMessageElement(key) {
    this._messageRegistry.get(key)?.messageElement?.remove();
    this._messageRegistry.delete(key);
  }
  /** Creates the global container for all aria-describedby messages. */
  _createMessagesContainer() {
    if (this._messagesContainer) {
      return;
    }
    const containerClassName = "cdk-describedby-message-container";
    const serverContainers = this._document.querySelectorAll(`.${containerClassName}[platform="server"]`);
    for (let i = 0; i < serverContainers.length; i++) {
      serverContainers[i].remove();
    }
    const messagesContainer = this._document.createElement("div");
    messagesContainer.style.visibility = "hidden";
    messagesContainer.classList.add(containerClassName);
    messagesContainer.classList.add("cdk-visually-hidden");
    if (this._platform && !this._platform.isBrowser) {
      messagesContainer.setAttribute("platform", "server");
    }
    this._document.body.appendChild(messagesContainer);
    this._messagesContainer = messagesContainer;
  }
  /** Removes all cdk-describedby messages that are hosted through the element. */
  _removeCdkDescribedByReferenceIds(element) {
    const originalReferenceIds = getAriaReferenceIds(element, "aria-describedby").filter((id) => id.indexOf(CDK_DESCRIBEDBY_ID_PREFIX) != 0);
    element.setAttribute("aria-describedby", originalReferenceIds.join(" "));
  }
  /**
   * Adds a message reference to the element using aria-describedby and increments the registered
   * message's reference count.
   */
  _addMessageReference(element, key) {
    const registeredMessage = this._messageRegistry.get(key);
    addAriaReferencedId(element, "aria-describedby", registeredMessage.messageElement.id);
    element.setAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE, this._id);
    registeredMessage.referenceCount++;
  }
  /**
   * Removes a message reference from the element using aria-describedby
   * and decrements the registered message's reference count.
   */
  _removeMessageReference(element, key) {
    const registeredMessage = this._messageRegistry.get(key);
    registeredMessage.referenceCount--;
    removeAriaReferencedId(element, "aria-describedby", registeredMessage.messageElement.id);
    element.removeAttribute(CDK_DESCRIBEDBY_HOST_ATTRIBUTE);
  }
  /** Returns true if the element has been described by the provided message ID. */
  _isElementDescribedByMessage(element, key) {
    const referenceIds = getAriaReferenceIds(element, "aria-describedby");
    const registeredMessage = this._messageRegistry.get(key);
    const messageId = registeredMessage && registeredMessage.messageElement.id;
    return !!messageId && referenceIds.indexOf(messageId) != -1;
  }
  /** Determines whether a message can be described on a particular element. */
  _canBeDescribed(element, message) {
    if (!this._isElementNode(element)) {
      return false;
    }
    if (message && typeof message === "object") {
      return true;
    }
    const trimmedMessage = message == null ? "" : `${message}`.trim();
    const ariaLabel = element.getAttribute("aria-label");
    return trimmedMessage ? !ariaLabel || ariaLabel.trim() !== trimmedMessage : false;
  }
  /** Checks whether a node is an Element node. */
  _isElementNode(element) {
    return element.nodeType === this._document.ELEMENT_NODE;
  }
};
_AriaDescriber.ɵfac = function AriaDescriber_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AriaDescriber)(ɵɵinject(DOCUMENT), ɵɵinject(Platform));
};
_AriaDescriber.ɵprov = ɵɵdefineInjectable({
  token: _AriaDescriber,
  factory: _AriaDescriber.ɵfac,
  providedIn: "root"
});
var AriaDescriber = _AriaDescriber;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AriaDescriber, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: Platform
  }], null);
})();
function getKey(message, role) {
  return typeof message === "string" ? `${role || ""}/${message}` : message;
}
function setMessageId(element, serviceId) {
  if (!element.id) {
    element.id = `${CDK_DESCRIBEDBY_ID_PREFIX}-${serviceId}-${nextId++}`;
  }
}
var DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL_MS = 200;
var Typeahead = class {
  constructor(initialItems, config) {
    this._letterKeyStream = new Subject();
    this._items = [];
    this._selectedItemIndex = -1;
    this._pressedLetters = [];
    this._selectedItem = new Subject();
    this.selectedItem = this._selectedItem;
    const typeAheadInterval = typeof config?.debounceInterval === "number" ? config.debounceInterval : DEFAULT_TYPEAHEAD_DEBOUNCE_INTERVAL_MS;
    if (config?.skipPredicate) {
      this._skipPredicateFn = config.skipPredicate;
    }
    if ((typeof ngDevMode === "undefined" || ngDevMode) && initialItems.length && initialItems.some((item) => typeof item.getLabel !== "function")) {
      throw new Error("KeyManager items in typeahead mode must implement the `getLabel` method.");
    }
    this.setItems(initialItems);
    this._setupKeyHandler(typeAheadInterval);
  }
  destroy() {
    this._pressedLetters = [];
    this._letterKeyStream.complete();
    this._selectedItem.complete();
  }
  setCurrentSelectedItemIndex(index) {
    this._selectedItemIndex = index;
  }
  setItems(items) {
    this._items = items;
  }
  handleKey(event) {
    const keyCode = event.keyCode;
    if (event.key && event.key.length === 1) {
      this._letterKeyStream.next(event.key.toLocaleUpperCase());
    } else if (keyCode >= A && keyCode <= Z || keyCode >= ZERO && keyCode <= NINE) {
      this._letterKeyStream.next(String.fromCharCode(keyCode));
    }
  }
  /** Gets whether the user is currently typing into the manager using the typeahead feature. */
  isTyping() {
    return this._pressedLetters.length > 0;
  }
  /** Resets the currently stored sequence of typed letters. */
  reset() {
    this._pressedLetters = [];
  }
  _setupKeyHandler(typeAheadInterval) {
    this._letterKeyStream.pipe(tap((letter) => this._pressedLetters.push(letter)), debounceTime(typeAheadInterval), filter(() => this._pressedLetters.length > 0), map(() => this._pressedLetters.join("").toLocaleUpperCase())).subscribe((inputString) => {
      for (let i = 1; i < this._items.length + 1; i++) {
        const index = (this._selectedItemIndex + i) % this._items.length;
        const item = this._items[index];
        if (!this._skipPredicateFn?.(item) && item.getLabel?.().toLocaleUpperCase().trim().indexOf(inputString) === 0) {
          this._selectedItem.next(item);
          break;
        }
      }
      this._pressedLetters = [];
    });
  }
};
var ListKeyManager = class {
  constructor(_items, injector) {
    this._items = _items;
    this._activeItemIndex = -1;
    this._activeItem = null;
    this._wrap = false;
    this._typeaheadSubscription = Subscription.EMPTY;
    this._vertical = true;
    this._allowedModifierKeys = [];
    this._homeAndEnd = false;
    this._pageUpAndDown = {
      enabled: false,
      delta: 10
    };
    this._skipPredicateFn = (item) => item.disabled;
    this.tabOut = new Subject();
    this.change = new Subject();
    if (_items instanceof QueryList) {
      this._itemChangesSubscription = _items.changes.subscribe((newItems) => this._itemsChanged(newItems.toArray()));
    } else if (isSignal(_items)) {
      if (!injector && (typeof ngDevMode === "undefined" || ngDevMode)) {
        throw new Error("ListKeyManager constructed with a signal must receive an injector");
      }
      this._effectRef = effect(() => this._itemsChanged(_items()), {
        injector
      });
    }
  }
  /**
   * Sets the predicate function that determines which items should be skipped by the
   * list key manager.
   * @param predicate Function that determines whether the given item should be skipped.
   */
  skipPredicate(predicate) {
    this._skipPredicateFn = predicate;
    return this;
  }
  /**
   * Configures wrapping mode, which determines whether the active item will wrap to
   * the other end of list when there are no more items in the given direction.
   * @param shouldWrap Whether the list should wrap when reaching the end.
   */
  withWrap(shouldWrap = true) {
    this._wrap = shouldWrap;
    return this;
  }
  /**
   * Configures whether the key manager should be able to move the selection vertically.
   * @param enabled Whether vertical selection should be enabled.
   */
  withVerticalOrientation(enabled = true) {
    this._vertical = enabled;
    return this;
  }
  /**
   * Configures the key manager to move the selection horizontally.
   * Passing in `null` will disable horizontal movement.
   * @param direction Direction in which the selection can be moved.
   */
  withHorizontalOrientation(direction) {
    this._horizontal = direction;
    return this;
  }
  /**
   * Modifier keys which are allowed to be held down and whose default actions will be prevented
   * as the user is pressing the arrow keys. Defaults to not allowing any modifier keys.
   */
  withAllowedModifierKeys(keys) {
    this._allowedModifierKeys = keys;
    return this;
  }
  /**
   * Turns on typeahead mode which allows users to set the active item by typing.
   * @param debounceInterval Time to wait after the last keystroke before setting the active item.
   */
  withTypeAhead(debounceInterval = 200) {
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      const items2 = this._getItemsArray();
      if (items2.length > 0 && items2.some((item) => typeof item.getLabel !== "function")) {
        throw Error("ListKeyManager items in typeahead mode must implement the `getLabel` method.");
      }
    }
    this._typeaheadSubscription.unsubscribe();
    const items = this._getItemsArray();
    this._typeahead = new Typeahead(items, {
      debounceInterval: typeof debounceInterval === "number" ? debounceInterval : void 0,
      skipPredicate: (item) => this._skipPredicateFn(item)
    });
    this._typeaheadSubscription = this._typeahead.selectedItem.subscribe((item) => {
      this.setActiveItem(item);
    });
    return this;
  }
  /** Cancels the current typeahead sequence. */
  cancelTypeahead() {
    this._typeahead?.reset();
    return this;
  }
  /**
   * Configures the key manager to activate the first and last items
   * respectively when the Home or End key is pressed.
   * @param enabled Whether pressing the Home or End key activates the first/last item.
   */
  withHomeAndEnd(enabled = true) {
    this._homeAndEnd = enabled;
    return this;
  }
  /**
   * Configures the key manager to activate every 10th, configured or first/last element in up/down direction
   * respectively when the Page-Up or Page-Down key is pressed.
   * @param enabled Whether pressing the Page-Up or Page-Down key activates the first/last item.
   * @param delta Whether pressing the Home or End key activates the first/last item.
   */
  withPageUpDown(enabled = true, delta = 10) {
    this._pageUpAndDown = {
      enabled,
      delta
    };
    return this;
  }
  setActiveItem(item) {
    const previousActiveItem = this._activeItem;
    this.updateActiveItem(item);
    if (this._activeItem !== previousActiveItem) {
      this.change.next(this._activeItemIndex);
    }
  }
  /**
   * Sets the active item depending on the key event passed in.
   * @param event Keyboard event to be used for determining which element should be active.
   */
  onKeydown(event) {
    const keyCode = event.keyCode;
    const modifiers = ["altKey", "ctrlKey", "metaKey", "shiftKey"];
    const isModifierAllowed = modifiers.every((modifier) => {
      return !event[modifier] || this._allowedModifierKeys.indexOf(modifier) > -1;
    });
    switch (keyCode) {
      case TAB:
        this.tabOut.next();
        return;
      case DOWN_ARROW:
        if (this._vertical && isModifierAllowed) {
          this.setNextItemActive();
          break;
        } else {
          return;
        }
      case UP_ARROW:
        if (this._vertical && isModifierAllowed) {
          this.setPreviousItemActive();
          break;
        } else {
          return;
        }
      case RIGHT_ARROW:
        if (this._horizontal && isModifierAllowed) {
          this._horizontal === "rtl" ? this.setPreviousItemActive() : this.setNextItemActive();
          break;
        } else {
          return;
        }
      case LEFT_ARROW:
        if (this._horizontal && isModifierAllowed) {
          this._horizontal === "rtl" ? this.setNextItemActive() : this.setPreviousItemActive();
          break;
        } else {
          return;
        }
      case HOME:
        if (this._homeAndEnd && isModifierAllowed) {
          this.setFirstItemActive();
          break;
        } else {
          return;
        }
      case END:
        if (this._homeAndEnd && isModifierAllowed) {
          this.setLastItemActive();
          break;
        } else {
          return;
        }
      case PAGE_UP:
        if (this._pageUpAndDown.enabled && isModifierAllowed) {
          const targetIndex = this._activeItemIndex - this._pageUpAndDown.delta;
          this._setActiveItemByIndex(targetIndex > 0 ? targetIndex : 0, 1);
          break;
        } else {
          return;
        }
      case PAGE_DOWN:
        if (this._pageUpAndDown.enabled && isModifierAllowed) {
          const targetIndex = this._activeItemIndex + this._pageUpAndDown.delta;
          const itemsLength = this._getItemsArray().length;
          this._setActiveItemByIndex(targetIndex < itemsLength ? targetIndex : itemsLength - 1, -1);
          break;
        } else {
          return;
        }
      default:
        if (isModifierAllowed || hasModifierKey(event, "shiftKey")) {
          this._typeahead?.handleKey(event);
        }
        return;
    }
    this._typeahead?.reset();
    event.preventDefault();
  }
  /** Index of the currently active item. */
  get activeItemIndex() {
    return this._activeItemIndex;
  }
  /** The active item. */
  get activeItem() {
    return this._activeItem;
  }
  /** Gets whether the user is currently typing into the manager using the typeahead feature. */
  isTyping() {
    return !!this._typeahead && this._typeahead.isTyping();
  }
  /** Sets the active item to the first enabled item in the list. */
  setFirstItemActive() {
    this._setActiveItemByIndex(0, 1);
  }
  /** Sets the active item to the last enabled item in the list. */
  setLastItemActive() {
    this._setActiveItemByIndex(this._getItemsArray().length - 1, -1);
  }
  /** Sets the active item to the next enabled item in the list. */
  setNextItemActive() {
    this._activeItemIndex < 0 ? this.setFirstItemActive() : this._setActiveItemByDelta(1);
  }
  /** Sets the active item to a previous enabled item in the list. */
  setPreviousItemActive() {
    this._activeItemIndex < 0 && this._wrap ? this.setLastItemActive() : this._setActiveItemByDelta(-1);
  }
  updateActiveItem(item) {
    const itemArray = this._getItemsArray();
    const index = typeof item === "number" ? item : itemArray.indexOf(item);
    const activeItem = itemArray[index];
    this._activeItem = activeItem == null ? null : activeItem;
    this._activeItemIndex = index;
    this._typeahead?.setCurrentSelectedItemIndex(index);
  }
  /** Cleans up the key manager. */
  destroy() {
    this._typeaheadSubscription.unsubscribe();
    this._itemChangesSubscription?.unsubscribe();
    this._effectRef?.destroy();
    this._typeahead?.destroy();
    this.tabOut.complete();
    this.change.complete();
  }
  /**
   * This method sets the active item, given a list of items and the delta between the
   * currently active item and the new active item. It will calculate differently
   * depending on whether wrap mode is turned on.
   */
  _setActiveItemByDelta(delta) {
    this._wrap ? this._setActiveInWrapMode(delta) : this._setActiveInDefaultMode(delta);
  }
  /**
   * Sets the active item properly given "wrap" mode. In other words, it will continue to move
   * down the list until it finds an item that is not disabled, and it will wrap if it
   * encounters either end of the list.
   */
  _setActiveInWrapMode(delta) {
    const items = this._getItemsArray();
    for (let i = 1; i <= items.length; i++) {
      const index = (this._activeItemIndex + delta * i + items.length) % items.length;
      const item = items[index];
      if (!this._skipPredicateFn(item)) {
        this.setActiveItem(index);
        return;
      }
    }
  }
  /**
   * Sets the active item properly given the default mode. In other words, it will
   * continue to move down the list until it finds an item that is not disabled. If
   * it encounters either end of the list, it will stop and not wrap.
   */
  _setActiveInDefaultMode(delta) {
    this._setActiveItemByIndex(this._activeItemIndex + delta, delta);
  }
  /**
   * Sets the active item to the first enabled item starting at the index specified. If the
   * item is disabled, it will move in the fallbackDelta direction until it either
   * finds an enabled item or encounters the end of the list.
   */
  _setActiveItemByIndex(index, fallbackDelta) {
    const items = this._getItemsArray();
    if (!items[index]) {
      return;
    }
    while (this._skipPredicateFn(items[index])) {
      index += fallbackDelta;
      if (!items[index]) {
        return;
      }
    }
    this.setActiveItem(index);
  }
  /** Returns the items as an array. */
  _getItemsArray() {
    if (isSignal(this._items)) {
      return this._items();
    }
    return this._items instanceof QueryList ? this._items.toArray() : this._items;
  }
  /** Callback for when the items have changed. */
  _itemsChanged(newItems) {
    this._typeahead?.setItems(newItems);
    if (this._activeItem) {
      const newIndex = newItems.indexOf(this._activeItem);
      if (newIndex > -1 && newIndex !== this._activeItemIndex) {
        this._activeItemIndex = newIndex;
        this._typeahead?.setCurrentSelectedItemIndex(newIndex);
      }
    }
  }
};
var FocusKeyManager = class extends ListKeyManager {
  constructor() {
    super(...arguments);
    this._origin = "program";
  }
  /**
   * Sets the focus origin that will be passed in to the items for any subsequent `focus` calls.
   * @param origin Focus origin to be used when focusing items.
   */
  setFocusOrigin(origin) {
    this._origin = origin;
    return this;
  }
  setActiveItem(item) {
    super.setActiveItem(item);
    if (this.activeItem) {
      this.activeItem.focus(this._origin);
    }
  }
};
var TreeKeyManager = class {
  _initialFocus() {
    if (this._hasInitialFocused) {
      return;
    }
    if (!this._items.length) {
      return;
    }
    let focusIndex = 0;
    for (let i = 0; i < this._items.length; i++) {
      if (!this._skipPredicateFn(this._items[i]) && !this._isItemDisabled(this._items[i])) {
        focusIndex = i;
        break;
      }
    }
    this.focusItem(focusIndex);
    this._hasInitialFocused = true;
  }
  /**
   *
   * @param items List of TreeKeyManager options. Can be synchronous or asynchronous.
   * @param config Optional configuration options. By default, use 'ltr' horizontal orientation. By
   * default, do not skip any nodes. By default, key manager only calls `focus` method when items
   * are focused and does not call `activate`. If `typeaheadDefaultInterval` is `true`, use a
   * default interval of 200ms.
   */
  constructor(items, config) {
    this._activeItemIndex = -1;
    this._activeItem = null;
    this._shouldActivationFollowFocus = false;
    this._horizontalOrientation = "ltr";
    this._skipPredicateFn = (_item) => false;
    this._trackByFn = (item) => item;
    this._items = [];
    this._typeaheadSubscription = Subscription.EMPTY;
    this._hasInitialFocused = false;
    this.change = new Subject();
    if (items instanceof QueryList) {
      this._items = items.toArray();
      items.changes.subscribe((newItems) => {
        this._items = newItems.toArray();
        this._typeahead?.setItems(this._items);
        this._updateActiveItemIndex(this._items);
        this._initialFocus();
      });
    } else if (isObservable(items)) {
      items.subscribe((newItems) => {
        this._items = newItems;
        this._typeahead?.setItems(newItems);
        this._updateActiveItemIndex(newItems);
        this._initialFocus();
      });
    } else {
      this._items = items;
      this._initialFocus();
    }
    if (typeof config.shouldActivationFollowFocus === "boolean") {
      this._shouldActivationFollowFocus = config.shouldActivationFollowFocus;
    }
    if (config.horizontalOrientation) {
      this._horizontalOrientation = config.horizontalOrientation;
    }
    if (config.skipPredicate) {
      this._skipPredicateFn = config.skipPredicate;
    }
    if (config.trackBy) {
      this._trackByFn = config.trackBy;
    }
    if (typeof config.typeAheadDebounceInterval !== "undefined") {
      this._setTypeAhead(config.typeAheadDebounceInterval);
    }
  }
  /** Cleans up the key manager. */
  destroy() {
    this._typeaheadSubscription.unsubscribe();
    this._typeahead?.destroy();
    this.change.complete();
  }
  /**
   * Handles a keyboard event on the tree.
   * @param event Keyboard event that represents the user interaction with the tree.
   */
  onKeydown(event) {
    const key = event.key;
    switch (key) {
      case "Tab":
        return;
      case "ArrowDown":
        this._focusNextItem();
        break;
      case "ArrowUp":
        this._focusPreviousItem();
        break;
      case "ArrowRight":
        this._horizontalOrientation === "rtl" ? this._collapseCurrentItem() : this._expandCurrentItem();
        break;
      case "ArrowLeft":
        this._horizontalOrientation === "rtl" ? this._expandCurrentItem() : this._collapseCurrentItem();
        break;
      case "Home":
        this._focusFirstItem();
        break;
      case "End":
        this._focusLastItem();
        break;
      case "Enter":
      case " ":
        this._activateCurrentItem();
        break;
      default:
        if (event.key === "*") {
          this._expandAllItemsAtCurrentItemLevel();
          break;
        }
        this._typeahead?.handleKey(event);
        return;
    }
    this._typeahead?.reset();
    event.preventDefault();
  }
  /** Index of the currently active item. */
  getActiveItemIndex() {
    return this._activeItemIndex;
  }
  /** The currently active item. */
  getActiveItem() {
    return this._activeItem;
  }
  /** Focus the first available item. */
  _focusFirstItem() {
    this.focusItem(this._findNextAvailableItemIndex(-1));
  }
  /** Focus the last available item. */
  _focusLastItem() {
    this.focusItem(this._findPreviousAvailableItemIndex(this._items.length));
  }
  /** Focus the next available item. */
  _focusNextItem() {
    this.focusItem(this._findNextAvailableItemIndex(this._activeItemIndex));
  }
  /** Focus the previous available item. */
  _focusPreviousItem() {
    this.focusItem(this._findPreviousAvailableItemIndex(this._activeItemIndex));
  }
  focusItem(itemOrIndex, options = {}) {
    options.emitChangeEvent ??= true;
    let index = typeof itemOrIndex === "number" ? itemOrIndex : this._items.findIndex((item) => this._trackByFn(item) === this._trackByFn(itemOrIndex));
    if (index < 0 || index >= this._items.length) {
      return;
    }
    const activeItem = this._items[index];
    if (this._activeItem !== null && this._trackByFn(activeItem) === this._trackByFn(this._activeItem)) {
      return;
    }
    const previousActiveItem = this._activeItem;
    this._activeItem = activeItem ?? null;
    this._activeItemIndex = index;
    this._typeahead?.setCurrentSelectedItemIndex(index);
    this._activeItem?.focus();
    previousActiveItem?.unfocus();
    if (options.emitChangeEvent) {
      this.change.next(this._activeItem);
    }
    if (this._shouldActivationFollowFocus) {
      this._activateCurrentItem();
    }
  }
  _updateActiveItemIndex(newItems) {
    const activeItem = this._activeItem;
    if (!activeItem) {
      return;
    }
    const newIndex = newItems.findIndex((item) => this._trackByFn(item) === this._trackByFn(activeItem));
    if (newIndex > -1 && newIndex !== this._activeItemIndex) {
      this._activeItemIndex = newIndex;
      this._typeahead?.setCurrentSelectedItemIndex(newIndex);
    }
  }
  _setTypeAhead(debounceInterval) {
    this._typeahead = new Typeahead(this._items, {
      debounceInterval: typeof debounceInterval === "number" ? debounceInterval : void 0,
      skipPredicate: (item) => this._skipPredicateFn(item)
    });
    this._typeaheadSubscription = this._typeahead.selectedItem.subscribe((item) => {
      this.focusItem(item);
    });
  }
  _findNextAvailableItemIndex(startingIndex) {
    for (let i = startingIndex + 1; i < this._items.length; i++) {
      if (!this._skipPredicateFn(this._items[i])) {
        return i;
      }
    }
    return startingIndex;
  }
  _findPreviousAvailableItemIndex(startingIndex) {
    for (let i = startingIndex - 1; i >= 0; i--) {
      if (!this._skipPredicateFn(this._items[i])) {
        return i;
      }
    }
    return startingIndex;
  }
  /**
   * If the item is already expanded, we collapse the item. Otherwise, we will focus the parent.
   */
  _collapseCurrentItem() {
    if (!this._activeItem) {
      return;
    }
    if (this._isCurrentItemExpanded()) {
      this._activeItem.collapse();
    } else {
      const parent = this._activeItem.getParent();
      if (!parent || this._skipPredicateFn(parent)) {
        return;
      }
      this.focusItem(parent);
    }
  }
  /**
   * If the item is already collapsed, we expand the item. Otherwise, we will focus the first child.
   */
  _expandCurrentItem() {
    if (!this._activeItem) {
      return;
    }
    if (!this._isCurrentItemExpanded()) {
      this._activeItem.expand();
    } else {
      coerceObservable(this._activeItem.getChildren()).pipe(take(1)).subscribe((children) => {
        const firstChild = children.find((child) => !this._skipPredicateFn(child));
        if (!firstChild) {
          return;
        }
        this.focusItem(firstChild);
      });
    }
  }
  _isCurrentItemExpanded() {
    if (!this._activeItem) {
      return false;
    }
    return typeof this._activeItem.isExpanded === "boolean" ? this._activeItem.isExpanded : this._activeItem.isExpanded();
  }
  _isItemDisabled(item) {
    return typeof item.isDisabled === "boolean" ? item.isDisabled : item.isDisabled?.();
  }
  /** For all items that are the same level as the current item, we expand those items. */
  _expandAllItemsAtCurrentItemLevel() {
    if (!this._activeItem) {
      return;
    }
    const parent = this._activeItem.getParent();
    let itemsToExpand;
    if (!parent) {
      itemsToExpand = of(this._items.filter((item) => item.getParent() === null));
    } else {
      itemsToExpand = coerceObservable(parent.getChildren());
    }
    itemsToExpand.pipe(take(1)).subscribe((items) => {
      for (const item of items) {
        item.expand();
      }
    });
  }
  _activateCurrentItem() {
    this._activeItem?.activate();
  }
};
function TREE_KEY_MANAGER_FACTORY() {
  return (items, options) => new TreeKeyManager(items, options);
}
var TREE_KEY_MANAGER = new InjectionToken("tree-key-manager", {
  providedIn: "root",
  factory: TREE_KEY_MANAGER_FACTORY
});
var _InteractivityChecker = class _InteractivityChecker {
  constructor(_platform) {
    this._platform = _platform;
  }
  /**
   * Gets whether an element is disabled.
   *
   * @param element Element to be checked.
   * @returns Whether the element is disabled.
   */
  isDisabled(element) {
    return element.hasAttribute("disabled");
  }
  /**
   * Gets whether an element is visible for the purposes of interactivity.
   *
   * This will capture states like `display: none` and `visibility: hidden`, but not things like
   * being clipped by an `overflow: hidden` parent or being outside the viewport.
   *
   * @returns Whether the element is visible.
   */
  isVisible(element) {
    return hasGeometry(element) && getComputedStyle(element).visibility === "visible";
  }
  /**
   * Gets whether an element can be reached via Tab key.
   * Assumes that the element has already been checked with isFocusable.
   *
   * @param element Element to be checked.
   * @returns Whether the element is tabbable.
   */
  isTabbable(element) {
    if (!this._platform.isBrowser) {
      return false;
    }
    const frameElement = getFrameElement(getWindow2(element));
    if (frameElement) {
      if (getTabIndexValue(frameElement) === -1) {
        return false;
      }
      if (!this.isVisible(frameElement)) {
        return false;
      }
    }
    let nodeName = element.nodeName.toLowerCase();
    let tabIndexValue = getTabIndexValue(element);
    if (element.hasAttribute("contenteditable")) {
      return tabIndexValue !== -1;
    }
    if (nodeName === "iframe" || nodeName === "object") {
      return false;
    }
    if (this._platform.WEBKIT && this._platform.IOS && !isPotentiallyTabbableIOS(element)) {
      return false;
    }
    if (nodeName === "audio") {
      if (!element.hasAttribute("controls")) {
        return false;
      }
      return tabIndexValue !== -1;
    }
    if (nodeName === "video") {
      if (tabIndexValue === -1) {
        return false;
      }
      if (tabIndexValue !== null) {
        return true;
      }
      return this._platform.FIREFOX || element.hasAttribute("controls");
    }
    return element.tabIndex >= 0;
  }
  /**
   * Gets whether an element can be focused by the user.
   *
   * @param element Element to be checked.
   * @param config The config object with options to customize this method's behavior
   * @returns Whether the element is focusable.
   */
  isFocusable(element, config) {
    return isPotentiallyFocusable(element) && !this.isDisabled(element) && (config?.ignoreVisibility || this.isVisible(element));
  }
};
_InteractivityChecker.ɵfac = function InteractivityChecker_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _InteractivityChecker)(ɵɵinject(Platform));
};
_InteractivityChecker.ɵprov = ɵɵdefineInjectable({
  token: _InteractivityChecker,
  factory: _InteractivityChecker.ɵfac,
  providedIn: "root"
});
var InteractivityChecker = _InteractivityChecker;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InteractivityChecker, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Platform
  }], null);
})();
function getFrameElement(window2) {
  try {
    return window2.frameElement;
  } catch {
    return null;
  }
}
function hasGeometry(element) {
  return !!(element.offsetWidth || element.offsetHeight || typeof element.getClientRects === "function" && element.getClientRects().length);
}
function isNativeFormElement(element) {
  let nodeName = element.nodeName.toLowerCase();
  return nodeName === "input" || nodeName === "select" || nodeName === "button" || nodeName === "textarea";
}
function isHiddenInput(element) {
  return isInputElement(element) && element.type == "hidden";
}
function isAnchorWithHref(element) {
  return isAnchorElement(element) && element.hasAttribute("href");
}
function isInputElement(element) {
  return element.nodeName.toLowerCase() == "input";
}
function isAnchorElement(element) {
  return element.nodeName.toLowerCase() == "a";
}
function hasValidTabIndex(element) {
  if (!element.hasAttribute("tabindex") || element.tabIndex === void 0) {
    return false;
  }
  let tabIndex = element.getAttribute("tabindex");
  return !!(tabIndex && !isNaN(parseInt(tabIndex, 10)));
}
function getTabIndexValue(element) {
  if (!hasValidTabIndex(element)) {
    return null;
  }
  const tabIndex = parseInt(element.getAttribute("tabindex") || "", 10);
  return isNaN(tabIndex) ? -1 : tabIndex;
}
function isPotentiallyTabbableIOS(element) {
  let nodeName = element.nodeName.toLowerCase();
  let inputType = nodeName === "input" && element.type;
  return inputType === "text" || inputType === "password" || nodeName === "select" || nodeName === "textarea";
}
function isPotentiallyFocusable(element) {
  if (isHiddenInput(element)) {
    return false;
  }
  return isNativeFormElement(element) || isAnchorWithHref(element) || element.hasAttribute("contenteditable") || hasValidTabIndex(element);
}
function getWindow2(node) {
  return node.ownerDocument && node.ownerDocument.defaultView || window;
}
var FocusTrap = class {
  /** Whether the focus trap is active. */
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    if (this._startAnchor && this._endAnchor) {
      this._toggleAnchorTabIndex(value, this._startAnchor);
      this._toggleAnchorTabIndex(value, this._endAnchor);
    }
  }
  constructor(_element, _checker, _ngZone, _document6, deferAnchors = false, _injector) {
    this._element = _element;
    this._checker = _checker;
    this._ngZone = _ngZone;
    this._document = _document6;
    this._injector = _injector;
    this._hasAttached = false;
    this.startAnchorListener = () => this.focusLastTabbableElement();
    this.endAnchorListener = () => this.focusFirstTabbableElement();
    this._enabled = true;
    if (!deferAnchors) {
      this.attachAnchors();
    }
  }
  /** Destroys the focus trap by cleaning up the anchors. */
  destroy() {
    const startAnchor = this._startAnchor;
    const endAnchor = this._endAnchor;
    if (startAnchor) {
      startAnchor.removeEventListener("focus", this.startAnchorListener);
      startAnchor.remove();
    }
    if (endAnchor) {
      endAnchor.removeEventListener("focus", this.endAnchorListener);
      endAnchor.remove();
    }
    this._startAnchor = this._endAnchor = null;
    this._hasAttached = false;
  }
  /**
   * Inserts the anchors into the DOM. This is usually done automatically
   * in the constructor, but can be deferred for cases like directives with `*ngIf`.
   * @returns Whether the focus trap managed to attach successfully. This may not be the case
   * if the target element isn't currently in the DOM.
   */
  attachAnchors() {
    if (this._hasAttached) {
      return true;
    }
    this._ngZone.runOutsideAngular(() => {
      if (!this._startAnchor) {
        this._startAnchor = this._createAnchor();
        this._startAnchor.addEventListener("focus", this.startAnchorListener);
      }
      if (!this._endAnchor) {
        this._endAnchor = this._createAnchor();
        this._endAnchor.addEventListener("focus", this.endAnchorListener);
      }
    });
    if (this._element.parentNode) {
      this._element.parentNode.insertBefore(this._startAnchor, this._element);
      this._element.parentNode.insertBefore(this._endAnchor, this._element.nextSibling);
      this._hasAttached = true;
    }
    return this._hasAttached;
  }
  /**
   * Waits for the zone to stabilize, then focuses the first tabbable element.
   * @returns Returns a promise that resolves with a boolean, depending
   * on whether focus was moved successfully.
   */
  focusInitialElementWhenReady(options) {
    return new Promise((resolve) => {
      this._executeOnStable(() => resolve(this.focusInitialElement(options)));
    });
  }
  /**
   * Waits for the zone to stabilize, then focuses
   * the first tabbable element within the focus trap region.
   * @returns Returns a promise that resolves with a boolean, depending
   * on whether focus was moved successfully.
   */
  focusFirstTabbableElementWhenReady(options) {
    return new Promise((resolve) => {
      this._executeOnStable(() => resolve(this.focusFirstTabbableElement(options)));
    });
  }
  /**
   * Waits for the zone to stabilize, then focuses
   * the last tabbable element within the focus trap region.
   * @returns Returns a promise that resolves with a boolean, depending
   * on whether focus was moved successfully.
   */
  focusLastTabbableElementWhenReady(options) {
    return new Promise((resolve) => {
      this._executeOnStable(() => resolve(this.focusLastTabbableElement(options)));
    });
  }
  /**
   * Get the specified boundary element of the trapped region.
   * @param bound The boundary to get (start or end of trapped region).
   * @returns The boundary element.
   */
  _getRegionBoundary(bound) {
    const markers = this._element.querySelectorAll(`[cdk-focus-region-${bound}], [cdkFocusRegion${bound}], [cdk-focus-${bound}]`);
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      for (let i = 0; i < markers.length; i++) {
        if (markers[i].hasAttribute(`cdk-focus-${bound}`)) {
          console.warn(`Found use of deprecated attribute 'cdk-focus-${bound}', use 'cdkFocusRegion${bound}' instead. The deprecated attribute will be removed in 8.0.0.`, markers[i]);
        } else if (markers[i].hasAttribute(`cdk-focus-region-${bound}`)) {
          console.warn(`Found use of deprecated attribute 'cdk-focus-region-${bound}', use 'cdkFocusRegion${bound}' instead. The deprecated attribute will be removed in 8.0.0.`, markers[i]);
        }
      }
    }
    if (bound == "start") {
      return markers.length ? markers[0] : this._getFirstTabbableElement(this._element);
    }
    return markers.length ? markers[markers.length - 1] : this._getLastTabbableElement(this._element);
  }
  /**
   * Focuses the element that should be focused when the focus trap is initialized.
   * @returns Whether focus was moved successfully.
   */
  focusInitialElement(options) {
    const redirectToElement = this._element.querySelector(`[cdk-focus-initial], [cdkFocusInitial]`);
    if (redirectToElement) {
      if ((typeof ngDevMode === "undefined" || ngDevMode) && redirectToElement.hasAttribute(`cdk-focus-initial`)) {
        console.warn(`Found use of deprecated attribute 'cdk-focus-initial', use 'cdkFocusInitial' instead. The deprecated attribute will be removed in 8.0.0`, redirectToElement);
      }
      if ((typeof ngDevMode === "undefined" || ngDevMode) && !this._checker.isFocusable(redirectToElement)) {
        console.warn(`Element matching '[cdkFocusInitial]' is not focusable.`, redirectToElement);
      }
      if (!this._checker.isFocusable(redirectToElement)) {
        const focusableChild = this._getFirstTabbableElement(redirectToElement);
        focusableChild?.focus(options);
        return !!focusableChild;
      }
      redirectToElement.focus(options);
      return true;
    }
    return this.focusFirstTabbableElement(options);
  }
  /**
   * Focuses the first tabbable element within the focus trap region.
   * @returns Whether focus was moved successfully.
   */
  focusFirstTabbableElement(options) {
    const redirectToElement = this._getRegionBoundary("start");
    if (redirectToElement) {
      redirectToElement.focus(options);
    }
    return !!redirectToElement;
  }
  /**
   * Focuses the last tabbable element within the focus trap region.
   * @returns Whether focus was moved successfully.
   */
  focusLastTabbableElement(options) {
    const redirectToElement = this._getRegionBoundary("end");
    if (redirectToElement) {
      redirectToElement.focus(options);
    }
    return !!redirectToElement;
  }
  /**
   * Checks whether the focus trap has successfully been attached.
   */
  hasAttached() {
    return this._hasAttached;
  }
  /** Get the first tabbable element from a DOM subtree (inclusive). */
  _getFirstTabbableElement(root) {
    if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
      return root;
    }
    const children = root.children;
    for (let i = 0; i < children.length; i++) {
      const tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE ? this._getFirstTabbableElement(children[i]) : null;
      if (tabbableChild) {
        return tabbableChild;
      }
    }
    return null;
  }
  /** Get the last tabbable element from a DOM subtree (inclusive). */
  _getLastTabbableElement(root) {
    if (this._checker.isFocusable(root) && this._checker.isTabbable(root)) {
      return root;
    }
    const children = root.children;
    for (let i = children.length - 1; i >= 0; i--) {
      const tabbableChild = children[i].nodeType === this._document.ELEMENT_NODE ? this._getLastTabbableElement(children[i]) : null;
      if (tabbableChild) {
        return tabbableChild;
      }
    }
    return null;
  }
  /** Creates an anchor element. */
  _createAnchor() {
    const anchor = this._document.createElement("div");
    this._toggleAnchorTabIndex(this._enabled, anchor);
    anchor.classList.add("cdk-visually-hidden");
    anchor.classList.add("cdk-focus-trap-anchor");
    anchor.setAttribute("aria-hidden", "true");
    return anchor;
  }
  /**
   * Toggles the `tabindex` of an anchor, based on the enabled state of the focus trap.
   * @param isEnabled Whether the focus trap is enabled.
   * @param anchor Anchor on which to toggle the tabindex.
   */
  _toggleAnchorTabIndex(isEnabled, anchor) {
    isEnabled ? anchor.setAttribute("tabindex", "0") : anchor.removeAttribute("tabindex");
  }
  /**
   * Toggles the`tabindex` of both anchors to either trap Tab focus or allow it to escape.
   * @param enabled: Whether the anchors should trap Tab.
   */
  toggleAnchors(enabled) {
    if (this._startAnchor && this._endAnchor) {
      this._toggleAnchorTabIndex(enabled, this._startAnchor);
      this._toggleAnchorTabIndex(enabled, this._endAnchor);
    }
  }
  /** Executes a function when the zone is stable. */
  _executeOnStable(fn2) {
    if (this._injector) {
      afterNextRender(fn2, {
        injector: this._injector
      });
    } else {
      setTimeout(fn2);
    }
  }
};
var _FocusTrapFactory = class _FocusTrapFactory {
  constructor(_checker, _ngZone, _document6) {
    this._checker = _checker;
    this._ngZone = _ngZone;
    this._injector = inject(Injector);
    this._document = _document6;
  }
  /**
   * Creates a focus-trapped region around the given element.
   * @param element The element around which focus will be trapped.
   * @param deferCaptureElements Defers the creation of focus-capturing elements to be done
   *     manually by the user.
   * @returns The created focus trap instance.
   */
  create(element, deferCaptureElements = false) {
    return new FocusTrap(element, this._checker, this._ngZone, this._document, deferCaptureElements, this._injector);
  }
};
_FocusTrapFactory.ɵfac = function FocusTrapFactory_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FocusTrapFactory)(ɵɵinject(InteractivityChecker), ɵɵinject(NgZone), ɵɵinject(DOCUMENT));
};
_FocusTrapFactory.ɵprov = ɵɵdefineInjectable({
  token: _FocusTrapFactory,
  factory: _FocusTrapFactory.ɵfac,
  providedIn: "root"
});
var FocusTrapFactory = _FocusTrapFactory;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FocusTrapFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: InteractivityChecker
  }, {
    type: NgZone
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], null);
})();
var _CdkTrapFocus = class _CdkTrapFocus {
  /** Whether the focus trap is active. */
  get enabled() {
    return this.focusTrap?.enabled || false;
  }
  set enabled(value) {
    if (this.focusTrap) {
      this.focusTrap.enabled = value;
    }
  }
  constructor(_elementRef5, _focusTrapFactory, _document6) {
    this._elementRef = _elementRef5;
    this._focusTrapFactory = _focusTrapFactory;
    this._previouslyFocusedElement = null;
    const platform = inject(Platform);
    if (platform.isBrowser) {
      this.focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement, true);
    }
  }
  ngOnDestroy() {
    this.focusTrap?.destroy();
    if (this._previouslyFocusedElement) {
      this._previouslyFocusedElement.focus();
      this._previouslyFocusedElement = null;
    }
  }
  ngAfterContentInit() {
    this.focusTrap?.attachAnchors();
    if (this.autoCapture) {
      this._captureFocus();
    }
  }
  ngDoCheck() {
    if (this.focusTrap && !this.focusTrap.hasAttached()) {
      this.focusTrap.attachAnchors();
    }
  }
  ngOnChanges(changes) {
    const autoCaptureChange = changes["autoCapture"];
    if (autoCaptureChange && !autoCaptureChange.firstChange && this.autoCapture && this.focusTrap?.hasAttached()) {
      this._captureFocus();
    }
  }
  _captureFocus() {
    this._previouslyFocusedElement = _getFocusedElementPierceShadowDom();
    this.focusTrap?.focusInitialElementWhenReady();
  }
};
_CdkTrapFocus.ɵfac = function CdkTrapFocus_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CdkTrapFocus)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(FocusTrapFactory), ɵɵdirectiveInject(DOCUMENT));
};
_CdkTrapFocus.ɵdir = ɵɵdefineDirective({
  type: _CdkTrapFocus,
  selectors: [["", "cdkTrapFocus", ""]],
  inputs: {
    enabled: [2, "cdkTrapFocus", "enabled", booleanAttribute],
    autoCapture: [2, "cdkTrapFocusAutoCapture", "autoCapture", booleanAttribute]
  },
  exportAs: ["cdkTrapFocus"],
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵNgOnChangesFeature]
});
var CdkTrapFocus = _CdkTrapFocus;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkTrapFocus, [{
    type: Directive,
    args: [{
      selector: "[cdkTrapFocus]",
      exportAs: "cdkTrapFocus",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: FocusTrapFactory
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], {
    enabled: [{
      type: Input,
      args: [{
        alias: "cdkTrapFocus",
        transform: booleanAttribute
      }]
    }],
    autoCapture: [{
      type: Input,
      args: [{
        alias: "cdkTrapFocusAutoCapture",
        transform: booleanAttribute
      }]
    }]
  });
})();
var ConfigurableFocusTrap = class extends FocusTrap {
  /** Whether the FocusTrap is enabled. */
  get enabled() {
    return this._enabled;
  }
  set enabled(value) {
    this._enabled = value;
    if (this._enabled) {
      this._focusTrapManager.register(this);
    } else {
      this._focusTrapManager.deregister(this);
    }
  }
  constructor(_element, _checker, _ngZone, _document6, _focusTrapManager, _inertStrategy, config, injector) {
    super(_element, _checker, _ngZone, _document6, config.defer, injector);
    this._focusTrapManager = _focusTrapManager;
    this._inertStrategy = _inertStrategy;
    this._focusTrapManager.register(this);
  }
  /** Notifies the FocusTrapManager that this FocusTrap will be destroyed. */
  destroy() {
    this._focusTrapManager.deregister(this);
    super.destroy();
  }
  /** @docs-private Implemented as part of ManagedFocusTrap. */
  _enable() {
    this._inertStrategy.preventFocus(this);
    this.toggleAnchors(true);
  }
  /** @docs-private Implemented as part of ManagedFocusTrap. */
  _disable() {
    this._inertStrategy.allowFocus(this);
    this.toggleAnchors(false);
  }
};
var EventListenerFocusTrapInertStrategy = class {
  constructor() {
    this._listener = null;
  }
  /** Adds a document event listener that keeps focus inside the FocusTrap. */
  preventFocus(focusTrap) {
    if (this._listener) {
      focusTrap._document.removeEventListener("focus", this._listener, true);
    }
    this._listener = (e) => this._trapFocus(focusTrap, e);
    focusTrap._ngZone.runOutsideAngular(() => {
      focusTrap._document.addEventListener("focus", this._listener, true);
    });
  }
  /** Removes the event listener added in preventFocus. */
  allowFocus(focusTrap) {
    if (!this._listener) {
      return;
    }
    focusTrap._document.removeEventListener("focus", this._listener, true);
    this._listener = null;
  }
  /**
   * Refocuses the first element in the FocusTrap if the focus event target was outside
   * the FocusTrap.
   *
   * This is an event listener callback. The event listener is added in runOutsideAngular,
   * so all this code runs outside Angular as well.
   */
  _trapFocus(focusTrap, event) {
    const target = event.target;
    const focusTrapRoot = focusTrap._element;
    if (target && !focusTrapRoot.contains(target) && !target.closest?.("div.cdk-overlay-pane")) {
      setTimeout(() => {
        if (focusTrap.enabled && !focusTrapRoot.contains(focusTrap._document.activeElement)) {
          focusTrap.focusFirstTabbableElement();
        }
      });
    }
  }
};
var FOCUS_TRAP_INERT_STRATEGY = new InjectionToken("FOCUS_TRAP_INERT_STRATEGY");
var _FocusTrapManager = class _FocusTrapManager {
  constructor() {
    this._focusTrapStack = [];
  }
  /**
   * Disables the FocusTrap at the top of the stack, and then pushes
   * the new FocusTrap onto the stack.
   */
  register(focusTrap) {
    this._focusTrapStack = this._focusTrapStack.filter((ft) => ft !== focusTrap);
    let stack = this._focusTrapStack;
    if (stack.length) {
      stack[stack.length - 1]._disable();
    }
    stack.push(focusTrap);
    focusTrap._enable();
  }
  /**
   * Removes the FocusTrap from the stack, and activates the
   * FocusTrap that is the new top of the stack.
   */
  deregister(focusTrap) {
    focusTrap._disable();
    const stack = this._focusTrapStack;
    const i = stack.indexOf(focusTrap);
    if (i !== -1) {
      stack.splice(i, 1);
      if (stack.length) {
        stack[stack.length - 1]._enable();
      }
    }
  }
};
_FocusTrapManager.ɵfac = function FocusTrapManager_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FocusTrapManager)();
};
_FocusTrapManager.ɵprov = ɵɵdefineInjectable({
  token: _FocusTrapManager,
  factory: _FocusTrapManager.ɵfac,
  providedIn: "root"
});
var FocusTrapManager = _FocusTrapManager;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FocusTrapManager, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _ConfigurableFocusTrapFactory = class _ConfigurableFocusTrapFactory {
  constructor(_checker, _ngZone, _focusTrapManager, _document6, _inertStrategy) {
    this._checker = _checker;
    this._ngZone = _ngZone;
    this._focusTrapManager = _focusTrapManager;
    this._injector = inject(Injector);
    this._document = _document6;
    this._inertStrategy = _inertStrategy || new EventListenerFocusTrapInertStrategy();
  }
  create(element, config = {
    defer: false
  }) {
    let configObject;
    if (typeof config === "boolean") {
      configObject = {
        defer: config
      };
    } else {
      configObject = config;
    }
    return new ConfigurableFocusTrap(element, this._checker, this._ngZone, this._document, this._focusTrapManager, this._inertStrategy, configObject, this._injector);
  }
};
_ConfigurableFocusTrapFactory.ɵfac = function ConfigurableFocusTrapFactory_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ConfigurableFocusTrapFactory)(ɵɵinject(InteractivityChecker), ɵɵinject(NgZone), ɵɵinject(FocusTrapManager), ɵɵinject(DOCUMENT), ɵɵinject(FOCUS_TRAP_INERT_STRATEGY, 8));
};
_ConfigurableFocusTrapFactory.ɵprov = ɵɵdefineInjectable({
  token: _ConfigurableFocusTrapFactory,
  factory: _ConfigurableFocusTrapFactory.ɵfac,
  providedIn: "root"
});
var ConfigurableFocusTrapFactory = _ConfigurableFocusTrapFactory;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ConfigurableFocusTrapFactory, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: InteractivityChecker
  }, {
    type: NgZone
  }, {
    type: FocusTrapManager
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [FOCUS_TRAP_INERT_STRATEGY]
    }]
  }], null);
})();
function isFakeMousedownFromScreenReader(event) {
  return event.buttons === 0 || event.detail === 0;
}
function isFakeTouchstartFromScreenReader(event) {
  const touch = event.touches && event.touches[0] || event.changedTouches && event.changedTouches[0];
  return !!touch && touch.identifier === -1 && (touch.radiusX == null || touch.radiusX === 1) && (touch.radiusY == null || touch.radiusY === 1);
}
var INPUT_MODALITY_DETECTOR_OPTIONS = new InjectionToken("cdk-input-modality-detector-options");
var INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS = {
  ignoreKeys: [ALT, CONTROL, MAC_META, META, SHIFT]
};
var TOUCH_BUFFER_MS = 650;
var modalityEventListenerOptions = normalizePassiveListenerOptions({
  passive: true,
  capture: true
});
var _InputModalityDetector = class _InputModalityDetector {
  /** The most recently detected input modality. */
  get mostRecentModality() {
    return this._modality.value;
  }
  constructor(_platform, ngZone, document2, options) {
    this._platform = _platform;
    this._mostRecentTarget = null;
    this._modality = new BehaviorSubject(null);
    this._lastTouchMs = 0;
    this._onKeydown = (event) => {
      if (this._options?.ignoreKeys?.some((keyCode) => keyCode === event.keyCode)) {
        return;
      }
      this._modality.next("keyboard");
      this._mostRecentTarget = _getEventTarget(event);
    };
    this._onMousedown = (event) => {
      if (Date.now() - this._lastTouchMs < TOUCH_BUFFER_MS) {
        return;
      }
      this._modality.next(isFakeMousedownFromScreenReader(event) ? "keyboard" : "mouse");
      this._mostRecentTarget = _getEventTarget(event);
    };
    this._onTouchstart = (event) => {
      if (isFakeTouchstartFromScreenReader(event)) {
        this._modality.next("keyboard");
        return;
      }
      this._lastTouchMs = Date.now();
      this._modality.next("touch");
      this._mostRecentTarget = _getEventTarget(event);
    };
    this._options = __spreadValues(__spreadValues({}, INPUT_MODALITY_DETECTOR_DEFAULT_OPTIONS), options);
    this.modalityDetected = this._modality.pipe(skip(1));
    this.modalityChanged = this.modalityDetected.pipe(distinctUntilChanged());
    if (_platform.isBrowser) {
      ngZone.runOutsideAngular(() => {
        document2.addEventListener("keydown", this._onKeydown, modalityEventListenerOptions);
        document2.addEventListener("mousedown", this._onMousedown, modalityEventListenerOptions);
        document2.addEventListener("touchstart", this._onTouchstart, modalityEventListenerOptions);
      });
    }
  }
  ngOnDestroy() {
    this._modality.complete();
    if (this._platform.isBrowser) {
      document.removeEventListener("keydown", this._onKeydown, modalityEventListenerOptions);
      document.removeEventListener("mousedown", this._onMousedown, modalityEventListenerOptions);
      document.removeEventListener("touchstart", this._onTouchstart, modalityEventListenerOptions);
    }
  }
};
_InputModalityDetector.ɵfac = function InputModalityDetector_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _InputModalityDetector)(ɵɵinject(Platform), ɵɵinject(NgZone), ɵɵinject(DOCUMENT), ɵɵinject(INPUT_MODALITY_DETECTOR_OPTIONS, 8));
};
_InputModalityDetector.ɵprov = ɵɵdefineInjectable({
  token: _InputModalityDetector,
  factory: _InputModalityDetector.ɵfac,
  providedIn: "root"
});
var InputModalityDetector = _InputModalityDetector;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputModalityDetector, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Platform
  }, {
    type: NgZone
  }, {
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [INPUT_MODALITY_DETECTOR_OPTIONS]
    }]
  }], null);
})();
var LIVE_ANNOUNCER_ELEMENT_TOKEN = new InjectionToken("liveAnnouncerElement", {
  providedIn: "root",
  factory: LIVE_ANNOUNCER_ELEMENT_TOKEN_FACTORY
});
function LIVE_ANNOUNCER_ELEMENT_TOKEN_FACTORY() {
  return null;
}
var LIVE_ANNOUNCER_DEFAULT_OPTIONS = new InjectionToken("LIVE_ANNOUNCER_DEFAULT_OPTIONS");
var uniqueIds = 0;
var _LiveAnnouncer = class _LiveAnnouncer {
  constructor(elementToken, _ngZone, _document6, _defaultOptions) {
    this._ngZone = _ngZone;
    this._defaultOptions = _defaultOptions;
    this._document = _document6;
    this._liveElement = elementToken || this._createLiveElement();
  }
  announce(message, ...args) {
    const defaultOptions = this._defaultOptions;
    let politeness;
    let duration;
    if (args.length === 1 && typeof args[0] === "number") {
      duration = args[0];
    } else {
      [politeness, duration] = args;
    }
    this.clear();
    clearTimeout(this._previousTimeout);
    if (!politeness) {
      politeness = defaultOptions && defaultOptions.politeness ? defaultOptions.politeness : "polite";
    }
    if (duration == null && defaultOptions) {
      duration = defaultOptions.duration;
    }
    this._liveElement.setAttribute("aria-live", politeness);
    if (this._liveElement.id) {
      this._exposeAnnouncerToModals(this._liveElement.id);
    }
    return this._ngZone.runOutsideAngular(() => {
      if (!this._currentPromise) {
        this._currentPromise = new Promise((resolve) => this._currentResolve = resolve);
      }
      clearTimeout(this._previousTimeout);
      this._previousTimeout = setTimeout(() => {
        this._liveElement.textContent = message;
        if (typeof duration === "number") {
          this._previousTimeout = setTimeout(() => this.clear(), duration);
        }
        this._currentResolve?.();
        this._currentPromise = this._currentResolve = void 0;
      }, 100);
      return this._currentPromise;
    });
  }
  /**
   * Clears the current text from the announcer element. Can be used to prevent
   * screen readers from reading the text out again while the user is going
   * through the page landmarks.
   */
  clear() {
    if (this._liveElement) {
      this._liveElement.textContent = "";
    }
  }
  ngOnDestroy() {
    clearTimeout(this._previousTimeout);
    this._liveElement?.remove();
    this._liveElement = null;
    this._currentResolve?.();
    this._currentPromise = this._currentResolve = void 0;
  }
  _createLiveElement() {
    const elementClass = "cdk-live-announcer-element";
    const previousElements = this._document.getElementsByClassName(elementClass);
    const liveEl = this._document.createElement("div");
    for (let i = 0; i < previousElements.length; i++) {
      previousElements[i].remove();
    }
    liveEl.classList.add(elementClass);
    liveEl.classList.add("cdk-visually-hidden");
    liveEl.setAttribute("aria-atomic", "true");
    liveEl.setAttribute("aria-live", "polite");
    liveEl.id = `cdk-live-announcer-${uniqueIds++}`;
    this._document.body.appendChild(liveEl);
    return liveEl;
  }
  /**
   * Some browsers won't expose the accessibility node of the live announcer element if there is an
   * `aria-modal` and the live announcer is outside of it. This method works around the issue by
   * pointing the `aria-owns` of all modals to the live announcer element.
   */
  _exposeAnnouncerToModals(id) {
    const modals = this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');
    for (let i = 0; i < modals.length; i++) {
      const modal = modals[i];
      const ariaOwns = modal.getAttribute("aria-owns");
      if (!ariaOwns) {
        modal.setAttribute("aria-owns", id);
      } else if (ariaOwns.indexOf(id) === -1) {
        modal.setAttribute("aria-owns", ariaOwns + " " + id);
      }
    }
  }
};
_LiveAnnouncer.ɵfac = function LiveAnnouncer_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _LiveAnnouncer)(ɵɵinject(LIVE_ANNOUNCER_ELEMENT_TOKEN, 8), ɵɵinject(NgZone), ɵɵinject(DOCUMENT), ɵɵinject(LIVE_ANNOUNCER_DEFAULT_OPTIONS, 8));
};
_LiveAnnouncer.ɵprov = ɵɵdefineInjectable({
  token: _LiveAnnouncer,
  factory: _LiveAnnouncer.ɵfac,
  providedIn: "root"
});
var LiveAnnouncer = _LiveAnnouncer;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LiveAnnouncer, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [LIVE_ANNOUNCER_ELEMENT_TOKEN]
    }]
  }, {
    type: NgZone
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [LIVE_ANNOUNCER_DEFAULT_OPTIONS]
    }]
  }], null);
})();
var _CdkAriaLive = class _CdkAriaLive {
  /** The aria-live politeness level to use when announcing messages. */
  get politeness() {
    return this._politeness;
  }
  set politeness(value) {
    this._politeness = value === "off" || value === "assertive" ? value : "polite";
    if (this._politeness === "off") {
      if (this._subscription) {
        this._subscription.unsubscribe();
        this._subscription = null;
      }
    } else if (!this._subscription) {
      this._subscription = this._ngZone.runOutsideAngular(() => {
        return this._contentObserver.observe(this._elementRef).subscribe(() => {
          const elementText = this._elementRef.nativeElement.textContent;
          if (elementText !== this._previousAnnouncedText) {
            this._liveAnnouncer.announce(elementText, this._politeness, this.duration);
            this._previousAnnouncedText = elementText;
          }
        });
      });
    }
  }
  constructor(_elementRef5, _liveAnnouncer, _contentObserver, _ngZone) {
    this._elementRef = _elementRef5;
    this._liveAnnouncer = _liveAnnouncer;
    this._contentObserver = _contentObserver;
    this._ngZone = _ngZone;
    this._politeness = "polite";
  }
  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }
};
_CdkAriaLive.ɵfac = function CdkAriaLive_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CdkAriaLive)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(LiveAnnouncer), ɵɵdirectiveInject(ContentObserver), ɵɵdirectiveInject(NgZone));
};
_CdkAriaLive.ɵdir = ɵɵdefineDirective({
  type: _CdkAriaLive,
  selectors: [["", "cdkAriaLive", ""]],
  inputs: {
    politeness: [0, "cdkAriaLive", "politeness"],
    duration: [0, "cdkAriaLiveDuration", "duration"]
  },
  exportAs: ["cdkAriaLive"],
  standalone: true
});
var CdkAriaLive = _CdkAriaLive;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkAriaLive, [{
    type: Directive,
    args: [{
      selector: "[cdkAriaLive]",
      exportAs: "cdkAriaLive",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: LiveAnnouncer
  }, {
    type: ContentObserver
  }, {
    type: NgZone
  }], {
    politeness: [{
      type: Input,
      args: ["cdkAriaLive"]
    }],
    duration: [{
      type: Input,
      args: ["cdkAriaLiveDuration"]
    }]
  });
})();
var FocusMonitorDetectionMode;
(function(FocusMonitorDetectionMode2) {
  FocusMonitorDetectionMode2[FocusMonitorDetectionMode2["IMMEDIATE"] = 0] = "IMMEDIATE";
  FocusMonitorDetectionMode2[FocusMonitorDetectionMode2["EVENTUAL"] = 1] = "EVENTUAL";
})(FocusMonitorDetectionMode || (FocusMonitorDetectionMode = {}));
var FOCUS_MONITOR_DEFAULT_OPTIONS = new InjectionToken("cdk-focus-monitor-default-options");
var captureEventListenerOptions = normalizePassiveListenerOptions({
  passive: true,
  capture: true
});
var _FocusMonitor = class _FocusMonitor {
  constructor(_ngZone, _platform, _inputModalityDetector, document2, options) {
    this._ngZone = _ngZone;
    this._platform = _platform;
    this._inputModalityDetector = _inputModalityDetector;
    this._origin = null;
    this._windowFocused = false;
    this._originFromTouchInteraction = false;
    this._elementInfo = /* @__PURE__ */ new Map();
    this._monitoredElementCount = 0;
    this._rootNodeFocusListenerCount = /* @__PURE__ */ new Map();
    this._windowFocusListener = () => {
      this._windowFocused = true;
      this._windowFocusTimeoutId = window.setTimeout(() => this._windowFocused = false);
    };
    this._stopInputModalityDetector = new Subject();
    this._rootNodeFocusAndBlurListener = (event) => {
      const target = _getEventTarget(event);
      for (let element = target; element; element = element.parentElement) {
        if (event.type === "focus") {
          this._onFocus(event, element);
        } else {
          this._onBlur(event, element);
        }
      }
    };
    this._document = document2;
    this._detectionMode = options?.detectionMode || FocusMonitorDetectionMode.IMMEDIATE;
  }
  monitor(element, checkChildren = false) {
    const nativeElement = coerceElement(element);
    if (!this._platform.isBrowser || nativeElement.nodeType !== 1) {
      return of();
    }
    const rootNode = _getShadowRoot(nativeElement) || this._getDocument();
    const cachedInfo = this._elementInfo.get(nativeElement);
    if (cachedInfo) {
      if (checkChildren) {
        cachedInfo.checkChildren = true;
      }
      return cachedInfo.subject;
    }
    const info = {
      checkChildren,
      subject: new Subject(),
      rootNode
    };
    this._elementInfo.set(nativeElement, info);
    this._registerGlobalListeners(info);
    return info.subject;
  }
  stopMonitoring(element) {
    const nativeElement = coerceElement(element);
    const elementInfo = this._elementInfo.get(nativeElement);
    if (elementInfo) {
      elementInfo.subject.complete();
      this._setClasses(nativeElement);
      this._elementInfo.delete(nativeElement);
      this._removeGlobalListeners(elementInfo);
    }
  }
  focusVia(element, origin, options) {
    const nativeElement = coerceElement(element);
    const focusedElement = this._getDocument().activeElement;
    if (nativeElement === focusedElement) {
      this._getClosestElementsInfo(nativeElement).forEach(([currentElement, info]) => this._originChanged(currentElement, origin, info));
    } else {
      this._setOrigin(origin);
      if (typeof nativeElement.focus === "function") {
        nativeElement.focus(options);
      }
    }
  }
  ngOnDestroy() {
    this._elementInfo.forEach((_info, element) => this.stopMonitoring(element));
  }
  /** Access injected document if available or fallback to global document reference */
  _getDocument() {
    return this._document || document;
  }
  /** Use defaultView of injected document if available or fallback to global window reference */
  _getWindow() {
    const doc = this._getDocument();
    return doc.defaultView || window;
  }
  _getFocusOrigin(focusEventTarget) {
    if (this._origin) {
      if (this._originFromTouchInteraction) {
        return this._shouldBeAttributedToTouch(focusEventTarget) ? "touch" : "program";
      } else {
        return this._origin;
      }
    }
    if (this._windowFocused && this._lastFocusOrigin) {
      return this._lastFocusOrigin;
    }
    if (focusEventTarget && this._isLastInteractionFromInputLabel(focusEventTarget)) {
      return "mouse";
    }
    return "program";
  }
  /**
   * Returns whether the focus event should be attributed to touch. Recall that in IMMEDIATE mode, a
   * touch origin isn't immediately reset at the next tick (see _setOrigin). This means that when we
   * handle a focus event following a touch interaction, we need to determine whether (1) the focus
   * event was directly caused by the touch interaction or (2) the focus event was caused by a
   * subsequent programmatic focus call triggered by the touch interaction.
   * @param focusEventTarget The target of the focus event under examination.
   */
  _shouldBeAttributedToTouch(focusEventTarget) {
    return this._detectionMode === FocusMonitorDetectionMode.EVENTUAL || !!focusEventTarget?.contains(this._inputModalityDetector._mostRecentTarget);
  }
  /**
   * Sets the focus classes on the element based on the given focus origin.
   * @param element The element to update the classes on.
   * @param origin The focus origin.
   */
  _setClasses(element, origin) {
    element.classList.toggle("cdk-focused", !!origin);
    element.classList.toggle("cdk-touch-focused", origin === "touch");
    element.classList.toggle("cdk-keyboard-focused", origin === "keyboard");
    element.classList.toggle("cdk-mouse-focused", origin === "mouse");
    element.classList.toggle("cdk-program-focused", origin === "program");
  }
  /**
   * Updates the focus origin. If we're using immediate detection mode, we schedule an async
   * function to clear the origin at the end of a timeout. The duration of the timeout depends on
   * the origin being set.
   * @param origin The origin to set.
   * @param isFromInteraction Whether we are setting the origin from an interaction event.
   */
  _setOrigin(origin, isFromInteraction = false) {
    this._ngZone.runOutsideAngular(() => {
      this._origin = origin;
      this._originFromTouchInteraction = origin === "touch" && isFromInteraction;
      if (this._detectionMode === FocusMonitorDetectionMode.IMMEDIATE) {
        clearTimeout(this._originTimeoutId);
        const ms = this._originFromTouchInteraction ? TOUCH_BUFFER_MS : 1;
        this._originTimeoutId = setTimeout(() => this._origin = null, ms);
      }
    });
  }
  /**
   * Handles focus events on a registered element.
   * @param event The focus event.
   * @param element The monitored element.
   */
  _onFocus(event, element) {
    const elementInfo = this._elementInfo.get(element);
    const focusEventTarget = _getEventTarget(event);
    if (!elementInfo || !elementInfo.checkChildren && element !== focusEventTarget) {
      return;
    }
    this._originChanged(element, this._getFocusOrigin(focusEventTarget), elementInfo);
  }
  /**
   * Handles blur events on a registered element.
   * @param event The blur event.
   * @param element The monitored element.
   */
  _onBlur(event, element) {
    const elementInfo = this._elementInfo.get(element);
    if (!elementInfo || elementInfo.checkChildren && event.relatedTarget instanceof Node && element.contains(event.relatedTarget)) {
      return;
    }
    this._setClasses(element);
    this._emitOrigin(elementInfo, null);
  }
  _emitOrigin(info, origin) {
    if (info.subject.observers.length) {
      this._ngZone.run(() => info.subject.next(origin));
    }
  }
  _registerGlobalListeners(elementInfo) {
    if (!this._platform.isBrowser) {
      return;
    }
    const rootNode = elementInfo.rootNode;
    const rootNodeFocusListeners = this._rootNodeFocusListenerCount.get(rootNode) || 0;
    if (!rootNodeFocusListeners) {
      this._ngZone.runOutsideAngular(() => {
        rootNode.addEventListener("focus", this._rootNodeFocusAndBlurListener, captureEventListenerOptions);
        rootNode.addEventListener("blur", this._rootNodeFocusAndBlurListener, captureEventListenerOptions);
      });
    }
    this._rootNodeFocusListenerCount.set(rootNode, rootNodeFocusListeners + 1);
    if (++this._monitoredElementCount === 1) {
      this._ngZone.runOutsideAngular(() => {
        const window2 = this._getWindow();
        window2.addEventListener("focus", this._windowFocusListener);
      });
      this._inputModalityDetector.modalityDetected.pipe(takeUntil(this._stopInputModalityDetector)).subscribe((modality) => {
        this._setOrigin(
          modality,
          true
          /* isFromInteraction */
        );
      });
    }
  }
  _removeGlobalListeners(elementInfo) {
    const rootNode = elementInfo.rootNode;
    if (this._rootNodeFocusListenerCount.has(rootNode)) {
      const rootNodeFocusListeners = this._rootNodeFocusListenerCount.get(rootNode);
      if (rootNodeFocusListeners > 1) {
        this._rootNodeFocusListenerCount.set(rootNode, rootNodeFocusListeners - 1);
      } else {
        rootNode.removeEventListener("focus", this._rootNodeFocusAndBlurListener, captureEventListenerOptions);
        rootNode.removeEventListener("blur", this._rootNodeFocusAndBlurListener, captureEventListenerOptions);
        this._rootNodeFocusListenerCount.delete(rootNode);
      }
    }
    if (!--this._monitoredElementCount) {
      const window2 = this._getWindow();
      window2.removeEventListener("focus", this._windowFocusListener);
      this._stopInputModalityDetector.next();
      clearTimeout(this._windowFocusTimeoutId);
      clearTimeout(this._originTimeoutId);
    }
  }
  /** Updates all the state on an element once its focus origin has changed. */
  _originChanged(element, origin, elementInfo) {
    this._setClasses(element, origin);
    this._emitOrigin(elementInfo, origin);
    this._lastFocusOrigin = origin;
  }
  /**
   * Collects the `MonitoredElementInfo` of a particular element and
   * all of its ancestors that have enabled `checkChildren`.
   * @param element Element from which to start the search.
   */
  _getClosestElementsInfo(element) {
    const results = [];
    this._elementInfo.forEach((info, currentElement) => {
      if (currentElement === element || info.checkChildren && currentElement.contains(element)) {
        results.push([currentElement, info]);
      }
    });
    return results;
  }
  /**
   * Returns whether an interaction is likely to have come from the user clicking the `label` of
   * an `input` or `textarea` in order to focus it.
   * @param focusEventTarget Target currently receiving focus.
   */
  _isLastInteractionFromInputLabel(focusEventTarget) {
    const {
      _mostRecentTarget: mostRecentTarget,
      mostRecentModality
    } = this._inputModalityDetector;
    if (mostRecentModality !== "mouse" || !mostRecentTarget || mostRecentTarget === focusEventTarget || focusEventTarget.nodeName !== "INPUT" && focusEventTarget.nodeName !== "TEXTAREA" || focusEventTarget.disabled) {
      return false;
    }
    const labels = focusEventTarget.labels;
    if (labels) {
      for (let i = 0; i < labels.length; i++) {
        if (labels[i].contains(mostRecentTarget)) {
          return true;
        }
      }
    }
    return false;
  }
};
_FocusMonitor.ɵfac = function FocusMonitor_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FocusMonitor)(ɵɵinject(NgZone), ɵɵinject(Platform), ɵɵinject(InputModalityDetector), ɵɵinject(DOCUMENT, 8), ɵɵinject(FOCUS_MONITOR_DEFAULT_OPTIONS, 8));
};
_FocusMonitor.ɵprov = ɵɵdefineInjectable({
  token: _FocusMonitor,
  factory: _FocusMonitor.ɵfac,
  providedIn: "root"
});
var FocusMonitor = _FocusMonitor;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FocusMonitor, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: NgZone
  }, {
    type: Platform
  }, {
    type: InputModalityDetector
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [FOCUS_MONITOR_DEFAULT_OPTIONS]
    }]
  }], null);
})();
var _CdkMonitorFocus = class _CdkMonitorFocus {
  constructor(_elementRef5, _focusMonitor2) {
    this._elementRef = _elementRef5;
    this._focusMonitor = _focusMonitor2;
    this._focusOrigin = null;
    this.cdkFocusChange = new EventEmitter();
  }
  get focusOrigin() {
    return this._focusOrigin;
  }
  ngAfterViewInit() {
    const element = this._elementRef.nativeElement;
    this._monitorSubscription = this._focusMonitor.monitor(element, element.nodeType === 1 && element.hasAttribute("cdkMonitorSubtreeFocus")).subscribe((origin) => {
      this._focusOrigin = origin;
      this.cdkFocusChange.emit(origin);
    });
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    if (this._monitorSubscription) {
      this._monitorSubscription.unsubscribe();
    }
  }
};
_CdkMonitorFocus.ɵfac = function CdkMonitorFocus_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CdkMonitorFocus)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(FocusMonitor));
};
_CdkMonitorFocus.ɵdir = ɵɵdefineDirective({
  type: _CdkMonitorFocus,
  selectors: [["", "cdkMonitorElementFocus", ""], ["", "cdkMonitorSubtreeFocus", ""]],
  outputs: {
    cdkFocusChange: "cdkFocusChange"
  },
  exportAs: ["cdkMonitorFocus"],
  standalone: true
});
var CdkMonitorFocus = _CdkMonitorFocus;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CdkMonitorFocus, [{
    type: Directive,
    args: [{
      selector: "[cdkMonitorElementFocus], [cdkMonitorSubtreeFocus]",
      exportAs: "cdkMonitorFocus",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: FocusMonitor
  }], {
    cdkFocusChange: [{
      type: Output
    }]
  });
})();
var HighContrastMode;
(function(HighContrastMode2) {
  HighContrastMode2[HighContrastMode2["NONE"] = 0] = "NONE";
  HighContrastMode2[HighContrastMode2["BLACK_ON_WHITE"] = 1] = "BLACK_ON_WHITE";
  HighContrastMode2[HighContrastMode2["WHITE_ON_BLACK"] = 2] = "WHITE_ON_BLACK";
})(HighContrastMode || (HighContrastMode = {}));
var BLACK_ON_WHITE_CSS_CLASS = "cdk-high-contrast-black-on-white";
var WHITE_ON_BLACK_CSS_CLASS = "cdk-high-contrast-white-on-black";
var HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS = "cdk-high-contrast-active";
var _HighContrastModeDetector = class _HighContrastModeDetector {
  constructor(_platform, document2) {
    this._platform = _platform;
    this._document = document2;
    this._breakpointSubscription = inject(BreakpointObserver).observe("(forced-colors: active)").subscribe(() => {
      if (this._hasCheckedHighContrastMode) {
        this._hasCheckedHighContrastMode = false;
        this._applyBodyHighContrastModeCssClasses();
      }
    });
  }
  /** Gets the current high-contrast-mode for the page. */
  getHighContrastMode() {
    if (!this._platform.isBrowser) {
      return HighContrastMode.NONE;
    }
    const testElement = this._document.createElement("div");
    testElement.style.backgroundColor = "rgb(1,2,3)";
    testElement.style.position = "absolute";
    this._document.body.appendChild(testElement);
    const documentWindow = this._document.defaultView || window;
    const computedStyle = documentWindow && documentWindow.getComputedStyle ? documentWindow.getComputedStyle(testElement) : null;
    const computedColor = (computedStyle && computedStyle.backgroundColor || "").replace(/ /g, "");
    testElement.remove();
    switch (computedColor) {
      case "rgb(0,0,0)":
      case "rgb(45,50,54)":
      case "rgb(32,32,32)":
        return HighContrastMode.WHITE_ON_BLACK;
      case "rgb(255,255,255)":
      case "rgb(255,250,239)":
        return HighContrastMode.BLACK_ON_WHITE;
    }
    return HighContrastMode.NONE;
  }
  ngOnDestroy() {
    this._breakpointSubscription.unsubscribe();
  }
  /** Applies CSS classes indicating high-contrast mode to document body (browser-only). */
  _applyBodyHighContrastModeCssClasses() {
    if (!this._hasCheckedHighContrastMode && this._platform.isBrowser && this._document.body) {
      const bodyClasses = this._document.body.classList;
      bodyClasses.remove(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, BLACK_ON_WHITE_CSS_CLASS, WHITE_ON_BLACK_CSS_CLASS);
      this._hasCheckedHighContrastMode = true;
      const mode = this.getHighContrastMode();
      if (mode === HighContrastMode.BLACK_ON_WHITE) {
        bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, BLACK_ON_WHITE_CSS_CLASS);
      } else if (mode === HighContrastMode.WHITE_ON_BLACK) {
        bodyClasses.add(HIGH_CONTRAST_MODE_ACTIVE_CSS_CLASS, WHITE_ON_BLACK_CSS_CLASS);
      }
    }
  }
};
_HighContrastModeDetector.ɵfac = function HighContrastModeDetector_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HighContrastModeDetector)(ɵɵinject(Platform), ɵɵinject(DOCUMENT));
};
_HighContrastModeDetector.ɵprov = ɵɵdefineInjectable({
  token: _HighContrastModeDetector,
  factory: _HighContrastModeDetector.ɵfac,
  providedIn: "root"
});
var HighContrastModeDetector = _HighContrastModeDetector;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HighContrastModeDetector, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Platform
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }], null);
})();
var _A11yModule = class _A11yModule {
  constructor(highContrastModeDetector) {
    highContrastModeDetector._applyBodyHighContrastModeCssClasses();
  }
};
_A11yModule.ɵfac = function A11yModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _A11yModule)(ɵɵinject(HighContrastModeDetector));
};
_A11yModule.ɵmod = ɵɵdefineNgModule({
  type: _A11yModule,
  imports: [ObserversModule, CdkAriaLive, CdkTrapFocus, CdkMonitorFocus],
  exports: [CdkAriaLive, CdkTrapFocus, CdkMonitorFocus]
});
_A11yModule.ɵinj = ɵɵdefineInjector({
  imports: [ObserversModule]
});
var A11yModule = _A11yModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(A11yModule, [{
    type: NgModule,
    args: [{
      imports: [ObserversModule, CdkAriaLive, CdkTrapFocus, CdkMonitorFocus],
      exports: [CdkAriaLive, CdkTrapFocus, CdkMonitorFocus]
    }]
  }], () => [{
    type: HighContrastModeDetector
  }], null);
})();

// node_modules/@coreui/angular/fesm2022/coreui-angular.mjs
var _c0 = ["*"];
var _c1 = ["*", "*"];
function AccordionItemComponent_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function AccordionItemComponent_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function AccordionItemComponent_ng_template_5_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function AccordionItemComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 7);
    ɵɵlistener("click", function AccordionItemComponent_ng_template_5_Template_button_click_0_listener() {
      ɵɵrestoreView(_r1);
      const ctx_r1 = ɵɵnextContext();
      return ɵɵresetView(ctx_r1.toggleItem());
    });
    ɵɵtemplate(1, AccordionItemComponent_ng_template_5_ng_container_1_Template, 1, 0, "ng-container", 5);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    const defaultAccordionHeaderContentTemplate_r3 = ɵɵreference(8);
    ɵɵproperty("collapsed", !ctx_r1.visible);
    ɵɵattribute("aria-controls", ctx_r1.contentId);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.templates["accordionHeader"] || defaultAccordionHeaderContentTemplate_r3)("ngTemplateOutletContext", ctx_r1.itemContext);
  }
}
function AccordionItemComponent_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function AccordionItemComponent_ng_template_9_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function AccordionItemComponent_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 8);
    ɵɵtemplate(1, AccordionItemComponent_ng_template_9_ng_container_1_Template, 1, 0, "ng-container", 5);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    const defaultAccordionBodyContentTemplate_r4 = ɵɵreference(12);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", ctx_r1.templates["accordionBody"] || defaultAccordionBodyContentTemplate_r4)("ngTemplateOutletContext", ctx_r1.itemContext);
  }
}
function AccordionItemComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 1);
  }
}
function AlertComponent_Conditional_0_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function AlertComponent_Conditional_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, AlertComponent_Conditional_0_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    const defaultAlertButtonCloseTemplate_r2 = ɵɵreference(2);
    ɵɵproperty("ngTemplateOutlet", (ctx_r0.templates == null ? null : ctx_r0.templates.alertButtonCloseTemplate) || defaultAlertButtonCloseTemplate_r2);
  }
}
function AlertComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, AlertComponent_Conditional_0_Conditional_0_Template, 1, 1, "ng-container");
    ɵɵprojection(1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional(ctx_r0.dismissible ? 0 : -1);
  }
}
function AlertComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 2);
    ɵɵlistener("click", function AlertComponent_ng_template_1_Template_button_click_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r0 = ɵɵnextContext();
      return ɵɵresetView(ctx_r0.visible = false);
    });
    ɵɵelementEnd();
  }
}
var AvatarComponent_ProjectionFallback_0_Conditional_0_Defer_2_DepsFn = () => [NgOptimizedImage];
function AvatarComponent_ProjectionFallback_0_Conditional_0_Defer_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "img", 1);
  }
  if (rf & 2) {
    let tmp_4_0;
    const ctx_r0 = ɵɵnextContext(3);
    ɵɵpropertyInterpolate("alt", ctx_r0.alt());
    ɵɵproperty("ngSrc", (tmp_4_0 = ctx_r0.src()) !== null && tmp_4_0 !== void 0 ? tmp_4_0 : "");
  }
}
function AvatarComponent_ProjectionFallback_0_Conditional_0_DeferPlaceholder_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelementStart(0, "svg", 2);
    ɵɵelement(1, "rect", 3);
    ɵɵelementEnd();
  }
}
function AvatarComponent_ProjectionFallback_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, AvatarComponent_ProjectionFallback_0_Conditional_0_Defer_0_Template, 1, 2)(1, AvatarComponent_ProjectionFallback_0_Conditional_0_DeferPlaceholder_1_Template, 2, 0);
    ɵɵdefer(2, 0, AvatarComponent_ProjectionFallback_0_Conditional_0_Defer_2_DepsFn, null, 1);
    ɵɵdeferOnIdle();
    ɵɵdeferPrefetchOnIdle();
  }
}
function AvatarComponent_ProjectionFallback_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, AvatarComponent_ProjectionFallback_0_Conditional_0_Template, 4, 0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵconditional(ctx_r0.src() ? 0 : -1);
  }
}
function AvatarComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r0.statusClass());
  }
}
var _c2 = () => ({});
function BreadcrumbItemComponent_Conditional_0_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function BreadcrumbItemComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "a", 1);
    ɵɵtemplate(1, BreadcrumbItemComponent_Conditional_0_ng_container_1_Template, 1, 0, "ng-container", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_5_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_10_0;
    let tmp_11_0;
    const ctx_r0 = ɵɵnextContext();
    const defaultBreadcrumbItemContentTemplate_r2 = ɵɵreference(3);
    ɵɵproperty("routerLink", ctx_r0.url)("cHtmlAttr", (tmp_3_0 = ctx_r0.attributes) !== null && tmp_3_0 !== void 0 ? tmp_3_0 : ɵɵpureFunction0(11, _c2))("target", ctx_r0.attributes == null ? null : ctx_r0.attributes["target"])("queryParams", (tmp_5_0 = ctx_r0.linkProps == null ? null : ctx_r0.linkProps.queryParams) !== null && tmp_5_0 !== void 0 ? tmp_5_0 : null)("fragment", ctx_r0.linkProps == null ? null : ctx_r0.linkProps.fragment)("queryParamsHandling", (tmp_7_0 = ctx_r0.linkProps == null ? null : ctx_r0.linkProps.queryParamsHandling) !== null && tmp_7_0 !== void 0 ? tmp_7_0 : null)("preserveFragment", (tmp_8_0 = ctx_r0.linkProps == null ? null : ctx_r0.linkProps.preserveFragment) !== null && tmp_8_0 !== void 0 ? tmp_8_0 : false)("skipLocationChange", (tmp_9_0 = ctx_r0.linkProps == null ? null : ctx_r0.linkProps.skipLocationChange) !== null && tmp_9_0 !== void 0 ? tmp_9_0 : false)("replaceUrl", (tmp_10_0 = ctx_r0.linkProps == null ? null : ctx_r0.linkProps.replaceUrl) !== null && tmp_10_0 !== void 0 ? tmp_10_0 : false)("state", (tmp_11_0 = ctx_r0.linkProps == null ? null : ctx_r0.linkProps.state) !== null && tmp_11_0 !== void 0 ? tmp_11_0 : ɵɵpureFunction0(12, _c2));
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", defaultBreadcrumbItemContentTemplate_r2);
  }
}
function BreadcrumbItemComponent_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function BreadcrumbItemComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 2);
    ɵɵtemplate(1, BreadcrumbItemComponent_Conditional_1_ng_container_1_Template, 1, 0, "ng-container", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = ɵɵnextContext();
    const defaultBreadcrumbItemContentTemplate_r2 = ɵɵreference(3);
    ɵɵproperty("cHtmlAttr", (tmp_2_0 = ctx_r0.attributes) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : ɵɵpureFunction0(2, _c2));
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", defaultBreadcrumbItemContentTemplate_r2);
  }
}
function BreadcrumbItemComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function BreadcrumbRouterComponent_For_2_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "c-breadcrumb-item", 1);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const breadcrumb_r2 = ctx_r0.$implicit;
    const ɵ$index_3_r3 = ctx_r0.$index;
    const ɵ$count_3_r4 = ctx_r0.$count;
    ɵɵproperty("active", ɵ$index_3_r3 === ɵ$count_3_r4 - 1)("url", breadcrumb_r2 == null ? null : breadcrumb_r2.url)("attributes", breadcrumb_r2 == null ? null : breadcrumb_r2.attributes)("linkProps", breadcrumb_r2 == null ? null : breadcrumb_r2.linkProps);
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", breadcrumb_r2 == null ? null : breadcrumb_r2.label, " ");
  }
}
function BreadcrumbRouterComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, BreadcrumbRouterComponent_For_2_Conditional_0_Template, 2, 5, "c-breadcrumb-item", 1);
  }
  if (rf & 2) {
    const breadcrumb_r2 = ctx.$implicit;
    const ɵ$index_3_r3 = ctx.$index;
    const ɵ$count_3_r4 = ctx.$count;
    ɵɵconditional((breadcrumb_r2 == null ? null : breadcrumb_r2.label) && ((breadcrumb_r2 == null ? null : breadcrumb_r2.url == null ? null : breadcrumb_r2.url.slice(-1)) === "/" || ɵ$index_3_r3 === ɵ$count_3_r4 - 1) ? 0 : -1);
  }
}
var _c3 = ["content"];
function CarouselControlComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", null, 0);
    ɵɵprojection(2);
    ɵɵelementEnd();
  }
}
function CarouselControlComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span");
    ɵɵelementStart(1, "span", 1);
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵclassMap(ctx_r0.carouselControlIconClass);
    ɵɵattribute("aria-label", ctx_r0.direction)("aria-hidden", true);
    ɵɵadvance(2);
    ɵɵtextInterpolate(ctx_r0.caption);
  }
}
var _c4 = (a0) => ({
  active: a0
});
function CarouselIndicatorsComponent_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "button", 2);
    ɵɵlistener("click", function CarouselIndicatorsComponent_For_2_Template_button_click_0_listener() {
      const ɵ$index_3_r2 = ɵɵrestoreView(_r1).$index;
      const ctx_r2 = ɵɵnextContext();
      return ɵɵresetView(ctx_r2.onClick(ɵ$index_3_r2));
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ɵ$index_3_r2 = ctx.$index;
    const ctx_r2 = ɵɵnextContext();
    ɵɵclassMap(ɵɵpureFunction1(4, _c4, ctx_r2.active === ɵ$index_3_r2));
    ɵɵattribute("data-coreui-target", ɵ$index_3_r2)("aria-current", ctx_r2.active === ɵ$index_3_r2);
  }
}
function CarouselItemComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function HeaderComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 0);
    ɵɵprojection(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r0.headerClasses());
  }
}
function HeaderComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 1);
  }
}
function NavbarComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function NavbarComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 3);
    ɵɵprojection(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r0.containerClass);
  }
}
function NavbarComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 1);
  }
}
var _c5 = ["modalContentRef"];
var _c6 = "[_nghost-%COMP%]{display:list-item;text-align:-webkit-match-parent;text-align:match-parent}";
var _c7 = ["popoverTemplate"];
var _c8 = (a0) => ({
  "popover-arrow": a0
});
function ProgressComponent_Conditional_0_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function ProgressComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, ProgressComponent_Conditional_0_ng_container_0_Template, 1, 0, "ng-container", 3);
  }
  if (rf & 2) {
    ɵɵnextContext();
    const defaultContent_r1 = ɵɵreference(4);
    ɵɵproperty("ngTemplateOutlet", defaultContent_r1);
  }
}
function ProgressComponent_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function ProgressComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "c-progress-bar", 1);
    ɵɵtemplate(1, ProgressComponent_Conditional_1_ng_container_1_Template, 1, 0, "ng-container", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    const defaultContent_r1 = ɵɵreference(4);
    ɵɵproperty("animated", ctx_r1.pbd == null ? null : ctx_r1.pbd.animated)("variant", ctx_r1.pbd == null ? null : ctx_r1.pbd.variant)("color", ctx_r1.pbd == null ? null : ctx_r1.pbd.color);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", defaultContent_r1);
  }
}
function ProgressComponent_Conditional_2_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function ProgressComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "c-progress-bar", 2);
    ɵɵtemplate(1, ProgressComponent_Conditional_2_ng_container_1_Template, 1, 0, "ng-container", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    const defaultContent_r1 = ɵɵreference(4);
    ɵɵproperty("width", ctx_r1.pbd == null ? null : ctx_r1.pbd.percent())("animated", ctx_r1.pbd == null ? null : ctx_r1.pbd.animated)("variant", ctx_r1.pbd == null ? null : ctx_r1.pbd.variant)("color", ctx_r1.pbd == null ? null : ctx_r1.pbd.color);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", defaultContent_r1);
  }
}
function ProgressComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function SidebarBrandComponent_Conditional_0_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "img", 1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("cHtmlAttr", ctx_r0.brandFull)("ngClass", "sidebar-brand-full");
  }
}
function SidebarBrandComponent_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "img", 1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("cHtmlAttr", ctx_r0.brandNarrow)("ngClass", "sidebar-brand-narrow");
  }
}
function SidebarBrandComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "a", 0);
    ɵɵtemplate(1, SidebarBrandComponent_Conditional_0_Conditional_1_Template, 1, 2, "img", 1)(2, SidebarBrandComponent_Conditional_0_Conditional_2_Template, 1, 2, "img", 1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("routerLink", ctx_r0.routerLink);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.brandFull ? 1 : -1);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.brandNarrow ? 2 : -1);
  }
}
function SidebarBrandComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function SidebarNavLinkContentComponent_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainerStart(0);
    ɵɵtext(1);
    ɵɵelementContainerEnd();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate((tmp_1_0 = ctx_r0.item == null ? null : ctx_r0.item.name) !== null && tmp_1_0 !== void 0 ? tmp_1_0 : "");
  }
}
var _c9 = (a0) => ({
  $implicit: a0
});
var _c10 = () => ({
  exact: false
});
function SidebarNavLinkComponent_Case_0_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function SidebarNavLinkComponent_Case_0_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 6);
    ɵɵpipe(1, "cSidebarNavBadge");
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("ngClass", ɵɵpipeBind1(1, 2, ctx_r0.item));
    ɵɵadvance(2);
    ɵɵtextInterpolate(ctx_r0.item.badge == null ? null : ctx_r0.item.badge.text);
  }
}
function SidebarNavLinkComponent_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "a", 1);
    ɵɵpipe(1, "cSidebarNavLink");
    ɵɵtemplate(2, SidebarNavLinkComponent_Case_0_ng_container_2_Template, 1, 0, "ng-container", 4);
    ɵɵelement(3, "c-sidebar-nav-link-content", 5);
    ɵɵtemplate(4, SidebarNavLinkComponent_Case_0_Conditional_4_Template, 3, 4, "span", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = ɵɵnextContext();
    const iconTemplate_r2 = ɵɵreference(4);
    ɵɵproperty("cHtmlAttr", (tmp_2_0 = ctx_r0.item.attributes) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : ɵɵpureFunction0(8, _c2))("ngClass", ɵɵpipeBind1(1, 6, ctx_r0.item));
    ɵɵadvance(2);
    ɵɵproperty("ngTemplateOutlet", iconTemplate_r2)("ngTemplateOutletContext", ɵɵpureFunction1(9, _c9, ctx_r0.item));
    ɵɵadvance();
    ɵɵproperty("item", ctx_r0.item);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.item.badge ? 4 : -1);
  }
}
function SidebarNavLinkComponent_Case_1_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function SidebarNavLinkComponent_Case_1_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 6);
    ɵɵpipe(1, "cSidebarNavBadge");
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("ngClass", ɵɵpipeBind1(1, 2, ctx_r0.item));
    ɵɵadvance(2);
    ɵɵtextInterpolate(ctx_r0.item.badge == null ? null : ctx_r0.item.badge.text);
  }
}
function SidebarNavLinkComponent_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "a", 7);
    ɵɵpipe(1, "cSidebarNavLink");
    ɵɵlistener("click", function SidebarNavLinkComponent_Case_1_Template_a_click_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r0 = ɵɵnextContext();
      return ɵɵresetView(ctx_r0.linkClicked());
    });
    ɵɵtemplate(2, SidebarNavLinkComponent_Case_1_ng_container_2_Template, 1, 0, "ng-container", 4);
    ɵɵelement(3, "c-sidebar-nav-link-content", 5);
    ɵɵtemplate(4, SidebarNavLinkComponent_Case_1_Conditional_4_Template, 3, 4, "span", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    const ctx_r0 = ɵɵnextContext();
    const iconTemplate_r2 = ɵɵreference(4);
    ɵɵproperty("cHtmlAttr", (tmp_2_0 = ctx_r0.item.attributes) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : ɵɵpureFunction0(9, _c2))("href", ctx_r0.href, ɵɵsanitizeUrl)("ngClass", ɵɵpipeBind1(1, 7, ctx_r0.item));
    ɵɵadvance(2);
    ɵɵproperty("ngTemplateOutlet", iconTemplate_r2)("ngTemplateOutletContext", ɵɵpureFunction1(10, _c9, ctx_r0.item));
    ɵɵadvance();
    ɵɵproperty("item", ctx_r0.item);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.item.badge ? 4 : -1);
  }
}
function SidebarNavLinkComponent_Case_2_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function SidebarNavLinkComponent_Case_2_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 6);
    ɵɵpipe(1, "cSidebarNavBadge");
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext(2);
    ɵɵproperty("ngClass", ɵɵpipeBind1(1, 2, ctx_r0.item));
    ɵɵadvance(2);
    ɵɵtextInterpolate(ctx_r0.item.badge == null ? null : ctx_r0.item.badge.text);
  }
}
function SidebarNavLinkComponent_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "a", 8);
    ɵɵpipe(1, "cSidebarNavLink");
    ɵɵlistener("click", function SidebarNavLinkComponent_Case_2_Template_a_click_0_listener() {
      ɵɵrestoreView(_r4);
      const ctx_r0 = ɵɵnextContext();
      return ɵɵresetView(ctx_r0.linkClicked());
    });
    ɵɵtemplate(2, SidebarNavLinkComponent_Case_2_ng_container_2_Template, 1, 0, "ng-container", 4);
    ɵɵelement(3, "c-sidebar-nav-link-content", 5);
    ɵɵtemplate(4, SidebarNavLinkComponent_Case_2_Conditional_4_Template, 3, 4, "span", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    let tmp_2_0;
    let tmp_5_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_11_0;
    let tmp_12_0;
    const ctx_r0 = ɵɵnextContext();
    const iconTemplate_r2 = ɵɵreference(4);
    ɵɵproperty("cHtmlAttr", (tmp_2_0 = ctx_r0.item.attributes) !== null && tmp_2_0 !== void 0 ? tmp_2_0 : ɵɵpureFunction0(18, _c2))("fragment", ctx_r0.item.linkProps == null ? null : ctx_r0.item.linkProps.fragment)("ngClass", ɵɵpipeBind1(1, 16, ctx_r0.item))("preserveFragment", (tmp_5_0 = ctx_r0.item.linkProps == null ? null : ctx_r0.item.linkProps.preserveFragment) !== null && tmp_5_0 !== void 0 ? tmp_5_0 : false)("queryParamsHandling", ctx_r0.item.linkProps == null ? null : ctx_r0.item.linkProps.queryParamsHandling)("queryParams", (tmp_7_0 = ctx_r0.item.linkProps == null ? null : ctx_r0.item.linkProps.queryParams) !== null && tmp_7_0 !== void 0 ? tmp_7_0 : null)("replaceUrl", (tmp_8_0 = ctx_r0.item.linkProps == null ? null : ctx_r0.item.linkProps.replaceUrl) !== null && tmp_8_0 !== void 0 ? tmp_8_0 : false)("routerLinkActiveOptions", (tmp_9_0 = ctx_r0.item.linkProps == null ? null : ctx_r0.item.linkProps.routerLinkActiveOptions) !== null && tmp_9_0 !== void 0 ? tmp_9_0 : ɵɵpureFunction0(19, _c10))("routerLink", ctx_r0.item.url)("skipLocationChange", (tmp_11_0 = ctx_r0.item.linkProps == null ? null : ctx_r0.item.linkProps.skipLocationChange) !== null && tmp_11_0 !== void 0 ? tmp_11_0 : false)("state", (tmp_12_0 = ctx_r0.item.linkProps == null ? null : ctx_r0.item.linkProps.state) !== null && tmp_12_0 !== void 0 ? tmp_12_0 : ɵɵpureFunction0(20, _c2))("target", ctx_r0.item.attributes == null ? null : ctx_r0.item.attributes["target"]);
    ɵɵadvance(2);
    ɵɵproperty("ngTemplateOutlet", iconTemplate_r2)("ngTemplateOutletContext", ɵɵpureFunction1(21, _c9, ctx_r0.item));
    ɵɵadvance();
    ɵɵproperty("item", ctx_r0.item);
    ɵɵadvance();
    ɵɵconditional(ctx_r0.item.badge ? 4 : -1);
  }
}
function SidebarNavLinkComponent_ng_template_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 9);
    ɵɵelement(1, "span", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const item_r5 = ɵɵnextContext().$implicit;
    ɵɵadvance();
    ɵɵproperty("ngClass", (tmp_4_0 = item_r5.icon) !== null && tmp_4_0 !== void 0 ? tmp_4_0 : "");
  }
}
function SidebarNavLinkComponent_ng_template_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "svg", 10);
    ɵɵpipe(1, "cSidebarNavIcon");
  }
  if (rf & 2) {
    const item_r5 = ɵɵnextContext().$implicit;
    ɵɵproperty("cIcon", item_r5.iconComponent == null ? null : item_r5.iconComponent.content)("customClasses", ɵɵpipeBind1(1, 3, item_r5))("name", item_r5.iconComponent == null ? null : item_r5.iconComponent.name);
  }
}
function SidebarNavLinkComponent_ng_template_3_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 6);
    ɵɵpipe(1, "cSidebarNavIcon");
  }
  if (rf & 2) {
    const item_r5 = ɵɵnextContext().$implicit;
    ɵɵproperty("ngClass", ɵɵpipeBind1(1, 1, item_r5));
  }
}
function SidebarNavLinkComponent_ng_template_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, SidebarNavLinkComponent_ng_template_3_Conditional_0_Template, 2, 1, "span", 9)(1, SidebarNavLinkComponent_ng_template_3_Conditional_1_Template, 2, 5, ":svg:svg", 10)(2, SidebarNavLinkComponent_ng_template_3_Conditional_2_Template, 2, 3, "span", 6);
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    ɵɵconditional((item_r5 == null ? null : item_r5.icon) ? 0 : -1);
    ɵɵadvance();
    ɵɵconditional((item_r5 == null ? null : item_r5.iconComponent) ? 1 : -1);
    ɵɵadvance();
    ɵɵconditional(!(item_r5 == null ? null : item_r5.icon) && !(item_r5 == null ? null : item_r5.iconComponent) ? 2 : -1);
  }
}
function SidebarNavLabelComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "i", 1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r0.getLabelIconClass());
  }
}
function SidebarNavLabelComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 1);
    ɵɵpipe(1, "cSidebarNavBadge");
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngClass", ɵɵpipeBind1(1, 2, ctx_r0.item));
    ɵɵadvance(2);
    ɵɵtextInterpolate(ctx_r0.item.badge.text);
  }
}
function SidebarNavGroupComponent_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function SidebarNavGroupComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 3);
    ɵɵpipe(1, "cSidebarNavBadge");
    ɵɵtext(2);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("ngClass", ɵɵpipeBind1(1, 2, ctx_r1.item));
    ɵɵadvance(2);
    ɵɵtextInterpolate(ctx_r1.item.badge.text);
  }
}
function SidebarNavGroupComponent_ng_template_6_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span", 5);
    ɵɵelement(1, "span", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    let tmp_4_0;
    const item_r3 = ɵɵnextContext().$implicit;
    ɵɵadvance();
    ɵɵproperty("ngClass", (tmp_4_0 = item_r3.icon) !== null && tmp_4_0 !== void 0 ? tmp_4_0 : "");
  }
}
function SidebarNavGroupComponent_ng_template_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵnamespaceSVG();
    ɵɵelement(0, "svg", 6);
    ɵɵpipe(1, "cSidebarNavIcon");
  }
  if (rf & 2) {
    const item_r3 = ɵɵnextContext().$implicit;
    ɵɵproperty("cIcon", item_r3.iconComponent == null ? null : item_r3.iconComponent.content)("customClasses", ɵɵpipeBind1(1, 3, item_r3))("name", item_r3.iconComponent == null ? null : item_r3.iconComponent.name);
  }
}
function SidebarNavGroupComponent_ng_template_6_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "span", 3);
    ɵɵpipe(1, "cSidebarNavIcon");
  }
  if (rf & 2) {
    const item_r3 = ɵɵnextContext().$implicit;
    ɵɵproperty("ngClass", ɵɵpipeBind1(1, 1, item_r3));
  }
}
function SidebarNavGroupComponent_ng_template_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, SidebarNavGroupComponent_ng_template_6_Conditional_0_Template, 2, 1, "span", 5)(1, SidebarNavGroupComponent_ng_template_6_Conditional_1_Template, 2, 5, ":svg:svg", 6)(2, SidebarNavGroupComponent_ng_template_6_Conditional_2_Template, 2, 3, "span", 3);
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    ɵɵconditional((item_r3 == null ? null : item_r3.icon) ? 0 : -1);
    ɵɵadvance();
    ɵɵconditional((item_r3 == null ? null : item_r3.iconComponent) ? 1 : -1);
    ɵɵadvance();
    ɵɵconditional(!(item_r3 == null ? null : item_r3.icon) && !(item_r3 == null ? null : item_r3.iconComponent) ? 2 : -1);
  }
}
var _c11 = () => ({
  exact: true
});
function SidebarNavComponent_For_1_Case_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "c-sidebar-nav-group", 1, 0);
    ɵɵpipe(2, "cSidebarNavItemClass");
  }
  if (rf & 2) {
    const item_r1 = ɵɵnextContext().$implicit;
    const ctx_r1 = ɵɵnextContext();
    ɵɵproperty("dropdownMode", ctx_r1.dropdownMode)("item", item_r1)("ngClass", ɵɵpipeBind1(2, 5, item_r1))("routerLinkActiveOptions", ɵɵpureFunction0(7, _c11))("compact", ctx_r1.compact);
  }
}
function SidebarNavComponent_For_1_Case_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "c-sidebar-nav-divider", 2);
    ɵɵpipe(1, "cSidebarNavItemClass");
  }
  if (rf & 2) {
    let tmp_11_0;
    const item_r1 = ɵɵnextContext().$implicit;
    ɵɵproperty("cHtmlAttr", (tmp_11_0 = item_r1.attributes) !== null && tmp_11_0 !== void 0 ? tmp_11_0 : ɵɵpureFunction0(5, _c2))("item", item_r1)("ngClass", ɵɵpipeBind1(1, 3, item_r1));
  }
}
function SidebarNavComponent_For_1_Case_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "c-sidebar-nav-title", 2);
    ɵɵpipe(1, "cSidebarNavItemClass");
  }
  if (rf & 2) {
    let tmp_11_0;
    const item_r1 = ɵɵnextContext().$implicit;
    ɵɵproperty("cHtmlAttr", (tmp_11_0 = item_r1.attributes) !== null && tmp_11_0 !== void 0 ? tmp_11_0 : ɵɵpureFunction0(5, _c2))("item", item_r1)("ngClass", ɵɵpipeBind1(1, 3, item_r1));
  }
}
function SidebarNavComponent_For_1_Case_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "c-sidebar-nav-label", 3);
    ɵɵpipe(1, "cSidebarNavItemClass");
  }
  if (rf & 2) {
    const item_r1 = ɵɵnextContext().$implicit;
    ɵɵproperty("item", item_r1)("ngClass", ɵɵpipeBind1(1, 2, item_r1));
  }
}
function SidebarNavComponent_For_1_Case_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function SidebarNavComponent_For_1_Case_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = ɵɵgetCurrentView();
    ɵɵelementStart(0, "c-sidebar-nav-link", 4);
    ɵɵpipe(1, "cSidebarNavItemClass");
    ɵɵlistener("linkClick", function SidebarNavComponent_For_1_Case_5_Template_c_sidebar_nav_link_linkClick_0_listener() {
      ɵɵrestoreView(_r3);
      const ctx_r1 = ɵɵnextContext(2);
      return ɵɵresetView(ctx_r1.hideMobile());
    });
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const item_r1 = ɵɵnextContext().$implicit;
    ɵɵproperty("item", item_r1)("ngClass", ɵɵpipeBind1(1, 2, item_r1));
  }
}
function SidebarNavComponent_For_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, SidebarNavComponent_For_1_Case_0_Template, 3, 8, "c-sidebar-nav-group", 1)(1, SidebarNavComponent_For_1_Case_1_Template, 2, 6, "c-sidebar-nav-divider", 2)(2, SidebarNavComponent_For_1_Case_2_Template, 2, 6, "c-sidebar-nav-title", 2)(3, SidebarNavComponent_For_1_Case_3_Template, 2, 4, "c-sidebar-nav-label", 3)(4, SidebarNavComponent_For_1_Case_4_Template, 1, 0, "ng-container")(5, SidebarNavComponent_For_1_Case_5_Template, 2, 4, "c-sidebar-nav-link", 3);
  }
  if (rf & 2) {
    let tmp_10_0;
    const item_r1 = ctx.$implicit;
    const ctx_r1 = ɵɵnextContext();
    ɵɵconditional((tmp_10_0 = ctx_r1.helper.itemType(item_r1)) === "group" ? 0 : tmp_10_0 === "divider" ? 1 : tmp_10_0 === "title" ? 2 : tmp_10_0 === "label" ? 3 : tmp_10_0 === "empty" ? 4 : 5);
  }
}
var _c12 = () => ({
  outline: 0
});
function ToastHeaderComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "button", 1);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵstyleMap(ɵɵpureFunction0(3, _c12));
    ɵɵproperty("cToastClose", ctx_r0.toast);
  }
}
function ToasterComponent_ng_template_0_Template(rf, ctx) {
}
var _c13 = ["tooltipTemplate"];
var _c14 = [[["", 8, "chart-wrapper"]], "*"];
var _c15 = [".chart-wrapper", "*"];
function WidgetStatAComponent_Conditional_3_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WidgetStatAComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 5);
    ɵɵtemplate(1, WidgetStatAComponent_Conditional_3_ng_container_1_Template, 1, 0, "ng-container", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const defaultWidgetValueTemplate_r2 = ɵɵreference(10);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", (ctx_r0.templates == null ? null : ctx_r0.templates["widgetValueTemplate"]) || defaultWidgetValueTemplate_r2);
  }
}
function WidgetStatAComponent_Conditional_4_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WidgetStatAComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div");
    ɵɵtemplate(1, WidgetStatAComponent_Conditional_4_ng_container_1_Template, 1, 0, "ng-container", 6);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const defaultWidgetTitleTemplate_r3 = ɵɵreference(8);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", (ctx_r0.templates == null ? null : ctx_r0.templates["widgetTitleTemplate"]) || defaultWidgetTitleTemplate_r3);
  }
}
function WidgetStatAComponent_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WidgetStatAComponent_ng_container_6_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WidgetStatAComponent_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtext(0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵtextInterpolate1(" ", ctx_r0.title(), "\n");
  }
}
function WidgetStatAComponent_ng_template_9_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtext(0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵtextInterpolate1(" ", ctx_r0.value(), "\n");
  }
}
function WidgetStatAComponent_ng_template_11_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function WidgetStatAComponent_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0, 1);
  }
}
function WidgetStatBComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 0);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.value());
  }
}
function WidgetStatBComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div");
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.title());
  }
}
function WidgetStatBComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "small", 1);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r0.inverse() ? "text-white text-opacity-75" : "text-body-secondary");
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r0.text(), " ");
  }
}
function WidgetStatCComponent_Conditional_1_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WidgetStatCComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵtemplate(1, WidgetStatCComponent_Conditional_1_ng_container_1_Template, 1, 0, "ng-container", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const defaultWidgetIconTemplate_r2 = ɵɵreference(6);
    ɵɵproperty("ngClass", ctx_r0.iconClasses());
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", (ctx_r0.templates == null ? null : ctx_r0.templates["widgetIconTemplate"]) || defaultWidgetIconTemplate_r2);
  }
}
function WidgetStatCComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r0.valueClasses());
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r0.value(), " ");
  }
}
function WidgetStatCComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r0.titleClasses());
    ɵɵadvance();
    ɵɵtextInterpolate1(" ", ctx_r0.title(), " ");
  }
}
function WidgetStatCComponent_Conditional_4_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WidgetStatCComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, WidgetStatCComponent_Conditional_4_ng_container_0_Template, 1, 0, "ng-container", 3);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const defaultWidgetProgressTemplate_r3 = ɵɵreference(8);
    ɵɵproperty("ngTemplateOutlet", (ctx_r0.templates == null ? null : ctx_r0.templates["widgetProgressTemplate"]) || defaultWidgetProgressTemplate_r3);
  }
}
function WidgetStatCComponent_ng_template_5_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtext(0);
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵtextInterpolate1(" ", ctx_r0.icon(), "\n");
  }
}
function WidgetStatCComponent_ng_template_7_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵprojection(0);
  }
}
function WidgetStatDComponent_For_4_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelement(0, "div", 2);
  }
}
function WidgetStatDComponent_For_4_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵtemplate(0, WidgetStatDComponent_For_4_Conditional_0_Template, 1, 0, "div", 2);
    ɵɵelementStart(1, "c-col")(2, "div", 3);
    ɵɵtext(3);
    ɵɵelementEnd();
    ɵɵelementStart(4, "div", 4);
    ɵɵtext(5);
    ɵɵelementEnd()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const ɵ$index_6_r2 = ctx.$index;
    ɵɵconditional(ɵ$index_6_r2 % 2 !== 0 ? 0 : -1);
    ɵɵadvance(3);
    ɵɵtextInterpolate(item_r1.value);
    ɵɵadvance(2);
    ɵɵtextInterpolate(item_r1.title);
  }
}
function WidgetStatEComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 1);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵproperty("ngClass", ctx_r0.titleClasses());
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.title());
  }
}
function WidgetStatEComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "div", 2);
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.value());
  }
}
function WidgetStatFComponent_ng_container_3_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WidgetStatFComponent_Conditional_9_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementContainer(0);
  }
}
function WidgetStatFComponent_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "c-card-footer");
    ɵɵtemplate(1, WidgetStatFComponent_Conditional_9_ng_container_1_Template, 1, 0, "ng-container", 3);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    const defaultFooterIconTemplate_r2 = ɵɵreference(13);
    ɵɵadvance();
    ɵɵproperty("ngTemplateOutlet", (ctx_r0.templates == null ? null : ctx_r0.templates["widgetFooterTemplate"]) || defaultFooterIconTemplate_r2);
  }
}
function WidgetStatFComponent_ng_template_10_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span");
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.icon());
  }
}
function WidgetStatFComponent_ng_template_12_Template(rf, ctx) {
  if (rf & 1) {
    ɵɵelementStart(0, "span");
    ɵɵtext(1);
    ɵɵelementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = ɵɵnextContext();
    ɵɵadvance();
    ɵɵtextInterpolate(ctx_r0.footer());
  }
}
var BreakpointInfix;
(function(BreakpointInfix2) {
  BreakpointInfix2["xs"] = "xs";
  BreakpointInfix2["sm"] = "sm";
  BreakpointInfix2["md"] = "md";
  BreakpointInfix2["lg"] = "lg";
  BreakpointInfix2["xl"] = "xl";
  BreakpointInfix2["xxl"] = "xxl";
})(BreakpointInfix || (BreakpointInfix = {}));
var _ElementRefDirective = class _ElementRefDirective {
  constructor() {
    this.elementRef = inject(ElementRef);
  }
};
_ElementRefDirective.ɵfac = function ElementRefDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ElementRefDirective)();
};
_ElementRefDirective.ɵdir = ɵɵdefineDirective({
  type: _ElementRefDirective,
  selectors: [["", "cElementRef", ""]],
  exportAs: ["cElementRef"],
  standalone: true
});
var ElementRefDirective = _ElementRefDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ElementRefDirective, [{
    type: Directive,
    args: [{
      selector: "[cElementRef]",
      exportAs: "cElementRef",
      standalone: true
    }]
  }], null, null);
})();
var _HtmlAttributesDirective = class _HtmlAttributesDirective {
  constructor(renderer, el) {
    this.renderer = renderer;
    this.el = el;
  }
  ngOnInit() {
    const attribs = this.cHtmlAttr;
    for (const attr in attribs) {
      if (attr === "style" && typeof attribs[attr] === "object") {
        this.setStyle(attribs[attr]);
      } else if (attr === "class") {
        this.addClass(attribs[attr]);
      } else {
        this.setAttrib(attr, attribs[attr]);
      }
    }
  }
  setStyle(styles) {
    for (const style2 in styles) {
      if (style2) {
        this.renderer.setStyle(this.el.nativeElement, style2, styles[style2]);
      }
    }
  }
  addClass(classes) {
    const classArray = Array.isArray(classes) ? classes : classes.split(" ");
    classArray.filter((element) => element.length > 0).forEach((element) => {
      this.renderer.addClass(this.el.nativeElement, element);
    });
  }
  setAttrib(key, value) {
    value !== null ? this.renderer.setAttribute(this.el.nativeElement, key, value) : this.renderer.removeAttribute(this.el.nativeElement, key);
  }
};
_HtmlAttributesDirective.ɵfac = function HtmlAttributesDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HtmlAttributesDirective)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef));
};
_HtmlAttributesDirective.ɵdir = ɵɵdefineDirective({
  type: _HtmlAttributesDirective,
  selectors: [["", "cHtmlAttr", ""]],
  inputs: {
    cHtmlAttr: "cHtmlAttr"
  },
  exportAs: ["cHtmlAttr"],
  standalone: true
});
var HtmlAttributesDirective = _HtmlAttributesDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HtmlAttributesDirective, [{
    type: Directive,
    args: [{
      selector: "[cHtmlAttr]",
      exportAs: "cHtmlAttr",
      standalone: true
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }], {
    cHtmlAttr: [{
      type: Input
    }]
  });
})();
var _TemplateIdDirective = class _TemplateIdDirective {
  constructor() {
    this.templateRef = inject(TemplateRef);
  }
};
_TemplateIdDirective.ɵfac = function TemplateIdDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TemplateIdDirective)();
};
_TemplateIdDirective.ɵdir = ɵɵdefineDirective({
  type: _TemplateIdDirective,
  selectors: [["", "cTemplateId", ""]],
  inputs: {
    id: [0, "cTemplateId", "id"]
  },
  standalone: true
});
var TemplateIdDirective = _TemplateIdDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TemplateIdDirective, [{
    type: Directive,
    args: [{
      selector: "[cTemplateId]",
      standalone: true
    }]
  }], null, {
    id: [{
      type: Input,
      args: ["cTemplateId"]
    }]
  });
})();
var _hostElement, _renderer;
var _ThemeDirective = class _ThemeDirective {
  constructor() {
    __privateAdd(this, _hostElement, inject(ElementRef));
    __privateAdd(this, _renderer, inject(Renderer2));
  }
  /**
   * Add dark theme attribute.
   * @type 'dark' | 'light' | undefined
   */
  set colorScheme(scheme) {
    !!scheme ? this.setTheme(scheme) : this.unsetTheme();
  }
  /**
   * Add dark theme attribute.
   * @type boolean
   */
  set dark(darkTheme) {
    darkTheme ? this.setTheme("dark") : this.unsetTheme();
  }
  setTheme(theme) {
    if (theme) {
      __privateGet(this, _renderer).setAttribute(__privateGet(this, _hostElement).nativeElement, "data-coreui-theme", theme);
    }
  }
  unsetTheme() {
    __privateGet(this, _renderer).removeAttribute(__privateGet(this, _hostElement).nativeElement, "data-coreui-theme");
  }
};
_hostElement = new WeakMap();
_renderer = new WeakMap();
_ThemeDirective.ɵfac = function ThemeDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ThemeDirective)();
};
_ThemeDirective.ɵdir = ɵɵdefineDirective({
  type: _ThemeDirective,
  selectors: [["", "cTheme", ""]],
  inputs: {
    colorScheme: "colorScheme",
    dark: [2, "dark", "dark", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var ThemeDirective = _ThemeDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ThemeDirective, [{
    type: Directive,
    args: [{
      selector: "[cTheme]",
      standalone: true
    }]
  }], null, {
    colorScheme: [{
      type: Input
    }],
    dark: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var _SharedModule = class _SharedModule {
  static forRoot() {
    return {
      ngModule: _SharedModule
    };
  }
};
_SharedModule.ɵfac = function SharedModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SharedModule)();
};
_SharedModule.ɵmod = ɵɵdefineNgModule({
  type: _SharedModule,
  imports: [ElementRefDirective, HtmlAttributesDirective, TemplateIdDirective, ThemeDirective],
  exports: [ElementRefDirective, HtmlAttributesDirective, TemplateIdDirective, ThemeDirective]
});
_SharedModule.ɵinj = ɵɵdefineInjector({});
var SharedModule = _SharedModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SharedModule, [{
    type: NgModule,
    args: [{
      imports: [ElementRefDirective, HtmlAttributesDirective, TemplateIdDirective, ThemeDirective],
      exports: [ElementRefDirective, HtmlAttributesDirective, TemplateIdDirective, ThemeDirective]
    }]
  }], null, null);
})();
var _AccordionButtonDirective = class _AccordionButtonDirective {
  constructor() {
    this.type = "button";
  }
  get hostClasses() {
    return {
      "accordion-button": true,
      collapsed: this.collapsed
    };
  }
  get ariaExpanded() {
    return !this.collapsed;
  }
};
_AccordionButtonDirective.ɵfac = function AccordionButtonDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AccordionButtonDirective)();
};
_AccordionButtonDirective.ɵdir = ɵɵdefineDirective({
  type: _AccordionButtonDirective,
  selectors: [["", "cAccordionButton", ""]],
  hostAttrs: [1, "accordion-button"],
  hostVars: 4,
  hostBindings: function AccordionButtonDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("type", ctx.type)("aria-expanded", ctx.ariaExpanded);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    collapsed: "collapsed",
    type: "type"
  },
  standalone: true
});
var AccordionButtonDirective = _AccordionButtonDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccordionButtonDirective, [{
    type: Directive,
    args: [{
      selector: "[cAccordionButton]",
      standalone: true,
      host: {
        class: "accordion-button"
      }
    }]
  }], null, {
    collapsed: [{
      type: Input
    }],
    type: [{
      type: HostBinding,
      args: ["attr.type"]
    }, {
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    ariaExpanded: [{
      type: HostBinding,
      args: ["attr.aria-expanded"]
    }]
  });
})();
var _AccordionService = class _AccordionService {
  constructor() {
    this.items = [];
    this.alwaysOpen = false;
  }
  addItem(item) {
    this.items.push(item);
  }
  removeItem(item) {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
    }
  }
  toggleItem(item) {
    item.visible = !item.visible;
    this.closeOtherItems(item);
  }
  closeOtherItems(openItem) {
    if (!this.alwaysOpen) {
      this.items.forEach((item) => {
        if (item !== openItem) {
          item.visible = false;
        }
      });
    }
  }
};
_AccordionService.ɵfac = function AccordionService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AccordionService)();
};
_AccordionService.ɵprov = ɵɵdefineInjectable({
  token: _AccordionService,
  factory: _AccordionService.ɵfac
});
var AccordionService = _AccordionService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccordionService, [{
    type: Injectable
  }], null, null);
})();
var _accordionService;
var _AccordionComponent = class _AccordionComponent {
  constructor() {
    __privateAdd(this, _accordionService);
    __privateSet(this, _accordionService, inject(AccordionService));
    this.flush = false;
  }
  /**
   * Make accordion items stay open when another item is opened
   * @type boolean
   */
  set alwaysOpen(value) {
    __privateGet(this, _accordionService).alwaysOpen = value;
  }
  get alwaysOpen() {
    return __privateGet(this, _accordionService).alwaysOpen;
  }
  get hostClasses() {
    return {
      accordion: true,
      "accordion-flush": this.flush
    };
  }
};
_accordionService = new WeakMap();
_AccordionComponent.ɵfac = function AccordionComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AccordionComponent)();
};
_AccordionComponent.ɵcmp = ɵɵdefineComponent({
  type: _AccordionComponent,
  selectors: [["c-accordion"]],
  hostAttrs: [1, "accordion"],
  hostVars: 2,
  hostBindings: function AccordionComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    flush: [2, "flush", "flush", booleanAttribute],
    alwaysOpen: [2, "alwaysOpen", "alwaysOpen", booleanAttribute]
  },
  exportAs: ["cAccordionItem"],
  standalone: true,
  features: [ɵɵProvidersFeature([AccordionService]), ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function AccordionComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var AccordionComponent = _AccordionComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccordionComponent, [{
    type: Component,
    args: [{
      selector: "c-accordion",
      template: "<ng-content />",
      exportAs: "cAccordionItem",
      providers: [AccordionService],
      standalone: true,
      host: {
        class: "accordion"
      },
      styles: [":host{display:block}\n"]
    }]
  }], null, {
    flush: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    alwaysOpen: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var expandAnimation = animation([animate("{{ time }} {{ easing }}")]);
var collapseAnimation = animation([style({
  height: "*",
  minHeight: "*"
}), animate("{{ time }} {{ easing }}", style({
  height: 0,
  minHeight: 0
}))]);
var expandHorizontalAnimation = animation([animate("{{ time }} {{ easing }}")]);
var collapseHorizontalAnimation = animation([
  // style({ opacity: '*' }),
  animate(
    "{{ time }} {{ easing }}"
    // style({ opacity: 0 })
  )
]);
var _CollapseDirective = class _CollapseDirective {
  /**
   * Toggle the visibility of collapsible element.
   * @type boolean
   * @default false
   * todo: 'visible' input signal
   */
  set visible(value) {
    this._visible = value;
  }
  get visible() {
    return this._visible;
  }
  constructor(hostElement, renderer, animationBuilder) {
    this.hostElement = hostElement;
    this.renderer = renderer;
    this.animationBuilder = animationBuilder;
    this.animate = true;
    this.horizontal = input(false, {
      transform: booleanAttribute
    });
    this._visible = false;
    this.navbar = input(false, {
      transform: booleanAttribute
    });
    this.duration = input("350ms");
    this.transition = input("ease");
    this.collapseChange = output();
    this.collapsing = false;
    this.hostClasses = computed(() => {
      return {
        "navbar-collapse": this.navbar(),
        "collapse-horizontal": this.horizontal()
      };
    });
    this.host = this.hostElement.nativeElement;
    this.renderer.setStyle(this.host, "display", "none");
  }
  ngAfterViewInit() {
    if (this.visible) {
      this.toggle();
    }
  }
  ngOnDestroy() {
    this.destroyPlayer();
  }
  ngOnChanges(changes) {
    if (changes["visible"]) {
      if (!changes["visible"].firstChange || !changes["visible"].currentValue) {
        this.toggle(changes["visible"].currentValue);
      }
    }
  }
  ngDoCheck() {
    if (this._visible !== this.visible) {
      this.toggle();
    }
  }
  toggle(visible = this.visible) {
    this.createPlayer(visible);
    this.player?.play();
  }
  destroyPlayer() {
    this.player?.destroy();
  }
  createPlayer(visible = this.visible) {
    if (this.player?.hasStarted()) {
      this.destroyPlayer();
    }
    if (visible) {
      this.renderer.removeStyle(this.host, "display");
    }
    const duration = this.animate ? this.duration() : "0ms";
    const expand = this.horizontal() ? expandHorizontalAnimation : expandAnimation;
    const collapse = this.horizontal() ? collapseHorizontalAnimation : collapseAnimation;
    const dimension = this.horizontal() ? "width" : "height";
    const capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
    const scrollSize = `scroll${capitalizedDimension}`;
    const animationFactory = this.animationBuilder?.build(useAnimation(visible ? expand : collapse, {
      params: {
        time: duration,
        easing: this.transition()
      }
    }));
    this.player = animationFactory.create(this.host);
    this.renderer.setStyle(this.host, dimension, visible ? 0 : `${this.host.getBoundingClientRect()[dimension]}px`);
    !visible && this.host.offsetHeight;
    this.player.onStart(() => {
      this.setMaxSize();
      this.renderer.removeClass(this.host, "collapse");
      this.renderer.addClass(this.host, "collapsing");
      this.renderer.removeClass(this.host, "show");
      this.collapsing = true;
      if (visible) {
        this.renderer.setStyle(this.host, dimension, `${this.hostElement.nativeElement[scrollSize]}px`);
      } else {
        this.renderer.setStyle(this.host, dimension, "");
      }
      this.collapseChange.emit(visible ? "opening" : "collapsing");
    });
    this.player.onDone(() => {
      this.visible = visible;
      this.collapsing = false;
      this.renderer.removeClass(this.host, "collapsing");
      this.renderer.addClass(this.host, "collapse");
      if (visible) {
        this.renderer.addClass(this.host, "show");
        this.renderer.setStyle(this.host, dimension, "");
      } else {
        this.renderer.removeClass(this.host, "show");
      }
      this.collapseChange.emit(visible ? "open" : "collapsed");
    });
  }
  setMaxSize() {
    if (this.horizontal()) {
      this.scrollWidth = this.host.scrollWidth;
      this.scrollWidth > 0 && this.renderer.setStyle(this.host, "maxWidth", `${this.scrollWidth}px`);
    }
  }
};
_CollapseDirective.ɵfac = function CollapseDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CollapseDirective)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(AnimationBuilder));
};
_CollapseDirective.ɵdir = ɵɵdefineDirective({
  type: _CollapseDirective,
  selectors: [["", "cCollapse", ""]],
  hostVars: 2,
  hostBindings: function CollapseDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    animate: [2, "animate", "animate", booleanAttribute],
    horizontal: [1, "horizontal"],
    visible: [2, "visible", "visible", booleanAttribute],
    navbar: [1, "navbar"],
    duration: [1, "duration"],
    transition: [1, "transition"]
  },
  outputs: {
    collapseChange: "collapseChange"
  },
  exportAs: ["cCollapse"],
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵNgOnChangesFeature]
});
var CollapseDirective = _CollapseDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CollapseDirective, [{
    type: Directive,
    args: [{
      selector: "[cCollapse]",
      exportAs: "cCollapse",
      standalone: true,
      host: {
        "[class]": "hostClasses()"
      }
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: AnimationBuilder
  }], {
    animate: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    visible: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var _CollapseModule = class _CollapseModule {
  static forRoot() {
    return {
      ngModule: _CollapseModule,
      providers: []
    };
  }
};
_CollapseModule.ɵfac = function CollapseModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CollapseModule)();
};
_CollapseModule.ɵmod = ɵɵdefineNgModule({
  type: _CollapseModule,
  imports: [CollapseDirective],
  exports: [CollapseDirective]
});
_CollapseModule.ɵinj = ɵɵdefineInjector({});
var CollapseModule = _CollapseModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CollapseModule, [{
    type: NgModule,
    args: [{
      exports: [CollapseDirective],
      imports: [CollapseDirective]
    }]
  }], null, null);
})();
var nextId$2 = 0;
var _AccordionItemComponent = class _AccordionItemComponent {
  constructor(accordionService) {
    this.accordionService = accordionService;
    this.visible = false;
    this.contentId = `accordion-item-${nextId$2++}`;
    this.itemContext = {
      $implicit: this.visible
    };
    this.templates = {};
  }
  set open(value) {
    console.warn('c-accordion-item "open" prop is deprecated, use "visible"  prop instead.');
    this.visible = value || this.visible;
  }
  get open() {
    return this.visible;
  }
  ngOnInit() {
    this.accordionService.addItem(this);
  }
  ngOnDestroy() {
    this.accordionService.removeItem(this);
  }
  toggleItem() {
    this.accordionService.toggleItem(this);
  }
  ngAfterContentInit() {
    this.contentTemplates.forEach((child) => {
      this.templates[child.id] = child.templateRef;
    });
  }
};
_AccordionItemComponent.ɵfac = function AccordionItemComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AccordionItemComponent)(ɵɵdirectiveInject(AccordionService));
};
_AccordionItemComponent.ɵcmp = ɵɵdefineComponent({
  type: _AccordionItemComponent,
  selectors: [["c-accordion-item"]],
  contentQueries: function AccordionItemComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, TemplateIdDirective, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.contentTemplates = _t);
    }
  },
  hostAttrs: [1, "accordion-item"],
  inputs: {
    visible: [2, "visible", "visible", booleanAttribute],
    open: "open"
  },
  exportAs: ["cAccordionItem"],
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c1,
  decls: 13,
  vars: 7,
  consts: [["defaultAccordionHeaderTemplate", ""], ["defaultAccordionHeaderContentTemplate", ""], ["defaultAccordionBodyTemplate", ""], ["defaultAccordionBodyContentTemplate", ""], [1, "accordion-header"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["cCollapse", "", 1, "accordion-collapse", 3, "visible", "id"], ["cAccordionButton", "", 3, "click", "collapsed"], [1, "accordion-body"]],
  template: function AccordionItemComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef(_c1);
      ɵɵelementContainerStart(0);
      ɵɵelementStart(1, "div", 4);
      ɵɵtemplate(2, AccordionItemComponent_ng_container_2_Template, 1, 0, "ng-container", 5);
      ɵɵelementEnd();
      ɵɵelementStart(3, "div", 6);
      ɵɵtemplate(4, AccordionItemComponent_ng_container_4_Template, 1, 0, "ng-container", 5);
      ɵɵelementEnd();
      ɵɵelementContainerEnd();
      ɵɵtemplate(5, AccordionItemComponent_ng_template_5_Template, 2, 4, "ng-template", null, 0, ɵɵtemplateRefExtractor)(7, AccordionItemComponent_ng_template_7_Template, 1, 0, "ng-template", null, 1, ɵɵtemplateRefExtractor)(9, AccordionItemComponent_ng_template_9_Template, 2, 2, "ng-template", null, 2, ɵɵtemplateRefExtractor)(11, AccordionItemComponent_ng_template_11_Template, 1, 0, "ng-template", null, 3, ɵɵtemplateRefExtractor);
    }
    if (rf & 2) {
      const defaultAccordionHeaderTemplate_r5 = ɵɵreference(6);
      const defaultAccordionBodyTemplate_r6 = ɵɵreference(10);
      ɵɵadvance(2);
      ɵɵproperty("ngTemplateOutlet", ctx.templates["accordionHeaderTemplate"] || defaultAccordionHeaderTemplate_r5)("ngTemplateOutletContext", ctx.itemContext);
      ɵɵadvance();
      ɵɵproperty("visible", ctx.visible)("id", ctx.contentId);
      ɵɵattribute("aria-expanded", ctx.visible);
      ɵɵadvance();
      ɵɵproperty("ngTemplateOutlet", ctx.templates["accordionBodyTemplate"] || defaultAccordionBodyTemplate_r6)("ngTemplateOutletContext", ctx.itemContext);
    }
  },
  dependencies: [AccordionButtonDirective, NgTemplateOutlet, CollapseDirective],
  styles: ["[_nghost-%COMP%]{display:block;overflow:hidden}"]
});
var AccordionItemComponent = _AccordionItemComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccordionItemComponent, [{
    type: Component,
    args: [{
      selector: "c-accordion-item",
      exportAs: "cAccordionItem",
      standalone: true,
      imports: [AccordionButtonDirective, NgTemplateOutlet, CollapseDirective],
      host: {
        class: "accordion-item"
      },
      template: `<ng-container>
  <div class="accordion-header">
    <ng-container *ngTemplateOutlet="templates['accordionHeaderTemplate'] || defaultAccordionHeaderTemplate; context: itemContext" />
  </div>
  <div class="accordion-collapse" cCollapse [visible]="visible" [attr.aria-expanded]="visible" [id]="contentId">
    <ng-container *ngTemplateOutlet="templates['accordionBodyTemplate'] || defaultAccordionBodyTemplate; context: itemContext" />
  </div>
</ng-container>

<ng-template #defaultAccordionHeaderTemplate>
  <button cAccordionButton [collapsed]="!visible" [attr.aria-controls]="contentId" (click)="toggleItem()">
    <ng-container
      *ngTemplateOutlet="templates['accordionHeader'] || defaultAccordionHeaderContentTemplate; context: itemContext">
    </ng-container>
  </button>
</ng-template>

<ng-template #defaultAccordionHeaderContentTemplate>
  <ng-content />
</ng-template>

<ng-template #defaultAccordionBodyTemplate>
  <div class="accordion-body">
    <ng-container
      *ngTemplateOutlet="templates['accordionBody'] || defaultAccordionBodyContentTemplate; context: itemContext">
    </ng-container>
  </div>
</ng-template>

<ng-template #defaultAccordionBodyContentTemplate>
  <ng-content />
</ng-template>
`,
      styles: [":host{display:block;overflow:hidden}\n"]
    }]
  }], () => [{
    type: AccordionService
  }], {
    visible: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    open: [{
      type: Input
    }],
    contentTemplates: [{
      type: ContentChildren,
      args: [TemplateIdDirective, {
        descendants: true
      }]
    }]
  });
})();
var _AccordionModule = class _AccordionModule {
};
_AccordionModule.ɵfac = function AccordionModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AccordionModule)();
};
_AccordionModule.ɵmod = ɵɵdefineNgModule({
  type: _AccordionModule,
  imports: [AccordionButtonDirective, AccordionComponent, AccordionItemComponent],
  exports: [AccordionComponent, AccordionButtonDirective, AccordionItemComponent]
});
_AccordionModule.ɵinj = ɵɵdefineInjector({
  providers: [AccordionService]
});
var AccordionModule = _AccordionModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AccordionModule, [{
    type: NgModule,
    args: [{
      imports: [AccordionButtonDirective, AccordionComponent, AccordionItemComponent],
      exports: [AccordionComponent, AccordionButtonDirective, AccordionItemComponent],
      providers: [AccordionService]
    }]
  }], null, null);
})();
var _AlertHeadingDirective = class _AlertHeadingDirective {
};
_AlertHeadingDirective.ɵfac = function AlertHeadingDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AlertHeadingDirective)();
};
_AlertHeadingDirective.ɵdir = ɵɵdefineDirective({
  type: _AlertHeadingDirective,
  selectors: [["", "cAlertHeading", ""]],
  hostAttrs: [1, "alert-heading"],
  standalone: true
});
var AlertHeadingDirective = _AlertHeadingDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AlertHeadingDirective, [{
    type: Directive,
    args: [{
      selector: "[cAlertHeading]",
      standalone: true,
      host: {
        class: "alert-heading"
      }
    }]
  }], null, null);
})();
var _AlertLinkDirective = class _AlertLinkDirective {
};
_AlertLinkDirective.ɵfac = function AlertLinkDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AlertLinkDirective)();
};
_AlertLinkDirective.ɵdir = ɵɵdefineDirective({
  type: _AlertLinkDirective,
  selectors: [["", "cAlertLink", ""]],
  hostAttrs: [1, "alert-link"],
  standalone: true
});
var AlertLinkDirective = _AlertLinkDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AlertLinkDirective, [{
    type: Directive,
    args: [{
      selector: "[cAlertLink]",
      standalone: true,
      host: {
        class: "alert-link"
      }
    }]
  }], null, null);
})();
var _ButtonDirective = class _ButtonDirective {
  constructor() {
    this.active = input(false, {
      transform: booleanAttribute
    });
    this.color = input("primary");
    this.disabled = input(false, {
      transform: booleanAttribute
    });
    this.shape = input();
    this.size = input("");
    this.type = input("button");
    this.variant = input();
    this.hostClasses = computed(() => {
      return {
        btn: true,
        [`btn-${this.color()}`]: !!this.color() && !this.variant(),
        [`btn-${this.variant()}`]: !!this.variant() && !this.color(),
        [`btn-${this.variant()}-${this.color()}`]: !!this.variant() && !!this.color(),
        [`btn-${this.size()}`]: !!this.size(),
        [`${this.shape()}`]: !!this.shape(),
        active: this.active(),
        disabled: this._disabled()
      };
    });
    this._disabled = computed(() => this.disabled());
    this.ariaDisabled = computed(() => {
      return this._disabled() ? true : null;
    });
    this.attrDisabled = computed(() => {
      return this._disabled() ? "" : null;
    });
    this.tabIndex = computed(() => {
      return this._disabled() ? "-1" : null;
    });
    this.isActive = computed(() => {
      return this.active() || null;
    });
  }
};
_ButtonDirective.ɵfac = function ButtonDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ButtonDirective)();
};
_ButtonDirective.ɵdir = ɵɵdefineDirective({
  type: _ButtonDirective,
  selectors: [["", "cButton", ""]],
  hostAttrs: [1, "btn"],
  hostVars: 7,
  hostBindings: function ButtonDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-disabled", ctx.ariaDisabled())("aria-pressed", ctx.isActive())("disabled", ctx.attrDisabled())("tabindex", ctx.tabIndex())("type", ctx.type());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    active: [1, "active"],
    color: [1, "color"],
    disabled: [1, "disabled"],
    shape: [1, "shape"],
    size: [1, "size"],
    type: [1, "type"],
    variant: [1, "variant"]
  },
  exportAs: ["cButton"],
  standalone: true
});
var ButtonDirective = _ButtonDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonDirective, [{
    type: Directive,
    args: [{
      selector: "[cButton]",
      exportAs: "cButton",
      standalone: true,
      host: {
        class: "btn",
        "[class]": "hostClasses()",
        "[attr.aria-disabled]": "ariaDisabled()",
        "[attr.aria-pressed]": "isActive()",
        "[attr.disabled]": "attrDisabled()",
        "[attr.tabindex]": "tabIndex()",
        "[attr.type]": "type()"
      }
    }]
  }], null, null);
})();
var _ButtonCloseDirective = class _ButtonCloseDirective extends ButtonDirective {
  constructor() {
    super(...arguments);
    this.white = input(false, {
      transform: booleanAttribute
    });
    this.hostClasses = computed(() => {
      return {
        btn: true,
        "btn-close": true,
        "btn-close-white": this.white(),
        [`btn-${this.size()}`]: !!this.size(),
        active: this.active(),
        disabled: this._disabled()
      };
    });
  }
};
_ButtonCloseDirective.ɵfac = /* @__PURE__ */ (() => {
  let ɵButtonCloseDirective_BaseFactory;
  return function ButtonCloseDirective_Factory(__ngFactoryType__) {
    return (ɵButtonCloseDirective_BaseFactory || (ɵButtonCloseDirective_BaseFactory = ɵɵgetInheritedFactory(_ButtonCloseDirective)))(__ngFactoryType__ || _ButtonCloseDirective);
  };
})();
_ButtonCloseDirective.ɵdir = ɵɵdefineDirective({
  type: _ButtonCloseDirective,
  selectors: [["", "cButtonClose", ""]],
  hostAttrs: [1, "btn", "btn-close"],
  hostVars: 7,
  hostBindings: function ButtonCloseDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-disabled", ctx.ariaDisabled())("aria-pressed", ctx.isActive())("disabled", ctx.attrDisabled())("tabindex", ctx.tabIndex())("type", ctx.type());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    white: [1, "white"]
  },
  standalone: true,
  features: [ɵɵHostDirectivesFeature([{
    directive: ThemeDirective,
    inputs: ["dark", "dark"]
  }]), ɵɵInheritDefinitionFeature]
});
var ButtonCloseDirective = _ButtonCloseDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonCloseDirective, [{
    type: Directive,
    args: [{
      selector: "[cButtonClose]",
      standalone: true,
      hostDirectives: [{
        directive: ThemeDirective,
        inputs: ["dark"]
      }],
      host: {
        class: "btn btn-close",
        "[class]": "hostClasses()",
        "[attr.aria-disabled]": "ariaDisabled()",
        "[attr.aria-pressed]": "isActive()",
        "[attr.disabled]": "attrDisabled()",
        "[attr.tabindex]": "tabIndex()",
        "[attr.type]": "type()"
      }
    }]
  }], null, null);
})();
var _ButtonModule = class _ButtonModule {
};
_ButtonModule.ɵfac = function ButtonModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ButtonModule)();
};
_ButtonModule.ɵmod = ɵɵdefineNgModule({
  type: _ButtonModule,
  imports: [ButtonDirective, ButtonCloseDirective],
  exports: [ButtonDirective, ButtonCloseDirective]
});
_ButtonModule.ɵinj = ɵɵdefineInjector({});
var ButtonModule = _ButtonModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonModule, [{
    type: NgModule,
    args: [{
      imports: [ButtonDirective, ButtonCloseDirective],
      exports: [ButtonDirective, ButtonCloseDirective]
    }]
  }], null, null);
})();
var _visible;
var _AlertComponent = class _AlertComponent {
  constructor() {
    __privateAdd(this, _visible);
    this.color = "primary";
    this.role = "alert";
    this.visibleChange = new EventEmitter();
    this.templates = {};
    this.dismissible = false;
    this.fade = false;
    __privateSet(this, _visible, true);
  }
  /**
   * Toggle the visibility of alert component.
   * @type boolean
   */
  set visible(value) {
    if (__privateGet(this, _visible) !== value) {
      __privateSet(this, _visible, value);
      this.visibleChange.emit(value);
    }
  }
  get visible() {
    return __privateGet(this, _visible);
  }
  get animationDisabled() {
    return !this.fade;
  }
  get animateType() {
    return this.visible ? "show" : "hide";
  }
  get hostClasses() {
    return {
      alert: true,
      "alert-dismissible": this.dismissible,
      fade: this.fade,
      show: !this.hide,
      [`alert-${this.color}`]: !!this.color && this.variant !== "solid",
      [`bg-${this.color}`]: !!this.color && this.variant === "solid",
      "text-white": !!this.color && this.variant === "solid"
    };
  }
  onAnimationStart($event) {
    this.onAnimationEvent($event);
  }
  onAnimationDone($event) {
    this.onAnimationEvent($event);
  }
  ngAfterContentInit() {
    this.contentTemplates.forEach((child) => {
      this.templates[child.id] = child.templateRef;
    });
  }
  onAnimationEvent(event) {
    this.hide = event.phaseName === "start" && event.toState === "show";
    if (event.phaseName === "done") {
      this.hide = event.toState === "hide" || event.toState === "void";
      if (event.toState === "show") {
        this.hide = false;
      }
    }
  }
};
_visible = new WeakMap();
_AlertComponent.ɵfac = function AlertComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AlertComponent)();
};
_AlertComponent.ɵcmp = ɵɵdefineComponent({
  type: _AlertComponent,
  selectors: [["c-alert"]],
  contentQueries: function AlertComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, TemplateIdDirective, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.contentTemplates = _t);
    }
  },
  hostVars: 5,
  hostBindings: function AlertComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵsyntheticHostListener("@fadeInOut.start", function AlertComponent_animation_fadeInOut_start_HostBindingHandler($event) {
        return ctx.onAnimationStart($event);
      })("@fadeInOut.done", function AlertComponent_animation_fadeInOut_done_HostBindingHandler($event) {
        return ctx.onAnimationDone($event);
      });
    }
    if (rf & 2) {
      ɵɵsyntheticHostProperty("@.disabled", ctx.animationDisabled)("@fadeInOut", ctx.animateType);
      ɵɵattribute("role", ctx.role);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    color: "color",
    role: "role",
    variant: "variant",
    dismissible: [2, "dismissible", "dismissible", booleanAttribute],
    fade: [2, "fade", "fade", booleanAttribute],
    visible: [2, "visible", "visible", booleanAttribute]
  },
  outputs: {
    visibleChange: "visibleChange"
  },
  exportAs: ["cAlert"],
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 3,
  vars: 1,
  consts: [["defaultAlertButtonCloseTemplate", ""], [4, "ngTemplateOutlet"], ["aria-label", "Close", "cButtonClose", "", 3, "click"]],
  template: function AlertComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵtemplate(0, AlertComponent_Conditional_0_Template, 2, 1)(1, AlertComponent_ng_template_1_Template, 1, 0, "ng-template", null, 0, ɵɵtemplateRefExtractor);
    }
    if (rf & 2) {
      ɵɵconditional(ctx.visible || !ctx.hide ? 0 : -1);
    }
  },
  dependencies: [NgTemplateOutlet, ButtonCloseDirective],
  styles: ["[_nghost-%COMP%]{display:block;overflow:hidden}"],
  data: {
    animation: [trigger("fadeInOut", [state("show", style({
      opacity: 1,
      height: "*",
      padding: "*",
      border: "*",
      margin: "*"
    })), state("hide", style({
      opacity: 0,
      height: 0,
      padding: 0,
      border: 0,
      margin: 0
    })), state("void", style({
      opacity: 0,
      height: 0,
      padding: 0,
      border: 0,
      margin: 0
    })), transition("show => hide", [animate(".3s ease-out")]), transition("hide => show", [animate(".3s ease-in")]), transition("show => void", [animate(".3s ease-out")]), transition("void => show", [animate(".3s ease-in")])])]
  }
});
var AlertComponent = _AlertComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AlertComponent, [{
    type: Component,
    args: [{
      selector: "c-alert",
      exportAs: "cAlert",
      standalone: true,
      imports: [NgTemplateOutlet, ButtonCloseDirective],
      animations: [trigger("fadeInOut", [state("show", style({
        opacity: 1,
        height: "*",
        padding: "*",
        border: "*",
        margin: "*"
      })), state("hide", style({
        opacity: 0,
        height: 0,
        padding: 0,
        border: 0,
        margin: 0
      })), state("void", style({
        opacity: 0,
        height: 0,
        padding: 0,
        border: 0,
        margin: 0
      })), transition("show => hide", [animate(".3s ease-out")]), transition("hide => show", [animate(".3s ease-in")]), transition("show => void", [animate(".3s ease-out")]), transition("void => show", [animate(".3s ease-in")])])],
      template: '@if (visible || !hide) {\n  @if (dismissible) {\n    <ng-container *ngTemplateOutlet="templates?.alertButtonCloseTemplate || defaultAlertButtonCloseTemplate" />\n  }\n  <ng-content />\n}\n<ng-template #defaultAlertButtonCloseTemplate>\n  <button (click)="visible=false" aria-label="Close" cButtonClose></button>\n</ng-template>\n',
      styles: [":host{display:block;overflow:hidden}\n"]
    }]
  }], null, {
    color: [{
      type: Input
    }],
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }, {
      type: Input
    }],
    variant: [{
      type: Input
    }],
    visibleChange: [{
      type: Output
    }],
    contentTemplates: [{
      type: ContentChildren,
      args: [TemplateIdDirective, {
        descendants: true
      }]
    }],
    dismissible: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    fade: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    visible: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    animationDisabled: [{
      type: HostBinding,
      args: ["@.disabled"]
    }],
    animateType: [{
      type: HostBinding,
      args: ["@fadeInOut"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    onAnimationStart: [{
      type: HostListener,
      args: ["@fadeInOut.start", ["$event"]]
    }],
    onAnimationDone: [{
      type: HostListener,
      args: ["@fadeInOut.done", ["$event"]]
    }]
  });
})();
var _AlertModule = class _AlertModule {
};
_AlertModule.ɵfac = function AlertModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AlertModule)();
};
_AlertModule.ɵmod = ɵɵdefineNgModule({
  type: _AlertModule,
  imports: [AlertComponent, AlertHeadingDirective, AlertLinkDirective],
  exports: [AlertComponent, AlertHeadingDirective, AlertLinkDirective]
});
_AlertModule.ɵinj = ɵɵdefineInjector({});
var AlertModule = _AlertModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AlertModule, [{
    type: NgModule,
    args: [{
      imports: [AlertComponent, AlertHeadingDirective, AlertLinkDirective],
      exports: [AlertComponent, AlertHeadingDirective, AlertLinkDirective]
    }]
  }], null, null);
})();
var _AlignDirective = class _AlignDirective {
  get hostClasses() {
    return {
      [`align-${this.align}`]: !!this.align
    };
  }
};
_AlignDirective.ɵfac = function AlignDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AlignDirective)();
};
_AlignDirective.ɵdir = ɵɵdefineDirective({
  type: _AlignDirective,
  selectors: [["", "cAlign", ""]],
  hostVars: 2,
  hostBindings: function AlignDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    align: [0, "cAlign", "align"]
  },
  standalone: true
});
var AlignDirective = _AlignDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AlignDirective, [{
    type: Directive,
    args: [{
      selector: "[cAlign]",
      standalone: true
    }]
  }], null, {
    align: [{
      type: Input,
      args: ["cAlign"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _BgColorDirective = class _BgColorDirective {
  constructor() {
    this.color = "";
  }
  get hostClasses() {
    return {
      [`bg-${this.color}`]: !!this.color,
      "bg-gradient": this.gradient
    };
  }
};
_BgColorDirective.ɵfac = function BgColorDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BgColorDirective)();
};
_BgColorDirective.ɵdir = ɵɵdefineDirective({
  type: _BgColorDirective,
  selectors: [["", "cBgColor", ""]],
  hostVars: 2,
  hostBindings: function BgColorDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    color: [0, "cBgColor", "color"],
    gradient: "gradient"
  },
  standalone: true
});
var BgColorDirective = _BgColorDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BgColorDirective, [{
    type: Directive,
    args: [{
      selector: "[cBgColor]",
      standalone: true
    }]
  }], null, {
    color: [{
      type: Input,
      args: ["cBgColor"]
    }],
    gradient: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _BorderDirective = class _BorderDirective {
  constructor() {
    this.border = true;
  }
  get hostClasses() {
    if (typeof this.border === "boolean") {
      return {
        border: true
      };
    }
    if (typeof this.border === "number" || typeof this.border === "string") {
      return {
        border: true,
        [`border-${this.border}`]: true
      };
    }
    if (typeof this.border === "object") {
      const borderObj = __spreadValues({
        top: void 0,
        end: void 0,
        bottom: void 0,
        start: void 0,
        color: void 0
      }, this.border);
      const keys = Object.keys(borderObj).filter((key) => borderObj[key] !== void 0);
      const classes = {};
      keys.forEach((key) => {
        const val = borderObj[key];
        if (typeof val === "boolean") {
          classes[`border-${key}`] = true;
        } else if (typeof val === "number" || typeof val === "string") {
          classes[`border-${key}-${val}`] = true;
        } else if (typeof val === "object") {
          if ("color" in val) {
            classes[`border-${key}-${val.color}`] = true;
          }
          if ("width" in val) {
            classes[`border-${key}-${val.width}`] = true;
          }
        }
      });
      return Object.entries(classes).length === 0 ? {
        border: false
      } : classes;
    }
  }
};
_BorderDirective.ɵfac = function BorderDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BorderDirective)();
};
_BorderDirective.ɵdir = ɵɵdefineDirective({
  type: _BorderDirective,
  selectors: [["", "cBorder", ""]],
  hostVars: 2,
  hostBindings: function BorderDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    border: [0, "cBorder", "border"]
  },
  standalone: true
});
var BorderDirective = _BorderDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BorderDirective, [{
    type: Directive,
    args: [{
      selector: "[cBorder]",
      standalone: true
    }]
  }], null, {
    border: [{
      type: Input,
      args: ["cBorder"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _RoundedDirective = class _RoundedDirective {
  constructor() {
    this.rounded = true;
  }
  get hostClasses() {
    if (typeof this.rounded === "boolean") {
      return {
        rounded: true
      };
    }
    if (typeof this.rounded === "number" || typeof this.rounded === "string") {
      return {
        [`rounded-${this.rounded}`]: true
      };
    }
    if (typeof this.rounded === "object") {
      const roundedObj = __spreadValues({
        top: void 0,
        end: void 0,
        bottom: void 0,
        start: void 0,
        circle: void 0,
        pill: void 0,
        size: void 0
      }, this.rounded);
      const keys = Object.keys(roundedObj).filter((key) => roundedObj[key] !== void 0);
      const classes = {};
      keys.forEach((key) => {
        const val = roundedObj[key];
        if (typeof val === "boolean") {
          classes[`rounded-${key}`] = val;
        } else {
          classes[`rounded-${val}`] = true;
        }
      });
      return Object.entries(classes).length === 0 ? {
        rounded: false
      } : classes;
    }
  }
};
_RoundedDirective.ɵfac = function RoundedDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RoundedDirective)();
};
_RoundedDirective.ɵdir = ɵɵdefineDirective({
  type: _RoundedDirective,
  selectors: [["", "cRounded", ""]],
  hostVars: 2,
  hostBindings: function RoundedDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    rounded: [0, "cRounded", "rounded"]
  },
  standalone: true
});
var RoundedDirective = _RoundedDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RoundedDirective, [{
    type: Directive,
    args: [{
      selector: "[cRounded]",
      standalone: true
    }]
  }], null, {
    rounded: [{
      type: Input,
      args: ["cRounded"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _destroyRef, _document, _elementRef, _scrolled, _scrollEffect, _observable, _shadowClass;
var _ShadowOnScrollDirective = class _ShadowOnScrollDirective {
  constructor() {
    __privateAdd(this, _destroyRef, inject(DestroyRef));
    __privateAdd(this, _document, inject(DOCUMENT));
    __privateAdd(this, _elementRef, inject(ElementRef));
    __privateAdd(this, _scrolled, signal(false));
    __privateAdd(this, _scrollEffect, effect(() => {
      __privateGet(this, _elementRef).nativeElement.classList.toggle(__privateGet(this, _shadowClass), __privateGet(this, _scrolled).call(this));
    }));
    __privateAdd(this, _observable);
    __privateAdd(this, _shadowClass, "shadow-sm");
    __privateGet(this, _destroyRef).onDestroy(() => {
      __privateGet(this, _scrollEffect)?.destroy();
    });
  }
  set cShadowOnScroll(value) {
    __privateGet(this, _scrolled).set(false);
    if (value) {
      __privateSet(this, _shadowClass, value === true ? "shadow" : `shadow-${value}`);
      __privateSet(this, _observable, fromEvent(__privateGet(this, _document), "scroll").pipe(takeUntilDestroyed(__privateGet(this, _destroyRef))).subscribe((scrolled) => {
        __privateGet(this, _scrolled).set(__privateGet(this, _document).documentElement.scrollTop > 0);
      }));
    } else {
      __privateGet(this, _observable)?.unsubscribe();
    }
  }
};
_destroyRef = new WeakMap();
_document = new WeakMap();
_elementRef = new WeakMap();
_scrolled = new WeakMap();
_scrollEffect = new WeakMap();
_observable = new WeakMap();
_shadowClass = new WeakMap();
_ShadowOnScrollDirective.ɵfac = function ShadowOnScrollDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ShadowOnScrollDirective)();
};
_ShadowOnScrollDirective.ɵdir = ɵɵdefineDirective({
  type: _ShadowOnScrollDirective,
  selectors: [["", "cShadowOnScroll", ""]],
  inputs: {
    cShadowOnScroll: "cShadowOnScroll"
  },
  standalone: true
});
var ShadowOnScrollDirective = _ShadowOnScrollDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShadowOnScrollDirective, [{
    type: Directive,
    args: [{
      selector: "[cShadowOnScroll]",
      standalone: true
    }]
  }], () => [], {
    cShadowOnScroll: [{
      type: Input
    }]
  });
})();
var _TextColorDirective = class _TextColorDirective {
  constructor() {
    this.color = input("", {
      alias: "cTextColor"
    });
  }
  get hostClasses() {
    const color = this.color();
    return {
      [`text-${color}`]: !!color
    };
  }
};
_TextColorDirective.ɵfac = function TextColorDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TextColorDirective)();
};
_TextColorDirective.ɵdir = ɵɵdefineDirective({
  type: _TextColorDirective,
  selectors: [["", "cTextColor", ""]],
  hostVars: 2,
  hostBindings: function TextColorDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    color: [1, "cTextColor", "color"]
  },
  standalone: true
});
var TextColorDirective = _TextColorDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TextColorDirective, [{
    type: Directive,
    args: [{
      selector: "[cTextColor]",
      standalone: true
    }]
  }], null, {
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _TextBgColorDirective = class _TextBgColorDirective {
  constructor() {
    this.textBgColor = input("", {
      alias: "cTextBgColor"
    });
  }
  get hostClasses() {
    const color = this.textBgColor();
    return {
      [`text-bg-${color}`]: !!color
    };
  }
};
_TextBgColorDirective.ɵfac = function TextBgColorDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TextBgColorDirective)();
};
_TextBgColorDirective.ɵdir = ɵɵdefineDirective({
  type: _TextBgColorDirective,
  selectors: [["", "cTextBgColor", ""]],
  hostVars: 2,
  hostBindings: function TextBgColorDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    textBgColor: [1, "cTextBgColor", "textBgColor"]
  },
  standalone: true
});
var TextBgColorDirective = _TextBgColorDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TextBgColorDirective, [{
    type: Directive,
    args: [{
      selector: "[cTextBgColor]",
      standalone: true
    }]
  }], null, {
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var UTILITY_DIRECTIVES = [AlignDirective, BgColorDirective, BorderDirective, RoundedDirective, ShadowOnScrollDirective, TextColorDirective, TextBgColorDirective];
var _UtilitiesModule = class _UtilitiesModule {
};
_UtilitiesModule.ɵfac = function UtilitiesModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _UtilitiesModule)();
};
_UtilitiesModule.ɵmod = ɵɵdefineNgModule({
  type: _UtilitiesModule,
  imports: [AlignDirective, BgColorDirective, BorderDirective, RoundedDirective, ShadowOnScrollDirective, TextColorDirective, TextBgColorDirective],
  exports: [AlignDirective, BgColorDirective, BorderDirective, RoundedDirective, ShadowOnScrollDirective, TextColorDirective, TextBgColorDirective]
});
_UtilitiesModule.ɵinj = ɵɵdefineInjector({});
var UtilitiesModule = _UtilitiesModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(UtilitiesModule, [{
    type: NgModule,
    args: [{
      imports: [...UTILITY_DIRECTIVES],
      exports: [...UTILITY_DIRECTIVES]
    }]
  }], null, null);
})();
var _AvatarComponent = class _AvatarComponent {
  constructor() {
    this.color = input();
    this.shape = input();
    this.size = input("md");
    this.alt = input("");
    this.src = input();
    this.status = input();
    this.textColor = input();
    this.statusClass = computed(() => {
      return {
        "avatar-status": true,
        [`bg-${this.status()}`]: !!this.status()
      };
    });
    this.hostClasses = computed(() => {
      return {
        avatar: true,
        [`avatar-${this.size()}`]: !!this.size(),
        [`bg-${this.color()}`]: !!this.color(),
        [`${this.shape()}`]: !!this.shape()
      };
    });
  }
};
_AvatarComponent.ɵfac = function AvatarComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AvatarComponent)();
};
_AvatarComponent.ɵcmp = ɵɵdefineComponent({
  type: _AvatarComponent,
  selectors: [["c-avatar"]],
  hostAttrs: [1, "avatar"],
  hostVars: 2,
  hostBindings: function AvatarComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    color: [1, "color"],
    shape: [1, "shape"],
    size: [1, "size"],
    alt: [1, "alt"],
    src: [1, "src"],
    status: [1, "status"],
    textColor: [1, "textColor"]
  },
  standalone: true,
  features: [ɵɵHostDirectivesFeature([{
    directive: TextColorDirective,
    inputs: ["cTextColor", "textColor"]
  }]), ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 3,
  vars: 1,
  consts: [[3, "ngClass"], ["fill", "", 1, "avatar-img", 3, "ngSrc", "alt"], ["aria-label", "Avatar placeholder", "focusable", "false", "preserveAspectRatio", "xMidYMid slice", "role", "img", "xmlns", "http://www.w3.org/2000/svg", 1, "avatar-img", 2, "position", "absolute", "width", "100%", "height", "100%", "inset", "0"], ["fill", "#868e96", "height", "100%", "width", "100%"]],
  template: function AvatarComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0, 0, null, AvatarComponent_ProjectionFallback_0_Template, 1, 1);
      ɵɵtemplate(2, AvatarComponent_Conditional_2_Template, 1, 1, "span", 0);
    }
    if (rf & 2) {
      ɵɵadvance(2);
      ɵɵconditional(!!ctx.status() ? 2 : -1);
    }
  },
  dependencies: [NgClass],
  encapsulation: 2
});
var AvatarComponent = _AvatarComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AvatarComponent, [{
    type: Component,
    args: [{
      selector: "c-avatar",
      standalone: true,
      imports: [NgClass, NgOptimizedImage],
      hostDirectives: [{
        directive: TextColorDirective,
        inputs: ["cTextColor: textColor"]
      }],
      host: {
        class: "avatar",
        "[class]": "hostClasses()"
      },
      template: `<ng-content>
  @if (src()) {
    @defer (prefetch on idle) {
      <img [ngSrc]="src() ?? ''" fill="" class="avatar-img" alt="{{alt()}}" />
    } @placeholder () {
      <svg aria-label="Avatar placeholder"
           focusable="false"
           preserveAspectRatio="xMidYMid slice"
           role="img"
           xmlns="http://www.w3.org/2000/svg"
           class="avatar-img"
           style="position: absolute; width: 100%; height: 100%; inset: 0;">
        <rect fill="#868e96" height="100%" width="100%"></rect>
      </svg>
    }
  }
</ng-content>
@if (!!status()) {
  <span [ngClass]="statusClass()"></span>
}

`
    }]
  }], null, null);
})();
var _AvatarModule = class _AvatarModule {
};
_AvatarModule.ɵfac = function AvatarModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AvatarModule)();
};
_AvatarModule.ɵmod = ɵɵdefineNgModule({
  type: _AvatarModule,
  imports: [AvatarComponent],
  exports: [AvatarComponent]
});
_AvatarModule.ɵinj = ɵɵdefineInjector({});
var AvatarModule = _AvatarModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AvatarModule, [{
    type: NgModule,
    args: [{
      imports: [AvatarComponent],
      exports: [AvatarComponent]
    }]
  }], null, null);
})();
var _BadgeComponent = class _BadgeComponent {
  constructor() {
    this.color = input();
    this.position = input();
    this.shape = input();
    this.size = input();
    this.textColor = input();
    this.textBgColor = input();
    this.hostClasses = computed(() => {
      const position = this.position();
      const positionClasses = {
        "position-absolute": !!position,
        "translate-middle": !!position,
        "top-0": position?.includes("top"),
        "top-100": position?.includes("bottom"),
        "start-100": position?.includes("end"),
        "start-0": position?.includes("start")
      };
      return Object.assign({
        badge: true,
        [`bg-${this.color()}`]: !!this.color(),
        [`badge-${this.size()}`]: !!this.size(),
        [`${this.shape()}`]: !!this.shape()
      }, !!position ? positionClasses : {});
    });
  }
};
_BadgeComponent.ɵfac = function BadgeComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BadgeComponent)();
};
_BadgeComponent.ɵcmp = ɵɵdefineComponent({
  type: _BadgeComponent,
  selectors: [["c-badge"]],
  hostAttrs: [1, "badge"],
  hostVars: 2,
  hostBindings: function BadgeComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    color: [1, "color"],
    position: [1, "position"],
    shape: [1, "shape"],
    size: [1, "size"],
    textColor: [1, "textColor"],
    textBgColor: [1, "textBgColor"]
  },
  standalone: true,
  features: [ɵɵHostDirectivesFeature([{
    directive: TextColorDirective,
    inputs: ["cTextColor", "textColor"]
  }, {
    directive: TextBgColorDirective,
    inputs: ["cTextBgColor", "textBgColor"]
  }]), ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function BadgeComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var BadgeComponent = _BadgeComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeComponent, [{
    type: Component,
    args: [{
      selector: "c-badge",
      template: "<ng-content />",
      standalone: true,
      hostDirectives: [{
        directive: TextColorDirective,
        inputs: ["cTextColor: textColor"]
      }, {
        directive: TextBgColorDirective,
        inputs: ["cTextBgColor: textBgColor"]
      }],
      host: {
        class: "badge",
        "[class]": "hostClasses()"
      }
    }]
  }], null, null);
})();
var _BadgeModule = class _BadgeModule {
};
_BadgeModule.ɵfac = function BadgeModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BadgeModule)();
};
_BadgeModule.ɵmod = ɵɵdefineNgModule({
  type: _BadgeModule,
  imports: [BadgeComponent],
  exports: [BadgeComponent]
});
_BadgeModule.ɵinj = ɵɵdefineInjector({});
var BadgeModule = _BadgeModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BadgeModule, [{
    type: NgModule,
    args: [{
      imports: [BadgeComponent],
      exports: [BadgeComponent]
    }]
  }], null, null);
})();
var _backdropClick, _document2, _rendererFactory, _renderer2, _unListen, _BackdropService_instances, scrollbarWidth_get, isRTL_get, _scrollBarVisible;
var _BackdropService = class _BackdropService {
  constructor() {
    __privateAdd(this, _BackdropService_instances);
    __privateAdd(this, _backdropClick);
    __privateAdd(this, _document2);
    __privateAdd(this, _rendererFactory);
    __privateAdd(this, _renderer2);
    __privateAdd(this, _unListen);
    __privateAdd(this, _scrollBarVisible);
    __privateSet(this, _backdropClick, new Subject());
    this.backdropClick$ = __privateGet(this, _backdropClick).asObservable();
    __privateSet(this, _document2, inject(DOCUMENT));
    __privateSet(this, _rendererFactory, inject(RendererFactory2));
    __privateSet(this, _renderer2, __privateGet(this, _rendererFactory).createRenderer(null, null));
    this.scrollbarWidth = __privateGet(this, _BackdropService_instances, scrollbarWidth_get);
    __privateSet(this, _scrollBarVisible, true);
  }
  setBackdrop(type = "modal") {
    const backdropElement = __privateGet(this, _renderer2).createElement("div");
    __privateGet(this, _renderer2).addClass(backdropElement, `${type}-backdrop`);
    __privateGet(this, _renderer2).addClass(backdropElement, "fade");
    __privateGet(this, _renderer2).appendChild(__privateGet(this, _document2).body, backdropElement);
    __privateSet(this, _unListen, __privateGet(this, _renderer2).listen(backdropElement, "click", (e) => {
      this.onClickHandler();
    }));
    this.scrollbarWidth = __privateGet(this, _BackdropService_instances, scrollbarWidth_get);
    setTimeout(() => {
      __privateGet(this, _renderer2).addClass(backdropElement, "show");
    });
    this.activeBackdrop = backdropElement;
    return backdropElement;
  }
  clearBackdrop(backdropElement) {
    if (backdropElement) {
      __privateGet(this, _unListen).call(this);
      __privateGet(this, _renderer2).removeClass(backdropElement, "show");
      setTimeout(() => {
        __privateGet(this, _renderer2).removeChild(__privateGet(this, _document2).body, backdropElement);
        if (this.activeBackdrop === backdropElement) {
          this.resetScrollbar();
        }
        backdropElement = void 0;
      }, 300);
    }
    return void 0;
  }
  hideScrollbar() {
    if (__privateGet(this, _scrollBarVisible)) {
      __privateGet(this, _renderer2).setStyle(__privateGet(this, _document2).body, "overflow", "hidden");
      __privateGet(this, _renderer2).setStyle(__privateGet(this, _document2).body, `padding-${__privateGet(this, _BackdropService_instances, isRTL_get) ? "left" : "right"}`, this.scrollbarWidth);
      __privateSet(this, _scrollBarVisible, false);
    }
  }
  resetScrollbar() {
    __privateGet(this, _renderer2).removeStyle(__privateGet(this, _document2).body, "overflow");
    __privateGet(this, _renderer2).removeStyle(__privateGet(this, _document2).body, `padding-${__privateGet(this, _BackdropService_instances, isRTL_get) ? "left" : "right"}`);
    __privateSet(this, _scrollBarVisible, true);
  }
  onClickHandler() {
    __privateGet(this, _backdropClick).next(true);
  }
};
_backdropClick = new WeakMap();
_document2 = new WeakMap();
_rendererFactory = new WeakMap();
_renderer2 = new WeakMap();
_unListen = new WeakMap();
_BackdropService_instances = new WeakSet();
scrollbarWidth_get = function() {
  const documentWidth = __privateGet(this, _document2).documentElement.clientWidth;
  const scrollbarWidth = Math.abs((__privateGet(this, _document2).defaultView?.innerWidth ?? documentWidth) - documentWidth);
  return `${scrollbarWidth}px`;
};
isRTL_get = function() {
  return __privateGet(this, _document2).documentElement.dir === "rtl" || __privateGet(this, _document2).body.dir === "rtl";
};
_scrollBarVisible = new WeakMap();
_BackdropService.ɵfac = function BackdropService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BackdropService)();
};
_BackdropService.ɵprov = ɵɵdefineInjectable({
  token: _BackdropService,
  factory: _BackdropService.ɵfac,
  providedIn: "root"
});
var BackdropService = _BackdropService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BackdropService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _BreadcrumbItemComponent = class _BreadcrumbItemComponent {
  get ariaCurrent() {
    return this.active ? "page" : null;
  }
  get hostClasses() {
    return {
      "breadcrumb-item": true,
      active: this.active
    };
  }
};
_BreadcrumbItemComponent.ɵfac = function BreadcrumbItemComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BreadcrumbItemComponent)();
};
_BreadcrumbItemComponent.ɵcmp = ɵɵdefineComponent({
  type: _BreadcrumbItemComponent,
  selectors: [["c-breadcrumb-item"]],
  hostVars: 3,
  hostBindings: function BreadcrumbItemComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-current", ctx.ariaCurrent);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    active: [2, "active", "active", booleanAttribute],
    url: "url",
    attributes: "attributes",
    linkProps: "linkProps"
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 4,
  vars: 1,
  consts: [["defaultBreadcrumbItemContentTemplate", ""], [3, "routerLink", "cHtmlAttr", "target", "queryParams", "fragment", "queryParamsHandling", "preserveFragment", "skipLocationChange", "replaceUrl", "state"], [3, "cHtmlAttr"], [4, "ngTemplateOutlet"]],
  template: function BreadcrumbItemComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵtemplate(0, BreadcrumbItemComponent_Conditional_0_Template, 2, 13, "a", 1)(1, BreadcrumbItemComponent_Conditional_1_Template, 2, 3, "span", 2)(2, BreadcrumbItemComponent_ng_template_2_Template, 1, 0, "ng-template", null, 0, ɵɵtemplateRefExtractor);
    }
    if (rf & 2) {
      ɵɵconditional(!ctx.active ? 0 : 1);
    }
  },
  dependencies: [RouterModule, RouterLink, NgTemplateOutlet, HtmlAttributesDirective],
  styles: ["[_nghost-%COMP%]{display:list-item;text-align:-webkit-match-parent;text-align:match-parent}"]
});
var BreadcrumbItemComponent = _BreadcrumbItemComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreadcrumbItemComponent, [{
    type: Component,
    args: [{
      selector: "c-breadcrumb-item",
      standalone: true,
      imports: [RouterModule, NgTemplateOutlet, HtmlAttributesDirective],
      template: `@if (!active) {
  <a [routerLink]="url"
     [cHtmlAttr]="attributes ?? {}"
     [target]="attributes?.['target']"
     [queryParams]="linkProps?.queryParams ?? null"
     [fragment]="linkProps?.fragment"
     [queryParamsHandling]="linkProps?.queryParamsHandling ?? null"
     [preserveFragment]="linkProps?.preserveFragment ?? false"
     [skipLocationChange]="linkProps?.skipLocationChange ?? false"
     [replaceUrl]="linkProps?.replaceUrl ?? false"
     [state]="linkProps?.state ?? {}"
  >
    <ng-container *ngTemplateOutlet="defaultBreadcrumbItemContentTemplate" />
  </a>
} @else {
  <span [cHtmlAttr]="attributes ?? {}">
      <ng-container *ngTemplateOutlet="defaultBreadcrumbItemContentTemplate" />
  </span>
}

<ng-template #defaultBreadcrumbItemContentTemplate>
  <ng-content />
</ng-template>
`,
      styles: [":host{display:list-item;text-align:-webkit-match-parent;text-align:match-parent}\n"]
    }]
  }], null, {
    active: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    url: [{
      type: Input
    }],
    attributes: [{
      type: Input
    }],
    linkProps: [{
      type: Input
    }],
    ariaCurrent: [{
      type: HostBinding,
      args: ["attr.aria-current"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _BreadcrumbComponent = class _BreadcrumbComponent {
  constructor() {
    this.ariaLabel = "breadcrumb";
    this.role = "navigation";
  }
};
_BreadcrumbComponent.ɵfac = function BreadcrumbComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BreadcrumbComponent)();
};
_BreadcrumbComponent.ɵcmp = ɵɵdefineComponent({
  type: _BreadcrumbComponent,
  selectors: [["c-breadcrumb"]],
  hostAttrs: [1, "breadcrumb"],
  hostVars: 2,
  hostBindings: function BreadcrumbComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-label", ctx.ariaLabel)("role", ctx.role);
    }
  },
  inputs: {
    ariaLabel: "ariaLabel",
    role: "role"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function BreadcrumbComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var BreadcrumbComponent = _BreadcrumbComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreadcrumbComponent, [{
    type: Component,
    args: [{
      selector: "c-breadcrumb",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "breadcrumb"
      }
    }]
  }], null, {
    ariaLabel: [{
      type: HostBinding,
      args: ["attr.aria-label"]
    }, {
      type: Input
    }],
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }, {
      type: Input
    }]
  });
})();
var _breadcrumbsBehaviorSubject;
var _BreadcrumbRouterService = class _BreadcrumbRouterService {
  constructor(router, route) {
    __privateAdd(this, _breadcrumbsBehaviorSubject);
    this.router = router;
    this.route = route;
    this.outlet = "primary";
    __privateSet(this, _breadcrumbsBehaviorSubject, new BehaviorSubject(new Array()));
    this.breadcrumbs$ = __privateGet(this, _breadcrumbsBehaviorSubject).asObservable();
    this.router.events.pipe(takeUntilDestroyed(), filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
      const breadcrumbs = [];
      let currentRoute = this.route.root;
      let url = "";
      do {
        const childrenRoutes = currentRoute.children;
        currentRoute = null;
        childrenRoutes.forEach((childRoute) => {
          if (childRoute.outlet === this.outlet) {
            const routeSnapshot = childRoute.snapshot;
            url += "/" + routeSnapshot.url.map((segment) => segment.path).join("/");
            breadcrumbs.push({
              label: routeSnapshot.data["title"] ?? routeSnapshot.title ?? "",
              url,
              queryParams: routeSnapshot.queryParams
            });
            currentRoute = childRoute;
          }
        });
      } while (currentRoute);
      __privateGet(this, _breadcrumbsBehaviorSubject).next(Object.assign([], breadcrumbs));
      return breadcrumbs;
    });
  }
};
_breadcrumbsBehaviorSubject = new WeakMap();
_BreadcrumbRouterService.ɵfac = function BreadcrumbRouterService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BreadcrumbRouterService)(ɵɵinject(Router), ɵɵinject(ActivatedRoute));
};
_BreadcrumbRouterService.ɵprov = ɵɵdefineInjectable({
  token: _BreadcrumbRouterService,
  factory: _BreadcrumbRouterService.ɵfac,
  providedIn: "root"
});
var BreadcrumbRouterService = _BreadcrumbRouterService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreadcrumbRouterService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Router
  }, {
    type: ActivatedRoute
  }], null);
})();
var _BreadcrumbRouterComponent = class _BreadcrumbRouterComponent {
  constructor(service) {
    this.service = service;
  }
  ngOnInit() {
    this.breadcrumbs = this.service.breadcrumbs$;
  }
  ngOnChanges(changes) {
    if (changes["items"]) {
      this.setup();
    }
  }
  setup() {
    if (this.items && this.items.length > 0) {
      this.breadcrumbs = new Observable((observer) => {
        if (this.items) {
          observer.next(this.items);
        }
      });
    }
  }
  ngOnDestroy() {
    this.breadcrumbs = void 0;
  }
};
_BreadcrumbRouterComponent.ɵfac = function BreadcrumbRouterComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BreadcrumbRouterComponent)(ɵɵdirectiveInject(BreadcrumbRouterService));
};
_BreadcrumbRouterComponent.ɵcmp = ɵɵdefineComponent({
  type: _BreadcrumbRouterComponent,
  selectors: [["c-breadcrumb-router"], ["", "cBreadcrumbRouter", ""]],
  inputs: {
    items: "items"
  },
  standalone: true,
  features: [ɵɵNgOnChangesFeature, ɵɵStandaloneFeature],
  decls: 4,
  vars: 2,
  consts: [[1, "m-0"], [3, "active", "url", "attributes", "linkProps"]],
  template: function BreadcrumbRouterComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelementStart(0, "c-breadcrumb", 0);
      ɵɵrepeaterCreate(1, BreadcrumbRouterComponent_For_2_Template, 1, 1, null, null, ɵɵrepeaterTrackByIdentity);
      ɵɵpipe(3, "async");
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵadvance();
      ɵɵrepeater(ɵɵpipeBind1(3, 0, ctx.breadcrumbs));
    }
  },
  dependencies: [BreadcrumbComponent, BreadcrumbItemComponent, AsyncPipe],
  encapsulation: 2
});
var BreadcrumbRouterComponent = _BreadcrumbRouterComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreadcrumbRouterComponent, [{
    type: Component,
    args: [{
      selector: "c-breadcrumb-router, [cBreadcrumbRouter]",
      standalone: true,
      imports: [BreadcrumbComponent, BreadcrumbItemComponent, AsyncPipe],
      template: `<c-breadcrumb class="m-0">
  @for (breadcrumb of breadcrumbs | async; track breadcrumb; let last = $last) {
    @if (breadcrumb?.label && (breadcrumb?.url?.slice(-1) === '/' || last)) {
      <c-breadcrumb-item
        [active]="last"
        [url]="breadcrumb?.url"
        [attributes]="breadcrumb?.attributes"
        [linkProps]="breadcrumb?.linkProps"
      >
        {{ breadcrumb?.label }}
      </c-breadcrumb-item>
    }
  }
</c-breadcrumb>
`
    }]
  }], () => [{
    type: BreadcrumbRouterService
  }], {
    items: [{
      type: Input
    }]
  });
})();
var _BreadcrumbModule = class _BreadcrumbModule {
};
_BreadcrumbModule.ɵfac = function BreadcrumbModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _BreadcrumbModule)();
};
_BreadcrumbModule.ɵmod = ɵɵdefineNgModule({
  type: _BreadcrumbModule,
  imports: [BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbRouterComponent],
  exports: [BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbRouterComponent]
});
_BreadcrumbModule.ɵinj = ɵɵdefineInjector({
  providers: [BreadcrumbRouterService],
  imports: [BreadcrumbItemComponent, BreadcrumbRouterComponent]
});
var BreadcrumbModule = _BreadcrumbModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreadcrumbModule, [{
    type: NgModule,
    args: [{
      imports: [BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbRouterComponent],
      exports: [BreadcrumbComponent, BreadcrumbItemComponent, BreadcrumbRouterComponent],
      providers: [BreadcrumbRouterService]
    }]
  }], null, null);
})();
var _ButtonGroupComponent = class _ButtonGroupComponent {
  constructor() {
    this.size = input();
    this.vertical = input(false, {
      transform: booleanAttribute
    });
    this.role = input("group");
    this.hostClasses = computed(() => {
      return {
        "btn-group": !this.vertical(),
        "btn-group-vertical": this.vertical(),
        [`btn-group-${this.size()}`]: !!this.size()
      };
    });
  }
};
_ButtonGroupComponent.ɵfac = function ButtonGroupComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ButtonGroupComponent)();
};
_ButtonGroupComponent.ɵcmp = ɵɵdefineComponent({
  type: _ButtonGroupComponent,
  selectors: [["c-button-group"]],
  hostVars: 3,
  hostBindings: function ButtonGroupComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    size: [1, "size"],
    vertical: [1, "vertical"],
    role: [1, "role"]
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ButtonGroupComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var ButtonGroupComponent = _ButtonGroupComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonGroupComponent, [{
    type: Component,
    args: [{
      selector: "c-button-group",
      template: "<ng-content />",
      standalone: true,
      host: {
        "[attr.role]": "role()",
        "[class]": "hostClasses()"
      }
    }]
  }], null, null);
})();
var _ButtonToolbarComponent = class _ButtonToolbarComponent {
  constructor() {
    this.role = input("toolbar");
  }
};
_ButtonToolbarComponent.ɵfac = function ButtonToolbarComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ButtonToolbarComponent)();
};
_ButtonToolbarComponent.ɵcmp = ɵɵdefineComponent({
  type: _ButtonToolbarComponent,
  selectors: [["c-button-toolbar"]],
  hostAttrs: [1, "btn-toolbar"],
  hostVars: 1,
  hostBindings: function ButtonToolbarComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role());
    }
  },
  inputs: {
    role: [1, "role"]
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ButtonToolbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var ButtonToolbarComponent = _ButtonToolbarComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonToolbarComponent, [{
    type: Component,
    args: [{
      selector: "c-button-toolbar",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "btn-toolbar",
        "[attr.role]": "role()"
      }
    }]
  }], null, null);
})();
var _ButtonGroupModule = class _ButtonGroupModule {
};
_ButtonGroupModule.ɵfac = function ButtonGroupModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ButtonGroupModule)();
};
_ButtonGroupModule.ɵmod = ɵɵdefineNgModule({
  type: _ButtonGroupModule,
  imports: [ButtonGroupComponent, ButtonToolbarComponent],
  exports: [ButtonGroupComponent, ButtonToolbarComponent]
});
_ButtonGroupModule.ɵinj = ɵɵdefineInjector({});
var ButtonGroupModule = _ButtonGroupModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ButtonGroupModule, [{
    type: NgModule,
    args: [{
      imports: [ButtonGroupComponent, ButtonToolbarComponent],
      exports: [ButtonGroupComponent, ButtonToolbarComponent]
    }]
  }], null, null);
})();
var _CalloutComponent = class _CalloutComponent {
  constructor() {
    this.color = input();
    this.hostClasses = computed(() => {
      const color = this.color();
      return {
        callout: true,
        [`callout-${color}`]: !!color
      };
    });
  }
};
_CalloutComponent.ɵfac = function CalloutComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CalloutComponent)();
};
_CalloutComponent.ɵcmp = ɵɵdefineComponent({
  type: _CalloutComponent,
  selectors: [["c-callout"], ["", "cCallout", ""]],
  hostAttrs: [1, "callout"],
  hostVars: 2,
  hostBindings: function CalloutComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    color: [1, "color"]
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function CalloutComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var CalloutComponent = _CalloutComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalloutComponent, [{
    type: Component,
    args: [{
      selector: "c-callout, [cCallout]",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "callout",
        "[class]": "hostClasses()"
      },
      styles: [":host{display:block}\n"]
    }]
  }], null, null);
})();
var _CalloutModule = class _CalloutModule {
};
_CalloutModule.ɵfac = function CalloutModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CalloutModule)();
};
_CalloutModule.ɵmod = ɵɵdefineNgModule({
  type: _CalloutModule,
  imports: [CalloutComponent],
  exports: [CalloutComponent]
});
_CalloutModule.ɵinj = ɵɵdefineInjector({});
var CalloutModule = _CalloutModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CalloutModule, [{
    type: NgModule,
    args: [{
      exports: [CalloutComponent],
      imports: [CalloutComponent]
    }]
  }], null, null);
})();
var _CardComponent = class _CardComponent {
  constructor() {
    this.color = input();
    this.textColor = input();
    this.textBgColor = input();
    this.hostClasses = computed(() => {
      const color = this.color();
      return {
        card: true,
        [`bg-${color}`]: !!color
      };
    });
  }
};
_CardComponent.ɵfac = function CardComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardComponent)();
};
_CardComponent.ɵcmp = ɵɵdefineComponent({
  type: _CardComponent,
  selectors: [["c-card"], ["", "c-card", ""]],
  hostAttrs: [1, "card"],
  hostVars: 2,
  hostBindings: function CardComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    color: [1, "color"],
    textColor: [1, "textColor"],
    textBgColor: [1, "textBgColor"]
  },
  standalone: true,
  features: [ɵɵHostDirectivesFeature([{
    directive: TextColorDirective,
    inputs: ["cTextColor", "textColor"]
  }, {
    directive: TextBgColorDirective,
    inputs: ["cTextBgColor", "textBgColor"]
  }]), ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function CardComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var CardComponent = _CardComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardComponent, [{
    type: Component,
    args: [{
      selector: "c-card, [c-card]",
      template: "<ng-content />",
      standalone: true,
      hostDirectives: [{
        directive: TextColorDirective,
        inputs: ["cTextColor: textColor"]
      }, {
        directive: TextBgColorDirective,
        inputs: ["cTextBgColor: textBgColor"]
      }],
      host: {
        class: "card",
        "[class]": "hostClasses()"
      }
    }]
  }], null, null);
})();
var _CardBodyComponent = class _CardBodyComponent {
};
_CardBodyComponent.ɵfac = function CardBodyComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardBodyComponent)();
};
_CardBodyComponent.ɵcmp = ɵɵdefineComponent({
  type: _CardBodyComponent,
  selectors: [["c-card-body"], ["", "c-card-body", ""]],
  hostAttrs: [1, "card-body"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function CardBodyComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var CardBodyComponent = _CardBodyComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardBodyComponent, [{
    type: Component,
    args: [{
      selector: "c-card-body, [c-card-body]",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "card-body"
      }
    }]
  }], null, null);
})();
var _CardFooterComponent = class _CardFooterComponent {
};
_CardFooterComponent.ɵfac = function CardFooterComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardFooterComponent)();
};
_CardFooterComponent.ɵcmp = ɵɵdefineComponent({
  type: _CardFooterComponent,
  selectors: [["c-card-footer"], ["", "c-card-footer", ""]],
  hostAttrs: [1, "card-footer"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function CardFooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var CardFooterComponent = _CardFooterComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardFooterComponent, [{
    type: Component,
    args: [{
      selector: "c-card-footer, [c-card-footer]",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "card-footer"
      }
    }]
  }], null, null);
})();
var _CardGroupComponent = class _CardGroupComponent {
};
_CardGroupComponent.ɵfac = function CardGroupComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardGroupComponent)();
};
_CardGroupComponent.ɵcmp = ɵɵdefineComponent({
  type: _CardGroupComponent,
  selectors: [["c-card-group"], ["", "c-card-group", ""]],
  hostAttrs: [1, "card-group"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function CardGroupComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var CardGroupComponent = _CardGroupComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardGroupComponent, [{
    type: Component,
    args: [{
      selector: "c-card-group, [c-card-group]",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "card-group"
      }
    }]
  }], null, null);
})();
var _CardHeaderComponent = class _CardHeaderComponent {
};
_CardHeaderComponent.ɵfac = function CardHeaderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardHeaderComponent)();
};
_CardHeaderComponent.ɵcmp = ɵɵdefineComponent({
  type: _CardHeaderComponent,
  selectors: [["c-card-header"], ["", "c-card-header", ""]],
  hostAttrs: [1, "card-header"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function CardHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var CardHeaderComponent = _CardHeaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardHeaderComponent, [{
    type: Component,
    args: [{
      selector: "c-card-header, [c-card-header]",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "card-header"
      }
    }]
  }], null, null);
})();
var _CardHeaderActionsComponent = class _CardHeaderActionsComponent {
};
_CardHeaderActionsComponent.ɵfac = function CardHeaderActionsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardHeaderActionsComponent)();
};
_CardHeaderActionsComponent.ɵcmp = ɵɵdefineComponent({
  type: _CardHeaderActionsComponent,
  selectors: [["c-card-header-actions"], ["", "c-card-header-actions", ""]],
  hostAttrs: [1, "card-header-actions"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function CardHeaderActionsComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var CardHeaderActionsComponent = _CardHeaderActionsComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardHeaderActionsComponent, [{
    type: Component,
    args: [{
      selector: "c-card-header-actions, [c-card-header-actions]",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "card-header-actions"
      }
    }]
  }], null, null);
})();
var _CardImgDirective = class _CardImgDirective {
  constructor() {
    this.orientation = input(void 0, {
      alias: "cCardImg"
    });
    this.hostClasses = computed(() => {
      const orientation = this.orientation();
      const suffix = !!orientation ? `-${orientation}` : "";
      const horizontal = ["start", "end"].includes(orientation ?? "-") ? orientation : void 0;
      return {
        [`card-img${suffix}`]: !horizontal,
        "img-fluid": !!horizontal,
        [`rounded-${horizontal}`]: !!horizontal
      };
    });
  }
};
_CardImgDirective.ɵfac = function CardImgDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardImgDirective)();
};
_CardImgDirective.ɵdir = ɵɵdefineDirective({
  type: _CardImgDirective,
  selectors: [["", "cCardImg", ""]],
  hostVars: 2,
  hostBindings: function CardImgDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    orientation: [1, "cCardImg", "orientation"]
  },
  standalone: true
});
var CardImgDirective = _CardImgDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardImgDirective, [{
    type: Directive,
    args: [{
      selector: "[cCardImg]",
      standalone: true,
      host: {
        "[class]": "hostClasses()"
      }
    }]
  }], null, null);
})();
var _CardImgOverlayComponent = class _CardImgOverlayComponent {
};
_CardImgOverlayComponent.ɵfac = function CardImgOverlayComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardImgOverlayComponent)();
};
_CardImgOverlayComponent.ɵcmp = ɵɵdefineComponent({
  type: _CardImgOverlayComponent,
  selectors: [["c-card-img-overlay"]],
  hostAttrs: [1, "card-img-overlay"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function CardImgOverlayComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var CardImgOverlayComponent = _CardImgOverlayComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardImgOverlayComponent, [{
    type: Component,
    args: [{
      selector: "c-card-img-overlay",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "card-img-overlay"
      },
      styles: [":host{display:block}\n"]
    }]
  }], null, null);
})();
var _CardLinkDirective = class _CardLinkDirective {
};
_CardLinkDirective.ɵfac = function CardLinkDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardLinkDirective)();
};
_CardLinkDirective.ɵdir = ɵɵdefineDirective({
  type: _CardLinkDirective,
  selectors: [["", "cCardLink", ""]],
  hostAttrs: [1, "card-link"],
  standalone: true
});
var CardLinkDirective = _CardLinkDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardLinkDirective, [{
    type: Directive,
    args: [{
      selector: "[cCardLink]",
      standalone: true,
      host: {
        class: "card-link"
      }
    }]
  }], null, null);
})();
var _CardSubtitleDirective = class _CardSubtitleDirective {
};
_CardSubtitleDirective.ɵfac = function CardSubtitleDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardSubtitleDirective)();
};
_CardSubtitleDirective.ɵdir = ɵɵdefineDirective({
  type: _CardSubtitleDirective,
  selectors: [["", "cCardSubtitle", ""]],
  hostAttrs: [1, "card-subtitle"],
  standalone: true
});
var CardSubtitleDirective = _CardSubtitleDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardSubtitleDirective, [{
    type: Directive,
    args: [{
      selector: "[cCardSubtitle]",
      standalone: true,
      host: {
        class: "card-subtitle"
      }
    }]
  }], null, null);
})();
var _CardTextDirective = class _CardTextDirective {
};
_CardTextDirective.ɵfac = function CardTextDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardTextDirective)();
};
_CardTextDirective.ɵdir = ɵɵdefineDirective({
  type: _CardTextDirective,
  selectors: [["", "cCardText", ""]],
  hostAttrs: [1, "card-text"],
  standalone: true
});
var CardTextDirective = _CardTextDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardTextDirective, [{
    type: Directive,
    args: [{
      selector: "[cCardText]",
      standalone: true,
      host: {
        class: "card-text"
      }
    }]
  }], null, null);
})();
var _CardTitleDirective = class _CardTitleDirective {
};
_CardTitleDirective.ɵfac = function CardTitleDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardTitleDirective)();
};
_CardTitleDirective.ɵdir = ɵɵdefineDirective({
  type: _CardTitleDirective,
  selectors: [["", "cCardTitle", ""]],
  hostAttrs: [1, "card-title"],
  standalone: true
});
var CardTitleDirective = _CardTitleDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardTitleDirective, [{
    type: Directive,
    args: [{
      selector: "[cCardTitle]",
      standalone: true,
      host: {
        class: "card-title"
      }
    }]
  }], null, null);
})();
var _CardModule = class _CardModule {
};
_CardModule.ɵfac = function CardModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CardModule)();
};
_CardModule.ɵmod = ɵɵdefineNgModule({
  type: _CardModule,
  imports: [CardComponent, CardBodyComponent, CardFooterComponent, CardGroupComponent, CardHeaderComponent, CardHeaderActionsComponent, CardImgDirective, CardImgOverlayComponent, CardLinkDirective, CardSubtitleDirective, CardTextDirective, CardTitleDirective],
  exports: [CardComponent, CardBodyComponent, CardFooterComponent, CardGroupComponent, CardHeaderComponent, CardHeaderActionsComponent, CardImgDirective, CardImgOverlayComponent, CardLinkDirective, CardSubtitleDirective, CardTextDirective, CardTitleDirective]
});
_CardModule.ɵinj = ɵɵdefineInjector({});
var CardModule = _CardModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CardModule, [{
    type: NgModule,
    args: [{
      imports: [CardComponent, CardBodyComponent, CardFooterComponent, CardGroupComponent, CardHeaderComponent, CardHeaderActionsComponent, CardImgDirective, CardImgOverlayComponent, CardLinkDirective, CardSubtitleDirective, CardTextDirective, CardTitleDirective],
      exports: [CardComponent, CardBodyComponent, CardFooterComponent, CardGroupComponent, CardHeaderComponent, CardHeaderActionsComponent, CardImgDirective, CardImgOverlayComponent, CardLinkDirective, CardSubtitleDirective, CardTextDirective, CardTitleDirective]
    }]
  }], null, null);
})();
var _intersecting;
var _IntersectionService = class _IntersectionService {
  constructor() {
    __privateAdd(this, _intersecting);
    this.platformId = inject(PLATFORM_ID);
    __privateSet(this, _intersecting, new BehaviorSubject({
      isIntersecting: false
    }));
    this.intersecting$ = __privateGet(this, _intersecting).asObservable();
    this.defaultObserverOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.2
    };
    this.hostElementRefs = /* @__PURE__ */ new Map();
  }
  createIntersectionObserver(hostElement, observerOptions = this.defaultObserverOptions) {
    if (isPlatformServer(this.platformId)) {
      __privateGet(this, _intersecting).next({
        isIntersecting: true,
        hostElement
      });
      return;
    }
    const options = __spreadValues(__spreadValues({}, this.defaultObserverOptions), observerOptions);
    const handleIntersect = (entries, observer) => {
      entries.forEach((entry) => {
        __privateGet(this, _intersecting).next({
          isIntersecting: entry.isIntersecting,
          hostElement
        });
      });
    };
    this.hostElementRefs.set(hostElement, new IntersectionObserver(handleIntersect, options));
    this.hostElementRefs.get(hostElement)?.observe(hostElement.nativeElement);
  }
  unobserve(elementRef) {
    this.hostElementRefs.get(elementRef)?.unobserve(elementRef.nativeElement);
    this.hostElementRefs.set(elementRef, null);
    this.hostElementRefs.delete(elementRef);
  }
  ngOnDestroy() {
    this.hostElementRefs.forEach((observer, elementRef) => {
      observer?.unobserve(elementRef.nativeElement);
    });
  }
};
_intersecting = new WeakMap();
_IntersectionService.ɵfac = function IntersectionService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _IntersectionService)();
};
_IntersectionService.ɵprov = ɵɵdefineInjectable({
  token: _IntersectionService,
  factory: _IntersectionService.ɵfac,
  providedIn: "root"
});
var IntersectionService = _IntersectionService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(IntersectionService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _ListenersService = class _ListenersService {
  constructor() {
    this.renderer = inject(Renderer2);
    this.listeners = /* @__PURE__ */ new Map();
  }
  setListeners({
    hostElement,
    trigger: trigger2,
    callbackOn,
    callbackOff,
    callbackToggle
  }) {
    const host = hostElement.nativeElement;
    const triggers = Array.isArray(trigger2) ? trigger2 : trigger2?.split(" ") ?? [];
    if (triggers?.includes("click")) {
      typeof callbackToggle === "function" && this.listeners.set("click", this.renderer.listen(host, "click", callbackToggle));
    }
    if (triggers?.includes("focus")) {
      typeof callbackOn === "function" && this.listeners.set("focus", this.renderer.listen(host, "focus", callbackOn));
    }
    if (triggers?.includes("focusin")) {
      typeof callbackOff === "function" && this.listeners.set("focusout", this.renderer.listen(host, "focusout", callbackOff));
      typeof callbackOn === "function" && this.listeners.set("focusin", this.renderer.listen(host, "focusin", callbackOn));
    }
    if (triggers?.includes("click") || triggers?.includes("focus")) {
      typeof callbackOff === "function" && this.listeners.set("blur", this.renderer.listen(host, "blur", callbackOff));
    }
    if (triggers?.includes("hover")) {
      typeof callbackOn === "function" && this.listeners.set("mouseenter", this.renderer.listen(host, "mouseenter", callbackOn));
      typeof callbackOff === "function" && this.listeners.set("mouseleave", this.renderer.listen(host, "mouseleave", callbackOff));
    }
  }
  clearListeners() {
    this.listeners.forEach((unListen, key) => {
      unListen();
    });
    this.listeners.forEach((unListen, key) => {
      this.listeners.set(key, null);
    });
    this.listeners.clear();
  }
};
_ListenersService.ɵfac = function ListenersService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ListenersService)();
};
_ListenersService.ɵprov = ɵɵdefineInjectable({
  token: _ListenersService,
  factory: _ListenersService.ɵfac
});
var ListenersService = _ListenersService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ListenersService, [{
    type: Injectable
  }], null, null);
})();
var _ClassToggleService = class _ClassToggleService {
  constructor(document2, rendererFactory) {
    this.document = document2;
    this.rendererFactory = rendererFactory;
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  toggle(selector, className) {
    const element = document.querySelector(selector);
    if (element) {
      element.classList.contains(className) ? this.renderer.removeClass(element, className) : this.renderer.addClass(element, className);
    }
  }
};
_ClassToggleService.ɵfac = function ClassToggleService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ClassToggleService)(ɵɵinject(DOCUMENT), ɵɵinject(RendererFactory2));
};
_ClassToggleService.ɵprov = ɵɵdefineInjectable({
  token: _ClassToggleService,
  factory: _ClassToggleService.ɵfac,
  providedIn: "root"
});
var ClassToggleService = _ClassToggleService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ClassToggleService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: RendererFactory2
  }], null);
})();
var _storage;
var _InMemoryStorageService = class _InMemoryStorageService {
  constructor() {
    __privateAdd(this, _storage, /* @__PURE__ */ new Map());
  }
  setItem(key, data) {
    __privateGet(this, _storage).set(key, JSON.stringify(data));
  }
  getItem(key) {
    return __privateGet(this, _storage).has(key) ? JSON.parse(__privateGet(this, _storage).get(key) ?? "null") : void 0;
  }
  removeItem(key) {
    __privateGet(this, _storage).delete(key);
  }
  clear() {
    __privateGet(this, _storage).clear();
  }
  get length() {
    return __privateGet(this, _storage).size;
  }
  key(index) {
    return Array.from(__privateGet(this, _storage).keys())[index];
  }
};
_storage = new WeakMap();
_InMemoryStorageService.ɵfac = function InMemoryStorageService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _InMemoryStorageService)();
};
_InMemoryStorageService.ɵprov = ɵɵdefineInjectable({
  token: _InMemoryStorageService,
  factory: _InMemoryStorageService.ɵfac,
  providedIn: "root"
});
var InMemoryStorageService = _InMemoryStorageService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InMemoryStorageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _localStorage, _data$;
var _LocalStorageService = class _LocalStorageService {
  constructor() {
    __privateAdd(this, _localStorage);
    __privateAdd(this, _data$);
    this.platformId = inject(PLATFORM_ID);
    this.document = inject(DOCUMENT);
    __privateSet(this, _data$, new BehaviorSubject(null));
    this.data$ = __privateGet(this, _data$).asObservable();
    __privateSet(this, _localStorage, isPlatformBrowser(this.platformId) && this.document.defaultView ? this.document.defaultView?.localStorage : new InMemoryStorageService());
  }
  setItem(key, data) {
    __privateGet(this, _localStorage).setItem(key, JSON.stringify(data));
    __privateGet(this, _data$).next({
      key,
      data
    });
  }
  getItem(key) {
    const data = JSON.parse(__privateGet(this, _localStorage).getItem(key) || "null");
    __privateGet(this, _data$).next({
      key,
      data
    });
    return data;
  }
  removeItem(key) {
    __privateGet(this, _localStorage).removeItem(key);
    __privateGet(this, _data$).next({
      key,
      data: null
    });
  }
  clear() {
    __privateGet(this, _localStorage).clear();
    __privateGet(this, _data$).next(null);
  }
};
_localStorage = new WeakMap();
_data$ = new WeakMap();
_LocalStorageService.ɵfac = function LocalStorageService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _LocalStorageService)();
};
_LocalStorageService.ɵprov = ɵɵdefineInjectable({
  token: _LocalStorageService,
  factory: _LocalStorageService.ɵfac,
  providedIn: "root"
});
var LocalStorageService = _LocalStorageService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LocalStorageService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var _destroyRef2, _document3, _localStorage2, _ColorModeService_instances, setTheme_fn;
var _ColorModeService = class _ColorModeService {
  constructor() {
    __privateAdd(this, _ColorModeService_instances);
    __privateAdd(this, _destroyRef2);
    __privateAdd(this, _document3);
    __privateAdd(this, _localStorage2);
    __privateSet(this, _destroyRef2, inject(DestroyRef));
    __privateSet(this, _document3, inject(DOCUMENT));
    __privateSet(this, _localStorage2, inject(LocalStorageService));
    this.eventName = signal("ColorSchemeChange");
    this.localStorageItemName = signal(void 0);
    this.localStorageItemName$ = toObservable(this.localStorageItemName);
    this.colorMode = signal(void 0);
    this.colorModeEffect = effect(() => {
      const colorMode = this.colorMode();
      if (colorMode) {
        const localStorageItemName = this.localStorageItemName();
        localStorageItemName && this.setStoredTheme(localStorageItemName, colorMode);
        __privateMethod(this, _ColorModeService_instances, setTheme_fn).call(this, colorMode);
      }
    });
    afterNextRender({
      read: () => {
        this.localStorageItemName$.pipe(tap((params) => {
          this.colorMode.set(this.getDefaultScheme(params));
        }), takeUntilDestroyed(__privateGet(this, _destroyRef2))).subscribe();
      }
    });
  }
  getStoredTheme(localStorageItemName) {
    return __privateGet(this, _localStorage2).getItem(localStorageItemName);
  }
  setStoredTheme(localStorageItemName, colorMode) {
    return __privateGet(this, _localStorage2).setItem(localStorageItemName, colorMode);
  }
  removeStoredTheme(localStorageItemName) {
    __privateGet(this, _localStorage2).removeItem(localStorageItemName);
  }
  getDefaultScheme(localStorageItemName) {
    if (__privateGet(this, _document3).defaultView === void 0) {
      return this.getDatasetTheme();
    }
    const storedTheme = localStorageItemName && this.getStoredTheme(localStorageItemName);
    return storedTheme ?? this.getDatasetTheme();
  }
  getPrefersColorScheme() {
    return __privateGet(this, _document3).defaultView?.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : __privateGet(this, _document3).defaultView?.matchMedia("(prefers-color-scheme: light)").matches ? "light" : void 0;
  }
  getDatasetTheme() {
    return __privateGet(this, _document3).documentElement.dataset["coreuiTheme"];
  }
};
_destroyRef2 = new WeakMap();
_document3 = new WeakMap();
_localStorage2 = new WeakMap();
_ColorModeService_instances = new WeakSet();
setTheme_fn = function(colorMode) {
  __privateGet(this, _document3).documentElement.dataset["coreuiTheme"] = colorMode === "auto" ? this.getPrefersColorScheme() : colorMode;
  const event = new Event(this.eventName());
  __privateGet(this, _document3).documentElement.dispatchEvent(event);
};
_ColorModeService.ɵfac = function ColorModeService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ColorModeService)();
};
_ColorModeService.ɵprov = ɵɵdefineInjectable({
  token: _ColorModeService,
  factory: _ColorModeService.ɵfac,
  providedIn: "root"
});
var ColorModeService = _ColorModeService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ColorModeService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
var _CarouselService = class _CarouselService {
  constructor() {
    this.carouselIndex = new BehaviorSubject({});
    this.carouselIndex$ = this.carouselIndex.asObservable();
  }
  setIndex(index) {
    this.carouselIndex.next(index);
  }
};
_CarouselService.ɵfac = function CarouselService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CarouselService)();
};
_CarouselService.ɵprov = ɵɵdefineInjectable({
  token: _CarouselService,
  factory: _CarouselService.ɵfac
});
var CarouselService = _CarouselService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselService, [{
    type: Injectable
  }], null, null);
})();
var _CarouselState = class _CarouselState {
  constructor(carouselService) {
    this.carouselService = carouselService;
    this._state = {
      activeItemIndex: -1,
      animate: true,
      items: [],
      direction: "next",
      transition: "slide"
    };
  }
  get state() {
    return this._state;
  }
  set state(state2) {
    const prevState = __spreadValues({}, this._state);
    const nextState = __spreadValues(__spreadValues({}, this._state), state2);
    this._state = nextState;
    if (prevState.activeItemIndex !== nextState.activeItemIndex) {
      const activeItemIndex = this.state.activeItemIndex || 0;
      const itemInterval = this.state.items && this.state.items[activeItemIndex]?.interval || -1;
      this.carouselService.setIndex({
        active: nextState.activeItemIndex,
        interval: itemInterval,
        lastItemIndex: (nextState.items?.length ?? 0) - 1
      });
    }
  }
  setItems(newItems) {
    if (newItems.length) {
      const itemsArray = newItems.toArray();
      itemsArray.forEach((item, i) => {
        item.index = i;
      });
      this.state = {
        items: itemsArray
      };
    } else {
      this.reset();
    }
  }
  setNextIndex(nextIndex) {
    this.carouselService.setIndex(nextIndex);
  }
  direction(direction = "next") {
    this.state = {
      direction
    };
    const {
      activeItemIndex = -1,
      items
    } = this.state;
    const itemsCount = items?.length ?? 0;
    if (itemsCount > 0) {
      return direction === "next" ? activeItemIndex === itemsCount - 1 ? 0 : activeItemIndex + 1 : activeItemIndex === 0 ? itemsCount - 1 : activeItemIndex - 1;
    } else {
      return 0;
    }
  }
  reset() {
    this.state = {
      activeItemIndex: -1,
      animate: true,
      items: [],
      direction: "next",
      transition: "slide"
    };
  }
};
_CarouselState.ɵfac = function CarouselState_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CarouselState)(ɵɵinject(CarouselService));
};
_CarouselState.ɵprov = ɵɵdefineInjectable({
  token: _CarouselState,
  factory: _CarouselState.ɵfac
});
var CarouselState = _CarouselState;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselState, [{
    type: Injectable
  }], () => [{
    type: CarouselService
  }], null);
})();
var _CarouselConfig = class _CarouselConfig {
  constructor() {
    this.activeIndex = 0;
    this.animate = true;
    this.dark = false;
    this.direction = "next";
    this.interval = 3e3;
  }
};
_CarouselConfig.ɵfac = function CarouselConfig_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CarouselConfig)();
};
_CarouselConfig.ɵprov = ɵɵdefineInjectable({
  token: _CarouselConfig,
  factory: _CarouselConfig.ɵfac
});
var CarouselConfig = _CarouselConfig;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselConfig, [{
    type: Injectable
  }], null, null);
})();
var _destroyRef3;
var _CarouselComponent = class _CarouselComponent {
  constructor(config, hostElement, carouselService, carouselState, intersectionService, listenersService) {
    __privateAdd(this, _destroyRef3);
    this.config = config;
    this.hostElement = hostElement;
    this.carouselService = carouselService;
    this.carouselState = carouselState;
    this.intersectionService = intersectionService;
    this.listenersService = listenersService;
    this.activeIndex = 0;
    this.animate = true;
    this.direction = "next";
    this.interval = 0;
    this.pause = "hover";
    this.touch = true;
    this.transition = "slide";
    this.wrap = true;
    this.itemChange = new EventEmitter();
    this.activeItemInterval = 0;
    __privateSet(this, _destroyRef3, inject(DestroyRef));
    this._visible = true;
    Object.assign(this, config);
  }
  get hostClasses() {
    return {
      carousel: true,
      slide: true,
      "carousel-fade": this.transition === "crossfade"
    };
  }
  ngOnInit() {
    this.carouselStateSubscribe();
  }
  ngOnDestroy() {
    this.resetTimer();
    this.clearListeners();
    this.swipeSubscribe(false);
  }
  ngAfterContentInit() {
    this.intersectionServiceSubscribe();
    this.carouselState.state = {
      activeItemIndex: this.activeIndex,
      animate: this.animate
    };
    this.setListeners();
    this.swipeSubscribe();
  }
  setListeners() {
    const config = {
      hostElement: this.hostElement,
      trigger: this.pause || [],
      callbackOff: () => {
        this.setTimer();
      },
      callbackOn: () => {
        this.resetTimer();
      }
    };
    this.listenersService.setListeners(config);
  }
  clearListeners() {
    this.listenersService.clearListeners();
  }
  set visible(value) {
    this._visible = value;
  }
  get visible() {
    return this._visible;
  }
  setTimer() {
    const interval = this.activeItemInterval || 0;
    this.resetTimer();
    if (interval > 0) {
      this.timerId = setTimeout(() => {
        const nextIndex = this.carouselState.direction(this.direction);
        this.carouselState.state = {
          activeItemIndex: nextIndex
        };
      }, interval);
    }
  }
  resetTimer() {
    clearTimeout(this.timerId);
    this.timerId = void 0;
  }
  carouselStateSubscribe() {
    this.carouselService.carouselIndex$.pipe(takeUntilDestroyed(__privateGet(this, _destroyRef3))).subscribe((nextItem) => {
      if ("active" in nextItem) {
        this.itemChange.emit(nextItem.active);
      }
      this.activeItemInterval = typeof nextItem.interval === "number" && nextItem.interval > -1 ? nextItem.interval : this.interval;
      const isLastItem = nextItem.active === nextItem.lastItemIndex && this.direction === "next" || nextItem.active === 0 && this.direction === "prev";
      !this.wrap && isLastItem ? this.resetTimer() : this.setTimer();
    });
  }
  intersectionServiceSubscribe() {
    this.intersectionService.createIntersectionObserver(this.hostElement);
    this.intersectionService.intersecting$.pipe(filter((next) => next.hostElement === this.hostElement), finalize(() => {
      this.intersectionService.unobserve(this.hostElement);
    }), takeUntilDestroyed(__privateGet(this, _destroyRef3))).subscribe((next) => {
      this.visible = next.isIntersecting;
      next.isIntersecting ? this.setTimer() : this.resetTimer();
    });
  }
  swipeSubscribe(subscribe = true) {
    if (this.touch && subscribe) {
      const carouselElement = this.hostElement.nativeElement;
      const touchStart$ = fromEvent(carouselElement, "touchstart");
      const touchEnd$ = fromEvent(carouselElement, "touchend");
      const touchMove$ = fromEvent(carouselElement, "touchmove");
      this.swipeSubscription = touchStart$.pipe(zipWith(touchEnd$.pipe(withLatestFrom(touchMove$))), takeUntilDestroyed(__privateGet(this, _destroyRef3))).subscribe(([touchstart, [touchend, touchmove]]) => {
        touchstart.stopPropagation();
        touchmove.stopPropagation();
        const distanceX = touchstart.touches[0].clientX - touchmove.touches[0].clientX;
        if (Math.abs(distanceX) > 0.3 * carouselElement.clientWidth && touchstart.timeStamp <= touchmove.timeStamp) {
          const nextIndex = this.carouselState.direction(distanceX > 0 ? "next" : "prev");
          this.carouselState.state = {
            activeItemIndex: nextIndex
          };
        }
      });
    } else {
      this.swipeSubscription?.unsubscribe();
    }
  }
};
_destroyRef3 = new WeakMap();
_CarouselComponent.ɵfac = function CarouselComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CarouselComponent)(ɵɵdirectiveInject(CarouselConfig), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(CarouselService), ɵɵdirectiveInject(CarouselState), ɵɵdirectiveInject(IntersectionService), ɵɵdirectiveInject(ListenersService));
};
_CarouselComponent.ɵcmp = ɵɵdefineComponent({
  type: _CarouselComponent,
  selectors: [["c-carousel"]],
  hostAttrs: [1, "carousel", "slide"],
  hostVars: 2,
  hostBindings: function CarouselComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    activeIndex: "activeIndex",
    animate: "animate",
    direction: "direction",
    interval: "interval",
    pause: "pause",
    touch: "touch",
    transition: "transition",
    wrap: "wrap"
  },
  outputs: {
    itemChange: "itemChange"
  },
  standalone: true,
  features: [ɵɵProvidersFeature([CarouselService, CarouselState, CarouselConfig, ListenersService]), ɵɵHostDirectivesFeature([{
    directive: ThemeDirective,
    inputs: ["dark", "dark"]
  }]), ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function CarouselComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var CarouselComponent = _CarouselComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselComponent, [{
    type: Component,
    args: [{
      selector: "c-carousel",
      template: "<ng-content />",
      providers: [CarouselService, CarouselState, CarouselConfig, ListenersService],
      standalone: true,
      hostDirectives: [{
        directive: ThemeDirective,
        inputs: ["dark"]
      }],
      host: {
        class: "carousel slide"
      },
      styles: [":host{display:block}\n"]
    }]
  }], () => [{
    type: CarouselConfig,
    decorators: [{
      type: Inject,
      args: [CarouselConfig]
    }]
  }, {
    type: ElementRef
  }, {
    type: CarouselService
  }, {
    type: CarouselState
  }, {
    type: IntersectionService
  }, {
    type: ListenersService
  }], {
    activeIndex: [{
      type: Input
    }],
    animate: [{
      type: Input
    }],
    direction: [{
      type: Input
    }],
    interval: [{
      type: Input
    }],
    pause: [{
      type: Input
    }],
    touch: [{
      type: Input
    }],
    transition: [{
      type: Input
    }],
    wrap: [{
      type: Input
    }],
    itemChange: [{
      type: Output
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _CarouselCaptionComponent = class _CarouselCaptionComponent {
  constructor() {
    this.carouselCaptionClass = true;
  }
};
_CarouselCaptionComponent.ɵfac = function CarouselCaptionComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CarouselCaptionComponent)();
};
_CarouselCaptionComponent.ɵcmp = ɵɵdefineComponent({
  type: _CarouselCaptionComponent,
  selectors: [["c-carousel-caption"]],
  hostVars: 2,
  hostBindings: function CarouselCaptionComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassProp("carousel-caption", ctx.carouselCaptionClass);
    }
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function CarouselCaptionComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var CarouselCaptionComponent = _CarouselCaptionComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselCaptionComponent, [{
    type: Component,
    args: [{
      selector: "c-carousel-caption",
      template: "<ng-content />",
      standalone: true,
      styles: [":host{display:block}\n"]
    }]
  }], null, {
    carouselCaptionClass: [{
      type: HostBinding,
      args: ["class.carousel-caption"]
    }]
  });
})();
var _CarouselControlComponent = class _CarouselControlComponent {
  constructor(changeDetectorRef, carouselState) {
    this.changeDetectorRef = changeDetectorRef;
    this.carouselState = carouselState;
    this.direction = "next";
    this.hasContent = true;
  }
  /**
   * Carousel control caption. [docs]
   * @type string
   */
  set caption(value) {
    this._caption = value;
  }
  get caption() {
    return !!this._caption ? this._caption : this.direction === "prev" ? "Previous" : "Next";
  }
  get hostRole() {
    return "button";
  }
  get hostClasses() {
    return `carousel-control-${this.direction}`;
  }
  get carouselControlIconClass() {
    return `carousel-control-${this.direction}-icon`;
  }
  onKeyUp($event) {
    if ($event.key === "Enter") {
      this.play();
    }
    if ($event.key === "ArrowLeft") {
      this.play("prev");
    }
    if ($event.key === "ArrowRight") {
      this.play("next");
    }
  }
  onClick($event) {
    this.play();
  }
  ngAfterViewInit() {
    this.hasContent = this.content?.nativeElement.childNodes.length ?? false;
    this.changeDetectorRef.detectChanges();
  }
  play(direction = this.direction) {
    const nextIndex = this.carouselState.direction(direction);
    this.carouselState.state = {
      activeItemIndex: nextIndex
    };
  }
};
_CarouselControlComponent.ɵfac = function CarouselControlComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CarouselControlComponent)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(CarouselState));
};
_CarouselControlComponent.ɵcmp = ɵɵdefineComponent({
  type: _CarouselControlComponent,
  selectors: [["c-carousel-control"]],
  viewQuery: function CarouselControlComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(_c3, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.content = _t.first);
    }
  },
  hostVars: 3,
  hostBindings: function CarouselControlComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("keyup", function CarouselControlComponent_keyup_HostBindingHandler($event) {
        return ctx.onKeyUp($event);
      })("click", function CarouselControlComponent_click_HostBindingHandler($event) {
        return ctx.onClick($event);
      });
    }
    if (rf & 2) {
      ɵɵattribute("role", ctx.hostRole);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    caption: "caption",
    direction: "direction"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 2,
  vars: 1,
  consts: [["content", ""], [1, "visually-hidden"]],
  template: function CarouselControlComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵtemplate(0, CarouselControlComponent_Conditional_0_Template, 3, 0, "div")(1, CarouselControlComponent_Conditional_1_Template, 3, 5);
    }
    if (rf & 2) {
      ɵɵconditional(ctx.hasContent ? 0 : 1);
    }
  },
  encapsulation: 2
});
var CarouselControlComponent = _CarouselControlComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselControlComponent, [{
    type: Component,
    args: [{
      selector: "c-carousel-control",
      standalone: true,
      template: '@if (hasContent) {\n  <div #content>\n    <ng-content />\n  </div>\n} @else {\n  <span [class]="carouselControlIconClass" [attr.aria-label]="direction" [attr.aria-hidden]="true"></span>\n  <span class="visually-hidden">{{ caption }}</span>\n}\n'
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: CarouselState
  }], {
    caption: [{
      type: Input
    }],
    direction: [{
      type: Input
    }],
    hostRole: [{
      type: HostBinding,
      args: ["attr.role"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    content: [{
      type: ViewChild,
      args: ["content"]
    }],
    onKeyUp: [{
      type: HostListener,
      args: ["keyup", ["$event"]]
    }],
    onClick: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }]
  });
})();
var _CarouselIndicatorsComponent = class _CarouselIndicatorsComponent {
  constructor(carouselService, carouselState) {
    this.carouselService = carouselService;
    this.carouselState = carouselState;
    this.items = [];
    this.active = 0;
  }
  ngOnInit() {
    this.carouselStateSubscribe();
  }
  ngOnDestroy() {
    this.carouselStateSubscribe(false);
  }
  onClick(index) {
    if (index !== this.active) {
      const direction = index < this.active ? "prev" : "next";
      this.carouselState.state = {
        direction,
        activeItemIndex: index
      };
    }
  }
  carouselStateSubscribe(subscribe = true) {
    if (subscribe) {
      this.carouselIndexSubscription = this.carouselService.carouselIndex$.subscribe((nextIndex) => {
        this.items = this.carouselState?.state?.items?.map((item) => item.index) ?? [];
        if ("active" in nextIndex) {
          this.active = nextIndex.active ?? 0;
        }
      });
    } else {
      this.carouselIndexSubscription?.unsubscribe();
    }
  }
};
_CarouselIndicatorsComponent.ɵfac = function CarouselIndicatorsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CarouselIndicatorsComponent)(ɵɵdirectiveInject(CarouselService), ɵɵdirectiveInject(CarouselState));
};
_CarouselIndicatorsComponent.ɵcmp = ɵɵdefineComponent({
  type: _CarouselIndicatorsComponent,
  selectors: [["c-carousel-indicators"]],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  decls: 3,
  vars: 0,
  consts: [[1, "carousel-indicators"], ["type", "button", 3, "class"], ["type", "button", 3, "click"]],
  template: function CarouselIndicatorsComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelementStart(0, "div", 0);
      ɵɵrepeaterCreate(1, CarouselIndicatorsComponent_For_2_Template, 1, 6, "button", 1, ɵɵrepeaterTrackByIdentity);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵadvance();
      ɵɵrepeater(ctx.items);
    }
  },
  encapsulation: 2
});
var CarouselIndicatorsComponent = _CarouselIndicatorsComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselIndicatorsComponent, [{
    type: Component,
    args: [{
      selector: "c-carousel-indicators",
      standalone: true,
      template: '<div class="carousel-indicators">\n  @for (item of items; track item; let i = $index) {\n    <button\n      [attr.data-coreui-target]="i"\n      type="button"\n      (click)="onClick(i)"\n      [class]="{ active: active === i }"\n      [attr.aria-current]="active === i">\n    </button>\n  }\n</div>\n'
    }]
  }], () => [{
    type: CarouselService
  }, {
    type: CarouselState
  }], null);
})();
function toLeft(fromState, toState) {
  return toState.left === true;
}
function toRight(fromState, toState) {
  return toState.left === false;
}
var slideAnimation = trigger("slideAnimation", [state("*", style({
  transform: "translateX(0)",
  display: "block",
  opacity: 1
})), transition(toLeft, group([query(":leave", [animate("0.6s ease-in-out", style({
  transform: "translateX(-100%)"
}))], {
  optional: true
}), query(":enter", [style({
  transform: "translateX(100%)"
}), animate("0.6s ease-in-out", style("*"))], {
  optional: true
})])), transition(toRight, group([query(":enter", [style({
  transform: "translateX(-100%)"
}), animate("0.6s ease-in-out", style("*"))], {
  optional: true
}), query(":leave", [animate("0.6s ease-in-out", style({
  transform: "translateX(100%)"
}))], {
  optional: true
})]))]);
var fadeAnimation = trigger("fadeAnimation", [state("*", style({
  zIndex: 1,
  opacity: 1
})), transition(toLeft, group([query(":leave", [animate("0.6s ease-in-out", style({
  zIndex: 0,
  opacity: 0
}))], {
  optional: true
}), query(":enter", [style({
  zIndex: 1,
  opacity: 1
}), animate("0.6s ease-in-out", style("*"))], {
  optional: true
})])), transition(toRight, group([query(":enter", [style({
  zIndex: 1,
  opacity: 1
}), animate("0.6s ease-in-out", style("*"))], {
  optional: true
}), query(":leave", [animate("0.6s ease-in-out", style({
  zIndex: 0,
  opacity: 0
}))], {
  optional: true
})]))]);
var _CarouselItemComponent = class _CarouselItemComponent {
  /**
   * @ignore
   */
  set active(value) {
    this._active = value;
    this.changeDetectorRef.markForCheck();
  }
  get active() {
    return this._active;
  }
  get hostClasses() {
    return {
      "carousel-item": true,
      active: this.active
    };
  }
  constructor(carouselService, changeDetectorRef) {
    this.carouselService = carouselService;
    this.changeDetectorRef = changeDetectorRef;
    this._active = false;
    this.interval = -1;
  }
  ngOnDestroy() {
    this.carouselStateSubscribe(false);
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.carouselStateSubscribe();
    });
  }
  carouselStateSubscribe(subscribe = true) {
    if (subscribe) {
      this.carouselIndexSubscription = this.carouselService.carouselIndex$.subscribe((nextIndex) => {
        if ("active" in nextIndex) {
          this.active = nextIndex.active === this.index;
        }
      });
    } else {
      this.carouselIndexSubscription?.unsubscribe();
    }
  }
};
_CarouselItemComponent.ɵfac = function CarouselItemComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CarouselItemComponent)(ɵɵdirectiveInject(CarouselService), ɵɵdirectiveInject(ChangeDetectorRef));
};
_CarouselItemComponent.ɵcmp = ɵɵdefineComponent({
  type: _CarouselItemComponent,
  selectors: [["c-carousel-item"]],
  hostAttrs: [1, "carousel-item"],
  hostVars: 2,
  hostBindings: function CarouselItemComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    active: [2, "active", "active", booleanAttribute],
    interval: "interval"
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 1,
  template: function CarouselItemComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵtemplate(0, CarouselItemComponent_Conditional_0_Template, 1, 0);
    }
    if (rf & 2) {
      ɵɵconditional(ctx.active ? 0 : -1);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var CarouselItemComponent = _CarouselItemComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselItemComponent, [{
    type: Component,
    args: [{
      selector: "c-carousel-item",
      standalone: true,
      host: {
        class: "carousel-item"
      },
      template: "@if (active) {\n  <ng-content />\n}\n",
      styles: [":host{display:block}\n"]
    }]
  }], () => [{
    type: CarouselService
  }, {
    type: ChangeDetectorRef
  }], {
    active: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    interval: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _CarouselInnerComponent = class _CarouselInnerComponent {
  constructor(carouselState) {
    this.carouselState = carouselState;
    this.carouselInnerClass = true;
    this.slide = {
      left: true
    };
    this.transition = "slide";
  }
  ngAfterContentInit() {
    this.setItems();
  }
  ngAfterContentChecked() {
    this.setItems();
    const state2 = this.carouselState?.state;
    const nextIndex = state2?.activeItemIndex;
    const nextDirection = state2?.direction;
    if (this.activeIndex !== nextIndex) {
      this.animate = state2?.animate;
      this.slide = {
        left: nextDirection === "next"
      };
      this.activeIndex = state2?.activeItemIndex;
      this.transition = state2?.transition ?? "slide";
    }
  }
  setItems() {
    if (this.prevContentItems !== this.contentItems) {
      this.prevContentItems = this.contentItems;
      this.carouselState.setItems(this.contentItems);
    }
  }
};
_CarouselInnerComponent.ɵfac = function CarouselInnerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CarouselInnerComponent)(ɵɵdirectiveInject(CarouselState));
};
_CarouselInnerComponent.ɵcmp = ɵɵdefineComponent({
  type: _CarouselInnerComponent,
  selectors: [["c-carousel-inner"]],
  contentQueries: function CarouselInnerComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, CarouselItemComponent, 4);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.contentItems = _t);
    }
  },
  hostVars: 2,
  hostBindings: function CarouselInnerComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassProp("carousel-inner", ctx.carouselInnerClass);
    }
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 2,
  vars: 2,
  template: function CarouselInnerComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "div");
      ɵɵprojection(1);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵproperty("@slideAnimation", ctx.slide)("@.disabled", !ctx.animate);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"],
  data: {
    animation: [slideAnimation, fadeAnimation]
  }
});
var CarouselInnerComponent = _CarouselInnerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselInnerComponent, [{
    type: Component,
    args: [{
      selector: "c-carousel-inner",
      animations: [slideAnimation, fadeAnimation],
      standalone: true,
      template: '<div [@slideAnimation]="slide" [@.disabled]="!animate">\n  <ng-content />\n</div>\n<!--todo-->\n<!--<div [@fadeAnimation]="slide" [@.disabled]="!animate" >-->\n<!--  <ng-content />-->\n<!--</div>-->\n',
      styles: [":host{display:block}\n"]
    }]
  }], () => [{
    type: CarouselState
  }], {
    carouselInnerClass: [{
      type: HostBinding,
      args: ["class.carousel-inner"]
    }],
    contentItems: [{
      type: ContentChildren,
      args: [CarouselItemComponent]
    }]
  });
})();
var _CarouselModule = class _CarouselModule {
  static forRoot() {
    return {
      ngModule: _CarouselModule,
      providers: []
    };
  }
};
_CarouselModule.ɵfac = function CarouselModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CarouselModule)();
};
_CarouselModule.ɵmod = ɵɵdefineNgModule({
  type: _CarouselModule,
  imports: [CarouselComponent, CarouselCaptionComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent],
  exports: [CarouselComponent, CarouselCaptionComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent]
});
_CarouselModule.ɵinj = ɵɵdefineInjector({
  providers: [CarouselService, CarouselState, CarouselConfig]
});
var CarouselModule = _CarouselModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CarouselModule, [{
    type: NgModule,
    args: [{
      imports: [CarouselComponent, CarouselCaptionComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent],
      providers: [CarouselService, CarouselState, CarouselConfig],
      exports: [CarouselComponent, CarouselCaptionComponent, CarouselControlComponent, CarouselIndicatorsComponent, CarouselInnerComponent, CarouselItemComponent]
    }]
  }], null, null);
})();
var _DropdownDividerDirective = class _DropdownDividerDirective {
};
_DropdownDividerDirective.ɵfac = function DropdownDividerDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DropdownDividerDirective)();
};
_DropdownDividerDirective.ɵdir = ɵɵdefineDirective({
  type: _DropdownDividerDirective,
  selectors: [["", "cDropdownDivider", ""]],
  hostAttrs: [1, "dropdown-divider"],
  standalone: true
});
var DropdownDividerDirective = _DropdownDividerDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropdownDividerDirective, [{
    type: Directive,
    args: [{
      selector: "[cDropdownDivider]",
      standalone: true,
      host: {
        class: "dropdown-divider"
      }
    }]
  }], null, null);
})();
var _DropdownHeaderDirective = class _DropdownHeaderDirective {
};
_DropdownHeaderDirective.ɵfac = function DropdownHeaderDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DropdownHeaderDirective)();
};
_DropdownHeaderDirective.ɵdir = ɵɵdefineDirective({
  type: _DropdownHeaderDirective,
  selectors: [["", "cDropdownHeader", ""]],
  hostAttrs: [1, "dropdown-header"],
  standalone: true
});
var DropdownHeaderDirective = _DropdownHeaderDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropdownHeaderDirective, [{
    type: Directive,
    args: [{
      selector: "[cDropdownHeader]",
      standalone: true,
      host: {
        class: "dropdown-header"
      }
    }]
  }], null, null);
})();
var _DropdownService = class _DropdownService {
  constructor() {
    this.dropdownState = new BehaviorSubject({});
    this.dropdownState$ = this.dropdownState.asObservable();
  }
  toggle(state2) {
    this.dropdownState.next(state2);
  }
};
_DropdownService.ɵfac = function DropdownService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DropdownService)();
};
_DropdownService.ɵprov = ɵɵdefineInjectable({
  token: _DropdownService,
  factory: _DropdownService.ɵfac
});
var DropdownService = _DropdownService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropdownService, [{
    type: Injectable
  }], null, null);
})();
var _destroyRef4, _dropdownService, _focusKeyManager;
var _DropdownMenuDirective = class _DropdownMenuDirective {
  constructor() {
    __privateAdd(this, _destroyRef4);
    __privateAdd(this, _dropdownService);
    __privateAdd(this, _focusKeyManager);
    __privateSet(this, _destroyRef4, inject(DestroyRef));
    this.elementRef = inject(ElementRef);
    __privateSet(this, _dropdownService, inject(DropdownService));
    this.visible = false;
  }
  get hostClasses() {
    return {
      "dropdown-menu": true,
      [`dropdown-menu-${this.alignment}`]: !!this.alignment,
      show: this.visible
    };
  }
  get hostStyles() {
    return {
      visibility: this.visible ? null : "",
      display: this.visible ? null : ""
    };
  }
  onKeyDown($event) {
    if (!this.visible) {
      return;
    }
    if (["Space", "ArrowDown"].includes($event.code)) {
      $event.preventDefault();
    }
    __privateGet(this, _focusKeyManager).onKeydown($event);
  }
  onKeyUp($event) {
    if (!this.visible) {
      return;
    }
    if (["Tab"].includes($event.key)) {
      if (__privateGet(this, _focusKeyManager).activeItem) {
        $event.shiftKey ? __privateGet(this, _focusKeyManager).setPreviousItemActive() : __privateGet(this, _focusKeyManager).setNextItemActive();
      } else {
        __privateGet(this, _focusKeyManager).setFirstItemActive();
      }
    }
  }
  ngAfterContentInit() {
    this.focusKeyManagerInit();
    this.dropdownItemsContent.changes.pipe(tap((change) => {
      this.focusKeyManagerInit();
    }), takeUntilDestroyed(__privateGet(this, _destroyRef4))).subscribe();
  }
  ngOnInit() {
    __privateGet(this, _dropdownService).dropdownState$.pipe(tap((state2) => {
      if ("visible" in state2) {
        this.visible = state2.visible === "toggle" ? !this.visible : state2.visible;
        if (!this.visible) {
          __privateGet(this, _focusKeyManager)?.setActiveItem(-1);
        }
      }
    }), takeUntilDestroyed(__privateGet(this, _destroyRef4))).subscribe();
  }
  focusKeyManagerInit() {
    __privateSet(this, _focusKeyManager, new FocusKeyManager(this.dropdownItemsContent).withHomeAndEnd().withPageUpDown().withWrap().skipPredicate((dropdownItem) => dropdownItem.disabled === true));
  }
};
_destroyRef4 = new WeakMap();
_dropdownService = new WeakMap();
_focusKeyManager = new WeakMap();
_DropdownMenuDirective.ɵfac = function DropdownMenuDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DropdownMenuDirective)();
};
_DropdownMenuDirective.ɵdir = ɵɵdefineDirective({
  type: _DropdownMenuDirective,
  selectors: [["", "cDropdownMenu", ""]],
  contentQueries: function DropdownMenuDirective_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, DropdownItemDirective, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.dropdownItemsContent = _t);
    }
  },
  hostAttrs: [1, "dropdown-menu"],
  hostVars: 4,
  hostBindings: function DropdownMenuDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("keydown", function DropdownMenuDirective_keydown_HostBindingHandler($event) {
        return ctx.onKeyDown($event);
      })("keyup", function DropdownMenuDirective_keyup_HostBindingHandler($event) {
        return ctx.onKeyUp($event);
      });
    }
    if (rf & 2) {
      ɵɵstyleMap(ctx.hostStyles);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    alignment: "alignment",
    visible: "visible"
  },
  exportAs: ["cDropdownMenu"],
  standalone: true,
  features: [ɵɵHostDirectivesFeature([{
    directive: ThemeDirective,
    inputs: ["dark", "dark"]
  }])]
});
var DropdownMenuDirective = _DropdownMenuDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropdownMenuDirective, [{
    type: Directive,
    args: [{
      selector: "[cDropdownMenu]",
      exportAs: "cDropdownMenu",
      standalone: true,
      hostDirectives: [{
        directive: ThemeDirective,
        inputs: ["dark"]
      }],
      host: {
        class: "dropdown-menu"
      }
    }]
  }], null, {
    alignment: [{
      type: Input
    }],
    visible: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    hostStyles: [{
      type: HostBinding,
      args: ["style"]
    }],
    onKeyDown: [{
      type: HostListener,
      args: ["keydown", ["$event"]]
    }],
    onKeyUp: [{
      type: HostListener,
      args: ["keyup", ["$event"]]
    }],
    dropdownItemsContent: [{
      type: ContentChildren,
      args: [forwardRef(() => DropdownItemDirective), {
        descendants: true
      }]
    }]
  });
})();
var DropdownToken = class {
};
var _destroyRef5, _dropdownService2, _ariaExpanded;
var _DropdownToggleDirective = class _DropdownToggleDirective {
  constructor() {
    // injections
    __privateAdd(this, _destroyRef5);
    __privateAdd(this, _dropdownService2);
    __privateAdd(this, _ariaExpanded);
    __privateSet(this, _destroyRef5, inject(DestroyRef));
    this.elementRef = inject(ElementRef);
    __privateSet(this, _dropdownService2, inject(DropdownService));
    this.dropdown = inject(DropdownToken, {
      optional: true
    });
    this.disabled = false;
    this.caret = true;
    this.split = false;
    __privateSet(this, _ariaExpanded, signal(false));
  }
  get hostClasses() {
    return {
      "dropdown-toggle": this.caret,
      "dropdown-toggle-split": this.split,
      disabled: this.disabled
    };
  }
  get ariaExpanded() {
    return __privateGet(this, _ariaExpanded).call(this);
  }
  onClick($event) {
    $event.preventDefault();
    !this.disabled && __privateGet(this, _dropdownService2).toggle({
      visible: "toggle",
      dropdown: this.dropdown
    });
  }
  ngAfterViewInit() {
    if (this.dropdownComponent) {
      this.dropdown = this.dropdownComponent;
      __privateSet(this, _dropdownService2, this.dropdownComponent?.dropdownService);
    }
    if (this.dropdown) {
      const dropdown = this.dropdown;
      dropdown?.visibleChange?.pipe(takeUntilDestroyed(__privateGet(this, _destroyRef5))).subscribe((visible) => {
        __privateGet(this, _ariaExpanded).set(visible);
      });
    }
  }
};
_destroyRef5 = new WeakMap();
_dropdownService2 = new WeakMap();
_ariaExpanded = new WeakMap();
_DropdownToggleDirective.ɵfac = function DropdownToggleDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DropdownToggleDirective)();
};
_DropdownToggleDirective.ɵdir = ɵɵdefineDirective({
  type: _DropdownToggleDirective,
  selectors: [["", "cDropdownToggle", ""]],
  hostVars: 3,
  hostBindings: function DropdownToggleDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function DropdownToggleDirective_click_HostBindingHandler($event) {
        return ctx.onClick($event);
      });
    }
    if (rf & 2) {
      ɵɵattribute("aria-expanded", ctx.ariaExpanded);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    dropdownComponent: "dropdownComponent",
    disabled: [2, "disabled", "disabled", booleanAttribute],
    caret: "caret",
    split: [2, "split", "split", booleanAttribute]
  },
  exportAs: ["cDropdownToggle"],
  standalone: true,
  features: [ɵɵProvidersFeature([{
    provide: DropdownToken,
    useExisting: forwardRef(() => DropdownComponent)
  }]), ɵɵInputTransformsFeature]
});
var DropdownToggleDirective = _DropdownToggleDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropdownToggleDirective, [{
    type: Directive,
    args: [{
      selector: "[cDropdownToggle]",
      providers: [{
        provide: DropdownToken,
        useExisting: forwardRef(() => DropdownComponent)
      }],
      exportAs: "cDropdownToggle",
      standalone: true
    }]
  }], null, {
    dropdownComponent: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    caret: [{
      type: Input
    }],
    split: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    ariaExpanded: [{
      type: HostBinding,
      args: ["attr.aria-expanded"]
    }],
    onClick: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }]
  });
})();
var _DropdownComponent = class _DropdownComponent {
  constructor(document2, elementRef, renderer, ngZone, changeDetectorRef, dropdownService) {
    this.document = document2;
    this.elementRef = elementRef;
    this.renderer = renderer;
    this.ngZone = ngZone;
    this.changeDetectorRef = changeDetectorRef;
    this.dropdownService = dropdownService;
    this.autoClose = true;
    this.placement = "bottom-start";
    this.popper = true;
    this._popperOptions = {
      placement: this.placement,
      modifiers: [],
      strategy: "absolute"
    };
    this.variant = "dropdown";
    this._visible = false;
    this.visibleChange = new EventEmitter();
    this.dropdownContext = {
      $implicit: this.visible
    };
    this.activeTrap = false;
    this.listeners = [];
    this.dropdownStateSubscribe();
  }
  /**
   * Optional popper Options object, placement prop takes precedence over
   * @type Partial<Options>
   */
  set popperOptions(value) {
    this._popperOptions = __spreadValues(__spreadValues({}, this._popperOptions), value);
  }
  get popperOptions() {
    let placement = this.placement;
    switch (this.direction) {
      case "dropup": {
        placement = "top-start";
        break;
      }
      case "dropend": {
        placement = "right-start";
        break;
      }
      case "dropstart": {
        placement = "left-start";
        break;
      }
      case "center": {
        placement = "bottom";
        break;
      }
      case "dropup-center": {
        placement = "top";
        break;
      }
    }
    if (this.alignment === "end") {
      placement = "bottom-end";
    }
    this._popperOptions = __spreadProps(__spreadValues({}, this._popperOptions), {
      placement
    });
    return this._popperOptions;
  }
  /**
   * Toggle the visibility of dropdown menu component.
   * @type boolean
   * @default false
   */
  set visible(value) {
    const _value2 = value;
    if (_value2 !== this._visible) {
      this.activeTrap = _value2;
      this._visible = _value2;
      _value2 ? this.createPopperInstance() : this.destroyPopperInstance();
      this.visibleChange.emit(_value2);
    }
  }
  get visible() {
    return this._visible;
  }
  get hostClasses() {
    return {
      dropdown: (this.variant === "dropdown" || this.variant === "nav-item") && !this.direction,
      [`${this.direction}`]: !!this.direction,
      [`${this.variant}`]: !!this.variant,
      dropup: this.direction === "dropup" || this.direction === "dropup-center",
      show: this.visible
    };
  }
  // todo: find better solution
  get hostStyle() {
    return this.variant === "input-group" ? {
      display: "contents"
    } : {};
  }
  onHostClick($event) {
    this.clickedTarget = $event.target;
  }
  dropdownStateSubscribe(subscribe = true) {
    if (subscribe) {
      this.dropdownStateSubscription = this.dropdownService.dropdownState$.pipe(filter((state2) => {
        return this === state2.dropdown;
      })).subscribe((state2) => {
        if ("visible" in state2) {
          state2?.visible === "toggle" ? this.toggleDropdown() : this.visible = state2.visible;
        }
      });
    } else {
      this.dropdownStateSubscription?.unsubscribe();
    }
  }
  toggleDropdown() {
    this.visible = !this.visible;
  }
  onClick(event) {
    if (!this._toggler?.elementRef.nativeElement.contains(event.target?.closest("[cDropdownToggle]"))) {
      this.toggleDropdown();
    }
  }
  ngAfterContentInit() {
    if (this.variant === "nav-item") {
      this.renderer.addClass(this._toggler.elementRef.nativeElement, "nav-link");
    }
  }
  ngOnInit() {
    this.setVisibleState(this.visible);
  }
  ngOnChanges(changes) {
    if (changes["visible"] && !changes["visible"].firstChange) {
      this.setVisibleState(changes["visible"].currentValue);
    }
  }
  ngOnDestroy() {
    this.clearListeners();
    this.dropdownStateSubscribe(false);
    this.destroyPopperInstance();
  }
  setVisibleState(value) {
    this.dropdownService.toggle({
      visible: value,
      dropdown: this
    });
  }
  // todo: turn off popper in navbar-nav
  createPopperInstance() {
    if (this._toggler && this._menu) {
      this.ngZone.runOutsideAngular(() => {
        this._menu.elementRef.nativeElement.style.visibility = "hidden";
        this._menu.elementRef.nativeElement.style.display = "block";
        if (this.popper) {
          this.popperInstance = createPopper3(this._toggler.elementRef.nativeElement, this._menu.elementRef.nativeElement, __spreadValues({}, this.popperOptions));
        }
        this.ngZone.run(() => {
          this.setListeners();
          this.changeDetectorRef.markForCheck();
          this.changeDetectorRef.detectChanges();
        });
      });
    }
  }
  destroyPopperInstance() {
    this.clearListeners();
    this.popperInstance?.destroy();
    this.popperInstance = void 0;
    this.changeDetectorRef.markForCheck();
  }
  setListeners() {
    this.listeners.push(this.renderer.listen(this.document, "click", (event) => {
      const target = event.target;
      if (this._menuElementRef?.nativeElement.contains(event.target)) {
        this.clickedTarget = target;
      }
      if (this._toggler?.elementRef.nativeElement.contains(event.target)) {
        return;
      }
      if (this.autoClose === true) {
        this.setVisibleState(false);
        return;
      }
      if (this.clickedTarget === target && this.autoClose === "inside") {
        this.setVisibleState(false);
        return;
      }
      if (this.clickedTarget !== target && this.autoClose === "outside") {
        this.setVisibleState(false);
        return;
      }
    }));
    this.listeners.push(this.renderer.listen(this.elementRef.nativeElement, "keyup", (event) => {
      if (event.key === "Escape" && this.autoClose !== false) {
        event.stopPropagation();
        this.setVisibleState(false);
        return;
      }
    }));
    this.listeners.push(this.renderer.listen(this.document, "keyup", (event) => {
      if (event.key === "Tab" && this.autoClose !== false && !this.elementRef.nativeElement.contains(event.target)) {
        this.setVisibleState(false);
        return;
      }
    }));
  }
  clearListeners() {
    this.listeners.forEach((unListen) => {
      unListen();
    });
    this.listeners.fill(void 0);
    this.listeners = [];
  }
};
_DropdownComponent.ɵfac = function DropdownComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DropdownComponent)(ɵɵdirectiveInject(DOCUMENT), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(NgZone), ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(DropdownService));
};
_DropdownComponent.ɵcmp = ɵɵdefineComponent({
  type: _DropdownComponent,
  selectors: [["c-dropdown"]],
  contentQueries: function DropdownComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, DropdownToggleDirective, 5);
      ɵɵcontentQuery(dirIndex, DropdownMenuDirective, 5);
      ɵɵcontentQuery(dirIndex, DropdownMenuDirective, 5, ElementRef);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._toggler = _t.first);
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._menu = _t.first);
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx._menuElementRef = _t.first);
    }
  },
  hostVars: 4,
  hostBindings: function DropdownComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function DropdownComponent_click_HostBindingHandler($event) {
        return ctx.onHostClick($event);
      });
    }
    if (rf & 2) {
      ɵɵstyleMap(ctx.hostStyle);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    alignment: "alignment",
    autoClose: "autoClose",
    direction: "direction",
    placement: "placement",
    popper: [2, "popper", "popper", booleanAttribute],
    popperOptions: "popperOptions",
    variant: "variant",
    visible: [2, "visible", "visible", booleanAttribute]
  },
  outputs: {
    visibleChange: "visibleChange"
  },
  exportAs: ["cDropdown"],
  standalone: true,
  features: [ɵɵProvidersFeature([DropdownService]), ɵɵInputTransformsFeature, ɵɵHostDirectivesFeature([{
    directive: ThemeDirective,
    inputs: ["dark", "dark"]
  }]), ɵɵNgOnChangesFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function DropdownComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: [".dropdown[_nghost-%COMP%]:not(.btn-group), .dropdown   [_nghost-%COMP%]:not(.btn-group), .dropup[_nghost-%COMP%]:not(.btn-group), .dropup   [_nghost-%COMP%]:not(.btn-group){display:block}.dropstart[_nghost-%COMP%]:not(.btn-group), .dropstart   [_nghost-%COMP%]:not(.btn-group), .dropend[_nghost-%COMP%]:not(.btn-group), .dropend   [_nghost-%COMP%]:not(.btn-group){display:inline-flex}html:not([dir=rtl]).input-group   [_nghost-%COMP%]:first-child  :first-child, html:not([dir=rtl])   .input-group   [_nghost-%COMP%]:first-child  :first-child, .input-group   html:not([dir=rtl])   [_nghost-%COMP%]:first-child  :first-child{border-top-right-radius:0;border-bottom-right-radius:0}html:not([dir=rtl]).input-group   [_nghost-%COMP%]:first-child  :not(:first-child):not(.dropdown-menu), html:not([dir=rtl])   .input-group   [_nghost-%COMP%]:first-child  :not(:first-child):not(.dropdown-menu), .input-group   html:not([dir=rtl])   [_nghost-%COMP%]:first-child  :not(:first-child):not(.dropdown-menu){margin-left:-1px;border-top-left-radius:0;border-bottom-left-radius:0}html:not([dir=rtl]).input-group   [_nghost-%COMP%]:first-child  :not(:first-child):not(.dropdown-menu):not(:only-of-type), html:not([dir=rtl])   .input-group   [_nghost-%COMP%]:first-child  :not(:first-child):not(.dropdown-menu):not(:only-of-type), .input-group   html:not([dir=rtl])   [_nghost-%COMP%]:first-child  :not(:first-child):not(.dropdown-menu):not(:only-of-type){border-top-right-radius:0;border-bottom-right-radius:0}html:not([dir=rtl]).input-group   [_nghost-%COMP%]:last-child  :first-child, html:not([dir=rtl])   .input-group   [_nghost-%COMP%]:last-child  :first-child, .input-group   html:not([dir=rtl])   [_nghost-%COMP%]:last-child  :first-child{border-top-left-radius:0;border-bottom-left-radius:0}html:not([dir=rtl]).input-group   [_nghost-%COMP%]:last-child  :first-child:not(:only-of-type), html:not([dir=rtl])   .input-group   [_nghost-%COMP%]:last-child  :first-child:not(:only-of-type), .input-group   html:not([dir=rtl])   [_nghost-%COMP%]:last-child  :first-child:not(:only-of-type){border-top-right-radius:0;border-bottom-right-radius:0}html:not([dir=rtl]).input-group   [_nghost-%COMP%]:last-child  :not(:first-child):not(.dropdown-menu), html:not([dir=rtl])   .input-group   [_nghost-%COMP%]:last-child  :not(:first-child):not(.dropdown-menu), .input-group   html:not([dir=rtl])   [_nghost-%COMP%]:last-child  :not(:first-child):not(.dropdown-menu){margin-left:-1px;border-top-left-radius:0;border-bottom-left-radius:0}[dir=rtl]   .input-group   [_nghost-%COMP%]{direction:rtl}[dir=rtl]   .input-group   [_nghost-%COMP%]:first-child  :first-child{border-top-left-radius:0;border-bottom-left-radius:0}[dir=rtl]   .input-group   [_nghost-%COMP%]:first-child  :not(:first-child):not(.dropdown-menu){margin-right:-1px;border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl]   .input-group   [_nghost-%COMP%]:first-child  :not(:first-child):not(.dropdown-menu):not(:only-of-type){border-top-left-radius:0;border-bottom-left-radius:0}[dir=rtl]   .input-group   [_nghost-%COMP%]:last-child  :first-child{border-top-right-radius:0;border-bottom-right-radius:0}[dir=rtl]   .input-group   [_nghost-%COMP%]:last-child  :first-child:not(:only-of-type){border-top-left-radius:0;border-bottom-left-radius:0}[dir=rtl]   .input-group   [_nghost-%COMP%]:last-child  :not(:first-child):not(.dropdown-menu){margin-right:-1px;border-top-right-radius:0;border-bottom-right-radius:0}"]
});
var DropdownComponent = _DropdownComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropdownComponent, [{
    type: Component,
    args: [{
      selector: "c-dropdown",
      template: "<ng-content />",
      exportAs: "cDropdown",
      providers: [DropdownService],
      standalone: true,
      hostDirectives: [{
        directive: ThemeDirective,
        inputs: ["dark"]
      }],
      styles: [":host-context(.dropdown,.dropup):not(.btn-group){display:block}:host-context(.dropstart,.dropend):not(.btn-group){display:inline-flex}:host-context(html:not([dir=rtl])) :host-context(.input-group) :host:first-child::ng-deep :first-child{border-top-right-radius:0;border-bottom-right-radius:0}:host-context(html:not([dir=rtl])) :host-context(.input-group) :host:first-child::ng-deep :not(:first-child):not(.dropdown-menu){margin-left:-1px;border-top-left-radius:0;border-bottom-left-radius:0}:host-context(html:not([dir=rtl])) :host-context(.input-group) :host:first-child::ng-deep :not(:first-child):not(.dropdown-menu):not(:only-of-type){border-top-right-radius:0;border-bottom-right-radius:0}:host-context(html:not([dir=rtl])) :host-context(.input-group) :host:last-child::ng-deep :first-child{border-top-left-radius:0;border-bottom-left-radius:0}:host-context(html:not([dir=rtl])) :host-context(.input-group) :host:last-child::ng-deep :first-child:not(:only-of-type){border-top-right-radius:0;border-bottom-right-radius:0}:host-context(html:not([dir=rtl])) :host-context(.input-group) :host:last-child::ng-deep :not(:first-child):not(.dropdown-menu){margin-left:-1px;border-top-left-radius:0;border-bottom-left-radius:0}:host-context([dir=rtl] .input-group) :host{direction:rtl}:host-context([dir=rtl] .input-group) :host:first-child::ng-deep :first-child{border-top-left-radius:0;border-bottom-left-radius:0}:host-context([dir=rtl] .input-group) :host:first-child::ng-deep :not(:first-child):not(.dropdown-menu){margin-right:-1px;border-top-right-radius:0;border-bottom-right-radius:0}:host-context([dir=rtl] .input-group) :host:first-child::ng-deep :not(:first-child):not(.dropdown-menu):not(:only-of-type){border-top-left-radius:0;border-bottom-left-radius:0}:host-context([dir=rtl] .input-group) :host:last-child::ng-deep :first-child{border-top-right-radius:0;border-bottom-right-radius:0}:host-context([dir=rtl] .input-group) :host:last-child::ng-deep :first-child:not(:only-of-type){border-top-left-radius:0;border-bottom-left-radius:0}:host-context([dir=rtl] .input-group) :host:last-child::ng-deep :not(:first-child):not(.dropdown-menu){margin-right:-1px;border-top-right-radius:0;border-bottom-right-radius:0}\n"]
    }]
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: NgZone
  }, {
    type: ChangeDetectorRef
  }, {
    type: DropdownService
  }], {
    alignment: [{
      type: Input
    }],
    autoClose: [{
      type: Input
    }],
    direction: [{
      type: Input
    }],
    placement: [{
      type: Input
    }],
    popper: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    popperOptions: [{
      type: Input
    }],
    variant: [{
      type: Input
    }],
    visible: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    visibleChange: [{
      type: Output
    }],
    _toggler: [{
      type: ContentChild,
      args: [DropdownToggleDirective]
    }],
    _menu: [{
      type: ContentChild,
      args: [DropdownMenuDirective]
    }],
    _menuElementRef: [{
      type: ContentChild,
      args: [DropdownMenuDirective, {
        read: ElementRef
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    hostStyle: [{
      type: HostBinding,
      args: ["style"]
    }],
    onHostClick: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }]
  });
})();
var _elementRef2;
var _DropdownItemDirective = class _DropdownItemDirective {
  constructor(dropdownService, dropdown) {
    __privateAdd(this, _elementRef2);
    this.dropdownService = dropdownService;
    this.dropdown = dropdown;
    this.autoClose = true;
    __privateSet(this, _elementRef2, inject(ElementRef));
    this._tabIndex = null;
  }
  focus(origin) {
    __privateGet(this, _elementRef2)?.nativeElement?.focus();
  }
  getLabel() {
    return __privateGet(this, _elementRef2)?.nativeElement?.textContent.trim();
  }
  get ariaCurrent() {
    return this.active ? "true" : null;
  }
  get hostClasses() {
    return {
      "dropdown-item": true,
      active: this.active,
      disabled: this.disabled
    };
  }
  set tabIndex(value) {
    this._tabIndex = value;
  }
  get tabIndex() {
    return this.disabled ? "-1" : this._tabIndex;
  }
  get isDisabled() {
    return this.disabled || null;
  }
  onClick($event) {
    if (this.autoClose) {
      this.dropdownService.toggle({
        visible: "toggle",
        dropdown: this.dropdown
      });
    }
  }
  onKeyUp($event) {
    if ($event.key === "Enter") {
      if (this.autoClose) {
        this.dropdownService.toggle({
          visible: false,
          dropdown: this.dropdown
        });
      }
    }
  }
};
_elementRef2 = new WeakMap();
_DropdownItemDirective.ɵfac = function DropdownItemDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DropdownItemDirective)(ɵɵdirectiveInject(DropdownService), ɵɵdirectiveInject(DropdownComponent, 8));
};
_DropdownItemDirective.ɵdir = ɵɵdefineDirective({
  type: _DropdownItemDirective,
  selectors: [["", "cDropdownItem", ""]],
  hostAttrs: [1, "dropdown-item"],
  hostVars: 5,
  hostBindings: function DropdownItemDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function DropdownItemDirective_click_HostBindingHandler($event) {
        return ctx.onClick($event);
      })("keyup", function DropdownItemDirective_keyup_HostBindingHandler($event) {
        return ctx.onKeyUp($event);
      });
    }
    if (rf & 2) {
      ɵɵattribute("aria-current", ctx.ariaCurrent)("tabindex", ctx.tabIndex)("aria-disabled", ctx.isDisabled);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    active: "active",
    autoClose: "autoClose",
    disabled: "disabled",
    tabIndex: "tabIndex"
  },
  exportAs: ["cDropdownItem"],
  standalone: true
});
var DropdownItemDirective = _DropdownItemDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropdownItemDirective, [{
    type: Directive,
    args: [{
      selector: "[cDropdownItem]",
      exportAs: "cDropdownItem",
      standalone: true,
      host: {
        class: "dropdown-item"
      }
    }]
  }], () => [{
    type: DropdownService
  }, {
    type: DropdownComponent,
    decorators: [{
      type: Optional
    }]
  }], {
    active: [{
      type: Input
    }],
    autoClose: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }],
    ariaCurrent: [{
      type: HostBinding,
      args: ["attr.aria-current"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    tabIndex: [{
      type: HostBinding,
      args: ["attr.tabindex"]
    }, {
      type: Input
    }],
    isDisabled: [{
      type: HostBinding,
      args: ["attr.aria-disabled"]
    }],
    onClick: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }],
    onKeyUp: [{
      type: HostListener,
      args: ["keyup", ["$event"]]
    }]
  });
})();
var _DropdownItemPlainDirective = class _DropdownItemPlainDirective {
};
_DropdownItemPlainDirective.ɵfac = function DropdownItemPlainDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DropdownItemPlainDirective)();
};
_DropdownItemPlainDirective.ɵdir = ɵɵdefineDirective({
  type: _DropdownItemPlainDirective,
  selectors: [["", "cDropdownItemPlain", ""]],
  hostAttrs: [1, "dropdown-item-text"],
  standalone: true
});
var DropdownItemPlainDirective = _DropdownItemPlainDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropdownItemPlainDirective, [{
    type: Directive,
    args: [{
      selector: "[cDropdownItemPlain]",
      standalone: true,
      host: {
        class: "dropdown-item-text"
      }
    }]
  }], null, null);
})();
var _DropdownCloseDirective = class _DropdownCloseDirective {
  constructor(dropdownService, dropdown) {
    this.dropdownService = dropdownService;
    this.dropdown = dropdown;
    this._tabIndex = null;
  }
  ngAfterViewInit() {
    if (this.dropdownComponent) {
      this.dropdown = this.dropdownComponent;
      this.dropdownService = this.dropdownComponent?.dropdownService;
    }
  }
  get hostClasses() {
    return {
      disabled: this.disabled
    };
  }
  set tabIndex(value) {
    this._tabIndex = value;
  }
  get tabIndex() {
    return this.disabled ? "-1" : this._tabIndex;
  }
  get isDisabled() {
    return this.disabled || null;
  }
  onClick($event) {
    !this.disabled && this.dropdownService.toggle({
      visible: false,
      dropdown: this.dropdown
    });
  }
  onKeyUp($event) {
    if ($event.key === "Enter") {
      !this.disabled && this.dropdownService.toggle({
        visible: false,
        dropdown: this.dropdown
      });
    }
  }
};
_DropdownCloseDirective.ɵfac = function DropdownCloseDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DropdownCloseDirective)(ɵɵdirectiveInject(DropdownService), ɵɵdirectiveInject(DropdownComponent, 8));
};
_DropdownCloseDirective.ɵdir = ɵɵdefineDirective({
  type: _DropdownCloseDirective,
  selectors: [["", "cDropdownClose", ""]],
  hostVars: 4,
  hostBindings: function DropdownCloseDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function DropdownCloseDirective_click_HostBindingHandler($event) {
        return ctx.onClick($event);
      })("keyup", function DropdownCloseDirective_keyup_HostBindingHandler($event) {
        return ctx.onKeyUp($event);
      });
    }
    if (rf & 2) {
      ɵɵattribute("tabindex", ctx.tabIndex)("aria-disabled", ctx.isDisabled);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    disabled: "disabled",
    dropdownComponent: "dropdownComponent",
    tabIndex: "tabIndex"
  },
  exportAs: ["cDropdownClose"],
  standalone: true
});
var DropdownCloseDirective = _DropdownCloseDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropdownCloseDirective, [{
    type: Directive,
    args: [{
      selector: "[cDropdownClose]",
      exportAs: "cDropdownClose",
      standalone: true
    }]
  }], () => [{
    type: DropdownService
  }, {
    type: DropdownComponent,
    decorators: [{
      type: Optional
    }]
  }], {
    disabled: [{
      type: Input
    }],
    dropdownComponent: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    tabIndex: [{
      type: HostBinding,
      args: ["attr.tabindex"]
    }, {
      type: Input
    }],
    isDisabled: [{
      type: HostBinding,
      args: ["attr.aria-disabled"]
    }],
    onClick: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }],
    onKeyUp: [{
      type: HostListener,
      args: ["keyup", ["$event"]]
    }]
  });
})();
var _DropdownModule = class _DropdownModule {
};
_DropdownModule.ɵfac = function DropdownModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DropdownModule)();
};
_DropdownModule.ɵmod = ɵɵdefineNgModule({
  type: _DropdownModule,
  imports: [DropdownComponent, DropdownCloseDirective, DropdownDividerDirective, DropdownHeaderDirective, DropdownItemDirective, DropdownItemPlainDirective, DropdownMenuDirective, DropdownToggleDirective],
  exports: [DropdownComponent, DropdownCloseDirective, DropdownDividerDirective, DropdownHeaderDirective, DropdownItemDirective, DropdownItemPlainDirective, DropdownMenuDirective, DropdownToggleDirective]
});
_DropdownModule.ɵinj = ɵɵdefineInjector({
  providers: [DropdownService]
});
var DropdownModule = _DropdownModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DropdownModule, [{
    type: NgModule,
    args: [{
      imports: [DropdownComponent, DropdownCloseDirective, DropdownDividerDirective, DropdownHeaderDirective, DropdownItemDirective, DropdownItemPlainDirective, DropdownMenuDirective, DropdownToggleDirective],
      exports: [DropdownComponent, DropdownCloseDirective, DropdownDividerDirective, DropdownHeaderDirective, DropdownItemDirective, DropdownItemPlainDirective, DropdownMenuDirective, DropdownToggleDirective],
      providers: [DropdownService]
    }]
  }], null, null);
})();
var _FooterComponent = class _FooterComponent {
  constructor() {
    this.position = input();
    this.role = input("contentinfo");
    this.hostClasses = computed(() => {
      return {
        footer: true,
        [`footer-${this.position()}`]: !!this.position()
      };
    });
  }
};
_FooterComponent.ɵfac = function FooterComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FooterComponent)();
};
_FooterComponent.ɵcmp = ɵɵdefineComponent({
  type: _FooterComponent,
  selectors: [["c-footer"], ["", "cFooter", ""]],
  hostAttrs: [1, "footer"],
  hostVars: 3,
  hostBindings: function FooterComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    position: [1, "position"],
    role: [1, "role"]
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function FooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var FooterComponent = _FooterComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FooterComponent, [{
    type: Component,
    args: [{
      selector: "c-footer, [cFooter]",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "footer",
        "[class]": "hostClasses()",
        "[attr.role]": "role()"
      }
    }]
  }], null, null);
})();
var _FooterModule = class _FooterModule {
};
_FooterModule.ɵfac = function FooterModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FooterModule)();
};
_FooterModule.ɵmod = ɵɵdefineNgModule({
  type: _FooterModule,
  imports: [FooterComponent],
  exports: [FooterComponent]
});
_FooterModule.ɵinj = ɵɵdefineInjector({});
var FooterModule = _FooterModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FooterModule, [{
    type: NgModule,
    args: [{
      imports: [FooterComponent],
      exports: [FooterComponent]
    }]
  }], null, null);
})();
var _FormDirective = class _FormDirective {
  constructor() {
    this.validated = false;
  }
  get hostClasses() {
    return {
      "was-validated": this.validated
    };
  }
};
_FormDirective.ɵfac = function FormDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormDirective)();
};
_FormDirective.ɵdir = ɵɵdefineDirective({
  type: _FormDirective,
  selectors: [["form", "cForm", ""]],
  hostVars: 2,
  hostBindings: function FormDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    validated: [2, "validated", "validated", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var FormDirective = _FormDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormDirective, [{
    type: Directive,
    args: [{
      selector: "form[cForm]",
      standalone: true
    }]
  }], null, {
    validated: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _FormFeedbackComponent = class _FormFeedbackComponent {
  constructor() {
    this.tooltip = false;
  }
  get hostClasses() {
    return {
      "valid-feedback": this.valid === true && !this.tooltip,
      "valid-tooltip": this.valid === true && this.tooltip,
      "invalid-feedback": this.valid !== true && !this.tooltip,
      "invalid-tooltip": this.valid !== true && this.tooltip
    };
  }
};
_FormFeedbackComponent.ɵfac = function FormFeedbackComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormFeedbackComponent)();
};
_FormFeedbackComponent.ɵcmp = ɵɵdefineComponent({
  type: _FormFeedbackComponent,
  selectors: [["c-form-feedback"]],
  hostVars: 2,
  hostBindings: function FormFeedbackComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    tooltip: [2, "tooltip", "tooltip", booleanAttribute],
    valid: "valid"
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function FormFeedbackComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var FormFeedbackComponent = _FormFeedbackComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormFeedbackComponent, [{
    type: Component,
    args: [{
      selector: "c-form-feedback",
      template: "<ng-content />",
      standalone: true
    }]
  }], null, {
    tooltip: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    valid: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _InputGroupComponent = class _InputGroupComponent {
  constructor() {
    this.sizing = input("");
    this.hostClasses = computed(() => {
      const sizing = this.sizing();
      return {
        "input-group": true,
        [`input-group-${sizing}`]: !!sizing
      };
    });
  }
};
_InputGroupComponent.ɵfac = function InputGroupComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _InputGroupComponent)();
};
_InputGroupComponent.ɵcmp = ɵɵdefineComponent({
  type: _InputGroupComponent,
  selectors: [["c-input-group"]],
  hostAttrs: [1, "input-group"],
  hostVars: 2,
  hostBindings: function InputGroupComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    sizing: [1, "sizing"]
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function InputGroupComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var InputGroupComponent = _InputGroupComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputGroupComponent, [{
    type: Component,
    args: [{
      selector: "c-input-group",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "input-group",
        "[class]": "hostClasses()"
      }
    }]
  }], null, null);
})();
var _FormSelectDirective = class _FormSelectDirective {
  constructor() {
    this.sizing = "";
  }
  get hostClasses() {
    return {
      "form-select": true,
      [`form-select-${this.sizing}`]: !!this.sizing,
      "is-valid": this.valid === true,
      "is-invalid": this.valid === false
    };
  }
};
_FormSelectDirective.ɵfac = function FormSelectDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormSelectDirective)();
};
_FormSelectDirective.ɵdir = ɵɵdefineDirective({
  type: _FormSelectDirective,
  selectors: [["select", "cSelect", ""]],
  hostAttrs: [1, "form-select"],
  hostVars: 2,
  hostBindings: function FormSelectDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    sizing: "sizing",
    valid: "valid"
  },
  standalone: true
});
var FormSelectDirective = _FormSelectDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormSelectDirective, [{
    type: Directive,
    args: [{
      selector: "select[cSelect]",
      standalone: true,
      host: {
        class: "form-select"
      }
    }]
  }], null, {
    sizing: [{
      type: Input
    }],
    valid: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _FormLabelDirective = class _FormLabelDirective {
  constructor() {
    this.col = "";
    this.sizing = "";
  }
  get hostClasses() {
    return {
      "form-label": true,
      "col-form-label": this.col === "col",
      [`col-form-label-${this.sizing}`]: !!this.sizing && this.col === "col"
    };
  }
};
_FormLabelDirective.ɵfac = function FormLabelDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormLabelDirective)();
};
_FormLabelDirective.ɵdir = ɵɵdefineDirective({
  type: _FormLabelDirective,
  selectors: [["", "cLabel", ""]],
  hostAttrs: [1, "form-label"],
  hostVars: 2,
  hostBindings: function FormLabelDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    col: [0, "cLabel", "col"],
    sizing: "sizing"
  },
  standalone: true
});
var FormLabelDirective = _FormLabelDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormLabelDirective, [{
    type: Directive,
    args: [{
      selector: "[cLabel]",
      standalone: true,
      host: {
        class: "form-label"
      }
    }]
  }], null, {
    col: [{
      type: Input,
      args: ["cLabel"]
    }],
    sizing: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _FormCheckLabelDirective = class _FormCheckLabelDirective {
};
_FormCheckLabelDirective.ɵfac = function FormCheckLabelDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormCheckLabelDirective)();
};
_FormCheckLabelDirective.ɵdir = ɵɵdefineDirective({
  type: _FormCheckLabelDirective,
  selectors: [["label", "cFormCheckLabel", ""]],
  hostAttrs: [1, "form-check-label"],
  standalone: true
});
var FormCheckLabelDirective = _FormCheckLabelDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormCheckLabelDirective, [{
    type: Directive,
    args: [{
      selector: "label[cFormCheckLabel]",
      standalone: true,
      host: {
        class: "form-check-label"
      }
    }]
  }], null, null);
})();
var _formCheckClass;
var _FormCheckComponent = class _FormCheckComponent {
  constructor() {
    __privateAdd(this, _formCheckClass);
    this.inline = false;
    this.reverse = false;
    this.sizing = "";
    this.switch = false;
    __privateSet(this, _formCheckClass, true);
  }
  get hostClasses() {
    return {
      "form-check": this.formCheckClass,
      "form-switch": this.switch,
      [`form-switch-${this.sizing}`]: this.switch && !!this.sizing,
      "form-check-inline": this.inline,
      "form-check-reverse": this.reverse
    };
  }
  get formCheckClass() {
    return __privateGet(this, _formCheckClass);
  }
  ngAfterContentInit() {
    __privateSet(this, _formCheckClass, !!this.formCheckLabel);
  }
};
_formCheckClass = new WeakMap();
_FormCheckComponent.ɵfac = function FormCheckComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormCheckComponent)();
};
_FormCheckComponent.ɵcmp = ɵɵdefineComponent({
  type: _FormCheckComponent,
  selectors: [["c-form-check"]],
  contentQueries: function FormCheckComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, FormCheckLabelDirective, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.formCheckLabel = _t.first);
    }
  },
  hostVars: 2,
  hostBindings: function FormCheckComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    inline: [2, "inline", "inline", booleanAttribute],
    reverse: [2, "reverse", "reverse", booleanAttribute],
    sizing: "sizing",
    switch: [2, "switch", "switch", booleanAttribute]
  },
  exportAs: ["cFormCheck"],
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function FormCheckComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var FormCheckComponent = _FormCheckComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormCheckComponent, [{
    type: Component,
    args: [{
      selector: "c-form-check",
      template: "<ng-content />",
      exportAs: "cFormCheck",
      standalone: true
    }]
  }], null, {
    inline: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    reverse: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    sizing: [{
      type: Input
    }],
    switch: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    formCheckLabel: [{
      type: ContentChild,
      args: [FormCheckLabelDirective]
    }]
  });
})();
var _FormCheckInputDirective = class _FormCheckInputDirective {
  /**
   * Set component indeterminate state.
   * @type boolean
   * @default false
   */
  set indeterminate(value) {
    const indeterminate = value;
    if (this._indeterminate !== indeterminate) {
      this._indeterminate = indeterminate;
      const htmlInputElement = this.hostElement.nativeElement;
      if (indeterminate) {
        this.renderer.setProperty(htmlInputElement, "checked", false);
      }
      this.renderer.setProperty(htmlInputElement, "indeterminate", indeterminate);
    }
  }
  get indeterminate() {
    return this._indeterminate;
  }
  get hostClasses() {
    return {
      "form-check-input": true,
      "is-valid": this.valid === true,
      "is-invalid": this.valid === false
    };
  }
  set checked(value) {
    const checked = value;
    const htmlInputElement = this.hostElement?.nativeElement;
    if (htmlInputElement) {
      this.renderer.setProperty(htmlInputElement, "checked", checked);
    }
  }
  get checked() {
    return this.hostElement?.nativeElement?.checked;
  }
  constructor(renderer, hostElement) {
    this.renderer = renderer;
    this.hostElement = hostElement;
    this.type = "checkbox";
    this._indeterminate = false;
  }
};
_FormCheckInputDirective.ɵfac = function FormCheckInputDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormCheckInputDirective)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef));
};
_FormCheckInputDirective.ɵdir = ɵɵdefineDirective({
  type: _FormCheckInputDirective,
  selectors: [["input", "cFormCheckInput", ""]],
  hostAttrs: [1, "form-check-input"],
  hostVars: 3,
  hostBindings: function FormCheckInputDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("type", ctx.type);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    type: "type",
    indeterminate: [2, "indeterminate", "indeterminate", booleanAttribute],
    valid: "valid",
    checked: [2, "checked", "checked", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var FormCheckInputDirective = _FormCheckInputDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormCheckInputDirective, [{
    type: Directive,
    args: [{
      selector: "input[cFormCheckInput]",
      standalone: true,
      host: {
        class: "form-check-input"
      }
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }], {
    type: [{
      type: HostBinding,
      args: ["attr.type"]
    }, {
      type: Input
    }],
    indeterminate: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    valid: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    checked: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var _FormControlDirective = class _FormControlDirective {
  constructor(hostElement) {
    this.hostElement = hostElement;
    this.sizing = "";
    this.type = "text";
    this.plaintext = false;
  }
  get hostClasses() {
    const isRangeType = this.type === "range";
    return {
      "form-control": !isRangeType && !this.plaintext,
      "form-control-plaintext": !isRangeType && this.plaintext,
      "form-control-color": this.type === "color",
      "form-range": isRangeType,
      [`form-control-${this.sizing}`]: !!this.sizing && !isRangeType,
      "is-valid": this.valid === true,
      "is-invalid": this.valid === false
    };
  }
  get hostTag() {
    return this.hostElement.nativeElement.tagName;
  }
  ngOnInit() {
    const hostTag = this.hostTag.toLowerCase();
    if (hostTag !== "input" && hostTag !== "textarea") {
      console.warn(`CoreUI [cFormControl] works with '<input>' and '<textarea>' - not with '<${hostTag}>'`);
    }
  }
};
_FormControlDirective.ɵfac = function FormControlDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormControlDirective)(ɵɵdirectiveInject(ElementRef));
};
_FormControlDirective.ɵdir = ɵɵdefineDirective({
  type: _FormControlDirective,
  selectors: [["input", "cFormControl", ""], ["textarea", "cFormControl", ""]],
  hostVars: 3,
  hostBindings: function FormControlDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("type", ctx.type);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    sizing: "sizing",
    valid: "valid",
    type: "type",
    plaintext: [2, "plaintext", "plaintext", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var FormControlDirective = _FormControlDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormControlDirective, [{
    type: Directive,
    args: [{
      selector: "input[cFormControl], textarea[cFormControl]",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }], {
    sizing: [{
      type: Input
    }],
    valid: [{
      type: Input
    }],
    type: [{
      type: HostBinding,
      args: ["attr.type"]
    }, {
      type: Input
    }],
    plaintext: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _FormTextDirective = class _FormTextDirective {
};
_FormTextDirective.ɵfac = function FormTextDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormTextDirective)();
};
_FormTextDirective.ɵdir = ɵɵdefineDirective({
  type: _FormTextDirective,
  selectors: [["", "cFormText", ""]],
  hostAttrs: [1, "form-text"],
  standalone: true
});
var FormTextDirective = _FormTextDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormTextDirective, [{
    type: Directive,
    args: [{
      selector: "[cFormText]",
      standalone: true,
      host: {
        class: "form-text"
      }
    }]
  }], null, null);
})();
var _FormFloatingDirective = class _FormFloatingDirective {
  constructor() {
    this.floating = true;
  }
  get hostClasses() {
    return {
      "form-floating": this.floating
    };
  }
};
_FormFloatingDirective.ɵfac = function FormFloatingDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormFloatingDirective)();
};
_FormFloatingDirective.ɵdir = ɵɵdefineDirective({
  type: _FormFloatingDirective,
  selectors: [["", "cFormFloating", ""]],
  hostVars: 2,
  hostBindings: function FormFloatingDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    floating: [2, "cFormFloating", "floating", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var FormFloatingDirective = _FormFloatingDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormFloatingDirective, [{
    type: Directive,
    args: [{
      selector: "[cFormFloating]",
      standalone: true
    }]
  }], null, {
    floating: [{
      type: Input,
      args: [{
        alias: "cFormFloating",
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _InputGroupTextDirective = class _InputGroupTextDirective {
};
_InputGroupTextDirective.ɵfac = function InputGroupTextDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _InputGroupTextDirective)();
};
_InputGroupTextDirective.ɵdir = ɵɵdefineDirective({
  type: _InputGroupTextDirective,
  selectors: [["", "cInputGroupText", ""]],
  hostAttrs: [1, "input-group-text"],
  standalone: true
});
var InputGroupTextDirective = _InputGroupTextDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(InputGroupTextDirective, [{
    type: Directive,
    args: [{
      selector: "[cInputGroupText]",
      standalone: true,
      host: {
        class: "input-group-text"
      }
    }]
  }], null, null);
})();
var _FormModule = class _FormModule {
};
_FormModule.ɵfac = function FormModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _FormModule)();
};
_FormModule.ɵmod = ɵɵdefineNgModule({
  type: _FormModule,
  imports: [FormDirective, FormCheckComponent, FormCheckLabelDirective, FormCheckInputDirective, FormControlDirective, FormFeedbackComponent, FormFloatingDirective, FormLabelDirective, FormSelectDirective, FormTextDirective, InputGroupComponent, InputGroupTextDirective],
  exports: [FormDirective, FormCheckComponent, FormCheckLabelDirective, FormCheckInputDirective, FormControlDirective, FormFeedbackComponent, FormFloatingDirective, FormLabelDirective, FormSelectDirective, FormTextDirective, InputGroupComponent, InputGroupTextDirective]
});
_FormModule.ɵinj = ɵɵdefineInjector({});
var FormModule = _FormModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(FormModule, [{
    type: NgModule,
    args: [{
      imports: [FormDirective, FormCheckComponent, FormCheckLabelDirective, FormCheckInputDirective, FormControlDirective, FormFeedbackComponent, FormFloatingDirective, FormLabelDirective, FormSelectDirective, FormTextDirective, InputGroupComponent, InputGroupTextDirective],
      exports: [FormDirective, FormCheckComponent, FormCheckLabelDirective, FormCheckInputDirective, FormControlDirective, FormFeedbackComponent, FormFloatingDirective, FormLabelDirective, FormSelectDirective, FormTextDirective, InputGroupComponent, InputGroupTextDirective]
    }]
  }], null, null);
})();
var _ContainerComponent = class _ContainerComponent {
  constructor() {
    this.breakpoint = input("");
    this.fluid = input(false, {
      transform: booleanAttribute
    });
    this.hostClasses = computed(() => {
      const breakpoint = this.breakpoint();
      const fluid = this.fluid();
      return {
        container: !fluid && !breakpoint,
        "container-fluid": !!fluid,
        [`container-${breakpoint}`]: !!breakpoint
      };
    });
  }
};
_ContainerComponent.ɵfac = function ContainerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ContainerComponent)();
};
_ContainerComponent.ɵcmp = ɵɵdefineComponent({
  type: _ContainerComponent,
  selectors: [["c-container"], ["", "cContainer", ""]],
  hostVars: 2,
  hostBindings: function ContainerComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    breakpoint: [1, "breakpoint"],
    fluid: [1, "fluid"]
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ContainerComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var ContainerComponent = _ContainerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContainerComponent, [{
    type: Component,
    args: [{
      selector: "c-container, [cContainer]",
      template: "<ng-content />",
      standalone: true,
      host: {
        "[class]": "hostClasses()"
      },
      styles: [":host{display:block}\n"]
    }]
  }], null, null);
})();
var _ColDirective = class _ColDirective {
  constructor() {
    this._xs = false;
    this._sm = false;
    this._md = false;
    this._lg = false;
    this._xl = false;
    this._xxl = false;
  }
  /**
   * The number of columns/offset/order on extra small devices (<576px).
   * @type { 'auto' | number |  boolean }
   */
  set cCol(value) {
    this.xs = this.xs || this.coerceInput(value);
  }
  set xs(value) {
    this._xs = this.coerceInput(value);
  }
  get xs() {
    return this._xs;
  }
  /**
   * The number of columns/offset/order on small devices (<768px).
   * @type { 'auto' | number |  boolean }
   */
  set sm(value) {
    this._sm = this.coerceInput(value);
  }
  get sm() {
    return this._sm;
  }
  /**
   * The number of columns/offset/order on medium devices (<992px).
   * @type { 'auto' | number |  boolean }
   */
  set md(value) {
    this._md = this.coerceInput(value);
  }
  get md() {
    return this._md;
  }
  /**
   * The number of columns/offset/order on large devices (<1200px).
   * @type { 'auto' | number |  boolean }
   */
  set lg(value) {
    this._lg = this.coerceInput(value);
  }
  get lg() {
    return this._lg;
  }
  /**
   * The number of columns/offset/order on X-Large devices (<1400px).
   * @type { 'auto' | number |  boolean }
   */
  set xl(value) {
    this._xl = this.coerceInput(value);
  }
  get xl() {
    return this._xl;
  }
  /**
   * The number of columns/offset/order on XX-Large devices (≥1400px).
   * @type { 'auto' | number |  boolean }
   */
  set xxl(value) {
    this._xxl = this.coerceInput(value);
  }
  get xxl() {
    return this._xxl;
  }
  get hostClasses() {
    const classes = {
      col: true
    };
    Object.keys(BreakpointInfix).forEach((breakpoint) => {
      const value = this[breakpoint];
      const infix = breakpoint === "xs" ? "" : `-${breakpoint}`;
      classes[`col${infix}`] = value === true;
      classes[`col${infix}-${value}`] = typeof value === "number" || typeof value === "string";
    });
    if (typeof this.offset === "object") {
      const offset2 = __spreadValues({}, this.offset);
      Object.entries(offset2).forEach((entry) => {
        const [breakpoint, value] = [...entry];
        const infix = breakpoint === "xs" ? "" : `-${breakpoint}`;
        classes[`offset${infix}-${value}`] = value >= 0 && value <= 11;
      });
    } else {
      classes[`offset-${this.offset}`] = typeof this.offset === "number" && this.offset > 0 && this.offset <= 11;
    }
    if (typeof this.order === "object") {
      const order2 = __spreadValues({}, this.order);
      Object.entries(order2).forEach((entry) => {
        const [breakpoint, value] = [...entry];
        const infix = breakpoint === "xs" ? "" : `-${breakpoint}`;
        classes[`order${infix}-${value}`] = value;
      });
    } else {
      classes[`order-${this.order}`] = !!this.order;
    }
    classes.col = !Object.entries(classes).filter((i) => i[0].startsWith("col-") && i[1]).length || this.xs === true;
    return classes;
  }
  coerceInput(value) {
    if (value === "auto") {
      return value;
    }
    if (value === "" || value === void 0 || value === null) {
      return coerceBooleanProperty(value);
    }
    if (typeof value === "boolean") {
      return value;
    }
    return coerceNumberProperty(value);
  }
};
_ColDirective.ɵfac = function ColDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ColDirective)();
};
_ColDirective.ɵdir = ɵɵdefineDirective({
  type: _ColDirective,
  selectors: [["", "cCol", ""]],
  hostVars: 2,
  hostBindings: function ColDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    cCol: "cCol",
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
    xxl: "xxl",
    offset: "offset",
    order: "order"
  },
  standalone: true
});
var ColDirective = _ColDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ColDirective, [{
    type: Directive,
    args: [{
      selector: "[cCol]",
      standalone: true
    }]
  }], null, {
    cCol: [{
      type: Input
    }],
    xs: [{
      type: Input
    }],
    sm: [{
      type: Input
    }],
    md: [{
      type: Input
    }],
    lg: [{
      type: Input
    }],
    xl: [{
      type: Input
    }],
    xxl: [{
      type: Input
    }],
    offset: [{
      type: Input
    }],
    order: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _ColComponent = class _ColComponent extends ColDirective {
};
_ColComponent.ɵfac = /* @__PURE__ */ (() => {
  let ɵColComponent_BaseFactory;
  return function ColComponent_Factory(__ngFactoryType__) {
    return (ɵColComponent_BaseFactory || (ɵColComponent_BaseFactory = ɵɵgetInheritedFactory(_ColComponent)))(__ngFactoryType__ || _ColComponent);
  };
})();
_ColComponent.ɵcmp = ɵɵdefineComponent({
  type: _ColComponent,
  selectors: [["c-col"]],
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ColComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var ColComponent = _ColComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ColComponent, [{
    type: Component,
    args: [{
      selector: "c-col",
      template: "<ng-content />",
      standalone: true,
      styles: [":host{display:block}\n"]
    }]
  }], null, null);
})();
var _RowDirective = class _RowDirective {
  get hostClasses() {
    const cols = this.xs;
    const classes = {
      row: true,
      [`row-cols-${cols}`]: !!cols
    };
    Object.keys(BreakpointInfix).forEach((breakpoint) => {
      const value = this[breakpoint];
      if (typeof value === "number" || typeof value === "string") {
        const infix = breakpoint === "xs" ? "" : `-${breakpoint}`;
        classes[`row-cols${infix}-${value}`] = !!value;
      }
    });
    return classes;
  }
};
_RowDirective.ɵfac = function RowDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _RowDirective)();
};
_RowDirective.ɵdir = ɵɵdefineDirective({
  type: _RowDirective,
  selectors: [["", "cRow", ""]],
  hostAttrs: [1, "row"],
  hostVars: 2,
  hostBindings: function RowDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    xs: "xs",
    sm: "sm",
    md: "md",
    lg: "lg",
    xl: "xl",
    xxl: "xxl"
  },
  standalone: true
});
var RowDirective = _RowDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RowDirective, [{
    type: Directive,
    args: [{
      selector: "[cRow]",
      standalone: true,
      host: {
        class: "row"
      }
    }]
  }], null, {
    xs: [{
      type: Input
    }],
    sm: [{
      type: Input
    }],
    md: [{
      type: Input
    }],
    lg: [{
      type: Input
    }],
    xl: [{
      type: Input
    }],
    xxl: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _RowComponent = class _RowComponent extends RowDirective {
};
_RowComponent.ɵfac = /* @__PURE__ */ (() => {
  let ɵRowComponent_BaseFactory;
  return function RowComponent_Factory(__ngFactoryType__) {
    return (ɵRowComponent_BaseFactory || (ɵRowComponent_BaseFactory = ɵɵgetInheritedFactory(_RowComponent)))(__ngFactoryType__ || _RowComponent);
  };
})();
_RowComponent.ɵcmp = ɵɵdefineComponent({
  type: _RowComponent,
  selectors: [["c-row"]],
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function RowComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var RowComponent = _RowComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(RowComponent, [{
    type: Component,
    args: [{
      selector: "c-row",
      template: "<ng-content />",
      standalone: true
    }]
  }], null, null);
})();
var _GutterDirective = class _GutterDirective {
  constructor() {
    this.gutter = {};
  }
  get hostClasses() {
    let gutterClass;
    if (typeof this.gutter === "number") {
      gutterClass = _GutterDirective.getGutterClasses({
        g: this.gutter
      });
      return gutterClass;
    }
    {
      const {
        g,
        gx,
        gy
      } = __spreadValues({}, this.gutter);
      gutterClass = _GutterDirective.getGutterClasses({
        g,
        gx,
        gy
      });
    }
    Object.keys(BreakpointInfix).forEach((key) => {
      const gutter = this.gutter[key] ? __spreadValues({}, this.gutter[key]) : void 0;
      if (gutter) {
        const classes = _GutterDirective.getGutterClasses(gutter, key);
        gutterClass = __spreadValues(__spreadValues({}, gutterClass), classes);
      }
    });
    return gutterClass;
  }
  static getGutterClasses(gutter, breakpoint) {
    const {
      g,
      gx,
      gy
    } = __spreadValues({}, gutter);
    const infix = breakpoint ? `-${breakpoint}` : "";
    return {
      [`g${infix}-${g}`]: typeof g === "number",
      [`gx${infix}-${gx}`]: typeof gx === "number",
      [`gy${infix}-${gy}`]: typeof gy === "number"
    };
  }
};
_GutterDirective.ɵfac = function GutterDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _GutterDirective)();
};
_GutterDirective.ɵdir = ɵɵdefineDirective({
  type: _GutterDirective,
  selectors: [["", "gutter", ""]],
  hostVars: 2,
  hostBindings: function GutterDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    gutter: "gutter"
  },
  standalone: true
});
var GutterDirective = _GutterDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GutterDirective, [{
    type: Directive,
    args: [{
      // eslint-disable-next-line @angular-eslint/directive-selector
      selector: "[gutter]",
      standalone: true
    }]
  }], null, {
    gutter: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _GridModule = class _GridModule {
};
_GridModule.ɵfac = function GridModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _GridModule)();
};
_GridModule.ɵmod = ɵɵdefineNgModule({
  type: _GridModule,
  imports: [ColComponent, ColDirective, ContainerComponent, GutterDirective, RowComponent, RowDirective],
  exports: [ColComponent, ColDirective, ContainerComponent, GutterDirective, RowComponent, RowDirective]
});
_GridModule.ɵinj = ɵɵdefineInjector({});
var GridModule = _GridModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GridModule, [{
    type: NgModule,
    args: [{
      imports: [ColComponent, ColDirective, ContainerComponent, GutterDirective, RowComponent, RowDirective],
      exports: [ColComponent, ColDirective, ContainerComponent, GutterDirective, RowComponent, RowDirective]
    }]
  }], null, null);
})();
var _HeaderComponent = class _HeaderComponent {
  constructor() {
    this.container = input();
    this.position = input();
    this.role = input("banner");
    this.hostClasses = computed(() => {
      return !!this.container() ? this.containerClasses() : this.headerClasses();
    });
    this.headerClasses = computed(() => {
      const position = this.position();
      return {
        header: true,
        [`header-${position}`]: !!position
      };
    });
    this.containerClasses = computed(() => {
      const container = this.container();
      return {
        container: container === true,
        [`container-${container}`]: typeof container === "string"
      };
    });
  }
};
_HeaderComponent.ɵfac = function HeaderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HeaderComponent)();
};
_HeaderComponent.ɵcmp = ɵɵdefineComponent({
  type: _HeaderComponent,
  selectors: [["c-header"], ["", "c-header", ""]],
  hostVars: 3,
  hostBindings: function HeaderComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    container: [1, "container"],
    position: [1, "position"],
    role: [1, "role"]
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c1,
  decls: 2,
  vars: 1,
  consts: [[3, "ngClass"]],
  template: function HeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef(_c1);
      ɵɵtemplate(0, HeaderComponent_Conditional_0_Template, 2, 1, "div", 0)(1, HeaderComponent_Conditional_1_Template, 1, 0);
    }
    if (rf & 2) {
      ɵɵconditional(!!ctx.container() ? 0 : 1);
    }
  },
  dependencies: [NgClass],
  encapsulation: 2
});
var HeaderComponent = _HeaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderComponent, [{
    type: Component,
    args: [{
      selector: "c-header, [c-header]",
      standalone: true,
      imports: [NgClass],
      host: {
        "[attr.role]": "role()",
        "[class]": "hostClasses()"
      },
      template: '@if (!!container()) {\n  <div [ngClass]="headerClasses()">\n    <ng-content />\n  </div>\n} @else {\n  <ng-content />\n}\n'
    }]
  }], null, null);
})();
var _HeaderBrandComponent = class _HeaderBrandComponent {
  constructor() {
    this.role = "button";
    this.headerBrandClass = true;
  }
};
_HeaderBrandComponent.ɵfac = function HeaderBrandComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HeaderBrandComponent)();
};
_HeaderBrandComponent.ɵcmp = ɵɵdefineComponent({
  type: _HeaderBrandComponent,
  selectors: [["c-header-brand"]],
  hostVars: 3,
  hostBindings: function HeaderBrandComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role);
      ɵɵclassProp("header-brand", ctx.headerBrandClass);
    }
  },
  inputs: {
    role: "role"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function HeaderBrandComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var HeaderBrandComponent = _HeaderBrandComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderBrandComponent, [{
    type: Component,
    args: [{
      selector: "c-header-brand",
      template: "<ng-content />",
      standalone: true
    }]
  }], null, {
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }, {
      type: Input
    }],
    headerBrandClass: [{
      type: HostBinding,
      args: ["class.header-brand"]
    }]
  });
})();
var _HeaderDividerComponent = class _HeaderDividerComponent {
  constructor() {
    this.headerDividerClass = true;
  }
};
_HeaderDividerComponent.ɵfac = function HeaderDividerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HeaderDividerComponent)();
};
_HeaderDividerComponent.ɵcmp = ɵɵdefineComponent({
  type: _HeaderDividerComponent,
  selectors: [["c-header-divider"], ["", "cHeaderDivider", ""]],
  hostVars: 2,
  hostBindings: function HeaderDividerComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassProp("header-divider", ctx.headerDividerClass);
    }
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  decls: 0,
  vars: 0,
  template: function HeaderDividerComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
var HeaderDividerComponent = _HeaderDividerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderDividerComponent, [{
    type: Component,
    args: [{
      selector: "c-header-divider, [cHeaderDivider]",
      template: ``,
      standalone: true
    }]
  }], null, {
    headerDividerClass: [{
      type: HostBinding,
      args: ["class.header-divider"]
    }]
  });
})();
var _HeaderNavComponent = class _HeaderNavComponent {
  constructor() {
    this.role = "navigation";
    this.headerNavClass = true;
  }
};
_HeaderNavComponent.ɵfac = function HeaderNavComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HeaderNavComponent)();
};
_HeaderNavComponent.ɵcmp = ɵɵdefineComponent({
  type: _HeaderNavComponent,
  selectors: [["c-header-nav"]],
  hostVars: 3,
  hostBindings: function HeaderNavComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role);
      ɵɵclassProp("header-nav", ctx.headerNavClass);
    }
  },
  inputs: {
    role: "role"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function HeaderNavComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  }
});
var HeaderNavComponent = _HeaderNavComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderNavComponent, [{
    type: Component,
    args: [{
      selector: "c-header-nav",
      template: "<ng-content />",
      standalone: true
    }]
  }], null, {
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }, {
      type: Input
    }],
    headerNavClass: [{
      type: HostBinding,
      args: ["class.header-nav"]
    }]
  });
})();
var _HeaderTextComponent = class _HeaderTextComponent {
  constructor() {
    this.headerTextClass = true;
  }
};
_HeaderTextComponent.ɵfac = function HeaderTextComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HeaderTextComponent)();
};
_HeaderTextComponent.ɵcmp = ɵɵdefineComponent({
  type: _HeaderTextComponent,
  selectors: [["c-header-text"], ["", "cHeaderText", ""]],
  hostVars: 2,
  hostBindings: function HeaderTextComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassProp("header-text", ctx.headerTextClass);
    }
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function HeaderTextComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var HeaderTextComponent = _HeaderTextComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderTextComponent, [{
    type: Component,
    args: [{
      selector: "c-header-text, [cHeaderText]",
      template: "<ng-content />",
      standalone: true
    }]
  }], null, {
    headerTextClass: [{
      type: HostBinding,
      args: ["class.header-text"]
    }]
  });
})();
var _HeaderTogglerDirective = class _HeaderTogglerDirective {
  constructor(renderer, hostElement) {
    this.renderer = renderer;
    this.hostElement = hostElement;
    this.headerToggler = true;
    this.type = "button";
    this.ariaLabel = "Toggle navigation";
  }
  addDefaultIcon() {
    const span = this.renderer.createElement("span");
    this.renderer.addClass(span, "header-toggler-icon");
    this.renderer.appendChild(this.hostElement.nativeElement, span);
  }
  ngAfterContentInit() {
    this.hasContent = this.hostElement.nativeElement.childNodes.length > 0;
    if (!this.hasContent) {
      this.addDefaultIcon();
    }
  }
};
_HeaderTogglerDirective.ɵfac = function HeaderTogglerDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HeaderTogglerDirective)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef));
};
_HeaderTogglerDirective.ɵdir = ɵɵdefineDirective({
  type: _HeaderTogglerDirective,
  selectors: [["", "cHeaderToggler", ""]],
  hostVars: 4,
  hostBindings: function HeaderTogglerDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("type", ctx.type)("aria-label", ctx.ariaLabel);
      ɵɵclassProp("header-toggler", ctx.headerToggler);
    }
  },
  inputs: {
    type: "type",
    ariaLabel: "ariaLabel"
  },
  standalone: true
});
var HeaderTogglerDirective = _HeaderTogglerDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderTogglerDirective, [{
    type: Directive,
    args: [{
      selector: "[cHeaderToggler]",
      standalone: true
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }], {
    headerToggler: [{
      type: HostBinding,
      args: ["class.header-toggler"]
    }],
    type: [{
      type: HostBinding,
      args: ["attr.type"]
    }, {
      type: Input
    }],
    ariaLabel: [{
      type: HostBinding,
      args: ["attr.aria-label"]
    }, {
      type: Input
    }]
  });
})();
var _HeaderModule = class _HeaderModule {
};
_HeaderModule.ɵfac = function HeaderModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _HeaderModule)();
};
_HeaderModule.ɵmod = ɵɵdefineNgModule({
  type: _HeaderModule,
  imports: [HeaderComponent, HeaderBrandComponent, HeaderDividerComponent, HeaderNavComponent, HeaderTextComponent, HeaderTogglerDirective],
  exports: [HeaderComponent, HeaderBrandComponent, HeaderDividerComponent, HeaderNavComponent, HeaderTextComponent, HeaderTogglerDirective]
});
_HeaderModule.ɵinj = ɵɵdefineInjector({});
var HeaderModule = _HeaderModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(HeaderModule, [{
    type: NgModule,
    args: [{
      imports: [HeaderComponent, HeaderBrandComponent, HeaderDividerComponent, HeaderNavComponent, HeaderTextComponent, HeaderTogglerDirective],
      exports: [HeaderComponent, HeaderBrandComponent, HeaderDividerComponent, HeaderNavComponent, HeaderTextComponent, HeaderTogglerDirective]
    }]
  }], null, null);
})();
var _ImgDirective = class _ImgDirective {
  constructor() {
    this.align = input("");
    this.fluid = input(false, {
      transform: booleanAttribute
    });
    this.rounded = input(false, {
      transform: booleanAttribute
    });
    this.thumbnail = input(false, {
      transform: booleanAttribute
    });
    this.placeholderColor = input("transparent");
    this.hostStyles = computed(() => {
      return {
        backgroundColor: this.placeholderColor()
      };
    });
    this.hostClasses = computed(() => {
      const align = this.align();
      return {
        [`float-${align}`]: align === "start" || align === "end",
        "d-block": align === "center",
        "mx-auto": align === "center",
        "img-fluid": this.fluid(),
        rounded: this.rounded(),
        "img-thumbnail": this.thumbnail()
      };
    });
  }
};
_ImgDirective.ɵfac = function ImgDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ImgDirective)();
};
_ImgDirective.ɵdir = ɵɵdefineDirective({
  type: _ImgDirective,
  selectors: [["", "cImg", ""]],
  hostVars: 4,
  hostBindings: function ImgDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵstyleMap(ctx.hostStyles());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    align: [1, "align"],
    fluid: [1, "fluid"],
    rounded: [1, "rounded"],
    thumbnail: [1, "thumbnail"],
    placeholderColor: [1, "placeholderColor"]
  },
  standalone: true
});
var ImgDirective = _ImgDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImgDirective, [{
    type: Directive,
    args: [{
      selector: "[cImg]",
      standalone: true,
      host: {
        "[class]": "hostClasses()",
        "[style]": "hostStyles()"
      }
    }]
  }], null, null);
})();
var _ImgModule = class _ImgModule {
};
_ImgModule.ɵfac = function ImgModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ImgModule)();
};
_ImgModule.ɵmod = ɵɵdefineNgModule({
  type: _ImgModule,
  imports: [ImgDirective],
  exports: [ImgDirective]
});
_ImgModule.ɵinj = ɵɵdefineInjector({});
var ImgModule = _ImgModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ImgModule, [{
    type: NgModule,
    args: [{
      imports: [ImgDirective],
      exports: [ImgDirective]
    }]
  }], null, null);
})();
var _ListGroupDirective = class _ListGroupDirective {
  constructor() {
    this.flush = input(false, {
      transform: booleanAttribute
    });
    this.horizontal = input();
    this.hostClasses = computed(() => {
      const horizontal = this.horizontal();
      return {
        "list-group": true,
        "list-group-horizontal": horizontal === true || horizontal === "",
        [`list-group-horizontal-${horizontal}`]: !!horizontal && typeof horizontal !== "boolean",
        "list-group-flush": this.flush()
      };
    });
  }
};
_ListGroupDirective.ɵfac = function ListGroupDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ListGroupDirective)();
};
_ListGroupDirective.ɵdir = ɵɵdefineDirective({
  type: _ListGroupDirective,
  selectors: [["", "cListGroup", ""]],
  hostAttrs: [1, "list-group"],
  hostVars: 2,
  hostBindings: function ListGroupDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    flush: [1, "flush"],
    horizontal: [1, "horizontal"]
  },
  standalone: true
});
var ListGroupDirective = _ListGroupDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ListGroupDirective, [{
    type: Directive,
    args: [{
      selector: "[cListGroup]",
      standalone: true,
      host: {
        class: "list-group",
        "[class]": "hostClasses()"
      }
    }]
  }], null, null);
})();
var _ListGroupItemDirective = class _ListGroupItemDirective {
  constructor() {
    this.hostElement = inject(ElementRef);
    this.active = input();
    this.color = input();
    this.disabled = input(false, {
      transform: booleanAttribute
    });
    this.hostClasses = computed(() => {
      const host = this.hostElement.nativeElement;
      return {
        "list-group-item": true,
        "list-group-item-action": host.nodeName === "A" || host.nodeName === "BUTTON",
        active: !!this.active(),
        disabled: this._disabled(),
        [`list-group-item-${this.color()}`]: !!this.color()
      };
    });
    this._disabled = computed(() => this.disabled());
    this.ariaDisabled = computed(() => {
      return this._disabled() ? true : null;
    });
    this.attrDisabled = computed(() => {
      return this._disabled() ? "" : null;
    });
    this.tabIndex = computed(() => {
      return this._disabled() ? "-1" : null;
    });
    this.ariaCurrent = computed(() => {
      return this.active() || null;
    });
  }
};
_ListGroupItemDirective.ɵfac = function ListGroupItemDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ListGroupItemDirective)();
};
_ListGroupItemDirective.ɵdir = ɵɵdefineDirective({
  type: _ListGroupItemDirective,
  selectors: [["", "cListGroupItem", ""], ["c-list-group-item"]],
  hostVars: 6,
  hostBindings: function ListGroupItemDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-disabled", ctx.ariaDisabled())("aria-current", ctx.ariaCurrent())("disabled", ctx.attrDisabled())("tabindex", ctx.tabIndex());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    active: [1, "active"],
    color: [1, "color"],
    disabled: [1, "disabled"]
  },
  exportAs: ["cListGroupItem"],
  standalone: true
});
var ListGroupItemDirective = _ListGroupItemDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ListGroupItemDirective, [{
    type: Directive,
    args: [{
      selector: "[cListGroupItem], c-list-group-item",
      exportAs: "cListGroupItem",
      standalone: true,
      host: {
        "[class]": "hostClasses()",
        "[attr.aria-disabled]": "ariaDisabled()",
        "[attr.aria-current]": "ariaCurrent()",
        "[attr.disabled]": "attrDisabled()",
        "[attr.tabindex]": "tabIndex()"
      }
    }]
  }], null, null);
})();
var _ListGroupModule = class _ListGroupModule {
};
_ListGroupModule.ɵfac = function ListGroupModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ListGroupModule)();
};
_ListGroupModule.ɵmod = ɵɵdefineNgModule({
  type: _ListGroupModule,
  imports: [ListGroupDirective, ListGroupItemDirective],
  exports: [ListGroupDirective, ListGroupItemDirective]
});
_ListGroupModule.ɵinj = ɵɵdefineInjector({});
var ListGroupModule = _ListGroupModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ListGroupModule, [{
    type: NgModule,
    args: [{
      exports: [ListGroupDirective, ListGroupItemDirective],
      imports: [ListGroupDirective, ListGroupItemDirective]
    }]
  }], null, null);
})();
var _NavLinkDirective = class _NavLinkDirective {
  constructor() {
    this.cNavLink = true;
    this.disabled = false;
  }
  get ariaCurrent() {
    return this.active ? "page" : null;
  }
  get isDisabled() {
    return this.disabled || null;
  }
  get attrDisabled() {
    return this.disabled ? "" : null;
  }
  get getTabindex() {
    return this.disabled ? "-1" : null;
  }
  get getCursorStyle() {
    return this.disabled ? null : "pointer";
  }
  get hostClasses() {
    return {
      "nav-link": this.cNavLink,
      disabled: this.disabled,
      active: this.active
    };
  }
};
_NavLinkDirective.ɵfac = function NavLinkDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NavLinkDirective)();
};
_NavLinkDirective.ɵdir = ɵɵdefineDirective({
  type: _NavLinkDirective,
  selectors: [["", "cNavLink", ""]],
  hostVars: 8,
  hostBindings: function NavLinkDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-current", ctx.ariaCurrent)("aria-disabled", ctx.isDisabled)("disabled", ctx.attrDisabled)("tabindex", ctx.getTabindex);
      ɵɵclassMap(ctx.hostClasses);
      ɵɵstyleProp("cursor", ctx.getCursorStyle);
    }
  },
  inputs: {
    cNavLink: [2, "cNavLink", "cNavLink", booleanAttribute],
    active: "active",
    disabled: [2, "disabled", "disabled", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var NavLinkDirective = _NavLinkDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavLinkDirective, [{
    type: Directive,
    args: [{
      selector: "[cNavLink]",
      standalone: true
    }]
  }], null, {
    cNavLink: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    active: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    ariaCurrent: [{
      type: HostBinding,
      args: ["attr.aria-current"]
    }],
    isDisabled: [{
      type: HostBinding,
      args: ["attr.aria-disabled"]
    }],
    attrDisabled: [{
      type: HostBinding,
      args: ["attr.disabled"]
    }],
    getTabindex: [{
      type: HostBinding,
      args: ["attr.tabindex"]
    }],
    getCursorStyle: [{
      type: HostBinding,
      args: ["style.cursor"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _NavItemComponent = class _NavItemComponent {
};
_NavItemComponent.ɵfac = function NavItemComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NavItemComponent)();
};
_NavItemComponent.ɵcmp = ɵɵdefineComponent({
  type: _NavItemComponent,
  selectors: [["c-nav-item"]],
  hostAttrs: [1, "nav-item"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function NavItemComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:list-item;text-align:match-parent;text-align:-webkit-match-parent}"]
});
var NavItemComponent = _NavItemComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavItemComponent, [{
    type: Component,
    args: [{
      selector: "c-nav-item",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "nav-item"
      },
      styles: [":host{display:list-item;text-align:match-parent;text-align:-webkit-match-parent}\n"]
    }]
  }], null, null);
})();
var _NavComponent = class _NavComponent {
  get hostClasses() {
    return {
      nav: true,
      [`nav-${this.layout}`]: !!this.layout,
      [`nav-${this.variant}`]: !!this.variant
    };
  }
};
_NavComponent.ɵfac = function NavComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NavComponent)();
};
_NavComponent.ɵcmp = ɵɵdefineComponent({
  type: _NavComponent,
  selectors: [["c-nav"]],
  hostAttrs: [1, "nav"],
  hostVars: 2,
  hostBindings: function NavComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    layout: "layout",
    variant: "variant"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function NavComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]   .nav-link[_ngcontent-%COMP%]:focus{outline:0}.nav-underline-border[_nghost-%COMP%]{column-gap:0}"]
});
var NavComponent = _NavComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavComponent, [{
    type: Component,
    args: [{
      selector: "c-nav",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "nav"
      },
      styles: [":host .nav-link:focus{outline:0}:host.nav-underline-border{column-gap:0}\n"]
    }]
  }], null, {
    layout: [{
      type: Input
    }],
    variant: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _NavModule = class _NavModule {
};
_NavModule.ɵfac = function NavModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NavModule)();
};
_NavModule.ɵmod = ɵɵdefineNgModule({
  type: _NavModule,
  imports: [NavComponent, NavItemComponent, NavLinkDirective],
  exports: [NavComponent, NavItemComponent, NavLinkDirective]
});
_NavModule.ɵinj = ɵɵdefineInjector({});
var NavModule = _NavModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavModule, [{
    type: NgModule,
    args: [{
      imports: [NavComponent, NavItemComponent, NavLinkDirective],
      exports: [NavComponent, NavItemComponent, NavLinkDirective]
    }]
  }], null, null);
})();
var _NavbarComponent = class _NavbarComponent {
  constructor(hostElement, breakpointObserver) {
    this.hostElement = hostElement;
    this.breakpointObserver = breakpointObserver;
    this.role = "navigation";
  }
  get hostClasses() {
    const expandClassSuffix = this.expand === true ? "" : `-${this.expand}`;
    return {
      navbar: true,
      [`navbar-expand${expandClassSuffix}`]: !!this.expand,
      [`bg-${this.color}`]: !!this.color,
      [`${this.placement}`]: !!this.placement
    };
  }
  get containerClass() {
    return `container${this.container !== true ? "-" + this.container : ""}`;
  }
  get breakpoint() {
    if (typeof this.expand === "string") {
      return getComputedStyle(this.hostElement.nativeElement)?.getPropertyValue(`--cui-breakpoint-${this.expand}`) ?? false;
    }
    return false;
  }
  ngAfterContentInit() {
    if (this.breakpoint) {
      const onBreakpoint = `(min-width: ${this.breakpoint})`;
      this.breakpointObserver.observe([onBreakpoint]).subscribe((result) => {
        if (this.collapse) {
          const animate2 = this.collapse.animate;
          this.collapse.animate = false;
          this.collapse.toggle(false);
          setTimeout(() => {
            this.collapse.toggle(result.matches);
            setTimeout(() => {
              this.collapse.animate = animate2;
            });
          });
        }
      });
    }
  }
};
_NavbarComponent.ɵfac = function NavbarComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NavbarComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(BreakpointObserver));
};
_NavbarComponent.ɵcmp = ɵɵdefineComponent({
  type: _NavbarComponent,
  selectors: [["c-navbar"]],
  contentQueries: function NavbarComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, CollapseDirective, 5);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.collapse = _t.first);
    }
  },
  hostAttrs: [1, "navbar"],
  hostVars: 3,
  hostBindings: function NavbarComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    color: "color",
    container: "container",
    expand: "expand",
    placement: "placement",
    role: "role"
  },
  standalone: true,
  features: [ɵɵHostDirectivesFeature([{
    directive: ThemeDirective,
    inputs: ["colorScheme", "colorScheme"]
  }]), ɵɵStandaloneFeature],
  ngContentSelectors: _c1,
  decls: 5,
  vars: 1,
  consts: [["withContainerTemplate", ""], ["noContainerTemplate", ""], [4, "ngTemplateOutlet"], [3, "ngClass"]],
  template: function NavbarComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef(_c1);
      ɵɵtemplate(0, NavbarComponent_ng_container_0_Template, 1, 0, "ng-container", 2)(1, NavbarComponent_ng_template_1_Template, 2, 1, "ng-template", null, 0, ɵɵtemplateRefExtractor)(3, NavbarComponent_ng_template_3_Template, 1, 0, "ng-template", null, 1, ɵɵtemplateRefExtractor);
    }
    if (rf & 2) {
      const withContainerTemplate_r2 = ɵɵreference(2);
      const noContainerTemplate_r3 = ɵɵreference(4);
      ɵɵproperty("ngTemplateOutlet", ctx.container ? withContainerTemplate_r2 : noContainerTemplate_r3);
    }
  },
  dependencies: [NgClass, NgTemplateOutlet],
  encapsulation: 2
});
var NavbarComponent = _NavbarComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavbarComponent, [{
    type: Component,
    args: [{
      selector: "c-navbar",
      standalone: true,
      imports: [NgClass, NgTemplateOutlet],
      hostDirectives: [{
        directive: ThemeDirective,
        inputs: ["colorScheme"]
      }],
      host: {
        class: "navbar"
      },
      template: '<ng-container *ngTemplateOutlet="container ? withContainerTemplate : noContainerTemplate" />\n\n<ng-template #withContainerTemplate>\n  <div [ngClass]="containerClass">\n    <ng-content />\n  </div>\n</ng-template>\n\n<ng-template #noContainerTemplate>\n  <ng-content />\n</ng-template>\n'
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: BreakpointObserver
  }], {
    color: [{
      type: Input
    }],
    container: [{
      type: Input
    }],
    expand: [{
      type: Input
    }],
    placement: [{
      type: Input
    }],
    collapse: [{
      type: ContentChild,
      args: [CollapseDirective]
    }],
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }, {
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _NavbarBrandDirective = class _NavbarBrandDirective {
  constructor() {
    this.navbarBrand = true;
    this.role = "button";
  }
};
_NavbarBrandDirective.ɵfac = function NavbarBrandDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NavbarBrandDirective)();
};
_NavbarBrandDirective.ɵdir = ɵɵdefineDirective({
  type: _NavbarBrandDirective,
  selectors: [["", "cNavbarBrand", ""]],
  hostVars: 3,
  hostBindings: function NavbarBrandDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role);
      ɵɵclassProp("navbar-brand", ctx.navbarBrand);
    }
  },
  standalone: true
});
var NavbarBrandDirective = _NavbarBrandDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavbarBrandDirective, [{
    type: Directive,
    args: [{
      selector: "[cNavbarBrand]",
      standalone: true
    }]
  }], null, {
    navbarBrand: [{
      type: HostBinding,
      args: ["class.navbar-brand"]
    }],
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }]
  });
})();
var _NavbarNavComponent = class _NavbarNavComponent {
  constructor() {
    this.scroll = false;
  }
  get hostClasses() {
    return {
      "navbar-nav": true,
      "navbar-nav-scroll": this.scroll
    };
  }
};
_NavbarNavComponent.ɵfac = function NavbarNavComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NavbarNavComponent)();
};
_NavbarNavComponent.ɵcmp = ɵɵdefineComponent({
  type: _NavbarNavComponent,
  selectors: [["c-navbar-nav"]],
  hostAttrs: [1, "navbar-nav"],
  hostVars: 2,
  hostBindings: function NavbarNavComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    scroll: [2, "scroll", "scroll", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function NavbarNavComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var NavbarNavComponent = _NavbarNavComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavbarNavComponent, [{
    type: Component,
    args: [{
      selector: "c-navbar-nav",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "navbar-nav"
      }
    }]
  }], null, {
    scroll: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _NavbarTextComponent = class _NavbarTextComponent {
  constructor() {
    this.navbarTextClass = true;
  }
};
_NavbarTextComponent.ɵfac = function NavbarTextComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NavbarTextComponent)();
};
_NavbarTextComponent.ɵcmp = ɵɵdefineComponent({
  type: _NavbarTextComponent,
  selectors: [["c-navbar-text"]],
  hostVars: 2,
  hostBindings: function NavbarTextComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassProp("navbar-text", ctx.navbarTextClass);
    }
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function NavbarTextComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var NavbarTextComponent = _NavbarTextComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavbarTextComponent, [{
    type: Component,
    args: [{
      selector: "c-navbar-text",
      template: "<ng-content />",
      standalone: true
    }]
  }], null, {
    navbarTextClass: [{
      type: HostBinding,
      args: ["class.navbar-text"]
    }]
  });
})();
var _NavbarTogglerDirective = class _NavbarTogglerDirective {
  constructor(renderer, hostElement) {
    this.renderer = renderer;
    this.hostElement = hostElement;
    this.navbarToggler = true;
    this.type = "button";
    this.ariaLabel = "Toggle navigation";
  }
  handleClick() {
    this.collapseRef?.toggle(!this.collapseRef?.visible);
  }
  addDefaultIcon() {
    const span = this.renderer.createElement("span");
    this.renderer.addClass(span, "navbar-toggler-icon");
    this.renderer.appendChild(this.hostElement.nativeElement, span);
  }
  ngAfterContentInit() {
    this.hasContent = this.hostElement.nativeElement.childNodes.length;
    if (!this.hasContent) {
      this.addDefaultIcon();
    }
  }
};
_NavbarTogglerDirective.ɵfac = function NavbarTogglerDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NavbarTogglerDirective)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef));
};
_NavbarTogglerDirective.ɵdir = ɵɵdefineDirective({
  type: _NavbarTogglerDirective,
  selectors: [["", "cNavbarToggler", ""]],
  hostVars: 4,
  hostBindings: function NavbarTogglerDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function NavbarTogglerDirective_click_HostBindingHandler($event) {
        return ctx.handleClick($event);
      });
    }
    if (rf & 2) {
      ɵɵattribute("type", ctx.type)("aria-label", ctx.ariaLabel);
      ɵɵclassProp("navbar-toggler", ctx.navbarToggler);
    }
  },
  inputs: {
    collapseRef: [0, "cNavbarToggler", "collapseRef"],
    type: "type",
    ariaLabel: "ariaLabel"
  },
  standalone: true
});
var NavbarTogglerDirective = _NavbarTogglerDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavbarTogglerDirective, [{
    type: Directive,
    args: [{
      selector: "[cNavbarToggler]",
      standalone: true
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }], {
    collapseRef: [{
      type: Input,
      args: ["cNavbarToggler"]
    }],
    navbarToggler: [{
      type: HostBinding,
      args: ["class.navbar-toggler"]
    }],
    type: [{
      type: HostBinding,
      args: ["attr.type"]
    }, {
      type: Input
    }],
    ariaLabel: [{
      type: HostBinding,
      args: ["attr.aria-label"]
    }, {
      type: Input
    }],
    handleClick: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }]
  });
})();
var _NavbarModule = class _NavbarModule {
};
_NavbarModule.ɵfac = function NavbarModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _NavbarModule)();
};
_NavbarModule.ɵmod = ɵɵdefineNgModule({
  type: _NavbarModule,
  imports: [NavbarBrandDirective, NavbarComponent, NavbarNavComponent, NavbarTextComponent, NavbarTogglerDirective],
  exports: [NavbarBrandDirective, NavbarComponent, NavbarNavComponent, NavbarTextComponent, NavbarTogglerDirective]
});
_NavbarModule.ɵinj = ɵɵdefineInjector({});
var NavbarModule = _NavbarModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(NavbarModule, [{
    type: NgModule,
    args: [{
      exports: [NavbarBrandDirective, NavbarComponent, NavbarNavComponent, NavbarTextComponent, NavbarTogglerDirective],
      imports: [NavbarBrandDirective, NavbarComponent, NavbarNavComponent, NavbarTextComponent, NavbarTogglerDirective]
    }]
  }], null, null);
})();
var _ModalBodyComponent = class _ModalBodyComponent {
};
_ModalBodyComponent.ɵfac = function ModalBodyComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ModalBodyComponent)();
};
_ModalBodyComponent.ɵcmp = ɵɵdefineComponent({
  type: _ModalBodyComponent,
  selectors: [["c-modal-body"]],
  hostAttrs: [1, "modal-body"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ModalBodyComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var ModalBodyComponent = _ModalBodyComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalBodyComponent, [{
    type: Component,
    args: [{
      selector: "c-modal-body",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "modal-body"
      },
      styles: [":host{display:block}\n"]
    }]
  }], null, null);
})();
var _ModalContentComponent = class _ModalContentComponent {
};
_ModalContentComponent.ɵfac = function ModalContentComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ModalContentComponent)();
};
_ModalContentComponent.ɵcmp = ɵɵdefineComponent({
  type: _ModalContentComponent,
  selectors: [["c-modal-content"]],
  hostAttrs: [1, "modal-content"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ModalContentComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var ModalContentComponent = _ModalContentComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalContentComponent, [{
    type: Component,
    args: [{
      selector: "c-modal-content",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "modal-content"
      }
    }]
  }], null, null);
})();
var _ModalDialogComponent = class _ModalDialogComponent {
  get hostClasses() {
    return {
      "modal-dialog": true,
      "modal-dialog-centered": this.alignment === "center",
      "modal-fullscreen": this.fullscreen === true,
      [`modal-fullscreen-${this.fullscreen}-down`]: this.fullscreen,
      "modal-dialog-scrollable": this.scrollable,
      [`modal-${this.size}`]: this.size
    };
  }
};
_ModalDialogComponent.ɵfac = function ModalDialogComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ModalDialogComponent)();
};
_ModalDialogComponent.ɵcmp = ɵɵdefineComponent({
  type: _ModalDialogComponent,
  selectors: [["c-modal-dialog"]],
  hostAttrs: [1, "modal-dialog"],
  hostVars: 2,
  hostBindings: function ModalDialogComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    alignment: "alignment",
    fullscreen: "fullscreen",
    scrollable: "scrollable",
    size: "size"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ModalDialogComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}.modal-dialog-centered[_nghost-%COMP%]{display:flex}"]
});
var ModalDialogComponent = _ModalDialogComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalDialogComponent, [{
    type: Component,
    args: [{
      selector: "c-modal-dialog",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "modal-dialog"
      },
      styles: [":host{display:block}:host.modal-dialog-centered{display:flex}\n"]
    }]
  }], null, {
    alignment: [{
      type: Input
    }],
    fullscreen: [{
      type: Input
    }],
    scrollable: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _ModalService = class _ModalService {
  constructor() {
    this.modalState = new Subject();
    this.modalState$ = this.modalState.asObservable();
  }
  toggle(action) {
    this.modalState.next(action);
  }
};
_ModalService.ɵfac = function ModalService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ModalService)();
};
_ModalService.ɵprov = ɵɵdefineInjectable({
  token: _ModalService,
  factory: _ModalService.ɵfac,
  providedIn: "root"
});
var ModalService = _ModalService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _ModalToggleDirective = class _ModalToggleDirective {
  constructor(modalService) {
    this.modalService = modalService;
  }
  dismiss($event) {
    $event.preventDefault();
    this.modalService.toggle({
      show: "toggle",
      id: this.id
    });
  }
};
_ModalToggleDirective.ɵfac = function ModalToggleDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ModalToggleDirective)(ɵɵdirectiveInject(ModalService));
};
_ModalToggleDirective.ɵdir = ɵɵdefineDirective({
  type: _ModalToggleDirective,
  selectors: [["", "cModalToggle", ""]],
  hostBindings: function ModalToggleDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function ModalToggleDirective_click_HostBindingHandler($event) {
        return ctx.dismiss($event);
      });
    }
  },
  inputs: {
    id: [0, "cModalToggle", "id"]
  },
  standalone: true
});
var ModalToggleDirective = _ModalToggleDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalToggleDirective, [{
    type: Directive,
    args: [{
      selector: "[cModalToggle]",
      standalone: true
    }]
  }], () => [{
    type: ModalService
  }], {
    id: [{
      type: Input,
      args: ["cModalToggle"]
    }],
    dismiss: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }]
  });
})();
var _ModalFooterComponent = class _ModalFooterComponent {
};
_ModalFooterComponent.ɵfac = function ModalFooterComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ModalFooterComponent)();
};
_ModalFooterComponent.ɵcmp = ɵɵdefineComponent({
  type: _ModalFooterComponent,
  selectors: [["c-modal-footer"]],
  hostAttrs: [1, "modal-footer"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ModalFooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var ModalFooterComponent = _ModalFooterComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalFooterComponent, [{
    type: Component,
    args: [{
      selector: "c-modal-footer",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "modal-footer"
      }
    }]
  }], null, null);
})();
var _ModalHeaderComponent = class _ModalHeaderComponent {
};
_ModalHeaderComponent.ɵfac = function ModalHeaderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ModalHeaderComponent)();
};
_ModalHeaderComponent.ɵcmp = ɵɵdefineComponent({
  type: _ModalHeaderComponent,
  selectors: [["c-modal-header"]],
  hostAttrs: [1, "modal-header"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ModalHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var ModalHeaderComponent = _ModalHeaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalHeaderComponent, [{
    type: Component,
    args: [{
      selector: "c-modal-header",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "modal-header"
      }
    }]
  }], null, null);
})();
var _ModalTitleDirective = class _ModalTitleDirective {
};
_ModalTitleDirective.ɵfac = function ModalTitleDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ModalTitleDirective)();
};
_ModalTitleDirective.ɵdir = ɵɵdefineDirective({
  type: _ModalTitleDirective,
  selectors: [["", "cModalTitle", ""]],
  hostAttrs: [1, "modal-title"],
  standalone: true
});
var ModalTitleDirective = _ModalTitleDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalTitleDirective, [{
    type: Directive,
    args: [{
      selector: "[cModalTitle]",
      standalone: true,
      host: {
        class: "modal-title"
      }
    }]
  }], null, null);
})();
var _destroyRef6, _focusMonitor, _ariaModal, _visible2, _activeElement, _visibleEffect, _activeBackdrop, _afterViewInit;
var _ModalComponent = class _ModalComponent {
  constructor(document2, renderer, hostElement, modalService, backdropService) {
    __privateAdd(this, _destroyRef6);
    __privateAdd(this, _focusMonitor);
    __privateAdd(this, _ariaModal);
    __privateAdd(this, _visible2);
    __privateAdd(this, _activeElement);
    __privateAdd(this, _visibleEffect);
    __privateAdd(this, _activeBackdrop);
    __privateAdd(this, _afterViewInit);
    this.document = document2;
    this.renderer = renderer;
    this.hostElement = hostElement;
    this.modalService = modalService;
    this.backdropService = backdropService;
    __privateSet(this, _destroyRef6, inject(DestroyRef));
    __privateSet(this, _focusMonitor, inject(FocusMonitor));
    this.alignment = "top";
    this.backdrop = true;
    this.keyboard = true;
    this.transition = true;
    this.role = "dialog";
    __privateSet(this, _ariaModal, null);
    this.scrollable = false;
    __privateSet(this, _visible2, signal(false));
    __privateSet(this, _activeElement, null);
    __privateSet(this, _visibleEffect, effect(() => {
      if (__privateGet(this, _visible2).call(this) && __privateGet(this, _afterViewInit).call(this)) {
        __privateSet(this, _activeElement, this.document.activeElement);
        setTimeout(() => {
          const focusable = this.modalContentRef.nativeElement.querySelectorAll('[tabindex]:not([tabindex="-1"]), button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])');
          if (focusable.length) {
            __privateGet(this, _focusMonitor).focusVia(focusable[0], "keyboard");
          }
        });
      } else {
        if (this.document.contains(__privateGet(this, _activeElement))) {
          setTimeout(() => {
            __privateGet(this, _activeElement)?.focus();
            __privateSet(this, _activeElement, null);
          });
        }
      }
    }));
    this.visibleChange = new EventEmitter();
    this._show = true;
    this.mouseDownTarget = null;
    __privateSet(this, _afterViewInit, signal(false));
  }
  /**
   * Set aria-modal html attr for modal. [docs]
   * @type boolean
   * @default null
   */
  set ariaModal(value) {
    __privateSet(this, _ariaModal, value);
  }
  get ariaModal() {
    return this.visible || __privateGet(this, _ariaModal) ? true : null;
  }
  /**
   * Toggle the visibility of modal component.
   * @type boolean
   */
  set visible(value) {
    if (__privateGet(this, _visible2).call(this) !== value) {
      __privateGet(this, _visible2).set(value);
      this.setBackdrop(this.backdrop !== false && value);
      this.setBodyStyles(value);
      this.visibleChange.emit(value);
    }
  }
  get visible() {
    return __privateGet(this, _visible2).call(this);
  }
  // private inBoundingClientRect!: boolean;
  get hostClasses() {
    return {
      modal: true,
      fade: this.transition,
      show: this.show
    };
  }
  get ariaHidden() {
    return this.visible ? null : true;
  }
  get tabIndex() {
    return "-1";
  }
  get animateTrigger() {
    return this.visible ? "visible" : "hidden";
  }
  get show() {
    return this.visible && this._show;
  }
  set show(value) {
    this._show = value;
  }
  animateStart(event) {
    if (event.toState === "visible") {
      this.backdropService.hideScrollbar();
      this.renderer.setStyle(this.hostElement.nativeElement, "display", "block");
    } else {
      if (!this.transition) {
        this.renderer.setStyle(this.hostElement.nativeElement, "display", "none");
      }
    }
  }
  animateDone(event) {
    setTimeout(() => {
      if (event.toState === "hidden") {
        this.renderer.setStyle(this.hostElement.nativeElement, "display", "none");
      }
    });
    this.show = this.visible;
  }
  onKeyDownHandler(event) {
    if (event.key === "Escape" && this.keyboard && this.visible) {
      if (this.backdrop === "static") {
        this.setStaticBackdrop();
      } else {
        this.modalService.toggle({
          show: false,
          modal: this
        });
      }
    }
  }
  onMouseDownHandler($event) {
    this.mouseDownTarget = $event.target;
  }
  onClickHandler($event) {
    if (this.mouseDownTarget !== $event.target) {
      this.mouseDownTarget = null;
      return;
    }
    const targetElement = $event.target;
    if (targetElement === this.hostElement.nativeElement) {
      if (this.backdrop === "static") {
        this.setStaticBackdrop();
        return;
      }
      this.modalService.toggle({
        show: false,
        modal: this
      });
    }
  }
  ngOnInit() {
    this.stateToggleSubscribe();
  }
  ngAfterViewInit() {
    __privateGet(this, _afterViewInit).set(true);
  }
  ngOnDestroy() {
    this.modalService.toggle({
      show: false,
      modal: this
    });
    __privateGet(this, _afterViewInit).set(false);
  }
  stateToggleSubscribe() {
    this.modalService.modalState$.pipe(takeUntilDestroyed(__privateGet(this, _destroyRef6))).subscribe((action) => {
      if (this === action.modal || this.id === action.id) {
        if ("show" in action) {
          this.visible = action?.show === "toggle" ? !this.visible : action.show;
        }
      } else {
        if (this.visible) {
          this.visible = false;
        }
      }
    });
  }
  setBackdrop(setBackdrop) {
    __privateSet(this, _activeBackdrop, setBackdrop ? this.backdropService.setBackdrop("modal") : this.backdropService.clearBackdrop(__privateGet(this, _activeBackdrop)));
  }
  setBodyStyles(open) {
    if (open) {
      if (this.backdrop === true) {
        this.renderer.addClass(this.document.body, "modal-open");
      }
    } else {
      this.renderer.removeClass(this.document.body, "modal-open");
    }
  }
  setStaticBackdrop() {
    if (this.transition) {
      this.renderer.addClass(this.hostElement.nativeElement, "modal-static");
      this.renderer.setStyle(this.hostElement.nativeElement, "overflow-y", "hidden");
      setTimeout(() => {
        this.renderer.removeClass(this.hostElement.nativeElement, "modal-static");
        this.renderer.removeStyle(this.hostElement.nativeElement, "overflow-y");
      }, 300);
    }
  }
};
_destroyRef6 = new WeakMap();
_focusMonitor = new WeakMap();
_ariaModal = new WeakMap();
_visible2 = new WeakMap();
_activeElement = new WeakMap();
_visibleEffect = new WeakMap();
_activeBackdrop = new WeakMap();
_afterViewInit = new WeakMap();
_ModalComponent.ɵfac = function ModalComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ModalComponent)(ɵɵdirectiveInject(DOCUMENT), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(ModalService), ɵɵdirectiveInject(BackdropService));
};
_ModalComponent.ɵcmp = ɵɵdefineComponent({
  type: _ModalComponent,
  selectors: [["c-modal"]],
  viewQuery: function ModalComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(ModalContentComponent, 5, ElementRef);
      ɵɵviewQuery(_c5, 5, ElementRef);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.modalContent = _t.first);
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.modalContentRef = _t.first);
    }
  },
  hostAttrs: [1, "modal"],
  hostVars: 7,
  hostBindings: function ModalComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵsyntheticHostListener("@showHide.start", function ModalComponent_animation_showHide_start_HostBindingHandler($event) {
        return ctx.animateStart($event);
      })("@showHide.done", function ModalComponent_animation_showHide_done_HostBindingHandler($event) {
        return ctx.animateDone($event);
      });
      ɵɵlistener("keyup", function ModalComponent_keyup_HostBindingHandler($event) {
        return ctx.onKeyDownHandler($event);
      }, false, ɵɵresolveDocument)("mousedown", function ModalComponent_mousedown_HostBindingHandler($event) {
        return ctx.onMouseDownHandler($event);
      })("click", function ModalComponent_click_HostBindingHandler($event) {
        return ctx.onClickHandler($event);
      });
    }
    if (rf & 2) {
      ɵɵsyntheticHostProperty("@showHide", ctx.animateTrigger);
      ɵɵattribute("role", ctx.role)("aria-modal", ctx.ariaModal)("aria-hidden", ctx.ariaHidden)("tabindex", ctx.tabIndex);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    alignment: "alignment",
    backdrop: "backdrop",
    fullscreen: "fullscreen",
    keyboard: [2, "keyboard", "keyboard", booleanAttribute],
    id: "id",
    size: "size",
    transition: [2, "transition", "transition", booleanAttribute],
    role: "role",
    ariaModal: "ariaModal",
    scrollable: [2, "scrollable", "scrollable", booleanAttribute],
    visible: [2, "visible", "visible", booleanAttribute]
  },
  outputs: {
    visibleChange: "visibleChange"
  },
  exportAs: ["cModal"],
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 5,
  vars: 6,
  consts: [["modalContentRef", ""], [3, "alignment", "fullscreen", "scrollable", "size"], [2, "display", "contents", 3, "cdkTrapFocus", "cdkTrapFocusAutoCapture"]],
  template: function ModalComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "c-modal-dialog", 1)(1, "c-modal-content")(2, "div", 2, 0);
      ɵɵprojection(4);
      ɵɵelementEnd()()();
    }
    if (rf & 2) {
      ɵɵproperty("alignment", ctx.alignment)("fullscreen", ctx.fullscreen)("scrollable", ctx.scrollable)("size", ctx.size);
      ɵɵadvance(2);
      ɵɵproperty("cdkTrapFocus", ctx.visible)("cdkTrapFocusAutoCapture", ctx.visible);
    }
  },
  dependencies: [ModalDialogComponent, ModalContentComponent, A11yModule, CdkTrapFocus],
  encapsulation: 2,
  data: {
    animation: [trigger("showHide", [state("visible", style({
      // display: 'block'
    })), state("hidden", style({
      // display: 'none'
    })), transition("visible <=> *", [animate("150ms")])])]
  }
});
var ModalComponent = _ModalComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalComponent, [{
    type: Component,
    args: [{
      selector: "c-modal",
      animations: [trigger("showHide", [state("visible", style({
        // display: 'block'
      })), state("hidden", style({
        // display: 'none'
      })), transition("visible <=> *", [animate("150ms")])])],
      exportAs: "cModal",
      standalone: true,
      imports: [ModalDialogComponent, ModalContentComponent, A11yModule],
      host: {
        class: "modal"
      },
      template: '<c-modal-dialog\n  [alignment]="alignment"\n  [fullscreen]="fullscreen"\n  [scrollable]="scrollable"\n  [size]="size">\n  <c-modal-content>\n    <div [cdkTrapFocus]="visible" [cdkTrapFocusAutoCapture]="visible" style="display: contents;" #modalContentRef>\n      <ng-content />\n    </div>\n  </c-modal-content>\n</c-modal-dialog>\n'
    }]
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: ModalService
  }, {
    type: BackdropService
  }], {
    alignment: [{
      type: Input
    }],
    backdrop: [{
      type: Input
    }],
    fullscreen: [{
      type: Input
    }],
    keyboard: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    id: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    transition: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    role: [{
      type: Input
    }, {
      type: HostBinding,
      args: ["attr.role"]
    }],
    ariaModal: [{
      type: Input
    }, {
      type: HostBinding,
      args: ["attr.aria-modal"]
    }],
    scrollable: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    visible: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    visibleChange: [{
      type: Output
    }],
    modalContent: [{
      type: ViewChild,
      args: [ModalContentComponent, {
        read: ElementRef
      }]
    }],
    modalContentRef: [{
      type: ViewChild,
      args: ["modalContentRef", {
        read: ElementRef
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    ariaHidden: [{
      type: HostBinding,
      args: ["attr.aria-hidden"]
    }],
    tabIndex: [{
      type: HostBinding,
      args: ["attr.tabindex"]
    }],
    animateTrigger: [{
      type: HostBinding,
      args: ["@showHide"]
    }],
    animateStart: [{
      type: HostListener,
      args: ["@showHide.start", ["$event"]]
    }],
    animateDone: [{
      type: HostListener,
      args: ["@showHide.done", ["$event"]]
    }],
    onKeyDownHandler: [{
      type: HostListener,
      args: ["document:keyup", ["$event"]]
    }],
    onMouseDownHandler: [{
      type: HostListener,
      args: ["mousedown", ["$event"]]
    }],
    onClickHandler: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }]
  });
})();
var _ModalModule = class _ModalModule {
};
_ModalModule.ɵfac = function ModalModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ModalModule)();
};
_ModalModule.ɵmod = ɵɵdefineNgModule({
  type: _ModalModule,
  imports: [ModalBodyComponent, ModalComponent, ModalContentComponent, ModalDialogComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective],
  exports: [ModalBodyComponent, ModalComponent, ModalContentComponent, ModalDialogComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective]
});
_ModalModule.ɵinj = ɵɵdefineInjector({
  providers: [ModalService],
  imports: [ModalComponent]
});
var ModalModule = _ModalModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ModalModule, [{
    type: NgModule,
    args: [{
      exports: [ModalBodyComponent, ModalComponent, ModalContentComponent, ModalDialogComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective],
      imports: [ModalBodyComponent, ModalComponent, ModalContentComponent, ModalDialogComponent, ModalFooterComponent, ModalHeaderComponent, ModalTitleDirective, ModalToggleDirective],
      providers: [ModalService]
    }]
  }], null, null);
})();
var _OffcanvasService = class _OffcanvasService {
  constructor() {
    this.offcanvasState = new Subject();
    this.offcanvasState$ = this.offcanvasState.asObservable();
  }
  toggle(action) {
    this.offcanvasState.next(action);
  }
};
_OffcanvasService.ɵfac = function OffcanvasService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _OffcanvasService)();
};
_OffcanvasService.ɵprov = ɵɵdefineInjectable({
  token: _OffcanvasService,
  factory: _OffcanvasService.ɵfac,
  providedIn: "root"
});
var OffcanvasService = _OffcanvasService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OffcanvasService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var nextId$1 = 0;
var _destroyRef7, _activeBackdrop2, _backdropClickSubscription, _layoutChangeSubscription, _show, _visible3;
var _OffcanvasComponent = class _OffcanvasComponent {
  constructor(document2, platformId, renderer, hostElement, offcanvasService, backdropService, breakpointObserver) {
    __privateAdd(this, _destroyRef7);
    __privateAdd(this, _activeBackdrop2);
    __privateAdd(this, _backdropClickSubscription);
    __privateAdd(this, _layoutChangeSubscription);
    __privateAdd(this, _show);
    __privateAdd(this, _visible3);
    this.document = document2;
    this.platformId = platformId;
    this.renderer = renderer;
    this.hostElement = hostElement;
    this.offcanvasService = offcanvasService;
    this.backdropService = backdropService;
    this.breakpointObserver = breakpointObserver;
    __privateSet(this, _destroyRef7, inject(DestroyRef));
    this.backdrop = true;
    this.keyboard = true;
    this.placement = "start";
    this.responsive = true;
    this.id = `offcanvas-${this.placement}-${nextId$1++}`;
    this.role = "dialog";
    this.ariaModal = true;
    __privateSet(this, _show, false);
    this.scroll = false;
    __privateSet(this, _visible3, false);
    this.visibleChange = new EventEmitter();
  }
  /**
   * Toggle the visibility of offcanvas component.
   * @type boolean
   * @default false
   */
  set visible(value) {
    __privateSet(this, _visible3, value);
    if (__privateGet(this, _visible3)) {
      this.setBackdrop(this.backdrop);
      this.setFocus();
    } else {
      this.setBackdrop(false);
    }
    this.layoutChangeSubscribe(__privateGet(this, _visible3));
    this.visibleChange.emit(value);
  }
  get visible() {
    return __privateGet(this, _visible3);
  }
  get hostClasses() {
    return {
      offcanvas: typeof this.responsive === "boolean",
      [`offcanvas-${this.responsive}`]: typeof this.responsive !== "boolean",
      [`offcanvas-${this.placement}`]: !!this.placement,
      show: this.show
    };
  }
  get ariaHidden() {
    return this.visible ? null : true;
  }
  get tabIndex() {
    return "-1";
  }
  get animateTrigger() {
    return this.visible ? "visible" : "hidden";
  }
  get show() {
    return this.visible && __privateGet(this, _show);
  }
  set show(value) {
    __privateSet(this, _show, value);
  }
  get responsiveBreakpoint() {
    if (typeof this.responsive !== "string") {
      return false;
    }
    const element = this.document.documentElement;
    const responsiveBreakpoint = this.responsive;
    const breakpointValue = getComputedStyle(element)?.getPropertyValue(`--cui-breakpoint-${responsiveBreakpoint.trim()}`) ?? false;
    return breakpointValue ? `${parseFloat(breakpointValue.trim()) - 0.02}px` : false;
  }
  animateStart(event) {
    if (event.toState === "visible") {
      if (!this.scroll) {
        this.backdropService.hideScrollbar();
      }
      this.renderer.addClass(this.hostElement.nativeElement, "showing");
    } else {
      this.renderer.addClass(this.hostElement.nativeElement, "hiding");
    }
  }
  animateDone(event) {
    setTimeout(() => {
      if (event.toState === "visible") {
        this.renderer.removeClass(this.hostElement.nativeElement, "showing");
      }
      if (event.toState === "hidden") {
        this.renderer.removeClass(this.hostElement.nativeElement, "hiding");
        this.renderer.removeStyle(this.document.body, "overflow");
        this.renderer.removeStyle(this.document.body, "paddingRight");
      }
    });
    this.show = this.visible;
  }
  onKeyDownHandler(event) {
    if (event.key === "Escape" && this.keyboard && this.visible && this.backdrop !== "static") {
      this.offcanvasService.toggle({
        show: false,
        id: this.id
      });
    }
  }
  ngOnInit() {
    this.stateToggleSubscribe();
    setTimeout(() => {
      this.renderer.setStyle(this.hostElement.nativeElement, "display", "flex");
    });
  }
  ngOnDestroy() {
    this.offcanvasService.toggle({
      show: false,
      id: this.id
    });
  }
  setFocus() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.hostElement.nativeElement.focus());
    }
  }
  stateToggleSubscribe() {
    this.offcanvasService.offcanvasState$.pipe(takeUntilDestroyed(__privateGet(this, _destroyRef7))).subscribe((action) => {
      if (this === action.offcanvas || this.id === action.id) {
        if ("show" in action) {
          this.visible = action?.show === "toggle" ? !this.visible : action.show;
        }
      }
    });
  }
  backdropClickSubscribe(subscribe = true) {
    if (subscribe) {
      __privateSet(this, _backdropClickSubscription, this.backdropService.backdropClick$.pipe(takeUntilDestroyed(__privateGet(this, _destroyRef7))).subscribe((clicked) => {
        this.offcanvasService.toggle({
          show: !clicked,
          id: this.id
        });
      }));
    } else {
      __privateGet(this, _backdropClickSubscription)?.unsubscribe();
    }
  }
  setBackdrop(setBackdrop) {
    __privateSet(this, _activeBackdrop2, !!setBackdrop ? this.backdropService.setBackdrop("offcanvas") : this.backdropService.clearBackdrop(__privateGet(this, _activeBackdrop2)));
    setBackdrop === true ? this.backdropClickSubscribe() : this.backdropClickSubscribe(false);
  }
  layoutChangeSubscribe(subscribe = true) {
    if (subscribe) {
      if (!this.responsiveBreakpoint) {
        return;
      }
      const responsiveBreakpoint = `(max-width: ${this.responsiveBreakpoint})`;
      const layoutChanges = this.breakpointObserver.observe([responsiveBreakpoint]);
      __privateSet(this, _layoutChangeSubscription, layoutChanges.pipe(filter((breakpointState) => !breakpointState.matches), takeUntilDestroyed(__privateGet(this, _destroyRef7))).subscribe((breakpointState) => {
        this.visible = breakpointState.matches;
      }));
    } else {
      __privateGet(this, _layoutChangeSubscription)?.unsubscribe();
    }
  }
};
_destroyRef7 = new WeakMap();
_activeBackdrop2 = new WeakMap();
_backdropClickSubscription = new WeakMap();
_layoutChangeSubscription = new WeakMap();
_show = new WeakMap();
_visible3 = new WeakMap();
_OffcanvasComponent.ɵfac = function OffcanvasComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _OffcanvasComponent)(ɵɵdirectiveInject(DOCUMENT), ɵɵdirectiveInject(PLATFORM_ID), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(OffcanvasService), ɵɵdirectiveInject(BackdropService), ɵɵdirectiveInject(BreakpointObserver));
};
_OffcanvasComponent.ɵcmp = ɵɵdefineComponent({
  type: _OffcanvasComponent,
  selectors: [["c-offcanvas"]],
  hostAttrs: ["ngSkipHydration", "true"],
  hostVars: 7,
  hostBindings: function OffcanvasComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵsyntheticHostListener("@showHide.start", function OffcanvasComponent_animation_showHide_start_HostBindingHandler($event) {
        return ctx.animateStart($event);
      })("@showHide.done", function OffcanvasComponent_animation_showHide_done_HostBindingHandler($event) {
        return ctx.animateDone($event);
      });
      ɵɵlistener("keydown", function OffcanvasComponent_keydown_HostBindingHandler($event) {
        return ctx.onKeyDownHandler($event);
      }, false, ɵɵresolveDocument);
    }
    if (rf & 2) {
      ɵɵsyntheticHostProperty("@showHide", ctx.animateTrigger);
      ɵɵattribute("role", ctx.role)("aria-modal", ctx.ariaModal)("aria-hidden", ctx.ariaHidden)("tabindex", ctx.tabIndex);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    backdrop: "backdrop",
    keyboard: [2, "keyboard", "keyboard", booleanAttribute],
    placement: "placement",
    responsive: "responsive",
    id: "id",
    role: "role",
    ariaModal: [2, "ariaModal", "ariaModal", booleanAttribute],
    scroll: [2, "scroll", "scroll", booleanAttribute],
    visible: [2, "visible", "visible", booleanAttribute]
  },
  outputs: {
    visibleChange: "visibleChange"
  },
  exportAs: ["cOffcanvas"],
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵHostDirectivesFeature([{
    directive: ThemeDirective,
    inputs: ["dark", "dark"]
  }]), ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 2,
  vars: 0,
  consts: [["cdkTrapFocus", "", "cdkTrapFocusAutoCapture", ""]],
  template: function OffcanvasComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "div", 0);
      ɵɵprojection(1);
      ɵɵelementEnd();
    }
  },
  dependencies: [A11yModule, CdkTrapFocus],
  styles: ["[_nghost-%COMP%]{display:none}"],
  data: {
    animation: [trigger("showHide", [state("visible", style({
      // visibility: 'visible'
    })), state("hidden", style({
      // visibility: 'hidden'
    })), transition("visible <=> *", [animate("300ms")])])]
  }
});
var OffcanvasComponent = _OffcanvasComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OffcanvasComponent, [{
    type: Component,
    args: [{
      selector: "c-offcanvas",
      animations: [trigger("showHide", [state("visible", style({
        // visibility: 'visible'
      })), state("hidden", style({
        // visibility: 'hidden'
      })), transition("visible <=> *", [animate("300ms")])])],
      exportAs: "cOffcanvas",
      standalone: true,
      imports: [A11yModule],
      hostDirectives: [{
        directive: ThemeDirective,
        inputs: ["dark"]
      }],
      host: {
        ngSkipHydration: "true"
      },
      template: "<div cdkTrapFocus cdkTrapFocusAutoCapture>\n  <ng-content />\n</div>\n\n",
      styles: [":host{display:none}\n"]
    }]
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: void 0,
    decorators: [{
      type: Inject,
      args: [PLATFORM_ID]
    }]
  }, {
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: OffcanvasService
  }, {
    type: BackdropService
  }, {
    type: BreakpointObserver
  }], {
    backdrop: [{
      type: Input
    }],
    keyboard: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    placement: [{
      type: Input
    }],
    responsive: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    role: [{
      type: Input
    }, {
      type: HostBinding,
      args: ["attr.role"]
    }],
    ariaModal: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }, {
      type: HostBinding,
      args: ["attr.aria-modal"]
    }],
    scroll: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    visible: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    visibleChange: [{
      type: Output
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    ariaHidden: [{
      type: HostBinding,
      args: ["attr.aria-hidden"]
    }],
    tabIndex: [{
      type: HostBinding,
      args: ["attr.tabindex"]
    }],
    animateTrigger: [{
      type: HostBinding,
      args: ["@showHide"]
    }],
    animateStart: [{
      type: HostListener,
      args: ["@showHide.start", ["$event"]]
    }],
    animateDone: [{
      type: HostListener,
      args: ["@showHide.done", ["$event"]]
    }],
    onKeyDownHandler: [{
      type: HostListener,
      args: ["document:keydown", ["$event"]]
    }]
  });
})();
var _OffcanvasBodyComponent = class _OffcanvasBodyComponent {
};
_OffcanvasBodyComponent.ɵfac = function OffcanvasBodyComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _OffcanvasBodyComponent)();
};
_OffcanvasBodyComponent.ɵcmp = ɵɵdefineComponent({
  type: _OffcanvasBodyComponent,
  selectors: [["c-offcanvas-body"]],
  hostAttrs: [1, "offcanvas-body"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function OffcanvasBodyComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var OffcanvasBodyComponent = _OffcanvasBodyComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OffcanvasBodyComponent, [{
    type: Component,
    args: [{
      selector: "c-offcanvas-body",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "offcanvas-body"
      },
      styles: [":host{display:block}\n"]
    }]
  }], null, null);
})();
var _OffcanvasHeaderComponent = class _OffcanvasHeaderComponent {
};
_OffcanvasHeaderComponent.ɵfac = function OffcanvasHeaderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _OffcanvasHeaderComponent)();
};
_OffcanvasHeaderComponent.ɵcmp = ɵɵdefineComponent({
  type: _OffcanvasHeaderComponent,
  selectors: [["c-offcanvas-header"]],
  hostAttrs: [1, "offcanvas-header"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function OffcanvasHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var OffcanvasHeaderComponent = _OffcanvasHeaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OffcanvasHeaderComponent, [{
    type: Component,
    args: [{
      selector: "c-offcanvas-header",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "offcanvas-header"
      }
    }]
  }], null, null);
})();
var _OffcanvasTitleDirective = class _OffcanvasTitleDirective {
};
_OffcanvasTitleDirective.ɵfac = function OffcanvasTitleDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _OffcanvasTitleDirective)();
};
_OffcanvasTitleDirective.ɵdir = ɵɵdefineDirective({
  type: _OffcanvasTitleDirective,
  selectors: [["", "cOffcanvasTitle", ""]],
  hostAttrs: [1, "offcanvas-title"],
  standalone: true
});
var OffcanvasTitleDirective = _OffcanvasTitleDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OffcanvasTitleDirective, [{
    type: Directive,
    args: [{
      selector: "[cOffcanvasTitle]",
      standalone: true,
      host: {
        class: "offcanvas-title"
      }
    }]
  }], null, null);
})();
var _OffcanvasToggleDirective = class _OffcanvasToggleDirective {
  constructor(offcanvasService) {
    this.offcanvasService = offcanvasService;
  }
  toggleOpen($event) {
    $event.preventDefault();
    this.offcanvasService.toggle({
      show: "toggle",
      id: this.id
    });
  }
};
_OffcanvasToggleDirective.ɵfac = function OffcanvasToggleDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _OffcanvasToggleDirective)(ɵɵdirectiveInject(OffcanvasService));
};
_OffcanvasToggleDirective.ɵdir = ɵɵdefineDirective({
  type: _OffcanvasToggleDirective,
  selectors: [["", "cOffcanvasToggle", ""]],
  hostBindings: function OffcanvasToggleDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function OffcanvasToggleDirective_click_HostBindingHandler($event) {
        return ctx.toggleOpen($event);
      });
    }
  },
  inputs: {
    id: [0, "cOffcanvasToggle", "id"]
  },
  standalone: true
});
var OffcanvasToggleDirective = _OffcanvasToggleDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OffcanvasToggleDirective, [{
    type: Directive,
    args: [{
      selector: "[cOffcanvasToggle]",
      standalone: true
    }]
  }], () => [{
    type: OffcanvasService
  }], {
    id: [{
      type: Input,
      args: ["cOffcanvasToggle"]
    }],
    toggleOpen: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }]
  });
})();
var _OffcanvasModule = class _OffcanvasModule {
};
_OffcanvasModule.ɵfac = function OffcanvasModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _OffcanvasModule)();
};
_OffcanvasModule.ɵmod = ɵɵdefineNgModule({
  type: _OffcanvasModule,
  imports: [OffcanvasBodyComponent, OffcanvasComponent, OffcanvasHeaderComponent, OffcanvasTitleDirective, OffcanvasToggleDirective],
  exports: [OffcanvasBodyComponent, OffcanvasComponent, OffcanvasHeaderComponent, OffcanvasTitleDirective, OffcanvasToggleDirective]
});
_OffcanvasModule.ɵinj = ɵɵdefineInjector({
  providers: [OffcanvasService, BackdropService],
  imports: [OffcanvasComponent]
});
var OffcanvasModule = _OffcanvasModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(OffcanvasModule, [{
    type: NgModule,
    args: [{
      exports: [OffcanvasBodyComponent, OffcanvasComponent, OffcanvasHeaderComponent, OffcanvasTitleDirective, OffcanvasToggleDirective],
      imports: [OffcanvasBodyComponent, OffcanvasComponent, OffcanvasHeaderComponent, OffcanvasTitleDirective, OffcanvasToggleDirective],
      providers: [OffcanvasService, BackdropService]
    }]
  }], null, null);
})();
var _PageLinkDirective = class _PageLinkDirective {
};
_PageLinkDirective.ɵfac = function PageLinkDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PageLinkDirective)();
};
_PageLinkDirective.ɵdir = ɵɵdefineDirective({
  type: _PageLinkDirective,
  selectors: [["", "cPageLink", ""]],
  hostAttrs: [1, "page-link"],
  standalone: true
});
var PageLinkDirective = _PageLinkDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PageLinkDirective, [{
    type: Directive,
    args: [{
      selector: "[cPageLink]",
      standalone: true,
      host: {
        class: "page-link"
      }
    }]
  }], null, null);
})();
var _PageItemDirective = class _PageItemDirective {
  get ariaCurrent() {
    return this.active ? "page" : null;
  }
  get hostClasses() {
    return {
      "page-item": true,
      disabled: this.disabled,
      active: this.active
    };
  }
  constructor(renderer) {
    this.renderer = renderer;
  }
  ngAfterContentInit() {
    this.setAttributes();
  }
  ngOnChanges(changes) {
    if (changes["disabled"]) {
      this.setAttributes();
    }
  }
  setAttributes() {
    if (!this.pageLinkElementRef) {
      return;
    }
    const pageLinkElement = this.pageLinkElementRef.nativeElement;
    if (this.disabled) {
      this.renderer.setAttribute(pageLinkElement, "aria-disabled", "true");
      this.renderer.setAttribute(pageLinkElement, "tabindex", "-1");
    } else {
      this.renderer.removeAttribute(pageLinkElement, "aria-disabled");
      this.renderer.removeAttribute(pageLinkElement, "tabindex");
    }
  }
};
_PageItemDirective.ɵfac = function PageItemDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PageItemDirective)(ɵɵdirectiveInject(Renderer2));
};
_PageItemDirective.ɵdir = ɵɵdefineDirective({
  type: _PageItemDirective,
  selectors: [["", "cPageItem", ""]],
  contentQueries: function PageItemDirective_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, PageLinkDirective, 5, ElementRef);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.pageLinkElementRef = _t.first);
    }
  },
  hostAttrs: [1, "page-item"],
  hostVars: 3,
  hostBindings: function PageItemDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-current", ctx.ariaCurrent);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    active: "active",
    disabled: "disabled"
  },
  standalone: true,
  features: [ɵɵNgOnChangesFeature]
});
var PageItemDirective = _PageItemDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PageItemDirective, [{
    type: Directive,
    args: [{
      selector: "[cPageItem]",
      standalone: true,
      host: {
        class: "page-item"
      }
    }]
  }], () => [{
    type: Renderer2
  }], {
    active: [{
      type: Input
    }],
    disabled: [{
      type: Input
    }],
    ariaCurrent: [{
      type: HostBinding,
      args: ["attr.aria-current"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    pageLinkElementRef: [{
      type: ContentChild,
      args: [PageLinkDirective, {
        read: ElementRef
      }]
    }]
  });
})();
var _PageItemComponent = class _PageItemComponent extends PageItemDirective {
};
_PageItemComponent.ɵfac = /* @__PURE__ */ (() => {
  let ɵPageItemComponent_BaseFactory;
  return function PageItemComponent_Factory(__ngFactoryType__) {
    return (ɵPageItemComponent_BaseFactory || (ɵPageItemComponent_BaseFactory = ɵɵgetInheritedFactory(_PageItemComponent)))(__ngFactoryType__ || _PageItemComponent);
  };
})();
_PageItemComponent.ɵcmp = ɵɵdefineComponent({
  type: _PageItemComponent,
  selectors: [["c-page-item"]],
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function PageItemComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: [_c6]
});
var PageItemComponent = _PageItemComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PageItemComponent, [{
    type: Component,
    args: [{
      selector: "c-page-item",
      template: "<ng-content />",
      standalone: true,
      styles: [":host{display:list-item;text-align:-webkit-match-parent;text-align:match-parent}\n"]
    }]
  }], null, null);
})();
var _PaginationComponent = class _PaginationComponent {
  constructor() {
    this.align = "";
    this.role = "navigation";
  }
  get paginationClass() {
    return {
      pagination: true,
      [`pagination-${this.size}`]: !!this.size,
      [`justify-content-${this.align}`]: !!this.align
    };
  }
};
_PaginationComponent.ɵfac = function PaginationComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PaginationComponent)();
};
_PaginationComponent.ɵcmp = ɵɵdefineComponent({
  type: _PaginationComponent,
  selectors: [["c-pagination"]],
  hostVars: 1,
  hostBindings: function PaginationComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role);
    }
  },
  inputs: {
    align: "align",
    size: "size",
    role: "role"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 2,
  vars: 1,
  consts: [[3, "ngClass"]],
  template: function PaginationComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "ul", 0);
      ɵɵprojection(1);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵproperty("ngClass", ctx.paginationClass);
    }
  },
  dependencies: [NgClass],
  encapsulation: 2
});
var PaginationComponent = _PaginationComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaginationComponent, [{
    type: Component,
    args: [{
      selector: "c-pagination",
      standalone: true,
      imports: [NgClass],
      template: '<ul [ngClass]="paginationClass">\n  <ng-content />\n</ul>\n'
    }]
  }], null, {
    align: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }, {
      type: Input
    }]
  });
})();
var _PaginationModule = class _PaginationModule {
};
_PaginationModule.ɵfac = function PaginationModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PaginationModule)();
};
_PaginationModule.ɵmod = ɵɵdefineNgModule({
  type: _PaginationModule,
  imports: [PageItemComponent, PageItemDirective, PageLinkDirective, PaginationComponent],
  exports: [PageItemComponent, PageItemDirective, PageLinkDirective, PaginationComponent]
});
_PaginationModule.ɵinj = ɵɵdefineInjector({});
var PaginationModule = _PaginationModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PaginationModule, [{
    type: NgModule,
    args: [{
      exports: [PageItemComponent, PageItemDirective, PageLinkDirective, PaginationComponent],
      imports: [PageItemComponent, PageItemDirective, PageLinkDirective, PaginationComponent]
    }]
  }], null, null);
})();
var _PlaceholderDirective = class _PlaceholderDirective {
  constructor() {
    this.visible = input(false, {
      transform: booleanAttribute,
      alias: "cPlaceholder"
    });
    this.size = input(void 0, {
      alias: "cPlaceholderSize"
    });
    this.ariaHidden = computed(() => {
      return this.visible() ? null : true;
    });
    this.hostClasses = computed(() => {
      return {
        placeholder: this.visible(),
        [`placeholder-${this.size()}`]: !!this.size()
      };
    });
  }
};
_PlaceholderDirective.ɵfac = function PlaceholderDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PlaceholderDirective)();
};
_PlaceholderDirective.ɵdir = ɵɵdefineDirective({
  type: _PlaceholderDirective,
  selectors: [["", "cPlaceholder", ""]],
  hostVars: 3,
  hostBindings: function PlaceholderDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-hidden", ctx.ariaHidden());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    visible: [1, "cPlaceholder", "visible"],
    size: [1, "cPlaceholderSize", "size"]
  },
  exportAs: ["cPlaceholder"],
  standalone: true
});
var PlaceholderDirective = _PlaceholderDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlaceholderDirective, [{
    type: Directive,
    args: [{
      selector: "[cPlaceholder]",
      exportAs: "cPlaceholder",
      standalone: true,
      host: {
        "[class]": "hostClasses()",
        "[attr.aria-hidden]": "ariaHidden()"
      }
    }]
  }], null, null);
})();
var _PlaceholderAnimationDirective = class _PlaceholderAnimationDirective {
  constructor() {
    this.animation = input(void 0, {
      alias: "cPlaceholderAnimation"
    });
    this.placeholder = contentChild(PlaceholderDirective);
    this.hostClasses = computed(() => {
      return {
        [`placeholder-${this.animation()}`]: this.placeholder()?.visible() && !!this.animation()
      };
    });
  }
};
_PlaceholderAnimationDirective.ɵfac = function PlaceholderAnimationDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PlaceholderAnimationDirective)();
};
_PlaceholderAnimationDirective.ɵdir = ɵɵdefineDirective({
  type: _PlaceholderAnimationDirective,
  selectors: [["", "cPlaceholderAnimation", ""]],
  contentQueries: function PlaceholderAnimationDirective_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuerySignal(dirIndex, ctx.placeholder, PlaceholderDirective, 5);
    }
    if (rf & 2) {
      ɵɵqueryAdvance();
    }
  },
  hostVars: 2,
  hostBindings: function PlaceholderAnimationDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    animation: [1, "cPlaceholderAnimation", "animation"]
  },
  standalone: true
});
var PlaceholderAnimationDirective = _PlaceholderAnimationDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlaceholderAnimationDirective, [{
    type: Directive,
    args: [{
      selector: "[cPlaceholderAnimation]",
      standalone: true,
      host: {
        "[class]": "hostClasses()"
      }
    }]
  }], null, null);
})();
var _PlaceholderModule = class _PlaceholderModule {
};
_PlaceholderModule.ɵfac = function PlaceholderModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PlaceholderModule)();
};
_PlaceholderModule.ɵmod = ɵɵdefineNgModule({
  type: _PlaceholderModule,
  imports: [PlaceholderDirective, PlaceholderAnimationDirective],
  exports: [PlaceholderDirective, PlaceholderAnimationDirective]
});
_PlaceholderModule.ɵinj = ɵɵdefineInjector({});
var PlaceholderModule = _PlaceholderModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PlaceholderModule, [{
    type: NgModule,
    args: [{
      imports: [PlaceholderDirective, PlaceholderAnimationDirective],
      exports: [PlaceholderDirective, PlaceholderAnimationDirective]
    }]
  }], null, null);
})();
var _PopoverComponent = class _PopoverComponent {
  constructor() {
    this.renderer = inject(Renderer2);
    this.content = input("");
    this.contentEffect = effect(() => {
      this.updateView(this.content());
    });
    this.visible = input(false, {
      transform: booleanAttribute
    });
    this.id = input();
    this.role = input("tooltip");
    this.viewContainerRef = viewChild("popoverTemplate", {
      read: ViewContainerRef
    });
    this.hostClasses = computed(() => {
      return {
        popover: true,
        fade: true,
        show: this.visible(),
        "bs-popover-auto": true
      };
    });
  }
  ngOnDestroy() {
    this.clear();
  }
  clear() {
    this.viewContainerRef()?.clear();
    if (!!this.textNode) {
      this.renderer.removeChild(this.textNode.parentNode, this.textNode);
    }
  }
  updateView(content) {
    this.clear();
    if (!content) {
      return;
    }
    if (content instanceof TemplateRef) {
      this.viewContainerRef()?.createEmbeddedView(content);
    } else {
      const textNodeContent = this.renderer.createText(content);
      this.textNode = this.renderer.createElement("div");
      this.renderer.addClass(this.textNode, "popover-body");
      this.renderer.appendChild(this.textNode, textNodeContent);
      const element = this.viewContainerRef()?.element.nativeElement;
      this.renderer.appendChild(element.parentNode, this.textNode);
    }
  }
};
_PopoverComponent.ɵfac = function PopoverComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PopoverComponent)();
};
_PopoverComponent.ɵcmp = ɵɵdefineComponent({
  type: _PopoverComponent,
  selectors: [["c-popover"]],
  viewQuery: function PopoverComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuerySignal(ctx.viewContainerRef, _c7, 5, ViewContainerRef);
    }
    if (rf & 2) {
      ɵɵqueryAdvance();
    }
  },
  hostAttrs: [1, "popover", "fade", "bs-popover-auto"],
  hostVars: 4,
  hostBindings: function PopoverComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role())("id", ctx.id());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    content: [1, "content"],
    visible: [1, "visible"],
    id: [1, "id"],
    role: [1, "role"]
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  decls: 4,
  vars: 3,
  consts: [["popoverTemplate", ""], ["data-popper-arrow", "", 3, "ngClass"]],
  template: function PopoverComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelementContainerStart(0);
      ɵɵelement(1, "div", 1);
      ɵɵelementContainer(2, null, 0);
      ɵɵelementContainerEnd();
    }
    if (rf & 2) {
      ɵɵadvance();
      ɵɵproperty("ngClass", ɵɵpureFunction1(1, _c8, !!ctx.content()));
    }
  },
  dependencies: [NgClass],
  encapsulation: 2
});
var PopoverComponent = _PopoverComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PopoverComponent, [{
    type: Component,
    args: [{
      selector: "c-popover",
      standalone: true,
      imports: [NgClass],
      host: {
        class: "popover fade bs-popover-auto",
        "[class]": "hostClasses()",
        "[attr.role]": "role()",
        "[attr.id]": "id()"
      },
      template: `<ng-container>
  <div [ngClass]="{'popover-arrow': !!content()}" data-popper-arrow></div>
  <ng-container #popoverTemplate />
</ng-container>
`
    }]
  }], null, null);
})();
var _destroyRef8, _document4;
var _PopoverDirective = class _PopoverDirective {
  constructor(renderer, hostElement, viewContainerRef, listenersService, changeDetectorRef, intersectionService) {
    __privateAdd(this, _destroyRef8);
    __privateAdd(this, _document4);
    this.renderer = renderer;
    this.hostElement = hostElement;
    this.viewContainerRef = viewContainerRef;
    this.listenersService = listenersService;
    this.changeDetectorRef = changeDetectorRef;
    this.intersectionService = intersectionService;
    this.content = input(void 0, {
      alias: "cPopover"
    });
    this.contentEffect = effect(() => {
      if (this.content()) {
        this.destroyTooltipElement();
      }
    });
    this.popperOptions = input({}, {
      alias: "cPopoverOptions"
    });
    this.popperOptionsEffect = effect(() => {
      this._popperOptions = __spreadValues(__spreadProps(__spreadValues({}, this._popperOptions), {
        placement: this.placement()
      }), this.popperOptions());
    });
    this.popperOptionsComputed = computed(() => {
      return __spreadValues({
        placement: this.placement()
      }, this._popperOptions);
    });
    this.placement = input("top", {
      alias: "cPopoverPlacement"
    });
    this.reference = input(void 0, {
      alias: "cTooltipRef"
    });
    this.referenceRef = computed(() => this.reference()?.elementRef ?? this.hostElement);
    this.trigger = input("hover", {
      alias: "cPopoverTrigger"
    });
    this.visible = model(false, {
      alias: "cPopoverVisible"
    });
    this.visibleEffect = effect(() => {
      this.visible() ? this.addTooltipElement() : this.removeTooltipElement();
    });
    this._popperOptions = {
      modifiers: [{
        name: "offset",
        options: {
          offset: [0, 9]
        }
      }]
    };
    __privateSet(this, _destroyRef8, inject(DestroyRef));
    __privateSet(this, _document4, inject(DOCUMENT));
  }
  get ariaDescribedBy() {
    return this.tooltipId ? this.tooltipId : null;
  }
  ngAfterViewInit() {
    this.intersectionServiceSubscribe();
  }
  ngOnDestroy() {
    this.clearListeners();
    this.destroyTooltipElement();
  }
  ngOnInit() {
    this.setListeners();
  }
  setListeners() {
    const config = {
      hostElement: this.hostElement,
      trigger: this.trigger(),
      callbackToggle: () => {
        this.visible.set(!this.visible());
      },
      callbackOff: () => {
        this.visible.set(false);
      },
      callbackOn: () => {
        this.visible.set(true);
      }
    };
    this.listenersService.setListeners(config);
  }
  clearListeners() {
    this.listenersService.clearListeners();
  }
  intersectionServiceSubscribe() {
    this.intersectionService.createIntersectionObserver(this.referenceRef());
    this.intersectionService.intersecting$.pipe(filter((next) => next.hostElement === this.referenceRef()), debounceTime(100), finalize(() => {
      this.intersectionService.unobserve(this.referenceRef());
    }), takeUntilDestroyed(__privateGet(this, _destroyRef8))).subscribe((next) => {
      this.visible.set(next.isIntersecting ? this.visible() : false);
    });
  }
  getUID(prefix) {
    let uid = prefix ?? "random-id";
    do {
      uid = `${prefix}-${Math.floor(Math.random() * 1e6).toString(10)}`;
    } while (__privateGet(this, _document4).getElementById(uid));
    return uid;
  }
  createTooltipElement() {
    if (!this.tooltipRef) {
      this.tooltipRef = this.viewContainerRef.createComponent(PopoverComponent);
    }
  }
  destroyTooltipElement() {
    this.tooltip?.remove();
    this.tooltipRef?.destroy();
    this.tooltipRef = void 0;
    this.popperInstance?.destroy();
    this.viewContainerRef?.detach();
    this.viewContainerRef?.clear();
  }
  addTooltipElement() {
    if (!this.content()) {
      this.destroyTooltipElement();
      return;
    }
    if (!this.tooltipRef) {
      this.createTooltipElement();
    }
    this.tooltipRef?.setInput("content", this.content() ?? "");
    this.tooltip = this.tooltipRef?.location.nativeElement;
    this.renderer.addClass(this.tooltip, "d-none");
    this.renderer.addClass(this.tooltip, "fade");
    this.popperInstance?.destroy();
    this.viewContainerRef.insert(this.tooltipRef.hostView);
    this.renderer.appendChild(__privateGet(this, _document4).body, this.tooltip);
    this.popperInstance = createPopper3(this.referenceRef().nativeElement, this.tooltip, __spreadValues({}, this.popperOptionsComputed()));
    if (!this.visible()) {
      this.removeTooltipElement();
      return;
    }
    setTimeout(() => {
      this.tooltipId = this.getUID("popover");
      this.tooltipRef?.setInput("id", this.tooltipId);
      this.renderer.removeClass(this.tooltip, "d-none");
      this.tooltipRef?.setInput("visible", this.visible());
      this.popperInstance?.forceUpdate();
      this.changeDetectorRef?.markForCheck();
    }, 100);
  }
  removeTooltipElement() {
    this.tooltipId = "";
    if (!this.tooltipRef) {
      return;
    }
    this.tooltipRef.setInput("visible", false);
    this.tooltipRef.setInput("id", void 0);
    this.changeDetectorRef.markForCheck();
    setTimeout(() => {
      this.viewContainerRef?.detach();
    }, 300);
  }
};
_destroyRef8 = new WeakMap();
_document4 = new WeakMap();
_PopoverDirective.ɵfac = function PopoverDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PopoverDirective)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(ViewContainerRef), ɵɵdirectiveInject(ListenersService), ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(IntersectionService));
};
_PopoverDirective.ɵdir = ɵɵdefineDirective({
  type: _PopoverDirective,
  selectors: [["", "cPopover", ""]],
  hostVars: 1,
  hostBindings: function PopoverDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-describedby", ctx.ariaDescribedBy);
    }
  },
  inputs: {
    content: [1, "cPopover", "content"],
    popperOptions: [1, "cPopoverOptions", "popperOptions"],
    placement: [1, "cPopoverPlacement", "placement"],
    reference: [1, "cTooltipRef", "reference"],
    trigger: [1, "cPopoverTrigger", "trigger"],
    visible: [1, "cPopoverVisible", "visible"]
  },
  outputs: {
    visible: "cPopoverVisibleChange"
  },
  exportAs: ["cPopover"],
  standalone: true,
  features: [ɵɵProvidersFeature([ListenersService, IntersectionService])]
});
var PopoverDirective = _PopoverDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PopoverDirective, [{
    type: Directive,
    args: [{
      selector: "[cPopover]",
      exportAs: "cPopover",
      providers: [ListenersService, IntersectionService],
      standalone: true,
      host: {
        "[attr.aria-describedby]": "ariaDescribedBy"
      }
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: ViewContainerRef
  }, {
    type: ListenersService
  }, {
    type: ChangeDetectorRef
  }, {
    type: IntersectionService
  }], null);
})();
var _PopoverModule = class _PopoverModule {
};
_PopoverModule.ɵfac = function PopoverModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PopoverModule)();
};
_PopoverModule.ɵmod = ɵɵdefineNgModule({
  type: _PopoverModule,
  imports: [PopoverDirective, PopoverComponent],
  exports: [PopoverDirective, PopoverComponent]
});
_PopoverModule.ɵinj = ɵɵdefineInjector({});
var PopoverModule = _PopoverModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PopoverModule, [{
    type: NgModule,
    args: [{
      exports: [PopoverDirective, PopoverComponent],
      imports: [PopoverDirective, PopoverComponent]
    }]
  }], null, null);
})();
var _renderer3, _hostElement2, _max, _min, _value, _width, _valuesEffect;
var _ProgressBarDirective = class _ProgressBarDirective {
  constructor() {
    __privateAdd(this, _renderer3);
    __privateAdd(this, _hostElement2);
    __privateAdd(this, _max);
    __privateAdd(this, _min);
    __privateAdd(this, _value);
    __privateAdd(this, _width);
    __privateAdd(this, _valuesEffect);
    __privateSet(this, _renderer3, inject(Renderer2));
    __privateSet(this, _hostElement2, inject(ElementRef));
    __privateSet(this, _max, signal(100));
    __privateSet(this, _min, 0);
    __privateSet(this, _value, signal(void 0));
    __privateSet(this, _width, signal(void 0));
    this.percent = computed(() => {
      return +(((__privateGet(this, _value).call(this) ?? __privateGet(this, _width).call(this) ?? 0) - __privateGet(this, _min)) / (__privateGet(this, _max).call(this) - __privateGet(this, _min)) * 100).toFixed(this.precision);
    });
    __privateSet(this, _valuesEffect, effect(() => {
      const host = __privateGet(this, _hostElement2).nativeElement;
      if (__privateGet(this, _value).call(this) === void 0 || __privateGet(this, _width).call(this)) {
        for (const name of ["aria-valuenow", "aria-valuemax", "aria-valuemin", "role"]) {
          __privateGet(this, _renderer3).removeAttribute(host, name);
        }
      } else {
        __privateGet(this, _renderer3).setAttribute(host, "aria-valuenow", String(__privateGet(this, _value).call(this)));
        __privateGet(this, _renderer3).setAttribute(host, "aria-valuemin", String(__privateGet(this, _min)));
        __privateGet(this, _renderer3).setAttribute(host, "aria-valuemax", String(__privateGet(this, _max).call(this)));
        __privateGet(this, _renderer3).setAttribute(host, "role", this.role);
      }
      const tagName = host.tagName;
      if (this.percent() >= 0 && (this.stacked && tagName === "C-PROGRESS" || !this.stacked && tagName !== "C-PROGRESS")) {
        __privateGet(this, _renderer3).setStyle(host, "width", `${this.percent()}%`);
      } else {
        __privateGet(this, _renderer3).removeStyle(host, "width");
      }
    }));
    this.precision = 0;
    this.stacked = false;
    this.role = "progressbar";
  }
  /**
   * The percent value the ProgressBar.
   * @type number
   * @default 0
   */
  set value(value) {
    __privateGet(this, _value).set(value);
  }
  get value() {
    return __privateGet(this, _value).call(this);
  }
  set width(value) {
    __privateGet(this, _width).set(value);
  }
  /**
   * The max value of the ProgressBar.
   * @type number
   * @default 100
   */
  set max(max2) {
    __privateGet(this, _max).set(isNaN(max2) || max2 <= 0 ? 100 : max2);
  }
};
_renderer3 = new WeakMap();
_hostElement2 = new WeakMap();
_max = new WeakMap();
_min = new WeakMap();
_value = new WeakMap();
_width = new WeakMap();
_valuesEffect = new WeakMap();
_ProgressBarDirective.ɵfac = function ProgressBarDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ProgressBarDirective)();
};
_ProgressBarDirective.ɵdir = ɵɵdefineDirective({
  type: _ProgressBarDirective,
  selectors: [["", "cProgressBar", ""]],
  inputs: {
    animated: [2, "animated", "animated", booleanAttribute],
    color: "color",
    precision: [2, "precision", "precision", numberAttribute],
    value: [2, "value", "value", numberAttribute],
    width: [2, "width", "width", numberAttribute],
    variant: "variant",
    max: [2, "max", "max", numberAttribute],
    stacked: [2, "stacked", "stacked", booleanAttribute],
    role: "role"
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var ProgressBarDirective = _ProgressBarDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressBarDirective, [{
    type: Directive,
    args: [{
      selector: "[cProgressBar]",
      standalone: true
    }]
  }], null, {
    animated: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    color: [{
      type: Input
    }],
    precision: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    value: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    width: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    variant: [{
      type: Input
    }],
    max: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    stacked: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    role: [{
      type: Input
    }]
  });
})();
var _progressBarDirective;
var _ProgressBarComponent = class _ProgressBarComponent {
  constructor() {
    __privateAdd(this, _progressBarDirective, inject(ProgressBarDirective, {
      optional: true
    }));
  }
  get hostClasses() {
    const animated = __privateGet(this, _progressBarDirective)?.animated;
    const color = __privateGet(this, _progressBarDirective)?.color;
    const variant = __privateGet(this, _progressBarDirective)?.variant;
    return {
      "progress-bar": true,
      "progress-bar-animated": !!animated,
      [`progress-bar-${variant}`]: !!variant,
      [`bg-${color}`]: !!color
    };
  }
};
_progressBarDirective = new WeakMap();
_ProgressBarComponent.ɵfac = function ProgressBarComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ProgressBarComponent)();
};
_ProgressBarComponent.ɵcmp = ɵɵdefineComponent({
  type: _ProgressBarComponent,
  selectors: [["c-progress-bar"]],
  hostAttrs: [1, "progress-bar"],
  hostVars: 2,
  hostBindings: function ProgressBarComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  standalone: true,
  features: [ɵɵHostDirectivesFeature([{
    directive: ProgressBarDirective,
    inputs: ["animated", "animated", "color", "color", "max", "max", "role", "role", "stacked", "stacked", "value", "value", "variant", "variant", "width", "width"]
  }]), ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ProgressBarComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2,
  changeDetection: 0
});
var ProgressBarComponent = _ProgressBarComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressBarComponent, [{
    type: Component,
    args: [{
      selector: "c-progress-bar",
      template: "<ng-content />",
      standalone: true,
      hostDirectives: [{
        directive: ProgressBarDirective,
        inputs: ["animated", "color", "max", "role", "stacked", "value", "variant", "width"]
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "progress-bar"
      }
    }]
  }], null, {
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _ProgressStackedComponent = class _ProgressStackedComponent {
  constructor() {
    this.stacked = true;
  }
};
_ProgressStackedComponent.ɵfac = function ProgressStackedComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ProgressStackedComponent)();
};
_ProgressStackedComponent.ɵcmp = ɵɵdefineComponent({
  type: _ProgressStackedComponent,
  selectors: [["c-progress-stacked"]],
  hostVars: 2,
  hostBindings: function ProgressStackedComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassProp("progress-stacked", ctx.stacked);
    }
  },
  inputs: {
    stacked: "stacked"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ProgressStackedComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:flex}"],
  changeDetection: 0
});
var ProgressStackedComponent = _ProgressStackedComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressStackedComponent, [{
    type: Component,
    args: [{
      selector: "c-progress-stacked",
      standalone: true,
      template: "<ng-content />",
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [":host{display:flex}\n"]
    }]
  }], null, {
    stacked: [{
      type: Input
    }, {
      type: HostBinding,
      args: ["class.progress-stacked"]
    }]
  });
})();
var _stacked, _elementRef3;
var _ProgressComponent = class _ProgressComponent {
  constructor() {
    __privateAdd(this, _stacked);
    __privateAdd(this, _elementRef3);
    this.pbd = inject(ProgressBarDirective, {
      optional: true
    });
    __privateSet(this, _stacked, inject(ProgressStackedComponent, {
      optional: true
    })?.stacked);
    __privateSet(this, _elementRef3, inject(ElementRef));
    this.height = 0;
    this.thin = false;
    this.white = false;
    if (this.pbd) {
      this.pbd.stacked = __privateGet(this, _stacked);
    }
  }
  get hostClasses() {
    return {
      progress: true,
      "progress-thin": this.thin,
      "progress-white": this.white
    };
  }
  get hostStyle() {
    return !!this.height ? `${this.height}px` : __privateGet(this, _elementRef3)?.nativeElement?.style?.height ?? void 0;
  }
};
_stacked = new WeakMap();
_elementRef3 = new WeakMap();
_ProgressComponent.ɵfac = function ProgressComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ProgressComponent)();
};
_ProgressComponent.ɵcmp = ɵɵdefineComponent({
  type: _ProgressComponent,
  selectors: [["c-progress"]],
  contentQueries: function ProgressComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, ProgressBarComponent, 4);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.contentProgressBars = _t);
    }
  },
  hostAttrs: [1, "progress"],
  hostVars: 4,
  hostBindings: function ProgressComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
      ɵɵstyleProp("height", ctx.hostStyle);
    }
  },
  inputs: {
    height: [2, "height", "height", numberAttribute],
    thin: [2, "thin", "thin", booleanAttribute],
    white: [2, "white", "white", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵHostDirectivesFeature([{
    directive: ProgressBarDirective,
    inputs: ["animated", "animated", "color", "color", "max", "max", "role", "role", "value", "value", "variant", "variant"]
  }]), ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 5,
  vars: 1,
  consts: [["defaultContent", ""], ["stacked", "", 3, "animated", "variant", "color"], [3, "width", "animated", "variant", "color"], [4, "ngTemplateOutlet"]],
  template: function ProgressComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵtemplate(0, ProgressComponent_Conditional_0_Template, 1, 1, "ng-container")(1, ProgressComponent_Conditional_1_Template, 2, 4, "c-progress-bar", 1)(2, ProgressComponent_Conditional_2_Template, 2, 5, "c-progress-bar", 2)(3, ProgressComponent_ng_template_3_Template, 1, 0, "ng-template", null, 0, ɵɵtemplateRefExtractor);
    }
    if (rf & 2) {
      ɵɵconditional(ctx.contentProgressBars.length ? 0 : (ctx.pbd == null ? null : ctx.pbd.stacked) ? 1 : 2);
    }
  },
  dependencies: [ProgressBarComponent, NgTemplateOutlet],
  styles: [".progress-stacked.progress[_nghost-%COMP%], .progress-stacked   .progress[_nghost-%COMP%]{transition:var(--cui-progress-bar-transition)}"],
  changeDetection: 0
});
var ProgressComponent = _ProgressComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressComponent, [{
    type: Component,
    args: [{
      selector: "c-progress",
      imports: [ProgressBarComponent, NgTemplateOutlet],
      standalone: true,
      hostDirectives: [{
        directive: ProgressBarDirective,
        inputs: ["animated", "color", "max", "role", "value", "variant"]
      }],
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        class: "progress"
      },
      template: '@if (contentProgressBars.length) {\n  <ng-container *ngTemplateOutlet="defaultContent" />\n} @else if (pbd?.stacked) {\n  <c-progress-bar [animated]="pbd?.animated" [variant]="pbd?.variant" [color]="pbd?.color" stacked>\n    <ng-container *ngTemplateOutlet="defaultContent" />\n  </c-progress-bar>\n} @else {\n  <c-progress-bar [width]="pbd?.percent()" [animated]="pbd?.animated" [variant]="pbd?.variant" [color]="pbd?.color">\n    <ng-container *ngTemplateOutlet="defaultContent" />\n  </c-progress-bar>\n}\n\n<ng-template #defaultContent>\n  <ng-content />\n</ng-template>\n\n',
      styles: [":host-context(.progress-stacked).progress{transition:var(--cui-progress-bar-transition)}\n"]
    }]
  }], () => [], {
    contentProgressBars: [{
      type: ContentChildren,
      args: [ProgressBarComponent]
    }],
    height: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    thin: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    white: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    hostStyle: [{
      type: HostBinding,
      args: ["style.height"]
    }]
  });
})();
var _ProgressModule = class _ProgressModule {
};
_ProgressModule.ɵfac = function ProgressModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ProgressModule)();
};
_ProgressModule.ɵmod = ɵɵdefineNgModule({
  type: _ProgressModule,
  imports: [ProgressComponent, ProgressBarComponent, ProgressBarDirective, ProgressStackedComponent],
  exports: [ProgressComponent, ProgressBarComponent, ProgressBarDirective, ProgressStackedComponent]
});
_ProgressModule.ɵinj = ɵɵdefineInjector({});
var ProgressModule = _ProgressModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProgressModule, [{
    type: NgModule,
    args: [{
      exports: [ProgressComponent, ProgressBarComponent, ProgressBarDirective, ProgressStackedComponent],
      imports: [ProgressComponent, ProgressBarComponent, ProgressBarDirective, ProgressStackedComponent]
    }]
  }], null, null);
})();
var _SidebarService = class _SidebarService {
  constructor() {
    this.sidebarState = new BehaviorSubject({});
    this.sidebarState$ = this.sidebarState.asObservable();
  }
  toggle(action) {
    this.sidebarState.next(action);
  }
};
_SidebarService.ɵfac = function SidebarService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarService)();
};
_SidebarService.ɵprov = ɵɵdefineInjectable({
  token: _SidebarService,
  factory: _SidebarService.ɵfac,
  providedIn: "root"
});
var SidebarService = _SidebarService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _SidebarBackdropService = class _SidebarBackdropService {
  constructor(document2, sidebarService) {
    this.document = document2;
    this.sidebarService = sidebarService;
    this.clickListener = () => {
    };
  }
  setBackdrop(sidebar) {
    const backdrop = this.document.getElementsByClassName("sidebar-backdrop");
    if (backdrop.length === 0) {
      this.backdrop = this.renderer.createElement("div");
      this.renderer.addClass(this.backdrop, "sidebar-backdrop");
      this.renderer.appendChild(this.document.body, this.backdrop);
      this.clickListener = this.renderer.listen(this.backdrop, "click", (e) => {
        this.sidebarService.toggle({
          toggle: "visible",
          sidebar
        });
      });
    }
    if (this.backdrop && sidebar.sidebarState.mobile && sidebar.sidebarState.visible) {
      this.renderer.addClass(this.backdrop, "fade");
      this.renderer.addClass(this.backdrop, "show");
    } else {
      this.renderer.removeClass(this.backdrop, "show");
      this.renderer.removeClass(this.backdrop, "fade");
    }
  }
  clearBackdrop() {
    if (this.backdrop) {
      this.clickListener();
      this.renderer.removeChild(this.document.body, this.backdrop);
      this.backdrop = void 0;
    }
  }
};
_SidebarBackdropService.ɵfac = function SidebarBackdropService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarBackdropService)(ɵɵinject(DOCUMENT), ɵɵinject(SidebarService));
};
_SidebarBackdropService.ɵprov = ɵɵdefineInjectable({
  token: _SidebarBackdropService,
  factory: _SidebarBackdropService.ɵfac,
  providedIn: "root"
});
var SidebarBackdropService = _SidebarBackdropService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarBackdropService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: SidebarService
  }], null);
})();
var _visible4, _onMobile, _layoutChangeSubscription2, _stateToggleSubscription, _stateInitial;
var _SidebarComponent = class _SidebarComponent {
  constructor(document2, renderer, breakpointObserver, sidebarService, backdropService) {
    __privateAdd(this, _visible4);
    __privateAdd(this, _onMobile);
    __privateAdd(this, _layoutChangeSubscription2);
    __privateAdd(this, _stateToggleSubscription);
    __privateAdd(this, _stateInitial);
    this.document = document2;
    this.renderer = renderer;
    this.breakpointObserver = breakpointObserver;
    this.sidebarService = sidebarService;
    this.backdropService = backdropService;
    __privateSet(this, _visible4, false);
    __privateSet(this, _onMobile, false);
    this.state = {
      sidebar: this
    };
    __privateSet(this, _stateInitial, {
      narrow: false,
      visible: false,
      unfoldable: false
    });
    this.narrow = false;
    this.overlaid = false;
    this.position = "fixed";
    this.unfoldable = false;
    this.visibleChange = new EventEmitter();
    this.backdropService.renderer = renderer;
  }
  /**
   * Toggle the visibility of sidebar component. [docs]
   * @type boolean
   * @default false
   */
  set visible(value) {
    const visible = value;
    if (__privateGet(this, _visible4) !== visible) {
      __privateSet(this, _visible4, visible);
      this.visibleChange.emit(__privateGet(this, _visible4));
    }
  }
  get visible() {
    return __privateGet(this, _visible4);
  }
  set sidebarState(value) {
    const newState = value;
    if ("toggle" in newState) {
      if (newState.toggle === "visible") {
        newState.visible = !this.state.visible;
        this.visible = newState.visible;
      } else if (newState.toggle === "unfoldable") {
        newState.unfoldable = !this.state.unfoldable;
        this.unfoldable = newState.unfoldable;
      }
    } else {
      this.visible = (newState.visible ?? this.visible) && !this.overlaid;
    }
    this.state = __spreadValues(__spreadValues({}, this.state), newState);
    this.state.mobile && this.state.visible ? this.backdropService.setBackdrop(this) : this.backdropService.clearBackdrop();
  }
  get sidebarState() {
    return this.state;
  }
  get getMobileBreakpoint() {
    const element = this.document.documentElement;
    const mobileBreakpoint = this.document.defaultView?.getComputedStyle(element)?.getPropertyValue("--cui-mobile-breakpoint") ?? "md";
    const breakpointValue = this.document.defaultView?.getComputedStyle(element)?.getPropertyValue(`--cui-breakpoint-${mobileBreakpoint.trim()}`) ?? "768px";
    return `${parseFloat(breakpointValue.trim()) - 0.02}px`;
  }
  get getClasses() {
    const {
      mobile,
      visible
    } = this.sidebarState;
    return {
      sidebar: true,
      "sidebar-fixed": this.position === "fixed" && !mobile,
      "sidebar-narrow": this.narrow && !this.unfoldable,
      "sidebar-narrow-unfoldable": this.unfoldable,
      "sidebar-overlaid": this.overlaid,
      [`sidebar-${this.placement}`]: !!this.placement,
      [`sidebar-${this.colorScheme}`]: !!this.colorScheme,
      [`sidebar-${this.size}`]: !!this.size,
      show: visible,
      // show: visible && this.#onMobile, //todo: check
      hide: !visible
    };
  }
  ngOnInit() {
    this.setInitialState();
    this.layoutChangeSubscribe();
    this.stateToggleSubscribe();
  }
  ngOnDestroy() {
    this.stateToggleSubscribe(false);
    this.layoutChangeSubscribe(false);
  }
  ngOnChanges(changes) {
    const oldStateMap = new Map(Object.entries(this.state));
    const newStateMap = /* @__PURE__ */ new Map();
    newStateMap.set("sidebar", this);
    const propList = ["visible", "unfoldable", "narrow"];
    for (const propName in changes) {
      if (propList.includes(propName)) {
        if (changes[propName] && !changes[propName].firstChange) {
          const value = booleanAttribute(changes[propName].currentValue);
          if (oldStateMap.get(propName) !== value) {
            newStateMap.set(propName, value);
          }
        }
      }
    }
    if (newStateMap.size > 1) {
      const state2 = Object.fromEntries(newStateMap.entries());
      this.sidebarService.toggle(state2);
    }
  }
  setInitialState() {
    __privateSet(this, _stateInitial, {
      narrow: this.narrow,
      visible: this.visible,
      unfoldable: this.unfoldable
    });
    this.sidebarService.toggle(__spreadProps(__spreadValues({}, __privateGet(this, _stateInitial)), {
      sidebar: this
    }));
  }
  stateToggleSubscribe(subscribe = true) {
    if (subscribe) {
      __privateSet(this, _stateToggleSubscription, this.sidebarService.sidebarState$.subscribe((state2) => {
        if (this === state2.sidebar || this.id === state2.id) {
          this.sidebarState = state2;
        }
      }));
    } else {
      __privateGet(this, _stateToggleSubscription)?.unsubscribe();
    }
  }
  layoutChangeSubscribe(subscribe = true) {
    const onMobile = `(max-width: ${this.getMobileBreakpoint})`;
    if (subscribe) {
      const layoutChanges = this.breakpointObserver.observe([onMobile]);
      __privateSet(this, _layoutChangeSubscription2, layoutChanges.subscribe((result) => {
        const isOnMobile = result.breakpoints[onMobile];
        const isUnfoldable = isOnMobile ? false : this.unfoldable;
        if (__privateGet(this, _onMobile) !== isOnMobile) {
          __privateSet(this, _onMobile, isOnMobile);
          this.sidebarService.toggle({
            mobile: isOnMobile,
            unfoldable: isUnfoldable,
            visible: isOnMobile ? !isOnMobile : __privateGet(this, _stateInitial).visible,
            sidebar: this
          });
        }
      }));
    } else {
      __privateGet(this, _layoutChangeSubscription2)?.unsubscribe();
    }
  }
};
_visible4 = new WeakMap();
_onMobile = new WeakMap();
_layoutChangeSubscription2 = new WeakMap();
_stateToggleSubscription = new WeakMap();
_stateInitial = new WeakMap();
_SidebarComponent.ɵfac = function SidebarComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarComponent)(ɵɵdirectiveInject(DOCUMENT), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(BreakpointObserver), ɵɵdirectiveInject(SidebarService), ɵɵdirectiveInject(SidebarBackdropService));
};
_SidebarComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarComponent,
  selectors: [["c-sidebar"]],
  hostAttrs: [1, "sidebar"],
  hostVars: 2,
  hostBindings: function SidebarComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.getClasses);
    }
  },
  inputs: {
    colorScheme: "colorScheme",
    id: "id",
    narrow: [2, "narrow", "narrow", booleanAttribute],
    overlaid: [2, "overlaid", "overlaid", booleanAttribute],
    placement: "placement",
    position: "position",
    size: "size",
    unfoldable: [2, "unfoldable", "unfoldable", booleanAttribute],
    visible: [2, "visible", "visible", booleanAttribute]
  },
  outputs: {
    visibleChange: "visibleChange"
  },
  exportAs: ["cSidebar"],
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵNgOnChangesFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function SidebarComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var SidebarComponent = _SidebarComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar",
      exportAs: "cSidebar",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "sidebar"
      }
    }]
  }], () => [{
    type: Document,
    decorators: [{
      type: Inject,
      args: [DOCUMENT]
    }]
  }, {
    type: Renderer2
  }, {
    type: BreakpointObserver
  }, {
    type: SidebarService
  }, {
    type: SidebarBackdropService
  }], {
    colorScheme: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    narrow: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    overlaid: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    placement: [{
      type: Input
    }],
    position: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    unfoldable: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    visible: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    visibleChange: [{
      type: Output
    }],
    getClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _SidebarBrandComponent = class _SidebarBrandComponent {
  constructor() {
    this.sidebarBrandClass = true;
    this.brandImg = false;
  }
  ngOnInit() {
    this.brandImg = Boolean(this.brandFull || this.brandNarrow);
  }
};
_SidebarBrandComponent.ɵfac = function SidebarBrandComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarBrandComponent)();
};
_SidebarBrandComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarBrandComponent,
  selectors: [["c-sidebar-brand"]],
  hostVars: 2,
  hostBindings: function SidebarBrandComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassProp("sidebar-brand", ctx.sidebarBrandClass);
    }
  },
  inputs: {
    brandFull: "brandFull",
    brandNarrow: "brandNarrow",
    routerLink: "routerLink"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 2,
  vars: 1,
  consts: [[3, "routerLink"], [3, "cHtmlAttr", "ngClass"]],
  template: function SidebarBrandComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵtemplate(0, SidebarBrandComponent_Conditional_0_Template, 3, 3, "a", 0)(1, SidebarBrandComponent_Conditional_1_Template, 1, 0);
    }
    if (rf & 2) {
      ɵɵconditional(ctx.brandImg ? 0 : 1);
    }
  },
  dependencies: [RouterLink, HtmlAttributesDirective, NgClass],
  encapsulation: 2
});
var SidebarBrandComponent = _SidebarBrandComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarBrandComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar-brand",
      standalone: true,
      imports: [RouterLink, HtmlAttributesDirective, NgClass],
      template: `@if (brandImg) {
  <a [routerLink]="routerLink">
    @if (brandFull) {
      <img [cHtmlAttr]="brandFull" [ngClass]="'sidebar-brand-full'">
    }
    @if (brandNarrow) {
      <img [cHtmlAttr]="brandNarrow" [ngClass]="'sidebar-brand-narrow'">
    }
  </a>
} @else {
  <ng-content />
}
`
    }]
  }], null, {
    brandFull: [{
      type: Input
    }],
    brandNarrow: [{
      type: Input
    }],
    routerLink: [{
      type: Input
    }],
    sidebarBrandClass: [{
      type: HostBinding,
      args: ["class.sidebar-brand"]
    }]
  });
})();
var _SidebarToggleDirective = class _SidebarToggleDirective {
  constructor(sidebarService) {
    this.sidebarService = sidebarService;
    this.toggle = "visible";
  }
  toggleOpen($event) {
    $event.preventDefault();
    this.sidebarService.toggle({
      toggle: this.toggle,
      id: this.id
    });
  }
};
_SidebarToggleDirective.ɵfac = function SidebarToggleDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarToggleDirective)(ɵɵdirectiveInject(SidebarService));
};
_SidebarToggleDirective.ɵdir = ɵɵdefineDirective({
  type: _SidebarToggleDirective,
  selectors: [["", "cSidebarToggle", ""]],
  hostBindings: function SidebarToggleDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function SidebarToggleDirective_click_HostBindingHandler($event) {
        return ctx.toggleOpen($event);
      });
    }
  },
  inputs: {
    id: [0, "cSidebarToggle", "id"],
    toggle: "toggle"
  },
  exportAs: ["cSidebarToggle"],
  standalone: true
});
var SidebarToggleDirective = _SidebarToggleDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarToggleDirective, [{
    type: Directive,
    args: [{
      selector: "[cSidebarToggle]",
      exportAs: "cSidebarToggle",
      standalone: true
    }]
  }], () => [{
    type: SidebarService
  }], {
    id: [{
      type: Input,
      args: ["cSidebarToggle"]
    }],
    toggle: [{
      type: Input
    }],
    toggleOpen: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }]
  });
})();
var _SidebarTogglerDirective = class _SidebarTogglerDirective {
  constructor() {
    this.role = "button";
    this.sidebarTogglerClass = true;
  }
  get getStyles() {
    return {
      appearance: "button",
      "align-items": "flex-start",
      cursor: "pointer"
    };
  }
};
_SidebarTogglerDirective.ɵfac = function SidebarTogglerDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarTogglerDirective)();
};
_SidebarTogglerDirective.ɵdir = ɵɵdefineDirective({
  type: _SidebarTogglerDirective,
  selectors: [["", "cSidebarToggler", ""]],
  hostVars: 5,
  hostBindings: function SidebarTogglerDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role);
      ɵɵstyleMap(ctx.getStyles);
      ɵɵclassProp("sidebar-toggler", ctx.sidebarTogglerClass);
    }
  },
  inputs: {
    role: "role"
  },
  standalone: true,
  features: [ɵɵHostDirectivesFeature([{
    directive: SidebarToggleDirective,
    inputs: ["cSidebarToggle", "cSidebarToggler", "toggle", "toggle"]
  }])]
});
var SidebarTogglerDirective = _SidebarTogglerDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarTogglerDirective, [{
    type: Directive,
    args: [{
      selector: "[cSidebarToggler]",
      standalone: true,
      hostDirectives: [{
        directive: SidebarToggleDirective,
        inputs: ["cSidebarToggle: cSidebarToggler", "toggle"]
      }]
    }]
  }], null, {
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }, {
      type: Input
    }],
    sidebarTogglerClass: [{
      type: HostBinding,
      args: ["class.sidebar-toggler"]
    }],
    getStyles: [{
      type: HostBinding,
      args: ["style"]
    }]
  });
})();
var _SidebarHeaderComponent = class _SidebarHeaderComponent {
};
_SidebarHeaderComponent.ɵfac = function SidebarHeaderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarHeaderComponent)();
};
_SidebarHeaderComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarHeaderComponent,
  selectors: [["c-sidebar-header"]],
  hostAttrs: [1, "sidebar-header"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function SidebarHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var SidebarHeaderComponent = _SidebarHeaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarHeaderComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar-header",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "sidebar-header"
      }
    }]
  }], null, null);
})();
var _SidebarFooterComponent = class _SidebarFooterComponent {
};
_SidebarFooterComponent.ɵfac = function SidebarFooterComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarFooterComponent)();
};
_SidebarFooterComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarFooterComponent,
  selectors: [["c-sidebar-footer"]],
  hostAttrs: [1, "sidebar-footer"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function SidebarFooterComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var SidebarFooterComponent = _SidebarFooterComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarFooterComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar-footer",
      template: "<ng-content />",
      standalone: true,
      host: {
        class: "sidebar-footer"
      }
    }]
  }], null, null);
})();
var _SidebarNavService = class _SidebarNavService {
};
_SidebarNavService.ɵfac = function SidebarNavService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavService)();
};
_SidebarNavService.ɵprov = ɵɵdefineInjectable({
  token: _SidebarNavService,
  factory: _SidebarNavService.ɵfac
});
var SidebarNavService = _SidebarNavService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavService, [{
    type: Injectable
  }], null, null);
})();
var _SidebarNavHelper = class _SidebarNavHelper {
  constructor() {
    this.hasBadge = (item) => Boolean(item.badge);
    this.hasIcon = (item) => Boolean(item.icon) || item.icon === "";
    this.hasIconComponent = (item) => Boolean(item.iconComponent);
  }
  itemType(item) {
    if (item.divider) {
      return "divider";
    } else if (item.title) {
      return "title";
    } else if (item.children && item.children.length > 0) {
      return "group";
    } else if (item.label) {
      return "label";
    } else if (!Object.keys(item).length) {
      return "empty";
    } else {
      return "link";
    }
  }
  isActive(router, item) {
    return router.isActive(item.url, false);
  }
  getIconClass(item) {
    const classes = {
      "nav-icon": true
    };
    const icon = item.icon;
    classes[icon] = this.hasIcon(item);
    return classes;
  }
};
_SidebarNavHelper.ɵfac = function SidebarNavHelper_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavHelper)();
};
_SidebarNavHelper.ɵprov = ɵɵdefineInjectable({
  token: _SidebarNavHelper,
  factory: _SidebarNavHelper.ɵfac
});
var SidebarNavHelper = _SidebarNavHelper;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavHelper, [{
    type: Injectable
  }], null, null);
})();
var _SidebarNavGroupService = class _SidebarNavGroupService {
  constructor() {
    this.sidebarNavGroupState = new BehaviorSubject({});
    this.sidebarNavGroupState$ = this.sidebarNavGroupState.asObservable();
  }
  toggle(action) {
    this.sidebarNavGroupState.next(action);
  }
};
_SidebarNavGroupService.ɵfac = function SidebarNavGroupService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavGroupService)();
};
_SidebarNavGroupService.ɵprov = ɵɵdefineInjectable({
  token: _SidebarNavGroupService,
  factory: _SidebarNavGroupService.ɵfac
});
var SidebarNavGroupService = _SidebarNavGroupService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavGroupService, [{
    type: Injectable
  }], null, null);
})();
var _SidebarNavIconPipe = class _SidebarNavIconPipe {
  transform(item, args) {
    const icon = item.icon;
    return {
      "nav-icon": true,
      [`${icon}`]: !!icon
    };
  }
};
_SidebarNavIconPipe.ɵfac = function SidebarNavIconPipe_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavIconPipe)();
};
_SidebarNavIconPipe.ɵpipe = ɵɵdefinePipe({
  name: "cSidebarNavIcon",
  type: _SidebarNavIconPipe,
  pure: true,
  standalone: true
});
var SidebarNavIconPipe = _SidebarNavIconPipe;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavIconPipe, [{
    type: Pipe,
    args: [{
      name: "cSidebarNavIcon",
      standalone: true
    }]
  }], null, null);
})();
var _SidebarNavBadgePipe = class _SidebarNavBadgePipe {
  transform(item, args) {
    const badge = item.badge;
    return {
      badge: true,
      "ms-auto": true,
      "badge-sm": !badge.size,
      [`badge-${badge.size}`]: !!badge.size,
      [`bg-${badge.color}`]: !!badge.color,
      [`${badge.class}`]: !!badge.class
    };
  }
};
_SidebarNavBadgePipe.ɵfac = function SidebarNavBadgePipe_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavBadgePipe)();
};
_SidebarNavBadgePipe.ɵpipe = ɵɵdefinePipe({
  name: "cSidebarNavBadge",
  type: _SidebarNavBadgePipe,
  pure: true,
  standalone: true
});
var SidebarNavBadgePipe = _SidebarNavBadgePipe;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavBadgePipe, [{
    type: Pipe,
    args: [{
      name: "cSidebarNavBadge",
      standalone: true
    }]
  }], null, null);
})();
var _SidebarNavLinkPipe = class _SidebarNavLinkPipe {
  transform(item) {
    const disabled = item?.attributes?.disabled;
    return {
      "nav-link": true,
      disabled,
      "btn-link": disabled,
      [`nav-link-${item.variant}`]: !!item.variant
    };
  }
};
_SidebarNavLinkPipe.ɵfac = function SidebarNavLinkPipe_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavLinkPipe)();
};
_SidebarNavLinkPipe.ɵpipe = ɵɵdefinePipe({
  name: "cSidebarNavLink",
  type: _SidebarNavLinkPipe,
  pure: true,
  standalone: true
});
var SidebarNavLinkPipe = _SidebarNavLinkPipe;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavLinkPipe, [{
    type: Pipe,
    args: [{
      name: "cSidebarNavLink",
      standalone: true
    }]
  }], null, null);
})();
var _SidebarNavLinkContentComponent = class _SidebarNavLinkContentComponent {
  constructor(helper) {
    this.helper = helper;
  }
};
_SidebarNavLinkContentComponent.ɵfac = function SidebarNavLinkContentComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavLinkContentComponent)(ɵɵdirectiveInject(SidebarNavHelper));
};
_SidebarNavLinkContentComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarNavLinkContentComponent,
  selectors: [["c-sidebar-nav-link-content"]],
  inputs: {
    item: "item"
  },
  standalone: true,
  features: [ɵɵProvidersFeature([SidebarNavHelper]), ɵɵStandaloneFeature],
  decls: 1,
  vars: 1,
  template: function SidebarNavLinkContentComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵtemplate(0, SidebarNavLinkContentComponent_Conditional_0_Template, 2, 1, "ng-container");
    }
    if (rf & 2) {
      ɵɵconditional(true ? 0 : -1);
    }
  },
  encapsulation: 2
});
var SidebarNavLinkContentComponent = _SidebarNavLinkContentComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavLinkContentComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar-nav-link-content",
      template: `
    @if (true) {
      <ng-container>{{ item?.name ?? '' }}</ng-container>
    }
  `,
      providers: [SidebarNavHelper],
      standalone: true
    }]
  }], () => [{
    type: SidebarNavHelper
  }], {
    item: [{
      type: Input
    }]
  });
})();
var _SidebarNavLinkComponent = class _SidebarNavLinkComponent {
  set item(item) {
    this._item = JSON.parse(JSON.stringify(item));
  }
  get item() {
    return this._item;
  }
  constructor(router) {
    this.router = router;
    this._item = {};
    this.linkClick = new EventEmitter();
    this.navigationEndObservable = router.events.pipe(filter((event) => {
      return event instanceof NavigationEnd;
    }));
  }
  ngOnInit() {
    this.url = typeof this.item.url === "string" ? this.item.url : this.router.serializeUrl(this.router.createUrlTree(this.item.url));
    this.linkType = this.getLinkType();
    this.href = this.isDisabled() ? "" : this.item.href || this.url;
    this.linkActive = this.router.url.split(/[?#(;]/)[0] === this.href.split(/[?#(;]/)[0];
    this.navSubscription = this.navigationEndObservable.subscribe((event) => {
      const itemUrlArray = this.href.split(/[?#(;]/)[0].split("/");
      const urlArray = event.urlAfterRedirects.split(/[?#(;]/)[0].split("/");
      this.linkActive = itemUrlArray.every((value, index) => value === urlArray[index]);
    });
  }
  ngOnDestroy() {
    this.navSubscription?.unsubscribe();
  }
  getLinkType() {
    return this.isDisabled() ? "disabled" : this.isExternalLink() ? "external" : "link";
  }
  isDisabled() {
    return this.item?.attributes?.["disabled"];
  }
  isExternalLink() {
    const linkPath = Array.isArray(this.item.url) ? this.item.url[0] : this.item.url;
    return !!this.item.href || linkPath.substring(0, 4) === "http";
  }
  linkClicked() {
    this.linkClick.emit();
  }
};
_SidebarNavLinkComponent.ɵfac = function SidebarNavLinkComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavLinkComponent)(ɵɵdirectiveInject(Router));
};
_SidebarNavLinkComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarNavLinkComponent,
  selectors: [["c-sidebar-nav-link"]],
  inputs: {
    item: "item"
  },
  outputs: {
    linkClick: "linkClick"
  },
  standalone: true,
  features: [ɵɵProvidersFeature([SidebarNavHelper]), ɵɵStandaloneFeature],
  decls: 5,
  vars: 1,
  consts: [["iconTemplate", ""], [3, "cHtmlAttr", "ngClass"], [3, "cHtmlAttr", "href", "ngClass"], ["routerLinkActive", "active", 3, "cHtmlAttr", "fragment", "ngClass", "preserveFragment", "queryParamsHandling", "queryParams", "replaceUrl", "routerLinkActiveOptions", "routerLink", "skipLocationChange", "state", "target"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [3, "item"], [3, "ngClass"], [3, "click", "cHtmlAttr", "href", "ngClass"], ["routerLinkActive", "active", 3, "click", "cHtmlAttr", "fragment", "ngClass", "preserveFragment", "queryParamsHandling", "queryParams", "replaceUrl", "routerLinkActiveOptions", "routerLink", "skipLocationChange", "state", "target"], [1, "nav-icon"], [3, "cIcon", "customClasses", "name"]],
  template: function SidebarNavLinkComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵtemplate(0, SidebarNavLinkComponent_Case_0_Template, 5, 11, "a", 1)(1, SidebarNavLinkComponent_Case_1_Template, 5, 12, "a", 2)(2, SidebarNavLinkComponent_Case_2_Template, 5, 23, "a", 3)(3, SidebarNavLinkComponent_ng_template_3_Template, 3, 3, "ng-template", null, 0, ɵɵtemplateRefExtractor);
    }
    if (rf & 2) {
      let tmp_1_0;
      ɵɵconditional((tmp_1_0 = ctx.linkType) === "disabled" ? 0 : tmp_1_0 === "external" ? 1 : 2);
    }
  },
  dependencies: [RouterModule, RouterLink, RouterLinkActive, HtmlAttributesDirective, IconDirective, SidebarNavLinkContentComponent, SidebarNavLinkPipe, SidebarNavBadgePipe, SidebarNavIconPipe, NgTemplateOutlet, NgClass],
  encapsulation: 2
});
var SidebarNavLinkComponent = _SidebarNavLinkComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavLinkComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar-nav-link",
      providers: [SidebarNavHelper],
      standalone: true,
      imports: [RouterModule, HtmlAttributesDirective, IconDirective, SidebarNavLinkContentComponent, SidebarNavLinkPipe, SidebarNavBadgePipe, SidebarNavIconPipe, NgTemplateOutlet, NgClass],
      template: `@switch (linkType) {
  @case ('disabled') {
    <a [cHtmlAttr]="item.attributes ?? {}" [ngClass]="item | cSidebarNavLink">
      <ng-container *ngTemplateOutlet="iconTemplate; context: {$implicit: item}" />
      <c-sidebar-nav-link-content [item]="item" />
      @if (item.badge) {
        <span [ngClass]="item | cSidebarNavBadge">{{ item.badge?.text }}</span>
      }
    </a>
  }
  @case ('external') {
    <a (click)="linkClicked()" [cHtmlAttr]="item.attributes ?? {}" [href]="href" [ngClass]="item | cSidebarNavLink">
      <ng-container *ngTemplateOutlet="iconTemplate; context: {$implicit: item}" />
      <c-sidebar-nav-link-content [item]="item" />
      @if (item.badge) {
        <span [ngClass]="item | cSidebarNavBadge">{{ item.badge?.text }}</span>
      }
    </a>
  }
  @default {
    <a (click)="linkClicked()"
       [cHtmlAttr]="item.attributes ?? {}"
       [fragment]="item.linkProps?.fragment"
       [ngClass]="item | cSidebarNavLink"
       [preserveFragment]="item.linkProps?.preserveFragment ?? false"
       [queryParamsHandling]="item.linkProps?.queryParamsHandling"
       [queryParams]="item.linkProps?.queryParams ?? null"
       [replaceUrl]="item.linkProps?.replaceUrl ?? false"
       [routerLinkActiveOptions]="item.linkProps?.routerLinkActiveOptions ?? { exact: false }"
       [routerLink]="item.url"
       [skipLocationChange]="item.linkProps?.skipLocationChange ?? false"
       [state]="item.linkProps?.state ?? {}"
       [target]="item.attributes?.['target']"
       routerLinkActive="active"
    >
      <!--    [class.active]="linkActive"-->
      <ng-container *ngTemplateOutlet="iconTemplate ; context: {$implicit: item}" />
      <c-sidebar-nav-link-content [item]="item" />
      @if (item.badge) {
        <span [ngClass]="item | cSidebarNavBadge">{{ item.badge?.text }}</span>
      }
    </a>
  }
}
<ng-template #iconTemplate let-item>
  <!--  <i *ngIf="item?.icon" [ngClass]="item | cSidebarNavIcon"></i>-->
  @if (item?.icon) {
    <span class="nav-icon">
      <span [ngClass]="item.icon ?? ''"></span>
    </span>
  }
  @if (item?.iconComponent) {
    <svg
      [cIcon]="item.iconComponent?.content"
      [customClasses]="item | cSidebarNavIcon"
      [name]="item.iconComponent?.name"
    ></svg>
  }
  @if (!item?.icon && !item?.iconComponent) {
    <span [ngClass]="item | cSidebarNavIcon"></span>
  }
</ng-template>
`
    }]
  }], () => [{
    type: Router
  }], {
    item: [{
      type: Input
    }],
    linkClick: [{
      type: Output
    }]
  });
})();
var _SidebarNavLabelComponent = class _SidebarNavLabelComponent {
  constructor(helper) {
    this.helper = helper;
    this.classes = {
      "c-nav-label": true,
      "c-active": true
    };
    this.iconClasses = {};
  }
  ngOnInit() {
    this.iconClasses = this.helper.getIconClass(this.item);
  }
  getItemClass() {
    const itemClass = this.item.class;
    this.classes[itemClass] = !!itemClass;
    return this.classes;
  }
  getLabelIconClass() {
    const variant = `text-${this.item.label.variant}`;
    this.iconClasses[variant] = !!this.item.label.variant;
    const labelClass = this.item.label.class;
    this.iconClasses[labelClass] = !!labelClass;
    return this.iconClasses;
  }
};
_SidebarNavLabelComponent.ɵfac = function SidebarNavLabelComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavLabelComponent)(ɵɵdirectiveInject(SidebarNavHelper));
};
_SidebarNavLabelComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarNavLabelComponent,
  selectors: [["c-sidebar-nav-label"]],
  inputs: {
    item: "item"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  decls: 5,
  vars: 6,
  consts: [[3, "cHtmlAttr", "ngClass", "href"], [3, "ngClass"]],
  template: function SidebarNavLabelComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelementStart(0, "a", 0);
      ɵɵtemplate(1, SidebarNavLabelComponent_Conditional_1_Template, 1, 1, "i", 1);
      ɵɵelementContainerStart(2);
      ɵɵtext(3);
      ɵɵelementContainerEnd();
      ɵɵtemplate(4, SidebarNavLabelComponent_Conditional_4_Template, 3, 4, "span", 1);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵpropertyInterpolate("href", ctx.item.url, ɵɵsanitizeUrl);
      ɵɵproperty("cHtmlAttr", ctx.item.attributes)("ngClass", ctx.getItemClass());
      ɵɵadvance();
      ɵɵconditional(ctx.helper.hasIcon(ctx.item) ? 1 : -1);
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.item.name);
      ɵɵadvance();
      ɵɵconditional(ctx.helper.hasBadge(ctx.item) ? 4 : -1);
    }
  },
  dependencies: [HtmlAttributesDirective, SidebarNavBadgePipe, NgClass],
  encapsulation: 2
});
var SidebarNavLabelComponent = _SidebarNavLabelComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavLabelComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar-nav-label",
      standalone: true,
      imports: [HtmlAttributesDirective, SidebarNavBadgePipe, NgClass],
      template: '<a [cHtmlAttr]="item.attributes"\n   [ngClass]="getItemClass()"\n   href="{{item.url}}">\n  @if (helper.hasIcon(item)) {\n    <i [ngClass]="getLabelIconClass()"></i>\n  }\n  <ng-container>{{ item.name }}</ng-container>\n  @if (helper.hasBadge(item)) {\n    <span [ngClass]="item | cSidebarNavBadge">{{ item.badge.text }}</span>\n  }\n</a>\n'
    }]
  }], () => [{
    type: SidebarNavHelper
  }], {
    item: [{
      type: Input
    }]
  });
})();
var _SidebarNavTitleComponent = class _SidebarNavTitleComponent {
  constructor(el, renderer) {
    this.el = el;
    this.renderer = renderer;
  }
  ngOnInit() {
    const nativeElement = this.el.nativeElement;
    const name = this.renderer.createText(this.item.name);
    if (this.item.class) {
      const classes = this.item.class;
      this.renderer.addClass(nativeElement, classes);
    }
    if (this.item.wrapper) {
      const wrapper = this.renderer.createElement(this.item.wrapper.element);
      this.addAttribs(this.item.wrapper.attributes, wrapper);
      this.renderer.appendChild(wrapper, name);
      this.renderer.appendChild(nativeElement, wrapper);
    } else {
      this.renderer.appendChild(nativeElement, name);
    }
  }
  addAttribs(attribs, element) {
    if (attribs) {
      for (const attr in attribs) {
        if (attr === "style" && typeof attribs[attr] === "object") {
          this.setStyle(attribs[attr], element);
        } else if (attr === "class") {
          this.addClass(attribs[attr], element);
        } else {
          this.setAttrib(attr, attribs[attr], element);
        }
      }
    }
  }
  setStyle(styles, el) {
    for (const style2 in styles) {
      if (style2) {
        this.renderer.setStyle(el, style2, styles[style2]);
      }
    }
  }
  addClass(classes, el) {
    const classArray = Array.isArray(classes) ? classes : classes.split(" ");
    classArray.filter((element) => element.length > 0).forEach((element) => {
      this.renderer.addClass(el, element);
    });
  }
  setAttrib(key, value, el) {
    this.renderer.setAttribute(el, key, value);
  }
};
_SidebarNavTitleComponent.ɵfac = function SidebarNavTitleComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavTitleComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2));
};
_SidebarNavTitleComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarNavTitleComponent,
  selectors: [["c-sidebar-nav-title"]],
  inputs: {
    item: "item"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  decls: 0,
  vars: 0,
  template: function SidebarNavTitleComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
var SidebarNavTitleComponent = _SidebarNavTitleComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavTitleComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar-nav-title",
      template: "",
      standalone: true
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }], {
    item: [{
      type: Input
    }]
  });
})();
var _SidebarNavDividerComponent = class _SidebarNavDividerComponent {
};
_SidebarNavDividerComponent.ɵfac = function SidebarNavDividerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavDividerComponent)();
};
_SidebarNavDividerComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarNavDividerComponent,
  selectors: [["c-sidebar-nav-divider"]],
  inputs: {
    item: "item"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  decls: 0,
  vars: 0,
  template: function SidebarNavDividerComponent_Template(rf, ctx) {
  },
  encapsulation: 2
});
var SidebarNavDividerComponent = _SidebarNavDividerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavDividerComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar-nav-divider",
      template: ``,
      standalone: true
    }]
  }], null, {
    item: [{
      type: Input
    }]
  });
})();
var _SidebarNavItemClassPipe = class _SidebarNavItemClassPipe {
  constructor(helper) {
    this.helper = helper;
  }
  // transform(item: any, ...args: any[]): any {
  transform(item, args) {
    const itemType = this.helper.itemType(item);
    let itemClass;
    if (["divider", "title"].includes(itemType)) {
      itemClass = `nav-${itemType}`;
    } else if (itemType === "group") {
      itemClass = "";
    } else {
      itemClass = "nav-item";
    }
    return item.class ? `${itemClass} ${item.class}` : itemClass;
  }
};
_SidebarNavItemClassPipe.ɵfac = function SidebarNavItemClassPipe_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavItemClassPipe)(ɵɵdirectiveInject(SidebarNavHelper, 16));
};
_SidebarNavItemClassPipe.ɵpipe = ɵɵdefinePipe({
  name: "cSidebarNavItemClass",
  type: _SidebarNavItemClassPipe,
  pure: true,
  standalone: true
});
var SidebarNavItemClassPipe = _SidebarNavItemClassPipe;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavItemClassPipe, [{
    type: Pipe,
    args: [{
      name: "cSidebarNavItemClass",
      standalone: true
    }]
  }], () => [{
    type: SidebarNavHelper
  }], null);
})();
var _SidebarNavGroupComponent = class _SidebarNavGroupComponent {
  constructor(router, renderer, hostElement, helper, sidebarNavGroupService) {
    this.router = router;
    this.renderer = renderer;
    this.hostElement = hostElement;
    this.helper = helper;
    this.sidebarNavGroupService = sidebarNavGroupService;
    this.dropdownMode = "path";
    this.navItems = [];
    this.display = {
      display: "block"
    };
    this.navigationEndObservable = router.events.pipe(filter((event) => event instanceof NavigationEnd));
  }
  get hostClasses() {
    return {
      "nav-group": true,
      show: this.open
    };
  }
  ngOnInit() {
    this.navItems = [...this.item.children];
    this.navSubscription = this.navigationEndObservable.subscribe((event) => {
      if (this.dropdownMode !== "none") {
        const samePath = this.samePath(event.url);
        this.openGroup(samePath);
      }
    });
    if (this.samePath(this.router.routerState.snapshot.url)) {
      this.openGroup(true);
    }
    this.navGroupSubscription = this.sidebarNavGroupService.sidebarNavGroupState$.subscribe((next) => {
      if (this.dropdownMode === "close" && next.sidebarNavGroup && next.sidebarNavGroup !== this) {
        if (next.sidebarNavGroup.item.url.startsWith(this.item.url)) {
          return;
        }
        if (this.samePath(this.router.routerState.snapshot.url)) {
          this.openGroup(true);
          return;
        }
        this.openGroup(false);
      }
    });
  }
  samePath(url) {
    const itemArray = this.item.url?.split("/");
    const urlArray = url.split("/");
    return itemArray?.every((value, index) => {
      return value === urlArray[index];
    });
  }
  openGroup(open) {
    this.open = open;
  }
  toggleGroup($event) {
    $event.preventDefault();
    this.openGroup(!this.open);
    if (this.open) {
      this.sidebarNavGroupService.toggle({
        open: this.open,
        sidebarNavGroup: this
      });
    }
  }
  ngOnDestroy() {
    this.navSubscription?.unsubscribe();
  }
  onAnimationStart($event) {
    this.display = {
      display: "block"
    };
    if ($event.toState === "open") {
      const host = this.sidebarNav.nativeElement;
      this.renderer.setStyle(host, "height", `${host["scrollHeight"]}px`);
    }
  }
  onAnimationDone($event) {
    if ($event.toState === "open") {
      const host = this.sidebarNav.nativeElement;
      this.renderer.setStyle(host, "height", "auto");
    }
    if ($event.toState === "closed") {
      setTimeout(() => {
        this.display = null;
      });
    }
  }
};
_SidebarNavGroupComponent.ɵfac = function SidebarNavGroupComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavGroupComponent)(ɵɵdirectiveInject(Router), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(SidebarNavHelper), ɵɵdirectiveInject(SidebarNavGroupService));
};
_SidebarNavGroupComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarNavGroupComponent,
  selectors: [["c-sidebar-nav-group"]],
  viewQuery: function SidebarNavGroupComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(SidebarNavComponent, 5, ElementRef);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.sidebarNav = _t.first);
    }
  },
  hostVars: 2,
  hostBindings: function SidebarNavGroupComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    item: "item",
    dropdownMode: "dropdownMode",
    show: "show",
    compact: [2, "compact", "compact", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵProvidersFeature([SidebarNavHelper, SidebarNavGroupService]), ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  decls: 8,
  vars: 13,
  consts: [["iconTemplate", ""], ["href", "", 1, "nav-link", "nav-group-toggle", 3, "click", "cHtmlAttr"], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], [3, "ngClass"], [3, "compact", "dropdownMode", "groupItems", "navItems", "ngStyle"], [1, "nav-icon"], [3, "cIcon", "customClasses", "name"]],
  template: function SidebarNavGroupComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = ɵɵgetCurrentView();
      ɵɵelementStart(0, "a", 1);
      ɵɵlistener("click", function SidebarNavGroupComponent_Template_a_click_0_listener($event) {
        ɵɵrestoreView(_r1);
        return ɵɵresetView(ctx.toggleGroup($event));
      });
      ɵɵtemplate(1, SidebarNavGroupComponent_ng_container_1_Template, 1, 0, "ng-container", 2);
      ɵɵelementContainerStart(2);
      ɵɵtext(3);
      ɵɵelementContainerEnd();
      ɵɵtemplate(4, SidebarNavGroupComponent_Conditional_4_Template, 3, 4, "span", 3);
      ɵɵelementEnd();
      ɵɵelementStart(5, "c-sidebar-nav", 4);
      ɵɵlistener("@openClose.done", function SidebarNavGroupComponent_Template_c_sidebar_nav_animation_openClose_done_5_listener($event) {
        ɵɵrestoreView(_r1);
        return ɵɵresetView(ctx.onAnimationDone($event));
      })("@openClose.start", function SidebarNavGroupComponent_Template_c_sidebar_nav_animation_openClose_start_5_listener($event) {
        ɵɵrestoreView(_r1);
        return ɵɵresetView(ctx.onAnimationStart($event));
      });
      ɵɵelementEnd();
      ɵɵtemplate(6, SidebarNavGroupComponent_ng_template_6_Template, 3, 3, "ng-template", null, 0, ɵɵtemplateRefExtractor);
    }
    if (rf & 2) {
      const iconTemplate_r4 = ɵɵreference(7);
      ɵɵproperty("cHtmlAttr", ctx.item.attributes);
      ɵɵadvance();
      ɵɵproperty("ngTemplateOutlet", iconTemplate_r4)("ngTemplateOutletContext", ɵɵpureFunction1(11, _c9, ctx.item));
      ɵɵadvance(2);
      ɵɵtextInterpolate(ctx.item.name);
      ɵɵadvance();
      ɵɵconditional(ctx.helper.hasBadge(ctx.item) ? 4 : -1);
      ɵɵadvance();
      ɵɵproperty("@openClose", ctx.open ? "open" : "closed")("compact", ctx.compact)("dropdownMode", ctx.dropdownMode)("groupItems", true)("navItems", ctx.navItems)("ngStyle", ctx.display);
    }
  },
  dependencies: () => [HtmlAttributesDirective, IconDirective, NgTemplateOutlet, NgClass, SidebarNavIconPipe, SidebarNavBadgePipe, SidebarNavComponent, NgStyle],
  styles: [".nav-group-toggle[_ngcontent-%COMP%]{cursor:pointer}.nav-group-items[_ngcontent-%COMP%]{display:block}"],
  data: {
    animation: [trigger("openClose", [state("open", style({
      height: "*"
    })), state("closed", style({
      height: "0px"
    })), transition("open <=> closed", [animate(".15s ease")])])]
  }
});
var SidebarNavGroupComponent = _SidebarNavGroupComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavGroupComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar-nav-group",
      providers: [SidebarNavHelper, SidebarNavGroupService],
      standalone: true,
      imports: [HtmlAttributesDirective, IconDirective, NgTemplateOutlet, NgClass, SidebarNavIconPipe, SidebarNavBadgePipe, forwardRef(() => SidebarNavComponent), NgStyle],
      animations: [trigger("openClose", [state("open", style({
        height: "*"
      })), state("closed", style({
        height: "0px"
      })), transition("open <=> closed", [animate(".15s ease")])])],
      template: `<a (click)="toggleGroup($event)"
   [cHtmlAttr]="item.attributes"
   class="nav-link nav-group-toggle"
   href>
  <ng-container *ngTemplateOutlet="iconTemplate ; context: {$implicit: item}" />
  <ng-container>{{ item.name }}</ng-container>
  @if (helper.hasBadge(item)) {
    <span [ngClass]="item | cSidebarNavBadge">{{ item.badge.text }}</span>
  }
</a>
<c-sidebar-nav
  (@openClose.done)="onAnimationDone($event)"
  (@openClose.start)="onAnimationStart($event)"
  [@openClose]="open ? 'open' : 'closed'"
  [compact]="compact"
  [dropdownMode]="dropdownMode"
  [groupItems]="true"
  [navItems]="navItems"
  [ngStyle]="display"
/>

<ng-template #iconTemplate let-item>
  <!--  <i *ngIf="item?.icon" [ngClass]="item | cSidebarNavIcon"></i>-->
  @if (item?.icon) {
    <span class="nav-icon">
    <span [ngClass]="item.icon ?? ''"></span>
  </span>
  }
  @if (item?.iconComponent) {
    <svg
      [cIcon]="item.iconComponent?.content"
      [customClasses]="item | cSidebarNavIcon"
      [name]="item.iconComponent?.name"
    />
  }
  @if (!item?.icon && !item?.iconComponent) {
    <span [ngClass]="item | cSidebarNavIcon"></span>
  }
</ng-template>
`,
      styles: [".nav-group-toggle{cursor:pointer}.nav-group-items{display:block}\n"]
    }]
  }], () => [{
    type: Router
  }, {
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: SidebarNavHelper
  }, {
    type: SidebarNavGroupService
  }], {
    item: [{
      type: Input
    }],
    dropdownMode: [{
      type: Input
    }],
    show: [{
      type: Input
    }],
    compact: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    sidebarNav: [{
      type: ViewChild,
      args: [forwardRef(() => SidebarNavComponent), {
        read: ElementRef
      }]
    }]
  });
})();
var _SidebarNavComponent = class _SidebarNavComponent {
  constructor(sidebar, helper, router, renderer, hostElement, sidebarService) {
    this.sidebar = sidebar;
    this.helper = helper;
    this.router = router;
    this.renderer = renderer;
    this.hostElement = hostElement;
    this.sidebarService = sidebarService;
    this.navItems = [];
    this.dropdownMode = "path";
    this.role = "navigation";
    this.navItemsArray = [];
  }
  get hostClasses() {
    return {
      "sidebar-nav": !this.groupItems,
      "nav-group-items": this.groupItems,
      compact: this.groupItems && this.compact
    };
  }
  ngOnChanges(changes) {
    this.navItemsArray = Array.isArray(this.navItems) ? this.navItems.slice() : [];
  }
  hideMobile() {
    if (this.sidebar && this.sidebar.sidebarState.mobile) {
      this.sidebarService.toggle({
        toggle: "visible",
        sidebar: this.sidebar
      });
    }
  }
};
_SidebarNavComponent.ɵfac = function SidebarNavComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarNavComponent)(ɵɵdirectiveInject(SidebarComponent, 8), ɵɵdirectiveInject(SidebarNavHelper), ɵɵdirectiveInject(Router), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(SidebarService));
};
_SidebarNavComponent.ɵcmp = ɵɵdefineComponent({
  type: _SidebarNavComponent,
  selectors: [["c-sidebar-nav"]],
  hostVars: 3,
  hostBindings: function SidebarNavComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    navItems: "navItems",
    dropdownMode: "dropdownMode",
    groupItems: [2, "groupItems", "groupItems", booleanAttribute],
    compact: [2, "compact", "compact", booleanAttribute],
    role: "role"
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵNgOnChangesFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 3,
  vars: 0,
  consts: [["rla", "routerLinkActive"], ["routerLinkActive", "show", 3, "dropdownMode", "item", "ngClass", "routerLinkActiveOptions", "compact"], [3, "cHtmlAttr", "item", "ngClass"], [3, "item", "ngClass"], [3, "linkClick", "item", "ngClass"]],
  template: function SidebarNavComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵrepeaterCreate(0, SidebarNavComponent_For_1_Template, 6, 1, null, null, ɵɵrepeaterTrackByIdentity);
      ɵɵprojection(2);
    }
    if (rf & 2) {
      ɵɵrepeater(ctx.navItemsArray);
    }
  },
  dependencies: [NgClass, HtmlAttributesDirective, SidebarNavLinkComponent, SidebarNavLabelComponent, SidebarNavTitleComponent, SidebarNavDividerComponent, SidebarNavGroupComponent, SidebarNavItemClassPipe, RouterModule, RouterLinkActive],
  encapsulation: 2
});
var SidebarNavComponent = _SidebarNavComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarNavComponent, [{
    type: Component,
    args: [{
      selector: "c-sidebar-nav",
      standalone: true,
      imports: [NgClass, HtmlAttributesDirective, SidebarNavLinkComponent, SidebarNavLabelComponent, SidebarNavTitleComponent, SidebarNavDividerComponent, SidebarNavGroupComponent, SidebarNavItemClassPipe, RouterModule],
      template: `@for (item of navItemsArray; track item) {
  @switch (helper.itemType(item)) {
    @case ('group') {
      <c-sidebar-nav-group
        #rla="routerLinkActive"
        [dropdownMode]="dropdownMode"
        [item]="item"
        [ngClass]="item | cSidebarNavItemClass"
        [routerLinkActiveOptions]="{exact: true}"
        routerLinkActive="show"
        [compact]="compact"
      />
    }
    @case ('divider') {
      <c-sidebar-nav-divider
        [cHtmlAttr]="item.attributes ?? {}"
        [item]="item"
        [ngClass]="item | cSidebarNavItemClass"
      />
    }
    @case ('title') {
      <c-sidebar-nav-title
        [cHtmlAttr]="item.attributes ?? {}"
        [item]="item"
        [ngClass]="item | cSidebarNavItemClass"
      />
    }
    @case ('label') {
      <c-sidebar-nav-label
        [item]="item"
        [ngClass]="item | cSidebarNavItemClass"
      />
    }
    @case ('empty') {
      <ng-container />
    }
    @default {
      <c-sidebar-nav-link
        (linkClick)="hideMobile()"
        [item]="item"
        [ngClass]="item | cSidebarNavItemClass"
      />
    }
  }
}
<ng-content />
`
    }]
  }], () => [{
    type: SidebarComponent,
    decorators: [{
      type: Optional
    }]
  }, {
    type: SidebarNavHelper
  }, {
    type: Router
  }, {
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: SidebarService
  }], {
    navItems: [{
      type: Input
    }],
    dropdownMode: [{
      type: Input
    }],
    groupItems: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    compact: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    role: [{
      type: HostBinding,
      args: ["attr.role"]
    }, {
      type: Input
    }]
  });
})();
var _SidebarModule = class _SidebarModule {
};
_SidebarModule.ɵfac = function SidebarModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SidebarModule)();
};
_SidebarModule.ɵmod = ɵɵdefineNgModule({
  type: _SidebarModule,
  imports: [SidebarComponent, SidebarBrandComponent, SidebarFooterComponent, SidebarHeaderComponent, SidebarNavComponent, SidebarNavBadgePipe, SidebarNavDividerComponent, SidebarNavGroupComponent, SidebarNavIconPipe, SidebarNavItemClassPipe, SidebarNavLabelComponent, SidebarNavLinkComponent, SidebarNavLinkContentComponent, SidebarNavLinkPipe, SidebarNavTitleComponent, SidebarToggleDirective, SidebarTogglerDirective],
  exports: [SidebarComponent, SidebarToggleDirective, SidebarTogglerDirective, SidebarBrandComponent, SidebarNavComponent, SidebarHeaderComponent, SidebarFooterComponent]
});
_SidebarModule.ɵinj = ɵɵdefineInjector({
  providers: [SidebarService, SidebarNavHelper, SidebarNavGroupService],
  imports: [SidebarNavComponent, SidebarNavGroupComponent, SidebarNavLinkComponent]
});
var SidebarModule = _SidebarModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SidebarModule, [{
    type: NgModule,
    args: [{
      imports: [SidebarComponent, SidebarBrandComponent, SidebarFooterComponent, SidebarHeaderComponent, SidebarNavComponent, SidebarNavBadgePipe, SidebarNavDividerComponent, SidebarNavGroupComponent, SidebarNavIconPipe, SidebarNavItemClassPipe, SidebarNavLabelComponent, SidebarNavLinkComponent, SidebarNavLinkContentComponent, SidebarNavLinkPipe, SidebarNavTitleComponent, SidebarToggleDirective, SidebarTogglerDirective],
      exports: [SidebarComponent, SidebarToggleDirective, SidebarTogglerDirective, SidebarBrandComponent, SidebarNavComponent, SidebarHeaderComponent, SidebarFooterComponent],
      providers: [SidebarService, SidebarNavHelper, SidebarNavGroupService]
    }]
  }], null, null);
})();
var _SpinnerComponent = class _SpinnerComponent {
  constructor() {
    this.label = "Loading...";
    this.variant = "border";
    this.role = "status";
  }
  get hostClasses() {
    return {
      [`spinner-${this.variant}`]: true,
      [`text-${this.color}`]: !!this.color,
      [`spinner-${this.variant}-${this.size}`]: !!this.size
    };
  }
};
_SpinnerComponent.ɵfac = function SpinnerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SpinnerComponent)();
};
_SpinnerComponent.ɵcmp = ɵɵdefineComponent({
  type: _SpinnerComponent,
  selectors: [["c-spinner"]],
  hostVars: 3,
  hostBindings: function SpinnerComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    color: "color",
    label: "label",
    size: "size",
    variant: "variant",
    role: "role"
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  decls: 2,
  vars: 1,
  consts: [[1, "visually-hidden"]],
  template: function SpinnerComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelementStart(0, "span", 0);
      ɵɵtext(1);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵadvance();
      ɵɵtextInterpolate(ctx.label);
    }
  },
  encapsulation: 2
});
var SpinnerComponent = _SpinnerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SpinnerComponent, [{
    type: Component,
    args: [{
      selector: "c-spinner",
      standalone: true,
      template: '<span class="visually-hidden">{{label}}</span>\n'
    }]
  }], null, {
    color: [{
      type: Input
    }],
    label: [{
      type: Input
    }],
    size: [{
      type: Input
    }],
    variant: [{
      type: Input
    }],
    role: [{
      type: Input
    }, {
      type: HostBinding,
      args: ["attr.role"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _SpinnerModule = class _SpinnerModule {
};
_SpinnerModule.ɵfac = function SpinnerModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SpinnerModule)();
};
_SpinnerModule.ɵmod = ɵɵdefineNgModule({
  type: _SpinnerModule,
  imports: [SpinnerComponent],
  exports: [SpinnerComponent]
});
_SpinnerModule.ɵinj = ɵɵdefineInjector({});
var SpinnerModule = _SpinnerModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SpinnerModule, [{
    type: NgModule,
    args: [{
      exports: [SpinnerComponent],
      imports: [SpinnerComponent]
    }]
  }], null, null);
})();
var _TableColorDirective = class _TableColorDirective {
  get hostClasses() {
    return {
      [`table-${this.color}`]: !!this.color
    };
  }
};
_TableColorDirective.ɵfac = function TableColorDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TableColorDirective)();
};
_TableColorDirective.ɵdir = ɵɵdefineDirective({
  type: _TableColorDirective,
  selectors: [["", "cTableColor", ""]],
  hostVars: 2,
  hostBindings: function TableColorDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    color: [0, "cTableColor", "color"]
  },
  standalone: true
});
var TableColorDirective = _TableColorDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TableColorDirective, [{
    type: Directive,
    args: [{
      selector: "[cTableColor]",
      standalone: true
    }]
  }], null, {
    color: [{
      type: Input,
      args: ["cTableColor"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _TableActiveDirective = class _TableActiveDirective {
  constructor() {
    this.active = false;
  }
  get hostClasses() {
    return {
      "table-active": this.active
    };
  }
};
_TableActiveDirective.ɵfac = function TableActiveDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TableActiveDirective)();
};
_TableActiveDirective.ɵdir = ɵɵdefineDirective({
  type: _TableActiveDirective,
  selectors: [["", "cTableActive", ""]],
  hostVars: 2,
  hostBindings: function TableActiveDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    active: [2, "cTableActive", "active", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var TableActiveDirective = _TableActiveDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TableActiveDirective, [{
    type: Directive,
    args: [{
      selector: "[cTableActive]",
      standalone: true
    }]
  }], null, {
    active: [{
      type: Input,
      args: [{
        alias: "cTableActive",
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _TableDirective = class _TableDirective {
  constructor(renderer, hostElement) {
    this.renderer = renderer;
    this.hostElement = hostElement;
    this.bordered = false;
    this.borderless = false;
    this.hover = false;
    this.small = false;
    this.striped = false;
    this.stripedColumns = false;
  }
  get hostClasses() {
    return {
      table: true,
      [`align-${this.align}`]: !!this.align,
      [`caption-${this.caption}`]: !!this.caption,
      [`border-${this.borderColor}`]: !!this.borderColor,
      "table-bordered": this.bordered,
      "table-borderless": this.borderless,
      [`table-${this.color}`]: !!this.color,
      "table-hover": this.hover,
      "table-sm": this.small,
      "table-striped": this.striped,
      "table-striped-columns": this.stripedColumns
    };
  }
  ngOnInit() {
    this.setResponsiveWrapper();
  }
  // todo
  setResponsiveWrapper() {
    if (!!this.responsive) {
      const nativeElement = this.hostElement.nativeElement;
      const wrapper = this.renderer.createElement("div");
      const className = this.responsive === true ? "table-responsive" : `table-responsive-${this.responsive}`;
      this.renderer.addClass(wrapper, className);
      const parentNode = this.renderer.parentNode(nativeElement);
      this.renderer.appendChild(parentNode, wrapper);
      this.renderer.insertBefore(parentNode, wrapper, nativeElement);
      this.renderer.appendChild(wrapper, nativeElement);
    }
  }
};
_TableDirective.ɵfac = function TableDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TableDirective)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef));
};
_TableDirective.ɵdir = ɵɵdefineDirective({
  type: _TableDirective,
  selectors: [["table", "cTable", ""]],
  hostAttrs: [1, "table"],
  hostVars: 2,
  hostBindings: function TableDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    align: "align",
    borderColor: "borderColor",
    bordered: [2, "bordered", "bordered", booleanAttribute],
    borderless: [2, "borderless", "borderless", booleanAttribute],
    caption: "caption",
    color: "color",
    hover: [2, "hover", "hover", booleanAttribute],
    responsive: "responsive",
    small: [2, "small", "small", booleanAttribute],
    striped: [2, "striped", "striped", booleanAttribute],
    stripedColumns: [2, "stripedColumns", "stripedColumns", booleanAttribute]
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var TableDirective = _TableDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TableDirective, [{
    type: Directive,
    args: [{
      selector: "table[cTable]",
      standalone: true,
      host: {
        class: "table"
      }
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }], {
    align: [{
      type: Input
    }],
    borderColor: [{
      type: Input
    }],
    bordered: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    borderless: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    caption: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    hover: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    responsive: [{
      type: Input
    }],
    small: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    striped: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    stripedColumns: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _TableModule = class _TableModule {
};
_TableModule.ɵfac = function TableModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TableModule)();
};
_TableModule.ɵmod = ɵɵdefineNgModule({
  type: _TableModule,
  imports: [TableDirective, TableColorDirective, TableActiveDirective],
  exports: [TableDirective, TableColorDirective, TableActiveDirective]
});
_TableModule.ɵinj = ɵɵdefineInjector({});
var TableModule = _TableModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TableModule, [{
    type: NgModule,
    args: [{
      exports: [TableDirective, TableColorDirective, TableActiveDirective],
      imports: [TableDirective, TableColorDirective, TableActiveDirective]
    }]
  }], null, null);
})();
var _TabService = class _TabService {
  constructor() {
    this.activeTabPaneIdx = new Subject();
    this.activeTabPaneIdx$ = this.activeTabPaneIdx.asObservable();
  }
  setActiveTabIdx(tabContentState) {
    this.activeTabPaneIdx.next(tabContentState);
  }
};
_TabService.ɵfac = function TabService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabService)();
};
_TabService.ɵprov = ɵɵdefineInjectable({
  token: _TabService,
  factory: _TabService.ɵfac,
  providedIn: "root"
});
var TabService = _TabService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _TabPaneComponent = class _TabPaneComponent {
  constructor(changeDetectorRef, tabService) {
    this.changeDetectorRef = changeDetectorRef;
    this.tabService = tabService;
    this._active = false;
    this.role = "tabpanel";
    this.subscribeTabService();
  }
  set active(value) {
    const newValue = booleanAttribute(value);
    if (this._active !== newValue) {
      this._active = newValue;
      this.changeDetectorRef.markForCheck();
    }
  }
  get active() {
    return this._active;
  }
  get hostClasses() {
    return {
      "tab-pane": true,
      fade: true,
      show: this.active,
      active: this.active
    };
  }
  ngOnDestroy() {
    this.subscribeTabService(false);
  }
  subscribeTabService(subscribe = true) {
    if (subscribe) {
      this.tabServiceSubscription = this.tabService.activeTabPaneIdx$.subscribe((tabContentState) => {
        if (tabContentState.tabContent === this.tabContent) {
          this.active = tabContentState.activeIdx === this.tabPaneIdx;
        }
      });
    } else {
      this.tabServiceSubscription?.unsubscribe();
    }
  }
};
_TabPaneComponent.ɵfac = function TabPaneComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabPaneComponent)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(TabService));
};
_TabPaneComponent.ɵcmp = ɵɵdefineComponent({
  type: _TabPaneComponent,
  selectors: [["c-tab-pane"]],
  hostAttrs: [1, "tab-pane"],
  hostVars: 3,
  hostBindings: function TabPaneComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    role: "role"
  },
  exportAs: ["cTabPane"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function TabPaneComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var TabPaneComponent = _TabPaneComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabPaneComponent, [{
    type: Component,
    args: [{
      selector: "c-tab-pane",
      template: "<ng-content />",
      exportAs: "cTabPane",
      standalone: true,
      host: {
        class: "tab-pane"
      },
      styles: [":host{display:block}\n"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: TabService
  }], {
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    role: [{
      type: Input
    }, {
      type: HostBinding,
      args: ["attr.role"]
    }]
  });
})();
var _TabContentComponent = class _TabContentComponent {
  /**
   * Set active tabPane index
   * @type number
   */
  set activeTabPaneIdx(value) {
    const newValue = value;
    if (this._activeTabPaneIdx != newValue) {
      this._activeTabPaneIdx = newValue;
      this.activeTabPaneIdxChange.emit(newValue);
      this.changeDetectorRef.markForCheck();
      this.changeDetectorRef.detectChanges();
    }
  }
  get activeTabPaneIdx() {
    return this._activeTabPaneIdx;
  }
  constructor(changeDetectorRef, tabService) {
    this.changeDetectorRef = changeDetectorRef;
    this.tabService = tabService;
    this._activeTabPaneIdx = -1;
    this.activeTabPaneIdxChange = new EventEmitter();
  }
  ngAfterContentInit() {
    this.subscribeTabService();
  }
  ngAfterContentChecked() {
    this.panes?.forEach((tabPane, index) => {
      tabPane.tabContent = this;
      tabPane.tabPaneIdx = index;
    });
    this.refreshTabPaneActive(this.activeTabPaneIdx);
    this.tabService.setActiveTabIdx({
      tabContent: this,
      activeIdx: this.activeTabPaneIdx
    });
  }
  ngOnChanges(changes) {
    if (changes["activeTabPaneIdx"]?.currentValue) {
      this.tabService.setActiveTabIdx({
        tabContent: this,
        activeIdx: changes["activeTabPaneIdx"].currentValue
      });
    }
  }
  ngOnDestroy() {
    this.subscribeTabService(false);
  }
  subscribeTabService(subscribe = true) {
    if (subscribe) {
      this.tabServiceSubscription = this.tabService.activeTabPaneIdx$.subscribe((tabContentState) => {
        if (this === tabContentState.tabContent) {
          this.activeTabPaneIdx = tabContentState.activeIdx;
        }
      });
    } else {
      this.tabServiceSubscription?.unsubscribe();
    }
  }
  refreshTabPaneActive(idx) {
    this.panes?.forEach((tabPane, index) => {
      tabPane.active = idx === index;
    });
  }
};
_TabContentComponent.ɵfac = function TabContentComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabContentComponent)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(TabService));
};
_TabContentComponent.ɵcmp = ɵɵdefineComponent({
  type: _TabContentComponent,
  selectors: [["c-tab-content"]],
  contentQueries: function TabContentComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, TabPaneComponent, 4);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.panes = _t);
    }
  },
  hostAttrs: [1, "tab-content"],
  inputs: {
    activeTabPaneIdx: [2, "activeTabPaneIdx", "activeTabPaneIdx", numberAttribute]
  },
  outputs: {
    activeTabPaneIdxChange: "activeTabPaneIdxChange"
  },
  exportAs: ["cTabContent"],
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵNgOnChangesFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function TabContentComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"],
  changeDetection: 0
});
var TabContentComponent = _TabContentComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabContentComponent, [{
    type: Component,
    args: [{
      selector: "c-tab-content",
      template: "<ng-content />",
      changeDetection: ChangeDetectionStrategy.OnPush,
      exportAs: "cTabContent",
      standalone: true,
      host: {
        class: "tab-content"
      },
      styles: [":host{display:block}\n"]
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: TabService
  }], {
    activeTabPaneIdx: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    activeTabPaneIdxChange: [{
      type: Output
    }],
    panes: [{
      type: ContentChildren,
      args: [TabPaneComponent]
    }]
  });
})();
var _TabContentRefDirective = class _TabContentRefDirective {
  constructor(changeDetectorRef, tabService) {
    this.changeDetectorRef = changeDetectorRef;
    this.tabService = tabService;
    this._active = false;
    this._disabled = false;
    this.tabPaneIdx = -1;
    this.role = "tab";
    this.subscribeTabService();
  }
  /**
   * Set active state of tab content
   * @type boolean
   * @default false
   */
  set active(value) {
    const newValue = value;
    if (this._active !== newValue) {
      this._active = newValue;
      this.changeDetectorRef.detectChanges();
    }
  }
  get active() {
    return this._active;
  }
  /**
   * Set disabled state of tab content
   * @type boolean
   */
  set disabled(value) {
    this._disabled = value;
  }
  get disabled() {
    return this._disabled || this.tabPaneIdx >= this.tabContentRef?.panes?.length;
  }
  get hostClasses() {
    return {
      active: this.active,
      disabled: this.disabled
    };
  }
  get isDisabled() {
    return this.disabled || null;
  }
  get attrDisabled() {
    return this.disabled ? "" : null;
  }
  get ariaSelected() {
    return this.active;
  }
  get getTabindex() {
    return this.disabled ? "-1" : null;
  }
  ngOnChanges(changes) {
    if (changes["active"]?.currentValue) {
      this.setActiveTabPane();
    }
  }
  toggleOpen($event) {
    $event.preventDefault();
    this.setActiveTabPane();
  }
  setActiveTabPane() {
    setTimeout(() => {
      if (this.tabPaneIdx < this.tabContentRef.panes.length) {
        this.active = true;
        this.tabService.setActiveTabIdx({
          tabContent: this.tabContentRef,
          activeIdx: this.tabPaneIdx
        });
      } else {
        this.active = false;
      }
    });
  }
  ngOnDestroy() {
    this.subscribeTabService(false);
  }
  subscribeTabService(subscribe = true) {
    if (subscribe) {
      this.tabServiceSubscription = this.tabService.activeTabPaneIdx$.subscribe((tabContentState) => {
        if (tabContentState.tabContent === this.tabContentRef) {
          this.active = tabContentState.activeIdx === this.tabPaneIdx;
        }
      });
    } else {
      this.tabServiceSubscription?.unsubscribe();
    }
  }
};
_TabContentRefDirective.ɵfac = function TabContentRefDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabContentRefDirective)(ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(TabService));
};
_TabContentRefDirective.ɵdir = ɵɵdefineDirective({
  type: _TabContentRefDirective,
  selectors: [["", "cTabContent", ""]],
  hostVars: 7,
  hostBindings: function TabContentRefDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function TabContentRefDirective_click_HostBindingHandler($event) {
        return ctx.toggleOpen($event);
      });
    }
    if (rf & 2) {
      ɵɵattribute("aria-disabled", ctx.isDisabled)("disabled", ctx.attrDisabled)("aria-selected", ctx.ariaSelected)("role", ctx.role)("tabindex", ctx.getTabindex);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    tabContentRef: [0, "cTabContent", "tabContentRef"],
    active: [2, "active", "active", booleanAttribute],
    disabled: [2, "disabled", "disabled", booleanAttribute],
    tabPaneIdx: [2, "tabPaneIdx", "tabPaneIdx", numberAttribute],
    role: "role"
  },
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵNgOnChangesFeature]
});
var TabContentRefDirective = _TabContentRefDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabContentRefDirective, [{
    type: Directive,
    args: [{
      selector: "[cTabContent]",
      standalone: true
    }]
  }], () => [{
    type: ChangeDetectorRef
  }, {
    type: TabService
  }], {
    tabContentRef: [{
      type: Input,
      args: ["cTabContent"]
    }],
    active: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    tabPaneIdx: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }],
    isDisabled: [{
      type: HostBinding,
      args: ["attr.aria-disabled"]
    }],
    attrDisabled: [{
      type: HostBinding,
      args: ["attr.disabled"]
    }],
    ariaSelected: [{
      type: HostBinding,
      args: ["attr.aria-selected"]
    }],
    role: [{
      type: Input
    }, {
      type: HostBinding,
      args: ["attr.role"]
    }],
    getTabindex: [{
      type: HostBinding,
      args: ["attr.tabindex"]
    }],
    toggleOpen: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }]
  });
})();
var _TabsModule = class _TabsModule {
};
_TabsModule.ɵfac = function TabsModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabsModule)();
};
_TabsModule.ɵmod = ɵɵdefineNgModule({
  type: _TabsModule,
  imports: [TabContentComponent, TabContentRefDirective, TabPaneComponent],
  exports: [TabContentComponent, TabPaneComponent, TabContentRefDirective]
});
_TabsModule.ɵinj = ɵɵdefineInjector({
  providers: [TabService]
});
var TabsModule = _TabsModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabsModule, [{
    type: NgModule,
    args: [{
      imports: [TabContentComponent, TabContentRefDirective, TabPaneComponent],
      exports: [TabContentComponent, TabPaneComponent, TabContentRefDirective],
      providers: [TabService]
    }]
  }], null, null);
})();
var _TabsService = class _TabsService {
  constructor() {
    this.activeItem = signal(void 0);
    this.activeItemKey = signal(void 0);
    this.id = signal(void 0);
  }
};
_TabsService.ɵfac = function TabsService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabsService)();
};
_TabsService.ɵprov = ɵɵdefineInjectable({
  token: _TabsService,
  factory: _TabsService.ɵfac
});
var TabsService = _TabsService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabsService, [{
    type: Injectable
  }], null, null);
})();
var nextId2 = 0;
var _TabsComponent = class _TabsComponent {
  constructor() {
    this.tabsService = inject(TabsService);
    this.activeItemKey = model();
    this.tabsId = `tabs-${nextId2++}`;
    this.id = input(this.tabsId);
    this.activeItemEffect = effect(() => {
      this.tabsService.id.set(this.id());
      this.tabsService.activeItemKey.set(this.activeItemKey());
    }, {
      allowSignalWrites: true
    });
    this.tabsServiceEffect = effect(() => {
      this.activeItemKey.set(this.tabsService.activeItemKey());
    }, {
      allowSignalWrites: true
    });
  }
};
_TabsComponent.ɵfac = function TabsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabsComponent)();
};
_TabsComponent.ɵcmp = ɵɵdefineComponent({
  type: _TabsComponent,
  selectors: [["c-tabs"]],
  hostAttrs: [1, "tabs"],
  hostVars: 1,
  hostBindings: function TabsComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵhostProperty("id", ctx.id());
    }
  },
  inputs: {
    activeItemKey: [1, "activeItemKey"],
    id: [1, "id"]
  },
  outputs: {
    activeItemKey: "activeItemKeyChange"
  },
  exportAs: ["cTabs"],
  standalone: true,
  features: [ɵɵProvidersFeature([TabsService]), ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function TabsComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var TabsComponent = _TabsComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabsComponent, [{
    type: Component,
    args: [{
      exportAs: "cTabs",
      selector: "c-tabs",
      standalone: true,
      imports: [],
      template: "<ng-content />",
      providers: [TabsService],
      host: {
        "[id]": "id()",
        class: "tabs"
      },
      styles: [":host{display:block}\n"]
    }]
  }], null, null);
})();
var _destroyRef9, _elementRef4, _tabsService, _disabled;
var _TabDirective = class _TabDirective {
  constructor() {
    __privateAdd(this, _destroyRef9);
    __privateAdd(this, _elementRef4);
    __privateAdd(this, _tabsService);
    __privateAdd(this, _disabled);
    __privateSet(this, _destroyRef9, inject(DestroyRef));
    __privateSet(this, _elementRef4, inject(ElementRef));
    __privateSet(this, _tabsService, inject(TabsService));
    __privateSet(this, _disabled, signal(false));
    this.attrDisabled = computed(() => __privateGet(this, _disabled).call(this) || null);
    this.itemKey = input.required();
    this.id = input();
    this.ariaControls = input(void 0, {
      alias: "aria-controls"
    });
    this.isActive = computed(() => !__privateGet(this, _disabled).call(this) && __privateGet(this, _tabsService).activeItemKey() === this.itemKey());
    this.hostClasses = computed(() => ({
      "nav-link": true,
      active: this.isActive(),
      disabled: __privateGet(this, _disabled).call(this)
    }));
    this.propId = computed(() => this.id() ?? `${__privateGet(this, _tabsService).id()}-tab-${this.itemKey()}`);
    this.attrAriaControls = computed(() => this.ariaControls() ?? `${__privateGet(this, _tabsService).id()}-panel-${this.itemKey()}`);
    this.disabledEffect = effect(() => {
      if (!__privateGet(this, _disabled).call(this)) {
        const click$ = fromEvent(__privateGet(this, _elementRef4).nativeElement, "click");
        const focusIn$ = fromEvent(__privateGet(this, _elementRef4).nativeElement, "focusin");
        merge(focusIn$, click$).pipe(filter(($event) => !__privateGet(this, _disabled).call(this)), tap(($event) => {
          __privateGet(this, _tabsService).activeItemKey.set(untracked(this.itemKey));
        }), takeWhile(() => !__privateGet(this, _disabled).call(this)), takeUntilDestroyed(__privateGet(this, _destroyRef9))).subscribe();
      }
    }, {
      allowSignalWrites: true
    });
  }
  /**
   * Disabled attribute
   * @type boolean
   * @default false
   */
  set disabled(value) {
    __privateGet(this, _disabled).set(value);
  }
  get disabled() {
    return __privateGet(this, _disabled).call(this);
  }
  focus(origin) {
    __privateGet(this, _elementRef4).nativeElement.focus();
  }
};
_destroyRef9 = new WeakMap();
_elementRef4 = new WeakMap();
_tabsService = new WeakMap();
_disabled = new WeakMap();
_TabDirective.ɵfac = function TabDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabDirective)();
};
_TabDirective.ɵdir = ɵɵdefineDirective({
  type: _TabDirective,
  selectors: [["button", "cTab", ""]],
  hostAttrs: ["type", "button", "role", "tab"],
  hostVars: 7,
  hostBindings: function TabDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵhostProperty("id", ctx.propId())("tabindex", ctx.isActive() ? 0 : -1);
      ɵɵattribute("aria-selected", ctx.isActive())("aria-controls", ctx.attrAriaControls())("disabled", ctx.attrDisabled() || null);
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    disabled: [2, "disabled", "disabled", booleanAttribute],
    itemKey: [1, "itemKey"],
    id: [1, "id"],
    ariaControls: [1, "aria-controls", "ariaControls"]
  },
  exportAs: ["cTab"],
  standalone: true,
  features: [ɵɵInputTransformsFeature]
});
var TabDirective = _TabDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabDirective, [{
    type: Directive,
    args: [{
      exportAs: "cTab",
      selector: "button[cTab]",
      standalone: true,
      host: {
        "[class]": "hostClasses()",
        type: "button",
        role: "tab",
        "[attr.aria-selected]": "isActive()",
        "[attr.aria-controls]": "attrAriaControls()",
        "[attr.disabled]": "attrDisabled() || null",
        "[id]": "propId()",
        "[tabindex]": "isActive() ? 0 : -1"
      }
    }]
  }], null, {
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }]
  });
})();
var _destroyRef10, _focusKeyManager2;
var _TabsListComponent = class _TabsListComponent {
  constructor() {
    __privateAdd(this, _destroyRef10);
    __privateAdd(this, _focusKeyManager2);
    __privateSet(this, _destroyRef10, inject(DestroyRef));
    this.tabsService = inject(TabsService);
    this.layout = input();
    this.variant = input();
    this.role = input("tablist");
    this.hostClasses = computed(() => ({
      nav: true,
      [`nav-${this.layout()}`]: this.layout(),
      [`nav-${this.variant()}`]: this.variant()
    }));
    this.tabs = contentChildren(TabDirective);
    this.tabsEffect = effect(() => {
      if (this.tabs().length === 0) {
        return;
      }
      __privateSet(this, _focusKeyManager2, new FocusKeyManager(this.tabs()).skipPredicate((tab) => tab.disabled === true).withHorizontalOrientation("ltr").withHomeAndEnd().withWrap());
      __privateGet(this, _focusKeyManager2).change.pipe(tap((value) => {
        this.tabsService.activeItemKey.set(__privateGet(this, _focusKeyManager2).activeItem?.itemKey());
        this.tabsService.activeItem.set(__privateGet(this, _focusKeyManager2).activeItem);
      }), takeUntilDestroyed(__privateGet(this, _destroyRef10))).subscribe();
      const activeItem = this.tabs().find((tab) => untracked(tab.isActive)) ?? this.tabs().find((tab) => !tab.disabled);
      const activeItemIndex = this.tabs().findIndex((tab) => tab === activeItem);
      __privateGet(this, _focusKeyManager2)?.updateActiveItem(activeItemIndex < 0 ? 0 : activeItemIndex);
      this.tabsService.activeItemKey.set(__privateGet(this, _focusKeyManager2).activeItem?.itemKey());
      this.tabsService.activeItem.set(__privateGet(this, _focusKeyManager2).activeItem);
    }, {
      allowSignalWrites: true
    });
    this.tabsServiceEffect = effect(() => {
      const activeItemIndex = this.tabs().findIndex((tab) => untracked(tab.isActive) && untracked(tab.itemKey) === this.tabsService.activeItemKey());
      __privateGet(this, _focusKeyManager2)?.updateActiveItem(activeItemIndex < 0 ? 0 : activeItemIndex);
    });
  }
  onKeydown($event) {
    if (["ArrowLeft", "ArrowRight"].includes($event.key)) {
      __privateGet(this, _focusKeyManager2).onKeydown($event);
      return;
    }
    if (["Tab"].includes($event.key)) {
      __privateGet(this, _focusKeyManager2)?.tabOut.next();
    }
    return;
  }
};
_destroyRef10 = new WeakMap();
_focusKeyManager2 = new WeakMap();
_TabsListComponent.ɵfac = function TabsListComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabsListComponent)();
};
_TabsListComponent.ɵcmp = ɵɵdefineComponent({
  type: _TabsListComponent,
  selectors: [["c-tabs-list"]],
  contentQueries: function TabsListComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuerySignal(dirIndex, ctx.tabs, TabDirective, 4);
    }
    if (rf & 2) {
      ɵɵqueryAdvance();
    }
  },
  hostVars: 3,
  hostBindings: function TabsListComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("keydown", function TabsListComponent_keydown_HostBindingHandler($event) {
        return ctx.onKeydown($event);
      });
    }
    if (rf & 2) {
      ɵɵattribute("role", ctx.role());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    layout: [1, "layout"],
    variant: [1, "variant"],
    role: [1, "role"]
  },
  exportAs: ["cTabsList"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function TabsListComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var TabsListComponent = _TabsListComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabsListComponent, [{
    type: Component,
    args: [{
      exportAs: "cTabsList",
      selector: "c-tabs-list",
      standalone: true,
      imports: [TabDirective],
      template: "<ng-content />",
      host: {
        "[attr.role]": "role()",
        "[class]": "hostClasses()"
      }
    }]
  }], null, {
    onKeydown: [{
      type: HostListener,
      args: ["keydown", ["$event"]]
    }]
  });
})();
var _TabsContentComponent = class _TabsContentComponent {
};
_TabsContentComponent.ɵfac = function TabsContentComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabsContentComponent)();
};
_TabsContentComponent.ɵcmp = ɵɵdefineComponent({
  type: _TabsContentComponent,
  selectors: [["c-tabs-content"]],
  hostAttrs: [1, "tab-content"],
  exportAs: ["cTabsContent"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function TabsContentComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2
});
var TabsContentComponent = _TabsContentComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabsContentComponent, [{
    type: Component,
    args: [{
      exportAs: "cTabsContent",
      selector: "c-tabs-content",
      standalone: true,
      template: "<ng-content />",
      host: {
        class: "tab-content"
      }
    }]
  }], null, null);
})();
var _TabPanelComponent = class _TabPanelComponent {
  constructor() {
    this.tabsService = inject(TabsService);
    this.ariaLabelledBy = input(void 0, {
      alias: "aria-labelledby"
    });
    this.id = input();
    this.itemKey = input.required();
    this.tabindex = input(0, {
      transform: numberAttribute
    });
    this.transition = input(true);
    this.visibleChange = output();
    this.show = signal(false);
    this.visible = computed(() => {
      const visible = this.tabsService.activeItemKey() === this.itemKey() && !this.tabsService.activeItem()?.disabled;
      this.visibleChange.emit({
        itemKey: this.itemKey(),
        visible
      });
      return visible;
    });
    this.propId = computed(() => this.id() ?? `${this.tabsService.id()}-panel-${this.itemKey()}`);
    this.attrAriaLabelledBy = computed(() => this.ariaLabelledBy() ?? `${this.tabsService.id()}-tab-${this.itemKey()}`);
    this.hostClasses = computed(() => ({
      "tab-pane": true,
      active: this.show(),
      fade: this.transition(),
      show: this.show(),
      invisible: this.tabsService.activeItem()?.disabled
    }));
  }
  get animationDisabled() {
    return !this.transition();
  }
  get animateType() {
    return this.visible() ? "show" : "hide";
  }
  onAnimationDone($event) {
    this.show.set(this.visible());
  }
};
_TabPanelComponent.ɵfac = function TabPanelComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TabPanelComponent)();
};
_TabPanelComponent.ɵcmp = ɵɵdefineComponent({
  type: _TabPanelComponent,
  selectors: [["c-tab-panel"]],
  hostAttrs: ["role", "tabpanel"],
  hostVars: 7,
  hostBindings: function TabPanelComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵsyntheticHostListener("@fadeInOut.done", function TabPanelComponent_animation_fadeInOut_done_HostBindingHandler($event) {
        return ctx.onAnimationDone($event);
      });
    }
    if (rf & 2) {
      ɵɵhostProperty("tabindex", ctx.visible() ? ctx.tabindex() : -1)("id", ctx.propId());
      ɵɵsyntheticHostProperty("@.disabled", ctx.animationDisabled)("@fadeInOut", ctx.animateType);
      ɵɵattribute("aria-labelledby", ctx.attrAriaLabelledBy());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    ariaLabelledBy: [1, "aria-labelledby", "ariaLabelledBy"],
    id: [1, "id"],
    itemKey: [1, "itemKey"],
    tabindex: [1, "tabindex"],
    transition: [1, "transition"]
  },
  outputs: {
    visibleChange: "visibleChange"
  },
  exportAs: ["cTabPanel"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function TabPanelComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  encapsulation: 2,
  data: {
    animation: [trigger("fadeInOut", [state("show", style({
      opacity: 1
    })), state("hide", style({
      opacity: 0
    })), state("void", style({
      opacity: 0
    })), transition("* => *", [animate("150ms linear")])])]
  }
});
var TabPanelComponent = _TabPanelComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TabPanelComponent, [{
    type: Component,
    args: [{
      exportAs: "cTabPanel",
      selector: "c-tab-panel",
      standalone: true,
      template: "<ng-content />",
      host: {
        "[class]": "hostClasses()",
        "[tabindex]": "visible() ? tabindex(): -1",
        "[attr.aria-labelledby]": "attrAriaLabelledBy()",
        "[id]": "propId()",
        role: "tabpanel"
      },
      animations: [trigger("fadeInOut", [state("show", style({
        opacity: 1
      })), state("hide", style({
        opacity: 0
      })), state("void", style({
        opacity: 0
      })), transition("* => *", [animate("150ms linear")])])]
    }]
  }], null, {
    animationDisabled: [{
      type: HostBinding,
      args: ["@.disabled"]
    }],
    animateType: [{
      type: HostBinding,
      args: ["@fadeInOut"]
    }],
    onAnimationDone: [{
      type: HostListener,
      args: ["@fadeInOut.done", ["$event"]]
    }]
  });
})();
var _Tabs2Module = class _Tabs2Module {
};
_Tabs2Module.ɵfac = function Tabs2Module_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _Tabs2Module)();
};
_Tabs2Module.ɵmod = ɵɵdefineNgModule({
  type: _Tabs2Module,
  imports: [TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent],
  exports: [TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent]
});
_Tabs2Module.ɵinj = ɵɵdefineInjector({
  providers: [TabsService]
});
var Tabs2Module = _Tabs2Module;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Tabs2Module, [{
    type: NgModule,
    args: [{
      imports: [TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent],
      exports: [TabsComponent, TabsListComponent, TabDirective, TabsContentComponent, TabPanelComponent],
      providers: [TabsService]
    }]
  }], null, null);
})();
var _ToasterService = class _ToasterService {
  constructor() {
    this.toasterState = new BehaviorSubject({});
    this.toasterState$ = this.toasterState.asObservable();
  }
  setState(state2) {
    this.toasterState.next(__spreadValues({}, state2));
  }
};
_ToasterService.ɵfac = function ToasterService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToasterService)();
};
_ToasterService.ɵprov = ɵɵdefineInjectable({
  token: _ToasterService,
  factory: _ToasterService.ɵfac,
  providedIn: "root"
});
var ToasterService = _ToasterService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToasterService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();
var _ToastComponent = class _ToastComponent {
  constructor(hostElement, renderer, toasterService, changeDetectorRef) {
    this.hostElement = hostElement;
    this.renderer = renderer;
    this.toasterService = toasterService;
    this.changeDetectorRef = changeDetectorRef;
    this.dynamic = input();
    this.placement = input();
    this.autohide = input(true);
    this.color = input("");
    this.delay = input(5e3, {
      transform: numberAttribute
    });
    this.fade = input(true);
    this._visible = false;
    this.index = input(0, {
      transform: numberAttribute
    });
    this.visibleChange = output();
    this.timer = output();
  }
  /**
   * Toggle the visibility of component.
   * @type boolean
   */
  set visible(value) {
    const newValue = value;
    if (this._visible !== newValue) {
      this._visible = newValue;
      newValue ? this.setTimer() : this.clearTimer();
      this.visibleChange.emit(newValue);
      this.changeDetectorRef.markForCheck();
    }
  }
  get visible() {
    return this._visible;
  }
  get clock() {
    return this._clock;
  }
  set clock(value) {
    this._clock = value;
    this.timer.emit(this._clock);
    this.changeDetectorRef.markForCheck();
  }
  get animationDisabled() {
    return !this.fade();
  }
  get animateType() {
    return this.visible ? "show" : "hide";
  }
  onMouseOver() {
    this.clearTimer();
  }
  onMouseOut() {
    this.setTimer();
  }
  get hostClasses() {
    return {
      toast: true,
      show: true,
      [`bg-${this.color()}`]: !!this.color(),
      "border-0": !!this.color()
    };
  }
  ngOnInit() {
    if (this.visible) {
      this.toasterService.setState({
        toast: this,
        show: this.visible,
        placement: this.placement()
      });
      this.clearTimer();
      this.setTimer();
    }
  }
  ngOnDestroy() {
    this.clearTimer();
  }
  setTimer() {
    this.clearTimer();
    if (this.autohide() && this.visible) {
      this.timerId = this.delay() > 0 ? setTimeout(() => this.onClose(), this.delay()) : void 0;
      this.setClock();
    }
  }
  clearTimer() {
    this.clearClock();
    clearTimeout(this.timerId);
    this.timerId = void 0;
  }
  onClose() {
    this.clearTimer();
    this.toasterService.setState({
      toast: this,
      show: false,
      placement: this.placement()
    });
  }
  setClock() {
    this.clearClock();
    this.clock = 0;
    this.clockId = setInterval(() => {
      this.clock += 1;
      this.changeDetectorRef.markForCheck();
    }, 1e3);
    this.clockTimerId = setTimeout(() => {
      this.clearClock();
    }, this.delay());
  }
  clearClock() {
    clearTimeout(this.clockTimerId);
    clearInterval(this.clockId);
    this.clockId = void 0;
  }
};
_ToastComponent.ɵfac = function ToastComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToastComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ToasterService), ɵɵdirectiveInject(ChangeDetectorRef));
};
_ToastComponent.ɵcmp = ɵɵdefineComponent({
  type: _ToastComponent,
  selectors: [["c-toast"]],
  hostAttrs: [1, "toast", "show"],
  hostVars: 4,
  hostBindings: function ToastComponent_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("mouseover", function ToastComponent_mouseover_HostBindingHandler() {
        return ctx.onMouseOver();
      })("mouseout", function ToastComponent_mouseout_HostBindingHandler() {
        return ctx.onMouseOut();
      });
    }
    if (rf & 2) {
      ɵɵsyntheticHostProperty("@.disabled", ctx.animationDisabled)("@fadeInOut", ctx.animateType);
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    dynamic: [1, "dynamic"],
    placement: [1, "placement"],
    autohide: [1, "autohide"],
    color: [1, "color"],
    delay: [1, "delay"],
    fade: [1, "fade"],
    visible: [2, "visible", "visible", booleanAttribute],
    index: [1, "index"]
  },
  outputs: {
    visibleChange: "visibleChange",
    timer: "timer"
  },
  exportAs: ["cToast"],
  standalone: true,
  features: [ɵɵInputTransformsFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ToastComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block;overflow:hidden}"],
  data: {
    animation: [trigger("fadeInOut", [state("show", style({
      opacity: 1,
      height: "*",
      padding: "*",
      border: "*",
      margin: "*"
    })), state("hide", style({
      opacity: 0,
      height: 0,
      padding: 0,
      border: 0,
      margin: 0
    })), state("void", style({
      opacity: 0,
      height: 0,
      padding: 0,
      border: 0,
      margin: 0
    })), transition("show => hide", [animate("{{ time }} {{ easing }}")], {
      params: {
        time: "300ms",
        easing: "ease-out"
      }
    }), transition("hide => show", [animate("{{ time }} {{ easing }}")], {
      params: {
        time: "300ms",
        easing: "ease-in"
      }
    }), transition("show => void", [animate("{{ time }} {{ easing }}")], {
      params: {
        time: "300ms",
        easing: "ease-out"
      }
    }), transition("void => show", [animate("{{ time }} {{ easing }}")], {
      params: {
        time: "300ms",
        easing: "ease-in"
      }
    })])]
  }
});
var ToastComponent = _ToastComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastComponent, [{
    type: Component,
    args: [{
      selector: "c-toast",
      template: "<ng-content />",
      exportAs: "cToast",
      standalone: true,
      animations: [trigger("fadeInOut", [state("show", style({
        opacity: 1,
        height: "*",
        padding: "*",
        border: "*",
        margin: "*"
      })), state("hide", style({
        opacity: 0,
        height: 0,
        padding: 0,
        border: 0,
        margin: 0
      })), state("void", style({
        opacity: 0,
        height: 0,
        padding: 0,
        border: 0,
        margin: 0
      })), transition("show => hide", [animate("{{ time }} {{ easing }}")], {
        params: {
          time: "300ms",
          easing: "ease-out"
        }
      }), transition("hide => show", [animate("{{ time }} {{ easing }}")], {
        params: {
          time: "300ms",
          easing: "ease-in"
        }
      }), transition("show => void", [animate("{{ time }} {{ easing }}")], {
        params: {
          time: "300ms",
          easing: "ease-out"
        }
      }), transition("void => show", [animate("{{ time }} {{ easing }}")], {
        params: {
          time: "300ms",
          easing: "ease-in"
        }
      })])],
      host: {
        class: "toast show"
      },
      styles: [":host{display:block;overflow:hidden}\n"]
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: ToasterService
  }, {
    type: ChangeDetectorRef
  }], {
    visible: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    animationDisabled: [{
      type: HostBinding,
      args: ["@.disabled"]
    }],
    animateType: [{
      type: HostBinding,
      args: ["@fadeInOut"]
    }],
    onMouseOver: [{
      type: HostListener,
      args: ["mouseover"]
    }],
    onMouseOut: [{
      type: HostListener,
      args: ["mouseout"]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _ToastBodyComponent = class _ToastBodyComponent {
  constructor(toast) {
    this.toast = toast;
    this.toastBodyClass = true;
  }
};
_ToastBodyComponent.ɵfac = function ToastBodyComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToastBodyComponent)(ɵɵdirectiveInject(ToastComponent, 8));
};
_ToastBodyComponent.ɵcmp = ɵɵdefineComponent({
  type: _ToastBodyComponent,
  selectors: [["c-toast-body"]],
  hostVars: 2,
  hostBindings: function ToastBodyComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassProp("toast-body", ctx.toastBodyClass);
    }
  },
  exportAs: ["cToastBody"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 1,
  vars: 0,
  template: function ToastBodyComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵprojection(0);
    }
  },
  styles: ["[_nghost-%COMP%]{display:block}"]
});
var ToastBodyComponent = _ToastBodyComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastBodyComponent, [{
    type: Component,
    args: [{
      selector: "c-toast-body",
      template: "<ng-content />",
      exportAs: "cToastBody",
      standalone: true,
      styles: [":host{display:block}\n"]
    }]
  }], () => [{
    type: ToastComponent,
    decorators: [{
      type: Optional
    }]
  }], {
    toastBodyClass: [{
      type: HostBinding,
      args: ["class.toast-body"]
    }]
  });
})();
var _ToastCloseDirective = class _ToastCloseDirective {
  constructor(toasterService) {
    this.toasterService = toasterService;
  }
  toggleOpen($event) {
    $event.preventDefault();
    this.toasterService.setState({
      show: false,
      toast: this.toast
    });
  }
};
_ToastCloseDirective.ɵfac = function ToastCloseDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToastCloseDirective)(ɵɵdirectiveInject(ToasterService));
};
_ToastCloseDirective.ɵdir = ɵɵdefineDirective({
  type: _ToastCloseDirective,
  selectors: [["", "cToastClose", ""]],
  hostBindings: function ToastCloseDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      ɵɵlistener("click", function ToastCloseDirective_click_HostBindingHandler($event) {
        return ctx.toggleOpen($event);
      });
    }
  },
  inputs: {
    toast: [0, "cToastClose", "toast"]
  },
  exportAs: ["cToastClose"],
  standalone: true
});
var ToastCloseDirective = _ToastCloseDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastCloseDirective, [{
    type: Directive,
    args: [{
      selector: "[cToastClose]",
      exportAs: "cToastClose",
      standalone: true
    }]
  }], () => [{
    type: ToasterService
  }], {
    toast: [{
      type: Input,
      args: ["cToastClose"]
    }],
    toggleOpen: [{
      type: HostListener,
      args: ["click", ["$event"]]
    }]
  });
})();
var _ToastHeaderComponent = class _ToastHeaderComponent {
  constructor(toast) {
    this.toast = toast;
    this.closeButton = true;
    this.toastHeaderClass = true;
  }
};
_ToastHeaderComponent.ɵfac = function ToastHeaderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToastHeaderComponent)(ɵɵdirectiveInject(ToastComponent, 8));
};
_ToastHeaderComponent.ɵcmp = ɵɵdefineComponent({
  type: _ToastHeaderComponent,
  selectors: [["c-toast-header"]],
  hostVars: 2,
  hostBindings: function ToastHeaderComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassProp("toast-header", ctx.toastHeaderClass);
    }
  },
  inputs: {
    closeButton: "closeButton"
  },
  exportAs: ["cToastHeader"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 3,
  vars: 1,
  consts: [["aria-label", "close", "cButtonClose", "", 1, "ms-auto", 3, "cToastClose", "style"], ["aria-label", "close", "cButtonClose", "", 1, "ms-auto", 3, "cToastClose"]],
  template: function ToastHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementContainerStart(0);
      ɵɵprojection(1);
      ɵɵtemplate(2, ToastHeaderComponent_Conditional_2_Template, 1, 4, "button", 0);
      ɵɵelementContainerEnd();
    }
    if (rf & 2) {
      ɵɵadvance(2);
      ɵɵconditional(ctx.closeButton ? 2 : -1);
    }
  },
  dependencies: [ToastCloseDirective, ButtonCloseDirective],
  encapsulation: 2
});
var ToastHeaderComponent = _ToastHeaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastHeaderComponent, [{
    type: Component,
    args: [{
      selector: "c-toast-header",
      exportAs: "cToastHeader",
      standalone: true,
      imports: [ToastCloseDirective, ButtonCloseDirective],
      template: '<ng-container>\n  <ng-content />\n  @if (closeButton) {\n    <button [cToastClose]="toast" [style]="{outline: 0}" aria-label="close" cButtonClose class="ms-auto"></button>\n  }\n</ng-container>\n'
    }]
  }], () => [{
    type: ToastComponent,
    decorators: [{
      type: Optional
    }]
  }], {
    closeButton: [{
      type: Input
    }],
    toastHeaderClass: [{
      type: HostBinding,
      args: ["class.toast-header"]
    }]
  });
})();
var _ToasterHostDirective = class _ToasterHostDirective {
  constructor(viewContainerRef) {
    this.viewContainerRef = viewContainerRef;
  }
};
_ToasterHostDirective.ɵfac = function ToasterHostDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToasterHostDirective)(ɵɵdirectiveInject(ViewContainerRef));
};
_ToasterHostDirective.ɵdir = ɵɵdefineDirective({
  type: _ToasterHostDirective,
  selectors: [["", "cToasterHost", ""]],
  exportAs: ["cToasterHost"],
  standalone: true
});
var ToasterHostDirective = _ToasterHostDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToasterHostDirective, [{
    type: Directive,
    args: [{
      selector: "[cToasterHost]",
      exportAs: "cToasterHost",
      standalone: true
    }]
  }], () => [{
    type: ViewContainerRef
  }], null);
})();
var ToasterPlacement;
(function(ToasterPlacement2) {
  ToasterPlacement2["Static"] = "static";
  ToasterPlacement2["TopStart"] = "top-start";
  ToasterPlacement2["TopCenter"] = "top-center";
  ToasterPlacement2["TopEnd"] = "top-end";
  ToasterPlacement2["MiddleStart"] = "middle-start";
  ToasterPlacement2["MiddleCenter"] = "middle-center";
  ToasterPlacement2["MiddleEnd"] = "middle-end";
  ToasterPlacement2["BottomStart"] = "bottom-start";
  ToasterPlacement2["BottomCenter"] = "bottom-center";
  ToasterPlacement2["BottomEnd"] = "bottom-end";
})(ToasterPlacement || (ToasterPlacement = {}));
var _destroyRef11;
var _ToasterComponent = class _ToasterComponent {
  constructor(hostElement, renderer, toasterService) {
    __privateAdd(this, _destroyRef11);
    this.hostElement = hostElement;
    this.renderer = renderer;
    this.toasterService = toasterService;
    __privateSet(this, _destroyRef11, inject(DestroyRef));
    this.placements = Object.values(ToasterPlacement);
    this.toastsDynamic = [];
    this.placement = ToasterPlacement.TopEnd;
    this.position = "absolute";
  }
  get hostClasses() {
    return {
      toaster: true,
      "toast-container": true,
      [`position-${this.position}`]: !!this.position,
      "top-0": this.placement.includes("top"),
      "top-50": this.placement.includes("middle"),
      "bottom-0": this.placement.includes("bottom"),
      "start-0": this.placement.includes("start"),
      "start-50": this.placement.includes("center"),
      "end-0": this.placement.includes("end"),
      "translate-middle-x": this.placement.includes("center") && !this.placement.includes("middle"),
      "translate-middle-y": this.placement.includes("middle") && !this.placement.includes("center"),
      "translate-middle": this.placement.includes("middle") && this.placement.includes("center")
    };
  }
  ngOnInit() {
    this.stateToasterSubscribe();
  }
  ngAfterContentChecked() {
    this.toasts = this.contentToasts;
  }
  addToast(toast, props, options) {
    const componentRef = this.toasterHost.viewContainerRef.createComponent(toast, options);
    this.toastsDynamic.push(componentRef);
    const index = this.toastsDynamic.indexOf(componentRef);
    for (const [key, value] of Object.entries(props)) {
      componentRef.setInput(key, value);
    }
    componentRef.setInput("placement", this.placement);
    componentRef.setInput("dynamic", true);
    componentRef.setInput("index", index);
    componentRef.setInput("visible", true);
    componentRef.instance["visibleChange"].emit(true);
    componentRef.changeDetectorRef?.detectChanges();
    return componentRef;
  }
  removeToast(state2) {
    this.toastsDynamic?.forEach((item) => {
      if (state2.toast?.dynamic() && item.instance === state2.toast) {
        item.setInput("visible", false);
        item.instance["visibleChange"].emit(false);
        item.destroy();
      }
    });
    this.toasts?.forEach((item) => {
      if (state2.toast && item.element.nativeElement === state2.toast.hostElement.nativeElement) {
        if (!state2.toast.dynamic()) {
          state2.toast["visible"] = false;
        }
      }
    });
  }
  stateToasterSubscribe() {
    this.toasterService.toasterState$.pipe(takeUntilDestroyed(__privateGet(this, _destroyRef11))).subscribe((state2) => {
      if (state2.show === false) {
        this.removeToast(state2);
      }
    });
  }
};
_destroyRef11 = new WeakMap();
_ToasterComponent.ɵfac = function ToasterComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToasterComponent)(ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ToasterService));
};
_ToasterComponent.ɵcmp = ɵɵdefineComponent({
  type: _ToasterComponent,
  selectors: [["c-toaster"]],
  contentQueries: function ToasterComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuery(dirIndex, ToastComponent, 4, ViewContainerRef);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.contentToasts = _t);
    }
  },
  viewQuery: function ToasterComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuery(ToasterHostDirective, 7);
    }
    if (rf & 2) {
      let _t;
      ɵɵqueryRefresh(_t = ɵɵloadQuery()) && (ctx.toasterHost = _t.first);
    }
  },
  hostAttrs: [1, "toaster", "toast-container"],
  hostVars: 2,
  hostBindings: function ToasterComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses);
    }
  },
  inputs: {
    placement: "placement",
    position: "position"
  },
  exportAs: ["cToaster"],
  standalone: true,
  features: [ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 2,
  vars: 0,
  consts: [["cToasterHost", ""]],
  template: function ToasterComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵtemplate(0, ToasterComponent_ng_template_0_Template, 0, 0, "ng-template", 0);
      ɵɵprojection(1, 0, ["cToasterHost", ""]);
    }
  },
  dependencies: [ToasterHostDirective],
  encapsulation: 2
});
var ToasterComponent = _ToasterComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToasterComponent, [{
    type: Component,
    args: [{
      selector: "c-toaster",
      exportAs: "cToaster",
      standalone: true,
      imports: [ToasterHostDirective],
      host: {
        class: "toaster toast-container"
      },
      template: "<ng-template cToasterHost />\n<ng-content cToasterHost />\n"
    }]
  }], () => [{
    type: ElementRef
  }, {
    type: Renderer2
  }, {
    type: ToasterService
  }], {
    placement: [{
      type: Input
    }],
    position: [{
      type: Input
    }],
    toasterHost: [{
      type: ViewChild,
      args: [ToasterHostDirective, {
        static: true
      }]
    }],
    contentToasts: [{
      type: ContentChildren,
      args: [ToastComponent, {
        read: ViewContainerRef
      }]
    }],
    hostClasses: [{
      type: HostBinding,
      args: ["class"]
    }]
  });
})();
var _ToastModule = class _ToastModule {
};
_ToastModule.ɵfac = function ToastModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ToastModule)();
};
_ToastModule.ɵmod = ɵɵdefineNgModule({
  type: _ToastModule,
  imports: [ToastBodyComponent, ToastComponent, ToastCloseDirective, ToastHeaderComponent, ToasterComponent, ToasterHostDirective],
  exports: [ToastBodyComponent, ToastComponent, ToastCloseDirective, ToastHeaderComponent, ToasterComponent, ToasterHostDirective]
});
_ToastModule.ɵinj = ɵɵdefineInjector({
  providers: [ToasterService]
});
var ToastModule = _ToastModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ToastModule, [{
    type: NgModule,
    args: [{
      imports: [ToastBodyComponent, ToastComponent, ToastCloseDirective, ToastHeaderComponent, ToasterComponent, ToasterHostDirective],
      providers: [ToasterService],
      exports: [ToastBodyComponent, ToastComponent, ToastCloseDirective, ToastHeaderComponent, ToasterComponent, ToasterHostDirective]
    }]
  }], null, null);
})();
var _TooltipComponent = class _TooltipComponent {
  constructor() {
    this.renderer = inject(Renderer2);
    this.content = input("");
    this.contentEffect = effect(() => {
      this.updateView(this.content());
    });
    this.visible = input(false, {
      transform: booleanAttribute
    });
    this.id = input();
    this.role = input("tooltip");
    this.viewContainerRef = viewChild("tooltipTemplate", {
      read: ViewContainerRef
    });
    this.hostClasses = computed(() => {
      return {
        tooltip: true,
        fade: true,
        show: this.visible(),
        "bs-tooltip-auto": true
      };
    });
  }
  ngOnDestroy() {
    this.clear();
  }
  clear() {
    this.viewContainerRef()?.clear();
    if (!!this.textNode) {
      this.renderer.removeChild(this.textNode.parentNode, this.textNode);
    }
  }
  updateView(content) {
    this.clear();
    if (!content) {
      return;
    }
    if (content instanceof TemplateRef) {
      this.viewContainerRef()?.createEmbeddedView(content);
    } else {
      this.textNode = this.renderer.createText(content);
      const element = this.viewContainerRef()?.element.nativeElement;
      this.renderer.appendChild(element.parentNode, this.textNode);
    }
  }
};
_TooltipComponent.ɵfac = function TooltipComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TooltipComponent)();
};
_TooltipComponent.ɵcmp = ɵɵdefineComponent({
  type: _TooltipComponent,
  selectors: [["c-tooltip"]],
  viewQuery: function TooltipComponent_Query(rf, ctx) {
    if (rf & 1) {
      ɵɵviewQuerySignal(ctx.viewContainerRef, _c13, 5, ViewContainerRef);
    }
    if (rf & 2) {
      ɵɵqueryAdvance();
    }
  },
  hostAttrs: [1, "tooltip", "fade", "bs-tooltip-auto"],
  hostVars: 4,
  hostBindings: function TooltipComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("role", ctx.role())("id", ctx.id());
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    content: [1, "content"],
    visible: [1, "visible"],
    id: [1, "id"],
    role: [1, "role"]
  },
  standalone: true,
  features: [ɵɵStandaloneFeature],
  decls: 5,
  vars: 0,
  consts: [["tooltipTemplate", ""], ["data-popper-arrow", "", 1, "tooltip-arrow"], [1, "tooltip-inner"]],
  template: function TooltipComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelementContainerStart(0);
      ɵɵelement(1, "div", 1);
      ɵɵelementStart(2, "div", 2);
      ɵɵelementContainer(3, null, 0);
      ɵɵelementEnd();
      ɵɵelementContainerEnd();
    }
  },
  encapsulation: 2
});
var TooltipComponent = _TooltipComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TooltipComponent, [{
    type: Component,
    args: [{
      selector: "c-tooltip",
      standalone: true,
      host: {
        class: "tooltip fade bs-tooltip-auto",
        "[class]": "hostClasses()",
        "[attr.role]": "role()",
        "[attr.id]": "id()"
      },
      template: '<ng-container>\n  <div class="tooltip-arrow" data-popper-arrow></div>\n  <div class="tooltip-inner">\n    <ng-container #tooltipTemplate />\n  </div>\n</ng-container>\n'
    }]
  }], null, null);
})();
var _destroyRef12, _document5;
var _TooltipDirective = class _TooltipDirective {
  constructor(renderer, hostElement, viewContainerRef, listenersService, changeDetectorRef, intersectionService) {
    __privateAdd(this, _destroyRef12);
    __privateAdd(this, _document5);
    this.renderer = renderer;
    this.hostElement = hostElement;
    this.viewContainerRef = viewContainerRef;
    this.listenersService = listenersService;
    this.changeDetectorRef = changeDetectorRef;
    this.intersectionService = intersectionService;
    this.content = input(void 0, {
      alias: "cTooltip"
    });
    this.contentEffect = effect(() => {
      if (this.content()) {
        this.destroyTooltipElement();
      }
    });
    this.popperOptions = input({}, {
      alias: "cTooltipOptions"
    });
    this.popperOptionsEffect = effect(() => {
      this._popperOptions = __spreadValues(__spreadProps(__spreadValues({}, this._popperOptions), {
        placement: this.placement()
      }), this.popperOptions());
    });
    this.popperOptionsComputed = computed(() => {
      return __spreadValues({
        placement: this.placement()
      }, this._popperOptions);
    });
    this.placement = input("top", {
      alias: "cTooltipPlacement"
    });
    this.reference = input(void 0, {
      alias: "cTooltipRef"
    });
    this.referenceRef = computed(() => this.reference()?.elementRef ?? this.hostElement);
    this.trigger = input("hover", {
      alias: "cTooltipTrigger"
    });
    this.visible = model(false, {
      alias: "cTooltipVisible"
    });
    this.visibleEffect = effect(() => {
      this.visible() ? this.addTooltipElement() : this.removeTooltipElement();
    });
    this._popperOptions = {
      modifiers: [{
        name: "offset",
        options: {
          offset: [0, 5]
        }
      }]
    };
    __privateSet(this, _destroyRef12, inject(DestroyRef));
    __privateSet(this, _document5, inject(DOCUMENT));
  }
  get ariaDescribedBy() {
    return this.tooltipId ? this.tooltipId : null;
  }
  ngAfterViewInit() {
    this.intersectionServiceSubscribe();
  }
  ngOnDestroy() {
    this.clearListeners();
    this.destroyTooltipElement();
  }
  ngOnInit() {
    this.setListeners();
  }
  setListeners() {
    const config = {
      hostElement: this.hostElement,
      trigger: this.trigger(),
      callbackToggle: () => {
        this.visible.set(!this.visible());
      },
      callbackOff: () => {
        this.visible.set(false);
      },
      callbackOn: () => {
        this.visible.set(true);
      }
    };
    this.listenersService.setListeners(config);
  }
  clearListeners() {
    this.listenersService.clearListeners();
  }
  intersectionServiceSubscribe() {
    this.intersectionService.createIntersectionObserver(this.referenceRef());
    this.intersectionService.intersecting$.pipe(filter((next) => next.hostElement === this.referenceRef()), debounceTime(100), finalize(() => {
      this.intersectionService.unobserve(this.referenceRef());
    }), takeUntilDestroyed(__privateGet(this, _destroyRef12))).subscribe((next) => {
      this.visible.set(next.isIntersecting ? this.visible() : false);
    });
  }
  getUID(prefix) {
    let uid = prefix ?? "random-id";
    do {
      uid = `${prefix}-${Math.floor(Math.random() * 1e6).toString(10)}`;
    } while (__privateGet(this, _document5).getElementById(uid));
    return uid;
  }
  createTooltipElement() {
    if (!this.tooltipRef) {
      this.tooltipRef = this.viewContainerRef.createComponent(TooltipComponent);
    }
  }
  destroyTooltipElement() {
    this.tooltip?.remove();
    this.tooltipRef?.destroy();
    this.tooltipRef = void 0;
    this.popperInstance?.destroy();
    this.viewContainerRef?.detach();
    this.viewContainerRef?.clear();
  }
  addTooltipElement() {
    if (!this.content()) {
      this.destroyTooltipElement();
      return;
    }
    if (!this.tooltipRef) {
      this.createTooltipElement();
    }
    this.tooltipRef?.setInput("content", this.content() ?? "");
    this.tooltip = this.tooltipRef?.location.nativeElement;
    this.renderer.addClass(this.tooltip, "d-none");
    this.renderer.addClass(this.tooltip, "fade");
    this.popperInstance?.destroy();
    this.viewContainerRef.insert(this.tooltipRef.hostView);
    this.renderer.appendChild(__privateGet(this, _document5).body, this.tooltip);
    this.popperInstance = createPopper3(this.referenceRef().nativeElement, this.tooltip, __spreadValues({}, this.popperOptionsComputed()));
    if (!this.visible()) {
      this.removeTooltipElement();
      return;
    }
    setTimeout(() => {
      this.tooltipId = this.getUID("tooltip");
      this.tooltipRef?.setInput("id", this.tooltipId);
      this.renderer.removeClass(this.tooltip, "d-none");
      this.tooltipRef?.setInput("visible", this.visible());
      this.popperInstance?.forceUpdate();
      this.changeDetectorRef?.markForCheck();
    }, 100);
  }
  removeTooltipElement() {
    this.tooltipId = "";
    if (!this.tooltipRef) {
      return;
    }
    this.tooltipRef.setInput("visible", false);
    this.tooltipRef.setInput("id", void 0);
    this.changeDetectorRef.markForCheck();
    setTimeout(() => {
      this.viewContainerRef?.detach();
    }, 300);
  }
};
_destroyRef12 = new WeakMap();
_document5 = new WeakMap();
_TooltipDirective.ɵfac = function TooltipDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TooltipDirective)(ɵɵdirectiveInject(Renderer2), ɵɵdirectiveInject(ElementRef), ɵɵdirectiveInject(ViewContainerRef), ɵɵdirectiveInject(ListenersService), ɵɵdirectiveInject(ChangeDetectorRef), ɵɵdirectiveInject(IntersectionService));
};
_TooltipDirective.ɵdir = ɵɵdefineDirective({
  type: _TooltipDirective,
  selectors: [["", "cTooltip", ""]],
  hostVars: 1,
  hostBindings: function TooltipDirective_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵattribute("aria-describedby", ctx.ariaDescribedBy);
    }
  },
  inputs: {
    content: [1, "cTooltip", "content"],
    popperOptions: [1, "cTooltipOptions", "popperOptions"],
    placement: [1, "cTooltipPlacement", "placement"],
    reference: [1, "cTooltipRef", "reference"],
    trigger: [1, "cTooltipTrigger", "trigger"],
    visible: [1, "cTooltipVisible", "visible"]
  },
  outputs: {
    visible: "cTooltipVisibleChange"
  },
  exportAs: ["cTooltip"],
  standalone: true,
  features: [ɵɵProvidersFeature([ListenersService, IntersectionService])]
});
var TooltipDirective = _TooltipDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TooltipDirective, [{
    type: Directive,
    args: [{
      selector: "[cTooltip]",
      exportAs: "cTooltip",
      providers: [ListenersService, IntersectionService],
      standalone: true,
      host: {
        "[attr.aria-describedby]": "ariaDescribedBy"
      }
    }]
  }], () => [{
    type: Renderer2
  }, {
    type: ElementRef
  }, {
    type: ViewContainerRef
  }, {
    type: ListenersService
  }, {
    type: ChangeDetectorRef
  }, {
    type: IntersectionService
  }], null);
})();
var _TooltipModule = class _TooltipModule {
};
_TooltipModule.ɵfac = function TooltipModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TooltipModule)();
};
_TooltipModule.ɵmod = ɵɵdefineNgModule({
  type: _TooltipModule,
  imports: [TooltipComponent, TooltipDirective],
  exports: [TooltipComponent, TooltipDirective]
});
_TooltipModule.ɵinj = ɵɵdefineInjector({});
var TooltipModule = _TooltipModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TooltipModule, [{
    type: NgModule,
    args: [{
      exports: [TooltipComponent, TooltipDirective],
      imports: [TooltipComponent, TooltipDirective]
    }]
  }], null, null);
})();
var _WidgetStatAComponent = class _WidgetStatAComponent extends CardComponent {
  constructor() {
    super(...arguments);
    this.title = input();
    this.value = input();
    this.templates = {};
    this.contentTemplates = contentChildren(TemplateIdDirective, {
      descendants: true
    });
    this.contentTemplatesEffect = effect(() => {
      this.contentTemplates().forEach((child) => {
        this.templates[child.id] = child.templateRef;
      });
    });
    this.hostClasses = computed(() => {
      const color = this.color();
      return {
        card: true,
        [`bg-${color}`]: !!color,
        "text-white": !!color
      };
    });
  }
  get bodyClasses() {
    return {
      "pb-0": true,
      "d-flex": true,
      "justify-content-between": true,
      "align-items-start": true
    };
  }
};
_WidgetStatAComponent.ɵfac = /* @__PURE__ */ (() => {
  let ɵWidgetStatAComponent_BaseFactory;
  return function WidgetStatAComponent_Factory(__ngFactoryType__) {
    return (ɵWidgetStatAComponent_BaseFactory || (ɵWidgetStatAComponent_BaseFactory = ɵɵgetInheritedFactory(_WidgetStatAComponent)))(__ngFactoryType__ || _WidgetStatAComponent);
  };
})();
_WidgetStatAComponent.ɵcmp = ɵɵdefineComponent({
  type: _WidgetStatAComponent,
  selectors: [["c-widget-stat-a"]],
  contentQueries: function WidgetStatAComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuerySignal(dirIndex, ctx.contentTemplates, TemplateIdDirective, 5);
    }
    if (rf & 2) {
      ɵɵqueryAdvance();
    }
  },
  hostAttrs: [1, "card"],
  hostVars: 2,
  hostBindings: function WidgetStatAComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    title: [1, "title"],
    value: [1, "value"]
  },
  exportAs: ["cWidgetStatA"],
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c15,
  decls: 15,
  vars: 5,
  consts: [["defaultWidgetTitleTemplate", ""], ["defaultWidgetValueTemplate", ""], ["defaultWidgetChartTemplate", ""], ["defaultWidgetActionTemplate", ""], [3, "ngClass"], [1, "fs-4", "fw-semibold"], [4, "ngTemplateOutlet"]],
  template: function WidgetStatAComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef(_c14);
      ɵɵelementContainerStart(0);
      ɵɵelementStart(1, "c-card-body", 4)(2, "div");
      ɵɵtemplate(3, WidgetStatAComponent_Conditional_3_Template, 2, 1, "div", 5)(4, WidgetStatAComponent_Conditional_4_Template, 2, 1, "div");
      ɵɵelementEnd();
      ɵɵtemplate(5, WidgetStatAComponent_ng_container_5_Template, 1, 0, "ng-container", 6);
      ɵɵelementEnd();
      ɵɵtemplate(6, WidgetStatAComponent_ng_container_6_Template, 1, 0, "ng-container", 6);
      ɵɵelementContainerEnd();
      ɵɵtemplate(7, WidgetStatAComponent_ng_template_7_Template, 1, 1, "ng-template", null, 0, ɵɵtemplateRefExtractor)(9, WidgetStatAComponent_ng_template_9_Template, 1, 1, "ng-template", null, 1, ɵɵtemplateRefExtractor)(11, WidgetStatAComponent_ng_template_11_Template, 1, 0, "ng-template", null, 2, ɵɵtemplateRefExtractor)(13, WidgetStatAComponent_ng_template_13_Template, 1, 0, "ng-template", null, 3, ɵɵtemplateRefExtractor);
    }
    if (rf & 2) {
      const defaultWidgetChartTemplate_r4 = ɵɵreference(12);
      const defaultWidgetActionTemplate_r5 = ɵɵreference(14);
      ɵɵadvance();
      ɵɵproperty("ngClass", ctx.bodyClasses);
      ɵɵadvance(2);
      ɵɵconditional(!!ctx.value() || (ctx.templates == null ? null : ctx.templates["widgetValueTemplate"]) ? 3 : -1);
      ɵɵadvance();
      ɵɵconditional(!!ctx.title() || (ctx.templates == null ? null : ctx.templates["widgetTitleTemplate"]) ? 4 : -1);
      ɵɵadvance();
      ɵɵproperty("ngTemplateOutlet", (ctx.templates == null ? null : ctx.templates["widgetActionTemplate"]) || defaultWidgetActionTemplate_r5);
      ɵɵadvance();
      ɵɵproperty("ngTemplateOutlet", (ctx.templates == null ? null : ctx.templates["widgetChartTemplate"]) || defaultWidgetChartTemplate_r4);
    }
  },
  dependencies: [CardBodyComponent, NgClass, NgTemplateOutlet],
  encapsulation: 2
});
var WidgetStatAComponent = _WidgetStatAComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WidgetStatAComponent, [{
    type: Component,
    args: [{
      selector: "c-widget-stat-a",
      exportAs: "cWidgetStatA",
      imports: [CardBodyComponent, NgClass, NgTemplateOutlet],
      standalone: true,
      host: {
        class: "card",
        "[class]": "hostClasses()"
      },
      template: `<ng-container>
  <c-card-body [ngClass]="bodyClasses">
    <div>
      @if (!!value() || templates?.['widgetValueTemplate']) {
        <div class="fs-4 fw-semibold">
          <ng-container *ngTemplateOutlet="templates?.['widgetValueTemplate'] || defaultWidgetValueTemplate" />
        </div>
      }
      @if (!!title() || templates?.['widgetTitleTemplate']) {
        <div>
          <ng-container *ngTemplateOutlet="templates?.['widgetTitleTemplate'] || defaultWidgetTitleTemplate" />
        </div>
      }
    </div>
    <ng-container *ngTemplateOutlet="templates?.['widgetActionTemplate'] || defaultWidgetActionTemplate" />
  </c-card-body>
  <ng-container *ngTemplateOutlet="templates?.['widgetChartTemplate'] || defaultWidgetChartTemplate" />
</ng-container>

<ng-template #defaultWidgetTitleTemplate>
  {{ title() }}
</ng-template>

<ng-template #defaultWidgetValueTemplate>
  {{ value() }}
</ng-template>

<ng-template #defaultWidgetChartTemplate>
  <ng-content select=".chart-wrapper" />
</ng-template>

<ng-template #defaultWidgetActionTemplate>
  <ng-content />
</ng-template>
`
    }]
  }], null, null);
})();
var _WidgetStatBComponent = class _WidgetStatBComponent extends CardComponent {
  constructor() {
    super();
    this.title = input();
    this.text = input();
    this.value = input();
    this.inverse = input(false, {
      transform: booleanAttribute
    });
    this.hostClasses = computed(() => {
      const color = this.color();
      const textColor = this.textColor();
      return {
        card: true,
        [`bg-${color}`]: !!color,
        [`text-${textColor}`]: !!textColor,
        "text-white": this.inverse()
      };
    });
  }
};
_WidgetStatBComponent.ɵfac = function WidgetStatBComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _WidgetStatBComponent)();
};
_WidgetStatBComponent.ɵcmp = ɵɵdefineComponent({
  type: _WidgetStatBComponent,
  selectors: [["c-widget-stat-b"]],
  hostAttrs: [1, "card"],
  hostVars: 2,
  hostBindings: function WidgetStatBComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    title: [1, "title"],
    text: [1, "text"],
    value: [1, "value"],
    inverse: [1, "inverse"]
  },
  exportAs: ["cWidgetStatB"],
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 5,
  vars: 3,
  consts: [[1, "fs-4", "fw-semibold"], [3, "ngClass"]],
  template: function WidgetStatBComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "c-card-body");
      ɵɵtemplate(1, WidgetStatBComponent_Conditional_1_Template, 2, 1, "div", 0)(2, WidgetStatBComponent_Conditional_2_Template, 2, 1, "div");
      ɵɵprojection(3);
      ɵɵtemplate(4, WidgetStatBComponent_Conditional_4_Template, 2, 2, "small", 1);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵadvance();
      ɵɵconditional(!!ctx.value() ? 1 : -1);
      ɵɵadvance();
      ɵɵconditional(!!ctx.title() ? 2 : -1);
      ɵɵadvance(2);
      ɵɵconditional(ctx.text() ? 4 : -1);
    }
  },
  dependencies: [CardBodyComponent, NgClass],
  encapsulation: 2
});
var WidgetStatBComponent = _WidgetStatBComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WidgetStatBComponent, [{
    type: Component,
    args: [{
      selector: "c-widget-stat-b",
      exportAs: "cWidgetStatB",
      standalone: true,
      imports: [CardBodyComponent, NgClass],
      host: {
        class: "card",
        "[class]": "hostClasses()"
      },
      template: `<c-card-body>
  @if (!!value()) {
    <div class="fs-4 fw-semibold">{{ value() }}</div>
  }
  @if (!!title()) {
    <div>{{ title() }}</div>
  }
  <ng-content />
  @if (text()) {
    <small [ngClass]="inverse() ? 'text-white text-opacity-75' : 'text-body-secondary'">
      {{ text() }}
    </small>
  }
</c-card-body>
`
    }]
  }], () => [], null);
})();
var _WidgetStatCComponent = class _WidgetStatCComponent extends CardComponent {
  constructor() {
    super();
    this.icon = input();
    this.title = input();
    this.value = input();
    this.inverse = input(false, {
      transform: booleanAttribute
    });
    this.templates = {};
    this.contentTemplates = contentChildren(TemplateIdDirective, {
      descendants: true
    });
    this.contentTemplatesEffect = effect(() => {
      this.contentTemplates().forEach((child) => {
        this.templates[child.id] = child.templateRef;
      });
    });
    this.hostExtendedClass = computed(() => {
      return __spreadProps(__spreadValues({}, this.hostClasses()), {
        "text-white": this.inverse()
      });
    });
    this.titleClasses = computed(() => {
      const inverse = this.inverse();
      return {
        "text-body-secondary": !inverse,
        "text-white": inverse,
        "text-opacity-75": inverse,
        [`text-${this.textColor()}`]: !!this.textColor()
      };
    });
    this.valueClasses = computed(() => {
      return __spreadProps(__spreadValues({
        "fs-4": !this.textColor(),
        "fw-semibold": true
      }, this.titleClasses()), {
        "text-opacity-75": false
      });
    });
    this.iconClasses = computed(() => {
      return __spreadValues({
        "mb-4": !this.textColor(),
        "text-end": true
      }, this.titleClasses());
    });
  }
};
_WidgetStatCComponent.ɵfac = function WidgetStatCComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _WidgetStatCComponent)();
};
_WidgetStatCComponent.ɵcmp = ɵɵdefineComponent({
  type: _WidgetStatCComponent,
  selectors: [["c-widget-stat-c"]],
  contentQueries: function WidgetStatCComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuerySignal(dirIndex, ctx.contentTemplates, TemplateIdDirective, 5);
    }
    if (rf & 2) {
      ɵɵqueryAdvance();
    }
  },
  hostVars: 2,
  hostBindings: function WidgetStatCComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostExtendedClass());
    }
  },
  inputs: {
    icon: [1, "icon"],
    title: [1, "title"],
    value: [1, "value"],
    inverse: [1, "inverse"]
  },
  exportAs: ["cWidgetStatC"],
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 9,
  vars: 4,
  consts: [["defaultWidgetIconTemplate", ""], ["defaultWidgetProgressTemplate", ""], [3, "ngClass"], [4, "ngTemplateOutlet"]],
  template: function WidgetStatCComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "c-card-body");
      ɵɵtemplate(1, WidgetStatCComponent_Conditional_1_Template, 2, 2, "div", 2)(2, WidgetStatCComponent_Conditional_2_Template, 2, 2, "div", 2)(3, WidgetStatCComponent_Conditional_3_Template, 2, 2, "div", 2)(4, WidgetStatCComponent_Conditional_4_Template, 1, 1, "ng-container");
      ɵɵelementEnd();
      ɵɵtemplate(5, WidgetStatCComponent_ng_template_5_Template, 1, 1, "ng-template", null, 0, ɵɵtemplateRefExtractor)(7, WidgetStatCComponent_ng_template_7_Template, 1, 0, "ng-template", null, 1, ɵɵtemplateRefExtractor);
    }
    if (rf & 2) {
      ɵɵadvance();
      ɵɵconditional(ctx.icon() || (ctx.templates == null ? null : ctx.templates["widgetIconTemplate"]) ? 1 : -1);
      ɵɵadvance();
      ɵɵconditional(!!ctx.value() ? 2 : -1);
      ɵɵadvance();
      ɵɵconditional(!!ctx.title() ? 3 : -1);
      ɵɵadvance();
      ɵɵconditional((ctx.templates == null ? null : ctx.templates["widgetProgressTemplate"]) ? 4 : -1);
    }
  },
  dependencies: [CardBodyComponent, NgClass, NgTemplateOutlet],
  encapsulation: 2
});
var WidgetStatCComponent = _WidgetStatCComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WidgetStatCComponent, [{
    type: Component,
    args: [{
      selector: "c-widget-stat-c",
      exportAs: "cWidgetStatC",
      standalone: true,
      imports: [CardBodyComponent, NgClass, NgTemplateOutlet],
      host: {
        "[class]": "hostExtendedClass()"
      },
      template: `<c-card-body>
  @if (icon() || templates?.['widgetIconTemplate']) {
    <div [ngClass]="iconClasses()">
      <ng-container *ngTemplateOutlet="templates?.['widgetIconTemplate'] || defaultWidgetIconTemplate" />
    </div>
  }
  @if (!!value()) {
    <div [ngClass]="valueClasses()">
      {{ value() }}
    </div>
  }
  @if (!!title()) {
    <div [ngClass]="titleClasses()">
      {{ title() }}
    </div>
  }
  @if (templates?.['widgetProgressTemplate']) {
    <ng-container *ngTemplateOutlet="templates?.['widgetProgressTemplate'] || defaultWidgetProgressTemplate" />
  }
</c-card-body>

<ng-template #defaultWidgetIconTemplate>
  {{ icon() }}
</ng-template>

<ng-template #defaultWidgetProgressTemplate>
  <ng-content />
</ng-template>
`
    }]
  }], () => [], null);
})();
var _WidgetStatDComponent = class _WidgetStatDComponent extends CardComponent {
  constructor() {
    super(...arguments);
    this.values = input();
    this.headerClasses = computed(() => {
      return {
        "position-relative": true,
        "d-flex": true,
        "justify-content-center": true,
        "align-items-center": true,
        [`bg-${this.color()}`]: this.color()
      };
    });
  }
};
_WidgetStatDComponent.ɵfac = /* @__PURE__ */ (() => {
  let ɵWidgetStatDComponent_BaseFactory;
  return function WidgetStatDComponent_Factory(__ngFactoryType__) {
    return (ɵWidgetStatDComponent_BaseFactory || (ɵWidgetStatDComponent_BaseFactory = ɵɵgetInheritedFactory(_WidgetStatDComponent)))(__ngFactoryType__ || _WidgetStatDComponent);
  };
})();
_WidgetStatDComponent.ɵcmp = ɵɵdefineComponent({
  type: _WidgetStatDComponent,
  selectors: [["c-widget-stat-d"]],
  hostAttrs: [1, "card"],
  inputs: {
    values: [1, "values"]
  },
  exportAs: ["cWidgetStatD"],
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 5,
  vars: 1,
  consts: [[3, "ngClass"], ["cRow", "", 1, "text-center"], [1, "vr"], [1, "fs-5", "fw-semibold"], [1, "text-uppercase", "text-body-secondary", "small"]],
  template: function WidgetStatDComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "c-card-header", 0);
      ɵɵprojection(1);
      ɵɵelementEnd();
      ɵɵelementStart(2, "c-card-body", 1);
      ɵɵrepeaterCreate(3, WidgetStatDComponent_For_4_Template, 6, 3, "c-col", null, ɵɵrepeaterTrackByIdentity);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵproperty("ngClass", ctx.headerClasses());
      ɵɵadvance(3);
      ɵɵrepeater(ctx.values());
    }
  },
  dependencies: [CardHeaderComponent, CardBodyComponent, ColComponent, RowDirective, NgClass],
  encapsulation: 2
});
var WidgetStatDComponent = _WidgetStatDComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WidgetStatDComponent, [{
    type: Component,
    args: [{
      selector: "c-widget-stat-d",
      exportAs: "cWidgetStatD",
      standalone: true,
      imports: [CardHeaderComponent, CardBodyComponent, ColComponent, RowDirective, NgClass],
      host: {
        class: "card"
      },
      template: '<c-card-header [ngClass]="headerClasses()">\n  <ng-content />\n</c-card-header>\n<c-card-body cRow class="text-center">\n  @for (item of values(); track item; let i = $index) {\n    @if (i % 2 !== 0) {\n      <div class="vr"></div>\n    }\n    <c-col>\n      <div class="fs-5 fw-semibold">{{ item.value }}</div>\n      <div class="text-uppercase text-body-secondary small">{{ item.title }}</div>\n    </c-col>\n  }\n</c-card-body>\n'
    }]
  }], null, null);
})();
var _WidgetStatEComponent = class _WidgetStatEComponent extends CardComponent {
  constructor() {
    super();
    this.title = input();
    this.value = input();
    this.titleClasses = computed(() => {
      const textColor = this.textColor();
      return {
        "text-body-secondary": !textColor,
        small: true,
        "text-uppercase": true,
        "fw-semibold": true,
        [`text-${textColor}`]: !!textColor
      };
    });
  }
};
_WidgetStatEComponent.ɵfac = function WidgetStatEComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _WidgetStatEComponent)();
};
_WidgetStatEComponent.ɵcmp = ɵɵdefineComponent({
  type: _WidgetStatEComponent,
  selectors: [["c-widget-stat-e"]],
  inputs: {
    title: [1, "title"],
    value: [1, "value"]
  },
  exportAs: ["cWidgetStatE"],
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵStandaloneFeature],
  ngContentSelectors: _c0,
  decls: 4,
  vars: 2,
  consts: [[1, "text-center"], [3, "ngClass"], [1, "fs-6", "fw-semibold", "py-3"]],
  template: function WidgetStatEComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵprojectionDef();
      ɵɵelementStart(0, "c-card-body", 0);
      ɵɵtemplate(1, WidgetStatEComponent_Conditional_1_Template, 2, 2, "div", 1)(2, WidgetStatEComponent_Conditional_2_Template, 2, 1, "div", 2);
      ɵɵprojection(3);
      ɵɵelementEnd();
    }
    if (rf & 2) {
      ɵɵadvance();
      ɵɵconditional(!!ctx.title() ? 1 : -1);
      ɵɵadvance();
      ɵɵconditional(!!ctx.value() ? 2 : -1);
    }
  },
  dependencies: [CardBodyComponent, NgClass],
  encapsulation: 2
});
var WidgetStatEComponent = _WidgetStatEComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WidgetStatEComponent, [{
    type: Component,
    args: [{
      selector: "c-widget-stat-e",
      exportAs: "cWidgetStatE",
      standalone: true,
      imports: [CardBodyComponent, NgClass],
      template: '<c-card-body class="text-center">\n  @if (!!title()) {\n    <div [ngClass]="titleClasses()">{{ title() }}</div>\n  }\n  @if (!!value()) {\n    <div class="fs-6 fw-semibold py-3">{{ value() }}</div>\n  }\n  <ng-content />\n</c-card-body>\n'
    }]
  }], () => [], null);
})();
var _WidgetStatFComponent = class _WidgetStatFComponent extends CardComponent {
  constructor() {
    super(...arguments);
    this.footer = input();
    this.icon = input();
    this.padding = input(false, {
      transform: booleanAttribute
    });
    this.title = input();
    this.value = input();
    this.templates = {};
    this.contentTemplates = contentChildren(TemplateIdDirective, {
      descendants: true
    });
    this.contentTemplatesEffect = effect(() => {
      this.contentTemplates().forEach((child) => {
        this.templates[child.id] = child.templateRef;
      });
    });
    this.cardBodyClasses = computed(() => {
      return {
        "d-flex": true,
        "align-items-center": true,
        "p-0": !this.padding()
      };
    });
    this.iconClasses = computed(() => {
      const color = this.color();
      const padding = this.padding();
      return {
        "me-3": !this.textColor(),
        "text-white": true,
        [`bg-${color}`]: !!color,
        "p-3": padding,
        "p-4": !padding,
        "rounded-start-1": !padding
      };
    });
    this.titleClasses = computed(() => {
      const textColor = this.textColor();
      return {
        "text-body-secondary": !textColor,
        small: true,
        "text-uppercase": true,
        "fw-semibold": true,
        [`text-${textColor}`]: !!textColor
      };
    });
    this.valueClasses = computed(() => {
      const textColor = this.textColor();
      return {
        "fs-6": !textColor,
        "fw-semibold": true,
        [`text-${textColor}`]: !!textColor
      };
    });
  }
};
_WidgetStatFComponent.ɵfac = /* @__PURE__ */ (() => {
  let ɵWidgetStatFComponent_BaseFactory;
  return function WidgetStatFComponent_Factory(__ngFactoryType__) {
    return (ɵWidgetStatFComponent_BaseFactory || (ɵWidgetStatFComponent_BaseFactory = ɵɵgetInheritedFactory(_WidgetStatFComponent)))(__ngFactoryType__ || _WidgetStatFComponent);
  };
})();
_WidgetStatFComponent.ɵcmp = ɵɵdefineComponent({
  type: _WidgetStatFComponent,
  selectors: [["c-widget-stat-f"]],
  contentQueries: function WidgetStatFComponent_ContentQueries(rf, ctx, dirIndex) {
    if (rf & 1) {
      ɵɵcontentQuerySignal(dirIndex, ctx.contentTemplates, TemplateIdDirective, 5);
    }
    if (rf & 2) {
      ɵɵqueryAdvance();
    }
  },
  hostAttrs: [1, "card"],
  hostVars: 2,
  hostBindings: function WidgetStatFComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      ɵɵclassMap(ctx.hostClasses());
    }
  },
  inputs: {
    footer: [1, "footer"],
    icon: [1, "icon"],
    padding: [1, "padding"],
    title: [1, "title"],
    value: [1, "value"]
  },
  exportAs: ["cWidgetStatB"],
  standalone: true,
  features: [ɵɵInheritDefinitionFeature, ɵɵStandaloneFeature],
  decls: 14,
  vars: 8,
  consts: [["defaultWidgetIconTemplate", ""], ["defaultFooterIconTemplate", ""], [3, "ngClass"], [4, "ngTemplateOutlet"]],
  template: function WidgetStatFComponent_Template(rf, ctx) {
    if (rf & 1) {
      ɵɵelementContainerStart(0);
      ɵɵelementStart(1, "c-card-body", 2)(2, "div", 2);
      ɵɵtemplate(3, WidgetStatFComponent_ng_container_3_Template, 1, 0, "ng-container", 3);
      ɵɵelementEnd();
      ɵɵelementStart(4, "div")(5, "div", 2);
      ɵɵtext(6);
      ɵɵelementEnd();
      ɵɵelementStart(7, "div", 2);
      ɵɵtext(8);
      ɵɵelementEnd()()();
      ɵɵtemplate(9, WidgetStatFComponent_Conditional_9_Template, 2, 1, "c-card-footer");
      ɵɵelementContainerEnd();
      ɵɵtemplate(10, WidgetStatFComponent_ng_template_10_Template, 2, 1, "ng-template", null, 0, ɵɵtemplateRefExtractor)(12, WidgetStatFComponent_ng_template_12_Template, 2, 1, "ng-template", null, 1, ɵɵtemplateRefExtractor);
    }
    if (rf & 2) {
      const defaultWidgetIconTemplate_r3 = ɵɵreference(11);
      ɵɵadvance();
      ɵɵproperty("ngClass", ctx.cardBodyClasses());
      ɵɵadvance();
      ɵɵproperty("ngClass", ctx.iconClasses());
      ɵɵadvance();
      ɵɵproperty("ngTemplateOutlet", (ctx.templates == null ? null : ctx.templates["widgetIconTemplate"]) || defaultWidgetIconTemplate_r3);
      ɵɵadvance(2);
      ɵɵproperty("ngClass", ctx.valueClasses());
      ɵɵadvance();
      ɵɵtextInterpolate(ctx.value());
      ɵɵadvance();
      ɵɵproperty("ngClass", ctx.titleClasses());
      ɵɵadvance();
      ɵɵtextInterpolate(ctx.title());
      ɵɵadvance();
      ɵɵconditional(ctx.footer() || (ctx.templates == null ? null : ctx.templates["widgetFooterTemplate"]) ? 9 : -1);
    }
  },
  dependencies: [CardBodyComponent, CardFooterComponent, NgClass, NgTemplateOutlet],
  encapsulation: 2
});
var WidgetStatFComponent = _WidgetStatFComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WidgetStatFComponent, [{
    type: Component,
    args: [{
      selector: "c-widget-stat-f",
      exportAs: "cWidgetStatB",
      standalone: true,
      imports: [CardBodyComponent, CardFooterComponent, NgClass, NgTemplateOutlet],
      host: {
        class: "card",
        "[class]": "hostClasses()"
      },
      template: `<ng-container>
  <c-card-body [ngClass]="cardBodyClasses()">
    <div [ngClass]="iconClasses()">
      <ng-container *ngTemplateOutlet="templates?.['widgetIconTemplate'] || defaultWidgetIconTemplate" />
    </div>
    <div>
      <div [ngClass]="valueClasses()">{{ value() }}</div>
      <div [ngClass]="titleClasses()">{{ title() }}</div>
    </div>
  </c-card-body>
  @if (footer() || templates?.['widgetFooterTemplate']) {
    <c-card-footer>
      <ng-container *ngTemplateOutlet="templates?.['widgetFooterTemplate'] || defaultFooterIconTemplate" />
    </c-card-footer>
  }
</ng-container>

<ng-template #defaultWidgetIconTemplate>
  <span>{{ icon() }}</span>
</ng-template>

<ng-template #defaultFooterIconTemplate>
  <span>{{ footer() }}</span>
</ng-template>
`
    }]
  }], null, null);
})();
var _WidgetModule = class _WidgetModule {
};
_WidgetModule.ɵfac = function WidgetModule_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _WidgetModule)();
};
_WidgetModule.ɵmod = ɵɵdefineNgModule({
  type: _WidgetModule,
  imports: [WidgetStatAComponent, WidgetStatBComponent, WidgetStatCComponent, WidgetStatDComponent, WidgetStatEComponent, WidgetStatFComponent],
  exports: [WidgetStatAComponent, WidgetStatBComponent, WidgetStatCComponent, WidgetStatDComponent, WidgetStatEComponent, WidgetStatFComponent]
});
_WidgetModule.ɵinj = ɵɵdefineInjector({});
var WidgetModule = _WidgetModule;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(WidgetModule, [{
    type: NgModule,
    args: [{
      imports: [WidgetStatAComponent, WidgetStatBComponent, WidgetStatCComponent, WidgetStatDComponent, WidgetStatEComponent, WidgetStatFComponent],
      exports: [WidgetStatAComponent, WidgetStatBComponent, WidgetStatCComponent, WidgetStatDComponent, WidgetStatEComponent, WidgetStatFComponent]
    }]
  }], null, null);
})();
export {
  AccordionButtonDirective,
  AccordionComponent,
  AccordionItemComponent,
  AccordionModule,
  AlertComponent,
  AlertHeadingDirective,
  AlertLinkDirective,
  AlertModule,
  AlignDirective,
  AvatarComponent,
  AvatarModule,
  BackdropService,
  BadgeComponent,
  BadgeModule,
  BgColorDirective,
  BorderDirective,
  BreadcrumbComponent,
  BreadcrumbItemComponent,
  BreadcrumbModule,
  BreadcrumbRouterComponent,
  BreadcrumbRouterService,
  BreakpointInfix,
  ButtonCloseDirective,
  ButtonDirective,
  ButtonGroupComponent,
  ButtonGroupModule,
  ButtonModule,
  ButtonToolbarComponent,
  CalloutComponent,
  CalloutModule,
  CardBodyComponent,
  CardComponent,
  CardFooterComponent,
  CardGroupComponent,
  CardHeaderActionsComponent,
  CardHeaderComponent,
  CardImgDirective,
  CardImgOverlayComponent,
  CardLinkDirective,
  CardModule,
  CardSubtitleDirective,
  CardTextDirective,
  CardTitleDirective,
  CarouselCaptionComponent,
  CarouselComponent,
  CarouselConfig,
  CarouselControlComponent,
  CarouselIndicatorsComponent,
  CarouselInnerComponent,
  CarouselItemComponent,
  CarouselModule,
  ClassToggleService,
  ColComponent,
  ColDirective,
  CollapseDirective,
  CollapseModule,
  ColorModeService,
  ContainerComponent,
  DropdownCloseDirective,
  DropdownComponent,
  DropdownDividerDirective,
  DropdownHeaderDirective,
  DropdownItemDirective,
  DropdownItemPlainDirective,
  DropdownMenuDirective,
  DropdownModule,
  DropdownService,
  DropdownToggleDirective,
  ElementRefDirective,
  FooterComponent,
  FooterModule,
  FormCheckComponent,
  FormCheckInputDirective,
  FormCheckLabelDirective,
  FormControlDirective,
  FormDirective,
  FormFeedbackComponent,
  FormFloatingDirective,
  FormLabelDirective,
  FormModule,
  FormSelectDirective,
  FormTextDirective,
  GridModule,
  GutterDirective,
  HeaderBrandComponent,
  HeaderComponent,
  HeaderDividerComponent,
  HeaderModule,
  HeaderNavComponent,
  HeaderTextComponent,
  HeaderTogglerDirective,
  HtmlAttributesDirective,
  ImgDirective,
  ImgModule,
  InMemoryStorageService,
  InputGroupComponent,
  InputGroupTextDirective,
  IntersectionService,
  ListGroupDirective,
  ListGroupItemDirective,
  ListGroupModule,
  ListenersService,
  LocalStorageService,
  ModalBodyComponent,
  ModalComponent,
  ModalContentComponent,
  ModalDialogComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalModule,
  ModalService,
  ModalTitleDirective,
  ModalToggleDirective,
  NavComponent,
  NavItemComponent,
  NavLinkDirective,
  NavModule,
  NavbarBrandDirective,
  NavbarComponent,
  NavbarModule,
  NavbarNavComponent,
  NavbarTextComponent,
  NavbarTogglerDirective,
  OffcanvasBodyComponent,
  OffcanvasComponent,
  OffcanvasHeaderComponent,
  OffcanvasModule,
  OffcanvasService,
  OffcanvasTitleDirective,
  OffcanvasToggleDirective,
  PageItemComponent,
  PageItemDirective,
  PageLinkDirective,
  PaginationComponent,
  PaginationModule,
  PlaceholderAnimationDirective,
  PlaceholderDirective,
  PlaceholderModule,
  PopoverComponent,
  PopoverDirective,
  PopoverModule,
  ProgressBarComponent,
  ProgressBarDirective,
  ProgressComponent,
  ProgressModule,
  ProgressStackedComponent,
  RoundedDirective,
  RowComponent,
  RowDirective,
  ShadowOnScrollDirective,
  SharedModule,
  SidebarBrandComponent,
  SidebarComponent,
  SidebarFooterComponent,
  SidebarHeaderComponent,
  SidebarModule,
  SidebarNavComponent,
  SidebarNavHelper,
  SidebarService,
  SidebarToggleDirective,
  SidebarTogglerDirective,
  SpinnerComponent,
  SpinnerModule,
  TabContentComponent,
  TabContentRefDirective,
  TabDirective,
  TabPaneComponent,
  TabPanelComponent,
  TabService,
  TableActiveDirective,
  TableColorDirective,
  TableDirective,
  TableModule,
  Tabs2Module,
  TabsComponent,
  TabsContentComponent,
  TabsListComponent,
  TabsModule,
  TabsService,
  TemplateIdDirective,
  TextBgColorDirective,
  TextColorDirective,
  ThemeDirective,
  ToastBodyComponent,
  ToastCloseDirective,
  ToastComponent,
  ToastHeaderComponent,
  ToastModule,
  ToasterComponent,
  ToasterHostDirective,
  ToasterPlacement,
  ToasterService,
  TooltipComponent,
  TooltipDirective,
  TooltipModule,
  UtilitiesModule,
  WidgetModule,
  WidgetStatAComponent,
  WidgetStatBComponent,
  WidgetStatCComponent,
  WidgetStatDComponent,
  WidgetStatEComponent,
  WidgetStatFComponent
};
/*! Bundled license information:

@angular/animations/fesm2022/animations.mjs:
  (**
   * @license Angular v18.2.1
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)

@angular/core/fesm2022/rxjs-interop.mjs:
  (**
   * @license Angular v18.2.1
   * (c) 2010-2024 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=@coreui_angular.js.map
