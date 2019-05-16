const express = require('express')
const app = express()

//Session Checking
const redirectLogin = (req, res, next) => {
    if(!req.session.userId){
        res.redirect('/')
    } else {
        next()
    }
}

//View All Alumni Data
app.get('/', redirectLogin, function(req, res){
    req.getConnection(function(error, con){
        con.query('SELECT * FROM alumniData ORDER BY id DESC', function(err, rows, fields){
            if(err){
                req.flash('error', err)
                res.render('alumni-view', {
                    title: 'Alumni List',
                    data: ''
                })
            } else {
                res.render('alumni-view', {
                    title: 'Alumni List',
                    data: rows
                })
            }
        })
    })
})

//Alumni Data Input
app.route('/input')
    .get(redirectLogin, function(req, res){
        res.render('alumni-input', {
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
    .post(redirectLogin, function(req, res){
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
                        res.render('alumni-input', {
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
                        res.render('alumni-input', {
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
            res.render('alumni-input', {
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

//Alumni Data Edit
app.route('/edit/(:id)')
    .get(redirectLogin, function(req, res, next){
        req.getConnection(function(error, con){
            con.query('SELECT * FROM alumniData WHERE id = ?', [req.params.id], function(err, rows, fields){
                if(err) throw err
                //If Alumni Data not Found
                if(rows.length <= 0){
                    req.flash('error', 'Alumni Data not Found with ID' + req.params.id)
                    res.redirect('/alumni')
                }else{
                    //If Alumni Data Found
                    res.render('alumni-edit', {
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
                        tahunKelulusan: rows[0].tahunKelulusan,
                        pekerjaan: rows[0].pekerjaan,
                        pekerjaanDetails: rows[0].pekerjaanDetails
                    })
                }
            })
        })
    })
    .put(redirectLogin, function(req, res, next){
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
                con.query('UPDATE alumniData SET ? WHERE id = ' + req.params.id, alumni, function(err, result){
                    //If Error
                    if (err) {
                        req.flash('error', err)
                        //Render
                        res.render('alumni-edit', {
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
                            pekerjaanDetails: req.body.pekerjaanDetails
                        })
                    } else {
                        req.flash('success', 'Alumni Data Updated Successfully!')
                        //Redirect
                        res.redirect('/alumni')
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
            res.render('alumni-edit', {
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
                pekerjaanDetails: req.body.pekerjaanDetails
            })
        }
    })


// Alumni Data Remove
app.delete('/delete/(:id)', redirectLogin, function(req, res, next) {
	var alumni = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM alumniData WHERE id = ' + req.params.id, alumni, function(err, result) {
			//if(err) throw err
			if (err) {
				req.flash('error', err)
				// redirect to users list page
				res.redirect('/alumni')
			} else {
				req.flash('success', 'User deleted successfully! id = ' + req.params.id)
				// redirect to users list page
				res.redirect('/alumni')
			}
		})
	})
})


module.exports = app