/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js!./node_modules/sass-loader/lib/loader.js!./src/styles/common.scss":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__("./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/svg-baker-runtime/browser-symbol.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

var SpriteSymbol = function SpriteSymbol(ref) {
  var id = ref.id;
  var viewBox = ref.viewBox;
  var content = ref.content;

  this.id = id;
  this.viewBox = viewBox;
  this.content = content;
};

/**
 * @return {string}
 */
SpriteSymbol.prototype.stringify = function stringify () {
  return this.content;
};

/**
 * @return {string}
 */
SpriteSymbol.prototype.toString = function toString () {
  return this.stringify();
};

SpriteSymbol.prototype.destroy = function destroy () {
    var this$1 = this;

  ['id', 'viewBox', 'content'].forEach(function (prop) { return delete this$1[prop]; });
};

/**
 * @param {string} content
 * @return {Element}
 */
var parse = function (content) {
  var hasImportNode = !!document.importNode;
  var doc = new DOMParser().parseFromString(content, 'image/svg+xml').documentElement;

  /**
   * Fix for browser which are throwing WrongDocumentError
   * if you insert an element which is not part of the document
   * @see http://stackoverflow.com/a/7986519/4624403
   */
  if (hasImportNode) {
    return document.importNode(doc, true);
  }

  return doc;
};

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var deepmerge = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (false) {} else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {

function isMergeableObject(val) {
    var nonNullObject = val && typeof val === 'object';

    return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]'
}

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {}
}

function cloneIfNecessary(value, optionsArgument) {
    var clone = optionsArgument && optionsArgument.clone === true;
    return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}

function defaultArrayMerge(target, source, optionsArgument) {
    var destination = target.slice();
    source.forEach(function(e, i) {
        if (typeof destination[i] === 'undefined') {
            destination[i] = cloneIfNecessary(e, optionsArgument);
        } else if (isMergeableObject(e)) {
            destination[i] = deepmerge(target[i], e, optionsArgument);
        } else if (target.indexOf(e) === -1) {
            destination.push(cloneIfNecessary(e, optionsArgument));
        }
    });
    return destination
}

function mergeObject(target, source, optionsArgument) {
    var destination = {};
    if (isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
            destination[key] = cloneIfNecessary(target[key], optionsArgument);
        });
    }
    Object.keys(source).forEach(function (key) {
        if (!isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneIfNecessary(source[key], optionsArgument);
        } else {
            destination[key] = deepmerge(target[key], source[key], optionsArgument);
        }
    });
    return destination
}

function deepmerge(target, source, optionsArgument) {
    var array = Array.isArray(source);
    var options = optionsArgument || { arrayMerge: defaultArrayMerge };
    var arrayMerge = options.arrayMerge || defaultArrayMerge;

    if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
    } else {
        return mergeObject(target, source, optionsArgument)
    }
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
    if (!Array.isArray(array) || array.length < 2) {
        throw new Error('first argument should be an array with at least two elements')
    }

    // we are sure there are at least 2 values, so it is safe to have no initial value
    return array.reduce(function(prev, next) {
        return deepmerge(prev, next, optionsArgument)
    })
};

return deepmerge

}));
});

var namespaces_1 = createCommonjsModule(function (module, exports) {
var namespaces = {
  svg: {
    name: 'xmlns',
    uri: 'http://www.w3.org/2000/svg'
  },
  xlink: {
    name: 'xmlns:xlink',
    uri: 'http://www.w3.org/1999/xlink'
  }
};

exports.default = namespaces;
module.exports = exports.default;
});

/**
 * @param {Object} attrs
 * @return {string}
 */
var objectToAttrsString = function (attrs) {
  return Object.keys(attrs).map(function (attr) {
    var value = attrs[attr].toString().replace(/"/g, '&quot;');
    return (attr + "=\"" + value + "\"");
  }).join(' ');
};

var svg = namespaces_1.svg;
var xlink = namespaces_1.xlink;

var defaultAttrs = {};
defaultAttrs[svg.name] = svg.uri;
defaultAttrs[xlink.name] = xlink.uri;

/**
 * @param {string} [content]
 * @param {Object} [attributes]
 * @return {string}
 */
var wrapInSvgString = function (content, attributes) {
  if ( content === void 0 ) content = '';

  var attrs = deepmerge(defaultAttrs, attributes || {});
  var attrsRendered = objectToAttrsString(attrs);
  return ("<svg " + attrsRendered + ">" + content + "</svg>");
};

var BrowserSpriteSymbol = (function (SpriteSymbol$$1) {
  function BrowserSpriteSymbol () {
    SpriteSymbol$$1.apply(this, arguments);
  }

  if ( SpriteSymbol$$1 ) BrowserSpriteSymbol.__proto__ = SpriteSymbol$$1;
  BrowserSpriteSymbol.prototype = Object.create( SpriteSymbol$$1 && SpriteSymbol$$1.prototype );
  BrowserSpriteSymbol.prototype.constructor = BrowserSpriteSymbol;

  var prototypeAccessors = { isMounted: {} };

  prototypeAccessors.isMounted.get = function () {
    return !!this.node;
  };

  /**
   * @param {Element} node
   * @return {BrowserSpriteSymbol}
   */
  BrowserSpriteSymbol.createFromExistingNode = function createFromExistingNode (node) {
    return new BrowserSpriteSymbol({
      id: node.getAttribute('id'),
      viewBox: node.getAttribute('viewBox'),
      content: node.outerHTML
    });
  };

  BrowserSpriteSymbol.prototype.destroy = function destroy () {
    if (this.isMounted) {
      this.unmount();
    }
    SpriteSymbol$$1.prototype.destroy.call(this);
  };

  /**
   * @param {Element|string} target
   * @return {Element}
   */
  BrowserSpriteSymbol.prototype.mount = function mount (target) {
    if (this.isMounted) {
      return this.node;
    }

    var mountTarget = typeof target === 'string' ? document.querySelector(target) : target;
    var node = this.render();
    this.node = node;

    mountTarget.appendChild(node);

    return node;
  };

  /**
   * @return {Element}
   */
  BrowserSpriteSymbol.prototype.render = function render () {
    var content = this.stringify();
    return parse(wrapInSvgString(content)).childNodes[0];
  };

  BrowserSpriteSymbol.prototype.unmount = function unmount () {
    this.node.parentNode.removeChild(this.node);
  };

  Object.defineProperties( BrowserSpriteSymbol.prototype, prototypeAccessors );

  return BrowserSpriteSymbol;
}(SpriteSymbol));

return BrowserSpriteSymbol;

})));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/svg-sprite-loader/runtime/browser-sprite.build.js":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {(function (global, factory) {
	 true ? module.exports = factory() :
	undefined;
}(this, (function () { 'use strict';

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var deepmerge = createCommonjsModule(function (module, exports) {
(function (root, factory) {
    if (false) {} else {
        module.exports = factory();
    }
}(commonjsGlobal, function () {

function isMergeableObject(val) {
    var nonNullObject = val && typeof val === 'object';

    return nonNullObject
        && Object.prototype.toString.call(val) !== '[object RegExp]'
        && Object.prototype.toString.call(val) !== '[object Date]'
}

function emptyTarget(val) {
    return Array.isArray(val) ? [] : {}
}

function cloneIfNecessary(value, optionsArgument) {
    var clone = optionsArgument && optionsArgument.clone === true;
    return (clone && isMergeableObject(value)) ? deepmerge(emptyTarget(value), value, optionsArgument) : value
}

function defaultArrayMerge(target, source, optionsArgument) {
    var destination = target.slice();
    source.forEach(function(e, i) {
        if (typeof destination[i] === 'undefined') {
            destination[i] = cloneIfNecessary(e, optionsArgument);
        } else if (isMergeableObject(e)) {
            destination[i] = deepmerge(target[i], e, optionsArgument);
        } else if (target.indexOf(e) === -1) {
            destination.push(cloneIfNecessary(e, optionsArgument));
        }
    });
    return destination
}

function mergeObject(target, source, optionsArgument) {
    var destination = {};
    if (isMergeableObject(target)) {
        Object.keys(target).forEach(function (key) {
            destination[key] = cloneIfNecessary(target[key], optionsArgument);
        });
    }
    Object.keys(source).forEach(function (key) {
        if (!isMergeableObject(source[key]) || !target[key]) {
            destination[key] = cloneIfNecessary(source[key], optionsArgument);
        } else {
            destination[key] = deepmerge(target[key], source[key], optionsArgument);
        }
    });
    return destination
}

function deepmerge(target, source, optionsArgument) {
    var array = Array.isArray(source);
    var options = optionsArgument || { arrayMerge: defaultArrayMerge };
    var arrayMerge = options.arrayMerge || defaultArrayMerge;

    if (array) {
        return Array.isArray(target) ? arrayMerge(target, source, optionsArgument) : cloneIfNecessary(source, optionsArgument)
    } else {
        return mergeObject(target, source, optionsArgument)
    }
}

deepmerge.all = function deepmergeAll(array, optionsArgument) {
    if (!Array.isArray(array) || array.length < 2) {
        throw new Error('first argument should be an array with at least two elements')
    }

    // we are sure there are at least 2 values, so it is safe to have no initial value
    return array.reduce(function(prev, next) {
        return deepmerge(prev, next, optionsArgument)
    })
};

return deepmerge

}));
});

//      
// An event handler can take an optional event argument
// and should not return a value
                                          
// An array of all currently registered event handlers for a type
                                            
// A map of event types and their corresponding event handlers.
                        
                                   
  

/** Mitt: Tiny (~200b) functional event emitter / pubsub.
 *  @name mitt
 *  @returns {Mitt}
 */
function mitt(all                 ) {
	all = all || Object.create(null);

	return {
		/**
		 * Register an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to listen for, or `"*"` for all events
		 * @param  {Function} handler Function to call in response to given event
		 * @memberOf mitt
		 */
		on: function on(type        , handler              ) {
			(all[type] || (all[type] = [])).push(handler);
		},

		/**
		 * Remove an event handler for the given type.
		 *
		 * @param  {String} type	Type of event to unregister `handler` from, or `"*"`
		 * @param  {Function} handler Handler function to remove
		 * @memberOf mitt
		 */
		off: function off(type        , handler              ) {
			if (all[type]) {
				all[type].splice(all[type].indexOf(handler) >>> 0, 1);
			}
		},

		/**
		 * Invoke all handlers for the given type.
		 * If present, `"*"` handlers are invoked after type-matched handlers.
		 *
		 * @param {String} type  The event type to invoke
		 * @param {Any} [evt]  Any value (object is recommended and powerful), passed to each handler
		 * @memberof mitt
		 */
		emit: function emit(type        , evt     ) {
			(all[type] || []).map(function (handler) { handler(evt); });
			(all['*'] || []).map(function (handler) { handler(type, evt); });
		}
	};
}

var namespaces_1 = createCommonjsModule(function (module, exports) {
var namespaces = {
  svg: {
    name: 'xmlns',
    uri: 'http://www.w3.org/2000/svg'
  },
  xlink: {
    name: 'xmlns:xlink',
    uri: 'http://www.w3.org/1999/xlink'
  }
};

exports.default = namespaces;
module.exports = exports.default;
});

/**
 * @param {Object} attrs
 * @return {string}
 */
var objectToAttrsString = function (attrs) {
  return Object.keys(attrs).map(function (attr) {
    var value = attrs[attr].toString().replace(/"/g, '&quot;');
    return (attr + "=\"" + value + "\"");
  }).join(' ');
};

var svg = namespaces_1.svg;
var xlink = namespaces_1.xlink;

var defaultAttrs = {};
defaultAttrs[svg.name] = svg.uri;
defaultAttrs[xlink.name] = xlink.uri;

/**
 * @param {string} [content]
 * @param {Object} [attributes]
 * @return {string}
 */
var wrapInSvgString = function (content, attributes) {
  if ( content === void 0 ) content = '';

  var attrs = deepmerge(defaultAttrs, attributes || {});
  var attrsRendered = objectToAttrsString(attrs);
  return ("<svg " + attrsRendered + ">" + content + "</svg>");
};

var svg$1 = namespaces_1.svg;
var xlink$1 = namespaces_1.xlink;

var defaultConfig = {
  attrs: ( obj = {
    style: ['position: absolute', 'width: 0', 'height: 0'].join('; ')
  }, obj[svg$1.name] = svg$1.uri, obj[xlink$1.name] = xlink$1.uri, obj )
};
var obj;

var Sprite = function Sprite(config) {
  this.config = deepmerge(defaultConfig, config || {});
  this.symbols = [];
};

/**
 * Add new symbol. If symbol with the same id exists it will be replaced.
 * @param {SpriteSymbol} symbol
 * @return {boolean} `true` - symbol was added, `false` - replaced
 */
Sprite.prototype.add = function add (symbol) {
  var ref = this;
    var symbols = ref.symbols;
  var existing = this.find(symbol.id);

  if (existing) {
    symbols[symbols.indexOf(existing)] = symbol;
    return false;
  }

  symbols.push(symbol);
  return true;
};

/**
 * Remove symbol & destroy it
 * @param {string} id
 * @return {boolean} `true` - symbol was found & successfully destroyed, `false` - otherwise
 */
Sprite.prototype.remove = function remove (id) {
  var ref = this;
    var symbols = ref.symbols;
  var symbol = this.find(id);

  if (symbol) {
    symbols.splice(symbols.indexOf(symbol), 1);
    symbol.destroy();
    return true;
  }

  return false;
};

/**
 * @param {string} id
 * @return {SpriteSymbol|null}
 */
Sprite.prototype.find = function find (id) {
  return this.symbols.filter(function (s) { return s.id === id; })[0] || null;
};

/**
 * @param {string} id
 * @return {boolean}
 */
Sprite.prototype.has = function has (id) {
  return this.find(id) !== null;
};

/**
 * @return {string}
 */
Sprite.prototype.stringify = function stringify () {
  var ref = this.config;
    var attrs = ref.attrs;
  var stringifiedSymbols = this.symbols.map(function (s) { return s.stringify(); }).join('');
  return wrapInSvgString(stringifiedSymbols, attrs);
};

/**
 * @return {string}
 */
Sprite.prototype.toString = function toString () {
  return this.stringify();
};

Sprite.prototype.destroy = function destroy () {
  this.symbols.forEach(function (s) { return s.destroy(); });
};

var SpriteSymbol = function SpriteSymbol(ref) {
  var id = ref.id;
  var viewBox = ref.viewBox;
  var content = ref.content;

  this.id = id;
  this.viewBox = viewBox;
  this.content = content;
};

/**
 * @return {string}
 */
SpriteSymbol.prototype.stringify = function stringify () {
  return this.content;
};

/**
 * @return {string}
 */
SpriteSymbol.prototype.toString = function toString () {
  return this.stringify();
};

SpriteSymbol.prototype.destroy = function destroy () {
    var this$1 = this;

  ['id', 'viewBox', 'content'].forEach(function (prop) { return delete this$1[prop]; });
};

/**
 * @param {string} content
 * @return {Element}
 */
var parse = function (content) {
  var hasImportNode = !!document.importNode;
  var doc = new DOMParser().parseFromString(content, 'image/svg+xml').documentElement;

  /**
   * Fix for browser which are throwing WrongDocumentError
   * if you insert an element which is not part of the document
   * @see http://stackoverflow.com/a/7986519/4624403
   */
  if (hasImportNode) {
    return document.importNode(doc, true);
  }

  return doc;
};

var BrowserSpriteSymbol = (function (SpriteSymbol$$1) {
  function BrowserSpriteSymbol () {
    SpriteSymbol$$1.apply(this, arguments);
  }

  if ( SpriteSymbol$$1 ) BrowserSpriteSymbol.__proto__ = SpriteSymbol$$1;
  BrowserSpriteSymbol.prototype = Object.create( SpriteSymbol$$1 && SpriteSymbol$$1.prototype );
  BrowserSpriteSymbol.prototype.constructor = BrowserSpriteSymbol;

  var prototypeAccessors = { isMounted: {} };

  prototypeAccessors.isMounted.get = function () {
    return !!this.node;
  };

  /**
   * @param {Element} node
   * @return {BrowserSpriteSymbol}
   */
  BrowserSpriteSymbol.createFromExistingNode = function createFromExistingNode (node) {
    return new BrowserSpriteSymbol({
      id: node.getAttribute('id'),
      viewBox: node.getAttribute('viewBox'),
      content: node.outerHTML
    });
  };

  BrowserSpriteSymbol.prototype.destroy = function destroy () {
    if (this.isMounted) {
      this.unmount();
    }
    SpriteSymbol$$1.prototype.destroy.call(this);
  };

  /**
   * @param {Element|string} target
   * @return {Element}
   */
  BrowserSpriteSymbol.prototype.mount = function mount (target) {
    if (this.isMounted) {
      return this.node;
    }

    var mountTarget = typeof target === 'string' ? document.querySelector(target) : target;
    var node = this.render();
    this.node = node;

    mountTarget.appendChild(node);

    return node;
  };

  /**
   * @return {Element}
   */
  BrowserSpriteSymbol.prototype.render = function render () {
    var content = this.stringify();
    return parse(wrapInSvgString(content)).childNodes[0];
  };

  BrowserSpriteSymbol.prototype.unmount = function unmount () {
    this.node.parentNode.removeChild(this.node);
  };

  Object.defineProperties( BrowserSpriteSymbol.prototype, prototypeAccessors );

  return BrowserSpriteSymbol;
}(SpriteSymbol));

var defaultConfig$1 = {
  /**
   * Should following options be automatically configured:
   * - `syncUrlsWithBaseTag`
   * - `locationChangeAngularEmitter`
   * - `moveGradientsOutsideSymbol`
   * @type {boolean}
   */
  autoConfigure: true,

  /**
   * Default mounting selector
   * @type {string}
   */
  mountTo: 'body',

  /**
   * Fix disappearing SVG elements when <base href> exists.
   * Executes when sprite mounted.
   * @see http://stackoverflow.com/a/18265336/796152
   * @see https://github.com/everdimension/angular-svg-base-fix
   * @see https://github.com/angular/angular.js/issues/8934#issuecomment-56568466
   * @type {boolean}
   */
  syncUrlsWithBaseTag: false,

  /**
   * Should sprite listen custom location change event
   * @type {boolean}
   */
  listenLocationChangeEvent: true,

  /**
   * Custom window event name which should be emitted to update sprite urls
   * @type {string}
   */
  locationChangeEvent: 'locationChange',

  /**
   * Emit location change event in Angular automatically
   * @type {boolean}
   */
  locationChangeAngularEmitter: false,

  /**
   * Selector to find symbols usages when updating sprite urls
   * @type {string}
   */
  usagesToUpdate: 'use[*|href]',

  /**
   * Fix Firefox bug when gradients and patterns don't work if they are within a symbol.
   * Executes when sprite is rendered, but not mounted.
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=306674
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=353575
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=1235364
   * @type {boolean}
   */
  moveGradientsOutsideSymbol: false
};

/**
 * @param {*} arrayLike
 * @return {Array}
 */
var arrayFrom = function (arrayLike) {
  return Array.prototype.slice.call(arrayLike, 0);
};

var browser = {
  isChrome: function () { return /chrome/i.test(navigator.userAgent); },
  isFirefox: function () { return /firefox/i.test(navigator.userAgent); },

  // https://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx
  isIE: function () { return /msie/i.test(navigator.userAgent) || /trident/i.test(navigator.userAgent); },
  isEdge: function () { return /edge/i.test(navigator.userAgent); }
};

/**
 * @param {string} name
 * @param {*} data
 */
var dispatchEvent = function (name, data) {
  var event = document.createEvent('CustomEvent');
  event.initCustomEvent(name, false, false, data);
  window.dispatchEvent(event);
};

/**
 * IE doesn't evaluate <style> tags in SVGs that are dynamically added to the page.
 * This trick will trigger IE to read and use any existing SVG <style> tags.
 * @see https://github.com/iconic/SVGInjector/issues/23
 * @see https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10898469/
 *
 * @param {Element} node DOM Element to search <style> tags in
 * @return {Array<HTMLStyleElement>}
 */
var evalStylesIEWorkaround = function (node) {
  var updatedNodes = [];

  arrayFrom(node.querySelectorAll('style'))
    .forEach(function (style) {
      style.textContent += '';
      updatedNodes.push(style);
    });

  return updatedNodes;
};

/**
 * @param {string} [url] If not provided - current URL will be used
 * @return {string}
 */
var getUrlWithoutFragment = function (url) {
  return (url || window.location.href).split('#')[0];
};

/* global angular */
/**
 * @param {string} eventName
 */
var locationChangeAngularEmitter = function (eventName) {
  angular.module('ng').run(['$rootScope', function ($rootScope) {
    $rootScope.$on('$locationChangeSuccess', function (e, newUrl, oldUrl) {
      dispatchEvent(eventName, { oldUrl: oldUrl, newUrl: newUrl });
    });
  }]);
};

var defaultSelector = 'linearGradient, radialGradient, pattern';

/**
 * @param {Element} svg
 * @param {string} [selector]
 * @return {Element}
 */
var moveGradientsOutsideSymbol = function (svg, selector) {
  if ( selector === void 0 ) selector = defaultSelector;

  arrayFrom(svg.querySelectorAll('symbol')).forEach(function (symbol) {
    arrayFrom(symbol.querySelectorAll(selector)).forEach(function (node) {
      symbol.parentNode.insertBefore(node, symbol);
    });
  });
  return svg;
};

/**
 * @param {NodeList} nodes
 * @param {Function} [matcher]
 * @return {Attr[]}
 */
function selectAttributes(nodes, matcher) {
  var attrs = arrayFrom(nodes).reduce(function (acc, node) {
    if (!node.attributes) {
      return acc;
    }

    var arrayfied = arrayFrom(node.attributes);
    var matched = matcher ? arrayfied.filter(matcher) : arrayfied;
    return acc.concat(matched);
  }, []);

  return attrs;
}

/**
 * @param {NodeList|Node} nodes
 * @param {boolean} [clone=true]
 * @return {string}
 */

var xLinkNS = namespaces_1.xlink.uri;
var xLinkAttrName = 'xlink:href';

// eslint-disable-next-line no-useless-escape
var specialUrlCharsPattern = /[{}|\\\^\[\]`"<>]/g;

function encoder(url) {
  return url.replace(specialUrlCharsPattern, function (match) {
    return ("%" + (match[0].charCodeAt(0).toString(16).toUpperCase()));
  });
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

/**
 * @param {NodeList} nodes
 * @param {string} startsWith
 * @param {string} replaceWith
 * @return {NodeList}
 */
function updateReferences(nodes, startsWith, replaceWith) {
  arrayFrom(nodes).forEach(function (node) {
    var href = node.getAttribute(xLinkAttrName);
    if (href && href.indexOf(startsWith) === 0) {
      var newUrl = href.replace(startsWith, replaceWith);
      node.setAttributeNS(xLinkNS, xLinkAttrName, newUrl);
    }
  });

  return nodes;
}

/**
 * List of SVG attributes to update url() target in them
 */
var attList = [
  'clipPath',
  'colorProfile',
  'src',
  'cursor',
  'fill',
  'filter',
  'marker',
  'markerStart',
  'markerMid',
  'markerEnd',
  'mask',
  'stroke',
  'style'
];

var attSelector = attList.map(function (attr) { return ("[" + attr + "]"); }).join(',');

/**
 * Update URLs in svg image (like `fill="url(...)"`) and update referencing elements
 * @param {Element} svg
 * @param {NodeList} references
 * @param {string|RegExp} startsWith
 * @param {string} replaceWith
 * @return {void}
 *
 * @example
 * const sprite = document.querySelector('svg.sprite');
 * const usages = document.querySelectorAll('use');
 * updateUrls(sprite, usages, '#', 'prefix#');
 */
var updateUrls = function (svg, references, startsWith, replaceWith) {
  var startsWithEncoded = encoder(startsWith);
  var replaceWithEncoded = encoder(replaceWith);

  var nodes = svg.querySelectorAll(attSelector);
  var attrs = selectAttributes(nodes, function (ref) {
    var localName = ref.localName;
    var value = ref.value;

    return attList.indexOf(localName) !== -1 && value.indexOf(("url(" + startsWithEncoded)) !== -1;
  });

  attrs.forEach(function (attr) { return attr.value = attr.value.replace(new RegExp(escapeRegExp(startsWithEncoded), 'g'), replaceWithEncoded); });
  updateReferences(references, startsWithEncoded, replaceWithEncoded);
};

/**
 * Internal emitter events
 * @enum
 * @private
 */
var Events = {
  MOUNT: 'mount',
  SYMBOL_MOUNT: 'symbol_mount'
};

var BrowserSprite = (function (Sprite$$1) {
  function BrowserSprite(cfg) {
    var this$1 = this;
    if ( cfg === void 0 ) cfg = {};

    Sprite$$1.call(this, deepmerge(defaultConfig$1, cfg));

    var emitter = mitt();
    this._emitter = emitter;
    this.node = null;

    var ref = this;
    var config = ref.config;

    if (config.autoConfigure) {
      this._autoConfigure(cfg);
    }

    if (config.syncUrlsWithBaseTag) {
      var baseUrl = document.getElementsByTagName('base')[0].getAttribute('href');
      emitter.on(Events.MOUNT, function () { return this$1.updateUrls('#', baseUrl); });
    }

    var handleLocationChange = this._handleLocationChange.bind(this);
    this._handleLocationChange = handleLocationChange;

    // Provide way to update sprite urls externally via dispatching custom window event
    if (config.listenLocationChangeEvent) {
      window.addEventListener(config.locationChangeEvent, handleLocationChange);
    }

    // Emit location change event in Angular automatically
    if (config.locationChangeAngularEmitter) {
      locationChangeAngularEmitter(config.locationChangeEvent);
    }

    // After sprite mounted
    emitter.on(Events.MOUNT, function (spriteNode) {
      if (config.moveGradientsOutsideSymbol) {
        moveGradientsOutsideSymbol(spriteNode);
      }
    });

    // After symbol mounted into sprite
    emitter.on(Events.SYMBOL_MOUNT, function (symbolNode) {
      if (config.moveGradientsOutsideSymbol) {
        moveGradientsOutsideSymbol(symbolNode.parentNode);
      }

      if (browser.isIE() || browser.isEdge()) {
        evalStylesIEWorkaround(symbolNode);
      }
    });
  }

  if ( Sprite$$1 ) BrowserSprite.__proto__ = Sprite$$1;
  BrowserSprite.prototype = Object.create( Sprite$$1 && Sprite$$1.prototype );
  BrowserSprite.prototype.constructor = BrowserSprite;

  var prototypeAccessors = { isMounted: {} };

  /**
   * @return {boolean}
   */
  prototypeAccessors.isMounted.get = function () {
    return !!this.node;
  };

  /**
   * Automatically configure following options
   * - `syncUrlsWithBaseTag`
   * - `locationChangeAngularEmitter`
   * - `moveGradientsOutsideSymbol`
   * @param {Object} cfg
   * @private
   */
  BrowserSprite.prototype._autoConfigure = function _autoConfigure (cfg) {
    var ref = this;
    var config = ref.config;

    if (typeof cfg.syncUrlsWithBaseTag === 'undefined') {
      config.syncUrlsWithBaseTag = typeof document.getElementsByTagName('base')[0] !== 'undefined';
    }

    if (typeof cfg.locationChangeAngularEmitter === 'undefined') {
      config.locationChangeAngularEmitter = 'angular' in window;
    }

    if (typeof cfg.moveGradientsOutsideSymbol === 'undefined') {
      config.moveGradientsOutsideSymbol = browser.isFirefox();
    }
  };

  /**
   * @param {Event} event
   * @param {Object} event.detail
   * @param {string} event.detail.oldUrl
   * @param {string} event.detail.newUrl
   * @private
   */
  BrowserSprite.prototype._handleLocationChange = function _handleLocationChange (event) {
    var ref = event.detail;
    var oldUrl = ref.oldUrl;
    var newUrl = ref.newUrl;
    this.updateUrls(oldUrl, newUrl);
  };

  /**
   * Add new symbol. If symbol with the same id exists it will be replaced.
   * If sprite already mounted - `symbol.mount(sprite.node)` will be called.
   * @fires Events#SYMBOL_MOUNT
   * @param {BrowserSpriteSymbol} symbol
   * @return {boolean} `true` - symbol was added, `false` - replaced
   */
  BrowserSprite.prototype.add = function add (symbol) {
    var sprite = this;
    var isNewSymbol = Sprite$$1.prototype.add.call(this, symbol);

    if (this.isMounted && isNewSymbol) {
      symbol.mount(sprite.node);
      this._emitter.emit(Events.SYMBOL_MOUNT, symbol.node);
    }

    return isNewSymbol;
  };

  /**
   * Attach to existing DOM node
   * @param {string|Element} target
   * @return {Element|null} attached DOM Element. null if node to attach not found.
   */
  BrowserSprite.prototype.attach = function attach (target) {
    var this$1 = this;

    var sprite = this;

    if (sprite.isMounted) {
      return sprite.node;
    }

    /** @type Element */
    var node = typeof target === 'string' ? document.querySelector(target) : target;
    sprite.node = node;

    // Already added symbols needs to be mounted
    this.symbols.forEach(function (symbol) {
      symbol.mount(sprite.node);
      this$1._emitter.emit(Events.SYMBOL_MOUNT, symbol.node);
    });

    // Create symbols from existing DOM nodes, add and mount them
    arrayFrom(node.querySelectorAll('symbol'))
      .forEach(function (symbolNode) {
        var symbol = BrowserSpriteSymbol.createFromExistingNode(symbolNode);
        symbol.node = symbolNode; // hack to prevent symbol mounting to sprite when adding
        sprite.add(symbol);
      });

    this._emitter.emit(Events.MOUNT, node);

    return node;
  };

  BrowserSprite.prototype.destroy = function destroy () {
    var ref = this;
    var config = ref.config;
    var symbols = ref.symbols;
    var _emitter = ref._emitter;

    symbols.forEach(function (s) { return s.destroy(); });

    _emitter.off('*');
    window.removeEventListener(config.locationChangeEvent, this._handleLocationChange);

    if (this.isMounted) {
      this.unmount();
    }
  };

  /**
   * @fires Events#MOUNT
   * @param {string|Element} [target]
   * @param {boolean} [prepend=false]
   * @return {Element|null} rendered sprite node. null if mount node not found.
   */
  BrowserSprite.prototype.mount = function mount (target, prepend) {
    if ( target === void 0 ) target = this.config.mountTo;
    if ( prepend === void 0 ) prepend = false;

    var sprite = this;

    if (sprite.isMounted) {
      return sprite.node;
    }

    var mountNode = typeof target === 'string' ? document.querySelector(target) : target;
    var node = sprite.render();
    this.node = node;

    if (prepend && mountNode.childNodes[0]) {
      mountNode.insertBefore(node, mountNode.childNodes[0]);
    } else {
      mountNode.appendChild(node);
    }

    this._emitter.emit(Events.MOUNT, node);

    return node;
  };

  /**
   * @return {Element}
   */
  BrowserSprite.prototype.render = function render () {
    return parse(this.stringify());
  };

  /**
   * Detach sprite from the DOM
   */
  BrowserSprite.prototype.unmount = function unmount () {
    this.node.parentNode.removeChild(this.node);
  };

  /**
   * Update URLs in sprite and usage elements
   * @param {string} oldUrl
   * @param {string} newUrl
   * @return {boolean} `true` - URLs was updated, `false` - sprite is not mounted
   */
  BrowserSprite.prototype.updateUrls = function updateUrls$1 (oldUrl, newUrl) {
    if (!this.isMounted) {
      return false;
    }

    var usages = document.querySelectorAll(this.config.usagesToUpdate);

    updateUrls(
      this.node,
      usages,
      ((getUrlWithoutFragment(oldUrl)) + "#"),
      ((getUrlWithoutFragment(newUrl)) + "#")
    );

    return true;
  };

  Object.defineProperties( BrowserSprite.prototype, prototypeAccessors );

  return BrowserSprite;
}(Sprite));

var ready$1 = createCommonjsModule(function (module) {
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  { module.exports = definition(); }

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState);


  if (!loaded)
  { doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener);
    loaded = 1;
    while (listener = fns.shift()) { listener(); }
  }); }

  return function (fn) {
    loaded ? setTimeout(fn, 0) : fns.push(fn);
  }

});
});

var spriteNodeId = '__SVG_SPRITE_NODE__';
var spriteGlobalVarName = '__SVG_SPRITE__';
var isSpriteExists = !!window[spriteGlobalVarName];

// eslint-disable-next-line import/no-mutable-exports
var sprite;

if (isSpriteExists) {
  sprite = window[spriteGlobalVarName];
} else {
  sprite = new BrowserSprite({ attrs: { id: spriteNodeId } });
  window[spriteGlobalVarName] = sprite;
}

var loadSprite = function () {
  /**
   * Check for page already contains sprite node
   * If found - attach to and reuse it's content
   * If not - render and mount the new sprite
   */
  var existing = document.getElementById(spriteNodeId);

  if (existing) {
    sprite.attach(existing);
  } else {
    sprite.mount(document.body, true);
  }
};

if (document.body) {
  loadSprite();
} else {
  ready$1(loadSprite);
}

var sprite$1 = sprite;

return sprite$1;

})));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__("./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/icons/icons.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/svg-baker-runtime/browser-symbol.js
var browser_symbol = __webpack_require__("./node_modules/svg-baker-runtime/browser-symbol.js");
var browser_symbol_default = /*#__PURE__*/__webpack_require__.n(browser_symbol);

// EXTERNAL MODULE: ./node_modules/svg-sprite-loader/runtime/browser-sprite.build.js
var browser_sprite_build = __webpack_require__("./node_modules/svg-sprite-loader/runtime/browser-sprite.build.js");
var browser_sprite_build_default = /*#__PURE__*/__webpack_require__.n(browser_sprite_build);

// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-adult.svg


var symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-adult",
  "use": "svg-cat-accessories-adult-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-adult\">\n<path class=\"p-FF9100\" d=\"M25.8857 23.3142L24.292 21.7205L22.405 23.6074L23.9988 25.2012L25.8857 23.3142Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFDA2D\" d=\"M24.9938 0L20.79 4.20381L27.7963 11.2101L32.0002 7.00631L24.9938 0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FDBF00\" d=\"M28.7246 13.1124L26.0481 13.2385L19.5043 6.69462L18.8877 3.27555C19.4202 2.74308 19.4482 2.74308 19.4482 2.74308L21.7043 0.487061L31.5131 10.2959L29.2571 12.5519C29.2571 12.5519 29.229 12.608 28.7246 13.1124Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FDBF00\" d=\"M28.4967 3.50329L24.293 7.70703L27.7961 11.2102L31.9998 7.00641L28.4967 3.50329Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M26.0476 13.2384L22.4043 9.59517L26.6081 5.39136L31.5125 10.2958L29.2565 12.5518C29.2565 12.5518 29.2284 12.6079 28.724 13.1123L26.0476 13.2384Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFDA2D\" d=\"M4.40198 20.5916L0 24.9935L7.00631 31.9998L11.4083 27.5979L4.40198 20.5916Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FDBF00\" d=\"M13.3099 28.5264C12.8055 29.0308 12.7494 29.0589 12.7494 29.0589L10.4934 31.3149L0.68457 21.506L2.94059 19.25C2.94059 19.25 2.96866 19.1939 3.47306 18.6895L6.93421 19.3481L13.5341 25.948L13.3099 28.5264Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FDBF00\" d=\"M3.50274 28.4969L7.00586 32L11.4078 27.5981L7.90467 24.0949L3.50274 28.4969Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M13.534 25.9479L13.3098 28.5263C12.8054 29.0307 12.7493 29.0587 12.7493 29.0587L10.4933 31.3147L5.58887 26.4103L9.79268 22.2065L13.534 25.9479Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFDA2D\" d=\"M26.8187 17.6807C27.0709 16.1673 27.5613 14.8641 28.2761 13.7852L28.7244 13.1126L18.8875 3.27563L18.2149 3.72396C17.136 4.43868 15.8327 4.92909 14.3474 5.18135C12.0633 5.53165 10.0035 6.5826 8.39204 8.19411C6.78067 9.80548 5.72958 11.8654 5.37929 14.1214C5.12708 15.6348 4.63675 16.938 3.92202 18.0169L3.47363 18.6895L13.3104 28.5264L13.9831 28.0781C15.062 27.3633 16.3651 26.873 17.8505 26.6208C20.1346 26.2705 22.1945 25.2194 23.8058 23.608C25.4174 21.9965 26.4684 19.9367 26.8187 17.6807Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FDBF00\" d=\"M23.8055 23.6078C22.1941 25.2192 20.1342 26.2702 17.8501 26.6205C16.3648 26.8727 15.0616 27.3631 13.9827 28.0778L13.3101 28.5262L8.3916 23.6077L23.8055 8.19385L28.7239 13.1123L28.2756 13.7849C27.5609 14.8638 27.0705 16.1671 26.8182 17.6804C26.4679 19.9365 25.417 21.9963 23.8055 23.6078Z\" fill=\"#A1D1FD\" />\n<path class=\"p-68544F\" d=\"M21.0031 10.9963C18.2987 8.29192 13.8987 8.29192 11.1943 10.9963C8.48991 13.7007 8.48991 18.1007 11.1943 20.8051C13.8987 23.5095 18.2987 23.5095 21.0031 20.8051C23.7075 18.1007 23.7075 13.7008 21.0031 10.9963Z\" fill=\"#58ADE5\" />\n<path class=\"p-53433F\" d=\"M11.1943 20.8054L21.0031 10.9966C23.7075 13.701 23.7075 18.101 21.0031 20.8054C18.2987 23.5098 13.8988 23.5098 11.1943 20.8054Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDBF00\" d=\"M17.9878 18.2165L17.5008 18.7035L14.6982 15.9009L17.5008 13.0984L18.902 14.4996L16.5865 16.8152L17.9878 18.2165Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FDBF00\" d=\"M18.4146 19.6178L15.3984 16.6016L18.2009 13.7991L18.9016 14.4997L16.5861 16.8152L18.9016 19.1308L18.4146 19.6178Z\" fill=\"#AFD9F6\" />\n</symbol>"
});
var result = browser_sprite_build_default.a.add(symbol);
/* harmony default export */ var svg_cat_accessories_adult = (symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-bags.svg


var svg_cat_accessories_bags_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-bags",
  "use": "svg-cat-accessories-bags-usage",
  "viewBox": "0 0 31 28",
  "content": "<symbol viewBox=\"0 0 31 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-bags\">\n<path class=\"p-53433F\" d=\"M21.684 0V6.30683H19.882V1.80195H10.8723V6.30683H9.07031V0H21.684Z\" fill=\"#B9DFFC\" />\n<path class=\"p-3E322E\" d=\"M27.0891 2.77271H25.2871V6.37661H27.0891V2.77271Z\" fill=\"#A1D1FD\" />\n<path class=\"p-3E322E\" d=\"M21.6828 0V6.30683H19.8809V1.80195H15.376V0H21.6828Z\" fill=\"#A1D1FD\" />\n<path class=\"p-53433F\" d=\"M30.7533 11.5662V28H0V11.5662L13.3224 13.5482H17.4309L30.7533 11.5662Z\" fill=\"#58ADE5\" />\n<path class=\"p-3E322E\" d=\"M30.7526 11.5662V28H15.376V13.5482H17.4302L30.7526 11.5662Z\" fill=\"#4D98CB\" />\n<path class=\"p-68544F\" d=\"M30.7533 4.57471V11.5663L17.4309 17.0127H13.3224L0 11.5663V4.57471H30.7533Z\" fill=\"#5FBEFF\" />\n<path class=\"p-53433F\" d=\"M30.7526 4.57471V11.5663L17.4302 17.0127H15.376V4.57471H30.7526Z\" fill=\"#76B7E2\" />\n<path class=\"p-FDBF00\" d=\"M12.6738 15.2468V20.7923H18.0797V15.2468H12.6738Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FF9F00\" d=\"M18.0789 15.2468H15.376V20.7923H18.0789V15.2468Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_accessories_bags_result = browser_sprite_build_default.a.add(svg_cat_accessories_bags_symbol);
/* harmony default export */ var svg_cat_accessories_bags = (svg_cat_accessories_bags_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-bags2.svg


var svg_cat_accessories_bags2_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-bags2",
  "use": "svg-cat-accessories-bags2-usage",
  "viewBox": "0 0 32 28",
  "content": "<symbol viewBox=\"0 0 32 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-bags2\">\n<path class=\"p-8C493B\" d=\"M21.4556 5.61289H19.2623V3.76686C19.2623 2.89922 18.5564 2.19325 17.6887 2.19325H13.7473C12.8796 2.19325 12.1737 2.89922 12.1737 3.76686V5.61296H9.98047V3.76686C9.98047 1.68977 11.6702 0 13.7473 0H17.6887C19.7658 0 21.4556 1.68977 21.4556 3.76686V5.61289Z\" fill=\"#AFD9F6\" />\n<path class=\"p-774135\" d=\"M17.6895 0H15.7188V2.19325H17.6895C18.5572 2.19325 19.2631 2.89922 19.2631 3.76686V5.61296H21.4563V3.76686C21.4563 1.68971 19.7664 0 17.6895 0Z\" fill=\"#65B3E7\" />\n<path class=\"p-F6C958\" d=\"M28.4692 27.9766H2.96731C1.32856 27.9766 0 26.648 0 25.0092V8.36233C0 6.72352 1.32856 5.39502 2.96731 5.39502H28.4692C30.108 5.39502 31.4365 6.72358 31.4365 8.36233V25.0092C31.4365 26.648 30.108 27.9766 28.4692 27.9766Z\" fill=\"#58ADE5\" />\n<path class=\"p-E5BC53\" d=\"M28.2627 5.39502H15.7188V27.9765H28.2627C30.0158 27.9765 31.437 26.5553 31.437 24.8022V8.56937C31.437 6.81623 30.0158 5.39502 28.2627 5.39502Z\" fill=\"#4D98CB\" />\n<path class=\"p-F5F6F6\" d=\"M8.6169 5.39502H6.42383V27.9999H8.6169V5.39502Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E5E5E5\" d=\"M25.0124 5.39502H22.8193V27.9767H25.0124V5.39502Z\" fill=\"#A1D1FD\" />\n<path class=\"p-95E9D2\" d=\"M4.26517 16.5446L14.5439 13.7024L12.9693 8.00775L2.69055 10.8499L4.26517 16.5446Z\" fill=\"#A1D1FD\" />\n<path class=\"p-D85397\" d=\"M19.0427 23.6383L26.5918 24.8203L27.4195 19.534L19.8705 18.352L19.0427 23.6383Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_accessories_bags2_result = browser_sprite_build_default.a.add(svg_cat_accessories_bags2_symbol);
/* harmony default export */ var svg_cat_accessories_bags2 = (svg_cat_accessories_bags2_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-belt.svg


var svg_cat_accessories_belt_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-belt",
  "use": "svg-cat-accessories-belt-usage",
  "viewBox": "0 0 35 20",
  "content": "<symbol viewBox=\"0 0 35 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-belt\">\n<path class=\"p-FFB64C\" d=\"M0 0H24.4444V20H0V0Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF914A\" d=\"M0 10H24.4444V20H0V10Z\" fill=\"#4D98CB\" />\n<path class=\"p-AF5D5B\" d=\"M6.66699 4.44434V15.5554H34.5569V4.44434H6.66699Z\" fill=\"#A1D1FD\" />\n<path class=\"p-974C4E\" d=\"M6.66699 10H34.5569V15.5556H6.66699V10Z\" fill=\"#76B7E2\" />\n<path class=\"p-974C4E\" d=\"M21.793 9.99869L23.3708 8.42114L24.9486 9.99869L23.3708 11.5765L21.793 9.99869Z\" fill=\"#76B7E2\" />\n<path class=\"p-783541\" d=\"M21.7939 10H24.9496L23.3718 11.5778L21.7939 10Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFD396\" d=\"M3.60156 8.88892H14.7127V11.1111H3.60156V8.88892Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFB64C\" d=\"M3.60156 10H14.7127V11.1111H3.60156V10Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_accessories_belt_result = browser_sprite_build_default.a.add(svg_cat_accessories_belt_symbol);
/* harmony default export */ var svg_cat_accessories_belt = (svg_cat_accessories_belt_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-bijouterie.svg


var svg_cat_accessories_bijouterie_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-bijouterie",
  "use": "svg-cat-accessories-bijouterie-usage",
  "viewBox": "0 0 29 30",
  "content": "<symbol viewBox=\"0 0 29 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-bijouterie\">\n<path class=\"p-FF637B\" d=\"M13.4172 29.9998H9.79188L9.08788 28.9087L8.03202 29.9998H6.27216L5.35697 28.6447L4.51229 29.9999H0L2.75243 14.1025C2.75243 14.1025 4.12518 13.1286 5.39222 12.2839H9.36952L11.5517 14.1025L13.4172 29.9998Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF637B\" d=\"M27.4961 29.9998H23.8707L23.1667 28.9087L22.1109 29.9998H20.351L19.4358 28.6447L18.5911 29.9999H14.9658L16.8313 14.1025C16.8313 14.1025 18.204 13.1286 19.4711 12.2839H23.4484L25.6306 14.1025L27.4961 29.9998Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E63950\" d=\"M13.4175 29.9999H9.79214L9.08814 28.9088L8.03228 29.9999H7.15234V12.2839H9.36977L11.552 14.1025L13.4175 29.9999Z\" fill=\"#65B3E7\" />\n<path class=\"p-E63950\" d=\"M28.3835 29.9999H23.8712L23.1672 28.9088L22.1114 29.9999H21.2314V12.2839H23.4489L25.6311 14.1025L28.3835 29.9999Z\" fill=\"#65B3E7\" />\n<path class=\"p-F2F2F2\" d=\"M10.2676 7.47942C9.44041 8.30662 8.3317 8.76418 7.15259 8.76418V7.00432C7.85659 7.00432 8.52534 6.72268 9.01805 6.22998C10.0564 5.2092 10.0564 3.51973 9.01805 2.49907C8.52534 2.00625 7.839 1.74232 7.15259 1.74232C6.46618 1.74232 5.77984 2.00625 5.28713 2.49907C5.00274 2.78339 4.78871 3.12635 4.65854 3.50087C4.499 3.95991 4.11883 4.36452 3.63286 4.36452C3.14689 4.36452 2.74378 3.96679 2.83863 3.49017C3.00691 2.64464 3.41885 1.86832 4.03757 1.2495C4.86483 0.422485 6.00868 0 7.15265 0C8.29662 0 9.44047 0.422485 10.2677 1.24956C11.9746 2.97417 11.9923 5.75481 10.2676 7.47942Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M10.2674 7.47942C9.44017 8.30662 8.33145 8.76418 7.15234 8.76418V7.00432C7.85635 7.00432 8.5251 6.72268 9.0178 6.22998C10.0562 5.2092 10.0562 3.51973 9.0178 2.49907C8.5251 2.00625 7.83875 1.74232 7.15234 1.74232V0C8.29631 0 9.44017 0.422485 10.2674 1.24956C11.9744 2.97417 11.992 5.75481 10.2674 7.47942Z\" fill=\"#76B7E2\" />\n<path class=\"p-F2F2F2\" d=\"M24.3467 7.47942C23.5195 8.30662 22.4108 8.76418 21.2317 8.76418V7.00432C21.9357 7.00432 22.6044 6.72268 23.0971 6.22998C24.1355 5.2092 24.1355 3.51973 23.0971 2.49907C22.6044 2.00625 21.9181 1.74232 21.2317 1.74232C20.5453 1.74232 19.8589 2.00625 19.3662 2.49907C19.0818 2.78339 18.8678 3.12635 18.7376 3.50087C18.5781 3.95991 18.1979 4.36452 17.712 4.36452C17.226 4.36452 16.8229 3.96679 16.9177 3.49017C17.086 2.64464 17.4979 1.86832 18.1167 1.2495C18.9439 0.422485 20.0878 0 21.2317 0C22.3757 0 23.5196 0.422485 24.3468 1.24956C26.0537 2.97417 26.0714 5.75481 24.3467 7.47942Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M24.3465 7.47942C23.5193 8.30662 22.4106 8.76418 21.2314 8.76418V7.00432C21.9354 7.00432 22.6042 6.72268 23.0969 6.22998C24.1353 5.2092 24.1353 3.51973 23.0969 2.49907C22.6042 2.00625 21.9179 1.74232 21.2314 1.74232V0C22.3754 0 23.5193 0.422485 24.3465 1.24956C26.0535 2.97417 26.0711 5.75481 24.3465 7.47942Z\" fill=\"#76B7E2\" />\n<path class=\"p-FBC56D\" d=\"M10.2676 8.30669C9.44041 7.46202 8.3493 7.00439 7.15259 7.00439C4.72398 7.00439 2.75293 8.97544 2.75293 11.4041V14.1025H11.5522V11.4041C11.5523 10.2073 11.0947 9.11629 10.2676 8.30669Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EBAE56\" d=\"M11.552 11.4041V14.1025H7.15234V7.00439C8.34905 7.00439 9.44017 7.46196 10.2674 8.30669C11.0944 9.11629 11.552 10.2073 11.552 11.4041Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FBC56D\" d=\"M24.3467 8.30669C23.5195 7.46202 22.4284 7.00439 21.2317 7.00439C18.8031 7.00439 16.832 8.97544 16.832 11.4041V14.1025H25.6314V11.4041C25.6314 10.2073 25.1738 9.11629 24.3467 8.30669Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EBAE56\" d=\"M25.6311 11.4041V14.1025H21.2314V7.00439C22.4282 7.00439 23.5193 7.46196 24.3465 8.30669C25.1735 9.11629 25.6311 10.2073 25.6311 11.4041Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E63950\" d=\"M6.27158 29.9998V22.0218C6.27158 21.5358 5.87762 21.1418 5.39165 21.1418C4.90568 21.1418 4.51172 21.5358 4.51172 22.0218V29.9998H6.27158Z\" fill=\"#58ADE5\" />\n<path class=\"p-AE2538\" d=\"M9.79209 29.9998V22.0218C9.79209 21.5358 9.39813 21.1418 8.91216 21.1418C8.42619 21.1418 8.03223 21.5358 8.03223 22.0218V29.9998H9.79209Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M20.3507 29.9998V22.0218C20.3507 21.5358 19.9567 21.1418 19.4708 21.1418C18.9848 21.1418 18.5908 21.5358 18.5908 22.0218V29.9998H20.3507Z\" fill=\"#58ADE5\" />\n<path class=\"p-AE2538\" d=\"M23.8712 29.9998V22.0218C23.8712 21.5358 23.4772 21.1418 22.9913 21.1418C22.5053 21.1418 22.1113 21.5358 22.1113 22.0218V29.9998H23.8712Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_accessories_bijouterie_result = browser_sprite_build_default.a.add(svg_cat_accessories_bijouterie_symbol);
/* harmony default export */ var svg_cat_accessories_bijouterie = (svg_cat_accessories_bijouterie_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-child.svg


var svg_cat_accessories_child_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-child",
  "use": "svg-cat-accessories-child-usage",
  "viewBox": "0 0 34 32",
  "content": "<symbol viewBox=\"0 0 34 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-child\">\n<path class=\"p-AF2768\" d=\"M24.435 13.7487L28.6676 32.0001L22.4238 25.9663L18.8815 31.3097L16.6602 12.4279L18.8815 7.98511L24.435 13.7487Z\" fill=\"#58ADE5\" />\n<path class=\"p-EA348B\" d=\"M8.88596 13.7487L4.65332 31.0995L10.8972 25.9663L14.4394 31.3097L16.6608 12.4279L14.4394 7.98511L8.88596 13.7487Z\" fill=\"#A1D1FD\" />\n<path class=\"p-AF2768\" d=\"M2.43152 0C2.43152 0 0 3.33208 0 8.88554C0 14.439 2.43152 17.7711 2.43152 17.7711C10.2064 17.7711 16.6604 8.88554 16.6604 8.88554C16.6604 8.88554 10.2064 0 2.43152 0Z\" fill=\"#58ADE5\" />\n<path class=\"p-EA348B\" d=\"M30.889 0C23.1142 0 16.6602 8.88554 16.6602 8.88554C16.6602 8.88554 23.1142 17.7711 30.889 17.7711C30.889 17.7711 33.3206 14.439 33.3206 8.88554C33.3206 3.33208 30.889 0 30.889 0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-751A46\" d=\"M16.6605 13.3287C19.1142 13.3287 21.1033 11.3396 21.1033 8.88589C21.1033 6.43221 19.1142 4.44312 16.6605 4.44312C14.2069 4.44312 12.2178 6.43221 12.2178 8.88589C12.2178 11.3396 14.2069 13.3287 16.6605 13.3287Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_accessories_child_result = browser_sprite_build_default.a.add(svg_cat_accessories_child_symbol);
/* harmony default export */ var svg_cat_accessories_child = (svg_cat_accessories_child_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-glasses.svg


var svg_cat_accessories_glasses_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-glasses",
  "use": "svg-cat-accessories-glasses-usage",
  "viewBox": "0 0 33 26",
  "content": "<symbol viewBox=\"0 0 33 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-glasses\">\n<path class=\"p-FDBF00\" d=\"M18.6641 20.4599L17.9441 22.3399C17.3841 22.12 16.7641 22 16.1441 22C15.5241 22 14.9041 22.12 14.344 22.3399L13.624 20.4599C14.4241 20.1599 15.2841 20 16.1441 20C17.0041 20 17.8641 20.1599 18.6641 20.4599Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDBF00\" d=\"M20.8442 16H11.4443V18H20.8442V16Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDBF00\" d=\"M3.06665 16H0.999996C0.447713 16 0 16.4477 0 17C0 17.5523 0.447715 18 0.999997 18H3.06665V16Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M31.2883 16H29.2217V18H31.2883C31.8406 18 32.2883 17.5523 32.2883 17C32.2883 16.4477 31.8406 16 31.2883 16Z\" fill=\"#65B3E7\" />\n<path class=\"p-FDBF00\" d=\"M3.34961 16.2997L1.41016 15.8153L5.36327 0H12.1445C12.6968 0 13.1445 0.447713 13.1445 0.999996C13.1445 1.55228 12.6968 1.99999 12.1445 1.99999H6.9258L3.34961 16.2997Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M28.9394 16.2997L25.3632 1.99999H20.1445C19.5922 1.99999 19.1445 1.55228 19.1445 0.999996C19.1445 0.447713 19.5922 0 20.1445 0H26.9258L30.8789 15.8153L28.9394 16.2997Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF9100\" d=\"M16.1445 20C17.0045 20 17.8645 20.1599 18.6645 20.4599L17.9445 22.3399C17.3845 22.12 16.7645 22 16.1445 22V20Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF9100\" d=\"M20.8444 16H16.1445V18H20.8444V16Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF9100\" d=\"M24.1445 25.9999H20.1445C18.4903 25.9999 17.1445 24.6542 17.1445 23C17.1445 18.0371 21.1816 14 26.1445 14H28.1445C29.7987 14 31.1445 15.3457 31.1445 17V19C31.1445 22.8594 28.0039 25.9999 24.1445 25.9999Z\" fill=\"#65B3E7\" />\n<path class=\"p-3E322E\" d=\"M20.1445 24C19.5928 24 19.1445 23.5517 19.1445 23C19.1445 19.1406 22.2851 16 26.1445 16H28.1445C28.6962 16 29.1445 16.4483 29.1445 17V19C29.1445 21.7568 26.9014 24 24.1445 24H20.1445Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDBF00\" d=\"M12.1445 25.9999H8.1445C4.28512 25.9999 1.14453 22.8594 1.14453 19V17C1.14453 15.3457 2.49026 14 4.14452 14H6.14451C11.1074 14 15.1445 18.0371 15.1445 23C15.1445 24.6542 13.7987 25.9999 12.1445 25.9999Z\" fill=\"#A1D1FD\" />\n<path class=\"p-53433F\" d=\"M8.14451 24C5.38766 24 3.14453 21.7568 3.14453 19V17C3.14453 16.4483 3.5928 16 4.14453 16H6.14452C10.0039 16 13.1445 19.1406 13.1445 23C13.1445 23.5517 12.6962 24 12.1445 24H8.14451Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_accessories_glasses_result = browser_sprite_build_default.a.add(svg_cat_accessories_glasses_symbol);
/* harmony default export */ var svg_cat_accessories_glasses = (svg_cat_accessories_glasses_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-jewelry.svg


var svg_cat_accessories_jewelry_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-jewelry",
  "use": "svg-cat-accessories-jewelry-usage",
  "viewBox": "0 0 34 26",
  "content": "<symbol viewBox=\"0 0 34 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-jewelry\">\n<path class=\"p-BCE4F9\" d=\"M23.1752 6.54471L19.2588 2.09706L19.5572 0H25.8843L27.0916 2.09706L23.1752 6.54471Z\" fill=\"#76B7E2\" />\n<path class=\"p-7BCEFC\" d=\"M23.1748 6.54471V0H26.7928L27.0912 2.09706L23.1748 6.54471Z\" fill=\"#4D98CB\" />\n<path class=\"p-FBDA35\" d=\"M10.4525 5.09497C4.67976 5.09497 0 9.77473 0 15.5474C0 21.3202 4.67976 26 10.4525 26C16.2253 26 20.9051 21.3202 20.9051 15.5474C20.9051 9.77466 16.2253 5.09497 10.4525 5.09497ZM10.4525 23.4712C6.08338 23.4712 2.52884 19.9166 2.52884 15.5474C2.52884 11.1783 6.08338 7.62374 10.4525 7.62374C14.8217 7.62374 18.3763 11.1784 18.3763 15.5474C18.3763 19.9167 14.8217 23.4712 10.4525 23.4712Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F7BA35\" d=\"M23.1752 5.09497C17.4024 5.09497 12.7227 9.77473 12.7227 15.5475C12.7227 21.3203 17.4024 26.0001 23.1752 26.0001C28.948 26.0001 33.6277 21.3202 33.6277 15.5474C33.6277 9.77466 28.948 5.09497 23.1752 5.09497ZM23.1752 23.4712C18.806 23.4712 15.2515 19.9166 15.2515 15.5474C15.2515 11.1783 18.806 7.62374 23.1752 7.62374C27.5444 7.62374 31.0989 11.1784 31.0989 15.5474C31.099 19.9167 27.5444 23.4712 23.1752 23.4712Z\" fill=\"#76B7E2\" />\n<path class=\"p-FBDA35\" d=\"M23.143 6.35939C23.143 5.66107 22.5748 5.08691 21.8814 5.17038C19.9836 5.39884 18.2425 6.13618 16.7979 7.24142C17.4798 7.76318 18.0956 8.36683 18.6306 9.03801C19.5843 8.37483 20.6899 7.91541 21.8838 7.72383C22.5733 7.61319 23.143 7.05771 23.143 6.35939Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F7BA35\" d=\"M14.9655 22.0569C14.0118 22.7201 12.9062 23.1795 11.7123 23.3711C11.0228 23.4817 10.4531 24.0372 10.4531 24.7355C10.4531 25.4338 11.0213 26.0079 11.7146 25.9245C13.6124 25.696 15.3536 24.9587 16.7982 23.8534C16.1164 23.3316 15.5005 22.7281 14.9655 22.0569Z\" fill=\"#76B7E2\" />\n<path class=\"p-FBDA35\" d=\"M18.6305 22.0569C17.929 21.5691 17.3095 20.9714 16.7978 20.2884C15.8068 18.9655 15.2191 17.3238 15.2191 15.5473C15.2191 13.7709 15.8068 12.1293 16.7978 10.8063C16.2861 10.1233 15.6665 9.52557 14.9651 9.03784C13.5416 10.8238 12.6904 13.086 12.6904 15.5473C12.6904 18.0087 13.5416 20.2709 14.9651 22.0569C15.5 22.728 16.1159 23.3316 16.7978 23.8534C18.2425 24.9587 19.9836 25.696 21.8814 25.9244C22.5747 26.0079 23.1429 25.4337 23.1429 24.7354C23.1429 24.0371 22.5732 23.4817 21.8838 23.371C20.6898 23.1795 19.5843 22.72 18.6305 22.0569Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F7BA35\" d=\"M18.6309 9.03801C18.096 8.36683 17.4802 7.76324 16.7982 7.24142C15.3536 6.13617 13.6124 5.39883 11.7146 5.17037C11.0213 5.08691 10.4531 5.66106 10.4531 6.35936C10.4531 7.05766 11.0228 7.61312 11.7123 7.72376C12.9062 7.91535 14.0117 8.37476 14.9655 9.03794C15.667 9.52567 16.2865 10.1234 16.7982 10.8064C17.7893 12.1294 18.3769 13.771 18.3769 15.5474C18.3769 17.3239 17.7893 18.9656 16.7982 20.2885C17.3099 20.9715 17.9295 21.5692 18.6309 22.057C20.0544 20.271 20.9056 18.0088 20.9056 15.5474C20.9057 13.0861 20.0544 10.8239 18.6309 9.03801Z\" fill=\"#76B7E2\" />\n</symbol>"
});
var svg_cat_accessories_jewelry_result = browser_sprite_build_default.a.add(svg_cat_accessories_jewelry_symbol);
/* harmony default export */ var svg_cat_accessories_jewelry = (svg_cat_accessories_jewelry_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-leather.svg


var svg_cat_accessories_leather_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-leather",
  "use": "svg-cat-accessories-leather-usage",
  "viewBox": "0 0 33 26",
  "content": "<symbol viewBox=\"0 0 33 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-leather\">\n<path class=\"p-53433F\" d=\"M26.1276 0V7.65059H2.86897C1.28141 7.65059 0 4.4564 0 2.86897C0 1.31973 1.26228 0 2.86897 0H26.1276Z\" fill=\"#58ADE5\" />\n<path class=\"p-3E322E\" d=\"M26.1273 0H16.3848V7.65059H26.1273V0Z\" fill=\"#4D98CB\" />\n<path class=\"p-68544F\" d=\"M30.7299 14.4046V20.1426L32.6425 22.0552V26H4.78162C2.14216 26 0 23.8579 0 21.2184V1.97241C0 3.55985 1.28141 4.84138 2.86897 4.84138H32.6425V12.492L30.7299 14.4046Z\" fill=\"#5FBEFF\" />\n<path class=\"p-53433F\" d=\"M30.7296 14.4045V20.1425L32.6423 22.0551V26H16.3848V4.84131H32.6423V12.4919L30.7296 14.4045Z\" fill=\"#65B3E7\" />\n<path class=\"p-3E322E\" d=\"M32.6429 22.0552H25.9486C23.3078 22.0552 21.167 19.9144 21.167 17.2736C21.167 14.6328 23.3078 12.4919 25.9486 12.4919H32.6429V22.0552Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9F00\" d=\"M27.8013 16.3171H25.8887V18.2298H27.8013V16.3171Z\" fill=\"#AFD9F6\" />\n</symbol>"
});
var svg_cat_accessories_leather_result = browser_sprite_build_default.a.add(svg_cat_accessories_leather_symbol);
/* harmony default export */ var svg_cat_accessories_leather = (svg_cat_accessories_leather_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-man-bags.svg


var svg_cat_accessories_man_bags_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-man-bags",
  "use": "svg-cat-accessories-man-bags-usage",
  "viewBox": "0 0 33 28",
  "content": "<symbol viewBox=\"0 0 33 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-man-bags\">\n<path class=\"p-B29A7E\" d=\"M31.282 16.771H0.802734V28.0002H31.282V16.771Z\" fill=\"#58ADE5\" />\n<path class=\"p-A58868\" d=\"M31.2806 16.771H16.041V28.0002H31.2806V16.771Z\" fill=\"#4D98CB\" />\n<path class=\"p-947859\" d=\"M22.0567 6.01564H20.5254C20.5254 4.02541 18.5203 1.53126 16.041 1.53126C13.5618 1.53126 11.5566 4.02541 11.5566 6.01564H10.0254C10.0254 2.69864 12.724 0 16.041 0C19.358 0 22.0567 2.69864 22.0567 6.01564Z\" fill=\"#58ADE5\" />\n<path class=\"p-BFA993\" d=\"M0 14.3648C0 17.0226 2.15467 19.1773 4.81252 19.1773H27.2709C29.9288 19.1773 32.0834 17.0226 32.0834 14.3648V4.73975H0V14.3648Z\" fill=\"#5FBEFF\" />\n<path class=\"p-B29A7E\" d=\"M16.041 4.73975V19.1773H27.2703C29.9281 19.1773 32.0828 17.0226 32.0828 14.3648V4.73975H16.041Z\" fill=\"#65B3E7\" />\n<path class=\"p-88888F\" d=\"M8.0215 16.8438H5.61523V23.2604H8.0215V16.8438Z\" fill=\"#AFD9F6\" />\n<path class=\"p-88888F\" d=\"M26.4688 16.8438H24.0625V23.2604H26.4688V16.8438Z\" fill=\"#AFD9F6\" />\n<path class=\"p-EBE4DD\" d=\"M20.9271 9.55225H11.1562V13.4898H20.9271V9.55225Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D8CCBC\" d=\"M20.9264 9.55225H16.041V13.4898H20.9264V9.55225Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_accessories_man_bags_result = browser_sprite_build_default.a.add(svg_cat_accessories_man_bags_symbol);
/* harmony default export */ var svg_cat_accessories_man_bags = (svg_cat_accessories_man_bags_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-umbrella.svg


var svg_cat_accessories_umbrella_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-umbrella",
  "use": "svg-cat-accessories-umbrella-usage",
  "viewBox": "0 0 37 35",
  "content": "<symbol viewBox=\"0 0 37 35\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-umbrella\">\n<path class=\"p-68544F\" d=\"M16.0172 24.0306C15.8213 24.2925 9.06791 33.1458 9.04878 33.1486C8.57545 33.7814 7.87275 34.1749 7.14792 34.2794C6.42309 34.384 5.63785 34.2051 5.00498 33.7318C3.71996 32.7877 3.45587 30.9566 4.42178 29.688C4.55242 29.5133 5.41751 28.3566 5.5808 28.1383C5.75535 28.269 6.91216 29.134 7.11128 29.3001C6.98075 29.4746 6.11555 30.6314 5.97144 30.8469C5.64222 31.2643 5.73025 31.8747 6.16401 32.1821C6.58144 32.5113 7.1917 32.4233 7.49916 31.9895C7.71412 31.7249 14.4866 22.8688 14.4866 22.8688L15.2533 23.4592L15.3187 23.5083L16.0172 24.0306Z\" fill=\"#5FBEFF\" />\n<path class=\"p-564541\" d=\"M16.0175 24.0306C15.8216 24.2925 9.06827 33.1458 9.04913 33.1486C8.5758 33.7814 7.87311 34.1749 7.14828 34.2794L15.3191 23.5082L16.0175 24.0306Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF4040\" d=\"M9.80798 22.6869C9.73988 22.7552 9.69372 22.8397 9.62836 22.927L11.2242 24.0014C11.276 23.955 11.3086 23.9113 11.3385 23.8487C11.6405 23.513 13.7523 21.3039 14.1887 21.6303C14.6253 21.9568 13.1656 24.6366 12.8363 25.054L14.386 26.2131C14.6962 25.7984 16.8734 23.6382 17.2881 23.9483C17.7055 24.2776 16.2403 26.9192 15.9655 27.3093C15.9357 27.372 15.8839 27.4184 15.8514 27.4621L17.3329 28.6893C17.4009 28.621 17.4663 28.5337 17.5125 28.4492C23.7457 20.3653 28.7273 9.81377 32.5548 0.305063C24.5149 6.66328 15.8011 14.4235 9.80798 22.6869Z\" fill=\"#58ADE5\" />\n<path class=\"p-E10000\" d=\"M32.5546 0.304919C28.7272 9.81362 23.7455 20.3652 17.5123 28.4491C17.4662 28.5335 17.4008 28.6208 17.3328 28.6891L15.8513 27.4619C15.8838 27.4182 15.9356 27.3718 15.9654 27.3092C16.2402 26.9191 17.7054 24.2775 17.288 23.9482C16.8733 23.6381 14.696 25.7982 14.3859 26.2129L13.6875 25.6906L32.5546 0.304919Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_accessories_umbrella_result = browser_sprite_build_default.a.add(svg_cat_accessories_umbrella_symbol);
/* harmony default export */ var svg_cat_accessories_umbrella = (svg_cat_accessories_umbrella_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-accessories-woman-bags.svg


var svg_cat_accessories_woman_bags_symbol = new browser_symbol_default.a({
  "id": "svg-cat-accessories-woman-bags",
  "use": "svg-cat-accessories-woman-bags-usage",
  "viewBox": "0 0 35 30",
  "content": "<symbol viewBox=\"0 0 35 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-accessories-woman-bags\">\n<path class=\"p-FF637B\" d=\"M34.1054 19.5202C34.0255 21.0002 33.6455 22.4201 32.9854 23.7201L31.4654 23.6601L31.9055 25.4401C30.9255 26.7401 29.5788 27.84 28.0989 28.6001L26.2588 28.54L26.0789 29.4601C24.9789 29.8201 23.8189 30.0002 22.6189 30.0002H19.8989L17.9789 29.3802L17.0589 29.7001L16.219 30.0002H11.4989C10.859 30.0002 10.239 29.9401 9.61904 29.8401L9.59904 28.8L7.31904 29.2201C5.73911 28.6001 4.25238 27.66 3.09232 26.4601L3.23232 24.8401L1.83232 24.9002C0.752395 23.3201 0.11233 21.4801 0.0123968 19.5202C-0.0476697 18.2802 0.112396 17.0401 0.452329 15.8601L2.19232 15.8801L1.25239 13.9002C1.51239 13.3802 1.83232 12.8802 2.19232 12.4002L7.85904 9.6001H26.2589L31.9256 12.4002C32.5655 13.2602 33.0655 14.1801 33.4256 15.1801L32.6656 17.5001L34.0056 17.3601C34.1054 18.0601 34.1455 18.8001 34.1054 19.5202Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E63950\" d=\"M34.1051 19.5201C34.0252 21.0001 33.6452 22.4201 32.9852 23.7201L31.4652 23.66L31.9052 25.44C30.9252 26.7401 29.5786 27.84 28.0986 28.6L26.2585 28.54L26.0786 29.46C24.9786 29.82 23.8186 30.0001 22.6186 30.0001H19.8986L17.9787 29.3801L17.0586 29.7V9.6001H26.2585L31.9252 12.4002C32.5651 13.2602 33.0651 14.1801 33.4252 15.1801L32.6652 17.5001L34.0051 17.3601C34.1051 18.0601 34.1452 18.8001 34.1051 19.5201Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E63950\" d=\"M34.0053 17.3599C33.8853 16.5999 33.7053 15.8799 33.4254 15.1798L28.3987 19.6598L24.6587 16.2998L28.2187 13.0999L26.8787 11.6199L23.1788 14.9599L18.0588 10.3599L17.0588 11.2599L12.9388 14.9598L8.47886 10.9398L7.1388 12.4198L11.4589 16.2998L7.71886 19.6598L1.25221 13.8999C0.91228 14.5199 0.652215 15.1799 0.452148 15.8598L6.23887 20.9998L1.83214 24.8998C2.19214 25.4598 2.61214 25.9798 3.09214 26.4598L7.71886 22.3398L11.3389 25.5998L7.31886 29.2197C8.05886 29.4997 8.81886 29.7197 9.61892 29.8397L12.8389 26.9398L16.2189 29.9998H19.8988L23.2788 26.9398L26.0789 29.4597C26.7788 29.2397 27.4589 28.9597 28.0989 28.5997L24.7788 25.5998L28.3988 22.3398L31.9055 25.4398C32.3255 24.8998 32.6855 24.3198 32.9855 23.7198L29.9454 20.9998L34.0053 17.3599ZM17.0587 13.9399L18.0587 13.0399L21.6787 16.2998L18.0587 19.5598L17.0587 18.6598L14.4387 16.2998L17.0587 13.9399ZM9.21872 20.9999L12.9387 17.6399L16.5587 20.8999L12.8387 24.2599L9.21872 20.9999ZM18.0587 28.9598L17.0587 28.0598L14.3387 25.5999L17.0587 23.14L18.0587 22.24L21.7787 25.6L18.0587 28.9598ZM23.2786 24.2599L19.5586 20.8999L23.1786 17.6399L26.8986 20.9999L23.2786 24.2599Z\" fill=\"#58ADE5\" />\n<path class=\"p-AE2538\" d=\"M34.0051 17.3599C33.8851 16.5999 33.7051 15.8799 33.4252 15.1798L28.3985 19.6598L24.6585 16.2998L28.2186 13.0999L26.8785 11.6199L23.1786 14.9598L18.0586 10.3599L17.0586 11.2599V13.9398L18.0586 13.0398L21.6786 16.2998L18.0586 19.5598L17.0586 18.6598V23.1399L18.0586 22.2399L21.7786 25.5999L18.0586 28.9599L17.0586 28.0599V29.9999H19.8986L23.2786 26.9399L26.0786 29.4599C26.7786 29.2399 27.4586 28.9599 28.0986 28.5999L24.7786 25.5999L28.3986 22.3399L31.9053 25.4399C32.3252 24.9 32.6853 24.3199 32.9852 23.7199L29.9452 20.9999L34.0051 17.3599ZM23.2784 24.2599L19.5585 20.8999L23.1784 17.6399L26.8984 20.9999L23.2784 24.2599Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDA2D\" d=\"M31.826 9.33992C29.466 7.17986 26.2994 6 23.0594 6H11.0594C7.81944 6 4.65285 7.17993 2.29285 9.33992C1.65285 9.91986 1.31272 10.76 1.35279 11.6199C1.39285 12.5398 1.83279 13.3799 2.55285 13.9198C3.69271 14.78 5.33951 14.6998 6.45944 13.7199C7.71944 12.6199 7.54391 10.1844 9.24391 10.1844L17.0594 11.0922L24.8749 10.1844C26.5748 10.1844 26.3993 12.6199 27.6594 13.7199C28.2594 14.26 29.066 14.52 29.7861 14.52C30.4061 14.52 31.0261 14.3199 31.566 13.9199C32.2861 13.38 32.7261 12.5399 32.7661 11.62C32.806 10.76 32.466 9.91992 31.826 9.33992Z\" fill=\"#58ADE5\" />\n<path class=\"p-FDBF00\" d=\"M32.7653 11.62C32.7252 12.54 32.2853 13.38 31.5652 13.92C31.0253 14.32 30.4053 14.52 29.7853 14.52C29.0652 14.52 28.2586 14.26 27.6586 13.72C26.3986 12.62 26.5741 10.1845 24.8741 10.1845L17.0586 11.0922V6H23.0586C26.2986 6 29.4652 7.17993 31.8252 9.33992C32.4652 9.91999 32.8053 10.7601 32.7653 11.62Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDBF00\" d=\"M9.05956 7.99999C7.4053 7.99999 6.05957 6.65426 6.05957 4.99999C6.05957 3.34573 7.4053 2 9.05956 2C10.7138 2 12.0596 3.34573 12.0596 4.99999C12.0596 6.65426 10.7138 7.99999 9.05956 7.99999ZM9.05956 4C8.50783 4 8.05957 4.44826 8.05957 4.99999C8.05957 5.55173 8.50783 5.99999 9.05956 5.99999C9.6113 5.99999 10.0596 5.55173 10.0596 4.99999C10.0596 4.44826 9.6113 4 9.05956 4Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FF9100\" d=\"M25.0586 7.99999C23.4043 7.99999 22.0586 6.65426 22.0586 4.99999C22.0586 3.34573 23.4043 2 25.0586 2C26.7129 2 28.0586 3.34573 28.0586 4.99999C28.0586 6.65426 26.7129 7.99999 25.0586 7.99999ZM25.0586 4C24.5069 4 24.0586 4.44826 24.0586 4.99999C24.0586 5.55173 24.5069 5.99999 25.0586 5.99999C25.6103 5.99999 26.0586 5.55173 26.0586 4.99999C26.0586 4.44826 25.6103 4 25.0586 4Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDBF00\" d=\"M20.0586 0C18.8586 0 17.7986 0.539932 17.0586 1.38C16.3186 0.539932 15.2585 0 14.0586 0C11.8587 0 10.0586 1.79993 10.0586 3.99999C10.0586 6.19991 11.8587 7.99997 14.0586 7.99997C15.2585 7.99997 16.3186 7.45991 17.0586 6.61998C17.7986 7.45991 18.8586 7.99997 20.0586 7.99997C22.2585 7.99997 24.0585 6.19991 24.0585 3.99999C24.0585 1.79993 22.2585 0 20.0586 0ZM14.0586 5.99998C12.9586 5.99998 12.0586 5.09998 12.0586 3.99999C12.0586 2.89999 12.9586 1.99999 14.0586 1.99999C15.1586 1.99999 16.0586 2.89999 16.0586 3.99999C16.0586 5.09998 15.1585 5.99998 14.0586 5.99998ZM20.0586 5.99998C18.9586 5.99998 18.0586 5.09998 18.0586 3.99999C18.0586 2.89999 18.9586 1.99999 20.0586 1.99999C21.1586 1.99999 22.0586 2.89999 22.0586 3.99999C22.0586 5.09998 21.1585 5.99998 20.0586 5.99998Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF9100\" d=\"M20.0586 0C18.8587 0 17.7986 0.539932 17.0586 1.38V6.61998C17.7986 7.45991 18.8587 7.99997 20.0586 7.99997C22.2585 7.99997 24.0586 6.19991 24.0586 3.99999C24.0586 1.79993 22.2585 0 20.0586 0ZM20.0586 5.99998C18.9586 5.99998 18.0586 5.09998 18.0586 3.99999C18.0586 2.89999 18.9586 1.99999 20.0586 1.99999C21.1586 1.99999 22.0586 2.89999 22.0586 3.99999C22.0586 5.09998 21.1585 5.99998 20.0586 5.99998Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_accessories_woman_bags_result = browser_sprite_build_default.a.add(svg_cat_accessories_woman_bags_symbol);
/* harmony default export */ var svg_cat_accessories_woman_bags = (svg_cat_accessories_woman_bags_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-anim-care.svg


var svg_cat_anim_care_symbol = new browser_symbol_default.a({
  "id": "svg-cat-anim-care",
  "use": "svg-cat-anim-care-usage",
  "viewBox": "0 0 27 28",
  "content": "<symbol viewBox=\"0 0 27 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-anim-care\">\n<path d=\"M22.243 7.10935H17.6792L17.5781 0H22.3441L22.243 7.10935Z\" fill=\"#00C3FF\" />\n<path class=\"p-00AAF0\" d=\"M19.9609 7.10935H22.2428L22.3439 0H19.9609V7.10935Z\" fill=\"#4D98CB\" />\n<path class=\"p-CCEFFF\" d=\"M26.7968 27.9999H13.125V5.46875H26.7968V27.9999Z\" fill=\"#B9DFFC\" />\n<path class=\"p-ACE3FC\" d=\"M26.7969 27.9999H19.9609V5.46875H26.7969V27.9999Z\" fill=\"#A1D1FD\" />\n<path class=\"p-D6702B\" d=\"M7.66304 25.1312C7.11682 23.7383 7.10988 23.8795 7.10988 22.3834V18.0469H4.37551V22.3834C4.37551 23.8795 4.36857 23.7384 3.82235 25.1313C3.30113 26.4604 4.65349 28 5.74269 28C6.84098 28 8.18426 26.4604 7.66304 25.1312Z\" fill=\"#5FBEFF\" />\n<path class=\"p-BF6015\" d=\"M7.66324 25.1312C7.11702 23.7383 7.11007 23.8795 7.11007 22.3834V18.0469H5.74316V28C6.84139 27.9997 8.18441 26.4603 7.66324 25.1312Z\" fill=\"#4D98CB\" />\n<path class=\"p-E08344\" d=\"M5.74217 19.1406C2.52229 19.1406 0 14.9368 0 9.57028C0 4.20376 2.52229 0 5.74217 0C8.96205 0 11.4843 4.20376 11.4843 9.57028C11.4843 14.9368 8.96205 19.1406 5.74217 19.1406Z\" fill=\"#58ADE5\" />\n<path class=\"p-D6702B\" d=\"M5.74219 0V19.1406C8.96207 19.1406 11.4844 14.9368 11.4844 9.57028C11.4844 4.20376 8.96207 0 5.74219 0Z\" fill=\"#58ADE5\" />\n<path class=\"p-FEDBAB\" d=\"M5.74217 1.64062C4.73686 1.64062 3.75478 2.40226 2.97685 3.7853C2.1152 5.3172 1.64062 7.37164 1.64062 9.57028C1.64062 11.7689 2.1152 13.8234 2.97685 15.3553C3.75478 16.7383 4.73686 17.4999 5.74217 17.4999C6.74749 17.4999 7.72956 16.7383 8.50749 15.3553C9.36914 13.8234 9.84372 11.7689 9.84372 9.57028C9.84372 7.37164 9.36914 5.3172 8.50749 3.7853C7.72956 2.40226 6.74749 1.64062 5.74217 1.64062Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FEC478\" d=\"M8.50821 3.7853C7.73034 2.40242 6.74837 1.64073 5.74316 1.64062V17.4999C6.74837 17.4998 7.73034 16.7382 8.50821 15.3553C9.36987 13.8234 9.84444 11.7689 9.84444 9.57028C9.84444 7.37164 9.36987 5.3172 8.50821 3.7853Z\" fill=\"#A1D1FD\" />\n<path d=\"M26.7968 12.6245H13.125V20.8442H26.7968V12.6245Z\" fill=\"#00C3FF\" />\n<path class=\"p-FEC478\" d=\"M3.82812 10.6641C4.43218 10.6641 4.92187 10.1744 4.92187 9.57031C4.92187 8.96625 4.43218 8.47656 3.82812 8.47656C3.22406 8.47656 2.73438 8.96625 2.73438 9.57031C2.73438 10.1744 3.22406 10.6641 3.82812 10.6641Z\" fill=\"#58ADE5\" />\n<path class=\"p-FEA832\" d=\"M7.65625 10.6641C8.26031 10.6641 8.74999 10.1744 8.74999 9.57031C8.74999 8.96625 8.26031 8.47656 7.65625 8.47656C7.05219 8.47656 6.5625 8.96625 6.5625 9.57031C6.5625 10.1744 7.05219 10.6641 7.65625 10.6641Z\" fill=\"#4D98CB\" />\n<path class=\"p-FEC478\" d=\"M4.10156 6.83593C4.70562 6.83593 5.1953 6.34624 5.1953 5.74218C5.1953 5.13812 4.70562 4.64844 4.10156 4.64844C3.4975 4.64844 3.00781 5.13812 3.00781 5.74218C3.00781 6.34624 3.4975 6.83593 4.10156 6.83593Z\" fill=\"#58ADE5\" />\n<path class=\"p-FEA832\" d=\"M7.38281 6.83593C7.98687 6.83593 8.47655 6.34624 8.47655 5.74218C8.47655 5.13812 7.98687 4.64844 7.38281 4.64844C6.77875 4.64844 6.28906 5.13812 6.28906 5.74218C6.28906 6.34624 6.77875 6.83593 7.38281 6.83593Z\" fill=\"#4D98CB\" />\n<path class=\"p-FEC478\" d=\"M4.10156 14.4922C4.70562 14.4922 5.1953 14.0025 5.1953 13.3984C5.1953 12.7944 4.70562 12.3047 4.10156 12.3047C3.4975 12.3047 3.00781 12.7944 3.00781 13.3984C3.00781 14.0025 3.4975 14.4922 4.10156 14.4922Z\" fill=\"#58ADE5\" />\n<path class=\"p-FEA832\" d=\"M7.38281 14.4922C7.98687 14.4922 8.47655 14.0025 8.47655 13.3984C8.47655 12.7944 7.98687 12.3047 7.38281 12.3047C6.77875 12.3047 6.28906 12.7944 6.28906 13.3984C6.28906 14.0025 6.77875 14.4922 7.38281 14.4922Z\" fill=\"#4D98CB\" />\n<path class=\"p-00AAF0\" d=\"M26.7969 12.6245H19.9609V20.8442H26.7969V12.6245Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_anim_care_result = browser_sprite_build_default.a.add(svg_cat_anim_care_symbol);
/* harmony default export */ var svg_cat_anim_care = (svg_cat_anim_care_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-anim-clothes.svg


var svg_cat_anim_clothes_symbol = new browser_symbol_default.a({
  "id": "svg-cat-anim-clothes",
  "use": "svg-cat-anim-clothes-usage",
  "viewBox": "0 0 29 26",
  "content": "<symbol viewBox=\"0 0 29 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-anim-clothes\">\n<path class=\"p-FD4B2D\" d=\"M2.62487 10.3152C3.17403 9.96772 3.80425 9.64459 4.51258 9.35067C7.186 8.24138 10.7221 7.63044 14.4696 7.63044C18.217 7.63044 21.7531 8.24138 24.4265 9.35067C25.1349 9.64459 25.7651 9.96772 26.3143 10.3152C28.0211 9.2352 28.9391 10.2304 28.9391 6.5C28.9391 4.62517 27.3365 2.92766 24.4265 1.72024C21.7531 0.610944 18.217 0 14.4696 0C10.7221 0 7.186 0.610944 4.51258 1.72024C1.60262 2.92766 0 4.62517 0 6.5C0 10.7391 0.918026 9.2352 2.62487 10.3152Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E8130F\" d=\"M24.4267 1.72024C22.6833 0.996868 20.5732 0.485413 18.2768 0.217095C16.1839 -0.0274399 14.4697 1.70813 14.4697 3.81522C14.4697 5.9223 16.1839 7.603 18.2768 7.84753C20.5732 8.11585 22.6833 8.6273 24.4267 9.35067C25.135 9.64459 25.7653 9.96772 26.3144 10.3152C28.0213 9.2352 28.9393 10.2304 28.9393 6.5C28.9393 4.62517 27.3367 2.92766 24.4267 1.72024Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF6849\" d=\"M24.4265 11.2798C21.7531 12.3891 18.217 13 14.4696 13C10.7221 13 7.186 12.3891 4.51258 11.2798C1.60262 10.0723 0 8.37483 0 6.5V13.2826C0 15.1574 1.60262 16.855 4.51258 18.0624C7.186 19.1717 10.7221 19.7826 14.4696 19.7826C18.217 19.7826 21.7531 19.1717 24.4265 18.0624C27.3365 16.855 28.9391 15.1574 28.9391 13.2826V6.5C28.9391 8.37483 27.3365 10.0723 24.4265 11.2798Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FD4B2D\" d=\"M24.4266 11.2798C21.7532 12.3891 18.2172 13 14.4697 13C12.5968 13 9.17011 13.9291 9.22127 16.3913C9.28587 19.5 12.5968 19.7826 14.4697 19.7826C18.2172 19.7826 21.7532 19.1717 24.4266 18.0624C27.3367 16.855 28.9393 15.1574 28.9393 13.2826V6.5C28.9393 8.37483 27.3367 10.0723 24.4266 11.2798Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFEA84\" d=\"M14.469 26C11.9757 26 9.94727 23.9716 9.94727 21.4783C9.94727 18.985 11.9757 16.9565 14.469 16.9565C16.9623 16.9565 18.9907 18.985 18.9907 21.4783C18.9907 23.9716 16.9623 26 14.469 26Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFDC40\" d=\"M14.4697 16.9565V26C16.963 26 18.9915 23.9716 18.9915 21.4783C18.9915 18.985 16.963 16.9565 14.4697 16.9565Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFAB15\" d=\"M15.3177 22.4067H13.6221V25.1521H15.3177V22.4067Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_anim_clothes_result = browser_sprite_build_default.a.add(svg_cat_anim_clothes_symbol);
/* harmony default export */ var svg_cat_anim_clothes = (svg_cat_anim_clothes_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-anim-food.svg


var svg_cat_anim_food_symbol = new browser_symbol_default.a({
  "id": "svg-cat-anim-food",
  "use": "svg-cat-anim-food-usage",
  "viewBox": "0 0 34 22",
  "content": "<symbol viewBox=\"0 0 34 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-anim-food\">\n<path class=\"p-E08344\" d=\"M26.3208 0.921324C25.4832 0.921324 23.7935 2.07148 23.1344 2.48833C22.6085 2.821 21.9198 3.61747 21.5244 3.13679C20.4059 1.77636 18.71 0 16.8112 0C14.9125 0 13.2166 1.77636 12.098 3.13672C11.7026 3.61741 10.1053 1.91224 9.5793 1.57957C8.92019 1.16272 8.13928 0.921258 7.30162 0.921258C4.94344 0.921324 3.94043 2.83303 3.94043 5.19121V11.3521H29.682V5.19121C29.682 2.83303 28.679 0.921324 26.3208 0.921324Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D6702B\" d=\"M26.3201 0.921258C25.4825 0.921258 23.7928 2.07141 23.1337 2.48827C22.6078 2.82094 21.9191 2.70871 21.5238 2.22803C20.4052 0.867663 18.7093 0 16.8105 0V11.3521H29.6814V5.19121C29.6814 2.83303 28.6783 0.921258 26.3201 0.921258Z\" fill=\"#A1D1FD\" />\n<path class=\"p-00C3FF\" d=\"M29.6817 5.18933C29.6817 6.52191 28.4078 7.8899 26.1865 8.94261C23.6987 10.1217 20.369 10.7711 16.8108 10.7711C13.2527 10.7711 9.923 10.1217 7.43519 8.94261C5.21392 7.8899 3.94004 6.52185 3.94004 5.18933C2.83243 5.07283 1.81564 5.81133 1.58383 6.90068L0 14.3448V14.4484C0 16.6266 1.86193 18.5988 5.24282 20.0016C8.34882 21.2904 12.457 22.0002 16.8108 22.0002C21.1647 22.0002 25.2729 21.2904 28.3789 20.0016C31.7598 18.5987 33.6217 16.6266 33.6217 14.4484V14.3448L32.0379 6.90068C31.8061 5.81133 30.7893 5.07277 29.6817 5.18933Z\" fill=\"#58ADE5\" />\n<path class=\"p-00AAF0\" d=\"M32.0376 6.90067C31.8058 5.81132 30.789 5.07282 29.6814 5.18931C29.6814 6.5219 28.4075 7.88989 26.1862 8.9426C23.6984 10.1217 20.3687 10.771 16.8105 10.771V22.0002C21.1644 22.0002 25.2726 21.2904 28.3786 20.0016C31.7595 18.5987 33.6214 16.6266 33.6214 14.4484V14.3448L32.0376 6.90067Z\" fill=\"#4D98CB\" />\n<path class=\"p-D6702B\" d=\"M10.3094 6.5681C11.0348 6.5681 11.6228 5.9801 11.6228 5.25475C11.6228 4.52941 11.0348 3.94141 10.3094 3.94141C9.5841 3.94141 8.99609 4.52941 8.99609 5.25475C8.99609 5.9801 9.5841 6.5681 10.3094 6.5681Z\" fill=\"#4D98CB\" />\n<path class=\"p-D6702B\" d=\"M14.5126 8.80052C15.2379 8.80052 15.8259 8.21252 15.8259 7.48718C15.8259 6.76183 15.2379 6.17383 14.5126 6.17383C13.7872 6.17383 13.1992 6.76183 13.1992 7.48718C13.1992 8.21252 13.7872 8.80052 14.5126 8.80052Z\" fill=\"#4D98CB\" />\n<path class=\"p-E08344\" d=\"M19.8973 5.96654C20.6227 5.96654 21.2107 5.37853 21.2107 4.65319C21.2107 3.92785 20.6227 3.33984 19.8973 3.33984C19.172 3.33984 18.584 3.92785 18.584 4.65319C18.584 5.37853 19.172 5.96654 19.8973 5.96654Z\" fill=\"#65B3E7\" />\n<path class=\"p-E08344\" d=\"M23.9686 8.46214C24.694 8.46214 25.282 7.87414 25.282 7.1488C25.282 6.42345 24.694 5.83545 23.9686 5.83545C23.2433 5.83545 22.6553 6.42345 22.6553 7.1488C22.6553 7.87414 23.2433 8.46214 23.9686 8.46214Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_anim_food_result = browser_sprite_build_default.a.add(svg_cat_anim_food_symbol);
/* harmony default export */ var svg_cat_anim_food = (svg_cat_anim_food_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-anim-toys.svg


var svg_cat_anim_toys_symbol = new browser_symbol_default.a({
  "id": "svg-cat-anim-toys",
  "use": "svg-cat-anim-toys-usage",
  "viewBox": "0 0 28 28",
  "content": "<symbol viewBox=\"0 0 28 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-anim-toys\">\n<path class=\"p-DCF4FF\" d=\"M14 28C10.2605 28 6.74477 26.5437 4.10047 23.8995C1.45627 21.2552 0 17.7395 0 14C0 10.2605 1.45627 6.74477 4.10047 4.10047C6.74477 1.45627 10.2605 0 14 0C17.7395 0 21.2552 1.45627 23.8995 4.10047C26.5437 6.74477 28 10.2605 28 14C28 17.7395 26.5437 21.2552 23.8995 23.8995C21.2552 26.5437 17.7395 28 14 28Z\" fill=\"#B9DFFC\" />\n<path class=\"p-CCEFFF\" d=\"M23.8995 4.10047C21.2552 1.45627 17.7395 0 14 0V28C17.7395 28 21.2552 26.5437 23.8995 23.8995C26.5437 21.2552 28 17.7395 28 14C28 10.2605 26.5437 6.74477 23.8995 4.10047Z\" fill=\"#A1D1FD\" />\n<path class=\"p-87E694\" d=\"M4.37347 24.165C6.82959 21.3452 8.17097 17.7759 8.17097 14.0007C8.17097 10.2249 6.82948 6.65549 4.37298 3.83569C4.28121 3.9227 4.19027 4.01086 4.10047 4.1006C1.45627 6.7449 0 10.2606 0 14.0001C0 17.7397 1.45627 21.2554 4.10047 23.8997C4.19043 23.9896 4.28154 24.0778 4.37347 24.165Z\" fill=\"#58ADE5\" />\n<path class=\"p-66CC70\" d=\"M23.8995 4.1005C23.8918 4.09273 23.8838 4.08535 23.8761 4.07764C21.5541 6.85746 20.2891 10.3289 20.2891 13.9947C20.2891 17.6634 21.5558 21.1369 23.881 23.9176C23.8871 23.9115 23.8934 23.9057 23.8995 23.8996C26.5437 21.2553 28 17.7396 28 14C28 10.2605 26.5437 6.7448 23.8995 4.1005Z\" fill=\"#4D98CB\" />\n<path class=\"p-87E694\" d=\"M18.6484 13.9946C18.6484 9.92359 20.0594 6.06933 22.6481 2.98873C20.1914 1.05142 17.1766 0 13.9999 0C10.9409 0 8.03195 0.975024 5.62695 2.77714C8.33382 5.89269 9.81159 9.83298 9.81159 14.0006C9.81159 18.1676 8.33393 22.1079 5.6275 25.2233C8.03238 27.0251 10.9412 28 13.9999 28C17.1789 28 20.1958 26.947 22.6535 25.007C20.0613 21.9254 18.6484 18.0689 18.6484 13.9946Z\" fill=\"#58ADE5\" />\n<path class=\"p-66CC70\" d=\"M18.6484 13.9946C18.6484 9.92359 20.0594 6.06933 22.6481 2.98873C20.1915 1.05142 17.1767 0 14 0V28C17.179 28 20.1959 26.947 22.6535 25.007C20.0613 21.9254 18.6484 18.0689 18.6484 13.9946Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_anim_toys_result = browser_sprite_build_default.a.add(svg_cat_anim_toys_symbol);
/* harmony default export */ var svg_cat_anim_toys = (svg_cat_anim_toys_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-books.svg


var svg_cat_books_symbol = new browser_symbol_default.a({
  "id": "svg-cat-books",
  "use": "svg-cat-books-usage",
  "viewBox": "0 0 32 37",
  "content": "<symbol viewBox=\"0 0 32 37\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-books\">\n<path class=\"p-FF7452\" d=\"M3.79395 0C1.70193 0 0 1.702 0 3.79395V33.2061H5.41992V0H3.79395Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF7452\" d=\"M31.2188 0H22.1133L10.1895 4.33594V31.6629L31.2188 29.4121V0Z\" fill=\"#58ADE5\" />\n<path class=\"p-FB9D46\" d=\"M5.41992 0V33.2061H17.7773V3.25195L13.4414 0H5.41992Z\" fill=\"#5FBEFF\" />\n<path class=\"p-F7EDBC\" d=\"M29.0508 30.4961H15.6094V35.916H29.0508V30.4961Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFFFFF\" d=\"M3.79395 30.4961C2.29725 30.4961 1.08398 31.7094 1.08398 33.2061C1.08398 34.7027 2.29725 35.916 3.79395 35.916H17.7773V30.4961H3.79395Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E24642\" d=\"M31.2188 37V34.832H17.7773L16.332 35.916L17.7773 37H31.2188Z\" fill=\"#4D98CB\" />\n<path class=\"p-E24642\" d=\"M31.2188 31.5801V29.4121H17.7773L16.332 30.4961L17.7773 31.5801H31.2188Z\" fill=\"#4D98CB\" />\n<path class=\"p-F15D4A\" d=\"M2.16797 33.2061C2.16797 32.3095 2.89735 31.5801 3.79395 31.5801H17.7773V29.4121H3.79395C1.70193 29.4121 0 31.1141 0 33.2061C0 35.298 1.70193 37 3.79395 37H17.7773V34.832H3.79395C2.89735 34.832 2.16797 34.1026 2.16797 33.2061Z\" fill=\"#65B3E7\" />\n<path class=\"p-C42725\" d=\"M17.7773 0L15.248 9.43832L17.7773 18.8767L23.1133 25.2127V0H17.7773Z\" fill=\"#4D98CB\" />\n<path class=\"p-D33734\" d=\"M12.4414 0V25.2127L17.7773 18.8767V0H12.4414Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_books_result = browser_sprite_build_default.a.add(svg_cat_books_symbol);
/* harmony default export */ var svg_cat_books = (svg_cat_books_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-books-adult.svg


var svg_cat_books_adult_symbol = new browser_symbol_default.a({
  "id": "svg-cat-books-adult",
  "use": "svg-cat-books-adult-usage",
  "viewBox": "0 0 33 25",
  "content": "<symbol viewBox=\"0 0 33 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-books-adult\">\n<path class=\"p-FF641A\" d=\"M32.6531 1.91333H0V25.0001H32.6531V1.91333Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M32.6527 1.91333H16.3262V25.0001H32.6527V1.91333Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFF5F5\" d=\"M20.1528 0C18.5839 0 17.2064 0.746174 16.3263 1.91327C15.4461 0.746174 14.0686 0 12.4997 0H2.125V21.1097H13.3822C14.6259 21.1097 14.7956 22.7957 15.1974 23.9055H17.4551C17.8569 22.7957 18.0266 21.1097 19.2703 21.1097H28.7625V0H20.1528Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EFE2DD\" d=\"M30.5274 0V21.1097H20.1527C18.0265 21.1097 17.8568 22.7957 17.4551 23.9055H16.3262V1.91327C17.2063 0.746174 18.5838 0 20.1527 0H30.5274Z\" fill=\"#A1D1FD\" />\n<path class=\"p-9CDD05\" d=\"M10.5867 9.56621C10.0589 9.56621 9.63006 9.13739 9.63006 8.60958C9.63006 8.08177 10.0589 7.65295 10.5867 7.65295C11.1145 7.65295 11.5433 8.08177 11.5433 8.60958H13.4566C13.4566 7.36404 12.6544 6.31213 11.5433 5.91589V3.82642H9.63006V5.91589C8.51897 6.31213 7.7168 7.36404 7.7168 8.60958C7.7168 10.1921 9.00417 11.4795 10.5867 11.4795C11.1145 11.4795 11.5433 11.9083 11.5433 12.4361C11.5433 12.9639 11.1145 13.3927 10.5867 13.3927C10.0589 13.3927 9.63006 12.9639 9.63006 12.4361H7.7168C7.7168 13.6816 8.51897 14.7336 9.63006 15.1298V17.2193H11.5433V15.1298C12.6544 14.7336 13.4566 13.6816 13.4566 12.4361C13.4566 10.8536 12.1692 9.56621 10.5867 9.56621Z\" fill=\"#5FBEFF\" />\n<path class=\"p-CDBFBA\" d=\"M28.4661 3.82642H19.1963V5.73968H28.4661V3.82642Z\" fill=\"#58ADE5\" />\n<path class=\"p-CDBFBA\" d=\"M28.4661 7.65308H19.1963V9.56634H28.4661V7.65308Z\" fill=\"#58ADE5\" />\n<path class=\"p-CDBFBA\" d=\"M28.4661 11.4795H19.1963V13.3928H28.4661V11.4795Z\" fill=\"#58ADE5\" />\n<path class=\"p-CDBFBA\" d=\"M28.4661 15.3062H19.1963V17.2194H28.4661V15.3062Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_books_adult_result = browser_sprite_build_default.a.add(svg_cat_books_adult_symbol);
/* harmony default export */ var svg_cat_books_adult = (svg_cat_books_adult_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-books-child.svg


var svg_cat_books_child_symbol = new browser_symbol_default.a({
  "id": "svg-cat-books-child",
  "use": "svg-cat-books-child-usage",
  "viewBox": "0 0 23 30",
  "content": "<symbol viewBox=\"0 0 23 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-books-child\">\n<path class=\"p-54469D\" d=\"M22.8511 11.4846L21.0933 13.2424L22.8511 15.0001V24.7265L14.0622 25.7461L6.90799 26.5721C6.90799 26.2558 1.75781 25.9393 1.75781 25.6054V3.42814L6.94324 0.000488281H14.0622L16.6989 2.12744L19.3355 0.000488281H22.8511V11.4846Z\" fill=\"#58ADE5\" />\n<path class=\"p-463B85\" d=\"M22.8514 11.4846L21.0936 13.2423L22.8514 15.0001V24.7264L14.0625 25.7461V0.000455965L17.1386 0L19.3358 0.000455965H22.8514V11.4846Z\" fill=\"#4D98CB\" />\n<path class=\"p-CB75F6\" d=\"M7.03109 13.2424C7.03109 11.1198 5.51867 9.34483 3.51554 8.93629V5.24405C5.51867 4.83551 7.03109 3.00198 7.03109 0.879374C7.03109 0.577486 6.99309 0.28544 6.93473 0.000488281H0V27.3631L4.9799 26.7884L6.91276 26.5655C6.98256 26.2549 7.03109 25.9365 7.03109 25.6054C7.03109 23.4828 5.51867 21.7078 3.51554 21.2993V17.5485C5.51867 17.1399 7.03109 15.365 7.03109 13.2424Z\" fill=\"#A1D1FD\" />\n<path class=\"p-C6E2E7\" d=\"M17.5781 11.4846H22.8514V15.0002H17.5781V11.4846Z\" fill=\"#A1D1FD\" />\n<path class=\"p-463B85\" d=\"M22.851 26.4843L21.0933 27.3632L22.851 28.2421V29.9999H2.63666C1.17757 29.9999 0 28.8223 0 27.3632C0 25.9041 1.17757 24.7266 2.63666 24.7266H22.851V26.4843Z\" fill=\"#5FBEFF\" />\n<path class=\"p-392E6E\" d=\"M22.8514 26.4843L21.0936 27.3632L22.8514 28.2421V29.9999H14.0625V24.7266H22.8514V26.4843Z\" fill=\"#65B3E7\" />\n<path class=\"p-DEECF1\" d=\"M22.8511 26.4841V28.2419H2.6367C2.14438 28.2419 1.75781 27.8553 1.75781 27.363C1.75781 26.8707 2.14438 26.4841 2.6367 26.4841H22.8511Z\" fill=\"#B9DFFC\" />\n<path class=\"p-C6E2E7\" d=\"M14.0625 26.4841H22.8514V28.2419H14.0625V26.4841Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFE470\" d=\"M14.0624 8.8479C11.6368 8.8479 9.66797 10.8167 9.66797 13.2423C9.66797 15.668 11.6368 17.6368 14.0624 17.6368C16.488 17.6368 18.4568 15.668 18.4568 13.2423C18.4568 10.8167 16.488 8.8479 14.0624 8.8479Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFD400\" d=\"M18.4569 13.2423C18.4569 15.668 16.4881 17.6368 14.0625 17.6368V8.8479C16.4881 8.8479 18.4569 10.8167 18.4569 13.2423Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDBF00\" d=\"M14.0624 10.606C12.6034 10.606 11.4258 11.7835 11.4258 13.2426C11.4258 14.7017 12.6034 15.8793 14.0624 15.8793C15.5215 15.8793 16.6991 14.7017 16.6991 13.2426C16.6991 11.7835 15.5215 10.606 14.0624 10.606Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF9F00\" d=\"M16.6992 13.2426C16.6992 14.7017 15.5216 15.8793 14.0625 15.8793V10.606C15.5216 10.606 16.6992 11.7835 16.6992 13.2426Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFE470\" d=\"M13.1836 12.3635H14.9414V14.1213H13.1836V12.3635Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFD400\" d=\"M14.0625 12.3635H14.9414V14.1213H14.0625V12.3635Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_books_child_result = browser_sprite_build_default.a.add(svg_cat_books_child_symbol);
/* harmony default export */ var svg_cat_books_child = (svg_cat_books_child_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-books-magazine.svg


var svg_cat_books_magazine_symbol = new browser_symbol_default.a({
  "id": "svg-cat-books-magazine",
  "use": "svg-cat-books-magazine-usage",
  "viewBox": "0 0 24 28",
  "content": "<symbol viewBox=\"0 0 24 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-books-magazine\">\n<path class=\"p-E0F4FE\" d=\"M23.4062 26.0649H0V2.20095C0 0.98544 0.98544 0 2.20095 0H23.4062V26.0649Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BCDBFD\" d=\"M11.8125 0H23.4062V26.0649H11.8125V0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FED843\" d=\"M3.10059 6.02515H20.2889V7.66577H3.10059V6.02515Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FD7EB8\" d=\"M9.30155 11.1763C9.30155 12.4504 8.26862 13.4834 6.99443 13.4834H5.47899C4.20481 13.4834 3.17188 12.4504 3.17188 11.1763C3.17188 9.90207 4.20481 8.86914 5.479 8.86914H6.99443C8.26862 8.86914 9.30155 9.90207 9.30155 11.1763Z\" fill=\"#58ADE5\" />\n<path class=\"p-2D3C72\" d=\"M3.11719 20.0593H9.38807V21.6999H3.11719V20.0593Z\" fill=\"#5FBEFF\" />\n<path class=\"p-2D3C72\" d=\"M3.11719 17.3247H9.38807V18.9653H3.11719V17.3247Z\" fill=\"#5FBEFF\" />\n<path class=\"p-1A2958\" d=\"M14.0879 20.0593H20.3039V21.6999H14.0879V20.0593Z\" fill=\"#2D3C72\" />\n<path class=\"p-1A2958\" d=\"M14.0879 17.3247H20.3039V18.9653H14.0879V17.3247Z\" fill=\"#2D3C72\" />\n<path class=\"p-54469D\" d=\"M10.9375 9.03296H20.289V10.6736H10.9375V9.03296Z\" fill=\"#65B3E7\" />\n<path class=\"p-54469D\" d=\"M10.9375 11.7676H20.289V13.4082H10.9375V11.7676Z\" fill=\"#65B3E7\" />\n<path class=\"p-FED843\" d=\"M10.8828 17.345H12.5234V21.7744H10.8828V17.345Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FED843\" d=\"M3.11719 14.5022H20.289V16.1428H3.11719V14.5022Z\" fill=\"#5FBEFF\" />\n<path class=\"p-1AAA94\" d=\"M4.97369 4.37255L4.96771 3.41873L4.51312 4.18435H4.20208L3.74728 3.45163V4.37277H3.10449V2.27905H3.68469L4.36657 3.39459L5.03051 2.27905H5.61071L5.61669 4.37255H4.97369Z\" fill=\"#4D98CB\" />\n<path class=\"p-1AAA94\" d=\"M7.38433 4.00771H6.58859L6.44824 4.37258H5.73047L6.64541 2.2793H7.33947L8.25463 4.37258H7.52468L7.38433 4.00771ZM7.18972 3.49929L6.98635 2.97293L6.78299 3.49929H7.18972Z\" fill=\"#4D98CB\" />\n<path class=\"p-1AAA94\" d=\"M9.72332 3.26898H10.3364V4.15423C10.0822 4.32769 9.73229 4.4204 9.42425 4.4204C8.74835 4.4204 8.25488 3.96881 8.25488 3.3258C8.25488 2.6828 8.74835 2.2312 9.4392 2.2312C9.85192 2.2312 10.1839 2.37476 10.3962 2.63495L9.94464 3.03271C9.81304 2.88019 9.66052 2.80243 9.47509 2.80243C9.16406 2.80243 8.96667 3.0028 8.96667 3.3258C8.96667 3.63983 9.16406 3.84918 9.46612 3.84918C9.55285 3.84918 9.63659 3.83422 9.72332 3.79833V3.26898Z\" fill=\"#4D98CB\" />\n<path class=\"p-1AAA94\" d=\"M12.065 4.00771H11.2695L11.1289 4.37258H10.4111L11.3263 2.2793H12.0201L12.9353 4.37258H12.2056L12.065 4.00771ZM11.8706 3.49929L11.6672 2.97293L11.4639 3.49929H11.8706Z\" fill=\"#4D98CB\" />\n<path class=\"p-149084\" d=\"M14.8976 3.82525V4.37255H12.9746V3.9389L13.9316 2.82635H13.0045V2.27905H14.8498V2.71271L13.8928 3.82525H14.8976Z\" fill=\"#4D98CB\" />\n<path class=\"p-149084\" d=\"M15.1045 2.27905H15.8103V4.37255H15.1045V2.27905Z\" fill=\"#4D98CB\" />\n<path class=\"p-149084\" d=\"M18.214 2.27905V4.37255H17.6338L16.8383 3.4215V4.37255H16.1504V2.27905H16.7306L17.5261 3.2301V2.27905H18.214Z\" fill=\"#4D98CB\" />\n<path class=\"p-149084\" d=\"M20.2953 3.8402V4.37255H18.5547V2.27905H20.2564V2.8114H19.2485V3.05664H20.1338V3.56506H19.2485V3.8402H20.2953Z\" fill=\"#4D98CB\" />\n<path class=\"p-EDBE2B\" d=\"M11.8125 6.02515H20.289V7.66577H11.8125V6.02515Z\" fill=\"#58ADE5\" />\n<path class=\"p-1A2958\" d=\"M14.0879 20.0593H20.3039V21.6999H14.0879V20.0593Z\" fill=\"#4D98CB\" />\n<path class=\"p-1A2958\" d=\"M14.0879 17.3247H20.3039V18.9653H14.0879V17.3247Z\" fill=\"#4D98CB\" />\n<path class=\"p-1A2958\" d=\"M11.8125 9.03296H20.289V10.6736H11.8125V9.03296Z\" fill=\"#4D98CB\" />\n<path class=\"p-1A2958\" d=\"M11.8125 11.7676H20.289V13.4082H11.8125V11.7676Z\" fill=\"#4D98CB\" />\n<path class=\"p-EDBE2B\" d=\"M11.8125 17.345H12.5234V21.7744H11.8125V17.345Z\" fill=\"#58ADE5\" />\n<path class=\"p-EDBE2B\" d=\"M11.8125 14.5022H20.289V16.1428H11.8125V14.5022Z\" fill=\"#58ADE5\" />\n<path class=\"p-149084\" d=\"M12.0212 2.27905H11.8125V3.34631L11.8717 3.49926H11.8125V4.00768H12.0661L12.2066 4.37255H12.9364L12.0212 2.27905Z\" fill=\"#4D98CB\" />\n<path class=\"p-149084\" d=\"M14.8986 3.82525V4.37255H12.9756V3.9389L13.9326 2.82635H13.0055V2.27905H14.8508V2.71271L13.8937 3.82525H14.8986Z\" fill=\"#4D98CB\" />\n<path class=\"p-149084\" d=\"M15.1045 2.27905H15.8103V4.37255H15.1045V2.27905Z\" fill=\"#4D98CB\" />\n<path class=\"p-149084\" d=\"M18.215 2.27905V4.37255H17.6348L16.8392 3.4215V4.37255H16.1514V2.27905H16.7316L17.5271 3.2301V2.27905H18.215Z\" fill=\"#4D98CB\" />\n<path class=\"p-149084\" d=\"M20.2963 3.8402V4.37255H18.5557V2.27905H20.2574V2.8114H19.2495V3.05664H20.1348V3.56506H19.2495V3.8402H20.2963Z\" fill=\"#4D98CB\" />\n<path class=\"p-9BBAD9\" d=\"M23.4062 28H1.98412C0.888242 28 0 27.1118 0 26.0159C0 24.9202 0.888242 24.032 1.98412 24.032H23.4062V28Z\" fill=\"#65B3E7\" />\n<path class=\"p-62739A\" d=\"M11.8125 24.032H23.4062V28H11.8125V24.032Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_books_magazine_result = browser_sprite_build_default.a.add(svg_cat_books_magazine_symbol);
/* harmony default export */ var svg_cat_books_magazine = (svg_cat_books_magazine_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-books-stationery.svg


var svg_cat_books_stationery_symbol = new browser_symbol_default.a({
  "id": "svg-cat-books-stationery",
  "use": "svg-cat-books-stationery-usage",
  "viewBox": "0 0 21 34",
  "content": "<symbol viewBox=\"0 0 21 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-books-stationery\">\n<path class=\"p-00D7DF\" d=\"M17.7209 6.1784L14.6317 5.88062L13.791 14.6024H16.9089L17.7209 6.1784Z\" fill=\"#65B3E7\" />\n<path class=\"p-CCF7F9\" d=\"M17.7202 6.17871L16.9082 14.6028H20.0335L20.8094 6.4765L17.7202 6.17871Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFE98F\" d=\"M20.8093 6.47632L18.3156 0L19.5637 3.24122L16.4714 2.94328L18.3156 0L14.6309 5.88074L17.7201 6.17853L20.8093 6.47632Z\" fill=\"#B9DFFC\" />\n<path class=\"p-565659\" d=\"M19.5639 3.24122L18.3158 0L16.4717 2.94328L19.5639 3.24122Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDA44\" d=\"M4.07271 0.675049L2.01465 2.01091L2.40454 3.51288L4.65758 2.92809L4.07271 0.675049Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9811\" d=\"M4.89566 8.47778L0.389648 9.64744L1.6698 14.6026H6.48547L4.89566 8.47778Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFDA44\" d=\"M6.48532 14.6028H11.295L9.40152 7.30835L4.89551 8.47801L6.48532 14.6028Z\" fill=\"#A1D1FD\" />\n<path class=\"p-565659\" d=\"M9.4019 7.30811L9.01202 5.80614L7.27393 4.88895L5.78437 2.63599L4.65785 2.92834L2.40481 3.51314L1.27829 3.80557L0.958391 6.05853L0 8.14538L0.389887 9.64744L4.8959 8.47777L9.4019 7.30811Z\" fill=\"#B9DFFC\" />\n<path class=\"p-CDCDD0\" d=\"M10.8523 29.3447C9.9952 29.3447 9.30047 28.65 9.30047 27.7929C9.30047 26.9359 9.9952 26.2412 10.8523 26.2412V22.3617C9.9952 22.3617 9.30047 21.6669 9.30047 20.8099C9.30047 19.9528 9.9952 19.2581 10.8523 19.2581V16.9304H0.765625V31.6724H10.8523V29.3447ZM4.6451 29.3447C3.78805 29.3447 3.09331 28.65 3.09331 27.7929C3.09331 26.9359 3.78805 26.2412 4.6451 26.2412C5.50215 26.2412 6.19689 26.9359 6.19689 27.7929C6.19689 28.65 5.50215 29.3447 4.6451 29.3447ZM4.6451 22.3617C3.78805 22.3617 3.09331 21.6669 3.09331 20.8099C3.09331 19.9528 3.78805 19.2581 4.6451 19.2581C5.50215 19.2581 6.19689 19.9528 6.19689 20.8099C6.19689 21.6669 5.50215 22.3617 4.6451 22.3617Z\" fill=\"#A1D1FD\" />\n<path class=\"p-ACABB1\" d=\"M10.8516 19.2581C11.7086 19.2581 12.4034 19.9528 12.4034 20.8099C12.4034 21.6669 11.7086 22.3617 10.8516 22.3617V26.2412C11.7086 26.2412 12.4034 26.9359 12.4034 27.7929C12.4034 28.65 11.7086 29.3447 10.8516 29.3447V31.6724H20.9382V16.9304H10.8516V19.2581ZM17.0587 19.2581C17.9158 19.2581 18.6105 19.9528 18.6105 20.8099C18.6105 21.6669 17.9158 22.3617 17.0587 22.3617C16.2017 22.3617 15.5069 21.6669 15.5069 20.8099C15.5069 19.9528 16.2017 19.2581 17.0587 19.2581ZM17.0587 26.2412C17.9158 26.2412 18.6105 26.9359 18.6105 27.7929C18.6105 28.65 17.9158 29.3447 17.0587 29.3447C16.2017 29.3447 15.5069 28.65 15.5069 27.7929C15.5069 26.9359 16.2017 26.2412 17.0587 26.2412Z\" fill=\"#65B3E7\" />\n<path class=\"p-565659\" d=\"M20.9385 16.9302L20.9385 15.6025C20.9385 15.0502 20.4908 14.6025 19.9385 14.6025L10.8519 14.6025L1.92913 14.6025C1.28636 14.6025 0.765291 15.1236 0.765291 15.7663L0.765291 16.9228C0.765291 16.9269 0.768593 16.9302 0.772665 16.9302L20.9385 16.9302Z\" fill=\"#4D98CB\" />\n<path class=\"p-565659\" d=\"M0.765625 31.6724V33C0.765625 33.5523 1.21334 34 1.76562 34H10.8522H19.9388C20.4911 34 20.9388 33.5523 20.9388 33V31.6724H10.8522H0.765625Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFFFFF\" d=\"M4.64456 22.3616C5.50159 22.3616 6.19635 21.6669 6.19635 20.8098C6.19635 19.9528 5.50159 19.2581 4.64456 19.2581C3.78753 19.2581 3.09277 19.9528 3.09277 20.8098C3.09277 21.6669 3.78753 22.3616 4.64456 22.3616Z\" fill=\"white\" />\n<path class=\"p-FFFFFF\" d=\"M10.8526 22.3616C11.7096 22.3616 12.4044 21.6669 12.4044 20.8098C12.4044 19.9528 11.7096 19.2581 10.8526 19.2581C9.99554 19.2581 9.30078 19.9528 9.30078 20.8098C9.30078 21.6669 9.99554 22.3616 10.8526 22.3616Z\" fill=\"white\" />\n<path class=\"p-FFFFFF\" d=\"M17.0596 22.3616C17.9166 22.3616 18.6114 21.6669 18.6114 20.8098C18.6114 19.9528 17.9166 19.2581 17.0596 19.2581C16.2026 19.2581 15.5078 19.9528 15.5078 20.8098C15.5078 21.6669 16.2026 22.3616 17.0596 22.3616Z\" fill=\"white\" />\n<path class=\"p-FFFFFF\" d=\"M4.64456 29.3448C5.50159 29.3448 6.19635 28.65 6.19635 27.793C6.19635 26.936 5.50159 26.2412 4.64456 26.2412C3.78753 26.2412 3.09277 26.936 3.09277 27.793C3.09277 28.65 3.78753 29.3448 4.64456 29.3448Z\" fill=\"white\" />\n<path class=\"p-FFFFFF\" d=\"M10.8526 29.3448C11.7096 29.3448 12.4044 28.65 12.4044 27.793C12.4044 26.936 11.7096 26.2412 10.8526 26.2412C9.99554 26.2412 9.30078 26.936 9.30078 27.793C9.30078 28.65 9.99554 29.3448 10.8526 29.3448Z\" fill=\"white\" />\n<path class=\"p-FFFFFF\" d=\"M17.0596 29.3448C17.9166 29.3448 18.6114 28.65 18.6114 27.793C18.6114 26.936 17.9166 26.2412 17.0596 26.2412C16.2026 26.2412 15.5078 26.936 15.5078 27.793C15.5078 28.65 16.2026 29.3448 17.0596 29.3448Z\" fill=\"white\" />\n</symbol>"
});
var svg_cat_books_stationery_result = browser_sprite_build_default.a.add(svg_cat_books_stationery_symbol);
/* harmony default export */ var svg_cat_books_stationery = (svg_cat_books_stationery_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-books-study.svg


var svg_cat_books_study_symbol = new browser_symbol_default.a({
  "id": "svg-cat-books-study",
  "use": "svg-cat-books-study-usage",
  "viewBox": "0 0 30 30",
  "content": "<symbol viewBox=\"0 0 30 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-books-study\">\n<path class=\"p-663325\" d=\"M17.7832 5.33203H16.0254C16.0254 4.83971 15.4923 4.45312 15 4.45312C14.5077 4.45312 13.9746 4.83971 13.9746 5.33203H12.2168C12.2168 3.87291 13.5409 2.69531 15 2.69531C16.4591 2.69531 17.7832 3.87291 17.7832 5.33203Z\" fill=\"#4D98CB\" />\n<path class=\"p-582B1F\" d=\"M27.0625 3.57422H29.1208C29.6062 3.57422 29.9997 3.96772 29.9997 4.45312C29.9997 4.93853 29.6062 5.33203 29.1208 5.33203H27.0625V3.57422Z\" fill=\"#4D98CB\" />\n<path class=\"p-663325\" d=\"M0 4.45312C0 3.96772 0.3935 3.57422 0.878906 3.57422H2.93724V5.33203H0.878906C0.3935 5.33203 0 4.93853 0 4.45312Z\" fill=\"#4D98CB\" />\n<path class=\"p-FAECD8\" d=\"M29.1211 25.6055C29.1211 27.5391 27.5391 29.1211 25.6055 29.1211H4.39453L2.63672 28.2422C2.84775 28.2422 3.51562 27.3104 3.51562 25.6055C3.51562 23.9003 2.84775 22.9688 2.63672 22.9688L4.39453 22.0898H25.6055C27.5391 22.0898 29.1211 23.6719 29.1211 25.6055Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F9D8B4\" d=\"M29.1211 25.6055C29.1211 27.5391 27.5391 29.1211 25.6055 29.1211H4.39453L2.63672 28.2422C2.84775 28.2422 3.51562 27.3104 3.51562 25.6055H29.1211Z\" fill=\"#A1D1FD\" />\n<path class=\"p-804231\" d=\"M30 25.6055C30 28.0312 28.0312 30 25.6055 30H0.878906C0.3935 30 0 29.6065 0 29.1211C0 28.6357 0.3935 28.2422 0.878906 28.2422H25.6055C27.0646 28.2422 28.2422 27.0644 28.2422 25.6055C28.2422 24.1463 27.0646 22.9688 25.6055 22.9688H0.878906C0.3935 22.9688 0 22.5753 0 22.0898C0 21.6044 0.3935 21.2109 0.878906 21.2109H25.6055C28.0312 21.2109 30 23.1798 30 25.6055Z\" fill=\"#5FBEFF\" />\n<path class=\"p-663325\" d=\"M30 25.6055C30 28.0312 28.0312 30 25.6055 30H0.878906C0.3935 30 0 29.6065 0 29.1211C0 28.6357 0.3935 28.2422 0.878906 28.2422H25.6055C27.0646 28.2422 28.2422 27.0644 28.2422 25.6055H30Z\" fill=\"#4D98CB\" />\n<path class=\"p-FAECD8\" d=\"M0.878906 16.8164C0.878906 18.75 2.46094 20.332 4.39453 20.332H25.6055L27.3633 19.4531C27.1523 19.4531 26.4844 18.5213 26.4844 16.8164C26.4844 15.1112 27.1523 14.1797 27.3633 14.1797L25.6055 13.3008H4.39453C2.46094 13.3008 0.878906 14.8828 0.878906 16.8164Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F9D8B4\" d=\"M0.878906 16.8164C0.878906 18.75 2.46094 20.332 4.39453 20.332H25.6055L27.3633 19.4531C27.1523 19.4531 26.4844 18.5213 26.4844 16.8164H0.878906Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF4B00\" d=\"M0 16.8164C0 19.2421 1.96884 21.2109 4.39453 21.2109H29.1211C29.6065 21.2109 30 20.8174 30 20.332C30 19.8466 29.6065 19.4531 29.1211 19.4531H4.39453C2.93541 19.4531 1.75781 18.2753 1.75781 16.8164C1.75781 15.3573 2.93541 14.1797 4.39453 14.1797H29.1211C29.6065 14.1797 30 13.7862 30 13.3008C30 12.8154 29.6065 12.4219 29.1211 12.4219H4.39453C1.96884 12.4219 0 14.3907 0 16.8164Z\" fill=\"#65B3E7\" />\n<path class=\"p-DD3400\" d=\"M0 16.8164C0 19.2421 1.96884 21.2109 4.39453 21.2109H29.1211C29.6065 21.2109 30 20.8174 30 20.332C30 19.8466 29.6065 19.4531 29.1211 19.4531H4.39453C2.93541 19.4531 1.75781 18.2753 1.75781 16.8164H0Z\" fill=\"#58ADE5\" />\n<path class=\"p-582B1F\" d=\"M17.7832 5.33203H16.0254C16.0254 4.83971 15.4923 4.45312 15 4.45312V2.69531C16.4591 2.69531 17.7832 3.87291 17.7832 5.33203Z\" fill=\"#4D98CB\" />\n<path class=\"p-663325\" d=\"M7.91016 12.4219C4.51813 12.4219 1.75781 9.60297 1.75781 6.21094C1.75781 2.81891 4.51813 0 7.91016 0C11.3022 0 14.0625 2.81891 14.0625 6.21094C14.0625 9.60297 11.3022 12.4219 7.91016 12.4219Z\" fill=\"#4D98CB\" />\n<path class=\"p-582B1F\" d=\"M22.0898 12.4219C18.6978 12.4219 15.9375 9.60297 15.9375 6.21094C15.9375 2.81891 18.6978 0 22.0898 0C25.4819 0 28.2422 2.81891 28.2422 6.21094C28.2422 9.60297 25.4819 12.4219 22.0898 12.4219Z\" fill=\"#4D98CB\" />\n<path class=\"p-FAECD8\" d=\"M7.91016 1.81641C5.48721 1.81641 3.51562 3.78799 3.51562 6.21094C3.51562 8.63388 5.48721 10.6641 7.91016 10.6641C10.3331 10.6641 12.3047 8.63388 12.3047 6.21094C12.3047 3.78799 10.3331 1.81641 7.91016 1.81641Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F9D8B4\" d=\"M22.0898 1.81641C19.6669 1.81641 17.6953 3.78799 17.6953 6.21094C17.6953 8.63388 19.6669 10.6641 22.0898 10.6641C24.5128 10.6641 26.4844 8.63388 26.4844 6.21094C26.4844 3.78799 24.5128 1.81641 22.0898 1.81641Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_books_study_result = browser_sprite_build_default.a.add(svg_cat_books_study_symbol);
/* harmony default export */ var svg_cat_books_study = (svg_cat_books_study_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cars-accessories.svg


var svg_cat_cars_accessories_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cars-accessories",
  "use": "svg-cat-cars-accessories-usage",
  "viewBox": "0 0 33 33",
  "content": "<symbol viewBox=\"0 0 33 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cars-accessories\">\n<path class=\"p-7C8388\" d=\"M19.4004 22.3757L18.4336 31.002H14.5664L13.5996 22.3757L16.5 21.334L19.4004 22.3757Z\" fill=\"#A1D1FD\" />\n<path class=\"p-7C8388\" d=\"M1.99805 15.7845V18.4336L10.6992 19.4004L12.6328 15.5332L10.6992 11.6113C8.93752 12.2827 11.2868 11.2307 1.99805 15.7845Z\" fill=\"#A1D1FD\" />\n<path class=\"p-575F64\" d=\"M22.3008 11.5981L20.3672 15.4992L22.3008 19.4004L31.002 18.4336V15.7846C23.7353 12.2719 24.3576 12.375 22.3008 11.5981Z\" fill=\"#58ADE5\" />\n<path class=\"p-575F64\" d=\"M16.5 21.334L19.4004 21.4838L18.4336 31.002H16.5V21.334Z\" fill=\"#58ADE5\" />\n<path class=\"p-575F64\" d=\"M16.5 0C7.43145 0 0 7.43145 0 16.5C0 25.5686 7.43145 33 16.5 33C25.5686 33 33 25.5686 33 16.5C33 7.43145 25.5686 0 16.5 0ZM16.5 29.0684C9.57767 29.0684 3.93164 23.4223 3.93164 16.5C3.93164 9.57767 9.57767 3.93164 16.5 3.93164C23.4223 3.93164 29.0684 9.57767 29.0684 16.5C29.0684 23.4223 23.4223 29.0684 16.5 29.0684Z\" fill=\"#65B3E7\" />\n<path class=\"p-32393F\" d=\"M33 16.5C33 25.5686 25.5686 33 16.5 33V29.0684C23.4223 29.0684 29.0684 23.4223 29.0684 16.5C29.0684 9.57767 23.4223 3.93164 16.5 3.93164V0C25.5686 0 33 7.43145 33 16.5Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M22.3008 11.5887V19.4004L19.4004 22.3757H13.5996L10.6992 19.4004V11.6079C12.5747 10.8925 14.5277 10.5444 16.5 10.5444C18.4723 10.5444 20.4445 10.8925 22.3008 11.5887Z\" fill=\"#65B3E7\" />\n<path class=\"p-32393F\" d=\"M22.3008 11.5887V19.4004L19.4004 22.3757H16.5V10.5444C18.4723 10.5444 20.4445 10.8925 22.3008 11.5887Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDA2D\" d=\"M16.5 12.7078C14.8951 12.7078 13.5996 14.0032 13.5996 15.6082C13.5996 17.2131 14.8951 18.5085 16.5 18.5085C18.1049 18.5085 19.4004 17.2131 19.4004 15.6082C19.4004 14.0032 18.1049 12.7078 16.5 12.7078Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FDBF00\" d=\"M16.5 18.5085V12.7078C18.1049 12.7078 19.4004 14.0032 19.4004 15.6082C19.4004 17.2131 18.1049 18.5085 16.5 18.5085Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_cars_accessories_result = browser_sprite_build_default.a.add(svg_cat_cars_accessories_symbol);
/* harmony default export */ var svg_cat_cars_accessories = (svg_cat_cars_accessories_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cars-cosmetics.svg


var svg_cat_cars_cosmetics_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cars-cosmetics",
  "use": "svg-cat-cars-cosmetics-usage",
  "viewBox": "0 0 21 33",
  "content": "<symbol viewBox=\"0 0 21 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cars-cosmetics\">\n<path class=\"p-FF4F1A\" d=\"M3.78906 0C2.68449 0 1.78906 0.895431 1.78906 2V4.80053H3.72266H7.95768H9.89127V2C9.89127 0.895429 8.99584 0 7.89127 0H3.78906Z\" fill=\"#B9DFFC\" />\n<path class=\"p-60DD4E\" d=\"M18.5122 12.8301L11.4849 4.83792C11.1027 4.40286 10.6051 4.09478 10.0579 3.94267C9.80203 3.87112 9.53584 3.83374 9.26514 3.83374H2.95518C1.3258 3.83374 0 5.15954 0 6.78892V33.0001H20.1152V17.0801C20.1152 15.5152 19.5461 14.0057 18.5122 12.8301ZM15.7504 17.9767C15.3489 18.3209 14.8558 18.4891 14.3653 18.4891C13.7653 18.4891 13.1691 18.2371 12.7475 17.7459L10.0579 14.6097L7.75178 11.9207C6.98607 11.028 7.0892 9.68351 7.98187 8.9178C8.57549 8.40927 9.36826 8.28423 10.0579 8.52013C10.406 8.63872 10.7276 8.84948 10.9847 9.14854L15.9805 14.9738C16.7462 15.8665 16.6431 17.211 15.7504 17.9767Z\" fill=\"#65B3E7\" />\n<path class=\"p-00BB64\" d=\"M20.1159 17.0801V33H10.0586V14.6096L12.7482 17.7459C13.1697 18.237 13.7659 18.4891 14.366 18.4891C14.8565 18.4891 15.3496 18.3208 15.7511 17.9767C16.6438 17.2109 16.7469 15.8665 15.9812 14.9738L10.9854 9.14851C10.7283 8.84944 10.4066 8.63868 10.0586 8.52009V3.94263C10.6058 4.09474 11.1034 4.40282 11.4856 4.83788L18.5129 12.8301C19.5467 14.0057 20.1159 15.5152 20.1159 17.0801Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF4F1A\" d=\"M20.1152 27.1338H0V29.0674H20.1152V27.1338Z\" fill=\"#B9DFFC\" />\n<path class=\"p-CA1C00\" d=\"M20.1159 27.1338H10.0586V29.0674H20.1159V27.1338Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_cars_cosmetics_result = browser_sprite_build_default.a.add(svg_cat_cars_cosmetics_symbol);
/* harmony default export */ var svg_cat_cars_cosmetics = (svg_cat_cars_cosmetics_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cars-covers.svg


var svg_cat_cars_covers_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cars-covers",
  "use": "svg-cat-cars-covers-usage",
  "viewBox": "0 0 25 18",
  "content": "<symbol viewBox=\"0 0 25 18\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cars-covers\">\n<path class=\"p-DE0418\" d=\"M0 3.57104V14.4288C0 16.4011 1.59887 18 3.57118 18H24.7078V3.57104H0Z\" fill=\"#5FBEFF\" />\n<path class=\"p-A3021A\" d=\"M0 14.4287C0 16.401 1.59887 17.9999 3.57118 17.9999H24.7078V10.7854H0V14.4287Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF6536\" d=\"M3.57118 0C1.59887 0 0 1.59887 0 3.57113V14.4289C0 12.4565 1.59887 10.8577 3.57118 10.8577C5.54349 10.8577 7.14236 12.4565 7.14236 14.4289V3.57113C7.14236 1.59887 5.54349 0 3.57118 0Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_cars_covers_result = browser_sprite_build_default.a.add(svg_cat_cars_covers_symbol);
/* harmony default export */ var svg_cat_cars_covers = (svg_cat_cars_covers_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cars-electronics.svg


var svg_cat_cars_electronics_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cars-electronics",
  "use": "svg-cat-cars-electronics-usage",
  "viewBox": "0 0 27 25",
  "content": "<symbol viewBox=\"0 0 27 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cars-electronics\">\n<path class=\"p-BBDCFF\" d=\"M3.17676 0H7.86426V3.95833H3.17676V0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-9ABADB\" d=\"M18.8018 0H23.4893V3.95833H18.8018V0Z\" fill=\"#65B3E7\" />\n<path class=\"p-E0F4FF\" d=\"M1.61426 2.34375H9.42676V6.25H1.61426V2.34375Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BBDCFF\" d=\"M17.2393 2.34375H25.0518V6.25H17.2393V2.34375Z\" fill=\"#A1D1FD\" />\n<path class=\"p-7C8388\" d=\"M26.6667 4.6355V7.7605L24.5209 9.323H4.599L0 7.7605V4.6355H26.6667Z\" fill=\"#58ADE5\" />\n<path class=\"p-7C8388\" d=\"M26.6667 21.823V25.0001H0V21.823L3.72396 20.2605H23.7083L26.6667 21.823Z\" fill=\"#58ADE5\" />\n<path class=\"p-575F64\" d=\"M26.6663 4.6355V7.7605L24.5205 9.323H13.333V4.6355H26.6663Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M23.708 20.2605L26.6663 21.823V25.0001H13.333V20.2605H23.708Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF5E5B\" d=\"M0 7.7605V21.823H26.6667V7.7605H0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-ED3E3C\" d=\"M13.333 7.7605H26.6663V21.823H13.333V7.7605Z\" fill=\"#A1D1FD\" />\n<path class=\"p-F7DC4D\" d=\"M15.6768 12.448V7.7605L8.64551 17.1355H12.5518V21.823L13.333 20.776L19.583 12.448H15.6768Z\" fill=\"#5FBEFF\" />\n<path class=\"p-F7DC4D\" d=\"M7.86426 15.573H6.30176V14.0105H4.73926V15.573H3.17676V17.1355H4.73926V18.698H6.30176V17.1355H7.86426V15.573Z\" fill=\"#5FBEFF\" />\n<path class=\"p-EDA637\" d=\"M18.8018 15.573H23.4893V17.1355H18.8018V15.573Z\" fill=\"#58ADE5\" />\n<path class=\"p-EDA637\" d=\"M19.583 12.448L13.333 20.776V10.8855L15.6768 7.7605V12.448H19.583Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_cars_electronics_result = browser_sprite_build_default.a.add(svg_cat_cars_electronics_symbol);
/* harmony default export */ var svg_cat_cars_electronics = (svg_cat_cars_electronics_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cars-parts.svg


var svg_cat_cars_parts_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cars-parts",
  "use": "svg-cat-cars-parts-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cars-parts\">\n<path class=\"p-7C8388\" d=\"M0 7.00796L2.97515 9.98311L6.18891 10.3937L9.82413 9.03592L10.3937 6.18891L9.98311 2.97515L7.00796 0L0 7.00796Z\" fill=\"#5FBEFF\" />\n<path class=\"p-575F64\" d=\"M25.8113 21.6062L22.351 22.3508L21.6064 25.811L22.0171 29.0248L24.9922 31.9999L32.0002 24.992L29.025 22.0168L25.8113 21.6062Z\" fill=\"#4D98CB\" />\n<path class=\"p-7C8388\" d=\"M24.9922 0L22.0171 2.97515L21.6064 6.18891L22.9643 9.82413L25.8113 10.3937L29.025 9.98311L32.0002 7.00796L24.9922 0Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M10.3937 25.811L9.64914 22.3508L6.18891 21.6062L2.97515 22.0168L0 24.992L7.00796 31.9999L9.98311 29.0248L10.3937 25.811Z\" fill=\"#5FBEFF\" />\n<path class=\"p-BBDCFF\" d=\"M20.2054 16.0001L25.8116 10.3938L21.6068 6.18896L16.0005 11.7952L10.3943 6.18896L6.18945 10.3938L11.7957 16.0001L6.18945 21.6063L10.3943 25.8111L16.0005 20.2049L21.6068 25.8111L25.8116 21.6063L20.2054 16.0001Z\" fill=\"#A1D1FD\" />\n<path class=\"p-94B4D7\" d=\"M25.8111 21.6063L21.6063 25.8111L16 20.2049V11.7952L21.6063 6.18896L25.8111 10.3938L20.2048 16.0001L25.8111 21.6063Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_cars_parts_result = browser_sprite_build_default.a.add(svg_cat_cars_parts_symbol);
/* harmony default export */ var svg_cat_cars_parts = (svg_cat_cars_parts_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-art.svg


var svg_cat_child_art_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-art",
  "use": "svg-cat-child-art-usage",
  "viewBox": "0 0 30 30",
  "content": "<symbol viewBox=\"0 0 30 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-art\">\n<path class=\"p-FF3C7D\" d=\"M23.4597 22.5L11.0244 21.3271L12.1972 29.9999H24.3941L23.4597 22.5Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFA2C1\" d=\"M0.93433 22.5L0 29.9999H12.1969V21.3271L0.93433 22.5Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EFE2DD\" d=\"M28.3838 2.49146H26.626V19.2565H28.3838V2.49146Z\" fill=\"#AFD9F6\" />\n<path class=\"p-09607D\" d=\"M6.41657 25.3711H4.54785V27.1289H6.41657V25.3711Z\" fill=\"#58ADE5\" />\n<path class=\"p-04303E\" d=\"M19.8453 25.3711H17.9766V27.1289H19.8453V25.3711Z\" fill=\"#4D98CB\" />\n<path class=\"p-04303E\" d=\"M27.5048 0L26.332 2.49162L27.5048 4.98325C28.8809 4.98325 29.9965 3.86769 29.9965 2.49162C29.9965 1.1155 28.8809 0 27.5048 0Z\" fill=\"#4D98CB\" />\n<path class=\"p-09607D\" d=\"M25.0137 2.49162C25.0137 3.86769 26.1292 4.98325 27.5053 4.98325V0C26.1292 0 25.0137 1.1155 25.0137 2.49162Z\" fill=\"#58ADE5\" />\n<path class=\"p-00CC76\" d=\"M12.1972 22.4997H23.4597L22.5254 14.9997L11.0244 13.8269L12.1972 22.4997Z\" fill=\"#76B7E2\" />\n<path class=\"p-CCFC5C\" d=\"M12.1961 13.8269L1.86798 14.9997L0.933594 22.4997H12.1961V13.8269Z\" fill=\"#5FBEFF\" />\n<path class=\"p-09607D\" d=\"M7.35114 17.8711H5.48242V19.6289H7.35114V17.8711Z\" fill=\"#58ADE5\" />\n<path class=\"p-04303E\" d=\"M18.9117 17.8711H17.043V19.6289H18.9117V17.8711Z\" fill=\"#4D98CB\" />\n<path class=\"p-2682FF\" d=\"M12.1972 14.9999H22.5254L21.591 7.49995L11.0244 6.32715L12.1972 14.9999Z\" fill=\"#4D98CB\" />\n<path class=\"p-8CBCFF\" d=\"M12.1973 6.32715L2.80347 7.49995L1.86914 14.9999H12.1973V6.32715Z\" fill=\"#58ADE5\" />\n<path class=\"p-09607D\" d=\"M8.28571 10.3711H6.41699V12.1289H8.28571V10.3711Z\" fill=\"#5FBEFF\" />\n<path class=\"p-04303E\" d=\"M17.9771 10.3711H16.1084V12.1289H17.9771V10.3711Z\" fill=\"#58ADE5\" />\n<path class=\"p-EFE2DD\" d=\"M21.591 7.49995L20.6567 0H12.1972L11.0244 3.74998L12.1972 7.49995H21.591Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFF5F5\" d=\"M12.1965 0H3.73712L2.80273 7.49995H12.1965V0Z\" fill=\"#AFD9F6\" />\n<path class=\"p-09607D\" d=\"M9.2193 2.87109H7.35059V4.6289H9.2193V2.87109Z\" fill=\"#58ADE5\" />\n<path class=\"p-04303E\" d=\"M17.0416 2.87109H15.1729V4.6289H17.0416V2.87109Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_child_art_result = browser_sprite_build_default.a.add(svg_cat_child_art_symbol);
/* harmony default export */ var svg_cat_child_art = (svg_cat_child_art_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-buggy.svg


var svg_cat_child_buggy_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-buggy",
  "use": "svg-cat-child-buggy-usage",
  "viewBox": "0 0 36 36",
  "content": "<symbol viewBox=\"0 0 36 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-buggy\">\n<path class=\"p-FFA2C1\" d=\"M20.462 0H15.8888L14.4814 12.0195L16.1762 12.3264L20.462 0Z\" fill=\"#65B3E7\" />\n<path class=\"p-B4D2D7\" d=\"M24.596 32.3567L25.5912 30.4968L18.1242 26.501L25.5912 22.5051L24.596 20.6453L15.8888 25.3047L14.4814 26.501L15.8888 27.6972L24.596 32.3567Z\" fill=\"#76B7E2\" />\n<path class=\"p-E1EBF0\" d=\"M6.18652 22.5051L13.6535 26.501L6.18652 30.4968L7.1818 32.3567L15.8889 27.6972V25.3047L7.1818 20.6453L6.18652 22.5051Z\" fill=\"#5FBEFF\" />\n<path class=\"p-09607D\" d=\"M31.7774 13.1835L29.668 14.9419V7.87744H35.9995V9.98682H31.7774V13.1835Z\" fill=\"#76B7E2\" />\n<path class=\"p-3440DB\" d=\"M31.7778 18.0001L14.4814 16.5928L15.8888 23.3338H31.7778V18.0001Z\" fill=\"#4D98CB\" />\n<path class=\"p-2682FF\" d=\"M0 18.0001V23.3338H15.889V16.5928L0 18.0001Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFC9D0\" d=\"M8.35757 0C3.74921 0 0 3.74921 0 8.35757V12.3264L15.889 12.0195V0H8.35757Z\" fill=\"#5FBEFF\" />\n<path class=\"p-3440DB\" d=\"M27.4925 33.1851V31.0757H15.8892L15.1855 32.1304L15.8892 33.1851H27.4925Z\" fill=\"#65B3E7\" />\n<path class=\"p-2682FF\" d=\"M15.8884 31.0757H4.28516V33.1851H15.8884V31.0757Z\" fill=\"#AFD9F6\" />\n<path class=\"p-EFE2DD\" d=\"M31.7778 11.4692H15.8888L14.4814 14.306L15.8888 18H31.7778V11.4692Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFF5F5\" d=\"M15.889 11.4692H0V18H15.889V11.4692Z\" fill=\"#B9DFFC\" />\n<path class=\"p-09607D\" d=\"M3.86945 28.261C1.73588 28.261 0 29.9968 0 32.1304C0 34.2641 1.73588 35.9999 3.86945 35.9999C6.00301 35.9999 7.73889 34.264 7.73889 32.1304C7.73889 29.9969 6.00308 28.261 3.86945 28.261Z\" fill=\"#76B7E2\" />\n<path class=\"p-04303E\" d=\"M27.9075 28.261C25.7739 28.261 24.0381 29.9969 24.0381 32.1304C24.0381 34.264 25.7739 35.9999 27.9075 35.9999C30.0412 35.9999 31.777 34.264 31.777 32.1304C31.777 29.9969 30.0412 28.261 27.9075 28.261Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_child_buggy_result = browser_sprite_build_default.a.add(svg_cat_child_buggy_symbol);
/* harmony default export */ var svg_cat_child_buggy = (svg_cat_child_buggy_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-clothes.svg


var svg_cat_child_clothes_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-clothes",
  "use": "svg-cat-child-clothes-usage",
  "viewBox": "0 0 35 34",
  "content": "<symbol viewBox=\"0 0 35 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-clothes\">\n<path class=\"p-0B799D\" d=\"M0 0V9.93917H7.17061L5.80452 0H0Z\" fill=\"#5FBEFF\" />\n<path class=\"p-07485E\" d=\"M29.1393 0L27.7734 9.93917H34.944V0H29.1393Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFA7B3\" d=\"M16.1064 1.36608L17.4725 34H21.2689C21.5517 29.6805 25.2849 28.4406 29.1402 26.9298V0H22.6135L16.1064 1.36608Z\" fill=\"#76B7E2\" />\n<path class=\"p-FFDECF\" d=\"M5.80469 0V26.9298C9.66006 28.4406 13.3932 29.6805 13.6761 34H17.4721V1.36608L12.3314 0H5.80469Z\" fill=\"#A1D1FD\" />\n<path class=\"p-07485E\" d=\"M17.4728 6.53022C20.3121 6.53022 22.6137 4.22835 22.6137 1.38901V0H17.4725L16.1064 2.74656L17.4728 6.53022Z\" fill=\"#4D98CB\" />\n<path class=\"p-0B799D\" d=\"M12.3311 0V1.38901C12.3311 4.22835 14.6327 6.52996 17.472 6.53022V0H12.3311Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF415B\" d=\"M17.4725 16.178L16.1064 19.287L17.4725 24.79C21.1133 24.79 24.0646 21.8387 24.0646 18.1979V16.1777L17.4725 16.178Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF8E8E\" d=\"M10.8809 16.1782V18.1982C10.8809 21.8389 13.8322 24.7902 17.4727 24.7902V16.1782H10.8809Z\" fill=\"#B9DFFC\" />\n</symbol>"
});
var svg_cat_child_clothes_result = browser_sprite_build_default.a.add(svg_cat_child_clothes_symbol);
/* harmony default export */ var svg_cat_child_clothes = (svg_cat_child_clothes_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-cosmetics.svg


var svg_cat_child_cosmetics_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-cosmetics",
  "use": "svg-cat-child-cosmetics-usage",
  "viewBox": "0 0 37 28",
  "content": "<symbol viewBox=\"0 0 37 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-cosmetics\">\n<path class=\"p-8CBCFF\" d=\"M25.788 10.9056C27.0586 10.9056 28.0887 9.87551 28.0887 8.60488C28.0887 7.33425 27.0586 6.3042 25.788 6.3042C24.5174 6.3042 23.4873 7.33425 23.4873 8.60488C23.4873 9.87551 24.5174 10.9056 25.788 10.9056Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF3C7D\" d=\"M18.4668 14.2437L17.0225 19.3861L36.9338 17.9418V14.2437H18.4668Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFA2C1\" d=\"M18.4671 14.2437H0V17.9418L18.4671 19.3861V14.2437Z\" fill=\"#58ADE5\" />\n<path class=\"p-DAC4BB\" d=\"M18.4668 28H28.1929C33.0205 28 36.934 24.0865 36.934 19.259V17.9419H18.4668L17.0225 22.9709L18.4668 28Z\" fill=\"#76B7E2\" />\n<path class=\"p-EFE2DD\" d=\"M0 17.9419V19.259C0 24.0866 3.91347 28 8.74104 28H18.4672V17.9419H0Z\" fill=\"#5FBEFF\" />\n<path class=\"p-8CBCFF\" d=\"M21.9177 3.45094C21.9177 1.54504 20.3727 0 18.4668 0L17.0225 3.45101L18.4668 6.90203C20.3727 6.90195 21.9177 5.35684 21.9177 3.45094Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BEEBFA\" d=\"M15.0166 3.45094C15.0166 5.35684 16.5616 6.90196 18.4675 6.90196V0C16.5616 0 15.0166 1.54504 15.0166 3.45094Z\" fill=\"#B9DFFC\" />\n</symbol>"
});
var svg_cat_child_cosmetics_result = browser_sprite_build_default.a.add(svg_cat_child_cosmetics_symbol);
/* harmony default export */ var svg_cat_child_cosmetics = (svg_cat_child_cosmetics_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-feeding.svg


var svg_cat_child_feeding_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-feeding",
  "use": "svg-cat-child-feeding-usage",
  "viewBox": "0 0 22 42",
  "content": "<symbol viewBox=\"0 0 22 42\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-feeding\">\n<path class=\"p-2682FF\" d=\"M19.9011 13.877C19.9011 9.72908 17.1428 6.22601 13.3606 5.10021V2.61622C13.3607 1.17132 12.1894 0 10.7445 0L9.10254 15.5189L19.9011 13.877Z\" fill=\"#65B3E7\" />\n<path class=\"p-8CBCFF\" d=\"M10.7446 0C9.29965 0 8.12833 1.17132 8.12833 2.61622V5.10021C4.34611 6.22601 1.58789 9.72908 1.58789 13.877L10.7446 15.5189V0Z\" fill=\"#AFD9F6\" />\n<path class=\"p-F4E2E2\" d=\"M1.58789 13.877V42H10.7446L12.3865 26.5527L10.7446 13.877H1.58789Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E3D0C9\" d=\"M10.7442 13.877V18.8594H5.51172V21.3203H10.7442V24.0917H5.51172V26.5527H10.7442V29.3242H5.51172V31.7851H10.7442V34.5566H5.51172V37.0176H10.7442V42H19.9008V13.877H10.7442Z\" fill=\"#A1D1FD\" />\n<path class=\"p-3440DB\" d=\"M21.4894 12.6465H9.8698L9.04883 13.877L9.8698 15.1074H21.4894V12.6465Z\" fill=\"#4D98CB\" />\n<path class=\"p-2682FF\" d=\"M10.7446 12.6465H0V15.1074H10.7446V12.6465Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_child_feeding_result = browser_sprite_build_default.a.add(svg_cat_child_feeding_symbol);
/* harmony default export */ var svg_cat_child_feeding = (svg_cat_child_feeding_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-furniture.svg


var svg_cat_child_furniture_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-furniture",
  "use": "svg-cat-child-furniture-usage",
  "viewBox": "0 0 31 28",
  "content": "<symbol viewBox=\"0 0 31 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-furniture\">\n<path class=\"p-F7B239\" d=\"M30.5221 20.34C30.0072 19.8243 29.1827 19.8049 28.6354 20.2867C28.2029 20.6674 27.7559 21.028 27.2968 21.3675L26.2128 18.9723L25.2961 16.9474C24.9807 17.1407 24.2096 16.1313 23.8702 16.2853C23.4231 16.4881 23.3996 17.839 22.9171 17.9667L23.9664 20.2851L25.0965 22.7813C22.1791 24.394 18.8867 25.2517 15.4633 25.2517C12.0399 25.2517 8.74741 24.394 5.83006 22.7813L6.96014 20.2851L8.0094 17.9667C7.60144 17.8587 8.00529 16.6089 7.62222 16.447C7.2084 16.2721 6.00988 17.1807 5.63043 16.9482L4.71369 18.9731L3.6297 21.3675C3.16973 21.0288 2.72353 20.6683 2.29026 20.2867C2.02672 20.0547 1.69855 19.9391 1.37195 19.9391C1.02034 19.9391 0.670309 20.0724 0.403569 20.34C-0.154978 20.8986 -0.131542 21.8145 0.460167 22.3375C4.61106 25.9994 9.8848 28 15.4633 28C21.0409 28 26.3147 25.9994 30.4656 22.3375C30.7719 22.0667 30.9263 21.6916 30.9263 21.3141C30.9263 20.9625 30.7921 20.61 30.5221 20.34Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E09B2D\" d=\"M25.2963 16.9472C23.8703 16.2852 22.4153 16.2043 22.9173 17.9666L23.9666 20.285C24.4306 20.0982 24.8751 19.8735 25.2963 19.6148C25.6156 19.4192 25.922 19.205 26.213 18.9722L25.2963 16.9472ZM4.71387 18.9729C5.00489 19.2049 5.31125 19.42 5.63054 19.6156C6.05167 19.8743 6.4963 20.0982 6.96032 20.2849L8.00958 17.9665C8.34989 15.9618 6.7332 15.5576 5.6306 16.948L4.71387 18.9729Z\" fill=\"#76B7E2\" />\n<path class=\"p-F7B239\" d=\"M3.53968 1.97729H2.32715V6.26803H3.53968V1.97729Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F7B239\" d=\"M28.5993 1.97729H27.3867V6.26803H28.5993V1.97729Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F7B239\" d=\"M23.5866 1.97729H22.374V6.26803H23.5866V1.97729Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F7B239\" d=\"M8.55139 1.97729H7.33887V6.26803H8.55139V1.97729Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F7B239\" d=\"M13.5641 1.97729H12.3516V6.26803H13.5641V1.97729Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F7B239\" d=\"M18.5748 1.97729H17.3623V6.26803H18.5748V1.97729Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E09B2D\" d=\"M3.53968 1.97729H2.32715V3.79935H3.53968V1.97729Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E09B2D\" d=\"M8.55139 1.97729H7.33887V3.79935H8.55139V1.97729Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E09B2D\" d=\"M13.5641 1.97729H12.3516V3.79935H13.5641V1.97729Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E09B2D\" d=\"M18.5748 1.97729H17.3623V3.79935H18.5748V1.97729Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E09B2D\" d=\"M23.5866 1.97729H22.374V3.79935H23.5866V1.97729Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E09B2D\" d=\"M28.5993 1.97729H27.3867V3.79935H28.5993V1.97729Z\" fill=\"#A1D1FD\" />\n<path class=\"p-2BA5F7\" d=\"M5.63076 16.948C3.044 15.3645 1.31738 12.5118 1.31738 9.25571V6.87112C1.31738 6.11209 1.93271 5.49683 2.69167 5.49683H2.93407H7.94589H12.9577H17.9695H22.9814H27.9932H28.2356C28.9946 5.49683 29.6099 6.11215 29.6099 6.87112V9.25571C29.6099 12.5118 27.884 15.3637 25.2965 16.9473C24.5657 17.3951 23.7663 17.7419 22.9175 17.9666C22.177 18.1638 21.3994 18.2689 20.5967 18.2689H10.3298C9.52785 18.2689 8.75022 18.1638 8.0098 17.9666C7.16101 17.7418 6.36152 17.3959 5.63076 16.948Z\" fill=\"#5FBEFF\" />\n<path class=\"p-2197D8\" d=\"M12.9731 16.948C10.3863 15.3645 8.65972 12.5118 8.65972 9.25571V5.49683H2.93407H2.69167C1.93265 5.49683 1.31738 6.11215 1.31738 6.87112V9.25571C1.31738 12.5118 3.044 15.3645 5.63076 16.948C6.36152 17.3959 7.16096 17.7419 8.00974 17.9666C8.75022 18.1638 9.52785 18.2689 10.3297 18.2689H16.8362C16.0343 18.2689 16.0925 18.1638 15.3521 17.9666C14.5033 17.7418 13.7039 17.3959 12.9731 16.948Z\" fill=\"#4D98CB\" />\n<path class=\"p-F95428\" d=\"M18.2826 9.95576C18.9964 10.6688 18.9964 11.8255 18.2826 12.5385L15.4631 15.3588L12.6427 12.5385C12.2862 12.182 12.1084 11.7148 12.1084 11.2475C12.1084 10.7795 12.2862 10.3123 12.6427 9.95576C13.3557 9.24277 14.5124 9.24277 15.2254 9.95576L15.4631 10.1926L15.7 9.95576C16.0565 9.59927 16.5237 9.42065 16.9909 9.42065C17.4589 9.42065 17.9262 9.59927 18.2826 9.95576Z\" fill=\"#4D98CB\" />\n<path class=\"p-F7B239\" d=\"M29.128 0C29.8862 0 30.5022 0.615145 30.5022 1.37423C30.5022 1.75417 30.3486 2.09689 30.0996 2.34587C29.8506 2.59485 29.5071 2.74846 29.128 2.74846H27.9931H22.9812H17.9694H12.9576H7.94577H2.93395H1.79904C1.04001 2.74846 0.424805 2.13332 0.424805 1.37423C0.424805 0.994295 0.57841 0.651568 0.827391 0.402586C1.07637 0.153605 1.4191 0 1.79904 0H29.128Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E09B2D\" d=\"M7.12627 1.37423C7.12627 0.994295 7.27988 0.651568 7.52886 0.402586C7.77784 0.153605 8.12057 0 8.5005 0H1.79904C1.4191 0 1.07637 0.153605 0.827391 0.402586C0.57841 0.651568 0.424805 0.994295 0.424805 1.37423C0.424805 2.13325 1.03995 2.74846 1.79904 2.74846H2.93395H8.50056C7.74142 2.74846 7.12627 2.13332 7.12627 1.37423Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_child_furniture_result = browser_sprite_build_default.a.add(svg_cat_child_furniture_symbol);
/* harmony default export */ var svg_cat_child_furniture = (svg_cat_child_furniture_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-gloves.svg


var svg_cat_child_gloves_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-gloves",
  "use": "svg-cat-child-gloves-usage",
  "viewBox": "0 0 38 32",
  "content": "<symbol viewBox=\"0 0 38 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-gloves\">\n<path class=\"p-E8F4FC\" d=\"M32.9944 6.9152C29.6531 5.94869 26.161 7.87364 25.1946 11.215L24.5537 14.3715C23.8843 13.5237 22.6814 12.3178 21.7043 12.8563C20.6165 13.456 20.2207 14.8242 20.8205 15.912L22.798 19.4995L20.1943 28.5002L32.2939 32.0003L37.2941 14.7151C38.2606 11.3739 36.3356 7.88178 32.9944 6.9152Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E59278\" d=\"M22.7965 19.4995L20.819 15.912C20.2192 14.8242 20.615 13.456 21.7028 12.8563C22.6798 12.3178 23.8827 13.5237 24.5522 14.3714L25.1931 11.215C26.1595 7.87364 29.6517 5.94869 32.9929 6.9152C36.3342 7.8817 38.2592 11.3739 37.2927 14.715L34.3174 24.9998L22.2178 21.4998L22.7965 19.4995Z\" fill=\"#58ADE5\" />\n<path class=\"p-DF6246\" d=\"M32.9933 6.91515C36.3346 7.88166 38.2596 11.3739 37.2931 14.715L34.3178 24.9997L27.9678 23.1629L32.6166 6.81982C32.7423 6.84798 32.8678 6.87885 32.9933 6.91515Z\" fill=\"#4D98CB\" />\n<path d=\"M32.9938 6.91465C32.913 6.89126 32.832 6.87109 32.751 6.85107C32.8319 6.87065 32.9128 6.89133 32.9938 6.91465Z\" fill=\"#D1E5F5\" />\n<path class=\"p-D1E5F5\" d=\"M34.3186 24.9993L37.2938 14.7146L32.2935 31.9998L25.9746 30.1718L27.9686 23.1624L34.3186 24.9993Z\" fill=\"#A1D1FD\" />\n<path class=\"p-D1E5F5\" d=\"M4.54942 0.249669C7.89074 -0.716839 11.3828 1.20811 12.3492 4.5495L12.9901 7.70592C13.6595 6.85813 14.8625 5.65225 15.8395 6.19075C16.9273 6.79048 17.3231 8.15867 16.7234 9.24646L14.7458 12.8339L17.3495 21.8347L5.24983 25.3348L0.249664 8.04956C-0.716844 4.7084 1.20818 1.21632 4.54942 0.249669Z\" fill=\"#A1D1FD\" />\n<path class=\"p-DF6246\" d=\"M14.7458 12.8339L16.7233 9.24646C17.323 8.15867 16.9273 6.79048 15.8394 6.19075C14.8624 5.65232 13.6594 6.85813 12.99 7.70592L12.3492 4.5495C11.3827 1.20811 7.89052 -0.716839 4.54935 0.249669C1.20818 1.21632 -0.716844 4.70839 0.249665 8.04956L3.22479 18.3342L15.3244 14.8342L14.7458 12.8339Z\" fill=\"#4D98CB\" />\n<path class=\"p-E59278\" d=\"M4.54942 0.249547C1.20818 1.2162 -0.716844 4.70827 0.249664 8.04944L3.22479 18.3341L9.57481 16.4972L4.92602 0.154297C4.80034 0.182454 4.67481 0.213324 4.54942 0.249547Z\" fill=\"#58ADE5\" />\n<path d=\"M4.5498 0.249853C4.63061 0.226462 4.71164 0.206297 4.79266 0.186279C4.71164 0.205857 4.63076 0.226535 4.5498 0.249853Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E8F4FC\" d=\"M3.2252 18.3345L0.25 8.0498L5.25017 25.3351L11.5692 23.5071L9.57522 16.4976L3.2252 18.3345Z\" fill=\"#B9DFFC\" />\n</symbol>"
});
var svg_cat_child_gloves_result = browser_sprite_build_default.a.add(svg_cat_child_gloves_symbol);
/* harmony default export */ var svg_cat_child_gloves = (svg_cat_child_gloves_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-outwear.svg


var svg_cat_child_outwear_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-outwear",
  "use": "svg-cat-child-outwear-usage",
  "viewBox": "0 0 37 37",
  "content": "<symbol viewBox=\"0 0 37 37\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-outwear\">\n<path class=\"p-F8E99B\" d=\"M8.60547 6.02327C8.60547 2.69659 12.8432 0 18.0706 0C23.2981 0 27.5357 2.69659 27.5357 6.02327V11.1861H8.60547V6.02327Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F5DC60\" d=\"M27.5354 6.02327V11.1861H18.0703V0C23.2978 0 27.5354 2.69659 27.5354 6.02327Z\" fill=\"#A1D1FD\" />\n<path class=\"p-99A1EA\" d=\"M27.5357 6.02344H8.60547V11.1862H27.5357V6.02344Z\" fill=\"#58ADE5\" />\n<path class=\"p-717AE1\" d=\"M27.5354 6.02344H18.0703V11.1862H27.5354V6.02344Z\" fill=\"#4D98CB\" />\n<path class=\"p-F8E99B\" d=\"M0 15.4886L8.60467 6.02344L18.0698 10.8884L27.5349 6.02344L36.1396 15.4886L35.2791 19.7908L28.3954 14.0655L30.1163 32.9957L18.0698 37.0002L6.02327 32.9957L7.7442 14.0655L0.860467 19.7908L0 15.4886Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F5DC60\" d=\"M27.5354 6.02344L36.1401 15.4886L35.2797 19.7908L28.3959 14.0655L30.1168 32.9957L18.0703 37.0002V10.8884L27.5354 6.02344Z\" fill=\"#A1D1FD\" />\n<path class=\"p-58575D\" d=\"M22.803 17.6396C21.854 17.6396 21.082 16.8676 21.082 15.9187C21.082 14.9698 21.854 14.1978 22.803 14.1978C23.7519 14.1978 24.5239 14.9698 24.5239 15.9187C24.5239 16.8676 23.7519 17.6396 22.803 17.6396Z\" fill=\"#4D98CB\" />\n<path class=\"p-58575D\" d=\"M22.803 23.6624H22.8026C21.854 23.6624 21.082 22.8905 21.082 21.9416C21.082 20.9927 21.854 20.2207 22.803 20.2207C23.752 20.2207 24.5239 20.9927 24.5239 21.9416C24.5239 22.8906 23.7519 23.6624 22.803 23.6624Z\" fill=\"#4D98CB\" />\n<path class=\"p-58575D\" d=\"M22.803 29.6859H22.8026C21.854 29.6859 21.082 28.9139 21.082 27.9651C21.082 27.0162 21.854 26.2441 22.803 26.2441C23.752 26.2441 24.5239 27.0162 24.5239 27.9651C24.5239 28.914 23.7519 29.6859 22.803 29.6859Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_child_outwear_result = browser_sprite_build_default.a.add(svg_cat_child_outwear_symbol);
/* harmony default export */ var svg_cat_child_outwear = (svg_cat_child_outwear_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-safe.svg


var svg_cat_child_safe_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-safe",
  "use": "svg-cat-child-safe-usage",
  "viewBox": "0 0 23 38",
  "content": "<symbol viewBox=\"0 0 23 38\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-safe\">\n<path class=\"p-04303E\" d=\"M21.2725 0H18.9941V15.7202H21.2725V0Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF3939\" d=\"M11.0162 38.0001H16.3329C19.4807 38.0001 22.0324 35.4484 22.0324 32.3006L9.49609 30.7805L11.0162 38.0001Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M0 32.3006C0 35.4484 2.55176 38.0001 5.69951 38.0001H11.0162V30.7805L0 32.3006Z\" fill=\"#58ADE5\" />\n<path class=\"p-DDC2B7\" d=\"M11.0162 6.47144L9.49609 20.2806L11.0162 33.1842H22.0324V17.4877C22.0324 11.4133 17.0906 6.47144 11.0162 6.47144Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFE9E0\" d=\"M11.0162 6.47144C4.94187 6.47144 0 11.4133 0 17.4877V33.1842H11.0162V6.47144Z\" fill=\"#B9DFFC\" />\n<path class=\"p-04303E\" d=\"M16.7167 14.5811H14.4365V16.8594H16.7167V14.5811Z\" fill=\"#4D98CB\" />\n<path class=\"p-09607D\" d=\"M12.1561 14.5811H9.87598V16.8594H12.1561V14.5811Z\" fill=\"#58ADE5\" />\n<path class=\"p-09607D\" d=\"M7.59657 14.5811H5.31641V16.8594H7.59657V14.5811Z\" fill=\"#58ADE5\" />\n<path class=\"p-04303E\" d=\"M16.7167 19.1414H14.4365V21.4197H16.7167V19.1414Z\" fill=\"#4D98CB\" />\n<path class=\"p-04303E\" d=\"M16.7167 23.7017H14.4365V25.98H16.7167V23.7017Z\" fill=\"#4D98CB\" />\n<path class=\"p-09607D\" d=\"M12.1561 19.1414H9.87598V21.4197H12.1561V19.1414Z\" fill=\"#58ADE5\" />\n<path class=\"p-09607D\" d=\"M7.59657 19.1414H5.31641V21.4197H7.59657V19.1414Z\" fill=\"#58ADE5\" />\n<path class=\"p-09607D\" d=\"M12.1561 23.7017H9.87598V25.98H12.1561V23.7017Z\" fill=\"#58ADE5\" />\n<path class=\"p-09607D\" d=\"M7.59657 23.7017H5.31641V25.98H7.59657V23.7017Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_child_safe_result = browser_sprite_build_default.a.add(svg_cat_child_safe_symbol);
/* harmony default export */ var svg_cat_child_safe = (svg_cat_child_safe_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-shoes.svg


var svg_cat_child_shoes_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-shoes",
  "use": "svg-cat-child-shoes-usage",
  "viewBox": "0 0 35 22",
  "content": "<symbol viewBox=\"0 0 35 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-shoes\">\n<path class=\"p-FF648D\" d=\"M30.5977 12.9144C25.8737 11.8647 21.4387 9.76505 18.3794 7.06639C17.7455 6.50712 17.0862 5.82943 16.44 5.10745L13.8533 1.94554C13.5948 1.60536 13.3521 1.27975 13.1305 0.977872C12.3489 -0.0870715 10.853 -0.318266 9.7878 0.462887L2.8686 5.53699C1.5579 6.49814 0.784589 8.02707 0.787116 9.65241L0.797954 16.7783L8.14085 19.9549H23.0444L32.9997 16.7782C32.9997 16.7782 34.3358 13.745 30.5977 12.9144Z\" fill=\"#65B3E7\" />\n<path class=\"p-FD387E\" d=\"M30.5984 12.9143C25.8743 11.8645 21.4394 9.76491 18.38 7.06625C17.9355 6.67414 17.4786 6.22299 17.0225 5.73999V19.9548H23.0449L33.0003 16.7781C33.0003 16.7781 34.3364 13.7449 30.5984 12.9143Z\" fill=\"#58ADE5\" />\n<path class=\"p-EBECEC\" d=\"M22.4469 9.88123C21.7858 9.51798 21.1511 9.13352 20.5487 8.72925L18.9186 11.3306C18.593 11.8501 18.7503 12.5352 19.2698 12.8608C19.7893 13.1863 20.4744 13.0291 20.8 12.5095L22.4469 9.88123Z\" fill=\"#4D98CB\" />\n<path class=\"p-EBECEC\" d=\"M16.4248 11.1326C16.9469 11.454 17.6307 11.2913 17.9521 10.7693L19.6151 8.06813C19.1826 7.74451 18.7699 7.41032 18.38 7.06635C18.2206 6.92565 18.0595 6.77751 17.8975 6.62305L16.0615 9.6053C15.7401 10.1274 15.9027 10.8112 16.4248 11.1326Z\" fill=\"#4D98CB\" />\n<path class=\"p-EBECEC\" d=\"M25.5817 11.3614C24.8803 11.0791 24.1964 10.7741 23.5349 10.448L21.9142 13.0493C21.59 13.5697 21.749 14.2544 22.2694 14.5786C22.7898 14.9028 23.4744 14.7437 23.7986 14.2234L25.5817 11.3614Z\" fill=\"#4D98CB\" />\n<path class=\"p-EBECEC\" d=\"M11.7729 18.3809L4.27911 14.2702C3.25373 13.6018 2.6416 12.4719 2.6416 11.2479C2.6416 9.77958 4.4144 8.47047 5.77185 7.91154L9.85927 6.20142L10.7162 8.24958L6.61876 9.96403C6.09573 10.1786 4.86185 10.6826 4.86185 11.2479C4.86185 11.7154 5.09411 12.1473 5.48356 12.405L12.947 16.4966L11.7729 18.3809Z\" fill=\"#B9DFFC\" />\n<path class=\"p-C7EAF0\" d=\"M34.0441 18.5312C34.0441 19.3604 33.5268 20.1013 32.7483 20.3871C29.8408 21.4541 26.7677 22.0002 23.6705 22.0002H3.13286C1.40259 22.0002 0 20.5974 0 18.8672C0 17.137 1.40259 15.7344 3.13286 15.7344H9.18068C11.2342 15.7344 13.2811 15.9641 15.2836 16.4192L16.9195 16.791C19.9249 17.474 23.0245 17.6414 26.086 17.2858L30.5595 16.7663C30.9518 16.7207 31.3407 16.6514 31.7298 16.5828C32.9097 16.3742 34.0441 17.2801 34.0441 18.5312Z\" fill=\"#FD387E\" />\n<path class=\"p-C7EAF0\" d=\"M34.0441 18.5312C34.0441 19.3604 33.5268 20.1013 32.7483 20.3871C29.8407 21.4541 26.7677 22.0002 23.6705 22.0002H3.13286C1.40259 22.0002 0 20.5974 0 18.8672C0 17.137 1.40259 15.7344 3.13286 15.7344H9.18068C11.2342 15.7344 13.2811 15.9641 15.2836 16.4192L16.9195 16.791C19.9249 17.474 23.0245 17.6414 26.086 17.2858L30.5595 16.7663C30.9518 16.7207 31.3407 16.6514 31.7298 16.5828C32.9097 16.3742 34.0441 17.2801 34.0441 18.5312Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BB2A5C\" d=\"M9.89232 9.58653L15.4491 5.78551C16.3768 5.15092 16.6145 3.8844 15.9799 2.95667C15.3453 2.02895 14.0788 1.79132 13.151 2.42591L7.59425 6.22693L9.89232 9.58653Z\" fill=\"#4D98CB\" />\n<path class=\"p-88DEE0\" d=\"M32.626 16.5821C32.237 16.6508 30.9522 16.7202 30.5598 16.7657L26.0863 17.2852C23.0596 17.6368 19.9958 17.4763 17.0225 16.8126V21.9997H23.6709C26.7681 21.9997 29.8411 21.4536 32.7487 20.3866C33.5272 20.1009 34.0445 19.3599 34.0445 18.5307C34.0445 17.2797 33.806 16.3737 32.626 16.5821Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_child_shoes_result = browser_sprite_build_default.a.add(svg_cat_child_shoes_symbol);
/* harmony default export */ var svg_cat_child_shoes = (svg_cat_child_shoes_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-textile.svg


var svg_cat_child_textile_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-textile",
  "use": "svg-cat-child-textile-usage",
  "viewBox": "0 0 24 32",
  "content": "<symbol viewBox=\"0 0 24 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-textile\">\n<path class=\"p-E57E25\" d=\"M2.11187 13.5163C2.40354 13.5163 2.63983 13.28 2.63983 12.9883V11.4039C2.64388 7.9057 5.47887 5.07071 8.97709 5.06667H14.2579C17.7564 5.07071 20.5912 7.9057 20.5952 11.4039V12.9883C20.5952 13.28 20.8317 13.5163 21.1234 13.5163C21.4151 13.5163 21.6514 13.28 21.6514 12.9883V11.4039C21.6469 7.32259 18.3395 4.01525 14.2579 4.0105H8.97709C4.89575 4.01525 1.58818 7.32259 1.58366 11.4039V12.9883C1.58366 13.28 1.82019 13.5163 2.11187 13.5163Z\" fill=\"#76B7E2\" />\n<path class=\"p-F18D46\" d=\"M11.6184 5.06678L16.1572 4.22468C17.3237 4.22468 18.2695 3.27905 18.2695 2.11234C18.2695 0.94587 17.3237 0 16.1572 0C13.746 0 11.2166 4.16133 11.146 4.30253C11.064 4.46631 11.0728 4.66077 11.1691 4.81647C11.2654 4.97217 11.4353 5.06702 11.6184 5.06678ZM16.1572 1.05617C16.7403 1.05617 17.2134 1.52899 17.2134 2.11234C17.2134 2.69569 16.7403 3.16851 16.1572 3.16851L12.5436 4.01061C13.1628 3.08542 15.0535 1.05617 16.1572 1.05617Z\" fill=\"#76B7E2\" />\n<path class=\"p-F1995B\" d=\"M7.07858 4.22468L11.6174 5.06678C11.8004 5.06702 11.9704 4.97217 12.0667 4.81647C12.163 4.66077 12.1715 4.46631 12.0897 4.30253C12.0191 4.16133 9.48949 0 7.07858 0C5.91187 0 4.96624 0.94587 4.96624 2.11234C4.96624 3.27905 5.91187 4.22468 7.07858 4.22468ZM10.6936 4.01061L7.07858 3.16851C6.49523 3.16851 6.02241 2.69569 6.02241 2.11234C6.02241 1.52899 6.49523 1.05617 7.07858 1.05617C8.18634 1.05617 10.0758 3.08566 10.6936 4.01061Z\" fill=\"#76B7E2\" />\n<path class=\"p-F18D46\" d=\"M16.1566 9.29157C16.4483 9.29157 16.6846 9.05504 16.6846 8.76336C16.6846 8.47169 16.4483 8.2354 16.1566 8.2354C13.9889 8.2354 12.1396 4.44883 12.1301 4.41056C12.0863 4.22514 11.9463 4.07752 11.7635 4.02451C11.5805 3.97126 11.3832 4.02047 11.247 4.15359C11.1107 4.28671 11.0565 4.48283 11.1055 4.66682C11.1526 4.85556 13.1386 9.29157 16.1566 9.29157Z\" fill=\"#76B7E2\" />\n<path class=\"p-F18D46\" d=\"M7.07859 9.29145C10.0966 9.29145 12.0826 4.85545 12.1297 4.6667C12.1977 4.38501 12.0258 4.10094 11.7446 4.03058C11.4634 3.96021 11.1779 4.12947 11.1051 4.41021C11.0954 4.44824 9.27389 8.23528 7.07859 8.23528C6.78691 8.23528 6.55039 8.47157 6.55039 8.76325C6.55039 9.05493 6.78691 9.29145 7.07859 9.29145Z\" fill=\"#76B7E2\" />\n<path class=\"p-F0C419\" d=\"M22.1811 12.9885H1.05726C0.473906 12.9885 0.000852585 13.4613 0.000852585 14.0447V20.382C0.000852585 23.4632 1.22509 26.4183 3.40375 28.5972C5.58265 30.7761 8.53769 32.0001 11.6192 32.0001C18.0356 32.0001 23.2373 26.7984 23.2373 20.382V14.0447C23.2373 13.4613 22.7645 12.9885 22.1811 12.9885Z\" fill=\"#5FBEFF\" />\n<path class=\"p-C03A2B\" d=\"M11.6188 19.5255L11.529 19.433C11.1377 19.027 10.5983 18.7976 10.0345 18.7976C9.4706 18.7976 8.93122 19.027 8.53994 19.433C7.71602 20.2921 7.71602 21.6481 8.53994 22.5072L8.63503 22.6051L11.529 25.5815C11.5561 25.6115 11.5863 25.6388 11.6188 25.6628C11.6514 25.6388 11.6814 25.6115 11.7085 25.5815L14.6026 22.6051L14.6975 22.5074C15.5214 21.6483 15.5214 20.2924 14.6975 19.4333C14.3064 19.0272 13.7668 18.7978 13.203 18.7978C12.6393 18.7978 12.0997 19.0272 11.7085 19.4333L11.6188 19.5255Z\" fill=\"#4D98CB\" />\n<path class=\"p-F3D55B\" d=\"M-0.000180244 14.0447V20.382C-0.000180244 23.4632 1.22405 26.4183 3.40272 28.5972C5.58162 30.7761 8.53666 32.0001 11.6182 32.0001V25.6628C11.5856 25.6395 11.5556 25.6129 11.5283 25.5836L8.63436 22.6051L8.53927 22.5048C7.71535 21.6459 7.71535 20.2902 8.53927 19.4313C8.93103 19.0263 9.4704 18.7976 10.0338 18.7976C10.5972 18.7976 11.1366 19.0263 11.5283 19.4313L11.6182 19.5264V12.9885H1.05623C0.473586 12.9902 0.00172138 13.4621 -0.000180244 14.0447Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E64C3C\" d=\"M8.53927 22.5048L8.63436 22.6051L11.5283 25.5837C11.5556 25.6129 11.5856 25.6395 11.6182 25.6628V19.5264L11.5283 19.4314C11.1366 19.0263 10.5972 18.7976 10.0338 18.7976C9.4704 18.7976 8.93103 19.0263 8.53927 19.4314C7.71535 20.2902 7.71535 21.6459 8.53927 22.5048Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E57E25\" d=\"M21.1234 16.1569C21.4151 16.1569 21.6514 15.9206 21.6514 15.6289V15.1007C21.6514 14.809 21.4151 14.5728 21.1234 14.5728H20.5952C20.3035 14.5728 20.0672 14.809 20.0672 15.1007C20.0672 15.3924 20.3035 15.6289 20.5952 15.6289C20.5952 15.9206 20.8317 16.1569 21.1234 16.1569Z\" fill=\"#4D98CB\" />\n<path class=\"p-E57E25\" d=\"M4.75283 15.6289H5.80924C6.10068 15.6289 6.3372 15.3924 6.3372 15.1007C6.3372 14.809 6.10068 14.5728 5.80924 14.5728H4.75283C4.46115 14.5728 4.22486 14.809 4.22486 15.1007C4.22486 15.3924 4.46115 15.6289 4.75283 15.6289ZM7.92158 15.6289H8.97775C9.26942 15.6289 9.50571 15.3924 9.50571 15.1007C9.50571 14.809 9.26942 14.5728 8.97775 14.5728H7.92158C7.6299 14.5728 7.39337 14.809 7.39337 15.1007C7.39337 15.3924 7.6299 15.6289 7.92158 15.6289ZM11.0901 15.6289H12.1463C12.4379 15.6289 12.6745 15.3924 12.6745 15.1007C12.6745 14.809 12.4379 14.5728 12.1463 14.5728H11.0901C10.7984 14.5728 10.5621 14.809 10.5621 15.1007C10.5621 15.3924 10.7984 15.6289 11.0901 15.6289ZM14.2586 15.6289H15.315C15.6067 15.6289 15.843 15.3924 15.843 15.1007C15.843 14.809 15.6067 14.5728 15.315 14.5728H14.2586C13.9672 14.5728 13.7306 14.809 13.7306 15.1007C13.7306 15.3924 13.9672 15.6289 14.2586 15.6289ZM17.4273 15.6289H18.4835C18.7752 15.6289 19.0117 15.3924 19.0117 15.1007C19.0117 14.809 18.7752 14.5728 18.4835 14.5728H17.4273C17.1357 14.5728 16.8991 14.809 16.8991 15.1007C16.8991 15.3924 17.1357 15.6289 17.4273 15.6289Z\" fill=\"#4D98CB\" />\n<path class=\"p-E57E25\" d=\"M2.11278 16.1569C2.40445 16.1569 2.64074 15.9206 2.64074 15.6289C2.93242 15.6289 3.16895 15.3924 3.16895 15.1007C3.16895 14.809 2.93242 14.5728 2.64074 14.5728H2.11278C1.8211 14.5728 1.58457 14.809 1.58457 15.1007V15.6289C1.58457 15.9206 1.8211 16.1569 2.11278 16.1569Z\" fill=\"#4D98CB\" />\n<path class=\"p-E57E25\" d=\"M12.6415 30.3608C12.6605 30.3608 12.6795 30.3599 12.6986 30.3577C13.0608 30.319 13.421 30.2603 13.7771 30.182C13.9632 30.1431 14.1141 30.0073 14.1722 29.8264C14.2302 29.6453 14.1867 29.447 14.0578 29.3073C13.9292 29.1675 13.7352 29.1076 13.55 29.1506C13.2317 29.2205 12.9099 29.273 12.5859 29.3077C12.307 29.3379 12.1005 29.5806 12.1152 29.8607C12.1299 30.1404 12.3612 30.3601 12.6415 30.3608ZM10.5767 30.3589C10.8572 30.3589 11.0887 30.1393 11.104 29.8592C11.1189 29.579 10.9124 29.3358 10.6333 29.3056C10.3093 29.2702 9.98765 29.2169 9.66934 29.1463C9.48393 29.1016 9.28852 29.1606 9.15849 29.3006C9.0287 29.4404 8.98449 29.6396 9.04296 29.8214C9.10144 30.003 9.25334 30.1393 9.44042 30.1773C9.79628 30.2564 10.1559 30.3159 10.5182 30.3558C10.5377 30.3577 10.5572 30.3589 10.5767 30.3589ZM15.6215 29.5312C15.6985 29.5312 15.7748 29.5143 15.8445 29.4815C16.1749 29.3275 16.4968 29.1554 16.8084 28.9661C16.9741 28.8703 17.0751 28.6923 17.072 28.5009C17.0692 28.3096 16.9632 28.1348 16.7946 28.044C16.6261 27.9532 16.4217 27.9608 16.2602 28.0635C15.9814 28.2328 15.6935 28.3866 15.398 28.5245C15.1734 28.629 15.0519 28.8758 15.1057 29.1176C15.1594 29.3593 15.3738 29.5312 15.6215 29.5312ZM7.5986 29.5231C7.84583 29.5231 8.06001 29.3515 8.11397 29.1099C8.1677 28.8684 8.0467 28.6219 7.82277 28.5168C7.52777 28.3785 7.24037 28.2242 6.962 28.0545C6.80083 27.9563 6.59972 27.9516 6.43404 28.0419C6.26835 28.1325 6.16352 28.3043 6.15924 28.4931C6.15472 28.6816 6.25123 28.8582 6.41217 28.9566C6.72334 29.1461 7.04473 29.3184 7.37468 29.4729C7.44456 29.506 7.52111 29.5231 7.5986 29.5231ZM18.1748 27.7863C18.3108 27.7866 18.4415 27.7343 18.5395 27.6402C18.8028 27.3889 19.0524 27.1236 19.2873 26.8457C19.4723 26.6227 19.4428 26.2923 19.2217 26.1055C19.0004 25.9184 18.6697 25.9445 18.4807 26.1639C18.2699 26.4131 18.046 26.651 17.8099 26.8764C17.654 27.0254 17.6043 27.2543 17.6844 27.4547C17.7647 27.6549 17.9592 27.7863 18.1748 27.7863ZM5.04934 27.7742C5.26495 27.7742 5.45893 27.643 5.53927 27.4428C5.61962 27.2429 5.57018 27.014 5.41447 26.8647C5.1789 26.6391 4.95568 26.4009 4.74554 26.1513C4.55561 25.9367 4.22923 25.9127 4.01005 26.0971C3.79088 26.2816 3.75855 26.6073 3.93755 26.831C4.17194 27.1098 4.4213 27.3758 4.68421 27.6276C4.78239 27.7217 4.91361 27.7745 5.04934 27.7742ZM20.038 25.3189C20.2344 25.3191 20.4146 25.2105 20.5061 25.0367C20.6753 24.7141 20.827 24.3827 20.9606 24.0438C21.0355 23.8671 21.0086 23.6639 20.8905 23.5127C20.7723 23.3615 20.5814 23.2862 20.392 23.3161C20.2025 23.3461 20.0442 23.4763 19.9784 23.6565C19.8585 23.9598 19.7226 24.2563 19.5711 24.5451C19.4851 24.7086 19.491 24.9055 19.5864 25.0636C19.6819 25.2219 19.8533 25.3186 20.038 25.3189ZM3.19088 25.3027C3.37559 25.3025 3.54674 25.2059 3.64231 25.0479C3.73787 24.89 3.74405 24.6934 3.65847 24.5299C3.50705 24.2408 3.37178 23.9437 3.25269 23.6399C3.14334 23.3734 2.84025 23.2438 2.57187 23.3489C2.30349 23.4537 2.16871 23.7547 2.26926 24.0247C2.40214 24.3642 2.55333 24.6963 2.72235 25.0193C2.81363 25.1936 2.99405 25.3029 3.19088 25.3027ZM21.011 22.384C21.2708 22.3835 21.4919 22.1943 21.5321 21.9376C21.5886 21.5775 21.625 21.2145 21.6416 20.8503C21.6478 20.7103 21.5984 20.5736 21.5038 20.4702C21.4094 20.3668 21.2777 20.3052 21.1377 20.299C20.8489 20.2928 20.6064 20.5146 20.5864 20.8027C20.5715 21.1282 20.5389 21.4524 20.4887 21.774C20.465 21.9267 20.5092 22.0821 20.6095 22.1993C20.71 22.3165 20.8567 22.384 21.011 22.384ZM2.22314 22.3643C2.25024 22.3643 2.27734 22.3624 2.30397 22.3581C2.59232 22.3139 2.7901 22.0443 2.74588 21.7562C2.69644 21.4339 2.66434 21.1092 2.64984 20.7832C2.6294 20.4956 2.38717 20.2741 2.09882 20.2791C1.80738 20.2921 1.58179 20.5389 1.59462 20.8301C1.61079 21.194 1.64668 21.5565 1.70207 21.9164C1.74153 22.1739 1.96284 22.3641 2.22314 22.3643ZM21.1244 19.2833C21.4161 19.2833 21.6523 19.0467 21.6523 18.7551V17.72C21.6523 17.4284 21.4161 17.1918 21.1244 17.1918C20.8327 17.1918 20.5962 17.4284 20.5962 17.72V18.7551C20.5962 19.0467 20.8327 19.2833 21.1244 19.2833ZM2.11284 19.2633C2.40452 19.2633 2.64081 19.027 2.64081 18.7353V17.6998C2.64081 17.4082 2.40452 17.1719 2.11284 17.1719C1.82117 17.1719 1.58464 17.4082 1.58464 17.6998V18.7356C1.58464 19.0272 1.82117 19.2633 2.11284 19.2633Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_child_textile_result = browser_sprite_build_default.a.add(svg_cat_child_textile_symbol);
/* harmony default export */ var svg_cat_child_textile = (svg_cat_child_textile_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-toys.svg


var svg_cat_child_toys_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-toys",
  "use": "svg-cat-child-toys-usage",
  "viewBox": "0 0 31 30",
  "content": "<symbol viewBox=\"0 0 31 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-toys\">\n<path class=\"p-04303E\" d=\"M18.1713 3.54017V0H15.4173L14.2119 4.74557L18.1713 3.54017Z\" fill=\"#4D98CB\" />\n<path class=\"p-58ADE5\" d=\"M15.4171 4.74557V0H12.6631V1.77009V3.54017L15.4171 4.74557Z\" fill=\"#58ADE5\" />\n<path class=\"p-3440DB\" d=\"M21.3814 6.00442C21.3814 4.64571 20.276 3.54028 18.9173 3.54028H15.4173L14.2119 9.37284L20.0965 8.16745C20.8614 7.74873 21.3814 6.93623 21.3814 6.00442Z\" fill=\"#65B3E7\" />\n<path class=\"p-2682FF\" d=\"M11.9163 3.54028C10.5575 3.54028 9.45215 4.64571 9.45215 6.00442C9.45215 6.93623 9.9721 7.74879 10.737 8.16745L15.4162 9.37284V3.54028H11.9163Z\" fill=\"#5FBEFF\" />\n<path class=\"p-00CC76\" d=\"M23.302 10.6316C23.302 9.27284 22.1967 8.16748 20.8379 8.16748H15.4173L14.2119 14.0001L22.0171 12.7947C22.7821 12.3759 23.302 11.5634 23.302 10.6316Z\" fill=\"#A1D1FD\" />\n<path class=\"p-CCFC5C\" d=\"M9.99637 8.16748C8.63759 8.16748 7.53223 9.2729 7.53223 10.6316C7.53223 11.5634 8.05218 12.376 8.81711 12.7947L15.417 14.0001V8.16748H9.99637Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF3C7D\" d=\"M25.2227 15.2586C25.2227 13.8998 24.1172 12.7944 22.7585 12.7944H15.4173L14.2119 18.627L23.9378 17.4217C24.7027 17.0029 25.2227 16.1904 25.2227 15.2586Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFA2C1\" d=\"M8.07553 12.7944C6.71675 12.7944 5.61133 13.8999 5.61133 15.2586C5.61133 16.1904 6.13134 17.0029 6.89627 17.4216L15.4167 18.627V12.7944H8.07553Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF9100\" d=\"M24.6791 17.4219H15.4173L14.2119 23.2544L25.8584 22.049C26.6233 21.6303 27.1433 20.8178 27.1433 19.886C27.1433 18.5272 26.0378 17.4219 24.6791 17.4219Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFDE55\" d=\"M6.15463 17.4219C4.79585 17.4219 3.69043 18.5272 3.69043 19.886C3.69043 20.8178 4.21044 21.6304 4.97537 22.049L15.4164 23.2544V17.4219H6.15463Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EFE2DD\" d=\"M26.5998 22.0488H15.4173L14.2119 28.1826L26.5998 26.9772C27.9585 26.9772 29.0639 25.8717 29.0639 24.513C29.0639 23.1543 27.9585 22.0488 26.5998 22.0488Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFF5F5\" d=\"M4.23373 22.0488C2.87495 22.0488 1.76953 23.1543 1.76953 24.513C1.76953 25.8717 2.87495 26.9771 4.23373 26.9771L15.4161 28.1826V22.0488H4.23373Z\" fill=\"#5FBEFF\" />\n<path class=\"p-04303E\" d=\"M30.834 30V26.9773H15.4173L14.2119 28.9053L15.4173 30H30.834Z\" fill=\"#4D98CB\" />\n<path class=\"p-09607D\" d=\"M15.4167 26.9773H0V30H15.4167V26.9773Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_child_toys_result = browser_sprite_build_default.a.add(svg_cat_child_toys_symbol);
/* harmony default export */ var svg_cat_child_toys = (svg_cat_child_toys_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-underwear.svg


var svg_cat_child_underwear_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-underwear",
  "use": "svg-cat-child-underwear-usage",
  "viewBox": "0 0 35 35",
  "content": "<symbol viewBox=\"0 0 35 35\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-underwear\">\n<path class=\"p-2FC0F0\" d=\"M18.8501 1.10951V14.5288C18.8501 15.8065 18.3882 17.0429 17.5513 18.009L14.8463 21.13C13.0292 23.2267 11.9069 24.5306 11.18 25.3662C9.93725 26.7942 9.85073 26.8551 9.42482 27.171C7.27042 28.7716 4.22629 28.7425 2.08819 26.9326C-0.420016 24.8081 -0.710544 21.0427 1.44385 18.5569L6.21646 13.0511C6.74464 12.4406 7.03571 11.6606 7.03571 10.8529V1.10951C7.03571 0.496941 7.53238 0 8.14495 0H17.7409C18.3527 0 18.8501 0.496941 18.8501 1.10951Z\" fill=\"#58ADE5\" />\n<path class=\"p-0FA9DD\" d=\"M18.8498 1.10951V14.5288C18.8498 15.8065 18.3879 17.0429 17.551 18.009L14.846 21.13C13.0289 23.2267 11.9065 24.5306 11.1797 25.3662V0H17.7406C18.3524 0 18.8498 0.496941 18.8498 1.10951Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF8E8E\" d=\"M18.8496 1.10924V5.03617H7.03516V1.10924C7.03516 0.496674 7.53183 0 8.1444 0H17.7404C18.3529 0.000267029 18.8496 0.496674 18.8496 1.10924Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF6C6C\" d=\"M11.1797 0.000488281H14.7053V5.03666H11.1797V0.000488281Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BEEBFA\" d=\"M18.8501 9.91675V14.5286C18.8501 15.8066 18.3889 17.0432 17.5518 18.0091L14.8468 21.1298C11.0958 17.185 13.42 10.5902 18.8501 9.91675Z\" fill=\"#B9DFFC\" />\n<path class=\"p-2FC0F0\" d=\"M34.7807 7.77696V21.1957C34.7807 22.474 34.3193 23.7106 33.4816 24.6759L30.7766 27.7969L27.1105 31.984C26.2261 33.004 25.9933 33.3645 25.3559 33.8387C23.2018 35.4385 20.1574 35.4094 18.0195 33.5995C15.5111 31.475 15.22 27.7096 17.3736 25.2239L22.147 19.7188C22.6749 19.1083 22.966 18.3276 22.966 17.5203V7.77696C22.966 7.16386 23.4629 6.66772 24.0755 6.66772H33.6712C34.2837 6.66772 34.7807 7.16386 34.7807 7.77696Z\" fill=\"#58ADE5\" />\n<path class=\"p-0FA9DD\" d=\"M34.7805 7.77696V21.1957C34.7805 22.474 34.3191 23.7106 33.4814 24.6759L30.7764 27.7969L27.1104 31.984V6.66772H33.671C34.2836 6.66772 34.7805 7.16386 34.7805 7.77696Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF8E8E\" d=\"M34.7803 7.77674V11.7034H22.9658V7.77674C22.9658 7.16391 23.4625 6.66724 24.0751 6.66724H33.671C34.2836 6.6675 34.7803 7.16418 34.7803 7.77674Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF6C6C\" d=\"M27.1104 6.66772H30.6359V11.7039H27.1104V6.66772Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BEEBFA\" d=\"M34.7807 16.584V21.1958C34.7807 22.4738 34.3196 23.7105 33.4824 24.6763L30.7774 27.7971C27.0265 23.8523 29.3507 17.2574 34.7807 16.584Z\" fill=\"#B9DFFC\" />\n</symbol>"
});
var svg_cat_child_underwear_result = browser_sprite_build_default.a.add(svg_cat_child_underwear_symbol);
/* harmony default export */ var svg_cat_child_underwear = (svg_cat_child_underwear_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-child-walker.svg


var svg_cat_child_walker_symbol = new browser_symbol_default.a({
  "id": "svg-cat-child-walker",
  "use": "svg-cat-child-walker-usage",
  "viewBox": "0 0 31 22",
  "content": "<symbol viewBox=\"0 0 31 22\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-child-walker\">\n<path class=\"p-F8BD6F\" d=\"M6.81836 2.74615V4.16112C8.05125 4.16112 9.20241 4.51412 10.1753 5.12426C11.1815 5.75524 11.9975 6.66113 12.5177 7.73723C12.9205 8.56959 13.1465 9.50302 13.1465 10.4892H16.9753C16.9753 9.50296 17.2004 8.56959 17.604 7.73794L17.5876 7.72976L17.604 7.73794C18.1242 6.66184 18.9395 5.75588 19.9457 5.1242C20.9192 4.51406 22.0696 4.16106 23.3033 4.16106V2.74609H6.81836V2.74615Z\" fill=\"#B9DFFC\" />\n<path class=\"p-CB9237\" d=\"M6.81836 2.74609V4.16106C8.32297 7.73794 9.6513 10.4891 13.1457 10.4891C13.1457 9.5029 12.9205 8.56953 12.5177 7.73717C11.9974 6.66113 11.181 5.75547 10.1747 5.1245L19.9456 5.1242L19.9462 5.12503C18.94 5.75618 18.1238 6.66196 17.6039 7.73794C17.2004 8.56953 16.9752 9.50296 16.9752 10.4892C20.4703 10.4892 22.195 7.73717 23.3032 4.16112V2.74615L6.81836 2.74609Z\" fill=\"#4D98CB\" />\n<path class=\"p-808080\" d=\"M25.9667 20.0453C25.9667 20.1011 25.9644 20.1561 25.9592 20.2103C25.876 21.2121 25.0362 21.9999 24.0121 21.9999C22.988 21.9999 22.1483 21.2121 22.065 20.2103C22.0599 20.1561 22.0576 20.1011 22.0576 20.0453C22.0576 19.8707 22.0807 19.7028 22.1237 19.5415H25.9005C25.9436 19.7028 25.9667 19.8707 25.9667 20.0453Z\" fill=\"#65B3E7\" />\n<path class=\"p-808080\" d=\"M8.06453 20.0453C8.06453 20.1011 8.06229 20.1561 8.05711 20.2103C7.97386 21.2121 7.1341 21.9999 6.11001 21.9999C5.08668 21.9999 4.24691 21.2121 4.16366 20.2103C4.15849 20.1561 4.15625 20.1011 4.15625 20.0453C4.15625 19.8707 4.17855 19.7028 4.22167 19.5415H7.99916C8.04223 19.7028 8.06453 19.8707 8.06453 20.0453Z\" fill=\"#65B3E7\" />\n<path class=\"p-F95428\" d=\"M28.6929 16.6841H26.8771L28.2626 4.93837L28.5079 2.85747H28.6929C29.4822 2.85747 30.122 2.21762 30.122 1.42838C30.122 1.03374 29.9622 0.67704 29.7036 0.418414C29.445 0.159788 29.0875 0 28.6929 0H1.42838C0.639152 5.88321e-05 0 0.639917 0 1.42838C0 1.82303 0.159788 2.18049 0.418414 2.43912C0.676275 2.69775 1.03374 2.85753 1.42838 2.85753H1.61341L1.85868 4.93842L3.24418 16.6842H1.42838C0.639152 16.6841 0 17.324 0 18.1125C0 18.5072 0.159788 18.8646 0.418414 19.1233C0.676275 19.3819 1.03374 19.5417 1.42838 19.5417H4.2212H7.99869H22.1233H25.9001H28.6929C29.4822 19.5417 30.122 18.9018 30.122 18.1126C30.122 17.7179 29.9622 17.3612 29.7036 17.1026C29.445 16.8439 29.0875 16.6841 28.6929 16.6841ZM24.8052 16.6841H24.792H5.32925H5.31607L3.93057 4.93837L3.6853 2.85747H6.81846H23.3034H26.4359L26.1906 4.93837L24.8052 16.6841Z\" fill=\"#76B7E2\" />\n<path class=\"p-666666\" d=\"M25.8996 19.5415H22.1228C22.0797 19.7028 22.0567 19.8707 22.0567 20.0453C22.0567 20.1011 22.0589 20.1561 22.0641 20.2103H25.9583C25.9635 20.1561 25.9657 20.1011 25.9657 20.0453C25.9657 19.8707 25.9427 19.7028 25.8996 19.5415ZM4.22069 19.5415C4.17757 19.7028 4.15527 19.8707 4.15527 20.0453C4.15527 20.1011 4.15751 20.1561 4.16269 20.2103H8.05613C8.06131 20.1561 8.06355 20.1011 8.06355 20.0453C8.06355 19.8707 8.04125 19.7028 7.99813 19.5415H4.22069Z\" fill=\"#4D98CB\" />\n<path class=\"p-D33924\" d=\"M28.5076 2.85767L28.2624 4.9385H26.1904L26.4356 2.85767H28.5076Z\" fill=\"#4D98CB\" />\n<path class=\"p-D33924\" d=\"M5.01714 2.43912C4.75852 2.18049 4.59873 1.82303 4.59873 1.42838C4.59873 0.639857 5.23788 0 6.02711 0H1.42838C0.639152 5.8832e-05 0 0.639916 0 1.42838C0 1.82303 0.159788 2.18049 0.418414 2.43912C0.676275 2.69774 1.03374 2.85753 1.42838 2.85753H1.61341L1.85868 4.93842H3.93063L3.68536 2.85753H6.02705C5.63247 2.85753 5.275 2.69774 5.01714 2.43912Z\" fill=\"#4D98CB\" />\n<path class=\"p-D33924\" d=\"M4.18549 18.1125C4.18549 17.3239 4.82464 16.6841 5.61388 16.6841H5.32925H3.2573H1.42838C0.639152 16.6841 0 17.3239 0 18.1125C0 18.5071 0.159788 18.8646 0.418414 19.1232C0.676275 19.3818 1.03374 19.5416 1.42838 19.5416H4.2212H5.61388C5.21923 19.5416 4.86177 19.3818 4.60391 19.1232C4.34528 18.8645 4.18549 18.5071 4.18549 18.1125Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_child_walker_result = browser_sprite_build_default.a.add(svg_cat_child_walker_symbol);
/* harmony default export */ var svg_cat_child_walker = (svg_cat_child_walker_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-clothes-children.svg


var svg_cat_clothes_children_symbol = new browser_symbol_default.a({
  "id": "svg-cat-clothes-children",
  "use": "svg-cat-clothes-children-usage",
  "viewBox": "0 0 38 48",
  "content": "<symbol viewBox=\"0 0 38 48\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-clothes-children\">\n<path class=\"p-FF9100\" d=\"M14.9701 15.4079V0H8.99023V13.5308L14.9701 15.4079Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FF3939\" d=\"M28.0473 13.5308V0H22.0674V15.4079L28.0473 13.5308Z\" fill=\"#65B3E7\" />\n<path class=\"p-F5CF2D\" d=\"M31.0472 13.5308H18.5186L16.6416 25.4858L18.5186 36.4556H21.5086V47.9999H37.0371L34.0371 20.4857L31.0472 13.5308Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDE55\" d=\"M5.98997 13.5308L3 20.4857L0 47.9999H15.5286V36.4556H18.5184V13.5308H5.98997Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF9100\" d=\"M18.5186 32.4803H21.0771C24.9403 32.4803 28.072 29.3486 28.072 25.4854L16.6416 23.6084L18.5186 32.4803Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF3939\" d=\"M18.5186 19.5059L16.6416 22.4958L18.5186 25.4857H28.072V19.5059H18.5186Z\" fill=\"#76B7E2\" />\n<path class=\"p-E4BF24\" d=\"M8.96484 25.4854C8.96484 29.3486 12.0965 32.4803 15.9597 32.4803H18.5182V23.6084L8.96484 25.4854Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M18.5182 19.5059H8.96484V25.4857H18.5182V19.5059Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_clothes_children_result = browser_sprite_build_default.a.add(svg_cat_clothes_children_symbol);
/* harmony default export */ var svg_cat_clothes_children = (svg_cat_clothes_children_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-clothes-men.svg


var svg_cat_clothes_men_symbol = new browser_symbol_default.a({
  "id": "svg-cat-clothes-men",
  "use": "svg-cat-clothes-men-usage",
  "viewBox": "0 0 37 42",
  "content": "<symbol viewBox=\"0 0 37 42\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-clothes-men\">\n<path class=\"p-966641\" d=\"M9.84375 5.00391V14.2816L18.457 20.0156L27.0703 14.2816V5.00391H9.84375Z\" fill=\"#AFD9F6\" />\n<path class=\"p-7E5436\" d=\"M27.0703 5.00391V14.2816L18.457 20.0155V5.00391H27.0703Z\" fill=\"#65B3E7\" />\n<path class=\"p-68544F\" d=\"M35.6836 14.8477C33.6409 14.8477 31.9922 13.1987 31.9922 11.1562V0H24.6094V12.9527L18.457 17.0623L12.3047 12.9527V0H4.92188V11.1562C4.92188 12.1405 4.52821 13.0757 3.81445 13.7648C3.15008 14.4538 2.21493 14.8477 1.23047 14.8477H0V36.6023L13.6582 42L18.4324 37.4883L18.457 37.5127L23.0836 42L36.9141 36.6023V14.8477H35.6836Z\" fill=\"#58ADE5\" />\n<path class=\"p-53433F\" d=\"M36.9141 14.8477V36.6023L23.0836 42L18.457 37.5128V17.0624L24.6094 12.9527V0H31.9922V11.1562C31.9922 13.1987 33.6409 14.8477 35.6836 14.8477H36.9141Z\" fill=\"#4D98CB\" />\n<path class=\"p-966641\" d=\"M5.69141 30.934L13.8841 34.2529L14.807 31.9722L6.61426 28.6533L5.69141 30.934Z\" fill=\"#5FBEFF\" />\n<path class=\"p-7E5436\" d=\"M30.3052 28.6387L22.0908 31.9263L23.0041 34.2119L31.2184 30.9241L30.3052 28.6387Z\" fill=\"#76B7E2\" />\n<path class=\"p-FFDA2D\" d=\"M24.6094 19.7695H22.1484V22.2305H24.6094V19.7695Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFDA2D\" d=\"M24.6094 24.6914H22.1484V27.1523H24.6094V24.6914Z\" fill=\"#B9DFFC\" />\n</symbol>"
});
var svg_cat_clothes_men_result = browser_sprite_build_default.a.add(svg_cat_clothes_men_symbol);
/* harmony default export */ var svg_cat_clothes_men = (svg_cat_clothes_men_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-clothes-men-2.svg


var svg_cat_clothes_men_2_symbol = new browser_symbol_default.a({
  "id": "svg-cat-clothes-men-2",
  "use": "svg-cat-clothes-men-2-usage",
  "viewBox": "0 0 33 33",
  "content": "<symbol viewBox=\"0 0 33 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-clothes-men-2\">\n<path class=\"p-BBDCFF\" d=\"M25.2012 0L23.2676 7.79883H9.73242L7.79883 0H25.2012Z\" fill=\"#B9DFFC\" />\n<path class=\"p-9ABADB\" d=\"M23.2676 7.79883H16.5V0H25.2012L23.2676 7.79883Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BBDCFF\" d=\"M25.2587 3.93164L25.1234 13.6769L16.4995 30.2929L16.3447 30.583L8.72637 16.1712L7.74023 3.93164H25.2587Z\" fill=\"#B9DFFC\" />\n<path class=\"p-9ABADB\" d=\"M25.2592 3.93164L25.1239 13.6769L16.5 30.2929V3.93164H25.2592Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E0F4FF\" d=\"M7.79883 0V4.89844C7.79883 7.62474 9.73242 9.90638 12.4201 10.3512L15.5332 10.8732V3.93164H14.5664C11.1888 3.93164 8.96292 2.32811 7.79883 0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BBDCFF\" d=\"M18.4336 3.93164H17.4668V10.8732L20.5799 10.3512C23.2676 9.90638 25.2012 7.62474 25.2012 4.89844V0C24.0299 2.34255 21.7955 3.93164 18.4336 3.93164Z\" fill=\"#B9DFFC\" />\n<path class=\"p-53433F\" d=\"M17.4668 13.5996H15.5332V15.5332H17.4668V13.5996Z\" fill=\"#76B7E2\" />\n<path class=\"p-53433F\" d=\"M17.4668 17.4668H15.5332V19.4004H17.4668V17.4668Z\" fill=\"#76B7E2\" />\n<path class=\"p-3E322E\" d=\"M17.4668 13.5996H16.5V15.5332H17.4668V13.5996Z\" fill=\"#4D98CB\" />\n<path class=\"p-3E322E\" d=\"M17.4668 17.4668H16.5V19.4004H17.4668V17.4668Z\" fill=\"#4D98CB\" />\n<path class=\"p-53433F\" d=\"M33 3.93164V33H0V3.93164H7.74076L8.72689 16.1712L16.3452 30.583L16.5 30.2929L25.1239 13.6769L25.2592 3.93164H33Z\" fill=\"#5FBEFF\" />\n<path class=\"p-3E322E\" d=\"M33 3.93164V33H16.5V30.2929L25.1239 13.6769L25.2592 3.93164H33Z\" fill=\"#4D98CB\" />\n<path class=\"p-966641\" d=\"M25.4146 18.917L27.2903 24.563L16.5008 33L5.71126 24.563L7.58691 18.917L3.71973 15.1996L7.74154 3.93164L16.5008 30.214L25.26 3.93164L29.2818 15.1996L25.4146 18.917Z\" fill=\"#58ADE5\" />\n<path class=\"p-7E5436\" d=\"M25.4139 18.917L27.2895 24.563L16.5 33V30.214L25.2592 3.93164L29.2811 15.1996L25.4139 18.917Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_clothes_men_2_result = browser_sprite_build_default.a.add(svg_cat_clothes_men_2_symbol);
/* harmony default export */ var svg_cat_clothes_men_2 = (svg_cat_clothes_men_2_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-clothes-women.svg


var svg_cat_clothes_women_symbol = new browser_symbol_default.a({
  "id": "svg-cat-clothes-women",
  "use": "svg-cat-clothes-women-usage",
  "viewBox": "0 0 48 53",
  "content": "<symbol viewBox=\"0 0 48 53\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-clothes-women\">\n<path class=\"p-FDE4E4\" d=\"M3.96582 13.2778H6.71158V23.9448H3.96582V13.2778Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDE4E4\" d=\"M0 17.2397H10.678V19.9827H0V17.2397Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FCCED3\" d=\"M41.3896 28.5166H43.932V39.1836H41.3896V28.5166Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FCCED3\" d=\"M37.3223 32.5801H48.0002V35.1198H37.3223V32.5801Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FDE4E4\" d=\"M5.18652 34.6118H7.93229V37.3548H5.18652V34.6118Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FCCED3\" d=\"M39.7627 16.3257H42.5085V19.0686H39.7627V16.3257Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E63950\" d=\"M34.3719 0.985352H32.2363V8.18135H34.3719V0.985352Z\" fill=\"#65B3E7\" />\n<path class=\"p-AE2538\" d=\"M37.4231 51.4758V52.9997H31.2909H30.1011H28.2401H20.6943V22.4209H30.2028C35.1755 27.3887 37.4231 44.4356 37.4231 51.4758Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M34.3721 7.18272V13.5523C34.3721 17.5449 32.0636 19.3735 30.2027 22.4211H28.8806H17.6943L23.6943 13.1766C25.5551 10.0678 32.1037 12.5067 32.2366 7.18262L34.3721 7.18272Z\" fill=\"#65B3E7\" />\n<path class=\"p-E63950\" d=\"M31.2912 52.9998H29.4912C29.6437 46.4167 28.9014 39.7016 27.2539 33.3929L28.9419 32.6919C30.6506 39.2749 31.4436 46.173 31.2912 52.9998Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF637B\" d=\"M13.0166 0.985352H15.1522V8.18135H13.0166V0.985352Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FF637B\" d=\"M13.0166 7.18272V13.5523C13.0166 17.5449 15.3251 19.3735 17.186 22.4211H18.508H23.6945V13.1766C21.8335 10.0678 15.285 12.5067 15.1521 7.18262L13.0166 7.18272Z\" fill=\"#AFD9F6\" />\n<path class=\"p-E63950\" d=\"M9.96582 51.4758V52.9997H16.098H17.2879H19.1489H23.6946V22.4209H17.1862C12.2135 27.3887 9.96582 44.4356 9.96582 51.4758Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF637B\" d=\"M16.0985 52.9998H17.8985C17.746 46.4167 18.4884 39.7016 20.1358 33.3929L18.4478 32.6919C16.7391 39.2749 15.9461 46.173 16.0985 52.9998Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_clothes_women_result = browser_sprite_build_default.a.add(svg_cat_clothes_women_symbol);
/* harmony default export */ var svg_cat_clothes_women = (svg_cat_clothes_women_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cosmetics.svg


var svg_cat_cosmetics_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cosmetics",
  "use": "svg-cat-cosmetics-usage",
  "viewBox": "0 0 32 38",
  "content": "<symbol viewBox=\"0 0 32 38\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cosmetics\">\n<path class=\"p-FF4F1A\" d=\"M11.5112 3.39776V13.6114H2.39453V6.77171C2.39453 4.5 2.39453 4.5 4.43451 3.28358L7.03958 1.81954L7.94431 1.31081C8.69367 0.889521 9.58395 0.896747 10.3261 1.33105C11.0682 1.76534 11.5112 2.53783 11.5112 3.39776Z\" fill=\"#5FBEFF\" />\n<path class=\"p-CA1C00\" d=\"M11.5116 13.6112H7.04004V1.8194L7.94477 1.31067C8.69413 0.889375 10.2581 0.0655485 11.0002 0.499847C11.7424 0.934146 11.5116 3.53769 11.5116 4.39761V13.6112Z\" fill=\"#4D98CB\" />\n<path class=\"p-F1E7DF\" d=\"M12.9211 12.9849H1.1582L0.158203 18.453H12.9211V12.9849Z\" fill=\"#B9DFFC\" />\n<path class=\"p-DFCDBD\" d=\"M12.9215 12.9849H7.04004V18.453H12.9215V12.9849Z\" fill=\"#A1D1FD\" />\n<path class=\"p-8A6746\" d=\"M14.0789 17.9526H0V37.9997H14.0789V17.9526Z\" fill=\"#65B3E7\" />\n<path class=\"p-644B31\" d=\"M14.0791 17.9526H7.04004V37.9997H14.0791V17.9526Z\" fill=\"#4D98CB\" />\n<path class=\"p-60DD4E\" d=\"M31.0314 22.248C31.0314 29.1917 25.3826 34.8405 18.4389 34.8405C11.4952 34.8405 5.8457 29.1917 5.8457 22.248C5.8457 15.3036 11.4952 9.65479 18.4389 9.65479C25.3826 9.65479 31.0314 15.3036 31.0314 22.248Z\" fill=\"#B9DFFC\" />\n<path class=\"p-00BB64\" d=\"M31.031 22.248C31.031 29.1917 25.3822 34.8405 18.4385 34.8405V9.65479C25.3821 9.65479 31.031 15.3036 31.031 22.248Z\" fill=\"#4D98CB\" />\n<path class=\"p-B6EFAB\" d=\"M27.4531 22.2479C27.4531 27.2188 23.4093 31.2627 18.4383 31.2627C13.4667 31.2627 9.42285 27.2188 9.42285 22.2479C9.42285 17.2762 13.4667 13.2324 18.4383 13.2324C23.4093 13.2324 27.4531 17.2762 27.4531 22.2479Z\" fill=\"#A1D1FD\" />\n<path class=\"p-95E0BA\" d=\"M18.4385 31.2627V13.2324C23.4094 13.2324 27.4533 17.2762 27.4533 22.2479C27.4533 27.2188 23.4094 31.2627 18.4385 31.2627Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFDC2D\" d=\"M30.3326 32.0322V35.12C30.3326 36.7076 29.0405 37.9997 27.4529 37.9997H9.42264C7.83502 37.9997 6.54297 36.7076 6.54297 35.12V32.0322H30.3326Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFC002\" d=\"M30.3329 32.0322V35.12C30.3329 36.7076 29.0409 37.9997 27.4532 37.9997H18.4385V32.0322H30.3329Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_cosmetics_result = browser_sprite_build_default.a.add(svg_cat_cosmetics_symbol);
/* harmony default export */ var svg_cat_cosmetics = (svg_cat_cosmetics_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cosmetics-aromatherapy.svg


var svg_cat_cosmetics_aromatherapy_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cosmetics-aromatherapy",
  "use": "svg-cat-cosmetics-aromatherapy-usage",
  "viewBox": "0 0 30 38",
  "content": "<symbol viewBox=\"0 0 30 38\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cosmetics-aromatherapy\">\n<path class=\"p-FF637B\" d=\"M29.6334 26.2903C29.6334 28.0454 28.9267 29.755 27.6959 30.986L25.0744 34.2685L14.8167 35.7274L9.64217 36.4566L4.55898 34.2685L1.93749 30.986C0.706642 29.755 0 28.0454 0 26.2903C0 24.535 0.706642 22.8254 1.93749 21.5945L9.11796 15.5597L12.7196 13.417L14.8167 13.5994L17.9624 13.8501L20.5154 15.5597L27.6959 21.5945C28.9267 22.8254 29.6334 24.535 29.6334 26.2903Z\" fill=\"#58ADE5\" />\n<path class=\"p-E63950\" d=\"M29.6331 26.2903C29.6331 28.0454 28.9265 29.755 27.6956 30.986L25.0741 34.2685L14.8164 35.7274V13.5994L17.9621 13.8501L20.5151 15.5597L27.6956 21.5945C28.9265 22.8254 29.6331 24.535 29.6331 26.2903Z\" fill=\"#4D98CB\" />\n<path d=\"M15.9562 5.69873H13.6768V11.4734H15.9562V5.69873Z\" fill=\"black\" />\n<path d=\"M15.9562 5.69873H14.8164V11.4734H15.9562V5.69873Z\" fill=\"black\" />\n<path class=\"p-FDBF00\" d=\"M4.55859 34.2686V38.0002H25.074V34.2686H4.55859Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FDBF00\" d=\"M19.6123 5.17432H10.0215V15.5595H19.6123V10.3669V5.17432Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF9100\" d=\"M25.0741 34.2686H14.8164V38.0002H25.0741V34.2686Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF9100\" d=\"M19.6118 5.17432H14.8164V15.5595H19.6118V5.17432Z\" fill=\"#65B3E7\" />\n<path class=\"p-815638\" d=\"M18.2359 1.13965H11.3975V5.69863H18.2359V1.13965Z\" fill=\"#5FBEFF\" />\n<path class=\"p-64422A\" d=\"M18.2356 1.13965H14.8164V5.69863H18.2356V1.13965Z\" fill=\"#65B3E7\" />\n<path class=\"p-E0F4FF\" d=\"M22.7953 4.55908H6.83887V6.83857H22.7953V4.55908Z\" fill=\"#A1D1FD\" />\n<path class=\"p-B9DFFC\" d=\"M22.7946 4.55908H14.8164V6.83857H22.7946V4.55908Z\" fill=\"#B9DFFC\" />\n<path class=\"p-966641\" d=\"M20.5156 0H9.11816V2.27949H20.5156V0Z\" fill=\"#58ADE5\" />\n<path class=\"p-7E5436\" d=\"M20.5151 0H14.8164V2.27949H20.5151V0Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_cosmetics_aromatherapy_result = browser_sprite_build_default.a.add(svg_cat_cosmetics_aromatherapy_symbol);
/* harmony default export */ var svg_cat_cosmetics_aromatherapy = (svg_cat_cosmetics_aromatherapy_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cosmetics-decor-cosmetics.svg


var svg_cat_cosmetics_decor_cosmetics_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cosmetics-decor-cosmetics",
  "use": "svg-cat-cosmetics-decor-cosmetics-usage",
  "viewBox": "0 0 26 33",
  "content": "<symbol viewBox=\"0 0 26 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cosmetics-decor-cosmetics\">\n<path class=\"p-FFB64C\" d=\"M25.1367 29.1328V33H13.5352V29.1328L15.4688 27.1992H23.2031L25.1367 29.1328Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FF9100\" d=\"M25.1377 29.1328V33H19.3369V27.1992H23.2041L25.1377 29.1328Z\" fill=\"#76B7E2\" />\n<path class=\"p-FFD396\" d=\"M25.1367 15.4688H13.5352V29.1328H25.1367V15.4688Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFB64C\" d=\"M25.1377 15.4688H19.3369V29.1328H25.1377V15.4688Z\" fill=\"#4D98CB\" />\n<path class=\"p-F23055\" d=\"M9.667 4.83423H1.93262V12.5686H9.667V4.83423Z\" fill=\"#5FBEFF\" />\n<path class=\"p-AE2538\" d=\"M9.66797 4.83423H5.80078V12.5686H9.66797V4.83423Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFB64C\" d=\"M0.966798 11.6016L0.128906 17.4024H11.4727L10.6348 11.6016H0.966798Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FFB64C\" d=\"M19.3357 22.8601L17.9629 24.2329L19.3357 25.6057L20.7085 24.2329L19.3357 22.8601Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF9100\" d=\"M10.6348 11.6016H5.80078V17.4024H11.4727L10.6348 11.6016Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF5093\" d=\"M5.79981 0C3.67292 0 1.93262 2.16563 1.93262 4.83399C1.93262 7.50236 3.67292 9.66798 5.79981 9.66798C7.9267 9.66798 9.667 7.50236 9.667 4.83399C9.667 2.16563 7.9267 0 5.79981 0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-F23055\" d=\"M5.80078 9.66798V0C7.92767 0 9.66797 2.16563 9.66797 4.83399C9.66797 7.50236 7.92767 9.66798 5.80078 9.66798Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFB64C\" d=\"M11.6016 29.1328V33H0V29.1328L1.9336 27.1992H9.66798L11.6016 29.1328Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FF9100\" d=\"M11.6016 29.1328V33H5.80078V27.1992H9.66797L11.6016 29.1328Z\" fill=\"#76B7E2\" />\n<path class=\"p-FFD396\" d=\"M11.6016 15.4688H0V29.1328H11.6016V15.4688Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFB64C\" d=\"M11.6016 15.4688H5.80078V29.1328H11.6016V15.4688Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M20.7098 24.2342L19.3369 25.607V22.8613L20.7098 24.2342Z\" fill=\"#76B7E2\" />\n</symbol>"
});
var svg_cat_cosmetics_decor_cosmetics_result = browser_sprite_build_default.a.add(svg_cat_cosmetics_decor_cosmetics_symbol);
/* harmony default export */ var svg_cat_cosmetics_decor_cosmetics = (svg_cat_cosmetics_decor_cosmetics_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cosmetics-hair.svg


var svg_cat_cosmetics_hair_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cosmetics-hair",
  "use": "svg-cat-cosmetics-hair-usage",
  "viewBox": "0 0 25 40",
  "content": "<symbol viewBox=\"0 0 25 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cosmetics-hair\">\n<path class=\"p-FFDAEE\" d=\"M11.2587 39.9997H0V36.2468C0 35.2104 0.840086 34.3704 1.87645 34.3704H9.38224C10.4186 34.3704 11.2587 35.2104 11.2587 36.2468V39.9997Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF7CB9\" d=\"M9.1604 17.1354H1.96289V12.5552H9.1604V17.1354Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF5E95\" d=\"M9.3818 12.5552H5.62891V17.3572H9.3818V12.5552Z\" fill=\"#76B7E2\" />\n<path class=\"p-FFDAEE\" d=\"M9.38224 21.1103H1.87645C0.840086 21.1103 0 20.2702 0 19.2339V15.481H11.2587V19.2339C11.2587 20.2702 10.4186 21.1103 9.38224 21.1103Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FCB9D1\" d=\"M5.62891 21.1103H9.3818C10.4182 21.1103 11.2583 20.2702 11.2583 19.2339V15.481H5.62891V21.1103Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF5E95\" d=\"M11.2587 36.247H0V19.2339H11.2587V36.247Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFDAEE\" d=\"M24.3935 39.9997H13.1348V36.2468C13.1348 35.2104 13.9749 34.3704 15.0112 34.3704H22.517C23.5534 34.3704 24.3935 35.2104 24.3935 36.2468V39.9997Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF5E95\" d=\"M24.3935 17.3573H13.1348V9.93799H24.3935V17.3573Z\" fill=\"#58ADE5\" />\n<path class=\"p-CE0963\" d=\"M24.394 9.93799H18.7646V17.3573H24.394V9.93799Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDAEE\" d=\"M22.517 21.1103H15.0112C13.9749 21.1103 13.1348 20.2702 13.1348 19.2339V15.481H24.3935V19.2339C24.3935 20.2702 23.5534 21.1103 22.517 21.1103Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF5E95\" d=\"M24.3935 36.247H13.1348V19.2339H24.3935V36.247Z\" fill=\"#58ADE5\" />\n<path class=\"p-FCB9D1\" d=\"M18.7646 39.9997H24.394V36.2468C24.394 35.2104 23.5539 34.3704 22.5175 34.3704H18.7646V39.9997Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FCB9D1\" d=\"M18.7646 21.1103H22.5175C23.5539 21.1103 24.394 20.2702 24.394 19.2339V15.481H18.7646V21.1103Z\" fill=\"#A1D1FD\" />\n<path class=\"p-CE0963\" d=\"M24.394 19.2339H18.7646V36.247H24.394V19.2339Z\" fill=\"#4D98CB\" />\n<path class=\"p-FCB9D1\" d=\"M5.62891 39.9997H11.2583V36.2468C11.2583 35.2104 10.4182 34.3704 9.3818 34.3704H5.62891V39.9997Z\" fill=\"#A1D1FD\" />\n<path class=\"p-CE0963\" d=\"M11.2583 19.2339H5.62891V36.247H11.2583V19.2339Z\" fill=\"#4D98CB\" />\n<path class=\"p-E0F4FF\" d=\"M6.91258 7.98628C5.59138 7.98628 4.5166 6.9115 4.5166 5.59031C4.5166 4.26912 5.59138 3.19434 6.91258 3.19434C8.23377 3.19434 9.30855 4.26912 9.30855 5.59031C9.30855 6.9115 8.23377 7.98628 6.91258 7.98628Z\" fill=\"#E0F4FF\" />\n<path class=\"p-BBDCFF\" d=\"M19.7973 4.79195C18.4761 4.79195 17.4014 3.71717 17.4014 2.39597C17.4014 1.07478 18.4761 0 19.7973 0C21.1185 0 22.1933 1.07478 22.1933 2.39597C22.1933 3.71717 21.1185 4.79195 19.7973 4.79195Z\" fill=\"#BBDCFF\" />\n<path class=\"p-E0F4FF\" d=\"M11.7576 3.19448C12.1987 3.19448 12.5563 2.83691 12.5563 2.39583C12.5563 1.95474 12.1987 1.59717 11.7576 1.59717C11.3166 1.59717 10.959 1.95474 10.959 2.39583C10.959 2.83691 11.3166 3.19448 11.7576 3.19448Z\" fill=\"#E0F4FF\" />\n<path class=\"p-BBDCFF\" d=\"M16.6024 7.98648C17.0435 7.98648 17.401 7.6289 17.401 7.18782C17.401 6.74673 17.0435 6.38916 16.6024 6.38916C16.1613 6.38916 15.8037 6.74673 15.8037 7.18782C15.8037 7.6289 16.1613 7.98648 16.6024 7.98648Z\" fill=\"#BBDCFF\" />\n</symbol>"
});
var svg_cat_cosmetics_hair_result = browser_sprite_build_default.a.add(svg_cat_cosmetics_hair_symbol);
/* harmony default export */ var svg_cat_cosmetics_hair = (svg_cat_cosmetics_hair_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cosmetics-hardware.svg


var svg_cat_cosmetics_hardware_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cosmetics-hardware",
  "use": "svg-cat-cosmetics-hardware-usage",
  "viewBox": "0 0 36 36",
  "content": "<symbol viewBox=\"0 0 36 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cosmetics-hardware\">\n<path class=\"p-80D0E1\" d=\"M17.3843 26.0879L10.0296 21.1203C9.49401 20.7585 9.3531 20.0311 9.71486 19.4955L12.6279 15.1828C12.9896 14.6472 13.717 14.5063 14.2526 14.868L21.6073 19.8356C22.1429 20.1974 22.2838 20.9248 21.922 21.4604L19.009 25.7732C18.6474 26.3088 17.9199 26.4497 17.3843 26.0879Z\" fill=\"#B9DFFC\" />\n<path class=\"p-51B3DA\" d=\"M21.6074 19.8356L17.9301 17.3518L13.707 23.6042L17.3843 26.088C17.9199 26.4497 18.6473 26.3088 19.0091 25.7732L21.9221 21.4605C22.2839 20.9248 22.143 20.1974 21.6074 19.8356Z\" fill=\"#A1D1FD\" />\n<path class=\"p-80D0E1\" d=\"M12.1381 33.8572L4.78343 28.8896C4.24782 28.5279 4.10692 27.8005 4.46868 27.2649L7.38132 22.9526C7.74309 22.417 8.47048 22.2761 9.00608 22.6379L16.3607 27.6055C16.8963 27.9673 17.0372 28.6947 16.6754 29.2303L13.7628 33.5425C13.4011 34.078 12.6736 34.2189 12.1381 33.8572Z\" fill=\"#B9DFFC\" />\n<path class=\"p-51B3DA\" d=\"M16.3589 27.6055L12.6815 25.1217L8.45887 31.3734L12.1362 33.8572C12.6718 34.219 13.3992 34.0781 13.761 33.5425L16.6736 29.2303C17.0354 28.6948 16.8945 27.9673 16.3589 27.6055Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF5E5B\" d=\"M16.0185 30.2L6.72438 23.9223L10.3694 18.5259L19.6636 24.8035L16.0185 30.2Z\" fill=\"#5FBEFF\" />\n<path class=\"p-51B3DA\" d=\"M20.2979 21.775L12.9434 16.8076C12.3242 16.3893 12.2502 15.5033 12.7933 14.9885L16.2921 11.6712C16.6011 9.34708 18.4896 7.52983 20.826 7.3104L24.234 2.26481C25.2281 0.793004 27.2342 0.40438 28.706 1.39851C30.1778 2.39262 30.5664 4.39876 29.5723 5.87052L26.1643 10.9161C26.8326 13.1631 25.8546 15.5947 23.8123 16.7503L22.0412 21.2351C21.7669 21.9303 20.918 22.1938 20.2979 21.775Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF423D\" d=\"M11.3725 27.0612L16.0195 30.2L19.6644 24.8037L15.0174 21.6649L11.3725 27.0612Z\" fill=\"#4D98CB\" />\n<path class=\"p-39A3DB\" d=\"M22.0401 21.2354L23.8112 16.7506C25.8517 15.5961 26.8322 13.1657 26.1632 10.9164L29.5712 5.87085C30.5653 4.39904 30.1767 2.3929 28.7049 1.39884L16.6195 19.2916L20.2967 21.7753C20.916 22.1936 21.7653 21.9313 22.0401 21.2354Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_cosmetics_hardware_result = browser_sprite_build_default.a.add(svg_cat_cosmetics_hardware_symbol);
/* harmony default export */ var svg_cat_cosmetics_hardware = (svg_cat_cosmetics_hardware_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cosmetics-hygiene.svg


var svg_cat_cosmetics_hygiene_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cosmetics-hygiene",
  "use": "svg-cat-cosmetics-hygiene-usage",
  "viewBox": "0 0 30 42",
  "content": "<symbol viewBox=\"0 0 30 42\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cosmetics-hygiene\">\n<path class=\"p-FFE98F\" d=\"M11.8961 0H4.25977L5.11691 6.96813H11.039L11.8961 0Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFC170\" d=\"M11.8972 0H8.0791V6.96813H11.0401L11.8972 0Z\" fill=\"#76B7E2\" />\n<path class=\"p-99EFF2\" d=\"M16.1156 39.8998L16.0322 35.7379L15.063 11.5088L13.2859 9.42847H3.00019L1.09453 11.5088L0.125418 35.7379L0.0419922 39.8998H16.1156Z\" fill=\"#58ADE5\" />\n<path class=\"p-00D7DF\" d=\"M16.115 39.8998L16.0316 35.7379L15.0624 11.5088L13.2853 9.42847H8.07812V39.8998H16.115Z\" fill=\"#4D98CB\" />\n<path class=\"p-CCF7F9\" d=\"M0 41.9999H8.07883H16.1578L16.1005 39.1362H0.0573395L0 41.9999Z\" fill=\"#AFD9F6\" />\n<path class=\"p-CCF7F9\" d=\"M11.8335 6.58447H4.32438L1.125 11.4546H15.0327L11.8335 6.58447Z\" fill=\"#AFD9F6\" />\n<path class=\"p-EBFCFC\" d=\"M9.67026 19.5681H6.80664V27.4967H9.67026V19.5681Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EBFCFC\" d=\"M20.8672 5.53613V10.6906H24.3054V5.53613\" fill=\"#EBFCFC\" />\n<path class=\"p-00D7DF\" d=\"M20.8672 1.90918V6.68191H25.0691V9.54553H20.8672V14.3182H25.7373V1.90918H20.8672Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FFE98F\" d=\"M24.3057 0C26.9416 0 29.0784 2.13683 29.0784 4.77273V39.6135C29.0784 40.9314 28.0099 41.9999 26.692 41.9999C25.3741 41.9999 24.3057 40.9314 24.3057 39.6135V12.8863V0Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFC170\" d=\"M26.6924 0.640137V41.9999C28.0103 41.9999 29.0787 40.9315 29.0787 39.6136V4.77278C29.0787 3.00657 28.1185 1.46553 26.6924 0.640137Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_cosmetics_hygiene_result = browser_sprite_build_default.a.add(svg_cat_cosmetics_hygiene_symbol);
/* harmony default export */ var svg_cat_cosmetics_hygiene = (svg_cat_cosmetics_hygiene_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cosmetics-manicure.svg


var svg_cat_cosmetics_manicure_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cosmetics-manicure",
  "use": "svg-cat-cosmetics-manicure-usage",
  "viewBox": "0 0 30 38",
  "content": "<symbol viewBox=\"0 0 30 38\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cosmetics-manicure\">\n<path class=\"p-FDE4E4\" d=\"M20.1875 12.2461V38H0V12.2461C0 6.70195 4.54961 2.22656 10.0938 2.22656C12.8547 2.22656 15.3707 3.33984 17.1742 5.16562C19 6.96914 20.1875 9.48516 20.1875 12.2461Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FCCED3\" d=\"M20.1875 12.2461V38H10.0938V2.22656C12.8547 2.22656 15.3707 3.33984 17.1742 5.16562C19 6.96914 20.1875 9.48516 20.1875 12.2461Z\" fill=\"#65B3E7\" />\n<path class=\"p-FCCED3\" d=\"M15.6602 25.375H4.52734V26.7931H15.6602V25.375Z\" fill=\"#58ADE5\" />\n<path class=\"p-FCCED3\" d=\"M15.6602 29.8281H4.52734V31.2462H15.6602V29.8281Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFB64C\" d=\"M25.7539 8.90625H23.5273C23.5273 7.06459 22.0292 5.56641 20.1875 5.56641V3.33984C22.0292 3.33984 23.5273 1.84166 23.5273 0H25.7539C25.7539 1.84166 27.2521 3.33984 29.0938 3.33984V5.56641C27.2521 5.56641 25.7539 7.06459 25.7539 8.90625ZM22.7156 4.45312C23.1385 4.77056 24.3232 5.95528 24.6406 6.37818C24.9581 5.95528 26.1428 4.77056 26.5657 4.45312C26.1428 4.13569 24.9581 2.95097 24.6406 2.52807C24.3232 2.95097 23.1385 4.13569 22.7156 4.45312Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF5093\" d=\"M15.6602 5.56641V17.4637C15.304 17.5973 13.1219 19 10.0938 19.0445H9.98242C7.93406 19.0445 6.37539 18.4434 4.52734 17.5304V5.56641C4.52734 2.49375 7.02109 0 10.0938 0C13.1664 0 15.6602 2.49375 15.6602 5.56641Z\" fill=\"#58ADE5\" />\n<path class=\"p-F23055\" d=\"M15.6602 5.56641V17.4637C15.304 17.5973 13.1219 19 10.0938 19.0445V0C13.1664 0 15.6602 2.49375 15.6602 5.56641Z\" fill=\"#4D98CB\" />\n<path class=\"p-FAAAAA\" d=\"M15.6602 25.375H10.0938V26.7931H15.6602V25.375Z\" fill=\"#4D98CB\" />\n<path class=\"p-FAAAAA\" d=\"M15.6602 29.8281H10.0938V31.2462H15.6602V29.8281Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_cosmetics_manicure_result = browser_sprite_build_default.a.add(svg_cat_cosmetics_manicure_symbol);
/* harmony default export */ var svg_cat_cosmetics_manicure = (svg_cat_cosmetics_manicure_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cosmetics-parfume.svg


var svg_cat_cosmetics_parfume_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cosmetics-parfume",
  "use": "svg-cat-cosmetics-parfume-usage",
  "viewBox": "0 0 33 38",
  "content": "<symbol viewBox=\"0 0 33 38\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cosmetics-parfume\">\n<path class=\"p-596C76\" d=\"M7.62887 3.06372H4.36719V5.23817H7.62887V3.06372Z\" fill=\"#58ADE5\" />\n<path class=\"p-465A61\" d=\"M23.7034 11.8401L23.4529 11.3899C21.3453 7.59528 17.3394 5.23817 12.999 5.23817H11.9775V3.06372H12.999C18.1283 3.06372 22.8626 5.84977 25.3534 10.3335L25.604 10.7826L23.7034 11.8401Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFD396\" d=\"M13.0644 0H6.54102V8.49991H13.0644V0Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFB64C\" d=\"M13.0644 0H9.80273V8.49991H13.0644V0Z\" fill=\"#76B7E2\" />\n<path class=\"p-FFB64C\" d=\"M15.2395 8.302H4.36719V12.8488H15.2395V8.302Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF9100\" d=\"M15.2389 8.302H9.80273V12.8488H15.2389V8.302Z\" fill=\"#4D98CB\" />\n<path class=\"p-F2F2FC\" d=\"M19.61 21.0899L15.7177 25.2648L9.80326 24.9604L4.34538 24.6995L0.0400391 21.3507C0.235667 18.5675 1.06196 15.6537 2.9973 12.3051L3.30172 11.7615H8.71611L9.80333 13.9359L10.8906 11.7615H16.3049L16.6094 12.3051C18.4793 15.5451 19.3491 18.3936 19.61 21.0899Z\" fill=\"#A1D1FD\" />\n<path class=\"p-D8D8FC\" d=\"M19.6095 21.09L15.7172 25.2649L9.80273 24.9606V13.9362L10.89 11.7617H16.3044L16.6088 12.3053C18.4788 15.5453 19.3486 18.3938 19.6095 21.09Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFD2FE\" d=\"M19.653 23.8297C19.5008 27.0478 18.6309 30.3676 17.5873 34.0424C17.3046 35.0427 17.0219 36.0864 16.7174 37.1954L16.5 37.9999H3.32286L3.10535 37.1954C2.75751 35.9341 2.43127 34.7382 2.10517 33.6074C1.12667 30.2153 0.278558 27.1132 0.0611852 24.1342C-0.00412086 23.2208 -0.0258653 22.2858 0.0394407 21.3508C0.713521 20.9376 1.40935 20.5898 2.17033 20.3506C4.34478 19.6765 6.67145 19.8286 8.71544 20.742L9.80266 24.8082L10.8899 22.0249C12.3034 22.9382 14.0211 23.3296 15.7171 23.0903C17.1959 22.8512 18.5222 22.1553 19.6094 21.0899C19.6964 22.0249 19.6964 22.9165 19.653 23.8297Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFB6FA\" d=\"M19.653 23.8297C19.5008 27.0478 18.6309 30.3675 17.5873 34.0423C17.3046 35.0427 17.0219 36.0863 16.7174 37.1953L16.5 37.9998H9.80273V24.8082L10.89 22.0248C12.3034 22.9381 14.0212 23.3295 15.7172 23.0903C17.1959 22.8511 18.5223 22.1553 19.6095 21.0898C19.6964 22.0248 19.6964 22.9164 19.653 23.8297Z\" fill=\"#65B3E7\" />\n<path class=\"p-D8D8FC\" d=\"M10.8893 11.7617V22.0251L9.82381 23.569L9.80207 23.5037L8.71484 20.7422V11.7617H10.8893Z\" fill=\"#5FBEFF\" />\n<path class=\"p-A3A3D1\" d=\"M10.89 11.7617V22.0251L9.82448 23.569L9.80273 23.5037V11.7617H10.89Z\" fill=\"#76B7E2\" />\n<path class=\"p-FFB6FA\" d=\"M10.8893 22.025V33.6512H8.71484V20.7422C9.08443 20.9161 9.45423 21.1118 9.80207 21.3292C10.0194 21.4597 10.237 21.6119 10.4544 21.7641C10.5849 21.8728 10.7371 21.9381 10.8893 22.025Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF9AC9\" d=\"M10.89 22.0249V33.6511H9.80273V21.3291C10.0201 21.4596 10.2376 21.6118 10.4551 21.764C10.5855 21.8727 10.7377 21.938 10.89 22.0249Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9AC9\" d=\"M22.2718 18.4081C20.7513 15.1476 21.725 11.4654 24.441 10.1987C27.3651 8.83825 30.7055 10.7707 32.1248 13.8129C33.6453 17.0735 32.6716 20.7556 29.9557 22.0223C27.0347 23.3815 23.6929 21.4543 22.2718 18.4081Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_cosmetics_parfume_result = browser_sprite_build_default.a.add(svg_cat_cosmetics_parfume_symbol);
/* harmony default export */ var svg_cat_cosmetics_parfume = (svg_cat_cosmetics_parfume_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cosmetics-professional-tools.svg


var svg_cat_cosmetics_professional_tools_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cosmetics-professional-tools",
  "use": "svg-cat-cosmetics-professional-tools-usage",
  "viewBox": "0 0 33 33",
  "content": "<symbol viewBox=\"0 0 33 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cosmetics-professional-tools\">\n<path class=\"p-DABBA6\" d=\"M14.0187 33C11.3015 33 9.02988 30.9663 8.7334 28.268L10.6556 28.0565C10.8435 29.773 12.29 31.0664 14.0187 31.0664C15.8843 31.0664 17.4025 29.5482 17.4025 27.6826V26.2324C17.4025 23.5662 19.5711 21.3984 22.2365 21.3984C24.9018 21.3984 27.0704 23.5662 27.0704 26.2324C27.0704 27.8318 28.3715 29.1328 29.9708 29.1328H33.0001V31.0664H29.9708C27.3055 31.0664 25.1369 28.8987 25.1369 26.2324C25.1369 24.6331 23.8358 23.332 22.2365 23.332C20.6371 23.332 19.3361 24.6331 19.3361 26.2324V27.6826C19.3361 30.6151 16.9502 33 14.0187 33Z\" fill=\"#5FBEFF\" />\n<path class=\"p-DABBA6\" d=\"M12.1367 15.5707L13.0016 21.232L16.0548 18.7297V15.1621L12.1367 15.5707Z\" fill=\"#5FBEFF\" />\n<path class=\"p-F4D7AF\" d=\"M5.80078 16.4354V25.2655C5.80078 27.3974 7.53515 29.1327 9.66797 29.1327C11.8008 29.1327 13.5352 27.3974 13.5352 25.2655V16.2258L5.80078 16.4354Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF7A53\" d=\"M25.9488 7.25098L25.5428 8.70117L24.1699 13.5352C20.8249 14.85 16.5516 17.4023 9.45527 17.4023H8.70117C3.90592 17.4023 0 13.4964 0 8.70117C0 3.90579 3.90592 0 8.70117 0H9.45527C16.3389 0 20.3607 2.35892 24.1699 3.86719L25.9488 7.25098Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF3B62\" d=\"M25.5428 8.70117L24.1699 13.5352C20.8249 14.85 16.5516 17.4023 9.45527 17.4023H8.70117C3.90592 17.4023 0 13.4964 0 8.70117H25.5428Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFB6FA\" d=\"M33 2.0835L24.1699 3.86728V13.5352L33 15.319V2.0835Z\" fill=\"#AFD9F6\" />\n<path class=\"p-F4D7AF\" d=\"M11.6016 11.6016H5.80078V13.5352H11.6016V11.6016Z\" fill=\"#58ADE5\" />\n<path class=\"p-FAECD8\" d=\"M11.6016 7.73438H5.80078V9.66797H11.6016V7.73438Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FAECD8\" d=\"M11.6016 3.86719H5.80078V5.80078H11.6016V3.86719Z\" fill=\"#5FBEFF\" />\n<path class=\"p-F4D7AF\" d=\"M11.6016 8.70117H5.80078V9.66797H11.6016V8.70117Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF7CB9\" d=\"M33 8.70117H24.1699V13.5352L33 15.3189V8.70117Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_cosmetics_professional_tools_result = browser_sprite_build_default.a.add(svg_cat_cosmetics_professional_tools_symbol);
/* harmony default export */ var svg_cat_cosmetics_professional_tools = (svg_cat_cosmetics_professional_tools_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-cosmetics-skin.svg


var svg_cat_cosmetics_skin_symbol = new browser_symbol_default.a({
  "id": "svg-cat-cosmetics-skin",
  "use": "svg-cat-cosmetics-skin-usage",
  "viewBox": "0 0 24 34",
  "content": "<symbol viewBox=\"0 0 24 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-cosmetics-skin\">\n<path class=\"p-7FEFEF\" d=\"M21.0055 4.48986L18.6321 6.86273L17.8031 6.0338L20.2335 3.60339C18.0195 1.30122 14.9634 0 11.7693 0C8.57527 0 5.51887 1.30122 3.30514 3.60339L5.73554 6.0338L4.90661 6.86273L2.53288 4.48986C0.891332 6.56075 -0.00142944 9.12655 1.71802e-06 11.7693V16.4327C0.00229158 19.9402 0.93255 23.385 2.69661 26.4168L4.90719 24.2062L5.73612 25.0351L3.33262 27.4386C4.89803 29.8015 6.9506 31.8025 9.35296 33.307C10.8314 34.2309 12.7073 34.2309 14.1857 33.307C16.5895 31.8034 18.6438 29.8029 20.2106 27.4398L17.8071 25.0363L18.6361 24.2073L20.8467 26.4179C22.6107 23.3861 23.541 19.9413 23.5433 16.4338V11.7693C23.5433 9.12598 22.6491 6.56018 21.0055 4.48986ZM13.852 21.1621L14.3761 22.2114C12.7339 23.0266 10.8047 23.0266 9.16233 22.2114L9.68642 21.1621C10.9985 21.8144 12.5402 21.8144 13.852 21.1621ZM2.97626 15.2414C2.97626 13.6227 4.55082 12.3103 6.49349 12.3103C8.43616 12.3103 10.0107 13.6227 10.0107 15.2414C10.0107 16.86 8.43616 18.1724 6.49349 18.1724C4.55082 18.1724 2.97626 16.86 2.97626 15.2414ZM12.9418 29.3103H10.5969C9.62574 29.3103 8.83831 28.5229 8.83831 27.5517C8.83831 26.5805 9.62574 25.7931 10.5969 25.7931H12.9418C13.9129 25.7931 14.7004 26.5805 14.7004 27.5517C14.7004 28.5229 13.9129 29.3103 12.9418 29.3103ZM17.0452 18.1724C15.1025 18.1724 13.528 16.86 13.528 15.2414C13.528 13.6227 15.1025 12.3103 17.0452 12.3103C18.9879 12.3103 20.5624 13.6227 20.5624 15.2414C20.5624 16.86 18.9879 18.1724 17.0452 18.1724Z\" fill=\"#65B3E7\" />\n<path class=\"p-6ACCCA\" d=\"M21.0057 4.48986L18.6323 6.86273L17.8033 6.0338L20.2337 3.60339C18.0212 1.29922 14.9639 -0.00228685 11.7695 3.01649e-06L13.9349 2.33195C16.6538 5.2624 18.4525 8.92676 19.1071 12.8702C19.977 13.3482 20.53 14.2493 20.5626 15.2414C20.54 16.133 20.0863 16.9585 19.3456 17.4554C19.1352 20.9795 18.014 24.3888 16.0922 27.3499L11.7695 33.9999C12.6239 33.9999 13.4612 33.7598 14.1859 33.307C16.5897 31.8034 18.644 29.8029 20.2108 27.4398L17.8073 25.0363L18.6363 24.2073L20.8468 26.4179C22.6109 23.3861 23.5412 19.9413 23.5435 16.4338V11.7693C23.5435 9.12598 22.6493 6.56018 21.0057 4.48986Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_cosmetics_skin_result = browser_sprite_build_default.a.add(svg_cat_cosmetics_skin_symbol);
/* harmony default export */ var svg_cat_cosmetics_skin = (svg_cat_cosmetics_skin_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-electr-appliances.svg


var svg_cat_electr_appliances_symbol = new browser_symbol_default.a({
  "id": "svg-cat-electr-appliances",
  "use": "svg-cat-electr-appliances-usage",
  "viewBox": "0 0 34 23",
  "content": "<symbol viewBox=\"0 0 34 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-electr-appliances\">\n<path class=\"p-03232E\" d=\"M31.2392 19.8872H29.2871V23H31.2392V19.8872Z\" fill=\"#4D98CB\" />\n<path class=\"p-8EA8D4\" d=\"M23.7119 2.8479L25.0143 20.8638H33.3152V4.15032L23.7119 2.8479Z\" fill=\"#65B3E7\" />\n<path class=\"p-07485E\" d=\"M29.2262 7.3252H29.103C28.5639 7.3252 28.127 7.76218 28.127 8.30123C28.127 8.84028 28.5639 9.27726 29.103 9.27726H29.2262C29.7652 9.27726 30.2022 8.84028 30.2022 8.30123C30.2022 7.76218 29.7652 7.3252 29.2262 7.3252Z\" fill=\"#4D98CB\" />\n<path class=\"p-07485E\" d=\"M29.2262 11.4753H29.103C28.5639 11.4753 28.127 11.9123 28.127 12.4514C28.127 12.9904 28.5639 13.4274 29.103 13.4274H29.2262C29.7652 13.4274 30.2022 12.9904 30.2022 12.4514C30.2022 11.9123 29.7652 11.4753 29.2262 11.4753Z\" fill=\"#4D98CB\" />\n<path class=\"p-07485E\" d=\"M29.2262 15.6255H29.103C28.5639 15.6255 28.127 16.0625 28.127 16.6015C28.127 17.1406 28.5639 17.5776 29.103 17.5776H29.2262C29.7652 17.5776 30.2022 17.1406 30.2022 16.6015C30.2022 16.0625 29.7652 15.6255 29.2262 15.6255Z\" fill=\"#4D98CB\" />\n<path class=\"p-2682FF\" d=\"M33.3152 0H25.0143L23.7119 4.15042H33.3152V0Z\" fill=\"#4D98CB\" />\n<path class=\"p-07485E\" d=\"M4.02824 19.8872H2.07617V23H4.02824V19.8872Z\" fill=\"#58ADE5\" />\n<path class=\"p-EFE2DD\" d=\"M25.014 0H16.6569L15.3545 10.432L16.6569 20.8639H25.014V0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFF5F5\" d=\"M16.6572 0H0V20.864H16.6572V0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-03232E\" d=\"M21.8437 5.17017C21.8437 4.0656 20.9483 3.17017 19.8437 3.17017H16.6569L15.3545 9.45504L16.6569 17.6935H19.8438C20.9483 17.6935 21.8437 16.798 21.8437 15.6935V5.17017Z\" fill=\"#4D98CB\" />\n<path class=\"p-07485E\" d=\"M16.6568 3.17017H5.16992C4.06535 3.17017 3.16992 4.0656 3.16992 5.17017V15.6935C3.16992 16.798 4.06535 17.6935 5.16992 17.6935H16.6568V3.17017Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_electr_appliances_result = browser_sprite_build_default.a.add(svg_cat_electr_appliances_symbol);
/* harmony default export */ var svg_cat_electr_appliances = (svg_cat_electr_appliances_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-electr-care.svg


var svg_cat_electr_care_symbol = new browser_symbol_default.a({
  "id": "svg-cat-electr-care",
  "use": "svg-cat-electr-care-usage",
  "viewBox": "0 0 25 30",
  "content": "<symbol viewBox=\"0 0 25 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-electr-care\">\n<path class=\"p-D2C5C2\" d=\"M22.1407 9.54237C18.434 9.54237 17.8849 0 12.1505 0C6.41223 0 5.01089 5.25249 1.30233 5.25249H0L5.49167 15.8788H18.8091L23.443 9.54237H22.1407Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BDACA8\" d=\"M22.1406 9.54237C18.4339 9.54237 17.8848 0 12.1504 0L12.1522 15.8788H18.809L23.4429 9.54237H22.1406Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FEE195\" d=\"M20.1051 25.2538C17.4794 25.2538 14.9134 24.7574 12.4781 23.7785C9.90341 22.7442 7.09459 22.177 4.19558 22.177H0.138672V29.9999H24.162V25.2538H20.1051Z\" fill=\"#A1D1FD\" />\n<path class=\"p-F5C23B\" d=\"M20.1051 25.2538C16.9569 25.2538 14.6706 24.6166 12.1504 23.6516V29.9998H24.1621V25.2538H20.1051Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FD935C\" d=\"M0.138672 14.1211V23.9348H4.19558C6.75607 23.9348 9.35021 24.4164 11.8226 25.4095C14.4671 26.4726 17.2537 27.0117 20.1051 27.0117H24.162V14.1211H0.138672Z\" fill=\"#65B3E7\" />\n<path class=\"p-FD7560\" d=\"M12.1523 14.1211V25.5377C14.6986 26.515 17.3722 27.0117 20.1055 27.0117H24.1624V14.1211H12.1523Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_electr_care_result = browser_sprite_build_default.a.add(svg_cat_electr_care_symbol);
/* harmony default export */ var svg_cat_electr_care = (svg_cat_electr_care_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-electr-cigarets.svg


var svg_cat_electr_cigarets_symbol = new browser_symbol_default.a({
  "id": "svg-cat-electr-cigarets",
  "use": "svg-cat-electr-cigarets-usage",
  "viewBox": "0 0 33 35",
  "content": "<symbol viewBox=\"0 0 33 35\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-electr-cigarets\">\n<path class=\"p-804231\" d=\"M20.5762 14.4238H30.8301V20.5762H20.5762V14.4238Z\" fill=\"#5FBEFF\" />\n<path class=\"p-582B1F\" d=\"M25.7031 14.4238H30.8301V20.5762H25.7031V14.4238Z\" fill=\"#4D98CB\" />\n<path class=\"p-804231\" d=\"M30.8301 14.4238H20.5762L22.627 4.10156H28.7793L30.8301 14.4238Z\" fill=\"#5FBEFF\" />\n<path class=\"p-582B1F\" d=\"M30.8301 14.4238H25.7031V4.10156H28.7793L30.8301 14.4238Z\" fill=\"#4D98CB\" />\n<path class=\"p-DEECF1\" d=\"M16.4746 6.15234V14.4238L14.4238 16.4746L12.373 14.4238V6.15234L14.4238 4.10156L16.4746 6.15234Z\" fill=\"#A1D1FD\" />\n<path class=\"p-A8D3D8\" d=\"M16.4746 6.15234V14.4238L14.4238 16.4746V4.10156L16.4746 6.15234Z\" fill=\"#5FBEFF\" />\n<path class=\"p-99503D\" d=\"M13.3984 0H15.4492V3.07617H13.3984V0Z\" fill=\"#5FBEFF\" />\n<path class=\"p-804231\" d=\"M16.4746 14.4238V18.5254L14.4238 19.1406L9.62505 20.5762L0 18.5254L4.10156 14.4238H16.4746Z\" fill=\"#5FBEFF\" />\n<path class=\"p-663325\" d=\"M14.4238 0H15.4492V3.07617H14.4238V0Z\" fill=\"#4D98CB\" />\n<path class=\"p-582B1F\" d=\"M14.4238 14.4238H16.4746V18.5254L14.4238 19.1406V14.4238Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDBF00\" d=\"M0 18.5254H16.4746V35H0V18.5254Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF7816\" d=\"M14.4238 18.5254H16.4746V35H14.4238V18.5254Z\" fill=\"#5FBEFF\" />\n<path class=\"p-804231\" d=\"M12.373 2.05078H16.4746V6.15234H12.373V2.05078Z\" fill=\"#5FBEFF\" />\n<path class=\"p-582B1F\" d=\"M14.4238 2.05078H16.4746V6.15234H14.4238V2.05078Z\" fill=\"#4D98CB\" />\n<path class=\"p-99503D\" d=\"M18.5254 14.4238C18.5254 13.2912 19.4436 12.373 20.5762 12.373H30.8301C31.9627 12.373 32.8809 13.2912 32.8809 14.4238C32.8809 15.5564 31.9627 16.4746 30.8301 16.4746H20.5762C19.4436 16.4746 18.5254 15.5564 18.5254 14.4238Z\" fill=\"#A1D1FD\" />\n<path class=\"p-663325\" d=\"M25.7031 12.373H30.8301C31.9627 12.373 32.8809 13.2912 32.8809 14.4238C32.8809 15.5564 31.9627 16.4746 30.8301 16.4746H25.7031V12.373Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FDBF00\" d=\"M32.8809 18.5254V35H18.5254V30.8984L20.5762 28.8477V24.6777L18.5254 22.627V18.5254H32.8809Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF7816\" d=\"M25.7031 18.5254H32.8809V35H25.7031V18.5254Z\" fill=\"#5FBEFF\" />\n<path class=\"p-DEECF1\" d=\"M18.5254 22.627H28.7793V30.8984H18.5254V22.627Z\" fill=\"#B9DFFC\" />\n<path class=\"p-A8D3D8\" d=\"M25.7031 22.627H28.7793V30.8984H25.7031V22.627Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_electr_cigarets_result = browser_sprite_build_default.a.add(svg_cat_electr_cigarets_symbol);
/* harmony default export */ var svg_cat_electr_cigarets = (svg_cat_electr_cigarets_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-electr-comp.svg


var svg_cat_electr_comp_symbol = new browser_symbol_default.a({
  "id": "svg-cat-electr-comp",
  "use": "svg-cat-electr-comp-usage",
  "viewBox": "0 0 16 32",
  "content": "<symbol viewBox=\"0 0 16 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-electr-comp\">\n<path class=\"p-ACABB1\" d=\"M14 6.4V0H11.6V2C11.6 2.66274 11.0627 3.2 10.4 3.2C9.73726 3.2 9.2 2.66274 9.2 2V0H6.8V2C6.8 2.66274 6.26274 3.2 5.6 3.2C4.93726 3.2 4.4 2.66274 4.4 2V0H2V6.4H8H14Z\" fill=\"#B9DFFC\" />\n<path class=\"p-565659\" d=\"M6.80039 0H4.40039V2C4.40039 2.66274 4.93765 3.2 5.60039 3.2C6.26313 3.2 6.80039 2.66274 6.80039 2V0Z\" fill=\"#4D98CB\" />\n<path class=\"p-565659\" d=\"M11.6002 0H9.2002V1.99999C9.2002 2.66274 9.73746 3.2 10.4002 3.2C11.0629 3.2 11.6002 2.66274 11.6002 1.99999V0Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDA44\" d=\"M4 23.9999C4 21.7908 5.79088 19.9999 8 19.9999C8 13.274 8 6.3999 8 6.3999H2H0V23.9999C0 28.4181 3.58168 31.9999 8 31.9999C8 31.1883 8 29.7685 8 27.9999C5.79088 27.9999 4 26.209 4 23.9999Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF9811\" d=\"M14 6.3999H8C8 6.3999 8 13.274 8 19.9999C10.2091 19.9999 11.1351 21.7908 11.1351 23.9999C11.1351 26.209 10.2091 27.9999 8 27.9999C8 29.7685 8 31.1883 8 31.9999C12.4182 31.9999 16 28.4181 16 23.9999V6.3999H14Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFFFFF\" d=\"M7.99971 27.9999C10.2088 27.9999 11.7835 26.5945 11.6754 23.3512C11.6754 21.1421 10.2088 17.4053 7.99971 17.4053C5.79057 17.4053 3.8916 20.2772 3.8916 23.3512C3.8916 26.4252 5.79057 27.9999 7.99971 27.9999Z\" fill=\"white\" />\n</symbol>"
});
var svg_cat_electr_comp_result = browser_sprite_build_default.a.add(svg_cat_electr_comp_symbol);
/* harmony default export */ var svg_cat_electr_comp = (svg_cat_electr_comp_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-electr-household.svg


var svg_cat_electr_household_symbol = new browser_symbol_default.a({
  "id": "svg-cat-electr-household",
  "use": "svg-cat-electr-household-usage",
  "viewBox": "0 0 32 34",
  "content": "<symbol viewBox=\"0 0 32 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-electr-household\">\n<path class=\"p-088690\" d=\"M27.1855 33.6853C27.7279 33.5116 28.0268 32.9309 27.8531 32.3884L23.7093 19.4519L21.7447 20.0812L24.3395 28.1818H7.49969L10.0942 20.0812L8.12962 19.452L4.67285 30.2447H25.0003L25.8885 33.0177C26.0623 33.5602 26.6429 33.8591 27.1855 33.6853Z\" fill=\"#4D98CB\" />\n<path class=\"p-088690\" d=\"M18.8753 11.2142V2.95523C18.8753 1.3231 17.5522 0 15.9201 0C14.2879 0 12.9648 1.3231 12.9648 2.95523V11.2142C12.9648 12.8463 14.2879 14.1694 15.9201 14.1694C17.5522 14.1694 18.8753 12.8463 18.8753 11.2142Z\" fill=\"#4D98CB\" />\n<path class=\"p-0BAEBC\" d=\"M15.9201 14.1694V0C14.288 0 12.9648 1.32312 12.9648 2.95528V14.1694H15.9201Z\" fill=\"#58ADE5\" />\n<path class=\"p-B5CDDF\" d=\"M19.1247 3.25024H12.7134C7.62334 3.25024 3.49707 7.37645 3.49707 12.4665V14.1695V15.8724C3.49707 20.9625 7.62334 25.0887 12.7134 25.0887H19.1247C24.2147 25.0887 28.341 20.9625 28.341 15.8724V14.1695V12.4665C28.341 7.37645 24.2147 3.25024 19.1247 3.25024Z\" fill=\"#A1D1FD\" />\n<path class=\"p-C9E5F9\" d=\"M12.7134 3.25024C7.62334 3.25024 3.49707 7.37645 3.49707 12.4665V14.1695V15.8724C3.49707 20.9624 7.62334 25.0887 12.7134 25.0887H15.919V14.1695V3.25024H12.7134Z\" fill=\"#B9DFFC\" />\n<path class=\"p-088690\" d=\"M30.8067 13.1377H1.03145C0.461797 13.1377 0 13.5995 0 14.1691C0 14.7388 0.461796 15.2006 1.03145 15.2006H30.8067C31.3763 15.2006 31.8381 14.7388 31.8381 14.1691C31.8381 13.5995 31.3763 13.1377 30.8067 13.1377Z\" fill=\"#4D98CB\" />\n<path class=\"p-0BAEBC\" d=\"M15.9194 13.1377H1.03145C0.461797 13.1377 0 13.5995 0 14.1691C0 14.7388 0.461796 15.2006 1.03145 15.2006H15.9194V13.1377Z\" fill=\"#58ADE5\" />\n<path class=\"p-EE2712\" d=\"M5.84519 33.6852C7.84801 33.6852 9.47162 32.0616 9.47162 30.0588C9.47162 28.056 7.84801 26.4324 5.84519 26.4324C3.84236 26.4324 2.21875 28.056 2.21875 30.0588C2.21875 32.0616 3.84236 33.6852 5.84519 33.6852Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF5D3D\" d=\"M5.84518 26.4324C3.84231 26.4324 2.21875 28.0559 2.21875 30.0588C2.21875 32.0617 3.84231 33.6852 5.84518 33.6852V26.4324Z\" fill=\"#5FBEFF\" />\n<path class=\"p-B5CDDF\" d=\"M5.84534 31.3452C5.13579 31.3452 4.55859 30.768 4.55859 30.0585C4.55859 29.349 5.13586 28.7717 5.84534 28.7717C6.55483 28.7717 7.13209 29.349 7.13209 30.0585C7.13209 30.768 6.55489 31.3452 5.84534 31.3452Z\" fill=\"#A1D1FD\" />\n<path class=\"p-C9E5F9\" d=\"M5.84534 28.7717C5.13579 28.7717 4.55859 29.3491 4.55859 30.0585C4.55859 30.768 5.13586 31.3453 5.84534 31.3453V28.7717Z\" fill=\"#B9DFFC\" />\n</symbol>"
});
var svg_cat_electr_household_result = browser_sprite_build_default.a.add(svg_cat_electr_household_symbol);
/* harmony default export */ var svg_cat_electr_household = (svg_cat_electr_household_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-electr-mobile.svg


var svg_cat_electr_mobile_symbol = new browser_symbol_default.a({
  "id": "svg-cat-electr-mobile",
  "use": "svg-cat-electr-mobile-usage",
  "viewBox": "0 0 30 24",
  "content": "<symbol viewBox=\"0 0 30 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-electr-mobile\">\n<path class=\"p-515BE0\" d=\"M13.7227 4.1001H12.001V7.7608H13.7227V4.1001Z\" fill=\"#65B3E7\" />\n<path class=\"p-00347B\" d=\"M17.3828 4.1001H15.6611V7.7608H17.3828V4.1001Z\" fill=\"#65B3E7\" />\n<path class=\"p-515BE0\" d=\"M29.3837 18.23C29.3837 13.6729 27.1789 9.49166 23.6172 6.89898L14.6917 6.89893L13.543 15.4584L14.6917 24H29.3837V18.23Z\" fill=\"#A1D1FD\" />\n<path class=\"p-65B3E7\" d=\"M5.7666 6.89893C2.20483 9.4916 0 13.6728 0 18.23V24H14.692V6.89893H5.7666Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFF5F5\" d=\"M11.0857 10.9285H10.9771C10.5016 10.9285 10.1162 11.3139 10.1162 11.7893C10.1162 12.2648 10.5016 12.6502 10.9771 12.6502H11.0857C11.5611 12.6502 11.9466 12.2648 11.9466 11.7893C11.9466 11.3139 11.5611 10.9285 11.0857 10.9285Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFF5F5\" d=\"M14.7468 10.9285H14.6382C14.1628 10.9285 13.7773 11.3139 13.7773 11.7893C13.7773 12.2648 14.1628 12.6502 14.6382 12.6502H14.7468C15.2223 12.6502 15.6077 12.2648 15.6077 11.7893C15.6077 11.3139 15.2223 10.9285 14.7468 10.9285Z\" fill=\"#65B3E7\" />\n<path class=\"p-E1D3CE\" d=\"M18.407 10.9285H18.2984C17.8229 10.9285 17.4375 11.3139 17.4375 11.7893C17.4375 12.2648 17.8229 12.6502 18.2984 12.6502H18.407C18.8824 12.6502 19.2679 12.2648 19.2679 11.7893C19.2679 11.3139 18.8824 10.9285 18.407 10.9285Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFF5F5\" d=\"M11.0857 14.5891H10.9771C10.5016 14.5891 10.1162 14.9745 10.1162 15.45C10.1162 15.9254 10.5016 16.3108 10.9771 16.3108H11.0857C11.5611 16.3108 11.9466 15.9254 11.9466 15.45C11.9466 14.9745 11.5611 14.5891 11.0857 14.5891Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFF5F5\" d=\"M14.7468 14.5891H14.6382C14.1628 14.5891 13.7773 14.9745 13.7773 15.45C13.7773 15.9254 14.1628 16.3108 14.6382 16.3108H14.7468C15.2223 16.3108 15.6077 15.9254 15.6077 15.45C15.6077 14.9745 15.2223 14.5891 14.7468 14.5891Z\" fill=\"#65B3E7\" />\n<path class=\"p-E1D3CE\" d=\"M18.407 14.5891H18.2984C17.8229 14.5891 17.4375 14.9745 17.4375 15.45C17.4375 15.9254 17.8229 16.3108 18.2984 16.3108H18.407C18.8824 16.3108 19.2679 15.9254 19.2679 15.45C19.2679 14.9745 18.8824 14.5891 18.407 14.5891Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFF5F5\" d=\"M11.0857 18.2495H10.9771C10.5016 18.2495 10.1162 18.6349 10.1162 19.1104C10.1162 19.5858 10.5016 19.9712 10.9771 19.9712H11.0857C11.5611 19.9712 11.9466 19.5858 11.9466 19.1104C11.9466 18.6349 11.5611 18.2495 11.0857 18.2495Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFF5F5\" d=\"M14.7468 18.2495H14.6382C14.1628 18.2495 13.7773 18.6349 13.7773 19.1104C13.7773 19.5858 14.1628 19.9712 14.6382 19.9712H14.7468C15.2223 19.9712 15.6077 19.5858 15.6077 19.1104C15.6077 18.6349 15.2223 18.2495 14.7468 18.2495Z\" fill=\"#65B3E7\" />\n<path class=\"p-E1D3CE\" d=\"M18.407 18.2495H18.2984C17.8229 18.2495 17.4375 18.6349 17.4375 19.1104C17.4375 19.5858 17.8229 19.9712 18.2984 19.9712H18.407C18.8824 19.9712 19.2679 19.5858 19.2679 19.1104C19.2679 18.6349 18.8824 18.2495 18.407 18.2495Z\" fill=\"#65B3E7\" />\n<path class=\"p-00347B\" d=\"M24.0701 0H14.6917L13.543 2.24299L14.6917 4.96147H20.1827V6.62212C20.1827 7.72669 21.0781 8.62212 22.1827 8.62212H25.5533C26.6579 8.62212 27.5533 7.72669 27.5533 6.62212V3.48315C27.5533 1.55947 25.9939 0 24.0701 0Z\" fill=\"#65B3E7\" />\n<path class=\"p-515BE0\" d=\"M5.31426 0C3.39053 0 1.83105 1.55947 1.83105 3.4832V6.62218C1.83105 7.72675 2.72649 8.62218 3.83105 8.62218H7.20166C8.30623 8.62218 9.20166 7.72675 9.20166 6.62218V4.96153H14.6927V0H5.31426Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_electr_mobile_result = browser_sprite_build_default.a.add(svg_cat_electr_mobile_symbol);
/* harmony default export */ var svg_cat_electr_mobile = (svg_cat_electr_mobile_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-electronics.svg


var svg_cat_electronics_symbol = new browser_symbol_default.a({
  "id": "svg-cat-electronics",
  "use": "svg-cat-electronics-usage",
  "viewBox": "0 0 31 37",
  "content": "<symbol viewBox=\"0 0 31 37\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-electronics\">\n<path class=\"p-03232E\" d=\"M21.2538 4.60952C21.2538 2.06375 19.19 0 16.6443 0H12.735L11.2861 6.05841L21.2538 4.60952Z\" fill=\"#4D98CB\" />\n<path class=\"p-07485E\" d=\"M12.7355 0H8.82631C6.28055 0 4.2168 2.06375 4.2168 4.60952L12.7355 6.05841V0Z\" fill=\"#58ADE5\" />\n<path class=\"p-07485E\" d=\"M25.01 23.7587H22.0049V21.5871H25.01C26.8347 21.5871 28.3193 20.1026 28.3193 18.2778V8.00022H23.9758V5.82861H30.4909V18.2778C30.4909 21.2999 28.0322 23.7587 25.01 23.7587Z\" fill=\"#4D98CB\" />\n<path class=\"p-7ED8F6\" d=\"M18.9493 4.60938L16.6445 27.7809H20.8611C25.4706 23.643 25.4706 4.60938 25.4706 4.60938H18.9493Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BDFDFF\" d=\"M11.2861 29.2298L16.6443 27.7809C18.949 25.7119 18.949 4.60938 18.949 4.60938H12.735L11.2861 29.2298Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BDFDFF\" d=\"M6.52132 4.60938H0C0 4.60938 0 23.643 4.60951 27.7809H8.82604L6.52132 4.60938Z\" fill=\"#B9DFFC\" />\n<path class=\"p-7ED8F6\" d=\"M12.7355 4.60938H6.52148C6.52148 4.60938 6.52148 25.712 8.82621 27.7809L12.7355 29.2298V4.60938Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E30000\" d=\"M20.8608 27.7812H16.6443H12.735L11.2861 32.3907L12.735 37.0002H23.9338L20.8608 27.7812Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF6426\" d=\"M8.82563 27.7812H4.6091L1.53613 37.0002H12.7349V27.7812H8.82563Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E1EBF0\" d=\"M10.4972 31.3047H10.3641C9.76445 31.3047 9.27832 31.7908 9.27832 32.3905C9.27832 32.9902 9.76445 33.4763 10.3641 33.4763H10.4972C11.0969 33.4763 11.583 32.9902 11.583 32.3905C11.583 31.7908 11.0969 31.3047 10.4972 31.3047Z\" fill=\"#58ADE5\" />\n<path class=\"p-B4D2D7\" d=\"M15.1066 31.3047H14.9735C14.3738 31.3047 13.8877 31.7908 13.8877 32.3905C13.8877 32.9902 14.3738 33.4763 14.9735 33.4763H15.1066C15.7063 33.4763 16.1924 32.9902 16.1924 32.3905C16.1924 31.7908 15.7063 31.3047 15.1066 31.3047Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_electronics_result = browser_sprite_build_default.a.add(svg_cat_electronics_symbol);
/* harmony default export */ var svg_cat_electronics = (svg_cat_electronics_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-garden-decor.svg


var svg_cat_garden_decor_symbol = new browser_symbol_default.a({
  "id": "svg-cat-garden-decor",
  "use": "svg-cat-garden-decor-usage",
  "viewBox": "0 0 34 34",
  "content": "<symbol viewBox=\"0 0 34 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-garden-decor\">\n<path class=\"p-F30051\" d=\"M16.6794 29.8164H9.79391C8.51299 29.8164 7.40795 29.0367 6.97839 27.8299C6.54908 26.6232 6.91328 25.3208 7.90626 24.5114L10.7376 22.2043L11.9962 23.7488L9.16461 26.0559C8.65904 26.4678 8.80015 27.0066 8.8554 27.162C8.91065 27.3174 9.14152 27.8242 9.79391 27.8242H16.6794V29.8164Z\" fill=\"#4D98CB\" />\n<path class=\"p-D20041\" d=\"M11.3662 27.8242H16.6787V29.8164H11.3662V27.8242Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF0059\" d=\"M10.3701 22.9766H12.3623V34H10.3701V22.9766Z\" fill=\"#5FBEFF\" />\n<path class=\"p-F30051\" d=\"M11.3662 22.9766H12.3623V34H11.3662V22.9766Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF0059\" d=\"M33.0811 7.90234H31.0889V6.97266C31.0889 6.42351 30.6419 5.97656 30.0928 5.97656H28.2998V3.98438H30.0928C31.7405 3.98438 33.0811 5.32495 33.0811 6.97266V7.90234Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF3980\" d=\"M5.72171 22.0469H0V21.0508C0 18.3046 2.23421 17.9082 4.98047 17.9082H6.64062L5.72171 22.0469Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF0059\" d=\"M18.8145 21.9805H17.0107V16.9228H20.6523C21.5677 16.9228 22.3125 15.2592 22.3125 14.3438V7.63672H26.4512V14.3438C26.4512 18.5546 23.0253 21.9805 18.8145 21.9805Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF5CA8\" d=\"M16.0146 23.9727H6.71777C5.07007 23.9727 3.72949 22.6321 3.72949 20.9844V18.3281C3.72949 14.1173 7.15538 10.6914 11.3662 10.6914C15.577 10.6914 19.0029 14.1173 19.0029 18.3281V20.9844C19.0029 22.6321 17.6624 23.9727 16.0146 23.9727Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF3980\" d=\"M11.3662 10.6914V23.9727H16.0146C17.6624 23.9727 19.0029 22.6321 19.0029 20.9844V18.3281C19.0029 14.1173 15.577 10.6914 11.3662 10.6914Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF7CB9\" d=\"M11.3662 23.9727L5.87598 24.8916L6.7949 21.2392C6.7949 19.2253 9.35218 16.668 11.3662 16.668C13.3801 16.668 15.0185 18.3063 15.0185 20.3203C15.0185 22.3343 13.3801 23.9727 11.3662 23.9727Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF3980\" d=\"M24.3154 9.96094C21.5692 9.96094 19.335 7.72673 19.335 4.98047C19.335 2.23421 21.5692 0 24.3154 0C27.0617 0 29.2959 2.23421 29.2959 4.98047C29.2959 7.72673 27.0617 9.96094 24.3154 9.96094Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF5CA8\" d=\"M15.0186 20.3203C15.0186 18.3063 13.3802 16.668 11.3662 16.668V23.9727C13.3802 23.9727 15.0186 22.3343 15.0186 20.3203Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_garden_decor_result = browser_sprite_build_default.a.add(svg_cat_garden_decor_symbol);
/* harmony default export */ var svg_cat_garden_decor = (svg_cat_garden_decor_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-garden-fertilizers.svg


var svg_cat_garden_fertilizers_symbol = new browser_symbol_default.a({
  "id": "svg-cat-garden-fertilizers",
  "use": "svg-cat-garden-fertilizers-usage",
  "viewBox": "0 0 35 32",
  "content": "<symbol viewBox=\"0 0 35 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-garden-fertilizers\">\n<path class=\"p-EFE2DD\" d=\"M28.1255 9.17279H6.23633C7.68027 4.6527 11.9073 0 17.1809 0C22.4545 0 26.6816 4.6527 28.1255 9.17279Z\" fill=\"#B9DFFC\" />\n<path class=\"p-CDBFBA\" d=\"M28.1252 9.17279H17.1807V0C22.4543 0 26.6813 4.6527 28.1252 9.17279Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M34.3617 31.9999H0L2.05088 29.97C3.03444 28.9656 3.57853 27.6681 3.57853 26.266V23.4757C3.57853 19.981 4.01806 16.4863 4.85506 13.0752L5.71312 9.70605H28.6487L29.5068 13.0752C30.3438 16.4863 30.7833 19.9811 30.7833 23.4757V26.266C30.7833 27.668 31.3274 28.9655 32.3109 29.97L34.3617 31.9999Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF641A\" d=\"M34.3615 31.9999H17.1807V9.70605H28.6484L29.5065 13.0752C30.3435 16.4863 30.783 19.9811 30.783 23.4757V26.266C30.783 27.668 31.3271 28.9655 32.3106 29.97L34.3615 31.9999Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFD396\" d=\"M3.5791 6.58301V11.0036H30.7838V6.58301H3.5791Z\" fill=\"#76B7E2\" />\n<path class=\"p-FFB64C\" d=\"M30.783 6.58301H17.1807V11.0036H30.783V6.58301Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFF5F5\" d=\"M7.76465 15.189V25.7221H26.5987V15.189H7.76465Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EFE2DD\" d=\"M26.5977 15.189H17.1807V25.7221H26.5977V15.189Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M22.4135 20.303H11.9502V21.4669H22.4135V20.303Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF641A\" d=\"M22.4123 20.303H17.1807V21.4669H22.4123V20.303Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_garden_fertilizers_result = browser_sprite_build_default.a.add(svg_cat_garden_fertilizers_symbol);
/* harmony default export */ var svg_cat_garden_fertilizers = (svg_cat_garden_fertilizers_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-garden-pool.svg


var svg_cat_garden_pool_symbol = new browser_symbol_default.a({
  "id": "svg-cat-garden-pool",
  "use": "svg-cat-garden-pool-usage",
  "viewBox": "0 0 33 33",
  "content": "<symbol viewBox=\"0 0 33 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-garden-pool\">\n<path class=\"p-E0F4FF\" d=\"M33 7.73434V19.4648L30.0352 21.3984H2.90039L0 19.4648V7.73434H12.9229L13.3095 8.70114H19.6905L19.4004 7.73434L20.2512 6.80615L21.334 7.73434H27.1348L28.3917 6.61279L29.0684 7.73434H33Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BBDCFF\" d=\"M33 7.73434V19.4648L30.0352 21.3984H16.5V8.70114H19.6905L19.4004 7.73434L20.2512 6.80615L21.334 7.73434H27.1348L28.3917 6.61279L29.0684 7.73434H33Z\" fill=\"#A1D1FD\" />\n<path class=\"p-966641\" d=\"M21.334 3.36445V7.73438H19.4004V3.36445C19.4004 2.57162 18.7622 1.93359 17.9695 1.93359C17.4281 1.93359 16.9447 2.2429 16.7126 2.7263L16.5 3.15176L14.199 7.73438L13.5996 8.9332V20.4316H11.666V8.46914L14.9725 1.85619C15.3205 1.17949 15.8425 0.657357 16.5 0.348047C16.9447 0.116016 17.4475 0 17.9695 0C19.8257 0 21.334 1.50814 21.334 3.36445Z\" fill=\"#5FBEFF\" />\n<path class=\"p-966641\" d=\"M20.3672 11.6016H12.6328V13.5352H20.3672V11.6016Z\" fill=\"#5FBEFF\" />\n<path class=\"p-966641\" d=\"M20.3672 7.73438H12.6328V9.66797H20.3672V7.73438Z\" fill=\"#5FBEFF\" />\n<path class=\"p-7E5436\" d=\"M20.3672 7.73438H16.5V9.66797H20.3672V7.73438Z\" fill=\"#4D98CB\" />\n<path class=\"p-7E5436\" d=\"M20.3672 11.6016H16.5V13.5352H20.3672V11.6016Z\" fill=\"#4D98CB\" />\n<path class=\"p-7E5436\" d=\"M21.334 3.36445V7.73438H19.4004V3.36445C19.4004 2.57162 18.7622 1.93359 17.9695 1.93359C17.4281 1.93359 16.9447 2.2429 16.7126 2.7263L16.5 3.15176V0.348047C16.9447 0.116016 17.4475 0 17.9695 0C19.8257 0 21.334 1.50814 21.334 3.36445Z\" fill=\"#4D98CB\" />\n<path class=\"p-966641\" d=\"M20.3672 15.5977H12.6328V17.5312H20.3672V15.5977Z\" fill=\"#5FBEFF\" />\n<path class=\"p-7E5436\" d=\"M20.3672 15.5977H16.5V17.5312H20.3672V15.5977Z\" fill=\"#4D98CB\" />\n<path class=\"p-7E5436\" d=\"M29.0684 3.36445V7.73438H27.1348V3.36445C27.1348 2.57162 26.4966 1.93359 25.7039 1.93359C25.1624 1.93359 24.679 2.2429 24.447 2.7263L21.9334 7.73438L21.334 8.9332V20.4316H19.4004V8.46914L22.7069 1.85619C23.2869 0.71543 24.4277 0 25.7039 0C27.5601 0 29.0684 1.50814 29.0684 3.36445Z\" fill=\"#4D98CB\" />\n<path class=\"p-9BFCFF\" d=\"M33 27.1992L31.4917 28.398L33 29.1328V33H0V29.1328L1.08281 28.166L0 27.1992V19.4648H33V27.1992Z\" fill=\"#AFD9F6\" />\n<path class=\"p-76E2F8\" d=\"M33 27.1992L31.4917 28.398L33 29.1328V33H16.5V19.4648H33V27.1992Z\" fill=\"#76B7E2\" />\n<path class=\"p-76E2F8\" d=\"M13.5996 23.332H5.86523V24.3737H13.5996V23.332Z\" fill=\"#58ADE5\" />\n<path class=\"p-28CBF7\" d=\"M27.1348 22.4402H19.4004V23.4819H27.1348V22.4402Z\" fill=\"#4D98CB\" />\n<path class=\"p-28CBF7\" d=\"M33 27.1992H27.1348V29.1328H33V27.1992Z\" fill=\"#4D98CB\" />\n<path class=\"p-76E2F8\" d=\"M5.86523 27.1992H0V29.1328H5.86523V27.1992Z\" fill=\"#58ADE5\" />\n<path class=\"p-76E2F8\" d=\"M21.334 28.0911H11.666V29.1328H21.334V28.0911Z\" fill=\"#58ADE5\" />\n<path class=\"p-28CBF7\" d=\"M21.334 28.0911H16.5V29.1328H21.334V28.0911Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_garden_pool_result = browser_sprite_build_default.a.add(svg_cat_garden_pool_symbol);
/* harmony default export */ var svg_cat_garden_pool = (svg_cat_garden_pool_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-garden-seeds.svg


var svg_cat_garden_seeds_symbol = new browser_symbol_default.a({
  "id": "svg-cat-garden-seeds",
  "use": "svg-cat-garden-seeds-usage",
  "viewBox": "0 0 29 30",
  "content": "<symbol viewBox=\"0 0 29 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-garden-seeds\">\n<path class=\"p-B04617\" d=\"M14.1944 21.2929C13.7052 21.2929 13.3086 20.8962 13.3086 20.4071V11.1065C13.3086 10.6171 13.7052 10.2205 14.1944 10.2205C14.6837 10.2205 15.0804 10.6171 15.0804 11.1065V20.4071C15.0804 20.8964 14.6837 21.2929 14.1944 21.2929Z\" fill=\"#58ADE5\" />\n<path class=\"p-BDF052\" d=\"M25.238 0.842749C25.2117 0.394369 24.8539 0.0366265 24.4056 0.010305C24.192 -0.00205459 19.1461 -0.26092 16.0971 2.78825C15.1958 3.68958 14.5838 4.76533 14.1686 5.83924C13.7536 4.76533 13.1414 3.68958 12.24 2.78825C9.19109 -0.26092 4.14493 -0.00205459 3.93162 0.010305C3.48324 0.0366265 3.12549 0.394369 3.09917 0.842749C3.08681 1.05607 2.82795 6.10223 5.87711 9.15116C8.43693 11.711 12.4041 11.9394 13.7376 11.9394H14.5996C15.9333 11.9394 19.9005 11.7107 22.4601 9.15116C25.5092 6.10223 25.2506 1.05607 25.238 0.842749Z\" fill=\"#65B3E7\" />\n<path class=\"p-83360B\" d=\"M27.5047 29.9999H0.885776C0.586856 29.9999 0.308078 29.8491 0.144427 29.5989C-0.0192233 29.3487 -0.0455447 29.0329 0.0743894 28.7591C2.52938 23.1474 8.07221 19.5212 14.1953 19.5212C20.3183 19.5212 25.8611 23.1474 28.3164 28.7591C28.4361 29.0329 28.4097 29.3487 28.2461 29.5989C28.0824 29.8491 27.8037 29.9999 27.5047 29.9999Z\" fill=\"#B9DFFC\" />\n<path class=\"p-4C1A03\" d=\"M14.195 19.5212C14.1861 19.5212 14.1769 19.5215 14.168 19.5215V29.9999H27.5045C27.8034 29.9999 28.0822 29.8491 28.2458 29.5989C28.4095 29.3487 28.4358 29.0329 28.3161 28.7591C25.8609 23.1474 20.318 19.5212 14.195 19.5212Z\" fill=\"#A1D1FD\" />\n<path class=\"p-63C92F\" d=\"M24.4049 0.010305C24.1914 -0.00205459 19.1455 -0.26092 16.0965 2.78825C15.1952 3.68958 14.5832 4.76533 14.168 5.83924V11.9394H14.599C15.9329 11.9394 19.9001 11.7107 22.4597 9.15116C25.5086 6.10223 25.25 1.05607 25.2374 0.842749C25.2111 0.394369 24.8533 0.0366265 24.4049 0.010305Z\" fill=\"#4D98CB\" />\n<path class=\"p-4C1A03\" d=\"M6.22344 27.9625C6.6867 27.9625 7.13073 27.5551 7.10921 27.0767C7.0877 26.5967 6.71988 26.1909 6.22344 26.1909C5.76018 26.1909 5.31615 26.5983 5.33767 27.0767C5.35918 27.5567 5.72676 27.9625 6.22344 27.9625Z\" fill=\"#4D98CB\" />\n<path class=\"p-4C1A03\" d=\"M9.0584 27.9625C9.52189 27.9625 9.96569 27.5551 9.94417 27.0767C9.92266 26.5967 9.55507 26.1909 9.0584 26.1909C8.59514 26.1909 8.15111 26.5983 8.17263 27.0767C8.19414 27.5567 8.56195 27.9625 9.0584 27.9625Z\" fill=\"#4D98CB\" />\n<path class=\"p-4C1A03\" d=\"M7.64043 25.8069C8.10369 25.8069 8.54772 25.3995 8.5262 24.9212C8.50469 24.4414 8.1371 24.0354 7.64043 24.0354C7.17717 24.0354 6.73314 24.4428 6.75466 24.9212C6.77617 25.4011 7.14376 25.8069 7.64043 25.8069Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_garden_seeds_result = browser_sprite_build_default.a.add(svg_cat_garden_seeds_symbol);
/* harmony default export */ var svg_cat_garden_seeds = (svg_cat_garden_seeds_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-garden-tools.svg


var svg_cat_garden_tools_symbol = new browser_symbol_default.a({
  "id": "svg-cat-garden-tools",
  "use": "svg-cat-garden-tools-usage",
  "viewBox": "0 0 34 34",
  "content": "<symbol viewBox=\"0 0 34 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-garden-tools\">\n<path class=\"p-61D7A8\" d=\"M28.2377 9.96457L18.5025 19.6998L15.6595 19.6715L14.252 18.264L14.2802 15.4776L24.0012 5.75635C23.9029 6.86813 23.3643 8.92657 24.2089 9.77091C25.0672 10.6295 27.1259 10.0631 28.2377 9.96457Z\" fill=\"#B9DFFC\" />\n<path class=\"p-00AB94\" d=\"M28.2374 9.96441L18.5021 19.6996L15.6591 19.6714L14.9834 18.9959L24.2085 9.77075C25.0669 10.6294 27.1256 10.063 28.2374 9.96441Z\" fill=\"#A1D1FD\" />\n<path class=\"p-C5D3DD\" d=\"M9.7344 24.2457C9.94529 23.1056 10.5084 22.0641 11.3388 21.2338L14.5475 18.0248L7.17284 14.3374L6.69425 14.6471C1.14908 18.3345 -1.42649 24.4285 0.797079 33.1827C9.79069 35.4768 15.6876 32.7604 19.3329 27.2858L19.6427 26.8072L15.9553 19.4323L12.7463 22.6413C11.9159 23.4714 10.8742 24.0345 9.7344 24.2457Z\" fill=\"#B9DFFC\" />\n<path class=\"p-537983\" d=\"M9.93092 19.8265C7.93251 21.8251 6.73242 24.7419 6.73242 27.2472L8.63626 26.3288C10.7332 26.3428 12.6896 25.5125 14.1531 24.0487L18.5022 19.6999L14.2657 15.4636L9.93092 19.8265Z\" fill=\"#58ADE5\" />\n<path class=\"p-9FACBA\" d=\"M15.9548 19.4324L19.6422 26.8071L19.3325 27.2857C15.6874 32.7605 9.79023 35.477 0.796875 33.1828L9.7342 24.2458C10.874 24.0344 11.9155 23.4715 12.7458 22.6414L15.9548 19.4324Z\" fill=\"#65B3E7\" />\n<path class=\"p-3E5959\" d=\"M6.73242 27.2472L16.391 17.5886L18.5022 19.6999L14.1531 24.0487C12.6896 25.5125 9.81486 27.2612 7.71788 27.2472H6.73242Z\" fill=\"#4D98CB\" />\n<path class=\"p-537983\" d=\"M24.4241 2.51928C22.482 4.4614 21.5636 8.53251 23.5057 10.4746C25.4761 12.445 29.5329 11.4844 31.4613 9.55625L33.9803 7.03697L26.9434 0C26.6619 0.281448 24.4241 2.51928 24.4241 2.51928ZM31.1656 7.03697L30.0538 8.14901C28.8715 9.33109 26.0673 10.2215 24.9132 9.06739C23.7449 7.89906 24.6633 5.09485 25.8316 3.92652L26.9434 2.81474L31.1656 7.03697Z\" fill=\"#58ADE5\" />\n<path class=\"p-3E5959\" d=\"M30.462 3.51855L33.9805 7.03704L31.4615 9.55632C29.5331 11.4844 25.4763 12.4451 23.5059 10.4747L24.9134 9.06746C26.0674 10.2215 28.8716 9.33116 30.054 8.14908L31.1658 7.03704L29.0548 4.92605L30.462 3.51855Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_garden_tools_result = browser_sprite_build_default.a.add(svg_cat_garden_tools_symbol);
/* harmony default export */ var svg_cat_garden_tools = (svg_cat_garden_tools_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-gifts.svg


var svg_cat_gifts_symbol = new browser_symbol_default.a({
  "id": "svg-cat-gifts",
  "use": "svg-cat-gifts-usage",
  "viewBox": "0 0 37 37",
  "content": "<symbol viewBox=\"0 0 37 37\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-gifts\">\n<path class=\"p-FDBF00\" d=\"M31.4922 0H30.4082V2.16797H31.4922C32.0899 2.16797 32.5762 2.65424 32.5762 3.25195C32.5762 3.84966 32.0899 4.33594 31.4922 4.33594H30.2992C29.7956 1.86503 27.6057 0 24.9883 0C22.3709 0 20.181 1.86503 19.6774 4.33594H17.2913C16.7877 1.86503 14.5979 0 11.9804 0C9.36294 0 7.17321 1.86503 6.66967 4.33594H5.47656C4.87885 4.33594 4.39258 3.84966 4.39258 3.25195C4.39258 2.65424 4.87885 2.16797 5.47656 2.16797H6.51538V0H5.47656C3.68344 0 2.22461 1.45883 2.22461 3.25195C2.22461 5.04508 3.68344 6.50391 5.47656 6.50391H6.6696C7.17314 8.97481 9.36301 10.8398 11.9805 10.8398H15.2324H17.4004H20.6523H21.7363H24.9883C27.6057 10.8398 29.7955 8.97481 30.2992 6.50391H31.4922C33.2853 6.50391 34.7441 5.04508 34.7441 3.25195C34.7441 1.45883 33.2853 0 31.4922 0ZM15.2324 8.67188H11.9805C10.1873 8.67188 8.72852 7.21305 8.72852 5.41992C8.72852 3.6268 10.1873 2.16797 11.9805 2.16797C13.7736 2.16797 15.2324 3.6268 15.2324 5.41992V8.67188ZM24.9883 8.67188H21.7363V5.41992C21.7363 3.6268 23.1952 2.16797 24.9883 2.16797C26.7814 2.16797 28.2402 3.6268 28.2402 5.41992C28.2402 7.21305 26.7814 8.67188 24.9883 8.67188Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF9100\" d=\"M31.4924 0H30.4084V2.16797H31.4924C32.0901 2.16797 32.5764 2.65424 32.5764 3.25195C32.5764 3.84966 32.0901 4.33594 31.4924 4.33594H30.2994C29.7958 1.86503 27.6059 0 24.9885 0C22.3711 0 20.1813 1.86503 19.6776 4.33594H18.5V10.8398H20.6526H21.7366H24.9885C27.6059 10.8398 29.7958 8.97481 30.2994 6.50391H31.4924C33.2855 6.50391 34.7444 5.04508 34.7444 3.25195C34.7444 1.45883 33.2855 0 31.4924 0ZM24.9885 8.67188H21.7366V5.41992C21.7366 3.6268 23.1954 2.16797 24.9885 2.16797C26.7816 2.16797 28.2405 3.6268 28.2405 5.41992C28.2405 7.21305 26.7816 8.67188 24.9885 8.67188Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF3980\" d=\"M34.7598 15.248V37H23.9199L19.584 31.768L18.5 32.6351L13.0801 37H2.24023V15.248H34.7598Z\" fill=\"#76B7E2\" />\n<path class=\"p-F30051\" d=\"M34.7598 15.248V37H23.9199L19.584 31.768L18.5 32.6351V15.248H34.7598Z\" fill=\"#76B7E2\" />\n<path class=\"p-FDBF00\" d=\"M13.0801 15.248V37H23.9199V15.248H13.0801Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF9100\" d=\"M18.5 15.248H23.9199V37H18.5V15.248Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF6498\" d=\"M37 8.67188V17.416H26.0879L18.5 14.3591L18.1532 14.229L10.9121 17.416H0V8.67188H10.9121L18.5 12.5959L20.3212 13.6221L26.0879 8.67188H37Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF3980\" d=\"M37 8.67188V17.416H26.0879L18.5 14.3591V12.5959L20.3212 13.6221L26.0879 8.67188H37Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FED966\" d=\"M10.9121 8.67188V17.416H26.0879V8.67188H10.9121Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FDBF00\" d=\"M18.5 8.67188H26.0879V17.416H18.5V8.67188Z\" fill=\"#76B7E2\" />\n</symbol>"
});
var svg_cat_gifts_result = browser_sprite_build_default.a.add(svg_cat_gifts_symbol);
/* harmony default export */ var svg_cat_gifts = (svg_cat_gifts_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-gifts-gifts.svg


var svg_cat_gifts_gifts_symbol = new browser_symbol_default.a({
  "id": "svg-cat-gifts-gifts",
  "use": "svg-cat-gifts-gifts-usage",
  "viewBox": "0 0 23 30",
  "content": "<symbol viewBox=\"0 0 23 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-gifts-gifts\">\n<path class=\"p-B35F49\" d=\"M21.0937 0V9.62108L11.4258 8.33782L3.30468 7.24798L0 3.57422L11.4258 1.57031L21.0937 0Z\" fill=\"#AFD9F6\" />\n<path class=\"p-99503D\" d=\"M21.0937 0V9.62108L11.4258 8.33782V1.57031L21.0937 0Z\" fill=\"#65B3E7\" />\n<path class=\"p-FED966\" d=\"M0 3.57422V30H22.8515V3.57422H0Z\" fill=\"#58ADE5\" />\n<path class=\"p-FDBF00\" d=\"M22.8516 3.57422H11.4258V30H22.8516V3.57422Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF6498\" d=\"M12.3047 12.3633H10.5469V16.7578H12.3047V12.3633Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFF5F5\" d=\"M12.3047 8.84766H10.5469V10.6055H12.3047V8.84766Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FF3980\" d=\"M15.8203 12.3633H14.0625V16.7578H15.8203V12.3633Z\" fill=\"#76B7E2\" />\n<path class=\"p-FFF5F5\" d=\"M15.8203 8.84766H14.0625V10.6055H15.8203V8.84766Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF6498\" d=\"M8.78906 12.3633H7.03125V16.7578H8.78906V12.3633Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFF5F5\" d=\"M8.78906 8.84766H7.03125V10.6055H8.78906V8.84766Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FFF5F5\" d=\"M15.8203 24.668H7.03125V26.4844H15.8203V24.668Z\" fill=\"#AFD9F6\" />\n<path class=\"p-EFE2DD\" d=\"M12.3047 8.84766H11.4258V10.6055H12.3047V8.84766Z\" fill=\"#65B3E7\" />\n<path class=\"p-EFE2DD\" d=\"M15.8203 24.668H11.4258V26.4844H15.8203V24.668Z\" fill=\"#65B3E7\" />\n<path class=\"p-99503D\" d=\"M17.5781 15.8789H11.4258V22.9101H17.5781V15.8789Z\" fill=\"black\" />\n<path class=\"p-FF3980\" d=\"M12.3047 12.3633H11.4258V16.7578H12.3047V12.3633Z\" fill=\"#76B7E2\" />\n<path class=\"p-B35F49\" d=\"M5.27344 15.8789V22.9101H17.5781V15.8789H5.27344Z\" fill=\"#5FBEFF\" />\n<path class=\"p-99503D\" d=\"M17.5781 15.8789H11.4258V22.9101H17.5781V15.8789Z\" fill=\"#76B7E2\" />\n</symbol>"
});
var svg_cat_gifts_gifts_result = browser_sprite_build_default.a.add(svg_cat_gifts_gifts_symbol);
/* harmony default export */ var svg_cat_gifts_gifts = (svg_cat_gifts_gifts_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-gifts-holiday.svg


var svg_cat_gifts_holiday_symbol = new browser_symbol_default.a({
  "id": "svg-cat-gifts-holiday",
  "use": "svg-cat-gifts-holiday-usage",
  "viewBox": "0 0 27 34",
  "content": "<symbol viewBox=\"0 0 27 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-gifts-holiday\">\n<path class=\"p-FDBF00\" d=\"M20.0393 17.8367L15.5768 18.6535L13.4651 18.0558L10.417 17.1793L8.3252 14.5098L13.4651 2.45044L20.0393 17.8367Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF9100\" d=\"M15.5795 18.6535L13.4678 18.0558V2.45044L20.042 17.8367L15.5795 18.6535Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF6498\" d=\"M22.9687 24.6496L21.2553 26.2434L13.4659 24.0121L7.36985 22.2789L6.03516 19.8286L8.32603 14.5095L13.4659 15.9637L20.0401 17.8364L22.9687 24.6496Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF3980\" d=\"M21.2571 26.2436L13.4678 24.0123V15.9639L20.042 17.8365L22.9705 24.6497L21.2571 26.2436Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDBF00\" d=\"M25.8777 31.463L22.8298 32.7247L13.4665 29.9887L5.11933 27.5982L3.76465 25.1477L6.0358 19.8286L13.4665 21.9403L22.9693 24.6497L25.8777 31.463Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF9100\" d=\"M25.879 31.4631L22.831 32.7248L13.4678 29.9888V21.9404L22.9705 24.6498L25.879 31.4631Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF6498\" d=\"M25.8783 31.4433L13.4671 27.9171L3.76521 25.1479L0 33.9999H26.9342L25.8783 31.4433Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF3980\" d=\"M26.9349 33.9998H13.4678V27.917L25.879 31.4432L26.9349 33.9998Z\" fill=\"#4D98CB\" />\n<path class=\"p-8CD95B\" d=\"M15.4587 4.98044L18.2875 6.61402L17.2914 8.3273L13.4665 6.13584L9.6416 8.3273L8.64551 6.61402L11.4743 4.98044L8.64551 3.34686L9.6416 1.63358L12.4704 3.24725V0H14.4626V3.24725L17.2914 1.63358L18.2875 3.34686L15.4587 4.98044Z\" fill=\"#58ADE5\" />\n<path class=\"p-61C27C\" d=\"M15.4599 4.98044L18.2888 6.61402L17.2927 8.3273L13.4678 6.13584V0H14.4639V3.24725L17.2927 1.63358L18.2888 3.34686L15.4599 4.98044Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_gifts_holiday_result = browser_sprite_build_default.a.add(svg_cat_gifts_holiday_symbol);
/* harmony default export */ var svg_cat_gifts_holiday = (svg_cat_gifts_holiday_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-gifts-packaging.svg


var svg_cat_gifts_packaging_symbol = new browser_symbol_default.a({
  "id": "svg-cat-gifts-packaging",
  "use": "svg-cat-gifts-packaging-usage",
  "viewBox": "0 0 26 34",
  "content": "<symbol viewBox=\"0 0 26 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-gifts-packaging\">\n<path class=\"p-663325\" d=\"M19.9219 9.03125H17.9297C17.9297 5.88353 15.818 3.14759 12.9492 2.29095C12.3117 2.0918 11.6542 1.99219 10.957 1.99219C7.11211 1.99219 3.98437 5.18633 3.98437 9.03125H1.99219C1.99219 4.09056 6.01647 0 10.957 0C11.6344 0 12.3117 0.0796211 12.9492 0.239062C16.9336 1.13555 19.9219 4.76797 19.9219 9.03125Z\" fill=\"#58ADE5\" />\n<path class=\"p-8C4A37\" d=\"M23.9062 9.03125H21.9141C21.9141 5.18633 18.7863 1.99219 14.9414 1.99219C14.2442 1.99219 13.5867 2.0918 12.9492 2.29095C10.0805 3.14759 7.96875 5.88359 7.96875 9.03125H5.97656C5.97656 4.76797 8.96484 1.13555 12.9492 0.239062C13.5867 0.0796211 14.264 0 14.9414 0C19.882 0 23.9062 4.09056 23.9062 9.03125Z\" fill=\"#B9DFFC\" />\n<path class=\"p-3C1B13\" d=\"M19.9219 9.03096H17.9297C17.9297 5.88323 15.818 3.1473 12.9492 2.29066V0.23877C16.9336 1.13525 19.9219 4.76768 19.9219 9.03096Z\" fill=\"#4D98CB\" />\n<path class=\"p-663325\" d=\"M23.9062 9.03125H21.9141C21.9141 5.18633 18.7863 1.99219 14.9414 1.99219C14.2442 1.99219 13.5867 2.0918 12.9492 2.29095V0.239062C13.5867 0.0796211 14.264 0 14.9414 0C19.882 0 23.9062 4.09056 23.9062 9.03125Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF6498\" d=\"M0 8.03516V34H25.8984V8.03516H0Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF3980\" d=\"M25.8984 8.03516H12.9492V34H25.8984V8.03516Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDBF00\" d=\"M21.9141 11.6409V22.3588L15.9375 19.9881L13.3676 17.0795L12.9492 17.4381L9.96094 19.9881L3.98438 22.3588V11.6409L9.96094 14.0116L12.9492 15.5455L13.8657 16.0038L15.9375 14.0116L21.9141 11.6409Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF9100\" d=\"M15.9375 14.0116L21.9141 11.6409V22.3588L15.9375 19.9881L13.3676 17.0795L12.9492 17.4381V15.5455L13.8657 16.0038L15.9375 14.0116Z\" fill=\"#76B7E2\" />\n<path class=\"p-FED966\" d=\"M9.96094 14.0117V19.9883H15.9375V14.0117H9.96094Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDBF00\" d=\"M15.9375 14.0117H12.9492V19.9883H15.9375V14.0117Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_gifts_packaging_result = browser_sprite_build_default.a.add(svg_cat_gifts_packaging_symbol);
/* harmony default export */ var svg_cat_gifts_packaging = (svg_cat_gifts_packaging_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-gifts-religious-products.svg


var svg_cat_gifts_religious_products_symbol = new browser_symbol_default.a({
  "id": "svg-cat-gifts-religious-products",
  "use": "svg-cat-gifts-religious-products-usage",
  "viewBox": "0 0 32 26",
  "content": "<symbol viewBox=\"0 0 32 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-gifts-religious-products\">\n<path class=\"p-B35F49\" d=\"M31.8326 22.6239V24.1347H19.6467C18.7702 25.2913 17.3898 25.9999 15.9163 25.9999C14.4429 25.9999 13.0624 25.2913 12.1859 24.1347H0V22.6984L1.93975 20.0687L15.9163 16.562L30.5457 20.2739L31.8326 22.6239Z\" fill=\"#58ADE5\" />\n<path class=\"p-99503D\" d=\"M31.8323 22.6239V24.1347H19.6464C18.7699 25.2913 17.3895 25.9999 15.916 25.9999V16.562L30.5454 20.2739L31.8323 22.6239Z\" fill=\"#4D98CB\" />\n<path class=\"p-FED2A4\" d=\"M31.8326 2.10688V22.624L31.3102 22.3629C26.5168 19.9756 20.7658 19.901 15.9163 22.1577C10.8057 19.789 4.8682 20.0688 0 22.6986V2.10688L0.5224 1.8458C5.3158 -0.541551 11.0668 -0.61611 15.9163 1.64058C20.7658 -0.616353 26.5168 -0.541551 31.3102 1.8458L31.8326 2.10688Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFBD86\" d=\"M31.8323 2.10688V22.624L31.3099 22.3629C26.5165 19.9756 20.7655 19.901 15.916 22.1577V1.64058C20.7655 -0.616353 26.5165 -0.541551 31.3099 1.8458L31.8323 2.10688Z\" fill=\"#65B3E7\" />\n<path class=\"p-F6A96C\" d=\"M11.978 5.98555C9.67397 5.45732 7.17636 5.45732 4.87232 5.98555L4.45508 4.16772C7.03259 3.57756 9.81775 3.57756 12.3953 4.16772L11.978 5.98555Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EA9B58\" d=\"M26.9604 5.98555C24.6564 5.45732 22.1588 5.45732 19.8547 5.98555L19.4375 4.16772C22.015 3.57756 24.8002 3.57756 27.3777 4.16772L26.9604 5.98555Z\" fill=\"#A1D1FD\" />\n<path class=\"p-F6A96C\" d=\"M11.978 9.71578C9.67397 9.18755 7.17636 9.18755 4.87232 9.71578L4.45508 7.89794C7.03259 7.30778 9.81775 7.30778 12.3953 7.89794L11.978 9.71578Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EA9B58\" d=\"M26.9604 9.71578C24.6564 9.18755 22.1588 9.18755 19.8547 9.71578L19.4375 7.89794C22.015 7.30778 24.8002 7.30778 27.3777 7.89794L26.9604 9.71578Z\" fill=\"#A1D1FD\" />\n<path class=\"p-F6A96C\" d=\"M11.978 13.4465C9.67397 12.9183 7.17636 12.9183 4.87232 13.4465L4.45508 11.6287C7.03259 11.0385 9.81775 11.0385 12.3953 11.6287L11.978 13.4465Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EA9B58\" d=\"M26.9604 13.4465C24.6564 12.9183 22.1588 12.9183 19.8547 13.4465L19.4375 11.6287C22.015 11.0385 24.8002 11.0385 27.3777 11.6287L26.9604 13.4465Z\" fill=\"#A1D1FD\" />\n<path class=\"p-F6A96C\" d=\"M11.978 17.1767C9.67397 16.6485 7.17636 16.6485 4.87232 17.1767L4.45508 15.3589C7.03259 14.7687 9.81775 14.7687 12.3953 15.3589L11.978 17.1767Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EA9B58\" d=\"M26.9604 17.1767C24.6564 16.6485 22.1588 16.6485 19.8547 17.1767L19.4375 15.3589C22.015 14.7687 24.8002 14.7687 27.3777 15.3589L26.9604 17.1767Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_gifts_religious_products_result = browser_sprite_build_default.a.add(svg_cat_gifts_religious_products_symbol);
/* harmony default export */ var svg_cat_gifts_religious_products = (svg_cat_gifts_religious_products_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-hats-men.svg


var svg_cat_hats_men_symbol = new browser_symbol_default.a({
  "id": "svg-cat-hats-men",
  "use": "svg-cat-hats-men-usage",
  "viewBox": "0 0 35 21",
  "content": "<symbol viewBox=\"0 0 35 21\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-hats-men\">\n<path class=\"p-E0F4FF\" d=\"M17.0081 9.04102C16.1511 9.04102 15.2741 9.06095 14.4171 9.10074C7.28161 9.45951 0 11.4328 0 15.0204C0 18.9469 8.59715 20.9999 17.0081 20.9999C25.4191 20.9999 34.0163 18.9469 34.0163 15.0204C34.0163 11.1139 25.4989 9.06101 17.0081 9.04102Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BBDCFF\" d=\"M34.016 15.0204C34.016 18.9469 25.4188 20.9999 17.0078 20.9999V9.04102C25.4986 9.06101 34.016 11.1139 34.016 15.0204Z\" fill=\"#A1D1FD\" />\n<path class=\"p-68544F\" d=\"M28.1497 13.7088C24.5421 15.1637 21.2733 16.0208 17.0079 16.0208C12.5433 16.0208 9.27455 15.0841 5.86621 13.7088L6.84298 10.6953L10.2114 9.85822C12.4238 10.5758 14.7158 10.9346 17.0079 10.9346C19.3798 10.9346 21.7317 10.5559 24.0039 9.77856C25.7578 10.2569 27.1729 10.6555 27.1729 10.6953L28.1497 13.7088Z\" fill=\"#58ADE5\" />\n<path class=\"p-53433F\" d=\"M28.1495 13.7088C24.542 15.1637 21.2732 16.0208 17.0078 16.0208V10.9346C19.3797 10.9346 21.7316 10.5559 24.0037 9.77856C25.7577 10.2569 27.1728 10.6555 27.1728 10.6953L28.1495 13.7088Z\" fill=\"#4D98CB\" />\n<path class=\"p-E0F4FF\" d=\"M25.2804 3.08175C24.8219 1.26793 23.2074 0.0122477 21.3339 0.0122477C20.2377 0.0122477 19.2212 0.430873 18.4638 1.2082C18.0851 1.58689 17.547 2.69919 17.0088 2.69919C16.4707 2.69919 15.9326 1.58689 15.5539 1.2082C14.4974 0.151768 13.0225 -0.246927 11.6073 0.151767C10.1723 0.550395 9.11586 1.64662 8.73717 3.08175L6.84375 10.6954L7.64101 11.0343C10.6307 12.3099 13.7799 12.9477 17.0088 12.9477C20.2376 12.9477 23.3868 12.31 26.3765 11.0343L27.1737 10.6954L25.2804 3.08175Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BBDCFF\" d=\"M27.1728 10.6954L26.3756 11.0343C23.3859 12.3099 20.2366 12.9476 17.0078 12.9476V2.69915C17.546 2.69915 18.084 1.58685 18.4627 1.20816C19.2201 0.430833 20.2366 0.012207 21.3329 0.012207C23.2064 0.012207 24.8209 1.26789 25.2793 3.08171L27.1728 10.6954Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_hats_men_result = browser_sprite_build_default.a.add(svg_cat_hats_men_symbol);
/* harmony default export */ var svg_cat_hats_men = (svg_cat_hats_men_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-hobby.svg


var svg_cat_hobby_symbol = new browser_symbol_default.a({
  "id": "svg-cat-hobby",
  "use": "svg-cat-hobby-usage",
  "viewBox": "0 0 37 37",
  "content": "<symbol viewBox=\"0 0 37 37\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-hobby\">\n<path class=\"p-D3D3D8\" d=\"M31.3711 4.08887L32.9034 5.62113L29.4073 9.11728L27.875 7.58502L31.3711 4.08887Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E2E2E7\" d=\"M5.62866 4.08887L9.04238 7.50231L7.51012 9.03457L4.09668 5.62085L5.62866 4.08887Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E2E2E7\" d=\"M8.56183 26.8984L10.0941 28.4307L1.53227 36.9925L0 35.4603L8.56183 26.8984Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF637B\" d=\"M20.7967 33.6842C19.973 34.096 19.3014 34.5581 18.4995 34.9265C15.4871 33.5614 12.2366 31.6037 9.54919 29.3282C9.20254 29.0465 11.0448 28.743 10.7196 28.4395C10.2645 28.028 7.66407 27.5946 7.25221 27.161C6.6021 26.4677 5.97344 25.7524 5.43173 24.9939C5.17174 24.6473 7.10062 24.2789 6.86208 23.9322C6.64557 23.5636 4.26164 23.1952 4.06658 22.8268C2.93968 20.7463 2.24609 18.5142 2.24609 16.1521C2.24609 15.9138 2.26783 15.5886 2.33276 15.2202L16.0071 22.8268L16.9824 23.3685L17.5676 24.9939L18.3696 27.161L18.4995 27.5077L19.1713 29.3282L20.7967 33.6842Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M20.7973 33.6843C19.9735 34.0962 19.302 34.5583 18.5 34.9267V27.5078L19.1718 29.3283L20.7973 33.6843Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M9.55189 29.3283H19.1816L18.3802 27.1611H7.25293C7.96966 27.9197 8.74088 28.6415 9.55189 29.3283Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M16.9746 23.3593L16.0171 22.8267H4.05957C4.46466 23.5699 4.91716 24.2954 5.43178 24.9938H17.579L16.9746 23.3593Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M34.561 14.1584C34.5001 13.8238 32.2581 13.5023 32.1698 13.1935C32.0487 12.7689 34.0693 12.3684 33.9002 11.9912C32.1079 7.99146 27.9004 6.57324 25.5865 6.57324C22.096 6.57324 19.8569 8.53402 18.4951 9.92825L19.9819 11.9912L21.5441 14.1584L23.106 16.3252L24.089 17.6889L25.1775 18.4923L32.3643 23.7974C33.4192 22.1412 34.1655 20.3639 34.5178 18.4923C34.5808 18.1592 32.465 17.8236 32.5029 17.4848C32.5455 17.1023 34.738 16.7162 34.7423 16.3252C34.7428 16.2795 34.7533 16.2357 34.7533 16.19C34.7533 15.4594 34.6762 14.7918 34.561 14.1584Z\" fill=\"#65B3E7\" />\n<path class=\"p-BE1E33\" d=\"M33.9004 11.9912H19.9824L21.5443 14.1583H34.5613C34.4167 13.364 34.1926 12.6427 33.9004 11.9912Z\" fill=\"#4D98CB\" />\n<path class=\"p-BE1E33\" d=\"M23.1055 16.3252L24.0884 17.6889L25.1769 18.4923H34.5173C34.6508 17.7832 34.7335 17.0623 34.7417 16.3252H23.1055Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF637B\" d=\"M3.33064 6.57338C1.5381 6.57338 0.0078125 5.04309 0.0078125 3.25056C0.0078125 1.45802 1.5381 0 3.33064 0C5.12317 0 6.5812 1.45802 6.5812 3.25056C6.5812 5.04309 5.12317 6.57338 3.33064 6.57338Z\" fill=\"#65B3E7\" />\n<path class=\"p-E63950\" d=\"M33.6695 6.57338C31.877 6.57338 30.4189 5.04309 30.4189 3.25056C30.4189 1.45802 31.877 0 33.6695 0C35.462 0 36.9923 1.45802 36.9923 3.25056C36.9923 5.04309 35.462 6.57338 33.6695 6.57338Z\" fill=\"#4D98CB\" />\n<path class=\"p-D3D3D8\" d=\"M35.3957 36.9929L26.8711 28.396L28.4031 26.8638L36.9999 35.4606L35.3957 36.9929Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F89FAD\" d=\"M32.3694 23.8019C31.979 24.4085 31.546 24.9937 31.0906 25.5572C31.0906 25.5572 31.0906 25.5789 31.0689 25.5789C30.8089 25.9041 28.3601 24.0619 28.0783 24.3653C27.8836 24.5821 29.8554 26.9658 29.6388 27.1826C29.1403 27.7026 28.6201 28.1794 28.0783 28.6779C27.7752 28.9379 25.3046 27.031 25.0011 27.291C24.7411 27.4858 26.67 29.8697 26.4097 30.0648C25.8245 30.5198 25.2396 30.9534 24.6327 31.365C24.3727 31.5383 21.9239 29.5662 21.6639 29.7398C21.3169 29.9564 23.1374 32.3617 22.769 32.5571C22.5957 32.6869 21.8372 33.1205 20.797 33.684L2.33301 15.22C2.37648 14.7867 2.54981 13.8766 2.96167 12.7497C3.09152 12.3813 5.41052 14.1583 5.6053 13.7897C5.75717 13.4648 3.76337 10.9942 3.95843 10.6693C4.32682 10.0841 4.78187 9.49888 5.32358 8.97891C5.58385 8.71864 8.05416 10.6258 8.37936 10.3875C8.63935 10.1925 6.77567 7.83027 7.07913 7.67869C7.72925 7.31002 8.46602 7.02829 9.31119 6.85525C9.96131 6.70338 12.8003 8.78385 13.5588 8.78385C13.8405 8.78385 11.9334 6.68164 12.1936 6.68164C12.2151 6.70338 12.2151 6.70338 12.2368 6.70338C15.7042 6.9851 16.7662 8.19866 18.4997 9.93248L32.3694 23.8019Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF637B\" d=\"M32.3697 23.802C31.9793 24.4087 31.5463 24.9939 31.0909 25.5573C31.0909 25.5573 31.0909 25.5791 31.0692 25.5791C30.8092 25.9043 28.3603 24.062 28.0786 24.3655C27.8838 24.5823 29.8556 26.9659 29.6391 27.1827C29.1406 27.7027 28.6203 28.1795 28.0786 28.678C27.7754 28.938 25.3049 27.0311 25.0014 27.2911C24.7414 27.4859 26.6703 29.8698 26.41 30.0649C25.8248 30.52 25.2399 30.9536 24.633 31.3651C24.373 31.5385 21.9242 29.5664 21.6642 29.74C21.3172 29.9565 23.1377 32.3619 22.7693 32.5572C22.596 32.6871 21.8375 33.1207 20.7973 33.6841L18.5 31.3869V9.93262L32.3697 23.802Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF637B\" d=\"M24.633 31.3652C24.026 31.777 23.3977 32.1889 22.7693 32.5573L2.96191 12.7499C3.20017 12.0563 3.52536 11.3627 3.95868 10.6694L18.5 25.2324L24.633 31.3652Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF637B\" d=\"M28.079 28.6779C27.5373 29.1547 26.9738 29.6097 26.4104 30.0648L18.5003 22.1548L5.32422 8.97893C5.82274 8.48041 6.40793 8.0471 7.07977 7.67871L28.079 28.6779Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF637B\" d=\"M31.091 25.5572C31.091 25.5572 31.091 25.5789 31.0692 25.5789C30.6359 26.1206 30.1374 26.6623 29.6392 27.1826L9.31152 6.85523C9.96164 6.70336 10.6335 6.6167 11.392 6.6167C11.6737 6.6167 11.9337 6.68163 12.194 6.68163C12.2154 6.70336 12.2154 6.70336 12.2372 6.70336L31.091 25.5572Z\" fill=\"#A1D1FD\" />\n<path class=\"p-F83E5B\" d=\"M18.5 25.2324L24.633 31.3654C24.0264 31.777 23.398 32.1889 22.7693 32.5572L18.5003 28.2879V25.2324H18.5Z\" fill=\"#58ADE5\" />\n<path class=\"p-F83E5B\" d=\"M18.5 19.0996L28.0786 28.6782C27.5369 29.155 26.9735 29.6101 26.41 30.0651L18.5 22.1551V19.0996Z\" fill=\"#58ADE5\" />\n<path class=\"p-F83E5B\" d=\"M31.0909 25.5575C31.0909 25.5575 31.0909 25.5792 31.0692 25.5792C30.6359 26.1209 30.1374 26.6626 29.6391 27.1829L18.5 16.044V12.9668L31.0909 25.5575Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_hobby_result = browser_sprite_build_default.a.add(svg_cat_hobby_symbol);
/* harmony default export */ var svg_cat_hobby = (svg_cat_hobby_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-hobby-art.svg


var svg_cat_hobby_art_symbol = new browser_symbol_default.a({
  "id": "svg-cat-hobby-art",
  "use": "svg-cat-hobby-art-usage",
  "viewBox": "0 0 30 30",
  "content": "<symbol viewBox=\"0 0 30 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-hobby-art\">\n<path class=\"p-714C2F\" d=\"M7.41388 26.3489L2.76215 29.2059L0.790039 27.2337L3.65957 22.6194L5.75505 22.2202L7.78814 24.2534L7.41388 26.3489Z\" fill=\"#58ADE5\" />\n<path class=\"p-523522\" d=\"M7.78746 24.253L7.4132 26.3486L2.76147 29.2056L1.77539 28.2195L6.76465 23.2302L7.78746 24.253Z\" fill=\"#4D98CB\" />\n<path class=\"p-ECECF1\" d=\"M25.6231 4.39764C25.6106 4.38517 25.6106 4.38517 25.6106 4.38517C19.5861 -1.61443 10.0815 -1.31509 4.35634 4.4101C0.988571 7.77787 -0.632868 12.6174 0.227831 17.5693L0.427394 18.6419L1.43774 18.2304C4.20675 17.1078 7.68671 17.6192 10.0317 19.9641C12.3143 22.2467 12.9754 25.6519 11.7779 28.5706L11.3664 29.5809L12.4391 29.7805C17.3285 30.6286 22.2304 28.9697 25.5857 25.6144C31.4729 19.7272 31.4356 10.2101 25.6231 4.39764Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M25.5863 25.6145C22.231 28.9698 17.3291 30.6287 12.4396 29.7806L11.367 29.581L11.7785 28.5708C12.9759 25.6521 12.3149 22.2469 10.0322 19.9643L25.6113 4.38525C25.6113 4.38525 25.6113 4.38525 25.6238 4.39772C31.4363 10.2102 31.4736 19.7272 25.5863 25.6145Z\" fill=\"#A1D1FD\" />\n<path class=\"p-895D3C\" d=\"M15.1707 18.5671L11.4412 14.8376L3.4834 22.7955L7.22536 26.5374L15.1707 18.5671Z\" fill=\"#A1D1FD\" />\n<path class=\"p-714C2F\" d=\"M7.22524 26.5373L5.3418 24.6539L13.2996 16.696L15.1706 18.567L7.22524 26.5373Z\" fill=\"#5FBEFF\" />\n<path class=\"p-714C2F\" d=\"M21.2732 13.476C20.2498 12.4526 20.236 10.7751 21.2772 9.73387C22.2967 8.71435 23.9732 8.69172 25.019 9.73751C26.0424 10.7609 26.0566 12.4389 25.0154 13.4801C23.9796 14.5158 22.3047 14.5075 21.2732 13.476Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M25.0336 20.2262C24.0031 21.2568 22.3226 21.264 21.2878 20.2292C20.2767 19.2181 20.2372 17.5365 21.2882 16.4855C22.3077 15.466 23.9861 15.4396 25.0319 16.4854C26.0414 17.4949 26.0862 19.1736 25.0336 20.2262Z\" fill=\"#58ADE5\" />\n<path class=\"p-FBC56D\" d=\"M4.97748 13.5134C3.96584 12.5017 3.92504 10.8236 4.97554 9.77312C6.02798 8.72068 7.70775 8.75561 8.72121 9.76906C9.73031 10.7782 9.77429 12.4601 8.72115 13.5132C7.68382 14.5506 6.0064 14.5423 4.97748 13.5134Z\" fill=\"#65B3E7\" />\n<path class=\"p-714C2F\" d=\"M16.5242 25.0103C15.5008 23.9869 15.4869 22.3094 16.5282 21.2682C17.5468 20.2495 19.2249 20.2263 20.2698 21.2712C21.2911 22.2925 21.3097 23.971 20.2664 25.0143C19.2307 26.0501 17.5557 26.0418 16.5242 25.0103Z\" fill=\"#4D98CB\" />\n<path class=\"p-94E368\" d=\"M9.74004 8.72659C8.71664 7.70319 8.70276 6.02566 9.74397 4.98445C10.7572 3.97123 12.4327 3.93442 13.4848 4.98656C14.5061 6.00784 14.5256 7.68732 13.4822 8.73064C12.4465 9.76639 10.7715 9.7581 9.74004 8.72659Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF637B\" d=\"M16.491 8.71619C15.4741 7.69926 15.4435 6.0199 16.4909 4.97252C17.508 3.95535 19.1839 3.92307 20.2315 4.97075C21.2767 6.0159 21.2541 7.69738 20.2352 8.7163C19.2072 9.74429 17.5276 9.75269 16.491 8.71619Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF637B\" d=\"M19.0121 10.9844C18.1391 11.0343 16.8169 11.9941 15.5446 12.2185C14.2973 12.443 12.2025 12.8048 11.5788 13.4284C10.2068 14.8005 10.2068 17.0456 11.5788 18.4176C12.9634 19.8022 15.196 19.7897 16.5681 18.4176C17.8154 17.1703 18.9248 12.7432 19.0121 10.9844Z\" fill=\"#58ADE5\" />\n<path class=\"p-E63950\" d=\"M16.5684 18.4176C15.1963 19.7897 12.9637 19.8022 11.5791 18.4176L19.0124 10.9844C18.9251 12.7432 17.8157 17.1703 16.5684 18.4176Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_hobby_art_result = browser_sprite_build_default.a.add(svg_cat_hobby_art_symbol);
/* harmony default export */ var svg_cat_hobby_art = (svg_cat_hobby_art_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-hobby-collect.svg


var svg_cat_hobby_collect_symbol = new browser_symbol_default.a({
  "id": "svg-cat-hobby-collect",
  "use": "svg-cat-hobby-collect-usage",
  "viewBox": "0 0 34 34",
  "content": "<symbol viewBox=\"0 0 34 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-hobby-collect\">\n<path class=\"p-CCF8F3\" d=\"M13.5 0C15.433 0 17 1.567 17 3.5C17 1.567 18.567 0 20.5 0C22.433 0 24 1.567 24 3.5C24 5.433 22.433 7 20.5 7C19.808 7 18 7 18 7L17 8.0002L16 7C16 7 14.192 7 13.5 7C11.567 7 9.99999 5.433 9.99999 3.5C9.99999 1.567 11.567 0 13.5 0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-00D7DF\" d=\"M17 3.5C17 4.2195 17 7 17 7C17 7 19.2865 7 20.5 7C22.433 7 24 5.433 24 3.5C24 1.567 22.433 0 20.5 0C18.567 0 17 1.567 17 3.5Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFFFFF\" d=\"M20.5 5C21.3271 5 22 4.3271 22 3.5C22 2.6729 21.3271 2 20.5 2C19.6729 2 19 2.6729 19 3.5V5H20.5Z\" fill=\"white\" />\n<path class=\"p-FFFFFF\" d=\"M13.5 5C12.6729 5 12 4.3271 12 3.5C12 2.6729 12.6729 2 13.5 2C14.3271 2 15 2.6729 15 3.5V5H13.5Z\" fill=\"white\" />\n<path class=\"p-00D7DF\" d=\"M15.5 7H17H18.5C19.3284 7 20 7.6716 20 8.5C20 9.3284 19.3284 9.99999 18.5 9.99999H17H15.5C14.6716 9.99999 14 9.3284 14 8.5C14 7.6716 14.6716 7 15.5 7Z\" fill=\"#5FBEFF\" />\n<path class=\"p-00A0A6\" d=\"M17 7H18.5C19.3284 7 20 7.6716 20 8.5C20 9.3284 19.3284 9.99999 18.5 9.99999H17V7Z\" fill=\"#4D98CB\" />\n<path class=\"p-EA348B\" d=\"M4.1531 20C5.1152 13.7698 10.5005 9 17 9C23.4995 9 28.8848 13.7698 29.8469 20C32.1406 20 34 21.8594 34 24.1531V26.6667C34 28.5076 32.5076 30 30.6667 30H17H3.33333C1.49239 30 0 28.5076 0 26.6667V24.1531C0 21.8594 1.85941 20 4.1531 20Z\" fill=\"#A1D1FD\" />\n<path class=\"p-00A0A6\" d=\"M9 34C5.68629 34 3 31.3137 3 28C3 24.6863 5.68629 22 9 22C12.3137 22 15 24.6863 15 28C15 31.3137 12.3137 34 9 34Z\" fill=\"#5FBEFF\" />\n<path class=\"p-006C70\" d=\"M9 34C12.3138 34 15 31.3138 15 28C15 24.6862 12.3138 22 9 22\" fill=\"#4D98CB\" />\n<path class=\"p-00D7DF\" d=\"M8.99999 30.75C7.48121 30.75 6.24999 29.5188 6.24999 28C6.24999 26.4812 7.48121 25.25 8.99999 25.25C10.5188 25.25 11.75 26.4812 11.75 28C11.75 29.5188 10.5188 30.75 8.99999 30.75Z\" fill=\"#B9DFFC\" />\n<path class=\"p-00A0A6\" d=\"M8.99999 30.75C10.5189 30.75 11.75 29.5187 11.75 28C11.75 26.4813 10.5189 25.25 8.99999 25.25\" fill=\"#5FBEFF\" />\n<path class=\"p-AF2768\" d=\"M29.8469 20C32.1406 20 34 21.8594 34 24.1531V26.6667C34 28.5076 32.5076 30 30.6667 30H17C17 30 17 9.7551 17 9C23.4995 9 28.8848 13.7698 29.8469 20ZM19 20H26.7998C26.0044 16.0818 22.9182 12.9956 19 12.2002V20Z\" fill=\"#65B3E7\" />\n<path class=\"p-00D7DF\" d=\"M26.7998 20.0002H19V12.2004C22.9182 12.9958 26.0044 16.082 26.7998 20.0002Z\" fill=\"#A1D1FD\" />\n<path class=\"p-CCF8F3\" d=\"M7.2002 20.0002H15V12.2004C11.0818 12.9958 7.9956 16.082 7.2002 20.0002Z\" fill=\"#B9DFFC\" />\n<path class=\"p-00A0A6\" d=\"M25 34C21.6863 34 19 31.3137 19 28C19 24.6863 21.6863 22 25 22C28.3137 22 31 24.6863 31 28C31 31.3137 28.3137 34 25 34Z\" fill=\"#5FBEFF\" />\n<path class=\"p-006C70\" d=\"M25 34C28.3138 34 31 31.3138 31 28C31 24.6862 28.3138 22 25 22\" fill=\"#4D98CB\" />\n<path class=\"p-00D7DF\" d=\"M25 30.75C23.4812 30.75 22.25 29.5188 22.25 28C22.25 26.4812 23.4812 25.25 25 25.25C26.5188 25.25 27.75 26.4812 27.75 28C27.75 29.5188 26.5188 30.75 25 30.75Z\" fill=\"#A1D1FD\" />\n<path class=\"p-00A0A6\" d=\"M25 30.75C26.5188 30.75 27.75 29.5187 27.75 28C27.75 26.4813 26.5188 25.25 25 25.25\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_hobby_collect_result = browser_sprite_build_default.a.add(svg_cat_hobby_collect_symbol);
/* harmony default export */ var svg_cat_hobby_collect = (svg_cat_hobby_collect_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-hobby-floristy.svg


var svg_cat_hobby_floristy_symbol = new browser_symbol_default.a({
  "id": "svg-cat-hobby-floristy",
  "use": "svg-cat-hobby-floristy-usage",
  "viewBox": "0 0 31 30",
  "content": "<symbol viewBox=\"0 0 31 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-hobby-floristy\">\n<path class=\"p-94E368\" d=\"M14.744 25.2012C12.5685 23.0257 9.44815 22.4165 6.68828 23.3116C7.58333 20.5766 6.98663 17.4438 4.79872 15.2559L2.93396 13.3911L2.31235 14.0127C-0.770783 17.0959 -0.770783 21.2355 2.31235 24.3187L4.79866 26.805C6.34017 28.3465 8.37893 29.9999 10.3929 29.9998C12.4317 29.9999 14.4456 29.2291 15.9871 27.6876L16.6087 27.066L14.744 25.2012Z\" fill=\"#A1D1FD\" />\n<path class=\"p-55BF60\" d=\"M16.6082 27.0659L15.9866 27.6875C14.445 29.2291 12.4311 29.9999 10.3924 29.9998C8.37834 29.9999 6.33964 28.3465 4.79813 26.805L4.4375 25.5618L6.68762 23.3117C9.4475 22.4166 12.5678 23.0257 14.7434 25.2012L16.6082 27.0659Z\" fill=\"#4D98CB\" />\n<path class=\"p-94E368\" d=\"M10.7612 17.9944L0.135742 28.6199L1.3789 29.863L12.0043 19.2376L10.7612 17.9944Z\" fill=\"#A1D1FD\" />\n<path class=\"p-55BF60\" d=\"M0.758304 29.2419L1.37988 29.8635L12.0053 19.2381L11.3837 18.6165L0.758304 29.2419Z\" fill=\"#4D98CB\" />\n<path class=\"p-FBC56D\" d=\"M26.9235 19.2377C27.6818 18.4793 28.0423 17.4475 27.9428 16.4032C28.8876 15.9805 29.6211 15.1475 29.8822 14.1157C30.1681 13.0839 29.9569 12.0024 29.3476 11.1695C29.9567 10.3116 30.1681 9.23011 29.8823 8.19828C29.6087 7.17887 28.8876 6.33352 27.9428 5.91087C28.0423 4.86655 27.6818 3.83472 26.9235 3.07639C26.1775 2.33043 25.1208 1.96996 24.1014 2.06941C23.6788 1.12466 22.8334 0.4036 21.8017 0.117732C20.7822 -0.155713 19.7006 0.0554946 18.8428 0.664737C18.0099 0.0554946 16.9284 -0.155713 15.8965 0.130097C14.8647 0.391176 14.0318 1.12472 13.6091 2.06952C12.5648 1.97007 11.5206 2.31818 10.7623 3.07651C10.0163 3.82247 9.65578 4.87909 9.76765 5.91098C8.81036 6.34606 8.08931 7.16651 7.81586 8.21076C7.54242 9.23023 7.75374 10.3117 8.35044 11.1571C7.75368 12.0025 7.54242 13.084 7.8035 14.1159C8.08942 15.1477 8.82285 15.9807 9.76765 16.4033C9.65572 17.4351 10.0163 18.4918 10.7623 19.2378C11.5206 19.9961 12.5648 20.3442 13.6091 20.2448C14.0318 21.1896 14.8648 21.923 15.8842 22.1966C16.9284 22.47 18.0098 22.2587 18.8553 21.662C19.452 22.0846 20.1606 22.3208 20.9065 22.3208C21.2048 22.3208 21.5032 22.2711 21.8016 22.1964C22.8458 21.923 23.6664 21.202 24.1014 20.2447C25.1333 20.3565 26.1775 19.9836 26.9235 19.2377Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EBAE56\" d=\"M24.1019 20.2448C23.6668 21.2021 22.8462 21.923 21.802 22.1965C21.5037 22.2712 21.2053 22.3209 20.9069 22.3209C20.1611 22.3209 19.4524 22.0847 18.8557 21.6621C18.0103 22.2588 16.9288 22.4701 15.8846 22.1967C14.8652 21.9231 14.0322 21.1897 13.6095 20.2449C12.5652 20.3443 11.521 19.9962 10.7627 19.2379L26.924 3.07666C27.6823 3.83499 28.0428 4.86682 27.9433 5.91114C28.8881 6.33379 29.6092 7.17914 29.8827 8.19855C30.1686 9.23038 29.9572 10.3119 29.3481 11.1698C29.9573 12.0026 30.1686 13.0842 29.8827 14.116C29.6216 15.1478 28.8882 15.9808 27.9433 16.4035C28.0428 17.4478 27.6823 18.4796 26.924 19.2379C26.178 19.9838 25.1337 20.3567 24.1019 20.2448Z\" fill=\"#76B7E2\" />\n<path class=\"p-EBAE56\" d=\"M24.5364 13.519C24.8597 12.7482 23.8901 11.8655 23.4674 11.1694C23.8901 10.4732 24.8721 9.60295 24.5364 8.81978C24.2132 8.02412 23.5419 9.24229 22.7463 9.04339L21.8513 8.14843C21.6524 7.35277 22.0004 5.81136 21.2172 5.47568C20.4215 5.15243 19.5638 6.12204 18.8551 6.55723C18.159 6.10962 17.2887 5.15248 16.5055 5.46326C15.7223 5.79894 16.0454 7.34035 15.859 8.14843C15.0509 8.33485 13.4971 7.99927 13.1738 8.79493C12.8382 9.57811 13.8078 10.4608 14.243 11.1445C13.8078 11.8532 12.8382 12.7109 13.1614 13.5066C13.4847 14.3023 15.0386 13.9666 15.8467 14.1531C16.0331 14.9611 15.6975 16.5151 16.4932 16.8383C17.2763 17.1739 18.1342 16.2043 18.8428 15.7692C19.5514 16.2043 20.4216 17.1615 21.2048 16.8507C21.9756 16.5275 21.6524 14.9612 21.8513 14.1655C22.6344 13.979 24.2008 14.3021 24.5364 13.519Z\" fill=\"#A1D1FD\" />\n<path class=\"p-CC9249\" d=\"M15.8467 14.1533L21.8513 8.14868L21.8637 8.16105C22.6594 8.36001 24.2132 8.02442 24.5364 8.82002C24.8721 9.6032 23.8901 10.4735 23.4674 11.1696C23.8901 11.8658 24.8597 12.7485 24.5364 13.5192C24.2008 14.3024 22.6345 13.9793 21.8513 14.1656C21.6524 14.9614 21.9755 16.5277 21.2048 16.8509C20.4216 17.1617 19.5513 16.2046 18.8427 15.7694C18.1341 16.2045 17.2763 17.1741 16.4931 16.8385C15.6975 16.5153 16.0331 14.9613 15.8467 14.1533Z\" fill=\"#4D98CB\" />\n<path class=\"p-FBC56D\" d=\"M18.8428 9.91407L17.5996 11.1572L18.8428 12.4004L20.0859 11.1572L18.8428 9.91407Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EBAE56\" d=\"M19.4648 10.5359L18.2217 11.7791L18.8433 12.4006L20.0864 11.1575L19.4648 10.5359Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_hobby_floristy_result = browser_sprite_build_default.a.add(svg_cat_hobby_floristy_symbol);
/* harmony default export */ var svg_cat_hobby_floristy = (svg_cat_hobby_floristy_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-hobby-knitting.svg


var svg_cat_hobby_knitting_symbol = new browser_symbol_default.a({
  "id": "svg-cat-hobby-knitting",
  "use": "svg-cat-hobby-knitting-usage",
  "viewBox": "0 0 33 33",
  "content": "<symbol viewBox=\"0 0 33 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-hobby-knitting\">\n<path class=\"p-ECECF1\" d=\"M27.5275 0.900741L16.4967 6.39895L13.5969 7.52029L11.6636 8.27424L9.73042 9.00886L7.7972 9.76276L5.11002 10.7874L4.41406 8.9702L7.7972 7.67501L8.86047 8.37097L9.73042 6.92105L11.6636 6.18643L12.8043 6.70846C12.8043 6.70846 13.5582 5.45181 13.5969 5.43247L16.4967 4.31127L27.7481 0L27.5275 0.900741Z\" fill=\"#A1D1FD\" />\n<path class=\"p-D3D3D8\" d=\"M27.5269 0.900741L16.4961 6.39896V4.31114L27.7475 0L27.5269 0.900741Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M28.5791 8.97014L27.8832 10.7874L25.1959 9.76276L23.2627 9.00886L21.3295 8.27424L19.3963 7.52022L16.4965 6.41829L15.5298 6.03164L5.46571 0.900741L5.24512 0L15.5298 3.94383L16.4965 5.91565L17.4631 4.69772L19.3963 5.43235L20.2663 6.92099L21.3295 6.1863L23.2627 6.92099L24.326 8.3709L25.1959 7.67494L28.5791 8.97014Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BABAC0\" d=\"M28.5787 8.97017L27.8828 10.7875L25.1956 9.76279L23.2624 9.0089L21.3291 8.27427L19.3959 7.52025L16.4961 6.41832V5.91568L17.4627 4.69775L19.3959 5.43238L20.2659 6.92102L21.3291 6.18633L23.2624 6.92102L24.3256 8.37093L25.1956 7.67498L28.5787 8.97017Z\" fill=\"#76B7E2\" />\n<path class=\"p-E63950\" d=\"M30.0932 13.4745C28.4942 13.4745 27.1934 12.1737 27.1934 10.5746C27.1934 8.9756 28.4942 7.6748 30.0932 7.6748C31.6922 7.6748 32.993 8.9756 32.993 10.5746C32.993 12.1737 31.6923 13.4745 30.0932 13.4745Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M13.5973 5.43237V10.7294H11.6641V6.18633L13.5973 5.43237Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M17.4635 4.69774V9.24087H15.5303V3.94385L16.4969 4.33043L17.4635 4.69774Z\" fill=\"#5FBEFF\" />\n<path class=\"p-AE2538\" d=\"M21.3297 6.18633V10.7294H19.3965V5.43237L21.3297 6.18633Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M7.79688 7.67492V11.5546C7.85726 11.6017 9.7301 12.2179 9.7301 12.2179V6.9209L7.79688 7.67492Z\" fill=\"#5FBEFF\" />\n<path class=\"p-AE2538\" d=\"M25.1963 11.5545V7.67485L23.2631 6.9209V12.2179C23.2027 12.0185 25.1963 11.5545 25.1963 11.5545Z\" fill=\"#4D98CB\" />\n<path class=\"p-AE2538\" d=\"M17.4627 4.69788V9.24101H16.4961V4.33057L17.4627 4.69788Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF637B\" d=\"M2.89983 13.4745C1.3008 13.4745 0 12.1737 0 10.5746C0 8.9756 1.3008 7.6748 2.89983 7.6748C4.49886 7.6748 5.79966 8.9756 5.79966 10.5746C5.79966 12.1737 4.49892 13.4745 2.89983 13.4745Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF637B\" d=\"M25.1958 11.5604V20.1374L23.05 21.2201L20.3628 19.8861L16.4964 21.8193L12.6299 19.8861L9.6721 21.3746L7.79688 20.1374V11.5604L16.4964 8.19653L25.1958 11.5604Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E63950\" d=\"M16.4961 8.19653L25.1956 11.5604V20.1374L23.0498 21.2201L20.3625 19.8861L16.4961 21.8193V8.19653Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF637B\" d=\"M25.1958 26.1694V33.0001H7.79688V26.1694L10.1747 23.2695H23.2046L25.1958 26.1694Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E63950\" d=\"M20.3628 17.7212L16.4964 19.6544L12.6299 17.7212L7.79688 20.1377V26.1693L12.6299 23.7528L16.4964 25.686L20.3628 23.7528L25.1958 26.1693V20.1377L20.3628 17.7212Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M23.2044 23.2695L25.1956 26.1694V33.0001H16.4961V23.2695H23.2044Z\" fill=\"#76B7E2\" />\n<path class=\"p-AE2538\" d=\"M20.3625 17.7212L25.1956 20.1377V26.1693L20.3625 23.7528L16.4961 25.686V19.6544L20.3625 17.7212Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_hobby_knitting_result = browser_sprite_build_default.a.add(svg_cat_hobby_knitting_symbol);
/* harmony default export */ var svg_cat_hobby_knitting = (svg_cat_hobby_knitting_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-hobby-optics.svg


var svg_cat_hobby_optics_symbol = new browser_symbol_default.a({
  "id": "svg-cat-hobby-optics",
  "use": "svg-cat-hobby-optics-usage",
  "viewBox": "0 0 36 36",
  "content": "<symbol viewBox=\"0 0 36 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-hobby-optics\">\n<path class=\"p-55FBFF\" d=\"M16.0608 21.2832L11.3957 25.9489L10.723 25.276L10.0488 24.6025L14.7146 19.937L16.0608 21.2832Z\" fill=\"#B9DFFC\" />\n<path class=\"p-00D9E0\" d=\"M12.2733 25.071L11.6006 24.3981L15.3881 20.6111L16.0603 21.2833L12.2733 25.071Z\" fill=\"#58ADE5\" />\n<path class=\"p-00A6FF\" d=\"M32.3511 21.2833C29.9203 23.7148 26.7263 24.9304 23.5331 24.9304C20.3391 24.9304 17.1459 23.7148 14.7143 21.2833C9.85174 16.4215 9.85174 8.50891 14.7143 3.64657C17.1459 1.21552 20.3391 0 23.5331 0C26.7263 0 29.9203 1.21552 32.3511 3.64657C37.2136 8.50891 37.2136 16.4215 32.3511 21.2833Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFB74F\" d=\"M14.2738 26.4789L11.896 28.8564L7.49297 33.2594C6.85844 33.8942 6.01422 34.2439 5.11596 34.2439C4.21795 34.2439 1.61762 35.6503 0.982841 35.0155C-0.327366 33.7048 -0.327862 31.5717 0.982841 30.261L9.51901 21.7249L11.8968 24.1024L14.2738 26.4789Z\" fill=\"#A1D1FD\" />\n<path class=\"p-006EF5\" d=\"M32.3512 21.2833C29.9204 23.7148 26.7264 24.9304 23.5332 24.9304V0C26.7264 0 29.9204 1.21552 32.3512 3.64657C37.2138 8.50891 37.2138 16.4215 32.3512 21.2833Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9A00\" d=\"M14.2734 26.4788L11.8956 28.8563L5.73645 35.0155C5.10191 35.6503 4.25769 36 3.35943 36C2.46142 36 1.6172 35.6503 0.982422 35.0155L11.8963 24.1023L14.2734 26.4788Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFFFFF\" d=\"M29.9297 18.8623C28.1659 20.6261 25.8499 21.5075 23.5331 21.5075C21.2163 21.5075 18.8995 20.6261 17.1357 18.8623C13.6084 15.3349 13.6084 9.59515 17.1357 6.06781C18.8995 4.30401 21.2163 3.42261 23.5331 3.42261C25.8491 3.42261 28.1659 4.30401 29.9297 6.06781C33.4571 9.59515 33.4571 15.3349 29.9297 18.8623Z\" fill=\"#B9DFFC\" />\n<path class=\"p-B8E0F9\" d=\"M29.9298 18.8623C28.166 20.6261 25.85 21.5075 23.5332 21.5075V3.42261C25.8492 3.42261 28.166 4.30401 29.9298 6.06781C33.4572 9.59515 33.4572 15.3349 29.9298 18.8623Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_hobby_optics_result = browser_sprite_build_default.a.add(svg_cat_hobby_optics_symbol);
/* harmony default export */ var svg_cat_hobby_optics = (svg_cat_hobby_optics_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-hobby-scrap.svg


var svg_cat_hobby_scrap_symbol = new browser_symbol_default.a({
  "id": "svg-cat-hobby-scrap",
  "use": "svg-cat-hobby-scrap-usage",
  "viewBox": "0 0 31 28",
  "content": "<symbol viewBox=\"0 0 31 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-hobby-scrap\">\n<path class=\"p-FBC56D\" d=\"M30.834 9.03345V19.8735C30.834 23.5953 27.1243 25.832 21.7404 27.2051L15.417 25.402L14.2247 24.8961L9.09363 27.2051C3.70978 25.832 0 23.5953 0 19.8735V9.03345H30.834Z\" fill=\"#76B7E2\" />\n<path class=\"p-EBAE56\" d=\"M30.834 9.03345V19.8735C30.834 23.5953 27.1242 25.832 21.7404 27.2051L15.417 25.402V9.03345H30.834Z\" fill=\"#58ADE5\" />\n<path class=\"p-ECECF1\" d=\"M21.7405 15.5885L20.801 16.3111L21.7405 16.6363V19.4909L21.1805 21.5867L21.7405 22.0563V27.2054C19.9338 27.6932 17.9284 27.9642 15.8145 27.9823L15.4171 27.5306L15.2003 27.2958L13.3214 27.91C12.4542 27.8558 11.6051 27.7474 10.792 27.5847L10.8642 26.5008L9.09375 26.7176V23.8629L9.88869 22.0925L9.09375 21.2975V14.7573H21.7405V15.5885Z\" fill=\"#A1D1FD\" />\n<path class=\"p-D3D3D8\" d=\"M21.7404 15.5884L20.8008 16.311L21.7404 16.6362V19.4908L21.1803 21.5866L21.7404 22.0563V27.2054C19.9337 27.6931 17.9283 27.9641 15.8144 27.9822L15.417 27.5306V14.7573H21.7404V15.5884Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF637B\" d=\"M16.0494 16.8889L9.09375 23.8627V21.2973L14.7849 15.6243L16.0494 16.8889Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF637B\" d=\"M21.7405 15.5879V16.6357L10.792 27.5842C10.1958 27.4758 9.63575 27.3495 9.09375 27.2049V26.717L15.4171 20.4117L20.2049 15.624L21.7405 15.5879Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF637B\" d=\"M21.7404 19.4905V22.0559L15.8144 27.9819C15.688 28 15.5434 28 15.417 28C14.7124 28 14.0077 27.9819 13.3213 27.9097L15.417 25.8139L21.7404 19.4905Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M21.7404 15.5879V16.6357L15.417 22.9591V20.4117L20.2048 15.624L21.7404 15.5879Z\" fill=\"#76B7E2\" />\n<path class=\"p-E63950\" d=\"M15.417 25.8139L21.7404 19.4905V22.0559L15.8144 27.9819C15.6881 28 15.5435 28 15.417 28V25.8139Z\" fill=\"#76B7E2\" />\n<path class=\"p-EBAE56\" d=\"M15.417 0C6.79909 0 0 3.9747 0 9.03341C0 14.0921 6.79909 18.0668 15.417 18.0668C24.035 18.0668 30.834 14.0921 30.834 9.03341C30.834 3.9747 24.035 0 15.417 0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-CC9249\" d=\"M30.834 9.03341C30.834 14.0921 24.0349 18.0668 15.417 18.0668V0C24.0349 0 30.834 3.9747 30.834 9.03341Z\" fill=\"#A1D1FD\" />\n<path class=\"p-895D3C\" d=\"M15.4172 5.47412C11.3521 5.47412 7.28711 6.64852 7.28711 9.03334C7.28711 11.4001 11.3702 12.6467 15.4172 12.6467C19.4641 12.6467 23.5472 11.4001 23.5472 9.03334C23.5472 6.64852 19.4822 5.47412 15.4172 5.47412Z\" fill=\"#76B7E2\" />\n<path class=\"p-714C2F\" d=\"M23.5471 9.03334C23.5471 11.4001 19.464 12.6467 15.417 12.6467V5.47412C19.482 5.47412 23.5471 6.64852 23.5471 9.03334Z\" fill=\"#65B3E7\" />\n<path class=\"p-714C2F\" d=\"M21.7405 9.0333C21.7405 9.55718 19.5184 10.84 15.4171 10.84C11.3159 10.84 9.09375 9.55718 9.09375 9.0333C9.09375 8.52737 11.3159 7.28076 15.4171 7.28076C19.5184 7.28076 21.7405 8.52737 21.7405 9.0333Z\" fill=\"#58ADE5\" />\n<path class=\"p-523522\" d=\"M21.7404 9.0333C21.7404 9.55718 19.5182 10.84 15.417 10.84V7.28076C19.5182 7.28076 21.7404 8.52737 21.7404 9.0333Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_hobby_scrap_result = browser_sprite_build_default.a.add(svg_cat_hobby_scrap_symbol);
/* harmony default export */ var svg_cat_hobby_scrap = (svg_cat_hobby_scrap_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-hobby-sewing.svg


var svg_cat_hobby_sewing_symbol = new browser_symbol_default.a({
  "id": "svg-cat-hobby-sewing",
  "use": "svg-cat-hobby-sewing-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-hobby-sewing\">\n<path class=\"p-ECECF1\" d=\"M26.5331 18.2466C26.5331 25.3119 20.8188 31.0871 13.7535 31.0871C6.68825 31.0871 0.913086 25.3119 0.913086 18.2466C0.913086 11.1814 6.68825 5.46704 13.7535 5.46704C20.8188 5.46704 26.5331 11.1814 26.5331 18.2466Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M26.5325 18.2466C26.5325 25.3119 20.8182 31.0871 13.7529 31.0871V5.46704C20.8182 5.46704 26.5325 11.1813 26.5325 18.2466Z\" fill=\"#A1D1FD\" />\n<path class=\"p-714C2F\" d=\"M11.0151 1.75488H9.18945V5.99655H11.0151V1.75488Z\" fill=\"#58ADE5\" />\n<path class=\"p-523522\" d=\"M18.3178 1.75488H16.4922V5.99655H18.3178V1.75488Z\" fill=\"#4D98CB\" />\n<path class=\"p-895D3C\" d=\"M20.1429 0H7.36328V2.66776H20.1429V0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EBAE56\" d=\"M21.9692 15.5083H20.1436V20.9853H21.9692V15.5083Z\" fill=\"#76B7E2\" />\n<path class=\"p-EBAE56\" d=\"M23.7944 17.334H18.3174V19.1596H23.7944V17.334Z\" fill=\"#76B7E2\" />\n<path class=\"p-714C2F\" d=\"M20.1427 0H13.7529V2.66776H20.1427V0Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF637B\" d=\"M13.7533 4.5542C6.19507 4.5542 0 10.6884 0 18.2466C0 25.8049 6.19507 31.9999 13.7533 31.9999C21.3115 31.9999 27.4457 25.8049 27.4457 18.2466C27.4457 10.6884 21.3115 4.5542 13.7533 4.5542ZM13.7533 30.1743C7.21737 30.1743 1.82566 24.7824 1.82566 18.2466C1.82566 11.7107 7.21737 6.37986 13.7533 6.37986C20.2892 6.37986 25.6201 11.7107 25.6201 18.2466C25.6201 24.7824 20.2892 30.1743 13.7533 30.1743Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M27.4454 18.2466C27.4454 25.8049 21.3112 31.9999 13.7529 31.9999V30.1743C20.2888 30.1743 25.6197 24.7824 25.6197 18.2466C25.6197 11.7107 20.2888 6.37986 13.7529 6.37986V4.5542C21.3112 4.5542 27.4454 10.6884 27.4454 18.2466Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M25.5924 4.56738C25.3249 4.51833 25.0495 4.49338 24.7678 4.49338H22.0293V2.66772H24.7678C25.16 2.66772 25.5442 2.70339 25.9169 2.77027L25.5924 4.56738Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M31.1573 24.5758H29.3317V9.05771C29.3317 8.00315 28.9635 6.97445 28.2949 6.16058L29.7052 5.00171C30.642 6.14092 31.1573 7.58148 31.1573 9.05771V24.5758Z\" fill=\"#4D98CB\" />\n<path class=\"p-BABAC0\" d=\"M26.0353 5.96623V5.96532H26.0344C24.9667 4.89755 24.9632 3.16507 26.0353 2.09292L26.484 1.64422C27.552 0.576274 29.2885 0.576274 30.3564 1.64422C31.4244 2.71217 31.4244 4.44868 30.3564 5.51663L29.9077 5.96532C28.8356 7.03747 27.1031 7.034 26.0353 5.96623Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BABAC0\" d=\"M27.325 5.96511L26.0342 4.67432L14.4466 16.2619L15.7374 17.5527L27.325 5.96511Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF637B\" d=\"M16.4915 18.064C16.4733 16.8957 15.6882 15.8915 14.5563 15.5446C14.7937 14.5954 14.5015 13.6094 13.753 12.9339C13.6069 12.8061 13.461 12.6784 13.2784 12.5871C12.2377 11.9847 10.978 12.1855 10.1017 12.9888C9.24372 12.1855 8.00215 11.9847 6.88856 12.6053C5.86619 13.2079 5.3732 14.3763 5.64711 15.5629C4.5152 15.9098 3.71191 16.8957 3.71191 18.1918C3.73017 19.3968 4.55178 20.3826 5.64711 20.7113C5.3732 21.8614 5.84793 23.0299 6.92507 23.6688C7.9657 24.2713 9.2254 24.0888 10.1017 23.2855C10.9597 24.0705 12.2013 24.2896 13.3149 23.6506C13.4791 23.5593 13.6252 23.4497 13.753 23.3219C14.4834 22.683 14.7937 21.6607 14.5563 20.693C15.6882 20.3461 16.4915 19.3603 16.4915 18.064Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M13.7529 23.3218V12.9338C14.5014 13.6093 14.7936 14.5952 14.5562 15.5445C15.6881 15.8914 16.4732 16.8956 16.4914 18.0639C16.4914 19.3602 15.6881 20.346 14.5562 20.6929C14.7936 21.6605 14.4833 22.6829 13.7529 23.3218Z\" fill=\"#4D98CB\" />\n<path class=\"p-FBC56D\" d=\"M8.73612 20.5065C7.42749 19.7533 6.97551 18.0756 7.72878 16.7661C8.48205 15.4574 10.1624 15.0073 11.4683 15.7587H11.4692C12.7779 16.512 13.2299 18.1897 12.4766 19.4992C11.7182 20.8132 10.0408 21.2563 8.73612 20.5065Z\" fill=\"#B9DFFC\" />\n</symbol>"
});
var svg_cat_hobby_sewing_result = browser_sprite_build_default.a.add(svg_cat_hobby_sewing_symbol);
/* harmony default export */ var svg_cat_hobby_sewing = (svg_cat_hobby_sewing_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-hobby-soap.svg


var svg_cat_hobby_soap_symbol = new browser_symbol_default.a({
  "id": "svg-cat-hobby-soap",
  "use": "svg-cat-hobby-soap-usage",
  "viewBox": "0 0 33 30",
  "content": "<symbol viewBox=\"0 0 33 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-hobby-soap\">\n<path class=\"p-FFB64C\" d=\"M32.9499 19.3813C32.9499 18.8407 32.5252 18.416 31.9846 18.416H0.965329C0.424681 18.416 0 18.8407 0 19.3813C0 25.2312 4.76866 30 10.6186 30H22.3313C28.1812 30 32.9499 25.2312 32.9499 19.3813Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF9100\" d=\"M32.9496 19.3813C32.9496 25.2312 28.1809 30 22.3309 30H16.4746V18.416H31.9842C32.5249 18.416 32.9496 18.8407 32.9496 19.3813Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDE4E4\" d=\"M22.3312 11.584H10.6185C6.8925 11.584 2.9707 14.6151 2.9707 18.3413V20.2719C2.9707 23.9981 6.8925 27.0293 10.6185 27.0293H22.3312C26.0573 27.0293 29.0885 23.9981 29.0885 20.2719V18.3413C29.0885 14.6151 26.0573 11.584 22.3312 11.584Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FDD0D0\" d=\"M25.2273 16.4106C25.2273 18.013 23.9339 19.3066 22.3313 19.3066H10.6186C9.01607 19.3066 7.72266 18.013 7.72266 16.4106C7.72266 15.87 8.14734 15.4453 8.68799 15.4453C9.22863 15.4453 9.65331 15.87 9.65331 16.4106C9.65331 16.9512 10.078 17.376 10.6186 17.376H22.3313C22.872 17.376 23.2966 16.9512 23.2966 16.4106C23.2966 15.87 23.7213 15.4453 24.262 15.4453C24.8026 15.4453 25.2273 15.87 25.2273 16.4106Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E0F4FF\" d=\"M8.68798 9.6533C7.09107 9.6533 5.79199 8.35423 5.79199 6.75732C5.79199 5.1604 7.09107 3.86133 8.68798 3.86133C10.2849 3.86133 11.584 5.1604 11.584 6.75732C11.584 8.35423 10.2849 9.6533 8.68798 9.6533Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BBDCFF\" d=\"M24.2622 5.79198C22.6653 5.79198 21.3662 4.4929 21.3662 2.89599C21.3662 1.29908 22.6653 0 24.2622 0C25.8591 0 27.1582 1.29908 27.1582 2.89599C27.1582 4.4929 25.8591 5.79198 24.2622 5.79198Z\" fill=\"#65B3E7\" />\n<path class=\"p-E0F4FF\" d=\"M14.5444 3.86132C15.0776 3.86132 15.5098 3.42913 15.5098 2.89599C15.5098 2.36286 15.0776 1.93066 14.5444 1.93066C14.0113 1.93066 13.5791 2.36286 13.5791 2.89599C13.5791 3.42913 14.0113 3.86132 14.5444 3.86132Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BBDCFF\" d=\"M20.4009 9.65331C20.934 9.65331 21.3662 9.22112 21.3662 8.68799C21.3662 8.15485 20.934 7.72266 20.4009 7.72266C19.8677 7.72266 19.4355 8.15485 19.4355 8.68799C19.4355 9.22112 19.8677 9.65331 20.4009 9.65331Z\" fill=\"#65B3E7\" />\n<path class=\"p-FCCED3\" d=\"M29.9788 18.3413V20.2719C29.9788 23.9981 26.057 27.0293 22.3309 27.0293H16.4746V11.584H22.3309C26.057 11.584 29.9788 14.6151 29.9788 18.3413Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FAAAAA\" d=\"M25.2269 16.4106C25.2269 18.013 23.9335 19.3066 22.3309 19.3066H16.4746V17.376H22.3309C22.8716 17.376 23.2963 16.9512 23.2963 16.4106C23.2963 15.87 23.721 15.4453 24.2616 15.4453C24.8022 15.4453 25.2269 15.87 25.2269 16.4106Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_hobby_soap_result = browser_sprite_build_default.a.add(svg_cat_hobby_soap_symbol);
/* harmony default export */ var svg_cat_hobby_soap = (svg_cat_hobby_soap_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-bathroom.svg


var svg_cat_home_bathroom_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-bathroom",
  "use": "svg-cat-home-bathroom-usage",
  "viewBox": "0 0 35 30",
  "content": "<symbol viewBox=\"0 0 35 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-bathroom\">\n<path class=\"p-9ABADB\" d=\"M32.0664 17H30.0664V4C30.0664 2.89747 29.1689 2 28.0664 2C26.9639 2 26.0664 2.89747 26.0664 4V5H24.0664V4C24.0664 1.79393 25.8603 0 28.0664 0C30.2725 0 32.0664 1.79393 32.0664 4V17Z\" fill=\"#4D98CB\" />\n<path class=\"p-E0F4FF\" d=\"M28.9896 9.07748H21.1445L22.0671 7C22.0671 5.34573 23.4128 4 25.0671 4C26.7213 4 28.0671 5.34573 28.0671 7L28.9896 9.07748Z\" fill=\"#AFD9F6\" />\n<path class=\"p-E0F4FF\" d=\"M32.0664 17H30.0664V15C30.0664 14.4483 29.6181 14 29.0664 14H26.0664V12H29.0664C30.7207 12 32.0664 13.3457 32.0664 15V17Z\" fill=\"#AFD9F6\" />\n<path class=\"p-BBDCFF\" d=\"M8.06705 27H6.06705L5.14453 30H8.98958L8.06705 27Z\" fill=\"#5FBEFF\" />\n<path class=\"p-9ABADB\" d=\"M30.0671 27H28.0671L27.1445 30H30.9896L30.0671 27Z\" fill=\"#4D98CB\" />\n<path class=\"p-E0F4FF\" d=\"M33.1333 15.9999C31.5933 15.9999 30.1466 16.0199 28.8667 16.0199H28.0667C27.5066 16.0199 27.0667 16.4599 27.0667 17.0199V22.9999H21.0667V16.7999C21.0667 16.2999 20.6867 15.8599 20.1867 15.8199C20.1466 16.7224 20.1067 16.7224 20.0667 15.7999C19.3667 15.7199 18.7067 15.5999 18.0667 15.4599C16.2867 15.0599 14.6667 14.38 12.8267 13.2999C7.30667 9.97993 3 9.95987 1.19993 9.99993H0V10.9999C0 17.4199 0 21.2999 4.16007 27.5599L4.45993 27.9999H31.8133L32.0533 27.3799C33.7934 23.0399 34.1333 20.2799 34.1333 16.9999V15.9999H33.1333Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BBDCFF\" d=\"M34.1331 16V17C34.1331 20.28 33.7931 23.04 32.0531 27.38L31.8131 28H18.0664V15.46C18.7064 15.6 19.3665 15.72 20.0664 15.7999C20.1065 15.7999 20.1463 15.7999 20.1864 15.8199C20.6864 15.86 21.0664 16.2999 21.0664 16.7999V23H27.0664V17.02C27.0664 16.46 27.5063 16.02 28.0664 16.02H28.8665C30.1464 16.02 31.5931 16 33.1331 16H34.1331Z\" fill=\"#A1D1FD\" />\n<path class=\"p-00C0F1\" d=\"M28.0664 16.0199V23.9999H20.0664V15.7998C22.2064 16.0398 24.7064 16.0398 28.0664 16.0199Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_home_bathroom_result = browser_sprite_build_default.a.add(svg_cat_home_bathroom_symbol);
/* harmony default export */ var svg_cat_home_bathroom = (svg_cat_home_bathroom_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-bathroom2.svg


var svg_cat_home_bathroom2_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-bathroom2",
  "use": "svg-cat-home-bathroom2-usage",
  "viewBox": "0 0 32 42",
  "content": "<symbol viewBox=\"0 0 32 42\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-bathroom2\">\n<path class=\"p-E0F4FF\" d=\"M23.133 35.6836C22.9853 37.6523 22.6898 39.6867 22.0502 41.2371L21.7549 42H10.2375L9.94219 41.2371C9.30251 39.6867 9.00703 37.6523 8.85938 35.6836L15.9962 33.2227L23.133 35.6836Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BBDCFF\" d=\"M23.1329 35.6836C22.9852 37.6523 22.6898 39.6867 22.0501 41.2371L21.7548 42H15.9961V33.2227L23.1329 35.6836Z\" fill=\"#58ADE5\" />\n<path class=\"p-B2D1F2\" d=\"M23.1329 35.6835H8.85934C8.51489 31.1307 9.20387 26.0858 9.86841 23.1082H22.1239C22.7883 26.0858 23.4773 31.1307 23.1329 35.6835Z\" fill=\"#AFD9F6\" />\n<path class=\"p-9ABADB\" d=\"M23.1329 35.6835H15.9961V23.1082H22.1238C22.7883 26.0858 23.4773 31.1307 23.1329 35.6835Z\" fill=\"#76B7E2\" />\n<path class=\"p-BBDCFF\" d=\"M24.6094 4.92188V7.38281H22.1484V4.92188C22.1484 3.56836 21.041 2.46094 19.6875 2.46094C18.334 2.46094 17.2266 3.56836 17.2266 4.92188V15.3633H14.7656V4.92188C14.7656 3.69141 15.2086 2.55929 15.9961 1.69805C16.882 0.664371 18.211 0 19.6875 0C22.3944 0 24.6094 2.21476 24.6094 4.92188Z\" fill=\"#AFD9F6\" />\n<path class=\"p-9ABADB\" d=\"M24.6094 4.92187V7.38281H22.1484V4.92187C22.1484 3.56836 21.041 2.46094 19.6875 2.46094C18.334 2.46094 17.2266 3.56836 17.2266 4.92187V14.4492H15.9961V1.69805C16.882 0.664371 18.211 0 19.6875 0C22.3944 0 24.6094 2.21476 24.6094 4.92187Z\" fill=\"#AFD9F6\" />\n<path class=\"p-BBDCFF\" d=\"M15.9961 7.38281H7.38281V9.84375H15.9961V7.38281Z\" fill=\"#AFD9F6\" />\n<path class=\"p-9ABADB\" d=\"M27.0703 7.38281H19.6875V9.84375H27.0703V7.38281Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BBDCFF\" d=\"M12.3047 8.61328H9.84375V15.3633H12.3047V8.61328Z\" fill=\"#AFD9F6\" />\n<path class=\"p-BBDCFF\" d=\"M0 14.1328V15.3633C0 21.4663 4.97118 24.6094 11.0742 24.6094H20.918C27.021 24.6094 31.9922 21.4663 31.9922 15.3633V14.1328H0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-A2C7EE\" d=\"M31.9922 14.1328V15.3633C31.9922 21.4663 27.021 24.6094 20.918 24.6094H15.9961V14.1328H31.9922Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_home_bathroom2_result = browser_sprite_build_default.a.add(svg_cat_home_bathroom2_symbol);
/* harmony default export */ var svg_cat_home_bathroom2 = (svg_cat_home_bathroom2_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-chemic.svg


var svg_cat_home_chemic_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-chemic",
  "use": "svg-cat-home-chemic-usage",
  "viewBox": "0 0 36 36",
  "content": "<symbol viewBox=\"0 0 36 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-chemic\">\n<path class=\"p-E3584B\" d=\"M26.2852 6.96827C26.0269 7.19314 25.6387 7.11325 25.4487 6.82838C25.2581 6.54287 25.3404 6.16036 25.5888 5.9235C26.2856 5.25913 26.6897 4.33214 26.6895 3.35165V1.86206H27.9309V3.35165C27.9314 4.74818 27.3235 6.06437 26.2852 6.96827Z\" fill=\"#4D98CB\" />\n<path class=\"p-4398D1\" d=\"M32.8962 31.0346H26.0687C24.6976 31.0346 23.5859 29.9229 23.5859 28.5519V21.7243L28.5514 13.6554L30.4135 7.44849H34.1376L35.379 14.276V28.5519C35.379 29.9229 34.2673 31.0346 32.8962 31.0346Z\" fill=\"#58ADE5\" />\n<path class=\"p-D6D9DB\" d=\"M36.0005 4.9655H28.5522C28.1731 3.44924 26.9545 2.28727 25.4221 1.98056L24.8281 1.86206V0H31.035C33.7775 0 36.0005 2.22302 36.0005 4.9655Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E3584B\" d=\"M30.4141 4.96558H34.1382V7.44833H30.4141V4.96558Z\" fill=\"#76B7E2\" />\n<path class=\"p-3E8DC2\" d=\"M23.5859 27.0687V28.5516C23.5859 29.9227 24.6976 31.0344 26.0687 31.0344H32.8962C34.2673 31.0344 35.379 29.9227 35.379 28.5516V14.2758L35.3435 14.0815C32.1528 19.0183 28.182 23.4043 23.5859 27.0687Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFC24F\" d=\"M11.1724 31.0344H2.48275C1.11166 31.0344 7.12557e-07 29.9227 7.12557e-07 28.5516V19.6641C-0.000302358 18.9713 0.0960739 18.2818 0.286705 17.6156L1.24138 14.2758L0.151536 11.006C0.0509165 10.705 7.12557e-07 10.3898 7.12557e-07 10.0725C-0.000302358 9.19635 0.389143 8.36503 1.06256 7.80465L3.72413 5.58618H9.931L12.5926 7.80465C13.266 8.36503 13.6554 9.19635 13.6551 10.0725C13.6548 10.3889 13.6039 10.7032 13.5036 11.0036L12.4138 14.2758L13.3684 17.6175C13.5591 18.2836 13.6554 18.9731 13.6551 19.6659V28.5516C13.6551 29.9227 12.5435 31.0344 11.1724 31.0344Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFB64F\" d=\"M12.4137 14.2758L13.5036 11.006C13.8879 9.85314 13.5263 8.58236 12.5926 7.80468L11.6427 7.01367C9.50519 17.3053 4.30814 23.1343 0 26.3171V28.5516C0 29.9227 1.11166 31.0344 2.48275 31.0344H11.1724C12.5435 31.0344 13.6551 29.9227 13.6551 28.5516V19.6641C13.6554 18.9713 13.5591 18.2818 13.3684 17.6157L12.4137 14.2758Z\" fill=\"#4D98CB\" />\n<path class=\"p-4398D1\" d=\"M9.93051 5.58635H3.72363V3.72429L4.96501 2.48291H8.68913L9.93051 3.72429V5.58635Z\" fill=\"#4D98CB\" />\n<path class=\"p-4398D1\" d=\"M4.96582 1C4.96582 0.447715 5.41354 0 5.96582 0H7.68994C8.24223 0 8.68994 0.447715 8.68994 1V2.48275H4.96582V1Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF7230\" d=\"M9.93051 9.931C9.93051 8.90269 8.54093 7.16895 6.82707 7.16895C5.11321 7.16895 3.72363 8.90269 3.72363 9.931C3.72363 10.9593 5.11321 12.6931 6.82707 12.6931C8.54093 12.6931 9.93051 10.9593 9.93051 9.931Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF7230\" d=\"M8.69027 27.931H4.96615C3.59506 27.931 2.4834 26.8193 2.4834 25.4483V18L9.52523 20.5149C10.5132 20.868 11.173 21.8038 11.173 22.8531V25.4483C11.173 26.8193 10.0614 27.931 8.69027 27.931Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FC641C\" d=\"M4.96615 27.9309H8.69027C10.0614 27.9309 11.173 26.8192 11.173 25.4481V22.8529C11.173 21.8037 10.5132 20.8678 9.52523 20.5147L6.54999 19.4521C5.37529 21.1936 4.01148 22.7999 2.4834 24.2416V25.4481C2.4834 26.8192 3.59506 27.9309 4.96615 27.9309Z\" fill=\"#A1D1FD\" />\n<path class=\"p-4398D1\" d=\"M15.5181 3.72412H20.4836C20.8264 3.72412 21.1043 4.00204 21.1043 4.34481V7.44825H14.8975V4.34481C14.8975 4.00204 15.1754 3.72412 15.5181 3.72412Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF7230\" d=\"M25.0816 12.0812L22.3449 9.93124V7.44849H13.6553V9.93124L12.6776 11.0714C6.64832 18.1056 6.03339 28.2915 11.1725 36.0001H26.069L27.6208 34.0599C30.2154 30.8152 31.4067 26.6686 30.9297 22.5414C30.453 18.4142 28.3472 14.6485 25.081 12.0812H25.0816ZM27.2774 28.3558C27.0577 28.9753 26.3867 29.3095 25.7599 29.1113C25.1329 28.9131 24.7755 28.2542 24.9519 27.6208C25.7881 24.6923 25.1944 21.5406 23.3493 19.1173L23.0296 18.6978C22.5913 18.0972 22.7113 17.2567 23.2999 16.8024C23.8888 16.3481 24.7322 16.4457 25.202 17.0219L25.4502 17.3398C27.899 20.4593 28.5879 24.6126 27.2774 28.3558Z\" fill=\"#B9DFFC\" />\n<path class=\"p-DE5718\" d=\"M15.5166 9.93099C15.5166 9.58819 15.7945 9.3103 16.1373 9.3103H21.7235C22.0663 9.3103 22.3442 9.58819 22.3442 9.93099C22.3442 10.2738 22.0663 10.5517 21.7235 10.5517H16.1373C15.7945 10.5517 15.5166 10.2738 15.5166 9.93099Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FA6823\" d=\"M28.0897 15.2173C27.6203 16.4547 27.0678 17.6591 26.4362 18.8223C28.0734 21.7315 28.3801 25.2044 27.2778 28.3554C27.0581 28.9748 26.3871 29.3091 25.7603 29.1109C25.1333 28.9127 24.776 28.2538 24.9523 27.6204C25.5109 25.6438 25.4239 23.5402 24.7038 21.6166C20.2629 27.965 14.0615 31.6455 9.79883 33.5773C10.2019 34.4147 10.6611 35.2242 11.1729 35.9997H26.0695L27.6212 34.0595C31.9921 28.5969 32.1833 20.8902 28.0891 15.2173H28.0897Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFA217\" d=\"M17.6631 18.0297C17.467 18.0124 17.2697 18 17.0691 18C13.9559 17.9988 11.2768 20.1997 10.6731 23.254C10.0697 26.3081 11.7105 29.3624 14.5902 30.5456C17.4697 31.7285 20.7841 30.7098 22.5019 28.1134C21.6378 22.9779 19.6103 19.8805 17.6631 18.0297Z\" fill=\"#5FBEFF\" />\n<path class=\"p-CF4E42\" d=\"M30.4141 4.96558H34.1382V6.20695H30.4141V4.96558Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_home_chemic_result = browser_sprite_build_default.a.add(svg_cat_home_chemic_symbol);
/* harmony default export */ var svg_cat_home_chemic = (svg_cat_home_chemic_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-decor.svg


var svg_cat_home_decor_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-decor",
  "use": "svg-cat-home-decor-usage",
  "viewBox": "0 0 33 33",
  "content": "<symbol viewBox=\"0 0 33 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-decor\">\n<path class=\"p-FF637B\" d=\"M21.334 0L20.4059 1.14076L19.4004 0H13.5996L12.6135 0.986133L11.666 0H1.99805V15.5977C1.99805 16.6611 2.86816 17.5312 3.93164 17.5312H4.89844C10.1191 17.5312 14.6051 14.3408 16.5 9.79688C18.3949 14.3408 22.8809 17.5312 28.1016 17.5312H29.0684C30.1318 17.5312 31.002 16.6611 31.002 15.5977V0H21.334Z\" fill=\"#FF637B\" />\n<path class=\"p-E63950\" d=\"M31.002 0V15.5977C31.002 16.6611 30.1318 17.5312 29.0684 17.5312H28.1016C22.8809 17.5312 18.3949 14.3408 16.5 9.79688V0H19.4004L20.4059 1.14076L21.334 0H31.002Z\" fill=\"#E63950\" />\n<path class=\"p-FF637B\" d=\"M1.9976 21.3927C1.9976 20.8924 2.37936 20.4746 2.87771 20.4298L3.9312 20.335L10.3894 19.7549C11.2208 21.1277 11.6656 22.6939 11.6656 24.2988V28.166C11.3158 28.166 1.70859 28.166 1.9976 28.166V21.3927Z\" fill=\"#FF637B\" />\n<path class=\"p-E63950\" d=\"M30.1122 20.3218C30.6147 20.362 31.002 20.7815 31.002 21.2855V28.1661H21.334V24.2989C21.334 22.6939 21.7786 21.1278 22.6101 19.7549L29.0684 20.2383L30.1122 20.3218Z\" fill=\"#E63950\" />\n<path class=\"p-E63950\" d=\"M7.79923 28.166H5.86563V24.2988C5.86563 22.9393 4.83367 21.4476 2.9209 21.3597L3.00965 19.428C5.74008 19.5536 7.79923 21.6477 7.79923 24.2988V28.166Z\" fill=\"#E63950\" />\n<path class=\"p-AE2538\" d=\"M27.1348 28.1662H25.2012V24.299C25.2012 21.6479 27.2603 19.5538 29.9908 19.4282L30.0796 21.3599C28.1667 21.4477 27.1348 22.9394 27.1348 24.299V28.1662Z\" fill=\"#AE2538\" />\n<path class=\"p-E63950\" d=\"M13.5992 0V4.96289C13.5992 8.92676 10.9115 12.3878 7.06367 13.3934L6.59961 11.5178C9.57728 10.7443 11.6656 8.05658 11.6656 4.96289V0H13.5992Z\" fill=\"#E63950\" />\n<path class=\"p-AE2538\" d=\"M26.4 11.5178L25.9359 13.3933C22.0881 12.3878 19.4004 8.92676 19.4004 4.96289V0H21.334V4.96289C21.334 8.05658 23.4223 10.7443 26.4 11.5178Z\" fill=\"#AE2538\" />\n<path class=\"p-FFDA2D\" d=\"M11.666 18.498C11.666 20.1029 10.3706 21.3984 8.76562 21.3984H1.99805V15.5977H8.76562C10.3706 15.5977 11.666 16.8931 11.666 18.498Z\" fill=\"#FFDA2D\" />\n<path class=\"p-FDBF00\" d=\"M31.002 15.5977V21.3984H24.2344C22.6294 21.3984 21.334 20.1029 21.334 18.498C21.334 16.8931 22.6294 15.5977 24.2344 15.5977H31.002Z\" fill=\"#FDBF00\" />\n<path class=\"p-596C76\" d=\"M30.0996 27.1992H2.90039C1.29544 27.1992 0 28.4947 0 30.0996V33H33V30.0996C33 28.4947 31.7046 27.1992 30.0996 27.1992Z\" fill=\"#596C76\" />\n<path class=\"p-465A61\" d=\"M33 30.0996V33H16.5V27.1992H30.0996C31.7046 27.1992 33 28.4947 33 30.0996Z\" fill=\"#465A61\" />\n<path class=\"p-FF637B\" d=\"M21.334 0L20.4059 1.14076L19.4004 0H13.5996L12.6135 0.986133L11.666 0H1.99805V15.5977C1.99805 16.6611 2.86816 17.5312 3.93164 17.5312H4.89844C10.1191 17.5312 14.6051 14.3408 16.5 9.79688C18.3949 14.3408 22.8809 17.5312 28.1016 17.5312H29.0684C30.1318 17.5312 31.002 16.6611 31.002 15.5977V0H21.334Z\" fill=\"#58ADE5\" />\n<path class=\"p-E63950\" d=\"M31.002 0V15.5977C31.002 16.6611 30.1318 17.5312 29.0684 17.5312H28.1016C22.8809 17.5312 18.3949 14.3408 16.5 9.79688V0H19.4004L20.4059 1.14076L21.334 0H31.002Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF637B\" d=\"M1.9976 21.3927C1.9976 20.8924 2.37936 20.4746 2.87771 20.4298L3.9312 20.335L10.3894 19.7549C11.2208 21.1277 11.6656 22.6939 11.6656 24.2988V28.166C11.3158 28.166 1.70859 28.166 1.9976 28.166V21.3927Z\" fill=\"#58ADE5\" />\n<path class=\"p-E63950\" d=\"M30.1122 20.3218C30.6147 20.362 31.002 20.7815 31.002 21.2855V28.1661H21.334V24.2989C21.334 22.6939 21.7786 21.1278 22.6101 19.7549L29.0684 20.2383L30.1122 20.3218Z\" fill=\"#65B3E7\" />\n<path class=\"p-E63950\" d=\"M7.79923 28.166H5.86563V24.2988C5.86563 22.9393 4.83367 21.4476 2.9209 21.3597L3.00965 19.428C5.74008 19.5536 7.79923 21.6477 7.79923 24.2988V28.166Z\" fill=\"#5FBEFF\" />\n<path class=\"p-AE2538\" d=\"M27.1348 28.1662H25.2012V24.299C25.2012 21.6479 27.2603 19.5538 29.9908 19.4282L30.0796 21.3599C28.1667 21.4477 27.1348 22.9394 27.1348 24.299V28.1662Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M13.5992 0V4.96289C13.5992 8.92676 10.9115 12.3878 7.06367 13.3934L6.59961 11.5178C9.57728 10.7443 11.6656 8.05658 11.6656 4.96289V0H13.5992Z\" fill=\"#5FBEFF\" />\n<path class=\"p-AE2538\" d=\"M26.4 11.5178L25.9359 13.3933C22.0881 12.3878 19.4004 8.92676 19.4004 4.96289V0H21.334V4.96289C21.334 8.05658 23.4223 10.7443 26.4 11.5178Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDA2D\" d=\"M11.666 18.498C11.666 20.1029 10.3706 21.3984 8.76562 21.3984H1.99805V15.5977H8.76562C10.3706 15.5977 11.666 16.8931 11.666 18.498Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FDBF00\" d=\"M31.002 15.5977V21.3984H24.2344C22.6294 21.3984 21.334 20.1029 21.334 18.498C21.334 16.8931 22.6294 15.5977 24.2344 15.5977H31.002Z\" fill=\"#A1D1FD\" />\n<path class=\"p-596C76\" d=\"M30.0996 27.1992H2.90039C1.29544 27.1992 0 28.4947 0 30.0996V33H33V30.0996C33 28.4947 31.7046 27.1992 30.0996 27.1992Z\" fill=\"#58ADE5\" />\n<path class=\"p-465A61\" d=\"M33 30.0996V33H16.5V27.1992H30.0996C31.7046 27.1992 33 28.4947 33 30.0996Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_home_decor_result = browser_sprite_build_default.a.add(svg_cat_home_decor_symbol);
/* harmony default export */ var svg_cat_home_decor = (svg_cat_home_decor_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-furniture.svg


var svg_cat_home_furniture_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-furniture",
  "use": "svg-cat-home-furniture-usage",
  "viewBox": "0 0 35 32",
  "content": "<symbol viewBox=\"0 0 35 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-furniture\">\n<path class=\"p-E63950\" d=\"M30.0664 11V25H4.06641V11C4.06641 9.06007 4.84641 7.26 6.24647 5.92007C7.48647 4.74 9.06641 4.1 10.7465 4.04007C11.8665 1.66007 14.2663 0 17.0664 0C19.8665 0 22.2663 1.66007 23.3863 4.04007C25.0664 4.1 26.6463 4.74 27.8863 5.92007C29.2864 7.26 30.0664 9.06007 30.0664 11Z\" fill=\"#58ADE5\" />\n<path class=\"p-AE2538\" d=\"M30.0664 11V25H17.0664V0C19.8665 0 22.2663 1.66007 23.3863 4.04007C25.0664 4.1 26.6463 4.74 27.8863 5.92007C29.2864 7.26 30.0664 9.06007 30.0664 11Z\" fill=\"#4D98CB\" />\n<path class=\"p-7C8388\" d=\"M6.06641 29H4.06641V32H6.06641V29Z\" fill=\"#58ADE5\" />\n<path class=\"p-465A61\" d=\"M30.0664 29H28.0664V32H30.0664V29Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFCEBF\" d=\"M26.0664 23H8.06641C8.06641 19.14 11.2064 16 15.0664 16H19.0664C22.9264 16 26.0664 19.14 26.0664 23Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFB99C\" d=\"M26.0664 23H17.0664V16H19.0664C22.9264 16 26.0664 19.14 26.0664 23Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF637B\" d=\"M15.4805 8.99999L14.0664 7.58594L12.6523 8.99999L14.0664 10.4141L15.4805 8.99999Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E63950\" d=\"M21.4805 8.99999L20.0664 7.58594L18.6524 9L20.0664 10.4141L21.4805 8.99999Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF637B\" d=\"M17.0665 3.57995L15.6465 5L17.0665 6.42005L18.4866 5L17.0665 3.57995Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF637B\" d=\"M29.1333 14C26.3733 14 24.1333 16.24 24.1333 19V22.9225H10V19C10 16.24 7.76 14 5 14C2.24 14 0 16.24 0 19C0 20.62 0.800067 22.0601 2 22.98V30H32.1333V22.98C33.3333 22.0601 34.1333 20.62 34.1333 19C34.1333 16.24 31.8933 14 29.1333 14Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M34.1331 19C34.1331 20.62 33.333 22.0601 32.1331 22.98V30H17.0664V22.9225H24.1331V19C24.1331 16.24 26.3731 14 29.1331 14C31.8931 14 34.1331 16.24 34.1331 19Z\" fill=\"#65B3E7\" />\n<path class=\"p-E63950\" d=\"M6.06641 18H4.06641V20H6.06641V18Z\" fill=\"#58ADE5\" />\n<path class=\"p-AE2538\" d=\"M30.0664 18H28.0664V20H30.0664V18Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M18.4865 5.00015L17.0664 6.42021V3.58008L18.4865 5.00015Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_home_furniture_result = browser_sprite_build_default.a.add(svg_cat_home_furniture_symbol);
/* harmony default export */ var svg_cat_home_furniture = (svg_cat_home_furniture_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-kitchen.svg


var svg_cat_home_kitchen_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-kitchen",
  "use": "svg-cat-home-kitchen-usage",
  "viewBox": "0 0 35 42",
  "content": "<symbol viewBox=\"0 0 35 42\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-kitchen\">\n<path class=\"p-87A0AF\" d=\"M8.61851 13.7715H4.51367L6.15561 41.9998H8.61851V13.7715Z\" fill=\"#4D98CB\" />\n<path class=\"p-87A0AF\" d=\"M23.3968 13.7715H19.292L20.9339 41.9998H23.3968V13.7715Z\" fill=\"#4D98CB\" />\n<path class=\"p-B4D2D7\" d=\"M20.9336 13.7715H18.4707V41.9998H20.9336V13.7715Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E1EBF0\" d=\"M17.2383 8.49681L14.7773 8.19822V0H17.2383V8.49681Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E1EBF0\" d=\"M22.1641 0H19.7031V8.49681H22.1641V0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-B4D2D7\" d=\"M27.0898 8.19822L24.6289 8.49681V0H27.0898V8.19822Z\" fill=\"#A1D1FD\" />\n<path class=\"p-B4D2D7\" d=\"M6.15724 13.7715H3.69434V41.9998H6.15724V13.7715Z\" fill=\"#5FBEFF\" />\n<path class=\"p-B4D2D7\" d=\"M20.9339 7.26636L19.292 9.35158L20.9339 15.6627C24.3285 15.6627 27.0902 12.9011 27.0902 9.50646V7.26636H20.9339Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E1EBF0\" d=\"M14.7773 7.26636V9.50637C14.7773 12.901 17.5391 15.6627 20.9336 15.6627V7.26636H14.7773Z\" fill=\"#B9DFFC\" />\n<path class=\"p-B4D2D7\" d=\"M6.15561 0L4.51367 7.83136L6.15561 15.6627C9.55023 15.6627 12.3119 12.9011 12.3119 9.50644V6.15628C12.3119 2.76166 9.55023 0 6.15561 0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E1EBF0\" d=\"M6.15628 0C2.76166 0 0 2.76166 0 6.15628V9.50644C0 12.9011 2.76175 15.6627 6.15628 15.6627V0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-87A0AF\" d=\"M34.4789 18.1275L30.374 16.4856L32.016 41.9999H34.4789V18.1275Z\" fill=\"#4D98CB\" />\n<path class=\"p-B4D2D7\" d=\"M29.5537 18.1275V41.9999H32.0166V16.4856L29.5537 18.1275Z\" fill=\"#5FBEFF\" />\n<path class=\"p-B4D2D7\" d=\"M34.4789 19.0595V4.92586C34.4789 3.10296 33.4878 1.51246 32.016 0.660645L30.374 10.5326L32.016 19.0594L34.4789 19.0595Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E1EBF0\" d=\"M32.0166 0.660598C31.292 0.241254 30.4512 0 29.5537 0V19.0595H32.0166V0.660598Z\" fill=\"#B9DFFC\" />\n</symbol>"
});
var svg_cat_home_kitchen_result = browser_sprite_build_default.a.add(svg_cat_home_kitchen_symbol);
/* harmony default export */ var svg_cat_home_kitchen = (svg_cat_home_kitchen_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-light.svg


var svg_cat_home_light_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-light",
  "use": "svg-cat-home-light-usage",
  "viewBox": "0 0 34 34",
  "content": "<symbol viewBox=\"0 0 34 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-light\">\n<path class=\"p-FDBF00\" d=\"M17.9961 0.996094H16.0039V9.03125H17.9961V0.996094Z\" fill=\"#76B7E2\" />\n<path class=\"p-FDBF00\" d=\"M29.9492 24.9688C29.9492 28.8137 26.8215 31.9414 22.9766 31.9414C20.4464 31.9414 18.2152 30.5867 17 28.5547C15.7848 30.5868 13.5536 31.9414 11.0234 31.9414C7.17852 31.9414 4.05078 28.8137 4.05078 24.9688H6.04297C6.04297 27.718 8.27422 29.9492 11.0234 29.9492C13.7727 29.9492 16.0039 27.718 16.0039 24.9688H17.9961C17.9961 27.718 20.2273 29.9492 22.9766 29.9492C25.7258 29.9492 27.957 27.718 27.957 24.9688H29.9492Z\" fill=\"#76B7E2\" />\n<path class=\"p-FDBF00\" d=\"M17.9961 20.9844H16.0039V34H17.9961V20.9844Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF9100\" d=\"M17.9961 0.996094H17V9.03125H17.9961V0.996094Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M29.9492 24.9688C29.9492 28.8137 26.8215 31.9414 22.9766 31.9414C20.4464 31.9414 18.2152 30.5867 17 28.5547V24.9688H17.9961C17.9961 27.718 20.2273 29.9492 22.9766 29.9492C25.7258 29.9492 27.957 27.718 27.957 24.9688H29.9492Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M17.9961 20.9844H17V34H17.9961V20.9844Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDBF00\" d=\"M14.0117 17.0771V20.0654C14.0117 21.7189 15.3464 23.0537 17 23.0537C18.6536 23.0537 19.9883 21.7189 19.9883 20.0654V17.0771H14.0117Z\" fill=\"#76B7E2\" />\n<path class=\"p-FDBF00\" d=\"M5.04688 25.9648C3.39907 25.9648 2.05859 23.7054 2.05859 22.0576V19.0693H8.03516V22.0576C8.03516 23.7054 6.69468 25.9648 5.04688 25.9648Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF9100\" d=\"M28.9531 25.9648C27.3053 25.9648 25.9648 23.7054 25.9648 22.0576V19.0693H31.9414V22.0576C31.9414 23.7054 30.6009 25.9648 28.9531 25.9648Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDBF00\" d=\"M4.29396 16.0039H5.96248L7.45151 14.0117L10.1118 10.9463H0L2.64224 14.0117L4.29396 16.0039Z\" fill=\"#76B7E2\" />\n<path class=\"p-FDBF00\" d=\"M22.0672 8.9541L19.411 12.0196L18.8133 14.0117H16.3828C15.5661 13.0554 14.7292 12.0992 14.5898 12.0196C14.3109 11.8402 11.9336 8.9541 11.9336 8.9541H22.0672Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF9100\" d=\"M27.8201 16.0039H30.1303C30.7309 15.0485 31.3582 14.0117 31.3582 14.0117L34.0005 10.9463H23.8887L26.549 14.0117C26.549 14.0117 27.1836 15.0485 27.8201 16.0039Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M17 17.0771H19.9883V20.0654C19.9883 21.7189 18.6536 23.0537 17 23.0537V17.0771Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M17 8.9541H22.0668L19.4106 12.0196L18.8128 14.0117H17V8.9541Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDBF00\" d=\"M23.9727 0H10.0273V1.99219H23.9727V0Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF9100\" d=\"M23.9727 0H17V1.99219H23.9727V0Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDA2D\" d=\"M6.21416 21.9805H3.87959C1.7765 21.9805 0.0664062 20.2704 0.0664062 18.1673C0.0664062 16.2566 1.26205 15.3919 2.64224 14.0117H7.45151C8.8317 15.3919 10.0273 16.2566 10.0273 18.1673C10.0273 20.2704 8.31725 21.9805 6.21416 21.9805Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFDA2D\" d=\"M19.4106 12.0195H14.5895C13.203 13.406 12.0195 14.256 12.0195 16.1831C12.0195 18.275 13.7328 19.9883 15.8245 19.9883H18.1755C20.2672 19.9883 21.9805 18.275 21.9805 16.1831C21.9805 14.256 20.797 13.406 19.4106 12.0195Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDBF00\" d=\"M30.1204 21.9805H27.7858C25.6827 21.9805 23.9727 20.2704 23.9727 18.1673C23.9727 16.2566 25.1683 15.3919 26.5485 14.0117H31.3578C32.7379 15.3919 33.9336 16.2566 33.9336 18.1673C33.9336 20.2704 32.2235 21.9805 30.1204 21.9805Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FDBF00\" d=\"M18.1755 19.9883H17V12.0195H19.4106C20.797 13.406 21.9805 14.256 21.9805 16.1831C21.9805 18.275 20.2672 19.9883 18.1755 19.9883Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_home_light_result = browser_sprite_build_default.a.add(svg_cat_home_light_symbol);
/* harmony default export */ var svg_cat_home_light = (svg_cat_home_light_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-linens.svg


var svg_cat_home_linens_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-linens",
  "use": "svg-cat-home-linens-usage",
  "viewBox": "0 0 32 24",
  "content": "<symbol viewBox=\"0 0 32 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-linens\">\n<path class=\"p-E47700\" d=\"M3.17578 2C3.17578 0.89543 4.07121 0 5.17578 0H26.5809C27.6855 0 28.5809 0.89543 28.5809 2V9.19891C28.5809 10.3035 27.6855 11.1989 26.5809 11.1989H5.17578C4.07121 11.1989 3.17578 10.3035 3.17578 9.19891V2Z\" fill=\"#B9DFFC\" />\n<path class=\"p-984D00\" d=\"M15.8779 0H26.5805C27.6851 0 28.5805 0.895431 28.5805 2V11.1989H15.8779V0Z\" fill=\"#58ADE5\" />\n<path class=\"p-E47700\" d=\"M3.97461 20.458H5.84264V24H3.97461V20.458Z\" fill=\"#5FBEFF\" />\n<path class=\"p-984D00\" d=\"M26.2871 20.458H28.1551V24H26.2871V20.458Z\" fill=\"#4D98CB\" />\n<path class=\"p-984D00\" d=\"M1.76172 15.8125H30.3673V21.2677H1.76172V15.8125Z\" fill=\"#B9DFFC\" />\n<path class=\"p-723802\" d=\"M15.8779 15.8125H30.3675V21.2677H15.8779V15.8125Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFA900\" d=\"M7.06738 9.82204H14.664V4.5293H7.06738V9.82204Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF8800\" d=\"M17.2168 4.5293V9.82204H24.8134V4.5293H17.2168Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FBBF00\" d=\"M31.881 11.5027V16.991H0V11.4927C0 10.235 1.11887 9.21191 2.49508 9.21191H29.3754C30.757 9.21191 31.881 10.2398 31.881 11.5027Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFA900\" d=\"M31.8807 11.5027V16.991H15.8779V9.21191H29.3751C30.7567 9.21191 31.8807 10.2398 31.8807 11.5027Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_home_linens_result = browser_sprite_build_default.a.add(svg_cat_home_linens_symbol);
/* harmony default export */ var svg_cat_home_linens = (svg_cat_home_linens_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-linens2.svg


var svg_cat_home_linens2_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-linens2",
  "use": "svg-cat-home-linens2-usage",
  "viewBox": "0 0 34 34",
  "content": "<symbol viewBox=\"0 0 34 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-linens2\">\n<path class=\"p-E5B728\" d=\"M13.0156 9.36328L17 15.0078H22.3789L25.6992 13.6797L29.0195 15.0078H33.0039V9.36328H13.0156Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFD75A\" d=\"M17 9.36328H0.996094V15.0078H17V9.36328Z\" fill=\"#65B3E7\" />\n<path class=\"p-146D47\" d=\"M32.0078 10.0273L33.0039 11.0234H30.0156L29.0195 12.3516L28.0234 11.0234H23.375L22.3789 12.3516L21.3828 11.0234H17L15.0078 9.03125L17 7.03906H29.0195C30.6631 7.03906 32.0078 8.38379 32.0078 10.0273Z\" fill=\"#58ADE5\" />\n<path class=\"p-A3EBFE\" d=\"M10.7293 4.05078H4.98047C3.33691 4.05078 1.99219 5.39551 1.99219 7.03906L7.85493 9.69531L13.7177 7.03906C13.7176 5.39551 12.3729 4.05078 10.7293 4.05078Z\" fill=\"#A1D1FD\" />\n<path class=\"p-299B6A\" d=\"M17 7.03906H0.996094V11.0234H17V7.03906Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E5B728\" d=\"M13.0156 25.3008L17 30.9453H22.3789L25.6992 29.9492L29.0195 30.9453H33.0039V25.3008H13.0156Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFD75A\" d=\"M17 25.3008H0.996094V30.9453H17V25.3008Z\" fill=\"#65B3E7\" />\n<path class=\"p-146D47\" d=\"M32.0078 25.9648L33.0039 26.9609H29.0195L25.6992 25.9648L22.3789 26.9609H17L15.0078 24.9688L17 22.9766H22.3789L25.6992 21.9805L29.0195 22.9766C30.6631 22.9766 32.0078 24.3213 32.0078 25.9648Z\" fill=\"#58ADE5\" />\n<path class=\"p-A3EBFE\" d=\"M10.7293 19.9883H4.98047C3.33691 19.9883 1.99219 21.333 1.99219 22.9766L7.85493 25.6328L13.7177 22.9766C13.7176 21.333 12.3729 19.9883 10.7293 19.9883Z\" fill=\"#A1D1FD\" />\n<path class=\"p-299B6A\" d=\"M17 22.9766H0.996094V26.9609H17V22.9766Z\" fill=\"#B9DFFC\" />\n<path class=\"p-1B7CD5\" d=\"M34 34V3.05469C34 2.50456 33.554 2.05859 33.0039 2.05859C32.4538 2.05859 32.0078 2.50456 32.0078 3.05469V34H34Z\" fill=\"#65B3E7\" />\n<path class=\"p-57AEFF\" d=\"M1.99219 34V0.996094C1.99219 0.445966 1.54622 0 0.996094 0C0.445966 0 0 0.445966 0 0.996094V34H1.99219Z\" fill=\"#5FBEFF\" />\n<path class=\"p-57AEFF\" d=\"M29.0195 17H22.3789V18.9922H29.0195V17Z\" fill=\"#B9DFFC\" />\n<path class=\"p-57AEFF\" d=\"M29.0195 20.9844H22.3789V22.9766H29.0195V20.9844Z\" fill=\"#B9DFFC\" />\n<path class=\"p-57AEFF\" d=\"M29.0195 28.9531H22.3789V30.9453H29.0195V28.9531Z\" fill=\"#B9DFFC\" />\n<path class=\"p-57AEFF\" d=\"M29.0195 24.9688H22.3789V26.9609H29.0195V24.9688Z\" fill=\"#B9DFFC\" />\n<path class=\"p-57AEFF\" d=\"M29.0195 13.0156H22.3789V15.0078H29.0195V13.0156Z\" fill=\"#B9DFFC\" />\n<path class=\"p-1B7CD5\" d=\"M30.0156 11.0234H28.0234V34H30.0156V11.0234Z\" fill=\"#A1D1FD\" />\n<path class=\"p-1B7CD5\" d=\"M23.375 11.0234H21.3828V34H23.375V11.0234Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_home_linens2_result = browser_sprite_build_default.a.add(svg_cat_home_linens2_symbol);
/* harmony default export */ var svg_cat_home_linens2 = (svg_cat_home_linens2_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-pillow.svg


var svg_cat_home_pillow_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-pillow",
  "use": "svg-cat-home-pillow-usage",
  "viewBox": "0 0 32 26",
  "content": "<symbol viewBox=\"0 0 32 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-pillow\">\n<path class=\"p-545AC3\" d=\"M30.8193 15.8143C31.5312 11.7976 31.5356 8.01951 30.8324 4.00721L31.1464 3.69322C31.555 3.28467 31.78 2.7413 31.78 2.16351C31.78 1.58547 30.696 1.90128 30.2875 1.49249C29.8789 1.08394 30.1945 0 29.6167 0C29.0389 0 28.4956 0.225007 28.087 0.63356L27.5451 1.17547C21.4178 0.0868023 15.2134 0.0863174 9.08579 1.17353L8.54582 0.63356C8.13727 0.225007 7.59391 0 7.01612 0C6.43808 0 6.75389 1.08394 6.3451 1.49249C5.96012 1.87747 4.89191 1.51371 4.85833 2.0185C4.81833 2.61976 5.02761 3.23466 5.48617 3.69322L5.78973 3.99654C5.08416 8.01636 5.08828 11.801 5.80282 15.8249L5.48617 16.1413C4.64263 16.9849 4.64263 18.3575 5.48617 19.201C5.89496 19.6096 6.43808 19.8346 7.01612 19.8346C7.59391 19.8346 8.13727 19.6096 8.54582 19.201L9.16071 18.5861C15.2383 19.6554 21.3928 19.6549 27.4702 18.5842L28.0868 19.201C28.4956 19.6096 29.0387 19.8346 29.6167 19.8346C30.1945 19.8346 29.8789 18.7506 30.2875 18.3421C30.696 17.9335 31.78 18.2491 31.78 17.6713C31.78 17.0933 31.555 16.5501 31.1464 16.1413L30.8193 15.8143Z\" fill=\"#65B3E7\" />\n<path class=\"p-404AA2\" d=\"M30.819 15.8143C31.5308 11.7976 31.5352 8.01954 30.8321 4.00722L31.146 3.69323C31.5546 3.28468 31.7796 2.74131 31.7796 2.16352C31.7796 1.58548 30.6957 1.90129 30.2871 1.49249C29.8786 1.08394 30.1941 0 29.6163 0C29.0385 0 28.4952 0.225008 28.0866 0.633561L27.5447 1.17547C24.6259 0.656838 21.6894 0.385762 18.752 0.361031V19.3851C21.6642 19.3606 24.5757 19.0939 27.4698 18.5842L28.0866 19.2008C28.4952 19.6096 29.0383 19.8346 29.6163 19.8346C30.1941 19.8346 29.8786 18.7507 30.2871 18.3419C30.6957 17.9333 31.7796 18.2491 31.7796 17.6713C31.7796 17.0933 31.5546 16.5502 31.146 16.1414L30.819 15.8143Z\" fill=\"#4D98CB\" />\n<path class=\"p-85D3FD\" d=\"M25.9658 21.9795C26.6777 17.9629 26.6821 14.1848 25.9789 10.1725L26.2929 9.8585C26.7015 9.44995 26.9265 8.90659 26.9265 8.32879C26.9265 7.75076 25.8425 8.06657 25.434 7.65777C25.0254 7.24922 25.341 6.16528 24.7632 6.16528C24.1852 6.16528 23.642 6.39029 23.2332 6.79884L22.6916 7.34075C16.5643 6.25209 10.3598 6.25136 4.23228 7.33881L3.69231 6.79884C3.28376 6.39029 2.74039 6.16528 2.1626 6.16528C1.58457 6.16528 1.90038 7.24922 1.49158 7.65777C1.11272 8.03664 0.0450862 7.66329 0.00654656 8.15974C-0.0407218 8.76862 0.167979 9.39383 0.63265 9.8585L0.936216 10.1618C0.230644 14.1816 0.234766 17.9663 0.949309 21.9902L0.63265 22.3066C0.321314 22.618 0.124888 23.0014 0.0433711 23.4036C-0.095974 24.0913 0.959382 23.9752 1.49158 24.5074C1.90038 24.9159 1.58457 25.9998 2.1626 25.9998C2.74039 25.9998 3.28376 25.7748 3.69231 25.3663L4.3072 24.7514C10.3846 25.8207 16.5393 25.8202 22.6164 24.7495L23.2332 25.3663C23.6418 25.7748 24.1852 25.9998 24.7632 25.9998C25.341 25.9998 25.0252 24.9159 25.434 24.5074C25.8425 24.0988 26.9265 24.4144 26.9265 23.8366C26.9265 23.2585 26.7015 22.7154 26.2929 22.3069L25.9658 21.9795Z\" fill=\"#B9DFFC\" />\n<path class=\"p-22B8F9\" d=\"M25.9665 21.9796C26.6784 17.9629 26.6828 14.1848 25.9796 10.1725L26.2936 9.85851C26.7022 9.44996 26.9272 8.90659 26.9272 8.3288C26.9272 7.75076 25.8432 8.06657 25.4347 7.65777C25.0261 7.24922 25.3417 6.16528 24.7639 6.16528C24.1859 6.16528 23.6427 6.39029 23.2339 6.79884L22.6923 7.34075C19.685 6.80636 16.659 6.5348 13.6328 6.52462V25.5518C16.634 25.5419 19.635 25.2749 22.6174 24.7495L23.2339 25.3663C23.6427 25.7749 24.1859 25.9999 24.7639 25.9999C25.3417 25.9999 25.0261 24.916 25.4347 24.5074C25.8432 24.0986 26.9272 24.4144 26.9272 23.8364C26.9272 23.2586 26.7022 22.7152 26.2936 22.3067L25.9665 21.9796Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_home_pillow_result = browser_sprite_build_default.a.add(svg_cat_home_pillow_symbol);
/* harmony default export */ var svg_cat_home_pillow = (svg_cat_home_pillow_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-repair.svg


var svg_cat_home_repair_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-repair",
  "use": "svg-cat-home-repair-usage",
  "viewBox": "0 0 32 26",
  "content": "<symbol viewBox=\"0 0 32 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-repair\">\n<path class=\"p-293939\" d=\"M12.2392 18.5715H6.5V16.7144H10.0465L9.2984 12.2239L11.1302 11.9192L12.2392 18.5715Z\" fill=\"#4D98CB\" />\n<path class=\"p-3E5959\" d=\"M8.35714 22.2857H7.42857V11.1428H1.85714L0.928571 16.7143L1.85714 17.6428L0.618986 18.5714L0.309524 20.4285L1.85714 21.3571L0 22.2857V26H11.1429V25.0714C11.1429 23.5329 9.89566 22.2857 8.35714 22.2857Z\" fill=\"#58ADE5\" />\n<path class=\"p-3E5959\" d=\"M31.695 5.57153H26.9902V7.42868H31.695V5.57153Z\" fill=\"#58ADE5\" />\n<path class=\"p-293939\" d=\"M31.695 6.5H26.9902V7.42857H31.695V6.5Z\" fill=\"#4D98CB\" />\n<path class=\"p-537983\" d=\"M27.9186 3.71436H23.2139V9.28578H27.9186V3.71436Z\" fill=\"#58ADE5\" />\n<path class=\"p-3E5959\" d=\"M27.9186 6.5H23.2139V9.28571H27.9186V6.5Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M22.2857 3.71429V9.28571L20.4286 11.1429C17.9399 12.4057 16.8443 13 15.0243 13H0V0H5.57143L7.42857 1.85714H13L14.8571 0H15.0243C16.8629 0 18.0514 0.649938 20.4286 1.85714L22.2857 3.71429Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF641A\" d=\"M0 6.5H22.2857V9.28571L20.4286 11.1429C17.9399 12.4057 16.8443 13 15.0243 13H0V6.5Z\" fill=\"#5FBEFF\" />\n<path class=\"p-F03800\" d=\"M5.57129 9.28575C5.57129 9.79859 5.98702 10.2143 6.49986 10.2143C7.0127 10.2143 7.42843 9.79859 7.42843 9.28575C7.42843 8.77291 7.0127 8.35718 6.49986 8.35718C5.98702 8.35718 5.57129 8.77291 5.57129 9.28575Z\" fill=\"#4D98CB\" />\n<path class=\"p-F03800\" d=\"M9.28613 9.28575C9.28613 9.79859 9.70187 10.2143 10.2147 10.2143C10.7275 10.2143 11.1433 9.79859 11.1433 9.28575C11.1433 8.77291 10.7275 8.35718 10.2147 8.35718C9.70187 8.35718 9.28613 8.77291 9.28613 9.28575Z\" fill=\"#4D98CB\" />\n<path class=\"p-F03800\" d=\"M13 9.28575C13 9.79859 13.4157 10.2143 13.9286 10.2143C14.4414 10.2143 14.8571 9.79859 14.8571 9.28575C14.8571 8.77291 14.4414 8.35718 13.9286 8.35718C13.4157 8.35718 13 8.77291 13 9.28575Z\" fill=\"#4D98CB\" />\n<path class=\"p-293939\" d=\"M3.71444 17.6429C3.71444 17.1301 3.29871 16.7144 2.78587 16.7144H0.928726L0.619141 18.5715H2.78587C3.2987 18.5715 3.71444 18.1558 3.71444 17.6429Z\" fill=\"#4D98CB\" />\n<path class=\"p-293939\" d=\"M3.71429 21.357C3.71429 20.8442 3.29855 20.4285 2.78571 20.4285H0.309586L0 22.2856H2.78571C3.29855 22.2856 3.71429 21.8699 3.71429 21.357Z\" fill=\"#4D98CB\" />\n<path class=\"p-537983\" d=\"M14.857 0H5.57129C5.57129 2.05134 7.23423 3.71429 9.28557 3.71429H11.1427C13.1941 3.71429 14.857 2.05134 14.857 0Z\" fill=\"#4D98CB\" />\n<path class=\"p-ECECF1\" d=\"M24.2049 3.71432V9.28575L20.4287 11.1429V1.85718L24.2049 3.71432Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M20.4287 6.5H24.2049V9.28571L20.4287 11.1429V6.5Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_home_repair_result = browser_sprite_build_default.a.add(svg_cat_home_repair_symbol);
/* harmony default export */ var svg_cat_home_repair = (svg_cat_home_repair_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-shoes-care.svg


var svg_cat_home_shoes_care_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-shoes-care",
  "use": "svg-cat-home-shoes-care-usage",
  "viewBox": "0 0 32 20",
  "content": "<symbol viewBox=\"0 0 32 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-shoes-care\">\n<path class=\"p-FFDC40\" d=\"M7.51563 0C6.41106 0 5.51562 0.895431 5.51562 2V9.09091H25.5156V2C25.5156 0.89543 24.6202 0 23.5156 0H7.51563ZM21.8793 3.63636C21.8793 4.13844 21.4722 4.54545 20.9702 4.54545H10.0611C9.559 4.54545 9.15199 4.13844 9.15199 3.63636C9.15199 3.13429 9.559 2.72727 10.0611 2.72727H20.9702C21.4722 2.72727 21.8793 3.13429 21.8793 3.63636Z\" fill=\"#76B7E2\" />\n<path class=\"p-FFAB15\" d=\"M15.5156 0V2.72727H20.9702C21.4722 2.72727 21.8793 3.13429 21.8793 3.63636C21.8793 4.13844 21.4722 4.54545 20.9702 4.54545H15.5156V9.09091H25.5156V2C25.5156 0.89543 24.6202 0 23.5156 0H15.5156Z\" fill=\"#58ADE5\" />\n<path class=\"p-76CC5B\" d=\"M30.5887 20.0001H0.442383L1.95753 10.9092H29.0735L30.5887 20.0001Z\" fill=\"#5FBEFF\" />\n<path class=\"p-599944\" d=\"M15.5156 20.0001H30.5888L29.0736 10.9092H15.5156V20.0001Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFEA84\" d=\"M31.0303 12.7273H0V9.27271C0 8.16814 0.895431 7.27271 2 7.27271H29.0303C30.1349 7.27271 31.0303 8.16814 31.0303 9.27271V12.7273Z\" fill=\"#B9DFFC\" />\n<path class=\"p-8FE673\" d=\"M9.8501 15.5155C9.88502 15.0146 9.50728 14.5803 9.0064 14.5454C8.50554 14.5105 8.0712 14.8882 8.03629 15.3891L7.71484 19.9999H9.53745L9.8501 15.5155Z\" fill=\"#B9DFFC\" />\n<path class=\"p-8FE673\" d=\"M14.2334 15.4755C14.2451 14.9736 13.8477 14.5572 13.3457 14.5456C12.8438 14.5339 12.4274 14.9313 12.4157 15.4333L12.3096 20.0001H14.1283L14.2334 15.4755Z\" fill=\"#B9DFFC\" />\n<path class=\"p-8FE673\" d=\"M4.94859 20.0001L5.46529 15.5535C5.52324 15.0548 5.16591 14.6035 4.66717 14.5456C4.16845 14.4876 3.71719 14.845 3.65924 15.3437L3.11816 20.0001H4.94859Z\" fill=\"#B9DFFC\" />\n<path class=\"p-76CC5B\" d=\"M18.6142 15.4333C18.6025 14.9313 18.1862 14.5339 17.6842 14.5456C17.1823 14.5572 16.7848 14.9736 16.7965 15.4755L16.9016 20.0001H18.7204L18.6142 15.4333Z\" fill=\"#A1D1FD\" />\n<path class=\"p-76CC5B\" d=\"M22.9942 15.3891C22.9593 14.8882 22.525 14.5105 22.0241 14.5454C21.5232 14.5803 21.1455 15.0146 21.1804 15.5155L21.4931 19.9999H23.3157L22.9942 15.3891Z\" fill=\"#A1D1FD\" />\n<path class=\"p-76CC5B\" d=\"M27.3709 15.3437C27.313 14.845 26.8617 14.4876 26.363 14.5456C25.8643 14.6035 25.5069 15.0548 25.5649 15.5535L26.0816 20.0001H27.912L27.3709 15.3437Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFDC40\" d=\"M31.0308 12.7273H15.5156V7.27271H29.0308C30.1353 7.27271 31.0308 8.16814 31.0308 9.27271V12.7273Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_home_shoes_care_result = browser_sprite_build_default.a.add(svg_cat_home_shoes_care_symbol);
/* harmony default export */ var svg_cat_home_shoes_care = (svg_cat_home_shoes_care_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-textiles.svg


var svg_cat_home_textiles_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-textiles",
  "use": "svg-cat-home-textiles-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-textiles\">\n<path class=\"p-E63950\" d=\"M27.25 30.125L28.1875 32H32V30.125H27.25Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF637B\" d=\"M28.1875 3.75L27.25 5.625H32V3.75H28.1875Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF637B\" d=\"M32 7.5H27.25V9.375H32V7.5Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF637B\" d=\"M32 11.3125H27.25V13.1875H32V11.3125Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF637B\" d=\"M32 15.0625H27.25V16.9375H32V15.0625Z\" fill=\"#76B7E2\" />\n<path class=\"p-E63950\" d=\"M32 18.8125H27.25V20.6875H32V18.8125Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M32 22.625H27.25V24.5H32V22.625Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M32 26.375H27.25V28.25H32V26.375Z\" fill=\"#4D98CB\" />\n<path class=\"p-FBC56D\" d=\"M28.1875 3.75V32H23.6313L19.5812 29.5999L14.2563 32H4.6875L6.16869 17.875L7.63125 3.75H12.25L17.7062 6.14994L21.625 3.75H28.1875Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EBAE56\" d=\"M28.1875 17.875V32H23.6313L19.5812 29.5999L14.2563 32H4.6875L6.16869 17.875H28.1875Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF637B\" d=\"M23.6122 31.0438C23.5747 29.9938 23.0685 29.0562 22.1872 28.4937C21.8122 28.2312 21.606 27.8187 21.606 27.3687C21.606 26.9375 21.8122 26.5437 22.1872 26.2999C23.0873 25.7001 23.6122 24.6874 23.6122 23.6187C23.6122 22.5499 23.0685 21.5125 22.1872 20.9125C21.8122 20.6688 21.606 20.2562 21.606 19.8062C21.606 19.375 21.8122 18.9812 22.1872 18.7374C22.5435 18.5124 22.8248 18.2125 23.0498 17.875C23.4248 17.3499 23.6123 16.7125 23.6123 16.0562C23.6123 14.9874 23.0686 13.9937 22.1873 13.4312C21.8123 13.1687 21.606 12.7562 21.606 12.3062C21.606 11.875 21.8123 11.4812 22.1873 11.2374C23.0873 10.6376 23.6123 9.56244 23.6123 8.49369C23.6123 7.42494 23.0685 6.43125 22.206 5.86875C21.8122 5.60625 21.5872 5.175 21.606 4.70625L21.6247 3.75H12.2497L12.231 4.66875C12.2122 5.75631 12.7185 6.7875 13.656 7.42494C14.0122 7.66869 14.2372 8.0625 14.2372 8.49369C14.2372 8.94369 14.031 9.35625 13.6372 9.6C12.756 10.1813 12.231 11.2374 12.231 12.3062C12.2122 13.3749 12.756 14.3687 13.656 14.9874C14.0122 15.2312 14.2372 15.625 14.2372 16.0562C14.2372 16.5062 14.031 16.9188 13.6372 17.1625C13.3373 17.3499 13.0935 17.5937 12.8873 17.875C12.456 18.4187 12.231 19.0937 12.231 19.8062C12.2122 20.8749 12.756 21.9313 13.656 22.5499C14.0122 22.7937 14.2372 23.1875 14.2372 23.6187C14.2372 24.0687 14.031 24.4813 13.6372 24.725C12.756 25.3062 12.231 26.2999 12.231 27.3687C12.2122 28.4374 12.756 29.4313 13.656 30.0499C14.0122 30.2937 14.2185 30.6499 14.2372 31.0812L14.256 32H23.631L23.6122 31.0438Z\" fill=\"#76B7E2\" />\n<path class=\"p-E63950\" d=\"M23.6309 32H14.2559L14.2372 31.0812C14.2184 30.6499 14.0122 30.2937 13.6559 30.0499C12.756 29.4313 12.2121 28.4374 12.2309 27.3687C12.2309 26.2999 12.756 25.3063 13.6372 24.725C14.031 24.4813 14.2372 24.0687 14.2372 23.6187C14.2372 23.1875 14.0122 22.7937 13.6559 22.5499C12.756 21.9313 12.2121 20.8749 12.2309 19.8062C12.2309 19.0937 12.4559 18.4187 12.8873 17.875H23.0497C22.8247 18.2125 22.5434 18.5124 22.1871 18.7374C21.8121 18.9812 21.6059 19.375 21.6059 19.8062C21.6059 20.2562 21.8121 20.6688 22.1871 20.9125C23.0684 21.5125 23.6121 22.5499 23.6121 23.6187C23.6121 24.6874 23.0872 25.7 22.1871 26.2999C21.8121 26.5437 21.6059 26.9375 21.6059 27.3687C21.6059 27.8187 21.8121 28.2312 22.1871 28.4937C23.0684 29.0562 23.5746 29.9938 23.6121 31.0438L23.6309 32Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF637B\" d=\"M9.375 4.6875V27.3125H0V4.6875C0 2.1 2.1 0 4.6875 0C7.275 0 9.375 2.1 9.375 4.6875Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E63950\" d=\"M9.375 4.6875V27.3125H4.6875V0C7.275 0 9.375 2.1 9.375 4.6875Z\" fill=\"#76B7E2\" />\n<path class=\"p-E63950\" d=\"M4.6875 22.625C2.1 22.625 0 24.725 0 27.3125C0 29.9 2.1 32 4.6875 32C7.275 32 9.375 29.9 9.375 27.3125C9.375 24.725 7.275 22.625 4.6875 22.625Z\" fill=\"#58ADE5\" />\n<path class=\"p-AE2538\" d=\"M9.375 27.3125C9.375 29.9 7.275 32 4.6875 32V22.625C7.275 22.625 9.375 24.725 9.375 27.3125Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_home_textiles_result = browser_sprite_build_default.a.add(svg_cat_home_textiles_symbol);
/* harmony default export */ var svg_cat_home_textiles = (svg_cat_home_textiles_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-home-tools.svg


var svg_cat_home_tools_symbol = new browser_symbol_default.a({
  "id": "svg-cat-home-tools",
  "use": "svg-cat-home-tools-usage",
  "viewBox": "0 0 34 38",
  "content": "<symbol viewBox=\"0 0 34 38\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-home-tools\">\n<path class=\"p-888890\" d=\"M19.4355 36.8867V1.11328C19.4355 0.498433 18.9371 0 18.3223 0C17.7074 0 17.209 0.498433 17.209 1.11328V36.8867C17.209 37.5016 17.7074 38 18.3223 38C18.9371 38 19.4355 37.5016 19.4355 36.8867Z\" fill=\"#A1D1FD\" />\n<path class=\"p-56535A\" d=\"M19.4355 37.4434V1.11328C19.4355 0.498433 18.9371 0 18.3223 0V37.4434C18.3223 37.7508 18.5715 38 18.8789 38C19.1863 38 19.4355 37.7508 19.4355 37.4434Z\" fill=\"#4D98CB\" />\n<path class=\"p-888890\" d=\"M8.67383 24.418V1.11328C8.67383 0.498433 8.17539 0 7.56055 0C6.9457 0 6.44727 0.498434 6.44727 1.11328V24.418H8.67383Z\" fill=\"#A1D1FD\" />\n<path class=\"p-56535A\" d=\"M8.67383 24.418V1.11328C8.67383 0.498433 8.1754 0 7.56055 0V24.418H8.67383Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDC40\" d=\"M15.121 38H0L1.39932 26.1059C1.59719 24.4243 3.02315 23.1562 4.71623 23.1562H10.4048C12.098 23.1562 13.5238 24.4243 13.7218 26.1059L15.121 38Z\" fill=\"#65B3E7\" />\n<path class=\"p-DBB924\" d=\"M7.56055 38H15.1211L13.7217 26.1059C13.5239 24.4243 12.0979 23.1562 10.4048 23.1562H7.56055V38Z\" fill=\"#4D98CB\" />\n<path class=\"p-00C3FF\" d=\"M1.39854 26.1059L1.22168 27.6094H13.8979L13.7211 26.1059C13.6915 25.8545 13.6339 25.6128 13.5528 25.3828H1.56695C1.48568 25.6128 1.42816 25.8545 1.39854 26.1059Z\" fill=\"#A1D1FD\" />\n<path class=\"p-00AAF0\" d=\"M7.56055 27.6094H13.8987L13.7218 26.1059C13.6923 25.8545 13.6347 25.6128 13.5535 25.3828H7.56055V27.6094Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF6849\" d=\"M33.166 38.0002H17.209V29.418L33.166 34.5932V38.0002Z\" fill=\"#65B3E7\" />\n<path class=\"p-E8130F\" d=\"M25.1875 32.0054V37.9999H33.166V34.593L25.1875 32.0054Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_home_tools_result = browser_sprite_build_default.a.add(svg_cat_home_tools_symbol);
/* harmony default export */ var svg_cat_home_tools = (svg_cat_home_tools_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-homewear-men.svg


var svg_cat_homewear_men_symbol = new browser_symbol_default.a({
  "id": "svg-cat-homewear-men",
  "use": "svg-cat-homewear-men-usage",
  "viewBox": "0 0 35 42",
  "content": "<symbol viewBox=\"0 0 35 42\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-homewear-men\">\n<path class=\"p-C5C9F7\" d=\"M34.1817 9.14809V32.6347H28.4395V42H5.74219V32.6347H0V9.14809C0 4.10349 4.10349 0 9.14809 0H25.0333C30.0779 0 34.1817 4.10349 34.1817 9.14809Z\" fill=\"#B9DFFC\" />\n<path class=\"p-98A0F0\" d=\"M34.1818 9.14809V32.6347H28.4397V42H17.0908V0H25.0334C30.078 0 34.1818 4.10349 34.1818 9.14809Z\" fill=\"#A1D1FD\" />\n<path class=\"p-97A1F0\" d=\"M22.2908 0L17.0901 13.2051L11.3457 0H22.2908Z\" fill=\"#5FBEFF\" />\n<path class=\"p-6D76E7\" d=\"M22.2915 0L17.0908 13.2051V0H22.2915Z\" fill=\"#4D98CB\" />\n<path class=\"p-E1E4FC\" d=\"M27.2148 25.7187H22.7992L25.1451 31.0117L22.8149 31.7695L20.2222 25.7187H19.9249L18.256 31.7695L15.9265 31.0117L17.0913 26.507L17.3479 25.7187H6.96777V23.2684H12.8381L15.9845 14.8461L9.98691 0H12.6292L17.0913 11.0447L17.2537 11.4475L21.529 0H24.1459L17.0913 18.8861L15.4545 23.2684H27.2148V25.7187Z\" fill=\"#76B7E2\" />\n<path class=\"p-C5C9F7\" d=\"M24.1455 0L17.0908 18.8861V11.0447L17.2533 11.4475L21.5285 0H24.1455Z\" fill=\"#58ADE5\" />\n<path class=\"p-C5C9F7\" d=\"M27.2143 25.7187H22.7987L25.1446 31.0116L22.8144 31.7695L20.2218 25.7187H19.9244L18.2556 31.7695L17.0908 31.3904V23.2683H27.2143V25.7187Z\" fill=\"#58ADE5\" />\n<path class=\"p-6D76E7\" d=\"M26.915 12.5742C26.915 12.1526 27.2568 11.8108 27.6785 11.8108C28.1001 11.8108 28.4419 12.1526 28.4419 12.5742V41.9999H26.915V12.5742Z\" fill=\"#58ADE5\" />\n<path class=\"p-97A1F0\" d=\"M5.73926 12.5741C5.73926 12.1525 6.08098 11.8108 6.50252 11.8108C6.92406 11.8108 7.26579 12.1525 7.26579 12.5741V41.9999H5.73926V12.5741Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_homewear_men_result = browser_sprite_build_default.a.add(svg_cat_homewear_men_symbol);
/* harmony default export */ var svg_cat_homewear_men = (svg_cat_homewear_men_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-leather-goods.svg


var svg_cat_leather_goods_symbol = new browser_symbol_default.a({
  "id": "svg-cat-leather-goods",
  "use": "svg-cat-leather-goods-usage",
  "viewBox": "0 0 38 38",
  "content": "<symbol viewBox=\"0 0 38 38\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-leather-goods\">\n<path class=\"p-FF637B\" d=\"M38 31.2312C38 34.9273 35.0163 37.9554 31.3203 38L30.118 36.8198H8.90625L6.70195 38C3.00579 37.9554 0 34.9273 0 31.2312C0 28.9156 0.423047 26.6667 1.29148 24.5515L4.16367 17.3374H33.8363L36.7085 24.5515C37.577 26.6667 38 28.9155 38 31.2312Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M38 31.2312C38 34.9273 35.0163 37.9554 31.3203 38L30.118 36.8198H19V17.3374H33.8363L36.7085 24.5515C37.577 26.6667 38 28.9155 38 31.2312Z\" fill=\"#76B7E2\" />\n<path class=\"p-7E5436\" d=\"M31.3203 32.9679V38H6.67969V32.9679C6.67969 29.4499 8.69102 26.3105 11.8305 24.7519C14.1461 23.594 17.1445 21.1672 17.1445 18.5398V17.3374H20.8555V18.5398C20.8555 21.1672 23.8539 23.594 26.1695 24.7519C29.309 26.3105 31.3203 29.4499 31.3203 32.9679Z\" fill=\"#58ADE5\" />\n<path class=\"p-64422A\" d=\"M31.3203 32.9679V38H19V17.3374L20.8555 17.3672V18.5398C20.8555 21.1672 23.8539 23.594 26.1695 24.7519C29.309 26.3105 31.3203 29.4499 31.3203 32.9679Z\" fill=\"#4D98CB\" />\n<path class=\"p-7E5436\" d=\"M28.9453 10.0195V16.8477H24.6259L24.6406 10.0195C24.6406 7.61477 22.8594 4.30469 18.9258 4.30469C14.7695 4.30469 13.2257 7.61477 13.2257 10.0195L13.2109 16.8477H8.90625V10.0195C8.90625 4.49758 13.404 0 18.9258 0C24.4476 0 28.9453 4.49758 28.9453 10.0195Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFDA2D\" d=\"M13.4336 29.0938H24.5664V31.3203H16.5169H13.4336V29.0938Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FDBF00\" d=\"M19 29.0938H24.5664V31.3203H19V29.0938Z\" fill=\"#65B3E7\" />\n<path class=\"p-64422A\" d=\"M28.9453 10.0195V16.8477L24.6406 16.625V9.79688C24.6406 7.39211 22.7852 4.31946 18.9258 4.31946V0C24.4476 0 28.9453 4.49758 28.9453 10.0195Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDA2D\" d=\"M2.22656 15.957H35.7734V17.9609H2.22656V15.957Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FDBF00\" d=\"M19 15.957H35.7734V17.9609H19V15.957Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_leather_goods_result = browser_sprite_build_default.a.add(svg_cat_leather_goods_symbol);
/* harmony default export */ var svg_cat_leather_goods = (svg_cat_leather_goods_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-outwear-men.svg


var svg_cat_outwear_men_symbol = new browser_symbol_default.a({
  "id": "svg-cat-outwear-men",
  "use": "svg-cat-outwear-men-usage",
  "viewBox": "0 0 34 35",
  "content": "<symbol viewBox=\"0 0 34 35\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-outwear-men\">\n<path class=\"p-68544F\" d=\"M33.2051 24.3331V25.4227L31.4151 27.3683H1.71214L0 25.4227V24.4499L1.98452 8.30776L6.40106 3.89122H8.83062L9.72806 0H12.7113C13.8106 0 14.8171 0.359938 15.6297 0.972157C15.9968 1.24908 16.3243 2.5494 16.6026 2.91842C16.8808 2.5494 17.2083 1.24908 17.5754 0.972157C18.388 0.359938 19.3945 0 20.4938 0H23.477V3.89122H26.804L31.2206 8.30776L33.2051 24.3331Z\" fill=\"#76B7E2\" />\n<path class=\"p-53433F\" d=\"M33.2051 24.3331V25.4227L31.4152 27.3683H16.6025V2.93418C16.6025 2.17143 16.9515 1.44617 17.5588 0.984739C18.3743 0.365062 19.3872 0 20.4938 0H23.477L24.3745 3.89122H26.8041L31.2206 8.3077L33.2051 24.3331Z\" fill=\"#58ADE5\" />\n<path class=\"p-53433F\" d=\"M33.2051 25.4229H0V29.3141H33.2051V25.4229Z\" fill=\"#58ADE5\" />\n<path class=\"p-3E322E\" d=\"M33.2051 25.4229H16.6025V29.3141H33.2051V25.4229Z\" fill=\"#4D98CB\" />\n<path class=\"p-68544F\" d=\"M27.3674 13.6191V29.3137L25.4218 31.2594H7.78155L5.83594 29.3137V13.6191H27.3674Z\" fill=\"#76B7E2\" />\n<path class=\"p-53433F\" d=\"M27.3692 13.6196V29.3142L25.4236 31.2598H16.6035V13.6196H27.3692Z\" fill=\"#58ADE5\" />\n<path class=\"p-53433F\" d=\"M27.3693 29.3145H5.83789V35.0005H27.3693V29.3145Z\" fill=\"#58ADE5\" />\n<path class=\"p-3E322E\" d=\"M27.3673 29.3145H16.6016V35.0005H27.3673V29.3145Z\" fill=\"#4D98CB\" />\n<path class=\"p-3E322E\" d=\"M29.3128 13.6196H27.3672V27.3686H29.3128V13.6196Z\" fill=\"#4D98CB\" />\n<path class=\"p-53433F\" d=\"M5.83624 13.6191H3.89062V27.3681H5.83624V13.6191Z\" fill=\"#58ADE5\" />\n<path class=\"p-DFD7D5\" d=\"M17.5745 0.971924V34.9997H15.6289V0.971924C15.996 1.24885 16.3235 1.57636 16.6017 1.94538C16.8799 1.57636 17.2074 1.24885 17.5745 0.971924Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D2C5C2\" d=\"M17.5753 0.971924C17.2083 1.24885 16.8808 1.57636 16.6025 1.94538V34.9997H17.5753V0.971924Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_outwear_men_result = browser_sprite_build_default.a.add(svg_cat_outwear_men_symbol);
/* harmony default export */ var svg_cat_outwear_men = (svg_cat_outwear_men_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod.svg


var svg_cat_prod_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod",
  "use": "svg-cat-prod-usage",
  "viewBox": "0 0 37 37",
  "content": "<symbol viewBox=\"0 0 37 37\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod\">\n<path class=\"p-61D7A8\" d=\"M34.832 20.2598C34.832 21.2136 34.5718 22.146 34.1164 22.9697H15.9636C15.5083 22.146 15.248 21.2136 15.248 20.2598C15.248 18.0483 16.5923 16.1406 18.5 15.3166C18.8684 15.1216 19.2588 15.0132 19.6706 14.9265C20.1477 12.4116 22.3592 10.5039 25.0039 10.5039C27.6487 10.5039 29.8601 12.4116 30.3372 14.9265C32.8521 15.4036 34.832 17.6147 34.832 20.2598Z\" fill=\"#B9DFFC\" />\n<path class=\"p-00AB94\" d=\"M34.1164 22.9697H18.5V15.3166C18.8684 15.1216 19.2588 15.0132 19.6706 14.9265C20.1477 12.4116 22.3592 10.5039 25.0039 10.5039C27.6487 10.5039 29.8601 12.4116 30.3372 14.9265C32.8521 15.4036 34.832 17.6147 34.832 20.2598C34.832 21.2136 34.5718 22.146 34.1164 22.9697Z\" fill=\"#58ADE5\" />\n<path class=\"p-61D7A8\" d=\"M6.73792 18.569L5.58817 15.6531L3.8871 18.3542L1.58787 16.0549C0.564293 15.0322 0 13.671 0 12.2229C0 10.7747 0.564293 9.41328 1.58787 8.39083C3.63304 6.34368 7.20483 6.34368 9.25198 8.39083L11.5512 10.6901L8.85014 12.3911L11.766 13.5409L6.73792 18.569Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF9100\" d=\"M23.595 5.5827C22.229 4.21699 20.2782 3.73992 18.5003 4.15206C17.5682 4.36858 16.6575 4.84564 15.9422 5.5827C13.8174 7.70719 13.8174 11.1328 15.9422 13.2572L16.7007 14.016L24.3756 6.36322L23.595 5.5827Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFD396\" d=\"M9.50684 3.58496L11.3272 4.76233L10.1499 6.58274L8.32946 5.40537L9.50684 3.58496Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFD396\" d=\"M11.7627 16.5767L13.5112 17.8583L12.2295 19.6069L10.481 18.3252L11.7627 16.5767Z\" fill=\"#5FBEFF\" />\n<path class=\"p-009184\" d=\"M28.6904 18.3089L26.0883 20.2603V15.9238H23.9203V20.2603L21.3182 18.3089L20.0186 20.0427L24.3545 23.2946H25.6541L29.9901 20.0427L28.6904 18.3089Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFB64C\" d=\"M32.748 6.67188C30.955 6.67188 29.4238 5.21301 29.4238 3.41992C29.4238 1.62683 30.955 0.167969 32.748 0.167969C34.5411 0.167969 36 1.62683 36 3.41992C36 5.21301 34.5411 6.67188 32.748 6.67188Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF641A\" d=\"M24.3753 6.36322L18.5 12.2167V4.15206C20.2778 3.73992 22.2287 4.21699 23.5947 5.5827L24.3753 6.36322Z\" fill=\"#4D98CB\" />\n<path class=\"p-C5D3DD\" d=\"M37 21.3438V22.4277C37 23.5335 36.8481 24.6174 36.6099 25.6797L32.6641 27.8477H4.4082L0.390121 25.6797C0.151871 24.6174 0 23.5335 0 22.4277V21.3438H37Z\" fill=\"#A1D1FD\" />\n<path class=\"p-9FACBA\" d=\"M37 21.3438V22.4277C37 23.5335 36.8481 24.6174 36.6099 25.6797L32.6641 27.8477H18.5V21.3438H37Z\" fill=\"#5FBEFF\" />\n<path class=\"p-DEECF1\" d=\"M36.6094 25.6797C34.8316 33.8962 28.6238 36.3101 28.2554 36.5918H8.74367C8.39674 36.3101 2.1675 33.8528 0.389648 25.6797H36.6094Z\" fill=\"#B9DFFC\" />\n<path class=\"p-C5D3DD\" d=\"M36.6099 25.6797C34.832 33.8962 28.6242 36.3101 28.2559 36.5918H18.5V25.6797H36.6099Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_prod_result = browser_sprite_build_default.a.add(svg_cat_prod_symbol);
/* harmony default export */ var svg_cat_prod = (svg_cat_prod_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-animals.svg


var svg_cat_prod_animals_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-animals",
  "use": "svg-cat-prod-animals-usage",
  "viewBox": "0 0 37 30",
  "content": "<symbol viewBox=\"0 0 37 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-animals\">\n<path class=\"p-8F562F\" d=\"M7.06397 8.78022L6.48382 8.35869C4.66171 7.03486 2.10234 7.44027 0.778652 9.26231H0.77858C-0.545185 11.0843 -0.139846 13.6437 1.68226 14.9676L2.26241 15.3891C2.98579 15.9147 3.82538 16.1677 4.65781 16.1677C5.92195 16.1677 7.16948 15.5841 7.96773 14.4855C9.29135 12.6634 8.88601 10.104 7.06397 8.78022Z\" fill=\"#58ADE5\" />\n<path class=\"p-4C250B\" d=\"M36.2215 9.35951C34.8978 7.53747 32.3383 7.13198 30.5163 8.45589L29.9361 8.87742C28.1141 10.2012 27.7087 12.7606 29.0325 14.5827C29.8308 15.6814 31.0782 16.2649 32.3424 16.2649C33.1747 16.2649 34.0145 16.0118 34.7378 15.4863L35.3179 15.0648C37.14 13.7409 37.5453 11.1815 36.2215 9.35951Z\" fill=\"#4D98CB\" />\n<path class=\"p-8F562F\" d=\"M9.32985 7.16387C9.89013 8.88806 11.4953 9.98658 13.2174 9.98658C13.6346 9.98658 14.059 9.92204 14.4767 9.78633H14.4768C15.5143 9.44921 16.3586 8.72814 16.8539 7.75602C17.3493 6.7839 17.4363 5.67708 17.0991 4.63948L16.5094 2.82438C16.1723 1.78679 15.4513 0.942582 14.4791 0.447272C13.507 -0.0481097 12.4001 -0.13519 11.3626 0.202002C10.325 0.539122 9.48074 1.26012 8.98536 2.23231C8.48998 3.20443 8.4029 4.31125 8.74009 5.34885L9.32985 7.16387Z\" fill=\"#58ADE5\" />\n<path class=\"p-4C250B\" d=\"M22.5234 9.82315C22.9413 9.95886 23.3654 10.0234 23.7828 10.0234C25.5047 10.0234 27.11 8.92488 27.6703 7.20069L28.2601 5.38559C28.9561 3.24356 27.7796 0.934744 25.6376 0.238824C23.4957 -0.457095 21.1869 0.71932 20.4909 2.86128L19.9012 4.67631C19.5641 5.7139 19.6511 6.82072 20.1464 7.79284C20.6415 8.76503 21.4858 9.4861 22.5234 9.82315Z\" fill=\"#4D98CB\" />\n<path class=\"p-4C250B\" d=\"M18.5003 11.4673L17.0537 20.6535L18.5003 28.646C19.1295 28.646 19.7585 28.8006 20.332 29.1099C21.2353 29.5972 22.2159 29.8399 23.1952 29.8398C24.26 29.8397 25.3231 29.5526 26.2815 28.9806C28.1211 27.8827 29.2195 25.9481 29.2195 23.8056V22.1861C29.2195 19.3159 28.0999 16.6194 26.0668 14.5934C24.0426 12.5762 21.3581 11.4697 18.5003 11.4673Z\" fill=\"#4D98CB\" />\n<path class=\"p-8F562F\" d=\"M18.4626 11.4673C12.5729 11.4877 7.78125 16.3431 7.78125 22.291V23.8059C7.78125 25.9484 8.87955 27.883 10.7193 28.9809C12.5589 30.0788 14.7831 30.1273 16.6687 29.1102C17.2422 28.801 17.8713 28.6462 18.5004 28.6462V11.4677C18.4877 11.4677 18.4751 11.4672 18.4626 11.4673Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_prod_animals_result = browser_sprite_build_default.a.add(svg_cat_prod_animals_symbol);
/* harmony default export */ var svg_cat_prod_animals = (svg_cat_prod_animals_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-assians-food.svg


var svg_cat_prod_assians_food_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-assians-food",
  "use": "svg-cat-prod-assians-food-usage",
  "viewBox": "0 0 31 34",
  "content": "<symbol viewBox=\"0 0 31 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-assians-food\">\n<path class=\"p-895D3C\" d=\"M30.7459 4.09033H0V5.23122L30.7459 6.13552V4.09033Z\" fill=\"#58ADE5\" />\n<path class=\"p-714C2F\" d=\"M30.7464 4.09033H13.3623V5.42558L30.7464 6.13552V4.09033Z\" fill=\"#4D98CB\" />\n<path class=\"p-F4D7AF\" d=\"M4.79232 18.277L3.4834 16.7021C5.81491 14.7388 6.42847 11.2892 4.93548 8.6919C3.5243 6.23768 3.5243 3.39481 4.69006 1.02246H7.0624C5.67175 2.94493 5.46723 5.52187 6.71479 7.66931C8.69855 11.1461 7.88055 15.6795 4.79232 18.277Z\" fill=\"#A1D1FD\" />\n<path class=\"p-F4D7AF\" d=\"M11.5827 14.0844C10.9897 16.2523 9.53756 18.0724 7.49237 19.2382L6.49023 17.4384C8.04457 16.559 9.16943 15.1683 9.6193 13.5526C10.0489 11.9573 9.84434 10.1031 9.02626 8.6919C7.90141 6.72846 7.63554 4.33566 8.31052 2.18822C8.43323 1.77918 8.57625 1.39059 8.78084 1.02246H11.1124C10.7441 1.55421 10.4579 2.14731 10.2533 2.78132C9.76246 4.41747 9.9466 6.19671 10.8056 7.66931C11.8691 9.57133 12.1758 11.9983 11.5827 14.0844Z\" fill=\"#A1D1FD\" />\n<path class=\"p-F4D7AF\" d=\"M15.5506 14.5138C15.1211 15.8227 14.3643 16.9885 13.3623 17.9089C12.5851 18.6656 11.6647 19.2586 10.6013 19.7086L9.80371 17.827C11.4399 17.1317 12.6874 15.9455 13.3623 14.4525C13.4646 14.2684 13.5465 14.0639 13.6078 13.8593C14.0986 12.3869 14.0168 10.6144 13.3623 9.2032C13.3009 9.03951 13.2192 8.85545 13.1169 8.6919C11.9512 6.64672 11.7057 4.21295 12.4625 1.98363C12.5647 1.65647 12.7079 1.32917 12.851 1.02246H15.2234C14.8553 1.51331 14.5894 2.0655 14.3849 2.63809C13.8327 4.29469 14.0168 6.13542 14.8962 7.66931C16.0619 9.71449 16.2869 12.2846 15.5506 14.5138Z\" fill=\"#A1D1FD\" />\n<path class=\"p-00C8C8\" d=\"M20.5202 30.7117V34H6.13574V30.7117L13.3621 28.6665L20.5202 30.7117Z\" fill=\"#65B3E7\" />\n<path class=\"p-1CADB5\" d=\"M20.5204 30.7117V34H13.3623V28.6665L20.5204 30.7117Z\" fill=\"#4D98CB\" />\n<path class=\"p-00C8C8\" d=\"M0 15.3572V19.5658C0 20.1384 0.449872 20.5884 1.02259 20.5884H25.633C26.2057 20.5884 26.6556 20.1384 26.6556 19.5658V15.3572H0Z\" fill=\"#65B3E7\" />\n<path class=\"p-1CADB5\" d=\"M26.656 15.3572V19.5658C26.656 20.1384 26.2061 20.5884 25.6334 20.5884H13.3623V15.3572H26.656Z\" fill=\"#4D98CB\" />\n<path class=\"p-64E1DC\" d=\"M26.6556 19.5657V23.656C26.6556 27.2556 23.9764 30.2006 20.52 30.7119H6.13555C2.67919 30.2006 0 27.2556 0 23.656V19.5657H26.6556Z\" fill=\"#B9DFFC\" />\n<path class=\"p-00C8C8\" d=\"M26.656 19.5657V23.656C26.656 27.2556 23.9768 30.2006 20.5204 30.7119H13.3623V19.5657H26.656Z\" fill=\"#A1D1FD\" />\n<path class=\"p-895D3C\" d=\"M30.7459 0L0 0.904292V2.04518H30.7459V0Z\" fill=\"#58ADE5\" />\n<path class=\"p-714C2F\" d=\"M30.7464 0L13.3623 0.593442V2.04518H30.7464V0Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_prod_assians_food_result = browser_sprite_build_default.a.add(svg_cat_prod_assians_food_symbol);
/* harmony default export */ var svg_cat_prod_assians_food = (svg_cat_prod_assians_food_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-car.svg


var svg_cat_prod_car_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-car",
  "use": "svg-cat-prod-car-usage",
  "viewBox": "0 0 37 27",
  "content": "<symbol viewBox=\"0 0 37 27\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-car\">\n<path class=\"p-E63950\" d=\"M6.61823 8.07272L4.74987 4.33594H3.25195C2.65328 4.33594 2.16797 3.85062 2.16797 3.25195C2.16797 2.65329 2.65328 2.16797 3.25195 2.16797H6.08997L8.55755 7.10306L6.61823 8.07272Z\" fill=\"#65B3E7\" />\n<path class=\"p-AE2538\" d=\"M30.3817 8.07272L28.4424 7.10306L30.91 2.16797H33.748C34.3466 2.16797 34.832 2.65329 34.832 3.25195C34.832 3.85062 34.3466 4.33594 33.748 4.33594H32.2501L30.3817 8.07272Z\" fill=\"#4D98CB\" />\n<path class=\"p-68544F\" d=\"M30.3007 10.2544L18.4998 10.4929L6.52539 10.7531L9.75566 1.08398H27.2439L30.3007 10.2544Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E63950\" d=\"M28.0244 0H8.97519L5.00781 11.8804L18.4998 11.5769L31.7966 11.295L28.0244 0ZM8.04304 9.64746L10.5361 2.16797H26.4635L28.8048 9.19219L18.4998 9.40891L8.04304 9.64746Z\" fill=\"#65B3E7\" />\n<path class=\"p-53433F\" d=\"M30.3009 10.2544L18.5 10.4929V1.08398H27.2441L30.3009 10.2544Z\" fill=\"#58ADE5\" />\n<path class=\"p-AE2538\" d=\"M31.7968 11.295L18.5 11.5769V9.40891L28.805 9.19219L26.4637 2.16797H18.5V0H28.0246L31.7968 11.295Z\" fill=\"#4D98CB\" />\n<path class=\"p-53433F\" d=\"M2.16797 20.5957V22.7637C2.16797 24.5569 3.62672 26.0156 5.41992 26.0156H7.58789C9.38109 26.0156 10.8398 24.5569 10.8398 22.7637V20.5957H2.16797Z\" fill=\"#5FBEFF\" />\n<path class=\"p-3E322E\" d=\"M26.1602 20.5957V22.7637C26.1602 24.5569 27.6189 26.0156 29.4121 26.0156H31.5801C33.3733 26.0156 34.832 24.5569 34.832 22.7637V20.5957H26.1602Z\" fill=\"#4D98CB\" />\n<path class=\"p-53433F\" d=\"M26.1602 9.75586H23.9922C23.9922 7.95637 22.4675 6.50391 20.668 6.50391C19.8225 6.50391 19.0637 6.82903 18.5 7.34941C17.8279 7.93469 17.416 8.80188 17.416 9.75586H15.248C15.248 7.52278 16.5922 5.61497 18.5 4.79114C19.1721 4.4877 19.9093 4.33594 20.668 4.33594C23.6598 4.33594 26.1602 6.76406 26.1602 9.75586Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF637B\" d=\"M37 10.8398L33.618 14.5687L37 17.3438V21.6797H29.0002L24.4041 17.3438H12.5959L7.9998 21.6797H0V17.3438L2.08132 13.8966L0 10.8398V9.75586C0 7.95637 1.45247 6.50391 3.25195 6.50391H7.84805L12.184 8.67188H24.816L29.152 6.50391H33.748C35.5475 6.50391 37 7.95637 37 9.75586V10.8398Z\" fill=\"#65B3E7\" />\n<path class=\"p-3E322E\" d=\"M20.668 6.50398C19.8225 6.50398 19.0637 6.8291 18.5 7.34949V4.79114C19.1721 4.4877 19.9093 4.33594 20.668 4.33594C23.6598 4.33594 26.1602 6.76406 26.1602 9.75586H23.9922C23.9922 7.95645 22.4675 6.50398 20.668 6.50398Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M37 10.8398L33.618 14.5687L37 17.3438V21.6797H29.0002L24.4041 17.3438H18.5V8.67188H24.816L29.152 6.50391H33.748C35.5475 6.50391 37 7.95637 37 9.75586V10.8398Z\" fill=\"#4D98CB\" />\n<path class=\"p-BBDCFF\" d=\"M37 10.8398V17.3438H29.3281V16.2598C29.3281 13.268 30.7562 10.8398 33.748 10.8398H37Z\" fill=\"#65B3E7\" />\n<path class=\"p-E0F4FF\" d=\"M7.67188 17.3438H0V10.8398H3.25195C6.24035 10.8398 7.67188 13.2714 7.67188 16.2598V17.3438Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFDA2D\" d=\"M25.7484 16.1758H11.252L8 21.6797H29.0004L25.7484 16.1758Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDBF00\" d=\"M29.0002 21.6797H18.5V16.1758H25.7482L29.0002 21.6797Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_prod_car_result = browser_sprite_build_default.a.add(svg_cat_prod_car_symbol);
/* harmony default export */ var svg_cat_prod_car = (svg_cat_prod_car_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-children.svg


var svg_cat_prod_children_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-children",
  "use": "svg-cat-prod-children-usage",
  "viewBox": "0 0 37 37",
  "content": "<symbol viewBox=\"0 0 37 37\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-children\">\n<path class=\"p-FF9100\" d=\"M1.47266 35.5276C2.38241 36.4374 3.63918 37 5.0274 37C6.41563 37 7.6724 36.4374 8.58215 35.5276L5.0274 29.9272L1.47266 35.5276Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFDE55\" d=\"M1.47241 28.418C0.56266 29.3276 0 30.5844 0 31.9726C0 33.3609 0.56266 34.6176 1.47241 35.5274L6.04993 30.9499L1.47241 28.418Z\" fill=\"#A1D1FD\" />\n<path class=\"p-B4D2D7\" d=\"M9.93263 30.8697L19.9281 20.8742L18.0268 16.9272L8.03125 28.9684L9.93263 30.8697Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E1EBF0\" d=\"M6.12988 27.0674L8.03126 28.9686L19.0497 17.9503L16.1255 17.0718L6.12988 27.0674Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M17.7979 19.2023C19.8334 21.2378 22.6455 22.4968 25.7517 22.4968C26.6592 22.4968 27.5413 22.3887 28.3865 22.1857L21.6004 13.354L17.7979 19.2023Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFDE55\" d=\"M14.814 8.61377C14.6111 9.45899 14.5029 10.3411 14.5029 11.2486C14.5029 14.3548 15.7619 17.1668 17.7975 19.2024L22.6229 14.377L14.814 8.61377Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FF3C7D\" d=\"M34.2294 18.6404C34.6548 15.9177 30.206 7.40073 28.8803 6.07422L21.6006 15.3995L28.3867 22.1856C30.6919 21.6322 32.7207 20.3692 34.2294 18.6404Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFA2C1\" d=\"M29.9026 7.09708C28.577 5.77144 21.5086 2.29474 18.3597 2.77104C16.6308 4.27973 15.3678 6.30859 14.8145 8.61379L21.6006 15.3999L29.903 7.09744C29.9029 7.09737 29.9028 7.09722 29.9026 7.09708Z\" fill=\"#65B3E7\" />\n<path class=\"p-00CC76\" d=\"M30.5113 17.0937C31.8307 18.4131 32.9122 17.3444 34.2293 18.6407C35.4012 17.2979 36.2593 15.6741 36.6891 13.8836L29.903 5.05176L25.209 11.7913C26.5344 13.1163 27.6199 12.0311 28.9454 13.3565C30.2712 14.6824 29.1856 15.768 30.5113 17.0937Z\" fill=\"#65B3E7\" />\n<path class=\"p-CCFC5C\" d=\"M23.1165 0.311035C21.326 0.740871 19.7021 1.59888 18.3594 2.77081C19.6557 4.08771 18.5868 5.16931 19.906 6.48845C21.2316 7.81401 22.3171 6.72844 23.6427 8.05401C24.9684 9.37965 23.8827 10.4652 25.2083 11.7909C25.2085 11.791 25.2086 11.7911 25.2087 11.7912L30.9255 6.07444L23.1165 0.311035Z\" fill=\"#AFD9F6\" />\n<path class=\"p-3440DB\" d=\"M36.6884 13.8832C36.8914 13.0379 36.9996 12.1558 36.9996 11.2483C36.9996 8.14209 35.7406 5.33001 33.705 3.29443L30.3541 4.59977L29.9023 7.09705L36.6884 13.8832Z\" fill=\"#4D98CB\" />\n<path class=\"p-2682FF\" d=\"M33.706 3.29459C31.6704 1.25901 28.8583 0 25.7521 0C24.8446 0 23.9625 0.108254 23.1172 0.311176L29.9033 7.09728L33.706 3.29459Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF3C7D\" d=\"M8.58202 35.5275C9.49177 34.6177 10.0544 33.3609 10.0544 31.9727C10.0544 30.5845 9.49177 29.3277 8.58202 28.418L5.78187 29.1725L5.02734 31.9726L8.58202 35.5275Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFA2C1\" d=\"M1.47266 28.4182L5.0274 31.973L8.58215 28.4182C7.6724 27.5085 6.41563 26.9458 5.0274 26.9458C3.63918 26.9457 2.38241 27.5085 1.47266 28.4182Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_prod_children_result = browser_sprite_build_default.a.add(svg_cat_prod_children_symbol);
/* harmony default export */ var svg_cat_prod_children = (svg_cat_prod_children_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-coffee.svg


var svg_cat_prod_coffee_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-coffee",
  "use": "svg-cat-prod-coffee-usage",
  "viewBox": "0 0 33 32",
  "content": "<symbol viewBox=\"0 0 33 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-coffee\">\n<path class=\"p-F4D7AF\" d=\"M25.1889 28.9774H23.2249V26.9623H25.1889C27.9666 26.9623 30.2267 24.7022 30.2267 21.9245C30.2267 19.1468 27.9666 16.8867 25.1889 16.8867H22.9219V14.8716H25.1889C29.0775 14.8716 32.2418 18.0359 32.2418 21.9245C32.2418 25.8131 29.0775 28.9774 25.1889 28.9774Z\" fill=\"#76B7E2\" />\n<path class=\"p-F4D7AF\" d=\"M22.489 30.7507L21.7234 32.0001H7.05325L2.96248 23.7179C2.3378 20.7758 2.31778 17.7733 2.84158 14.8716L14.1062 12.8564L25.3506 14.8716C26.3178 20.2922 25.3506 25.9749 22.489 30.7507Z\" fill=\"#76B7E2\" />\n<path class=\"p-DABBA6\" d=\"M22.4883 30.7507L21.7227 32.0001H14.1055V12.8564L25.3499 14.8716C26.3171 20.2922 25.3499 25.9749 22.4883 30.7507Z\" fill=\"#4D98CB\" />\n<path class=\"p-FAECD8\" d=\"M13.0746 6.04536C13.0746 7.01255 12.6513 7.93957 11.9259 8.58441L10.5959 7.05292C10.878 6.8111 11.0594 6.44838 11.0594 6.04536C11.0594 5.66249 10.878 5.29976 10.5959 5.05795C9.87044 4.41311 9.44727 3.48609 9.44727 2.53905C9.44727 1.57186 9.87051 0.644838 10.5959 0L11.9259 1.53149C11.6438 1.77331 11.4624 2.13603 11.4624 2.53905C11.4624 2.92192 11.6438 3.28464 11.9259 3.52646C12.6513 4.1713 13.0746 5.09832 13.0746 6.04536Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FAECD8\" d=\"M16.9619 8.57749L15.6355 7.06024C15.9248 6.80735 16.0911 6.44133 16.0911 6.05564C16.0911 5.66994 15.9248 5.30393 15.6355 5.05103C14.9084 4.4154 14.4912 3.49637 14.4912 2.52918C14.4912 1.56199 14.9084 0.64296 15.6355 0.00732422L16.9619 1.52457C16.6726 1.77747 16.5063 2.14349 16.5063 2.52918C16.5063 2.91487 16.6726 3.28089 16.9619 3.53378C17.689 4.16942 18.1062 5.08845 18.1062 6.05564C18.1062 7.02283 17.689 7.94186 16.9619 8.57749Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FAECD8\" d=\"M25.3498 14.8714H2.84082C3.12294 13.3802 3.52603 11.9092 4.11035 10.4583H4.26702H23.707H24.1005C24.6848 11.8891 25.0677 13.3802 25.3498 14.8714Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F4D7AF\" d=\"M25.3499 14.8714H14.1055V10.4583H23.7069H24.1005C24.6848 11.8891 25.0677 13.3802 25.3499 14.8714Z\" fill=\"#76B7E2\" />\n<path class=\"p-714C2F\" d=\"M14.0253 27.5867C13.6021 30.1056 10.7204 31.9998 7.05292 31.9998C3.10322 31.9998 0 29.7832 0 26.962C0 26.7 0.0605208 26.438 0.100756 26.1962C1.99497 28.1308 4.89674 26.3777 7.05292 24.9468C8.88661 23.7176 11.2646 25.7327 13.0983 26.962L14.0253 27.5867Z\" fill=\"#76B7E2\" />\n<path class=\"p-523522\" d=\"M14.0251 27.5867C13.6019 30.1056 10.7203 31.9998 7.05273 31.9998V24.9468C8.88643 23.7176 11.2644 25.7327 13.0981 26.962L14.0251 27.5867Z\" fill=\"#4D98CB\" />\n<path class=\"p-895D3C\" d=\"M14.1057 26.9621C14.1057 27.1636 14.0451 27.3651 14.0251 27.5868L13.0981 26.9621C11.2644 25.7329 8.88644 25.7329 7.05275 26.9621C4.89657 28.3929 1.9948 28.1309 0.100586 26.1964C0.604366 23.758 3.46577 21.9243 7.05275 21.9243C11.0025 21.9243 14.1057 24.1409 14.1057 26.9621Z\" fill=\"#B9DFFC\" />\n<path class=\"p-714C2F\" d=\"M14.1057 26.9621C14.1057 27.1636 14.0451 27.3651 14.0251 27.5868L13.0981 26.9621C11.2644 25.7329 8.88643 25.7329 7.05273 26.9621V21.9243C11.0024 21.9243 14.1057 24.1409 14.1057 26.9621Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_prod_coffee_result = browser_sprite_build_default.a.add(svg_cat_prod_coffee_symbol);
/* harmony default export */ var svg_cat_prod_coffee = (svg_cat_prod_coffee_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-drink.svg


var svg_cat_prod_drink_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-drink",
  "use": "svg-cat-prod-drink-usage",
  "viewBox": "0 0 25 35",
  "content": "<symbol viewBox=\"0 0 25 35\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-drink\">\n<path class=\"p-FFF5F5\" d=\"M20.7743 30.8301L20.4258 35H4.18352L3.83496 30.8301L6.48039 28.7793H18.9081L20.7743 30.8301Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF9100\" d=\"M1.94824 9.29663L3.83495 30.8297H20.7743L22.661 9.29663H1.94824Z\" fill=\"#65B3E7\" />\n<path class=\"p-EFE2DD\" d=\"M18.9081 28.7793L20.7744 30.8301L20.4258 35H12.3047V28.7793H18.9081Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF641A\" d=\"M22.6611 9.29663L20.7744 30.8297H12.3047V9.29663H22.6611Z\" fill=\"#58ADE5\" />\n<path class=\"p-596C76\" d=\"M2.05078 0V7.07516H22.5585V2.92967L12.3046 1.46484L2.05078 0Z\" fill=\"#65B3E7\" />\n<path class=\"p-465A61\" d=\"M22.5585 2.92954V7.07503H12.3047V1.75781L22.5585 2.92954Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFF5F5\" d=\"M0 5.19531V10.4687H24.6093V5.19531H0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EFE2DD\" d=\"M24.6093 5.19531H12.3047V10.4687H24.6093V5.19531Z\" fill=\"#A1D1FD\" />\n<path class=\"p-465A61\" d=\"M17.4316 20.5762C17.4316 23.6524 15.5244 26.2158 13.0634 26.6464L12.3047 25.4776L12.2227 25.3544L10.9512 26.5029C8.77741 25.8057 7.17773 23.4063 7.17773 20.5762C7.17773 17.5001 9.08495 14.9366 11.5459 14.5059L12.3047 15.8184L12.3866 15.9619L13.6581 14.6494C15.8319 15.3467 17.4316 17.7461 17.4316 20.5762Z\" fill=\"#A1D1FD\" />\n<path class=\"p-3B4A51\" d=\"M13.0635 26.6464L12.3047 25.4775V15.8184L12.3867 15.9619L13.6581 14.6494C15.8319 15.3467 17.4316 17.7461 17.4316 20.5761C17.4316 23.6523 15.5244 26.2158 13.0635 26.6464Z\" fill=\"#5FBEFF\" />\n<path class=\"p-596C76\" d=\"M13.5755 25.1288L13.0628 26.6464C12.8168 26.708 12.5707 26.7285 12.3041 26.7285C11.8325 26.7285 11.3812 26.6464 10.9506 26.5029L11.6273 24.4725C12.017 23.3445 11.935 22.1142 11.3812 21.0272C10.6019 19.4686 10.4789 17.6844 11.0327 16.0233L11.5453 14.5057C11.7914 14.4443 12.0375 14.4238 12.3041 14.4238C12.7757 14.4238 13.2269 14.5058 13.6575 14.6494L12.9808 16.6797C12.5912 17.8076 12.6731 19.0381 13.2269 20.125C14.0063 21.6835 14.1293 23.4677 13.5755 25.1288Z\" fill=\"#65B3E7\" />\n<path class=\"p-465A61\" d=\"M13.2275 20.1249C14.0068 21.6835 14.1299 23.4677 13.5761 25.1288L13.0634 26.6464C12.8174 26.708 12.5713 26.7285 12.3047 26.7285V14.4238C12.7763 14.4238 13.2275 14.5058 13.6581 14.6494L12.9814 16.6797C12.5918 17.8075 12.6738 19.0381 13.2275 20.1249Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_prod_drink_result = browser_sprite_build_default.a.add(svg_cat_prod_drink_symbol);
/* harmony default export */ var svg_cat_prod_drink = (svg_cat_prod_drink_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-garden.svg


var svg_cat_prod_garden_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-garden",
  "use": "svg-cat-prod-garden-usage",
  "viewBox": "0 0 40 40",
  "content": "<symbol viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-garden\">\n<path class=\"p-DEECF1\" d=\"M25.8594 7.1875H37.5781V18.9062H25.8594V7.1875Z\" fill=\"#A1D1FD\" />\n<path class=\"p-C6E2E7\" d=\"M31.7188 7.1875H37.5781V18.9062H31.7188V7.1875Z\" fill=\"#B9DFFC\" />\n<path class=\"p-5A5A5A\" d=\"M30.5469 14.2188H32.8906V18.0859H30.5469V14.2188Z\" fill=\"#AFD9F6\" />\n<path class=\"p-C83C50\" d=\"M40 9.53124H23.5156L25.8594 4.84375H37.5781L40 9.53124Z\" fill=\"#AFD9F6\" />\n<path class=\"p-444444\" d=\"M31.7188 14.2188H32.8906V18.0859H31.7188V14.2188Z\" fill=\"#4D98CB\" />\n<path class=\"p-B03244\" d=\"M40 9.53124H31.7188V4.84375H37.5781L40 9.53124Z\" fill=\"#4D98CB\" />\n<path class=\"p-A9DA40\" d=\"M40 16.445V23.5465L31.7188 25.8432L20.1642 29.0778L16.1094 23.3121C20.7737 20.0074 26.1408 17.8278 31.7188 16.9138C34.039 16.5152 36.4844 16.3514 38.8516 16.4215L40 16.445Z\" fill=\"#58ADE5\" />\n<path class=\"p-90C225\" d=\"M40 16.4451V23.5466L31.7188 25.8433V16.9136C34.039 16.5153 36.4844 16.3512 38.8516 16.4216L40 16.4451Z\" fill=\"#4D98CB\" />\n<path class=\"p-C9E36A\" d=\"M39.9998 23.5465V30.5777L31.7186 32.7576L24.1719 34.7497L20.1641 29.0778C23.6562 26.6403 27.5935 24.9527 31.7186 24.1324C34.3904 23.5465 37.2343 23.3591 39.9998 23.5465Z\" fill=\"#5FBEFF\" />\n<path class=\"p-A9DA40\" d=\"M40 23.5465V30.5777L31.7188 32.7576V24.1324C34.3906 23.5465 37.2345 23.3591 40 23.5465Z\" fill=\"#58ADE5\" />\n<path class=\"p-A9DA40\" d=\"M39.9998 30.5781V40H27.8749L25.5076 36.6486L24.1719 34.7501C26.4216 33.2032 28.9997 32.0313 31.7185 31.3282C33.6872 30.7657 35.7496 30.4844 37.7888 30.4844L39.9998 30.5781Z\" fill=\"#58ADE5\" />\n<path class=\"p-90C225\" d=\"M37.789 30.4844L40 30.5781V40H31.7188V31.3282C33.6874 30.7657 35.7498 30.4844 37.789 30.4844Z\" fill=\"#4D98CB\" />\n<path class=\"p-FED2A4\" d=\"M9.45312 0H11.7969V3.67186H9.45312V0Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FED2A4\" d=\"M9.45312 13.0469H11.7969V16.5625H9.45312V13.0469Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FED2A4\" d=\"M5.65222 1.72949L8.13909 4.21636L6.48199 5.87346L3.99512 3.38659L5.65222 1.72949Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FFBD86\" d=\"M14.7675 10.8447L17.2543 13.3316L15.5972 14.9887L13.1104 12.5018L14.7675 10.8447Z\" fill=\"#58ADE5\" />\n<path class=\"p-FED2A4\" d=\"M2.42188 7.1875H5.93749V9.53124H2.42188V7.1875Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FFBD86\" d=\"M15.3125 7.1875H18.8281V9.53124H15.3125V7.1875Z\" fill=\"#58ADE5\" />\n<path class=\"p-FED2A4\" d=\"M6.48266 10.8452L8.13976 12.5023L5.65289 14.9889L3.99609 13.3318L6.48266 10.8452Z\" fill=\"#AFD9F6\" />\n<path class=\"p-FFBD86\" d=\"M15.5969 1.72949L17.254 3.38659L14.7675 5.87346L13.1104 4.21636L15.5969 1.72949Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFBD86\" d=\"M10.625 0H11.7969V3.67186H10.625V0Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFBD86\" d=\"M10.625 13.0469H11.7969V16.5625H10.625V13.0469Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFBD86\" d=\"M10.625 2.5C7.39074 2.5 4.76562 5.12511 4.76562 8.35936C4.76562 11.5936 7.39074 14.2187 10.625 14.2187C13.8592 14.2187 16.4843 11.5936 16.4843 8.35936C16.4843 5.12511 13.8592 2.5 10.625 2.5Z\" fill=\"#58ADE5\" />\n<path class=\"p-F6A96C\" d=\"M16.4844 8.35936C16.4844 11.5936 13.8592 14.2187 10.625 14.2187V2.5C13.8592 2.5 16.4844 5.12511 16.4844 8.35936Z\" fill=\"#4D98CB\" />\n<path class=\"p-90C225\" d=\"M27.875 39.9999H20.4452L0 25.9841V18.9529C3.56261 18.8125 7.17985 19.3047 10.625 20.5703C12.5705 21.2966 14.422 22.2109 16.1093 23.3123C21.2188 26.6405 25.0625 31.5859 27.0312 37.4919L27.875 39.9999Z\" fill=\"#4D98CB\" />\n<path class=\"p-A9DA40\" d=\"M10.2209 28.0372C7.00468 26.4402 3.47075 25.7716 0 25.9742V33.0442L12.8393 39.9998H20.4345C18.7911 34.8161 15.1925 30.5067 10.2209 28.0372Z\" fill=\"#58ADE5\" />\n<path class=\"p-90C225\" d=\"M5.75102 33.7742C3.89678 33.0909 1.89453 32.8663 0 33.0442V39.9998H12.8393C11.3537 37.1736 8.87601 34.9244 5.75102 33.7742Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_prod_garden_result = browser_sprite_build_default.a.add(svg_cat_prod_garden_symbol);
/* harmony default export */ var svg_cat_prod_garden = (svg_cat_prod_garden_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-grocery.svg


var svg_cat_prod_grocery_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-grocery",
  "use": "svg-cat-prod-grocery-usage",
  "viewBox": "0 0 29 40",
  "content": "<symbol viewBox=\"0 0 29 40\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-grocery\">\n<path class=\"p-AB7B26\" d=\"M16.7576 6.64472V4.29907C16.7576 1.93366 14.8374 0.889209 12.4739 0.880615L10.9102 6.64472H16.7576Z\" fill=\"#4D98CB\" />\n<path class=\"p-E1BB78\" d=\"M12.4754 0C12.47 0 12.4649 0.880179 12.4596 0.880179C10.0888 0.880179 8.16016 1.92838 8.16016 4.29903V6.64468H12.4754V0Z\" fill=\"#65B3E7\" />\n<path class=\"p-CDBFBA\" d=\"M23.337 25.0987L21.4245 23.7437L23.2158 21.2155L25.0071 18.6873C25.9929 17.2959 26.1139 15.5608 25.3307 14.0461C24.5476 12.5313 23.0619 11.627 21.3567 11.627H14.8047V9.2832H21.3567C23.9165 9.2832 26.2371 10.6957 27.4127 12.9696C28.5883 15.2436 28.3994 17.9536 26.9195 20.0423L23.337 25.0987Z\" fill=\"#4D98CB\" />\n<path class=\"p-DD7D00\" d=\"M10.9102 23.5195L12.4739 39.9999H18.1155L18.3764 39.8588C22.1479 37.8194 24.5834 34.0143 24.8849 29.7834C22.9997 27.1118 16.1872 23.9278 10.9102 23.5195Z\" fill=\"#58ADE5\" />\n<path class=\"p-EEBF00\" d=\"M12.4589 23.5181C7.17648 23.1151 2.69167 24.3487 0.0315628 28.0025C0.0109376 28.2975 0 28.5943 0 28.8929C0 33.4753 2.50627 37.6772 6.54077 39.8587L6.80163 39.9998H12.4748V23.5194C12.4695 23.519 12.4642 23.5185 12.4589 23.5181Z\" fill=\"#76B7E2\" />\n<path class=\"p-D6C4BE\" d=\"M22.3638 21.3357C20.9291 19.458 18.9619 18.0112 16.7576 17.1975V6.64478H10.9102L12.4739 28.8866C13.6482 27.738 14.6471 25.3468 16.8148 25.3468C20.9457 25.3468 21.1604 29.6149 24.8849 29.7836C24.9059 29.4887 24.9171 29.1918 24.9171 28.8932C24.9172 26.1352 24.0343 23.5219 22.3638 21.3357Z\" fill=\"#A1D1FD\" />\n<path class=\"p-EFE2DD\" d=\"M8.15922 6.64478V17.1975C5.95498 18.0112 3.9877 19.458 2.55307 21.3357C1.06353 23.2852 0.200783 25.5743 0.03125 28.0028C3.75613 28.1714 3.97066 31.5591 8.10157 31.5591C10.2907 31.5591 11.4469 29.9395 12.4745 28.8866V6.64478H8.15922Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BDADA8\" d=\"M19.1055 5.4729H12.4752L11.6934 6.64479L12.4752 6.9361H19.1055V5.4729Z\" fill=\"#76B7E2\" />\n<path class=\"p-DCCBC5\" d=\"M12.4743 5.4729H5.8125V6.9361H12.4743V5.4729Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_prod_grocery_result = browser_sprite_build_default.a.add(svg_cat_prod_grocery_symbol);
/* harmony default export */ var svg_cat_prod_grocery = (svg_cat_prod_grocery_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-home.svg


var svg_cat_prod_home_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-home",
  "use": "svg-cat-prod-home-usage",
  "viewBox": "0 0 37 37",
  "content": "<symbol viewBox=\"0 0 37 37\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-home\">\n<path class=\"p-F4D7AF\" d=\"M32.6641 13.0078V31.5078H4.33594V13.0078L18.5 2.16797L32.6641 13.0078Z\" fill=\"#A1D1FD\" />\n<path class=\"p-D0A973\" d=\"M32.6641 13.0078V31.5078H18.5V2.16797L32.6641 13.0078Z\" fill=\"#58ADE5\" />\n<path class=\"p-3E5959\" d=\"M8.7145 8.89093C8.72466 8.88331 8.73398 8.87569 8.74414 8.86806V3.25195C8.74414 2.65322 8.25889 2.16797 7.66016 2.16797H5.41992C4.82119 2.16797 4.33594 2.65322 4.33594 3.25195V12.2442C5.71407 11.1724 7.28133 10.0079 8.7145 8.89093Z\" fill=\"#A1D1FD\" />\n<path class=\"p-78B9EB\" d=\"M18.5 10.8398C16.7004 10.8398 15.248 12.2922 15.248 14.0918C15.248 15.8911 16.7004 17.3438 18.5 17.3438C20.2996 17.3438 21.752 15.8911 21.752 14.0918C21.752 12.2922 20.2996 10.8398 18.5 10.8398Z\" fill=\"#5FBEFF\" />\n<path class=\"p-5AAAE7\" d=\"M18.5 17.3438V10.8398C20.2996 10.8398 21.752 12.2922 21.752 14.0918C21.752 15.8911 20.2996 17.3438 18.5 17.3438Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFD400\" d=\"M26.2137 31.5078H10.7855L8.85214 35.4389C8.70027 35.7641 8.70027 36.1763 8.89562 36.4797C9.11241 36.8049 9.45935 37 9.82773 37H27.1715C27.5401 37 27.8871 36.8049 28.1039 36.4797C28.2989 36.1763 28.2989 35.7641 28.1473 35.4389L26.2137 31.5078Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9F00\" d=\"M26.2141 31.5078H18.5V37H27.1719C27.5403 37 27.8875 36.8049 28.104 36.4797C28.2993 36.1763 28.2993 35.7641 28.1475 35.4389L26.2141 31.5078Z\" fill=\"#58ADE5\" />\n<path class=\"p-90E36A\" d=\"M37 31.5078C37 32.1147 36.5232 32.5918 35.916 32.5918H1.08398C0.476784 32.5918 0 32.1147 0 31.5078C0 30.9006 0.476784 30.4238 1.08398 30.4238H35.916C36.5232 30.4238 37 30.9006 37 31.5078Z\" fill=\"#B9DFFC\" />\n<path class=\"p-56C225\" d=\"M37 31.5078C37 32.1147 36.5232 32.5918 35.916 32.5918H18.5V30.4238H35.916C36.5232 30.4238 37 30.9006 37 31.5078Z\" fill=\"#65B3E7\" />\n<path class=\"p-3E5959\" d=\"M26.0879 20.5957V32.5918H10.9121V20.5957C10.9121 19.9885 11.3889 19.5117 11.9961 19.5117H25.0039C25.6111 19.5117 26.0879 19.9885 26.0879 20.5957Z\" fill=\"#5FBEFF\" />\n<path class=\"p-384949\" d=\"M26.0879 20.5957V32.5918H18.5V19.5117H25.0039C25.6111 19.5117 26.0879 19.9885 26.0879 20.5957Z\" fill=\"#4D98CB\" />\n<path class=\"p-96C8EF\" d=\"M13.0801 21.6797H17.416V30.4238H13.0801V21.6797Z\" fill=\"#B9DFFC\" />\n<path class=\"p-78B9EB\" d=\"M19.584 21.6797H23.9199V30.4238H19.584V21.6797Z\" fill=\"#A1D1FD\" />\n<path class=\"p-CB671B\" d=\"M36.9784 14.3735C37.0218 14.6555 36.9566 14.9372 36.7833 15.1758L35.4825 16.9102C35.1356 17.3869 34.4637 17.4956 33.9867 17.127L18.5001 5.15965L3.03526 17.127C2.84019 17.2785 2.60166 17.3438 2.38486 17.3438C2.05967 17.3438 1.73447 17.1919 1.51768 16.9102L0.216896 15.1758C0.0435714 14.9372 -0.021637 14.6555 0.0218353 14.3735C0.0435714 14.0701 0.216896 13.8315 0.455429 13.6582L17.8497 0.216797C18.0448 0.0866623 18.2833 0 18.5001 0C18.7169 0 18.9554 0.0866623 19.1505 0.216797L36.5448 13.6582C36.7833 13.8101 36.9566 14.0701 36.9784 14.3735Z\" fill=\"#5FBEFF\" />\n<path class=\"p-BC5F19\" d=\"M36.9783 14.3735C37.0217 14.6555 36.9565 14.9372 36.7832 15.1758L35.4824 16.9102C35.1355 17.3869 34.4636 17.4956 33.9866 17.127L18.5 5.15965V0C18.7168 0 18.9553 0.0866623 19.1504 0.216797L36.5447 13.6582C36.7832 13.8101 36.9565 14.0701 36.9783 14.3735Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_prod_home_result = browser_sprite_build_default.a.add(svg_cat_prod_home_symbol);
/* harmony default export */ var svg_cat_prod_home = (svg_cat_prod_home_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-nutritional.svg


var svg_cat_prod_nutritional_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-nutritional",
  "use": "svg-cat-prod-nutritional-usage",
  "viewBox": "0 0 34 34",
  "content": "<symbol viewBox=\"0 0 34 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-nutritional\">\n<path class=\"p-FDBF00\" d=\"M2.26698 21.18C4.66776 18.252 6.65723 17 17 17C27.3627 17 29.3269 18.2514 31.7116 21.162C33.1021 20.2768 34 18.7275 34 17C34 13.0554 22.8569 12.0195 17 12.0195C11.1431 12.0195 0 13.0554 0 17C0 18.7298 0.893961 20.2728 2.26698 21.18Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M31.7116 21.162C33.1021 20.2768 34 18.7275 34 17C34 13.0554 22.8569 12.0195 17 12.0195V17C27.3627 17 29.3269 18.2514 31.7116 21.162Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF8597\" d=\"M28.6546 22.9766L28.5352 24.0922C28.2363 26.5226 27.4195 28.9398 26.563 31.43C26.3436 32.0476 26.1247 32.6851 25.9054 33.3226L25.6863 34H17.9965V24.9688H16.0043V34H8.31445L8.09531 33.3226C7.87597 32.6651 7.63718 32.0277 7.43776 31.3902C6.56133 28.9 5.74446 26.4828 5.46549 24.0922L5.32617 22.9766H28.6546Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFCEBF\" d=\"M28.6145 20.805L16.9999 22.877L16.1634 23.0163L5.40527 20.785L5.58477 19.8288C5.90332 18.1753 6.52103 16.6015 7.4972 14.9679C9.33008 11.9199 9.05111 10.0273 8.71264 8.03516L11.4816 6.04297H24.8092L25.2676 8.03516C24.9687 10.0273 24.6302 11.8402 26.5027 14.9679C27.4589 16.5617 28.0966 18.1553 28.4152 19.8288L28.6145 20.805Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF637B\" d=\"M28.6542 22.9766L28.5348 24.0922C28.2359 26.5226 27.4191 28.9398 26.5626 31.43C26.3432 32.0476 26.1244 32.6851 25.905 33.3226L25.6859 34H17.9961V24.9688H17V22.9766H28.6542Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFB99C\" d=\"M28.6146 20.805L17 22.877V6.04297H24.8092L25.2676 8.03516C24.9688 10.0273 24.6303 11.8402 26.5028 14.9679C27.459 16.5617 28.0966 18.1553 28.4152 19.8288L28.6146 20.805Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFDA2D\" d=\"M34 17V22.9766C34 26.921 22.8569 27.957 17 27.957C11.1431 27.957 0 26.921 0 22.9766V17C0 20.9445 11.1431 21.9805 17 21.9805C22.8569 21.9805 34 20.9445 34 17Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF9468\" d=\"M17.9961 16.0039H17V17.9961H17.9961V16.0039Z\" fill=\"#4D98CB\" />\n<path class=\"p-FDBF00\" d=\"M34 17V22.9766C34 26.921 22.8569 27.957 17 27.957V21.9805C22.8569 21.9805 34 20.9445 34 17Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF637B\" d=\"M25.2676 8.03516H17V0H28.1961C26.2238 5.21953 26.0645 5.34564 25.2676 8.03516Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF8597\" d=\"M5.7832 0C7.69584 5.00039 7.9347 5.28594 8.71192 8.03516H25.2669C26.0637 5.34564 26.223 5.21953 28.1953 0H5.7832Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFB99C\" d=\"M17.9961 16.0039H16.0039V17.9961H17.9961V16.0039Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_prod_nutritional_result = browser_sprite_build_default.a.add(svg_cat_prod_nutritional_symbol);
/* harmony default export */ var svg_cat_prod_nutritional = (svg_cat_prod_nutritional_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-nuts.svg


var svg_cat_prod_nuts_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-nuts",
  "use": "svg-cat-prod-nuts-usage",
  "viewBox": "0 0 34 34",
  "content": "<symbol viewBox=\"0 0 34 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-nuts\">\n<path class=\"p-FFF5F5\" d=\"M31.151 19.8729C27.6652 16.3869 22.2869 16.0683 19.1796 19.1757C16.0722 22.283 16.3908 27.6613 19.8768 31.1471C23.2233 34.4936 28.6014 35.111 31.848 31.8441C33.3022 30.3902 33.9995 28.4779 33.9995 26.5259C33.9995 24.1753 32.9834 21.7253 31.151 19.8729Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EFE2DD\" d=\"M33.9996 26.526C33.9996 28.4779 33.3023 30.3902 31.8481 31.8441L19.1797 19.1757C22.287 16.0684 27.6651 16.3869 31.1511 19.8727C32.9835 21.7253 33.9996 24.1753 33.9996 26.526Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFB64C\" d=\"M22.5797 15.3117C22.175 15.3117 21.7686 15.2905 21.3611 15.2477C20.9546 15.2059 20.5556 15.1136 20.1735 14.9753C18.8887 14.5073 17.8431 13.5183 17.3012 12.2597C16.7508 10.9788 16.7635 9.54429 17.3373 8.21954C18.1572 6.33372 20.187 5.20923 22.4747 5.34827C23.0796 5.38328 23.4321 6.43239 24.552 5.34827C25.0636 4.59456 25.013 4.35918 25.0636 4.0051C25.3992 1.68453 26.3923 0 28.6916 0H28.79C30.3489 0 31.8156 0.688701 32.8127 1.88971C33.7764 3.05026 34.1722 4.55269 33.8998 6.01466C33.4845 8.23718 32.4371 10.2104 30.7858 11.8786C28.5944 14.0952 25.6562 15.3117 22.5797 15.3117Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M22.1816 9.95947H24.1735V11.9514H22.1816V9.95947Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M24.1738 7.96777H26.1657V9.95968H24.1738V7.96777Z\" fill=\"#58ADE5\" />\n<path class=\"p-61D7A8\" d=\"M14.9241 19.0759L13.7288 24.992L8.39062 25.6094L9.00799 20.2712L14.9241 19.0759Z\" fill=\"#5FBEFF\" />\n<path class=\"p-00AB94\" d=\"M14.9241 19.0759L13.7288 24.992L8.39062 25.6094L14.9241 19.0759Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFB64C\" d=\"M13.6022 13.1403L13.4427 13.4391L13.1439 13.5984C11.7896 14.2756 10.2954 14.6142 8.82155 14.6142C6.8496 14.6142 4.91735 14.0365 3.28418 12.8811L3.40376 5.71033L5.71422 3.39961L12.905 3.28003C14.8969 6.14845 15.1758 9.95304 13.6022 13.1403Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M13.603 13.1403L13.4434 13.4391L4.55957 4.55497L5.71493 3.39961L12.9057 3.28003C14.8976 6.14845 15.1765 9.95304 13.603 13.1403Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF9100\" d=\"M0.0380859 1.42747L1.43235 0.0332031L3.54385 2.1447L2.14958 3.53897L0.0380859 1.42747Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFF5F5\" d=\"M8.46752 25.5323L11.0595 17.9004L9.74492 17.9403C7.35483 18.02 3.53026 20.6295 1.67764 22.4619C-1.92773 26.0673 1.37882 31.8638 1.51837 32.1229L1.65767 32.3419L1.87686 32.4814C2.03639 32.5611 4.54607 33.9953 7.27493 33.9953C8.74909 33.9953 10.2826 33.5769 11.5376 32.3219C13.3703 30.4695 15.9798 26.645 16.0594 24.2546L16.0994 22.94L8.46752 25.5323Z\" fill=\"#B9DFFC\" />\n<path class=\"p-EFE2DD\" d=\"M16.0987 22.9402L16.059 24.2548C15.9794 26.6452 13.3698 30.4697 11.5372 32.3221C10.2822 33.5771 8.74865 33.9955 7.27449 33.9955C4.54562 33.9955 2.03569 32.5613 1.87642 32.4816L1.65723 32.3421L8.46707 25.5325L16.0987 22.9402Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF641A\" d=\"M2.84659 2.8417L0.735352 0.730465L1.43235 0.0332031L3.54385 2.14444L2.84659 2.8417Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M11.5111 1.68615C8.76227 -0.584616 4.69881 -0.425087 2.14919 2.14425C-0.400696 4.67416 -0.559966 8.73762 1.69083 11.4865C2.12921 12.0442 2.76655 12.5819 3.28457 12.8807L5.39607 7.70185L8.62544 8.62076L7.70653 5.39113L12.9054 3.27963C12.3477 2.40339 11.8896 2.00495 11.5111 1.68615Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF641A\" d=\"M12.9056 3.27959L7.70675 5.39109L8.62567 8.62072L2.14941 2.14421C4.69904 -0.425126 8.7625 -0.584656 11.5113 1.68637C11.8898 2.00491 12.3479 2.40335 12.9056 3.27959Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M27.6252 23.3985C25.7726 21.5459 22.7649 21.6854 22.6453 21.7051L21.7491 21.7451L21.7094 22.6416C21.6894 22.7609 21.5499 26.6878 23.4022 28.5401C24.976 30.1137 27.3861 29.3343 28.143 29.3343C28.2826 29.3343 28.3622 29.3343 28.3822 29.3143L29.2784 29.2746L29.3183 28.3782C29.3183 28.3584 29.3383 28.2588 29.3383 28.0993C29.3383 27.2827 29.1591 24.932 27.6252 23.3985Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF641A\" d=\"M29.3392 28.0993C29.3392 28.2586 29.3195 28.3582 29.3195 28.3782L29.2795 29.2744L21.75 21.7451L22.6462 21.7051C22.7658 21.6854 26.6924 21.5459 28.545 23.3982C30.0789 24.9321 29.3392 27.2827 29.3392 28.0993Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_prod_nuts_result = browser_sprite_build_default.a.add(svg_cat_prod_nuts_symbol);
/* harmony default export */ var svg_cat_prod_nuts = (svg_cat_prod_nuts_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-snacks.svg


var svg_cat_prod_snacks_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-snacks",
  "use": "svg-cat-prod-snacks-usage",
  "viewBox": "0 0 31 36",
  "content": "<symbol viewBox=\"0 0 31 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-snacks\">\n<path class=\"p-FF9100\" d=\"M28.1826 5.06506L19.2875 2.7959H8.21404L2.72268 5.06506C1.6561 7.08461 0.703125 8.99063 0.703125 13.5517V21.5392C0.703125 26.3271 1.61086 27.7567 2.72268 30.0258L8.75857 32.295H21.3524L28.1826 30.0258C29.2945 27.7567 30.2021 26.3271 30.2021 21.5392V13.5517C30.2022 10.6698 29.7711 7.60652 28.1826 5.06506Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF641A\" d=\"M30.2027 13.5517V21.5392C30.2027 26.3271 29.2949 27.7567 28.1831 30.0258L21.3529 32.295H15.4531V2.7959H19.288L28.1831 5.06506C29.7715 7.60652 30.2027 10.6698 30.2027 13.5517Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFB64C\" d=\"M0 0L2.72299 5.06512H28.183L30.906 0H0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFB64C\" d=\"M28.183 30.0259H2.72299L0 36H30.906L28.183 30.0259Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFB64C\" d=\"M21.1263 15.2763C21.1263 16.3882 20.6952 17.4773 19.8556 18.3851L16.2475 20.5181C15.9979 20.5861 15.7257 20.6542 15.4534 20.6997C14.7273 20.8812 13.9784 20.9493 13.1842 20.9493C8.73662 20.9493 5.24219 18.4532 5.24219 15.2764C5.24219 12.0995 8.73662 9.60352 13.1842 9.60352C13.9784 9.60352 14.75 9.69421 15.4534 9.83036C18.7665 10.511 21.1263 12.6667 21.1263 15.2763Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFD396\" d=\"M19.9913 16.4109C18.1305 16.4109 16.4741 17.137 15.4529 18.2489C14.7268 18.9978 14.3184 19.9508 14.3184 20.9492C14.3184 21.9703 14.7495 22.9007 15.4529 23.6722C16.4968 24.7613 18.1305 25.4875 19.9913 25.4875C23.1227 25.4875 25.6642 23.4452 25.6642 20.9492C25.6642 18.4531 23.1227 16.4109 19.9913 16.4109Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF9100\" d=\"M16.2473 20.5181C15.9976 20.5861 15.7254 20.6543 15.4531 20.6997V9.83032C18.7662 10.5111 21.126 12.6668 21.126 15.2764C21.126 16.3883 20.6949 17.4774 19.8553 18.3851L16.2473 20.5181Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF9100\" d=\"M28.1831 30.0259L30.9061 36H15.4531V30.0259H28.1831Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF9100\" d=\"M28.1831 5.06512H15.4531V0H30.9061L28.1831 5.06512Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFB64C\" d=\"M25.6643 20.9492C25.6643 23.4452 23.1229 25.4875 19.9914 25.4875C18.1307 25.4875 16.497 24.7614 15.4531 23.6722V18.2489C16.4742 17.137 18.1307 16.4109 19.9914 16.4109C23.1229 16.4109 25.6643 18.4531 25.6643 20.9492Z\" fill=\"#5FBEFF\" />\n</symbol>"
});
var svg_cat_prod_snacks_result = browser_sprite_build_default.a.add(svg_cat_prod_snacks_symbol);
/* harmony default export */ var svg_cat_prod_snacks = (svg_cat_prod_snacks_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-spice.svg


var svg_cat_prod_spice_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-spice",
  "use": "svg-cat-prod-spice-usage",
  "viewBox": "0 0 21 36",
  "content": "<symbol viewBox=\"0 0 21 36\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-spice\">\n<path class=\"p-03232E\" d=\"M18.0605 8.96987L8.74414 7.5625V14.8621L18.0605 13.4548V8.96987Z\" fill=\"#4D98CB\" />\n<path class=\"p-07485E\" d=\"M2.24219 8.96987V13.4548L10.1511 14.8621V7.5625L2.24219 8.96987Z\" fill=\"#5FBEFF\" />\n<path class=\"p-AB7B26\" d=\"M20.3029 35.9999V13.4546H10.1515L8.74414 35.2962L11.2062 35.9999H14.1725L15.2272 35.2962L16.2819 35.9999H20.3029Z\" fill=\"#58ADE5\" />\n<path class=\"p-E1BB78\" d=\"M0 35.9999H4.02096L5.07564 35.2962L6.13033 35.9999H9.09667L10.1514 35.2962V13.4546H0V35.9999Z\" fill=\"#65B3E7\" />\n<path class=\"p-B4D2D7\" d=\"M20.3029 4.47539C20.3029 2.00369 18.2992 0 15.8275 0H10.1515L8.74414 4.48488L10.1515 8.96983H20.3029V4.47539Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E1EBF0\" d=\"M4.47539 0C2.00369 0 0 2.00369 0 4.47539V8.96976H10.1514V0H4.47539Z\" fill=\"#B9DFFC\" />\n<path class=\"p-AB7B26\" d=\"M6.13086 30.3938H4.02148V36H6.13086V30.3938Z\" fill=\"#B9DFFC\" />\n<path class=\"p-71390F\" d=\"M11.2061 30.3938H9.09668V36H11.2061V30.3938Z\" fill=\"#B9DFFC\" />\n<path class=\"p-71390F\" d=\"M16.2822 30.3938H14.1729V36H16.2822V30.3938Z\" fill=\"#A1D1FD\" />\n<path class=\"p-607882\" d=\"M15.7571 3.43018H13.5146V5.53955H15.7571V3.43018Z\" fill=\"#4D98CB\" />\n<path class=\"p-87A0AF\" d=\"M11.2727 3.43018H9.03027V5.53955H11.2727V3.43018Z\" fill=\"#58ADE5\" />\n<path class=\"p-87A0AF\" d=\"M6.7874 3.43018H4.54492V5.53955H6.7874V3.43018Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_prod_spice_result = browser_sprite_build_default.a.add(svg_cat_prod_spice_symbol);
/* harmony default export */ var svg_cat_prod_spice = (svg_cat_prod_spice_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-prod-sweetness.svg


var svg_cat_prod_sweetness_symbol = new browser_symbol_default.a({
  "id": "svg-cat-prod-sweetness",
  "use": "svg-cat-prod-sweetness-usage",
  "viewBox": "0 0 32 33",
  "content": "<symbol viewBox=\"0 0 32 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-prod-sweetness\">\n<path class=\"p-895D3C\" d=\"M4.05859 28.5488V33H27.1V28.5488H4.05859Z\" fill=\"#B9DFFC\" />\n<path class=\"p-714C2F\" d=\"M27.1008 28.5488H15.5801V33H27.1008V28.5488Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDBF00\" d=\"M27.0789 29.9939H4.07944C-1.34583 23.9193 -1.36677 14.8493 4.05849 8.75391H27.0999C32.5251 14.8493 32.5042 23.9193 27.0789 29.9939Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M27.0798 29.9939H15.5801V8.75391H27.1008C32.526 14.8493 32.5051 23.9193 27.0798 29.9939Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M22.9523 17.0277H19.8103L17.7156 13.8857H13.4424L11.3478 17.0277H8.20576L5.41992 21.2171L8.20576 25.4064H12.479L14.5736 22.2644H16.5844L18.6791 25.4064H22.9523L25.7382 21.2171L22.9523 17.0277Z\" fill=\"#76B7E2\" />\n<path class=\"p-FF641A\" d=\"M25.7392 21.2171L22.9534 25.4064H18.6801L16.5854 22.2644H15.5801V13.8857H17.7167L19.8114 17.0277H22.9534L25.7392 21.2171Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF9100\" d=\"M23.2251 21.2172L21.8215 23.3119H19.8108L18.4072 21.2172L19.8108 19.1226H21.8215L23.2251 21.2172Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDBF00\" d=\"M17.9878 18.0754L16.5842 20.1701H14.5735L13.1699 18.0754L14.5735 15.9807H16.5842L17.9878 18.0754Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF9100\" d=\"M17.989 18.0754L16.5854 20.1701H15.5801V15.9807H16.5854L17.989 18.0754Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FDBF00\" d=\"M12.7515 21.2172L11.3479 23.3119H9.33716L7.93359 21.2172L9.33716 19.1226H11.3479L12.7515 21.2172Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FAECD8\" d=\"M29.4882 9.00526L28.7341 9.52893C27.603 10.283 26.3043 10.6601 25.0056 10.6601C23.9163 10.6601 22.848 10.3877 21.8636 9.86408C19.8946 10.9114 17.5486 10.9114 15.5796 9.86408C13.6106 10.9114 11.2646 10.9114 9.29557 9.86408C7.13799 11.0162 4.49884 10.9114 2.42498 9.529L1.6709 9.00533L4.05889 4.4599L5.35759 3.41256L4.05889 2.36523V0H27.1003V2.36523L25.613 3.41256L27.1003 4.4599L29.4882 9.00526Z\" fill=\"#B9DFFC\" />\n<path class=\"p-F4D7AF\" d=\"M29.4887 9.00526L28.7346 9.52893C27.6035 10.283 26.3048 10.6601 25.0061 10.6601C23.9168 10.6601 22.8485 10.3877 21.8641 9.86408C19.8951 10.9114 17.5491 10.9114 15.5801 9.86408V0H27.1008V2.36523L25.6135 3.41256L27.1008 4.4599L29.4887 9.00526Z\" fill=\"#A1D1FD\" />\n<path class=\"p-895D3C\" d=\"M27.1 2.36548H4.05859V4.46015H27.1V2.36548Z\" fill=\"#76B7E2\" />\n<path class=\"p-714C2F\" d=\"M27.1008 2.36548H15.5801V4.46015H27.1008V2.36548Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_prod_sweetness_result = browser_sprite_build_default.a.add(svg_cat_prod_sweetness_symbol);
/* harmony default export */ var svg_cat_prod_sweetness = (svg_cat_prod_sweetness_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-semimanufactured-goods.svg


var svg_cat_semimanufactured_goods_symbol = new browser_symbol_default.a({
  "id": "svg-cat-semimanufactured-goods",
  "use": "svg-cat-semimanufactured-goods-usage",
  "viewBox": "0 0 31 23",
  "content": "<symbol viewBox=\"0 0 31 23\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-semimanufactured-goods\">\n<path class=\"p-FF637B\" d=\"M29.8703 14.5556C28.8584 12.6015 26.5206 11.7117 24.4095 12.4968C24.078 12.619 23.636 12.7411 23.3219 12.8283L22.4496 14.2415L21.5772 13.3866C20.984 13.5436 20.4084 13.6832 19.8326 13.8053L18.9602 15.2883L18.0879 14.1019C17.4946 14.1717 16.919 14.224 16.3432 14.2415L15.4708 15.585L14.5985 14.2415C14.0227 14.2241 13.4471 14.1718 12.8538 14.1019L11.9815 15.2883L11.1091 13.8053C10.5333 13.6832 9.95769 13.5436 9.36444 13.3866L8.4921 14.2415L7.61975 12.8283C7.30571 12.7411 6.88117 12.619 6.54968 12.4968C4.43855 11.7117 2.10073 12.6015 1.08881 14.5556C0.513003 15.6722 0.443273 16.9982 0.896892 18.1671C1.35051 19.3012 2.24024 20.191 3.35684 20.6097C7.59643 22.1973 11.7197 22.9999 15.4708 22.9999C19.2219 22.9999 23.3626 22.1973 27.6022 20.6097C28.7188 20.191 29.6085 19.3012 30.0621 18.1671C30.5159 16.9981 30.4461 15.6722 29.8703 14.5556Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M29.8701 14.5556C30.4459 15.6722 30.5157 16.9982 30.062 18.1671C29.6084 19.3012 28.7187 20.191 27.6021 20.6097C23.3625 22.1973 19.2218 22.9999 15.4707 22.9999V15.585L16.343 14.2415C16.9189 14.2241 17.4945 14.1718 18.0877 14.1019L18.9601 15.2883L19.8324 13.8053C20.4082 13.6832 20.9839 13.5436 21.5771 13.3866L22.4494 14.2415L23.3218 12.8283C23.6358 12.7411 24.0778 12.619 24.4093 12.4968C26.5203 11.7117 28.8581 12.6015 29.8701 14.5556Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF637B\" d=\"M29.8702 2.34316C28.8583 0.38911 26.5205 -0.500681 24.4094 0.284429C24.0779 0.406557 23.6359 0.528685 23.3219 0.615919L22.4495 2.41301L21.5772 1.17422C20.9839 1.33118 20.4083 1.47076 19.8325 1.59294L18.9601 3.07587L18.0878 1.88948C17.4945 1.95933 16.9189 2.01161 16.3431 2.02912L15.4708 3.47726L14.5984 2.02912C14.0226 2.01167 13.447 1.95939 12.8537 1.88948L11.9814 3.07587L11.109 1.59294C10.5332 1.47082 9.95761 1.33118 9.36435 1.17422L8.49201 2.41301L7.61967 0.615919C7.30562 0.528685 6.86945 0.406557 6.53796 0.284429C4.42683 -0.500681 2.08901 0.38911 1.07709 2.34316C0.501284 3.45976 0.431555 4.78578 0.885173 5.95466C1.33879 7.08877 2.22852 7.97856 3.34512 8.39728C7.58471 9.98489 11.7196 10.7875 15.4707 10.7875C19.2218 10.7875 23.3626 9.98489 27.6021 8.39728C28.7187 7.97856 29.6084 7.08877 30.062 5.95466C30.5158 4.78572 30.446 3.45976 29.8702 2.34316Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E63950\" d=\"M27.6021 8.39728C23.3625 9.98489 19.2218 10.7875 15.4707 10.7875V3.47726L16.343 2.02912C16.9188 2.01167 17.4945 1.95939 18.0877 1.88948L18.9601 3.07587L19.8324 1.59294C20.4082 1.47082 20.9838 1.33118 21.5771 1.17422L22.4494 2.41301L23.3218 0.615919C23.6358 0.528685 24.0778 0.406557 24.4093 0.284429C26.5204 -0.500681 28.8583 0.38911 29.8702 2.34316C30.446 3.45976 30.5157 4.78578 30.0621 5.95466C29.6084 7.08877 28.7187 7.97856 27.6021 8.39728Z\" fill=\"#65B3E7\" />\n<path class=\"p-E63950\" d=\"M16.3433 2.0293V5.55363C16.3433 6.03541 15.9528 6.42597 15.471 6.42597C14.9892 6.42597 14.5986 6.03541 14.5986 5.55363V2.0293C14.8952 2.06425 15.1744 2.06425 15.471 2.06425C15.7675 2.06425 16.0467 2.06425 16.3433 2.0293Z\" fill=\"#A1D1FD\" />\n<path class=\"p-AE2538\" d=\"M16.343 2.0293V5.55362C16.343 6.0354 15.9525 6.42597 15.4707 6.42597V2.06425C15.7672 2.06425 16.0465 2.06425 16.343 2.0293Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M16.3433 14.2419V17.7663C16.3433 18.2481 15.9528 18.6386 15.471 18.6386C14.9892 18.6386 14.5986 18.2481 14.5986 17.7663V14.2419C14.8952 14.2769 15.1744 14.2769 15.471 14.2769C15.7675 14.2769 16.0467 14.2769 16.3433 14.2419Z\" fill=\"#A1D1FD\" />\n<path class=\"p-AE2538\" d=\"M19.8326 1.59253V5.32616C19.8326 5.80794 19.442 6.19851 18.9602 6.19851C18.4785 6.19851 18.0879 5.80794 18.0879 5.32616V1.88907C18.6462 1.81934 19.2393 1.71466 19.8326 1.59253Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M12.8531 1.88907V5.32616C12.8531 5.80795 12.4625 6.19851 11.9807 6.19851C11.499 6.19851 11.1084 5.80795 11.1084 5.32616V1.59253C11.7016 1.71466 12.2948 1.81934 12.8531 1.88907Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E63950\" d=\"M9.36481 1.17427V4.68109C9.36481 5.16287 8.97424 5.55344 8.49246 5.55344C8.01068 5.55344 7.62012 5.16287 7.62012 4.68109V0.615967C8.21337 0.825329 8.789 1.01719 9.36481 1.17427Z\" fill=\"#A1D1FD\" />\n<path class=\"p-AE2538\" d=\"M19.8326 13.8054V17.539C19.8326 18.0208 19.442 18.4114 18.9602 18.4114C18.4785 18.4114 18.0879 18.0208 18.0879 17.539V14.102C18.6462 14.0322 19.2393 13.9275 19.8326 13.8054Z\" fill=\"#4D98CB\" />\n<path class=\"p-E63950\" d=\"M12.8531 14.102V17.539C12.8531 18.0208 12.4625 18.4114 11.9807 18.4114C11.499 18.4114 11.1084 18.0208 11.1084 17.539V13.8054C11.7016 13.9275 12.2948 14.0322 12.8531 14.102Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E63950\" d=\"M9.36481 13.3872V16.894C9.36481 17.3758 8.97424 17.7663 8.49246 17.7663C8.01068 17.7663 7.62012 17.3758 7.62012 16.894V12.8289C8.21337 13.0382 8.789 13.2301 9.36481 13.3872Z\" fill=\"#A1D1FD\" />\n<path class=\"p-AE2538\" d=\"M23.3218 12.8289V16.894C23.3218 17.3758 22.9313 17.7664 22.4495 17.7664C21.9677 17.7664 21.5771 17.3758 21.5771 16.894V13.3872C22.1529 13.2301 22.7286 13.0382 23.3218 12.8289Z\" fill=\"#4D98CB\" />\n<path class=\"p-AE2538\" d=\"M23.3218 0.615967V4.68114C23.3218 5.16292 22.9313 5.55349 22.4495 5.55349C21.9677 5.55349 21.5771 5.16292 21.5771 4.68114V1.17432C22.1529 1.01719 22.7286 0.825329 23.3218 0.615967Z\" fill=\"#4D98CB\" />\n<path class=\"p-AE2538\" d=\"M15.4707 14.2769C15.7672 14.2769 16.0465 14.2769 16.343 14.2419V17.7663C16.343 18.2481 15.9525 18.6386 15.4707 18.6386V14.2769Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_semimanufactured_goods_result = browser_sprite_build_default.a.add(svg_cat_semimanufactured_goods_symbol);
/* harmony default export */ var svg_cat_semimanufactured_goods = (svg_cat_semimanufactured_goods_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-shoes-men.svg


var svg_cat_shoes_men_symbol = new browser_symbol_default.a({
  "id": "svg-cat-shoes-men",
  "use": "svg-cat-shoes-men-usage",
  "viewBox": "0 0 33 17",
  "content": "<symbol viewBox=\"0 0 33 17\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-shoes-men\">\n<path class=\"p-3E322E\" d=\"M30.3482 16.9999H20.8408V11.3333H30.3482V16.9999Z\" fill=\"#4D98CB\" />\n<path class=\"p-68544F\" d=\"M31.8025 9.4443L30.348 13.2221C27.3258 13.2221 28.1947 13.2221 25.248 13.2221C23.2269 13.2221 21.1806 13.8265 19.4807 14.9598C19.3106 15.0731 19.1406 15.1864 18.9517 15.2808C17.0629 16.4143 14.9095 16.9998 12.7184 16.9998H0V14.7898C0 14.2609 0.0567293 13.732 0.170062 13.2221C0.188825 13.2032 1.68116 12.0887 2.68221 11.3332H12.7184C14.0029 11.3332 15.2495 10.9554 16.3261 10.2376C17.1572 9.6709 18.0451 9.19868 18.9517 8.82091C20.9161 7.9898 23.0759 7.55542 25.248 7.55542H30.1402L31.7835 9.40646C31.7835 9.42535 31.7835 9.42535 31.7646 9.4443H31.8025Z\" fill=\"#76B7E2\" />\n<path class=\"p-53433F\" d=\"M31.8029 9.4443L30.3484 13.2221C27.3262 13.2221 28.1951 13.2221 25.2484 13.2221C23.2273 13.2221 21.181 13.8265 19.4811 14.9598C19.311 15.0731 19.141 15.1864 18.9521 15.2808V8.82091C20.9165 7.9898 23.0763 7.55542 25.2484 7.55542H30.1406L31.7839 9.40646C31.7839 9.42535 31.7839 9.42535 31.765 9.4443H31.8029Z\" fill=\"#58ADE5\" />\n<path class=\"p-966641\" d=\"M32.2367 6.61107C32.2367 7.32885 32.1612 8.02773 31.9912 8.72662L31.8023 9.44439H25.2479C23.0568 9.44439 20.8783 9.9355 18.9516 10.8988C18.4039 11.1632 17.8938 11.4655 17.3838 11.8055C15.9861 12.731 14.3806 13.2221 12.7183 13.2221H0.169922C0.264366 12.8065 0.377698 12.4288 0.547635 12.051C0.547635 11.9943 0.585475 11.9377 0.604364 11.881C0.698808 11.6922 0.793189 11.5221 0.887633 11.3333C1.20881 10.7477 0.871232 10.8908 1.7425 10.4552C4.0568 9.29805 5.28872 9.29805 7.23433 9.29805C8.91537 9.29805 10.5839 6.76212 11.585 5.42108L11.6417 5.34546L12.8883 5.19441L12.775 3.83436L13.0961 3.39998C13.4361 2.9656 13.795 2.54999 14.1916 2.22888L15.9483 2.15338L15.7216 1.11444C16.7039 0.528886 17.7995 0.169999 18.9517 0.0566664C19.2727 0.0189518 19.5751 6.2928e-05 19.8961 6.2928e-05H20.8405V0.944502C20.8405 2.51221 22.169 3.77782 23.7368 3.77782H26.5182C26.7072 2.8711 27.0128 2.15689 27.4449 1.3069C28.3137 0.419127 28.119 0 29.4034 0H29.989L31.2923 2.62554C31.9157 3.81547 32.2367 5.19441 32.2367 6.61107Z\" fill=\"#B9DFFC\" />\n<path class=\"p-7E5436\" d=\"M32.2373 6.61107C32.2373 7.32885 32.1618 8.02773 31.9917 8.72662L31.8029 9.44439H25.2484C23.0574 9.44439 20.8789 9.9355 18.9521 10.8988V0.0566035C19.2732 0.0188889 19.5755 0 19.8966 0H20.841V0.944439C20.841 2.51215 22.1695 3.77776 23.7373 3.77776H26.5187C26.574 2.6138 26.574 2.6138 26.9508 1.37882C27.2893 0.269208 28.1195 0 29.4039 0H29.9895L31.2928 2.62554C31.9162 3.81547 32.2373 5.19442 32.2373 6.61107Z\" fill=\"#A1D1FD\" />\n<path class=\"p-53433F\" d=\"M18.669 4.06115L17.3469 5.38337L14.1924 2.229C14.6646 1.77567 15.1747 1.3979 15.7224 1.1145L18.669 4.06115Z\" fill=\"#76B7E2\" />\n<path class=\"p-53433F\" d=\"M15.8358 6.89421L14.5137 8.21643L11.6426 5.34533L12.7758 3.83423L15.8358 6.89421Z\" fill=\"#76B7E2\" />\n</symbol>"
});
var svg_cat_shoes_men_result = browser_sprite_build_default.a.add(svg_cat_shoes_men_symbol);
/* harmony default export */ var svg_cat_shoes_men = (svg_cat_shoes_men_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport.svg


var svg_cat_sport_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport",
  "use": "svg-cat-sport-usage",
  "viewBox": "0 0 40 41",
  "content": "<symbol viewBox=\"0 0 40 41\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport\">\n<path class=\"p-FF620B\" d=\"M0 0V18.923H28.3063V0H0Z\" fill=\"#5FBEFF\" />\n<path class=\"p-DD3400\" d=\"M14.1533 0H28.3066V18.923H14.1533V0Z\" fill=\"#4D98CB\" />\n<path class=\"p-DEECF1\" d=\"M2.3457 2.3457V16.5769H25.9602V2.3457H2.3457Z\" fill=\"#B9DFFC\" />\n<path class=\"p-C6E2E7\" d=\"M14.1533 2.3457H25.9606V16.5769H14.1533V2.3457Z\" fill=\"#A1D1FD\" />\n<path class=\"p-B4EAF5\" d=\"M12.8076 22.4414H15.4994V38.8622H12.8076V22.4414Z\" fill=\"#5FBEFF\" />\n<path class=\"p-00ADEA\" d=\"M14.1533 22.4414H15.4994V38.8622H14.1533V22.4414Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF620B\" d=\"M32.8036 40.0047C34.1875 39.8406 35.5247 39.3245 36.721 38.4331C37.0261 38.1986 34.9851 35.6416 35.2667 35.3365C35.5715 35.0549 38.1285 37.0959 38.3629 36.7911C39.2544 35.6181 39.7708 34.2812 39.9346 32.8969C39.9817 32.4747 37.6592 32.0525 37.6592 31.6303C37.6592 31.2314 39.9582 30.8327 39.8878 30.4341C39.6063 28.8389 38.8558 27.314 37.6124 26.0942C36.3926 24.8509 34.8442 24.1003 33.249 23.8188C32.8971 23.7485 32.522 26.071 32.1466 26.0474C31.7241 26.0474 31.2787 23.7249 30.8565 23.7717C29.449 23.9359 28.1118 24.4522 26.9155 25.3437C26.6104 25.5782 28.6514 28.1351 28.3698 28.4399C28.0882 28.7215 25.508 26.6806 25.2732 27.0089C24.4289 28.1584 23.9364 29.5191 23.7722 30.9266C23.7251 31.3488 26.0473 31.771 26.0473 32.1932C26.0708 32.5686 23.7487 32.9675 23.819 33.3426C24.1005 34.9614 24.8275 36.4863 26.0241 37.6822C27.2439 38.9256 28.792 39.6764 30.3872 39.958C30.8329 40.0515 31.3022 37.7293 31.7712 37.7293C32.1233 37.7293 32.4517 40.0047 32.8036 40.0047Z\" fill=\"#65B3E7\" />\n<path class=\"p-DD3400\" d=\"M38.3627 36.7911C39.2538 35.6181 39.7702 34.2809 39.9341 32.8969C39.9811 32.4747 37.6589 32.0525 37.6589 31.6303C37.6589 31.2314 39.9576 30.8324 39.8873 30.4338C39.6057 28.8386 38.8552 27.314 37.6119 26.0942C36.3921 24.8509 34.8436 24.1 33.2487 23.8188C32.8966 23.7485 32.5214 26.0707 32.146 26.0471C31.7238 26.0471 31.2781 23.7249 30.8559 23.7717C29.4484 23.9359 28.1112 24.4519 26.915 25.3434C26.6099 25.5778 28.6508 28.1348 28.3693 28.4399L35.2661 35.3365C35.5709 35.0549 38.1282 37.0959 38.3627 36.7911Z\" fill=\"#4D98CB\" />\n<path class=\"p-68544F\" d=\"M6.28809 37.6895H20.0171V40.0352H6.28809V37.6895Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FF9F00\" d=\"M32.8038 40.005C32.3816 38.4098 32.6397 36.6975 33.5779 35.29L36.7212 38.4333C37.0263 38.1989 37.3311 37.9876 37.6127 37.6825C37.9178 37.4013 38.129 37.0962 38.3635 36.7914L35.2202 33.648C36.6274 32.733 38.3164 32.475 39.9349 32.8972C40.029 32.0764 40.029 31.2552 39.8881 30.4341C37.683 30.0586 35.3608 30.5982 33.5308 31.959L31.7247 30.1525C32.8038 28.6982 33.3902 26.9856 33.3902 25.2498C33.3902 24.7805 33.3431 24.288 33.2496 23.8187C32.4516 23.6781 31.6543 23.6781 30.8567 23.772C31.2789 25.3672 30.9974 27.0795 30.0591 28.487L26.9158 25.3436C26.6107 25.5781 26.3059 25.7894 26.0243 26.0945C25.7428 26.3757 25.5083 26.6808 25.2735 27.0092L28.4171 30.1525C27.0329 31.044 25.3441 31.3255 23.7725 30.9269C23.6786 31.7242 23.6786 32.5453 23.8192 33.3429C25.9776 33.6948 28.253 33.1788 30.0827 31.818L31.8888 33.6245C30.5284 35.4777 29.9888 37.7767 30.3878 39.9579C31.1851 40.0989 31.983 40.0989 32.8038 40.005Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF620B\" d=\"M37.6118 37.6825C37.9169 37.4013 38.1281 37.0962 38.3626 36.7914L35.2193 33.648C36.6265 32.733 38.3155 32.475 39.934 32.8972C40.0281 32.0764 40.0281 31.2552 39.8872 30.4341C37.6821 30.0586 35.3599 30.5982 33.5299 31.959L31.7238 30.1525C32.8029 28.6982 33.3893 26.9856 33.3893 25.2498C33.3893 24.7805 33.3422 24.288 33.2487 23.8187C32.4507 23.6781 31.6534 23.6781 30.8558 23.772C31.278 25.3672 30.9965 27.0795 30.0582 28.487L26.9149 25.3436C26.6098 25.5781 26.305 25.7894 26.0234 26.0945L37.6118 37.6825Z\" fill=\"#58ADE5\" />\n<path class=\"p-53433F\" d=\"M14.1533 37.6895H22.0178V40.0352H14.1533V37.6895Z\" fill=\"#4D98CB\" />\n<path class=\"p-A8D3D8\" d=\"M19.8676 8.1792L19.2345 11.8857H15.3257V8.36691H12.9799V11.8857H9.07107L8.43763 8.1792L7.13867 8.55431L9.64888 23.6146H18.6567L21.1666 8.55461L19.8676 8.1792ZM12.9799 21.2689H10.6192L10.2438 18.9232H12.9799V21.2689ZM12.9799 16.5771H9.84513L9.44648 14.2314H12.9799V16.5771ZM17.6861 21.2689H15.3257V18.9232H18.0615L17.6861 21.2689ZM18.4601 16.5771H15.3257V14.2314H18.8591L18.4601 16.5771Z\" fill=\"#58ADE5\" />\n<path class=\"p-8EBAC5\" d=\"M19.8683 8.1792L19.2352 11.8857H15.3263V8.36691H14.1533V23.6146H18.6574L21.1673 8.55461L19.8683 8.1792ZM17.6868 21.2689H15.3263V18.9232H18.0622L17.6868 21.2689ZM18.4608 16.5771H15.3263V14.2314H18.8598L18.4608 16.5771Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF620B\" d=\"M4.76953 8.19385H23.6143V9.53989H4.76953V8.19385Z\" fill=\"#5FBEFF\" />\n<path class=\"p-DD3400\" d=\"M14.1533 8.19385H23.6148V9.53989H14.1533V8.19385Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_sport_result = browser_sprite_build_default.a.add(svg_cat_sport_symbol);
/* harmony default export */ var svg_cat_sport = (svg_cat_sport_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport18.svg


var svg_cat_sport18_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport18",
  "use": "svg-cat-sport18-usage",
  "viewBox": "0 0 30 30",
  "content": "<symbol viewBox=\"0 0 30 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport18\">\n<path class=\"p-3F6199\" d=\"M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z\" fill=\"#58ADE5\" />\n<path class=\"p-2B4160\" d=\"M30 14.9999C30 14.5303 29.9773 14.0661 29.9352 13.6076L24.069 7.74146L6.66113 23.0867L13.4998 29.9254C13.9933 29.9744 14.4937 29.9999 15 29.9999C23.2843 29.9999 30 23.2842 30 14.9999Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF583E\" d=\"M15 26.6162C21.4155 26.6162 26.6162 21.4155 26.6162 15C26.6162 8.58454 21.4155 3.38379 15 3.38379C8.58454 3.38379 3.38379 8.58454 3.38379 15C3.38379 21.4155 8.58454 26.6162 15 26.6162Z\" fill=\"#A1D1FD\" />\n<path class=\"p-E82E21\" d=\"M14.9997 3.38379C14.9978 3.38379 14.996 3.38385 14.9941 3.38385V26.6162C14.996 26.6162 14.9978 26.6162 14.9997 26.6162C21.4151 26.6162 26.6159 21.4154 26.6159 15C26.6159 8.58457 21.4151 3.38379 14.9997 3.38379Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFFFFF\" d=\"M10.1534 12.4094V21.0141H7.77568V15.3758C7.3909 15.6682 7.01871 15.9048 6.659 16.0857C6.29918 16.2665 5.84813 16.4397 5.30566 16.605V14.6775C6.10588 14.4198 6.72721 14.11 7.16971 13.7484C7.61209 13.3868 7.95838 12.9404 8.20852 12.4095H10.1534V12.4094Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FFFFFF\" d=\"M12.8064 16.4665C12.4371 16.2702 12.1678 16.051 11.9986 15.8086C11.7677 15.4777 11.6523 15.0968 11.6523 14.6659C11.6523 13.958 11.985 13.3789 12.6507 12.9288C13.1701 12.5825 13.8569 12.4094 14.711 12.4094C15.8421 12.4094 16.6779 12.6249 17.2185 13.0558C17.759 13.4867 18.0293 14.0292 18.0293 14.6832C18.0293 15.0641 17.9216 15.42 17.7062 15.7509C17.5446 15.9971 17.2907 16.2356 16.9444 16.4665C17.4022 16.6858 17.7437 16.9763 17.9688 17.3379C18.1938 17.6996 18.3063 18.0996 18.3063 18.5383C18.3063 18.9616 18.2091 19.3569 18.0149 19.7243C17.8206 20.0917 17.5821 20.3755 17.2993 20.5755C17.0165 20.7756 16.6644 20.9227 16.2431 21.017C15.8219 21.1112 15.3726 21.1583 14.8956 21.1583C13.9991 21.1583 13.3143 21.0525 12.8411 20.8409C12.3679 20.6294 12.008 20.3178 11.7619 19.906C11.5157 19.4944 11.3926 19.0346 11.3926 18.5267C11.3926 18.0304 11.508 17.6101 11.7389 17.2657C11.9697 16.9215 12.3255 16.655 12.8064 16.4665ZM13.7356 18.4459C13.7356 18.8192 13.8491 19.124 14.0761 19.3606C14.3031 19.5972 14.5628 19.7155 14.8552 19.7155C15.1361 19.7155 15.3881 19.5954 15.6112 19.3548C15.8343 19.1144 15.9459 18.8094 15.9459 18.4401C15.9459 18.067 15.8334 17.7611 15.6083 17.5225C15.3832 17.284 15.1226 17.1647 14.8263 17.1647C14.5339 17.1647 14.279 17.2801 14.0616 17.511C13.8443 17.7419 13.7356 18.0535 13.7356 18.4459ZM13.8626 14.8044C13.8626 15.0969 13.9539 15.3325 14.1367 15.5114C14.3194 15.6903 14.5628 15.7797 14.8668 15.7797C15.136 15.7797 15.3573 15.6913 15.5304 15.5143C15.7036 15.3374 15.7902 15.1084 15.7902 14.8275C15.7902 14.5352 15.6997 14.2976 15.5189 14.1148C15.338 13.9321 15.1072 13.8406 14.8264 13.8406C14.5416 13.8406 14.3099 13.9301 14.131 14.109C13.9521 14.2879 13.8626 14.5197 13.8626 14.8044Z\" fill=\"#5FBEFF\" />\n<path class=\"p-E9EDF5\" d=\"M17.9687 17.3379C17.7436 16.9763 17.4022 16.6858 16.9444 16.4665C17.2906 16.2356 17.5445 15.9972 17.7061 15.7509C17.9216 15.4201 18.0293 15.0642 18.0293 14.6833C18.0293 14.0292 17.7589 13.4868 17.2185 13.0558C16.7243 12.662 15.9827 12.4487 14.9952 12.4148V13.8536C15.2008 13.8838 15.3758 13.9703 15.5189 14.1148C15.6996 14.2975 15.7901 14.5352 15.7901 14.8275C15.7901 15.1084 15.7035 15.3373 15.5304 15.5143C15.3857 15.6622 15.2069 15.7474 14.9951 15.7717V17.1798C15.2224 17.2172 15.4271 17.3306 15.6083 17.5226C15.8334 17.7612 15.9459 18.067 15.9459 18.4402C15.9459 18.8095 15.8343 19.1145 15.6112 19.3549C15.4258 19.5546 15.2202 19.67 14.9951 19.7039V21.1571C15.4351 21.1509 15.8513 21.1046 16.2431 21.0169C16.6644 20.9227 17.0164 20.7755 17.2993 20.5754C17.582 20.3755 17.8205 20.0917 18.0149 19.7242C18.2091 19.3569 18.3063 18.9615 18.3063 18.5383C18.3063 18.0997 18.1938 17.6996 17.9687 17.3379Z\" fill=\"#4D98CB\" />\n<path class=\"p-E9EDF5\" d=\"M17.8545 10.4963H20.0648V8.27441H21.9289V10.4963H24.1507V12.3603H21.9289V14.5707H20.0648V12.3603H17.8545V10.4963Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_sport18_result = browser_sprite_build_default.a.add(svg_cat_sport18_symbol);
/* harmony default export */ var svg_cat_sport18 = (svg_cat_sport18_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-accessories.svg


var svg_cat_sport_accessories_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-accessories",
  "use": "svg-cat-sport-accessories-usage",
  "viewBox": "0 0 32 28",
  "content": "<symbol viewBox=\"0 0 32 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-accessories\">\n<path class=\"p-73BCFF\" d=\"M0 17.679V28H25.8142V25.0369L0 17.679Z\" fill=\"#A1D1FD\" />\n<path class=\"p-575F64\" d=\"M23.9743 12.018H22.1349V8.2777C22.1349 4.72806 19.2463 1.83949 15.6966 1.83949C12.147 1.83949 9.25843 4.72806 9.25843 8.2777V12.018H7.41895V8.2777C7.41895 3.71323 11.1322 0 15.6966 0C20.2611 0 23.9743 3.71323 23.9743 8.2777V12.018Z\" fill=\"#4D98CB\" />\n<path class=\"p-0095FF\" d=\"M24.8944 9.40137H19.376V25.9568H24.8944C28.6287 25.9568 31.394 22.4802 31.394 17.6791C31.394 12.878 28.6287 9.40137 24.8944 9.40137Z\" fill=\"#5FBEFF\" />\n<path class=\"p-006EFF\" d=\"M31.394 17.679C31.394 22.4801 28.6287 25.9567 24.8944 25.9567H19.376V17.679H31.394Z\" fill=\"#4D98CB\" />\n<path class=\"p-73BCFF\" d=\"M19.3755 9.40137H12.0176V25.9568H19.3755C23.1098 25.9568 25.8137 22.4802 25.8137 17.6791C25.8137 12.878 23.1098 9.40137 19.3755 9.40137Z\" fill=\"#65B3E7\" />\n<path class=\"p-0095FF\" d=\"M25.8137 17.679C25.8137 22.4801 23.1098 25.9567 19.3755 25.9567H12.0176V17.679H25.8137Z\" fill=\"#58ADE5\" />\n<path class=\"p-0095FF\" d=\"M12.0185 9.40137H6.5V25.9568H12.0185C15.7528 25.9568 18.4567 22.4802 18.4567 17.6791C18.4567 12.878 15.7528 9.40137 12.0185 9.40137Z\" fill=\"#5FBEFF\" />\n<path class=\"p-006EFF\" d=\"M18.4567 17.679C18.4567 22.4801 15.7528 25.9567 12.0185 25.9567H6.5V17.679H18.4567Z\" fill=\"#4D98CB\" />\n<path class=\"p-73BCFF\" d=\"M6.49953 9.40137C2.76522 9.40137 0 12.878 0 17.6791C0 22.4802 2.76522 25.9568 6.49953 25.9568C10.2338 25.9568 12.9377 22.4802 12.9377 17.6791C12.9377 12.878 10.2338 9.40137 6.49953 9.40137Z\" fill=\"#65B3E7\" />\n<path class=\"p-0095FF\" d=\"M12.9377 17.679C12.9377 22.4801 10.2338 25.9567 6.49953 25.9567C2.76522 25.9567 0 22.4801 0 17.679H12.9377Z\" fill=\"#58ADE5\" />\n<path class=\"p-0095FF\" d=\"M6.49947 13.0803C4.9359 13.0803 3.74023 15.0487 3.74023 17.679C3.74023 20.3094 4.9359 22.2778 6.49947 22.2778C8.06303 22.2778 9.2587 20.3094 9.2587 17.679C9.2587 15.0487 8.06303 13.0803 6.49947 13.0803Z\" fill=\"#5FBEFF\" />\n<path class=\"p-006EFF\" d=\"M9.2587 17.679C9.2587 20.3093 8.06303 22.2777 6.49947 22.2777C4.9359 22.2777 3.74023 20.3093 3.74023 17.679H9.2587Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_sport_accessories_result = browser_sprite_build_default.a.add(svg_cat_sport_accessories_symbol);
/* harmony default export */ var svg_cat_sport_accessories = (svg_cat_sport_accessories_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-bads.svg


var svg_cat_sport_bads_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-bads",
  "use": "svg-cat-sport-bads-usage",
  "viewBox": "0 0 23 34",
  "content": "<symbol viewBox=\"0 0 23 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-bads\">\n<path class=\"p-666666\" d=\"M15.1048 0H6.99023C5.88566 0 4.99023 0.89543 4.99023 2V5.42412H17.1048V2C17.1048 0.895431 16.2094 0 15.1048 0Z\" fill=\"#5FBEFF\" />\n<path class=\"p-4D4D4D\" d=\"M15.1047 0H9.02832V5.42412H17.1047V2C17.1047 0.895431 16.2093 0 15.1047 0Z\" fill=\"#58ADE5\" />\n<path class=\"p-333333\" d=\"M15.1047 0H13.0664V5.42412H17.1047V2C17.1047 0.895431 16.2092 0 15.1047 0Z\" fill=\"#4D98CB\" />\n<path class=\"p-79D60D\" d=\"M20.0963 5.03931H2C0.895431 5.03931 0 5.93474 0 7.03931V32.0001C0 33.1047 0.89543 34.0001 2 34.0001H20.0963C21.2009 34.0001 22.0963 33.1047 22.0963 32.0001V7.03931C22.0963 5.93474 21.2009 5.03931 20.0963 5.03931Z\" fill=\"#65B3E7\" />\n<path class=\"p-3CC602\" d=\"M20.097 5.03931H11.0488V34.0001H20.097C21.2016 34.0001 22.097 33.1047 22.097 32.0001V7.03931C22.097 5.93474 21.2016 5.03931 20.097 5.03931Z\" fill=\"#4D98CB\" />\n<path class=\"p-F1F1F2\" d=\"M22.0963 12.2195H0V26.8198H22.0963V12.2195Z\" fill=\"#B9DFFC\" />\n<path class=\"p-E6E6E6\" d=\"M22.0969 12.2195H11.0488V26.8197H22.0969V12.2195Z\" fill=\"#A1D1FD\" />\n<path class=\"p-3CC602\" d=\"M9.1076 17.4318C7.20558 19.3338 7.60409 22.8161 7.60409 22.8161C7.60409 22.8161 11.0863 23.2146 12.9884 21.3126C14.8904 19.4105 14.4919 15.9283 14.4919 15.9283C14.4919 15.9283 11.0096 15.5298 9.1076 17.4318Z\" fill=\"#5FBEFF\" />\n<path class=\"p-00AC00\" d=\"M14.4922 15.9282C14.4922 15.9282 12.7443 15.7285 11.0488 16.2881V22.4556C11.7461 22.2252 12.4345 21.8666 12.9886 21.3125C14.8907 19.4105 14.4922 15.9282 14.4922 15.9282Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_sport_bads_result = browser_sprite_build_default.a.add(svg_cat_sport_bads_symbol);
/* harmony default export */ var svg_cat_sport_bads = (svg_cat_sport_bads_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-bicycle.svg


var svg_cat_sport_bicycle_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-bicycle",
  "use": "svg-cat-sport-bicycle-usage",
  "viewBox": "0 0 32 24",
  "content": "<symbol viewBox=\"0 0 32 24\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-bicycle\">\n<path class=\"p-32393F\" d=\"M24.985 11.0769C21.4165 11.0769 18.5234 13.9699 18.5234 17.5384C18.5234 21.107 21.4165 24 24.985 24C28.5535 24 31.5081 21.107 31.5081 17.5384C31.5081 13.9699 28.5535 11.0769 24.985 11.0769ZM24.985 22.1538C22.4403 22.1538 20.3696 20.0832 20.3696 17.5384C20.3696 14.9937 22.4403 12.9231 24.985 12.9231C27.5297 12.9231 29.6619 14.9937 29.6619 17.5384C29.6619 20.0832 27.5297 22.1538 24.985 22.1538Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M6.52308 11.0769C2.95457 11.0769 0 13.9699 0 17.5384C0 21.107 2.95457 24 6.52308 24C10.0916 24 12.9846 21.107 12.9846 17.5384C12.9846 13.9699 10.0916 11.0769 6.52308 11.0769ZM6.52308 22.1538C3.97837 22.1538 1.84615 20.0832 1.84615 17.5384C1.84615 14.9937 3.97837 12.9231 6.52308 12.9231C9.06779 12.9231 11.1385 14.9937 11.1385 17.5384C11.1385 20.0832 9.06779 22.1538 6.52308 22.1538Z\" fill=\"#58ADE5\" />\n<path class=\"p-73BCFF\" d=\"M9.19441 4.20215L11.0403 7.89446L9.38912 8.71994L7.54297 5.02787L9.19441 4.20215Z\" fill=\"#A1D1FD\" />\n<path class=\"p-0095FF\" d=\"M25.6505 16.6154L20.7272 1.84617L19.5236 0.923096L18.7812 1.84617L24.3197 18.4616H25.9082C26.418 18.4616 26.8313 18.0483 26.8313 17.5385C26.8313 17.0287 26.418 16.6154 25.9082 16.6154H25.6505Z\" fill=\"#5FBEFF\" />\n<path class=\"p-73BCFF\" d=\"M21.9013 7.38452V9.23068H10.7874L7.6674 14.7691L6.52269 16.6153L5.59961 14.7691L9.64264 7.38452H21.9013Z\" fill=\"#A1D1FD\" />\n<path class=\"p-0095FF\" d=\"M15.7539 7.38452H21.9017V9.23068H15.7539V7.38452Z\" fill=\"#5FBEFF\" />\n<path class=\"p-575F64\" d=\"M18.3753 22.5599L16.8248 23.594L15.7539 21.9878L13.1992 17.8828L14.7314 16.8489L15.7539 18.6277L18.3753 22.5599Z\" fill=\"#58ADE5\" />\n<path class=\"p-32393F\" d=\"M18.3753 22.5597L16.8248 23.5938L15.7539 21.9875V18.6274L18.3753 22.5597Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M5.59961 4.61546C5.59961 4.10566 6.01288 3.69238 6.52269 3.69238H12.9842V5.53854H6.52269C6.01289 5.53854 5.59961 5.12526 5.59961 4.61546Z\" fill=\"#58ADE5\" />\n<path class=\"p-575F64\" d=\"M20.7202 1.84615H15.7541C15.2443 1.84615 14.8311 1.43288 14.8311 0.923077C14.8311 0.413276 15.2443 0 15.7541 0H20.1111L20.7202 1.84615Z\" fill=\"#575F64\" />\n<path class=\"p-32393F\" d=\"M15.8254 1.84615C15.3156 1.84615 14.9023 1.43288 14.9023 0.923077C14.9023 0.413276 15.3156 0 15.8254 0H20.1109L20.72 1.84615H15.8254Z\" fill=\"#4D98CB\" />\n<path class=\"p-D3D3D8\" d=\"M14.9734 17.5385C14.9734 18.3508 14.6227 19.0892 14.0503 19.5878C13.5703 20.0308 12.9241 20.3077 12.2042 20.3077H5.59961V14.7693H12.2042C12.9241 14.7693 13.5703 15.0462 14.0503 15.4892C14.6227 15.9878 14.9734 16.7263 14.9734 17.5385Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BABAC0\" d=\"M14.9739 17.5383C14.9739 18.3506 14.6231 19.089 14.0508 19.5876V15.489C14.6231 15.9876 14.9739 16.726 14.9739 17.5383Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_sport_bicycle_result = browser_sprite_build_default.a.add(svg_cat_sport_bicycle_symbol);
/* harmony default export */ var svg_cat_sport_bicycle = (svg_cat_sport_bicycle_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-box.svg


var svg_cat_sport_box_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-box",
  "use": "svg-cat-sport-box-usage",
  "viewBox": "0 0 35 30",
  "content": "<symbol viewBox=\"0 0 35 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-box\">\n<path class=\"p-D3D3D8\" d=\"M7.71404 1.36353L3.75203 7.29778L0 18.2352L8.46968 20.7854L12.819 17.0282L7.71404 1.36353Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BABAC0\" d=\"M31.2477 7.68484L27.1381 1.36353L22.0332 17.0282L26.3825 20.7854L34.8522 18.2352L31.2477 7.68484Z\" fill=\"#65B3E7\" />\n<path class=\"p-ECECF1\" d=\"M27.7092 30H6.29199L8.46904 21.6355L9.00344 17.9497L10.9754 17.0282L9.04039 16.1068L7.7134 1.36353H12.8183L17.4256 8.73515L22.0329 1.36353H27.1378L25.8108 16.1068L23.8758 17.0282L25.8478 17.9497L26.3822 21.6355L27.7092 30Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M28.5594 30H17.4258V8.73515L22.033 1.36353H27.138L25.811 16.1068L23.876 17.0282L25.848 17.9497L26.3823 21.6355L28.5594 30Z\" fill=\"#A1D1FD\" />\n<path class=\"p-D3D3D8\" d=\"M22.0339 1.36353L17.4266 10.5781L12.8193 1.36353H22.0339Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BABAC0\" d=\"M22.033 1.36353L17.4258 10.5781V1.36353H22.033Z\" fill=\"#A1D1FD\" />\n<path class=\"p-32393F\" d=\"M22.13 0.0297852L23.7785 0.854053L18.5409 11.3291L16.8926 10.5048L22.13 0.0297852Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M21.9414 23.9947L20.2828 24.8055L17.4263 19.0925L14.5697 24.8055L12.9111 23.9947L16.5969 16.623H18.2556L21.9414 23.9947Z\" fill=\"#5FBEFF\" />\n<path class=\"p-32393F\" d=\"M18.2551 16.623L21.9409 23.9947L20.2823 24.8055L17.4258 19.0925V16.623H18.2551Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M21.9231 16.5861L20.3014 17.4706L17.4265 12.2923L11.0869 0.884499L12.7086 0L17.4265 8.49584L21.9231 16.5861Z\" fill=\"#5FBEFF\" />\n<path class=\"p-32393F\" d=\"M21.9224 16.5864L20.3008 17.4709L17.4258 12.2925V8.49609L21.9224 16.5864Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M25.8492 17.9496H9.00488L9.13398 17.0281L9.04184 16.1067H25.8123L25.7201 17.0281L25.8492 17.9496Z\" fill=\"#5FBEFF\" />\n<path class=\"p-32393F\" d=\"M25.848 17.9496H17.4258V16.1067H25.811L25.7189 17.0281L25.848 17.9496Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_sport_box_result = browser_sprite_build_default.a.add(svg_cat_sport_box_symbol);
/* harmony default export */ var svg_cat_sport_box = (svg_cat_sport_box_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-command.svg


var svg_cat_sport_command_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-command",
  "use": "svg-cat-sport-command-usage",
  "viewBox": "0 0 33 32",
  "content": "<symbol viewBox=\"0 0 33 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-command\">\n<path class=\"p-7C8388\" d=\"M24.0225 28.0256L28.0261 24.022L32.0298 26.1282L26.1579 31.9999L24.0225 28.0256Z\" fill=\"#5FBEFF\" />\n<path class=\"p-575F64\" d=\"M26.1579 32.0001L24.0225 28.0257L25.9558 25.9565L29.0789 29.0794L26.1579 32.0001Z\" fill=\"#65B3E7\" />\n<path class=\"p-FDBF00\" d=\"M19.0667 23.1243C16.8872 20.9448 14.1346 19.0167 11.7059 17.3159C9.64421 15.8717 7.69678 14.508 6.37572 13.1869L1.40768 8.21938L1.40742 8.21913C-0.469184 6.34177 -0.469184 3.28675 1.40768 1.40889C3.28529 -0.467719 6.3403 -0.467719 8.21792 1.40914L13.1852 6.37718C14.498 7.68995 15.9092 9.67857 17.4033 11.784C19.1267 14.2126 21.0802 16.9655 23.1529 19.038L24.7256 20.611L20.6394 24.697L19.0667 23.1243Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF9100\" d=\"M20.6394 24.6965L19.0667 23.1238C16.8872 20.9443 14.1346 19.0162 11.7059 17.3154C9.64421 15.8713 7.69678 14.5075 6.37572 13.1865L1.40768 8.21894L1.40743 8.21869C-0.469184 6.34133 -0.469184 3.28631 1.40768 1.40845L22.6677 22.6685L20.6394 24.6965Z\" fill=\"#76B7E2\" />\n<path class=\"p-575F64\" d=\"M19.2773 23.3348L23.3636 19.2488L28.412 24.2979L24.326 28.3832L19.2773 23.3348Z\" fill=\"#76B7E2\" />\n<path class=\"p-32393F\" d=\"M24.326 28.3829L19.2773 23.3344L21.3056 21.3064L26.3543 26.3551L24.326 28.3829Z\" fill=\"#4D98CB\" />\n<path class=\"p-7C8388\" d=\"M6.76159 31.9999L0.889648 26.1282L4.89331 24.022L8.89697 28.0256L6.76159 31.9999Z\" fill=\"#5FBEFF\" />\n<path class=\"p-575F64\" d=\"M6.76087 32.0001L8.89623 28.0257L6.96292 25.9565L3.83984 29.0794L6.76087 32.0001Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFDA2D\" d=\"M12.2796 24.6964L8.19336 20.6105L9.76607 19.0375C11.8388 16.965 13.7923 14.2121 15.5157 11.7835C17.0098 9.67805 18.421 7.68943 19.7338 6.37666L24.7011 1.40862C26.5787 -0.468238 29.6337 -0.468238 31.5113 1.40862C33.3882 3.28623 33.3882 6.34125 31.5116 8.21886H31.5113L26.5433 13.1864C25.2222 14.5075 23.2748 15.8712 21.2131 17.3153C18.7844 19.0161 16.0318 20.9442 13.8523 23.1237L12.2796 24.6964Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FDBF00\" d=\"M12.2803 24.6965L13.853 23.1238C16.0325 20.9443 18.7851 19.0162 21.2137 17.3154C23.2754 15.8713 25.2229 14.5075 26.5439 13.1865L31.512 8.21894C33.3886 6.34158 33.3888 3.28631 31.512 1.40845L10.252 22.6685L12.2803 24.6965Z\" fill=\"#A1D1FD\" />\n<path class=\"p-575F64\" d=\"M8.59283 28.3832L4.50684 24.2979L9.55524 19.2488L13.6415 23.3348L8.59283 28.3832Z\" fill=\"#76B7E2\" />\n<path class=\"p-32393F\" d=\"M8.59373 28.3829L13.6424 23.3345L11.6141 21.3064L6.56543 26.3551L8.59373 28.3829Z\" fill=\"#4D98CB\" />\n<path class=\"p-ECECF1\" d=\"M16.4211 5.77543C15.6812 5.77543 14.9414 5.49389 14.378 4.93081C13.2516 3.80414 13.2516 1.97123 14.378 0.844813C15.5047 -0.281604 17.3376 -0.281604 18.464 0.844813C19.5904 1.97123 19.5904 3.80414 18.464 4.93081C17.9007 5.49389 17.1608 5.77543 16.4211 5.77543Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M16.4209 0V5.77549C17.1605 5.77549 17.9004 5.49395 18.4638 4.93087C19.5902 3.8042 19.5902 1.97129 18.4638 0.844876C17.9004 0.281541 17.1605 0 16.4209 0Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_sport_command_result = browser_sprite_build_default.a.add(svg_cat_sport_command_symbol);
/* harmony default export */ var svg_cat_sport_command = (svg_cat_sport_command_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-dancing.svg


var svg_cat_sport_dancing_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-dancing",
  "use": "svg-cat-sport-dancing-usage",
  "viewBox": "0 0 30 30",
  "content": "<symbol viewBox=\"0 0 30 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-dancing\">\n<path class=\"p-76E2F8\" d=\"M30 5.66577V8.84746H28.2422V6.75571L26.4844 5.8768V11.4842H24.7266V3.02905L30 5.66577Z\" fill=\"#A1D1FD\" />\n<path class=\"p-76E2F8\" d=\"M8.84766 2.63672V5.877H7.08984V3.72665L5.33203 2.84775V7.96875H3.57422V0L8.84766 2.63672Z\" fill=\"#A1D1FD\" />\n<path class=\"p-D3D3D8\" d=\"M4.87012 13.2422L7.3647 15L9.54549 13.2422L15.0002 7.08984C10.5938 7.08984 6.77647 9.58832 4.87012 13.2422Z\" fill=\"#A1D1FD\" />\n<path class=\"p-0095FF\" d=\"M15 7.08984L20.4547 13.2422L22.4194 15L25.1884 13.2422C23.2823 9.58832 19.4064 7.08984 15 7.08984Z\" fill=\"#4D98CB\" />\n<path class=\"p-73BCFF\" d=\"M14.9996 7.08984C12.627 7.08984 10.5715 9.58832 9.54492 13.2422L12.2723 15L14.9996 13.2422L16.7574 10.166L14.9996 7.08984Z\" fill=\"#58ADE5\" />\n<path class=\"p-76E2F8\" d=\"M20.4547 13.2422C19.4282 9.58832 17.3726 7.08984 15 7.08984V13.2422L18.0762 15L20.4547 13.2422Z\" fill=\"#A1D1FD\" />\n<path class=\"p-575F64\" d=\"M14.1211 0H15.8789V7.83256H14.1211V0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-32393F\" d=\"M15 0H15.8789V7.83256H15V0Z\" fill=\"#4D98CB\" />\n<path class=\"p-76E2F8\" d=\"M4.45312 6.01753C3.99605 5.5957 3.38081 5.33203 2.69531 5.33203C1.23619 5.33203 0 6.50963 0 7.96875C0 9.42764 1.23619 10.6055 2.69531 10.6055C3.38081 10.6055 3.99605 10.3418 4.45312 9.91997C4.99809 9.44527 5.33203 8.74214 5.33203 7.96875C5.33203 7.19536 4.99809 6.49223 4.45312 6.01753Z\" fill=\"#A1D1FD\" />\n<path class=\"p-76E2F8\" d=\"M28.2422 12.3633H30V14.1211H28.2422V12.3633Z\" fill=\"#A1D1FD\" />\n<path class=\"p-76E2F8\" d=\"M5.33203 26.4844H3.57422V24.7266H1.81641V26.4844H0V28.2422H1.81641V30H3.57422V28.2422H5.33203V26.4844Z\" fill=\"#A1D1FD\" />\n<path class=\"p-575F64\" d=\"M12.3633 6.95361V7.96871C12.3633 9.4276 13.5409 10.6054 15 10.6054C16.4591 10.6054 17.6367 9.4276 17.6367 7.96871V6.95361H12.3633Z\" fill=\"#B9DFFC\" />\n<path class=\"p-32393F\" d=\"M17.6367 6.95361V7.96871C17.6367 9.4276 16.4591 10.6054 15 10.6054V6.95361H17.6367Z\" fill=\"#4D98CB\" />\n<path class=\"p-BABAC0\" d=\"M25.1889 13.2422H20.4549L19.0459 15.8789L21.1525 18.5156L24.7267 20.2734L26.4846 18.5156C26.4846 16.612 26.0124 14.8208 25.1889 13.2422Z\" fill=\"#B9DFFC\" />\n<path class=\"p-73BCFF\" d=\"M4.86992 13.2422C4.0464 14.8208 3.57422 16.612 3.57422 18.5156L5.77148 20.2734L8.84766 18.5156L10.9543 15.8789L9.54529 13.2422H4.86992Z\" fill=\"#58ADE5\" />\n<path class=\"p-9BFCFF\" d=\"M15 13.2422H9.54529C9.10194 14.8208 8.84766 16.612 8.84766 18.5156L11.9238 20.2734L15 18.5156L16.7578 15.8789L15 13.2422Z\" fill=\"#B9DFFC\" />\n<path class=\"p-0095FF\" d=\"M15 18.5156L18.0762 20.2734L21.1523 18.5156C21.1523 16.612 20.8981 14.8208 20.4547 13.2422H15V18.5156Z\" fill=\"#4D98CB\" />\n<path class=\"p-0095FF\" d=\"M21.1525 18.5156L19.0459 21.2109L20.4549 23.8477H25.1886C26.0124 22.2691 26.4846 20.4192 26.4846 18.5156H21.1525Z\" fill=\"#4D98CB\" />\n<path class=\"p-9BFCFF\" d=\"M8.84766 18.5156H3.57422C3.57422 20.4192 4.0464 22.2691 4.86992 23.8477L7.26425 25.6055L9.54529 23.8477L10.9543 21.2109L8.84766 18.5156Z\" fill=\"#B9DFFC\" />\n<path class=\"p-73BCFF\" d=\"M15 18.5156H8.84766C8.84766 20.4192 9.10194 22.2691 9.54529 23.8477L11.9238 25.6055L15 23.8477L16.7578 21.2109L15 18.5156Z\" fill=\"#58ADE5\" />\n<path class=\"p-D3D3D8\" d=\"M15 23.8477L17.7274 25.6055L20.4547 23.8477C20.8981 22.2691 21.1523 20.4192 21.1523 18.5156H15V23.8477Z\" fill=\"#B9DFFC\" />\n<path class=\"p-76E2F8\" d=\"M20.4547 23.8477L15 30C19.4064 30 23.2823 27.5015 25.1887 23.8477H20.4547Z\" fill=\"#A1D1FD\" />\n<path class=\"p-73BCFF\" d=\"M9.54549 23.8477H4.87012C6.77647 27.5015 10.5938 30 15.0002 30L9.54549 23.8477Z\" fill=\"#58ADE5\" />\n<path class=\"p-A1D1FD\" d=\"M9.54492 23.8477C10.5715 27.5015 12.627 30 14.9996 30L16.7574 26.9238L14.9996 23.8477H9.54492Z\" fill=\"#A1D1FD\" />\n<path class=\"p-0095FF\" d=\"M20.4547 23.8477H15V30C17.3726 30 19.4282 27.5015 20.4547 23.8477Z\" fill=\"#4D98CB\" />\n<path class=\"p-76E2F8\" d=\"M25.6055 9.53316C25.1484 9.1111 24.5332 8.84766 23.8477 8.84766C22.3885 8.84766 21.1523 10.0253 21.1523 11.4844C21.1523 12.9433 22.3885 14.1211 23.8477 14.1211C24.5332 14.1211 25.1484 13.8574 25.6055 13.4356C26.1504 12.9609 26.4844 12.2578 26.4844 11.4844C26.4844 10.711 26.1504 10.0079 25.6055 9.53316Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_sport_dancing_result = browser_sprite_build_default.a.add(svg_cat_sport_dancing_symbol);
/* harmony default export */ var svg_cat_sport_dancing = (svg_cat_sport_dancing_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-fishing.svg


var svg_cat_sport_fishing_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-fishing",
  "use": "svg-cat-sport-fishing-usage",
  "viewBox": "0 0 23 38",
  "content": "<symbol viewBox=\"0 0 23 38\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-fishing\">\n<path class=\"p-BABAC0\" d=\"M16.2714 38.0001C13.8058 38.0001 11.8008 35.9952 11.8008 33.5295V29.2196L17.8891 32.2635L16.8892 33.4116L13.1994 31.5088V34.0636C13.1994 35.2958 14.4768 36.6164 16.2714 36.6164C18.6548 36.6164 19.3582 34.7618 19.3582 33.5295V27.9412H20.742V33.5295C20.742 35.9952 18.737 38.0001 16.2714 38.0001Z\" fill=\"#A1D1FD\" />\n<path class=\"p-BABAC0\" d=\"M19.3584 3.32251H20.7421V21.2351H19.3584V3.32251Z\" fill=\"#A1D1FD\" />\n<path class=\"p-32393F\" d=\"M15.0154 12.7183L12.8447 10.5211L14.4252 8.94067L16.5958 11.1381L15.0154 12.7183Z\" fill=\"#4D98CB\" />\n<path class=\"p-7C8388\" d=\"M22.2024 0.790229L21.4122 0L0 21.4122L0.785861 22.198L0.789938 22.2027L1.58046 22.9926L22.9926 1.58046L22.2024 0.790229Z\" fill=\"#5FBEFF\" />\n<path class=\"p-575F64\" d=\"M1.58073 22.9924L22.9929 1.58027L22.2027 0.790039L0.786133 22.1979L0.790209 22.2025L1.58073 22.9924Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF9100\" d=\"M20.0119 28.1022C18.3684 28.1022 17.0312 26.8129 17.0312 25.228V23.312C17.0312 21.7271 18.3684 20.438 20.0119 20.438C21.6555 20.438 22.9923 21.7271 22.9923 23.312V25.228C22.9923 26.8129 21.6555 28.1022 20.0119 28.1022Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_sport_fishing_result = browser_sprite_build_default.a.add(svg_cat_sport_fishing_symbol);
/* harmony default export */ var svg_cat_sport_fishing = (svg_cat_sport_fishing_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-food.svg


var svg_cat_sport_food_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-food",
  "use": "svg-cat-sport-food-usage",
  "viewBox": "0 0 33 33",
  "content": "<symbol viewBox=\"0 0 33 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-food\">\n<path class=\"p-575F64\" d=\"M16.5752 5.86523V13.5996H3.04004V5.86523H6.90723L7.75796 7.79883L8.84082 5.86523H10.7744L11.7994 7.79883L12.708 5.86523H16.5752Z\" fill=\"#B9DFFC\" />\n<path class=\"p-32393F\" d=\"M9.80762 13.5996V5.86523H10.7744L11.7994 7.79883L12.708 5.86523H16.5752V13.5996H9.80762Z\" fill=\"#65B3E7\" />\n<path class=\"p-73BCFF\" d=\"M19.6216 16.6114V17.6148L17.8432 19.6215H1.77839L0 18.5066V16.6114C0 13.8422 2.05117 11.5945 4.50527 11.5945H15.1756C17.6297 11.5945 19.6216 13.8422 19.6216 16.6114Z\" fill=\"#58ADE5\" />\n<path class=\"p-0095FF\" d=\"M19.6214 16.6114V18.5066L17.8376 19.6215H9.81055V11.5945H15.1619C17.6234 11.5945 19.6214 13.8422 19.6214 16.6114Z\" fill=\"#4D98CB\" />\n<path class=\"p-73BCFF\" d=\"M19.6216 26.9631V27.9582C19.6216 30.7045 17.6297 32.9999 15.1756 32.9999H4.50527C2.05117 32.9999 0 30.7045 0 27.9582V25.1793L3.61607 24.9729H16.0648L19.6216 26.9631Z\" fill=\"#58ADE5\" />\n<path class=\"p-0095FF\" d=\"M16.0538 24.9729L19.6214 26.0712V27.9582C19.6214 30.7045 17.6234 32.9999 15.1619 32.9999H9.81055V24.9729H16.0538Z\" fill=\"#4D98CB\" />\n<path class=\"p-ECECF1\" d=\"M0 17.8379H19.6216V26.7568H0V17.8379Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M9.81055 17.8379H19.6214V26.7568H9.81055V17.8379Z\" fill=\"#A1D1FD\" />\n<path class=\"p-ECECF1\" d=\"M27.6731 3.93164L23.3419 5.86523L19.0107 3.93164L20.9249 1.21806C21.4665 0.406105 22.4139 0 23.3419 0C24.27 0 25.2174 0.406105 25.7589 1.21806L27.6731 3.93164Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M27.674 3.93164L23.3428 5.86523V0C24.2708 0 25.2182 0.406105 25.7598 1.21806L27.674 3.93164Z\" fill=\"#A1D1FD\" />\n<path class=\"p-73BCFF\" d=\"M32.1084 3.93164V5.86523H27.9061L25.9725 11.666H20.713L18.4121 4.76299L19.0116 3.93164H32.1084Z\" fill=\"#58ADE5\" />\n<path class=\"p-0095FF\" d=\"M32.1084 3.93164V5.86523H27.9061L25.9725 11.666H23.3428V3.93164H32.1084Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M3.04004 21.334H16.5752V23.2676H3.04004V21.334Z\" fill=\"#5FBEFF\" />\n<path class=\"p-32393F\" d=\"M9.80762 21.334H16.5752V23.2676H9.80762V21.334Z\" fill=\"#58ADE5\" />\n<path class=\"p-0095FF\" d=\"M12.708 19.4004H14.6416V25.2012H12.708V19.4004Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_sport_food_result = browser_sprite_build_default.a.add(svg_cat_sport_food_symbol);
/* harmony default export */ var svg_cat_sport_food = (svg_cat_sport_food_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-medical.svg


var svg_cat_sport_medical_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-medical",
  "use": "svg-cat-sport-medical-usage",
  "viewBox": "0 0 30 30",
  "content": "<symbol viewBox=\"0 0 30 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-medical\">\n<path class=\"p-83878C\" d=\"M24.6387 23.7305H26.3965C26.8819 23.7305 27.2754 24.124 27.2754 24.6094C27.2754 25.0948 26.8819 25.4883 26.3965 25.4883H24.6387V23.7305Z\" fill=\"#5FBEFF\" />\n<path class=\"p-000000\" d=\"M9.66797 24.6094H8.20312L8.78906 30H9.66797V24.6094Z\" fill=\"#4D98CB\" />\n<path class=\"p-202833\" d=\"M7.91016 24.6094H8.78906V30H7.91016V24.6094Z\" fill=\"#65B3E7\" />\n<path class=\"p-000000\" d=\"M24.0527 25.4883L24.6387 30H25.5176V27.2461L24.0527 25.4883Z\" fill=\"#4D98CB\" />\n<path class=\"p-202833\" d=\"M23.7598 27.2461V30H24.6387V25.4883L23.7598 27.2461Z\" fill=\"#65B3E7\" />\n<path class=\"p-414851\" d=\"M25.5176 27.2461V21.0938H24.0527L24.6387 27.2461H25.5176Z\" fill=\"#A1D1FD\" />\n<path class=\"p-62676F\" d=\"M23.7598 21.0938H24.6387V27.2461H23.7598V21.0938Z\" fill=\"#B9DFFC\" />\n<path class=\"p-414851\" d=\"M24.6387 0C25.1241 0 25.5176 0.3935 25.5176 0.878906V6.15234H24.0527L24.6387 0Z\" fill=\"#4D98CB\" />\n<path class=\"p-62676F\" d=\"M23.7598 0.878906C23.7598 0.3935 24.1533 0 24.6387 0V6.15234H23.7598V0.878906Z\" fill=\"#65B3E7\" />\n<path class=\"p-202833\" d=\"M24.6387 1.75781L22.8809 11.8652L24.6387 21.9727H27.2754V18.6438C28.9478 17.7003 30 15.9261 30 13.9746V7.11914C30 4.1629 27.5949 1.75781 24.6387 1.75781Z\" fill=\"#4D98CB\" />\n<path class=\"p-414851\" d=\"M19.2773 7.11914V13.9746C19.2773 15.9261 20.3295 17.7003 22.002 18.6438V21.9727H24.6387V1.75781C21.6824 1.75781 19.2773 4.1629 19.2773 7.11914Z\" fill=\"#65B3E7\" />\n<path class=\"p-000000\" d=\"M14.9707 21.9727V17.5781H8.78906L7.03125 23.7305L14.9707 21.9727Z\" fill=\"#4D98CB\" />\n<path class=\"p-202833\" d=\"M8.78906 17.5781H2.60742V21.9727L8.78906 23.1445V17.5781Z\" fill=\"#65B3E7\" />\n<path class=\"p-83878C\" d=\"M8.78906 21.9727L7.03125 23.7305L8.78906 25.4883H14.9707V21.9727H8.78906Z\" fill=\"#A1D1FD\" />\n<path class=\"p-A4A6AA\" d=\"M2.60742 21.9727H8.78906V25.4883H2.60742V21.9727Z\" fill=\"#B9DFFC\" />\n<path class=\"p-83878C\" d=\"M8.78906 0L4.39453 8.78906L8.78906 17.5781C13.6432 17.5781 17.5781 13.6432 17.5781 8.78906C17.5781 3.93494 13.6432 0 8.78906 0Z\" fill=\"#58ADE5\" />\n<path class=\"p-A4A6AA\" d=\"M0 8.78906C0 13.6432 3.93494 17.5781 8.78906 17.5781V0C3.93494 0 0 3.93494 0 8.78906Z\" fill=\"#A1D1FD\" />\n<path class=\"p-DBFFFC\" d=\"M8.78906 1.75781L5.27344 8.78906L8.78906 15.8203C12.6723 15.8203 15.8203 12.6723 15.8203 8.78906C15.8203 4.90585 12.6723 1.75781 8.78906 1.75781Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFFFFF\" d=\"M1.75781 8.78906C1.75781 12.6723 4.90585 15.8203 8.78906 15.8203V1.75781C4.90585 1.75781 1.75781 4.90585 1.75781 8.78906Z\" fill=\"#B9DFFC\" />\n<path class=\"p-202833\" d=\"M9.66797 7.93945H8.78906L8.20312 11.001L8.78906 14.0625C9.27447 14.0625 9.66797 13.669 9.66797 13.1836V7.93945Z\" fill=\"#4D98CB\" />\n<path class=\"p-414851\" d=\"M7.91016 7.93945H8.78906V14.0625C8.30366 14.0625 7.91016 13.669 7.91016 13.1836V7.93945Z\" fill=\"#65B3E7\" />\n</symbol>"
});
var svg_cat_sport_medical_result = browser_sprite_build_default.a.add(svg_cat_sport_medical_symbol);
/* harmony default export */ var svg_cat_sport_medical = (svg_cat_sport_medical_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-roller.svg


var svg_cat_sport_roller_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-roller",
  "use": "svg-cat-sport-roller-usage",
  "viewBox": "0 0 27 25",
  "content": "<symbol viewBox=\"0 0 27 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-roller\">\n<path class=\"p-006EFF\" d=\"M25.0522 14.8435C25.0522 11.7181 22.9893 9.04167 20.1635 8.12939L17.0851 11.6664L16.9736 15.6247L21.5366 17.1872L25.0522 15.6247V14.8435Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M14.1143 0V4.58333L12.5518 6.19792H4.9423L3.09863 4.58333C3.14543 4.27083 3.17676 3.94267 3.17676 3.6145V1.45833L3.09863 0H14.1143Z\" fill=\"#B9DFFC\" />\n<path class=\"p-32393F\" d=\"M14.1143 0V4.58333L13.333 5.36458V0H14.1143Z\" fill=\"#A1D1FD\" />\n<path class=\"p-73BCFF\" d=\"M20.1612 8.13529L16.9738 15.6249L15.2705 17.1874L13.333 16.078L12.5518 15.6249L7.86426 12.0885L6.30176 7.76034L7.86426 4.58325H14.1143V5.3645C14.1143 6.6615 14.3277 8.59367 15.6247 8.59367L18.0205 7.76034C18.1924 7.76034 19.333 7.85413 20.1612 8.13529Z\" fill=\"#65B3E7\" />\n<path class=\"p-006EFF\" d=\"M3.09648 4.58325C2.87431 6.07821 2.44035 6.48735 2.02734 7.76034L7.86434 12.0932V4.58325H3.09648Z\" fill=\"#65B3E7\" />\n<path class=\"p-0095FF\" d=\"M20.1612 8.13529L16.9738 15.6249L15.2705 17.1874L13.333 16.078V4.58325H14.1143V5.3645C14.1143 6.6615 14.3277 8.59367 15.6247 8.59367L18.0205 7.76034C18.1924 7.76034 19.333 7.85413 20.1612 8.13529Z\" fill=\"#58ADE5\" />\n<path class=\"p-0095FF\" d=\"M5.52051 7.7605H2.02726C1.76237 8.57694 1.61426 9.43184 1.61426 10.289V15.6251L3.17676 17.1876H10.208L12.5518 15.6251V14.8438C12.5518 10.9606 9.40377 7.7605 5.52051 7.7605Z\" fill=\"#A1D1FD\" />\n<path class=\"p-575F64\" d=\"M1.61426 15.625H25.0518V18.75H1.61426V15.625Z\" fill=\"#65B3E7\" />\n<path class=\"p-32393F\" d=\"M13.333 15.625H25.0518V18.75H13.333V15.625Z\" fill=\"#4D98CB\" />\n<path class=\"p-32393F\" d=\"M16.458 20.3125H19.583V21.875H16.458V20.3125Z\" fill=\"#65B3E7\" />\n<path class=\"p-575F64\" d=\"M7.08301 20.3125H10.208V21.875H7.08301V20.3125Z\" fill=\"#A1D1FD\" />\n<path class=\"p-A1D1FD\" d=\"M3.95833 25C1.80461 25 0 23.2475 0 21.0938C0 18.94 1.80461 17.1875 3.95833 17.1875C6.11206 17.1875 7.86458 18.94 7.86458 21.0938C7.86458 23.2475 6.11206 25 3.95833 25Z\" fill=\"#A1D1FD\" />\n<path class=\"p-65B3E7\" d=\"M22.708 25C20.5543 25 18.8018 23.2475 18.8018 21.0938C18.8018 18.94 20.5543 17.1875 22.708 17.1875C24.8617 17.1875 26.6663 18.94 26.6663 21.0938C26.6663 23.2475 24.8617 25 22.708 25Z\" fill=\"#65B3E7\" />\n<path class=\"p-ECECF1\" d=\"M3.95801 18.75C2.66569 18.75 1.61426 19.8014 1.61426 21.0938C1.61426 22.3861 2.66569 23.4375 3.95801 23.4375C5.25033 23.4375 6.30176 22.3861 6.30176 21.0938C6.30176 19.8014 5.25033 18.75 3.95801 18.75Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M22.708 18.75C21.4157 18.75 20.3643 19.8014 20.3643 21.0938C20.3643 22.3861 21.4157 23.4375 22.708 23.4375C24.0003 23.4375 25.0518 22.3861 25.0518 21.0938C25.0518 19.8014 24.0003 18.75 22.708 18.75Z\" fill=\"#A1D1FD\" />\n<path class=\"p-575F64\" d=\"M3.17676 20.3125H4.73926V21.875H3.17676V20.3125Z\" fill=\"#58ADE5\" />\n<path class=\"p-32393F\" d=\"M21.9268 20.3125H23.4893V21.875H21.9268V20.3125Z\" fill=\"#4D98CB\" />\n<path class=\"p-A1D1FD\" d=\"M13.333 17.1875C11.1768 17.1875 9.42676 18.9376 9.42676 21.0938C9.42676 23.2499 11.1768 25 13.333 25C15.4892 25 17.2393 23.2499 17.2393 21.0938C17.2393 18.9376 15.4892 17.1875 13.333 17.1875Z\" fill=\"#A1D1FD\" />\n<path class=\"p-65B3E7\" d=\"M17.2393 21.0938C17.2393 23.2499 15.4892 25 13.333 25V17.1875C15.4892 17.1875 17.2393 18.9376 17.2393 21.0938Z\" fill=\"#65B3E7\" />\n<path class=\"p-ECECF1\" d=\"M13.333 18.75C12.036 18.75 10.9893 19.7968 10.9893 21.0938C10.9893 22.3907 12.036 23.4375 13.333 23.4375C14.63 23.4375 15.6768 22.3907 15.6768 21.0938C15.6768 19.7968 14.63 18.75 13.333 18.75Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D3D3D8\" d=\"M15.6768 21.0938C15.6768 22.3907 14.63 23.4375 13.333 23.4375V18.75C14.63 18.75 15.6768 19.7968 15.6768 21.0938Z\" fill=\"#A1D1FD\" />\n<path class=\"p-575F64\" d=\"M12.5518 20.3125H14.1143V21.875H12.5518V20.3125Z\" fill=\"#58ADE5\" />\n<path class=\"p-32393F\" d=\"M13.333 20.3125H14.1143V21.875H13.333V20.3125Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_sport_roller_result = browser_sprite_build_default.a.add(svg_cat_sport_roller_symbol);
/* harmony default export */ var svg_cat_sport_roller = (svg_cat_sport_roller_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-table.svg


var svg_cat_sport_table_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-table",
  "use": "svg-cat-sport-table-usage",
  "viewBox": "0 0 23 26",
  "content": "<symbol viewBox=\"0 0 23 26\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-table\">\n<path class=\"p-C9001C\" d=\"M17.0043 7.01083L10.3193 5.99438V23.7775L20.2434 22.7611C20.2434 22.7611 17.0043 17.6505 17.0043 7.01083Z\" fill=\"#65B3E7\" />\n<path class=\"p-FF4C04\" d=\"M5.66781 7.01083C5.66781 17.6505 2.42871 22.7611 2.42871 22.7611L11.3363 23.7776V5.99438L5.66781 7.01083Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF4C04\" d=\"M22.6714 24.761C22.6714 23.6564 21.776 22.761 20.6714 22.761H11.3358L10.3193 24.3805L11.3358 26.0001H22.6714V24.761Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M11.3354 22.761H2C0.895431 22.761 0 23.6564 0 24.761V26.0001H11.3354V22.761Z\" fill=\"#58ADE5\" />\n<path class=\"p-FF4C04\" d=\"M19.4323 1.61955C19.4323 0.725097 18.7072 0 17.8127 0C16.9183 0 16.1932 0.725123 16.1932 1.61957H12.954C12.954 0.725837 12.2295 0 11.3358 0L10.3193 3.80861L11.3358 7.01074H19.4323V1.61955Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF9100\" d=\"M11.3348 0C10.4403 0 9.71394 0.725108 9.71394 1.61957H6.47738C6.47738 0.725123 5.75228 0 4.85783 0C3.96338 0 3.23828 0.725097 3.23828 1.61955V7.01074H11.3348V0Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_sport_table_result = browser_sprite_build_default.a.add(svg_cat_sport_table_symbol);
/* harmony default export */ var svg_cat_sport_table = (svg_cat_sport_table_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-trainer.svg


var svg_cat_sport_trainer_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-trainer",
  "use": "svg-cat-sport-trainer-usage",
  "viewBox": "0 0 33 33",
  "content": "<symbol viewBox=\"0 0 33 33\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-trainer\">\n<path class=\"p-47568C\" d=\"M27.1992 0V29.1328H21.334V7.79883H19.4004L16.5 6.58066L15.5332 6.17455L13.5996 7.79883H11.666V29.1328H5.80078V0H11.666V1.93359H13.5996C13.6383 1.99154 15.3012 2.43633 16.5 2.95833C16.7707 3.07435 17.0415 3.2097 17.2348 3.32572L19.4004 1.93359H21.334V0H27.1992Z\" fill=\"#58ADE5\" />\n<path class=\"p-2C3B73\" d=\"M27.1992 0V29.1328H21.334V7.79883H19.4004L16.5 6.58066V2.95833C16.7707 3.07435 17.0415 3.2097 17.2348 3.32572L19.4004 1.93359H21.334V0H27.1992Z\" fill=\"#4D98CB\" />\n<path class=\"p-D8D8FC\" d=\"M17.4668 6.83203H15.5332V10.6992H17.4668V6.83203Z\" fill=\"#A1D1FD\" />\n<path class=\"p-D8D8FC\" d=\"M17.4668 12.6328H15.5332V18.4336H17.4668V12.6328Z\" fill=\"#A1D1FD\" />\n<path class=\"p-47568C\" d=\"M14.4912 21.334V29.1328H18.5082V21.334H14.4912Z\" fill=\"#58ADE5\" />\n<path class=\"p-61729B\" d=\"M13.5996 1.93359V7.79883H19.4004V1.93359H13.5996Z\" fill=\"#B9DFFC\" />\n<path class=\"p-61729B\" d=\"M31.0664 32.0332V32.0718H1.93359V32.0332C1.93359 29.3648 4.09922 27.1992 6.76758 27.1992H26.2324C28.9008 27.1992 31.0664 29.3648 31.0664 32.0332Z\" fill=\"#B9DFFB\" />\n<path class=\"p-A3A3D1\" d=\"M17.4668 6.83203H16.5V10.6992H17.4668V6.83203Z\" fill=\"#58ADE5\" />\n<path class=\"p-A3A3D1\" d=\"M17.4668 12.6328H16.5V18.4336H17.4668V12.6328Z\" fill=\"#58ADE5\" />\n<path class=\"p-2C3B73\" d=\"M18.5085 21.334H16.5V29.1328H18.5085V21.334Z\" fill=\"#4D98CB\" />\n<path class=\"p-47568C\" d=\"M19.4004 1.93359H16.5V7.79883H19.4004V1.93359Z\" fill=\"#76B7E2\" />\n<path class=\"p-47568C\" d=\"M31.0664 32.0332V32.0718H16.5V27.1992H26.2324C28.9008 27.1992 31.0664 29.3648 31.0664 32.0332Z\" fill=\"#5FBEFF\" />\n<path class=\"p-F2F2FC\" d=\"M32.9033 16.152C32.7294 16.6354 32.4006 17.0413 31.9365 17.2541C31.666 17.3893 31.3757 17.4668 31.0665 17.4668C30.3317 17.4668 29.6743 17.0607 29.3262 16.4033L27.934 13.5996H5.06607L3.65455 16.4033C3.44185 16.8674 3.03592 17.196 2.55253 17.3701C2.33964 17.4281 2.14634 17.4668 1.93365 17.4668C1.62447 17.4668 1.3341 17.4087 1.06359 17.2541C0.599531 17.0413 0.270756 16.6354 0.0967971 16.152C-0.0580193 15.6492 -0.0192829 15.1271 0.212748 14.6631L2.14634 10.7959C2.47512 10.1384 3.13247 9.73242 3.86724 9.73242H29.1329C29.8676 9.73242 30.525 10.1384 30.8732 10.7959L32.7874 14.6631C33.0194 15.1271 33.0581 15.6492 32.9033 16.152Z\" fill=\"#B9DFFC\" />\n<path class=\"p-D8D8FC\" d=\"M32.9033 16.152C32.7293 16.6354 32.4005 17.0413 31.9365 17.2541C31.6659 17.3893 31.3757 17.4668 31.0664 17.4668C30.3316 17.4668 29.6743 17.0607 29.3261 16.4033L27.934 13.5996H16.5V9.73242H29.1328C29.8676 9.73242 30.5249 10.1384 30.8731 10.7959L32.7874 14.6631C33.0193 15.1271 33.0581 15.6492 32.9033 16.152Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF8597\" d=\"M20.3672 17.4668H12.6328C11.0278 17.4668 9.73242 19.6541 9.73242 21.2591V23.2676H23.2676V21.2591C23.2676 19.6541 21.9722 17.4668 20.3672 17.4668Z\" fill=\"#B9DFFB\" />\n<path class=\"p-FF637B\" d=\"M23.2676 21.2591V23.2676H16.5V17.4668H20.3672C21.9722 17.4668 23.2676 19.6541 23.2676 21.2591Z\" fill=\"#5FBEFF\" />\n<path class=\"p-47568C\" d=\"M33 31.0664H0V33H33V31.0664Z\" fill=\"#58ADE5\" />\n<path class=\"p-2C3B73\" d=\"M33 31.0664H16.5V33H33V31.0664Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_sport_trainer_result = browser_sprite_build_default.a.add(svg_cat_sport_trainer_symbol);
/* harmony default export */ var svg_cat_sport_trainer = (svg_cat_sport_trainer_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-water.svg


var svg_cat_sport_water_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-water",
  "use": "svg-cat-sport-water-usage",
  "viewBox": "0 0 27 27",
  "content": "<symbol viewBox=\"0 0 27 27\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-water\">\n<path class=\"p-F03800\" d=\"M11.1611 23.4675C8.58829 25.3468 5.33297 26.0962 2.15593 25.4698L1.64135 25.3579L1.52929 24.8433C0.903073 21.6663 1.65248 18.411 3.53176 15.8381L6.78708 16.8562L10.1431 20.2122L11.1611 23.4675Z\" fill=\"#5FBEFF\" />\n<path class=\"p-CD0000\" d=\"M10.1444 20.212L11.1624 23.4673C8.58951 25.3466 5.33419 26.096 2.15715 25.4695L1.64258 25.3577L8.46632 18.5339L10.1444 20.212Z\" fill=\"#4D98CB\" />\n<path class=\"p-F03800\" d=\"M23.4671 11.1618L20.2118 10.1439L16.8557 6.78789L15.8379 3.53258C18.4108 1.6533 21.6661 0.903684 24.8431 1.53011L25.3577 1.64197L25.4695 2.15654C26.096 5.33358 25.3463 8.5889 23.4671 11.1618Z\" fill=\"#5FBEFF\" />\n<path class=\"p-CD0000\" d=\"M20.212 10.1441L18.5342 8.46608L25.3579 1.64233L25.4698 2.15691C26.0962 5.33395 25.3466 8.58927 23.4673 11.1621L20.212 10.1441Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF641A\" d=\"M22.3259 12.5044L12.5039 22.3261C12.0789 22.7513 11.6202 23.1205 11.1616 23.4673L3.53223 15.838C3.87912 15.3794 4.24826 14.9207 4.67343 14.4957L14.4952 4.67371C14.9204 4.24854 15.3789 3.8794 15.8377 3.53271L23.4669 11.1619C23.1202 11.6206 22.751 12.0792 22.3259 12.5044Z\" fill=\"#A1D1FD\" />\n<path class=\"p-F03800\" d=\"M22.3255 12.5042L12.5035 22.326C12.0786 22.7512 11.6198 23.1203 11.1613 23.4672L7.34668 19.6526L19.6519 7.34717L23.4665 11.1618C23.1198 11.6205 22.7507 12.079 22.3255 12.5042Z\" fill=\"#58ADE5\" />\n<path class=\"p-575F64\" d=\"M17.4149 9.58465C16.4865 8.65623 14.1933 9.45035 13.2647 10.3788L10.3784 13.2653C9.44996 14.1937 8.65563 16.4869 9.58425 17.4153C10.5127 18.3439 12.8058 17.5498 13.7344 16.6212L16.6208 13.7348C17.5492 12.8062 18.3433 10.5133 17.4149 9.58465Z\" fill=\"#58ADE5\" />\n<path class=\"p-76E2F8\" d=\"M24.4517 15.5025C25.377 14.5772 25.377 13.0718 24.4517 12.1465L23.333 13.265C23.6418 13.5736 23.6418 14.0752 23.333 14.3838L22.2144 15.5023C21.9058 15.8111 21.4043 15.8111 21.0957 15.5023L19.9771 16.6211C20.2857 16.9297 20.2857 17.431 19.9771 17.7396L17.7398 19.9771C17.4313 20.2857 16.9297 20.2857 16.6211 19.9771L15.5025 21.0957C15.8111 21.4043 15.8111 21.9056 15.5025 22.2144L14.3838 23.333C14.0752 23.6416 13.5738 23.6416 13.2652 23.333L12.1465 24.4517C13.0718 25.3768 14.5772 25.3768 15.5025 24.4517L16.6213 23.333C17.0524 22.9016 17.2743 22.3438 17.3033 21.7779C17.8694 21.7487 18.4272 21.527 18.8586 21.0957L21.0959 18.8584C21.527 18.427 21.7489 17.8692 21.7779 17.3033C22.344 17.2741 22.9018 17.0524 23.3332 16.6211L24.4517 15.5025Z\" fill=\"#65B3E7\" />\n<path class=\"p-9BFCFF\" d=\"M13.7352 3.66699L14.8537 2.54824C13.9284 1.62292 12.423 1.62292 11.4977 2.54824L10.3791 3.66699C9.94778 4.09814 9.72613 4.65617 9.69688 5.22204C9.13101 5.25129 8.57318 5.47294 8.14183 5.90429L5.90433 8.14159C5.47318 8.57294 5.25133 9.13077 5.22228 9.69663C4.65621 9.72589 4.09838 9.94753 3.66703 10.3789L2.54848 11.4976C1.62316 12.4228 1.62316 13.9282 2.54848 14.8535L3.66703 13.7349C3.35845 13.4264 3.35845 12.9248 3.66703 12.6162L4.78578 11.4976C5.09436 11.1891 5.59575 11.1891 5.90433 11.4976L7.02308 10.3789C6.7145 10.0703 6.7145 9.56892 7.02308 9.26034L9.26038 7.02304C9.56896 6.71446 10.0703 6.71446 10.3791 7.02304L11.4977 5.90429C11.1891 5.59571 11.1891 5.09432 11.4977 4.78574L12.6164 3.66699C12.925 3.35821 13.4264 3.35821 13.7352 3.66699Z\" fill=\"#5FBEFF\" />\n<path class=\"p-32393F\" d=\"M9.58496 17.4156L17.4156 9.58496C18.344 10.5136 17.5499 12.8065 16.6215 13.7351L13.7349 16.6215C12.8065 17.5499 10.5134 18.3442 9.58496 17.4156Z\" fill=\"#4D98CB\" />\n<path class=\"p-D3D3D8\" d=\"M3.99121 5.11L5.10996 3.99146L23.0083 21.8898L21.8898 23.0086L3.99121 5.11Z\" fill=\"#B9DFFC\" />\n<path class=\"p-BABAC0\" d=\"M12.9404 14.0594L14.059 12.9407L23.0082 21.8899L21.8896 23.0086L12.9404 14.0594Z\" fill=\"#A1D1FD\" />\n<path class=\"p-32393F\" d=\"M22.95 26.306L20.2119 23.568L23.568 20.2119L26.306 22.95C27.2314 23.8753 27.2314 25.3807 26.306 26.306C25.3807 27.2314 23.8753 27.2314 22.95 26.306Z\" fill=\"#4D98CB\" />\n<path class=\"p-575F64\" d=\"M3.43206 6.78811L0.693993 4.05004C-0.231331 3.12472 -0.231331 1.61932 0.693993 0.693993C1.61932 -0.231331 3.12472 -0.231331 4.05004 0.693993L6.78811 3.43206L3.43206 6.78811Z\" fill=\"#58ADE5\" />\n</symbol>"
});
var svg_cat_sport_water_result = browser_sprite_build_default.a.add(svg_cat_sport_water_symbol);
/* harmony default export */ var svg_cat_sport_water = (svg_cat_sport_water_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-welness.svg


var svg_cat_sport_welness_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-welness",
  "use": "svg-cat-sport-welness-usage",
  "viewBox": "0 0 32 32",
  "content": "<symbol viewBox=\"0 0 32 32\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-welness\">\n<path class=\"p-4A696F\" d=\"M12.7207 11.3245L14.0466 9.99878L22.0015 17.9537L20.6758 19.2794L12.7207 11.3245Z\" fill=\"#5FBEFF\" />\n<path class=\"p-384949\" d=\"M20.6748 19.2801L16.6973 15.3025L18.0232 13.9766L22.0005 17.9541L20.6748 19.2801Z\" fill=\"#4D98CB\" />\n<path class=\"p-C6E2E7\" d=\"M28.6852 12.5953L19.0841 22.1967L5.77271 27.447L4.55273 26.2272L10.0684 12.6507L19.4044 3.3147L20.7303 4.64039L11.5269 13.8438L7.11184 24.8881L18.1561 20.473L27.3595 11.2696L28.6852 12.5953Z\" fill=\"#A1D1FD\" />\n<path class=\"p-A8D3D8\" d=\"M28.6855 12.595L19.0843 22.1964L5.77295 27.4467L5.16309 26.8368L7.11208 24.8878L18.1563 20.4727L27.3598 11.2693L28.6855 12.595Z\" fill=\"#65B3E7\" />\n<path class=\"p-979FEF\" d=\"M18.7418 3.97745C18.0096 3.24522 18.0096 2.05805 18.7418 1.32583C19.4741 0.593596 20.6612 0.593602 21.3935 1.32584L30.6741 10.6066C31.4063 11.3389 31.4063 12.526 30.6741 13.2583C29.9418 13.9905 28.7546 13.9905 28.0224 13.2583L18.7418 3.97745Z\" fill=\"#5FBEFF\" />\n<path class=\"p-7984EB\" d=\"M23.3828 8.6177L26.0344 5.96606L30.6748 10.6066C31.407 11.3388 31.407 12.526 30.6748 13.2582C29.9425 13.9904 28.7553 13.9904 28.0231 13.2582L23.3828 8.6177Z\" fill=\"#4D98CB\" />\n<path class=\"p-4A696F\" d=\"M6.09111 25.9089C4.99076 24.8083 3.21414 24.8083 2.11354 25.9089L0 28.0225L3.97732 32.0001L6.09111 29.8863C7.1917 28.7859 7.1917 27.0093 6.09111 25.9089Z\" fill=\"#65B3E7\" />\n<path class=\"p-384949\" d=\"M6.09085 29.8863L3.97707 32L1.98828 30.0113L6.09085 25.9087C7.19145 27.0093 7.19145 28.7859 6.09085 29.8863Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_sport_welness_result = browser_sprite_build_default.a.add(svg_cat_sport_welness_symbol);
/* harmony default export */ var svg_cat_sport_welness = (svg_cat_sport_welness_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-sport-winter.svg


var svg_cat_sport_winter_symbol = new browser_symbol_default.a({
  "id": "svg-cat-sport-winter",
  "use": "svg-cat-sport-winter-usage",
  "viewBox": "0 0 32 27",
  "content": "<symbol viewBox=\"0 0 32 27\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-sport-winter\">\n<path class=\"p-CAE8F9\" d=\"M27.6592 19.1534V22.4595H0V0H14.3529V8.47797H16.9831C17.0388 8.47797 17.0941 8.47845 17.1499 8.47918C17.858 8.49033 18.5502 8.57034 19.2193 8.71313C19.8635 8.85156 20.4858 9.04696 21.0812 9.29594C24.1706 10.585 26.5297 13.2852 27.347 16.5877C27.5513 17.41 27.6592 18.269 27.6592 19.1534Z\" fill=\"#B9DFFC\" />\n<path class=\"p-7FC8F1\" d=\"M27.3473 16.5875C26.5301 13.285 24.1709 10.5848 21.0816 9.29576C20.4862 9.04678 19.8638 8.85137 19.2197 8.71294C18.5506 8.57015 17.8584 8.49015 17.1502 8.47899C17.0945 8.47827 17.0392 8.47778 16.9834 8.47778H14.3533V8.47754H14.3525V22.4593H27.6596V19.1532C27.6596 18.2688 27.5517 17.4098 27.3473 16.5875Z\" fill=\"#A1D1FD\" />\n<path class=\"p-CAE8F9\" d=\"M31.0555 21.9657C31.4537 21.9657 31.7765 22.2885 31.7765 22.6867C31.7765 25.0657 29.8414 27.0001 27.4631 27.0001H0V25.1382H6.9659V21.5286H8.8278V25.1382H18.5844V21.5286H20.4463V25.1382H27.4631C28.8149 25.1382 29.9146 24.0385 29.9146 22.6867C29.9146 22.2885 30.2374 21.9657 30.6356 21.9657H31.0555Z\" fill=\"#B9DFFC\" />\n<path class=\"p-3A4DE3\" d=\"M17.149 8.47924V13.0465C17.149 13.5606 16.7322 13.9774 16.2181 13.9774C15.7039 13.9774 15.2871 13.5606 15.2871 13.0465V8.47803H16.9822C17.038 8.47803 17.0933 8.47851 17.149 8.47924Z\" fill=\"#4D98CB\" />\n<path class=\"p-3A4DE3\" d=\"M21.0816 9.29595V13.0464C21.0816 13.5606 20.6648 13.9774 20.1507 13.9774C19.6365 13.9774 19.2197 13.5606 19.2197 13.0464V8.71313C19.8639 8.85157 20.4862 9.04697 21.0816 9.29595Z\" fill=\"#4D98CB\" />\n<path class=\"p-0088FF\" d=\"M0 4.5918H3.74394C4.25809 4.5918 4.67489 5.0086 4.67489 5.52275C4.67489 6.0369 4.25809 6.4537 3.74394 6.4537H0V4.5918Z\" fill=\"#5FBEFF\" />\n<path class=\"p-7FC8F1\" d=\"M7.17969 2.57471H14.3534V7.61191H7.17969V2.57471Z\" fill=\"#65B3E7\" />\n<path class=\"p-7FC8F1\" d=\"M31.0559 21.9657C31.4541 21.9657 31.7769 22.2885 31.7769 22.6867C31.7769 25.0657 29.8417 27.0001 27.4634 27.0001H14.3525V25.1382H18.5847V21.5286H20.4466V25.1382H27.4634C28.8153 25.1382 29.915 24.0385 29.915 22.6867C29.915 22.2885 30.2378 21.9657 30.636 21.9657H31.0559Z\" fill=\"#65B3E7\" />\n<path class=\"p-CAE8F9\" d=\"M14.3525 2.57471H14.3533V8.47074H14.3525V2.57471Z\" fill=\"#CAE8F9\" />\n<path class=\"p-0088FF\" d=\"M27.6592 19.1535V22.4596H0V12.5481H0.0572148C3.0319 12.5481 4.88677 13.7583 5.92779 14.7911C6.59618 15.4539 7.01681 16.1199 7.26143 16.5878H27.347C27.5513 17.4101 27.6592 18.2691 27.6592 19.1535Z\" fill=\"#5FBEFF\" />\n<path class=\"p-3A4DE3\" d=\"M27.6596 19.1536V22.4597H14.3525V16.5879H27.3473C27.5517 17.4102 27.6596 18.2692 27.6596 19.1536Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_sport_winter_result = browser_sprite_build_default.a.add(svg_cat_sport_winter_symbol);
/* harmony default export */ var svg_cat_sport_winter = (svg_cat_sport_winter_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-underwear-men.svg


var svg_cat_underwear_men_symbol = new browser_symbol_default.a({
  "id": "svg-cat-underwear-men",
  "use": "svg-cat-underwear-men-usage",
  "viewBox": "0 0 37 44",
  "content": "<symbol viewBox=\"0 0 37 44\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-underwear-men\">\n<path class=\"p-EDEAE4\" d=\"M24.4768 0.856342V22.147C24.4768 23.0554 24.1159 23.9266 23.4736 24.569L17.1896 30.853C15.0227 33.0198 15.0227 36.533 17.1896 38.6998C19.3519 40.8621 22.856 40.8673 25.0247 38.7115L34.4441 29.3424C35.7376 28.0565 36.4649 26.308 36.4649 24.484V0.856342C36.465 0.383367 36.0817 0 35.6088 0H25.3331C24.8602 0 24.4768 0.383367 24.4768 0.856342Z\" fill=\"#B9DFFC\" />\n<path class=\"p-DDDAD0\" d=\"M23.5486 27.2241V24.49C23.5238 24.5164 23.4994 24.5431 23.4736 24.5688L18.1246 29.9178C16.2304 31.812 15.0572 35.6701 16.4749 37.8231L21.0225 33.2969C22.628 31.7012 23.5486 29.4877 23.5486 27.2241Z\" fill=\"#76B7E2\" />\n<path class=\"p-DDDAD0\" d=\"M34.3956 0V24.484C34.3956 26.3079 33.6683 28.0565 32.3748 29.3423L22.9554 38.7114C22.1385 39.5235 21.1319 40.0286 20.0791 40.2276C21.815 40.5551 23.6772 40.0504 25.0242 38.7114L34.4436 29.3423C35.7371 28.0565 36.4645 26.3079 36.4645 24.484V0.856342C36.4645 0.383367 36.0811 0 35.6082 0H34.3956Z\" fill=\"#A1D1FD\" />\n<path class=\"p-6EC030\" d=\"M36.4648 20.8128C36.4032 20.8107 36.3418 20.8081 36.2798 20.8081C33.2058 20.8081 30.7139 22.3651 30.7139 25.439C30.7139 27.2626 31.5909 29.8162 32.9459 30.8313L34.4439 29.3422C35.7375 28.0564 36.4648 26.3078 36.4648 24.4839V20.8128Z\" fill=\"#76B7E2\" />\n<path class=\"p-378900\" d=\"M34.3965 21.0373V24.4839C34.3965 26.3079 33.6692 28.0564 32.3756 29.3423L31.9033 29.8118C32.2051 30.1954 32.5558 30.5386 32.9465 30.8314L34.4445 29.3423C35.7381 28.0564 36.4654 26.3079 36.4654 24.4839V20.8128C36.4038 20.8107 36.3424 20.8081 36.2804 20.8081C35.619 20.8081 34.9849 20.8256 34.3965 21.0373Z\" fill=\"#4D98CB\" />\n<path class=\"p-6EC030\" d=\"M36.4648 3.68213H24.4766V7.10733H36.4648V3.68213Z\" fill=\"#76B7E2\" />\n<path class=\"p-378900\" d=\"M36.4654 3.68213H34.3965V7.10733H36.4654V3.68213Z\" fill=\"#4D98CB\" />\n<path class=\"p-6EC030\" d=\"M36.4648 10.7039H24.4766V14.1291H36.4648V10.7039Z\" fill=\"#76B7E2\" />\n<path class=\"p-378900\" d=\"M36.4654 10.7039H34.3965V14.1291H36.4654V10.7039Z\" fill=\"#4D98CB\" />\n<path class=\"p-EDEAE4\" d=\"M9.84734 3.59658V24.8872C9.84734 25.7956 9.48644 26.6669 8.84412 27.3092L1.62511 34.5282C-0.541704 36.695 -0.541704 40.2082 1.62511 42.375C3.7874 44.5373 7.29152 44.5425 9.46023 42.3867L19.8146 32.0826C21.1082 30.7968 21.8355 29.0482 21.8355 27.2243V3.59658C21.8355 3.12368 21.4521 2.74023 20.9792 2.74023H10.7037C10.2307 2.74032 9.84734 3.12368 9.84734 3.59658Z\" fill=\"#B9DFFC\" />\n<path class=\"p-DDDAD0\" d=\"M19.7672 2.74032V27.2243C19.7672 29.0482 19.0398 30.7968 17.7463 32.0826L7.3919 42.3867C6.57498 43.1988 5.56846 43.7039 4.51562 43.9029C6.25151 44.2304 8.11371 43.7257 9.46072 42.3867L19.8151 32.0826C21.1086 30.7968 21.836 29.0482 21.836 27.2243V3.59658C21.836 3.12368 21.4526 2.74023 20.9796 2.74023L19.7672 2.74032Z\" fill=\"#A1D1FD\" />\n<path class=\"p-6EC030\" d=\"M21.8359 23.553C21.7743 23.551 21.7129 23.5483 21.6509 23.5483C18.5769 23.5483 16.085 25.1054 16.085 28.1793C16.085 30.0028 16.962 32.5564 18.317 33.5716L19.815 32.0825C21.1086 30.7966 21.8359 29.048 21.8359 27.2241V23.553Z\" fill=\"#76B7E2\" />\n<path class=\"p-378900\" d=\"M19.7666 23.7694V27.2242C19.7666 29.0481 19.0393 30.7967 17.7458 32.0826L17.2734 32.5521C17.5752 32.9357 17.9259 33.2788 18.3166 33.5717L19.8147 32.0826C21.1082 30.7967 21.8355 29.0481 21.8355 27.2242V23.553C21.7739 23.551 21.7126 23.5483 21.6505 23.5483C20.9891 23.5484 20.355 23.5578 19.7666 23.7694Z\" fill=\"#4D98CB\" />\n<path class=\"p-6EC030\" d=\"M21.8359 6.42236H9.84766V9.84757H21.8359V6.42236Z\" fill=\"#76B7E2\" />\n<path class=\"p-378900\" d=\"M21.8365 6.42236H19.7676V9.84757H21.8365V6.42236Z\" fill=\"#4D98CB\" />\n<path class=\"p-6EC030\" d=\"M21.8359 13.4438H9.84766V16.8691H21.8359V13.4438Z\" fill=\"#76B7E2\" />\n<path class=\"p-378900\" d=\"M21.8365 13.4438H19.7676V16.8691H21.8365V13.4438Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_underwear_men_result = browser_sprite_build_default.a.add(svg_cat_underwear_men_symbol);
/* harmony default export */ var svg_cat_underwear_men = (svg_cat_underwear_men_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-women-clothes.svg


var svg_cat_women_clothes_symbol = new browser_symbol_default.a({
  "id": "svg-cat-women-clothes",
  "use": "svg-cat-women-clothes-usage",
  "viewBox": "0 0 34 30",
  "content": "<symbol viewBox=\"0 0 34 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-women-clothes\">\n<path class=\"p-FD2D12\" d=\"M21.6322 6.79162H11.8213V0H21.6322L21.6322 6.79162Z\" fill=\"#A1D1FD\" />\n<path class=\"p-DE0E0E\" d=\"M21.6317 5.88657H16.7432V0H21.6317V5.88657Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF672A\" d=\"M26.0308 7.52651C25.5419 6.47952 24.4908 5.8103 23.3353 5.8103H23.3326H10.1206C8.96357 5.8103 7.91161 6.48102 7.4235 7.52997L0 21.9851L4.63611 24.2512L8.22378 18.3029L7.31873 29.9999H26.1344L25.2294 18.3029L28.8431 24.2713L33.4869 21.982L26.0308 7.52651Z\" fill=\"#5FBEFF\" />\n<path class=\"p-FD2D12\" d=\"M26.0308 7.52651C25.5419 6.47952 24.4908 5.8103 23.3353 5.8103H23.3326H16.7266V29.9999H26.1344L25.2294 18.3029L28.8431 24.2713L33.4869 21.982L26.0308 7.52651Z\" fill=\"#58ADE5\" />\n<path class=\"p-FFFFFF\" d=\"M25.2302 16.1725L22.8366 17.8294L19.7815 15.7146L16.727 17.8294L13.6723 15.7146L10.6178 17.8294L8.22461 16.1725V18.559L10.6178 20.2159L13.6723 18.1012L16.727 20.2159L19.7816 18.1011L22.8366 20.2158L25.2302 18.5589V16.1725Z\" fill=\"white\" />\n<path class=\"p-F2F2F4\" d=\"M22.8355 17.8294L19.7804 15.7146L16.7432 17.8174V20.2039L19.7805 18.1011L22.8355 20.2158L25.2291 18.5589V16.1725L22.8355 17.8294Z\" fill=\"#F2F2F4\" />\n</symbol>"
});
var svg_cat_women_clothes_result = browser_sprite_build_default.a.add(svg_cat_women_clothes_symbol);
/* harmony default export */ var svg_cat_women_clothes = (svg_cat_women_clothes_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-women-gloves.svg


var svg_cat_women_gloves_symbol = new browser_symbol_default.a({
  "id": "svg-cat-women-gloves",
  "use": "svg-cat-women-gloves-usage",
  "viewBox": "0 0 33 28",
  "content": "<symbol viewBox=\"0 0 33 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-women-gloves\">\n<path class=\"p-FF914A\" d=\"M6.78478 18.6666L8.65984 17.875L8.11797 20L6.11807 21.9999C5.74986 22.3681 5.15287 22.3681 4.7847 21.9998C4.41657 21.6316 4.4166 21.0348 4.78476 20.6666L6.78478 18.6666Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF914A\" d=\"M8.78603 24.6667C8.41783 25.0349 7.82084 25.0349 7.45267 24.6667C7.08455 24.2985 7.08458 23.7016 7.45275 23.3334L11.3384 19.448L12.6716 20.7812L8.78603 24.6667Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF914A\" d=\"M12.1188 24.0001L14.1188 23.3333L13.4522 25.3333L11.4522 27.3333C11.084 27.7015 10.4871 27.7015 10.1189 27.3334C9.75069 26.9652 9.75066 26.3682 10.1189 26L12.1188 24.0001Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF6A52\" d=\"M19.7862 5.65685L19.7673 8.54199L16.1093 11.2194L16.0904 11.2005L12.0928 7.97606L12.4323 5.65685L16.0904 3.9409L16.4486 3.77124L19.7862 5.65685Z\" fill=\"#65B3E7\" />\n<path class=\"p-F0384A\" d=\"M19.7867 5.65685L19.7678 8.54199L16.1097 11.2194L16.0908 11.2005V3.9409L16.449 3.77124L19.7867 5.65685Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF6A52\" d=\"M25.443 0L23.9909 3.35654L19.7861 5.65684H12.4322L7.96323 3.05479L6.77539 0H25.443Z\" fill=\"#65B3E7\" />\n<path class=\"p-F0384A\" d=\"M25.4435 0L23.9915 3.35654L19.7867 5.65684H16.0908V0H25.4435Z\" fill=\"#4D98CB\" />\n<path class=\"p-FF914A\" d=\"M14.7852 10.6667L21.4516 17.3334L28.1185 10.6664L26.5823 5.35921L21.4518 4L14.7852 10.6667Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF914A\" d=\"M13.4516 25.3335L6.78516 18.6668L10.785 14.667L17.4516 21.3334L13.4516 25.3335Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFB64C\" d=\"M20.1175 24.0001L22.1174 26C22.4856 26.3682 22.4856 26.9652 22.1173 27.3334C21.7491 27.7015 21.1522 27.7015 20.7841 27.3333L18.784 25.3333L18.1592 23.2917L20.1175 24.0001Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFB64C\" d=\"M22.7854 21.3331L24.7855 23.3333C25.1536 23.7015 25.1536 24.2984 24.7855 24.6665C24.4173 25.0347 23.8204 25.0347 23.4522 24.6666L21.452 22.6665L20.8271 20.6248L22.7854 21.3331Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFB64C\" d=\"M25.4509 18.6666L27.451 20.6666C27.8191 21.0348 27.8192 21.6317 27.451 21.9999C27.0829 22.3681 26.4859 22.3681 26.1177 21.9999L24.1178 20L23.4092 18.0415L25.4509 18.6666Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF6A52\" d=\"M25.452 0L21.4521 4.00005L28.1188 10.6665L32.1815 6.53679L25.452 0Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFB64C\" d=\"M25.4435 18.6675L18.7872 25.3426L4.11719 10.6726L5.56896 5.44933L10.7922 3.99756L16.0908 9.29594L25.4435 18.6675Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FFB64C\" d=\"M25.4435 18.6675L18.7871 25.3425L16.0908 22.6462V9.2959L25.4435 18.6675Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FF914A\" d=\"M6.78502 0L0 6.53679L4.1184 10.6667L10.7851 4.00005L6.78502 0Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_women_gloves_result = browser_sprite_build_default.a.add(svg_cat_women_gloves_symbol);
/* harmony default export */ var svg_cat_women_gloves = (svg_cat_women_gloves_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-women-homewear.svg


var svg_cat_women_homewear_symbol = new browser_symbol_default.a({
  "id": "svg-cat-women-homewear",
  "use": "svg-cat-women-homewear-usage",
  "viewBox": "0 0 37 30",
  "content": "<symbol viewBox=\"0 0 37 30\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-women-homewear\">\n<path class=\"p-EBEBEC\" d=\"M18.5 0H12.409C11.4911 0 10.6123 0.371763 9.97303 1.03051L0 10.893L4.55721 15.3997L10.973 9.055V30H15.3316C17.0814 30 18.5 28.5971 18.5 26.8667C18.5 28.5971 19.9186 30 21.6684 30H26.027V7.52704C26.027 3.37 22.657 3.94473e-05 18.5 0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-CACACD\" d=\"M27.027 1.03051C26.3877 0.371763 25.5089 0 24.591 0H18.5V26.8667C18.5 28.5971 19.9186 30 21.6684 30H26.027V9.055L32.4428 15.3997L37 10.893L27.027 1.03051Z\" fill=\"#65B3E7\" />\n<path class=\"p-64DDE0\" d=\"M1.4948 9.41469L6.05176 13.9211L7.58473 12.4052L3.02777 7.89871L1.4948 9.41469Z\" fill=\"#B9DFFC\" />\n<path class=\"p-A9A8AE\" d=\"M18.4997 0H14.9688L18.4997 10.8292L22.0307 0H18.4997Z\" fill=\"#58ADE5\" />\n<path class=\"p-808081\" d=\"M18.5 0V9.84025L22.031 0H18.5Z\" fill=\"#4D98CB\" />\n<path class=\"p-A9A8AE\" d=\"M20.9898 0H24.1141C24.9216 0 25.3961 0.907668 24.9352 1.57074L18.5 10.8292L20.9898 0Z\" fill=\"#A1D1FD\" />\n<path class=\"p-00C2C7\" d=\"M33.972 7.89809L29.415 12.4045L30.948 13.9205L35.505 9.41407L33.972 7.89809Z\" fill=\"#A1D1FD\" />\n<path class=\"p-00A5AD\" d=\"M24.2686 13.5281H22.1006V20.8861H24.2686V13.5281Z\" fill=\"#4D98CB\" />\n<path class=\"p-64DDE0\" d=\"M26.0263 12.8486H10.9727V14.9926H26.0263V12.8486Z\" fill=\"#B9DFFC\" />\n<path class=\"p-00C2C7\" d=\"M26.0272 12.8486H18.5V14.9926H26.0272V12.8486Z\" fill=\"#A1D1FD\" />\n<path class=\"p-CACACD\" d=\"M16.0099 0H12.8856C12.078 0 11.6035 0.907669 12.0644 1.57074L18.4996 10.8292L16.0099 0Z\" fill=\"#B9DFFC\" />\n<path class=\"p-64DDE0\" d=\"M23.1846 12.8486H21.0166V20.2066H23.1846V12.8486Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_women_homewear_result = browser_sprite_build_default.a.add(svg_cat_women_homewear_symbol);
/* harmony default export */ var svg_cat_women_homewear = (svg_cat_women_homewear_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-women-outwear.svg


var svg_cat_women_outwear_symbol = new browser_symbol_default.a({
  "id": "svg-cat-women-outwear",
  "use": "svg-cat-women-outwear-usage",
  "viewBox": "0 0 34 34",
  "content": "<symbol viewBox=\"0 0 34 34\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-women-outwear\">\n<path class=\"p-5BC980\" d=\"M3.9844 13.9455L14.8084 10.3601L13.9768 4.39697L1.26026 9.45941C0.499338 9.76233 0 10.4986 0 11.3176V15.9377L1.86769 17.9299L3.9844 15.9377V13.9455Z\" fill=\"#65B3E7\" />\n<path class=\"p-00A38B\" d=\"M34.0001 11.3177C34.0001 10.4986 33.5006 9.76228 32.7395 9.45943L21.0534 4.80933L20.9844 10.9571L30.0157 13.9454V15.9376L31.9456 17.9298L34.0001 15.9376V11.3177Z\" fill=\"#4D98CB\" />\n<path class=\"p-5BC980\" d=\"M28.1161 33.9999H5.88281L6.73961 27.8905L10.0267 23.9061L7.87501 19.9217L9.68822 7.29126H24.3106L26.1239 19.9217L23.9721 23.9061L27.2593 27.8905L28.1161 33.9999Z\" fill=\"#65B3E7\" />\n<path class=\"p-00A38B\" d=\"M28.1166 33.9999H17V7.29126H24.3112L26.1244 19.9217L23.9727 23.9061L27.2598 27.8905L28.1166 33.9999Z\" fill=\"#4D98CB\" />\n<path class=\"p-5BC980\" d=\"M30.0156 15.9375H34V19.9219H30.0156V15.9375Z\" fill=\"#65B3E7\" />\n<path class=\"p-81EAAC\" d=\"M0 15.0188H3.9844V19.0032H0V15.0188Z\" fill=\"#B9DFFC\" />\n<path class=\"p-81EAAC\" d=\"M14.0118 19.9219H7.88265L6.74414 27.8907H14.0118V19.9219Z\" fill=\"#B9DFFC\" />\n<path class=\"p-5BC980\" d=\"M19.9883 27.8907H27.2559L26.1174 19.9219H19.9883V27.8907Z\" fill=\"#65B3E7\" />\n<path class=\"p-FFD396\" d=\"M8.90846 3.69473C8.2343 4.36889 8.12974 5.42518 8.65862 6.21843L17 18.7293L16.3572 7.50472L12.6032 0L8.90846 3.69473Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FFB64C\" d=\"M21.3968 0L17.5629 9.83726L17 18.7293L25.3414 6.21843C25.8703 5.42518 25.7657 4.36889 25.0916 3.69473L21.3968 0Z\" fill=\"#5FBEFF\" />\n<path class=\"p-5BC980\" d=\"M21.4033 0L17.0005 18.7267L12.5977 0H21.4033Z\" fill=\"#65B3E7\" />\n<path class=\"p-00A38B\" d=\"M21.4028 0L17 18.7267V0H21.4028Z\" fill=\"#4D98CB\" />\n</symbol>"
});
var svg_cat_women_outwear_result = browser_sprite_build_default.a.add(svg_cat_women_outwear_symbol);
/* harmony default export */ var svg_cat_women_outwear = (svg_cat_women_outwear_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-women-shoes.svg


var svg_cat_women_shoes_symbol = new browser_symbol_default.a({
  "id": "svg-cat-women-shoes",
  "use": "svg-cat-women-shoes-usage",
  "viewBox": "0 0 31 25",
  "content": "<symbol viewBox=\"0 0 31 25\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-women-shoes\">\n<path class=\"p-AE2538\" d=\"M21.5883 1.78564H15.2981C14.805 1.78564 14.4053 2.18539 14.4053 2.6785C14.4053 3.17161 14.805 3.57136 15.2981 3.57136H21.5883V1.78564Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FF637B\" d=\"M24.2262 0H22.0833L12.5654 17.5179C12.0297 18.5 10.7262 19.0178 9.7797 18.4107C8.86911 17.8393 9.04762 17.1786 9.04762 16.0714H8.15476C7.85125 16.0714 7.54756 16.0893 7.2619 16.1249C4.08327 16.4821 1.42256 18.7679 0.636845 21.9464C0.308397 23.5213 1.51056 25 3.11933 25H11.1905C13.494 25 15.619 23.7321 16.7083 21.6786L21.869 11.9643L22.4762 25H26.9048V11.2202C26.9048 9.09522 27.9226 8.07137 30.4762 6.80357V6.25C30.4762 2.80357 27.6726 0 24.2262 0Z\" fill=\"#58ADE5\" />\n<path class=\"p-E63950\" d=\"M30.476 6.25V6.80357C27.9224 8.07137 26.9046 9.09522 26.9046 11.2202V25H22.4761L21.8689 11.9643L16.7081 21.6786C15.6189 23.7321 13.4939 25 11.1903 25H7.26172V16.1249C7.54737 16.0893 7.85106 16.0714 8.15458 16.0714H9.04743C9.04743 17.1786 8.86892 17.8393 9.77952 18.4107C10.726 19.0178 12.0295 18.5 12.5652 17.5179L22.0831 0H24.226C27.6724 0 30.476 2.80357 30.476 6.25Z\" fill=\"#4D98CB\" />\n<path class=\"p-FFDA2D\" d=\"M7.26186 12.5C5.26186 12.5 3.69043 13.6785 3.69043 15.1786C3.69043 16.6785 5.26186 17.8571 7.26186 17.8571C9.26186 17.8571 10.8333 16.6785 10.8333 15.1786C10.8333 13.6785 9.26186 12.5 7.26186 12.5Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FDBF00\" d=\"M10.8331 15.1786C10.8331 16.6785 9.26172 17.8571 7.26172 17.8571V12.5C9.26172 12.5 10.8331 13.6785 10.8331 15.1786Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_women_shoes_result = browser_sprite_build_default.a.add(svg_cat_women_shoes_symbol);
/* harmony default export */ var svg_cat_women_shoes = (svg_cat_women_shoes_symbol);
// CONCATENATED MODULE: ./src/icons/svg-cat-women-underwear.svg


var svg_cat_women_underwear_symbol = new browser_symbol_default.a({
  "id": "svg-cat-women-underwear",
  "use": "svg-cat-women-underwear-usage",
  "viewBox": "0 0 31 28",
  "content": "<symbol viewBox=\"0 0 31 28\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-cat-women-underwear\">\n<path class=\"p-FC756B\" d=\"M24.7248 1.03306V4.4446C22.9239 4.88163 20.798 5.19866 18.4749 5.35748C17.547 5.42041 16.8247 6.1886 16.8247 7.11795L16.8259 14.6963C15.6997 14.9462 14.4941 14.9635 13.2935 14.6974L13.2947 7.11795C13.2947 6.1886 12.5723 5.42041 11.6445 5.35748C9.319 5.19866 7.1902 4.88104 5.38867 4.44342V1.03247C11.0217 2.39885 19.0683 2.41003 24.7248 1.03306Z\" fill=\"#65B3E7\" />\n<path class=\"p-FE4F34\" d=\"M15.0605 2.06112V14.8897C15.6624 14.8894 16.2548 14.8228 16.8267 14.6959L16.8255 7.11761C16.8255 6.18826 17.5479 5.42007 18.4757 5.35714C20.7988 5.19832 22.9247 4.88129 24.7257 4.44426V1.03271C21.9007 1.72038 18.4795 2.06176 15.0605 2.06112Z\" fill=\"#4D98CB\" />\n<path class=\"p-FEC356\" d=\"M25.4323 24.5814C3.24221 24.5814 4.60859 24.6071 4.43777 24.5285C4.24585 24.4408 4.05927 24.3432 3.87793 24.2367V27.1177C3.87793 27.6047 4.27296 28 4.76099 28H25.4217C25.9092 28 26.3048 27.6047 26.3048 27.1177V24.1956C26.1102 24.3137 25.6596 24.5814 25.4323 24.5814Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FEB020\" d=\"M25.4327 24.5814C21.1623 24.5814 17.765 24.5824 15.0605 24.5834V28H25.4221C25.9096 28 26.3052 27.6047 26.3052 27.1177V24.1956C26.1105 24.3137 25.66 24.5814 25.4327 24.5814Z\" fill=\"#A1D1FD\" />\n<path class=\"p-FE4E33\" d=\"M27.9109 10.788C26.1614 7.26996 26.1977 6.48324 26.1977 4.76665H25.8898C25.3498 11.0892 20.7355 16.0671 15.0579 16.0671C9.39402 16.0671 4.76598 7.34013 4.2259 1.0022C3.53607 1.0022 2.99462 1.56116 3.05597 2.24825C3.24807 4.39979 3.62492 7.94048 2.20362 10.791C1.17098 12.8632 0 15.2118 0 18.3222C0 21.6291 1.69377 24.54 4.31536 25.737C4.5747 25.856 3.23826 25.817 25.433 25.817C26.3544 25.817 30.1156 23.385 30.1156 18.3222C30.1156 15.2195 28.9441 12.8649 27.9109 10.788Z\" fill=\"#58ADE5\" />\n<path class=\"p-FE1600\" d=\"M27.9107 10.788C26.4907 7.93267 26.8671 4.39678 27.0593 2.24819C27.1208 1.56111 26.5794 1.0022 25.8896 1.0022C25.3497 7.32366 20.7369 16.0653 15.0605 16.067V25.8199C17.7671 25.8184 21.1643 25.817 25.4327 25.817C26.3542 25.817 30.1154 23.3849 30.1154 18.3222C30.1154 15.2195 28.9439 12.8649 27.9107 10.788Z\" fill=\"#4D98CB\" />\n<path class=\"p-FEC356\" d=\"M15.059 16.3607C9.19185 16.3607 4.41516 11.1995 3.92167 4.64352C3.91778 4.59258 3.9192 4.82597 3.9192 0.882294C3.9192 0.395033 4.31458 0 4.80225 0C5.28993 0 5.68537 0.395033 5.68537 0.882294V4.5437C6.12417 10.1834 10.2361 14.5961 15.059 14.5961C19.8813 14.5961 23.9933 10.1834 24.4327 4.54364V0.882294C24.4327 0.395033 24.8281 0 25.3158 0C25.8036 0 26.1989 0.395033 26.1989 0.882294C26.1989 4.82603 26.2003 4.59264 26.1964 4.64357C25.7023 11.1975 20.9278 16.3607 15.059 16.3607Z\" fill=\"#B9DFFC\" />\n<path class=\"p-FEB020\" d=\"M26.1975 0.882294C26.1975 0.395033 25.8021 0 25.3144 0C24.8267 0 24.4313 0.395033 24.4313 0.882294V4.54364C23.992 10.1823 19.8815 14.5943 15.0605 14.5961V16.3607C20.9279 16.359 25.701 11.1964 26.195 4.64363C26.1989 4.59264 26.1975 4.82597 26.1975 0.882294Z\" fill=\"#A1D1FD\" />\n</symbol>"
});
var svg_cat_women_underwear_result = browser_sprite_build_default.a.add(svg_cat_women_underwear_symbol);
/* harmony default export */ var svg_cat_women_underwear = (svg_cat_women_underwear_symbol);
// CONCATENATED MODULE: ./src/icons/svg-search.svg


var svg_search_symbol = new browser_symbol_default.a({
  "id": "svg-search",
  "use": "svg-search-usage",
  "viewBox": "0 0 20 20",
  "content": "<symbol viewBox=\"0 0 20 20\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" id=\"svg-search\">\n<path fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M12.1875 4.0625C14.4312 6.30616 14.4312 9.94384 12.1875 12.1875C9.94384 14.4312 6.30616 14.4312 4.0625 12.1875C1.81884 9.94384 1.81884 6.30616 4.0625 4.0625C6.30616 1.81884 9.94384 1.81884 12.1875 4.0625ZM10.9373 5.3125C12.4906 6.8658 12.4906 9.3842 10.9373 10.9375C9.384 12.4908 6.8656 12.4908 5.3123 10.9375C3.759 9.3842 3.759 6.8658 5.3123 5.3125C6.8656 3.7592 9.384 3.7592 10.9373 5.3125Z\" fill=\"#318CCA\" />\n<rect x=\"10.3125\" y=\"11.5625\" width=\"1.76777\" height=\"7.07107\" rx=\"0.883883\" transform=\"rotate(-45 10.3125 11.5625)\" fill=\"#318CCA\" />\n<circle cx=\"5\" cy=\"10\" r=\"5\" fill=\"#318CCA\" fill-opacity=\"0.35\" />\n</symbol>"
});
var svg_search_result = browser_sprite_build_default.a.add(svg_search_symbol);
/* harmony default export */ var svg_search = (svg_search_symbol);
// CONCATENATED MODULE: ./src/icons/icons.js
// импорт нужных svg иконок для склейки в будущий sprite















































































































































/***/ }),

/***/ "./src/styles/common.scss":
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__("./node_modules/mini-css-extract-plugin/dist/loader.js!./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js!./node_modules/sass-loader/lib/loader.js!./src/styles/common.scss");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__("./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./src/icons/icons.js");
module.exports = __webpack_require__("./src/styles/common.scss");


/***/ })

/******/ });