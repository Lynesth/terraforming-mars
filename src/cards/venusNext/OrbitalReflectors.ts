import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class OrbitalReflectors implements IProjectCard {
    public cost = 26;
    public tags = [Tags.VENUS, Tags.SPACE];
    public name = CardName.ORBITAL_REFLECTORS;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, venusIncrease: 2});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseVenusScaleLevel(player, 2);
      player.addProduction(Resources.HEAT, 2);
      return undefined;
    }

    public metadata: CardMetadata = {
      cardNumber: '242',
      renderData: CardRenderer.builder((b) => {
        b.venus(2).br;
        b.productionBox((pb) => {
          pb.heat(2);
        });
      }),
      description: 'Raise Venus 2 steps. Increase your heat production 2 steps.',
    }
}
