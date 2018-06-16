	var CaptchaService9kw = "http://www.9kw.eu/grafik/form_base64.html";
	var freebitcoinurl = 'https://freebitco.in/';
	var freebitcoindomain = 'freebitco.in';

	var start9kw = null; //for control of 9kw process
    var iabRef = null;  //browser for freebitcoin
	var View9kw = null; //browser for 9kw
	var datasitekey = null; //save datasitekey from freebitcoin site
	var answerforcaptcha = null; //save captcha answer get from 9kw
	var autobotuse;
	var i = 1;	var passornot = null;
	
	//Define steps in freebitco.in website
	function getdatasitekey()
	{
		iabRef.executeScript({code: "document.getElementsByClassName('g-recaptcha')[0].getAttribute('data-sitekey');"},function(value){datasitekey = value[0];});
	}
	
	function InputCaptchaAnswer()
	{
		iabRef.executeScript({code: "(function() { var x = document.getElementById('g-recaptcha-response');x.style.display='';})()"});
		iabRef.executeScript({code: "document.getElementById('g-recaptcha-response').value='"+answerforcaptcha+"';"});
		setTimeout(ClickRoll, 1000);
	}
	
	function ClickRoll()
	{
		iabRef.executeScript({code: "document.getElementById('free_play_form_button').click();"});
	}
	
	function testPass()
	{
		//time_remaining
		iabRef.executeScript({code: "document.getElementById('free_play_error').innerHTML;"},function(value){passornot = value[0];});
	}
	
	function ForTheNextRoll()
	{
		answerforcaptcha=null;	datasitekey = null;  passornot = null;
		setTimeout(testPass, 7000);
		
		setTimeout(rollcheck, 10000);
		setTimeout(function(){iabRef.close()}, 12000);
	}
	
	function rollcheck()
	{
		//Debug
		//alert("testPass get:"+passornot);
		
		if(passornot=="")
			{autobotuse = setTimeout(myFunction, 3600000);} //Set 1hr for the next roll
		
		else if(passornot=='Captcha is incorrect or has expired. Please try again.')
			{setTimeout(myFunction, 5000);} //Set 5sec for the next roll
		else
			{
				startVibrate();
				play_sound();
				alert("testPass get:"+passornot+"\n Please check the problem and restart the autorun!");
			}
	}
		
	//Event Trigger in freebitco.in site
    function iabLoadStart(event) 
	{
        //alert(event.type + ' - ' + event.url);
    }	
	
	function iabLoadStop(event) 
	{
		if(answerforcaptcha!=null && autobottimes.value!=null)
		{
			InputCaptchaAnswer();
			setTimeout(ForTheNextRoll, 8000);
		}
		
		else if(answerforcaptcha!=null && autobottimes.value==null)
		{
			InputCaptchaAnswer();
			setTimeout(function(){iabRef.close()}, 6000);
			setTimeout(function(){answerforcaptcha=null;}, 8000);
		}	
		else
		{
			getdatasitekey();
			setTimeout(function(){ iabRef.close();}, 6000);
			setTimeout(function(){ Show9kwWeb();}, 8000);
		}
	}
	
	function iabLoadError(event) 
	{
		alert(event.type + ' - ' + event.message);
		setTimeout(function(){ iabRef.close();}, 3000);
	}
        
    function iabClose(event) 
	{
         iabRef.removeEventListener('loadstart', iabLoadStart);
         iabRef.removeEventListener('loadstop', iabLoadStop);
         iabRef.removeEventListener('loaderror', iabLoadError);
         iabRef.removeEventListener('exit', iabClose);
    }
	
	//Put all events into freebitcoin site trigger
	function openfreebitcoin()
	{
		 //alert("inappbrowser 有啟動!");     
		 iabRef = cordova.InAppBrowser.open(freebitcoinurl, '_blank', 'location=no');
         iabRef.addEventListener('loadstart', iabLoadStart);
		 //指定使用者登入時間
		if(getCookie('firsttimein')!='1')
		{
			alert("第一次請先登入freebitcoin帳號! 給您60秒登入~");		
			setTimeout(function(){ setCookie('firsttimein','1',300);}, 40000);
			setTimeout(function(){ iabRef.addEventListener('loadstop', iabLoadStop);}, 60000);
		}		 
		 else
		 {
			iabRef.addEventListener('loadstop', iabLoadStop);	 
		 }
		 
         iabRef.addEventListener('loaderror', iabLoadError);
         iabRef.addEventListener('exit', iabClose);		
	}
	
	//Define Steps in 9kw
	function check9kwstatus()
	{
		if(answerforcaptcha==null)
		{View9kw.executeScript({code: "document.getElementsByName('result')[0].value;"},function(value){answerforcaptcha = value;});}
		
		else
		{View9kw.close();}
	}

	function Input9kwSetting()
	{
		View9kw.executeScript({code: "document.getElementsByName('apikey')[0].value='"+getCookie('apikeyforsolve')+"';"});
		View9kw.executeScript({code: "document.getElementsByName('prio')[0].value='5';"});
		View9kw.executeScript({code: "document.getElementsByName('interactive')[0].checked = true;"});
		View9kw.executeScript({code: "document.getElementsByName('base64')[0].checked = false;"});
		View9kw.executeScript({code: "document.getElementsByName('nomd5')[0].checked = true;"});
		View9kw.executeScript({code: "document.getElementsByName('maxtimeout')[0].value='300';"});
		View9kw.executeScript({code: "document.getElementsByName('source')[0].value='imacros';"});
		View9kw.executeScript({code: "document.getElementsByName('oldsource')[0].value='recaptchav2';"});
		View9kw.executeScript({code: "document.getElementsByName('pageurl')[0].value='freebitco.in';"});
		View9kw.executeScript({code: "document.getElementsByName('file-upload-01')[0].value='"+datasitekey+"';"});
		start9kw = '1';

		View9kw.executeScript({code: "document.getElementById('newsubmit').click();"});
	}
	
	//Event Trigger in 9kw site
	function LoadStart9kw(event)
	{
		//alert(event.type + ' - ' + event.url);
	}
	
	function LoadStop9kw(event)
	{	
	
		//No datasitekey, no waste of time
		if(datasitekey==null)
		{
			View9kw.close();
			//For Debug
			//alert("No datasitekey found!");
			if(autobottimes.value!=null)
			{
				autobotuse = setTimeout(myFunction, 10000); //Set 10sec for the next roll since it's not ready now
			}
			
		}		
		
		if(start9kw==null)
		{
			Input9kwSetting();
		}
		
		else
		{
			check9kwstatus();
			setTimeout(function(){ check9kwstatus();}, 3000);
		}
	}
	
	function Close9kw(event)
	{
		//For Debug
		//alert('Captcha Answer Load:'+ answerforcaptcha +'\n temp flag:'+start9kw);
		start9kw = null;
		
		if(answerforcaptcha!=null)
		{setTimeout(openfreebitcoin, 5000);}
	}
	
	function Show9kwWeb()
	{
		View9kw = cordova.InAppBrowser.open(CaptchaService9kw, '_blank', 'location=no');
		View9kw.addEventListener('loadstart', LoadStart9kw);
		View9kw.addEventListener('loadstop', LoadStop9kw);
		View9kw.addEventListener('loaderror', iabLoadError);
		View9kw.addEventListener('exit', Close9kw);		
	}
	
	//Initiate all function
	function myFunction()
	{
		startVibrate();
		play_sound();
		autobottimes.value = i;
		openfreebitcoin();
		i++;			
	}
	
	
	//Start all loop--這段碼還有問題
	function startautobot()
	{
		alert("Autobot 開始!");
		myFunction();
	}
	
	function stopautobot()
	{
		clearTimeout(autobotuse);
		i=1;	autobottimes.value = null;	datasitekey = null;
		alert("取消自動");
		//clearInterval(autobotuse);	
	}
	
	//Set vibration and sound
	function play_sound()
	{
		$('#nextsoundplay')[0].currentTime = 0;
		$('#nextsoundplay')[0].play();
	}
	
	function startVibrate() 
	{
		navigator.vibrate(500);
	}