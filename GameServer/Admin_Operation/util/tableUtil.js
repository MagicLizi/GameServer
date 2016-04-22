/**
 * Created by peihengyang on 15/1/28.
 */
var addRow =function(add_Data,arr_Data_Id,table_Id){
    var arr_Data =  document.getElementById(arr_Data_Id).value;
    arr_Data.push(add_Data);
    createTable(table_Id,arr_Data_Id);
}
function delRow(Data_Id,arr_Data_Id,table_Id){
    //var result_Data = '';
    var arr_Data =  document.getElementById(arr_Data_Id).value;
    arr_Data.splice(Data_Id,1);
    createTable(table_Id,arr_Data_Id);
}

function createTable(tabel_Id,arr_Data_Id){
    var arr_Data =  document.getElementById(arr_Data_Id).value;
    var data_Rows = arr_Data.split(';');
    var tb = document.getElementById(tabel_Id);
    var rowNum=tb.rows.length;
    for (var i=1;i<rowNum;i++)
    {
        tb.deleteRow(i);
        rowNum=rowNum-1;
        i=i-1;
    }
    var Rowi = 0;
    data_Rows.forEach(function(data_Row){
        var data_Cols = data_Row.split(',');
        var firstrow = tb.insertRow(1);
        var Coli = 0;
        data_Cols.forEach(function(data_Col){
            var firstcelltitle = firstrow.insertCell(Coli);
            firstcelltitle.setAttribute("class","data");
            firstcelltitle.innerHTML = data_Col;
            Coli++;
        });
        var firstcelldata = firstrow.insertCell(Coli);
        firstcelldata.setAttribute("class","data");
        firstcelldata.innerHTML = "<label onclick=delMethod("+Rowi+","+arr_Data+","+tabel_Id+")>删除</label>";
        Rowi++;
    });
    document.getElementById(arr_Data_Id).value = arr_Data;
}



