!function(global){"use strict";function shadeColor(color,shade){var f=parseInt(color.slice(1),16),t=0>shade?0:255,p=0>shade?-1*shade:shade,R=f>>16,G=f>>8&255,B=255&f,converted=16777216+65536*(Math.round((t-R)*p)+R)+256*(Math.round((t-G)*p)+G)+(Math.round((t-B)*p)+B);return"#"+converted.toString(16).slice(1)}var D3Funnel=function(selector){this.selector=selector,this.defaults={width:350,height:400,bottomWidth:1/3,bottomPinch:0,isCurved:!1,curveHeight:20,fillType:"solid",isInverted:!1,hoverEffects:!1,dynamicArea:!1,animation:!1,label:{fontSize:"14px",fill:"#fff"}}};D3Funnel.prototype.__isArray=function(value){return"[object Array]"===Object.prototype.toString.call(value)},D3Funnel.prototype.__extend=function(a,b){var prop;for(prop in b)b.hasOwnProperty(prop)&&(a[prop]=b[prop]);return a},D3Funnel.prototype.draw=function(data,options){this.__initialize(data,options),d3.select(this.selector).selectAll("svg").remove(),this.svg=d3.select(this.selector).append("svg").attr("width",this.width).attr("height",this.height).append("g"),this.sectionPaths=this.__makePaths(),"gradient"===this.fillType&&this.__defineColorGradients(this.svg),this.isCurved&&this.__drawTopOval(this.svg,this.sectionPaths),this.__drawSection(0)},D3Funnel.prototype.__drawSection=function(index){if(index!==this.data.length){var group=this.svg.append("g"),path=this.__getSectionPath(group,index);if(path.data(this.__getSectionData(index)),this.animation!==!1){var self=this;path.transition().duration(this.animation).ease("linear").attr("fill",this.__getColor(index)).attr("d",this.__getPathDefinition(index)).each("end",function(){self.__drawSection(index+1)})}else path.attr("fill",this.__getColor(index)).attr("d",this.__getPathDefinition(index)),this.__drawSection(index+1);this.hoverEffects&&path.on("mouseover",this.__onMouseOver).on("mouseout",this.__onMouseOut),this.onItemClick&&path.on("click",this.onItemClick),this.__addSectionLabel(group,index)}},D3Funnel.prototype.__getColor=function(index){return"solid"===this.fillType?this.data[index][2]:"url(#gradient-"+index+")"},D3Funnel.prototype.__getSectionPath=function(group,index){var path=group.append("path");return this.animation!==!1&&this.__addBeforeTransition(path,index),path},D3Funnel.prototype.__addBeforeTransition=function(path,index){var paths=this.sectionPaths[index],beforePath="",beforeFill="";beforePath=this.isCurved?"M"+paths[0][0]+","+paths[0][1]+" Q"+paths[1][0]+","+paths[1][1]+" "+paths[2][0]+","+paths[2][1]+" L"+paths[2][0]+","+paths[2][1]+" M"+paths[2][0]+","+paths[2][1]+" Q"+paths[1][0]+","+paths[1][1]+" "+paths[0][0]+","+paths[0][1]:"M"+paths[0][0]+","+paths[0][1]+" L"+paths[1][0]+","+paths[1][1]+" L"+paths[1][0]+","+paths[1][1]+" L"+paths[0][0]+","+paths[0][1],beforeFill=this.__getColor("solid"===this.fillType?index>0?index-1:index:index),path.attr("d",beforePath).attr("fill",beforeFill)},D3Funnel.prototype.__getSectionData=function(index){return[{index:index,label:this.data[index][0],value:this.data[index][1],baseColor:this.data[index][2],fill:this.__getColor(index)}]},D3Funnel.prototype.__getPathDefinition=function(index){for(var pathStr="",point=[],paths=this.sectionPaths[index],j=0;j<paths.length;j++)point=paths[j],pathStr+=point[2]+point[0]+","+point[1]+" ";return pathStr},D3Funnel.prototype.__addSectionLabel=function(group,index){var i=index,paths=this.sectionPaths[index],textStr=this.data[i][0]+": "+this.data[i][1].toLocaleString(),textFill=this.data[i][3]||this.label.fill,textX=this.width/2,textY=this.isCurved?(paths[2][1]+paths[3][1])/2+this.curveHeight/this.data.length:(paths[1][1]+paths[2][1])/2;group.append("text").text(textStr).attr({x:textX,y:textY,"text-anchor":"middle","dominant-baseline":"middle",fill:textFill,"pointer-events":"none"}).style("font-size",this.label.fontSize)},D3Funnel.prototype.__initialize=function(data,options){if(!this.__isArray(data)||0===data.length||!this.__isArray(data[0])||data[0].length<2)throw{name:"D3 Funnel Data Error",message:"Funnel data is not valid."};options="undefined"!=typeof options?options:{},this.data=data;var i=0,settings=this.__extend({},this.defaults);settings.width=parseInt(d3.select(this.selector).style("width"),10),settings.height=parseInt(d3.select(this.selector).style("height"),10);var keys=Object.keys(options);for(i=0;i<keys.length;i++)"label"!==keys[i]&&(settings[keys[i]]=options[keys[i]]);if("label"in options){var labelOption,validLabelOptions=/fontSize|fill/;for(labelOption in options.label)labelOption.match(validLabelOptions)&&(settings.label[labelOption]=options.label[labelOption])}this.label=settings.label,settings.width<=0&&(settings.width=this.defaults.width),settings.height<=0&&(settings.height=this.defaults.height);var colorScale=d3.scale.category10();for(i=0;i<this.data.length;i++){var hexExpression=/^#([0-9a-f]{3}|[0-9a-f]{6})$/i;"2"in this.data[i]&&hexExpression.test(this.data[i][2])||(this.data[i][2]=colorScale(i))}this.width=settings.width,this.height=settings.height,this.bottomWidth=settings.width*settings.bottomWidth,this.bottomPinch=settings.bottomPinch,this.isCurved=settings.isCurved,this.curveHeight=settings.curveHeight,this.fillType=settings.fillType,this.isInverted=settings.isInverted,this.hoverEffects=settings.hoverEffects,this.dynamicArea=settings.dynamicArea,this.animation=settings.animation,this.bottomLeftX=(this.width-this.bottomWidth)/2,this.dx=this.bottomPinch>0?this.bottomLeftX/(data.length-this.bottomPinch):this.bottomLeftX/data.length,this.dy=this.isCurved?(this.height-this.curveHeight)/data.length:this.height/data.length,this.onItemClick=settings.onItemClick},D3Funnel.prototype.__makePaths=function(){var paths=[],dx=this.dx,dy=this.dy,prevLeftX=0,prevRightX=this.width,prevHeight=0;this.isInverted&&(prevLeftX=this.bottomLeftX,prevRightX=this.width-this.bottomLeftX);var nextLeftX=0,nextRightX=0,nextHeight=0,middle=this.width/2;this.isCurved&&(prevHeight=10);for(var topBase=this.width,bottomBase=0,totalArea=this.height*(this.width+this.bottomWidth)/2,slope=2*this.height/(this.width-this.bottomWidth),totalCount=0,count=0,i=0;i<this.data.length;i++)totalCount+=this.data[i][1];for(i=0;i<this.data.length;i++){if(count=this.data[i][1],this.dynamicArea){var ratio=count/totalCount,area=ratio*totalArea;bottomBase=Math.sqrt((slope*topBase*topBase-4*area)/slope),dx=topBase/2-bottomBase/2,dy=2*area/(topBase+bottomBase),this.isCurved&&(dy-=this.curveHeight/this.data.length),topBase=bottomBase}this.bottomPinch>0&&(this.isInverted?(this.dynamicArea||(dx=this.dx),dx=i<this.bottomPinch?0:dx):i>=this.data.length-this.bottomPinch&&(dx=0)),nextLeftX=prevLeftX+dx,nextRightX=prevRightX-dx,nextHeight=prevHeight+dy,this.isInverted&&(nextLeftX=prevLeftX-dx,nextRightX=prevRightX+dx),paths.push(this.isCurved?[[prevLeftX,prevHeight,"M"],[middle,prevHeight+(this.curveHeight-10),"Q"],[prevRightX,prevHeight,""],[nextRightX,nextHeight,"L"],[nextRightX,nextHeight,"M"],[middle,nextHeight+this.curveHeight,"Q"],[nextLeftX,nextHeight,""],[prevLeftX,prevHeight,"L"]]:[[prevLeftX,prevHeight,"M"],[prevRightX,prevHeight,"L"],[nextRightX,nextHeight,"L"],[nextLeftX,nextHeight,"L"],[prevLeftX,prevHeight,"L"]]),prevLeftX=nextLeftX,prevRightX=nextRightX,prevHeight=nextHeight}return paths},D3Funnel.prototype.__defineColorGradients=function(svg){for(var defs=svg.append("defs"),i=0;i<this.data.length;i++)for(var color=this.data[i][2],shade=shadeColor(color,-.25),gradient=defs.append("linearGradient").attr({id:"gradient-"+i}),stops=[[0,shade],[40,color],[60,color],[100,shade]],j=0;j<stops.length;j++){var stop=stops[j];gradient.append("stop").attr({offset:stop[0]+"%",style:"stop-color:"+stop[1]})}},D3Funnel.prototype.__drawTopOval=function(svg,sectionPaths){var leftX=0,rightX=this.width,centerX=this.width/2;this.isInverted&&(leftX=this.bottomLeftX,rightX=this.width-this.bottomLeftX);var paths=sectionPaths[0],path="M"+leftX+","+paths[0][1]+" Q"+centerX+","+(paths[1][1]+this.curveHeight-10)+" "+rightX+","+paths[2][1]+" M"+rightX+",10 Q"+centerX+",0 "+leftX+",10";svg.append("path").attr("fill",shadeColor(this.data[0][2],-.4)).attr("d",path)},D3Funnel.prototype.__onMouseOver=function(data){d3.select(this).attr("fill",shadeColor(data.baseColor,-.2))},D3Funnel.prototype.__onMouseOut=function(data){d3.select(this).attr("fill",data.fill)},global.D3Funnel=D3Funnel}(window);