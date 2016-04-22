/**
 * Created with JetBrains WebStorm.
 * User: Andy.Chen
 * Date: 14-6-25
 * Time: 下午1:46
 * To change this template use File | Settings | File Templates.
 */

var where = module.exports;

where.date = function(opts, condition){
    if(!!opts.begin_date){
        condition.query+=' AND a.create_date>=?';
        condition.values.push(opts.begin_date);

    }

    if(!!opts.end_date){
        condition.query+=' AND a.create_date<=?';
        condition.values.push(opts.end_date);
    }
};

where.account = function(opts, condition){
    if(!!opts.account){
        condition.query+=' AND a.account=?';
        condition.values.push(opts.account);
    }
};

where.type = function(opts, condition){
    if(!!opts.account){
        condition.query+=' AND c.account=?';
        condition.values.push(opts.account);
    }

    if(!!opts.player_id){
        condition.query+=' AND c.membership_id=?';
        condition.values.push(opts.player_id);
    }

    if(!!opts.nickname){
        condition.query+=' AND b.nickname=?';
        condition.values.push(opts.nickname);
    }

    if(!!opts.loop_id){
        condition.query+=' AND a.loop_id=?';
        condition.values.push(opts.loop_id);
    }

    if(!!opts.round_id){
        condition.query+=' AND a.round_id=?';
        condition.values.push(opts.round_id);
    }

    if(!!opts.region_id){
        condition.query+=' AND a.region_id=?';
        condition.values.push(opts.region_id);
    }


    if(!!opts.region_name){
        condition.query+=' AND a.region_name=?';
        condition.values.push(opts.region_name);
    }
};

/*
where.limit = function(opts, query, values){
    if(!!opts.begin_date){
        query+=' LIMIT ?,?';
        values.push(opts.start || 1);
        values.push(opts.end || 20);
    }
};
*/
