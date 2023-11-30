// functions here are used throughout many components, therefore, it is best to store it here and import to other files to reduce code

export function getItem(label, key, icon, children) {
    return {
      key,
      icon,
      children,
      label,
    };
}