/**
 * Created by lizi on 15/9/9.
 */
var schedule = require("node-schedule");
var FarFightTask = require("./FarFightTask");
var ServerTimeTick = function()
{
    console.log("begin time tick");
    var rule = new schedule.RecurrenceRule();
    rule.hour = 4;
    rule.minute = 0;
    schedule.scheduleJob(rule, function(){
        console.log("task run!!!"+new Date());
        FarFightTask.ExcuteTask();
    });
};
ServerTimeTick();