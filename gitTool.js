function gitTool(folder) {
    var me = this;
    me.folder = folder;
    var {exec} = require('child_process');
    this.gitParser = function(str) {
        let patt = new RegExp('^(git|ssh|http|https)\:\/\/([^\@]+\@|\@|)([^\/]+)\/([^\/]+)\/([^\.]+)\.git$', 'i');
        let v = str.match(patt);
        return (!v) ? false : {
            sp    : v[3],
            auth  : v[2].replace(/\@/, ''),
            user  : v[4],
            repo  : v[5]
        } 
    } 
    this.gitAddAuth = function(str, user, pass) {
        let patt = new RegExp('\:\/\/([^\@]+\@|\@|)([^\/]+)', 'i');
        return str.replace(patt, '://' + encodeURIComponent(user) + 
        ((pass) ? (':' + encodeURIComponent(pass)) : '') +  '@$2');
    }

    this.getBranches = function(space, cbk) {
        exec('cd ' + space + ' && git branch -a', (err, stdout, stderr) => {
            if (err) {
              return (typeof cbk !== 'function') ? '' : cbk({
                status : 'failure',
                errorMessage : err.message
              });
            }
            var curr = '';
            var l = stdout.split("\n").filter(function(item) {
                return (item) && !/\-\>/i.test(item);
            }).map(function(item) {
                curr = /\*/i.test(item)? item : curr;
                item = item.replace(/remotes\/origin\//i, '').replace(/\*/i, '').replace(/^\s+|\s+$/gm,'');
                return item;
            }).filter((value, idx, self) => self.indexOf(value) === idx);
            return (typeof cbk !== 'function') ? '' : cbk({
                status : 'success',
                data : {
                    currentBranch : curr,
                    branches : l
                } 
            });
        }); 
    }
    this.gitPull = function(dirname, cbk) {
        exec('cd ' + dirname + ' && git pull', (err, stdout, stderr) => {
            if (err) {
                return (typeof cbk !== 'function') ? '' : cbk({
                    status : 'failure',
                    errorMessage : err.message
                })
            }
            var curr = '';
            var l = stdout.split("\n");
            return (typeof cbk !== 'function') ? '' : cbk({
                status : 'success',
                data : {
                    currentBranch : curr,
                    branches : l
                } 
            })
        }); 
    }
    this.gitCheckout = function(dirname, branch, cbk) {
        exec('cd ' + dirname + ' && git checkout ' + branch, (err, stdout, stderr) => {
            if (err) {
                return (typeof cbk !== 'function') ? '' : cbk({
                    status : 'failure',
                    errorMessage : err.message
                })
            }
            var curr = '';
            var l = stdout.split("\n");
            return (typeof cbk !== 'function') ? '' : cbk({
                status : 'success',
                data : {
                    currentBranch : curr,
                    branches : l
                } 
            })
        }); 
    }
    me.gitClone = function(dirname, gitUrl, cbk) {
        exec('rm -fr ' + dirname + ' && git clone ' + gitUrl + ' ' + dirname, 
        (err, stdout, stderr) => {
            if (err) {
                return (typeof cbk !== 'function') ? '' : cbk({
                    status : 'failure',
                    errorMessage : err.message
                })
            }
            var curr = '';
            var l = stdout.split("\n");
            return (typeof cbk !== 'function') ? '' : cbk({
                status : 'success',
                data : l 
            })
        }); 
    }    
}
