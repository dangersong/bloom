Images = new Mongo.Collection('images');

Images.schema = new SimpleSchema({
  url: {type: String}
});

Images.attachSchema(Images.schema);

Meteor.methods({
  uploadImage(urlInput){
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Images.insert({
      url: urlInput.files,
      createdAt: new Date()
    });
  }
});


// Meteor.publish('Lists.public', function() {
//   return Lists.find({
//     userId: {$exists: false}
//   }, {
//     fields: Lists.publicFields
//   });
// });