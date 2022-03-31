// A mapping of paths to layers. Not exported, so only visible within this module
const layer1 = {};
const layer2 = {};
const layer3 = {};
const layer4 = {};
const layer5 = {};
const layer6 = {};
const layer7 = {};

 // exported. this is the only part of the module visible from the outside.
export async function getLayer(path) {
    if (!layer1[path]) {
        // if we don't already have it do the fetch and add it to the mapping
        layer1[path] = await fetchLayer(path)};
    // return the layer for the given path from the mapping
    return layer1[path];
}

export async function getLayer3(path3) {
  if (!layer3[path3]) {
      // if we don't already have it do the fetch and add it to the mapping
      layer3[path3] = await fetchLayer3(path3)};
  // return the layer for the given path from the mapping
  return layer3[path3];
}

export async function getLayer4(path4) {
  if (!layer4[path4]) {
      // if we don't already have it do the fetch and add it to the mapping
      layer4[path4] = await fetchLayer4(path4)};
  // return the layer for the given path from the mapping
  return layer4[path4];
}

export async function getLayer5(path5) {
  if (!layer5[path5]) {
      // if we don't already have it do the fetch and add it to the mapping
      layer5[path5] = await fetchLayer5(path5)};
  // return the layer for the given path from the mapping
  return layer5[path5];
}

export async function getLayer6(path6) {
  if (!layer6[path6]) {
      // if we don't already have it do the fetch and add it to the mapping
      layer6[path6] = await fetchLayer6(path6)};
  // return the layer for the given path from the mapping
  return layer6[path6];
}

export async function getLayer7(path7) {
  if (!layer7[path7]) {
      // if we don't already have it do the fetch and add it to the mapping
      layer7[path7] = await fetchLayer7(path7)};
  // return the layer for the given path from the mapping
  return layer7[path7];
}

export async function getLayer2(path2) {
  if (!layer2[path2]) {
      // if we don't already have it do the fetch and add it to the mapping
      layer2[path2] = await fetchLayer2(path2)};
  // return the layer for the given path from the mapping
  return layer2[path2];
}

// "private" functions for fetching and processing data
// COMMERCES

async function fetchLayer(path) {
    return fetch('commerces_final', { credentials: 'include' })
        .then(response => response.json())
        .then(data => process1(data))
}

function process1(donnees){
  return L.geoJson(donnees
  );
}

//QUARTIERS

async function fetchLayer2(path2) {
  return fetch('zones_quartiers_finale', { credentials: 'include' })
      .then(response => response.json()
      )
}

// ENTREPRISES

async function fetchLayer3(path3) {
  return fetch('entreprises_final', { credentials: 'include' })
      .then(response => response.json())
      .then(data => process3(data))
}

function process3(donnees){
return L.geoJson(donnees
);
}

// LOISIRS

async function fetchLayer4(path4) {
  return fetch('loisirs_final', { credentials: 'include' })
      .then(response => response.json())
      .then(data => process4(data))
}

function process4(donnees){
return L.geoJson(donnees
);
}

// RESIDENTIEL

async function fetchLayer5(path5) {
  return fetch('residentiel_final', { credentials: 'include' })
      .then(response => response.json())
      .then(data => process5(data))
}

function process5(donnees){
return L.geoJson(donnees
);
}

// PUBLIC

async function fetchLayer6(path6) {
  return fetch('public_final', { credentials: 'include' })
      .then(response => response.json())
      .then(data => process6(data))
}

function process6(donnees){
return L.geoJson(donnees
);
}

// ECLAIRAGE

// async function fetchLayer7(path7) {
//   return fetch('eclairage_group_opti_reproj', { credentials: 'include' })
//       .then(response => response.json())
//       .then(data => process7(data))
// }

// function process7(donnees){
// return L.geoJson(donnees, {
//   style: features => ({
//     radius: 0.1,
//     opacity: 0,
//     fillColor: '#fbfaec',
//     fillOpacity: 1
//   }),
// })
// }

