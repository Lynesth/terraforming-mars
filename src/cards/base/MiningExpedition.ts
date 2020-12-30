import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {RemoveAnyPlants} from '../../deferredActions/RemoveAnyPlants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MiningExpedition implements IProjectCard {
    public cost = 12;
    public tags = [];
    public cardType = CardType.EVENT;
    public name = CardName.MINING_EXPEDITION;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oxygenIncrease: 1});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.defer(new RemoveAnyPlants(player, game, 2));
      player.steel += 2;
      return game.increaseOxygenLevel(player, 1);
    }

    public metadata: CardMetadata = {
      cardNumber: '063',
      renderData: CardRenderer.builder((b) => {
        b.oxygen(1).br;
        b.minus().plants(-2).any;
        b.steel(2);
      }),
      description: 'Raise oxygen 1 step. Remove 2 plants from any player. Gain 2 steel.',
    }
}
