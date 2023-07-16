class UserService{
  constructor() {
  }
  createUser = async (user) => {
    const result = await global.db.collection("users").insertOne({user});

    return result.insertedId;
  };
}
  
module.exports = UserService;