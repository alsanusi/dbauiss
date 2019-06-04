const express = require('express')
const app = express()
const pdfPrinter = require('pdfmake')
const fs = require('fs')

//Global Variable
var myPdfJson

//Font Files
var fonts = {
    Roboto: {
        normal: 'fonts/Roboto-Regular.ttf',
        bold: 'fonts/Roboto-Medium.ttf',
        italics: 'fonts/Roboto-Italic.ttf',
        bolditalics: 'fonts/Roboto-MediumItalic.ttf'
    }
}
const printer = new pdfPrinter(fonts)

//Session Checking
const redirectLogin = (req, res, next) => {
    if(!req.session.userId){
        res.redirect('/')
    } else {
        next()
    }
}

//Student TP Number Validation
function tpNumberValidation(sData, tpNumber){
    var studentTpNumber
    studentTpNumber = sData.filter(obj => {
        return obj.tpNumber === tpNumber
    })
    return studentTpNumber.length
}

//View All Student Data
app.get('/', redirectLogin,  function(req, res){
    req.getConnection(function(error, con){
        con.query('SELECT * FROM studentData ORDER BY id DESC', function(err, rows, fields){
            if(err){
                req.flash('error', err)
                res.render('student-view', {
                    data: ''
                })
            } else {
                myPdfJson = rows
                res.render('student-view', {
                    data: rows
                })
            }
        })
    })
})

//GeneratePdf
app.get('/generate-pdf', (req, res) => {

    var bodyData = []

    myPdfJson.forEach(function (studentData) {
        var dataRow = []
        dataRow.push(studentData.id)
        dataRow.push(studentData.tpNumber)
        dataRow.push(studentData.namaLengkap)
        dataRow.push(studentData.nomorTelepon)
        dataRow.push(studentData.daerahAsal)
        dataRow.push(studentData.status)
        dataRow.push(studentData.jurusan)
        dataRow.push(studentData.detailJurusan)
        bodyData.push(dataRow)
    })

    var myTableLayout = {
        pageOrientation: 'landscape',
        content: [{
                text: 'AUISS Student Data List',
                style: 'header'
            },
            {
                text: 'List of Asia Pacific University Indonesian Student Society Student Data.',
                style: 'subHeader',
                lineHeight: 2
            },
            {
                layout: 'headerLineOnly',
                table: {
                    widths: ['auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto', 'auto'],
                    lineHeight: 1,
                    body: bodyData
                }
            }
        ],
        styles: {
            header: {
                fontSize: 25,
                bold: true
            },
            subHeader: {
                fontSize: 20
            }
        }
    }

    generatePdf(myTableLayout).then(res.redirect('/dashboard'))

})

//GeneratePdf
async function generatePdf(tableLayout) {
    var tempData;
    //Build the PDF
    var pdfDoc = printer.createPdfKitDocument(tableLayout)
    //Writing to disk
    pdfDoc.pipe(fs.createWriteStream('./report/studentReport.pdf'))
    pdfDoc.end()
}

//Student Data Input
app.route('/input')
    .get(redirectLogin, function(req, res){
        res.render('student-input', {
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
            detailJurusan: ''
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
                detailJurusan: req.sanitize('detailJurusan')
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
                con.query('SELECT tpNumber from studentdata', function(err, result){
                    if(err){
                        req.flash('error', err)
                        res.render('student-input',{

                        })
                    } else {
                        if(tpNumberValidation(result, tpNumber) > 0){
                            //Error
                            var error_msg = 'Sorry, This TP Number already Inside the Database!'
                            req.flash('error', error_msg)
                            //
                            res.redirect('/student/input')
                        } else {
                            con.query('INSERT INTO studentData SET ?', student, function(err, result){
                                //Throw Err
                                if(err){
                                    req.flash('error', err)
                                    //Render
                                    res.render('student-input', {
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
                                        detailJurusan: student.detailJurusan
                                    })
                                } else {
                                    req.flash('success', 'Student Data Input Successfully!')
                                    //Render
                                    res.render('student-input', {
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
                                        detailJurusan: ''
                                    })
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
            res.render('student-input', {
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
                detailJurusan: req.body.detailJurusan
            })
        }
    })

//Student Data Edit
app.route('/edit/(:id)', redirectLogin)
    .get(function(req, res, next){
        req.getConnection(function(error, con){
            con.query('SELECT * FROM studentData WHERE id = ?', [req.params.id], function(err, rows, fields){
                if(err) throw err
                //If Student Data not Found
                if(rows.length <= 0){
                    req.flash('error', 'Student Data not Found with ID' + req.params.id)
                    res.redirect('/student')
                }else{
                    //If Alumni Data Found
                    res.render('student-edit', {
                        id: rows[0].id,
                        tpNumber: rows[0].tpNumber,
                        namaLengkap: rows[0].namaLengkap,
                        email: rows[0].email,
                        daerahAsal: rows[0].daerahAsal,
                        alamat: rows[0].alamat,
                        nomorTelepon: rows[0].nomorTelepon,
                        jenisKelamin: rows[0].jenisKelamin,
                        tanggalLahir: rows[0].tanggalLahir,
                        status: rows[0].status,
                        jurusan: rows[0].jurusan,
                        detailJurusan: rows[0].detailJurusan,
                    })
                }
            })
        })
    })
    .put(function(req, res, next){
        //Input Validation
        req.assert('tpNumber', 'Required TP Number').notEmpty()
        req.assert('namaLengkap', 'Required Nama Lengkap').notEmpty()
        req.assert('email', 'Required Email').isEmail()
        req.assert('alamat', 'Required Alamat').notEmpty()
        req.assert('nomorTelepon', 'Required Nomor Telepon').notEmpty()
        req.assert('tanggalLahir', 'Required Tanggal Lahir').notEmpty()

        var errors = req.validationErrors()
        
        if(!errors) {
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
                detailJurusan: req.sanitize('detailJurusan')
            }
            req.getConnection(function(error, con){
                con.query('SELECT tpNumber from studentData', function(err, result){
                    if(err){
                        req.flash('error', err)
                        res.render('student-edit', {
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
                            detailJurusan: student.detailJurusan
                        })
                    } else {
                        if(tpNumberValidation(result, tpNumber) > 0){
                            //Error
                            var error_msg = 'Sorry, This TP Number already Inside the Database!'
                            req.flash('error', error_msg)
                            //Input Back
                            res.render('student-edit', {
                                id: req.params.id,
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
                                detailJurusan: req.body.detailJurusan
                            })
                        } else {
                            con.query('UPDATE studentData SET ? WHERE id = ' + req.params.id, student, function(err, result){
                                //If Error
                                if (err) {
                                    req.flash('error', err)
                                    //Render
                                    res.render('student-edit', {
                                        id: req.params.id,
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
                                        detailJurusan: req.body.detailJurusan
                                    })
                                } else {
                                    req.flash('success', 'Student Data Updated Successfully!')
                                    //Redirect
                                    res.redirect('/student')
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
            res.render('student-edit', {
                id: req.params.id,
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
                detailJurusan: req.body.detailJurusan
            })
        }
    })

// Student Data Remove
app.delete('/delete/(:id)', redirectLogin, function(req, res, next) {
	var student = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM studentData WHERE id = ' + req.params.id, student, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/student')
			} else {
				req.flash('success', 'Student deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/student')
			}
		})
	})
})

//Student Data Edit
app.route('/convert/(:id)', redirectLogin)
    .get(function(req, res, next){
        req.getConnection(function(error, con){
            con.query('SELECT * FROM studentData WHERE id = ?', [req.params.id], function(err, rows, fields){
                if(err) throw err
                //If Student Data not Found
                if(rows.length <= 0){
                    req.flash('error', 'Student Data not Found with ID' + req.params.id)
                    res.redirect('/student')
                }else{
                    //If Alumni Data Found
                    res.render('student-convert', {
                        id: rows[0].id,
                        namaLengkap: rows[0].namaLengkap,
                        email: rows[0].email,
                        daerahAsal: rows[0].daerahAsal,
                        alamat: rows[0].alamat,
                        nomorTelepon: rows[0].nomorTelepon,
                        jenisKelamin: rows[0].jenisKelamin,
                        tanggalLahir: rows[0].tanggalLahir,
                        status: rows[0].status,
                        jurusan: rows[0].jurusan,
                        detailJurusan: rows[0].detailJurusan,
                    })
                }
            })
        })
    })
    .put(function(req, res, next){
        //Input Validation
        req.assert('namaLengkap', 'Required Nama Lengkap').notEmpty()
        req.assert('email', 'Required Email').isEmail()
        req.assert('alamat', 'Required Alamat').notEmpty()
        req.assert('nomorTelepon', 'Required Nomor Telepon').notEmpty()
        req.assert('tanggalLahir', 'Required Tanggal Lahir').notEmpty()
        req.assert('tahunKelulusan', 'Required Tahun Kelulusan').notEmpty()
        req.assert('pekerjaanDetails', 'Required Job Details').notEmpty()

        var errors = req.validationErrors()
        
        if(!errors) {
            var student = {
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
                con.query('DELETE FROM studentData WHERE id = ' + req.params.id, student, function(err, result) {
                    //if(err) throw err
                    if (err) {
                        req.flash('error', err)
                        // redirect to users list page
                        res.redirect('/student')
                    } else {
                        con.query('INSERT INTO alumniData SET ?', student, function(err, result){
                            //Render
                            res.redirect('/alumni')
                        })
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
            res.render('student-convert', {
                id: req.params.id,
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
                pekerjaanDetails: req.body.pekerjaanDetails,
            })
        }
    })

module.exports = app