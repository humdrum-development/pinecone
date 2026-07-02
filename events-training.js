(function initialize() {
  let allEvents = [];
  let currentPage = 0;
  const eventsPerPage = 2;
  let selectedEventId = null;

  const style = document.createElement('style');
  style.textContent = `
      .event_stack-content-wrap {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.6s ease, transform 0.6s ease;
      }
  
      .event_stack-content-wrap.visible {
          opacity: 1;
          transform: translateY(0);
      }
  
      #eventsContainer {
          display: flex;
          flex-direction: column;
          gap: 20px;
      }
  
      .recurring-info {
          color: #666;
          font-style: italic;
          margin-top: 4px;
      }
  
      #public_events_form, #not_public_events {
          display: none;
      }
  
      #public_events_form.active, #not_public_events.active {
          display: flex;
      }
  
      .event_entries-wrap {
          margin-top: 20px;
      }
      .remove-body-scroll {
        overflow: hidden;
      }
  `;
  document.head.appendChild(style);

  function disableScroll() {
    document.body.classList.add('remove-body-scroll');
  }

  function enableScroll() {
    document.body.classList.remove('remove-body-scroll');
  }

  function replaceUrlsWithAnchors(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, (url) => {
      // Add http:// if it's missing
      const urlWithProtocol = url.startsWith('http') ? url : `http://${url}`;
      return `<a href="${urlWithProtocol}" target="_blank">${url}</a>`;
    });
  }

  async function fetchEvents() {
    try {
      const response = await fetch('https://humdrum.app/api/1.1/wf/events-upcoming-events');
      const data = await response.json();


      if (data.status === 'success') {
        allEvents = processRecurringEvents(data.response.upcoming_events);
        renderEvents();
        updateLoadMoreButton();
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  }

  function processRecurringEvents(events) {
    const uniqueEvents = new Map();

    events.forEach(event => {
      if (event.recurring_text && !uniqueEvents.has(event.title)) {
        uniqueEvents.set(event.title, event);
      }
      else if (!event.recurring_text) {
        uniqueEvents.set(event.event_id, event);
      }
      if (event.is_public === "true") {
        event.location = 'Check the app for more details';
      }
    });

    return Array.from(uniqueEvents.values());
  }

  function renderEvents() {
    const startIndex = 0;
    const endIndex = (currentPage + 1) * eventsPerPage;
    const eventsToShow = allEvents.slice(startIndex, endIndex);

    const container = document.getElementById('eventsContainer');

    if (currentPage === 0) {
      container.innerHTML = '';
    }

    eventsToShow.slice(currentPage * eventsPerPage).forEach((event, index) => {
      const eventCard = document.createElement('div');
      eventCard.className = `event_stack-content-wrap ${event.is_public === "true" ? 'public-event' : 'private-event'}`;

      const imageUrl = event.event_image_url.startsWith('//')
        ? `https:${event.event_image_url}`
        : event.event_image_url;

      eventCard.innerHTML = `
              <div class="event_stack-content">
                  <h3 class="heading-style-h4 text-color-black text-style-allcaps">${event.title}</h3>
                  <div class="event_details-wrap">
                      <div class="event_date-time">
                          <div class="event_detail-wrap">
                              <img src="https://cdn.prod.website-files.com/667151bc2f4f40cc2c07842f/67341bf87caaed53c5fd816d_time%5B1%5D.svg" loading="lazy" alt="" class="event_icon">
                              <div class="text-size-large">
                                  <span class="text-weight-medium">Start:</span> 
                                  <span class="start_date">${event.start_date_time}</span>
                              </div>
                          </div>
                          <div class="event_detail-wrap">
                              <img src="https://cdn.prod.website-files.com/667151bc2f4f40cc2c07842f/67341bf87caaed53c5fd816d_time%5B1%5D.svg" loading="lazy" alt="" class="event_icon">
                              <div class="text-size-large">
                                  <span class="text-weight-medium">End:</span> 
                                  <span class="end_date">${event.end_date_time}</span>
                              </div>
                          </div>
                          ${event.recurring_text ? `
                              <div class="recurring-info">
                                  <img src="https://cdn.prod.website-files.com/667151bc2f4f40cc2c07842f/67341bf87caaed53c5fd816d_time%5B1%5D.svg" loading="lazy" alt="" class="event_icon">
                                  <span>${event.recurring_text}</span>
                              </div>
                          ` : ''}
                      </div>
                      <div class="event_detail-wrap">
                          <img src="https://cdn.prod.website-files.com/667151bc2f4f40cc2c07842f/67341d01c3243e10a47fdae0_user%5B1%5D.svg" loading="lazy" alt="" class="event_icon">
                          <div class="text-size-large">
                              <span class="text-weight-medium">Location:</span> 
                              <span class="location">${event.location || 'Location TBA'}</span>
                          </div>
                      </div>
                  </div>
                  <p class="text-size-large event_description">${replaceUrlsWithAnchors(event.description)}</p>
                  <a href="#" class="button_link w-inline-block" data-event-id="${event.event_id}">
                      <div class="button is-secondary">
                          <div>Interested?</div>
                      </div>
                  </a>
                  <a href="/free-activity-waiver" target="_blank" class="text-size-small" style="margin-top: 8px; display: inline-block;">Free Activity Waiver</a>
              </div>
              <div class="event_image-wrap" style="background-image: url('${imageUrl}')"></div>
          `;

      container.appendChild(eventCard);

      // Add click handler for both public and private events
      const actionButton = eventCard.querySelector('.button_link');
      actionButton.addEventListener('click', (e) => {
        e.preventDefault();
        selectedEventId = event.event_id;

        // Hide both containers first
        hideAllForms();

        // Show appropriate container based on event type
        if (event.is_public === "true") {
          showRegistrationForm();
        } else {
          showNotPublicEvents();
        }
      });

      setTimeout(() => {
        eventCard.classList.add('visible');
      }, index * 200);
    });
  }

  function hideAllForms() {
    document.getElementById('public_events_form').classList.remove('active');
    document.getElementById('not_public_events').classList.remove('active');
    enableScroll();
  }

  function showRegistrationForm() {
    const formContainer = document.getElementById('public_events_form');
    formContainer.classList.add('active');
    formContainer.scrollIntoView({ behavior: 'smooth' });
    disableScroll();
  }

  function showNotPublicEvents() {
    const notPublicContainer = document.getElementById('not_public_events');
    notPublicContainer.classList.add('active');
    notPublicContainer.scrollIntoView({ behavior: 'smooth' });
    disableScroll();
  }

  function updateLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const hasMoreEvents = (currentPage + 1) * eventsPerPage < allEvents.length;

    if (hasMoreEvents) {
      loadMoreBtn.style.display = 'inline-block';
    } else {
      loadMoreBtn.style.display = 'none';
    }
  }

  function loadMore() {
    currentPage++;
    renderEvents();
    updateLoadMoreButton();
  }

  // Form submission handler
  document.getElementById('email-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!selectedEventId) {
      console.error('No event selected');
      return;
    }

    const formData = new FormData();
    formData.append('email', document.getElementById('email').value);
    formData.append('first_name', document.getElementById('name').value);
    formData.append('last_name', document.getElementById('name-2').value);
    formData.append('event_id', selectedEventId);
    formData.append('source', 'events_signup');

    try {

      const response = await fetch('https://humdrum.app/api/1.1/wf/events-upcoming-events', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      console.log(data)

      if (data.status === 'success') {
        document.querySelector('.w-form-done').style.display = 'block';
        document.querySelector('.w-form-fail').style.display = 'none';

        setTimeout(() => {
          document.getElementById('email-form').reset();
          hideAllForms();
          document.querySelector('.w-form-done').style.display = 'none';
        }, 3000);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      document.querySelector('.w-form-done').style.display = 'none';
      document.querySelector('.w-form-fail').style.display = 'block';
    }
  });

  fetchEvents();
  document.getElementById('loadMoreBtn').addEventListener('click', loadMore);
  document.getElementById('private-cross').addEventListener('click', hideAllForms);
  document.getElementById('private-cross-reg').addEventListener('click', hideAllForms);
  document.getElementById('not_public_events').addEventListener('click', hideAllForms);
  document.getElementById('public_events_form').addEventListener('click', hideAllForms);
})();