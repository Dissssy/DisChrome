function getValue(callback) {
	chrome.storage.sync.get(["SAVEDATA"], callback);
}
function createForm(defaulturl, defaultid, defaultname, defaultpfp){	
	//create form
	var form = document.createElement("form");
	form.setAttribute("id", i);
	
	//create url input
	var urlinput = document.createElement("input");
	urlinput.setAttribute("autofill", "false");
	urlinput.setAttribute("type", "text");
	urlinput.setAttribute("id", "url" + i);
	urlinput.setAttribute("placeholder", "webhook url");
	urlinput.setAttribute("name", "url");
	urlinput.setAttribute("value", defaulturl);
	
	//create id input
	var idinput = document.createElement("input");
	idinput.setAttribute("style", "margin-left:5px");
	idinput.setAttribute("autofill", "false");
	idinput.setAttribute("type", "text");
	idinput.setAttribute("id", "id" + i);
	idinput.setAttribute("placeholder", "server name (optional)");
	idinput.setAttribute("name", "id");
	idinput.setAttribute("value", defaultid);
	
	//create name input
	var nameinput = document.createElement("input");
	nameinput.setAttribute("style", "margin-left:5px");
	nameinput.setAttribute("autofill", "false");
	nameinput.setAttribute("type", "text");
	nameinput.setAttribute("id", "name" + i);
	nameinput.setAttribute("placeholder", "name to post as (optional)");
	nameinput.setAttribute("name", "name");
	nameinput.setAttribute("value", defaultname);
	
	//create pfp input
	var pfpinput = document.createElement("input");
	pfpinput.setAttribute("style", "margin-left:5px");
	pfpinput.setAttribute("autofill", "false");
	pfpinput.setAttribute("type", "text");
	pfpinput.setAttribute("id", "pfp" + i);
	pfpinput.setAttribute("placeholder", "pfp to use (url) (optional)");
	pfpinput.setAttribute("name", "pfp");
	pfpinput.setAttribute("value", defaultpfp);
	
	//append everything
	form.appendChild(urlinput);
	form.appendChild(idinput);
	form.appendChild(nameinput);
	form.appendChild(pfpinput);
	document.getElementsByTagName("body")[0].getElementsByTagName("div")[0].appendChild(form);
}
getValue(function (value){
	try{
		USERDATA = JSON.parse(value.SAVEDATA);
	}catch{
		alert(value.SAVEDATA + " is not a valid JSON string \n this may be your first time using the extension, if so, welcome \n you can ignore this. \n if this is not your first time, i recommend you copy this and try to salvage the info to save some time");
		USERDATA = JSON.parse("{}");
	}

	if(USERDATA.hasOwnProperty("idcount")){
		var idcount = parseInt(USERDATA.idcount);
	}else{
		var idcount = 0;
	}
	for(i = 1; i < idcount + 1; i++){
		//getting default values
		if(USERDATA.hasOwnProperty(i)){
			if(USERDATA[i].hasOwnProperty("url")){
				defaulturl = USERDATA[i].url;
			}else{
				defaulturl = ""
			}
			if(USERDATA[i].hasOwnProperty("id")){
				defaultid = USERDATA[i].id;
			}else{
				defaultid = ""
			}
			if(USERDATA[i].hasOwnProperty("name")){
				defaultname = USERDATA[i].name;
			}else{
				defaultname = ""
			}
			if(USERDATA[i].hasOwnProperty("pfp")){
				defaultpfp = USERDATA[i].pfp;
			}else{
				defaultpfp = ""
			}
		}else{
			defaulturl = ""
			defaultid = ""
			defaultname = ""
			defaultpfp = ""
		}
		createForm(defaulturl, defaultid, defaultname, defaultpfp);
	}

	$(function(a){
		$(":submit").click(function(){
			var pressed = $(this).attr('id');
			if(pressed == "ADDFORM"){
				createForm("", "", "", "");
				idcount = idcount + 1;
			}
			if(pressed == "SUBTRACTFORM"){
				if(document.getElementsByTagName("form").length > 0){
					document.getElementsByTagName("form")[document.getElementsByTagName("form").length - 1].remove();
					idcount = idcount - 1;
				}else{
					alert("NOTHING TO REMOVE");
				};
			};
			if(pressed == "SUBMITFORMS"){
				var Form = {"idcount" : idcount};
				for(i = 1; i < idcount + 1; i++){
					Form[i] = {};
					Form[i].url = $('#url' + i).val();
					Form[i].id = $('#id' + i).val();
					Form[i].name = $('#name' + i).val();
					Form[i].pfp = $('#pfp' + i).val();
				};
				chrome.storage.sync.set({'SAVEDATA': JSON.stringify(Form)}, function(){
					//alert("settings saved")
					chrome.runtime.reload(); 
				});
			};
		});
	});
});