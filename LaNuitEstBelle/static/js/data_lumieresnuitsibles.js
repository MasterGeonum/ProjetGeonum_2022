// A mapping of paths to layers. Not exported, so only visible within this module
const layer1 = {};
const layer2 = {};
const layer3 = {};
const layer4 = {};
const layer5 = {};

 // exported. this is the only part of the module visible from the outside.
export async function getLayer(path) {
    if (!layer1[path]) {
        // if we don't already have it do the fetch and add it to the mapping
        layer1[path] = await fetchLayer(path)};
    // return the layer for the given path from the mapping
    return layer1[path];
}

export async function getLayer2(path2) {
    if (!layer2[path2]) {
        // if we don't already have it do the fetch and add it to the mapping
        layer2[path2] = await fetchLayer2(path2)};
    // return the layer for the given path from the mapping
    return layer2[path2];
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

export async function getLayer5(path5, style) {
  console.log(style)
  if (!layer5[path5]) {
      // if we don't already have it do the fetch and add it to the mapping
      layer5[path5] = await fetchLayer5(path5, style)};
  // return the layer for the given path from the mapping
  return layer5[path5];
}

// "private" functions for fetching and processing data
// 1992

async function fetchLayer(path) {
    return fetch('pollution_1992', { credentials: 'include' })
        .then(response => response.json())
        .then(data => process1(data))
}

function process1(donnees){
  return L.geoJson(donnees
  );
}

// 2002

async function fetchLayer2(path2) {
  return fetch('pollution_2002', { credentials: 'include' })
      .then(response => response.json())
      .then(data => process2(data))
}

function process2(donnees){
  return L.geoJson(donnees
  );
}

// 2013

async function fetchLayer3(path3) {
  return fetch('pollution_2013', { credentials: 'include' })
      .then(response => response.json())
      .then(data => process3(data))
}

function process3(donnees){
return L.geoJson(donnees
);
}

// COMMUNES

async function fetchLayer4(path4) {
  return fetch('commune', { credentials: 'include' })
      .then(response => response.json())
      .then(data => process4(data))
}

function process4(donnees){
return L.geoJson(donnees
);
}

// DEPARTEMENTS

async function fetchLayer5(path5, style) {
  return fetch('departements', { credentials: 'include' })
      .then(response => response.json())
      .then(data => process5(data, style))
}

function process5(donnees, monstyle){
return L.geoJson(donnees, {style:monstyle}
);
}
