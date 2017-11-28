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
* flareJ.FileUpload
*-------*-------*-------*-------*-------*-------*
* 上传控件
*-------*-------*-------*-------*-------*-------*
* [依赖]flareJ.ProgressBar
*----------------------------------------------*/
FJ.define("widget.FileUpload", ["widget.ProgressBar"], function() {
    var FJ,
        fj,
        flareJ = FJ = fj = this.flareJ,
        $ = this.jQuery;

    /************************************************************
    *-----------------------------------------------------------*
    *                         上传控件
    *-----------------------------------------------------------*
    *************************************************************
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    *-----*-----*-----*-----*-----*-----*-----*-----*-----*-----*
    * 
    ************************************************************/
    this.FileUploadJ = this.FUJ = FJ.FileUploadJ = FJ.FUJ = FJ.CJ.extend({
        //#region 构造方法
        init: function (elemObj, settings) {
            //参数
            this._super(elemObj, $.extend(true, {
                fjType: "FUJ",
                fujType: "js",                            /*-------*实现方式*-------*
                                                           * sl:silverlight
                                                           * js:javascript
                                                           *-----*-----*-----*-----*/
                renderTo: elemObj,                        //要加载到的容器
                width: 220,                               //最大宽度
                height: 66,                               //最大高度
                uploadPath: "",                           //上传地址
                getProgressFromServer: false,             //是否从服务器端获取进度信息
                uploadProgressPath: "",                   //获取上传进度地址
                uploadProgressRate: 200,                  //获取上传进度频率
                uploadParam: {},                          //上传参数
                accept: null,                             //选择文件限制mime类型
                isMultiple: false,                        //是否可一次选多个文件
                hasFileNum: true,                         //是否显示文件数
                hideProgress: true,                       //是否隐藏进度条
                hideFooter: true,                         //是否隐藏底部
                bgImgPoc: null,                           //背景图片位置,格式：{ w: 80, h: 80, t: 7, l: 6 }
                bgTxt: "",                                //背景水印字
                selectBtnParam: null,                     //选择文件按钮配置
                progressSubWidth: 118,                    //计算进度条减去的长度
                headCenterSubWidth: 115,                  //计算头部中间容器减去的长度
                footRightSubWidth: 140,                   //计算底部右侧容器减去的长度
                headCaseMarginTop: null,                  //头部容器上边距
                fileListLineHeight: null,                 //文件列表行高
                fileNameRule: "fuj_file_",                //文件name属性规则
                useRandomFileName: false,                 //文件name属性是否使用末尾随机数
                canUploadDrop: true,                      //是否可拖拽上传
                isStopDefaultDrop: true,                  //是否禁止页面默认拖拽事件
                canXhr2: null,                            //是否支持XMLHttpRequest level2
                theme: "xtheme-blue.css",                 //主题
                xapPath: FJ.getRootPath() + "/JsLibrary/flareJ/xap/flareJ.Silverlight.FileUploadJ.xap",  //xap文件路径
                wcfPath: FJ.getRootPath() + "/Services/FUJ/flareJ_FileUploadService.svc",                            //后台wcf路径
                maxFileSizeKB: "",                        //上传文件大小最大值
                maxUploads: "",                           //最大同时上传数
                maxSelects: "",                           //最大选择文件数
                fileFilter: "",                           //上传文件类型过滤值,格式如:(*.jpg;*.jpeg;*.gif)|*.jpg;*.jpeg;*.gif
                bufferSize: "102400",                     //每包大小
                hasBtnUp: false,                          //是否显示开始上传按钮
                hasBtnClear: false,                       //是否显示清空按钮
                hasSpeed: false,                          //是否显示改上传速度
                hasCbxTheme: false,                       //是否显示主题下拉框
                isCheckName: false,                       //是否检测特殊分隔符
                isCheckNameYorN: true,                    //检测有或没有特殊分隔符
                canMultiselect: true,                     //是否可以一次选多个文件
                canImageCrop: true,                       //是否可以截取图片
                isScaleImageCrop: false,                  //截取图片是否按比例
                windowless: true,                         //sl元素是否可以被html元素遮盖
                regImagePixel: "",                        //验证图片分辨率
                spName: "",                               //特殊文件名分隔符
                spNameTip: "",                            //特殊文件名分隔符提示文字
                upParam: "",                              //上传参数
                upParamF: "",                             //上传参数(最后一包时发送)
                exNameS: "",                              //选中该扩展名的文件将执行事件
                uploadType: "wcf",
                borderWidth: 1,                           //外层边框宽度
                hasItemBottom: false,                     //是否有文件项底边线 
                colorParams: {                            //颜色参数
                    bgColor: "#ffffff",                   //背景(#F0F0F0)
                    borderOut: null                       //外层边框(#8797A3)
                },
                evts: {
                    addFile: null,                        //添加文件
                    deleteFile: null,                     //删除文件
                    allFinish: null,                      //全部文件上传完毕
                    selectEx: null                        //选中扩展名事件
                }
            }, settings));

            this.initFn();
            return this;
        },
        //#endregion

        //#region 初始化
        initFn: function () {
            this._super();

            if(this.p.fujType == "sl") {
                this.slCtl = null;  //sl控件对象
            }
            else if(this.p.fujType == "js") {
                if(this.maxSelects == "") {
                    this.maxSelects = 0;
                }

                //是否支持XMLHttpRequest level2
                this.canXhr2 = fj.isFF || (fj.isWebkit && window.FormData) || fj.isIE10;
                if(this.p.canXhr2 != null) {
                    this.canXhr2 = this.p.canXhr2;
                }

                //是否不显示进度文字
                if(!this.canXhr2 && !this.p.getProgressFromServer) {
                    this.hidePbjTxt = true;
                }

                //背景水印字
                if(this.p.canUploadDrop && this.canXhr2) {
                    this.useUploadDD = true;  //是否可使用拖拽上传标记
                    this.p.bgTxt = "您可以将文件拖到此处";
                }
                
                if(this.canXhr2) {
                    this.files = [];  //上传文件集合
                }

                //过滤文件类型集合
                if(this.p.fileFilter != "") {
                    var types = this.p.fileFilter.indexOf("|") != -1 ? this.p.fileFilter.split("|")[1].split(";") : this.p.fileFilter.split(";");
                    this.fileFilters = [];
                    for(var i = 0;i < types.length;i++) {
                        this.fileFilters.push(types[i].substr(2));
                    }
                }
            }

            //是否首次加载
            this.isFirst = false;
            this.create();

            //初始化背景图片
            //this.changeDrawTheme();
            this.show();
        },
        //#endregion

        //#region 构建
        create: function () {
            var thiz = this;
            this._super();

            switch(this.p.fujType) {
                case "sl":
                    this.divOut.append(FJ.SL.create({   //加载到外层
                        id: "FUJ_" + this.objId,
                        xapPath: this.p.xapPath,
                        windowless: this.p.windowless,
                        initParams: 'HttpUploader=' + (this.p.uploadType == "http" ? true : false) + ',Theme=' + this.p.theme + ',MaxFileSizeKB=' + this.p.maxFileSizeKB + ',MaxUploads=' + this.p.maxUploads + ',FileFilter=' + this.p.fileFilter + ',CustomParam=yourparameters,BufferSize=' + this.p.bufferSize + ',UpWcfPath=' + this.p.wcfPath + ',UpParam=' + this.p.upParam + ',UpParamF=' + this.p.upParamF + ',hasBtnUp=' + this.p.hasBtnUp + ',hasBtnClear=' + this.p.hasBtnClear + ',maxSelects=' + this.p.maxSelects + ',hasSpeed=' + this.p.hasSpeed + ',hasCbxTheme=' + this.p.hasCbxTheme + ',isCheckName=' + this.p.isCheckName + ',isCheckNameYorN=' + this.p.isCheckNameYorN + ',spName=' + this.p.spName + ',spNameTip=' + this.p.spNameTip + ',canMultiselect=' + this.p.canMultiselect + ',canImageCrop=' + this.p.canImageCrop + ',isScaleImageCrop=' + this.p.isScaleImageCrop + ',exNameS=' + this.p.exNameS + ',regImagePixel=' + this.p.regImagePixel
                    }));

                    //加入全局FUJ控件集合
                    FUJ.List.push(this);
                    break;
                case "js":
                    this.divOut.addClass("fuj").attr("id", "FUJ_" + this.objId).css({
                        height: this.p.height,
                        width: this.p.width
                    });

                    //背景层
                    this.bgDiv0 = $("<div class='fuj_bg0'></div>");
                    this.bgImg = $('<div class="fuj_bgImg"></div>');
                    if(this.p.bgImgPoc) {
                        this.bgImg.css({
                            width: this.p.bgImgPoc.w,
                            height: this.p.bgImgPoc.h,
                            margin: this.p.bgImgPoc.t + 'px 0 0 ' + this.p.bgImgPoc.l + 'px'
                        });
                    }
                    this.bgDiv0.append(this.bgImg);

                    //水印层
                    this.bgDiv = $("<div class='fuj_bg'></div>");

                    //水印字
                    this.bgTxt = $("<table class='fuj_bgTxt'><tr><td><div>" + this.p.bgTxt + "</div></td></tr></table>");
                    this.bgDiv.append(this.bgTxt);

                    //内容层
                    this.containerDiv = $("<div class='fuj_container'></div>");

                    //头部容器
                    this.header = $('<div class="fuj_header"></div>');
                    this.header_table = $('<table class="fuj_head_table"><tr><td><div class="fuj_header_td1"></div></td><td><div class="fuj_header_td2" style="width:' + (this.p.width - this.p.headCenterSubWidth) + 'px"></div></td><td><div class="fuj_header_td3"></div></td></tr></table>');
                    if(this.p.headCaseMarginTop != null) {
                        this.header_table.find("div").css("margin-top", this.p.headCaseMarginTop);
                    }
                    this.header.append(this.header_table);
                    
                    //体部容器
                    this.body = $('<div class="fuj_body"></div>').width(this.p.width).height(this.p.height - (this.p.hideFooter ? 28 : 56));
                    this.body_form = $('<form method="post" enctype="multipart/form-data" ></form>');
                    this.body_hideFrame = $('<iframe class="fuj_hideFrame" name="fuj_hideFrame_' + this.objId + '" src="" frameborder="0"></iframe>');
                    this.body_form.attr({
                        action: this.p.uploadPath,
                        target: "fuj_hideFrame_" + this.objId
                    });
                    this.body_table = $('<table class="fuj_body_table"></table>').width(this.p.width - 23);
                    this.body.append(this.body_form.append(this.body_table)).append(this.body_hideFrame);

                    //底部容器
                    this.footer = $('<div class="fuj_footer"></div>');
                    this.footer_table = $('<table class="fuj_foot_table"><tr><td><div class="fuj_footer_td1"></div></td><td><div class="fuj_footer_td2"></div></td><td><div class="fuj_footer_td3" style="width:' + (this.p.width - this.p.footRightSubWidth) + 'px"></div></td></tr></table>');
                    this.footer.append(this.footer_table);
                    if(this.p.hideFooter) {  //是否隐藏底部
                        this.footer.hide();
                    }

                    //渲染容器
                    this.divOut.append(this.bgDiv0).append(this.bgDiv).append(this.containerDiv.append(this.header).append(this.body).append(this.footer));

                    //上传浏览按钮
                    this.btnFile = $('<input type="file" style="width:58px;" />');
                    if(this.p.accept) {  //选择文件限制mime类型
                        this.btnFile.attr("accept", this.p.accept);
                    }
                    if(this.p.isMultiple) {  //是否可一次选多个文件
                        this.btnFile.attr("multiple", "multiple");
                    }
                    this.header_table.find("div.fuj_header_td3").append(this.btnFile);
                    this.btnFile.fileCustomStyleJ($.extend(true, {
                        margin: {
                            l: 2
                        },
                        btnText: "选择文件",
                        isShowTxt: false,
                        afterRender: function(btn) {
                            thiz.fileBtn = btn;  //保存选择文件按钮对象
                        }
                    }, this.p.selectBtnParam));

                    //选择文件事件
                    this.btnFile.bind("change", function (e) {
                        thiz.addFile(e, $(this));
                    });

                    //上传按钮
                    this.btnUpload = $('<input type="button" class="pj_btn3 fuj_head2" value="上传" />');
                    this.header_table.find("div.fuj_header_td2").append(this.btnUpload);
                    this.btnUpload.click(function() {
                        thiz.upload();
                    });
                    if(!this.p.hasBtnUp) {
                        this.btnUpload.hide();
                    }

                    //清空按钮
                    this.btnClear = $('<input type="button" class="pj_btn3 fuj_head2" value="清空" style="margin-left:4px;" />');
                    this.header_table.find("div.fuj_header_td2").append(this.btnClear);
                    this.btnClear.click(function() {
                        thiz.clear();
                    });
                    if(!this.p.hasBtnClear) {
                        this.btnClear.hide();
                    }

                    //文件数
                    this.fileNum = $('<span>0</span>');
                    this.fileNumTxt = $('<span>文件数:</span>');
                    this.footer_table.find("div.fuj_footer_td1").append(this.fileNumTxt).append(this.fileNum);
                    if(!this.p.hasFileNum) {
                        this.fileNumTxt.hide();
                        this.fileNum.hide();
                    }

                    //已上传数据大小
                    this.fileUploadSize = $('<span style="margin-right:2px;">0KB</span>').hide();
                    this.footer_table.find("div.fuj_footer_td2").append(this.fileUploadSize);

                    //进度条
                    var pbjElem;
                    if(!this.p.hideFooter) {
                        pbjElem = this.footer_table.find("div.fuj_footer_td3");
                    }
                    else {
                        pbjElem = this.header_table.find("div.fuj_header_td2");
                    }
                    this.pbj = pbjElem.PBJ({
                        width: this.p.width - this.p.progressSubWidth,
                        height: 18,
                        value: 0,
                        max: 100,
                        radius: 5,
                        borderP: 1,
                        hideTxt: this.hidePbjTxt
                    });
                    this.pbj.divOut.addClass("fuj_head2");
                    if(this.p.hideProgress) {
                        this.pbj.display(0);
                    }

                    //注册拖拽上传相关事件
                    if(this.useUploadDD) {
                        //禁止页面默认拖拽事件
                        if(this.p.isStopDefaultDrop) {
                            $(document).bind("dragover", function(e) {
                                e.preventDefault();
                            });
                            $(document).bind("drop", function(e) {
                                e.preventDefault();
                            });
                        }
                        
                        //文件拖放
                        var fnDragHover = function(e, fujObj) {
                            e.stopPropagation();
                            e.preventDefault();

                            if(e.type == "dragover") {
                                fujObj.css({
                                    boxShadow: "inset 2px 2px 4px rgba(0, 0, 0, .5)",
                                    backgroundColor: "#ebebeb",
                                    borderStyle: "dashed"
                                });
                            }
                            else {
                                fujObj.css({
                                    boxShadow: "none",
                                    backgroundColor: thiz.p.colorParams.bgColor,
                                    borderStyle: "dashed"
                                });
                            }
                            return this;
                        };

                        //拖进
                        this.divOut.bind("dragenter", function(e) {
                            e.preventDefault();
                        });

                        //dragover事件一定要清除默认事件，不然会无法触发后面的drop事件
                        this.divOut.bind("dragover", function(e) {
                            fnDragHover(e, thiz.divOut);
                        });
                        this.divOut.bind("dragleave", function(e) {
                            fnDragHover(e, thiz.divOut);
                        });

                        //文件放下
                        this.divOut.bind('drop', function(e) {
                            thiz.divOut.trigger("dragleave");

                            //var fileList = e.originalEvent.dataTransfer.files;
                            //alert(fileList.length);

                            thiz.addFile(e, thiz.header_table.find("input[type=file]"));

//                            if(fileList.length == 1) {
//                                if(fileList[0].type == "application/ms-excel" || fileList[0].type == "application/vnd.ms-excel" || fileList[0].type == "") {
//                                    useNormalUpload = false;
//                                    $("#exFormBase")[0].reset();
//                                    $("#fuj_customStyle_text_excelFileBase").val("");
//                                    $("#exFormTerm")[0].reset();
//                                    $("#fuj_customStyle_text_excelFileTerm").val("");
//                                    oSpan.text(fileList[0].name);
//                                    window.fileBase = fileList[0];
//                                }
//                                else {
//                                    MBJ.alert("提示", "只能上传excel文件。");
//                                }
//                            }
//                            else {
//                                MBJ.alert("提示", "每次只能选择一个文件。");
//                            }
                        });
                    }
                    break;
            }

            return this;
        },
        //#endregion

        //#region 添加文件
        addFile: function (e, targetElem) {
            var thiz = this;

            var n = parseFloat(thiz.fileNum.text());
            if(n < thiz.p.maxSelects || thiz.p.maxSelects == 0) {
                //判断是否拖拽选择文件
                var isDD = false,
                    evt = e.originalEvent,
                    hasTarget = evt.target && evt.target.files,
                    files,
                    fileNames = [],
                    exNames = [],
                    loopNum = 1;

                if(evt.dataTransfer) {
                    isDD = true;
                }
                var setFname = function(fs) {
                    files = fs;
                    loopNum = files.length;
                    for(var i = 0,l = files.length;i < l;i++) {
                        var name = files[i].name;
                        fileNames[i] = name;
                        exNames[i] = name.substr(name.lastIndexOf(".") + 1).toLowerCase();  //获取扩展名
                    }
                };

                //获取文件名、扩展名
                if(!isDD) {
                    if(hasTarget) {
                        setFname(evt.target.files);
                    }
                    else {
                        var fullName = targetElem.val(),
                            name = fullName.substr(fullName.lastIndexOf("\\") + 1);
                        fileNames = [name];
                        exNames = [name.substr(name.lastIndexOf(".") + 1).toLowerCase()];
                    }
                }
                else {
                    setFname(evt.dataTransfer.files);
                }

                //检测文件数
                if((n + loopNum) > thiz.p.maxSelects) {
                    MBJ.alert("提示", "您最多可选择" + thiz.p.maxSelects + "个文件。");
                    return;
                }

                //过滤文件类型
                if(thiz.p.fileFilter != "") {
                    for(var i = 0, l = exNames.length;i < l;i++) {
                        if($.inArray(exNames[i], thiz.fileFilters) == -1) {
                            MBJ.alert("提示", "不能选择类型为" + exNames[i] + "的文件。");
                            return;
                        }
                    }
                }

                for(var i = 0;i < loopNum;i++) {
                    var file, 
                        fileName = fileNames[i],
                        exName = exNames[i];
                    if(files) {
                        file = files[i];
                    }

                    //新建上传文本框
                    var oFileNew = $('<input class="fuj_customStyle_file" type="file" style="width:58px;" />');
                    oFileNew.bind("change", function (e) {
                        thiz.addFile(e, $(this));
                    }).hover(function() {  //重设选择文件按钮悬停样式
                        thiz.fileBtn.addClass("pj_btn_hover");
                    }, function() {
                        thiz.fileBtn.removeClass("pj_btn_hover");
                    });
                    if(thiz.p.accept) {  //选择文件限制mime类型
                        oFileNew.attr("accept", thiz.p.accept);
                    }
                    if(thiz.p.isMultiple) {  //是否可一次选多个文件
                        oFileNew.attr("multiple", "multiple");
                    }
                    thiz.btnFile = oFileNew;

                    var oFileOld = targetElem;
                    oFileOld.after(oFileNew);
                    oFileOld.trigger("mouseleave").unbind().removeClass("fuj_customStyle_file").hide();
                    oFileOld.attr("name", thiz.p.fileNameRule + (thiz.p.useRandomFileName ? n : ""));
                    targetElem = oFileNew;
 
                    if(this.canXhr2) {  //加入上传文件集合
                        this.files.push(file);
                    }

                    //加载数据项
                    (function() {
                        var oItem = $("<tr></tr>");
                        thiz.body_table.append(oItem
                            .append($("<td class='fuj_body_td1'></td>").append('<img src="' + (FJ.imgPath + "FileUpload/filetype/" + exName + ".gif") + '" onerror="this.src=\'' + FJ.imgPath + "FileUpload/filetype/unknown.gif" + '\'" >'))
                            .append($("<td style='width:" + (thiz.p.width - 63) + "px;" + (thiz.p.fileListLineHeight != null ? "line-height:" + thiz.p.fileListLineHeight + "px;" : "") + "'></td>").append(oFileOld).append(fileName))
                            .append($("<td class='fuj_body_td2'></td>").append('<img title="删除" style="cursor:pointer;" src="' + (FJ.imgPath + "FileUpload/delete.gif") + '" >').click(function() {
                                oItem.remove();
                                var n = parseFloat(thiz.fileNum.text());
                                n--;
                                thiz.fileNum.text(n);

                                //清除上传集合中文件
                                if(thiz.canXhr2) {
                                    fj.arr.removeAt(thiz.files, $.inArray(file, thiz.files));
                                }

                                //重排列上传文本框name序号
                                if(thiz.p.useRandomFileName) {
                                    thiz.body_table.find("input[type=file]").each(function(i) {
                                        $(this).attr("name", thiz.p.fileNameRule + (i + 1));
                                    });
                                }

                                //初始化进度条
                                thiz.pbj.clear();

                                //删除文件事件
                                thiz.fire("deleteFile", { fileName: fileName, exName: exName });
                            })));

                        if(!thiz.p.hasItemBottom) {  //是否显示文件项底边线
                            oItem.find("td").css("border-bottom", 0);
                        }
                    })();

                    //选择文件事件
                    thiz.fire("addFile", { fileName: fileName, exName: exName });
                }

                //更新文件数
                thiz.fileNum.text(n + loopNum);

                if(fj.isWebkit) {
                    //解决加载数据项后不显示的bug
                    thiz.divOut.width(thiz.p.width);

                    //解决选择文件按钮位置错误的bug
                    var oBtn = thiz.header_table.find("div.fuj_customStyle_btn");
                    var w = oBtn.width();
                    oBtn.width(w + 1);
                    setTimeout(function() {
                        oBtn.width(w);
                    }, 1);
                }

                //初始化进度条
                thiz.pbj.clear();
            }
            else {
                MBJ.alert("提示", "您最多可选择" + thiz.p.maxSelects + "个文件。");

                if(fj.isIE) {   //清除上传文本框值,否则IE下会出现同一文件无法再选择的问题
                    //新建临时表单用于清除上传文本框值
                    var formTmp = $('<form style="display:none;"></form>').prependTo(this.body).append(this.btnFile);
                    formTmp[0].reset();
                    this.header_table.find("div.fuj_header_td3").prepend(this.btnFile);
                    formTmp.remove();
                }
            }
        },
        //#endregion

        //#region 获取已选文件数
        getFileNum: function () {
            return parseFloat(this.fileNum.text());
        },
        //#endregion

        //#region 清空
        clear: function (notInitPbj) {
            this.fileNum.text(0);
            this.body_table.empty();

            //初始化进度条
            if(!notInitPbj) {
                this.pbj.clear();
            }

            //清空上传集合
            if(this.canXhr2) {
                this.files.length = 0;
            }
        },
        //#endregion

        //#region 上传
        upload: function () {
            var thiz = this;

            if(parseFloat(this.fileNum.text()) > 0) {
                if(this.p.hideProgress) {
                    //if(this.canXhr2 || (!this.canXhr2 && this.p.getProgressFromServer)) {
                    this.pbj.display(1);
                    //}
                }
                this.pbj.clear();

                if(!this.canXhr2) {  //表单方式上传
                    //设置获取进度唯一标识
                    var progressGuid = new Date().getTime() + Math.random().toFixed(6).substr(2);
                    var actionTmp = this.body_form.attr("action");
                    var action = actionTmp + (actionTmp.indexOf("?") == -1 ? "?" : "&") + "progressGuid=" + progressGuid;

                    if(this.p.uploadParam) { //上传参数
                        for(var o in this.p.uploadParam) {
                            action += "&" + o + "=" + this.p.uploadParam[o];
                        }
                    }

                    //提交
                    this.body_form.attr("action", action);
                    this.body_form[0].submit();
                    this.body_form.attr("action", actionTmp);

                    //获取进度
                    if(this.p.getProgressFromServer) {  //从服务器获取真实进度
                        this.uploadProgress(progressGuid);
                    }
                    else {  //自动开始模拟进度条
                        this.pbj.start();
                    }
                }
                else {  //ajax方式上传
                    var xhr = new XMLHttpRequest();

                    xhr.onload = function(e){
                        thiz.pbj.setValue(100, !fj.isSafari ? 50 : null);
                        thiz.uploadFinish(xhr.responseText);
                    };
                    xhr.error = function(e){
                        thiz.fire("uploadError", { error: e });  //上传错误事件
                    };
            
                    //#region 进度事件
                    xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            bytesUploaded = evt.loaded;
                            bytesTotal = evt.total;

                            var percentComplete = Math.round(evt.loaded * 100 / evt.total);
        //                    var bytesTransfered = '';
        //                    if (bytesUploaded > 1024*1024)
        //                        bytesTransfered = (Math.round(bytesUploaded * 100/(1024*1024))/100).toString() + 'MB';
        //                    else if (bytesUploaded > 1024)
        //                        bytesTransfered = (Math.round(bytesUploaded * 100/1024)/100).toString() + 'KB';
        //                    else
        //                        bytesTransfered = (Math.round(bytesUploaded * 100)/100).toString() + 'Bytes';

        //                document.getElementById('progressNumber').innerHTML = percentComplete.toString() + '%';
        //                document.getElementById('progressBar').style.width = (percentComplete * 3.55).toString() + 'px';
        //                document.getElementById('transferBytesInfo').innerHTML = bytesTransfered;

                            thiz.pbj.setValue(percentComplete);  //此处如果设置进度条动画效果,则在有些浏览器下进度每次会走得很少
                            if (percentComplete == 100) {
        //                    document.getElementById('progressInfo').style.display = 'none';
        //                    var uploadResponse = document.getElementById('uploadResponse');
        //                    uploadResponse.innerHTML = '<span style="font-size: 18pt; font-weight: bold;">Please wait...</span>';
        //                    uploadResponse.style.display = 'block';
                            }
                        }
        //                else {
        //                    document.getElementById('progressBar').innerHTML = 'unable to compute';
        //                }
                    }, false);
                    //#endregion
            
                    xhr.open("post", this.p.uploadPath, true);

                    if (window.FormData) {
                        var formData = new FormData();

                        //文件
                        for(var i = 0;i < this.files.length;i++) {
                            formData.append(this.p.fileNameRule + (this.p.useRandomFileName ? (i + 1) : ""), this.files[i]);
                        }

                        //其他参数
                        for(var o in this.p.uploadParam) {
                            formData.append(o, this.p.uploadParam[o]);
                        }

                        data = formData;
                        xhr.send(data);
                    }
                    else if(this.files[0].getAsBinary) {  //firefox3.6+，新版ff没有这个方法
                        var boundary = '-----------------------' + new Date().getTime();
                        var crlf = "\r\n";
                        xhr.setRequestHeader('Content-Type', 'multipart/form-data; boundary=' + boundary);
                        data = "--" +
                            boundary +
                            (function() {  //文件
                                var str = "";
                                for(var i = 0;i < thiz.files.length;i++) {
                                    str += crlf +
                                        "Content-Disposition: form-data; " +
                                        "name=\"" +
                                        thiz.p.fileNameRule + (thiz.p.useRandomFileName ? (i + 1) : "") +
                                        "\"; " +
                                        "filename=\"" +
                                        unescape(encodeURIComponent(thiz.files[i].name)) +
                                        "\"" +
                                        crlf +
                                        "Content-Type: " + thiz.files[i].type +
                                        crlf +
                                        crlf +
                                        thiz.files[i].getAsBinary() +
                                        crlf +
                                        "--" +
                                        boundary;
                                }
                                return str;
                            })()
                            +
                            (function() {  //其他参数
                                var str = "";
                                for(var o in thiz.p.uploadParam) {
                                    str += crlf +
                                        "Content-Disposition: form-data; " +
                                        "name=\"" + o + "\"" +
                                        crlf +
                                        crlf +
                                        thiz.p.uploadParam[o] +
                                        crlf +
                                        "--" +
                                        boundary;
                                }
                                return str;
                            })()
                            +
                            "--";

                        xhr.sendAsBinary(data);
                    }
                }
            }
            else {
                MBJ.alert("提示", "请选择文件后上传。");
            }

            return this;
        },
        //#endregion

        //#region 获取上传进度
        uploadProgress: function (progressGuid) {
            var thiz = this;

            setTimeout(function() {
                $.ajax({
                    type: "GET",
                    url: thiz.p.uploadProgressPath,
                    data: {
                        "progressGuid": progressGuid
                    },
                    dataType: "json",
                    cache: false,
                    success: function(data) {
                        thiz.pbj.setValue(data.rate, 50);

                        var rate = parseFloat(data.rate);
                        if(rate >= 100) {  //上传完毕
                            thiz.uploadFinish();
                        }
                        else if(rate == -1) {  //错误
                            thiz.pbj.clear();
                            MBJ.alert("提示", "获取进度错误!");
                        }
                        else {
                            thiz.uploadProgress(progressGuid);
                        }
                    }
                });
            }, thiz.p.uploadProgressRate);
        },
        //#endregion

        //#region 上传完毕
        uploadFinish: function (text) {
            //清空进度条
            this.pbj.clear();
            if(this.p.hideProgress) {
                this.pbj.display(0);
            }

            //清空上传列表
            this.clear(true);

            //上传完毕事件
            this.fire("allFinish", { data: text });
        },
        //#endregion

        //#region 显示
        show: function () {
            this.isFirst = true;
            return this._super();
        },
        //#endregion

        //#region 关闭
        close: function () {
            if(this.p.fujType == "sl") {
                for (var i = 0; i < FUJ.List.length; i++) {   //从全局FUJ控件集合中删除
                    if (FUJ.List[i].objId == this.objId) {
                        fj.arr.removeAt(FUJ.List, i);
                        break;
                    }
                }
            }

            this._super();
        },
        //#endregion

        //#region 更新控件主题
        changeDrawTheme: function () {
            //this.bgImg.attr("src", fj.themeFolder + "image/fuj/dragfile.gif");  //更新背景图片
        }
        //#endregion
    });

    //#region 静态成员

    //#region 静态调用方法
    FJ.FUJ.show = function (settings) {
        return new FJ.FUJ(FJ.oBody, settings).show();
    };
    //#endregion

    //#region 初始化sl参数
    FJ.FUJ.currentTheme = "xtheme-black.css";  //主题
    FJ.FUJ.params = { type: "tongzhi" };       //自定义参数
    //#endregion

    //#region 全局FUJ控件集合
    FJ.FUJ.List = [];
    //#endregion

    //#endregion

    //#region 上传控件加载完毕事件
    this.pluginLoaded = function (sender) {
        var initE = false;
        for (var i = 0; i < FUJ.List.length; i++) {
            if (FUJ.List[i].isFirst) {
                FUJ.List[i].isFirst = false;
                if (FUJ.List[i].slCtl == null) {
                    initE = true;
                }
            }
            else {
                initE = true;
            }

            if (initE) {
                (function (fuj) {
                    //初始化sl控件对象
                    fuj.slCtl = $("#FUJ_" + fuj.objId)[0];

                    //注册事件
                    fuj.slCtl.Content.Files.FileAdded = function () {       //添加文件
                        if (fuj.p.evts.addFile != null)
                            fuj.fire("addFile");
                    };
                    fuj.slCtl.Content.Files.FileRemoved = function () {     //删除文件
                        if (fuj.p.evts.deleteFile != null)
                            fuj.fire("deleteFile");
                    };
                    fuj.slCtl.Content.Files.AllFilesFinished = function () {     //全部文件上传完毕
                        if (fuj.p.evts.allFinish != null)
                            fuj.fire("allFinish");
                    };
                    fuj.slCtl.Content.Control.ExNameEvent = function (fName) {     //选中扩展名事件
                        if (fuj.p.evts.selectEx != null)
                            fuj.fire("selectEx", { fName: fName });
                    };

                    //注册控制方法
                    fuj.fnS = function () {                                         //开始上传
                        fuj.slCtl.Content.Files.StartUpload();
                    };
                    fuj.fnC = function () {                                         //清空上传列表
                        fuj.slCtl.Content.Files.Clear();
                        fuj.slCtl.Content.Files.TotalUploadedFiles = 0;  //清空已上传数
                    };
                    fuj.fnT = function (themeName) {                              //更换上传控件主题
                        fuj.slCtl.Content.Control.ChangeTheme(themeName);
                    };
                    fuj.fnAP = function (param) {                              //修改参数
                        fuj.slCtl.Content.Control.AlterParamF(param);
                    };
                    fuj.listName = fuj.slCtl.Content.Files.listFileName;        //上传完毕的文件名列表
                })(FUJ.List[i]);
            }
        }
    };
    //#endregion

    //#region 绑定到jquery
    $.fn.extend({
        FileUploadJ: function (settings) {
            if(this && this.length > 0) {
                return new FJ.FileUploadJ(this, fj.FUJ_commonConfig ? $.extend(true, fj.clone(fj.FUJ_commonConfig), settings) : settings);
            }
        },
        FUJ: function (settings) {
            return $(this).FileUploadJ(settings);
        }
    });
    //#endregion

});