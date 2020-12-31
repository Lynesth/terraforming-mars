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

export class DeimosDown implements IProjectCard {
    public cost = 31;
    public tags = [Tags.SPACE];
    public name = CardName.DEIMOS_DOWN;
    public cardType = CardType.EVENT;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, temperatureIncrease: 3});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 3);
      game.defer(new RemoveAnyPlants(player, game, 8));
      player.steel += 4;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '039',
      description: 'Raise temperature 3 steps and gain 4 steel. Remove up to 8 Plants from any player.',
      renderData: CardRenderer.builder((b) => {
        b.temperature(3).br;
        b.steel(4).br;
        b.minus().plants(-8).any;
      }),
    }
}
