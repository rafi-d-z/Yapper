export function getItem(label, key, icon, onClick) {
  return {
    key,
    icon,
    label,
    onClick: onClick || undefined,
  };
}