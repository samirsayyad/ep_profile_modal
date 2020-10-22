var shared = require("../shared")

exports.documentReady = function(hooks, context, cb) {
    if (context !== "admin/ep_profile_modal") {
        return cb;
    }

    var socket,
    loc = document.location,
    port = loc.port == "" ? (loc.protocol == "https:" ? 443 : 80) : loc.port,
    url = loc.protocol + "//" + loc.hostname + ":" + port + "/",
    pathComponents = location.pathname.split("/"),
    // Strip admin/plugins
    baseURL = pathComponents.slice(0, pathComponents.length - 2).join("/") + "/",
    resource = baseURL.substring(1) + "socket.io";

    var room = url + "pluginfw/admin/ep_profile_modal";

    var changeTimer;


    //connect
    socket = io.connect(room, {path: baseURL + "socket.io", resource: resource});
    socket.on("load-settings-result", function (data) {
    
        console.log(data)
        shared.setFormData( $("#settings-form") , data)
    })

    $("#save-settings").on("click",function(){
        var data = shared.getFormData( $("#settings-form"))
        console.log(data,"data")
        socket.emit("save-settings",data);
        alert("Succesfully saved.")
    });

    socket.emit("load-settings");


 






    return cb;

}
