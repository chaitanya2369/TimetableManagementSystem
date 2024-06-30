module.exports.dashboard = (req, res) => {
        if(req.user){
            if(req.user.role === 'student'){
                res.render('student_dashboard', { user: req.user });
            }
            else{
                res.redirect('/users/sign-in');
            }
        }
};
