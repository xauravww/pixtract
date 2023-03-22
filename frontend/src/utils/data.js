export const userQuery = (sub) => {
  const query = `*[_type == "user" && _id == '${sub}']`
  return query
}
