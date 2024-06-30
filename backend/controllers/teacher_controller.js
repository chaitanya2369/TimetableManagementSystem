module.exports.dashboard = (req, res) => {
    if(req.user){
        if(req.user.role === 'teacher'){
            res.render('teacher_dashboard', { user: req.user });
        }
    }
    else{
        res.redirect('/users/sign-in');
    }
};
