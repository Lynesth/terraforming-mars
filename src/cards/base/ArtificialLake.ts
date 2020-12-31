import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {RedsPolicy, HowToAffordRedsPolicy, ActionDetails} from '../../turmoil/RedsPolicy';
import {PlaceOceanTile} from '../../deferredActions/PlaceOceanTile';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {GlobalParameter} from '../../GlobalParameter';

export class ArtificialLake implements IProjectCard {
  public cost = 15;
  public tags = [Tags.BUILDING];
  public name = CardName.ARTIFICIAL_LAKE;
  public cardType = CardType.AUTOMATED;
  public howToAffordReds?: HowToAffordRedsPolicy;

  public canPlay(player: Player, game: Game): boolean {
    if (game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, -6) === false) {
      return false;
    }

    if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
      const actionDetails = new ActionDetails({card: this, oceansToPlace: 1, oceansAvailableSpaces: game.board.getAvailableSpacesOnLand(player)});
      this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, true);
      return this.howToAffordReds.canAfford;
    }

    return true;
  }
  public play(player: Player, game: Game) {
    game.defer(new PlaceOceanTile(player, game));
    return undefined;
  }
  public getVictoryPoints() {
    return 1;
  }

  public metadata: CardMetadata = {
    description: 'Requires -6 C or warmer. Place 1 ocean tile ON AN AREA NOT RESERVED FOR OCEAN.',
    cardNumber: '116',
    requirements: CardRequirements.builder((b) => b.temperature(-6)),
    renderData: CardRenderer.builder((b) => b.oceans(1).asterix()),
    victoryPoints: 1,
  };
}
