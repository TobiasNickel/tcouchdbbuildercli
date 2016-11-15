
module.exports = function(user,old){
    if(user.type!=='user') return;
    emit(user.email);
}