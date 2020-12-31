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

export class StripMine implements IProjectCard {
    public cost = 25;
    public tags = [Tags.BUILDING];
    public cardType = CardType.AUTOMATED;
    public name = CardName.STRIP_MINE;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;
    public canPlay(player: Player, game: Game): boolean {
      if (player.getProduction(Resources.ENERGY) < 2) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oxygenIncrease: 2});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }
    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, -2);
      player.addProduction(Resources.STEEL, 2);
      player.addProduction(Resources.TITANIUM);
      return game.increaseOxygenLevel(player, 2);
    }
    public metadata: CardMetadata = {
      cardNumber: '138',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(2).br;
          pb.plus().steel(2).titanium(1);
        }).br;
        b.oxygen(2);
      }),
      description: 'Decrease your Energy production 2 steps. Increase your steel production 2 steps and your titanium production 1 step. Raise oxygen 2 steps.',
    };
}
