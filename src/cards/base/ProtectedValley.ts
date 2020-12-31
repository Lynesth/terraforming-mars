import {IProjectCard} from '../IProjectCard';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SpaceType} from '../../SpaceType';
import {Tags} from '../Tags';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class ProtectedValley implements IProjectCard {
    public cost = 23;
    public cardType = CardType.AUTOMATED;
    public tags = [Tags.PLANT, Tags.BUILDING];
    public name = CardName.PROTECTED_VALLEY;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oxygenIncrease: 1, nonOceanToPlace: TileType.GREENERY, nonOceanAvailableSpaces: game.board.getAvailableSpacesForOcean(player)});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      return new SelectSpace(
        'Select space reserved for ocean to place greenery tile',
        game.board.getAvailableSpacesForOcean(player),
        (space: ISpace) => {
          player.addProduction(Resources.MEGACREDITS, 2);
          return game.addGreenery(player, space.id, SpaceType.OCEAN);
        },
      );
    }

    public metadata: CardMetadata = {
      cardNumber: '174',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.megacredits(2)).nbsp;
        b.greenery().secondaryTag('oxygen').asterix();
      }),
      description: 'Increase your MC production 2 steps. Place on a greenery tile ON AN AREA RESERVED FOR OCEAN, disregarding normal placement restrictions, and increase oxygen 1 step.',
    }
}
