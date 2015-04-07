define(["qlik","jquery","underscore","./properties","./initialproperties","./lib/js/extensionUtils","text!./lib/css/style.css","./lib/external/colorbrewer/colorbrewer","./lib/external/d3/d3.min","./lib/external/d3-funnel/d3-funnel"],function(qlik,$,_,props,initProps,extensionUtils,cssContent,colorbrewer){"use strict";function ensureTarget($elem,layout){$elem.addClass("container"),$elem.empty();var $target=$(document.createElement("div"));$target.attr("id","chart_"+layout.qInfo.qId),$target.addClass("chart"),$elem.append($target)}function render($elem,layout){function funnel_onItemClick(d){var fld=layout.qHyperCube.qDimensionInfo[0].qGroupFieldDefs[0],app=qlik.currApp();app.field(fld).selectValues([d.label],!0,!1)}ensureTarget($elem,layout);var options={width:$elem.width(),height:$elem.height(),isInverted:layout.props.chartInverted,isCurved:layout.props.chartCurved,bottomPinch:layout.props.chartBottomPinch,hoverEffects:!0,label:{fontsize:"10px"},onItemClick:funnel_onItemClick},funnelChart=new D3Funnel("#chart_"+layout.qInfo.qId),data=transformData(layout);funnelChart.draw(data,options)}function transformData(layout){var data=null;if(layout.qHyperCube&&layout.qHyperCube.qDataPages[0].qMatrix){var data=[],i=0,l=layout.qHyperCube.qDataPages[0].qMatrix.length;_.each(layout.qHyperCube.qDataPages[0].qMatrix,function(row){var rowVals=[];rowVals.push(row[0].qText),rowVals.push(row[1].qNum),l>=3&&rowVals.push(colorbrewer.Paired[l][i]),data.push(rowVals),i++})}return data}return extensionUtils.addStyleToHeader(cssContent),{definition:props,initialProperties:initProps,snapshot:{canTakeSnapshot:!0},resize:function($element,layout){render($element,layout)},paint:function($element,layout){render($element,layout)}}});