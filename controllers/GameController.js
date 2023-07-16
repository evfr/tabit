const GameService = require('../services/GameService');

class GameController {
  constructor() {
    this.gameService = new GameService();
  }

  roll = async (req, res) => {
    try {
      const {gameId} = req.body;
      if (!gameId) {
        res.send('very bad request').status(400);
        return;
      }
      const result = await this.gameService.updateScore(gameId);
      console.log('roll', result);
      res.send(result).status(200);
    } catch (error) {
      console.error(error);
      res.send('internal server error').status(500);
    }
  };
}
  
module.exports = GameController;