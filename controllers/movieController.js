const Movie = require('../models/movie');
/* 
*movie 
*/
exports.movie_list = (req, res, next) => {
    res.send('movie list pageinfo');
};
exports.movie_search = (req, res, next) => {
    res.send('movie search list pageinfo');
};
exports.movie_info_get = (req, res, next) => {
    res.send('get movie info');
};
exports.movie_info_create = (req, res, next) => {
    res.send('create movie info');
};
exports.movie_info_update = (req, res, next) => {
    res.send('update movie info');
};
exports.movie_info_delete = (req, res, next) => {
    res.send('delete movie info');
};
