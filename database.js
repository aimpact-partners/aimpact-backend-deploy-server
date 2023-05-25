"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hmr = exports.__beyond_pkg = exports.UserStore = exports.SubjectsStore = exports.SubjectsRecordsStore = exports.DatabaseConnection = void 0;
var dependency_0 = require("@beyond-js/kernel/bundle");
var dependency_1 = require("sqlite3");
var dependency_2 = require("sqlite");
const {
  Bundle: __Bundle
} = dependency_0;
const __pkg = new __Bundle({
  "module": {
    "vspecifier": "@aimpact/backend@1.0.0/database"
  },
  "type": "ts"
}).package();
;
__pkg.dependencies.update([['sqlite3', dependency_1], ['sqlite', dependency_2]]);
const ims = new Map();

/****************************
INTERNAL MODULE: ./connection
****************************/

ims.set('./connection', {
  hash: 1132229957,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.DatabaseConnection = void 0;
    var sqlite3 = require("sqlite3");
    var _sqlite2 = require("sqlite");
    /*bundle*/
    class DatabaseConnection {
      db;
      constructor() {
        this.db = null;
      }
      async connect() {
        if (!this.db) {
          this.db = await (0, _sqlite2.open)({
            filename: "reactive.db",
            driver: sqlite3.Database
          });
        }
      }
      async disconnect() {
        if (this.db) {
          await this.db.close();
          this.db = null;
        }
      }
      get connection() {
        return this.db;
      }
    }
    exports.DatabaseConnection = DatabaseConnection;
  }
});

/***************************************
INTERNAL MODULE: ./stores/subjects/index
***************************************/

ims.set('./stores/subjects/index', {
  hash: 2500059473,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SubjectsStore = void 0;
    var _connection = require("../../connection");
    /*bundle*/
    class SubjectsStore {
      conn;
      constructor() {
        this.conn = new _connection.DatabaseConnection();
      }
      async createSubject(subject) {
        await this.conn.connect();
        const db = this.conn.connection;
        await db.run('INSERT INTO subjects (name) VALUES (?)', subject.name);
        await this.conn.disconnect();
      }
      async listSubjects() {
        await this.conn.connect();
        const db = this.conn.connection;
        const subjects = await db.all('SELECT * FROM subjects');
        await this.conn.disconnect();
        return subjects;
      }
      async deleteSubject(id) {
        await this.conn.connect();
        const db = this.conn.connection;
        await db.run('DELETE FROM subjects WHERE id = ?', id);
        await this.conn.disconnect();
      }
      async findSubject(id) {
        await this.conn.connect();
        const db = this.conn.connection;
        const subject = await db.get('SELECT * FROM subjects WHERE id = ?', id);
        await this.conn.disconnect();
        return subject;
      }
      async updateSubject(id, subject) {
        await this.conn.connect();
        const db = this.conn.connection;
        await db.run('UPDATE subjects SET name = ? WHERE id = ?', [subject.name, id]);
        await this.conn.disconnect();
      }
      async bulkInsertSubjects(subjects) {
        await this.conn.connect();
        const db = this.conn.connection;
        const insert = await db.prepare('INSERT INTO subjects (name) VALUES (?)');
        for (const subject of subjects) {
          await insert.run(subject.name);
        }
        await insert.finalize();
        await this.conn.disconnect();
      }
    }
    exports.SubjectsStore = SubjectsStore;
  }
});

/*****************************************
INTERNAL MODULE: ./stores/subjects/records
*****************************************/

ims.set('./stores/subjects/records', {
  hash: 3181186399,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.SubjectsRecordsStore = void 0;
    var _connection = require("../../connection");
    /*bundle*/
    class SubjectsRecordsStore {
      conn;
      constructor() {
        this.conn = new _connection.DatabaseConnection();
      }
      async createRecord(record) {
        await this.conn.connect();
        const db = this.conn.connection;
        await db.run('INSERT INTO subjects_records (subjects_id, path, type) VALUES (?, ?, ?)', [record.subjects_id, record.path, record.type]);
        await this.conn.disconnect();
      }
      async listRecords() {
        await this.conn.connect();
        const db = this.conn.connection;
        const records = await db.all('SELECT * FROM subjects_records');
        await this.conn.disconnect();
        return records;
      }
      async deleteRecord(subjects_id) {
        await this.conn.connect();
        const db = this.conn.connection;
        await db.run('DELETE FROM subjects_records WHERE subjects_id = ?', subjects_id);
        await this.conn.disconnect();
      }
      async findRecord(subjects_id) {
        await this.conn.connect();
        const db = this.conn.connection;
        const record = await db.get('SELECT * FROM subjects_records WHERE subjects_id = ?', subjects_id);
        await this.conn.disconnect();
        return record;
      }
      async updateRecord(subjects_id, record) {
        await this.conn.connect();
        const db = this.conn.connection;
        await db.run('UPDATE subjects_records SET path = ?, type = ? WHERE subjects_id = ?', [record.path, record.type, subjects_id]);
        await this.conn.disconnect();
      }
      async bulkInsertRecords(records) {
        await this.conn.connect();
        const db = this.conn.connection;
        const insert = await db.prepare('INSERT INTO subjects_records (subjects_id, path, type) VALUES (?, ?, ?)');
        for (const record of records) {
          await insert.run([record.subjects_id, record.path, record.type]);
        }
        await insert.finalize();
        await this.conn.disconnect();
      }
    }
    exports.SubjectsRecordsStore = SubjectsRecordsStore;
  }
});

/*****************************
INTERNAL MODULE: ./stores/user
*****************************/

ims.set('./stores/user', {
  hash: 904697850,
  creator: function (require, exports) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.UserStore = void 0;
    var _connection = require("../connection");
    /*bundle*/
    class UserStore {
      conn;
      constructor() {
        this.conn = new _connection.DatabaseConnection();
      }
      async createUser(user) {
        await this.conn.connect();
        const db = this.conn.connection;
        await db.run('INSERT INTO users (name, lastnames, username, password) VALUES (?, ?, ?, ?)', [user.name, user.lastnames, user.username, user.password]);
        await this.conn.disconnect();
      }
      async listUsers() {
        await this.conn.connect();
        const db = this.conn.connection;
        const users = await db.all('SELECT * FROM users');
        await this.conn.disconnect();
        return users;
      }
      async deleteUser(id) {
        await this.conn.connect();
        const db = this.conn.connection;
        await db.run('DELETE FROM users WHERE id = ?', id);
        await this.conn.disconnect();
      }
      async findUser(id) {
        await this.conn.connect();
        const db = this.conn.connection;
        const user = await db.get('SELECT * FROM users WHERE id = ?', id);
        await this.conn.disconnect();
        return user;
      }
      async updateUser(id, user) {
        await this.conn.connect();
        const db = this.conn.connection;
        await db.run('UPDATE users SET name = ?, lastnames = ?, username = ?, password = ? WHERE id = ?', [user.name, user.lastnames, user.username, user.password, id]);
        await this.conn.disconnect();
      }
      async bulkInsertUsers(users) {
        await this.conn.connect();
        const db = this.conn.connection;
        const insert = db.prepare('INSERT INTO users (name, lastnames, username, password) VALUES (?, ?, ?, ?)');
        for (const user of users) {
          await insert.run([user.name, user.lastnames, user.username, user.password]);
        }
        await insert.finalize();
        await this.conn.disconnect();
      }
    }
    exports.UserStore = UserStore;
  }
});
__pkg.exports.descriptor = [{
  "im": "./connection",
  "from": "DatabaseConnection",
  "name": "DatabaseConnection"
}, {
  "im": "./stores/subjects/index",
  "from": "SubjectsStore",
  "name": "SubjectsStore"
}, {
  "im": "./stores/subjects/records",
  "from": "SubjectsRecordsStore",
  "name": "SubjectsRecordsStore"
}, {
  "im": "./stores/user",
  "from": "UserStore",
  "name": "UserStore"
}];
let DatabaseConnection, SubjectsStore, SubjectsRecordsStore, UserStore;

// Module exports
exports.UserStore = UserStore;
exports.SubjectsRecordsStore = SubjectsRecordsStore;
exports.SubjectsStore = SubjectsStore;
exports.DatabaseConnection = DatabaseConnection;
__pkg.exports.process = function ({
  require,
  prop,
  value
}) {
  (require || prop === 'DatabaseConnection') && (exports.DatabaseConnection = DatabaseConnection = require ? require('./connection').DatabaseConnection : value);
  (require || prop === 'SubjectsStore') && (exports.SubjectsStore = SubjectsStore = require ? require('./stores/subjects/index').SubjectsStore : value);
  (require || prop === 'SubjectsRecordsStore') && (exports.SubjectsRecordsStore = SubjectsRecordsStore = require ? require('./stores/subjects/records').SubjectsRecordsStore : value);
  (require || prop === 'UserStore') && (exports.UserStore = UserStore = require ? require('./stores/user').UserStore : value);
};
const __beyond_pkg = __pkg;
exports.__beyond_pkg = __beyond_pkg;
const hmr = new function () {
  this.on = (event, listener) => __pkg.hmr.on(event, listener);
  this.off = (event, listener) => __pkg.hmr.off(event, listener);
}();
exports.hmr = hmr;
__pkg.initialise(ims);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJzcWxpdGUzIiwicmVxdWlyZSIsIl9zcWxpdGUyIiwiRGF0YWJhc2VDb25uZWN0aW9uIiwiZGIiLCJjb25zdHJ1Y3RvciIsImNvbm5lY3QiLCJvcGVuIiwiZmlsZW5hbWUiLCJkcml2ZXIiLCJEYXRhYmFzZSIsImRpc2Nvbm5lY3QiLCJjbG9zZSIsImNvbm5lY3Rpb24iLCJleHBvcnRzIiwiX2Nvbm5lY3Rpb24iLCJTdWJqZWN0c1N0b3JlIiwiY29ubiIsImNyZWF0ZVN1YmplY3QiLCJzdWJqZWN0IiwicnVuIiwibmFtZSIsImxpc3RTdWJqZWN0cyIsInN1YmplY3RzIiwiYWxsIiwiZGVsZXRlU3ViamVjdCIsImlkIiwiZmluZFN1YmplY3QiLCJnZXQiLCJ1cGRhdGVTdWJqZWN0IiwiYnVsa0luc2VydFN1YmplY3RzIiwiaW5zZXJ0IiwicHJlcGFyZSIsImZpbmFsaXplIiwiU3ViamVjdHNSZWNvcmRzU3RvcmUiLCJjcmVhdGVSZWNvcmQiLCJyZWNvcmQiLCJzdWJqZWN0c19pZCIsInBhdGgiLCJ0eXBlIiwibGlzdFJlY29yZHMiLCJyZWNvcmRzIiwiZGVsZXRlUmVjb3JkIiwiZmluZFJlY29yZCIsInVwZGF0ZVJlY29yZCIsImJ1bGtJbnNlcnRSZWNvcmRzIiwiVXNlclN0b3JlIiwiY3JlYXRlVXNlciIsInVzZXIiLCJsYXN0bmFtZXMiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwibGlzdFVzZXJzIiwidXNlcnMiLCJkZWxldGVVc2VyIiwiZmluZFVzZXIiLCJ1cGRhdGVVc2VyIiwiYnVsa0luc2VydFVzZXJzIl0sInNvdXJjZXMiOlsiRTpcXHdvcmtzcGFjZVxcYWltcGFjdC9jb25uZWN0aW9uLnRzIiwiRTpcXHdvcmtzcGFjZVxcYWltcGFjdC9zdG9yZXMvc3ViamVjdHMvaW5kZXgudHMiLCJFOlxcd29ya3NwYWNlXFxhaW1wYWN0L3N0b3Jlcy9zdWJqZWN0cy9yZWNvcmRzLnRzIiwiRTpcXHdvcmtzcGFjZVxcYWltcGFjdC9zdG9yZXMvdXNlci50cyJdLCJz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