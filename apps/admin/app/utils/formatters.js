export const sanitizePhone = (phone) => phone ? `'${phone}` : "";

export const FAMOUS_COUNTRY_CODES = [
  "+91", "+1", "+44", "+971", "+966", "+974", "+968", "+965", "+973", "+92",
  "+880", "+977", "+94", "+65", "+60", "+61", "+64", "+49", "+33", "+39",
  "+34", "+27", "+20", "+55", "+52", "+81", "+82", "+86", "+7"
];

export const COUNTRY_CODE_REGEX = /^\+(91|1|44|971|966|974|968|965|973|92|880|977|94|65|60|61|64|49|33|39|34|27|20|55|52|81|82|86|7)/;

export const extractCountryCode = (phone) => {
  if (!phone) return '+91';
  const match = phone.match(COUNTRY_CODE_REGEX);
  return match ? match[0] : '+91';
};
