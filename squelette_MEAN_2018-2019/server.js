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

    sqlManager.execute(sql, [ req.body.username , password_sha1 ]).then(function(response){

        if(response.result.rows[0] != null){
            let session = config.session;

            session.id = response.result.rows[0].id;
            session.firstName = response.result.rows[0].nom;
            session.lastName = response.result.rows[0].prenom;

            req.session.isConnected = true;
            req.session.user = session;
            response.responseData.error.state = false;
            response.responseData.data.id = response.result.rows[0].id;
            response.responseData.data.nom = response.result.rows[0].nom;
            response.responseData.data.prenom = response.result.rows[0].prenom;
            response.responseData.data.message ='Connexion réussie : bonjour '+ response.result.rows[0].identifiant;

            let update = "update fredouil.users set statut = 1 where id = " + response.result.rows[0].id;
            sqlManager.execute(update).then(function () {
                res.send(response.responseData)
            },function (error) {
                res.status(500).send(error);
            });
        }
    },function (error) {
        error.message='Connexion échouée : informations de connexion incorrecte';
        res.status(500).send(error);
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
    sqlManager.execute(sql, [req.params.id]).then(function (response) {
        res.send(response.result.rows);
    }, function (error) {
        res.status(500).send(error);
    });
});

app.get('/getHistories/',function (req,res) {
    let sqlManager = new SQLManager();
    let sql = "select * from fredouil.historique";
    sqlManager.execute(sql,null).then(function (response) {
        res.send(response.result.rows);
    }, function (error) {
        res.status(500).send(error);
    });
});
app.get('/getUsers',function (req,res) {
    let sqlManager = new SQLManager();
    let sql = "select id, identifiant, nom, prenom, date_de_naissance, statut, avatar from fredouil.users";
    sqlManager.execute(sql,null).then(function (response) {
        res.status(200).send(response.result.rows);
    }, function (error) {
        res.status(500).send(error);
    });
});

app.get('/getUser/:id',function (req,res) {
    let sqlManager = new SQLManager();
    let sql = "select * from fredouil.users where id = $1";
    sqlManager.execute(sql, [req.params.id]).then(function (response) {
        res.status(200).send(response.result.rows);
    }, function (error) {
        res.status(500).send(error);
    });
});

app.get('/getConnectedUsersNumber',function (req,res) {
    let sqlManager = new SQLManager();
    let sql = "select count(*) as users_number from fredouil.users where statut = 1";
    sqlManager.execute(sql).then(function (response) {
        res.status(200).send(response.result.rows);
    }, function (error) {
        res.status(500).send(error);
    });
});

app.get('/getUserHistorySize/:id',function (req,res) {
    let sqlManager = new SQLManager();
    let sql = "select count(*) as history_size from fredouil.historique where id_users = $1";
    sqlManager.execute(sql, [req.params.id]).then(function (response) {
        res.status(200).send(response.result.rows);
    }, function (error) {
        res.status(500).send(error);
    });
});


app.put('/updateUser',function (req,res) {

    if(req.body.id == null)
    {
        res.status(500).send('No Id !');
    }else
    {
        let sqlManager = new SQLManager();
        let sql = "";
        if(req.body.identifiant != null)
        {
            sql += "UPDATE fredouil.users SET identifiant = '" + req.body.identifiant + "' where id = " + req.body.id + "; ";
            sqlManager.execute(sql);
        }
        if(req.body.motpasse != null)
        {
            let password_sha1 = sha1(req.body.password);
            sql += "UPDATE fredouil.users SET motpass = '" + req.body.password + "' where id = " + req.body.id + "; ";
        }
        if(req.body.nom != null)
        {
            //sql += "UPDATE fredouil.users SET nom = '" + req.body.nom + "' where id = " + req.body.id + "; ";
        }
        if(req.body.prenom != null)
        {
            //sql += "UPDATE fredouil.users SET prenom = '" + req.body.prenom + "' where id = " + req.body.id + "; ";
        }
        if(req.body.statut != null)
        {
            sql += "UPDATE fredouil.users SET statut = '" + req.body.statut + "' where id = " + req.body.id + "; ";
        }
        if(req.body.avatar !== null)
        {
            sql += "UPDATE fredouil.users SET avatar = '" + req.body.avatar + "' where id = " + req.body.id + "; ";
        }

        sqlManager.execute(sql).then(function () {
            res.status(200).send("success");
        }, function (error) {
            res.status(500).send(error);
        });

    }
});

app.post('/setHistory/:id',function (req,res) {
    if(req.params.id == null)
    {
        res.status(500).send('No Id !');
    }else
    {
        let sqlManager = new SQLManager();

        if( (req.params.id != null) && (req.body.nbreponse != null) && (req.body.temps != null) && (req.body.score != null)  )
        {
            let sql = "INSERT INTO fredouil.historique VALUES (default,$1,now(), $2, $3, $4)";

            sqlManager.execute(sql, [req.params.id, req.body.nbreponse, req.body.temps, req.body.score]).then(function (result,responseData) {
                res.status(200).send("success");
            },function (error) {
                res.status(500).send(error);
            });

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

    let sqlManager = new SQLManager();
    let update = "update fredouil.users set statut = 0 where id = " + req.session.user.id;
    sqlManager.execute(update).then(function () {
        req.session.destroy();
        res.redirect('/');
    });

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
    let url = config.mongo_config.store.url + ':' + config.mongo_config.store.port + '/' ;

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        let dbo = db.db(config.mongo_config.store.dataBase);
        dbo.collection(config.mongo_config.store.collections.quizz).aggregate([ { $match : { _id : new ObjectId(id)} }, { $project: { _id : 0, quizz : { id : 1, question : 1, propositions : 1, anecdote : 1, reponses : '$quizz.réponse' } } } ]).toArray(function(err, result) {
            if (err){
                res.status(404);
                throw err;
            }
            let resultat = [];
            let i = 0;
            result[0].quizz.forEach(function(quizz) {
                resultat[i] = quizz;
                resultat[i].reponse = quizz.reponses[i];
                delete resultat[i].reponses;

                i++;
            });
            res.status(200).send(resultat);
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
