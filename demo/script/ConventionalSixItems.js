// 添加PM2.5指标
$.getJSON('../data/bubble-test.json', function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: 'images/PM2.5.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'PM2.5');
    // 加入数据
    templayer.setData(data);
});

// 添加PM10指标
$.getJSON('../data/bubble-test.json', function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: 'images/PM10.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'PM10');
    // 加入数据
    templayer.setData(data);
});

// 添加SO2指标
$.getJSON('../data/bubble-test.json', function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: 'images/SO2.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'SO2');
    // 加入数据
    templayer.setData(data);
});

// 添加CO指标
$.getJSON('../data/bubble-test.json', function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: 'images/CO.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'CO');
    // 加入数据
    templayer.setData(data);
});

// 添加NO2指标
$.getJSON('../data/bubble-test.json', function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: 'images/NO2.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'NO2');
    // 加入数据
    templayer.setData(data);
});

// 添加O3指标
$.getJSON('../data/bubble-test.json', function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: 'images/O3.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'O3');
    // 加入数据
    templayer.setData(data);
});
