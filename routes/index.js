const express = require('express')
const app = express()
const mysql = require('promise-mysql')
const config = require('../config')

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

//Retrieve Student Data
//Student Degreee in IT
function getStudentDegreeInIT(sData){
    var sDegreeIT
    sDegreeIT = sData.filter(obj => {
        return obj.jurusan === "Computing, Technology & Games Development"
    })
    return sDegreeIT.length
}

//Student Degree in Business
function getStudentDegreeInBusiness(sData){
    var sDegreeBusiness
    sDegreeBusiness = sData.filter(obj => {
        return obj.jurusan === "Business, Management, Marketing, Tourism & Media"
    })
    return sDegreeBusiness.length
}

//Student Degree in Engineering
function getStudentDegreeInEngineering(sData){
    var sDegreeEngineering
    sDegreeEngineering = sData.filter(obj => {
        return obj.jurusan === "Engineering"
    })
    return sDegreeEngineering.length
}

//Get Overall Data - Student Foundation
function getStudentDataFoundation(sData){
    var sDataFoundation
    sDataFoundation = sData.filter(obj => {
        return obj.status === "Foundation"
    })
    return sDataFoundation.length
}

//Get Overall Data - Student Diploma
function getStudentDataDiploma(sData){
    var sDataDiploma
    sDataDiploma = sData.filter(obj => {
        return obj.status === "Diploma"
    })
    return sDataDiploma.length
}

//Get Overall Data - Student Degree
function getStudentDataDegree(sData){
    var sDataDegree
    sDataDegree = sData.filter(obj => {
        return obj.status === "Degree"
    })
    return sDataDegree.length
}

//Get Overall Data - Student Master
function getStudentDataMaster(sData){
    var sDataMaster
    sDataMaster = sData.filter(obj => {
        return obj.status === "Master"
    })
    return sDataMaster.length
}

//Get Overall Data - Student PhD
function getStudentDataPhD(sData){
    var sDataPhd
    sDataPhd = sData.filter(obj => {
        return obj.status === "PhD"
    })
    return sDataPhd.length
}

//Retrieve Alumni Data
//Get Overall Data - Alumni Foundation
function getAlumniDataFoundation(aData){
    var aDataFoundation
    aDataFoundation = aData.filter(obj => {
        return obj.status === "Foundation"
    })
    return aDataFoundation.length
}

//Get Overall Data - Alumni Diploma
function getAlumniDataDiploma(aData){
    var aDataDiploma
    aDataDiploma = aData.filter(obj => {
        return obj.status === "Diploma"
    })
    return aDataDiploma.length
}

//Get Overall Data - Alumni Degree
function getAlumniDataDegree(aData){
    var aDataDegree
    aDataDegree = aData.filter(obj => {
        return obj.status === "Degree"
    })
    return aDataDegree.length
}

//Get Overall Data - Alumni Master
function getAlumniDataMaster(aData){
    var aDataMaster
    aDataMaster = aData.filter(obj => {
        return obj.status === "Master"
    })
    return aDataMaster.length
}

//Get Overall Data - Alumni PhD
function getAlumniDataPhD(aData){
    var aDataPhD
    aDataPhD = aData.filter(obj => {
        return obj.status === "PhD"
    })
    return aDataPhD.length
}

//Get Overall Data - Alumni Job in IT
function getAlumniDataJobIt(aData){
    var aDataJobIt
    aDataJobIt = aData.filter(obj => {
        return obj.pekerjaan === "Information Technology"
    })
    return aDataJobIt.length
}

//Get Overall Data - Alumni Job in Business
function getAlumniDataJobBusiness(aData){
    var aDataJobBusiness
    aDataJobBusiness = aData.filter(obj => {
        return obj.pekerjaan === "Business & Marketing"
    })
    return aDataJobBusiness.length
}

//Get Overall Data - Alumni Job in Multimedia
function getAlumniDataJobMultimedia(aData){
    var aDataJobMultimedia
    aDataJobMultimedia = aData.filter(obj => {
        return obj.pekerjaan === "Multimedia"
    })
    return aDataJobMultimedia.length
}

//Get Overall Data - Alumni Job in Engineering
function getAlumniDataJobEngineering(aData){
    var aDataJobEngineering
    aDataJobEngineering = aData.filter(obj => {
        return obj.pekerjaan === "Engineering"
    })
    return aDataJobEngineering.length
}


//Routing Process
//Index
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
        return res.redirect('/dashboard')
    } else {
        var error_msg = "Wrong Username and Password"
        req.flash('error', error_msg)
        res.render('index',{lg: req.query})
        console.log("Failed Login!")
    }
})

app.get('/dashboard', function(req, res){
    //Variable
    var aData, sData
    //Promise
    mysql.createConnection(config.database).then(function(conn){
        //Session
        console.log(req.session)
        conn.query('SELECT * FROM alumniData').then( rows => {
            aData = rows;
            // Alumni Data - Overall
            getAlumniDataFoundation(aData)
            getAlumniDataDiploma(aData)
            getAlumniDataDegree(aData)
            getAlumniDataMaster(aData)
            getAlumniDataPhD(aData)
            getAlumniDataJobIt(aData)
            getAlumniDataJobBusiness(aData)
            getAlumniDataJobMultimedia(aData)
            getAlumniDataJobEngineering(aData)
            return conn.query('SELECT * FROM studentData')
        })
        .then( rows => {
            sData = rows;
            getStudentDegreeInIT(sData)
            getStudentDegreeInBusiness(sData)
            getStudentDegreeInEngineering(sData)
            // Student Data - Overall
            getStudentDataFoundation(sData)
            getStudentDataDiploma(sData)
            getStudentDataDegree(sData)
            getStudentDataMaster(sData)
            getStudentDataPhD(sData)
            return conn.end()
        })
        .then(() => {
            res.render('dashboard', {
                alumniData: aData.length,
                studentData: sData.length,
                studentDegreeITData: getStudentDegreeInIT(sData),
                studentDegreeBusinessData: getStudentDegreeInBusiness(sData),
                studentDegreeEngineering: getStudentDegreeInEngineering(sData),
                // Overall Student Data
                studentDataFoundation: getStudentDataFoundation(sData),
                studentDataDiploma: getStudentDataDiploma(sData),
                studentDataDegree: getStudentDataDegree(sData),
                studentDataMaster: getStudentDataMaster(sData),
                studentDataPhD: getStudentDataPhD(sData),
                // Overal Alumni Data
                alumniDataFoundation: getAlumniDataFoundation(aData),
                alumniDataDiploma: getAlumniDataDiploma(aData),
                alumniDataDegree: getAlumniDataDegree(aData),
                alumniDataMaster: getAlumniDataMaster(aData),
                alumniDataPhD: getAlumniDataPhD(aData),
                // Overal Alumni Job
                alumniDataJobIt: getAlumniDataJobIt(aData),
                alumniDataJobBusiness: getAlumniDataJobBusiness(aData),
                alumniDataJobMultimedia: getAlumniDataJobMultimedia(aData),
                alumniDataJobEngineering: getAlumniDataJobEngineering(aData),
            })
        })
        .catch( err => {
            console.log(err)
            if(err){
                res.render('dashboard', {
                    alumniTitle: '',
                    alumniData: '',
                    studentTitle: '',
                    studentData: ''
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