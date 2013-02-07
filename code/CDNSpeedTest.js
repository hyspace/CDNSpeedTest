(function(window){
    var _s;
    //namespace
    window.CDNSpeedTest = {};

    CDNSpeedTest.Test = function(key,url,times){
        this.url = url || '';
        this.key = key || '';
        this.times = times || 1;
        this._startTime = 0;
        this._failedTimes = 0;
        this._result = [];
        this._progress = -1;
        //if this test is belong to a TestList , this refer to the TestList Obj
        this.ownerList = null;
    }
    CDNSpeedTest.Test.prototype = {
        constructor:CDNSpeedTest.Test,
        _calc:function(){
            if(this._failedTimes==this.times)return -1;
            var i,sum = 0;
            for(i=0;i<this._result.length;i++){
                sum += this._result[i];
            }
            return Math.round(sum / (this.times - this._failedTimes));
        },
        result:function(){
            var _time = this._calc();
            return {
                key:this.key,
                url:this.url,
                testTimes:this.times,
                failedTimes:this._failedTimes,
                time:_time  
            }
        },
        handleEvent:function(event){
            var endTime = (new Date()).getTime();
            switch (event.type) {
                case 'load':
                    this._result.push(endTime - this._startTime);
                    break;
                case 'error':
                    this._result.push(-1);
                    this._failedTimes++;
                    break;
            }
            this._progress ++;
            if(this._progress < this.times){
                this._step();
            }else{
                var evt = document.createEvent('Events');
                evt.initEvent('test.finish',false,false);
                evt.targetObject = this;
                document.dispatchEvent(evt);
            }
        },
        _step:function(){
            var img = new Image();
            img.addEventListener('load',this,false);
            img.addEventListener('error',this,false);
            this._startTime = (new Date()).getTime();
            img.src = this.url + '?t=' + this._startTime;
        },
        run:function(){
            if(this._progress!=-1)return;
            this._progress = 0;
            this._step();
        },
        reset:function(){
            this._progress = -1;
            this._result = [];
            this._failedTimes = 0;
        }
    }
    CDNSpeedTest.TestList = function(){
        this._list = [];
        this._progress = -1;
        for(i=0;i<arguments.length;i++){
            this.add(arguments[i]);
        }
    }
    CDNSpeedTest.TestList.prototype = {
        constructor:CDNSpeedTest.TestList,
        result:function(){
            var arr = [],i;
            for(i=0;i<this._list.length;i++){
                arr.push(this._list[i].result());
            }
            return arr;
        },
        handleEvent:function(event){
            switch (event.type) {
                case 'test.error':
                case 'test.finish':
                    this._progress ++;
                    if(this._progress < this._list.length){
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
            this._list[this._progress].run();
        },
        add:function(){
            var i;
            for(i=0;i<arguments.length;i++){
                this._list.push(arguments[i]);
                arguments[i].ownerList = this;
            }
        },
        run:function(){
            if(!this._list.length)return;
            if(this._progress!=-1)return;
            this._progress = 0;
            document.addEventListener('test.finish', this, false);
            document.addEventListener('test.error', this, false);
            this._step();
        },
        reset:function(){
            this._progress = -1;
            for(i=0;i<this._list.length;i++){
                this._list[i].reset();
            }
        }
    }
})(window);