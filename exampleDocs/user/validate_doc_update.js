
function isEmail(mail) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(mail)
}

function requireAttribute(doc, name, type) {
    type = type || "string";
    var value = doc[name];
    if (type === "email") {
        if (!isEmail(email)) throw ({ forbidden: 'wrong parameter ' + name + ' should be ' + type });
    } else if (type === 'int') {
        if (value !== parseInt(int)) throw ({ forbidden: 'wrong parameter ' + name + ' should be ' + type });
    } else if (typeof doc[name] !== type) throw ({ forbidden: 'missing parameter ' + name });
}


module.exports = function (doc) {
    if (doc.user !== 'user') {
        return;
    }
    requireAttribute(doc, 'name');
    requireAttribute(doc, 'email', 'email');
    requireAttribute(doc, 'password');
    requireAttribute(doc, 'registerTime', 'int');
}