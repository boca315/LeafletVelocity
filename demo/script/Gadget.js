// 小工具
// Mercator-based Coordinate Reference System（CRS）
var marker = L.marker([39.13, 117.2])
// .addTo(map);

// function onMapClick(e, a, c) {
//     marker.setLatLng(e.latlng);
//     marker.bindPopup("<b>经纬度:</b>" + e.latlng).openPopup();
// }

// 鼠标移动功能
function onMouseMove(e) {
    // console.log('hhh')
    // L.popup()
    //     .setLatLng(e.latlng)
    //     .setContent("<b>经纬度:</b>" + e.latlng.toString())
    //     .openOn(map);
    var table_latlng = document.getElementById('latlng');
    table_latlng.innerHTML =
        // JSON.stringify(e.containerPoint) +
        // '<br />' +
        "纬度：" + e.latlng.lat +
        '<br />' +
        "  经度：" + e.latlng.lng;
    // JSON.stringify(e.latlng);
}

// map.on('click', onMapClick);
map.on('mousemove', onMouseMove);
// 城市搜索框
// 安装：
// npm init
// npm install --save leaflet-search

var rawData = geoinfo;
var data = [];
function f(current) {
    if (current.districts.length != 0) {
        data.push({ "loc": [parseFloat(current.center.split(",")[1]), parseFloat(current.center.split(",")[0])], "title": current.name });
        for (var i = 0; i < current.districts.length; i++) {
            f(current.districts[i]);
        }
    }
    else {
        data.push({ "loc": [parseFloat(current.center.split(",")[1]), parseFloat(current.center.split(",")[0])], "title": current.name });
    }
}

for (var i = 0; i < rawData.length; i++) {
    // [纬度,经度]
    f(rawData[i]);
}

function localData(text, callResponse) {
    //here can use custom criteria or merge data from multiple layers

    callResponse(data);

    return {    //called to stop previous requests on map move
        abort: function () {
            console.log('aborted request:' + text);
        }
    };
}

var controlSearch = new L.Control.Search({
    sourceData: localData,
    markerLocation: true,
    marker: marker,
    zoom: 14,
    position: 'topright',
    textErr: '没有找到...',
    textCancel: '取消',
    textPlaceholder: '查找...',
});
map.addControl(controlSearch);



// 小工具
var GadgetMarker = L.Icon.extend({
    options: {
        shadowUrl: null,
        iconAnchor: new L.Point(12, 12),
        iconSize: new L.Point(24, 24),
        iconUrl: '../demo/images/site.png'
    }
});
var gadgetMarkerIcon = new GadgetMarker();

var drawnItems = L.featureGroup().addTo(map);
var options = {
    position: 'topleft',
    draw: {
        polyline: {
            shapeOptions: {
                color: '#f357a1',
                weight: 10
            }
        },
        polygon: {
            allowIntersection: false, // Restricts shapes to simple polygons
            drawError: {
                color: '#e1e100', // Color the shape will turn when intersects
                message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
            },
            shapeOptions: {
                color: '#bada55'
            }
        },
        // circle: false, // Turns off this drawing tool
        // circlemarker:false,
        marker: {
            icon: gadgetMarkerIcon
        },
        rectangle: {
            shapeOptions: {
                clickable: false
            }
        },
    },
    edit: {
        featureGroup: drawnItems,
    }
};

L.drawLocal.draw.toolbar.buttons.polyline = '直线测距';
L.drawLocal.draw.toolbar.buttons.polygon = '多边形';
L.drawLocal.draw.toolbar.buttons.rectangle = '矩形框';
L.drawLocal.draw.toolbar.buttons.circle = '圆形';
L.drawLocal.draw.toolbar.buttons.circlemarker = '圆形标志';
L.drawLocal.draw.toolbar.buttons.marker = '定位';


map.addControl(new L.Control.Draw(options));

var on_compute_click = 0;
// var gadget_popup = null;

// 附近站点显示的icon
var siteIcon = L.Icon.extend({
    options: {
        iconUrl: '../demo/images/site_line.png',
        iconSize: [120, 120],
    }
});

// 点击坐标，弹出附近站点，点击附近站点，弹出计算框
// latlng: 经纬度，为附近站点的位置
// 
function siteAndPopup(latlng, data) {
    // 调用弹窗功能
    var mySiteMarker = L.marker(latlng, {
        icon: new siteIcon()
        // draggable: true,//Allow label dragging...?
        // zIndexOffset: 1000//Make appear 上面 other map features
    }).addTo(map);
    // 常规六项的值
    // 时
    // 'SO2', 'NO2', 'PM10', 'CO', 'O3', 'PM2.5'
    var hour_data = [data.so2, data.no2, data.pm10, data.co, data.o3, data.pm25];
    // 日
    var day_data = [data.so2_24h, data.no2_24h, data.pm10_24h, data.co_24h, data.o3_24h, data.pm25_24h];

    // 点击附近站点
    mySiteMarker.on('click', function (e) {
        this.remove();
        // 打开计算弹窗
        popupComput(latlng, hour_data, day_data);
    })
}

// 计算弹窗功能
map.on(L.Draw.Event.CREATED, function (event) {
    var gadget_layer = event.layer;
    var gadget_type = event.layerType;

    drawnItems.addLayer(gadget_layer);

    if (gadget_type === 'marker') {
        // 点击之后出现计算框
        gadget_layer.on('click', function () {
            var popup_url = baseurl + "/citycositionandcondition/judgecondition?lon=" + gadget_layer._latlng.lng + "&lat=" + gadget_layer._latlng.lat + " &date=" + now_date;
            $.getJSON(popup_url, function (data) {
                // 经纬度
                var site_lon = data.position.lon;
                var site_lat = data.position.lat;
                var latlng = {
                    lat: site_lat,
                    lng: site_lon
                };
                var latlng_tmp = site_lat * site_lon;

                if (on_compute_click == 0) {
                    on_compute_click = latlng_tmp; // 用经纬度标记layer的唯一性
                    // 调用弹窗功能
                    siteAndPopup(latlng, data.condition)
                } else if (Math.abs(on_compute_click - latlng_tmp) <= Number.EPSILON) {
                    // 经纬度相同，表示重复点击站点
                    // 保持不变
                } else {
                    // 经纬度不同，表示点击了别的站点
                    // 更新click的经纬度值
                    on_compute_click = latlng_tmp;
                    var gadget_popup = document.getElementsByClassName('compute-popup-max')[0];
                    // 把原来的计算弹窗关掉
                    gadget_popup.remove();
                    // 获得新的弹窗
                    siteAndPopup(latlng, data.condition)
                    //gadget_popup = popupComput(latlng);
                }
            });
        })
    }
});
