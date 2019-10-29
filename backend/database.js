const MongoClient = require('mongodb').MongoClient;
const uuid4 = require('uuid/v4');

HOST = process.env.HOST? process.env.HOST : 'localhost';
PORT = process.env.PORT? process.env.PORT : '27017';
const URL = `mongodb://${HOST}:${PORT}`;
let db_instance;
const default_dbname = "pollDB";

/**
 * Initialize the database, server start up should be executed
 * by the callback function.
 * 
 * @param {Function} callback Callback after database initialization
 */
function init(callback) {
    console.log("Initializing database");
    console.log(`Attempting to connect ${URL}`);
    MongoClient.connect(URL, {useUnifiedTopology: true, useNewUrlParser: true}, function(err, db) {
            db_instance = db;
            if(process.env.NODE_ENV === 'dev') {
                console.log("Deleting old data");
                del(default_dbname, 'polls', {}, function(err, result) {
                    console.log(`Deleted size: ${result.result.n}`);
                    callback();
                })
            }
            else {
                callback();
            }
        }
    );
}

/**
 * Get data from database, this function wrapped the mongo
 * command and will invoke the callback function, passed
 * in (err, result) as the argument.
 * 
 * @param {String} db_name Name of the database
 * @param {String} collec_name Name of the collection
 * @param {Object} query Query for selecting
 * @param {Function} callback Callback after find
 * @param {Object} options {limit, skip}
 */
function get(db_name, collec_name, query, callback, options) {
    if(options) {
        const limit = options.limit, skip = options.skip;
        if(limit && skip) {
            db_instance.db(db_name).collection(collec_name).find(query).limit(limit).skip(skip).toArray(callback);
        }
        else if(skip) {
            db_instance.db(db_name).collection(collec_name).find(query).skip(skip).toArray(callback);
        }
        else if(limit) {
            db_instance.db(db_name).collection(collec_name).find(query).limit(limit).toArray(callback);
        }
        else {
            db_instance.db(db_name).collection(collec_name).find(query).toArray(callback);
        }
    }
    else {
        db_instance.db(db_name).collection(collec_name).find(query).toArray(callback);
    }
}

/**
 * Insert data to the database, this function wrapped the
 * mongo command and will invoke the callback function, passed
 * in (err, result) as the argument. One extra field `uid` will
 * be added if uid is set to true, it is an unique identifier generated
 * by uuid4.
 * 
 * @param {String} db_name Name of the database
 * @param {String} collec_name Name of the collection
 * @param {Array} docs Array of objects to be inserted
 * @param {Function} callback Callback after insert
 */
function insert(db_name, collec_name, docs, callback, uid=true) {
    if(uid) {
        for(let i=0;i<docs.length;i++) {
            docs[i].uid = uuid4();
        }
    }
    db_instance.db(db_name).collection(collec_name).insertMany(docs, callback);
}

/**
 * Delete data in the database, all the records that match the
 * query will be deleted therefore use this safely. It will
 * invoke the callback function, passed in (err, result) as
 * the argument.
 * 
 * @param {String} db_name Name of the database
 * @param {String} collec_name Name of the collection
 * @param {String} query Query for deleting
 * @param {Function} callback Callback after delete
 */
function del(db_name, collec_name, query, callback) {
    db_instance.db(db_name).collection(collec_name).deleteMany(query, callback);
}

/**
 * Update the data in the database, all the records that
 * match the query will be updated therefore use this
 * safely. It will invoke the callback function, passed in
 * (err, result) as the argument.
 * 
 * @param {String} db_name Name of the database
 * @param {String} collec_name Name of the collection
 * @param {String} query Filter for updating
 * @param {Object} update Update object
 * @param {Function} callback Callback after update
 */
function update(db_name, collec_name, query, update, callback) {
    db_instance.db(db_name).collection(collec_name).updateMany(query, update, callback);
}

module.exports = {
    init: init,
    default_dbname: default_dbname,
    get: get,
    insert: insert,
    del: del,
    update: update,
}