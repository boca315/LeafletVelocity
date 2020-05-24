// TODO: parameterize timeline colors, overall length, and length between points (css styles)
L.Control.TimeLineSlider = L.Control.extend({

    options: {
        position: 'bottomleft',
        timelineItems: ["Today", "Tomorrow", "The Next Day"],

        changeMap: function({label, value, map}) {
            console.log("You are not using the value or label from the timeline to change the map.");
        },
        extraChangeMapParams: {},
        initializeChange: true,
        tmLineWidth:"700px",
        playBtWidth:"30",
        thumbHeight: "8px",
        labelWidth: "80px",
        betweenLabelAndRangeSpace: "20px",
        timerInterval:200,

        labelFontSize: "14px",
        activeColor: "#e5e5e5",
        inactiveColor: "#555555",
        // activeColor: "red",
        // inactiveColor: "blue",

        backgroundOpacity: 0.75,
        backgroundColor: "#555555",

        topBgPadding: "10px",
        bottomBgPadding: "0px",
        rightBgPadding: "30px",
        leftBgPadding: "30px",

    },

    initialize: function (options) {
        // console.log("init");
        if (typeof options.changeMap != "function") {
            options.changeMap = function ({label, value, map}) {
                console.log("You are not using the value or label from the timeline to change the map.");
            };
        }

        if (parseFloat(options.thumbHeight) <= 2) {
            console.log("The nodes on the timeline will not appear properly if its radius is less than 2px.")
        }

        L.setOptions(this, options);
    },
    onAdd: function(map) {
        // console.log("add");
        this.isPlaying=false;
        this.linum=-1;
        this.map = map;
        this.lastValue=1;
        this.sheet = document.createElement('style');
        document.body.appendChild(this.sheet);
        this.keypoint=this.options.timelineItems;
        this.options.timelineItems=[]
        for (let i = 0; i < this.keypoint.length; i++) {
            this.options.timelineItems.push.apply(this.options.timelineItems,[...Array(99)].map(_=>0));
            this.options.timelineItems.push(this.keypoint[i])
        }


        this.container = L.DomUtil.create('div', 'control_container timelineBox');

        /* Prevent click events propagation to map */
        L.DomEvent.disableClickPropagation(this.container);

        /* Prevent right click event propagation to map */
        L.DomEvent.on(this.container, 'control_container', function (ev)
        {
            L.DomEvent.stopPropagation(ev);
        });

        /* Prevent scroll events propagation to map when cursor on the div */
        L.DomEvent.disableScrollPropagation(this.container);

        /*create play button*/
        this.play=L.DomUtil.create('div','play',this.container);
        this.play.innerHTML=`<button class="playBt"></button>`;
        this.playButton=L.DomUtil.get(this.play).children[0];

        /* Create html elements for input and labels */
        this.slider = L.DomUtil.create('div', 'range', this.container);
        this.slider.innerHTML = `<input id="rangeinputslide" type="range" min="1" max="${this.options.timelineItems.length}" steps="1" value="1"></input>`

        this.rangeLabels = L.DomUtil.create('ul', 'range-labels', this.container);

        this.rangeLabels.innerHTML = this.options.timelineItems.map((item) => {
            this.linum++
            return `<li id="item-${this.linum}">` + item + "</li>"
        }).join('');

        this.rangeInput = L.DomUtil.get(this.slider).children[0];
        this.rangeLabelArray = Array.from(this.rangeLabels.getElementsByTagName('li'));
        this.sliderLength = this.rangeLabelArray.length;

        this.thumbSize = parseFloat(this.options.thumbHeight) * 1;
        // double the thumb size when its active
        this.activeThumbSize = this.thumbSize * 2;

        // make the width of the range div holding the input the number of intervals * the label width and add the thumb size on either end of the range
        this.rangeWidthCSS = parseFloat(this.options.labelWidth) * (this.options.timelineItems.length-1) + (this.thumbSize*2);

        // move labels over to the left so they line up; move half the width of the label and adjust for thumb radius
        this.rlLabelMargin = parseFloat(this.options.labelWidth)/2 - (parseFloat(this.options.thumbHeight)/2);

        // 2.5 because that is half the height of the range input
        this.topLabelMargin = parseFloat(this.options.betweenLabelAndRangeSpace) - parseFloat(this.options.thumbHeight) - 2.5;

        this.backgroundRGBA = this.hexToRGBA(this.options.backgroundColor, this.options.backgroundOpacity);
        this.coverBackgroundRGBA = this.hexToRGBA(this.options.backgroundColor, 0);

        that = this;

        /*add click event to play button*/
        L.DomEvent.on(this.playButton,"click",function(e){
            that.isPlaying=((that.isPlaying&&true)===true)?false:true;

            console.log(that.isPlaying);
            if(that.isPlaying){ //play
                console.log("playnow");
                e.target.className+=" playBtActive";

                this.timer=setInterval(()=>{
                    if(that.rangeInput.value >= that.linum){
                        clearInterval(this.timer);
                        that.playButton.className="playBt";
                    }
                    var curLb = that.rangeLabelArray[that.rangeInput.value-1].innerHTML;
                    let mapParams = {value: that.rangeInput.value, label: curLb, map: map}
                    allChangeMapParameters = {...mapParams, ...that.options.extraChangeMapParams};
                    that.options.changeMap(allChangeMapParameters);
                    that.rangeInput.value++;
                    var inputEvent = new Event('input');
                    that.rangeInput.dispatchEvent(inputEvent);

                },that.options.timerInterval);

            }else{//stop
                console.log("stopnow");
                e.target.className="playBt";
                clearInterval(this.timer);
            }
        });

        /* When input gets changed change styles on slider and trigger user's changeMap function */
        L.DomEvent.on(this.rangeInput, "input", function(e) {
            if(this.value==1|| that.isPlaying) {
                let curValue = this.value;
                let toValue = Math.ceil(curValue / 100) * 100

                that.sheet.textContent += that.getTrackStyle(this, that.sliderLength);
                var curLabel = that.rangeLabelArray[curValue - 1].innerHTML;

                // Change map according to either current label or value chosen
                mapParams = {value: curValue, label: curLabel, map: map}
                allChangeMapParameters = {...mapParams, ...that.options.extraChangeMapParams};
                that.options.changeMap(allChangeMapParameters);
                this.curValue = this.value;
                that.lastValue = this.curValue;
            }else{
                e.preventDefault();
                let curValue = this.value;
                let toValue = Math.ceil(curValue / 100) * 100
                for (let i = that.lastValue; i <= curValue; i++) {
                    $('#rangeinputslide')[0].value=i;
                }
                that.sheet.textContent += that.getTrackStyle(this, that.sliderLength);
                var curLabel = that.rangeLabelArray[toValue - 1].innerHTML;

                // Change map according to either current label or value chosen
                mapParams = {value: toValue, label: curLabel, map: map}
                allChangeMapParameters = {...mapParams, ...that.options.extraChangeMapParams};
                that.options.changeMap(allChangeMapParameters);
                this.curValue = this.value;
                that.lastValue = this.curValue;
            }

        });

        // Add click event to each label so it triggers input change for corresponding value
        for (li of this.rangeLabelArray) {
            L.DomEvent.on(li, "click", function (e) {
                // if(that.isPlaying) return;
                var targetli = e.target;
                var index = that.rangeLabelArray.indexOf(targetli);
                that.rangeInput.value = index + 1;
                // console.log("trig click on li "+index);
                var inputEvent = new Event('input');
                that.rangeInput.dispatchEvent(inputEvent);
                console.log(that.playButton.className);
                that.playButton.className="playBt";

            });
        };

        // Initialize input change at start
        if (this.options.initializeChange) {
            var inputEvent = new Event('input');
            this.rangeInput.dispatchEvent(inputEvent);
        }

        return this.container;

    },

    onRemove: function() {
        // remove control html element
        L.DomUtil.remove(this.container);
    },

    hexToRGBA: function(hex, opacity){
        // from https://stackoverflow.com/questions/21646738/convert-hex-to-rgba
        var c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+opacity+')';
        }
        throw new Error('Bad Hex');
    },

    setupStartStyles: function(url) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(link);

    },

    getTrackStyle: function (el, sliderLength) {
        prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

        var curVal = el.value,
            labelIndex = curVal - 1,
            val = (labelIndex) * (100/(sliderLength-1)),
            coverVal = (parseFloat(that.thumbSize)/that.rangeWidthCSS) * 100;
        style = '';

        // Remove active and selected classes from all labels
        for (li of that.rangeLabelArray) {
            L.DomUtil.removeClass(li, 'active');
            L.DomUtil.removeClass(li, 'selected');
        }

        // Find label that should be active and give it appropriate classes
        var curLabel = that.rangeLabelArray[labelIndex];
        L.DomUtil.addClass(curLabel, 'active');
        L.DomUtil.addClass(curLabel, 'selected');

        // For labels before active label, add selected class
        for (i = 0; i < curVal; i++) {
            L.DomUtil.addClass(that.rangeLabelArray[i], 'selected');
        }

        // Change background gradient
        style += `.range {
            background: linear-gradient(to right, ${that.coverBackgroundRGBA} 0%, ${that.coverBackgroundRGBA} ${coverVal}%, ${that.options.activeColor} ${coverVal}%, ${that.options.activeColor} ${val}%,  ${that.coverBackgroundRGBA} 0%, ${that.coverBackgroundRGBA} 100%);
            height:${this.thumbSize}px;
            border-radius: 500px;
            display: inline-block;
            width:${this.options.tmLineWidth};
            }`;
        style+=`.range-labels{
        width:${this.options.tmLineWidth};
        }`;
        style += `input[type="range"]{ /*清除自带样式*/
            -webkit-appearance: none;
            overflow:hidden;     
            outline : none;     
            background:none;
            }
            #rangeinputslide{
            -webkit-appearance: none;
            overflow:hidden;    
            outline : none;     
            background:none;
            margin: 0;
            }`;
        for (var i = 0; i < prefs.length; i++) {

            style += '.range input::-' + prefs[i] + `{
            background: linear-gradient(to right, ${that.coverBackgroundRGBA} 0%, ${that.coverBackgroundRGBA} ${coverVal}%, ${that.options.activeColor} 0%, ${that.options.activeColor} ${val}%, ${that.options.inactiveColor} ${val}%, ${that.options.inactiveColor} ${100-coverVal}%, ${that.coverBackgroundRGBA} ${100-coverVal}%, ${that.coverBackgroundRGBA} 100%);
            transition: background-color .3s;
            height:${this.thumbSize}px;
            width:100%;
            transition: .3s;
            border-radius: 500px;
            }`;

            style +=''
        }

        return style;
    }

})

L.control.timelineSlider = function(options) {
    return new L.Control.TimeLineSlider(options);
}


// mapParams = {value: curValue, label: curLabel, map: map}
// allChangeMapParameters = {...mapParams, ...that.options.extraChangeMapParams};
getDataAddMarkers = function( {label, value, map, exclamation} ) {
    // console.log(label);//Day1
    // console.log(value);//1
    // console.log(map);
    //// console.log(exclamation);
    // console.log(map.layers);
    if(label!=="0") {
        map.eachLayer(function (layer) {
            /**
             * layer instanceof L.velocityLayer
             * L.idwLayer
             *
             * **/
            if (layer instanceof L.Marker) { //是小工具
                console.log(layer)
                // map.removeLayer(layer);
            } else {//reset layer's data
                let file = '';
                if (layer.layerType !== undefined) {
                    // if (layer.layerType === "heatLayer") { // heatmap 热力图
                    //     heatLayerChangeTest(layer, value, file)
                    // }
                    if (layer.layerType === "bubbleLayer") { //AQI
                        bubbleLayerChangeTest(layer, value, file)
                    }
                    if (layer.layerType === "isoLayer") { //等压线
                        isoLayerChangeTest(layer, value, file);
                    }

                } else if (layer instanceof L.IdwLayer) { // idw 插值图
                    idwLayerChangeTest(layer, value, file);
                } else { // leaflet-velocity 风向图
                    velocityLayerChangeTest(layer, value, file);
                }
            }
        });
    }

};
velocityLayerChangeTest=function(layer,value,file){
    switch((value/100)%2) {
        case 0:
            file='../data/wind2.json'
            break;
        case 1:
            file='../data/wind1.json'
            break;
        default:
            break;
    }
    console.log(file);
    $.getJSON(file, function (data) {
        layer.resetData(data);
    });
};
idwLayerChangeTest=function(layer,value,file){
    // console.log((value/10)%2);
    // let filenext='';//DATA FOR CACHE
    switch((value/100)%2) {
        case 0:
            file='../data/c-test.json'
            // filenext='../data/c-test1.json'
            break;
        case 1:
            file='../data/c-test1.json'
            // filenext='../data/c-test.json'
            break;
        default:
            break;
    }
    console.log(file);
    $.getJSON(file, function (data) {
        layer.resetData(value,data);
    });
    // $.getJSON(filenext, function (data) {
    //     layer.cacheNextData(data);
    // });
};
bubbleLayerChangeTest=function(layer,value,file){ // 1对3 4 不对
    /**
    * **/
    switch((value/100)%2) {
        case 0:
            file='http://120.27.223.134:8080/normal?param=PM10&date=11/1/2019&hour=12'
            break;
        case 1:
            file='http://120.27.223.134:8080/normal?param=SO2&date=11/1/2019&hour=12'
            break;
        default:
            break;
    }
    console.log(file);
    $.getJSON(file, function (data) {
        layer.resetData(data);
    });
};
heatLayerChangeTest=function(layer,value,file){ //2对的 1貌似不对
    switch((value/100)%2) {

        case 0:
            file='../data/heatmap-test.json'
            break;
        case 1:
            file='../data/heatmap-test2.json'
            break;
        default:
            break;
    }
    console.log(file);
    $.getJSON(file, function (data) {
        layer.resetData(data)
    });
};
isoLayerChangeTest=function(layer,value,file){
    switch((value/100)%2) {

        case 0:
            file='../data/isoline-test.json'
            break;
        case 1:
            file='../data/isoline-test2.json'
            break;
        default:
            break;
    }
    console.log(file);
    $.getJSON(file, function (data) {
        layer.resetData(data)
    });
};
