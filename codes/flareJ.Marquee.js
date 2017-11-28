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
* flareJ.Marquee
*-------*-------*-------*-------*-------*-------*
* 跑马灯
*-------*-------*-------*-------*-------*-------*
* 
*----------------------------------------------*/
FJ.define("widget.Marquee", function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           跑马灯
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.MarqueeJ = this.MQJ = FJ.MarqueeJ = FJ.MQJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "MQJ",
                renderTo: elemObj,
                width: 200,
                height: 20,
                borderWidth: 0,
                direct: "h",              /*-----*移动方向*------*
                                          * h:横向
                                          * v:纵向
                                          *-----*----*----*-----*/
                top: null,                //滚动距离上方位置
                left: null,               //滚动距离左方位置
                stopByHover: true,        //鼠标移上是否停止滚动
                stopRange: 20,            //暂停移动距离
                stopTime: 35,             //暂停时间
                speed: 35,                //滚动速度
                content: null,            //展示内容
                isInitStart: true,        //初始是否滚动
                step: 1,                  //移动阶值
                evts: { }
            }, settings));

            this.initFn();
            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            var thiz = this;
            this._super();
            this.sign = 0,            //暂停标记
            this.pause = false,       //是否暂停
            this.stopscroll = false,  //是否停止滚动
            this.create();
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this;
            this._super(true);
            this.mqjId = "MQJ_" + this.objId;

            //外层
            this.divOut.attr("id", this.mqjId).addClass("mqj");
            if (this.p.width != null) {
                this.divOut.css("width", this.p.width);
            }
            if (this.p.height != null) {
                this.divOut.css("height", this.p.height);
            }

            //内容层
            this.contentDiv = $('<div></div>');
            if(this.p.direct == "v") {  //初始滚动位置
                this.contentDiv.addClass("mqj_content_v");
            }
            else {
                this.contentDiv.addClass("mqj_content_h");
            }

            //渲染
            this.divOut.append(this.contentDiv.append(this.p.content));
            this.setScrollInit();

            if (this.p.stopByHover) {  //鼠标移上停止滚动
                this.contentDiv.hover(function () {
                    thiz.stopscroll = true;
                }, function () {
                    thiz.stopscroll = false;
                });
            }

            if(!this.p.isInitStart) {  //起始是否滚动
                this.stopscroll = true;
            }
            this.scroll();
        },
        //#endregion

        //#region 滚动
        scroll: function () {
            var thiz = this;
            setTimeout(function () {
                if (thiz.stopscroll) {  //停止滚动
                    setTimeout(arguments.callee, thiz.pause ? thiz.p.stopTime : thiz.p.speed);
                    return;
                }

                var step = thiz.p.step;
                thiz.pause = false;  //记录暂停时机
                if (thiz.sign >= thiz.p.stopRange) {
                    thiz.pause = true;
                    thiz.sign = 0;
                }
                thiz.sign = thiz.sign + step;

                if(thiz.p.direct == "v") {
                    //向上滚动一个像素
                    var con = thiz.contentDiv[0],
                        top = parseInt(con.style.marginTop, 10);
                    top = top - step;
                    con.style.marginTop = top + "px";

                    //如果滚动到极限了则从下侧开始重新滚动
                    if (top <= con.clientHeight * -1) {
                        con.style.marginTop = thiz.divOut[0].clientHeight + "px";
                        thiz.sign = 0;
                    }
                }
                else {
                    //向左滚动一个像素
                    var con = thiz.contentDiv[0],
                        left = parseInt(con.style.marginLeft, 10);
                    left = left - step;
                    con.style.marginLeft = left + "px";

                    //如果滚动到极限了则从右侧开始重新滚动
                    if (left <= con.clientWidth * -1) {
                        con.style.marginLeft = thiz.divOut[0].clientWidth + "px";
                        thiz.sign = 0;
                    }
                }
                
                setTimeout(arguments.callee, thiz.pause ? thiz.p.stopTime : thiz.p.speed);
            }, thiz.p.stopTime);
        },
        //#endregion

        //#region 开始
        start: function () {
            this.stopscroll = false;
        },
        //#endregion

        //#region 停止
        stop: function () {
            this.stopscroll = true;
        },
        //#endregion

        //#region 设置内容信息
        setContent: function (v) {
            this.p.content = v;
            this.contentDiv.html(this.p.content);
            this.sign = 0;
            this.pause = false;
            this.setScrollInit();
        },
        //#endregion

        //#region 设置滚动初始信息
        setScrollInit: function () {
            if(this.p.direct == "v") {  //初始滚动位置
                if(this.p.top != null) {
                    this.contentDiv.css("margin-top", this.p.top);
                }
                else {
                    this.contentDiv.css("margin-top", this.divOut.height());
                }
            }
            else {
                if(this.p.left != null) {
                    this.contentDiv.css("margin-left", this.p.left);
                }
                else {
                    this.contentDiv.css("margin-left", this.divOut.width());
                }
            }
        },
        //#endregion

        //#region 清空
        clear: function () {
            this.setContent("");
            this.stop();
        }
        //#endregion
    });

    //#region 绑定到jquery
    $.fn.extend({
        MarqueeJ: function (settings) {
            if(this && this.length > 0) {
                return new FJ.MarqueeJ(this, fj.MQJ_commonConfig ? $.extend(true, fj.clone(fj.MQJ_commonConfig), settings) : settings);
            }
        },
        MQJ: function (settings) {
            return $(this).MarqueeJ(settings);
        }
    });
    //#endregion

});