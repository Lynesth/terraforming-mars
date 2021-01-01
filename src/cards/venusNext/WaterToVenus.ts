import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class WaterToVenus implements IProjectCard {
    public cost = 9;
    public tags = [Tags.SPACE];
    public name = CardName.WATER_TO_VENUS;
    public cardType = CardType.EVENT;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, venusIncrease: 1});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '254',
      renderData: CardRenderer.builder((b) => b.venus(1)),
      description: 'Raise Venus 1 step.',
    }
}
