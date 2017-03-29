
  var originalConsole = console;
  var console = originalConsole;
  var isReadPlatformInfo = false;

  function __read_platform_info() {
  if (isReadPlatformInfo) {
      return;
  }

  isReadPlatformInfo = true;
  var ua = navigator.userAgent;
  alert(ua);
  if (ua.indexOf("iPhone") > 0) {
      Internal.isIOS = true;
  }
  else if (ua.indexOf("Android") > 0) {
      Internal.isAndroid = true;
  }
  else if (ua.indexOf("Windows Phone") > 0) {
      Internal.isWinOS = true;
  }

  if (ua.indexOf("Youth_CtripWireless") > 0) {
      Internal.isMeiweiApp = true;
  }
  }

  /**
  * @brief app回调bridge.js
  * @description 将native的callback数据转换给H5页面的app.callback(JSON)
  * @method __bridge_callback
  * @param {String} param native传给H5的字符串,该字符串在app组装的时候做过URLEncode
  * @since v5.2
  * @author jimzhao
  */
  function client_callback(param) {
  param = CtripTool.ctripParamDecode(param);
  var jsonObj = JSON.parse(param);
  if (jsonObj != null) {
  alert(param);
      //所有的业务回调都在这里处理
      if (jsonObj.service && jsonObj.action){
        if (jsonObj.service == "app"){
          if ( jsonObj.action == "do_uploadAppInfo" && jsonObj.param.deviceid){
            __read_platform_info();
            Internal.isInApp = true;
            Internal.appVersion = jsonObj.param.appver;
            Internal.apiVersion = jsonObj.param.jkversion;
            Internal.token = jsonObj.param.token;
          }

        }else if (jsonObj.service == "share") {

        }else if (jsonObj.service == "business") {

        }

      }
            //  if (jsonObj.callback_action) {
            // var paramString = Internal.makeParamString(jsonObj.service, jsonObj.callback_action, jsonObj.param, "");
            // Client.callback(paramString);
            return true;
          }
          return false;
        };
  var base64EncodeChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  var base64DecodeChars = new Array(-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1);

  /**
  * @class CtripTool
  * @brief 工具类
  * @description 工具类,和App无交互，纯JS处理
  */
  var CtripTool = {

  /**
   * @brief 判断当前是否是在App内
   * @description  判断当前H5页面是否是在App内
   * @since 5.2
   * @method app_is_in_ctrip_app
   * @author jimzhao
   * @return bool, true代表在app环境，false表示不在app环境
   * @example

   * var ret = CtripTool.app_is_in_ctrip_app();
   * alert("isInApp=="+ret);
   */
  app_is_in_ctrip_app:function() {
      if (Internal.isInApp) {
          return true;
      }

      var isInCtripApp = false;

       var ua = navigator.userAgent;
       if (ua.indexOf(__USER_AGENT_FLAG)>0) {
          isInCtripApp = true;
       }

      return isInCtripApp;
  },

     //编码的方法
  _base64encode:function(str) {
     var out, i, len;
     var c1, c2, c3;
     len = str.length;
     i = 0;
     out = "";
     while(i < len) {
     c1 = str.charCodeAt(i++) & 0xff;
     if(i == len)
     {
         out += base64EncodeChars.charAt(c1 >> 2);
         out += base64EncodeChars.charAt((c1 & 0x3) << 4);
         out += "==";
         break;
     }
     c2 = str.charCodeAt(i++);
     if(i == len)
     {
         out += base64EncodeChars.charAt(c1 >> 2);
         out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
         out += base64EncodeChars.charAt((c2 & 0xF) << 2);
         out += "=";
         break;
     }
     c3 = str.charCodeAt(i++);
     out += base64EncodeChars.charAt(c1 >> 2);
     out += base64EncodeChars.charAt(((c1 & 0x3)<< 4) | ((c2 & 0xF0) >> 4));
     out += base64EncodeChars.charAt(((c2 & 0xF) << 2) | ((c3 & 0xC0) >>6));
     out += base64EncodeChars.charAt(c3 & 0x3F);
     }
     return out;
  },

  //解码的方法
  _base64decode:function(str) {
     var c1, c2, c3, c4;
     var i, len, out;
     len = str.length;
     i = 0;
     out = "";
     while(i < len) {

     do {
         c1 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
     } while(i < len && c1 == -1);
     if(c1 == -1)
         break;

     do {
         c2 = base64DecodeChars[str.charCodeAt(i++) & 0xff];
     } while(i < len && c2 == -1);
     if(c2 == -1)
         break;
     out += String.fromCharCode((c1 << 2) | ((c2 & 0x30) >> 4));

     do {
         c3 = str.charCodeAt(i++) & 0xff;
         if(c3 == 61)
         return out;
         c3 = base64DecodeChars[c3];
     } while(i < len && c3 == -1);
     if(c3 == -1)
         break;
     out += String.fromCharCode(((c2 & 0XF) << 4) | ((c3 & 0x3C) >> 2));

     do {
         c4 = str.charCodeAt(i++) & 0xff;
         if(c4 == 61)
         return out;
         c4 = base64DecodeChars[c4];
     } while(i < len && c4 == -1);
     if(c4 == -1)
         break;
     out += String.fromCharCode(((c3 & 0x03) << 6) | c4);
     }
     return out;
  },

  _utf16to8:function(str) {
     var out, i, len, c;
     out = "";
     len = str.length;
     for(i = 0; i < len; i++) {
     c = str.charCodeAt(i);
     if ((c >= 0x0001) && (c <= 0x007F)) {
         out += str.charAt(i);
     } else if (c > 0x07FF) {
         out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
       out += String.fromCharCode(0x80 | ((c >>  6) & 0x3F));
       out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
   } else {
       out += String.fromCharCode(0xC0 | ((c >>  6) & 0x1F));
       out += String.fromCharCode(0x80 | ((c >>  0) & 0x3F));
   }
   }
   return out;
  },

  _utf8to16:function(str) {
   var out, i, len, c;
   var char2, char3;
   out = "";
   len = str.length;
   i = 0;
   while(i < len) {
   c = str.charCodeAt(i++);
   switch(c >> 4)
   {
     case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
       // 0xxxxxxx
       out += str.charAt(i-1);
       break;
     case 12: case 13:
       // 110x xxxx   10xx xxxx
       char2 = str.charCodeAt(i++);
       out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
       break;
     case 14:
       // 1110 xxxx  10xx xxxx  10xx xxxx
       char2 = str.charCodeAt(i++);
       char3 = str.charCodeAt(i++);
       out += String.fromCharCode(((c & 0x0F) << 12) |
                      ((char2 & 0x3F) << 6) |
                      ((char3 & 0x3F) << 0));
       break;
   }
   }
   return out;
  },

  /**
   * @description Base64 encode(UTF8编码)，JS实现
   * Base64 encode(UTF8编码)，JS实现
   * @brief Base64 encode(UTF8编码)，JS实现，立即返回数据
   * @method base64Encode
   * @since version 6.2
   * @author jimzhao
   * @example

      CtripTool.base64Encode("xxxx");
   */
  base64Encode:function(src) {
  return this._base64encode(this._utf16to8(src));
  },

  /**
   * @description Base64 decode(UTF8编码)，JS实现
   * Base64 decode(UTF8编码)，JS实现
   * @brief Base64 decode(UTF8编码)，JS实现，立即返回数据
   * @method base64Decode
   * @since version 6.2
   * @author jimzhao
   * @example

      CtripTool.base64Decode("xxxx");
   */
  base64Decode:function(src) {
  return this._utf8to16(this._base64decode(src));
  },

  ctripParamDecode:function(param) {
  param = decodeURIComponent(param);
  return param;
  },

  ctripParamEncode:function(param) {
  param = encodeURIComponent(param);
  return param;
  }

  };

  var __IS_BASE64_ENCODE_VERSION = false;
  var __USER_AGENT_FLAG = "CtripWireless_";
  /**
  * @class Internal
  * @description bridge.js内部使用的工具类
  * @brief 内部使用工具类
  * @private
  */
  var Internal = {
  /**
   * @brief 是否是iOS设备
   * @description  bridge.js内部使用，判断是否是iOS
   * @type Bool
   * @property isIOS
   */
  isIOS:false,

  /**
   * @brief 是否是Android设备
   * @description  bridge.js内部使用，判断是否是Android设备
   * @type Bool
   * @property isAndroid
   */
  isAndroid:false,

   /**
   * @brief 是否是WinPhone设备
   * @description  bridge.js内部使用，判断是否是Windows Phone设备
   * @type Bool
   * @property isWinOS
   */
  isWinOS:false,

  /**
   * @brief 当前是否是App环境
   * @description  bridge.js内部使用，判断当前是否是App环境
   * @type Bool
   * @property isInApp
   */
  isInApp:false,

  /**
   * @brief 当前App版本
   * @description bridge.js内部使用，存储当前App版本
   * @type String
   * @property appVersion
   */
  appVersion:"",

  /**
   * @brief 当前操作系统版本
   * @description bridge.js内部使用，存储当前操作系统版本
   * @type String
   * @property osVersion
   */
  osVersion:"",

  /**
   * @brief 当前App是否是青春版
   * @description bridge.js内部使用，判断是否是青春版
   * @type String
   * @property isMeiweiApp
   */
  isMeiweiApp:false,

  /**
   * @brief 当前API版本
   * @description bridge.js内部使用，存储当前操作系统版本
   * @type String
   * @property apiVersion
   */
  apiVersion:"",

  /**
   * @brief 当前app登陆用户的token
   * @description bridge.js内部使用，存储当前操作系统版本
   * @type String
   * @property token
   */
  token:"",
  /**
   * @brief 判断版本大小
   * @description 判断当前版本号是否大于传入的版本号
   * @param {String} verStr 版本号
   * @method isAppVersionGreatThan
   * @return {Bool} 是否大于该版本号
   * @since v5.2
   * @example

   * var isLarger = isAppVersionGreatThan("5.2"); <br />
   * alert(isLarger); // depends
   */
  isAppVersionGreatThan:function(verStr) {
      if (Internal.isMeiweiApp) { //青春版不做校验
          return true;
      }

      if ((typeof verStr == "string") && (verStr.length > 0) && Internal.appVersion) {
          var fInVerStr = verStr.replace(/\./g,'');
          var fNowVerStr = Internal.appVersion.replace(/\./g,'');

          var inVer = parseFloat(fInVerStr);
          var nowVer = parseFloat(fNowVerStr);
          if (isNaN(nowVer) || nowVer - inVer >= 0) {
              return true;
          }
      }

      return false;
  },

   /**
   * @brief 判断API是否支持
   * @description 判断API是否支持当前版本
   * @param {String} verStr 版本号
   * @method isSupportAPIWithVersion
   * @return {Bool} 是否支持该API
   * @since v5.2
   * @example

   * var isSupport = isSupportAPIWithVersion("5.2"); <br />
   * alert(isSupport); // depends
   */
  isSupportAPIWithVersion:function(verStr) {
      return true;
      if ((verStr != null) && (!Internal.isAppVersionGreatThan(verStr))) {
          Internal.appVersionNotSupportCallback(verStr);
          return false;
      }
      return true;
  },

  /**
   * @brief app版本过低回调
   * @description 回调H5页面，告知API开始支持的版本号及当前App的版本
   * @param {String} supportVer API支持的版本号
   * @method appVersionNotSupportCallback
   * @since v5.2
   * @author jimzhao
   */
  appVersionNotSupportCallback:function(supportVer) {
      var jsonObj = {"tagname":"app_version_too_low","start_version":supportVer,"app_version":Internal.appVersion};
      CtripTool.app_log(JSON.stringify(jsonObj));
      Client.callback(jsonObj);
  },

  /**
   * @brief 参数错误回调
   * @description 回调H5页面，所调用的JS 参数有错误
   * @param {String} description 错误原因描述
   * @method paramErrorCallback
   * @since v5.2
   * @author jimzhao
   */
  paramErrorCallback:function(description) {
      var jsonObj = {"tagname":"app_param_error","description":description};
      CtripTool.app_log(JSON.stringify(jsonObj));
      Client.callback(jsonObj);
  },

  /**
   * @brief 判断字符串是否为空
   * @description 判断字符串是否为空
   * @method isNotEmptyString
   * @param {String} str 需要判断的字符串
   * @since v5.2
   */
  isNotEmptyString:function(str) {
      if ((typeof str == "string") && (str.length > 0)) {
          return true;
      }

      return false;
  },

  /**
   * @brief 内部组装URL参数
   * @description  内部使用，组装URL参数
   * @return 返回序列化之后的字符串
   * @method makeParamString
   * @param {String} service app响应的plugin的名字
   * @param {String} action 该plugin响应的函数
   * @param {JSON} param 扩展参数，json对象
   * @param {String} callbackTag app回调给H5页面的tagname
   * @since v5.2
   */
  makeParamString:function(service, action, param, callbackTag) {

      if (!Internal.isNotEmptyString(service) || !Internal.isNotEmptyString(action)) {
          return "";
      }

      if (!param) {
          param = {};
      };
      var paramJSONObj = {};
      paramJSONObj.service = service;
      paramJSONObj.action = action;
      paramJSONObj.param = param;
      paramJSONObj.callback_action = callbackTag;

      return JSON.stringify(paramJSONObj);
  },
   /**
   * @brief JS调用Win8 native
   * @description  内部使用，用于js调用win8
   * @param {String} 传递给win8的参数
   * @method callWin8App
   * @since v5.3
   */
  callWin8App:function(paramString) {
      window.external.notify(paramString);
  },

   /**
   * @brief 内部调用native API
   * @description  内部使用，调用native API
   * @param {String} moduleName 需要处理业务逻辑的模块名，对应native的ClassName
   * @param {String} nativeApiName 需要处理业务逻辑的函数名，对应native的MethodName
   * @param {JSON} params 传递给函数的业务参数
   * @param {String} tagName 业务处理完成，返回callback的名字
   * @method callWin8App
   * @since v5.3
   */
  callNative:function(moduleName, nativeApiName, params, tagName) {
      if (!moduleName || !nativeApiName) {
          alert("param Error:["+moduleName+"],["+nativeApiName+"]")
          return;
      }
      var paramString = Internal.makeParamString(moduleName, nativeApiName, params, tagName)
      Client.callback(paramString);
  },
  /**
     * @brief 内部URL跳转
     * @description 内部隐藏iframe，做URL跳转
     * @method loadURL
     * @param {String} url 需要跳转的链接
     * @since v5.2
     */
    loadURL:function(url) {
        if (url.length == 0) {
            return;
        }

        var iframe = document.createElement("iframe");
        var cont = document.body || document.documentElement;

        iframe.style.display = "none";
        iframe.setAttribute('src', url);
        cont.appendChild(iframe);

        setTimeout(function(){
            iframe.parentNode.removeChild(iframe);
            iframe = null;
        }, 200);
    },
  };

  /**
  * @class Client
  * @description bridge.js内部使用的工具类
  * @brief 内部使用工具类
  * @private
  */
  var Client = {
  /**
   * @description Native收集用户行为,该日志会被上传
   * H5页面调用该函数，需要将增加的event_name告知native，native需要整理纪录
   * @brief 收集ActionLog
   * @method app_log_event
   * @param {String} event_name 需要纪录的事件名
   * @since v5.2
   * @author jimzhao
   * @example

      CtripBusiness.app_log_event('GoodDay')
   */
  app_log_event:function(event_name) {
      if (Internal.isNotEmptyString(event_name)) {
          var params = {};
          params.event = event_name;
          var paramString =  Internal.makeParamString("Util", "logEvent", params, "log_event");

      if (Internal.isIOS) {
          window.webkit.messageHandlers.log.postMessage(paramString);
      }
      else if (Internal.isAndroid){
           window.app.callback(paramString);
      }
      else if (Internal.isWinOS) {
          Internal.callWin8App(paramString);
      }
      }
  },
  /**
   * @brief 内部调用native API
   * @description  内部使用，调用native 回调方法
   * @param {JSON} jsonObj 传递给函数的业务参数
   * @since v5.3
   */
  callback:function(jsonObj) {
          if (!jsonObj) {
          alert("param Error");
          return;
      }
      if (Internal.isIOS) {
          window.webkit.messageHandlers.app.postMessage(jsonObj);
      }
      else if (Internal.isAndroid){
           window.app.callback(jsonObj);
      }
      else if (Internal.isWinOS) {
          Internal.callWin8App(jsonObj);
      }
  },


  };

  /**
  * @class CtripBusiness
  * @description Ctrip业务相关，需要返回数据给H5页面
  * @brief Ctrip业务相关，需要返回数据给H5页面
  */
  var CtripBusiness = {
  /**
   * @description 检查App的版本更新
   * @brief 检查App的版本更新
   * @since v5.2
   * @method app_check_update
   * @author jimzhao
   * @example

   CtripBusiness.app_check_update();
   *
   */
  app_check_update:function() {
      var paramString = Internal.makeParamString("Util", "checkUpdate", null, "check_update");
      Client.callback(paramString);
  },

  /**
   * @description 调用App的分享
   * @brief 调用App的分享(Moved to CtripShare)
   * @param {String} imageRelativePath 将要分享的图片相对路径，相对webapp的路径
   * @param {String} text 需要分享的文字,微博分享文字限制在140
   * @param {String} title 需要分享的标题, v5.4开始支持该字段，微信和email支持；
   * @param {String} linkUrl 需要分享的链接, v5.4开始支持该字段
   * @method app_call_system_share
   * @since v5.3
   * @author jimzhao
    @example

    参考CtripShare.app_call_system_share(....);
   */
  app_call_system_share:function(imageRelativePath, text, title, linkUrl) {
      CtripShare.app_call_system_share(imageRelativePath, text, title, linkUrl);
  },

  /**
   * @description Native收集用户行为,该日志会被上传
   * H5页面调用该函数，需要将增加的event_name告知native，native需要整理纪录
   * @brief 收集ActionLog
   * @method app_log_event
   * @param {String} event_name 需要纪录的事件名
   * @since v5.2
   * @author jimzhao
   * @example

      CtripBusiness.app_log_event('GoodDay')
   */
  app_log_event:function(event_name) {
      if (Internal.isNotEmptyString(event_name)) {
          var params = {};
          params.event = event_name;
          var paramString =  Internal.makeParamString("Util", "logEvent", params, "log_event");

          if (Internal.isIOS) {
              var url = Internal.makeURLWithParam(paramString);
              Internal.loadURL(url);
          }
          else if (Internal.isAndroid) {
              window.Util_a.logEvent(paramString);
          }
          else if (Internal.isWinOS) {
              Internal.callWin8App(paramString);
          }
      }
  },

   /**
   * @description 获取设备相关信息，相关部门需要
   * @brief 获取设备相关信息，相关部门需要
   * @method app_get_device_info
   * @since v5.7
   * @author jimzhao
   * @example

      CtripBusiness.app_get_device_info()
      调用之后，返回数据

      var json_obj = {
          tagname:"get_device_info",
          param: {
              IP:"",
              OS:"\U82f9\U679c",
              account:"",
              areaCode:"",
              baseStation:"",
              clientID:12933032900000135327,
              latitude:0,
              longitude:0,
              mac:"10:DD:B1:CF:C1:80",
              port:"",
              wifiMac:""
          }
      };

      app.callback(json_obj);
   */
  app_get_device_info:function() {
      if (!Internal.isSupportAPIWithVersion("4.3")) {
          return;
      }

      var paramString = Internal.makeParamString("Business", "getDeviceInfo", null, "get_device_info");
      Client.callback(paramString);
  },

  /**
   * @description hybrid调用Native业务通用接口
   * @brief  hybrid调用Native业务通用接口
   * @method app_do_business_job
   * @param {int} businessType 业务类型，1=公共相关，2=酒店，3=机票，4=支付,5=火车票,6=攻略
   * @param {String} businessCode 业务方hybrid和native开发人员协商定义
   * @param {JSON} jsonParam hybrid传给Native的数据，JSON对象
   * @param {String} sequenceId 调用的序列号，调用该API时，如果native需要异步处理(比如发送网络请求)的，hybrid需要设置该值,可以取当前timestamp. native处理完成，会在回调的数据里面带回该字段
   * @author jimzhao
   * @since v6.0
   * @example
   *
   *
      //调用API
      CtripBusiness.app_do_business_job(1, 10001, {aa:'aa_value',bb:'bb_value'}, 1111111);

      //回调数据
      var json_obj = {
          tagname:"do_business_job",
          error_code:"(-201) businessType不支持",//error_code,失败的时候才有error_code
          param:{
              sequenceId:"1111111",
              xxbusinessObj:{}, //自定义数据
              yy:32232332       //自定义数据

          }//param内容不固定，native／hybrid人员定义
       };

      // error_code定义：
      // (-201) businessType不支持
      // (-202) businessCode不支持
      // (-203) 业务处理失败
      // (-204)＋其它业务自定义错误

       app.callback(json_obj);
   */
  app_do_business_job:function(businessType, businessCode, jsonParam, sequenceId) {
      if (!Internal.isSupportAPIWithVersion("4.3")) {
          return;
      }

      var params = {};
      params.businessType = businessType;
      params.businessCode = businessCode;
      params.jsonParam = jsonParam;
      params.sequenceId = sequenceId;

      var paramString = Internal.makeParamString("Business", "doBusinessJob", params, "do_business_job");
      Client.callback(paramString);
  },

   /**
   * @description 获取安装包渠道信息
   * @brief  获取安装包渠道信息
   * @method app_get_channel_info
   * @callback get_channel_info
   * @author jimzhao
   * @since v6.2
   * @example
   *
   *
      //调用API
      CtripBusiness.app_get_channel_info();

      //回调数据
      var json_obj = {
          tagname:"get_channel_info",
          param:{
              alianceId:"1111111",
              ouId:"xxxxx",
              sourceId:"32232332",
              telephone:"40088888888",
              sId:"32232332"
          }
       };
  */
  app_get_channel_info:function() {
      if (!Internal.isSupportAPIWithVersion("4.3")) {
          return;
      }
      var paramString = Internal.makeParamString("Business", "getChannelInfo", null, "get_channel_info");
      Client.callback(paramString);
  },
  };

  /**
  * @class CtripShare
  * @description 调用native的第三方分享

   通用参数，
   1. 分享平台(shareType)定义

   WeixinFriend------微信好友
   WeixinCircle----微信朋友圈
   SinaWeibo---------新浪微博
   QQ----------------QQ
   QQZone------------QQ空间
   SMS---------------短信
   Email-------------邮件
   Copy--------------复制
   OSMore------------系统更多分享


   2.分享error_code定义
   // (-201)分享失败
   // (-202)分享被取消
   // (-203)分享参数有错误

   3. 分享类型说明
   分享类型总共分为3中
   a. 链接分享——————QQ好友、QQ空间、微信好友、微信朋友圈
   b. 图片分享——————QQ好友、微信好友、微信朋友圈、微博、邮件
   c. 文本分享——————所有平台均支持
   d.分享优先级  链接分享>图片分享>纯文本分享

   4. 分享参数说明
   分享参数总共4个，linkUrl，imageUrl(native为imagePath或者image对象), title, text;
   a.linkUrl， 分享链接的URL，有该参数时，分享控件定义为链接分享；
   b. imageUrl，  分享图片的URL，没有linkUrl的，有imageUrl参数的时候，当做图片分享；
   c.title，分享的标题
   d.text 分享的内容

   4. 分享规则

   微信(微信朋友/微信朋友圈) 分享说明：（第三方接口支持：链接分享、图片分享、文本分享）（最低要求title，text：title长度不能超过512字节  text长度不能超过1K image大小不能超过32K）

   如果有linkUrl，会被当作链接分享
   如果没有linkUrl，有图片，当作图片分享
   如果没有linkUrl，没有图片，当作纯文本分享；

   1. 链接分享，如果未传图片，则使用携程App Icon做分享链接的缩略图；image，linkUrl，titie，text有效；
   2. 图片分享，image，title，text有效；
   3. 纯文本分享，title和text有效；
   注意：当链接分享时候，如果BU没提供本地image而是提供了imageURL，我们会去下载，最多10秒，如果超时或者失败使用默认图片

   QQ好友 分享说明：（第三方接口支持：链接分享、图片分享、文本分享）（最低要求title，text）

   如果有linkUrl，会被当作链接分享
   如果没有linkUrl，有图片，当作图片分享
   如果没有linkUrl，没有图片，当作纯文本分享；

   1. 链接分享，如果未传图片，则使用携程App Icon做分享链接的缩略图；image，linkUrl，titie，text有效；
   2. 图片分享，image，title，text有效；
   3. 纯文本分享，title和text有效；
   注意：当图片分享时候，如果BU没提供本地image而是提供了imageURL，我们会去下载，最多10秒，如果超时或者失败降级为纯文本分享

   QQ空间  分享说明:（第三方接口支持：链接分享）（最低要求title，message，webpageUrl 必须传值）
   只能链接分享,链接分享消息必须附带linkUrl（如果没有会默认m.ctrip.com）。有图片（image、image path、imageurl）会传递图片做缩略图，没有会使用默认图片做缩略图，image，linkUrl，titie，text有效；

   微博分享：（第三方接口支持：文本+图片）（最低要求message  message和linkUrl合起来不能大于139个汉字，如果只有message不能超过140个汉字）
   1. 如果有本地image会作为分享图片，如果没有本地image有imageURL会下载imageURL作为图片，如果都没有会不发送图片；
   2. 分享title不起作用；
   3. 如果linkUrl有， 分享的message后面会自动添加linkUrl
   注意：当下载图片的时候最多10秒，失败或者超时不会发送图片


   Email分享：（最低要求message）image，linkUrl，titie，text有效；
   1. 图片为所分享的图片；
   2. 分享title作为Email标题；
   3. 如果有linkUrl，分享的text后面会自动添加linkUrl;

   短信分享：（最低要求message）linkUrl，text有效；
   1. 任何图片资源不起作用
   2. 分享title不起作用；
   3. 如果有linkUrl，分享的text后面会自动添加linkUrl;

   复制分享：（最低要求message）linkUrl，text有效；
   1. 任何图片资源不起作用
   2. 分享的title不起作用;
   3. 如果有linkUrl，分享的text后面会自动添加linkUrl;


  * @brief 第三方分享
  */
  var CtripShare = {

  /**
   * @description 调用App的分享-兼容老的分享，调用之后，无回调信息，6.1之后不建议使用该API
   * @brief 调用App的分享－兼容6.1之前版本
   * @param {String} imageRelativePath 将要分享的图片相对路径，相对webapp的路径;需要调用CtripUtil.app_download_data()下载图片；
   * @param {String} text 需要分享的文字,微博分享文字限制在140
   * @param {String} title 需要分享的标题, v5.4开始支持该字段，微信和email支持；
   * @param {String} linkUrl 需要分享的链接, v5.4开始支持该字段
   * @method app_call_system_share
   * @since v5.3
   * @author jimzhao
   * @example

      CtripBusiness.app_call_system_share("../wb_cache/pkg_name/md5_url_hash", "text to share weibo", "this is titile", "http://www.ctrip.com/");

   */
  app_call_system_share:function(imageRelativePath, text, title, linkUrl) {
      if (!Internal.isSupportAPIWithVersion("5.3")) {
          return;
      }
      var params = {};
      params.title = title;
      params.text = text;
      params.linkUrl = linkUrl;
      params.imageRelativePath = imageRelativePath;

      var paramString = Internal.makeParamString("Util", "callSystemShare", params, "call_system_share");
      Client.callback(paramString);
  },

  /**
   * @description 分享默认内容到各个平台，此API 为Javascript简化包装app_call_custom_share
   * @brief 分享默认内容到各个平台(JS 二次包装)
   * @method wrap_call_default_share
   * @param{String} imageUrl 分享图片的imageUrl，图片下载失败后，继续分享，不带图片
   * @param{String} title 分享的标题
   * @param{String} text 分享的内容
   * @param{String} linkUrl 分享的链接
   * @param{String} businessCode 分享的业务ID，可以为空，设置后，方便BI统计数据
   * @callback call_custom_share 为app_call_custom_share的callBackTag名字
   * @author jimzhao
   * @since v6.1
   * @example

      CtripShare.wrap_call_default_share("http://s0.ifengimg.com/2014/11/19/03ee1773b2262aa40a226b97f5b44c97.jpg", "chen title", "我的描述", "http://www.ifeng.com");

      //调用之后回调数据请参考 CtripShare.app_call_custom_share()的 example

   */
  wrap_call_default_share:function(imageUrl, title, text, linkUrl, businessCode) {
      var shareData = {};
      shareData.shareType = "Default";
      shareData.imageUrl = imageUrl;
      shareData.title = title;
      shareData.text = text;
      shareData.linkUrl = linkUrl;

      var dataList = [];
      dataList.push(shareData);
      CtripShare.app_call_custom_share(dataList, businessCode);
  },

  /**
   * @description 自定义分享，各个平台可以分享不同的内容

      V6.4版本开始，支持分享到指定的平台，API不变，使用说明：

      1. 根据dataList中分享的内容，确定显示的分享平台；

      2. dataList中有shareType=Default的内容，默认分享到所有平台；

   * @brief 自定义分享内容到第三方平台
   * @method app_call_custom_share
   * @param{Array} dataList 分享的内容，格式参考下面的example
   * @param{String} businessCode 分享的业务ID，可以为空，设置后，方便BI统计数据
   * @param{JSON} meta 分享的扩展参数，V6.5开始支持，现在支持的key:isDisableShareResultToast, 是否屏蔽默认分享之后的toast
   * @callback call_custom_share
   * @author jimzhao
   * @since v6.1
   * @example

      var dataList = [
          {
              shareType:"QQ",
              imageUrl:"http://share.csdn.net/uploads/24bd27fd3ad6a559873c4aff3bd64a60/24bd27fd3ad6a559873c4aff3bd64a60_thumb.jpg",
              title:"分享图书",
              text:"这本书的简介大概是这样",
              linkUrl:"http://csdn.net"
          },
          {
              shareType:"WeiXin",
              imageUrl:"http://share.csdn.net/uploads/24bd27fd3ad6a559873c4aff3bd64a60/24bd27fd3ad6a559873c4aff3bd64a60_thumb.jpg",
              title:"分享图书给微信",
              text:"这本书的简介是专门为微信定制",
              linkUrl:"http://csdn.net/w"
          },
          {
              shareType:"Default", //表示其他未指定的平台，都适用该分享内容
              imageUrl:"http://share.csdn.net/uploads/24bd27fd3ad6a559873c4aff3bd64a60/24bd27fd3ad6a559873c4aff3bd64a60_thumb.jpg",
              title:"通用分享图书",
              text:"这本书的简介是为其他分享定制的",
              linkUrl:"http://csdn.net/common_test"
          }
      ];

      CtripShare.app_call_custom_share(dataList);

      //调用处理完成之后
      //1. 没有分享成功返回数据如下
      var json_obj = {
          tagname:"call_custom_share",
          error_code:"(-201)分享失败" //error_code定义参考CtripShare通用参数定义
      }

      //2. 分享成功
      var json_obj = {
          tagname:"call_custom_share",
          param:{
              shareType:"WeiXin"
          }
      }

      app.callback(json_obj);
   */
  app_call_custom_share:function(dataList, businessCode, meta) {
      var params = {};
      params.dataList = dataList;
      params.businessCode = businessCode;
      params.meta = meta;

      var paramString = Internal.makeParamString("Share", "callCustomShare", params, "call_custom_share");
      Client.callback(paramString);
  },


  /**
   * @description 指定内容，分享到特定平台
   * @brief 指定内容，分享到特定平台
   * @method app_call_one_share
   * @param{String} shareType 分享的平台类型
   * @param{String} imageUrl 分享图片的imageUrl，图片下载失败后，继续分享，不带图片
   * @param{String} title 分享的标题
   * @param{String} text 分享的内容
   * @param{String} linkUrl 分享的链接
   * @param{String} businessCode 分享的业务ID，可以为空，设置后，方便BI统计数据
   * @param{JSON} meta 分享的扩展参数，V6.5开始支持，现在支持的key:isDisableShareResultToast, 是否屏蔽默认分享之后的toast
   * @callback call_one_share
   * @author jimzhao
   * @since v6.1
   * @example

   //调用
      CtripShare.app_call_one_share("QQZone", "http://a.hiphotos.baidu.com/ting/pic/item/314e251f95cad1c8ea16a3567d3e6709c93d5115.jpg" , "我是title", "我是text", "", "ctrip_share_11111");

      //调用处理完成之后
      //1. 没有分享成功返回数据如下
      var json_obj = {
          tagname:"call_custom_share",
          error_code:"(-201)分享失败" //error_code定义参考CtripShare通用参数定义
      }

      //2. 分享成功
      var json_obj = {
          tagname:"call_one_share",
      }

      app.callback(json_obj);
   */
  app_call_one_share:function(shareType, imageUrl, title, text, linkUrl, businessCode, meta) {
      var params = {};
      params.shareType = shareType;
      params.imageUrl = imageUrl;
      params.title = title;
      params.text = text;
      params.linkUrl = linkUrl;
      params.businessCode = businessCode;
      params.meta = meta;

      var paramString = Internal.makeParamString("Share", "callOneShare", params, "call_one_share");
      Client.callback(paramString);
  }

  };
