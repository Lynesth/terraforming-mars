import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Asteroid implements IProjectCard {
  public cost = 14;
  public tags = [Tags.SPACE];
  public name = CardName.ASTEROID;
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
    game.defer(new RemoveAnyPlants(player, game, 3));
    player.titanium += 2;
    return undefined;
  }

  public metadata: CardMetadata = {
    description: 'Raise temperature 1 step and gain 2 titanium. Remove up to 3 Plants from any player.',
    cardNumber: '009',
    renderData: CardRenderer.builder((b) => {
      b.temperature(1).br;
      b.titanium(2).br;
      b.minus().plants(-3).any;
    }),
  };
}
