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
* last update:2015-6-12
***********************************************************/

/*----------------------------------------------*
* flareJ.Slider
*-------*-------*-------*-------*-------*-------*
* 滑块
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.DragDrop
*----------------------------------------------*/
FJ.define("widget.Slider", ["widget.DragDrop"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           滑块
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.SliderJ = this.SDJ = FJ.SliderJ = FJ.SDJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "SDJ",
                renderTo: elemObj,
                width: 350,
                height: 18,
                borderWidth: 0,
                range: [0, 100],        //值范围
                step: 10,               //阶值
                start: 0,               //初始值
                dir: "h",               /*------*滑块方向*-------*
                                         * h:横向
                                         * v:纵向
                                         *-----*-----*-----*-----*/
                thumbSize: {            //滑动按钮尺寸
                    w: 18,
                    h: 18
                },
                axisSize: {             //滑动轴尺寸
                    h: 10,
                    w: 10,
                    t: 4,
                    l: 4
                },
                evts: {
                    sliderChange: null
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
            this.create();

            //计算总像素数
            var dir = this.p.dir;
            if(dir == "h") {
                this.totalPx = this.divOut.innerWidth() - this.p.thumbSize.w;
            }
            else {
                this.totalPx = this.divOut.innerHeight() - this.p.thumbSize.h;
            }

            //计算阶像素数
            var stepPx = (this.p.step / this.p.range[1]) * this.totalPx;
            this.stepPx = stepPx;

            //上次移动位置
            this.lastPos = 0;

            //设置可拖放
            this.oDrj = this.thumb.DRJ({
                oContainer: this.divOut,
                dir: this.p.dir,
                posType: "position",
                hasProxy: true,
                hideProxy: true,
                setPosByProxy: false,
                cursor: "auto",
                evts: {
                    drag: function (e, p) {
                        var px, c;
                        if(dir == "h") {
                            px = p.x;
                            c = "left";
                        }
                        else {
                            px = p.y;
                            c = "top";
                        }
                        if(px % stepPx >= Math.floor(stepPx / 2) || px <= 0) {
                            var lv = Math.ceil(px / stepPx);
                            if(lv != thiz.lastPos) {
                                thiz.lastPos = lv;
                                this.p.oRoot.css(c, lv * stepPx);
                                thiz.fire("sliderChange", { v: lv, x: p.x, y: p.y });
                            }
                        }
                    },
                    dragStart: function (e, p) { },
                    dragEnd: function (e, p) { }
                }
            });

            this.show();
        },
        //#endregion

        //#region 构建
        create: function () {
            this._super();
            this.sdjId = "SDJ_" + this.objId;

            //外层
            this.divOut.attr("id", this.sdjId).addClass("sdj");

            //滑动按钮
            this.thumb = $('<div class="sdj_thumb"></div>').css({
                width: this.p.thumbSize.w,
                height: this.p.thumbSize.h
            });

            //滑动轴
            this.axis = $('<div class="sdj_axis"></div>');
            if(this.p.dir == "h") {
                this.axis.css({
                    width: this.p.width - this.p.thumbSize.w,
                    height: this.p.axisSize.h,
                    top: this.p.axisSize.t,
                    left: this.p.thumbSize.w / 2
                });
            }
            else {
                this.axis.css({
                    width: this.p.axisSize.w,
                    height: this.p.height - this.p.thumbSize.h,
                    top: this.p.thumbSize.h / 2,
                    left: this.p.axisSize.l
                });
            }

            //渲染
            this.divOut.append(this.thumb).append(this.axis);
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        SliderJ: function (settings) {
            if(this && this.length > 0) {
                return new FJ.SliderJ(this, fj.SDJ_commonConfig ? $.extend(true, fj.clone(fj.SDJ_commonConfig), settings) : settings);
            }
        },
        SDJ: function (settings) {
            return $(this).SliderJ(settings);
        }
    });
    //#endregion

});