import {IProjectCard} from '../IProjectCard';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardType} from '../CardType';
import {SelectPlayer} from '../../inputs/SelectPlayer';
import {OrOptions} from '../../inputs/OrOptions';
import {SelectOption} from '../../inputs/SelectOption';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {Resources} from '../../Resources';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';


export class Flooding implements IProjectCard {
    public cardType = CardType.EVENT;
    public cost = 7;
    public name = CardName.FLOODING;
    public tags = [];
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oceansToPlace: 1, oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player)});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      if (game.isSoloMode()) {
        game.defer(new PlaceOceanTile(player, game));
        return undefined;
      }
      return new SelectSpace(
        'Select space for ocean tile',
        game.board.getAvailableSpacesForOcean(player),
        (space: ISpace) => {
          const adjacentPlayers: Set<Player> = new Set<Player>();
          game.addOceanTile(player, space.id);
          game.board.getAdjacentSpaces(space).forEach((space) => {
            if (space.player && space.player !== player && space.tile) {
              adjacentPlayers.add(space.player);
            }
          });
          if (adjacentPlayers.size > 0) {
            return new OrOptions(
              new SelectPlayer(
                Array.from(adjacentPlayers),
                'Select adjacent player to remove 4 mega credits from',
                'Remove credits',
                (selectedPlayer: Player) => {
                  selectedPlayer.setResource(Resources.MEGACREDITS, -4, game, player);
                  return undefined;
                },
              ),
              new SelectOption(
                'Don\'t remove mega credits from adjacent player',
                'Confirm',
                () => {
                  return undefined;
                },
              ),
            );
          }
          return undefined;
        },
      );
    }
    public getVictoryPoints() {
      return -1;
    }
    public metadata: CardMetadata = {
      cardNumber: '188',
      renderData: CardRenderer.builder((b) => {
        b.oceans(1).nbsp.minus().megacredits(4).any.asterix();
      }),
      description: 'Place an ocean tile. IF THERE ARE TILES ADJACENT TO THIS OCEAN TILE, YOU MAY REMOVE 4 MC FROM THE OWNER OF ONE OF THOSE TILES.',
      victoryPoints: -1,
    }
}
