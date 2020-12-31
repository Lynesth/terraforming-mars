import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Plantation implements IProjectCard {
    public cost = 15;
    public cardType = CardType.AUTOMATED;
    public tags = [Tags.PLANT];
    public name = CardName.PLANTATION;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      const availableSpaces = game.board.getAvailableSpacesForGreenery(player);
      if (player.getTagCount(Tags.SCIENCE) < 2 || availableSpaces.length === 0) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oxygenIncrease: 1, nonOceanToPlace: TileType.GREENERY, nonOceanAvailableSpaces: availableSpaces});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
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
      cardNumber: '193',
      requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 2)),
      renderData: CardRenderer.builder((b) => {
        b.greenery().secondaryTag('oxygen');
      }),
      description: 'Requires 2 Science tags. Place a greenery tile and raise oxygen 1 step.',
    }
}
