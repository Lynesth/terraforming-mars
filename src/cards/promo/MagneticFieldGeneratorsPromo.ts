import {Player} from '../../Player';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class MagneticFieldGeneratorsPromo implements IProjectCard {
    public cost = 22;
    public tags = [Tags.BUILDING];
    public name = CardName.MAGNETIC_FIELD_GENERATORS_PROMO;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (player.getProduction(Resources.ENERGY) < 4) {
        return false;
      }

      const availableSpaces = game.board.getAvailableSpacesOnLand(player);
      if (availableSpaces.length === 0) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, TRIncrease: 3, nonOceanToPlace: TileType.MAGNETIC_FIELD_GENERATORS, nonOceanAvailableSpaces: availableSpaces});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.addProduction(Resources.ENERGY, -4);
      player.addProduction(Resources.PLANTS, 2);
      player.increaseTerraformRatingSteps(3, game);

      const availableSpaces = game.board.getAvailableSpacesOnLand(player);
      if (availableSpaces.length < 1) return undefined;

      return new SelectSpace('Select space for tile', availableSpaces, (foundSpace: ISpace) => {
        game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.MAGNETIC_FIELD_GENERATORS});
        return undefined;
      });
    }

    public metadata: CardMetadata = {
      cardNumber: '165',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(4).digit.br;
          pb.plus().plants(2);
        }).br;
        b.tr(3).digit.tile(TileType.MAGNETIC_FIELD_GENERATORS, true).asterix();
      }),
      description: 'Decrease your Energy production 4 steps and increase your Plant production 2 step. Raise your TR 3 step.',
    };
}
