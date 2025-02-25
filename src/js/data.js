document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#search').addEventListener('click', function () {
        const input = document.querySelector('#input').value
        findInfo(input)
    })
    document.querySelector('#input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const input = document.querySelector('#input').value
            findInfo(input)
        }
    })

    const globalToggle = document.querySelector('#globalToggle')
    globalToggle.addEventListener('change', () => {
        // TODO: Implement toggle only for popup for now. 
    })
})

function findInfo(input) {
    const resultsContainer = document.querySelector('#divResult')
    let resultsHeader = document.querySelector('#results')
    resultsContainer.innerHTML = ''
    resultsHeader.innerHTML = ''

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
        resultsHeader.innerHTML = `Results for "${input}" (${data.length})`

        data.forEach(element => {
            const trackName = element.trackName
            const artistName = element.artistName
            const plainLyrics = element.plainLyrics
            const durationSEC = element.duration
            const minutes = Math.floor(durationSEC / 60)
            const seconds = durationSEC % 60
            const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`
            const trackID = element.id

            if (plainLyrics !== null) {
                const div = document.createElement('div')
                div.className = 'resultItem'
                div.dataset.plainLyrics = plainLyrics
                div.addEventListener('click', () => {
                    openSong(trackID)
                })

                const title = document.createElement('div')
                title.className = 'info'
                title.innerHTML = `<div>
                                       <p class="ID">${trackID}</p>
                                       <span class="divider"> - </span>
                                       <p class="duration">${formattedDuration}</p>
                                   </div>
                                   <h2 class="name">${trackName}</h2>
                                   ${trackName.includes(artistName) ? '' : `<h3 class="artist">${artistName}</h3>`}
                                   `
                div.appendChild(title)

                let hr = document.createElement('hr')
                div.appendChild(hr)
                
                let lyrics = document.createElement('p')
                lyrics.className = 'lyrics'
                lyrics.innerHTML = plainLyrics.split('\n').slice(0, 5).join('<br>') + '...'
                div.appendChild(lyrics)

                resultsContainer.appendChild(div)
            }
        })
        resultsHeader.innerHTML = `Results: ${validResultsCount}`
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error)
    })
}
