
import {expect} from 'chai';
import {AdaptedLichen} from '../../../src/cards/base/AdaptedLichen';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('AdaptedLichen', function() {
  it('Should play', function() {
    const card = new AdaptedLichen();
    const player = TestPlayers.BLUE.newPlayer();
    const redPlayer = TestPlayers.RED.newPlayer();
    const game = new Game('foobar', [player, redPlayer], player);
    card.play(player, game);

    expect(player.getProduction(Resources.PLANTS)).to.eq(1);
  });
});
