import requests
import json

# Load skills from skills.json
with open('data/skills.json', 'r') as f:
    skills_data = json.load(f)

all_courses = {}

for profile in skills_data:
    for skill in profile['common_skills']:
        if skill not in all_courses:
            # Use Udemy's public API to get courses (no API key required)
            skill_query = requests.utils.quote(skill)
            api_url = f'https://www.udemy.com/api-2.0/courses/?search={skill_query}'
            response = requests.get(api_url)
            data = response.json()
            courses = []
            for course in data.get('results', []):
                course_info = {
                    'name': course['title'],
                    'link': course['url'],
                    'skill': skill
                }
                courses.append(course_info)
            all_courses[skill] = courses

# Save the courses data to a JSON file
with open('data/courses.json', 'w') as f:
    json.dump(all_courses, f, indent=2)

print("Courses data saved to 'data/courses.json'")
