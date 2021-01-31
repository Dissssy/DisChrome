//function call to get data from chrome
function getValue(callback) {
	chrome.storage.sync.get(["SAVEDATA"], callback);
}

//helper function to create generic form objects
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
	idinput.setAttribute("autofill", "false");
	idinput.setAttribute("type", "text");
	idinput.setAttribute("id", "id" + i);
	idinput.setAttribute("placeholder", "server name (optional)");
	idinput.setAttribute("name", "id");
	idinput.setAttribute("value", defaultid);
	
	//create name input
	var nameinput = document.createElement("input");
	nameinput.setAttribute("autofill", "false");
	nameinput.setAttribute("type", "text");
	nameinput.setAttribute("id", "name" + i);
	nameinput.setAttribute("placeholder", "name to post as (optional)");
	nameinput.setAttribute("name", "name");
	nameinput.setAttribute("value", defaultname);
	
	//create pfp input
	var pfpinput = document.createElement("input");
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

//main code, run in the chrome function callback
getValue(function (value){
	
	//attempt to parse the data recieved from chrome, if its not valid, assume the user is new
	try{
		USERDATA = JSON.parse(value.SAVEDATA);
	}catch{
		USERDATA = JSON.parse("{}");
	}
	
	//attempt to read the idcount (used to keep track of how many inputs exist) if its not found, set it to 0
	if(USERDATA.hasOwnProperty("idcount")){
		var idcount = parseInt(USERDATA.idcount);
	}else{
		var idcount = 0;
	}
	
	//loop to get default data, then create prefilled input forms
	for(i = 1; i < idcount + 1; i++){
		
		//getting default values
		//check if the current form id property exists
		if(USERDATA.hasOwnProperty(i)){
			//check if current form has url property
			if(USERDATA[i].hasOwnProperty("url")){
				defaulturl = USERDATA[i].url;
			}else{
				defaulturl = ""
			}
			//check if current form has id property
			if(USERDATA[i].hasOwnProperty("id")){
				defaultid = USERDATA[i].id;
			}else{
				defaultid = ""
			}
			//check if current form has name property
			if(USERDATA[i].hasOwnProperty("name")){
				defaultname = USERDATA[i].name;
			}else{
				defaultname = ""
			}
			//check if current form has pfp property
			if(USERDATA[i].hasOwnProperty("pfp")){
				defaultpfp = USERDATA[i].pfp;
			}else{
				defaultpfp = ""
			}
		}else{
			//if this form id doesnt exist just set the values to blank
			defaulturl = ""
			defaultid = ""
			defaultname = ""
			defaultpfp = ""
		}
		//call create form helper with default values
		createForm(defaulturl, defaultid, defaultname, defaultpfp);
	}
	
	//form handler
	$(function(a){
		//activate when any button is pressed
		$(":submit").click(function(){
			//get which button is pressed and handle each button differently
			var pressed = $(this).attr('id');
			//add button is pressed, create new blank form, increment different form handler values
			if(pressed == "ADDFORM"){
				createForm("", "", "", "");
				i++;
				idcount = idcount + 1;
			}
			//subtract button is pressed, delete last form in list, decrement different form handler values, or alert that there are no more forms to remove
			if(pressed == "SUBTRACTFORM"){
				if(document.getElementsByTagName("form").length > 0){
					document.getElementsByTagName("form")[document.getElementsByTagName("form").length - 1].remove();
					i--;
					idcount = idcount - 1;
				}else{
					alert("NOTHING TO REMOVE");
				};
			};
			//submit button is pressed
			if(pressed == "SUBMITFORMS"){
				//set Form idcount key value to the form id count
				var Form = {"idcount" : idcount};
				//loop through each form on the page, read the data and write it to the form id value under form
				for(i = 1; i < idcount + 1; i++){
					Form[i] = {};
					Form[i].url = $('#url' + i).val();
					Form[i].id = $('#id' + i).val();
					Form[i].name = $('#name' + i).val();
					Form[i].pfp = $('#pfp' + i).val();
				};
				//turn Form object into a json string, save that to the SAVEDATA value in chrome storage, alert user that the settings have been saved, reload extension
				chrome.storage.sync.set({'SAVEDATA': JSON.stringify(Form)}, function(){
					alert("settings saved")
					chrome.runtime.reload(); 
				});
			};
		});
	});
});