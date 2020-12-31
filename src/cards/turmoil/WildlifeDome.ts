import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardName} from '../../CardName';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WildlifeDome implements IProjectCard {
    public cost = 15;
    public tags = [Tags.ANIMAL, Tags.PLANT, Tags.BUILDING];
    public name = CardName.WILDLIFE_DOME;
    public cardType = CardType.AUTOMATED;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (game.turmoil === undefined || game.turmoil.canPlay(player, PartyName.GREENS) === false) {
        return false;
      }

      const availableSpaces = game.board.getAvailableSpacesForGreenery(player);
      if (availableSpaces.length === 0) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oxygenIncrease: 1, nonOceanToPlace: TileType.GREENERY, nonOceanAvailableSpaces: availableSpaces});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      return new SelectSpace('Select space for greenery tile', game.board.getAvailableSpacesForGreenery(player), (space: ISpace) => {
        return game.addGreenery(player, space.id);
      });
    }
    public metadata: CardMetadata = {
      cardNumber: 'T15',
      requirements: CardRequirements.builder((b) => b.party(PartyName.GREENS)),
      renderData: CardRenderer.builder((b) => {
        b.greenery().secondaryTag('oxygen');
      }),
      description: 'Requires that Greens are ruling or that you have 2 delegates there. Place a greenery tile and raise oxygen 1 step.',
    }
}
