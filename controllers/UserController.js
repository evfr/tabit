const UserService = require('../services/UserService');
const GameService = require('../services/GameService');

class UserController {

  constructor() {
    this.gameService = new GameService();
    this.userService = new UserService();
  }

  startGame = async (req, res) => {
    try {
      const {user} = req.body;
      if (!user) {
        res.send('very bad request').status(400);
        return;
      }

      const userId = await this.userService.createUser(user);
      const gameId = await this.gameService.createGame(userId);
      console.log('Game started');
      res.send({message: `userId : ${userId}, gameId: ${gameId}.
       Send 'gameId' in body when you roll`}).status(200);
    } catch (error) {
      console.error(ex);
      res.send('internal server error').status(500);
    }

  };
}

module.exports = UserController;