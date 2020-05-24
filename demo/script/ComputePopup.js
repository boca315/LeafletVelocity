// create popup，自定义计算弹窗
L.ComputePopup = L.Popup.extend({
    // options:{

    // },
    _initLayout: function () {
        var prefix = 'leaflet-popup',
            container = this._container = L.DomUtil.create('div',
                prefix + ' ' + (this.options.className || '') +
                ' leaflet-zoom-animated');

        var wrapper = container;
        this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);

        L.DomEvent
            .disableClickPropagation(wrapper)
            // .disableScrollPropagation(this._contentNode)
            .on(wrapper, 'contextmenu', L.DomEvent.stopPropagation);
    },

});
//var popupContent = " <div class='computepopup'><div id='popup-span-left'><p class='popup-title' style='color: #d4d4d4;'>六项污染物</p><div style='padding-top: 20px;padding-bottom: 15px;'><button type='button' id='hour-button'>时</button><button type='button' id='day-button'>日</button></div><div class='div-value'><p>PM2.5 <img src='images/line2.eps'><input type='text'></p><p>PM10 <img src='images/line2.eps'><input type='text'></p></div><div class='div-value'><p>&ensp;O3   &ensp; <img src='images/line2.eps'><input type='text'></p><p>&ensp;CO  &ensp; <img src='images/line2.eps'><input type='text'></p></div><div class='div-value'><p> SO2  &ensp; <img src='images/line2.eps'><input type='text'></p><p> NO2&ensp; <img src='images/line2.eps'><input type='text'></p></div><button id='button-caculate'>计算</button></div><div id='popup-span-right'><p class='popup-title' style='color: #d4d4d4;'>首要污染物</p><div id='div-index'><span><p class='composite-index-value'>78.23</p><p class='composite-index-word'> 综合指数</p></span><span style='width: 0.7px;height: 48px; background: #d4d4d4;'></span><span><p class='composite-index-value'>89</p><p class='composite-index-word'> AQI指数</p></span><div id='div-value-chart'></div></div></div></div>"
// html 转 string
// https://www.html.cn/tool/html2string/
var popupContent = '\
<div class=\'compute-popup\'>\
    <div id=\'popup-title-max\'>\
        <span class=\'popup-title\'>六项污染物</span>\
        <span class=\'popup-title\' id="main-pollutants">首要污染物 SO2</span>\
        </span>\
        <img id=\'popup-close\' src=\'../demo/images/close.png\'>\
    </div>\
    <div id=\'popup-bottom\'>\
        <div id=\'popup-span-left\'>\
            <div style=\'padding-top: 10px;\'>\
                <button type=\'button\' id=\'hour-button\'>时</button>\
                <button type=\'button\' id=\'day-button\'>日</button>\
            </div>\
            <div class=\'div-value\'>\
                <p>PM2.5<img src=\'../demo/images/line2.png\'><input type=\'text\' id=\'PM2.5-input\'></p>\
                <p> PM10<img src=\'../demo/images/line2.png\'><input type=\'text\' id=\'PM10-input\'></p>\
            </div>\
            <div class=\'div-value\'>\
                <p>&ensp;&ensp;O3&ensp; <img src=\'../demo/images/line2.png\'><input type=\'text\' id=\'O3-input\'></p>\
                <p>&ensp;CO&ensp; <img src=\'../demo/images/line2.png\'><input type=\'text\' id=\'CO-input\'></p>\
            </div>\
            <div class=\'div-value\'>\
                <p> &ensp;SO2&ensp;<img src=\'../demo/images/line2.png\'><input type=\'text\' id=\'SO2-input\'></p>\
                <p> NO2&ensp;<img src=\'../demo/images/line2.png\'><input type=\'text\' id=\'NO2-input\'></p>\
            </div>\
            <button id=\'button-caculate\'>计算</button>\
        </div>\
        <div id=\'popup-span-right\'>\
            <div style="background-color: #1e1e1e;">\
                <span>\
                    <p id=\'composite-index-value\' style=\'font-size: 15px;\'>78.23</p>\
                    <p class=\'composite-index-word\' style=\'font-size: 8px;\'> 综合指数</p>\
                </span>\
                <span style=\'width: 0.8px;height: 40px; background: #d4d4d4;margin-top: 9px;\'></span>\
                <span>\
                    <p id=\'aqi-index-value\' style=\'font-size: 15px;\'>89</p>\
                    <p class=\'aqi-index-word\' style=\'font-size: 8px;\'> AQI指数</p>\
                </span>\
            </div>\
            <div id=\'div-value-chart\'></div>\
        </div>\
    </div>\
</div>\
'


// 弹窗的功能交互
function popupComput(latlng, hour_data, day_data) {
    var popup = (new L.ComputePopup(
        { className: 'compute-popup-max', maxWidth: '420px', closeButton: false, autoClose: false, closeOnEscapeKey: false, closeOnClick: false }))
        .setLatLng(latlng)
        .setContent(popupContent) // 弹窗内部的html文档内容
        .openOn(map);

    // 基于准备好的dom，初始化echarts实例
    var popup_chart = echarts.init(document.getElementById('div-value-chart'));

    console.log(hour_data);
    console.log(day_data);
    var first_click_day = true;
    // 指定图表的配置项和数据
    // var pie_data = [
    //     { value: 235, name: 'PM2.5' },
    //     { value: 274, name: 'PM10' },
    //     { value: 310, name: 'CO' },
    //     { value: 335, name: 'SO2' },
    //     { value: 400, name: 'O3' },
    //     { value: 120, name: 'NO2' }
    // ];
    // var option = new PieOptions()
    // // 使用刚指定的配置项和数据显示图表。
    // myChart.setOption(option);

    // 关闭按钮
    $("#popup-close").click(function () {
        popup.remove();
        on_compute_click = 0;
    });

    // 时按钮
    $("#hour-button").click(function () {
        this.style.backgroundColor = '#ff67ba';
        this.style.color = '#1e1e1e'
        $("#day-button").css('background-color', '#1e1e1e');
        $("#day-button").css('color', '#d4d4d4');
        popup_compute_ishour = true;
    });

    // 日按钮
    $("#day-button").click(function () {
        this.style.backgroundColor = '#ff67ba';
        this.style.color = '#1e1e1e';
        $("#hour-button").css('background-color', '#1e1e1e');
        $("#hour-button").css('color', '#d4d4d4');
        popup_compute_ishour = false;

        // 第一次点击日，应当初始化
        if (first_click_day == true) {
            // 初始化输入框
            for (var i = 0; i < 6; i++) {
                var aqi_data_name = aqi_name[i] + '-input'; // 输入框的id名字
                document.getElementById(aqi_data_name).value = day_data[i];
                console.log(document.getElementById(aqi_data_name))
            }
            // 输入框有值，就可以画饼图
            numberAndPie(popup_chart);
        }
    });

    // 计算按钮
    $("#button-caculate").click(function () {
        // 指定图表的配置项和数据
        // var data = [
        //     { value: 235, name: 'PM2.5' },
        //     { value: 224, name: 'PM10' },
        //     { value: 310, name: 'CO' },
        //     { value: 335, name: 'SO2' },
        //     { value: 200, name: 'O3' },
        //     { value: 420, name: 'NO2' }];
        numberAndPie(popup_chart);
    })

    // 初始化输入框
    for (var i = 0; i < 6; i++) {
        var aqi_data_name = aqi_name[i] + '-input'; // 输入框的id名字
        document.getElementById(aqi_data_name).value = hour_data[i];
        //  console.log(document.getElementById(aqi_data_name));
    }
    // 输入框有值，就可以画饼图
    numberAndPie(popup_chart);
}

function numberAndPie(popup_chart) {
    var six_data = getSixItems();
    if (six_data == null) {
        alert('请您正确输入数据');
    } else { // 输入合法
        // 指数计算
        var composite_indexs = getAQI(six_data);

        // 将数据处理成饼图数据
        var data_array = [];
        for (var p = 0; p < composite_indexs.length; p++) {
            data_array.push(
                { value: composite_indexs[p], name: aqi_name[p] }
            );
        }
        // 饼图设置
        var option = new PieOptions(data_array);
        // 使用刚指定的配置项和数据显示图表。
        popup_chart.setOption(option);
    }
}
// // add bindCustomPopup
// L.Layer.include({

//     // @method bindPopup(content: String|HTMLElement|Function|Popup, options?: Popup options): this
//     // Binds a popup to the layer with the passed `content` and sets up the
//     // neccessary event listeners. If a `Function` is passed it will receive
//     // the layer as the first argument and should return a `String` or `HTMLElement`.
//     bindCustomPopup: function (content, options) {

//         if (content instanceof L.Popup) {
//             L.setOptions(content, options);
//             this._popup = content;
//             content._source = this;
//         } else {
//             if (!this._popup || options) {
//                 this._popup = new L.ComputePopup(options, this);
//             }
//             this._popup.setContent(content);
//         }

//         if (!this._popupHandlersAdded) {
//             this.on({
//                 click: this._openPopup,
//                 remove: this.closePopup,
//                 move: this._movePopup
//             });
//             this._popupHandlersAdded = true;
//         }

//         return this;
//     }
// });