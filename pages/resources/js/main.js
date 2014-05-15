$(document).ready(function(){

    var server = io.connect();
    
    server.on('connect', function(data) {
    	nickname = prompt("What is your nickname?");
    	
    	if(typeof nickname == 'undefined' || nickname.length <= 0) {
    		nickname = "Anonymous";
    	}
    	
    	$('.textNick').val(nickname);
    	
    	insertNick(nickname);
    	
    	server.emit('join', nickname);
    	
    	$('.textMessage').focus();
	});
    
    server.on("chat",function(data){
    	insertMessage(data.split(':')[0],data.split(':')[1]);
    });
	
    server.on("join",function(data){
    	if(data!=null) {
    		insertNick(data);
        	$('.chatBody ul').append("<li class='msgBalloon msgBalloonInOut'><span class='nickMsg'>"+data+"</span> entrou na conversa...</li>");
    	}	
    });
    
    server.on("disconnect",function(data) {
    	if(data) {
    		$('.chatBody ul').append("<li class='msgBalloon msgBalloonInOut'><span class='nickMsg'>"+data+"</span> saiu da conversa...</li>");
        	$('.chatBody').scrollTop($('.chatBody')[0].scrollHeight); 
        	removeNick(data);
    	}	
    });
    
    $('.submitMsg').on("click",function() {
    	sendMessage();
    });
    
    $('.textMessage').keypress(function(e){
    	if(e.which == 13) {
    		sendMessage();
        }
    })
    
    var removeNick = function (who) {
    	$("li[data-nick='"+who+"']").empty();
    	$("li[data-nick='"+who+"']").remove();
    } 
    
    var insertMessage = function(who,msg) {
    	$('.chatBody ul').append("<li class='msgBalloon'><span class='nickMsg'>"+who+"</span>: "+msg+"</li>");
    	$('.chatBody').scrollTop($('.chatBody')[0].scrollHeight); 
    }
    
    var sendMessage = function() {
    	var message = $('.textMessage').val();
    	if(typeof message!='undefined' && (message.length > 0 || message != '')) {
    		insertMessage('Me',message);
    		server.emit('message', message);
    		$('.textMessage').val('');
    		$('.textMessage').focus();
    	}
    }
    
    var insertNick = function(nick) {
    	$('.peopleListChat ul').append("<li data-nick='"+nick+"'>"+nick+"</li>");
    }
   
});
