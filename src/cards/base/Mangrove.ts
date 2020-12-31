import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {SelectSpace} from '../../inputs/SelectSpace';
import {SpaceType} from '../../SpaceType';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {GlobalParameter} from '../../GlobalParameter';

export class Mangrove implements IProjectCard {
    public cost = 12;
    public tags = [Tags.PLANT];
    public name = CardName.MANGROVE;
    public cardType = CardType.AUTOMATED;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, 4) === false) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oxygenIncrease: 1, nonOceanToPlace: TileType.GREENERY, nonOceanAvailableSpaces: game.board.getAvailableSpacesForOcean(player)});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      return new SelectSpace('Select ocean space for greenery tile', game.board.getAvailableSpacesForOcean(player), (foundSpace: ISpace) => {
        return game.addGreenery(player, foundSpace.id, SpaceType.OCEAN);
      });
    }

    public getVictoryPoints() {
      return 1;
    }

    public metadata: CardMetadata = {
      cardNumber: '059',
      requirements: CardRequirements.builder((b) => b.temperature(4)),
      renderData: CardRenderer.builder((b) => b.greenery(CardRenderItemSize.MEDIUM, true).asterix()),
      description: 'Requires +4 C or warmer. Place a greenery tile ON AN AREA RESERVED FOR OCEAN and raise oxygen 1 step. Disregard normal placement restrictions for this.',
      victoryPoints: 1,
    };
}
