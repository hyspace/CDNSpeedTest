~function(window){
    window.CDNSpeedTest = {};
    CDNSpeedTest.Test =function(key,url){
        this.url = url;
        this.key = key;
        this.result = 0;
    }
    CDNSpeedTest.Test.prototype = {
        constructor:Test,
        run:function(){
            var obj = this;
            var startTime;
            var img = new Image();
            img.addEventListener('load',function(e){
                var endTime = (new Date()).getTime();
                obj.result = endTime - startTime;
                var evt = document.createEvent('Events');
                evt.initEvent('test.finish',false,false);
                evt.targetObject = obj;
                document.dispatchEvent(evt);
            },false)
            img.addEventListener('error',function(e){
                obj.result = -1;
                var evt = document.createEvent('Events')
                evt.initEvent('test.error',false,false);
                evt.targetObject = obj;
                document.dispatchEvent(evt);
            },false)
            startTime = (new Date()).getTime();
            img.src = this.url + '?t=' + startTime;
        },
        reset:function(){
            this.result = 0;
        }
    }
    CDNSpeedTest.TestList = function(){
        this.list = [];
        this.progress = -1;
    }
    CDNSpeedTest.TestList.prototype = {
        constructor:TestList,
        result:function(){
            var obj = {};
            for(i=0;i<this.list.length;i++){
                obj[this.list[i].key] = this.list[i].result;
            }
            return obj;
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
                    break;
            }
        },
        _step:function(){
            this.list[this.progress].run();
        },
        start:function(){
            if(!this.list.length)return;
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
}