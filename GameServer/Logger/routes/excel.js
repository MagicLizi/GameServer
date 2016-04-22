/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-7-11
 * Time: 上午11:13
 * To change this template use File | Settings | File Templates.
 */
var excel = require('excel-export');//关联excel-export模块

exports.index = function(req, res){
    var conf ={};
    //conf.stylesXmlFile = "styles.xml";
    conf.cols = [{
        caption:'string',
        type:'string',
        beforeCellWrite:function(row, cellData){
            return cellData.toUpperCase();
        },
        width:28.7109375
    },{
        caption:'date',
        type:'date',
        beforeCellWrite:function(){
            var originDate = new Date(Date.UTC(1899,11,30));
            return function(row, cellData, eOpt){

                    return (cellData - originDate) / (24 * 60 * 60 * 1000);
            }
        }()
    },{
        caption:'bool',
        type:'bool'
    },{
        caption:'number',
        type:'number'
    }];
    conf.rows = [
        ['pi', new Date(Date.UTC(2013, 4, 1)), true, 3.14],
        ["e", new Date(2012, 4, 1), false, 2.7182],
        ["M&M<>'", new Date(Date.UTC(2013, 6, 9)), false, 1.61803],
        ["null date", null, true, 1.414]
    ];
    var result = excel.execute(conf);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats');
    res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
    res.end(result, 'binary');
};
