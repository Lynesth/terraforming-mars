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
import {CardMetadata, MetadataEffects, EffectsStandardResources, EffectsResourceType, EffectsResourceTypeAnyPlayer, EffectQuantityFunction} from './CardMetadata';
import {GlobalParameters} from '../GlobalParameters';
import {AddResourcesToCard} from '../deferredActions/AddResourcesToCard';
import {DecreaseAnyProduction} from '../deferredActions/DecreaseAnyProduction';
import {PlaceOceanTile} from '../deferredActions/PlaceOceanTile';
import {RemoveAnyPlants} from '../deferredActions/RemoveAnyPlants';
import {RemoveResourcesFromCard} from '../deferredActions/RemoveResourcesFromCard';

// TODO (Lynesth): When every action cards have been modified
// replace all `CardActionResults` by `PlayerInput | undefined`
export type CardActionResult = OrOptions | SelectOption | AndOptions | SelectAmount | SelectCard<ICard> | SelectCard<IProjectCard> | SelectHowToPay | SelectPlayer | SelectSpace | undefined;

export interface IActionCard {
  canAct: (player: Player, game: Game) => boolean;
  action: (player: Player, game: Game) => CardActionResult;
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

  private processEffects(player: Player, game: Game, effects: MetadataEffects): PlayerInput | CardActionResult {
    // Global parameters
    if (effects.globalParameters !== undefined) {
      for (const e of effects.globalParameters) {
        if (e.parameter === GlobalParameters.OCEAN) {
          for (let i = 0; i < e.steps; i++) {
            game.defer(new PlaceOceanTile(player, game));
          }
        } else if (e.parameter === GlobalParameters.OXYGEN) {
          game.increaseOxygenLevel(player, e.steps);
        } else if (e.parameter === GlobalParameters.TEMPERATURE) {
          game.increaseTemperature(player, e.steps);
        } else if (e.parameter === GlobalParameters.VENUS) {
          game.increaseVenusScaleLevel(player, e.steps);
        }
      }
    }

    // Productions increase/decrease
    if (effects.productions !== undefined) {
      for (const e of effects.productions) {
        const quantity = getQuantity(player, game, e.quantity);
        if (e.anyPlayer === true) {
          game.defer(new DecreaseAnyProduction(player, game, e.resource, -quantity));
        } else {
          player.addProduction(e.resource, quantity);
        }
      }
    }

    // Resources increase/decrease
    if (effects.resources !== undefined) {
      for (const e of effects.resources) {
        const quantity = getQuantity(player, game, e.quantity);
        if (isStandardResources(e)) {
          // It's a standard resource
          if (e.anyPlayer === true) {
            game.defer(new RemoveAnyPlants(player, game, -quantity));
          } else {
            player.setResource(e.resource, quantity);
          }
        } else {
          // It's a another type of resource
          if (e.anyPlayer === true) {
            game.defer(new RemoveResourcesFromCard(player, game, e.resource, -quantity, e.ownCardsOnly, e.mandatory));
          } else {
            game.defer(new AddResourcesToCard(player, game, e.resource, quantity, e.restrictedTags));
          }
        }
      }
    }

    return undefined;
  }

  public canPlay(player: Player, game: Game): boolean {
    if (this.metadata === undefined) {
      return true;
    }
    // const reqs = this.metadata.reqs !== undefined ? this.metadata.reqs : undefined;

    if (this.metadata.play !== undefined) {
      const effects = this.metadata.play;
      if (effects.productions !== undefined) {
        for (const e of effects.productions) {
          const quantity = getQuantity(player, game, e.quantity) * -1;
          if (quantity > 0) {
            if (e.anyPlayer === true) {
              if (game.someoneHasResourceProduction(e.resource, quantity) === false) {
                return false;
              }
            } else if (player.getProduction(e.resource) < quantity) {
              return false;
            }
          }
        }
      }

      if (effects.resources !== undefined) {
        for (const e of effects.resources) {
          const quantity = getQuantity(player, game, e.quantity) * -1;
          if (isStandardResources(e)) {
            // It's a standard resource
            if (e.anyPlayer !== true && player.getResource(e.resource) < quantity) {
              return false;
            }
          }
        }
      }
    }

    return true;
  }

  public play(player: Player, game: Game): PlayerInput | undefined {
    if (this.metadata === undefined || this.metadata.play === undefined) {
      return undefined;
    }
    const play = this.metadata.play;
    return this.processEffects(player, game, play);
  }

  public canAct?(player: Player, game: Game): boolean;

  public action?(player: Player, game: Game): CardActionResult;

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

function isStandardResources(e: EffectsStandardResources | EffectsResourceType | EffectsResourceTypeAnyPlayer): e is EffectsStandardResources {
  return Object.values(Resources).includes(e.resource as Resources);
}

function getQuantity(
  player: Player,
  game: Game,
  quantity: number | EffectQuantityFunction,
): number {
  if (typeof quantity === 'number') {
    return quantity;
  } else {
    return quantity(player, game);
  }
}
