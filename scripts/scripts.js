// Fetch skills data and display profiles
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

// Function to suggest new courses
function suggestNewCourses() {
  const userSkills = JSON.parse(localStorage.getItem('userSkills')) || [];

  if (userSkills.length === 0) {
    return;
  }

  // Fetch courses related to user's skills
  fetch('data/courses.json')
    .then(response => response.json())
    .then(coursesData => {
      const suggestionsContainer = document.getElementById('suggested-courses');
      suggestionsContainer.innerHTML = '';

      userSkills.forEach(skill => {
        const courses = coursesData[skill];
        if (courses && courses.length > 0) {
          courses.forEach(course => {
            const courseItem = document.createElement('li');
            const courseLink = document.createElement('a');
            courseLink.href = course.link;
            courseLink.textContent = `${course.name} (Skill: ${course.skill})`;
            courseLink.target = '_blank';

            courseItem.appendChild(courseLink);
            suggestionsContainer.appendChild(courseItem);
          });
        }
      });
    });
}
