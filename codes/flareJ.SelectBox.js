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
* flareJ.SelectBox
*-------*-------*-------*-------*-------*-------*
* 选框
*-------*-------*-------*-------*-------*-------*
* 
*----------------------------------------------*/
FJ.define("widget.SelectBox", function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                           选框
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.SelectBoxJ = this.SBXJ = FJ.SelectBoxJ = FJ.SBXJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //初始化css类名参数
            var type;
            if(settings) {
                if(settings.type == null || settings.type == "checkbox") {
                    type = "";
                }
                else {
                    type = "_" + settings.type;
                }
                if(settings.cNameLabel == null) {
                    settings.cNameLabel = "sbxj_label" + type;
                }
                if(settings.cNameNoCheck == null) {
                    settings.cNameNoCheck = "sbxj_noCheck" + type;
                }
                if(settings.cNameNoCheckH == null) {
                    settings.cNameNoCheckH = "sbxj_noCheck" + type + "_h";
                }
                if(settings.cNameChecked == null) {
                    settings.cNameChecked = "sbxj_checked" + type;
                }
                if(settings.cNameCheckedH == null) {
                    settings.cNameCheckedH = "sbxj_checked" + type + "_h";
                }
                if(settings.cNameNoCheckDisabled == null) {
                    settings.cNameNoCheckDisabled = "sbxj_noCheck" + type + "_disabled";
                }
                if(settings.cNameCheckedDisabled == null) {
                    settings.cNameCheckedDisabled = "sbxj_checked" + type + "_disabled";
                }
            }
            
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "SBXJ",
                renderTo: elemObj,
                width: null,
                height: null,
                type: "checkbox",            /*------*选框类型*-------*
                                              * checkbox:复选框
                                              * radio:单选框
                                              * collapse:折叠图标
                                              *-----*-----*-----*-----*/
                cNameLabel: "sbxj_label",    //标签类名
                cNameNoCheck: "sbxj_noCheck",
                cNameNoCheckH: "sbxj_noCheck_h",
                cNameChecked: "sbxj_checked",
                cNameCheckedH: "sbxj_checked_h",
                cNameIndeterminate: "sbxj_indeterminate",
                cNameIndeterminateH: "sbxj_indeterminate_h",
                cNameNoCheckDisabled: "sbxj_noCheck_disabled",
                cNameCheckedDisabled: "sbxj_checked_disabled",
                cNameIndeterminateDisabled: "sbxj_indeterminate_disabled",
                initChecked: null,           /*---------*默认选中*----------*
                                              * type为checkbox:true,false,2
                                              * type为radio:选中的单选框索引数字或id
                                              *-----*-----*-----*-----*-----*/
                initDisabled: null,
                inputId: null,
                inputClass: null,
                initClass: null,
                name: null,
                title: null,
                canQuery: true,              //是否可查找选框对象
                isInitHide: null,            //初始是否隐藏
                evts: {
                    onChecked: null,
                    beforeClick: null        //此处可控制点击复选框后选中状态方法,返回选中状态
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

            //转换选中状态值
            if(this.p.initChecked === 1) {
                this.p.initChecked = true;
            }
            else if(this.p.initChecked === 0) {
                this.p.initChecked = false;
            }

            //判断选中元素是否为input
            if(this.p.renderTo && this.p.renderTo[0].tagName.toLowerCase() == "input") {
                this.isWrap = true;
                this.input = this.p.renderTo;
                this.inputId = this.input.attr("id");

                //初始选中状态
                if(this.p.initChecked == null) {
                    this.checked = this.input[0].checked;
                }
                else {
                    this.checked = this.p.initChecked;
                    if(this.checked === false) {
                        this.input[0].checked = false;
                    }
                    else {
                        this.input[0].checked = true;
                    }
                }
                if(this.p.initDisabled == null) {
                    this.disabled = this.input[0].disabled;
                }
                else {
                    this.disabled = this.p.initDisabled;
                    this.input[0].disabled = this.disabled;
                }

                //组名
                if(this.p.name == null) {
                    this.name = this.input.attr("name");
                }
                else {
                    this.name = this.p.name;
                }

                //悬浮提示
                if(this.p.title == null) {
                    this.p.title = this.input.attr("title");
                }

                //初始是否隐藏
                if(this.p.isInitHide == null) {
                    this.p.isInitHide = this.input.is(":hidden");
                }

                //input标签的margin-left不可有默认值
                if(this.input[0].style.marginLeft !== "") {
                    this.input[0].style.marginLeft = "-10000px";
                }
            }
            else {
                this.isWrap = false;
                this.inputId = this.p.inputId;

                //初始选中状态
                this.checked = this.p.initChecked != null ? this.p.initChecked : false;
                this.disabled = this.p.initDisabled != null ? this.p.initDisabled : false;
                this.name = this.p.name;
            }

            this.create();
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this,
                initClass;

            this.sbxjId = "SBXJ_" + this.objId;
            if(this.inputId == null) {
                this.inputId = this.sbxjId + "_B";
                if(this.isWrap) {
                    this.input.attr("id", this.inputId);
                }
            }

            //设置初始选中状态
            if(this.checked === true) {
                if(!this.disabled) {
                    initClass = this.p.cNameChecked;
                }
                else {
                    initClass = this.p.cNameCheckedDisabled;
                }
            }
            else if(this.checked === 2) {
                if(!this.disabled) {
                    initClass = this.p.cNameIndeterminate;
                }
                else {
                    initClass = this.p.cNameIndeterminateDisabled;
                }
            }
            else {
                if(!this.disabled) {
                    initClass = this.p.cNameNoCheck;
                }
                else {
                    initClass = this.p.cNameNoCheckDisabled;
                }
            }

            //选框不存在则创建
            if(!this.input) {
                var inputType = this.p.type;
                if(inputType == "collapse") {
                    inputType = "checkbox";
                }
                
                this.input = $('<input type="' + inputType + '" id="' + this.inputId + '"' + (this.checked ? ' checked' : '') + (this.disabled ? ' disabled' : '') + ' autocomplete="off" hidefocus />');
                if(this.p.inputClass != null) {
                    this.input.addClass(this.p.inputClass);
                }
            }

            //加入选框组
            if(this.name != null) {
                this.input.attr("name", this.name);
                
                if(!SBXJ.group[this.name]) {
                    SBXJ.group[this.name] = {};
                }
                SBXJ.group[this.name][this.sbxjId] = this;
            }

            //外层
            this.divOut = $('<label id="' + this.sbxjId + '" class="sbxj ' + this.p.cNameLabel + ' ' + initClass + '" for="' + this.inputId + '"></label>');
            if(this.p.initClass) {
                this.divOut.addClass(this.p.initClass);
            }
            if(this.p.isInitHide) {
                this.divOut.hide();
            }

            //悬浮提示
            if(this.p.title != null && $.trim(this.p.title) != "") {
                this.divOut.attr("title", this.p.title);
            }

            //设置样式
            if (this.p.style != null) {
                this.divOut.attr("style", this.p.style);
            }
            if (this.p.width != null) {
                this.divOut.css("width", this.p.width);
            }
            if (this.p.height != null) {
                this.divOut.css("height", this.p.height);
            }

            //渲染
            if(this.isWrap) {  //包裹在选框控件外
                this.input.after(this.divOut);
            }
            else {
                if(this.p.renderTo) {
                    this.p.renderTo.append(this.divOut);
                }
            }
            if(this.p.canQuery) {  //创建dom对象保存选框控件对象引用,用于查找
                var s = $("<span id='" + this.inputId + "Q' class='sbxj_inputQ'></span>");
                s[0].sbxj = this;
                this.divOut.append(s);
            }
            this.divOut.append(this.input.addClass("sbxj_input")).click(function(e) {
                e.stopPropagation();  //label标签如果for属性指定input标签后,如需取消事件冒泡则需要在label的事件中也取消
            });

            //选框点击切换样式
            this.input.click(function(e, p) {
                e.stopPropagation();
                if(!thiz.disabled) {
                    var checked = this.checked,
                        r = thiz.fire("beforeClick", { checked: checked, param: p });

                    if(r != null) {  //此处可控制选中状态
                        checked = r;
                    }
                    thiz.setChecked(checked, true);
                }
            });

            //选框高亮
            this.divOut.hover(function() {
                if(!thiz.disabled) {
                    if(thiz.checked === true) {
                        thiz.divOut.swapClassJ(thiz.p.cNameChecked, thiz.p.cNameCheckedH);
                    }
                    else if(thiz.checked === 2) {
                        thiz.divOut.swapClassJ(thiz.p.cNameIndeterminate, thiz.p.cNameIndeterminateH);
                    }
                    else {
                        thiz.divOut.swapClassJ(thiz.p.cNameNoCheck, thiz.p.cNameNoCheckH);
                    }
                    thiz.divOut.addClass("sbxj_hover");  //标记高亮
                }
            }, function() {
                if(!thiz.disabled) {
                    if(thiz.checked === true) {
                        thiz.divOut.swapClassJ(thiz.p.cNameCheckedH, thiz.p.cNameChecked);
                    }
                    else if(thiz.checked === 2) {
                        thiz.divOut.swapClassJ(thiz.p.cNameIndeterminateH, thiz.p.cNameIndeterminate);
                    }
                    else {
                        thiz.divOut.swapClassJ(thiz.p.cNameNoCheckH, thiz.p.cNameNoCheck);
                    }
                    thiz.divOut.removeClass("sbxj_hover");  //取消标记高亮
                }
            });
        },
        //#endregion

        //#region 设置选中状态
        setChecked: function (v, isClick, noEvt, param) {
            if(this.disabled) {
                return;
            }
            if(!isClick) {  //非点击选框时过滤状态值并设置input状态
                if(v === 1) {  //转换选中状态值
                    v = true;
                }
                else if(v === 0) {
                    v = false;
                }

                var st;
                if(v === 2) {  //半选中时标记input控件为选中状态
                    st = true;
                }
                else {
                    st = v;
                }
                
                this.input[0].checked = st;  //因在IE9/10下使用attr("checked",oChk[0].checked)的方式设置有问题,现改为直接设置checkbox对象的checked属性
            }

            var isHover = this.divOut.hasClass("sbxj_hover");
            if(v === true) {  //点击复选框时应保持hover状态
                this.divOut.swapClassJ(this.p.cNameNoCheck + " " + this.p.cNameNoCheckH + " " + this.p.cNameIndeterminate + " " + this.p.cNameIndeterminateH, isHover ? this.p.cNameCheckedH : this.p.cNameChecked);
            }
            else if(v === 2) {
                this.divOut.swapClassJ(this.p.cNameChecked + " " + this.p.cNameCheckedH + " " + this.p.cNameNoCheck + " " + this.p.cNameNoCheckH, isHover ? this.p.cNameIndeterminateH : this.p.cNameIndeterminate);
            }
            else {
                this.divOut.swapClassJ(this.p.cNameChecked + " " + this.p.cNameCheckedH + " " + this.p.cNameIndeterminate + " " + this.p.cNameIndeterminateH, isHover ? this.p.cNameNoCheckH : this.p.cNameNoCheck);
            }

            this.checked = v;
            if(this.p.type == "radio" && this.checked === true) {  //需要设置同组的其他单选框状态为未选中
                var g = SBXJ.group[this.name];
                for(var o in g) {
                    if(this.sbxjId != o && g[o].checked) {
                        g[o].setChecked(false, null, true);
                        break;
                    }
                }
            }

            if(!noEvt) {
                this.fire("onChecked", $.extend(true, { checked: v }, param));
            }
        },
        //#endregion

        //#region 设置是否不可用
        setDisabled: function (v) {
            if(this.checked === true) {
                if(v) {
                    this.divOut.swapClassJ(this.p.cNameChecked + " " + this.p.cNameCheckedH, this.p.cNameCheckedDisabled);
                }
                else {
                    this.divOut.swapClassJ(this.p.cNameCheckedDisabled, this.p.cNameChecked);
                }
            }
            else if(this.checked === 2) {
                if(v) {
                    this.divOut.swapClassJ(this.p.cNameIndeterminate + " " + this.p.cNameIndeterminateH, this.p.cNameIndeterminateDisabled);
                }
                else {
                    this.divOut.swapClassJ(this.p.cNameIndeterminateDisabled, this.p.cNameIndeterminate);
                }
            }
            else {
                if(v) {
                    this.divOut.swapClassJ(this.p.cNameNoCheck + " " + this.p.cNameNoCheckH, this.p.cNameNoCheckDisabled);
                }
                else {
                    this.divOut.swapClassJ(this.p.cNameNoCheckDisabled, this.p.cNameNoCheck);
                }
            }

            this.input[0].disabled = v;
            this.disabled = v;
        },
        //#endregion

        //#region 获取选框值
        getValue: function () {
            return this.input.val();
        },
        //#endregion

        //#region 设置选框值
        setValue: function (v) {
            this.input.val(v);
            return this;
        }
        //#endregion
    });

    //#region 静态调用方法
    fj.SBXJ.init = function (settings) {
        return new fj.SBXJ(null, settings);
    };
    //#endregion

    //#region 选框组
    fj.SBXJ.group = {};

    //按组名清除组
    fj.SBXJ.clearGroup = function(group) {
        if(group != null) {
            if(SBXJ.group[group]) {
                delete SBXJ.group[group];
            }
        }
        else {  //不传参数则清除全部组
            fj.SBXJ.group = {};
        }
    };

    //组全选
    fj.SBXJ.allCheck = function(group, checked, noEvt) {
        var g = SBXJ.group[group];
        if(g) {
            if(checked == null) {
                checked = true;
            }
            for(var o in g) {
                g[o].setChecked(checked, null, noEvt);
            }
        }
    };
    //#endregion

    //#region 绑定到jquery
    $.fn.extend({
        SelectBoxJ: function (settings) {
            if(this && this.length > 0) {
                if(this.length == 1) {  //选取到一个元素
                    return new FJ.SelectBoxJ(this, fj.SBXJ_commonConfig ? $.extend(true, fj.clone(fj.SBXJ_commonConfig), settings) : settings);
                }
                else {  //选取到多个元素
                    var re = [];
                    this.each(function(i) {
                        var config = fj.SBXJ_commonConfig ? $.extend(true, fj.clone(fj.SBXJ_commonConfig), settings) : fj.clone(settings);
                        if(config && config.type == "radio" && config.initChecked != null) {
                            if(fj.RX.numZ(config.initChecked)) {  //单选框的默认选中状态取索引值
                                if(config.initChecked == i) {
                                    config.initChecked = true;
                                }
                                else {
                                    config.initChecked = false;
                                }
                            }
                            else {
                                if(config.initChecked == this.id) {  //单选框的默认选中状态取id
                                    config.initChecked = true;
                                }
                                else {
                                    config.initChecked = false;
                                }
                            }
                        }

                        re.push(new FJ.SelectBoxJ($(this), config));
                    });
                    return re;
                }
            }
        },
        SBXJ: function (settings) {
            return $(this).SelectBoxJ(settings);
        },
        setCheckedSBXJ: function (v, noEvt) {  //设置选中状态
            this.each(function() {
                var s = $("#" + this.id + "Q");
                if(s.length > 0) {
                    s[0].sbxj.setChecked(v, null, noEvt);
                }
            });
            return this;
        },
        setDisabledSBXJ: function (v) {  //设置是否不可用
            this.each(function() {
                var s = $("#" + this.id + "Q");
                if(s.length > 0) {
                    s[0].sbxj.setDisabled(v);
                }
            });
            return this;
        },
        setValueSBXJ: function (v) {  //设置选框值
            this.each(function() {
                var s = $("#" + this.id + "Q");
                if(s.length > 0) {
                    s[0].sbxj.setValue(v);
                }
            });
            return this;
        }
    });
    //#endregion

});