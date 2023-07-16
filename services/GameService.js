const { ObjectId } = require('mongodb');

const LAST_FRAME_INDEX = 9;

const frameJSON = {
  rolls : new Array(2),
  score: null,
  used: false
}

class GameService{
  constructor() {
    this.gameJSON = Array(9).fill(frameJSON);
    this.gameJSON.push({
      rolls : new Array(3),
      score: null,
      used: false
    });
  }

  createGame = async (user) => {
    const result = await global.db.collection("bowling_game").insertOne({user, frames: this.gameJSON });
    return result.insertedId;
  };

  updateScore = async (gameId) => {
    const filter = {_id: new ObjectId(gameId)};
    const theGame = await global.db.collection("bowling_game").findOne(filter);
    const {currFrame, currRoll }= this.getCurrentFrameAndRoll(theGame);
    if (currFrame === -1 ) return {message: 'The game is over'};

    //limit the second roll hit number by the prev
    let pinsLeft = currRoll === 0? 10 : (10 - theGame.frames[currFrame].rolls[0]);
    //add another roll for the last frame
    if (currFrame === LAST_FRAME_INDEX && (theGame.frames[currFrame].rolls[0] + theGame.frames[currFrame].rolls[1]) === 10) pinsLeft = 10;
    //hit the pins here
    const pinsDown = Math.floor(Math.random() * (pinsLeft + 1));
    //update the current roll pins down num
    theGame.frames[currFrame].rolls[currRoll] = pinsDown;

    //update the frame is used
    if (currFrame < LAST_FRAME_INDEX) {
      theGame.frames[currFrame].used = pinsDown === 10 && currRoll === 0 ? true : false;
      theGame.frames[currFrame].used = currRoll > 0 ? true : theGame.frames[currFrame].used;      
    } else {
      theGame.frames[currFrame].used = (currRoll === 1 &&  (theGame.frames[currFrame].rolls[0] + theGame.frames[currFrame].rolls[1]) < 10) || currRoll === 2;
    }

    //check for a "spare" and update the previous frame score
    if (currFrame > 0 && currRoll === 0 && theGame.frames[currFrame - 1].rolls[0] < 10 &&
      (theGame.frames[currFrame - 1].rolls[0] + theGame.frames[currFrame - 1].rolls[1] === 10)) {
        theGame.frames[currFrame-1].score += pinsDown;
    }

    //check for a "strike" and update the previous frame score
    if (currFrame > 0 && theGame.frames[currFrame].used && theGame.frames[currFrame - 1].rolls[0] === 10) {
      theGame.frames[currFrame - 1].score += theGame.frames[currFrame].rolls[0] + theGame.frames[currFrame].rolls[1];
    }

    //update the current frame score
    theGame.frames[currFrame].score = (theGame.frames[currFrame - 1]?.score || 0) + 
      theGame.frames[currFrame].rolls[0] + 
      (theGame.frames[currFrame]?.rolls[1] || 0) + 
      (theGame.frames[currFrame]?.rolls[2] || 0);

    //save to db
    const update = { $set: { frames: theGame.frames } };
    await global.db.collection("bowling_game").updateOne(filter, update);

    //build the response message
    const message = this.getResponseMessage(theGame, currFrame, currRoll);
    const currentScore = theGame.frames[currFrame].score; //|| theGame.frames[currFrame -1 ]?.score || pinsDown;
    return {currentScore, message};
  };

  getCurrentFrameAndRoll = (game) => {
    const firstUnusedFrameIndex = game.frames.findIndex(frame => frame.used === false);
    if (firstUnusedFrameIndex === -1) return {currFrame: firstUnusedFrameIndex, currRoll: -1};
    const firstUnusedRollIndex = game.frames[firstUnusedFrameIndex].rolls.findIndex(roll => roll === null);
    return {currFrame: firstUnusedFrameIndex, currRoll: firstUnusedRollIndex};
  }

  getResponseMessage = (theGame, currFrame, currRoll) => {
    let message;
    if (currFrame === LAST_FRAME_INDEX && currRoll === 1) {
      if ((theGame.frames[currFrame].rolls[0] + theGame.frames[currFrame].rolls[1]) === 10) {
        message = `you have an additional roll. Current score: ${theGame.frames[currFrame].score}`;
        theGame.frames[currFrame].used = false;
      } else {
        message = `The game is over. The final score: ${theGame.frames[currFrame].score}`;
      }
    } else {
      message = `Please continue the game. Last roll score: ${theGame.frames[currFrame].rolls[currRoll]}`;
    }
    return message;
  }
}

module.exports = GameService;