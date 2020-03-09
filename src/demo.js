function initDemoMap() {
  // 底图1
  var Esri_WorldImagery = L.tileLayer(
    "http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, " +
        "AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
    }
  );

  // 底图2
  var Esri_DarkGreyCanvas = L.tileLayer(
    "http://{s}.sm.mapstack.stamen.com/" +
    "(toner-lite,$fff[difference],$fff[@23],$fff[hsl-saturation@20])/" +
    "{z}/{x}/{y}.png",
    {
      attribution:
        "Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, " +
        "NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
    }
  );

  // 地图层更换，为了简便在此只保留卫星地图
  var baseLayers = {
    "Satellite": Esri_WorldImagery, // 地图名：底图1
    "Grey Canvas": Esri_DarkGreyCanvas // 地图名：底图2
  };

  // map 成员变量，初始为卫星地图
  var map = L.map("map", {
    layers: [Esri_WorldImagery]
  });


  // 控制层，baselayers为底图更换， addTo 将 control 和 map 绑定
  var layerControl = L.control.layers(baseLayers).addTo(map);

    var options={
        // collapsed: true,
        position: 'bottomright',
        // autoZIndex: true
    };
    var layerControlt= L.control.layers(baseLayers,baseLayers,options).addTo(map);
    var cm = L.control.timelineSlider({
        timelineItems: ["Day 1", "The Next Day", "Amazing Event", "1776", "12/22/63", "1984"],
        // changeMap: getDataAddMarkers,
        extraChangeMapParams: {exclamation: "Hello World!"} })
        .addTo(map);


    // the same as
  // 初始化map定位
  map.setView([-22, 150], 5);

  return {
      map: map,
      layerControl: layerControl,
      layerControlt:layerControlt
  };
}


// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map; // 获取地图
var layerControl = mapStuff.layerControl; // 获取 control


// 添加风向图
$.getJSON("data/wind-test.json", function (data) {
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

  layerControl.addOverlay(velocityLayer, "Wind - Global");
  // layerControl2.addOverlay(velocityLayer, "Wind - Global");
});

// 添加热力图
$.getJSON('data/heatmap-test.json', function (data) {

  var testData = {
    max: 8,
    data: [{lat: 24.6408, lng:46.7728, count: 3},{lat: 50.75, lng:-1.55, count: 1},{lat: 52.6333, lng:1.75, count: 1},{lat: 48.15, lng:9.4667, count: 1},{lat: 52.35, lng:4.9167, count: 2},{lat: 60.8, lng:11.1, count: 1},{lat: 43.561, lng:-116.214, count: 1},{lat: 47.5036, lng:-94.685, count: 1},{lat: 42.1818, lng:-71.1962, count: 1},{lat: 42.0477, lng:-74.1227, count: 1},{lat: 40.0326, lng:-75.719, count: 1},{lat: 40.7128, lng:-73.2962, count: 2},{lat: 27.9003, lng:-82.3024, count: 1},{lat: 38.2085, lng:-85.6918, count: 1},{lat: 46.8159, lng:-100.706, count: 1},{lat: 30.5449, lng:-90.8083, count: 1},{lat: 44.735, lng:-89.61, count: 1},{lat: 41.4201, lng:-75.6485, count: 2},{lat: 39.4209, lng:-74.4977, count: 1},{lat: 39.7437, lng:-104.979, count: 1},{lat: 39.5593, lng:-105.006, count: 1},{lat: 45.2673, lng:-93.0196, count: 1},{lat: 41.1215, lng:-89.4635, count: 1},{lat: 43.4314, lng:-83.9784, count: 1},{lat: 43.7279, lng:-86.284, count: 1},{lat: 40.7168, lng:-73.9861, count: 1},{lat: 47.7294, lng:-116.757, count: 1},{lat: 47.7294, lng:-116.757, count: 2},{lat: 35.5498, lng:-118.917, count: 1},{lat: 34.1568, lng:-118.523, count: 1},{lat: 39.501, lng:-87.3919, count: 3},{lat: 33.5586, lng:-112.095, count: 1},{lat: 38.757, lng:-77.1487, count: 1},{lat: 33.223, lng:-117.107, count: 1},{lat: 30.2316, lng:-85.502, count: 1},{lat: 39.1703, lng:-75.5456, count: 8},{lat: 30.0041, lng:-95.2984, count: 2},{lat: 29.7755, lng:-95.4152, count: 1},{lat: 41.8014, lng:-87.6005, count: 1},{lat: 37.8754, lng:-121.687, count: 7},{lat: 38.4493, lng:-122.709, count: 1},{lat: 40.5494, lng:-89.6252, count: 1},{lat: 42.6105, lng:-71.2306, count: 1},{lat: 40.0973, lng:-85.671, count: 1},{lat: 40.3987, lng:-86.8642, count: 1},{lat: 40.4224, lng:-86.8031, count: 4},{lat: 47.2166, lng:-122.451, count: 1},{lat: 32.2369, lng:-110.956, count: 1},{lat: 41.3969, lng:-87.3274, count: 2},{lat: 41.7364, lng:-89.7043, count: 2},{lat: 42.3425, lng:-71.0677, count: 1},{lat: 33.8042, lng:-83.8893, count: 1},{lat: 36.6859, lng:-121.629, count: 2},{lat: 41.0957, lng:-80.5052, count: 1},{lat: 46.8841, lng:-123.995, count: 1},{lat: 40.2851, lng:-75.9523, count: 2},{lat: 42.4235, lng:-85.3992, count: 1},{lat: 39.7437, lng:-104.979, count: 2},{lat: 25.6586, lng:-80.3568, count: 7},{lat: 33.0975, lng:-80.1753, count: 1},{lat: 25.7615, lng:-80.2939, count: 1},{lat: 26.3739, lng:-80.1468, count: 1},{lat: 37.6454, lng:-84.8171, count: 1},{lat: 34.2321, lng:-77.8835, count: 1},{lat: 34.6774, lng:-82.928, count: 1},{lat: 39.9744, lng:-86.0779, count: 1},{lat: 35.6784, lng:-97.4944, count: 2},{lat: 33.5547, lng:-84.1872, count: 1},{lat: 27.2498, lng:-80.3797, count: 1},{lat: 41.4789, lng:-81.6473, count: 1},{lat: 41.813, lng:-87.7134, count: 1},{lat: 41.8917, lng:-87.9359, count: 1},{lat: 35.0911, lng:-89.651, count: 1},{lat: 32.6102, lng:-117.03, count: 1},{lat: 41.758, lng:-72.7444, count: 1},{lat: 39.8062, lng:-86.1407, count: 1},{lat: 41.872, lng:-88.1662, count: 1},{lat: 34.1404, lng:-81.3369, count: 1},{lat: 46.15, lng:-60.1667, count: 1},{lat: 36.0679, lng:-86.7194, count: 1},{lat: 43.45, lng:-80.5, count: 1},{lat: 44.3833, lng:-79.7, count: 1},{lat: 45.4167, lng:-75.7, count: 2},{lat: 43.75, lng:-79.2, count: 2},{lat: 45.2667, lng:-66.0667, count: 3},{lat: 42.9833, lng:-81.25, count: 2},{lat: 44.25, lng:-79.4667, count: 3},{lat: 45.2667, lng:-66.0667, count: 2},{lat: 34.3667, lng:-118.478, count: 3},{lat: 42.734, lng:-87.8211, count: 1},{lat: 39.9738, lng:-86.1765, count: 1},{lat: 33.7438, lng:-117.866, count: 1},{lat: 37.5741, lng:-122.321, count: 1},{lat: 42.2843, lng:-85.2293, count: 1},{lat: 34.6574, lng:-92.5295, count: 1},{lat: 41.4881, lng:-87.4424, count: 1},{lat: 25.72, lng:-80.2707, count: 1},{lat: 34.5873, lng:-118.245, count: 1},{lat: 35.8278, lng:-78.6421, count: 1}]
  };
  var cfg = {
    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
    "radius": 2,
    "maxOpacity": .8,
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
    valueField: 'count'
  };


  var heatmapLayer = new HeatmapOverlay(cfg);


  // //设置参数
  // var cfg = {
  //   radius: .007,       //设置每一个热力点的半径
  //   maxOpacity: 0.9,        //设置最大的不透明度
  //   // minOpacity: 0.3,     //设置最小的不透明度
  //   scaleRadius: true,      //设置热力点是否平滑过渡
  //   blur: 0.95,             //系数越高，渐变越平滑，默认是0.85,
  //   //滤镜系数将应用于所有热点数据。
  //   useLocalExtrema: true,  //使用局部极值
  //   latField: 'lat',   //维度
  //   lngField: 'lng',  //经度
  //   valueField: 'count',    //热力点的值
  //   gradient: {
  //     "0.99": "rgba(255,0,0,1)",
  //     "0.9": "rgba(255,255,0,1)",
  //     "0.8": "rgba(0,255,0,1)",
  //     "0.5": "rgba(0,255,255,1)",
  //     "0": "rgba(0,0,255,1)"
  //   }
  //   //过渡，颜色过渡和过渡比例,范例：
  //   /*
  //       {   "0.99": "rgba(255,0,0,1)",
  //           "0.9": "rgba(255,255,0,1)",
  //           "0.8": "rgba(0,255,0,1)",
  //           "0.5": "rgba(0,255,255,1)",
  //           "0": "rgba(0,0,255,1)"
  //       }
  //   */
  //   // backgroundColor: 'rgba(27,34,44,0.5)'    //热力图Canvas背景
  // };

  //定义热力图s
  // var heatmapLayer = new HeatmapOverlay(cfg);

  layerControl.addOverlay(heatmapLayer, '热力图');

  heatmapLayer.setData(data);
});


// $.getJSON("heatmap-test.json", function (data) {
//   addressPoints = data;

//   var heat = L.heatLayer(addressPoints)
//   //.addTo(map);
//   // var velocityLayer = L.velocityLayer({
//   //   displayValues: true,
//   //   displayOptions: {
//   //     velocityType: "Globasl Wind",
//   //     displayPosition: "bottomleft",
//   //     displayEmptyString: "No wind data"
//   //   },
//   //   data: data,
//   //   maxVelocity: 15
//   // });

//   layerControl.addOverlay(heat, "heatmap");
// });
// load data (u, v grids) from somewhere (e.g. https://github.com/danwild/wind-js-server)
// $.getJSON("wind-gbr.json", function(data) {
//   var velocityLayer = L.velocityLayer({
//     displayValues: true,
//     displayOptions: {
//       velocityType: "GBR Wind",
//       displayPosition: "bottomleft",
//       displayEmptyString: "No wind data"
//     },
//     data: data,
//     maxVelocity: 10
//   });

//   layerControl.addOverlay(velocityLayer, "Wind - Great Barrier Reef");
// });

// $.getJSON("water-gbr.json", function(data) {
//   var velocityLayer = L.velocityLayer({
//     displayValues: true,
//     displayOptions: {
//       velocityType: "GBR Water",
//       displayPosition: "bottomleft",
//       displayEmptyString: "No water data"
//     },
//     data: data,
//     maxVelocity: 0.6,
//     velocityScale: 0.1 // arbitrary default 0.005
//   });

//   layerControl.addOverlay(velocityLayer, "Ocean Current - Great Barrier Reef");
// });
