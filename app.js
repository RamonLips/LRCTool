document.addEventListener('DOMContentLoaded', function () {
    const input = document.querySelector('#input').value
    document.querySelector('#search').addEventListener('click', findInfo(input))
    document.querySelector('#input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            findInfo(input)
        }
    })
})

function findInfo(input) {
    const resultsContainer = document.querySelector('#divResult')
    let resultsHeader = document.querySelector('#results')

    fetch(`https://lrclib.net/api/search?q=${input}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then(response => {
        if (response.ok) {
            return response.json()
        } else {
            console.error('Network response was not ok.')
        }
    })
    .then(data => {
        resultsHeader.innerHTML = `Results: ${data.length}`

        data.forEach(element => {
            // console.log(element)
            const trackName = element.trackName
            const artistName = element.artistName
            const plainLyrics = element.plainLyrics
            const syncedLyrics = element.syncedLyrics
            const durationSEC = element.duration
            const minutes = Math.floor(durationSEC / 60)
            const seconds = durationSEC % 60
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`
            const trackID = element.id

            if (plainLyrics !== null && syncedLyrics !== null) {
                const div = document.createElement('div')
                div.className = 'resultItem'

                const title = document.createElement('h2')
                if (!trackName.includes(artistName)) {
                    title.innerHTML = `<span>${trackID}</span> - ${trackName} - ${artistName} - ${formattedDuration}`
                }
                else {
                    title.innerHTML = `<span>${trackID}</span> - ${trackName} - ${formattedDuration}`
                }
                div.appendChild(title)
                
                let lyrics = document.createElement('p')
                lyrics.innerHTML = plainLyrics.replace(/\n/g, '<br>')
                div.appendChild(lyrics)

                const toggleSwitch = document.createElement('label')
                toggleSwitch.className = 'switch'
                const input = document.createElement('input')
                input.type = 'checkbox'
                const span = document.createElement('span')
                span.className = 'slider round'
                toggleSwitch.appendChild(input)
                toggleSwitch.appendChild(span)
                div.appendChild(toggleSwitch)

                input.addEventListener('change', () => {
                    if (input.checked) {
                        lyrics.innerHTML = syncedLyrics.replace(/\n/g, '<br>')
                    } else {
                        lyrics.innerHTML = plainLyrics.replace(/\n/g, '<br>')
                    }
                })

                const copyButton = document.createElement('button')
                copyButton.textContent = 'Copy Lyrics'
                copyButton.addEventListener('click', () => {
                    const textToCopy = input.checked ? syncedLyrics : plainLyrics
                    navigator.clipboard.writeText(textToCopy)
                })
                div.appendChild(copyButton)

                resultsContainer.appendChild(div)
            }
        })
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error)
    })
}