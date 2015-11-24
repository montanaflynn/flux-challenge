
import { Atom, atom, destruct, Derivable, setDebugMode } from 'derivable'
import { List, Map, Set } from 'immutable'
import { AppState, LocalSith } from './model'

setDebugMode(true);
// ROOT STATE

export const $AppState: Atom<AppState> = atom({
  world:null,
  sithIDs: List([
    null,
    null,
    3616,
    null,
    null
  ]),
  sithCache: Map<number, LocalSith>()
});

export const [$world, $sithIDs, $sithCache] =
  destruct($AppState, 'world', 'sithIDs', 'sithCache');

export const [$worldId, $worldName] = destruct($world, 'id', 'name');


export const $localSiths: Derivable<List<LocalSith>> = $sithIDs.derive(ids => {
  console.log('them ids', ids.toJS());
  const cache = $sithCache.get();
  return ids.map(id => cache.get(id));
});

export const $remoteSiths: Derivable<Set<number>> = $sithIDs.derive(ids => {
  const cache = $sithCache.get();
  return Set<number>(ids.filter(id => id !== null && cache.get(id) == null));
});

/**
 * local sith whose homeworld is the current planet
 */
export const $worldSith = $localSiths.derive(siths => {
  const worldId = $worldId.get();
  return siths.filter(sith => {
    return sith && sith.homeworld.id === worldId;
  }).first();
});
