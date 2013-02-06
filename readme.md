CDN Speed Test

js CDN 速度测试框架

usage:

test:

    var test = new Test(key,url);
    document.addEventListener('test.finish',function(e){
        console.log(e.targetObject.result);
    },false)
    test.run();

test list;

    var test = new Test(key,url);
    var testlist = new TestList();
    testlist.list.push(test);

    document.addEventListener('testlist.finish',function(e){
        console.log(e.targetObject.list);
    },false)

    testlist.start();