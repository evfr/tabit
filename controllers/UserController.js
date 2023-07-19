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
        res.status(400).send('very bad request');
        return;
      }

      const userId = await this.userService.createUser(user);
      const gameId = await this.gameService.createGame(userId);
      console.log('Game started');

      res.status(200).send({ userId , gameId, 
      message: `Send 'gameId' in body when you roll`});
    } catch (error) {
      console.error(error);
      res.status(500).send('internal server error');
    }

  };
}

module.exports = UserController;