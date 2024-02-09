export function numberWithCommas(x) {
  return x.toFixed(2).split(".")[0].length > 3
    ? x
        .toFixed(2)
        .substring(0, x.toFixed(2).split(".")[0].length - 3)
        .replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
        "," +
        x.toFixed(2).substring(x.toFixed(2).split(".")[0].length - 3)
    : x.toFixed(2);
}

export function ConverFirstLatterToCapital(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getCookie(cookieName) {
  const name = cookieName + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();

    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null; // Return null if the cookie with the specified name is not found
}

export function setCookieWithMainDomain(name, value, mainDomain) {
  const date = new Date();
  date.setTime(date.getTime() + 1 * 60 * 1000);
  const expires = "expires=" + date.toUTCString();
  const domain = "domain=" + mainDomain; // Set the main domain
  const path = "path=/"; // Set the path to '/'

  document.cookie =
    name +
    "=" +
    value +
    "; " +
    expires +
    "; " +
    domain +
    "; " +
    path +
    "; secure";
}

export const calculateAge = (dob) => {
  const today = new Date();
  const dateOfBirth = new Date(dob);

  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  return age;
};
