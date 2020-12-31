import {IActionCard, ICard} from './../ICard';
import {IProjectCard} from './../IProjectCard';
import {Tags} from './../Tags';
import {CardType} from './../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {ResourceType} from '../../ResourceType';
import {SelectCard} from '../../inputs/SelectCard';
import {LogHelper} from '../../LogHelper';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MoholeLake implements IActionCard, IProjectCard {
    public cost = 31;
    public tags = [Tags.BUILDING];
    public name = CardName.MOHOLE_LAKE;
    public cardType = CardType.ACTIVE;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, temperatureIncrease: 1, oceansToPlace: 1, oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player)});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 1);
      game.defer(new PlaceOceanTile(player, game));
      player.plants += 3;
      return undefined;
    }

    public canAct(): boolean {
      return true;
    }

    public action(player: Player, game: Game) {
      const availableCards = player.getResourceCards(ResourceType.MICROBE).concat(player.getResourceCards(ResourceType.ANIMAL));

      if (availableCards.length === 0) {
        return undefined;
      }

      if (availableCards.length === 1) {
        player.addResourceTo(availableCards[0]);
        LogHelper.logAddResource(game, player, availableCards[0], 1);
        return undefined;
      }

      return new SelectCard('Select card to add microbe or animal', 'Add resource(s)', availableCards, (foundCards: Array<ICard>) => {
        player.addResourceTo(foundCards[0]);
        LogHelper.logAddResource(game, player, foundCards[0], 1);
        return undefined;
      });
    }
    public metadata: CardMetadata = {
      cardNumber: 'X22',
      renderData: CardRenderer.builder((b) => {
        b.effectBox((eb) => {
          eb.empty().startAction.microbes(1).asterix();
          eb.nbsp.or().nbsp.animals(1).asterix();
          eb.description('Action: Add a microbe or animal to ANOTHER card.');
        }).br;
        b.plants(3).temperature(1).oceans(1);
      }),
      description: 'Gain 3 plants. Raise temperature 1 step, and place 1 ocean tile.',
    }
}
