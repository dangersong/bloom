Services = new Mongo.Collection('services');

Services.schema = new SimpleSchema({
  name: {type: String},
  status: {type: String},
  login: {type: String},
  post: {type: String}
});

Services.attachSchema(Services.schema);

Meteor.methods({
  addService(nameInput, urlInput){
    console.log(nameInput);
    if(!Meteor.userId()){
      throw new Meteor.Error('not-authorized');
    }

    Services.insert({
      name: nameInput,
      status: statusInput,
      login: loginInput,
      post: postInput
    });
  },

  deleteService(serviceId){
    Services.remove(serviceId);
  }
});