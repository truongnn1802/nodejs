function daysBetweenDates(date1, date2) {
    // Chuyển đổi các ngày về định dạng milliseconds từ 1/1/1970
    const oneDay = 1000 * 60 * 60 * 24; // Số milliseconds trong một ngày
    const time1 = date1.getTime();
    const time2 = date2.getTime();
  
    // Tính số ngày chênh lệch
    const difference = Math.abs(time1 - time2);
    const days = Math.ceil(difference / oneDay);
  
    return days;
  }
  
  export { daysBetweenDates };
  