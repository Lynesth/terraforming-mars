import {expect} from 'chai';
import {ArtificialLake} from '../../../src/cards/base/ArtificialLake';
import {Game} from '../../../src/Game';
import {SelectSpace} from '../../../src/inputs/SelectSpace';
import {Player} from '../../../src/Player';
import {TestPlayers} from '../../TestingUtils';

describe('ArtificialLake', function() {
  let card : ArtificialLake; let player : Player; let game : Game;

  beforeEach(function() {
    card = new ArtificialLake();
    player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    game = Game.newInstance('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    card.play(player, game);
    expect(game.deferredActions).has.lengthOf(1);
    const action = game.deferredActions.shift()!.execute() as SelectSpace;
    action!.cb(action!.availableSpaces[0]);
    expect(game.board.getOceansOnBoard()).to.eq(1);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints());
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(1);
  });
});
