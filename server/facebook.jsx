function Facebook(accessToken) {
    console.log('token: ', accessToken);
    // this.fb = Meteor.require('fbgraph');
    this.fb = FBGraph;
    this.accessToken = accessToken;
    this.fb.setAccessToken(this.accessToken);
    this.options = {
        timeout: 3000,
        pool: {maxSockets: Infinity},
        headers: {connection: "keep-alive"}
    }
    this.fb.setOptions(this.options);
}

Facebook.prototype.query = function(query, method) {
    var self = this;
    var method = (typeof method === 'undefined') ? 'get' : method;
    var data = Meteor.sync(function(done) {
        self.fb[method](query, function(err, res) {
            done(null, res);
        });
    });
    return data.result;
}

Facebook.prototype.getUserData = function() {
    return this.query('me');
}

Meteor.methods({

    addImgur: function(service, token) {
      query = {};
      var arrStr = token.split(/[=&]/);
      console.log('arrStr: ', arrStr[1]);
      // query['services.'+service] = '';
      query['services.'+ service + '.accessToken'] = arrStr[1];
      Meteor.users.update(Meteor.userId(), {$set: query});
      var access_token = Meteor.user().services.imgur.accessToken;
      return access_token;
    },
    buildImgurURL: function() {
      var test = "https://api.imgur.com/oauth2/authorize?client_id="+Meteor.settings.ImgurClientId+"&response_type=token";
      console.log('test server: ', test);
      return test;
    },
    postImgur: function(url) {
      var access_token = Meteor.user().services.imgur.accessToken;
      HTTP.post("https://api.imgur.com/3/image", {
        data: {image: url},
        headers: {
          Authorization: "Bearer " + access_token
        }
      }, function (error, result) {
        if(error) {
          console.log(error);
        }
        else{
          console.log(result);
        }
      })
    },
    postFBPhoto: function(url) {
        FBGraph.setAccessToken(Meteor.user().services.facebook.accessToken);
        var fbUserId = Meteor.user().services.facebook.id;
        var wallPost = {
            url: url
        };

        FBGraph.post(fbUserId + "/photos", wallPost, function(err, res) {
            if (err) {
                console.log('Could not post on Facebook', err);
            } else {
                // returns the post id
                console.log('res: ', res); // { id: xxxxx}
                return res;
            }
        });
    },
    removeMergedCollection: function (mergedUserId) {
        console.log('Merging DB items of user', mergedUserId, 'with user', Meteor.userId());
        Meteor.users.remove(mergedUserId);
    },
    removeService: function (userId, service) {
        console.log('removeService', userId + ' : ' + service);
        
        query = {};
        query['services.'+service] = {};
        Meteor.users.update(Meteor.userId(), {$set: query});
        return service;
    }
});