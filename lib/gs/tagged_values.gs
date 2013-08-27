var TaggedValues;

TaggedValues = (function(){
  function TaggedValues(tags, values){
    this.tags = tags;
    this.values = values;
  }
  
  TaggedValues.prototype.match = function(tags, options){
    var matches = false;
    
    var temp = _.intersection(this.tags, tags)
    
    if ( temp.length === 0){
      return false;
    }
    
    if ( options && options.all )
      if ( temp.length === this.tags.length )
        return true;
    else{
        return false;
    }
    else
      return true;
    
//    _.each(tags, function(tag){
//      
//      if( _.contains(this.tags, tag) )
//        matches = true;
//      else if (options && options.all)
//        matches = false;
//     
//    }, this);
//    
//    return true;
  };
  
  return TaggedValues;
})();