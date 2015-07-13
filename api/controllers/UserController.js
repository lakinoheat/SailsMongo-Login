module.exports = {

  index: function (req, res) {
    if(req.session.flash != {}){
    res.locals.flash = _.clone(req.session.flash);
    }
    else {
      res.locals.flash = {};
    }
    res.view();
    req.session.flash = {};
  },


  home: function(req,res) {
    res.view();
  },

  logout: function(req,res) {
    res.redirect('/user/index');
  },

  create: function (req, res,next)
  {
    var username1 = req.param('username');
    var password1 = req.param('password');

    User.findOne({username: username1},function (err, found) {
      if (err) {
        console.log(err);
        req.session.flash = {err: err}
        return res.redirect('user/index')
      } else if (found) {
        console.log('Username Already Exits');
        var usernameExistsError = [{name : 'usernameExistsError', message : 'Username Already Exits'}];
        req.session.flash = {err: usernameExistsError}
        return res.redirect('user/index')
      } else
      {
        User.create(({username: username1, password: password1}), function (err, user) {
          if (err) {
            /*return next(err);*/
            console.log(err);
            req.session.flash = {err: err}
            return res.redirect('user/index')
          }
          res.status('201');
          res.json(user);
          req.session.flash = {};
        });
      }
      req.session.flash = {};
    });
  },

  findout: function (req,res){
    var lusername1 = req.param('lusername');
    var lpassword1 = req.param('lpassword');

    User.findOne({username: lusername1},function (err, found) {
        if (err) {
          console.log(err);
          req.session.flash = {err: err}
          return res.redirect('user/index')
        } else if (found) {
          if(found.password==lpassword1){
             return res.redirect( /*{json: JSON.stringify(found.username)},*/'user/home?username=found.username')
            /*res.json(found);*/
          }
          else{
            console.log('Wrong Username/Password Combination');
            var usernamePasswordMatchError = [{name : 'usernamePasswordMatchError', message : 'Wrong Username/Password Combination'}];
            req.session.flash = {err: usernamePasswordMatchError}
            return res.redirect('user/index')
          }
          req.session.flash = {};
        } else {
          console.log('Username doesnot Exist');
          var usernameDontExistError = [{name : 'usernameDontExistError', message : 'Username doesnot Exist'}];
          req.session.flash = {err: usernameDontExistError}
          return res.redirect('user/index')
        }
      req.session.flash = {};
    });
  }
}
