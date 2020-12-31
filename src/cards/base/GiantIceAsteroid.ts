import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class GiantIceAsteroid implements IProjectCard {
  public cost = 36;
  public tags = [Tags.SPACE];
  public name = CardName.GIANT_ICE_ASTEROID;
  public cardType = CardType.EVENT;
  public hasRequirements = false;
  public howToAffordReds?: HowToAffordRedsPolicy;

  public canPlay(player: Player, game: Game): boolean {
    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      const actionDetails = new ActionDetails({card: this, temperatureIncrease: 2, oceansToPlace: 2, oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player)});
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
      return this.howToAffordReds.canAfford;
    }

    return true;
  }

  public play(player: Player, game: Game) {
    game.increaseTemperature(player, 2);
    game.defer(new PlaceOceanTile(player, game, 'Select space for first ocean'));
    game.defer(new PlaceOceanTile(player, game, 'Select space for second ocean'));
    game.defer(new RemoveAnyPlants(player, game, 6));
    return undefined;
  }

  public metadata: CardMetadata = {
    description: 'Raise temperature 2 steps and place 2 ocean tiles. Remove up to 6 plants from any player.',
    cardNumber: '080',
    renderData: CardRenderer.builder((b) => {
      b.temperature(2).br;
      b.oceans(2).br;
      b.minus().plants(-6).any;
    }),
  };
}
