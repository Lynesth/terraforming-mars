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

export class Comet implements IProjectCard {
    public cost = 21;
    public tags = [Tags.SPACE];
    public name = CardName.COMET;
    public cardType = CardType.EVENT;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, temperatureIncrease: 1, oceansToPlace: 1, oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player)});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 1);
      game.defer(new PlaceOceanTile(player, game));
      game.defer(new RemoveAnyPlants(player, game, 3));
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '010',
      description: 'Raise temperature 1 step and place an ocean tile. Remove up to 3 Plants from any player.',
      renderData: CardRenderer.builder((b) => {
        b.temperature(1).oceans(1).br;
        b.minus().plants(-3).any;
      }),
    }
}
