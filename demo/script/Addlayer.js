// 添加风向图
$.getJSON(windy_now_url, function (data) { // http://localhost:8888/data/wind-test.json
    var velocityLayer = L.velocityLayer({
        displayValues: true,
        displayOptions: {
            velocityType: "Global Wind",
            displayPosition: "bottomleft",
            displayEmptyString: "No wind data"
        },
        data: data,
        maxVelocity: 15
    });

    layerControl.addOverlay(velocityLayer, "风场");
});


$.getJSON(pressure_now_url, function (data) { // http://localhost:8888/data/isoline-test2.json
    console.log(data)
    var isoline_begin = 500; // 500-700  40
    var isoline_end1 = 630; // 700-940  100
    var isoline_end2 = 960; // 940-1020 30
    var isoline_end3 = 1023; // 1020-1028 2
    var isoline_end4 = 1030;
    var isoline_bound = [isoline_begin, isoline_end1, isoline_end2, isoline_end3, isoline_end4];
    var isoline_div = [40, 100, 30, 2];

    //等值线的级数
    var isoline_breaks = [];
    for (var j = 0; j < isoline_div.length; j++) {
        for (var i = isoline_bound[j]; i <= isoline_bound[j + 1]; i = i + isoline_div[j]) {
            isoline_breaks.push(i);
        }
    }

    //设置颜色
    var isoline_style = {
        "color": "#ff7800",
        "weight": 1.5,
        "opacity": 1
    };

    var isoline_cfg = {
        style: isoline_style,
        nums: isoline_breaks.length,
        breaks: isoline_breaks,
    }

    var isoline_layer = new IsolineOverlay(isoline_cfg);
    layerControl.addOverlay(isoline_layer, '气压');
    // 加入数据
    console.log(data);
    isoline_layer.setData(data);
});

// AQI PM25 PM10 SO2 NO2 O3 CO
//  0   1     2   3   4   5  6
// 添加AQI指标
$.getJSON(AQIs_now_url[0], function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: '../demo/images/AQI.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'AQI');
    // 加入数据
    templayer.setData(data);
});

// 常规六项
// 添加PM2.5指标
$.getJSON(AQIs_now_url[1], function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: '../demo/images/AQI.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'PM2.5');
    // 加入数据
    templayer.setData(data);
});

// 添加PM10指标
$.getJSON(AQIs_now_url[2], function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: '../demo/images/AQI.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'PM10');
    // 加入数据
    templayer.setData(data);
});

// 添加SO2指标
$.getJSON(AQIs_now_url[3], function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: '../demo/images/AQI.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'SO2');
    // 加入数据
    templayer.setData(data);
});

// 添加NO2指标
$.getJSON(AQIs_now_url[4], function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: '../demo/images/AQI.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'NO2');
    // 加入数据
    templayer.setData(data);
});

// 添加O3指标
$.getJSON(AQIs_now_url[5], function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: '../demo/images/AQI.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'O3');
    // 加入数据
    templayer.setData(data);
});

// 添加CO指标
$.getJSON(AQIs_now_url[6], function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: '../demo/images/CO.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'CO');
    // 加入数据
    templayer.setData(data);
});


// var tempcolors = ["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf",
//     "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"];

// var temperatureOverlay = new TemperatureOverlay(tempcolors);
// layerControl.addOverlay(temperatureOverlay, "temperature");
// temperatureOverlay.setData(sites);

// 添加气温图
//var temperature_now_url = "http://120.27.223.134:8080/InterpolationGraph/temperature?date=11/1/2019";
//$.get(temperature_now_url,function(data,status){
// console.log(data)
// var tempcolors = ["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf",
//     "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"];

// var temperatureOverlay = new TemperatureOverlay(tempcolors);

// layerControl.addOverlay(temperatureOverlay, "temperature");
// temperatureOverlay.setData(data.data);
// });


// var temperature_now_url = "http://120.27.223.134:8080/InterpolationGraph/temperature?date=11/1/2019";
// $.getJSON(temperature_now_url, function (data) {
//     var tempcolors = ["#006837", "#1a9850", "#66bd63", "#a6d96a", "#d9ef8b", "#ffffbf",
//         "#fee08b", "#fdae61", "#f46d43", "#d73027", "#a50026"];

//     var temperatureOverlay = new TemperatureOverlay(tempcolors);

//     layerControl.addOverlay(temperatureOverlay, "temperature");
//     temperatureOverlay.setData(data.data);
// });




// // 画插值图，cell越小计算量越大，越卡
// $.getJSON("../data/idw-test2.json", function (data) {
//     var idw = L.idwLayer(data, {
//         opacity: 0.3,
//         // maxZoom: 18,
//         cellSize: 2,
//         exp: 2,
//         max: 400
//     })

//     layerControl.addOverlay(idw, "气温");
// });



// 添加热力图
// $.getJSON('../data/heatmap-test2.json', function (data) {

//     var cfg = {
//         // radius should be small ONLY if scaleRadius is true (or small radius is intended)
//         "radius": 0.6,
//         // "maxOpacity": .8,
//         // scales the radius based on map zoom
//         "scaleRadius": true,
//         // if set to false the heatmap uses the global maximum for colorization
//         // if activated: uses the data maximum within the current map boundaries
//         //   (there will always be a red spot with useLocalExtremas true)
//         "useLocalExtrema": true,
//         // which field name in your data represents the latitude - default "lat"
//         latField: 'lat',
//         // which field name in your data represents the longitude - default "lng"
//         lngField: 'lng',
//         // which field name in your data represents the data value - default "value"
//         valueField: 'temp',
//         gradient: {
//             "0": '#007730',
//             ".05": '#228D00',
//             ".1": '#539700',
//             ".15": '#739D00',
//             ".2": '#91A200',
//             ".3": '#A69C00',
//             ".4": '#A68F00',
//             ".5": '#A68100',
//             ".6": "#A67400",
//             ".7": "#A66300",
//             ".8": "#A65200",
//             ".9": "#A63C00",
//             "1": "A61300",
//         },
//         maxOpacity: 0.9,
//     };


//     var heatmapLayer = new HeatmapOverlay(cfg);

//     layerControl.addOverlay(heatmapLayer, '热力图');

//     heatmapLayer.setData(data);
// });
