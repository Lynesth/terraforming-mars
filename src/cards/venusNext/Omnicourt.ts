import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Omnicourt implements IProjectCard {
    public cost = 11;
    public tags = [Tags.BUILDING];
    public name = CardName.OMNICOURT;
    public cardType = CardType.AUTOMATED;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (player.checkMultipleTagPresence([Tags.VENUS, Tags.EARTH, Tags.JOVIAN]) === false) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, TRIncrease: 2});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.increaseTerraformRatingSteps(2, game);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '241',
      requirements: CardRequirements.builder((b) => b.tag(Tags.VENUS).tag(Tags.EARTH).tag(Tags.JOVIAN)),
      renderData: CardRenderer.builder((b) => {
        b.tr(2);
      }),
      description: 'Requires Venus, Earth and Jovian tags. Increase your TR 2 steps.',
    }
}
