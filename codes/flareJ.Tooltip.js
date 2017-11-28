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
* last update:2015-9-11
***********************************************************/

/*----------------------------------------------*
* flareJ.Tooltip
*-------*-------*-------*-------*-------*-------*
* 工具提示
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.Panel
*----------------------------------------------*/
FJ.define("widget.Tooltip", ["widget.Panel"], function () {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                         工具提示
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.TooltipJ = this.TTJ = FJ.TooltipJ = FJ.TTJ = FJ.PJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //设置参数
            this._super(elemObj, $.extend(true, {
                fjType: "TTJ",
                renderTo: "body",                   //要加载到的容器
                hoverDirect: "top",                 //提示弹出方向
                hoverSpeed: 777,                    //提示关闭延迟时间
                hoverType: "over",                  /*-------*弹出方式*-------*
                                                     * over:鼠标移上
                                                     * focus:获得焦点
                                                     * click:鼠标点击(点击任意其他区域时关闭)
                                                     * free:随意
                                                     *-----*-----*-----*-----*/
                isInitShow: false,                  //初始化是否显示
                hoverOnTip: true,                   //鼠标停在提示层上时是否不关闭层
                shiftLeft: 0,                       //弹出位置偏移值(横)
                shiftTop: 0,                        //弹出位置偏移值(纵)
                shiftHeight: 5,                     //弹出位置偏移值(在上方显示时)
                onlyShiftPos: false,                //是否只用偏移值决定位置
                borderWidth: 1,                     //边框宽度
                isHoverShow: true,                  //提示是否正在显示
                isBodyEmpty: false,                 //显示时是否先清空内容层
                showType: "fade",                   /*-------*弹出效果*-------*
                                                     * fade:淡入淡出
                                                     * minToMax:由小变大
                                                     * offCanvas:弹出式画布
                                                     *-----*-----*-----*-----*/
                showLoading: true,
                isRenderHF: false,
                loadDelay: 0,                       //延迟一定时间加载内容
                loadSpeed: 200,
                closeDelay: 0,                      //关闭延迟时间
                //imgLoadSrc: LMJ.loadImgSrc(11),   //Loading条图片路径
                showHead: false,                    //是否显示头部
                showFoot: false,                    //是否显示底部
                radius: 0,                          //圆角弧度
                radiusB: 0,                         //内容层圆角弧度
                isFixScroll: false,                 //是否将父元素滚动条值加入计算位置
                posType: "offset",                  //计算位置使用的jquery方法:1、offset;2、position;3、distanceJ
                posParam: null,                     //计算位置方法参数
                posRight: false,                    //从右侧计算边距
                opacity: null,                      //透明度
                isAutoSetHeight: true,              //是否自动设置高度
                arrowDirect: null,                  /*-------*箭头方向*-------*
                                                     * top:上边
                                                     * right:右边
                                                     * bottom:下边
                                                     * left:左边
                                                     *-----*-----*-----*-----*/
                arrowMargin: null,                   //箭头位置
                position: "absolute",                //定位类型
                overflow: null,                      //溢出内容是否显示
                autoTurn: true,                      //某方向没有位置显示时自动翻转
                tranDuration: 0.1,                   //执行过渡动画持续时间
                tranShiftS: 0,                       //起始位置偏移值
                tranOrigin: null,                    //变换动画原点
                tranScaleShow: "scale(1, 1)",        //显示时变换动画比例
                tranScaleClose: "scale(1, 1)",       //关闭时变换动画比例
                tranEasing: "ease-in-out",           //动画缓动类型
                bodyScrollDelay: 200,                //页面滚动事件延迟时间
                zIndex: 600,
                loadAfterShow: false,
                revisePos: false,                    //修正显示位置
                tapCancelBubble: true,               //轻触防止冒泡
                tapFocus: false,                     //轻触后是否触发焦点
                closeCheckScroll: false,             //全局点击关闭层时是否检测body滚动条
                colorParams: {
                    //borderBody: "#009ac9"           //内层边框
                    arrowBorder: null,                //箭头边缘
                    arrowBody: null,                  //箭头色
                    arrowShadow: null                 //箭头阴影
                },
                evts: {  //内部事件
                    afterRenderI: function () {
                        if (!this.p.isAutoSetHeight) {
                            if (!fj.RX.percent(this.p.height)) {
                                this.bodyIn.css({
                                    wordWrap: "break-word",
                                    overflow: "hidden"
                                });
                                this.divOut.css("background", "none");
                            }
                        }
                    },
                    afterBodyLoadI: function () {
                        if (!this.p.isAutoSetHeight) {
                            this.divOut.css("height", (!fj.RX.percent(this.p.height) ? "auto" : this.p.height));
                        }
                    },
                    afterShowI: function () {
                        if (this.p.opacity != null) {  //透明度
                            this.divOut.css("opacity", this.p.opacity);
                        }
                    }
                },
                eType: (function (j) {
                    return {
                        afterRender: j,             //加载完毕
                        afterShow: j,               //显示完毕
                        afterShowI: j,
                        afterBodyLoad: j,           //内容加载完毕
                        afterBodyLoadI: j,
                        onMouseenter: j,
                        onMouseleave: j,
                        afterClose: j,
                        afterShowFn: j
                    };
                })("TTJ")
            }, settings));

            //提示延迟时间对象
            this.timeOut = null;

            //初始化提示标记
            this.hoverId = null;

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            //移动端用点击替代hover事件
            if (fj.isMobile && this.p.hoverType === "over") {
                this.p.hoverType = "click";
            }

            this._super();

            //过渡状态
            this.tranState = "close";

            if (this.p.showType === "offCanvas") {
                //设置起始位置
                if (fj.Evt.transform) {
                    var styleF = FJ.Evt.transform.style,
                        dO = this.divOut,
                        bw = this.p.borderWidth;

                    //按不同方向设置
                    switch (this.p.hoverDirect) {
                        case "top":
                            dO.css(styleF, "translate(0 ," + (this.p.height * -1 - bw * 2) + "px)");
                            break;
                        case "right":
                            dO.css({
                                left: "auto",
                                right: 0
                            }).css(styleF, "translate(" + (this.p.width + bw * 2) + "px, 0)");
                            break;
                        case "bottom":
                            dO.css({
                                top: "auto",
                                bottom: 0
                            }).css(styleF, "translate(0, " + (this.p.height + bw * 2) + "px)");
                            break;
                        case "left":
                            dO.css(styleF, "translate(" + (this.p.width * -1 - bw * 2) + "px, 0)");
                            break;
                    }
                }

                //移动端解决地址栏隐藏时外层高度不够问题
                if (fj.isMobile) {
                    $(window).on("scroll", { thiz: this }, this.pageScroll);
                }
            }
            else {
                //设置初始变换原点
                if (this.p.tranOrigin) {
                    this.divOut[0].style[fj.Evt.transformOrigin.prop] = this.p.tranOrigin;
                }
            }
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this;
            this._super(this.p.showType !== "offCanvas" ? null : true);

            //外层
            this.divOut.attr("id", "TTJ_" + this.objId).addClass("ttj").css({
                position: this.p.position,
                backgroundColor: this.p.colorParams.bgColor
            });

            //溢出内容是否显示
            if (this.p.overflow) {
                this.divOut.css("overflow", this.p.overflow);
            }

            //设置圆角
            if (this.radiusStyle && this.p.radius > 0) {
                this.pjBody.css(this.radiusStyle, this.p.radiusB);
                this.bodyIn.css(this.radiusStyle, this.p.radiusB);
            }

            //是否显示头部
            if (this.p.showHead) {
                //禁止最小化
                this.pjBtnMin.hide();

                //关闭事件
                this.pjBtnClose.unbind("click").click(function () {
                    var sp = thiz.p.hoverSpeed;
                    thiz.p.hoverSpeed = 0;
                    thiz.close();
                    thiz.p.hoverSpeed = sp;
                });
            }

            //是否有箭头
            if (this.p.arrowDirect) {
                this.arrow = $('<span class="ttj_arrow' + (fj.isMobile ? ' fj-mobile' : '') + '"><em ' + (this.p.colorParams.arrowBorder ? 'style="color:' + this.p.colorParams.arrowBorder + ';"' : '') + '>◆</em><i ' + (this.p.colorParams.arrowBody ? 'style="color:' + this.p.colorParams.arrowBody + ';"' : '') + '>◆</i></span>');
                if (this.p.colorParams.arrowShadow) {
                    this.arrow.css("text-shadow", this.p.colorParams.arrowShadow);
                }
                switch (this.p.arrowDirect) {
                    case "top":
                        this.arrow.addClass("ttj_arrow_top");
                        if (this.p.arrowMargin) {
                            this.arrow.css("left", this.p.arrowMargin);
                        }
                        break;
                    case "right":
                        this.arrow.addClass("ttj_arrow_right");
                        if (this.p.arrowMargin) {
                            this.arrow.css("top", this.p.arrowMargin);
                        }
                        break;
                    case "bottom":
                        this.arrow.addClass("ttj_arrow_bottom");
                        if (this.p.arrowMargin) {
                            this.arrow.css("left", this.p.arrowMargin);
                        }
                        break;
                    case "left":
                        this.arrow.addClass("ttj_arrow_left");
                        if (this.p.arrowMargin) {
                            this.arrow.css("top", this.p.arrowMargin);
                        }
                        break;
                }
                this.divOut.append(this.arrow);
            }

            //为弹出层,选中的元素集合注册事件
            this.bindMouseEvt();

            this.fire("afterRender", "TTJ");
            return this;
        },
        //#endregion

        //#region 显示
        show: function (position, showMoreTime, noTran) {
            if (!this.p.isHoverShow) {  //检测是否可以显示
                return;
            }
            var thiz = this;

            //显示时渲染在body下
            if (this.p.showRendorBody) {
                this.divOut.appendTo(FJ.oBody);
            }

            if (this.p.showType === "offCanvas") {  //弹出式画布
                var param = {
                    duration: 0.45,
                    evts: {
                        start: function () {
                            //动画开始前添加阴影效果
                            thiz.divOut.addClass("pj_shadow");
                        },
                        stop: function () {
                            thiz.showFinish();
                        }
                    }
                },
                bw = this.p.borderWidth,
                dO = this.divOut,
                width = this.p.width,
                tranShiftS = this.p.tranShiftS,
                propF = fj.Evt.transform.prop;

                //按不同方向设置
                switch (this.p.hoverDirect) {
                    case "top":
                        param.transform = "translate(0, " + (0 - bw) + "px)";
                        break;
                    case "bottom":
                        param.transform = "translate(0, " + (0 + bw) + "px)";
                        break;
                    case "left":
                        param.transform = "translate(" + (0 - bw) + "px, 0)";
                        if (tranShiftS) {
                            dO[0].style[propF] = "translate(" + (width * -1 - bw * 2 + tranShiftS) + "px, 0)";
                        }
                        break;
                    case "right":
                        param.transform = "translate(" + (0 + bw) + "px, 0)";
                        break;
                }

                fj.lazyDo(function () {
                    dO.transitionJ(param, noTran);
                });
            }
            else {
                //设置当前目标元素
                if (!this.currentObj) {
                    this.currentObj = this.bindObj.eq(0);
                }

                var hoverId = this.currentObj.attr("id");
                if (!hoverId) {   //如果元素没有ID,自动添加
                    hoverId = "ttj_obj_" + fj.Date.getTime();
                    this.currentObj.attr("id", hoverId);
                }

                //判断层是否正为该元素显示
                if (this.hoverId != hoverId || showMoreTime) {
                    this.hoverId = hoverId;

                    //先清空内容层
                    if (this.p.isBodyEmpty) {
                        this.bodyIn.empty();
                    }

                    //显示前事件
                    this.fire("preShow");

                    //获取选中元素边距
                    var offsetH = null;
                    if (this.p.posParam == null) {
                        offsetH = this.currentObj[this.p.posType]();
                    }
                    else {
                        offsetH = this.currentObj[this.p.posType](this.p.posParam);
                    }

                    //使内容页滚动条到顶部
                    this.bodyIn[0].scrollTop = 0;

                    //创建屏幕遮罩层
                    this.addDivGray();

                    //加载屏幕遮罩层
                    this.renderDivGray();

                    this.showReady(offsetH, position);
                    fj.Animate.fadeIn(this.divOut, {
                        duration: this.p.tranDuration,
                        transformOrigin: this.p.tranOrigin,
                        scale: this.p.tranScaleShow,
                        evts: {
                            stop: function () {
                                thiz.showFinish();
                            }
                        }
                    });
                }
            }

            this.fire("afterShowFn", "TTJ");
        },
        //#endregion

        //#region 关闭
        close: function (noTran) {
            if (!this.p.isHoverShow) {  //检测是否可以显示
                return;
            }
            var thiz = this;

            if (this.p.showType === "offCanvas") {  //弹出式画布
                var dO = this.divOut,
                    param = {
                        duration: 0.45,
                        evts: {
                            //start: function () {},
                            stop: function () {
                                if (tranShiftS) {
                                    dO[0].style[fj.Evt.transform.prop] = "translate(" + (dO[0].clientWidth * -1 - bw * 2) + "px, 0)";
                                }

                                //动画结束时移除阴影效果
                                dO.removeClass("pj_shadow");

                                thiz.closeFinish();
                            }
                        }
                    },
                    bw = this.p.borderWidth,
                    tranShiftS = this.p.tranShiftS;

                //按不同方向设置
                switch (this.p.hoverDirect) {
                    case "top":
                        param.transform = "translate(0, " + (dO[0].clientHeight * -1 - bw * 2 + tranShiftS) + "px)";
                        break;
                    case "right":
                        param.transform = "translate(" + (dO[0].clientWidth + bw * 2 + tranShiftS) + "px, 0)";
                        break;
                    case "bottom":
                        param.transform = "translate(0, " + (dO[0].clientHeight + bw * 2 + tranShiftS) + "px)";
                        break;
                    case "left":
                        param.transform = "translate(" + (dO[0].clientWidth * -1 - bw * 2 + tranShiftS) + "px, 0)";
                        break;
                }

                dO.transitionJ(param, noTran);
            }
            else {
                //删除整页遮罩层
                this.deleteDivGray();

                this.closeReady();

                if (this.divOut.is(":visible")) {
                    this.timeOut = fj.lazyDo(function () {  //延迟一定时间后关闭
                        fj.Animate.fadeOut(thiz.divOut, {
                            duration: thiz.p.tranDuration,
                            transformOrigin: thiz.p.tranOrigin,
                            scale: thiz.p.tranScaleClose,
                            evts: {
                                stop: function () {
                                    thiz.closeFinish();
                                }
                            }
                        });
                    }, this.p.hoverType == "over" ? this.p.hoverSpeed : 0);
                }
            }
        },
        //#endregion

        //#region 计算显示位置
        countPosition: function (of, pos) {
            var sa = {},
                co = this.currentObj[0],
                pa = this.p;

            sa.width = pa.width;
            sa.height = this.p.isAutoSetHeight ? pa.height : this.bodyIn[0].scrollHeight;

            if (!this.p.onlyShiftPos) {
                if (!pos) {
                    switch (this.p.hoverDirect) {
                        case "top":   //在上面显示
                            sa.left = of.left + co.offsetWidth / 2 - sa.width / 2 + pa.shiftLeft;
                            sa.top = of.top - co.offsetHeight / 2 - (sa.height - pa.shiftHeight) + pa.shiftTop;
                            break;
                        case "right": //在右侧显示
                            sa.left = of.left + co.offsetWidth + pa.shiftLeft;
                            sa.top = of.top - co.offsetHeight + pa.shiftTop;
                            break;
                        case "bottom": //在下面显示
                            sa.left = of.left + co.offsetWidth / 2 - sa.width / 2 + pa.shiftLeft;

                            var dH = 0,
                                autoTurn = this.p.autoTurn;
                            if (autoTurn) {
                                dH = this.divOut.height();
                            }

                            if (autoTurn && of.top > document.documentElement.clientHeight - dH) {   //如果在下方没有空间显示则改为在上方显示
                                sa.top = of.top - dH - pa.shiftTop;
                            }
                            else {
                                sa.top = of.top + co.offsetHeight / 2 + pa.shiftTop;
                            }
                            break;
                        case "left": //在左侧显示
                            sa.left = of.left - co.offsetWidth + pa.shiftLeft;
                            sa.top = of.top - co.offsetHeight + pa.shiftTop;
                            break;
                        case "fixed": //在固定位置显示
                            sa.left = pa.left + pa.shiftLeft;
                            sa.top = pa.top + pa.shiftTop;
                            break;
                    };
                }
                else {
                    sa.left = pos.left;
                    sa.top = pos.top;
                }
            }
            else {
                sa.left = pa.shiftLeft;
                sa.top = pa.shiftTop;
            }

            //从右侧计算边距
            if (this.p.posRight) {
                sa.right = fj.pageWidth() - of.left - co.offsetWidth;
            }

            //            if(sa.top < 0) {   //防止窗口超出界面顶端
            //                sa.top = 0;
            //            }

            if (this.p.isFixScroll) {  //将父元素滚动条值加入计算
                var rt = pa.showRendorBody ? fj.body : pa.renderTo[0];
                sa.top += rt.scrollTop;
                sa.left += rt.scrollLeft;
            }

            return sa;
        },
        //#endregion

        //#region 在指定位置显示
        showAt: function (pos) {
            //设置当前目标元素
            if (!this.currentObj) {
                this.currentObj = this.bindObj.eq(0);
            }
            var of = this.currentObj.offset();

            var sa = this.countPosition(of, pos);
            this.divOut.css({
                left: sa.left,
                top: sa.top
            });
        },
        //#endregion

        //#region 绑定鼠标事件
        bindMouseEvt: function () {
            var thiz = this;

            //选中的元素集合
            var bindObj;
            if (this.p.selCondition != null) {
                bindObj = $(this.p.selCondition);
            }
            else {
                bindObj = this.p.obj;
            }
            this.bindObj = bindObj;

            if (this.p.hoverType !== "free") {
                //层
                this.divOut.bind("mouseenter", function () {
                    if (thiz.p.hoverOnTip) {
                        clearTimeout(thiz.timeOut);
                    }
                    if (thiz.p.hoverType === "focus" || thiz.p.hoverType === "click") {
                        if(!fj.isMobile || (fj.isMobile && thiz.tranState === "show")) {  //移动端判断触摸点是否进入过层内时，需要检测层是否已显示
                            thiz.overByFocus = true;
                        }
                    }

                    thiz.fire("onMouseenter", "TTJ");
                }).bind("mouseleave", function () {
                    if (thiz.p.hoverType === "focus") {
                        thiz.overByFocus = false;
                        if (!thiz.closeByFocus) {
                            thiz.currentObj.focus();
                        }
                    }
                    else if (thiz.p.hoverType === "click") {
                        thiz.overByFocus = false;
                    }
                    else {
                        thiz.setVisible(false);
                    }

                    thiz.fire("onMouseleave", "TTJ");
                });

                var event1, event2;
                switch (this.p.hoverType) {
                    case "over":   //移上
                        event1 = "mouseenter";
                        event2 = "mouseleave";
                        break;
                    case "focus":  //获得焦点
                        event1 = "focus";
                        event2 = "blur";
                        this.overByFocus = false;  //判断鼠标是否进入过层内
                        break;
                    case "click":  //点击
                        if (!this.p.isRightClick && !this.p.isAcjClick) {
                            event1 = "click";
                        }
                        event2 = "click";
                        this.overByFocus = false;  //判断鼠标是否进入过层内
                        break;
                }

                if (event1) {
                    if (this.p.hoverType !== "click") {
                        this.event1 = event1;
                        this.eventFn1 = function (e) {
                            if (thiz.p.hoverType === "over") {
                                if (thiz.stoLeave) {
                                    clearTimeout(thiz.stoLeave);
                                }
                            }
                            thiz.currentObj = $(this);  //记录当前目标元素
                            thiz.setVisible(true);
                        };

                        bindObj.on(this.event1, this.eventFn1);
                    }
                    else {
                        this.event1 = fj.Evt.click;
                        this.eventFn1 = function (e, p) {
                            //防止冒泡触发全局点击关闭事件
                            if (!fj.isMobile || thiz.p.tapCancelBubble) {
                                p.evt.stopPropagation();
                            }

                            thiz.currentObj = this.oTarget;  //记录当前目标元素

                            //触发焦点
                            if (thiz.p.tapFocus) {
                                thiz.currentObj.focus();
                            }

                            thiz.setVisible(true);
                        };

                        bindObj.onGestureJ(this.event1, this.eventFn1, {
                            preventClick: false
                        });
                    }
                }

                if (event2) {
                    if (this.p.hoverType !== "click") {
                        this.event2 = event2;
                        this.eventFn2 = function () {
                            if (thiz.p.hoverType !== "focus") {
                                if (thiz.p.hoverType === "over" && thiz.p.closeDelay > 0) {  //延迟一定时间关闭
                                    thiz.stoLeave = setTimeout(function () {
                                        thiz.setVisible(false);
                                    }, thiz.p.closeDelay);
                                }
                                else {
                                    thiz.setVisible(false);
                                }
                            }
                            else {
                                if (!thiz.overByFocus) {
                                    thiz.setVisible(false);
                                }
                            }
                        };

                        bindObj.on(this.event2, this.eventFn2);
                    }
                    else {
                        this.event2 = fj.isMobile ? "touchend" : event2;
                        this.eventFn2 = function (e) {  //全局点击事件时关闭
                            if (thiz.p.isAcjClick) {  //在自动提示控件中使用会做判断,点击区域在文本框中不关闭层
                                var currentObj = thiz.currentObj;
                                if (currentObj && e.target.id == thiz.currentObj.attr("id")) {
                                    return fj.isMobile ? true : false;
                                }

                                if (fj.isMobile) {
                                    if (e.target.className.indexOf && e.target.className.indexOf("acj") != -1) {  //移动端触摸区域在自动提示控件内时不关闭层
                                        return;
                                    }
                                    else {
                                        if (currentObj) {  //移动端点击其他区域时使文本框失去焦点
                                            currentObj.blur();
                                        }
                                    }
                                }
                            }

                            if (thiz.divOut.is(":visible") && !thiz.overByFocus && !thiz.closeByFocus) {
                                //自动提示控件在移动端触摸其他区域时需要检测body滚动条是否改变过,如没改变过才可以关闭提示层
                                if (!fj.isMobile || !thiz.p.closeCheckScroll || fj.bodyScrollTop == fj.body.scrollTop) {
                                    thiz.setVisible(false);
                                }
                            }

                            thiz.fire("afterCloseClick");
                        };

                        $(document).on(this.event2, this.eventFn2);
                    }
                }
            }
        },
        //#endregion

        //#region 设置显示、隐藏
        setVisible: function (isShow, position, showMoreTime) {
            if (isShow) {
                this.closeByFocus = false;
            }
            else {
                this.closeByFocus = true;
            }

            clearTimeout(this.timeOut);

            if (isShow) {
                this.show(position, showMoreTime);
            }
            else {
                if (this.p.canClose) {
                    this.close();
                }
            }
        },
        //#endregion

        //#region 加载内容区域完毕
        loadBodyComplete: function (type) {
            this.showLoad(false);

            //内容加载完毕事件
            this.fire("afterBodyLoadI", "TTJ");
            this.fire("afterBodyLoad", "TTJ");
            this.fire("afterFirstLoad");
            this.isFirstLoad = false;
        },
        //#endregion

        //#region 删除
        remove: function () {
            this._super();

            //注销事件
            if (this.event1) {
                if (fj.isMobile) {
                    this.bindObj.off("touchstart").off("touchmove").off("touchend").off("touchcancel");
                }
                this.bindObj.off(this.event1, this.eventFn1);
            }
            if (this.event2) {
                if (this.p.hoverType !== "click") {
                    this.bindObj.off(this.event2, this.eventFn2);
                }
                else {
                    $(document).off(this.event2, this.eventFn2);
                }
            }

            if (this.p.showType === "offCanvas" && fj.isMobile) {
                $(window).off("scroll", this.pageScroll);
            }
        },
        //#endregion

        //#region 显示前操作
        showReady: function (offsetH, position) {
            var dO = this.divOut;

            //先使外层显示
            dO.css({
                opacity: 0,
                display: "block"
            });

            //渲染面板内容
            this.loadBody();

            //弹出动画参数
            var sa = this.countPosition(offsetH, position);

            //设置层尺寸
            dO.css({
                width: sa.width,
                height: sa.height,
                left: sa.right == null ? sa.left : "auto",
                top: sa.top,
                right: sa.right != null ? sa.right : "auto"
            });
        },
        //#endregion

        //#region 显示完毕操作
        showFinish: function () {
            var p = { elem: this.currentObj },
                thiz = this;

            this.tranState = "show";
            this.fire("afterShowI", p, "TTJ");
            this.fire("afterShow", p, "TTJ");
            this.reLayout();

            var fn = function () {
                if (thiz.p.loadAfterShow) {
                    thiz.loadBody("show");
                }
                thiz.fire("afterBodyLoad2");
            };

            if (this.p.loadDelay > 0) {
                fj.lazyDo(function () {
                    fn();
                }, thiz.p.loadDelay, "ld_ttjStarted", thiz);
            }
            else {
                fn();
            }

            if (!this.p.isAutoSetHeight && !fj.RX.percent(this.p.height)) {
                this.divOut.css("height", "auto");
            }

            //修正显示位置
            if (this.p.revisePos) {
                var dO = this.divOut,
                    left = parseFloat(dO.css("left")),
                    top = parseFloat(dO.css("top")),
                    moreWidth = left + dO[0].offsetWidth - fj.pageWidth() - fj.leftPosition(),
                    moreHeight = top + dO[0].offsetHeight - fj.pageHeight() - fj.topPosition(),
                    leftR = null,
                    topR = null;

                if (moreWidth > 0) {
                    leftR = left - moreWidth;
                }
                if (left < 0) {
                    leftR = 0;
                }
                if (leftR != null) {
                    dO.css("left", leftR);
                }

                if (moreHeight > 0) {
                    topR = top - moreHeight;
                }
                if (top < 0) {
                    topR = 0;
                }
                if (topR != null) {
                    dO.css("top", topR);
                }
            }
        },
        //#endregion

        //#region 关闭前操作
        closeReady: function () {
            //初始化提示标记
            this.hoverId = null;
        },
        //#endregion

        //#region 关闭完毕操作
        closeFinish: function () {
            if (this.hoverId != null) {
                return;
            }

            var thiz = this;

            this.tranState = "close";
            if (this.p.showType !== "offCanvas") {
                this.divOut.hide();
            }

            this.overByFocus = false;

            //关闭时移动回原标签内
            if (this.p.showRendorBody) {
                this.divOut.appendTo(this.p.renderTo);
            }

            this.fire("afterClose", "TTJ");
        },
        //#endregion

        //#region 页面滚动事件
        pageScroll: function (e) {
            var thiz = e.data.thiz;

            fj.lazyDo(function () {
                if (thiz.p.shiftPercentH) {  //暂时将两种计算逻辑分开,日后待优化
                    thiz.reLayout();
                }
                else {
                    var dO = this.divOut;
                    dO.height(dO[0].clientHeight).height("100%");
                }
            }, thiz.p.bodyScrollDelay, "ld_ttj_bodyScroll", thiz);
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        TooltipJ: function (p) {
            if (this && this.length > 0) {
                return new FJ.TooltipJ(this, fj.TTJ_commonConfig ? $.extend(true, fj.clone(fj.TTJ_commonConfig), p) : p);
            }
        },
        TTJ: function (p) {
            return $(this).TooltipJ(p);
        }
    });
    //#endregion

});