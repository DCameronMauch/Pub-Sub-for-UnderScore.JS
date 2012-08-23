_.mixin(function(){
  var psdb={};
  function publish(topic){
    var message=_.toArray(arguments).slice(1);
    _.each(psdb[topic],function(callback){
      callback.apply(this,message);
    });
  }
  function subscribe(topic,callback){
    psdb[topic]=_.union(psdb[topic]||[],[callback]);
  }
  function unsubscribe(topic,callback){
    psdb[topic]=_.without(psdb[topic],callback);
  }
  function multisub(topics,callback,reset,clear){
    if(typeof(reset)!='boolean') reset=true;
    if(typeof(clear)!='boolean') clear=false;
    var msdb={};
    _.each(topics,function(topic){
      msdb[topic]=false
      subscribe(topic,function(){
        msdb[topic]=_.toArray(arguments);
        if(clear) unsubscribe(topic,arguments.callee);
        if(_.all(msdb,_.identity)){
          callback.apply(this,_.values(msdb));
          if(reset) _.each(topics,function(topic){
            msdb[topic]=false
          });
        }
      });
    });
  }
  return({
    publish:publish,
    subscribe:subscribe,
    unsubscribe:unsubscribe,
    multisub:multisub
  });
}());