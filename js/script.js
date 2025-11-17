document.addEventListener('DOMContentLoaded', () => {
    const scheduleElement = document.getElementById('schedule');
    const searchInput = document.getElementById('searchInput');
    let talks = [];

    fetch('data/talks.json')
        .then(response => response.json())
        .then(data => {
            talks = data.talks;
            renderSchedule(talks);
        });

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredTalks = talks.filter(talk => 
            talk.category.some(cat => cat.toLowerCase().includes(searchTerm))
        );
        renderSchedule(filteredTalks);
    });

    function renderSchedule(talksToRender) {
        scheduleElement.innerHTML = '';
        let currentTime = new Date();
        currentTime.setHours(10, 0, 0, 0);

        const formatTime = (date) => {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        };

        talksToRender.forEach((talk, index) => {
            if (index === 3) { // Lunch break after the 3rd talk
                const breakItem = document.createElement('div');
                breakItem.className = 'schedule-item break';
                const breakEndTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
                breakItem.innerHTML = `<h2>Lunch Break</h2><div class="meta">${formatTime(currentTime)} - ${formatTime(breakEndTime)}</div>`;
                scheduleElement.appendChild(breakItem);
                currentTime = breakEndTime;
            }

            const talkItem = document.createElement('div');
            talkItem.className = 'schedule-item';

            const talkEndTime = new Date(currentTime.getTime() + talk.duration * 60 * 1000);

            talkItem.innerHTML = `
                <h2>${talk.title}</h2>
                <div class="meta">
                    <span>${formatTime(currentTime)} - ${formatTime(talkEndTime)}</span> | 
                    <span>Speakers: ${talk.speakers.join(', ')}</span>
                </div>
                <p>${talk.description}</p>
                <div>
                    ${talk.category.map(cat => `<span class="category">${cat}</span>`).join('')}
                </div>
            `;
            scheduleElement.appendChild(talkItem);

            // Add transition time
            currentTime = new Date(talkEndTime.getTime() + 10 * 60 * 1000);
        });
    }
});
