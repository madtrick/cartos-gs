var EasySheet;

EasySheet = (function(){
  var MAX_COLUMNS = 27;
  var CHART_COLUMNS = 5;
  var CHART_ROWS = 22;
  var BATCH_ROW_INCREASE = 100;
  
  function EasySheet(name, sheet, options){
    this.sheet = sheet;
    this.name = name;
    
    // This coordinates set the area of the sheet that's currently used
    this.rightBottomCoordinates = {row : 1, column : 1};
    this.leftTopCoordinates = { row : 1, column : 1};
    
    // This holds the maximun number of rows set
    // while moving to the right
    this.maxHeightInLine = 1;
    
    // This holds the maximun number of columns for this sheet
    this.maxColumns = options ? (options.maxColumns ? options.maxColumns : MAX_COLUMNS) : MAX_COLUMNS
    
    if ( this.sheet.getMaxColumns() < this.maxColumns )
      this.sheet.insertColumnsAfter(this.sheet.getMaxColumns(), this.maxColumns - this.sheet.getMaxColumns());
  };
  
  EasySheet._easySheets = [];
  
  EasySheet.getSheet = function (name){
    var easySheet = _.find(this._easySheets, function(sheet){ return sheet.name == name; });    
    if ( easySheet )
      return easySheet;
    
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);     
    if (!sheet)
      sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet(name);
      
    easySheet = new EasySheet(name, sheet);
    this._easySheets.push(easySheet);
    
    return easySheet;
  };
  
  EasySheet.prototype.clear = function(){
    this.sheet.clear();
    var charts = this.sheet.getCharts();
    for (var index in charts) {
      var chart = charts[index];
      this.sheet.removeChart(chart);
    }
    
    return this;
  };
  
  EasySheet.prototype.setRange = function(range){
    return this._setValues(range.getHeight(), range.getWidth(), values);
  };
  
  EasySheet.prototype.setValues = function(values){
    return this._setValues(values.length, values[0].length, values); // Assume all rows are the same width
  };
  
  EasySheet.prototype.getChartBuilder = function(){
    return this.sheet.newChart();    
  };
  
  EasySheet.prototype.setChart = function(builder){
    if ( this.leftTopCoordinates.column + CHART_COLUMNS > this.maxColumns ) {
      this.leftTopCoordinates.column = 1;
      this.leftTopCoordinates.row += this.maxHeightInLine;
    }
    
    this._ensureSheetHasEnoughRows(CHART_ROWS);
    
    builder.setPosition(this.leftTopCoordinates.row, this.leftTopCoordinates.column, 0, 0);
    this.sheet.insertChart(builder.build());
    
    this.leftTopCoordinates.column += CHART_COLUMNS;
    this.maxHeightInLine = CHART_ROWS;
  };
  
  EasySheet.prototype.breakLine = function(){
    this.leftTopCoordinates.column = 1;
    this.leftTopCoordinates.row += this.maxHeightInLine;
    this.maxHeightInLine = 1;
  }
  
  EasySheet.prototype._setValues = function(rows, columns, values){
    if ( this.leftTopCoordinates.column + columns > this.maxColumns ) {
      this.leftTopCoordinates.column = 1;
      this.leftTopCoordinates.row += this.maxHeightInLine;
      this.maxHeightInLine = 1;
    }
    
    this._ensureSheetHasEnoughRows(rows);

    var range = this.sheet.getRange(this.leftTopCoordinates.row, this.leftTopCoordinates.column, rows, columns);
    range.setValues(values);
  
    if ( rows > this.maxHeightInLine ) this.maxHeightInLine = rows;
    this.leftTopCoordinates.column += columns;
              
    return range;
  };
  
  EasySheet.prototype._ensureSheetHasEnoughRows = function (rowsIncrease, columnsIncrease){
    if ( this.leftTopCoordinates.row + rowsIncrease > this.sheet.getMaxRows() )
      this.sheet.insertRowsAfter(this.sheet.getMaxRows(), BATCH_ROW_INCREASE);
  }
  
  return EasySheet;
})();