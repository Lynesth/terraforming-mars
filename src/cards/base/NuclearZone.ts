import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {TileType} from '../../TileType';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class NuclearZone implements IProjectCard {
    public cost = 10;
    public tags = [Tags.EARTH];
    public name = CardName.NUCLEAR_ZONE;
    public cardType = CardType.AUTOMATED;
    public hasRequirements = false;
    public adjacencyBonus?: IAdjacencyBonus = undefined;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      const tileSpaces = game.board.getAvailableSpacesOnLand(player);
      if (tileSpaces.length === 0) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, temperatureIncrease: 2, nonOceanToPlace: TileType.NUCLEAR_ZONE, nonOceanAvailableSpaces: tileSpaces});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      game.increaseTemperature(player, 2);
      return new SelectSpace('Select space for special tile', game.board.getAvailableSpacesOnLand(player), (foundSpace: ISpace) => {
        game.addTile(player, foundSpace.spaceType, foundSpace, {tileType: TileType.NUCLEAR_ZONE});
        foundSpace.adjacency = this.adjacencyBonus;
        return undefined;
      });
    }

    public getVictoryPoints() {
      return -2;
    }

    public metadata: CardMetadata = {
      cardNumber: '097',
      renderData: CardRenderer.builder((b) => {
        b.tile(TileType.NUCLEAR_ZONE, true).br;
        b.temperature(2);
      }),
      description: 'Place this tile and raise temperature 2 steps.',
      victoryPoints: -2,
    }
}
