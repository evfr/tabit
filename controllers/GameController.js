const GameService = require('../services/GameService');

class GameController {
  constructor() {
    this.gameService = new GameService();
  }

  roll = async (req, res) => {
    try {
      const {gameId} = req.body;
      if (!gameId) {
        res.status(400).send('very bad request');
        return;
      }
      const result = await this.gameService.updateScore(gameId);
      console.log('roll', result);
      res.status(200).send(result);
    } catch (error) {
      console.error(error);
      res.status(500).send('internal server error');
    }
  };
}
  
module.exports = GameController;