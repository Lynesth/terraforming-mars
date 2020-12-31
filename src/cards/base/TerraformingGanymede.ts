import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {LogHelper} from '../../LogHelper';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class TerraformingGanymede implements IProjectCard {
    public cost = 33;
    public tags = [Tags.JOVIAN, Tags.SPACE];
    public name = CardName.TERRAFORMING_GANYMEDE;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, TRIncrease: player.getTagCount(Tags.JOVIAN) + 1});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      const steps = 1 + player.getTagCount(Tags.JOVIAN);
      player.increaseTerraformRatingSteps(steps, game);
      LogHelper.logTRIncrease(game, player, steps);

      return undefined;
    }
    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      cardNumber: '197',
      renderData: CardRenderer.builder((b) => {
        b.tr(1).slash().jovian().played;
      }),
      description: 'Raise your TR 1 step for each Jovian tag you have, including this.',
      victoryPoints: 2,
    }
}
