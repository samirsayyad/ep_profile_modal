var padMessageHandler = require("ep_etherpad-lite/node/handler/PadMessageHandler");
var sessioninfos = require("ep_etherpad-lite/node/handler/PadMessageHandler").sessioninfos

exports.sendToRoom = function(msg){
    var bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
    if(bufferAllows){
      setTimeout(function(){ // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
        try{
          padMessageHandler.handleCustomObjectMessage(msg, false, function(error){
            //console.log(error)
            // TODO: Error handling.
          })
        }catch(error){
          console.log(error)
  
        }
        
      }
      , 100);
    }
  }

  exports.sendToUser = function(msg,client){
    var sessionID = sessioninfos[client.id].sessionID
    
    var bufferAllows = true; // Todo write some buffer handling for protection and to stop DDoS -- myAuthorId exists in message.
    if(bufferAllows){
      setTimeout(function(){ // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
        try{
          padMessageHandler.handleCustomObjectMessage(msg, sessionID, function(error){
            //console.log(error)
            // TODO: Error handling.
          })
        }catch(error){
          console.log(error)
  
        }
        
      }
      , 100);
    }
  }
