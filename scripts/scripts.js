// Initialize API key and session ID (Do not expose API key in client-side code)
const apiKey = 'Ro6tKGXY5Fx6McGqW9KKOpXUbvgJugvY';  // Securely store this in server-side code
let sessionId = '';  // Will be obtained from server-side

// Fetch skills data and display profiles (Modify to fetch dynamically if needed)
fetch('data/skills.json')
  .then(response => response.json())
  .then(skillsData => {
    fetch('data/courses.json')
      .then(response => response.json())
      .then(coursesData => {
        const profilesContainer = document.getElementById('profiles-container');

        skillsData.forEach(profile => {
          const profileSection = document.createElement('div');
          profileSection.className = 'profile';

          const jobTitle = document.createElement('h2');
          jobTitle.textContent = profile.job_title;
          profileSection.appendChild(jobTitle);

          profile.common_skills.forEach(skill => {
            const skillHeading = document.createElement('h3');
            skillHeading.textContent = `Skill: ${skill}`;
            profileSection.appendChild(skillHeading);

            const courses = coursesData[skill];
            if (courses && courses.length > 0) {
              const coursesList = document.createElement('ul');

              courses.forEach(course => {
                const courseItem = document.createElement('li');
                const courseLink = document.createElement('a');
                courseLink.href = course.link;
                courseLink.textContent = `${course.name} (Skill: ${course.skill})`;
                courseLink.target = '_blank';

                // Add click event to update user's skills
                courseLink.addEventListener('click', () => {
                  updateUserSkills(course.skill);
                });

                courseItem.appendChild(courseLink);
                coursesList.appendChild(courseItem);
              });

              profileSection.appendChild(coursesList);
            }
          });

          profilesContainer.appendChild(profileSection);
        });

        // Suggest new courses based on user's skills
        suggestNewCourses();
      });
  });

// Function to update user skills
function updateUserSkills(skill) {
  // For simplicity, store user skills in localStorage
  let userSkills = JSON.parse(localStorage.getItem('userSkills')) || [];
  if (!userSkills.includes(skill)) {
    userSkills.push(skill);
    localStorage.setItem('userSkills', JSON.stringify(userSkills));
    // After updating skills, suggest new courses
    suggestNewCourses();
  }
}

// Function to suggest new courses using plugin-1731243763
function suggestNewCourses() {
  const userSkills = JSON.parse(localStorage.getItem('userSkills')) || [];

  if (userSkills.length === 0) {
    return;
  }

  // Prepare the request payload
  const payload = {
    "endpointId": "predefined-openai-gpt4o",
    "query": `Suggest courses for the following skills: ${userSkills.join(', ')}.`,
    "pluginIds": ["plugin-1731243763"],
    "responseMode": "sync"
  };

  fetch(`https://api.on-demand.io/chat/v1/sessions/${sessionId}/query`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': apiKey
    },
    body: JSON.stringify(payload)
  })
    .then(response => response.json())
    .then(suggestions => {
      // Handle the suggestions response
      const courses = suggestions.data.courses; // Adjust based on actual response structure
      const suggestionsContainer = document.getElementById('suggested-courses');
      suggestionsContainer.innerHTML = '';

      courses.forEach(course => {
        const courseItem = document.createElement('li');
        const courseLink = document.createElement('a');
        courseLink.href = course.link;
        courseLink.textContent = `${course.name} (Skill: ${course.skill})`;
        courseLink.target = '_blank';

        courseItem.appendChild(courseLink);
        suggestionsContainer.appendChild(courseItem);
      });
    })
    .catch(error => {
      console.error('Error fetching course suggestions:', error);
    });
}
