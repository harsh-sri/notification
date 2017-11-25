var express = require('express');
var pool      = require('../config/poolcon');
var err_log = require('../logs/error_log');

module.exports = function(app, io){

  io.on('connection', function(socket){
        var socketInfo = {};
        socketInfo.socketId = socket.id;
        socketInfo.userId = socket.handshake.query.userId;
        updateUserSocketId(socketInfo);

    
    // trigger Notifications
    socket.on('trigger_notification', function(data, callback){
      if(typeof data.userToId !== 'undefined' && data.userToId !==""){
        pool.getConnection(function(err,connection){
            let qry = "Select users.socketId FROM users where users.id="+data.userToId;
            connection.query(qry, function(err, rows){
                if(err){
                    callback(err);
                    err_log(err.msg);
                }
                if(rows && rows.length>0){
                    callback(rows);
                    let notiData = {};
                    notiData.count = rows.length;
                    notiData.postType = data.postType;
                    io.to(rows[0].socketId).emit('got_notification', notiData);
                }
                else
                callback(false);
                connection.release();
         });
                  
        });
      }
    });

    // handle disconnect event
    socket.on('disconnect', function(){
      // user went offline
      if(typeof socketId !== 'undefined'){
        update_connected_user(socketId, origin, function(res){
          io.to(res).emit('disconnect_user');
        });
      }
    });

  }); // io closed
  
  let updateUserSocketId = function(data){
       console.log(data);
        if(typeof data.socketId !== 'undefined' && typeof data.userId !== 'undefined'){
            pool.getConnection(function(err,connection){
                connection.query("UPDATE users set socketId='"+data.socketId+"', isOnline=1 WHERE users.`id`="+data.userId, function(err){
                    if(err){
                        console.log(err);
                        err_log(err);
                    }
                    console.log('update user socketyId function.....');
                    
                });
                connection.release()
                return true;
            });
        }
        return false;
        
    };

    var updateSeenStatus = function(data){
        if(typeof data.userToId !== 'undefined'){
            pool.getConnection(function(err,connection){
                connection.query("UPDATE messages_reply set status=1 WHERE messages_reply.`user_id_to`="+data.userToId, function(err){
                    if(err){
                        err_log(err);
                        console.log(err);
                    }
                    connection.release();
                });
            });
        }
    };

    


};

Date.prototype.today = function () { 
    return  this.getFullYear()+"-"+(((this.getMonth()+1) < 10)?"0":"") + (this.getMonth()+1) +"-"+ ((this.getDate() < 10)?"0":"") + this.getDate();
};

// For the time now
Date.prototype.timeNow = function () {
     return ((this.getHours() < 10)?"0":"") + this.getHours() +":"+ ((this.getMinutes() < 10)?"0":"") + this.getMinutes() +":"+ ((this.getSeconds() < 10)?"0":"") + this.getSeconds();
};

function splitValue(value, index) {
    return value.substring(index);
}




