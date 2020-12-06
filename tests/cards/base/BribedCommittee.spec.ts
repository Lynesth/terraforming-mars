import {expect} from 'chai';
import {BribedCommittee} from '../../../src/cards/base/BribedCommittee';
import {Game} from '../../../src/Game';
import {TestPlayers} from '../../TestingUtils';

describe('BribedCommittee', function() {
  it('Should play', function() {
    const card = new BribedCommittee();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    card.play(player, game);
    player.victoryPointsBreakdown.setVictoryPoints('victoryPoints', card.getVictoryPoints(player, game));
    expect(player.victoryPointsBreakdown.victoryPoints).to.eq(-2);
    expect(player.getTerraformRating()).to.eq(22);
  });
});
