/*
 * @public
 * @static
 * @description some util methons. its items should be add as SL's static public method
 * @Object
 */
SL.util = {
    cookie:{
        /*
         * @param name:唯一cookie名称，不区分大小写
         * @param value:cookie值
         * @param expires:[可选]过期时间，Date对象
         * @param path:[可选]访问路径
         * @param domain:[可选]访问域
         * @param secure:[可选]布尔值，是否只能从安全网站中访问（SSL,HTTPS）
         */
        set:function(name,value,expires,domain,path,secure){
            var sCookie = name+'='+encodeURIComponent(value);
            if(expires) sCookie += ';expires=' + expires.toGMTString();
            if(domain) sCookie += ';domain=' + domain;
            if(path) sCookie += ';path=' + path;
            if(secure) sCookie += ';secure=' + secure;
            document.cookie = sCookie;
        },
        get:function(name){
            var cRE = new RegExp('(?:; )?'+name+'=([^;]*);?');
            return cRE.test(document.cookie) ? decodeURIComponent(RegExp['$1']) : null;
        },
        del:function(name,domain,path){
            this.set(name,'',new Date(0),domain,path);
        }
    },
    setCookie:function(name,value,expires,domain,path,secure){
        SL.util.Cookie.set(name,value,expires,domain,path,secure);
    },
    getCookie:function(name){
        return SL.util.Cookie.get(name);
    },
    delCookie:function(name,domain,path){
        SL.util.Cookie.del(name,domain,path);
    },
    /*
     * @name templateParse
     * @description 将一个字符串中的特定格式的字符替换为一个对象中的特定值
     * @function
     * @param s String 字符串
     * @param data Object 数据源
     * @return String
     * @example templateParse('{{name}} is a Chinese in {{province}}',{name:'Xiao Ming',province:'Sichuan'})
     */
    templateParse:function(s,data){
        return s.replace(/{{([^{}]+)}}/g,function(a,b){
            var r = data[b];
            return r.constructor == String || r.constructor == Number ? r : '{{'+b+'}}';
        });
    }
};
S.mix(S,SL.util);
