import {ICard} from '../ICard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectCard} from '../../inputs/SelectCard';
import {SelectOption} from '../../inputs/SelectOption';
import {PlayerInput} from '../../PlayerInput';
import {ResourceType} from '../../ResourceType';
import {CardName} from '../../CardName';
import {LogHelper} from '../../LogHelper';
import {Resources} from '../../Resources';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';

export class LargeConvoy implements IProjectCard {
    public cost = 36;
    public tags = [Tags.EARTH, Tags.SPACE];
    public name = CardName.LARGE_CONVOY;
    public cardType = CardType.EVENT;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oceansToPlace: 1, oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player)});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game): PlayerInput | undefined {
      player.cardsInHand.push(game.dealer.dealCard(), game.dealer.dealCard());

      const animalCards = player.getResourceCards(ResourceType.ANIMAL);

      const gainPlants = function() {
        player.plants += 5;
        LogHelper.logGainStandardResource(game, player, Resources.PLANTS, 5);
        game.defer(new PlaceOceanTile(player, game));
        return undefined;
      };

      if (animalCards.length === 0 ) return gainPlants();

      const availableActions: Array<SelectOption | SelectCard<ICard>> = [];

      const gainPlantsOption = new SelectOption('Gain 5 plants', 'Gain plants', gainPlants);
      availableActions.push(gainPlantsOption);

      if (animalCards.length === 1) {
        const targetAnimalCard = animalCards[0];
        availableActions.push(new SelectOption('Add 4 animals to ' + targetAnimalCard.name, 'Add animals', () => {
          player.addResourceTo(targetAnimalCard, 4);
          LogHelper.logAddResource(game, player, targetAnimalCard, 4);
          game.defer(new PlaceOceanTile(player, game));
          return undefined;
        }));
      } else {
        availableActions.push(
          new SelectCard(
            'Select card to add 4 animals',
            'Add animals',
            animalCards,
            (foundCards: Array<ICard>) => {
              player.addResourceTo(foundCards[0], 4);
              LogHelper.logAddResource(game, player, foundCards[0], 4);
              game.defer(new PlaceOceanTile(player, game));
              return undefined;
            },
          ),
        );
      }

      return new OrOptions(...availableActions);
    }
    public getVictoryPoints() {
      return 2;
    }
    public metadata: CardMetadata = {
      cardNumber: '143',
      renderData: CardRenderer.builder((b) => {
        b.oceans(1).cards(2).br;
        b.plants(5).digit.or(CardRenderItemSize.MEDIUM).animals(4).digit.asterix();
      }),
      description: 'Place an ocean tile and draw 2 cards. Gain 5 Plants or add 4 Animals to ANOTHER card.',
      victoryPoints: 2,
    }
}
