var popup_compute_ishour = true; // 标记选中的是时计算，还是日计算

// 污染物名字
var aqi_name = ['SO2', 'NO2', 'PM10', 'CO', 'O3', 'PM2.5'];

// 获得常规六项的输入值
function getSixItems() {
    var six_items = []
    for (var i = 0; i < 6; i++) {
        var aqi_data_name = aqi_name[i] + '-input'; // 输入框的id名字
        var value = document.getElementById(aqi_data_name).value;
        if (value == null || value == '' || isNaN(value)) {
            // 输入不合法
            return null;
        } else {
            six_items.push(value); // 输入框的值
        }
    }
    return six_items;
}

// 参与日所乘系数
var aqi_day_index = [
    [1.0, 0.5, '2/13', '2/13', 0.125, 0.2, '5/26'], // SO2
    [1.25, 1.25, 0.5, 0.5, '10/57', '20/37', '10/19'],// NO2
    [1.0, 0.5, 0.5, 0.5, '10/7', 1.25, 1.0], // PM10
    [25.0, 25.0, 5.0, 5.0, '25/3', '25/3', '25/3'], // CO
    [0.5, '5/6', '10/11', 1.0, '20/107', 0.5, 0.5], //O3
    ['10/7', 1.25, 1.25, '10/7', 1.0, 1.0, '2/3'] // PM2.5
];

// 参与日等级
var aqi_day_level = [
    [0, 50, 150, 475, 800, 1600, 2100], // SO2
    [0, 40, 80, 180, 280, 565, 750], // NO2
    [0, 50, 150, 250, 350, 420, 500], // PM10
    [0, 2, 4, 14, 24, 36, 48],// CO
    [0, 100, 160, 215, 265, 800, 1000], // O3
    [0, 35, 75, 115, 150, 250, 350] // PM2.5
];

// 参与小时所乘系数
var aqi_hour_index = [
    ['1/3', '1/7', '1/3', '1/3', 0.125, 0.5, '5/26'], // SO2
    [0.5, 0.5, 0.1, 0.1, '5/57', '2/15', '2/15'],// NO2
    [1.0, 0.5, 0.5, 0.5, '10/7', 1.25, 1.0], // PM10
    [10.0, 10.0, 2.0, 2.0, '10/3', '10/3', '10/3'], // CO
    ['5/16', '5/4', 0.5, 0.5, 0.25, 0.5, 0.5], //O3
    ['10/7', 1.25, 1.25, '10/7', 1.0, 1.0, '2/3'] // PM2.5
];

// 参与小时等级
var aqi_hour_level = [
    [0, 150, 500, 650, 800, 1600, 2100], // SO2
    [0, 100, 200, 700, 1200, 2340, 3090], // NO2
    [0, 50, 150, 250, 350, 420, 500], // PM10
    [0, 5, 10, 35, 60, 90, 120], // CO
    [0, 160, 200, 300, 400, 800, 1000], // O3
    [0, 35, 75, 115, 150, 250, 350] // PM2.5
];

// 起点指数
var aqi_start = [0.0, 50.0, 100.0, 150.0, 200.0, 300.0, 400.0];
// 浓度限制
var concentration_limit = [150.0, 80.0, 150.0, 4.0, 160.0, 75.0];

// 'SO2', 'NO2', 'PM10', 'CO', 'O3', 'PM2.5'
var daily_standard = [150.0, 80.0, 150.0, 4.0, 160.0, 75.0];
var hour_standard = [500.0, 200.0, 150.0, 10.0, 200.0, 75.0];


// 进行AQI的计算
function getAQI(six_items) {
    // console.log(popup_compute_ishour);

    var composite_indexs = [];
    var composite_sum = 0.0;
    var max_aqi = 0; // 用来存放每个污染物的aqi
    var max_aqi_name = '';
    // var composite_index = 0; // 用来存放每个污染物的分指数占比
    for (var i = 0; i < 6; i++) {
        var aqi_data_value = six_items[i]; // 获得污染物的值
        var aqi_data_level, aqi_data_index;
        // console.log(aqi_data_value);
        var composite_param;

        if (popup_compute_ishour) {
            aqi_data_level = aqi_hour_level[i]; // 获得参与时该污染物的等级
            aqi_data_index = aqi_hour_index[i];
            // 综合指数标准
            composite_param = hour_standard[i];
        } else {
            aqi_data_level = aqi_day_level[i];// 获得参与日该污染物的等级
            aqi_data_index = aqi_day_index[i];
            // 综合指数标准
            composite_param = daily_standard[i];
        }

        var aqi_p = 0; // 等级
        for (var j = 0; j < 7; j++) { // find p
            if (aqi_data_level[j] > aqi_data_value) {
                aqi_p = j - 1; // 记录等级
                break; // 结束循环
            }
        }
        // 计算各项综合指数
        composite_indexs[i] = parseFloat(aqi_data_value) / composite_param;
        // console.log(composite_indexs[i]);
        // 计算总的综合指数
        composite_sum = composite_sum + composite_indexs[i];

        aqi_data_index = aqi_data_index[aqi_p]; // 获得该等级下的指数
        var start = aqi_start[aqi_p]; // 起点指数
        var aqi; // 记录计算好的该项污染物的AQI
        if (isNaN(aqi_data_index)) {
            var index = aqi_data_index.split('/');
            aqi = aqi_data_value * parseFloat(index[0]) / parseFloat(index[1]) + start;
        } else { // index 已经做好除法，直接乘
            aqi = aqi_data_value * aqi_data_index + start;
        }

        if (aqi > max_aqi) { // 哪一个的IAQI就是首要污染物AQI
            max_aqi = aqi;
            max_aqi_name = aqi_name[i];
        }
        // composite_index = composite_index + aqi / concentration_limit[i]; // 计算综合指数

    }
    // console.log(composite_index)

    // 填充首要污染物
    document.getElementById('main-pollutants').innerHTML = '首要污染物 ' + max_aqi_name;
    // 填充综合指数
    document.getElementById('composite-index-value').innerHTML = composite_sum.toFixed(3);
    // 填充AQI指数
    document.getElementById('aqi-index-value').innerHTML = max_aqi.toFixed(0);

    // 返回综合指数，便于花饼图
    return composite_indexs;
}