//JavaScript Document by wondger[at]gmail[dot]com
(function(){
    var S = function(selector,context){
        return new SL(selector,context);
    };
    var doc = document,win = window;
    var SL = function(selector,context){
        this.eles = query(selector,context);
        this.length = this.eles.length;
    };
    var query = function(selector,context){
        var type,eles,selector;
        if(doc.querySelectorAll){
            /*
             * uncaught exception
             * query = doc.querySelectorAll;
             */
            query = function(selector,context){
                return doc.querySelectorAll(selector);
            };
            return doc.querySelectorAll(selector);
        }
        type = selector.indexOf('#')==0 ? 'ID' (selector.indexOf('.')==0 ? 'CLASS' : 'TAG') : 'TAG';
        eles = [];
        selector = selector.replace(/^[#\.]/,'');
        switch(type){
            case 'ID':
                return [doc.getElementById(selector)];
            case 'CLASS':
                //
                return doc.getElementByClassName(selector);
            case 'TAG':
            default:
                return doc.getElementsByTagName(selector);
        }
    };
    SL.prototype = {
        size:function(){
            return this.length; 
        },
        each:function(fn){
            if(fn.constructor == Function){
                var i = 0;
                while(this.eles[i]){
                    fn.call(this.eles[i],i);
                    ++i;
                }
            }
            return this;
        },
        addEvent:function(evt,fn){
            if(!evt || !fn || fn.constructor!==Function) return this;
            
        },
        on:function(evt,fn){
            
        }
    }
    window.S = window.SL = S;
})();
