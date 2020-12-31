import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SmallAsteroid implements IProjectCard {
    public cost = 10;
    public name = CardName.SMALL_ASTEROID;
    public tags = [Tags.SPACE];
    public cardType = CardType.EVENT;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, temperatureIncrease: 1});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 1);
      game.defer(new RemoveAnyPlants(player, game, 2));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '209',
      renderData: CardRenderer.builder((b) => {
        b.temperature(1).br;
        b.minus().plants(2).any;
      }),
      description: 'Increase temperature 1 step. Remove up to 2 plants from any player.',
    }
}
