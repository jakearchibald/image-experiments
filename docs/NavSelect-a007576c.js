var e,t,n,r,o,i,l={},_=[],s=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;function u(e,t){for(var n in t)e[n]=t[n];return e}function a(e){var t=e.parentNode;t&&t.removeChild(e)}function c(e,t,n){var r,o=arguments,i={};for(r in t)"key"!==r&&"ref"!==r&&(i[r]=t[r]);if(arguments.length>3)for(n=[n],r=3;r<arguments.length;r++)n.push(o[r]);if(null!=n&&(i.children=n),"function"==typeof e&&null!=e.defaultProps)for(r in e.defaultProps)void 0===i[r]&&(i[r]=e.defaultProps[r]);return p(e,i,t&&t.key,t&&t.ref,null)}function p(t,n,r,o,i){var l={type:t,props:n,key:r,ref:o,__k:null,__:null,__b:0,__e:null,__d:void 0,__c:null,constructor:void 0,__v:i};return null==i&&(l.__v=l),e.vnode&&e.vnode(l),l}function d(){return{}}function f(e){return e.children}function h(e,t){this.props=e,this.context=t}function v(e,t){if(null==t)return e.__?v(e.__,e.__.__k.indexOf(e)+1):null;for(var n;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e)return n.__e;return"function"==typeof e.type?v(e):null}function g(e){var t,n;if(null!=(e=e.__)&&null!=e.__c){for(e.__e=e.__c.base=null,t=0;t<e.__k.length;t++)if(null!=(n=e.__k[t])&&null!=n.__e){e.__e=e.__c.base=n.__e;break}return g(e)}}function y(i){(!i.__d&&(i.__d=!0)&&t.push(i)&&!n++||o!==e.debounceRendering)&&((o=e.debounceRendering)||r)(m)}function m(){for(var e;n=t.length;)e=t.sort((function(e,t){return e.__v.__b-t.__v.__b})),t=[],e.some((function(e){var t,n,r,o,i,l,_;e.__d&&(l=(i=(t=e).__v).__e,(_=t.__P)&&(n=[],(r=u({},i)).__v=r,o=D(_,i,r,t.__n,void 0!==_.ownerSVGElement,null,n,null==l?v(i):l),C(n,i),o!=l&&g(i)))}))}function k(e,t,n,r,o,i,s,u,c,d){var h,g,y,m,k,b,w,E,C,L=r&&r.__k||_,P=L.length;for(c==l&&(c=null!=s?s[0]:P?v(r,0):null),n.__k=[],h=0;h<t.length;h++)if(null!=(m=n.__k[h]=null==(m=t[h])||"boolean"==typeof m?null:"string"==typeof m||"number"==typeof m?p(null,m,null,null,m):Array.isArray(m)?p(f,{children:m},null,null,null):null!=m.__e||null!=m.__c?p(m.type,m.props,m.key,null,m.__v):m)){if(m.__=n,m.__b=n.__b+1,null===(y=L[h])||y&&m.key==y.key&&m.type===y.type)L[h]=void 0;else for(g=0;g<P;g++){if((y=L[g])&&m.key==y.key&&m.type===y.type){L[g]=void 0;break}y=null}if(k=D(e,m,y=y||l,o,i,s,u,c,d),(g=m.ref)&&y.ref!=g&&(E||(E=[]),y.ref&&E.push(y.ref,null,m),E.push(g,m.__c||k,m)),null!=k){if(null==w&&(w=k),C=void 0,void 0!==m.__d)C=m.__d,m.__d=void 0;else if(s==y||k!=c||null==k.parentNode){e:if(null==c||c.parentNode!==e)e.appendChild(k),C=null;else{for(b=c,g=0;(b=b.nextSibling)&&g<P;g+=2)if(b==k)break e;e.insertBefore(k,c),C=c}"option"==n.type&&(e.value="")}c=void 0!==C?C:k.nextSibling,"function"==typeof n.type&&(n.__d=c)}else c&&y.__e==c&&c.parentNode!=e&&(c=v(y))}if(n.__e=w,null!=s&&"function"!=typeof n.type)for(h=s.length;h--;)null!=s[h]&&a(s[h]);for(h=P;h--;)null!=L[h]&&S(L[h],L[h]);if(E)for(h=0;h<E.length;h++)x(E[h],E[++h],E[++h])}function b(e,t,n){"-"===t[0]?e.setProperty(t,n):e[t]="number"==typeof n&&!1===s.test(t)?n+"px":null==n?"":n}function w(e,t,n,r,o){var i,l,_,s,u;if(o?"className"===t&&(t="class"):"class"===t&&(t="className"),"style"===t)if(i=e.style,"string"==typeof n)i.cssText=n;else{if("string"==typeof r&&(i.cssText="",r=null),r)for(s in r)n&&s in n||b(i,s,"");if(n)for(u in n)r&&n[u]===r[u]||b(i,u,n[u])}else"o"===t[0]&&"n"===t[1]?(l=t!==(t=t.replace(/Capture$/,"")),_=t.toLowerCase(),t=(_ in e?_:t).slice(2),n?(r||e.addEventListener(t,E,l),(e.l||(e.l={}))[t]=n):e.removeEventListener(t,E,l)):"list"!==t&&"tagName"!==t&&"form"!==t&&"type"!==t&&"size"!==t&&!o&&t in e?e[t]=null==n?"":n:"function"!=typeof n&&"dangerouslySetInnerHTML"!==t&&(t!==(t=t.replace(/^xlink:?/,""))?null==n||!1===n?e.removeAttributeNS("http://www.w3.org/1999/xlink",t.toLowerCase()):e.setAttributeNS("http://www.w3.org/1999/xlink",t.toLowerCase(),n):null==n||!1===n&&!/^ar/.test(t)?e.removeAttribute(t):e.setAttribute(t,n))}function E(t){this.l[t.type](e.event?e.event(t):t)}function D(t,n,r,o,i,l,_,s,a){var c,p,d,v,g,y,m,b,w,E,D,C=n.type;if(void 0!==n.constructor)return null;(c=e.__b)&&c(n);try{e:if("function"==typeof C){if(b=n.props,w=(c=C.contextType)&&o[c.__c],E=c?w?w.props.value:c.__:o,r.__c?m=(p=n.__c=r.__c).__=p.__E:("prototype"in C&&C.prototype.render?n.__c=p=new C(b,E):(n.__c=p=new h(b,E),p.constructor=C,p.render=P),w&&w.sub(p),p.props=b,p.state||(p.state={}),p.context=E,p.__n=o,d=p.__d=!0,p.__h=[]),null==p.__s&&(p.__s=p.state),null!=C.getDerivedStateFromProps&&(p.__s==p.state&&(p.__s=u({},p.__s)),u(p.__s,C.getDerivedStateFromProps(b,p.__s))),v=p.props,g=p.state,d)null==C.getDerivedStateFromProps&&null!=p.componentWillMount&&p.componentWillMount(),null!=p.componentDidMount&&p.__h.push(p.componentDidMount);else{if(null==C.getDerivedStateFromProps&&b!==v&&null!=p.componentWillReceiveProps&&p.componentWillReceiveProps(b,E),!p.__e&&null!=p.shouldComponentUpdate&&!1===p.shouldComponentUpdate(b,p.__s,E)||n.__v===r.__v){for(p.props=b,p.state=p.__s,n.__v!==r.__v&&(p.__d=!1),p.__v=n,n.__e=r.__e,n.__k=r.__k,p.__h.length&&_.push(p),c=0;c<n.__k.length;c++)n.__k[c]&&(n.__k[c].__=n);break e}null!=p.componentWillUpdate&&p.componentWillUpdate(b,p.__s,E),null!=p.componentDidUpdate&&p.__h.push((function(){p.componentDidUpdate(v,g,y)}))}p.context=E,p.props=b,p.state=p.__s,(c=e.__r)&&c(n),p.__d=!1,p.__v=n,p.__P=t,c=p.render(p.props,p.state,p.context),null!=p.getChildContext&&(o=u(u({},o),p.getChildContext())),d||null==p.getSnapshotBeforeUpdate||(y=p.getSnapshotBeforeUpdate(v,g)),D=null!=c&&c.type==f&&null==c.key?c.props.children:c,k(t,Array.isArray(D)?D:[D],n,r,o,i,l,_,s,a),p.base=n.__e,p.__h.length&&_.push(p),m&&(p.__E=p.__=null),p.__e=!1}else null==l&&n.__v===r.__v?(n.__k=r.__k,n.__e=r.__e):n.__e=L(r.__e,n,r,o,i,l,_,a);(c=e.diffed)&&c(n)}catch(t){n.__v=null,e.__e(t,n,r)}return n.__e}function C(t,n){e.__c&&e.__c(n,t),t.some((function(n){try{t=n.__h,n.__h=[],t.some((function(e){e.call(n)}))}catch(t){e.__e(t,n.__v)}}))}function L(e,t,n,r,o,i,s,u){var a,c,p,d,f,h=n.props,v=t.props;if(o="svg"===t.type||o,null!=i)for(a=0;a<i.length;a++)if(null!=(c=i[a])&&((null===t.type?3===c.nodeType:c.localName===t.type)||e==c)){e=c,i[a]=null;break}if(null==e){if(null===t.type)return document.createTextNode(v);e=o?document.createElementNS("http://www.w3.org/2000/svg",t.type):document.createElement(t.type,v.is&&{is:v.is}),i=null,u=!1}if(null===t.type)h!==v&&e.data!=v&&(e.data=v);else{if(null!=i&&(i=_.slice.call(e.childNodes)),p=(h=n.props||l).dangerouslySetInnerHTML,d=v.dangerouslySetInnerHTML,!u){if(null!=i)for(h={},f=0;f<e.attributes.length;f++)h[e.attributes[f].name]=e.attributes[f].value;(d||p)&&(d&&p&&d.__html==p.__html||(e.innerHTML=d&&d.__html||""))}(function(e,t,n,r,o){var i;for(i in n)"children"===i||"key"===i||i in t||w(e,i,null,n[i],r);for(i in t)o&&"function"!=typeof t[i]||"children"===i||"key"===i||"value"===i||"checked"===i||n[i]===t[i]||w(e,i,t[i],n[i],r)})(e,v,h,o,u),d?t.__k=[]:(a=t.props.children,k(e,Array.isArray(a)?a:[a],t,n,r,"foreignObject"!==t.type&&o,i,s,l,u)),u||("value"in v&&void 0!==(a=v.value)&&a!==e.value&&w(e,"value",a,h.value,!1),"checked"in v&&void 0!==(a=v.checked)&&a!==e.checked&&w(e,"checked",a,h.checked,!1))}return e}function x(t,n,r){try{"function"==typeof t?t(n):t.current=n}catch(t){e.__e(t,r)}}function S(t,n,r){var o,i,l;if(e.unmount&&e.unmount(t),(o=t.ref)&&(o.current&&o.current!==t.__e||x(o,null,n)),r||"function"==typeof t.type||(r=null!=(i=t.__e)),t.__e=t.__d=void 0,null!=(o=t.__c)){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(t){e.__e(t,n)}o.base=o.__P=null}if(o=t.__k)for(l=0;l<o.length;l++)o[l]&&S(o[l],n,r);null!=i&&a(i)}function P(e,t,n){return this.constructor(e,n)}function A(t,n,r){var o,s,u;e.__&&e.__(t,n),s=(o=r===i)?null:r&&r.__k||n.__k,t=c(f,null,[t]),u=[],D(n,(o?n:r||n).__k=t,s||l,l,void 0!==n.ownerSVGElement,r&&!o?[r]:s?null:n.childNodes.length?_.slice.call(n.childNodes):null,u,r||l,o),C(u,t)}function T(e,t,n){const r=Array.from(e);let o;if(""===t)return o=r.filter(e=>"file"===e.kind),n?o:[o[0]];const i=t.toLowerCase().split(",").map(e=>e.split("/").map(e=>e.trim())).filter(e=>2===e.length);return o=o=r.filter(e=>{if("file"!==e.kind)return!1;const[t,n]=e.type.toLowerCase().split("/").map(e=>e.trim());for(const[e,r]of i)if(t===e&&("*"===r||n===r))return!0;return!1}),!1===n&&(o=[o[0]]),o}function N(e,t,n){return T(e.items,t,n).map(e=>e.getAsFile()).filter(e=>!!e)}e={__e:function(e,t){for(var n,r;t=t.__;)if((n=t.__c)&&!n.__)try{if(n.constructor&&null!=n.constructor.getDerivedStateFromError&&(r=!0,n.setState(n.constructor.getDerivedStateFromError(e))),null!=n.componentDidCatch&&(r=!0,n.componentDidCatch(e)),r)return y(n.__E=n)}catch(t){e=t}throw e}},h.prototype.setState=function(e,t){var n;n=this.__s!==this.state?this.__s:this.__s=u({},this.state),"function"==typeof e&&(e=e(n,this.props)),e&&u(n,e),null!=e&&this.__v&&(t&&this.__h.push(t),y(this))},h.prototype.forceUpdate=function(e){this.__v&&(this.__e=!0,e&&this.__h.push(e),y(this))},h.prototype.render=f,t=[],n=0,r="function"==typeof Promise?Promise.prototype.then.bind(Promise.resolve()):setTimeout,i=l;class U extends Event{constructor(e,t){var n,r;super(e,t),(n=this)instanceof(r=U)||Object.setPrototypeOf(n,r.prototype),this._files=t.files,this._action=t.action}get action(){return this._action}get files(){return this._files}}class M extends HTMLElement{constructor(){super(),this._dragEnterCount=0,this._onDragEnter=this._onDragEnter.bind(this),this._onDragLeave=this._onDragLeave.bind(this),this._onDrop=this._onDrop.bind(this),this._onPaste=this._onPaste.bind(this),this.addEventListener("dragover",e=>e.preventDefault()),this.addEventListener("drop",this._onDrop),this.addEventListener("dragenter",this._onDragEnter),this.addEventListener("dragend",()=>this._reset()),this.addEventListener("dragleave",this._onDragLeave),this.addEventListener("paste",this._onPaste)}get accept(){return this.getAttribute("accept")||""}set accept(e){this.setAttribute("accept",e)}get multiple(){return this.getAttribute("multiple")}set multiple(e){this.setAttribute("multiple",e||"")}_onDragEnter(e){if(this._dragEnterCount+=1,this._dragEnterCount>1)return;if(null===e.dataTransfer)return void this.classList.add("drop-invalid");const t=T(e.dataTransfer.items,this.accept,null!==this.multiple);!e.dataTransfer||!e.dataTransfer.items.length||void 0!==t[0]?this.classList.add("drop-valid"):this.classList.add("drop-invalid")}_onDragLeave(){this._dragEnterCount-=1,0===this._dragEnterCount&&this._reset()}_onDrop(e){if(e.preventDefault(),null===e.dataTransfer)return;this._reset();const t=N(e.dataTransfer,this.accept,null!==this.multiple);void 0!==t&&this.dispatchEvent(new U("filedrop",{action:"drop",files:t}))}_onPaste(e){if(!e.clipboardData)return;const t=N(e.clipboardData,this.accept,void 0!==this.multiple);void 0!==t&&this.dispatchEvent(new U("filedrop",{action:"paste",files:t}))}_reset(){this._dragEnterCount=0,this.classList.remove("drop-valid"),this.classList.remove("drop-invalid")}}customElements.define("file-drop",M);var W="/image-experiments/f1-a06facfa.jpg",F="/image-experiments/lane-ac205a9e.jpg",j="/image-experiments/woods-1831a2cf.jpg",H=Object.freeze({__proto__:null,f1:W,lane:F,woods:j}),O={"F1 car":W,"Country lane":F,Woods:j};const R=new Set(["Tab","Enter"," "]),z=new Set(["ArrowUp","ArrowDown"]);class B extends h{constructor(){super(...arguments),this._ignoreChange=!1,this._onChange=e=>{if(this._ignoreChange)return;const t=e.target;this.props.onChange(t.value)},this._onKeyDown=({key:e})=>{z.has(e)?this._ignoreChange=!0:R.has(e)&&(this._ignoreChange=!1)}}render({children:e,value:t}){return c("select",{value:t,onChange:this._onChange,onKeyDown:this._onKeyDown},e)}}export{A as H,B as N,O as a,f as b,H as d,c as h,h as m,d as p};
