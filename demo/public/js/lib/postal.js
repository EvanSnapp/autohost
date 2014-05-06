/*
 postal
 Author: Jim Cowart (http://freshbrewedcode.com/jimcowart)
 License: Dual licensed MIT (http://www.opensource.org/licenses/mit-license) & GPL (http://www.opensource.org/licenses/gpl-license)
 Version 0.8.2
 */
(function(e,t){typeof module=="object"&&module.exports?module.exports=function(e){return e=e||require("underscore"),t(e)}:typeof define=="function"&&define.amd?define(["underscore"],function(n){return t(n,e)}):e.postal=t(e._,e)})(this,function(e,t,n){var r="/",i=0,s="postal",o=function(){var t;return function(n){var r=!1;return e.isString(n)?(r=n===t,t=n):(r=e.isEqual(n,t),t=e.clone(n)),!r}},u=function(){var t=[];return function(n){var r=!e.any(t,function(t){return e.isObject(n)||e.isArray(n)?e.isEqual(n,t):n===t});return r&&t.push(n),r}},a=function(e){this.channel=e||r};a.prototype.subscribe=function(){return arguments.length===1?new f(this.channel,arguments[0].topic,arguments[0].callback):new f(this.channel,arguments[0],arguments[1])},a.prototype.publish=function(){var e=arguments.length===1?Object.prototype.toString.call(arguments[0])==="[object String]"?{topic:arguments[0]}:arguments[0]:{topic:arguments[0],data:arguments[1]};return e.channel=this.channel,p.configuration.bus.publish(e)};var f=function(e,t,n){this.channel=e,this.topic=t,this.callback=n,this.constraints=[],this.context=null,p.configuration.bus.publish({channel:s,topic:"subscription.created",data:{event:"subscription.created",channel:e,topic:t}}),p.configuration.bus.subscribe(this)};f.prototype={unsubscribe:function(){p.configuration.bus.unsubscribe(this),p.configuration.bus.publish({channel:s,topic:"subscription.removed",data:{event:"subscription.removed",channel:this.channel,topic:this.topic}})},defer:function(){var e=this.callback;return this.callback=function(t){setTimeout(e,0,t)},this},disposeAfter:function(t){if(e.isNaN(t)||t<=0)throw"The value provided to disposeAfter (maxCalls) must be a number greater than zero.";var n=this.callback,r=e.after(t,e.bind(function(){this.unsubscribe()},this));return this.callback=function(){n.apply(this.context,arguments),r()},this},distinctUntilChanged:function(){return this.withConstraint(new o),this},distinct:function(){return this.withConstraint(new u),this},once:function(){this.disposeAfter(1)},withConstraint:function(t){if(!e.isFunction(t))throw"Predicate constraint must be a function";return this.constraints.push(t),this},withConstraints:function(t){var n=this;return e.isArray(t)&&e.each(t,function(e){n.withConstraint(e)}),n},withContext:function(e){return this.context=e,this},withDebounce:function(t){if(e.isNaN(t))throw"Milliseconds must be a number";var n=this.callback;return this.callback=e.debounce(n,t),this},withDelay:function(t){if(e.isNaN(t))throw"Milliseconds must be a number";var n=this.callback;return this.callback=function(e){setTimeout(function(){n(e)},t)},this},withThrottle:function(t){if(e.isNaN(t))throw"Milliseconds must be a number";var n=this.callback;return this.callback=e.throttle(n,t),this},subscribe:function(e){return this.callback=e,this}};var l={cache:{},compare:function(e,t){if(this.cache[t]&&this.cache[t][e])return!0;var n=("^"+e.replace(/\./g,"\\.").replace(/\*/g,"[A-Z,a-z,0-9]*").replace(/#/g,".*")+"$").replace("\\..*$","(\\..*)*$").replace("^.*\\.","^(.*\\.)*"),r=new RegExp(n),i=r.test(t);return i&&(this.cache[t]||(this.cache[t]={}),this.cache[t][e]=!0),i},reset:function(){this.cache={}}},c=function(t,n){p.configuration.resolver.compare(t.topic,n.topic)&&e.all(t.constraints,function(e){return e.call(t.context,n.data,n)})&&typeof t.callback=="function"&&t.callback.call(t.context,n.data,n)},h={addWireTap:function(e){var t=this;return t.wireTaps.push(e),function(){var n=t.wireTaps.indexOf(e);n!==-1&&t.wireTaps.splice(n,1)}},publish:function(t){return t.timeStamp=new Date,e.each(this.wireTaps,function(e){e(t.data,t)}),this.subscriptions[t.channel]&&e.each(this.subscriptions[t.channel],function(e){var n=0,r=e.length,i;while(n<r)(i=e[n++])&&c(i,t)}),t},reset:function(){this.subscriptions&&(e.each(this.subscriptions,function(t){e.each(t,function(e){while(e.length)e.pop().unsubscribe()})}),this.subscriptions={})},subscribe:function(e){var t,n,r,i=this.subscriptions[e.channel],s;return i||(i=this.subscriptions[e.channel]={}),s=this.subscriptions[e.channel][e.topic],s||(s=this.subscriptions[e.channel][e.topic]=[]),s.push(e),e},subscriptions:{},wireTaps:[],unsubscribe:function(e){if(this.subscriptions[e.channel][e.topic]){var t=this.subscriptions[e.channel][e.topic].length,n=0;for(;n<t;n++)if(this.subscriptions[e.channel][e.topic][n]===e){this.subscriptions[e.channel][e.topic].splice(n,1);break}}}};h.subscriptions[s]={};var p={configuration:{bus:h,resolver:l,DEFAULT_CHANNEL:r,SYSTEM_CHANNEL:s},ChannelDefinition:a,SubscriptionDefinition:f,channel:function(e){return new a(e)},subscribe:function(e){return new f(e.channel||r,e.topic,e.callback)},publish:function(e){return e.channel=e.channel||r,p.configuration.bus.publish(e)},addWireTap:function(e){return this.configuration.bus.addWireTap(e)},linkChannels:function(t,n){var i=[];return t=e.isArray(t)?t:[t],n=e.isArray(n)?n:[n],e.each(t,function(t){var s=t.topic||"#";e.each(n,function(n){var s=n.channel||r;i.push(p.subscribe({channel:t.channel||r,topic:t.topic||"#",callback:function(t,r){var i=e.clone(r);i.topic=e.isFunction(n.topic)?n.topic(r.topic):n.topic||r.topic,i.channel=s,i.data=t,p.publish(i)}}))})}),i},utils:{getSubscribersFor:function(){var e=arguments[0],t=arguments[1];return arguments.length===1&&(e=arguments[0].channel||p.configuration.DEFAULT_CHANNEL,t=arguments[0].topic),p.configuration.bus.subscriptions[e]&&p.configuration.bus.subscriptions[e].hasOwnProperty(t)?p.configuration.bus.subscriptions[e][t]:[]},reset:function(){p.configuration.bus.reset(),p.configuration.resolver.reset()}}};return p})