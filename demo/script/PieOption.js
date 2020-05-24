// 将饼图的option封装成一个类
function PieOptions(data_array) {
    // data:
    // [
    //     { value: 235, name: 'PM2.5' },
    //     { value: 224, name: 'PM10' },
    //     { value: 310, name: 'CO' },
    //     { value: 335, name: 'SO2' },
    //     { value: 200, name: 'O3' },
    //     { value: 420, name: 'NO2' }
    // ]
    this.series = [
        {
            name: '污染物',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],  // 设置饼状图位置，第一个百分数调水平位置，第二个百分数调垂直位置
            data: data_array,
         //   roseType: 'angle',
            itemStyle: {
                normal: {
                    shadowBlur: 20,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                },
                // emphasis：英文意思是 强调;着重;（轮廓、图形等的）鲜明;突出，重读
                // emphasis：设置鼠标放到哪一块扇形上面的时候，扇形样式、阴影
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(30, 144, 255，0.5)'
                }
            },
            color: ['#834a13', '#bcbcb7', '#6f1282', '#085ca3', '#6d6912', '#0ea37f'],
            //设置值域的标签
            label: {
                normal: {
                    position: 'outer',  // 设置标签位置，默认在饼状图外 可选值：'outer' ¦ 'inner（饼状图上）'
                    formatter: '{b} : {d}%',   //设置标签显示内容 ，默认显示{b}
                    // {a}指series.name  {b}指series.data的name
                    // {c}指series.data的value  {d}%指这一部分占总数的百分比
                    textStyle: {
                        fontSize: 9,   //文字的字体大小
                        color: '#d4d4d4'
                    },
                }
            }
        }
    ];
};