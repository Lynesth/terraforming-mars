import {CardType} from '../CardType';
import {IProjectCard} from '../IProjectCard';
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

export class IceCapMelting implements IProjectCard {
    public cost = 5;
    public cardType = CardType.EVENT;
    public tags = [];
    public name = CardName.ICE_CAP_MELTING;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (game.checkMinRequirements(player, GlobalParameter.TEMPERATURE, 2) === false) {
        return false;
      }

      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oceansToPlace: 1, oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player)});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }
    public play(player: Player, game: Game) {
      game.defer(new PlaceOceanTile(player, game));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '181',
      requirements: CardRequirements.builder((b) => b.temperature(2)),
      renderData: CardRenderer.builder((b) => b.oceans(1)),
      description: 'Requires +2 C or warmer. Place 1 ocean tile.',
    }
}
