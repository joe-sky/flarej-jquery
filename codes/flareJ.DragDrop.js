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
* last update:2015-7-9
***********************************************************/

/*------------------------------*
* flareJ.DragDrop
*-------*-------*-------*-------*
* 拖放
*-------*-------*-------*-------*
* 
*------------------------------*/
FJ.define("widget.DragDrop", function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /******************************************************
    *-----------------------------------------------------*
    *                        拖放
    *-----------------------------------------------------*
    *******************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 参考自Dynamic Drive的dom-drag.js
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ******************************************************/
    this.DragJ = this.DRJ = FJ.DragJ = FJ.DRJ = FJ.BJ.extend({
        //#region 构造方法
        init: function (elemObj, p) {
            //参数
            this._super($.extend(true, {
                fjType: "DRJ",
                oRoot: null,            //鼠标点击区域拖动元素
                oContainer: null,       //拖放区域元素
                dir: null,              /*-----*可移动方向*------*
                                         * null:任意方向
                                         * h:横向
                                         * v:纵向
                                         *-----*-----*-----*-----*/
                minX: null,             //横向拖放最小值
                maxX: null,             //横向拖放最大值
                minY: null,             //纵向拖放最小值
                maxY: null,             //纵向拖放最大值
                hmode: true,            //为true时取left,false时取right
                vmode: true,            //为true时取top,false时取bottom
                xMapper: null,          //横向值转换方法
                yMapper: null,          //纵向值转换方法
                hasProxy: false,        //是否使用拖放代理
                hideProxy: false,       //是否隐藏代理
                setPosByProxy: true,    //代理拖放后是否设置需拖动元素位置
                proxyColor: "#cccccc",  //拖放代理颜色
                drjCls: null,           //拖放起始元素类名
                canDD: true,            //是否允许拖放
                posType: "offset",      //计算位置使用的jquery方法:1、offset;2、position
                pos: { top: 0, left: 0 },//初始位置
                cursor: "move",         //拖动时鼠标形状
                isSetTop: true,         //拖动后设置top
                isSetLeft: true,        //拖动后设置left
                evts: {
                    dragStart: null,    //拖放开始
                    dragEnd: null,      //拖放结束
                    drag: null          //拖放中
                }
            }, p));

            this.initFn();   //初始化

            this.o = elemObj;
            this.o.bind("mousedown", { j: this }, this.dragStart);

            if(!this.p.oRoot) {
                this.p.oRoot = this.o;
            }
            if(this.p.oContainer) {  //依据拖放区域的位置设置拖放极限值
                var of = this.p.oContainer[this.p.posType](),
                    w = this.p.oContainer.innerWidth(),
                    h = this.p.oContainer.innerHeight(),
                    wO = elemObj.outerWidth(),
                    hO = elemObj.outerHeight(),
                    isOf = this.p.posType == "offset",
                    oL = isOf ? of.left : 0,
                    oT = isOf ? of.top : 0;
                
                //如使用offset计算位置则需在各项极限值前加入全屏位置值
                this.p.minX = this.p.minX || oL;
                this.p.maxX = this.p.maxX || (oL + w - wO);
                this.p.minY = this.p.minY || oT;
                this.p.maxY = this.p.maxY || (oT + h - hO);
                this.o.css({
                    left: oL + this.p.pos.left,
                    top: oT + this.p.pos.top
                });
            }

            if (this.p.hmode && fj.isNaN(parseInt(this.p.oRoot.css("left"), 10))) this.p.oRoot.css("left", 0);
            if (this.p.vmode && fj.isNaN(parseInt(this.p.oRoot.css("top"), 10))) this.p.oRoot.css("top", 0);
            if (!this.p.hmode && fj.isNaN(parseInt(this.p.oRoot.css("right"), 10))) this.p.oRoot.css("right", 0);
            if (!this.p.vmode && fj.isNaN(parseInt(this.p.oRoot.css("bottom"), 10))) this.p.oRoot.css("bottom", 0);

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();
            this.canMoveH = !this.p.dir || this.p.dir == "h";
            this.canMoveV = !this.p.dir || this.p.dir == "v";
        },
        //#endregion

        //#region 拖放开始
        dragStart: function (e) {
            var j = e.data.j;
            if(!j.p.canDD) {  //是否允许拖放
                return;
            }
            e = FJ.Evt.fix(e);

            if ((j.p.oRoot.attr("resizing") == null || String(j.p.oRoot.attr("resizing")) == "false") && (j.p.oRoot.attr("resizing-pre") == null || String(j.p.oRoot.attr("resizing-pre")) == "false")) {   //如果正在缩放中,则不执行拖放
                j.cursorO = j.o.css("cursor");  //设置鼠标样式为移动
                j.o.css("cursor", j.p.cursor);
                j.p.oRoot.attr("dragging", true);
                var y = parseInt(j.p.vmode ? j.p.oRoot.css("top") : j.p.oRoot.css("bottom"), 10);
                var x = parseInt(j.p.hmode ? j.p.oRoot.css("left") : j.p.oRoot.css("right"), 10);

                //拖放开始事件
                j.fire("dragStart", {x: x, y: y});

                j.p.lastMouseX = e.clientX;
                j.p.lastMouseY = e.clientY;

                if (j.p.hmode) {
                    if (j.p.minX != null) j.p.minMouseX = e.clientX - x + j.p.minX;
                    if (j.p.maxX != null) j.p.maxMouseX = j.p.minMouseX + j.p.maxX - j.p.minX;
                } else {
                    if (j.p.minX != null) j.p.maxMouseX = -j.p.minX + e.clientX + x;
                    if (j.p.maxX != null) j.p.minMouseX = -j.p.maxX + e.clientX + x;
                }

                if (j.p.vmode) {
                    if (j.p.minY != null) j.p.minMouseY = e.clientY - y + j.p.minY;
                    if (j.p.maxY != null) j.p.maxMouseY = j.p.minMouseY + j.p.maxY - j.p.minY;
                } else {
                    if (j.p.minY != null) j.p.maxMouseY = -j.p.minY + e.clientY + y;
                    if (j.p.maxY != null) j.p.minMouseY = -j.p.maxY + e.clientY + y;
                }

                //是否使用代理
                if (j.p.hasProxy && (j.p.drjCls ? $(e.target).hasClass(j.p.drjCls) : true)) {
                    var blw = parseInt(j.p.oRoot.css("border-left-width"), 10),
                        brw = parseInt(j.p.oRoot.css("border-right-width"), 10),
                        btw = parseInt(j.p.oRoot.css("border-top-width"), 10),
                        bbw = parseInt(j.p.oRoot.css("border-bottom-width"), 10);
                    var wp = j.p.oRoot[0].clientWidth + (!fj.isNaN(blw) ? blw : 0) + (!fj.isNaN(brw) ? brw : 0) - 2;
                    var hp = j.p.oRoot[0].clientHeight + (!fj.isNaN(btw) ? btw : 0) + (!fj.isNaN(bbw) ? bbw : 0) - 2;

                    if (j.proxyD == null) {
                        j.proxyD = $('<div><div style="width:100%;height:100%;background-color:' + j.p.proxyColor + ';filter:alpha(opacity=50);opacity: 0.5;"></div></div>');
                        j.proxyD.css({
                            width: wp,
                            height: hp,
                            position: "absolute",
                            top: j.p.oRoot.css("top"),
                            left: j.p.oRoot.css("left"),
                            border: "1px dashed black",
                            zIndex: 1000000000,
                            cursor: j.p.cursor,
                            display: !j.p.hideProxy ? "block" : "none"
                        });
                        j.p.oRoot.after(j.proxyD);
                    }
                    else {
                        j.proxyD.css({
                            width: wp,
                            height: hp,
                            top: j.p.oRoot.css("top"),
                            left: j.p.oRoot.css("left"),
                            display: !j.p.hideProxy ? "block" : "none"
                        });
                    }
                }

                $(document).bind("mousemove", { j: j }, j.drag).bind("mouseup", { j: j }, j.dragEnd);

                if (FJ.isIE) {
                    //捕获鼠标事件
                    j.p.oRoot[0].setCapture();
                }
            }
            //return false;
        },
        //#endregion

        //#region 拖放中
        drag: function (e) {
            var j = e.data.j;
            e = FJ.Evt.fix(e);

            if (j.p.oRoot.attr("resizing") == null || String(j.p.oRoot.attr("resizing")) == "false") {   //如果正在缩放中,则不执行拖放
                j.isMoved = true;  //标记是否移动过
                var ey = e.clientY;
                var ex = e.clientX;

                var y, x, nx, ny;
                if (j.p.hasProxy && j.proxyD != null) {
                    y = parseInt(j.p.vmode ? j.proxyD.css("top") : j.proxyD.css("bottom"), 10);
                    x = parseInt(j.p.hmode ? j.proxyD.css("left") : j.proxyD.css("right"), 10);
                }
                else {
                    y = parseInt(j.p.vmode ? j.p.oRoot.css("top") : j.p.oRoot.css("bottom"), 10);
                    x = parseInt(j.p.hmode ? j.p.oRoot.css("left") : j.p.oRoot.css("right"), 10);
                }

                if (j.p.minX != null) ex = j.p.hmode ? Math.max(ex, j.p.minMouseX) : Math.min(ex, j.p.maxMouseX);
                if (j.p.maxX != null) ex = j.p.hmode ? Math.min(ex, j.p.maxMouseX) : Math.max(ex, j.p.minMouseX);
                if (j.p.minY != null) ey = j.p.vmode ? Math.max(ey, j.p.minMouseY) : Math.min(ey, j.p.maxMouseY);
                if (j.p.maxY != null) ey = j.p.vmode ? Math.min(ey, j.p.maxMouseY) : Math.max(ey, j.p.minMouseY);

                nx = x + ((ex - j.p.lastMouseX) * (j.p.hmode ? 1 : -1));
                ny = y + ((ey - j.p.lastMouseY) * (j.p.vmode ? 1 : -1));

                if (j.p.xMapper) nx = j.p.xMapper(y);
                else if (j.p.yMapper) ny = j.p.yMapper(x);

                if (j.p.hasProxy && j.proxyD != null) {
                    if(j.canMoveH) {
                        j.proxyD.css(j.p.hmode ? "left" : "right", nx + "px");
                    }
                    if(j.canMoveV) {
                        j.proxyD.css(j.p.vmode ? "top" : "bottom", ny + "px");
                    }
                }
                else {
                    if(j.canMoveH) {
                        j.p.oRoot.css(j.p.hmode ? "left" : "right", nx + "px");
                    }
                    if(j.canMoveV) {
                        j.p.oRoot.css(j.p.vmode ? "top" : "bottom", ny + "px");
                    }
                }

                j.p.lastMouseX = ex;
                j.p.lastMouseY = ey;

                //拖放中事件
                j.fire("drag", {x: nx, y: ny});
            }
            //return false;
        },
        //#endregion

        //#region 拖放结束
        dragEnd: function (e) {
            var j = e.data.j,
                hasP = j.p.hasProxy && j.proxyD != null;

            j.o.css("cursor", j.cursorO);  //恢复鼠标样式
            j.p.oRoot.attr("dragging", false);

            if (hasP) {  //是否使用代理
                if (j.isMoved) {
                    j.isMoved = false;
                    
                    if(j.p.setPosByProxy) {
                        var oRoot = j.p.oRoot;
                        if(j.p.isSetTop) {
                            oRoot.css("top", j.proxyD.css("top"));
                        }
                        if(j.p.isSetLeft) {
                            oRoot.css("left", j.proxyD.css("left"));
                        }
                    }
                }
            }

            $(document).unbind("mousemove", j.drag).unbind("mouseup", j.dragEnd);

            //拖放结束事件
            j.fire("dragEnd", {x: parseInt(j.p.oRoot.css(j.p.hmode ? "left" : "right"), 10), y: parseInt(j.p.oRoot.css(j.p.vmode ? "top" : "bottom"), 10)});

            if (hasP && !j.p.hideProxy) {  //需在执行拖放事件后隐藏,否则IE7以下浏览器可能出现拖放元素宽度设置错误
                j.proxyD.hide();
            }

            if (FJ.isIE) {
                //释放鼠标事件
                j.p.oRoot[0].releaseCapture();
            }
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        DragJ: function (p) {
            return new FJ.DragJ(this, p);
        },
        DRJ: function (p) {
            return $(this).DragJ(p);
        }
    });
    //#endregion

    /******************************************************
    *-----------------------------------------------------*
    *                        缩放
    *-----------------------------------------------------*
    *******************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 参考自mozart0的makeResizable方法
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ******************************************************/
    this.ResizeJ = this.REJ = FJ.ResizeJ = FJ.REJ = FJ.BJ.extend({
        //#region 构造方法
        init: function (elemObj, p) {
            //参数
            this._super($.extend(true, {
                fjType: "REJ",
                d: 4,                       //鼠标居边缘时改变样式的div边框宽度值
                miw: 100,                   //拖拽目标元素的极限高宽值
                mih: 100,
                maw: 1500,
                mah: 1500,
                padW: 0,                    //判断鼠标形状改变位置补正值
                padH: 0,
                callback: null,             //回调函数
                hasProxy: false,            //是否使用拖放代理
                proxyColor: "#cccccc",      //拖放代理颜色
                onlyH: false,               //是否只能横向缩放
                canDD: true,                //是否允许拖放
                evts: {
                    resizeStart: null,      //缩放开始
                    resizeEnd: null,        //缩放结束
                    resize: null            //缩放中
                }
            }, p));

            this.initFn();   //初始化

            this.o = elemObj;

            //注册事件
            this.o.bind("mousedown", { j: this }, this.resizeStart);
            if (FJ.isIE) {
                this.o.bind("mousemove", { j: this }, this.resize).bind("mouseup", { j: this }, this.resizeEnd);
            }
            else {
                this.o.bind("mousemove", { j: this }, this.cursorStyle);
            }

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();
        },
        //#endregion

        //#region 缩放开始
        resizeStart: function (e) {
            var j = e.data.j;
            if(!j.p.canDD) {  //是否允许拖放
                return;
            }
            e = FJ.Evt.fix(e);
            var el = e.srcElement || e.target;

            if (j.o[0] != null
                && e.button == (FJ.isIElt9 ? 1 : 0)  //必须为点击鼠标左键
                && (el.style.cursor && el.style.cursor.indexOf("resize") != -1)) {
                //FJ.j.otherResizing = true;
                j.o.attr("resizing", true);

                //是否使用代理
                if (j.p.hasProxy) {
                    var wp = j.o[0].clientWidth + parseInt(j.o.css("border-left-width"), 10) + parseInt(j.o.css("border-right-width"), 10) - 2;
                    var hp = j.o[0].clientHeight + parseInt(j.o.css("border-top-width"), 10) + parseInt(j.o.css("border-bottom-width"), 10) - 2;

                    if (j.proxy == null) {
                        j.proxy = $('<div><div style="position:relative;width:100%;height:100%;background-color:' + j.p.proxyColor + ';filter:alpha(opacity=50);opacity: 0.5;"></div></div>');
                        j.proxy.css({
                            width: wp,
                            height: hp,
                            position: "absolute",
                            top: j.o.css("top"),
                            left: j.o.css("left"),
                            border: "1px dashed black",
                            zIndex: 1000000000
                        });
                        j.o.after(j.proxy);
                    }
                    else {
                        j.proxy.css({
                            width: wp,
                            height: hp,
                            top: j.o.css("top"),
                            left: j.o.css("left")
                        }).show();
                    }
                }

                //捕获鼠标事件
                if (FJ.isIE) {
                    j.o[0].setCapture();
                }
                else {
                    e.preventDefault();
                    $(document).bind("mousemove", { j: j }, j.resize).bind("mouseup", { j: j }, j.resizeEnd);
                    j.o.unbind("mousemove", j.cursorStyle);
                }

                //缩放开始事件
                j.fire("resizeStart");
            }
        },
        //#endregion

        //#region 改变鼠标形状
        cursorStyle: function (e) {
            //检测是否有其他元素正在缩放
            //if (!FJ.j.otherResizing) {
            var j = e.data.j;
            if(!j.p.canDD) {  //是否允许拖放
                return;
            }
            j.o.attr("resizing-pre", false);

            if (j.o.attr("dragging") == null || String(j.o.attr("dragging")) == "false") {   //如果正在拖放中,则不执行缩放
                e = FJ.Evt.fix(e);
                var el = e.srcElement || e.target;
                if(el.className && el.className.indexOf("noRej") != -1) {  //过滤标记不受缩放影响的元素
                    return;
                }

                //if ((e.srcElement || e.target) == j.o[0]) {   //由目标元素触发鼠标事件
                //获取鼠标在div内坐标
                //var x = e.layerX, y = e.layerY;
                var p = FJ.getXY(j.o[0]);
                var x = e.clientX - p.l + document.documentElement.scrollLeft + document.body.scrollLeft, y = e.clientY - p.t + document.documentElement.scrollTop + document.body.scrollTop;
                var c = j.o[0].currentStyle || document.defaultView.getComputedStyle(j.o[0], null);
                //获取div宽,高
                var w = parseInt(c.width, 10), h = parseInt(c.height, 10);
                //var cw = o.clientWidth, ch = o.clientHeight;
                //计算鼠标从哪个方向移入div中
                j.p.cur = "";
                j.p.cur = y < j.p.d ? "n" : (h - y + j.p.padH < j.p.d ? "s" : "");
                j.p.cur += x < j.p.d ? "w" : (w - x + j.p.padW < j.p.d ? "e" : "");

                //如果鼠标处于div边缘
                if (j.p.cur) {
                    var isRun = true;
                    //判断是否处于最小化状态
                    if (j.p.onlyH) {
                        if (j.p.cur == "e" || j.p.cur == "w") {
                            isRun = true;
                        }
                        else {
                            isRun = false;
                        }
                    }
                    if (isRun) {
                        j.o.attr("resizing-pre", true);
                        //设置鼠标指针样式为拖拉大小
                        el.style.cursor = j.p.cur + "-resize";
                        //获取div左,上边距
                        j.p.l = parseInt(c.left, 10);
                        j.p.t = parseInt(c.top, 10);
                        //计算div右,下边距
                        j.p.r = j.p.l + w;
                        j.p.b = j.p.t + h;
                        //获取鼠标的屏幕坐标
                        j.p.ex = e.screenX;
                        j.p.ey = e.screenY;
                    }
                    else {
                        j.o.attr("resizing-pre", false);
                        //还原指针样式
                        if (el.cur) {
                            el.style.cursor = el.cur;  //还原为元素原始指针样式
                        }
                        else {
                            el.style.cursor = "";
                        }
                    }
                }
                //鼠标处于div内其他位置
                else {
                    j.o.attr("resizing-pre", false);
                    //还原指针样式
                    if (el.cur) {
                        el.style.cursor = el.cur;  //还原为元素原始指针样式
                    }
                    else {
                        el.style.cursor = "";
                    }
                    j.o[0].style.cursor = "";
                }
            }
            //            }
            //            //由其它元素触发鼠标事件
            //            else {
            //                //还原指针样式
            //                j.o[0].style.cursor = "";
            //            }
            //}
        },
        //#endregion

        //#region 缩放中
        resize: function (e) {
            /*------------------------------------------*
            * l、t、r、b : html元素的左、上、右、下边距
            * ex, ey : 鼠标的屏幕X、Y轴坐标
            * cur : 鼠标移入div的方向
            *------------------------------------------*/
            var j = e.data.j;
            if(!j.p.canDD) {  //是否允许拖放
                return;
            }
            var _e = e;
            e = FJ.Evt.fix(e);

            //鼠标处于按住左键状态中
            if (String(j.o.attr("resizing")) == "true") {
                //用鼠标当前坐标值减去在边缘时的坐标值计算出差值
                var dx = e.screenX - j.p.ex;
                var dy = e.screenY - j.p.ey;
                //根据鼠标移入div的方向修改边距,处于div四角处时可同时改变两个方向的值
                if (j.p.cur.indexOf("w") > -1) {
                    j.p.l += dx;
                }
                else if (j.p.cur.indexOf("e") > -1) {
                    j.p.r += dx;
                }
                if (j.p.cur.indexOf("n") > -1) {
                    j.p.t += dy;
                }
                else if (j.p.cur.indexOf("s") > -1) {
                    j.p.b += dy;
                }

                var s = j.o[0].style;
                if (j.p.hasProxy && j.proxy != null) {
                    s = j.proxy[0].style;
                }
                //设置div大小,边距值并限定最大,最小值
                if (j.p.r - j.p.l > j.p.miw && j.p.r - j.p.l < j.p.maw) {
                    s.left = j.p.l + "px";
                    if (j.p.hasProxy && j.proxy != null) {
                        s.width = (j.p.r - j.p.l + parseInt(j.o.css("padding-left"), 10) + parseInt(j.o.css("padding-right"), 10)) + "px";
                    }
                    else {
                        s.width = j.p.r - j.p.l + "px";
                    }
                }
                if (j.p.b - j.p.t > j.p.mih && j.p.b - j.p.t < j.p.mah) {
                    s.top = j.p.t + "px";
                    if (j.p.hasProxy && j.proxy != null) {
                        s.height = (j.p.b - j.p.t + parseInt(j.o.css("padding-top"), 10) + parseInt(j.o.css("padding-bottom"), 10)) + "px";
                    }
                    else {
                        s.height = j.p.b - j.p.t + "px";
                    }
                }
                //更新鼠标在边缘时的坐标值
                j.p.ex += dx;
                j.p.ey += dy;

                //拖放中事件
                j.fire("resize");
            }
            else {
                j.cursorStyle.call(j.o[0], _e);
            }
        },
        //#endregion

        //#region 缩放结束
        resizeEnd: function (e) {
            var j = e.data.j;
            if(!j.p.canDD) {  //是否允许拖放
                return;
            }
            e = FJ.Evt.fix(e);

            if (e.button == (FJ.isIElt9 ? 1 : 0)  //必须为点击鼠标左键
                && String(j.o.attr("resizing")) == "true") {
                j.o.attr("resizing", false);
                //FJ.j.otherResizing = false;

                //是否使用代理
                if (j.p.hasProxy && j.proxy != null) {
                    j.o.css({
                        top: j.proxy.css("top"),
                        left: j.proxy.css("left"),
                        width: parseInt(j.proxy.css("width"), 10) - parseInt(j.o.css("padding-left"), 10) - parseInt(j.o.css("padding-right"), 10),
                        height: parseInt(j.proxy.css("height"), 10) - parseInt(j.o.css("padding-top"), 10) - parseInt(j.o.css("padding-bottom"), 10)
                    });
                    j.proxy.hide();
                }

                //释放鼠标事件
                if (FJ.isIE) {
                    j.o[0].releaseCapture();
                }
                else {
                    j.o.bind("mousemove", { j: j }, j.cursorStyle);
                    $(document).unbind("mouseup", j.resizeEnd).unbind("mousemove", j.resize);
                }

                //缩放结束事件
                j.fire("resizeEnd");
            }
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        ResizeJ: function (p) {
            return new FJ.ResizeJ(this, p);
        },
        REJ: function (p) {
            return $(this).ResizeJ(p);
        }
    });
    //#endregion

    /******************************************************
    *-----------------------------------------------------*
    *                        分隔
    *-----------------------------------------------------*
    *******************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ******************************************************/
    this.SplitterJ = this.SPJ = FJ.SplitterJ = FJ.SPJ = FJ.BJ.extend({
        //#region 构造方法
        init: function (elemObj, p) {
            var thiz = this;

            //参数
            this._super($.extend(true, {
                fjType: "SPJ",
                way: "h",               //方向(横为h,纵为v)
                oLeft: null,            //左元素
                oRight: null,           //右元素
                oTop: null,             //上元素
                oBottom: null,          //下元素
                minX: 10,               //横向拖动最小距离
                maxX: 6000,             //横向拖动最大距离
                minY: 100,              //纵向拖动最小距离
                maxY: 400,              //纵向拖动最大距离
                shift: {                //拖动条位置补间值
                    l: 0,
                    t: 0
                },
                canDD: true,            //是否允许拖放
                abMode: false,          //是否使用绝对位置模式
                ddPosType: "offset",    //计算拖动条位置使用的jquery方法:1、offset;2、position
                evts: {
                    splitStart: null,   //分隔开始
                    splitEnd: null,     //分隔结束
                    split: null         //分隔中
                }
            }, p));
            
            this.initFn();   //初始化

            this.o = elemObj;
            if (this.p.way == "h") {
                if(!fj.isOpera){
                    this.o.css("cursor", "col-resize");
                }
                else {  //opera不支持col-resize
                    this.o.css("cursor", "w-resize");
                }
            }
            else {
                if(!fj.isOpera){
                    this.o.css("cursor", "row-resize");
                }
                else {  //opera不支持row-resize
                    this.o.css("cursor", "n-resize");
                }
            }
            this.o.bind("mousedown", { j: this }, this.splitStart);

            //创建分隔条
            if (this.splitBar == null) {
                this.splitBar = $("<div class='noRej'></div>");
                this.splitBar.css({
                    width: 0,
                    height: 0,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                    backgroundColor: "#797878",
                    cursor: this.p.way == "h" ? "col-resize" : "row-resize",
                    fontSize: 0
                });
                this.o.eq(0).after(this.splitBar);

                //如果分隔条的部分处于多个元素中
                if(this.o.length > 1){
                    this.o.not("div:first").each(function(inx){
                        thiz["splitBar" + (inx + 2)] = thiz.splitBar.clone();
                        thiz.o.eq(inx + 1).after(thiz["splitBar" + (inx + 2)]);
                    });
                }
            }

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();
        },
        //#endregion

        //#region 分隔开始
        splitStart: function (e) {
            var j = e.data.j,
                pType = j.p.ddPosType;
            if(!j.p.canDD) {  //是否允许拖放
                return;
            }
            e = FJ.Evt.fix(e);

            //分隔开始事件
            j.fire("splitStart");
            
            //显示分隔条
            var _top = j.o[pType]().top - (pType == "offset" ? j.o.parent()[pType]().top : 0) - (function(b){
                var re = parseInt(b, 10);
                if(!fj.isNaN(re)){
                    return re;
                }
                else{
                    return 0;
                }
            })(j.o.parent().css("border-top-width"));
            var _left = j.o[pType]().left - (pType == "offset" ? j.o.parent()[pType]().left : 0) - (function(b){
                var re = parseInt(b, 10);
                if(!fj.isNaN(re)){
                    return re;
                }
                else{
                    return 0;
                }
            })(j.o.parent().css("border-left-width"));

            if (j.splitBar != null) {
                j.splitBar.css({
                    width: j.o.eq(0).width(),
                    height: j.o.eq(0).height(),
                    top: _top + j.p.shift.t,
                    left: _left + j.p.shift.l
                }).show();

                //如果分隔条的部分处于多个元素中
                if(j.o.length > 1){
                    j.o.not("div:first").each(function(inx){
                        j["splitBar" + (inx + 2)].css({
                            width: j.o.eq(inx + 1).width(),
                            height: j.o.eq(inx + 1).height(),
                            top: _top + j.p.shift.t,
                            left: _left + j.p.shift.l
                        }).show();
                    });
                }
            }
            
            //更新鼠标坐标
            if (j.p.way == "h") {
                var x = parseInt(j.splitBar.css("left"), 10);
                j.p.lastMouseX = e.clientX;
                if (j.p.minX != null) j.p.minMouseX = e.clientX - x + j.p.minX;
                if (j.p.maxX != null) j.p.maxMouseX = j.p.minMouseX + j.p.maxX - j.p.minX;
            }
            else {
                var y = parseInt(j.splitBar.css("top"), 10);
                j.p.lastMouseY = e.clientY;
                if (j.p.minY != null) j.p.minMouseY = e.clientY - y + j.p.minY;
                if (j.p.maxY != null) j.p.maxMouseY = j.p.minMouseY + j.p.maxY - j.p.minY;
            }

            $(document).bind("mousemove", { j: j }, j.split).bind("mouseup", { j: j }, j.splitEnd);

            if (FJ.isIE) {
                //捕获鼠标事件
                j.splitBar[0].setCapture();
            }
            return false;
        },
        //#endregion

        //#region 分隔中
        split: function (e) {
            var j = e.data.j;
            e = FJ.Evt.fix(e);

            var y, x, nx, ny;
            if (j.p.way == "h") {
                var ex = e.clientX;
                x = parseInt(j.splitBar.css("left"), 10);
                if (j.p.minX != null) ex = Math.max(ex, j.p.minMouseX);
                if (j.p.maxX != null) ex = Math.min(ex, j.p.maxMouseX);

                nx = x + (ex - j.p.lastMouseX);
                j.splitBar.css("left", nx + "px");

                //如果分隔条的部分处于多个元素中
                if(j.o.length > 1){
                    j.o.not("div:first").each(function(inx){
                        j["splitBar" + (inx + 2)].css("left", nx + "px");
                    });
                }

                j.p.lastMouseX = ex;
            }
            else {
                var ey = e.clientY;
                y = parseInt(j.splitBar.css("top"), 10);
                if (j.p.minY != null) ey = Math.max(ey, j.p.minMouseY);
                if (j.p.maxY != null) ey = Math.min(ey, j.p.maxMouseY);
                ny = y + (ey - j.p.lastMouseY);

                j.splitBar.css("top", ny + "px");

                //如果分隔条的部分处于多个元素中
                if(j.o.length > 1){
                    j.o.not("div:first").each(function(inx){
                        j["splitBar" + (inx + 2)].css("top", ny + "px");
                    });
                }

                j.p.lastMouseY = ey;
            }

            //分隔中事件
            j.fire("split");

            return false;
        },
        //#endregion

        //#region 分隔结束
        splitEnd: function (e) {
            var j = e.data.j,
                pType = j.p.ddPosType;

            //调整分隔区域宽度
            var lw = 0, rw = 0, th = 0, bh = 0;
            if (j.p.way == "h") {  //横向
                if(j.p.oLeft && j.p.oRight){  //左右同时改变
                    var ws = parseInt(j.splitBar.css("width"), 10),
                        totalWidth = parseInt(j.p.oLeft.css("width"), 10) + ws + parseInt(j.p.oRight.css("width"), 10),
                        ls = j.splitBar[pType]().left;

                    lw = parseInt(ls - j.p.oLeft[pType]().left, 10);
                    j.p.oLeft.css("width", lw);
                    rw = totalWidth - lw - ws;
                    j.p.oRight.css("width", rw);

                    if(j.p.abMode) {  //绝对位置模式下,需要设置各元素位置
                        j.o.css("left", ls);
                        var lsr = ls + j.o.width();
                        j.p.oRight.css("left", lsr);
                    }
                }
                else{
                    if(j.p.oLeft){   //只改变左侧元素
                        lw = parseInt(j.splitBar[pType]().left - j.p.oLeft[pType]().left, 10);
                        j.p.oLeft.width(lw);
                    }
                    else if(j.p.oRight){   //只改变右侧元素
                        
                    }
                }
            }
            else {  //纵向
                var hs = parseInt(j.splitBar.css("height"), 10),
                    totalHeight = parseInt(j.p.oTop.css("height"), 10) + hs + parseInt(j.p.oBottom.css("height"), 10),
                    ts = j.splitBar[pType]().top;
                
                th = parseInt(ts - j.p.oTop.filter(":visible")[pType]().top, 10);  //此处需获取可视元素的top值,因为隐藏元素的top值为0
                j.p.oTop.css("height", th);
                bh = totalHeight - th - hs;
                j.p.oBottom.css("height", bh);

                if(j.p.abMode) {  //绝对位置模式下,需要设置各元素位置
                    j.o.css("top", ts);
                    var tsb = ts + j.o.height();
                    j.p.oBottom.css("top", tsb);
                }
            }

            //隐藏分隔条
            if (j.splitBar != null) {
                j.splitBar.css({
                    width: 0,
                    height: 0
                });

                //如果分隔条的部分处于多个元素中
                if(j.o.length > 1){
                    j.o.not("div:first").each(function(inx){
                        j["splitBar" + (inx + 2)].css({
                            width: 0,
                            height: 0
                        });
                    });
                }
            }

            $(document).unbind("mousemove", j.split).unbind("mouseup", j.splitEnd);

            //分隔结束事件
            j.fire("splitEnd", { l: lw, r: rw, t: th, b: bh });

            if (FJ.isIE) {
                //释放鼠标事件
                j.splitBar[0].releaseCapture();
            }
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        SplitterJ: function (p) {
            return new FJ.SplitterJ(this, p);
        },
        SPJ: function (p) {
            return $(this).SplitterJ(p);
        }
    });
    //#endregion
});