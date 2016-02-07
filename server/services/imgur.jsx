Meteor.methods({
    add_imgur: function(service, token) {
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
    create_imgur: function(albumTitle){
      //console.log(albumTitle);
      var access_token = Meteor.user().services.imgur.accessToken;
      HTTP.post("https://api.imgur.com/3/album",{
        headers: {
          Authorization: "Bearer " + access_token
        },
        params: {title: albumTitle}
      }, function(error, result){
        if(error){
          console.log(error);
        }
        else{
          //console.log(result.data.data.id);
          Services.update(
            {name: 'imgur'},
            {$push: {album: {albumId: result.data.data.id, albumTitle: albumTitle }}}
          );
            //service.album[service.album.length - 1].albumId = result.data.data.id;
            //service.album[service.album.length - 1].albumTitle = albumTitle;
          return result.content;

        }
      })
    },
    post_imgur: function(url) {
      var imageId, link;
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
          console.log('result: ', result);
          imageId = result.data.data.id;
          link = result.data.data.link;
          //console.log(imageId);
          Images.insert({
            url: url,
            imageId: imageId,
            link: link
          })
        }
      })
    },

  //PlayersList.find({ name: "David" }).fetch();
    delete_imgur: function(url){
      var access_token = Meteor.user().services.imgur.accessToken;
      //console.log(url);
      var imageId = Images.findOne({ url: url }).imageId;
      //console.log(imageId);
      HTTP.del("https://api.imgur.com/3/image/"+imageId,{
        headers: {
          Authorization: "Bearer " + access_token
        }
      }, function (error, result) {
        if(error) {
          console.log(error);
        }
        else {
          //console.log(result);
          Images.remove({imageId: imageId});
        }
      })
    }
});
