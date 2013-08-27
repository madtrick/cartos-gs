var TaggedValuesCollection;

TaggedValuesCollection = (function(){
  function TaggedValuesCollection(values){
    this.values = values;
    this.cache = {};
  };
  
  TaggedValuesCollection.prototype.match = function(tags, options) {
    var cacheKey = tags.join();
    var values;
    
    if ( this.cache[cacheKey] )
      return this.cache[cacheKey];
    
    values = _.filter(this.values, function(value){return value.match(tags, options);});
    this.cache[cacheKey] = values;
    
    return values;
  };
  
  return TaggedValuesCollection;
})();