import {ActionCard} from '../Card';
import {Tags} from '../Tags';
import {CardType} from '../CardType';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class AICentral extends ActionCard {
  public cost = 21;
  public tags = [Tags.SCIENCE, Tags.STEEL];
  public cardType = CardType.ACTIVE;
  public name = CardName.AI_CENTRAL;

  public metadata: CardMetadata = {
    reqs: {
      tags: {tag: Tags.SCIENCE, quantity: 3},
    },
    play: {
      productions: [
        {resource: Resources.ENERGY, quantity: -1},
      ],
    },
    action: {
      effects: {
        cardDraw: {quantity: 2},
      },
    },
    vps: 1,
    description: {
      text: 'Requires 3 Science tags to play. Decrease your Energy production 1 step.',
      align: 'left',
    },
    cardNumber: '208',
    requirements: CardRequirements.builder((b) => b.tag(Tags.SCIENCE, 3)),
    renderData: CardRenderer.builder((b) => {
      b.effectBox((ab) => ab.empty().startAction.cards(2).description('Action: Draw 2 cards.')).br;
      b.productionBox((pb) => pb.minus().energy(1));
    }),
    victoryPoints: 1,
  };
}
