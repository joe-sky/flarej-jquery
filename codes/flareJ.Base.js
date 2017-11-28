/**********************************************************
*-----------------------------------*
* flareJ
*-----------------------------------*
* base on jQuery
* Copyright 2015 Joe_Sky
* Licensed under the MIT license
*-----*-----*-----*-----*-----*-----*
* author:Joe_Sky
* mail:hitomi_doax@sina.com
* last update:2016-1-4
***********************************************************/

/*-------------------------*
* flareJ.Base
*-------*-------*
* 基础库
*-------------------------*/

//#region 全局配置对象
if (typeof fjConfig === "undefined") {
    var fjConfig = {};
}

//动态执行js
fjConfig.execJS = function (js, isJson) {
    "use strict";

    return eval((isJson ? "(" : "") + js + (isJson ? ")" : ""));
};
//#endregion

(function ($) {

    //#region flareJ
    var FJ,
        fj,
        flareJ = FJ = fj = {
            noSaveObj: true,
            saveTypes: ["FUJ"],
            ver: "20150101",
            initTheme: "concise",
            vdir: "/fj",
            widgetPath: "codes/flareJ"
        },
        win = window,
        doc = document;

    /*[fjConfig参数]
    rootPath: "../../flareJ/",   //fj文件夹根路径
    ver: "20120730",             //js、css等文件版本号
    initTheme: "gray",           //默认主题
    themeStoreName: "fj_theme"   //主题本地存储标识
    isLocal: false               //本地模式，直接用网页打开时需设置为true
    vdir: null                   //当前网站虚拟目录
    alias: ""                    //fj对象别名
    noSaveObj: null              //是否不保存各控件对象
    saveTypes: ["FUJ"]           //需保存的控件对象类型
    */

    //合并配置对象
    flareJ = FJ = fj = $.extend(true, flareJ, fjConfig);

    //在window对象上加入fj对象的引用
    win.flareJ = win.FJ = win.fj = flareJ;

    //版本
    //FJ.version = "0.0.1";

    //jquery版本
    var oJq = new jQuery();
    if (oJq && oJq.jquery) {
        var jqVer = oJq.jquery;
        if (jqVer.indexOf(".") != -1) {
            FJ.jQversion = jqVer.split(".");
        }
    }

    //如果未设置rootPath参数则视为默认不加载资源文件
    if (!fj.rootPath) {
        fj.noLoadRes = true;
    }
    //#endregion

    //#region FJ对象操作
    //FJ对象集合
    FJ.objs = {};

    //按ID获取FJ对象
    FJ.get = function (id) {
        if (FJ.objs[id]) {
            return FJ.objs[id];
        }
        else {
            return null;
        }
    };

    //按ID设置FJ对象
    FJ.set = function (id, obj) {
        FJ.objs[id] = obj;
    };

    //删除FJ对象
    FJ.remove = function (id) {
        delete FJ.objs[id];
    };
    //#endregion

    //#region 类工厂
    /*-----------------------------------------------*
    * 参考自John Resig的Simple JavaScript Inheritance
    *------*-----*-----*-----*-----*-----*-----*-----*
    * 增加了子类方法中可调用基类的所有方法
    *-----------------------------------------------*/

    //是否执行构造方法标记
    var initializing = false,
    //检测方法内是否包含某个字符串或对象名(先检测浏览器是否支持使用这种方式检测,否则不进行检测)
        fnTest = /xyz/.test(function () { xyz; }) ? /\b_super\b|\b_base\b/ : /.*/;

    //创建所有可继承对象的基类
    FJ.Class = function () { };

    //继承方法
    FJ.Class.extend = function (prop) {
        //基类原型的引用
        var _super = this.prototype;

        //实例化一个基类对象作为子类的原型,并且不执行构造方法
        initializing = true;
        var prototype = new this();
        initializing = false;

        //从子类成员描述对象中复制成员到子类原型中
        for (var name in prop) {
            //如果子类有基类的同名方法,则覆盖掉
            prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function"
            && fnTest.test(prop[name]) ?   //检测子类方法中是否含有_super方法
            (function (name, fn) {         //在执行每个子类方法时都会动态做一些引用的更新
                return function () {
                    var tmp = this._super,
                        tmpB = this._base;

                    //将基类同名方法的引用保存在_super方法中
                    this._super = _super[name];

                    //创建可调用基类所有方法的_base方法,调用形式如this._base("fn", [arg1,arg2...]);
                    this._base = function (n, args) {
                        _super[n].apply(this, args);
                    };

                    //执行完子类方法后由临时变量还原_super方法
                    var ret = fn.apply(this, arguments);
                    this._super = tmp;
                    this._base = tmpB;

                    return ret;
                };
            })(name, prop[name]) :
            prop[name];
        }

        //创建一个新的可继承的类
        function Class() {
            //执行构造方法
            if (!initializing && this.init)
                this.init.apply(this, arguments);
        }

        //将已经用子类成员描述对象覆盖过的基类对象保存在子类原型中
        Class.prototype = prototype;

        //指定子类的构造类
        Class.constructor = Class;

        //添加子类的继承方法
        Class.extend = arguments.callee;

        return Class;
    };
    //#endregion

    //#region 输出控制台日志
    FJ.log = function (msg) {
        if (!window.console) {
            return;
        }

        console.log(msg);
    };
    //#endregion

    //#region 抛出异常
    FJ.error = function (msg) {
        throw new Error(msg);
    };
    //#endregion

    //#region 判断浏览器及终端设备

    //浏览器名称
    var _ua = FJ.ua = navigator.userAgent.toLowerCase();

    //浏览器判断对象
    FJ.browser = {
        version: (_ua.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [0, '0'])[1],
        safari: /webkit/i.test(_ua) && !this.chrome,
        opera: /opera/i.test(_ua),
        firefox: /firefox/i.test(_ua),
        ie: /msie/i.test(_ua) && !/opera/.test(_ua),
        mozilla: /mozilla/i.test(_ua) && !/(compatible|webkit)/.test(_ua) && !this.chrome,
        chrome: /chrome/i.test(_ua) && /webkit/i.test(_ua) && /mozilla/i.test(_ua),
        android: _ua.indexOf('android') > -1,
        iphone: _ua.indexOf('iphone') > -1,
        ipad: _ua.indexOf('ipad') > -1,
        ipod: _ua.indexOf('ipod') > -1,
        windowsPhone: _ua.indexOf('windows phone') > -1
    };

    //IE
    FJ.isIE = FJ.browser.ie || !!window.ActiveXObject || "ActiveXObject" in window;

    //IE6
    FJ.isIE6 = FJ.isIE && FJ.browser.version == 6.0 || document.documentMode == 5;

    //IE7
    FJ.isIE7 = FJ.isIE && FJ.browser.version == 7.0 && (!document.documentMode || document.documentMode == 7) || document.documentMode == 7;

    //IE8
    FJ.isIE8 = FJ.isIE && FJ.browser.version == 8.0 && (!document.documentMode || document.documentMode == 8) || document.documentMode == 8;

    //IE9
    FJ.isIE9 = FJ.isIE && FJ.browser.version == 9.0 && (!document.documentMode || document.documentMode == 9) || document.documentMode == 9;

    //IE10
    FJ.isIE10 = FJ.isIE && FJ.browser.version == 10.0 && (!document.documentMode || document.documentMode == 10) || document.documentMode == 10;

    //IE11
    FJ.isIE11 = FJ.isIE && FJ.browser.version == 11.0 && (!document.documentMode || document.documentMode == 11) || document.documentMode == 11;

    //IE6-7
    FJ.isIElt8 = FJ.isIEno8 = FJ.isIE6 || FJ.isIE7;  //isIEnox、isIEupx日后会去除

    //IE6-8
    FJ.isIElt9 = FJ.isIEno9 = FJ.isIElt8 || FJ.isIE8;

    //IE6-9
    FJ.isIElt10 = FJ.isIEno10 = FJ.isIElt9 || FJ.isIE9;

    //IE6-10
    FJ.isIElt11 = FJ.isIEno11 = FJ.isIElt10 || FJ.isIE10;

    //IE10-11
    FJ.isIEgt10 = FJ.isIEup10 = FJ.isIE10 || FJ.isIE11;

    //IE9-11
    FJ.isIEgt9 = FJ.isIEup9 = FJ.isIE9 || FJ.isIEgt10;

    //IE8-11
    FJ.isIEgt8 = FJ.isIEup8 = FJ.isIE8 || FJ.isIEgt9;

    //FireFox
    FJ.isFF = FJ.browser.mozilla && !FJ.isIE11;

    //FireFox4以上
    FJ.isFFgt4 = (function () {
        var b = false;
        if (FJ.isFF) {
            if (parseFloat((_ua.substr(_ua.indexOf("firefox/") + 8, _ua.length)).split(".")[0]) >= 4)
                b = true;
        }
        return b;
    })();

    //Chrome
    FJ.isChrome = FJ.browser.chrome;

    //Safari
    FJ.isSafari = FJ.browser.safari;

    //Opera
    FJ.isOpera = FJ.browser.opera;

    //android
    FJ.isAndroid = FJ.browser.android;

    //iphone
    FJ.isIphone = FJ.browser.iphone;

    //ipad
    FJ.isIpad = FJ.browser.ipad;

    //ipod
    FJ.isIpod = FJ.browser.ipod;

    //IOS
    FJ.isIos = FJ.isIphone || FJ.isIpad || FJ.isIpod;

    //Windows Phone
    FJ.isWindowsPhone = FJ.browser.windowsPhone;

    //移动浏览器
    FJ.isMobile = FJ.isAndroid || FJ.isIos || FJ.isWindowsPhone;

    //webkit内核浏览器
    FJ.isWebkit = FJ.isChrome || FJ.isSafari || FJ.isAndroid || FJ.isIos;

    //#endregion

    //#region 判断操作系统

    //XP
    FJ.isWinXP = _ua.indexOf("Windows nt 5.1") != -1;

    //server 2003
    FJ.isWinS2003 = _ua.indexOf("Windows nt 5.2") != -1;

    //vista
    FJ.isWinVista = _ua.indexOf("Windows nt 6.0") != -1;

    //win7
    FJ.isWin7 = _ua.indexOf("Windows nt 6.1") != -1;

    //#endregion

    //#region 判断变量类型

    //判断非数字
    FJ.isNaN = function (obj) {
        return obj !== obj;
    };

    //#endregion

    //#region 数组
    FJ.Array = FJ.arr = {};

    //插入
    FJ.arr.insertAt = function (arr, index, value) {
        arr.splice(index, 0, value);
    };

    //移除
    FJ.arr.removeAt = function (arr, index) {
        arr.splice(index, 1);
    };

    //移动
    FJ.arr.moveTo = function (arr, inxOld, inxNew) {
        FJ.arr.insertAt(arr, inxNew + 1, arr[inxOld]);
        FJ.arr.removeAt(arr, inxOld);
    };

    //#region 将类数组转换为数组
    FJ.arr.slice = function (s) {
        try {
            return Array.prototype.slice.call(s);
        }
        catch (e) {
            var arr = [];
            for (var i = 0, len = s.length; i < len; i++) {
                arr[i] = s[i];
            }
            return arr;
        }
    };
    //#endregion
    //#endregion

    //#region 计算当前窗口距离
    //#region 计算当前窗口的上边滚动条
    FJ.topPosition = function () {
        return typeof window.pageYOffset != 'undefined' ? window.pageYOffset : document.documentElement && document.documentElement.scrollTop != null ? document.documentElement.scrollTop : document.body.scrollTop ? document.body.scrollTop : 0;
    };
    //#endregion

    //#region 计算当前窗口的左边滚动条
    FJ.leftPosition = function () {
        return typeof window.pageXOffset != 'undefined' ? window.pageXOffset : document.documentElement && document.documentElement.scrollLeft != null ? document.documentElement.scrollLeft : document.body.scrollLeft ? document.body.scrollLeft : 0;
    };
    //#endregion

    //#region 计算当前窗口的宽度
    FJ.pageWidth = function () {
        return window.innerWidth != null ? window.innerWidth : document.documentElement && document.documentElement.clientWidth != null ? document.documentElement.clientWidth : document.body != null ? document.body.clientWidth : null;
    };

    FJ.globalWidth = FJ.pageWidth();  //保存初始页面宽度
    //#endregion

    //#region 计算当前窗口的高度
    FJ.pageHeight = function () {
        return window.innerHeight != null ? window.innerHeight : document.documentElement && document.documentElement.clientHeight != null ? document.documentElement.clientHeight : document.body != null ? document.body.clientHeight : null;
    };

    FJ.globalHeight = FJ.pageHeight();  //保存初始页面高度
    //#endregion
    //#endregion

    //#region 常用标签全局引用

    //head
    FJ.head = doc.head || doc.getElementsByTagName("head")[0];

    //body
    FJ.body = doc.body;
    FJ.oBody = $(FJ.body);

    //移动端每次触摸时记录body纵滚动条位置
    if (fj.isMobile) {
        $(document).on("touchstart", function () {
            fj.bodyScrollTop = fj.body.scrollTop;
        });
    }
    //#endregion

    //#region 延迟执行操作
    FJ.lazyDo = function (fn, timeOut, doName, obj) {
        var dn = doName != null,
            sto = null;

        if (!obj) {
            obj = window;
        }
        if (timeOut == null) {
            timeOut = 25;
        }

        if (dn && obj[doName]) {  //如果之前执行的操作未到超出时间则取消
            clearTimeout(obj[doName]);
        }

        sto = setTimeout(function () {  //延迟一段时间执行该操作
            fn.call(obj);
        }, timeOut);

        if (dn) {
            obj[doName] = sto;
        }

        return sto;
    };
    //#endregion

    //#region 轮询执行操作
    FJ.pollDo = function (fn, timeOut, doName, obj) {
        var dn = doName != null,
            siv = null;

        if (!obj) {
            obj = window;
        }
        if (timeOut == null) {
            timeOut = 100;
        }

        if (dn && obj[doName]) {  //如果之前执行的轮询操作存在则取消
            clearInterval(obj[doName]);
        }

        siv = setInterval(function () {  //每隔一段时间轮询执行操作
            if (fn.call(obj) === false) {
                clearInterval(siv);
            }
        }, timeOut);

        if (dn) {
            obj[doName] = siv;
        }

        return siv;
    };
    //#endregion

    //#region css操作
    FJ.CSS = FJ.css = {};

    /*-----------------------------------------------*
    * 检测css是否加载完毕
    *------*-----*-----*-----*-----*-----*-----*-----*
    * 参考自Diego Perini的cssready.js
    *-----------------------------------------------*/
    FJ.CSS.cssReady = function (fn, link) {
        var d = document,
      t = d.createStyleSheet,
      r = t ? 'rules' : 'cssRules',
      s = t ? 'styleSheet' : 'sheet',
      l = d.getElementsByTagName('link');
        //如果不传link标签对象则获取最后一个创建的link标签
        link || (link = l[l.length - 1]);
        function check() {
            try {
                return link && link[s] && link[s][r] && link[s][r][0];
            } catch (e) {
                return false;
            }
        }
        (function poll() {
            check() && setTimeout(fn, 0) || setTimeout(poll, 100);
        })();
    };

    //动态加载css
    FJ.CSS.execute = function (path, id, callback, elemName) {
        var l = fj.css.create(id, path, elemName);
        if (callback != null) {
            if (l) {
                fj.css.cssReady(callback, l);
            }
            else {
                callback();  //如果css文件已加载过则直接执行回调方法
            }
        }
        return l;
    };

    //动态创建CSS
    FJ.CSS.create = function (id, path, elemName) {
        if ($("#" + id).length) {
            return false;
        }

        if (!elemName) {
            elemName = "head";
        }

        var oLink = document.createElement("link");
        oLink.id = id;
        oLink.href = path + (fj.ver ? ((path.indexOf("?") == -1 ? "?" : "&") + "ver=" + fj.ver) : "");
        oLink.rel = "stylesheet";
        oLink.type = "text/css";
        document.getElementsByTagName(elemName)[0].appendChild(oLink);
        return oLink;
    };

    //动态创建style标签
    FJ.CSS.createStyle = function (id, text, elemName, media) {
        var oStyle = $("#" + id);
        if (oStyle.length) {
            oStyle.remove();
        }
        
        if (!elemName) {
            elemName = "head";
        }

        var style = document.createElement("style");
        style.setAttribute("type", "text/css");
        style.setAttribute("id", id);
        if (media) {
            style.setAttribute("media", media);
        }

        if (style.styleSheet) {  //IE
            style.styleSheet.cssText = text;
        }
        else {   //w3c
            var cssText = document.createTextNode(text);
            style.appendChild(cssText);
        }

        document.getElementsByTagName(elemName)[0].appendChild(style);
    };

    //动态更换CSS
    FJ.CSS.change = function (id, path, elemName) {
        if (!FJ.CSS.create(id, path, elemName)) {
            var oLink = document.getElementById(id);
            oLink.href = path + (fj.ver ? ((path.indexOf("?") == -1 ? "?" : "&") + "ver=" + fj.ver) : "");
        }
    };
    //#endregion

    //#region js操作
    FJ.JS = FJ.js = {};

    //#region 动态加载js
    FJ.JS.execute = function (path, id, callback, elemName, onlyFirstLoad, sign, byRequire) {
        if (!elemName) {
            elemName = "head";
        }
        if (id == null) {
            id = FJ.cutResourceId(path);
        }

        var oScr = $("#" + id);
        if (oScr.length) {  //如果js文件已存在则删除
            if (!onlyFirstLoad) {
                oScr.remove();
            }
            else {
                if (!sign) {
                    if (callback) {
                        callback();
                    }
                }
                else {
                    sign.loaded = 1;
                }
                return;
            }
        }

        var oScript = document.createElement("script");
        oScript.id = id;
        oScript.type = "text/javascript";

        //加载完毕事件
        oScript[FJ.isIElt9 ? "onreadystatechange" : "onload"] = function () {
            if (!FJ.isIElt9 || /loaded|complete/i.test(oScript.readyState)) {
                //由require方法调用
                if (byRequire) {
                    //执行define方法中的工厂方法
                    var factory = FJ.Loader.factorys.pop();
                    factory && factory.delay(FJ.Request.delQueryString(oScript.src));
                }

                //执行回调
                if (!sign) {
                    if (callback) {
                        callback();
                    }
                }
                else {
                    sign.loaded = 1;
                }

                //检测死链
                FJ.Loader.checkFail(oScript, false, FJ.isIElt9);
            }
        };

        //加载错误事件
        oScript.onerror = function () {
            FJ.Loader.checkFail(oScript, true);
        };

        //让getCurrentScriptPath只处理类标记过的script节点
        if (byRequire) {
            oScript.className = FJ.Loader.PRE_LOAD;
        }

        //开始加载
        oScript.src = path + (fj.ver ? ((path.indexOf("?") == -1 ? "?" : "&") + "ver=" + fj.ver) : "");

        //插入script标签
        document.getElementsByTagName(elemName)[0].appendChild(oScript);
        return oScript;
    };
    //#endregion

    //#region 动态加载多个js
    FJ.JS.multiExecute = function (params, callback, elemName) {
        var signs = [],
            l = params.length;

        for (var i = 0; i < l; i++) {  //初始化加载完成标记数组
            signs[signs.length] = {};
        }

        for (var i = 0; i < l; i++) {  //动态加载js文件
            var p = params[i];
            fj.js.execute(p[0], p[2], 1, elemName, p[1], signs[i]);
        }

        fj.pollDo(function () {  //轮询判断js文件是否已全部加载完毕
            for (var i = 0; i < l; i++) {
                if (!signs[i].loaded) {  //如果有未加载完毕的文件就继续轮询判断
                    return;
                }
            }

            if (callback) {  //全部加载完毕后调用回调方法并终止轮询
                callback();
                return false;
            }
        });
    };
    //#endregion
    //#endregion

    //#region FJ根目录
    if (typeof FJ.rootPath === "undefined") {
        FJ.rootPath = "/JsLibrary/flareJ/";
    }

    //#region 从url截取id
    FJ.cutResourceId = function (path) {
        return path.substring(path.lastIndexOf("/") + 1, path.lastIndexOf("."));
    };
    //#endregion

    //#region 设置FJ根目录路径
    (FJ.setRootPath = function (rootPath) {
        //根路径
        FJ.rootPath = rootPath;

        //资源文件夹
        FJ.resPath = rootPath + "resources/";

        //图片文件夹
        FJ.imgPath = rootPath + "resources/image/";

        //css
        FJ.cssPath = rootPath + "resources/css/";

        //媒体文件
        FJ.mediaPath = rootPath + "resources/media/";

        //svg文件
        FJ.svgPath = rootPath + "resources/svg/";

        //主题
        FJ.themePath = rootPath + "resources/theme/";

        //加载swfobject.js
        if (!fj.isMobile && !window.swfobject && !fj.noLoadRes) {
            FJ.JS.execute(FJ.rootPath + "resources/swf/swfobject.js");
        }
    })(FJ.rootPath);
    //#endregion

    //#region 获取网站根目录路径
    FJ.getRootPath = function (rootFolder) {
        if (rootFolder == null) {
            rootFolder = FJ.vdir;
        }
        var strFullPath = window.document.location.href;

        var strPath = window.document.location.pathname;

        var pos = strFullPath.indexOf(strPath);

        var prePath = strFullPath.substring(0, pos);

        var postPath = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
        if (postPath !== rootFolder) {
            postPath = "";
        }
        return (prePath + postPath);
    };

    //网站虚拟目录地址
    FJ.vdirPath = FJ.getRootPath();
    //#endregion
    //#endregion

    //#region 模块化加载器
    /*-----------------------------------------------*
    * 参考自司徒正美的module.js
    *------*-----*-----*-----*-----*-----*-----*-----*
    * 1、重新规划了加载路径计算方式
    * 2、增加了在define内部调用require也可使用相对于
    *    当前js文件的相对路径
    * 3、发现新版firefox中使用getCurrentScriptPath有
    *    时会出现获取当前执行js不准确的情况,故目前暂
    *    时不使用匿名方式加载模块
    * 4、define方法内的第一个参数为require方法
    * 5、获取根目录时,由于getCurrentScriptPath存在bug,
    *    故使用rootPath作为替代,同时加载器暂时只支持
    *    顶级路径
    *-----------------------------------------------*/
    FJ.Loader = {
        PRE_LOAD: "fj-module-load",     //准备加载标记
        FILTER_REPEAT: "filterRepeat",  //过滤重复加载的依赖
        modules: {},                    //模块容器map
        loadings: [],                   //检测依赖队列
        factorys: [],                   //工厂方法集合
        paths: {                        //路径简称
            widget: FJ.widgetPath       //组件路径
        }
    };

    //#region 获取当前正在加载的js文件地址
    FJ.Loader.getCurrentScriptPath = function (base) {
        var stack, sUrl;
        try {  //Firefox可以直接 var e = new Error("test"),但其他浏览器只会生成一个空Error
            x.y.z(); //强制报错,以便捕获e.stack
        }
        catch (e) {
            stack = e.stack;
            if (!stack && window.opera) {
                //Opera 9没有e.stack,但有e.Backtrace,不能直接取得,需要对e对象转字符串进行抽取
                stack = (String(e).match(/of linked script \S+/g) || []).join(" ");
            }

            sUrl = e.sourceURL;  //错误对象在windows版Safari中只可以取到sourceURL,但是在IOS版Safari中也可以取到stack
            if(!stack && sUrl && base) {  //base为真时,在Safari中返回sourceURL(sourceURL只能提取出错误代码发生的源码文件)
                return sUrl;
            }
        }
        if (stack) {
            /**e.stack最后一行在所有支持的浏览器大致如下。
             *Chrome23:
             * at http://ip地址/data.js:4:1
             *Firefox17:
             *@http://ip地址/query.js:4
             *@http://ip地址/data.js:4
             *IE10:
             *  at Global code (http://ip地址/data.js:4:1)
             *  //firefox4+ 可以用document.currentScript,但是获取到的src有可能不准确,固此处不使用此种方式
             */
            stack = stack.split(/[@ ]/g).pop();         //取得最后一行,最后一个空格或@之后的部分
            stack = stack[0] === "(" ? stack.slice(1, -1) : stack.replace(/\s/, "");  //去掉换行符
            return stack.replace(/(:\d+)?:\d+$/i, ""); //去掉行号与或许存在的出错字符起始位置
        }

        //在head标签中寻找script标签
        var nodes = (base ? doc : FJ.head).getElementsByTagName("script");
        for (var i = nodes.length, node; node = nodes[--i];) {
            if ((base || node.className === FJ.Loader.PRE_LOAD) && node.readyState === "interactive") {
                return node.className = node.src;  //重置准备加载标记
            }
        }
    };

    //获取FJ根目录
    FJ.basePath = FJ.rootPath;
    //(function() {
    //    var url = FJ.Loader.getCurrentScriptPath(true);

    //    //取当前脚本所在文件夹的上层为FJ根目录
    //    url = url.slice(0, url.lastIndexOf("/"));
    //    FJ.basePath = url.slice(0, url.lastIndexOf("/") + 1);
    //})();
    //#endregion

    //#region 检测死链
    FJ.Loader.checkFail = function (node, onError, isIE) {
        var id = FJ.Request.delQueryString(node.src),
            module = FJ.Loader.modules[id];

        //注销事件
        node.onload = node.onreadystatechange = node.onerror = null;

        if (onError || (isIE && module && !module.state)) {
            FJ.lazyDo(function () {
                FJ.head.removeChild(node);  //移除script标签
            });

            FJ.log("加载文件失败,url:" + id + ",params:" + onError + "_" + isIE);
        }
        else {
            return true;
        }
    };
    //#endregion

    //#region 检测是否存在循环依赖
    FJ.Loader.checkCycle = function (deps, nick) {
        for (var id in deps) {
            var module = FJ.Loader.modules[id];

            //检测依赖列表以及依赖的依赖列表是否重复
            if (deps[id] === FJ.Loader.FILTER_REPEAT && module.state !== 2 && (id === nick || FJ.Loader.checkCycle(module.deps, nick))) {
                return true;
            }
        }
    };
    //#endregion

    //#region 检测依赖是否已加载完成
    FJ.Loader.checkDeps = function () {
        POLL: for (var loadings = FJ.Loader.loadings, i = loadings.length, id; id = loadings[--i];) {
            var modules = FJ.Loader.modules,
                obj = modules[id],
                deps = obj.deps;

            for (var key in deps) {
                if (FJ.obj.hasOwn(deps, key) && modules[key].state !== 2) {
                    continue POLL;
                }
            }

            //如果deps是空对象或者其依赖的模块的状态都是2
            if (obj.state !== 2) {
                loadings.splice(i, 1);  //必须先移除再安装，防止在IE下DOM树建完后手动刷新页面，会多次执行它
                FJ.Loader.fireFactory(obj.id, obj.args, obj.factory);
                FJ.Loader.checkDeps();  //如果成功,则再执行一次,以防有些模块就差本模块没有安装好
            }
        }
    };
    //#endregion

    //#region 安装模块并执行工厂方法
    FJ.Loader.fireFactory = function (id, deps, factory) {
        var array = [_createRequire(id)],  //创建各模块的require方法,以便于在define方法内调用require时,可以使用相对于当前js目录的相对路径
            modules = FJ.Loader.modules;

        for (var i = 0, d; d = deps[i++];) {
            array.push(modules[d].exports);
        }

        var module = Object(modules[id]),
            ret = factory && factory.apply(win, array);

        //标记模块加载完成
        module.state = 2;

        if (ret !== void 0) {
            module.exports = ret;
        }
        return ret;
    };
    //#endregion

    //#region 格式化模块地址
    FJ.Loader.formatModulePath = function (path, parent, src, ext) {
        if(parent === void 0) {
            parent = location.href;
        }

        //替换路径简称
        var paths = FJ.Loader.paths;
        for(var o in paths) {
            if(path.indexOf(o) >= 0) {
                path = path.replace(o, paths[o]);
            }
        }

        if (/^(\w+)(\d)?:.*/.test(path)) {  //path为普通路径(完整url)
            src = path;
        }
        else {
            parent = parent.substr(0, parent.lastIndexOf('/'));
            var tmp = path.charAt(0);
            if (tmp !== "." && tmp !== "/") {  //path为顶级路径(不以点"."或斜线"/"开始,相对于FJ根路径)
                src = FJ.basePath + path;
            }
            else if (path.substr(0, 2) === "./") {  //path为相对路径(以"./"开始,相对于当前路径)
                src = parent + path.substr(1);
            }
            else if (path.substr(0, 2) === "..") {  //path为相对路径(以"../"开始,相对于父级路径)
                var arr = parent.replace(/\/$/, "").split("/");
                tmp = path.replace(/\.\.\//g, function () {  //根据路径中../的数量,向上逐级退文件夹层级
                    arr.pop();
                    return "";
                });
                src = arr.join("/") + "/" + tmp;
            }
            else if (tmp === "/") {  //path为普通路径(以"/"开始,相对于当前网站根路径)
                src = FJ.vdirPath + path;
            }
            else {
                FJ.error("不符合模块标识规则: " + path);
            }
        }

        //去除url参数
        src = FJ.Request.delQueryString(src);

        //获取扩展名
        if (/\.(css|js)$/.test(src)) {
            ext = RegExp.$1;
        }

        //无扩展名时加扩展名
        if (!ext) {
            src += ".js";
            ext = "js";
        }

        return { src: src, ext: ext };
    };
    var _formatModulePath = FJ.Loader.formatModulePath;
    //#endregion

    //#region 加载资源文件
    FJ.Loader.loadResource = function (path, parent, ret) {
        var modules = FJ.Loader.modules;

        //格式化模块地址
        ret = _formatModulePath(path, parent);

        var src = ret.src;
        if (ret.ext === "js") {
            if (!modules[src]) {  //之前没加载过时才加载
                modules[src] = {
                    id: src,
                    parent: parent,
                    exports: {}
                };

                FJ.JS.execute(src, null, null, null, null, null, true);
            }
            return src;
        }
        else if(ret.ext === "css") {
            FJ.CSS.execute(src, src.substr(src.lastIndexOf("/")).replace(/(#.+|\W)/g, ""));  //css以文件名去掉特殊字符后作为id
        }
    };
    //#endregion

    //#region 创建加载模块方法
    var _createRequire = function (moduleId) {
        if(moduleId === void 0) {  //默认父级路径为当前页面所在目录
            moduleId = location.href;
        }

        var requireFn = function (list, factory, parent) {
            var deps = {},  //用于检测它的依赖是否都为2
                args = [],  //用于保存依赖模块的返回值
                dn = 0,     //需要安装的模块数
                cn = 0,     //已安装完的模块数
                id = parent || "require_" + FJ.guid(),  //不传parent参数则随机生成模块ID,该模块不用加载
                modules = FJ.Loader.modules;
        
            //设置父级路径
            parent = parent || moduleId;
        
            //加载各请求资源文件
            String(list).replace(FJ.RX.rword, function (id) {
                var url = FJ.Loader.loadResource(id, parent);
                if (url) {
                    dn++;
                    if (modules[url] && modules[url].state === 2) {
                        cn++;
                    }
                    if (!deps[url]) {
                        args.push(url);
                        deps[url] = FJ.Loader.FILTER_REPEAT;  //用于检测去重
                    }
                }
            });
        
            //创建一个对象,记录模块的加载情况与其他信息
            modules[id] = {
                id: id,
                factory: factory,
                deps: deps,
                args: args,
                state: 1
            };
        
            //如果需要安装的等于已安装好的
            if (dn === cn) {
                FJ.Loader.fireFactory(id, args, factory);  //安装模块
            }
            else {
                //放到检测列队中,等待checkDeps处理
                FJ.Loader.loadings.unshift(id);
            }
        
            //检测依赖是否加载
            FJ.Loader.checkDeps();
        };

        return requireFn;
    };
    //#endregion

    //#region 加载模块(全局)
    win.require = FJ.require = _createRequire();
    //#endregion

    //#region 定义模块
    win.define = FJ.define = function (id, deps, factory) {
        var args = FJ.arr.slice(arguments),
            modules = FJ.Loader.modules,
            byRequire = true,  //是否由require方法加载
            _id = null;

        if (typeof id === "string" && id.indexOf(",") < 0) {  //第一个参数为模块ID
            _id = _formatModulePath(args.shift()).src;  //格式化模块地址
        }
        if (typeof args[0] === "function") {  //如果没传依赖列表,则在工厂方法前面插入一个空的依赖列表
            args.unshift([]);
        }

        //如果第一个参数为模块ID且该ID的模块不存在,则视为非require方法加载
        if(_id && !modules[_id]) {
            byRequire = false;
            id = _id;
        }
        else {  //视为由require方法加载的js
            if(_id != null) {  //使用传入的第一个参数作为模块ID
                id = _id;
            }
            else {
                var csPath = FJ.Loader.getCurrentScriptPath();  //如果第一个参数不是模块ID,则获取当前正在执行的js地址作为模块ID
                if(csPath) {
                    id = FJ.Request.delQueryString(csPath);
                }
            }
        }

        factory = args[1];

        //如果为非require方法加载,则不执行加载依赖,直接执行模块安装
        if(!byRequire) {
            var depsO = {};
            deps = args[0];
            for(var i = 0, l = deps.length;i < l;i++) {
                depsO[deps[i] = _formatModulePath(deps[i]).src] = FJ.Loader.FILTER_REPEAT;  //格式化依赖模块地址
            }

            modules[id] = {  //安装模块
                id: id,
                factory: factory,
                deps: depsO,
                args: deps
            };

            FJ.Loader.fireFactory(id, deps, factory);  //执行工厂方法
            return;
        }

        factory.delay = function (id) {
            args.push(id);
            var isCycle = true;
            try {
                isCycle = FJ.Loader.checkCycle(modules[id].deps, id);  //检测循环依赖
            }
            catch (e) { }

            if (isCycle) {
                FJ.error(id + "模块与之前的某些模块存在循环依赖");
            }

            delete factory.delay;  //释放内存
            
            //记录已加载的模块并请求其依赖
            FJ.require.apply(null, args);  //id,deps,factory --> deps,factory,id
        };

        if (id) {  //获取到模块ID后则直接执行delay方法
            factory.delay(id, args);
        }
        else {  //如果未获取到模块ID则需要在onload事件中执行delay方法
            FJ.Loader.factorys.push(factory);  //先进先出
        }
    };

    FJ.define.amd = FJ.Loader.modules;
    //#endregion
    //#endregion

    //#region 本地存储

    /**
    *  用userdata存储数据,IE9以下支持
    */
    FJ.UserData = {
        _data: null,
        _defExpires: null,
        _saveFile: null,
        setDefExpires: function (expires) {
            var This = this;
            This._defExpires = expires || 365;
        },
        setSaveFile: function (s) {
            var This = this;
            This._saveFile = s || window.location.hostname;
        },
        _init: function () {
            var This = this;
            if (!This._data) {
                try {
                    This._data = document.createElement('input');
                    This._data.type = "hidden";
                    This._data.addBehavior("#default#userData");   //这里一定是#default#userData 
                    document.body.appendChild(This._data);
                } catch (e) {
                    return false;
                }
            }
            return true;
        },

        setItem: function (opt) {    //opt={file: ,key: ,value: ,e: } 
            var This = this;
            if (This._init()) {
                This.setDefExpires(opt.e);
                var expires = new Date();
                expires.setDate(expires.getDate() + This._defExpires);
                This._data.expires = expires.toUTCString();

                opt.value = typeof (opt.value) == "string" ? opt.value : JSON.stringify(opt.value);
                This.setSaveFile(opt.file);
                try {
                    This._data.load(This._saveFile);
                    This._data.setAttribute(opt.key, opt.value);
                    This._data.save(This._saveFile);
                }
                catch (e) { }
            }
        },

        getItem: function (opt) {   //opt={file: ,key: } 
            var This = this;
            if (This._init()) {
                This.setSaveFile(opt.file);
                try {
                    This._data.load(This._saveFile);
                }
                catch (e) { }
                return This._data.getAttribute(opt.key);
            }
        },

        removeItem: function (opt) {   //opt={file: ,key: } 
            var This = this;
            if (This._init()) {
                This.setSaveFile(opt.file);
                This._data.load(This._saveFile);
                This._data.removeAttribute(opt.key);
                This._data.save(This._saveFile);
            }
        }
    };

    /**
    *  用localStorage存储数据,IE8以上支持。IE8以下浏览器使用userdata保存
    */
    FJ.LocalStorage = {
        /** 
        *  调用方法: FJ.LocalStorage.getItem({file: , key: });其中file可选，用于Userdata指定读取的文件名。key必选 
        */
        getItem: function (opt) {
            if (window.localStorage) {
                return localStorage.getItem(opt.key);
            }
            else return FJ.UserData.getItem(opt);
        },
        /** 
        *  调用方法: FJ.LocalStorage.setItem({file: , key: ,value:, e:});key,value必选,file可选，用于Userdata指定读取的文件名.e可选，用于UserData指定到期时间 
        */
        setItem: function (opt) {
            if (window.localStorage) {
                opt.value = typeof (opt.value) == "string" ? opt.value : JSON.stringify(opt.value);
                localStorage.setItem(opt.key, opt.value);
            }
            else FJ.UserData.setItem(opt);
        },
        /** 
        *  调用方法: FJ.LocalStorage.removeItem({file: , key: ,clear:});其中file可选，用于Userdata指定读取的文件名。clear可选(boolean),true表示清空,false或空时就只remove掉key
        */
        removeItem: function (opt) {
            if (window.localStorage) {
                if (opt.clear) localStorage.clear();
                else localStorage.removeItem(opt.key);
            }
            else FJ.UserData.removeItem(opt);
        }
    };
    //#endregion

    //#region 主题操作
    if (!FJ.theme) {
        FJ.theme = {};
    }

    //更新已保存对象的控件主题
    FJ.theme.changeDrawTheme = function () {
        for (var o in fj.objs) {
            switch (fj.objs[o].p.fjType) {
                //                case "CDRJ":
                //                case "DPJ":
                //                case "TBJ":
                //                    if(fj.isIEno9) {
                //                        fj.objs[o].changeDrawTheme();
                //                    }
                //                    break;
                //                case "FUJ":
                //                    fj.objs[o].changeDrawTheme();
                //                    break;
            }
        }
    };

    //切换主题方法
    FJ.theme.changeFn = function (theme, noLoadConfig) {
        //var ver = fj.ver ? "?ver=" + fj.ver : "";
        fj.currentTheme = theme;
        fj.themeFolder = fj.themePath + theme + "/";

        //切换配置参数
        //        if (!noLoadConfig) {
        //            if (fj.isLocal) {
        FJ.JS.execute(fj.themePath + theme + "/fj.themeConfig.js", null, function () {
            //fj.theme.changeDrawTheme();
        });
        //            }
        //            else {
        //                $.ajax({
        //                    type: "GET",
        //                    url: fj.themePath + theme + "/fj.themeConfig.js" + ver,
        //                    dataType: "script",
        //                    async: false,
        //                    success: function () {
        //                        fj.theme.changeDrawTheme();
        //                    }
        //                });
        //            }
        //        }

        //#region 切换css
        //#region 单个组件CSS
        //        //组件
        //        FJ.CSS.change("themeCj", FJ.themePath + theme + "/css/fj.cj.theme.css" + ver);

        //        //加载层
        //        FJ.CSS.change("themeLmj", FJ.themePath + theme + "/css/fj.lmj.theme.css" + ver);

        //        //日历
        //        FJ.CSS.change("themeCdrj", FJ.themePath + theme + "/css/fj.cdrj.theme.css" + ver);

        //        //面板
        //        FJ.CSS.change("themePj", FJ.themePath + theme + "/css/fj.pj.theme.css" + ver);

        //        //选项卡
        //        FJ.CSS.change("themeTbj", FJ.themePath + theme + "/css/fj.tbj.theme.css" + ver);

        //        //表格
        //        FJ.CSS.change("themeDgj", FJ.themePath + theme + "/css/fj.dgj.theme.css" + ver);

        //        //分页
        //        FJ.CSS.change("themePnj", FJ.themePath + theme + "/css/fj.pnj.theme.css" + ver);

        //        //进度条
        //        FJ.CSS.change("themePbj", FJ.themePath + theme + "/css/fj.pbj.theme.css" + ver);

        //        //上传
        //        FJ.CSS.change("themeFuj", FJ.themePath + theme + "/css/fj.fuj.theme.css" + ver);

        //        //自动提示
        //        FJ.CSS.change("themeAcj", FJ.themePath + theme + "/css/fj.acj.theme.css" + ver);

        //        //菜单
        //        FJ.CSS.change("themeMuj", FJ.themePath + theme + "/css/fj.muj.theme.css" + ver);
        //#endregion
        FJ.CSS.change("themeFj", FJ.themePath + theme + "/css/fj.theme.all.css");
        //#endregion
    };

    //切换主题
    FJ.theme.change = function (theme, isInit) {
        if (fj.initTheme && !theme) {
            theme = fj.initTheme;
        }
        if (!theme) {
            theme = "blue";
        }

        //从本地存储获取主题
        if (isInit && fj.themeStoreName) {
            var themeS = fj.LocalStorage.getItem({ key: fj.themeStoreName });
            if (themeS) {
                theme = themeS;
            }
        }

        FJ.theme.changeFn(theme);

        //将主题记录在本地存储中
        if (fj.themeStoreName) {
            fj.LocalStorage.setItem({ key: fj.themeStoreName, value: theme });
        }
    };
    if (!fj.noLoadRes) {
        fj.theme.change(null, true);
    }
    //#endregion

    //#region 事件
    FJ.Evt = {};

    //#region 获取统一事件对象
    FJ.Evt.fix = function (e) {
        if (typeof e === "undefined") {
            e = window.event;
        }
        if (typeof e.layerX === "undefined") {
            e.layerX = e.offsetX;
        }
        if (typeof e.layerY === "undefined") {
            e.layerY = e.offsetY;
        }

        //keyBoardEvent对象键值
        e.key = e.keyCode ? e.keyCode : e.which;

        return e;
    };
    //#endregion

    //#region 测试标签
    FJ.Evt.testElem = document.createElement('flareJ');
    //#endregion

    //#region 点击
    FJ.Evt.click = "tap";
    //#endregion

    //#region 自定义点击
    FJ.Evt.customClick = FJ.isMobile ? "customTap" : "click";
    //#endregion

    //#region css过渡
    FJ.Evt.transition = (function () {
        var transitions = {
            'WebkitTransition': ['-webkit-transition', 'webkitTransitionEnd'],
            'MozTransition': ['-moz-transition', 'transitionend'],
            'OTransition': ['-o-transition', 'oTransitionEnd'],
            'MsTransition': ['-ms-transition', 'msTransitionEnd'],
            'transition': ['transition', 'transitionend']
        };

        for (var t in transitions) {
            if (fj.Evt.testElem.style[t] !== undefined) {
                var trans = transitions[t];
                return {
                    prop: t,
                    style: trans[0],
                    end: trans[1]
                };
            }
        }
        return false;
    })();
    //#endregion

    //#region css变换
    FJ.Evt.transform = (function () {
        var transforms = {
            'WebkitTransform': '-webkit-transform',
            'MozTransform': '-moz-transform',
            'OTransform': '-o-transform',
            'MsTransform': '-ms-transform',
            'transform': 'transform'
        };

        for (var t in transforms) {
            if (fj.Evt.testElem.style[t] !== undefined) {
                return {
                    prop: t,
                    style: transforms[t]
                };
            }
        }
        return false;
    })();
    //#endregion

    //#region css变换原点
    FJ.Evt.transformOrigin = (function () {
        var transformOrigins = {
            'WebkitTransformOrigin': '-webkit-transform-origin',
            'MozTransformOrigin': '-moz-transform-origin',
            'OTransformOrigin': '-o-transform-origin',
            'MsTransformOrigin': '-ms-transform-origin',
            'transformOrigin': 'transform-origin'
        };

        for (var t in transformOrigins) {
            if (fj.Evt.testElem.style[t] !== undefined) {
                return {
                    prop: t,
                    style: transformOrigins[t]
                };
            }
        }
        return false;
    })();
    //#endregion
    //#endregion

    //#region 设备震动
    FJ.vibrate = function (p) {
        if (!navigator.vibrate) {
            return;
        }

        if (!$.isArray(p)) {
            p = [p];
        }

        navigator.vibrate(p);
    };
    //#endregion

    //#region 媒体查询
    FJ.mediaQuery = function (media) {
        var ret = false;

        if (win.matchMedia) {  //浏览器支持js形式的媒体查询
            ret = win.matchMedia(media).matches;
        }
        else {  //如果浏览器不支持,则采用取页面尺寸对比的方式模拟
            var pw = fj.pageWidth(),
                minR = media.match(/\(min-width:\s[0-9]+px\)/g),
                maxR = media.match(/\(max-width:\s[0-9]+px\)/g),
                checkTimes = 0,
                trueTimes = 0;

            if (minR) {
                var minW = minR[0].match(/[0-9]+/g);
                checkTimes++;

                if (pw >= minW) {
                    trueTimes++;
                }
            }
            if (maxR) {
                var maxW = maxR[0].match(/[0-9]+/g);
                checkTimes++;

                if (pw <= maxW) {
                    trueTimes++;
                }
            }

            if (checkTimes > 0 && checkTimes === trueTimes) {
                ret = true;
            }
        }

        return ret;
    };
    //#endregion

    //#region 对象基类
    this.BaseJ = this.BJ = FJ.BaseJ = FJ.BJ = FJ.Class.extend({
        //#region 构造方法
        init: function (settings) {
            //参数
            this.settings = this.p = this.st = $.extend(true, {
                fjType: "BJ",
                objId: new Date().getTime() + Math.random().toFixed(6).substr(2),    //元素ID
                colorParams: {},                  //颜色参数
                evts: {},                         //事件
                eType: {},                        //实现执行子类事件时不会执行基类同名事件的标记,按每个事件名各写一个,值为当前类fjType
                responsive: false,                //是否支持响应式处理
                responsiveDelay: 70,              //页面尺寸改变时触发响应式处理延迟时间
                responsiveOnlyWidth: true,        //响应式处理时是否只针对宽度
                responsiveParam: {                //响应式配置
                    /*
                    "(max-width: 768px)|BJ": {    //格式同css媒体查询相同,附加fjType是为了解决mixin时对象名相同
                        params: { width: 320 },
                        handler: function(isInit) {
                            this.p.west.area.hide();
                        },
                        delay: 100
                    }
                    */
                }
            }, settings);

            this.p.colors = this.p.colorParams;
            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            if (this.p.objId != null) {
                this.objId = this.p.objId;
            }
            //设置FJ对象
            var b = fj.saveTypes && fj.saveTypes.length > 0;
            if (!fj.noSaveObj || b) {
                if (!fj.noSaveObj) {
                    FJ.set(this.p.objId, this);
                }
                else if (b && $.inArray(this.p.fjType, fj.saveTypes) >= 0) {  //需保存对象的类型
                    FJ.set(this.p.objId, this);
                }
            }

            //绑定自定义事件
            this.bindEvts();

            //响应式处理
            this.bindResponsiveEvts();
        },
        //#endregion

        //#region 构建
        create: null,
        //#endregion

        //#region 绑定自定义事件
        bindEvts: function () {
            for (var o in this.p.evts) {
                if (this.p.evts[o]) {
                    this.bindEvt(o, this.p.evts[o], true);
                }
            }
        },
        //#endregion

        //#region 绑定自定义事件(单个)
        bindEvt: function (name, fn, isInit) {
            if (!isInit) {
                this.p.evts[name] = fn;
            }
            $(this).bind(name, fn);
        },
        //#endregion

        //#region 执行事件
        fire: function () {
            if (this.p.evts[arguments[0]]) {
                var arg = arguments, inxL = arg.length - 1;
                if (typeof arg[inxL] == "string" && arg[inxL].substr(arg[inxL].length - 1) == "J") {
                    if (this.p.eType[arg[0]] && this.p.eType[arg[0]] == arg[inxL]) {//如果最后一个参数为fjType,则不执行基类的同名事件
                        return $(this).triggerHandler(arg[0], (function (a) {
                            if (typeof a == "object" || typeof a == "function") {
                                return a;
                            }
                            else {
                                return null;
                            }
                        })(arg[1]));
                    }
                }
                else {  //一定会执行的事件
                    return $(this).triggerHandler(arg[0], arg[1]);
                }
            }
        },
        //#endregion

        //#region 修改参数
        alterP: function (p) {
            this.p = $.extend(true, this.p, p);
        },
        //#endregion

        //#region 删除
        remove: function () {
            if (this.p.objId != null) {
                FJ.remove(this.p.objId);
            }

            //移除响应式事件
            if (this.responsiveResize) {
                $(window).off("resize", this.responsiveResize);
            }

            this.fire("afterRemove");
        },
        //#endregion

        //#region 绑定响应式事件
        bindResponsiveEvts: function () {
            if (!this.p.responsive || fj.isIElt9) {
                return;
            }
            var thiz = this,
                ow = this.p.responsiveOnlyWidth;

            this.responsiveResize = function () {  //页面尺寸改变时触发响应式处理
                fj.lazyDo(function () {
                    var isRh = true;
                    if (ow) {  //只有在页面宽度改变时执行响应式处理
                        var w = fj.pageWidth();
                        if (w !== this.globalWidth) {  //页面宽度和上一次不同
                            this.globalWidth = w;
                            isRh = true;
                        }
                        else {
                            isRh = false;
                        }
                    }

                    if (isRh) {  //响应式处理
                        this.responsiveHandle();
                    }
                }, thiz.p.responsiveDelay, "ld_bj_responsive", thiz);
            };
            $(window).on("resize", this.responsiveResize);

            this.responsiveHandle(true);  //初始化时执行一次响应式处理
        },
        //#endregion

        //#region 响应式处理
        responsiveHandle: function (isInit) {
            var thiz = this,
                o,
                rp = this.p.responsiveParam;

            for (o in rp) {
                var rpp = rp[o],
                    fnP = function () {
                        if (rpp.preHandler) {  //执行响应前操作
                            rpp.preHandler.call(thiz, isInit);
                        }
                        if (rpp.params) {  //设置响应参数
                            $.extend(true, thiz.p, rpp.params);
                        }
                        if (rpp.handler) {  //执行响应操作
                            rpp.handler.call(thiz, isInit);
                        }
                    };

                if (fj.mediaQuery(o.split("|")[0])) {  //符合条件时执行响应式处理
                    if (rpp.delay) {  //可延迟执行时间
                        fj.lazyDo(function () {
                            fnP();
                        }, rpp.delay);
                    }
                    else {
                        fnP();
                    }
                }
            }
        }
        //#endregion
    });
    //#endregion

    //#region 组件
    /*-----------------------------------------------------*
    * 各组件全局通用配置对象命名规范为:fjType_commonConfig
    *-----------------------------------------------------*/
    this.ComponentJ = this.CJ = FJ.ComponentJ = FJ.CJ = FJ.BJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //#region 兼容旧版本末尾加F的属性
            if (settings) {
                if (settings.widthF != null) {
                    settings.width = settings.widthF;
                }
                if (settings.heightF != null) {
                    settings.height = settings.heightF;
                }
                if (settings.leftF != null) {
                    settings.left = settings.leftF;
                }
                if (settings.topF != null) {
                    settings.top = settings.topF;
                }
            }
            //#endregion

            //参数
            this._super($.extend(true, {
                fjType: "CJ",
                obj: elemObj,                              //选择器选中的jquery对象
                selCondition: null,                        //选择器选中jquery对象的条件
                renderTo: "body",                         //要加载到的容器
                renderType: "append",                     //渲染方式
                width: 100,                               //最大宽度
                height: 100,                              //最大高度
                borderWidth: 1,                            //边框宽度
                style: null,                               //样式
                colorParams: {                             //颜色参数
                    borderOut: null,                       //外层边框
                    bgColor: null                          //背景色
                },
                evts: {                                    //事件
                    beforeRender: function () { },          //渲染前
                    afterRender: function () { }            //渲染后
                },
                eType: (function (j) {
                    return {
                        beforeRender: j,
                        afterRender: j,
                        beforeRemove: j
                    };
                })("CJ")
            }, settings));

            this.p.colors = this.p.colorParams;
            this.divOut = null;   //外层对象

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();

            //将参数字符串转化为jquery对象
            this.p.renderTo = (typeof this.p.renderTo == 'string' ? $(this.p.renderTo) : this.p.renderTo);

            //外层对象ID
            if (this.p.objId == null) {
                this.objId = "CJ_" + new Date().getTime() + Math.random().toFixed(6).substr(2);
            }
            else {
                this.objId = this.p.objId;
            }
        },
        //#endregion

        //#region 构建
        create: function (isShow) {
            this.fire("beforeRender", "CJ");

            //外层
            this.divOut = $('<div id="' + this.objId + '"></div>')[this.p.renderType + "To"](this.p.renderTo);

            //设置自定义样式
            if (this.p.style != null) {
                this.divOut.attr("style", this.p.style);
            }

            //设置默认样式
            this.divOut.addClass("cj").css({
                width: typeof this.p.width == "number" ? this.p.width + "px" : this.p.width,
                height: typeof this.p.height == "number" ? this.p.height + "px" : this.p.height
            });
            if (!isShow) {
                this.divOut.css("display", "none");
            }
            var bw = this.p.borderWidth;
            if (bw != null) {
                if (fj.RX.numZ(bw)) {
                    this.divOut.css("border-width", bw);
                }
                else if (typeof bw == "object") {
                    this.divOut.css({
                        borderTopWidth: bw.t,
                        borderRightWidth: bw.r,
                        borderBottomWidth: bw.b,
                        borderLeftWidth: bw.l
                    });
                }
            }
            if (this.p.colorParams.borderOut) {
                this.divOut.css("border-color", this.p.colorParams.borderOut);
            }
            if (this.p.colorParams.bgColor) {
                this.divOut.css("background-color", this.p.colorParams.bgColor);
            }

            this.fire("afterRender", "CJ");
            return this;
        },
        //#endregion

        //#region 显示
        show: function (isIb) {
            this.divOut.each(function () {
                this.style.display = isIb ? "inline-block" : "block";
            });
            return this;
        },
        //#endregion

        //#region 隐藏
        hide: function () {
            if (this.divOut != null) {
                this.divOut.hide();
            }
        },
        //#endregion

        //#region 关闭
        close: function () {
            if (this.divOut != null) {
                this.divOut.hide();
            }
            this.divOut.remove();
        },
        //#endregion

        //#region 删除
        remove: function () {
            this.fire("beforeRemove", "CJ");
            this.divOut.remove();
            this._super();
        },
        //#endregion

        //#region 显示、隐藏
        display: function (b) {
            if (b === true || b === 1 || b == null) {
                this.divOut.show();
            }
            else {
                this.divOut.hide();
            }
        },

        setVisible: function (b) {
            this.display(b);
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        ComponentJ: function (settings) {
            if (this && this.length > 0) {
                return new FJ.ComponentJ(this, settings);
            }
        },
        CJ: function (settings) {
            return $(this).ComponentJ(settings);
        }
    });
    //#endregion

    //#region 创建vml按钮模板
    //    if (fj.isIEno10) {
    //        if (!document.namespaces.v) {  //加入vml命名空间
    //            document.namespaces.add('v', 'urn:schemas-microsoft-com:vml', "#default#VML");
    //        }
    //        document.write('<div style="height:0;width:0;overflow:hidden;"><v:shapetype id="cjArrowLeft" coordsize="6 6"><v:path class="cj_vml" v="m 6,6 l 0,3,6,0,6,0 x e" /></v:shapetype><v:shapetype id="cjArrowRight" coordsize="6 6"><v:path class="cj_vml" v="m 0,6 l 6,3,6,3,0,0 x e" /></v:shapetype></div>');
    //    }
    //#endregion
    //#endregion

    //#region 动画
    FJ.Animate = {};

    //#region 淡入淡出
    FJ.Animate.fadeIn = function (target, p, noAni) {
        var scale = "scale(0.85, 0.9)",
            easing = "ease-in-out";

        if (p.scale) {
            scale = p.scale;
            p.scale = null;
        }
        if (p.easing) {
            easing = p.easing;
            p.easing = null;
        }

        p = $.extend(true, {
            duration: 0.3,
            easing: easing,
            opacity: 1,
            transform: "scale(1, 1)"
        }, p);

        target.css({
            opacity: 0.1
        });
        target[0].style[fj.Evt.transform.prop] = scale;

        fj.lazyDo(function () {
            target.transitionJ(p, noAni);
        });
    };

    FJ.Animate.fadeOut = function (target, p, noAni) {
        var scale = "scale(0.85, 0.9)",
            easing = "ease-in-out";

        if (p.scale) {
            scale = p.scale;
            p.scale = null;
        }
        if (p.easing) {
            easing = p.easing;
            p.easing = null;
        }

        p = $.extend(true, {
            duration: 0.3,
            easing: easing,
            opacity: 0.1,
            transform: scale
        }, p);

        target.transitionJ(p, noAni);
    };
    //#endregion
    //#endregion

    //#region 字符串构造器
    this.StringBuilderJ = this.STJ = fj.StringBuilderJ = fj.STJ = fj.BJ.extend({
        //#region 构造方法
        init: function (settings) {
            //参数
            this._super($.extend(true, {
                fjType: "STJ",
                text: null,  //初始字符串
                link: ""
            }, settings));

            this.initFn();   //初始化

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();

            //创建存储字符串的数组
            this.strs = [];
            if (this.p.text != null) {
                this.strs[this.strs.length] = this.p.text;
            }
        },
        //#endregion

        //#region 添加字符串
        add: function (p) {
            if (!$.isArray(p)) {  //参数为字符串
                this.strs[this.strs.length] = p;
            }
            else {  //参数为数组
                for (var i = 0, c = this.strs.length, l = p.length; i < l; i++) {
                    this.strs[i + c] = p[i];
                }
            }

            return this;
        },
        //#endregion

        //#region 清空
        clear: function () {
            this.strs.length = 0;
        },
        //#endregion

        //#region 连接并返回字符串
        join: function (link) {
            if (link != null) {
                this.p.link = link;
            }
            return this.strs.join(this.p.link);
        }
        //#endregion
    });

    //静态方法
    fj.STJ.init = function (p) {
        return new fj.STJ(p);
    };

    //快速连接方法
    fj.STJ.join = function (p, l) {
        return fj.STJ.init().add(p).join(l);
    };
    //#endregion

    //#region 克隆对象(深度复制)
    FJ.clone = function (obj) {
        if (Object.prototype.toString.call(obj) === "[object Array]") {  //数组
            var out = [], i = 0, len = obj.length;
            for (; i < len; i++) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        else if (obj != null && typeof obj === "object") {  //对象
            var out = {}, i;
            for (i in obj) {
                out[i] = arguments.callee(obj[i]);
            }
            return out;
        }
        return obj;
    };
    //#endregion

    //#region 浏览器插件

    //#region silverlight
    FJ.SilverLight = FJ.SL = {};

    //#region silverlight报错方法
    this.onSLerrorJ = this.onSilverlightErrorJ = function (sender, args) {
        var appSource = "";
        if (sender != null && sender != 0) {
            appSource = sender.getHost().Source;
        }

        var errorType = args.ErrorType;
        var iErrorCode = args.ErrorCode;

        if (errorType == "ImageError" || errorType == "MediaError") {
            return;
        }

        var errMsg = "Silverlight 应用程序中未处理的错误 " + appSource + "\n";

        errMsg += "代码: " + iErrorCode + "    \n";
        errMsg += "类别: " + errorType + "       \n";
        errMsg += "消息: " + args.ErrorMessage + "     \n";

        if (errorType == "ParserError") {
            errMsg += "文件: " + args.xamlFile + "     \n";
            errMsg += "行: " + args.lineNumber + "     \n";
            errMsg += "位置: " + args.charPosition + "     \n";
        }
        else if (errorType == "RuntimeError") {
            if (args.lineNumber != 0) {
                errMsg += "行: " + args.lineNumber + "     \n";
                errMsg += "位置: " + args.charPosition + "     \n";
            }
            errMsg += "方法名称: " + args.methodName + "     \n";
        }

        throw new Error(errMsg);
    };
    //#endregion

    //#region 检测silverlight播放器是否安装
    FJ.SL.CheckSLInstalled = function () {
        var isSilverlightInstalled = false;
        try {
            try {
                var slControl = new ActiveXObject('AgControl.AgControl'); //检查IE   
                isSilverlightInstalled = true;
            }
            catch (e) {
                if (navigator.plugins["Silverlight Plug-In"]) //检查非IE   
                {
                    isSilverlightInstalled = true;
                }
            }
        }
        catch (e) { }
        return isSilverlightInstalled;
    };
    //#endregion

    //#region 创建silverlight承载标签
    FJ.SL.create = function (p) {
        var objSlHtml = ['<object id="' + p.id + '" data="data:application/x-silverlight-2," type="application/x-silverlight-2" style="width:100%;height:100%;">'];
        objSlHtml.push('<param name="source" value="' + p.xapPath + '" />');
        objSlHtml.push('<param name="onerror" value="onSLerrorJ" />');
        objSlHtml.push('<param name="background" value="white" />');
        objSlHtml.push('<param name="onload" value="pluginLoaded" />');
        objSlHtml.push('<param name="minRuntimeVersion" value="4.0.50826.0" />');
        objSlHtml.push('<param name="autoUpgrade" value="true" />');
        objSlHtml.push('<param value="' + p.windowless + '" name="windowless" />');  //使sl不会遮住下拉框等元素
        objSlHtml.push('<param name="initParams" value="' + p.initParams + '" />');
        objSlHtml.push('<a href="http://go.microsoft.com/fwlink/?LinkID=124807" style="text-decoration: none;"><img src="http://go.microsoft.com/fwlink/?LinkId=108181" alt="获取 Microsoft Silverlight" style="border-style: none" /></a>');
        objSlHtml.push('</object>');
        objSlHtml.push('<iframe style="visibility: hidden; height: 0; width: 0; border: 0px"></iframe>');
        return objSlHtml.join("");
    };
    //#endregion
    //#endregion

    //#region flex
    FJ.Flex = FJ.FX = {};

    //加载swfobject.js
    //if (!window.swfobject) {
    //$.getScript(FJ.rootPath + "swf/swfobject.js");
    //}

    //#region 创建Flex承载标签
    FJ.FX.create = function (id, swfPath, renderEl, width, height, vars, bgColor, ver) {  //需要swfobject.js
        var swfVersionStr = "10.0.0";
        if (ver) {
            swfVersionStr = ver;
        }
        var xiSwfUrlStr = FJ.rootPath + "resources/swf/playerProductInstall.swf";

        var flashvars = {};  //参数
        if (vars) {
            flashvars = $.extend(flashvars, vars);
        }

        var params = {};
        params.quality = "high";
        params.allowscriptaccess = "sameDomain";
        params.allowfullscreen = "true";

        if (bgColor) {  //背景色
            params.bgcolor = bgColor;
        }
        else {
            params.wmode = "transparent";  //透明
        }

        var attributes = {};
        attributes.id = id;
        attributes.name = id;
        attributes.align = "middle";
        swfobject.embedSWF(
            swfPath, renderEl,
            width, height,
            swfVersionStr, xiSwfUrlStr,
            flashvars, params, attributes);
    };
    //#endregion

    //#region 获取FlashPlayer版本
    FJ.getFlashVer = function () {
        var f = "0.0";
        var n = navigator;

        if (n.plugins && n.plugins.length) {
            for (var i = 0, l = n.plugins.length; i < l; i++) {
                var plu = n.plugins[i];
                if (plu.name.indexOf('Shockwave Flash') != -1) {
                    f = plu.description.split('Shockwave Flash')[1].split(' ')[1];
                    break;
                }
            }
        }
        else if (window.ActiveXObject) {
            for (var i = 10; i >= 2; i--) {
                try {
                    var fl = fj.exec("new ActiveXObject('ShockwaveFlash.ShockwaveFlash." + i + "');");
                    if (fl) {
                        f = i + '.0'; break;
                    }
                }
                catch (e) { }
            }
        }

        return f;
    };
    //#endregion
    //#endregion

    //#region activeX
    //#region 判断IE浏览器的当前安全设置是否可调用activex控件
    FJ.isActiveXSafe = function () {
        var WshShell;
        var safe = false;
        try {
            WshShell = new ActiveXObject("WScript.Shell");
        }
        catch (e) {  //失败说明安全
            safe = true;
        }
        return safe;
    };
    //#endregion
    //#endregion

    //#endregion

    //#region 检测浏览器是否支持某标签
    FJ.checkTag = function (tagName) {
        var ret = true,
            tag = document.createElement(tagName);

        switch (tagName) {
            case "bgsound":
                ret = "volume" in tag;
                break;
            case "progress":
                ret = "max" in tag;
                break;
            case "canvas":
                ret = "getContext" in tag;
                break;
            case "audio":
                ret = "autoplay" in tag;
                break;
            case "video":
                ret = "canPlayType" in tag;
                break;
        }
        return ret;
    };
    //#endregion

    //#region 播放声音
    FJ.playSound = {};

    //检测是否支持声音标签
    var _bgsound = FJ.checkTag("bgsound") && FJ.isIE,
        _audio = FJ.checkTag("audio");

    //预加载声音
    FJ.playSound.init = function (id, media) {
        var audioElem;
        if (_bgsound) {
            audioElem = $('<bgsound id="fjps_bg_' + id + '" volume="-10000" loop="1" src="' + media + '">');
        }
        else if(_audio) {
            //if (FJ.isWinXP || FJ.isWinVista || FJ.isWin7) {
            //    //document.write('<span id="fjps_sp_' + id + '"><bgsound volume="-1000000" id="fjps_bg_' + id + '" loop="1" src="' + media + '"></span>');  //如果FF安装了mediawrap插件则能使用bgsound播放
            //    document.write('<span id="fjps_sp_' + id + '"><embed width="0" height="0" id="fjps_bg_' + id + '" autostart="1" pluginspage="http://www.microsoft.com/windows/windowsmedia/" playcount="1" volume="-9900" mediawrapchecked="true" src="' + media + '" type="application/x-mplayer2" splayername="BG" tplayername="NewWMP"></span>');
            //}
            audioElem = $('<audio id="fjps_bg_' + id + '" src="' + media + '" autobuffer ></audio>');
        }

        if(audioElem) {
            FJ.oBody.prepend(audioElem);
            FJ.playSound[id] = audioElem;
        }
    };

    //播放声音
    FJ.playSound.play = function (id) {
        fj.lazyDo(function () {  //异步播放
            var audioElem = FJ.playSound[id];
            if(!audioElem) {
                return;
            }

            if (_bgsound) {
                var sound = audioElem[0];
                sound.volume = 1;
                sound.src = sound.src;
            }
            else if(_audio) {
                //if (FJ.isWinXP || FJ.isWinVista || FJ.isWin7) {
                //    var sound = $("#fjps_sp_" + id)[0];
                //    //sound.innerHTML = '<bgsound volume="1" id="fjps_bg_' + id + '" loop="1" src="' + $("#fjps_bg_" + id)[0].src + '" />';
                //    sound.innerHTML = '<embed width="0" height="0" id="fjps_bg_' + id + '" autostart="1" pluginspage="http://www.microsoft.com/windows/windowsmedia/" playcount="1" volume="0" mediawrapchecked="true" src="' + $("#fjps_bg_" + id)[0].src + '" type="application/x-mplayer2" splayername="BG" tplayername="NewWMP">';
                //}
                try {
                    audioElem[0].play();
                }
                catch (e) { }
            }
        });
    };

    //重置声音
    FJ.playSound.reset = function (id) {
        if (_bgsound) {
            var audioElem = FJ.playSound[id];
            if(!audioElem) {
                return;
            }

            audioElem[0].volume = -10000;
        }
    };

    //#endregion

    //#region 打印

    //打印错误提示信息(IE only)
    FJ.printErrorMsg = "您的IE浏览器禁止了打印功能。\n\n请依次点击进入\"工具\">\"Internet选项\">\"安全\">\"自定义级别\"\n\n将\"对于没有标记为可安全执行脚本的ActiveX控件的执行\"项设置为\"启用\"或\"提示\"。";

    //修改打印设置注册表值
    FJ.print_HKEY_Root = "HKEY_CURRENT_USER";
    FJ.print_HKEY_Path = "\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";

    //默认打印配置参数
    FJ.printConfig = {
        header: "&w&b页码,&p/&P",
        footer: "&u&b&d",
        marginBottom: 0.75,
        marginLeft: 0.75,
        marginRight: 0.75,
        marginTop: 0.75
    };

    //打印
    FJ.print = function (notPreview) {
        if (fj.isIE) {
            if (!notPreview) {  //是否使用打印预览
                if ($("#fj_webBrowser").length == 0) {
                    var oWb = $('<object id="fj_webBrowser" style="display:none;" classid="CLSID:8856F961-340A-11D0-A96B-00C04FD705A2" height="0" width="0" ></object>');
                    FJ.oBody.append(oWb);
                    FJ.print.wb = oWb[0];
                }

                if (!fj.isActiveXSafe()) {
                    FJ.print.wb.ExecWB(7, 1);  //开启预览
                }
                else {
                    alert(FJ.printErrorMsg);
                }
            }
            else {
                window.print();
            }
        }
        else {
            window.print();
        }
    };

    //创建禁止打印元素样式表
    FJ.noPrint = function (css) {
        FJ.CSS.createStyle("fj_noPrint", css, null, "print");
    };

    //修改打印设置(IE only)
    FJ.setPrint = function (p) {
        if (fj.isIE) {
            if (!fj.isActiveXSafe()) {
                var Wsh = new ActiveXObject("WScript.Shell");
                if (p.header != null) {
                    Wsh.RegWrite(FJ.print_HKEY_Root + FJ.print_HKEY_Path + "header", p.header);                 //页眉
                }
                if (p.footer != null) {
                    Wsh.RegWrite(FJ.print_HKEY_Root + FJ.print_HKEY_Path + "footer", p.footer);                 //还原页脚
                }
                if (p.marginBottom != null) {
                    Wsh.RegWrite(FJ.print_HKEY_Root + FJ.print_HKEY_Path + "margin_bottom", p.marginBottom);    //下页边距
                }
                if (p.marginLeft != null) {
                    Wsh.RegWrite(FJ.print_HKEY_Root + FJ.print_HKEY_Path + "margin_left", p.marginLeft);        //左页边距
                }
                if (p.marginRight != null) {
                    Wsh.RegWrite(FJ.print_HKEY_Root + FJ.print_HKEY_Path + "margin_right", p.marginRight);      //右页边距
                }
                if (p.marginTop != null) {
                    Wsh.RegWrite(FJ.print_HKEY_Root + FJ.print_HKEY_Path + "margin_top", p.marginTop);          //上页边距
                }
            }
            else {
                alert(FJ.printErrorMsg);
            }
        }
    };

    //还原默认打印设置(IE only)
    FJ.setPrintDefault = function () {
        FJ.setPrint(FJ.printConfig);
    };
    //#endregion

    //#region 获取鼠标在某元素内部的坐标
    FJ.getXY = function (el) {
        var d = document,
			bd = d.body,
			r = { t: 0, l: 0 },
			ua = navigator.userAgent.toLowerCase(),
			isStrict = d.compatMode == "CSS1Compat",
			isGecko = /gecko/.test(ua),
			add = function (t, l) { r.l += l, r.t += t },
			p = el;
        if (el && el != bd) {
            if (el.getBoundingClientRect) {
                var b = el.getBoundingClientRect();
                add(b.top + Math.max(d.body.scrollTop, d.documentElement.scrollTop),
					b.left + Math.max(d.body.scrollLeft, d.documentElement.scrollLeft));
                isStrict ? add(-d.documentElement.clientTop, -d.documentElement.clientLeft) : add(-1, -1)
            } else {
                var dv = d.defaultView;
                while (p) {
                    add(p.offsetTop, p.offsetLeft);
                    var computStyle = dv.getComputedStyle(p, null);
                    if (isGecko) {
                        var bl = parseInt(computStyle.getPropertyValue('border-left-width'), 10) || 0,
							bt = parseInt(computStyle.getPropertyValue('border-top-width'), 10) || 0;
                        add(bt, bl);
                        if (p != el && computStyle.getPropertyValue('overflow') != 'visible')
                            add(bt, bl);
                    }
                    p = p.offsetParent;
                }
                p = el.parentNode;
                while (p && p != bd) {
                    add(-p.scrollTop, -p.scrollLeft);
                    p = p.parentNode;
                }
            }
        }
        return r;
    };
    //#endregion

    //#region 服务器请求
    FJ.Request = {};

    FJ.Request.queryString = FJ.Request.qs = function (item) {  //获取url参数
        var svalue = location.search.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
        return svalue ? svalue[1] : svalue;
    };

    FJ.Request.delQueryString = function (url) {  //去除url参数
        return url.replace(/[?#].*/, "");
    };

    FJ.Request.post = function (url, data, name, callback) {  //post提交页面
        var tempForm = document.createElement("form");
        tempForm.id = "tempForm_" + new Date().getTime();
        tempForm.method = "post";
        tempForm.action = url;
        tempForm.target = name;

        for (var i = 0, l = data.length; i < l; i++) {
            var hideInput = document.createElement("input");
            hideInput.type = "hidden";
            hideInput.name = data[i][0];
            hideInput.value = data[i][1];
            tempForm.appendChild(hideInput);
        }

        if (tempForm.attachEvent) {
            tempForm.attachEvent("onsubmit", function () {
                callback(data);
            });
        }
        else {
            tempForm.addEventListener("onsubmit", function () {
                callback(data);
            }, true);
        }
        document.body.appendChild(tempForm);

        if (tempForm.fireEvent) {
            tempForm.fireEvent("onsubmit");
        }
        else {
            var e = document.createEvent('HTMLEvents');
            e.initEvent("onsubmit", false, false);
            tempForm.dispatchEvent(e);
        }
        tempForm.submit();
        document.body.removeChild(tempForm);
    },
    //#endregion

    //#region 设置主页、收藏夹
    FJ.setHomePage = function (url, error) {
        if (document.all) {
            document.body.style.behavior = 'url(#default#homepage)';
            document.body.setHomePage(url);
        }
        else {
            if (window.sidebar) {
                if (window.netscape) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                    }
                    catch (e) {
                        alert("该操作被浏览器拒绝，如果想启用该功能，请在地址栏内输入about:config,然后将项signed.applets.codebase_principal_support的值改为true");
                    }
                }
                var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
                prefs.setCharPref('browser.startup.homepage', url);
            }
            else {
                var errorInfo = "您的浏览器不支持自动设置主页";
                if (error) {
                    errorInfo = error;
                }
                alert(errorInfo);
            }
        }
    };

    FJ.addMyFavorite = function (url, name, error) {
        if (document.all) {
            window.external.addFavorite(url, name);
        }
        else {
            if (window.sidebar) {
                window.sidebar.addPanel(name, url, '');
            }
            else {
                var errorInfo = "您的浏览器不支持自动加入收藏\n请按ctrl+d加入收藏";
                if (error) {
                    errorInfo = error;
                }
                alert(errorInfo);
            }
        }
    };
    //#endregion

    //#region 正则表达式
    FJ.RegExp = FJ.RX = {
        test: function (exp, val, p) {
            if (new RegExp(exp, p).test(val)) {
                return true;
            }
            else {
                return false;
            }
        },
        ep: {   //常用正则表达式
            num: /^\+?[1-9][0-9]*$/,  //大于0的整数
            numZ: /^\+?[0-9][0-9]*$/, //正整数(包含0)
            numZ2: /^-?[0-9][0-9]*$/, //整数(包含0、负数)
            numF: /^-?([0-9][0-9]*)(\.\d{1,2})?$/, //数字(包含负数、0,最多两位小数)
            numF2: /^([0-9][0-9]*)(\.\d{1,2})?$/, //数字(不含负数,最多两位小数)
            numD: /^-?([0-9][0-9]*)(\.\d{1,10})?$/, //数字(包含负数、0,最多10位小数)
            numD2: /^(([0-9]+[\.]?[0-9]+)|[1-9])$/, //数字(不含负数和0,无限位小数)
            numD3: /^(([0-9]+[\.]?[0-9]+)|[0-9])$/, //数字(不含负数,无限位小数)
            num0_100: /^(?:0|[1-9][0-9]?|100)$/,  //0-100内整数
            num0_1: /^[01]$|^0\.\d{1,2}$|^1\.0{1,2}$/,  //0-1之间小数(最多两位),包含0、1
            post: /^\d{6}$/, //邮编
            phone: /^(((\()?\d{2,4}(\))?[-(\s)*]){0,2})?(\d{7,8})$/, //固定电话(区号部分为2-4位数字,外面可以加括号,后面可以加斜杠或空格,可重复1-2次;电话号码部分为7-8位)
            mobile: /^[1][3,5,8][0-9]{9}$/, //手机号
            email: /^[0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@(([0-9a-zA-Z])+([-\w]*[0-9a-zA-Z])*\.)+[a-zA-Z]{2,9}$/, //Email(@前面不能以点为结尾)
            date: /^\d{4}-\d{2}-\d{2}$/,  //日期是否yyyy-MM-dd格式
            time: /^\d{2}:\d{2}:\d{2}$/,  //时间是否hh:mm:ss格式
            datetime: /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/,  //日期时间是否yyyy-MM-dd hh:mm:ss格式
            datetimeO: /^\d{4}-\d{2}-\d{2}( \d{2}:\d{2}:\d{2})?$/,  //是否date或datetime格式
            pass: /^[0-9a-zA-Z]{6,16}$/,  //密码格式是否由字母和数字组成,长度为6-16位
            user: /^[a-zA-Z][a-zA-Z0-9_\u4E00-\u9FA5]{3,15}$/,  //用户名格式是否由字母、数字、中文和下划线组成,以字母开头,长度为4-16位
            ip: /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}(:(6553[0-5]|655[0-2]\d|65[0-4]\d{2}|6[0-4]\d{3}|[1-5]\d{4}|[1-9]\d{0,3}))?$/, //IP格式为xxx.xxx.xxx.xxx或xxx.xxx.xxx.xxx:端口号,xxx的值必须是0-255,端口号的值必须是1-65535
            cardId: /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/i,   //身份证
            enFirst: /^[a-zA-Z][\s\S]*$/,  //英文开头
            chFirst: /^[\u4E00-\u9FA5][\s\S]*$/,  //中文开头
            percent: /^\+?(([1-9]\d?)|(100)|(0))\%$/  //百分数(0%-100%)
        }
    };

    for (var ep in FJ.RegExp.ep) {   //测试表达式方法
        (function (o) {
            FJ.RegExp[o] = function (val) {
                return FJ.RX.test(FJ.RX.ep[o], val);
            };
        })(ep);
    };

    //逗号分隔符
    FJ.RX.rword = /[^, ]+/g;

    //#endregion

    //#region 数学
    FJ.Math = {};

    //千分位转换
    FJ.Math.outputMoney = function (number, bit) {
        var numO = number;  //保存原先值

        try {
            if (bit == null) {
                bit = 2;
            }

            if (isNaN(number) || number == "") {
                return "0";
            }
            number = number.toFixed(bit);
            if (number < 0) {
                return '-' + FJ.Math.outputDollars(Math.floor(Math.abs(number) - 0) + '') + FJ.Math.outputCents(Math.abs(number) - 0, bit);
            }
            else {
                return FJ.Math.outputDollars(Math.floor(number - 0) + '') + FJ.Math.outputCents(number - 0, bit);
            }
        }
        catch (e) {  //出现异常时返回原先值
            return numO;
        }
    };

    FJ.Math.outputDollars = function (number) {
        if (number.length <= 3) {
            return (number == '' ? '0' : number);
        }
        else {
            var mod = number.length % 3;
            var output = (mod == 0 ? '' : (number.substring(0, mod)));
            for (i = 0; i < Math.floor(number.length / 3) ; i++) {
                if ((mod == 0) && (i == 0))
                    output += number.substring(mod + 3 * i, mod + 3 * i + 3);
                else
                    output += ',' + number.substring(mod + 3 * i, mod + 3 * i + 3);
            }
            return (output);
        }
    };

    FJ.Math.outputCents = function (amount, bit) {
        if (bit != null) {
            amount = amount.toFixed(bit);
        }
        else {
            bit = 2;
        }

        if (bit > 0) {
            amount = (amount + "").match(/\.\d*$/g);      //截取小数点及小数部分
            //amount = (amount + "").replace(/0+?$/g, "");  //去除小数点后多余的0
        }
        else {
            amount = "";
        }

        return amount;
    };

    //在1位数字前补零
    FJ.Math.addZero = function (n) {
        return (("00" + n).substr(("00" + n).length - 2));
    };
    //#endregion

    //#region 日期
    FJ.Date = {};

    //获取当前时间
    FJ.Date.getTime = function () {
        return new Date().getTime();
    };

    //日期转换
    FJ.Date.parse = function (s) {
        var t = s.replace(/-/g, "/").replace(/T/g, " ");
        var iDot = t.indexOf(".");
        if (iDot != -1)
            t = t.substr(0, iDot);
        var d = new Date(t);
        return d;
    };

    //日期比较
    FJ.Date.dateDiff = function (sDate1, sDate2, returnType, useAbs) {
        var aDate, aDate1, aDate2, oDate1, oDate2, days, iDays;

        if (typeof sDate1 != "object") {
            if (sDate1.indexOf(" ") != -1) {
                aDate = sDate1.split(" ");
                aDate1 = aDate[0].split("-");
                aDate2 = aDate[1].split(":");
                oDate1 = new Date(aDate1[0], aDate1[1] - 1, aDate1[2], aDate2[0], aDate2[1], aDate2[2]);
            }
            else {
                aDate1 = sDate1.split("-");
                oDate1 = new Date(aDate1[0], aDate1[1] - 1, aDate1[2]);
            }
        }
        else {
            oDate1 = sDate1;
        }

        if (typeof sDate2 != "object") {
            if (sDate2.indexOf(" ") != -1) {
                aDate = sDate2.split(" ");
                aDate1 = aDate[0].split("-");
                aDate2 = aDate[1].split(":");
                oDate2 = new Date(aDate1[0], aDate1[1] - 1, aDate1[2], aDate2[0], aDate2[1], aDate2[2]);
            }
            else {
                aDate1 = sDate2.split("-");
                oDate2 = new Date(aDate1[0], aDate1[1] - 1, aDate1[2]);
            }
        }
        else {
            oDate2 = sDate2;
        }

        days = oDate1 - oDate2;  //计算日期差值
        if (useAbs) {  //取绝对值
            days = Math.abs(days);
        }

        //把相差的毫秒数转换为日期数值
        switch (returnType) {
            case "h":  //小时
                iDays = parseInt(days / 1000 / 60 / 60, 10);
                break;
            case "m":  //分钟
                iDays = parseInt(days / 1000 / 60, 10);
                break;
            case "s":  //秒
                iDays = parseInt(days / 1000, 10);
                break;
            case "ms":  //毫秒
                iDays = days;
                break;
            default:   //天
                iDays = parseInt(days / 1000 / 60 / 60 / 24, 10);
                break;
        }

        return iDays;
    };

    //日期格式化
    FJ.Date.toFormatString = function (date, fs, noAddZero) {
        if (fs.length == 1) {
            return date.getFullYear() + fs + (date.getMonth() + 1) + fs + date.getDate();
        }
        fs = fs.replace("yyyy", date.getFullYear());
        fs = fs.replace("mm", noAddZero ? (date.getMonth() + 1) : FJ.Math.addZero(date.getMonth() + 1));
        fs = fs.replace("dd", noAddZero ? date.getDate() : FJ.Math.addZero(date.getDate()));
        fs = fs.replace("hh", noAddZero ? date.getHours() : FJ.Math.addZero(date.getHours()));
        fs = fs.replace("MM", noAddZero ? date.getMinutes() : FJ.Math.addZero(date.getMinutes()));
        fs = fs.replace("ss", noAddZero ? date.getSeconds() : FJ.Math.addZero(date.getSeconds()));
        return fs;
    };

    //获取某些天后的日期
    FJ.Date.GetDateStr = function (addDays, addDays2, joinTxt, fs) {
        var dd = new Date(), d1, d2 = "";
        dd.setDate(dd.getDate() + addDays);
        d1 = fj.Date.toFormatString(dd, fs != null ? fs : "yyyy-mm-dd");
        if (addDays2 != null) {  //第二个日期
            var dd2 = new Date();
            dd2.setDate(dd2.getDate() + addDays2);
            d2 = fj.Date.toFormatString(dd2, fs != null ? fs : "yyyy-mm-dd");
        }
        return d1 + (joinTxt != null ? joinTxt : "") + d2;
    };
    //#endregion

    //#region 随机数
    FJ.guid = function () {
        return FJ.Date.getTime() + Math.random().toFixed(6).substr(2);
    };
    //#endregion

    //#region 排序
    FJ.Sort = {};

    //取字符串的第一个字符
    FJ.Sort.getFirstChar = function (s) {
        if (s == "") return "";
        return (s + "").substr(0, 1);
    };

    //取得汉字的拼音
    FJ.Sort.getGB2312Spell = function (str, sp) {
        var i, c, t, p, ret = "";
        if (sp == null) sp = "";
        for (i = 0, l = str.length; i < l; i++) {
            if (str.charCodeAt(i) >= 0x4e00) {
                p = FJ.strGB.indexOf(str.charAt(i));
                if (p > -1 && p < 3755) {
                    for (t = FJ.spell.length - 1; t > 0; t = t - 2) if (FJ.spell[t] <= p) break;
                    if (t > 0) ret += FJ.spell[t - 1] + sp;
                }
            }
        }
        return ret.substr(0, ret.length - sp.length);
    };

    //简单值比较算法
    FJ.Sort.compare = function (x, y, isAsc, spC, spC2, spV) {
        spV = spV != null ? spV : -1;
        if (spC && !spC2) {  //如有禁止排序标记则拍在最低位置
            return -1;
        }
        else if (!spC && spC2) {
            return 1;
        }
        else if (spC && spC2) {
            return 0;
        }
        if (x > y) {
            return !isAsc ? -1 : 1;
        }
        else if (x < y) {
            return !isAsc ? 1 : -1;
        }
        else {
            return 0;
        }
    };

    //数字比较算法
    FJ.Sort.compareNumber = function (x, y, isAsc, spC, spC2, spV) {
        var r = "/[^d|.|-]/g";
        x = (x + "").replace(r, "");
        y = (y + "").replace(r, "");
        return FJ.Sort.compare(x * 1, y * 1, isAsc, spC, spC2, spV);
    };

    //时间比较算法
    FJ.Sort.compareDate = function (x, y, isAsc, spC, spC2, spV) {
        var d = '1900-01-01';
        var x = FJ.Date.parse(x == '' ? d : x);
        var y = FJ.Date.parse(y == '' ? d : y);
        var z = x - y;

        spV = spV != null ? spV : -1;
        if (spC && !spC2) {  //如有禁止排序标记则拍在最低位置
            return -1;
        }
        else if (!spC && spC2) {
            return 1;
        }
        else if (spC && spC2) {
            return 0;
        }
        return !isAsc ? z * (-1) : z;
    };

    //英文字符串比较算法
    FJ.Sort.compareStringEN = function (x, y, isAsc, spC, spC2, spV) {
        x = FJ.Sort.getFirstChar(x);
        y = FJ.Sort.getFirstChar(y);
        return FJ.Sort.compare(x, y, isAsc, spC, spC2, spV);
    };

    //中文字符串比较算法
    FJ.Sort.compareStringCH = function (x, y, isAsc, spC, spC2, spV) {
        if (FJ.strGB) {  //如果第一个字符非中文的则不获取拼音直接用第一个字符比较
            x = x == "" ? "" : FJ.RX.chFirst(x) ? FJ.Sort.getGB2312Spell(FJ.Sort.getFirstChar(x)) : FJ.Sort.getFirstChar(x);
            y = y == "" ? "" : FJ.RX.chFirst(y) ? FJ.Sort.getGB2312Spell(FJ.Sort.getFirstChar(y)) : FJ.Sort.getFirstChar(y);
            return FJ.Sort.compare(x, y, isAsc, spC, spC2, spV);
        }
        else {
            return FJ.Sort.compareStringEN(x, y, isAsc, spC, spC2, spV);
        }
    };

    //执行排序数据集合
    FJ.Sort.execute = function (data, colName, isAsc, spC, spV) {
        if (isAsc == null) {  //默认正序
            isAsc = true;
        }

        //判断排序列数据类型
        var fnCompare = FJ.Sort.compareStringEN;
        try {
            for (var i = 0, l = data.length; i < l; i++) {
                var d = data[i],
                    colVal = d[colName];
                if (colVal === "" || d[spC] != null) {   //如果数值为空或标记禁止排序,结束本次循环继续判断
                    continue;
                }
                //                else if(FJ.RX.enFirst(colVal)){  //英文开头
                //                    fnCompare = FJ.Sort.compareStringEN;
                //                    break;
                //                }
                if (!isNaN(colVal)) {  //数字
                    fnCompare = FJ.Sort.compareNumber;
                    break;
                }
                else if (FJ.RX.enFirst(colVal) || FJ.RX.chFirst(colVal)) {  //英文或中文开头
                    fnCompare = FJ.Sort.compareStringCH;
                    break;
                }
                else {  //其他字符
                    var cv = FJ.Date.parse(colVal);
                    if (cv != "Invalid Date" && cv != "NaN") {  //日期
                        fnCompare = FJ.Sort.compareDate;
                    }
                    else {
                        fnCompare = FJ.Sort.compareStringCH;
                    }
                    break;
                }
            }
        }
        catch (e) {
            fnCompare = FJ.Sort.compareStringEN;
        }

        //排序数据集合
        data.sort(function (a, b) {
            return fnCompare(a[colName], b[colName], isAsc, a[spC], b[spC], spV);
        });
    };
    //#endregion

    //#region 对象
    FJ.Object = FJ.obj = {};

    //#region 检测对象是否包含属性
    FJ.obj.hasOwn = function (o, p) {
        return Object.prototype.hasOwnProperty.call(o, p);
    };
    //#endregion
    //#endregion

    //#region dom操作
    FJ.Dom = {};

    //插入到节点后面
    FJ.Dom.insertAfter = function (newEl, targetEl) {
        var parentEl = targetEl.parentNode;
        if (parentEl.lastChild == targetEl) {
            parentEl.appendChild(newEl);
        }
        else {
            parentEl.insertBefore(newEl, targetEl.nextSibling);
        }
    };
    //#endregion

    //#region 图片操作
    FJ.Image = {};

    //预加载图片
    FJ.Image.preLoad = function (p) {
        new Image().src = p;
    };
    //#endregion

    //#region jquery扩展方法
    $.fn.extend({
        //#region 定位文本框内位置
        textPositionJ: function (value) {
            var elem = this[0];
            if (elem && (elem.tagName == "TEXTAREA" || elem.type.toLowerCase() == "text")) {
                if (fj.isIE) {
                    var rng;
                    if (elem.tagName == "TEXTAREA") {
                        rng = event.srcElement.createTextRange();
                        rng.moveToPoint(event.x, event.y);
                    }
                    else {
                        rng = document.selection.createRange();
                    }
                    if (value === undefined) {
                        rng.moveStart("character", -event.srcElement.value.length);
                        return rng.text.length;
                    }
                    else if (typeof value === "number") {
                        var index = this.textPositionJ();
                        index > value ? (rng.moveEnd("character", value - index)) : (rng.moveStart("character", value - index));
                        rng.select();
                    }
                }
                else {
                    if (value === undefined) {
                        return elem.selectionStart;
                    }
                    else if (typeof value === "number") {
                        elem.selectionEnd = value;
                        elem.selectionStart = value;
                    }
                }
            }
            else {
                if (value === undefined) {
                    return undefined;
                }
            }
        },
        //#endregion

        //#region 选中文本框内区域
        selectRangeJ: function (start, end) {
            return this.each(function () {
                if (this.setSelectionRange) {
                    this.focus();
                    this.setSelectionRange(start, end);
                }
                else {
                    if (this.createTextRange) {
                        var range = this.createTextRange();
                        range.collapse(true);
                        range.moveEnd('character', end);
                        range.moveStart('character', start);
                        range.select();
                    }
                }
            });
        },
        //#endregion

        //#region 使元素浮动在页面某处
        fixFloatJ: function (p) {
            var p = $.extend(true, {
                type: "rightBottom",   //浮动位置
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 1,
                isByScrollMove: false
            }, p), thiz = this;

            switch (p.type) {
                case "rightBottom":
                    p.top = "auto";
                    p.left = "auto";
                    break;
                case "rightTop":
                    p.bottom = "auto";
                    p.left = "auto";
                    break;
                case "leftBottom":
                    p.top = "auto";
                    p.right = "auto";
                    break;
                case "leftTop":
                    p.bottom = "auto";
                    p.right = "auto";
                    break;
                case "top":
                    p.left = "auto";
                    p.bottom = "auto";
                    p.right = "auto";
                    break;
            }

            this.css({
                top: p.top,
                left: p.left,
                right: p.right,
                bottom: p.bottom,
                zIndex: p.zIndex
            });

            this.css({ position: "fixed" });

            if (p.isByScrollMove) {  //在顶部浮动时,滚动条未超过一定值时是否使元素跟随滚动条移动
                $(window).bind("scroll", function () {
                    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                    if (scrollY <= p.top) {
                        thiz.css("top", p.top - scrollY);
                    }
                    else {
                        thiz.css("top", 0);
                    }
                });
            }

            return this;
        },
        //#endregion

        //#region 使滚动条移动至顶部
        scrollGoTopJ: function (p) {
            var p = $.extend(true, {
                target: 0,   //目标值
                ratio: 8,    //系数
                elem: null,  //绑定点击事件的元素
                evts: {
                    arriveTop: null,  //到达目标
                    leaveTop: null    //离开目标
                }
            }, p), thiz = this;

            var bStop = true; //建立开关
            var time;         //计时器

            var elem = p.elem ? p.elem : this;
            elem.click(function () {
                //其他浏览器与chrome下获取滚动轴高度的兼容写法
                var scrollY = document.documentElement.scrollTop || document.body.scrollTop;

                //缓冲公式，（目标值 - 初始值）/ 系数。初始值是不断在变化的，除以系数之后速度就能由快至慢从而实现缓冲。
                var iSpeed = (p.target - scrollY) / p.ratio;

                //速度取整，为了能准确的回到目标值。Math.floor()向下取整，这个效果中p.target - scrollY会始终是负值，因此不需要向上取整
                iSpeed = Math.floor(iSpeed);

                if (scrollY == p.target) {  //当初始值等于目标值时清掉计时器
                    return;
                }
                else {
                    bStop = false;  //开关是为了控制回到顶部只能运行一次，再次想拉下滚动条时就拉不动的现象

                    //滚动条的高度等于初始值加速度
                    document.documentElement.scrollTop = document.body.scrollTop = scrollY + iSpeed;

                    //继续循环运行
                    time = setTimeout(arguments.callee, 30);
                }
            });

            $(window).bind("scroll", function () {
                if (bStop) {  //前边开关已关，所以运行到这里肯定就执行else，当变成true后再次运行就是清掉计时器了。
                    clearTimeout(time);
                }
                else {
                    bStop = true;
                }

                //执行事件
                fj.lazyDo(function () {
                    var scrollY = document.documentElement.scrollTop || document.body.scrollTop;
                    if (scrollY == p.target) {
                        if (p.evts.arriveTop) {
                            p.evts.arriveTop.call(this);
                        }
                    }
                    else {
                        if (p.evts.leaveTop) {
                            p.evts.leaveTop.call(this);
                        }
                    }
                }, 100, "ld_scrollGoTopJ", thiz);
            });

            return this;
        },
        //#endregion

        //#region 上传文本框自定义样式
        fileCustomStyleJ: function (p) {
            var p = $.extend(true, {
                width: 265,
                height: 20,
                btnText: "浏览...",
                btnFontSize: "12px",
                //btnImg: FJ.imgPath + "Panel/btn_new2.gif",
                btnWidth: 58,
                btnHeight: 20,
                btnColor: "#000",
                isShowTxt: true,
                margin: {
                    t: 0,
                    r: 0,
                    b: 0,
                    l: 0
                },
                afterRender: null  //渲染完毕事件
            }, p);

            this.each(function (i) {
                var oFile = $(this).addClass("fuj_customStyle_file");
                if (!oFile.attr("id")) {
                    oFile.attr("id", "file_" + new Date().getTime() + Math.random().toFixed(6).substr(2));
                }

                var oWrap = $('<div id="fuj_customStyle_' + oFile.attr("id") + '" class="fuj_customStyle_wrap" style="width:' + p.width + 'px;height: ' + p.height + 'px;margin:' + p.margin.t + 'px ' + p.margin.r + 'px ' + p.margin.b + 'px ' + p.margin.l + 'px;"></div>');
                var oText = $('<input id="fuj_customStyle_text_' + oFile.attr("id") + '" readonly class="fuj_customStyle_text" type="text" style="width:' + (p.width - p.btnWidth - 7) + 'px;height:' + (p.height - 6) + 'px;" />');
                var oBtn = $('<div id="fuj_customStyle_btn_' + oFile.attr("id") + '" class="fuj_customStyle_btn pj_btn3" style="color:' + p.btnColor + ';width:' + p.btnWidth + 'px;height:' + p.btnHeight + 'px;font-size:' + p.btnFontSize + ';text-align:center;line-height:' + p.height + 'px;margin:' + p.margin.t + 'px ' + p.margin.r + 'px ' + p.margin.b + 'px ' + p.margin.l + 'px;">' + p.btnText + '</div>');
                if (p.btnImg) {
                    oBtn.css("background", "url(" + p.btnImg + ") no-repeat");
                }

                //选择文件后改变文本框值
                if (p.isShowTxt) {
                    oFile.bind("change", function () {
                        var v = oFile.val();
                        oText.val(v).attr("title", v);
                    });
                    oWrap.append(oText);
                }
                else {
                    oText.hide();
                    oWrap.width(p.btnWidth);
                }

                //鼠标悬停事件
                oFile.hover(function () {
                    oBtn.addClass("pj_btn_hover");
                }, function () {
                    oBtn.removeClass("pj_btn_hover");
                });

                oFile.after(oWrap);
                oWrap.append(oFile).append(oBtn);

                //渲染完毕事件
                if (p.afterRender) {
                    p.afterRender.call(oFile, oBtn, oText);
                }
            });

            return this;
        },
        //#endregion

        //#region 切换样式
        swapClassJ: function (c1, c2) {
            this.removeClass(c1).addClass(c2);
            return this;
        },
        //#endregion

        //#region 获取某元素相对另一元素的距离
        distanceJ: function (target) {
            var of = this.offset(),
                ofT = target.offset();

            return {
                left: Math.abs(of.left - ofT.left),
                top: Math.abs(of.top - ofT.top)
            }
        },
        //#endregion

        //#region 过渡动画
        transitionJ: function (p, noTran) {
            var p = $.extend(true, {
                duration: 0.5,
                delay: 0,
                easing: "ease-in-out",
                evts: {  //事件
                    start: null,
                    stop: null
                }
            }, p),
                trans = fj.Evt.transition,
                propT = trans ? fj.Evt.transition.prop : null,
                tranE = trans ? fj.Evt.transition.end : null,
                styleF = trans ? FJ.Evt.transform.style : null,
                styleFo = trans ? FJ.Evt.transformOrigin.style : null;

            this.each(function () {
                var tran = "",
                    styles = {},
                    elem = $(this);

                for (var o in p) {
                    var style = p[o];
                    if (o != "duration" && o != "delay" && o != "easing" && o != "evts" && style != null) {
                        var isObj = typeof style === "object";

                        //按厂商前缀修正transform属性名
                        if (trans) {
                            if (o === "transform") {
                                o = styleF;
                            }
                            if (o === "transformOrigin") {
                                o = styleFo;
                            }
                        }

                        if (!noTran && trans) {
                            tran += "," + o + " "
                                + (!isObj ? p.duration : (style.duration != null ? style.duration : p.duration)) + "s "
                                + (!isObj ? p.easing : (style.easing ? style.easing : p.easing)) + " "
                                + (!isObj ? p.delay : (style.delay != null ? style.delay : p.delay)) + "s";
                        }

                        styles[o] = !isObj ? style : style.value;
                    }
                }

                if (!noTran && trans) {
                    if (tran.indexOf(",") != -1) {
                        tran = tran.substr(1);
                    }

                    //设置过渡效果
                    this.style[propT] = tran;
                }

                if (p.evts.start) {
                    p.evts.start.call(elem);
                }

                //如果浏览器不支持过渡动画则直接设置样式
                elem.css(styles);

                if (!trans || noTran) {  //不执行过渡或不支持过渡时,直接执行结束事件
                    if (p.evts.stop) {
                        p.evts.stop.call(elem);
                    }
                }
                else {
                    elem.one(tranE, function () {
                        elem[0].style[propT] = "none";

                        if (p.evts.stop) {
                            p.evts.stop.call(elem);
                        }
                    });
                }
            });

            return this;
        }
        //#endregion
    });
    //#endregion

})(jQuery);