import requests
import json

# Replace with your actual API key
api_key = 'Ro6tKGXY5Fx6McGqW9KKOpXUbvgJugvY'

# Step 1: Create a chat session with the plugins
url_session = "https://api.on-demand.io/chat/v1/sessions"
headers = {
    'accept': 'application/json',
    'apikey': api_key,
    'content-type': 'application/json'
}
payload_session = {
    "externalUserId": "user_1",
    "pluginIds": ["plugin-1718116202", "plugin-1717448083"]
}

response_session = requests.post(url_session, headers=headers, data=json.dumps(payload_session))
session_data = response_session.json()

# Check for errors
if 'data' not in session_data:
    print(f"Error creating session: {session_data.get('message')}")
    exit(1)

session_id = session_data['data']['id']
print(f"Session ID: {session_id}")

# Step 2: Get list of jobs that alumni do
url_query = f"https://api.on-demand.io/chat/v1/sessions/{session_id}/query"
headers_query = {
    'apikey': api_key,
    'Content-Type': 'application/json'
}

payload_jobs = {
    "endpointId": "predefined-openai-gpt4o",
    "query": "Provide a list of jobs that alumni are currently doing.",
    "pluginIds": ["plugin-1718116202"],
    "responseMode": "sync"
}

response_jobs = requests.post(url_query, headers=headers_query, data=json.dumps(payload_jobs))
jobs_response = response_jobs.json()

# Check for errors
if 'data' not in jobs_response:
    print(f"Error fetching jobs: {jobs_response.get('message')}")
    exit(1)

# Extract job titles from the response
jobs_list = jobs_response['data'].get('jobs')

if not jobs_list:
    print("No jobs found in the response.")
    exit(1)

# Step 3: For each job, get common skills
all_job_skills = []

for job in jobs_list:
    job_title = job['title']
    payload_skills = {
        "endpointId": "predefined-openai-gpt4o",
        "query": f"List common skills required for the job title: {job_title}.",
        "pluginIds": ["plugin-1717448083"],
        "responseMode": "sync"
    }

    response_skills = requests.post(url_query, headers=headers_query, data=json.dumps(payload_skills))
    skills_response = response_skills.json()

    # Check for errors
    if 'data' not in skills_response:
        print(f"Error fetching skills for {job_title}: {skills_response.get('message')}")
        continue

    skills = skills_response['data'].get('skills', [])

    all_job_skills.append({
        'job_title': job_title,
        'common_skills': skills
    })

# Step 4: Save the data to 'data/skills.json'
with open('data/skills.json', 'w') as f:
    json.dump(all_job_skills, f, indent=2)

print("Skills data saved to 'data/skills.json'")
