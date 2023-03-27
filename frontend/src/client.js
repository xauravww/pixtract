// this code will connect with sanity backend

import { createClient } from "@sanity/client"
import imageUrlBuilder from "@sanity/image-url"

export const client = createClient({
  projectId: process.env.REACT_APP_SANITY_PROJECT_ID,
  dataset: "productionpix",
  apiVersion: "2023-03-17",
  useCdn: true,
  token: process.env.REACT_APP_SANITY_TOKEN
})

//below code is already given in the sanity documentation

const builder = imageUrlBuilder(client)

export const urlFor = (source) => builder.image(source)
