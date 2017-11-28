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
* flareJ.Validate
*-------*-------*-------*-------*-------*-------*
* 表单验证
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.Tooltip
*----------------------------------------------*/
FJ.define("widget.Validate", ["widget.Tooltip"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                          表单验证
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.ValidateJ = this.VAJ = FJ.ValidateJ = FJ.VAJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "VAJ",
                renderTo: "body",
                regType: "Empty",                         /*-------*验证方式*-------*
                                                          * Empty:非空
                                                          * Equal:验证相等(如密码确认)
                                                          * Exp:正则表达式
                                                          * Custom:自定义验证
                                                          * MaxLength:限制字数,regMsg和regMsgT中可用{0}替换字数信息
                                                          *-----*-----*-----*-----*/
                input: elemObj,                           //验证文本框
                inputE: null,                             //验证相等的文本框
                hasTxtErrorColor: true,                   //是否有错误文本框颜色
                txtBorderWidth: 1,                        //文本框边宽
                isShowTrue: false,                        //是否显示正确图标
                isRegOnReadonly: false,                   //文本框只读时是否验证
                valElem: null,                            //验证信息显示元素
                regMsg: "不能为空!",                      //验证错误时提示信息
                regMsgT: null,                            //验证正确时提示信息
                regExp: null,                             //验证正则表达式
                allowBlank: null,                         //是否允许留空
                regFn: null,                              //自定义验证方法
                showMsg: true,                            //是否显示提示信息
                isInline: false,                          //提示信息是否换行
                msgShift: { t: 0, l:0 },                  //错误信息位置补正值
                msgDirect: "bottom",                      //提示位置方向
                isFixPos: false,                          //滚动条位置有变化时是否自动修正位置
                isFixScroll: false,                       //是否将父元素滚动条值加入计算位置
                onlyShiftPos: false,                      //是否只用偏移值决定位置
                group: null,                              //验证组
                width: 150,                               //最大宽度
                height: 22,                               //最大高度
                onlyFirstLoad: null,
                borderWidth: 0,
                showTrueBg: false,                        //是否显示正确背景颜色
                posType: "offset",                        //计算位置使用的jquery方法:1、offset;2、position
                posParam: null,
                watermark: null,                          //文本框水印字
                opacity: 0.87,                            //透明度
                layoutDelay: 800,
                autoTurn: false,
                colorParams: {
                    bgColor: "transparent",               //背景色
                    watermark: "#9c9c9c",
                    inputColor: "#333",
                    trueColor: "#333",                    //正确信息颜色 green
                    errorColor: "#333",                   //错误信息颜色 red
                    txtErrorColor: "#edca70",             //错误文本框颜色
                    txtColor: "#8EB5D4"                   //文本框颜色
                    //ttBgColor: "#e94747",  //#FEF6E1
                    //ttBgColorT: "green",
                    //ttBorderColor: "#ddd"  //#0f7cad
                },
                evts: {
                    preReg: null,         //验证前置条件
                    afterReg: null
                }
            }, settings));

            this.initFn();

            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            //将验证相等的文本框转化为jquery对象
            this.p.inputE = (typeof this.p.inputE == 'string' ? $("#" + this.p.inputE) : this.p.inputE);
            this.p.valElem = (this.p.valElem != null ? (typeof this.p.valElem == 'string' ? $("#" + this.p.valElem) : this.p.valElem) : null);

            //保存提示信息模板
            this.regMsgTmp = this.p.regMsg;
            this.regMsgTmpT = this.p.regMsgT;

            //自定义验证方法中设置的显示信息,设置完后清空
            this.regFnMsg = null;

            this._super();
            this.create();

            //加入验证组
            if(this.p.group) {
                if(!VAJ.group[this.p.group])
                    VAJ.group[this.p.group] = [];
                VAJ.group[this.p.group].push(this);
            }

            //页面重置尺寸时重计算显示位置
            $(window).on("resize", { thiz: this }, this.pageResize);
        },
        //#endregion

        //#region 构建
        create: function () {
            this._super();

            //外层
            this.divOut.attr("id", "VAJ_" + this.objId).addClass("vaj").css({
                width: "100%",
                height: "auto"
            });

            //渲染内容
            this.conTable = $("<table class='vaj_table'></table>");
            this.conTr = $("<tr></tr>");
            this.conTdL = $("<td class='vaj_td_left'></td>");
            this.conTdR = $("<td class='vaj_td_right'></td>");
            this.icon = $('<img class="vaj_iconError" src="' + fj.imgPath + 'Datagrid/treegrid/s.gif" />');
            this.msgArea = $('<span></span>');
            this.divOut.append(this.conTable.append(this.conTr.append(this.conTdL.append(this.icon)).append(this.conTdR.append(this.msgArea))));

            //绑定到文本框
            this.bindInput();

            return this;
        },
        //#endregion

        //#region 绑定到文本框
        bindInput: function () {
            var thiz = this;

            //设置文本框边框
            this.p.input.css({
                borderWidth: this.p.txtBorderWidth,
                borderColor: this.p.colorParams.txtColor,
                borderStyle: "solid",
                color: this.p.colorParams.inputColor
            });

            //文本框水印字
            this.setWatermark();

            switch (this.p.regType) {
                case "Empty":
                case "Equal":
                case "Exp":
                case "Custom":
                    this.p.input.bind("blur", function (e) {
                        thiz.reg();
                    });
                    break;
                case "MaxLength":   //限制文本框字数
                    this.p.showTrueBg = 1;
                    this.p.input.bind("keyup", function () {
                        thiz.reg();
                    });//.bind("afterpaste", function () {  //不知为何afterpaste不起作用
//                        thiz.reg();
//                    });
                    break;
            }

            this.ttj = $(this.p.input).TTJ({
                renderTo: this.p.renderTo,
                hoverDirect: this.p.msgDirect,
                shiftLeft: this.p.msgShift.l,
                shiftTop: this.p.msgShift.t,
                onlyShiftPos: this.p.onlyShiftPos,
                radius: 0,
                hoverType: "free",
                speed: 1,
                showSpeed: 200,
                width: this.p.width,
                height: this.p.height,
                isAsync: false,
                hasShadow: true,
                loadType: "html",
                loadSpeed: 1,
                borderWidth: 1,
                onlyFirstLoad: this.p.onlyFirstLoad,
                isFixScroll: this.p.isFixScroll,
                posType: this.p.posType,
                posParam: this.p.posParam,
                isAutoSetHeight: false,
                opacity: this.p.opacity,
                showLoading: false,
                isRenderHF: false,
                responsive: this.p.responsive,
                responsiveParam: this.p.responsiveParam,
                autoTurn: this.p.autoTurn,
                colorParams: {
                    borderOut: this.p.colorParams.ttBorderColor,
                    bgColorBody: this.p.colorParams.ttBgColor//,
                    //shadow: "#000"
                }
            });

            //鼠标移上时层z轴位置提高到顶层
            this.ttj.divOut.bind("mouseover", function(){
                VAJ.zIndex += 1;
                $(this).css("z-index", VAJ.zIndex);
            });

            if(this.p.isFixPos) {
                //绑定父元素滚动条事件
                this.p.renderTo.bind("scroll", function() {
                    fj.lazyDo(function() {
                        this.ttj.showAt();
                    }, 200, "ld_vajScrollP", thiz);
                });

                //绑定全局resize事件
                $(window).bind("resize", function() {
                    if(!thiz.ttj.divOut.is(":hidden")) {
                        fj.lazyDo(function() {
                            this.ttj.showAt();
                        }, 200, "ld_vajScrollP", thiz);
                    }
                });
            }

            return this;
        },
        //#endregion

        //#region 显示信息
        showInfo: function(isTrue, msg){
            var thiz = this;
            var info;
            
            this.ttj.setVisible(false);
            if(isTrue && this.p.showTrueBg) {
                var ct = this.p.colorParams.ttBgColorT;
                if(ct) {
                    if(FJ.isIE) {
                        this.ttj.bodyIn[0].style.filter = "alpha(opacity=100) progid:DXImageTransform.Microsoft.Gradient(GradientType=0, EndColorStr='" + ct + "', StartColorStr='" + ct + "')";
                    }
                    else {
                        this.ttj.pjBody.css("background-color", ct);
                    }
                }
            }
            else {
                var c = this.p.colorParams.ttBgColor;
                if(c) {
                    if(FJ.isIE) {
                        this.ttj.bodyIn[0].style.filter = "alpha(opacity=100) progid:DXImageTransform.Microsoft.Gradient(GradientType=0, EndColorStr='" + c + "', StartColorStr='" + c + "')";
                    }
                    else {
                        this.ttj.pjBody.css("background-color", c);
                    }
                }
            }

            if(isTrue){
                if(this.p.hasTxtErrorColor){
                    this.p.input.css("border", this.p.txtBorderWidth + "px solid " + this.p.colorParams.txtColor);
                }

                if(this.p.isShowTrue){
                    this.divOut.css({
                        color: this.p.colorParams.trueColor
                    });
                    this.icon.swapClassJ("vaj_iconError", "vaj_iconTrue");
                    this.msgArea.text(msg ? msg : this.p.regMsgT);
                }
                else {
                    return;
                }
            }
            else {
                if(this.p.hasTxtErrorColor){
                    this.p.input.css("border", this.p.txtBorderWidth + "px solid " + this.p.colorParams.txtErrorColor);
                }

                this.divOut.css({
                    color: this.p.colorParams.errorColor
                });
                this.icon.swapClassJ("vaj_iconTrue", "vaj_iconError");
                this.msgArea.text(msg ? msg : this.p.regMsg);
            }
            
            this.ttj.p.fnHtml = function(){
                return thiz.divOut.show();
            };
            this.ttj.reload();
            this.ttj.setVisible(true);
        },
        //#endregion

        //#region 验证
        reg: function (p, notShowMsg) {
            var thiz = this;
            if(this.p.input.attr("readonly") && !this.p.isRegOnReadonly) {  //只读时不验证
                return true;
            }

            var regTrue = false, inpVal = thiz.p.input.val(), val = $.trim(inpVal);
            if(this.p.watermark && val === this.p.watermark) {  //如文本框内有水印字则视为输入空字符串
                val = "";
            }
            var regFn = function() {
                switch (thiz.p.regType) {
                    case "Empty":
                        regTrue = val != "";
                        break;
                    case "Equal":
                        regTrue = val == $.trim(thiz.p.inputE.val());
                        break;
                    case "Exp":
                        var regEp = FJ.RX.test(thiz.p.regExp, val);
                        if (thiz.p.allowBlank) {
                            regTrue = regEp || val == "";
                        }
                        else {
                            regTrue = regEp;
                        }
                        break;
                    case "Custom":
                        var regEp = false, input = val;
                        if (thiz.p.regFn) {
                            regEp = thiz.p.regFn.call(thiz, input, p);
                        }
                        if (thiz.p.allowBlank) {
                            regTrue = regEp || input == "";
                        }
                        else {
                            regTrue = regEp;
                        }
                        break;
                    case "MaxLength":
                        if (inpVal.length > thiz.p.maxLength) {
                            thiz.p.regMsg = thiz.regMsgTmp.replace(/\{0\}/g, thiz.p.maxLength);
                            regTrue = 0;
                        }
                        else {
                            thiz.p.regMsgT = thiz.regMsgTmpT.replace(/\{0\}/g, thiz.p.maxLength - inpVal.length);
                            if (thiz.p.allowBlank) {
                                regTrue = 1;
                            }
                            else {
                                if(val != "") {
                                    regTrue = 1;
                                }
                                else {
                                    thiz.p.regMsg = thiz.p.regMsgB;
                                    regTrue = 0;
                                }
                            }
                        }

                        if(regTrue && thiz.p.regFn) {  //字数通过验证后执行自定义验证
                            var input = val, regEp = thiz.p.regFn.call(thiz, input);
                            if (thiz.p.allowBlank) {
                                regTrue = regEp || input == "";
                            }
                            else {
                                regTrue = regEp;
                            }
                            if(!regTrue) {
                                thiz.p.regMsg = thiz.p.regMsgF;
                            }
                        }
                        break;
                }
            };

            if(this.p.evts.preReg) {
                if(this.fire("preReg")) {  //验证前置条件,返回true不验证
                    regTrue = true;
                }
                else {
                    regFn();
                }
            }
            else {
                regFn();
            }

            //显示提示信息
            if(!notShowMsg) {
                this.showInfo(regTrue, this.regFnMsg);
            }
            this.regFnMsg = null;

            //文本框值为空时重置水印字
            if(val === "") {
                this.setWatermark();
            }

            //验证完成事件
            this.fire("afterReg", { result: regTrue, val: val, sign: p });

            return regTrue;
        },
        //#endregion

        //#region 重置
        reset: function () {
            if(this.p.hasTxtErrorColor){
                this.p.input.css({
                    borderColor: this.p.colorParams.txtColor
                });
            }
            this.setWatermark(1);
            this.ttj.setVisible(0);
        },
        //#endregion

        //#region 设置水印字
        setWatermark: function (isInit) {
            if(this.p.watermark != null) {
                var thiz = this;
                if(isInit) {
                    this.p.input.unbind("focus");
                }
                this.p.input.css("color", this.p.colorParams.watermark).val(this.p.watermark).one("focus", function() {
                    $(this).css("color", thiz.p.colorParams.inputColor).val("");
                });
            }
        },
        //#endregion

        //#region 页面尺寸变化事件
        pageResize: function (e) {
            var thiz = e.data.thiz,
                ttj = thiz.ttj;

            fj.lazyDo(function () {
                if(ttj.tranState === "show") {  //重计算显示位置
                    ttj.setVisible(true, null, true);
                }
            }, thiz.p.layoutDelay, "ld_vaj_layout", thiz);
        },
        //#endregion

        //#region 删除
        remove: function () {
            this.ttj.remove();
            this._super();

            $(window).off("resize", this.pageResize);
        }
        //#endregion
    });

    //#region 验证组
    FJ.VAJ.zIndex = 100;

    FJ.VAJ.group = {};

    //按组名清除验证组
    FJ.VAJ.clearGroup = function(group) {
        if(VAJ.group[group]) {
            delete VAJ.group[group];
        }
    };

    //验证
    FJ.VAJ.reg = function(group, p) {
        var arr = VAJ.group[group];
        if(arr && arr.length > 0){
            var b = true;
            for(var i = 0, l = arr.length;i < l;i++){
                if(!arr[i].reg(p)){
                    b = false;
                }
            }
            return b;
        }
        else{
            return false;
        }
    };

    //重置
    FJ.VAJ.reset = function(group) {
        var arr = VAJ.group[group];
        if(arr && arr.length > 0){
            for(var i = 0, l = arr.length;i < l;i++){
                arr[i].reset();
            }
        }
    };
    //#endregion

    //#region 绑定到jquery
    $.fn.extend({
        ValidateJ: function (settings) {
            if(this && this.length > 0) {
                return new FJ.ValidateJ(this, fj.VAJ_commonConfig ? $.extend(true, fj.clone(fj.VAJ_commonConfig), settings) : settings);
            }
        },
        VAJ: function (settings) {
            return $(this).ValidateJ(settings);
        }
    });
    //#endregion

});