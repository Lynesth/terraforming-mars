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
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class SpinInducingAsteroid implements IProjectCard {
    public cost = 16;
    public tags = [Tags.SPACE];
    public name = CardName.SPIN_INDUCING_ASTEROID;
    public cardType = CardType.EVENT;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (game.checkMaxRequirements(player, GlobalParameter.VENUS, 10) === false) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, venusIncrease: 2});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseVenusScaleLevel(player, 2);
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '246',
      requirements: CardRequirements.builder((b) => b.venus(10).max()),
      renderData: CardRenderer.builder((b) => {
        b.venus(2);
      }),
      description: 'Venus must be 10% or lower. Raise Venus 2 steps.',
    };
}
