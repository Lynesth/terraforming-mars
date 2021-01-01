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

export class NeutralizerFactory implements IProjectCard {
    public cost = 7;
    public tags = [Tags.VENUS];
    public name = CardName.NEUTRALIZER_FACTORY;
    public cardType = CardType.AUTOMATED;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (game.checkMinRequirements(player, GlobalParameter.VENUS, 10) === false) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, venusIncrease: 1});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseVenusScaleLevel(player, 1);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '240',
      requirements: CardRequirements.builder((b) => b.venus(10)),
      renderData: CardRenderer.builder((b) => {
        b.venus(1);
      }),
      description: 'Requires Venus 10%. Increase the Venus track 1 step.',
    }
}
