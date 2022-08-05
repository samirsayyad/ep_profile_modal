const padMessageHandler = require('ep_etherpad-lite/node/handler/PadMessageHandler');
const sessioninfos =
  require('ep_etherpad-lite/node/handler/PadMessageHandler').sessioninfos;

exports.sendToRoom = (msg) => {
  // Todo write some buffer handling for protection and to stop DDoS
  // -- myAuthorId exists in message.
  const bufferAllows = true;
  if (bufferAllows) {
    // This is bad..  We have to do it because ACE hasn't redrawn by the time the chat has arrived
    setTimeout(() => {
      try {
        padMessageHandler.handleCustomObjectMessage(msg, false, (error) => {
          // console.log(error)
          // TODO: Error handling.
        });
      } catch (error) {
        console.log(error);
      }
    }, 100);
  }
};

exports.sendToUser = (msg, client) => {
  const sessionID = sessioninfos[client.id].sessionID;

  // Todo write some buffer handling for protection and to stop DDoS --
  // myAuthorId exists in message.
  const bufferAllows = true;
  if (bufferAllows) {
    // This is bad..  We have to do it because
    // ACE hasn't redrawn by the time the chat has arrived
    setTimeout(() => {
      padMessageHandler.handleCustomObjectMessage(msg, sessionID, (error) => {
        // console.log(error)
        // TODO: Error handling.
      });
    }, 100);
  }
};
