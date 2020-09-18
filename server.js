const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');
const { ObjectID } = require('mongodb');


const MongoClient = require('mongodb').MongoClient;

const connectionString = "mongodb://127.0.0.1:27017";

app.use(bodyParser.urlencoded({
    extended: false
}));
 
app.use(bodyParser.json());
app.set('view engine', 'ejs')
app.use(express.static(__dirname + '/public'));
app.use(cookieParser());


MongoClient.connect(connectionString, 
    {
        useUnifiedTopology: true
    })
        .then(client => {
            console.log('Connected to Database');

            const db = client.db('bvl');
            const usersCollection = db.collection('Users');
            const levelOne = db.collection('Level 1');
            const levelTwo = db.collection('Level 2');
            const levelThree = db.collection('Level 3');
            const paymentTable = db.collection('Payments');
            const record = db.collection('Payments Completed');
            const adminTable = db.collection('Admin');
            const completed = db.collection('Completed');
            var num_of_users;
            
            var myPromise_1 = () => {
                    
                return new Promise((resolve, reject) => {

                    usersCollection.aggregate([
                        {
                            $lookup: {
                                from: "Level 1",
                                localField: "_id",
                                foreignField: "_id",
                                as: "lvl_1"
                            }
                        }, 
                        {
                            $unwind: "$lvl_1"
                        },
                        {
                            $project: {
                                c_id: "$lvl_1.c_id",
                                customer_name: "$lvl_1.customer_name",
                                customer_phone_num: "$lvl_1.customer_phone_num",
                                customer_pin: "$lvl_1.customer_pin",
                                level: "1",
                                num_given: "$lvl_1.num_given",
                                num_received: "$lvl_1.num_received"
                            }
                        } 
                    ]).toArray(function (err, res) {
                        if (err) {
                            reject(err)
                        }
                        resolve(res);
                    })
                });
            };

            var myPromise_2 = () => {
                
                return new Promise((resolve, reject) => {

                    usersCollection.aggregate([
                        {
                            $lookup: {
                                from: "Level 2",
                                localField: "_id",
                                foreignField: "_id",
                                as: "lvl_2"
                            }
                        }, 
                        {
                            $unwind: "$lvl_2"
                        },
                        {
                            $project: {
                                c_id: "$lvl_2.c_id",
                                customer_name: "$lvl_2.customer_name",
                                customer_phone_num: "$lvl_2.customer_phone_num",
                                customer_pin: "$lvl_2.customer_pin",
                                level: "2",
                                num_given: "$lvl_2.num_given",
                                num_received: "$lvl_2.num_received"
                            }
                        } 
                    ]).toArray(function (err, res) {
                        if (err) {
                            reject(err)
                        }
                        resolve(res);
                    })
                });
            };

            var myPromise_3 = () => {
                
                return new Promise((resolve, reject) => {

                    usersCollection.aggregate([
                        {
                            $lookup: {
                                from: "Level 3",
                                localField: "_id",
                                foreignField: "_id",
                                as: "lvl_3"
                            }
                        }, 
                        {
                            $unwind: "$lvl_3"
                        },
                        {
                            $project: {
                                c_id: "$lvl_3.c_id",
                                customer_name: "$lvl_3.customer_name",
                                customer_phone_num: "$lvl_3.customer_phone_num",
                                customer_pin: "$lvl_3.customer_pin",
                                level: "3",
                                num_given: "$lvl_3.num_given",
                                num_received: "$lvl_3.num_received"
                            }
                        } 
                    ]).toArray(function (err, res) {
                        if (err) {
                            reject(err)
                        }
                        resolve(res);
                    })
                });
            };

            var get_num = () => {
                return new Promise((resolve, reject) => {
                    usersCollection.countDocuments(function(err, result) {
                        if (err)
                            reject (err)

                        resolve(result);
                    })
                })
            };

            
            app.get('/', (req, res) => {

                get_num().then(values => {
                    num_of_users = values;

                    if (req.cookies.userData) {
                        Promise.all([myPromise_1(), myPromise_2(), myPromise_3()]).then(values => {             
                            var a = values[0];
                            var b = values[1];
                            var c = values[2];
                            
                            
                            var data =  {};
    
                            for (i = 0; i < a.length; i++) {
                                if (req.cookies.userData.user_id == a[i].customer_phone_num) {
                                    data = a[i];
                                    
                                    if ((data.num_given >= 1) && (data.num_received >= 3)) {
                                        data.num_given -= 1;
                                        data.num_received -= 3;
            
                                        var post_id = new ObjectID(data._id) ;
                                        
                                        levelTwo.insertOne(data);
                                        
                                        delete data.num_given;
                                        delete data.num_received;
                                        
                                        
                                        levelOne.deleteOne({_id:post_id});
                                    }
                                }
                            }
    
                            for (i = 0; i < b.length; i++) {
                                if (req.cookies.userData.user_id == b[i].customer_phone_num) {
                                    data = b[i];
    
                                    if ((data.num_given >= 2) && (data.num_received >= 8)) {
                                        data.num_given -= 2;
                                        data.num_received -= 8;
            
                                        var post_id = new ObjectID(data._id) ;
                                        
                                        levelThree.insertOne(data);
    
                                        delete data.num_given;
                                        delete data.num_received;
                                        levelTwo.deleteOne({_id:post_id});
                                    }
                                }
                            }
    
                            for (i = 0; i < c.length; i++) {
                                if (req.cookies.userData.user_id == c[i].customer_phone_num) {
                                    data = c[i];
    
                                    if ((data.num_given >= 4) && (data.num_received >= 32)) {
                                        data.num_given -= 4;
                                        data.num_received -= 32;
            
                                        var post_id = new ObjectID(data._id) ;
                                        
                                        levelOne.insertOne(data);
    
                                        delete data.num_given;
                                        delete data.num_received;

                                        levelThree.deleteOne({_id:post_id});


                                        completed.updateOne(
                                            data,
                                            {$inc: {times_completed: 1}},
                                            { upsert: true }
                                        )
                                        
                                    }
                                }
                            }
    
                            res.redirect("dashboard");
                        });
                    } else {
                        res.redirect("sign-in.html");                        
                    } 
                })
                
            });

            app.post('/admin_login', (req, res) => {
                var admin_details = {
                    admin_email: req.body.admin_login,
                    admin_password: req.body.admin_pass
                };

                adminTable.find(admin_details).toArray()
                    .then(result => {
                        if (result.length == 0) {
                            res.redirect('admin-login-failed.html')
                        } else {
                            adminCookie = {};

                            adminCookie.admin = 'admin';
                            
                            // Remove secure: false on a more secure server
                            res.cookie("adminCookie", adminCookie), {secure: false};
                            // res.send(req.cookies.userData);
                            res.redirect('/admin');
                        }
                    })
                    .catch(error => console.error(error))
            });

            app.get('/admin', (req, res) => {
                if (req.cookies.adminCookie) {
                    Promise.all([myPromise_1(), myPromise_2(), myPromise_3()]).then(values => {
                        res.render('index.ejs', { users: values })
                    })
                } else {
                    res.redirect("/login.html");
                }
            });
            
            app.get('/activate', (req, res) => {
                if (req.cookies.adminCookie) {
                    response = {
                        nibba: req.query.nibba,
                        val: req.query.custom
                    }

                    var get_details = () => {
                        return new Promise((resolve, reject) => {
                            adminTable.find().toArray(function(err, data) {
                                if (err)
                                    throw (err)
                                
                                v_num = data[0].admin_v_num;
                                e_num = data[0].admin_e_num
                                mw_num = data[0].admin_mw_num;

                                usersCollection.find().toArray(function(err, data) {
                                    if (err) {
                                        reject(err)
                                    }
                                    
                                    x = {}
                                    for(i = 0; i < data.length; i++) {
                                        if (response.nibba == data[i].customer_phone_num) {
                                            x.payerPNum = data[i].customer_phone_num;
                                            x.customer_name = data[i].customer_name;
                                        }
    
                                        if (response.val.slice(0, 8) == data[i].customer_phone_num) {
                                            x.toBePaidPNum = data[i].customer_phone_num;
                                            x.receive_name = data[i].customer_name;
                                        }
                                    }
    
                                    x.adminVNum = v_num;
                                    x.adminENum = e_num;
                                    x.adminMwNum = mw_num;

                                    paymentTable.insertOne(x, function(err, res) {
                                        if (err) throw err;
                                    });

                                    resolve(x)
                                })
                            });
                            
                        })
                    }

                    get_details().then(values => {
                        res.render('confirm.ejs');
                    })
                } else {
                    res.redirect("/login.html");
                }
            });

            app.get('/payment_table', (req, res) => {
                if (req.cookies.adminCookie) {
                    var get_payment_table = () => {
                        return new Promise((resolve, reject) => {
                            paymentTable.find().toArray(function (err, data) {
                                if (err)
                                    reject (err)
    
                                resolve(data);
                            })
                        })
                    };
    
                    get_payment_table().then(values => {
                        res.render('payments.ejs', {data: values});
                    })
                } else {
                    res.redirect("/login.html");
                }
            });

            app.get('/payments_completed', (req, res) => {
                if (req.cookies.adminCookie) {
                    var get_completed = () => {
                        return new Promise((resolve, reject) => {
                            record.find().toArray(function (err, data) {
                                if (err)
                                    reject (err)

                                resolve(data)
                            })
                        })
                    };

                    get_completed().then(values => {
                        res.render('payments-completed.ejs', {data: values});
                    })
                } else {
                    res.redirect("/login.html");
                }
            })

            app.get('/completed', (req, res) => {
                if (req.cookies.adminCookie) {
                    var completed_table = () => {
                        return new Promise((resolve, reject) => {
                            completed.find().toArray(function (err, data) {
                                if (err)
                                    reject (err)
    
                                resolve(data)
                            })
                        })
                    }
    
                    completed_table().then(values => {
                        
                        res.render('completed.ejs', {data: values});
                    });
                } else {
                    res.redirect("/login.html");
                }
            })

            app.get('/confirm', (req, res) => {
                if (req.cookies.adminCookie) {
                    response = {
                        payerPNum: req.query.payerPNum
                    };

                    var admin_acknowledge = () => {
                        return new Promise((resolve, reject) => {
                            update_doc = {$set: {admin_receive_check: true}};

                            paymentTable.updateOne(response, update_doc, function(err, data) {
                                if (err)
                                    reject(err)

                                resolve(data)
                            })
                        })
                    };

                    admin_acknowledge().then(values => {
                        res.render('confirm_admin.ejs')
                    })
                } else {
                    res.redirect("/login.html");
                }
            });

            app.get('/delete', (req, res) => {
                if (req.cookies.adminCookie) {
                    response = {
                        c_id: Number(req.query.c_id),
                        customer_phone_num: req.query.user_num
                    }

                    custom_num = response.c_id;

                    usersCollection.updateMany(
                        {c_id: {$gt: custom_num}},
                        {$inc: {c_id: -1}}
                    );

                    levelOne.updateMany(
                        {c_id: {$gt: custom_num}},
                        {$inc: {c_id: -1}}
                    );

                    levelTwo.updateMany(
                        {c_id: {$gt: custom_num}},
                        {$inc: {c_id: -1}}
                    );

                    levelThree.updateMany(
                        {c_id: {$gt: custom_num}},
                        {$inc: {c_id: -1}}
                    );

                    usersCollection.deleteOne(response);
                    levelOne.deleteOne(response);
                    levelTwo.deleteOne(response);
                    levelThree.deleteOne(response);
                    
                    res.redirect("/admin");
                } else {
                    res.redirect("/login.html");
                }
            });

            app.get('/delete_pay', (req, res) => {
                if (req.cookies.adminCookie) {
                    response = {
                        payerPNum: req.query.payerPNum,
                        toBePaidPNum: req.query.toBePaidPNum
                    }

                    paymentTable.deleteOne(response);
                    
                    res.redirect("/payment_table");
                } else {
                    res.redirect("/login.html");
                }
            });

            app.get('/v_change_no', (req,res) => {
                if (req.cookies.adminCookie) {
                    
                    var get_admin_details = () => {
                        return new Promise((resolve, reject) => {
                            adminTable.find().toArray(function(err, data) {
                                if (err)
                                    reject(err)

                                resolve(data);
                            })
                        })
                    };

                    get_admin_details().then(values => {
                        res.render("v_change_no.ejs", {data: values});
                    })
                    
                } else {
                    res.redirect("/login.html");
                }
            })

            app.get('/e_change_no', (req,res) => {
                if (req.cookies.adminCookie) {
                    
                    var get_admin_details = () => {
                        return new Promise((resolve, reject) => {
                            adminTable.find().toArray(function(err, data) {
                                if (err)
                                    reject(err)

                                resolve(data);
                            })
                        })
                    };

                    get_admin_details().then(values => {
                        res.render("e_change_no.ejs", {data: values});
                    })
                    
                } else {
                    res.redirect("/login.html");
                }
            })

            app.get('/mw_change_no', (req,res) => {
                if (req.cookies.adminCookie) {
                    
                    var get_admin_details = () => {
                        return new Promise((resolve, reject) => {
                            adminTable.find().toArray(function(err, data) {
                                if (err)
                                    reject(err)

                                resolve(data);
                            })
                        })
                    };

                    get_admin_details().then(values => {
                        res.render("mw_change_no.ejs", {data: values});
                    })
                    
                } else {
                    res.redirect("/login.html");
                }
            })

            app.get('/v_no_changed', (req, res) => {
                if (req.cookies.adminCookie) {
                    var response = {
                        admin_v_num: req.query.new_admin_no
                    }
    
                    myQuery = {
                        admin_email:"admin@bvl.com"
                    };

                    var change = () => {
                        return new Promise((resolve, reject) => {
                            adminTable.updateOne(
                                myQuery,
                                {$set: { admin_v_num: response.admin_v_num}}  ,
                                function(err, data) {
                                    if (err)
                                        reject (err)

                                    resolve(data)
                                }  
                            )
                        })
                    }
    
                    change().then(values => {
                        res.redirect('/admin');
                    })
                    
                } else {
                    res.redirect("/login.html");
                }
                
                
            })
            
            app.get('/e_no_changed', (req, res) => {
                if (req.cookies.adminCookie) {
                    var response = {
                        admin_e_num: req.query.new_admin_no
                    }
    
                    myQuery = {
                        admin_email:"admin@bvl.com"
                    };

                    var change = () => {
                        return new Promise((resolve, reject) => {
                            adminTable.updateOne(
                                myQuery,
                                {$set: { admin_e_num: response.admin_e_num}}  ,
                                function(err, data) {
                                    if (err)
                                        reject (err)

                                    resolve(data)
                                }  
                            )
                        })
                    }
    
                    change().then(values => {
                        res.redirect('/admin');
                    })
                    
                } else {
                    res.redirect("/login.html");
                }
                
                
            })

            app.get('/mw_no_changed', (req, res) => {
                if (req.cookies.adminCookie) {
                    var response = {
                        admin_mw_num: req.query.new_admin_no
                    }
    
                    myQuery = {
                        admin_email:"admin@bvl.com"
                    };

                    var change = () => {
                        return new Promise((resolve, reject) => {
                            adminTable.updateOne(
                                myQuery,
                                {$set: { admin_mw_num: response.admin_mw_num}}  ,
                                function(err, data) {
                                    if (err)
                                        reject (err)

                                    resolve(data)
                                }  
                            )
                        })
                    }
    
                    change().then(values => {
                        res.redirect('/admin');
                    })
                    
                } else {
                    res.redirect("/login.html");
                }
                
                
            })
            
            app.get('/dashboard', (req, res) => {
                if (req.cookies.userData) {
                    Promise.all([myPromise_1(), myPromise_2(), myPromise_3()]).then(values => {
                        dashboard_details = {};
                        for(i = 0; i < values.length; i++) {    
                            for (x = 0; x < values[i].length; x++) {
                                if (req.cookies.userData.user_id == values[i][x].customer_phone_num) {
                                    dashboard_details.customer_name = values[i][x].customer_name;
                                    dashboard_details.phone_num = values[i][x].customer_phone_num;
                                    dashboard_details.level = values[i][x].level;
                                    dashboard_details.user_count = num_of_users;
                                }
                            }      
                        }
                        res.render('dashboard.ejs', { info: dashboard_details })
                    })
                } else {
                    res.redirect("sign-in.html");
                } 
            });

            app.get('/start_payment_process', (req, res) => {
                var get_payment = () => {
                    return new Promise((resolve, reject) => {
                        usersCollection.find().toArray(function(err, data) {
                            if (err)
                                reject (err)

                            x = {};
                            for (i = 0; i < data.length; i++) {
                                if (req.cookies.userData.user_id == data[i].customer_phone_num) {
                                    x.payerPNum = data[i].customer_phone_num;
                                } 
                            }

                            paymentTable.find(x).toArray(function(err, val) {
                                if (err)
                                    throw err
                                
                                resolve(val)
                            })
                        })
                    })
                };

                get_payment().then(values => {
                    if (values.length == 0) {
                        res.redirect('wait-initialization.html');
                    } else {
                        
                        values[0].user_count = num_of_users;
                        res.render('pay-admin.ejs', {details: values});
                    }
                })
            });

            app.get('/admin_payment', (req, res) => {
                if (req.cookies.userData) {
                    var create_request = () => {
                        return new Promise((resolve, reject) => {
                            paymentTable.find().toArray(function (err, data) {
                                if (err)
                                    reject (err)

                                my_query = {};
                                for (i = 0; i < data.length; i++) {
                                    if (req.cookies.userData.user_id == data[i].payerPNum) {
                                        my_query.payerPNum = data[i].payerPNum;
                                        update_doc = {$set: {user_admin_pay_check: true}};
                                    } 
                                }

                                paymentTable.updateOne(my_query, update_doc, function(err, res) {
                                    if (err)
                                        reject(err)

                                    resolve(res);
                                })
                           })
                        });
                    };

                    create_request().then(values => {
                        res.redirect('wait_admin');
                    })
                } else {
                    res.redirect("sign-in.html");
                }
            });

            app.get('/wait_admin', (req, res) => {
                if (req.cookies.userData) {
                    var confirm_request = () => {
                        return new Promise((resolve, reject) => {
                            paymentTable.find().toArray(function (err, data) {
                                if (err)
                                    reject (err)

                                
                                x = {};

                                for(i = 0; i < data.length; i++) {
                                    if(req.cookies.userData.user_id == data[i].payerPNum) {
                                        x = data[i];
                                        x.check_admin = data[i].admin_receive_check;
                                        x.user_count = num_of_users;
                                    }
                                }

                                resolve(x);
                            })
                        })
                    }

                    confirm_request().then(values => {
                        if (values.admin_receive_check == true) {
                            res.render('pay-user.ejs', {details: values})
                        } else {
                            res.render('loading.ejs');
                        }
                    })
                } else {
                    res.redirect("sign-in.html");
                }
            });

            app.get('/pay_user', (req, res) => {
                if(req.cookies.userData) {
                    var pay_user = () => {
                        return new Promise((resolve, reject) => {
                            paymentTable.find().toArray(function (err, data) {
                                if (err)
                                    reject (err)

                                my_query = {};
                                for (i = 0; i < data.length; i++) {
                                    if (req.cookies.userData.user_id == data[i].payerPNum) {
                                        my_query.payerPNum = data[i].payerPNum;
                                        update_doc = {$set: {user_pay_check: true}};
                                    } 
                                }

                                paymentTable.updateOne(my_query, update_doc, function(err, res) {
                                    if (err)
                                        reject(err)

                                    resolve(res);
                                })
                           })
                        });
                    };

                    pay_user().then(values => {
                        res.redirect('wait_for_user');
                    });
                } else {
                    res.redirect('sign-in.html');
                }
            });

            app.get('/wait_for_user', (req, res) => {
                if (req.cookies.userData) {
                    var confirm_request = () => {
                        return new Promise((resolve, reject) => {
                            paymentTable.find().toArray(function (err, data) {
                                if (err)
                                    reject (err)

                                
                                x = {};

                                for(i = 0; i < data.length; i++) {
                                    if(req.cookies.userData.user_id == data[i].payerPNum) {
                                        x.check_user = data[i].user_receive_check;
                                    }
                                }

                                resolve(x);
                            })
                        })
                    }

                    confirm_request().then(values => {
                        if (values.check_user == true) {
                            res.redirect('final_state');
                        } else {
                            res.render('loading-user.ejs');
                        }
                    })
                    // res.render('loading.ejs');
                } else {
                    res.redirect("sign-in.html");
                }
            });

            app.get('/acknowledge_pay', (req, res) => {
                if (req.cookies.userData){
                    var check_payment = () => {
                        return new Promise ((resolve, reject) => {
                            paymentTable.find().toArray(function(err, data) {
                                if (err)
                                    reject (err)

                                x = {};

                                for (i = 0; i < data.length; i++) {
                                    if (req.cookies.userData.user_id == data[i].toBePaidPNum) {
                                        x.customer_name = data[i].receive_name;
                                        x.debtor_num = data[i].payerPNum;
                                        x.user_count = num_of_users;
                                    }
                                }

                                resolve(x);
                            });
                        })
                    };

                    check_payment().then(values => {
                        if (values.debtor_num) {
                            res.render('acknowledge-pay', {info: values});
                        } else {
                            res.redirect('wait-initialization.html');
                        }
                    })
                } else {
                    res.redirect('sign-in.html')
                }
            });

            app.get('/logout', (req, res) => {
                res.clearCookie("userData");
                res.redirect('/');
            });

            app.get('/send_acknowledgement', (req, res) => {
                if (req.cookies.userData) {
                    response = {
                        payerPNum: req.query.debtor,
                        toBePaidPNum: req.cookies.userData.user_id
                    };

                    x = {
                        customer_phone_num: req.cookies.userData.user_id
                    }
                    var user_ackowledge = () => {
                        return new Promise((resolve, reject) => {
                            update_doc = {$set: {user_receive_check: true}};
    
                            paymentTable.updateOne(response, update_doc, function(err, data) {
                                if (err)
                                    reject(err)
    
                                levelOne.updateOne(x, {$inc: {num_received: 1}});
                                levelTwo.updateOne(x, {$inc: {num_received: 1}});
                                levelThree.updateOne(x, {$inc: {num_received: 1}});

                                resolve();
                            })
                        })
                    };

                    user_ackowledge().then(values => {
                        res.render('confirm_user.ejs')
                    })
                } else {
                    res.redirect('sign-in.html');
                }
            });

            app.get('/final_state', (req, res) => {
                if (req.cookies.userData) {
                    var cleanup = () => {
                        return new Promise((resolve, reject) => {
                            paymentTable.find().toArray(function(err, data) {
                                x = {};
                                
                                for (i = 0; i < data.length; i++) {
                                    if (req.cookies.userData.user_id == data[i].payerPNum) {
                                        x.customer_phone_num = data[i].payerPNum;
                                        y = data[i];
                                    }
                                }

                                
                                
                                delete y.user_admin_pay_check;
                                delete y.admin_receive_check;
                                delete y.user_pay_check;
                                delete y.user_receive_check;

                                levelOne.updateOne(x, {$inc: {num_given: 1}});
                                levelTwo.updateOne(x, {$inc: {num_given: 1}});
                                levelThree.updateOne(x, {$inc: {num_given: 1}});

                                record.insertOne(y);
                                paymentTable.deleteOne(y);

                                resolve();
                            })
                        });
                    };

                    cleanup().then(values => {
                        res.render('confirmed.ejs');
                    })
                } else {
                    res.redirect('sign-in.html')
                }
            });

            app.post('/process_form', (req, res) => {
                var response = {
                    customer_name: req.body.userName,
                    customer_phone_num: req.body.pNum,
                    customer_pin: req.body.userPin
                };

                var query = {
                    customer_phone_num: req.body.pNum
                };

                usersCollection.find(query).toArray()
                    .then(result => {
                        
                        if (result.length == 0) {
                            response.c_id = num_of_users + 1;
                            response.num_given = 0;
                            response.num_received = 0;
                            levelOne.insertOne(response)
                                .then(result => {
                                    
                                })
                                .catch(error => console.error(error))
                            delete response.num_given;
                            delete response.num_received;
                            usersCollection.insertOne(response)
                                .then(result => {
                                    res.redirect('/registration-confirmed.html')
                                })
                                .catch(error => console.error(error))
                        } else {
                            res.redirect('/registration-failed.html')
                        }
                    })
                    .catch(error => console.error(error))
            });
            
            app.post('/check_login', (req, res) => {
                var login_details = {
                    customer_phone_num: req.body.userPnum,
                    customer_pin: req.body.userPin
                };
                
                usersCollection.find(login_details).toArray()
                    .then(result => {
                        
                        if (result.length == 0) {
                            res.redirect('/login-failed.html');
                        } else {
                            userData = {}
                            userData.user_id = result[0].customer_phone_num;
                            
                            // Remove secure: false on a more secure server
                            res.cookie("userData", userData), {secure: false};
                            // res.send(req.cookies.userData);
                            res.redirect('/');
                        }
                    })
                    .catch(error => console.error(error))
            });

            const PORT = process.env.PORT || 3000;

            var server = app.listen(PORT, () => {
                var host = server.address().address
                var port = server.address().port
                
                console.log("Example app listening at http://%s:%s", host, port)
            });            
        })
        .catch(error => console.error(error))