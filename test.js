/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        var db = window.sqlitePlugin.openDatabase({name: "test.db"});

        console.log("db opened");

        var i, j;
        var cq = 'CREATE TABLE IF NOT EXISTS tt (text1 text';
        for (i=2; i<=25; ++i) cq += ', text'+i+ ' text';
        for (i=1; i<=5; ++i) cq += ', int'+i + ' integer';
        for (i=1; i<=5; ++i) cq += ', float'+i + ' float';
        for (i=1; i<=5; ++i) cq += ', nulltext'+i+ ' text DEFAULT NULL';
        cq += ')';

        console.log('cq: ' + cq);

        db.executeSql('DROP TABLE IF EXISTS tt');

        db.transaction(function(tx) {
            tx.executeSql(cq);
            for (i=1; i<=20; ++i) {
                var vv = [];
                for (j=1; j<=25; ++j) vv.push('teststringteststring-' + i + '-' + j);
                for (j=1; j<=5; ++j) vv.push(i*100 + j);
                for (j=1; j<=5; ++j) vv.push(i*101.11 + j*1.101);
                for (j=1; j<=5; ++j) vv.push(null);
                tx.executeSql('INSERT INTO tt VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)', vv);
            }

        });

        var interval = setInterval(
            function() {
                db.executeSql(
                    'select * from tt',
                    null,
                    function(res) { console.log('success length: ' + res.rows.length + ' first row:' + JSON.stringify(res.rows.item(0))) },
                    function(err) { console.log('error') }
                );
            },
            1000);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
