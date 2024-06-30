module.exports.home = (req, res) => {
    res.render('home');
};

// module.exports.dashboard = (req, res) => {
//     const user = req.user;
//     if (user) {
//         res.render('dashboard', { user });
//     } else {
//         res.redirect('/users/sign-in');
//     }
// };
