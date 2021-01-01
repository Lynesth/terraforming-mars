import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {Game} from '../../Game';
import {ICard} from '../ICard';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class VenusianPlants implements IProjectCard {
    public cost = 13;
    public tags = [Tags.VENUS, Tags.PLANT];
    public name = CardName.VENUSIAN_PLANTS;
    public cardType = CardType.AUTOMATED;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (game.checkMinRequirements(player, GlobalParameter.VENUS, 16) === false) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, venusIncrease: 1});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, false, true, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseVenusScaleLevel(player, 1);
      const cards = this.getResCards(player);
      if (cards.length === 0) return undefined;

      if (cards.length === 1) {
        player.addResourceTo(cards[0], 1);
        LogHelper.logAddResource(game, player, cards[0]);
        return undefined;
      }

      return new SelectCard(
        'Select card to add 1 resource',
        'Add resource',
        cards,
        (foundCards: Array<ICard>) => {
          player.addResourceTo(foundCards[0], 1);
          LogHelper.logAddResource(game, player, foundCards[0]);
          return undefined;
        },
      );
    }
    public getVictoryPoints() {
      return 1;
    }
    public getResCards(player: Player): ICard[] {
      let resourceCards = player.getResourceCards(ResourceType.MICROBE);
      resourceCards = resourceCards.concat(player.getResourceCards(ResourceType.ANIMAL));
      return resourceCards.filter((card) => card.tags.indexOf(Tags.VENUS) !== -1);
    }
    public metadata: CardMetadata = {
      cardNumber: '261',
      requirements: CardRequirements.builder((b) => b.venus(16)),
      renderData: CardRenderer.builder((b) => {
        b.venus(1).br.br; // intentional double br
        b.microbes(1).secondaryTag(Tags.VENUS).nbsp;
        b.or().nbsp.animals(1).secondaryTag(Tags.VENUS);
      }),
      description: {
        text: 'Requires Venus 16%. Raise Venus 1 step. Add 1 Microbe or 1 Animal to ANOTHER VENUS CARD',
        align: 'left',
      },
      victoryPoints: 1,
    }
}
