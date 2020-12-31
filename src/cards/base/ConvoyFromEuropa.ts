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
import {CardRenderer} from '../render/CardRenderer';

export class ConvoyFromEuropa implements IProjectCard {
    public cost = 15;
    public tags = [Tags.SPACE];
    public cardType = CardType.EVENT;
    public name = CardName.CONVOY_FROM_EUROPA;
    public hasRequirements = false;
    public howToAffordReds?: HowToAffordRedsPolicy;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        const actionDetails = new ActionDetails({card: this, oceansToPlace: 1, oceansAvailableSpaces: game.board.getAvailableSpacesForOcean(player)});
        this.howToAffordReds = RedsPolicy.canAffordRedsPolicy(player, game, actionDetails, false, true);
        return this.howToAffordReds.canAfford;
      }

      return true;
    }

    public play(player: Player, game: Game) {
      player.cardsInHand.push(game.dealer.dealCard());
      game.defer(new PlaceOceanTile(player, game));
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: '161',
      description: 'Place 1 ocean tile and draw 1 card.',
      renderData: CardRenderer.builder((b) => b.oceans(1).cards(1)),
    }
}
