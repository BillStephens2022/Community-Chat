var exports = module.exports = {};
exports.register = function(req, res) {
    console.log('Controller Register Route***********')
    res.render('register');
};

exports.login = function(req, res) {
    console.log('Controller Login***********')
    res.render('login');
};

exports.dashboard = function(req, res) {
    console.log('Controller Dashboard***********')
    res.render('dashboard');
};

exports.logout = function(req, res) {
    console.log('Controller Logout ***********')
    req.session.destroy(function(err) {
        res.redirect('/');
    });
}