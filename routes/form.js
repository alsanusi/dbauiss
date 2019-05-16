const express = require('express')
const app = express()

app.get('/', function(req, res){
    res.render('public-index')
})

//Alumni Data Input
app.route('/alumni')
    .get(function(req, res){
        res.render('public-alumni', {
            namaLengkap: '',
            email: '',
            daerahAsal: '',
            alamat: '',
            nomorTelepon: '',
            jenisKelamin: '',
            tanggalLahir: '',
            status: '',
            jurusan: '',
            detailJurusan: '',
            tahunKelulusan: '',
            pekerjaan: '',
            pekerjaanDetails: ''
        })
    })
    .post(function(req, res){
        //Input Validation
        req.assert('namaLengkap', 'Required Nama Lengkap').notEmpty()
        req.assert('email', 'Required Email').isEmail()
        req.assert('alamat', 'Required Alamat').notEmpty()
        req.assert('nomorTelepon', 'Required Nomor Telepon').notEmpty()
        req.assert('tanggalLahir', 'Required Tanggal Lahir').notEmpty()
        req.assert('pekerjaanDetails', 'Required Job Details').notEmpty()

        var errors = req.validationErrors()

        if(!errors){
            var alumni = {
                namaLengkap: req.sanitize('namaLengkap').escape().trim(),
                email: req.sanitize('email').escape().trim(),
                daerahAsal: req.sanitize('daerahAsal').escape().trim(),
                alamat: req.sanitize('alamat').escape().trim(),
                nomorTelepon: req.sanitize('nomorTelepon').escape().trim(),
                jenisKelamin: req.sanitize('jenisKelamin').escape().trim(),
                tanggalLahir: req.sanitize('tanggalLahir').escape().trim(),
                status: req.sanitize('status').escape().trim(),            
                jurusan: req.sanitize('jurusan'),
                detailJurusan: req.sanitize('detailJurusan'),
                tahunKelulusan: req.sanitize('tahunKelulusan').escape().trim(),
                pekerjaan: req.sanitize('pekerjaan'),
                pekerjaanDetails: req.sanitize('pekerjaanDetails').escape().trim()
            }
            req.getConnection(function(error, con){
                //Validation for Jurusan and Detail Jurusan
                switch (alumni.status){
                    case "Foundation":
                    alumni.jurusan = "-"
                    alumni.detailJurusan = "-"
                    break;
                    case "Diploma":
                    alumni.detailJurusan = "-"
                    break;
                    case "Master":
                    alumni.detailJurusan = "-"
                    break;
                    case "PhD":
                    alumni.detailJurusan = "-"
                    break;
                }
                con.query('INSERT INTO alumniData SET ?', alumni, function(err, result){
                    //Throw Err
                    if(err){
                        req.flash('error', err)
                        //Render
                        res.render('public-alumni', {
                            namaLengkap: alumni.namaLengkap,
                            email: alumni.email,
                            daerahAsal: alumni.daerahAsal,
                            alamat: alumni.alamat,
                            nomorTelepon: alumni.nomorTelepon,
                            jenisKelamin: alumni.jenisKelamin,
                            tanggalLahir: alumni.tanggalLahir,
                            status: alumni.status,
                            jurusan: alumni.jurusan,
                            detailJurusan: alumni.detailJurusan,
                            tahunKelulusan: alumni.tahunKelulusan,
                            pekerjaan: alumni.pekerjaan,
                            pekerjaanDetails: alumni.pekerjaanDetails
                        })
                    } else {
                        req.flash('success', 'Alumni Data Input Successfully!')
                        //Render
                        res.render('public-thanks')
                    }
                })
            })
        } else {
            var error_msg = ''
            errors.forEach(function(error){
                error_msg += error.msg + '<br>'
            })
            req.flash('error', error_msg)
            //
            res.render('public-alumni', {
                namaLengkap: req.body.namaLengkap,
                email: req.body.email,
                daerahAsal: req.body.daerahAsal,
                alamat: req.body.alamat,
                nomorTelepon: req.body.nomorTelepon,
                jenisKelamin: req.body.jenisKelamin,
                tanggalLahir: req.body.tanggalLahir,
                status: req.body.status,
                jurusan: req.body.jurusan,
                detailJurusan: req.body.detailJurusan,
                tahunKelulusan: req.body.tahunKelulusan,
                pekerjaan: req.body.pekerjaan,
                pekerjaanDetails: req.body.pekerjaanDetails
            })
        }
    })

//Student TP Number Validation
function tpNumberValidation(sData, tpNumber){
    var studentTpNumber
    studentTpNumber = sData.filter(obj => {
        return obj.tpNumber === tpNumber
    })
    return studentTpNumber.length
}

//Student Data Input
app.route('/student')
    .get(function(req, res){
        res.render('public-student', {
            tpNumber: '',
            namaLengkap: '',
            email: '',
            daerahAsal: '',
            alamat: '',
            nomorTelepon: '',
            jenisKelamin: '',
            tanggalLahir: '',
            status: '',
            jurusan: '',
            detailJurusan: '',
            semester: ''
        })
    })
    .post(function(req, res){
        //Input Validation
        req.assert('tpNumber', 'Required TP Number').notEmpty()
        req.assert('namaLengkap', 'Required Nama Lengkap').notEmpty()
        req.assert('email', 'Required Email').isEmail()
        req.assert('alamat', 'Required Alamat').notEmpty()
        req.assert('nomorTelepon', 'Required Nomor Telepon').notEmpty()
        req.assert('tanggalLahir', 'Required Tanggal Lahir').notEmpty()

        var errors = req.validationErrors()
        var tpNumber = req.body.tpNumber

        if(!errors){
            var student = {
                tpNumber: req.sanitize('tpNumber').escape().trim(),
                namaLengkap: req.sanitize('namaLengkap').escape().trim(),
                email: req.sanitize('email').escape().trim(),
                daerahAsal: req.sanitize('daerahAsal').escape().trim(),
                alamat: req.sanitize('alamat').escape().trim(),
                nomorTelepon: req.sanitize('nomorTelepon').escape().trim(),
                jenisKelamin: req.sanitize('jenisKelamin').escape().trim(),
                tanggalLahir: req.sanitize('tanggalLahir').escape().trim(),
                status: req.sanitize('status').escape().trim(),            
                jurusan: req.sanitize('jurusan'),
                detailJurusan: req.sanitize('detailJurusan'),
                semester: req.sanitize('semester').escape().trim()
            }
            req.getConnection(function(error, con){
                //Validation for Student Status
                switch (student.status){
                    case "Undone":
                    student.jurusan = "-"
                    student.detailJurusan = "-"
                    student.tahunKelulusan = "-"
                    break;
                    case "Foundation":
                    student.jurusan = "-"
                    student.detailJurusan = "-"
                    break;
                    case "Diploma":
                    student.detailJurusan = "-"
                    break;
                    case "Master":
                    student.detailJurusan = "-"
                    break;
                    case "PhD":
                    student.detailJurusan = "-"
                    break;
                }
                con.query('SELECT tpNumber from studentData', function(err, result){
                    if(err){
                        req.flash('error', err)
                        //
                        res.render('public-student', {
                            tpNumber: student.tpNumber,
                            namaLengkap: student.namaLengkap,
                            email: student.email,
                            daerahAsal: student.daerahAsal,
                            alamat: student.alamat,
                            nomorTelepon: student.nomorTelepon,
                            jenisKelamin: student.jenisKelamin,
                            tanggalLahir: student.tanggalLahir,
                            status: student.status,
                            jurusan: student.jurusan,
                            detailJurusan: student.detailJurusan,
                            semester: student.semester
                        })
                    } else {
                        if(tpNumberValidation(result, tpNumber) > 0){
                            //Error
                            var error_msg = 'Sorry, This TP Number already Inside the Database!'
                            req.flash('error', error_msg)
                            //Input Back
                            res.redirect('/form/student-form')
                        } else {
                            con.query('INSERT INTO studentData SET ?', student, function(err, result){
                                if(err){
                                    req.flash('error', err)
                                    //Render
                                    res.render('public-student', {
                                        tpNumber: student.tpNumber,
                                        namaLengkap: student.namaLengkap,
                                        email: student.email,
                                        daerahAsal: student.daerahAsal,
                                        alamat: student.alamat,
                                        nomorTelepon: student.nomorTelepon,
                                        jenisKelamin: student.jenisKelamin,
                                        tanggalLahir: student.tanggalLahir,
                                        status: student.status,
                                        jurusan: student.jurusan,
                                        detailJurusan: student.detailJurusan,
                                        semester: student.semester
                                    })
                                } else {
                                    req.flash('success', 'Student Data Input Successfully!')
                                    //Render
                                    res.render('public-thanks')
                                }
                            })
                        }
                    }
                })
            })
        } else {
            var error_msg = ''
            errors.forEach(function(error){
                error_msg += error.msg + '<br>'
            })
            req.flash('error', error_msg)
            //
            res.render('public-student', {
                tpNumber: req.body.tpNumber,
                namaLengkap: req.body.namaLengkap,
                email: req.body.email,
                daerahAsal: req.body.daerahAsal,
                alamat: req.body.alamat,
                nomorTelepon: req.body.nomorTelepon,
                jenisKelamin: req.body.jenisKelamin,
                tanggalLahir: req.body.tanggalLahir,
                status: req.body.status,
                jurusan: req.body.jurusan,
                detailJurusan: req.body.detailJurusan,
                semester: req.body.semester
            })
        }
    })

app.route('/testAja')
    .get(function(req, res){
        res.render('public-test', {
            tpNumber: ''
        })
    })
    .post(function(req, res){
        req.getConnection(function(error, con){
            con.query('SELECT tpNumber FROM studentData' , function(err, result){
                if(err){
                    console.log(err)
                } else {
                    var tpNumber = req.body.tpNumber;
                    if(tpNumberValidation(result,tpNumber) > 0){
                        var error_msg = ''
                        error_msg = 'Sorry, This TP Number already Inside the Database!'
                        req.flash('error', error_msg)
                        console.log('Success')
                        res.render('public-student', {
                            tpNumber: req.body.tpNumber,
                        })
                    } else {
                        console.log('error')
                    }
                }
            })
        })
    })

module.exports = app