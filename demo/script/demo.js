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
    var layerControl2= L.control.layers(baseLayers,baseLayers,options).addTo(map); // 按钮控制的layer
    var layerControl3= L.control.layers(baseLayers,baseLayers,options).addTo(map); // 按钮控制的layer
    var layerControl4= L.control.layers(baseLayers,baseLayers,options).addTo(map); // 按钮控制的layer
    var layerControl5= L.control.layers(baseLayers,baseLayers,options).addTo(map); // 按钮控制的layer
    var layerControl6= L.control.layers(baseLayers,baseLayers,options).addTo(map); // 按钮控制的layer


    // 加入时间轴
  var cm = L.control.timelineSlider({
        timelineItems: ["Day 1", "The Next Day", "Amazing Event", "1776", "12/22/63", "1984"],
        // changeMap: getDataAddMarkers,
        extraChangeMapParams: {exclamation: "Hello World!"} })
        .addTo(map);
  // 初始化map定位
  map.setView([34, 105], 4.6);

  return {
    map: map,
    layerControls: [layerControl1,layerControl2,layerControl3,layerControl4,layerControl5,layerControl6]
  };
}

// demo map
var mapStuff = initDemoMap();
var map = mapStuff.map; // 获取地图
var layerControls = mapStuff.layerControsl; // 获取 control LIST
