const express = require('express')
const app = express()

//View All Student Data
app.get('/', function(req, res){
    req.getConnection(function(error, con){
        con.query('SELECT * FROM studentData ORDER BY id DESC', function(err, rows, fields){
            if(err){
                req.flash('error', err)
                res.render('student-view', {
                    data: ''
                })
            } else {
                res.render('student-view', {
                    data: rows
                })
            }
        })
    })
})

//Student Data Input
app.route('/input')
    .get(function(req, res){
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
                            detailJurusan: student.detailJurusan,
                            semester: student.semester
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
                            detailJurusan: '',
                            semester: ''
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
                detailJurusan: req.body.detailJurusan,
                semester: req.body.semester
            })
        }
    })

//Student Data Edit
app.route('/edit/(:id)')
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
                    semester: rows[0].semester
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
                detailJurusan: req.sanitize('detailJurusan'),
                semester: req.sanitize('semester').escape().trim()
            }
            req.getConnection(function(error, con){
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
                            detailJurusan: req.body.detailJurusan,
                            semester: req.body.semester
                        })
                    } else {
                        req.flash('success', 'Student Data Updated Successfully!')
                        //Redirect
                        res.redirect('/student')
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
                detailJurusan: req.body.detailJurusan,
                semester: req.body.semester
            })
        }
    })

// Student Data Remove
app.delete('/delete/(:id)', function(req, res, next) {
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


module.exports = app