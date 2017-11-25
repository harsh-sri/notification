var mysql = require('mysql');
/* Creating POOL MySQL connection.*/

var pool    =    mysql.createPool({
      connectionLimit   :   100,
      host              :   '127.0.0.1',//'166.62.27.146',
      user              :   'root',//'helpdesk',
      password          :   '',//'7X7;4(MWk$#~',
      database          :  'studiz',// 'axaxaxaxa',
      debug             :   false
});

module.exports = pool;
