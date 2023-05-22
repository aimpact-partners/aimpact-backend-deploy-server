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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQ2pHNEIsSUFBSSxDQUFDM0IsSUFBSSxFQUNUMkIsSUFBSSxDQUFDQyxTQUFTLEVBQ2RELElBQUksQ0FBQ0UsUUFBUSxFQUNiRixJQUFJLENBQUNHLFFBQVEsRUFDYnpCLEVBQUUsQ0FDRixDQUFDO1FBQ0YsTUFBTSxJQUFJLENBQUNULElBQUksQ0FBQ0wsVUFBVSxFQUFFO01BQzdCO01BRUEsTUFBTTZDLGVBQWUsQ0FBQ0osS0FBYTtRQUNsQyxNQUFNLElBQUksQ0FBQ3BDLElBQUksQ0FBQ1YsT0FBTyxFQUFFO1FBQ3pCLE1BQU1GLEVBQUUsR0FBRyxJQUFJLENBQUNZLElBQUksQ0FBQ0gsVUFBVTtRQUMvQixNQUFNaUIsTUFBTSxHQUFHMUIsRUFBRSxDQUFDMkIsT0FBTyxDQUFDLDZFQUE2RSxDQUFDO1FBQ3hHLEtBQUssTUFBTWdCLElBQUksSUFBSUssS0FBSyxFQUFFO1VBQ3pCLE1BQU10QixNQUFNLENBQUNYLEdBQUcsQ0FBQyxDQUFDNEIsSUFBSSxDQUFDM0IsSUFBSSxFQUFFMkIsSUFBSSxDQUFDQyxTQUFTLEVBQUVELElBQUksQ0FBQ0UsUUFBUSxFQUFFRixJQUFJLENBQUNHLFFBQVEsQ0FBQyxDQUFDOztRQUU1RSxNQUFNcEIsTUFBTSxDQUFDRSxRQUFRLEVBQUU7UUFDdkIsTUFBTSxJQUFJLENBQUNoQixJQUFJLENBQUNMLFVBQVUsRUFBRTtNQUM3Qjs7SUFDQUciLCJuYW1lcyI6WyJEYXRhYmFzZUNvbm5lY3Rpb24iLCJkYiIsImNvbnN0cnVjdG9yIiwiY29ubmVjdCIsImZpbGVuYW1lIiwiZHJpdmVyIiwic3FsaXRlMyIsIkRhdGFiYXNlIiwiZGlzY29ubmVjdCIsImNsb3NlIiwiY29ubmVjdGlvbiIsImV4cG9ydHMiLCJTdWJqZWN0c1N0b3JlIiwiY29ubiIsImNyZWF0ZVN1YmplY3QiLCJzdWJqZWN0IiwicnVuIiwibmFtZSIsImxpc3RTdWJqZWN0cyIsInN1YmplY3RzIiwiYWxsIiwiZGVsZXRlU3ViamVjdCIsImlkIiwiZmluZFN1YmplY3QiLCJnZXQiLCJ1cGRhdGVTdWJqZWN0IiwiYnVsa0luc2VydFN1YmplY3RzIiwiaW5zZXJ0IiwicHJlcGFyZSIsImZpbmFsaXplIiwiU3ViamVjdHNSZWNvcmRzU3RvcmUiLCJjcmVhdGVSZWNvcmQiLCJyZWNvcmQiLCJzdWJqZWN0c19pZCIsInBhdGgiLCJ0eXBlIiwibGlzdFJlY29yZHMiLCJyZWNvcmRzIiwiZGVsZXRlUmVjb3JkIiwiZmluZFJlY29yZCIsInVwZGF0ZVJlY29yZCIsImJ1bGtJbnNlcnRSZWNvcmRzIiwiVXNlclN0b3JlIiwiY3JlYXRlVXNlciIsInVzZXIiLCJsYXN0bmFtZXMiLCJ1c2VybmFtZSIsInBhc3N3b3JkIiwibGlzdFVzZXJzIiwidXNlcnMiLCJkZWxldGVVc2VyIiwiZmluZFVzZXIiLCJ1cGRhdGVVc2VyIiwiYnVsa0luc2VydFVzZXJzIl0sInNvdXJjZVJvb3QiOiJFOlxcd29ya3NwYWNlXFxhaW1wYWN0LyIsInNvdXJjZXMiOlsiY29ubmVjdGlvbi50cyIsInN0b3Jlcy9zdWJqZWN0cy9pbmRleC50cyIsInN0b3Jlcy9zdWJqZWN0cy9yZWNvcmRzLnRzIiwic3RvcmVzL3VzZXIudHMiXSwic291cmNlc0NvbnRlbnQiOltudWxsLG51bGwsbnVsbCxudWxsXX0=