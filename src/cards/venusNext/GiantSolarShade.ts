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

export class GiantSolarShade implements IProjectCard {
    public cost = 27;
    public tags = [Tags.SPACE, Tags.VENUS];
    public name = CardName.GIANT_SOLAR_SHADE;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, venusIncrease: 3});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      return game.increaseVenusScaleLevel(player, 3);
    }
    public metadata: CardMetadata = {
      cardNumber: '229',
      renderData: CardRenderer.builder((b) => b.venus(3)),
      description: 'Raise Venus 3 steps.',
    };
}

