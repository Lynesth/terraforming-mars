import {ProjectCard} from '../Card';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {CardName} from '../../CardName';
import {Game} from '../../Game';
import {PartyHooks} from '../../turmoil/parties/PartyHooks';
import {PartyName} from '../../turmoil/parties/PartyName';
import {REDS_RULING_POLICY_COST} from '../../constants';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class BribedCommittee extends ProjectCard {
    public cost = 7;
    public tags = [Tags.EARTH];
    public cardType = CardType.EVENT;
    public name = CardName.BRIBED_COMMITTEE;
    public hasRequirements = false;

    public canPlay(player: Player, game: Game): boolean {
      if (PartyHooks.shouldApplyPolicy(game, PartyName.REDS)) {
        return player.canAfford(player.getCardCost(game, this) + REDS_RULING_POLICY_COST * 2);
      }

      return true;
    }

    public metadata: CardMetadata = {
      play: {
        tr: {quantity: 2},
      },
      vps: -2,
      cardNumber: '112',
      description: 'Raise your TR 2 steps.',
      renderData: CardRenderer.builder((b) => b.tr(2)),
      victoryPoints: -2,
    };
}
