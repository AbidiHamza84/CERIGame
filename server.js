/******** Chargement des Middleware
 *
 ********/
const
    express = require('express'),
    config = require("./CERIGame/json/config"),
    bodyParser = require("body-parser"),
    sha1 = require('js-sha1'),
    session = require('express-session'),
    MongoDBStore = require('connect-mongodb-session')(session),
    MongoClient = require('mongodb').MongoClient,
    SQLManager = require('./CERIGame/app/utils/SQLManager');
    let ObjectId = require('mongodb').ObjectID;

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
        uri: config.mongo_config.store.url + ':' + config.mongo_config.store.port + '/' +
            config.mongo_config.store.dataBase,
        collection: config.mongo_config.store.collections.session ,
    }),
    cookie : {maxAge : 3600 * 60 * 10} // ~ 30min
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

app.get('/session',function (req, res) {
    res.send(req.session);
});

app.post('/session',function (req, res) {
    req.session = req.body.session;
    res.send(req.session);
});

app.post('/login', function(req, res){

    let password_sha1 = sha1(req.body.password);

    let sql = "select * from fredouil.users where identifiant = $1 and motpasse = $2";


    let sqlManager = new SQLManager();

    sqlManager.execute(sql, [ req.body.username , password_sha1 ], function(result, responseData){
        if(result.rows[0] != null){
            let session = config.session;

            session.id = result.rows[0].id;
            session.firstName = result.rows[0].nom;
            session.lastName = result.rows[0].prenom;

            req.session.isConnected = true;
            req.session.user = session;

            responseData.error.state = false;
            responseData.data.id = result.rows[0].id;
            responseData.data.nom = result.rows[0].nom;
            responseData.data.prenom = result.rows[0].prenom;
            responseData.data.message ='Connexion réussie : bonjour '+ result.rows[0].identifiant;
            res.send(responseData);

        }
        else
        {
            responseData.error.message='Connexion échouée : informations de connexion incorrecte';
            responseData.error.state = false;
            res.send(responseData);
        }
    });
});

app.get('/home', function(req, res) {
    res.sendFile(__dirname + '/CERIGame/home.html');
});


/******** SQL Routes
 *
 ********/

app.get('/getHistoryByUser/:id',function (req,res) {
    let sqlManager = new SQLManager();
    let sql = "select * from fredouil.historique where id_users = $1";
    sqlManager.execute(sql, [req.params.id], function (result,responseData) {

        res.send(result.rows);
    });
});

app.get('/getHistories/',function (req,res) {
    let sqlManager = new SQLManager();
    let sql = "select * from fredouil.historique";
    sqlManager.execute(sql,null,function (result,responseData) {
        res.send(result.rows);
    });
});
app.get('/getUsers',function (req,res) {
    let sqlManager = new SQLManager();
    let sql = "select * from fredouil.users";
    sqlManager.execute(sql,null,function (result,responseData) {
        res.status(200).send(result.rows);
    });
});
app.get('/getUser/:id',function (req,res) {
    let sqlManager = new SQLManager();
    let sql = "select * from fredouil.users where id = $1";
    sqlManager.execute(sql, [req.params.id], function (result,responseData) {
        res.status(200).send(result.rows);
    });
});
app.put('/updateUser',function (req,res) {
    let id = req.body.id;

    console.log("la79et la requete  = " + req.body);
    if(req.body.id == null)
    {
        res.status(500).send('No Id !');
    }else
    {
        console.log("la79et la requete  = " + req.body);
        let sqlManager = new SQLManager();
        if(req.body.identifiant != null)
        {
            let sql = "UPDATE fredouil.users SET identifiant = '" + req.body.identifiant + "' where id = " + req.body.id;
            sqlManager.execute(sql, null, function (result,responseData) {
            });
        }
        if(req.body.motpasse != null)
        {
            let password_sha1 = sha1(req.body.password);
            let sql = "UPDATE fredouil.users SET motpass = '" + req.body.password + "' where id = " + req.body.id;
            sqlManager.execute(sql,null,function (result,responseData) {
            });
        }
        if(req.body.nom != null)
        {
            console.log("la79et la requete  = " + req.body.nom);
            let sql = "UPDATE fredouil.users SET nom = '" + req.body.nom + "' where id = " + req.body.id;
            sqlManager.execute(sql,null, function (result,responseData) {
            });
        }
        if(req.body.prenom != null)
        {
            let sql = "UPDATE fredouil.users SET prenom = '" + req.body.prenom + "' where id = " + req.body.id;
            sqlManager.execute(sql,null,function (result,responseData) {
            });
        }
        if(req.body.statut != null)
        {
            let sql = "UPDATE fredouil.users SET statut = '" + req.body.statut + "' where id = " + req.body.id;
            sqlManager.execute(sql,null,function (result,responseData) {
            });
        }
        if(req.body.avatar !== null)
        {
            let sql = "UPDATE fredouil.users SET avatar = '" + req.body.avatar + "' where id = " + req.body.id;
            sqlManager.execute(sql,null,function (result,responseData) {
            });
        }
        res.status(200).send("ok");
    }
});

app.post('/setHistory/:id',function (req,res) {
    if(req.params.id == null)
    {
        res.status(500).send('No Id !');
    }else
    {
        let sqlManager = new SQLManager();

        if( (req.params.id != null) && (req.body.date != null) && (req.body.nbreponse != null) && (req.body.temps != null) && (req.body.score != null)  )
        {
            let sql = "INSERT INTO fredouil.historique VALUES (default,$1,now(), $2, $3, $4)";

            sqlManager.execute(sql, [req.params.id, req.body.nbreponse, req.body.temps, req.body.score], function (result,responseData) {
            });
            res.send("ok");
        }


    }
});

/******** Mongodb Routes
 *
 ********/

app.get('/getSession', function(req, res){
    let url = config.mongo_config.store.url + ':' + config.mongo_config.store.port + '/' ;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db(config.mongo_config.store.dataBase);
        dbo.collection(config.mongo_config.store.collections.session).find({_id : req.session.id},{projection : {_id : 0,"session.user" : 1}}).toArray(function(err, result) {
            if (err){
                res.status(404);
                throw err;
            }
            res.status(200).send(result);
            db.close();
        });
    });
});

app.post('/deleteSession', function(req, res){
    req.session.destroy();
    res.redirect('/');
});

app.get('/getQuizz',function (req,res) {

    let url = config.mongo_config.store.url + ':' + config.mongo_config.store.port + '/' ;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db(config.mongo_config.store.dataBase);
        dbo.collection(config.mongo_config.store.collections.quizz).find({},{ projection: {_id : 0, fournisseur : 0, rédacteur : 0}}).toArray(function(err, result) {
            if (err){
                res.status(404);
                throw err;
            }
            res.status(200).send(result);
            db.close();
        });
    });


});

app.post('/getQuizzByTheme',function (req,res) {

    let id = req.body.idTheme;
    console.log(id);
    let url = config.mongo_config.store.url + ':' + config.mongo_config.store.port + '/' ;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db(config.mongo_config.store.dataBase);
        dbo.collection(config.mongo_config.store.collections.quizz).find({_id : new ObjectId(id)},{projection : {"quizz" : 1, "_id":0}}).toArray(function(err, result) {
            if (err){
                res.status(404);
                throw err;
            }
            res.status(200).send(result);
            db.close();
        });
    });


});



app.get('/getThemes',function (req, res){
    let url = config.mongo_config.store.url + ':' + config.mongo_config.store.port + '/' ;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db(config.mongo_config.store.dataBase);
        dbo.collection(config.mongo_config.store.collections.quizz).aggregate([{ $project: {id: '$_id' , _id : 0, name: '$thème'} }]).toArray(function(err, result) {
            if (err){
                res.status(404);
                throw err;
            }
            res.status(200).send(result);
            db.close();
        });
    });

});
