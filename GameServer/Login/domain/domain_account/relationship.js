/**
 * Created by Phoenix on 2014/4/3.
 */

var code = require('../../code');
var RelationshipProvider = require('../../dao_provider/dao_account/relationship');
var relationshipProvider = new RelationshipProvider();
//var accountHelper = require('./accountHelper');

function Relationship() {

    this.getPlayerId = function (membership_id, server_id, callback) {
        relationshipProvider.getPlayerId(membership_id, server_id, function (error, relationship) {
            if (error)
                return callback(error);
            if (relationship && relationship.length > 0) {
                return callback(error, relationship[0].player_id);
            }
            relationshipProvider.createRelationship(membership_id, server_id, function (error, relationship) {
                return callback(error, relationship.player_id);
            });
        })
    };

    this.getRelationship = function (player_id, callback) {
        relationshipProvider.getRelationship(player_id, function (error, relationship) {
            return callback(error, relationship);
        })
    };

    this.resetRelationship = function (membership_id, player_id, callback) {
        relationshipProvider.resetRelationship(membership_id, player_id, function (error, relationship) {
            return callback(error, relationship);
        })
    };
}
module.exports = Relationship;