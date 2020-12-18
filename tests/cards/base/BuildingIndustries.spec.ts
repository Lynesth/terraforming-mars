import {expect} from 'chai';
import {BuildingIndustries} from '../../../src/cards/base/BuildingIndustries';
import {Game} from '../../../src/Game';
import {Player} from '../../../src/Player';
import {Resources} from '../../../src/Resources';
import {TestPlayers} from '../../TestingUtils';

describe('BuildingIndustries', function() {
  let card: BuildingIndustries; let player: Player; let redPlayer: Player; let game: Game;

  beforeEach(function() {
    card = new BuildingIndustries();
    player = TestPlayers.BLUE.newPlayer();
    redPlayer = TestPlayers.RED.newPlayer();
    game = new Game('foobar', [player, redPlayer], player);
  });

  it('Can\'t play', function() {
    expect(card.canPlay(player, game)).is.not.true;
  });

  it('Should play', function() {
    player.addProduction(Resources.ENERGY);
    expect(card.canPlay(player, game)).is.true;

    card.play(player, game);
    expect(player.getProduction(Resources.ENERGY)).to.eq(0);
    expect(player.getProduction(Resources.STEEL)).to.eq(2);
  });
});
