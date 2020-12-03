import {CardRenderer} from '../cards/render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from './render/CardRenderDynamicVictoryPoints';
import {ICardRenderDescription} from './render/ICardRenderDescription';
import {CardRequirements} from './CardRequirements';
import {Player} from '../Player';
import {Game} from '../Game';
import {Resources} from '../Resources';
import {ResourceType} from '../ResourceType';
import {Tags} from './Tags';
import {GlobalParameters} from '../GlobalParameters';

export type EffectQuantityFunction = (() => number) | ((player: Player) => number) | ((player: Player, game: Game) => number);

export interface EffectsStandardResources {
  readonly resource: Resources,
  readonly quantity: number | EffectQuantityFunction,
  readonly anyPlayer?: boolean,
}

export interface EffectsResourceType {
  readonly resource: ResourceType,
  readonly quantity: number | EffectQuantityFunction,
  readonly anyPlayer?: false,
  readonly restrictedTags?: Tags,
}

export interface EffectsResourceTypeAnyPlayer {
  readonly resource: ResourceType,
  readonly quantity: number | EffectQuantityFunction,
  readonly anyPlayer: true,
  readonly ownCardsOnly?: boolean,
  readonly mandatory?: boolean,
}

interface EffectsGlobalParametersOcean {
  readonly parameter: GlobalParameters.OCEAN,
  readonly steps: 2 | 1;
}
interface EffectsGlobalParametersOxygen {
  readonly parameter: GlobalParameters.OXYGEN,
  readonly steps: 2 | 1;
}
interface EffectsGlobalParametersTemperature {
  readonly parameter: GlobalParameters.TEMPERATURE,
  readonly steps: 3 | 2 | 1 | -2;
}
interface EffectsGlobalParametersVenus {
  readonly parameter: GlobalParameters.VENUS,
  readonly steps: 3 | 2 | 1;
}

export interface MetadataEffects {
  readonly productions?: ReadonlyArray<EffectsStandardResources>,
  readonly resources?: ReadonlyArray<EffectsStandardResources | EffectsResourceType | EffectsResourceTypeAnyPlayer>,
  readonly globalParameters?: ReadonlyArray<EffectsGlobalParametersOcean | EffectsGlobalParametersOxygen | EffectsGlobalParametersTemperature | EffectsGlobalParametersVenus>,
}

export interface CardMetadata {
  cardNumber: string;
  play?: MetadataEffects;
  description?: string | ICardRenderDescription;
  requirements?: CardRequirements;
  victoryPoints?: number | CardRenderDynamicVictoryPoints;
  renderData?: CardRenderer;
}
