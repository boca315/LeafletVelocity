$(function () {
    let controls=document.getElementsByClassName("leaflet-control-layers");
    let bodrderRadius="20px"
    controls[0].style.borderTopLeftRadius=bodrderRadius;
    controls[0].style.borderTopRightRadius=bodrderRadius;
    controls[controls.length-1].style.borderBottomLeftRadius=bodrderRadius;
    controls[controls.length-1].style.borderBottomRightRadius=bodrderRadius;
    // 设置按钮图标
    controls[1].background='url("asset/drop.svg") no-repeat 4px 15px';
    controls[2].background='url("../asset/temperature.svg") no-repeat 4px 15px';
    controls[3].background='url("../asset/wind.svg") no-repeat 4px 15px';

    var ctls = $.map(controls, (v,i)=> {return [v];});
    ctls.forEach((ct)=>{
        ct.style.display="block";
    })

    $(".leaflet-touch").click( ()=>{
        $(this).addClass("onselect").siblings().removeClass("onselect");
        console.log($(this).className)
        // $(".products .main").eq($(this).index()).show().siblings().hide();
    })

})
