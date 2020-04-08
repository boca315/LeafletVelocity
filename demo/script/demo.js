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
    "{z}/{x}/{y}grey.png",
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



  // control选项
  var options={
      // collapsed: true,
      position: 'topright',
      // autoZIndex: true
  };
    // 控制层，baselayers为底图更换， addTo 将 control 和 map 绑定
    var layerControl1 = L.control.layers(baseLayers).addTo(map);
    //
  //
  //   let markers={
  //       label:"",
  //       value:"",
  //       map:map,
  //       exclamation:"cd"
  //   }
    // 加入时间轴
  var cm = L.control.timelineSlider({
        timelineItems: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6","Day 7","Day 8","Day 9","Day 10",
            "Day 11", "Day 12", "Day 13", "Day 14", "Day 15", "Day 16","Day 17","Day 18","Day 19","Day 20",
            "Day 1", "Day 2", "Day 3", "Day 4", "Day 25", "Day 26","Day 27","Day 28","Day 29","Day 30",
            "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6","Day 7","Day 8","Day 39","Day 40",
            "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6","Day 7","Day 8","Day 49","Day 50",
            "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6","Day 7","Day 8","Day 59","Day 60",
            "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6","Day 7","Day 8","Day 69","Day 70",
            "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6","Day 7","Day 8","Day 79","Day 80",
            "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6","Day 7","Day 8","Day 89","Day 90",
            "Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6","Day 7","Day 8","Day 99","Day 100"],
        changeMap: getDataAddMarkers, //更改地图 可以获得的参数在ControlTimeLine.JS mapParams
        extraChangeMapParams: {exclamation: "Hello World!"} })
        .addTo(map);

  // 初始化map定位
  map.setView([34, 105], 4.6);

  return {
    map: map,
    layerControl: layerControl1/*,layerControl2,layerControl3,layerControl4,layerControl5,layerControl6]*/,
      // cm: cm
  };
}

// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map; // 获取地图
var layerControl = mapStuff.layerControl; // 获取 control LIST
