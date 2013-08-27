var TagsTotalPerMonth;

TagsTotalPerMonth = (function(){
  function TagsTotalPerMonth(){};
  
  TagsTotalPerMonth.getDatasource = function (category, months, values){
    return new CategoryMonthlyExpenseBarChartDataSource(category, months, values);
  };
  
  TagsTotalPerMonth.getType = function (){ return Charts.ChartType.COLUMN};
  
  return TagsTotalPerMonth;
})();


var TagsTotalPerMonthWithMean;

TagsTotalPerMonthWithMean = (function(){
  function TagsTotalPerMonthWithMean(){};
  
  TagsTotalPerMonthWithMean.getDatasource = function (category, months, values){
    return new CategoryMonthlyWithMeanExpenseDataSource(category, months, values);
  };
  
  TagsTotalPerMonthWithMean.getType = function (){ return Charts.ChartType.LINE};
  
  return TagsTotalPerMonthWithMean;
})();


var TagsAccumulatedPerMonth;

TagsAccumulatedPerMonth = (function(){
  function TagsAccumulatedPerMonth(){};
  
  TagsAccumulatedPerMonth.getDatasource = function (category, months, values){
    return new CategoryMonthlyAccumulated(category, months, values);
  };
  
  TagsAccumulatedPerMonth.getType = function (){ return Charts.ChartType.AREA};
  
  return TagsAccumulatedPerMonth;
})();

var MonthTotalsPerTags;

MonthTotalsPerTags = (function(){
  function MonthTotalsPerTags(){};

  MonthTotalsPerTags.getDatasource = function (month, tags, values){
    return new CategoryExpenseDataSource(tags, month, values); 
  };
  
  MonthTotalsPerTags.getType = function (){ return Charts.ChartType.PIE; };
  
  return MonthTotalsPerTags;
})();

var SavingsFlowChartComposer = (function(){
  function SavingsFlowChartComposer(){};
  
  SavingsFlowChartComposer.getDatasource = function(months, values){
    return new SavingsFlowDataSource(months, values);
  };
  
  SavingsFlowChartComposer.getType = function(){ return Charts.ChartType.COLUMN; };
  
  return SavingsFlowChartComposer;
})();