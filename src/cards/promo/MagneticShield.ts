import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class MagneticShield implements IProjectCard {
    public name = CardName.MAGNETIC_SHIELD;
    public cost = 26;
    public tags = [Tags.SPACE];
    public cardType = CardType.AUTOMATED;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (player.getTagCount(Tags.ENERGY) < 2) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, TRIncrease: 4});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.increaseTerraformRatingSteps(4, game);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: 'X20',
      requirements: CardRequirements.builder((b) => b.tag(Tags.ENERGY, 2)),
      renderData: CardRenderer.builder((b) => b.tr(4).digit),
      description: 'Requires 2 power tags. Raise your TR 4 steps.',
    }
}
