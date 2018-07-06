var fs = require('fs');
var process = require('process');

fs.open("/Users/haocai/Documents/nandemei/bin/test/log.txt",'w',function(err, fd){
	console.log(fd);
	while(true)
	{
		fs.write(fd,process.pid+"\n",function(){});
	}
});