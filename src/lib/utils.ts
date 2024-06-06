import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { GlobalDataType } from "./types"
import Papa from "papaparse"
import Joi from "joi"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const schema = Joi.array().items(
  Joi.object({
    'Problem Name': Joi.string().required(),
    'Step Name': Joi.string().required(),
    'Outcome': Joi.string().valid('ERROR', 'OK').required(),
  })
);

export function parseData(readerResult: string | ArrayBuffer | null, delimiter: "\t" | "," | "|" = "\t"): GlobalDataType[] | null {
  const textStr = readerResult
  const results = Papa.parse(textStr as string, {
    header: true,
    delimiter: delimiter
  })
  const array: GlobalDataType[] = results.data as GlobalDataType[]
  const { error } = schema.validate(array);
  if (error){
    console.error(error)
    return null;
  }

  return array
}