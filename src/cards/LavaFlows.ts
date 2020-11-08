import { IProjectCard } from "./IProjectCard";
import { CardType } from "./CardType";
import { SpaceType } from "../SpaceType";
import { Player } from "../Player";
import { Game } from "../Game";
import { SpaceName } from "../SpaceName";
import { TileType } from "../TileType";
import { ISpace } from "../ISpace";
import { SelectSpace } from "../inputs/SelectSpace";
import { BoardName } from "../BoardName";
import { CardName } from "../CardName";
import { PartyHooks } from "../turmoil/parties/PartyHooks";
import { PartyName } from "../turmoil/parties/PartyName";
import { IAdjacencyBonus } from "../ares/IAdjacencyBonus";
import { RedsPolicy, HowToAffordRedsPolicy, ActionDetails } from "../turmoil/RedsPolicy";

export class LavaFlows implements IProjectCard {
    public cost = 18;
    public tags = [];
    public name = CardName.LAVA_FLOWS;
    public hasRequirements = false;
    public cardType = CardType.EVENT;
    public adjacencyBonus?: IAdjacencyBonus = undefined;
    private howToAffordReds?: HowToAffordRedsPolicy;

    public static getVolcanicSpaces(player: Player, game: Game): Array<ISpace> {
        if (game.gameOptions.boardName === BoardName.ORIGINAL) {
            const volcanicSpaces = [ SpaceName.THARSIS_THOLUS, SpaceName.ASCRAEUS_MONS, SpaceName.ARSIA_MONS, SpaceName.PAVONIS_MONS ];
            return game.board.getAvailableSpacesOnLand(player).filter((space) => volcanicSpaces.includes(space.id as SpaceName));
        } else if (game.gameOptions.boardName === BoardName.ELYSIUM) {
            const volcanicSpaces = [ SpaceName.HECATES_THOLUS, SpaceName.ELYSIUM_MONS, SpaceName.ARSIA_MONS_ELYSIUM, SpaceName.OLYMPUS_MONS ];
            return game.board.getAvailableSpacesOnLand(player).filter((space) => volcanicSpaces.includes(space.id as SpaceName));
        } else {
            return game.board.getAvailableSpacesOnLand(player);
        }    
    }

    public canPlay(player: Player, game: Game): boolean {
        const volcanicSpaces = LavaFlows.getVolcanicSpaces(player, game);
        const canPlaceTile = volcanicSpaces.length > 0;
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            const actionDetails = new ActionDetails({ card: this, temperatureIncrease: 2, nonOceanToPlace: TileType.LAVA_FLOWS, nonOceanAvailableSpaces: volcanicSpaces })
            this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
            return canPlaceTile && this.howToAffordReds.canAfford;
        } else {
            return canPlaceTile;
        }
    }

    public play(player: Player, game: Game) {
        if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
            player.howToAffordReds = this.howToAffordReds;
        }
        game.increaseTemperature(player, 2);
        return new SelectSpace("Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons", LavaFlows.getVolcanicSpaces(player, game), (space: ISpace) => {
            game.addTile(player, SpaceType.LAND, space, { tileType: TileType.LAVA_FLOWS });
            space.adjacency = this.adjacencyBonus;
            return undefined;
        });
    }
}
