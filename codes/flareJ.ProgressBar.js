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

/*----------------------------------------------*
* flareJ.ProgressBar
*-------*-------*-------*-------*-------*-------*
* 进度条
*-------*-------*-------*-------*-------*-------*
* 
*----------------------------------------------*/
FJ.define("widget.ProgressBar", function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           进度条
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.ProgressBarJ = this.PBJ = FJ.ProgressBarJ = FJ.PBJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "PBJ",
                renderTo: elemObj,
                width: 200,                           //最大宽度
                height: 18,                           //最大高度
                value: 30,                             //当前进度
                valueMsg: "{0}%",                      //进度信息文本             
                max: 100,                              //最大进度
                radius: 5,                             //圆角弧度
                borderWidth: 0,
                borderP: 1,
                hideTxt: false,                        //是否隐藏文字
                autoRise: 20,                          //自动开始时每次增量
                autoDelay: 500,                        //自动开始时每次间隔时间
                hasTxt: true,                          //是否有进度文字
                colorParams: {
                    //progressColor: "#85B5D9",
                    borderOut: null,
                    bgColor: "#fff"                    //背景色
                },
                evts: {
                    progressChanged: null              //进度变化
                }
            }, settings));

            this.initFn();

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            //进度信息文本模板
            this.valueMsgTmp = this.p.valueMsg;

            this._super();
            this.create(true);
        },
        //#endregion

        //#region 构建
        create: function (isShow) {
            var thiz = this;
            this._super(isShow);
            this.pbjId = "PBJ_" + this.objId;

            //外层
            this.divOut.attr("id", this.pbjId).addClass("pbj").css({
                width: this.p.width,
                height: this.p.height,
                position: "relative"
            });

            //圆角
            var radius;
            if (FJ.isFF) {
                if (!FJ.isFFgt4) {
                    radius = "-moz-border-radius";
                }
                else {
                    radius = "border-radius";
                }
            }
            else if (FJ.isWebkit) {
                radius = "-webkit-border-radius";
            }
            else if (FJ.isOpera || FJ.isIEgt9) {
                radius = "border-radius";
            }
            if (radius && this.p.radius > 0) {
                this.divOut.css(radius, this.p.radius + "px");
            }

            //进度条
            if(FJ.checkTag("progress") && !FJ.isOpera) {
                if(this.p.value >= this.p.max) {
                    this.divOut.addClass("pbj_max");
                }
                else {
                    this.divOut.addClass("pbj_normal");
                }
                this.progress = $("<progress class='pbj_progress' value='" + this.p.value + "' max='" + this.p.max + "'></progress>").css({
                    borderRadius: this.p.radius,
                    width: this.p.width,
                    height: this.p.height,
                    borderWidth: this.p.borderP,
                    backgroundColor: this.p.colorParams.bgColor
                });

                if(this.p.colorParams.borderOut) {
                    this.progress.css("border-color", this.p.colorParams.borderOut);
                }
            }
            else {
                this.divOut.css("border-width", this.p.borderP);
                this.progress = $('<div class="pbj_progressDiv"></div>').css({
                    borderRadius: (this.p.radius - 2) + "px 0 0 " + (this.p.radius - 2) + "px",
                    width: this.countValue(),
                    height: this.p.height
                });

                if(this.p.colorParams.progressColor) {
                    this.progress.css("background-color", this.p.colorParams.progressColor);
                }
            }

            //进度文字
            if(this.p.hasTxt) {
                this.progressTxt = $("<div class='pbj_percent'>" + this.valueMsgTmp.replace(/\{0\}/g, this.p.value) + "</div>").css({
                    display: this.p.hideTxt ? "none" : "block"
                });
                if(this.p.colorParams.progressTxt) {
                    this.progressTxt.css("color", this.p.colorParams.progressTxt);
                }
                this.divOut.append(this.progressTxt);
            }

            //渲染
            this.divOut.append(this.progress);
            return this;
        },
        //#endregion

        //#region 创建样式表(已废弃)
//        createStyle: function (isMax) {
//            var style, radius = !isMax ? "border-radius:" + (this.p.radius - 2) + "px 0 0 " + (this.p.radius - 2) + "px" : "border-radius:" + (this.p.radius - 2) + "px";
//            if(FJ.isFF) {
//                style = "#" + this.pbjId + " progress::-moz-progress-bar{" + radius + ";}";
//            }
//            else if(FJ.isChrome) {
//                style = "#" + this.pbjId + " progress::-webkit-progress-value{" + radius + ";}";
//                style += "#" + this.pbjId + " progress::-webkit-progress-bar{border-radius:" + (this.p.radius - 2) + "px;}";

//                //兼容旧版chrome的样式
//                style += "#" + this.pbjId + " progress::-webkit-progress-bar-value{" + radius + ";}";
//            }

//            var oStyle = $("#pbj_" + this.pbjId);
//            if(oStyle.length > 0) {
//                oStyle.remove();
//            }
//            FJ.CSS.createStyle("pbj_" + this.pbjId, style);
//        },
        //#endregion

        //#region 获取进度条值
        getValue: function () {
            return this.p.value;
        },
        //#endregion

        //#region 设置进度条值
        setValue: function (p, speed) {
            var thiz = this;
            this.p.value = p;
            
            //验证值是否合法
            if (!FJ.RX.numZ(p)) {  //必须输入大于0的正整数
                this.p.value = 0;
            }
            if(this.p.value > this.p.max) {  //不能超过最大值
                this.p.value = this.p.max;
            }

            if(FJ.checkTag("progress") && !FJ.isOpera) {
                var fn = function() {
                    if(thiz.p.value == thiz.p.max) {
                        thiz.divOut.swapClassJ("pbj_normal", "pbj_max");
                    }
                    else {
                        thiz.divOut.swapClassJ("pbj_max", "pbj_normal");
                    }
                    if(thiz.p.hasTxt) {
                        thiz.progressTxt.text(thiz.p.value + "%");
                    }
                    thiz.fire("progressChanged", { value: thiz.p.value });  //进度变化事件
                };

                if(FJ.isChrome) {
                    this.progress.css("width", this.p.width);
                }
                if(!speed) {
                    this.progress.attr("value", this.p.value);
                    fn();
                }
                else {  //有动画
                    var opt = { value: this.p.value };
                    this.progress.animate(opt, speed, function() {
                        fn();
                    });
                }
            }
            else {
                var fn = function() {
                    if(!FJ.isIElt9) {
                        if(thiz.p.value == thiz.p.max) {
                            thiz.progress.css({ borderRadius: (thiz.p.radius - 2) + "px" });
                        }
                        else {
                            thiz.progress.css({ borderRadius: (thiz.p.radius - 2) + "px 0 0 " + (thiz.p.radius - 2) + "px" });
                        }
                    }
                    if(thiz.p.hasTxt) {
                        thiz.progressTxt.text(thiz.p.value + "%");
                    }
                    thiz.fire("progressChanged", { value: thiz.p.value });  //进度变化事件
                };

                var value = this.countValue();
                if(!speed) {
                    this.progress.width(value);
                    fn();
                }
                else {  //有动画
                    var opt = { width: value };
                    this.progress.animate(opt, speed, function() {
                        fn();
                    });
                }
            }
        },
        //#endregion

        //#region 自动开始
        start: function (p) {
            var thiz = this;
            this.stopP = false;
            (function() {
                if(!thiz.stopP) {
                    if(thiz.p.value >= thiz.p.max) {
                        thiz.p.value = 0;
                    }
                    thiz.setValue(parseInt(thiz.p.value, 10) + thiz.p.autoRise);
                    setTimeout(arguments.callee, thiz.p.autoDelay);
                }
            })();
        },
        //#endregion

        //#region 停止
        stop: function () {
            this.stopP = true;
        },
        //#endregion

        //#region 清空
        clear: function () {
            this.stop();
            this.setValue(0);
        },
        //#endregion

        //#region 计算进度条值
        countValue: function () {
            //设置值前检测宽度是否百分数
            var pVal = this.p.value / this.p.max;
            if(!fj.RX.percent(this.p.width)) {
                pVal = this.p.width * pVal;
            }
            else {
                pVal = pVal * 100 + "%";
            }

            return pVal;
        }
        //#endregion
    });

    //#region 生成进度条字符串
    FJ.PBJ.createProgressBarStr = function (value, max, width, height) {
        var w = width * (value / max);
        return '<div class="pbj_progressDiv" style="width:' + w + 'px;height:' + height + 'px;"></div>';
    };
    //#endregion

    //#region 绑定到jquery
    $.fn.extend({
        ProgressBarJ: function (settings) {
            if(this && this.length > 0) {
                return new FJ.ProgressBarJ(this, fj.PBJ_commonConfig ? $.extend(true, fj.clone(fj.PBJ_commonConfig), settings) : settings);
            }
        },
        PBJ: function (settings) {
            return $(this).ProgressBarJ(settings);
        }
    });
    //#endregion

});