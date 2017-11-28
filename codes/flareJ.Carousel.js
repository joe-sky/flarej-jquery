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
* last update:2015-8-6
***********************************************************/

/*----------------------------------------------*
* flareJ.Carousel
*-------*-------*-------*-------*-------*-------*
* 旋转轮播
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.Gesture
*----------------------------------------------*/
FJ.define("widget.Carousel", ["widget.Gesture"], function () {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                         旋转轮播
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 参考自bootstrap3的carousel组件
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 增加了触摸手势滑动轮播
    ************************************************************/
    this.CarouselJ = this.CRSJ = FJ.CarouselJ = FJ.CRSJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "CRSJ",
                renderTo: elemObj,
                width: "100%",
                height: "100%",
                borderWidth: 0,
                activeIndex: 0,                       //默认显示项索引
                transition: "left 0.6s ease-in-out",  //过渡动画参数
                transitionT: "0.25s ease-out",        //过渡动画参数(触摸时)
                autoPlay: false,                      //是否自动播放
                autoDuration: 5000,                   //自动播放间隔时间
                navIconL: "<",                        //低版本IE左侧导航按钮图标文字
                navIconR: ">",                        //低版本IE右侧导航按钮图标文字
                autoEndDelay: 700,
                tapEndDelay: 350,
                items:
                [
                    /*{
                        id: 'img1',                 //标识
                        content: "<img />",         //内容
                    }*/
                ],
                evts: {
                    afterMove: null   //移动后
                }
            }, settings));

            this.initFn();
            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            var thiz = this;
            this._super();

            this.crsjId = "CRSJ_" + this.objId;
            this.items = [];  //内容项集合
            this.activeItem = null;  //当前显示项
            this.isPause = false;      //是否暂停

            this.create();
            this.show();
        },
        //#endregion

        //#region 构建
        create: function () {
            this._super();
            var thiz = this;

            //外层
            this.divOut.attr("id", this.crsjId).addClass("crsj").css({
                width: this.p.width,
                height: this.p.height
            });

            //内容容器
            this.container = $('<div class="crsj_container"></div>');

            //加载内容项
            for (var i = 0, l = this.p.items.length; i < l; i++) {
                var it = this.p.items[i],
                    item = $('<div class="crsj_item"></div>');

                item.append(it.content);
                if (i == this.p.activeIndex) {  //设置默认显示项
                    item.addClass("crsj_active");
                    this.activeItem = item;
                }
                this.container.append(item);
                this.items[this.items.length] = item;
            }

            //构建导航按钮列表
            this.indicator = $((function (inx, inxA) {
                var s = STJ.init({ text: '<ol class="crsj_indicator">' });
                for (var i = 0; i < inx; i++) {
                    s.add(['<li data-crsj-move-no="', i, '" class="crsj_indi', i == inxA ? ' crsj_indicator_active' : ' ', '"></li>']);
                }
                s.add('</ol>');
                return s.join();
            })(this.p.items.length, this.p.activeIndex));

            //导航按钮列表集合
            this.indicators = this.indicator.find("li").onGestureJ(fj.Evt.click, function () {
                thiz.move(this.oTarget.attr("data-crsj-move-no"));  //点击跳转
            });

            if (!fj.isMobile) {  //非触屏
                //两侧导航按钮
                this.navLeft = $('<a class="crsj_nav crsj_nav_left"><div class="crsj_navIcon crsj_navIcon_prev">' + (fj.isIElt8 ? this.p.navIconL : '') + '</div></a>')
                .on("click", function () {
                    thiz.next();
                });
                this.navRight = $('<a class="crsj_nav crsj_nav_right"><div class="crsj_navIcon crsj_navIcon_next">' + (fj.isIElt8 ? this.p.navIconR : '') + '</div></a>')
                .on("click", function () {
                    thiz.prev();
                });
                this.divOut.append(this.navLeft).append(this.navRight);
            }
            else {  //触屏
                this.bindTouchEvt();  //绑定触摸事件
            }

            //渲染
            this.divOut.append(this.indicator).append(this.container);

            //设置自动播放
            this.setAutoPlay();
        },
        //#endregion

        //#region 移动至下一项
        next: function () {
            this.move(null, "next");
        },
        //#endregion

        //#region 移动至上一项
        prev: function () {
            this.move(null, "prev");
        },
        //#endregion

        //#region 移动项
        move: function (index, type) {
            if (this.items.length <= 1 || this.moving || this.isPause || (this.gtj && this.gtj.stopTap)) {  //如果正在移动中则不能移动
                return;
            }
            this.moving = true;
            this.setAutoPlay(false);  //暂停自动播放

            if (index == null) {
                if (!type) {
                    type = "next";
                }
            }
            else {  //如果传了移动编号参数则由编号判断方向
                index = parseInt(index, 10);
                if (index < 0 || index >= this.items.length || index == this.p.activeIndex) {
                    this.moving = false;
                    this.setAutoPlay(true);
                    return;
                }
                else if (index > this.p.activeIndex) {
                    type = "next";
                }
                else if (index < this.p.activeIndex) {
                    type = "prev";
                }
            }

            var thiz = this,
                targetC = "crsj_" + type,
                actC = "crsj_active",
                dirC = type == "next" ? "crsj_left" : "crsj_right",
                targetItem;

            if (index == null) {  //获取移动目标项索引
                if (type == "next") {
                    var nextItem = this.activeItem.next();
                    if (nextItem.length) {
                        index = thiz.p.activeIndex + 1;
                    }
                    else {
                        index = 0;
                    }
                }
                else {
                    var prevItem = this.activeItem.prev();
                    if (prevItem.length) {
                        index = thiz.p.activeIndex - 1;
                    }
                    else {
                        index = this.items.length - 1;
                    }
                }
            }

            //切换导航按钮列表
            this.indicators.eq(thiz.p.activeIndex).removeClass("crsj_indicator_active");
            this.indicators.eq(index).addClass("crsj_indicator_active");
            targetItem = this.items[index];

            var fnEnd = function () {
                thiz.p.activeIndex = index;
                thiz.setAutoPlay();  //重新设置自动播放
                thiz.moving = false;
                thiz.fire("afterMove", { activeNo: index });
            };
            if (fj.Evt.transition) {  //支持过渡动画
                //执行移动动画
                targetItem.addClass(targetC);
                targetItem[0].offsetWidth;  //重绘UI使样式立即生效
                this.activeItem.addClass(dirC);
                targetItem.addClass(dirC);

                //动画结束事件
                //this.activeItem.one(fj.Evt.transition.end, function () {
                //    thiz.activeItem.removeClass(actC + " " + dirC);
                //    thiz.activeItem = targetItem.swapClassJ(targetC + " " + dirC, actC);
                //    fnEnd();
                //});
                fj.lazyDo(function () {
                    thiz.activeItem.removeClass(actC + " " + dirC);
                    thiz.activeItem = targetItem.swapClassJ(targetC + " " + dirC, actC);
                    fnEnd();
                }, thiz.p.autoEndDelay, "ld_crsj_autoEnd", thiz);
            }
            else {  //不支持过渡动画
                this.activeItem.removeClass(actC);
                this.activeItem = targetItem.addClass(actC);
                fnEnd();
            }
        },
        //#endregion

        //#region 暂停
        pause: function (p) {
            this.isPause = p;
        },
        //#endregion

        //#region 自动播放
        setAutoPlay: function (p) {
            if (!this.p.autoPlay) {
                return;
            }

            var thiz = this;
            if (p == null) {
                p = true;
            }

            if (this.autoInterval) {  //设置计时器前先清除
                clearInterval(this.autoInterval);
            }
            if (p) {  //设置自动播放
                this.autoInterval = setInterval(function () {
                    thiz.next();
                }, this.p.autoDuration);
            }
        },
        //#endregion

        //#region 绑定触摸事件
        bindTouchEvt: function () {
            var thiz = this,
                items = thiz.items,
                propT = fj.Evt.transition.prop,
                propF = fj.Evt.transform.prop,
                iL = items.length - 1,
                transition = thiz.p.transition,
                transitionT = thiz.p.transitionT;

            //#region 设置触摸手势
            this.gtj = this.divOut.GTJ({
                scrollMaxX: 20,
                durationLimitS: 275,
                distanceLimitH: 50,
                evts: {
                    tapStart: function (e, p) {  //轻触
                        var thix = this;
                        thix.isNav = p.evt.target.className.indexOf("crsj_indi") != -1;

                        if (thix.stopTap || thiz.isPause || thix.isNav || thiz.moving) {
                            thix.stopTouch = true;
                            return;
                        }
                        thix.stopTouch = false;

                        //暂停自动播放
                        thiz.setAutoPlay(false);

                        //标记是否横扫
                        thix.isSwipe = false;

                        //获取前后项
                        var iL = items.length - 1;
                        if (iL > 0) {
                            thiz.nextItem = items[thiz.p.activeIndex != iL ? thiz.p.activeIndex + 1 : 0];
                            thiz.prevItem = items[thiz.p.activeIndex != 0 ? thiz.p.activeIndex - 1 : iL];

                            //清除前后项过渡效果
                            thiz.nextItem[0].style[propT] = "none";
                            thiz.prevItem[0].style[propT] = "none";
                        }

                        //初始化前后项类标记
                        thix.nextC = false;
                        thix.prevC = false;

                        //清除当前项过渡效果
                        thiz.activeItem[0].style[propT] = "none";
                    },
                    pan: function (e, p) {  //平移
                        var thix = this;
                        if (p.touchId > 0 || thix.stopTouch) {
                            return;
                        }

                        var nextItem = thiz.nextItem,
                            prevItem = thiz.prevItem;

                        //移动当前项
                        thiz.activeItem[0].style[propF] = "translate3d(" + p.dx + "px, 0, 0)";

                        //按方向移动前后项
                        if (p.dirX == "l") {
                            if (nextItem) {
                                if (!thix.nextC) {  //添加后项样式,并去掉前项样式
                                    nextItem.addClass("crsj_next");
                                    prevItem.removeClass("crsj_prev");
                                    thix.nextC = true;
                                    thix.prevC = false;
                                }

                                nextItem[0].style[propF] = "translate3d(" + p.dx + "px, 0, 0)";
                                //prevItem[0].style[propF] = "translate3d(0px, 0)";
                            }
                        }
                        else {
                            if (prevItem) {
                                if (!thix.prevC) {  //添加前项样式,并去掉后项样式
                                    prevItem.addClass("crsj_prev");
                                    nextItem.removeClass("crsj_next");
                                    thix.prevC = true;
                                    thix.nextC = false;
                                }

                                prevItem[0].style[propF] = "translate3d(" + p.dx + "px, 0, 0)";
                                //nextItem[0].style[propF] = "translate3d(0px, 0)";
                            }
                        }
                    },
                    swipe: function (e, p) {  //扫动
                        this.isSwipe = true;  //标记交互方式为横扫
                    },
                    scrollEnd: function (e, p) {  //滚动结束
                        var nextItem = thiz.nextItem,
                            prevItem = thiz.prevItem;

                        //恢复各项初始状态
                        thiz.activeItem[0].style[propT] = transition;
                        if (nextItem) {
                            nextItem.removeClass("crsj_next");
                            nextItem[0].style[propT] = transition;
                        }
                        if (prevItem) {
                            prevItem.removeClass("crsj_prev");
                            prevItem[0].style[propT] = transition;
                        }

                        //重新设置自动播放
                        thiz.setAutoPlay();
                    },
                    tapEnd: function (e, p) {  //移开触摸区域
                        if (this.stopTouch) {
                            return;
                        }
                        this.stopTap = true;  //执行过渡动画前标记禁止触摸

                        var thix = this,
                            itemA = thiz.activeItem[0],
                            nextItem = thiz.nextItem,
                            prevItem = thiz.prevItem,
                            itemN = nextItem ? nextItem[0] : null,
                            itemP = prevItem ? prevItem[0] : null,
                            cW = thiz.container[0].clientWidth,
                            /*
                             * (1)如果为横扫操作则直接切换至下一项,否则取容器宽度的一半
                             * (2)如果只有一项则视为不超过一半
                             */
                            gtHalf = itemN ? (!this.isSwipe ? Math.abs(p.dx) > cW / 2 : true) : false;

                        //触摸结束操作
                        var fnEnd = function () {
                            //清除各项变换位置
                            itemA.style[propF] = "none";
                            if (itemN) {
                                itemN.style[propF] = "none";
                            }
                            if (itemP) {
                                itemP.style[propF] = "none";
                            }

                            if (!gtHalf) {  //弹回原始位置时
                                //去除前后项样式
                                nextItem && nextItem.removeClass("crsj_next");
                                prevItem && prevItem.removeClass("crsj_prev");
                            }
                            else {  //切换至下一项时
                                //设置导航按钮状态
                                var inxF;
                                if (p.dirX == "l") {
                                    if (thiz.p.activeIndex < items.length - 1) {  //移动后索引项为当前项索引+1
                                        inxF = thiz.p.activeIndex + 1;
                                    }
                                    else {
                                        inxF = 0;
                                    }
                                }
                                else {
                                    if (thiz.p.activeIndex > 0) {  //移动后索引项为当前项索引-1
                                        inxF = thiz.p.activeIndex - 1;
                                    }
                                    else {
                                        inxF = items.length - 1;
                                    }
                                }
                                thiz.indicators.eq(thiz.p.activeIndex).removeClass("crsj_indicator_active");
                                thiz.indicators.eq(inxF).addClass("crsj_indicator_active");

                                thiz.activeItem.removeClass("crsj_active");
                                if (p.dirX == "l") {
                                    if (itemN) {
                                        itemN.style[propT] = "none";  //暂时清除过渡效果
                                        thiz.activeItem = nextItem.swapClassJ("crsj_next", "crsj_active");
                                        itemN.offsetWidth;  //重绘UI使样式立即生效
                                        thiz.prevItem.removeClass("crsj_prev");
                                    }
                                }
                                else {
                                    if (itemP) {
                                        itemP.style[propT] = "none";  //暂时清除过渡效果
                                        thiz.activeItem = thiz.prevItem.swapClassJ("crsj_prev", "crsj_active");
                                        itemP.offsetWidth;  //重绘UI使样式立即生效
                                        nextItem.removeClass("crsj_next");
                                    }
                                }
                                thiz.p.activeIndex = inxF;  //重新设置当前项索引
                            }

                            //还原过渡参数
                            itemA.style[propT] = transition;
                            if (itemN) {
                                itemN.style[propT] = transition;
                            }
                            if (itemP) {
                                itemP.style[propT] = transition;
                            }

                            //清除前后项对象
                            thiz.nextItem = null;
                            thiz.prevItem = null;

                            //重新设置自动播放
                            thiz.setAutoPlay();

                            //移动完毕事件
                            if (gtHalf) {
                                fj.lazyDo(function () {
                                    this.fire("afterMove", { activeNo: inxF });
                                }, 25, "ld_crsj_afterMove", thiz);
                            }

                            //解除禁止触摸
                            thix.stopTap = false;
                        };

                        //thiz.activeItem.one(fj.Evt.transition.end, function() {  //过渡动画结束后触发结束操作
                        //    fnEnd();
                        //});
                        fj.lazyDo(function () {
                            fnEnd();
                        }, thiz.p.tapEndDelay, "ld_crsj_tapEnd", thiz);

                        //重设过渡参数
                        itemA.style[propT] = transitionT;
                        if (p.dirX == "l") {
                            if (itemN) {
                                itemN.style[propT] = transitionT;
                            }
                        }
                        else {
                            if (itemP) {
                                itemP.style[propT] = transitionT;
                            }
                        }

                        if (!gtHalf) {  //如移动距离未超过容器宽度的一半,则弹回原先的位置
                            itemA.style[propF] = "translate3d(0px, 0, 0)";
                            if (itemN) {
                                itemN.style[propF] = "translate3d(0px, 0, 0)";
                            }
                            if (itemP) {
                                itemP.style[propF] = "translate3d(0px, 0, 0)";
                            }
                        }
                        else {  //如移动距离超过了容器宽度的一半,则切换至下一项
                            if (p.dirX == "l") {
                                itemA.style[propF] = "translate3d(-" + cW + "px, 0, 0)";
                                if (itemN) {
                                    itemN.style[propF] = "translate3d(-" + cW + "px, 0, 0)";
                                }
                            }
                            else {
                                itemA.style[propF] = "translate3d(" + cW + "px, 0, 0)";
                                if (itemP) {
                                    itemP.style[propF] = "translate3d(" + cW + "px, 0, 0)";
                                }
                            }
                        }
                    }
                }
            });
            //#endregion
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        CarouselJ: function (settings) {
            if (this && this.length > 0) {
                return new fj.CarouselJ(this, fj.CRSJ_commonConfig ? $.extend(true, fj.clone(fj.CRSJ_commonConfig), settings) : settings);
            }
        },
        CRSJ: function (settings) {
            return $(this).CarouselJ(settings);
        }
    });
    //#endregion

});