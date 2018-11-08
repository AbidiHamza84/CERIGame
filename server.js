/******** Chargement des Middleware
*
********/
const express = require('express');
const config = require("./CERIGame/json/config");
const bodyParser = require("body-parser");
const pgClient = require('pg');
const sha1 = require('js-sha1');
const session = require('express-session');
let SQLManager = require('./CERIGame/app/utils/SQLManager');
const MongoDBStore = require('connect-mongodb-session')(session);


/******** Declaration des variables
*
********/

const app = express();

/******** Configuration du serveur NodeJS - Port : 3200
*
********/

app.use(express.static(__dirname + '/CERIGame'));
app.use(express.static(__dirname + '/CERIGame/app/views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json({limit: '10mb'}));

app.use(session({
    secret: 'ma phrase secrete',
    saveUninitialized: false,
    resave: false,
    store : new MongoDBStore({
        uri: config.mongo_config.store.uri,
        collection: config.mongo_config.store.collection ,
        touchAfter: 24 * 3600
    }),
    cookie : {maxAge : 24 * 3600 * 1000}
}));

app.listen(config.server_config.port, function(){
	console.log('listening port ' + config.server_config.port);
});

/******** Gestion des URI
*
********/


/******** Connexion à la base relationnelle
 *
 **********/
app.post('/login', function(req, res){

    let password_sha1 = sha1(req.body.password);

    let sql = "select * from fredouil.users where identifiant = $1 and motpasse = $2";


    let sqlManager = new SQLManager();

    sqlManager.execute(sql, [ req.body.username , password_sha1 ], function(result, responseData){
        if(result.rows[0] != null){
            req.session.isConnected = true;
            responseData.error.state = false;
            responseData.data.nom = result.rows[0].nom;
            responseData.data.prenom = result.rows[0].prenom;
            responseData.data.message ='Connexion réussie : bonjour '+ result.rows[0].identifiant;
            res.send(responseData);
            //res.redirect(200,'/home');
        }
        else
        {
            responseData.error.message='Connexion échouée : informations de connexion incorrecte';
            responseData.error.state = false;
            res.send(responseData);
        }
    });
});
