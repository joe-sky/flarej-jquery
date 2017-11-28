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
* last update:2015-8-5
***********************************************************/

/*------------------------------*
* flareJ.Gesture
*-------*-------*-------*-------*
* 触摸手势
*-------*-------*-------*-------*
* 
*------------------------------*/
FJ.define("widget.Gesture", function () {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /******************************************************
    *-----------------------------------------------------*
    *                       触摸手势
    *-----------------------------------------------------*
    *******************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ******************************************************/
    this.GestureJ = this.GTJ = FJ.GestureJ = FJ.GTJ = FJ.BJ.extend({
        //#region 构造方法
        init: function (elemObj, p) {
            //参数
            this._super($.extend(true, {
                fjType: "GTJ",
                multiTapStart: false,  //是否执行多点触控的tapStart事件
                preventScroll: true,   //是否阻止滚动
                preventClick: true,    //是否阻止点击
                scrollElemV: null,     //滚动条所在元素(纵向)
                scrollElemH: null,     //滚动条所在元素(横向)
                durationLimitH: 300,   //触摸交互时间如果长于该值则视作按住
                durationLimitS: 150,   //触摸交互时间如果长于该值则不视作扫动
                distanceLimitH: 30,    //扫动水平位移必须大于该值
                distanceLimitV: 75,    //扫动垂直位移必须大于该值
                scrollMaxX: null,      //纵向平移时如x轴位移不大于该值则视为视为满足滚动条件之一,如为null则不发生滚动
                scrollMaxY: null,      //横向平移时如y轴位移不大于该值则视为视为满足滚动条件之一,如为null则不发生滚动
                scrollMinX: 10,        //横向平移时如x轴位移不小于该值则视为视为满足滚动条件之一,另一个条件为scrollMaxY
                scrollMinY: 5,        //纵向平移时如y轴位移不小于该值则视为视为满足滚动条件之一,另一个条件为scrollMaxX
                scalePinchClose: 0.05, //缩小时比例必须小于该阀值
                scalePinchOpen: 0.05,  //放大时比例必须大于该阀值
                durationPinch: 100,    //每次缩放间隔时间
                durationRotate: 100,   //每次旋转间隔时间
                durationPan: null,     //每次平移间隔时间
                rotationCcw: 5,        //顺时间旋转时角度必须大于该阀值
                rotationCw: 5,         //逆时间旋转时角度必须大于该阀值
                tapDuration: 350,      //触摸时间不超过该阀值则视为轻触
                tapLimitX: 0,
                tapLimitY: 0,
                holdLimitX: 1,         //检测长按移动x轴距离阀值
                holdLimitY: 1,         //检测长按移动y轴距离阀值
                shakeLimit: 0.23,      //摇动速度超过该阀值则视为摇动
                shakeDuration: 100,    //每次检测摇动间隔时间
                shakeFreezeDelay: 800, //解除冻结摇动延迟时间
                tapHoverCls: null,     //触摸hover类名
                tapHoverElem: null,    /*-----触摸hover元素-----*
                                        * null:选择器选中的元素
                                        * jquery dom对象:指定的元素
                                        * tap:手指触摸的元素
                                        *-----*-----*-----*-----*/
                evts: {
                    tapStart: null,    //触摸开始
                    tap: null,         //轻触
                    pan: null,         //平移
                    tapEnd: null,      //触摸结束
                    tapHold: null,     //长按
                    swipe: null,       //扫动
                    swipeLeft: null,   //左扫动
                    swipeRight: null,  //右扫动
                    swipeTop: null,    //上扫动
                    swipeBottom: null, //下扫动
                    scrollEnd: null,   //滚动结束
                    pinch: null,       //双指缩放
                    rotate: null,      //双指旋转
                    shake: null        //摇动
                }
            }, p));

            //添加手势目标元素
            this.oTarget = elemObj;

            this.initFn();
            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();

            if (fj.isMobile) {
                this.startPosX = 0;  //起始触摸点x轴坐标
                this.lastPosX = 0;   //最后触摸点x轴坐标
                this.startPosY = 0;  //起始触摸点y轴坐标
                this.lastPosY = 0;   //最后触摸点y轴坐标
                this.dx = 0;         //触摸x轴移动距离
                this.dy = 0;         //触摸y轴移动距离
                this.lastPinchTime = 0;  //最后缩放时间
                this.lastScale = 0;  //最后一次缩放的比例值
                this.lastPanTime = 0;//最后一次平移时间
                this.lastRotateTime = 0;  //最后旋转时间
                this.lastRotation = 0;  //最后一次旋转的角度变化值

                //滚动条所在元素
                if (this.p.evts.tapHold) {
                    if (!this.p.scrollElemV) {
                        this.p.scrollElemV = fj.oBody;
                    }
                    if (!this.p.scrollElemH) {
                        this.p.scrollElemH = this.p.scrollElemV;
                    }
                }

                //是否支持摇动
                this.supportShake = "DeviceMotionEvent" in window;
                if (this.supportShake && this.p.evts.shake) {  //记录上一次检测的摇动值
                    this.lastShakeX = 0;
                    this.lastShakeY = 0;
                    this.lastShakeZ = 0;
                    this.lastTime = 0;
                    this.freezeShake = false;
                }
            }

            //绑定触摸事件
            this.bindTouchEvt();
        },
        //#endregion

        //#region 绑定触摸事件
        bindTouchEvt: function () {
            var d = { j: this },
                evts = this.p.evts;

            //检测是否移动设备
            if (fj.isMobile) {
                if (evts.tapStart || evts.tap || evts.pan || evts.tapEnd || evts.tapHold || evts.swipe || evts.swipeLeft || evts.swipeRight
                    || evts.swipeTop || evts.swipeBottom || evts.scrollEnd || evts.pinch) {
                    this.oTarget.on("touchstart", d, this.touchStart)
                        .on("touchmove", d, this.touchMove)
                        .on("touchend", d, this.touchEnd)
                        .on("touchcancel", d, this.touchEnd);
                    //.on("gesturechange", d, this.gestureChange);
                }

                if (this.supportShake) {
                    this.oTarget.on("devicemotion", d, this.deviceMotion);
                }
            }
            else {
                if (evts.tap) {  //非触屏时绑定click事件
                    this.oTarget.on("click", function (e) {
                        $(this).trigger("tap", { evt: e });
                    });
                }
            }

            //绑定自定义tap事件
            if (evts.tap) {
                this.oTarget.on("tap", function (e, p) {
                    var evt = e;
                    if (p && p.evt) {
                        evt = p.evt;
                    }

                    d.j.fire("tap", { evt: evt, param: p });
                });
            }
        },
        //#endregion

        //#region 触摸开始
        touchStart: function (e, p) {
            var j = e.data.j,
                posAll = j.getTouchPos(e),
                pos = posAll[0],
                x = pos[0],
                y = pos[1],
                tl = posAll.length,
                ret = { evt: e, param: p, x: x, y: y, fingers: tl },
                hasTapHold = j.p.evts.tapHold,
                scrollElemV = null,
                scrollElemH = null;

            //记录触摸手指数
            j.tapFingers = tl;

            //起始与结束点坐标
            j.startPosX = x;
            j.lastPosX = x;
            j.startPosY = y;
            j.lastPosY = y;

            if (tl == 1) {
                //各参数初始化
                j.duration = fj.Date.getTime();
                j.isScroll = null;
                j.scale = null;
                j.lastScale = 0;
                j.isPinch = false;
                j.rotation = null;
                j.lastRotation = 0;
                j.isRotate = false;
                j.dx = 0;
                j.dy = 0;

                //如注册长按事件则需检测滚动条位
                if (hasTapHold) {
                    scrollElemV = j.p.scrollElemV[0];
                    j.scrollElemTop = scrollElemV.scrollTop;
                    scrollElemH = j.p.scrollElemH[0];
                    j.scrollElemLeft = scrollElemH.scrollLeft;
                }

                //添加触摸hover效果
                j.changeTapHover(e);

                j.fire("tapStart", ret);

                //触摸交互时长大于阀值并没有发生位移,则视为长按
                if (hasTapHold) {
                    j.timeoutH = fj.lazyDo(function () {
                        if (!j.isPinch && !j.isRotate && j.dx <= j.p.holdLimitX && j.dy <= j.p.holdLimitY && j.scrollElemTop == scrollElemV.scrollTop && j.scrollElemLeft == scrollElemH.scrollLeft) {
                            ret.fingers = j.tapFingers;
                            j.fire("tapHold", ret);
                        }
                    }, j.p.durationLimitH);
                }
            }
            else {
                if (tl == 2) {
                    var pos1 = posAll[0],
                        pos2 = posAll[1];

                    //计算两指触摸点间初始距离
                    j.fingerDistS = j.getPosDistance(pos1, pos2);

                    //计算两指触摸点间初始角度
                    j.fingerRotateS = j.getPosAngle(pos1, pos2);
                }

                //多点tapStart事件
                if (j.p.multiTapStart) {
                    j.fire("tapStart", ret);
                }
            }
        },
        //#endregion

        //#region 触摸移动
        touchMove: function (e) {
            var j = e.data.j,
                posAll = j.getTouchPos(e),
                pos = posAll[0],
                x = pos[0],
                y = pos[1],
                mx = j.p.scrollMaxX,
                my = j.p.scrollMaxY,
                ix = j.p.scrollMinX,
                iy = j.p.scrollMinY,
                tl = posAll.length,
                twoFingers = tl === 2 && (j.p.evts.pinch || j.p.evts.rotate);

            j.lastPosX = x;
            j.dx = j.lastPosX - j.startPosX;
            j.lastPosY = y;
            j.dy = j.lastPosY - j.startPosY;

            if (twoFingers) {  //缩放时禁止默认滚动
                e.preventDefault();
            }

            if (j.isScroll) {  //如果在上次触发的touchMove事件中执行了滚动,则本次也视作为滚动
                return;
            }
            if (j.isScroll == null) {
                if (mx != null && Math.abs(j.dy) >= iy && Math.abs(j.dx) <= mx) {  //如果垂直发生过位移且大于阀值,并且水平位移在滚动阀值内则视为滚动
                    j.isScroll = true;
                    return;
                }
                if (my != null && Math.abs(j.dx) >= ix && Math.abs(j.dy) <= my) {  //如果水平发生过位移且大于阀值,并且垂直位移在滚动阀值内则视为滚动
                    j.isScroll = true;
                    return;
                }
            }

            //如果非滚动,则本次触摸一直为平移
            if (j.p.preventScroll) {
                e.preventDefault();  //阻止默认滚动
            }
            j.isScroll = false;

            //移动方向
            var dir = j.getMoveDir(),
                curTime = fj.Date.getTime();

            if (twoFingers) {
                var diffTime = curTime - j.lastPinchTime;

                //双指缩放
                if (diffTime > j.p.durationPinch) {  //每隔一定时间检测
                    j.lastPinchTime = curTime;
                    j.isPinch = true;

                    //计算缩放比例
                    var scale = j.getPosScale(posAll[0], posAll[1]),
                        dirS = null;

                    if (scale != j.lastScale) {  //比例有变化时才执行缩放
                        j.lastScale = scale;

                        if (((scale < 1) && (scale % 1) < (1 - j.p.scalePinchClose)) || ((scale > 1) && (scale % 1) > j.p.scalePinchOpen)) {  //大于缩放阀值时执行事件
                            dirS = scale < 1 ? -1 : 1;
                            j.scale = scale;

                            j.p.preventScroll = true;  //缩放时阻止滚动
                            j.fire("pinch", { evt: e, scale: scale, dir: dirS });
                        }
                    }
                }

                diffTime = curTime - j.lastRotateTime;

                //双指旋转
                if (diffTime > j.p.durationRotate) {  //每隔一定时间检测
                    j.lastRotateTime = curTime;
                    j.isRotate = true;

                    //计算旋转角度变化值
                    var rotation = j.getPosRotation(posAll[0], posAll[1]),
                        dirS = null;

                    if (rotation != j.lastRotation) {  //旋转角度有变化时才执行旋转
                        j.lastRotation = rotation;

                        if (((rotation < 1) && (-1 * (rotation) > j.p.rotationCcw)) || ((rotation > 1) && (rotation > j.p.rotationCw))) {  //大于旋转阀值时执行事件
                            dirS = rotation < 1 ? -1 : 1;
                            j.rotation = rotation;

                            j.p.preventScroll = true;  //缩放时阻止滚动
                            j.fire("rotate", { evt: e, rotation: rotation, dir: dirS });
                        }
                    }
                }
            }

            //平移
            if (j.p.durationPan == null || curTime - j.lastPanTime > j.p.durationPan) {
                j.lastPanTime = curTime;
                j.fire("pan", { evt: e, x: x, y: y, dx: j.dx, dy: j.dy, dirX: dir[0], dirY: dir[1], fingers: tl, touchId: j.getTouchIndex(e) });
            }
        },
        //#endregion

        //#region 触摸结束
        touchEnd: function (e) {
            var j = e.data.j,
                isScroll = j.isScroll;

            if (e.originalEvent.touches.length > 0) {
                return;
            }

            //清除长按检测
            if (j.timeoutH) {
                clearTimeout(j.timeoutH);
                j.timeoutH = null;
            }

            //移除触摸hover效果
            j.changeTapHover(e, 1);

            if (j.isScroll) {
                j.fire("scrollEnd", { evt: e });
                return;
            }

            var dir = j.getMoveDir(),  //移动方向
                ret = { evt: e, x: j.lastPosX, y: j.lastPosY, dx: j.dx, dy: j.dy, dirX: dir[0], dirY: dir[1], fingers: j.tapFingers },  //返回参数对象
                gtH = Math.abs(j.dx) > j.p.distanceLimitH,
                gtV = Math.abs(j.dy) > j.p.distanceLimitV,
                cTime = fj.Date.getTime(),
                duration = cTime - j.duration;

            //如触摸交互时长小于阀值则视作扫动
            if (duration <= j.p.durationLimitS) {
                var dirS = "";
                if (gtH) {
                    if (dir[0] == "l") {
                        dirS += "l";
                        j.fire("swipeLeft", ret);
                    }
                    else {
                        dirS += "r";
                        j.fire("swipeRight", ret);
                    }
                }
                if (gtV) {
                    if (dir[1] == "t") {
                        dirS += "t";
                        j.fire("swipeTop", ret);
                    }
                    else {
                        dirS += "b";
                        j.fire("swipeBottom", ret);
                    }
                }
                if (gtH || gtV) {
                    ret.dirS = dirS;  //扫动方向
                    j.fire("swipe", ret);
                }
            }

            //如果触摸交互时长小于阀值且没有发生位移,则视为轻触
            if (duration <= j.p.tapDuration && j.dx <= j.p.tapLimitX && j.dy <= j.p.tapLimitY) {
                if (j.p.preventClick) {
                    e.preventDefault();
                }

                j.fire("tap", ret);
            }

            //是否缩放过
            if (j.scale != null) {
                ret.scale = j.scale;
            }

            //是否旋转过
            if (j.rotation != null) {
                ret.rotation = j.rotation;
            }

            j.fire("tapEnd", ret);
        },
        //#endregion

        //#region 设备摇动侦测
        deviceMotion: function (e) {
            var j = e.data.j,
                acceleration = e.originalEvent.accelerationIncludingGravity,  //获取含重力的加速度
                curTime = fj.Date.getTime(),
                diffTime = curTime - j.lastTime,  //获取当前时间和最后检测时间间隔
                ret = { evt: e };

            //每个一定时间检测一次
            if (diffTime > j.p.shakeDuration) {
                j.lastTime = curTime;
                var x = acceleration.x,
                    y = acceleration.y,
                    z = acceleration.z,
                    speed = Math.abs(x + y + z - j.lastShakeX - j.lastShakeY - j.lastShakeZ) / diffTime;

                if (speed > j.p.shakeLimit) {  //摇动速度超过阀值
                    if (!j.freezeShake) {
                        j.freezeShake = true;  //为防止同一次摇动中多次摇中,此处设置如果摇中一次,则本次摇动中不可能再次摇中
                        j.fire("shake", ret);
                    }

                    fj.lazyDo(function () {
                        this.freezeShake = false;
                    }, j.p.shakeFreezeDelay, "ld_gtjShake", j);
                }

                j.lastShakeX = x;
                j.lastShakeY = y;
                j.lastShakeZ = z;
            }
        },
        //#endregion

        //#region 手势变化
        //gestureChange: function (e) {
        //    var j = e.data.j,
        //        scale = e.scale,
        //        ret = { scale: scale };

        //    if(((scale < 1 ) && (scale % 1) < (1 - j.p.scalePinchClose) ) || ((scale > 1 ) && (scale % 1) > j.p.scalePinchOpen)) {
        //        ret.dir = scale < 1 ? -1 : 1;
        //        j.fire("pinch", ret);
        //    }
        //},
        //#endregion

        //#region 计算触摸点坐标值
        getTouchPos: function (e) {
            var oE = e.originalEvent,
                touches = oE.touches,
                oS = this.oTarget.offset(),
                ts = null,
                ret = [];

            for (var i = 0, l = touches.length; i < l; i++) {
                ts = touches[i];
                ret[ret.length] = [ts.pageX - oS.left, ts.pageY - oS.top];  //参数依次为:x轴坐标、y轴坐标、触摸点唯一标识
            }

            return ret;
        },
        //#endregion

        //#region 计算触摸移动方向
        getMoveDir: function () {
            var dirX, dirY;
            if (this.dx > 0) {
                dirX = "r";
            }
            else {
                dirX = "l";
            }
            if (this.dy > 0) {
                dirY = "b";
            }
            else {
                dirY = "t";
            }

            return [dirX, dirY];
        },
        //#endregion

        //#region 获取触摸点索引
        getTouchIndex: function (e) {
            var oE = e.originalEvent,
                targetTouch = oE.targetTouches[0],
                touches = oE.touches;

            for (var i = 0, l = touches.length; i < l; i++) {
                if(touches[i].identifier === targetTouch.identifier) {
                    return i;
                }
            }
        },
        //#endregion

        //#region 计算两点间距离
        getPosDistance: function (pos1, pos2) {
            var x = pos1[0] - pos2[0],
                y = pos1[1] - pos2[1];

            return Math.sqrt(
                Math.pow(x, 2) + Math.pow(y, 2)
            );
        },
        //#endregion

        //#region 计算缩放比例
        getPosScale: function (pos1, pos2) {
            return this.getPosDistance(pos1, pos2) / this.fingerDistS;
        },
        //#endregion

        //#region 计算两点间角度
        getPosAngle: function (pos1, pos2) {
            var x = pos1[0] - pos2[0],
                y = pos1[1] - pos2[1];

            return Math.atan2(y, x) * 180 / Math.PI;
        },
        //#endregion

        //#region 计算旋转角度
        getPosRotation: function (pos1, pos2) {
            return this.getPosAngle(pos1, pos2) - this.fingerRotateS;
        },
        //#endregion

        //#region 切换触摸样式
        changeTapHover: function (e, isRemove) {
            var thiz = this,
                p = thiz.p,
                tapHoverCls = p.tapHoverCls,
                tapHoverElem = p.tapHoverElem,
                oElem;

            if (!tapHoverCls) {
                return;
            }

            oElem = tapHoverElem instanceof Object ? tapHoverElem : (tapHoverElem === "tap" ? $(e.target) : thiz.oTarget);
            if(isRemove) {
                fj.lazyDo(function() {
                    oElem.removeClass(tapHoverCls);
                }, 50);
            }
            else {
                oElem.addClass(tapHoverCls);
            }
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        GestureJ: function (p) {
            if (this && this.length) {
                return new fj.GestureJ(this, fj.GTJ_commonConfig ? $.extend(true, fj.clone(fj.GTJ_commonConfig), p) : p);
            }
        },
        GTJ: function (p) {
            return $(this).GestureJ(p);
        },
        onGestureJ: function (evtName, evtFn, option) {  //绑定手势事件
            this.each(function () {
                var thiz = $(this),
                    config = $.extend(true, {
                        preventScroll: false,
                        scrollMaxX: 50,
                        scrollMaxY: 50,
                        evts: {}
                    }, option);

                //hover效果
                if (!config.tapHoverCls) {
                    if (thiz.hasClass("btnj") || thiz.hasClass("pj-head-btn")) {  //按钮
                        config.tapHoverCls = "btnj-hover";
                    }
                }

                config.evts[evtName] = evtFn;
                thiz.GTJ(config);
            });

            return this;
        }
    });
    //#endregion

});