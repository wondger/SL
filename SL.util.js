SL.util = {
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
}
