import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class JovianEmbassy implements IProjectCard {
    public cost = 14;
    public tags = [Tags.JOVIAN, Tags.BUILDING];
    public name = CardName.JOVIAN_EMBASSY;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, TRIncrease: 1});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.increaseTerraformRating(game);
      return undefined;
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: 'X24',
      renderData: CardRenderer.builder((b) => {
        b.tr(1);
      }),
      description: 'Raise your TR 1 step.',
      victoryPoints: 1,
    };
}
