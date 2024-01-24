const firstLetterToUpperCase = (text: string): string => {
  const capitalized = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  return capitalized
}

export {firstLetterToUpperCase};
