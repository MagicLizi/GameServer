/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-7-11
 * Time: 下午1:46
 * To change this template use File | Settings | File Templates.
 */
function getDate(){
    var now = new Date();
    var y = now.getFullYear(), m = now.getMonth()+1, d = now.getDate();
    var begin_date = '', end_date = '';

    if($('#begin_date').val()){
        begin_date = $('#begin_date').val();
    }
    else
        begin_date = y+'-'+m+'-'+(d-1);

    if($('#end_date').val())
        begin_date = $('#end_date').val();
    else
        end_date = y+'-'+m+'-'+d;

    return {
        begin_date : begin_date,
        end_date : end_date
    };
}