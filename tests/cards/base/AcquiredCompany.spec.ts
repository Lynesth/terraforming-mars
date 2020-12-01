
import {expect} from 'chai';
import {AcquiredCompany} from '../../../src/cards/base/AcquiredCompany';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('AcquiredCompany', function() {
  it('Should play', function() {
    const card = new AcquiredCompany();
    const player = TestPlayers.BLUE.newPlayer();
    const game = new Game('foobar', [player, player], player);
    card.play(player, game);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(3);
  });
});
