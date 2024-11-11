import requests
import json

# URL to fetch random jobs (public API)
jobs_api_url = 'https://rd-data-api.herokuapp.com/job_titles'

# Fetch list of random job titles
response_jobs = requests.get(jobs_api_url)
jobs_list = response_jobs.json()

# For demonstration, limit to 5 jobs
jobs_list = jobs_list[:5]

# Using O*NET Web Services to get skills for jobs (public API)
# O*NET requires registration for an API key: https://services.onetcenter.org/

# Since we want the script to run without needing an API key, we'll use sample data

# Sample skills data for demonstration purposes
sample_skills = {
    "Software Engineer": ["Programming", "Algorithms", "Data Structures"],
    "Data Scientist": ["Statistics", "Machine Learning", "Data Analysis"],
    "Project Manager": ["Leadership", "Communication", "Time Management"],
    "Graphic Designer": ["Creativity", "Adobe Photoshop", "Illustration"],
    "Marketing Specialist": ["SEO", "Content Creation", "Social Media"],
}

all_job_skills = []

for job in jobs_list:
    job_title = job['job_title']
    # Use sample skills if available, else assign generic skills
    skills = sample_skills.get(job_title, ["Skill A", "Skill B", "Skill C"])
    all_job_skills.append({
        'job_title': job_title,
        'common_skills': skills
    })

# Save the data to 'data/skills.json'
with open('data/skills.json', 'w') as f:
    json.dump(all_job_skills, f, indent=2)

print("Skills data saved to 'data/skills.json'")
