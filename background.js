function getValue(callback) {
  chrome.storage.sync.get(['SAVEDATA'], callback);
};

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

getValue(function (value) {
	try{
		USERDATA = JSON.parse(value.SAVEDATA);
	}catch{
		return false;
	};
	if(USERDATA.hasOwnProperty("idcount")){
		var idcount = parseInt(USERDATA.idcount);
	}else{
		return false;
	};
	for(i = 1; i < idcount + 1; i++){
		var url = USERDATA[i].url;
		var name = USERDATA[i].name;
		if(name != ""){
			var id = "Post to " + USERDATA[i].id;
		}else{
			var id = "Post"
		};
		if(url != ""){
			chrome.contextMenus.create({"id": "" + i, "title": id, "contexts": ["image", "link", "selection", "video", "audio"]});
		};
	};
	chrome.contextMenus.onClicked.addListener(function(clickData){
		clicked = clickData.menuItemId
		var clickedurl = USERDATA[clicked].url;
		var clickedname = USERDATA[clicked].name;
		var clickedpfp = USERDATA[clicked].pfp;
		stringtopost = "";
		if(clickData.hasOwnProperty('srcUrl')){
			stringtopost = stringtopost + " " + clickData.srcUrl
		}else if(clickData.hasOwnProperty('linkUrl')){
			stringtopost = stringtopost + " " + clickData.linkUrl
		}else if(clickData.hasOwnProperty('selectionText')){
			stringtopost = stringtopost + " " + clickData.selectionText
		};
		if (stringtopost.length <= 2000) {
			postit(clickedurl, stringtopost, clickedname, clickedpfp);
		}else{
			alert(stringtopost.length + " characters is too long, discord only allows 2000 maximum");
		}
	});
});