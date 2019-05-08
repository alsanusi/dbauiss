const express = require('express')
const app = express()

//Admin Credentials
const adminCredentials = { 
    id: '1',
    username: 'admin', 
    pass: 'auiss2019' 
}

const redirectLogin = (req, res, next) => {
    if(!req.session.userId){
        res.redirect('/')
    } else {
        next()
    }
}

const redirectDashboard = (req, res, next) => {
    if(req.session.userId){
        res.redirect('/dashboard')
    } else {
        next()
    }
}

app.get('/', function(req, res) {
	res.render('index', {lg: req.body})
})

//Login Authentication  
app.post('/login', redirectDashboard, function(req, res){
    var username = req.body.username
    var password = req.body.pass
    if (username == adminCredentials.username && password == adminCredentials.pass) {
        console.log("Success Login!")
        req.session.userId = adminCredentials.id
        console.log(req.session.userId)
        return res.redirect('/dashboard')
    } else {
        var error_msg = "Wrong Username and Password"
        req.flash('error', error_msg)
        res.render('index',{lg: req.query})
        console.log("Failed Login!")
    }
})

app.get('/dashboard', redirectLogin, function(req, res) {
    req.getConnection(function(error, con){
        console.log(req.session)
        // Alumni Data Load
        con.query('SELECT * FROM alumniData ORDER BY id DESC', function(err, rows, fields){
            if(err){
                req.flash('error', err)
                res.render('dashboard', {
                    title: 'Total Alumni Data',
                    data: '-'
                })
            } else {
                res.render('dashboard', {
                    alumniTitle: 'Total Alumni Data',
                    alumniData: rows.length
                })
            }
        })
    })
})

app.post('/logout', redirectLogin, function(req, res){
    req.session.destroy(err => {
        if(err){
            return res.redirect('/dashboard')
        }
        res.clearCookie('sid')
        res.redirect('/')
    })
})

module.exports = app;