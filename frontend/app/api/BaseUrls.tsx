
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
}

export const STORAGE_URL =
  process.env.NEXT_PUBLIC_STORAGE_URL ;

  // console.log(BASE_URL);
  // console.log(STORAGE_URL)

export default BASE_URL;
