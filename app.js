document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#search').addEventListener('click', function () {
        const input = document.querySelector('#input').value
        const resultsCount = parseInt(document.querySelector('input[name="resultsCount"]:checked').value) || 20
        findInfo(input, resultsCount)
    })
    document.querySelector('#input').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            const input = document.querySelector('#input').value
            const resultsCount = parseInt(document.querySelector('input[name="resultsCount"]:checked').value) || 20
            findInfo(input, resultsCount)
        }
    })
})

function findInfo(input, resultsCount = 20) {
    let resultsLength = 0
    const resultsContainer = document.querySelector('#divResult')
    let resultsHeader = document.querySelector('#results')
    resultsContainer.innerHTML = ''
    resultsHeader.innerHTML = ''

    const resultsPerPage = 20
    const maxPages = Math.ceil(resultsCount / resultsPerPage)
    let page = 1

    const fetchResults = (page) => {
        if (page > maxPages || resultsLength >= resultsCount) {
            return
        }
        fetch(`https://lrclib.net/api/search?q=${input}&page=${page}`, {
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
            if (data.length === 0) {
                return
            }
            data.forEach(element => {
                if (resultsLength >= resultsCount) {
                    return
                }
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
                    resultsLength++
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
                    resultsHeader.innerHTML = `Results: ${resultsLength}`
                    
                    resultsContainer.appendChild(div)
                }
            })
            // Fetch next page if there are more results
            fetchResults(page + 1)
        })
        .catch(error => {
            console.error('There has been a problem with your fetch operation:', error)
        })
    }

    fetchResults(page)
}