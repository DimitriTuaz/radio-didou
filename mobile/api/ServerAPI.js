export function getMetaData() {
    const url = 'https://radio-didou.com/now/get'
    return fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))
}