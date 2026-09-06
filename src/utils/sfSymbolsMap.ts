// Comprehensive mapping from web icon class names, keywords, and SVG hints to Apple SF Symbols

const KEYWORD_TO_SF_SYMBOL: Record<string, string> = {
  // Navigation & Actions
  search: "magnifyingglass",
  find: "magnifyingglass",
  home: "house.fill",
  settings: "gearshape.fill",
  gear: "gearshape.fill",
  cog: "gearshape.fill",
  menu: "line.3.horizontal",
  bars: "line.3.horizontal",
  close: "xmark",
  times: "xmark",
  x: "xmark",
  check: "checkmark",
  checkmark: "checkmark",
  done: "checkmark.circle.fill",
  success: "checkmark.circle.fill",
  plus: "plus",
  add: "plus.circle.fill",
  minus: "minus",
  remove: "minus.circle.fill",
  trash: "trash.fill",
  delete: "trash.fill",
  edit: "pencil",
  pencil: "pencil",
  share: "square.and.arrow.up",
  download: "arrow.down.circle.fill",
  upload: "arrow.up.circle.fill",
  refresh: "arrow.clockwise",
  sync: "arrow.triangle.2.circlepath",
  filter: "line.3.horizontal.decrease.circle",
  sort: "arrow.up.arrow.down",

  // Communication & Users
  mail: "envelope.fill",
  email: "envelope.fill",
  envelope: "envelope.fill",
  message: "message.fill",
  chat: "bubble.left.and.bubble.right.fill",
  comment: "bubble.left.fill",
  user: "person.fill",
  users: "person.2.fill",
  profile: "person.crop.circle.fill",
  avatar: "person.crop.circle",
  account: "person.circle",
  phone: "phone.fill",
  call: "phone.fill",
  bell: "bell.fill",
  notification: "bell.badge.fill",

  // Security & Privacy
  lock: "lock.fill",
  unlock: "lock.open.fill",
  key: "key.fill",
  shield: "shield.fill",
  security: "shield.checkered",
  eye: "eye.fill",
  "eye-slash": "eye.slash.fill",
  "eye-off": "eye.slash.fill",

  // Media & Devices
  camera: "camera.fill",
  photo: "photo.fill",
  image: "photo",
  video: "video.fill",
  play: "play.fill",
  pause: "pause.fill",
  music: "music.note",
  volume: "speaker.wave.2.fill",
  mute: "speaker.slash.fill",
  mic: "mic.fill",
  microphone: "mic.fill",
  laptop: "laptopcomputer",
  computer: "desktopcomputer",
  mobile: "iphone",
  phone_device: "iphone",

  // Commerce & Rating
  heart: "heart.fill",
  like: "heart.fill",
  favorite: "star.fill",
  star: "star.fill",
  bookmark: "bookmark.fill",
  tag: "tag.fill",
  price: "tag.fill",
  cart: "cart.fill",
  shopping: "bag.fill",
  bag: "bag.fill",
  creditcard: "creditcard.fill",
  card: "creditcard.fill",
  wallet: "wallet.pass.fill",
  dollar: "dollarsign.circle.fill",
  money: "banknote.fill",

  // Dates & Locations
  calendar: "calendar",
  date: "calendar",
  clock: "clock.fill",
  time: "clock.fill",
  timer: "timer",
  map: "map.fill",
  pin: "mappin.and.ellipse",
  location: "location.fill",
  globe: "globe",
  compass: "safari.fill",

  // Status & System
  info: "info.circle.fill",
  help: "questionmark.circle.fill",
  question: "questionmark.circle.fill",
  warning: "exclamationmark.triangle.fill",
  alert: "exclamationmark.circle.fill",
  error: "xmark.octagon.fill",
  cloud: "cloud.fill",
  wifi: "wifi",
  battery: "battery.100",
  sun: "sun.max.fill",
  moon: "moon.stars.fill",
  sparkles: "sparkles",
  zap: "bolt.fill",
  lightning: "bolt.fill",
  fire: "flame.fill",
  folder: "folder.fill",
  file: "doc.fill",
  link: "link",
  external: "arrow.up.right.square",
};

export function findSFSymbolForElement(el: Element): string | null {
  // Check direct data-sf-symbol or data-icon attribute
  const explicit = el.getAttribute("data-sf-symbol") || el.getAttribute("data-icon");
  if (explicit) return explicit;

  // Check class names (e.g., "fa fa-envelope", "bi-gear", "lucide-search", "icon-heart")
  const classList = Array.from(el.classList).join(" ").toLowerCase();
  
  // Try pattern matching classes like fa-search, bi-search, icon-search
  const matchedKeyword = classList.match(/(?:fa|bi|lucide|icon|ri|feather)-([a-z0-9-]+)/);
  if (matchedKeyword && matchedKeyword[1]) {
    const rawKey = matchedKeyword[1];
    if (KEYWORD_TO_SF_SYMBOL[rawKey]) {
      return KEYWORD_TO_SF_SYMBOL[rawKey];
    }
  }

  // Scan class list words
  for (const [key, sfSymbol] of Object.entries(KEYWORD_TO_SF_SYMBOL)) {
    if (classList.includes(key)) {
      return sfSymbol;
    }
  }

  // If <i>, <em>, or <svg> has text content or title/aria-label
  const aria = (el.getAttribute("aria-label") || el.getAttribute("title") || "").toLowerCase();
  for (const [key, sfSymbol] of Object.entries(KEYWORD_TO_SF_SYMBOL)) {
    if (aria.includes(key)) {
      return sfSymbol;
    }
  }

  return null;
}
