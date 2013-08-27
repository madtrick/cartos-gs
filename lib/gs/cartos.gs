//var Summary;

Summary = (function(){
  var MONTH_NUMBERS_ROW = 1;
  var MONTH_NUMBER_START_COLUMN = 2;
  var CATEGORY_NAMES_COLUMN = 1;
  var CATEGORY_NAMES_START_ROW=2;
  
  
  function Summary(){
    var spreadSheet = SpreadsheetApp.getActiveSpreadsheet();
    this.sheet = spreadSheet.getSheetByName("summary");
  };
  
  Summary.prototype.numberOfMonths =  function(){
    if (this._numberOfMonths) return this._numberOfMonths;
    
    this._numberOfMonths = this.sheet.getLastColumn() - 1;
    return this._numberOfMonths;
  };
  
  Summary.prototype.numberOfCategories = function(){
    if (this._numberOfCategories) return this._numberOfCategories;
    
    this._numberOfCategories = 25; // LOL hardcoded value
    return this._numberOfCategories;
  };
    
  Summary.prototype.months= function(){
    if (this._months) return this._months;
    
    this._months = this.sheet.getRange(MONTH_NUMBERS_ROW, MONTH_NUMBER_START_COLUMN, 1, this.numberOfMonths()).getValues()[0];
    return this._months;
  };
  
  Summary.prototype.categories= function(){
    if (this._categories) return this._categories;
    
    this._categories = _.map(
      this.sheet.getRange(CATEGORY_NAMES_START_ROW, CATEGORY_NAMES_COLUMN, this.numberOfCategories(), 1).getValues(),
      function(row){return row[0]}
    );
    return this._categories;
  };

  
  Summary.prototype.expenses = function(){
    var values = [];
    var expensesValues = this.sheet.getRange(2, 2, this.numberOfCategories(), this.numberOfMonths()).getValues();
                                  
    _.each(this.categories(), function(category, categoryIndex){
      _.each(this.months(), function(month, monthIndex){
        values.push(new TaggedValues([category, month], expensesValues[categoryIndex][monthIndex]));
      }, this);
    }, this);
    
//    return values;
    return new TaggedValuesCollection(values);
  };

  return Summary;
})();

var Cartos = {};


function init(config){
  var summary = new Summary();
  
  Cartos.tmpSheet = config.tmpSheet;

  EasySheet.getSheet(config.tmpSheet).clear();
  EasyCharts.build2(config.charts, {months : summary.months(), categories : summary.categories(), values : summary.expenses()});
}