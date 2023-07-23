const IPv4Elem = document.getElementById('ipv4')
const IPv6Elem = document.getElementById('ipv6')

function parseData(inputStr) {
  const parsedObject = {}
  const lines = inputStr.split('\n')

  lines.forEach((line) => {
    const [key, value] = line.split('=')
    parsedObject[key] = value
  })

  return parsedObject
}

async function geo(ip) {
  try {
    const res = await fetch(`https://web-proxy.rmly.dev/ip-api/${ip}`)

    if (!res.ok) return null

    const json = await res.json()

    return json
  } catch (e) {
    console.log(e)
    return null
  }
}

async function request(type) {
  const url = type === 'IPv4' ? 'https://1.1.1.1/cdn-cgi/trace' : 'https://[2606:4700:4700::1111]/cdn-cgi/trace'

  try {
    const res = await fetch(url)

    if (!res.ok) return null

    const text = await res.text()
    const parseText = parseData(text)

    return parseText
  } catch (e) {
    console.log(e)
    return null
  }
}

async function get(type, elem) {
  const data = await request(type)

  if (!data) return (elem.innerText = `Your public ${type} address couldn't be detected.`)

  elem.innerHTML = `Your public ${type} address is <b>${data.ip}</b>`

  const geoloc = await geo(data.ip)

  if (!geoloc) return

  const country = geoloc?.country ?? 'N/A'
  const countryCode = geoloc?.countryCode ? geoloc.countryCode.toLowerCase() : 'N/A'
  const city = geoloc?.city ?? 'N/A'
  const region = geoloc?.regionName ?? 'N/A'
  const isp = geoloc?.isp ?? 'N/A'

  elem.innerHTML = `${elem.innerHTML} <br><b>Country</b>: <span class="fi fi-${countryCode}"></span> ${country} (${region}, ${city})<br><b>ISP</b>: ${isp}`
}

get('IPv4', IPv4Elem)
get('IPv6', IPv6Elem)
