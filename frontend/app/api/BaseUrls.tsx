const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL as string;

if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_BASE_URL is not defined");
}


// console.log(BASE_URL);

export default BASE_URL;