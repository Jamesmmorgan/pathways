import requests
import json

# Replace with your actual API key
api_key = 'Ro6tKGXY5Fx6McGqW9KKOpXUbvgJugvY'

# Load skills from skills.json
with open('data/skills.json', 'r') as f:
    skills_data = json.load(f)

all_courses = {}

# Step 1: Create a chat session with the course plugin
url_session = "https://api.on-demand.io/chat/v1/sessions"
headers = {
    'accept': 'application/json',
    'apikey': api_key,
    'content-type': 'application/json'
}
payload_session = {
    "externalUserId": "user_1",
    "pluginIds": ["plugin-1731243763"]
}

response_session = requests.post(url_session, headers=headers, data=json.dumps(payload_session))
session_data = response_session.json()

# Check for errors
if 'data' not in session_data:
    print(f"Error creating session: {session_data.get('message')}")
    exit(1)

session_id = session_data['data']['id']
print(f"Session ID: {session_id}")

url_query = f"https://api.on-demand.io/chat/v1/sessions/{session_id}/query"
headers_query = {
    'apikey': api_key,
    'Content-Type': 'application/json'
}

for profile in skills_data:
    for skill in profile['common_skills']:
        if skill not in all_courses:
            payload_courses = {
                "endpointId": "predefined-openai-gpt4o",
                "query": f"Find courses related to skill: {skill}.",
                "pluginIds": ["plugin-1731243763"],
                "responseMode": "sync"
            }

            response_courses = requests.post(url_query, headers=headers_query, data=json.dumps(payload_courses))
            courses_response = response_courses.json()

            # Check for errors
            if 'data' not in courses_response:
                print(f"Error fetching courses for {skill}: {courses_response.get('message')}")
                continue

            courses = courses_response['data'].get('courses', [])

            # Extract course information
            course_list = []
            for course in courses:
                course_info = {
                    'name': course.get('name'),
                    'link': course.get('link'),
                    'skill': skill
                }
                course_list.append(course_info)

            all_courses[skill] = course_list

# Save the courses data to a JSON file
with open('data/courses.json', 'w') as f:
    json.dump(all_courses, f, indent=2)

print("Courses data saved to 'data/courses.json'")
