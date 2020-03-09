// 添加风向图
$.getJSON("../data/wind-test.json", function (data) {
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

    layerControl.addOverlay(velocityLayer, "Windy");
});

// 画插值图，cell越小计算量越大，越卡
$.getJSON("../data/c-test.json", function (data) {
    var idw = L.idwLayer(data, {
        opacity: 0.3,
        // maxZoom: 18,
        cellSize: 4,
        exp: 2,
        max: 400
    })

    layerControl.addOverlay(idw, "气温");
});

// 添加AQI指标
$.getJSON('../data/bubble-test.json', function (data) {
    // 设置好颜色
    var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
    var cfg = {
        nums: 6, // 颜色个数，即等级数
        colors: mycolors, // 每个等级对应的颜色
        fontSize: '13px', // 字体大小
        fontColor: '#cccccc', //字体颜色
        src: 'images/AQI指标条形图.png'
    };

    var templayer = new BubblesOverlay(cfg);
    // 将图层加入地图
    layerControl.addOverlay(templayer, 'AQI');
    // 加入数据
    templayer.setData(data);
});

// 添加热力图
$.getJSON('../data/heatmap-test2.json', function (data) {

    var cfg = {
        // radius should be small ONLY if scaleRadius is true (or small radius is intended)
        "radius": .6,
        // "maxOpacity": .8,
        // scales the radius based on map zoom
        "scaleRadius": true,
        // if set to false the heatmap uses the global maximum for colorization
        // if activated: uses the data maximum within the current map boundaries 
        //   (there will always be a red spot with useLocalExtremas true)
        "useLocalExtrema": true,
        // which field name in your data represents the latitude - default "lat"
        latField: 'lat',
        // which field name in your data represents the longitude - default "lng"
        lngField: 'lng',
        // which field name in your data represents the data value - default "value"
        valueField: 'count',
        // gradient: {
        //   "0": '#000066',
        //   ".1": 'blue',
        //   ".2": 'cyan',
        //   ".3": 'lime',
        //   ".4": 'yellow',
        //   ".5": 'orange',
        //   ".6": 'red',
        //   ".7": 'Maroon',
        //   ".8": "#660066",
        //   ".9": "#990099",
        //   "1": "#bd0026"
        // },
        maxOpacity: 0.9,
    };


    var heatmapLayer = new HeatmapOverlay(cfg);

    layerControl.addOverlay(heatmapLayer, '热力图');

    heatmapLayer.setData(data);
});

//等值线的级数
var isoline_breaks = [0, 2, 4, 6, 8];

//设置颜色
var isoline_style = {
    "color": "#2b6dab",
    "weight": 2,
    "opacity": 0.4
};
var isoline_icon1 = L.icon({
    iconUrl: 'images/isoline_1.png',
    iconSize: [14, 14]
});
var isoline_icon2 = L.icon({
    iconUrl: 'images/isoline_2.png',
    iconSize: [14, 14]
});
var isoline_icon3 = L.icon({
    iconUrl: 'images/isoline_3.png',
    iconSize: [14, 14]
});
var isoline_icon4 = L.icon({
    iconUrl: 'images/isoline_4.png',
    iconSize: [14, 14]
});
var isoline_icons = [isoline_icon1, isoline_icon2, isoline_icon3, isoline_icon4]
var isoline_cfg = {
    style: isoline_style,
    nums: isoline_breaks.length,
    breaks: isoline_breaks,
    icons: isoline_icons,
}

var isoline_layer = new IsolineOverlay(isoline_cfg);
layerControl.addOverlay(isoline_layer, '等压线');
// 加入数据
isoline_layer.setData(isoline_pointGrid);
