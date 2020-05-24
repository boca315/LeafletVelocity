// 存放网址变量
// 日期，加入网址中
var mydate = new Date();
var date_now = mydate.getTime();
var now_date = "11/1/2019"; // 为了现在测试，设置的假时间
var date_1 = "";  // 1天以前的日期
var date_2 = "";  // 2天以前的日期
var date_3 = "";  // 2天以前的日期
var date_4 = "";  // 4天以前的日期
var date_5 = "";  // 5天以前的日期

// 网址
var baseurl = "http://120.27.223.134:8080"
// var baseurl = ".."

// 风向图
// var windy_now_url = "http://localhost:8888/data/wind-test.json";
var windy_now_url = "../data/wind-test.json";
var windy_1_url = ""
var windy_2_url = ""
var windy_3_url = ""
var windy_4_url = ""
var windy_5_url = ""

// 气压图，等压线
// var pressure_now_url = "http://localhost:8888/data/isoline-test2.json"
var pressure_now_url = "../data/isoline-test.json"

// AQI PM25 PM10 SO2 NO2 O3 CO
//  0   1     2   3   4   5  6
var AQIs_now_url = [];
var AQIs_param = ['AQI', 'PM25', 'PM10', 'SO2', 'NO2', 'O3', 'CO']
for (var i = 0; i < 7; ++i) {

    AQIs_now_url[i] = baseurl + "/normal?param=" + AQIs_param[i] + '&date=11/1/2019&hour=12';
    console.log(AQIs_now_url[i])

}
