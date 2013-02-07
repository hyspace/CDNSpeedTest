(function(window){
    var _s;
    //namespace
    window.CDNSpeedTest = {};

    CDNSpeedTest.Test = function(key,url){
        this.url = url;
        this.key = key;
        this._result = 0;
        //if this test is belong to a TestList , this refer to the TestList Obj
        this.ownerList = null;
    }
    CDNSpeedTest.Test.prototype = {
        constructor:CDNSpeedTest.Test,
        result:function(){
            return {
                key:this.key,
                url:this.url,
                time:this._result
            }
        },
        run:function(){
            var obj = this;
            var startTime;
            var img = new Image();
            img.addEventListener('load',function(e){
                var endTime = (new Date()).getTime();
                obj._result = endTime - startTime;
                var evt = document.createEvent('Events');
                evt.initEvent('test.finish',false,false);
                evt.targetObject = obj;
                document.dispatchEvent(evt);
            },false)
            img.addEventListener('error',function(e){
                obj._result = -1;
                var evt = document.createEvent('Events')
                evt.initEvent('test.error',false,false);
                evt.targetObject = obj;
                document.dispatchEvent(evt);
            },false)
            startTime = (new Date()).getTime();
            img.src = this.url + '?t=' + startTime;
        },
        reset:function(){
            this._result = 0;
        }
    }
    CDNSpeedTest.TestList = function(){
        this.list = [];
        this.progress = -1;
        for(i=0;i<arguments.length;i++){
            this.add(arguments[i]);
        }
    }
    CDNSpeedTest.TestList.prototype = {
        constructor:CDNSpeedTest.TestList,
        result:function(){
            var arr = [],i;
            for(i=0;i<this.list.length;i++){
                arr.push(this.list[i].result());
            }
            return arr;
        },
        handleEvent:function(event){
            switch (event.type) {
                case 'test.error':
                case 'test.finish':
                    this.progress ++;
                    if(this.progress < this.list.length){
                        this._step();
                    }else{
                        var evt = document.createEvent('Events')
                        evt.initEvent('testlist.finish',false,false);
                        evt.targetObject = this;
                        document.dispatchEvent(evt);
                        document.removeEventListener('test.finish', this, false);
                        document.removeEventListener('test.error', this, false);
                    }
            }
        },
        _step:function(){
            this.list[this.progress].run();
        },
        add:function(){
            var i;
            for(i=0;i<arguments.length;i++){
                this.list.push(arguments[i]);
                arguments[i].ownerList = this;
            }
        },
        run:function(){
            if(!this.list.length)return;
            if(this.progress!=-1)return;
            this.progress = 0;
            document.addEventListener('test.finish', this, false);
            document.addEventListener('test.error', this, false);
            this._step();
        },
        reset:function(){
            this.progress = -1;
            for(i=0;i<this.list.length;i++){
                this.list[i].reset();
            }
        }
    }
})(window);