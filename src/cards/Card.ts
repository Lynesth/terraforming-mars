import {CardType} from './CardType';
import {AndOptions} from '../inputs/AndOptions';
import {IProjectCard} from '../cards/IProjectCard';
import {ISpace} from '../ISpace';
import {PlayerInput} from '../PlayerInput';
import {Player} from '../Player';
import {Game} from '../Game';
import {Tags} from './Tags';
import {ICard} from './ICard';
import {Resources} from '../Resources';
import {SelectAmount} from '../inputs/SelectAmount';
import {SelectCard} from '../inputs/SelectCard';
import {SelectHowToPay} from '../inputs/SelectHowToPay';
import {SelectPlayer} from '../inputs/SelectPlayer';
import {SelectSpace} from '../inputs/SelectSpace';
import {StandardProjectType} from '../StandardProjectType';
import {OrOptions} from '../inputs/OrOptions';
import {SelectOption} from '../inputs/SelectOption';
import {ResourceType} from '../ResourceType';
import {CardName} from '../CardName';
import {CardMetadata} from './CardMetadata';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {DecreaseAnyProduction} from '../deferredActions/DecreaseAnyProduction';
import {RemoveAnyPlants} from '../deferredActions/RemoveAnyPlants';
import {RemoveResourcesFromCard} from '../deferredActions/RemoveResourcesFromCard';

export type cardActionResult = OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectHowToPay | SelectPlayer | SelectSpace | undefined;

export interface IActionCard {
  canAct: (player: Player, game: Game) => boolean;
  action: (player: Player, game: Game) => cardActionResult;
}

export interface IResourceCard {
  resourceType: ResourceType;
  resourceCount: number;
}

export abstract class Card {
  public abstract name: CardName;
  public abstract tags: Array<Tags>;
  public abstract cardType: CardType;

  public cost?: number;
  public metadata?: CardMetadata;
  public resourceType?: ResourceType;
  public resourceCount?: number;
  public hasRequirements?: boolean;
  public bonusResource?: Resources | undefined;

  public canPlay?(player: Player, game: Game): boolean;

  public play(player: Player, game: Game): PlayerInput | undefined {
    if (this.metadata === undefined || this.metadata.play === undefined) {
      return undefined;
    }
    const play = this.metadata.play;

    // Productions increase/decrease
    if (play.productions !== undefined) {
      for (const [resource, qty, anyPlayer] of play.productions) {
        const quantity = getQuantity(player, game, qty);
        if (anyPlayer === true) {
          game.defer(new DecreaseAnyProduction(player, game, resource, -quantity));
        } else {
          player.addProduction(resource, quantity);
        }
      }
    }

    // Resources increase/decrease
    if (play.resources !== undefined) {
      for (const [res, qty, anyPlayer, ownCardsOnlyOrRestrictedTags, mandatory] of play.resources) {
        const quantity = getQuantity(player, game, qty);
        if (Object.values(Resources).includes(res as any)) {
          // It's a standard resource
          const resource = res as Resources;
          if (anyPlayer === true) {
            game.defer(new RemoveAnyPlants(player, game, -quantity));
          } else {
            player.setResource(resource, quantity);
          }
        } else {
          // It's a another type of resource
          const resource = res as ResourceType;
          if (anyPlayer === true) {
            const ownCardsOnly = ownCardsOnlyOrRestrictedTags as boolean;
            game.defer(new RemoveResourcesFromCard(player, game, resource, -quantity, ownCardsOnly, mandatory));
          } else {
            const restrictedTags = ownCardsOnlyOrRestrictedTags as Tags;
            game.defer(new AddResourcesToCard(player, game, resource, quantity, restrictedTags));
          }
        }
      }
    }

    return undefined;
  }

  public canAct?(player: Player, game: Game): boolean;

  public action?(player: Player, game: Game): cardActionResult;

  public getCardDiscount?(player: Player, game: Game, card: IProjectCard): number;

  public getRequirementBonus?(player: Player, game: Game, venusOnly?: boolean): number;

  public getVictoryPoints?(player: Player, game: Game): number;

  public onCardPlayed?(player: Player, game: Game, card: IProjectCard): OrOptions | void;

  public onStandardProject?(player: Player, projectType: StandardProjectType): void;

  public onTilePlaced?(player: Player, space: ISpace, game: Game): void;

  public onDiscard?(player: Player): void;
}

export abstract class ProjectCard extends Card {
  public abstract cost: number;
}

function getQuantity(
  player: Player,
  game: Game,
  qty: number | ((player?: Player, game?: Game) => number) | undefined,
): number {
  if (qty === undefined) {
    return 1;
  } else if (typeof qty === 'number') {
    return qty;
  } else {
    return qty(player, game);
  }
}
