var EasyCharts;

EasyCharts = (function(){
  function EasyCharts(){};
  
//  EasyCharts.build = function (type, options){
//    switch(type)
//    {
//      case Charts.ChartType.COLUMN:
//        this._buildColumnChart(options.categories, options.months, options.expenses);
//        break;
//      default:
//        Logger.log("Unsupported chart type");
//    }
//  };
  
  EasyCharts.build2 = function (chartsConfig, data) {
    _.each(chartsConfig, function (config){      
      if (config.type === "categories")
        return EasyCharts._buildCategories(config, data);
      
      if (config.type === "months")
        return EasyCharts._buildMonths(config, data);
      
      if (config.type === "custom")
        return EasyCharts._buildCustom(config, data);
    });
  };
  
  
  EasyCharts._buildCategories = function(config, data) {
    var sheet  = EasySheet.getSheet(config.sheetName).clear();

    _.each(config.tags, function(tag){
      _.each(config.composers, function(composer){
        this._buildChart(sheet, composer.getType(), composer.getDatasource(tag, data.months, data.values).range());                     
      }, this);
      
      sheet.breakLine();
    }, this);
  };
  
  EasyCharts._buildMonths = function (config, data){
    var sheet = EasySheet.getSheet(config.sheetName).clear();
    
    _.each(config.months, function(month){
      _.each(config.composers, function(composer){
        this._buildChart(sheet, composer.getType(), composer.getDatasource(month, config.tags, data.values).range());                     
      }, this);
      
      sheet.breakLine();
    }, this);
  };
  
  EasyCharts._buildCustom = function (config, data){
    if (!config.builder) return;
    
    config.builder.build(EasyCharts, data);
  };
  
   EasyCharts._buildChart = function (sheet, type, range, options){
      var chartBuilder = sheet.getChartBuilder();
    
      chartBuilder = chartBuilder.setChartType(type)
      .addRange(range)
      // Found how to set the firs column as labels
      // look here: http://stackoverflow.com/questions/13594839/google-apps-script-how-to-set-use-column-a-as-labels-in-chart-embedded-in-spr
      .setOption('useFirstColumnAsDomain', true);
     
     if ( options) {
       if ( options.title ){
         chartBuilder.setOption("title", options.title);
       }
     }
    
      sheet.setChart(chartBuilder);
    };
  
  return EasyCharts;
})();
