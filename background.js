//function call to get data from chrome
function getValue(callback) {
  chrome.storage.sync.get(['SAVEDATA'], callback);
};

//helper function to create and fulfill post request to discord webhook
function postit(webhook, content, postname, postpfp) {
	var request = new XMLHttpRequest();
	request.open("POST", webhook);
	request.setRequestHeader('Content-type', 'application/json');
	var params = {
		username: postname,
		avatar_url: postpfp,
		content: content
	};
	request.send(JSON.stringify(params));
};

//main code, run in the chrome function callback
getValue(function (value) {
	
	//attempt to parse the data recieved from chrome, if its not valid, assume the user is new and cancel execution
	try{
		USERDATA = JSON.parse(value.SAVEDATA);
	}catch{
		return false;
	};
	
	//attempt to read the idcount, if that fails, something is wrong, cancel execution
	if(USERDATA.hasOwnProperty("idcount")){
		var idcount = parseInt(USERDATA.idcount);
	}else{
		return false;
	};
	
	//loop through every id
	for(i = 1; i < idcount + 1; i++){
		var url = USERDATA[i].url;
		var name = USERDATA[i].name;
		//name is optional, handle if that field is empty by removing "to"
		if(name != ""){
			var id = "Post to " + USERDATA[i].id;
		}else{
			var id = "Post"
		};
		//create context menu item if this id has a url
		if(url != ""){
			chrome.contextMenus.create({"id": "" + i, "title": id, "contexts": ["image", "link", "selection", "video", "audio"]});
		};
	};
	//add listener for the context menu items
	chrome.contextMenus.onClicked.addListener(function(clickData){
		//get all of the click data (for readability)
		clicked = clickData.menuItemId
		var clickedurl = USERDATA[clicked].url;
		var clickedname = USERDATA[clicked].name;
		var clickedpfp = USERDATA[clicked].pfp;
		//create and fill string to post
		stringtopost = "";
		if(clickData.hasOwnProperty('srcUrl')){
			stringtopost = stringtopost + " " + clickData.srcUrl
		}else if(clickData.hasOwnProperty('linkUrl')){
			stringtopost = stringtopost + " " + clickData.linkUrl
		}else if(clickData.hasOwnProperty('selectionText')){
			stringtopost = stringtopost + " " + clickData.selectionText
		};
		//check if string to post is below 2k characters (discord hard limit) if it is below that, call post helper function to post content
		if (stringtopost.length <= 2000) {
			postit(clickedurl, stringtopost, clickedname, clickedpfp);
		}else{
			//if string is too long, alert user that it is too long and dont post
			alert(stringtopost.length + " characters is too long, discord only allows 2000 maximum");
		}
	});
});