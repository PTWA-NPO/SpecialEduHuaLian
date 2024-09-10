export function getAssets(url) {
   return new URL(`../assets/`+url, import.meta.url).href
}

export function getGameAssets(id,url) {
   return new URL(`../assets/Games/${id}/${url}`, import.meta.url).href
}

export function getSystemEffectAssets(url) {
   return new URL(`../assets/System/Effects/${url}`, import.meta.url).href
}

export function getSystemAssets(url, service) {
   return new URL(`../assets/System/${service}/${url}`, import.meta.url).href
}

export function getTheamsAssets(TheamName) {
   return new URL(`../theams/${TheamName}`, import.meta.url).href
}

export function getSlotComponentAssets(name,url) {
   return new URL(`../assets/SlotComponentData/${name}/${url}`, import.meta.url).href
}

// The following function are about to remove, please use the above functions instead.
export function GetAssetsFile(url) {
   return new URL(`../assets/`+url, import.meta.url).href
}

export function GamesGetAssetsFile(id,url) {
   return new URL(`../assets/Games/${id}/${url}`, import.meta.url).href
}

export function GetSystemEffectAssetsFile(url) {
   return new URL(`../assets/System/Effects/${url}`, import.meta.url).href
}

export function GetTheamsAssetsFile(TheamName) {
   return new URL(`../theams/${TheamName}`, import.meta.url).href
}

export function GetSlotComponentData(name,url) {
   return new URL(`../assets/SlotComponentData/${name}/${url}`, import.meta.url).href
}

