module.exports = function(doc){
  if(typeof doc.type !== "string"){
      throw({forbidden:'type is required'}) 
  } 
}