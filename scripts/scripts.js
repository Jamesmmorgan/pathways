// Get sessionId from the server
fetch('/api/get-session')
  .then(response => response.json())
  .then(data => {
    sessionId = data.sessionId;
    // Proceed with fetching skills and courses
  })
  .catch(error => console.error('Error fetching session ID:', error));

// Modify suggestNewCourses function
function suggestNewCourses() {
  const userSkills = JSON.parse(localStorage.getItem('userSkills')) || [];

  if (userSkills.length === 0) {
    return;
  }

  fetch('/api/get-course-suggestions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ skills: userSkills })
  })
    .then(response => response.json())
    .then(suggestions => {
      const courses = suggestions.courses;
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
