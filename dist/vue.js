(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function isFuntion(val) {
    return typeof val === 'function';
  }
  function isObject(val) {
    return typeof val === 'object' && val !== null;
  }

  const oldArrayPrototype = Array.prototype;
  const arrayMethods = Object.create(oldArrayPrototype); // 让arrayMethods通过__proto__找到数组的原型方法

  const methods = ['push', 'pop', 'unshift', 'shift', 'splice', 'sort', 'reverse'];
  methods.forEach(method => {
    arrayMethods[method] = function (...args) {
      // 数组的方法重写操作
      let ob = this.__ob__;
      oldArrayPrototype[method].call(this, ...args);
      let inserted = null;

      switch (method) {
        case 'splice':
          inserted = args.slice(2);

        case 'push':
        case 'unshift':
          inserted = args;
          break;
      }

      if (inserted) ob.observeArray(inserted);
    };
  });

  class Observer {
    constructor(data) {
      // data.__ob__ = this 
      Object.defineProperty(data, '__ob__', {
        // 给对象和数组添加一个自定义属性__ob__
        value: this,
        enumerable: false // 标识这个属性不能被枚举

      });

      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
        this.observeArray(data); // 对数组内对元素进行观测
      } else {
        this.walk(data);
      }
    }

    observeArray(data) {
      data.forEach(val => {
        observe(val);
      });
    }

    walk(data) {
      Object.keys(data).forEach(key => {
        defineReactive(data, key, data[key]);
      });
    }

  } // vue2应用了defineProperty需要一加载都时候，就进行递归操作，所以耗性能，如果层次过深也会浪费性能


  function defineReactive(obj, key, val) {
    //这里是闭包
    observe(val); // 递归进行观测数据 不管有多少层都进行defineProperty

    Object.defineProperty(obj, key, {
      get() {
        return val;
      },

      set(newVal) {
        observe(newVal);
        val = newVal;
      }

    });
  }

  function observe(data) {
    if (!isObject(data)) return;
    if (data.__ob__) return;
    new Observer(data);
  }

  function initState(vm) {
    const opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    let data = vm.$options.data;
    vm._data = data = isFuntion(data) ? data.call(vm) : data;
    observe(data); // 观测数据

    Object.keys(data).forEach(key => {
      // 代理数据（懒代理）
      proxy(vm, key, '_data');
    });
  }

  function proxy(vm, key, source) {
    Object.defineProperty(vm, key, {
      get() {
        return vm[source][key];
      },

      set(newVal) {
        vm[source][key] = newVal;
      }

    });
  }

  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
  const startTagOpen = new RegExp(`^<${qnameCapture}`);
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>']+)))?/;
  const startTagClose = /^\s*(\/?)>/;
  function parserHTML(html) {
    function parseStartTag() {
      const start = html.match(startTagOpen);

      if (start) {
        const match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        let end;
        let attr;

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          //要有属性 不能为开始的结束标签
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
          advance(attr[0].length);
        }

        if (end) {
          advance(end[0].length);
        }

        return match;
      }
    }

    function advance(len) {
      html = html.substring(len);
    }

    function createASTElement(tag, attrs, parent) {
      return {
        tag,
        attrs,
        type: 1,
        parent,
        children: []
      };
    } // 我要构建父子关系


    let stack = [];
    let root = null;

    function start(tagName, attrs) {
      // 遇到开始标签 就取栈中的最后一个作为父节点
      let parent = stack[stack.length - 1];
      let element = createASTElement(tagName, attrs, parent);

      if (root === null) {
        root = element;
      }

      if (parent) {
        parent.children.push(element);
      }

      stack.push(element);
    }

    function end() {
      stack.pop();
    }

    function text(chars) {
      let parent = stack[stack.length - 1];
      chars = chars.replace(/\s/g, '');

      if (chars) {
        parent.children.push({
          type: 2,
          text: chars
        });
      }
    } // 解析标签和文本


    while (html) {
      let index = html.indexOf('<');

      if (index === 0) {
        // 解析开始标签 并且把属性也解析出来
        const startTagMatch = parseStartTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        let endTagMatch;

        if (endTagMatch = html.match(endTag)) {
          advance(endTagMatch[0].length);
          end();
          continue;
        }
      }

      if (index > 0) {
        // 文本
        let chars = html.substring(0, index);
        advance(chars.length);
        text(chars);
      }
    }

    return root;
  }

  const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genProps(attrs) {
    let str = '';

    for (let i = 0; i < attrs.length; i++) {
      const attr = attrs[i];

      if (attr === 'style') {
        const styles = {};
        attr.value.replace(/([^;:]+):([^;:]+)/g, function () {
          styles[arguments[1]] = arguments[2];
        });
        attr.value = styles;
      }

      str += `${attr.name}:${JSON.stringify(attr.value)},`;
    }

    return `{${str.slice(0, -1)}}`;
  }

  function gen(child) {
    if (child.type === 1) {
      return generate(child);
    } else {
      let text = child.text;
      if (!defaultTagRE.test(text)) return `_v('${text}')`;
      let lastIndex = defaultTagRE.lastIndex = 0;
      let tokens = [];
      let match;

      while (match = defaultTagRE.exec(text)) {
        let index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push(`_s(${match[1].trim()})`);
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      return `_v(${tokens.join('+')})`;
    }
  }

  function genChildren(ast) {
    let children = ast.children;

    if (children) {
      return children.map(child => gen(child)).join(',');
    }

    return false;
  }

  function generate(ast) {
    let children = genChildren(ast);
    let code = `_c('${ast.tag}',${ast.attrs.length ? genProps(ast.attrs) : undefined},${children ? children : undefined})`;
    return code;
  }

  function compileToFunction(template) {
    // 将模版解析成ast语法树
    let ast = parserHTML(template);
    console.log('生成ast:', ast); //  生成代码

    let code = generate(ast);
    console.log('生成code:', code); // 生成render

    let render = new Function(`with(this){return ${code}}`);
    console.log('生成render:', render.toString());
    return render;
  }

  function updateProperties(el, attrs = {}) {
    for (const key in attrs) {
      el.setAttribute(key, attrs[key]);
    }
  }

  function patch(vnode) {
    if (vnode.tag) {
      vnode.el = document.createElement(vnode.tag);
      updateProperties(vnode.el, vnode.attrs);
      vnode.children.forEach(child => {
        vnode.el.appendChild(patch(child));
      });
    } else {
      vnode.el = document.createTextNode(vnode.text);
    }

    return vnode.el;
  }

  function mountComponent(vm) {
    const vnode = vm._render();

    vm._update(vnode);
  }
  function lifeCycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      const vm = this;
      const ele = patch(vnode);
      console.log('生成真实ele:', ele);
      vm.$el.parentNode.insertBefore(ele, vm.$el);
      vm.$el.parentNode.removeChild(vm.$el);
    };
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      const vm = this;
      vm.$options = options;
      initState(vm);

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      // template -> ast(抽象语法树)：描述模版结构
      // ast + data => 虚拟dom => 真实dom
      const vm = this;
      const opts = vm.$options;
      el = document.querySelector(el); //获取真实的元素

      vm.$el = el;

      if (!opts.render) {
        // 生成render
        // 编译模版
        let template = opts.template;

        if (!template) {
          template = el.outerHTML;
        }

        let render = compileToFunction(template);
        opts.render = render;
      }

      mountComponent(vm);
    };
  }

  function createElement(vm, tag, attrs = {}, ...children) {
    return vnode(vm, tag, attrs, children, attrs.key, undefined);
  }
  function createText(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode(vm, tag, attrs, children, key, text) {
    return {
      vm,
      tag,
      attrs,
      children,
      key,
      text
    };
  }

  function renderMixin(Vue) {
    Vue.prototype._c = function () {
      // 创建元素
      const vm = this;
      return createElement(vm, ...arguments);
    };

    Vue.prototype._v = function (text) {
      // 创建文本
      const vm = this;
      return createText(vm, text);
    };

    Vue.prototype._s = function (val) {
      // JSON.stringify
      if (isObject(val)) return JSON.stringify(val);
      return val;
    };

    Vue.prototype._render = function () {
      const vm = this;
      const vnode = vm.$options.render.call(vm);
      console.log('生成vnode:', vnode);
      return vnode;
    };
  }

  function Vue(options) {
    this._init(options); // 实现vue的初始化操作

  }

  initMixin(Vue);
  renderMixin(Vue);
  lifeCycleMixin(Vue);
  // 2、会将用户的选项放到 vm.$options上
  // 3、会对当前选项上判断有没有data数据
  // 4、有data 判断data是不是一个函数，如果是函数取返回值
  // 5、observe 去观察data中的数据
  // 6、通过vm._data = data 获取数据
  // 7、循环proxy vm._data  vm[key] = vm._data[key]
  // 8、通过__ob__进行标识这个对象是否已经被观测
  // 如果有el 需要挂载在页面上

  return Vue;

})));
//# sourceMappingURL=vue.js.map
