// Joins class names and skips falsy values: cn('a', isOn && 'b') -> 'a b'.
export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}
