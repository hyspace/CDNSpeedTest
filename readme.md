# CDN Speed Test Lib

CDN Speed Test Lib is a js lib for image downloading speed test.

## usage:

### test:

    var test = new CDNSpeedTest.Test(key,url);

    document.addEventListener('test.finish',function(e){
        console.log(e.targetObject.result());
    },false)
    
    test.run();

### test list:

    var test1 = new CDNSpeedTest.Test(key,url);
    var test2 = new CDNSpeedTest.Test(key,url);

    var testlist = new CDNSpeedTest.TestList(test1);
    testlist.add(test2);

    document.addEventListener('testlist.finish',function(e){
        console.log(e.targetObject.result());
    },false)

    testlist.run();

## further:

see demo.