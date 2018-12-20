
const pgClient = require('pg');
const config = require("./../../json/config");

class SQLManager{


    constructor(user = config.db_config.user, password = config.db_config.password, host = config.db_config.server, database = config.db_config.database, port = config.db_config.port){
        this.pool = new pgClient.Pool({user: user, host: host, database: database, password: password, port: port});
    }

    execute (request, requestParams = null){

        return new Promise((resolve, reject) => {
            let responseData = config.ResponseData;

            this.pool.connect(function (err, client) {
                if (err) {
                    responseData.error.state = true;
                    responseData.error.message = "Erreur : " + err.stack;
                    reject({"result" : undefined, "responseData" : responseData});
                } else {

                    // Exécution de la requête SQL etresultats stocké dans leparam result
                    client.query(request, requestParams, function (err, result) {

                        if (err) {
                            responseData.error.state = true;
                            responseData.error.message = "Erreur d’exécution de la requete : " + err.stack;

                            reject({"result" : undefined, "responseData" : responseData});
                        }
                        //et traitement du résultat
                        else {
                            resolve({"result" : result, "responseData" : responseData});
                        }
                    });
                }


                // connexion libéré
                //client.release();

            });
            return responseData;
        });
    }

}

module.exports = SQLManager ;


