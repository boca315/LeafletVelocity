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
        thumbHeight: "8px",
        labelWidth: "80px",
        betweenLabelAndRangeSpace: "20px",

        labelFontSize: "14px",
        activeColor: "rgba(225,225,225,.9)",
        inactiveColor: "rgba(225,225,225,.9)",

        backgroundOpacity: 0.75,
        backgroundColor: "#555555",

        topBgPadding: "10px",
        bottomBgPadding: "0px",
        rightBgPadding: "30px",
        leftBgPadding: "30px",

    },

    initialize: function (options) {
        console.log("init");
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
        console.log("add");
        this.linum=-1;
        this.map = map;
        this.curValue=1;
        this.sheet = document.createElement('style');
        document.body.appendChild(this.sheet);

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

        // this.sheet.textContent = this.setupStartStyles("");

        /* When input gets changed change styles on slider and trigger user's changeMap function */
        L.DomEvent.on(this.rangeInput, "input", function() {


            that.sheet.textContent += that.getTrackStyle(this, that.sliderLength);
            var curLabel = that.rangeLabelArray[curValue-1].innerHTML;

            // Change map according to either current label or value chosen
            mapParams = {value: curValue, label: curLabel, map: map}
            allChangeMapParameters = {...mapParams, ...that.options.extraChangeMapParams};
            that.options.changeMap(allChangeMapParameters);
            this.curValue = this.value;
        });

        // Add click event to each label so it triggers input change for corresponding value
        for (li of this.rangeLabelArray) {
            L.DomEvent.on(li, "click", function (e) {
                var targetli = e.target;
                var index = that.rangeLabelArray.indexOf(targetli);
                that.rangeInput.value = index + 1;
                // console.log(index)
                // console.log(that.rangeInput.value)
                var inputEvent = new Event('input');
                that.rangeInput.dispatchEvent(inputEvent);

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
            transition: background .3s;
            height:${this.thumbSize}px;
            border-radius: 500px;
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


getDataAddMarkers = function( {label, value, map, exclamation} ) {
    // console.log("aaaa")
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }

    });

    // filteredData = data.features.filter(function (i, n) {
    //     console.log(i.properties.title);
    //     return i.properties.title===label; // timelineItems
    // });

    $.getJSON('../data/bubble-test.json', function (data) {
        console.log("render")
        var mycolors = ['#6a9955', '#e5da82', '#e36c09', '#ff0000', '#e773fc', '#840c18'];
        var cfg = {
            nums: 6, // 颜色个数，即等级数
            colors: mycolors, // 每个等级对应的颜色
            fontSize: '13px', // 字体大小
            fontColor: '#cccccc', //字体颜色
            src: 'images/AQI指标条形图.png'
        };

        var templayer = new BubblesOverlay(cfg);
        // 将图层加入地图
        // layerControl.addOverlay(templayer, 'AQI');
        // 加入数据
        templayer.setData(data);

    });
};
