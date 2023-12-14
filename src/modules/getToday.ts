const getToday = (): string => {
  const date = new Date();

  const year_yyyy: string = date.getFullYear().toString();
  const month_mm: string = ("0" + (date.getMonth() + 1)).slice(-2);
  const day_dd: string = ("0" + date.getDate()).slice(-2);

  const today: string = year_yyyy + '-' + month_mm + '-' + day_dd;
  return today;
}

export {getToday};
