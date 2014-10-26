/* Zepto v1.1.4 - zepto event ajax form ie - zeptojs.com/license */
var Zepto=function(){function L(t){return null==t?String(t):j[S.call(t)]||"object"}function Z(t){return"function"==L(t)}function $(t){return null!=t&&t==t.window}function _(t){return null!=t&&t.nodeType==t.DOCUMENT_NODE}function D(t){return"object"==L(t)}function R(t){return D(t)&&!$(t)&&Object.getPrototypeOf(t)==Object.prototype}function M(t){return"number"==typeof t.length}function k(t){return s.call(t,function(t){return null!=t})}function z(t){return t.length>0?n.fn.concat.apply([],t):t}function F(t){return t.replace(/::/g,"/").replace(/([A-Z]+)([A-Z][a-z])/g,"$1_$2").replace(/([a-z\d])([A-Z])/g,"$1_$2").replace(/_/g,"-").toLowerCase()}function q(t){return t in f?f[t]:f[t]=new RegExp("(^|\\s)"+t+"(\\s|$)")}function H(t,e){return"number"!=typeof e||c[F(t)]?e:e+"px"}function I(t){var e,n;return u[t]||(e=a.createElement(t),a.body.appendChild(e),n=getComputedStyle(e,"").getPropertyValue("display"),e.parentNode.removeChild(e),"none"==n&&(n="block"),u[t]=n),u[t]}function V(t){return"children"in t?o.call(t.children):n.map(t.childNodes,function(t){return 1==t.nodeType?t:void 0})}function B(n,i,r){for(e in i)r&&(R(i[e])||A(i[e]))?(R(i[e])&&!R(n[e])&&(n[e]={}),A(i[e])&&!A(n[e])&&(n[e]=[]),B(n[e],i[e],r)):i[e]!==t&&(n[e]=i[e])}function U(t,e){return null==e?n(t):n(t).filter(e)}function J(t,e,n,i){return Z(e)?e.call(t,n,i):e}function X(t,e,n){null==n?t.removeAttribute(e):t.setAttribute(e,n)}function W(e,n){var i=e.className,r=i&&i.baseVal!==t;return n===t?r?i.baseVal:i:void(r?i.baseVal=n:e.className=n)}function Y(t){var e;try{return t?"true"==t||("false"==t?!1:"null"==t?null:/^0/.test(t)||isNaN(e=Number(t))?/^[\[\{]/.test(t)?n.parseJSON(t):t:e):t}catch(i){return t}}function G(t,e){e(t);for(var n=0,i=t.childNodes.length;i>n;n++)G(t.childNodes[n],e)}var t,e,n,i,C,N,r=[],o=r.slice,s=r.filter,a=window.document,u={},f={},c={"column-count":1,columns:1,"font-weight":1,"line-height":1,opacity:1,"z-index":1,zoom:1},l=/^\s*<(\w+|!)[^>]*>/,h=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,p=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,d=/^(?:body|html)$/i,m=/([A-Z])/g,g=["val","css","html","text","data","width","height","offset"],v=["after","prepend","before","append"],y=a.createElement("table"),x=a.createElement("tr"),b={tr:a.createElement("tbody"),tbody:y,thead:y,tfoot:y,td:x,th:x,"*":a.createElement("div")},w=/complete|loaded|interactive/,E=/^[\w-]*$/,j={},S=j.toString,T={},O=a.createElement("div"),P={tabindex:"tabIndex",readonly:"readOnly","for":"htmlFor","class":"className",maxlength:"maxLength",cellspacing:"cellSpacing",cellpadding:"cellPadding",rowspan:"rowSpan",colspan:"colSpan",usemap:"useMap",frameborder:"frameBorder",contenteditable:"contentEditable"},A=Array.isArray||function(t){return t instanceof Array};return T.matches=function(t,e){if(!e||!t||1!==t.nodeType)return!1;var n=t.webkitMatchesSelector||t.mozMatchesSelector||t.oMatchesSelector||t.matchesSelector;if(n)return n.call(t,e);var i,r=t.parentNode,o=!r;return o&&(r=O).appendChild(t),i=~T.qsa(r,e).indexOf(t),o&&O.removeChild(t),i},C=function(t){return t.replace(/-+(.)?/g,function(t,e){return e?e.toUpperCase():""})},N=function(t){return s.call(t,function(e,n){return t.indexOf(e)==n})},T.fragment=function(e,i,r){var s,u,f;return h.test(e)&&(s=n(a.createElement(RegExp.$1))),s||(e.replace&&(e=e.replace(p,"<$1></$2>")),i===t&&(i=l.test(e)&&RegExp.$1),i in b||(i="*"),f=b[i],f.innerHTML=""+e,s=n.each(o.call(f.childNodes),function(){f.removeChild(this)})),R(r)&&(u=n(s),n.each(r,function(t,e){g.indexOf(t)>-1?u[t](e):u.attr(t,e)})),s},T.Z=function(t,e){return t=t||[],t.__proto__=n.fn,t.selector=e||"",t},T.isZ=function(t){return t instanceof T.Z},T.init=function(e,i){var r;if(!e)return T.Z();if("string"==typeof e)if(e=e.trim(),"<"==e[0]&&l.test(e))r=T.fragment(e,RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=T.qsa(a,e)}else{if(Z(e))return n(a).ready(e);if(T.isZ(e))return e;if(A(e))r=k(e);else if(D(e))r=[e],e=null;else if(l.test(e))r=T.fragment(e.trim(),RegExp.$1,i),e=null;else{if(i!==t)return n(i).find(e);r=T.qsa(a,e)}}return T.Z(r,e)},n=function(t,e){return T.init(t,e)},n.extend=function(t){var e,n=o.call(arguments,1);return"boolean"==typeof t&&(e=t,t=n.shift()),n.forEach(function(n){B(t,n,e)}),t},T.qsa=function(t,e){var n,i="#"==e[0],r=!i&&"."==e[0],s=i||r?e.slice(1):e,a=E.test(s);return _(t)&&a&&i?(n=t.getElementById(s))?[n]:[]:1!==t.nodeType&&9!==t.nodeType?[]:o.call(a&&!i?r?t.getElementsByClassName(s):t.getElementsByTagName(e):t.querySelectorAll(e))},n.contains=a.documentElement.contains?function(t,e){return t!==e&&t.contains(e)}:function(t,e){for(;e&&(e=e.parentNode);)if(e===t)return!0;return!1},n.type=L,n.isFunction=Z,n.isWindow=$,n.isArray=A,n.isPlainObject=R,n.isEmptyObject=function(t){var e;for(e in t)return!1;return!0},n.inArray=function(t,e,n){return r.indexOf.call(e,t,n)},n.camelCase=C,n.trim=function(t){return null==t?"":String.prototype.trim.call(t)},n.uuid=0,n.support={},n.expr={},n.map=function(t,e){var n,r,o,i=[];if(M(t))for(r=0;r<t.length;r++)n=e(t[r],r),null!=n&&i.push(n);else for(o in t)n=e(t[o],o),null!=n&&i.push(n);return z(i)},n.each=function(t,e){var n,i;if(M(t)){for(n=0;n<t.length;n++)if(e.call(t[n],n,t[n])===!1)return t}else for(i in t)if(e.call(t[i],i,t[i])===!1)return t;return t},n.grep=function(t,e){return s.call(t,e)},window.JSON&&(n.parseJSON=JSON.parse),n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(t,e){j["[object "+e+"]"]=e.toLowerCase()}),n.fn={forEach:r.forEach,reduce:r.reduce,push:r.push,sort:r.sort,indexOf:r.indexOf,concat:r.concat,map:function(t){return n(n.map(this,function(e,n){return t.call(e,n,e)}))},slice:function(){return n(o.apply(this,arguments))},ready:function(t){return w.test(a.readyState)&&a.body?t(n):a.addEventListener("DOMContentLoaded",function(){t(n)},!1),this},get:function(e){return e===t?o.call(this):this[e>=0?e:e+this.length]},toArray:function(){return this.get()},size:function(){return this.length},remove:function(){return this.each(function(){null!=this.parentNode&&this.parentNode.removeChild(this)})},each:function(t){return r.every.call(this,function(e,n){return t.call(e,n,e)!==!1}),this},filter:function(t){return Z(t)?this.not(this.not(t)):n(s.call(this,function(e){return T.matches(e,t)}))},add:function(t,e){return n(N(this.concat(n(t,e))))},is:function(t){return this.length>0&&T.matches(this[0],t)},not:function(e){var i=[];if(Z(e)&&e.call!==t)this.each(function(t){e.call(this,t)||i.push(this)});else{var r="string"==typeof e?this.filter(e):M(e)&&Z(e.item)?o.call(e):n(e);this.forEach(function(t){r.indexOf(t)<0&&i.push(t)})}return n(i)},has:function(t){return this.filter(function(){return D(t)?n.contains(this,t):n(this).find(t).size()})},eq:function(t){return-1===t?this.slice(t):this.slice(t,+t+1)},first:function(){var t=this[0];return t&&!D(t)?t:n(t)},last:function(){var t=this[this.length-1];return t&&!D(t)?t:n(t)},find:function(t){var e,i=this;return e=t?"object"==typeof t?n(t).filter(function(){var t=this;return r.some.call(i,function(e){return n.contains(e,t)})}):1==this.length?n(T.qsa(this[0],t)):this.map(function(){return T.qsa(this,t)}):[]},closest:function(t,e){var i=this[0],r=!1;for("object"==typeof t&&(r=n(t));i&&!(r?r.indexOf(i)>=0:T.matches(i,t));)i=i!==e&&!_(i)&&i.parentNode;return n(i)},parents:function(t){for(var e=[],i=this;i.length>0;)i=n.map(i,function(t){return(t=t.parentNode)&&!_(t)&&e.indexOf(t)<0?(e.push(t),t):void 0});return U(e,t)},parent:function(t){return U(N(this.pluck("parentNode")),t)},children:function(t){return U(this.map(function(){return V(this)}),t)},contents:function(){return this.map(function(){return o.call(this.childNodes)})},siblings:function(t){return U(this.map(function(t,e){return s.call(V(e.parentNode),function(t){return t!==e})}),t)},empty:function(){return this.each(function(){this.innerHTML=""})},pluck:function(t){return n.map(this,function(e){return e[t]})},show:function(){return this.each(function(){"none"==this.style.display&&(this.style.display=""),"none"==getComputedStyle(this,"").getPropertyValue("display")&&(this.style.display=I(this.nodeName))})},replaceWith:function(t){return this.before(t).remove()},wrap:function(t){var e=Z(t);if(this[0]&&!e)var i=n(t).get(0),r=i.parentNode||this.length>1;return this.each(function(o){n(this).wrapAll(e?t.call(this,o):r?i.cloneNode(!0):i)})},wrapAll:function(t){if(this[0]){n(this[0]).before(t=n(t));for(var e;(e=t.children()).length;)t=e.first();n(t).append(this)}return this},wrapInner:function(t){var e=Z(t);return this.each(function(i){var r=n(this),o=r.contents(),s=e?t.call(this,i):t;o.length?o.wrapAll(s):r.append(s)})},unwrap:function(){return this.parent().each(function(){n(this).replaceWith(n(this).children())}),this},clone:function(){return this.map(function(){return this.cloneNode(!0)})},hide:function(){return this.css("display","none")},toggle:function(e){return this.each(function(){var i=n(this);(e===t?"none"==i.css("display"):e)?i.show():i.hide()})},prev:function(t){return n(this.pluck("previousElementSibling")).filter(t||"*")},next:function(t){return n(this.pluck("nextElementSibling")).filter(t||"*")},html:function(t){return 0 in arguments?this.each(function(e){var i=this.innerHTML;n(this).empty().append(J(this,t,e,i))}):0 in this?this[0].innerHTML:null},text:function(t){return 0 in arguments?this.each(function(e){var n=J(this,t,e,this.textContent);this.textContent=null==n?"":""+n}):0 in this?this[0].textContent:null},attr:function(n,i){var r;return"string"!=typeof n||1 in arguments?this.each(function(t){if(1===this.nodeType)if(D(n))for(e in n)X(this,e,n[e]);else X(this,n,J(this,i,t,this.getAttribute(n)))}):this.length&&1===this[0].nodeType?!(r=this[0].getAttribute(n))&&n in this[0]?this[0][n]:r:t},removeAttr:function(t){return this.each(function(){1===this.nodeType&&X(this,t)})},prop:function(t,e){return t=P[t]||t,1 in arguments?this.each(function(n){this[t]=J(this,e,n,this[t])}):this[0]&&this[0][t]},data:function(e,n){var i="data-"+e.replace(m,"-$1").toLowerCase(),r=1 in arguments?this.attr(i,n):this.attr(i);return null!==r?Y(r):t},val:function(t){return 0 in arguments?this.each(function(e){this.value=J(this,t,e,this.value)}):this[0]&&(this[0].multiple?n(this[0]).find("option").filter(function(){return this.selected}).pluck("value"):this[0].value)},offset:function(t){if(t)return this.each(function(e){var i=n(this),r=J(this,t,e,i.offset()),o=i.offsetParent().offset(),s={top:r.top-o.top,left:r.left-o.left};"static"==i.css("position")&&(s.position="relative"),i.css(s)});if(!this.length)return null;var e=this[0].getBoundingClientRect();return{left:e.left+window.pageXOffset,top:e.top+window.pageYOffset,width:Math.round(e.width),height:Math.round(e.height)}},css:function(t,i){if(arguments.length<2){var r=this[0],o=getComputedStyle(r,"");if(!r)return;if("string"==typeof t)return r.style[C(t)]||o.getPropertyValue(t);if(A(t)){var s={};return n.each(A(t)?t:[t],function(t,e){s[e]=r.style[C(e)]||o.getPropertyValue(e)}),s}}var a="";if("string"==L(t))i||0===i?a=F(t)+":"+H(t,i):this.each(function(){this.style.removeProperty(F(t))});else for(e in t)t[e]||0===t[e]?a+=F(e)+":"+H(e,t[e])+";":this.each(function(){this.style.removeProperty(F(e))});return this.each(function(){this.style.cssText+=";"+a})},index:function(t){return t?this.indexOf(n(t)[0]):this.parent().children().indexOf(this[0])},hasClass:function(t){return t?r.some.call(this,function(t){return this.test(W(t))},q(t)):!1},addClass:function(t){return t?this.each(function(e){i=[];var r=W(this),o=J(this,t,e,r);o.split(/\s+/g).forEach(function(t){n(this).hasClass(t)||i.push(t)},this),i.length&&W(this,r+(r?" ":"")+i.join(" "))}):this},removeClass:function(e){return this.each(function(n){return e===t?W(this,""):(i=W(this),J(this,e,n,i).split(/\s+/g).forEach(function(t){i=i.replace(q(t)," ")}),void W(this,i.trim()))})},toggleClass:function(e,i){return e?this.each(function(r){var o=n(this),s=J(this,e,r,W(this));s.split(/\s+/g).forEach(function(e){(i===t?!o.hasClass(e):i)?o.addClass(e):o.removeClass(e)})}):this},scrollTop:function(e){if(this.length){var n="scrollTop"in this[0];return e===t?n?this[0].scrollTop:this[0].pageYOffset:this.each(n?function(){this.scrollTop=e}:function(){this.scrollTo(this.scrollX,e)})}},scrollLeft:function(e){if(this.length){var n="scrollLeft"in this[0];return e===t?n?this[0].scrollLeft:this[0].pageXOffset:this.each(n?function(){this.scrollLeft=e}:function(){this.scrollTo(e,this.scrollY)})}},position:function(){if(this.length){var t=this[0],e=this.offsetParent(),i=this.offset(),r=d.test(e[0].nodeName)?{top:0,left:0}:e.offset();return i.top-=parseFloat(n(t).css("margin-top"))||0,i.left-=parseFloat(n(t).css("margin-left"))||0,r.top+=parseFloat(n(e[0]).css("border-top-width"))||0,r.left+=parseFloat(n(e[0]).css("border-left-width"))||0,{top:i.top-r.top,left:i.left-r.left}}},offsetParent:function(){return this.map(function(){for(var t=this.offsetParent||a.body;t&&!d.test(t.nodeName)&&"static"==n(t).css("position");)t=t.offsetParent;return t})}},n.fn.detach=n.fn.remove,["width","height"].forEach(function(e){var i=e.replace(/./,function(t){return t[0].toUpperCase()});n.fn[e]=function(r){var o,s=this[0];return r===t?$(s)?s["inner"+i]:_(s)?s.documentElement["scroll"+i]:(o=this.offset())&&o[e]:this.each(function(t){s=n(this),s.css(e,J(this,r,t,s[e]()))})}}),v.forEach(function(t,e){var i=e%2;n.fn[t]=function(){var t,o,r=n.map(arguments,function(e){return t=L(e),"object"==t||"array"==t||null==e?e:T.fragment(e)}),s=this.length>1;return r.length<1?this:this.each(function(t,u){o=i?u:u.parentNode,u=0==e?u.nextSibling:1==e?u.firstChild:2==e?u:null;var f=n.contains(a.documentElement,o);r.forEach(function(t){if(s)t=t.cloneNode(!0);else if(!o)return n(t).remove();o.insertBefore(t,u),f&&G(t,function(t){null==t.nodeName||"SCRIPT"!==t.nodeName.toUpperCase()||t.type&&"text/javascript"!==t.type||t.src||window.eval.call(window,t.innerHTML)})})})},n.fn[i?t+"To":"insert"+(e?"Before":"After")]=function(e){return n(e)[t](this),this}}),T.Z.prototype=n.fn,T.uniq=N,T.deserializeValue=Y,n.zepto=T,n}();window.Zepto=Zepto,void 0===window.$&&(window.$=Zepto),function(t){function l(t){return t._zid||(t._zid=e++)}function h(t,e,n,i){if(e=p(e),e.ns)var r=d(e.ns);return(s[l(t)]||[]).filter(function(t){return!(!t||e.e&&t.e!=e.e||e.ns&&!r.test(t.ns)||n&&l(t.fn)!==l(n)||i&&t.sel!=i)})}function p(t){var e=(""+t).split(".");return{e:e[0],ns:e.slice(1).sort().join(" ")}}function d(t){return new RegExp("(?:^| )"+t.replace(" "," .* ?")+"(?: |$)")}function m(t,e){return t.del&&!u&&t.e in f||!!e}function g(t){return c[t]||u&&f[t]||t}function v(e,i,r,o,a,u,f){var h=l(e),d=s[h]||(s[h]=[]);i.split(/\s/).forEach(function(i){if("ready"==i)return t(document).ready(r);var s=p(i);s.fn=r,s.sel=a,s.e in c&&(r=function(e){var n=e.relatedTarget;return!n||n!==this&&!t.contains(this,n)?s.fn.apply(this,arguments):void 0}),s.del=u;var l=u||r;s.proxy=function(t){if(t=j(t),!t.isImmediatePropagationStopped()){t.data=o;var i=l.apply(e,t._args==n?[t]:[t].concat(t._args));return i===!1&&(t.preventDefault(),t.stopPropagation()),i}},s.i=d.length,d.push(s),"addEventListener"in e&&e.addEventListener(g(s.e),s.proxy,m(s,f))})}function y(t,e,n,i,r){var o=l(t);(e||"").split(/\s/).forEach(function(e){h(t,e,n,i).forEach(function(e){delete s[o][e.i],"removeEventListener"in t&&t.removeEventListener(g(e.e),e.proxy,m(e,r))})})}function j(e,i){return(i||!e.isDefaultPrevented)&&(i||(i=e),t.each(E,function(t,n){var r=i[t];e[t]=function(){return this[n]=x,r&&r.apply(i,arguments)},e[n]=b}),(i.defaultPrevented!==n?i.defaultPrevented:"returnValue"in i?i.returnValue===!1:i.getPreventDefault&&i.getPreventDefault())&&(e.isDefaultPrevented=x)),e}function S(t){var e,i={originalEvent:t};for(e in t)w.test(e)||t[e]===n||(i[e]=t[e]);return j(i,t)}var n,e=1,i=Array.prototype.slice,r=t.isFunction,o=function(t){return"string"==typeof t},s={},a={},u="onfocusin"in window,f={focus:"focusin",blur:"focusout"},c={mouseenter:"mouseover",mouseleave:"mouseout"};a.click=a.mousedown=a.mouseup=a.mousemove="MouseEvents",t.event={add:v,remove:y},t.proxy=function(e,n){var s=2 in arguments&&i.call(arguments,2);if(r(e)){var a=function(){return e.apply(n,s?s.concat(i.call(arguments)):arguments)};return a._zid=l(e),a}if(o(n))return s?(s.unshift(e[n],e),t.proxy.apply(null,s)):t.proxy(e[n],e);throw new TypeError("expected function")},t.fn.bind=function(t,e,n){return this.on(t,e,n)},t.fn.unbind=function(t,e){return this.off(t,e)},t.fn.one=function(t,e,n,i){return this.on(t,e,n,i,1)};var x=function(){return!0},b=function(){return!1},w=/^([A-Z]|returnValue$|layer[XY]$)/,E={preventDefault:"isDefaultPrevented",stopImmediatePropagation:"isImmediatePropagationStopped",stopPropagation:"isPropagationStopped"};t.fn.delegate=function(t,e,n){return this.on(e,t,n)},t.fn.undelegate=function(t,e,n){return this.off(e,t,n)},t.fn.live=function(e,n){return t(document.body).delegate(this.selector,e,n),this},t.fn.die=function(e,n){return t(document.body).undelegate(this.selector,e,n),this},t.fn.on=function(e,s,a,u,f){var c,l,h=this;return e&&!o(e)?(t.each(e,function(t,e){h.on(t,s,a,e,f)}),h):(o(s)||r(u)||u===!1||(u=a,a=s,s=n),(r(a)||a===!1)&&(u=a,a=n),u===!1&&(u=b),h.each(function(n,r){f&&(c=function(t){return y(r,t.type,u),u.apply(this,arguments)}),s&&(l=function(e){var n,o=t(e.target).closest(s,r).get(0);return o&&o!==r?(n=t.extend(S(e),{currentTarget:o,liveFired:r}),(c||u).apply(o,[n].concat(i.call(arguments,1)))):void 0}),v(r,e,u,a,s,l||c)}))},t.fn.off=function(e,i,s){var a=this;return e&&!o(e)?(t.each(e,function(t,e){a.off(t,i,e)}),a):(o(i)||r(s)||s===!1||(s=i,i=n),s===!1&&(s=b),a.each(function(){y(this,e,s,i)}))},t.fn.trigger=function(e,n){return e=o(e)||t.isPlainObject(e)?t.Event(e):j(e),e._args=n,this.each(function(){"dispatchEvent"in this?this.dispatchEvent(e):t(this).triggerHandler(e,n)})},t.fn.triggerHandler=function(e,n){var i,r;return this.each(function(s,a){i=S(o(e)?t.Event(e):e),i._args=n,i.target=a,t.each(h(a,e.type||e),function(t,e){return r=e.proxy(i),i.isImmediatePropagationStopped()?!1:void 0})}),r},"focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select keydown keypress keyup error".split(" ").forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.trigger(e)}}),["focus","blur"].forEach(function(e){t.fn[e]=function(t){return t?this.bind(e,t):this.each(function(){try{this[e]()}catch(t){}}),this}}),t.Event=function(t,e){o(t)||(e=t,t=e.type);var n=document.createEvent(a[t]||"Events"),i=!0;if(e)for(var r in e)"bubbles"==r?i=!!e[r]:n[r]=e[r];return n.initEvent(t,i,!0),j(n)}}(Zepto),function(t){function l(e,n,i){var r=t.Event(n);return t(e).trigger(r,i),!r.isDefaultPrevented()}function h(t,e,i,r){return t.global?l(e||n,i,r):void 0}function p(e){e.global&&0===t.active++&&h(e,null,"ajaxStart")}function d(e){e.global&&!--t.active&&h(e,null,"ajaxStop")}function m(t,e){var n=e.context;return e.beforeSend.call(n,t,e)===!1||h(e,n,"ajaxBeforeSend",[t,e])===!1?!1:void h(e,n,"ajaxSend",[t,e])}function g(t,e,n,i){var r=n.context,o="success";n.success.call(r,t,o,e),i&&i.resolveWith(r,[t,o,e]),h(n,r,"ajaxSuccess",[e,n,t]),y(o,e,n)}function v(t,e,n,i,r){var o=i.context;i.error.call(o,n,e,t),r&&r.rejectWith(o,[n,e,t]),h(i,o,"ajaxError",[n,i,t||e]),y(e,n,i)}function y(t,e,n){var i=n.context;n.complete.call(i,e,t),h(n,i,"ajaxComplete",[e,n]),d(n)}function x(){}function b(t){return t&&(t=t.split(";",2)[0]),t&&(t==f?"html":t==u?"json":s.test(t)?"script":a.test(t)&&"xml")||"text"}function w(t,e){return""==e?t:(t+"&"+e).replace(/[&?]{1,2}/,"?")}function E(e){e.processData&&e.data&&"string"!=t.type(e.data)&&(e.data=t.param(e.data,e.traditional)),!e.data||e.type&&"GET"!=e.type.toUpperCase()||(e.url=w(e.url,e.data),e.data=void 0)}function j(e,n,i,r){return t.isFunction(n)&&(r=i,i=n,n=void 0),t.isFunction(i)||(r=i,i=void 0),{url:e,data:n,success:i,dataType:r}}function T(e,n,i,r){var o,s=t.isArray(n),a=t.isPlainObject(n);t.each(n,function(n,u){o=t.type(u),r&&(n=i?r:r+"["+(a||"object"==o||"array"==o?n:"")+"]"),!r&&s?e.add(u.name,u.value):"array"==o||!i&&"object"==o?T(e,u,i,n):e.add(n,u)})}var i,r,e=0,n=window.document,o=/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,s=/^(?:text|application)\/javascript/i,a=/^(?:text|application)\/xml/i,u="application/json",f="text/html",c=/^\s*$/;t.active=0,t.ajaxJSONP=function(i,r){if(!("type"in i))return t.ajax(i);var f,h,o=i.jsonpCallback,s=(t.isFunction(o)?o():o)||"jsonp"+ ++e,a=n.createElement("script"),u=window[s],c=function(e){t(a).triggerHandler("error",e||"abort")},l={abort:c};return r&&r.promise(l),t(a).on("load error",function(e,n){clearTimeout(h),t(a).off().remove(),"error"!=e.type&&f?g(f[0],l,i,r):v(null,n||"error",l,i,r),window[s]=u,f&&t.isFunction(u)&&u(f[0]),u=f=void 0}),m(l,i)===!1?(c("abort"),l):(window[s]=function(){f=arguments},a.src=i.url.replace(/\?(.+)=\?/,"?$1="+s),n.head.appendChild(a),i.timeout>0&&(h=setTimeout(function(){c("timeout")},i.timeout)),l)},t.ajaxSettings={type:"GET",beforeSend:x,success:x,error:x,complete:x,context:null,global:!0,xhr:function(){return new window.XMLHttpRequest},accepts:{script:"text/javascript, application/javascript, application/x-javascript",json:u,xml:"application/xml, text/xml",html:f,text:"text/plain"},crossDomain:!1,timeout:0,processData:!0,cache:!0},t.ajax=function(e){var n=t.extend({},e||{}),o=t.Deferred&&t.Deferred();for(i in t.ajaxSettings)void 0===n[i]&&(n[i]=t.ajaxSettings[i]);p(n),n.crossDomain||(n.crossDomain=/^([\w-]+:)?\/\/([^\/]+)/.test(n.url)&&RegExp.$2!=window.location.host),n.url||(n.url=window.location.toString()),E(n);var s=n.dataType,a=/\?.+=\?/.test(n.url);if(a&&(s="jsonp"),n.cache!==!1&&(e&&e.cache===!0||"script"!=s&&"jsonp"!=s)||(n.url=w(n.url,"_="+Date.now())),"jsonp"==s)return a||(n.url=w(n.url,n.jsonp?n.jsonp+"=?":n.jsonp===!1?"":"callback=?")),t.ajaxJSONP(n,o);var j,u=n.accepts[s],f={},l=function(t,e){f[t.toLowerCase()]=[t,e]},h=/^([\w-]+:)\/\//.test(n.url)?RegExp.$1:window.location.protocol,d=n.xhr(),y=d.setRequestHeader;if(o&&o.promise(d),n.crossDomain||l("X-Requested-With","XMLHttpRequest"),l("Accept",u||"*/*"),(u=n.mimeType||u)&&(u.indexOf(",")>-1&&(u=u.split(",",2)[0]),d.overrideMimeType&&d.overrideMimeType(u)),(n.contentType||n.contentType!==!1&&n.data&&"GET"!=n.type.toUpperCase())&&l("Content-Type",n.contentType||"application/x-www-form-urlencoded"),n.headers)for(r in n.headers)l(r,n.headers[r]);if(d.setRequestHeader=l,d.onreadystatechange=function(){if(4==d.readyState){d.onreadystatechange=x,clearTimeout(j);var e,i=!1;if(d.status>=200&&d.status<300||304==d.status||0==d.status&&"file:"==h){s=s||b(n.mimeType||d.getResponseHeader("content-type")),e=d.responseText;try{"script"==s?(1,eval)(e):"xml"==s?e=d.responseXML:"json"==s&&(e=c.test(e)?null:t.parseJSON(e))}catch(r){i=r}i?v(i,"parsererror",d,n,o):g(e,d,n,o)}else v(d.statusText||null,d.status?"error":"abort",d,n,o)}},m(d,n)===!1)return d.abort(),v(null,"abort",d,n,o),d;if(n.xhrFields)for(r in n.xhrFields)d[r]=n.xhrFields[r];var S="async"in n?n.async:!0;d.open(n.type,n.url,S,n.username,n.password);for(r in f)y.apply(d,f[r]);return n.timeout>0&&(j=setTimeout(function(){d.onreadystatechange=x,d.abort(),v(null,"timeout",d,n,o)},n.timeout)),d.send(n.data?n.data:null),d},t.get=function(){return t.ajax(j.apply(null,arguments))},t.post=function(){var e=j.apply(null,arguments);return e.type="POST",t.ajax(e)},t.getJSON=function(){var e=j.apply(null,arguments);return e.dataType="json",t.ajax(e)},t.fn.load=function(e,n,i){if(!this.length)return this;var a,r=this,s=e.split(/\s/),u=j(e,n,i),f=u.success;return s.length>1&&(u.url=s[0],a=s[1]),u.success=function(e){r.html(a?t("<div>").html(e.replace(o,"")).find(a):e),f&&f.apply(r,arguments)},t.ajax(u),this};var S=encodeURIComponent;t.param=function(t,e){var n=[];return n.add=function(t,e){this.push(S(t)+"="+S(e))},T(n,t,e),n.join("&").replace(/%20/g,"+")}}(Zepto),function(t){t.fn.serializeArray=function(){var n,e=[];return t([].slice.call(this.get(0).elements)).each(function(){n=t(this);var i=n.attr("type");"fieldset"!=this.nodeName.toLowerCase()&&!this.disabled&&"submit"!=i&&"reset"!=i&&"button"!=i&&("radio"!=i&&"checkbox"!=i||this.checked)&&e.push({name:n.attr("name"),value:n.val()})}),e},t.fn.serialize=function(){var t=[];return this.serializeArray().forEach(function(e){t.push(encodeURIComponent(e.name)+"="+encodeURIComponent(e.value))}),t.join("&")},t.fn.submit=function(e){if(e)this.bind("submit",e);else if(this.length){var n=t.Event("submit");this.eq(0).trigger(n),n.isDefaultPrevented()||this.get(0).submit()}return this}}(Zepto),function(t){"__proto__"in{}||t.extend(t.zepto,{Z:function(e,n){return e=e||[],t.extend(e,t.fn),e.selector=n||"",e.__Z=!0,e},isZ:function(e){return"array"===t.type(e)&&"__Z"in e}});try{getComputedStyle(void 0)}catch(e){var n=getComputedStyle;window.getComputedStyle=function(t){try{return n(t)}catch(e){return null}}}}(Zepto);

// Zepto.js
// (c) 2010-2014 Thomas Fuchs
// Zepto.js may be freely distributed under the MIT license.
;(function($){
    var cache = [], timeout
    $.fn.remove = function(){
        return this.each(function(){
            if(this.parentNode){
                if(this.tagName === 'IMG'){
                    cache.push(this)
                    this.src = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='
                    if (timeout) clearTimeout(timeout)
                    timeout = setTimeout(function(){ cache = [] }, 60000)
                }
                this.parentNode.removeChild(this)
            }
        })
    }
})(Zepto)

// Zepto.js
// (c) 2010-2014 Thomas Fuchs
// Zepto.js may be freely distributed under the MIT license.
// The following code is heavily inspired by jQuery's $.fn.data()
;(function($){
    var data = {}, dataAttr = $.fn.data, camelize = $.camelCase,
        exp = $.expando = 'Zepto' + (+new Date()), emptyArray = []
// Get value from node:
// 1. first try key as given,
// 2. then try camelized key,
// 3. fall back to reading "data-*" attribute.
    function getData(node, name) {
        var id = node[exp], store = id && data[id]
        if (name === undefined) return store || setData(node)
        else {
            if (store) {
                if (name in store) return store[name]
                var camelName = camelize(name)
                if (camelName in store) return store[camelName]
            }
            return dataAttr.call($(node), name)
        }
    }
// Store value under camelized key on node
    function setData(node, name, value) {
        var id = node[exp] || (node[exp] = ++$.uuid),
            store = data[id] || (data[id] = attributeData(node))
        if (name !== undefined) store[camelize(name)] = value
        return store
    }
// Read all "data-*" attributes from a node
    function attributeData(node) {
        var store = {}
        $.each(node.attributes || emptyArray, function(i, attr){
            if (attr.name.indexOf('data-') == 0)
                store[camelize(attr.name.replace('data-', ''))] =
                    $.zepto.deserializeValue(attr.value)
        })
        return store
    }
    $.fn.data = function(name, value) {
        return value === undefined ?
// set multiple values via object
            $.isPlainObject(name) ?
                this.each(function(i, node){
                    $.each(name, function(key, value){ setData(node, key, value) })
                }) :
// get value from first element
            (0 in this ? getData(this[0], name) : undefined) :
// set value on all elements
            this.each(function(){ setData(this, name, value) })
    }
    $.fn.removeData = function(names) {
        if (typeof names == 'string') names = names.split(/\s+/)
        return this.each(function(){
            var id = this[exp], store = id && data[id]
            if (store) $.each(names || store, function(key){
                delete store[names ? camelize(this) : key]
            })
        })
    }
// Generate extended `remove` and `empty` functions
    ;['remove', 'empty'].forEach(function(methodName){
        var origFn = $.fn[methodName]
        $.fn[methodName] = function() {
            var elements = this.find('*')
            if (methodName === 'remove') elements = elements.add(this)
            elements.removeData()
            return origFn.call(this)
        }
    })
})(Zepto)

// Zepto.js
// (c) 2010-2014 Thomas Fuchs
// Zepto.js may be freely distributed under the MIT license.
;(function($){
    var zepto = $.zepto, oldQsa = zepto.qsa, oldMatches = zepto.matches
    function visible(elem){
        elem = $(elem)
        return !!(elem.width() || elem.height()) && elem.css("display") !== "none"
    }
// Implements a subset from:
// http://api.jquery.com/category/selectors/jquery-selector-extensions/
//
// Each filter function receives the current index, all nodes in the
// considered set, and a value if there were parentheses. The value
// of `this` is the node currently being considered. The function returns the
// resulting node(s), null, or undefined.
//
// Complex selectors are not supported:
// li:has(label:contains("foo")) + li:has(label:contains("bar"))
// ul.inner:first > li
    var filters = $.expr[':'] = {
        visible: function(){ if (visible(this)) return this },
        hidden: function(){ if (!visible(this)) return this },
        selected: function(){ if (this.selected) return this },
        checked: function(){ if (this.checked) return this },
        parent: function(){ return this.parentNode },
        first: function(idx){ if (idx === 0) return this },
        last: function(idx, nodes){ if (idx === nodes.length - 1) return this },
        eq: function(idx, _, value){ if (idx === value) return this },
        contains: function(idx, _, text){ if ($(this).text().indexOf(text) > -1) return this },
        has: function(idx, _, sel){ if (zepto.qsa(this, sel).length) return this }
    }
    var filterRe = new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),
        childRe = /^\s*>/,
        classTag = 'Zepto' + (+new Date())
    function process(sel, fn) {
// quote the hash in `a[href^=#]` expression
        sel = sel.replace(/=#\]/g, '="#"]')
        var filter, arg, match = filterRe.exec(sel)
        if (match && match[2] in filters) {
            filter = filters[match[2]], arg = match[3]
            sel = match[1]
            if (arg) {
                var num = Number(arg)
                if (isNaN(num)) arg = arg.replace(/^["']|["']$/g, '')
                else arg = num
            }
        }
        return fn(sel, filter, arg)
    }
    zepto.qsa = function(node, selector) {
        return process(selector, function(sel, filter, arg){
            try {
                var taggedParent
                if (!sel && filter) sel = '*'
                else if (childRe.test(sel))
                    // support "> *" child queries by tagging the parent node with a
                    // unique class and prepending that classname onto the selector
                    taggedParent = $(node).addClass(classTag), sel = '.'+classTag+' '+sel
                var nodes = oldQsa(node, sel)
            } catch(e) {
                console.error('error performing selector: %o', selector)
                throw e
            } finally {
                if (taggedParent) taggedParent.removeClass(classTag)
            }
            return !filter ? nodes :
                zepto.uniq($.map(nodes, function(n, i){ return filter.call(n, i, nodes, arg) }))
        })
    }
    zepto.matches = function(node, selector){
        return process(selector, function(sel, filter, arg){
            return (!sel || oldMatches(node, sel)) &&
                (!filter || filter.call(node, null, arg) === node)
        })
    }
})(Zepto)

/// Zepto.js
// (c) 2010-2014 Thomas Fuchs
// Zepto.js may be freely distributed under the MIT license.
;(function($){
    var touch = {},
        touchTimeout, tapTimeout, swipeTimeout, longTapTimeout,
        longTapDelay = 750,
        gesture
    function swipeDirection(x1, x2, y1, y2) {
        return Math.abs(x1 - x2) >=
            Math.abs(y1 - y2) ? (x1 - x2 > 0 ? 'Left' : 'Right') : (y1 - y2 > 0 ? 'Up' : 'Down')
    }
    function longTap() {
        longTapTimeout = null
        if (touch.last) {
            touch.el.trigger('longTap')
            touch = {}
        }
    }
    function cancelLongTap() {
        if (longTapTimeout) clearTimeout(longTapTimeout)
        longTapTimeout = null
    }
    function cancelAll() {
        if (touchTimeout) clearTimeout(touchTimeout)
        if (tapTimeout) clearTimeout(tapTimeout)
        if (swipeTimeout) clearTimeout(swipeTimeout)
        if (longTapTimeout) clearTimeout(longTapTimeout)
        touchTimeout = tapTimeout = swipeTimeout = longTapTimeout = null
        touch = {}
    }
    function isPrimaryTouch(event){
        return (event.pointerType == 'touch' ||
            event.pointerType == event.MSPOINTER_TYPE_TOUCH)
            && event.isPrimary
    }
    function isPointerEventType(e, type){
        return (e.type == 'pointer'+type ||
            e.type.toLowerCase() == 'mspointer'+type)
    }
    $(document).ready(function(){
        var now, delta, deltaX = 0, deltaY = 0, firstTouch, _isPointerType
        if ('MSGesture' in window) {
            gesture = new MSGesture()
            gesture.target = document.body
        }
        $(document)
            .bind('MSGestureEnd', function(e){
                var swipeDirectionFromVelocity =
                        e.velocityX > 1 ? 'Right' : e.velocityX < -1 ? 'Left' : e.velocityY > 1 ? 'Down' : e.velocityY < -1 ? 'Up' : null;
                if (swipeDirectionFromVelocity) {
                    touch.el.trigger('swipe')
                    touch.el.trigger('swipe'+ swipeDirectionFromVelocity)
                }
            })
            .on('touchstart MSPointerDown pointerdown', function(e){
                if((_isPointerType = isPointerEventType(e, 'down')) &&
                    !isPrimaryTouch(e)) return
                firstTouch = _isPointerType ? e : e.touches[0]
                if (e.touches && e.touches.length === 1 && touch.x2) {
                // Clear out touch movement data if we have it sticking around
                // This can occur if touchcancel doesn't fire due to preventDefault, etc.
                    touch.x2 = undefined
                    touch.y2 = undefined
                }
                now = Date.now()
                delta = now - (touch.last || now)
                touch.el = $('tagName' in firstTouch.target ?
                    firstTouch.target : firstTouch.target.parentNode)
                touchTimeout && clearTimeout(touchTimeout)
                touch.x1 = firstTouch.pageX
                touch.y1 = firstTouch.pageY
                if (delta > 0 && delta <= 250) touch.isDoubleTap = true
                touch.last = now
                longTapTimeout = setTimeout(longTap, longTapDelay)
                // adds the current touch contact for IE gesture recognition
                if (gesture && _isPointerType) gesture.addPointer(e.pointerId);
            })
            .on('touchmove MSPointerMove pointermove', function(e){
                if((_isPointerType = isPointerEventType(e, 'move')) &&
                    !isPrimaryTouch(e)) return
                firstTouch = _isPointerType ? e : e.touches[0]
                cancelLongTap()
                touch.x2 = firstTouch.pageX
                touch.y2 = firstTouch.pageY
                deltaX += Math.abs(touch.x1 - touch.x2)
                deltaY += Math.abs(touch.y1 - touch.y2)
            })
            .on('touchend MSPointerUp pointerup', function(e){
                if((_isPointerType = isPointerEventType(e, 'up')) &&
                    !isPrimaryTouch(e)) return
                cancelLongTap()
                // swipe
                if ((touch.x2 && Math.abs(touch.x1 - touch.x2) > 30) ||
                    (touch.y2 && Math.abs(touch.y1 - touch.y2) > 30))
                    swipeTimeout = setTimeout(function() {
                        touch.el.trigger('swipe')
                        touch.el.trigger('swipe' + (swipeDirection(touch.x1, touch.x2, touch.y1, touch.y2)))
                        touch = {}
                    }, 0)
                // normal tap
                else if ('last' in touch)
                    // don't fire tap when delta position changed by more than 30 pixels,
                    // for instance when moving to a point and back to origin
                    if (deltaX < 30 && deltaY < 30) {
                        // delay by one tick so we can cancel the 'tap' event if 'scroll' fires
                        // ('tap' fires before 'scroll')
                        tapTimeout = setTimeout(function() {
                            // trigger universal 'tap' with the option to cancelTouch()
                            // (cancelTouch cancels processing of single vs double taps for faster 'tap' response)
                            var event = $.Event('tap')
                            event.cancelTouch = cancelAll
                            touch.el.trigger(event)
                            // trigger double tap immediately
                            if (touch.isDoubleTap) {
                                if (touch.el) touch.el.trigger('doubleTap')
                                touch = {}
                            }
                            // trigger single tap after 250ms of inactivity
                            else {
                                touchTimeout = setTimeout(function(){
                                    touchTimeout = null
                                    if (touch.el) touch.el.trigger('singleTap')
                                    touch = {}
                                }, 250)
                            }
                        }, 0)
                    } else {
                        touch = {}
                    }
                deltaX = deltaY = 0
            })
            // when the browser window loses focus,
            // for example when a modal dialog is shown,
            // cancel all ongoing events
            .on('touchcancel MSPointerCancel pointercancel', cancelAll)
        // scrolling the window indicates intention of the user
        // to scroll, not tap or swipe, so cancel all ongoing events
        $(window).on('scroll', cancelAll)
    })
    ;['swipe', 'swipeLeft', 'swipeRight', 'swipeUp', 'swipeDown',
        'doubleTap', 'tap', 'singleTap', 'longTap'].forEach(function(eventName){
            $.fn[eventName] = function(callback){ return this.on(eventName, callback) }
        })
})(Zepto)

/**
 * jQuery Unveil
 * A very lightweight jQuery plugin to lazy load images
 * http://luis-almeida.github.com/unveil
 *
 * Licensed under the MIT license.
 * Copyright 2013 Luís Almeida
 * https://github.com/luis-almeida
 */

window.isRetina = (function (window) {
    if (window.devicePixelRatio > 1)
        return true;

    var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
  	                  (min--moz-device-pixel-ratio: 1.5),\
  	                  (-o-min-device-pixel-ratio: 3/2),\
  	                  (min-resolution: 1.5dppx)";

    return !!(window.matchMedia && window.matchMedia(mediaQuery).matches);
})(window);

function toRetina(src) {
    return src.replace(/\.\w+$/, function (match) {
        return "@2x" + match;
    })
}

(function ($, isRetina) {
    $.fn.unveil = function (threshold, callback) {
        var $w = $(window),
            th = threshold || 0,
            images = this,
            loaded;

        this.one("unveil", function () {
            var source = this.getAttribute("data-src");

            if (isRetina) {
                source = toRetina(source);
            }

            if (source) {
                this.setAttribute("src", source);
                if (typeof callback === "function") callback.call(this);
            }
        });

        function unveil() {
            var inview = images.filter(function () {
                var $e = $(this);
                if ($e.is(":hidden")) return;

                var wt = $w.scrollTop(),
                    wb = wt + $w.height(),
                    et = $e.offset().top,
                    eb = et + $e.height();

                return eb >= wt - th && et <= wb + th;
            });

            loaded = inview.trigger("unveil");
            images = images.not(loaded);
        }

        $w.scroll(unveil);
        $w.resize(unveil);

        unveil();

        return this;
    };

})(window.jQuery || window.Zepto, window.isRetina);

/* ========================================================================
 * Ratchet: push.js v2.0.2
 * http://goratchet.com/components#push
 * ========================================================================
 * inspired by @defunkt's jquery.pjax.js
 * Copyright 2014 Connor Sears
 * Licensed under MIT (https://github.com/twbs/ratchet/blob/master/LICENSE)
 * ======================================================================== */

/* global _gaq: true */

!(function () {
    'use strict';

    var noop = function () {};


    // Pushstate caching
    // ==================

    var isScrolling;
    var maxCacheLength = 20;
    var cacheMapping   = sessionStorage;
    var domCache       = {};
    // Change these to unquoted camelcase in the next major version bump
    var transitionMap  = {
        'slide-in'  : 'slide-out',
        'slide-out' : 'slide-in',
        fade     : 'fade'
    };

    var bars = {
        bartab             : '.bar-tab',
        barnav             : '.bar-nav',
        barfooter          : '.bar-footer',
        barheadersecondary : '.bar-header-secondary'
    };

    var cacheReplace = function (data, updates) {
        PUSH.id = data.id;
        if (updates) {
            data = getCached(data.id);
        }
        cacheMapping[data.id] = JSON.stringify(data);
        window.history.replaceState(data.id, data.title, data.url);
    };

    var cachePush = function () {
        var id = PUSH.id;

        var cacheForwardStack = JSON.parse(cacheMapping.cacheForwardStack || '[]');
        var cacheBackStack    = JSON.parse(cacheMapping.cacheBackStack    || '[]');

        cacheBackStack.push(id);

        while (cacheForwardStack.length) {
            delete cacheMapping[cacheForwardStack.shift()];
        }
        while (cacheBackStack.length > maxCacheLength) {
            delete cacheMapping[cacheBackStack.shift()];
        }

        window.history.pushState(null, '', getCached(PUSH.id).url);

        cacheMapping.cacheForwardStack = JSON.stringify(cacheForwardStack);
        cacheMapping.cacheBackStack    = JSON.stringify(cacheBackStack);
    };

    var cachePop = function (id, direction) {
        var forward           = direction === 'forward';
        var cacheForwardStack = JSON.parse(cacheMapping.cacheForwardStack || '[]');
        var cacheBackStack    = JSON.parse(cacheMapping.cacheBackStack    || '[]');
        var pushStack         = forward ? cacheBackStack    : cacheForwardStack;
        var popStack          = forward ? cacheForwardStack : cacheBackStack;

        if (PUSH.id) {
            pushStack.push(PUSH.id);
        }
        popStack.pop();

        cacheMapping.cacheForwardStack = JSON.stringify(cacheForwardStack);
        cacheMapping.cacheBackStack    = JSON.stringify(cacheBackStack);
    };

    var getCached = function (id) {
        return JSON.parse(cacheMapping[id] || null) || {};
    };

    var getTarget = function (e) {
        var target = findTarget(e.target);

        if (!target ||
            e.which > 1 ||
            e.metaKey ||
            e.ctrlKey ||
            isScrolling ||
            location.protocol !== target.protocol ||
            location.host     !== target.host ||
            !target.hash && /#/.test(target.href) ||
            target.hash && target.href.replace(target.hash, '') === location.href.replace(location.hash, '') ||
            target.getAttribute('data-ignore') === 'push') { return; }

        return target;
    };


    // Main event handlers (touchend, popstate)
    // ==========================================

    var touchend = function (e) {
        var target = getTarget(e);

        if (!target) {
            return;
        }

        e.preventDefault();

        PUSH({
            url        : target.href,
            hash       : target.hash,
            timeout    : target.getAttribute('data-timeout'),
            transition : target.getAttribute('data-transition')
        });
    };

    var popstate = function (e) {
        var key;
        var barElement;
        var activeObj;
        var activeDom;
        var direction;
        var transition;
        var transitionFrom;
        var transitionFromObj;
        var id = e.state;

        if (!id || !cacheMapping[id]) {
            return;
        }

        direction = PUSH.id < id ? 'forward' : 'back';

        cachePop(id, direction);

        activeObj = getCached(id);
        activeDom = domCache[id];

        if (activeObj.title) {
            document.title = activeObj.title;
        }

        if (direction === 'back') {
            transitionFrom    = JSON.parse(direction === 'back' ? cacheMapping.cacheForwardStack : cacheMapping.cacheBackStack);
            transitionFromObj = getCached(transitionFrom[transitionFrom.length - 1]);
        } else {
            transitionFromObj = activeObj;
        }

        if (direction === 'back' && !transitionFromObj.id) {
            return (PUSH.id = id);
        }

        transition = direction === 'back' ? transitionMap[transitionFromObj.transition] : transitionFromObj.transition;

        if (!activeDom) {
            return PUSH({
                id         : activeObj.id,
                url        : activeObj.url,
                title      : activeObj.title,
                timeout    : activeObj.timeout,
                transition : transition,
                ignorePush : true
            });
        }

        if (transitionFromObj.transition) {
            activeObj = extendWithDom(activeObj, '.content', activeDom.cloneNode(true));
            for (key in bars) {
                if (bars.hasOwnProperty(key)) {
                    barElement = document.querySelector(bars[key]);
                    if (activeObj[key]) {
                        swapContent(activeObj[key], barElement);
                    } else if (barElement) {
                        barElement.parentNode.removeChild(barElement);
                    }
                }
            }
        }

        swapContent(
            (activeObj.contents || activeDom).cloneNode(true),
            document.querySelector('.content'),
            transition, function () {
                triggerStateChange();
            }
        );

        PUSH.id = id;

        document.body.offsetHeight; // force reflow to prevent scroll
    };


    // Core PUSH functionality
    // =======================

    var PUSH = function (options) {
        var key;
        var xhr = PUSH.xhr;

        options.container = options.container || options.transition ? document.querySelector('.content') : document.body;

        for (key in bars) {
            if (bars.hasOwnProperty(key)) {
                options[key] = options[key] || document.querySelector(bars[key]);
            }
        }

        if (xhr && xhr.readyState < 4) {
            xhr.onreadystatechange = noop;
            xhr.abort();
        }

        xhr = new XMLHttpRequest();
        xhr.open('GET', options.url, true);
        xhr.setRequestHeader('X-PUSH', 'true');

        xhr.onreadystatechange = function () {
            if (options._timeout) {
                clearTimeout(options._timeout);
            }
            if (xhr.readyState === 4) {
                xhr.status === 200 ? success(xhr, options) : failure(options.url);
            }
        };

        if (!PUSH.id) {
            cacheReplace({
                id         : +new Date(),
                url        : window.location.href,
                title      : document.title,
                timeout    : options.timeout,
                transition : options.transition
            });
        }

        cacheCurrentContent();

        if (options.timeout) {
            options._timeout = setTimeout(function () {  xhr.abort('timeout'); }, options.timeout);
        }

        xhr.send();

        if (xhr.readyState && !options.ignorePush) {
            cachePush();
        }
    };

    function cacheCurrentContent() {
        domCache[PUSH.id] = document.body.cloneNode(true);
    }


    // Main XHR handlers
    // =================

    var success = function (xhr, options) {
        var key;
        var barElement;
        var data = parseXHR(xhr, options);

        if (!data.contents) {
            return locationReplace(options.url);
        }

        if (data.title) {
            document.title = data.title;
        }

        if (options.transition) {
            for (key in bars) {
                if (bars.hasOwnProperty(key)) {
                    barElement = document.querySelector(bars[key]);
                    if (data[key]) {
                        swapContent(data[key], barElement);
                    } else if (barElement) {
                        barElement.parentNode.removeChild(barElement);
                    }
                }
            }
        }

        swapContent(data.contents, options.container, options.transition, function () {
            cacheReplace({
                id         : options.id || +new Date(),
                url        : data.url,
                title      : data.title,
                timeout    : options.timeout,
                transition : options.transition
            }, options.id);
            triggerStateChange();
        });

        if (!options.ignorePush && window._gaq) {
            _gaq.push(['_trackPageview']); // google analytics
        }
        if (!options.hash) {
            return;
        }
    };

    var failure = function (url) {
        throw new Error('Could not get: ' + url);
    };


    // PUSH helpers
    // ============

    var swapContent = function (swap, container, transition, complete) {
        var enter;
        var containerDirection;
        var swapDirection;

        if (!transition) {
            if (container) {
                container.innerHTML = swap.innerHTML;
            } else if (swap.classList.contains('content')) {
                document.body.appendChild(swap);
            } else {
                document.body.insertBefore(swap, document.querySelector('.content'));
            }
        } else {
            enter  = /in$/.test(transition);

            if (transition === 'fade') {
                container.classList.add('in');
                container.classList.add('fade');
                swap.classList.add('fade');
            }

            if (/slide/.test(transition)) {
                swap.classList.add('sliding-in', enter ? 'right' : 'left');
                swap.classList.add('sliding');
                container.classList.add('sliding');
            }

            container.parentNode.insertBefore(swap, container);
        }

        if (!transition) {
            complete && complete();
        }

        if (transition === 'fade') {
            container.offsetWidth; // force reflow
            container.classList.remove('in');
            var fadeContainerEnd = function () {
                container.removeEventListener('webkitTransitionEnd', fadeContainerEnd);
                swap.classList.add('in');
                swap.addEventListener('webkitTransitionEnd', fadeSwapEnd);
            };
            var fadeSwapEnd = function () {
                swap.removeEventListener('webkitTransitionEnd', fadeSwapEnd);
                container.parentNode.removeChild(container);
                swap.classList.remove('fade');
                swap.classList.remove('in');
                complete && complete();
            };
            container.addEventListener('webkitTransitionEnd', fadeContainerEnd);

        }

        if (/slide/.test(transition)) {
            var slideEnd = function () {
                swap.removeEventListener('webkitTransitionEnd', slideEnd);
                swap.classList.remove('sliding', 'sliding-in');
                swap.classList.remove(swapDirection);
                container.parentNode.removeChild(container);
                complete && complete();
            };

            container.offsetWidth; // force reflow
            swapDirection      = enter ? 'right' : 'left';
            containerDirection = enter ? 'left' : 'right';
            container.classList.add(containerDirection);
            swap.classList.remove(swapDirection);
            swap.addEventListener('webkitTransitionEnd', slideEnd);
        }
    };

    var triggerStateChange = function () {
        var e = new CustomEvent('push', {
            detail: { state: getCached(PUSH.id) },
            bubbles: true,
            cancelable: true
        });

        window.dispatchEvent(e);
    };

    var findTarget = function (target) {
        var i;
        var toggles = document.querySelectorAll('a');

        for (; target && target !== document; target = target.parentNode) {
            for (i = toggles.length; i--;) {
                if (toggles[i] === target) {
                    return target;
                }
            }
        }
    };

    var locationReplace = function (url) {
        window.history.replaceState(null, '', '#');
        window.location.replace(url);
    };

    var extendWithDom = function (obj, fragment, dom) {
        var i;
        var result = {};

        for (i in obj) {
            if (obj.hasOwnProperty(i)) {
                result[i] = obj[i];
            }
        }

        Object.keys(bars).forEach(function (key) {
            var el = dom.querySelector(bars[key]);
            if (el) {
                el.parentNode.removeChild(el);
            }
            result[key] = el;
        });

        result.contents = dom.querySelector(fragment);

        return result;
    };

    var parseXHR = function (xhr, options) {
        var head;
        var body;
        var data = {};
        var responseText = xhr.responseText;

        data.url = options.url;

        if (!responseText) {
            return data;
        }

        if (/<html/i.test(responseText)) {
            head           = document.createElement('div');
            body           = document.createElement('div');
            head.innerHTML = responseText.match(/<head[^>]*>([\s\S.]*)<\/head>/i)[0];
            body.innerHTML = responseText.match(/<body[^>]*>([\s\S.]*)<\/body>/i)[0];
        } else {
            head           = body = document.createElement('div');
            head.innerHTML = responseText;
        }

        data.title = head.querySelector('title');
        var text = 'innerText' in data.title ? 'innerText' : 'textContent';
        data.title = data.title && data.title[text].trim();

        if (options.transition) {
            data = extendWithDom(data, '.content', body);
        } else {
            data.contents = body;
        }

        return data;
    };


    // Attach PUSH event handlers
    // ==========================

    window.addEventListener('touchstart', function () { isScrolling = false; });
    window.addEventListener('touchmove', function () { isScrolling = true; });
    window.addEventListener('touchend', touchend);
    window.addEventListener('click', function (e) { if (getTarget(e)) {e.preventDefault();} });
    window.addEventListener('popstate', popstate);
    window.PUSH = PUSH;

}());

/**
 * clickable.js v1.0
 * Seamless buttons for mobile devices
 * Copyright (c) 2012 Kik Interactive, http://kik.com
 * Released under the MIT license
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */
var Clickable=function(f,j,k,h){var a=/^\s+|\s+$/g,m=40;var n=false,e=i();function i(){var v=f.navigator.userAgent,u,t,s;if((s=/\bCPU.*OS (\d+(_\d+)?)/i.exec(v))){u="ios";t=s[1].replace("_",".")}else{if((s=/\bAndroid (\d+(\.\d+)?)/.exec(v))){u="android";t=s[1]}}var w={name:u,version:t&&f.parseFloat(t)};w[u]=true;return w}function l(s){return String(s).replace(a,"")}function r(t){if(!t){return false}try{return(t instanceof Node)||(t instanceof HTMLElement)}catch(s){}if(typeof t!=="object"){return false}if(typeof t.nodeType!=="number"){return false}if(typeof t.nodeName!=="string"){return false}return true}function b(s){while(s=s.parentNode){if(s===j){return true}}return false}function o(){return e.ios||e.android}function d(J,K){if(!r(J)){throw TypeError("element "+J+" must be a DOM element")}if(J._clickable){return}J._clickable=true;switch(typeof K){case"undefined":K="active";case"string":break;default:throw TypeError("active class "+K+" must be a string")}J.setAttribute("data-clickable-class",K);var H=new RegExp("\\b"+K+"\\b"),F=false,s=false,I;if(!o()){if(J.addEventListener){J.addEventListener("mousedown",D,false);J.addEventListener("mousemove",E,false);J.addEventListener("mouseout",E,false);J.addEventListener("mouseup",B,false);J.addEventListener("click",z,false)}else{if(J.attachEvent){J.attachEvent("onmousedown",D);J.attachEvent("onmousemove",E);J.attachEvent("onmouseout",E);J.attachEvent("onmouseup",B);J.attachEvent("onclick",z)}}return}J.style["-webkit-tap-highlight-color"]="rgba(255,255,255,0)";J.addEventListener("click",z,false);if(e.ios){J.addEventListener("DOMNodeInsertedIntoDocument",L,false);J.addEventListener("DOMNodeRemovedFromDocument",A,false);if(b(J)){L()}}else{L()}function L(){J.addEventListener("touchstart",x,false);J.addEventListener("touchmove",C,false);J.addEventListener("touchend",w,false);J.addEventListener("touchcancel",C,false)}function A(){J.removeEventListener("touchstart",x);J.removeEventListener("touchmove",C);J.removeEventListener("touchend",w);J.removeEventListener("touchcancel",C)}function v(){J.className+=" "+K}function t(){J.className=l(J.className.replace(H,""))}function G(){n=true}function y(){if(n){setTimeout(function(){n=true},50)}}function u(N,M){do{if(N===M){return true}else{if(N._clickable){return false}}}while(N=N.parentNode);return false}function D(M){s=false;if(J.disabled||!u(M.target,J)){M.preventDefault();F=false;return}F=true;v()}function E(M){M.preventDefault();F=false;s=false;t()}function B(M){if(J.disabled){M.preventDefault();F=false;s=false;return}if(!F){M.preventDefault();s=false}else{s=true}F=false;t()}function x(M){s=false;if(n||J.disabled||(M.touches.length!==1)||!u(M.target,J)){F=false;return}n=true;F=true;I=+new Date();var N=I;setTimeout(function(){if(F&&(N===I)){v()}},m)}function C(M){s=false;F=false;if(M){n=false}if(J.disabled){return}t()}function w(P){var M=F;C();if(!M||J.disabled){n=false;return}if(!P.stopImmediatePropagation){s=true;return}var O=+new Date()-I;if(O>m){N()}else{v();setTimeout(function(){t();N()},1)}function N(){s=true;var Q=j.createEvent("MouseEvents");Q.initMouseEvent("click",true,true,f,1,0,0,0,0,false,false,false,false,0,null);J.dispatchEvent(Q)}}function z(M){M=M||f.event;if(!J.disabled&&s){s=false;setTimeout(function(){n=false},0);return}if(M.stopImmediatePropagation){M.stopImmediatePropagation()}M.preventDefault();M.stopPropagation();M.cancelBubble=true;M.returnValue=false;return false}}function q(u,t,s){if(!r(u)){throw TypeError("button must be a DOM element, got "+u)}switch(typeof t){case"string":break;case"function":s=t;t=undefined;break;default:throw TypeError("button active class must be a string if defined, got "+t)}if(typeof s!=="function"){throw TypeError("sticky click handler must be a function, got "+s)}d(u);u.addEventListener("click",v,false);function v(){var x=false,w=u.getAttribute("data-clickable-class")||"active",A;u.disabled=true;u.className+=" "+w;try{A=s(z)}catch(y){if(f.console&&f.console.error){f.console.error(y+"")}z()}if(A===false){z()}function z(){if(x){return}x=true;if(u.disabled){u.disabled=false;u.className=u.className.replace(new RegExp("\\b"+w+"\\b","g"),"")}}}}function g(){if(!k){return}k.extend(k.fn,{clickable:function(s){this.forEach(function(t){d(t,s)});return this},stickyClick:function(s){this.forEach(function(t){q(t,s)});return this}})}function p(){if(!h){return}h.fn.clickable=function(s){this.each(function(){d(this,s)});return this};h.fn.stickyClick=function(s){this.each(function(){q(this,s)});return this}}function c(){g();p();function s(){d.apply(this,arguments)}s.touchable=function(){return o()};s.sticky=function(){q.apply(this,arguments)};return s}return c()}(window,document,window.Zepto,window.jQuery);


window.platform = (function (window, userAgent) {
    var query = function (queryString) {
        var re = /([^&=]+)=([^&]+)/g,
            decodedSpace = /\+/g;

        var result = {},
            m, key, value;

        if (queryString) {
            queryString = queryString.replace(decodedSpace, '%20');

            while ((m = re.exec(queryString))) {
                key = decodeURIComponent( m[1] );
                value = decodeURIComponent( m[2] );
                result[ key ] = value;
            }
        }

        return result;
    }( window.location.href.split('?')[1] );

    var name;

    if (query['_app_platform'] === 'android') {
        name = 'android';
    }
    else if (query['_app_platform'] === 'ios') {
        name = 'ios';
    }
    else if (/\bCPU.*OS (\d+(_\d+)?)/i.exec(userAgent)) {
        name = 'ios';
    }
    else if (/\bAndroid (\d+(\.\d+)?)/.exec(userAgent)) {
        name = 'android';
    }

    return name;
}(window, navigator.userAgent));




var PhotoViewer = (function (platform) {
	var loaderImg = [
		"data:image/gif;base64,",
		"R0lGODlhEAAQAPIAAAAAAP///zw8PLy8vP///5ycnHx8fGxsbCH+GkNyZWF0ZWQgd2l0aCBhamF4",
		"bG9hZC5pbmZvACH5BAAKAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAAQAAADMwi63P4wyklr",
		"E2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQACgABACwAAAAA",
		"EAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUk",
		"KhIAIfkEAAoAAgAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9",
		"HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkEAAoAAwAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYum",
		"CYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkEAAoABAAsAAAAABAAEAAAAzII",
		"unInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQACgAF",
		"ACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJ",
		"ibufbSlKAAAh+QQACgAGACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFG",
		"xTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAAKAAcALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdce",
		"CAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA=="
	].join('');

	var defaultLoadingElm = (function () {
		var elm = document.createElement('div');
		var s = elm.style;
		s.width = '100%';
		s.height = '100%';
		s.background = 'url(' + loaderImg + ') no-repeat center center';
		return elm;
	}());

	var defaultOpts = {
		// Automatically update the page title as the user swipes through
		// photos?
		automaticTitles: true,
		// Hide the titlebar automatically, using whichever gestures are
		// recognized on the device's native photo viewer.
		autoHideTitle: true,
		// An element used as a placeholder while photos are loading.
		// A duplicate is made each time it is used.
		loadingElm: defaultLoadingElm,
		// Photo index to start at.
		startAt: 0
	};

	return PhotoViewer;

	// PhotoViewer takes over the content pane of your app screen.
	// It wraps SlideViewer for the common case of simply displaying
	// a set of photos in the content of your app.
	function PhotoViewer(page, urls, opts) {
		var self = this;
		var slideviewer;
		var eventBus = new EventBus();
		var content = page; //SGOETZ
		content.setAttribute("data-no-scroll", "true");
		content.style.overflow = 'visible';
		var topbar = document.getElementById('content').querySelector('header'); //SGOETZ
		var title = topbar.querySelector('.title'); //SGOETZ

		var topbarVisible = true;
		var wrapper = document.createElement('div');
		wrapper.style.width = '100%';
		wrapper.style.height = '100%';

		self.on = eventBus.on;
		self.off = eventBus.off;

		function validateArgs() {
			if (!page) throw new TypeError("Page argument required!");
			if (!urls) throw new TypeError("You gave me an empty list of urls, I can't do anything with that!");
			if (!Array.isArray(urls)) {
				throw new TypeError("PhotoViewer setSource expects an array of photo URLs for a source, '" + newSource + "' given.");
			}
			opts = opts || {};
			for (var o in defaultOpts) {
                if (!defaultOpts.hasOwnProperty(o)) continue;
				opts[o] = opts[o] === undefined ? defaultOpts[o] : opts[o];
			}
		}
		validateArgs();

        //ONIGOETZ :: make these publicly available
        self.resize = appLayout;
        self.kill = appBack;

		// Force 3d acceleration of the loading image to avoid flickers
		// on iOS.
		opts.loadingElm.style.webkitBackfaceVisibility = 'hidden';
		replaceChildren(content, opts.loadingElm);

		if (opts.autoHideTitle) {
			Clickable(wrapper);
			wrapper.addEventListener('click', toggleTitleBar, false);
		}

		updateTitle(opts.startAt, urls.length);

		page.addEventListener('appLayout', appLayout, false);
		page.addEventListener('appBack', appBack, false);

        afterAppShow();

		function appLayout() {
			if (!slideviewer) return;
			slideviewer.refreshSize();
			slideviewer.eachMaster(function (elm) {
				var wrap = elm.querySelector('div');
				var img = elm.querySelector('img');
				if (wrap && img) {
					centerImage(wrap, img);
				}
			});
		}

		function appBack() {
			//page.removeEventListener('appShow', appShow, false);
			page.removeEventListener('appShow', afterAppShow, false);
			page.removeEventListener('appLayout', appLayout, false);
			page.removeEventListener('appBack', appBack, false);
			if (!slideviewer) return;

			if (platform === 'android') {
				// Android cannot have any 3d!
				slideviewer.disable3d();
				var elm = slideviewer.curMaster();
				var img = elm.querySelector('img');
				img.style.webkitBackfaceVisibility = '';

				// This clips the image under the titlebar, but is the only
				// way we can seem to avoid flicker when removing 3d from
				// the slideviewer.
				content.style.overflow = 'hidden';
			}
			slideviewer.eachMaster(function (elm, page) {
				if (page !== slideviewer.page()) {
					elm.style.visibility = 'hidden';
				}
			});
		}


		function toggleTitleBar() {
			if (topbarVisible) showTitleBar();
			else hideTitleBar();
		}

		function showTitleBar() {
			if (platform == 'ios') {
				topbar.style.opacity = '1';
				topbar.style.pointerEvents = '';
			} else {
				setTransform(topbar, '');
			}
			topbarVisible = false;
		}

		function hideTitleBar() {
			if (platform == 'ios') {
				topbar.style.opacity = '0';
				topbar.style.pointerEvents = 'none';
			} else {
				setTransform(topbar, 'translate3d(0, -100%, 0)');
			}
			topbarVisible = true;
		}

		function updateTitle(i, len) {
			if (opts.automaticTitles) {
				title.innerText = (i + 1) + " of " + len;
			}
		}

		function afterAppShow() {
			if (platform == 'ios') {
				setTransition(topbar, 'opacity 0.5s ease-in-out 200ms');
			} else {
				setTransition(topbar, 'transform 0.5s ease-in-out 200ms');
			}

			// We don't want to have the slideview in the page when we
			// are transitioning in, as having a 3d transform within a
			// 3d transform makes things really laggy. Hence, we wait
			// until after the app is shown to add the "real" slideview
			// to the page.
			replaceChildren(content, wrapper);

			slideviewer = new PhotoViewer._SlideViewer(wrapper, source, {
				allowScroll: false,
				length: urls.length,
				startAt: opts.startAt,
				bufferDist: 50
			});
			slideviewer.on('flip', onFlip);
			onFlip(opts.startAt, slideviewer.curMaster());

			if (platform == 'ios') {
				slideviewer.on('move', hideTitleBar);
			}

			function source(i) {
				var wrap = document.createElement('div');
				var ws = wrap.style;
				ws.position = 'absolute';
				ws.top = '0px';
				ws.left = '0px';
				ws.width = '100%';
				ws.height = '100%';
				ws.overflow = 'hidden';
				// Android 4.2 occasionally leaves behind artifacts if
				// the wrapper has a transparent background.
				ws.background = 'black';

				var loading = opts.loadingElm.cloneNode(true /* deep copy */);
				wrap.appendChild(loading);

				var img = document.createElement('img');
				img.src = urls[i];

				// Hack to get rid of flickering on images (iPhone bug) by
				// forcing hardware acceleration. See
				// http://stackoverflow.com/questions/3461441/prevent-flicker-on-webkit-transition-of-webkit-transform
				img.style.webkitBackfaceVisibility = 'hidden';

				// For desktop browsers
				img.style.webkitUserSelect = 'none';
				img.style.webkitUserDrag = 'none';

				img.style.margin = '0 auto';
				img.style.display = 'none';

				img.onload = function () {
					centerImage(wrap, img);
					img.style.display = 'block';
					wrap.removeChild(loading);
				};
				wrap.appendChild(img);
				return wrap;
			}

			var zoomable;
			function onFlip(page, elm) {
				updateTitle(page, urls.length);

				if (PhotoViewer._Zoomable.deviceSupported) {
					var wrap = elm.querySelector('div');
					var img = elm.querySelector('img');

					if (zoomable) zoomable.reset().destroy();
					zoomable = new PhotoViewer._Zoomable(wrap, img, slideviewer);
				}

				eventBus.fire('flip', page);
			}
		}

		function centerImage(wrap, img) {
			// I shouldn't really have to do this, but offsetHeight and friends
			// seem to be failing sparadically. Oh well, we can do this manually!
			var h = img.naturalHeight;
			var w = img.naturalWidth;
			var r = h / w;
			var ch = opts.autoHideTitle ? window.innerHeight : content.offsetHeight;
			var cw = content.offsetWidth;

			if (h > ch) {
				h = ch;
				w = h / r;
			}

			if (w > cw) {
				w = cw;
				h = w * r;
			}

			var oh = opts.autoHideTitle ? topbar.offsetHeight : 0;
			var marginTop = round(Math.max((ch - h) / 2, 0));

			var is = img.style;
			is.marginTop = marginTop + 'px';
			is.width = w + 'px';
			is.height = h + 'px';

			var ws = wrap.style;
			ws.width = cw + 'px';
			ws.height = ch + 'px';
			ws.top = -oh + 'px';
		}
	}

	// http://github.com/crazy2be/EventBus.js
	function EventBus() {
		var self = this;
		var callbacks = {};
		self.callbacks = callbacks;

		// remove modifies the list which it is passed,
		// removing all occurances of val.
		function remove(list, val) {
			for (var i = 0; i < list.length; i++) {
				if (list[i] === val) {
					list.splice(i, 1);
				}
			}
		}

		// Register a callback for the specified event. If the
		// callback is already registered for the event, it is
		// not added again.
		self.on = function (ev, cb) {
			var list = callbacks[ev] || [];
			remove(list, cb);
			list.push(cb);
			callbacks[ev] = list;
			return self;
		};

		// Remove a callback for the specified event. If the callback
		// has not been registered, it does not do anything. If the
		// second argument is undefined, it removes all handlers for
		// the specified event.
		self.off = function (ev, cb) {
			if (cb === undefined) {
				delete callbacks[ev];
				return self;
			}
			var list = callbacks[ev];
			if (!list) return self;
			remove(list, cb);
			return self;
		};

		// Fire an event, passing each registered handler all of
		// the specified arguments. Within the handler, this is
		// set to null.
		self.fire = function (ev, arg1, arg2/*, ...*/) {
			var list = callbacks[ev];
			if (!list) return;
			var args = Array.prototype.slice.call(arguments, 1);
			for (var i = 0; i < list.length; i++) {
				list[i].apply(null, args);
			}
			return self;
		}
	}

	function round(num, places) {
		if (places === undefined) places = 0;

		var factor = Math.pow(10, places);
		return Math.round(num * factor) / factor;
	}

	// Removes all children of node, then adds
	// newChild as a child.
	function replaceChildren(node, newChild) {
		while (node.firstChild) {
			node.removeChild(node.firstChild);
		}
		node.appendChild(newChild);
	}

	function setTransition(elm, val) {
		elm.style.transition = val;
		elm.style.webkitTransition = '-webkit-' + val;
	}

	function setTransform(elm, val) {
		elm.style.transform = val;
		elm.style.webkitTransform = val;
	}
}(window.platform));

PhotoViewer._SlideViewer = (function () {
	var defaultOpts = {
		// Should we allow scrolling in scrollable
		// regions inside or outside of the slideviewer?
		// If set to true, we will ignore all gestures
		// which start off moving more in the y
		// direction than in the x direction.
		allowScroll: true,
		// If your source function is bounded by some
		// known limit, you can set it here.
		length: 10,
		// If you want to start somewhere other than
		// on the first slide, setting this (rather
		// than calling .setPage()) will prevent your
		// source function being called more times
		// than necessary.
		startAt: 0,
		// How far from the point of initial contact does the user
		// have to move their fingers before we interpret their
		// action?
		bufferDist: 10,
		// What should we show to the user when the generator threw
		// an error or returned an invalid output? You can override
		// this when shipping your application, so that in the event
		// something does go wrong in your code, you can show a
		// friendlier error page.
		errorGenerator: defaultErrorGenerator
	};

	// Wrapper is an element which will contain the slideviewer. It should
	// have an explict height (and width, if not display: block) set.
	// Source is a generator function. Given a page index, it should
	// return an element to use as the slide for that page index.
	function SlideViewer(wrapper, source, opts) {
		var self = this;
		var slider;
		var masters = [];
		var activeMaster = 0;
		var xPos = 0;
		var minX = 0;
		var snapThreshold = 0;
		var pageWidth = 0;
		var inputhandler = new InputHandler();

		function validateArgs() {
			if (!isElement(wrapper)) {
				throw new TypeError("SlideViewer first argument should be a DOM node which wraps the slider. Got " + wrapper);
			}
			if (typeof source !== 'function') {
				throw new TypeError("SlideViewer second argument should be a generator function!");
			}

			opts = opts || {};
			for (var opt in defaultOpts) {
				if (defaultOpts.hasOwnProperty(opt) && opts[opt] === undefined) {
					opts[opt] = defaultOpts[opt];
				}
			}
		}
		validateArgs();

		var len = opts.length;
		var page = opts.startAt;

		function init() {
			wrapper.style.postition = 'relative';
			wrapper.innerHTML = '';

			slider = document.createElement('div');
			var s = slider.style;
			s.position = 'relative';
			s.top = '0';
			s.height = '100%';
			s.width = '100%';
			s[prefixStyle('transitionTimingFunction')] = 'ease-out';
			wrapper.appendChild(slider);

			for (var i = -1; i < 2; i++) {
				var page = document.createElement('div');
				s = page.style;
				s.position = 'absolute';
				s.top = '0';
				s.height = '100%';
				s.width = '100%';
				s.left = i * 100 + '%';

				slider.appendChild(page);
				masters.push({elm: page});
			}

			inputhandler.attach(wrapper, slider);
			inputhandler.on('start', onStart);
			inputhandler.on('resize', self.refreshSize);
			eventBus.on('destroy', function () {
				inputhandler.detach();
			});

			self.refreshSize();
			self.setPage(opts.startAt);
		}

		var eventBus = new EventBus();
		self.on = eventBus.on;
		self.off = eventBus.off;

		self.refreshSize = function () {
			pageWidth = wrapper.clientWidth;
			minX = (1 - len) * pageWidth;
			snapThreshold = Math.round(pageWidth * 0.15);
			setTransitionDuration(0);
			setPos(-page * pageWidth);
			return self;
		};

		self.setLen = function (n) {
			len = n;
			self.refreshSize();
			return self;
		};

		self.page = function () {
			return page;
		};

		var prevPage = -1;
		self.setPage = function (newPage) {
			if (typeof newPage !== 'number') {
				throw new TypeError("SlideViewer.setPage() requires a number! ('" + newPage + "' given)");
			}
			function positionMasters(a, b, c) {
				var m = masters;
				var sa = m[a].elm.style;
				var sb = m[b].elm.style;
				var sc = m[c].elm.style;

				sa.left = (page - 1) * 100 + '%';
				if (page === 0) sa.visibility = 'hidden';
				else sa.visibility = 'visible';

				sb.left = page * 100 + '%';
				sb.visibility = 'visible';

				sc.left = (page + 1) * 100 + '%';
				if (page === len - 1) sc.visibility = 'hidden';
				else sc.visibility = 'visible';

				m[a].newPage = page - 1;
				m[b].newPage = page;
				m[c].newPage = page + 1;
			}
			page = clamp(newPage, 0, len - 1);
			setTransitionDuration(0);
			setPos(-page * pageWidth);

			activeMaster = mod(page + 1, 3);

			if (activeMaster === 0) {
				positionMasters(2, 0, 1);
			} else if (activeMaster == 1) {
				positionMasters(0, 1, 2);
			} else {
				positionMasters(1, 2, 0);
			}

			for (var i = 0; i < 3; i++) {
				var m = masters[i];
				if (m.newPage == m.page) continue;

				m.elm.innerHTML = '';
				if (m.newPage >= 0 && m.newPage < opts.length) {
					m.elm.appendChild(getElement(m.newPage));
				}

				m.page = m.newPage;
			}

			if (prevPage !== newPage) {
				eventBus.fire('flip', newPage, masters[activeMaster].elm);
				prevPage = newPage;
			}

			return self;
		};

		self.curMaster = function () {
			for (var i = 0; i < 3; i++) {
				if (masters[i].page == page) return masters[i].elm;
			}
			throw Error("No master is displaying our current page. This is a bug! Current page: " + i + ", masters: " + JSON.serialize(masters));
		};

		self.eachMaster = function (cb) {
			for (var i = 0; i < 3; i++) {
				cb(masters[i].elm, masters[i].page);
			}
		};

		self.invalidate = function () {
			for (var i = 0; i < 3; i++) masters[i].page = -1;
			self.setPage(page);
			return self;
		};

		self.destroy = function () {
			eventBus.fire('destroy');
			return self;
		};

		self.disable = function () {
			inputhandler.disableTouch();
		};

		self.enable = function () {
			inputhandler.enableTouch();
		};

		// Are we actually moving the slideviewer in response
		// to a user's touch currently? Useful for determining
		// what component should handle a touch interaction.
		self.moving = function () {
			return directionLocked;
		};

		// Although this typically makes things slower, it can
		// reduce the occurance of rare bugs, especially bugs
		// relating to the manipulation of the slideviewer
		// element (such as fading it in and out).
		var use3dAcceleration = true;
		self.disable3d = function () {
			use3dAcceleration = false;
			setPos(xPos);
		};

		// Note that 3d is enabled by default. This should only be used in
		// conjuction with the disable3d() method above.
		self.enable3d = function () {
			use3dAcceleration = true;
			setPos(xPos);
		};

		function setPos(x, cb) {
// 			console.log("setting position to ", x);
			var unchanged = x === xPos;
			var transform = prefixStyle('transform');
			xPos = x;
			// translateZ(0) does not affect our appearance, but hints to the
			// renderer that it should hardware accelerate us, and thus makes
			// things much faster and smoother (usually). For reference, see:
			//     http://www.html5rocks.com/en/tutorials/speed/html5/
			if (use3dAcceleration) {
				slider.style[transform] = 'translateX(' + x + 'px) translateZ(0)';
				slider.style.left = '';
			} else {
				slider.style[transform] = '';
				slider.style.left = x + 'px';
			}

			if (cb) {
				if (unchanged || !supportsTransitions) {
					// We don't get a transitionEnd event if
					// 1) The animated property is unchanged, or
					// 2) The browser doesn't support transitions (duh)
					cb();
				} else {
					inputhandler.on('transitionEnd', cb);
				}
			}
		}

		function setTransitionDuration(t) {
			slider.style[prefixStyle('transitionDuration')] = t + 'ms';
		}

		var startedMoving = false;
		var directionLocked = false;
		function onStart(point) {
			inputhandler.off('start');
			inputhandler.on('end', onEndNoMove);

			var startX = point.pageX;
			var startY = point.pageY;
			var prevX = startX;
			var prevY = startY;
			startedMoving = false;
			directionLocked = false;

			setTransitionDuration(0);
			inputhandler.on('move', onMove);

			function onMove(e, point) {
				var dx = point.pageX - prevX;
				prevX = point.pageX;
				prevY = point.pageY;

				var absX = Math.abs(prevX - startX);
				var absY = Math.abs(prevY - startY);

				// We take a buffer to figure out if the swipe
				// was most likely intended for our consumption.
				// (and not just the start of a zoom operation
				// or other gesture).
				if (!startedMoving && absX < opts.bufferDist && absY < opts.bufferDist) {
					return;
				}
				startedMoving = true;

				// We are scrolling vertically, so skip SlideViewer and give the control back to the browser
				if (absY > absX && !directionLocked && opts.allowScroll) {
					inputhandler.off('move');
					inputhandler.off('end');
					inputhandler.on('start', onStart);
					return;
				}
				directionLocked = true;

				var newX = xPos + dx;
				if (newX > 0 || newX < minX) {
					newX = xPos + (dx / 2);
				}

				e.preventDefault();
				inputhandler.off('end').on('end', onEnd);
				setPos(newX);
				eventBus.fire('move', newX);
			}

			function onEnd(point) {
				inputhandler.off('move');
				inputhandler.off('end');

				prevX = point.pageX;
				var deltaX = prevX - startX;
				var dist = Math.abs(deltaX);
				var newX, time;

				if (xPos > 0 || xPos < minX) dist *= 0.15;

				if (dist < snapThreshold) {
					time = Math.floor(300 * dist / snapThreshold);
					setTransitionDuration(time);

					newX = -page * pageWidth;
					setPos(newX, onTransitionEnd);
					return;
				}

				if (deltaX > 0) {
					page = Math.floor(-xPos / pageWidth);
				} else {
					page = Math.ceil(-xPos / pageWidth);
				}

				newX = -page * pageWidth;

				time = Math.floor(200 * Math.abs(xPos - newX) / pageWidth);
				setTransitionDuration(time);

				setPos(newX, onTransitionEnd);
			}

			function onEndNoMove() {
				inputhandler.off('move');
				inputhandler.off('end');
				inputhandler.on('start', onStart);
			}

			function onTransitionEnd() {
				inputhandler.off('transitionEnd');
				self.setPage(page);
				inputhandler.on('start', onStart);
			}
		}

		function getElement(i) {
			var element, err;
			try {
				element = source(i);
			} catch (e) {
				err = Error("Exception returned from source() function with input " + i + ". Message: " + e.message);
				err.original = e;
				return opts.errorGenerator(err);
			}

			// In case they return us a zepto or jQuery
			// object rather than a raw DOM node
			if (!isElement(element) && element.length) {
				element = element[0];
			}

			if (!isElement(element)) {
				err = new TypeError("Invalid type returned from source() function. Got type " + typeof element + " (with value " + element + "), expected HTMLElement. Input was " + i);
				return opts.errorGenerator(err);
			}

			return element;
		}

		init();
	}

	SlideViewer.needsPreventDefaultHack = (function () {
		var match = /\bAndroid (\d+(\.\d+)?)/.exec(navigator.userAgent);
		if (!match) return false;

		var version = parseFloat(match[1]);
		return version < 4.1;
	}());

	function defaultErrorGenerator(err) {
		if (window.console && console.error) {
			if (err.original) {
				console.error(err.original);
				console.log(err.original.stack);
			} else {
				console.error(err);
				console.log(err.stack);
			}
		}
		var elm = document.createElement('p');
		elm.innerHTML = "There was an error creating this page! Contact the developer for more information." +
			"<br><br>" + err.message + "<br><br>" +
			"If you are the developer, this means you made a mistake in your source() function. If you want to ensure users never see this page, you can override opts.errorGenerator to generate a more user-friendly error page.";
		return elm;
	}

	function InputHandler() {
		var self = this;
		var hasTouch = 'ontouchstart' in window;
		var transitionEndMapping = {
			''			: 'transitionend',
			'webkit'	: 'webkitTransitionEnd',
			'Moz'		: 'transitionend',
			'O'			: 'oTransitionEnd',
			'ms'		: 'MSTransitionEnd'
		};

		var transitionEndEvent = transitionEndMapping[vendor];
		var resizeEvent = 'onorientationchange' in window ? 'orientationchange' : 'resize';
		var startEvent  = hasTouch ? 'touchstart'  : 'mousedown';
		var moveEvent   = hasTouch ? 'touchmove'   : 'mousemove';
		var endEvent    = hasTouch ? 'touchend'    : 'mouseup';
		var cancelEvent = hasTouch ? 'touchcancel' : 'mouseout';

		var lastTouch;
		var touchDisabled = false;

		function findTouch(touches, touchID) {
			for (var i = 0; i < touches.length; i++) {
				if (touches[i].identifier == touchID) return touches[i];
			}
			return null;
		}

		function handleEvent(e) {
			var t = e.type;
			if (t == resizeEvent) {
				eventBus.fire('resize', e);
				return;
			} else if (t == transitionEndEvent) {
				eventBus.fire('transitionEnd', e);
				return;
			}

			if ((t === startEvent || t === moveEvent) && SlideViewer.needsPreventDefaultHack) {
				// Kills native scrolling, but lets our slider work properly.
				// See http://code.google.com/p/android/issues/detail?id=19827
				// and http://code.google.com/p/android/issues/detail?id=5491
				e.preventDefault();
			}

			if (touchDisabled) {
				if (hasTouch && t == startEvent) {
					lastTouch = e.changedTouches[0];
				}
				return;
			}

			var touchID = lastTouch ? lastTouch.identifier : '', touch;
			if (t == startEvent) {
				if (hasTouch) {
					if (lastTouch) return;
				   lastTouch = e.changedTouches[0];
				}
				eventBus.fire('start', hasTouch ? e.changedTouches[0] : e);
			} else if (t == moveEvent) {
				if (!hasTouch) {
					eventBus.fire('move', e, e);
					return
				}

				touch = findTouch(e.touches, touchID);
				lastTouch = touch;
				eventBus.fire('move', e, touch);
			} else if (t == cancelEvent || t == endEvent) {
				if (!hasTouch) {
					eventBus.fire('end', e);
					return;
				}

				if (!lastTouch) return;

				touch = findTouch(e.changedTouches, touchID);
				if (!touch) touch = findTouch(e.touches, touchID);

				eventBus.fire('end', touch);
				lastTouch = null;
			}
		}

		var eventBus = new EventBus();
		self.on = eventBus.on;
		self.off = eventBus.off;

		var wrapper;
		var slider;
		self.attach = function (newWrapper, newSlider) {
			if (wrapper || slider) self.detach();
			wrapper = newWrapper;
			slider = newSlider;

			window.addEventListener(resizeEvent, handleEvent, false);
			slider.addEventListener(transitionEndEvent, handleEvent, false);

			wrapper.addEventListener(startEvent , handleEvent, false);
			wrapper.addEventListener(moveEvent  , handleEvent, false);
			wrapper.addEventListener(endEvent   , handleEvent, false);
			wrapper.addEventListener(cancelEvent, handleEvent, false);

			return self;
		};

		self.detach = function () {
			window.removeEventListener(resizeEvent, handleEvent, false);
			slider.removeEventListener(transitionEndEvent, handleEvent, false);

			wrapper.removeEventListener(startEvent , handleEvent, false);
			wrapper.removeEventListener(moveEvent  , handleEvent, false);
			wrapper.removeEventListener(endEvent   , handleEvent, false);
			wrapper.removeEventListener(cancelEvent, handleEvent, false);

			return self;
		};

		// If a touch is currently happening, simulates touchcancel.
		// Prevents further touch events from being processed.
		self.disableTouch = function () {
			if (lastTouch) {
				eventBus.fire('end', lastTouch);
				lastTouch = null;
			}
			touchDisabled = true;
		};

		// Simulates a touchstart if a touch is currently in progress.
		// Otherwise, enables the processing of future touches.
		self.enableTouch = function () {
			if (lastTouch) {
				eventBus.fire('start', lastTouch);
			}
			touchDisabled = false;
		}
	}

	// http://github.com/crazy2be/EventBus.js
	function EventBus() {
		var self = this;
		var callbacks = {};
		self.callbacks = callbacks;

		// remove modifies the list which it is passed,
		// removing all occurances of val.
		function remove(list, val) {
			for (var i = 0; i < list.length; i++) {
				if (list[i] === val) {
					list.splice(i, 1);
				}
			}
		}

		// Register a callback for the specified event. If the
		// callback is already registered for the event, it is
		// not added again.
		self.on = function (ev, cb) {
			var list = callbacks[ev] || [];
			remove(list, cb);
			list.push(cb);
			callbacks[ev] = list;
			return self;
		};

		// Remove a callback for the specified event. If the callback
		// has not been registered, it does not do anything. If the
		// second argument is undefined, it removes all handlers for
		// the specified event.
		self.off = function (ev, cb) {
			if (cb === undefined) {
				delete callbacks[ev];
				return self;
			}
			var list = callbacks[ev];
			if (!list) return self;
			remove(list, cb);
			return self;
		};

		// Fire an event, passing each registered handler all of
		// the specified arguments. Within the handler, this is
		// set to null.
		self.fire = function (ev, arg1, arg2/*, ...*/) {
			var list = callbacks[ev];
			if (!list) return;
			var args = Array.prototype.slice.call(arguments, 1);
			for (var i = 0; i < list.length; i++) {
				list[i].apply(null, args);
			}
			return self;
		}
	}

	var supportsTransitions = false;
	var vendor = (function () {
		var dummyStyle = document.createElement('div').style;
		var vendors = 'webkitT,MozT,msT,OT,t'.split(',');

		for (var i = 0; i < vendors.length; i++) {
			var transform  = vendors[i] + 'ransform';
			var transition = vendors[i] + 'ransition';
			if (transition in dummyStyle) {
				supportsTransitions = true;
			}
			if (transform in dummyStyle) {
				return vendors[i].substr(0, vendors[i].length - 1);
			}
		}

		return false;
	})();

	function prefixStyle(style) {
		if (vendor === '') return style;
		style = style.charAt(0).toUpperCase() + style.substr(1);
		return vendor + style;
	}

	// Mod in javascript is messed up for negative numbers.
	function mod(a, b) {
		return ((a % b) + b) % b;
	}

	function clamp(n, min, max) {
		return Math.max(min, Math.min(max, n));
	}

	function isElement(o) {
		if (typeof HTMLElement === "object") {
			return o instanceof HTMLElement
		} else {
			return o && typeof o === "object" && o.nodeType === 1 && typeof o.nodeName === "string"
		}
	}

	return SlideViewer;
}());

/*
	Touchy.js
	Socket-style finger management for touch events

	Jairaj Sethi
	http://creativecommons.org/licenses/by/3.0/
*/

!(function (window) {
	window = window || {};

	/* Make sure I can itereate through arrays */
	var forEach = function () {
		if (Array.prototype.forEach) {
			return function (arr, callback, self) {
				Array.prototype.forEach.call(arr, callback, self);
			};
		}

		else {
			return function (arr, callback, self) {
				for (var i=0, len=arr.length; i<len; i++) {
					if (i in arr) {
						callback.call(self, arr[i], i, arr);
					}
				}
			};
		}
	}();

	/* Make sure I can search through arrays */
	var indexOf = function () {
		if (Array.prototype.indexOf) {
			return function (arr, item, startIndex) {
				return Array.prototype.indexOf.call(arr, item, startIndex);
			};
		}

		else {
			return function (arr, item, startIndex) {
				for (var i=startIndex || 0, len=arr.length; i<len; i++) {
					if ((i in arr) && (arr[i] === item)) {
						return i;
					}
				}

				return -1;
			};
		}
	}();

	/* Make sure I can map arrays */
	var map = function () {
		if (Array.prototype.map) {
			return function (arr, callback, self) {
				return Array.prototype.map.call(arr, callback, self);
			};
		}

		else {
			return function (arr, callback, self) {
				var len = arr.length,
					mapArr = new Array(len);

				for (var i=0; i<len; i++) {
					if (i in arr) {
						mapArr[i] = callback.call(self, arr[i], i, arr);
					}
				}

				return mapArr;
			};
		}
	}();

	/* Make sure I can filter arrays */
	var filter = function () {
		if (Array.prototype.filter) {
			return function (arr, func, self) {
				return Array.prototype.filter.call(arr, func, self);
			};
		}

		else {
			return function (arr, func, self) {
				var filterArr = [];

				for (var val, i=0, len=arr.length; i<len; i++) {
					val = arr[i];

					if ((i in arr) && func.call(self, val, i, arr)) {
						filterArr.push(val);
					}
				}

				return filterArr;
			};
		}
	}();

	/* Bind event listener to element */
	var boundEvents = {};

	function bind (elem, eventName, callback) {
		if (elem.addEventListener) {
			elem.addEventListener(eventName, callback, false);
		}

		else if (elem.attachEvent) {
			var eID = elem.attachEvent('on'+eventName, callback);
			boundEvents[eID] = { name: eventName, callback: callback };
		}
	}

	function unbind (elem, eventName, callback) {
		if (elem.removeEventListener) {
			elem.removeEventListener(eventName, callback, false);
		}

		else if (elem.detachEvent) {
			for (var eID in boundEvents) {
				if ((boundEvents[eID].name === eventName) &&
						(boundEvents[eID].callback === callback)) {
					elem.detachEvent(eID);
					delete boundEvents[eID];
				}
			}
		}
	}

	/* Simple inheritance */
	function inheritsFrom (func, parent) {
		var proto = func.prototype,
			superProto = parent.prototype,
			oldSuper;

		for (var prop in superProto) {
			proto[prop] = superProto[prop];
		}

		function superMethod (name) {
			var args = Array.prototype.slice.call(arguments, 1);

			if ( superProto[name] ) {
				return superProto[name].apply(this, args);
			}
		}

		if (proto._super) {
			oldSuper = proto._super;

			proto._super = function () {
				oldSuper.call(this, arguments);
				superMethod.call(this, arguments);
			};
		}

		else {
			proto._super = superMethod;
		}
	}



	/* Event bus to handle finger event listeners */
	function EventBus () {
		this.onEvents = {};
		this.onceEvents = {};
	}

	/* Attach a handler to listen for an event */
	EventBus.prototype.on = function (name, callback) {
		if ( !callback ) {
			return;
		}

		if (name in this.onEvents) {
			var index = indexOf(this.onEvents[name], callback);

			if (index != -1) {
				return;
			}
		}

		else {
			this.onEvents[name] = [];
		}

		if (name in this.onceEvents) {
			var index = indexOf(this.onceEvents[name], callback);

			if (index != -1) {
				this.onceEvents.splice(index, 1);
			}
		}

		this.onEvents[name].push(callback);
	};

	/* Attach a one-time-use handler to listen for an event */
	EventBus.prototype.once = function (name, callback) {
		if ( !callback ) {
			return;
		}

		if (name in this.onceEvents) {
			var index = indexOf(this.onceEvents[name], callback);

			if (index != -1) {
				return;
			}
		}

		else {
			this.onceEvents[name] = [];
		}

		if (name in this.onEvents) {
			var index = indexOf(this.onEvents[name], callback);

			if (index != -1) {
				this.onEvents.splice(index, 1);
			}
		}

		this.onceEvents[name].push(callback);
	};

	/* Detach a handler from listening for an event */
	EventBus.prototype.off = function (name, callback) {
		if ( !callback ) {
			return;
		}

		if (name in this.onEvents) {
			var index = indexOf(this.onEvents[name], callback);

			if (index != -1) {
				this.onEvents.splice(index, 1);
				return;
			}
		}

		if (name in this.onceEvents) {
			var index = indexOf(this.onceEvents[name], callback);

			if (index != -1) {
				this.onceEvents.splice(index, 1);
				return;
			}
		}
	};

	/* Fire an event, triggering all handlers */
	EventBus.prototype.trigger = function (name) {
		var args = Array.prototype.slice.call(arguments, 1),
			callbacks = (this.onEvents[name] || []).concat(this.onceEvents[name] || []),
			callback;

		while (callback = callbacks.shift()) {
			callback.apply(this, args);
		}
	};



	/* Object to manage a single-finger interactions */
	function Finger (id) {
		this._super('constructor');
		this.id        = id;
		this.lastPoint = null;
	}
	inheritsFrom(Finger, EventBus);



	/* Object to manage multiple-finger interactions */
	function Hand (ids) {
		this._super('constructor');

		this.fingers = !ids ? [] : map(ids, function (id) {
			return new Finger(id);
		});
	}
	inheritsFrom(Hand, EventBus);

	/* Get finger by id */
	Hand.prototype.get = function (id) {
		var foundFinger;

		forEach(this.fingers, function (finger) {
			if (finger.id == id) {
				foundFinger = finger;
			}
		});

		return foundFinger;
	};



	/* Convert DOM touch event object to simple dictionary style object */
	function domTouchToObj (touches, time) {
		return map(touches, function (touch) {
			return {
				id: touch.identifier,
				x: touch.pageX,
				y: touch.pageY,
				time: time
			};
		});
	}

	function domMouseToObj (mouseEvent, mouseID) {
		return [{
			id: mouseID,
			x: mouseEvent.pageX,
			y: mouseEvent.pageY,
			time: mouseEvent.timeStamp
		}];
	}



	/* Controller object to handle Touchy interactions on an element */
	function TouchController (elem, handleMouse, settings) {
		if (typeof settings == 'undefined') {
			settings = handleMouse;
			handleMouse = false;
		}

		if (typeof settings == 'function') {
			settings = { any: settings };
		}

		for (var name in plugins) {
			if (name in settings) {
				var updates = plugins[name](elem, settings[name]);

				if (typeof updates == 'function') {
					updates = { any: updates };
				}

				for (var handlerType in updates) {
					if (handlerType in settings) {
						settings[handlerType] = (function (handler1, handler2) {
							return function () {
								handler1.call(this, arguments);
								handler2.call(this, arguments);
							};
						})(settings[handlerType], updates[handlerType]);
					}

					else {
						settings[handlerType] = updates[handlerType];
					}
				}
			}
		}

		this.running = false;
		this.elem = elem;
		this.handleMouse = !!handleMouse;
		this.settings = settings || {};
		this.mainHand = new Hand();
		this.multiHand = null;
		this.mouseID = null;

		this.start();
	};

	/* Start watching element for touch events */
	TouchController.prototype.start = function () {
		if (this.running) {
			return;
		}
		this.running = true;

		bind(this.elem, 'touchstart' , this.touchstart());
		bind(this.elem, 'touchmove'  , this.touchmove() );
		bind(this.elem, 'touchcancel', this.touchend()  );
		bind(this.elem, 'touchend'   , this.touchend()  );

		if ( this.handleMouse ) {
			bind(this.elem, 'mousedown', this.mousedown());
			bind(this.elem, 'mouseup'  , this.mouseup()  );
			bind(this.elem, 'mouseout' , this.mouseup()  );
			bind(this.elem, 'mousemove', this.mousemove());
		}
	};

	/* Stop watching element for touch events */
	TouchController.prototype.stop = function () {
		if ( !this.running ) {
			return;
		}
		this.running = false;

		unbind(this.elem, 'touchstart' , this.touchstart());
		unbind(this.elem, 'touchmove'  , this.touchmove() );
		unbind(this.elem, 'touchend'   , this.touchend()  );
		unbind(this.elem, 'touchcancel', this.touchend()  );

		unbind(this.elem, 'mousedown', this.mousedown());
		unbind(this.elem, 'mouseup'  , this.mouseup()  );
		unbind(this.elem, 'mouseout' , this.mouseup()  );
		unbind(this.elem, 'mousemove', this.mousemove());
	};

	/* Return a handler for DOM touchstart event */
	TouchController.prototype.touchstart = function () {
		if ( !this._touchstart ) {
			var self = this;
			this._touchstart = function (e) {
				var touches = domTouchToObj(e.touches, e.timeStamp),
					changedTouches = domTouchToObj(e.changedTouches, e.timeStamp);

				self.mainHandStart(changedTouches);
				self.multiHandStart(changedTouches, touches);
				e.preventDefault();
			};
		}

		return this._touchstart;
	};

	/* Return a handler for DOM touchmove event */
	TouchController.prototype.touchmove = function () {
		if ( !this._touchmove ) {
			var self = this;
			this._touchmove = function (e) {
				var touches = domTouchToObj(e.touches, e.timeStamp),
					changedTouches = domTouchToObj(e.changedTouches, e.timeStamp);

				self.mainHandMove(changedTouches);
				self.multiHandMove(changedTouches, touches);
				e.preventDefault();
			};
		}

		return this._touchmove;
	};

	/* Return a handler for DOM touchend event */
	TouchController.prototype.touchend = function () {
		if ( !this._touchend ) {
			var self = this;
			this._touchend = function (e) {
				var touches = domTouchToObj(e.touches, e.timeStamp),
					changedTouches = domTouchToObj(e.changedTouches, e.timeStamp);

				self.mainHandEnd(changedTouches);
				self.multiHandEnd(changedTouches, touches);
				e.preventDefault();
			};
		}

		return this._touchend;
	};

	/* Return a handler for DOM mousedown event */
	TouchController.prototype.mousedown = function () {
		if ( !this._mousedown ) {
			var self = this;
			this._mousedown = function (e) {
				var touches;

				if ( self.mouseID ) {
					touches = domMouseToObj(e, self.mouseID);
					self.mainHandEnd(touches);
					self.multiHandEnd(touches, touches);
					self.mouseID = null;
				}

				self.mouseID = Math.random() + '';

				touches = domMouseToObj(e, self.mouseID);
				self.mainHandStart(touches);
				self.multiHandStart(touches, touches);
			};
		}

		return this._mousedown;
	};

	/* Return a handler for DOM mouseup event */
	TouchController.prototype.mouseup = function () {
		if ( !this._mouseup ) {
			var self = this;
			this._mouseup = function (e) {
				if (e.type === 'mouseout') {
					var elem = e.relatedTarget || e.toElement;
					while (elem) {
						if (elem === self.elem) {
							return;
						}
						elem = elem.parentNode;
					}
				}

				var touches;

				if ( self.mouseID ) {
					touches = domMouseToObj(e, self.mouseID);
					self.mainHandEnd(touches);
					self.multiHandEnd(touches, touches);
					self.mouseID = null;
				}
			};
		}

		return this._mouseup;
	};

	/* Return a handler for DOM mousemove event */
	TouchController.prototype.mousemove = function () {
		if ( !this._mousemove ) {
			var self = this;
			this._mousemove = function (e) {
				var touches;

				if ( self.mouseID ) {
					touches = domMouseToObj(e, self.mouseID);
					self.mainHandMove(touches);
					self.multiHandMove(touches, touches);
				}
			};
		}

		return this._mousemove;
	};

	/* Handle the start of an individual finger interaction */
	TouchController.prototype.mainHandStart = function (changedTouches) {
		var self = this,
			newFingers = [];

		forEach(changedTouches, function (touch) {
			var finger = new Finger(touch.id);
			finger.lastPoint = touch;
			newFingers.push([ finger, touch ]);
			self.mainHand.fingers.push(finger);
		});

		forEach(newFingers, function (data) {
			self.settings.any && self.settings.any.call(self, self.mainHand, data[0]);
			data[0].trigger('start', data[1]);
		});

		self.mainHand.trigger('start', changedTouches);
	};

	/* Handle the movement of an individual finger interaction */
	TouchController.prototype.mainHandMove = function (changedTouches) {
		var self = this,
			movedFingers = [];

		forEach(changedTouches, function (touch) {
			var finger = self.mainHand.get(touch.id);

			if ( !finger ) {
				return;
			}

			finger.lastPoint = touch;
			movedFingers.push([ finger, touch ]);
		});

		forEach(movedFingers, function (data) {
			data[0].trigger('move', data[1]);
		});

		self.mainHand.trigger('move', changedTouches);
	};

	/* Handle the end of an individual finger interaction */
	TouchController.prototype.mainHandEnd = function (changedTouches) {
		var self = this,
			endFingers = [];

		forEach(changedTouches, function (touch) {
			var finger = self.mainHand.get(touch.id),
				index;

			if ( !finger ) {
				return;
			}

			finger.lastPoint = touch;
			endFingers.push([ finger, touch ]);

			index = indexOf(self.mainHand.fingers, finger);
			self.mainHand.fingers.splice(index, 1);
		});

		forEach(endFingers, function (data) {
			data[0].trigger('end', data[1]);
		});

		self.mainHand.trigger('end', changedTouches);
	};

	/* Handle the start of a multi-touch interaction */
	TouchController.prototype.multiHandStart = function (changedTouches, touches) {
		this.multiHandDestroy();
		this.multiHandRestart(touches);
	};

	/* Handle the movement of a multi-touch interaction */
	TouchController.prototype.multiHandMove = function (changedTouches, touches) {
		var self = this,
			movedFingers = [];

		forEach(changedTouches, function (touch) {
			var finger = self.multiHand.get(touch.id);

			if( !finger ) {
				return;
			}

			finger.lastPoint = touch;
			movedFingers.push([ finger, touch ]);
		});

		forEach(movedFingers, function (data) {
			data[0].trigger('move', data[1]);
		});

		self.multiHand.trigger('move', changedTouches);
	};

	/* Handle the end of a multi-touch interaction */
	TouchController.prototype.multiHandEnd = function (changedTouches, touches) {
		this.multiHandDestroy();

		var remainingTouches = filter(touches, function (touch) {
			var unChanged = true;

			forEach(changedTouches, function (changedTouch) {
				if (changedTouch.id == touch.id) {
					unChanged = false;
				}
			});

			return unChanged;
		});

		this.multiHandRestart(remainingTouches);
	};

	/* Create a new hand based on the current touches on the screen */
	TouchController.prototype.multiHandRestart = function (touches) {
		var self = this;

		if (touches.length == 0) {
			return;
		}

		self.multiHand = new Hand();
		var newFingers = [];

		forEach(touches, function (touch) {
			var finger = new Finger(touch.id);

			finger.lastPoint = touch;
			newFingers.push([ finger, touch ]);
			self.multiHand.fingers.push(finger);
		});

		var func = self.settings[ {
			1: 'one',
			2: 'two',
			3: 'three',
			4: 'four',
			5: 'five'
		}[ self.multiHand.fingers.length ] ];

		func && func.apply(self, [ self.multiHand ].concat( self.multiHand.fingers ));

		forEach(newFingers, function (data) {
			data[0].trigger('start', data[1]);
		});

		self.multiHand.trigger('start', touches);
	};

	/* Destroy the current hand regardless of fingers on the screen */
	TouchController.prototype.multiHandDestroy = function () {
		if ( !this.multiHand ) {
			return;
		}

		var points = [];

		forEach(this.multiHand.fingers, function (finger) {
			var point = finger.lastPoint;
			points.push(point);
			finger.trigger('end', point);
		});

		this.multiHand.trigger('end', points);

		this.multiHand = null;
	};

	/* Socket-style finger management for multi-touch events */
	function Touchy (elem, handleMouse, settings) {
		return new TouchController(elem, handleMouse, settings);
	}

	/* Plugin support for custom touch handling */
	var plugins = {};
	Touchy.plugin = function (name, callback) {
		if (name in plugins) {
			throw 'Touchy: ' + name + ' plugin already defined';
		}

		plugins[name] = callback;
	};

	/* Prevent window movement (iOS fix) */
	var preventDefault = function (e) { e.preventDefault() };

	Touchy.stopWindowBounce = function () {
		bind(window, 'touchmove', preventDefault);
	};

	Touchy.startWindowBounce = function () {
		unbind(window, 'touchmove', preventDefault);
	};

	/* Publicise object */
	PhotoViewer._Touchy = Touchy;
}(window));

// Zoomable lets you make things zoom!
// Give it a viewport - used to listen for touch events,
// and an element to zoom, and it will do the rest.
//
// You can also give it a parent widget if you want to have them
// contend for touch events and not conflict (at least, not too
// badly). Photoviewer uses this to mediate touches
// between zoomable and slideviewer.
PhotoViewer._Zoomable = function Zoomable(viewport, element, parent) {
	if (viewport === undefined) {
		throw new TypeError("Zoomable requires a viewport element as it's first argument!");
	}
	if (element === undefined) {
		throw new TypeError("Zoomable requires a element to zoom as it's second argument!");
	}
	if (parent === undefined) {
		parent = {
			enable: function () {},
			disable: function () {},
			moving: function () {
				return false;
			}
		};
	}

	var self = this;
	var prevTouchEnd = 0;
	var x, y, scale;

	self.reset = function () {
		x = 0;
		y = 0;
		scale = 1;
		prevTouchEnd = 0;
		setTransform(0);
		return self;
	};

	self.destroy = function () {
		touchy.stop();
		return self;
	};

	var touchy = PhotoViewer._Touchy(viewport, {
		one: one,
		two: two
	});

	self.reset();

	function one(hand, finger) {
		var prevX = finger.lastPoint.x;
		var prevY = finger.lastPoint.y;

		var maxX = findMaxX();
		if (Math.abs(x) >= maxX) {
			parent.enable();
		}
		boundXandY();

		finger.on('move', function (point) {
			prevTouchEnd = 0;
			if (scale <= 1) return;

			var dx = (point.x - prevX) / scale;
			var dy = (point.y - prevY) / scale;
			x += dx;
			y += dy;

			prevX = point.x;
			prevY = point.y;

			var maxX = findMaxX();
			if (Math.abs(x) <= maxX) {
				parent.disable();
			} else if (parent.moving()) {
				return;
			}

			setTransform(0);
		});

		finger.on('end', function (point) {
			if (parent.moving()) {
				boundXandY();
				setTransform(300);
				return;
			}

			var t = Date.now();
			var diff = t - prevTouchEnd;
			if (diff > 200) {
				prevTouchEnd = t;

				boundXandY();
				setTransform(500);
				return;
			}

			// Tap to zoom behaviour
			if (scale <= 1) {
				scale = 2;
				var ic = sc2ic(finger.lastPoint);
				x = ic.x;
				y = ic.y;
				boundXandY();
				setTransform(500);
			} else {
				scale = 1;
				x = 0;
				y = 0;
				setTransform(500);
			}
			prevTouchEnd = 0;
		});
	}

	function two(hand, finger1, finger2) {
		prevTouchEnd = 0;
		if (parent.moving()) return;
		parent.disable();

		var p1 = finger1.lastPoint;
		var p2 = finger2.lastPoint;

		var prevDist = dist(p1, p2);
		var startCenter = sc2ic(center(p1, p2));

		hand.on('move', function (points) {
			var p1 = finger1.lastPoint;
			var p2 = finger2.lastPoint;
			var newDist = dist(p1, p2);
			scale *= newDist / prevDist;
			prevDist = newDist;

			// We try and keep the same center, in
			// image coordinates, for the pinch
			// as the user had when they started.
			// This allows two finger panning, and a
			// pleasent "zooms to your fingers"
			// feeling.
			var newCenter = sc2ic(center(p1, p2));
			x += startCenter.x - newCenter.x;
			y += startCenter.y - newCenter.y;

			setTransform(0);
		});

		hand.on('end', function () {
			var minZoom = 1;
			var maxZoom = 4;
			if (scale <= 1) {
				parent.enable();
			}
			if (scale < minZoom) {
				scale = minZoom;
				x = 0;
				y = 0;
			}
			if (scale > maxZoom) {
				scale = maxZoom;
			}
			boundXandY();
			setTransform(300);
		});
	}

	function dist(p1, p2) {
		return Math.sqrt(
			Math.pow(p1.x - p2.x, 2) +
			Math.pow(p1.y - p2.y, 2)
		);
	}
	function center(p1, p2) {
		return {
			x: (p1.x + p2.x) / 2,
			y: (p1.y + p2.y) / 2
		};
	}
	function setTransform(t) {
		var r = function (num, places) {
			var multiplier = Math.pow(10, places);
			return Math.round(num * multiplier) / multiplier;
		};
		var tx = r(x * scale, 2);
		var ty = r(y * scale, 2);
		var ts = r(scale, 2);

		var tr = 'translateX(' + tx + 'px) ' +
		'translateY(' + ty + 'px) ' +
		'scale(' + ts + ',' + ts + ')';
		var tp = t === 0 ? 'none' : 'all';
		var td = r(t, 0) + 'ms';

		var s = element.style;
		s.webkitTransitionProperty = tp;
		s.webkitTransitionDuration = td;
		s.webkitTransform = tr;
	}
	function viewHalfX() {
		return viewport.offsetWidth / 2;
	}
	function viewHalfY() {
		return viewport.offsetHeight / 2;
	}
	function findMaxX() {
		var maxX = element.offsetWidth / 2 - viewHalfX() / scale;
		if (maxX < 0) return 0;
		else return maxX;
	}
	function findMaxY() {
		var maxY = element.offsetHeight / 2 - viewHalfY() / scale;
		if (maxY < 0) return 0;
		else return maxY;
	}
	function boundXandY() {
		var maxX = findMaxX();
		if (Math.abs(x) > maxX) {
			x = x > 0 ? maxX : -maxX;
		}
		var maxY = findMaxY();
		if (Math.abs(y) > maxY) {
			y = y > 0 ? maxY : -maxY;
		}
	}
	// Converts an abitrary point in screen
	// coordinates to the corresponding point
	// in image coordinates, given the transforms
	// and scaling currently in place.
	//
	//    screen coordinates        image coordinates
	//      +--------(+viewW)            (+maxY)
	//      |                               |
	//      |                   (+maxX)-----+------(-maxX)
	//      |                               |
	//    (+viewH)                       (-maxY)
	//
	// Notice X and Y are flipped, and the origin
	// has moved from the top-left corner to the
	// center.
	function sc2ic(sc) {
		return {
			x: x + (viewHalfX() - sc.x) / scale,
			y: y + (viewHalfY() - sc.y) / scale
		}
	}
};

PhotoViewer._Zoomable.deviceSupported = (function () {
	var match = /\bAndroid (\d+(\.\d+)?)/.exec(navigator.userAgent);
	if (!match) return true;

	var version = parseFloat(match[1]);
	return version > 3.0;
}());


window.photoViewer = null;

function viewerOnResize() {
    if (!window.photoViewer) return;
    window.photoViewer.resize();
}

function viewerLoad(page, data) {
    window.photoViewer = new PhotoViewer(page, data.images, {
        startAt: parseInt(data.index, 10)
    });
}

// Listen for orientation and resize changes
window.addEventListener("orientationchange", viewerOnResize, false);
window.addEventListener("resize", viewerOnResize, false);



function loadedPage(event) {
    var page = $('#content > .content');

    // Lazy load images
    page.find("img.lazy").unveil(100);

    // Kill any previous phpto viewer
    if (window.photoViewer) {
        window.photoViewer.kill();
        window.photoViewer = null;
    }

    // Present the gallery
    if (page.hasClass("gallery-page")) {

        var images = [],
            i = 0,
            lis = page.find("ol.gallery li");

        lis.on('tap', function() {
            viewerLoad(page[0], {images: images, index: $(this).data('index')})
        });

        lis.each(function () {
            var $this = $(this);

            $this.data('index', i);
            images[i] = (window.isRetina) ? toRetina($this.data('img')) : $this.data('img');
            i++;
        });
    }
}

$(window).on('load', loadedPage);
window.addEventListener('push', loadedPage);
