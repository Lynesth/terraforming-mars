import {expect} from 'chai';
import {DeepWellHeating} from '../../../src/cards/base/DeepWellHeating';
import {MartianRails} from '../../../src/cards/base/MartianRails';
import {ParliamentHall} from '../../../src/cards/turmoil/ParliamentHall';
import {Game} from '../../../src/Game';
import {Resources} from '../../../src/Resources';
import {PartyName} from '../../../src/turmoil/parties/PartyName';
import {setCustomGameOptions, TestPlayers} from '../../TestingUtils';

describe('ParliamentHall', function() {
  it('Should play', function() {
    const card = new ParliamentHall();
    const card2 = new DeepWellHeating();
    const card3 = new MartianRails();
    const player = TestPlayers.BLUE.newPlayer();

    const gameOptions = setCustomGameOptions();
    const game = new Game('foobar', [player], player, gameOptions);
    expect(card.canPlay(player, game)).is.not.true;

    const mars = game.turmoil!.getPartyByName(PartyName.MARS)!;
    mars.delegates.push(player.id, player.id);
    expect(card.canPlay(player, game)).is.true;

    player.playedCards.push(card2, card3);
    card.play(player);
    expect(player.getProduction(Resources.MEGACREDITS)).to.eq(1);
  });
});
