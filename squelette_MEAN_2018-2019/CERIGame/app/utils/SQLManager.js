
const pgClient = require('pg');
const config = require("./../../json/config");

class SQLManager{



    constructor(user = config.db_config.user, password = config.db_config.password, host = config.db_config.server, database = config.db_config.database, port = config.db_config.port){
        this.pool = new pgClient.Pool({user: user, host: host, database: database, password: password, port: port});
    }

    execute (request, requestParams = null, callback = null){

        let responseData = config.ResponseData;

        this.pool.connect(function(err, client, done){
            if(err){
                responseData.error.state= true;
                responseData.error.message = "Erreur : " + err.stack;
            }
            else {

                // Exécution de la requête SQL etresultats stocké dans leparam result
                client.query(request, requestParams, function (err, result){

                    if(err)
                    {
                        responseData.error.state= true;
                        responseData.error.message = "Erreur d’exécution de la requete : " + err.stack;
                    }
                    //et traitement du résultat
                    else{
                        if (callback !== null)
                            callback(result, responseData);
                    }
                });
            }


            // connexion libéré
            //client.release();

        });
        return responseData ;
    }

}

module.exports = SQLManager ;


