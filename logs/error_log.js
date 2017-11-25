var fs = require('fs');
module.exports = function(err){
  var d = new Date();
  var n = d.toUTCString();
  fs.appendFile(__dirname+"/log.txt", err+'--->'+n, function(err) {
        if(err) {
            return console.log(err);
        }
	console.log(err);
        console.log("The file was saved!");
    }); 

}
